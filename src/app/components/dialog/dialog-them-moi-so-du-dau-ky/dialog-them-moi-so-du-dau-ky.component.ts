import { Component, OnInit } from '@angular/core';
import {NzModalRef} from "ng-zorro-antd/modal";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Globals} from "../../../shared/globals";
import {MangLuoiKhoService} from "../../../services/quan-ly-kho-tang/mangLuoiKho.service";
import {NgxSpinnerService} from "ngx-spinner";
import {HelperService} from "../../../services/helper.service";

@Component({
  selector: 'app-dialog-them-moi-so-du-dau-ky',
  templateUrl: './dialog-them-moi-so-du-dau-ky.component.html',
  styleUrls: ['./dialog-them-moi-so-du-dau-ky.component.scss']
})
export class DialogThemMoiSoDuDauKyComponent implements OnInit {
  m3: string = 'm3';
  formData : FormGroup;
  detail : any;

  constructor(
    private _modalRef: NzModalRef,
    private notification: NzNotificationService,
    private khoService: MangLuoiKhoService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    public globals : Globals,
    private helperService: HelperService
  ) {
      this.formData = this.fb.group({
        maNganLo : [''],
        tenNganLo : [''],
        tichLuongDaSdLt : ['', Validators.required],
        tichLuongDaSdVt : ['', Validators.required],
        theTichDaSdVt : ['', Validators.required],
        theTichDaSdLt : ['', Validators.required],
        ngayNhapKho : ['', Validators.required],
        ngayNhapCuoi : [''],
        loaiVthh : ['', Validators.required],
        cloaiVthh : ['', Validators.required],
        soLuongTonKho : ['', Validators.required],
        donViTinh : ['']
      })
    }

  ngOnInit(): void {
  }


  save() {
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      return;
    }
  }

  handleCancel() {
    this._modalRef.close();
  }
}
