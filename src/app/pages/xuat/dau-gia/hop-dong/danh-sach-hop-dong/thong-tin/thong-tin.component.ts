import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { UploadComponent } from 'src/app/components/dialog/dialog-upload/upload.component';
import { MESSAGE } from 'src/app/constants/message';
import { FileDinhKem } from 'src/app/models/FileDinhKem';
import { saveAs } from 'file-saver';
import {
  HopDongXuatHangService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/hop-dong/hopDongXuatHang.service';
import dayjs from 'dayjs';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import {
  QdPdKetQuaBanDauGiaService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/tochuc-trienkhai/qdPdKetQuaBanDauGia.service';
import {
  DialogTableSelectionComponent
} from 'src/app/components/dialog/dialog-table-selection/dialog-table-selection.component';
import {
  ThongTinDauGiaService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/tochuc-trienkhai/thongTinDauGia.service';
import { chain, cloneDeep } from 'lodash';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { convertTienTobangChu } from 'src/app/shared/commonFunction';
import * as uuid from "uuid";
import { STATUS } from 'src/app/constants/status';

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
  @Input() isView: boolean;
  listLoaiHopDong: any[] = [];
  listDviTsan: any[] = [];
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

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private hopDongXuatHangService: HopDongXuatHangService,
    private qdPdKetQuaBanDauGiaService: QdPdKetQuaBanDauGiaService,
    private thongTinDauGiaService: ThongTinDauGiaService,
    private danhMucService: DanhMucService
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
        diaChi: [],
        mst: [],
        tenNguoiDdien: [],
        chucVu: [],
        sdt: [],
        stk: [],
        fax: [],
        moTai: [],
        uyQuyen: [],

        tenNhaThau: [''],
        diaChiNhaThau: [],
        mstNhaThau: [],
        tenNguoiDdienNhaThau: [],
        chucVuNhaThau: [''],
        sdtNhaThau: [''],
        stkNhaThau: [''],
        faxNhaThau: [''],
        moTaiNhaThau: [''],

        loaiVthh: [''],
        cloaiVthh: [''],
        moTaHangHoa: [''],
        donViTinh: [''],
        dviTinh: [''],
        soLuong: [''],
        tongTien: [''],
        ghiChu: [''],
        gtriHdSauVat: [''],
        tenCloaiVthh: [''],
        tenLoaiVthh: [''],
        trangThai: ['00'],
        tenTrangThai: ['Dự thảo'],
        fileDinhKems: [new Array<FileDinhKem>()],
        canCu: [new Array<FileDinhKem>()],
        listMaDviTsan: [null, [Validators.required]],
      }
    );
  }

  async ngOnInit() {
    this.maHopDongSuffix = `/${this.formData.value.nam}/HĐMB`;
    await Promise.all([
      this.loadDataComboBox(),
      this.loadDsVthh(),
    ]);

    if (this.id) {
      await this.loadChiTiet(this.id);
    } else {
      this.initForm();
    }
    if (this.idKqBdg) {
      await this.onChangeKqBdg(this.idKqBdg);
      await this.loadDsHd();
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
    this.spinner.hide();
  }

  async loadChiTiet(id) {
    let data = await this.detail(id);
    this.formData.patchValue({
      soHd: data.soHd.split('/')[0],
    })
    this.dataTable = cloneDeep(data.children);
    this.dataTable.forEach(e =>
      e.tenChiCuc = e.tenDvi,
    )
    this.dataTablePhuLuc = data.phuLuc;
    this.objHopDongHdr = data;
  }

  async saveAndSend(status: string, message: string, sucessMessage: string) {
    this.setValidator();
    let data = this.formData.value;
    data.maDviTsan = data.listMaDviTsan.join(',');
    data.soHd = this.formData.value.soHd + this.maHopDongSuffix;
    data.children = this.dataTable;
    if (this.formData.value.id > 0) {
      if (data) {
        await this.approve(data.id, status, message, null, sucessMessage);
      } else {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
    } else {
      let data = await this.createUpdate(this.formData.value);
      if (data) {
        await this.approve(data.id, status, message, null, sucessMessage);
      } else {
        this.notification.error(MESSAGE.ERROR, MESSAGE.FORM_REQUIRED_ERROR);
      }
    }

  }


  async save(isOther: boolean) {
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      this.spinner.hide();
      return;
    }
    let body = this.formData.value;
    body.maDviTsan = body.listMaDviTsan.join(',');
    body.soHd = this.formData.value.soHd + this.maHopDongSuffix;
    body.children = this.dataTable;
    let data = await this.createUpdate(body);
    if (data) {
      if (isOther) {
        if (this.formData.invalid) {
          return;
        }
        this.approve(data.id, this.STATUS.DA_KY, "Bạn có muốn ký hợp đồng ?")
      } else {
        // this.goBack()
      }
    }
  }

  async setValidator() {
    this.formData.controls["diaChi"].setValidators([Validators.required]);
    this.formData.controls["mst"].setValidators([Validators.required]);
    this.formData.controls["tenNguoiDdien"].setValidators([Validators.required]);
    this.formData.controls["chucVu"].setValidators([Validators.required]);
    this.formData.controls["sdt"].setValidators([Validators.required]);
    this.formData.controls["stk"].setValidators([Validators.required]);
    this.formData.controls["fax"].setValidators([Validators.required]);
    this.formData.controls["moTai"].setValidators([Validators.required]);
    this.formData.controls["moTaiNhaThau"].setValidators([Validators.required]);
    this.formData.controls["stkNhaThau"].setValidators([Validators.required]);
    this.formData.controls["ghiChu"].setValidators([Validators.required]);

  }

  redirectPhuLuc(id) {
    this.isViewPhuLuc = true;
    this.idPhuLuc = id;
  }

  showChiTiet() {
    this.isViewPhuLuc = false;
    this.loadChiTiet(this.id);
  }

  async openDialogKqBdg() {
    this.spinner.show()
    let listQdKq: any[] = [];
    let body = {
      loaiVthh: this.loaiVthh,
      nam: this.formData.value.nam,
      maDvi: this.userInfo.MA_DVI
    };
    let res = await this.qdPdKetQuaBanDauGiaService.search(body)
    if (res.data) {
      listQdKq = res.data?.content;
    }
    this.spinner.hide();
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
            this.setListDviTsan(dataThongTin.children);
            this.formData.patchValue({
              soQdKq: dataKq.soQdKq,
              ngayKyQdKq: dataKq.ngayKy,
              soQdPd: dataThongTin.soQdPd,
              loaiVthh: dataThongTin.loaiVthh,
              tenLoaiVthh: dataThongTin.tenLoaiVthh,
              cloaiVthh: dataThongTin.cloaiVthh,
              tenCloaiVthh: dataThongTin.tenCloaiVthh,
              moTaHangHoa: dataThongTin.moTaHangHoa
            });
            this.listDviLquan = dataThongTin.listNguoiTgia;
            this.formData.patchValue({ donViTinh: this.listHangHoaAll.find(s => s.ma == dataThongTin.loaiVthh)?.maDviTinh })
          }
        })
    }
  }

  async loadDsHd() {
    let body = {
      soQdKq: this.formData.value.soQdKq,
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

  setListDviTsan(inputTable) {
    console.log(inputTable, 'inputTable')
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
      console.log(dataGroup, 'dataGroup')
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

    if (!this.id) {
      this.listDviTsan = this.listDviTsan.filter(s => !this.listHdDaKy.some(s1 => s1.maDviTsan.split(',').includes(s.maDviTsan)));
    }

  }

  taiLieuDinhKem(type?: string) {
    const modal = this.modal.create({
      nzTitle: 'Tài liệu đính kèm',
      nzContent: UploadComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {},
    });
    modal.afterClose.subscribe((res) => {
      if (res) {
        this.uploadFileService
          .uploadFile(res.file, res.tenTaiLieu)
          .then((resUpload) => {
            const fileDinhKem = new FileDinhKem();
            fileDinhKem.fileName = resUpload.filename;
            fileDinhKem.fileSize = resUpload.size;
            fileDinhKem.fileUrl = resUpload.url;
            this.fileDinhKem.push(fileDinhKem);
          });
      }
    });
  }

  downloadFile(taiLieu: any) {
    this.uploadFileService.downloadFile(taiLieu.fileUrl).subscribe((blob) => {
      saveAs(blob, taiLieu.fileName);
    });
  }

  deleteTaiLieu(index: number) {
    this.fileDinhKem = this.fileDinhKem.filter((item, i) => i !== index)
  }

  isDisabled() {
    return false;
  }

  getNameFile($event) {

  }

  selectMaDviTsan() {
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
        s.children.forEach(x => {
          if (!this.objectArrayIncludes(this.listMaDvts, x)) {
            this.listMaDvts = [...this.listMaDvts, x];
          }
        });
      });
      this.buildTableView();
    } else {
      this.dataTable = [];
    }
  }

  objectArrayIncludes(array, obj) {
    return array.some(function (element) {
      return element.id === obj.id;
    });
  }

  buildTableView() {
    let dataView = chain(this.listMaDvts)
      .groupBy("tenChiCuc")
      .map((value, key) => {
        let tenChiCuc = value.find(f => f.tenChiCuc === key);
        let tongSl = value.reduce((prev, cur) => prev + cur.soLuong, 0);
        return {
          idVirtual: uuid.v4(),
          tenChiCuc: key,
          maDvi: tenChiCuc.maChiCuc,
          children: value,
          soLuong: tongSl,
          donGiaVat: tenChiCuc.donGiaVat,
          diaChi: tenChiCuc.diaChi,
        };
      }).value();

    this.dataTable = dataView
    this.expandAll()

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
    /*console.log(changes)
    console.log(changes.id.isFirstChange())
    if(!changes.id.isFirstChange()) {
      this.ngOnInit()
    }*/
    this.ngOnInit();
  }
}

