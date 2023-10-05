import { Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ActivatedRoute, Router } from '@angular/router';
import { UserLogin } from 'src/app/models/userlogin';

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
    private notification: NzNotificationService,
    private _modalService: NzModalService,
    private router: Router,
  ) {}

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
    modal.afterClose.subscribe((b) => {});
  }

  showModalThongTinCaNhan() {
    let modal = this._modalService.create({
      // nzContent: ModalThongTinCaNhanComponent,
      nzComponentParams: {},
      // nzClosable: false,
      nzTitle: 'Thông tin cá nhân',
      nzFooter: null,
      nzStyle: { top: '50px' },
      nzWidth: 800,
    });
    modal.afterClose.subscribe((b) => {});
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
        this.authService.logout();
      },
    });
  }
}
