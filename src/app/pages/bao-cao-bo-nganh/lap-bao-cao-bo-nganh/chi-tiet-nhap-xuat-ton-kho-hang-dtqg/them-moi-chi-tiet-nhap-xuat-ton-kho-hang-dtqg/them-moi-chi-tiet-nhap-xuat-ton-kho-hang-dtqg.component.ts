import {Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef} from '@angular/core';
import { Base2Component } from "../../../../../components/base2/base2.component";
import { HttpClient } from "@angular/common/http";
import { StorageService } from "../../../../../services/storage.service";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NgxSpinnerService } from "ngx-spinner";
import { NzModalService } from "ng-zorro-antd/modal";
import * as dayjs from "dayjs";
import { Validators } from "@angular/forms";
import { BcBnTt145Service } from 'src/app/services/bao-cao/BcBnTt145.service';
import { MESSAGE } from 'src/app/constants/message';
import { UserService } from 'src/app/services/user.service';
import { cloneDeep, chain } from 'lodash';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { formatDate } from '@angular/common';
import { DonviService } from 'src/app/services/donvi.service';
import { DialogThemMoiChiTietNhapXuatTonKhoHangDtqgComponent } from '../dialog-them-moi-chi-tiet-nhap-xuat-ton-kho-hang-dtqg/dialog-them-moi-chi-tiet-nhap-xuat-ton-kho-hang-dtqg.component';
import { cTNhapXuatHangDtqg, slGtriHangDtqg } from 'src/app/models/BaoCaoBoNganh';
import {CurrencyMaskInputMode} from "ngx-currency";

