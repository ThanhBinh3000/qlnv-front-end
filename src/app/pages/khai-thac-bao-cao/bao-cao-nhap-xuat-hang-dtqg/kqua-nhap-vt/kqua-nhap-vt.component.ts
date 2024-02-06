import { Component, OnInit } from '@angular/core';
import {Base2Component} from "../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {BcNhapXuatMuaBanHangDTQGService} from "../../../../services/bao-cao/BcNhapXuatMuaBanHangDTQG.service";
import {UserService} from "../../../../services/user.service";
import {Globals} from "../../../../shared/globals";
import * as dayjs from "dayjs";
import {Validators} from "@angular/forms";
import {saveAs} from "file-saver";
import {MESSAGE} from "../../../../constants/message";
@Component({
  selector: 'app-kqua-nhap-vt',
  templateUrl: './kqua-nhap-vt.component.html',
  styleUrls: ['./kqua-nhap-vt.component.scss']
})
export class KquaNhapVtComponent extends Base2Component implements OnInit {
  excelBlob: any;
  listNam: any[] = [];
  constructor(httpClient: HttpClient,
              storageService: StorageService,
              notification: NzNotificationService,
              spinner: NgxSpinnerService,
              modal: NzModalService,
              private bcNhapXuatMuaBanHangDTQGService: BcNhapXuatMuaBanHangDTQGService,
              public userService: UserService,
              public globals: Globals) {
    super(httpClient, storageService, notification, spinner, modal, bcNhapXuatMuaBanHangDTQGService);
    this.formData = this.fb.group(
      {
        listNam: [, [Validators.required]],
      }
    );
  }

  async ngOnInit() {
    await this.spinner.show();
    try {
      for (let i = 0; i < 15; i++) {
        this.listNam.push({
          value: dayjs().get('year') - i,
          text: dayjs().get('year') - i,
        });
      }
      const listNamHt =[];
      for (let i = 2; i >= 0; i--) {
        listNamHt.push({
          value: dayjs().get('year') - i,
          text: dayjs().get('year') - i,
        });
      }
      console.log(listNamHt,"listNamHt")
      this.formData.patchValue({
        listNam: listNamHt.map(item => item.value)
      });
    } catch (e) {
      console.log("error: ", e);
      await this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
    await this.spinner.hide();
  }

  async clearFilter() {
    this.formData.reset();
    this.formData.patchValue({
      nam: dayjs().get('year')
    })
  }

  async preView() {
    try {
      this.spinner.show();
      let body = this.formData.value;
      body.typeFile = "pdf";
      body.fileName = "kqua-nhap-vt.jrxml";
      body.tenBaoCao = "Kết quả nhập vật tư, thiết bị";
      body.trangThai = "01";
      body.loaiVthh = "02";
      await this.bcNhapXuatMuaBanHangDTQGService.kquaNhapVt(body).then(async s => {
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
      // this.setListCondition();
      let body = this.formData.value;
      body.typeFile = "xlsx";
      body.fileName = "kqua-nhap-vt.jrxml";
      body.tenBaoCao = "Kết quả nhập vật tư, thiết bị";
      body.trangThai = "01";
      await this.bcNhapXuatMuaBanHangDTQGService.kquaNhapVt(body).then(async s => {
        this.excelBlob = s;
        saveAs(this.excelBlob, "kqua-nhap-vt.xlsx");
      });
    } catch (e) {
      console.log(e);
    } finally {
      this.spinner.hide();
    }
  }

  downloadPdf() {
    saveAs(this.pdfBlob, "kqua-nhap-vt.pdf");
  }
}
