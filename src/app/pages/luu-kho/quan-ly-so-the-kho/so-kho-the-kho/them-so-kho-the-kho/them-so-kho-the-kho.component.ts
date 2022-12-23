import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PAGE_SIZE_DEFAULT} from 'src/app/constants/config';
import * as dayjs from 'dayjs';
import {isEmpty} from 'lodash';
import {DANH_MUC_LEVEL} from '../../../luu-kho.constant';
import {DonviService} from 'src/app/services/donvi.service';
import {UserLogin} from 'src/app/models/userlogin';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NgxSpinnerService} from 'ngx-spinner';
import {MESSAGE} from 'src/app/constants/message';
import {UserService} from 'src/app/services/user.service';
import {DanhMucService} from 'src/app/services/danhmuc.service'
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {QuanLySoKhoTheKhoService} from 'src/app/services/quan-ly-so-kho-the-kho.service';
import {convertTrangThai} from 'src/app/shared/commonFunction';
import {thongTinTrangThaiNhap} from 'src/app/shared/commonFunction';
import {Globals} from 'src/app/shared/globals';
import {saveAs} from 'file-saver';
import {QuanLyHangTrongKhoService} from 'src/app/services/quanLyHangTrongKho.service';
import {NzModalService} from 'ng-zorro-antd/modal';
import {DialogTuChoiComponent} from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import {BaseComponent} from 'src/app/components/base/base.component';
import {
  DialogDanhSachHangHoaComponent
} from 'src/app/components/dialog/dialog-danh-sach-hang-hoa/dialog-danh-sach-hang-hoa.component';
import {
  QuanLyPhieuNhapKhoService
} from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/nhap-kho/quanLyPhieuNhapKho.service';
import {HttpClient} from '@angular/common/http';
import {StorageService} from 'src/app/services/storage.service';

@Component({
  selector: 'app-them-so-kho-the-kho',
  templateUrl: './them-so-kho-the-kho.component.html',
  styleUrls: ['./them-so-kho-the-kho.component.scss'],
})
export class ThemSoKhoTheKhoComponent extends BaseComponent implements OnInit {
  @Output('close') onClose = new EventEmitter<any>();

  @Input() idInput: number;
  @Input() isCheck: boolean;
  @Input() isStatus: any;

  dataTable: any[] = [];

  statusTaoThe

  userInfo: UserLogin;

  listDiemKho: any[] = [];
  listNhaKho: any[] = [];
  listNganKho: any[] = [];
  listNganLo: any[] = [];

  listVthh: any[] = [];

  listCloaiVthh: any[] = [];


  dsNganLo = [];
  dsDonViTinh = [];
  idDonViSelected = null;

  constructor(
    private httpClient: HttpClient,
    private storageService: StorageService,
    private donviService: DonviService,
    private danhMucService: DanhMucService,
    private quanLySoKhoTheKhoService: QuanLySoKhoTheKhoService,
    private quanLyHangTrongKhoService: QuanLyHangTrongKhoService,
    private quanLyPhieuNhapKhoService: QuanLyPhieuNhapKhoService,
  ) {
    super(httpClient, storageService, quanLySoKhoTheKhoService);
    super.ngOnInit();
    this.formData = this.fb.group({
      id: [''],
      nam: [dayjs().get('year'), [Validators.required]],
      tenDvi: ['', [Validators.required]],
      maDvi: [''],
      tuNgay: ['', [Validators.required]],
      denNgay: ['', [Validators.required]],
      loaiVthh: ['', [Validators.required]],
      tenLoaiVthh: [''],
      cloaiVthh: ['', [Validators.required]],
      tenCloaiVthh: [''],
      donViTinh: [''],
      tonDauKy: ['', [Validators.required]],
      trangThai: ['00'],
      tenTrangThai: ['Dự Thảo'],
      maDiemKho: ['', [Validators.required]],
      maNhaKho: ['', [Validators.required]],
      maNganKho: ['', [Validators.required]],
      maLoKho: [''],
    });
  }