@Component({
  selector: 'app-them-moi-chi-tiet-nhap-xuat-ton-kho-hang-dtqg',
  templateUrl: './them-moi-chi-tiet-nhap-xuat-ton-kho-hang-dtqg.component.html',
  styleUrls: ['./them-moi-chi-tiet-nhap-xuat-ton-kho-hang-dtqg.component.scss']
})
export class ThemMoiChiTietNhapXuatTonKhoHangDtqgComponent extends Base2Component implements OnInit {
  @ViewChild('labelImport') labelImport: ElementRef;
  @Input() idInput: number;
  @Input() isView: boolean;
  @Output()
  showListEvent = new EventEmitter<any>();
  THONG_TU_SO = "145/2023/TT-BTC"
  TEN_BIEU_SO = "Phụ lục số 7"
  BIEU_SO = "PL07"
  itemRowUpdate: any = {};
  itemRow: any[] = [];
  listData: any;
  thoiGianSx: Date | null = null;
  listDataDetail: any[] = [];
  listCloaiVthh: any[] = [];
  listDataGroup: any[] = [];
  itemRowMatHangEdit: any[] = [];
  itemRowLoaiVthhEdit: any[] = [];
  itemRowCLoaiVthhEdit: any[] = [];
  itemRowEdit: any = {};
  now: any;
  whitelistWebService: any = {};
  dsChiCuc: any[] = []
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
  listDsDvi: any;
  optionsCloaiVthh: any[] = [];
  inputCloaiVthh: string = '';
  optionsDonViShow: any[] = [];
  selectedCloaiVthh: any = {};
  tenBoNganh: any;
  amount = {
    allowZero: true,
    allowNegative: false,
    precision: 3,
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
    private bcBnTt145Service: BcBnTt145Service,
    private donViService: DonviService,
    private danhMucService: DanhMucService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    public userService: UserService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, bcBnTt145Service);
    this.formData = this.fb.group(
      {
        nam: [dayjs().get("year"), [Validators.required]],
        id: [null],
        thoiGianTao: new Date(),
        thongTuSo: [null],
        bieuSo: [null],
        tenBieuSo: [null],
        dviGui: [null],
        tenDviGui: [null],
        boNganh: [null],
        dviNhan: [null],
        denNgayKyGui: [null],
        tenHang: [null],
        cloaiVthh: [null],
        trangThai: "00",
        tenTrangThai: "Dự thảo",
        loaiBc: [null],
        kyBc: [null],
        detail: [],
        kySo: [null],
      }
    );
  }

  async ngOnInit() {
    this.spinner.show();
    this.userInfo = this.userService.getUserLogin();
    this.templateName = 'template_bcbn_ct_nhap_xuat_ton_kho_hang_dtqg.xlsx'
    this.now = dayjs(); // Lấy ngày giờ hiện tại
    await Promise.all([
      this.getUserInfor(),
      // this.loadDsVthh(),
      this.loadDsChiCuc(),
      this.loadDsDonVi(),
      this.loadDsKyBc(),
      this.layTatCaDonViByLevel()
    ]);
    if (this.idInput > 0) {
      await this.getDetail(this.idInput, null);
    } else {
      this.initForm();
    }
    await this.spinner.hide();
  }

  async getDetail(id?: number, soDx?: string) {
    await this.bcBnTt145Service
      .getDetail(id)
      .then((res) => {
        if (res.msg == MESSAGE.SUCCESS) {
          this.listData = res.data;
          this.formData.patchValue({
            bieuSo: this.listData.bieuSo,
            thongTuSo: this.listData.thongTuSo,
            boNganh: this.listData.boNganh,
            kyBc: this.listData.kyBc,
            loaiBc: this.listData.loaiBc,
            nam: this.listData.nam,
            dviGui: this.userService.isTongCuc() ? this.listData.dviGui : this.userInfo.MA_DVI,
            tenDviGui: this.userService.isTongCuc() ? this.listData.tenDviGui : this.userInfo.TEN_DVI,
            tenTrangThai: this.listData.tenTrangThai,
            trangThai: this.listData.trangThai,
            tGianTaoTuNgay: this.listData.tGianTaoTuNgay,
            tGianTaoDenNgay: this.listData.tGianTaoDenNgay,
            tGianBanHanhTuNgay: this.listData.tGianBanHanhTuNgay,
            tGianBanHanhDenNgay: this.listData.tGianBanHanhDenNgay,
          });
          this.listDataGroup = this.listData.detail
          for (let i = 0; i < this.listDataGroup.length; i++) {
            this.itemRow[i] = [];
            this.itemRowEdit[i] = [];
            for (let y = 0; y < this.listDataGroup[i].children.length; y++) {
              this.itemRow[i][y] = [];
              this.itemRowEdit[i][y] = [];
              for (let z = 0; z < this.listDataGroup[i].children[y].children.length; z++) {
                this.itemRow[i][y][z] = new cTNhapXuatHangDtqg();
                this.itemRowEdit[i][y][z] = [];
                if (this.listDataGroup[i].children[y].children[z].children.length > 0) {
                  this.listDataGroup[i].children[y].children[z].coNhieuMatHang = true;
                }
              }
            }
          }
        }
      })
      .catch((e) => {
        console.log('error: ', e);
        this.spinner.hide();
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      });
  }

  initForm() {
    this.formData.patchValue({
      thongTuSo: this.THONG_TU_SO,
      tenBieuSo: this.TEN_BIEU_SO,
      bieuSo: this.BIEU_SO,
      dviGui: this.userInfo.MA_DVI,
      tenDviGui: this.userInfo.TEN_DVI,
      trangThai: "00",
      tenTrangThai: "Dự thảo"
    })
    if(!this.userService.isTongCuc()){
      this.handleChoose(this.userInfo.MA_DVI).then();
    }
  }

  async getUserInfor() {
    this.formData.patchValue({
      dviGui: this.userService.isTongCuc() ? this.formData.value.dviGui : this.userInfo.MA_DVI,
      tenDviGui: this.userInfo.TEN_DVI,
      tenBieuSo: this.TEN_BIEU_SO,
    })
  }

  quayLai() {
    this.showListEvent.emit();
  }

  addRow(i: number, y: number, z: number): void {
    this.listDataGroup[i].children[y].children[z].children = [
      ...this.listDataGroup[i].children[y].children[z].children,
      this.itemRow[i][y][z]
    ];
    this.clearItemRow(i, y, z);
  }

  startEdit(i: number, y: number, z: number, k: number): void {
    for (let i = 0; i < this.listDataGroup.length; i++) {
      if (this.itemRowEdit[i] == undefined) {
        this.itemRowEdit[i] = [];
      }
      for (let y = 0; y < this.listDataGroup[i].children.length; y++) {
        if (this.itemRowEdit[i][y] == undefined) {
          this.itemRowEdit[i][y] = [];
        }
        for (let z = 0; z < this.listDataGroup[i].children[y].children.length; z++) {
          if (this.itemRowEdit[i][y][z] == undefined) {
            this.itemRowEdit[i][y][z] = [];
          }
        }
      }
    }
    this.listDataGroup[i].children[y].children[z].children[k].edit = true;
    this.itemRowEdit[i][y][z][k] = cloneDeep(this.listDataGroup[i].children[y].children[z].children[k]);
  }

  cancelEdit(i: number, y: number, z: number, k: number): void {
    this.listDataGroup[i].children[y].children[z].children[k].edit = false;
  }

  saveEdit(i: number, y: number, z: number, k: number): void {
    this.listDataGroup[i].children[y].children[z].children[k] = this.itemRowEdit[i][y][z][k];
    this.listDataGroup[i].children[y].children[z].children[k].edit = false;
    this.itemRowEdit[i][y][z][k] = {};
  }

  clearItemRow(i: number, y: number, z: number) {
    this.itemRow[i][y][z] = new cTNhapXuatHangDtqg();
  }

  deleteRow(i, y, z, k) {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn xóa?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: () => {
        this.listDataGroup[i].children[y].children[z].children.splice(k, 1)
      },
    });
  }

  async loadDsVthh() {
    let res = await this.danhMucService.getDanhMucHangDvqlAsyn({});
    if (res.msg == MESSAGE.SUCCESS) {
      this.listCloaiVthh = res.data?.filter((x) => x.ma.length == 6);
    }
  }

  changeDiaDiemDeNhapHang($event, i: number, y: number, z: number, k?: number) {
    let ddDeNhapHang = this.dsChiCuc.filter(item => item.key == $event);
    for (let i = 0; i < this.listDataGroup.length; i++) {
      if (this.itemRowEdit[i] == undefined || this.itemRow[i] == undefined) {
        this.itemRowEdit[i] = [];
        this.itemRow[i] = [];
      }
      for (let y = 0; y < this.listDataGroup[i].children.length; y++) {
        if (this.itemRowEdit[i][y] == undefined || this.itemRow[i][y] == undefined) {
          this.itemRowEdit[i][y] = [];
          this.itemRow[i][y] = [];
        }
        for (let z = 0; z < this.listDataGroup[i].children[y].children.length; z++) {
          if (this.itemRowEdit[i][y][z] == undefined || this.itemRow[i][y][z] == undefined) {
            this.itemRowEdit[i][y][z] = [];
            this.itemRow[i][y][z] = [];
          }
          // for (let k = 0; k < this.listDataGroup[i].children[y].children[z].children.length; k++) {
          //   if (this.itemRowEdit[i][y][z][k] == undefined) {
          //     this.itemRowEdit[i][y][z][k] = [];
          //   }
          // }
        }
      }
    }
debugger
    if (k == undefined) {
      this.itemRow[i][y][z].diaDiemDeNhapHang = ddDeNhapHang[0].key;
      this.itemRow[i][y][z].tenDiaDiem = ddDeNhapHang[0].tenDvi;
      // this.itemRow[i][y][z].nuocSanXuat = "Việt Nam";
      this.itemRowEdit[i][y][z].diaDiemDeNhapHang = ddDeNhapHang[0].key;
      this.itemRowEdit[i][y][z].tenDiaDiem = ddDeNhapHang[0].tenDvi;
      // this.itemRowEdit[i][y][z].nuocSanXuat = "Việt Nam";
    } else {
      this.itemRowEdit[i][y][z][k].diaDiemDeNhapHang = ddDeNhapHang[0].key;
      this.itemRowEdit[i][y][z][k].tenDiaDiem = ddDeNhapHang[0].tenDvi;
      // this.itemRowEdit[i][y][z][k].nuocSanXuat = "Việt Nam";
    }

  }

  async save(isBanHanh?: boolean) {
    this.spinner.show();
    debugger
    for (let i = 0; i < this.listDataGroup.length; i++) {
      this.listDataGroup[i].thuTuHienThi = (i + 1)
    }
    // if (this.listDataGroup.length == 0) {
    //   this.notification.error(MESSAGE.ERROR, "Vui lòng cập nhật thông tin báo cáo");
    //   await this.spinner.hide();
    //   return
    // }
    let body = this.formData.value
    body.id = this.idInput
    if(!this.userService.isTongCuc()){
      body.dviGui = this.userInfo.MA_DVI
      body.boNganh = this.userInfo.TEN_DVI
    }else{
      body.boNganh = this.tenBoNganh
    }
    console.log(this.listDataGroup, "this.listDataGroup")
    body.detail = this.listDataGroup
    console.log(body.detail, "body.detail")
    body.thoiGianTao = this.formData.get('thoiGianTao').value
    let res = null;
    if (this.idInput > 0) {
      res = await this.bcBnTt145Service.update(body);
    } else {
      res = await this.bcBnTt145Service.create(body);
    }
    if (res.msg == MESSAGE.SUCCESS) {
      if(await this.checkWhiteList()){
        if (isBanHanh) {
          this.idInput = res.data.id;
          this.pheDuyetBcBn(body);
        } else {
          if (this.formData.get('id').value) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
          } else {
            this.idInput = res.data.id
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
          }
        }
      }else{
        this.notification.error(MESSAGE.ERROR, MESSAGE.WEB_SERVICE_ERR);
      }
      await this.spinner.hide()
      // this.quayLai();
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    this.spinner.hide()
  }

  async loadDsDonVi() {
    let body = {
      trangThai: "01", maDviCha: "01",
      type: "DV"
    };
    let res = await this.donViService.getDonViTheoMaCha(body); if (res.msg == MESSAGE.SUCCESS) {
      this.formData.get('dviNhan').setValue(res.data[0].tenDvi);
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  themMoiDanhMuc(index1?: any, index2?: any, index3?: any, index4?: any) {
    debugger
    const modalGT = this.modal.create({
      nzTitle: '',
      nzContent: DialogThemMoiChiTietNhapXuatTonKhoHangDtqgComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '650px',
      nzFooter: null,
      nzClassName: '',
      nzComponentParams: {
        listDataGroup: this.listDataGroup,
        index1: index1,
        index2: index2,
        index3: index3,
      },
    });
    modalGT.afterClose.subscribe((res) => {
      if (!res) {
        return;
      }
      let isUpdate = false;
      let checkDuplicate = true;
      this.listDataGroup.forEach(mHang => {
        if (mHang.matHang == res.matHang) {
          for (let i = 0; i < mHang.children.length; i++) {
            if (mHang.children[i].tenLoaiVthh == res.children[0].tenLoaiVthh) {
              checkDuplicate = false
              if (mHang.children[i].children[0].tenCloaiVthh != res.children[0].children[0].tenCloaiVthh) {
                mHang.children[i].children = [...mHang.children[i].children, res.children[0].children[0]]
                isUpdate = true;
              }
            }
          }
          if (checkDuplicate) {
            mHang.children = [...mHang.children, res.children[0]]
            isUpdate = true;
          }
        }
      })

      if (!isUpdate) {
        this.listDataGroup = [...this.listDataGroup, res];
      }
      for (let i = 0; i < this.listDataGroup.length; i++) {
        debugger
        this.itemRowMatHangEdit[i] = [];
        this.itemRowLoaiVthhEdit[i] = [];
        this.itemRowCLoaiVthhEdit[i] = [];
        this.itemRow[i] = [];
        this.itemRowEdit[i] = this.listDataGroup[i];
        for (let y = 0; y < this.listDataGroup[i].children.length; y++) {
          this.itemRow[i][y] = [];
          this.itemRowLoaiVthhEdit[i][y] = [];
          this.itemRowCLoaiVthhEdit[i][y] = [];
          for (let z = 0; z < this.listDataGroup[i].children[y].children.length; z++) {
            this.itemRow[i][y][z] = new cTNhapXuatHangDtqg();
            this.itemRowCLoaiVthhEdit[i][y][z] = this.listDataGroup[i].children[y].children[z];
          }
        }
      }
    });
  }

  editRowMatHang(i: number) {
    this.listDataGroup[i].edit = true;
    this.itemRowMatHangEdit[i] = cloneDeep(this.listDataGroup[i]);
  }

  deleteRowMatHang(i: number) {
    this.listDataGroup.splice(i, 1)
  }
  saveEditRowMatHang(i: number) {
    this.listDataGroup[i].matHang = this.itemRowMatHangEdit[i].matHang
    this.listDataGroup[i].edit = false;
    this.itemRowMatHangEdit[i] = {};
  }

  cancelEditRowMatHang(i: number) {
    this.listDataGroup[i].edit = false;
    this.itemRowMatHangEdit[i] = {};
  }

  editRowLoaiVthh(i: number, y: number) {
    for (let i = 0; i < this.listDataGroup.length; i++) {
      this.itemRowLoaiVthhEdit[i] = [];
    }
    this.listDataGroup[i].children[y].edit = true;
    this.itemRowLoaiVthhEdit[i][y] = cloneDeep(this.listDataGroup[i].children[y]);
  }

  deleteRowLoaiVthh(i: number, y: number) {
    this.listDataGroup[i].children.splice(y, 1)
  }
  saveEditRowLoaiVthh(i: number, y: number) {
    this.listDataGroup[i].children[y].tenLoaiVthh = this.itemRowLoaiVthhEdit[i][y].tenLoaiVthh
    this.listDataGroup[i].children[y].edit = false;
    this.itemRowLoaiVthhEdit[i][y] = {};
  }

  cancelEditRowLoaiVthh(i: number, y: number) {
    this.listDataGroup[i].children[y].edit = false;
    this.itemRowLoaiVthhEdit[i][y] = {};
  }

  editRowCLoaiVthh(i: number, y: number, z: number) {
    for (let i = 0; i < this.listDataGroup.length; i++) {
      if (this.itemRowCLoaiVthhEdit[i] == undefined) {
        this.itemRowCLoaiVthhEdit[i] = [];
      }
      for (let y = 0; y < this.listDataGroup[i].children.length; y++) {
        if (this.itemRowCLoaiVthhEdit[i][y] == undefined) {
          this.itemRowCLoaiVthhEdit[i][y] = [];
        }
      }
    }
    this.listDataGroup[i].children[y].children[z].edit = true;
    this.itemRowCLoaiVthhEdit[i][y][z] = cloneDeep(this.listDataGroup[i].children[y].children[z]);
  }

  deleteRowCLoaiVthh(i: number, y: number, z: number) {
    this.listDataGroup[i].children[y].children.splice(z, 1)
  }

  saveEditRowCLoaiVthh(i: number, y: number, z: number) {
    this.listDataGroup[i].children[y].children[z].tenCloaiVthh = this.itemRowCLoaiVthhEdit[i][y][z].tenCloaiVthh
    this.listDataGroup[i].children[y].children[z].edit = false;
    this.itemRowCLoaiVthhEdit[i][y][z] = {}
  }

  cancelEditRowCLoaiVthh(i: number, y: number, z: number) {
    this.listDataGroup[i].children[y].children[z].edit = false;
    this.itemRowCLoaiVthhEdit[i][y][z] = {}
  }

  async loadDsChiCuc() {
    let res = await this.donViService.layTatCaDonViByLevel(3);
    if (res && res.data) {
      this.dsChiCuc = res.data
      this.dsChiCuc = this.dsChiCuc.filter(item => item.type != "PB" && item.maDvi.startsWith(this.userInfo.MA_DVI))
    }
  }
  async handleSelectFile(event: any){
    this.labelImport.nativeElement.innerText = event.target.files[0].name;
    await this.onFileSelected(event);
    this.listDataGroup = this.dataImport
    for (let i = 0; i < this.listDataGroup.length; i++) {
      this.itemRow[i] = [];
      this.itemRowEdit[i] = [];
      for (let y = 0; y < this.listDataGroup[i].children.length; y++) {
        this.itemRow[i][y] = [];
        this.itemRowEdit[i][y] = [];
        for (let z = 0; z < this.listDataGroup[i].children[y].children.length; z++) {
          this.itemRow[i][y][z] = new cTNhapXuatHangDtqg();
          this.itemRowEdit[i][y][z] = [];
          if (this.listDataGroup[i].children[y].children[z].children.length > 0) {
            this.listDataGroup[i].children[y].children[z].coNhieuMatHang = true;
          }
        }
      }
    }
  }

  // changeLoaiBc(event) {
  //   this.formData.get("thoiHanGuiBc").setValue(this.listLoaiBc.find(item => item.value == event).thoiHanGuiBc);
  // }

  async handleChoose(event) {
    let data = this.listDsDvi.find(x => x.maDvi == event)
    this.tenBoNganh = data.tenDvi
    let res = await this.danhMucService.getDanhMucHangHoaDvql({
      'maDvi': data.maDvi ? (data.maDvi == '01' ? '0101' : data.maDvi) : this.userInfo.MA_DVI,
    }).toPromise();
    if (res.msg == MESSAGE.SUCCESS) {
      this.listCloaiVthh = res.data;
      this.optionsCloaiVthh = this.listCloaiVthh
    }
  }

  async layTatCaDonViByLevel() {
    let res = await this.donViService.layTatCaDonViByLevel(0);
    if (res.msg == MESSAGE.SUCCESS) {
      console.log(res.data, 1234)
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
    if(this.whitelistWebService.find(x => x.ma == "BCBN_145_07")){
      return true;
    }else{
      return false;
    }

  }
}
