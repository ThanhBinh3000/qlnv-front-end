import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { PhieuKiemNghiemChatLuongHang } from 'src/app/models/PhieuKiemNghiemChatLuongHang';
import { UserLogin } from 'src/app/models/userlogin';
import { DanhSachDauThauService } from 'src/app/services/danhSachDauThau.service';
import { DonviService } from 'src/app/services/donvi.service';
import { QuanLyPhieuKiemNghiemChatLuongHangService } from 'src/app/services/quanLyPhieuKiemNghiemChatLuongHang.service';
import { Globals } from 'src/app/shared/globals';
import { MESSAGE } from './../../../../../../../../constants/message';
import { UserService } from './../../../../../../../../services/user.service';

@Component({
  selector: 'them-moi-phieu-kiem-nghiem-chat-luong-thoc',
  templateUrl: './them-moi-phieu-kiem-nghiem-chat-luong-thoc.component.html',
  styleUrls: ['./them-moi-phieu-kiem-nghiem-chat-luong-thoc.component.scss'],
})
export class ThemMoiPhieuKiemNghiemChatLuongThocComponent implements OnInit {
  phieuKiemNghiemChatLuongHang: PhieuKiemNghiemChatLuongHang;
  id: number;
  routerUrl: string;
  userInfo: UserLogin;
  constructor(
    private spinner: NgxSpinnerService,
    private donViService: DonviService,
    private danhSachDauThauService: DanhSachDauThauService,
    private phieuKiemNghiemChatLuongHangService: QuanLyPhieuKiemNghiemChatLuongHangService,
    private notification: NzNotificationService,
    private router: Router,
    private modal: NzModalService,
    public globals: Globals,
    private routerActive: ActivatedRoute,
    private userService: UserService,
  ) { }

  async ngOnInit() {
    this.routerUrl = this.router.url;
    this.id = +this.routerActive.snapshot.paramMap.get('id');
    this.userInfo = this.userService.getUserLogin();
    this.newObjectBienBanLayMau();

  }
  newObjectBienBanLayMau() {
    this.phieuKiemNghiemChatLuongHang = new PhieuKiemNghiemChatLuongHang();
  }
  disableBanHanh(): boolean {
    return (
      this.phieuKiemNghiemChatLuongHang.trangThai === this.globals.prop.DU_THAO ||
      this.id === 0 ||
      this.phieuKiemNghiemChatLuongHang.trangThai === this.globals.prop.TU_CHOI
    );
  }
  save(isGuiDuyet?: boolean) {
    this.spinner.show();
    let body = {
      "ddiemBquan": this.phieuKiemNghiemChatLuongHang.ddiemBquan,
      "hthucBquan": this.phieuKiemNghiemChatLuongHang.hthucBquan,
      "id": this.phieuKiemNghiemChatLuongHang.id,
      "maHhoa": this.phieuKiemNghiemChatLuongHang.maHhoa,
      "maKho": this.phieuKiemNghiemChatLuongHang.maKho,
      "maNgan": this.phieuKiemNghiemChatLuongHang.maNgan,
      "ngayKnghiem": this.phieuKiemNghiemChatLuongHang.ngayKnghiem,
      "ngayLayMau": this.phieuKiemNghiemChatLuongHang.ngayLayMau,
      "ngayNhapDay": this.phieuKiemNghiemChatLuongHang.ngayNhapDay,
      "sluongBquan": this.phieuKiemNghiemChatLuongHang.sluongBquan,
      "soBbanKthucNhap": this.phieuKiemNghiemChatLuongHang.soBbanKthucNhap,
      "soPhieu": this.phieuKiemNghiemChatLuongHang.soPhieu,
      "tenHhoa": this.phieuKiemNghiemChatLuongHang.tenHhoa,
      "tenKho": this.phieuKiemNghiemChatLuongHang.tenKho,
      "tenNgan": this.phieuKiemNghiemChatLuongHang.tenNgan,
      "trangThai": this.phieuKiemNghiemChatLuongHang.trangThai
    }
    if (this.id > 0) {
      this.phieuKiemNghiemChatLuongHangService.sua(
        body,
      ).then((res) => {
        if (res.msg == MESSAGE.SUCCESS) {
          if (isGuiDuyet) {
            let body = {
              id: res.data.id,
              lyDoTuChoi: null,
              trangThai: this.globals.prop.DU_THAO_TRINH_DUYET,
            };
            this.phieuKiemNghiemChatLuongHangService.updateStatus(body);
            if (res.msg == MESSAGE.SUCCESS) {
              this.notification.success(
                MESSAGE.SUCCESS,
                MESSAGE.UPDATE_SUCCESS,
              );
              this.redirectPhieuKiemNghiemChatLuongHang();
            } else {
              this.notification.error(MESSAGE.ERROR, res.msg);
            }
          } else {
            this.notification.success(
              MESSAGE.SUCCESS,
              MESSAGE.UPDATE_SUCCESS,
            );
            this.redirectPhieuKiemNghiemChatLuongHang();
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
      this.phieuKiemNghiemChatLuongHangService.them(
        body,
      ).then((res) => {
        if (res.msg == MESSAGE.SUCCESS) {
          if (isGuiDuyet) {
            let body = {
              id: res.data.id,
              lyDoTuChoi: null,
              trangThai: this.globals.prop.LANH_DAO_DUYET,
            };
            this.phieuKiemNghiemChatLuongHangService.updateStatus(body);
            if (res.msg == MESSAGE.SUCCESS) {
              this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
              this.redirectPhieuKiemNghiemChatLuongHang();
            } else {
              this.notification.error(MESSAGE.ERROR, res.msg);
            }
          } else {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
            this.redirectPhieuKiemNghiemChatLuongHang();
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
          const res = await this.phieuKiemNghiemChatLuongHangService.updateStatus(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.APPROVE_SUCCESS);
            this.redirectPhieuKiemNghiemChatLuongHang();
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
          const res = await this.phieuKiemNghiemChatLuongHangService.updateStatus(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.APPROVE_SUCCESS);
            this.redirectPhieuKiemNghiemChatLuongHang();
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
          const res = await this.phieuKiemNghiemChatLuongHangService.updateStatus(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.TU_CHOI_SUCCESS);
            this.redirectPhieuKiemNghiemChatLuongHang();
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
        this.redirectPhieuKiemNghiemChatLuongHang();
      },
    });
  }
  redirectPhieuKiemNghiemChatLuongHang() {
    if (this.router.url && this.router.url != null) {
      let index = this.router.url.indexOf("/thong-tin/");
      if (index != -1) {
        let url = this.router.url.substring(0, index);
        this.router.navigate([url]);
      }
    }
  };
}
