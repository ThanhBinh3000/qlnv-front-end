import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogDanhSachHangHoaComponent } from 'src/app/components/dialog/dialog-danh-sach-hang-hoa/dialog-danh-sach-hang-hoa.component';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { UserLogin } from 'src/app/models/userlogin';
import { DonviService } from 'src/app/services/donvi.service';
import { QuanLyBienBanKetThucNhapKhoService } from 'src/app/services/quanLyBienBanKetThucNhapKho.service';
import { QuanLyPhieuKiemTraChatLuongHangService } from 'src/app/services/quanLyPhieuKiemTraChatLuongHang.service';
import { QuyetDinhGiaoNhapHangService } from 'src/app/services/quyetDinhGiaoNhapHang.service';
import { UserService } from 'src/app/services/user.service';
import { convertTienTobangChu } from 'src/app/shared/commonFunction';
import { Globals } from 'src/app/shared/globals';
import { BienBanKetThucNhapKho } from './../../../../../../models/BienBanKetThucNhapKho';
import { ThongTinHopDongService } from './../../../../../../services/thongTinHopDong.service';

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
  bienBanKetThucNhapKho: BienBanKetThucNhapKho = new BienBanKetThucNhapKho();
  viewChiTiet: boolean = false;
  isChiTiet: boolean = false;
  formData: FormGroup;
  listSoQuyetDinh: any[] = [];
  detailHopDong: any = {};
  detailGiaoNhap: any = {};

  constructor(
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    private modal: NzModalService,
    private userService: UserService,
    private quanLyPhieuKiemTraChatLuongHangService: QuanLyPhieuKiemTraChatLuongHangService,
    private donViService: DonviService,
    public globals: Globals,
    private quanLyPhieuKetThucNhapKhoService: QuanLyBienBanKetThucNhapKhoService,
    private quyetDinhGiaoNhapHangService: QuyetDinhGiaoNhapHangService,
    private thongTinHopDongService: ThongTinHopDongService,
    private fb: FormBuilder,
  ) { }

  async ngOnInit() {
    this.spinner.show();
    try {
      this.userInfo = this.userService.getUserLogin();
      this.bienBanKetThucNhapKho.maDvi = this.userInfo.MA_DVI;
      this.bienBanKetThucNhapKho.tenDvi = this.userInfo.TEN_DVI;
      this.initForm();
      await Promise.all([
        this.loadDiemKho(),
        this.loadPhieuKiemTraChatLuong(),
        this.loadSoQuyetDinh(),
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
      "trangThai": "",
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
  async changeSoQuyetDinh() {
    let quyetDinh = this.listSoQuyetDinh.filter(x => x.id == this.formData.get("soQD").value);
    this.formData.patchValue({
      qdgnvnxId: quyetDinh[0].id,
      tenHang: this.formData.get("tenVthh").value,
      chungLoaiHang: this.formData.get("tenCloaiVthh").value
    })
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
        this.detail.hopDongId = this.detailHopDong.id;
        this.detail.ngayHopDong = this.detailHopDong.ngayKy;
        this.detail.maHangHoa = this.detailHopDong.loaiVthh;
        this.detail.khoiLuongKiemTra = this.detailHopDong.soLuong;
        this.detail.maHangHoa = this.typeVthh;
      }
      else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
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

  redirectbienBanKetThucNhapKho() {
    this.showListEvent.emit();
  }

  disableBanHanh(): boolean {
    return (
      this.bienBanKetThucNhapKho.trangThai === this.globals.prop.DU_THAO ||
      this.id === 0 ||
      this.bienBanKetThucNhapKho.trangThai === this.globals.prop.TU_CHOI
    );
  }
  initForm() {
    this.formData = this.fb.group({
      soQD: [
        {
          value: this.bienBanKetThucNhapKho
            ? this.bienBanKetThucNhapKho.qdgnvnxId
            : null,
          disabled: this.isView ? true : false
        },
        [],
      ],
      donVi: [
        {
          value: this.userInfo.MA_DVI, disabled: true
        },
        [],
      ],
      maQHNS: [
        {
          value: this.userInfo.TEN_DVI, disabled: true
        },
        [],
      ],
      soBienBan: [
        {
          value: this.bienBanKetThucNhapKho
            ? this.bienBanKetThucNhapKho.soBienBan
            : null,
          disabled: this.isView ? true : false
        },
        [],
      ],

      ngayKetThucKho: [
        {
          value: this.bienBanKetThucNhapKho
            ? this.bienBanKetThucNhapKho.ngayKetThucKho
            : null,
          disabled: this.isView ? true : false
        },

        [],
      ],
      thuTruongDonVi: [
        {
          value: this.bienBanKetThucNhapKho
            ? this.bienBanKetThucNhapKho.thuTruongDonVi
            : null,
          disabled: this.isView ? true : false
        },

        [],
      ],
      keToanDonVi: [
        {
          value: this.bienBanKetThucNhapKho
            ? this.bienBanKetThucNhapKho.keToanDonVi
            : null,
          disabled: this.isView ? true : false
        },

        [],
      ],
      kyThuatVienBaoQuan: [
        {
          value: this.bienBanKetThucNhapKho
            ? this.bienBanKetThucNhapKho.kyThuatVien
            : null,
          disabled: this.isView ? true : false
        },

        [],
      ],
      thuKho: [
        {
          value: this.bienBanKetThucNhapKho
            ? this.bienBanKetThucNhapKho.thuKho
            : null, disabled: true
        },
        [],
      ],
      loaiHangHoa: [
        {
          value: this.bienBanKetThucNhapKho
            ? this.bienBanKetThucNhapKho.tenHang
            : null, disabled: true
        },
        [],
      ],
      chungLoaiHang: [
        {
          value: this.bienBanKetThucNhapKho
            ? this.bienBanKetThucNhapKho.chungLoaiHangHoa
            : null, disabled: true
        },
        [],
      ],
      diemKho: [
        {
          value: this.bienBanKetThucNhapKho
            ? this.bienBanKetThucNhapKho.maDiemKho
            : null,
          disabled: this.isView ? true : false
        },

        [],
      ],
      nhaKho: [
        {
          value: this.bienBanKetThucNhapKho
            ? this.bienBanKetThucNhapKho.maNhaKho
            : null, disabled: true
        },
        [],
      ],
      nganKho: [
        {
          value: this.bienBanKetThucNhapKho
            ? this.bienBanKetThucNhapKho.maNganKho
            : null,
          disabled: this.isView ? true : false
        },

        [],
      ],
      LoKho: [
        {
          value: this.bienBanKetThucNhapKho
            ? this.bienBanKetThucNhapKho.maNganLo
            : null,
          disabled: this.isView ? true : false
        },

        [],
      ],
      ngayBatDauNhap: [
        {
          value: this.bienBanKetThucNhapKho
            ? this.bienBanKetThucNhapKho.ngayBatDauNhap
            : null,
          disabled: this.isView ? true : false
        },

        [],
      ],
      ngayKetThucNhap: [
        {
          value: this.bienBanKetThucNhapKho
            ? this.bienBanKetThucNhapKho.ngayKetThucNhap
            : null,
          disabled: this.isView ? true : false
        },

        [],
      ],
      qdgnvnxId: [],
    });
  }
  save(isGuiDuyet?: boolean) {
    this.spinner.show();
    let body = {
      "bbChuanBiKhoId": 0,
      "capDvi": "string",
      "chiTiets": [
        {
          "bbKtNhapKhoId": 0,
          "donGia": 0,
          "ghiChu": "string",
          "id": 0,
          "soLuong": 0,
          "stt": 0,
          "thanhTien": 0
        }
      ],
      "fileDinhKemReqs": [
        {
          "dataId": 0,
          "fileName": "string",
          "fileSize": "string",
          "fileUrl": "string",
          "id": 0,
          "noiDung": "string"
        }
      ],
      "id": 0,
      "keToanDonVi": "string",
      "kyThuatVien": "string",
      "lyDoTuChoi": "string",
      "maDiemKho": "string",
      "maDvi": "string",
      "maNganKho": "string",
      "maNganLo": "string",
      "maNhaKho": "string",
      "maVatTu": "string",
      "maVatTuCha": "string",
      "nam": 0,
      "ngayBatDauNhap": "string",
      "ngayKetThucKho": "string",
      "ngayKetThucNhap": "string",
      "qdgnvnxId": 0,
      "so": 0,
      "soBienBan": "string",
      "thuKho": "string",
      "thuTruongDonVi": "string",
      "trangThai": "string"
    }
    if (this.id > 0) {
      this.quanLyPhieuKetThucNhapKhoService.sua(
        body,
      ).then((res) => {
        if (res.msg == MESSAGE.SUCCESS) {
          if (isGuiDuyet) {
            let body = {
              id: res.data.id,
              lyDo: null,
              trangThai: this.globals.prop.DU_THAO_TRINH_DUYET,
            };
            this.quanLyPhieuKetThucNhapKhoService.updateStatus(body);
            if (res.msg == MESSAGE.SUCCESS) {
              this.notification.success(
                MESSAGE.SUCCESS,
                MESSAGE.UPDATE_SUCCESS,
              );
              this.redirectbienBanKetThucNhapKho();
            } else {
              this.notification.error(MESSAGE.ERROR, res.msg);
            }
          } else {
            this.notification.success(
              MESSAGE.SUCCESS,
              MESSAGE.UPDATE_SUCCESS,
            );
            this.redirectbienBanKetThucNhapKho();
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
      this.quanLyPhieuKetThucNhapKhoService.them(
        body,
      ).then((res) => {
        if (res.msg == MESSAGE.SUCCESS) {
          if (isGuiDuyet) {
            let body = {
              id: res.data.id,
              lyDo: null,
              trangThai: this.globals.prop.LANH_DAO_DUYET,
            };
            this.quanLyPhieuKetThucNhapKhoService.updateStatus(body);
            if (res.msg == MESSAGE.SUCCESS) {
              this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
              this.redirectbienBanKetThucNhapKho();
            } else {
              this.notification.error(MESSAGE.ERROR, res.msg);
            }
          } else {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
            this.redirectbienBanKetThucNhapKho();
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
          const res = await this.quanLyPhieuKetThucNhapKhoService.updateStatus(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.APPROVE_SUCCESS);
            this.redirectbienBanKetThucNhapKho();
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
          const res = await this.quanLyPhieuKetThucNhapKhoService.updateStatus(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.APPROVE_SUCCESS);
            this.redirectbienBanKetThucNhapKho();
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
          const res = await this.quanLyPhieuKetThucNhapKhoService.updateStatus(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.TU_CHOI_SUCCESS);
            this.redirectbienBanKetThucNhapKho();
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
        this.redirectbienBanKetThucNhapKho();
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
    if (!startValue || !this.bienBanKetThucNhapKho.ngayKetThucNhap) {
      return false;
    }
    return startValue.getTime() > new Date(this.bienBanKetThucNhapKho.ngayKetThucNhap).getTime();
  };

  disabledEndDate = (endValue: Date): boolean => {
    if (!endValue || !this.bienBanKetThucNhapKho.ngayBatDauNhap) {
      return false;
    }
    return endValue.getTime() <= new Date(this.bienBanKetThucNhapKho.ngayBatDauNhap).getTime();
  };



  themmoi() {
    // if (this.bienBanKetThucNhapKhoDetailCreate.thanhTien == 0 || !this.bienBanKetThucNhapKhoDetailCreate.thanhTien) {
    //   return;
    // }
    // const bbNhapDayKhoTemp = new DetailbienBanKetThucNhapKho();
    // bbNhapDayKhoTemp.soLuong = this.bienBanKetThucNhapKhoDetailCreate.soLuong;
    // bbNhapDayKhoTemp.donGia = this.bienBanKetThucNhapKhoDetailCreate.donGia;
    // bbNhapDayKhoTemp.thanhTien = this.bienBanKetThucNhapKhoDetailCreate.thanhTien;
    // bbNhapDayKhoTemp.ghiChu = this.bienBanKetThucNhapKhoDetailCreate.ghiChu;
    // this.bienBanKetThucNhapKho.chiTiets = [
    //   ...this.bienBanKetThucNhapKho.chiTiets,
    //   bbNhapDayKhoTemp,
    // ];
    // this.bienBanKetThucNhapKho.chiTiets.forEach((lt, i) => {
    //   lt.stt = i + 1;
    // });
    // this.newObjectbienBanKetThucNhapKho();
    // this.dsbienBanKetThucNhapKhoDetailClone = cloneDeep(this.bienBanKetThucNhapKho.chiTiets);
  }

  clearNew() {
    this.newObjectbienBanKetThucNhapKho();
  }

  newObjectbienBanKetThucNhapKho() {
    // this.bienBanKetThucNhapKhoDetailCreate = new DetailbienBanKetThucNhapKho();
  }

  startEdit(index: number) {
    // this.dsbienBanKetThucNhapKhoDetailClone[index].isEdit = true;
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
        this.bienBanKetThucNhapKho.chiTiets =
          this.bienBanKetThucNhapKho?.chiTiets.filter(
            (khlt) => khlt.stt !== stt,
          );
        this.bienBanKetThucNhapKho?.chiTiets.forEach((lt, i) => {
          if (i >= stt - 1) {
            lt.stt = i + 1;
          }
        });
        // this.dsbienBanKetThucNhapKhoDetailClone = cloneDeep(
        //   this.bienBanKetThucNhapKho.chiTiets,
        // );
        // this.loadData();
      },
    });
  }

  saveEditBBDayKho(i: number): void {
    // this.dsbienBanKetThucNhapKhoDetailClone[i].isEdit = false;
    // Object.assign(
    //   this.bienBanKetThucNhapKho.chiTiets[i],
    //   this.dsbienBanKetThucNhapKhoDetailClone[i],
    // );
  }

  cancelEditBBDayKho(index: number) {
    // this.dsbienBanKetThucNhapKhoDetailClone = cloneDeep(this.bienBanKetThucNhapKho.chiTiets);
    // this.dsbienBanKetThucNhapKhoDetailClone[index].isEdit = false;
  }

  calculatorThanhTienEdit(i: number) {
    // this.dsbienBanKetThucNhapKhoDetailClone[i].thanhTien =
    //   +this.dsbienBanKetThucNhapKhoDetailClone[i].soLuong *
    //   +this.dsbienBanKetThucNhapKhoDetailClone[i].donGia;
    // return this.dsbienBanKetThucNhapKhoDetailClone[i].thanhTien
    //   ? Intl.NumberFormat('en-US').format(
    //     this.dsbienBanKetThucNhapKhoDetailClone[i].thanhTien,
    //   )
    //   : '0';
  }

  loadPhieuNhapDayKho() {
    this.quanLyPhieuKetThucNhapKhoService
      .loadChiTiet(this.id)
      .then((res) => {
        if (res.msg == MESSAGE.SUCCESS) {
          this.bienBanKetThucNhapKho = res.data;
          this.bienBanKetThucNhapKho.maDvi = this.userInfo.MA_DVI;
          this.bienBanKetThucNhapKho.tenDvi = this.userInfo.TEN_DVI;
          this.bienBanKetThucNhapKho.maNhaKho = this.bienBanKetThucNhapKho.maDiemKho;
          if (this.bienBanKetThucNhapKho.trangThai === this.globals.prop.BAN_HANH) {
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
    // if (!this.isView) {
    //   this.taiLieuDinhKemList = this.taiLieuDinhKemList.filter(
    //     (x) => x.id !== data.id,
    //   );
    //   this.bienBanKetThucNhapKho.fileDinhKems = this.bienBanKetThucNhapKho.fileDinhKems.filter((x) => x.idVirtual !== data.id);
    // }
  }

  // openFile(event) {
  //   if (!this.isView) {
  //     let item = {
  //       id: new Date().getTime(),
  //       text: event.name,
  //     };
  //     if (!this.taiLieuDinhKemList.find((x) => x.text === item.text)) {
  //       this.uploadFileService
  //         .uploadFile(event.file, event.name)
  //         .then((resUpload) => {
  //           if (!this.bienBanKetThucNhapKho.fileDinhKems) {
  //             this.bienBanKetThucNhapKho.fileDinhKems = [];
  //           }
  //           const fileDinhKem = new FileDinhKem();
  //           fileDinhKem.fileName = resUpload.filename;
  //           fileDinhKem.fileSize = resUpload.size;
  //           fileDinhKem.fileUrl = resUpload.url;
  //           fileDinhKem.idVirtual = item.id;
  //           this.bienBanKetThucNhapKho.fileDinhKems.push(fileDinhKem);
  //           this.taiLieuDinhKemList.push(item);
  //         });
  //     }
  //   }
  // }

  downloadFileKeHoach(event) {
    // let body = {
    //   "dataType": "",
    //   "dataId": 0
    // }
    // switch (event) {
    //   case 'tai-lieu-dinh-kem':
    //     body.dataType = this.bienBanKetThucNhapKho.fileDinhKems[0].dataType;
    //     body.dataId = this.bienBanKetThucNhapKho.fileDinhKems[0].dataId;
    //     if (this.taiLieuDinhKemList.length > 0) {
    //       this.chiTieuKeHoachNamService.downloadFileKeHoach(body).subscribe((blob) => {
    //         saveAs(blob, this.bienBanKetThucNhapKho.fileDinhKems.length > 1 ? 'Tai-lieu-dinh-kem.zip' : this.bienBanKetThucNhapKho.fileDinhKems[0].fileName);
    //       });
    //     }
    //     break;
    //   default:
    //     break;
    // }
  }

}