  async ngOnInit() {
    this.spinner.show();
    try {
      this.userInfo = this.userService.getUserLogin();
      await Promise.all([
        this.loadDiemKho(),
        this.getAllLoaiVthh()
      ]);
      if (this.idInput) {
        await this.loadChiTiet();
      } else {
        await this.initForm()
      }
      ;
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }


  async loadChiTiet() {
    // this.isTaoTheKho = true;
    // let res = await this.quanLySoKhoTheKhoService.chiTiet(this.idInput)
    // this.dsChiTiet = res.data;
    // this.detail = res.data;
    // this.isStatus = this.detail.trangThai;

    // this.formData.patchValue({
    //   nam: res.data.nam,
    //   tuNgay: res.data.tuNgay,
    //   denNgay: res.data.denNgay,
    //   idLoaiHangHoa: res.data.loaiHang,
    //   idChungLoaiHangHoa: res.data.chungLoaiHang,
    //   idDiemKho: res.data.diemKho,
    //   idNhaKho: res.data.nhaKho,
    //   idNganKho: res.data.nganKho,
    //   idNganLo: res.data.loKho,
    //   tonDauKy: res.data.tonDauKy
    // });

    // this.changeLoaiHangHoa();
    // this.changeDiemKho(true);

    // let listNhapXuat = [];
    // res.data.ds.forEach(nhapXuatKho => {
    //   if (nhapXuatKho.ngay) {
    //     const ngay = nhapXuatKho.ngay.split("-");
    //     nhapXuatKho.ngay = `${ngay[2]}-${ngay[1]}-${ngay[0]}`;
    //   }

    //   listNhapXuat = [
    //     ...listNhapXuat,
    //     {
    //       dienGiai: nhapXuatKho.dienGiai,
    //       ghiChu: nhapXuatKho.ghiChu,
    //       loaiPhieu: nhapXuatKho.soPhieuNhap ? 'NHAP' : 'XUAT',
    //       ngay: nhapXuatKho.ngay,
    //       soLuong: nhapXuatKho.soPhieuNhap ? nhapXuatKho.soLuongNhap : nhapXuatKho.soLuongXuat,
    //       soPhieu: nhapXuatKho.soPhieuNhap ? nhapXuatKho.soPhieuNhap : nhapXuatKho.soPhieuXuat,
    //       ton: nhapXuatKho.ton,
    //     }
    //   ]
    // })
    // this.totalRecord = Number((res.data.ds.length / this.sizePage).toFixed()) * this.sizePage;
    // this.dataTable = listNhapXuat;
    // this.loadListTable(1);
  }

  initForm() {
    this.formData.patchValue({
      tenDvi: this.userInfo.TEN_DVI,
      maDvi: this.userInfo.MA_DVI,
    })
  }

  async loadDiemKho() {
    let body = {
      maDviCha: this.userInfo.MA_DVI,
      trangThai: '01',
    }
    const res = await this.donviService.getTreeAll(body);
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data && res.data.length > 0) {
        res.data.forEach(element => {
          if (element && element.capDvi == '3' && element.children) {
            this.listDiemKho = element.children;
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
        this.formData.patchValue({idNhaKho: null})
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
        this.formData.patchValue({idNganKho: null})
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
        this.formData.patchValue({idNganLo: null})
      }
      this.listNganLo = nganKho[0].children;
      if (this.idInput && this.listNganLo.length > 0) {
        this.listNganLo.forEach(x => {
          if (x.title == this.formData.value.idNganLo) {
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

  async loadTonDauKy() {
    console.log("ton dau ky")
    try {
      this.formData.patchValue({tonDauKy: 0})

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
                this.formData.patchValue({tonDauKy: child.tonKhoDauKy})
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
    // if (this.totalRecord > 0) {
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
    // } else {
    //   this.notification.error(MESSAGE.ERROR, MESSAGE.DATA_EMPTY)
    // }
  }

  async save(isGuiDuyet?) {
    this.spinner.show();
    let body = this.formData.value;
    body.maDvi = this.userInfo.MA_DVI
    let res
    if (this.idInput > 0) {
      res = await this.quanLySoKhoTheKhoService.update(body);
    } else {
      res = await this.quanLySoKhoTheKhoService.create(body);
    }
    if (res.msg == MESSAGE.SUCCESS) {
      if (isGuiDuyet) {
        this.formData.patchValue({
          id: res.data.id,
          trangThai: res.data.trangThai
        })
        this.pheDuyet();
      } else {
        if (this.idInput > 0) {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
        } else {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
        }
        this.huy();
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    this.spinner.hide();
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
          let body = {
            id: this.formData.get('id').value,
            trangThai: ''
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

  async taoTheKho() {
    this.spinner.show();
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.FORM_REQUIRED_ERROR)
      this.spinner.hide();
      return;
    }
    let body = this.formData.value;
    body.paggingReq = {
      limit: this.globals.prop.MAX_INTERGER,
      page: 0,
    }
    let res = await this.quanLyPhieuNhapKhoService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.dataTable = res.data
      this.spinner.hide();
    } else {
      this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR)
      this.spinner.hide();
    }
    this.spinner.hide();
  }

  async getAllLoaiVthh() {
    let res = await this.danhMucService.danhMucChungGetAll('LOAI_HHOA');
    if (res.msg == MESSAGE.SUCCESS) {
      this.listVthh = res.data;
    }
  }

  async onChangeLoaiVthh(event) {
    if (event) {
      let body = {
        "str": event
      };
      let res = await this.danhMucService.loadDanhMucHangHoaTheoMaCha(body);
      this.listCloaiVthh = [];
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          this.listCloaiVthh = res.data;
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }
  }

  async onChangCloaiVthh(event) {
    let res = await this.danhMucService.getDetail(event);
    if (res.msg == MESSAGE.SUCCESS) {
      this.formData.patchValue({
        donViTinh: res.data ? res.data.maDviTinh : null
      })
    }
  }

}
