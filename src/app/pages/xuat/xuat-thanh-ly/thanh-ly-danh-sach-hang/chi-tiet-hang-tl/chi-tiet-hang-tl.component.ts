import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalRef, NzModalService} from "ng-zorro-antd/modal";
import {ActivatedRoute, Router} from "@angular/router";
import {
  DanhSachTieuHuyService
} from "../../../../../services/qlnv-hang/xuat-hang/xuat-tieu-huy/DanhSachTieuHuy.service";
import {Base3Component} from "../../../../../components/base3/base3.component";

@Component({
  selector: 'app-chi-tiet-hang-tl',
  templateUrl: './chi-tiet-hang-tl.component.html',
  styleUrls: ['./chi-tiet-hang-tl.component.scss']
})
export class ChiTietHangTlComponent extends Base3Component implements OnInit {

  data: any

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    route: ActivatedRoute,
    router: Router,
    private _service : DanhSachTieuHuyService,
    private _modalRef: NzModalRef,
  ) {
    super(httpClient, storageService, notification, spinner, modal, route, router, _service);
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
      lyDo: [],
      tenTrangThai : [],
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
