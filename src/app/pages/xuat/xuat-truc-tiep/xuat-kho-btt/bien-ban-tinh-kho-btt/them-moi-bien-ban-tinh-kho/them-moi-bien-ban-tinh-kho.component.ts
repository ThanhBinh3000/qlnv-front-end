import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as dayjs from 'dayjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { convertTienTobangChu } from 'src/app/shared/commonFunction';
import { STATUS } from "../../../../../../constants/status";
import {
  DialogTableSelectionComponent
} from "../../../../../../components/dialog/dialog-table-selection/dialog-table-selection.component";
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import { Validators } from "@angular/forms";
import { Base2Component } from 'src/app/components/base2/base2.component';
import { QuyetDinhNvXuatBttService } from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/quyet-dinh-nv-xuat-btt/quyet-dinh-nv-xuat-btt.service';
import { BienBanTinhKhoBttService } from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/xuat-kho-btt/bien-ban-tinh-kho-btt.service';
import { PhieuXuatKhoBttService } from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/xuat-kho-btt/phieu-xuat-kho-btt.service';
import { HopDongBttService } from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/hop-dong-btt/hop-dong-btt.service';
import { BangKeBttService } from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/hop-dong-btt/bang-ke-btt.service';

@Component({
  selector: 'app-them-moi-bien-ban-tinh-kho',
  templateUrl: './them-moi-bien-ban-tinh-kho.component.html',
  styleUrls: ['./them-moi-bien-ban-tinh-kho.component.scss']
})
export class ThemMoiBienBanTinhKhoComponent extends Base2Component implements OnInit {
  @Input() id: number;
  @Input() loaiVthh: string;
  @Input() isView: boolean;
  @Input() idQdGiaoNvXh: number;
  @Input() isViewOnModal: boolean;

  @Output()
  showListEvent = new EventEmitter<any>();

