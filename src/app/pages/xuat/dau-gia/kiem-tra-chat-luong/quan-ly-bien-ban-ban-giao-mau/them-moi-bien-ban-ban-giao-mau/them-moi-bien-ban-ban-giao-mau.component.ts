import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import dayjs from 'dayjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { BienBanLayMau } from 'src/app/models/BienBanLayMau';
import { PhuongPhapLayMau } from 'src/app/models/PhuongPhapLayMau';
import { UserLogin } from 'src/app/models/userlogin';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { QuanLyBienBanBanGiaoService } from 'src/app/services/quanLyBienBanBanGiao.service';
import { QuanLyBienBanLayMauService } from 'src/app/services/quanLyBienBanLayMau.service';
import { QuanLyPhieuNhapDayKhoService } from 'src/app/services/quanLyPhieuNhapDayKho.service';
import { QuyetDinhGiaoNhapHangService } from 'src/app/services/quyetDinhGiaoNhapHang.service';
import { ThongTinHopDongService } from 'src/app/services/thongTinHopDong.service';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';


@Component({
  selector: 'them-moi-bien-ban-ban-giao-mau',
  templateUrl: './them-moi-bien-ban-ban-giao-mau.component.html',
  styleUrls: ['./them-moi-bien-ban-ban-giao-mau.component.scss'],
})
export class ThemMoiBienBanBanGiaoMauComponent implements OnInit {

date:null


  @Input() id: number;
  @Input() isView: boolean;
  @Input() isTatCa: boolean;
  @Input() typeVthh: string;

  @Output()
  showListEvent = new EventEmitter<any>();

  bienBanLayMau: any;
  routerUrl: string;
  userInfo: UserLogin;
  detailHopDong: any = {};
  detailGiaoNhap: any = {};
  maVthh: string;
  phuongPhapLayMaus: Array<PhuongPhapLayMau>;
  listSoQuyetDinh: any[] = [];
  listBienBanLayMau: any[] = [];

  capCuc: string = '2';
  capChiCuc: string = '3';
  listDaiDienCuc: any[] = [];
  listDaiDienChiCuc: any[] = [];
  listHangHoa: any[] = [];
  listDaiDien: any[] = [
    {
      "bbLayMauId": null,
      "daiDien": null,
      "id": null,
      "idTemp": 1,
      "loaiDaiDien": '2'
    },
    {
      "bbLayMauId": null,
      "daiDien": null,
      "id": null,
      "idTemp": 1,
      "loaiDaiDien": '3'
    }
  ];

  constructor(
    private spinner: NgxSpinnerService,
    private quanLyBienBanBanGiaoService: QuanLyBienBanBanGiaoService,
    private notification: NzNotificationService,
    private router: Router,
    private modal: NzModalService,
    public globals: Globals,
    private routerActive: ActivatedRoute,
    private userService: UserService,
    private thongTinHopDongService: ThongTinHopDongService,
    private quyetDinhGiaoNhapHangService: QuyetDinhGiaoNhapHangService,
    private danhMucService: DanhMucService,
    private quanLyPhieuNhapDayKhoService: QuanLyPhieuNhapDayKhoService,
    private bienBanLayMauService: QuanLyBienBanLayMauService,
  ) { }

  async ngOnInit() {
    this.routerUrl = this.router.url;
    this.userInfo = this.userService.getUserLogin();
    this.newObjectBienBanLayMau();
    this.bienBanLayMau.maDvi = this.userInfo.MA_DVI;
    this.bienBanLayMau.tenDvi = this.userInfo.TEN_DVI;
    this.bienBanLayMau.maVatTuCha = this.isTatCa ? null : this.typeVthh;
    this.bienBanLayMau.trangThai = this.globals.prop.DU_THAO;

    await Promise.all([
      this.loadSoQuyetDinh(),
      this.loaiVTHHGetAll(),
      this.loadBienbanLayMau(),
    ]);
    if (this.id > 0) {
      await this.loadDetail();
    }
    else {
      this.loadDaiDien();
    }
  }

