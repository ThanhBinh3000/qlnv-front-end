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
import { ThongTu1082018Service } from 'src/app/services/bao-cao/ThongTu1082018.service';

@Component({
  selector: 'app-ct-nhap-xuat-ton-kho-hang-dtqg-tt-108',
  templateUrl: './ct-nhap-xuat-ton-kho-hang-dtqg-tt-108.component.html',
  styleUrls: ['./ct-nhap-xuat-ton-kho-hang-dtqg-tt-108.component.scss']
})
export class CtNhapXuatTonKhoHangDtqgTt108Component extends Base2Component implements OnInit {
  pdfSrc: any;
  pdfBlob: any;
  showDlgPreview = false;
  listNam: any[] = [];
  listChiCuc: any[] = [];
  dsDonVi: any;
  maChiCuc: any;
  maCuc: any;
  listQuy: any[] = [
    { id: 1, giaTri: 'Quý 1' },
    { id: 2, giaTri: 'Quý 2' },
    { id: 3, giaTri: 'Quý 3' },
    { id: 4, giaTri: 'Quý 4' }
  ];
  listLoaiBc: any[] = [
    {
      text: "Báo cáo năm",
      value: 1,
    },
    { text: "Báo cáo quý",
      value: 2,
    }
  ];
  constructor(httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private thongTu1082018Service: ThongTu1082018Service,
    public userService: UserService,
    private donViService: DonviService,
    public globals: Globals) {
    super(httpClient, storageService, notification, spinner, modal, thongTu1082018Service);
    this.formData = this.fb.group(
      {
        nam: [dayjs().get("year"), [Validators.required]],
        loaiBaoCao: null,
        kyBc: null,
        listMaCuc: null,
        listMaChiCuc: null,
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
      this.initListQuy()
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
    saveAs(this.pdfBlob, "bc_ct_nhap_xuat_ton_kho_hang_dtqg_108.pdf");
  }

  closeDlg() {
    this.showDlgPreview = false;
  }

  async preView() {
    try {
      this.spinner.show();
      let body = this.formData.value;
      body.typeFile = "pdf";
      body.fileName = "bc_ct_nhap_xuat_ton_kho_hang_dtqg_108.jrxml";
      body.tenBaoCao = "Báo cáo chi tiết nhập xuất tồn kho hàng DTQG";
      body.trangThai = "01";
      if (this.userService.isTongCuc) {
        body.maDvi = this.maChiCuc ? this.maChiCuc : this.maCuc;
      } else if (this.userService.isCuc) {
        body.maDvi = this.maChiCuc;
      } else {
        body.maDvi = null;
      }
      if (body.kyBc) {
        if (body.kyBc == 1) {
          body.tuNgay = '1/1/' + body.nam
          body.denNgay = '31/3/' + body.nam
        } else if (body.kyBc == 2) {
          body.tuNgay = '1/4/' + body.nam
          body.denNgay = '30/6/' + body.nam
        } else if (body.kyBc == 3) {
          body.tuNgay = '1/7/' + body.nam
          body.denNgay = '30/9/' + body.nam
        } else if (body.kyBc == 4) {
          body.tuNgay = '1/10/' + body.nam
          body.denNgay = '31/12/' + body.nam
        }
      }
      await this.thongTu1082018Service.bcCtNhapXuatTonKhoHangDTQG(body).then(async s => {
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
    let body = {
      trangThai: "01",
      maDviCha: this.userInfo.MA_DVI,
      type: "DV"
    };
    let res = await this.donViService.getDonViTheoMaCha(body);
    if (res.msg == MESSAGE.SUCCESS) {
      if (this.userService.isTongCuc()) {
        this.dsDonVi = res.data;
      } else if (this.userService.isCuc()) {
        this.listChiCuc = res.data;
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }
  clearFilter() {
    this.formData.patchValue({
      nam: dayjs().get("year"),
      quy: null
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

  initListQuy() {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const quarters = [];

    for (let quarter = 1; quarter <= 4; quarter++) {
      if (this.formData.get('nam').value < currentYear || (this.formData.get('nam').value === currentYear && quarter <= Math.ceil((currentMonth + 1) / 3))) {
        quarters.push(quarter);
      }
    }
    this.listQuy = [];
    for (const element of quarters) {
      this.listQuy.push({ giaTri: "Quý " + element + "/" + this.formData.get("nam").value, ma: element})
    }
  }

  changeKyBc (event){
    if (this.formData.get("kyBc").value != null) {
      this.formData.get("loaiBaoCao").setValue(2)
    }
  }
  changeNam (event){
    this.formData.patchValue({
      kyBc: null,
    })
    this.initListQuy();
  }
}
