import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { QuyetDinhDieuChuyenTCService } from 'src/app/services/dieu-chuyen-noi-bo/quyet-dinh-dieu-chuyen/quyet-dinh-dieu-chuyen-tc.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-chat-luong-luong-thuc',
  templateUrl: './chat-luong-luong-thuc.component.html',
  styleUrls: ['./chat-luong-luong-thuc.component.scss']
})
export class ChatLuongLuongThucComponent extends Base2Component implements OnInit {

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

  tabSelected: string = 'DCNB_NHAP_KTCL_LT_BBNTBQLD';

  ngOnInit(): void {
    console.log('ChatLuongLuongThucComponent', this.loaiDc)
  }

  selectTab(tab: string) {
    this.tabSelected = tab;
  }

  checkBBNTBQLD() {
    return (this.userService.isAccessPermisson('DCNB_NHAP_NBCC_KTCL_LT') && this.userService.isAccessPermisson('DCNB_NHAP_NBCC_KTCL_LT_BBNTBQLD')) ||
      (this.userService.isAccessPermisson('DCNB_NHAP_2CUC_KTCL_LT') && this.userService.isAccessPermisson('DCNB_NHAP_2CUC_KTCL_LT_BBNTBQLD')) ||
      (this.userService.isAccessPermisson('DCNB_NHAP_CUNG1CUC_KTCL_LT') && this.userService.isAccessPermisson('DCNB_NHAP_CUNG1CUC_KTCL_LT_BBNTBQLD'))
  }

  checkPKTCL() {
    return (this.userService.isAccessPermisson('DCNB_NHAP_NBCC_KTCL_LT') && this.userService.isAccessPermisson('DCNB_NHAP_NBCC_KTCL_LT_PKTCL')) ||
      (this.userService.isAccessPermisson('DCNB_NHAP_2CUC_KTCL_LT') && this.userService.isAccessPermisson('DCNB_NHAP_2CUC_KTCL_LT_PKTCL')) ||
      (this.userService.isAccessPermisson('DCNB_NHAP_CUNG1CUC_KTCL_LT') || this.userService.isAccessPermisson('DCNB_NHAP_CUNG1CUC_KTCL_LT_PKTCL'))
  }

  checkBBLM() {
    return (this.userService.isAccessPermisson('DCNB_NHAP_NBCC_KTCL_LT') && this.userService.isAccessPermisson('DCNB_NHAP_NBCC_KTCL_LT_BBLM')) ||
      (this.userService.isAccessPermisson('DCNB_NHAP_2CUC_KTCL_LT') || this.userService.isAccessPermisson('DCNB_NHAP_2CUC_KTCL_LT_BBLM')) ||
      (this.userService.isAccessPermisson('DCNB_NHAP_CUNG1CUC_KTCL_LT') || this.userService.isAccessPermisson('DCNB_NHAP_CUNG1CUC_KTCL_LT_BBLM'))
  }

  checkPKNCL() {
    return (this.userService.isAccessPermisson('DCNB_NHAP_NBCC_KTCL_LT') && this.userService.isAccessPermisson('DCNB_NHAP_NBCC_KTCL_LT_PKNCL')) ||
      (this.userService.isAccessPermisson('DCNB_NHAP_2CUC_KTCL_LT') && this.userService.isAccessPermisson('DCNB_NHAP_2CUC_KTCL_LT_PKNCL')) ||
      (this.userService.isAccessPermisson('DCNB_NHAP_CUNG1CUC_KTCL_LT') && this.userService.isAccessPermisson('DCNB_NHAP_CUNG1CUC_KTCL_LT_PKNCL'))
  }

}
