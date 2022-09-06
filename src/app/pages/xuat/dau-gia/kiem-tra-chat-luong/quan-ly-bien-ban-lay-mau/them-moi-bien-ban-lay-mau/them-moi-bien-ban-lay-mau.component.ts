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

  detail: any;
  routerUrl: string;
  userInfo: UserLogin;
  detailHopDong: any = {};
  detailGiaoNhap: any = {};
  maVthh: string;
  phuongPhapLayMaus: Array<PhuongPhapLayMau>;

  listSoQuyetDinh: any[] = [];
  listBienBanDayKho: any[] = [];
  listDiemKho: any[] = [];
  listNhaKho: any[] = [];
  listNganKho: any[] = [];
  listNganLo: any[] = [];

  capCuc: string = '2';
  capChiCuc: string = '3';
  listDaiDienCuc: any[] = [];
  listDaiDienChiCuc: any[] = [];
  listHangHoa: any[] = [];
  listDaiDien: any[] = [
    {
      bbLayMauId: null,
      daiDien: null,
      id: null,
      idTemp: 1,
      loaiDaiDien: '2',
    },
    {
      bbLayMauId: null,
      daiDien: null,
      id: null,
      idTemp: 1,
      loaiDaiDien: '3',
    },
  ];

  constructor(
    private spinner: NgxSpinnerService,
    private bienBanLayMauService: QuanLyBienBanLayMauService,
    private notification: NzNotificationService,
    private router: Router,
    private modal: NzModalService,
    public globals: Globals,
    private routerActive: ActivatedRoute,
    private userService: UserService,
    private thongTinHopDongService: ThongTinHopDongService,
    private quyetDinhGiaoNhapHangService: QuyetDinhGiaoNhapHangService,
    private danhMucService: DanhMucService,
    private quanLyPhieuNhapDayKhoService: QuanLyPhieuNhapDayKhoService,
    private donViService: DonviService,
    private fb: FormBuilder,
  ) { }

  async ngOnInit() {
    this.routerUrl = this.router.url;
    this.userInfo = this.userService.getUserLogin();
    this.newObjectBienBanLayMau();
    this.detail.maDvi = this.userInfo.MA_DVI;
    this.detail.tenDvi = this.userInfo.TEN_DVI;
    this.detail.maVatTuCha = this.typeVthh;
    this.detail.trangThai = this.globals.prop.DU_THAO;
    this.initForm();
    await Promise.all([
      this.loadPhuongPhapLayMau(),
      this.loadSoQuyetDinh(),
      this.loaiVTHHGetAll(),
      this.loadDiemKho(),
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
      "ngayLayMau": [null],
      "maDiemKho": [null],
      "maNhaKho": [null],
      "maNganKho": [null],
      "maNganLo": [null]
    })
  }

  // async loadDiemKho() {
  //   let body = {
  //     maDviCha: this.detail.maDvi,
  //     trangThai: '01',
  //   };
  //   this.listDiemKho = [];
  //   const res = await this.donViService.getTreeAll(body);
  //   if (res.msg == MESSAGE.SUCCESS) {
  //     if (res.data && res.data.length > 0) {
  //       res.data.forEach((element) => {
  //         if (element && element.capDvi == '3' && element.children) {
  //           this.listDiemKho = [...this.listDiemKho, ...element.children];
  //         }
  //       });
  //     }
  //   } else {
  //     this.notification.error(MESSAGE.ERROR, res.msg);
  //   }
  // }

  // changeDiemKho(fromChiTiet: boolean) {
  //   let diemKho = this.listDiemKho.filter(
  //     (x) => x.key == this.detail.maDiemKho,
  //   );
  //   this.detail.maNhaKho = null;
  //   if (diemKho && diemKho.length > 0) {
  //     this.listNhaKho = diemKho[0].children;
  //     if (fromChiTiet) {
  //       this.changeNhaKho(fromChiTiet);
  //     }
  //   }
  // }

  // changeNhaKho(fromChiTiet: boolean) {
  //   let nhaKho = this.listNhaKho.filter(
  //     (x) => x.key == this.detail.maNhaKho,
  //   );
  //   if (nhaKho && nhaKho.length > 0) {
  //     this.listNganKho = nhaKho[0].children;
  //     if (fromChiTiet) {
  //       this.changeNganKho();
  //     }
  //   }
  // }

  // changeNganKho() {
  //   let nganKho = this.listNganKho.filter(
  //     (x) => x.key == this.detail.maNganKho,
  //   );
  //   if (nganKho && nganKho.length > 0) {
  //     this.listNganLo = nganKho[0].children;
  //   }
  // }


  async loadDiemKho() {
    let body = {
      maDviCha: this.detail.maDvi,
      trangThai: '01',
    }
    const res = await this.donViService.getTreeAll(body);
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data && res.data.length > 0) {
        res.data.forEach(element => {
          if (element && element.capDvi == '3' && element.children) {
            this.listDiemKho = [
              ...this.listDiemKho,
              ...element.children
            ]
          }
        });
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }

    console.log(this.listDiemKho);
  }

  changeDiemKho(fromChiTiet: boolean) {

    let diemKho = this.listDiemKho.filter(x => x.maDvi == this.formData.value.maDiemKho);
    // if (!fromChiTiet) {
    //   this.detail.maNhaKho = null;
    // }
    if (diemKho && diemKho.length > 0) {
      this.listNhaKho = diemKho[0].children;
      if (fromChiTiet) {
        this.changeNhaKho(fromChiTiet);
      }
    }
    console.log(this.listNhaKho);

  }

  changeNhaKho(fromChiTiet: boolean) {
    let nhaKho = this.listNhaKho.filter(x => x.maDvi == this.formData.value.maNhaKho);
    if (nhaKho && nhaKho.length > 0) {
      this.listNganKho = nhaKho[0].children;
      if (fromChiTiet) {
        this.changeNganKho();
      }
    }
    console.log(this.listNganKho);

  }

  changeNganKho() {
    let nganKho = this.listNganKho.filter(x => x.maDvi == this.formData.value.maNganKho);
    if (nganKho && nganKho.length > 0) {
      this.listNganLo = nganKho[0].children;
    }
    console.log(this.listNganLo);
    console.log(this.formData.value);

  }




  selectHangHoa() {
    let data = '02';
    const modalTuChoi = this.modal.create({
      nzTitle: 'Danh sách hàng hóa',
      nzContent: DialogDanhSachHangHoaComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: { data },
    });
    modalTuChoi.afterClose.subscribe(async (data) => {
      if (data) {
        this.bindingDataHangHoa(data);
      }
    });
  }

  async bindingDataHangHoa(data) {
    if (data.loaiHang == 'M' || data.loaiHang == 'LT') {
      this.detail.maVatTuCha = data.parent.ma;
      this.detail.tenVatTuCha = data.parent.ten;
      this.detail.maVatTu = data.ma;
      this.detail.tenVatTu = data.ten;
      this.detail.donViTinh = data.maDviTinh;
    }
    if (data.loaiHang == 'VT') {
      if (data.cap == '3') {
        this.detail.maVatTuCha = data.parent.parent.ma;
        this.detail.tenVatTuCha = data.parent.parent.ten;
        this.detail.maVatTu = data.parent.ma;
        this.detail.tenVatTu = data.parent.ten;
        this.detail.donViTinh = data.parent.maDviTinh;
      }
      if (data.cap == '2') {
        this.detail.maVatTuCha = data.parent.ma;
        this.detail.tenVatTuCha = data.parent.ten;
        this.detail.maVatTu = data.ma;
        this.detail.tenVatTu = data.ten;
        this.detail.donViTinh = data.maDviTinh;
      }
    }
  }

  async loaiVTHHGetAll() {
    let res = await this.danhMucService.loaiVatTuHangHoaGetAll();
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data && res.data.length > 0) {
        if (this.isTatCa) {
          this.listHangHoa = res.data;
          this.detail.maVatTuCha = this.listHangHoa[0].ma;
        } else {
          this.listHangHoa = res.data.filter((x) => x.ma == this.typeVthh);
        }
      }
    }
  }

  loadDaiDien() {
    if (this.listDaiDien && this.listDaiDien.length > 0) {
      this.listDaiDienCuc = this.listDaiDien.filter(
        (x) => x.loaiDaiDien == this.capCuc,
      );
      this.listDaiDienChiCuc = this.listDaiDien.filter(
        (x) => x.loaiDaiDien == this.capChiCuc,
      );
    }
  }

  addDaiDien(type) {
    if (!this.listDaiDien) {
      this.listDaiDien = [];
    }
    let item = {
      bbLayMauId: null,
      daiDien: null,
      id: null,
      idTemp: new Date().getTime(),
      loaiDaiDien: type,
    };
    this.listDaiDien.push(item);
    this.loadDaiDien();
  }

  xoaDaiDien(item) {
    this.listDaiDien = this.listDaiDien.filter((x) => x.idTemp != item.idTemp);
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
      denNgayQd: null,
      loaiQd: '',
      maDvi: this.userInfo.MA_DVI,
      maVthh: this.typeVthh,
      namNhap: null,
      ngayQd: '',
      orderBy: '',
      orderDirection: '',
      paggingReq: {
        limit: 1000,
        orderBy: '',
        orderType: '',
        page: 0,
      },
      soHd: '',
      soQd: null,
      str: '',
      trangThai: this.globals.prop.NHAP_BAN_HANH,
      tuNgayQd: null,
      veViec: null,
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

  isAction(): boolean {
    return (
      this.detail.trangThai === this.globals.prop.DU_THAO || !this.isView
    );
  }

  save(isGuiDuyet?: boolean) {
    this.spinner.show();
    let body = {
      bbNhapDayKhoId: this.detail.bbNhapDayKhoId,
      chiTiets: this.listDaiDien,
      chiTieuKiemTra: this.detail.chiTieuKiemTra,
      diaDiemLayMau: this.detail.diaDiemLayMau,
      donViCungCap: this.detail.donViCungCap,
      hopDongId: this.detail.hopDongId,
      id: this.id,
      ketQuaNiemPhong: this.detail.ketQuaNiemPhong,
      maDiemKho: null,
      maNganKho: null,
      maNganLo: null,
      maNhaKho: null,
      maVatTu: null,
      maVatTuCha: this.detail.maVatTuCha,
      ngayHopDong: this.detail.ngayHopDong
        ? dayjs(this.detail.ngayHopDong).format('YYYY-MM-DD')
        : null,
      ngayLayMau: this.detail.ngayLayMau
        ? dayjs(this.detail.ngayLayMau).format('YYYY-MM-DD')
        : null,
      ppLayMau: this.detail.ppLayMau,
      qdgnvnxId: this.detail.qdgnvnxId,
      soBienBan: this.detail.soBienBan,
      soLuongMau: this.detail.soLuongMau,
    };
    if (this.id > 0) {
      this.bienBanLayMauService
        .sua(body)
        .then((res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            if (isGuiDuyet) {
              let body = {
                id: res.data.id,
                lyDo: null,
                trangThai: this.globals.prop.DU_THAO_TRINH_DUYET,
              };
              this.bienBanLayMauService.updateStatus(body);
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
      this.bienBanLayMauService
        .them(body)
        .then((res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            if (isGuiDuyet) {
              let body = {
                id: res.data.id,
                lyDo: null,
                trangThai: this.globals.prop.LANH_DAO_DUYET,
              };
              this.bienBanLayMauService.updateStatus(body);
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
