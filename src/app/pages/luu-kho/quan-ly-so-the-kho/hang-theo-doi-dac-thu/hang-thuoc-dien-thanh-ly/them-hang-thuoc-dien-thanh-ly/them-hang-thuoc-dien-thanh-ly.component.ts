import {Component, EventEmitter, OnInit, Output, Input} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {PAGE_SIZE_DEFAULT} from 'src/app/constants/config';
import {isEmpty} from 'lodash';
import {DANH_MUC_LEVEL} from '../../../../luu-kho.constant';
import {DonviService} from 'src/app/services/donvi.service';
import {QuanLyChatLuongLuuKhoService} from 'src/app/services/quanLyChatLuongLuuKho.service';
import {MESSAGE} from 'src/app/constants/message';
import {DanhMucService} from 'src/app/services/danhmuc.service';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {saveAs} from 'file-saver';
import {NgxSpinnerService} from 'ngx-spinner';
import {UserLogin} from 'src/app/models/userlogin';
import {UserService} from 'src/app/services/user.service';
import {Globals} from "../../../../../../shared/globals";
import {STATUS} from "../../../../../../constants/status";
import {NzModalService} from "ng-zorro-antd/modal";
import {CanCuXacDinhPag} from "../../../../../../models/DeXuatPhuongAnGia";
import {DialogTuChoiComponent} from "../../../../../../components/dialog/dialog-tu-choi/dialog-tu-choi.component";
import {HelperService} from "../../../../../../services/helper.service";


@Component({
  selector: 'app-them-hang-thuoc-dien-thanh-ly',
  templateUrl: './them-hang-thuoc-dien-thanh-ly.component.html',
  styleUrls: ['./them-hang-thuoc-dien-thanh-ly.component.scss'],
})
export class ThemHangThuocDienThanhLyComponent implements OnInit {
  @Input('isView') isView: boolean;
  @Input() idInput: number;
  formData: FormGroup;
  dataTable: any = [];
  rowItem: IHangThanhLy = new IHangThanhLy();

  dataEdit: { [key: string]: { edit: boolean; data: IHangThanhLy } } = {};
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 10;
  dsDonVi = [];
  dsDonViDataSource = [];
  dsDiemKho = [];
  dsDiemKhoDataSource = [];
  dsNhaKho = [];
  dsNhaKhoDataSource = [];
  dsNganKho = [];
  dsNganKhoDataSource = [];
  dsChungLoaiHangHoa = [];
  dsLoKho = [];
  listLoaiHangHoa = [];
  dsLoaiHangHoa = [];
  userInfo: UserLogin;

  STATUS = STATUS
  @Output('close') onClose = new EventEmitter<any>();

  constructor(
    private readonly fb: FormBuilder,
    private readonly donviService: DonviService,
    private readonly quanlyChatLuongService: QuanLyChatLuongLuuKhoService,
    private danhMucService: DanhMucService,
    private donViService: DonviService,
    private notification: NzNotificationService,
    private helperService: HelperService,
    private readonly spinner: NgxSpinnerService,
    public userService: UserService,
    public modal: NzModalService,
    public globals: Globals,
  ) {
    this.formData = this.fb.group({
      id: [null],
      tenDvi: [],
      maDonVi: [],
      maDanhSach: [null, Validators.required],
      ngayTao: [null, Validators.required],
      trangThaiChiCuc: ['00'],
      trangThaiCuc: ['00'],
      tenTrangThai: ['Dự thảo'],
      tenTrangThaiCuc: ['Dự thảo'],
      liDoTuChoi: [''],
    });
  }

  async ngOnInit(): Promise<void> {
    this.userInfo = this.userService.getUserLogin();
    await Promise.all([
      this.loaiVTHHGetAll(),
      this.loadDiemKho()
    ]);
    if (this.idInput > 0) {
      await this.getDetail(this.idInput)
    } else {
      this.initForm()
    }
  }

