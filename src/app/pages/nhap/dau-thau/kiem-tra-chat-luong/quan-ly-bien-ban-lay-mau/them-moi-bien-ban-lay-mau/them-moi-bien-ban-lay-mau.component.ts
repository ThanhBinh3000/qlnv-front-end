import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import dayjs from 'dayjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { BienBanLayMau } from 'src/app/models/BienBanLayMau';
import { PhuongPhapLayMau } from 'src/app/models/PhuongPhapLayMau';
import { UserLogin } from 'src/app/models/userlogin';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { QuanLyBienBanLayMauService } from 'src/app/services/quanLyBienBanLayMau.service';
import { QuanLyPhieuNhapDayKhoService } from 'src/app/services/quanLyPhieuNhapDayKho.service';
import { QuyetDinhGiaoNhapHangService } from 'src/app/services/quyetDinhGiaoNhapHang.service';
import { ThongTinHopDongService } from 'src/app/services/thongTinHopDong.service';
import { UserService } from 'src/app/services/user.service';
import { thongTinTrangThaiNhap } from 'src/app/shared/commonFunction';
import { Globals } from 'src/app/shared/globals';

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

  bienBanLayMau: any;
  routerUrl: string;
  userInfo: UserLogin;
  detailHopDong: any = {};
  detailGiaoNhap: any = {};
  maVthh: string;
  phuongPhapLayMaus: Array<PhuongPhapLayMau>;
  listSoQuyetDinh: any[] = [];
  listBienBanDayKho: any[] = [];
  listHopDong: any[] = [];

  capCuc: string = '2';
  capChiCuc: string = '3';
  listDaiDienCuc: any[] = [];
  listDaiDienChiCuc: any[] = [];
  listHangHoa: any[] = [];
  listDaiDien: any[] = [
    {
      "bbLayMauId": null,
      "daiDien": null,
      "id": null,
      "idTemp": 1,
      "loaiDaiDien": '2'
    },
    {
      "bbLayMauId": null,
      "daiDien": null,
      "id": null,
      "idTemp": 1,
      "loaiDaiDien": '3'
    }
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
  ) { }

  async ngOnInit() {
    this.routerUrl = this.router.url;
    this.userInfo = this.userService.getUserLogin();
    this.newObjectBienBanLayMau();
    this.bienBanLayMau.maDvi = this.userInfo.MA_DVI;
    this.bienBanLayMau.tenDvi = this.userInfo.TEN_DVI;
    this.bienBanLayMau.maVatTuCha = this.typeVthh;
    this.bienBanLayMau.trangThai = this.globals.prop.NHAP_DU_THAO;
    this.bienBanLayMau.tenTrangThai = 'Dự thảo';
    await Promise.all([
      this.loadPhuongPhapLayMau(),
      this.loadSoQuyetDinh(),
      this.loaiVTHHGetAll(),
      this.loadBienBanDayKho(),
    ]);
    if (this.id > 0) {
      await this.loadBienbanLayMau();
    }
    else {
      this.loadDaiDien();
    }
  }

  isDisableField() {
    if (this.bienBanLayMau && (this.bienBanLayMau.trangThai == this.globals.prop.NHAP_CHO_DUYET_TP || this.bienBanLayMau.trangThai == this.globals.prop.NHAP_CHO_DUYET_LD_CHI_CUC || this.bienBanLayMau.trangThai == this.globals.prop.NHAP_DA_DUYET)) {
      return true;
    }
  }

  async loaiVTHHGetAll() {
    let res = await this.danhMucService.loaiVatTuHangHoaGetAll();
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data && res.data.length > 0) {
        if (this.isTatCa) {
          this.listHangHoa = res.data;
          this.bienBanLayMau.maVatTuCha = this.listHangHoa[0].ma;
        }
        else {
          this.listHangHoa = res.data.filter(x => x.ma == this.typeVthh);
        }
      }
    }
  }

  loadDaiDien() {
    if (this.listDaiDien && this.listDaiDien.length > 0) {
      this.listDaiDienCuc = this.listDaiDien.filter(x => x.loaiDaiDien == this.capCuc);
      this.listDaiDienChiCuc = this.listDaiDien.filter(x => x.loaiDaiDien == this.capChiCuc);
    }
  }

  addDaiDien(type) {
    if (!this.listDaiDien) {
      this.listDaiDien = [];
    }
    let item = {
      "bbLayMauId": null,
      "daiDien": null,
      "id": null,
      "idTemp": new Date().getTime(),
      "loaiDaiDien": type
    }
    this.listDaiDien.push(item);
    this.loadDaiDien();
  }

  xoaDaiDien(item) {
    this.listDaiDien = this.listDaiDien.filter(x => x.idTemp != item.idTemp);
    this.loadDaiDien();
  }

  async loadBienBanDayKho() {
    let param = {
      "capDvis": '3',
      "maDvi": this.userInfo.MA_DVI,
      "maVatTuCha": this.isTatCa ? null : this.typeVthh,
      "pageNumber": 1,
      "pageSize": 1000,
      "trangThai": this.globals.prop.NHAP_DA_DUYET,
    }
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
      "denNgayQd": null,
      "loaiQd": "",
      "maDvi": this.userInfo.MA_DVI,
      "maVthh": this.typeVthh,
      "namNhap": null,
      "ngayQd": "",
      "orderBy": "",
      "orderDirection": "",
      "paggingReq": {
        "limit": 1000,
        "orderBy": "",
        "orderType": "",
        "page": 0
      },
      "soHd": "",
      "soQd": null,
      "str": "",
      "trangThai": this.globals.prop.NHAP_DA_DUYET,
      "tuNgayQd": null,
      "veViec": null
    }
    let res = await this.quyetDinhGiaoNhapHangService.timKiem(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.listSoQuyetDinh = data.content;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async changeSoQuyetDinh(autoChange: boolean) {
    let quyetDinh = this.listSoQuyetDinh.filter(x => x.id == this.bienBanLayMau.qdgnvnxId);
    if (quyetDinh && quyetDinh.length > 0) {
      this.detailGiaoNhap = quyetDinh[0];
      this.listHopDong = [];
      this.detailGiaoNhap.children1.forEach(element => {
        if (element && element.hopDong) {
          if (this.typeVthh) {
            if (element.hopDong.loaiVthh.startsWith(this.typeVthh)) {
              this.listHopDong.push(element);
            }
          }
          else {
            this.listHopDong.push(element);
          }
        }
      });
      if (!autoChange) {
        this.bienBanLayMau.soHopDong = null;
        this.bienBanLayMau.hopDongId = null;
        this.bienBanLayMau.ngayHopDong = null;
        this.bienBanLayMau.maHangHoa = null;
        this.bienBanLayMau.khoiLuongKiemTra = null;
        this.bienBanLayMau.maHangHoa = null;
        this.bienBanLayMau.tenVatTuCha = null;
        this.bienBanLayMau.tenVatTu = null;
        this.bienBanLayMau.maVatTuCha = null;
        this.bienBanLayMau.maVatTu = null;
      } else {
        await this.changeHopDong();
      }
    }
  }

  async changeHopDong() {
    if (this.bienBanLayMau.soHopDong) {
      let body = {
        "str": this.bienBanLayMau.soHopDong
      }
      let res = await this.thongTinHopDongService.loadChiTietSoHopDong(body);
      if (res.msg == MESSAGE.SUCCESS) {
        this.detailHopDong = res.data;
        this.bienBanLayMau.hopDongId = this.detailHopDong.id;
        this.bienBanLayMau.ngayHopDong = this.detailHopDong.ngayKy;
        this.bienBanLayMau.tenVatTuCha = this.detailHopDong.tenVthh;
        this.bienBanLayMau.tenVatTu = this.detailHopDong.tenCloaiVthh;
        this.bienBanLayMau.maVatTuCha = this.detailHopDong.loaiVthh;
        this.bienBanLayMau.maVatTu = this.detailHopDong.cloaiVthh;
        this.bienBanLayMau.canCu = this.detailHopDong.canCu;
        this.bienBanLayMau.tenDonViCCHang = this.detailHopDong.tenDvi;
        this.bienBanLayMau.soLuongMau = this.detailHopDong.soLuong;
      }
      else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }
  }

  newObjectBienBanLayMau() {
    this.bienBanLayMau = new BienBanLayMau();
  }

  isAction(): boolean {
    return (
      this.bienBanLayMau.trangThai === this.globals.prop.NHAP_DU_THAO ||
      !this.isView
    );
  }

  save(isGuiDuyet?: boolean) {
    this.spinner.show();
    let body = {
      "bbNhapDayKhoId": this.bienBanLayMau.bbNhapDayKhoId,
      "chiTiets": this.listDaiDien,
      "chiTieuKiemTra": this.bienBanLayMau.chiTieuKiemTra,
      "diaDiemLayMau": this.bienBanLayMau.diaDiemLayMau,
      "donViCungCap": this.bienBanLayMau.donViCungCap,
      "hopDongId": this.bienBanLayMau.hopDongId,
      "id": this.id,
      "ketQuaNiemPhong": this.bienBanLayMau.ketQuaNiemPhong,
      "maDiemKho": null,
      "maNganKho": null,
      "maNganLo": null,
      "maNhaKho": null,
      "maVatTu": null,
      "maVatTuCha": this.bienBanLayMau.maVatTuCha,
      "ngayHopDong": this.bienBanLayMau.ngayHopDong ? dayjs(this.bienBanLayMau.ngayHopDong).format('YYYY-MM-DD') : null,
      "ngayLayMau": this.bienBanLayMau.ngayLayMau ? dayjs(this.bienBanLayMau.ngayLayMau).format('YYYY-MM-DD') : null,
      "ppLayMau": this.bienBanLayMau.ppLayMau,
      "qdgnvnxId": this.bienBanLayMau.qdgnvnxId,
      "soBienBan": this.bienBanLayMau.soBienBan,
      "soLuongMau": this.bienBanLayMau.soLuongMau,
    }
    if (this.id > 0) {
      this.bienBanLayMauService.sua(body).then((res) => {
        if (res.msg == MESSAGE.SUCCESS) {
          if (isGuiDuyet) {
            let body = {
              id: res.data.id,
              lyDo: null,
              trangThai: this.globals.prop.NHAP_CHO_DUYET_LD_CHI_CUC,
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
      this.bienBanLayMauService.them(body).then((res) => {
        if (res.msg == MESSAGE.SUCCESS) {
          if (isGuiDuyet) {
            let body = {
              id: res.data.id,
              lyDo: null,
              trangThai: this.globals.prop.NHAP_CHO_DUYET_LD_CHI_CUC,
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
      }).catch((e) => {
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
    let trangThai = this.globals.prop.NHAP_CHO_DUYET_LD_CHI_CUC;
    if (this.bienBanLayMau.trangThai == this.globals.prop.NHAP_CHO_DUYET_LD_CHI_CUC) {
      trangThai = this.globals.prop.NHAP_DA_DUYET;
    }
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
            trangThai: trangThai,
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
            trangThai: this.bienBanLayMau.trangThai == this.globals.prop.NHAP_CHO_DUYET_TP ? this.globals.prop.NHAP_TU_CHOI_TP : this.globals.prop.NHAP_TU_CHOI_LD_CHI_CUC,
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
  };

  async getHopDong(id) {
    if (id) {
      const body = {
        str: id
      }
      let res = await this.thongTinHopDongService.loadChiTietSoHopDong(body);

      if (res.msg == MESSAGE.SUCCESS) {
        this.detailHopDong = res.data;
        this.bienBanLayMau.canCu = this.detailHopDong.canCu;
        this.bienBanLayMau.ngayHopDong = this.detailHopDong.ngayKy;
        this.bienBanLayMau.hopDongId = this.detailHopDong.id;
        this.bienBanLayMau.soHopDong = this.detailHopDong.soHd;
        this.bienBanLayMau.tenDonViCCHang = this.detailHopDong.tenDvi;
        this.bienBanLayMau.soLuongMau = this.detailHopDong.soLuong;
      }
      else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }
  }

  loadPhuongPhapLayMau() {
    this.danhMucService.danhMucChungGetAll("PP_LAY_MAU").then(res => {
      if (res.msg == MESSAGE.SUCCESS) {
        this.phuongPhapLayMaus = res.data;
      }
      else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }).catch(err => {
      this.notification.error(MESSAGE.ERROR, err.msg);
    })
  }

  async loadBienbanLayMau() {
    let res = await this.bienBanLayMauService.loadChiTiet(this.id);
    if (res.msg == MESSAGE.SUCCESS) {
      this.bienBanLayMau = res.data;
      this.bienBanLayMau.ppLayMau = +res.data.ppLayMau;
      if (this.bienBanLayMau.chiTiets && this.bienBanLayMau.chiTiets.length > 0) {
        this.listDaiDien = [];
        this.bienBanLayMau.chiTiets.forEach((element, index) => {
          let item = {
            ...element,
            "idTemp": new Date().getTime() + index,
          }
          this.listDaiDien.push(item);
        });
        this.loadDaiDien();
      }
      this.changeSoQuyetDinh(true);
    }
    else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  thongTinTrangThai(trangThai: string): string {
    return thongTinTrangThaiNhap(trangThai);
  }
}