import { cloneDeep } from 'lodash';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import dayjs from 'dayjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { KetQuaKiemNghiemChatLuongHang, PhieuKiemNghiemChatLuongHang } from 'src/app/models/PhieuKiemNghiemChatLuongThoc';
import { UserLogin } from 'src/app/models/userlogin';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { DanhSachDauThauService } from 'src/app/services/danhSachDauThau.service';
import { DonviService } from 'src/app/services/donvi.service';
import { QuanLyPhieuKiemNghiemChatLuongHangService } from 'src/app/services/quanLyPhieuKiemNghiemChatLuongHang.service';
import { TinhTrangKhoHienThoiService } from 'src/app/services/tinhTrangKhoHienThoi.service';
import { Globals } from 'src/app/shared/globals';
import { UserService } from 'src/app/services/user.service';
import { MESSAGE } from 'src/app/constants/message';

@Component({
  selector: 'them-moi-phieu-kiem-nghiem-chat-luong-thoc',
  templateUrl: './them-moi-phieu-kiem-nghiem-chat-luong-thoc.component.html',
  styleUrls: ['./them-moi-phieu-kiem-nghiem-chat-luong-thoc.component.scss'],
})
export class ThemMoiPhieuKiemNghiemChatLuongThocComponent implements OnInit {
  @Input() id: number;
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
  listHinhThucBaoQuan: any[] = [];
  listPhieuKiemTraChatLuong: any[] = [];

  phieuKiemNghiemChatLuongHang: PhieuKiemNghiemChatLuongHang = new PhieuKiemNghiemChatLuongHang();
  viewChiTiet: boolean = false;
  ketQuaKiemNghiemHangCreate: KetQuaKiemNghiemChatLuongHang = new KetQuaKiemNghiemChatLuongHang();
  dsKetQuaKiemNghiemHangClone: Array<KetQuaKiemNghiemChatLuongHang> = [];
  isChiTiet: boolean = false;
  listTieuChuan: any[] = [];
  constructor(
    private spinner: NgxSpinnerService,
    private donViService: DonviService,
    private danhSachDauThauService: DanhSachDauThauService,
    private phieuKiemNghiemChatLuongHangService: QuanLyPhieuKiemNghiemChatLuongHangService,
    private notification: NzNotificationService,
    private router: Router,
    private modal: NzModalService,
    public globals: Globals,
    private routerActive: ActivatedRoute,
    private userService: UserService,
    private tinhTrangKhoHienThoiService: TinhTrangKhoHienThoiService,
    private danhMucService: DanhMucService,
  ) { }

