import { cloneDeep } from 'lodash';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
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
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { DanhSachDauThauService } from 'src/app/services/danhSachDauThau.service';
import { DonviService } from 'src/app/services/donvi.service';
import { TinhTrangKhoHienThoiService } from 'src/app/services/tinhTrangKhoHienThoi.service';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';
import VNnum2words from 'vn-num2words';
import { convertTienTobangChu, thongTinTrangThaiNhap } from 'src/app/shared/commonFunction';
import { QuanLyNghiemThuKeLotService } from 'src/app/services/quanLyNghiemThuKeLot.service';
import * as dayjs from 'dayjs';
import { QuyetDinhGiaoNhapHangService } from 'src/app/services/quyetDinhGiaoNhapHang.service';
import { ThongTinHopDongService } from 'src/app/services/thongTinHopDong.service';
import { STATUS } from "../../../../../../constants/status";

@Component({
  selector: 'app-thong-tin-bien-ban-nghiem-thu-bao-quan',
  templateUrl: './thong-tin-bien-ban-nghiem-thu-bao-quan.component.html',
  styleUrls: ['./thong-tin-bien-ban-nghiem-thu-bao-quan.component.scss']
})
export class ThongTinBienBanNghiemThuBaoQuanComponent implements OnInit {
  @Input() id: number;
  @Input() isView: boolean;
  @Input() typeVthh: string;
  @Output()
  showListEvent = new EventEmitter<any>();

  @ViewChild('endDatePicker') endDatePicker!: NzDatePickerComponent;
  isVisibleChangeTab$ = new Subject();
  visibleTab: boolean = false;

  userInfo: UserLogin;
  detail: any = {};
  detailGiaoNhap: any = {};
  detailHopDong: any = {};

  listDiemKho: any[] = [];
  listNhaKho: any[] = [];
  listNganKho: any[] = [];
  listNganLo: any[] = [];
  listThuKho: any[] = [];
  listLoaiKho: any[] = [];
  listPTBaoQuan: any[] = [];
  listHinhThucBaoQuan: any[] = [];
  listDonViTinh: any[] = [];
  listSoQuyetDinh: any[] = [];
  listHopDong: any[] = [];

  create: any = {};
  editDataCache: { [key: string]: { edit: boolean; data: any } } = {};

  constructor(
    private spinner: NgxSpinnerService,
    private donViService: DonviService,
    private danhMucService: DanhMucService,
    private notification: NzNotificationService,
    private router: Router,
    private routerActive: ActivatedRoute,
    private modal: NzModalService,
    private userService: UserService,
    private tinhTrangKhoHienThoiService: TinhTrangKhoHienThoiService,
    private quanLyNghiemThuKeLotService: QuanLyNghiemThuKeLotService,
    private quyetDinhGiaoNhapHangService: QuyetDinhGiaoNhapHangService,
    private thongTinHopDongService: ThongTinHopDongService,
    public globals: Globals,
  ) { }

