import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as dayjs from 'dayjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { CurrencyMaskInputMode } from 'ngx-currency';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { FileDinhKem } from 'src/app/models/DeXuatKeHoachuaChonNhaThau';
import {
  DiaDiemGiaoNhan, PhanLoTaiSan,
} from 'src/app/models/KeHoachBanDauGia';
import { UserLogin } from 'src/app/models/userlogin';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { DonviService } from 'src/app/services/donvi.service';
import { HelperService } from 'src/app/services/helper.service';
import { DeNghiCapVonBoNganhService } from 'src/app/services/ke-hoach/von-phi/deNghiCapVanBoNganh.service';
import { ThongTriDuyetYCapVonService } from 'src/app/services/ke-hoach/von-phi/thongTriDuyetYCapVon.service';
import { UserService } from 'src/app/services/user.service';
import { thongTinTrangThaiNhap } from 'src/app/shared/commonFunction';
import { Globals } from 'src/app/shared/globals';
import { TongHopDeNghiCapVonService } from '../../../../../services/ke-hoach/von-phi/tongHopDeNghiCapVon.service';
import { includes } from 'lodash';
import { kmr_IQ } from 'ng-zorro-antd/i18n';
import { STATUS } from '../../../../../constants/status';
import { AMOUNT_NO_DECIMAL } from '../../../../../Utility/utils';
import { PREVIEW } from '../../../../../constants/fileType';
import printJS from 'print-js';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-thong-tin-thong-tri-duyet-y-du-toan',
  templateUrl: './thong-tin-thong-tri-duyet-y-du-toan.component.html',
  styleUrls: ['./thong-tin-thong-tri-duyet-y-du-toan.component.scss'],
})

export class ThongTinThongTriDuyetYDuToanComponent implements OnInit {
  @Input() loaiVthhInput: string;
  @Input() idInput: number;
  @Input() isView: boolean;
  @Output()
  showListEvent = new EventEmitter<any>();
  @Input() id: number;
  formData: FormGroup;
  cacheData: any[] = [];
  options = { prefix: '', thousands: '.', decimal: ',', inputMode: CurrencyMaskInputMode.NATURAL };
  fileDinhKem: Array<FileDinhKem> = [];
  userLogin: UserLogin;
  listChiCuc: any[] = [];
  listDiemKho: any[] = [];
  titleStatus: string = '';
  titleButtonDuyet: string = '';
  iconButtonDuyet: string = '';
  listNam: any[] = [];
  listLoaiHangHoa: any[] = [];
  errorInputRequired: string = 'Dữ liệu không được để trống.';

