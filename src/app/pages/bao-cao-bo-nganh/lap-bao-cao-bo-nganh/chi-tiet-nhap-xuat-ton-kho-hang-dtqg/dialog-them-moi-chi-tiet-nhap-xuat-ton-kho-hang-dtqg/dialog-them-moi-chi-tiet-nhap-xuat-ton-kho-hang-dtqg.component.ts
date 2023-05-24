import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import { NzModalRef } from "ng-zorro-antd/modal";
import { Globals } from "../../../../../shared/globals";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { MESSAGE } from "../../../../../constants/message";
import dayjs from 'dayjs';

@Component({
  selector: 'app-dialog-them-moi-chi-tiet-nhap-xuat-ton-kho-hang-dtqg',
  templateUrl: './dialog-them-moi-chi-tiet-nhap-xuat-ton-kho-hang-dtqg.component.html',
  styleUrls: ['./dialog-them-moi-chi-tiet-nhap-xuat-ton-kho-hang-dtqg.component.scss']
})
export class DialogThemMoiChiTietNhapXuatTonKhoHangDtqgComponent implements OnInit {
  formData: FormGroup;
  listDataGroup = [];
  listNam: any[] = [];
  yearNow = dayjs().get('year');
  constructor(private _modalRef: NzModalRef,
    private fb: FormBuilder,
    public globals: Globals,
    private notification: NzNotificationService,) {
    this.formData = this.fb.group({
      matHang: [null],
      tenLoaiVthh: [null],
      tenCloaiVthh: [null],
      coNhieuMatHang: [false]
    });
  }

  ngOnInit(): void {
    for (let i = -3; i < 23; i++) {
      this.listNam.push({
        value: this.yearNow - i,
        text: this.yearNow - i,
      });
    }
  }

  onCancel() {
    this._modalRef.destroy();
  }
  save() {
    let isDuplicated = false;
    debugger
    this.listDataGroup.forEach(item => {
      if (this.formData.get('matHang').value == item.matHang) {
        item.children.forEach(res => {
          res.children.forEach(data =>{
            if (this.formData.get('tenCloaiVthh').value == data.tenCloaiVthh) {
              isDuplicated = true;
            }
          })
        })
      }
    })
    if (isDuplicated) {
      this.notification.error(
        MESSAGE.ERROR,
        'Chủng loại hàng hóa đã tồn tại',
      );
      return;
    }

    let res = {
      matHang: this.formData.get('matHang').value,
      children: []
    }
    res.children = [
      {
        tenLoaiVthh: this.formData.get('tenLoaiVthh').value,
        children: []
      }
    ]
    res.children[0].children = [
      {
        coNhieuMatHang: this.formData.get('coNhieuMatHang').value,
        edit: !this.formData.get('coNhieuMatHang').value,
        tenCloaiVthh: this.formData.get('tenCloaiVthh').value,
        children: []
      }
    ]
    this._modalRef.close(res);
  }
}
