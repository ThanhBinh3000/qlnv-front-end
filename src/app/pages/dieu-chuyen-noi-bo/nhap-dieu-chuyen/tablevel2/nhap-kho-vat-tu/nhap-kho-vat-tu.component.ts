import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { QuyetDinhDieuChuyenTCService } from 'src/app/services/dieu-chuyen-noi-bo/quyet-dinh-dieu-chuyen/quyet-dinh-dieu-chuyen-tc.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-nhap-kho-vat-tu',
  templateUrl: './nhap-kho-vat-tu.component.html',
  styleUrls: ['./nhap-kho-vat-tu.component.scss']
})
export class NhapKhoVatTuComponent extends Base2Component implements OnInit {

  @Input() loaiDc: string;

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private quyetDinhDieuChuyenTCService: QuyetDinhDieuChuyenTCService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, quyetDinhDieuChuyenTCService);
    this.formData = this.fb.group({
      nam: null,
      soQdinh: null,
      ngayDuyetTc: null,
      ngayHieuLuc: null,
      loaiDc: null,
      trichYeu: null,
    })
    this.filterTable = {
      nam: '',
      soQdinh: '',
      ngayLapKh: '',
      ngayDuyetTcTu: '',
      loaiDc: '',
      trichYeu: '',
      tenDvi: '',
      tenTrangThai: '',
    };
  }

  tabSelected: string = 'DCNB_NHAP_NK_VT_PNK';

  ngOnInit(): void {
  }

  selectTab(tab: string) {
    this.tabSelected = tab;
  }

  checkPNK() {
    return (this.userService.isAccessPermisson('DCNB_NHAP_NBCC_NK_VT') && this.userService.isAccessPermisson('DCNB_NHAP_NBCC_NK_VT_PNK')) ||
      (this.userService.isAccessPermisson('DCNB_NHAP_2CUC_NK_VT') && this.userService.isAccessPermisson('DCNB_NHAP_2CUC_NK_VT_PNK')) ||
      (this.userService.isAccessPermisson('DCNB_NHAP_CUNG1CUC_NK_VT') && this.userService.isAccessPermisson('DCNB_NHAP_CUNG1CUC_NK_VT_PNK'))
  }

  checkBKNVT() {
    return (this.userService.isAccessPermisson('DCNB_NHAP_NBCC_NK_VT') && this.userService.isAccessPermisson('DCNB_NHAP_NBCC_NK_VT_BKNVT')) ||
      (this.userService.isAccessPermisson('DCNB_NHAP_2CUC_NK_VT') && this.userService.isAccessPermisson('DCNB_NHAP_2CUC_NK_VT_BKNVT')) ||
      (this.userService.isAccessPermisson('DCNB_NHAP_CUNG1CUC_NK_VT') || this.userService.isAccessPermisson('DCNB_NHAP_CUNG1CUC_NK_VT_BKNVT'))
  }

  checkBBKTNK() {
    return (this.userService.isAccessPermisson('DCNB_NHAP_NBCC_NK_VT') && this.userService.isAccessPermisson('DCNB_NHAP_NBCC_NK_VT_BBKTNK')) ||
      (this.userService.isAccessPermisson('DCNB_NHAP_2CUC_NK_VT') || this.userService.isAccessPermisson('DCNB_NHAP_2CUC_NK_VT_BBKTNK')) ||
      (this.userService.isAccessPermisson('DCNB_NHAP_CUNG1CUC_NK_VT') || this.userService.isAccessPermisson('DCNB_NHAP_CUNG1CUC_NK_VT_BBKTNK'))
  }

  checkBBGN() {
    return (this.userService.isAccessPermisson('DCNB_NHAP_NBCC_NK_VT') && this.userService.isAccessPermisson('DCNB_NHAP_NBCC_NK_VT_BBGN')) ||
      (this.userService.isAccessPermisson('DCNB_NHAP_2CUC_NK_VT') && this.userService.isAccessPermisson('DCNB_NHAP_2CUC_NK_VT_BBGN')) ||
      (this.userService.isAccessPermisson('DCNB_NHAP_CUNG1CUC_NK_VT') && this.userService.isAccessPermisson('DCNB_NHAP_CUNG1CUC_NK_VT_BBGN'))
  }

}
