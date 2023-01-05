import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import dayjs from 'dayjs';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { ThongTinDauGiaService } from 'src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/tochuc-trienkhai/thongTinDauGia.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-thongtin-daugia',
  templateUrl: './thongtin-daugia.component.html',
})
export class ThongtinDaugiaComponent extends Base2Component implements OnInit {

  @Input() data
  isModal = false;
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private thongTinDauGiaService: ThongTinDauGiaService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, thongTinDauGiaService);
    this.formData = this.fb.group({
      id: [],
      nam: [dayjs().get("year"), [Validators.required]],
      maThongBao: [],
      trichYeuThongBao: [],
      tenToChuc: [],
      sdt: [],
      diaChi: [],
      taiKhoanNganHang: [],
      soHopDong: [],
      ngayKyHopDong: [],
      hinhThucToChuc: [],
      thoiGianThamGia: [],
      ghiChuThoiGianThamGia: [],
      diaDiemNopHoSo: [],
      dieuKienDangKy: [],
      tienHoSo: [],
      buocGia: [],
      tgianXemTaiSan: [],
      ghiChuTgianXemTaiSan: [],
      diaDiemXemTaiSan: [],
      tgianNopTien: [],
      ghiChuTgianXem: [],
      pthucThanhToan: [],
      donViThuHuong: [],
      stk: [],
      nganHang: [],
      chiNhanhNganHang: [],
      tgianToChucDauGia: [],
      diaDiemToChucDauGia: [],
      hthucDauGia: [],
      pthucDauGia: [],
      dieuKien: [],
      ghiChu: [],
      ketQuaDauGia: [],
      soBienBanDauGia: [],
      trichYeuKetQua: [],
    })
  }

  ngOnInit(): void {

  }

  async handleCancel() {
    this.modal.closeAll();
  }

  async handleOk() {
    let body = this.formData.value;
    let data = await this.createUpdate(body);
    console.log(data);
    if (data) {
      this.modal.closeAll();
    }
  }

}
