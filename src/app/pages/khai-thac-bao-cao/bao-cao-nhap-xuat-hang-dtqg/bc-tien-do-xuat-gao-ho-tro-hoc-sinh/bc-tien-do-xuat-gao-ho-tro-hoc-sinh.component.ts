import { Component, OnInit } from '@angular/core';
import { Base2Component } from '../../../../components/base2/base2.component';
import { HttpClient } from '@angular/common/http';
import { StorageService } from '../../../../services/storage.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { NzModalService } from 'ng-zorro-antd/modal';
import { BcNhapXuatMuaBanHangDTQGService } from '../../../../services/bao-cao/BcNhapXuatMuaBanHangDTQG.service';
import { UserService } from '../../../../services/user.service';
import { MangLuoiKhoService } from '../../../../services/qlnv-kho/mangLuoiKho.service';
import { Globals } from '../../../../shared/globals';
import * as dayjs from 'dayjs';
import {saveAs} from "file-saver";
import { Validators } from '@angular/forms';
import { MESSAGE } from '../../../../constants/message';
import * as moment from 'moment/moment';
import { DanhMucDungChungService } from '../../../../services/danh-muc-dung-chung.service';

@Component({
  selector: 'app-bc-tien-do-xuat-gao-ho-tro-hoc-sinh',
  templateUrl: './bc-tien-do-xuat-gao-ho-tro-hoc-sinh.component.html',
  styleUrls: ['./bc-tien-do-xuat-gao-ho-tro-hoc-sinh.component.scss']
})
export class BcTienDoXuatGaoHoTroHocSinhComponent extends Base2Component implements OnInit {
  pdfSrc: any;
  excelSrc: any;
  pdfBlob: any;
  excelBlob: any;
  nameFile = "bc-tien-do-xuat-gao-ho-tro-hoc-sinh";
  listKyHoTro : any[];

  constructor(httpClient: HttpClient,
              storageService: StorageService,
              notification: NzNotificationService,
              spinner: NgxSpinnerService,
              modal: NzModalService,
              private bcNhapXuatMuaBanHangDTQGService: BcNhapXuatMuaBanHangDTQGService,
              public userService: UserService,
              private danhMucService: DanhMucDungChungService,
              public globals: Globals) {
    super(httpClient, storageService, notification, spinner, modal, bcNhapXuatMuaBanHangDTQGService);
    this.formData = this.fb.group(
      {
        kyHoTro : [ null,[Validators.required]],
        ngayBaoCao: [dayjs().format("YYYY-MM-DD"), [Validators.required]],
      }
    );
  }

  async ngOnInit() {
    this.spinner.show();
    try {
      this.getListKyHoTro();
    } catch (e) {
      console.log("error: ", e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
    this.spinner.hide();
  }
  downloadPdf() {
    saveAs(this.pdfBlob, this.nameFile + ".pdf");
  }

  async  getListKyHoTro (){
    this.listKyHoTro = [];
    let res = await this.danhMucService.danhMucChungGetAll("MUC_DICH_CT_VT");
    if (res.msg == MESSAGE.SUCCESS) {
      this.listKyHoTro = res.data.filter(x => x.phanLoai == '1');
      console.log(this.listKyHoTro,'aaaaaaaaaaaaaaaaaa');
    }
  }

  async downloadExcel() {
    try {
      this.spinner.show();
      let body = this.formData.value;
      body.typeFile = "xlsx";
      body.nam = body.ngayBaoCao.getFullYear();
      body.ngayBatDauQuy = moment(body.ngayBaoCao).format('DD/MM/YYYY');
      await this.bcNhapXuatMuaBanHangDTQGService.bcTienDoXuatGaoHoTroHocSinh(body).then(async s => {
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
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      this.spinner.hide();
      return;
    }
    try {
      this.spinner.show();
      let body = this.formData.value;
      body.nam = body.ngayBaoCao.getFullYear();
      body.ngayBatDauQuy = moment(body.ngayBaoCao).format('DD/MM/YYYY');
      body.typeFile = "pdf";
      await this.bcNhapXuatMuaBanHangDTQGService.bcTienDoXuatGaoHoTroHocSinh(body).then(async s => {
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
