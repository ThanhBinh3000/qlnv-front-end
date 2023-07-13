import {
  Component,
  Input,
  OnInit
} from '@angular/core';
import {Validators} from '@angular/forms';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NgxSpinnerService} from 'ngx-spinner';
import {MESSAGE} from 'src/app/constants/message';
import {Base2Component} from 'src/app/components/base2/base2.component';
import {HttpClient} from '@angular/common/http';
import {StorageService} from 'src/app/services/storage.service';
import {DanhMucService} from 'src/app/services/danhmuc.service';
import dayjs from 'dayjs';
import {
  DialogTableSelectionComponent
} from 'src/app/components/dialog/dialog-table-selection/dialog-table-selection.component';
import {STATUS} from 'src/app/constants/status';
import {
  QuyetDinhNvXuatBttService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/quyet-dinh-nv-xuat-btt/quyet-dinh-nv-xuat-btt.service';
import {
  BienBanLayMauBttService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/ktra-cluong-btt/bien-ban-lay-mau-btt.service';
import {HopDongBttService} from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/hop-dong-btt/hop-dong-btt.service';
import {BangKeBttService} from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/hop-dong-btt/bang-ke-btt.service';

@Component({
  selector: 'app-them-moi-bien-ban-lay-mau-btt',
  templateUrl: './them-moi-bien-ban-lay-mau-btt.component.html',
  styleUrls: ['./them-moi-bien-ban-lay-mau-btt.component.scss']
})
export class ThemMoiBienBanLayMauBttComponent extends Base2Component implements OnInit {
  @Input() id: number;
  @Input() loaiVthh: string;
  @Input() trangThaiBb: string;
  @Input() idQdNv: number;
  @Input() isViewOnModal: boolean;

  listBienBan: any[] = [];
  listDiaDiemXuatHang: any[] = [];
  phuongPhapLayMau: any[] = [];
  canCuPhapLy: any[] = [];
  fileNiemPhong: any[] = [];
  listDaiDienCuc: any[] = [];
  listDaiDienChiCuc: any[] = [];
  dsBienBanLayMau: any[] = [];
  flagInit: Boolean = false;
  maBb: string;

  dsSoQuyetDinhNv: any[] = [];
  dsSoHopDong: any[] = []
  dsBangkeBanLe: any[] = []

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private quyetDinhNvXuatBttService: QuyetDinhNvXuatBttService,
    private bienBanLayMauBttService: BienBanLayMauBttService,
    private danhMucService: DanhMucService,
    private hopDongBttService: HopDongBttService,
    private bangKeBttService: BangKeBttService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, bienBanLayMauBttService);
    this.formData = this.fb.group({
      loaiBienBan: ['', [Validators.required]],
      id: [],
      namKh: [dayjs().get('year')],
      maDvi: [''],
      tenDvi: [''],
      maQhns: [''],
      idQdNv: [''],
      soQdNv: ['', [Validators.required]],
      ngayQdNv: [''],
      idHd: [''],
      soHd: [''],
      ngayKyHd: [''],
      idKtv: [''],
      tenKtv: [''],
      soBienBan: [''],
      ngayLayMau: [''],
      dviKnghiem: [''],
      ddiemLayMau: [''],
      loaiVthh: [''],
      tenLoaiVthh: [''],
      cloaiVthh: [''],
      tenCloaiVthh: [''],
      moTaHangHoa: [''],
      idDdiemXh: [''],
      maDiemKho: ['', [Validators.required]],
      tenDiemKho: ['', [Validators.required]],
      maNhaKho: ['', [Validators.required]],
      tenNhaKho: ['', [Validators.required]],
      maNganKho: ['', [Validators.required]],
      tenNganKho: ['', [Validators.required]],
      maLoKho: [''],
      tenLoKho: [''],
      soLuongLayMau: [''],
      ppLayMau: [''],
      chiTieuKiemTra: [''],
      ketQuaNiemPhong: [],
      flagNiemPhong: [],
      trangThai: [''],
      tenTrangThai: [''],
      lyDoTuChoi: [''],
      pthucBanTrucTiep: [''],
      phanLoai: [''],
      idBangkeBanLe: [],
      soBangKeBanLe: [''],
      ngayTaoBangKe: [''],
    })
  }

  async ngOnInit() {
    try {
      await this.spinner.show();
      this.maBb = 'BBLM-' + this.userInfo.DON_VI.tenVietTat;
      if (this.id > 0) {
        await this.loadChitiet();
      } else {
        this.initForm();
      }
      await this.loadDataComboBox();
      await this.spinner.hide();
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, 'Có lỗi xảy ra.');
      this.spinner.hide();
    } finally {
      this.spinner.hide();
      this.flagInit = true;
    }
  }

  async loadDataComboBox() {
    // Loại biên bản
    await this.danhMucService.danhMucChungGetAll("LOAI_BIEN_BAN").then(res => {
      if (res.msg == MESSAGE.SUCCESS) {
        this.listBienBan = res.data;
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }).catch(err => {
      this.notification.error(MESSAGE.ERROR, err.msg);
    });
    // PP lây mẫu
    this.danhMucService.danhMucChungGetAll("PP_LAY_MAU").then(res => {
      if (res.msg == MESSAGE.SUCCESS) {
        this.phuongPhapLayMau = res.data;
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }).catch(err => {
      this.notification.error(MESSAGE.ERROR, err.msg);
    })
  }

  async initForm() {
    let id = await this.userService.getId('XH_BB_LAY_MAU_BTT_HDR_SEQ')
    this.formData.patchValue({
      soBienBan: `${id}/${this.formData.get('namKh').value}/${this.maBb}`,
      ngayLayMau: dayjs().format('YYYY-MM-DD'),
      maDvi: this.userInfo.MA_DVI,
      tenDvi: this.userInfo.TEN_DVI,
      maQhns: this.userInfo.DON_VI.maQhns,
      tenKtv: this.userInfo.TEN_DAY_DU,
      trangThai: STATUS.DU_THAO,
      tenTrangThai: 'Dự Thảo',
      phanLoai: 'HĐ',
    });
    if (this.idQdNv) {
      await this.bindingDataQdNv(this.idQdNv);
    }
  }

  async loadChitiet() {
    if (this.id > 0) {
      let data = await this.detail(this.id);
      this.listDaiDienChiCuc = data.children.filter(x => x.loaiDaiDien == 'CHI_CUC')
      this.listDaiDienCuc = data.children.filter(x => x.loaiDaiDien == 'CUC')
      this.formData.patchValue({
        flagNiemPhong: this.formData.value.ketQuaNiemPhong == 1,
      })
      this.fileDinhKem = data.fileDinhKems;
      this.canCuPhapLy = data.canCuPhapLy;
      this.fileNiemPhong = data.fileNiemPhong;
    }
  }

  async openDialogSoQdNv() {
    await this.spinner.show();
    let body = {
      namKh: this.formData.value.namKh,
      loaiVthh: this.loaiVthh,
      trangThai: this.STATUS.BAN_HANH,
    }
    let res = await this.quyetDinhNvXuatBttService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data.content;
      if (data && data.length > 0) {
        this.dsSoQuyetDinhNv = data;
        this.dsSoQuyetDinhNv = this.dsSoQuyetDinhNv.filter(item => item.children.some(child => child.maDvi === this.userInfo.MA_DVI));
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    const modalQD = this.modal.create({
      nzTitle: 'DANH SÁCH SỐ QUYẾT ĐỊNH GIAO NHIỆM VỤ XUẤT HÀNG',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.dsSoQuyetDinhNv,
        dataHeader: ['Số quyết định', 'Ngày quyết định', 'Loại hàng hóa'],
        dataColumn: ['soQdNv', 'ngayQdNv', 'tenLoaiVthh'],
      },
    })
    modalQD.afterClose.subscribe(async (dataChose) => {
      if (dataChose) {
        await this.bindingDataQdNv(dataChose.id);
      }
    });
    await this.spinner.hide();
  }

  changeSoQd(event) {
    if (this.flagInit && event && event !== this.formData.value.soQdNv) {
      this.formData.patchValue({
        idDdiemXh: null,
        maDiemKho: null,
        tenDiemKho: null,
        maNhaKho: null,
        tenNhaKho: null,
        maNganKho: null,
        tenNganKho: null,
        maLoKho: null,
        tenLoKho: null,
      });
    }
  }

  async bindingDataQdNv(idQdNv) {
    await this.spinner.show();
    if (idQdNv > 0) {
      await this.quyetDinhNvXuatBttService.getDetail(idQdNv)
        .then(async (res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            const dataQd = res.data
            this.formData.patchValue({
              idQdNv: dataQd.id,
              soQdNv: dataQd.soQdNv,
              ngayQdNv: dataQd.ngayQdNv,
              idHd: dataQd.pthucBanTrucTiep == "01" ? dataQd.idHd : '',
              soHd: dataQd.pthucBanTrucTiep == "01" ? dataQd.soHd : '',
              ngayKyHd: dataQd.pthucBanTrucTiep == "01" ? dataQd.ngayKyHd : '',
              loaiVthh: dataQd.loaiVthh,
              tenLoaiVthh: dataQd.tenLoaiVthh,
              cloaiVthh: dataQd.cloaiVthh,
              tenCloaiVthh: dataQd.tenCloaiVthh,
              moTaHangHoa: dataQd.moTaHangHoa,
              pthucBanTrucTiep: dataQd.pthucBanTrucTiep,
              phanLoai: dataQd.pthucBanTrucTiep == "03" ? "BL" : "HĐ",
            });
            await this.listBienBanLayMau(dataQd.soQdNv);
            if (dataQd.pthucBanTrucTiep && dataQd.pthucBanTrucTiep != "02") {
              let dataChiCuc = dataQd.children.filter(item => item.maDvi == this.userInfo.MA_DVI);
              if (dataChiCuc) {
                this.listDiaDiemXuatHang = [];
                dataChiCuc.forEach(e => {
                  this.listDiaDiemXuatHang = [...this.listDiaDiemXuatHang, e.children];
                });
                this.listDiaDiemXuatHang = this.listDiaDiemXuatHang.flat();
                let set = new Set(this.dsBienBanLayMau.map(item => JSON.stringify({
                  maDiemKho: item.maDiemKho,
                  maNhaKho: item.maNhaKho,
                  maNganKho: item.maNganKho,
                  maLoKho: item.maLoKho,
                  idDdiemXh: item.idDdiemXh
                })));
                this.listDiaDiemXuatHang = this.listDiaDiemXuatHang.filter(item => {
                  const key = JSON.stringify({
                    maDiemKho: item.maDiemKho,
                    maNhaKho: item.maNhaKho,
                    maNganKho: item.maNganKho,
                    maLoKho: item.maLoKho,
                    idDdiemXh: item.id
                  });
                  return !set.has(key);
                });
              }
            }
          }
        }).catch((e) => {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        });
    }
    await this.spinner.hide();
  }

  async searchHopDong() {
    if (this.formData.get('pthucBanTrucTiep').value != '02') {
      return
    }
    await this.spinner.show();
    let body = {
      namHd: this.formData.value.namKh,
      loaiVthh: this.loaiVthh,
      soQdNv: this.formData.value.soQdNv,
      trangThai: STATUS.DA_KY,
    }
    let res = await this.hopDongBttService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data.content
      if (data && data.length > 0) {
        this.dsSoHopDong = data;
        this.dsSoHopDong = this.dsSoHopDong.filter(item => item.maDvi === this.userInfo.MA_DVI);
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    this.spinner.hide();
    const modalQD = this.modal.create({
      nzTitle: 'DANH SÁCH SỐ HỢP ĐỒNG BÁN TRƯC TIẾP',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.dsSoHopDong,
        dataHeader: ['Số hợp đồng', 'Tên hợp đồng', 'Loại hàng hóa'],
        dataColumn: ['soHd', 'tenHd', 'tenLoaiVthh'],
      },
    })
    modalQD.afterClose.subscribe(async (dataChose) => {
      if (dataChose) {
        await this.bindingDataHd(dataChose.id);
      }
    });
    await this.spinner.hide();
  }

  async bindingDataHd(idHd) {
    await this.spinner.show();
    if (idHd > 0) {
      await this.hopDongBttService.getDetail(idHd)
        .then((res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            const dataHd = res.data
            this.formData.patchValue({
              idHd: dataHd.id,
              soHd: dataHd.soHd,
              ngayKyHd: dataHd.ngayPduyet,
            });
            if (dataHd.xhHopDongBttDviList && dataHd.xhHopDongBttDviList.length > 0) {
              this.listDiaDiemXuatHang = dataHd.xhHopDongBttDviList;
              this.listDiaDiemXuatHang = this.listDiaDiemXuatHang.flat();
              let set = new Set(this.dsBienBanLayMau.map(item => JSON.stringify({
                maDiemKho: item.maDiemKho,
                maNhaKho: item.maNhaKho,
                maNganKho: item.maNganKho,
                maLoKho: item.maLoKho,
                idDdiemXh: item.idDdiemXh
              })));
              this.listDiaDiemXuatHang = this.listDiaDiemXuatHang.filter(item => {
                const key = JSON.stringify({
                  maDiemKho: item.maDiemKho,
                  maNhaKho: item.maNhaKho,
                  maNganKho: item.maNganKho,
                  maLoKho: item.maLoKho,
                  idDdiemXh: item.id
                });
                return !set.has(key);
              });
            }
          }
        }).catch((e) => {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        });
    }
    await this.spinner.hide();
  }

  async searchBangKeBanLe() {
    if (this.formData.get('pthucBanTrucTiep').value != '03') {
      return
    }
    await this.spinner.show();
    let body = {
      namHd: this.formData.value.namKh,
      loaiVthh: this.loaiVthh,
      soQdNv: this.formData.value.soQdNv,
    }
    let res = await this.bangKeBttService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data.content;
      if (data && data.length > 0) {
        this.dsBangkeBanLe = data;
        this.dsBangkeBanLe = this.dsBangkeBanLe.filter(item => item.maDvi === this.userInfo.MA_DVI);
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    this.spinner.hide();
    const modalQD = this.modal.create({
      nzTitle: 'DANH SÁCH BẢNG KÊ BÁN LẺ',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.dsBangkeBanLe,
        dataHeader: ['Số bảng kê', 'Tên người mua', 'Loại hàng hóa'],
        dataColumn: ['soBangKe', 'tenNguoiMua', 'tenLoaiVthh'],
      },
    })
    modalQD.afterClose.subscribe(async (dataChose) => {
      if (dataChose) {
        await this.bindingDataBangKe(dataChose.id);
      }
    });
    await this.spinner.hide();
  }

  async bindingDataBangKe(id) {
    await this.spinner.show();
    if (id > 0) {
      await this.bangKeBttService.getDetail(id)
        .then((res) => {
          if (res.msg == MESSAGE.SUCCESS) {
            const dataBl = res.data;
            this.formData.patchValue({
              idBangKeBanLe: dataBl.id,
              soBangKeBanLe: dataBl.soBangKe,
              ngayTaoBangKe: dataBl.ngayTao
            });
          }
        }).catch((e) => {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        });
    }
    await this.spinner.hide();

  }

  async listBienBanLayMau(event) {
    await this.spinner.show();
    let body = {
      soQd: event,
      loaiVthh: this.loaiVthh,
      namKh: this.formData.value.namKh,
    }
    let res = await this.bienBanLayMauBttService.search(body)
    if (res.msg == MESSAGE.SUCCESS) {
      const data = res.data
      if (data && data.content && data.content.length > 0) {
        this.dsBienBanLayMau = data.content
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  openDialogDdiemNhapHang() {
    const modalQD = this.modal.create({
      nzTitle: 'DANH SÁCH ĐỊA ĐIỂM XUẤT HÀNG',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listDiaDiemXuatHang,
        dataHeader: ['Điểm kho', 'Nhà kho', 'Ngăn kho', 'Lô kho'],
        dataColumn: ['tenDiemKho', 'tenNhaKho', 'tenNganKho', 'tenLoKho']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        this.formData.patchValue({
          idDdiemXh: data.id,
          maDiemKho: data.maDiemKho,
          tenDiemKho: data.tenDiemKho,
          maNhaKho: data.maNhaKho,
          tenNhaKho: data.tenNhaKho,
          maNganKho: data.maNganKho,
          tenNganKho: data.tenNganKho,
          maLoKho: data.maLoKho,
          tenLoKho: data.tenLoKho,
        });
      }
    });
  }

  isDisable() {
    let trangThai = this.formData.value.trangThai;
    if (trangThai == STATUS.CHO_DUYET_LDCC || trangThai == STATUS.DA_DUYET_LDCC) {
      return true;
    } else {
      return false;
    }
  }

  isDisabledQD() {
    if (this.formData.value.id == null) {
      return false
    } else {
      return true;
    }
  }

  async save(isGuiDuyet?) {
    this.setValidator(isGuiDuyet);
    let body = this.formData.value;
    body.children = [...this.listDaiDienChiCuc, ...this.listDaiDienCuc];
    body.ketQuaNiemPhong = body.flagNiemPhong ? 1 : 0;
    body.fileDinhKems = this.fileDinhKem;
    body.canCuPhapLy = this.canCuPhapLy;
    body.fileNiemPhong = this.fileNiemPhong
    let data = await this.createUpdate(body);
    if (data) {
      if (isGuiDuyet) {
        this.id = data.id
        this.pheDuyet(true);
      } else {
        this.id = data.id
        this.loadChitiet();
      }
    }
  }

  pheDuyet(isPheDuyet) {
    let trangThai = ''
    let msg = ''
    if (isPheDuyet) {
      switch (this.formData.value.trangThai) {
        case STATUS.TU_CHOI_LDCC:
        case STATUS.DU_THAO:
          trangThai = STATUS.CHO_DUYET_LDCC
          msg = 'Bạn có muốn gửi duyệt ?'
          break;
        case STATUS.CHO_DUYET_LDCC:
          trangThai = STATUS.DA_DUYET_LDCC
          msg = 'Bạn có muốn duyệt bản ghi ?'
          break;
      }
      this.approve(this.id, trangThai, msg);
    } else {
      switch (this.formData.value.trangThai) {
        case STATUS.CHO_DUYET_LDCC:
          trangThai = STATUS.TU_CHOI_LDCC
          break;
      }
      this.reject(this.id, trangThai)
    }
  }

  setValidator(isGuiDuyet) {
    if (isGuiDuyet) {
      this.formData.controls["namKh"].setValidators([Validators.required]);
      this.formData.controls["maQhns"].setValidators([Validators.required]);
      this.formData.controls["maDvi"].setValidators([Validators.required]);
      this.formData.controls["tenDvi"].setValidators([Validators.required]);
      this.formData.controls["tenKtv"].setValidators([Validators.required]);
      this.formData.controls["soBienBan"].setValidators([Validators.required]);
      this.formData.controls["ngayLayMau"].setValidators([Validators.required]);
      this.formData.controls["dviKnghiem"].setValidators([Validators.required]);
      this.formData.controls["ddiemLayMau"].setValidators([Validators.required]);
      this.formData.controls["loaiVthh"].setValidators([Validators.required]);
      this.formData.controls["tenLoaiVthh"].setValidators([Validators.required]);
      this.formData.controls["cloaiVthh"].setValidators([Validators.required]);
      this.formData.controls["tenCloaiVthh"].setValidators([Validators.required]);
      this.formData.controls["soLuongLayMau"].setValidators([Validators.required]);
      this.formData.controls["ppLayMau"].setValidators([Validators.required]);
      this.formData.controls["chiTieuKiemTra"].setValidators([Validators.required]);
    } else {
      this.formData.controls["namKh"].clearValidators();
      this.formData.controls["maQhns"].clearValidators();
      this.formData.controls["maDvi"].clearValidators();
      this.formData.controls["tenDvi"].clearValidators();
      this.formData.controls["tenKtv"].clearValidators();
      this.formData.controls["soBienBan"].clearValidators();
      this.formData.controls["ngayLayMau"].clearValidators();
      this.formData.controls["dviKnghiem"].clearValidators();
      this.formData.controls["ddiemLayMau"].clearValidators();
      this.formData.controls["loaiVthh"].clearValidators();
      this.formData.controls["tenLoaiVthh"].clearValidators();
      this.formData.controls["cloaiVthh"].clearValidators();
      this.formData.controls["tenCloaiVthh"].clearValidators();
      this.formData.controls["soLuongLayMau"].clearValidators();
      this.formData.controls["ppLayMau"].clearValidators();
      this.formData.controls["chiTieuKiemTra"].clearValidators();
    }
    if (this.formData.get('phanLoai').value == 'HĐ') {
      this.formData.controls["soHd"].setValidators([Validators.required]);
      this.formData.controls["ngayKyHd"].setValidators([Validators.required]);
      this.formData.controls["soBangKeBanLe"].clearValidators();
      this.formData.controls["ngayTaoBangKe"].clearValidators();
    }
    if (this.formData.get('phanLoai').value == 'BL') {
      this.formData.controls["soBangKeBanLe"].setValidators([Validators.required]);
      this.formData.controls["ngayTaoBangKe"].setValidators([Validators.required]);
      this.formData.controls["soHd"].clearValidators();
      this.formData.controls["ngayKyHd"].clearValidators();
    }
  }
}
