import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {StorageService} from "src/app/services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {BcNhapXuatMuaBanHangDTQGService} from "src/app/services/bao-cao/BcNhapXuatMuaBanHangDTQG.service";
import {UserService} from "src/app/services/user.service";
import {DonviService} from "src/app/services/donvi.service";
import {DanhMucService} from "src/app/services/danhmuc.service";
import {Globals} from "src/app/shared/globals";
import * as dayjs from "dayjs";
import {saveAs} from "file-saver";
import {Validators} from "@angular/forms";
import {MESSAGE} from "src/app/constants/message";
import {Base2Component} from "src/app/components/base2/base2.component";

@Component({
  selector: 'app-tong-hop-ton-kho-vat-tu',
  templateUrl: './tong-hop-ton-kho-vat-tu.component.html',
  styleUrls: ['./tong-hop-ton-kho-vat-tu.component.scss']
})
export class TongHopTonKhoVatTuComponent extends Base2Component implements OnInit {
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
        ngayBatDau: '',
        ngayKetThuc: '',
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
    saveAs(this.pdfBlob, "14-tong-hop-ton-kho-vat-tu.pdf");
  }

  async downloadExcel() {
    try {
      this.spinner.show();
      let body = this.formData.value;
      body.typeFile = "xlsx";
      body.fileName = "14.Bảng tổng hợp tồn kho vật tư, thiết bị.jrxml";
      body.tenBaoCao = "Tổng hợp tồn kho vật tư";
      body.maDonVi = !body.maChiCuc ? (!body.maCuc ? null : body.maCuc) : body.maChiCuc
      await this.bcNhapXuatMuaBanHangDTQGService.tongHopTonKhoVatTu(body).then(async s => {
        this.excelBlob = s;
        this.excelSrc = await new Response(s).arrayBuffer();
        saveAs(this.excelBlob, "14-tong-hop-ton-kho-vat-tu.xlsx");
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
