import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as dayjs from 'dayjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { FileDinhKem } from 'src/app/models/DeXuatKeHoachuaChonNhaThau';
import {
  DiaDiemGiaoNhan, PhanLoTaiSan
} from 'src/app/models/KeHoachBanDauGia';
import { UserLogin } from 'src/app/models/userlogin';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { DonviService } from 'src/app/services/donvi.service';
import { HelperService } from 'src/app/services/helper.service';
import { DeNghiCapPhiBoNganhService } from 'src/app/services/ke-hoach/von-phi/deNghiCapPhiBoNganh.service';
import { ThongTriDuyetYCapVonService } from 'src/app/services/ke-hoach/von-phi/thongTriDuyetYCapVon.service';
import { UserService } from 'src/app/services/user.service';
import { thongTinTrangThaiNhap } from 'src/app/shared/commonFunction';
import { Globals } from 'src/app/shared/globals';

@Component({
  selector: 'app-thong-tin-thong-tri-duyet-y-du-toan',
  templateUrl: './thong-tin-thong-tri-duyet-y-du-toan.component.html',
  styleUrls: ['./thong-tin-thong-tri-duyet-y-du-toan.component.scss']
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
  khBanDauGia: any = {};
  diaDiemGiaoNhan: DiaDiemGiaoNhan = new DiaDiemGiaoNhan();
  diaDiemGiaoNhanList: Array<DiaDiemGiaoNhan> = [];
  phanLoTaiSanList: Array<PhanLoTaiSan> = [];
  listChungLoaiHangHoa: any[] = [];
  maKeHoach: string;
  listLoaiHopDong: any[] = [];
  dsBoNganh: any[] = [];
  listDeNghi: any[] = [];

  rowItem: any = {};
  chiTietList: any[] = [];

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
    private deNghiCapPhiBoNganhService: DeNghiCapPhiBoNganhService,
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
    if (this.idInput > 0) {
      this.loadDeXuatKHBanDauGia(this.idInput);
    } else {
    }
    this.khBanDauGia.nam = dayjs().year();
    this.initForm();
    await Promise.all([
      this.getListBoNganh(),
      this.getListDeNghi(),
    ]);
    this.spinner.hide();
  }

  initForm() {
    this.formData = this.fb.group({
      id: [
        {
          value: this.khBanDauGia ? this.khBanDauGia.id : null,
          disabled: this.isView ? true : false,
        },
        [],
      ],
      nam: [
        {
          value: this.khBanDauGia ? this.khBanDauGia.nam : null,
          disabled: true,
        },
        [Validators.required],
      ],
      soThongTri: [
        {
          value: this.khBanDauGia ? this.khBanDauGia.soThongTri : null,
          disabled: this.isView ? true : false,
        },
        [Validators.required],
      ],
      ngayLap: [
        {
          value: this.khBanDauGia ? this.khBanDauGia.ngayLap : null,
          disabled: this.isView ? true : false,
        },
        [Validators.required],
      ],
      lyDoChi: [
        {
          value: this.khBanDauGia ? this.khBanDauGia.lyDoChi : null,
          disabled: this.isView ? true : false,
        },
        [Validators.required],
      ],
      soDnCapVon: [
        {
          value: this.khBanDauGia ? this.khBanDauGia.soDnCapVon : null,
          disabled: this.isView ? true : false,
        },

        [Validators.required],
      ],
      maDvi: [
        {
          value: this.khBanDauGia ? this.khBanDauGia.maDvi : null,
          disabled: this.isView ? true : false,
        },
        [Validators.required],
      ],
      loai: [
        {
          value: this.khBanDauGia ? this.khBanDauGia.loai : null,
          disabled: this.isView ? true : false,
        },
        [Validators.required],
      ],
      khoan: [
        {
          value: this.khBanDauGia
            ? this.khBanDauGia.khoan
            : null,
          disabled: this.isView ? true : false,
        },
        [Validators.required],
      ],
      chuong: [
        {
          value: this.khBanDauGia
            ? this.khBanDauGia.chuong
            : null,
          disabled: this.isView ? true : false,
        },
        [Validators.required],
      ],
      nhanXet: [
        {
          value: this.khBanDauGia
            ? this.khBanDauGia.nhanXet
            : null,
          disabled: this.isView ? true : false,
        },
        [Validators.required],
      ],
    });
  }

  isDisableField() {
    if (this.khBanDauGia && (this.khBanDauGia.trangThai == this.globals.prop.NHAP_CHO_DUYET_LD_VU || this.khBanDauGia.trangThai == this.globals.prop.NHAP_DA_DUYET_LD_VU)) {
      return true;
    }
  }

  async getListDeNghi() {
    this.listDeNghi = [];
    let body = {
      pageNumber: 1,
      pageSize: 1000,
    }
    let res = await this.deNghiCapPhiBoNganhService.timKiem(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.listDeNghi = res.data.content;
    }
  }

  async getListBoNganh() {
    this.dsBoNganh = [];
    let res = await this.danhMucService.danhMucChungGetAll('BO_NGANH');
    if (res.msg == MESSAGE.SUCCESS) {
      this.dsBoNganh = res.data;
    }
  }

  back() {
    this.showListEvent.emit();
  }

  async loadDeXuatKHBanDauGia(id: number) {
    await this.thongTriDuyetYCapVonService
      .loadChiTiet(id)
      .then((res) => {
        if (res.msg == MESSAGE.SUCCESS) {
          this.khBanDauGia = res.data;
          if (this.khBanDauGia.chiTietList) {
            this.chiTietList = this.khBanDauGia.chiTietList;
          }
          if (this.khBanDauGia.fileDinhKems) {
            this.listFileDinhKem = this.khBanDauGia.fileDinhKems;
          }
          this.initForm();
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
      debugger
      let body = this.formData.value;
      body.nam = this.formData.controls.nam.value;
      body.chiTietList = this.chiTietList;
      body.fileDinhKems = this.listFileDinhKem;
      body.id = this.idInput;
      if (this.idInput > 0) {
        let res = await this.thongTriDuyetYCapVonService.sua(body);
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
        let res = await this.thongTriDuyetYCapVonService.them(body);
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
            trangThai: this.globals.prop.NHAP_CHO_DUYET_LD_VU,
          };
          let res = await this.thongTriDuyetYCapVonService.updateStatus(body);
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
    let trangThai = this.globals.prop.NHAP_DA_DUYET_LD_VU;
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
    this.rowItem = {}
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
      })
    }
  }

  xoaItem(idx: number) {
    if (this.chiTietList.length > 0) {
      this.chiTietList.splice(idx, 1);
    }
  }
}
