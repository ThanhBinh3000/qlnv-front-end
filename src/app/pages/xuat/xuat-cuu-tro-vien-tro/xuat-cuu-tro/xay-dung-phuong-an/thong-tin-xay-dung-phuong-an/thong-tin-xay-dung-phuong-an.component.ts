import {ChangeDetectorRef, Component, EventEmitter, Input, KeyValueDiffers, OnInit, Output,} from '@angular/core';
import {FormGroup, Validators} from '@angular/forms';
import * as dayjs from 'dayjs';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NgxSpinnerService} from 'ngx-spinner';
import {MESSAGE} from 'src/app/constants/message';
import {DiaDiemGiaoNhan, KeHoachBanDauGia, PhanLoTaiSan,} from 'src/app/models/KeHoachBanDauGia';
import {UserLogin} from 'src/app/models/userlogin';
import {DanhMucService} from 'src/app/services/danhmuc.service';

import {DeXuatKeHoachBanDauGiaService} from 'src/app/services/deXuatKeHoachBanDauGia.service';
import {DonviService} from 'src/app/services/donvi.service';
import {TinhTrangKhoHienThoiService} from 'src/app/services/tinhTrangKhoHienThoi.service';
import {
  DeXuatPhuongAnCuuTroService
} from "src/app/services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/DeXuatPhuongAnCuuTro.service";
import {STATUS} from "src/app/constants/status";
import {DatePipe} from "@angular/common";
import {chain, cloneDeep} from 'lodash';
import {DanhMucTieuChuanService} from "src/app/services/quantri-danhmuc/danhMucTieuChuan.service";
import {DiaDiemNhapKho} from 'src/app/models/CuuTro';
import {Base2Component} from "src/app/components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "src/app/services/storage.service";
import * as uuid from "uuid";
import {FileDinhKem} from "src/app/models/DeXuatKeHoachuaChonNhaThau";
import {QuanLyHangTrongKhoService} from "src/app/services/quanLyHangTrongKho.service";

export class ModalInput {
  noiDung: boolean = false;
  maDviCuc: boolean = false;
  maDviChiCuc: boolean = false;
  soLuongXuatCuc: boolean = false;
  tonKhoChiCuc: boolean = false;
  cloaiVthh: boolean = false;
  tonKhoCloaiVthh: boolean = false;
  soLuongXuatChiCuc: boolean = false;
  tenDonViTinh: boolean = false;
  donGiaKhongVat: boolean = false;
}

@Component({
  selector: 'app-thong-tin-xay-dung-phuong-an',
  templateUrl: './thong-tin-xay-dung-phuong-an.component.html',
  styleUrls: ['./thong-tin-xay-dung-phuong-an.component.scss']
})

export class ThongTinXayDungPhuongAnComponent extends Base2Component implements OnInit {
  @Input() loaiVthhInput: string;
  @Input() idInput: number;
  @Input() isView: boolean;
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
  phuongAnView = [];
  phuongAnRow: any = {};
  phuongAnRowDiff: any;
  isVisible = false;
  isVisibleSuaNoiDung = false;
  listNoiDung = []
  listThanhTien: any;
  listSoLuong: any;
  listSoLuongDeXuat: any;
  listSoLuongXuatCap: any;
  errorInputComponent: any[] = [];
  disableInputComponent: ModalInput = new ModalInput();

