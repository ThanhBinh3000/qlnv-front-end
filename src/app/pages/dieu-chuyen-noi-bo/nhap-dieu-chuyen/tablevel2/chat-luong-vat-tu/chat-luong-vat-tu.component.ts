import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { QuyetDinhDieuChuyenTCService } from 'src/app/services/dieu-chuyen-noi-bo/quyet-dinh-dieu-chuyen/quyet-dinh-dieu-chuyen-tc.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-chat-luong-vat-tu',
  templateUrl: './chat-luong-vat-tu.component.html',
  styleUrls: ['./chat-luong-vat-tu.component.scss']
})
export class ChatLuongVatTuComponent extends Base2Component implements OnInit {

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

  tabSelected: string = 'DCNB_NHAP_KTCL_VT_BBCBK';

  ngOnInit(): void {
  }

  selectTab(tab: string) {
    this.tabSelected = tab;
  }

  checkBBCBK() {
    return (this.userService.isAccessPermisson('DCNB_NHAP_NBCC_KTCL_VT') && this.userService.isAccessPermisson('DCNB_NHAP_NBCC_KTCL_VT_BBCBK')) ||
      (this.userService.isAccessPermisson('DCNB_NHAP_2CUC_KTCL_VT') && this.userService.isAccessPermisson('DCNB_NHAP_2CUC_KTCL_VT_BBCBK')) ||
      (this.userService.isAccessPermisson('DCNB_NHAP_CUNG1CUC_KTCL_VT') && this.userService.isAccessPermisson('DCNB_NHAP_CUNG1CUC_KTCL_VT_BBCBK'))
  }

  checkBBLM() {
    return (this.userService.isAccessPermisson('DCNB_NHAP_NBCC_KTCL_VT') && this.userService.isAccessPermisson('DCNB_NHAP_NBCC_KTCL_VT_BBLM')) ||
      (this.userService.isAccessPermisson('DCNB_NHAP_2CUC_KTCL_VT') && this.userService.isAccessPermisson('DCNB_NHAP_2CUC_KTCL_VT_BBLM')) ||
      (this.userService.isAccessPermisson('DCNB_NHAP_CUNG1CUC_KTCL_VT') || this.userService.isAccessPermisson('DCNB_NHAP_CUNG1CUC_KTCL_VT_BBLM'))
  }

  checkHSKT() {
    return (this.userService.isAccessPermisson('DCNB_NHAP_NBCC_KTCL_VT') && this.userService.isAccessPermisson('DCNB_NHAP_NBCC_KTCL_VT_HSKT')) ||
      (this.userService.isAccessPermisson('DCNB_NHAP_2CUC_KTCL_VT') || this.userService.isAccessPermisson('DCNB_NHAP_2CUC_KTCL_VT_HSKT')) ||
      (this.userService.isAccessPermisson('DCNB_NHAP_CUNG1CUC_KTCL_VT') || this.userService.isAccessPermisson('DCNB_NHAP_CUNG1CUC_KTCL_VT_HSKT'))
  }

}
