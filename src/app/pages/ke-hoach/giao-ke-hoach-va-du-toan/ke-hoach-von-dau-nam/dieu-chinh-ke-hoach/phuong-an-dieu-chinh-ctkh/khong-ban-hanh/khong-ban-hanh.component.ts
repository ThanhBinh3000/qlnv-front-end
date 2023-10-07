import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { PhuongAnDieuChinhCTKHService } from 'src/app/services/dieu-chinh-chi-tieu-ke-hoach/phuong-an-dieu-chinh-ctkh';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-khong-ban-hanh',
  templateUrl: './khong-ban-hanh.component.html',
  styleUrls: ['./khong-ban-hanh.component.scss']
})
export class KhongBanHanhComponent extends Base2Component implements OnInit {

  fileDinhKems: any[] = [];

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private _modalRef: NzModalRef,
    public phuongAnDieuChinhCTKHService: PhuongAnDieuChinhCTKHService


  ) {
    super(httpClient, storageService, notification, spinner, modal, phuongAnDieuChinhCTKHService);
    this.formData = this.fb.group({
      soCongVan: [, [Validators.required]],
      ngayKy: [, [Validators.required]],
      maDiemKho: [, [Validators.required]],
      tenDiemKho: [, [Validators.required]],
      maNhaKho: [, [Validators.required]],
      tenNhaKho: [, [Validators.required]],
      maNganKho: [, [Validators.required]],
      tenNganKho: [, [Validators.required]],
      maLoKho: [, [Validators.required]],
      tenLoKho: [, [Validators.required]],
      maThuKho: [, [Validators.required]],
      thuKho: [, [Validators.required]],
      loaiVthh: [, [Validators.required]],
      tenLoaiVthh: [, [Validators.required]],
      cloaiVthh: [, [Validators.required]],
      tenCloaiVthh: [, [Validators.required]],
      tonKho: [, [Validators.required]],
      donViTinh: [, [Validators.required]],
      donViTinhNhap: [, [Validators.required]],
      soLuongDc: [, [Validators.required]],
      duToanKphi: [0],
      thoiGianDkDc: [, [Validators.required]],
      maDiemKhoNhan: [, [Validators.required]],
      tenDiemKhoNhan: [, [Validators.required]],
      maNhaKhoNhan: [, [Validators.required]],
      tenNhaKhoNhan: [, [Validators.required]],
      maNganKhoNhan: [, [Validators.required]],
      tenNganKhoNhan: [, [Validators.required]],
      maLoKhoNhan: [, [Validators.required]],
      tenLoKhoNhan: [, [Validators.required]],
      maThuKhoNhan: [, [Validators.required]],
      thuKhoNhan: [, [Validators.required]],
      thayDoiThuKho: [, [Validators.required]],
      slDcConLai: [, [Validators.required]],
      tichLuongKd: [, [Validators.required]],
      soLuongPhanBo: [, [Validators.required]],
    }
    );
  }

  ngOnInit(): void {
  }


  handleOk(item: any) {
    this.helperService.markFormGroupTouched(this.formData);
    if (!this.formData.valid) return
    this._modalRef.close({
      ...item,
      // isUpdate: !!this.data
    });
  }

  onCancel() {
    this._modalRef.close();
  }

}
