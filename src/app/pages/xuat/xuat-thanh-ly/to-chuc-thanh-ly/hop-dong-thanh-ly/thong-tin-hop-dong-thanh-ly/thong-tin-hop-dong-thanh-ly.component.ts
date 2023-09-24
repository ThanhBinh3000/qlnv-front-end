import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Base2Component} from "../../../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import dayjs from "dayjs";
import {Validators} from "@angular/forms";
import {convertTienTobangChu} from 'src/app/shared/commonFunction';
import {
  HopDongThanhLyService
} from "../../../../../../services/qlnv-hang/xuat-hang/xuat-thanh-ly/HopDongThanhLy.service";
import {STATUS} from "../../../../../../constants/status";
import {
  DialogTableSelectionComponent
} from "../../../../../../components/dialog/dialog-table-selection/dialog-table-selection.component";
import {
  QuyetDinhPheDuyetKetQuaService
} from "../../../../../../services/qlnv-hang/xuat-hang/xuat-thanh-ly/QuyetDinhPheDuyetKetQua.service";
import {
  ToChucThucHienThanhLyService
} from "../../../../../../services/qlnv-hang/xuat-hang/xuat-thanh-ly/ToChucThucHienThanhLy.service";
import {MESSAGE} from "../../../../../../constants/message";
import {chain, cloneDeep, isEmpty} from 'lodash';
import * as uuid from "uuid";
import {DonviService} from "../../../../../../services/donvi.service";
import {DanhMucService} from "../../../../../../services/danhmuc.service";
import {FileDinhKem} from "../../../../../../models/FileDinhKem";

