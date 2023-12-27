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
@Component({
  selector: 'app-thong-tin-dau-thau-mua-vt',
  templateUrl: './thong-tin-dau-thau-mua-vt.component.html',
  styleUrls: ['./thong-tin-dau-thau-mua-vt.component.scss']
})
export class ThongTinDauThauMuaVtComponent extends Base2Component implements OnInit {
  excelBlob: any;
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
        nam: [dayjs().get("year"), [Validators.required]],
      }
    );
  }

  ngOnInit(): void {
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
      // if (this.formData.value.thoiGianSx) {
      //   this.formData.value.thoiGianSxTu = dayjs(this.formData.value.thoiGianSx[0]).format("YYYY-MM-DD");
      //   this.formData.value.thoiGianSxDen = dayjs(this.formData.value.thoiGianSx[1]).format("YYYY-MM-DD");
      // }
      let body = this.formData.value;
      body.typeFile = "pdf";
      body.fileName = "bc_thong_tin_dau_thau_mua_vt.jrxml";
      body.tenBaoCao = "Thông tin đấu thầu mua vật tư thiết bị";
      body.trangThai = "01";
      await this.bcNhapXuatMuaBanHangDTQGService.bcThongTinDthauMuaVt(body).then(async s => {
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
      body.fileName = "bc_thong_tin_dau_thau_mua_vt.jrxml";
      body.tenBaoCao = "Thông tin đấu thầu mua vật tư thiết bị";
      body.trangThai = "01";
      await this.bcNhapXuatMuaBanHangDTQGService.bcThongTinDthauMuaVt(body).then(async s => {
        this.excelBlob = s;
        saveAs(this.excelBlob, "bc_thong_tin_dau_thau_mua_vt.xlsx");
      });
    } catch (e) {
      console.log(e);
    } finally {
      this.spinner.hide();
    }
  }

  downloadPdf() {
    saveAs(this.pdfBlob, "bc_thong_tin_dau_thau_mua_vt.pdf");
  }

}