  async getDetail(id) {
    let res = await this.quanlyChatLuongService.getDetail(id)
    if (res.msg == MESSAGE.SUCCESS) {
      let detail = res.data
      this.formData.patchValue({
        id : detail.id,
        maDonVi : detail.maDonVi,
        tenDvi : detail.tenDvi,
        maDanhSach : detail.maDanhSach,
        trangThaiCuc : detail.trangThaiCuc,
        trangThaiChiCuc : detail.trangThaiChiCuc,
        tenTrangThai : detail.tenTrangThai,
        tenTrangThaiCuc : detail.tenTrangThaiCuc,
        liDoTuChoi : detail.liDoTuChoi,
        ngayTao : detail.ngayTao,
      });
      this.dataTable = detail.ds
      this.updateEditCache();
    }
  }



  async onChangeLoaiVthh(id: any, type?: any) {
    if (id && id > 0) {
      let loaiHangHoa = this.dsLoaiHangHoa.filter(item => item.ma === id);
      this.dsChungLoaiHangHoa = loaiHangHoa[0].child;
      if (!type) {
        this.rowItem.tenLoaiVthh = loaiHangHoa[0].ten
        this.rowItem.donViTinh = loaiHangHoa[0].maDviTinh
        this.rowItem.maChungLoaiHang = null;
      } else {
        type.tenLoaiVthh = loaiHangHoa[0].ten
        type.donViTinh = loaiHangHoa[0].maDviTinh
        type.maChungLoaiHang = null;
      }
    }
  }

  onChangeChungLoai(event: any, type?: any) {
    const cloaiVthh = this.dsChungLoaiHangHoa.filter(item => item.ma == event);
    if (cloaiVthh.length > 0) {
      if (type) {
        type.tenCloaiVthh = cloaiVthh[0].ten;
      } else {
        this.rowItem.tenCloaiVthh = cloaiVthh[0].ten;
      }
    }
  }

  async loaiVTHHGetAll() {
      await this.danhMucService.loadDanhMucHangHoa().subscribe((hangHoa) => {
        if (hangHoa.msg == MESSAGE.SUCCESS) {
          hangHoa.data.forEach((item) => {
            if (item.cap === "1" && item.ma != '01') {
              this.dsLoaiHangHoa = [...this.dsLoaiHangHoa, item];
            } else {
              this.dsLoaiHangHoa = [...this.dsLoaiHangHoa, ...item.child];
            }
          })
        }
      })
    }

  huy() {
    this.onClose.emit();
  }