@Component({
  selector: 'app-thong-tin-hop-dong-thanh-ly',
  templateUrl: './thong-tin-hop-dong-thanh-ly.component.html',
  styleUrls: ['./thong-tin-hop-dong-thanh-ly.component.scss']
})
export class ThongTinHopDongThanhLyComponent extends Base2Component implements OnInit, OnChanges {
  @Input() id: number;
  @Input() idKqTl: number;
  @Input() isQuanLy: boolean;
  @Input() isView: boolean;
  @Output()
  showListEvent = new EventEmitter<any>();
  @Output()
  sendListAllDviTsan = new EventEmitter<any>();
  listLoaiHopDong: any[] = [];
  maHopDongSuffix: string = '';
  listDviTsanFilter: any[] = [];
  listToChucTrungDg: any[] = [];
  listHdDaKy = [];
  listDviTsan: any[] = [];
  listAllDviTsan: any[] = [];
  listDviLquan: any[] = [];
  listMaDvts = [];
  expandSetString = new Set<string>();
  dsDonvi: any[] = [];
  listHangHoaAll: any[] = [];
  listLoaiHangHoa: any[] = [];

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private hopDongThanhLyService: HopDongThanhLyService,
    private quyetDinhPheDuyetKetQuaService: QuyetDinhPheDuyetKetQuaService,
    private toChucThucHienThanhLyService: ToChucThucHienThanhLyService,
    private donViService: DonviService,
    private danhMucService: DanhMucService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, hopDongThanhLyService);
    this.formData = this.fb.group(
      {
        id: [],
        nam: [dayjs().get('year')],
        maDvi: [''],
        tenDvi: [''],
        idQdKqTl: [],
        soQdKqTl: [''],
        ngayKyQdkqTl: [''],
        soQdTl: [''],
        toChucCaNhan: [null, [Validators.required]],
        maDviTsan: [''],
        listMaDviTsan: [null, [Validators.required]],
        thoiHanXuatKho: [''],
        loaiHinhNx: [''],
        tenLoaiHinhNx: [''],
        kieuNx: [''],
        tenKieuNx: [''],
        soHd: [''],
        tenHd: [''],
        ngayHieuLuc: [''],
        ghiChuNgayHluc: [''],
        loaiHdong: [''],
        ghiChuLoaiHdong: [''],
        tgianThienHd: [],
        tgianBhanh: [],
        diaChiBenBan: [''],
        mstBenBan: [''],
        daiDienBenBan: [''],
        chucVuBenBan: [''],
        sdtBenBan: [''],
        faxBenBan: [''],
        stkBenBan: [''],
        moTaiBenBan: [''],
        thongTinUyQuyen: [''],
        tenDviBenMua: [''],
        diaChiBenMua: [''],
        mstBenMua: [''],
        daiDienBenMua: [''],
        chucVuBenMua: [''],
        sdtBenMua: [''],
        faxBenMua: [''],
        stkBenMua: [''],
        moTaiBenMua: [''],
        loaiVthh: [''],
        tenLoaiVthh: [''],
        cloaiVthh: [''],
        tenCloaiVthh: [''],
        moTaHangHoa: [''],
        donViTinh: [''],
        soLuong: [],
        thanhTien: [],
        ghiChu: [''],
        trangThai: [''],
        tenTrangThai: [''],
        fileCanCu: [new Array<FileDinhKem>()],
        fileDinhKem: [new Array<FileDinhKem>()],
      }
    );
  }

  async ngOnInit() {
    await this.spinner.show();
    try {
      this.maHopDongSuffix = `/${this.formData.value.nam}/HĐMB`;
      await Promise.all([
        this.loadDsVthh(),
        this.loadDsDonVi(),
        this.loadDataComboBox(),
      ]);
      if (this.idKqTl) {
        await this.onChangeKqBdg(this.idKqTl);
      }
      if (this.id) {
        await this.loadChiTiet(this.id);
      } else {
        this.initForm();
      }
      await this.spinner.hide();
    } catch (e) {
      console.log('error: ', e)
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  initForm() {
    this.formData.patchValue({
      maDvi: this.userInfo.MA_DVI ?? null,
      tenDvi: this.userInfo.TEN_DVI ?? null,
      trangThai: STATUS.DU_THAO,
      tenTrangThai: 'Dự thảo',
    })
  }

  async ngOnChanges(changes: SimpleChanges) {
    if (!changes.id.isFirstChange()) {
      this.ngOnInit()
    }
  }

  async loadDataComboBox() {
    // hợp đồng
    this.listLoaiHopDong = [];
    let resHd = await this.danhMucService.danhMucChungGetAll('LOAI_HDONG');
    if (resHd.msg == MESSAGE.SUCCESS) {
      this.listLoaiHopDong = resHd.data;
    }
    this.spinner.hide();
  }

  async loadChiTiet(id) {
    let data = await this.detail(id);
    this.formData.patchValue({
      soHd: data?.soHd?.split('/')[0],
    });
    this.maDviTsan(data.toChucCaNhan, data.trangThai);
    await this.buildTableView(data?.hopDongDtl || [])
  }

  async loadDsDonVi() {
    const dsTong = await this.donViService.layDonViCon();
    if (!isEmpty(dsTong)) {
      this.dsDonvi = dsTong.data.filter(s => s.type === 'DV');
    }
  }

  async loadDsVthh() {
    let res = await this.danhMucService.getDanhMucHangDvqlAsyn({});
    if (res.msg == MESSAGE.SUCCESS) {
      this.listHangHoaAll = res.data;
      this.listLoaiHangHoa = res.data?.filter((x) => x.ma.length == 4);
    }
  }

  async save() {
    try {
      this.formData.disable();
      this.formData.controls["soQdKqTl"].enable();
      this.formData.controls["soQdKqTl"].markAsDirty();
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
      this.dataTable.forEach((item) => {
        body.hopDongDtl = item.children
      })
      this.formData.disable();
      await this.createUpdate(body);
      this.formData.enable();
    } catch (e) {
    } finally {
      this.formData.enable();
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
    this.dataTable.forEach((item) => {
      body.hopDongDtl = item.children
    })
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

  async openDialogKqTlBdg() {
    await this.spinner.show()
    let listQdKq: any[] = [];
    let body = {
      nam: this.formData.value.nam,
      trangThai: STATUS.BAN_HANH
    };
    let res = await this.quyetDinhPheDuyetKetQuaService.search(body)
    if (res.data) {
      listQdKq = res.data?.content;
    }
    await this.spinner.hide();
    const modalQD = this.modal.create({
      nzTitle: 'THÔNG TIN QUYẾT ĐỊNH PHÊ DUYỆT KẾT QUẢ BÁN ĐẤU GIÁ',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataHeader: ['Số QĐ PDKQ BĐG', 'Số biên bản', 'Mã thông báo'],
        dataColumn: ['soQd', 'soBienBan', 'maThongBao'],
        dataTable: listQdKq
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        this.onChangeKqBdg(data.id);
      }
    });
  }

  async onChangeKqBdg(id) {
    if (id > 0) {
      await this.quyetDinhPheDuyetKetQuaService.getDetail(id)
        .then(async (res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            const dataQdKq = res.data;
            let resttin = await this.toChucThucHienThanhLyService.getDetail(dataQdKq.idThongBao);
            if (resttin.msg == MESSAGE.SUCCESS) {
              const dataThongTin = resttin.data;
              await this.loadDsHd(dataQdKq.soQd)
              await this.setListDviTsan(dataQdKq.quyetDinhDtl);
              this.formData.patchValue({
                idQdKqTl: dataQdKq.id,
                soQdKqTl: dataQdKq.soQd,
                ngayKyQdkqTl: dataQdKq.ngayKy,
                soQdTl: dataQdKq.soQdTl,
                loaiHinhNx: dataQdKq.loaiHinhNhapXuat,
                tenLoaiHinhNx: dataQdKq.tenLoaiHinhNx,
                kieuNx: dataQdKq.kieuNhapXuat,
                tenKieuNx: dataQdKq.tenKieuNx,
                loaiVthh: dataQdKq.loaiVthh,
                tenLoaiVthh: dataQdKq.tenLoaiVthh,
                cloaiVthh: dataQdKq.cloaiVthh,
                tenCloaiVthh: dataQdKq.tenCloaiVthh,
                moTaHangHoa: dataQdKq.moTaHangHoa,
              });
              this.listDviLquan = dataThongTin.toChucNlq;
              this.listToChucTrungDg = dataThongTin.toChucDtl.map(grandchild => grandchild.toChucCaNhan);
              this.listToChucTrungDg = [...new Set(this.listToChucTrungDg.filter(val => val !== null))];
              this.listToChucTrungDg = this.listToChucTrungDg.map(name => ({name}))
              this.formData.patchValue({donViTinh: this.listHangHoaAll.find(s => s.ma == dataQdKq.loaiVthh)?.maDviTinh})
            }
          }
        })
    }
  }

  setListDviTsan(inputTable) {
    this.listDviTsan = [];
    let dataGroup = chain(inputTable).groupBy('maDviTsan').map((value, key) => ({
      maDviTsan: key,
      children: value
    })).value();
    inputTable.dataDviTsan = dataGroup;
    inputTable.dataDviTsan.forEach(x => {
      x.soLanTraGia = x.children[0].soLanTraGia
      x.toChucCaNhan = x.children[0].toChucCaNhan
      x.tenDvi = x.children[0].tenChiCuc
      x.maDvi = x.children[0].maDiaDiem.substring(0, 6)
      if (x.soLanTraGia) {
        this.listDviTsan = [...this.listDviTsan, x];
      }
    })
    this.listAllDviTsan = this.listDviTsan;
    this.sendListAllDviTsan.emit(this.listAllDviTsan);
    this.listDviTsan = this.listDviTsan.filter(s => !this.listHdDaKy.some(s1 => {
        return s1.maDviTsan.split(',').includes(s.maDviTsan) && s1.toChucCaNhan.includes(s.toChucCaNhan);
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
        tenDviBenMua: thongTin.hoVaTen,
        diaChiBenMua: thongTin.diaChi,
        mstBenMua: thongTin.soCccd
      })
    }
  }

  async selectMaDviTsan($event) {
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
      });
      this.listMaDvts = listAll.flatMap(item => item.children);
      await this.buildTableView(this.listMaDvts);
    } else {
      this.dataTable = [];
    }
  }

  async buildTableView(data?: any) {
    let dataView = await chain(data)
      .groupBy("tenChiCuc")
      .map(async (value, key) => {
        this.formData.patchValue({
          soLuong: value.reduce((prev, cur) => prev + cur.slDauGia, 0),
          thanhTien: value.reduce((prev, cur) => prev + cur.thanhTien, 0),
        })
        let tongThanhTien = value.reduce((prev, cur) => prev + cur.thanhTien, 0);
        let slDauGiaChiCuc = value.reduce((prev, cur) => prev + cur.slDauGia, 0);
        let tenChiCuc = value.find(f => f.tenChiCuc === key);
        return {
          idVirtual: uuid.v4(),
          tenChiCuc: key,
          maDvi: tenChiCuc?.maDiaDiem.substring(0, 6),
          children: value,
          slDauGiaChiCuc: slDauGiaChiCuc,
          tongThanhTien: tongThanhTien
        };
      }).value();
    dataView = await Promise.all(dataView);
    this.dataTable = dataView;
    await this.loadDiaDiemKho();
    this.expandAll();
  }

  async loadDiaDiemKho() {
    for (const item of this.dataTable) {
      let body = {
        trangThai: "01",
        maDviCha: item.maDvi
      };
      const res = await this.donViService.getAll(body);
      const dataDk = res.data;
      if (dataDk) {
        item.children.forEach((child) => {
          let diaDiemXuat = dataDk.filter(item => item.maDvi == child.maDiaDiem.substring(0, 8));
          diaDiemXuat.forEach(s => {
            child.diaDiemXuat = s.diaChi;
          });
        });
      }
    }
  }

  expandAll() {
    this.dataTable.forEach(s => {
      this.expandSetString.add(s.idVirtual);
    })
  }

  async loadDsHd(event) {
    let body = {
      soQdKqTl: event,
      trangThai: STATUS.DA_KY,
    }
    let res = await this.hopDongThanhLyService.search(body);
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

  convertTienTobangChu(tien: number): string {
    return convertTienTobangChu(tien);
  }

  calcTong(column) {
    if (this.dataTable) {
      const sum = this.dataTable.reduce((prev, cur) => {
        prev += cur[column];
        return prev;
      }, 0);
      return sum;
    }
  }
}

