import { ChiTieuKeHoachNamCapTongCucService } from 'src/app/services/chiTieuKeHoachNamCapTongCuc.service';
import { cloneDeep } from 'lodash';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { MESSAGE } from 'src/app/constants/message';
import { DonviService } from 'src/app/services/donvi.service';
import { Globals } from 'src/app/shared/globals';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';

export class DiaDiemNhapKho {
  maDvi: string;
  soLuong: number;
  soLuongTheoChiTieu: number;
  slDaLenKHBan: number;
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
  tenNganLo: string;
  chungLoaiHh: string;
  tenChungLoaiHh: string;
  donViTinh: string;
  maDonViTaiSan: string;
  tonKho: string;
  soLuong: number;
  donGiaChuaVAT: number;
  idVirtual: number;
  isEdit: boolean;
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
  listChungLoaiHangHoa: any[] = [];
  diaDiemNhapKho: DiaDiemNhapKho = new DiaDiemNhapKho();
  chiTietDiemNhapKho: ChiTietDiaDiemNhapKho = new ChiTietDiaDiemNhapKho();
  chiTietDiemNhapKhoCreate: ChiTietDiaDiemNhapKho = new ChiTietDiaDiemNhapKho();
  dsChiTietDiemNhapKhoClone: Array<ChiTietDiaDiemNhapKho> = [];
  loaiHangHoa: string;
  idChiTieu: number;
  chiTieu: any;
  constructor(
    private _modalRef: NzModalRef,
    private fb: FormBuilder,
    public globals: Globals,
    private notification: NzNotificationService,
    private donViService: DonviService,
    private danhMucService: DanhMucService,
    private modal: NzModalService,
    private chiTieuKeHoachNamService: ChiTieuKeHoachNamCapTongCucService,

  ) {
  }
  ngOnInit() {
    this.loadChiCuc();
    this.loadDanhMucHang();
    this.loadChiTieu();
  }
  handleOk() {

  }
  handleCancel() {
    this._modalRef.close();
  }

