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
import {NumberToRoman} from "../../../../shared/commonFunction";

@Component({
  selector: 'app-bccl-cong-tac-bao-quan',
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
  listLoaiKyBc: any[] = [];
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
        loaiKyBc: [null, [Validators.required]],
        kyBc: [null],
        maCuc: null,
        maChiCuc: null,
        loaiVthh: [null, [Validators.required]],
        cloaiVthh: [null, [Validators.required]],
        loaiBc: [null, [Validators.required]],
      }
    );
  }

  async ngOnInit() {
    await this.spinner.show();
    try {
      this.loadDsDonVi();
      this.loadDsVthh();
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
    saveAs(this.pdfBlob, "bccl_cong_tac_bao_quan_gao.pdf");
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
        saveAs(this.excelBlob, "bccl_cong_tac_bao_quan_gao.xlsx");
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
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      this.spinner.hide();
      return;
    }
    try {
      this.spinner.show();
      let body = this.formData.value;
      body.nam = (this.formData.value.loaiKyBc == '01' || this.formData.value.loaiKyBc == '02') ? (this.formData.value.kyBc + " NĂM " + this.formData.value.nam) : ("NĂM " + this.formData.value.nam);
      body.maDvi = this.userInfo.MA_DVI;
      body.typeFile = "pdf";
      body.trangThai = "01";
      if (body.loaiBc == '01') {
        body.fileName = "bccl_cong_tac_bao_quan_gao_tong_hop.jrxml";
        body.tenBaoCao = "BBáo cáo chất lượng công tác bảo quản gạo (tổng hợp)";
      } else {
        if (body.loaiVthh.startsWith("0101")) {
          body.fileName = "bccl_cong_tac_bao_quan_thoc_chi_tiet.jrxml";
          body.tenBaoCao = "Báo cáo chất lượng công tác bảo quản thóc (chi tiết)";
        }
        if (body.loaiVthh.startsWith("0102")) {
          body.fileName = "bccl_cong_tac_bao_quan_gao_chi_tiet.jrxml";
          body.tenBaoCao = "Báo cáo chất lượng công tác bảo quản gạo (chi tiết)";
        }
        if (body.loaiVthh.startsWith("02")) {
          body.fileName = "bccl_cong_tac_bao_quan_vattu_chi_tiet.jrxml";
          body.tenBaoCao = "Báo cáo chất lượng công tác bảo quản vật tư (chi tiết)";
        }
        if (body.loaiVthh.startsWith("04")) {
          body.fileName = "bccl_cong_tac_bao_quan_muoi_chi_tiet.jrxml";
          body.tenBaoCao = "Báo cáo chất lượng công tác bảo quản muối (chi tiết)";
        }
      }
      await this.bcCLuongHangDTQGService.baoCaoCongTacBqHangDtqg(body).then(async s => {
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
      this.listVthh = res.data;
    }
  }

  async changeLoaiVthh(event) {
    if (event) {
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

  async loadDsKyBc() {
    let res = await this.danhMucSv.danhMucChungGetAll("KY_BAO_CAO");
    if (res.msg == MESSAGE.SUCCESS) {
      this.listLoaiKyBc = res.data;
    }
  }


  async clearFilter() {
    this.formData.reset();
    this.formData.patchValue({
      nam: dayjs().get('year')
    })
  }

  changLoaiKyBc(event: any) {
    if (event) {
      this.listKyBc = [];
      switch (event) {
        case '01': {
          for (let i = 1; i <= 12; i++) {
            let item = {
              ma: 'Tháng ' + i,
              giaTri: 'Tháng ' + i
            }
            this.listKyBc = [...this.listKyBc, item].flat();
          }
          break;
        }
        case '02': {
          for (let i = 1; i <= 4; i++) {
            let item = {
              ma: 'Quý ' + NumberToRoman(i),
              giaTri: 'Quý ' + NumberToRoman(i)
            }
            this.listKyBc = [...this.listKyBc, item].flat();
          }
          break;
        }
        case '03': {
          break;
        }
        case '04': {
          break;
        }
      }
    }
  }
}
