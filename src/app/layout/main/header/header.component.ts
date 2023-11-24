import { Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ActivatedRoute, Router } from '@angular/router';
import { UserLogin } from 'src/app/models/userlogin';
import { DialogThongTinCanBoComponent } from 'src/app/components/dialog/dialog-thong-tin-can-bo/dialog-thong-tin-can-bo.component';
import { UserAPIService } from 'src/app/services/user/userApi.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  thongbaomoi: number = 0;
  listNoti: [];
  userInfo: UserLogin;

  constructor(
    private modal: NzModalService,
    private authService: AuthService,
    private userService: UserService,
    private userAPIService: UserAPIService,
    private notification: NzNotificationService,
    private _modalService: NzModalService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.userInfo = this.userService.getUserLogin();
    this.timTheoDieuKien();
    this.thongBaoMoi();
  }

  thongBaoMoi() {
    // this._notificationService.thongBaoMoi().then(res => {
    //   if (res.success) {
    //     this.thongbaomoi = res.data
    //   } else {
    //     this.notification.error(MESSAGE.ERROR, res.error);
    //   }
    // })
  }

  timTheoDieuKien() {
    const body = {
      pageInfo: {
        page: 1,
        pageSize: 6,
      },
      sorts: [],
    };
    // this._notificationService.timTheoDieuKien(body).then(res => {
    //   if (res.success) {
    //     this.listNoti = res.data
    //   } else {
    //     this.notification.error(MESSAGE.ERROR, res.error);
    //   }
    // })
  }

  docThognBao(id) {
    // this._notificationService.docThognBao(id).then(res => {
    //   if (res.success) {
    //     this.timTheoDieuKien()
    //     this.thongBaoMoi()
    //   } else {
    //     this.notification.error(MESSAGE.ERROR, res.error);
    //   }
    // })
  }

  onItemNoti(data) {
    this.docThognBao(data.id);
    if (data.url) this.router.navigate([data.url]);
  }

  xoaThongBao(id) {
    this._modalService.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: `Bạn có chắc chắn muốn xóa thông báo?`,
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 365,
      nzOnOk: () => {
        // this._notificationService.delete(id).then(res => {
        //   if (res.success) {
        //     this.timTheoDieuKien()
        //     this.thongBaoMoi()
        //   } else {
        //     this.notification.error(MESSAGE.ERROR, res.error);
        //   }
        // })
      },
    });
  }

  showModalDoiVaiTro() {
    let modal = this._modalService.create({
      // nzContent: ModalDoiVaiTroComponent,
      nzComponentParams: {},
      // nzClosable: false,
      nzTitle: 'Đổi vai trò',
      nzFooter: null,
      nzStyle: { top: '50px' },
      nzWidth: 600,
    });
    modal.afterClose.subscribe((b) => { });
  }

  showModalThongTinCaNhan() {
    let data = {
      id: this.userInfo.ID,
      userType: this.userInfo.CAP_DVI === "0" ? "BN" : "DT",
      fullName: this.userInfo.TEN_DAY_DU,
      email: "",
      username: this.userInfo.sub,
      position: this.userInfo.POSITION,
      phoneNo: this.userInfo.DON_VI.sdt,
      status: this.userInfo.DON_VI.active,
      sysType: "",
      dvql: this.userInfo.MA_DVI,
      department: this.userInfo.MA_PHONG_BAN,
      ghiChu: this.userInfo.DON_VI.ghiChu
    }
    let modal = this.modal.create({
      nzTitle: 'THÔNG TIN CÁN BỘ',
      nzContent: DialogThongTinCanBoComponent,
      nzMaskClosable: false,
      nzClosable: true,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataEdit: data,
        isView: true,
        isOld: true
      },
    });
    modal.afterClose.subscribe((data) => {

    })
  }

  logOut() {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn đăng xuất?',
      nzOkText: 'Đồng ý',
      nzOkDanger: true,
      nzWidth: '350px',
      nzOnOk: () => {
        this.userAPIService.logout()
        this.authService.logout();
      },
    });
  }
}
