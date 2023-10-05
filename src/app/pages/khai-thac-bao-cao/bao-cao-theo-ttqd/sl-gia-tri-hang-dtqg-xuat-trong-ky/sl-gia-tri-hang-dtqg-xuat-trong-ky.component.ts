import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { StorageService } from "../../../../services/storage.service";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NgxSpinnerService } from "ngx-spinner";
import { NzModalService } from "ng-zorro-antd/modal";
import { UserService } from "../../../../services/user.service";
import { DonviService } from "../../../../services/donvi.service";
import { DanhMucService } from "../../../../services/danhmuc.service";
import { Globals } from "../../../../shared/globals";
import * as dayjs from "dayjs";
import { Validators } from "@angular/forms";
import { MESSAGE } from "../../../../constants/message";
import { Base2Component } from "../../../../components/base2/base2.component";
import { saveAs } from "file-saver";
import { ThongTu1302018Service } from "../../../../services/bao-cao/ThongTu1302018.service";

@Component({
  selector: 'app-sl-gia-tri-hang-dtqg-xuat-trong-ky',
  templateUrl: './sl-gia-tri-hang-dtqg-xuat-trong-ky.component.html',
  styleUrls: ['./sl-gia-tri-hang-dtqg-xuat-trong-ky.component.scss']
})
export class SlGiaTriHangDtqgXuatTrongKyComponent extends Base2Component implements OnInit {
  pdfSrc: any;
  excelSrc: any;
  pdfBlob: any;
  excelBlob: any;
  selectedVthhCache: any;
  selectedCloaiVthhCache: any;
  showDlgPreview = false;
  listNam: any[] = [];
  dsDonVi: any;
  listChiCuc: any[] = [];
  listVthh: any[] = [];
  listCloaiVthh: any[] = [];
  rows: any[] = [];
  dsLoaiBc: any[] = [
    { text: 'Báo cáo Quý', value: 1 },
    { text: 'Báo cáo Năm', value: 2 }
  ]
  constructor(httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private thongTu1302018Service: ThongTu1302018Service,
    public userService: UserService,
    private donViService: DonviService,
    private danhMucService: DanhMucService,
    public globals: Globals) {
    super(httpClient, storageService, notification, spinner, modal, thongTu1302018Service);
    this.formData = this.fb.group(
      {
        nam: [dayjs().get("year"), [Validators.required]],
        quy: null,
        bieuSo: null,
        dviBaoCao: null,
        dviNhanBaoCao: null,
        dsLoaiBc: null,
      }
    );
  }

  async ngOnInit() {
    await this.spinner.show();
    try {
      for (let i = -3; i < 23; i++) {
        this.listNam.push({
          value: dayjs().get("year") - i,
          text: dayjs().get("year") - i
        });
      }
      await Promise.all([
        this.loadDsDonVi(),
        this.loadDsVthh()
      ]);
    } catch (e) {
      console.log("error: ", e);
      await this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
    await this.spinner.hide();
  }

  downloadPdf() {
    saveAs(this.pdfBlob, "bc_sl_gia_tri_hang_dtqg_xuat_trong_ky_130.pdf");
  }

  closeDlg() {
    this.showDlgPreview = false;
  }

  async preView() {
    try {
      this.spinner.show();
      if (this.formData.value.thoiGianSx) {
        this.formData.value.thoiGianSxTu = dayjs(this.formData.value.thoiGianSx[0]).format("YYYY-MM-DD");
        this.formData.value.thoiGianSxDen = dayjs(this.formData.value.thoiGianSx[1]).format("YYYY-MM-DD");
      }
      if (this.formData.value.thoiGianNhapKho) {
        this.formData.value.thoiGianNhapKhoTu = dayjs(this.formData.value.thoiGianNhapKho[0]).format("YYYY-MM-DD");
        this.formData.value.thoiGianNhapKhoDen = dayjs(this.formData.value.thoiGianNhapKho[1]).format("YYYY-MM-DD");
      }
      let body = this.formData.value;
      body.typeFile = "pdf";
      body.fileName = "bc_sl_gia_tri_hang_dtqg_xuat_trong_ky_130.jrxml";
      body.tenBaoCao = "Báo cáo số lượng giá trị hàng DTQG xuất trong kỳ";
      body.trangThai = "01";
      body.loaiNhapXuat = "-1";
      await this.thongTu1302018Service.bcSlGtriHangDtqgXuat(body).then(async s => {
        this.pdfBlob = s;
        this.pdfSrc = await new Response(s).arrayBuffer();
      });
      this.showDlgPreview = true;
    } catch (e) {
      console.log(e);
    } finally {
      this.spinner.hide();
    }
  }


  async downloadExcel() {
    try {
      this.spinner.show();
      let body = this.formData.value;
      body.typeFile = "xlsx";
      body.fileName = "bc_sl_gia_tri_hang_dtqg_xuat_trong_ky_130.jrxml";
      body.tenBaoCao = "Báo cáo số lượng giá trị hàng DTQG xuất trong kỳ";
      body.trangThai = "01";
      await this.thongTu1302018Service.bcSlGtriHangDtqgXuat(body).then(async s => {
        this.excelBlob = s;
        this.excelSrc = await new Response(s).arrayBuffer();
        saveAs(this.excelBlob, "bc_sl_gia_tri_hang_dtqg_xuat_trong_ky_130.xlsx");
      });
      this.showDlgPreview = true;
    } catch (e) {
      console.log(e);
    } finally {
      this.spinner.hide();
    }

  }

  async loadDsDonVi() {
    let body = {
      trangThai: "01",
      maDviCha: this.userInfo.MA_DVI.substring(0, 4),
      type: "DV"
    };
    let res = await this.donViService.getDonViTheoMaCha(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.dsDonVi = res.data;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async changeCuc(event: any) {
    if (event) {
      let body = {
        trangThai: "01",
        maDviCha: event,
        type: "DV"
      };
      let res = await this.donViService.getDonViTheoMaCha(body);
      if (res.msg == MESSAGE.SUCCESS) {
        this.listChiCuc = res.data;
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }
  }

  async loadDsVthh() {
    this.listVthh = [];
    let res = await this.danhMucService.danhMucChungGetAll("LOAI_HHOA");
    if (res.msg == MESSAGE.SUCCESS) {
      this.listVthh = res.data.filter(item => item.ma != "02");
    }
  }

  async changeLoaiVthh(event) {
    let res = await this.danhMucService.loadDanhMucHangHoaTheoMaCha({ str: event });
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data) {
        this.listCloaiVthh = res.data;
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  changeCloaiVthh(event) {

  }
  addRow() {
    this.rows.push({})
  }

  deleteRow(index: number) {
    this.rows.splice(index, 1)
  }
}
