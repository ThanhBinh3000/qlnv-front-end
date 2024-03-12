import { Component, OnInit, Input } from '@angular/core';
import { cloneDeep } from 'lodash';
import { UserLogin } from 'src/app/models/userlogin';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { NgxSpinnerService } from 'ngx-spinner';
import { DonviService } from 'src/app/services/donvi.service';
import { QuanLyPhieuKiemNghiemChatLuongHangService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/kiemtra-cl/quanLyPhieuKiemNghiemChatLuongHang.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { TinhTrangKhoHienThoiService } from 'src/app/services/tinhTrangKhoHienThoi.service';
import { UserService } from 'src/app/services/user.service';
import { MESSAGE } from 'src/app/constants/message';
import * as dayjs from 'dayjs';
import { saveAs } from 'file-saver';
import { Globals } from 'src/app/shared/globals';
import { BaseComponent } from 'src/app/components/base/base.component';
import { QuyetDinhGiaoNvNhapHangService } from 'src/app/services/qlnv-hang/nhap-hang/mua-truc-tiep/qdinh-giao-nvu-nh/quyetDinhGiaoNvNhapHang.service';
import { QuyetDinhGiaoNhapHangService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/qd-giaonv-nh/quyetDinhGiaoNhapHang.service';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import { v4 as uuidv4 } from 'uuid';
import { chain } from 'lodash';
import { FormGroup } from '@angular/forms';
import { PhieuKiemNghiemChatLuongDieuChuyenService } from '../services/dcnb-phieu-kiem-nghiem-chat-luong.service';
import { STATUS } from 'src/app/constants/status';
import { Base2Component } from 'src/app/components/base2/base2.component';
export interface PassDataPKNCL {
  soPhieuKnChatLuong: string, phieuKnChatLuongId: number, soQdinhDcc: string, qdinhDccId: number, ngayQDHieuLuc: string, soBBLayMau: string, bblayMauId: number, ngaylayMau: string, tenLoKho: string, maLoKho: string,
  tenNganKho: string, maNganKho: string, tenNhaKho: string, maNhaKho: string, tenDiemKho: string, maDiemKho: string, tenHangHoa: string, maHangHoa: string, tenChLoaiHangHoa: string, maChLoaiHangHoa: string,
  thuKhoId: number, tenThuKho: string, donViTinh: string, keHoachDcDtlId: number, ngayHieuLuc: string, ngayQdinhDc: string
};
export interface MA_QUYEN_PKNCL {
  XEM: string,
  THEM: string,
  XOA: string,
  DUYET_TP: string,
  DUYET_LDCUC: string,
  EXP: string,
  IN: string
}
@Component({
  selector: 'app-quan-ly-phieu-kiem-nghiem-chat-luong',
  templateUrl: './quan-ly-phieu-kiem-nghiem-chat-luong.component.html',
  styleUrls: ['./quan-ly-phieu-kiem-nghiem-chat-luong.component.scss'],
})
export class PhieuKiemNghiemChatLuongXuatDieuChuyenComponent extends Base2Component implements OnInit {
  @Input() loaiDc: string;
  @Input() isVatTu: boolean;
  @Input() thayDoiThuKho: boolean;
  @Input() type: string;
  @Input() typeQd: string;
  @Input() loaiMaQuyen: string;
  toDay = new Date();
  last30Day = new Date(
    new Date().setTime(this.toDay.getTime() - 30 * 24 * 60 * 60 * 1000),
  );
  isView = false;
  expandSetString = new Set<string>();
  dataView: any = [];
  dataTable: any[] = [];
  dataTableAll: any[] = [];
  formData: FormGroup;
  listDiemKho: any[] = [];
  listNganKho: any[] = [];
  listNganLo: any[] = [];

  loaiVthh: string;
  loaiStr: string;
  maVthh: string;
  idVthh: number;
  routerVthh: string;
  isTatCa: boolean = false;

  bblayMauId: number;
  isViewBbLayMau: boolean = false

  qdinhDccId: number;
  isViewQdDc: boolean = false;

  idBbTinhKho: number;
  isViewBbTinhKho: boolean = false;

  userInfo: UserLogin;
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 0;
  isDetail: boolean = false;
  selectedId: number = 0;

  allChecked = false;
  indeterminate = false;
  passData: PassDataPKNCL = {
    soPhieuKnChatLuong: '', phieuKnChatLuongId: null, soQdinhDcc: '', qdinhDccId: null, ngayQDHieuLuc: '', soBBLayMau: '', bblayMauId: null, ngaylayMau: '', tenLoKho: '', maLoKho: '',
    tenNganKho: '', maNganKho: '', tenNhaKho: '', maNhaKho: '', tenDiemKho: '', maDiemKho: '', tenHangHoa: '', maHangHoa: '', tenChLoaiHangHoa: '', maChLoaiHangHoa: '', thuKhoId: null, tenThuKho: '',
    donViTinh: '', keHoachDcDtlId: null, ngayHieuLuc: '', ngayQdinhDc: ''
  };
  LIST_TRANG_THAI: { [key: string]: string } = {
    [STATUS.DU_THAO]: "Dự thảo",
    [STATUS.CHO_DUYET_TP]: "Chờ duyệt - TP",
    [STATUS.CHO_DUYET_LDC]: "Chờ duyệt - LĐ Cục",
    [STATUS.TU_CHOI_TP]: "Từ chối - TP",
    [STATUS.TU_CHOI_LDC]: "Từ chối - LĐ Cục",
    [STATUS.DA_DUYET_LDC]: "Đã duyệt - LĐ Cục"
  }
  MA_QUYEN: MA_QUYEN_PKNCL = {
    XEM: "",
    THEM: "",
    XOA: "",
    DUYET_TP: "",
    DUYET_LDCUC: "",
    EXP: "",
    IN: ""
  };
  constructor(
    private httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private donViService: DonviService,
    private tinhTrangKhoHienThoiService: TinhTrangKhoHienThoiService,
    private quyetDinhGiaoNhapHangService: QuyetDinhGiaoNhapHangService,
    private phieuKiemNghiemChatLuongDieuChuyenService: PhieuKiemNghiemChatLuongDieuChuyenService
  ) {
    super(httpClient, storageService, notification, spinner, modal, phieuKiemNghiemChatLuongDieuChuyenService);
    this.formData = this.fb.group({
      // namKeHoach: [dayjs().get("year")],
      type: [null],
      nam: [null],
      maDvi: [null],
      loaiDc: [null],
      isVatTu: [false],
      thayDoiThuKho: [false],
      typeQd: [],
      soQdinh: [null],
      soPhieu: [null],
      tuNgay: [null],
      denNgay: [null],
      soBBLayMau: [null],
      soBbXuatDocKho: [null],
    })
    this.filterTable = {
      soQdinh: '',
      nam: '',
      ngayQdGiaoNvXh: '',
      soPhieu: '',
      ngayKnMau: '',
      tenDiemKho: '',
      tenNhaKho: '',
      tenNganKho: '',
      tenLoKho: '',
      soBienBan: '',
      ngayLayMau: '',
      soBbTinhKho: '',
      ngayXuatDocKho: '',
      tenTrangThai: '',
    };

    console.log("loaiMaQuyen1", this.loaiMaQuyen, this.MA_QUYEN)
  }

  async ngOnInit() {
    this.spinner.show();
    super.ngOnInit();
    try {
      this.setMaQuyen();
      this.formData.patchValue({ loaiDc: this.loaiDc, isVatTu: this.isVatTu, thayDoiThuKho: this.thayDoiThuKho, type: this.type, typeQd: this.typeQd, maDvi: this.userInfo.MA_DVI, trangThai: STATUS.BAN_HANH })
      await this.timKiem()
    } catch (e) {
      console.log('error: ', e);
      this.notification?.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
    finally {
      this.spinner.hide()
    }
  }
  setMaQuyen() {
    switch (this.loaiMaQuyen) {
      case 'DCNB_LT_KHACTK':
        this.MA_QUYEN.XEM = 'DCNB_XUAT_NBCC_KHACTK_KTCL_LT_PKNCL_XEM';
        this.MA_QUYEN.THEM = 'DCNB_XUAT_NBCC_KHACTK_KTCL_LT_PKNCL_THEM';
        this.MA_QUYEN.XOA = 'DCNB_XUAT_NBCC_KHACTK_KTCL_LT_PKNCL_XOA';
        this.MA_QUYEN.DUYET_TP = 'DCNB_XUAT_NBCC_KHACTK_KTCL_LT_PKNCL_DUYET_TP';
        this.MA_QUYEN.DUYET_LDCUC = 'DCNB_XUAT_NBCC_KHACTK_KTCL_LT_PKNCL_DUYET_LDCUC';
        this.MA_QUYEN.EXP = 'DCNB_XUAT_NBCC_KHACTK_KTCL_LT_PKNCL_EXP';
        this.MA_QUYEN.IN = 'DCNB_XUAT_NBCC_KHACTK_KTCL_LT_PKNCL_IN';
        break;
      case 'DCNB_VT_KHACTK':
        this.MA_QUYEN.XEM = 'DCNB_XUAT_NBCC_KHACTK_KTCL_VT_PKNCL_XEM';
        this.MA_QUYEN.THEM = 'DCNB_XUAT_NBCC_KHACTK_KTCL_VT_PKNCL_THEM';
        this.MA_QUYEN.XOA = 'DCNB_XUAT_NBCC_KHACTK_KTCL_VT_PKNCL_XOA';
        this.MA_QUYEN.DUYET_TP = 'DCNB_XUAT_NBCC_KHACTK_KTCL_VT_PKNCL_DUYET_TP';
        this.MA_QUYEN.DUYET_LDCUC = 'DCNB_XUAT_NBCC_KHACTK_KTCL_VT_PKNCL_DUYET_LDCUC';
        this.MA_QUYEN.EXP = 'DCNB_XUAT_NBCC_KHACTK_KTCL_VT_PKNCL_EXP';
        this.MA_QUYEN.IN = 'DCNB_XUAT_NBCC_KHACTK_KTCL_VT_PKNCL_IN';
        break;
      case 'CHICUC_LT':
        this.MA_QUYEN.XEM = 'DCNB_XUAT_CUNG1CUC_KTCL_LT_PKNCL_XEM';
        this.MA_QUYEN.THEM = 'DCNB_XUAT_CUNG1CUC_KTCL_LT_PKNCL_THEM';
        this.MA_QUYEN.XOA = 'DCNB_XUAT_CUNG1CUC_KTCL_LT_PKNCL_XOA';
        this.MA_QUYEN.DUYET_TP = 'DCNB_XUAT_CUNG1CUC_KTCL_LT_PKNCL_DUYET_TP';
        this.MA_QUYEN.DUYET_LDCUC = 'DCNB_XUAT_CUNG1CUC_KTCL_LT_PKNCL_DUYET_LDCUC';
        this.MA_QUYEN.EXP = 'DCNB_XUAT_CUNG1CUC_KTCL_LT_PKNCL_EXP';
        this.MA_QUYEN.IN = 'DCNB_XUAT_CUNG1CUC_KTCL_LT_PKNCL_IN';
        break;
      case 'CHICUC_VT':
        this.MA_QUYEN.XEM = 'DCNB_XUAT_CUNG1CUC_KTCL_VT_PKNCL_XEM';
        this.MA_QUYEN.THEM = 'DCNB_XUAT_CUNG1CUC_KTCL_VT_PKNCL_THEM';
        this.MA_QUYEN.XOA = 'DCNB_XUAT_CUNG1CUC_KTCL_VT_PKNCL_XOA';
        this.MA_QUYEN.DUYET_TP = 'DCNB_XUAT_CUNG1CUC_KTCL_VT_PKNCL_DUYET_TP';
        this.MA_QUYEN.DUYET_LDCUC = 'DCNB_XUAT_CUNG1CUC_KTCL_VT_PKNCL_DUYET_LDCUC';
        this.MA_QUYEN.EXP = 'DCNB_XUAT_CUNG1CUC_KTCL_VT_PKNCL_EXP';
        this.MA_QUYEN.IN = 'DCNB_XUAT_CUNG1CUC_KTCL_VT_PKNCL_IN';
        break;
      case 'CUC_LT':
        this.MA_QUYEN.XEM = 'DCNB_XUAT_2CUC_KTCL_LT_PKNCL_XEM';
        this.MA_QUYEN.THEM = 'DCNB_XUAT_2CUC_KTCL_LT_PKNCL_THEM';
        this.MA_QUYEN.XOA = 'DCNB_XUAT_2CUC_KTCL_LT_PKNCL_XOA';
        this.MA_QUYEN.DUYET_TP = 'DCNB_XUAT_2CUC_KTCL_LT_PKNCL_DUYET_TP';
        this.MA_QUYEN.DUYET_LDCUC = 'DCNB_XUAT_2CUC_KTCL_LT_PKNCL_DUYET_LDCUC';
        this.MA_QUYEN.EXP = 'DCNB_XUAT_2CUC_KTCL_LT_PKNCL_EXP';
        this.MA_QUYEN.IN = 'DCNB_XUAT_2CUC_KTCL_LT_PKNCL_IN';
        break;
      case 'CUC_VT':
        this.MA_QUYEN.XEM = 'DCNB_XUAT_2CUC_KTCL_VT_PKNCL_XEM';
        this.MA_QUYEN.THEM = 'DCNB_XUAT_2CUC_KTCL_VT_PKNCL_THEM';
        this.MA_QUYEN.XOA = 'DCNB_XUAT_2CUC_KTCL_VT_PKNCL_XOA';
        this.MA_QUYEN.DUYET_TP = 'DCNB_XUAT_2CUC_KTCL_VT_PKNCL_DUYET_TP';
        this.MA_QUYEN.DUYET_LDCUC = 'DCNB_XUAT_2CUC_KTCL_VT_PKNCL_DUYET_LDCUC';
        this.MA_QUYEN.EXP = 'DCNB_XUAT_2CUC_KTCL_VT_PKNCL_EXP';
        this.MA_QUYEN.IN = 'DCNB_XUAT_2CUC_KTCL_VT_PKNCL_IN';
        break;
      default:
        break;
    }
  }
  async timKiem(): Promise<void> {
    try {
      const data = this.formData.value;
      const dataTrim = this.trimStringData(data);
      this.formData.patchValue({ ...dataTrim })
      await this.search();
      this.buildTableView()
    } catch (error) {
      console.log("error", error)
    }
  };
  trimStringData(obj: any) {
    for (const key in obj) {
      const value = obj[key];
      if (typeof value === 'string' || value instanceof String) {
        obj[key] = value.trim();
      }
    };
    return obj
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
    if (this.dataTable.every((item) => !item.checked)) {
      this.allChecked = false;
      this.indeterminate = false;
    } else if (this.dataTable.every((item) => item.checked)) {
      this.allChecked = true;
      this.indeterminate = false;
    } else {
      this.indeterminate = true;
    }
  }

  // async search() {
  //   await this.spinner.show();
  //   let body = {
  //     "paggingReq": {
  //       "limit": this.pageSize,
  //       "page": this.page - 1
  //     },
  //     ...this.formData.value,
  //     ngayKnghiemTu: this.formData.value.ngayKnghiem
  //       ? dayjs(this.formData.value.ngayKnghiem[0]).format('YYYY-MM-DD')
  //       : null,
  //     ngayKnghiemDen: this.formData.value.ngayKnghiem
  //       ? dayjs(this.formData.value.ngayKnghiem[1]).format('YYYY-MM-DD')
  //       : null,
  //   };
  //   let res = await this.quyetDinhGiaoNhapHangService.search(body);
  //   if (res.msg == MESSAGE.SUCCESS) {
  //     let data = res.data;
  //     this.dataTable = data.content;

  //     this.dataTableAll = cloneDeep(this.dataTable);
  //     this.buildTableView();
  //     this.totalRecord = data.totalElements;
  //   } else {
  //     this.notification.error(MESSAGE.ERROR, res.msg);
  //   }
  //   await this.spinner.hide();
  // }

  async changePageIndex(event) {
    this.spinner.show();
    try {
      this.page = event;
      await this.timKiem();
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async changePageSize(event) {
    this.spinner.show();
    try {
      this.pageSize = event;
      if (this.page === 1) {
        await this.timKiem();
      }
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }
  resetForm() {
    this.formData.reset();
    this.formData.patchValue({ loaiDc: this.loaiDc, isVatTu: this.isVatTu, thayDoiThuKho: this.thayDoiThuKho, type: this.type, typeQd: this.typeQd })
  }
  clearFilter() {
    this.resetForm()
    this.timKiem();
  }

  xoaItem(data) {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn xóa?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: async () => {
        this.spinner.show();
        try {
          const res = await this.phieuKiemNghiemChatLuongDieuChuyenService.delete({ id: data.id, type: '00' });
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.DELETE_SUCCESS);
            this.timKiem();
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
        } catch (e) {
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        } finally {
          this.spinner.hide();
        }
      },
    });
  }

  deleteSelect() {
    const dataDelete = this.dataTable
      .filter((item) => item.checked)
      .map((item) => item.id);
    if (dataDelete && dataDelete.length > 0) {
      this.modal.confirm({
        nzClosable: false,
        nzTitle: 'Xác nhận',
        nzContent: 'Bạn có chắc chắn muốn xóa các bản ghi đã chọn?',
        nzOkText: 'Đồng ý',
        nzCancelText: 'Không',
        nzOkDanger: true,
        nzWidth: 310,
        nzOnOk: async () => {
          this.spinner.show();
          try {
            let res =
              await this.phieuKiemNghiemChatLuongDieuChuyenService.deleteMuti({
                ids: dataDelete,
              });
            if (res.msg == MESSAGE.SUCCESS) {
              this.notification.success(
                MESSAGE.SUCCESS,
                MESSAGE.DELETE_SUCCESS,
              );
              await this.timKiem();
            } else {
              this.notification.error(MESSAGE.ERROR, res.msg);
            }
          } catch (e) {
            console.log('error: ', e);
            this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
          } finally {
            this.spinner.hide();
            this.allChecked = false;
          }
        },
      });
    } else {
      this.notification.error(
        MESSAGE.ERROR,
        'Không có dữ liệu phù hợp để xóa.',
      );
    }
  }

  async showList() {
    this.isDetail = false;
    await this.timKiem();
  }

  filterInTable(key: string, value: string | Date) {
    if (value instanceof Date) {
      value = dayjs(value).format('YYYY-MM-DD');
    }

    if (value && value != '') {
      this.dataTable = this.dataTableAll.filter((item) =>
        item[key]
          ?.toString()
          .toLowerCase()
          .includes(value.toString().toLowerCase()),
      );
    } else {
      this.dataTable = cloneDeep(this.dataTableAll);
    }
  }

  clearFilterTable() {
    this.filterTable = {
      soQuyetDinhNhap: '',
      soPhieu: '',
      ngayBanGiaoMau: null,
      tenDiemKho: '',
      tenDvi: '',
      soLuongMauHangKt: '',
      trangThaiDuyet: '',
    };
  }

  async export() {
    if (this.totalRecord && this.totalRecord > 0) {
      this.spinner.show();
      try {
        let body = {
          ...this.formData.value,
          ngayKnghiemTu: this.formData.value.ngayKnghiem
            ? dayjs(this.formData.value.ngayKnghiem[0]).format('YYYY-MM-DD')
            : null,
          ngayKnghiemDen: this.formData.value.ngayKnghiem
            ? dayjs(this.formData.value.ngayKnghiem[1]).format('YYYY-MM-DD')
            : null,
          pageNumber: this.page,
          pageSize: this.pageSize,
        };
        const blob = await this.phieuKiemNghiemChatLuongDieuChuyenService.export(
          body,
        );
        saveAs(blob, 'danh-sach-phieu-kiem-nghiem-chat-luong.xlsx');
        this.spinner.hide();
      } catch (e) {
        console.log('error: ', e);
        this.spinner.hide();
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
    } else {
      this.notification.error(MESSAGE.ERROR, MESSAGE.DATA_EMPTY);
    }
  }

  printTable() {
    let WindowPrt = window.open(
      '',
      '',
      'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0',
    );
    let printContent = '';
    printContent = printContent + '<div>';
    printContent =
      printContent + document.getElementById('table-phieu-kncl').innerHTML;
    printContent = printContent + '</div>';
    WindowPrt.document.write(printContent);
    WindowPrt.document.close();
    WindowPrt.focus();
    WindowPrt.print();
    WindowPrt.close();
  }

  // expandSet = new Set<number>();
  // onExpandChange(id: number, checked: boolean): void {
  //   if (checked) {
  //     this.expandSet.add(id);
  //   } else {
  //     this.expandSet.delete(id);
  //   }
  // }

  redirectToChiTiet(lv2: any, isView: boolean, bblayMauId?: number) {
    this.selectedId = lv2.id;
    this.isDetail = true;
    this.isView = isView;
    this.bblayMauId = bblayMauId;
    this.passData = {
      soPhieuKnChatLuong: lv2.soPhieuKnChatLuong, phieuKnChatLuongId: lv2.id, soQdinhDcc: lv2.soQdinh, qdinhDccId: lv2.qdinhDccId, ngayQDHieuLuc: lv2.ngayQDHieuLuc,
      soBBLayMau: lv2.soBBLayMau, bblayMauId: lv2.bblayMauId, ngaylayMau: lv2.ngaylayMau, tenLoKho: lv2.tenLoKho, maLoKho: lv2.maLoKho, tenNganKho: lv2.tenNganKho,
      maNganKho: lv2.maNganKho, tenNhaKho: lv2.tenNhaKho, maNhaKho: lv2.maNhaKho, tenDiemKho: lv2.tenDiemKho, maDiemKho: lv2.maDiemKho, tenHangHoa: lv2.tenHangHoa,
      maHangHoa: lv2.maHangHoa, tenChLoaiHangHoa: lv2.tenChLoaiHangHoa, maChLoaiHangHoa: lv2.maChLoaiHangHoa, thuKhoId: lv2.thuKhoId, tenThuKho: lv2.thuKho,
      donViTinh: lv2.donViTinh, keHoachDcDtlId: lv2.keHoachDcDtlId, ngayHieuLuc: lv2.ngayHieuLuc, ngayQdinhDc: lv2.ngayQdinhDc
    }
  }

  buildTableView() {
    // let removeDuplicateData = [];
    // this.dataTable.forEach((item, i) => {
    //   const maLoNganKho = item.maLoNganKho ? item.maLoNganKho : (item.maLoKho ? `${item.maLoKho}${item.maNganKho}` : item.maNganKho);
    //   const dataIndex = removeDuplicateData.findIndex(f => f.soQdinh == item.soQdinh && f.maLoNganKho == maLoNganKho);
    //   if (dataIndex < 0) {
    //     removeDuplicateData.push({ ...item, maLoNganKho })
    //   }
    // })
    let dataView = Array.isArray(this.dataTable) ?
      chain(this.dataTable).groupBy("soQdinh").map((rs, i) => {
        const dataSoQdinh = rs.find(f => f.soQdinh == i);
        if (!dataSoQdinh) return;
        const rsx = chain(rs).groupBy("maDiemKho").map((v, k) => {
          let rowLv2 = v.find(s => s.maDiemKho === k);
          if (!rowLv2) {
            return;
          }
          return {
            ...rowLv2,
            idVirtual: uuidv4(),
            maDiemKho: k,
            childData: v
          }
        }).value()
        return {
          ...dataSoQdinh,
          idVirtual: uuidv4(),
          childData: rsx
        }
      }).value() : [];
    this.dataView = cloneDeep(dataView);
    this.expandAll()
  }

  expandAll() {
    this.dataView.forEach(s => {
      this.expandSetString.add(s.idVirtual);
    })
  }

  onExpandStringChange(id: string, checked: boolean): void {
    if (checked) {
      this.expandSetString.add(id);
    } else {
      this.expandSetString.delete(id);
    }
  }
  checkRoleAdd(trangThai: string): boolean {
    if (this.userService.isAccessPermisson(this.MA_QUYEN.THEM) && this.userService.isCuc() && !trangThai) {
      return true
    }
    return false
  }
  checkRoleView(trangThai: STATUS): boolean {
    console.log("trangThai", trangThai)
    if (this.userService.isAccessPermisson(this.MA_QUYEN.XEM) && !this.checkRoleAdd(trangThai) && !this.checkRoleEdit(trangThai) && !this.checkRoleApprove(trangThai)) {
      return true
    }
    return false
  }
  checkRoleEdit(trangThai: STATUS): boolean {
    if (this.userService.isAccessPermisson(this.MA_QUYEN.THEM) && this.userService.isCuc() && (trangThai == STATUS.DU_THAO || trangThai == STATUS.TU_CHOI_TP || trangThai == STATUS.TU_CHOI_LDC)) {
      return true
    }
    return false
  }
  checkRoleApprove(trangThai: STATUS): boolean {
    if ((this.userService.isAccessPermisson(this.MA_QUYEN.DUYET_TP) && trangThai == STATUS.CHO_DUYET_TP || this.userService.isAccessPermisson(this.MA_QUYEN.DUYET_LDCUC) && trangThai == STATUS.CHO_DUYET_LDC) && this.userService.isCuc()) {
      return true
    }
    return false
  }
  checkRoleDelete(trangThai: STATUS): boolean {
    if (this.userService.isAccessPermisson(this.MA_QUYEN.XOA) && this.userService.isCuc() && trangThai == STATUS.DU_THAO) {
      return true
    };
    return false
  }

  disabledTuNgay = (startValue: Date): boolean => {
    if (startValue && this.formData.value.denNgay) {
      return startValue.getTime() > this.formData.value.denNgay.getTime();
    }
    return false;
  };

  disabledDenNgay = (endValue: Date): boolean => {
    if (!endValue || !this.formData.value.tuNgay) {
      return false;
    }
    return endValue.getTime() <= this.formData.value.tuNgay.getTime();
  };
  openModalQdDc(id: number) {
    this.qdinhDccId = id;
    this.isViewQdDc = true
  }
  closeModalQdDc() {
    this.qdinhDccId = null;
    this.isViewQdDc = false
  }

  openModalBbLayMau(id: number) {
    this.bblayMauId = id;
    this.isViewBbLayMau = true
  }
  closeModalBbLayMau() {
    this.bblayMauId = null;
    this.isViewBbLayMau = false
  }
  openModalBbTinhKho(id: number) {
    this.idBbTinhKho = id;
    this.isViewBbTinhKho = true
  }
  closeModalBbTinhKho() {
    this.idBbTinhKho = null;
    this.isViewBbTinhKho = false
  }
}
