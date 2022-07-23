import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import dayjs from 'dayjs';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { BienBanGuiHang, ChiTiet } from 'src/app/models/BienBanGuiHang';
import { QuyetDinhNhapXuat } from 'src/app/models/QuyetDinhNhapXuat';
import { UserLogin } from 'src/app/models/userlogin';
import { BienBanGuiHangService } from 'src/app/services/bienBanGuiHang.service';
import { PhieuNhapKhoTamGuiService } from 'src/app/services/phieuNhapKhoTamGui.service';
import { QuyetDinhGiaoNhapHangService } from 'src/app/services/quyetDinhGiaoNhapHang.service';
import { ThongTinHopDongService } from 'src/app/services/thongTinHopDong.service';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';
import { PhieuNhapKhoTamGui } from './../../../../../../models/PhieuNhapKhoTamGui';
@Component({
  selector: 'app-thong-tin-bien-ban-gui-hang',
  templateUrl: './thong-tin-bien-ban-gui-hang.component.html',
  styleUrls: ['./thong-tin-bien-ban-gui-hang.component.scss']
})
export class ThongTinBienBanGuiHangComponent implements OnInit {
  @Input() id: number;
  @Input() isView: boolean;
  @Input() typeVthh: string;
  @Output()
  showListEvent = new EventEmitter<any>();

  @ViewChild('endDatePicker') endDatePicker!: NzDatePickerComponent;
  userInfo: UserLogin;
  listSoQuyetDinh: any[] = [];

  bienBanGuiHang: BienBanGuiHang = new BienBanGuiHang();
  phieuNhapKhoTamGuis: Array<PhieuNhapKhoTamGui> = [];
  chiTietBienBanGuiHangBenGiao: ChiTiet = new ChiTiet();
  chiTietBienBanGuiHangBenNhan: ChiTiet = new ChiTiet();
  quyetDinhNhapHang: QuyetDinhNhapXuat = new QuyetDinhNhapXuat();
  hopDong: any = {};
  constructor(
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    private modal: NzModalService,
    private userService: UserService,
    private quyetDinhGiaoNhapHangService: QuyetDinhGiaoNhapHangService,
    private phieuNhapKhoTamGuiService: PhieuNhapKhoTamGuiService,
    public globals: Globals,
    private thongTinHopDongService: ThongTinHopDongService,
    private bienBanGuiHangService: BienBanGuiHangService,
  ) { }

