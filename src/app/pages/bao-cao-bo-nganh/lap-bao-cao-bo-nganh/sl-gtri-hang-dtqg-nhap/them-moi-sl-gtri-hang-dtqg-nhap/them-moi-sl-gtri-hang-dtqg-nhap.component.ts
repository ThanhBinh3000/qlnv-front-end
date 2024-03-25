import { Component, Input, OnInit } from "@angular/core";
import { Base2Component } from "../../../../../components/base2/base2.component";
import { HttpClient } from "@angular/common/http";
import { StorageService } from "../../../../../services/storage.service";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NgxSpinnerService } from "ngx-spinner";
import { NzModalService } from "ng-zorro-antd/modal";
import { BcBnTt130Service } from "../../../../../services/bao-cao/BcBnTt130.service";
import { DonviService } from "../../../../../services/donvi.service";
import * as dayjs from "dayjs";
import { Validators } from "@angular/forms";
import { STATUS } from "../../../../../constants/status";
import { MESSAGE } from "../../../../../constants/message";
import {  slGtriHangDtqgNhap } from "../../../../../models/BaoCaoBoNganh";
import {
  DialogThemMoiSlGtriHangDtqgComponent
} from "../../sl-gtri-hang-dtqg/dialog-them-moi-sl-gtri-hang-dtqg/dialog-them-moi-sl-gtri-hang-dtqg.component";
import { cloneDeep } from 'lodash';
import {CurrencyMaskInputMode} from "ngx-currency";
import {TEN_HANG_DTQG} from "../../../../../constants/config";
import {DanhMucService} from "../../../../../services/danhmuc.service";

@Component({
  selector: 'app-them-moi-sl-gtri-hang-dtqg-nhap',
  templateUrl: './them-moi-sl-gtri-hang-dtqg-nhap.component.html',
  styleUrls: ['./them-moi-sl-gtri-hang-dtqg-nhap.component.scss']
})
export class ThemMoiSlGtriHangDtqgNhapComponent extends Base2Component implements OnInit {

  @Input() idInput: number;
  @Input() isView: boolean;
  listQuy: any[] = [
    { text: "Quý I", value: 1 },
    { text: "Quý II", value: 2 },
    { text: "Quý III", value: 3 },
    { text: "Quý IV", value: 4 }
  ];
  whitelistWebService: any = {};
  listLoaiBc: any[] = [
    {
      text: "Báo cáo năm",
      value: 1,
      thoiHanGuiBc: "Sau 25 ngày kết thúc năm"
    },
    { text: "Báo cáo quý", value: 2, thoiHanGuiBc: "Ngày 20 của tháng đầu quý sau" }
  ];
  ghiChu: string = "Dấu “x” tại các hàng trong biểu là nội dung không phải tổng hợp, báo cáo.";
  dsDonVi: any[] = [];
  listDataGroup: any[] = [];
  itemRowMatHangEdit: any[] = [];
  itemRowDonViEdit: any[] = [];
  itemRowNhomMhEdit: any[] = [];
  itemRowMatHang: any[] = [];
  amount = {
    allowZero: true,
    allowNegative: false,
    precision: 2,
    prefix: '',
    thousands: '.',
    decimal: ',',
    align: "right",
    nullable: true,
    min: 0,
    max: 1000000000000,
    inputMode: CurrencyMaskInputMode.NATURAL,
  }
  listDsDvi: any;
  tenBoNganh: any;
  constructor(httpClient: HttpClient,
              storageService: StorageService,
              notification: NzNotificationService,
              spinner: NgxSpinnerService,
              modal: NzModalService,
              private bcBnTt108Service: BcBnTt130Service,
              private donViService: DonviService,
              private danhMucService: DanhMucService
  ) {
    super(httpClient, storageService, notification, spinner, modal, bcBnTt108Service);
    this.formData = this.fb.group(
      {
        id: [null],
        namBc: [dayjs().get("year")],
        kyBc: [null],
        loaiBc: [null],
        thoiHanGuiBc: [null],
        thongTuSo: ["130/2018/TT-BTC"],
        bieuSo: ["005.H/BCDTQG-BN"],
        tenDonViGui: [null],
        maDonViGui: [null, [Validators.required]],
        tenDonViNhan: [null],
        maDonViNhan: [null],
        ngayTao: [dayjs().format("YYYY-MM-DD")],
        trangThai: [STATUS.DU_THAO],
        tenTrangThai: ['Dự thảo'],
        kySo: [null],
      }
    );
    this.templateName = 'template_bcbn_sl_gtri_hang_dtqg_nhap_trong_ky.xlsx'
  }
  async ngOnInit() {
    this.spinner.show();
    this.userInfo = this.userService.getUserLogin();
    await Promise.all([
      this.layTatCaDonViByLevel(),
      this.loadDsKyBc(),
    ]);
    if (this.idInput != null) {
      await this.loadChiTiet(this.idInput)
    } else {
      await Promise.all([
        this.loadDsDonVi()
      ]);
      this.formData.patchValue({
        tenDonViNhan: this.dsDonVi[0].tenDvi,
        maDonViNhan: this.dsDonVi[0].maDvi
      });
    }
    this.spinner.hide();
  }

