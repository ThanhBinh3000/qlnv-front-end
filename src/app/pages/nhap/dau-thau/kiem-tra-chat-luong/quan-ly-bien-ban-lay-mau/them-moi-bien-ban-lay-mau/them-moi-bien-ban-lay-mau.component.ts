import { L, M } from '@angular/cdk/keycodes';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import dayjs from 'dayjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogTableSelectionComponent } from 'src/app/components/dialog/dialog-table-selection/dialog-table-selection.component';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { STATUS } from 'src/app/constants/status';
import { BienBanLayMau } from 'src/app/models/BienBanLayMau';
import { PhuongPhapLayMau } from 'src/app/models/PhuongPhapLayMau';
import { UserLogin } from 'src/app/models/userlogin';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { QuanLyBienBanLayMauService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/kiemtra-cl/quanLyBienBanLayMau.service';
import { QuanLyPhieuNhapDayKhoService } from 'src/app/services/quanLyPhieuNhapDayKho.service';
import { QuyetDinhGiaoNhapHangService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/qd-giaonv-nh/quyetDinhGiaoNhapHang.service';
import { ThongTinHopDongService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/hop-dong/thongTinHopDong.service';
import { UserService } from 'src/app/services/user.service';
import { thongTinTrangThaiNhap } from 'src/app/shared/commonFunction';
import { Globals } from 'src/app/shared/globals';
import { HelperService } from 'src/app/services/helper.service';

@Component({
  selector: 'them-moi-bien-ban-lay-mau',
  templateUrl: './them-moi-bien-ban-lay-mau.component.html',
  styleUrls: ['./them-moi-bien-ban-lay-mau.component.scss'],
})
export class ThemMoiBienBanLayMauKhoComponent implements OnInit {
  @Input() id: number;
  @Input() isView: boolean;
  @Input() isTatCa: boolean;
  @Input() typeVthh: string;
  @Output()
  showListEvent = new EventEmitter<any>();

  formData: FormGroup;
  maSuffix: string = '/BBLM-CCDTVP';
  listFileDinhKem: any[] = [];
  listDaiDienCuc: any[] = [];
  listDaiDienChiCuc: any[] = [];
  userInfo: UserLogin;
  listDiemKho: any[] = [];
  listNhaKho: any[] = [];
  listNganKho: any[] = [];
  listNganLo: any[] = [];
  listDiaDiemNhap: any[] = [];

  bienBanLayMau: any;
  detailHopDong: any = {};
  detailGiaoNhap: any = {};
  maVthh: string;
  phuongPhapLayMaus: Array<PhuongPhapLayMau>;
  listBienBan: any[] = [];
  listSoQuyetDinh: any[] = [];
  listBienBanDayKho: any[] = [];
  listHopDong: any[] = [];
  listNam: any[] = [];
  capCuc: string = '2';
  capChiCuc: string = '3';

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
  STATUS = STATUS
  constructor(
    private spinner: NgxSpinnerService,
    private bienBanLayMauService: QuanLyBienBanLayMauService,
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
    private fb: FormBuilder,
    private helperService: HelperService,
  ) {
    this.formData = this.fb.group({
      id: [],
      trangThai: [STATUS.DU_THAO],
      tenTrangThai: ['Dự Thảo'],
      lyDoTuChoi: [''],
      loaiBienBan: [''],
      nam: [dayjs().get('year'), [Validators.required]],
      soBienBan: ['', [Validators.required]],
      tenDvi: ['', [Validators.required]],
      maDvi: ['', [Validators.required]],
      maQhns: [''],
      loaiVthh: [''],
      tenLoaiVthh: [''],
      cloaiVthh: [''],
      tenCloaiVthh: [''],
      moTaHangHoa: [''],
      maDiemKho: ['', [Validators.required]],
      tenDiemKho: ['', [Validators.required]],
      maNhaKho: ['', [Validators.required]],
      tenNhaKho: ['', [Validators.required]],
      maNganKho: ['', [Validators.required]],
      tenNganKho: ['', [Validators.required]],
      maLoKho: [''],
      tenLoKho: [''],
      soQdGiaoNvNh: ['', [Validators.required]],
      ngayQdGiaoNvNh: ['', [Validators.required]],
      idQdGiaoNvNh: ['', [Validators.required]],
      soHd: [''],
      ngayLayMau: [''],
      dviKiemNghiem: [''],
      soBbNhapDayKho: [''],
      idBbNhapDayKho: [''],
      diaDiemLayMau: [''],

      soLuongMau: [''],
      ppLayMau: [''],
      chiTieuKiemTra: [''],
      ketQuaNiemPhong: ['']
    });
  }

  async ngOnInit() {
    this.userInfo = this.userService.getUserLogin();
    for (let i = -3; i < 23; i++) {
      this.listNam.push({
        value: dayjs().get('year') + i,
        text: dayjs().get('year') + i,
      });
    }
    await Promise.all([
      // this.loadPhuongPhapLayMau(),
      this.loadLoaiBienBan(),
      this.loadSoQuyetDinh(),
      this.loadBienBanDayKho(),
    ]);
    if (this.id > 0) {
      await this.loadBienbanLayMau();
    }
    else {
      await this.initForm();
    }
  }

  isDisableField() {
    if (this.bienBanLayMau && (this.bienBanLayMau.trangThai == this.globals.prop.NHAP_CHO_DUYET_TP || this.bienBanLayMau.trangThai == this.globals.prop.NHAP_CHO_DUYET_LD_CHI_CUC || this.bienBanLayMau.trangThai == this.globals.prop.NHAP_DA_DUYET_LD_CHI_CUC)) {
      return true;
    }
  }

  async initForm() {
    let id = await this.userService.getId('BB_LAY_MAU_SEQ')
    this.formData.patchValue({
      tenDvi: this.userInfo.TEN_DVI,
      maDvi: this.userInfo.MA_DVI,
      loaiBienBan: this.listBienBan[0].ma,
      soBienBan: `${id}/${this.formData.get('nam').value}/BBLM-CCDTVP`
    });
  }

  addDaiDien(type) {
    if (!this.listDaiDien) {
      this.listDaiDien = [];
    }
    let item = {
      "bbLayMauId": null,
      "daiDien": null,
      "id": null,
      "idTemp": new Date().getTime(),
      "loaiDaiDien": type
    }
    this.listDaiDien.push(item);
  }

  xoaDaiDien(item) {
    this.listDaiDien = this.listDaiDien.filter(x => x.idTemp != item.idTemp);
  }

  async loadBienBanDayKho() {
    let param = {
      "capDvis": '3',
      "maDvi": this.userInfo.MA_DVI,
      "maVatTuCha": this.isTatCa ? null : this.typeVthh,
      "pageNumber": 1,
      "pageSize": 1000,
      "trangThai": this.globals.prop.NHAP_DA_DUYET_LD_CHI_CUC,
    }
    let res = await this.quanLyPhieuNhapDayKhoService.timKiem(param);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.listBienBanDayKho = data.content;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async loadSoQuyetDinh() {
    let body = {
      "maDvi": this.userInfo.MA_DVI,
      "loaiVthh": this.typeVthh,
      "namNhap": this.formData.get('nam').value,
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

  isAction(): boolean {
    return (
      this.bienBanLayMau.trangThai === this.globals.prop.NHAP_DU_THAO ||
      !this.isView
    );
  }

  async save(isGuiDuyet?: boolean) {
    this.spinner.show();
    this.helperService.markFormGroupTouched(this.formData);
    if (!this.formData.valid) {
      this.spinner.hide();
      return;
    }
    let body = this.formData.value;
    body.fileDinhKems = this.listFileDinhKem;
    body.chiTiets = [...this.listDaiDienChiCuc, ...this.listDaiDienCuc];
    let res;
    if (this.formData.get('id').value > 0) {
      res = await this.bienBanLayMauService.update(body);
    } else {
      res = await this.bienBanLayMauService.create(body);
    }
    if (res.msg == MESSAGE.SUCCESS) {
      if (isGuiDuyet) {
        this.spinner.hide();
        this.id = res.data.id;
        this.pheDuyet();
      } else {
        if (this.formData.get('id').value) {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
          this.redirectBienBanLayMau();
        } else {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
          this.redirectBienBanLayMau();
        }
        this.spinner.hide();
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
      this.spinner.hide();
    }

    // let body = {
    //   "bbNhapDayKhoId": this.bienBanLayMau.bbNhapDayKhoId,
    //   "chiTiets": this.listDaiDien,
    //   "chiTieuKiemTra": this.bienBanLayMau.chiTieuKiemTra,
    //   "diaDiemLayMau": this.bienBanLayMau.diaDiemLayMau,
    //   "donViCungCap": this.bienBanLayMau.donViCungCap,
    //   "hopDongId": this.bienBanLayMau.hopDongId,
    //   "id": this.id,
    //   "ketQuaNiemPhong": this.bienBanLayMau.ketQuaNiemPhong,
    //   "maDiemKho": null,
    //   "maNganKho": null,
    //   "maNganLo": null,
    //   "maNhaKho": null,
    //   "maVatTu": null,
    //   "maVatTuCha": this.bienBanLayMau.maVatTuCha,
    //   "ngayHopDong": this.bienBanLayMau.ngayHopDong ? dayjs(this.bienBanLayMau.ngayHopDong).format('YYYY-MM-DD') : null,
    //   "ngayLayMau": this.bienBanLayMau.ngayLayMau ? dayjs(this.bienBanLayMau.ngayLayMau).format('YYYY-MM-DD') : null,
    //   "ppLayMau": this.bienBanLayMau.ppLayMau,
    //   "qdgnvnxId": this.bienBanLayMau.qdgnvnxId,
    //   "soBienBan": this.bienBanLayMau.soBienBan,
    //   "soLuongMau": this.bienBanLayMau.soLuongMau,
    // }
    // if (this.id > 0) {
    //   this.bienBanLayMauService.sua(body).then((res) => {
    //     if (res.msg == MESSAGE.SUCCESS) {
    //       if (isGuiDuyet) {
    //         let body = {
    //           id: res.data.id,
    //           lyDo: null,
    //           trangThai: this.globals.prop.NHAP_CHO_DUYET_LD_CHI_CUC,
    //         };
    //         this.bienBanLayMauService.updateStatus(body);
    //         if (res.msg == MESSAGE.SUCCESS) {
    //           this.notification.success(
    //             MESSAGE.SUCCESS,
    //             MESSAGE.UPDATE_SUCCESS,
    //           );
    //           this.redirectBienBanLayMau();
    //         } else {
    //           this.notification.error(MESSAGE.ERROR, res.msg);
    //         }
    //       } else {
    //         this.notification.success(
    //           MESSAGE.SUCCESS,
    //           MESSAGE.UPDATE_SUCCESS,
    //         );
    //         this.redirectBienBanLayMau();
    //       }
    //     } else {
    //       this.notification.error(MESSAGE.ERROR, res.msg);
    //     }
    //   })
    //     .catch((e) => {
    //       console.error('error: ', e);
    //       this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    //     })
    //     .finally(() => {
    //       this.spinner.hide();
    //     });
    // } else {
    //   this.bienBanLayMauService.them(body).then((res) => {
    //     if (res.msg == MESSAGE.SUCCESS) {
    //       if (isGuiDuyet) {
    //         let body = {
    //           id: res.data.id,
    //           lyDo: null,
    //           trangThai: this.globals.prop.NHAP_CHO_DUYET_LD_CHI_CUC,
    //         };
    //         this.bienBanLayMauService.updateStatus(body);
    //         if (res.msg == MESSAGE.SUCCESS) {
    //           this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
    //           this.redirectBienBanLayMau();
    //         } else {
    //           this.notification.error(MESSAGE.ERROR, res.msg);
    //         }
    //       } else {
    //         this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
    //         this.redirectBienBanLayMau();
    //       }
    //     } else {
    //       this.notification.error(MESSAGE.ERROR, res.msg);
    //     }
    //   }).catch((e) => {
    //     console.error('error: ', e);
    //     this.notification.error(
    //       MESSAGE.ERROR,
    //       e.error.errors[0].defaultMessage,
    //     );
    //   })
    //     .finally(() => {
    //       this.spinner.hide();
    //     });
    // }
  }

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
      nzContent: 'Bạn có chắc chắn muốn duyệt ?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: async () => {
        this.spinner.show();
        try {
          let body = {
            id: this.id,
            trangThai: trangThai,
          };
          const res = await this.bienBanLayMauService.approve(body);
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
            lyDoTuChoi: text,
            trangThai: STATUS.TU_CHOI_LDCC,
          };
          const res = await this.bienBanLayMauService.approve(body);
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

  // async getHopDong(id) {
  //   if (id) {
  //     const body = {
  //       str: id
  //     }
  //     let res = await this.thongTinHopDongService.loadChiTietSoHopDong(body);
  //
  //     if (res.msg == MESSAGE.SUCCESS) {
  //       this.detailHopDong = res.data;
  //       this.bienBanLayMau.canCu = this.detailHopDong.canCu;
  //       this.bienBanLayMau.ngayHopDong = this.detailHopDong.ngayKy;
  //       this.bienBanLayMau.hopDongId = this.detailHopDong.id;
  //       this.bienBanLayMau.soHopDong = this.detailHopDong.soHd;
  //       this.bienBanLayMau.tenDonViCCHang = this.detailHopDong.tenDvi;
  //       this.bienBanLayMau.soLuongMau = this.detailHopDong.soLuong;
  //     }
  //     else {
  //       this.notification.error(MESSAGE.ERROR, res.msg);
  //     }
  //   }
  // }

  async loadPhuongPhapLayMau() {
    this.danhMucService.danhMucChungGetAll("PP_LAY_MAU").then(res => {
      if (res.msg == MESSAGE.SUCCESS) {
        this.phuongPhapLayMaus = res.data;
      }
      else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }).catch(err => {
      this.notification.error(MESSAGE.ERROR, err.msg);
    })
  }

  async loadLoaiBienBan() {
    await this.danhMucService.danhMucChungGetAll("LOAI_BIEN_BAN").then(res => {
      if (res.msg == MESSAGE.SUCCESS) {
        this.listBienBan = res.data;
      }
      else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }).catch(err => {
      this.notification.error(MESSAGE.ERROR, err.msg);
    })
  }

  async loadBienbanLayMau() {
    this.spinner.show()
    let res = await this.bienBanLayMauService.getDetail(+this.id);
    if (res.msg == MESSAGE.SUCCESS) {
      const data = res.data;
      this.helperService.bidingDataInFormGroup(this.formData, data);
      this.listDaiDienChiCuc = data.chiTiets.filter(x => x.loaiDaiDien == 'CHI_CUC')
      this.listDaiDienCuc = data.chiTiets.filter(x => x.loaiDaiDien == 'CUC')
      console.log(this.formData.value)
    }
    else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    this.spinner.hide()

  }

  openDialogQdGiaoNhang() {
    const modalQD = this.modal.create({
      nzTitle: 'Thông tin quyết định giao nhiện vụ nhập hàng',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listSoQuyetDinh.filter(x => !x.loaiVthh.startsWith("02")),
        dataHeader: ['Số quyết định', 'Loại hàng hóa', 'Chủng loại hàng hóa'],
        dataColumn: ['soQd', 'tenLoaiVthh', 'tenCloaiVthh']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        this.spinner.show();
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
        let res = await this.quyetDinhGiaoNhapHangService.getDetail(data.id);
        if (res.msg == MESSAGE.SUCCESS) {
          const dataQd = res.data;
          let dataChiCucLogin = dataQd.dtlList.filter(x => x.maDvi == this.userInfo.MA_DVI);
          if (dataChiCucLogin.length > 0) {
            this.listDiaDiemNhap = dataChiCucLogin[0].diaDiemNhapList;
          }
        }
        this.spinner.hide();
      }
    });
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
