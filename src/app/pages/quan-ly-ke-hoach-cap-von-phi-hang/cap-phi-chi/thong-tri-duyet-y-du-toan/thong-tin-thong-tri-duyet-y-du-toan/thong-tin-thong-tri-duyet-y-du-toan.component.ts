import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output,} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import * as dayjs from 'dayjs';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NgxSpinnerService} from 'ngx-spinner';
import {DialogTuChoiComponent} from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import {MESSAGE} from 'src/app/constants/message';
import {FileDinhKem} from 'src/app/models/DeXuatKeHoachuaChonNhaThau';
import {DiaDiemGiaoNhan, PhanLoTaiSan,} from 'src/app/models/KeHoachBanDauGia';
import {UserLogin} from 'src/app/models/userlogin';
import {DanhMucService} from 'src/app/services/danhmuc.service';
import {DonviService} from 'src/app/services/donvi.service';
import {HelperService} from 'src/app/services/helper.service';
import {DeNghiCapPhiBoNganhService} from 'src/app/services/ke-hoach/von-phi/deNghiCapPhiBoNganh.service';
import {ThongTriDuyetYCapPhiService} from 'src/app/services/ke-hoach/von-phi/thongTriDuyetYCapPhi.service';
import {TongHopDeNghiCapPhiService} from 'src/app/services/ke-hoach/von-phi/tongHopDeNghiCapPhi.service';
import {UserService} from 'src/app/services/user.service';
import {thongTinTrangThaiNhap} from 'src/app/shared/commonFunction';
import {Globals} from 'src/app/shared/globals';
import {STATUS} from '../../../../../constants/status';
import {AMOUNT_NO_DECIMAL} from '../../../../../Utility/utils';
import {PREVIEW} from "../../../../../constants/fileType";
import printJS from "print-js";
import {saveAs} from 'file-saver';
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

  templateName : string = 'thong-tri-y-duyet-du-toan';
  pdfSrc: any;
  wordSrc: any;
  excelSrc: any;
  printSrc: any;
  showDlgPreview = false;

  constructor(
    private modal: NzModalService,
    private danhMucService: DanhMucService,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    private fb: FormBuilder,
    public globals: Globals,
    public userService: UserService,
    private donviService: DonviService,
    private thongTriDuyetYCapPhiService: ThongTriDuyetYCapPhiService,
    private cdr: ChangeDetectorRef,
    private helperService: HelperService,
    private deNghiCapPhiBoNganhService: DeNghiCapPhiBoNganhService,
    private tongHopDeNghiCapPhiService: TongHopDeNghiCapPhiService,
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
    this.itemThongTri.nam = dayjs().year();
    this.itemThongTri.trangThai = STATUS.DU_THAO;
    this.itemThongTri.tenTrangThai = 'Dự thảo';
    this.initForm();
    await Promise.all([
      this.getListBoNganh(),
      this.getListDeNghi(),
      this.getListTongHop(),
    ]);
    if (this.idInput > 0) {
      await this.loadDetail(this.idInput);
    } else {
    }
    this.spinner.hide();
  }

  initForm() {
    this.formData = this.fb.group({
      id: [
        {
          value: this.itemThongTri ? this.itemThongTri.id : null,
          disabled: this.isView ? true : false,
        },
        [],
      ],
      nam: [this.itemThongTri ? this.itemThongTri.nam : null, [Validators.required]],
      soThongTri: [
        {
          value: this.itemThongTri ? this.itemThongTri.soThongTri : null,
          disabled: this.isView ? true : false,
        },
        [Validators.required],
      ],
      ngayLap: [
        {
          value: this.itemThongTri ? this.itemThongTri.ngayLap : null,
          disabled: this.isView ? true : false,
        },
        [Validators.required],
      ],
      lyDoChi: [
        {
          value: this.itemThongTri ? this.itemThongTri.lyDoChi : null,
          disabled: this.isView ? true : false,
        },
        [Validators.required],
      ],
      soDnCapPhi: [
        {
          value: this.itemThongTri ? this.itemThongTri.soDnCapPhi : null,
          disabled: this.isView ? true : false,
        },

        [Validators.required],
      ],
      maDvi: [
        {
          value: this.userInfo.MA_DVI,
          disabled: this.isView ? true : false,
        },
        [Validators.required],
      ],
      loai: [
        {
          value: this.itemThongTri ? this.itemThongTri.loai : null,
          disabled: this.isView ? true : false,
        },
        [Validators.required],
      ],
      khoan: [
        {
          value: this.itemThongTri
            ? this.itemThongTri.khoan
            : null,
          disabled: this.isView ? true : false,
        },
        [Validators.required],
      ],
      chuong: [
        {
          value: this.itemThongTri
            ? this.itemThongTri.chuong
            : null,
          disabled: this.isView ? true : false,
        },
        [Validators.required],
      ],
      nhanXet: [
        {
          value: this.itemThongTri
            ? this.itemThongTri.nhanXet
            : null,
          disabled: this.isView ? true : false,
        },
        [Validators.required],
      ],
      dviThuHuong: [{
        value: this.itemThongTri ? +this.itemThongTri.dviThuHuong : null,
        disabled: this.isView ? true : false,
      }],
      tenDviThuHuong: [{
        value: this.itemThongTri ? +this.itemThongTri.tenDviThuHuong : null,
        disabled: this.isView ? true : false,
      }],
      dviThuHuongStk: [{
        value: this.itemThongTri ? this.itemThongTri.dviThuHuongStk : null,
        disabled: this.isView ? true : false,
      }],
      dviThuHuongNganHang: [{
        value: this.itemThongTri ? this.itemThongTri.dviThuHuongNganHang : null,
        disabled: this.isView ? true : false,
      }],
      dviThongTri: [{
        value: this.itemThongTri ? this.itemThongTri.dviThongTri : null,
        disabled: this.isView ? true : false,
      }, [Validators.required]],
    });
  }

  isDisableField() {
    if (this.itemThongTri && (this.itemThongTri.trangThai == STATUS.CHO_DUYET_LDV || this.itemThongTri.trangThai == STATUS.DA_DUYET_LDV || this.itemThongTri.trangThai == STATUS.DA_DUYET_LDTC)) {
      return true;
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
      nam : this.formData.get("nam").value
    };
    let res = await this.tongHopDeNghiCapPhiService.timKiem(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.listTongHop = res.data.content;
    }
  }

  async getListBoNganh() {
    this.dsBoNganh = [];
    let res = await this.donviService.layTatCaDonViByLevel(0);
    if (res.msg == MESSAGE.SUCCESS) {
      this.dsBoNganh = res.data;
      this.dsBoNganhFix = res.data;
    }
  }

  back() {
    this.showListEvent.emit();
  }

  async loadDetail(id: number) {
    await this.thongTriDuyetYCapPhiService
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

  async save(isOther?: boolean) {
    this.spinner.show();
    try {
      let body = this.formData.value;
      body.nam = this.formData.controls.nam.value;
      body.chiTietList = this.chiTietList;
      body.fileDinhKems = this.listFileDinhKem;
      body.id = this.idInput;
      if (this.idInput > 0) {
        let res = await this.thongTriDuyetYCapPhiService.sua(body);
        if (res.msg == MESSAGE.SUCCESS) {
          if (!isOther) {
            this.idInput = res.data.id;
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
            // this.back();
          } else {
            return res.data.id;
          }
        } else {
          this.notification.error(MESSAGE.ERROR, res.msg);
        }
      } else {
        let res = await this.thongTriDuyetYCapPhiService.them(body);
        if (res.msg == MESSAGE.SUCCESS) {
          if (!isOther) {
            this.idInput = res.data.id;
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
            // this.back();
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
            trangThai: STATUS.CHO_DUYET_LDV,
          };
          let res = await this.thongTriDuyetYCapPhiService.updateStatus(body);
          await this.save(true);
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

  pheDuyet() {
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
            id: this.idInput,
            lyDoTuChoi: null,
            trangThai: trangThai,
          };
          let res =
            await this.thongTriDuyetYCapPhiService.updateStatus(
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
            lyDo: text,
            trangThai: this.globals.prop.NHAP_TU_CHOI_LD_VU,
          };
          const res = await this.thongTriDuyetYCapPhiService.updateStatus(body);
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
    let selected = this.formData.get('soDnCapPhi').value;
    this.dsBoNganh = [];
    /*this.formData.patchValue({
      dviThongTri: null
    })*/
    if (selected) {
      let res = await this.tongHopDeNghiCapPhiService.loadChiTiet(selected);
      if (res.msg == MESSAGE.SUCCESS && res.data) {
        let map = res.data.ct1s.map(s => s.maBoNganh);
        if (map.includes('BTC')) {
          map.push('Bộ Tài chính');
        }
        this.dsBoNganh = this.dsBoNganhFix.filter(s => map.includes(s.code));
      }
    }
  }

  async changeDonVi() {
    if (this.formData.value.dviThongTri) {
      let res = await this.deNghiCapPhiBoNganhService.dsThuHuong({
        maBoNganh: this.formData.value.dviThongTri,
        maTh: this.formData.value.soDnCapPhi,
      });
      if (res.msg == MESSAGE.SUCCESS && res.data) {
        this.listDviThuHuong = res.data;
      }
    }
  }

  async changeDonViThuHuong() {
    let data = this.listDviThuHuong.find(s => s.id == this.formData.value.dviThuHuong);
    if (data) {
      this.formData.patchValue({
        dviThuHuongStk: data.soTaiKhoan,
        dviThuHuongNganHang: data.nganHang,
        tenDviThuHuong: data.tenDvCungCap,
      });
    }

  }

  async preview() {
    this.spinner.show();
    let boNganh = this.dsBoNganh.find(item => item.code == this.formData.value.dviThongTri);
    await this.thongTriDuyetYCapPhiService.preview({
      tenBaoCao: this.templateName+ '.docx',
      id : this.idInput,
      maQhns: this.userInfo.DON_VI.maQhns,
      tenBoNganh : boNganh ? boNganh.tenDvi : ''
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