  async ngOnInit() {
    this.spinner.show();
    try {
      this.getTitleVthh();
      this.checkIsView();
      this.id = +this.routerActive.snapshot.paramMap.get('id');
      this.userInfo = this.userService.getUserLogin();
      this.phieuKiemNghiemChatLuongHang.maDonVi = this.userInfo.MA_DVI;
      this.phieuKiemNghiemChatLuongHang.tenDonVi = this.userInfo.TEN_DVI;
      await Promise.all([
        // this.getIdNhap(),
        this.loadDiemKho(),
        this.loadNganKho(),
        this.loadNganLo(),
        this.loadDanhMucPhuongThucBaoQuan(),
        this.loadTieuChuan(),
        // this.loadPhieuKiemTraChatLuong(),
      ]);
      if (this.id > 0) {
        this.loadPhieuKiemNghiemChatLuong();
      }
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }

  }
  checkIsView() {
    this.viewChiTiet = false;
    if (this.router.url && this.router.url != null) {
      let index = this.router.url.indexOf("/xem-chi-tiet/");
      if (index != -1) {
        this.viewChiTiet = true;
      }
    }
  }
  newObjectBienBanLayMau() {
    this.phieuKiemNghiemChatLuongHang = new PhieuKiemNghiemChatLuongHang();
  }
  disableBanHanh(): boolean {
    return (
      this.phieuKiemNghiemChatLuongHang.trangThai === this.globals.prop.DU_THAO ||
      this.id === 0 ||
      this.phieuKiemNghiemChatLuongHang.trangThai === this.globals.prop.TU_CHOI
    );
  }
  save(isGuiDuyet?: boolean) {
    this.spinner.show();
    let body = {
      "kquaKnghiem": this.phieuKiemNghiemChatLuongHang.kquaKnghiem ?? [],
      "chiSoChatLuong": this.phieuKiemNghiemChatLuongHang.chiSoChatLuong ?? null,
      "ddiemBquan": this.phieuKiemNghiemChatLuongHang.ddiemBquan ?? null,
      "diemKhoId": this.phieuKiemNghiemChatLuongHang.diemKhoId ?? null,
      "hthucBquan": this.phieuKiemNghiemChatLuongHang.hthucBquan ?? null,
      "id": this.phieuKiemNghiemChatLuongHang.id ?? null,
      "maDiemKho": this.phieuKiemNghiemChatLuongHang.maDiemKho ?? null,
      "maHhoa": this.phieuKiemNghiemChatLuongHang.maHhoa ?? null,
      "maNganLo": this.phieuKiemNghiemChatLuongHang.maNganLo ?? null,
      "maNhaKho": this.phieuKiemNghiemChatLuongHang.maNhaKho ?? null,
      "nganLoId": this.phieuKiemNghiemChatLuongHang.nganLoId ?? null,
      "ngayKnghiem": this.phieuKiemNghiemChatLuongHang.ngayKnghiem ?
        dayjs(this.phieuKiemNghiemChatLuongHang.ngayKnghiem).format('YYYY-MM-DD') : null,
      "ngayLayMau": this.phieuKiemNghiemChatLuongHang.ngayLayMau ?
        dayjs(this.phieuKiemNghiemChatLuongHang.ngayLayMau).format('YYYY-MM-DD') : null,
      "ngayNhapDay": this.phieuKiemNghiemChatLuongHang.ngayNhapDay ?
        dayjs(this.phieuKiemNghiemChatLuongHang.ngayNhapDay).format('YYYY-MM-DD') : null,
      "nhaKhoId": this.phieuKiemNghiemChatLuongHang.nhaKhoId ?? null,
      "sluongBquan": this.phieuKiemNghiemChatLuongHang.sluongBquan ?? null,
      "soBbanKthucNhap": this.phieuKiemNghiemChatLuongHang.soBbanKthucNhap ?? null,
      "soPhieu": this.phieuKiemNghiemChatLuongHang.soPhieu ?? null,
      "tenDiemKho": this.phieuKiemNghiemChatLuongHang.tenDiemKho ?? null,
      "tenHhoa": this.phieuKiemNghiemChatLuongHang.tenHhoa ?? null,
      "tenNganLo": this.phieuKiemNghiemChatLuongHang.tenNganLo ?? null,
      "tenNhaKho": this.phieuKiemNghiemChatLuongHang.tenNhaKho ?? null,
      "thuKho": this.phieuKiemNghiemChatLuongHang.thuKho ?? null,
      "trangThai": this.phieuKiemNghiemChatLuongHang.trangThai ?? null,
      "qdgnvnxId": this.idNhapHang,
      "ketLuan": this.phieuKiemNghiemChatLuongHang.ketLuan ?? null,
      "ketQuaDanhGia": this.phieuKiemNghiemChatLuongHang.ketQuaDanhGia ?? null,
    }
    if (this.id > 0) {
      this.phieuKiemNghiemChatLuongHangService.sua(
        body,
      ).then((res) => {
        if (res.msg == MESSAGE.SUCCESS) {
          if (isGuiDuyet) {
            let body = {
              id: res.data.id,
              lyDo: null,
              trangThai: this.globals.prop.DU_THAO_TRINH_DUYET,
            };
            this.phieuKiemNghiemChatLuongHangService.updateStatus(body);
            if (res.msg == MESSAGE.SUCCESS) {
              this.notification.success(
                MESSAGE.SUCCESS,
                MESSAGE.UPDATE_SUCCESS,
              );
              this.redirectPhieuKiemNghiemChatLuongHang();
            } else {
              this.notification.error(MESSAGE.ERROR, res.msg);
            }
          } else {
            this.notification.success(
              MESSAGE.SUCCESS,
              MESSAGE.UPDATE_SUCCESS,
            );
            this.redirectPhieuKiemNghiemChatLuongHang();
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
      this.phieuKiemNghiemChatLuongHangService.them(
        body,
      ).then((res) => {
        if (res.msg == MESSAGE.SUCCESS) {
          if (isGuiDuyet) {
            let body = {
              id: res.data.id,
              lyDo: null,
              trangThai: this.globals.prop.LANH_DAO_DUYET,
            };
            this.phieuKiemNghiemChatLuongHangService.updateStatus(body);
            if (res.msg == MESSAGE.SUCCESS) {
              this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
              this.redirectPhieuKiemNghiemChatLuongHang();
            } else {
              this.notification.error(MESSAGE.ERROR, res.msg);
            }
          } else {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
            this.redirectPhieuKiemNghiemChatLuongHang();
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

  getIdNhap() {
    if (this.router.url && this.router.url != null) {
      let index = this.router.url.indexOf("/chi-tiet/");
      if (index != -1) {
        let url = this.router.url.substring(index + 10);
        let temp = url.split("/");
        if (temp && temp.length > 0) {
          this.idNhapHang = +temp[0];
        }
      }
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
          const res = await this.phieuKiemNghiemChatLuongHangService.updateStatus(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.APPROVE_SUCCESS);
            this.redirectPhieuKiemNghiemChatLuongHang();
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
            lyDo: null,
            trangThai: this.globals.prop.BAN_HANH,
          };
          const res = await this.phieuKiemNghiemChatLuongHangService.updateStatus(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.APPROVE_SUCCESS);
            this.redirectPhieuKiemNghiemChatLuongHang();
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
          const res = await this.phieuKiemNghiemChatLuongHangService.updateStatus(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.TU_CHOI_SUCCESS);
            this.redirectPhieuKiemNghiemChatLuongHang();
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
        this.redirectPhieuKiemNghiemChatLuongHang();
      },
    });
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

  async changeDiemKho() {
    let diemKho = this.listDiemKho.filter(x => x.maDiemkho == this.phieuKiemNghiemChatLuongHang.maDiemKho);
    this.phieuKiemNghiemChatLuongHang.maNhaKho = null;
    if (diemKho && diemKho.length > 0) {
      await this.loadNhaKho(diemKho[0].id);
    }
  }
  async loadNhaKho(diemKhoId: any) {
    if (diemKhoId && diemKhoId > 0) {
      let body = {
        "diemKhoId": diemKhoId,
        "maNhaKho": null,
        "paggingReq": {
          "limit": 1000,
          "page": 1
        },
        "str": null,
        "tenNhaKho": null,
        "trangThai": null
      };
      let res = await this.tinhTrangKhoHienThoiService.nhaKhoGetList(body);
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data && res.data.content) {
          this.listNhaKho = res.data.content;
          console.log("this.listNhaKho: ", this.listNhaKho);

        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
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
  async loadDanhMucPhuongThucBaoQuan() {
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

  redirectPhieuKiemNghiemChatLuongHang() {
    // if (this.router.url && this.router.url != null) {
    //   let index = this.router.url.indexOf("/thong-tin/");
    //   if (index != -1) {
    //     let url = this.router.url.substring(0, index);
    //     this.router.navigate([url]);
    //   }
    // }
    this.showListEvent.emit();
  }
  themmoi() {
    if (!this.ketQuaKiemNghiemHangCreate.tenCtieu) {
      return;
    }
    const kqKiemNghiemChatLuongHangTemp = new KetQuaKiemNghiemChatLuongHang();
    kqKiemNghiemChatLuongHangTemp.chiSoChatLuong = this.ketQuaKiemNghiemHangCreate.chiSoChatLuong;
    kqKiemNghiemChatLuongHangTemp.tenCtieu = this.ketQuaKiemNghiemHangCreate.tenCtieu;
    kqKiemNghiemChatLuongHangTemp.kquaKtra = this.ketQuaKiemNghiemHangCreate.kquaKtra;
    kqKiemNghiemChatLuongHangTemp.pphapXdinh = this.ketQuaKiemNghiemHangCreate.pphapXdinh;
    this.checkDataExistKqKiemNghiemChatLuong(kqKiemNghiemChatLuongHangTemp);
    this.newObjectPhieuKiemNghiem();
    this.dsKetQuaKiemNghiemHangClone = cloneDeep(this.phieuKiemNghiemChatLuongHang.kquaKnghiem);
  }

  checkDataExistKqKiemNghiemChatLuong(kqKiemNghiemChatLuong: KetQuaKiemNghiemChatLuongHang) {
    console.log(this.phieuKiemNghiemChatLuongHang.kquaKnghiem);
    console.log(kqKiemNghiemChatLuong);

    if (this.phieuKiemNghiemChatLuongHang.kquaKnghiem) {
      let indexExist = this.phieuKiemNghiemChatLuongHang.kquaKnghiem.findIndex(
        (x) => x.tenCtieu == kqKiemNghiemChatLuong.tenCtieu,
      );
      if (indexExist != -1) {
        this.phieuKiemNghiemChatLuongHang.kquaKnghiem.splice(indexExist, 1);
      }
    } else {
      this.phieuKiemNghiemChatLuongHang.kquaKnghiem = [];
    }
    this.phieuKiemNghiemChatLuongHang.kquaKnghiem = [
      ...this.phieuKiemNghiemChatLuongHang.kquaKnghiem,
      kqKiemNghiemChatLuong,
    ];
    this.phieuKiemNghiemChatLuongHang.kquaKnghiem.forEach((lt, i) => {
      lt.stt = i + 1;
    });

  }

  clearNew() {
    this.newObjectPhieuKiemNghiem();
  }
  newObjectPhieuKiemNghiem() {
    this.ketQuaKiemNghiemHangCreate = new KetQuaKiemNghiemChatLuongHang();
  }
  changeChiTieu(item) {
    if (item) {
      let getChiTieu = this.listTieuChuan.filter(x => x.tenTchuan == item.tenCtieu);
      if (getChiTieu && getChiTieu.length > 0) {
        this.ketQuaKiemNghiemHangCreate.chiSoChatLuong = getChiTieu[0].chiSoNhap;
        this.ketQuaKiemNghiemHangCreate.pphapXdinh = getChiTieu[0].phuongPhap;
      }
    }
  }
  async loadTieuChuan() {
    let body = {
      "maHang": this.maVthh,
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
  startEdit(index: number) {
    this.dsKetQuaKiemNghiemHangClone[index].isEdit = true;
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
        this.phieuKiemNghiemChatLuongHang.kquaKnghiem =
          this.phieuKiemNghiemChatLuongHang?.kquaKnghiem.filter(
            (khlt) => khlt.stt !== stt,
          );
        this.phieuKiemNghiemChatLuongHang?.kquaKnghiem.forEach((lt, i) => {
          if (i >= stt - 1) {
            lt.stt = i + 1;
          }
        });
        this.dsKetQuaKiemNghiemHangClone = cloneDeep(
          this.phieuKiemNghiemChatLuongHang.kquaKnghiem,
        );
        // this.loadData();
      },
    });
  }
  saveEditPhieuKiemNghiem(i: number): void {
    this.dsKetQuaKiemNghiemHangClone[i].isEdit = false;
    Object.assign(
      this.phieuKiemNghiemChatLuongHang.kquaKnghiem[i],
      this.dsKetQuaKiemNghiemHangClone[i],
    );
  }
  cancelEditPhieuKiemNghiem(index: number) {
    this.dsKetQuaKiemNghiemHangClone = cloneDeep(this.phieuKiemNghiemChatLuongHang.kquaKnghiem);
    this.dsKetQuaKiemNghiemHangClone[index].isEdit = false;
  }
  loadPhieuKiemNghiemChatLuong() {
    this.phieuKiemNghiemChatLuongHangService
      .chiTiet(this.id)
      .then((res) => {
        if (res.msg == MESSAGE.SUCCESS) {
          this.phieuKiemNghiemChatLuongHang.kquaKnghiem = [];
          this.phieuKiemNghiemChatLuongHang = res.data;
          this.phieuKiemNghiemChatLuongHang.maDonVi = this.userInfo.MA_DVI;
          this.phieuKiemNghiemChatLuongHang.tenDonVi = this.userInfo.TEN_DVI;

          this.dsKetQuaKiemNghiemHangClone = this.phieuKiemNghiemChatLuongHang?.kquaKnghiem ?? [];
          this.changeDiemKho();
        } else {
          this.notification.error(MESSAGE.ERROR, res.msg);
        }
      }).catch(err => {
        this.notification.error(MESSAGE.ERROR, err.msg);
      })
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
}
