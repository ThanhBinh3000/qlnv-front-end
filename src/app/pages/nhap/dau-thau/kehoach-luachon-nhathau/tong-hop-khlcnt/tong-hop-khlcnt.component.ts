import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { saveAs } from 'file-saver';
import { cloneDeep } from 'lodash';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { TongHopDeXuatKHLCNTService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/kehoach-lcnt/tongHopDeXuatKHLCNT.service';
import * as dayjs from 'dayjs';
import { MESSAGE } from 'src/app/constants/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { UserLogin } from 'src/app/models/userlogin';
import { DanhSachDauThauService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/kehoach-lcnt/danhSachDauThau.service';
import { DialogDanhSachHangHoaComponent } from 'src/app/components/dialog/dialog-danh-sach-hang-hoa/dialog-danh-sach-hang-hoa.component';
import { STATUS } from "../../../../../constants/status";
import { Base2Component } from 'src/app/components/base2/base2.component';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import { FormGroup, Validators } from "@angular/forms";
import {DonviService} from "../../../../../services/donvi.service";

@Component({
  selector: 'app-tong-hop-khlcnt',
  templateUrl: './tong-hop-khlcnt.component.html',
  styleUrls: ['./tong-hop-khlcnt.component.scss']
})

export class TongHopKhlcntComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string;
  @Output()
  showListEvent = new EventEmitter<any>();

  isView: boolean = true
  isQuyetDinh: boolean = false;
  qdPdKhlcntId: number = 0;
  isQdPdKhlcntId: number = 0;
  dataTableDanhSachDX: any[] = [];
  dsDonVi: any[] = [];
  formTraCuu: FormGroup;
  formDataQd: FormGroup;
  isTongHop: boolean = false;
  tuNgayKy: Date | null = null;
  denNgayKy: Date | null = null;
  openQdPdKhlcnt = false;
  id: any;
  savePage: any;

  listTrangThai: any[] = [
    { ma: this.STATUS.CHUA_TAO_QD, giaTri: 'Chưa tạo QĐ' },
    { ma: this.STATUS.DA_DU_THAO_QD, giaTri: 'Đã Dự Thảo QĐ' },
    { ma: this.STATUS.DA_BAN_HANH_QD, giaTri: 'Đã Ban Hành QĐ' }
  ];
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private tongHopDeXuatKHLCNTService: TongHopDeXuatKHLCNTService,
    private donViService: DonviService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, tongHopDeXuatKHLCNTService);
    this.formData = this.fb.group({
      namKhoach: '',
      ngayTongHop: '',
      loaiVthh: '',
      tenVthh: '',
      cloaiVthh: '',
      tenCloaiVthh: '',
      noiDung: '',
      maCuc: '',
    });
    this.formTraCuu = this.fb.group({
      loaiVthh: [null, [Validators.required]],
      tenLoaiVthh: [null, [Validators.required]],
      cloaiVthh: [null, [Validators.required]],
      tenCloaiVthh: [null, [Validators.required]],
      namKhoach: [dayjs().get('year'), [Validators.required]],
      hthucLcnt: ['', [Validators.required]],
      pthucLcnt: ['', [Validators.required]],
      loaiHdong: ['', [Validators.required]],
      nguonVon: ['', [Validators.required]],
    });
    this.formDataQd = this.fb.group({
      id: [],
      loaiVthh: [, [Validators.required]],
      cloaiVthh: [, [Validators.required]],
      namKhoach: [, [Validators.required]],
      ngayTao: [, [Validators.required]],
      noiDung: ['', [Validators.required]],
      hthucLcnt: ['', [Validators.required]],
      pthucLcnt: ['', [Validators.required]],
      loaiHdong: ['', [Validators.required]],
      nguonVon: ['', [Validators.required]],
      ghiChu: ['',],
      trangThai: [''],
      tenLoaiVthh: [''],
      tenCloaiVthh: [''],
      tchuanCluong: [''],
      soQdCc: [''],
    });
    this.filterTable = {
      id: '',
      ngayTao: '',
      noiDung: '',
      namKhoach: '',
      tenLoaiVthh: '',
      tenCloaiVthh: '',
      tenHthucLcnt: '',
      tenPthucLcnt: '',
      tenLoaiHdong: '',
      tenNguonVon: '',
      trangThai: '',
      soQdCc: ''
    }
  }

  disabledTuNgayKy = (startValue: Date): boolean => {
    if (!startValue || !this.denNgayKy) {
      return false;
    }
    return startValue.getTime() > this.denNgayKy.getTime();
  };

  disabledDenNgayKy = (endValue: Date): boolean => {
    if (!endValue || !this.tuNgayKy) {
      return false;
    }
    return endValue.getTime() <= this.tuNgayKy.getTime();
  };

  async ngOnInit() {
    this.spinner.show();
    try {
      this.formData.patchValue({
        loaiVthh: this.loaiVthh
      })
      await this.loadDsDonVi();
      await this.search();
      this.spinner.hide();
    }
    catch (e) {
      console.log('error: ', e)
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async loadDsDonVi() {
    let body = {
      trangThai: "01",
      maDviCha: this.userInfo.MA_DVI,
      type: "DV"
    };
    let res = await this.donViService.getDonViTheoMaCha(body);
    if (res.msg == MESSAGE.SUCCESS) {
      if (this.userService.isTongCuc()) {
        this.dsDonVi = res.data;
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async search() {
    this.spinner.show();
    let body = {
      tuNgayThop: this.tuNgayKy != null ? dayjs(this.tuNgayKy).format('YYYY-MM-DD') + " 00:00:00" : null,
      denNgayThop: this.denNgayKy != null ? dayjs(this.denNgayKy).format('YYYY-MM-DD') + " 24:59:59" : null,
      loaiVthh: this.loaiVthh,
      cloaiVthh: this.formData.get('cloaiVthh').value,
      namKhoach: this.formData.get('namKhoach').value,
      tenVthh: this.formData.get('tenVthh').value,
      tenCloaiVthh: this.formData.get('tenCloaiVthh').value,
      noiDung: this.formData.get('noiDung').value,
      maDvi: this.formData.get('maCuc').value,
      paggingReq: {
        limit: this.pageSize,
        page: this.page - 1,
      },
    };

    let res = await this.tongHopDeXuatKHLCNTService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.dataTable = data.content;
      console.log(this.dataTable)
      if (this.dataTable && this.dataTable.length > 0) {
        this.dataTable.forEach((item) => {
          item.checked = false;
        });
      }
      this.dataTableAll = cloneDeep(this.dataTable);
      this.totalRecord = data.totalElements;
    } else {
      this.dataTable = [];
      this.totalRecord = 0;
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    this.spinner.hide();
  }

  openQdPdKhlcntModal(id: number) {
    this.qdPdKhlcntId = id;
    this.openQdPdKhlcnt = true;
  }

  closeQdPdKhlcntModal() {
    this.qdPdKhlcntId = null;
    this.openQdPdKhlcnt = false;
  }

  selectHangHoa() {
    let data = this.loaiVthh;
    const modalTuChoi = this.modal.create({
      nzTitle: 'Danh sách hàng hóa',
      nzContent: DialogDanhSachHangHoaComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        data: data
      },
    });
    modalTuChoi.afterClose.subscribe(async (data) => {
      if (data) {
        this.formData.patchValue({
          cloaiVthh: data.ma,
          tenCloaiVthh: data.ten,
          loaiVthh: data.parent.ma,
          tenVthh: data.parent.ten,
        });
      }
    });
  }

  async bindingDataHangHoa(data) {
    if (data.loaiHang == "M" || data.loaiHang == "LT") {
      // this.searchFilter.cloaiVthh = data.ma
      // this.searchFilter.tenCloaiVthh = data.ten
      // this.searchFilter.loaiVthh = data.parent.ma
      // this.searchFilter.tenVthh = data.parent.ten
    }

  }

  async goDetail(id: number, isView: boolean) {
    this.idSelected = id;
    this.isDetail = true;
    this.isView = isView
  }

  // disabledTuNgayQd = (startValue: Date): boolean => {
  //   debugger
  //   if (!startValue || !this.denNgayQd) {
  //     return false;
  //   }
  //   return startValue.getTime() > this.denNgayQd.getTime();
  // };
  //
  // disabledDenNgayQd = (endValue: Date): boolean => {
  //   debugger
  //   if (!endValue || !this.tuNgayQd) {
  //     return false;
  //   }
  //   return endValue.getTime() <= this.tuNgayQd.getTime();
  // };

  async taoQdinh(data: any) {
    this.id = data.id
    this.idSelected = data.id;
    this.isQdPdKhlcntId = data.qdPdKhlcntId
    await this.loadChiTiet()
    let elem = document.getElementById('mainTongCuc');
    let tabActive = elem.getElementsByClassName('ant-menu-item')[0];
    tabActive.classList.remove('ant-menu-item-selected')
    let setActive = elem.getElementsByClassName('ant-menu-item')[2];
    setActive.classList.add('ant-menu-item-selected');
    this.isQuyetDinh = true;
  }

  redirectQd(data: any) {
    this.isQdPdKhlcntId = data.qdPdKhlcntId;
    let elem = document.getElementById('mainTongCuc');
    let tabActive = elem.getElementsByClassName('ant-menu-item')[0];
    tabActive.classList.remove('ant-menu-item-selected')
    let setActive = elem.getElementsByClassName('ant-menu-item')[2];
    setActive.classList.add('ant-menu-item-selected');
    this.isQuyetDinh = true;
  }


  showTongHop() {
    this.search();
    let elem = document.getElementById('mainTongCuc');
    let tabActive = elem.getElementsByClassName('ant-menu-item')[2];
    tabActive.classList.remove('ant-menu-item-selected')
    let setActive = elem.getElementsByClassName('ant-menu-item')[1];
    setActive.classList.add('ant-menu-item-selected');
    this.isQdPdKhlcntId = 0;
    this.isQuyetDinh = false;
  }
  //
  async loadChiTiet() {
    if (this.id > 0) {
      let res = await this.tongHopDeXuatKHLCNTService.getDetail(this.id);
      if (res.msg == MESSAGE.SUCCESS) {
        const dataDetail = res.data;
        this.dataTableDanhSachDX = dataDetail.hhDxKhLcntThopDtlList;
        this.helperService.bidingDataInFormGroup(this.formTraCuu, dataDetail)
        this.helperService.bidingDataInFormGroup(this.formDataQd, dataDetail);
        this.isTongHop = true;
      }
      else {
        this.isTongHop = false;
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }
  }

  clearFilter() {
    this.formData.get('namKhoach').setValue(null),
      this.formData.get('tenVthh').setValue(null),
      this.formData.get('cloaiVthh').setValue(null),
      this.formData.get('tenCloaiVthh').setValue(null),
      this.formData.get('noiDung').setValue(null),
      this.denNgayKy = null;
    this.tuNgayKy = null;
    this.search();
  }

  exportData() {
    if (this.totalRecord > 0) {
      this.spinner.show();
      try {
        let body = {
          tuNgayThop: this.tuNgayKy != null ? dayjs(this.tuNgayKy).format('YYYY-MM-DD') + " 00:00:00" : null,
          denNgayThop: this.denNgayKy != null ? dayjs(this.denNgayKy).format('YYYY-MM-DD') + " 23:59:59" : null,
          loaiVthh: this.loaiVthh,
          cloaiVthh: this.formData.get('cloaiVthh').value,
          namKhoach: this.formData.get('namKhoach').value,
          tenVthh: this.formData.get('tenVthh').value,
          tenCloaiVthh: this.formData.get('tenCloaiVthh').value,
          noiDung: this.formData.get('noiDung').value,
        }
        this.tongHopDeXuatKHLCNTService
          .export(body)
          .subscribe((blob) =>
            saveAs(blob, 'danh-sach-tong-hop-khlcnt.xlsx'),
          );
        this.spinner.hide();
      } catch (e) {
        console.log('error: ', e);
        this.spinner.hide();
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
    } else {
      this.notification.error(MESSAGE.ERROR, MESSAGE.DATA_EMPTY);
    }
  }

  updateAllChecked(): void {
    this.indeterminate = false;
    if (this.allChecked) {
      if (this.dataTable && this.dataTable.length > 0) {
        this.dataTable.forEach((item) => {
          if (item.trangThai == this.STATUS.CHUA_TAO_QD) {
            item.checked = true;
          }
        });
      }
    } else {
      if (this.dataTable && this.dataTable.length > 0) {
        this.dataTable.forEach((item) => {
          item.checked = false;
        });
      }
    }
  }

  hienThiXem(data) {
    if (this.userService.isAccessPermisson('NHDTQG_PTDT_KHLCNT_TONGHOP_XEM')) {
      if (data.trangThai == STATUS.CHUA_TAO_QD && this.userService.isAccessPermisson('NHDTQG_PTDT_KHLCNT_TONGHOP_TONGHOP')) {
        return false
      }
      return true
    } else {
      return false
    }
  }
}
