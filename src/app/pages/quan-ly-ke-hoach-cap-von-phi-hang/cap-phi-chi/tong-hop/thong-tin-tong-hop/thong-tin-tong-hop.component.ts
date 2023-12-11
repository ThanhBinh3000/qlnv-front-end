import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as dayjs from 'dayjs';
import { cloneDeep } from 'lodash';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import {
  PAGE_SIZE_DEFAULT,
} from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { FileDinhKem } from 'src/app/models/FileDinhKem';
import { UserLogin } from 'src/app/models/userlogin';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { HelperService } from 'src/app/services/helper.service';
import { DeNghiCapPhiBoNganhService } from 'src/app/services/ke-hoach/von-phi/deNghiCapPhiBoNganh.service';
import { TongHopDeNghiCapPhiService } from 'src/app/services/ke-hoach/von-phi/tongHopDeNghiCapPhi.service';
import { UploadFileService } from 'src/app/services/uploaFile.service';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';
import { Ct1sTonghop } from './../../../../../models/TongHopDeNghiCapVon';
import { STATUS } from '../../../../../constants/status';
import { AMOUNT_NO_DECIMAL } from '../../../../../Utility/utils';
import {PREVIEW} from "../../../../../constants/fileType";
import printJS from "print-js";
import {saveAs} from 'file-saver';

@Component({
  selector: 'app-thong-tin-tong-hop',
  templateUrl: './thong-tin-tong-hop.component.html',
  styleUrls: ['./thong-tin-tong-hop.component.scss'],
})
export class ThongTinTongHopComponent implements OnInit {
  @Input() idInput: number;
  @Input() isView: boolean;
  @Output()
  showListEvent = new EventEmitter<any>();
  formData: FormGroup;
  detail: any = {};
  STATUS = STATUS;
  pageSize: number = PAGE_SIZE_DEFAULT;
  page: number = 1;
  dataTableAll: any[] = [];
  date: any = new Date();
  userLogin: UserLogin;
  listNam: any[] = [];
  noiDung: string = '';
  khDnCapVonIds: any[] = [];
  listMaTongHop: any[] = [];
  listNguonTongHop: any[] = [];
  errorInputRequired: string = 'Dữ liệu không được để trống.';
  userInfo: UserLogin;

  listFileDinhKem: any[] = [];
  cts: any[] = [];
  ct1s: any[] = [];

  isTonghop: boolean = false;
  dayNow: string;
  yearNow: number;
  itemSelectedInfo: any = {};
  itemSelectedEdit: any = {};
  filePhuongAn: any[] = [];
  create: any = {};
  editDataCache: { [key: string]: { edit: boolean; data: any } } = {};

  filePA: any;
  nameFilePhuongAn: string = '';
  selectedId: number = 0;
  isDetail: boolean = false;

  rowDisplay: any = {};
  rowEdit: any = {};

  oldDataEdit1: any = {};
  oldDataEdit2: any = {};
  amount = AMOUNT_NO_DECIMAL;
  listLoaiHangHoa: any[] = [];
  listChungLoaiHangHoa: any[] = [];
  listLoaiChiPhi: any[] = [];

  templateName : string = 'tong-hop-tinh-hinh-cap-von-bo-nganh';
  pdfSrc: any;
  wordSrc: any;
  excelSrc: any;
  printSrc: any;
  showDlgPreview = false;

  constructor(
    private modal: NzModalService,
    private tongHopDeNghiCapVonService: TongHopDeNghiCapPhiService,
    private deNghiCapPhiBoNganhService: DeNghiCapPhiBoNganhService,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    private fb: FormBuilder,
    public globals: Globals,
    public userService: UserService,
    private helperService: HelperService,
    private uploadFileService: UploadFileService,
    private danhMucService: DanhMucService,
  ) {
  }

  async ngOnInit() {
    this.spinner.show();
    this.userInfo = this.userService.getUserLogin();
    this.detail.trangThai = this.globals.prop.NHAP_DU_THAO;
    this.detail.tenTrangThai = 'Dự Thảo';
    this.dayNow = dayjs().format('DD/MM/YYYY');
    this.yearNow = dayjs().get('year');
    for (let i = -3; i < 23; i++) {
      this.listNam.push({
        value: dayjs().get('year') - i,
        text: dayjs().get('year') - i,
      });
    }
    this.initForm();
    await this.loadListNguonTongHop();
    await this.loaiVTHHGetAll();
    await this.getListLoaiCPhi();
    if (this.idInput) {
      this.loadChiTiet(this.idInput);
    }
    this.spinner.hide();
  }

