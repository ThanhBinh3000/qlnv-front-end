import {Component, OnInit} from '@angular/core';
import {Base2Component} from "../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {BcCLuongHangDTQGService} from "../../../../services/bao-cao/BcCLuongHangDTQG.service";
import {UserService} from "../../../../services/user.service";
import {DonviService} from "../../../../services/donvi.service";
import {Globals} from "../../../../shared/globals";
import {Validators} from "@angular/forms";
import {saveAs} from "file-saver";
import printJS from "print-js";

@Component({
  selector: 'app-bc-cong-tac-dinhmuc-ktkt',
  templateUrl: './bc-cong-tac-dinhmuc-ktkt.component.html',
  styleUrls: ['./bc-cong-tac-dinhmuc-ktkt.component.scss']
})
export class BcCongTacDinhmucKtktComponent extends Base2Component implements OnInit {
  dsDonVi: any[] = [];
  pdfSrc: any;
  excelSrc: any;
  pdfBlob: any;
  excelBlob: any;
  selectedVthhCache: any;
  selectedCloaiVthhCache: any;
  showDlgPreview = false;

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
        maCuc: [null, [Validators.required]],
      }
    );
  }

  ngOnInit(): void {
    this.loadDsDonVi()
  }

  async downloadExcel() {
    try {
      this.spinner.show();
      let body = this.formData.value;
      body.typeFile = "xlsx";
      body.fileName = "bc_congtac_qly_ktkt.jrxml";
      body.tenBaoCao = "Báo cáo công tác quản lý định mức ktkt";
      body.trangThai = "01";
      await this.bcCLuongHangDTQGService.bcCongTacKtkt(body).then(async s => {
        this.excelBlob = s;
        this.excelSrc = await new Response(s).arrayBuffer();
        saveAs(this.excelBlob, "bccl_cong_tac_bao_quan_gao.xlsx");
      });
      this.showDlgPreview = true;
    } catch (e) {
      console.log(e);
    } finally {
      this.spinner.hide();
    }
  }

  async previewBc() {
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      this.spinner.hide();
      return;
    }
    try {
      this.spinner.show();
      let body = this.formData.value;
      body.typeFile = "pdf";
      body.fileName = "bc_congtac_qly_ktkt.jrxml";
      body.tenBaoCao = "Báo cáo công tác quản lý định mức ktkt";
      body.trangThai = "01";
      await this.bcCLuongHangDTQGService.bcCongTacKtkt(body).then(async s => {
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

  downloadPdf() {
    saveAs(this.pdfBlob, "bc_congtac_dinhmuc_ktkt.pdf");
  }


  async loadDsDonVi() {
    let res = await this.donViService.layTatCaDonViByLevel(2);
    if (res && res.data) {
      this.dsDonVi = res.data
      this.dsDonVi = this.dsDonVi.filter(item => item.type != "PB" && item.maDvi.startsWith(this.userInfo.MA_DVI))
    }
  }

  doPrint() {
    printJS({ printable: this.printSrc, type: 'pdf', base64: true })
  }
}
