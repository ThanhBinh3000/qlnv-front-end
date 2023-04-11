import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormGroup, Validators} from "@angular/forms";
import {UserLogin} from "../../../../models/userlogin";
import {DiaDiemGiaoNhan, KeHoachBanDauGia, PhanLoTaiSan} from "../../../../models/KeHoachBanDauGia";
import {DatePipe} from "@angular/common";
import {DiaDiemNhapKho} from "../../../../models/CuuTro";
import {
  ModalInput
} from "../../../xuat/xuat-cuu-tro-vien-tro/xuat-cuu-tro/xay-dung-phuong-an/thong-tin-xay-dung-phuong-an/thong-tin-xay-dung-phuong-an.component";
import {Base2Component} from "../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {DanhMucService} from "../../../../services/danhmuc.service";
import {DeXuatKeHoachBanDauGiaService} from "../../../../services/deXuatKeHoachBanDauGia.service";
import {DonviService} from "../../../../services/donvi.service";
import {TinhTrangKhoHienThoiService} from "../../../../services/tinhTrangKhoHienThoi.service";
import {DanhMucTieuChuanService} from "../../../../services/quantri-danhmuc/danhMucTieuChuan.service";
import {
  DeXuatPhuongAnCuuTroService
} from "../../../../services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/DeXuatPhuongAnCuuTro.service";
import {QuanLyHangTrongKhoService} from "../../../../services/quanLyHangTrongKho.service";
import * as dayjs from "dayjs";
import {FileDinhKem} from "../../../../models/DeXuatKeHoachuaChonNhaThau";
import {MESSAGE} from "../../../../constants/message";
import {STATUS} from "src/app/constants/status";
import {chain, cloneDeep} from 'lodash';
import * as uuid from "uuid";

@Component({
  selector: 'app-chi-tiet-ke-hoach-dcnb',
  templateUrl: './chi-tiet-ke-hoach-dcnb.component.html',
  styleUrls: ['./chi-tiet-ke-hoach-dcnb.component.scss']
})
export class ChiTietKeHoachDcnbComponent extends Base2Component implements OnInit {
  @Input() loaiVthhInput: string;
  @Input() idInput: number;
  @Input() isView: boolean;
  @Input() isViewOnModal: boolean;
  @Output()
  showListEvent = new EventEmitter<any>();

  formData: FormGroup;
  cacheData: any[] = [];
  fileDinhKem: any[] = [];
  userLogin: UserLogin;
  listChiCuc: any[] = [];
  listDiemKho: any[] = [];
  titleStatus: string = '';
  titleButtonDuyet: string = '';
  iconButtonDuyet: string = '';
  styleStatus: string = 'du-thao-va-lanh-dao-duyet';
  tabSelected: string = 'thongTinChung';
  listNam: any[] = [];
  listHangHoaAll: any[] = [];
  listLoaiHangHoa: any[] = [];
  errorInputRequired: string = 'Dữ liệu không được để trống.';
  userInfo: UserLogin;
  expandSet = new Set<number>();
  bangPhanBoList: Array<any> = [];
  khBanDauGia: KeHoachBanDauGia = new KeHoachBanDauGia();
  diaDiemGiaoNhan: DiaDiemGiaoNhan = new DiaDiemGiaoNhan();
  diaDiemGiaoNhanList: Array<DiaDiemGiaoNhan> = [];
  phanLoTaiSanList: Array<PhanLoTaiSan> = [];
  listChungLoaiHangHoa: any[] = [];
  maHauTo: string;
  listLoaiHopDong: any[] = [];
  STATUS = STATUS;
  listLoaiHinhNhapXuat: any[] = [];
  listKieuNhapXuat: any[] = [];
  datePipe = new DatePipe('en-US');
  tongSLThongTinChiTiet = 0;
  tongSLCuuTro = 0;
  tongTien = 0;
  tongSLCuuTroDtl = 0;
  tongTienDtl = 0;
  diaDiemNhapKho: any[] = [];
  thongTinChiTietCreate: any = {};
  thongTinChiTietClone: any = {};
  phuongAnXuatList: DiaDiemNhapKho[];
  idDxuatDtlSelect = 0;
  rowDxuatDtlSelect: any;
  tongSoLuongDtl: number;
  dsDonVi: any;
  expandSetString = new Set<string>();
  tableView = [];
  tableRow: any = {};
  phuongAnView = [];
  phuongAnRow: any = {};
  phuongAnRowDiff: any;
  isVisible = false;
  isVisibleSuaNoiDung = false;
  listNoiDung = []
  tongThanhTien: any;
  tongSoLuong: any;
  tongSoLuongDeXuat: any;
  tongSoLuongXuatCap: any;
  errorInputComponent: any[] = [];
  disableInputComponent: ModalInput = new ModalInput();

