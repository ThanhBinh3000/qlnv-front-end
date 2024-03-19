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
import { khMuaHangDtqg } from "../../../../../models/BaoCaoBoNganh";
import { cloneDeep } from 'lodash';
import {
  DialogThemMoiKhMuaHangDtqgComponent
} from "../dialog-them-moi-kh-mua-hang-dtqg/dialog-them-moi-kh-mua-hang-dtqg.component";
import {CurrencyMaskInputMode} from "ngx-currency";
import {DanhMucService} from "../../../../../services/danhmuc.service";

@Component({
  selector: 'app-them-moi-kh-mua-hang-dtqg',
  templateUrl: './them-moi-kh-mua-hang-dtqg.component.html',
  styleUrls: ['./them-moi-kh-mua-hang-dtqg.component.scss']
})
export class ThemMoiKhMuaHangDtqgComponent extends Base2Component implements OnInit {

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
        bieuSo: ["003.H/BCDTQG-BN"],
        tenDonViGui: [null],
        maDonViGui: [null, [Validators.required]],
        tenDonViNhan: [null],
        maDonViNhan: [null],
        ngayTao: [dayjs().format("YYYY-MM-DD")],
        trangThai: [STATUS.DU_THAO],
        tenTrangThai: ['Dự thảo'],
      }
    );
    this.templateName = 'template_bcbn_kh_mua_hang_dtqg.xlsx'
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
      ]);
      this.formData.patchValue({
        tenDonViNhan: this.dsDonVi[0].tenDvi,
        maDonViNhan: this.dsDonVi[0].maDvi
      });
      this.initData();
    }
    this.spinner.hide();
  }

  initData() {
    let row1 = new khMuaHangDtqg();
    row1.danhMuc = "I. Kế hoạch mua tăng";
    row1.maSo = "01";
    row1.children = []
    this.listDataGroup.push(row1);
    let row2 = new khMuaHangDtqg();
    row2.danhMuc = "II. Kế hoạch mua bù";
    row2.maSo = "02";
    row2.children = []
    this.listDataGroup.push(row2);
    let row3 = new khMuaHangDtqg();
    row3.danhMuc = "III. Kế hoạch mua bổ sung";
    row3.maSo = "03";
    row3.children = []
    this.listDataGroup.push(row3);
    let row4 = new khMuaHangDtqg();
    row4.danhMuc = "IV. Kế hoạch giao mua hàng trong trường hợp khác";
    row4.maSo = "04";
    row4.children = []
    this.listDataGroup.push(row4);
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
              this.itemRowMatHang[i][y] = new khMuaHangDtqg();
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
      nzContent: DialogThemMoiKhMuaHangDtqgComponent,
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
      this.listDataGroup.forEach(dvi => {
        if (dvi.danhMuc ==  res.danhMuc) {
          dvi.children = [...dvi.children, res.children[0]]
        }
      })
      for (let i = 0; i < this.listDataGroup.length; i++) {
        this.itemRowMatHang[i] = [];
        this.itemRowMatHangEdit[i] = [];
        this.itemRowNhomMhEdit[i] = [];
        for (let y = 0; y < this.listDataGroup[i].children.length; y++) {
          this.itemRowMatHang[i][y] = new khMuaHangDtqg();
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
      if (this.listDataGroup[i].children != null) {
        for (let y = 0; y < this.listDataGroup[i].children.length; y++) {
          if (this.itemRowMatHangEdit[i][y] == undefined) {
            this.itemRowMatHangEdit[i][y] = [];
          }
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
    this.itemRowMatHang[i][y] = new khMuaHangDtqg();
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
      dvi.gtriKhNamTruoc = 0
      dvi.gtriKhGiaoTrongNam = 0
      dvi.gtriTongKhDuocGiao = 0
      dvi.gtriThucHienNamTruoc = 0
      dvi.gtriThucHienGiaoTrongNam = 0
      dvi.gtriTongThucHienTrongNam = 0
      dvi.gtriChuyenSangNamSau = 0
      dvi.gtriHuyDuToan = 0
      dvi.gtriTongDuToanConLai = 0
      for (let nhomMh of dvi.children) {
        dvi.gtriKhNamTruoc += this.nvl(nhomMh.gtriKhNamTruoc)
        dvi.gtriKhGiaoTrongNam += this.nvl(nhomMh.gtriKhGiaoTrongNam)
        dvi.gtriTongKhDuocGiao += this.nvl(nhomMh.gtriTongKhDuocGiao)
        dvi.gtriThucHienNamTruoc += this.nvl(nhomMh.gtriThucHienNamTruoc)
        dvi.gtriThucHienGiaoTrongNam += this.nvl(nhomMh.gtriThucHienGiaoTrongNam)
        dvi.gtriTongThucHienTrongNam += this.nvl(nhomMh.gtriTongThucHienTrongNam)
        dvi.gtriChuyenSangNamSau += this.nvl(nhomMh.gtriChuyenSangNamSau)
        dvi.gtriHuyDuToan += this.nvl(nhomMh.gtriHuyDuToan)
        dvi.gtriTongDuToanConLai += this.nvl(nhomMh.gtriTongDuToanConLai)
      }
    }
  }
  tinhTongGtriNhomMh (){
    for (let dvi of this.listDataGroup) {
      for (let nhomMh of dvi.children) {
        if (nhomMh.coNhieuMatHang == true) {
          nhomMh.gtriKhNamTruoc = 0
          nhomMh.gtriKhGiaoTrongNam = 0
          nhomMh.gtriTongKhDuocGiao = 0
          nhomMh.gtriThucHienNamTruoc = 0
          nhomMh.gtriThucHienGiaoTrongNam = 0
          nhomMh.gtriTongThucHienTrongNam = 0
          nhomMh.gtriChuyenSangNamSau = 0
          nhomMh.gtriHuyDuToan = 0
          nhomMh.gtriTongDuToanConLai = 0
          for (let matHang of nhomMh.children) {
            nhomMh.gtriKhNamTruoc += this.nvl(matHang.gtriKhNamTruoc)
            nhomMh.gtriKhGiaoTrongNam += this.nvl(matHang.gtriKhGiaoTrongNam)
            nhomMh.gtriTongKhDuocGiao += this.nvl(matHang.gtriTongKhDuocGiao)
            nhomMh.gtriThucHienNamTruoc += this.nvl(matHang.gtriThucHienNamTruoc)
            nhomMh.gtriThucHienGiaoTrongNam += this.nvl(matHang.gtriThucHienGiaoTrongNam)
            nhomMh.gtriTongThucHienTrongNam += this.nvl(matHang.gtriTongThucHienTrongNam)
            nhomMh.gtriChuyenSangNamSau += this.nvl(matHang.gtriChuyenSangNamSau)
            nhomMh.gtriHuyDuToan += this.nvl(matHang.gtriHuyDuToan)
            nhomMh.gtriTongDuToanConLai += this.nvl(matHang.gtriTongDuToanConLai)
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

  calTongGtri (field: string) {
    if (this.listDataGroup) {
      let sum = 0
      this.listDataGroup.forEach(item => {
        switch (field) {
          case 'gtriKhNamTruoc':
            sum += this.nvl(item.gtriKhNamTruoc);
            break;
          case 'gtriKhGiaoTrongNam':
            sum += this.nvl(item.gtriKhGiaoTrongNam);
            break;
          case 'gtriTongKhDuocGiao':
            sum += this.nvl(item.gtriTongKhDuocGiao);
            break;
          case 'gtriThucHienNamTruoc':
            sum += this.nvl(item.gtriThucHienNamTruoc);
            break;
          case 'gtriThucHienGiaoTrongNam':
            sum += this.nvl(item.gtriThucHienGiaoTrongNam);
            break;
          case 'gtriTongThucHienTrongNam':
            sum += this.nvl(item.gtriTongThucHienTrongNam);
            break;
          case 'gtriChuyenSangNamSau':
            sum += this.nvl(item.gtriChuyenSangNamSau);
            break;
          case 'gtriHuyDuToan':
            sum += this.nvl(item.gtriHuyDuToan);
            break;
          case 'gtriTongDuToanConLai':
            sum += this.nvl(item.gtriTongDuToanConLai);
            break;
        }
      })
      return sum;
    }
  }
  async handleChoose(event) {
    if (event!= null) {
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
    if(this.whitelistWebService.find(x => x.ma == "BCBN_130_03")){
      return true;
    }else{
      return false;
    }

  }
}
