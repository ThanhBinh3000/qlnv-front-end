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
  dataTest: any = {};
  dsCha: any = {};
  dsCon: any = {};
  STATUS = STATUS;
  listChungLoaiHangHoa: any[] = [];
  errorMessage = '';
  isDetail: boolean = false;
  selectedId: number = 0;
  isView: boolean = false;
  dataTableAll: any[] = [];
  dsLoaiHangHoa: any[] = [];
  dsChungLoaiHangHoa: any[] = [];
  isTatCa: boolean = false;
  yearNow: number = 0;
  listNam: any[] = [];
  dsBoNganh: any[] = [];
  boNganhAd: any[] = [];
  listOfOption: any = [];
  allChecked = false;
  indeterminate = false;
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
      maBn: null,
    });
    this.filterTable = {
      soVanBan: '',
      soVanBanThayThe: '',
      soHieuQuyChuan: '',
      apDungTai: '',
      tenLoaiVthh: '',
      tenCloaiVthh: '',
      listTenLoaiVthh: '',
      ngayKy: '',
      ngayHieuLuc: '',
      ngayHetHieuLuc: '',
      tenTrangThai: '',
      tenTrangThaiHl: '',
    };
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
    // if (!this.userService.isAccessPermisson('KHCNBQ_QCKTTCCS')) {
    //   this.router.navigateByUrl('/error/401')
    // }
    this.spinner.show();
    try {
      if (!this.typeVthh || this.typeVthh == '') {
        this.isTatCa = true;
      }
      this.userInfo = this.userService.getUserLogin();
      if (this.userInfo) {
        this.qdTCDT = this.userInfo.MA_QD;
      }
      await this.loadLoaiHangHoa();
      await this.getListBoNganh();
      // this.formData.patchValue({
      //   maBn: this.userInfo.MA_DVI.startsWith('01') ? '01' : this.userInfo.MA_DVI,
      // });
      await this.search();
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }


  async loadLoaiHangHoa() {
    let ds = [];
    try {
      let hangHoa = await this.danhMucService.loadDanhMucHangHoa().toPromise();
      if (hangHoa) {
        if (hangHoa.msg == MESSAGE.SUCCESS) {
          hangHoa.data.forEach(element => {
            ds = [...ds, element.children];
            ds = ds.flat();
            this.listOfOption = ds;
          });
        }
      }
    } catch (error) {
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async onChangeLoaiHH(id: number) {
    if (id && id > 0) {
      let loaiHangHoa = this.dsLoaiHangHoa.filter(item => item.ma === id);
      if (loaiHangHoa && loaiHangHoa.length > 0) {
        this.dsChungLoaiHangHoa = loaiHangHoa[0].child;
      }
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
      console.log(res, 5555);
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          this.listChungLoaiHangHoa = res.data;
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }
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
    await this.search();
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
}
