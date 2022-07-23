import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as dayjs from 'dayjs';
import { cloneDeep, isEmpty } from 'lodash';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import {
  KetQuaKiemNghiemChatLuongHang,
  PhieuKiemNghiemChatLuongHang,
} from 'src/app/models/PhieuKiemNghiemChatLuongThoc';
import { UserLogin } from 'src/app/models/userlogin';
import { DANH_MUC_LEVEL } from 'src/app/pages/luu-kho/luu-kho.constant';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { DonviService } from 'src/app/services/donvi.service';
import { QuanLyBienBanBanGiaoService } from 'src/app/services/quanLyBienBanBanGiao.service';
import { QuanLyBienBanLayMauService } from 'src/app/services/quanLyBienBanLayMau.service';
import { QuanLyPhieuKiemNghiemChatLuongHangService } from 'src/app/services/quanLyPhieuKiemNghiemChatLuongHang.service';
import { QuanLyPhieuNhapDayKhoService } from 'src/app/services/quanLyPhieuNhapDayKho.service';
import { QuyetDinhGiaoNhapHangService } from 'src/app/services/quyetDinhGiaoNhapHang.service';
import { TinhTrangKhoHienThoiService } from 'src/app/services/tinhTrangKhoHienThoi.service';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';

@Component({
  selector: 'app-them-moi-phieu-kiem-nghiem-chat-luong',
  templateUrl: './them-moi-phieu-kiem-nghiem-chat-luong.component.html',
  styleUrls: ['./them-moi-phieu-kiem-nghiem-chat-luong.component.scss'],
})
export class ThemMoiPhieuKiemNghiemChatLuongComponent implements OnInit {
  @Input() id: number;
  @Input() typeVthh: string;
  @Input() isView: boolean;

  @Output()
  showListEvent = new EventEmitter<any>();
  userInfo: UserLogin;
  detail: any = {};
  idNhapHang: number = 0;

  loaiVthh: string;
  loaiStr: string;
  maVthh: string;
  routerVthh: string;
  dsTong: any = {};
  listDiemKho: any[] = [];
  listNhaKho: any[] = [];
  listNganKho: any[] = [];
  listNganLo: any[] = [];
  listHinhThucBaoQuan: any[] = [];
  listPhieuKiemTraChatLuong: any[] = [];
  listSoQuyetDinh = [];
  listBbBanGiaoMau = [];

  phieuKiemNghiemChatLuongHang: PhieuKiemNghiemChatLuongHang =
    new PhieuKiemNghiemChatLuongHang();
  viewChiTiet: boolean = false;
  ketQuaKiemNghiemHangCreate: KetQuaKiemNghiemChatLuongHang =
    new KetQuaKiemNghiemChatLuongHang();
  dsKetQuaKiemNghiemHangClone: Array<KetQuaKiemNghiemChatLuongHang> = [];
  isChiTiet: boolean = false;
  listTieuChuan: any[] = [];
  isValid = false;
  constructor(
    private spinner: NgxSpinnerService,
    private donViService: DonviService,
    private phieuKiemNghiemChatLuongHangService: QuanLyPhieuKiemNghiemChatLuongHangService,
    private notification: NzNotificationService,
    private router: Router,
    private modal: NzModalService,
    public globals: Globals,
    private routerActive: ActivatedRoute,
    private userService: UserService,
    private tinhTrangKhoHienThoiService: TinhTrangKhoHienThoiService,
    private danhMucService: DanhMucService,
    private quyetDinhGiaoNhapHangService: QuyetDinhGiaoNhapHangService,
    private quanLyBienBanBanGiaoService: QuanLyBienBanBanGiaoService,
    private quanLyBienBanLayMauService: QuanLyBienBanLayMauService,
    private quanLyPhieuNhapDayKhoService: QuanLyPhieuNhapDayKhoService,
  ) { }

