import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NzModalRef } from "ng-zorro-antd/modal";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NgxSpinnerService } from "ngx-spinner";
import { MESSAGE } from "src/app/constants/message";
import { Globals } from "src/app/shared/globals";
import { HelperService } from "../../../services/helper.service";
import { DanhMucDungChungService } from "../../../services/danh-muc-dung-chung.service";
import { Router } from "@angular/router";

@Component({
  selector: "dialog-them-tiep-nhan-bc-bo-nganh",
  templateUrl: "./dialog-them-tiep-nhan-bc-bo-nganh.component.html",
  styleUrls: ["./dialog-them-tiep-nhan-bc-bo-nganh.component.scss"]
})
export class DialogThemTiepNhanBcBoNganhComponent implements OnInit {
  dataEdit: any;
  isView: boolean;
  formData: FormGroup;
  totalRecord: number = 10;
  danhMucList: any[] = [];
  listApDungCn: any[] = [];
  selectedValue = null;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private _modalRef: NzModalRef,
    private spinner: NgxSpinnerService,
    private dmService: DanhMucDungChungService,
    public globals: Globals,
    private helperService: HelperService,
    private notification: NzNotificationService
  ) {
    this.formData = this.fb.group({
      id: [null],
      loai: [null, [Validators.required]],
      ma: [null, [Validators.required]],
      maCha: [null],
      trangThai: ["01", [Validators.required]],
      giaTri: [null, [Validators.required]],
      thuTuHienThi: [null],
      phanLoai: [],
      apDung: [null],
      ghiChu: [null]
    });
  }

  async ngOnInit() {
    await Promise.all([
      this.getDmList(),
      this.getListApDungCn()
    ]);
    if (this.dataEdit && this.dataEdit.apDung) {
      this.dataEdit.apDung = this.dataEdit.apDung.split(",");
    }
    await this.helperService.bidingDataInFormGroup(this.formData, this.dataEdit);

  }

  // bindingData(dataEdit) {
  //   if (dataEdit) {
  //     this.formData.get('id').setValue(dataEdit.id);
  //     this.formData.get('loai').setValue(dataEdit.loai);
  //     this.formData.get('ma').setValue(dataEdit.ma);
  //     this.formData.get('maCha').setValue(dataEdit.maCha);
  //     this.formData.get('ghiChu').setValue(dataEdit.ghiChu);
  //     this.formData.get('trangThai').setValue(dataEdit.trangThai);
  //     this.formData.get('giaTri').setValue(dataEdit.giaTri);
  //   }
  // }

  async save() {
    this.spinner.show();

    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      this.spinner.hide();
      return;
    }
    let body = this.formData.value
      body.apDung = body.apDung ? body.apDung.toString() : null;
    let res;
    if (this.dataEdit != null) {
      res = await this.dmService.update(body);
    } else {
      res = await this.dmService.create(body);
    }
    if (res.msg == MESSAGE.SUCCESS) {
      if (this.dataEdit != null) {
        this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
      } else {
        this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
        // this.formData.reset();
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    this.spinner.hide();
  }

  async getDmList() {
    let data = await this.dmService.danhMucChungGetAll("DANH_MUC_DC");
    this.danhMucList = data.data;
  }

  async getListApDungCn() {
    let data = await this.dmService.danhMucChungGetAll("AP_DUNG_CN");
    if (data) {
      this.listApDungCn = data.data;
    }
  }

  handleCancel() {
    this._modalRef.destroy();
  }


}
