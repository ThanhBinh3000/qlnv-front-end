import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import dayjs from 'dayjs';
import { cloneDeep } from 'lodash';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogTableSelectionComponent } from 'src/app/components/dialog/dialog-table-selection/dialog-table-selection.component';
import { DialogThemBienbanNghiemThuKeLotComponent } from 'src/app/components/dialog/dialog-them-bien-ban-nghiem-thu-ke-lot/dialog-them-bien-ban-nghiem-thu-ke-lot.component';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { UserLogin } from 'src/app/models/userlogin';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { DonviService } from 'src/app/services/donvi.service';
import { QuanLyPhieuKiemTraChatLuongHangService } from 'src/app/services/quanLyPhieuKiemTraChatLuongHang.service';
import { QuyetDinhGiaoNhapHangService } from 'src/app/services/quyetDinhGiaoNhapHang.service';
import { ThongTinHopDongService } from 'src/app/services/thongTinHopDong.service';
import { TinhTrangKhoHienThoiService } from 'src/app/services/tinhTrangKhoHienThoi.service';
import { UserService } from 'src/app/services/user.service';
import { thongTinTrangThaiNhap } from 'src/app/shared/commonFunction';
import { Globals } from 'src/app/shared/globals';
import { STATUS } from "../../../../../../constants/status";

@Component({
  selector: 'them-moi-phieu-kiem-tra-chat-luong-hang',
  templateUrl: './them-moi-phieu-kiem-tra-chat-luong-hang.component.html',
  styleUrls: ['./them-moi-phieu-kiem-tra-chat-luong-hang.component.scss'],
})
export class ThemMoiPhieuKiemTraChatLuongHangComponent implements OnInit {
  @Input() id: number;
  @Input() isView: boolean;
  @Input() isTatCa: boolean;
  @Input() typeVthh: string;
  @Output()
  showListEvent = new EventEmitter<any>();

  userInfo: UserLogin;
  detail: any = {};
  detailGiaoNhap: any = {};
  detailHopDong: any = {};

  create: any = {};
  editDataCache: { [key: string]: { edit: boolean; data: any } } = {};

  listDiemKho: any[] = [];
  listNhaKho: any[] = [];
  listNganKho: any[] = [];
  listNganLo: any[] = [];
  listTieuChuan: any[] = [];
  listSoQuyetDinh: any[] = [];
  listHopDong: any[] = [];

  formData: FormGroup;

  STATUS = STATUS;

  constructor(
    private spinner: NgxSpinnerService,
    private quanLyPhieuKiemTraChatLuongHangService: QuanLyPhieuKiemTraChatLuongHangService,
    private notification: NzNotificationService,
    private modal: NzModalService,
    private userService: UserService,
    public globals: Globals,
    private quyetDinhGiaoNhapHangService: QuyetDinhGiaoNhapHangService,
    private danhMucService: DanhMucService,
    private thongTinHopDongService: ThongTinHopDongService,
    private donViService: DonviService,
    private fb: FormBuilder,
    private quyetDinhNhapXuatService: QuyetDinhGiaoNhapHangService,
    private thongTinHopDong: ThongTinHopDongService,
  ) {
    this.formData = this.fb.group(
      {
        id: [],
        idQdGiaoNvNh: [''],
        soQdGiaoNvNh: [, [Validators.required]],
        tenDvi: [''],
        maDvi: [''],

        idHd: [''],
        soHd: [''],
        ngayHd: [null,],

        soPhieu: [],

        trangThai: [],
        tenTrangThai: [],

        loaiVthh: ['',],
        tenLoaiVthh: ['',],
        cloaiVthh: [''],
        tenCloaiVthh: [''],


        trichYeu: [null,],
        idGoiThau: [null,],
        ghiChu: [null,],
        tenDviTthau: [],
        tgianThienHd: [],
        giaTrungThau: [],
        loaiHdong: [],
        lyDoHuy: [''],
        trungThau: [''],
      }
    );
  }

