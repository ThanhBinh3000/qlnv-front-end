import { saveAs } from 'file-saver';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as dayjs from 'dayjs';
import { cloneDeep } from 'lodash';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogDanhSachHangHoaComponent } from 'src/app/components/dialog/dialog-danh-sach-hang-hoa/dialog-danh-sach-hang-hoa.component';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { BienBanNhapDayKho, DetailBienBanNhapDayKho } from 'src/app/models/BienBanNhapDayKho';
import { UserLogin } from 'src/app/models/userlogin';
import { DonviService } from 'src/app/services/donvi.service';
import { QuanLyPhieuKiemTraChatLuongHangService } from 'src/app/services/quanLyPhieuKiemTraChatLuongHang.service';
import { QuanLyPhieuNhapDayKhoService } from 'src/app/services/quanLyPhieuNhapDayKho.service';
import { UploadFileService } from 'src/app/services/uploaFile.service';
import { UserService } from 'src/app/services/user.service';
import { convertTienTobangChu } from 'src/app/shared/commonFunction';
import { Globals } from 'src/app/shared/globals';
import { ChiTieuKeHoachNamCapTongCucService } from 'src/app/services/chiTieuKeHoachNamCapTongCuc.service';
import { FileDinhKem } from 'src/app/models/FileDinhKem';

@Component({
  selector: 'app-thong-tin-bien-ban-ket-thuc-nhap-kho',
  templateUrl: './thong-tin-bien-ban-ket-thuc-nhap-kho.component.html',
  styleUrls: ['./thong-tin-bien-ban-ket-thuc-nhap-kho.component.scss']
})
export class ThongTinBienBanKetThucNhapKhoComponent implements OnInit {
  @Input() id: number;
  @Input() isView: boolean;
  @Input() typeVthh: string;
  @Output()
  showListEvent = new EventEmitter<any>();
  userInfo: UserLogin;
  detail: any = {};
  idNhapHang: number = 0;

  loaiVthh: string;
  loaiStr: string;
  maVthh: string;
  routerVthh: string;

  listDiemKho: any[] = [];
  listNhaKho: any[] = [];
  listNganKho: any[] = [];
  listNganLo: any[] = [];
  listPhieuKiemTraChatLuong: any[] = [];

  create: any = {};
  editDataCache: { [key: string]: { edit: boolean; data: any } } = {};
  bienBanNhapDayKho: BienBanNhapDayKho = new BienBanNhapDayKho();
  viewChiTiet: boolean = false;
  bienBanNhapDayKhoDetailCreate: DetailBienBanNhapDayKho = new DetailBienBanNhapDayKho();
  dsBienBanNhapDayKhoDetailClone: Array<DetailBienBanNhapDayKho> = [];
  isChiTiet: boolean = false;

  taiLieuDinhKemList: any[] = [];

  constructor(
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    private router: Router,
    private routerActive: ActivatedRoute,
    private modal: NzModalService,
    private userService: UserService,
    private quanLyPhieuNhapDayKhoService: QuanLyPhieuNhapDayKhoService,
    private quanLyPhieuKiemTraChatLuongHangService: QuanLyPhieuKiemTraChatLuongHangService,
    private donViService: DonviService,
    public globals: Globals,
    private uploadFileService: UploadFileService,
    private chiTieuKeHoachNamService: ChiTieuKeHoachNamCapTongCucService,
  ) { }

