import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DanhMucService} from "../../../../../../services/danhmuc.service";
import {MESSAGE} from "../../../../../../constants/message";
import {Globals} from "../../../../../../shared/globals";
import {AMOUNT} from "../../../../../../Utility/utils";
import {NzModalRef} from "ng-zorro-antd/modal";
import {HelperService} from "../../../../../../services/helper.service";
import {NzNotificationService} from "ng-zorro-antd/notification";

@Component({
  selector: 'app-pop-up-chi-tiet-quy-hoach-kho',
  templateUrl: './pop-up-chi-tiet-quy-hoach-kho.component.html',
  styleUrls: ['./pop-up-chi-tiet-quy-hoach-kho.component.scss']
})
export class PopUpChiTietQuyHoachKhoComponent implements OnInit {
  formData: FormGroup;
  fb: FormBuilder = new FormBuilder();
  listVungMien: any[] = [];
  amount = AMOUNT;
  type: string;
  dataInput: any;

  constructor(
    private danhMucService: DanhMucService,
    public globals: Globals,
    public nzModal: NzModalRef,
    private helperService: HelperService,
    private notification: NzNotificationService
  ) {
    this.formData = this.fb.group(
      {
        id: [null],
        vungMien: [null],
        tenVungMien: [null],
        diaDiemKho: [null],
        slKhoTuyenI: [null],
        slKhoTuyenII: [null],
        slKhoDaDuyet: [null],
        slKho: [null],
        dienTichDk: [null],
        tichLuong: [null],
        dtKhoTuyenI: [null],
        dtKhoTuyenII: [null],
        dtKho: [null],
        ghiChu: [null],
        hinhThuc: [null],
        loai: [null]
      })
  }

  ngOnInit(): void {
    this.loadDsVungMien();
    this.initForm();
  }

  setRequired() {
    this.formData.controls["vungMien"].setValidators([Validators.required]);
    this.formData.controls["diaDiemKho"].setValidators([Validators.required]);
    this.formData.controls["slKhoDaDuyet"].setValidators([Validators.required]);
    this.formData.controls["dienTichDk"].setValidators([Validators.required]);
    this.formData.controls["tichLuong"].setValidators([Validators.required]);
    this.formData.controls["ghiChu"].setValidators([Validators.required]);
    if (this.type == '00') {
      this.formData.controls["slKhoTuyenI"].setValidators([Validators.required]);
      this.formData.controls["slKhoTuyenII"].setValidators([Validators.required]);
      this.formData.controls["dtKhoTuyenI"].setValidators([Validators.required]);
      this.formData.controls["dtKhoTuyenII"].setValidators([Validators.required]);
    } else {
      this.formData.controls["slKho"].setValidators([Validators.required]);
      this.formData.controls["dtKho"].setValidators([Validators.required]);
      this.formData.controls["hinhThuc"].setValidators([Validators.required]);
    }
  }

  initForm() {
    if (this.dataInput) {
      this.formData.patchValue({
        vungMien: this.dataInput && this.dataInput.vungMien ? this.dataInput.vungMien : null,
        tenVungMien: this.dataInput && this.dataInput.tenVungMien ? this.dataInput.tenVungMien : null,
        diaDiemKho: this.dataInput && this.dataInput.diaDiemKho ? this.dataInput.diaDiemKho : null,
        slKhoTuyenI: this.dataInput && this.dataInput.slKhoTuyenI ? this.dataInput.slKhoTuyenI : null,
        slKhoTuyenII: this.dataInput && this.dataInput.slKhoTuyenII ? this.dataInput.slKhoTuyenII : null,
        slKhoDaDuyet: this.dataInput && this.dataInput.slKhoDaDuyet ? this.dataInput.slKhoDaDuyet : null,
        slKho: this.dataInput && this.dataInput.slKho ? this.dataInput.slKho : null,
        dienTichDk: this.dataInput && this.dataInput.dienTichDk ? this.dataInput.dienTichDk : null,
        tichLuong: this.dataInput && this.dataInput.tichLuong ? this.dataInput.tichLuong : null,
        dtKhoTuyenI: this.dataInput && this.dataInput.dtKhoTuyenI ? this.dataInput.dtKhoTuyenI : null,
        dtKhoTuyenII: this.dataInput && this.dataInput.dtKhoTuyenII ? this.dataInput.dtKhoTuyenII : null,
        dtKho: this.dataInput && this.dataInput.dtKho ? this.dataInput.dtKho : null,
        ghiChu: this.dataInput && this.dataInput.ghiChu ? this.dataInput.ghiChu : null,
        hinhThuc: this.dataInput && this.dataInput.hinhThuc ? this.dataInput.hinhThuc : null,
      })
    }
  }

  async loadDsVungMien() {
    let res = await this.danhMucService.danhMucChungGetAll('VUNG_MIEN');
    if (res.msg == MESSAGE.SUCCESS) {
      this.listVungMien = res.data;
    }
  }

  handleOk() {
    this.helperService.removeValidators(this.formData);
    this.setRequired();
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.FORM_REQUIRED_ERROR);
      return;
    }
    this.formData.patchValue({
      loai : this.type
    })
    this.nzModal.close(this.formData.value);
  }

  onCancel() {
    this.nzModal.close();
  }

  changeVungMien(event: any) {
    let item = this.listVungMien.find(item => item.ma == event);
    if (item) {
      this.formData.patchValue({
        tenVungMien: item.giaTri
      })
    }
  }
}
