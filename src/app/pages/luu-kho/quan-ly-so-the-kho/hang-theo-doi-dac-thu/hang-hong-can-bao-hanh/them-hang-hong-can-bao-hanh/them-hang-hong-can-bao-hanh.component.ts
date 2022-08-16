import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { DANH_MUC_LEVEL } from 'src/app/pages/luu-kho/luu-kho.constant';
import { DonviService } from 'src/app/services/donvi.service';
import { isEmpty } from 'lodash';
import { MESSAGE } from 'src/app/constants/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { UserService } from 'src/app/services/user.service';
import { UserLogin } from 'src/app/models/userlogin';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { NgxSpinnerService } from 'ngx-spinner';
import * as dayjs from 'dayjs';
import { QuanLyHangTrongKhoService } from 'src/app/services/quanLyHangTrongKho.service';

@Component({
  selector: 'app-them-hang-hong-can-bao-hanh',
  templateUrl: './them-hang-hong-can-bao-hanh.component.html',
  styleUrls: ['./them-hang-hong-can-bao-hanh.component.scss'],
})
export class ThemHangHongCanBaoHanhComponent implements OnInit {
  @Output('close') onClose = new EventEmitter<any>();


  @Input() idInput: number;
  @Input() isCheck: boolean;
  // @Input() isStatus: any;

  dsTong: any[];
  dsLoaiHangHoa: any[];
  formData: FormGroup;
  dataTable: IHangHongCanBaoHanh[] = [];
  rowItem: IHangHongCanBaoHanh = {
    maLoaiHangHoa: null,
    tenLoaiHangHoa: null,

    maChungLoaiHangHoa: null,
    tenChungLoaiHangHoa: null,

    maDiemKho: null,
    tenDiemKho: null,

    maNhaKho: null,
    tenNhaKho: null,

    maNganKho: null,
    tenNganKho: null,

    maNganLo: null,
    tenNganLo: null,

    soLuongTon: null,
    soLuongCanBaoHanh: null,
    tenDonVi: null,
    lyDo: null,
  };
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 10;
  dataEdit: {
    [key: string]: { edit: boolean; data: IHangHongCanBaoHanh };
  } = {};
  dsDonVi = [];
  dsDonViDataSource = [];
  dsDiemKho = [];
  dsDiemKhoDataSource = [];
  dsNhaKho = [];
  dsNhaKhoDataSource = [];
  dsNganLo = [];
  dsNganLoDataSource = [];

  listLoaiHangHoa: any[] = [];
  listChungLoaiHangHoa: any[] = [];
  listDiemKho: any[] = [];
  listNhaKho: any[] = [];
  listNganKho: any[] = [];
  listNganLo: any[] = [];
  detail: any = {};
  userInfo: UserLogin;

  tenDonVi: string;


  constructor(
    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private donviService: DonviService,
    private notification: NzNotificationService,
    public userService: UserService,
    private danhMucService: DanhMucService,
    private quanLyHangTrongKhoService: QuanLyHangTrongKhoService,
  ) { }

  ngOnInit(): void {
    this.userInfo = this.userService.getUserLogin();
    this.detail.maDvi = this.userInfo.MA_DVI;

    console.log(this.userInfo)
    this.initForm();
    this.initData();
  }

  initForm(): void {
    this.formData = this.fb.group({
      idDonVi: [null],
      tenDonVi: [null],
      idDanhSach: [null],
      ngayTao: [new Date()],
    });
  }

  initData() {
    this.loadDsTong();
    this.loadDiemKho();
    this.loaiVTHHGetAll();
  }

  loadDsTong() {
    if (!isEmpty(this.dsTong)) {
      this.dsDonVi = this.dsTong[DANH_MUC_LEVEL.CHI_CUC];
      this.dsDonViDataSource = this.dsDonVi.map((item) => item.tenDvi);
    }
  }

  onChangeDonVi(id) {
    const chiCuc = this.dsDonVi.find((item) => item.id === Number(id));
    if (chiCuc) {
      const result = {
        ...this.donviService.layDsPhanTuCon(this.dsTong, chiCuc),
      };
      this.dsDiemKho = result[DANH_MUC_LEVEL.DIEM_KHO];
    } else {
      this.dsDiemKho = [];
    }
  }


