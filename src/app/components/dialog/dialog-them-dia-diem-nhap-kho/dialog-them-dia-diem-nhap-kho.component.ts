import { UserLogin } from './../../../models/userlogin';
import { DeXuatKeHoachBanDauGiaService } from './../../../services/deXuatKeHoachBanDauGia.service';
import { ChiTieuKeHoachNamCapTongCucService } from 'src/app/services/chiTieuKeHoachNamCapTongCuc.service';
import { cloneDeep } from 'lodash';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { MESSAGE } from 'src/app/constants/message';
import { DonviService } from 'src/app/services/donvi.service';
import { Globals } from 'src/app/shared/globals';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import dayjs from 'dayjs';
import { UserService } from 'src/app/services/user.service';

export class DiaDiemNhapKho {
  idVirtual: number;
  maDvi: string;
  tenDonVi: string;
  soLuong: number;
  soLuongTheoChiTieu: number;
  slDaLenKHBan: number;
  tongKhoanTienDatTruoc: string;
  tongGiaKhoiDiem: string;
  donViTinh: string;
  chiTietDiaDiems: Array<ChiTietDiaDiemNhapKho>;
  constructor(chiTietDiaDiems: Array<ChiTietDiaDiemNhapKho> = []) {
    this.chiTietDiaDiems = chiTietDiaDiems;
  }
}
export class ChiTietDiaDiemNhapKho {
  maDiemKho: string;
  maNhaKho: string;
  maNganKho: string;
  maNganLo: string;
  tenDiemKho: string;
  tenNhaKho: string;
  tenNganKho: string;
  tenLoKho: string;
  chungLoaiHh: string;
  tenChungLoaiHh: string;
  donViTinh: string;
  maDonViTaiSan: string;
  tonKho: number;
  soLuong: number;
  donGiaChuaVAT: number;
  giaKhoiDiem: number;
  soTienDatTruoc: number;
  idVirtual: number;
  soLanTraGia: number;
  donGiaCaoNhat: number;
  traGiaCaoNhat: string;
  hoTen: string;
  thanhTien: number;
  isEdit: boolean;
  constructor(tonKho: number = 0) {
    this.tonKho = tonKho;
  }
}

@Component({
  selector: 'dialog-them-dia-diem-nhap-kho',
  templateUrl: './dialog-them-dia-diem-nhap-kho.component.html',
  styleUrls: ['./dialog-them-dia-diem-nhap-kho.component.scss'],
})

export class DialogThemDiaDiemNhapKhoComponent implements OnInit {
  chiCucList: any[] = [];
  listDiemKho: any[] = [];
  listNhaKho: any[] = [];
  listNganKho: any[] = [];
  listNganLo: any[] = [];
  listDiemKhoEdit: any[] = [];
  listNhaKhoEdit: any[] = [];
  listNganKhoEdit: any[] = [];
  listNganLoEdit: any[] = [];
  listChungLoaiHangHoa: any[] = [];
  diaDiemNhapKho: DiaDiemNhapKho = new DiaDiemNhapKho();
  chiTietDiemNhapKho: ChiTietDiaDiemNhapKho = new ChiTietDiaDiemNhapKho();
  chiTietDiemNhapKhoCreate: ChiTietDiaDiemNhapKho = new ChiTietDiaDiemNhapKho();
  dsChiTietDiemNhapKhoClone: Array<ChiTietDiaDiemNhapKho> = [];
  loaiHangHoa: string;
  idChiTieu: number;
  chiTieu: any;
  phanLoTaiSanEdit: DiaDiemNhapKho | any;
  khoanTienDatTruoc: number;
  userInfo: UserLogin;
  slLonHonChiTieu: boolean;
  bodyGetTonKho = {
    maChiCuc: '',
    maDiemKho: '',
    maNhaKho: '',
    maNganKho: '',
    maLokho: '',
    chungLoaiHH: '',
    loaiHH: ''
  }
  constructor(
    private _modalRef: NzModalRef,
    private fb: FormBuilder,
    public globals: Globals,
    private notification: NzNotificationService,
    private donViService: DonviService,
    private danhMucService: DanhMucService,
    private modal: NzModalService,
    private chiTieuKeHoachNamService: ChiTieuKeHoachNamCapTongCucService,
    private cdr: ChangeDetectorRef,
    private deXuatKeHoachBanDauGiaService: DeXuatKeHoachBanDauGiaService,
    public userService: UserService,
  ) {
    this.diaDiemNhapKho.chiTietDiaDiems = [];
  }
  ngOnInit() {
    this.userInfo = this.userService.getUserLogin();
    if (this.phanLoTaiSanEdit) {
      this.diaDiemNhapKho = this.phanLoTaiSanEdit;
      this.dsChiTietDiemNhapKhoClone = this.phanLoTaiSanEdit.chiTietDiaDiems;
      this.changeChiCuc();
    }

    this.loadChiCuc();
    this.loadDanhMucHang();
    this.loadKeHoachBanDauGia();
  }
  handleOk() {
    if (this.slLonHonChiTieu || !this.diaDiemNhapKho.maDvi) {
      return;
    }
    this._modalRef.close(this.diaDiemNhapKho);
  }
  handleCancel() {
    this._modalRef.destroy();
  }

