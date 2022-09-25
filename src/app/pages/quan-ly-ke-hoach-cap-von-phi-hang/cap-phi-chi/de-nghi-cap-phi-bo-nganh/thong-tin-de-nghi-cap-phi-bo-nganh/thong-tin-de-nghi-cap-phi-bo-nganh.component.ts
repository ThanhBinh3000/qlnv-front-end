import { NzModalService } from 'ng-zorro-antd/modal';
import { DeNghiCapPhiBoNganh } from './../../../../../models/DeNghiCapPhiBoNganh';
// import { Component, OnInit } from '@angular/core';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as dayjs from 'dayjs';
import { cloneDeep } from 'lodash';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { DeNghiCapPhiBoNganhService } from 'src/app/services/ke-hoach/von-phi/deNghiCapPhiBoNganh.service';
import { Globals } from 'src/app/shared/globals';

export class DeNghiCapPhi {
  stt: string;
  tenDonVi: string;
  soTaiKhoan: number;
  nganHang: string;
  ycCapThem: number;
  loaiHangHoa: string;
  chungLoaiHangHoa: string;
  tenHangHoa: string;
  isView: boolean;
  isEdit: boolean;
  idVirtual: number;
}
export class ChiTietDeNghiCapPhi {
  loaiChiPhi: string;
  namPhatSinh: number;
  tongChiPhi: number;
  kinhPhiDaCap: number;
  ycCapThem: number;
  isView: boolean;
  isEdit: boolean;
  idVirtual: number;
}


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
  deNghiCapPhiBoNganh: DeNghiCapPhiBoNganh = new DeNghiCapPhiBoNganh();

  deNghiCapPhi: DeNghiCapPhi = new DeNghiCapPhi();
  deNghiCapPhiCreate: DeNghiCapPhi = new DeNghiCapPhi();
  dsDeNghiCapPhiClone: Array<DeNghiCapPhi>;


  chiTieDeNghiCapPhi: ChiTietDeNghiCapPhi = new ChiTietDeNghiCapPhi();
  chiTieDeNghiCapPhiCreate: ChiTietDeNghiCapPhi = new ChiTietDeNghiCapPhi();
  dsChiTietDeNghiCapPhiClone: Array<ChiTietDeNghiCapPhi> = [];

  hanghoa: any = {
    "maLoaiHangHoa": "",
    "maChungLoaiHangHoa": "",
    "tenHangHoa": "",
  }


  cts: any[] = [];
  ct1s: any[] = [];
  detail: any = {};
  rowDisplay: any = {};
  rowEdit: any = {};

  oldDataEdit1: any = {};
  oldDataEdit2: any = {};
  create: any = {};
  create1: any = {};


  constructor(
    private deNghiCapPhiBoNganhService: DeNghiCapPhiBoNganhService,
    private fb: FormBuilder,
    public globals: Globals,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    private danhMucService: DanhMucService,
    private modal: NzModalService,

  ) { }




  isDisableField() {
    if (this.detail && (this.detail.trangThai == this.globals.prop.NHAP_CHO_DUYET_LD_VU)) {
      return true;
    }
  }


  selectRow(row, rowSet) {
    if (row) {
      if (rowSet === 'rowDisplay') {
        this.rowDisplay = cloneDeep(row);
        this.rowDisplay.isView = true;
      }
      else if (rowSet === 'rowEdit') {
        this.rowEdit = cloneDeep(row);
        this.rowEdit.isView = true;
        this.sortTableId('ct2s');
      }
    }
  }
  sortTableId(type) {
    if (type === 'ct1s') {
      this.ct1s.forEach((lt, i) => {
        lt.stt = i + 1;
      });
    }
    else if (type === 'ct2s') {
      this.rowEdit.ct2s.forEach((lt, i) => {
        lt.stt = i + 1;
      });
    }
  }

  deleteRow(item: any, type) {
    if (type === 'ct1s') {
      let temp = this.ct1s.filter(x => x.stt !== item.stt);
      this.ct1s = temp;
      this.sortTableId('ct1s');
    }
    else if (type === 'ct2s') {
      let temp = this.rowEdit.ct2s.filter(x => x.stt !== item.stt);
      this.rowEdit.ct2s = temp;
      this.sortTableId('ct2s');
    }
  }

  editRow(item, type) {
    if (type === 'ct1s') {
      this.rowEdit = cloneDeep(item);
      this.rowEdit.isView = false;
      this.oldDataEdit1 = cloneDeep(item);
    }
    else if (type === 'ct2s') {
      this.oldDataEdit2 = cloneDeep(item);
    }
    item.edit = true;
  }

  addRow() {
    if (!this.rowEdit.ct2s) {
      this.rowEdit.ct2s = [];
    }
    this.sortTableId('ct2s');
    let item = cloneDeep(this.create);
    item.stt = this.rowEdit.ct2s.length + 1;
    this.rowEdit.ct2s = [
      ...this.rowEdit.ct2s,
      item,
    ]
    this.clearItemRow();
  }

  clearItemRow() {
    this.create = {};
  }

  addRow1() {
    if (!this.rowEdit.ct2s) {
      this.rowEdit.ct2s = [];
    }
    this.sortTableId('ct2s');
    let item = cloneDeep(this.create);
    item.stt = this.rowEdit.ct2s.length + 1;
    this.rowEdit.ct2s = [
      ...this.rowEdit.ct2s,
      item,
    ]
    this.clearItemRow();
  }

  clearItemRow1() {
    this.create = {};
  }

  cancelEdit(item, type) {
    if (type === 'ct1s') {
      let index = this.ct1s.findIndex(x => x.stt === item.stt);
      if (index != -1) {
        let temp = cloneDeep(this.ct1s);
        temp[index] = cloneDeep(this.oldDataEdit1);
        this.ct1s = temp;
      }
      this.rowEdit.isView = true;
    }
    else if (type === 'ct2s') {
      let index = this.rowEdit.ct2s.findIndex(x => x.stt === item.stt);
      if (index != -1) {
        let temp = cloneDeep(this.rowEdit.ct2s);
        temp[index] = cloneDeep(this.oldDataEdit2);
        this.rowEdit.ct2s = temp;
      }
    }
    item.edit = false;
  }

  saveEdit(item, type) {
    item.edit = false;
    if (type === 'ct1s') {
      item.maVatTuCha = this.rowEdit.maVatTuCha;
      item.maVatTu = this.rowEdit.maVatTu;
      item.tenHangHoa = this.rowEdit.tenHangHoa;
      item.ct2s = cloneDeep(this.rowEdit.ct2s);
      this.rowEdit.isView = true;
    }
  }


  tongBang1(data) {
    if (data && data.length > 0) {
      let sum = data.map((item) => item.ycCapThemPhi).reduce((prev, next) => Number(prev) + Number(next));
      return sum ?? 0;
    } else {
      return 0
    }
  }

  tongChiPhiBang2(data) {
    if (data && data?.ct2s && data?.ct2s.length > 0) {
      let sum = data.ct2s.map((item) => item.tongTien).reduce((prev, next) => Number(prev) + Number(next));
      return sum ?? 0;
    } else {
      return 0
    }
  }

  tongKinhPhiBang2(data) {
    if (data && data?.ct2s && data?.ct2s.length > 0) {
      let sum = data.ct2s.map((item) => item.kinhPhiDaCap).reduce((prev, next) => Number(prev) + Number(next));
      return sum ?? 0;
    } else {
      return 0
    }
  }

  tongCapThemBang2(data) {
    if (data && data?.ct2s && data?.ct2s.length > 0) {
      let sum = data.ct2s.map((item) => item.yeuCauCapThem).reduce((prev, next) => Number(prev) + Number(next));
      return sum ?? 0;
    } else {
      return 0
    }
  }

  async ngOnInit(): Promise<void> {
    try {
      this.spinner.show();
      this.initForm();
      Promise.all([this.getListNam(), this.getListBoNganh(), this.loaiVTHHGetAll()]);
      this.spinner.hide();
    } catch (error) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      this.spinner.hide();
    }
  }
  initForm() {
    this.formData = this.fb.group({
      nam: [
        {
          value: this.deNghiCapPhiBoNganh
            ? this.deNghiCapPhiBoNganh.nam
            : null,
          disabled: this.isView ? true : false
        },
        [],
      ],
      maBoNganh: [
        {
          value: this.deNghiCapPhiBoNganh
            ? this.deNghiCapPhiBoNganh.maBoNganh
            : null,
          disabled: this.isView ? true : false
        },
        [],
      ],
      soDeNghi: [
        {
          value: this.deNghiCapPhiBoNganh
            ? this.deNghiCapPhiBoNganh.soDeNghi
            : null,
          disabled: this.isView ? true : false
        },
        [],
      ],
      ngayDeNghi: [
        {
          value: this.deNghiCapPhiBoNganh
            ? this.deNghiCapPhiBoNganh.ngayDeNghi
            : null,
          disabled: this.isView ? true : false
        },
        [],
      ],
    });
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

  back() {
    this.showListEvent.emit();
  }


  async save(isOther: boolean) {
    this.spinner.show();
    try {
      let body = {
        "capDvi": "string",
        "ct1List": [
          {
            "ct2List": [
              {
                "capPhiBoNghanhCt1Id": 0,
                "id": 0,
                "kinhPhiDaCap": 0,
                "loaiChiPhi": "string",
                "maVatTu": "string",
                "maVatTuCha": "string",
                "namPhatSinh": 0,
                "tenHangHoa": "string",
                "tongTien": 0,
                "yeuCauCapThem": 0
              }
            ],
            "dnCapPhiId": 0,
            "id": 0,
            "nganHang": "string",
            "soTaiKhoan": 0,
            "tenDvCungCap": "string",
            "ycCapThemPhi": 0
          }
        ],
        "id": 0,
        "maBoNganh": "string",
        "maDvi": "string",
        "nam": 0,
        "ngayDeNghi": "string",
        "soDeNghi": "string"
      };
      if (this.id > 0) {
        let res = await this.deNghiCapPhiBoNganhService.sua(
          body,
        );
        if (res.msg == MESSAGE.SUCCESS) {
          if (!isOther) {
            this.notification.success(
              MESSAGE.SUCCESS,
              MESSAGE.UPDATE_SUCCESS,
            );
            this.back();
          }
        } else {
          this.notification.error(MESSAGE.ERROR, res.msg);
        }
      } else {
        let res = await this.deNghiCapPhiBoNganhService.them(
          body,
        );
        if (res.msg == MESSAGE.SUCCESS) {
          if (!isOther) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
            this.back();
          }
        } else {
          this.notification.error(MESSAGE.ERROR, res.msg);
        }
      }
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }
}
