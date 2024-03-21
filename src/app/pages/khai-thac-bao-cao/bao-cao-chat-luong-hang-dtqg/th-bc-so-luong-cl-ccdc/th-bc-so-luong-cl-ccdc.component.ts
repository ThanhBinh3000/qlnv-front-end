import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { StorageService } from "../../../../services/storage.service";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NgxSpinnerService } from "ngx-spinner";
import { NzModalService } from "ng-zorro-antd/modal";
import { UserService } from "../../../../services/user.service";
import { DonviService } from "../../../../services/donvi.service";
import { Globals } from "../../../../shared/globals";
import * as dayjs from "dayjs";
import { Validators } from "@angular/forms";
import { MESSAGE } from "../../../../constants/message";
import { Base2Component } from "../../../../components/base2/base2.component";
import { saveAs } from "file-saver";
import { BcCLuongHangDTQGService } from 'src/app/services/bao-cao/BcCLuongHangDTQG.service';

@Component({
  selector: 'app-th-bc-so-luong-cl-ccdc',
  templateUrl: './th-bc-so-luong-cl-ccdc.component.html',
  styleUrls: ['./th-bc-so-luong-cl-ccdc.component.scss']
})
export class ThBcSoLuongClCcdcComponent extends Base2Component implements OnInit {
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

  constructor(httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private bcCLuongHangDTQGService: BcCLuongHangDTQGService,
    public userService: UserService,
    private donViService: DonviService,
    public globals: Globals) {
    super(httpClient, storageService, notification, spinner, modal, bcCLuongHangDTQGService);
    this.formData = this.fb.group(
      {
        nam: [dayjs().get("year"), [Validators.required]],
        maCuc: null,
        maChiCuc: null,
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
      if (this.userService.isCuc()) {
        this.formData.get('maCuc').setValue(this.userInfo.MA_DVI)
      } else if (this.userService.isChiCuc()) {
        this.formData.get('maCuc').setValue(this.userInfo.MA_DVI.substring(0, 6))
        this.formData.get('maChiCuc').setValue(this.userInfo.MA_DVI)
      }
      await Promise.all([
        this.loadDsDonVi()
      ]);
    } catch (e) {
      console.log("error: ", e);
      await this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
    await this.spinner.hide();
  }

  downloadPdf() {
    saveAs(this.pdfBlob, "bc_so_luong_chat_luong_ccdc.pdf");
  }

  async downloadExcel() {
    try {
      this.spinner.show();
      let body = this.formData.value;
      body.typeFile = "xlsx";
      body.fileName = "th_bc_sl_cl_ccdc.jrxml";
      body.tenBaoCao = "Báo cáo số lượng chất lượng Công cụ dụng cụ";
      body.trangThai = "01";
      await this.bcCLuongHangDTQGService.baoCaoSLuongCLuongCcdc(body).then(async s => {
        this.excelBlob = s;
        this.excelSrc = await new Response(s).arrayBuffer();
        saveAs(this.excelBlob, "bc_so_luong_chat_luong_ccdc.xlsx");
      });
      this.showDlgPreview = true;
    } catch (e) {
      console.log(e);
    } finally {
      this.spinner.hide();
    }

  }

  closeDlg() {
    this.showDlgPreview = false;
  }

  async preView() {
    try {
      this.spinner.show();
      let body = this.formData.value;
      body.typeFile = "pdf";
      body.fileName = "th_bc_sl_cl_ccdc.jrxml";
      body.tenBaoCao = "Báo cáo số lượng chất lượng Công cụ dụng cụ";
      body.trangThai = "01";
      await this.bcCLuongHangDTQGService.baoCaoSLuongCLuongCcdc(body).then(async s => {
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

  async loadDsDonVi() {
    if (this.userService.isCuc()) {
      await this.changeCuc(this.userInfo.MA_DVI)
    } else {
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
  }

  async changeCuc(event: any) {
    if (event) {
      let body = {
        trangThai: "01",
        maDviCha: event,
        type: "DV"
      };
      this.formData.get('maChiCuc').setValue(null);
      let res = await this.donViService.getDonViTheoMaCha(body);
      if (res.msg == MESSAGE.SUCCESS) {
        this.listChiCuc = res.data;
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }
  }
  async clearFilter() {
    this.formData.get('maCuc').setValue(null);
    this.formData.get('maChiCuc').setValue(null);
    this.formData.get('maDvi').setValue(null);
  }
}
