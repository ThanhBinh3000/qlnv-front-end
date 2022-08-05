import { QuanLyNghiemThuKeLotService } from 'src/app/services/quanLyNghiemThuKeLot.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as dayjs from 'dayjs';
import { saveAs } from 'file-saver';
import { cloneDeep } from 'lodash';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogDanhSachHangHoaComponent } from 'src/app/components/dialog/dialog-danh-sach-hang-hoa/dialog-danh-sach-hang-hoa.component';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { DetailBienBanNhapDayKho } from 'src/app/models/BienBanNhapDayKho';
import { FileDinhKem } from 'src/app/models/FileDinhKem';
import { UserLogin } from 'src/app/models/userlogin';
import { ChiTieuKeHoachNamCapTongCucService } from 'src/app/services/chiTieuKeHoachNamCapTongCuc.service';
import { DonviService } from 'src/app/services/donvi.service';
import { QuanLyPhieuNhapDayKhoService } from 'src/app/services/quanLyPhieuNhapDayKho.service';
import { QuyetDinhGiaoNhapHangService } from 'src/app/services/quyetDinhGiaoNhapHang.service';
import { ThongTinHopDongService } from 'src/app/services/thongTinHopDong.service';
import { UploadFileService } from 'src/app/services/uploaFile.service';
import { UserService } from 'src/app/services/user.service';
import { convertTienTobangChu, thongTinTrangThaiNhap } from 'src/app/shared/commonFunction';
import { Globals } from 'src/app/shared/globals';

@Component({
  selector: 'them-moi-phieu-nhap-day-kho',
  templateUrl: './them-moi-phieu-nhap-day-kho.component.html',
  styleUrls: ['./them-moi-phieu-nhap-day-kho.component.scss'],
})
export class ThemMoiPhieuNhapDayKhoComponent implements OnInit {
  @Input() id: number;
  @Input() isView: boolean;
  @Input() typeVthh: string;
  @Input() isTatCa: boolean;
  @Output()
  showListEvent = new EventEmitter<any>();

  userInfo: UserLogin;
  detail: any = {};

  loaiVthh: string;
  loaiStr: string;
  maVthh: string;
  routerVthh: string;

  listDiemKho: any[] = [];
  listNhaKho: any[] = [];
  listNganKho: any[] = [];
  listNganLo: any[] = [];
  listPhieuKiemTraChatLuong: any[] = [];
  listSoQuyetDinh: any[] = [];
  listNghiemThuBaoQuan: any[] = [];

  create: any = {};
  editDataCache: { [key: string]: { edit: boolean; data: any } } = {};

  bienBanNhapDayKhoDetailCreate: DetailBienBanNhapDayKho = new DetailBienBanNhapDayKho();
  dsBienBanNhapDayKhoDetailClone: Array<DetailBienBanNhapDayKho> = [];
  isChiTiet: boolean = false;
  listHopDong: any[] = [];
  taiLieuDinhKemList: any[] = [];
  detailHopDong: any = {};
  detailGiaoNhap: any = {};
  bbNghiemThuBaoQuans: any[] = [];
  constructor(
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    private modal: NzModalService,
    private userService: UserService,
    private quanLyPhieuNhapDayKhoService: QuanLyPhieuNhapDayKhoService,
    private donViService: DonviService,
    public globals: Globals,
    private uploadFileService: UploadFileService,
    private chiTieuKeHoachNamService: ChiTieuKeHoachNamCapTongCucService,
    private quyetDinhGiaoNhapHangService: QuyetDinhGiaoNhapHangService,
    private thongTinHopDongService: ThongTinHopDongService,
    private quanLyNghiemThuKeLotService: QuanLyNghiemThuKeLotService,
  ) { }

