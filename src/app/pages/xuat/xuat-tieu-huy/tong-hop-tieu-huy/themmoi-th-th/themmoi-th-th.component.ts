import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalRef, NzModalService} from "ng-zorro-antd/modal";
import {ActivatedRoute, Router} from "@angular/router";
import {TongHopThanhLyService} from "../../../../../services/qlnv-hang/xuat-hang/xuat-thanh-ly/TongHopThanhLy.service";
import {Validators} from "@angular/forms";
import dayjs from "dayjs";
import {Base3Component} from "../../../../../components/base3/base3.component";
import {TongHopTieuHuyService} from "../../../../../services/qlnv-hang/xuat-hang/xuat-tieu-huy/TongHopTieuHuy.service";

@Component({
  selector: 'app-themmoi-th-th',
  templateUrl: './themmoi-th-th.component.html',
  styleUrls: ['./themmoi-th-th.component.scss']
})
export class ThemmoiThThComponent extends Base3Component implements OnInit {

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    route: ActivatedRoute,
    router: Router,
    private _service: TongHopTieuHuyService,
    private _modalRef: NzModalRef,
  ) {
    super(httpClient, storageService, notification, spinner, modal, route, router, _service);
    this.formData = this.fb.group({
      maDanhSach: [null, [Validators.required]],
      tenDanhSach: [null, [Validators.required]],
      thoiGianThTu: [null, [Validators.required]],
      thoiGianThDen: [null, [Validators.required]],
      ngayTao: [null, [Validators.required]],
      thoiGianTh: [null, [Validators.required]]
    })
  }

  ngOnInit(): void {
    this.userService.getId('XH_TH_TONG_HOP_HDR_SEQ').then((res) => {
      this.formData.patchValue({
        maDanhSach: 'DSHCTH-' + res,
        ngayTao: dayjs().format("YYYY-MM-DD HH:mm:ss")
      })
    })
  }

  handleOk() {
    let body = this.formData.value;
    body.fileDinhKemReq = this.fileDinhKem;
    this.createUpdate(body).then((res) => {
      if (res) {
        this._modalRef.close(res);
      }
    })
  }

  onCancel() {
    this._modalRef.close();
  }

  chonNgayDeXuat($event: any) {
    if ($event) {
      this.formData.patchValue({
        thoiGianThTu: dayjs($event[0]).format('YYYY-MM-DD'),
        thoiGianThDen: dayjs($event[1]).format('YYYY-MM-DD')
      })
    }

  }

}
