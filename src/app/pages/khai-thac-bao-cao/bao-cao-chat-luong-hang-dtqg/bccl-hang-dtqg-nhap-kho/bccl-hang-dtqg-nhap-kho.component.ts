import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {UserService} from "../../../../services/user.service";
import {DonviService} from "../../../../services/donvi.service";
import {Globals} from "../../../../shared/globals";
import * as dayjs from "dayjs";
import {Validators} from "@angular/forms";
import {MESSAGE} from "../../../../constants/message";
import {Base2Component} from "../../../../components/base2/base2.component";
import {saveAs} from "file-saver";
import {BcCLuongHangDTQGService} from 'src/app/services/bao-cao/BcCLuongHangDTQG.service';
import {DanhMucService} from "../../../../services/danhmuc.service";

@Component({
  selector: 'app-bccl-hang-dtqg-nhap-kho',
  templateUrl: './bccl-hang-dtqg-nhap-kho.component.html',
  styleUrls: ['./bccl-hang-dtqg-nhap-kho.component.scss']
})
export class BcclHangDtqgNhapKhoComponent extends Base2Component implements OnInit {
  pdfSrc: any;
  excelSrc: any;
  pdfBlob: any;
  excelBlob: any;
  selectedVthhCache: any;
  selectedCloaiVthhCache: any;
  showDlgPreview = false;
  dsDonVi: any;
  listChiCuc: any[] = [];
  listVthh: any[] = [];
  listCloaiVthh: any[] = [];
  listLoaiBc: any[] = [];
  rows: any[] = [];

  constructor(httpClient: HttpClient,
              storageService: StorageService,
              notification: NzNotificationService,
              spinner: NgxSpinnerService,
              modal: NzModalService,
              private bcCLuongHangDTQGService: BcCLuongHangDTQGService,
              public userService: UserService,
              private donViService: DonviService,
              private danhMucSv: DanhMucService,
              public globals: Globals) {
    super(httpClient, storageService, notification, spinner, modal, bcCLuongHangDTQGService);
    this.formData = this.fb.group(
      {
        nam: [dayjs().get("year"), [Validators.required]],
        maCuc: null,
        maChiCuc: null,
        loaiVthh: [null, [Validators.required]],
        cloaiVthh: [null],
        loaiBc: ['02', [Validators.required]],
      }
    );
  }

  async ngOnInit() {
    await this.spinner.show();
    try {
      this.loadDsDonVi();
      this.loadDsVthh();
      this.loadDsLoaiBc();
    } catch (e) {
      console.log("error: ", e);
      await this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
    await this.spinner.hide();
  }

  downloadPdf() {
    saveAs(this.pdfBlob, "bc_chat_luong_thoc_nhap_kho.pdf");
  }

  async downloadExcel() {
    try {
      this.spinner.show();
      let body = this.formData.value;
      body.typeFile = "xlsx";
      body.trangThai = "01";
      body.maDonVi = !body.maChiCuc ? (!body.maCuc ? null : body.maCuc) : body.maChiCuc
      if (body.loaiBc == '01') {
        if (body.loaiVthh.startsWith("0101")) {
          body.fileName = "bao_cao_cl_nhap_thoc_tong_hop.jrxml";
          body.tenBaoCao = "Báo cáo chất lượng nhập thóc - Tổng hợp";
        }
        if (body.loaiVthh.startsWith("0102")) {
          body.fileName = "bao_cao_cl_nhap_gao_tong_hop.jrxml";
          body.tenBaoCao = "Báo cáo chất lượng nhập gạo - Tổng hợp";
        }
      } else {
        if (body.loaiVthh.startsWith("0101")) {
          body.fileName = "bc_chat_luong_thoc_nhap_kho.jrxml";
          body.tenBaoCao = "Báo cáo chất lượng thóc nhập kho";
        }
        if (body.loaiVthh.startsWith("0102")) {
          body.fileName = "bc_chat_luong_gao_nhap_kho.jrxml";
          body.tenBaoCao = "Báo cáo chất lượng gạo nhập kho";
        }
      }
      body.trangThai = "01";
      await this.bcCLuongHangDTQGService.bcclNhapHangDtqg(body).then(async s => {
        this.excelBlob = s;
        this.excelSrc = await new Response(s).arrayBuffer();
        saveAs(this.excelBlob, "bccl_chat_luong_nhap_hang_dtqg.xlsx");
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
    this.formData.controls["maCuc"].clearValidators();
    if (this.formData.value.loaiBc == '02') {
      this.formData.controls["maCuc"].setValidators(Validators.required);
    }
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
      if (body.loaiBc == '01') {
        if (body.loaiVthh.startsWith("0101")) {
          body.fileName = "bao_cao_cl_nhap_thoc_tong_hop.jrxml";
          body.tenBaoCao = "Báo cáo chất lượng nhập thóc - Tổng hợp";
        }
        if (body.loaiVthh.startsWith("0102")) {
          body.fileName = "bao_cao_cl_nhap_gao_tong_hop.jrxml";
          body.tenBaoCao = "Báo cáo chất lượng nhập gạo - Tổng hợp";
        }
      } else {
        if (body.loaiVthh.startsWith("0101")) {
          body.fileName = "bc_chat_luong_thoc_nhap_kho.jrxml";
          body.tenBaoCao = "Báo cáo chất lượng thóc nhập kho";
        }
        if (body.loaiVthh.startsWith("0102")) {
          body.fileName = "bc_chat_luong_gao_nhap_kho.jrxml";
          body.tenBaoCao = "Báo cáo chất lượng gạo nhập kho";
        }
        if (body.loaiVthh.startsWith("02")) {
          body.fileName = "bc_chat_luong_vattu_nhap_kho.jrxml";
          body.tenBaoCao = "Báo cáo chất lượng vật tư nhập kho"
        }
      }
      body.trangThai = "01";
      await this.bcCLuongHangDTQGService.bcclNhapHangDtqg(body).then(async s => {
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
    let res = await this.donViService.layTatCaDonViByLevel(2);
    if (res && res.data) {
      this.dsDonVi = res.data
      this.dsDonVi = this.dsDonVi.filter(item => item.type != "PB" && item.maDvi.startsWith(this.userInfo.MA_DVI))
    }
  }

  async changeCuc(event: any) {
    if (event) {
      let res = await this.donViService.layTatCaDonViByLevel(3);
      if (res && res.data) {
        this.listChiCuc = res.data
        this.listChiCuc = this.listChiCuc.filter(item => item.type != "PB" && item.maDvi.startsWith(event))
      }
    }
  }

  async loadDsVthh() {
    this.listVthh = [];
    let res = await this.danhMucSv.danhMucChungGetAll("LOAI_HHOA");
    if (res.msg == MESSAGE.SUCCESS) {
      this.listVthh = res.data.filter(item => item.ma.startsWith("01") || item.ma.startsWith("02"));
    }
  }

  async changeLoaiVthh(event) {
    if (event) {
      this.formData.patchValue({
        cloaiVthh: null
      })
      let res = await this.danhMucSv.loadDanhMucHangHoaTheoMaCha({str: event});
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          this.listCloaiVthh = res.data;
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }
  }

  async loadDsLoaiBc() {
    let res = await this.danhMucSv.danhMucChungGetAll("LOAI_BAO_CAO");
    if (res.msg == MESSAGE.SUCCESS) {
      this.listLoaiBc = res.data;
    }
  }


  async clearFilter() {
    this.formData.reset();
    this.formData.patchValue({
      nam: dayjs().get('year')
    })
  }
}