  async ngOnInit() {
    this.spinner.show();
    try {
      this.userInfo = this.userService.getUserLogin();
      this.detail.maDvi = this.userInfo.MA_DVI;
      this.detail.tenDvi = this.userInfo.TEN_DVI;
      if (this.isTatCa) {
        this.detail.maVatTuCha = null;
      }
      else {
        this.detail.maVatTuCha = this.typeVthh;
      }
      this.detail.trangThai = this.globals.prop.NHAP_DU_THAO;
      this.detail.tenTrangThai = 'Dự thảo';
      await Promise.all([
        this.loadDiemKho(),
        this.loadNghiemThuBaoQuan(),
        this.loadSoQuyetDinh(),
        this.loadBienBanNghiemThuBaoQuan(),
      ]);
      if (this.id > 0) {
        this.loadPhieuNhapDayKho();
      }
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  isDisableField() {
    if (this.detail && (this.detail.trangThai == this.globals.prop.NHAP_CHO_DUYET_KTV_BAO_QUAN || this.detail.trangThai == this.globals.prop.NHAP_CHO_DUYET_CAN_BO_KE_TOAN || this.detail.trangThai == this.globals.prop.NHAP_CHO_DUYET_LD_CHI_CUC || this.detail.trangThai == this.globals.prop.NHAP_DA_DUYET)) {
      return true;
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
    let res = await this.quyetDinhGiaoNhapHangService.timKiem(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.listSoQuyetDinh = data.content;
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

  selectHangHoa() {
    if (this.isDisableField() || this.isView) {
      return;
    }
    let data = this.detail.maVatTuCha;
    const modalTuChoi = this.modal.create({
      nzTitle: 'Danh sách hàng hóa',
      nzContent: DialogDanhSachHangHoaComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: { data },
    });
    modalTuChoi.afterClose.subscribe(async (data) => {
      if (data) {
        this.bindingDataHangHoa(data);
      }
    });
  }

  async bindingDataHangHoa(data) {
    if (data.loaiHang == "M" || data.loaiHang == "LT") {
      this.detail.maVatTuCha = data.parent.ma;
      this.detail.tenVatTuCha = data.parent.ten;
      this.detail.maVatTu = data.ma;
      this.detail.tenVatTu = data.ten;
    }
    if (data.loaiHang == "VT") {
      if (data.cap == "3") {
        this.detail.maVatTuCha = data.parent.parent.ma;
        this.detail.tenVatTuCha = data.parent.parent.ten;
        this.detail.maVatTu = data.parent.ma;
        this.detail.tenVatTu = data.parent.ten;
      }
      if (data.cap == "2") {
        this.detail.maVatTuCha = data.parent.ma;
        this.detail.tenVatTuCha = data.parent.ten;
        this.detail.maVatTu = data.ma;
        this.detail.tenVatTu = data.ten;
      }
    }
  }

  async loadNghiemThuBaoQuan() {
    let body = {
      "capDvis": ['3'],
      "maVatTuCha": this.typeVthh,
      "maDvi": this.userInfo.MA_DVI,
      "paggingReq": {
        "limit": 1000,
        "page": 0
      },
      "trangThai": this.globals.prop.NHAP_DA_DUYET,
    };
    let res = await this.quanLyNghiemThuKeLotService.timKiem(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.listNghiemThuBaoQuan = data.content;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }


  convertTien(tien: number): string {
    return convertTienTobangChu(tien);
  }

  clearItemRow() {
    this.create = {};
    this.create.donViTinh = "Tấn";
  }

  redirectbienBanNhapDayKho() {
    this.showListEvent.emit();
  }

  save(isGuiDuyet?: boolean) {
    this.spinner.show();
    let body = {
      "chiTiets": this.detail.chiTiets,
      "chungLoaiHangHoa": this.detail.chungLoaiHangHoa ?? null,
      "fileDinhKems": this.detail.fileDinhKems,
      "id": this.detail.id ?? null,
      "keToan": this.detail.keToan ?? null,
      "kyThuatVien": this.detail.kyThuatVien ?? null,
      "maDiemKho": this.detail.maDiemKho ?? null,
      "maNhaKho": this.detail.maNhaKho ?? null,
      "maNganKho": this.detail.maNganKho ?? null,
      "maNganLo": this.detail.maNganLo ?? null,
      "maVatTu": this.detail.maVatTu ?? null,
      "maVatTuCha": this.detail.maVatTuCha ?? null,
      "maDvi": this.detail.maDvi ?? null,
      "maQhns": this.detail.maQhns ?? null,
      "ngayBatDauNhap": this.detail.ngayBatDauNhap ? dayjs(this.detail.ngayBatDauNhap).format('YYYY-MM-DD') : null,
      "ngayKetThucNhap": this.detail.ngayKetThucNhap ? dayjs(this.detail.ngayKetThucNhap).format('YYYY-MM-DD') : null,
      "ngayNhapDayKho": this.detail.ngayNhapDayKho ? dayjs(this.detail.ngayNhapDayKho).format("YYYY-MM-DD") : null,
      "soBienBan": this.detail.soBienBan ?? null,
      "thuKho": this.detail.thuKho ?? null,
      "thuTruong": this.detail.thuTruong ?? null,
      "qdgnvnxId": this.detail.qdgnvnxId,
      "bbNghiemThuId": this.detail.bbNghiemThuId,
      "hopDongId": this.detail.hopDongId,
    }
    if (this.id > 0) {
      this.quanLyPhieuNhapDayKhoService.sua(
        body,
      ).then((res) => {
        if (res.msg == MESSAGE.SUCCESS) {
          if (isGuiDuyet) {
            let body = {
              id: res.data.id,
              lyDo: null,
              trangThai: this.globals.prop.NHAP_CHO_DUYET_KTV_BAO_QUAN,
            };
            this.quanLyPhieuNhapDayKhoService.updateStatus(body);
            if (res.msg == MESSAGE.SUCCESS) {
              this.notification.success(
                MESSAGE.SUCCESS,
                MESSAGE.UPDATE_SUCCESS,
              );
              this.redirectbienBanNhapDayKho();
            } else {
              this.notification.error(MESSAGE.ERROR, res.msg);
            }
          } else {
            this.notification.success(
              MESSAGE.SUCCESS,
              MESSAGE.UPDATE_SUCCESS,
            );
            this.redirectbienBanNhapDayKho();
          }
        } else {
          this.notification.error(MESSAGE.ERROR, res.msg);
        }
      })
        .catch((e) => {
          console.error('error: ', e);
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        })
        .finally(() => {
          this.spinner.hide();
        });
    } else {
      this.quanLyPhieuNhapDayKhoService.them(
        body,
      ).then((res) => {
        if (res.msg == MESSAGE.SUCCESS) {
          if (isGuiDuyet) {
            let body = {
              id: res.data.id,
              lyDo: null,
              trangThai: this.globals.prop.NHAP_CHO_DUYET_KTV_BAO_QUAN,
            };
            this.quanLyPhieuNhapDayKhoService.updateStatus(body);
            if (res.msg == MESSAGE.SUCCESS) {
              this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
              this.redirectbienBanNhapDayKho();
            } else {
              this.notification.error(MESSAGE.ERROR, res.msg);
            }
          } else {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
            this.redirectbienBanNhapDayKho();
          }
        } else {
          this.notification.error(MESSAGE.ERROR, res.msg);
        }
      }).catch((e) => {
        console.error('error: ', e);
        this.notification.error(
          MESSAGE.ERROR,
          e.error.errors[0].defaultMessage,
        );
      })
        .finally(() => {
          this.spinner.hide();
        });
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
          this.save(true);
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
    let trangThai = this.globals.prop.NHAP_CHO_DUYET_CAN_BO_KE_TOAN;
    if (this.detail.trangThai == this.globals.prop.NHAP_CHO_DUYET_CAN_BO_KE_TOAN) {
      trangThai = this.globals.prop.NHAP_CHO_DUYET_LD_CHI_CUC;
    } else if (this.detail.trangThai == this.globals.prop.NHAP_CHO_DUYET_LD_CHI_CUC) {
      trangThai = this.globals.prop.NHAP_DA_DUYET;
    }
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn duyệt?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: async () => {
        this.spinner.show();
        try {
          let body = {
            id: this.id,
            lyDo: null,
            trangThai: trangThai,
          };
          const res = await this.quanLyPhieuNhapDayKhoService.updateStatus(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.APPROVE_SUCCESS);
            this.redirectbienBanNhapDayKho();
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
    let trangThai = this.globals.prop.NHAP_TU_CHOI_KTV_BAO_QUAN;
    if (this.detail.trangThai == this.globals.prop.NHAP_CHO_DUYET_CAN_BO_KE_TOAN) {
      trangThai = this.globals.prop.NHAP_TU_CHOI_CAN_BO_KE_TOAN;
    } else if (this.detail.trangThai == this.globals.prop.NHAP_CHO_DUYET_LD_CHI_CUC) {
      trangThai = this.globals.prop.NHAP_TU_CHOI_LD_CHI_CUC;
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
            lyDo: text,
            trangThai: trangThai,
          };
          const res = await this.quanLyPhieuNhapDayKhoService.updateStatus(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.TU_CHOI_SUCCESS);
            this.redirectbienBanNhapDayKho();
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
          this.spinner.hide();
        } catch (e) {
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
        this.redirectbienBanNhapDayKho();
      },
    });
  }

  back() {
    this.showListEvent.emit();
  }

  thongTinTrangThai(trangThai: string): string {
    return thongTinTrangThaiNhap(trangThai);
  }

  disabledStartDate = (startValue: Date): boolean => {
    if (!startValue || !this.detail.ngayKetThucNhap) {
      return false;
    }
    return startValue.getTime() > new Date(this.detail.ngayKetThucNhap).getTime();
  };

  disabledEndDate = (endValue: Date): boolean => {
    if (!endValue || !this.detail.ngayBatDauNhap) {
      return false;
    }
    return endValue.getTime() <= new Date(this.detail.ngayBatDauNhap).getTime();
  };

  calculatorThanhTienCreate(): string {
    this.bienBanNhapDayKhoDetailCreate.thanhTien =
      this.bienBanNhapDayKhoDetailCreate.soLuong *
      this.bienBanNhapDayKhoDetailCreate.donGia;
    return this.bienBanNhapDayKhoDetailCreate.thanhTien
      ? Intl.NumberFormat('en-US').format(
        this.bienBanNhapDayKhoDetailCreate.thanhTien,
      )
      : '0';
  }

  themmoi() {
    if (this.bienBanNhapDayKhoDetailCreate.thanhTien == 0 || !this.bienBanNhapDayKhoDetailCreate.thanhTien) {
      return;
    }
    const bbNhapDayKhoTemp = new DetailBienBanNhapDayKho();
    bbNhapDayKhoTemp.soLuong = this.bienBanNhapDayKhoDetailCreate.soLuong;
    bbNhapDayKhoTemp.donGia = this.bienBanNhapDayKhoDetailCreate.donGia;
    bbNhapDayKhoTemp.thanhTien = this.bienBanNhapDayKhoDetailCreate.thanhTien;
    bbNhapDayKhoTemp.ghiChu = this.bienBanNhapDayKhoDetailCreate.ghiChu;
    if (!this.detail.chiTiets) {
      this.detail.chiTiets = [];
    }
    this.detail.chiTiets = [
      ...this.detail.chiTiets,
      bbNhapDayKhoTemp,
    ];
    this.detail.chiTiets.forEach((lt, i) => {
      lt.stt = i + 1;
    });
    this.newObjectBienBanNhapDayKho();
    this.dsBienBanNhapDayKhoDetailClone = cloneDeep(this.detail.chiTiets);
  }

  clearNew() {
    this.newObjectBienBanNhapDayKho();
  }

  newObjectBienBanNhapDayKho() {
    this.bienBanNhapDayKhoDetailCreate = new DetailBienBanNhapDayKho();
  }

  startEdit(index: number) {
    this.dsBienBanNhapDayKhoDetailClone[index].isEdit = true;
  }

  deleteData(stt: number) {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn xóa?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: () => {
        this.detail.chiTiets =
          this.detail?.chiTiets.filter(
            (khlt) => khlt.stt !== stt,
          );
        this.detail?.chiTiets.forEach((lt, i) => {
          if (i >= stt - 1) {
            lt.stt = i + 1;
          }
        });
        this.dsBienBanNhapDayKhoDetailClone = cloneDeep(
          this.detail.chiTiets,
        );
        // this.loadData();
      },
    });
  }

  saveEditBBDayKho(i: number): void {
    this.dsBienBanNhapDayKhoDetailClone[i].isEdit = false;
    Object.assign(
      this.detail.chiTiets[i],
      this.dsBienBanNhapDayKhoDetailClone[i],
    );
  }

  cancelEditBBDayKho(index: number) {
    this.dsBienBanNhapDayKhoDetailClone = cloneDeep(this.detail.chiTiets);
    this.dsBienBanNhapDayKhoDetailClone[index].isEdit = false;
  }

  calculatorThanhTienEdit(i: number): string {
    this.dsBienBanNhapDayKhoDetailClone[i].thanhTien =
      +this.dsBienBanNhapDayKhoDetailClone[i].soLuong *
      +this.dsBienBanNhapDayKhoDetailClone[i].donGia;
    return this.dsBienBanNhapDayKhoDetailClone[i].thanhTien
      ? Intl.NumberFormat('en-US').format(
        this.dsBienBanNhapDayKhoDetailClone[i].thanhTien,
      )
      : '0';
  }

  loadPhieuNhapDayKho() {
    this.quanLyPhieuNhapDayKhoService
      .chiTiet(this.id)
      .then(async (res) => {
        if (res.msg == MESSAGE.SUCCESS) {
          this.detail = res.data;
          this.dsBienBanNhapDayKhoDetailClone = this.detail?.chiTiets ?? [];
          await this.changeSoQuyetDinh(true);
          await this.changeDiemKho(true);
        } else {
          this.notification.error(MESSAGE.ERROR, res.msg);
        }
      }).catch(err => {
        this.notification.error(MESSAGE.ERROR, err.msg);
      })
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

  print() {

  }

  async changeSoQuyetDinh(autoChange: boolean) {
    let quyetDinh = this.listSoQuyetDinh.filter(x => x.id == this.detail.qdgnvnxId);
    if (quyetDinh && quyetDinh.length > 0) {
      this.detailGiaoNhap = quyetDinh[0];
      if (this.detailGiaoNhap.children1 && this.detailGiaoNhap.children1.length > 0) {
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
      }
      if (!autoChange) {
        this.detail.soHd = null;
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

  async changeBienBanNghiemThu(autoChange?: boolean) {
    let bienBanNghiemThu = this.bbNghiemThuBaoQuans.find(x => x.id == this.detail.bbNghiemThuId);
    if (bienBanNghiemThu) {
      this.detail.thuTruong = bienBanNghiemThu.thuTruong;
      this.detail.keToan = bienBanNghiemThu.keToan;
      this.detail.kyThuatVien = bienBanNghiemThu.kyThuatVien;
      this.detail.thuKho = bienBanNghiemThu.thuKho;
      this.detail.tenDiemKho = bienBanNghiemThu.tenDiemKho;
      this.detail.tenNhaKho = bienBanNghiemThu.tenNhaKho;
      this.detail.tenNganKho = bienBanNghiemThu.tenNganKho;
      this.detail.tenNganLo = bienBanNghiemThu.tenNganLo;
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

  async loadBienBanNghiemThuBaoQuan() {
    let body = {
      "capDvis": ['3'],
      "paggingReq": {
        "limit": 1000,
        "page": 0
      },
      "trangThai": this.globals.prop.NHAP_DA_DUYET
    };
    let res = await this.quanLyNghiemThuKeLotService.timKiem(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.bbNghiemThuBaoQuans = res.data.content;
      console.log("res.data.content: ", res.data.content);

    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }
}
