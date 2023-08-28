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
import {cloneDeep} from 'lodash';

@Component({
  selector: 'app-bccl-cong-tac-bao-quan-gao',
  templateUrl: './bccl-cong-tac-bao-quan-gao.component.html',
  styleUrls: ['./bccl-cong-tac-bao-quan-gao.component.scss']
})
export class BcclCongTacBaoQuanGaoComponent extends Base2Component implements OnInit {
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
  listKyBc: any[] = [];
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
        ky: null,
        maCuc: null,
        maChiCuc: null,
        loaiVthh: null,
        cloaiVthh: null,
        loai: null

      }
    );
  }

  async ngOnInit() {
    await this.spinner.show();
    try {
      this.loadDsDonVi();
      this.loadDsHangHoa();
      this.loadDsLoaiBc();
      this.loadDsKyBc();
    } catch (e) {
      console.log("error: ", e);
      await this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
    await this.spinner.hide();
  }

  downloadPdf() {
    saveAs(this.pdfBlob, "bc_so_luong_chat_luong_ccdc.pdf");
  }

  async downloadExcel() {
    try {
      this.spinner.show();
      let body = this.formData.value;
      body.typeFile = "xlsx";
      body.fileName = "th_bc_sl_cl_ccdc.jrxml";
      body.tenBaoCao = "Báo cáo số lượng chất lượng Công cụ dụng cụ";
      body.trangThai = "01";
      await this.bcCLuongHangDTQGService.baoCaoSLuongCLuongCcdc(body).then(async s => {
        this.excelBlob = s;
        this.excelSrc = await new Response(s).arrayBuffer();
        saveAs(this.excelBlob, "bc_so_luong_chat_luong_ccdc.xlsx");
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
      let body = this.formData.value;
      body.typeFile = "pdf";
      body.fileName = "th_bc_sl_cl_ccdc.jrxml";
      body.tenBaoCao = "Báo cáo số lượng chất lượng Công cụ dụng cụ";
      body.trangThai = "01";
      await this.bcCLuongHangDTQGService.baoCaoSLuongCLuongCcdc(body).then(async s => {
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

  async loadDsHangHoa() {
    let res = await this.danhMucSv.getAllVthhByCap("2");
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data) {
        this.listVthh = res.data
      }
    }
  }

  async changHangHoa(event) {
    if (event) {
      this.listCloaiVthh = cloneDeep(this.listVthh).find(x => x.ma == event).children
    }
  }

  async loadDsLoaiBc() {
    let res = await this.danhMucSv.danhMucChungGetAll("LOAI_BAO_CAO");
    if (res.msg == MESSAGE.SUCCESS) {
      this.listLoaiBc = res.data;
    }
  }

  async loadDsKyBc() {
    let res = await this.danhMucSv.danhMucChungGetAll("KY_BAO_CAO");
    if (res.msg == MESSAGE.SUCCESS) {
      this.listKyBc = res.data;
    }
  }


  async clearFilter() {
    this.formData.get('maCuc').setValue(null);
    this.formData.get('maChiCuc').setValue(null);
    this.formData.get('maDvi').setValue(null);
  }
}
