import { Component, Input, OnInit } from "@angular/core";
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
import {
  DialogThemMoiSlGtriHangDtqgComponent
} from "../dialog-them-moi-sl-gtri-hang-dtqg/dialog-them-moi-sl-gtri-hang-dtqg.component";
import { cloneDeep } from 'lodash';
import { slGtriHangDtqg } from "../../../../../models/BaoCaoBoNganh";
import { Base2Component } from "../../../../../components/base2/base2.component";

@Component({
  selector: 'app-them-moi-sl-gtri-hang-dtqg',
  templateUrl: './them-moi-sl-gtri-hang-dtqg.component.html',
  styleUrls: ['./them-moi-sl-gtri-hang-dtqg.component.scss']
})
export class ThemMoiSlGtriHangDtqgComponent extends Base2Component implements OnInit {

  @Input() idInput: number;
  @Input() isView: boolean;
  listQuy: any[] = [
    { text: "Quý I", value: 1 },
    { text: "Quý II", value: 2 },
    { text: "Quý III", value: 3 },
    { text: "Quý IV", value: 4 }
  ];
  listLoaiBc: any[] = [
    {
      text: "Báo cáo năm",
      value: 1,
      thoiHanGuiBc: "Sau 05 ngày kết thúc thời gian chỉnh lý quyết toán ngân sách nhà nước"
    },
    { text: "Báo cáo quý", value: 2, thoiHanGuiBc: "Ngày 20 của tháng đầu quý sau" }
  ];
  ghiChu: string;
  dsDonVi: any[] = [];
  listDataGroup: any[] = [];
  itemRowMatHangEdit: any[] = [];
  itemRowDonViEdit: any[] = [];
  itemRowNhomMhEdit: any[] = [];
  itemRowMatHang: any[] = [];
  constructor(httpClient: HttpClient,
              storageService: StorageService,
              notification: NzNotificationService,
              spinner: NgxSpinnerService,
              modal: NzModalService,
              private bcBnTt108Service: BcBnTt130Service,
              private donViService: DonviService
  ) {
    super(httpClient, storageService, notification, spinner, modal, bcBnTt108Service);
    this.formData = this.fb.group(
      {
        id: [null],
        namBc: [dayjs().get("year"), [Validators.required]],
        kyBc: [null],
        loaiBc: [null],
        thoiHanGuiBc: [null],
        thongTuSo: ["130/2018/TT-BTC"],
        bieuSo: ["004.H/BCDTQG-BN"],
        tenDonViGui: [null],
        maDonViGui: [null],
        tenDonViNhan: [null],
        maDonViNhan: [null],
        ngayTao: [dayjs().format("YYYY-MM-DD")],
        trangThai: [STATUS.DU_THAO],
        tenTrangThai: ['Dự thảo'],
        ghiChu: [null],
      }
    );
    this.templateName = 'template_bcbn_sl_gtri_hang_dtqg.xlsx'
  }
  async ngOnInit() {
    this.spinner.show();
    this.userInfo = this.userService.getUserLogin();
    if (this.idInput != null) {
      await this.loadChiTiet(this.idInput)
    } else {
      await Promise.all([
        this.loadDsDonVi()
      ]);
      this.formData.patchValue({
        tenDonViGui: this.userInfo.TEN_DVI,
        maDonViGui: this.userInfo.MA_DVI,
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
          this.ghiChu = dataDetail.hdr.ghiChu;
          this.listDataGroup = dataDetail.detail;
          for (let i = 0; i < this.listDataGroup.length; i++) {
            this.itemRowMatHang[i] = [];
            this.itemRowMatHangEdit[i] = [];
            for (let y = 0; y < this.listDataGroup[i].children.length; y++) {
              this.itemRowMatHang[i][y] = new slGtriHangDtqg();
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
    this.formData.get("thoiHanGuiBc").setValue(this.listLoaiBc.find(item => item.value == event).thoiHanGuiBc);
  }

  quayLai() {
    this.showListEvent.emit();
  }

  async guiDuyet(id: number) {
    let trangThai = STATUS.BAN_HANH;
    let mesg = 'Ban hành quyết định'
    this.approve(id, trangThai, mesg);
  }

  async save() {
    for (let i = 0; i < this.listDataGroup.length; i++) {
      this.listDataGroup[i].thuTuHienThi = (i+1)
    }
    this.formData.get('ghiChu').setValue(this.ghiChu);
    let body = {
      "hdr" : this.formData.value,
      "detail": this.listDataGroup
    };
    let res = null;
    if (this.formData.get("id").value) {
      res = await this.bcBnTt108Service.update(body);
    } else {
      res = await this.bcBnTt108Service.create(body);
    }
    if (res.msg == MESSAGE.SUCCESS) {
      this.idInput = res.data.id;
      if (this.formData.get("id").value) {
        this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
      } else {
        this.formData.get("id").setValue(res.data.id);
        this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
        this.idInput = res.data.id;
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
          this.itemRowMatHang[i][y] = new slGtriHangDtqg();
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
    this.tinhTonCuoiKy(this.itemRowMatHangEdit[i][y][z]);
    this.listDataGroup[i].children[y].children[z] = this.itemRowMatHangEdit[i][y][z];
    this.listDataGroup[i].children[y].children[z].edit = false;
    this.itemRowMatHangEdit[i][y][z] = {};
    this.tinhTongGtriNhomMh();
    this.tinhTongGtriDvi();
  }

  cancelEditRowMatHang(i: number, y: number, z: number) {
    this.listDataGroup[i].children[y].children[z].edit = false;
    this.itemRowMatHangEdit[i][y][z] = {}
  }

  addRowMatHang(i: number, y: number) {
    this.tinhTonCuoiKy(this.itemRowMatHang[i][y]);
    this.listDataGroup[i].children[y].children = [
      ...this.listDataGroup[i].children[y].children,
      this.itemRowMatHang[i][y]
    ];
    this.clearItemRowMatHang(i, y);
    this.tinhTongGtriNhomMh();
    this.tinhTongGtriDvi();
  }

  clearItemRowMatHang(i: number, y: number) {
    this.itemRowMatHang[i][y] = new slGtriHangDtqg();
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
    this.tinhTonCuoiKy(this.itemRowNhomMhEdit[i][y]);
    this.listDataGroup[i].children[y] = this.itemRowNhomMhEdit[i][y];
    this.listDataGroup[i].children[y].edit = false;
    this.itemRowNhomMhEdit[i][y] = {};
    this.tinhTongGtriDvi();
  }

  cancelEditRowNhomMh(i: number, y: number) {
    this.listDataGroup[i].children[y].edit = false;
    this.itemRowNhomMhEdit[i][y] = {};
  }

  tinhTongGtriDvi (){
    for (let dvi of this.listDataGroup) {
      dvi.gtriTonDauNam = 0
      dvi.gtriTonDauKy = 0
      dvi.gtriNhapTrongKy = 0
      dvi.gtriNhapLuyKe = 0
      dvi.gtriXuatTrongKy = 0
      dvi.gtriXuatLuyKe = 0
      dvi.gtriTonCuoiQuy = 0
      for (let nhomMh of dvi.children) {
        dvi.gtriTonDauNam += this.nvl(nhomMh.gtriTonDauNam)
        dvi.gtriTonDauKy += this.nvl(nhomMh.gtriTonDauKy)
        dvi.gtriNhapTrongKy += this.nvl(nhomMh.gtriNhapTrongKy)
        dvi.gtriNhapLuyKe += this.nvl(nhomMh.gtriNhapLuyKe)
        dvi.gtriXuatTrongKy += this.nvl(nhomMh.gtriXuatTrongKy)
        dvi.gtriXuatLuyKe += this.nvl(nhomMh.gtriXuatLuyKe)
        dvi.gtriTonCuoiQuy += this.nvl(nhomMh.gtriTonCuoiQuy)
      }
    }
  }
  tinhTongGtriNhomMh (){
    for (let dvi of this.listDataGroup) {
      for (let nhomMh of dvi.children) {
        if (nhomMh.coNhieuMatHang == true) {
          nhomMh.gtriTonDauNam = 0
          nhomMh.gtriTonDauKy = 0
          nhomMh.gtriNhapTrongKy = 0
          nhomMh.gtriNhapLuyKe = 0
          nhomMh.gtriXuatTrongKy = 0
          nhomMh.gtriXuatLuyKe = 0
          nhomMh.gtriTonCuoiQuy = 0
          for (let matHang of nhomMh.children) {
            nhomMh.gtriTonDauNam += this.nvl(matHang.gtriTonDauNam)
            nhomMh.gtriTonDauKy += this.nvl(matHang.gtriTonDauKy)
            nhomMh.gtriNhapTrongKy += this.nvl(matHang.gtriNhapTrongKy)
            nhomMh.gtriNhapLuyKe += this.nvl(matHang.gtriNhapLuyKe)
            nhomMh.gtriXuatTrongKy += this.nvl(matHang.gtriXuatTrongKy)
            nhomMh.gtriXuatLuyKe += this.nvl(matHang.gtriXuatLuyKe)
            nhomMh.gtriTonCuoiQuy += this.nvl(matHang.gtriTonCuoiQuy)
          }
        }
      }
    }
  }
  tinhTonCuoiKy (data: slGtriHangDtqg){
    data.slTonCuoiQuy = data.slTonDauKy+ data.slNhapTrongKy - data.slXuatTrongKy;
    data.gtriTonCuoiQuy = data.gtriTonDauKy+ data.gtriNhapTrongKy - data.gtriXuatTrongKy;
  }

  calTongGtriTonDauNam() {
    if (this.listDataGroup) {
      let sum = 0
      this.listDataGroup.forEach(item => {
        sum += this.nvl(item.gtriTonDauNam);
      })
      return sum;
    }
  }
  calTongGtriTonDauKy() {
    if (this.listDataGroup) {
      let sum = 0
      this.listDataGroup.forEach(item => {
        sum += this.nvl(item.gtriTonDauKy);
      })
      return sum;
    }
  }
  calTongGtriNhapTrongKy() {
    if (this.listDataGroup) {
      let sum = 0
      this.listDataGroup.forEach(item => {
        sum += this.nvl(item.gtriNhapTrongKy);
      })
      return sum;
    }
  }
  calTongGtriNhapLuyKe() {
    if (this.listDataGroup) {
      let sum = 0
      this.listDataGroup.forEach(item => {
        sum += this.nvl(item.gtriNhapLuyKe);
      })
      return sum;
    }
  }
  calTongGtriXuatTrongKy() {
    if (this.listDataGroup) {
      let sum = 0
      this.listDataGroup.forEach(item => {
        sum += this.nvl(item.gtriXuatTrongKy);
      })
      return sum;
    }
  }
  calTongGtriXuatLuyKe() {
    if (this.listDataGroup) {
      let sum = 0
      this.listDataGroup.forEach(item => {
        sum += this.nvl(item.gtriXuatLuyKe);
      })
      return sum;
    }
  }
  calTongGtriTonCuoiQuy() {
    if (this.listDataGroup) {
      let sum = 0
      this.listDataGroup.forEach(item => {
        sum += this.nvl(item.gtriTonCuoiQuy);
      })
      return sum;
    }
  }

  async handleSelectFile(event: any){
    await this.onFileSelected(event);
    if(this.dataImport.length > 0){
      this.listDataGroup = this.dataImport
    }
  }
}
