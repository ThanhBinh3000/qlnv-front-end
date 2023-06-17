import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as dayjs from 'dayjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { convertTienTobangChu } from 'src/app/shared/commonFunction';
import { Validators } from "@angular/forms";
import { STATUS } from "../../../../../../constants/status";
import {
  DialogTableSelectionComponent
} from "../../../../../../components/dialog/dialog-table-selection/dialog-table-selection.component";
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { PhieuXuatKhoBttService } from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/xuat-kho-btt/phieu-xuat-kho-btt.service';
import { QuyetDinhNvXuatBttService } from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/quyet-dinh-nv-xuat-btt/quyet-dinh-nv-xuat-btt.service';
import { BangCanKeHangBttService } from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/xuat-kho-btt/bang-can-ke-hang-btt.service';
import { DonviService } from 'src/app/services/donvi.service';
import { chiTietBangCanKeHang } from 'src/app/models/DeXuatKeHoachBanTrucTiep';
import { HopDongBttService } from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/hop-dong-btt/hop-dong-btt.service';
import { BangKeBttService } from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/hop-dong-btt/bang-ke-btt.service';

@Component({
  selector: 'app-them-moi-bang-ke-can-hang-btt',
  templateUrl: './them-moi-bang-ke-can-hang-btt.component.html',
  styleUrls: ['./them-moi-bang-ke-can-hang-btt.component.scss']
})
export class ThemMoiBangKeCanHangBttComponent extends Base2Component implements OnInit {
  @Input() id: number;
  @Input() loaiVthh: string;
  @Input() isView: boolean;
  @Input() idQdGiaoNvXh: number;
  @Input() isViewOnModal: boolean;
  @Output()
  showListEvent = new EventEmitter<any>();
  @Output()
  dataTableChange = new EventEmitter<any>();

  listDiaDiemNhap: any[] = [];
  listDiaDiemKho: any[] = [];
  listPhieuXuatKho: any[] = [];
  bangCanKeHang: any[] = [];
  soQdNvXh: string;