  initForm() {
    this.formData = this.fb.group({
      'nam': [null, [Validators.required]],
      'maTongHop': [null],
      'ngayTongHop': [null, [Validators.required]],
      'maToTrinh': [null],
      'noiDung': [null],
      'capDvi': [null],
      'maDvi': [null],
      'lyDoTuChoi': [null],
      // 'nameFilePhuongAn': [null],
    });
    this.formData.patchValue({
      id: this.idInput,
      nam: this.yearNow,
      ngayTongHop: new Date().toDateString(),
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

  async getListLoaiCPhi() {
    this.listLoaiChiPhi = [];
    let res = await this.danhMucService.danhMucChungGetAll('PHI_NGHIEP_VU_DTQG');
    if (res.msg == MESSAGE.SUCCESS) {
      this.listLoaiChiPhi = res.data;
    }
  }

  async changeLoaiHangHoa(id: any) {
    if (id && id > 0) {
      let loaiHangHoa = this.listLoaiHangHoa.filter(item => item.ma === id);
      this.listChungLoaiHangHoa = loaiHangHoa[0].child;
    }
  }

  async loadChiTiet(id: number) {
    if (id > 0) {
      let res = await this.tongHopDeNghiCapVonService.loadChiTiet(id);
      if (res.msg == MESSAGE.SUCCESS && res.data) {
        this.isTonghop = true;
        let data = res.data;
        if (data) {
          this.detail = res.data;
          this.filePhuongAn = res.data.fileDinhKems;
          this.formData.patchValue({
            'nam': res.data.nam,
            'nguonTongHop': data.nguonTongHop,
            'maTongHop': data.maTongHop,
            'ngayTongHop': data.ngayTongHop,
            'maToTrinh': data.maToTrinh,
            'noiDung': data.noiDung,
            'maDvi': data.maDvi,
            'capDvi': data.capDvi,
            'lyDoTuChoi': data.lyDoTuChoi,
          });
          this.cts = [...data.cts];
          this.ct1s = [...data.ct1s];
          this.sortTableId('ct1s');
          this.selectRow(this.cts[0], 'rowDisplay');
          this.selectRow(this.ct1s[0], 'rowEdit');
        }
      }
    }
  }

  async save(isGuiDuyet?: boolean) {
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      this.notification.error(MESSAGE.ERROR, 'Vui lòng điền đủ thông tin');
      return;
    }
    let body = this.formData.value;
    body.ngayTongHop = this.formData.value.ngayTongHop ? dayjs(this.formData.value.ngayTongHop).format(
      'YYYY-MM-DD') : '';
    body.id = this.idInput;
    body.ct1s = this.ct1s;
    body.cts = this.cts;
    body.fileDinhKems = this.filePhuongAn;
    // console.log(body, 'bodybodybody');
    // return;
    this.spinner.show();
    try {
      if (this.idInput > 0) {
        let res = await this.tongHopDeNghiCapVonService.sua(body);
        if (res.msg == MESSAGE.SUCCESS) {
          if (!isGuiDuyet) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
          } else {
            this.guiDuyet();
          }
        } else {
          this.notification.error(MESSAGE.ERROR, res.msg);
        }
      } else {
        let res = await this.tongHopDeNghiCapVonService.them(body);
        if (res.msg == MESSAGE.SUCCESS) {
          this.idInput = res.data.id;
          this.formData.patchValue({
            id: res.data.id,
          });
          if (!isGuiDuyet) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
          } else {
            this.guiDuyet(res.data.id);
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

  back() {
    this.showListEvent.emit();
  }

  async guiDuyet(id?) {
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
        // await this.save(true);
        try {
          let body = {
            id: id ? id : this.idInput,
            lyDoTuChoi: null,
            trangThai: STATUS.CHO_DUYET_LDV,
          };
          let res = await this.tongHopDeNghiCapVonService.updateStatus(body);
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

  tuChoi() {
    const modalTuChoi = this.modal.create({
      nzTitle: 'Từ chối',
      nzContent: DialogTuChoiComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {},
    });
    modalTuChoi.afterClose.subscribe(async (text) => {
      if (text) {
        this.spinner.show();
        try {
          let body = {
            id: this.idInput,
            lyDoTuChoi: text,
            trangThai: this.globals.prop.NHAP_TU_CHOI_LD_VU,
          };
          const res = await this.tongHopDeNghiCapVonService.updateStatus(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.TU_CHOI_SUCCESS);
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
      }
    });
  }

  pheDuyet() {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn phê duyệt?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: async () => {
        this.spinner.show();
        try {
          let body = {
            id: this.idInput,
            lyDoTuChoi: null,
            trangThai: this.globals.prop.NHAP_DA_DUYET_LD_VU,
          };
          let res = await this.tongHopDeNghiCapVonService.updateStatus(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
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

  async loadListNguonTongHop() {
    let res = await this.deNghiCapPhiBoNganhService.timKiem({
      // trangThai: this.globals.prop.NHAP_BAN_HANH
    });
    if (res.msg == MESSAGE.SUCCESS) {
      this.listNguonTongHop = res.data.content;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    this.spinner.hide();
  }

  async changePageIndex(event) {
    this.spinner.show();
    try {
      this.page = event;

      await this.loadDeNghiCapVonBoNganh();
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async changePageSize(event) {
    this.spinner.show();
    try {
      this.pageSize = event;
      await this.loadDeNghiCapVonBoNganh();
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async loadDeNghiCapVonBoNganh() {
    this.spinner.show();
    this.isTonghop = true;
    let body = {
      nam: this.formData.value.nam,
      pageNumber: 1,
      pageSize: 1000,
    };
    let res = await this.deNghiCapPhiBoNganhService.timKiem(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.cts = res.data.content;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    this.spinner.hide();
  }

  clearFilter() {
    this.formData = this.fb.group({
      'nam': [this.yearNow, [Validators.required]],
      'maTongHop': [null],
      'ngayTongHop': [null],
      'maToTrinh': [null],
      'noiDung': [null],
      'nameFilePhuongAn': [null],
    });
    this.isTonghop = false;
    this.cts = [];
    this.ct1s = [];
    this.rowDisplay = {};
    this.rowEdit = {};
  }

  /*-------------------------------------------------*/

  sortTableId(type) {
    if (type === 'ct1s') {
      this.ct1s.forEach((lt, i) => {
        lt.stt = i + 1;
      });
    } else if (type === 'ct2s') {
      this.rowEdit.ct2s.forEach((lt, i) => {
        lt.stt = i + 1;
      });
    }
  }

  isDisableField() {
    if (this.detail && (this.detail.trangThai == this.globals.prop.NHAP_CHO_DUYET_LD_VU)) {
      return true;
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
      let index = this.rowEdit.ct2s.findIndex(x => x.stt === item.stt);
      if (index != -1) {
        let temp = cloneDeep(this.rowEdit.ct2s);
        temp[index] = cloneDeep(this.oldDataEdit2);
        this.rowEdit.ct2s = temp;
      }
    }
    item.edit = false;
  }

  saveEdit(item, type, index) {
    item.edit = false;
    this.rowEdit.ct2s[index] = item;
    this.ct1s.find(it => it.selected).ct2s = this.rowEdit.ct2s;
    // if (type === 'ct2s') {
    //   // item.maVatTuCha = this.rowEdit.maVatTuCha;
    //   // item.maVatTu = this.rowEdit.maVatTu;
    //   // item.tenHangHoa = this.rowEdit.tenHangHoa;
    //   item.ct2s = cloneDeep(this.rowEdit.ct2s);
    //   console.log(this.ct1s, 'this.ct1sthis.ct1sthis.ct1s');
    //   this.rowEdit.ct2s = cloneDeep(this.rowEdit.ct2s);
    //   // console.log(this.rowEdit.ct2s,'this.rowEdit.ct2sthis.rowEdit.ct2s');
    //   item.ycCapThemPhi = this.tongCapThemBang2(this.rowEdit);
    //   // this.rowEdit.isView = true;
    // }
  }

  deleteRow(item: any, type) {
    if (type === 'ct1s') {
      let temp = this.ct1s.filter(x => x.stt !== item.stt);
      this.ct1s = temp;
      this.sortTableId('ct1s');
    } else if (type === 'ct2s') {
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
      this.rowEdit.isView = false;
      this.oldDataEdit1 = cloneDeep(item);
    } else if (type === 'ct2s') {
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
    item.tenLoaiChiPhi = this.listLoaiChiPhi.find(chiphi => chiphi.ma ==item.loaiChiPhi)?.giaTri;
    this.rowEdit.ct2s = [
      ...this.rowEdit.ct2s,
      item,
    ];
    this.ct1s.find(it => it.selected).ct2s = this.rowEdit.ct2s;
    this.clearItemRow();
  }

  clearItemRow() {
    this.create = {};
  }

  // getNameFile(event?: any, item?: FileDinhKem) {
  //   const element = event.currentTarget as HTMLInputElement;
  //   const fileList: FileList | null = element.files;
  //   if (fileList) {
  //     const itemFile = {
  //       name: fileList[0].name,
  //       file: event.target.files[0] as File,
  //     };
  //     this.uploadFileService
  //       .uploadFile(itemFile.file, itemFile.name)
  //       .then((resUpload) => {
  //         const fileDinhKem = new FileDinhKem();
  //         fileDinhKem.fileName = resUpload.filename;
  //         this.formData.patchValue({
  //           nameFilePhuongAn: resUpload.filename,
  //         });
  //         fileDinhKem.fileSize = resUpload.size;
  //         fileDinhKem.fileUrl = resUpload.url;
  //         this.filePhuongAn = fileDinhKem;
  //       });
  //   }
  // }

  async loadThongTinChiTiet() {
    this.isTonghop = true;
    this.cts = [];
    this.ct1s = [];
    this.spinner.show();
    let body = {
      nam: this.formData.value.nam,
      trangThaiTh: STATUS.CHUA_TONG_HOP,
      trangThai: STATUS.DA_HOAN_THANH,
      pageNumber: 1,
      pageSize: 1000,
    };
    let index = 0;
    let res = await this.deNghiCapPhiBoNganhService.timKiem(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data.content;
      if (data && data.length > 0) {
        let listItem = [];
        for (let i = 0; i < data.length; i++) {
          let resCt = await this.deNghiCapPhiBoNganhService.loadChiTiet(data[i].id);
          if (resCt.msg == MESSAGE.SUCCESS) {
            let chiTiet = resCt.data;
            if (chiTiet && chiTiet.ct1List && chiTiet.ct1List.length > 0) {
              chiTiet.ct1List.forEach((elementCt) => {
                let item = {
                  'maBoNganh': chiTiet.maBoNganh,
                  'tenBoNganh': chiTiet.tenBoNganh,
                  'tenDvCungCap': elementCt.tenDvCungCap ?? null,
                  'soTaiKhoan': elementCt.soTaiKhoan ?? null,
                  'nganHang': elementCt.nganHang ?? null,
                  'ycCapThemPhi': elementCt.ycCapThemPhi ?? 0,
                  'maVatTuCha': elementCt.maVatTuCha ?? null,
                  'maVatTu': elementCt.maVatTu ?? null,
                  'tenVatTuCha': elementCt.tenVatTuCha ?? null,
                  'tenVatTu': elementCt.tenVatTu ?? null,
                  'tenHangHoa': elementCt.tenHangHoa ?? null,
                  'ct2s': elementCt.ct2List ?? [],
                  'idDeNghi': data[i].id,
                  'stt': index + 1,
                };
                listItem.push(item);
              });
            }
          }
        }
        this.cts = listItem;
        this.selectRow(this.cts[0], 'rowDisplay');
        this.ct1s = cloneDeep(this.cts);
        this.selectRow(this.ct1s[0], 'rowEdit');
        this.sortTableId('ct1s');
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    this.spinner.hide();
  }

  showList() {
    this.isDetail = false;
    this.isView = false;
  }

  goToDetail(data?: any, isView?: boolean) {
    this.selectedId = data.id;
    this.isDetail = true;
    this.isView = isView;
  }

  selectRow(row, rowSet) {
    if (row) {
      if (rowSet === 'rowDisplay') {
        this.cts.forEach(item => {
          item.selected = false;
        });
        row.selected = true;
        this.itemSelectedInfo = cloneDeep(row);
        if (this.itemSelectedInfo) {
          let ct2List = this.itemSelectedInfo.ct2s;
          ct2List.forEach(item => {
            let chiPhi = this.listLoaiChiPhi.find(cp => cp.ma == item.loaiChiPhi);
            if (chiPhi) {
              item.tenLoaiChiPhi = chiPhi.giaTri;
            }
          });
        }
      } else if (rowSet === 'rowEdit') {
        this.ct1s.forEach(element => {
          element.selected = false;
        });
        this.rowEdit = cloneDeep(row);
        row.selected = true;
        if (this.rowEdit) {
          let ct2List = this.rowEdit.ct2s;
          ct2List.forEach(item => {
            let chiPhi = this.listLoaiChiPhi.find(cp => cp.ma == item.loaiChiPhi);
            if (chiPhi) {
              item.tenLoaiChiPhi = chiPhi.giaTri;
            }
          });
        }
        this.sortTableId('ct2s');
      }
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
    if (data && data?.ct2s && data?.ct2s.length > 0) {
      let sum = data.ct2s.map((item) => item.tongTien).reduce((prev, next) => Number(prev) + Number(next));
      return sum ?? 0;
    } else {
      return 0;
    }
  }

  tongKinhPhiBang2(data) {
    if (data && data?.ct2s && data?.ct2s.length > 0) {
      let sum = data.ct2s.map((item) => item.kinhPhiDaCap).reduce((prev, next) => Number(prev) + Number(next));
      return sum ?? 0;
    } else {
      return 0;
    }
  }

  tongCapThemBang2(data) {
    if (data && data?.ct2s && data?.ct2s.length > 0) {
      let sum = data.ct2s.map((item) => item.yeuCauCapThem).reduce((prev, next) => Number(prev) + Number(next));
      return sum ?? 0;
    } else {
      return 0;
    }
  }

  async preview() {
    this.spinner.show();
    await this.tongHopDeNghiCapVonService.preview({
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
}
