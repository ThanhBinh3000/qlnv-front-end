import { Component, Input, OnInit } from "@angular/core";
import { Base2Component } from "../../../../../components/base2/base2.component";
import { HttpClient } from "@angular/common/http";
import { StorageService } from "../../../../../services/storage.service";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NgxSpinnerService } from "ngx-spinner";
import { NzModalService } from "ng-zorro-antd/modal";
import { BcBnTt130Service } from "../../../../../services/bao-cao/BcBnTt130.service";
import * as dayjs from "dayjs";
import { Validators } from "@angular/forms";
import { MESSAGE } from "../../../../../constants/message";
import { DonviService } from "../../../../../services/donvi.service";
import { cloneDeep } from "lodash";
import { STATUS } from "../../../../../constants/status";
import { DanhMucService } from "../../../../../services/danhmuc.service";
import { saveAs } from 'file-saver';
import {CurrencyMaskInputMode} from "ngx-currency";

@Component({
  selector: "app-them-moi-nguon-hinh-thanh-dtqg",
  templateUrl: "./them-moi-nguon-hinh-thanh-dtqg.component.html",
  styleUrls: ["./them-moi-nguon-hinh-thanh-dtqg.component.scss"]
})
export class ThemMoiNguonHinhThanhDtqgComponent extends Base2Component implements OnInit {

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
      thoiHanGuiBc: "Sau 25 ngày kết thúc năm"
    },
    { text: "Báo cáo quý", value: 2, thoiHanGuiBc: "Ngày 20 của tháng đầu quý sau" }
  ];
  whitelistWebService: any = {};
  dsDonVi: any[] = [];
  dataNguonNsnn: any[] = [];
  dataNguonNgoaiNsnn: any[] = [];
  itemRowNguon: any = {};
  itemRowNgoaiNguon: any = {};
  itemRowNguonEdit: any[] = [];
  itemRowNgoaiNguonEdit: any[] = [];
  listNguonVon: any[] = [];
  ghiChu: string = "Dấu “x” tại các hàng trong biểu là nội dung không phải tổng hợp, báo cáo.";
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
  // listCloaiVthh: any[] = [];
  // optionsCloaiVthh: any[] = [];
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
        bieuSo: ["001.H/BCDTQG-BN"],
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
    this.templateName = 'template_bcbn_nguon_hinh_thanh_dtqg.xlsx'
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
  deleteRowNguon(index:number){
    this.dataNguonNsnn.splice(index, 1)
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
  deleteRowNgoaiNguon(index:number){
    this.dataNguonNgoaiNsnn.splice(index, 1)
  }

  editRowNgoaiNguon(index: number) {
    this.dataNguonNgoaiNsnn[index].edit = true;
    this.itemRowNgoaiNguonEdit[index] = cloneDeep(this.dataNguonNgoaiNsnn[index]);
  }

  saveEditRowNgoaiNguon(index: number) {
    if (this.validateItemSave(this.itemRowNgoaiNguonEdit[index])) {
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
    }
  }

  cancelEditRowNgoaiNguon(index: number) {
    this.dataNguonNgoaiNsnn[index].edit = false;
  }

  quayLai() {
    this.showListEvent.emit();
  }

  async save(isBanHanh?: boolean) {
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      return;
    }
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



  // downloadTemplate(templateName: any) {
  //   this.bcBnTt108Service.downloadTemplate(templateName).then( s => {
  //     const blob = new Blob([s], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  //     saveAs(blob, templateName);
  //   });
  // }
  async handleSelectFile(event: any){
    await this.onFileSelected(event);
    if(this.dataImport.length > 0){
      this.dataNguonNsnn = this.dataImport.filter(obj => obj.loaiNguon === 1);
      this.dataNguonNgoaiNsnn = this.dataImport.filter(obj => obj.loaiNguon === 2);
    }
    this.dataNguonNsnn.forEach(item => {
      item.tongTrongKy = this.nvl(item.muaTangTrongKy) + this.nvl(item.muaBuTrongKy) + this.nvl(item.muaBsungTrongKy) + this.nvl(item.khacTrongKy);
      item.tongLuyKe = this.nvl(item.muaTangLuyKe) + this.nvl(item.muaBuLuyKe) + this.nvl(item.muaBsungLuyKe) + this.nvl(item.khacLuyKe);
    })
    this.tongRowNguon();
  }
  calTongChi() {
    let sum = 0
    if (this.dataNguonNsnn) {
      this.dataNguonNsnn.forEach(item => {
        if (item.dmLevel == 1) {
          sum += this.nvl(item.tongTrongKy);
        }
      })
    }
    if (this.dataNguonNgoaiNsnn) {
      this.dataNguonNgoaiNsnn.forEach(item => {
        if (item.dmLevel == 1) {
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
    let data = this.listDsDvi.find(x => x.maDvi == event)
    this.formData.get('tenDonViGui').setValue(data.tenDvi);
    // let res = await this.danhMucService.getDanhMucHangHoaDvql({
    //   'maDvi': data.maDvi ? (data.maDvi == '01' ? '0101' : data.maDvi) : this.userInfo.MA_DVI,
    // }).toPromise();
    // if (res.msg == MESSAGE.SUCCESS) {
    //   this.listCloaiVthh = res.data;
    //   this.optionsCloaiVthh = this.listCloaiVthh
    // }
  }

  async layTatCaDonViByLevel() {
    let res = await this.donViService.layTatCaDonViByLevel(0);
    if (res.msg == MESSAGE.SUCCESS) {
      this.listDsDvi = res.data
      // this.formData.get('dviNhan').setValue(res.data[0].tenDvi);
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
    if(this.whitelistWebService.find(x => x.ma == "BCBN_130_01")){
      return true;
    }else{
      return false;
    }

  }
}