  async ngOnInit() {
    this.spinner.show();
    try {
      this.getTitleVthh();
      this.userInfo = this.userService.getUserLogin();
      this.phieuKiemNghiemChatLuongHang.maDonVi = this.userInfo.MA_DVI;
      this.phieuKiemNghiemChatLuongHang.tenDonVi = this.userInfo.TEN_DVI;
      await Promise.all([
        this.loadDiemKho(),
        this.loadDanhMucPhuongThucBaoQuan(),
        this.loadTieuChuan(),
        this.loadSoQuyetDinh(),
      ]);
      if (this.id > 0) {
        await this.loadPhieuKiemNghiemChatLuong();
      } else {
        this.phieuKiemNghiemChatLuongHang.trangThai = this.globals.prop.DU_THAO;
      }
      this.isValid =
        !!this.phieuKiemNghiemChatLuongHang.bbBanGiaoMauId &&
        !!this.phieuKiemNghiemChatLuongHang.qdgnvnxId;
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  newObjectBienBanLayMau() {
    this.phieuKiemNghiemChatLuongHang = new PhieuKiemNghiemChatLuongHang();
  }
  disableBanHanh(): boolean {
    return (
      this.phieuKiemNghiemChatLuongHang.trangThai ===
      this.globals.prop.DU_THAO ||
      this.id === 0 ||
      this.phieuKiemNghiemChatLuongHang.trangThai === this.globals.prop.TU_CHOI
    );
  }
  async save(isGuiDuyet?: boolean) {
    this.spinner.show();
    const body = {
      kquaKnghiem: this.phieuKiemNghiemChatLuongHang.kquaKnghiem ?? [],
      chiSoChatLuong: this.phieuKiemNghiemChatLuongHang.chiSoChatLuong ?? null,
      ddiemBquan: this.phieuKiemNghiemChatLuongHang.ddiemBquan ?? null,
      diemKhoId: this.phieuKiemNghiemChatLuongHang.diemKhoId ?? null,
      hthucBquan: this.phieuKiemNghiemChatLuongHang.hthucBquan ?? null,
      id: this.phieuKiemNghiemChatLuongHang.id ?? null,
      maDiemKho: this.phieuKiemNghiemChatLuongHang.maDiemKho ?? null,
      maHhoa: this.phieuKiemNghiemChatLuongHang.maHhoa ?? null,
      maNganKho: this.phieuKiemNghiemChatLuongHang.maNganKho ?? null,
      maNganLo: this.phieuKiemNghiemChatLuongHang.maNganLo ?? null,
      maNhaKho: this.phieuKiemNghiemChatLuongHang.maNhaKho ?? null,
      nganLoId: this.phieuKiemNghiemChatLuongHang.nganLoId ?? null,
      ngayKnghiem: this.phieuKiemNghiemChatLuongHang.ngayKnghiem
        ? dayjs(this.phieuKiemNghiemChatLuongHang.ngayKnghiem).format(
          'YYYY-MM-DD',
        )
        : null,
      ngayLayMau: this.phieuKiemNghiemChatLuongHang.ngayLayMau
        ? dayjs(this.phieuKiemNghiemChatLuongHang.ngayLayMau).format(
          'YYYY-MM-DD',
        )
        : null,
      ngayNhapDay: this.phieuKiemNghiemChatLuongHang.ngayNhapDay
        ? dayjs(this.phieuKiemNghiemChatLuongHang.ngayNhapDay).format(
          'YYYY-MM-DD',
        )
        : null,
      nhaKhoId: this.phieuKiemNghiemChatLuongHang.nhaKhoId ?? null,
      sluongBquan: this.phieuKiemNghiemChatLuongHang.sluongBquan ?? null,
      bbBanGiaoMauId: this.phieuKiemNghiemChatLuongHang.bbBanGiaoMauId ?? null,
      soPhieu: this.phieuKiemNghiemChatLuongHang.soPhieu ?? null,
      tenDiemKho: this.phieuKiemNghiemChatLuongHang.tenDiemKho ?? null,
      tenHhoa: this.phieuKiemNghiemChatLuongHang.tenHhoa ?? null,
      tenNganLo: this.phieuKiemNghiemChatLuongHang.tenNganLo ?? null,
      tenNhaKho: this.phieuKiemNghiemChatLuongHang.tenNhaKho ?? null,
      thuKho: this.phieuKiemNghiemChatLuongHang.thuKho ?? null,
      trangThai: this.phieuKiemNghiemChatLuongHang.trangThai ?? null,
      qdgnvnxId: this.phieuKiemNghiemChatLuongHang.qdgnvnxId,
      ketLuan: this.phieuKiemNghiemChatLuongHang.ketLuan ?? null,
      ketQuaDanhGia: this.phieuKiemNghiemChatLuongHang.ketQuaDanhGia ?? null,
      maVatTuCha: this.phieuKiemNghiemChatLuongHang.maVatTuCha,
    };

    try {
      let res;
      if (isGuiDuyet) {
        body.trangThai = this.globals.prop.DU_THAO_TRINH_DUYET;
      }
      if (this.id > 0) {
        res = await this.phieuKiemNghiemChatLuongHangService.sua(body);
      } else {
        res = await this.phieuKiemNghiemChatLuongHangService.them(body);
        if (res.msg == MESSAGE.SUCCESS) {
          const body = {
            id: res.data.id,
            trangThai: this.globals.prop.DU_THAO,
          };
          await this.phieuKiemNghiemChatLuongHangService.updateStatus(body);
        }
      }

      if (res.msg == MESSAGE.SUCCESS) {
        this.notification.success(
          MESSAGE.SUCCESS,
          this.id ? MESSAGE.UPDATE_SUCCESS : MESSAGE.ADD_SUCCESS,
        );
        this.redirectPhieuKiemNghiemChatLuongHang();
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    } catch (error) {
      console.error('error: ', error);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      this.spinner.hide();
    }
  }

  getIdNhap() {
    if (this.router.url && this.router.url != null) {
      let index = this.router.url.indexOf('/chi-tiet/');
      if (index != -1) {
        let url = this.router.url.substring(index + 10);
        let temp = url.split('/');
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
    let trangThai = '02';
    if (this.phieuKiemNghiemChatLuongHang.trangThai == '04') {
      trangThai = '01';
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
          const res =
            await this.phieuKiemNghiemChatLuongHangService.updateStatus(body);
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
          const res =
            await this.phieuKiemNghiemChatLuongHangService.updateStatus(body);
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
          const res =
            await this.phieuKiemNghiemChatLuongHangService.updateStatus(body);
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

  async loadSoQuyetDinh() {
    let body = {
      denNgayQd: null,
      loaiQd: '',
      maDvi: this.userInfo.MA_DVI,
      maVthh: this.phieuKiemNghiemChatLuongHang.maVatTuCha,
      namNhap: new Date().getFullYear(),
      ngayQd: null,
      orderBy: '',
      orderDirection: '',
      paggingReq: {
        limit: 1000,
        orderBy: '',
        orderType: '',
        page: 0,
      },
      soHd: '',
      soQd: null,
      str: '',
      trangThai: '02', // Ban hành
      tuNgayQd: null,
      veViec: null,
    };
    let res = await this.quyetDinhGiaoNhapHangService.timKiem(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.listSoQuyetDinh = data.content;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async loadBBBanGiaoMau(soQd?: string) {
    const body = {
      // maDvi: this.userInfo.MA_DVI,
      capDvis: '3',
      maVatTuCha: this.phieuKiemNghiemChatLuongHang.maVatTuCha,
      soQuyetDinhNhap: soQd || null,
      orderBy: '',
      orderDirection: '',
      pageNumber: 1,
      pageSize: 1000,
      trangThai: '02', // Đã duyệt ??
    };

    const res = await this.quanLyBienBanBanGiaoService.timKiem(body);
    if (res.msg === MESSAGE.SUCCESS) {
      const data = res.data;
      this.listBbBanGiaoMau = data.content;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async changeSoBBBanGiaoMau() {
    try {
      this.spinner.show();
      const bbBanGiaoMauRes =
        await this.quanLyBienBanBanGiaoService.loadChiTiet(
          this.phieuKiemNghiemChatLuongHang.bbBanGiaoMauId,
        );
      if (bbBanGiaoMauRes.msg === MESSAGE.SUCCESS) {
        this.isValid =
          !!this.phieuKiemNghiemChatLuongHang.bbBanGiaoMauId &&
          !!this.phieuKiemNghiemChatLuongHang.qdgnvnxId;
        const bbBanGiaoMau = bbBanGiaoMauRes.data;
        const bbLayMauRes = await this.quanLyBienBanLayMauService.loadChiTiet(
          bbBanGiaoMau.bbLayMauId,
        );
        if (bbLayMauRes.msg === MESSAGE.SUCCESS) {
          const bbLayMau = bbLayMauRes.data;
          this.phieuKiemNghiemChatLuongHang.sluongBquan = bbLayMau.soLuongMau;

          this.phieuKiemNghiemChatLuongHang.ngayLayMau = bbLayMau.ngayLayMau;
          this.phieuKiemNghiemChatLuongHang.maVatTuCha = bbLayMau.maVatTuCha;
          const phieuNhapDayKhoRes =
            await this.quanLyPhieuNhapDayKhoService.chiTiet(
              bbLayMau.bbNhapDayKhoId,
            );
          if (phieuNhapDayKhoRes.msg === MESSAGE.SUCCESS) {
            const phieuNhapDayKho = phieuNhapDayKhoRes.data;
            this.phieuKiemNghiemChatLuongHang.ngayNhapDay =
              phieuNhapDayKho.ngayNhapDayKho;
            this.phieuKiemNghiemChatLuongHang.maDiemKho =
              phieuNhapDayKho.maDiemKho;
            this.changeDiemKho();
            this.phieuKiemNghiemChatLuongHang.maNhaKho =
              phieuNhapDayKho.maNhaKho;
            this.changeNhaKho();
            this.phieuKiemNghiemChatLuongHang.maNganKho =
              phieuNhapDayKho.maNganKho;
            this.changeNganKho();
            this.phieuKiemNghiemChatLuongHang.maNganLo =
              phieuNhapDayKho.maNganLo;
          }
        }
      }
    } catch (error) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      this.spinner.hide();
    }
  }

  async loadDiemKho() {
    const body = {
      maDviCha: this.phieuKiemNghiemChatLuongHang.maDonVi,
      trangThai: '01',
    };

    const dsTong = await this.donViService.layDonViTheoCapDo(body);
    if (!isEmpty(dsTong)) {
      this.dsTong = dsTong;
      this.listDiemKho = dsTong[DANH_MUC_LEVEL.DIEM_KHO];
    }
  }

  changeDiemKho() {
    const diemKho = this.listDiemKho.find(
      (item) => item.maDvi === this.phieuKiemNghiemChatLuongHang.maDiemKho,
    );
    this.phieuKiemNghiemChatLuongHang.maNhaKho = null;
    this.phieuKiemNghiemChatLuongHang.maNganKho = null;
    this.phieuKiemNghiemChatLuongHang.maNganLo = null;
    if (diemKho) {
      const result = {
        ...this.donViService.layDsPhanTuCon(this.dsTong, diemKho),
      };
      this.listNhaKho = result[DANH_MUC_LEVEL.NHA_KHO];
    } else {
      this.listNhaKho = [];
    }
  }

  changeNhaKho() {
    const nhaKho = this.listNhaKho.find(
      (item) => item.maDvi === this.phieuKiemNghiemChatLuongHang.maNhaKho,
    );
    this.phieuKiemNghiemChatLuongHang.maNganKho = null;
    this.phieuKiemNghiemChatLuongHang.maNganLo = null;

    if (nhaKho) {
      const result = {
        ...this.donViService.layDsPhanTuCon(this.dsTong, nhaKho),
      };
      this.listNganKho = result[DANH_MUC_LEVEL.NGAN_KHO];
    } else {
      this.listNganKho = [];
    }
  }

  changeNganKho() {
    const nganKho = this.listNganKho.find(
      (item) => item.maDvi === this.phieuKiemNghiemChatLuongHang.maNganKho,
    );
    this.phieuKiemNghiemChatLuongHang.maNganLo = null;

    if (nganKho) {
      const result = {
        ...this.donViService.layDsPhanTuCon(this.dsTong, nganKho),
      };
      this.listNganLo = result[DANH_MUC_LEVEL.NGAN_LO];
    } else {
      this.listNganLo = [];
    }
  }

  async loadNhaKho(diemKhoId: any) {
    if (diemKhoId && diemKhoId > 0) {
      let body = {
        diemKhoId: diemKhoId,
        maNhaKho: null,
        paggingReq: {
          limit: 1000,
          page: 1,
        },
        str: null,
        tenNhaKho: null,
        trangThai: null,
      };
      let res = await this.tinhTrangKhoHienThoiService.nhaKhoGetList(body);
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data && res.data.content) {
          this.listNhaKho = res.data.content;
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }
  }
  async loadNganKho(nhaKhoId?: string) {
    let body = {
      maNganKho: null,
      nhaKhoId: nhaKhoId || null,
      paggingReq: {
        limit: 1000,
        page: 1,
      },
      str: null,
      tenNganKho: null,
      trangThai: null,
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
      maHthuc: null,
      paggingReq: {
        limit: 1000,
        page: 1,
      },
      str: null,
      tenHthuc: null,
      trangThai: null,
    };
    let res = await this.danhMucService.loadDanhMucHinhThucBaoQuan(body);
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data && res.data.content) {
        this.listHinhThucBaoQuan = res.data.content;
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async loadNganLo(nganKhoId?: string) {
    let body = {
      maNganLo: null,
      nganKhoId: nganKhoId || null,
      paggingReq: {
        limit: 1000,
        page: 1,
      },
      str: null,
      tenNganLo: null,
      trangThai: null,
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
    if (this.router.url.indexOf('/thoc/')) {
      this.loaiStr = 'Thóc';
      this.loaiVthh = '01';
      this.maVthh = '0101';
      this.routerVthh = 'thoc';
    } else if (this.router.url.indexOf('/gao/')) {
      this.loaiStr = 'Gạo';
      this.loaiVthh = '00';
      this.maVthh = '0102';
      this.routerVthh = 'gao';
    } else if (this.router.url.indexOf('/muoi/')) {
      this.loaiStr = 'Muối';
      this.loaiVthh = '02';
      this.maVthh = '04';
      this.routerVthh = 'muoi';
    } else if (this.router.url.indexOf('/vat-tu/')) {
      this.loaiStr = 'Vật tư';
      this.loaiVthh = '03';
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
    kqKiemNghiemChatLuongHangTemp.chiSoChatLuong =
      this.ketQuaKiemNghiemHangCreate.chiSoChatLuong;
    kqKiemNghiemChatLuongHangTemp.tenCtieu =
      this.ketQuaKiemNghiemHangCreate.tenCtieu;
    kqKiemNghiemChatLuongHangTemp.kquaKtra =
      this.ketQuaKiemNghiemHangCreate.kquaKtra;
    kqKiemNghiemChatLuongHangTemp.pphapXdinh =
      this.ketQuaKiemNghiemHangCreate.pphapXdinh;
    this.checkDataExistKqKiemNghiemChatLuong(kqKiemNghiemChatLuongHangTemp);
    this.newObjectPhieuKiemNghiem();
    this.dsKetQuaKiemNghiemHangClone = cloneDeep(
      this.phieuKiemNghiemChatLuongHang.kquaKnghiem,
    );
  }

  checkDataExistKqKiemNghiemChatLuong(
    kqKiemNghiemChatLuong: KetQuaKiemNghiemChatLuongHang,
  ) {
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
      let getChiTieu = this.listTieuChuan.filter(
        (x) => x.tenTchuan == item.tenCtieu,
      );
      if (getChiTieu && getChiTieu.length > 0) {
        this.ketQuaKiemNghiemHangCreate.chiSoChatLuong =
          getChiTieu[0].chiSoNhap;
        this.ketQuaKiemNghiemHangCreate.pphapXdinh = getChiTieu[0].phuongPhap;
      }
    }
  }

  async changeSoQuyetDinh() {
    if (this.phieuKiemNghiemChatLuongHang.qdgnvnxId) {
      const soQd = this.listSoQuyetDinh.find(
        (item) => item.id === this.phieuKiemNghiemChatLuongHang.qdgnvnxId,
      )?.soQd;
      this.phieuKiemNghiemChatLuongHang.soQd = soQd;
      if (this.phieuKiemNghiemChatLuongHang.soQd) {
        await this.loadBBBanGiaoMau(this.phieuKiemNghiemChatLuongHang.soQd);
      }
    }
  }

  async loadTieuChuan() {
    let body = {
      maHang: this.maVthh,
      namQchuan: null,
      paggingReq: {
        limit: 1000,
        page: 1,
      },
      str: null,
      tenQchuan: null,
      trangThai: '01',
    };
    let res = await this.danhMucService.traCuuTieuChuanKyThuat(body);
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data && res.data.content.length > 0) {
        if (
          res.data.content[0].children &&
          res.data.content[0].children.length > 0
        ) {
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
    this.dsKetQuaKiemNghiemHangClone = cloneDeep(
      this.phieuKiemNghiemChatLuongHang.kquaKnghiem,
    );
    this.dsKetQuaKiemNghiemHangClone[index].isEdit = false;
  }
  async loadPhieuKiemNghiemChatLuong() {
    try {
      const res = await this.phieuKiemNghiemChatLuongHangService.chiTiet(
        this.id,
      );
      if (res.msg == MESSAGE.SUCCESS) {
        const data = res.data;
        this.phieuKiemNghiemChatLuongHang = { ...data };
        await this.loadBBBanGiaoMau(data.soQd);
        this.phieuKiemNghiemChatLuongHang.maDonVi = this.userInfo.MA_DVI;
        this.phieuKiemNghiemChatLuongHang.tenDonVi = this.userInfo.TEN_DVI;
        this.dsKetQuaKiemNghiemHangClone =
          this.phieuKiemNghiemChatLuongHang?.kquaKnghiem ?? [];
        this.phieuKiemNghiemChatLuongHang.maDiemKho = data.maDiemKho;
        this.changeDiemKho();
        this.phieuKiemNghiemChatLuongHang.maNhaKho = data.maNhaKho;
        this.changeNhaKho();
        this.phieuKiemNghiemChatLuongHang.maNganKho = data.maNganKho;
        this.changeNganKho();
        this.phieuKiemNghiemChatLuongHang.maNganLo = data.maNganLo;
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    } catch (error) {
      this.notification.error(MESSAGE.ERROR, error.msg);
    }
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
    } else {
      return '';
    }
  }

  thongTinTrangThaiText(trangThai: string): string {
    switch (trangThai) {
      case this.globals.prop.DU_THAO:
        return 'Dự thảo';
      case this.globals.prop.LANH_DAO_DUYET:
        return 'Đã duyệt';
      case this.globals.prop.BAN_HANH:
        return 'Ban hành';
      case this.globals.prop.DU_THAO_TRINH_DUYET:
        return 'Trình duyệt';
      case this.globals.prop.LANH_DAO_DUYET:
        return 'Chờ duyệt - LĐ Cục';
      case this.globals.prop.TU_CHOI:
        return 'Từ chối';
      default:
        return '';
    }
  }
}
