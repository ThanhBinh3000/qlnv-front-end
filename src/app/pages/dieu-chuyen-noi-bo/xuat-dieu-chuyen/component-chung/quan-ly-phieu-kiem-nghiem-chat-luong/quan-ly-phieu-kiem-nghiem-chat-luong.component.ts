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

@Component({
  selector: 'app-quan-ly-phieu-kiem-nghiem-chat-luong',
  templateUrl: './quan-ly-phieu-kiem-nghiem-chat-luong.component.html',
  styleUrls: ['./quan-ly-phieu-kiem-nghiem-chat-luong.component.scss'],
})
export class PhieuKiemNghiemChatLuongXuatDieuChuyenComponent extends Base2Component implements OnInit {
  @Input() loaiDc: string;
  @Input() typeVthh: string[];
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

  idBbLayMau: number;
  isViewBbLayMau: boolean = false

  idQdDc: number;
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
      nam: [null],
      maDvi: [null],
      loaiDc: [null],
      loaiVthh: [null],
      soQdinhDcc: [null],
      soPhieu: [null],
      tuNgay: [null],
      denNgay: [null],
      soBbLayMau: [null],
      soBbXuatDocKho: [null],
    })
    this.filterTable = {
      soQdGiaoNvXh: '',
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
  }

  async ngOnInit() {
    this.spinner.show();
    super.ngOnInit();
    try {
      // if (this.typeVthh == 'tat-ca') {
      //   this.isTatCa = true;
      // }
      this.formData.patchValue({ loaiDc: this.loaiDc, loaiVthh: this.typeVthh, maDvi: this.userInfo.MA_DVI, trangThai: STATUS.BAN_HANH })
      this.timKiem()
    } catch (e) {
      console.log('error: ', e);
      this.notification?.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
    finally {
      this.spinner.hide()
    }
  }
  async timKiem(): Promise<void> {
    try {
      await this.search();
      this.buildTableView()
    } catch (error) {
      console.log("error", error)
    }
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
      await this.search();
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
        await this.search();
      }
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  clearFilter() {
    this.formData.reset()
    this.search();
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
          const res = await this.phieuKiemNghiemChatLuongDieuChuyenService.delete({ id: data.id });
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.DELETE_SUCCESS);
            this.search();
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
              await this.search();
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
    await this.search();
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

  redirectToChiTiet(lv2: any, isView: boolean, idBbLayMau?: number) {
    this.selectedId = lv2.id;
    this.isDetail = true;
    this.isView = isView;
    this.idBbLayMau = idBbLayMau;
  }

  buildTableView() {
    let dataView = Array.isArray(this.dataTable) ? chain(this.dataTable)
      .groupBy("soQdGiaoNvXh")
      .map((value, key) => {
        let rs = chain(value)
          .groupBy("maDiemKho")
          .map((v, k) => {
            let rowLv2 = v.find(s => s.maDiemKho === k);
            return {
              id: rowLv2.id,
              idVirtual: uuidv4(),
              maDiemKho: k,
              tenDiemKho: rowLv2.tenDiemKho,
              // maNhaKho: rowLv2.maNhaKho,
              // tenNhaKho: rowLv2.tenNhaKho,
              // maNganKho: rowLv2.maNganKho,
              // tenNganKho: rowLv2.tenNganKho,
              // tenLoKho: rowLv2.tenLoKho,
              // maLoKho: rowLv2.maLoKho,
              // soPhieu: rowLv2.soPhieu,
              // ngayKnghiem: rowLv2.ngayKnghiem,
              // idBbLayMau: rowLv2.idBbLayMau,
              // soBbLayMau: rowLv2.soBbLayMau,
              // ngayLayMau: rowLv2.ngayLayMau,
              // soBbXuatDocKho: rowLv2.soBbXuatDocKho,
              // ngayXuatDocKho: rowLv2.ngayXuatDocKho,
              // trangThai: rowLv2.trangThai,
              // tenTrangThai: rowLv2.tenTrangThai,
              childData: v
            }
          }
          ).value();
        let rowLv1 = value.find(s => s.soQdGiaoNvXh === key);
        return {
          idVirtual: uuidv4(),
          soQdGiaoNvXh: key,
          nam: rowLv1.nam,
          ngayQdGiaoNvXh: rowLv1.ngayQdGiaoNvXh,
          idBbLayMau: rowLv1.idBbLayMau,
          idQdGiaoNvXh: rowLv1.idQdGiaoNvXh,
          childData: rs
        };
      }).value() : [];
    this.dataView = dataView;
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

  disabledTuNgay = (startValue: Date): boolean => {
    if (startValue && this.formData.value.ngayKnghiemDen) {
      return startValue.getTime() > this.formData.value.ngayKnghiemDen.getTime();
    }
    return false;
  };

  disabledDenNgay = (endValue: Date): boolean => {
    if (!endValue || !this.formData.value.ngayKnghiemTu) {
      return false;
    }
    return endValue.getTime() <= this.formData.value.ngayKnghiemTu.getTime();
  };
  openModalQdDc(id: number) {
    this.idQdDc = id;
    this.isViewQdDc = true
  }
  closeModalQdDc() {
    this.idQdDc = null;
    this.isViewQdDc = false
  }

  openModalBbLayMau(id: number) {
    this.idBbLayMau = id;
    this.isViewBbLayMau = true
  }
  closeModalBbLayMau() {
    this.idBbLayMau = null;
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
