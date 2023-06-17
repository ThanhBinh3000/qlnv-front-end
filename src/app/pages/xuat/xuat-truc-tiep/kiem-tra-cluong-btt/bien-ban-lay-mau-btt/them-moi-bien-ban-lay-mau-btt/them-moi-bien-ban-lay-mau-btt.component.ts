import {
  Component,
  Input,
  OnInit
} from '@angular/core';
import { Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import dayjs from 'dayjs';
import { DialogTableSelectionComponent } from 'src/app/components/dialog/dialog-table-selection/dialog-table-selection.component';
import { STATUS } from 'src/app/constants/status';
import { QuyetDinhNvXuatBttService } from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/quyet-dinh-nv-xuat-btt/quyet-dinh-nv-xuat-btt.service';
import { BienBanLayMauBttService } from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/ktra-cluong-btt/bien-ban-lay-mau-btt.service';
import { HopDongBttService } from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/hop-dong-btt/hop-dong-btt.service';
import { BangKeBttService } from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/hop-dong-btt/bang-ke-btt.service';

@Component({
  selector: 'app-them-moi-bien-ban-lay-mau-btt',
  templateUrl: './them-moi-bien-ban-lay-mau-btt.component.html',
  styleUrls: ['./them-moi-bien-ban-lay-mau-btt.component.scss']
})
export class ThemMoiBienBanLayMauBttComponent extends Base2Component implements OnInit {
  @Input() id: number;
  @Input() loaiVthh: string;
  @Input() trangThaiBb: string;
  @Input() idQdGiaoNvXh: number;
  @Input() isViewOnModal: boolean;

  listBienBan: any[] = [];
  listDiaDiemXh: any[] = [];
  phuongPhapLayMaus: any[] = [];
  canCuPhapLy: any[] = [];
  fileNiemPhong: any[] = [];
  listDaiDienCuc: any[] = [];
  listDaiDienChiCuc: any[] = [];
  bienBanLayMau: any[] = [];
  soQdNvXh: string;

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
      id: [],
      namKh: [dayjs().get('year')],
      maDvi: [''],
      tenDvi: [''],
      maQhns: [''],
      idQdNv: [''],
      soQdNv: ['', [Validators.required]],
      ngayQd: [''],
      idHd: [''],
      soHd: [''],
      loaiBienBan: [''],
      ngayKyHd: [''],
      idKtv: [''],
      tenKtv: [''],
      soBienBan: [''],
      ngayLayMau: [dayjs().format('YYYY-MM-DD')],
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
      trangThai: [STATUS.DU_THAO],
      tenTrangThai: ['Dự Thảo'],
      lyDoTuChoi: [''],
      pthucBanTrucTiep: [''],
      phanLoai: ['HĐ'],
      idBangkeBanLe: [],
      soBangKeBanLe: [''],
      ngayTaoBangKe: [''],
    })
  }

  async ngOnInit() {
    await Promise.all([
      this.loadDataComboBox()
    ]);
    if (this.id > 0) {
      await this.loadChitiet();
    } else {
      this.initForm();
    }
  }

  async openDialogSoQd() {
    let dataQd = [];
    let body = {
      namKh: this.formData.value.namKh,
      loaiVthh: this.loaiVthh,
      trangThai: this.STATUS.BAN_HANH,
      maChiCuc: this.userInfo.MA_DVI
    }
    let res = await this.quyetDinhNvXuatBttService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      dataQd = res.data?.content;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }

    const modalQD = this.modal.create({
      nzTitle: 'DANH SÁCH QUYẾT ĐỊNH KẾ HOẠCH GIAO NHIỆM VỤ XUẤT HÀNG',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: dataQd,
        dataHeader: ['Số quyết định', 'Loại hàng hóa', 'Chủng loại hàng hóa'],
        dataColumn: ['soQdNv', 'tenLoaiVthh', 'tenCloaiVthh'],
      },
    })
    modalQD.afterClose.subscribe(async (dataChose) => {
      if (dataChose) {
        await this.bindingDataQd(dataChose.id);
      }
    });
  }

  async bindingDataQd(id) {
    if (id > 0) {
      await this.spinner.show();
      let res = await this.quyetDinhNvXuatBttService.getDetail(id);
      if (res.msg == MESSAGE.SUCCESS) {
        const data = res.data;
        if (data.pthucBanTrucTiep == '01' || data.pthucBanTrucTiep == '03') {
          this.listBienBanLayMau(data.soQdNv)
          if (data.pthucBanTrucTiep == '01') {
            this.formData.patchValue({
              soQdNv: data.soQdNv,
              idQdNv: data.id,
              ngayQd: data.ngayTao,
              soHd: data.soHd,
              idHd: data.idHd,
              ngayKyHd: data.ngayKyHd,
              loaiVthh: data.loaiVthh,
              cloaiVthh: data.cloaiVthh,
              tenLoaiVthh: data.tenLoaiVthh,
              tenCloaiVthh: data.tenCloaiVthh,
              moTaHangHoa: data.moTaHangHoa,
              phanLoai: 'HĐ',
              pthucBanTrucTiep: data.pthucBanTrucTiep,
            });
          } else {
            if (data.pthucBanTrucTiep == '03') {
              this.soQdNvXh = data.soQdNv
              this.formData.patchValue({
                soQdNv: data.soQdNv,
                idQdNv: data.id,
                ngayQd: data.ngayTao,
                moTaHangHoa: data.moTaHangHoa,
                phanLoai: 'BL',
                pthucBanTrucTiep: data.pthucBanTrucTiep,
              });
            }
          }
          let dataChiCuc = data.children.filter(item => item.maDvi == this.userInfo.MA_DVI);
          if (dataChiCuc && dataChiCuc.length > 0) {
            this.listDiaDiemXh = dataChiCuc[0].children;
          }
        } else {
          if (data.pthucBanTrucTiep == '02') {
            this.soQdNvXh = data.soQdNv
            this.formData.patchValue({
              soQdNv: data.soQdNv,
              idQdNv: data.id,
              ngayQd: data.ngayTao,
              phanLoai: 'HĐ',
              pthucBanTrucTiep: data.pthucBanTrucTiep,
            });
          }
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
      await this.spinner.hide();
    }
  }

  async searchHopDong() {
    if (this.formData.get('pthucBanTrucTiep').value != '02') {
      return
    }
    this.spinner.show();
    let dataHd = [];
    let body = {
      namHd: this.formData.value.namKh,
      loaiVthh: this.loaiVthh,
      soQdNv: this.soQdNvXh,
      trangThai: STATUS.DA_KY,
      maDvi: this.userInfo.MA_DVI,
    }
    let res = await this.hopDongBttService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      dataHd = res.data?.content;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    this.spinner.hide();
    const modalQD = this.modal.create({
      nzTitle: 'DANH SÁCH QUYẾT ĐỊNH KẾ HOẠCH GIAO NHIỆM VỤ XUẤT HÀNG',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: dataHd,
        dataHeader: ['Số hợp đồng', 'Tên hợp đồng', 'Loại hàng hóa', 'Chủng loại hàng hóa'],
        dataColumn: ['soHd', 'tenHd', 'tenLoaiVthh', 'tenCloaiVthh'],
      },
    })
    modalQD.afterClose.subscribe(async (dataChose) => {
      if (dataChose) {
        await this.bindingDataHd(dataChose.id);
      }
    });
  }

  async bindingDataHd(id) {
    if (id > 0) {
      await this.spinner.show();
      let res = await this.hopDongBttService.getDetail(id);
      if (res.msg == MESSAGE.SUCCESS) {
        const data = res.data;
        this.listBienBanLayMau(data.soQdNv)
        this.formData.patchValue({
          soHd: data.soHd,
          idHd: data.id,
          ngayKyHd: data.ngayPduyet,
          loaiVthh: data.loaiVthh,
          cloaiVthh: data.cloaiVthh,
          tenLoaiVthh: data.tenLoaiVthh,
          tenCloaiVthh: data.tenCloaiVthh,
          moTaHangHoa: data.moTaHangHoa
        });
        if (data.xhHopDongBttDviList && data.xhHopDongBttDviList.length > 0) {
          this.listDiaDiemXh = data.xhHopDongBttDviList;
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
      await this.spinner.hide();
    }
  }

  async searchBangKeBanLe() {
    if (this.formData.get('pthucBanTrucTiep').value != '03') {
      return
    }
    this.spinner.show();
    let dataBL = [];
    let body = {
      namKh: this.formData.value.namKh,
      loaiVthh: this.loaiVthh,
      soQdNv: this.soQdNvXh,
      maDvi: this.userInfo.MA_DVI,
    }
    let res = await this.bangKeBttService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      dataBL = res.data?.content;
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
        dataTable: dataBL,
        dataHeader: ['Số bảng kê', 'Tên người mua', 'Loại hàng hóa', 'Chủng loại hàng hóa'],
        dataColumn: ['soBangKe', 'tenNguoiMua', 'tenLoaiVthh', 'tenCloaiVthh'],
      },
    })
    modalQD.afterClose.subscribe(async (dataChose) => {
      if (dataChose) {
        await this.bindingDataBangKe(dataChose.id);
      }
    });
  }

  async bindingDataBangKe(id) {
    if (id > 0) {
      await this.spinner.show();
      let res = await this.bangKeBttService.getDetail(id);
      if (res.msg == MESSAGE.SUCCESS) {
        const data = res.data;
        this.formData.patchValue({
          idBangKeBanLe: data.id,
          soBangKeBanLe: data.soBangKe,
          loaiVthh: data.loaiVthh,
          cloaiVthh: data.cloaiVthh,
          tenLoaiVthh: data.tenLoaiVthh,
          tenCloaiVthh: data.tenCloaiVthh,
          ngayTaoBangKe: data.ngayTao
        });
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
      await this.spinner.hide();
    }
  }

  async listBienBanLayMau(even) {
    await this.spinner.show();
    let body = {
      soQdNv: even,
      loaiVthh: this.loaiVthh,
      namKh: this.formData.value.namKh,
    }
    let res = await this.bienBanLayMauBttService.search(body)
    if (res.msg == MESSAGE.SUCCESS) {
      const data = res.data;
      this.bienBanLayMau = data.content;
      const diffList = [
        ...this.listDiaDiemXh.filter((item) => {
          return !this.bienBanLayMau.some((child) => {
            if (child.maNganKho.length > 0 && item.maNganKho.length > 0) {
              return item.maNganKho === child.maNganKho;
            } else {
              return item.maDiemKho === child.maDiemKho;
            }
          });
        }),
      ];
      this.listDiaDiemXh = diffList;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  openDialogDdiemNhapHang() {
    const modalQD = this.modal.create({
      nzTitle: 'DANH SÁCH ĐỊA ĐIỂM NHẬP HÀNG',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listDiaDiemXh,
        dataHeader: ['Điểm kho', 'Nhà kho', 'Ngăn kho', 'Lô kho', 'Số lượng'],
        dataColumn: ['tenDiemKho', 'tenNhaKho', 'tenNganKho', 'tenLoKho', 'soLuongDeXuat']
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

  async initForm() {
    let id = await this.userService.getId('XH_BB_LAY_MAU_BTT_HDR_SEQ')
    this.formData.patchValue({
      maDvi: this.userInfo.MA_DVI,
      tenDvi: this.userInfo.TEN_DVI,
      maQhns: this.userInfo.DON_VI.maQhns,
      soBienBan: `${id}/${this.formData.get('namKh').value}/BBLM-CCDTVP`,
      tenKtv: this.userInfo.TEN_DAY_DU,
    });
    if (this.idQdGiaoNvXh) {
      await this.bindingDataQd(this.idQdGiaoNvXh);
    }
  }

  async loadDataComboBox() {
    // Loại biên bản
    await this.danhMucService.danhMucChungGetAll("LOAI_BIEN_BAN").then(res => {
      if (res.msg == MESSAGE.SUCCESS) {
        this.listBienBan = res.data;
      }
      else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }).catch(err => {
      this.notification.error(MESSAGE.ERROR, err.msg);
    });
    // PP lây mẫu
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

  setValidator(isGuiDuyet) {
    if (isGuiDuyet) {
      this.formData.controls["loaiBienBan"].setValidators([Validators.required]);
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
      this.formData.controls["loaiBienBan"].clearValidators();
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

  async loadChitiet() {
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
