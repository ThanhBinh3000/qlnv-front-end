import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import * as dayjs from 'dayjs';
import { isEmpty } from 'lodash';
import { DANH_MUC_LEVEL } from '../../../luu-kho.constant';
import { DonviService } from 'src/app/services/donvi.service';
import { UserLogin } from 'src/app/models/userlogin';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { UserService } from 'src/app/services/user.service';
import { DanhMucService } from 'src/app/services/danhmuc.service'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { QuanLySoKhoTheKhoService } from 'src/app/services/quan-ly-so-kho-the-kho.service';
import { convertTrangThai } from 'src/app/shared/commonFunction';
import { thongTinTrangThaiNhap } from 'src/app/shared/commonFunction';
import { Globals } from 'src/app/shared/globals';
import { saveAs } from 'file-saver';
import { QuanLyHangTrongKhoService } from 'src/app/services/quanLyHangTrongKho.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';

@Component({
  selector: 'app-them-so-kho-the-kho',
  templateUrl: './them-so-kho-the-kho.component.html',
  styleUrls: ['./them-so-kho-the-kho.component.scss'],
})
export class ThemSoKhoTheKhoComponent implements OnInit {
  @Output('close') onClose = new EventEmitter<any>();

  @Input() idInput: number;
  @Input() isCheck: boolean;
  @Input() isStatus: any;

  dsTong: any;

  dataTable: INhapXuat[];
  listTable: INhapXuat[];


  formData: FormGroup;
  sizePage: number = PAGE_SIZE_DEFAULT;
  page: number = 1;


  indexMax: number;
  totalElements: number;
  indexItemStart: number;
  indexItemEnd: number;
  pageSize: number = this.sizePage;
  totalRecord: number = this.sizePage;

  userInfo: UserLogin;
  detail: any = {};
  dsDonVi = [];

  listDiemKho: any[] = [];
  listNhaKho: any[] = [];
  listNganKho: any[] = [];
  listNganLo: any[] = [];
  listLoaiHangHoa: any[] = [];
  listChungLoaiHangHoa: any[] = [];
  donViTinh = '';

  maDonVi = '';
  maLoaiVTHH = '';
  maNganKho = '';
  maNganLo = '';

  isTaoTheKho = false;

  dsNganLo = [];
  dsDonViTinh = [];
  idDonViSelected = null;

  dsHangHoa: any[];

  dsChiTiet: any;

  constructor(
    private readonly fb: FormBuilder,
    private notification: NzNotificationService,
    public userService: UserService,
    private donviService: DonviService,
    private spinner: NgxSpinnerService,
    private danhMucService: DanhMucService,
    private quanLySoKhoTheKhoService: QuanLySoKhoTheKhoService,
    private quanLyHangTrongKhoService: QuanLyHangTrongKhoService,
    public globals: Globals,
    private modal: NzModalService,

  ) { }


