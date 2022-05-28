import { UserService } from './../../../../../../../../services/user.service';
import { MESSAGE } from './../../../../../../../../constants/message';
import { BienBanLayMau } from './../../../../../../../../models/BienBanLayMau';
import { Component, OnInit, ViewChild } from '@angular/core';
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

@Component({
  selector: 'them-moi-bien-ban-lay-mau',
  templateUrl: './them-moi-bien-ban-lay-mau.component.html',
  styleUrls: ['./them-moi-bien-ban-lay-mau.component.scss'],
})
export class ThemMoiBienBanLayMauKhoComponent implements OnInit {
  bienBanLayMau: BienBanLayMau;
  id: number;
  routerUrl: string;
  userInfo: UserLogin;
  detail: any = {};
  detailHopDong: any = {};
  detailGiaoNhap: any = {};
  maVthh: string;
  phuongPhapLayMaus: Array<PhuongPhapLayMau>;
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

  ) { }

  async ngOnInit() {
    this.routerUrl = this.router.url;
    this.id = +this.routerActive.snapshot.paramMap.get('id');
    this.userInfo = this.userService.getUserLogin();
    this.newObjectBienBanLayMau();
    this.bienBanLayMau.maDonVi = this.userInfo.MA_DVI;
    this.bienBanLayMau.tenDonVi = this.userInfo.TEN_DVI;
    await Promise.all([
      this.getIdNhap(),
      this.loadPhuongPhapLayMau()
    ]);
    if (this.id > 0) {
      this.loadBienbanLayMau();
    }
  }
  newObjectBienBanLayMau() {
    this.bienBanLayMau = new BienBanLayMau();
  }
  disableBanHanh(): boolean {
    return true;;
    // return (
    //   this.bienBanLayMau.trangThai === this.globals.prop.DU_THAO ||
    //   this.id === 0 ||
    //   this.bienBanLayMau.trangThai === this.globals.prop.TU_CHOI
    // );
  }
  save(isGuiDuyet?: boolean) {
    this.spinner.show();
    let body = {
      "canCu": null,
      "ccuQdinhGiaoNvuNhap": null,
      "ctieuKtra": null,
      "cvuDdienCcap": null,
      "cvuDdienNhan": null,
      "ddiemKtra": null,
      "ddiemLayMau": this.bienBanLayMau.ddiemLayMau,
      "ddienBenNhan": this.bienBanLayMau.ddienBenNhan,
      "ddienCucDtruBenGiao": this.bienBanLayMau.ddienCucDtruBenGiao,
      "ddienCucDtruNnuoc": this.bienBanLayMau.ddienCucDtruNnuoc,
      "ddienDviTchucBenNhan": this.bienBanLayMau.ddienDviTchucBenNhan,
      "id": this.bienBanLayMau.id ?? null,
      "kquaNiemPhongMau": null,
      "maDonVi": this.bienBanLayMau.maDonVi,
      "maDviCcap": this.bienBanLayMau.maDviCcap,
      "maDviNhan": null,
      "maHhoa": null,
      "maKho": null,
      "maLo": null,
      "maNgan": null,
      "maQHNS": null,
      "ngayBgiaoMau": this.bienBanLayMau.ngayBgiaoMau,
      "ngayLapBban": null,
      "ngayLayMau": this.bienBanLayMau.ngayLayMau ? dayjs(this.bienBanLayMau.ngayLayMau).format('YYYY-MM-DD') : null,
      "pphapLayMau": this.bienBanLayMau.pphapLayMau,
      "sluongLMau": this.bienBanLayMau.sluongLMau,
      "soBban": this.bienBanLayMau.soBban,
      "soHd": this.bienBanLayMau.soHd,
      "soTrang": this.bienBanLayMau.soTrang,
      "tenDdienCcap": null,
      "tenDdienNhan": null,
      "tinhTrang": this.bienBanLayMau.tinhTrang,
      "tphongKthuatBquan": this.bienBanLayMau.tphongKthuatBquan
    }
    console.log("body: ", body);

    if (this.id > 0) {
      this.bienBanLayMauService.sua(
        body,
      ).then((res) => {
        if (res.msg == MESSAGE.SUCCESS) {
          if (isGuiDuyet) {
            let body = {
              id: res.data.id,
              lyDoTuChoi: null,
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
      this.bienBanLayMauService.them(
        body,
      ).then((res) => {
        if (res.msg == MESSAGE.SUCCESS) {
          if (isGuiDuyet) {
            let body = {
              id: res.data.id,
              lyDoTuChoi: null,
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
            lyDoTuChoi: null,
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
            lyDoTuChoi: text,
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
    if (this.router.url && this.router.url != null) {
      let index = this.router.url.indexOf("/thong-tin/");
      if (index != -1) {
        let url = this.router.url.substring(0, index);
        this.router.navigate([url]);
      }
    }
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
        this.bienBanLayMau.ngayHd = this.detailHopDong.ngayKy;
        this.bienBanLayMau.soHd = this.detailHopDong.soHd;
        this.bienBanLayMau.tenDonViCCHang = this.detailHopDong.tenDvi;
        this.bienBanLayMau.sluongLMau = this.detailHopDong.soLuong;
      }
      else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }
  }
  async getIdNhap() {
    if (this.router.url && this.router.url != null) {
      let index = this.router.url.indexOf("/chi-tiet/");
      if (index != -1) {
        let url = this.router.url.substring(index + 10);
        let temp = url.split("/");
        if (temp && temp.length > 0) {
          this.detail.quyetDinhNhapId = +temp[0];
          let res = await this.quyetDinhGiaoNhapHangService.chiTiet(this.detail.quyetDinhNhapId);
          if (res.msg == MESSAGE.SUCCESS) {
            this.detailGiaoNhap = res.data;
            await this.getHopDong(this.detailGiaoNhap.soHd);
          }
          else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
        }
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
  // changePPLayMau(event) {
  //   console.log(event);

  // }
  loadBienbanLayMau() {
    this.bienBanLayMauService
      .loadChiTiet(this.id)
      .then((res) => {
        if (res.msg == MESSAGE.SUCCESS) {
          console.log(res.data);
          this.bienBanLayMau = res.data;
          this.bienBanLayMau.pphapLayMau = +res.data.pphapLayMau;
        } else {
          this.notification.error(MESSAGE.ERROR, res.msg);
        }
      }).catch(err => {
        this.notification.error(MESSAGE.ERROR, err.msg);
      })
  }
}
