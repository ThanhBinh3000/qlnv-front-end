import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import dayjs from 'dayjs';
import { NzModalService, NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { Base3Component } from 'src/app/components/base3/base3.component';
import { StorageService } from 'src/app/services/storage.service';
import { TongHopScService } from 'src/app/services/sua-chua/tongHopSc.service';

@Component({
  selector: 'app-chi-tiet-danh-sach-sua-chua',
  templateUrl: './chi-tiet-danh-sach-sua-chua.component.html',
  styleUrls: ['./chi-tiet-danh-sach-sua-chua.component.scss']
})
export class ChiTietDanhSachSuaChuaComponent extends Base3Component implements OnInit {

  data: any

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
      tenCuc: [null],
      tenChiCuc: [null],
      tenLoaiVthh: [null],
      tenCloaiVthh: [null],
      tenHangHoa: [null],
      donViTinh: [null],
      tenDiemKho: [null],
      tenNhaKho: [null],
      tenNganKho: [null],
      tenLoKho: [null],
      ngayNhapKho: [],
      ngayDeXuat: [],
      slHienTai: [],
      slDeXuat: [],
      slDaDuyet: [],
      ngayTongHop: [],
      id: [],
      lyDo: []
    })
  }

  ngOnInit(): void {
    console.log(this.data);
    this.helperService.bidingDataInFormGroup(this.formData, this.data);
  }

  onCancel() {
    this._modalRef.close();
  }

}
