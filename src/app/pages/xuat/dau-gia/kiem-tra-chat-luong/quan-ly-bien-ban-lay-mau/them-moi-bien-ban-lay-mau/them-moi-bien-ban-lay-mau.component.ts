import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { DanhSachDauThauService } from 'src/app/services/danhSachDauThau.service';
import { DonviService } from 'src/app/services/donvi.service';
import { Globals } from 'src/app/shared/globals';
import { UserLogin } from 'src/app/models/userlogin';
import dayjs from 'dayjs';
import { QuanLyBienBanLayMauService } from 'src/app/services/quanLyBienBanLayMau.service';
import { ThongTinHopDongService } from 'src/app/services/thongTinHopDong.service';
import { QuyetDinhGiaoNhapHangService } from 'src/app/services/quyetDinhGiaoNhapHang.service';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { PhuongPhapLayMau } from 'src/app/models/PhuongPhapLayMau';
import { BienBanLayMau } from 'src/app/models/BienBanLayMau';
import { UserService } from 'src/app/services/user.service';
import { MESSAGE } from 'src/app/constants/message';
import { QuanLyPhieuNhapDayKhoService } from 'src/app/services/quanLyPhieuNhapDayKho.service';
import { DialogDanhSachHangHoaComponent } from 'src/app/components/dialog/dialog-danh-sach-hang-hoa/dialog-danh-sach-hang-hoa.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DANH_MUC_LEVEL } from 'src/app/pages/luu-kho/luu-kho.constant';
import { isEmpty } from 'lodash';
import { QuanLyBienBanLayMauXuatService } from 'src/app/services/qlnv-hang/xuat-hang/kiem-tra-chat-luong/quanLyBienBanLayMauXuat';
import { X } from '@angular/cdk/keycodes';

@Component({
  selector: 'them-moi-bien-ban-lay-mau',
  templateUrl: './them-moi-bien-ban-lay-mau.component.html',
  styleUrls: ['./them-moi-bien-ban-lay-mau.component.scss'],
})
export class ThemMoiBienBanLayMauKhoComponent implements OnInit {
  @Input() id: number;
  @Input() isView: boolean;
  @Input() isTatCa: boolean;
  @Input() typeVthh: string;
  @Output()
  showListEvent = new EventEmitter<any>();

  formData: FormGroup;

  detail: any = {};
  userInfo: UserLogin;

  donVi: any

  detailHopDong: any = {};
  detailGiaoNhap: any = {};
  maVthh: string;
  phuongPhapLayMaus: Array<PhuongPhapLayMau>;

  listSoQuyetDinh: any[] = [];
  listBienBanDayKho: any[] = [];
  dsTong: any
  dsDiemKho: any[] = [];
  dsNhaKho: any[] = [];
  dsNganKho: any[] = [];
  dsNganLo: any[] = [];
  dsLoKho: any[] = [];

  capCuc: string = '2';
  capChiCuc: string = '3';

  listDaiDienCuc: any[] = [];
  listDaiDienChiCuc: any[] = [];

  dsLoaiHangHoa: any[] = [];
  dsChungLoaiHangHoa: any[] = [];
  // listDaiDien: any[] = [];
  listDaiDien: any[] = [
    {
      'bbLayMauId': null,
      'daiDien': null,
      'id': null,
      'idTemp': 1,
      'loaiDaiDien': '2',
    },
    {
      'bbLayMauId': null,
      'daiDien': null,
      'id': null,
      'idTemp': 1,
      'loaiDaiDien': '3',
    },
  ];

  constructor(
    private spinner: NgxSpinnerService,
    private bienBanLayMauService: QuanLyBienBanLayMauService,
    private notification: NzNotificationService,
    private modal: NzModalService,
    public globals: Globals,
    private userService: UserService,
    private thongTinHopDongService: ThongTinHopDongService,
    private quyetDinhGiaoNhapHangService: QuyetDinhGiaoNhapHangService,
    private danhMucService: DanhMucService,
    private quanLyPhieuNhapDayKhoService: QuanLyPhieuNhapDayKhoService,
    private donViService: DonviService,
    private fb: FormBuilder,
    private quanLyBienBanLayMauXuatService: QuanLyBienBanLayMauXuatService
  ) { }

  async ngOnInit() {
    this.newObjectBienBanLayMau();
    this.initForm();

    await Promise.all([
      this.initData(),
      this.loadPhuongPhapLayMau(),
      this.loadSoQuyetDinh(),
      this.loaiVTHHGetAll(),
    ]);

    if (this.id > 0) {
      await this.loadBienbanLayMau();
    } else {
      this.loadDaiDien();
    }
  }


