import { DataService } from 'src/app/services/data.service';
import { HelperService } from './../../../../../services/helper.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { DeNghiCapPhiBoNganh } from './../../../../../models/DeNghiCapPhiBoNganh';
// import { Component, OnInit } from '@angular/core';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as dayjs from 'dayjs';
import { cloneDeep } from 'lodash';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { DeNghiCapPhiBoNganhService } from 'src/app/services/ke-hoach/von-phi/deNghiCapPhiBoNganh.service';
import { Globals } from 'src/app/shared/globals';
import { isEmpty } from 'lodash';

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
  styleUrls: ['./thong-tin-de-nghi-cap-phi-bo-nganh.component.scss'],
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

  detail: any = {};
  cts: any[] = [];
  ct1s: any[] = [];

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
    private helperService: HelperService,

  ) { }

  isDisableField() {
    if (
      this.detail &&
      this.detail.trangThai == this.globals.prop.NHAP_CHO_DUYET_LD_VU
    ) {
      return true;
    }
  }

  async ngOnInit(): Promise<void> {
    try {
      this.spinner.show();
      this.detail.trangThai = this.globals.prop.NHAP_DU_THAO;
      this.detail.tenTrangThai = "Dự Thảo";
      this.initForm();
      Promise.all([this.getListNam(), this.getListBoNganh(), this.loaiVTHHGetAll()]);
      this.rowEdit.isView = true;
      if (this.idInput > 0) {
        this.loadChiTiet(this.idInput)
      }
      this.spinner.hide();

    } catch (error) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  initForm() {
    this.formData = this.fb.group({
      'nam': [null, [Validators.required]],
      'maBoNganh': [null, [Validators.required]],
      'soDeNghi': [null, [Validators.required]],
      'ngayDeNghi': [null, [Validators.required]],
    });
  }

  async loaiVTHHGetAll() {
    try {
      await this.danhMucService.loadDanhMucHangHoa().subscribe((hangHoa) => {
        if (hangHoa.msg == MESSAGE.SUCCESS) {
          hangHoa.data.forEach((item) => {
            if (item.cap === '1' && item.ma != '01') {
              this.listLoaiHangHoa = [...this.listLoaiHangHoa, item];
            } else {
              this.listLoaiHangHoa = [...this.listLoaiHangHoa, ...item.child];
            }
          });
        }
      });
    } catch (error) {
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async changeLoaiHangHoa(id: any) {
    if (id && id > 0) {
      let loaiHangHoa = this.listLoaiHangHoa.filter((item) => item.ma === id);
      this.listChungLoaiHangHoa = loaiHangHoa[0].child;
    }
  }

  onChangeChungLoaiHH(id: any) {
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

  async guiDuyet() {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn gửi duyệt?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 350,
      nzOnOk: async () => {
        this.spinner.show();
        try {
          let body = {
            id: this.idInput,
            trangThaiId: this.globals.prop.NHAP_BAN_HANH,
          };

          let res = await this.deNghiCapPhiBoNganhService.updateStatus(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(
              MESSAGE.SUCCESS,
              MESSAGE.GUI_DUYET_SUCCESS,
            );
            this.back();
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
          this.spinner.hide();
        } catch (e) {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      },
    });
  }

  async save(isOther?: boolean) {
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      this.notification.error(MESSAGE.ERROR, 'Vui lòng điền đủ thông tin');
      return;
    }
    let body = this.formData.value;
    body.id = this.idInput;
    body.ct1List = this.ct1s;
    body.ngayDeNghi = this.formData.get("ngayDeNghi").value ? dayjs(this.formData.get("ngayDeNghi").value).format("YYYY-MM-DD") : null;
    this.spinner.show();
    try {
      if (this.idInput > 0) {
        let res = await this.deNghiCapPhiBoNganhService.sua(body);
        if (res.msg == MESSAGE.SUCCESS) {
          if (!isOther) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
            this.back();
          } else {
            return res.data.id;
          }
        } else {
          this.notification.error(MESSAGE.ERROR, res.msg);
        }
      } else {
        let res = await this.deNghiCapPhiBoNganhService.them(body);
        if (res.msg == MESSAGE.SUCCESS) {
          if (!isOther) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
            this.back();
          } else {
            return res.data.id;
          }
        } else {
          this.notification.error(MESSAGE.ERROR, res.msg);
        }
      }
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(
        MESSAGE.ERROR,
        e?.error?.message ?? MESSAGE.SYSTEM_ERROR,
      );
    }
  }

  async loadChiTiet(id: number) {
    if (id > 0) {
      let res = await this.deNghiCapPhiBoNganhService.loadChiTiet(id);
      if (res.msg == MESSAGE.SUCCESS && res.data) {
        let data = res.data;
        if (data) {
          this.formData.patchValue({
            'nam': data.nam,
            'maBoNganh': data.maBoNganh,
            'soDeNghi': data.soDeNghi,
            'ngayDeNghi': data.ngayDeNghi,
          });

          this.hanghoa = {
            "maLoaiHangHoa": "",
            "maChungLoaiHangHoa": "",
            "tenHangHoa": "",
          }
          this.detail.trangThai = data.trangThai
          this.detail.tenTrangThai = data.tenTrangThai;
          this.ct1s = data.ct1List;
          this.sortTableId('ct1s');
        }
      }
    }
  }

  /*-------------------------------------------------*/

  sortTableId(type) {
    if (type === 'ct1s') {
      this.ct1s.forEach((lt, i) => {
        lt.stt = i + 1;
      });
    }
    else if (type === 'ct2s') {
      this.rowEdit.ct2List.forEach((lt, i) => {
        lt.stt = i + 1;
      });
    }
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
      item.ct2List = cloneDeep(this.rowEdit.ct2s);
      item.ycCapThemPhi = this.tongCapThemBang2(this.rowEdit);
      this.rowEdit.isView = true;
    }
    console.log("this.rowEdit: ", this.rowEdit);
    
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
      this.ct1s.forEach(element => {
        element.edit = false;
      });
      this.rowEdit = cloneDeep(item);
      this.rowEdit.ct2s = cloneDeep(this.rowEdit.ct2List);
      this.rowEdit.isView = false;
      this.oldDataEdit1 = cloneDeep(item);
    }
    else if (type === 'ct2s') {
      this.oldDataEdit2 = cloneDeep(item);
    }
    item.edit = true;
  }

  addRow(type) {
    if (type === 'ct1s') {
      if (!this.ct1s) {
        this.ct1s = [];
      }
      this.sortTableId('ct1s');
      let item = cloneDeep(this.create1);
      item.stt = this.ct1s.length + 1;
      item.ct2List = [];
      this.ct1s = [
        ...this.ct1s,
        item,
      ]
    }
    else if (type === 'ct2s') {
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
    }
    this.clearItemRow(type);
  }

  clearItemRow(type) {
    if (type === 'ct1s') {
      this.create1 = {};
    }
    else if (type === 'ct2s') {
      this.create = {};
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
        this.ct1s.forEach(element => {
          element.edit = false;
        });
        this.sortTableId('ct2s');
        this.changeLoaiHangHoa(this.rowEdit.maVatTuCha);
      }
    }
    this.rowEdit.ct2s = cloneDeep(this.rowEdit.ct2List);
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
}
