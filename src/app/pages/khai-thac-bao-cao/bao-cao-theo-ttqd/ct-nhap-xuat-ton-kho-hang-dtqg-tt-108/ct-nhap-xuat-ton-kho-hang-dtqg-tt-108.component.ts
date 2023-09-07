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
  quy: any;
  loaiVthh: any;
  maCuc: any;
  maChiCuc: any;
  cLoaiVthh: any;
  cLoaiVthhListData: any;
  dsBoNganh: any[] = [];
  selectedVthhCache: any;
  selectedCloaiVthhCache: any;
  showDlgPreview = false;
  listNam: any[] = [];
  dsDonVi: any;
  listChiCuc: any[] = [];
  listVthh: any[] = [];
  listCloaiVthh: any[] = [];
  rows: any[] = [];
  ngayBatDauQuy: any;
  ngayKetThucQuy: any;
  listQuy: any[] = [
    { id: 1, giaTri: 'Quý 1' },
    { id: 2, giaTri: 'Quý 2' },
    { id: 3, giaTri: 'Quý 3' },
    { id: 4, giaTri: 'Quý 4' }
  ];
  constructor(httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private thongTu1082018Service: ThongTu1082018Service,
    public userService: UserService,
    private donViService: DonviService,
    private danhMucService: DanhMucService,

    private donviService: DonviService,
    public globals: Globals) {
    super(httpClient, storageService, notification, spinner, modal, thongTu1082018Service);
    this.formData = this.fb.group(
      {
        nam: [dayjs().get("year"), [Validators.required]],
        boNganh: null,
        dviBaoCao: null,

        loaiHangHoa: null,
        nuocSanXuat: null,
        chungLoaiHangHoa: null
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
        this.loadDsVthh(),
        this.getListBoNganh()
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
      debugger
      this.spinner.show();
      let body = this.formData.value;
      body.typeFile = "pdf";
      body.fileName = "bc_ct_nhap_xuat_ton_kho_hang_dtqg_108.jrxml";
      body.tenBaoCao = "Báo cáo chi tiết nhập xuất tồn kho hàng DTQG";
      body.trangThai = "01";
      body.ngayBatDauQuy = this.convertDateToString(this.ngayBatDauQuy);
      body.ngayKetThucQuy = this.convertDateToString(this.ngayKetThucQuy);
      body.cloaiVthh = this.cLoaiVthh;
      body.loaiVthh = this.loaiVthh;
      if (this.userService.isTongCuc) {
        body.maDvi = this.maChiCuc ? this.maChiCuc : this.maCuc;
      } else if (this.userService.isCuc) {
        body.maDvi = this.maChiCuc;
      } else {
        body.maDvi = null;
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

  getStartAndEndDatesOfQuarter(quarter: any) {
    debugger
    const today = new Date();
    const currentYear = today.getFullYear();
    this.ngayBatDauQuy = new Date(currentYear, (quarter - 1) * 3, 1);
    this.ngayKetThucQuy = new Date(currentYear, (quarter - 1) * 3 + 3, 0);
  }

  convertDateToString(event: any): string {
    let result = '';
    if (event) {
      result = dayjs(event).format('YYYY/MM/DD').toString()
    }
    return result;
  }

  async loadDsDonVi() {
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

  async getListBoNganh() {
    this.dsBoNganh = [];
    let res = await this.donviService.layTatCaDonViByLevel(0);
    // let res = await this.danhMucService.danhMucChungGetAll('BO_NGANH');
    if (res.msg == MESSAGE.SUCCESS) {
      this.dsBoNganh = res.data;
    }
  }

  async changeCuc(event: any) {
    if (event) {
      let body = {
        trangThai: "01",
        maDviCha: event,
        type: "DV"
      };
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
    debugger
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
    this.cLoaiVthh.push(event)
  }

  changeNuocSX(event) {

  }
  addRow() {
    this.rows.push({})
  }

  deleteRow(index: number) {
    this.rows.splice(index, 1)
  }
}
