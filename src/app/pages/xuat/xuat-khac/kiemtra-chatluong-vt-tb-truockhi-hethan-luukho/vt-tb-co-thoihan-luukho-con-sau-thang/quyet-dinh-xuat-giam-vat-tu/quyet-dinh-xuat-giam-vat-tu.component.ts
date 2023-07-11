import {Component, OnInit} from '@angular/core';
import {Base2Component} from "../../../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {DonviService} from "../../../../../../services/donvi.service";
import {DanhMucService} from "../../../../../../services/danhmuc.service";
import {
  DanhSachVttbTruocHethanLuuKhoService
} from "../../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuatvt/DanhSachVttbTruocHethanLuuKho.service";
import {LOAI_HH_XUAT_KHAC} from "../../../../../../constants/config";

@Component({
  selector: 'app-quyet-dinh-xuat-giam-vat-tu',
  templateUrl: './quyet-dinh-xuat-giam-vat-tu.component.html',
  styleUrls: ['./quyet-dinh-xuat-giam-vat-tu.component.scss']
})
export class QuyetDinhXuatGiamVatTuComponent extends Base2Component implements OnInit {

  constructor(httpClient: HttpClient,
              storageService: StorageService,
              notification: NzNotificationService,
              spinner: NgxSpinnerService,
              modal: NzModalService,
              private donviService: DonviService,
              private danhMucService: DanhMucService,
              private danhSachVttbTruocHethanLuuKhoService: DanhSachVttbTruocHethanLuuKhoService) {
    super(httpClient, storageService, notification, spinner, modal, danhSachVttbTruocHethanLuuKhoService);
    this.formData = this.fb.group({
      namKeHoach: [],
      trichYeu: [],
      soQuyetDinh: [],
      ngayQuyetDinhTu: [],
      ngayQuyetDinhDen: [],
    })
  }

  ngOnInit(): void {
  }

  async timKiem() {
    await this.search();
  }

}