  constructor(httpClient: HttpClient,
              storageService: StorageService,
              notification: NzNotificationService,
              spinner: NgxSpinnerService,
              modal: NzModalService,
              private danhMucService: DanhMucService,
              private deXuatKeHoachBanDauGiaService: DeXuatKeHoachBanDauGiaService,
              private donViService: DonviService,
              private tinhTrangKhoHienThoiService: TinhTrangKhoHienThoiService,
              private dmTieuChuanService: DanhMucTieuChuanService,
              private deXuatPhuongAnCuuTroService: DeXuatPhuongAnCuuTroService,
              private quanLyHangTrongKhoService: QuanLyHangTrongKhoService,
              private cdr: ChangeDetectorRef,) {
    super(httpClient, storageService, notification, spinner, modal, deXuatPhuongAnCuuTroService);
    for (let i = -3; i < 23; i++) {
      this.listNam.push({
        value: dayjs().get('year') - i,
        text: dayjs().get('year') - i,
      });
    }
    this.formData = this.fb.group(
      {
        id: [0],
        nam: [dayjs().get("year")],
        maDvi: [''],
        loaiNhapXuat: [''],
        kieuNhapXuat: ['Xuất không thu tiền'],
        soDx: ['',],
        trichYeu: ['',],
        loaiVthh: ['', [Validators.required]],
        cloaiVthh: [''],
        tenVthh: [''],
        tonKho: [0],
        ngayDx: [''],
        ngayKetThuc: [''],
        noiDungDx: [''],
        trangThai: [STATUS.DU_THAO],
        maTongHop: [''],
        idQdPd: [''],
        soQdPd: [''],
        tongSoLuong: [0],
        thanhTien: [0],
        ngayGduyet: [''],
        nguoiGduyetId: [''],
        ngayPduyet: [''],
        nguoiPduyetId: [''],
        lyDoTuChoi: [''],
        tenDvi: [''],
        tenLoaiVthh: [''],
        tenCloaiVthh: [''],
        donViTinh: [''],
        soLuongXuatCap: [''],
        tenTrangThai: ['Dự Thảo'],
        canCu: [new Array<FileDinhKem>()],
        deXuatPhuongAn: [new Array()],
        type: ['CHI_CUC']
      }
    );
    this.userInfo = this.userService.getUserLogin();
    this.maHauTo = '/' + this.userInfo.MA_TCKT;
  }

