import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {NzModalRef, NzModalService} from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { Base3Component } from 'src/app/components/base3/base3.component';
import { StorageService } from 'src/app/services/storage.service';
import { TongHopScService } from 'src/app/services/sua-chua/tongHopSc.service';
import {UserService} from "../../../../services/user.service";
import dayjs from "dayjs";
import {Validators} from "@angular/forms";

@Component({
  selector: 'app-themmoi-th',
  templateUrl: './themmoi-th.component.html',
  styleUrls: ['./themmoi-th.component.scss']
})
export class ThemmoiThComponent extends Base3Component implements OnInit {

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
    this.userService.getId('SC_TONG_HOP_HDR_SEQ').then((res) => {
        this.formData.patchValue({
          maDanhSach : 'DSHCSC-'+res,
          thoiGianTh : dayjs().format("YYYY-MM-DD HH:mm:ss")
        })
    })
  }

  handleOk(){
    let body = this.formData.value;
    body.fileDinhKemReq = this.fileDinhKem;
    this.createUpdate(body).then((res)=>{
        if(res){
          this._modalRef.close();
        }
    })
  }

  onCancel() {
    this._modalRef.close();
  }

}
