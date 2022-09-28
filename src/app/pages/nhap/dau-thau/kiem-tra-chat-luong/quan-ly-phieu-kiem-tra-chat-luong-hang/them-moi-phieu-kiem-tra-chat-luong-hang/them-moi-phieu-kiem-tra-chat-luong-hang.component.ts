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
import { QuanLyPhieuKiemTraChatLuongHangService } from 'src/app/services/quantri-danhmuc/quanLyPhieuKiemTraChatLuongHang.service';
import { QuyetDinhGiaoNhapHangService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/qd-giaonv-nh/quyetDinhGiaoNhapHang.service';
import { ThongTinHopDongService } from 'src/app/services/thongTinHopDong.service';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';
import { STATUS } from "../../../../../../constants/status";
import { DanhMucTieuChuanService } from 'src/app/services/quantri-danhmuc/danhMucTieuChuan.service';
import { HelperService } from 'src/app/services/helper.service';

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
  listNam: any[] = [];
  dataTableChiTieu: any[] = [];
  listDiaDiemNhap: any[] = [];
  listFileDinhKem: any[] = [];

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
    private danhMucTieuChuanService: DanhMucTieuChuanService,
    private helperService: HelperService
  ) {
    this.formData = this.fb.group(
      {
        id: [],
        nam: [dayjs().get('year')],
        maDvi: ['', [Validators.required]],
        maQhns : ['',],
        tenDvi: ['', [Validators.required]],
        idQdGiaoNvNh: ['', [Validators.required]],
        soQdGiaoNvNh: [, [Validators.required]],
        ngayQdGiaoNvNh: [, [Validators.required]],
        soPhieu: ['', [Validators.required]],
        ngayTao: [dayjs().format('YYYY-MM-DD'), [Validators.required]],
        loaiVthh: ['',],
        tenLoaiVthh: ['',],
        cloaiVthh: [''],
        tenCloaiVthh: [''],
        moTaHangHoa: [''],
        soHd: [''],
        ngayHd: [null,],
        maDiemKho: ['', [Validators.required]],
        tenDiemKho: ['', [Validators.required]],
        maNhaKho: ['', [Validators.required]],
        tenNhaKho: ['', [Validators.required]],
        maNganKho: ['', [Validators.required]],
        tenNganKho: ['', [Validators.required]],
        maLoKho: [''],
        tenLoKho: [''],

        nguoiGiaoHang: ['', [Validators.required]],
        cmtNguoiGiaoHang: ['', [Validators.required]],
        donViGiaoHang: ['', [Validators.required]],
        diaChi: ['', [Validators.required]],
        bienSoXe: ['', [Validators.required]],
        soLuongDeNghiKt: ['', [Validators.required]],
        soLuongNhapKho: ['', [Validators.required]],
        soChungThuGiamDinh: ['', [Validators.required]],
        ngayGdinh: ['', [Validators.required]],
        tchucGdinh: ['', [Validators.required]],
        ketLuan: [],
        kqDanhGia: [],
        lyDoTuChoi: [''],
        trangThai: [],
        tenTrangThai: [],
      }
    );
  }

  async ngOnInit() {
    this.spinner.show();
    try {
      this.userInfo = this.userService.getUserLogin();
      for (let i = -3; i < 23; i++) {
        this.listNam.push({
          value: dayjs().get('year') - i,
          text: dayjs().get('year') - i,
        });
      }
      await Promise.all([
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

  async initForm() {
    let res = await this.userService.getId("PHIEU_KT_CHAT_LUONG_SEQ");
    this.formData.patchValue({
      soPhieu: `${res}/${this.formData.get('nam').value}/KTCL-CCDTKVVP`,
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
      "trangThai": STATUS.BAN_HANH,
      "namNhap": this.formData.get('nam').value
    }
    let res = await this.quyetDinhGiaoNhapHangService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.listSoQuyetDinh = data.content.filter( x => !x.loaiVthh.startsWith("02"));
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

  // async changeHopDong() {
  //   if (this.detail.soHopDong) {
  //     let body = {
  //       "str": this.detail.soHopDong
  //     }
  //     let res = await this.thongTinHopDongService.loadChiTietSoHopDong(body);
  //     if (res.msg == MESSAGE.SUCCESS) {
  //       this.detailHopDong = res.data;
  //       this.detail.hopDongId = this.detailHopDong.id;
  //       this.detail.ngayHopDong = this.detailHopDong.ngayKy;
  //       this.detail.maHangHoa = this.detailHopDong.loaiVthh;
  //       this.detail.khoiLuongKiemTra = this.detailHopDong.soLuong;
  //       this.detail.maHangHoa = this.typeVthh;
  //       this.detail.tenVatTuCha = this.detailHopDong.tenVthh;
  //       this.detail.tenVatTu = this.detailHopDong.tenCloaiVthh;
  //       this.detail.maVatTuCha = this.detailHopDong.loaiVthh;
  //       this.detail.maVatTu = this.detailHopDong.cloaiVthh;
  //     }
  //     else {
  //       this.notification.error(MESSAGE.ERROR, res.msg);
  //     }
  //   }
  // }

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

  async loadChiTiet(id: number) {
    if (id > 0) {
      let res = await this.quanLyPhieuKiemTraChatLuongHangService.getDetail(id);
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          const data = res.data;
          this.dataTableChiTieu = data.ketQuaKiemTra;
          this.formData.patchValue({
            id : data.id,
            nam : data.nam,
            maDvi : data.maDvi,
            maQhns : data.maQhns,
            tenDvi : data.tenDvi,
            soPhieu : data.soPhieu,
            ngayTao : data.ngayTao,
            idQdGiaoNvNh : data.idQdGiaoNvNh,
            soQdGiaoNvNh : data.soQdGiaoNvNh,
            loaiVthh : data.loaiVthh,
            tenLoaiVthh : data.tenLoaiVthh,
            cloaiVthh : data.cloaiVthh,
            moTaHangHoa : data.moTaHangHoa,
            tenCloaiVthh : data.tenCloaiVthh,
            soHd : data.soHd,
            ngayQdGiaoNvNh : data.ngayQdGiaoNvNh,
            maDiemKho: data.maDiemKho,
            tenDiemKho: data.tenDiemKho,
            maNhaKho: data.maNhaKho,
            tenNhaKho: data.tenNhaKho,
            maNganKho: data.maNganKho,
            tenNganKho: data.tenNganKho,
            maLoKho: data.maLoKho,
            tenLoKho: data.tenLoKho,
            nguoiGiaoHang : data.nguoiGiaoHang,
            cmtNguoiGiaoHang : data.cmtNguoiGiaoHang,
            donViGiaoHang : data.donViGiaoHang,
            diaChi : data.donViGiaoHang,
            bienSoXe : data.bienSoXe,
            soLuongDeNghiKt : data.soLuongDeNghiKt,
            soLuongNhapKho : data.soLuongNhapKho,
            soChungThuGiamDinh : data.soChungThuGiamDinh,
            ngayGdinh : data.ngayGdinh,
            tchucGdinh : data.tchucGdinh,
            kqDanhGia : data.kqDanhGia,
            ketLuan : data.ketLuan,
            trangThai : data.trangThai,
            tenTrangThai : data.tenTrangThai,
            lyDoTuChoi : data.lyDoTuChoi,
          })
        }
      }
    }
    this.updateEditCache();
  }

  async save(isGuiDuyet: boolean) {
    this.spinner.show();
    this.helperService.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      console.log(this.formData);
      this.notification.error(MESSAGE.ERROR, MESSAGE.FORM_REQUIRED_ERROR);
      this.spinner.hide();
      return;
    }
    let body = this.formData.value;
    body.fileDinhKems = this.listFileDinhKem;
    body.ketQuaKiemTra = this.dataTableChiTieu;
    let res;
    if (this.formData.get('id').value > 0) {
      res = await this.quanLyPhieuKiemTraChatLuongHangService.update(body);
    } else {
      res = await this.quanLyPhieuKiemTraChatLuongHangService.create(body);
    }
    if (res.msg == MESSAGE.SUCCESS) {
      if (isGuiDuyet) {
        this.spinner.hide();
        this.id = res.data.id;
        this.pheDuyet();
      } else {
        if (this.formData.get('id').value) {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
          this.back();
        } else {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
          this.back();
        }
        this.spinner.hide();
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
      this.spinner.hide();
    }




    // try {
    //   let body = {
    //     "bienSoXe": this.detail.bienSoXe,
    //     "diaChi": null,
    //     "fileDinhKemId": null,
    //     "hopDongId": this.detail.hopDongId,
    //     "id": this.id,
    //     "ketLuan": this.detail.ketLuan,
    //     "kqDanhGia": this.detail.kqDanhGia,
    //     "ketQuaKiemTra": this.detail.ketQuaKiemTra,
    //     "khoiLuong": this.detail.khoiLuong,
    //     "khoiLuongDeNghiKt": this.detail.khoiLuongDeNghiKt,
    //     "lyDoTuChoi": null,
    //     "diemKhoId": 1,
    //     "maDvi": this.detail.maDvi,
    //     "maHangHoa": this.typeVthh,
    //     "maDiemKho": this.detail.maDiemKho,
    //     "maNganLo": this.detail.maNganLo,
    //     "maNhaKho": this.detail.maNhaKho,
    //     "maNganKho": this.detail.maNganKho,
    //     "maVatTu": this.detail.maVatTu,
    //     "maVatTuCha": this.detail.maVatTuCha,
    //     "maQhns": this.detail.maDvi,
    //     "ngayGdinh": this.detail.ngayGdinh,
    //     "ngayKiemTra": null,
    //     "ngayPheDuyet": null,
    //     "nguoiGiaoHang": this.detail.nguoiGiaoHang,
    //     "nguoiPheDuyet": null,
    //     "quyetDinhNhapId": this.detail.quyetDinhNhapId,
    //     "soChungThuGiamDinh": this.detail.soChungThuGiamDinh,
    //     "soPhieu": this.detail.soPhieu,
    //     "soPhieuAnToanThucPham": null,
    //     "tchucGdinh": this.detail.tchucGdinh,
    //     "tenHangHoa": null,
    //     "tenNganKho": null,
    //     "trangThai": this.detail.trangThai,
    //   };
    //   if (this.id > 0) {
    //     let res = await this.quanLyPhieuKiemTraChatLuongHangService.sua(
    //       body,
    //     );
    //     if (res.msg == MESSAGE.SUCCESS) {
    //       if (!isOther) {
    //         this.notification.success(
    //           MESSAGE.SUCCESS,
    //           MESSAGE.UPDATE_SUCCESS,
    //         );
    //         this.back();
    //       }
    //     } else {
    //       this.notification.error(MESSAGE.ERROR, res.msg);
    //     }
    //   } else {
    //     let res = await this.quanLyPhieuKiemTraChatLuongHangService.them(
    //       body,
    //     );
    //     if (res.msg == MESSAGE.SUCCESS) {
    //       if (!isOther) {
    //         this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
    //         this.back();
    //       }
    //     } else {
    //       this.notification.error(MESSAGE.ERROR, res.msg);
    //     }
    //   }
    //   this.spinner.hide();
    // } catch (e) {
    //   console.log('error: ', e);
    //   this.spinner.hide();
    //   this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    // }
  }

  // guiDuyet() {
  //   this.modal.confirm({
  //     nzClosable: false,
  //     nzTitle: 'Xác nhận',
  //     nzContent: 'Bạn có chắc chắn muốn gửi duyệt?',
  //     nzOkText: 'Đồng ý',
  //     nzCancelText: 'Không',
  //     nzOkDanger: true,
  //     nzWidth: 310,
  //     nzOnOk: async () => {
  //       this.spinner.show();
  //       try {
  //         await this.save(true);
  //         let body = {
  //           id: this.id,
  //           lyDoTuChoi: null,
  //           trangThai: this.globals.prop.NHAP_CHO_DUYET_LD_CHI_CUC,
  //         };
  //         let res =
  //           await this.quanLyPhieuKiemTraChatLuongHangService.updateStatus(
  //             body,
  //           );
  //         if (res.msg == MESSAGE.SUCCESS) {
  //           this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
  //           this.back();
  //         } else {
  //           this.notification.error(MESSAGE.ERROR, res.msg);
  //         }
  //         this.spinner.hide();
  //       } catch (e) {
  //         console.log('error: ', e);
  //         this.spinner.hide();
  //         this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
  //       }
  //     },
  //   });
  // }

  pheDuyet() {
    let trangThai = ''
    switch (this.formData.get('trangThai').value) {
      case STATUS.TU_CHOI_LDCC:
      case STATUS.DU_THAO: {
        trangThai = STATUS.CHO_DUYET_LDCC;
        break;
      }
      case STATUS.CHO_DUYET_LDCC: {
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
            await this.quanLyPhieuKiemTraChatLuongHangService.approve(
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
            await this.quanLyPhieuKiemTraChatLuongHangService.approve(
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

  cancelEdit(index: number): void {
    this.dataTableChiTieu[index].edit = false;
  }

  saveEdit(index: number): void {
    this.dataTableChiTieu[index].edit = false;
  }

  deleteRow(data: any) {
    this.detail.ketQuaKiemTra = this.detail?.ketQuaKiemTra.filter(x => x.stt != data.stt);
    this.sortTableId();
    this.updateEditCache();
  }

  editRow(index: number) {
    this.dataTableChiTieu[index].edit = true;
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


  async openDialogSoQd() {
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
        this.spinner.show();
        let dataRes = await this.quyetDinhNhapXuatService.getDetail(dataChose.id)
        const data = dataRes.data;
        this.formData.patchValue({
          soQdGiaoNvNh: data.soQd,
          idQdGiaoNvNh: data.id,
          ngayQdGiaoNvNh: data.ngayQdinh,
          loaiVthh: data.loaiVthh,
          cloaiVthh: data.cloaiVthh,
          tenLoaiVthh: data.tenLoaiVthh,
          tenCloaiVthh: data.tenCloaiVthh,
          moTaHangHoa: data.moTaHangHoa,
          soHd: data.soHd,
        });
        let dataChiCuc = data.dtlList.filter(item => item.maDvi == this.userInfo.MA_DVI);
        if (dataChiCuc.length > 0) {
          this.listDiaDiemNhap = dataChiCuc[0].diaDiemNhapList
        }
        let dmTieuChuan = await this.danhMucTieuChuanService.getDetailByMaHh(data.cloaiVthh);
        this.dataTableChiTieu = dmTieuChuan.data.children;
        this.dataTableChiTieu.forEach(element => {
          element.edit = false
        });
        console.log(this.dataTableChiTieu);
      }
      this.spinner.hide();
    });
  };

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
        dataHeader: ['Điểm kho', 'Nhà kho', 'Ngăn kho', 'Lô kho', 'Số lượng'],
        dataColumn: ['tenDiemKho', 'tenNhaKho', 'tenNganKho', 'tenLoKho', 'soLuong']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        console.log(data);
        this.formData.patchValue({
          maDiemKho: data.maDiemKho,
          tenDiemKho: data.tenDiemKho,
          maNhaKho: data.maNhaKho,
          tenNhaKho: data.tenNhaKho,
          maNganKho: data.maNganKho,
          tenNganKho: data.tenNganKho,
          maLoKho: data.maLoKho,
          tenLoKho: data.tenLoKho,
        })
      }
    });
  }
}
