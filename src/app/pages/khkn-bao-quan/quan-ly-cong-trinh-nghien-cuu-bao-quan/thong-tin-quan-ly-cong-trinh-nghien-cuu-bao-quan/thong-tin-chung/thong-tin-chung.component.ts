import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import * as dayjs from "dayjs";
import {MESSAGE} from "../../../../../constants/message";
import {DanhMucService} from "../../../../../services/danhmuc.service";
import {STATUS} from "../../../../../constants/status";


@Component({
  selector: 'app-thong-tin-chung',
  templateUrl: './thong-tin-chung.component.html',
  styleUrls: ['./thong-tin-chung.component.scss']
})
export class ThongTinChungComponent implements OnInit {
  @Input() id: number;
  @Input() isView: boolean;
  @Input() typeVthh: string;
  @Input() idInput: number;
  @Output()
  showListEvent = new EventEmitter<any>();
  formData: FormGroup;
  listCapDt: any[] = [];
  listNam: any[] = [];
  STATUS: STATUS;
  listTrangThai: any[] = [{ma: STATUS.DU_THAO, giaTri: 'Dự thảo'}, {ma: STATUS.DA_DUYET, giaTri: 'Đã duyệt'}, {
    ma: STATUS.DANG_THUC_HIEN,
    giaTri: 'Đang thực hiện'
  }, {ma: STATUS.DA_NGHIEM_THU, giaTri: 'Đã nghiệm thu'}];

  constructor(private fb: FormBuilder, private danhMucService: DanhMucService,) {
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
    // this.initForm();
  }

  selectTab() {

  }

  initForm() {
    this.formData = this.fb.group({
      "maDt": [null, [Validators.required]],
      "tenDt": [null, [Validators.required]],
      "capDt": [null, [Validators.required]],
      "tuNam": [null, [Validators.required]],
      "denNam": [null, [Validators.required]],
      "chuNhiemDt": [null, []],
      "chucVu": [null, []],
      "email": [null, []],
      "soDt": [null, []],
      "suCanThiet": [null, []],
      "mucTieu": [null, []],
      "phamVi": [null, []],
      "trangThaiTh": [null, [STATUS.DU_THAO]],
      "tongChiPhi": [null, []],
      "ppNghienCuu": [null, []],
      "noiDungDt": [null, []],
    })
  }

  async getListCapDt() {
    this.listCapDt = [];
    let res = await this.danhMucService.danhMucChungGetAll('CAP_DE_TAI');
    if (res.msg == MESSAGE.SUCCESS) {
      this.listCapDt = res.data;
    }
  }
}