  async ngOnInit() {
    try {
      this.spinner.show();
      //this.loadDonVi();
      await Promise.all([
        this.loadDsLoaiHinhNhapXuat(),
        this.loadDsKieuNhapXuat(),
        this.loadDsVthh(),
        this.loadDsDonVi(),
        this.phuongAnRow.tonKhoChiCuc = 0,
        this.phuongAnRow.tonKhoCloaiVthh = 0,
      ])

      await this.loadDetail(this.idInput)
      // await Promise.all([this.loaiVTHHGetAll(), this.loaiHopDongGetAll()]);
      this.spinner.hide();
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, 'Có lỗi xảy ra.');
      this.spinner.hide();
    } finally {
      this.spinner.hide();
    }
  }

  async loadDsLoaiHinhNhapXuat() {
    let res = await this.danhMucService.danhMucChungGetAll("LOAI_HINH_NHAP_XUAT");
    if (res.msg == MESSAGE.SUCCESS) {
      this.listLoaiHinhNhapXuat = res.data.filter(item => item.apDung == 'XUAT_CTVT');
    }
  }

  async loadDsKieuNhapXuat() {
    let res = await this.danhMucService.danhMucChungGetAll("KIEU_NHAP_XUAT");
    if (res.msg == MESSAGE.SUCCESS) {
      this.listKieuNhapXuat = res.data.filter(item => item.apDung == 'XUAT_CTVT');
    }
  }

  async loadDsVthh() {
    let res = await this.danhMucService.getDanhMucHangDvqlAsyn({});
    if (res.msg == MESSAGE.SUCCESS) {
      this.listHangHoaAll = res.data;
      this.listLoaiHangHoa = res.data?.filter((x) => (x.ma.length == 2 && !x.ma.match("^01.*")) || (x.ma.length == 4 && x.ma.match("^01.*")));
    }
  }

  async loadDsDonVi() {
    let body = {
      trangThai: "01",
      maDviCha: this.userInfo.MA_DVI.substring(0, 4),
      type: "DV"
    };
    let res = await this.donViService.getDonViTheoMaCha(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.dsDonVi = res.data;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async loadDetail(idInput: number) {
    if (idInput > 0) {
      await this.deXuatPhuongAnCuuTroService.getDetail(idInput)
        .then(async (res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            this.maHauTo = '/' + res.data.soDx.split("/")[1];
            res.data.soDx = res.data.soDx.split("/")[0];
            this.formData.patchValue(res.data);
            this.formData.value.deXuatPhuongAn.forEach(s => s.idVirtual = uuid.v4());
            await this.changeHangHoa(res.data.loaiVthh)
            this.buildTableView();
          }
        })
        .catch((e) => {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        });
    } else {
      this.formData.patchValue({
        maDvi: this.userInfo.MA_DVI,
        tenDvi: this.userInfo.TEN_DVI
      });
      this.tongThanhTien = 0;
      this.tongSoLuong = 0;
      this.tongSoLuongDeXuat = 0;
      this.tongSoLuongXuatCap = 0;
    }

  }

  expandAll() {
    this.phuongAnView.forEach(s => {
      this.expandSetString.add(s.idVirtual);
    })
  }

  onExpandStringChange(id: string, checked: boolean): void {
    if (checked) {
      this.expandSetString.add(id);
    } else {
      this.expandSetString.delete(id);
    }
  }

  quayLai() {
    this.showListEvent.emit();
  }

  changeLoaiHinhNhapXuat(event: any) {
    let loaiHinh = this.listLoaiHinhNhapXuat.find(s => s.ma == event);
    if (loaiHinh) {
      this.formData.patchValue({kieuNhapXuat: loaiHinh.ghiChu.split('-')[0]})
    }
  }

  async changeHangHoa(event: any) {
    if (event) {
      this.formData.patchValue({donViTinh: this.listHangHoaAll.find(s => s.ma == event)?.maDviTinh})

      let res = await this.danhMucService.loadDanhMucHangHoaTheoMaCha({str: event});
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          this.listChungLoaiHangHoa = res.data;
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
      //lay ton kho
      if (this.userService.isCuc()) {
        let body = {
          'maDvi': this.userInfo.MA_DVI,
          'loaiVthh': this.formData.value.loaiVthh
        }
        await this.quanLyHangTrongKhoService.getTrangThaiHt(body).then((res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            let data = res.data;
            if (data.length > 0) {
              let val = data.reduce((prev, cur) => prev + cur.slHienThoi, 0);
              this.formData.patchValue({
                tonKho: cloneDeep(val),
              });
              console.log(this.formData.value)
            } else {
              this.formData.patchValue({tonKho: 0});
            }
          }
        });
      }
    }
  }

  selectRow(item) {
    this.phuongAnView.forEach(i => i.selected = false);
    item.selected = true;
  }

  async showModal(data?: any): Promise<void> {
    try { //tong cuc
      if (this.userService.isTongCuc()) {
        this.formData.controls["nam"].setValidators(null);
        this.formData.controls["soDx"].setValidators(null);
        this.formData.controls["loaiNhapXuat"].setValidators(null);
        this.formData.controls["trichYeu"].setValidators(null);
        this.helperService.markFormGroupTouched(this.formData);
        if (this.formData.invalid) {
          return;
        }

        this.listNoiDung = [...new Set(this.formData.value.deXuatPhuongAn.map(s => s.noiDung))];

        this.phuongAnRow.loaiVthh = cloneDeep(this.formData.value.loaiVthh);
        if (data) {
          this.phuongAnRow.maDviCuc = this.dsDonVi.find(s => s.tenDvi === data.tenCuc)?.maDvi;
          this.changeCuc(this.phuongAnRow.maDviCuc);
          this.phuongAnRow.noiDung = data.childData[0].noiDung;
          this.phuongAnRow.soLuongXuatCuc = data.soLuongXuatCuc;

          this.disableInputComponent.noiDung = true;
          this.disableInputComponent.maDviCuc = true;
        }
      }
      //cuc
      else if (this.userService.isCuc()) {
        if (this.userService.isCuc()) {
          this.disableInputComponent.maDviCuc = true;
        }

        this.formData.controls["nam"].setValidators(null);
        this.formData.controls["soDx"].setValidators(null);
        this.formData.controls["loaiNhapXuat"].setValidators(null);
        this.formData.controls["trichYeu"].setValidators(null);
        this.helperService.markFormGroupTouched(this.formData);
        if (this.formData.invalid) {
          return;
        }

        this.listNoiDung = [...new Set(this.formData.value.deXuatPhuongAn.map(s => s.noiDung))];

        this.phuongAnRow.loaiVthh = cloneDeep(this.formData.value.loaiVthh);
        this.phuongAnRow.maDviCuc = this.userInfo.MA_DVI;
        await this.changeCuc(this.phuongAnRow.maDviCuc);
        if (data) {
          this.phuongAnRow.maDviChiCuc = this.listChiCuc.find(s => s.tenDvi === data.tenCuc)?.maDvi;
          await this.changeChiCuc(this.phuongAnRow.maDviChiCuc);
          this.phuongAnRow.noiDung = data.childData[0].noiDung;
          this.phuongAnRow.soLuongXuatCuc = data.soLuongXuatCuc;

          this.disableInputComponent.noiDung = true;
          this.disableInputComponent.maDviCuc = true;
          this.disableInputComponent.maDviChiCuc = true;
          this.disableInputComponent.soLuongXuatCuc = true;
        }
      }
      this.isVisible = true;
    } catch (e) {
      console.log(e)
    }

  }

  handleOk(): void {
    // if (!this.phuongAnRow.maDviChiCuc) {
    //   this.errorInputComponent.push('inputChiCuc');
    //   return;
    // }
    if (!this.phuongAnRow.noiDung) {
      this.errorInputComponent.push('inputNoiDung');
      return;
    }
    if (!this.phuongAnRow.maDviCuc) {
      this.errorInputComponent.push('inputMaDviChiCuc');
      return;
    }
    if (!this.phuongAnRow.soLuongXuatCuc) {
      this.errorInputComponent.push('inputsoLuongXuatCuc');
      return;
    }
    this.phuongAnRow.idVirtual = this.phuongAnRow.idVirtual ? this.phuongAnRow.idVirtual : uuid.v4();
    this.phuongAnRow.thanhTien = this.phuongAnRow.soLuongXuatChiCuc * this.phuongAnRow.donGiaKhongVat;
    this.phuongAnRow.tenCloaiVthh = this.listChungLoaiHangHoa.find(s => s.ma === this.phuongAnRow.cloaiVthh)?.ten
    //tinh xuat cap
    if (this.phuongAnRow.soLuongXuatCuc > this.phuongAnRow.tonKhoCloaiVthh && this.phuongAnRow.soLuongXuatChiCuc >= this.phuongAnRow.tonKhoCloaiVthh) {
      this.phuongAnRow.soLuongXuatCap = this.phuongAnRow.soLuongXuatCuc - this.phuongAnRow.soLuongXuatChiCuc;
    } else {
      this.phuongAnRow.soLuongXuatCap = 0;
    }
    let index = this.formData.value.deXuatPhuongAn.findIndex(s => s.idVirtual === this.phuongAnRow.idVirtual);
    let table = this.formData.value.deXuatPhuongAn;
    table.filter(s => s.noiDung === this.phuongAnRow.noiDung && s.maDviCuc === this.phuongAnRow.maDviCuc)
      .forEach(s => s.soLuongXuatCuc = this.phuongAnRow.soLuongXuatCuc)
    if (index != -1) {
      table.splice(index, 1, this.phuongAnRow);
    } else {
      //check ton tai thi cong them
      let exists = this.formData.value.deXuatPhuongAn.find(s => s.noiDung === this.phuongAnRow.noiDung &&
        s.tenChiCuc === this.phuongAnRow.tenChiCuc &&
        s.tenCloaiVthh === this.phuongAnRow.tenCloaiVthh)
      if (exists) {
        this.phuongAnRow.soLuongXuatChiCuc += exists.soLuongXuatChiCuc;
        table.splice(exists, 1, this.phuongAnRow);
      } else {
        table = [...table, this.phuongAnRow]
      }
    }
    this.formData.patchValue({
      deXuatPhuongAn: table
    })
    this.buildTableView();
    //set tong sl xuat cuc
    table.forEach(s => {
      s.soLuongXuat = this.phuongAnView.find(s1 => s1.noiDung === s.noiDung).soLuongXuat;
    })
    this.isVisible = false;
    //clean
    this.errorInputComponent = [];
    this.phuongAnRow = {}
    this.listChiCuc = []
    this.disableInputComponent = new ModalInput();
  }

  handleCancel(): void {
    this.isVisible = false;
    //clean
    this.errorInputComponent = [];
    this.phuongAnRow = {}
    this.listChiCuc = []
    this.disableInputComponent = new ModalInput();
  }

  buildTableView() {
    // #1
    if (this.userService.isTongCuc()) {
      let dataView = chain(this.formData.value.deXuatPhuongAn)
        .groupBy("noiDung")
        .map((value, key) => {
          let rs = chain(value)
            .groupBy("tenCuc")
            .map((v, k) => {
                let soLuongXuatCucThucTe = v.reduce((prev, cur) => prev + cur.soLuongXuatChiCuc, 0);
                let thanhTienXuatCucThucTe = v.reduce((prev, cur) => prev + cur.thanhTien, 0);
                let rowCuc = v.find(s => s.tenCuc === k);
                if (this.userService.isCuc()) {
                  rowCuc.tonKhoCuc = this.formData.value.tonKho;
                }
                return {
                  idVirtual: uuid.v4(),
                  tenCuc: k,
                  soLuongXuatCuc: rowCuc.soLuongXuatCuc,
                  soLuongXuatCucThucTe: soLuongXuatCucThucTe,
                  thanhTienXuatCucThucTe: thanhTienXuatCucThucTe,
                  tenCloaiVthh: rowCuc.tenCloaiVthh,
                  tonKhoCuc: rowCuc.tonKhoCuc,
                  childData: v
                }
              }
            ).value();
          let soLuongXuat = rs.reduce((prev, cur) => prev + cur.soLuongXuatCuc, 0);
          let soLuongXuatThucTe = rs.reduce((prev, cur) => prev + cur.soLuongXuatCucThucTe, 0);
          let thanhTienXuatThucTe = rs.reduce((prev, cur) => prev + cur.thanhTienXuatCucThucTe, 0);

          return {
            idVirtual: uuid.v4(),
            noiDung: key,
            soLuongXuat: soLuongXuat,
            soLuongXuatThucTe: soLuongXuatThucTe,
            thanhTienXuatThucTe: thanhTienXuatThucTe,
            childData: rs
          };
        }).value();
      this.phuongAnView = dataView
      console.log(this.phuongAnView, "phuongAnView")
      this.expandAll()

      //
      if (this.formData.value.deXuatPhuongAn.length !== 0) {
        this.tongThanhTien = this.formData.value.deXuatPhuongAn.reduce((prev, cur) => prev + cur.thanhTien, 0);
        this.tongSoLuong = this.formData.value.deXuatPhuongAn.reduce((prev, cur) => prev + cur.soLuongXuatChiCuc, 0);
        this.tongSoLuongDeXuat = this.phuongAnView.reduce((prev, cur) => prev + cur.soLuongXuat, 0);
        let listXuatCap = this.phuongAnView.map(s => {
          let tongTonKhoCuc = s.childData.reduce((prev, cur) => prev + cur.tonKhoCuc, 0);
          let tongDeXuat = s.childData.reduce((prev, cur) => prev + cur.soLuongXuatCuc, 0);
          let tongThucXuat = s.childData.reduce((prev, cur) => prev + cur.soLuongXuatCucThucTe, 0);
          console.log(tongTonKhoCuc, tongDeXuat, tongThucXuat)
          if (tongDeXuat > tongThucXuat && tongThucXuat >= tongTonKhoCuc) {
            return tongDeXuat - tongTonKhoCuc;
          } else {
            return 0
          }
        });
        console.log(listXuatCap, 'listXuatCap')
        this.tongSoLuongXuatCap = listXuatCap.reduce((prev, cur) => prev + cur, 0);
      } else {
        this.tongThanhTien = 0;
        this.tongSoLuong = 0;
        this.tongSoLuongDeXuat = 0;
        this.tongSoLuongXuatCap = 0;
      }
    } else if (this.userService.isCuc()) {
      let dataView = chain(this.formData.value.deXuatPhuongAn)
        .groupBy("noiDung")
        .map((value, key) => {
          let rs = chain(value)
            .groupBy("tenChiCuc")
            .map((v, k) => {
                let soLuongXuatCucThucTe = v.reduce((prev, cur) => prev + cur.soLuongXuatChiCuc, 0);
                let thanhTienXuatCucThucTe = v.reduce((prev, cur) => prev + cur.thanhTien, 0);
                let rowCuc = v.find(s => s.tenChiCuc === k);
                if (this.userService.isCuc()) {
                  rowCuc.tonKhoCuc = cloneDeep(this.formData.value.tonKho);
                }
                return {
                  idVirtual: uuid.v4(),
                  tenCuc: k,
                  soLuongXuatCuc: rowCuc.soLuongXuatCuc,
                  soLuongXuatCucThucTe: soLuongXuatCucThucTe,
                  thanhTienXuatCucThucTe: thanhTienXuatCucThucTe,
                  tenCloaiVthh: rowCuc.tenCloaiVthh,
                  tonKhoCuc: rowCuc.tonKhoChiCuc,
                  childData: v
                }
              }
            ).value();
          let soLuongXuat = rs.reduce((prev, cur) => prev + cur.soLuongXuatCuc, 0);
          let soLuongXuatThucTe = rs.reduce((prev, cur) => prev + cur.soLuongXuatCucThucTe, 0);
          let thanhTienXuatThucTe = rs.reduce((prev, cur) => prev + cur.thanhTienXuatCucThucTe, 0);
          let rowNoiDung = value.find(s => s.noiDung === key);

          return {
            idVirtual: uuid.v4(),
            noiDung: key,
            soLuongXuat: rowNoiDung.soLuongXuatCuc,
            soLuongXuatThucTe: soLuongXuatThucTe,
            thanhTienXuatThucTe: thanhTienXuatThucTe,
            childData: rs
          };
        }).value();
      this.phuongAnView = dataView
      console.log(this.phuongAnView, "phuongAnView")
      this.expandAll()


      //
      if (this.formData.value.deXuatPhuongAn.length !== 0) {
        this.tongThanhTien = this.formData.value.deXuatPhuongAn.reduce((prev, cur) => prev + cur.thanhTien, 0);
        this.tongSoLuong = this.formData.value.deXuatPhuongAn.reduce((prev, cur) => prev + cur.soLuongXuatChiCuc, 0);
        this.tongSoLuongDeXuat = this.phuongAnView.reduce((prev, cur) => prev + cur.soLuongXuat, 0);

        let tongTonKhoCuc = this.formData.value.tonKho;
        let tongDeXuat = this.phuongAnView.reduce((prev, cur) => prev + cur.soLuongXuat, 0);
        let tongThucXuat = this.phuongAnView.reduce((prev, cur) => prev + cur.soLuongXuatThucTe, 0);
        console.log(tongTonKhoCuc, tongDeXuat, tongThucXuat)
        if (tongThucXuat == tongTonKhoCuc && tongDeXuat > tongTonKhoCuc) {
          this.tongSoLuongXuatCap = tongDeXuat - tongTonKhoCuc;
        } else {
          this.tongSoLuongXuatCap = 0;
        }


      } else {
        this.tongThanhTien = 0;
        this.tongSoLuong = 0;
        this.tongSoLuongDeXuat = 0;
        this.tongSoLuongXuatCap = 0;
      }
    }
  }

  async changeCuc(event: any) {
    if (event) {
      let existRow = this.formData.value.deXuatPhuongAn
        .find(s => s.noiDung === this.phuongAnRow.noiDung && s.maDviCuc === this.phuongAnRow.maDviCuc);
      if (existRow) {
        this.phuongAnRow.soLuongXuatCuc = existRow.soLuongXuatCuc;
      } else {
        this.phuongAnRow.soLuongXuatCuc = 0
      }

      let data = this.dsDonVi.find(s => s.maDvi == event);
      this.phuongAnRow.tenCuc = data.tenDvi;
      let body = {
        trangThai: "01",
        maDviCha: event,
        type: "DV"
      };
      let res = await this.donViService.getDonViTheoMaCha(body);
      if (res.msg == MESSAGE.SUCCESS) {
        this.listChiCuc = res.data;
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }

      //lay ton kho
      if (this.userService.isTongCuc()) {
        let body = {
          'maDvi': event,
          'loaiVthh': this.formData.value.loaiVthh
        }
        this.quanLyHangTrongKhoService.getTrangThaiHt(body).then((res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            let data = res.data;
            if (data.length > 0) {
              this.phuongAnRow.tonKhoCuc = data.reduce((prev, cur) => prev + cur.slHienThoi, 0);
            } else {
              this.phuongAnRow.tonKhoCuc = 0;
            }
          }
        });
      }
    } else {
      this.phuongAnRow.maDviChiCuc = null;
      this.phuongAnRow.cloaiVthh = null;
      this.phuongAnRow.tonKhoChiCuc = 0;
      this.phuongAnRow.tonKhoCloaiVthh = 0;
    }
  }

  async changeChiCuc(event: any) {
    if (event) {
      let data = this.listChiCuc.find(s => s.maDvi == event);
      this.phuongAnRow.tenChiCuc = data.tenDvi;
      let body = {
        'maDvi': event,
        'loaiVthh': this.formData.value.loaiVthh
      }
      this.quanLyHangTrongKhoService.getTrangThaiHt(body).then((res) => {
        if (res.msg == MESSAGE.SUCCESS) {
          let data = res.data;
          if (data.length > 0) {
            this.phuongAnRow.tonKhoChiCuc = data.reduce((prev, cur) => prev + cur.slHienThoi, 0);
          } else {
            this.phuongAnRow.tonKhoChiCuc = 0;
          }
        }
      });
    } else {
      this.phuongAnRow.tonKhoChiCuc = 0;
    }
  }


  async changeCloaiVthh(event: any) {
    if (event) {
      let body = {
        maDvi: this.phuongAnRow.maDviChiCuc,
        loaiVthh: this.formData.value.loaiVthh,
        cloaiVthh: event
      }
      this.quanLyHangTrongKhoService.getTrangThaiHt(body).then((res) => {
        if (res.msg == MESSAGE.SUCCESS) {
          let data = res.data;
          if (data.length > 0) {
            this.phuongAnRow.tonKhoCloaiVthh = data.reduce((prev, cur) => prev + cur.slHienThoi, 0);
          } else {
            this.phuongAnRow.tonKhoCloaiVthh = 0;
          }
        }
      });
    } else {
      this.phuongAnRow.tonKhoCloaiVthh = 0;
    }
  }

  async save() {
    //this.setValidForm();
    this.formData.value.soDx = this.formData.value.soDx + this.maHauTo;
    let result = await this.createUpdate(this.formData.value);
    if (result) {
      this.quayLai();
    }
  }

  async saveAndSend(message: string) {
    this.setValidForm();
    let errorSlCuc = '';
    let errorSlChiCuc = '';
    this.phuongAnView.forEach(s => {
      s.childData.forEach(s1 => {
        if (s1.soLuongXuatCuc > s1.tonKhoCuc && s1.tonKhoCuc > s1.soLuongXuatCucThucTe) {
          errorSlCuc += s1.tenCuc + " ";
        }
        if (s1.tonKhoCuc < s1.soLuongXuatCucThucTe) {
          errorSlChiCuc += s1.tenCuc + " ";
        }
      })
    })
    if (errorSlCuc) {
      this.notification.error(MESSAGE.ERROR, 'SL tồn kho thực tế vẫn đáp ứng SL xuất cứu trợ, viện trợ. Bạn vui lòng nhập thêm để đảm bảo Tổng SL đề xuất cứu trợ, viện trợ = Tổng SL thực tế xuất cứu trợ, viện trợ! ' + errorSlCuc);
    } else if (errorSlChiCuc) {
      this.notification.error(MESSAGE.ERROR, 'SL hàng xuất thực tế vượt quá hàng trong kho hiện tại ' + errorSlChiCuc);
    } else {
      this.formData.value.soDx = this.formData.value.soDx + this.maHauTo;
      if (this.userService.isTongCuc()) {
        await this.approve(this.idInput, STATUS.CHO_DUYET_LDV, message);
      } else {
        let result = await this.createUpdate(this.formData.value);
        if (result) {
          this.idInput = result.id;
          await this.approve(this.idInput, STATUS.CHO_DUYET_TP, message);
        }
      }
    }
  }

  async saveAndChangeStatus(status: string, message: string, sucessMessage: string) {
    this.setValidForm();
    let errorSlCuc = '';
    let errorSlChiCuc = '';
    this.phuongAnView.forEach(s => {
      s.childData.forEach(s1 => {
        if (s1.soLuongXuatCuc > s1.tonKhoCuc && s1.tonKhoCuc > s1.soLuongXuatCucThucTe) {
          errorSlCuc += s1.tenCuc + " ";
        }
        if (s1.tonKhoCuc < s1.soLuongXuatCucThucTe) {
          errorSlChiCuc += s1.tenCuc + " ";
        }
      })
    })
    if (errorSlCuc) {
      this.notification.error(MESSAGE.ERROR, 'SL tồn kho thực tế vẫn đáp ứng SL xuất cứu trợ, viện trợ. Bạn vui lòng nhập thêm để đảm bảo Tổng SL đề xuất cứu trợ, viện trợ = Tổng SL thực tế xuất cứu trợ, viện trợ! ' + errorSlCuc);
    } else if (errorSlChiCuc) {
      this.notification.error(MESSAGE.ERROR, 'SL hàng xuất thực tế vượt quá hàng trong kho hiện tại ' + errorSlChiCuc);
    } else {
      this.formData.value.soDx = this.formData.value.soDx + this.maHauTo;
      let result = await this.createUpdate(this.formData.value);
      if (result) {
        this.idInput = result.id;
        await this.approve(this.idInput, status, message, null, sucessMessage);
      }
    }
  }

  flattenTree(tree) {
    return tree.flatMap((item) => {
      return item.childData ? this.flattenTree(item.childData) : item;
    });
  }

  xoaPhuongAn(data: any, dataParent?: any) {
    let deXuatPhuongAn;
    if (data.noiDung && data.childData) {
      deXuatPhuongAn = cloneDeep(this.formData.value.deXuatPhuongAn.filter(s => s.noiDung != data.noiDung));
    } else if (data.tenCuc && dataParent) {
      deXuatPhuongAn = cloneDeep(this.formData.value.deXuatPhuongAn.filter(s => !(s.tenCuc === data.tenCuc && s.noiDung === dataParent.noiDung)));
    } else if (data.id) {
      deXuatPhuongAn = cloneDeep(this.formData.value.deXuatPhuongAn.filter(s => s.id != data.id));
    } else if (data.idVirtual) {
      deXuatPhuongAn = cloneDeep(this.formData.value.deXuatPhuongAn.filter(s => s.idVirtual != data.idVirtual));
    }
    this.formData.patchValue({
      deXuatPhuongAn: deXuatPhuongAn
    })
    this.buildTableView();
  }

  async suaPhuongAn(data: any) {
    this.disableInputComponent.noiDung = true;
    this.disableInputComponent.maDviCuc = true;
    this.disableInputComponent.soLuongXuatCuc = true;

    if (data.id) {
      this.phuongAnRow = cloneDeep(this.formData.value.deXuatPhuongAn.find(s => s.id == data.id));
    } else if (data.idVirtual) {
      this.phuongAnRow = cloneDeep(this.formData.value.deXuatPhuongAn.find(s => s.idVirtual == data.idVirtual));
    }
    await this.changeCuc(this.phuongAnRow.maDviCuc);
    await this.changeChiCuc(this.phuongAnRow.maDviChiCuc);
    await this.changeCloaiVthh(this.phuongAnRow.cloaiVthh);
    this.showModal();
  }

  suaNoiDung(data: any) {
    this.phuongAnRow.noiDung = data.noiDung;
    this.phuongAnRow.noiDungEdit = data.noiDung;
    this.showModalSuaNoiDung();
  }

  showModalSuaNoiDung(): void {
    this.isVisibleSuaNoiDung = true;
  }

  handleOkSuaNoiDung(): void {
    let currentNoiDung = this.formData.value.deXuatPhuongAn.filter(s => s.noiDung == this.phuongAnRow.noiDung);
    currentNoiDung.forEach(s => {
      s.noiDung = this.phuongAnRow.noiDungEdit;
    });
    this.buildTableView();
    this.isVisibleSuaNoiDung = false;

    //clean
    this.phuongAnRow = {}

  }

  handleCancelSuaNoiDung(): void {
    this.isVisibleSuaNoiDung = false;
    this.phuongAnRow = {}
  }

  checkVld(inputName: string) {
    if (this.errorInputComponent.find(s => s === inputName)) {
      return 'error'
    } else {
      return '';
    }
  }


  setValidForm() {
    this.formData.controls["nam"].setValidators([Validators.required]);
    this.formData.controls["soDx"].setValidators([Validators.required]);
    this.formData.controls["loaiNhapXuat"].setValidators([Validators.required]);
    this.formData.controls["trichYeu"].setValidators([Validators.required]);
  }

}