  constructor(
    httpClient: HttpClient,
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
    private cdr: ChangeDetectorRef,
  ) {
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
        deXuatPhuongAn: [new Array()]
      }
    );
    this.userInfo = this.userService.getUserLogin();
    this.maHauTo = '/' + this.userInfo.MA_TCKT;

    // this.setTitle();
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
      this.listLoaiHangHoa = res.data?.filter((x) => x.ma.length == 4);
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
        .then((res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            this.maHauTo = '/' + res.data.soDx.split("/")[1];
            res.data.soDx = res.data.soDx.split("/")[0];
            this.formData.patchValue(res.data);
            this.formData.value.deXuatPhuongAn.forEach(s => s.idVirtual = uuid.v4());
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
      this.listThanhTien = [0];
      this.listSoLuong = [0];
      this.listSoLuongDeXuat = [0];
      this.listSoLuongXuatCap = [0];
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

  async selectHangHoa(event: any) {
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
        this.quanLyHangTrongKhoService.getTrangThaiHt(body).then((res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            let data = res.data;
            if (data.length > 0) {
              this.formData.patchValue({tonKho: data.reduce((prev, cur) => prev + cur.slHienThoi, 0)});
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

  showModal(data?: any): void {
    if (this.userService.isCuc()) {
      this.disableInputComponent.maDviCuc = true;
    }
    if (data) {
      this.disableInputComponent.noiDung = true;
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
    if (this.userService.isCuc()) {
      this.phuongAnRow.maDviCuc = this.userInfo.MA_DVI;
      this.changeCuc(this.phuongAnRow.maDviCuc);
    }
    if (data) {
      this.phuongAnRow.maDviCuc = this.dsDonVi.find(s => s.tenDvi === data.tenCuc).maDvi;
      this.changeCuc(this.phuongAnRow.maDviCuc);
      this.phuongAnRow.noiDung = data.childData[0].noiDung;
      this.phuongAnRow.soLuongXuatCuc = data.soLuongXuatCuc;
    }

    this.isVisible = true;
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
    console.log(JSON.stringify(this.formData.value.deXuatPhuongAn), 'raw')
    let dataView = chain(this.formData.value.deXuatPhuongAn)
      .groupBy("noiDung")
      .map((value, key) => {
        let rs = chain(value)
          .groupBy("tenCuc")
          .map((v, k) => {
              let soLuongXuatCucThucTe = v.reduce((prev, cur) => prev + cur.soLuongXuatChiCuc, 0);
              let thanhTienXuatCucThucTe = v.reduce((prev, cur) => prev + cur.thanhTien, 0);
              let rowCuc = v.find(s => s.tenCuc === k);
              console.log(rowCuc, 'rowCuc');
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
      this.listThanhTien = this.formData.value.deXuatPhuongAn.map(s => s.thanhTien);
      this.listSoLuong = this.formData.value.deXuatPhuongAn.map(s => s.soLuongXuatChiCuc);
      this.listSoLuongDeXuat = this.phuongAnView.map(s => s.soLuongXuat);
      this.listSoLuongXuatCap = this.formData.value.deXuatPhuongAn.map(s => s.soLuongXuatCap);
      let xuatCap = this.phuongAnView.map(s => {
        let tongTonKhoCuc = s.childData.reduce((prev, cur) => prev + cur.tonKhoCuc, 0);
        let tongDeXuat = s.childData.reduce((prev, cur) => prev + cur.soLuongXuatCuc, 0);
        let tongThucXuat = s.childData.reduce((prev, cur) => prev + cur.soLuongXuatCucThucTe, 0);
        console.log(tongTonKhoCuc,'tongTonKhoCuc')
        console.log(tongDeXuat,'tongDeXuat')
        console.log(tongThucXuat,'tongThucXuat')
        if (tongDeXuat > tongThucXuat && tongThucXuat > tongTonKhoCuc) {
          return tongDeXuat - tongTonKhoCuc;
        } else {
          return 0
        }
      });
      this.formData.patchValue({soLuongXuatCap: xuatCap})
    } else {
      this.listThanhTien = [0];
      this.listSoLuong = [0];
      this.listSoLuongDeXuat = [0];
      this.listSoLuongXuatCap = [0];
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
    this.formData.value.soDx = this.formData.value.soDx + this.maHauTo;
    if (this.userService.isTongCuc()) {
      await this.approve(this.idInput, STATUS.CHO_DUYET_LDV, message);
    } else {
      let result = await this.createUpdate(this.formData.value);
      if (result) {
        await this.approve(this.idInput, STATUS.CHO_DUYET_TP, message);
      }
    }
  }

  async saveAndChangeStatus(status: string, message: string, sucessMessage: string) {
    this.setValidForm();
    this.formData.value.soDx = this.formData.value.soDx + this.maHauTo;
    let result = await this.createUpdate(this.formData.value);
    if (result) {
      await this.approve(this.idInput, status, message, null, sucessMessage);
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
