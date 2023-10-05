import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import { NzModalRef } from "ng-zorro-antd/modal";
import { Globals } from "../../../../../shared/globals";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { MESSAGE } from "../../../../../constants/message";

@Component({
  selector: 'app-dialog-them-moi-kh-mua-hang-dtqg',
  templateUrl: './dialog-them-moi-kh-mua-hang-dtqg.component.html',
  styleUrls: ['./dialog-them-moi-kh-mua-hang-dtqg.component.scss']
})
export class DialogThemMoiKhMuaHangDtqgComponent implements OnInit {
  formData: FormGroup;
  listDataGroup = [];
  danhMuc: string;
  isViewDanhMuc: boolean = false;
  constructor(private _modalRef: NzModalRef,
              private fb: FormBuilder,
              public globals: Globals,
              private notification: NzNotificationService,) {
    this.formData = this.fb.group({
      tenDvi: [null],
      maSoDvi: [null],
      nhomMatHang: [null],
      maSoNhomMatHang: [null],
      coNhieuMatHang: [false]
    });
  }

  ngOnInit(): void {
    if (this.danhMuc != null) {
      this.listDataGroup.forEach(item => {
        if (this.danhMuc == item.danhMuc) {
          this.formData.get('maSoDvi').setValue(item.maSo);
          this.formData.get('tenDvi').setValue(item.danhMuc)
        }
      });
      this.isViewDanhMuc = true;
    }
  }

  changeDvi(event?: any) {
    this.listDataGroup.forEach(item => {
      if (event == item.danhMuc) {
        this.formData.get('maSoDvi').setValue(item.maSo)
      }
    });
  }

  onCancel() {
    this._modalRef.destroy();
  }
  save() {
    let res = {
      danhMuc: this.formData.get('tenDvi').value,
      maSo: this.formData.get('maSoDvi').value,
      children: []
    }
    res.children =[
      {
        coNhieuMatHang: this.formData.get('coNhieuMatHang').value,
        edit: !this.formData.get('coNhieuMatHang').value,
        danhMuc: this.formData.get('nhomMatHang').value,
        maSo: this.formData.get('maSoNhomMatHang').value,
        children: []
      }
    ]
    this._modalRef.close(res);
  }
}
