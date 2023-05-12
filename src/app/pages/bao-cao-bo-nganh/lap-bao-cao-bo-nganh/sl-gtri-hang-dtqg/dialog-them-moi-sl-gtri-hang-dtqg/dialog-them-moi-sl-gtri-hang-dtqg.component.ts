import { Component, OnInit } from "@angular/core";
import { NzModalRef } from "ng-zorro-antd/modal";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Globals } from "../../../../../shared/globals";
import { MESSAGE } from "../../../../../constants/message";
import { NzNotificationService } from "ng-zorro-antd/notification";

@Component({
  selector: 'app-dialog-them-moi-sl-gtri-hang-dtqg',
  templateUrl: './dialog-them-moi-sl-gtri-hang-dtqg.component.html',
  styleUrls: ['./dialog-them-moi-sl-gtri-hang-dtqg.component.scss']
})
export class DialogThemMoiSlGtriHangDtqgComponent implements OnInit {
  formData: FormGroup;
  listDataGroup = [];
  constructor(private _modalRef: NzModalRef,
              private fb: FormBuilder,
              public globals: Globals,
              private notification: NzNotificationService,) {
    this.formData = this.fb.group({
      tenDvi: [null],
      maSoDvi: [null],
      nhomMatHang: [null],
      maSoNhomMatHang: [null],
    });
  }

  ngOnInit(): void {
  }

  changeDvi(event?: any) {
    this.listDataGroup.forEach(item => {
      if (event.nzValue == item.danhMuc) {
        this.formData.get('maSoDvi').setValue(item.maSo)
      }
    });
  }

  onCancel() {
    this._modalRef.destroy();
  }
  save() {
    let isDuplicated = false;
    this.listDataGroup.forEach(item => {
      if (this.formData.get('tenDvi').value == item.danhMuc) {
        item.children.forEach(nhomMh => {
          if (this.formData.get('nhomMatHang').value == nhomMh.danhMuc) {
            isDuplicated = true;
          }
        })
      }
    })
    if (isDuplicated) {
      this.notification.error(
        MESSAGE.ERROR,
        'Nhóm mặt hàng đã tồn tại',
      );
      return;
    }
    let res = {
      danhMuc: this.formData.get('tenDvi').value,
      maSo: this.formData.get('maSoDvi').value,
      children: []
    }
    res.children =[
      {
        danhMuc: this.formData.get('nhomMatHang').value,
        maSo: this.formData.get('maSoNhomMatHang').value,
        children: []
      }
    ]
    this._modalRef.close(res);
  }
}
