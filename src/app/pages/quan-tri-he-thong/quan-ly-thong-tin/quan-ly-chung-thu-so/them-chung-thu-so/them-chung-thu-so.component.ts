import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { NzModalRef, NzModalService } from "ng-zorro-antd/modal";
import { NzCardModule, NzCardComponent } from "ng-zorro-antd/card";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MangLuoiKhoService } from "src/app/services/qlnv-kho/mangLuoiKho.service";
import { QuanLyHangTrongKhoService } from "src/app/services/quanLyHangTrongKho.service";
import { DonviService } from "src/app/services/donvi.service";
import { MESSAGE } from "src/app/constants/message";
import { NgxSpinnerService } from "ngx-spinner";
import { HttpClient } from "@angular/common/http";
import { StorageService } from "src/app/services/storage.service";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { Base2Component } from "src/app/components/base2/base2.component";
import dayjs from "dayjs";
import moment from "moment";
import { DanhMucService } from "src/app/services/danhmuc.service";

@Component({
  selector: 'app-them-chung-thu-so',
  templateUrl: './them-chung-thu-so.component.html',
  styleUrls: ['./them-chung-thu-so.component.scss']
})
export class ThemChungThuSoComponent extends Base2Component implements OnInit {

  formData: FormGroup
  fb: FormBuilder = new FormBuilder();
  isView = false
  data?: any
  dsCT: any[] = [];

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private _modalRef: NzModalRef,
    private danhMucService: DanhMucService,
    private donViService: DonviService,
    private mangLuoiKhoService: MangLuoiKhoService,
    private quanLyHangTrongKhoService: QuanLyHangTrongKhoService,

  ) {
    super(httpClient, storageService, notification, spinner, modal, quanLyHangTrongKhoService);
    this.formData = this.fb.group({
      certificateNumber: [, [Validators.required]],
      startDate: [, [Validators.required]],
      endDate: [, [Validators.required]],
      description: [],
      loaiChungThu: [, [Validators.required]],
      note: [],
      status: [true],
    }
    );
  }

  ngOnInit(): void {
    this.loadDsChungThu()
    if (this.data)
      this.formData.patchValue({ ...this.data, startDate: moment(this.data.startDate, 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD'), endDate: moment(this.data.endDate, 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD') })
  }

  async loadDsChungThu() {
    let res = await this.danhMucService.danhMucChungGetAll("LOAI_CHUNG_THU");
    if (res.msg == MESSAGE.SUCCESS) {
      this.dsCT = res.data
    }
  }

  handleOk(item: any) {
    this.helperService.markFormGroupTouched(this.formData);
    if (!this.formData.valid) return
    this._modalRef.close({
      ...item,
      isUpdate: !!this.data
    });
  }

  onCancel() {
    this._modalRef.close();
  }

}