  listPhieuXuatKho: any[] = [];
  listDiaDiemNhap: any[] = [];
  idPhieu: number = 0;
  isViewPhieu: boolean = false;
  idPhieuXuat: number = 0;
  isViewPhieuXuat: boolean = false;
  idBangKe: number = 0;
  isViewBangKe: boolean = false;
  bienBanTinhKho: any[] = [];
  soQdNvXh: string;

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private bienBanTinhKhoBttService: BienBanTinhKhoBttService,
    private quyetDinhNvXuatBttService: QuyetDinhNvXuatBttService,
    private phieuXuatKhoBttService: PhieuXuatKhoBttService,
    private hopDongBttService: HopDongBttService,
    private bangKeBttService: BangKeBttService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, bienBanTinhKhoBttService);
    this.formData = this.fb.group({
      id: [],
      namKh: [dayjs().get('year')],
      maDvi: [''],
      tenDvi: [''],
      maQhns: [''],
      soBbTinhKho: [''],
      ngayTao: [dayjs().format('YYYY-MM-DD')],
      idQdNv: [],
      soQdNv: ['', [Validators.required]],
      ngayQdNv: [''],
      idHd: [],
      soHd: [''],
      ngayKyHd: [''],
      maDiemKho: ['', [Validators.required]],
      tenDiemKho: ['', [Validators.required]],
      maNhaKho: ['', [Validators.required]],
      tenNhaKho: ['', [Validators.required]],
      maNganKho: ['', [Validators.required]],
      tenNganKho: ['', [Validators.required]],
      maLoKho: [''],
      tenLoKho: [''],
      ngayBdauXuat: [''],
      ngayKthucXuat: [dayjs().format('YYYY-MM-DD')],
      tongSlNhap: [100000],
      tongSlXuat: [],
      slConLai: [],
      slThucTe: [],
      slThua: [],
      slThieu: [],
      nguyenNhan: [''],
      kienNghi: [''],
      ghiChu: [''],
      idThuKho: [],
      tenThuKho: [''],
      idKtv: [],
      tenKtv: [''],
      idKeToan: [],
      tenKeToan: [''],
      tenNguoiPduyet: [''],
      trangThai: STATUS.DU_THAO,
      tenTrangThai: ['Dự Thảo'],
      phanLoai: ['HĐ'],
      ngayTaoBangKe: [''],
      soBangKeBanLe: [''],
      idBangKeBanLe: [],
      pthucBanTrucTiep: [''],
      loaiVthh: [''],
      cloaiVthh: [''],
      lyDoTuChoi: [''],
    })
  }

  async ngOnInit() {
    try {
      this.userInfo = this.userService.getUserLogin();
      if (this.id) {
        await this.loadChiTiet();
      } else {
        await this.initForm();
      }
      await this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      await this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async initForm() {
    let id = await this.userService.getId('XH_BB_TINHK_BTT_HDR_SEQ')
    this.formData.patchValue({
      soBbTinhKho: `${id}/${this.formData.get('namKh').value}-BBTK`,
      maDvi: this.userInfo.MA_DVI,
      tenDvi: this.userInfo.TEN_DVI,
      maQhns: this.userInfo.DON_VI.maQhns,
      trangThai: STATUS.DU_THAO,
      tenTrangThai: 'Dự thảo',
      tenThuKho: this.userInfo.TEN_DAY_DU
    });
    if (this.idQdGiaoNvXh) {
      await this.bindingDataQd(this.idQdGiaoNvXh);
    }
  }

  async openDialogSoQdNvXh() {
    let dataQdNvXh = [];
    let body = {
      namKh: this.formData.value.namKh,
      loaiVthh: this.loaiVthh,
      trangThai: this.STATUS.BAN_HANH,
      maChiCuc: this.userInfo.MA_DVI
    }
    let res = await this.quyetDinhNvXuatBttService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      dataQdNvXh = res.data?.content;
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
        dataTable: dataQdNvXh,
        dataHeader: ['Số quyết định', 'Loại hàng hóa', 'Chủng loại hàng hóa'],
        dataColumn: ['soQdNv', 'tenLoaiVthh', 'tenCloaiVthh'],
      },
    })
    modalQD.afterClose.subscribe(async (dataChose) => {
      if (dataChose) {
        await this.bindingDataQd(dataChose.id);
      }
    });
  };

  async bindingDataQd(id) {
    if (id > 0) {
      await this.spinner.show();
      let dataRes = await this.quyetDinhNvXuatBttService.getDetail(id)
      if (dataRes.msg == MESSAGE.SUCCESS) {
        const data = dataRes.data;
        if (data.pthucBanTrucTiep == '01' || data.pthucBanTrucTiep == '03') {
          this.lisBienBanTinhKho(data.soQdNv)
          if (data.pthucBanTrucTiep == '01') {
            this.formData.patchValue({
              idQdNv: data.id,
              soQdNv: data.soQdNv,
              ngayQdNv: data.ngayTao,
              idHd: data.idHd,
              soHd: data.soHd,
              ngayKyHd: data.ngayKyHd,
              phanLoai: 'HĐ',
              pthucBanTrucTiep: data.pthucBanTrucTiep,
              loaiVthh: data.loaiVthh,
              cloaiVthh: data.cloaiVthh,
            });
          } else {
            if (data.pthucBanTrucTiep == '03') {
              this.soQdNvXh = data.soQdNv
              this.formData.patchValue({
                soQdNv: data.soQdNv,
                idQdNv: data.id,
                ngayQdNv: data.ngayTao,
                phanLoai: 'BL',
                pthucBanTrucTiep: data.pthucBanTrucTiep,
                loaiVthh: data.loaiVthh,
                cloaiVthh: data.cloaiVthh,
              });
            }
          }
          let dataChiCuc = data.children.filter(item => item.maDvi == this.userInfo.MA_DVI);
          if (dataChiCuc) {
            dataChiCuc.forEach(e => {
              this.listDiaDiemNhap = [...this.listDiaDiemNhap, e.children];
            });
            this.listDiaDiemNhap = this.listDiaDiemNhap.flat();
          }
        } else {
          if (data.pthucBanTrucTiep == '02') {
            this.soQdNvXh = data.soQdNv
            this.formData.patchValue({
              soQdNv: data.soQdNv,
              idQdNv: data.id,
              ngayQdNv: data.ngayTao,
              phanLoai: 'HĐ',
              pthucBanTrucTiep: data.pthucBanTrucTiep,
              loaiVthh: data.loaiVthh,
              cloaiVthh: data.cloaiVthh,
            });
          }
        }
      } else {
        this.notification.error(MESSAGE.ERROR, dataRes.msg);
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
        await this.loadChiTietHopDong(dataChose.id);
      }
    });
  }

  async loadChiTietHopDong(idHd) {
    if (idHd > 0) {
      await this.spinner.show();
      let dataHd = await this.hopDongBttService.getDetail(idHd)
      if (dataHd.msg == MESSAGE.SUCCESS) {
        const data = dataHd.data;
        if (this.formData.value.pthucBanTrucTiep == '02') {
          this.lisBienBanTinhKho(data.soQdNv)
          this.formData.patchValue({
            idHd: data.id,
            soHd: data.soHd,
            ngayKyHd: data.ngayPduyet,
          });
          if (data.xhHopDongBttDviList && data.xhHopDongBttDviList.length > 0) {
            this.listDiaDiemNhap = data.xhHopDongBttDviList;
          }
        }
      } else {
        this.notification.error(MESSAGE.ERROR, dataHd.msg);
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
          ngayTaoBangKe: data.ngayTao,
        });
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
      await this.spinner.hide();
    }
  }

  async lisBienBanTinhKho(item) {
    await this.spinner.show();
    let body = {
      soQdNv: item,
      loaiVthh: this.loaiVthh,
      namKh: this.formData.value.namKh,
      maDvi: this.userInfo.MA_DVI,
    }
    let res = await this.bienBanTinhKhoBttService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      const data = res.data
      this.bienBanTinhKho = data.content;
      const diffList = [
        ...this.listDiaDiemNhap.filter((item) => {
          return !this.bienBanTinhKho.some((child) => {
            if (child.maNganKho.length > 0 && item.maNganKho.length > 0) {
              return item.maNganKho === child.maNganKho;
            } else {
              return item.maDiemKho === child.maDiemKho;
            }
          });
        }),
      ];
      this.listDiaDiemNhap = diffList;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
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
        dataHeader: ['Điểm kho', 'Nhà kho', 'Ngăn kho', 'Lô kho'],
        dataColumn: ['tenDiemKho', 'tenNhaKho', 'tenNganKho', 'tenLoKho']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        this.formData.patchValue({
          maDiemKho: data.maDiemKho,
          tenDiemKho: data.tenDiemKho,
          maNhaKho: data.maNhaKho,
          tenNhaKho: data.tenNhaKho,
          maNganKho: data.maNganKho,
          tenNganKho: data.tenNganKho,
          maLoKho: data.maLoKho,
          tenLoKho: data.tenLoKho,
        });
        let body = {
          trangThai: STATUS.DA_DUYET_LDCC,
          loaiVthh: this.loaiVthh,
          namKh: this.formData.value.namKh,
          maDvi: this.userInfo.MA_DVI
        }
        let res = await this.phieuXuatKhoBttService.search(body);
        if (res.data) {
          const list = res.data.content;
          this.listPhieuXuatKho = list.filter((item) => item.maDiemKho == data.maDiemKho);
          this.formData.patchValue({
            ngayBdauXuat: this.listPhieuXuatKho[0].ngayTao
          });
          this.dataTable = this.listPhieuXuatKho;
          this.calculatorTable();
          this.dataTable.forEach(s => {
            s.idPhieuXuat = s.id;
          })
        }
      }
    });
  }

  calcTong(columnName) {
    if (this.dataTable) {
      const sum = this.dataTable.reduce((prev, cur) => {
        prev += cur[columnName];
        return prev;
      }, 0);
      return sum;
    }
  }

  calculatorTable() {
    let tongSlXuat: number = 0;
    this.dataTable.forEach((item) => {
      tongSlXuat += item.soLuongThucXuat;
    });
    this.formData.patchValue({
      tongSlXuat: tongSlXuat,
      slConLai: this.formData.value.tongSlNhap - tongSlXuat,
    });
  }

  slChenhLech() {
    if (this.formData.value.slThucTe > 0 && this.formData.value.slConLai > 0) {
      if (this.formData.value.slThucTe - this.formData.value.slConLai > 0) {
        this.formData.patchValue({
          slThua: Math.abs(this.formData.value.slThucTe - this.formData.value.slConLai),
          slThieu: null
        })
      } else {
        this.formData.patchValue({
          slThieu: Math.abs(this.formData.value.slThucTe - this.formData.value.slConLai),
          slThua: null
        })
      }
    }
  }

  async save(isGuiDuyet?: boolean) {
    this.setValidator(isGuiDuyet);
    if (this.dataTable.length == 0) {
      this.notification.error(
        MESSAGE.ERROR,
        'Hiện chưa có thông tin bảng kê cân hàng và phiếu nhập kho',
      );
      return;
    }
    let body = this.formData.value;
    body.fileDinhKems = this.fileDinhKem;
    body.children = this.dataTable;
    let data = await this.createUpdate(body);
    if (data) {
      if (isGuiDuyet) {
        this.id = data.id
        this.pheDuyet(true);
      } else {
        this.id = data.id
        await this.loadChiTiet();
      }
    }
  }

  async loadChiTiet() {
    let data = await this.detail(this.id);
    if (data) {
      this.dataTable = data.children
      this.fileDinhKem = data.fileDinhKems;
    }
  }

  convertTien(tien: number): string {
    return convertTienTobangChu(tien);
  }

  pheDuyet(isPheDuyet) {
    let trangThai = '';
    let msg = '';
    if (isPheDuyet) {
      switch (this.formData.value.trangThai) {
        case STATUS.TU_CHOI_LDCC:
        case STATUS.TU_CHOI_KT:
        case STATUS.TU_CHOI_KTVBQ:
        case STATUS.DU_THAO: {
          trangThai = STATUS.CHO_DUYET_KTVBQ;
          msg = MESSAGE.GUI_DUYET_CONFIRM;
          break;
        }
        case STATUS.CHO_DUYET_KTVBQ: {
          trangThai = STATUS.CHO_DUYET_KT;
          msg = MESSAGE.GUI_DUYET_CONFIRM;
          break;
        }
        case STATUS.CHO_DUYET_KT: {
          trangThai = STATUS.CHO_DUYET_LDCC;
          msg = MESSAGE.GUI_DUYET_CONFIRM;
          break;
        }
        case STATUS.CHO_DUYET_LDCC: {
          trangThai = STATUS.DA_DUYET_LDCC;
          msg = MESSAGE.GUI_DUYET_CONFIRM;
          break;
        }
      }
      this.approve(this.id, trangThai, msg)
    } else {
      switch (this.formData.value.trangThai) {
        case STATUS.CHO_DUYET_LDCC: {
          trangThai = STATUS.TU_CHOI_LDCC;
          break;
        }
        case STATUS.CHO_DUYET_KT: {
          trangThai = STATUS.TU_CHOI_KT;
          break;
        }
        case STATUS.CHO_DUYET_KTVBQ: {
          trangThai = STATUS.TU_CHOI_KTVBQ;
          break;
        }
      }
      this.reject(this.id, trangThai)
    }
  }

  isDisabled() {
    let trangThai = this.formData.value.trangThai;
    if (trangThai == STATUS.CHO_DUYET_KTVBQ || trangThai == STATUS.CHO_DUYET_KT || trangThai == STATUS.CHO_DUYET_LDCC || trangThai == STATUS.DA_DUYET_LDCC) {
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

  setValidator(isGuiDuyet) {
    if (isGuiDuyet) {
      this.formData.controls["namKh"].setValidators([Validators.required]);
      this.formData.controls["maDvi"].setValidators([Validators.required]);
      this.formData.controls["tenDvi"].setValidators([Validators.required]);
      this.formData.controls["maQhns"].setValidators([Validators.required]);
      this.formData.controls["soBbTinhKho"].setValidators([Validators.required]);
      this.formData.controls["ngayTao"].setValidators([Validators.required]);
      this.formData.controls["ngayBdauXuat"].setValidators([Validators.required]);
      this.formData.controls["ngayKthucXuat"].setValidators([Validators.required]);
      this.formData.controls["slThucTe"].setValidators([Validators.required]);
      this.formData.controls["nguyenNhan"].setValidators([Validators.required]);
      this.formData.controls["kienNghi"].setValidators([Validators.required]);
    } else {
      this.formData.controls["namKh"].clearValidators();
      this.formData.controls["maDvi"].clearValidators();
      this.formData.controls["tenDvi"].clearValidators();
      this.formData.controls["maQhns"].clearValidators();
      this.formData.controls["soBbTinhKho"].clearValidators();
      this.formData.controls["ngayTao"].clearValidators();
      this.formData.controls["ngayBdauXuat"].clearValidators();
      this.formData.controls["ngayKthucXuat"].clearValidators();
      this.formData.controls["slThucTe"].clearValidators();
      this.formData.controls["nguyenNhan"].clearValidators();
      this.formData.controls["kienNghi"].clearValidators();
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

  openModalPhieuKtCl(id: number) {
    this.idPhieu = id;
    this.isViewPhieu = true;
  }

  closeModalPhieuKtCl() {
    this.idPhieu = null;
    this.isViewPhieu = false;
  }

  openModalPhieuXuatKho(id: number) {
    this.idPhieuXuat = id;
    this.isViewPhieuXuat = true;
  }

  closeModalPhieuXuatKho() {
    this.idPhieuXuat = null;
    this.isViewPhieuXuat = false;
  }

  openModalBangKe(id: number) {
    this.idBangKe = id;
    this.isViewBangKe = true;
  }

  closeModalBangKe() {
    this.idBangKe = null;
    this.isViewBangKe = false;
  }
}
