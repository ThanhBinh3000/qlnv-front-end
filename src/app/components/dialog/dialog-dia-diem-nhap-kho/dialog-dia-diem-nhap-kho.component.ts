import {UserLogin} from './../../../models/userlogin';
import {DeXuatKeHoachBanDauGiaService} from './../../../services/deXuatKeHoachBanDauGia.service';
import {ChiTieuKeHoachNamCapTongCucService} from 'src/app/services/chiTieuKeHoachNamCapTongCuc.service';
import {cloneDeep} from 'lodash';
import {DanhMucService} from 'src/app/services/danhmuc.service';
import {MESSAGE} from 'src/app/constants/message';
import {DonviService} from 'src/app/services/donvi.service';
import {Globals} from 'src/app/shared/globals';
import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {NzModalRef, NzModalService} from 'ng-zorro-antd/modal';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import dayjs from 'dayjs';
import {UserService} from 'src/app/services/user.service';
import {QuanLyHangTrongKhoService} from "../../../services/quanLyHangTrongKho.service";
import {LEVEL_USER} from "../../../constants/config";
import {ChiTietDiaDiemNhapKho, DiaDiemNhapKho} from 'src/app/models/CuuTro';

@Component({
  selector: 'dialog-them-dia-diem-nhap-kho',
  templateUrl: './dialog-dia-diem-nhap-kho.component.html',
  styleUrls: ['./dialog-dia-diem-nhap-kho.component.scss'],
})

