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
import {ThongTu1082018Service} from "../../../../services/bao-cao/ThongTu1082018.service";

@Component({
  selector: 'app-tinh-hinh-th-phi-bq-hang-dtqg-theo-dinh-muc',
  templateUrl: './tinh-hinh-th-phi-bq-hang-dtqg-theo-dinh-muc.component.html',
  styleUrls: ['./tinh-hinh-th-phi-bq-hang-dtqg-theo-dinh-muc.component.scss']
})
export class TinhHinhThPhiBqHangDtqgTheoDinhMucComponent extends Base2Component implements OnInit {
  pdfSrc: any;
  excelSrc: any;
  pdfBlob: any;
  excelBlob: any;

  dsBoNganh: any[] = [];
  selectedVthhCache: any;
  selectedCloaiVthhCache: any;
  showDlgPreview = false;
  listNam: any[] = [];
  dsDonVi: any;
  listChiCuc: any[] = [];
  listVthh: any[] = [];
  listCloaiVthh: any[] = [];
  rows: any[] = [];

  constructor(httpClient: HttpClient,
              storageService: StorageService,
              notification: NzNotificationService,
              spinner: NgxSpinnerService,
              modal: NzModalService,
              private thongTu1082018Service: ThongTu1082018Service,
              public userService: UserService,
              private donViService: DonviService,
              private danhMucService: DanhMucService,

              private donviService: DonviService,
              public globals: Globals) {
    super(httpClient, storageService, notification, spinner, modal, thongTu1082018Service);
    this.formData = this.fb.group(
      {
        nam: [dayjs().get("year"), [Validators.required]],
        quy: [dayjs().get("year"), [Validators.required]],
        boNganh: null,
        dviBaoCao: null,
        maDvqhns: null,
        loaiHangHoa: null,
        nuocSanXuat: null,
        chungLoaiHangHoa: null
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
      ]);
    } catch (e) {
      console.log("error: ", e);
      await this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
    await this.spinner.hide();
  }

  downloadPdf() {
    saveAs(this.pdfBlob, "bc_tinh_hinh_th_phi_bao_quan_hang_dtqg_theo_dinh_muc_130.pdf");
  }

  closeDlg() {
    this.showDlgPreview = false;
  }

  async preView() {
    try {
      this.spinner.show();
      let body = this.formData.value;
      body.typeFile = "pdf";
      body.fileName = "bc_tinh_hinh_th_phi_bao_quan_hang_dtqg_theo_dinh_muc_130.jrxml";
      body.tenBaoCao = "Báo cáo tình hình thực hiện phí bảo quản hàng DTQG theo định mức";
      body.trangThai = "01";
      await this.thongTu1082018Service.bcThienPhiBaoQuanDm(body).then(async s => {
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
      body.fileName = "bc_tinh_hinh_th_phi_bao_quan_hang_dtqg_theo_dinh_muc_130.jrxml";
      body.tenBaoCao = "Báo cáo tình hình thực hiện phí bảo quản hàng DTQG theo định mức";
      body.trangThai = "01";
      await this.thongTu1082018Service.bcThienPhiBaoQuanDm(body).then(async s => {
        this.excelBlob = s;
        this.excelSrc = await new Response(s).arrayBuffer();
        saveAs(this.excelBlob, "bc_tinh_hinh_th_phi_bao_quan_hang_dtqg_theo_dinh_muc_130.xlsx");
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

  clearFilter() {
    this.formData.patchValue({
      nam: dayjs().get("year"),
    })
    if (this.userService.isTongCuc()) {
      this.formData.patchValue({
        listMaCuc: null,
      })
    } else if (this.userService.isCuc()) {
      this.formData.patchValue({
        listMaChiCuc: null,
        listMaCuc: [this.userInfo.MA_DVI],
      })
    } else if (this.userService.isChiCuc()) {
      this.formData.patchValue({
        listMaChiCuc: [this.userInfo.MA_DVI],
        listMaCuc: [this.userInfo.MA_DVI.substring(0,6)]
      })
    }
  }
}
