import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as dayjs from 'dayjs';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DonviService } from 'src/app/services/donvi.service';
import { KeHoachMuoi } from '../../../models/KeHoachMuoi';

@Component({
  selector: 'dialog-phieu-kiem-tra-chat-luong',
  templateUrl: './dialog-phieu-kiem-tra-chat-luong.component.html',
  styleUrls: ['./dialog-phieu-kiem-tra-chat-luong.component.scss'],
})
export class DialogPhieuKiemTraChatLuongComponent implements OnInit {
  formData: FormGroup;
  yearNow: number = 0;

  data: any = null

  options: any[] = [];
  optionsDonVi: any[] = [];
  optionsDVT: any[] = [];
  optionsDonViTinh: any[] = [];
  thongTinMuoi: KeHoachMuoi;
  constructor(
    private fb: FormBuilder,
    private _modalRef: NzModalRef,
    private donViService: DonviService,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
  ) { }

  async ngOnInit() {
    this.yearNow = dayjs().get('year');
    this.oninitForm();

    this.spinner.show();
    try {
      this.spinner.hide();
    } catch (err) {
      this.spinner.hide();
    }
  }
  oninitForm() {
    this.formData = this.fb.group({});
  }

  handleOk() {
    this._modalRef.close(this.formData);
  }

  handleCancel() {
    this._modalRef.destroy();
  }
}