  userInfo: UserLogin;
  listFileDinhKem: any[] = [];
  expandSet = new Set<number>();
  bangPhanBoList: Array<any> = [];
  itemThongTri: any = {};
  diaDiemGiaoNhan: DiaDiemGiaoNhan = new DiaDiemGiaoNhan();
  diaDiemGiaoNhanList: Array<DiaDiemGiaoNhan> = [];
  phanLoTaiSanList: Array<PhanLoTaiSan> = [];
  listChungLoaiHangHoa: any[] = [];
  maKeHoach: string;
  listLoaiHopDong: any[] = [];
  dsBoNganh: any[] = [];
  dsBoNganhFix: any[] = [];
  listDeNghi: any[] = [];
  listTongHop: any[] = [];
  listDviThuHuong: any[] = [];
  rowItem: any = {};
  chiTietList: any[] = [];
  STATUS = STATUS;
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
    private danhMucService: DanhMucService,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    private fb: FormBuilder,
    public globals: Globals,
    public userService: UserService,
    private donviService: DonviService,
    private thongTriDuyetYCapVonService: ThongTriDuyetYCapVonService,
    private cdr: ChangeDetectorRef,
    private helperService: HelperService,
    private deNghiCapPhiBoNganhService: DeNghiCapVonBoNganhService,
    private tongHopDeNghiCapVonService: TongHopDeNghiCapVonService,
  ) {
  }

  async ngOnInit() {
    this.spinner.show();
    this.userInfo = this.userService.getUserLogin();
    this.maKeHoach = '/' + this.userInfo.MA_TR;
    for (let i = -3; i < 23; i++) {
      this.listNam.push({
        value: dayjs().get('year') - i,
        text: dayjs().get('year') - i,
      });
    }
    this.itemThongTri.trangThai = '00';
    this.itemThongTri.nam = dayjs().year();
    this.initForm();
    await Promise.all([
      this.getListBoNganh(),
      this.getListDeNghi(),
      this.getListTongHop(),
    ]);
    if (this.idInput > 0) {
      await this.loadDeXuatitemThongTri(this.idInput);
    }
    this.spinner.hide();
  }

  initForm() {
    this.formData = this.fb.group({
      id: [this.itemThongTri ? this.itemThongTri.id : null, []],
      nam: [this.itemThongTri ? this.itemThongTri.nam : null, [Validators.required]],
      trangThai: [(this.itemThongTri ? this.itemThongTri.trangThai : '00'), [Validators.required]],
      soThongTri: [this.itemThongTri ? this.itemThongTri.soThongTri : null, [Validators.required]],
      ngayLap: [this.itemThongTri ? this.itemThongTri.ngayLap : null, [Validators.required]],
      lyDoChi: [this.itemThongTri ? this.itemThongTri.lyDoChi : null, [Validators.required]],
      soDnCapVon: [this.itemThongTri ? this.itemThongTri.soDnCapVon : null, [Validators.required]],
      maDvi: [this.userInfo.MA_DVI, [Validators.required]],
      loai: [this.itemThongTri ? this.itemThongTri.loai : null, [Validators.required]],
      loaiTien: [this.itemThongTri ? this.itemThongTri.loaiTien : null],
      tenLoaiTien: [this.itemThongTri ? this.itemThongTri.tenLoaiTien : null],
      khoan: [this.itemThongTri ? this.itemThongTri.khoan : null, [Validators.required]],
      chuong: [this.itemThongTri ? this.itemThongTri.chuong : null, [Validators.required]],
      dviThongTri: [this.itemThongTri ? this.itemThongTri.dviThongTri : null, [Validators.required]],
      nhanXet: [this.itemThongTri ? this.itemThongTri.nhanXet : null, [Validators.required]],
      dviThuHuong: [this.itemThongTri ? this.itemThongTri.dviThuHuong : null],
      tenDviThuHuong: [this.itemThongTri ? this.itemThongTri.tenDviThuHuong : null],
      dviThuHuongStk: [this.itemThongTri ? this.itemThongTri.dviThuHuongStk : null],
      dviThuHuongNganHang: [this.itemThongTri ? this.itemThongTri.dviThuHuongNganHang : null],
      lyDoTuChoi: [this.itemThongTri ? this.itemThongTri.lyDoTuChoi : null],
    });
  }

  isDisableField() {
    if (this.itemThongTri && (this.itemThongTri.trangThai == STATUS.CHO_DUYET_LDV || this.itemThongTri.trangThai == STATUS.DA_DUYET_LDV || this.itemThongTri.trangThai == STATUS.DA_DUYET_LDTC)) {
      return true;
    }
  }

  totalTable(data) {
    if (data && data.length > 0) {
      let sum = data.map((item) => item.soTien).reduce((prev, next) => Number(prev) + Number(next));
      return sum ?? 0;
    } else {
      return 0;
    }
  }

  totalTableNt(data) {
    if (data && data.length > 0) {
      let sum = data.map((item) => item.soTienNt).reduce((prev, next) => Number(prev) + Number(next));
      return sum ?? 0;
    } else {
      return 0;
    }
  }

  async getListDeNghi() {
    this.listDeNghi = [];
    let body = {
      pageNumber: 1,
      pageSize: 1000,
    };
    let res = await this.deNghiCapPhiBoNganhService.timKiem(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.listDeNghi = res.data.content;
    }
  }

  async getListTongHop() {
    this.listTongHop = [];
    let body = {
      pageNumber: 1,
      pageSize: 1000,
    };
    let res = await this.tongHopDeNghiCapVonService.timKiem(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.listTongHop = res.data.content;
      if (this.listTongHop && this.listTongHop.length > 0) {
        this.listTongHop = this.listTongHop.filter(item => item.trangThai == STATUS.DA_DUYET_LDV);
      }
    }
  }

  async getListBoNganh() {
    this.dsBoNganh = [];
    let res = await this.donviService.layTatCaDonViByLevel(0);
    if (res.msg == MESSAGE.SUCCESS) {
      // this.dsBoNganh = res.data;
      this.dsBoNganhFix = res.data;
    }
  }

  back() {
    this.showListEvent.emit();
  }

  async loadDeXuatitemThongTri(id: number) {
    await this.thongTriDuyetYCapVonService
      .loadChiTiet(id)
      .then((res) => {
        if (res.msg == MESSAGE.SUCCESS) {
          this.itemThongTri = res.data;
          if (this.itemThongTri.chiTietList) {
            this.chiTietList = this.itemThongTri.chiTietList;
          }
          if (this.itemThongTri.fileDinhKems) {
            this.listFileDinhKem = this.itemThongTri.fileDinhKems;
          }
          this.initForm();
          this.changeMaTongHop();
          this.changeDonVi();
          this.formData.patchValue({
            dviThuHuong: Number(this.itemThongTri.dviThuHuong),
          });
        }
      })
      .catch((e) => {
        console.log('error: ', e);
        this.spinner.hide();
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      });
  }

  quayLai() {
    this.showListEvent.emit();
  }

  async save(isPheDuyet?: boolean) {
    this.spinner.show();
    try {
      let body = this.formData.value;
      body.nam = this.formData.controls.nam.value;
      body.chiTietList = this.chiTietList;
      body.fileDinhKems = this.listFileDinhKem;
      body.id = this.idInput;
      if (this.idInput > 0) {
        let res = await this.thongTriDuyetYCapVonService.sua(body);
        if (res.msg == MESSAGE.SUCCESS) {
          this.idInput = res.data.id;
          this.itemThongTri = res.data;
          if (!isPheDuyet) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
            // this.back();
          } else {
            this.guiDuyet(res.data.id);
          }
        } else {
          this.notification.error(MESSAGE.ERROR, res.msg);
        }
      } else {
        let res = await this.thongTriDuyetYCapVonService.them(body);
        if (res.msg == MESSAGE.SUCCESS) {
          this.idInput = res.data.id;
          this.itemThongTri = res.data;
          if (!isPheDuyet) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
            // this.back();
          } else {
            console.log(res.data,'res.datares.datares.data');
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
        try {
          let body = {
            id: id ? id : this.idInput,
            trangThai: STATUS.CHO_DUYET_LDV,
          };
          let res = await this.thongTriDuyetYCapVonService.updateStatus(body);
          // await this.save(true);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(
              MESSAGE.SUCCESS,
              MESSAGE.GUI_DUYET_SUCCESS,
            );
            this.quayLai();
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

  pheDuyet(id?) {
    let trangThai = STATUS.CHO_DUYET_LDTC;
    if (this.itemThongTri.trangThai == STATUS.CHO_DUYET_LDV) {
      trangThai = STATUS.CHO_DUYET_LDTC;
    }
    if (this.itemThongTri.trangThai == STATUS.CHO_DUYET_LDTC) {
      trangThai = STATUS.DA_DUYET_LDTC;
    }
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
            id: id ? id : this.idInput,
            trangThai: trangThai,
          };
          let res =
            await this.thongTriDuyetYCapVonService.updateStatus(
              body,
            );
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

  tuChoi() {
    let trangThai = STATUS.TU_CHOI_LDV;
    if (this.itemThongTri.trangThai == STATUS.CHO_DUYET_LDTC) {
      trangThai = STATUS.TU_CHOI_LDTC;
    }
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
            trangThai: trangThai,
          };
          const res = await this.thongTriDuyetYCapVonService.updateStatus(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.TU_CHOI_SUCCESS);
            this.quayLai();
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

  thongTinTrangThai(trangThai: string): string {
    return thongTinTrangThaiNhap(trangThai);
  }

  them() {
    let isValid = true;
    for (let key in this.rowItem) {
      if (this.rowItem[key] === null) {
        isValid = false;
      }
    }
    if (isValid) {
      this.chiTietList.push(this.rowItem);
      this.clear();
    } else {
      this.notification.error(MESSAGE.ERROR, MESSAGE.NULL_ERROR);
    }

  }

  clear() {
    this.rowItem = {};
  }

  showEditItem(idx: number, type: string) {
    if (this.chiTietList.length > 0) {
      this.chiTietList.forEach((item, index) => {
        if (index === idx) {
          if (type === 'show') {
            item.edit = true;
          } else {
            item.edit = false;
          }
        }
      });
    }
  }

  xoaItem(idx: number) {
    if (this.chiTietList.length > 0) {
      this.chiTietList.splice(idx, 1);
    }
  }

  async changeMaTongHop() {
    let selected = this.formData.get('soDnCapVon').value;
    this.dsBoNganh = [];
    if (selected) {
      let res = await this.tongHopDeNghiCapVonService.loadChiTiet(selected);
      if (res.msg == MESSAGE.SUCCESS && res.data) {
        let map = res.data.ct1s.map(s => s.maBn);
        if (map.includes('BTC')) {
          map.push('Bộ Tài chính');
        }
        this.dsBoNganh = this.dsBoNganhFix.filter(s => map.includes(s.code));
      }
    }
  }

  async changeDonVi() {
    this.formData.patchValue({
      'dviThuHuong': null,
    });
    this.listDviThuHuong = [];
    if (this.formData.value.dviThongTri) {
      if (this.formData.value.dviThongTri == 'BTC') {
        let item = {
          'dvCungCapHang': 'Tổng cục dự trữ nhà nước',
          'nganHang': null,
          'id': 9999,
          'soTaiKhoan': null,
          'maHopDong': '',
        };
        this.listDviThuHuong.push(item);
        this.formData.patchValue({
          'dviThuHuong': this.listDviThuHuong[0].id,
          'tenLoaiTien': 'VNĐ',
          'loaiTien': '01'
        });
      } else {
        let res = await this.deNghiCapPhiBoNganhService.dsThuHuong({
          maBoNganh: this.formData.value.dviThongTri,
          maTh: this.formData.value.soDnCapVon,
        });
        if (res.msg == MESSAGE.SUCCESS && res.data) {
          this.listDviThuHuong = res.data;
        }
      }
    }
  }

  async changeDonViThuHuong() {
    let data = this.listDviThuHuong.find(s => s.id == this.formData.value.dviThuHuong);
    if (data) {
      this.formData.patchValue({
        dviThuHuongStk: data.soTaiKhoan,
        dviThuHuongNganHang: data.nganHang,
        tenDviThuHuong: data.dvCungCapHang,
        loaiTien: data.loaiTien,
        tenLoaiTien: data.tenLoaiTien,
      });
    }
  }
  templateName = 'thong-tri-y-duyet-du-toan';

  async preview(id) {
    this.spinner.show();
    await this.thongTriDuyetYCapVonService.preview({
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
