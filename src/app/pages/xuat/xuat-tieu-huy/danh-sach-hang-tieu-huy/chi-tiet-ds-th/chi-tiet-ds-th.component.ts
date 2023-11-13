import { Component, OnInit } from '@angular/core';
import {Base3Component} from "../../../../../components/base3/base3.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalRef, NzModalService} from "ng-zorro-antd/modal";
import {ActivatedRoute, Router} from "@angular/router";
import {TongHopScService} from "../../../../../services/sua-chua/tongHopSc.service";
import {
  DanhSachTieuHuyService
} from "../../../../../services/qlnv-hang/xuat-hang/xuat-tieu-huy/DanhSachTieuHuy.service";

@Component({
  selector: 'app-chi-tiet-ds-th',
  templateUrl: './chi-tiet-ds-th.component.html',
  styleUrls: ['./chi-tiet-ds-th.component.scss']
})
export class ChiTietDsThComponent extends Base3Component implements OnInit {

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
