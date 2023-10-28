import { Component, Input, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { QlDinhMucPhiService } from '../../../../services/qlnv-kho/QlDinhMucPhi.service';
import { Base2Component } from '../../../../components/base2/base2.component';
import { HttpClient } from '@angular/common/http';
import { StorageService } from '../../../../services/storage.service';

;

@Component({
  selector: 'app-dinh-muc-phi-nhap-xuat-bao-quan',
  templateUrl: './dinh-muc-phi-nhap-xuat-bao-quan.component.html',
  styleUrls: ['./dinh-muc-phi-nhap-xuat-bao-quan.component.scss'],
})
export class DinhMucPhiNhapXuatBaoQuanComponent extends Base2Component implements OnInit {
  @Input() capDvi: number = 1;
  selectedId: number = 0;
  isViewDetail: boolean;
  isDetail: boolean = false;

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    qlDinhMucPhiService: QlDinhMucPhiService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, qlDinhMucPhiService);
    super.ngOnInit();
    this.filterTable = {};
  }

  async ngOnInit() {
    this.formData = this.fb.group({
      soQd: [''],
      trangThai: [''],
      ngayKy: [''],
      ngayHieuLuc: [''],
      trichYeu: [''],
      capDvi: [this.capDvi],
      loai: ['00'],
    });
    this.filter();
  }

  filter() {
    if (this.formData.value.ngayKy && this.formData.value.ngayKy.length > 0) {
      this.formData.value.ngayKyTu = this.formData.value.ngayKy[0];
      this.formData.value.ngayKyDen = this.formData.value.ngayKy[1];
    }
    if (this.formData.value.ngayHieuLuc && this.formData.value.ngayHieuLuc.length > 0) {
      this.formData.value.ngayHieuLucTu = this.formData.value.ngayHieuLuc[0];
      this.formData.value.ngayHieuLucDen = this.formData.value.ngayHieuLuc[1];
    }
    this.formData.value.capDvi = this.capDvi;
    this.search();
  }

  clearForm() {
    this.formData.reset();
    this.formData.value.capDvi = this.capDvi;
    this.formData.patchValue({
      capDvi: this.capDvi,
      loai: '00',
    });
    this.search();
  }

  redirectToChiTiet(id: number, isView?: boolean) {
    this.selectedId = id;
    this.isDetail = true;
    this.isViewDetail = isView ?? false;
  }

  checkRolesTemplate(): boolean {
    return (this.capDvi == Number(this.userInfo.CAP_DVI));
  }

}
