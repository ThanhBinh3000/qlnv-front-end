import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { DonviService } from 'src/app/services/donvi.service';
import { MESSAGE } from 'src/app/constants/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { UserService } from 'src/app/services/user.service';
import { UserLogin } from 'src/app/models/userlogin';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { QuanLyHangTrongKhoService } from 'src/app/services/quanLyHangTrongKho.service';
import { QuanLyHangBiHongCanBaoHanhService } from 'src/app/services/quanLyHangBiHongCanBaoHanh.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-them-hang-hong-can-bao-hanh',
  templateUrl: './them-hang-hong-can-bao-hanh.component.html',
  styleUrls: ['./them-hang-hong-can-bao-hanh.component.scss'],
})
export class ThemHangHongCanBaoHanhComponent implements OnInit {
  @Output('close') onClose = new EventEmitter<any>();
  @Input() idInput: number;
  @Input() isCheck: boolean = false;

  detail: any = {};
  userInfo: UserLogin;
  dsTong: any[];
  dsLoaiHangHoa: any[];
  formData: FormGroup;
  tenDonViChiCuc: string;
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

    soLuongTon: 0,
    soLuongCanBaoHanh: null,
    tenDonViTinh: null,
    lyDo: null,
    isUpdate: false
  };

  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 10;
  indexItemStart: number;
  indexItemEnd: number;

  listLoaiHangHoa: any[] = [];
  listChungLoaiHangHoa: any[] = [];
  listDiemKho: any[] = [];
  listNhaKho: any[] = [];
  listNganKho: any[] = [];
  listNganLo: any[] = [];

  constructor(
    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private donviService: DonviService,
    private notification: NzNotificationService,
    public userService: UserService,
    private danhMucService: DanhMucService,
    private quanLyHangTrongKhoService: QuanLyHangTrongKhoService,
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
      maDonVi: [this.detail.maDvi, [Validators.required]],
      maDanhSach: [null],
      ngayTao: [new Date(), [Validators.required]],
    });
  }

  async initData() {

    await Promise.all([this.loadDiemKho(), this.loaiVTHHGetAll()])

    if (this.idInput) {
      await this.loadItemChiTiet();
    }
  }

  isDetail() {
    return this.isCheck;
  }

  async loadItemChiTiet() {
    try {
      const res = await this.quanLyHangBiHongCanBaoHanhService.chitiet(this.idInput);

      if (res.data.tenDonvi) {
        this.tenDonViChiCuc = res.data.tenDonvi;
      }

      if (this.userService.isCuc) {
        await this.loadDiemKho();
      }


      if (res.data && res.msg == MESSAGE.SUCCESS) {
        this.formData.patchValue({ ngayTao: res.data.ngayTao, maDanhSach: res.data.maDanhSach });

        if (res.data.ds && res.data.ds.length > 0) {

          res.data.ds.forEach((item: any) => {
            // Loại hàng hóa
            this.listLoaiHangHoa.forEach((loaihanghoa: any) => {
              if (loaihanghoa.ten === item.loaiHang) {
                this.rowItem.maLoaiHangHoa = loaihanghoa.ma;
                this.rowItem.tenLoaiHangHoa = loaihanghoa.ten;
                this.changeLoaiHangHoa();

                this.listChungLoaiHangHoa.forEach((chungloaihanghoa: any) => {
                  if (chungloaihanghoa.ten === item.chungLoaiHang) {
                    this.rowItem.maChungLoaiHangHoa = chungloaihanghoa.ma;
                    this.rowItem.tenChungLoaiHangHoa = chungloaihanghoa.ten;
                    this.rowItem.tenDonViTinh = chungloaihanghoa.maDviTinh;
                  }
                })

              }
            })

            // Điểm kho
            this.listDiemKho.forEach((diemkho: any) => {
              if (diemkho.title === item.diemKho) {
                this.rowItem.maDiemKho = diemkho.maDvi;
                this.rowItem.tenDiemKho = diemkho.title;
                this.changeDiemKho(false);

                this.listNhaKho.forEach((nhakho: any) => {
                  if (nhakho.title === item.nhaKho) {
                    this.rowItem.maNhaKho = nhakho.maDvi;
                    this.rowItem.tenNhaKho = nhakho.title;

                    this.changeNhaKho(false);

                    this.listNganKho.forEach((ngankho: any) => {
                      if (ngankho.title === item.nganKho) {
                        this.rowItem.maNganKho = ngankho.maDvi;
                        this.rowItem.tenNganKho = ngankho.title;

                        this.changeNganKho();

                        this.listNganLo.forEach((nganlo: any) => {
                          if (ngankho.title === item.nganKho) {
                            this.rowItem.maNganLo = nganlo.maDvi;
                            this.rowItem.tenNganLo = nganlo.title;
                          }
                        })

                      }
                    })

                  }
                })

              }
            })

            this.rowItem.lyDo = item.lyDo;
            this.rowItem.soLuongTon = item.slTon;
            this.rowItem.soLuongCanBaoHanh = item.slYeuCau;

            this.dataTable.push(this.rowItem);
            this.clearData();

          })
          this.totalRecord = this.dataTable.length;
          this.loadListTable();
        }

      }

    } catch (error) {
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
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
  changeLoaiHangHoa() {
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
      this.rowItem.tenDonViTinh = chungLoaiHangHoa[0].maDviTinh;
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
        if (this.userService.isCuc()) {
          let diemkho: any[] = [];
          res.data.forEach((item: any) => {
            if (item.maDvi === this.detail.maDvi) {
              item.children.forEach((child: any) => {
                if (child.tenDvi === this.tenDonViChiCuc) {
                  diemkho = [child];
                }
              })
            }
          })

          if (diemkho.length > 0) {
            diemkho.forEach(element => {
              if (element && element.capDvi == '3' && element.children) {
                this.listDiemKho = [
                  ...this.listDiemKho,
                  ...element.children
                ]
              }
            });

          }
        } else {
          res.data.forEach(element => {
            if (element && element.capDvi == '3' && element.children) {
              this.listDiemKho = [
                ...this.listDiemKho,
                ...element.children
              ]
            }
          });
        }
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
  async changeNganLo() {
    let nganLo = this.listNganLo.filter(x => x.maDvi == this.rowItem.maNganLo);
    if (nganLo && nganLo.length > 0) {
      this.rowItem.tenNganLo = nganLo[0].title;
    }
    await this.loadSoLuongTon();
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
    if (this.rowItem.maChungLoaiHangHoa !== null && this.rowItem.maNganLo !== null) {
      if (this.rowItem.soLuongCanBaoHanh === null) {
        this.rowItem.soLuongCanBaoHanh = 0;
      }
      this.dataTable.push(this.rowItem);
      this.clearData();
      if (this.dataTable.length > 0) {
        this.totalRecord = this.dataTable.length;
      }

      if (this.dataTable.length > this.page * this.pageSize) {
        if ((this.dataTable.length - this.page * this.pageSize) > this.pageSize) {
          this.page = Number((this.dataTable.length / this.pageSize).toFixed());
        } else {
          this.page = this.page + 1;
        }
      }

      this.loadListTable();
    } else {
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_NOT_EMPTY);
    }

  }

  // Load dữ liệu ở page đang được chọn
  loadListTable() {
    this.indexItemStart = this.pageSize * (this.page - 1);
    this.indexItemEnd = this.pageSize * (this.page - 1) + (this.pageSize - 1);

    let listTable = [];

    if (this.dataTable.length > 0) {
      this.dataTable.forEach((item, index) => {
        if (index >= this.indexItemStart && index <= this.indexItemEnd) {
          listTable = [
            ...listTable,
            item
          ];
        }
      })
    }

    this.listTable = listTable;
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

      soLuongTon: 0,
      soLuongCanBaoHanh: null,
      tenDonViTinh: null,
      lyDo: null,
      isUpdate: false
    };

    this.listChungLoaiHangHoa = [];
    this.listNhaKho = [];
    this.listNganKho = [];
    this.listNganLo = [];
  }

  async luu() {
    let ds = [];
    if (this.dataTable && this.dataTable.length > 0) {
      ds = this.dataTable.map((item) => {
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
    }

    const body = {
      "ds": ds,
      "maDonVi": this.formData.value.maDonVi,
      "ngayTao": this.formData.value.ngayTao,
    }

    try {
      let res: any;

      if (this.idInput) {
        const bodyEdit = {
          ...body,
          "id": this.idInput,
        }
        res = await this.quanLyHangBiHongCanBaoHanhService.sua(bodyEdit);
      } else {
        res = await this.quanLyHangBiHongCanBaoHanhService.them(body);
      }

      if (res.msg == MESSAGE.SUCCESS) {
        this.notification.success(MESSAGE.SUCCESS, this.idInput ? MESSAGE.UPDATE_SUCCESS : MESSAGE.ADD_SUCCESS);
        this.huy();
      }
    } catch (error) {
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }

  }

  xoaItem(idx: number) {
    if (idx !== undefined) {
      this.dataTable = this.dataTable.filter((item, index) => index !== idx);
      this.totalRecord = this.dataTable.length;
      this.loadListTable();
    }
  }

  editItem(idx: number): void {
    if (idx !== undefined) {
      this.dataTable[idx].isUpdate = !this.dataTable[idx].isUpdate;
    }
  }


  exportData() {
    try {
      const body = {
        "maDonVi": this.detail.maDvi,
        "maDs": this.formData.value.maDanhSach,
        // "maVTHH": this.rowItem.maChungLoaiHangHoa,
        "ngayTao": this.formData.value.ngayTao,
      }

      this.quanLyHangBiHongCanBaoHanhService.exportListct(body).subscribe((blob) => {
        saveAs(blob, 'danh-sach-hang-bi-hong-can-bao-hanh-chi-tiet.xlsx')
      });

      this.spinner.hide();
    } catch (error) {
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }


  }

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
  tenDonViTinh: string;
  lyDo: string;
  isUpdate: boolean;
}
