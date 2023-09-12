import {Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges} from '@angular/core';
import {Validators} from '@angular/forms';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NgxSpinnerService} from 'ngx-spinner';
import {MESSAGE} from 'src/app/constants/message';
import {FileDinhKem} from 'src/app/models/FileDinhKem';
import {
  HopDongXuatHangService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/hop-dong/hopDongXuatHang.service';
import dayjs from 'dayjs';
import {Base2Component} from 'src/app/components/base2/base2.component';
import {HttpClient} from '@angular/common/http';
import {StorageService} from 'src/app/services/storage.service';
import {
  QdPdKetQuaBanDauGiaService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/tochuc-trienkhai/qdPdKetQuaBanDauGia.service';
import {
  DialogTableSelectionComponent
} from 'src/app/components/dialog/dialog-table-selection/dialog-table-selection.component';
import {
  ThongTinDauGiaService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/tochuc-trienkhai/thongTinDauGia.service';
import {chain, cloneDeep,isEmpty} from 'lodash';
import {DanhMucService} from 'src/app/services/danhmuc.service';
import {convertTienTobangChu} from 'src/app/shared/commonFunction';
import * as uuid from "uuid";
import {STATUS} from 'src/app/constants/status';
import {DonviService} from "../../../../../../services/donvi.service";
import moment from "moment";


@Component({
  selector: 'app-thong-tin',
  templateUrl: './thong-tin.component.html',
  styleUrls: ['./thong-tin.component.scss']
})

export class ThongTinComponent extends Base2Component implements OnInit, OnChanges {
  @Input() id: number;
  @Input() loaiVthh: string;
  @Input() idKqBdg: number;
  @Input() isQuanLy: boolean;
  @Input() isViewOnModal: boolean;
  @Output()
  showListEvent = new EventEmitter<any>();
  @Output()
  sendListAllDviTsan = new EventEmitter<any>();
  @Input() isView: boolean;
  listLoaiHopDong: any[] = [];
  listDviTsan: any[] = [];
  listAllDviTsan: any[] = [];
  listDviTsanFilter: any[] = [];
  listDviLquan: any[] = [];
  dataTablePhuLuc: any[] = [];
  isViewPhuLuc: boolean = false;
  idPhuLuc: number = 0;
  objHopDongHdr: any = {};
  maHopDongSuffix: string = '';
  expandSetString = new Set<string>();
  listMaDvts = [];
  listHdDaKy = [];
  listHangHoaAll: any[] = [];
  listLoaiHangHoa: any[] = [];
  listToChucTrungDg: any[] = [];
  listLoaiHinhNx: any[] = [];
  listKieuNx: any[] = [];
  tongSoLuong: number;
  tongThanhTien: number;
  dsDonvi: any[] = [];
  previewName: string = "Thông tin hợp đồng bán";
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private hopDongXuatHangService: HopDongXuatHangService,
    private qdPdKetQuaBanDauGiaService: QdPdKetQuaBanDauGiaService,
    private thongTinDauGiaService: ThongTinDauGiaService,
    private danhMucService: DanhMucService,
    private donViService: DonviService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, hopDongXuatHangService);
    this.formData = this.fb.group(
      {
        id: [],
        nam: [dayjs().get('year')],
        soQdKq: [null, [Validators.required]],
        ngayKyQdKq: [null,],
        soQdPd: [null, [Validators.required]],
        maDviTsan: [],
        tgianNkho: [],

        soHd: [null, [Validators.required]],
        tenHd: [null, [Validators.required]],
        ngayHluc: [null, [Validators.required]],
        ghiChuNgayHluc: [],

        loaiHdong: [null, [Validators.required]],
        ghiChuLoaiHdong: [],

        tgianThienHd: [null, [Validators.required]],
        tgianBhanh: [],

        maDvi: [],
        tenDvi: [],
        diaChi: [null, [Validators.required]],
        mst: [null, [Validators.required]],
        tenNguoiDdien: [null, [Validators.required]],
        chucVu: [null, [Validators.required]],
        sdt: [null, [Validators.required]],
        stk: [null, [Validators.required]],
        fax: [null, [Validators.required]],
        moTai: [null, [Validators.required]],
        uyQuyen: [],

        tenNhaThau: [''],
        diaChiNhaThau: [],
        mstNhaThau: [],
        tenNguoiDdienNhaThau: [],
        chucVuNhaThau: [''],
        sdtNhaThau: [''],
        stkNhaThau: [null, [Validators.required]],
        faxNhaThau: [''],
        moTaiNhaThau: [null, [Validators.required]],

        loaiVthh: [''],
        cloaiVthh: [''],
        moTaHangHoa: [''],
        donViTinh: [''],
        dviTinh: [''],
        soLuong: [''],
        tongTien: [''],
        ghiChu: [null, [Validators.required]],
        gtriHdSauVat: [''],
        tenCloaiVthh: [''],
        tenLoaiVthh: [''],
        trangThai: ['00'],
        tenTrangThai: ['Dự thảo'],
        fileDinhKems: [new Array<FileDinhKem>()],
        canCu: [new Array<FileDinhKem>()],
        listMaDviTsan: [null, [Validators.required]],
        toChucTrungDg: [null, [Validators.required]],
        loaiHinhNx: [''],
        kieuNhapXuat: [''],
      }
    );
  }

  async ngOnInit() {
    this.maHopDongSuffix = `/${this.formData.value.nam}/HĐMB`;
    await Promise.all([
      this.loadDataComboBox(),
      this.loadDsVthh(),
      this.loadDsDonVi()

    ]);
    if (this.idKqBdg) {
      await this.onChangeKqBdg(this.idKqBdg);
    }
    if (this.id) {
      await this.loadChiTiet(this.id);
    } else {
      this.initForm();
    }
  }

  initForm() {
    this.formData.patchValue({
      maDvi: this.userInfo.MA_DVI ?? null,
      tenDvi: this.userInfo.TEN_DVI ?? null,
      diaChi: this.userInfo.DON_VI.diaChi ?? null,
    })
  }

  async loadDataComboBox() {
    // hợp đồng
    this.listLoaiHopDong = [];
    let resHd = await this.danhMucService.danhMucChungGetAll('LOAI_HDONG');
    if (resHd.msg == MESSAGE.SUCCESS) {
      this.listLoaiHopDong = resHd.data;
    }
    let resNx = await this.danhMucService.danhMucChungGetAll('LOAI_HINH_NHAP_XUAT');
    if (resNx.msg == MESSAGE.SUCCESS) {
      this.listLoaiHinhNx = resNx.data.filter(item => item.apDung == 'XUAT_DG');
    }
    let resKieuNx = await this.danhMucService.danhMucChungGetAll('KIEU_NHAP_XUAT');
    if (resKieuNx.msg == MESSAGE.SUCCESS) {
      this.listKieuNx = resKieuNx.data
    }
    this.spinner.hide();
  }

  async loadChiTiet(id) {
    let data = await this.detail(id);
    this.formData.patchValue({
      soHd: data?.soHd?.split('/')[0],
      soLuong:data?.soLuong,
      tongTien:data?.tongTien,
    });
    this.maDviTsan(data.toChucTrungDg, data.trangThai);
    this.dataTable = cloneDeep(data?.children || []);
    this.dataTable.forEach(e => e.tenChiCuc = e.tenDvi);
    console.log(data,'this.data')
    console.log(this.dataTable,'this.dataTable')
    this.dataTablePhuLuc = data?.phuLuc || [];
    this.objHopDongHdr = data || {};

  }

  async loadDsDonVi() {
    const dsTong = await this.donViService.layDonViCon();
    if (!isEmpty(dsTong)) {
      this.dsDonvi = dsTong.data.filter(s => s.type === 'DV');
    }
  }

  async saveAndSend(status: string, message: string, sucessMessage: string) {
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      await this.spinner.hide();
      return;
    }
    let body = cloneDeep(this.formData.value);
    if (body.listMaDviTsan) {
      body.maDviTsan = body.listMaDviTsan.join(',');
    }
    if (body.soHd) {
      body.soHd = this.formData.value.soHd + this.maHopDongSuffix;
    }
    body.children = this.dataTable;
    if (body.id > 0) {
      if (body) {
        await this.approve(body.id, status, message, null, sucessMessage);
      } else {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
    } else {
      let data = await this.createUpdate(body);
      if (data) {
        await this.approve(data.id, status, message, null, sucessMessage);
      } else {
        this.notification.error(MESSAGE.ERROR, MESSAGE.FORM_REQUIRED_ERROR);
      }
    }

  }


  async save() {
    try {
      this.formData.disable();
      this.formData.controls["soQdKq"].enable();
      this.formData.controls["soQdKq"].markAsDirty();
      this.formData.controls["soHd"].enable();
      this.formData.controls["soHd"].markAsDirty();
      if (this.formData.invalid) {
        return;
      }
      this.formData.enable();
      let body = this.formData.value;
      if (body.listMaDviTsan) {
        body.maDviTsan = body.listMaDviTsan.join(',');
      }
      if (body.soHd) {
        body.soHd = this.formData.value.soHd + this.maHopDongSuffix;
      }
      body.children = this.dataTable;
      this.formData.disable();
      let rs = await this.createUpdate(body);
      this.formData.enable();
    } catch (e) {
    } finally {
      this.formData.enable();
    }
  }


  redirectPhuLuc(id) {
    this.isViewPhuLuc = true;
    this.idPhuLuc = id;
  }

  delete(item: any, roles?) {
    if (!this.checkPermission(roles)) {
      return
    }
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn xóa?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: () => {
        this.spinner.show();
        try {
          let body = {
            id: item.id
          };
          this.hopDongXuatHangService.delete(body).then(async () => {
            this.loadChiTiet(item.idHd)
            this.spinner.hide();
          });
        } catch (e) {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      },
    });
  }

  showChiTiet() {
    this.isViewPhuLuc = false;
    this.loadChiTiet(this.id);
  }

  async openDialogKqBdg() {
    await this.spinner.show()
    let listQdKq: any[] = [];
    let body = {
      loaiVthh: this.loaiVthh,
      nam: this.formData.value.nam,
      maDvi: this.userInfo.MA_DVI,
      trangThai: STATUS.BAN_HANH
    };
    let res = await this.qdPdKetQuaBanDauGiaService.search(body)
    if (res.data) {
      listQdKq = res.data?.content;
    }
    await this.spinner.hide();
    const modalQD = this.modal.create({
      nzTitle: 'Thông tin Quyết định phê duyệt kết quả bán đấu giá',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataHeader: ['Số QĐ PDKQ BĐG', 'Số biên bản', 'Mã thông báo'],
        dataColumn: ['soQdKq', 'soBienBan', 'maThongBao'],
        dataTable: listQdKq
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        this.onChangeKqBdg(data.id);
      }
    });
  }

  async loadDsVthh() {
    let res = await this.danhMucService.getDanhMucHangDvqlAsyn({});
    if (res.msg == MESSAGE.SUCCESS) {
      this.listHangHoaAll = res.data;
      this.listLoaiHangHoa = res.data?.filter((x) => x.ma.length == 4);
    }
  }

  async onChangeKqBdg(id) {
    if (id > 0) {
      await this.qdPdKetQuaBanDauGiaService.getDetail(id)
        .then(async (resKq) => {
          const dataKq = resKq.data;
          let resTtin = await this.thongTinDauGiaService.getDetail(dataKq.maThongBao?.split('/')[0]);
          if (resKq.data) {
            const dataThongTin = resTtin.data;
            await this.loadDsHd(dataKq.soQdKq)
            await this.setListDviTsan(dataThongTin.children);
            const ngayHluc = moment(dataKq.ngayHluc);
            const tgianGnhan = moment.duration(dataKq.tgianGnhan, 'days');
            const nhapKho = ngayHluc.add(tgianGnhan);
            this.formData.patchValue({
              soQdKq: dataKq.soQdKq,
              ngayKyQdKq: dataKq.ngayKy,
              soQdPd: dataThongTin.soQdPd,
              loaiVthh: dataThongTin.loaiVthh,
              tenLoaiVthh: dataThongTin.tenLoaiVthh,
              cloaiVthh: dataThongTin.cloaiVthh,
              tenCloaiVthh: dataThongTin.tenCloaiVthh,
              moTaHangHoa: dataThongTin.moTaHangHoa,
              loaiHinhNx: dataKq.loaiHinhNx,
              kieuNhapXuat: dataKq.kieuNx,
              tgianNkho: nhapKho.format('YYYY-MM-DD'),
            });
            this.listDviLquan = dataThongTin.listNguoiTgia;
            this.listToChucTrungDg = dataThongTin.children.flatMap(child =>
              child.children.map(grandchild => grandchild.toChucCaNhan)
            );
            this.listToChucTrungDg = [...new Set(this.listToChucTrungDg.filter(val => val !== null))];
            this.listToChucTrungDg = this.listToChucTrungDg.map(name => ({name}))
            this.formData.patchValue({donViTinh: this.listHangHoaAll.find(s => s.ma == dataThongTin.loaiVthh)?.maDviTinh})
          }
        })
    }
  }


  setListDviTsan(inputTable) {
    this.listDviTsan = [];
    inputTable.forEach((item) => {
      item.children.forEach(element => {
        element.maChiCuc = item.maDvi
        element.tenChiCuc = item.tenDvi
        element.diaChi = item.diaChi
        element.donGiaVat = element.donGiaTraGia
      });
      let dataGroup = chain(item.children).groupBy('maDviTsan').map((value, key) => ({
        maDviTsan: key,
        children: value
      })).value();
      item.dataDviTsan = dataGroup;
      item.dataDviTsan.forEach(x => {
        x.soLanTraGia = x.children[0].soLanTraGia
        x.donGiaTraGia = x.children[0].donGiaTraGia
        x.toChucCaNhan = x.children[0].toChucCaNhan
        x.tenDvi = item.tenDvi
        x.maDvi = item.maDvi
        if (x.soLanTraGia) {
          this.listDviTsan = [...this.listDviTsan, x];
        }
      })
    })
    this.listAllDviTsan = this.listDviTsan;
    this.sendListAllDviTsan.emit(this.listAllDviTsan);
    this.listDviTsan = this.listDviTsan.filter(s => !this.listHdDaKy.some(s1 => {
        return s1.maDviTsan.split(',').includes(s.maDviTsan) && s1.toChucTrungDg.includes(s.toChucCaNhan);
      })
    );


  }

  maDviTsan(event, trangThai?) {
    if (!this.formData.value.id) {
      this.formData.patchValue({
        listMaDviTsan: [],
      })
    }
    if (event && trangThai == STATUS.DA_KY) {
      this.listDviTsanFilter = this.listAllDviTsan.filter(obj => obj.toChucCaNhan === event);
    } else {
      this.listDviTsanFilter = this.listDviTsan.filter(obj => obj.toChucCaNhan === event);
    }
    let thongTin = this.listDviLquan.find(f => f.hoVaTen === event);
    if (thongTin) {
      this.formData.patchValue({
        tenNhaThau: thongTin.hoVaTen,
        diaChiNhaThau: thongTin.diaChi,
        mstNhaThau: thongTin.soCccd
      })
    }
  }

  async loadDsHd(event) {
    let body = {
      soQdKq: event,
      trangThai: STATUS.DA_KY,
      loaiVthh: this.loaiVthh,
    }
    let res = await this.hopDongXuatHangService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.listHdDaKy = data.content;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  isDisabled() {
    return false;
  }


  async selectMaDviTsan(event) {
    let selectDviTsan = this.formData.value.listMaDviTsan;
    this.listDviTsan.forEach(s => s.disable = false);
    if (selectDviTsan && selectDviTsan.length > 0) {
      let listAll = this.listDviTsan.filter(s => selectDviTsan.includes(s.maDviTsan));
      listAll.forEach(s => {
        this.listDviTsan.forEach(e => {
          if (e.toChucCaNhan != s.toChucCaNhan) {
            e.disable = true;
          }
        });
        // s.children.forEach(x => {
        //   if (!this.objectArrayIncludes(this.listMaDvts, x)) {
        //     this.listMaDvts = [...this.listMaDvts, x];
        //   }
        // });
      });
      this.listMaDvts = listAll.flatMap(item => item.children);
      await this.buildTableView();
    } else {
      this.dataTable = [];
    }
  }

  objectArrayIncludes(array, obj) {
    return array.some(function (element) {
      return element.id === obj.id;
    });
  }

  async buildTableView() {
    let dataView = await chain(this.listMaDvts)
      .groupBy("tenChiCuc")
      .map(async (value, key) => {
        let tenChiCuc = value.find(f => f.tenChiCuc === key);
        let tongSl = value.reduce((prev, cur) => prev + cur.soLuongDeXuat, 0);
        let tongDg = value.reduce((prev, cur) => prev + cur.donGiaVat, 0);
        let thanhTien = value.reduce((prev, cur) => {
          const curThanhTien = cur.soLuongDeXuat * cur.donGiaVat;
          return prev + curThanhTien;
        }, 0);
        return {
          idVirtual: uuid.v4(),
          tenChiCuc: key,
          maDvi: tenChiCuc?.maChiCuc,
          children: value,
          soLuong: tongSl,
          thanhTien: thanhTien,
          donGiaVat: tongDg,
        };
      }).value();
    dataView = await Promise.all(dataView);
    this.dataTable = dataView;

    this.dataTable.forEach(e => {
      e.children.forEach(f => {
        f.soLuong = f.soLuongDeXuat;
        f.diaChi = this.dsDonvi.find(g=>g.maDvi=f.maDiemKho).diaChi
      });
    });

   await this.sum(this.dataTable);
    this.expandAll();
  }
  async sum(dataTable){
    this.tongSoLuong = this.dataTable.reduce((prev, cur) => prev + cur.soLuong, 0);
    this.tongThanhTien = this.dataTable.reduce((prev, cur) => prev + cur.thanhTien, 0);
    this.formData.patchValue({
      soLuong: this.tongSoLuong,
      tongTien: this.tongThanhTien,
    })
  }

  async changeDiemKho(maDiemKho) {
    let res = await this.donViService.getDonVi({str: maDiemKho});
    if (res.msg == MESSAGE.SUCCESS) {
      return res.data.diaChi;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  expandAll() {
    this.dataTable.forEach(s => {
      this.expandSetString.add(s.idVirtual);
    })
  }

  convertTienTobangChu(tien: number): string {
    return convertTienTobangChu(tien);
  }

  ngOnChanges(changes: SimpleChanges) {
    // console.log(changes)
    // console.log(changes.id.isFirstChange())
    if(!changes.id.isFirstChange()) {
      this.ngOnInit()
    }
    // this.ngOnInit();
  }
}