  async ngOnInit() {
    this.spinner.show();
    try {
      this.userInfo = this.userService.getUserLogin();
      this.detail.maDvi = this.userInfo.MA_DVI;
      this.detail.tenDvi = this.userInfo.TEN_DVI;
      this.detail.tenTrangThai = 'Dự thảo';
      this.isStatus = this.globals.prop.NHAP_DU_THAO;
      await Promise.all([
        this.initForm(),
        this.loadDiemKho(),
        this.initData(),
        this.loaiVTHHGetAll(),
      ]);

      if (this.idInput) {
        this.loadChiTiet();
      }
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async loadChiTiet() {
    this.isTaoTheKho = true;
    let res = await this.quanLySoKhoTheKhoService.chiTiet(this.idInput)
    this.dsChiTiet = res.data;
    this.detail = res.data;
    this.isStatus = this.detail.trangThai;

    this.formData.patchValue({
      nam: res.data.nam,
      tuNgay: res.data.tuNgay,
      denNgay: res.data.denNgay,
      idLoaiHangHoa: res.data.loaiHang,
      idChungLoaiHangHoa: res.data.chungLoaiHang,
      idDiemKho: res.data.diemKho,
      idNhaKho: res.data.nhaKho,
      idNganKho: res.data.nganKho,
      idNganLo: res.data.loKho,
      tonDauKy: res.data.tonDauKy
    });

    this.changeLoaiHangHoa();
    this.changeDiemKho(true);

    let listNhapXuat = [];
    res.data.ds.forEach(nhapXuatKho => {
      if (nhapXuatKho.ngay) {
        const ngay = nhapXuatKho.ngay.split("-");
        nhapXuatKho.ngay = `${ngay[2]}-${ngay[1]}-${ngay[0]}`;
      }

      listNhapXuat = [
        ...listNhapXuat,
        {
          dienGiai: nhapXuatKho.dienGiai,
          ghiChu: nhapXuatKho.ghiChu,
          loaiPhieu: nhapXuatKho.soPhieuNhap ? 'NHAP' : 'XUAT',
          ngay: nhapXuatKho.ngay,
          soLuong: nhapXuatKho.soPhieuNhap ? nhapXuatKho.soLuongNhap : nhapXuatKho.soLuongXuat,
          soPhieu: nhapXuatKho.soPhieuNhap ? nhapXuatKho.soPhieuNhap : nhapXuatKho.soPhieuXuat,
          ton: nhapXuatKho.ton,
        }
      ]
    })
    this.totalRecord = Number((res.data.ds.length / this.sizePage).toFixed()) * this.sizePage;
    this.dataTable = listNhapXuat;
    this.loadListTable(1);
  }

  isDetail(): boolean {
    return (
      this.isCheck
    );
  }

  async getDataDetail(id) {
    if (id > 0) {
      let res = await this.quanLySoKhoTheKhoService.chiTiet(id);
      const data = res.data
    }
  }

  convertTrangThai(status: string) {
    return convertTrangThai(status);
  }

  thongTinTrangThai(trangThai: string): string {
    return thongTinTrangThaiNhap(trangThai);
  }

  initForm() {
    this.formData = this.fb.group({
      idDonVi: [this.detail.tenDvi, [Validators.required]],
      nam: [null, [Validators.required]],
      tuNgay: [null, [Validators.required]],
      denNgay: [null, [Validators.required]],
      idLoaiHangHoa: [null, [Validators.required]],
      idChungLoaiHangHoa: [null, [Validators.required]],
      idDiemKho: [null, [Validators.required]],
      idNhaKho: [null, [Validators.required]],
      idNganKho: [null, [Validators.required]],
      idNganLo: [null, [Validators.required]],
      tonDauKy: [null, [Validators.required]],
      donViTinh: [null],
    });
  }

  initData() {
    this.loadDsTong();
    this.loadDsNam();
  }

  loadDsNam() {
    let nam = new Date();
    this.formData.patchValue({ nam: nam.getFullYear() })
  }

  async loadDsTong() {
    const body = {
      maDviCha: this.detail.maDvi,
      trangThai: '01',
    };

    const dsTong = await this.donviService.layDonViTheoCapDo(body);
    if (!isEmpty(dsTong)) {
      this.dsTong = dsTong;
      this.dsDonVi = dsTong[DANH_MUC_LEVEL.CHI_CUC];
    }
  }


  async changeDate(type: string) {
    if (type === 'tuNgay') {
      if (this.formData.value.denNgay && this.formData.value.idNganLo && this.formData.value.idChungLoaiHangHoa) {
        await this.loadTonDauKy();
      }
    } else if (type === 'denNgay') {
      if (this.formData.value.tuNgay && this.formData.value.idNganLo && this.formData.value.idChungLoaiHangHoa) {
        await this.loadTonDauKy();
      }
    }
  }

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

  changeDiemKho(fromChiTiet: boolean) {
    let diemKho = this.listDiemKho.filter(x => {
      return (this.idInput ? x.title : x.maDvi) == this.formData.value.idDiemKho
    });
    if (diemKho && diemKho.length > 0) {
      if (!this.idInput) {
        this.formData.patchValue({ idNhaKho: null })
      }
      this.listNhaKho = diemKho[0].children;
      if (fromChiTiet) {
        this.changeNhaKho(fromChiTiet);
      }
    }
  }

  changeNhaKho(fromChiTiet: boolean) {
    let nhaKho = this.listNhaKho.filter(x => {
      return (this.idInput ? x.title : x.maDvi) == this.formData.value.idNhaKho
    });
    if (nhaKho && nhaKho.length > 0) {
      if (!this.idInput) {
        this.formData.patchValue({ idNganKho: null })
      }
      this.listNganKho = nhaKho[0].children;
      if (fromChiTiet) {
        this.changeNganKho();
      }
    }
  }

  changeNganKho() {
    let nganKho = this.listNganKho.filter(x => {
      return (this.idInput ? x.title : x.maDvi) == this.formData.value.idNganKho
    });

    if (nganKho && nganKho.length > 0) {
      if (!this.idInput && this.formData.value.idNganLo !== null) {
        this.formData.patchValue({ idNganLo: null })
      }
      this.listNganLo = nganKho[0].children;
      this.maNganKho = this.detail.maNganKho;
      if (this.idInput && this.listNganLo.length > 0) {
        this.listNganLo.forEach(x => {
          if (x.title == this.formData.value.idNganLo) {
            this.detail.maNganLo = x.maDvi;
          }
        });
      }
    }
  }

  async changeNganLo() {
    if (this.formData.value.tuNgay && this.formData.value.denNgay && this.formData.value.idChungLoaiHangHoa) {
      await this.loadTonDauKy();
    }
  }

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

  async changeLoaiHangHoa() {
    let loaiHangHoa = this.listLoaiHangHoa.filter(x => {
      return (this.idInput ? x.ten : x.ma) == this.formData.value.idLoaiHangHoa;
    });
    if (loaiHangHoa && loaiHangHoa.length > 0) {
      if (!this.idInput) {
        this.formData.patchValue({ idChungLoaiHangHoa: null })
      }
      this.listChungLoaiHangHoa = loaiHangHoa[0].child;
    }

    if (this.idInput) {
      this.listChungLoaiHangHoa.forEach(chungLoaiHangHoa => {
        if (chungLoaiHangHoa.ten === this.formData.value.idChungLoaiHangHoa) {
          this.detail.maChungLoaiHangHoa = chungLoaiHangHoa.ma;
          this.formData.patchValue({ donViTinh: chungLoaiHangHoa.maDviTinh });
        }
      })
    }
  }

  async changeChungLoaiHangHoa() {
    const loaihanghoaDVT = this.listChungLoaiHangHoa.filter(chungloaihanghoa => chungloaihanghoa.ma === this.formData.value.idChungLoaiHangHoa);
    this.formData.patchValue({ donViTinh: loaihanghoaDVT[0]?.maDviTinh });

    if (this.formData.value.tuNgay && this.formData.value.denNgay && this.formData.value.idNganLo) {
      await this.loadTonDauKy();
    }
  }


  async loadTonDauKy() {
    console.log("ton dau ky")
    try {
      this.formData.patchValue({ tonDauKy: 0 })

      const body = {
        "loaiHH": this.formData.value.idLoaiHangHoa,
        "chungLoaiHH": this.formData.value.idChungLoaiHangHoa,
        "tuNgay": dayjs(this.formData.value.tuNgay).format("YYYY-MM-DD"),
        "denNgay": dayjs(this.formData.value.denNgay).format("YYYY-MM-DD"),
        "maDiemKho": this.formData.value.idDiemKho,
        "maNhaKho": this.formData.value.idNhaKho,
        "maNganKho": this.formData.value.idNganKho,
        "maLokho": this.formData.value.idNganLo,
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
                this.formData.patchValue({ tonDauKy: child.tonKhoDauKy })
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

  exportData() {
    if (this.totalRecord > 0) {
      this.spinner.show()
      try {
        let body = {
          "theKhoId": this.idInput
        };
        this.quanLySoKhoTheKhoService.exportCT(body).subscribe((blob) => {
          saveAs(blob, 'chi-tiet-the-kho.xlsx')
        });
        this.spinner.hide();
      } catch (e) {
        console.log('error: ', e);
        this.spinner.hide();
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
    } else {
      this.notification.error(MESSAGE.ERROR, MESSAGE.DATA_EMPTY)
    }
  }

  async luu(isDuyet: boolean) {
    try {
      const body = {
        "chungLoaiHH": this.formData.value.idChungLoaiHangHoa,
        "denNgay": dayjs(this.formData.value.denNgay).format("DD-MM-YYYY"),
        "ds": this.dataTable,
        "maDvi": this.formData.value.idNganLo,
        "nam": this.formData.value.nam,
        "tenDvi": this.formData.value.idDonVi,
        "tonDauKy": this.formData.value.tonDauKy,
        "tuNgay": dayjs(this.formData.value.tuNgay).format("DD-MM-YYYY")
      }

      let res: any;
      if (this.idInput) {
        const bodyNew = {
          ...body,
          "chungLoaiHH": this.detail.maChungLoaiHangHoa,
          "maDvi": this.detail.maNganLo,
          'id': this.idInput
        }
        res = await this.quanLySoKhoTheKhoService.sua(bodyNew);
      } else {
        res = await this.quanLySoKhoTheKhoService.them(body);
      }

      if (res.msg == MESSAGE.SUCCESS) {
        this.notification.success(MESSAGE.SUCCESS, this.idInput ? MESSAGE.UPDATE_SUCCESS : MESSAGE.ADD_SUCCESS);
        if (isDuyet) {
          return res.data.id;
        }
        this.huy();
      }

    } catch (error) {
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }

  }

  luuVaDuyet() {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn gửi duyệt?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: async () => {
        this.spinner.show();
        try {
          const id = await this.luu(true);
          let body = {
            id: id,
            lyDo: null,
            trangThai: this.globals.prop.NHAP_CHO_DUYET_LD_CHI_CUC,
          };

          let res = await this.quanLySoKhoTheKhoService.pheDuyet(body);

          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.GUI_DUYET_SUCCESS);
            this.huy();
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
          this.spinner.hide();
        } catch (e) {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      },
    });
  }

  pheDuyet() {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn phê duyệt?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: async () => {
        this.spinner.show();
        try {
          let body = {
            id: this.idInput,
            lyDo: null,
            trangThai: this.globals.prop.NHAP_DA_DUYET_LD_CHI_CUC,
          };
          let res = await this.quanLySoKhoTheKhoService.pheDuyet(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.PHE_DUYET_SUCCESS);
            this.huy();
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
          this.spinner.hide();

        } catch (e) {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      },
    });
  }

  tuChoi() {
    const modalTuChoi = this.modal.create({
      nzTitle: 'Từ chối',
      nzContent: DialogTuChoiComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {},
    });
    modalTuChoi.afterClose.subscribe(async (text) => {
      if (text) {
        this.spinner.show();
        try {
          let body = {
            id: this.idInput,
            lyDoTuChoi: text,
            trangThai: this.globals.prop.NHAP_TU_CHOI_LD_CHI_CUC,
          };
          let res = await this.quanLySoKhoTheKhoService.pheDuyet(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
            this.huy();
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
          this.spinner.hide();
        } catch (e) {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      }
    });
  }

  taoTheKho() {
    this.isTaoTheKho = true;
    this.loadSoPhieuNhapXuat();

  }

  changeDienGiaiGhiChu(event, index: number, type: string) {
    const indexTable = index + this.sizePage * (this.page - 1);
    if (type === 'diengiai') {
      this.dataTable[indexTable].dienGiai = event;
    } else if (type === 'ghichu') {
      this.dataTable[indexTable].ghiChu = event;
    }
  }

  async loadSoPhieuNhapXuat() {
    try {
      const bodyNhapXuatNho =
      {
        "denNgay": dayjs(this.formData.value.denNgay).format("YYYY-MM-DD"),
        "tuNgay": dayjs(this.formData.value.tuNgay).format("YYYY-MM-DD"),
        "maLokho": this.formData.value.idNganLo,
        "maVatTu": this.formData.value.idChungLoaiHangHoa,
        "paggingReq": {
          "limit": 100000,
          "orderBy": "",
          "orderType": "",
          "page": this.page - 1
        }
      }

      const resNhapXuatKho = await this.quanLyHangTrongKhoService.searchDetail(bodyNhapXuatNho);

      let listNhapXuat = [];
      this.totalRecord = Number((resNhapXuatKho.data.totalElements / this.sizePage).toFixed()) * this.sizePage;

      this.totalElements = resNhapXuatKho.data.totalElements;
      resNhapXuatKho.data.content.forEach((nhapXuatKho, index) => {
        const ngay = nhapXuatKho.ngayPheDuyet.split("-");

        nhapXuatKho.ngayPheDuyet = `${ngay[2]}-${ngay[1]}-${ngay[0]}`;

        listNhapXuat = [
          ...listNhapXuat,
          {
            dienGiai: '',
            ghiChu: '',
            loaiPhieu: nhapXuatKho.loaiPhieu === 'NHAP' ? 'NHAP' : 'XUAT',
            ngay: nhapXuatKho.ngayPheDuyet,
            soLuong: nhapXuatKho.tongSoLuong,
            soPhieu: nhapXuatKho.soPhieu,
            ton: nhapXuatKho.loaiPhieu === 'NHAP' ? this.formData.value.tonDauKy + nhapXuatKho.tongSoLuong : this.formData.value.tonDauKy - nhapXuatKho.tongSoLuong,
          }
        ]
      })

      this.dataTable = listNhapXuat;
      this.loadListTable(1);
    } catch (error) {
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }

  }

  loadListTable(page: number) {
    this.indexItemStart = this.sizePage * (page - 1);
    this.indexItemEnd = this.sizePage * (page - 1) + (this.sizePage - 1);

    let listTable = [];

    this.dataTable.forEach((item, index) => {
      if (index >= this.indexItemStart && index <= this.indexItemEnd) {
        listTable = [
          ...listTable,
          item
        ];
      }
    })

    this.indexMax = listTable.length + (this.page - 1) * this.sizePage;

    this.listTable = listTable;
  }

  async changePageIndex(event) {
    this.page = event;
    this.loadListTable(this.page);
  }

  changePageSize(event) {
    this.sizePage = event;
    this.page = 1;
    this.loadListTable(this.page);
  }
}
interface INhapXuat {
  dienGiai: string;
  ghiChu: string;
  loaiPhieu: 'NHAP' | 'XUAT';
  ngay: Date;
  soLuong: number;
  soPhieu: string;
  ton: number;
}
