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
import { BcNhapXuatMuaBanHangDTQGService } from '../../../../services/bao-cao/BcNhapXuatMuaBanHangDTQG.service';

@Component({
  selector: 'app-bao-cao-nhap-xuat-ton',
  templateUrl: './bao-cao-nhap-xuat-ton.component.html',
  styleUrls: ['./bao-cao-nhap-xuat-ton.component.scss']
})
export class BaoCaoNhapXuatTonComponent extends Base2Component implements OnInit {
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
              private bcNhapXuatMuaBanHangDTQGService: BcNhapXuatMuaBanHangDTQGService,
              public userService: UserService,
              private donViService: DonviService,
              private danhMucSv: DanhMucService,
              public globals: Globals) {
    super(httpClient, storageService, notification, spinner, modal, bcNhapXuatMuaBanHangDTQGService);
    this.formData = this.fb.group(
      {
        nam: [dayjs().get("year"), [Validators.required]],
        ngayBatDau:  [dayjs().startOf('year').format('YYYY-MM-DD')],
        ngayKetThuc: [dayjs().format('YYYY-MM-DD')],
      }
    );
  }
  disabledStartNgay = (startValue: Date): boolean => {
    if (startValue && this.formData.value.ngayKetThuc) {
      return startValue.getTime() > this.formData.value.ngayKetThuc.getTime();
    }
    return false;
  };

  disabledEndNgay = (endValue: Date): boolean => {
    if (!endValue || !this.formData.value.ngayBatDau) {
      return false;
    }
    return endValue.getTime() <= this.formData.value.ngayBatDau.getTime();
  };


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
    saveAs(this.pdfBlob, "bao-cao-nhap-xuat-ton.pdf");
  }

  async downloadExcel() {
    try {
      this.spinner.show();
      let body = this.formData.value;
      body.typeFile = "xlsx";
      body.fileName = "1.nhap_xuat_ton_thoc_gao_muoi.jrxml";
      body.tenBaoCao = "Báo cáo nhập xuất tồn thóc, gạo, muối";
      // body.trangThai = "01";
      body.maDonVi = !body.maChiCuc ? (!body.maCuc ? null : body.maCuc) : body.maChiCuc
      await this.bcNhapXuatMuaBanHangDTQGService.baoCaoNhapXuatTon(body).then(async s => {
        this.excelBlob = s;
        this.excelSrc = await new Response(s).arrayBuffer();
        saveAs(this.excelBlob,"1.nhap_xuat_ton_thoc_gao_muoi.xlsx");
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
      body.maDonVi = !body.maChiCuc ? (!body.maCuc ? null : body.maCuc) : body.maChiCuc
      body.typeFile = "pdf";
      await this.bcNhapXuatMuaBanHangDTQGService.baoCaoNhapXuatTon(body).then(async s => {
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
