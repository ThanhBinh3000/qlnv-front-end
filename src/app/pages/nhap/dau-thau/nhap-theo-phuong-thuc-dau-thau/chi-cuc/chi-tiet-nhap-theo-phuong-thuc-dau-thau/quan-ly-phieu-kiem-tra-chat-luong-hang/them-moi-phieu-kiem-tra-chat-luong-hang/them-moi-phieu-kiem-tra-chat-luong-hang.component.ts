import { cloneDeep } from 'lodash';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { DialogThemBienbanNghiemThuKeLotComponent } from 'src/app/components/dialog/dialog-them-bien-ban-nghiem-thu-ke-lot/dialog-them-bien-ban-nghiem-thu-ke-lot.component';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { UserLogin } from 'src/app/models/userlogin';
import { DanhSachDauThauService } from 'src/app/services/danhSachDauThau.service';
import { DonviService } from 'src/app/services/donvi.service';
import { QuanLyPhieuKiemTraChatLuongHangService } from 'src/app/services/quanLyPhieuKiemTraChatLuongHang.service';
import { TinhTrangKhoHienThoiService } from 'src/app/services/tinhTrangKhoHienThoi.service';
import { UserService } from 'src/app/services/user.service';
import * as dayjs from 'dayjs';
import { Globals } from 'src/app/shared/globals';

@Component({
  selector: 'them-moi-phieu-kiem-tra-chat-luong-hang',
  templateUrl: './them-moi-phieu-kiem-tra-chat-luong-hang.component.html',
  styleUrls: ['./them-moi-phieu-kiem-tra-chat-luong-hang.component.scss'],
})
export class ThemMoiPhieuKiemTraChatLuongHangComponent implements OnInit {
  userInfo: UserLogin;
  detail: any = {};
  id: number = 0;

  loaiVthh: string;
  loaiStr: string;
  maVthh: string;
  routerVthh: string;

  create: any = {};
  editDataCache: { [key: string]: { edit: boolean; data: any } } = {};

  listDiemKho: any[] = [];
  listNganKho: any[] = [];
  listNganLo: any[] = [];

  constructor(
    private spinner: NgxSpinnerService,
    private tinhTrangKhoHienThoiService: TinhTrangKhoHienThoiService,
    private quanLyPhieuKiemTraChatLuongHangService: QuanLyPhieuKiemTraChatLuongHangService,
    private notification: NzNotificationService,
    private router: Router,
    private modal: NzModalService,
    private userService: UserService,
    private routerActive: ActivatedRoute,
    public globals: Globals,
  ) { }

  async ngOnInit() {
    this.spinner.show();
    try {
      this.getTitleVthh();
      this.getIdNhap();
      this.id = +this.routerActive.snapshot.paramMap.get('id');
      this.userInfo = this.userService.getUserLogin();
      this.detail.maDvi = this.userInfo.MA_DVI;
      await Promise.all([
        this.loadDiemKho(),
        this.loadNganKho(),
        this.loadNganLo(),
      ]);
      await this.loadChiTiet(this.id);
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async loadDiemKho() {
    let res = await this.tinhTrangKhoHienThoiService.getAllDiemKho();
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data) {
        this.listDiemKho = res.data;
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async loadNganKho() {
    let body = {
      "maNganKho": null,
      "nhaKhoId": null,
      "paggingReq": {
        "limit": 1000,
        "page": 1
      },
      "str": null,
      "tenNganKho": null,
      "trangThai": null
    };
    let res = await this.tinhTrangKhoHienThoiService.nganKhoGetList(body);
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data && res.data.content) {
        this.listNganKho = res.data.content;
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async loadNganLo() {
    let body = {
      "maNganLo": null,
      "nganKhoId": null,
      "paggingReq": {
        "limit": 1000,
        "page": 1
      },
      "str": null,
      "tenNganLo": null,
      "trangThai": null
    };
    let res = await this.tinhTrangKhoHienThoiService.nganLoGetList(body);
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data && res.data.content) {
        this.listNganLo = res.data.content;
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async loadChiTiet(id: number) {
    if (id > 0) {
      this.updateEditCache();
    }
  }

  getIdNhap() {
    if (this.router.url && this.router.url != null) {
      let index = this.router.url.indexOf("/chi-tiet/");
      if (index != -1) {
        let url = this.router.url.substring(index + 10);
        let temp = url.split("/");
        if (temp && temp.length > 0) {
          this.detail.quyetDinhNhapId = +temp[0];
        }
      }
    }
  }

  getTitleVthh() {
    if (this.router.url.indexOf("/thoc/")) {
      this.loaiStr = "Thóc";
      this.loaiVthh = "01";
      this.maVthh = "0101";
      this.routerVthh = 'thoc';
    } else if (this.router.url.indexOf("/gao/")) {
      this.loaiStr = "Gạo";
      this.loaiVthh = "00";
      this.maVthh = "0102";
      this.routerVthh = 'gao';
    } else if (this.router.url.indexOf("/muoi/")) {
      this.loaiStr = "Muối";
      this.loaiVthh = "02";
      this.maVthh = "04";
      this.routerVthh = 'muoi';
    } else if (this.router.url.indexOf("/vat-tu/")) {
      this.loaiStr = "Vật tư";
      this.loaiVthh = "03";
      this.routerVthh = 'vat-tu';
    }
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
        "ketQuaKiemTra": this.detail.ketQuaKiemTra,
        "khoiLuong": this.detail.khoiLuong,
        "lyDoTuChoi": null,
        "maDiemKho": this.detail.maDiemKho,
        "maDonVi": this.detail.maDvi,
        "maHangHoa": this.maVthh,
        "maNganKho": this.detail.maNganKho,
        "maNhaKho": this.detail.maNhaKho,
        "maQhns": this.detail.maDvi,
        "ngayGdinh": this.detail.ngayGdinh,
        "ngayKiemTra": null,
        "ngayPheDuyet": null,
        "nguoiGiaoHang": this.detail.nguoiGiaoHang,
        "nguoiPheDuyet": null,
        "quyetDinhNhapId": null,
        "soChungThuGiamDinh": this.detail.soChungThuGiamDinh,
        "soPhieu": this.detail.soPhieu,
        "soPhieuAnToanThucPham": null,
        "tchucGdinh": this.detail.tchucGdinh,
        "tenHangHoa": this.loaiStr,
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
            trangThai: '01',
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
            trangThai: '02',
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
            trangThai: '03',
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
    if (this.router.url && this.router.url != null) {
      let index = this.router.url.indexOf("/thong-tin/");
      if (index != -1) {
        let url = this.router.url.substring(0, index);
        this.router.navigate([url]);
      }
    }
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
}
