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
import { cloneDeep } from "lodash";
import { Base2Component } from "../../../../../components/base2/base2.component";
import { DanhMucService } from "../../../../../services/danhmuc.service";
import {CurrencyMaskInputMode} from "ngx-currency";
@Component({
  selector: 'app-them-moi-tong-chi-mua-hang',
  templateUrl: './them-moi-tong-chi-mua-hang.component.html',
  styleUrls: ['./them-moi-tong-chi-mua-hang.component.scss']
})
export class ThemMoiTongChiMuaHangComponent extends Base2Component implements OnInit {

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
  dsDonVi: any[] = [];
  dataNguonNsnn: any[] = [];
  dataNguonNgoaiNsnn: any[] = [];
  itemRowNguon: any = {};
  itemRowNgoaiNguon: any = {};
  itemRowNguonEdit: any[] = [];
  itemRowNgoaiNguonEdit: any[] = [];
  listNguonVon: any[] = [];
  ghiChu: string = "Dấu “x” tại các hàng trong biểu là nội dung không phải tổng hợp, báo cáo.";
  templateName: any
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
        namBc: [dayjs().get("year"), [Validators.required]],
        kyBc: [null],
        loaiBc: [null],
        thoiHanGuiBc: [null],
        thongTuSo: ["130/2018/TT-BTC"],
        bieuSo: ["002.H/BCDTQG-BN"],
        tenDonViGui: [null],
        maDonViGui: [null],
        tenDonViNhan: [null],
        maDonViNhan: [null],
        ngayTao: [dayjs().format("YYYY-MM-DD")],
        trangThai: [STATUS.DU_THAO],
        tenTrangThai: ['Dự thảo'],
      }
    );
    this.templateName = 'template_bcbn_tinh_chi_cho_mua_hang_dtqg.xlsx'
  }

  async ngOnInit() {
    this.spinner.show();
    this.userInfo = this.userService.getUserLogin();
    await Promise.all([
      this.layTatCaDonViByLevel(),
    ]);
    if (this.idInput != null) {
      await this.loadChiTiet(this.idInput)
    } else {
      await Promise.all([
        this.loadDsDonVi(),
        this.nguonVonGetAll()
      ]);
      this.formData.patchValue({
        tenDonViNhan: this.dsDonVi[0].tenDvi,
        maDonViNhan: this.dsDonVi[0].maDvi
      });
      this.initData();
    }
    this.spinner.hide();
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
  async nguonVonGetAll() {
    this.listNguonVon = [];
    let res = await this.danhMucService.nguonVonGetAll();
    if (res.msg == MESSAGE.SUCCESS) {
      this.listNguonVon = res.data;
    }
  }

  changeLoaiBc(event) {
    if (event != null) {
      this.formData.get("thoiHanGuiBc").setValue(this.listLoaiBc.find(item => item.value == event).thoiHanGuiBc);
    }
  }

  initData() {
    let lstCha = this.listNguonVon.filter(i => i.maCha == null);
    let lstCon = this.listNguonVon.filter(i => i.maCha != null);
    this.dataNguonNsnn.push({ "noiDung": "I. " + lstCha[0].giaTri, "maSo": "01" , "dmLevel": 1})
    for (let i = 0; i < lstCon.length; i++) {
      this.dataNguonNsnn.push({ "noiDung": (i+1) + ". " + lstCon[i].giaTri, "maSo": "0" + (i+1) , "dmLevel": 2})
    }
    this.dataNguonNgoaiNsnn = [{ "noiDung": "II. Nguồn lực hợp pháp ngoài NSNN", "maSo": "05" , "dmLevel": 1}];
  }

  addRowNguon(): void {
    if (this.validateItemSave(this.itemRowNguon)) {
      this.itemRowNguon.tongTrongKy = this.nvl(this.itemRowNguon.muaTangTrongKy) + this.nvl(this.itemRowNguon.muaBuTrongKy)
        + this.nvl(this.itemRowNguon.muaBsungTrongKy) + this.nvl(this.itemRowNguon.khacTrongKy);
      this.itemRowNguon.tongLuyKe = this.nvl(this.itemRowNguon.muaTangLuyKe) + this.nvl(this.itemRowNguon.muaBuLuyKe)
        + this.nvl(this.itemRowNguon.muaBsungLuyKe) + this.nvl(this.itemRowNguon.khacLuyKe);
      this.itemRowNguon.dmLevel = 2;
      this.dataNguonNsnn = [
        ...this.dataNguonNsnn,
        this.itemRowNguon
      ];
      this.clearItemRow();
      this.tongRowNguon()
    }
  }

  clearItemRow() {
    this.itemRowNguon = {};
  }

  validateItemSave(dataSave): boolean {
    if (dataSave.noiDung && dataSave.maSo) {
      return true;
    } else {
      this.notification.error(MESSAGE.ERROR, "Xin vui lòng điền đủ nội dung và mã số");
      return false;
    }
  }

  addRowNgoaiNguon(): void {
    if (this.validateItemNnSave(this.itemRowNgoaiNguon)) {
      // this.itemRowNgoaiNguon.tongTrongKy = this.nvl(this.itemRowNgoaiNguon.muaTangTrongKy) + this.nvl(this.itemRowNgoaiNguon.muaBuTrongKy)
      //   + this.nvl(this.itemRowNgoaiNguon.muaBsungTrongKy) + this.nvl(this.itemRowNgoaiNguon.khacTrongKy);
      // this.itemRowNgoaiNguon.tongLuyKe = this.nvl(this.itemRowNgoaiNguon.muaTangLuyKe) + this.nvl(this.itemRowNgoaiNguon.muaBuLuyKe)
      //   + this.nvl(this.itemRowNgoaiNguon.muaBsungLuyKe) + this.nvl(this.itemRowNgoaiNguon.khacLuyKe);
      this.itemRowNgoaiNguon.dmLevel = 2;
      this.dataNguonNgoaiNsnn = [
        ...this.dataNguonNgoaiNsnn,
        this.itemRowNgoaiNguon
      ];
      if (this.dataNguonNgoaiNsnn.length > 1) {
        let tongChi = 0;
        let tongLuyKe = 0;
        for (let item of this.dataNguonNgoaiNsnn) {
          if (item.dmLevel == 2) {
            tongChi += item.tongTrongKy;
            tongLuyKe += item.tongLuyKe;
          }
        }
        this.dataNguonNgoaiNsnn[0].tongTrongKy = tongChi;
        this.dataNguonNgoaiNsnn[0].tongLuyKe = tongLuyKe;
      }
      this.clearItemRowNn();
    }
  }

  clearItemRowNn() {
    this.itemRowNgoaiNguon = {};
  }

  validateItemNnSave(dataSave): boolean {
    if (dataSave.noiDung && dataSave.maSo
    ) {
      return true;
    } else {
      this.notification.error(MESSAGE.ERROR, "Xin vui lòng điền đủ nội dung và mã số");
      return false;
    }
  }

  editRowNguon(index: number) {
    this.dataNguonNsnn[index].edit = true;
    this.itemRowNguonEdit[index] = cloneDeep(this.dataNguonNsnn[index]);
  }

  saveEditRowNguon(index: number) {
    if (this.validateItemSave(this.itemRowNguonEdit[index])) {
      this.itemRowNguonEdit[index].tongTrongKy = this.nvl(this.itemRowNguonEdit[index].muaTangTrongKy) + this.nvl(this.itemRowNguonEdit[index].muaBuTrongKy)
        + this.nvl(this.itemRowNguonEdit[index].muaBsungTrongKy) + this.nvl(this.itemRowNguonEdit[index].khacTrongKy);
      this.itemRowNguonEdit[index].tongLuyKe = this.nvl(this.itemRowNguonEdit[index].muaTangLuyKe) + this.nvl(this.itemRowNguonEdit[index].muaBuLuyKe)
        + this.nvl(this.itemRowNguonEdit[index].muaBsungLuyKe) + this.nvl(this.itemRowNguonEdit[index].khacLuyKe);
      this.dataNguonNsnn[index] = this.itemRowNguonEdit[index];
      this.dataNguonNsnn[index].edit = false;
      this.tongRowNguon()
    }
  }

  tongRowNguon () {
    let tongTrongKy = 0;
    let tongLuyKe = 0;
    let muaTangTrongKy = 0;
    let muaBuTrongKy = 0;
    let muaBsungTrongKy = 0;
    let khacTrongKy = 0;
    let muaTangLuyKe = 0;
    let muaBuLuyKe = 0;
    let muaBsungLuyKe = 0;
    let khacLuyKe = 0;
    this.dataNguonNsnn.forEach(item => {
      if (item.dmLevel == 2) {
        tongTrongKy += this.nvl(item.tongTrongKy);
        tongLuyKe += this.nvl(item.tongLuyKe);
        muaTangTrongKy += this.nvl(item.muaTangTrongKy);
        muaBuTrongKy += this.nvl(item.muaBuTrongKy);
        muaBsungTrongKy += this.nvl(item.muaBsungTrongKy);
        khacTrongKy += this.nvl(item.khacTrongKy);
        muaTangLuyKe += this.nvl(item.muaTangLuyKe);
        muaBuLuyKe += this.nvl(item.muaBuLuyKe);
        muaBsungLuyKe += this.nvl(item.muaBsungLuyKe);
        khacLuyKe += this.nvl(item.khacLuyKe);
      }
    })
    this.dataNguonNsnn[0].tongTrongKy = tongTrongKy
    this.dataNguonNsnn[0].tongLuyKe = tongLuyKe
    this.dataNguonNsnn[0].muaTangTrongKy = muaTangTrongKy
    this.dataNguonNsnn[0].muaBuTrongKy = muaBuTrongKy
    this.dataNguonNsnn[0].muaBsungTrongKy = muaBsungTrongKy
    this.dataNguonNsnn[0].khacTrongKy = khacTrongKy
    this.dataNguonNsnn[0].muaTangLuyKe = muaTangLuyKe
    this.dataNguonNsnn[0].muaBuLuyKe = muaBuLuyKe
    this.dataNguonNsnn[0].muaBsungLuyKe = muaBsungLuyKe
    this.dataNguonNsnn[0].khacLuyKe = khacLuyKe
  }

  cancelEditRowNguon(index: number) {
    this.dataNguonNsnn[index].edit = false;
  }

  editRowNgoaiNguon(index: number) {
    this.dataNguonNgoaiNsnn[index].edit = true;
    this.itemRowNgoaiNguonEdit[index] = cloneDeep(this.dataNguonNgoaiNsnn[index]);
  }

  saveEditRowNgoaiNguon(index: number) {
    if (this.validateItemSave(this.itemRowNgoaiNguonEdit[index])) {
      // if (this.itemRowNgoaiNguon.dmLevel == 2) {
      //   this.itemRowNgoaiNguon.tongTrongKy = this.nvl(this.itemRowNgoaiNguon.muaTangTrongKy) + this.nvl(this.itemRowNgoaiNguon.muaBuTrongKy)
      //     + this.nvl(this.itemRowNgoaiNguon.muaBsungTrongKy) + this.nvl(this.itemRowNgoaiNguon.khacTrongKy);
      //   this.itemRowNgoaiNguon.tongLuyKe = this.nvl(this.itemRowNgoaiNguon.muaTangLuyKe) + this.nvl(this.itemRowNgoaiNguon.muaBuLuyKe)
      //     + this.nvl(this.itemRowNgoaiNguon.muaBsungLuyKe) + this.nvl(this.itemRowNgoaiNguon.khacLuyKe);
      // }
      this.dataNguonNgoaiNsnn[index] = this.itemRowNgoaiNguonEdit[index];
      this.dataNguonNgoaiNsnn[index].edit = false;
      if (this.dataNguonNgoaiNsnn.length > 1) {
        let tongChi = 0;
        let tongLuyKe = 0;
        for (let item of this.dataNguonNgoaiNsnn) {
          if (item.dmLevel == 2) {
            tongChi += item.tongTrongKy;
            tongLuyKe += item.tongLuyKe;
          }
        }
        this.dataNguonNgoaiNsnn[0].tongTrongKy = tongChi;
        this.dataNguonNgoaiNsnn[0].tongLuyKe = tongLuyKe;
      }
      // let sum = 0
      // this.dataNguonNgoaiNsnn.forEach(item => {
      //   if (item.dmLevel == 2) {
      //     sum += this.nvl(item.tongTrongKy);
      //   }
      // })
      // this.dataNguonNgoaiNsnn[0].tongTrongKy = sum
    }
  }

  cancelEditRowNgoaiNguon(index: number) {
    this.dataNguonNgoaiNsnn[index].edit = false;
  }

  nvl(item: number) {
    if (item == null) {
      return 0;
    }
    return item;
  }

  quayLai() {
    this.showListEvent.emit();
  }

  async save(isBanHanh?: boolean) {
    this.dataNguonNsnn.forEach(i => {
      i.loaiNguon = 1
    })
    this.dataNguonNgoaiNsnn.forEach(i => {
      i.loaiNguon = 2
    })
    let body = {
      "hdr" : this.formData.value,
      "detail" : [...this.dataNguonNsnn, ...this.dataNguonNgoaiNsnn]
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
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async loadChiTiet(id:number) {
    await this.bcBnTt108Service
      .getDetail(id)
      .then((res) => {
        if (res.msg == MESSAGE.SUCCESS) {
          const dataDetail = res.data;
          this.helperService.bidingDataInFormGroup(this.formData, dataDetail.hdr);
          this.dataNguonNsnn = dataDetail.detail.filter(obj => obj.loaiNguon === 1);
          this.dataNguonNgoaiNsnn = dataDetail.detail.filter(obj => obj.loaiNguon === 2);
        }})
      .catch((e) => {
        console.log('error: ', e);
        this.spinner.hide();
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      });
  }
  deleteRowNguon(index:number){
    this.dataNguonNsnn.splice(index, 1)
  }
  deleteRowNgoaiNguon(index:number){
    this.dataNguonNgoaiNsnn.splice(index, 1)
  }

  async handleSelectFile(event: any){
    await this.onFileSelected(event);
    if(this.dataImport.length > 0){
      this.dataNguonNsnn = this.dataImport.filter(obj => obj.loaiNguon === 1);
      this.dataNguonNgoaiNsnn = this.dataImport.filter(obj => obj.loaiNguon === 2);
    }
  }

  calTongChi() {
    let sum = 0
    if (this.dataNguonNsnn) {
      this.dataNguonNsnn.forEach(item => {
        if (item.dmLevel == 2) {
          sum += this.nvl(item.tongTrongKy);
        }
      })
    }
    if (this.dataNguonNgoaiNsnn) {
      this.dataNguonNgoaiNsnn.forEach(item => {
        if (item.dmLevel == 2) {
          sum += this.nvl(item.tongTrongKy);
        }
      })
    }
    return sum;
  }

  calTongLuyKe() {
    let sum = 0
    if (this.dataNguonNsnn) {
      this.dataNguonNsnn.forEach(item => {
        if (item.dmLevel == 1) {
          sum += this.nvl(item.tongLuyKe);
        }
      })
    }
    if (this.dataNguonNgoaiNsnn) {
      this.dataNguonNgoaiNsnn.forEach(item => {
        if (item.dmLevel == 1) {
          sum += this.nvl(item.tongLuyKe);
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
}
