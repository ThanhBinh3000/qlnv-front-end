import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import * as dayjs from 'dayjs';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { Subject } from 'rxjs';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { convertTienTobangChu, thongTinTrangThaiNhap } from 'src/app/shared/commonFunction';
import { Globals } from 'src/app/shared/globals';
import { Validators } from "@angular/forms";
import { STATUS } from "../../../../../../constants/status";
import {
  DialogTableSelectionComponent
} from "../../../../../../components/dialog/dialog-table-selection/dialog-table-selection.component";
import {cloneDeep, isEmpty} from 'lodash';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { PhieuNhapKhoMuaTrucTiepService } from 'src/app/services/phieu-nhap-kho-mua-truc-tiep.service';
import { BangCanKeMuaTrucTiepService } from 'src/app/services/bang-can-ke-mua-truc-tiep.service';
import { QuyetDinhGiaoNvNhapHangService } from 'src/app/services/qlnv-hang/nhap-hang/mua-truc-tiep/qdinh-giao-nvu-nh/quyetDinhGiaoNvNhapHang.service';
import {chiTietBangCanKeHang} from "../../../../../../models/DeXuatKeHoachBanTrucTiep";
import {AMOUNT_THREE_DECIMAL} from "../../../../../../Utility/utils";

@Component({
  selector: 'app-them-moi-bang-ke-can-hang',
  templateUrl: './them-moi-bang-ke-can-hang.component.html',
  styleUrls: ['./them-moi-bang-ke-can-hang.component.scss']
})
export class ThemMoiBangKeCanHangComponent extends Base2Component implements OnInit {
  @Input() id: number;
  @Input() isView: boolean;
  @Input() typeVthh: string;
  @Input() idQdGiaoNvNh: number;
  @Input() checkPrice: any;
  @Output()
  showListEvent = new EventEmitter<any>();
  @Output()
  dataTableChange = new EventEmitter<any>();
  @ViewChild('endDatePicker') endDatePicker!: NzDatePickerComponent;
  isVisibleChangeTab$ = new Subject();
  visibleTab: boolean = false;

  rowItem: any = {};
  rowItemGd: any = {};
  rowItemTb: any = {};
  dataTableGd: any[] = [];
  dataTableTb: any[] = [];
  listFileDinhKem: any[] = [];
  rowItemEdit: any[] = [];
  rowItemGdEdit: any[] = [];
  rowItemTbEdit: any[] = [];
  listSoQuyetDinh: any[] = [];
  listDiaDiemNhap: any[] = [];
  listSoPhieuNhapKho: any[] = [];
  previewName: string = 'ntt_bang_ke_can_hang';
  amount = { ...AMOUNT_THREE_DECIMAL }
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private bangCanKeMuaTrucTiepService: BangCanKeMuaTrucTiepService,
    private quyetDinhGiaoNvNhapHangService: QuyetDinhGiaoNvNhapHangService,
    private phieuNhapKhoMuaTrucTiepService: PhieuNhapKhoMuaTrucTiepService,

