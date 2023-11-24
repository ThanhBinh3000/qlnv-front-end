import { Ct1sTonghop } from './../../../../../models/TongHopDeNghiCapVon';
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
import { UserLogin } from 'src/app/models/userlogin';
import { HelperService } from 'src/app/services/helper.service';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';
import { DeNghiCapVonBoNganhService } from 'src/app/services/ke-hoach/von-phi/deNghiCapVanBoNganh.service';
import { TongHopDeNghiCapVonService } from 'src/app/services/ke-hoach/von-phi/tongHopDeNghiCapVon.service';
import { UploadFileService } from 'src/app/services/uploaFile.service';
import { STATUS } from '../../../../../constants/status';
import { AMOUNT_NO_DECIMAL } from '../../../../../Utility/utils';
import { PREVIEW } from '../../../../../constants/fileType';
import printJS from 'print-js';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-thong-tin-tong-hop',
  templateUrl: './thong-tin-tong-hop.component.html',
  styleUrls: ['./thong-tin-tong-hop.component.scss'],
})
export class ThongTinTonghopComponent implements OnInit {
  @Input() idInput: number;
  @Input() isView: boolean;
  @Output()
  showListEvent = new EventEmitter<any>();
  @Input() id: number;
  formData: FormGroup;
  detail: any = {};
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
  // listFileDinhKem: any[] = [];
  listThongTinChiTiet: any[] = [];
  totalRecord: number = 0;
  isTonghop: boolean = false;
  dataInfoHdv: any = {};
  dayNow: string;
  yearNow: number;
  filePhuongAn: any[] = [];
  create: any = {};
  editDataCache: { [key: string]: { edit: boolean; data: any } } = {};
  STATUS = STATUS;
  filePA: any;
  nameFilePhuongAn: string = '';
  selectedId: number = 0;
  nguonTongHopList: any[] = [
    {
      id: 'TCDT',
      value: 'TCDT',
    },
    {
      id: 'BN',
      value: 'Bộ/Ngành',
    },
    {
      id: 'ALL',
      value: 'Tất cả',
    },
  ];
  isDetail: boolean = false;
  isDetailHdv: boolean = false;
  amount = AMOUNT_NO_DECIMAL;
  showDlgPreview = false;
  pdfSrc: any;
  wordSrc: any;
  excelSrc: any;
  printSrc: any;
  reportTemplate: any = {
    typeFile: '',
    fileName: '',
    tenBaoCao: '',
    trangThai: '',
  };
  constructor(
    private modal: NzModalService,
    private tongHopDeNghiCapVonService: TongHopDeNghiCapVonService,
    private deNghiCapVonBoNganhService: DeNghiCapVonBoNganhService,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    private fb: FormBuilder,
    public globals: Globals,
    public userService: UserService,
    private helperService: HelperService,
    private uploadFileService: UploadFileService,
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
    // await this.loadListNguonTongHop();
    if (this.idInput) {
      this.loadChiTiet(this.idInput);
    }
    this.spinner.hide();
  }

  initForm() {
    this.formData = this.fb.group({
      'nam': [null, [Validators.required]],
      'nguonTongHop': ['ALL', [Validators.required]],
      'maTongHop': [null],
      'ngayTongHop': [null],
      'maToTrinh': [null],
      'noiDung': [null],
      'khDnCapVonIds': [null],
    });
    this.formData.patchValue({
      id: this.idInput,
      maDonVi: this.userInfo.MA_DVI,
      capDvi: this.userInfo.CAP_DVI,
      nam: this.yearNow,
      ngayTongHop: new Date().toDateString(),
    });

  }

  async loadChiTiet(id: number) {
    this.spinner.show();
    if (id > 0) {
      let res = await this.tongHopDeNghiCapVonService.loadChiTiet(id);
      if (res.msg == MESSAGE.SUCCESS && res.data) {
        this.isTonghop = true;
        let data = res.data;
        if (data) {
          // console.log(data,'datadatadatadata');
          this.detail = res.data;
          this.detail.trangThai = data.trangThai;
          this.detail.tenTrangThai = data.tenTrangThai;
          this.filePhuongAn = data.fileDinhKems;
          let idsKhDnCapVonId = data.ct1s.filter(item => item.maBn != 'BTC' && item.khDnCapVonId).map(s => Number(s.khDnCapVonId));
          this.formData.patchValue({
            'nam': res.data.nam,
            'nguonTongHop': data.nguonTongHop,
            'maTongHop': data.maTongHop,
            'ngayTongHop': data.ngayTongHop,
            'maToTrinh': data.maToTrinh,
            'noiDung': data.noiDung,
            'lyDoTuChoi': data.lyDoTuChoi,
            // nameFilePhuongAn: data.fileDinhKem.fileName,
            khDnCapVonIds: idsKhDnCapVonId,
          });
          // this.listFileDinhKem = [data.fileDinhKem];
          this.listThongTinChiTiet = [...data.ct1s];
          this.detail.tCThem = [...data.ct1s];
          this.updateEditCache();
          let phuongAnList = [];
          this.detail.ct1s.forEach(pa => {
            const phuongAn = new Ct1sTonghop();
            phuongAn.khDnCapVonId = pa.id;
            phuongAn.tcCapThem = pa.tcCapThem;
            phuongAnList = [...phuongAnList, phuongAn];
          });
        }
      }
    }
    this.spinner.hide();
  }