  async loadChiCuc() {
    let body = {
      pageSize: 1000,
      pageNumber: 0,
      trangThai: "02",
    };
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
        this.dsChiTietDiemNhapKhoClone[index].tenNhaKho = null;
        this.dsChiTietDiemNhapKhoClone[index].tenNganKho = null;
        this.dsChiTietDiemNhapKhoClone[index].tenNganLo = null;
        this.dsChiTietDiemNhapKhoClone[index].maNhaKho = null;
        this.dsChiTietDiemNhapKhoClone[index].maNganKho = null;
        this.dsChiTietDiemNhapKhoClone[index].maNganLo = null;
        this.dsChiTietDiemNhapKhoClone[index].tenDiemKho = diemKho.title;
      } else {
        this.chiTietDiemNhapKhoCreate.tenDiemKho = diemKho.title;
        this.chiTietDiemNhapKhoCreate.tenNhaKho = null;
        this.chiTietDiemNhapKhoCreate.tenNganKho = null;
        this.chiTietDiemNhapKhoCreate.tenNganLo = null;
        this.chiTietDiemNhapKhoCreate.maNhaKho = null;
        this.chiTietDiemNhapKhoCreate.maNganKho = null;
        this.chiTietDiemNhapKhoCreate.maNganLo = null;
      }
      this.listNhaKho = diemKho.children;
    }
  }

  changeNhaKho(maNhaKho: any, index?: number, isEdit?: boolean) {
    let nhaKho = this.listNhaKho.find(x => x.key == maNhaKho);
    if (nhaKho) {
      if (isEdit) {
        this.dsChiTietDiemNhapKhoClone[index].tenNhaKho = nhaKho.title;
      } else {
        this.chiTietDiemNhapKhoCreate.tenNhaKho = nhaKho.title;
      }
      this.listNganKho = nhaKho.children;
    }
  }

  changeNganKho(maNganKho: any, index?: number, isEdit?: boolean) {
    let nganKho = this.listNganKho.find(x => x.key == maNganKho);
    if (nganKho) {
      if (isEdit) {
        this.dsChiTietDiemNhapKhoClone[index].tenNganKho = nganKho.title;
      } else {
        this.chiTietDiemNhapKhoCreate.tenNganKho = nganKho.title;
      }
      this.listNganLo = nganKho.children;
    }
  }
  changeNganLo(maNganLo: any, index?: number, isEdit?: boolean) {
    let nganLo = this.listNganLo.find(x => x.key == maNganLo);
    if (nganLo) {
      if (isEdit) {
        this.dsChiTietDiemNhapKhoClone[index].tenNganLo = nganLo.title;
      } else {
        this.chiTietDiemNhapKhoCreate.tenNganLo = nganLo.title;
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
    }
  }
  changeChiCuc() {
    this.listDiemKho = [];
    this.loadDiemKho();
    console.log("this.diaDiemNhapKho.maDvi: ", this.diaDiemNhapKho.maDvi);

    const chiTieu = this.chiTieu.khLuongThuc.find(kh => kh.maDonVi === this.diaDiemNhapKho.maDvi);
    console.log(chiTieu);
    if (chiTieu) {
      this.diaDiemNhapKho.soLuongTheoChiTieu = chiTieu.xtnTongThoc;
    }

  }

  async loadDanhMucHang() {
    console.log("this.loaiHangHoa: ", this.loaiHangHoa);

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
      || !this.chiTietDiemNhapKhoCreate.chungLoaiHh
      || !this.chiTietDiemNhapKhoCreate.maDonViTaiSan
      || !this.chiTietDiemNhapKhoCreate.soLuong
      || !this.chiTietDiemNhapKhoCreate.donGiaChuaVAT) {
      return;
    }
    const chiTietDiaDiemNhapKhoTemp = new ChiTietDiaDiemNhapKho();
    chiTietDiaDiemNhapKhoTemp.maDiemKho = this.chiTietDiemNhapKhoCreate.maDiemKho;
    chiTietDiaDiemNhapKhoTemp.maNhaKho = this.chiTietDiemNhapKhoCreate.maNhaKho;
    chiTietDiaDiemNhapKhoTemp.maNganKho = this.chiTietDiemNhapKhoCreate.maNganKho;
    chiTietDiaDiemNhapKhoTemp.maNganLo = this.chiTietDiemNhapKhoCreate.maNganLo;
    chiTietDiaDiemNhapKhoTemp.chungLoaiHh = this.chiTietDiemNhapKhoCreate.chungLoaiHh;
    chiTietDiaDiemNhapKhoTemp.tenDiemKho = this.chiTietDiemNhapKhoCreate.tenDiemKho;
    chiTietDiaDiemNhapKhoTemp.tenNhaKho = this.chiTietDiemNhapKhoCreate.tenNhaKho;
    chiTietDiaDiemNhapKhoTemp.tenNganKho = this.chiTietDiemNhapKhoCreate.tenNganKho;
    chiTietDiaDiemNhapKhoTemp.tenNganLo = this.chiTietDiemNhapKhoCreate.tenNganLo;
    chiTietDiaDiemNhapKhoTemp.tenChungLoaiHh = this.chiTietDiemNhapKhoCreate.tenChungLoaiHh;
    chiTietDiaDiemNhapKhoTemp.donViTinh = this.chiTietDiemNhapKhoCreate.donViTinh;
    chiTietDiaDiemNhapKhoTemp.maDonViTaiSan = this.chiTietDiemNhapKhoCreate.maDonViTaiSan;
    chiTietDiaDiemNhapKhoTemp.tonKho = this.chiTietDiemNhapKhoCreate.tonKho;
    chiTietDiaDiemNhapKhoTemp.soLuong = this.chiTietDiemNhapKhoCreate.soLuong;
    chiTietDiaDiemNhapKhoTemp.donGiaChuaVAT = this.chiTietDiemNhapKhoCreate.donGiaChuaVAT;
    chiTietDiaDiemNhapKhoTemp.idVirtual = new Date().getTime();
    this.diaDiemNhapKho.chiTietDiaDiems = [
      ...this.diaDiemNhapKho.chiTietDiaDiems,
      chiTietDiaDiemNhapKhoTemp,
    ];
    this.newObjectDiaDiem();
    this.dsChiTietDiemNhapKhoClone = cloneDeep(this.diaDiemNhapKho.chiTietDiaDiems);
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

  loadChiTieu() {
    this.chiTieuKeHoachNamService
      .loadThongTinChiTieuKeHoachNam(this.idChiTieu)
      .then((res) => {
        if (res.msg == MESSAGE.SUCCESS) {
          this.chiTieu = res.data;
        } else {
          this.notification.error(MESSAGE.ERROR, res.msg);
        }
      });
  }
}