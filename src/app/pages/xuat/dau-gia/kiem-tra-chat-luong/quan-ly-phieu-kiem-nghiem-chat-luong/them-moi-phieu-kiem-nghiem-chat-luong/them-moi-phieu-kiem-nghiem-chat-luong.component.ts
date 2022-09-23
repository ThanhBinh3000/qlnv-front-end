import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { cloneDeep } from 'lodash';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogThemBienbanNghiemThuKeLotComponent } from 'src/app/components/dialog/dialog-them-bien-ban-nghiem-thu-ke-lot/dialog-them-bien-ban-nghiem-thu-ke-lot.component';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { UserLogin } from 'src/app/models/userlogin';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { DonviService } from 'src/app/services/donvi.service';
import { QuanLyPhieuKiemTraChatLuongHangService } from 'src/app/services/quanLyPhieuKiemTraChatLuongHang.service';
import { QuyetDinhGiaoNhapHangService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/qd-giaonv-nh/quyetDinhGiaoNhapHang.service';
import { ThongTinHopDongService } from 'src/app/services/thongTinHopDong.service';
import { TinhTrangKhoHienThoiService } from 'src/app/services/tinhTrangKhoHienThoi.service';
import { UserService } from 'src/app/services/user.service';
import { thongTinTrangThaiNhap } from 'src/app/shared/commonFunction';
import { Globals } from 'src/app/shared/globals';
import { DANH_MUC_LEVEL } from 'src/app/pages/luu-kho/luu-kho.constant';
import { isEmpty } from 'lodash';
import { QuanLyBienBanLayMauXuatService } from 'src/app/services/qlnv-hang/xuat-hang/kiem-tra-chat-luong/quanLyBienBanLayMauXuat';
import { QuanLyBienBanLayMauService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/kiemtra-cl/quanLyBienBanLayMau.service';
@Component({
  selector: 'app-them-moi-phieu-kiem-nghiem-chat-luong',
  templateUrl: './them-moi-phieu-kiem-nghiem-chat-luong.component.html',
  styleUrls: ['./them-moi-phieu-kiem-nghiem-chat-luong.component.scss'],
})
export class ThemMoiPhieuKiemNghiemChatLuongComponent implements OnInit {
  @Input() id: number;
  @Input() isView: boolean;
  @Input() isTatCa: boolean;
  @Input() typeVthh: string;
  @Output()
  showListEvent = new EventEmitter<any>();

  userInfo: UserLogin;
  detail: any = {};

  formData: FormGroup;
  donVi: any;

  detailGiaoNhap: any = {};
  detailHopDong: any = {};

  create: any = {};
  editDataCache: { [key: string]: { edit: boolean; data: any } } = {};

  listBienBanLayMau: any[] = [];
  listDiemKho: any[] = [];
  listNhaKho: any[] = [];
  listNganKho: any[] = [];
  listLoKho: any[] = [];
  listHangHoa: any[] = [];
  listChungLoaiHangHoa: any[] = [];
  listTieuChuan: any[] = [];

  listTong: any;
  constructor(
    private spinner: NgxSpinnerService,
    private tinhTrangKhoHienThoiService: TinhTrangKhoHienThoiService,
    private quanLyPhieuKiemTraChatLuongHangService: QuanLyPhieuKiemTraChatLuongHangService,
    private notification: NzNotificationService,
    private modal: NzModalService,
    public userService: UserService,
    private fb: FormBuilder,
    public globals: Globals,
    private quyetDinhGiaoNhapHangService: QuyetDinhGiaoNhapHangService,
    private danhMucService: DanhMucService,
    private thongTinHopDongService: ThongTinHopDongService,
    private donViService: DonviService,
    private quanLyBienBanLayMauXuatService: QuanLyBienBanLayMauXuatService,
    private quanLyBienBanLayMauService: QuanLyBienBanLayMauService,

  ) { }

  async ngOnInit() {
    this.spinner.show();
    try {

      this.initForm()
      await this.initData()
      await Promise.all([
        this.loadTieuChuan(),
        this.loaiVTHHGetAll(),
        this.loadBienbanLayMau(),
      ]);
      if (this.id > 0) {
        await this.loadChiTiet(this.id);
      }
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  initForm() {
    this.formData = this.fb.group({
      soBienBanLayMau: [null],
      maDonVi: [null],
      maQHNS: [null],
      soPhieu: [null],
      maDiemKho: [null, [Validators.required]],
      maNhaKho: [null, [Validators.required]],
      maNganKho: [null, [Validators.required]],
      maLoKho: [null, [Validators.required]],
      loaiHang: [null, [Validators.required]],
      chungLoaiHang: [null, [Validators.required]],
      slHangBaoQuan: [null],
      hinhThucBaoQuan: [null],
      thuKho: [null],
      ngayThangNhapMau: [null],
      ngayLayMau: [null],
      ngayKiemNghiem: [null],
    })

  }

  async initData() {
    this.userInfo = this.userService.getUserLogin();
    this.detail.maDvi = this.userInfo.MA_DVI;
    this.detail.tenDvi = this.userInfo.TEN_DVI;
    this.detail.capDvi = this.userInfo.CAP_DVI;
    // this.detail.tenTrangThai = "Dự Thảo";
    // this.detail.trangThai = "00";
    await this.loadDonVi();
  }
  async loadDonVi() {
    const body = {
      maDviCha: this.detail.maDvi,
      trangThai: '01',
    };
    const dsTong = await this.donViService.layDonViTheoCapDo(body);
    if (!isEmpty(dsTong)) {
      this.listTong = dsTong;
      this.donVi = dsTong[DANH_MUC_LEVEL.CHI_CUC];
      if (!isEmpty(this.donVi)) {
        this.formData.get('maDonVi').setValue(this.donVi[0].tenDvi);
        this.formData.controls['maDonVi'].disable();
        this.formData.get('maQHNS').setValue(this.donVi[0].maQhns);
        this.formData.controls['maQHNS'].disable();
        const chiCuc = this.donVi[0];
        if (chiCuc) {
          const result = {
            ...this.donViService.layDsPhanTuCon(this.listTong, chiCuc),
          };
          this.listDiemKho = result[DANH_MUC_LEVEL.DIEM_KHO];
        } else {
          this.listDiemKho = [];
        }
      }
    }
  }
  onChangeDiemKho(id) {
    const dsDiemKho = this.listDiemKho.find((item) => item.maDvi === id);
    this.formData.get('maNhaKho').setValue(null);
    this.formData.get('maNganKho').setValue(null);
    this.formData.get('maLoKho').setValue(null);
    if (dsDiemKho) {
      const result = {
        ...this.donViService.layDsPhanTuCon(this.listTong, dsDiemKho),
      };
      this.listNhaKho = result[DANH_MUC_LEVEL.NHA_KHO];
    } else {
      this.listNhaKho = [];
    }
  }
  onChangeNhaKho(id) {
    const nhaKho = this.listNhaKho.find((item) => item.maDvi === id);
    this.formData.get('maNganKho').setValue(null);
    this.formData.get('maLoKho').setValue(null);
    if (nhaKho) {
      const result = {
        ...this.donViService.layDsPhanTuCon(this.listTong, nhaKho),
      };
      this.listNganKho = result[DANH_MUC_LEVEL.NGAN_KHO];
    } else {
      this.listNganKho = [];
    }
  }
  onChangeNganKho(id) {
    const nganKho = this.listNganKho.find((item) => item.maDvi === id);
    this.formData.get('maLoKho').setValue(null);
    if (nganKho) {
      const result = {
        ...this.donViService.layDsPhanTuCon(this.listTong, nganKho),
      };
      this.listLoKho = result[DANH_MUC_LEVEL.NGAN_LO];
    } else {
      this.listLoKho = [];
    }
  }
  async loaiVTHHGetAll() {
    try {
      await this.danhMucService.loadDanhMucHangHoa().subscribe((hangHoa) => {
        if (hangHoa.msg == MESSAGE.SUCCESS) {
          hangHoa.data.forEach((item) => {
            if (item.cap === '1' && item.ma != '01') {
              this.listHangHoa = [...this.listHangHoa, item];
            } else {
              this.listHangHoa = [...this.listHangHoa, ...item.child];
            }
          });
        }
      });
    } catch (error) {
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }
  async changeLoaiHangHoa(id: any) {
    if (id && id > 0) {
      let loaiHangHoa = this.listHangHoa.filter((item) => item.ma === id);
      this.listChungLoaiHangHoa = loaiHangHoa[0].child;
    }
  }
  async loadBienbanLayMau() {
    let param = {
      "capDvis": '3',
      "maDvi": this.userInfo.MA_DVI,
      "maVatTuCha": "",
      "pageNumber": 1,
      "pageSize": 1000,
      "trangThai": "",
    }
    // let res = await this.quanLyBienBanLayMauXuatService.search(param);
    let res = await this.quanLyBienBanLayMauService.timKiem(param);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.listBienBanLayMau = data.content;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }
  async loadTieuChuan() {
    let body = {
      "maHang": this.typeVthh,
      "namQchuan": null,
      "paggingReq": {
        "limit": 1000,
        "page": 1
      },
      "str": null,
      "tenQchuan": null,
      "trangThai": "01"
    }
    let res = await this.danhMucService.traCuuTieuChuanKyThuat(body);
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data && res.data.content.length > 0) {
        if (res.data.content[0].children && res.data.content[0].children.length > 0) {
          this.listTieuChuan = res.data.content[0].children;
        }
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }
  changeChiTieu(item) {
    if (item) {
      let getChiTieu = this.listTieuChuan.filter(x => x.tenTchuan == item.tenChiTieu);
      if (getChiTieu && getChiTieu.length > 0) {
        item.tieuChuan = getChiTieu[0].chiSoNhap;
        item.phuongPhapXacDinh = getChiTieu[0].phuongPhap;
      }
    }
  }
  async loadChiTiet(id: number) {
    if (id > 0) {
      let res = await this.quanLyPhieuKiemTraChatLuongHangService.chiTiet(id);

      console.log(res);
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          this.detail = res.data;
          console.log(this.detail);

        }
      }
    }
    // this.updateEditCache();
  }
  async save(isOther: boolean) {
    this.spinner.show();
    try {
      let body = {
        "bienSoXe": this.detail.bienSoXe,
        "diaChi": null,
        "fileDinhKemId": null,
        "hopDongId": this.detail.hopDongId,
        "id": this.id,
        "ketLuan": this.detail.ketLuan,
        "kqDanhGia": this.detail.kqDanhGia,
        "ketQuaKiemTra": this.detail.ketQuaKiemTra,
        "khoiLuong": this.detail.khoiLuong,
        "khoiLuongDeNghiKt": this.detail.khoiLuongDeNghiKt,
        "lyDoTuChoi": null,
        "diemKhoId": 1,
        "maDvi": this.detail.maDvi,
        "maHangHoa": this.typeVthh,
        "maDiemKho": this.detail.maDiemKho,
        "maNganLo": this.detail.maNganLo,
        "maNhaKho": this.detail.maNhaKho,
        "maNganKho": this.detail.maNganKho,
        "maVatTu": this.detail.maVatTu,
        "maVatTuCha": this.detail.maVatTuCha,
        "maQhns": this.detail.maDvi,
        "ngayGdinh": this.detail.ngayGdinh,
        "ngayKiemTra": null,
        "ngayPheDuyet": null,
        "nguoiGiaoHang": this.detail.nguoiGiaoHang,
        "nguoiPheDuyet": null,
        "quyetDinhNhapId": this.detail.quyetDinhNhapId,
        "soChungThuGiamDinh": this.detail.soChungThuGiamDinh,
        "soPhieu": this.detail.soPhieu,
        "soPhieuAnToanThucPham": null,
        "tchucGdinh": this.detail.tchucGdinh,
        "tenHangHoa": null,
        "tenNganKho": null,
        "trangThai": this.detail.trangThai,
      };
      if (this.id > 0) {
        let res = await this.quanLyPhieuKiemTraChatLuongHangService.sua(
          body,
        );
        if (res.msg == MESSAGE.SUCCESS) {
          if (!isOther) {
            this.notification.success(
              MESSAGE.SUCCESS,
              MESSAGE.UPDATE_SUCCESS,
            );
            this.back();
          }
        } else {
          this.notification.error(MESSAGE.ERROR, res.msg);
        }
      } else {
        let res = await this.quanLyPhieuKiemTraChatLuongHangService.them(
          body,
        );
        if (res.msg == MESSAGE.SUCCESS) {
          if (!isOther) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
            this.back();
          }
        } else {
          this.notification.error(MESSAGE.ERROR, res.msg);
        }
      }
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  guiDuyet() {
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
          await this.save(true);
          let body = {
            id: this.id,
            lyDoTuChoi: null,
            trangThai: this.globals.prop.NHAP_CHO_DUYET_LD_CHI_CUC,
          };
          let res =
            await this.quanLyPhieuKiemTraChatLuongHangService.updateStatus(
              body,
            );
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
            this.back();
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
            id: this.id,
            lyDoTuChoi: null,
            trangThai: this.globals.prop.NHAP_DA_DUYET_LD_CHI_CUC,
          };
          let res =
            await this.quanLyPhieuKiemTraChatLuongHangService.updateStatus(
              body,
            );
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
            this.back();
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
            id: this.id,
            lyDoTuChoi: text,
            trangThai: this.globals.prop.NHAP_TU_CHOI_LD_CHI_CUC,
          };
          let res =
            await this.quanLyPhieuKiemTraChatLuongHangService.updateStatus(
              body,
            );
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
            this.back();
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

  back() {
    this.showListEvent.emit();
  }

  themBienBanNgiemThuKeLot() {
    const modalLuongThuc = this.modal.create({
      nzTitle: 'Thêm mới thông tin chi tiết',
      nzContent: DialogThemBienbanNghiemThuKeLotComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {},
    });
    modalLuongThuc.afterClose.subscribe((res) => {
      if (res) {
      }
    });
  }

  cancelEdit(stt: number): void {
    const index = this.detail?.ketQuaKiemTra.findIndex(item => item.stt === stt);
    this.editDataCache[stt] = {
      data: { ...this.detail?.ketQuaKiemTra[index] },
      edit: false
    };
  }

  saveEdit(stt: number): void {
    const index = this.detail?.ketQuaKiemTra.findIndex(item => item.stt === stt);
    Object.assign(this.detail?.ketQuaKiemTra[index], this.editDataCache[stt].data);
    this.editDataCache[stt].edit = false;
  }

  deleteRow(data: any) {
    this.detail.ketQuaKiemTra = this.detail?.ketQuaKiemTra.filter(x => x.stt != data.stt);
    this.sortTableId();
    this.updateEditCache();
  }

  editRow(stt: number) {
    this.editDataCache[stt].edit = true;
  }

  addRow() {
    if (!this.detail?.ketQuaKiemTra) {
      this.detail.ketQuaKiemTra = [];
    }
    this.sortTableId();
    let item = cloneDeep(this.create);
    item.stt = this.detail?.ketQuaKiemTra.length + 1;
    this.detail.ketQuaKiemTra = [
      ...this.detail?.ketQuaKiemTra,
      item,
    ]
    this.updateEditCache();
    this.clearItemRow();
  }

  clearItemRow() {
    this.create = {};
  }

  updateEditCache(): void {
    if (this.detail?.ketQuaKiemTra && this.detail?.ketQuaKiemTra.length > 0) {
      this.detail?.ketQuaKiemTra.forEach((item) => {
        this.editDataCache[item.stt] = {
          edit: false,
          data: { ...item },
        };
      });
    }
  }

  sortTableId() {
    this.detail?.ketQuaKiemTra.forEach((lt, i) => {
      lt.stt = i + 1;
    });
  }

  thongTinTrangThai(trangThai: string): string {
    return thongTinTrangThaiNhap(trangThai);
  }
  isDisableField() {
    if (this.detail && (this.detail.trangThai == this.globals.prop.NHAP_CHO_DUYET_TP || this.detail.trangThai == this.globals.prop.NHAP_CHO_DUYET_LD_CHI_CUC || this.detail.trangThai == this.globals.prop.NHAP_DA_DUYET_LD_CHI_CUC)) {
      return true;
    }
  }
}
