import { Component, OnInit } from '@angular/core';
import { Base2Component } from '../../../../components/base2/base2.component';
import { HttpClient } from '@angular/common/http';
import { StorageService } from '../../../../services/storage.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { NzModalService } from 'ng-zorro-antd/modal';
import { BcNhapXuatMuaBanHangDTQGService } from '../../../../services/bao-cao/BcNhapXuatMuaBanHangDTQG.service';
import { UserService } from '../../../../services/user.service';
import { DonviService } from '../../../../services/donvi.service';
import {saveAs} from "file-saver";
import { DanhMucService } from '../../../../services/danhmuc.service';
import { Globals } from '../../../../shared/globals';
import * as dayjs from 'dayjs';
import { Validators } from '@angular/forms';
import { MESSAGE } from '../../../../constants/message';

@Component({
  selector: 'app-bao-cao-ban-thoc-thuoc-ke-hoach-nam',
  templateUrl: './bao-cao-ban-thoc-thuoc-ke-hoach-nam.component.html',
  styleUrls: ['./bao-cao-ban-thoc-thuoc-ke-hoach-nam.component.scss']
})
export class BaoCaoBanThocThuocKeHoachNamComponent  extends Base2Component implements OnInit {
  pdfSrc: any;
  excelSrc: any;
  pdfBlob: any;
  excelBlob: any;
  nameFile = "bao-cao-tien-do-nhap-gao-theo-goi-thau";

  constructor(httpClient: HttpClient,
              storageService: StorageService,
              notification: NzNotificationService,
              spinner: NgxSpinnerService,
              modal: NzModalService,
              private bcNhapXuatMuaBanHangDTQGService: BcNhapXuatMuaBanHangDTQGService,
              public userService: UserService,
              private donViService: DonviService,
              private danhMucSv: DanhMucService,
              public globals: Globals) {
    super(httpClient, storageService, notification, spinner, modal, bcNhapXuatMuaBanHangDTQGService);
    this.formData = this.fb.group(
      {
        namKh: [dayjs().get("year"), [Validators.required]],
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
    console.log(this.userInfo.DON_VI,'aaaaaaaaaaaa');
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
      body.fileName = this.nameFile;
      await this.bcNhapXuatMuaBanHangDTQGService.bcBanThocThuocKeHoachNam(body).then(async s => {
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
    // this.formData.controls["maCuc"].clearValidators();
    // if (this.formData.value.loaiBc == '02') {
    //   this.formData.controls["maCuc"].setValidators(Validators.required);
    // }
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      this.spinner.hide();
      return;
    }
    try {
      this.spinner.show();
      let body = this.formData.value;
      // body.maDonVi = !body.maChiCuc ? (!body.maCuc ? null : body.maCuc) : body.maChiCuc
      body.typeFile = "pdf";
      await this.bcNhapXuatMuaBanHangDTQGService.bcBanThocThuocKeHoachNam(body).then(async s => {
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

  async clearFilter() {
    this.formData.reset();
    this.formData.patchValue({
      nam: dayjs().get('year')
    })
  }

}