  exportData() {
    this.spinner.show();
    try {
      this.quanlyChatLuongService
        .exportListDetail(this.idInput)
        .subscribe((blob) =>
          saveAs(blob, 'chi-tiet-danh-sach-hang-thanh-ly.xlsx'),
        );
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async luu(isGuiDuyet?) {
    this.spinner.show();
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      this.spinner.hide();
      return;
    }
    let body = this.formData.value;
    body.maDonVi = this.userInfo.MA_DVI
    body.ds = this.dataTable
    let res
    if (this.idInput > 0) {
      res = await this.quanlyChatLuongService.suads(body);
    } else {
      res = await this.quanlyChatLuongService.themds(body);
    }
    if (res.msg == MESSAGE.SUCCESS) {
      if (isGuiDuyet) {
        this.formData.patchValue({
          id: res.data.id,
          trangThaiChiCuc: res.data.trangThaiChiCuc
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
          let trangThai;
          switch (this.formData.value.trangThaiChiCuc) {
            case STATUS.DU_THAO : {
              trangThai = STATUS.CHO_DUYET_KTVBQ;
              break;
            }
            case STATUS.TU_CHOI_KTVBQ : {
              trangThai = STATUS.CHO_DUYET_KTVBQ;
              break;
            }
            case STATUS.CHO_DUYET_KTVBQ : {
              trangThai = STATUS.CHO_DUYET_KT;
              break;
            }
            case STATUS.CHO_DUYET_KT : {
              trangThai = STATUS.CHO_DUYET_LDCC;
              break;
            }
            case STATUS.TU_CHOI_KT : {
              trangThai = STATUS.CHO_DUYET_KT;
              break;
            }
            case STATUS.CHO_DUYET_KT : {
              trangThai = STATUS.CHO_DUYET_LDCC;
              break;
            }
            case STATUS.TU_CHOI_LDCC : {
              trangThai = STATUS.CHO_DUYET_LDCC;
              break;
            }
            case STATUS.CHO_DUYET_LDCC : {
              trangThai = STATUS.DA_DUYET_LDCC;
              break;
            }
          }
          let body = {
            id: this.formData.value.id,
            lyDo: null,
            trangThai: trangThai,
          };
          let res = await this.quanlyChatLuongService.pheDuyet(body);
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
          let trangThai;
          switch (this.formData.value.trangThaiChiCuc) {
            case STATUS.CHO_DUYET_KTVBQ : {
              trangThai = STATUS.TU_CHOI_KTVBQ;
              break;
            }
            case STATUS.CHO_DUYET_KT : {
              trangThai = STATUS.TU_CHOI_KT;
              break;
            }
            case STATUS.CHO_DUYET_LDCC : {
              trangThai = STATUS.TU_CHOI_LDCC;
              break;
            }
          }
          let body = {
            id: this.idInput,
            lyDoTuChoi: text,
            trangThai: trangThai
          };
          let res = await this.quanlyChatLuongService.pheDuyet(body);
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

  xoaItem(index: number) {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn xóa?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 400,
      nzOnOk: () => {
        this.dataTable.splice(index, 1);
        this.updateEditCache();
      },
    });
  }

  startEdit(idx: number) {
    this.onChangeLoaiVthh( this.dataEdit[idx].data.maLoaiHang)
    this.onChangeChungLoai( this.dataEdit[idx].data.maChungLoaiHang)
    this.onChangeDiemKho( this.dataEdit[idx].data.maDiemKho)
    this.onChangeNhaKho( this.dataEdit[idx].data.maNhaKho)
    this.onChangeNganKho( this.dataEdit[idx].data.maNganKho)
    this.onChangLoKho( this.dataEdit[idx].data.maLoKho)
    this.dataEdit[idx].edit = true;
  }

  cancelEdit(index: number) {
    this.dataEdit[index] = {
      data: {...this.dataTable[index]},
      edit: false,
    };
  }

  async themMoiItem() {
    if (!this.dataTable) {
      this.dataTable = [];
    }
    if (this.rowItem.slTon < this.rowItem.slYeuCau) {
      this.notification.error(MESSAGE.ERROR, "Số lượng yêu cầu không hợp lệ!");
      return;
    }
    this.dataTable = [...this.dataTable, this.rowItem];
    this.rowItem = new IHangThanhLy();
    this.updateEditCache();
  }

  updateEditCache(): void {
    if (this.dataTable) {
      this.dataTable.forEach((item, index) => {
        this.dataEdit[index] = {
          edit: false,
          data: {...item},
        };
        console.log(this.dataEdit[index].data)
      });
    }
  }

  luuEdit(idx: number): void {
    Object.assign(this.dataTable[idx], this.dataEdit[idx].data);
    this.dataEdit[idx].edit = false;
  }

  resetRowItem() {
    Object.keys(this.rowItem).map(key => {
      this.rowItem[key] = null
    })
  }

  clearData() {
  }

  changePageIndex(event) {
  }

  changePageSize(event) {
  }

  editItem(id: number): void {
    var idx = id > 0 ? id - 1 : id;
    this.dataEdit[idx].edit = true;
  }

  huyEdit(index: number): void {
    this.dataEdit[index] = {
      data: {...this.dataTable[index]},
      edit: false,
    };
  }

  async loadDiemKho() {
    const body = {
      maDviCha: this.userInfo.MA_DVI,
      trangThai: '01',
    };

    const dsTong = await this.donViService.layDonViTheoCapDo(body);
    let res = dsTong[DANH_MUC_LEVEL.DIEM_KHO];
    this.dsDiemKho = res.filter(item => item.type == "MLK")
  }

  async onChangeDiemKho(event, type?: any) {
    const body = {
      maDviCha: event,
      trangThai: '01',
    };
    const dsTong = await this.donViService.layDonViTheoCapDo(body);
    this.dsNhaKho = dsTong[DANH_MUC_LEVEL.NHA_KHO];
    const diemKho = this.dsDiemKho.find(item => item.maDvi == event);
    if (diemKho) {
      if (type) {
        type.tenDiemKho = diemKho.tenDvi;
        type.maNhaKho = null;
        type.maNganKho = null;
        type.maLoKho = null;
      } else {
        this.rowItem.tenDiemKho = diemKho.tenDvi;
        this.rowItem.maNhaKho = null;
        this.rowItem.maNganKho = null;
        this.rowItem.maLoKho = null;
      }
    }
  }

  async onChangeNhaKho(event, type?: any) {
    const body = {
      maDviCha: event,
      trangThai: '01',
    };

    const dsTong = await this.donViService.layDonViTheoCapDo(body);
    this.dsNganKho = dsTong[DANH_MUC_LEVEL.NGAN_KHO];
    const nganLo = this.dsNhaKho.filter(item => item.maDvi == event);
    if (nganLo.length > 0) {
      if (type) {
        type.tenNhaKho = nganLo[0].tenDvi;
        type.maNganKho = null;
        type.maLoKho = null;
      } else {
        this.rowItem.tenNhaKho = nganLo[0].tenDvi;
        this.rowItem.maNganKho = null;
        this.rowItem.maLoKho = null;
      }

    }
  }

  async onChangeNganKho(event, type?: any) {
    const body = {
      maDviCha: event,
      trangThai: '01',
    };
    const dsTong = await this.donViService.layDonViTheoCapDo(body);
    this.dsLoKho = dsTong[DANH_MUC_LEVEL.LO_KHO];
    const nganLo = this.dsNganKho.filter(item => item.maDvi == event);
    if (nganLo.length > 0) {
      if (type) {
        type.tenNganKho = nganLo[0].tenDvi;
        type.maLoKho = null
      } else {
        this.rowItem.tenNganKho = nganLo[0].tenDvi;
        this.rowItem.maLoKho = null
      }

    }
  }

  async onChangLoKho(evevt, type?: any) {
    const nganLo = this.dsLoKho.filter(item => item.maDvi == evevt);
    if (nganLo.length > 0) {
      if (type) {
        type.tenLoKho = nganLo[0].tenDvi;
      } else {
        this.rowItem.tenLoKho = nganLo[0].tenDvi;
      }

    }
  }

  initForm() {
    console.log(this.userInfo)
    this.formData.patchValue({
      tenDvi: this.userInfo.TEN_DVI,
      maDonVi: this.userInfo.MA_DVI,
    })
  }
}

interface IDanhSachHangThanhLy {
  id: number;
  maDanhSach: string;
  idDonVi: number;
  tenDonVi: string;
  ngayTao: Date;
  trangThai: string;
  danhSachHang: IHangThanhLy[];
}

export class IHangThanhLy {
  donViTinh: string;
  maLoaiHang: string;
  tenLoaiVthh: string;
  maChungLoaiHang: string;
  tenCloaiVthh: string;
  maDiemKho: string;
  tenDiemKho: string;
  maNhaKho: string;
  tenNhaKho: string;
  maNganKho: string;
  tenNganKho: string;
  maLoKho: string;
  tenLoKho: string;
  dsHangThanhLyId: number;
  slTon: string;
  slYeuCau: string;
  lyDo: string;
}