  async ngOnInit() {
    this.spinner.show();
    try {
      this.create.dvt = "Tấn";
      this.userInfo = this.userService.getUserLogin();
      this.detail.maDvi = this.userInfo.MA_DVI;
      this.detail.trangThai = this.globals.prop.NHAP_DU_THAO;
      this.detail.tenTrangThai = 'Dự thảo';
      await Promise.all([
        this.loadDiemKho(),
        this.loadThuKho(),
        this.loadLoaiKho(),
        this.loadPTBaoQuan(),
        this.loadDonViTinh(),
        this.loadSoQuyetDinh(),
        this.loadHinhThucBaoQuan(),
      ]);
      await this.loadChiTiet(this.id);
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  isDisableField() {
    if (this.detail && (this.detail.trangThai == this.globals.prop.NHAP_CHO_DUYET_THU_KHO || this.detail.trangThai == this.globals.prop.NHAP_CHO_DUYET_KE_TOAN
      || this.detail.trangThai == this.globals.prop.NHAP_CHO_DUYET_LD_CHI_CUC || this.detail.trangThai == this.globals.prop.NHAP_DA_DUYET_LD_CHI_CUC)) {
      return true;
    }
  }

  async changeSoQuyetDinh(autoChange: boolean) {
    let quyetDinh = this.listSoQuyetDinh.filter(x => x.id == this.detail.qdgnvnxId);
    if (quyetDinh && quyetDinh.length > 0) {
      this.detailGiaoNhap = quyetDinh[0];
      this.listHopDong = [];
      this.detailGiaoNhap.children1.forEach(element => {
        if (element && element.hopDong) {
          if (this.typeVthh) {
            if (element.hopDong.loaiVthh.startsWith(this.typeVthh)) {
              this.listHopDong.push(element);
            }
          }
          else {
            if (!element.hopDong.loaiVthh.startsWith('02')) {
              this.listHopDong.push(element);
            }
          }
        }
      });
      if (!autoChange) {
        this.detail.soHopDong = null;
        this.detail.hopDongId = null;
        this.detail.ngayHopDong = null;
        this.detail.maHangHoa = null;
        this.detail.khoiLuongKiemTra = null;
        this.detail.maHangHoa = null;
        this.detail.tenVatTuCha = null;
        this.detail.tenVatTu = null;
        this.detail.maVatTuCha = null;
        this.detail.maVatTu = null;
      } else {
        await this.changeHopDong();
      }
    }
  }

  async changeHopDong() {
    if (this.detail.soHopDong) {
      let body = {
        "str": this.detail.soHopDong
      }
      let res = await this.thongTinHopDongService.loadChiTietSoHopDong(body);
      if (res.msg == MESSAGE.SUCCESS) {
        this.detailHopDong = res.data;
        this.detail.hopDongId = this.detailHopDong.id;
        this.detail.tenVatTuCha = this.detailHopDong.tenVthh;
        this.detail.tenVatTu = this.detailHopDong.tenCloaiVthh;
        this.detail.maVatTuCha = this.detailHopDong.loaiVthh;
        this.detail.maVatTu = this.detailHopDong.cloaiVthh;
      }
      else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }
  }

  async loadSoQuyetDinh() {
    let body = {
      "denNgayQd": null,
      "loaiQd": "",
      "maDvi": this.userInfo.MA_DVI,
      "maVthh": this.typeVthh,
      "namNhap": null,
      "ngayQd": "",
      "orderBy": "",
      "orderDirection": "",
      "paggingReq": {
        "limit": 1000,
        "orderBy": "",
        "orderType": "",
        "page": 0
      },
      "soHd": "",
      "soQd": null,
      "str": "",
      "trangThai": this.globals.prop.NHAP_BAN_HANH,
      "tuNgayQd": null,
      "veViec": null
    }
    let res = await this.quyetDinhGiaoNhapHangService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.listSoQuyetDinh = data.content;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async loadChiTiet(id) {
    if (id > 0) {
      let res = await this.quanLyNghiemThuKeLotService.loadChiTiet(id);
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          this.detail = res.data;
          if (this.detail.children) {
            this.detail.detail = this.detail.children;
          }
          await this.changeSoQuyetDinh(true);
          await this.changeDiemKho(true);
        }
      }
    }
    this.updateEditCache();
  }

  caculatorThanhTienTN() {
    if (this.detail && this.detail?.detail && this.detail?.detail.length > 0) {
      let sum = this.detail?.detail.map(item => item.thanhTienTn).reduce((prev, next) => prev + next);
      return sum ?? 0;
    }
    return 0;
  }

  changeNganLo() {
    let nganLo = this.listNganLo.filter(x => x.maNganlo == this.detail.maNganlo);
    if (nganLo && nganLo.length > 0) {
      this.detail.tichLuong = nganLo[0].tichLuongChua ?? 0;
    }
  }

  caculatorThanhTienQT() {
    if (this.detail && this.detail?.detail && this.detail?.detail.length > 0) {
      let sum = this.detail?.detail.map(item => item.thanhTienQt).reduce((prev, next) => prev + next);
      return sum ?? 0;
    }
    return 0;
  }

  convertTien(tien: number): string {
    return convertTienTobangChu(tien);
  }

  deleteRow(data: any) {
    this.detail.detail = this.detail?.detail.filter(x => x.stt != data.stt);
    this.sortTableId();
    this.updateEditCache();
  }

  editRow(stt: number) {
    this.editDataCache[stt].edit = true;
  }

  sortTableId() {
    this.detail?.detail.forEach((lt, i) => {
      lt.stt = i + 1;
    });
  }

  addRow() {
    if (!this.detail?.detail) {
      this.detail.detail = [];
    }
    this.sortTableId();
    let item = cloneDeep(this.create);
    item.stt = this.detail?.detail.length + 1;
    this.detail.detail = [
      ...this.detail?.detail,
      item,
    ]
    this.updateEditCache();
    this.clearItemRow();
  }

  clearItemRow() {
    this.create = {};
    this.create.dvt = "Tấn";
  }

  cancelEdit(stt: number): void {
    const index = this.detail?.detail.findIndex(item => item.stt === stt);
    this.editDataCache[stt] = {
      data: { ...this.detail?.detail[index] },
      edit: false
    };
  }

  saveEdit(stt: number): void {
    const index = this.detail?.detail.findIndex(item => item.stt === stt);
    Object.assign(this.detail?.detail[index], this.editDataCache[stt].data);
    this.editDataCache[stt].edit = false;
  }

  updateEditCache(): void {
    if (this.detail?.detail && this.detail?.detail.length > 0) {
      this.detail?.detail.forEach((item) => {
        this.editDataCache[item.stt] = {
          edit: false,
          data: { ...item },
        };
      });
    }
  }

  caculatorSoLuong(item: any) {
    if (item) {
      item.thanhTienTn = (item?.soLuongTn ?? 0) * (item?.donGiaTn ?? 0);
      item.tongGtri = (item?.thanhTienTn ?? 0) + (item?.thanhTienQt ?? 0);
    }
  }

  async loadPTBaoQuan() {
    let body = {
      "maPthuc": null,
      "paggingReq": {
        "limit": 1000,
        "page": 1
      },
      "str": null,
      "tenPthuc": null,
      "trangThai": null
    };
    let res = await this.danhMucService.danhMucPhuongThucBaoQuanGetList(body);
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data && res.data.content) {
        this.listPTBaoQuan = res.data.content;
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async loadHinhThucBaoQuan() {
    let body = {
      "maHthuc": null,
      "paggingReq": {
        "limit": 1000,
        "page": 1
      },
      "str": null,
      "tenHthuc": null,
      "trangThai": null
    }
    let res = await this.danhMucService.loadDanhMucHinhThucBaoQuan(body);
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data && res.data.content) {
        this.listHinhThucBaoQuan = res.data.content;
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async loadLoaiKho() {
    let body = {
      "maLhKho": null,
      "paggingReq": {
        "limit": 1000,
        "page": 1
      },
      "str": null,
      "tenLhKho": null,
      "trangThai": null
    };
    let res = await this.danhMucService.danhMucLoaiKhoGetList(body);
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data && res.data.content) {
        this.listLoaiKho = res.data.content;
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async loadThuKho() {
    let body = {
      "maThukho": null,
      "paggingReq": {
        "limit": 1000,
        "page": 1
      },
      "str": null,
      "tenThukho": null,
      "trangThai": null
    };
    let res = await this.danhMucService.danhMucThuKhoGetList(body);
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data && res.data.content) {
        this.listThuKho = res.data.content;
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async loadDiemKho() {
    let body = {
      maDviCha: this.detail.maDvi,
      trangThai: '01',
    }
    this.listDiemKho = [];
    const res = await this.donViService.getTreeAll(body);
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
    let diemKho = this.listDiemKho.filter(x => x.key == this.detail.maDiemKho);
    if (diemKho && diemKho.length > 0) {
      this.listNhaKho = diemKho[0].children;
      if (fromChiTiet) {
        this.changeNhaKho(fromChiTiet);
      }
      else {
        this.detail.maNhaKho = null;
      }
    }
  }

  changeNhaKho(fromChiTiet: boolean) {
    let nhaKho = this.listNhaKho.filter(x => x.key == this.detail.maNhaKho);
    if (nhaKho && nhaKho.length > 0) {
      this.listNganKho = nhaKho[0].children;
      if (fromChiTiet) {
        this.changeNganKho();
      }
    }
  }

  changeNganKho() {
    let nganKho = this.listNganKho.filter(x => x.key == this.detail.maNganKho);
    if (nganKho && nganKho.length > 0) {
      this.listNganLo = nganKho[0].children;
    }
  }

  async loadDonViTinh() {
    try {
      const res = await this.donViService.loadDonViTinh();
      this.listDonViTinh = [];
      if (res.msg == MESSAGE.SUCCESS) {
        for (let i = 0; i < res.data.length; i++) {
          const item = {
            ...res.data[i],
            labelDonViTinh: res.data[i].tenDviTinh,
          };
          this.listDonViTinh.push(item);
        }
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
          this.pheDuyet()
        } catch (e) {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      },
    });
  }

  pheDuyet() {
    let trangThai = ''
    switch (this.detail.trangThai) {
      case STATUS.DU_THAO: {
        trangThai = STATUS.CHO_DUYET_TK;
        break;
      }
      case STATUS.CHO_DUYET_TK: {
        trangThai = STATUS.CHO_DUYET_KT;
        break;
      }
      case STATUS.TU_CHOI_TK: {
        trangThai = STATUS.CHO_DUYET_KT;
        break;
      }
      case STATUS.CHO_DUYET_KT: {
        trangThai = STATUS.CHO_DUYET_LDCC;
        break;
      }
      case STATUS.TU_CHOI_KT: {
        trangThai = STATUS.CHO_DUYET_LDCC;
        break;
      }
      case STATUS.CHO_DUYET_LDCC: {
        trangThai = STATUS.DA_DUYET_LDCC;
        break;
      }
      case STATUS.TU_CHOI_LDCC: {
        trangThai = STATUS.DA_DUYET_LDCC;
        break;
      }
    }
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
            trangThai: trangThai,
          };
          let res =
            await this.quanLyNghiemThuKeLotService.updateStatus(
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
    let trangThai = ''
    switch (this.detail.trangThai) {
      case STATUS.CHO_DUYET_TK: {
        trangThai = STATUS.TU_CHOI_TK;
        break;
      }
      case STATUS.CHO_DUYET_KT: {
        trangThai = STATUS.TU_CHOI_KT;
        break;
      }
      case STATUS.CHO_DUYET_LDCC: {
        trangThai = STATUS.TU_CHOI_LDCC;
        break;
      }
    }
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
            trangThai: trangThai,
          };
          let res =
            await this.quanLyNghiemThuKeLotService.updateStatus(
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

  huyBo() {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn hủy bỏ các thao tác đang làm?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: () => {
        this.back();
      },
    });
  }

  back() {
    this.showListEvent.emit();
  }

  async save(isOther: boolean) {
    this.spinner.show();
    try {
      let body = {
        "detail": this.detail?.detail ?? [],
        "dinhMuc": this.detail?.dinhMuc,
        "fileDinhKems": [],
        "hthucBquan": this.detail?.hthucBquan,
        "hthucKlot": this.detail?.hthucKlot,
        "hopDongId": this.detail?.hopDongId,
        "id": this.id,
        "keToan": this.detail?.keToan,
        "ketLuan": this.detail?.ketLuan,
        "kieuKlot": this.detail?.kieuKlot,
        "kyThuatVien": this.detail?.kyThuatVien,
        "ldoTuchoi": null,
        "lhKho": this.detail?.lhKho,
        "loaiVthh": this.detail.maVatTuCha,
        "maDvi": this.detail?.maDvi,
        "maDiemKho": this.detail.maDiemKho,
        "maNhaKho": this.detail.maNhaKho,
        "maNganKho": this.detail.maNganKho,
        "maNganLo": this.detail.maNganLo,
        "maVthh": this.detail.maVatTuCha,
        "maVatTu": this.detail.maVatTu,
        "maVatTuCha": this.detail.maVatTuCha,
        "ngayKthuc": null,
        "ngayLap": null,
        "ngayNghiemThu": this.detail?.ngayNghiemThu ? dayjs(this.detail?.ngayNghiemThu).format('YYYY-MM-DD') : null,
        "pthucBquan": this.detail?.pthucBquan,
        "qdgnvnxId": this.detail?.qdgnvnxId,
        "slThucNhap": this.detail?.slThucNhap,
        "soBb": this.detail?.soBb,
        "thuKho": this.detail?.thuKho,
        "thuTruong": this.detail?.thuTruong,
        "tichLuong": this.detail?.tichLuong,
        "trangThaiNhap": null
      };
      if (this.id > 0) {
        let res = await this.quanLyNghiemThuKeLotService.sua(
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
        let res = await this.quanLyNghiemThuKeLotService.them(
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

  thongTinTrangThai(trangThai: string): string {
    return thongTinTrangThaiNhap(trangThai);
  }

  print() {

  }
}
