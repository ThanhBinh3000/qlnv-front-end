import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { StorageService } from "../../../../services/storage.service";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NgxSpinnerService } from "ngx-spinner";
import { NzModalService } from "ng-zorro-antd/modal";
import { ThongTu1452013Service } from "../../../../services/bao-cao/ThongTu1452013.service";
import { UserService } from "../../../../services/user.service";
import { DonviService } from "../../../../services/donvi.service";
import { DanhMucService } from "../../../../services/danhmuc.service";
import { Globals } from "../../../../shared/globals";
import * as dayjs from "dayjs";
import { Validators } from "@angular/forms";
import { MESSAGE } from "../../../../constants/message";
import { Base2Component } from "../../../../components/base2/base2.component";
import { saveAs } from "file-saver";
import {BcBnTt130Service} from "../../../../services/bao-cao/BcBnTt130.service";
import {ThongTu1302018Service} from "../../../../services/bao-cao/ThongTu1302018.service";

@Component({
  selector: 'app-kh-mua-hang-dtqg',
  templateUrl: './kh-mua-hang-dtqg.component.html',
  styleUrls: ['./kh-mua-hang-dtqg.component.scss']
})
export class KhMuaHangDtqgComponent extends Base2Component implements OnInit {
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
  listLoaiBc: any[] = [];
  rows: any[] = [];
  maCuc: any;
  maChiCuc: any;
  dsDvtt: any[] = [
    {text: 'Nghìn đồng', value: '01'},
    {text: 'Triệu đồng', value: '02'},
    {text: 'Tỷ đồng', value: '03'},
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
        tenCuc: null,
        tenChiCuc: null,
        loaiBc: ['02', [Validators.required]],
        dvtt: ['01', [Validators.required]],
        dviBaoCao: null,
        dviNhanBaoCao: null,
        loaiVthh: null,
        chungLoaiVthh: null,
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
        this.loadDsLoaiBc(),
        this.loadDsVthh()
      ]);
    } catch (e) {
      console.log("error: ", e);
      await this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
    await this.spinner.hide();
  }

  async loadDsLoaiBc() {
    let res = await this.danhMucService.danhMucChungGetAll("LOAI_BAO_CAO");
    if (res.msg == MESSAGE.SUCCESS) {
      console.log(res, "4444")
      this.listLoaiBc = res.data.filter(x => x.ma != '04' && x.ma != '03')
    }
  }

  downloadPdf() {
    saveAs(this.pdfBlob, "bc_kh_mua_hang_dtqg_130.pdf");
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
      body.fileName = "bc_kh_mua_hang_dtqg_130.jrxml";
      body.tenBaoCao = "Báo cáo kế hoạch mua hàng DTQG";
      body.trangThai = "01";
      body.maCuc = this.maCuc;
      body.maChiCuc = this.maChiCuc;
      await this.thongTu1302018Service.bcKhMuaHangDtqg(body).then(async s => {
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
      body.fileName = "bc_kh_mua_hang_dtqg_130.jrxml";
      body.tenBaoCao = "Báo cáo kế hoạch mua hàng DTQG";
      body.trangThai = "01";
      body.maCuc = this.maCuc;
      body.maChiCuc = this.maChiCuc;
      await this.thongTu1302018Service.bcKhMuaHangDtqg(body).then(async s => {
        this.excelBlob = s;
        this.excelSrc = await new Response(s).arrayBuffer();
        saveAs(this.excelBlob, "bc_kh_mua_hang_dtqg_130.xlsx");
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
      this.formData.patchValue({
        tenCuc: this.dsDonVi.find(x => x.maDvi == event).tenDvi
      })
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
      this.listVthh = res.data;
    }
  }

  async changeLoaiBc(event: any){
    if(event == '01'){
      this.maCuc = null;
      this.maChiCuc = null;
    }
  }

  async changeLoaiVthh(event) {
    this.listCloaiVthh = [];
    this.formData.value.chungLoaiVthh = null;
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
  addRow () {
    this.rows.push({})
  }

  deleteRow(index: number) {
    this.rows.splice(index, 1)
  }

  clearFilter() {
    this.formData.patchValue({
      quy: null,
      maDvi: null,
      dviNhanBaoCao: null,
      loaiVthh: null,
      chungLoaiVthh: null,
    })
    this.maCuc = null;
    this.maChiCuc = null;
  }
}
