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
import {CurrencyMaskInputMode} from "ngx-currency";

@Component({
  selector: 'app-them-moi-nhap-xuat-ton-kho-hang-dtqg',
  templateUrl: './them-moi-nhap-xuat-ton-kho-hang-dtqg.component.html',
  styleUrls: ['./them-moi-nhap-xuat-ton-kho-hang-dtqg.component.scss']
})
export class ThemMoiNhapXuatTonKhoHangDtqgComponent extends Base2Component implements OnInit {
  @ViewChild('labelImport') labelImport: ElementRef;
  @Input() idInput: number;
  @Input() isView: boolean;
  @Output()
  showListEvent = new EventEmitter<any>();
  THONG_TU_SO = "145/2023/TT-BTC"
  TEN_BIEU_SO = "Phụ lục số 6"
  BIEU_SO = "PL06"
  itemRowUpdate: any = {};
  itemRow: any = {};
  listData: any;
  thoiGianSx: Date | null = null;
  listDataDetail: any[] = [];
  listCloaiVthh: any[] = [];
  now: any;
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
      }
    );
  }

  async ngOnInit() {
    this.spinner.show();
    this.userInfo = this.userService.getUserLogin();
    this.templateName = 'template_bcbn_nhap_xuat_ton_kho_hang_dtqg.xlsx'
    this.now = dayjs(); // Lấy ngày giờ hiện tại
    await Promise.all([
      this.getUserInfor(),
      // this.loadDsVthh(),
      this.loadDsDonVi(),
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
            nam: this.listData.nam,
            kyBc: this.listData.kyBc,
            dviGui: this.userService.isTongCuc() ? this.listData.dviGui : this.userInfo.MA_DVI,
            loaiBc: this.listData.loaiBc,
            tenTrangThai: this.listData.tenTrangThai,
            tGianTaoTuNgay: this.listData.tGianTaoTuNgay,
            tGianTaoDenNgay: this.listData.tGianTaoDenNgay,
            tGianBanHanhTuNgay: this.listData.tGianBanHanhTuNgay,
            tGianBanHanhDenNgay: this.listData.tGianBanHanhDenNgay,
            trangThai: this.listData.trangThai,
          });
          this.listDataDetail = this.listData.detail
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
      trangThai: "00",
      tenTrangThai: "Dự thảo"
    })
  }

  async getUserInfor() {
    this.formData.patchValue({
      dviGui: this.userInfo.TEN_DVI,
      tenBieuSo: this.TEN_BIEU_SO,
    })
  }

  quayLai() {
    this.showListEvent.emit();
  }

  startEdit(index: number): void {
    this.listDataDetail[index].edit = true;
    this.itemRowUpdate = cloneDeep(this.listDataDetail[index]);
  }

  cancelEdit(index: number): void {
    this.listDataDetail[index].edit = false;
  }

  saveEdit(dataUpdate, index: any): void {
    // if (this.validateItemSave(this.itemRowUpdate, index)) {
    this.listDataDetail[index] = this.itemRowUpdate;
    this.listDataDetail[index].edit = false;
    // };
  }

  clearItemRow() {
    let soLuong = this.itemRow.soLuong;
    this.itemRow = {};
    this.itemRow.soLuong = soLuong;
    this.itemRow.id = null;
    this.thoiGianSx = null;
  }

  deleteRow(i) {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn xóa?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: () => {
        this.listDataDetail.splice(i, 1)
      },
    });
  }

  addRow(): void {
    // if (this.validateItemSave(this.itemRow)) {
    this.listDataDetail = [
      ...this.listDataDetail,
      this.itemRow
    ];
    this.clearItemRow();
    // }
  }

  async loadDsVthh() {
    let res = await this.danhMucService.getDanhMucHangDvqlAsyn({});
    if (res.msg == MESSAGE.SUCCESS) {
      this.listCloaiVthh = res.data?.filter((x) => x.ma.length == 6);
    }
  }

  changeCloaiVthh($event) {
    let cloaiVthh = this.listCloaiVthh.filter(item => item.ma == $event);
    this.itemRow.tenHang = cloaiVthh[0].ten;
    this.itemRow.dvt = cloaiVthh[0].maDviTinh;
    this.itemRowUpdate.dvt = cloaiVthh[0].maDviTinh;
    this.itemRowUpdate.tenHang = cloaiVthh[0].ten;
    this.formData.patchValue({
      cloaiVthh: cloaiVthh[0].ma,
      tenHang: cloaiVthh[0].ten,
    })
  }

  async save(isBanHanh?: boolean) {
    this.spinner.show();
    debugger
    if (this.listDataDetail.length == 0) {
      this.notification.error(MESSAGE.ERROR, "Vui lòng cập nhật thông tin báo cáo");
      await this.spinner.hide();
      return
    }
    let body = this.formData.value
    body.id = this.idInput
    if(!this.userService.isTongCuc()){
      body.dviGui = this.userInfo.MA_DVI
      body.boNganh = this.userInfo.TEN_DVI
    }else{
      body.boNganh = this.tenBoNganh
    }
    body.detail = this.listDataDetail
    body.thoiGianTao = this.formData.get('thoiGianTao').value
    let res = null;
    if (this.idInput > 0) {
      res = await this.bcBnTt145Service.update(body);
    } else {
      // body.thoiGianTao = formatDate(this.now, "dd-MM-yyyy", 'en-US')
      res = await this.bcBnTt145Service.create(body);
    }
    if (res.msg == MESSAGE.SUCCESS) {
      this.idInput = res.data.id
      if (isBanHanh) {
        this.pheDuyet(body);
      } else {
        if (this.formData.get('id').value) {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
        } else {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
        }
      }
      await this.spinner.hide()
      // this.quayLai();
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    this.spinner.hide()
  }

  pheDuyet(data: any) {
    let trangThai = '';
    let msg = '';
    switch (this.formData.get('trangThai').value) {
      case this.STATUS.DU_THAO: {
        trangThai = this.STATUS.BAN_HANH;
        msg = 'Bạn có muốn ban hành ?'
        break;
      }
    }
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: msg,
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 400,
      nzOnOk: async () => {
        this.spinner.show();
        try {
          const res = await this.bcBnTt145Service.approve(data);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.APPROVE_SUCCESS);
            this.quayLai();
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
          this.spinner.hide();
        } catch (e) {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      },
    });
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
  async handleSelectFile(event: any){
    this.labelImport.nativeElement.innerText = event.target.files[0].name;
    await this.onFileSelected(event);
    this.listDataDetail = this.dataImport
  }


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

  onInputDonVi(e: Event): void {
    const value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.optionsCloaiVthh = this.listCloaiVthh;
    } else {
      this.optionsCloaiVthh = this.listCloaiVthh.filter(
        (x) => x.tenHangHoa.toLowerCase().indexOf(value.toLowerCase()) != -1,
      );
    }
  }

  async selectDonVi(donVi) {
    this.itemRow.cloaiVthh = donVi.maHangHoa;
    this.itemRow.tenHang = donVi.tenHangHoa;
    this.selectedCloaiVthh = donVi;
  }

  async selectCloaiVthhUpdate(donVi) {
    this.itemRowUpdate.cloaiVthh = donVi.maHangHoa;
    this.itemRowUpdate.tenHang = donVi.tenHangHoa;
    this.selectedCloaiVthh = donVi;
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
}