    public globals: Globals,
  ) {
    super(httpClient, storageService, notification, spinner, modal, bangCanKeMuaTrucTiepService);
    super.ngOnInit();
    this.formData = this.fb.group({
      id: [],
      idQdGiaoNvNh: [],
      idPhieuNhapKho: [],
      idDdiemGiaoNvNh: [],
      namKh: [dayjs().get('year')],
      maDvi: ['', [Validators.required]],
      tenDvi: ['', [Validators.required]],
      maQhns: [''],
      soBangKeCanHang: [''],
      soQuyetDinhNhap: [''],
      soHdong: [''],
      ngayKiHdong: [''],
      maDiemKho: [''],
      tenDiemKho: [''],
      maNhaKho: [''],
      tenNhaKho: [''],
      maNganKho: [''],
      tenNganKho: [''],
      maLoKho: [''],
      tenLoKho: [''],
      soPhieuNhapKho: [''],
      ngayNkho: [''],
      diaDiemKho: [''],
      hoTenNguoiGiao: [''],
      cmt: [''],
      donViGiao: [''],
      diaChiNguoiGiao: [''],
      thoiGianGiaoNhan: [''],
      loaiVthh: [''],
      tenLoaiVthh: [''],
      cloaiVthh: [''],
      tenCloaiVthh: [''],
      moTaHangHoa: [''],
      donViTinh: ['kg'],
      nguoiPduyet: [''],
      nguoiTao: [''],
      trangThai: [''],
      tenTrangThai: [''],
      tenNganLoKho: [''],
      lyDoTuChoi: [''],
      soPhieuKtraCluong: [''],
      tongSlBaoBi: [''],
      tongSlCaBaoBi: [''],
      soBangKe: [],
      loaiQd: [],
      tongSlDaTruBaoBi: [''],
      trongLuongBaoBi: [],
      trongLuongMotBao: [],
      phuongPhapCan: ['GD'],
    })
  }

  dataEdit: { [key: string]: { edit: boolean; data: chiTietBangCanKeHang } } = {};
  async ngOnInit() {
    await this.spinner.show();
    try {
      super.ngOnInit();
      this.userInfo = this.userService.getUserLogin();
      await Promise.all([
        // this.loadSoQuyetDinh(),
      ]);
      if(this.idQdGiaoNvNh){
        await this.bindingDataQd(this.idQdGiaoNvNh)
      }
      if (this.id) {
        await this.loadChiTiet(this.id);
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

  async loadChiTiet(id) {
    if (id > 0) {
      await this.spinner.show();

      let res = await this.bangCanKeMuaTrucTiepService.getDetail(id);
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          const data = res.data
          this.helperService.bidingDataInFormGroup(this.formData, data);
          await this.bindingDataQd(data.idQdGiaoNvNh);
          let dataDdNhap = this.listDiaDiemNhap.filter(item => item.id == data.idDdiemGiaoNvNh)[0];
          this.bindingDataDdNhap(dataDdNhap);
          this.bindingDataPhieuNhapKho(data.soPhieuNhapKho.split("/")[0]);
          console.log(data, "data")
          this.dataTable = data.hhBcanKeHangDtlList;
          this.dataTableGd = data.chiTietGd;
          this.dataTableTb = data.chiTietTb;
        }
      }
      await this.spinner.hide();
    }
  }

  async initForm() {
    let res = await this.userService.getId("HH_BCAN_KE_HANG_HDR_SEQ");
    this.formData.patchValue({
      soBangKeCanHang: `${res}/${this.formData.get('namKh').value}/BKCH-CCDTVP`,
      maDvi: this.userInfo.MA_DVI,
      tenDvi: this.userInfo.TEN_DVI,
      maQhns: this.userInfo.DON_VI.maQhns,
      trangThai: STATUS.DU_THAO,
      tenTrangThai: 'Dự thảo',
      nguoiTao: this.userInfo.sub
    });
    if (this.idQdGiaoNvNh) {
      await this.bindingDataQd(this.idQdGiaoNvNh);
    }
  }

  async loadSoQuyetDinh() {
    let body = {
      maDvi: this.userInfo.MA_DVI,
      loaiVthh: this.typeVthh,
      paggingReq: {
        limit: this.globals.prop.MAX_INTERGER,
        page: 0
      },
      trangThai: STATUS.BAN_HANH,
      namNhap: this.formData.get('namKh').value,
    }
    let res = await this.quyetDinhGiaoNvNhapHangService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.listSoQuyetDinh = data.content;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async openDialogSoQd() {
    await this.loadSoQuyetDinh();
    const modalQD = this.modal.create({
      nzTitle: 'Danh sách số quyết định kế hoạch giao nhiệm vụ nhập hàng',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listSoQuyetDinh,
        dataHeader: ['Số quyết định', 'Ngày quyết định', 'Loại hàng DTQG'],
        dataColumn: ['soQd', 'ngayQd', 'tenLoaiVthh'],
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
    let dataRes = await this.quyetDinhGiaoNvNhapHangService.getDetail(id)
    const data = dataRes.data;
    console.log(data, 87676)
    this.formData.patchValue({
      idQdGiaoNvNh: data.id,
      soQuyetDinhNhap: data.soQd,
      loaiVthh: data.loaiVthh,
      cloaiVthh: data.cloaiVthh,
      tenLoaiVthh: data.tenLoaiVthh,
      tenCloaiVthh: data.tenCloaiVthh,
      moTaHangHoa: data.moTaHangHoa,
      soHdong: data.soHd,
      loaiQd: data.loaiQd,
      ngayKiHdong: data.ngayKyHd,
    });
    let dataChiCuc = data.hhQdGiaoNvNhangDtlList.filter(item => item.maDvi.includes(this.userInfo.MA_DVI));
    if (dataChiCuc.length > 0) {
      this.listDiaDiemNhap = dataChiCuc[0].children;
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
        dataHeader: ['Điểm kho', 'Nhà kho', 'Ngăn kho', 'Lô kho', 'Số lượng'],
        dataColumn: ['tenDiemKho', 'tenNhaKho', 'tenNganKho', 'tenLoKho', 'soLuong']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        this.bindingDataDdNhap(data, true);
      }
    });
  }

  bindingDataDdNhap(data, isDetail?) {
    this.dataTable = [];
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
      tenNganLoKho: data.tenLoKho ? `${data.tenLoKho} - ${data.tenNganKho}` : data.tenNganKho,
    });
    if (isDetail) {
      this.formData.patchValue({
        soPhieuNhapKho: null,
        ngayNkho: null,
        hoTenNguoiGiao: null,
        cmt: null,
        donViGiao: null,
        diaChiNguoiGiao: null,
        thoiGianGiaoNhan: null,
      });
    }
    this.listSoPhieuNhapKho = data.hhPhieuNhapKhoHdr.filter(item => (item.trangThai == STATUS.DU_THAO));
  }
  openDialogSoPhieuNhapKho() {
    const modalQD = this.modal.create({
      nzTitle: 'Danh sách số phiếu nhập kho',
      nzContent: DialogTableSelectionComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        dataTable: this.listSoPhieuNhapKho,
        dataHeader: ['Số phiếu nhập kho', 'ngay nhập kho'],
        dataColumn: ['soPhieuNhapKho', 'ngayTao']
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        await this.bindingDataPhieuNhapKho(data.id);
      }
    });
  }

  async bindingDataPhieuNhapKho(id) {
    let res = await this.phieuNhapKhoMuaTrucTiepService.getDetail(id);
    if (res.msg == MESSAGE.SUCCESS) {
      const data = res.data;
      this.formData.patchValue({
        idPhieuNhapKho: data.id,
        soPhieuNhapKho: data.soPhieuNhapKho,
        ngayNkho: data.ngayTao,
        hoTenNguoiGiao: data.hoTenNguoiGiao,
        cmt: data.cmt,
        donViGiao: data.donViGiao,
        diaChiNguoiGiao: data.diaChiNguoiGiao,
        thoiGianGiaoNhan: data.thoiGianGiaoNhan,
        soPhieuKtraCluong: data.soPhieuKtraCluong,
        soBangKe: data.soBangKe
      });
    }
  }


  isDisableField() {
    // if (this.detail && (this.detail.trangThai == this.globals.prop.NHAP_CHO_DUYET_TP || this.detail.trangThai == this.globals.prop.NHAP_CHO_DUYET_LD_CHI_CUC || this.detail.trangThai == this.globals.prop.NHAP_DA_DUYET_LD_CHI_CUC)) {
    //   return true;
    // }
  }

  convertTien(tien: number): string {
    return convertTienTobangChu(tien);
  }

  deleteRow(i: any, type?:string) {
    if (type != null) {
      if(type == 'GD') {
        this.dataTableGd.splice(i, 1)
      } else if (type == 'TB') {
        this.dataTableTb.splice(i, 1)
      }
    } else {
      this.dataTable.splice(i, 1)
    }
  }

  // deleteRow(index: any) {
  //   this.modal.confirm({
  //     nzClosable: false,
  //     nzTitle: 'Xác nhận',
  //     nzContent: 'Bạn có chắc chắn muốn xóa?',
  //     nzOkText: 'Đồng ý',
  //     nzCancelText: 'Không',
  //     nzOkDanger: true,
  //     nzWidth: 400,
  //     nzOnOk: async () => {
  //       try {
  //         this.dataTable.splice(index, 1);
  //         this.updateEditCache();
  //       } catch (e) {
  //         console.log('error', e);
  //       }
  //     },
  //   });
  // }

  editRow(i: number, type?:string) {
    if (type != null) {
      if(type == 'GD') {
        this.dataTableGd[i].edit = true;
        this.rowItemGdEdit[i] = cloneDeep(this.dataTableGd[i])
      } else if (type == 'TB') {
        this.dataTableTb[i].edit = true;
        this.rowItemTbEdit[i] = cloneDeep(this.dataTableTb[i])
      }
    } else {
      this.dataTable[i].edit = true;
      this.rowItemEdit[i] = cloneDeep(this.dataTable[i])
    }
  }


  addRow(type?:string) {
    if (type != null) {
      if(type == 'GD') {
        this.rowItemGd.phanLoai = 'GD'
        this.dataTableGd = [...this.dataTableGd, this.rowItemGd];
        this.rowItemGd = {};
      } else if (type == 'TB') {
        this.rowItemTb.phanLoai = 'TB'
        this.dataTableTb = [...this.dataTableTb, this.rowItemTb];
        this.rowItemTb = {};
      }
    } else {
      this.dataTable = [...this.dataTable, this.rowItem];
      this.rowItem = {};
    }
  }
  // addRow() {
  //   if (this.validateDataRow()) {
  //     if (!this.dataTable) {
  //       this.dataTable = [];
  //     }
  //     this.dataTable = [...this.dataTable, this.rowItem];
  //     this.rowItem = new chiTietBangCanKeHang();
  //     this.emitDataTable();
  //     this.updateEditCache()
  //   }
  // }

  emitDataTable() {
    this.dataTableChange.emit(this.dataTable);
  }

  validateDataRow() {
    if (this.rowItem.maCan && this.rowItem.soBaoBi && this.rowItem.trongLuongCaBi) {
      let tongTrongLuong = this.calcTong('trongLuongCaBi');
      if (tongTrongLuong + this.rowItem.trongLuongCaBi > this.formData.value.soLuongNhapKho) {
        this.notification.error(MESSAGE.ERROR, "Trọng lượng bao bì không được vượt quá số lượng nhập kho");
        return false
      }
      return true;
    } else {
      this.notification.error(MESSAGE.ERROR, "Vui lòng nhập đủ thông tin");
      return false
    }
  }

  // saveEdit(idx: number): void {
  //   Object.assign(this.dataTable[idx], this.dataEdit[idx].data);
  //   this.dataEdit[idx].edit = false;
  // }

  saveEdit(i: number, type?:string): void {
    if (type != null) {
      if(type == 'GD') {
        this.dataTableGd[i] = cloneDeep(this.rowItemGdEdit[i])
        this.dataTableGd[i].edit = false;
      } else if (type == 'TB') {
        this.dataTableTb[i] = cloneDeep(this.rowItemTbEdit[i])
        this.dataTableTb[i].edit = false;
      }
    } else {
      this.dataTable[i] = cloneDeep(this.rowItemEdit[i])
      this.dataTable[i].edit = false;
    }
  }

  // cancelEdit(stt: number): void {
  //   this.dataEdit[stt] = {
  //     data: {...this.dataTable[stt]},
  //     edit: false
  //   };
  // }

  cancelEdit(i: number, type?:string): void {
    if (type != null) {
      if(type == 'GD') {
        this.dataTableGd[i].edit = false;
      } else if (type == 'TB') {
        this.dataTableTb[i].edit = false;
      }
    } else {
      this.dataTable[i].edit = false;
    }
  }

  updateEditCache(): void {
    if (this.dataTable) {
      this.dataTable.forEach((item, index) => {
        this.dataEdit[index] = {
          edit: false,
          data: {...item},
        };
      });
    }
  }


  clearItemRow(type?:string) {
    if (type != null) {
      if(type == 'GD') {
        this.rowItemGd = {};
      } else if (type == 'TB') {
        this.rowItemTb = {};
      }
    } else {
      this.rowItem = {};
    }
  }
  // clearItemRow() {
  //   this.rowItem = {};
  // }

  pheDuyet() {
    if (this.checkPrice.boolean) {
      this.notification.error(MESSAGE.ERROR, this.checkPrice.msgSuccess);
      return;
    }
    let trangThai = ''
    let mess = ''
    switch (this.formData.get('trangThai').value) {
      case STATUS.TU_CHOI_LDCC:
      case STATUS.DU_THAO: {
        trangThai = STATUS.CHO_DUYET_LDCC;
        mess = 'Bạn có muốn gửi duyệt ?'
        break;
      }
      case STATUS.CHO_DUYET_LDCC: {
        trangThai = STATUS.DA_DUYET_LDCC;
        mess = 'Bạn có chắc chắn muốn phê duyệt ?'
        break;
      }
    }
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: mess,
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 500,
      nzOnOk: async () => {
        this.spinner.show();
        try {
          let body = {
            id: this.id,
            trangThai: trangThai,
          };
          let res =
            await this.bangCanKeMuaTrucTiepService.approve(
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
    if (this.checkPrice.boolean) {
      this.notification.error(MESSAGE.ERROR, this.checkPrice.msgSuccess);
      return;
    }
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
            await this.bangCanKeMuaTrucTiepService.approve(
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

  async save(isGuiDuyet: boolean) {
    if (this.checkPrice.boolean) {
      this.notification.error(MESSAGE.ERROR, this.checkPrice.msgSuccess);
      return;
    }
    // if (this.validateSave()) {
    this.spinner.show();
    try {
      this.helperService.markFormGroupTouched(this.formData);
      if (this.formData.invalid) {
        await this.spinner.hide();
        return;
      }
      let body = this.formData.value;
      body.hhBcanKeHangDtlReqList = [...this.dataTable, ...this.dataTableGd, ...this.dataTableTb];
      let res;
      if (this.formData.get('id').value > 0) {
        res = await this.bangCanKeMuaTrucTiepService.update(body);
      } else {
        res = await this.bangCanKeMuaTrucTiepService.create(body);
      }
      if (res.msg == MESSAGE.SUCCESS) {
        if (isGuiDuyet) {
          await this.spinner.hide();
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
          await this.spinner.hide();
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
        await this.spinner.hide();
      }
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }

  }

  validateSave() {
    let tongTrongLuong = this.calcTong('trongLuongCaBi') - this.formData.value.trongLuongBaoBi;
    if (tongTrongLuong != this.formData.value.soLuongNhapKho) {
      this.notification.error(MESSAGE.ERROR, "Tổng trọng lượng bao bì của bảng kê đang không đủ số lượng nhập kho")
      return false;
    }
    return true;
  }

  print() {

  }

  thongTinTrangThai(trangThai: string): string {
    return thongTinTrangThaiNhap(trangThai);
  }

  calcTong(columnName, type?:string) {
    if (type != null) {
      if(type == 'GD') {
        if (this.dataTableGd) {
          return this.dataTableGd.reduce((prev, cur) => {
            prev += cur[columnName];
            return prev;
          }, 0);
        }
      } else if (type == 'TB') {
        if (this.dataTableTb) {
          return this.dataTableTb.reduce((prev, cur) => {
            prev += cur[columnName];
            return prev;
          }, 0);
        }
      }
    } else {
      if (this.dataTable) {
        return this.dataTable.reduce((prev, cur) => {
          prev += cur[columnName];
          return prev;
        }, 0);
      }
    }
  }

  // calcTong(columnName) {
  //   if (this.dataTable) {
  //     const sum = this.dataTable.reduce((prev, cur) => {
  //       prev += cur[columnName];
  //       return prev;
  //     }, 0);
  //     this.formData.patchValue({
  //       tongSlCaBaoBi: sum
  //     })
  //     return sum;
  //   }
  // }


  isDisabled() {
    let trangThai = this.formData.value.trangThai;
    if (trangThai == STATUS.CHO_DUYET_LDCC || trangThai == STATUS.DA_DUYET_LDCC) {
      return true;
    } else {
      return false;
    }
  }

  startEdit(index: number) {
    this.dataEdit[index].edit = true;
  }
}