  async ngOnInit() {
    this.spinner.show();
    try {

      this.userInfo = this.userService.getUserLogin();
      this.bienBanGuiHang.maDvi = this.userInfo.MA_DVI;
      await Promise.all([
        this.loadPhieuNhapKhoTamGui(),
        this.loadSoQuyetDinh(),
      ]);
      await this.loadChiTiet(this.id);
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
  async loadPhieuNhapKhoTamGui() {
    let body = {
      soPhieu: null,
      soQuyetDinh: null,
      ngayNhapKho: null,
      pageSize: 1000,
      pageNumber: 1,
      "trangThai": "02",
    };
    let res = await this.phieuNhapKhoTamGuiService.timKiem(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.phieuNhapKhoTamGuis = res.data.content;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async loadChiTiet(id) {
    if (id > 0) {
      let res = await this.bienBanGuiHangService.chiTiet(id);
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          this.bienBanGuiHang = res.data;
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
          await this.save(true);
          let body = {
            id: this.id,
            lyDoTuChoi: null,
            trangThai: '04',
          };
          let res =
            await this.bienBanGuiHangService.updateStatus(
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
            await this.bienBanGuiHangService.updateStatus(
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

  hoanThanh() {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn hoàn thành biên bản?',
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
            await this.bienBanGuiHangService.updateStatus(
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
            await this.bienBanGuiHangService.updateStatus(
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
        "benGiao": this.bienBanGuiHang.benGiao,
        "benNhan": this.bienBanGuiHang.benNhan,
        "capDvi": this.bienBanGuiHang.capDvi,
        "chatLuong": this.bienBanGuiHang.chatLuong,
        "chiTiets": this.bienBanGuiHang.chiTiets,
        "donViCungCap": this.bienBanGuiHang.donViCungCap,
        "donViTinh": this.bienBanGuiHang.donViTinh,
        "ghiChu": this.bienBanGuiHang.ghiChu,
        "hopDongId": this.bienBanGuiHang.hopDongId,
        "id": this.bienBanGuiHang.id,
        "loaiVthh": this.bienBanGuiHang.loaiVthh,
        "lyDoTuChoi": null,
        "maDvi": this.bienBanGuiHang.maDvi,
        "maVatTu": this.bienBanGuiHang.maVatTu,
        "maVatTuCha": this.bienBanGuiHang.maVatTuCha,
        "ngayGui": this.bienBanGuiHang.ngayGui,
        "ngayHopDong": this.bienBanGuiHang.ngayHopDong,
        "phieuNkTgId": this.bienBanGuiHang.phieuNkTgId,
        "qdgnvnxId": this.bienBanGuiHang.qdgnvnxId,
        "soBienBan": this.bienBanGuiHang.soBienBan,
        "soLuong": this.bienBanGuiHang.soLuong,
        "thoiGian": this.bienBanGuiHang.thoiGian,
        "tinhTrang": this.bienBanGuiHang.tinhTrang,
        "trachNhiemBenGiao": this.bienBanGuiHang.trachNhiemBenGiao,
        "trachNhiemBenNhan": this.bienBanGuiHang.trachNhiemBenNhan,
        "trangThai": this.bienBanGuiHang.trangThai
      };
      if (this.id > 0) {
        let res = await this.bienBanGuiHangService.chinhSua(
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
        let res = await this.bienBanGuiHangService.themMoi(
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
    if (
      trangThai === '00' ||
      trangThai === '01' ||
      trangThai === '04' ||
      trangThai === '03'
    ) {
      return 'du-thao-va-lanh-dao-duyet';
    } else if (trangThai === '02') {
      return 'da-ban-hanh';
    }
  }
  addDaiDien(bienBan: ChiTiet, type: string) {
    if ((type == '00' && (!this.chiTietBienBanGuiHangBenNhan.daiDien || !this.chiTietBienBanGuiHangBenNhan.chucVu))
      || (type == '01' && (!this.chiTietBienBanGuiHangBenGiao.daiDien || !this.chiTietBienBanGuiHangBenGiao.chucVu))) {
      return;
    }

    const chiTiet = new ChiTiet();
    chiTiet.idVirtual = new Date().getTime();
    chiTiet.loaiBen = type;
    chiTiet.chucVu = bienBan.chucVu;
    chiTiet.daiDien = bienBan.daiDien;
    this.bienBanGuiHang.chiTiets.push(chiTiet);
    this.clearDaiDien(type);
  }

  clearDaiDien(type: string) {
    if (type === '00') {
      this.chiTietBienBanGuiHangBenNhan = new ChiTiet();
    } else {
      this.chiTietBienBanGuiHangBenGiao = new ChiTiet();
    }
  }
  deleteBienBan(id: number) {
    this.bienBanGuiHang.chiTiets = this.bienBanGuiHang.chiTiets.filter(bienBan => bienBan.id !== id);
  }
  async changeSoQuyetDinh() {
    let quyetDinh = this.listSoQuyetDinh.filter(x => x.id == this.bienBanGuiHang.qdgnvnxId);
    console.log(quyetDinh);

    if (quyetDinh && quyetDinh.length > 0) {
      this.quyetDinhNhapHang = quyetDinh[0];
      await this.getHopDong(this.quyetDinhNhapHang.soHd);
    }
  }

  async getHopDong(id) {
    if (id) {
      let body = {
        "str": id
      }
      let res = await this.thongTinHopDongService.loadChiTietSoHopDong(body);
      if (res.msg == MESSAGE.SUCCESS) {
        this.hopDong = res.data;
        this.bienBanGuiHang.hopDongId = this.hopDong.id;
        this.bienBanGuiHang.ngayHopDong = this.hopDong.ngayKy;
        this.bienBanGuiHang.donViCungCap = this.hopDong.tenDvi;
        this.bienBanGuiHang.thoiGian = dayjs().format('YYYY-MM-DDTHH:mm:ss');
        this.bienBanGuiHang.ngayGui = dayjs().format('YYYY-MM-DD');
        this.bienBanGuiHang.maVatTuCha = this.hopDong.tenVthh;
        this.bienBanGuiHang.maVatTu = this.hopDong.tenCloaiVthh;
        this.bienBanGuiHang.soLuong = this.hopDong.soLuong;
        this.bienBanGuiHang.donViTinh = null;
        this.bienBanGuiHang.benGiao = this.hopDong.tenNguoiDdien;
        this.bienBanGuiHang.benNhan = this.userInfo.TEN_DVI;
      }
      else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }
  }
}
