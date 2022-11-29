import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import dayjs from 'dayjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogDanhSachHangHoaComponent } from 'src/app/components/dialog/dialog-danh-sach-hang-hoa/dialog-danh-sach-hang-hoa.component';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { UserLogin } from 'src/app/models/userlogin';
import { DonviService } from 'src/app/services/donvi.service';
import { QuanLyBienBanChuanBiKhoService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/kiemtra-cl/quanLyBienBanChuanBiKho.service';
import { QuanLyBienBanKetThucNhapKhoService } from 'src/app/services/quanLyBienBanKetThucNhapKho.service';
import { QuanLyPhieuKiemTraChatLuongHangService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/kiemtra-cl/quanLyPhieuKiemTraChatLuongHang.service';
import { QuanLyPhieuNhapKhoService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/nhap-kho/quanLyPhieuNhapKho.service';
import { QuyetDinhGiaoNhapHangService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/qd-giaonv-nh/quyetDinhGiaoNhapHang.service';
import { UserService } from 'src/app/services/user.service';
import { convertTienTobangChu, thongTinTrangThaiNhap } from 'src/app/shared/commonFunction';
import { Globals } from 'src/app/shared/globals';
import { BienBanKetThucNhapKho } from './../../../../../../models/BienBanKetThucNhapKho';
import { ThongTinHopDongService } from '../../../../../../services/qlnv-hang/nhap-hang/dau-thau/hop-dong/thongTinHopDong.service';
import {BaseComponent} from "../../../../../../components/base/base.component";
import {
  DialogTableSelectionComponent
} from "../../../../../../components/dialog/dialog-table-selection/dialog-table-selection.component";

@Component({
  selector: 'app-thong-tin-bien-ban-ket-thuc-nhap-kho',
  templateUrl: './thong-tin-bien-ban-ket-thuc-nhap-kho.component.html',
  styleUrls: ['./thong-tin-bien-ban-ket-thuc-nhap-kho.component.scss']
})
export class ThongTinBienBanKetThucNhapKhoComponent extends BaseComponent implements OnInit {
  @Input() id: number;
  @Input() isView: boolean;
  @Input() typeVthh: string;
  @Output()
  showListEvent = new EventEmitter<any>();
  userInfo: UserLogin;
  detail: any = {};
  idNhapHang: number = 0;
  allChecked = false;
  indeterminate = false;
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
  listPhieuNhapKho: any[] = [];
  listBienBanChuanBiKho: any[] = [];
  ketQuaNhapKhoList: any[] = [];
  detailHopDong: any = {};
  detailGiaoNhap: any = {};
  listFileDinhKem: any[] = [];
  listHopDong: any[] = [];
   listDiaDiemNhap: any[] = [];
   dataTable: any[] = [];
  constructor(
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    private modal: NzModalService,
    public userService: UserService,
    private quanLyPhieuKiemTraChatLuongHangService: QuanLyPhieuKiemTraChatLuongHangService,
    private donViService: DonviService,
    public globals: Globals,
    private quanLyPhieuKetThucNhapKhoService: QuanLyBienBanKetThucNhapKhoService,
    private quyetDinhGiaoNhapHangService: QuyetDinhGiaoNhapHangService,
    private thongTinHopDongService: ThongTinHopDongService,
    private fb: FormBuilder,
    private bienBanChuanBiKhoService: QuanLyBienBanChuanBiKhoService,
    private quanLyPhieuNhapKhoService: QuanLyPhieuNhapKhoService,

  ) {
    super();
    super.ngOnInit();
    this.formData = this.fb.group({
      nam: [dayjs().get('year')],
      tenDvi: ['',],
      maQhns: ['', ],
      ngayNhapKho: ['', [Validators.required]],
      ngayHd: ['', [Validators.required]],
      soQdGiaoNvNh: ['',],
      soPhieuNhapKhoTamGui: ['',],
      soHd: ['', ],
      maDiemKho: ['', [Validators.required]],
      tenDiemKho: ['', [Validators.required]],
      maNhaKho: ['', [Validators.required]],
      tenNhaKho: ['', [Validators.required]],
      maNganKho: ['', [Validators.required]],
      tenNganKho: ['', [Validators.required]],
      maLoKho: [''],
      tenLoKho: [''],
      nguoiGiaoHang: [''],
      cmtNguoiGiaoHang: [''],
      donViGiaoHang: [''],
      diaChiNguoiGiao: [''],
      thoiGianGiaoNhan: [''],
      tenLoaiVthh: [''],
      tenCloaiVthh: [''],
      dviTinh: [''],
      ghiChu: [''],
      trangThai: ["00"],
      tenTrangThai: ["Dự thảo"],
      lyDoTuChoi: ["bro vũ quá gà nên từ chối"],
    })

  }

  async ngOnInit() {
    this.spinner.show();
    try {
      this.userInfo = this.userService.getUserLogin();
      await Promise.all([
        // this.loadDiemKho(),
        // this.loadPhieuKiemTraChatLuong(),
        // this.loadSoQuyetDinh(),
        // this.loadBienBanChuanBiKho(),
        // this.loadPhieuNhapKho()
      ]);
      if (this.id > 0) {
        this.loadPhieuKetThucNhapKho();
      }
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  isDisableField() {
    if (this.bienBanKetThucNhapKho && (this.bienBanKetThucNhapKho.trangThai == this.globals.prop.NHAP_CHO_DUYET_TP || this.bienBanKetThucNhapKho.trangThai == this.globals.prop.NHAP_CHO_DUYET_LD_CHI_CUC || this.bienBanKetThucNhapKho.trangThai == this.globals.prop.NHAP_DA_DUYET_LD_CHI_CUC)) {
      return true;
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
  async loadPhieuNhapKho() {
    let body = {
      "capDvis": '3',
      "denNgayNhapKho": null,
      "maDvi": this.userInfo.MA_DVI,
      "loaiVthh": this.typeVthh,
      "orderBy": null,
      "orderDirection": null,
      "pageNumber": 1,
      "pageSize": 1000,
      "soPhieu": null,
      "soQdNhap": null,
      "str": null,
      "trangThai": this.globals.prop.NHAP_DA_DUYET_LD_CHI_CUC,
      "tuNgayNhapKho": null,
    }
    let res = await this.quanLyPhieuNhapKhoService.timKiem(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.listPhieuNhapKho = data.content;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }
  async changeSoQuyetDinh() {
    let quyetDinh = this.listSoQuyetDinh.filter(x => x.id == this.formData.get("qdgnvnxId").value);
    this.ketQuaNhapKhoList = this.getKetQuaNhapKho();
    if (quyetDinh && quyetDinh.length > 0) {
      this.bienBanKetThucNhapKho.qdgnvnxId = quyetDinh[0].id;
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
        this.formData.patchValue({
          tenHang: this.detailHopDong.tenVthh,
          chungLoaiHang: this.detailHopDong.tenCloaiVthh
        })
      }
      else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }
  }
  async changeHopDong() {

    let hopDong = this.listHopDong.find(x => x.hopDong.id == this.formData.get("soHdId").value);
    let body = {
      "str": hopDong.hopDong.soHd
    }
    let res = await this.thongTinHopDongService.loadChiTietSoHopDong(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.detailHopDong = res.data;
      this.formData.patchValue({
        tenVthh: this.detailHopDong.tenVthh,
        chungLoaiHang: this.detailHopDong.tenCloaiVthh
      })

    }
    else {
      this.notification.error(MESSAGE.ERROR, res.msg);
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
      "capDvis": ['3'],
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
      "trangThai": this.globals.prop.NHAP_DA_DUYET_LD_CHI_CUC
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
  save(isGuiDuyet?: boolean) {
    this.spinner.show();
    let body = {
      "bbChuanBiKhoId": this.formData.get("bbChuanBiKhoId").value,
      "capDvi": null,
      "chiTiets": [],
      "fileDinhKemReqs": this.listFileDinhKem,
      "id": this.bienBanKetThucNhapKho.id,
      "keToanDonVi": this.formData.get("keToanDonVi").value,
      "kyThuatVien": this.formData.get("kyThuatVienBaoQuan").value,
      "lyDoTuChoi": null,
      "maDiemKho": this.formData.get("diemKho").value,
      "maDvi": this.formData.get("maQHNS").value,
      "maNganKho": this.formData.get("nganKho").value,
      "maNganLo": this.formData.get("loKho").value,
      "maNhaKho": this.formData.get("nhaKho").value,
      "maVatTu": this.detail.maVatTu,
      "maVatTuCha": this.detail.maVatTuCha,
      "ngayBatDauNhap": this.formData.get("ngayBatDauNhap").value ? dayjs(this.formData.get("ngayBatDauNhap").value).format("YYYY-MM-DD") : null,
      "ngayKetThucKho": this.formData.get("ngayKetThucKho").value ? dayjs(this.formData.get("ngayKetThucKho").value).format("YYYY-MM-DD") : null,
      "ngayKetThucNhap": this.formData.get("ngayKetThucNhap").value ? dayjs(this.formData.get("ngayKetThucNhap").value).format("YYYY-MM-DD") : null,
      "qdgnvnxId": this.bienBanKetThucNhapKho.qdgnvnxId,
      "soBienBan": this.formData.get("soBienBan").value,
      "thuKho": this.formData.get("thuKho").value,
      "thuTruongDonVi": this.formData.get("thuTruongDonVi").value,
      "trangThai": this.bienBanKetThucNhapKho.trangThai,
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
              trangThai: this.globals.prop.NHAP_CHO_DUYET_LD_CHI_CUC,
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
              trangThai: this.globals.prop.NHAP_CHO_DUYET_LD_CHI_CUC,
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
    let trangThai = this.globals.prop.NHAP_CHO_DUYET_LD_CHI_CUC;
    if (this.bienBanKetThucNhapKho.trangThai == this.globals.prop.NHAP_CHO_DUYET_LD_CHI_CUC) {
      trangThai = this.globals.prop.NHAP_DA_DUYET_LD_CHI_CUC;
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
            trangThai: this.globals.prop.NHAP_TU_CHOI_LD_CHI_CUC,
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

  loadPhieuKetThucNhapKho() {
    this.quanLyPhieuKetThucNhapKhoService
      .loadChiTiet(this.id)
      .then((res) => {
        if (res.msg == MESSAGE.SUCCESS) {
          this.bienBanKetThucNhapKho = res.data;
          this.bienBanKetThucNhapKho.maDvi = this.userInfo.MA_DVI;
          this.bienBanKetThucNhapKho.tenDvi = this.userInfo.TEN_DVI;
          this.listFileDinhKem = res.data.fileDinhKems;
          if (this.bienBanKetThucNhapKho.trangThai === this.globals.prop.NHAP_DA_DUYET_LD_CHI_CUC) {
            this.viewChiTiet = true;
          }
          this.changeDiemKho(true);
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

  async loadBienBanChuanBiKho() {
    let body = {
      "capDvis": '3',
      "ngayBienBanTu": null,
      "ngayBienBanDen": null,
      "pageSize": 1000,
      "pageNumber": 1,
      "soBienBan": null,
      "soQdNhap": null,
      "trangThai": this.globals.prop.NHAP_DA_DUYET_LD_CHI_CUC
    };
    let res = await this.bienBanChuanBiKhoService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.listBienBanChuanBiKho = data.content;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }
  async loadDiemKho() {
    let body = {
      maDviCha: this.bienBanKetThucNhapKho.maDvi,
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
    let diemKho = this.listDiemKho.filter(x => x.key == this.formData.get("diemKho").value);
    if (diemKho && diemKho.length > 0) {
      this.listNhaKho = diemKho[0].children;
      if (fromChiTiet) {
        this.changeNhaKho(fromChiTiet);
      }
    }
  }

  changeNhaKho(fromChiTiet: boolean) {
    let nhaKho = this.listNhaKho.filter(x => x.key == this.formData.get("nhaKho").value);
    if (nhaKho && nhaKho.length > 0) {
      this.listNganKho = nhaKho[0].children;
      if (fromChiTiet) {
        this.changeNganKho();
      }
    }
  }

  changeNganKho() {
    let nganKho = this.listNganKho.filter(x => x.key == this.formData.get("nganKho").value);
    if (nganKho && nganKho.length > 0) {
      this.listNganLo = nganKho[0].children;
    }
    this.ketQuaNhapKhoList = this.getKetQuaNhapKho();
  }
  changeLoKho() {
    this.ketQuaNhapKhoList = this.getKetQuaNhapKho();
  }

  getKetQuaNhapKho() {
    const ketQuaNhapKho = [];
    this.listPhieuNhapKho.forEach(phieuNhapKho => {
      if (this.formData.get("qdgnvnxId").value == phieuNhapKho.qdgnvnxId &&
        this.formData.get("diemKho").value == phieuNhapKho.maDiemKho &&
        this.formData.get("nhaKho").value == phieuNhapKho.maNhaKho &&
        this.formData.get("nganKho").value == phieuNhapKho.maNganKho &&
        this.formData.get("loKho").value == phieuNhapKho.maNganLo) {
        ketQuaNhapKho.push(phieuNhapKho);
      }
    })
    return ketQuaNhapKho;
  }

  async openDialogSoQd() {
    let body = {
      "maDvi": this.userInfo.MA_DVI,
      "loaiVthh": this.loaiVthh,
      "paggingReq": {
        "limit": this.globals.prop.MAX_INTERGER,
        "page": 0
      },
      "trangThai": this.STATUS.BAN_HANH,
      "namNhap": this.formData.get('nam').value
    }
    let res = await this.quyetDinhGiaoNhapHangService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.listSoQuyetDinh = data.content;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    const modalQD = this.modal.create({
      nzTitle: 'Danh sách số quyết định kế hoạch giao nhiệm vụ nhập hàng',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listSoQuyetDinh,
        dataHeader: ['Số quyết định', 'Ngày quyết định', 'Loại hàng hóa'],
        dataColumn: ['soQd', 'ngayQdinh', 'tenLoaiVthh'],
      },
    })
    modalQD.afterClose.subscribe(async (dataChose) => {
      if (dataChose) {
        await this.bindingDataQd(dataChose.id);
      }
    });
  };

  async bindingDataQd(id) {
    await this.spinner.show();
    let dataRes = await this.quyetDinhGiaoNhapHangService.getDetail(id)
    const data = dataRes.data;
    this.formData.patchValue({

    });
    let dataChiCuc = data.dtlList.filter(item => item.maDvi == this.userInfo.MA_DVI);
    if (dataChiCuc.length > 0) {

    }

    await this.spinner.hide();
  }

  openDialogDdiemNhapHang() {
    const modalQD = this.modal.create({
      nzTitle: 'Danh sách địa điểm nhập hàng',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listDiaDiemNhap,
        dataHeader: ['Điểm kho', 'Nhà kho', 'Ngăn kho', 'Lô kho', 'SL theo QĐ giao NV NH'],
        dataColumn: ['tenDiemKho', 'tenNhaKho', 'tenNganKho', 'tenLoKho', 'soLuong']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      this.bindingDataDdNhap(data);
    });
  }

  async bindingDataDdNhap(data) {
    if (data) {
      this.formData.patchValue({
        idDdiemGiaoNvNh: data.id,
        maDiemKho: data.maDiemKho,
        tenDiemKho: data.tenDiemKho,
        maNhaKho: data.maNhaKho,
        tenNhaKho: data.tenNhaKho,
        maNganKho: data.maNganKho,
        tenNganKho: data.tenNganKho,
        maLoKho: data.maLoKho,
        tenLoKho: data.tenLoKho,
        soLuongDdiemGiaoNvNh: data.soLuong,
      });
      let dataObj = {
        moTaHangHoa: this.formData.value.cloaiVthh ? this.formData.value.tenCloaiVthh : this.formData.value.tenLoaiVthh,
        maSo: '',
        donViTinh: '',
        soLuongChungTu: 0,
        soLuongThucNhap: data.soLuong,
        donGia: this.formData.value.donGiaHd
      }
      this.dataTable.push(dataObj)
    }
  }
  updateAllChecked(): void {
    this.indeterminate = false;
    if (this.allChecked) {
      if (this.dataTable && this.dataTable.length > 0) {
        this.dataTable.forEach((item) => {
          if (item.trangThai == this.globals.prop.NHAP_DU_THAO) {
            item.checked = true;
          }
        });
      }
    } else {
      if (this.dataTable && this.dataTable.length > 0) {
        this.dataTable.forEach((item) => {
          item.checked = false;
        });
      }
    }
  }

  updateSingleChecked(): void {
    if (this.dataTable.every(item => !item.checked)) {
      this.allChecked = false;
      this.indeterminate = false;
    } else if (this.dataTable.every(item => item.checked)) {
      this.allChecked = true;
      this.indeterminate = false;
    } else {
      this.indeterminate = true;
    }
  }
}