  async loadChiCuc() {
    let res = await this.donViService.layDonViChiCuc();
    if (res.msg == MESSAGE.SUCCESS) {
      this.chiCucList = res.data;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async loadDiemKho() {
    let body = {
      maDviCha: this.diaDiemNhapKho.maDvi,
      trangThai: '01',
    }
    const res = await this.donViService.getTreeAll(body);
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data && res.data.length > 0) {
        res.data.forEach(element => {
          if (element && element.capDvi == '3' && element.children) {
            this.listDiemKho = [
              ...this.listDiemKho,
              ...element.children
            ]
            this.listDiemKhoEdit = cloneDeep(this.listDiemKho);
          }
        });
      }

    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  changeDiemKho(maDiemKho: any, index?: number, isEdit?: boolean) {
    let diemKho = this.listDiemKho.find(x => x.key == maDiemKho);
    if (diemKho) {
      if (isEdit) {
        this.dsChiTietDiemNhapKhoClone[index].tenDiemKho = diemKho.title;
      } else {
        this.chiTietDiemNhapKhoCreate.tenDiemKho = diemKho.title;
        this.listNhaKho = diemKho.children;
      }
      this.listNhaKhoEdit = diemKho.children;
      this.bodyGetTonKho.maDiemKho = diemKho.key;
      if (diemKho?.children.length === 0) {
        this.loadTonKho(index, isEdit, this.diaDiemNhapKho.maDvi, this.bodyGetTonKho.maDiemKho);
      }
    }
  }

  changeNhaKho(maNhaKho: any, index?: number, isEdit?: boolean) {
    let nhaKho = this.listNhaKho.find(x => x.key == maNhaKho);
    if (nhaKho) {
      if (isEdit) {
        this.dsChiTietDiemNhapKhoClone[index].tenNhaKho = nhaKho.title;
      } else {
        this.chiTietDiemNhapKhoCreate.tenNhaKho = nhaKho.title;
        this.listNganKho = nhaKho.children;
      }
      this.listNganKhoEdit = nhaKho.children;
      this.bodyGetTonKho.maNhaKho = nhaKho.key
      if (nhaKho?.children.length === 0) {
        this.loadTonKho(index, isEdit, this.diaDiemNhapKho.maDvi, this.bodyGetTonKho.maDiemKho, this.bodyGetTonKho.maNhaKho);
      }
    }
  }

  changeNganKho(maNganKho: any, index?: number, isEdit?: boolean) {
    let nganKho = this.listNganKho.find(x => x.key == maNganKho);
    if (nganKho) {
      if (isEdit) {
        this.dsChiTietDiemNhapKhoClone[index].tenNganKho = nganKho.title;
      } else {
        this.chiTietDiemNhapKhoCreate.tenNganKho = nganKho.title;
        this.listNganLo = nganKho.children;
      }
      this.listNganLoEdit = nganKho.children;
      this.bodyGetTonKho.maNganKho = nganKho.key
      if (nganKho?.children.length === 0) {
        this.loadTonKho(index, isEdit, this.diaDiemNhapKho.maDvi, this.bodyGetTonKho.maDiemKho, this.bodyGetTonKho.maNhaKho, this.bodyGetTonKho.maNganKho);
      }
    }
  }
  changeNganLo(maNganLo: any, index?: number, isEdit?: boolean) {
    let nganLo = this.listNganLo.find(x => x.key == maNganLo);
    if (nganLo) {
      if (isEdit) {
        this.dsChiTietDiemNhapKhoClone[index].tenLoKho = nganLo.title;
      } else {
        this.chiTietDiemNhapKhoCreate.tenLoKho = nganLo.title;
      }
      this.bodyGetTonKho.maLokho = nganLo.key
      if (this.bodyGetTonKho.chungLoaiHH) {
        this.loadTonKho(index, isEdit, this.diaDiemNhapKho.maDvi,
          this.bodyGetTonKho.maDiemKho,
          this.bodyGetTonKho.maNhaKho,
          this.bodyGetTonKho.maNganKho,
          this.bodyGetTonKho.maLokho);
      }
    }
  }
  changeChungLoaiHang(maChungLoai: any, index?: number, isEdit?: boolean) {
    let chungLoaiHang = this.listChungLoaiHangHoa.find(x => x.id == maChungLoai);
    if (chungLoaiHang) {
      if (isEdit) {
        this.dsChiTietDiemNhapKhoClone[index].donViTinh = chungLoaiHang.maDviTinh;
        this.dsChiTietDiemNhapKhoClone[index].tenChungLoaiHh = chungLoaiHang.ten;
      } else {
        this.chiTietDiemNhapKhoCreate.donViTinh = chungLoaiHang.maDviTinh;
        this.chiTietDiemNhapKhoCreate.tenChungLoaiHh = chungLoaiHang.ten;
      }
      this.bodyGetTonKho.chungLoaiHH = chungLoaiHang.id;
      this.loadTonKho(index, isEdit, this.diaDiemNhapKho.maDvi,
        this.bodyGetTonKho.maDiemKho,
        this.bodyGetTonKho.maNhaKho,
        this.bodyGetTonKho.maNganKho,
        this.bodyGetTonKho.maLokho,
        this.bodyGetTonKho.chungLoaiHH);
    }
  }
  changeChiCuc() {
    this.listDiemKho = [];
    this.loadDiemKho();
    const donVi = this.chiCucList.find(dv => dv.maDvi === this.diaDiemNhapKho.maDvi);
    if (donVi) {
      this.diaDiemNhapKho.tenDonVi = donVi.tenDvi;
      this.loadChiTieu();
    }

  }

  async loadDanhMucHang() {
    let body = {
      "str": this.loaiHangHoa
    };
    let res = await this.danhMucService.loadDanhMucHangHoaTheoMaCha(body);
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data) {
        this.listChungLoaiHangHoa = res.data;
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  addDiaDiem() {
    if (!this.chiTietDiemNhapKhoCreate.maDiemKho
      || !this.chiTietDiemNhapKhoCreate.chungLoaiHh) {
      return;
    }
    this.chiTietDiemNhapKhoCreate.idVirtual = new Date().getTime();
    this.diaDiemNhapKho.idVirtual = new Date().getTime();
    this.diaDiemNhapKho.chiTietDiaDiems = [...this.diaDiemNhapKho.chiTietDiaDiems, this.chiTietDiemNhapKhoCreate];
    this.newObjectDiaDiem();
    this.dsChiTietDiemNhapKhoClone = cloneDeep(this.diaDiemNhapKho.chiTietDiaDiems);
    this.calcSoLuong();
    this.checkSoLuong();

  }
  checkSoLuong() {
    const tongSoLuong = this.diaDiemNhapKho.soLuong;
    if (tongSoLuong > this.diaDiemNhapKho.soLuongTheoChiTieu - this.diaDiemNhapKho.slDaLenKHBan) {
      this.slLonHonChiTieu = true;
    } else {
      this.slLonHonChiTieu = false;
    }
  }
  newObjectDiaDiem() {
    this.chiTietDiemNhapKhoCreate = new ChiTietDiaDiemNhapKho();
    this.listNhaKho = [];
    this.listNganKho = [];
    this.listNganLo = [];
  }
  startEdit(index: number) {
    this.dsChiTietDiemNhapKhoClone[index].isEdit = true;
  }
  saveEdit(i: number) {
    this.dsChiTietDiemNhapKhoClone[i].isEdit = false;
    Object.assign(
      this.diaDiemNhapKho.chiTietDiaDiems[i],
      this.dsChiTietDiemNhapKhoClone[i],
    );
    this.checkSoLuong();
  }
  cancelEdit(index: number) {
    this.dsChiTietDiemNhapKhoClone = cloneDeep(this.diaDiemNhapKho.chiTietDiaDiems);
    this.dsChiTietDiemNhapKhoClone[index].isEdit = false;
  }
  deleteData(id: number) {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn xóa?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: () => {
        this.diaDiemNhapKho.chiTietDiaDiems =
          this.diaDiemNhapKho.chiTietDiaDiems.filter(
            (ddNhapKho) => ddNhapKho.idVirtual !== id,
          );
        this.dsChiTietDiemNhapKhoClone = cloneDeep(
          this.diaDiemNhapKho.chiTietDiaDiems,
        );
        if (this.dsChiTietDiemNhapKhoClone.length == 0) {
          this.slLonHonChiTieu = false;
        }
      },
    });
  }
  calcSoLuong(): string {
    const tong = this.dsChiTietDiemNhapKhoClone.reduce((previousChiTiet, currentChiTiet) => previousChiTiet + currentChiTiet.soLuong,
      0);
    this.diaDiemNhapKho.soLuong = tong;
    return tong
      ? Intl.NumberFormat('en-US').format(tong)
      : '0';
  }
  calcGiaKhoiDiem(): string {
    this.chiTietDiemNhapKhoCreate.giaKhoiDiem = this.chiTietDiemNhapKhoCreate.soLuong * this.chiTietDiemNhapKhoCreate.donGiaChuaVAT;
    return this.chiTietDiemNhapKhoCreate.giaKhoiDiem
      ? Intl.NumberFormat('en-US').format(this.chiTietDiemNhapKhoCreate.giaKhoiDiem)
      : '0';
  }
  calcSoTienDatTruoc(): string {
    this.chiTietDiemNhapKhoCreate.soTienDatTruoc = this.chiTietDiemNhapKhoCreate.giaKhoiDiem * this.khoanTienDatTruoc / 100;
    return this.chiTietDiemNhapKhoCreate.soTienDatTruoc
      ? Intl.NumberFormat('en-US').format(this.chiTietDiemNhapKhoCreate.soTienDatTruoc)
      : '0';
  }
  calcGiaKhoiDiemEdit(i: number): string {
    this.dsChiTietDiemNhapKhoClone[i].giaKhoiDiem = this.dsChiTietDiemNhapKhoClone[i].soLuong * this.dsChiTietDiemNhapKhoClone[i].donGiaChuaVAT;
    return this.dsChiTietDiemNhapKhoClone[i].giaKhoiDiem
      ? Intl.NumberFormat('en-US').format(this.dsChiTietDiemNhapKhoClone[i].giaKhoiDiem)
      : '0';
  }
  calcSoTienDatTruocEdit(i: number): string {
    this.dsChiTietDiemNhapKhoClone[i].soTienDatTruoc = this.dsChiTietDiemNhapKhoClone[i].giaKhoiDiem * this.khoanTienDatTruoc / 100;
    return this.dsChiTietDiemNhapKhoClone[i].soTienDatTruoc
      ? Intl.NumberFormat('en-US').format(this.dsChiTietDiemNhapKhoClone[i].soTienDatTruoc)
      : '0';
  }

  loadChiTieu() {
    this.chiTieuKeHoachNamService
      .loadThongTinChiTieuKeHoachNam(this.idChiTieu)
      .then((res) => {
        if (res.msg == MESSAGE.SUCCESS) {
          this.chiTieu = res.data;
          switch (this.loaiHangHoa) {
            //gao
            case "0102":
              const gao = this.chiTieu?.khLuongThuc.find(x => x.maDonVi = this.diaDiemNhapKho.maDvi);
              if (gao) {
                this.diaDiemNhapKho.soLuongTheoChiTieu = gao.xtnTongGao;
              }
              break;
            //thoc
            case "0101":
              const thoc = this.chiTieu?.khLuongThuc.find(x => x.maDonVi = this.diaDiemNhapKho.maDvi);
              if (thoc) {
                this.diaDiemNhapKho.soLuongTheoChiTieu = thoc.xtnTongThoc;
              }
              break;
            //muoi
            case "02":
              const muoi = this.chiTieu?.khMuoiDuTru.find(x => x.maDonVi = this.diaDiemNhapKho.maDvi);
              if (muoi) {
                this.diaDiemNhapKho.soLuongTheoChiTieu = muoi.xtnTongSoMuoi;
              }
              break;
            default:
              break;
          }
        } else {
          this.notification.error(MESSAGE.ERROR, res.msg);
        }
      });
  }
  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }
  loadKeHoachBanDauGia() {
    let body = {
      namKeHoach: dayjs().year(),
      maDvis: this.userInfo.MA_DVI,
      pageNumber: 1,
      pageSize: 1000,
      trangThai: "02",
    };
    this.deXuatKeHoachBanDauGiaService
      .timKiem(body)
      .then((res) => {
        if (res.msg == MESSAGE.SUCCESS) {
          const tong = res.data.content.reduce((previousChiTiet, currentChiTiet) => previousChiTiet + currentChiTiet.soLuong,
            0);
          this.diaDiemNhapKho.slDaLenKHBan = tong;
        } else {
          this.notification.error(MESSAGE.ERROR, res.msg);
        }
      });
  }

  loadTonKho(
    index?: number,
    isEdit?: boolean,
    maChiCuc?: string,
    maDiemKho?: string,
    maNhaKho?: string,
    maNganKho?: string,
    maLokho?: string,
    chungLoaiHH?: string,
  ) {
    let body = {
      maChiCuc: maChiCuc,
      maDiemKho: maDiemKho,
      maNhaKho: maNhaKho,
      maNganKho: maNganKho,
      maLokho: maLokho,
      chungLoaiHH: chungLoaiHH,
      loaiHH: this.loaiHangHoa,
      pageNumber: 1,
      pageSize: 1000
    };
    this.donViService
      .getTonKho(body)
      .then((res) => {
        if (res.msg == MESSAGE.SUCCESS) {
          if (isEdit) {
            this.dsChiTietDiemNhapKhoClone[index].tonKho = res.data.total;
          } else {
            this.chiTietDiemNhapKhoCreate.tonKho = res.data.total;
          }
        } else {
          this.notification.error(MESSAGE.ERROR, res.msg);
        }
      });
  }
}