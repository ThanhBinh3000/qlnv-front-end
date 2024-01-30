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
        nam: [dayjs().get("year"), [Validators.required]],
        namNhap: [],
        loaiKyBc: ['01', [Validators.required]],
        kyBc: [null],
        maCuc: [null],
        maChiCuc: [null],
        tgBaoCaoTu: [null],
        tgBaoCaoDen: [null],
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
      this.loadDsKyBc();
      this.changLoaiKyBc('01');
    } catch (e) {
      console.log("error: ", e);
      await this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
    await this.spinner.hide();
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
      if (this.listLoaiKyBc && this.listLoaiKyBc.length > 0) {
        this.listLoaiKyBc.sort((a, b) => (a.ma - b.ma))
      }
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

  changeLoaiBc(event: any) {
    if (event && event == '01') {
      this.formData.patchValue({
        maCuc : null, maChiCuc : null
      })
    }
  }





  setValidators() {
    this.formData.controls["loaiVthh"].setValidators([Validators.required]);
    this.formData.controls["loaiKyBc"].setValidators([Validators.required]);
    this.formData.controls["loaiBc"].setValidators([Validators.required]);
    this.formData.controls["nam"].setValidators([Validators.required]);
    if (this.formData.value.loaiBc == '02' && this.userService.isTongCuc()) {
      this.formData.controls["maCuc"].setValidators([Validators.required]);
    }
    if (this.formData.value.loaiKyBc == '01' && this.formData.value.loaiKyBc == '02') {
      this.formData.controls["kyBc"].setValidators([Validators.required]);
    }
    if (this.formData.value.loaiKyBc == '04') {
      this.formData.controls["tgBaoCaoTu"].setValidators([Validators.required]);
      this.formData.controls["tgBaoCaoDen"].setValidators([Validators.required]);
    }
  }

  async preView() {
    this.helperService.removeValidators(this.formData);
    this.setValidators();
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      this.spinner.hide();
      return;
    }
    try {
      this.spinner.show();
      this.formData.value.namNhap = this.formData.value.nam
      let body = this.formData.value;
      body.maDvi = this.userInfo.MA_DVI;
      body.typeFile = "pdf";
      body.trangThai = "01";
      if (body.loaiBc == '01') {
        if (body.loaiVthh.startsWith("02")) {
          this.nameFile = "bccl_cong_tac_bao_quan_vattu_tong_hop";
        } else {
          this.nameFile = "bccl_cong_tac_bao_quan_luong_thuc_tong_hop";
        }
      } else {
        if (body.loaiVthh.startsWith("0101")) {
          this.nameFile = "bccl_cong_tac_bao_quan_thoc_chi_tiet";
        }
        if (body.loaiVthh.startsWith("0102")) {
          this.nameFile = "bccl_cong_tac_bao_quan_gao_chi_tiet";
        }
        if (body.loaiVthh.startsWith("02")) {
          this.nameFile = "bccl_cong_tac_bao_quan_vattu_chi_tiet";
        }
        if (body.loaiVthh.startsWith("04")) {
          this.nameFile = "bccl_cong_tac_bao_quan_muoi_chi_tiet";
        }
      }
      body.vaiTro = this.userService.isChiCuc()  ? "LDCHICUC" : "LDCUC" ;
      body.maDonVi = !body.maChiCuc ? (!body.maCuc ? null : body.maCuc) : body.maChiCuc;
      if (body.loaiKyBc) {
        if (body.loaiKyBc == '01') {
          if (body.kyBc) {
            body.vaiTro = 'LDCHICUC'
            const parts = body.kyBc.split(" "); // Tách chuỗi theo khoảng trắng
            const monthNumber = parts[1];
            const dayOfMonth = new Date(this.formData.value.namNhap, monthNumber, 0).getDate();
            body.tuNgay = '1/' + monthNumber + '/' + body.namNhap
            body.denNgay = dayOfMonth + '/' + monthNumber + '/' + body.namNhap
          }
        }
        if (body.loaiKyBc == '02') {
          if (body.kyBc && body.kyBc == 'Quý I') {
            body.tuNgay = '1/1/' + body.namNhap
            body.denNgay = '31/3/' + body.namNhap
          }
          if (body.kyBc && body.kyBc == 'Quý II') {
            body.tuNgay = '1/4/' + body.namNhap
            body.denNgay = '30/6/' + body.namNhap
          }
          if (body.kyBc && body.kyBc == 'Quý III') {
            body.tuNgay = '1/7/' + body.namNhap
            body.denNgay = '30/9/' + body.namNhap
          }
          if (body.kyBc && body.kyBc == 'Quý IV') {
            body.tuNgay = '1/10/' + body.namNhap
            body.denNgay = '31/12/' + body.namNhap
          }
        }
        if (body.loaiKyBc == '03') {
          body.tuNgay = '1/10/' + body.namNhap
          body.dauNam = '1/1/' + body.namNhap
          body.denNgay = '31/12/' + body.namNhap
        }
        if (body.loaiKyBc == '04') {
          body.tuNgay = body.tgBaoCaoTu ? dayjs(body.tgBaoCaoTu).format('DD/MM/YYYY') : null;
          body.denNgay = body.tgBaoCaoDen ? dayjs(body.tgBaoCaoDen).format('DD/MM/YYYY') : null;
          body.vaiTro = 'CBTHUKHO';
        }
      }
      body.nam = (this.formData.value.loaiKyBc == '01' || this.formData.value.loaiKyBc == '02') ? (this.formData.value.kyBc + " NĂM " + this.formData.value.namNhap) : ("NĂM " + this.formData.value.namNhap);
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

  downloadPdf() {
    saveAs(this.pdfBlob, this.nameFile + ".pdf");
  }

  async downloadExcel() {
    try {
      this.spinner.show();
      let body = this.formData.value;
      body.maDvi = this.userInfo.MA_DVI;
      body.typeFile = "xlsx";
      body.trangThai = "01";
      if (body.loaiBc == '01') {
        if (body.loaiVthh.startsWith("02")) {
          this.nameFile = "bccl_cong_tac_bao_quan_vattu_tong_hop";
        } else {
          this.nameFile = "bccl_cong_tac_bao_quan_luong_thuc_tong_hop";
        }
      } else {
        if (body.loaiVthh.startsWith("0101")) {
          this.nameFile = "bccl_cong_tac_bao_quan_thoc_chi_tiet";
        }
        if (body.loaiVthh.startsWith("0102")) {
          this.nameFile = "bccl_cong_tac_bao_quan_gao_chi_tiet";
        }
        if (body.loaiVthh.startsWith("02")) {
          this.nameFile = "bccl_cong_tac_bao_quan_vattu_chi_tiet";
        }
        if (body.loaiVthh.startsWith("04")) {
          this.nameFile = "bccl_cong_tac_bao_quan_muoi_chi_tiet";
        }
      }
      body.vaiTro = this.userService.isChiCuc()  ? "LDCHICUC" : "LDCUC" ;
      body.maDonVi = !body.maChiCuc ? (!body.maCuc ? null : body.maCuc) : body.maChiCuc;
      if (body.loaiKyBc) {
        if (body.loaiKyBc == '01') {
          if (body.kyBc) {
            body.vaiTro = 'LDCHICUC'
            const parts = body.kyBc.split(" "); // Tách chuỗi theo khoảng trắng
            const monthNumber = parts[1];
            const dayOfMonth = new Date(this.formData.value.namNhap, monthNumber, 0).getDate();
            body.tuNgay = '1/' + monthNumber + '/' + body.namNhap
            body.denNgay = dayOfMonth + '/' + monthNumber + '/' + body.namNhap
          }
        }
        if (body.loaiKyBc == '02') {
          if (body.kyBc && body.kyBc == 'Quý I') {
            body.tuNgay = '1/1/' + body.namNhap
            body.denNgay = '31/3/' + body.namNhap
          }
          if (body.kyBc && body.kyBc == 'Quý II') {
            body.tuNgay = '1/4/' + body.namNhap
            body.denNgay = '30/6/' + body.namNhap
          }
          if (body.kyBc && body.kyBc == 'Quý III') {
            body.tuNgay = '1/7/' + body.namNhap
            body.denNgay = '30/9/' + body.namNhap
          }
          if (body.kyBc && body.kyBc == 'Quý IV') {
            body.tuNgay = '1/10/' + body.namNhap
            body.denNgay = '31/12/' + body.namNhap
          }
        }
        if (body.loaiKyBc == '03') {
          body.tuNgay = '1/10/' + body.namNhap
          body.denNgay = '31/12/' + body.namNhap
        }
        if (body.loaiKyBc == '04') {
          body.tuNgay = body.tgBaoCaoTu ? dayjs(body.tgBaoCaoTu).format('DD/MM/YYYY') : null;
          body.denNgay = body.tgBaoCaoDen ? dayjs(body.tgBaoCaoDen).format('DD/MM/YYYY') : null;
          body.vaiTro = 'CBTHUKHO';
        }
      }
      body.nam = (this.formData.value.loaiKyBc == '01' || this.formData.value.loaiKyBc == '02') ? (this.formData.value.kyBc + " NĂM " + this.formData.value.namNhap) : ("NĂM " + this.formData.value.namNhap);
      await this.bcCLuongHangDTQGService.baoCaoCongTacBqHangDtqg(body).then(async s => {
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


}
