import { Component, OnInit } from "@angular/core";
import { BcBnTt108Service } from "../../../../services/bao-cao/BcBnTt108.service";
import { HttpClient } from "@angular/common/http";
import { StorageService } from "../../../../services/storage.service";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NgxSpinnerService } from "ngx-spinner";
import { NzModalService } from "ng-zorro-antd/modal";
import { BcCLuongHangDTQGService } from "../../../../services/bao-cao/BcCLuongHangDTQG.service";
import { UserService } from "../../../../services/user.service";
import { DonviService } from "../../../../services/donvi.service";
import { Globals } from "../../../../shared/globals";
import * as dayjs from "dayjs";
import { Validators } from "@angular/forms";
import { Base2Component } from "../../../../components/base2/base2.component";
import { BcBnTt145Service } from "src/app/services/bao-cao/BcBnTt145.service";
import { MESSAGE } from "src/app/constants/message";
import { saveAs } from "file-saver";

@Component({
  selector: "app-luan-phien-doi-hang-dtqg",
  templateUrl: "./luan-phien-doi-hang-dtqg.component.html",
  styleUrls: ["./luan-phien-doi-hang-dtqg.component.scss"]
})
export class LuanPhienDoiHangDtqgComponent extends Base2Component implements OnInit {
  isView: boolean = true
  tGianTaoTuNgay: Date | null = null;
  tGianTaoDenNgay: Date | null = null;
  tGianBanHanhTuNgay: Date | null = null;
  tGianBanHanhDenNgay: Date | null = null;
  showDlgPreview = false;
  pdfSrc: any;
  excelSrc: any;
  pdfBlob: any;
  excelBlob: any;
  BIEU_SO = "PL04";
  listQuy: any[] = [
    { text: 'Quý I', value: 1 },
    { text: 'Quý II', value: 2 },
    { text: 'Quý III', value: 3 },
    { text: 'Quý IV', value: 4 },
  ]

  constructor(httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private bcBnTt145Service: BcBnTt145Service,
    public userService: UserService,) {
    super(httpClient, storageService, notification, spinner, modal, bcBnTt145Service);
    this.formData = this.fb.group(
      {
        nam: [dayjs().get("year"), [Validators.required]],
        quy: [null],
        tuNgayTao: [null],
        tuNgayKyGui: [null],
        denNgayTao: [null],
        denNgayKyGui: [null],
      }
    );
  }


  disabledTuNgayTao = (startValue: Date): boolean => {
    if (!startValue || !this.tGianTaoTuNgay) {
      return false;
    }
    return startValue.getTime() > this.tGianTaoTuNgay.getTime();
  };

  disabledDenNgayTao = (endValue: Date): boolean => {
    if (!endValue || !this.tGianTaoDenNgay) {
      return false;
    }
    return endValue.getTime() <= this.tGianTaoDenNgay.getTime();
  };
  disabledTuNgayKyGui = (startValue: Date): boolean => {
    if (!startValue || !this.tGianBanHanhDenNgay) {
      return false;
    }
    return startValue.getTime() > this.tGianBanHanhDenNgay.getTime();
  };

  disabledDenNgayKyGui = (endValue: Date): boolean => {
    if (!endValue || !this.tGianBanHanhTuNgay) {
      return false;
    }
    return endValue.getTime() <= this.tGianBanHanhTuNgay.getTime();
  };

  async ngOnInit() {
    await this.search()
  }

  async clearFilter() {
    this.formData.get('nam').setValue(dayjs().get("year"));
    this.tGianTaoTuNgay = null;
    this.tGianTaoDenNgay = null;
    this.tGianBanHanhTuNgay = null;
    this.tGianBanHanhDenNgay = null;
    await this.search();
  }

  async goDetail(id: number, isView?: boolean) {
    // if(roles != 'NHDTQG_PTDT_KHLCNT_TONGHOP_XEM'){
    //   if (!this.checkPermission(roles)) {
    //     return
    //   }
    console.log(isView)
    this.idSelected = id;
    this.isDetail = true;
    this.isView = isView
    // }else{
    //   // await this.detail(id, roles);
    //   this.idSelected = id;
    //   this.isDetail = true;
    //   this.isView = true
    // }
  }

  async search() {
    this.spinner.show();
    let body = {
      nam: this.formData.get('nam').value,
      bieuSo: this.BIEU_SO,
      tGianTaoTuNgay: this.tGianTaoTuNgay != null ? dayjs(this.tGianTaoTuNgay).format('YYYY-MM-DD') : null,
      tGianTaoDenNgay: this.tGianTaoDenNgay != null ? dayjs(this.tGianTaoDenNgay).format('YYYY-MM-DD') : null,
      tGianBanHanhTuNgay: this.tGianBanHanhTuNgay != null ? dayjs(this.tGianBanHanhTuNgay).format('YYYY-MM-DD') : null,
      tGianBanHanhDenNgay: this.tGianBanHanhDenNgay != null ? dayjs(this.tGianBanHanhDenNgay).format('YYYY-MM-DD') : null,
      maDvi: null,
      paggingReq: {
        limit: this.pageSize,
        page: this.page - 1,
      },
    };
    if (this.userService.isCuc()) {
      body.maDvi = this.userInfo.MA_DVI
    }
    let res = await this.bcBnTt145Service.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.dataTable = data.content;
      console.log(this.dataTable)
      this.totalRecord = data.totalElements;
    } else {
      this.dataTable = [];
      this.totalRecord = 0;
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    this.spinner.hide();
  }

  themMoi() {
    this.isDetail = true;
    this.idSelected = null;
    this.isView = false;
  }

  showList() {
    this.isDetail = false;
    this.search()
  }

  xoaItem(item: any) {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn xóa?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: () => {
        this.spinner.show();
        try {
          let body = {
            "id": item.id,
            "maDvi": ""
          }
          this.bcBnTt145Service.delete(body).then(async () => {
            await this.search();
            this.spinner.hide();
          });
        }
        catch (e) {
          console.log('error: ', e)
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      },
    });
  }


  downloadPdf() {
    saveAs(this.pdfBlob, "bcbn_kh_luan_phien_doi_hang_dtqg.pdf");
  }

  async download(id: any, type: any) {
    if (type == 'pdf') {
      await this.preView(id)
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
      body.fileName = "bcbn_kh_luan_phien_doi_hang_dtqg.jrxml";
      body.tenBaoCao = "Báo cáo KH luân phiên đổi hàng DTQG";
      body.trangThai = "01";
      await this.bcBnTt145Service.ketXuat(body).then(async s => {
        this.excelBlob = s;
        this.excelSrc = await new Response(s).arrayBuffer();
        saveAs(this.excelBlob, "bcbn_kh_luan_phien_doi_hang_dtqg.xlsx");
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

  async preView(id: any) {
    try {
      this.spinner.show();
      let body = this.formData.value;
      body.idHdr = id;
      body.typeFile = "pdf";
      body.fileName = "bcbn_kh_luan_phien_doi_hang_dtqg.jrxml";
      body.tenBaoCao = "Báo cáo KH luân phiên đổi hàng DTQG";
      body.trangThai = "01";
      await this.bcBnTt145Service.ketXuat(body).then(async s => {
        this.pdfBlob = s;
        this.pdfSrc = await new Response(s).arrayBuffer();
      });
      saveAs(this.pdfBlob, "bcbn_kh_luan_phien_doi_hang_dtqg.pdf");
      this.showDlgPreview = false;
    } catch (e) {
      console.log(e);
    } finally {
      this.spinner.hide();
    }
  }

}
