import {Component, Input, OnInit} from '@angular/core';
import {NzModalRef, NzModalService} from 'ng-zorro-antd/modal';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NgxSpinnerService} from 'ngx-spinner';
import {Base2Component} from "../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../services/storage.service";
import {DanhMucService} from "../../../../services/danhmuc.service";
import {Validators} from "@angular/forms";
import {MESSAGE} from "../../../../constants/message";
import {TrangThaiHoatDong} from "../../../../constants/status";
import {DanhMucDviLqService} from "../../../../services/quantri-danhmuc/danh-muc-dvi-lq.service";

@Component({
  selector: 'app-them-moi-dm-dvi-lq',
  templateUrl: './them-moi-dm-dvi-lq.component.html',
  styleUrls: ['./them-moi-dm-dvi-lq.component.scss']
})
export class ThemMoiDmDviLqComponent extends Base2Component implements OnInit {
  @Input() idInput : number;
  listType = [{"ma": "00", "giaTri": "Cá nhân"}, {"ma": "01", "giaTri": "Công ty"}];
  listPloai : any[] = [];
  constructor(
    private httpClient: HttpClient,
    private storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private dmDviLqService : DanhMucDviLqService,
    private dmService : DanhMucService,
    private _modalRef : NzModalRef
  ) {
    super(httpClient, storageService, notification, spinner, modal, dmDviLqService);
    super.ngOnInit()
    this.formData = this.fb.group({
      id   : [null],
      mstCccd : [null, Validators.required],
      ten : [null, Validators.required],
      sdt : [null , Validators.required],
      fax : [null],
      diaChi : [null ,Validators.required],
      stk : [null ,Validators.required],
      nganHang : [null ,Validators.required],
      nguoiDdien : [null],
      chucVu : [null],
      ghiChu : [null ],
      phanLoai : [null],
      phanLoaiMua : [null],
      phanLoaiBan : [null],
      phanLoaiDg : [null],
      trangThai : [true ,Validators.required],
      type : ['00']
    });
  }

  async ngOnInit() {
    if (this.idInput > 0) {
      this.getDetail(this.idInput)
    }
  }

  async save() {
    this.helperService.markFormGroupTouched(this.formData)
    if (this.formData.invalid) {
      return;
    }
    if (this.listPloai.length <= 0) {
      this.notification.error(MESSAGE.ERROR, "Bạn chưa nhập phân loại danh mục!");
      return;
    }
    this.formData.value.phanLoai = this.listPloai.toString();
    this.formData.value.trangThai = this.formData.value.trangThai == true ? TrangThaiHoatDong.HOAT_DONG : TrangThaiHoatDong.KHONG_HOAT_DONG
    let res = await this.createUpdate(this.formData.value)
    if (res) {
      this._modalRef.close(res);
    }
  }

  handleCancel() {
    this._modalRef.destroy();
  }

  changeLoaiDvi(event) {
    this.listPloai = []
    switch (event) {
      case "00" : {
        this.formData.value.fax = null
        this.formData.value.nguoiDdien = null
        this.formData.value.chucVu = null
        this.formData.controls["nguoiDdien"].clearValidators();
        this.formData.controls["chucVu"].clearValidators();
        break;
      }
      case "01" : {
        this.formData.controls["nguoiDdien"].setValidators([Validators.required]);
        this.formData.controls["chucVu"].setValidators([Validators.required]);
        break;
      }
    }
  }

  addPloai(type : string, event) {
    if (event) {
      if (!this.listPloai.includes(type)) {
        this.listPloai.push(type)
      }
    } else {
      let idx = this.listPloai.indexOf(type)
      if (idx != -1) {
        this.listPloai.splice(idx , 1);
      }
    }
  }

  async getDetail(id) {
    this.spinner.show();
    try {
      let res = await this.dmDviLqService.getDetail(id);
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          const data = res.data;
          this.helperService.bidingDataInFormGroup(this.formData, data);
          this.listPloai = this.formData.value.phanLoai ? this.formData.value.phanLoai.split(",") : null
          this.formData.value.trangThai = this.formData.value.trangThai == TrangThaiHoatDong.HOAT_DONG ? true : false
          await this.updatePhanLoai(this.listPloai)
        }
      }
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, e);
      this.spinner.hide();
    } finally {
      this.spinner.hide();
    }
  }

  updatePhanLoai(table : any[]) {
    if (table && table.length > 0) {
      if (table.includes("00")) {
        this.formData.patchValue({
          phanLoaiMua : true
        })
      }
      if (table.includes("01")) {
        this.formData.patchValue({
          phanLoaiBan : true
        })
      }
      if (table.includes("02")) {
        this.formData.patchValue({
          phanLoaiDg : true
        })
      }
    }
  }
}