  initForm(): void {
    this.formData = this.fb.group({
      "soBienBan": [null],
      "tenDonVi": [null],
      "maQHNS": [null],
      "donViKN": [null],
      "loaiHang": [null],
      "chungLoaiHang": [null],
      "maDiemKho": [null],
      "maNhaKho": [null],
      "maNganKho": [null],
      "maLoKho": [null],
      "ngayLayMau": [null],
      "diaDiemLayMau": [null],
      "sLMauHangKiemTra": [null],
      "ppLayMau": [null],
      "chiTieuKT": [null],
      "kQNiemPhongMau": [null],

    })
  }

  async initData() {
    this.userInfo = this.userService.getUserLogin();
    this.detail.maDvi = this.userInfo.MA_DVI;
    this.detail.tenDvi = this.userInfo.TEN_DVI;
    this.detail.capDvi = this.userInfo.CAP_DVI;
    await this.loadDonVi()
  }

  async loadDonVi() {
    const body = {
      maDviCha: this.detail.maDvi,
      trangThai: '01',
    };
    const dsTong = await this.donViService.layDonViTheoCapDo(body);

    if (!isEmpty(dsTong)) {
      this.dsTong = dsTong;
      this.donVi = dsTong[DANH_MUC_LEVEL.CHI_CUC];
      if (!isEmpty(this.donVi)) {
        this.formData.get('tenDonVi').setValue(this.donVi[0].tenDvi)
        this.formData.controls['tenDonVi'].disable();
        this.formData.get('maQHNS').setValue(this.donVi[0].maQhns)
        this.formData.controls['maQHNS'].disable();
        const chiCuc = this.donVi[0]
        if (chiCuc) {
          const result = {
            ...this.donViService.layDsPhanTuCon(this.dsTong, chiCuc),
          };
          this.dsDiemKho = result[DANH_MUC_LEVEL.DIEM_KHO];
        } else {
          this.dsDiemKho = [];
        }
      }
    }
  }
  onChangeDiemKho(id) {
    const dsDiemKho = this.dsDiemKho.find((item) => item.maDvi === id);
    this.formData.get('maNhaKho').setValue(null);
    this.formData.get('maNganKho').setValue(null);
    this.formData.get('maLoKho').setValue(null);
    if (dsDiemKho) {
      const result = {
        ...this.donViService.layDsPhanTuCon(this.dsTong, dsDiemKho),
      };
      this.dsNhaKho = result[DANH_MUC_LEVEL.NHA_KHO];
    } else {
      this.dsNhaKho = [];
    }
  }
  onChangeNhaKho(id) {
    const nhaKho = this.dsNhaKho.find((item) => item.maDvi === id);
    this.formData.get('maNganKho').setValue(null);
    this.formData.get('maLoKho').setValue(null);
    if (nhaKho) {
      const result = { ...this.donViService.layDsPhanTuCon(this.dsTong, nhaKho), };
      this.dsNganKho = result[DANH_MUC_LEVEL.NGAN_KHO];
    } else {
      this.dsNganKho = [];
    }
  }
  onChangeNganKho(id) {
    const nganKho = this.dsNganKho.find((item) => item.maDvi === id);
    this.formData.get('maLoKho').setValue(null);
    if (nganKho) {
      const result = {
        ...this.donViService.layDsPhanTuCon(this.dsTong, nganKho),
      };
      this.dsLoKho = result[DANH_MUC_LEVEL.NGAN_LO];
    } else {
      this.dsLoKho = [];
    }
  }
  async loaiVTHHGetAll() {
    try {
      await this.danhMucService.loadDanhMucHangHoa().subscribe((hangHoa) => {
        if (hangHoa.msg == MESSAGE.SUCCESS) {
          hangHoa.data.forEach((item) => {
            if (item.cap === "1" && item.ma != '01') {
              this.dsLoaiHangHoa = [...this.dsLoaiHangHoa, item];
            }
            else {
              this.dsLoaiHangHoa = [...this.dsLoaiHangHoa, ...item.child];
            }
          })
        }
      })
    } catch (error) {
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }
  async changeLoaiHangHoa(id: any) {
    if (id && id > 0) {
      let loaiHangHoa = this.dsLoaiHangHoa.filter(item => item.ma === id);
      this.dsChungLoaiHangHoa = loaiHangHoa[0].child;
    }
  }

  loadDaiDien() {
    if (this.listDaiDien && this.listDaiDien.length > 0) {
      this.listDaiDienCuc = this.listDaiDien.filter((x) => x.loaiDaiDien == this.capCuc,);
      this.listDaiDienChiCuc = this.listDaiDien.filter((x) => x.loaiDaiDien == this.capChiCuc,);
    }
  }

  addDaiDien(type) {
    if (!this.listDaiDien) {
      this.listDaiDien = [];
    }
    if (type) {
      let item = {
        'bbLayMauId': null,
        'daiDien': null,
        'id': null,
        'idTemp': new Date().getTime(),
        'loaiDaiDien': type,
      };
      this.listDaiDien = [item, ...this.listDaiDien]
      this.loadDaiDien();
    }

  }
  xoaDaiDien(num) {
    this.listDaiDien = this.listDaiDien.filter((x) => x.idTemp != num);
    this.loadDaiDien();
  }

  async loadBienBanDayKho() {
    let param = {
      capDvis: '3',
      maDvi: this.userInfo.MA_DVI,
      maVatTuCha: this.isTatCa ? null : this.typeVthh,
      pageNumber: 0,
      pageSize: 1000,
    };
    let res = await this.quanLyPhieuNhapDayKhoService.timKiem(param);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.listBienBanDayKho = data.content;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async loadSoQuyetDinh() {
    let body = {
      'denNgayQd': null,
      'loaiQd': '',
      'maDvi': this.userInfo.MA_DVI,
      'maVthh': this.typeVthh,
      'namNhap': null,
      'ngayQd': '',
      'orderBy': '',
      'orderDirection': '',
      'paggingReq': {
        'limit': 1000,
        'orderBy': '',
        'orderType': '',
        'page': 0,
      },
      'soHd': '',
      'soQd': null,
      'str': '',
      'trangThai': this.globals.prop.NHAP_BAN_HANH,
      'tuNgayQd': null,
      'veViec': null,
    };
    let res = await this.quyetDinhGiaoNhapHangService.timKiem(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.listSoQuyetDinh = data.content;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async changeSoQuyetDinh() {
    let quyetDinh = this.listSoQuyetDinh.filter(
      (x) => x.id == this.detail.qdgnvnxId,
    );
    if (quyetDinh && quyetDinh.length > 0) {
      this.detailGiaoNhap = quyetDinh[0];
      await this.getHopDong(this.detailGiaoNhap.soHd);
    }
  }

  newObjectBienBanLayMau() {
    this.detail = new BienBanLayMau();
  }

  isAction() {
    if (this.detail.trangThai === this.globals.prop.DU_THAO || !this.isView) {
      return true;
    }
  }

  save(isGuiDuyet?: boolean) {
    this.spinner.show();
    this.listDaiDien = this.listDaiDien.filter((item) => item.idTemp != 1)
    let body = {
      "capDvi": this.detail.capDvi,
      "chiTietList": [
        ...this.listDaiDien
      ],
      "chiTieuKiemTra": this.formData.value.chiTieuKT,
      "diaDiemLayMau": this.formData.value.diaDiemLayMau,
      "donViKiemNghiem": this.formData.value.donViKN,
      "fileDinhKems": [
        {
          "dataId": 0,
          "fileName": "",
          "fileSize": "",
          "fileUrl": "",
          "id": 0,
          "noiDung": ""
        }
      ],
      "id": 0,
      "ketQuaNiemPhong": this.formData.value.kQNiemPhongMau,
      "loaiVthh": this.formData.value.loaiHang,
      "lyDoTuChoi": "",
      "maDiemKho": this.formData.value.maDiemKho,
      "maDvi": this.detail.maDvi,
      "maNganKho": this.formData.value.maNganKho,
      "maNganLo": this.formData.value.maNganLo,
      "maNhaKho": this.formData.value.maNhaKho,
      "maVatTu": this.formData.value.chungLoaiHang,
      "maVatTuCha": "",
      "nam": 0,
      "ngayGuiDuyet": "",
      "ngayLayMau": this.formData.value.ngayLayMau,
      "ngayPduyet": "",
      "nguoiGuiDuyetId": 0,
      "nguoiPduyetId": 0,
      "ppLayMau": this.formData.value.ppLayMau,
      "qdgnvxId": 0,
      "so": 0,
      "soBienBan": this.formData.value.soBienBan,
      "soLuongMau": 0,
      "trangThai": "00"
    }


    console.log(body);

    if (this.id > 0) {
      this.quanLyBienBanLayMauXuatService
        .edit(body)
        .then((res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            if (isGuiDuyet) {
              let body = {
                id: res.data.id,
                lyDo: null,
                trangThai: this.globals.prop.DU_THAO_TRINH_DUYET,
              };
              this.quanLyBienBanLayMauXuatService.updateStatus(body);
              if (res.msg == MESSAGE.SUCCESS) {
                this.notification.success(
                  MESSAGE.SUCCESS,
                  MESSAGE.UPDATE_SUCCESS,
                );
                this.redirectBienBanLayMau();
              } else {
                this.notification.error(MESSAGE.ERROR, res.msg);
              }
            } else {
              this.notification.success(
                MESSAGE.SUCCESS,
                MESSAGE.UPDATE_SUCCESS,
              );
              this.redirectBienBanLayMau();
            }
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
        })
        .catch((e) => {
          console.error('error: ', e);
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        })
        .finally(() => {
          this.spinner.hide();
        });
    } else {
      this.quanLyBienBanLayMauXuatService.addNew(body)
        .then((res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            if (isGuiDuyet) {
              let body = {
                id: res.data.id,
                lyDo: null,
                trangThai: this.globals.prop.LANH_DAO_DUYET,
              };
              this.quanLyBienBanLayMauXuatService.updateStatus(body);
              if (res.msg == MESSAGE.SUCCESS) {
                this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
                this.redirectBienBanLayMau();
              } else {
                this.notification.error(MESSAGE.ERROR, res.msg);
              }
            } else {
              this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
              this.redirectBienBanLayMau();
            }
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
        })
        .catch((e) => {
          console.error('error: ', e);
          this.notification.error(
            MESSAGE.ERROR,
            e.error.errors[0].defaultMessage,
          );
        })
        .finally(() => {
          this.spinner.hide();
        });
    }
  }

  guiDuyet() {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn gửi duyệt?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: async () => {
        this.spinner.show();
        try {
          this.save(true);
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
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn duyệt?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: async () => {
        this.spinner.show();
        try {
          let body = {
            id: this.id,
            lyDo: null,
            trangThai: this.globals.prop.LANH_DAO_DUYET,
          };
          const res = await this.bienBanLayMauService.updateStatus(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.APPROVE_SUCCESS);
            this.redirectBienBanLayMau();
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

  banHanh() {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn ban hành?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: async () => {
        this.spinner.show();
        try {
          let body = {
            id: this.id,
            lyDoTuChoi: null,
            trangThai: this.globals.prop.BAN_HANH,
          };
          const res = await this.bienBanLayMauService.updateStatus(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.APPROVE_SUCCESS);
            this.redirectBienBanLayMau();
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
            id: this.id,
            lyDo: text,
            trangThai: this.globals.prop.TU_CHOI,
          };
          const res = await this.bienBanLayMauService.updateStatus(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.TU_CHOI_SUCCESS);
            this.redirectBienBanLayMau();
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
          this.spinner.hide();
        } catch (e) {
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      }
    });
  }

  huyBo() {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn hủy bỏ các thao tác đang làm?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: () => {
        this.redirectBienBanLayMau();
      },
    });
  }

  redirectBienBanLayMau() {
    this.showListEvent.emit();
  }

  async getHopDong(id) {
    if (id) {
      const body = {
        str: id,
      };
      let res = await this.thongTinHopDongService.loadChiTietSoHopDong(body);

      if (res.msg == MESSAGE.SUCCESS) {
        this.detailHopDong = res.data;
        this.detail.canCu = this.detailHopDong.canCu;
        this.detail.ngayHopDong = this.detailHopDong.ngayKy;
        this.detail.hopDongId = this.detailHopDong.id;
        this.detail.soHopDong = this.detailHopDong.soHd;
        this.detail.tenDonViCCHang = this.detailHopDong.tenDvi;
        this.detail.soLuongMau = this.detailHopDong.soLuong;
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }
  }

  loadPhuongPhapLayMau() {
    this.danhMucService
      .danhMucChungGetAll('PP_LAY_MAU')
      .then((res) => {
        if (res.msg == MESSAGE.SUCCESS) {
          this.phuongPhapLayMaus = res.data;
        } else {
          this.notification.error(MESSAGE.ERROR, res.msg);
        }
      })
      .catch((err) => {
        this.notification.error(MESSAGE.ERROR, err.msg);
      });
  }

  async loadBienbanLayMau() {
    let res = await this.bienBanLayMauService.loadChiTiet(this.id);
    if (res.msg == MESSAGE.SUCCESS) {
      this.detail = res.data;
      this.detail.ppLayMau = +res.data.ppLayMau;
      if (
        this.detail.chiTiets &&
        this.detail.chiTiets.length > 0
      ) {
        this.listDaiDien = [];
        this.detail.chiTiets.forEach((element, index) => {
          let item = {
            ...element,
            idTemp: new Date().getTime() + index,
          };
          this.listDaiDien.push(item);
        });
        this.loadDaiDien();
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  thongTinTrangThai(trangThai: string): string {
    if (
      trangThai === this.globals.prop.DU_THAO ||
      trangThai === this.globals.prop.LANH_DAO_DUYET ||
      trangThai === this.globals.prop.TU_CHOI ||
      trangThai === this.globals.prop.DU_THAO_TRINH_DUYET ||
      trangThai === this.globals.prop.NHAP_CHO_DUYET_KTV_BAO_QUAN ||
      !trangThai
    ) {
      return 'du-thao-va-lanh-dao-duyet';
    } else if (trangThai === this.globals.prop.BAN_HANH) {
      return 'da-ban-hanh';
    }
  }
}
