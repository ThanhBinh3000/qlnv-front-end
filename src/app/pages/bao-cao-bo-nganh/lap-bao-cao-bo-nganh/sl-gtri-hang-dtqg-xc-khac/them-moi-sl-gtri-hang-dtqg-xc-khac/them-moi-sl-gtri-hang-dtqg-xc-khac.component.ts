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
import { slGtriHangDtqgXcKhac } from "../../../../../models/BaoCaoBoNganh";
import {
  DialogThemMoiSlGtriHangDtqgComponent
} from "../../sl-gtri-hang-dtqg/dialog-them-moi-sl-gtri-hang-dtqg/dialog-them-moi-sl-gtri-hang-dtqg.component";
import { cloneDeep } from 'lodash';
import { Base2Component } from "../../../../../components/base2/base2.component";
import {CurrencyMaskInputMode} from "ngx-currency";

@Component({
  selector: 'app-them-moi-sl-gtri-hang-dtqg-xc-khac',
  templateUrl: './them-moi-sl-gtri-hang-dtqg-xc-khac.component.html',
  styleUrls: ['./them-moi-sl-gtri-hang-dtqg-xc-khac.component.scss']
})
export class ThemMoiSlGtriHangDtqgXcKhacComponent extends Base2Component implements OnInit {

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
        bieuSo: ["008.H/BCDTQG-BN"],
        tenDonViGui: [null],
        maDonViGui: [null],
        tenDonViNhan: [null],
        maDonViNhan: [null],
        ngayTao: [dayjs().format("YYYY-MM-DD")],
        trangThai: [STATUS.DU_THAO],
        tenTrangThai: ['Dự thảo'],
      }
    );
    this.templateName = 'template_bcbn_sl_gtri_hang_dtqg_xuat_cap_ct.xlsx'
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
          this.listDataGroup = dataDetail.detail;
          for (let i = 0; i < this.listDataGroup.length; i++) {
            this.itemRowMatHang[i] = [];
            this.itemRowMatHangEdit[i] = [];
            for (let y = 0; y < this.listDataGroup[i].children.length; y++) {
              this.itemRowMatHang[i][y] = new slGtriHangDtqgXcKhac();
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
          this.itemRowMatHang[i][y] = new slGtriHangDtqgXcKhac();
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
    this.itemRowMatHang[i][y] = new slGtriHangDtqgXcKhac();
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
      dvi.gtriXuatCuuTro = 0
      dvi.gtriXuatHoTro = 0
      dvi.gtriXuatPvuQp = 0
      dvi.gtriXuatPvuAnNinh = 0
      dvi.gtriXuatKhac = 0
      dvi.gtriXuatTong = 0
      dvi.gtriLuyKeCuuTro = 0
      dvi.gtriLuyKeHoTro = 0
      dvi.gtriLuyKePvuQp = 0
      dvi.gtriLuyKePvuAnNinh = 0
      dvi.gtriLuyKeKhac = 0
      dvi.gtriLuyKeTong = 0
      for (let nhomMh of dvi.children) {
        dvi.gtriXuatCuuTro += this.nvl(nhomMh.gtriXuatCuuTro)
        dvi.gtriXuatHoTro += this.nvl(nhomMh.gtriXuatHoTro)
        dvi.gtriXuatPvuQp += this.nvl(nhomMh.gtriXuatPvuQp)
        dvi.gtriXuatPvuAnNinh += this.nvl(nhomMh.gtriXuatPvuAnNinh)
        dvi.gtriXuatKhac += this.nvl(nhomMh.gtriXuatKhac)
        dvi.gtriXuatTong += this.nvl(nhomMh.gtriXuatTong)
        dvi.gtriLuyKeCuuTro += this.nvl(nhomMh.gtriLuyKeCuuTro)
        dvi.gtriLuyKeHoTro += this.nvl(nhomMh.gtriLuyKeHoTro)
        dvi.gtriLuyKePvuQp += this.nvl(nhomMh.gtriLuyKePvuQp)
        dvi.gtriLuyKePvuAnNinh += this.nvl(nhomMh.gtriLuyKePvuAnNinh)
        dvi.gtriLuyKeKhac += this.nvl(nhomMh.gtriLuyKeKhac)
        dvi.gtriLuyKeTong += this.nvl(nhomMh.gtriLuyKeTong)
      }
    }
  }
  tinhTongGtriNhomMh (){
    for (let dvi of this.listDataGroup) {
      for (let nhomMh of dvi.children) {
        if (nhomMh.coNhieuMatHang == true) {
          nhomMh.gtriXuatCuuTro = 0
          nhomMh.gtriXuatHoTro = 0
          nhomMh.gtriXuatPvuQp = 0
          nhomMh.gtriXuatPvuAnNinh = 0
          nhomMh.gtriXuatKhac = 0
          nhomMh.gtriXuatTong = 0
          nhomMh.gtriLuyKeCuuTro = 0
          nhomMh.gtriLuyKeHoTro = 0
          nhomMh.gtriLuyKePvuQp = 0
          nhomMh.gtriLuyKePvuAnNinh = 0
          nhomMh.gtriLuyKeKhac = 0
          nhomMh.gtriLuyKeTong = 0
          for (let matHang of nhomMh.children) {
            nhomMh.gtriXuatCuuTro += this.nvl(matHang.gtriXuatCuuTro)
            nhomMh.gtriXuatHoTro += this.nvl(matHang.gtriXuatHoTro)
            nhomMh.gtriXuatPvuQp += this.nvl(matHang.gtriXuatPvuQp)
            nhomMh.gtriXuatPvuAnNinh += this.nvl(matHang.gtriXuatPvuAnNinh)
            nhomMh.gtriXuatKhac += this.nvl(matHang.gtriXuatKhac)
            nhomMh.gtriXuatTong += this.nvl(matHang.gtriXuatTong)
            nhomMh.gtriLuyKeCuuTro += this.nvl(matHang.gtriLuyKeCuuTro)
            nhomMh.gtriLuyKeHoTro += this.nvl(matHang.gtriLuyKeHoTro)
            nhomMh.gtriLuyKePvuQp += this.nvl(matHang.gtriLuyKePvuQp)
            nhomMh.gtriLuyKePvuAnNinh += this.nvl(matHang.gtriLuyKePvuAnNinh)
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

  calTongGtri(field: string) {
    if (this.listDataGroup) {
      let sum = 0
      this.listDataGroup.forEach(item => {
        switch (field) {
          case 'gtriXuatCuuTro':
            sum += this.nvl(item.gtriXuatCuuTro);
            break;
          case 'gtriXuatHoTro':
            sum += this.nvl(item.gtriXuatHoTro);
            break;
          case 'gtriXuatPvuQp':
            sum += this.nvl(item.gtriXuatPvuQp);
            break;
          case 'gtriXuatPvuAnNinh':
            sum += this.nvl(item.gtriXuatPvuAnNinh);
            break;
          case 'gtriXuatKhac':
            sum += this.nvl(item.gtriXuatKhac);
            break;
          case 'gtriXuatTong':
            sum += this.nvl(item.gtriXuatTong);
            break;
          case 'gtriLuyKeCuuTro':
            sum += this.nvl(item.gtriLuyKeCuuTro);
            break;
          case 'gtriLuyKeHoTro':
            sum += this.nvl(item.gtriLuyKeHoTro);
            break;
          case 'gtriLuyKePvuQp':
            sum += this.nvl(item.gtriLuyKePvuQp);
            break;
          case 'gtriLuyKePvuAnNinh':
            sum += this.nvl(item.gtriLuyKePvuAnNinh);
            break;
          case 'gtriLuyKeKhac':
            sum += this.nvl(item.gtriLuyKeKhac);
            break;
          case 'gtriLuyKeTong':
            sum += this.nvl(item.gtriLuyKeTong);
            break;
        }
      })
      return sum;
    }
  }
}
