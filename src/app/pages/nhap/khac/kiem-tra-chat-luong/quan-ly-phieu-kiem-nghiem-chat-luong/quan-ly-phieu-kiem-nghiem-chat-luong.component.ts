import { Component, OnInit, Input } from '@angular/core';
import { cloneDeep, chain } from 'lodash';
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
import {
  QuyetDinhGiaoNhapHangKhacService
} from "../../../../../services/qlnv-hang/nhap-hang/nhap-khac/quyetDinhGiaoNhapHangKhac.service";
import {DANH_MUC_LEVEL} from "../../../../luu-kho/luu-kho.constant";
import {STATUS} from "../../../../../constants/status";
import {HelperService} from "../../../../../services/helper.service";
import {
  QuanLyPhieuKiemNghiemChatLuongHangKhacService
} from "../../../../../services/qlnv-hang/nhap-hang/nhap-khac/quanLyPhieuKiemNghiemChatLuongHangKhac.service";

@Component({
  selector: 'app-quan-ly-phieu-kiem-nghiem-chat-luong',
  templateUrl: './quan-ly-phieu-kiem-nghiem-chat-luong.component.html',
  styleUrls: ['./quan-ly-phieu-kiem-nghiem-chat-luong.component.scss'],
})
export class QuanLyPhieuKiemNghiemChatLuongComponent implements OnInit {
  @Input() typeVthh: string;
  toDay = new Date();
  last30Day = new Date(
    new Date().setTime(this.toDay.getTime() - 30 * 24 * 60 * 60 * 1000),
  );
  isView = false;
  dataTable: any[] = [];
  dataTableAll: any[] = [];
  tuNgayLm: Date | null = null;
  denNgayLm: Date | null = null;
  searchFilter = {
    soQdNhap: '',
    ngayBanGiaoMau: [this.last30Day, this.toDay],
    soHopDong: '',
    diemkho: '',
    nhaKho: '',
    nganLoBaoQuan: '',
    maDvi: '',
    maHhoa: '',
    maKho: '',
    maNgan: '',
    ngayKnghiemDenNgay: '',
    ngayKnghiemTuNgay: '',
    orderBy: '',
    orderDirection: '',
    soPhieu: '',
    str: '',
    trangThai: '',
    pageNumber: '',
    pageSize: '',
    soBbBanGiao: '',
  };
  filterTable = {
    soQuyetDinhNhap: '',
    soPhieu: '',
    ngayBanGiaoMau: null,
    tenDiemKho: '',
    tenDvi: '',
    soLuongMauHangKt: '',
    trangThaiDuyet: '',
  };
  listDiemKho: any[] = [];
  listNganKho: any[] = [];
  listNganLo: any[] = [];
  listCuc: any[] = [];
  listChiCuc: any[] = [];
  listDonVi: any = {};
  loaiVthh: string;
  loaiStr: string;
  maVthh: string;
  idVthh: number;
  routerVthh: string;
  isTatCa: boolean = false;
  qdGvuNh: any;
  userInfo: UserLogin;
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 0;
  isDetail: boolean = false;
  selectedId: number = 0;

  allChecked = false;
  indeterminate = false;
  STATUS = STATUS
  constructor(
    private httpClient: HttpClient,
    private spinner: NgxSpinnerService,
    public userService: UserService,
    public globals: Globals,
    private helperService: HelperService,
    private notification: NzNotificationService,
    private router: Router,
    private modal: NzModalService,
    private storageService: StorageService,
    private donViService: DonviService,
    private phieuKiemNghiemChatLuongHangService: QuanLyPhieuKiemNghiemChatLuongHangKhacService,
    private tinhTrangKhoHienThoiService: TinhTrangKhoHienThoiService,
    private quyetDinhGiaoNhapHangKhacService: QuyetDinhGiaoNhapHangKhacService,
  ) {
  }

