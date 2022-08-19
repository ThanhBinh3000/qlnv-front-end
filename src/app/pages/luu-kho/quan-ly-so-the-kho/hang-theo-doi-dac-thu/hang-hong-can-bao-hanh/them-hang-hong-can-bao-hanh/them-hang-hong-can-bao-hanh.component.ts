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
import { QuanLyDanhSachHangHongHocService } from 'src/app/services/quanLyDanhSachHangHongHoc.service';
import { QuanLyHangBiHongCanBaoHanhService } from 'src/app/services/quanLyHangBiHongCanBaoHanh.service';

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
  listTable: IHangHongCanBaoHanh[] = [];
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
    isUpdate: false
  };

  page: number = 1;
  pageSize: number = 2;
  // pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 10;
  indexItemStart: number;
  indexItemEnd: number;

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

  listMaDanhSach: any[] = [];

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
    private quanLyDanhSachHangHongHocService: QuanLyDanhSachHangHongHocService,
    private quanLyHangBiHongCanBaoHanhService: QuanLyHangBiHongCanBaoHanhService,
  ) { }

  ngOnInit(): void {
    this.userInfo = this.userService.getUserLogin();
    this.detail.maDvi = this.userInfo.MA_DVI;
    this.detail.tenDvi = this.userInfo.TEN_DVI;

    this.initForm();
    this.initData();
  }

  initForm(): void {
    this.formData = this.fb.group({
      maDonVi: [this.detail.maDvi],
      maDanhSach: [null],
      ngayTao: [new Date()],
    });
  }

  initData() {
    this.loadMaDanhSach();
    this.loadDiemKho();
    this.loaiVTHHGetAll();
    if (this.idInput) {
      this.loadItemChiTiet();
    }
  }

  async loadItemChiTiet() {
    console.log(this.idInput)
    console.log(this.isCheck)
  }

  loadDsTong() {
    if (!isEmpty(this.dsTong)) {
      this.dsDonVi = this.dsTong[DANH_MUC_LEVEL.CHI_CUC];
      this.dsDonViDataSource = this.dsDonVi.map((item) => item.tenDvi);
    }
  }

  async loadMaDanhSach() {
    try {
      const body = {
        "denNgay": "",
        "maDonVi": "01070203",
        "maVTHH": "",
        "paggingReq": {
          "limit": 20,
          "orderBy": "",
          "orderType": "",
          "page": 0
        },
        "tuNgay": ""
      }
      const res = await this.quanLyDanhSachHangHongHocService.tracuu(body);
      this.listMaDanhSach = res.data.content;
      console.log(this.listMaDanhSach);
    } catch (error) {
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  changeMaDanhSach() {
    console.log(this.formData.value.maDanhSach)
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
    if (this.dataTable.length > 0) {
      this.totalRecord = this.dataTable.length;
    }

    if (this.dataTable.length > this.page * this.pageSize) {
      if ((this.dataTable.length - this.page * this.pageSize) > this.pageSize) {
        this.page = Number((this.dataTable.length / this.pageSize).toFixed());
        console.log('pasize > 10')
      } else {
        this.page = this.page + 1;
        console.log('pasize')
      }
    }

    this.loadListTable();

  }

  // Load dữ liệu ở page đang được chọn
  loadListTable() {
    this.indexItemStart = this.pageSize * (this.page - 1);
    this.indexItemEnd = this.pageSize * (this.page - 1) + (this.pageSize - 1);
    console.log(this.indexItemStart)
    console.log(this.indexItemEnd)

    let listTable = [];

    this.dataTable.forEach((item, index) => {
      if (index >= this.indexItemStart && index <= this.indexItemEnd) {
        listTable = [
          ...listTable,
          item
        ];
      }
    })

    this.listTable = listTable;
    console.log(this.listTable);
    console.log(this.dataTable);
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
      isUpdate: false
    };

    this.listChungLoaiHangHoa = [];
    this.listNhaKho = [];
    this.listNganKho = [];
    this.listNganLo = [];
  }

  async luu() {
    const ds = this.dataTable.map((item) => {
      return {
        "lyDo": item.lyDo,
        "maChungLoaiHang": item.maChungLoaiHangHoa,
        "maDiemKho": item.maDiemKho,
        "maLoKho": item.maNganLo,
        "maLoaiHang": item.maLoaiHangHoa,
        "maNganKho": item.maNganKho,
        "maNhaKho": item.maNhaKho,
        "slTon": item.soLuongTon,
        "slYeuCau": item.soLuongCanBaoHanh
      }
    })

    const body = {
      "ds": ds,
      "maDonVi": this.formData.value.maDonVi,
      // "maDonVi": "01070203",
      "maDanhSach": this.formData.value.maDanhSach,
      "ngayTao": this.formData.value.ngayTao,
    }

    try {
      const res = await this.quanLyHangBiHongCanBaoHanhService.them(body);

      if (res.msg == MESSAGE.SUCCESS) {
        this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
        this.huy();
      }
      console.log(res);
    } catch (error) {
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }

  }

  xoaItem(idx: number) {
    this.dataTable = this.dataTable.filter((item, index) => index !== idx);

    console.log(this.dataTable);
  }

  editItem(idx: number): void {
    this.dataTable[idx].isUpdate = !this.dataTable[idx].isUpdate;
  }

  changeLyDoSoLuong(event: any, idx: number, type: string) {
    console.log(this.dataTable);
  }

  exportData() { }
  inDanhSach() { }

  changePageIndex(event: any) {
    this.page = event;
    this.loadListTable();
  }

  changePageSize(event: any) {
    this.page = 1;
    this.pageSize = event;
    this.loadListTable();


  }

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
  isUpdate: boolean;
}
