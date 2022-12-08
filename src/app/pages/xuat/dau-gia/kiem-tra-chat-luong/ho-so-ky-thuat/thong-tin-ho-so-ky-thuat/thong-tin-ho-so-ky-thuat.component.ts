import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as dayjs from 'dayjs';
import { cloneDeep } from 'lodash';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { tr_TR } from 'ng-zorro-antd/i18n';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { DialogDanhSachHangHoaComponent } from 'src/app/components/dialog/dialog-danh-sach-hang-hoa/dialog-danh-sach-hang-hoa.component';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { UserLogin } from 'src/app/models/userlogin';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { DonviService } from 'src/app/services/donvi.service';
import { HoSoKyThuatService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/kiemtra-cl/hoSoKyThuat.service';
import { QuanLyBienBanBanGiaoService } from 'src/app/services/quanLyBienBanBanGiao.service';
import { QuanLyNghiemThuKeLotService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/kiemtra-cl/quanLyNghiemThuKeLot.service';
import { QuyetDinhGiaoNhapHangService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/qd-giaonv-nh/quyetDinhGiaoNhapHang.service';
import { ThongTinHopDongService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/hop-dong/thongTinHopDong.service';
import { TinhTrangKhoHienThoiService } from 'src/app/services/tinhTrangKhoHienThoi.service';
import { UserService } from 'src/app/services/user.service';
import { convertTienTobangChu } from 'src/app/shared/commonFunction';
import { Globals } from 'src/app/shared/globals';

@Component({
  selector: 'app-thong-tin-ho-so-ky-thuat',
  templateUrl: './thong-tin-ho-so-ky-thuat.component.html',
  styleUrls: ['./thong-tin-ho-so-ky-thuat.component.scss']
})
export class ThongTinHoSoKyThuatComponent implements OnInit {

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

  listThuKho: any[] = [];
  listNganLo: any[] = [];
  listLoaiKho: any[] = [];
  listPTBaoQuan: any[] = [];
  listDonViTinh: any[] = [];
  listSoQuyetDinh: any[] = [];
  listBanGiaoMau: any[] = [];

  create: any = {};
  editDataCache: { [key: string]: { edit: boolean; data: any } } = {};

  capCuc: string = '2';
  capChiCuc: string = '3';
  capDonVi: string = '0';
  listDaiDienCuc: any[] = [];
  listDaiDienChiCuc: any[] = [];
  listDaiDienDonVi: any[] = [];
  listDaiDien: any[] = [
    {
      "daiDien": null,
      "hoSoKyThuatId": null,
      "id": null,
      "idTemp": 1,
      "loaiDaiDien": '2',
      "stt": null
    },
    {
      "daiDien": null,
      "hoSoKyThuatId": null,
      "id": null,
      "idTemp": 1,
      "loaiDaiDien": '3',
      "stt": null
    },
    {
      "daiDien": null,
      "hoSoKyThuatId": null,
      "id": null,
      "idTemp": 1,
      "loaiDaiDien": '0',
      "stt": null
    },
  ];

  listCanCu: any[] = [];
  listFileDinhKem: any[] = [];

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
    private hoSoKyThuatService: HoSoKyThuatService,
    private quyetDinhGiaoNhapHangService: QuyetDinhGiaoNhapHangService,
    private thongTinHopDongService: ThongTinHopDongService,
    private quanLyBienBanBanGiaoService: QuanLyBienBanBanGiaoService,
    public globals: Globals,
  ) { }

  async ngOnInit() {
    this.spinner.show();
    try {
      this.create.dvt = "Tấn";
      this.detail.trangThai = "00";
      this.userInfo = this.userService.getUserLogin();
      this.detail.tenDvi = this.userInfo.TEN_DVI;
      this.detail.maDvi = this.userInfo.MA_DVI;
      await Promise.all([
        this.loadBanGiaoMau(),
        this.loadSoQuyetDinh(),

      ]);
      await this.loadChiTiet(this.id);
      this.loadDaiDien();
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  selectHangHoa() {
    if (this.detail.trangThai == '01' || this.detail.trangThai == '02' || this.detail.trangThai == '04' || this.isView) {
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

  loadDaiDien() {
    if (this.listDaiDien && this.listDaiDien.length > 0) {
      this.listDaiDienCuc = this.listDaiDien.filter(x => x.loaiDaiDien == this.capCuc);
      this.listDaiDienChiCuc = this.listDaiDien.filter(x => x.loaiDaiDien == this.capChiCuc);
      this.listDaiDienDonVi = this.listDaiDien.filter(x => x.loaiDaiDien == this.capDonVi);
    }
  }

  addDaiDien(type) {
    if (!this.listDaiDien) {
      this.listDaiDien = [];
    }
    let item = {
      "daiDien": null,
      "hoSoKyThuatId": this.id,
      "id": null,
      "idTemp": new Date().getTime(),
      "loaiDaiDien": type,
      "stt": null
    }
    this.listDaiDien.push(item);
    this.loadDaiDien();
  }

  xoaDaiDien(item) {
    this.listDaiDien = this.listDaiDien.filter(x => x.idTemp != item.idTemp);
    this.loadDaiDien();
  }

  async loadBanGiaoMau() {
    let body = {
      "capDvis": '3',
      "maDvi": this.detail.maDvi,
      "maVatTuCha": this.typeVthh,
      "paggingReq": {
        "limit": 1000,
        "page": 0
      },
      "trangThai": "02",
    }
    let res = await this.quanLyBienBanBanGiaoService.timKiem(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      console.log(data);

      this.listBanGiaoMau = data.content;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  changeBanGiaoMau() {
    console.log(this.detail);
    let banGiao = this.listBanGiaoMau.filter(x => x.id == this.detail.bienBanGiaoMauId);
    console.log(banGiao);
    if (banGiao && banGiao.length > 0) {

      // this.detailGiaoNhap = banGiao[0];
    }
  }

  async loadSoQuyetDinh() {
    let body = {
      "maDvi": this.detail.maDvi,
      "maVthh": this.typeVthh,
      "paggingReq": {
        "limit": 1000,
        "page": 0
      },
      "trangThai": this.globals.prop.NHAP_BAN_HANH,
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
        this.detail.hopDongId = this.detailHopDong.id;
        this.detail.soHopDong = this.detailHopDong.soHd;
        this.detail.ngayHopDong = this.detailHopDong.ngayKy;
        this.detail.loaiVthh = this.detailHopDong.loaiVthh;
      }
      else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }
  }

  async loadChiTiet(id) {
    if (id > 0) {
      let res = await this.hoSoKyThuatService.getDetail(id);
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {

          this.detail = res.data;

          if (this.detail.children) {
            this.detail.detail = this.detail.children;
          }
          if (this.detail.bienBanGiaoMauId) {
            this.detail.bienBanGiaoMauId = +this.detail.bienBanGiaoMauId;
          }
          if (this.detail.chiTiets && this.detail.chiTiets.length > 0) {
            this.listDaiDien = this.detail.chiTiets;
            this.loadDaiDien();
          }
          if (this.detail.fdkCanCus) {
            this.listCanCu = this.detail.fdkCanCus;
          }
          if (this.detail.fileDinhKems) {
            this.listFileDinhKem = this.detail.fileDinhKems;
          }
          console.log(this.listCanCu, this.listFileDinhKem);

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
            await this.hoSoKyThuatService.approve(
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
            trangThai: '01',
          };
          let res =
            await this.hoSoKyThuatService.approve(
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
            await this.hoSoKyThuatService.approve(
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
            await this.hoSoKyThuatService.approve(
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
        "bienBanGiaoMauId": this.detail.bienBanGiaoMauId,
        "capDvi": null,
        "cbtlCanHoanThien": null,
        "chiTiets": this.listDaiDien,
        "diaDiemKiemTra": this.detail.diaDiemKiemTra,
        "donViCungCap": this.detail.donViCungCap,
        "fdkCanCus": this.listCanCu,
        "fileDinhKemReqs": this.listFileDinhKem,
        "hopDongId": this.detail.hopDongId,
        "id": this.id,
        "ketLuan": this.detail.ketLuan,
        "loaiVthh": this.detail.loaiVthh,
        "maDvi": this.detail.maDvi,
        "maVatTu": this.detail.maVatTu,
        "maVatTuCha": this.detail.maVatTuCha,
        "ngayHopDong": this.detail?.ngayHopDong ? dayjs(this.detail?.ngayHopDong).format('YYYY-MM-DD') : null,
        "ngayKiemTra": this.detail.ngayKiemTra,
        "qdgnvnxId": this.detail.qdgnvnxId,
        "soBienBan": this.detail.soBienBan,
        "soLuongThucNhap": this.detail.soLuongThucNhap,
        "tgBsTruocNgay": null,
        "tgHtTruocNgay": null,
        "thoiGianNhap": this.detail?.thoiGianNhap ? dayjs(this.detail?.thoiGianNhap).format('YYYY-MM-DD') : null,
        "vbtlCanBoSung": null
      }
      if (this.id > 0) {
        let res = await this.hoSoKyThuatService.update(
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
        let res = await this.hoSoKyThuatService.create(
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
    if (trangThai === "02") {
      return 'da-ban-hanh'
    }
    return 'du-thao-va-lanh-dao-duyet'
  }

  print() {

  }
}