  // Load loại hàng hóa
  async loaiVTHHGetAll() {
    try {
      await this.danhMucService.loadDanhMucHangHoa().subscribe((hangHoa) => {
        if (hangHoa.msg == MESSAGE.SUCCESS) {
          hangHoa.data.forEach((item) => {
            if (item.cap === "1" && item.ma != '01') {
              this.listLoaiHangHoa = [
                ...this.listLoaiHangHoa,
                item
              ];
            }
            else {
              this.listLoaiHangHoa = [
                ...this.listLoaiHangHoa,
                ...item.child
              ];
            }
          })
        }
      })
    } catch (error) {
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  // load chủng loại hàng hóa
  async changeLoaiHangHoa() {
    let loaiHangHoa = this.listLoaiHangHoa.filter(x => x.ma == this.rowItem.maLoaiHangHoa);
    if (loaiHangHoa && loaiHangHoa.length > 0) {
      this.rowItem.tenLoaiHangHoa = loaiHangHoa[0].ten;
      this.listChungLoaiHangHoa = loaiHangHoa[0].child;
    }
  }

  changeChungLoaiHangHoa() {
    let chungLoaiHangHoa = this.listChungLoaiHangHoa.filter(x => x.ma == this.rowItem.maChungLoaiHangHoa);
    if (chungLoaiHangHoa && chungLoaiHangHoa.length > 0) {
      this.rowItem.tenChungLoaiHangHoa = chungLoaiHangHoa[0].ten;
      this.rowItem.tenDonVi = chungLoaiHangHoa[0].maDviTinh;
    }

  }


  // load điểm kho
  async loadDiemKho() {
    let body = {
      maDviCha: this.detail.maDvi,
      trangThai: '01',
    }
    const res = await this.donviService.getTreeAll(body);
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

  // change điểm kho
  changeDiemKho(fromChiTiet: boolean) {
    let diemKho = this.listDiemKho.filter(x => x.maDvi == this.rowItem.maDiemKho);
    if (diemKho && diemKho.length > 0) {
      this.rowItem.tenDiemKho = diemKho[0].title;
      this.listNhaKho = diemKho[0].children;
      if (fromChiTiet) {
        this.changeNhaKho(fromChiTiet);
      }
    }

  }

  // change nhà kho
  changeNhaKho(fromChiTiet: boolean) {
    let nhaKho = this.listNhaKho.filter(x => x.maDvi == this.rowItem.maNhaKho);
    if (nhaKho && nhaKho.length > 0) {
      this.rowItem.tenNhaKho = nhaKho[0].title;
      this.listNganKho = nhaKho[0].children;
      if (fromChiTiet) {
        this.changeNganKho();
      }
    }

  }

  // change ngăn kho
  changeNganKho() {
    let nganKho = this.listNganKho.filter(x => x.maDvi == this.rowItem.maNganKho);
    if (nganKho && nganKho.length > 0) {
      this.rowItem.tenNganKho = nganKho[0].title;
      this.listNganLo = nganKho[0].children;
    }
  }

  // change Ngăn lô
  changeNganLo() {
    let nganLo = this.listNganLo.filter(x => x.maDvi == this.rowItem.maNganLo);
    if (nganLo && nganLo.length > 0) {
      this.rowItem.tenNganLo = nganLo[0].title;
    }
    console.log(this.rowItem);

    this.loadSoLuongTon();
  }

  //load số lượng tồn
  async loadSoLuongTon() {
    try {
      const body = {
        "loaiHH": this.rowItem.maLoaiHangHoa,
        "chungLoaiHH": this.rowItem.maChungLoaiHangHoa,
        "tuNgay": "",
        "denNgay": "",
        "maDiemKho": this.rowItem.maDiemKho,
        "maNhaKho": this.rowItem.maNhaKho,
        "maNganKho": this.rowItem.maNganKho,
        "maLokho": this.rowItem.maNganLo,
        "paggingReq": {
          "limit": 1000,
          "page": 0
        }
      }
      const res = await this.quanLyHangTrongKhoService.searchHangTrongKho(body);

      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data && res.data.content.length > 0) {
          res.data.content.forEach((item) => {
            item.child.forEach((child) => {
              if (child.maDvi === this.userInfo.MA_DVI) {
                this.rowItem.soLuongTon = item.tonKhoCuoiKy;
              }
            })
          });
        }
      }
    } catch (error) {
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  huy() {
    this.onClose.emit();
  }

  themMoiItem() {
    this.dataTable.push(this.rowItem);
    this.clearData();
  }

  clearData() {
    this.rowItem = {
      maLoaiHangHoa: null,
      tenLoaiHangHoa: null,

      maChungLoaiHangHoa: null,
      tenChungLoaiHangHoa: null,

      maDiemKho: null,
      tenDiemKho: null,

      maNhaKho: null,
      tenNhaKho: null,

      maNganKho: null,
      tenNganKho: null,

      maNganLo: null,
      tenNganLo: null,

      soLuongTon: null,
      soLuongCanBaoHanh: null,
      tenDonVi: null,
      lyDo: null,
    };

    this.listChungLoaiHangHoa = [];
    this.listNhaKho = [];
    this.listNganKho = [];
    this.listNganLo = [];
  }

  luu() {
    console.log(this.dataTable);
  }

  exportData() { }

  inDanhSach() { }


  xoaItem(id: number) { }



  changePageIndex(event) { }

  changePageSize(event) { }

  editItem(id: number): void {
    this.dataEdit[id].edit = true;
  }

  // huyEdit(id: number): void {
  //   const index = this.dataTable.findIndex((item) => item.id === id);
  //   this.dataEdit[id] = {
  //     data: { ...this.dataTable[index] },
  //     edit: false,
  //   };
  // }

  // luuEdit(id: number): void {
  //   const index = this.dataTable.findIndex((item) => item.id === id);
  //   Object.assign(this.dataTable[index], this.dataEdit[id].data);
  //   this.dataEdit[id].edit = false;
  // }

  // updateEditCache(): void {
  //   this.dataTable.forEach((item) => {
  //     this.dataEdit[item.id] = {
  //       edit: false,
  //       data: { ...item },
  //     };
  //   });
  // }
}

interface IDanhSachHangHongCanBaoHanh {
  id: number;
  maDanhSach: string;
  idDonVi: number;
  tenDonVi: string;
  ngayTao: Date;
  trangThai: string;
  danhSachHang: IHangHongCanBaoHanh[];
}

interface IHangHongCanBaoHanh {
  maLoaiHangHoa: number;
  tenLoaiHangHoa: string;

  maChungLoaiHangHoa: number;
  tenChungLoaiHangHoa: string;

  maDiemKho: number;
  tenDiemKho: string;

  maNhaKho: number;
  tenNhaKho: string;

  maNganKho: number;
  tenNganKho: string;

  maNganLo: number;
  tenNganLo: string;

  soLuongTon: number;
  soLuongCanBaoHanh: number;
  tenDonVi: string;
  lyDo: string;
}
