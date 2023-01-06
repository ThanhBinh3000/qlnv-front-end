import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import dayjs from 'dayjs';
import { NzModalService } from 'ng-zorro-antd/modal';
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
  idDtl: number;
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
      idQdPdDtl: [],
      nam: [dayjs().get("year"), [Validators.required]],
      maThongBao: [],
      trichYeuTbao: [],
      tenToChuc: [],
      sdtToChuc: [],
      diaChiToChuc: [],
      taiKhoanToChuc: [],
      soHd: [],
      ngayKyHd: [],
      hthucTchuc: [],
      tgianDky: [],
      tgianDkyTu: [],
      tgianDkyDen: [],
      ghiChuTgianDky: [],
      diaDiemDky: [],
      dieuKienDky: [],
      tienMuaHoSo: [],
      buocGia: [],
      tgianXem: [],
      tgianXemTu: [],
      tgianXemDen: [],
      ghiChuTgianXem: [],
      diaDiemXem: [],
      tgianNopTien: [],
      tgianNopTienTu: [],
      tgianNopTienDen: [],
      ghiChuTgianNopTien: [],
      pthucTtoan: [],
      donViThuHuong: [],
      stkThuHuong: [],
      nganHangThuHuong: [],
      chiNhanhNganHang: [],
      tgianDauGia: [],
      tgianDauGiaTu: [],
      tgianDauGiaDen: [],
      diaDiemDauGia: [],
      hthucDgia: [],
      pthucDgia: [],
      dkienCthuc: [],
      ghiChu: [],
      ketQua: [],
      soBienBan: [],
      trichYeuBban: [],
      ngayKyBban: [],
    })
  }

  async ngOnInit() {
    if (this.data) {
      this.helperService.bidingDataInFormGroup(this.formData, this.data);
    } else {
      let idThongBao = await this.helperService.getId("XH_TC_TTIN_BDG_HDR_SEQ")
      this.formData.patchValue({
        maThongBao: idThongBao + "/" + this.formData.value.nam + "/TB-ĐG",
        idQdPdDtl: this.idDtl,
        soBienBan: idThongBao + "/" + this.formData.value.nam + "/BB-ĐG"
      })
    }
  }

  async handleCancel() {
    this.modal.closeAll();
  }

  isDisabled() {
    return false;
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
