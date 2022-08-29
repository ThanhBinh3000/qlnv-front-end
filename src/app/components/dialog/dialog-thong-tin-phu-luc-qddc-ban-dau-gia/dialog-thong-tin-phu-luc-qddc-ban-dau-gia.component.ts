import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { cloneDeep } from 'lodash';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { QuyetDinhPheDuyetKeHoachBanDauGia } from 'src/app/models/QdPheDuyetKHBanDauGia';
import { UserLogin } from 'src/app/models/userlogin';
import { ChiTieuKeHoachNamCapTongCucService } from 'src/app/services/chiTieuKeHoachNamCapTongCuc.service';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { DonviService } from 'src/app/services/donvi.service';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';
import { ChiTietDiaDiemNhapKho, DiaDiemNhapKho } from '../dialog-them-dia-diem-nhap-kho/dialog-them-dia-diem-nhap-kho.component';
import { MESSAGE } from './../../../constants/message';
import { DanhSachGoiThau } from './../../../models/DeXuatKeHoachuaChonNhaThau';
import { DeXuatKeHoachBanDauGiaService } from './../../../services/deXuatKeHoachBanDauGia.service';
@Component({
  selector: 'dialog-thong-tin-phu-luc-qddc-ban-dau-gia',
  templateUrl: './dialog-thong-tin-phu-luc-qddc-ban-dau-gia.component.html',
  styleUrls: ['./dialog-thong-tin-phu-luc-qddc-ban-dau-gia.component.scss'],
})
export class DialogTTPhuLucQDDCBanDauGiaComponent implements OnInit {
  formData: FormGroup;
  thongtinDauThau: DanhSachGoiThau
  loaiVthh: any;
  dataChiTieu: any;
  donGia: any;
  errorInputRequired: string = 'Dữ liệu không được để trống.';
  tableExist: boolean = false;
  selectedChiCuc: boolean = false;
  isValid: boolean = false;
  expandSet = new Set<number>();
  qdPheDuyetKhBanDauGia: QuyetDinhPheDuyetKeHoachBanDauGia = new QuyetDinhPheDuyetKeHoachBanDauGia();
  soLuong: string;
  soTienDatTruocPhuLuc: string;
  giaKhoiDiem: string;
  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }
  data: any;

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
  diaDiemNhapKho: DiaDiemNhapKho | any = new DiaDiemNhapKho();
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
  listChiCuc: any[] = [];
  donViTinh: string;
  soTienDatTruoc: number;
  tongGiaKhoiDiem: string;
  tongSoTienDatTruoc: string;
  bangPhanBoList: Array<any> = [];
  isChangeChiCuc: boolean;
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
    this.formData = this.fb.group({
      id: [null],
      maDvi: [null, [Validators.required]],
      tenDvi: [null],
      goiThau: [null, [Validators.required]],
      tenCcuc: [null],
      donGia: [null, [Validators.required]],
      soLuong: [null, [Validators.required]],
      thanhTien: [null],
      bangChu: [null],
      children: [null]
    });
  }

  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }

  ngOnInit() {

    if (this.data) {
      this.diaDiemNhapKho.tenDonVi = this.data?.thongTinTaiSans ? this.data.thongTinTaiSans[0].tenChiCuc : null;
      this.diaDiemNhapKho.maDvi = this.data?.thongTinTaiSans ? this.data.thongTinTaiSans[0].maChiCuc : null;
      this.diaDiemNhapKho.donViTinh = this.data?.thongTinTaiSans ? this.data.thongTinTaiSans[0].donViTinh : null;
      this.diaDiemNhapKho.soLuong = this.data?.thongTinTaiSans ? this.data.thongTinTaiSans[0].soLuong : null;
      this.diaDiemNhapKho.khoanTienDatTruoc = this.data.khoanTienDatTruoc;
      this.diaDiemNhapKho.chiTietDiaDiems = this.data.thongTinTaiSans ?? [];
      this.dsChiTietDiemNhapKhoClone = cloneDeep(this.diaDiemNhapKho.chiTietDiaDiems);
      this.dsChiTietDiemNhapKhoClone.forEach(chiTiet => {
        chiTiet.isEdit = false;
      })
      const phanLoTaiSans = this.diaDiemNhapKho.chiTietDiaDiems;
      for (let i = 0; i <= phanLoTaiSans.length - 1; i++) {
        for (let j = i + 1; j <= phanLoTaiSans.length; j++) {
          if (phanLoTaiSans.length == 1 || phanLoTaiSans[i].chiCuc === phanLoTaiSans[j].chiCuc) {
            const diaDiemNhapKho = new DiaDiemNhapKho();
            diaDiemNhapKho.maDvi = phanLoTaiSans[i].maChiCuc;
            diaDiemNhapKho.tenDonVi = phanLoTaiSans[i].tenChiCuc;
            diaDiemNhapKho.slDaLenKHBan = phanLoTaiSans[i].slDaLenKHBan;
            diaDiemNhapKho.soLuong = phanLoTaiSans[i].soLuong;
            const chiTietDiaDiem = new ChiTietDiaDiemNhapKho();
            chiTietDiaDiem.tonKho = phanLoTaiSans[i].tonKho;
            chiTietDiaDiem.giaKhoiDiem = phanLoTaiSans[i].giaKhoiDiem;
            chiTietDiaDiem.soTienDatTruoc = phanLoTaiSans[i].soTienDatTruoc;
            chiTietDiaDiem.maDiemKho = phanLoTaiSans[i].maDiemKho;
            chiTietDiaDiem.tenDiemKho = phanLoTaiSans[i].tenDiemKho;
            chiTietDiaDiem.maNhaKho = phanLoTaiSans[i].maNhaKho;
            chiTietDiaDiem.tenNhaKho = phanLoTaiSans[i].tenNhaKho;
            chiTietDiaDiem.maNganKho = phanLoTaiSans[i].maNganKho;
            chiTietDiaDiem.tenNganKho = phanLoTaiSans[i].tenNganKho;
            chiTietDiaDiem.maNganLo = phanLoTaiSans[i].maLoKho;
            chiTietDiaDiem.tenLoKho = phanLoTaiSans[i].tenLoKho;
            chiTietDiaDiem.chungLoaiHh = phanLoTaiSans[i].chungLoaiHh;
            chiTietDiaDiem.donViTinh = phanLoTaiSans[i].donViTinh;
            chiTietDiaDiem.tenChungLoaiHh = phanLoTaiSans[i].tenChungLoaiHh;
            chiTietDiaDiem.maDonViTaiSan = phanLoTaiSans[i].maDvTaiSan;
            chiTietDiaDiem.soLuong = phanLoTaiSans[i].soLuong;
            chiTietDiaDiem.donGiaChuaVAT = phanLoTaiSans[i].donGia;
            chiTietDiaDiem.idVirtual = phanLoTaiSans[i].id;
            diaDiemNhapKho.chiTietDiaDiems.push(chiTietDiaDiem);
            this.bangPhanBoList.push(diaDiemNhapKho);
          }
        }
      }

      this.loadChiCuc();
      this.isChangeChiCuc = true;
      this.changeChiCuc();
      this.calcTongGiaKhoiDiem();
      this.calcTongSoTienDatTruoc();
    }
    this.loadDanhMucHang();
  }

  save() {
    const body = {
      diaDiemNhapKho: this.diaDiemNhapKho,
      data: this.data
    }
    this._modalRef.close(body);
  }

  onCancel() {
    this._modalRef.destroy();
  }
  initForm() {
  }

  changeChiCuc() {
    if (!this.isChangeChiCuc) {
      this.dsChiTietDiemNhapKhoClone = [];
      this.diaDiemNhapKho.chiTietDiaDiems = [];
    }
    this.isChangeChiCuc = false;
    this.listDiemKho = [];
    this.loadDiemKho();
    const donVi = this.chiCucList.find(dv => dv.maDvi === this.diaDiemNhapKho.maDvi);
    if (donVi) {
      this.diaDiemNhapKho.tenDonVi = donVi.tenDvi;
      this.loadChiTieu();
    }

  }

  async loadChiCuc() {
    if (!this.data.maDonVi) {
      return;
    }
    let body = {
      maDviCha: this.data.maDonVi,
      trangThai: '01',
    }
    const res = await this.donViService.getTreeAll(body);
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data && res.data.length > 0) {
        this.chiCucList = res.data[0].children;
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
    let diemKho =
      isEdit
        ? this.listDiemKhoEdit.find(x => x.key == maDiemKho)
        : this.listDiemKho.find(x => x.key == maDiemKho);
    if (diemKho) {
      if (isEdit) {
        this.dsChiTietDiemNhapKhoClone[index].tenDiemKho = diemKho.title;
      } else {
        this.chiTietDiemNhapKhoCreate.tenDiemKho = diemKho.title;
        this.listNhaKho = diemKho.children;
      }
      this.listNhaKhoEdit = diemKho.children;
    }
  }

  changeNhaKho(maNhaKho: any, index?: number, isEdit?: boolean) {
    let nhaKho = !isEdit ? this.listNhaKho.find(x => x.key == maNhaKho) : this.listNhaKhoEdit.find(x => x.key == maNhaKho);
    if (nhaKho) {
      if (isEdit) {
        this.dsChiTietDiemNhapKhoClone[index].tenNhaKho = nhaKho.title;
      } else {
        this.chiTietDiemNhapKhoCreate.tenNhaKho = nhaKho.title;
        this.listNganKho = nhaKho.children;
      }
      this.listNganKhoEdit = nhaKho.children;
    }
  }

  changeNganKho(maNganKho: any, index?: number, isEdit?: boolean) {
    let nganKho = !isEdit ? this.listNganKho.find(x => x.key == maNganKho) : this.listNganKhoEdit.find(x => x.key == maNganKho);
    if (nganKho) {
      if (isEdit) {
        this.dsChiTietDiemNhapKhoClone[index].tenNganKho = nganKho.title;
      } else {
        this.chiTietDiemNhapKhoCreate.tenNganKho = nganKho.title;
        this.listNganLo = nganKho.children;
      }
      this.listNganLoEdit = nganKho.children;
    }
  }
  changeNganLo(maNganLo: any, index?: number, isEdit?: boolean) {
    let nganLo = !isEdit ? this.listNganLo.find(x => x.key == maNganLo) : this.listNganLoEdit.find(x => x.key == maNganLo);
    if (nganLo) {
      if (isEdit) {
        this.dsChiTietDiemNhapKhoClone[index].tenLoKho = nganLo.title;
      } else {
        this.chiTietDiemNhapKhoCreate.tenLoKho = nganLo.title;
      }
    }
  }
  changeChungLoaiHang(maChungLoai: any, index?: number, isEdit?: boolean) {
    let chungLoaiHang = this.listChungLoaiHangHoa.find(x => x.ma == maChungLoai);
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

  async loadDanhMucHang() {
    let body = {
      "str": this.qdPheDuyetKhBanDauGia.maVatTuCha
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
  loadChiTieu() {
    if (!this.data.qdGiaoChiTieuId) {
      return;
    }
    this.chiTieuKeHoachNamService
      .loadThongTinChiTieuKeHoachNam(this.data.qdGiaoChiTieuId)
      .then((res) => {
        if (res.msg == MESSAGE.SUCCESS) {
          this.chiTieu = res.data;
          switch (this.data.loaiHangHoa) {
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


  calcSoLuong() {
    const tong = this.dsChiTietDiemNhapKhoClone.reduce((previousChiTiet, currentChiTiet) => previousChiTiet + currentChiTiet.soLuong,
      0);
    this.diaDiemNhapKho.soLuong = tong;
    this.soLuong = tong
      ? Intl.NumberFormat('en-US').format(tong)
      : '0';
  }
  calcTongGiaKhoiDiem() {
    const tong = this.dsChiTietDiemNhapKhoClone.reduce((previousChiTiet, currentChiTiet) => previousChiTiet + currentChiTiet.giaKhoiDiem,
      0);
    this.diaDiemNhapKho.tongGiaKhoiDiem = tong
      ? Intl.NumberFormat('en-US').format(tong)
      : '0';
    this.diaDiemNhapKho.giaKhoiDiem = this.diaDiemNhapKho.tongGiaKhoiDiem;
  }
  calcTongSoTienDatTruoc() {
    const tong = this.dsChiTietDiemNhapKhoClone.reduce((previousChiTiet, currentChiTiet) => previousChiTiet + currentChiTiet.soTienDatTruoc,
      0);
    this.diaDiemNhapKho.tongKhoanTienDatTruoc = tong
      ? Intl.NumberFormat('en-US').format(tong)
      : '0';
    this.diaDiemNhapKho.khoanTienDatTruoc = this.diaDiemNhapKho.tongKhoanTienDatTruoc;

  }
  calcGiaKhoiDiem() {
    this.chiTietDiemNhapKhoCreate.giaKhoiDiem = this.chiTietDiemNhapKhoCreate.soLuong * this.chiTietDiemNhapKhoCreate.donGiaChuaVAT;
    this.giaKhoiDiem = this.chiTietDiemNhapKhoCreate.giaKhoiDiem
      ? Intl.NumberFormat('en-US').format(this.chiTietDiemNhapKhoCreate.giaKhoiDiem)
      : '0';

    this.calcSoTienDatTruoc();
  }
  calcSoTienDatTruoc() {
    this.chiTietDiemNhapKhoCreate.soTienDatTruoc = this.chiTietDiemNhapKhoCreate.giaKhoiDiem * this.diaDiemNhapKho.khoanTienDatTruoc / 100;
    this.soTienDatTruocPhuLuc = this.chiTietDiemNhapKhoCreate.soTienDatTruoc
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
    this.dsChiTietDiemNhapKhoClone[i].soTienDatTruoc = this.dsChiTietDiemNhapKhoClone[i].giaKhoiDiem * this.diaDiemNhapKho.khoanTienDatTruoc / 100;
    return this.dsChiTietDiemNhapKhoClone[i].soTienDatTruoc
      ? Intl.NumberFormat('en-US').format(this.dsChiTietDiemNhapKhoClone[i].soTienDatTruoc)
      : '0';
  }
  addDiaDiem() {
    if (!this.chiTietDiemNhapKhoCreate.maDiemKho
      || !this.chiTietDiemNhapKhoCreate.chungLoaiHh) {
      return;
    }
    this.chiTietDiemNhapKhoCreate.idVirtual = new Date().getTime();
    this.diaDiemNhapKho.idVirtual = new Date().getTime();
    this.checkChiTietDiaDiem(this.chiTietDiemNhapKhoCreate);
    const diDiemNhapKhoClone = cloneDeep(this.diaDiemNhapKho);
    this.checkExistBangPhanLo(diDiemNhapKhoClone);
    this.dsChiTietDiemNhapKhoClone = cloneDeep(this.diaDiemNhapKho.chiTietDiaDiems);
    this.newObjectDiaDiem();
    this.calcSoLuong();
    this.checkSoLuong();
    this.calcTongGiaKhoiDiem();
    this.calcTongSoTienDatTruoc();
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
    const diDiemNhapKhoClone = cloneDeep(this.diaDiemNhapKho);
    this.checkExistBangPhanLo(diDiemNhapKhoClone);
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
        const diDiemNhapKhoClone = cloneDeep(this.diaDiemNhapKho);
        this.checkExistBangPhanLo(diDiemNhapKhoClone);
        this.calcSoLuong();
        this.calcTongGiaKhoiDiem();
        this.calcTongSoTienDatTruoc();
        if (this.dsChiTietDiemNhapKhoClone.length == 0) {
          this.slLonHonChiTieu = false;
        }
      },
    });
  }


  checkExistBangPhanLo(data: any) {
    if (this.bangPhanBoList) {
      let indexExist = this.bangPhanBoList.findIndex(
        (x) => x.maDvi == data.maDvi,
      );
      if (indexExist != -1) {
        this.bangPhanBoList.splice(indexExist, 1);
      }
    } else {
      this.bangPhanBoList = [];
    }
    this.bangPhanBoList = [
      ...this.bangPhanBoList,
      data,
    ];
    console.log("this.bangPhanBoList: ", this.bangPhanBoList);

  }
  checkChiTietDiaDiem(data: any) {
    if (this.diaDiemNhapKho.chiTietDiaDiems) {
      let indexExist = this.diaDiemNhapKho.chiTietDiaDiems.findIndex(
        (x) => (x.maDiemKho == data.maDiemKho && x.maNhaKho == data.maNhaKho && x.maNganLo == data.maNganLo && x.maNganKho == data.maNganKho)
      );
      if (indexExist != -1) {
        this.diaDiemNhapKho.chiTietDiaDiems.splice(indexExist, 1);
      }
    } else {
      this.diaDiemNhapKho.chiTietDiaDiems = [];
    }
    this.diaDiemNhapKho.chiTietDiaDiems = [
      ...this.diaDiemNhapKho.chiTietDiaDiems,
      data,
    ];

  }

}