  async ngOnInit() {
    this.spinner.show();
    try {
      this.create.dvt = "Tấn";
      this.id = +this.routerActive.snapshot.paramMap.get('id');
      this.userInfo = this.userService.getUserLogin();
      this.bienBanNhapDayKho.maDonVi = this.userInfo.MA_DVI;
      this.bienBanNhapDayKho.tenDonVi = this.userInfo.TEN_DVI;
      await Promise.all([
        this.loadDiemKho(),
        this.loadPhieuKiemTraChatLuong(),
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

  async loadDiemKho() {
    let body = {
      maDviCha: this.detail.maDvi,
      trangThai: '01',
    }
    const res = await this.donViService.getTreeAll(body);
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data) {
        this.listDiemKho = res.data;
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

  selectHangHoa() {
    let data = this.typeVthh;
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

  async loadPhieuKiemTraChatLuong() {
    let body = {
      "maDonVi": this.userInfo.MA_DVI,
      "maHangHoa": this.maVthh,
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
        "page": 1
      },
      "soPhieu": null,
      "str": null,
      "tenNguoiGiao": null,
      "trangThai": null
    };
    let res = await this.quanLyPhieuKiemTraChatLuongHangService.timKiem(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.listPhieuKiemTraChatLuong = data.content;
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

  disableBanHanh(): boolean {
    return (
      this.bienBanNhapDayKho.trangThai === this.globals.prop.DU_THAO ||
      this.id === 0 ||
      this.bienBanNhapDayKho.trangThai === this.globals.prop.TU_CHOI
    );
  }

  save(isGuiDuyet?: boolean) {
    this.spinner.show();
    let body = {
      "chiTiets": this.bienBanNhapDayKho.chiTiets,
      "chungLoaiHangHoa": this.bienBanNhapDayKho.chungLoaiHangHoa ?? null,
      "fileDinhKems": [],
      "id": this.bienBanNhapDayKho.id ?? null,
      "keToan": this.bienBanNhapDayKho.keToan ?? null,
      "kyThuatVien": this.bienBanNhapDayKho.kyThuatVien ?? null,
      "maDiemKho": this.bienBanNhapDayKho.maDiemKho ?? null,
      "maDonVi": this.bienBanNhapDayKho.maDonVi ?? null,
      // "maHang": this.bienBanNhapDayKho.maHang ?? null,
      "maHang": this.maVthh,
      "maNganLo": this.bienBanNhapDayKho.maNganLo ?? null,
      "maNhaKho": this.bienBanNhapDayKho.maNhaKho ?? null,
      "maQhns": this.bienBanNhapDayKho.maQhns ?? null,
      "ngayBatDauNhap": this.bienBanNhapDayKho.ngayBatDauNhap ? dayjs(this.bienBanNhapDayKho.ngayBatDauNhap).format('YYYY-MM-DD') : null,
      "ngayKetThucNhap": this.bienBanNhapDayKho.ngayKetThucNhap ? dayjs(this.bienBanNhapDayKho.ngayKetThucNhap).format('YYYY-MM-DD') : null,
      // "ngayLap": this.bienBanNhapDayKho.ngayLap ? dayjs(this.bienBanNhapDayKho.ngayLap).format('YYYY-MM-DD') : null,
      "ngayLap": dayjs().format('YYYY-MM-DD'),
      "ngayNhapDayKho": this.bienBanNhapDayKho.ngayNhapDayKho ? dayjs(this.bienBanNhapDayKho.ngayNhapDayKho).format("YYYY-MM-DD") : null,
      "soBienBan": this.bienBanNhapDayKho.soBienBan ?? null,
      // "tenHang": this.bienBanNhapDayKho.tenHang ?? null,
      "tenHang": this.loaiStr,
      "thuKho": this.bienBanNhapDayKho.thuKho ?? null,
      "thuTruong": this.bienBanNhapDayKho.thuTruong ?? null,
      "qdgnvnxId": this.idNhapHang,
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
              trangThai: this.globals.prop.DU_THAO_TRINH_DUYET,
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
              trangThai: this.globals.prop.LANH_DAO_DUYET,
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
            trangThai: this.globals.prop.LANH_DAO_DUYET,
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

  banHanh() {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn ban hành?',
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
            trangThai: this.globals.prop.BAN_HANH,
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
            trangThai: this.globals.prop.TU_CHOI,
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

  thongTinTrangThai(trangThai: string): string {
    if (
      trangThai === this.globals.prop.DU_THAO ||
      trangThai === this.globals.prop.LANH_DAO_DUYET ||
      trangThai === this.globals.prop.TU_CHOI ||
      trangThai === this.globals.prop.DU_THAO_TRINH_DUYET
    ) {
      return 'du-thao-va-lanh-dao-duyet';
    } else if (trangThai === this.globals.prop.BAN_HANH) {
      return 'da-ban-hanh';
    }
  }

  disabledStartDate = (startValue: Date): boolean => {
    if (!startValue || !this.bienBanNhapDayKho.ngayKetThucNhap) {
      return false;
    }
    return startValue.getTime() > new Date(this.bienBanNhapDayKho.ngayKetThucNhap).getTime();
  };

  disabledEndDate = (endValue: Date): boolean => {
    if (!endValue || !this.bienBanNhapDayKho.ngayBatDauNhap) {
      return false;
    }
    return endValue.getTime() <= new Date(this.bienBanNhapDayKho.ngayBatDauNhap).getTime();
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
    this.bienBanNhapDayKho.chiTiets = [
      ...this.bienBanNhapDayKho.chiTiets,
      bbNhapDayKhoTemp,
    ];
    this.bienBanNhapDayKho.chiTiets.forEach((lt, i) => {
      lt.stt = i + 1;
    });
    this.newObjectBienBanNhapDayKho();
    this.dsBienBanNhapDayKhoDetailClone = cloneDeep(this.bienBanNhapDayKho.chiTiets);
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
        this.bienBanNhapDayKho.chiTiets =
          this.bienBanNhapDayKho?.chiTiets.filter(
            (khlt) => khlt.stt !== stt,
          );
        this.bienBanNhapDayKho?.chiTiets.forEach((lt, i) => {
          if (i >= stt - 1) {
            lt.stt = i + 1;
          }
        });
        this.dsBienBanNhapDayKhoDetailClone = cloneDeep(
          this.bienBanNhapDayKho.chiTiets,
        );
        // this.loadData();
      },
    });
  }

  saveEditBBDayKho(i: number): void {
    this.dsBienBanNhapDayKhoDetailClone[i].isEdit = false;
    Object.assign(
      this.bienBanNhapDayKho.chiTiets[i],
      this.dsBienBanNhapDayKhoDetailClone[i],
    );
  }

  cancelEditBBDayKho(index: number) {
    this.dsBienBanNhapDayKhoDetailClone = cloneDeep(this.bienBanNhapDayKho.chiTiets);
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
      .then((res) => {
        if (res.msg == MESSAGE.SUCCESS) {
          this.bienBanNhapDayKho = res.data;
          this.bienBanNhapDayKho.maDonVi = this.userInfo.MA_DVI;
          this.bienBanNhapDayKho.tenDonVi = this.userInfo.TEN_DVI;
          this.dsBienBanNhapDayKhoDetailClone = this.bienBanNhapDayKho?.chiTiets ?? [];
          this.bienBanNhapDayKho.maNhaKho = this.bienBanNhapDayKho.maDiemKho;
          if (this.bienBanNhapDayKho.trangThai === this.globals.prop.BAN_HANH) {
            this.viewChiTiet = true;
          }
        } else {
          this.notification.error(MESSAGE.ERROR, res.msg);
        }
      }).catch(err => {
        this.notification.error(MESSAGE.ERROR, err.msg);
      })
  }

  isAction(): boolean {
    return true;
  }

  deleteTaiLieuDinhKemTag(data: any) {
    if (!this.isView) {
      this.taiLieuDinhKemList = this.taiLieuDinhKemList.filter(
        (x) => x.id !== data.id,
      );
      this.bienBanNhapDayKho.fileDinhKems = this.bienBanNhapDayKho.fileDinhKems.filter((x) => x.idVirtual !== data.id);
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
            if (!this.bienBanNhapDayKho.fileDinhKems) {
              this.bienBanNhapDayKho.fileDinhKems = [];
            }
            const fileDinhKem = new FileDinhKem();
            fileDinhKem.fileName = resUpload.filename;
            fileDinhKem.fileSize = resUpload.size;
            fileDinhKem.fileUrl = resUpload.url;
            fileDinhKem.idVirtual = item.id;
            this.bienBanNhapDayKho.fileDinhKems.push(fileDinhKem);
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
        body.dataType = this.bienBanNhapDayKho.fileDinhKems[0].dataType;
        body.dataId = this.bienBanNhapDayKho.fileDinhKems[0].dataId;
        if (this.taiLieuDinhKemList.length > 0) {
          this.chiTieuKeHoachNamService.downloadFileKeHoach(body).subscribe((blob) => {
            saveAs(blob, this.bienBanNhapDayKho.fileDinhKems.length > 1 ? 'Tai-lieu-dinh-kem.zip' : this.bienBanNhapDayKho.fileDinhKems[0].fileName);
          });
        }
        break;
      default:
        break;
    }
  }
}
