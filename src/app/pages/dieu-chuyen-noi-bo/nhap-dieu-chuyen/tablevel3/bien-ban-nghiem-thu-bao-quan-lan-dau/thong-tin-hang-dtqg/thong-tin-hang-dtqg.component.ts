import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { NzModalRef, NzModalService } from "ng-zorro-antd/modal";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NgxSpinnerService } from "ngx-spinner";
import { Base2Component } from "src/app/components/base2/base2.component";
import { MESSAGE } from "src/app/constants/message";
import { DanhMucService } from "src/app/services/danhmuc.service";
import { DonviService } from "src/app/services/donvi.service";
import { MangLuoiKhoService } from "src/app/services/qlnv-kho/mangLuoiKho.service";
import { QuanLyHangTrongKhoService } from "src/app/services/quanLyHangTrongKho.service";
import { StorageService } from "src/app/services/storage.service";

@Component({
  selector: 'app-thong-tin-hang-dtqg',
  templateUrl: './thong-tin-hang-dtqg.component.html',
  styleUrls: ['./thong-tin-hang-dtqg.component.scss']
})
export class ThongTinHangDtqgComponent extends Base2Component implements OnInit {

  formData: FormGroup
  fb: FormBuilder = new FormBuilder();

  listDM: any[] = [];
  listMatHang: any[] = [];

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private _modalRef: NzModalRef,
    private danhMucService: DanhMucService,
    private donViService: DonviService,
    private mangLuoiKhoService: MangLuoiKhoService,
    private quanLyHangTrongKhoService: QuanLyHangTrongKhoService,

  ) {
    super(httpClient, storageService, notification, spinner, modal, quanLyHangTrongKhoService);
    this.formData = this.fb.group({
      danhMuc: [],
      nhomHang: [],
      dvtNH: [],
      tenMatHang: [],
      dvtTMH: [],
      tongGiaTri: [],
      slTrongNam: [],
      donGia: [],
      thanhTienTrongNam: [],
      slNamTruoc: [],
      thanhTienNamTruoc: [],

      maDiemKho: [],
      tenDiemKho: [],
      maNhaKho: [],
      tenNhaKho: [],
      maNganKho: [],
      tenNganKho: [],
      maLoKho: [],
      tenLoKho: [],
      maThuKho: [],
      thuKho: [],
      loaiVthh: [],
      tenLoaiVthh: [],
      cloaiVthh: [],
      tenCloaiVthh: [],
      tonKho: [],
      tenDonViTinh: [],
      soLuongDc: [],
      duToanKphi: [],
      thoiGianDkDc: [],
      maDiemKhoNhan: [],
      tenDiemKhoNhan: [],
      maNhaKhoNhan: [],
      tenNhaKhoNhan: [],
      maNganKhoNhan: [],
      tenNganKhoNhan: [],
      maLoKhoNhan: [],
      tenLoKhoNhan: [],
      maThuKhoNhan: [],
      thuKhoNhan: [],
      thayDoiThuKho: [],
      slDcConLai: [],
      tichLuongKd: [],
      soLuongPhanBo: [],
    }
    );
  }

  ngOnInit(): void {
    this.getNhomCCDC()
  }

  async getNhomCCDC() {
    this.listDM = []
    let res = await this.danhMucService.getNhomCCDC();
    if (res.msg == MESSAGE.SUCCESS) {
      this.listDM = res.data
    }
  }

  async onChangeDanhMuc(nhomCcdc) {
    const body = { nhomCcdc }
    this.listMatHang = []
    let res = await this.danhMucService.getDSMatHang(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.listMatHang = res.data.content
    }
  }

  async onChangeNhomHang(value) {
    const nhomHang = this.listMatHang.find(item => item.maCcdc === value)
    if (nhomHang) {
      this.formData.patchValue({
        dvtNH: nhomHang.donViTinh
      })
    }
  }

  async onChangeTenMH(value) {
    const nhomHang = this.listMatHang.find(item => item.maCcdc === value)
    if (nhomHang) {
      this.formData.patchValue({
        dvtTMH: nhomHang.donViTinh
      })
    }
  }

  handleOk(item: any) {
    this._modalRef.close({
      ...item,
      // isUpdate: !!this.data
    });
  }

  onCancel() {
    this._modalRef.close();
  }

}
