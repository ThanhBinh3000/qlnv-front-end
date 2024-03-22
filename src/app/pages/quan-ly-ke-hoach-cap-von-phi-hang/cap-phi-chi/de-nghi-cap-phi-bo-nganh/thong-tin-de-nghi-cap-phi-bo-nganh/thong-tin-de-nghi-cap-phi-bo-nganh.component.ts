import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import * as dayjs from 'dayjs';
import {cloneDeep} from 'lodash';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NgxSpinnerService} from 'ngx-spinner';
import {MESSAGE} from 'src/app/constants/message';
import {DanhMucService} from 'src/app/services/danhmuc.service';
import {DeNghiCapPhiBoNganhService} from 'src/app/services/ke-hoach/von-phi/deNghiCapPhiBoNganh.service';
import {Globals} from 'src/app/shared/globals';
import {DonviService} from '../../../../../services/donvi.service';
import {STATUS} from '../../../../../constants/status';
import {AMOUNT_NO_DECIMAL} from '../../../../../Utility/utils';
import {PREVIEW} from "../../../../../constants/fileType";
import printJS from "print-js";
import {saveAs} from 'file-saver';
import { v4 as uuidv4 } from 'uuid';
import {NzModalService} from "ng-zorro-antd/modal";
import {HelperService} from "../../../../../services/helper.service";

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
  taiLieuDinhKemList: any[] = [];
  listNam: any[] = [];
  listBoNganh: any[] = [];
  listLoaiHangHoa: any[] = [];
  listChungLoaiHangHoa: any[] = [];
  listLoaiChiPhi: any[] = [];
  itemCt1Selected: any;
  STATUS = STATUS;
  hanghoa: any = {
    'maLoaiHangHoa': '',
    'maChungLoaiHangHoa': '',
    'tenHangHoa': '',
  };

  detail: any = {};
  cts: any[] = [];
  ct1s: any[] = [];

  rowEdit: any = {};
  oldDataEdit1: any = {};
  oldDataEdit2: any = {};

  create: any = {};
  create1: any = {};
  amount = AMOUNT_NO_DECIMAL;

  templateName : string = 'tinh-hinh-cap-von-bo-nganh';
  pdfSrc: any;
  wordSrc: any;
  excelSrc: any;
  printSrc: any;
  showDlgPreview = false;

  constructor(
    private deNghiCapPhiBoNganhService: DeNghiCapPhiBoNganhService,
    private fb: FormBuilder,
    public globals: Globals,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    private danhMucService: DanhMucService,
    private modal: NzModalService,
    private helperService: HelperService,
    private donviService: DonviService,
  ) {
  }

  isDisableField() {
    if (
      this.detail &&
      this.detail.trangThai == STATUS.DA_HOAN_THANH
    ) {
      return true;
    }
  }

  async ngOnInit(): Promise<void> {
    try {
      this.spinner.show();
      this.detail.trangThai = STATUS.DANG_NHAP_DU_LIEU;
      this.detail.tenTrangThai = 'Đang nhập dữ liệu';
      this.initForm();
      Promise.all([this.getListNam(), this.getListBoNganh(), this.loaiVTHHGetAll(), this.getListLoaiCPhi()]);
      this.rowEdit.isView = true;
      if (this.idInput > 0) {
        await this.loadChiTiet(this.idInput);
      }
      this.spinner.hide();
    } catch (error) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  initForm() {
    this.formData = this.fb.group({
      'nam': [dayjs().get('year'), [Validators.required]],
      'maBoNganh': [null, [Validators.required]],
      'soDeNghi': [null, [Validators.required]],
      'ngayDeNghi': [null, [Validators.required]],
      'ghiChu': [null],
    });
  }

  async loaiVTHHGetAll() {
    try {
      await this.danhMucService.loadDanhMucHangHoa().subscribe((hangHoa) => {
        if (hangHoa.msg == MESSAGE.SUCCESS) {
          hangHoa.data.forEach((item) => {
            if (item.cap === '2') {
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
    let res = await this.donviService.layTatCaDonViByLevel(0);
    if (res.msg == MESSAGE.SUCCESS) {
      this.listBoNganh = res.data.filter(item => (item.code != 'BQP' && item.code != 'BCA' && item.code != 'BTC'));
    }
  }

  async getListLoaiCPhi() {
    this.listLoaiChiPhi = [];
    let res = await this.danhMucService.danhMucChungGetAll('PHI_NGHIEP_VU_DTQG');
    if (res.msg == MESSAGE.SUCCESS) {
      this.listLoaiChiPhi = res.data;
    }
  }

  back() {
    this.showListEvent.emit();
  }

  async guiDuyet() {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn hoàn thành cập nhật?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 350,
      nzOnOk: async () => {
        this.spinner.show();
        try {
          let body = {
            id: this.idInput,
            trangThaiId: STATUS.DA_HOAN_THANH,
          };

          let res = await this.deNghiCapPhiBoNganhService.updateStatus(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(
              MESSAGE.SUCCESS,
              'Đã hoàn thành cập nhật',
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
    body.ct1List = this.ct1s;
    body.ngayDeNghi = this.formData.get('ngayDeNghi').value ? dayjs(this.formData.get('ngayDeNghi').value).format('YYYY-MM-DD') : null;
    if (!body.ct1List || body.ct1List.length <= 0) {
      this.notification.warning(MESSAGE.WARNING, 'Vui lòng nhập thông tin đơn vị cung cấp.');
      return;
    }
    this.spinner.show();
    try {
      if (this.idInput > 0) {
        body.id = this.idInput;
        let res = await this.deNghiCapPhiBoNganhService.sua(body);
        if (res.msg == MESSAGE.SUCCESS) {
          if (!isOther) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
            this.idInput = res.data.id;
            this.formData.patchValue({
              id: res.data.id,
            });
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
            this.idInput = res.data.id;
            this.formData.patchValue({
              id: res.data.id,
            });
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
            'ghiChu': data.ghiChu,
          });
          this.detail.trangThai = data.trangThai;
          this.detail.tenTrangThai = data.tenTrangThai;
          this.ct1s = data.ct1List;
          this.selectRow(this.ct1s[0]);
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
    } else if (type === 'ct2s') {
      this.itemCt1Selected.ct2List?.forEach((lt, i) => {
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
    } else if (type === 'ct2s') {
      let index = this.itemCt1Selected.ct2List.findIndex(x => x.idVirtual === item.idVirtual);
      if (index != -1) {
        let temp = cloneDeep(this.itemCt1Selected.ct2List);
        temp[index] = cloneDeep(this.oldDataEdit2);
        this.itemCt1Selected.ct2List = temp;
      }
    }
    item.edit = false;
  }

  saveEdit(item, type) {
    if (type == 'ct2s') {
      if (item.yeuCauCapThem > (item.tongTien - item.kinhPhiDaCap)) {
        this.notification.warning(MESSAGE.WARNING, 'Số tiền yêu cầu cấp thêm lớn hơn kinh phí chưa cấp.');
        return;
      }
      if (item.tongTien < item.kinhPhiDaCap) {
        this.notification.warning(MESSAGE.WARNING, 'Kinh phí đã cấp lớn hơn tổng tiền.');
        return;
      }
    }
    item.edit = false;
  }

  deleteRow(item: any, type) {
    if (type === 'ct1s') {
      let temp = this.ct1s.filter(x => x.stt !== item.stt);
      this.ct1s = temp;
      if (!this.ct1s || this.ct1s.length <= 0) {
        this.itemCt1Selected = null;
      } else {
        this.selectRow(this.ct1s[0]);
      }
      this.sortTableId('ct1s');
    } else if (type === 'ct2s') {
      this.itemCt1Selected.ct2List.splice(item, 1);
      this.itemCt1Selected.ycCapThemPhi = this.tongCapThemBang2(this.itemCt1Selected);
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
    } else if (type === 'ct2s') {
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
      if (item.tenDvCungCap && item.soTaiKhoan && item.nganHang) {
        item.stt = this.ct1s.length + 1;
        item.ct2List = [];
        this.ct1s = [
          ...this.ct1s,
          item,
        ];
        this.selectRow(this.ct1s[0]);
      } else {
        this.notification.error(MESSAGE.ERROR, 'Vui lòng điền đủ thông tin');
        return;
      }
    } else if (type === 'ct2s') {
      this.sortTableId('ct2s');
      let item = cloneDeep(this.create);
      item.idVirtual = uuidv4();
      if (!item.loaiChiPhi || !item.namPhatSinh) {
        this.notification.error(MESSAGE.ERROR, 'Vui lòng điền đủ thông tin');
        return;
      }
      item.tenLoaiChiPhi = this.listLoaiChiPhi.find(s => s.ma == item.loaiChiPhi).giaTri;
      if (item.yeuCauCapThem > (item.tongTien - item.kinhPhiDaCap)) {
        this.notification.warning(MESSAGE.WARNING, 'Số tiền yêu cầu cấp thêm lớn hơn kinh phí chưa cấp.');
        return;
      }
      if (item.tongTien < item.kinhPhiDaCap) {
        this.notification.warning(MESSAGE.WARNING, 'Kinh phí đã cấp lớn hơn tổng tiền.');
        return;
      }
      item.kinhPhiChuaCap = item.tongTien ??0 - item.kinhPhiDaCap ??0;
      this.itemCt1Selected.ct2List.push(item);
      this.itemCt1Selected.ycCapThemPhi = this.tongCapThemBang2(this.itemCt1Selected);
    }
    this.clearItemRow(type);
  }

  clearItemRow(type) {
    if (type === 'ct1s') {
      this.create1 = {};
    } else if (type === 'ct2s') {
      this.create = {};
    }
  }

  selectRow(row) {
    this.ct1s.forEach(item => {
      item.selected = false;
    });
    row.selected = true;
    this.itemCt1Selected = row;
    if (this.itemCt1Selected) {
      let ct2List = this.itemCt1Selected.ct2List;
      ct2List.forEach(item => {
        item.idVirtual =  uuidv4();
        // let chiPhi = this.listLoaiChiPhi.find(cp => cp.ma == item.loaiChiPhi);
        // if (chiPhi) {
        //   item.tenLoaiChiPhi = chiPhi.giaTri;
        // }
      });
    }
  }

  tongBang1(data) {
    if (data && data.length > 0) {
      let sum = data.map((item) => item.ycCapThemPhi).reduce((prev, next) => Number(prev) + Number(next));
      return sum ?? 0;
    } else {
      return 0;
    }
  }

  tongChiPhiBang2(data) {
    if (data && data?.ct2List && data?.ct2List.length > 0) {
      let sum = data.ct2List.map((item) => item.tongTien).reduce((prev, next) => Number(prev) + Number(next));
      return sum ?? 0;
    } else {
      return 0;
    }
  }

  tongKinhPhiBang2(data) {
    if (data && data?.ct2List && data?.ct2List.length > 0) {
      let sum = data.ct2List.map((item) => item.kinhPhiDaCap).reduce((prev, next) => Number(prev) + Number(next));
      return sum ?? 0;
    } else {
      return 0;
    }
  }

  tongCapThemBang2(data) {
    if (data && data?.ct2List && data?.ct2List.length > 0) {
      let sum = data.ct2List.map((item) => item.yeuCauCapThem).reduce((prev, next) => Number(prev) + Number(next));
      return sum ?? 0;
    } else {
      return 0;
    }
  }

  async preview() {
    this.spinner.show();
    await this.deNghiCapPhiBoNganhService.preview({
      tenBaoCao: this.templateName+ '.docx',
      id : this.idInput
    }).then(async res => {
      if (res.data) {
        this.printSrc = res.data.pdfSrc;
        this.pdfSrc = PREVIEW.PATH_PDF + res.data.pdfSrc;
        this.wordSrc = PREVIEW.PATH_WORD + res.data.wordSrc;
        this.showDlgPreview = true;
      } else {
        this.notification.error(MESSAGE.ERROR, 'Lỗi trong quá trình tải file.');
      }
    });
    this.spinner.hide();
  }

  downloadPdf() {
    saveAs(this.pdfSrc, this.templateName + '.pdf');
  }

  downloadWord() {
    saveAs(this.wordSrc, this.templateName + '.docx');
  }

  printPreview() {
    printJS({ printable: this.printSrc, type: 'pdf', base64: true });
  }

  closeDlg() {
    this.showDlgPreview = false;
  }
  changeVlTongTien(vl,type,item?){
    if(type== 'add'){
      this.create.kinhPhiChuaCap = (vl ?? 0 ) - (this.create.kinhPhiDaCap ?? 0 )
    }else{
      item.kinhPhiChuaCap = (vl ?? 0 ) - (item.kinhPhiDaCap ?? 0 )
    }
  }
  changeVlKpDaCap(vl,type,item?){
    if(type== 'add'){
      this.create.kinhPhiChuaCap = (this.create.tongTien ?? 0 ) - (vl ?? 0 )
    }else{
      item.kinhPhiChuaCap = (item.tongTien ?? 0 ) - (vl ?? 0 )
    }
  }
}