  async save(isGuiDuyet?: boolean) {
    let phuongAnList = [];
    this.detail.tCThem.forEach(pa => {
      if (!pa.isSum) {
        const phuongAn = new Ct1sTonghop();
        phuongAn.khDnCapVonId = this.idInput ? pa.khDnCapVonId : (pa.maBn == 'BTC' ? pa.idHdv : pa.id);
        phuongAn.tcCapThem = +pa.tcCapThem;
        phuongAn.loaiBn = pa.loaiBn;
        phuongAn.loaiHang = pa.loaiHang;
        phuongAn.maBn = pa.maBn;
        phuongAn.tongTien = pa.tongTien;
        phuongAn.kinhPhiDaCap = pa.kinhPhiDaCap;
        phuongAn.nam = pa.nam;
        phuongAn.ycCapThem = pa.ycCapThem;
        phuongAn.tenBoNganh = pa.tenBoNganh;
        phuongAn.soDeNghi = pa.soDeNghi;
        phuongAn.ngayDeNghi = pa.ngayDeNghi;
        phuongAn.loaiTien = pa.loaiTien;
        phuongAn.tyGia = pa.tyGia;
        phuongAn.tcCapThemNt = pa.tcCapThemNt;
        phuongAn.tongTienNt = pa.tongTienNt;
        phuongAn.kinhPhiDaCapNt = pa.kinhPhiDaCapNt;
        phuongAn.ycCapThemNt = pa.ycCapThemNt;
        phuongAnList = [...phuongAnList, phuongAn];
      }
    });
    let body = {
      id: this.detail.id,
      'capDvi': this.userInfo.CAP_DVI,
      'ct1s': phuongAnList,
      'fileDinhKems': this.filePhuongAn,
      'khDnCapVonIds': this.formData.value.khDnCapVonIds,
      'maDvi': this.userInfo.MA_DVI,
      'maToTrinh': this.formData.value.maToTrinh,
      'maTongHop': this.formData.value.maTongHop ? this.formData.value.maTongHop : '',
      'nam': this.formData.value.nam ? this.formData.value.nam : '',
      'ngayTongHop': this.formData.value.ngayTongHop ? dayjs(this.formData.value.ngayTongHop).format(
        'YYYY-MM-DD') : '',
      'nguonTongHop': this.formData.value.nguonTongHop ? this.formData.value.nguonTongHop : '',
      'noiDung': this.formData.value.noiDung ? this.formData.value.noiDung : '',
    };
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      this.notification.error(MESSAGE.ERROR, 'Vui lòng điền đủ thông tin');
      return;
    }
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
          this.detail.id = res.data.id;
          this.idInput = res.data.id;
          await this.loadChiTiet(this.idInput);
          if (!isGuiDuyet) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
          } else {
            this.guiDuyet();
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
        // await this.save(true);
        try {
          let body = {
            id: this.idInput,
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
    let res = await this.deNghiCapVonBoNganhService.timKiem({
      trangThai: this.globals.prop.NHAP_BAN_HANH,
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
      soDeNghi: null,
      maBoNganh: null,
      nam: this.formData.value.nam,
      ngayDeNghiTuNgay: null,
      ngayDeNghiDenNgay: null,
      pageNumber: this.page,
      pageSize: this.pageSize,
    };
    let res = await this.deNghiCapVonBoNganhService.timKiem(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data.content;
      this.listThongTinChiTiet = data.filter((item) => item.nam == this.formData.value.nam);

      this.khDnCapVonIds = this.listThongTinChiTiet.map(item => item.id);
      // this.formData.patchValue({ khDnCapVonIds: this.khDnCapVonIds })
      this.totalRecord = data.totalElements;
    } else {
      this.listThongTinChiTiet = [];
      this.totalRecord = 0;
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    this.spinner.hide();
  }

  clearFilter() {
    this.formData = this.fb.group({
      'maTongHop': [null],
      'ngayTongHop': [null],
      'maToTrinh': [null],
      'noiDung': [null],
      'khDnCapVonIds': [null],
      'ct1s': [null],
    });
    // this.listFileDinhKem = [];
  }

  cancelEdit(stt: number): void {
    const index = this.detail?.tCThem.findIndex(item => item.stt === stt);
    this.editDataCache[stt] = {
      data: { ...this.detail?.tCThem[index] },
      edit: false,
    };
  }

  saveEdit(stt: number): void {
    const index = this.detail?.tCThem.findIndex(item => item.stt === stt);
    Object.assign(this.detail?.tCThem[index], this.editDataCache[stt].data);
    this.editDataCache[stt].edit = false;
  }

  updateEditCache(): void {
    if (this.detail?.tCThem && this.detail?.tCThem.length > 0) {
      this.detail?.tCThem.forEach((item, index) => {
        item.stt = index + 1;
        this.editDataCache[item.stt] = {
          edit: false,
          data: { ...item },
        };
      });
    }
  }

  sortTableId() {
    this.detail?.tCThem.forEach((lt, i) => {
      lt.stt = i + 1;
    });
  }

  isDisableField() {
    if (this.detail && (this.detail.trangThai == this.globals.prop.NHAP_CHO_DUYET_TP || this.detail.trangThai == this.globals.prop.NHAP_CHO_DUYET_LD_CHI_CUC || this.detail.trangThai == this.globals.prop.NHAP_DA_DUYET_LD_CHI_CUC)) {
      return true;
    }
  }

  deleteRow(data: any) {
    this.detail.tCThem = this.detail?.tCThem.filter(x => x.stt != data.stt);
    this.sortTableId();
    this.updateEditCache();
  }

  editRow(stt: number) {
    this.editDataCache[stt].edit = true;
  }

  loadPhuongAnTongCuc(data?) {
    if (!data) {
      this.detail.tCThem = [];
    }
    this.detail.tCThem = data;
    if (this.detail.tCThem && this.detail.tCThem.length > 0) {
      this.detail.tCThem.forEach(item => {
        item.tcCapThem = item.ycCapThem;
        item.tcCapThemNt = item.ycCapThemNt;
      });
    }
    this.updateEditCache();
    this.clearItemRow();
  }

  clearItemRow() {
    this.create = {};
  }

  changeSoDeNghi(item) {
    if (item) {
      let getSoDeNghi = this.listNguonTongHop.filter(x => x.soDeNghi == item.soDeNghi);
      if (getSoDeNghi && getSoDeNghi.length > 0) {
        item.id = getSoDeNghi[0].id;
        item.nam = getSoDeNghi[0].nam;
        item.ngayDeNghi = getSoDeNghi[0].ngayDeNghi;
        item.tenBoNganh = getSoDeNghi[0].tenBoNganh;
        item.tongTien = getSoDeNghi[0].tongTien;
        item.id = getSoDeNghi[0].id;
        item.kinhPhiDaCap = getSoDeNghi[0].kinhPhiDaCap;
      }
    }
  }

  async loadThongTinChiTiet(nguonTongHopId: string) {
    this.spinner.show();
    if (nguonTongHopId == 'TCDT') {
      let body = {
        nguonTongHop: nguonTongHopId,
        nam: this.formData.get('nam').value,
      };
      let res = await this.deNghiCapVonBoNganhService.loadThTCDT(body);
      //to do
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data && res.data.length > 0) {
          this.isTonghop = true;
          let data = res.data;
          this.listThongTinChiTiet = data;
          this.loadPhuongAnTongCuc(data);
        } else {
          this.notification.error(MESSAGE.ERROR, 'Không tìm thấy dữ liệu để tổng hợp.');
          this.spinner.hide();
          return;
        }
      }
    } else {
      let body = {
        nam: this.formData.get('nam').value,
        trangThai: STATUS.DA_HOAN_THANH,
        type: 'TH',
        loaiTh: nguonTongHopId,
        trangThaiTh: STATUS.CHUA_TONG_HOP,
      };
      let res = await this.deNghiCapVonBoNganhService.tongHopDeNghiCapVon(body);
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data && res.data.length > 0) {
          let data = res.data;
          this.listThongTinChiTiet = data;
          this.khDnCapVonIds = data.map(item => item.id).filter(function(el) {
            return el != null;
          });
          this.formData.patchValue({ khDnCapVonIds: this.khDnCapVonIds });
          this.isTonghop = true;
          this.loadPhuongAnTongCuc(data);
        } else {
          this.notification.error(MESSAGE.ERROR, 'Không tìm thấy dữ liệu để tổng hợp.');
          this.spinner.hide();
          return;
        }
      } else {
        this.listThongTinChiTiet = [];
        this.totalRecord = 0;
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }
    this.spinner.hide();
  }

  showList() {
    this.isDetail = false;
    this.isView = false;
  }

  backHdv() {
    this.isDetail = false;
    this.isView = false;
  }

  goToDetailDn(data?: any) {
    this.selectedId = this.idInput ? data.khDnCapVonId : data.id;
    this.isDetail = true;
  }

  goToDetailHdv(data?: any) {
    console.log(data, 'datadatadata');
    this.dataInfoHdv.id = this.idInput ? data.khDnCapVonId : data.idHdv;
    this.isDetailHdv = true;
  }

  closePopHdv() {
    this.isDetailHdv = false;
  }

  closePopDnBn() {
    this.isDetail = false;
  }

  templateName = 'tong-hop-de-nghi-cap-von-cac-bo-nganh';

  async preview(id) {
    this.spinner.show();
    await this.tongHopDeNghiCapVonService.preview({
      tenBaoCao: this.templateName + '.docx',
      id: id,
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
