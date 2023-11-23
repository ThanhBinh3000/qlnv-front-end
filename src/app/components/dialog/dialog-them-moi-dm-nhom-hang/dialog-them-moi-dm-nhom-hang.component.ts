import { Component, OnInit } from '@angular/core';
import { Base2Component } from "../../base2/base2.component";
import { HttpClient } from "@angular/common/http";
import { StorageService } from "../../../services/storage.service";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NgxSpinnerService } from "ngx-spinner";
import { NzModalRef, NzModalService } from "ng-zorro-antd/modal";
import { DanhMucService } from "../../../services/danhmuc.service";
import { DonviService } from "../../../services/donvi.service";
import { MangLuoiKhoService } from "../../../services/qlnv-kho/mangLuoiKho.service";
import { QuanLyHangTrongKhoService } from "../../../services/quanLyHangTrongKho.service";
import { MESSAGE } from "../../../constants/message";

@Component({
  selector: 'app-dialog-them-moi-dm-nhom-hang',
  templateUrl: './dialog-them-moi-dm-nhom-hang.component.html',
  styleUrls: ['./dialog-them-moi-dm-nhom-hang.component.scss']
})
export class DialogThemMoiDmNhomHangComponent extends Base2Component implements OnInit {
  typeData: string
  typeAction: string
  isChildren: boolean
  data: any
  listMatHang: any[] = [];
  nhomCcdc: any[] = [];
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
      id: [],
      danhMuc: [],
      nhomHang: [],
      donViTinh: [],
      isMatHang: [],
      tenMatHang: [],
      matHang: [],
      donViTinhMh: [],
      tongGiaTri: [],
      soLuongTrongNam: [],
      donGia: [],
      thanhTienTrongNam: [],
      soLuongNamTruoc: [],
      thanhTienNamTruoc: [],
    }
    );
  }

  ngOnInit(): void {
    this.getDSMatHang()
  }

  async getDSMatHang() {
    let body = {};
    if (this.nhomCcdc != null) {
      body = {
        nhomCcdc: this.nhomCcdc,
        paggingReq: {
          limit: this.globals.prop.MAX_INTERGER,
          page: 0
        }
      }
    } else {
      body = {
        nhomCcdc: [1],
        paggingReq: {
          limit: this.globals.prop.MAX_INTERGER,
          page: 0
        }
      }
    }
    this.listMatHang = []
    let res = await this.danhMucService.getDSMatHang(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.listMatHang = res.data.content
    }
    if (!this.data) return
    let data = this.data
    data.isMatHang = (data.idParent && !data.isParent)
    this.formData.patchValue(data);
  }

  async onChangeSLTrongNam(value) {
    if (this.formData.value.donGia && value) {
      const thanhTienTrongNam = Number(value) * Number(this.formData.value.donGia)
      const tongGiaTri = Number(this.formData.value.thanhTienNamTruoc) + Number(thanhTienTrongNam)
      this.formData.patchValue({
        thanhTienTrongNam,
        tongGiaTri
      })
    }
  }

  async onChangeDonGia(value) {
    if (this.formData.value.soLuongTrongNam && value) {
      const thanhTienTrongNam = Number(value) * Number(this.formData.value.soLuongTrongNam)
      const tongGiaTri = Number(this.formData.value.thanhTienNamTruoc) + Number(thanhTienTrongNam)
      this.formData.patchValue({
        thanhTienTrongNam,
        tongGiaTri
      })
    }
  }

  async onChangeTenMH(value) {
    const nhomHang = this.listMatHang.find(item => item.maCcdc === value)
    if (nhomHang) {
      this.formData.patchValue({
        donViTinhMh: nhomHang.donViTinh,
        tenMatHang: nhomHang.tenCcdc
      })
    }
  }

  async onChangeTTNamTruoc(thanhTienNamTruoc) {
    const tongGiaTri = Number(thanhTienNamTruoc) + Number(this.formData.value.thanhTienTrongNam)
    this.formData.patchValue({
      tongGiaTri
    })
  }


  handleOk(item: any) {
    this._modalRef.close({ ...item, isChildren: this.isChildren });
  }

  onCancel() {
    this._modalRef.close();
  }
}
