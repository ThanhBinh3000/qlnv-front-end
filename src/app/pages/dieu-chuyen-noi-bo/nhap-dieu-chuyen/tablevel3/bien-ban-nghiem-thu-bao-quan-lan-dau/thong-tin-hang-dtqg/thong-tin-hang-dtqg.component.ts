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

  typeData: string
  typeAction: string
  isChildren: boolean
  data: any

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
    const body = {
      nhomCcdc: [1,2],
      paggingReq: {
        limit: this.globals.prop.MAX_INTERGER,
        page: 0,
      },
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
