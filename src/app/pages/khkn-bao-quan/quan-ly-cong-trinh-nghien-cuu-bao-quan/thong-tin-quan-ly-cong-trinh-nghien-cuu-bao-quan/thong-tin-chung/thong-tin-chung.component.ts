import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import * as dayjs from "dayjs";
import { MESSAGE } from "../../../../../constants/message";
import { DanhMucService } from "../../../../../services/danhmuc.service";
import { STATUS } from "../../../../../constants/status";
import { BaseComponent } from 'src/app/components/base/base.component';
import { HelperService } from 'src/app/services/helper.service';
import { Globals } from 'src/app/shared/globals';
import { StorageService } from 'src/app/services/storage.service';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-thong-tin-chung',
  templateUrl: './thong-tin-chung.component.html',
  styleUrls: ['./thong-tin-chung.component.scss']
})
export class ThongTinChungComponent extends BaseComponent implements OnInit {
  @Input() id: number;

  @Input() formThongTinChung: any = {};
  @Output()
  formThongTinChungSubmit = new EventEmitter<any>();

  @Input() isView: boolean;

  @Input() typeVthh: string;

  @Input() idInput: number;

  @Output()
  showListEvent = new EventEmitter<any>();

  listCapDt: any[] = [];
  listNam: any[] = [];

  listTrangThai: any[] = [
    { ma: STATUS.DU_THAO, giaTri: 'Dự thảo' },
    // { ma: STATUS.DA_DUYET, giaTri: 'Đã duyệt' },
    { ma: STATUS.DANG_THUC_HIEN, giaTri: 'Đang thực hiện' },
    { ma: STATUS.DA_NGHIEM_THU, giaTri: 'Đã nghiệm thu' }
  ];


  constructor(
    private httpClient: HttpClient,
    private storageService: StorageService,
    private danhMucService: DanhMucService,
    public globals: Globals
  ) {
    super(httpClient, storageService, danhMucService);
    super.ngOnInit();
    this.formData = this.fb.group({
      maDeTai: ['', [Validators.required]],
      tenDeTai: ['', [Validators.required]],
      capDeTai: ['', [Validators.required]],
      tuNam: [],
      denNam: [],
      chuNhiem: [''],
      chucVu: [],
      email: [null,],
      sdt: [null],
      suCanThiet: [null],
      mucTieu: [null],
      phamVi: [null],
      trangThai: [null,],
      tongChiPhi: [null],
      phuongPhap: [null],
      noiDung: [null],
    });
  }

  ngOnInit() {
    let dayNow = dayjs().get('year');
    for (let i = -3; i < 23; i++) {
      this.listNam.push({
        value: dayNow - i,
        text: dayNow - i,
      });
    }
    this.getListCapDt();
    this.helperService.bidingDataInFormGroup(this.formData, this.formThongTinChung);
  }

  save() {
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      return false;
    } else {
      return true;
    }
  }

  initForm() {

  }

  onChangeInput() {
    this.formThongTinChung = this.formData.value;
    console.log(this.formThongTinChung);
    this.formThongTinChungSubmit.emit(this.formThongTinChung);
  }

  async getListCapDt() {
    this.listCapDt = [];
    let res = await this.danhMucService.danhMucChungGetAll('CAP_DE_TAI');
    if (res.msg == MESSAGE.SUCCESS) {
      this.listCapDt = res.data;
    }
  }
}
