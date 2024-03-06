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
import { el, th } from 'date-fns/locale';

@Component({
  selector: 'app-bao-cao-hao-hut-hang-dtqg',
  templateUrl: './bao-cao-hao-hut-hang-dtqg.component.html',
  styleUrls: ['./bao-cao-hao-hut-hang-dtqg.component.scss']
})
export class BaoCaoHaoHutHangDtqgComponent extends Base2Component implements OnInit {
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
  listLoaiKyBc: any[] = [];
  listKyBc: any[] = [];
  rows: any[] = [];
  listPtbq: any[] = [];
  nameFile: any;

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
        namNhap: [[], [Validators.required]],
        namXuat: [[], [Validators.required]],
        maCuc: null,
        maChiCuc: null,
        vungMien: null,
        loaiVthh: [null, [Validators.required]],
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
      // this.loadListPpbq();
      await this.initForm()
    } catch (e) {
      console.log("error: ", e);
      await this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
    await this.spinner.hide();
  }

  // async loadListPpbq() {
  //   this.listPtbq = [];
  //   let res = await this.danhMucSv.danhMucChungGetAll('PT_BAO_QUAN');
  //   if (res.msg == MESSAGE.SUCCESS) {
  //     this.listPtbq = res.data;
  //   }
  // }

  downloadPdf() {
    saveAs(this.pdfBlob, this.nameFile + ".pdf");
  }

  async initForm() {
    if (this.userService.isCuc()) {
      this.formData.patchValue({
        maCuc : this.userInfo.MA_DVI
      })
    }
    if (this.userService.isChiCuc()) {
      this.formData.patchValue({
        maCuc : this.userInfo.MA_DVI.substring(0, 6),
        maChiCuc : this.userInfo.MA_DVI,
      })
    }
    }

  async downloadExcel() {
    try {
      this.spinner.show();
      this.formData.value.namNhap = this.formData.value.namNhap && this.formData.value.namNhap.length > 0 ? this.formData.value.namNhap.toString() : ""
      this.formData.value.namXuat = this.formData.value.namXuat && this.formData.value.namXuat.length > 0 ? this.formData.value.namXuat.toString() : ""
      let body = this.formData.value;
      body.maDvi = !body.maChiCuc ? (!body.maCuc ? null : body.maCuc) : body.maChiCuc
      body.nam  = 2023;
      body.typeFile = "xlsx";
      if (body.loaiBc == '01') {
        if (body.loaiVthh.startsWith("0101")) {
          this.nameFile = "bc_hao_hut_thoc_tong_hop";
        } else {
          this.nameFile = "bc_hao_hut_gao_tong_hop";
        }
      } else {
        this.nameFile = "bc_hao_hut_hang_dtqg_chi_tiet";
      }
      body.trangThai = "01";
      await this.bcCLuongHangDTQGService.bcclHangHaoHut(body).then(async s => {
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
    this.formData.controls["maCuc"].clearValidators();
    if (this.formData.value.loaiBc == '02') {
      this.formData.controls["maCuc"].setValidators(Validators.required);
    } else {
      if (this.formData.value.loaiVthh == '0101') {
        this.formData.controls["vungMien"].setValidators(Validators.required);
      }
    }
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      this.spinner.hide();
      return;
    }
    try {
      this.spinner.show();
      this.formData.value.namNhap = this.formData.value.namNhap && this.formData.value.namNhap.length > 0 ? this.formData.value.namNhap.toString() : ""
      this.formData.value.namXuat = this.formData.value.namXuat && this.formData.value.namXuat.length > 0 ? this.formData.value.namXuat.toString() : ""
      let body = this.formData.value;
      body.maDonVi = !body.maChiCuc ? (!body.maCuc ? null : body.maCuc) : body.maChiCuc
      body.nam  = 2023;
      body.typeFile = "pdf";
      if (body.loaiBc == '01') {
        if (body.loaiVthh.startsWith("0101")) {
          this.nameFile = "bc_hao_hut_thoc_tong_hop";
        } else {
          this.nameFile = "bc_hao_hut_gao_tong_hop";
        }
      } else {
        this.nameFile = "bc_hao_hut_hang_dtqg_chi_tiet";
      }
      body.trangThai = "01";
      await this.bcCLuongHangDTQGService.bcclHangHaoHut(body).then(async s => {
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
      this.dsDonVi = this.dsDonVi.filter(item => item.type != "PB")
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
      this.listVthh = res.data.filter(item => item.ma.startsWith("01"));
    }
  }

  async loadDsLoaiBc() {
    let res = await this.danhMucSv.danhMucChungGetAll("LOAI_BAO_CAO");
    if (res.msg == MESSAGE.SUCCESS) {
      this.listLoaiBc = res.data.filter(x => x.ma == '02' || x.ma == '01');
    }
  }


  async clearFilter() {
    this.formData.reset();
  }
}
