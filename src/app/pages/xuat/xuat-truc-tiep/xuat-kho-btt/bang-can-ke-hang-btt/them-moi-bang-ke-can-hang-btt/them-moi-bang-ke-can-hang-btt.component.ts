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

  @Output()
  showListEvent = new EventEmitter<any>();

  @Output()
  dataTableChange = new EventEmitter<any>();

  listDiaDiemNhap: any[] = [];
  listDiaDiemKho: any[] = [];
  listPhieuXuatKho: any[] = [];
  bangCanKeHang: any[] = [];

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
  ) {
    super(httpClient, storageService, notification, spinner, modal, bangCanKeHangBttService);
    this.formData = this.fb.group({
      id: [],
      namKh: [dayjs().get('year')],
      maDvi: ['', [Validators.required]],
      tenDvi: ['', [Validators.required]],
      maQhns: ['',],

      soBangKe: [],
      idQdNv: [],
      soQdNv: [],
      ngayQdNv: [''],
      idHd: [],
      soHd: [''],
      ngayKyHd: [null,],

      maDiemKho: ['', [Validators.required]],
      tenDiemKho: ['', [Validators.required]],
      maNhaKho: ['', [Validators.required]],
      tenNhaKho: ['', [Validators.required]],
      maNganKho: ['', [Validators.required]],
      tenNganKho: ['', [Validators.required]],
      maLoKho: [''],
      tenLoKho: [''],

      idPhieuXuat: [],
      soPhieuXuat: ['', [Validators.required]],
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
      namKh: dayjs().get('year'),
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
        this.formData.patchValue({
          idQdNv: data.id,
          soQdNv: data.soQdNv,
          ngayQdNv: data.ngayTao,
          idHd: data.idHd,
          soHd: data.soHd,
          ngayKyHd: data.ngayKyHd,
        });
        this.listBangCanke(data.soQdNv)
        let dataChiCuc = data.children.filter(item => item.maDvi == this.userInfo.MA_DVI);
        if (dataChiCuc && dataChiCuc.length > 0) {
          dataChiCuc.forEach(e => {
            this.listDiaDiemNhap = [...this.listDiaDiemNhap, e.children];
          });
          this.listDiaDiemNhap = this.listDiaDiemNhap.flat();
        }
      } else {
        this.notification.error(MESSAGE.ERROR, dataRes.msg);
      }
      await this.spinner.hide();
    }
  }

  async listBangCanke(even) {
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
        let resDetail = await this.phieuXuatKhoBttService.getDetail(dataPhieuXkho.id);
        if (resDetail.data) {
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
        }
      }
    }
  }

  async save(isGuiDuyet?: boolean) {
    if (this.dataTable.length == 0) {
      this.notification.error(
        MESSAGE.ERROR,
        'Danh sách mã cân, số bao bì, trọng lượng bao bì không được để trống',
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
        this.goBack();
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

  isDisabled() {
    let trangThai = this.formData.value.trangThai;
    if (trangThai == STATUS.CHO_DUYET_LDCC || trangThai == STATUS.DA_DUYET_LDCC) {
      return true;
    } else {
      return false;
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
      // let tongTrongLuongCaBaoBi = this.calcTong('trongLuongCaBaoBi');
      // let tongTrongLuongBi = this.calcTong('trongLuongBaoBi');
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

  // validateSave() {
  //   let tongTrongLuong = this.calcTong('trongLuongCaBaoBi');
  //   if (tongTrongLuong != this.formData.value.soLuongNhapKho) {
  //     this.notification.error(MESSAGE.ERROR, "Tổng trọng lượng bao bì của bảng kê đang không đủ số lượng nhập kho")
  //     return false;
  //   }
  //   return true;
  // }

}
