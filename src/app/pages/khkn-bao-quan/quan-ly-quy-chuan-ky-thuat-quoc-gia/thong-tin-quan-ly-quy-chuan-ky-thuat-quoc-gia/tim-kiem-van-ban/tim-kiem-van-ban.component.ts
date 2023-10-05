import {Component, Input, OnInit} from '@angular/core';
import {Base2Component} from '../../../../../components/base2/base2.component';
import {MESSAGE} from '../../../../../constants/message';
import {UserLogin} from '../../../../../models/userlogin';
import {HttpClient} from '@angular/common/http';
import {StorageService} from '../../../../../services/storage.service';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NgxSpinnerService} from 'ngx-spinner';
import {NzModalRef, NzModalService} from 'ng-zorro-antd/modal';
import {DonviService} from '../../../../../services/donvi.service';
import {DanhMucService} from '../../../../../services/danhmuc.service';
import {KhCnQuyChuanKyThuat} from '../../../../../services/kh-cn-bao-quan/KhCnQuyChuanKyThuat';
import dayjs from 'dayjs';
import {STATUS} from '../../../../../constants/status';
import {Validators} from '@angular/forms';
import {
  DialogTableSelectionComponent,
} from '../../../../../components/dialog/dialog-table-selection/dialog-table-selection.component';
import {PAGE_SIZE_DEFAULT} from '../../../../../constants/config';

@Component({
  selector: 'app-tim-kiem-van-ban',
  templateUrl: './tim-kiem-van-ban.component.html',
  styleUrls: ['./tim-kiem-van-ban.component.scss'],
})
export class TimKiemVanBanComponent extends Base2Component implements OnInit {

  @Input()
  listVbThayThe: string;
  @Input()
  loaiVthhSearch: string;
  @Input()
  maBn: string;
  userInfo: UserLogin;
  detail: any = {};
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
  listOfOption: any = [];
  allChecked = false;
  indeterminate = false;
  listTrangThai: any[] = [
    {ma: this.STATUS.DU_THAO, giaTri: 'Dự thảo'},
    {ma: this.STATUS.CHO_DUYET_LDV, giaTri: 'Chờ duyệt - LDV'},
    {ma: this.STATUS.TU_CHOI_LDV, giaTri: 'Từ chối - LDV'},
    {ma: this.STATUS.DA_DUYET_LDV, giaTri: 'Đã duyệt - LDV'},
    {ma: this.STATUS.BAN_HANH, giaTri: 'Ban hành'},
  ];
  page: number = 1;
  pageSize: number = 1000;
  totalRecord: number = 0;

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private donviService: DonviService,
    private danhMucService: DanhMucService,
    private _modalRef: NzModalRef,
    private khCnQuyChuanKyThuat: KhCnQuyChuanKyThuat,
  ) {
    super(httpClient, storageService, notification, spinner, modal, khCnQuyChuanKyThuat);
    this.formData = this.fb.group({
      loaiVthh: [null, [Validators.required]],
    });
  }

  async ngOnInit() {
    this.spinner.show();
    try {
      this.userInfo = this.userService.getUserLogin();
      await this.loadLoaiHangHoa(this.maBn);
      // await this.timKiem();
      if (this.loaiVthhSearch && this.loaiVthhSearch.length > 0) {
        this.formData.patchValue({
          loaiVthh: this.loaiVthhSearch[0],
        });
        await this.timKiem();
      }
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async timKiem() {
    this.helperService.markFormGroupTouched(this.formData);
    if (!this.formData.valid) {
      return;
    }
    try {
      let body = this.formData.value;
      body.paggingReq = {
        limit: this.pageSize,
        page: this.page - 1,
      };
      let res = await this.khCnQuyChuanKyThuat.search(body);
      if (res.msg == MESSAGE.SUCCESS) {
        let data = res.data;
        this.dataTable = data.content.filter(item => item.trangThaiHl == '01');
        this.totalRecord = data.totalElements;
        if (this.listVbThayThe) {
          this.dataTable.forEach(item => {
            if (this.listVbThayThe.indexOf(item.soVanBan) !== -1) {
              item.checked = true;
            }
          });
        }
      } else {
        this.dataTable = [];
        this.totalRecord = 0;
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  async clearSearch() {
    this.formData.reset();
    this.dataTable = [];
    this.helperService.markFormGroupTouched(this.formData);
    if (!this.formData.valid) {
      return;
    }
    this.search();
  }


  async loadLoaiHangHoa(maBn?) {
    try {
      let hangHoa: any;
      if (this.userInfo.MA_DVI == '0101') {
        hangHoa = await this.danhMucService.getDanhMucHangHoaDvql({
          'maDvi': maBn ? (maBn == '01' ? '0101' : maBn) : this.userInfo.MA_DVI,
        }).toPromise();
      } else {
        hangHoa = await this.danhMucService.getDanhMucHangHoaDvql({
          'maDvi': maBn ? (maBn == '01' ? '0101' : maBn) : this.userInfo.MA_DVI.substring(0, 2),
        }).toPromise();
      }
      if (hangHoa) {
        console.log(hangHoa)
        if (hangHoa.msg == MESSAGE.SUCCESS) {
          let ds = hangHoa.data.filter(element => {
              return element.maHangHoa.length == 4;
            },
          );
          ds = ds.flat();
          this.listOfOption = ds
        }
      }

    } catch (error) {
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  //
  // async loadLoaiHangHoa() {
  //   let ds = [];
  //   try {
  //     let hangHoa = await this.danhMucService.loadDanhMucHangHoa().toPromise();
  //     if (hangHoa) {
  //       if (hangHoa.msg == MESSAGE.SUCCESS) {
  //         hangHoa.data.forEach(element => {
  //           ds = [...ds, element.children];
  //           ds = ds.flat();
  //           this.listOfOption = ds;
  //         });
  //       }
  //     }
  //   } catch (error) {
  //     this.spinner.hide();
  //     this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
  //   }
  // }

  async onChangeLoaiHH(id: number) {
    if (id && id > 0) {
      let loaiHangHoa = this.dsLoaiHangHoa.filter(item => item.ma === id);
      if (loaiHangHoa && loaiHangHoa.length > 0) {
        this.dsChungLoaiHangHoa = loaiHangHoa[0].child;
      }
    }
  }

  async changeHangHoa(event: any) {
    if (event) {
      let res = await this.danhMucService.loadDanhMucHangHoaTheoMaCha({str: event});
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          this.listChungLoaiHangHoa = res.data;
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }
  }

  changeLoaiVthh() {
    this.timKiem();
  }

  async initData() {
    this.userInfo = this.userService.getUserLogin();
    this.detail.maDvi = this.userInfo.MA_DVI;
    this.detail.tenDvi = this.userInfo.TEN_DVI;
    await this.timKiem();
  }

  handleOk() {
    let item = this.dataTable.filter(it => it.checked);
    this._modalRef.close(item);
  }

  onCancel() {
    this._modalRef.close();
  }
}
