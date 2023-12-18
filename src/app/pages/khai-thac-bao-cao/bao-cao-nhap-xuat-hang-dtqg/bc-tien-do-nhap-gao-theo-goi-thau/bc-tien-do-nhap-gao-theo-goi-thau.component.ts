import { Component, OnInit } from '@angular/core';
import { Base2Component } from '../../../../components/base2/base2.component';
import { HttpClient } from '@angular/common/http';
import { StorageService } from '../../../../services/storage.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { NzModalService } from 'ng-zorro-antd/modal';
import { BcCLuongHangDTQGService } from '../../../../services/bao-cao/BcCLuongHangDTQG.service';
import { UserService } from '../../../../services/user.service';
import { DonviService } from '../../../../services/donvi.service';
import { DanhMucService } from '../../../../services/danhmuc.service';
import { Globals } from '../../../../shared/globals';
import * as dayjs from 'dayjs';
import {saveAs} from "file-saver";
import { Validators } from '@angular/forms';
import { MESSAGE } from '../../../../constants/message';

@Component({
  selector: 'app-bc-tien-do-nhap-gao-theo-goi-thau',
  templateUrl: './bc-tien-do-nhap-gao-theo-goi-thau.component.html',
  styleUrls: ['./bc-tien-do-nhap-gao-theo-goi-thau.component.scss']
})
export class BcTienDoNhapGaoTheoGoiThauComponent extends Base2Component implements OnInit {
  pdfSrc: any;
  excelSrc: any;
  pdfBlob: any;
  excelBlob: any;
  nameFile: any;

  constructor(httpClient: HttpClient,
              storageService: StorageService,
              notification: NzNotificationService,
              spinner: NgxSpinnerService,
              modal: NzModalService,
              private bcCLuongHangDTQGService: BcCLuongHangDTQGService,
              public userService: UserService,
              private donViService: DonviService,
              private danhMucSv: DanhMucService,
              public globals: Globals) {
    super(httpClient, storageService, notification, spinner, modal, bcCLuongHangDTQGService);
    this.formData = this.fb.group(
      {
        nam: [dayjs().get("year"), [Validators.required]],
      }
    );
  }

  async ngOnInit() {
    await this.spinner.show();
    try {
    } catch (e) {
      console.log("error: ", e);
      await this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
    await this.spinner.hide();
  }
  downloadPdf() {
    saveAs(this.pdfBlob, this.nameFile + ".pdf");
  }

  async downloadExcel() {
    try {
      this.spinner.show();
      let body = this.formData.value;
      body.typeFile = "xlsx";
      body.trangThai = "01";
      body.maDonVi = !body.maChiCuc ? (!body.maCuc ? null : body.maCuc) : body.maChiCuc
      await this.bcCLuongHangDTQGService.bcclNhapHangDtqg(body).then(async s => {
        this.excelBlob = s;
        this.excelSrc = await new Response(s).arrayBuffer();
        saveAs(this.excelBlob, this.nameFile + ".xlsx");
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
    this.formData.controls["maCuc"].clearValidators();
    if (this.formData.value.loaiBc == '02') {
      this.formData.controls["maCuc"].setValidators(Validators.required);
    }
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      this.spinner.hide();
      return;
    }
    try {
      this.spinner.show();
      let body = this.formData.value;
      body.maDonVi = !body.maChiCuc ? (!body.maCuc ? null : body.maCuc) : body.maChiCuc
      body.typeFile = "pdf";
      await this.bcCLuongHangDTQGService.bcclNhapHangDtqg(body).then(async s => {
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


}
