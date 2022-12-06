import {Component, OnInit} from '@angular/core';
import {NzModalRef} from "ng-zorro-antd/modal";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Globals} from "../../../shared/globals";
import {MangLuoiKhoService} from "../../../services/quan-ly-kho-tang/mangLuoiKho.service";
import {NgxSpinnerService} from "ngx-spinner";
import {HelperService} from "../../../services/helper.service";
import {MESSAGE} from "../../../constants/message";
import {DanhMucService} from "../../../services/danhmuc.service";
import {API_STATUS_CODE} from "../../../constants/config";
import * as dayjs from "dayjs";

@Component({
  selector: 'app-dialog-them-moi-so-du-dau-ky',
  templateUrl: './dialog-them-moi-so-du-dau-ky.component.html',
  styleUrls: ['./dialog-them-moi-so-du-dau-ky.component.scss']
})
export class DialogThemMoiSoDuDauKyComponent implements OnInit {
  m3: string = 'm3';
  formData: FormGroup;
  detail: any;
  listVthh: any[] = [];
  listCloaiVthh: any[] = [];
  dsNam: any[] = [];
  dvi: string = 'Tấn kho';

  constructor(
    private _modalRef: NzModalRef,
    private notification: NzNotificationService,
    private khoService: MangLuoiKhoService,
    private danhMucService: DanhMucService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    public globals: Globals,
    private helperService: HelperService
  ) {
    this.formData = this.fb.group({
      maNganlo: [],
      tenNganlo: [],
      tichLuongDaSdLt: ['', Validators.required],
      tichLuongDaSdVt: ['', Validators.required],
      theTichDaSdVt: ['', Validators.required],
      theTichDaSdLt: ['', Validators.required],
      namNhap: ['', Validators.required],
      ngayNhapCuoi: [''],
      loaiVthh: ['', Validators.required],
      cloaiVthh: ['', Validators.required],
      soLuongTonKho: ['', Validators.required],
      donViTinh: ['']
    })
  }

  async ngOnInit() {
    await Promise.all([
      this.getAllLoaiVthh(),
      this.loadDsNam(),
      this.getDetail()
    ])
  }

  async loadDsNam() {
      let thisYear = dayjs().get('year');
      for (let i = -3; i < 23; i++) {
        this.dsNam.push((thisYear + i).toString());
      }
  }

  async getDetail() {
    if (this.detail) {
      this.formData.patchValue({
        maNganlo: this.detail.maDvi ? this.detail.maDvi : null,
        tenNganlo: this.detail.tenDvi ? this.detail.tenDvi : null,
      })
    }
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

  async getAllLoaiVthh() {
    let res = await this.danhMucService.danhMucChungGetAll('LOAI_HHOA');
    if (res.msg == MESSAGE.SUCCESS) {
      this.listVthh = res.data;
    }
  }

  async onChangeLoaiVthh(event) {
    let body = {
      "str": event
    };
    let res = await this.danhMucService.loadDanhMucHangHoaTheoMaCha(body);
    this.listCloaiVthh = [];
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data) {
        this.listCloaiVthh = res.data;
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async onChangCloaiVthh(event) {
    let res = await this.danhMucService.getDetail(event);
    if (res.msg == MESSAGE.SUCCESS) {
      this.formData.patchValue({
        donViTinh: res.data ? res.data.maDviTinh : null
      })
    }
  }
}