export class DialogDiaDiemNhapKhoComponent implements OnInit {
  tableName: any;
  idDxuat: any;
  @Input() idDxuatDtl: any;
  @Input() nam: number;
  @Input() noEdit: boolean = false;
  @Input() cLoaiVthh: string;
  @Input() rowDxuatDtlSelect: any;
  cucList: any[] = [];
  chiCucList: any[] = [];
  listDiemKho: any[] = [];
  listNhaKho: any[] = [];
  listNganKho: any[] = [];
  listLoKho: any[] = [];
  listDiemKhoEdit: any[] = [];
  listNhaKhoEdit: any[] = [];
  listNganKhoEdit: any[] = [];
  listLoKhoEdit: any[] = [];
  listChungLoaiHangHoa: any[] = [];
  diaDiemNhapKho: DiaDiemNhapKho = new DiaDiemNhapKho();
  chiTietDiemNhapKho: ChiTietDiaDiemNhapKho = new ChiTietDiaDiemNhapKho();
  chiTietDiemNhapKhoCreate: ChiTietDiaDiemNhapKho = new ChiTietDiaDiemNhapKho();
  chiTietDiemNhapKhoEdit: ChiTietDiaDiemNhapKho = new ChiTietDiaDiemNhapKho();
  dsChiTietDiemNhapKhoClone: Array<ChiTietDiaDiemNhapKho> = [];
  @Input() loaiHangHoa: string;
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
  @Input() listPhuongAn: DiaDiemNhapKho | any;
  @Input() phuongAnXuatList: DiaDiemNhapKho[] = [];
  listDvi: any[] = [];


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
    private quanLyHangTrongKhoService: QuanLyHangTrongKhoService,
  ) {
    this.diaDiemNhapKho.chiTietDiaDiems = [];
  }

  async ngOnInit() {
    this.userInfo = this.userService.getUserLogin();
    await this.loadDvi();
    await this.loadCuc(LEVEL_USER.CUC, this.userInfo.MA_DVI);
    if (this.userInfo.CAP_DVI == this.globals.prop.CUC) {
      this.diaDiemNhapKho.maDvi = this.userInfo.MA_DVI;
      this.chiTietDiemNhapKhoCreate.maDvi = this.userInfo.MA_DVI;
      await this.loadChiCuc(this.userInfo.MA_DVI);
    }
    await this.loadDanhMucHang();
    if (this.listPhuongAn) {
      this.diaDiemNhapKho = this.listPhuongAn;
      this.dsChiTietDiemNhapKhoClone = this.listPhuongAn.chiTietDiaDiems;
      this.changeCuc(this.listPhuongAn.maDvi)
      this.changeChiCuc();
    }
    this.loadDetail();
    // this.loadKeHoachBanDauGia();
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

  async loadDvi() {
    let res = await this.donViService.layTatCaDonVi();
    if (res.msg == MESSAGE.SUCCESS) {
      this.listDvi = res.data;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async loadCuc(capDvi: string, maDvi: string) {
    this.cucList = this.listDvi;
    this.cucList = this.cucList.filter(s => {
      if (this.userInfo.CAP_DVI != LEVEL_USER.CAN_BO_TONG_CUC) {
        return s.capDvi == capDvi && s.maDvi == maDvi
      } else {
        return s.capDvi == capDvi;
      }
    });
  }

  async onChangeCuc(maDvi: string) {
    this.chiCucList = this.listDvi;
    this.chiCucList = this.chiCucList.filter(s => s.maDviCha == maDvi);

  }

  async loadChiCuc(maCuc: string) {
    this.chiCucList = this.listDvi;
    this.chiCucList = this.chiCucList.filter(s => s.capDvi == LEVEL_USER.CHI_CUC && s.maDviCha == maCuc);
    if (this.phuongAnXuatList) {
      let existsChiCuc = this.phuongAnXuatList.map((s) => s.maChiCuc);
      this.chiCucList = this.chiCucList.filter((s) => !existsChiCuc.includes(s.maDvi));
    }

    // console.log(this.cucList,'list cuc')
    /*   let res = await this.donViService.layDonViChiCuc();
       if (res.msg == MESSAGE.SUCCESS) {
         this.chiCucList = res.data;
         let existsChiCuc = this.phuongAnXuatList.map((s) => s.maDvi);
         this.chiCucList = this.chiCucList.filter((s) => !existsChiCuc.includes(s.maDvi));
       } else {
         this.notification.error(MESSAGE.ERROR, res.msg);
       }*/
  }

  async loadDiemKho() {
    let body = {
      maDviCha: this.diaDiemNhapKho.maChiCuc,
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
    let diemKho;
    if (isEdit) {
      diemKho = this.listDiemKhoEdit.find(x => x.key == maDiemKho);
      this.dsChiTietDiemNhapKhoClone[index].tenDiemKho = diemKho.title;
      this.listNhaKhoEdit = diemKho.children;
    } else {
      diemKho = this.listDiemKho.find(x => x.key == maDiemKho);
      this.chiTietDiemNhapKhoCreate.tenDiemKho = diemKho.title;
      this.listNhaKho = diemKho.children;
    }
    if (diemKho) {
      console.log(diemKho, 'diemkho')
      this.bodyGetTonKho.maDiemKho = diemKho.key;
      if (diemKho?.children.length === 0) {
        this.loadTonKho(index, isEdit, this.diaDiemNhapKho.maDvi, this.bodyGetTonKho.maDiemKho);
      }
    }
  }

  changeNhaKho(maNhaKho: any, index?: number, isEdit?: boolean) {
    let nhaKho;
    if (isEdit) {
      nhaKho = this.listNhaKhoEdit.find(x => x.key == maNhaKho);
      this.dsChiTietDiemNhapKhoClone[index].tenNhaKho = nhaKho.title;
      this.listNganKhoEdit = nhaKho.children;
    } else {
      nhaKho = this.listNhaKho.find(x => x.key == maNhaKho);
      this.chiTietDiemNhapKhoCreate.tenNhaKho = nhaKho.title;
      this.listNganKho = nhaKho.children;
    }
    if (nhaKho) {
      console.log(nhaKho, 'nhaKho')
      this.bodyGetTonKho.maNhaKho = nhaKho.key;
      /*if (nhaKho?.children.length === 0) {
        this.loadTonKho(index, isEdit, this.diaDiemNhapKho.maDvi, this.bodyGetTonKho.maNhaKho);
      }*/
    }
  }

  changeNganKho(maNganKho: any, index?: number, isEdit?: boolean) {
    let nganKho;
    if (isEdit) {
      nganKho = this.listNganKhoEdit.find(x => x.key == maNganKho);
      this.dsChiTietDiemNhapKhoClone[index].tenNganKho = nganKho.title;
      this.listLoKhoEdit = nganKho.children;
    } else {
      nganKho = this.listNganKho.find(x => x.key == maNganKho);
      this.chiTietDiemNhapKhoCreate.tenNganKho = nganKho.title;
      this.listLoKho = nganKho.children;
    }
    this.bodyGetTonKho.maNganKho = nganKho.key
    /*if (nganKho?.children.length === 0) {
      this.loadTonKho(index, isEdit, this.diaDiemNhapKho.maDvi, this.bodyGetTonKho.maDiemKho, this.bodyGetTonKho.maNhaKho, this.bodyGetTonKho.maNganKho);
    }*/

    if (nganKho?.children.length === 0) {
      let res = this.quanLyHangTrongKhoService.getTrangThaiHienThoiKho({
        maDvi: nganKho.key,
        maVTHH: this.cLoaiVthh,
        nam: this.nam
      }).then(res => {
        if (res.msg == MESSAGE.SUCCESS) {
          if (res.data) {
            if (isEdit) {
              this.dsChiTietDiemNhapKhoClone[index].tonKho = res.data.duDau + res.data.tongNhap - res.data.tongXuat;
              this.dsChiTietDiemNhapKhoClone[index].chungLoaiHh = res.data.maVTHH + "";

              let chungLoaiHang = this.listChungLoaiHangHoa.find(x => x.ma == res.data.maVTHH);
              if (chungLoaiHang) {
                this.dsChiTietDiemNhapKhoClone[index].donViTinh = chungLoaiHang.maDviTinh;
                this.dsChiTietDiemNhapKhoClone[index].tenChungLoaiHh = chungLoaiHang.ten;
              }
            } else {
              this.chiTietDiemNhapKhoCreate.tonKho = res.data.duDau + res.data.tongNhap - res.data.tongXuat;
              this.chiTietDiemNhapKhoCreate.chungLoaiHh = res.data.maVTHH + "";

              let chungLoaiHang = this.listChungLoaiHangHoa.find(x => x.ma == res.data.maVTHH);
              if (chungLoaiHang) {
                this.chiTietDiemNhapKhoCreate.donViTinh = chungLoaiHang.maDviTinh;
                this.chiTietDiemNhapKhoCreate.tenChungLoaiHh = chungLoaiHang.ten;
              }
            }
          }
        } else {
          this.notification.error(MESSAGE.ERROR, res.msg);
        }
      });
    }
  }


  changeNganLo(maNganLo: any, index?: number, isEdit?: boolean) {
    let nganLo;
    if (isEdit) {
      nganLo = this.listLoKhoEdit.find(x => x.key == maNganLo);
      if (nganLo) {
        this.dsChiTietDiemNhapKhoClone[index].tenLoKho = nganLo.title;
      }
    } else {
      nganLo = this.listLoKho.find(x => x.key == maNganLo);
      if (nganLo) {
        this.chiTietDiemNhapKhoCreate.tenLoKho = nganLo.title;
      }
    }
    if (nganLo) {
      console.log(nganLo, 'nganLo')
      this.bodyGetTonKho.maLokho = nganLo.key;
      /*if (nganLo?.children.length === 0) {
        this.loadTonKho(index, isEdit, this.diaDiemNhapKho.maDvi, this.bodyGetTonKho.maLokho);
      }*/
      /*   if (this.bodyGetTonKho.chungLoaiHH) {
           this.loadTonKho(index, isEdit, this.diaDiemNhapKho.maDvi,
             this.bodyGetTonKho.maDiemKho,
             this.bodyGetTonKho.maNhaKho,
             this.bodyGetTonKho.maNganKho,
             this.bodyGetTonKho.maLokho);
         }*/
      let res = this.quanLyHangTrongKhoService.getTrangThaiHienThoiKho({
        maDvi: nganLo.key,
        maVTHH: this.cLoaiVthh,
        nam: this.nam
      }).then(res => {
        if (res.msg == MESSAGE.SUCCESS) {
          if (res.data) {
            if (isEdit) {
              this.dsChiTietDiemNhapKhoClone[index].tonKho = res.data.duDau + res.data.tongNhap - res.data.tongXuat;
              this.dsChiTietDiemNhapKhoClone[index].chungLoaiHh = res.data.maVTHH + "";

              let chungLoaiHang = this.listChungLoaiHangHoa.find(x => x.ma == res.data.maVTHH);
              if (chungLoaiHang) {
                this.dsChiTietDiemNhapKhoClone[index].donViTinh = chungLoaiHang.maDviTinh;
                this.dsChiTietDiemNhapKhoClone[index].tenChungLoaiHh = chungLoaiHang.ten;
              }
            } else {
              this.chiTietDiemNhapKhoCreate.tonKho = res.data.duDau + res.data.tongNhap - res.data.tongXuat;
              this.chiTietDiemNhapKhoCreate.chungLoaiHh = res.data.maVTHH + "";

              let chungLoaiHang = this.listChungLoaiHangHoa.find(x => x.ma == res.data.maVTHH);
              if (chungLoaiHang) {
                this.chiTietDiemNhapKhoCreate.donViTinh = chungLoaiHang.maDviTinh;
                this.chiTietDiemNhapKhoCreate.tenChungLoaiHh = chungLoaiHang.ten;
              }
            }
          }
        } else {
          this.notification.error('nỗi', res.msg);
        }
      });
    }
  }

  changeChungLoaiHang(maChungLoai: any, index?: number, isEdit?: boolean) {
    let chungLoaiHang = this.listChungLoaiHangHoa.find(x => x.ma == maChungLoai);
    if (chungLoaiHang) {
      if (isEdit) {
        this.dsChiTietDiemNhapKhoClone[index].donViTinh = chungLoaiHang.maDviTinh;
        // this.dsChiTietDiemNhapKhoClone[index].tenChungLoaiHh = chungLoaiHang.ten;
      } else {
        this.chiTietDiemNhapKhoCreate.donViTinh = chungLoaiHang.maDviTinh;
        // this.chiTietDiemNhapKhoCreate.tenChungLoaiHh = chungLoaiHang.ten;
      }
      /*this.bodyGetTonKho.chungLoaiHH = chungLoaiHang.id;
      this.loadTonKho(index, isEdit, this.diaDiemNhapKho.maDvi,
        this.bodyGetTonKho.maDiemKho,
        this.bodyGetTonKho.maNhaKho,
        this.bodyGetTonKho.maNganKho,
        this.bodyGetTonKho.maLokho,
        this.bodyGetTonKho.chungLoaiHH);*/
    }
  }

  changeChiCuc() {
    this.listDiemKho = [];
    this.loadDiemKho();
    const donVi = this.chiCucList.find(dv => dv.maDvi === this.diaDiemNhapKho.maChiCuc);
    if (donVi) {
      this.diaDiemNhapKho.maChiCuc = donVi.maDvi;
      this.diaDiemNhapKho.tenChiCuc = donVi.tenDvi;
      this.chiTietDiemNhapKhoCreate.maChiCuc = donVi.maDvi;
      this.chiTietDiemNhapKhoCreate.tenChiCuc = donVi.tenDvi;
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
    if (!this.chiTietDiemNhapKhoCreate.tonKho) {
      this.notification.error(MESSAGE.ERROR, 'Không tìm thấy loại hàng hóa trong kho.');
      return;
    }
    let total = this.rowDxuatDtlSelect.phuongAnXuat.reduce((prev, cur) => prev = +cur.soLuong, 0);
    total += this.diaDiemNhapKho.chiTietDiaDiems.reduce((prev, cur) => prev = +cur.soLuong, 0);
    total += this.chiTietDiemNhapKhoCreate.soLuong;
    if (total > this.rowDxuatDtlSelect.soLuong) {
      this.notification.error(MESSAGE.ERROR, 'Vượt quá số lượng tối đa của đề xuất.');
      return;
    }
    this.chiTietDiemNhapKhoCreate.idVirtual = new Date().getTime();
    //this.chiTietDiemNhapKhoCreate.idDxuatDtl = this.idDxuatDtl;
    this.diaDiemNhapKho.idVirtual = new Date().getTime();
    this.diaDiemNhapKho.chiTietDiaDiems = [...this.diaDiemNhapKho.chiTietDiaDiems, this.chiTietDiemNhapKhoCreate];
    this.newObjectDiaDiem();
    this.dsChiTietDiemNhapKhoClone = cloneDeep(this.diaDiemNhapKho.chiTietDiaDiems);

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
    this.listLoKho = [];
  }

  startEdit(index: number) {
    this.tinhTien(this.dsChiTietDiemNhapKhoClone[index]);
    this.chiTietDiemNhapKhoEdit = cloneDeep(this.dsChiTietDiemNhapKhoClone[index]);
    this.changeDiemKho(this.chiTietDiemNhapKhoEdit.maDiemKho, index, true)
    this.changeNhaKho(this.chiTietDiemNhapKhoEdit.maNhaKho, index, true)
    this.changeNganKho(this.chiTietDiemNhapKhoEdit.maNganKho, index, true)
    this.changeNganLo(this.chiTietDiemNhapKhoEdit.maLoKho, index, true)
    this.dsChiTietDiemNhapKhoClone[index].isEdit = true;
  }

  saveEdit(i: number) {
    let total = this.rowDxuatDtlSelect.phuongAnXuat.reduce((prev, cur) => prev = +cur.soLuong, 0);
    total += this.diaDiemNhapKho.chiTietDiaDiems.reduce((prev, cur) => prev = +cur.soLuong, 0);
    total += this.dsChiTietDiemNhapKhoClone[i].soLuong;
    if (total > this.rowDxuatDtlSelect.soLuong) {
      this.notification.error(MESSAGE.ERROR, 'Vượt quá số lượng tối đa của đề xuất.');
      return;
    }
    this.dsChiTietDiemNhapKhoClone[i].isEdit = false;
    Object.assign(
      this.diaDiemNhapKho.chiTietDiaDiems[i],
      this.dsChiTietDiemNhapKhoClone[i],
    );
    //this.checkSoLuong();
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

  loadDetail() {
    if (this.idDxuatDtl) {

    }
  }

  changeCuc(maDvi: string) {
    this.loadChiCuc(maDvi);
    this.chiTietDiemNhapKhoCreate.maDvi = this.diaDiemNhapKho.maDvi;
  }

  tinhTien(item: any) {
    item.thanhTien = 0;
    if (item.donGia > 0 && item.soLuong > 0) {
      item.thanhTien = item.donGia * item.soLuong;
    }
  }
}
