import { Component, OnInit } from "@angular/core";
import { BcBnTt130Service } from "../../../../services/bao-cao/BcBnTt130.service";
import { HttpClient } from "@angular/common/http";
import { StorageService } from "../../../../services/storage.service";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NgxSpinnerService } from "ngx-spinner";
import { NzModalService } from "ng-zorro-antd/modal";
import { UserService } from "../../../../services/user.service";
import * as dayjs from "dayjs";
import { Validators } from "@angular/forms";
import { Base2Component } from "../../../../components/base2/base2.component";
import { MESSAGE } from "../../../../constants/message";
import { saveAs } from "file-saver";

@Component({
  selector: "app-nguon-hinh-thanh-dtqg",
  templateUrl: "./nguon-hinh-thanh-dtqg.component.html",
  styleUrls: ["./nguon-hinh-thanh-dtqg.component.scss"]
})
export class NguonHinhThanhDtqgComponent extends Base2Component implements OnInit {
  listQuy: any[] = [
    {text: 'Quý I', value: 1},
    {text: 'Quý II', value: 2},
    {text: 'Quý III', value: 3},
    {text: 'Quý IV', value: 4},
  ]
  selectedId: number = 0;
  isView: boolean = false;
  pdfSrc: any;
  excelSrc: any;
  pdfBlob: any;
  excelBlob: any;

  constructor(httpClient: HttpClient,
              storageService: StorageService,
              notification: NzNotificationService,
              spinner: NgxSpinnerService,
              modal: NzModalService,
              private bcBnTt108Service: BcBnTt130Service,
              public userService: UserService,) {
    super(httpClient, storageService, notification, spinner, modal, bcBnTt108Service);
    this.formData = this.fb.group(
      {
        nam: [dayjs().get("year"), [Validators.required]],
        quy: [null],
        tuNgayTao: [null],
        tuNgayKyGui: [null],
        denNgayTao: [null],
        denNgayKyGui: [null],
        bieuSo: ["001.H/BCDTQG-BN"],
      }
    );
  }

  tuNgayTao: Date | null = null;
  tuNgayKyGui: Date | null = null;
  denNgayTao: Date | null = null;
  denNgayKyGui: Date | null = null;
  disabledTuNgayTao = (startValue: Date): boolean => {
    if (!startValue || !this.denNgayTao) {
      return false;
    }
    return startValue.getTime() > this.denNgayTao.getTime();
  };

  disabledDenNgayTao = (endValue: Date): boolean => {
    if (!endValue || !this.tuNgayTao) {
      return false;
    }
    return endValue.getTime() <= this.tuNgayTao.getTime();
  };
  disabledTuNgayKyGui = (startValue: Date): boolean => {
    if (!startValue || !this.denNgayKyGui) {
      return false;
    }
    return startValue.getTime() > this.denNgayKyGui.getTime();
  };

  disabledDenNgayKyGui = (endValue: Date): boolean => {
    if (!endValue || !this.tuNgayKyGui) {
      return false;
    }
    return endValue.getTime() <= this.tuNgayKyGui.getTime();
  };

  ngOnInit(): void {
    this.search();
  }

  async search() {
    this.spinner.show();
    this.formData.patchValue({
      tuNgayTao: this.tuNgayTao != null ? dayjs(this.tuNgayTao).format('YYYY-MM-DD') + " 00:00:00" : null,
      tuNgayKyGui: this.tuNgayKyGui != null ? dayjs(this.tuNgayKyGui).format('YYYY-MM-DD') + " 00:00:00" : null,
      denNgayTao: this.denNgayTao != null ? dayjs(this.denNgayTao).format('YYYY-MM-DD') + " 23:59:59" : null,
      denNgayKyGui: this.denNgayKyGui != null ? dayjs(this.denNgayKyGui).format('YYYY-MM-DD') + " 23:59:59" : null,
    })
    let body = this.formData.value;
    body.paggingReq = {
      limit: this.pageSize,
      page: this.page - 1
    }
    let res = await this.bcBnTt108Service.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.dataTable = data.content;
      this.totalRecord = data.totalElements;
    } else {
      this.dataTable = [];
      this.totalRecord = 0;
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    this.spinner.hide();
  }

  async clearFilter() {
    this.formData.get('nam').setValue(dayjs().get("year"));
    this.formData.get('quy').setValue(null);
    this.formData.get('tuNgayTao').setValue(null);
    this.formData.get('tuNgayKyGui').setValue(null);
    this.formData.get('denNgayTao').setValue(null);
    this.formData.get('denNgayKyGui').setValue(null);
    this.tuNgayTao = null;
    this.tuNgayKyGui = null;
    this.denNgayTao = null;
    this.denNgayKyGui = null;
  }

  redirectDetail(isView, data?) {
    this.selectedId = data?.id;
    this.isDetail = true;
    if (isView != null) {
      this.isView = isView;
    }
  }
  async download(id: any, type: any) {
    if (type == 'pdf') {
      await this.downloadPdf(id)
    } else {
      await this.downloadExcel(id)
    }
  }

  async downloadExcel(id: any) {
    try {
      this.spinner.show();
      let body = this.formData.value;
      body.idHdr = id;
      body.typeFile = "xlsx";
      body.fileName = "bcbn_nguon_hinh_thanh_dtqg.jrxml";
      body.tenBaoCao = "Báo cáo nguồn hình thành DTQG";
      body.trangThai = "01";
      await this.bcBnTt108Service.ketXuat(body).then(async s => {
        this.excelBlob = s;
        this.excelSrc = await new Response(s).arrayBuffer();
        saveAs(this.excelBlob, "bcbn_nguon_hinh_thanh_dtqg.xlsx");
      });
    } catch (e) {
      console.log(e);
    } finally {
      this.spinner.hide();
    }

  }

  async downloadPdf(id: any) {
    try {
      this.spinner.show();
      let body = this.formData.value;
      body.id = id;
      body.typeFile = "pdf";
      body.fileName = "bcbn_nguon_hinh_thanh_dtqg.jrxml";
      body.tenBaoCao = "Báo cáo nguồn hình thành DTQG";
      body.trangThai = "01";
      await this.bcBnTt108Service.ketXuat(body).then(async s => {
        this.pdfBlob = s;
        this.pdfSrc = await new Response(s).arrayBuffer();
      });
      saveAs(this.pdfBlob, "bcbn_nguon_hinh_thanh_dtqg.pdf");
    } catch (e) {
      console.log(e);
    } finally {
      this.spinner.hide();
    }
  }
}