  async loadBienbanLayMau() {
    let param = {
      "capDvis": this.userService.isCuc() ? '2,3' : null,
      "maDvi": this.userInfo.MA_DVI,
      "maVatTuCha": this.isTatCa ? null : this.typeVthh,
      "pageNumber": 1,
      "pageSize": 1000,
    }
    let res = await this.bienBanLayMauService.timKiem(param);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.listBienBanLayMau = data.content;
    console.log(this.bienBanLayMau);

    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async loaiVTHHGetAll() {
    let res = await this.danhMucService.loaiVatTuHangHoaGetAll();
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data && res.data.length > 0) {
        if (this.isTatCa) {
          this.listHangHoa = res.data;
          this.bienBanLayMau.maVatTuCha = this.listHangHoa[0].ma;
        }
        else {
          this.listHangHoa = res.data.filter(x => x.ma == this.typeVthh);
        }
      }
    }
  }

  loadDaiDien() {
    if (this.listDaiDien && this.listDaiDien.length > 0) {
      this.listDaiDienCuc = this.listDaiDien.filter(x => x.loaiDaiDien == this.capCuc);
      this.listDaiDienChiCuc = this.listDaiDien.filter(x => x.loaiDaiDien == this.capChiCuc);
    }
  }

  changeBienBanMau() {
    let layMau = this.listBienBanLayMau.filter(x => x.id == this.bienBanLayMau.bbLayMauId);
    if (layMau && layMau.length > 0) {
      this.bienBanLayMau.soLuongMau = layMau[0].soLuongMau;
      this.bienBanLayMau.chiTieuKiemTra = layMau[0].chiTieuKiemTra;
    }
    if (this.listDaiDien && this.listDaiDien.length > 0) {
      this.listDaiDien.forEach((item) => {
        item.bbLayMauId = this.bienBanLayMau.bbLayMauId;
      });
      this.loadDaiDien();
    }
  }

  addDaiDien(type) {
    if (!this.listDaiDien) {
      this.listDaiDien = [];
    }
    let item = {
      "bbLayMauId": this.bienBanLayMau.bbLayMauId,
      "daiDien": null,
      "id": null,
      "idTemp": new Date().getTime(),
      "loaiDaiDien": type
    }
    this.listDaiDien.push(item);
    this.loadDaiDien();
  }

  xoaDaiDien(item) {
    this.listDaiDien = this.listDaiDien.filter(x => x.idTemp != item.idTemp);
    this.loadDaiDien();
  }

  async loadSoQuyetDinh() {
    let body = {
      "denNgayQd": null,
      "loaiQd": "",
      "maDvi": this.userInfo.MA_DVI,
      "maVthh": this.bienBanLayMau.maVatTuCha,
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
      "trangThai": "02",
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
    let quyetDinh = this.listSoQuyetDinh.filter(x => x.id == this.bienBanLayMau.qdgnvnxId);
    if (quyetDinh && quyetDinh.length > 0) {
      this.detailGiaoNhap = quyetDinh[0];
      // await this.getHopDong(this.detailGiaoNhap.soHd);
    }
  }

  newObjectBienBanLayMau() {
    this.bienBanLayMau = new BienBanLayMau();
  }

  isAction(): boolean {
    if (this.bienBanLayMau.trangThai === this.globals.prop.DU_THAO && !this.isView) {
      return true;
    }
    return false;
  }

  save(isGuiDuyet?: boolean) {
    this.spinner.show();
    let body = {
      "bbLayMauId": this.bienBanLayMau.bbLayMauId,
      "chiTiets": this.listDaiDien,
      "chiTieuKiemTra": this.bienBanLayMau.chiTieuKiemTra,
      "id": this.id,
      "maVatTu": null,
      "maVatTuCha": this.bienBanLayMau.maVatTuCha,
      "ngayBanGiaoMau": this.bienBanLayMau.ngayBanGiaoMau ? dayjs(this.bienBanLayMau.ngayBanGiaoMau).format('YYYY-MM-DD') : null,
      "qdgnvnxId": this.bienBanLayMau.qdgnvnxId,
      "soBienBan": this.bienBanLayMau.soBienBan,
      "soLuongMau": this.bienBanLayMau.soLuongMau,
      "tenDviBenNhan": this.bienBanLayMau.tenDviBenNhan,
      "ttNiemPhongMauHang": this.bienBanLayMau.ttNiemPhongMauHang,
    }
    if (this.id > 0) {
      this.quanLyBienBanBanGiaoService.sua(body).then((res) => {
        if (res.msg == MESSAGE.SUCCESS) {
          if (isGuiDuyet) {
            let body = {
              id: res.data.id,
              lyDo: null,
              trangThai: this.globals.prop.DU_THAO_TRINH_DUYET,
            };
            this.quanLyBienBanBanGiaoService.updateStatus(body);
            if (res.msg == MESSAGE.SUCCESS) {
              this.notification.success(
                MESSAGE.SUCCESS,
                MESSAGE.UPDATE_SUCCESS,
              );
              this.redirectBienBanLayMau();
            } else {
              this.notification.error(MESSAGE.ERROR, res.msg);
            }
          } else {
            this.notification.success(
              MESSAGE.SUCCESS,
              MESSAGE.UPDATE_SUCCESS,
            );
            this.redirectBienBanLayMau();
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
      this.quanLyBienBanBanGiaoService.them(body).then((res) => {
        if (res.msg == MESSAGE.SUCCESS) {
          if (isGuiDuyet) {
            let body = {
              id: res.data.id,
              lyDo: null,
              trangThai: this.globals.prop.LANH_DAO_DUYET,
            };
            this.quanLyBienBanBanGiaoService.updateStatus(body);
            if (res.msg == MESSAGE.SUCCESS) {
              this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
              this.redirectBienBanLayMau();
            } else {
              this.notification.error(MESSAGE.ERROR, res.msg);
            }
          } else {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
            this.redirectBienBanLayMau();
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
          const res = await this.quanLyBienBanBanGiaoService.updateStatus(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.APPROVE_SUCCESS);
            this.redirectBienBanLayMau();
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
          const res = await this.quanLyBienBanBanGiaoService.updateStatus(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.APPROVE_SUCCESS);
            this.redirectBienBanLayMau();
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
          const res = await this.quanLyBienBanBanGiaoService.updateStatus(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.TU_CHOI_SUCCESS);
            this.redirectBienBanLayMau();
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
        this.redirectBienBanLayMau();
      },
    });
  }

  redirectBienBanLayMau() {
    this.showListEvent.emit();
  };

  async getHopDong(id) {
    if (id) {
      const body = {
        str: id
      }
      let res = await this.thongTinHopDongService.loadChiTietSoHopDong(body);

      if (res.msg == MESSAGE.SUCCESS) {
        this.detailHopDong = res.data;
        this.bienBanLayMau.canCu = this.detailHopDong.canCu;
        this.bienBanLayMau.ngayHopDong = this.detailHopDong.ngayKy;
        this.bienBanLayMau.hopDongId = this.detailHopDong.id;
        this.bienBanLayMau.soHopDong = this.detailHopDong.soHd;
        this.bienBanLayMau.tenDonViCCHang = this.detailHopDong.tenDvi;
        this.bienBanLayMau.soLuongMau = this.detailHopDong.soLuong;
      }
      else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }
  }

  async loadDetail() {
    let res = await this.quanLyBienBanBanGiaoService.loadChiTiet(this.id);
    if (res.msg == MESSAGE.SUCCESS) {
      this.bienBanLayMau = res.data;
      this.bienBanLayMau.ppLayMau = +res.data.ppLayMau;
      if (this.bienBanLayMau.chiTiets && this.bienBanLayMau.chiTiets.length > 0) {
        this.listDaiDien = [];
        this.bienBanLayMau.chiTiets.forEach((element, index) => {
          let item = {
            ...element,
            "idTemp": new Date().getTime() + index,
          }
          this.listDaiDien.push(item);
        });
        this.loadDaiDien();
      }
      await this.loadSoQuyetDinh();
    }
    else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  thongTinTrangThai(trangThai: string): string {
    trangThai =this.globals.prop.BAN_HANH
    if (
      trangThai === this.globals.prop.DU_THAO ||
      trangThai === this.globals.prop.LANH_DAO_DUYET ||
      trangThai === this.globals.prop.TU_CHOI ||
      trangThai === this.globals.prop.DU_THAO_TRINH_DUYET
      || !trangThai
    ) {
      return 'du-thao-va-lanh-dao-duyet';
    } else if (trangThai === this.globals.prop.BAN_HANH) {
      return 'da-ban-hanh';
    }
  }
}
