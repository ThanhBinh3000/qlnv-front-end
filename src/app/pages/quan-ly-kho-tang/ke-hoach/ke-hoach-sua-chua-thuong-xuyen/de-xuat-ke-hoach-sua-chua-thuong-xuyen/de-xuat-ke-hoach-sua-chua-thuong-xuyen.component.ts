import {Component, OnInit} from '@angular/core';
import {Base2Component} from "../../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {
  DeXuatScThuongXuyenService
} from "../../../../../services/qlnv-kho/quy-hoach-ke-hoach/ke-hoach-sc-thuong-xuyen/de-xuat-sc-thuong-xuyen.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-de-xuat-ke-hoach-sua-chua-thuong-xuyen',
  templateUrl: './de-xuat-ke-hoach-sua-chua-thuong-xuyen.component.html',
  styleUrls: ['./de-xuat-ke-hoach-sua-chua-thuong-xuyen.component.scss']
})
export class DeXuatKeHoachSuaChuaThuongXuyenComponent extends Base2Component implements OnInit {
  selectedId: number = 0;
  isViewDetail: boolean;
  isDetail: boolean = false;
  listTrangThai: any[] = [
    {ma: this.STATUS.DU_THAO, giaTri: 'Dự thảo'},
    {ma: this.STATUS.CHO_DUYET_TP, giaTri: 'Chờ duyệt trưởng phòng'},
    {ma: this.STATUS.TU_CHOI_TP, giaTri: 'Từ chối trưởng phòng'},
    {ma: this.STATUS.CHO_DUYET_LDC, giaTri: 'Chờ duyệt lãnh đạo cục'},
    {ma: this.STATUS.TU_CHOI_LDC, giaTri: 'Từ chối lãnh đạo cục'},
    {ma: this.STATUS.DA_DUYET_LDC, giaTri: 'Đã duyệt lãnh đạo cục'},
    {ma: this.STATUS.TU_CHOI_CBV, giaTri: 'Từ chối cán bộ vụ'},
    {ma: this.STATUS.DA_DUYET_CBV, giaTri: 'Đã duyệt cán bộ vụ'},
    {ma: this.STATUS.CHO_DUYET_LDV, giaTri: 'Chờ duyệt lãnh đạo vụ'},
    {ma: this.STATUS.TU_CHOI_LDV, giaTri: 'Từ chối lãnh đạo vụ'},
    {ma: this.STATUS.DA_DUYET_LDV, giaTri: 'Đã duyệt lãnh đạo vụ'},
  ];

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    deXuatScThuongXuyenService: DeXuatScThuongXuyenService,
    public router: Router
  ) {
    super(httpClient, storageService, notification, spinner, modal, deXuatScThuongXuyenService)
    super.ngOnInit()
    this.filterTable = {};
  }

  async ngOnInit() {
    if (!this.userService.isAccessPermisson('QLKT_QHKHKT_KHSUACHUATX_DX')) {
      this.router.navigateByUrl('/error/401')
    }
    this.formData = this.fb.group({
      namKh: [''],
      soCv: [''],
      tenCongTrinh: [''],
      diaDiem: [''],
      trangThai: [''],
      ngayKyTu: [''],
      ngayKyDen: [''],
      maDvi: [this.userInfo.MA_DVI],
      capDvi: [this.userInfo.CAP_DVI],
    });
    this.filter();
  }

  filter() {
    if (this.formData.value.ngayKy && this.formData.value.ngayKy.length > 0) {
      this.formData.value.ngayKyTu = this.formData.value.ngayKy[0];
      this.formData.value.ngayKyDen = this.formData.value.ngayKy[1];
    }
    this.search();
  }
  clearFilter() {
    this.formData.reset();
    this.formData.patchValue({
      maDvi: this.userInfo.MA_DVI,
      capDvi: this.userInfo.CAP_DVI,
    })
    this.search();
  }

  redirectToChiTiet(id: number, isView?: boolean) {
    this.selectedId = id;
    this.isDetail = true;
    this.isViewDetail = isView ?? false;
  }

}
