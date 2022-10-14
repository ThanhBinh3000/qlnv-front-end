import { saveAs } from 'file-saver';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as dayjs from 'dayjs';
import { cloneDeep } from 'lodash';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { FileDinhKem } from 'src/app/models/FileDinhKem';
import { UserLogin } from 'src/app/models/userlogin';
import { ChiTieuKeHoachNamCapTongCucService } from 'src/app/services/chiTieuKeHoachNamCapTongCuc.service';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { DonviService } from 'src/app/services/donvi.service';
import { QuanLyPhieuKiemTraChatLuongHangService } from 'src/app/services/quantri-danhmuc/quanLyPhieuKiemTraChatLuongHang.service';
import { QuanLyPhieuNhapKhoService } from 'src/app/services/quanLyPhieuNhapKho.service';
import { QuyetDinhGiaoNhapHangService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/qd-giaonv-nh/quyetDinhGiaoNhapHang.service';
import { TinhTrangKhoHienThoiService } from 'src/app/services/tinhTrangKhoHienThoi.service';
import { UploadFileService } from 'src/app/services/uploaFile.service';
import { UserService } from 'src/app/services/user.service';
import { convertTienTobangChu, thongTinTrangThaiNhap } from 'src/app/shared/commonFunction';
import { Globals } from 'src/app/shared/globals';
import { HoSoKyThuatService } from 'src/app/services/hoSoKyThuat.service';
import { ThongTinHopDongService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/hop-dong/thongTinHopDong.service';

@Component({
  selector: 'them-moi-phieu-nhap-kho',
  templateUrl: './them-moi-phieu-nhap-kho.component.html',
  styleUrls: ['./them-moi-phieu-nhap-kho.component.scss'],
})
export class ThemMoiPhieuNhapKhoComponent implements OnInit {
  @Input() id: number;
  @Input() isView: boolean;
  @Input() typeVthh: string;
  @Input() isTatCa: boolean;
  @Output()
  showListEvent = new EventEmitter<any>();

  userInfo: UserLogin;
  detail: any = {};
  idNhapHang: number = 0;
  detailGiaoNhap: any = {};

  listDiemKho: any[] = [];
  listNhaKho: any[] = [];
  listNganKho: any[] = [];
  listNganLo: any[] = [];
  listPhieuKiemTraChatLuong: any[] = [];
  listDanhMucHang: any[] = [];
  listSoQuyetDinh: any[] = [];
  listHoSoKyThuat: any[] = [];
  listHangHoa: any[] = [];
  listPhieuKiemTraChatLuongFull: any[] = [];

  taiLieuDinhKemList: any[] = [];
  detailHopDong: any = {};

  create: any = {};
  editDataCache: { [key: string]: { edit: boolean; data: any } } = {};

  errorInputRequired: string = MESSAGE.ERROR_NOT_EMPTY;

  errorNhapId: boolean = false;

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
    private quanLyPhieuNhapKhoService: QuanLyPhieuNhapKhoService,
    private quanLyPhieuKiemTraChatLuongHangService: QuanLyPhieuKiemTraChatLuongHangService,
    public globals: Globals,
    private quyetDinhGiaoNhapHangService: QuyetDinhGiaoNhapHangService,
    private uploadFileService: UploadFileService,
    private chiTieuKeHoachNamService: ChiTieuKeHoachNamCapTongCucService,
    private hoSoKyThuatService: HoSoKyThuatService,
    private thongTinHopDongService: ThongTinHopDongService,
  ) { }

  async ngOnInit() {
    this.spinner.show();
    try {
      this.create.dvt = "Tấn";
      this.detail.trangThai = this.globals.prop.NHAP_DU_THAO;
      this.detail.tenTrangThai = 'Dự thảo';
      this.userInfo = this.userService.getUserLogin();
      this.detail.maDvi = this.userInfo.MA_DVI;
      this.detail.tenDvi = this.userInfo.TEN_DVI;
      this.detail.loaiVthh = this.typeVthh;
      await Promise.all([
        this.loadDiemKho(),
        this.loadPhieuKiemTraChatLuong(),
        this.loadDanhMucHang(),
        this.loadSoQuyetDinh(),
        this.loadHoSoKyThuat(),
        this.loaiVTHHGetAll(),
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
    if (this.detail && (this.detail.trangThai == this.globals.prop.NHAP_CHO_DUYET_TP || this.detail.trangThai == this.globals.prop.NHAP_CHO_DUYET_LD_CHI_CUC || this.detail.trangThai == this.globals.prop.NHAP_DA_DUYET_LD_CHI_CUC)) {
      return true;
    }
  }

  async loaiVTHHGetAll() {
    let res = await this.danhMucService.loaiVatTuHangHoaGetAll();
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data && res.data.length > 0) {
        if (this.isTatCa) {
          this.listHangHoa = res.data;
          if (this.id > 0) {
            this.detail.loaiVthh = this.listHangHoa[0].ma;
          }
        }
        else {
          this.listHangHoa = res.data.filter(x => x.ma == this.typeVthh);
        }
      }
    }
  }

  async loadHoSoKyThuat() {
    let body = {
      "capDvis": '3',
      "maDvi": this.detail.maDvi,
      "maVatTu": null,
      "maVatTuCha": this.typeVthh,
      "ngayKiemTraDenNgay": null,
      "ngayKiemTraTuNgay": null,
      "pageSize": 1000,
      "pageNumber": 1,
      "soBienBan": null,
      "soQdNhap": null,
      "trangThai": this.globals.prop.NHAP_DA_DUYET_LD_CHI_CUC,
    };
    let res = await this.hoSoKyThuatService.timKiem(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.listHoSoKyThuat = data.content;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  changeHoSoKyThuat() {
    let hoSoKyThuat = this.listHoSoKyThuat.filter(x => x.id == this.detail.hoSoKyThuatId);
    if (hoSoKyThuat && hoSoKyThuat.length > 0) {
      let itemVatTu = this.listDanhMucHang.filter(x => x.ma == hoSoKyThuat[0].maVatTu);
      this.detail.hangHoaList = [];
      let itemHangHoa = {
        "donGia": this.detailHopDong?.donGiaVat ?? 0,
        "donViTinh": itemVatTu && itemVatTu.length > 0 ? itemVatTu[0].maDviTinh : null,
        "id": 0,
        "maVatTu": hoSoKyThuat[0].maVatTu,
        "tenVatTu": hoSoKyThuat[0].tenVatTu,
        "soChungTu": 0,
        "soLuongThuc": 0,
        "soLuongTrenCt": hoSoKyThuat[0].soLuongThucNhap,
        "soThucNhap": hoSoKyThuat[0].soLuongThucNhap,
        "stt": 1,
        "thanhTien": 0,
        "vthh": null
      }
      this.detail.hangHoaList.push(itemHangHoa);
    }
  }

  async loadSoQuyetDinh() {
    let body = {
      "denNgayQd": null,
      "loaiQd": "",
      "maDvi": this.detail.maDvi,
      "maVthh": this.detail.loaiVthh,
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

  async changeSoQuyetDinh() {
    this.errorNhapId = false;
    let quyetDinh = this.listSoQuyetDinh.filter(x => x.id == this.detail.qdgnvnxId);
    if (quyetDinh && quyetDinh.length > 0) {
      this.detailGiaoNhap = quyetDinh[0];
      await this.getHopDong(this.detailGiaoNhap.soHd);
    }
  }

  async getHopDong(id) {
    if (id) {
      let body = {
        "str": id
      }
      let res = await this.thongTinHopDongService.loadChiTietSoHopDong(body);
      if (res.msg == MESSAGE.SUCCESS) {
        this.detailHopDong = res.data;
      }
      else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }
  }

  changePhieuKiemTra() {
    if (this.detail.phieuKtClIds && this.detail.phieuKtClIds.length > 0) {
      this.detail.hangHoaList = [];
      for (let i = 0; i < this.detail.phieuKtClIds.length; i++) {
        let phieuKt = this.listPhieuKiemTraChatLuong.filter(x => x.id == +this.detail.phieuKtClIds[i]);
        if (phieuKt && phieuKt.length > 0) {
          this.detail.maDiemKho = phieuKt[0].maDiemKho;
          this.detail.maNhaKho = phieuKt[0].maNhaKho;
          this.detail.maNganKho = phieuKt[0].maNganKho;
          this.detail.maNganLo = phieuKt[0].maNganLo;
          let checkVatTu = this.detail.hangHoaList.findIndex(x => x.maVatTu == phieuKt[0].maVatTu);
          if (checkVatTu != -1) {
            this.detail.hangHoaList[checkVatTu].soLuongTrenCt += phieuKt[0].khoiLuong;
          }
          else {
            let itemVatTu = this.listDanhMucHang.filter(x => x.ma == phieuKt[0].maVatTu);
            let itemHangHoa = {
              "donGia": this.detailHopDong?.donGiaVat ?? 0,
              "donViTinh": itemVatTu && itemVatTu.length > 0 ? itemVatTu[0].maDviTinh : null,
              "id": 0,
              "maVatTu": phieuKt[0].maVatTu,
              "tenVatTu": phieuKt[0].tenVatTu,
              "soChungTu": 0,
              "soLuongThuc": 0,
              "soLuongTrenCt": phieuKt[0].khoiLuong,
              "soThucNhap": 0,
              "stt": 1,
              "thanhTien": 0,
              "vthh": null
            }
            this.detail.hangHoaList.push(itemHangHoa);
          }
        }
      }
      this.listPhieuKiemTraChatLuong = this.listPhieuKiemTraChatLuongFull.filter(x => x.maNganLo == this.detail.maNganLo && x.maNganKho == this.detail.maNganKho
        && x.maNhaKho == this.detail.maNhaKho && x.maDiemKho == this.detail.maDiemKho);
      this.changeDiemKho(true);
    }
  }

  async loadPhieuKiemTraChatLuong() {
    let body = {
      "capDvis": ['3'],
      "maDonVi": this.detail.maDvi,
      "maHangHoa": this.typeVthh,
      "maNganKho": null,
      "ngayKiemTraDenNgay": null,
      "ngayKiemTraTuNgay": null,
      "ngayLapPhieu": null,
      "orderBy": null,
      "orderDirection": null,
      "paggingReq": {
        "limit": 1000,
        "orderBy": null,
        "orderType": null,
        "page": 0
      },
      "soPhieu": null,
      "str": null,
      "tenNguoiGiao": null,
      "trangThai": this.globals.prop.NHAP_DA_DUYET_LD_CHI_CUC,
    };
    let res = await this.quanLyPhieuKiemTraChatLuongHangService.timKiem(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.listPhieuKiemTraChatLuong = data.content;
      this.listPhieuKiemTraChatLuongFull = data.content;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async loadDanhMucHang() {
    let body = {
      "str": this.typeVthh
    };
    let res = await this.danhMucService.loadDanhMucHangHoaTheoMaCha(body);
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data) {
        this.listDanhMucHang = res.data;
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  changeDanhMucHang(item) {
    if (item) {
      let getHang = this.listDanhMucHang.filter(x => x.ten == this.create.tenVatTu);
      if (getHang && getHang.length > 0) {
        item.maVatTu = getHang[0].ma;
        item.donViTinh = getHang[0].maDviTinh;
      }
    }
  }

  async loadChiTiet(id) {
    if (id > 0) {
      let res = await this.quanLyPhieuNhapKhoService.loadChiTiet(id);
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          this.detail = res.data;
          this.changeDiemKho(true);
          if (this.detail.hangHoaRes) {
            this.detail.hangHoaList = this.detail.hangHoaRes;
          }
          if (this.detail.chungTus) {
            this.taiLieuDinhKemList = this.detail.chungTus;
          }
        }
      }
    }
    else {
      this.detail.ngayTao = dayjs().format("YYYY-MM-DD");
    }
    this.updateEditCache();
  }

  caculatorSoLuongTN() {
    if (this.detail && this.detail?.hangHoaList && this.detail?.hangHoaList.length > 0) {
      let sum = this.detail?.hangHoaList.map(item => item.soLuongThuc).reduce((prev, next) => prev + next);
      return sum ?? 0;
    }
    return 0;
  }

  caculatorDonGia() {
    if (this.detail && this.detail?.hangHoaList && this.detail?.hangHoaList.length > 0) {
      let sum = this.detail?.hangHoaList.map(item => item.donGia).reduce((prev, next) => prev + next);
      return sum ?? 0;
    }
    return 0;
  }

  caculatorThanhTien() {
    if (this.detail && this.detail?.hangHoaList && this.detail?.hangHoaList.length > 0) {
      let sum = this.detail?.hangHoaList.map(item => item.thanhTien).reduce((prev, next) => prev + next);
      return sum ?? 0;
    }
    return 0;
  }

  convertTien(tien: number): string {
    return convertTienTobangChu(tien);
  }

  deleteRow(data: any) {
    this.detail.hangHoaList = this.detail?.hangHoaList.filter(x => x.stt != data.stt);
    this.sortTableId();
    this.updateEditCache();
  }

  editRow(stt: number) {
    this.editDataCache[stt].edit = true;
  }

  sortTableId() {
    this.detail?.hangHoaList.forEach((lt, i) => {
      lt.stt = i + 1;
    });
  }

  addRow() {
    if (!this.detail?.hangHoaList) {
      this.detail.hangHoaList = [];
    }
    this.sortTableId();
    let item = cloneDeep(this.create);
    item.stt = this.detail?.hangHoaList.length + 1;
    this.checkDataExist(item);
    this.clearItemRow();
  }

  checkDataExist(data) {
    if (this.detail?.hangHoaList && this.detail?.hangHoaList.length > 0) {
      let index = this.detail?.hangHoaList.findIndex(x => x.maVatTu == data.maVatTu);
      if (index != -1) {
        this.detail.hangHoaList.splice(index, 1);
      }
    }
    else {
      this.detail.hangHoaList = [];
    }
    this.detail.hangHoaList = [
      ...this.detail.hangHoaList,
      data,
    ];
    this.updateEditCache();
  }

  clearItemRow() {
    this.create = {};
    this.create.donViTinh = "Tấn";
  }

  cancelEdit(stt: number): void {
    const index = this.detail?.hangHoaList.findIndex(item => item.stt === stt);
    this.editDataCache[stt] = {
      data: { ...this.detail?.detail[index] },
      edit: false
    };
  }

  saveEdit(stt: number): void {
    const index = this.detail?.hangHoaList.findIndex(item => item.stt === stt);
    Object.assign(this.detail?.hangHoaList[index], this.editDataCache[stt].data);
    this.editDataCache[stt].edit = false;
  }

  updateEditCache(): void {
    if (this.detail?.hangHoaList && this.detail?.hangHoaList.length > 0) {
      this.detail?.hangHoaList.forEach((item) => {
        this.editDataCache[item.stt] = {
          edit: false,
          data: { ...item },
        };
      });
    }
  }

  caculatorSoLuong(item: any) {
    if (item) {
      item.thanhTien = (item?.soLuongThuc ?? 0) * (item?.donGia ?? 0);
    }
  }

  async loadDiemKho() {
    let body = {
      maDviCha: this.detail.maDvi,
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
          }
        });
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  changeDiemKho(fromChiTiet: boolean) {
    let diemKho = this.listDiemKho.filter(x => x.key == this.detail.maDiemKho);
    if (!fromChiTiet) {
      this.detail.maNhaKho = null;
    }
    if (diemKho && diemKho.length > 0) {
      this.listNhaKho = diemKho[0].children;
      if (fromChiTiet) {
        this.changeNhaKho(fromChiTiet);
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
            await this.quanLyPhieuNhapKhoService.updateStatus(
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
    let trangThai = this.globals.prop.NHAP_CHO_DUYET_LD_CHI_CUC;
    if (this.detail.trangThai == this.globals.prop.NHAP_CHO_DUYET_LD_CHI_CUC) {
      trangThai = this.globals.prop.NHAP_DA_DUYET_LD_CHI_CUC;
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
            await this.quanLyPhieuNhapKhoService.updateStatus(
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
            await this.quanLyPhieuNhapKhoService.updateStatus(
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
      this.errorNhapId = false;
      if (!this.detail.qdgnvnxId || this.detail.qdgnvnxId == '') {
        this.errorNhapId = true;
        this.spinner.hide();
        return;
      }
      let body = {
        "bbNghiemThuKlId": this.detail.soQdNvuNhang,
        "diaChiGiaoNhan": null,
        "ghiChu": null,
        "hangHoaList": this.detail?.hangHoaList,
        "id": this.id,
        "loaiHinhNhap": null,
        "loaiVthh": this.detail?.loaiVthh,
        "maDiemKho": this.detail?.maDiemKho,
        "maDvi": this.detail.maDvi,
        "maNganLo": this.detail.maNganLo,
        "maNganKho": this.detail.maNganKho,
        "maNhaKho": this.detail.maNhaKho,
        "maQhns": this.detail.maDvi,
        "ngayLap": null,
        "ngayNhapKho": this.detail.ngayNhapKho,
        "ngayQdNvuNhang": this.detail.ngayQdNvuNhang,
        "ngayTao": this.detail.ngayTao,
        "nguoiGiaoHang": this.detail.nguoiGiaoHang,
        "phieuKtClIds": this.detail.phieuKtClIds,
        "soPhieu": this.detail.soPhieu,
        "soQdNvuNhang": this.detail.soQdNvuNhang,
        "taiKhoanCo": this.detail.taiKhoanCo,
        "taiKhoanNo": this.detail.taiKhoanNo,
        "tenNganLo": null,
        "tenNguoiGiaoNhan": this.detail.nguoiGiaoHang,
        "thoiGianGiaoNhan": this.detail.thoiGianGiaoNhan,
        "qdgnvnxId": this.detail.qdgnvnxId,
        "chungTus": this.taiLieuDinhKemList,
        "hoSoKyThuatId": this.detail.hoSoKyThuatId,
      };
      if (this.id > 0) {
        let res = await this.quanLyPhieuNhapKhoService.sua(
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
        let res = await this.quanLyPhieuNhapKhoService.them(
          body,
        );
        if (res.msg == MESSAGE.SUCCESS) {
          this.id = res.data?.id;
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
      this.notification.error(MESSAGE.ERROR, (e?.error?.message ?? MESSAGE.SYSTEM_ERROR));
    }
  }

  print() {

  }

  deleteTaiLieuDinhKemTag(data: any) {
    if (!this.isView) {
      this.taiLieuDinhKemList = this.taiLieuDinhKemList.filter(
        (x) => x.id !== data.id,
      );
      this.detail.fileDinhKems = this.detail.fileDinhKems.filter((x) => x.idVirtual !== data.id);
    }
  }

  openFile(event) {
    if (!this.isView) {
      let item = {
        id: new Date().getTime(),
        text: event.name,
      };
      if (!this.taiLieuDinhKemList.find((x) => x.text === item.text)) {
        this.uploadFileService
          .uploadFile(event.file, event.name)
          .then((resUpload) => {
            if (!this.detail.fileDinhKems) {
              this.detail.fileDinhKems = [];
            }
            const fileDinhKem = new FileDinhKem();
            fileDinhKem.fileName = resUpload.filename;
            fileDinhKem.fileSize = resUpload.size;
            fileDinhKem.fileUrl = resUpload.url;
            fileDinhKem.idVirtual = item.id;
            this.detail.fileDinhKems.push(fileDinhKem);
            this.taiLieuDinhKemList.push(item);
          });
      }
    }
  }

  downloadFileKeHoach(event) {
    let body = {
      "dataType": "",
      "dataId": 0
    }
    switch (event) {
      case 'tai-lieu-dinh-kem':
        body.dataType = this.detail.fileDinhKems[0].dataType;
        body.dataId = this.detail.fileDinhKems[0].dataId;
        if (this.taiLieuDinhKemList.length > 0) {
          this.chiTieuKeHoachNamService.downloadFileKeHoach(body).subscribe((blob) => {
            saveAs(blob, this.detail.fileDinhKems.length > 1 ? 'Tai-lieu-dinh-kem.zip' : this.detail.fileDinhKems[0].fileName);
          });
        }
        break;
      default:
        break;
    }
  }

  thongTinTrangThai(trangThai: string): string {
    return thongTinTrangThaiNhap(trangThai);
  }
}
