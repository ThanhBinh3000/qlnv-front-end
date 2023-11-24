import { Component, Input, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { UserLogin } from 'src/app/models/userlogin';
import { DonviService } from 'src/app/services/donvi.service';
import dayjs from 'dayjs';
import { KhCnQuyChuanKyThuat } from './../../../services/kh-cn-bao-quan/KhCnQuyChuanKyThuat';
import { STATUS } from 'src/app/constants/status';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { Router } from '@angular/router';
import { FileDinhKem } from '../../../models/DeXuatKeHoachMuaTrucTiep';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-quan-ly-quy-chuan-ky-thuat-quoc-gia',
  templateUrl: './quan-ly-quy-chuan-ky-thuat-quoc-gia.component.html',
  styleUrls: ['./quan-ly-quy-chuan-ky-thuat-quoc-gia.component.scss'],
})
export class QuanLyQuyChuanKyThuatQuocGiaComponent extends Base2Component implements OnInit {

  @Input('maLoaiVthh') maLoaiVthh: string;
  @Input() typeVthh: string;
  qdTCDT: string = MESSAGE.QD_TCDT;
  userInfo: UserLogin;
  detail: any = {};
  STATUS = STATUS;
  listChungLoaiHangHoa: any[] = [];
  errorMessage = '';
  isDetail: boolean = false;
  selectedId: number = 0;
  isView: boolean = false;
  dataTableAll: any[] = [];
  dsChungLoaiHangHoa: any[] = [];
  isTatCa: boolean = false;
  yearNow: number = 0;
  listNam: any[] = [];
  dsBoNganh: any[] = [];
  listOfOption: any = [];
  allChecked = false;
  indeterminate = false;
  defaultTrangThaiHl = "01";
  listTrangThai: any[] = [
    { ma: this.STATUS.DU_THAO, giaTri: 'Dự thảo' },
    { ma: this.STATUS.CHO_DUYET_LDV, giaTri: 'Chờ duyệt - LDV' },
    { ma: this.STATUS.TU_CHOI_LDV, giaTri: 'Từ chối - LDV' },
    { ma: this.STATUS.DA_DUYET_LDV, giaTri: 'Đã duyệt - LDV' },
    { ma: this.STATUS.BAN_HANH, giaTri: 'Ban hành' },

  ];
  listTrangThaiHl: any[] = [
    { ma: '01', giaTri: 'Còn hiệu lực' },
    { ma: '00', giaTri: 'Hết hiệu lực' },
    { ma: '02', giaTri: 'Chưa có hiệu lực' },
  ];

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private donviService: DonviService,
    private danhMucService: DanhMucService,
    private khCnQuyChuanKyThuat: KhCnQuyChuanKyThuat,
    private router: Router,
  ) {
    super(httpClient, storageService, notification, spinner, modal, khCnQuyChuanKyThuat);
    this.formData = this.fb.group({
      soVanBan: null,
      soHieuQuyChuan: null,
      apDungTai: null,
      loaiVthh: null,
      cloaiVthh: null,
      ngayKy: null,
      ngayKyTu: null,
      ngayKyDen: null,
      trichYeu: null,
      tenLoaiVthh: null,
      tenCloaiVthh: null,
      maDvi: [null],
      maBn: [null],
      isSearch: [true],
      trangThaiHl: ['01'],
    });
  }

  disabledStartNgayKy = (startValue: Date): boolean => {
    if (startValue && this.formData.value.ngayKyDen) {
      return startValue.getTime() > this.formData.value.ngayKyDen.getTime();
    } else {
      return false;
    }
  };

  disabledEndNgayKy = (endValue: Date): boolean => {
    if (!endValue || !this.formData.value.ngayKyTu) {
      return false;
    }
    return endValue.getTime() <= this.formData.value.ngayKyTu.getTime();
  };

  async ngOnInit() {
    this.spinner.show();
    try {
      if (!this.typeVthh || this.typeVthh == '') {
        this.isTatCa = true;
      }
      this.userInfo = this.userService.getUserLogin();
      if (this.userInfo) {
        this.qdTCDT = this.userInfo.MA_QD;
      }
      this.loadDsHangHoa();
      this.getListBoNganh();
      this.formData.patchValue({
        maBn: this.userInfo.MA_DVI.startsWith('01') ? null : this.userInfo.MA_DVI,
      });
      await this.timKiem();
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async loadDsHangHoa() {
    let res = await this.danhMucService.getAllVthhByCap('2');
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data) {
        this.listOfOption = res.data;
      }
    }
  }

  async timKiem() {
    await this.search();
    if (this.formData.get('trangThaiHl').value) {
      this.filterTable.trangThaiHl = this.formData.get('trangThaiHl').value;
      this.filterInTable('trangThaiHl', this.formData.get('trangThaiHl').value);
    }
  }

  isDisableByBoNganh(): boolean {
    if (!this.userInfo.MA_DVI.startsWith('01')) {
      return true;
    } else {
      return false;
    }
  }

  async changeHangHoa(event: any) {
    if (event) {
      let res = await this.danhMucService.loadDanhMucHangHoaTheoMaCha({ str: event });
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          this.listChungLoaiHangHoa = res.data;
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }
  }


  showList() {
    this.isDetail = false;
    this.timKiem();
    this.showListEvent.emit();
  }

  async changePageIndex(event) {
    this.page = event;
    await this.timKiem();
  }

  async changePageSize(event) {
    this.pageSize = event;
    await this.timKiem();
  }


  async getListBoNganh() {
    this.dsBoNganh = [];
    let res = await this.donviService.layTatCaDonViByLevel(0);
    if (res.msg == MESSAGE.SUCCESS) {
      this.dsBoNganh = res.data;
    }
  }

  async initData() {
    this.userInfo = this.userService.getUserLogin();
    this.detail.maDvi = this.userInfo.MA_DVI;
    this.detail.tenDvi = this.userInfo.TEN_DVI;
    await this.timKiem();
  }

  redirectToChiTiet(isView: boolean, id: number) {
    this.selectedId = id;
    this.isDetail = true;
    this.isView = isView;
  }

  convertDateToString(event: any): string {
    let result = '';
    if (event) {
      result = dayjs(event).format('DD/MM/YYYY').toString();
    }
    return result;
  }

  async downloadFile(item: any) {
    if (item && item.fileName) {
      this.uploadFileService.downloadFile(item.fileUrl).subscribe((blob) => {
        saveAs(blob, item.fileName);
      });
    }
  }
}
