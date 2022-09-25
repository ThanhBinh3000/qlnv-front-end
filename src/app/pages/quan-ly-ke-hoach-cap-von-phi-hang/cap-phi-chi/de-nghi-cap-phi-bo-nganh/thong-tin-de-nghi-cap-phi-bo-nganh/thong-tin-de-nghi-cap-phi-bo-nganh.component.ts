// import { Component, OnInit } from '@angular/core';
import { Component, EventEmitter, Input, OnInit, Output, } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import * as dayjs from 'dayjs';
import { cloneDeep } from 'lodash';
import { MESSAGE } from 'src/app/constants/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { isEmpty } from 'lodash';
import { DonviService } from 'src/app/services/donvi.service';
import { convertTrangThai } from 'src/app/shared/commonFunction';
import { saveAs } from 'file-saver';
import { Globals } from 'src/app/shared/globals';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { DeNghiCapPhiBoNganhService } from 'src/app/services/ke-hoach/von-phi/deNghiCapPhiBoNganh.service';

@Component({
  selector: 'app-thong-tin-de-nghi-cap-phi-bo-nganh',
  templateUrl: './thong-tin-de-nghi-cap-phi-bo-nganh.component.html',
  styleUrls: ['./thong-tin-de-nghi-cap-phi-bo-nganh.component.scss']
})
export class ThongTinDeNghiCapPhiBoNganhComponent implements OnInit {
  @Input() idInput: number;
  @Input() isView: boolean;
  @Output()
  showListEvent = new EventEmitter<any>();
  @Input() id: number;

  formData: FormGroup;
  yearNow: number = 0;

  listNam: any[] = [];
  listBoNganh: any[] = [];
  listLoaiHangHoa: any[] = [];
  listChungLoaiHangHoa: any[] = [];
  listLoaiChiPhi: any[] = [];

  hanghoa: any = {
    "maLoaiHangHoa": "",
    "maChungLoaiHangHoa": "",
    "tenHangHoa": "",
  }
  // bảng 1
  ct1List: any = {}
  // bảng 2
  ct2List: any = {}

  create: any = {}
  create2: any = {}
  editDataCache: { [key: string]: { edit: boolean; data: any } } = {};
  editDataCache2: { [key: string]: { edit: boolean; data: any } } = {};

  constructor(
    private deNghiCapPhiBoNganhService: DeNghiCapPhiBoNganhService,
    private fb: FormBuilder,
    public globals: Globals,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    private danhMucService: DanhMucService,

  ) { }

