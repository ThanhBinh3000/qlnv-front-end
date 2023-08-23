import {Component, Input, OnInit} from '@angular/core';
import {Base2Component} from "../../../../../components/base2/base2.component";
import {MESSAGE} from "../../../../../constants/message";
import {UserLogin} from "../../../../../models/userlogin";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalRef, NzModalService} from "ng-zorro-antd/modal";
import {DonviService} from "../../../../../services/donvi.service";
import {DanhMucService} from "../../../../../services/danhmuc.service";
import {KhCnQuyChuanKyThuat} from "../../../../../services/kh-cn-bao-quan/KhCnQuyChuanKyThuat";
import dayjs from "dayjs";
import {STATUS} from "../../../../../constants/status";
import {Validators} from "@angular/forms";
import {
  DialogTableSelectionComponent
} from "../../../../../components/dialog/dialog-table-selection/dialog-table-selection.component";

@Component({
  selector: 'app-tim-kiem-van-ban',
  templateUrl: './tim-kiem-van-ban.component.html',
  styleUrls: ['./tim-kiem-van-ban.component.scss']
})
export class TimKiemVanBanComponent extends Base2Component implements OnInit {

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
    })
  }

  async ngOnInit() {
    this.spinner.show();
    try {
      this.userInfo = this.userService.getUserLogin();
      await this.loadLoaiHangHoa();
      await this.timKiem();
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
    this.search();
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
      let loaiHangHoa = this.dsLoaiHangHoa.filter(item => item.ma === id)
      if (loaiHangHoa && loaiHangHoa.length > 0) {
        this.dsChungLoaiHangHoa = loaiHangHoa[0].child
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

  async initData() {
    this.userInfo = this.userService.getUserLogin();
    this.detail.maDvi = this.userInfo.MA_DVI;
    this.detail.tenDvi = this.userInfo.TEN_DVI;
    await this.search();
  }

  handleOk() {
    let item = this.dataTable.filter(it => it.checked);
    this._modalRef.close(item);
  }

  onCancel() {
    this._modalRef.close();
  }
}