  async ngOnInit() {
    this.spinner.show();
    try {
      this.userInfo = this.userService.getUserLogin();
      await Promise.all([
        this.loadDiemKho(),
        this.loadTieuChuan(),
        this.loadSoQuyetDinh(),
      ]);
      if (this.id) {
        await this.loadChiTiet(this.id);
      } else {
        this.initForm();
      }
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  initForm() {
    this.formData.patchValue({
      maDvi: this.userInfo.MA_DVI,
      tenDvi: this.userInfo.TEN_DVI,
      trangThai: STATUS.DU_THAO,
      tenTrangThai: 'Dự thảo',
    })
  }

  isDisableField() {
    if (this.detail && (this.detail.trangThai == this.globals.prop.NHAP_CHO_DUYET_TP || this.detail.trangThai == this.globals.prop.NHAP_CHO_DUYET_LD_CHI_CUC || this.detail.trangThai == this.globals.prop.NHAP_DA_DUYET_LD_CHI_CUC)) {
      return true;
    }
  }

  async loadSoQuyetDinh() {
    let body = {
      "maDvi": this.userInfo.MA_DVI,
      "maVthh": this.typeVthh,
      "paggingReq": {
        "limit": this.globals.prop.MAX_INTERGER,
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

  // async changeSoQuyetDinh(autoChange: boolean) {
  //   let quyetDinh = this.listSoQuyetDinh.filter(x => x.id == this.detail.quyetDinhNhapId);
  //   if (quyetDinh && quyetDinh.length > 0) {
  //     this.detailGiaoNhap = quyetDinh[0];
  //     if (this.detailGiaoNhap.children1 && this.detailGiaoNhap.children1.length > 0) {
  //       this.listHopDong = [];
  //       this.detailGiaoNhap.children1.forEach(element => {
  //         if (element && element.hopDong) {
  //           if (this.typeVthh) {
  //             if (element.hopDong.loaiVthh.startsWith(this.typeVthh)) {
  //               this.listHopDong.push(element);
  //             }
  //           }
  //           else {
  //             if (!element.hopDong.loaiVthh.startsWith(this.globals.prop.NHAP_DA_DUYET_LD_CHI_CUC)) {
  //               this.listHopDong.push(element);
  //             }
  //           }
  //         }
  //       });
  //     }
  //     if (!autoChange) {
  //       this.detail.soHopDong = null;
  //       this.detail.hopDongId = null;
  //       this.detail.ngayHopDong = null;
  //       this.detail.maHangHoa = null;
  //       this.detail.khoiLuongKiemTra = null;
  //       this.detail.maHangHoa = null;
  //       this.detail.tenVatTuCha = null;
  //       this.detail.tenVatTu = null;
  //       this.detail.maVatTuCha = null;
  //       this.detail.maVatTu = null;
  //     } else {
  //       await this.changeHopDong();
  //     }
  //   }
  // }

  async changeHopDong() {
    if (this.detail.soHopDong) {
      let body = {
        "str": this.detail.soHopDong
      }
      let res = await this.thongTinHopDongService.loadChiTietSoHopDong(body);
      if (res.msg == MESSAGE.SUCCESS) {
        this.detailHopDong = res.data;
        this.detail.hopDongId = this.detailHopDong.id;
        this.detail.ngayHopDong = this.detailHopDong.ngayKy;
        this.detail.maHangHoa = this.detailHopDong.loaiVthh;
        this.detail.khoiLuongKiemTra = this.detailHopDong.soLuong;
        this.detail.maHangHoa = this.typeVthh;
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

  async loadTieuChuan() {
    let body = {
      "maHang": this.typeVthh,
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

  changeChiTieu(item) {
    if (item) {
      let getChiTieu = this.listTieuChuan.filter(x => x.tenTchuan == item.tenChiTieu);
      if (getChiTieu && getChiTieu.length > 0) {
        item.tieuChuan = getChiTieu[0].chiSoNhap;
        item.phuongPhapXacDinh = getChiTieu[0].phuongPhap;
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
    if (diemKho && diemKho.length > 0) {
      this.listNhaKho = diemKho[0].children;
      if (fromChiTiet) {
        this.changeNhaKho(fromChiTiet);
      }
      else {
        this.detail.maNhaKho = null;
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
      else {
        this.detail.maNganKho = null;
      }
    }
  }


  changeNganKho() {
    let nganKho = this.listNganKho.filter(x => x.key == this.detail.maNganKho);
    if (nganKho && nganKho.length > 0) {
      this.listNganLo = nganKho[0].children;
    }
  }

  async loadChiTiet(id: number) {
    if (id > 0) {
      let res = await this.quanLyPhieuKiemTraChatLuongHangService.chiTiet(id);
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          this.detail = res.data;
          this.changeDiemKho(true);
          // await this.changeSoQuyetDinh(true);
        }
      }
    }
    this.updateEditCache();
  }

  async save(isOther: boolean) {
    this.spinner.show();
    try {
      let body = {
        "bienSoXe": this.detail.bienSoXe,
        "diaChi": null,
        "fileDinhKemId": null,
        "hopDongId": this.detail.hopDongId,
        "id": this.id,
        "ketLuan": this.detail.ketLuan,
        "kqDanhGia": this.detail.kqDanhGia,
        "ketQuaKiemTra": this.detail.ketQuaKiemTra,
        "khoiLuong": this.detail.khoiLuong,
        "khoiLuongDeNghiKt": this.detail.khoiLuongDeNghiKt,
        "lyDoTuChoi": null,
        "diemKhoId": 1,
        "maDvi": this.detail.maDvi,
        "maHangHoa": this.typeVthh,
        "maDiemKho": this.detail.maDiemKho,
        "maNganLo": this.detail.maNganLo,
        "maNhaKho": this.detail.maNhaKho,
        "maNganKho": this.detail.maNganKho,
        "maVatTu": this.detail.maVatTu,
        "maVatTuCha": this.detail.maVatTuCha,
        "maQhns": this.detail.maDvi,
        "ngayGdinh": this.detail.ngayGdinh,
        "ngayKiemTra": null,
        "ngayPheDuyet": null,
        "nguoiGiaoHang": this.detail.nguoiGiaoHang,
        "nguoiPheDuyet": null,
        "quyetDinhNhapId": this.detail.quyetDinhNhapId,
        "soChungThuGiamDinh": this.detail.soChungThuGiamDinh,
        "soPhieu": this.detail.soPhieu,
        "soPhieuAnToanThucPham": null,
        "tchucGdinh": this.detail.tchucGdinh,
        "tenHangHoa": null,
        "tenNganKho": null,
        "trangThai": this.detail.trangThai,
      };
      if (this.id > 0) {
        let res = await this.quanLyPhieuKiemTraChatLuongHangService.sua(
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
        let res = await this.quanLyPhieuKiemTraChatLuongHangService.them(
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
            await this.quanLyPhieuKiemTraChatLuongHangService.updateStatus(
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
    let trangThai = ''
    switch (this.detail.trangThai) {
      case STATUS.DU_THAO: {
        trangThai = STATUS.CHO_DUYET_LDCC;
        break;
      }
      case STATUS.CHO_DUYET_LDCC: {
        trangThai = STATUS.DA_DUYET_LDCC;
        break;
      }
      case STATUS.TU_CHOI_LDCC: {
        trangThai = STATUS.DA_DUYET_LDCC;
        break;
      }
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
            trangThai: trangThai
          };
          let res =
            await this.quanLyPhieuKiemTraChatLuongHangService.updateStatus(
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
            trangThai: STATUS.TU_CHOI_LDCC,
          };
          let res =
            await this.quanLyPhieuKiemTraChatLuongHangService.updateStatus(
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

  back() {
    this.showListEvent.emit();
  }

  themBienBanNgiemThuKeLot() {
    const modalLuongThuc = this.modal.create({
      nzTitle: 'Thêm mới thông tin chi tiết',
      nzContent: DialogThemBienbanNghiemThuKeLotComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {},
    });
    modalLuongThuc.afterClose.subscribe((res) => {
      if (res) {
      }
    });
  }

  cancelEdit(stt: number): void {
    const index = this.detail?.ketQuaKiemTra.findIndex(item => item.stt === stt);
    this.editDataCache[stt] = {
      data: { ...this.detail?.ketQuaKiemTra[index] },
      edit: false
    };
  }

  saveEdit(stt: number): void {
    const index = this.detail?.ketQuaKiemTra.findIndex(item => item.stt === stt);
    Object.assign(this.detail?.ketQuaKiemTra[index], this.editDataCache[stt].data);
    this.editDataCache[stt].edit = false;
  }

  deleteRow(data: any) {
    this.detail.ketQuaKiemTra = this.detail?.ketQuaKiemTra.filter(x => x.stt != data.stt);
    this.sortTableId();
    this.updateEditCache();
  }

  editRow(stt: number) {
    this.editDataCache[stt].edit = true;
  }

  addRow() {
    if (!this.detail?.ketQuaKiemTra) {
      this.detail.ketQuaKiemTra = [];
    }
    this.sortTableId();
    let item = cloneDeep(this.create);
    item.stt = this.detail?.ketQuaKiemTra.length + 1;
    this.detail.ketQuaKiemTra = [
      ...this.detail?.ketQuaKiemTra,
      item,
    ]
    this.updateEditCache();
    this.clearItemRow();
  }

  clearItemRow() {
    this.create = {};
  }

  updateEditCache(): void {
    if (this.detail?.ketQuaKiemTra && this.detail?.ketQuaKiemTra.length > 0) {
      this.detail?.ketQuaKiemTra.forEach((item) => {
        this.editDataCache[item.stt] = {
          edit: false,
          data: { ...item },
        };
      });
    }
  }

  sortTableId() {
    this.detail?.ketQuaKiemTra.forEach((lt, i) => {
      lt.stt = i + 1;
    });
  }


  async openDialogSoQd(nameDialog?) {
    const modalQD = this.modal.create({
      nzTitle: nameDialog == 'quyetDinh' ? 'Danh sách số quyết định kế hoạch giao nhiệm vụ nhập hàng' : 'Danh sách hợp đồng',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: nameDialog == 'quyetDinh' ? this.listSoQuyetDinh : this.listHopDong,
        dataHeader: nameDialog == 'quyetDinh' ? ['Số quyết định', 'Ngày quyết định', 'Loại hàng hóa'] : ['Số hợp đồng'],
        dataColumn: nameDialog == 'quyetDinh' ? ['soQd', 'ngayQdinh', 'tenLoaiVthh'] : ['soHd'],
      },
    })
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        console.log(data);
        this.spinner.show();
        if (nameDialog == 'quyetDinh') {
          this.formData.patchValue({
            soQdGiaoNvNh: data.soQd,
            idQdGiaoNvNh: data.id,
          });
          let res = await this.quyetDinhNhapXuatService.getDetail(data.id);
          if (res.msg == MESSAGE.SUCCESS) {
            this.listHopDong = res.data.hopDongList
          }
        } else {
          let res = await this.thongTinHopDong.getDetail(data.hopDongId);
          if (res.msg == MESSAGE.SUCCESS) {
            console.log(res);
            this.formData.patchValue({
              soHd: data.soHd,
              idHd: data.hopDongId,
              ngayHd: res.data.ngayKy,
              loaiVthh: res.data.loaiVthh,
              tenLoaiVthh: res.data.tenVthh,
              cloaiVthh: res.data.cloaiVthh,
              tenCloaiVthh: res.data.tenCloaiVthh
            });
            console.log(this.formData.value);
          }
        }
        this.spinner.hide();
      }
    });;
  }
}