  async ngOnInit(): Promise<void> {
    try {
      this.spinner.show()
      this.initForm()


      Promise.all([this.getListNam(), this.getListBoNganh(), this.loaiVTHHGetAll()])
      this.spinner.hide()
    } catch (error) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      this.spinner.hide();
    }
  }
  initForm() {
    this.formData = this.fb.group({
      "nam": [null, [Validators.required]],
      "maBoNganh": [null, [Validators.required]],
      "soDeNghi": [null, [Validators.required]],
      "ngayDeNghi": [null, [Validators.required]],
    })
  }

  async loaiVTHHGetAll() {
    try {
      await this.danhMucService.loadDanhMucHangHoa().subscribe((hangHoa) => {
        if (hangHoa.msg == MESSAGE.SUCCESS) {
          hangHoa.data.forEach((item) => {
            if (item.cap === "1" && item.ma != '01') {
              this.listLoaiHangHoa = [...this.listLoaiHangHoa, item];
            }
            else {
              this.listLoaiHangHoa = [...this.listLoaiHangHoa, ...item.child];
            }
            console.log(this.listLoaiHangHoa);

          })
        }
      })
    } catch (error) {
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }
  async changeLoaiHangHoa(id: any) {
    console.log(id);
    if (id && id > 0) {
      let loaiHangHoa = this.listLoaiHangHoa.filter(item => item.ma === id);
      this.listChungLoaiHangHoa = loaiHangHoa[0].child;
    }
  }
  onChangeChungLoaiHH(id: any) {
    console.log(id);
    console.log(this.listChungLoaiHangHoa);
  }
  getListNam() {
    this.yearNow = dayjs().get('year');
    for (let i = -3; i < 23; i++) {
      this.listNam.push({
        value: this.yearNow - i,
        text: this.yearNow - i,
      });
    }
  }
  async getListBoNganh() {
    this.listBoNganh = [];
    let res = await this.danhMucService.danhMucChungGetAll('BO_NGANH');
    if (res.msg == MESSAGE.SUCCESS) {
      this.listBoNganh = res.data;
    }
  }
  sortTableId() {
    this.ct1List?.chiTiets.forEach((lt, i) => {
      lt.stt = i + 1;
    });
  }

  addRow() {
    if (!this.ct1List?.chiTiets) {
      this.ct1List.chiTiets = [];
    }
    this.sortTableId();
    let item = cloneDeep(this.create);
    item.stt = this.ct1List?.chiTiets.length + 1;
    this.ct1List.chiTiets = [
      ...this.ct1List?.chiTiets,
      item,
    ]
    this.updateEditCache();
    this.clearItemRow();

  }
  clearItemRow() {
    this.create = {};
  }
  updateEditCache(): void {
    if (this.ct1List?.chiTiets && this.ct1List?.chiTiets.length > 0) {
      this.ct1List?.chiTiets.forEach((item) => {
        this.editDataCache[item.stt] = {
          edit: false,
          data: { ...item },
        };
      });
    }
  }
  editRow(stt: number) {
    this.editDataCache[stt].edit = true;
  }
  deleteRow(data: any) {
    this.ct1List.chiTiets = this.ct1List?.chiTiets.filter(x => x.stt != data.stt);
    this.sortTableId();
    this.updateEditCache();
  }
  saveEdit(stt: number): void {
    const index = this.ct1List?.chiTiets.findIndex(item => item.stt === stt);
    Object.assign(this.ct1List?.chiTiets[index], this.editDataCache[stt].data);
    this.editDataCache[stt].edit = false;
  }

  cancelEdit(stt: number): void {
    const index = this.ct1List?.chiTiets.findIndex(item => item.stt === stt);
    this.editDataCache[stt] = {
      data: { ...this.ct1List?.detail[index] },
      edit: false
    };
  }

  /* **********************************************************/
  sortTableId2() {
    this.ct2List?.chiTiets.forEach((lt, i) => {
      lt.stt = i + 1;
    });
  }

  addRow2() {
    if (!this.ct2List?.chiTiets) {
      this.ct2List.chiTiets = [];
    }
    this.sortTableId2();
    let item = cloneDeep(this.create2);
    item.stt = this.ct2List?.chiTiets.length + 1;
    this.ct2List.chiTiets = [
      ...this.ct2List?.chiTiets,
      item,
    ]
    this.updateEditCache2();
    this.clearItemRow2();

  }
  clearItemRow2() {
    this.create2 = {};
  }
  updateEditCache2(): void {
    if (this.ct2List?.chiTiets && this.ct2List?.chiTiets.length > 0) {
      this.ct2List?.chiTiets.forEach((item) => {
        this.editDataCache2[item.stt] = {
          edit: false,
          data: { ...item },
        };
      });
    }
  }
  editRow2(stt: number) {
    this.editDataCache2[stt].edit = true;
  }
  deleteRow2(data: any) {
    this.ct2List.chiTiets = this.ct2List?.chiTiets.filter(x => x.stt != data.stt);
    this.sortTableId2();
    this.updateEditCache2();
  }
  saveEdit2(stt: number): void {
    const index = this.ct2List?.chiTiets.findIndex(item => item.stt === stt);
    Object.assign(this.ct2List?.chiTiets[index], this.editDataCache2[stt].data);
    this.editDataCache2[stt].edit = false;
  }

  cancelEdit2(stt: number): void {
    const index = this.ct2List?.chiTiets.findIndex(item => item.stt === stt);
    this.editDataCache2[stt] = {
      data: { ...this.ct2List?.detail[index] },
      edit: false
    };
  }
  /* **********************************************************/

  isDisableField() {

  }
  back() {
    this.showListEvent.emit();
  }

  tongBang1() {
    if (this.ct1List && this.ct1List?.chiTiets && this.ct1List?.chiTiets.length > 0) {
      let sum = this.ct1List.chiTiets.map((item) => item.ycCapThemPhi).reduce((prev, next) => Number(prev) + Number(next));
      return sum ?? 0;
    } else {
      return 0
    }
  }
  tongChiPhiBang2() {
    if (this.ct2List && this.ct2List?.chiTiets && this.ct2List?.chiTiets.length > 0) {
      let sum = this.ct2List.chiTiets.map((item) => item.tongTien).reduce((prev, next) => Number(prev) + Number(next));
      return sum ?? 0;
    } else {
      return 0
    }
  }
  tongKinhPhiBang2() {
    if (this.ct2List && this.ct2List?.chiTiets && this.ct2List?.chiTiets.length > 0) {
      let sum = this.ct2List.chiTiets.map((item) => item.kinhPhiDaCap).reduce((prev, next) => Number(prev) + Number(next));
      return sum ?? 0;
    } else {
      return 0
    }
  }

}