  async ngOnInit() {
    this.spinner.show();
    // super.ngOnInit();
    try {
      if (this.typeVthh == 'tat-ca') {
        this.isTatCa = true;
      }
      this.userInfo = this.userService.getUserLogin();
      await this.loadDsDonVi();
      await this.search();
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
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

  async search() {
    await this.spinner.show();
    let body = {
      paggingReq: {
        "limit": this.pageSize,
        "page": this.page - 1
      },
      checkIdBbLayMau: 0,
      trangThai: STATUS.BAN_HANH,
      loaiVthh: this.typeVthh,
      soQd: this.searchFilter.soQdNhap,
      soBienBan: this.searchFilter.soBbBanGiao,
      tuNgayLm: this.tuNgayLm != null ? dayjs(this.tuNgayLm).format('YYYY-MM-DD') + " 00:00:00" : null,
      denNgayLm: this.denNgayLm != null ? dayjs(this.denNgayLm).format('YYYY-MM-DD') + " 24:59:59" : null,
    };
    let res = await this.quyetDinhGiaoNhapHangKhacService.dsQdNvuDuocLapBb(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.dataTable = data.content;
      console.log(this.dataTable, "this.dataTable")
      await this.convertDataTable();
      await this.convertListDataLuongThuc();
      this.dataTableAll = cloneDeep(this.dataTable);
      this.totalRecord = data.totalElements;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    await this.spinner.hide();
  }

  async convertDataTable() {
    this.dataTable.forEach(item => {
      if (this.userService.isChiCuc()) {
        item.detail = item.dtlList.filter(item => item.maChiCuc == this.userInfo.MA_DVI)
      } else if (this.userService.isCuc()) {
        item.detail = item.dtlList.filter(item => item.maCuc == this.userInfo.MA_DVI)
      } else {
        item.detail = item.dtlList
      }
      ;
    });
  }

  async convertListDataLuongThuc() {
    this.helperService.setIndexArray(this.dataTable);
    console.log(this.dataTable)
    if (this.dataTable) {
      this.dataTable.forEach(item => {
        item.children = chain(item.detail).groupBy("maDiemKho").map((value, key) => (
          {
            tenDiemKho: this.listDonVi[DANH_MUC_LEVEL.DIEM_KHO].find(i => i.maDvi == key)?.tenDvi,
            maDiemKho: key,
            children: value
          }))
          .value();
        item.children.forEach(diemKho => {
          diemKho.children.forEach(nganLo => {
            if (nganLo.maLoKho != null) {
              nganLo.tenNganLoKho = this.listDonVi[DANH_MUC_LEVEL.LO_KHO].find(i => i.maDvi == nganLo.maLoKho).tenDvi + " - "
                + this.listDonVi[DANH_MUC_LEVEL.NGAN_KHO].find(i => i.maDvi == nganLo.maNganKho).tenDvi;
            } else {
              nganLo.tenNganLoKho = this.listDonVi[DANH_MUC_LEVEL.NGAN_KHO].find(i => i.maDvi == nganLo.maNganKho).tenDvi;
            }
          });
        });
      });
    }
    // this.sumThanhTien()
  }

  async loadDsDonVi() {
    let body = {
      trangThai: "01",
      maDviCha: this.userInfo.MA_DVI,
      type: "DV"
    };
    let res = await this.donViService.layDonViTheoCapDo(body);
    this.listDonVi = res;
    if (this.userService.isTongCuc()) {
      this.listCuc = res[DANH_MUC_LEVEL.CUC];
      this.listCuc = this.listCuc.filter(item => item.type != "PB");
    } else {
      this.listChiCuc = res[DANH_MUC_LEVEL.CHI_CUC];
      this.listChiCuc = this.listChiCuc.filter(item => item.type != "PB");
    }
  }

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
    this.searchFilter = {
      soQdNhap: '',
      ngayBanGiaoMau: null,
      soHopDong: '',
      diemkho: '',
      nhaKho: '',
      nganLoBaoQuan: '',
      maDvi: '',
      maHhoa: '',
      maKho: '',
      maNgan: '',
      ngayKnghiemDenNgay: '',
      ngayKnghiemTuNgay: '',
      orderBy: '',
      orderDirection: '',
      soPhieu: '',
      str: '',
      trangThai: '',
      pageNumber: '',
      pageSize: '',
      soBbBanGiao: '',
    };
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
          const res = await this.phieuKiemNghiemChatLuongHangService.delete({ id: data.id });
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
              await this.phieuKiemNghiemChatLuongHangService.deleteMuti({
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

  redirectToChiTiet(isView: boolean, id: number, qdGiaoNvNh?: any) {
    debugger
    this.selectedId = id;
    this.qdGvuNh = qdGiaoNvNh;
    this.isDetail = true;
    this.isView = isView;
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

  export() {
    if (this.totalRecord > 0) {
      this.spinner.show();
      try {
        let body = {
          paggingReq: {
            "limit": this.pageSize,
            "page": this.page - 1
          },
          checkIdBbLayMau: 0,
          trangThai: STATUS.BAN_HANH,
          loaiVthh: this.loaiVthh,
          soQd: this.searchFilter.soQdNhap,
          soBienBan: this.searchFilter.soBbBanGiao,
          tuNgayLm: this.tuNgayLm != null ? dayjs(this.tuNgayLm).format('YYYY-MM-DD') + " 00:00:00" : null,
          denNgayLm: this.denNgayLm != null ? dayjs(this.denNgayLm).format('YYYY-MM-DD') + " 24:59:59" : null,
        };
        this.quyetDinhGiaoNhapHangKhacService
          .exportPkncl(body)
          .subscribe((blob) =>
            saveAs(blob, 'danh-sach-lap-va-ky-phieu-kiem-nghiem-chat-luong.xlsx'),
          );
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

  expandSet = new Set<number>();
  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  disabledTuNgayLm = (startValue: Date): boolean => {
    if (!startValue || !this.denNgayLm) {
      return false;
    }
    return startValue.getTime() > this.denNgayLm.getTime();
  };

  disabledDenNgayLm = (endValue: Date): boolean => {
    if (!endValue || !this.tuNgayLm) {
      return false;
    }
    return endValue.getTime() <= this.tuNgayLm.getTime();
  };

}