  dataTable: any[] = [];
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private donViService: DonviService,
    private phieuXuatKhoBttService: PhieuXuatKhoBttService,
    private quyetDinhNvXuatBttService: QuyetDinhNvXuatBttService,
    private bangCanKeHangBttService: BangCanKeHangBttService,
    private hopDongBttService: HopDongBttService,
    private bangKeBttService: BangKeBttService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, bangCanKeHangBttService);
    this.formData = this.fb.group({
      id: [],
      namKh: [dayjs().get('year')],
      maDvi: [''],
      tenDvi: [''],
      maQhns: [''],

      soBangKe: [],
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
      idPhieuXuat: [],
      soPhieuXuat: [''],
      ngayXuatKho: [],
      diaDiemKho: [''],
      tenNguoiPduyet: [''],
      idThuKho: [],
      tenThuKho: [''],
      nguoiGiao: [''],
      cmtNguoiGiao: [''],
      ctyNguoiGiao: [''],
      diaChiNguoiGiao: [''],
      tgianGiaoNhan: [''],
      loaiVthh: ['',],
      tenLoaiVthh: ['',],
      cloaiVthh: [''],
      tenCloaiVthh: [''],
      moTaHangHoa: [''],
      donViTinh: [''],
      trangThai: [STATUS.DU_THAO],
      tenTrangThai: ['Dự Thảo'],
      lyDoTuChoi: [],
      phanLoai: ['HĐ'],
      ngayTaoBangKe: [''],
      soBangKeBanLe: [''],
      idBangKeBanLe: [],
      pthucBanTrucTiep: [''],
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
      this.emitDataTable()
      this.updateEditCache()
      await this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      await this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async initForm() {
    let id = await this.userService.getId('XH_BKE_CAN_HANG_BTT_HDR_SEQ')
    this.formData.patchValue({
      soBangKe: `${id}/${this.formData.get('namKh').value}/BKCH-CCDTVP`,
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
          this.listBangCanKeHang(data.soQdNv)
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
              });
            }
          }
          let dataChiCuc = data.children.filter(item => item.maDvi == this.userInfo.MA_DVI);
          if (dataChiCuc && dataChiCuc.length > 0) {
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
          this.listBangCanKeHang(data.soQdNv)
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

  async listBangCanKeHang(even) {
    await this.spinner.show();
    let body = {
      soQdNv: even,
      loaiVthh: this.loaiVthh,
      namKh: this.formData.value.namKh,
      maDvi: this.userInfo.MA_DVI,
    }
    let res = await this.bangCanKeHangBttService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      const data = res.data
      this.bangCanKeHang = data.content;
      const diffList = [
        ...this.listDiaDiemNhap.filter((item) => {
          return !this.bangCanKeHang.some((child) => {
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
        dataHeader: ['Điểm kho', 'Nhà kho', 'Ngăn kho', 'Lô kho', 'Số lượng'],
        dataColumn: ['tenDiemKho', 'tenNhaKho', 'tenNganKho', 'tenLoKho', 'soLuongDeXuat']
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
        await this.loadDiemDiemKho(data);
        await this.loaPhieuXuatKho(data);
      }
    });
  }

  async loadDiemDiemKho(data) {
    let body = {
      trangThai: "01",
      maDviCha: this.userInfo.MA_DVI
    };
    const res = await this.donViService.getAll(body)
    const dataDk = res.data;
    if (dataDk) {
      this.listDiaDiemKho = dataDk.filter(item => item.maDvi == data.maDiemKho);
      this.listDiaDiemKho.forEach(s => {
        this.formData.patchValue({
          diaDiemKho: s.diaChi,
        })
      })
    }
  }

  async loaPhieuXuatKho(data) {
    let body = {
      trangThai: STATUS.DA_DUYET_LDCC,
      maDvi: this.userInfo.MA_DVI
    }
    let res = await this.phieuXuatKhoBttService.search(body);
    if (res.data) {
      const listPhieuXkho = res.data.content;
      this.listPhieuXuatKho = listPhieuXkho.filter(item => (item.maDiemKho == data.maDiemKho && item.maNhaKho == data.maNhaKho && item.maNganKho == data.maNganKho && item.maLoKho == data.maLoKho));
      const dataPhieuXkho = this.listPhieuXuatKho[0]
      if (dataPhieuXkho) {
        await this.spinner.show();
        let resDetail = await this.phieuXuatKhoBttService.getDetail(dataPhieuXkho.id);
        if (resDetail.msg == MESSAGE.SUCCESS) {
          const data = resDetail.data;
          this.formData.patchValue({
            idPhieuXuat: data.id,
            soPhieuXuat: data.soPhieuXuat,
            ngayXuatKho: data.ngayXuatKho,
            nguoiGiao: data.nguoiGiao,
            cmtNguoiGiao: data.cmtNguoiGiao,
            ctyNguoiGiao: data.ctyNguoiGiao,
            diaChiNguoiGiao: data.diaChiNguoiGiao,
            tgianGiaoNhan: data.tgianGiaoNhan,
            loaiVthh: data.loaiVthh,
            tenLoaiVthh: data.tenLoaiVthh,
            cloaiVthh: data.cloaiVthh,
            tenCloaiVthh: data.tenCloaiVthh,
            donViTinh: data.donViTinh,
          });
        } else {
          this.notification.error(MESSAGE.ERROR, resDetail.msg);
        }
      }
    }
    await this.spinner.hide();
  }

  async save(isGuiDuyet?: boolean) {
    this.setValidator(isGuiDuyet);
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
    this.dataTable = data.children
    this.fileDinhKem = data.fileDinhKems;
  }

  convertTien(tien: number): string {
    return convertTienTobangChu(tien);
  }

  pheDuyet(isPheDuyet) {
    if (this.dataTable.length == 0) {
      this.notification.error(
        MESSAGE.ERROR,
        'Danh sách mã cân, số bao bì, trọng lượng bao bì không được để trống',
      );
      return;
    }
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

  rowItem: chiTietBangCanKeHang = new chiTietBangCanKeHang();
  dataEdit: { [key: string]: { edit: boolean; data: chiTietBangCanKeHang } } = {};

  emitDataTable() {
    this.dataTableChange.emit(this.dataTable);
  }

  updateEditCache(): void {
    if (this.dataTable) {
      this.dataTable.forEach((item, index) => {
        this.dataEdit[index] = {
          edit: false,
          data: { ...item },
        };
      });
    }
  }

  addRow() {
    if (this.validateDataRow()) {
      if (!this.dataTable) {
        this.dataTable = [];
      }
      this.dataTable = [...this.dataTable, this.rowItem];
      this.rowItem = new chiTietBangCanKeHang();
      this.emitDataTable();
      this.updateEditCache()
    }
  }

  clearItemRow() {
    this.rowItem = new chiTietBangCanKeHang();
    this.rowItem.id = null;
  }

  startEdit(index: number) {
    this.dataEdit[index].edit = true;
  }

  deleteRow(index: any) {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn xóa?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 400,
      nzOnOk: async () => {
        try {
          this.dataTable.splice(index, 1);
          this.updateEditCache();
        } catch (e) {
          console.log('error', e);
        }
      },
    });
  }

  saveEdit(idx: number): void {
    Object.assign(this.dataTable[idx], this.dataEdit[idx].data);
    this.dataEdit[idx].edit = false;
  }

  cancelEdit(stt: number): void {
    this.dataEdit[stt] = {
      data: { ...this.dataTable[stt] },
      edit: false
    };
  }

  validateDataRow() {
    if (this.rowItem.maCan && this.rowItem.trongLuongBaoBi && this.rowItem.trongLuongCaBaoBi) {
      let tongTrongLuong = this.calcTong('trongLuongCaBaoBi');
      if (this.rowItem.trongLuongBaoBi >= this.rowItem.trongLuongCaBaoBi) {
        this.notification.error(MESSAGE.ERROR, "Số lượng bì phải lớn lơn trọng lượng bao bì.");
        return false
      }
      if (tongTrongLuong + this.rowItem.trongLuongCaBaoBi > this.formData.value.soLuong) {
        this.notification.error(MESSAGE.ERROR, "Trọng lượng bao bì không được vượt quá số lượng xuất kho.");
        return false
      }
      return true;
    } else {
      this.notification.error(MESSAGE.ERROR, "Vui lòng nhập đủ thông tin");
      return false
    }
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

  setValidator(isGuiDuyet) {
    if (isGuiDuyet) {
      this.formData.controls["namKh"].setValidators([Validators.required]);
      this.formData.controls["maDvi"].setValidators([Validators.required]);
      this.formData.controls["tenDvi"].setValidators([Validators.required]);
      this.formData.controls["maQhns"].setValidators([Validators.required]);
      this.formData.controls["soBangKe"].setValidators([Validators.required]);
      this.formData.controls["soPhieuXuat"].setValidators([Validators.required]);
      this.formData.controls["ngayXuatKho"].setValidators([Validators.required]);
      this.formData.controls["nguoiGiao"].setValidators([Validators.required]);
      this.formData.controls["cmtNguoiGiao"].setValidators([Validators.required]);
      this.formData.controls["ctyNguoiGiao"].setValidators([Validators.required]);
      this.formData.controls["diaChiNguoiGiao"].setValidators([Validators.required]);
      this.formData.controls["tgianGiaoNhan"].setValidators([Validators.required]);
      this.formData.controls["loaiVthh"].setValidators([Validators.required]);
      this.formData.controls["tenLoaiVthh"].setValidators([Validators.required]);
      this.formData.controls["cloaiVthh"].setValidators([Validators.required]);
      this.formData.controls["tenCloaiVthh"].setValidators([Validators.required]);

    } else {
      this.formData.controls["namKh"].clearValidators();
      this.formData.controls["maDvi"].clearValidators();
      this.formData.controls["tenDvi"].clearValidators();
      this.formData.controls["maQhns"].clearValidators();
      this.formData.controls["soBangKe"].clearValidators();
      this.formData.controls["soPhieuXuat"].clearValidators();
      this.formData.controls["ngayXuatKho"].clearValidators();
      this.formData.controls["nguoiGiao"].clearValidators();
      this.formData.controls["cmtNguoiGiao"].clearValidators();
      this.formData.controls["ctyNguoiGiao"].clearValidators();
      this.formData.controls["diaChiNguoiGiao"].clearValidators();
      this.formData.controls["tgianGiaoNhan"].clearValidators();
      this.formData.controls["loaiVthh"].clearValidators();
      this.formData.controls["tenLoaiVthh"].clearValidators();
      this.formData.controls["cloaiVthh"].clearValidators();
      this.formData.controls["tenCloaiVthh"].clearValidators();
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

  isDisabled() {
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
}
