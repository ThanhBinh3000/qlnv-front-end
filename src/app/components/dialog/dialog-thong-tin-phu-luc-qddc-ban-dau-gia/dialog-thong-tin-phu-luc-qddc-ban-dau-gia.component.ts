import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { cloneDeep } from 'lodash';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
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
  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }
  listOfData = [
    {
      id: 1,
      name: 'John Brown',
      age: 32,
      expand: false,
      address: 'New York No. 1 Lake Park',
      description: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.'
    },
    {
      id: 2,
      name: 'Jim Green',
      age: 42,
      expand: false,
      address: 'London No. 1 Lake Park',
      description: 'My name is Jim Green, I am 42 years old, living in London No. 1 Lake Park.'
    },
    {
      id: 3,
      name: 'Joe Black',
      age: 32,
      expand: false,
      address: 'Sidney No. 1 Lake Park',
      description: 'My name is Joe Black, I am 32 years old, living in Sidney No. 1 Lake Park.'
    }
  ];
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
  listChiCuc: any[] = [];
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



  ngOnInit(): void {
    console.log(this.data);
    if (this.data) {
      this.diaDiemNhapKho.tenDonVi = this.data.tenDonVi;
      this.diaDiemNhapKho.maDvi = this.data.maDv;
      this.diaDiemNhapKho.donViTinh = this.data.maDv;

    }
    this.loadChiCuc();
    // this.initForm();
  }

  save() {
    this.formData.patchValue({
      children: this.listOfData
    })
    this._modalRef.close(this.formData);
  }

  onCancel() {
    this._modalRef.destroy();
  }
  initForm() {
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
      // this.bodyGetTonKho.maDiemKho = diemKho.key;
      // if (diemKho?.children.length === 0) {
      //   this.loadTonKho(index, isEdit, this.diaDiemNhapKho.maDvi, this.bodyGetTonKho.maDiemKho);
      // }
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
      // this.bodyGetTonKho.maNhaKho = nhaKho.key
      // if (nhaKho?.children.length === 0) {
      //   this.loadTonKho(index, isEdit, this.diaDiemNhapKho.maDvi, this.bodyGetTonKho.maDiemKho, this.bodyGetTonKho.maNhaKho);
      // }
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
      // this.bodyGetTonKho.maNganKho = nganKho.key
      // if (nganKho?.children.length === 0) {
      //   this.loadTonKho(index, isEdit, this.diaDiemNhapKho.maDvi, this.bodyGetTonKho.maDiemKho, this.bodyGetTonKho.maNhaKho, this.bodyGetTonKho.maNganKho);
      // }
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
      // this.bodyGetTonKho.maLokho = nganLo.key
      // if (this.bodyGetTonKho.chungLoaiHH) {
      //   this.loadTonKho(index, isEdit, this.diaDiemNhapKho.maDvi,
      //     this.bodyGetTonKho.maDiemKho,
      //     this.bodyGetTonKho.maNhaKho,
      //     this.bodyGetTonKho.maNganKho,
      //     this.bodyGetTonKho.maLokho);
      // }
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
      // this.bodyGetTonKho.chungLoaiHH = chungLoaiHang.id;
      // this.loadTonKho(index, isEdit, this.diaDiemNhapKho.maDvi,
      //   this.bodyGetTonKho.maDiemKho,
      //   this.bodyGetTonKho.maNhaKho,
      //   this.bodyGetTonKho.maNganKho,
      //   this.bodyGetTonKho.maLokho,
      //   this.bodyGetTonKho.chungLoaiHH);
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
}