  async loadChiTiet(id:number) {
    await this.bcBnTt108Service
      .getDetail(id)
      .then((res) => {
        if (res.msg == MESSAGE.SUCCESS) {
          const dataDetail = res.data;
          this.helperService.bidingDataInFormGroup(this.formData, dataDetail.hdr);
          this.listDataGroup = dataDetail.detail;
          for (let i = 0; i < this.listDataGroup.length; i++) {
            this.itemRowMatHang[i] = [];
            this.itemRowMatHangEdit[i] = [];
            for (let y = 0; y < this.listDataGroup[i].children.length; y++) {
              this.itemRowMatHang[i][y] = new slGtriHangDtqgNhap();
              this.itemRowMatHangEdit[i][y] = [];
              if (this.listDataGroup[i].children[y].children.length > 0) {
                this.listDataGroup[i].children[y].coNhieuMatHang = true;
              }
            }
          }
        }})
      .catch((e) => {
        console.log('error: ', e);
        this.spinner.hide();
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      });
  }

  async loadDsDonVi() {
    let body = {
      trangThai: "01",
      maDviCha: "01",
      type: "DV"
    };
    let res = await this.donViService.getDonViTheoMaCha(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.dsDonVi = res.data;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  changeLoaiBc(event) {
    if (event != null) {
      this.formData.get("thoiHanGuiBc").setValue(this.listLoaiBc.find(item => item.value == event).thoiHanGuiBc);
    }
  }

  quayLai() {
    this.showListEvent.emit();
  }

  async guiDuyet(id: number) {
    let trangThai = STATUS.BAN_HANH;
    let mesg = 'Ban hành quyết định'
    this.approve(id, trangThai, mesg);
  }

  async save(isBanHanh?: boolean) {
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      return;
    }
    for (let i = 0; i < this.listDataGroup.length; i++) {
      this.listDataGroup[i].thuTuHienThi = (i+1)
    }
    let body = {
      "hdr" : this.formData.value,
      "detail": this.listDataGroup
    };
    if(!this.userService.isTongCuc()){
      body.hdr.maDonViGui = this.userInfo.MA_DVI
    }
    let res = null;
    if (this.formData.get("id").value) {
      res = await this.bcBnTt108Service.update(body);
    } else {
      res = await this.bcBnTt108Service.create(body);
    }
    if (res.msg == MESSAGE.SUCCESS) {
      this.idInput = res.data.id;
      if(await this.checkWhiteList()){
        if (isBanHanh) {
          this.pheDuyetBcBn(body);
        } else {
          if (this.formData.get("id").value) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
          } else {
            this.formData.get("id").setValue(res.data.id);
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
          }
        }
      }else{
        this.notification.error(MESSAGE.ERROR, MESSAGE.WEB_SERVICE_ERR);
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  themMoiDanhMuc(data?: string) {
    const modalGT = this.modal.create({
      nzTitle: '',
      nzContent: DialogThemMoiSlGtriHangDtqgComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '650px',
      nzFooter: null,
      nzClassName: '',
      nzComponentParams: {
        listDataGroup: this.listDataGroup,
        danhMuc: data
      },
    });
    modalGT.afterClose.subscribe((res) => {
      if (!res) {
        return;
      }
      let isUpdate = false;
      this.listDataGroup.forEach(dvi => {
        if (dvi.danhMuc ==  res.danhMuc) {
          dvi.children = [...dvi.children, res.children[0]]
          isUpdate = true;
        }
      })
      if (!isUpdate) {
        this.listDataGroup = [...this.listDataGroup, res];
      }
      for (let i = 0; i < this.listDataGroup.length; i++) {
        this.itemRowMatHang[i] = [];
        this.itemRowMatHangEdit[i] = [];
        this.itemRowNhomMhEdit[i] = [];
        for (let y = 0; y < this.listDataGroup[i].children.length; y++) {
          this.itemRowMatHang[i][y] = new slGtriHangDtqgNhap();
          this.itemRowMatHangEdit[i][y] = [];
          this.itemRowNhomMhEdit[i][y] = this.listDataGroup[i].children[y];
        }
      }
    });
  }

  editRowMatHang(i: number, y: number, z: number) {
    for (let i = 0; i < this.listDataGroup.length; i++) {
      if (this.itemRowMatHangEdit[i] == undefined) {
        this.itemRowMatHangEdit[i] = [];
      }
      for (let y = 0; y < this.listDataGroup[i].children.length; y++) {
        if (this.itemRowMatHangEdit[i][y] == undefined) {
          this.itemRowMatHangEdit[i][y] = [];
        }
      }
    }
    this.listDataGroup[i].children[y].children[z].edit = true;
    this.itemRowMatHangEdit[i][y][z] = cloneDeep(this.listDataGroup[i].children[y].children[z]);
  }

  deleteRowMatHang(i: number, y: number, z: number) {
    this.listDataGroup[i].children[y].children.splice(z, 1)
  }

  saveEditRowMatHang(i: number, y: number, z: number) {
    this.listDataGroup[i].children[y].children[z] = this.itemRowMatHangEdit[i][y][z]
    this.listDataGroup[i].children[y].children[z].edit = false;
    this.itemRowMatHangEdit[i][y][z] = {}
    this.tinhTongGtriNhomMh();
    this.tinhTongGtriDvi();
  }

  cancelEditRowMatHang(i: number, y: number, z: number) {
    this.listDataGroup[i].children[y].children[z].edit = false;
    this.itemRowMatHangEdit[i][y][z] = {}
  }

  addRowMatHang(i: number, y: number) {
    this.listDataGroup[i].children[y].children = [
      ...this.listDataGroup[i].children[y].children,
      this.itemRowMatHang[i][y]
    ];
    this.clearItemRowMatHang(i, y);
    this.tinhTongGtriNhomMh();
    this.tinhTongGtriDvi();
  }

  clearItemRowMatHang(i: number, y: number) {
    this.itemRowMatHang[i][y] = new slGtriHangDtqgNhap();
  }

  editRowDvi(i: number) {
    this.listDataGroup[i].edit = true;
    this.itemRowDonViEdit[i] = cloneDeep(this.listDataGroup[i]);
  }

  deleteRowDvi(i: number) {
    this.listDataGroup.splice(i, 1)
  }
  saveEditRowDvi(i: number) {
    this.listDataGroup[i].danhMuc = this.itemRowDonViEdit[i].danhMuc
    this.listDataGroup[i].maSo = this.itemRowDonViEdit[i].maSo
    this.listDataGroup[i].edit = false;
    this.itemRowDonViEdit[i] = {};
  }

  cancelEditRowDvi(i: number) {
    this.listDataGroup[i].edit = false;
    this.itemRowDonViEdit[i] = {};
  }

  editRowNhomMh(i: number, y: number) {
    for (let i = 0; i < this.listDataGroup.length; i++) {
      this.itemRowNhomMhEdit[i] = [];
    }
    this.listDataGroup[i].children[y].edit = true;
    this.itemRowNhomMhEdit[i][y] = cloneDeep(this.listDataGroup[i].children[y]);
  }

  deleteRowNhomMh(i: number, y: number) {
    this.listDataGroup[i].children.splice(y, 1)
  }
  saveEditRowNhomMh(i: number, y: number) {
    this.listDataGroup[i].children[y] = this.itemRowNhomMhEdit[i][y]
    this.listDataGroup[i].children[y].edit = false;
    this.itemRowNhomMhEdit[i][y] = {};
    this.tinhTongGtriDvi()
  }

  cancelEditRowNhomMh(i: number, y: number) {
    this.listDataGroup[i].children[y].edit = false;
    this.itemRowNhomMhEdit[i][y] = {};
  }

  tinhTongGtriDvi (){
    for (let dvi of this.listDataGroup) {
      dvi.gtriNhapTang = 0
      dvi.gtriNhapBu = 0
      dvi.gtriNhapBsung = 0
      dvi.gtriNhapKhac = 0
      dvi.gtriNhapTong = 0
      dvi.gtriLuyKeTang = 0
      dvi.gtriLuyKeBu = 0
      dvi.gtriLuyKeBsung = 0
      dvi.gtriLuyKeKhac = 0
      dvi.gtriLuyKeTong = 0
      for (let nhomMh of dvi.children) {
        dvi.gtriNhapTang += this.nvl(nhomMh.gtriNhapTang)
        dvi.gtriNhapBu += this.nvl(nhomMh.gtriNhapBu)
        dvi.gtriNhapBsung += this.nvl(nhomMh.gtriNhapBsung)
        dvi.gtriNhapKhac += this.nvl(nhomMh.gtriNhapKhac)
        dvi.gtriNhapTong += this.nvl(nhomMh.gtriNhapTong)
        dvi.gtriLuyKeTang += this.nvl(nhomMh.gtriLuyKeTang)
        dvi.gtriLuyKeBu += this.nvl(nhomMh.gtriLuyKeBu)
        dvi.gtriLuyKeBsung += this.nvl(nhomMh.gtriLuyKeBsung)
        dvi.gtriLuyKeKhac += this.nvl(nhomMh.gtriLuyKeKhac)
        dvi.gtriLuyKeTong += this.nvl(nhomMh.gtriLuyKeTong)
      }
    }
  }
  tinhTongGtriNhomMh (){
    for (let dvi of this.listDataGroup) {
      for (let nhomMh of dvi.children) {
        if (nhomMh.coNhieuMatHang == true) {
          nhomMh.gtriNhapTang = 0
          nhomMh.gtriNhapBu = 0
          nhomMh.gtriNhapBsung = 0
          nhomMh.gtriNhapKhac = 0
          nhomMh.gtriNhapTong = 0
          nhomMh.gtriLuyKeTang = 0
          nhomMh.gtriLuyKeBu = 0
          nhomMh.gtriLuyKeBsung = 0
          nhomMh.gtriLuyKeKhac = 0
          nhomMh.gtriLuyKeTong = 0
          for (let matHang of nhomMh.children) {
            nhomMh.gtriNhapTang += this.nvl(matHang.gtriNhapTang)
            nhomMh.gtriNhapBu += this.nvl(matHang.gtriNhapBu)
            nhomMh.gtriNhapBsung += this.nvl(matHang.gtriNhapBsung)
            nhomMh.gtriNhapKhac += this.nvl(matHang.gtriNhapKhac)
            nhomMh.gtriNhapTong += this.nvl(matHang.gtriNhapTong)
            nhomMh.gtriLuyKeTang += this.nvl(matHang.gtriLuyKeTang)
            nhomMh.gtriLuyKeBu += this.nvl(matHang.gtriLuyKeBu)
            nhomMh.gtriLuyKeBsung += this.nvl(matHang.gtriLuyKeBsung)
            nhomMh.gtriLuyKeKhac += this.nvl(matHang.gtriLuyKeKhac)
            nhomMh.gtriLuyKeTong += this.nvl(matHang.gtriLuyKeTong)
          }
        }
      }
    }
  }

  async handleSelectFile(event: any){
    await this.onFileSelected(event);
    if(this.dataImport.length > 0){
      this.listDataGroup = this.dataImport
    }
  }

  calTong(field:string) {
    let sum = 0;
    if (this.listDataGroup) {
      this.listDataGroup.forEach(item => {
        switch (field) {
          case 'gtriNhapTang':
            sum += this.nvl(item.gtriNhapTang);
            break;
          case 'gtriNhapBu':
            sum += this.nvl(item.gtriNhapBu);
            break;
          case 'gtriNhapBsung':
            sum += this.nvl(item.gtriNhapBsung);
            break;
          case 'gtriNhapKhac':
            sum += this.nvl(item.gtriNhapKhac);
            break;
          case 'gtriNhapTong':
            sum += this.nvl(item.gtriNhapTong);
            break;
          case 'gtriLuyKeTang':
            sum += this.nvl(item.gtriLuyKeTang);
            break;
          case 'gtriLuyKeBu':
            sum += this.nvl(item.gtriLuyKeBu);
            break;
          case 'gtriLuyKeBsung':
            sum += this.nvl(item.gtriLuyKeBsung);
            break;
          case 'gtriLuyKeKhac':
            sum += this.nvl(item.gtriLuyKeKhac);
            break;
          case 'gtriLuyKeTong':
            sum += this.nvl(item.gtriLuyKeTong);
            break;
        }
      })
    }
    return sum;
  }


  async handleChoose(event) {
    if (event != null) {
      let data = this.listDsDvi.find(x => x.maDvi == event)
      this.formData.get('tenDonViGui').setValue(data?.tenDvi);
    }
  }

  async layTatCaDonViByLevel() {
    let res = await this.donViService.layTatCaDonViByLevel(0);
    if (res.msg == MESSAGE.SUCCESS) {
      this.listDsDvi = res.data
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async loadDsKyBc() {
    let res = await this.danhMucService.danhMucChungGetAll("WEB_SERVICE");
    if (res.msg == MESSAGE.SUCCESS) {
      console.log(res, "3333")
      this.whitelistWebService = res.data;
    }
  }

  async checkWhiteList(){
    if(this.whitelistWebService.find(x => x.ma == "BCBN_130_05")){
      return true;
    }else{
      return false;
    }

  }
}
