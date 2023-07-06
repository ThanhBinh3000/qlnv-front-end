import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalRef, NzModalService} from "ng-zorro-antd/modal";
import {ActivatedRoute, Router} from "@angular/router";
import {TongHopScService} from "../../../../services/sua-chua/tongHopSc.service";
import {Validators} from "@angular/forms";
import {Base3Component} from "../../../../components/base3/base3.component";
import {STATUS} from "../../../../constants/status";
import {MESSAGE} from "../../../../constants/message";

@Component({
  selector: 'app-chitiet-th',
  templateUrl: './chitiet-th.component.html',
  styleUrls: ['./chitiet-th.component.scss']
})
export class ChitietThComponent extends Base3Component implements OnInit {

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    route: ActivatedRoute,
    router: Router,
    private tongHopScService: TongHopScService,
    private _modalRef: NzModalRef,
  ) {
    super(httpClient, storageService, notification, spinner, modal, route, router, tongHopScService);
    this.formData = this.fb.group({
      maDanhSach: [null, [Validators.required]],
      tenDanhSach: [null, [Validators.required]],
      thoiHanXuat: [null, [Validators.required]],
      thoiHanNhap: [null, [Validators.required]],
      thoiGianTh: [null, [Validators.required]],
    })
  }

  ngOnInit(): void {
  }

  onCancel() {
    this._modalRef.close();
  }

  handleOk(){
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có muốn gửi duyệt',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 350,
      nzOnOk: async () => {
        this.spinner.show();
        try {
          let body = {
            id: this.id,
            trangThai: STATUS.GUI_DUYET,
          }
          let res = await this.tongHopScService.approve(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.NOTIFICATION, MESSAGE.SUCCESS);
            this._modalRef.close(true);
            this.spinner.hide();
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
            this.spinner.hide();
          }
        } catch (e) {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        } finally {
          this.spinner.hide();
        }
      },
    });
  }

}
