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
import { saveAs } from "file-saver";
import { Validators } from '@angular/forms';
import { MESSAGE } from '../../../../constants/message';

@Component({
  selector: 'app-bc-soluong-chatluong-giake-kichke-nam',
  templateUrl: './bc-soluong-chatluong-giake-kichke-nam.component.html',
  styleUrls: ['./bc-soluong-chatluong-giake-kichke-nam.component.scss']
})
export class BcSoluongChatluongGiakeKichkeNamComponent  extends Base2Component implements OnInit {
  pdfSrc: any;
  excelSrc: any;
  pdfBlob: any;
  excelBlob: any;
  selectedVthhCache: any;
  selectedCloaiVthhCache: any;
  showDlgPreview = false;
  listNam: any[] = [];
  dsDonVi: any;
  listChiCuc: any[] = [];
  listVthh: any[] = [];
  listCloaiVthh: any[] = [];
  rows: any[] = [];

  constructor(httpClient: HttpClient,
              storageService: StorageService,
              notification: NzNotificationService,
              spinner: NgxSpinnerService,
              modal: NzModalService,
              private bcCLuongHangDTQGService: BcCLuongHangDTQGService,
              public userService: UserService,
              private donViService: DonviService,
              private danhMucService: DanhMucService,
              public globals: Globals) {
    super(httpClient, storageService, notification, spinner, modal, bcCLuongHangDTQGService);
    this.formData = this.fb.group(
      {
        nam: [dayjs().get("year"), [Validators.required]],
        maCuc: null,
        maChiCuc: null,
        maDvi: null,
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
      await Promise.all([
        this.loadDsDonVi(),
        this.loadDsVthh()
      ]);
    } catch (e) {
      console.log("error: ", e);
      await this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
    await this.spinner.hide();
  }

  downloadPdf() {
    saveAs(this.pdfBlob, "th_bc_sl_chat_luong_may_moc_tb_chuyen_dung.pdf");
  }

  async downloadExcel() {
    try {
      this.spinner.show();
      if (this.formData.value.thoiGianSx) {
        this.formData.value.thoiGianSxTu = dayjs(this.formData.value.thoiGianSx[0]).format("YYYY-MM-DD");
        this.formData.value.thoiGianSxDen = dayjs(this.formData.value.thoiGianSx[1]).format("YYYY-MM-DD");
      }
      let body = this.formData.value;
      body.maDvi = body.maCuc == null ? null : (body.maChiCuc == null ? body.maCuc : body.maChiCuc)
      body.typeFile = "xlsx";
      body.fileName = "th_bc_sl_cl_may_moc_thiet_bi_chuyen_dung.jrxml";
      body.tenBaoCao = "Tổng hợp báo cáo số lượng, chất lượng máy móc, thiết bị chuyên dùng";
      body.trangThai = "01";
      await this.bcCLuongHangDTQGService.baoCaoSLuongCLuongMmTbcd(body).then(async s => {
        this.excelBlob = s;
        this.excelSrc = await new Response(s).arrayBuffer();
        saveAs(this.excelBlob, "th_bc_sl_chat_luong_may_moc_tb_chuyen_dung.xlsx");
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
    try {
      this.spinner.show();
      if (this.formData.value.thoiGianSx) {
        this.formData.value.thoiGianSxTu = dayjs(this.formData.value.thoiGianSx[0]).format("YYYY-MM-DD");
        this.formData.value.thoiGianSxDen = dayjs(this.formData.value.thoiGianSx[1]).format("YYYY-MM-DD");
      }
      let body = this.formData.value;
      // body.maDvi = body.maCuc == null ? null : (body.maChiCuc == null ? body.maCuc : body.maChiCuc)
      body.typeFile = "pdf";
      body.fileName = "th_bc_sl_cl_may_moc_thiet_bi_chuyen_dung.jrxml";
      body.tenBaoCao = "Tổng hợp báo cáo số lượng, chất lượng máy móc, thiết bị chuyên dùng";
      body.trangThai = "01";
      await this.bcCLuongHangDTQGService.baoCaoSLuongCLuongMmTbcd(body).then(async s => {
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
    // this.formData.get('nam').setValue(null);
    this.formData.get('maCuc').setValue(null);
    this.formData.get('maChiCuc').setValue(null);
    this.formData.get('maDvi').setValue(null);
  }

  async loadDsDonVi() {
    if (this.userService.isCuc()) {
      await this.changeCuc(this.userInfo.MA_DVI)
    } else {
      let body = {
        trangThai: "01",
        maDviCha: this.userInfo.MA_DVI.substring(0, 4),
        type: "DV"
      };
      let res = await this.donViService.getDonViTheoMaCha(body);
      if (res.msg == MESSAGE.SUCCESS) {
        this.dsDonVi = res.data;
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }
  }

  async changeCuc(event: any) {
    if (event) {
      let body = {
        trangThai: "01",
        maDviCha: event,
        type: "DV"
      };
      this.formData.get('maChiCuc').setValue(null);
      let res = await this.donViService.getDonViTheoMaCha(body);
      if (res.msg == MESSAGE.SUCCESS) {
        this.listChiCuc = res.data;
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }
  }

  async loadDsVthh() {
    this.listVthh = [];
    let res = await this.danhMucService.danhMucChungGetAll("LOAI_HHOA");
    if (res.msg == MESSAGE.SUCCESS) {
      this.listVthh = res.data.filter(item => item.ma != "02");
    }
  }

  async changeLoaiVthh(event) {
    let res = await this.danhMucService.loadDanhMucHangHoaTheoMaCha({ str: event });
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data) {
        this.listCloaiVthh = res.data;
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  changeCloaiVthh(event) {

  }
  addRow() {
    this.rows.push({})
  }

  deleteRow(index: number) {
    this.rows.splice(index, 1)
  }
}
