import { saveAs } from 'file-saver';
import { cloneDeep, chain } from 'lodash';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import dayjs from 'dayjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { UserLogin } from 'src/app/models/userlogin';
import { DonviService } from 'src/app/services/donvi.service';
import { TinhTrangKhoHienThoiService } from 'src/app/services/tinhTrangKhoHienThoi.service';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';
import { STATUS } from 'src/app/constants/status';
import {
  QuanLyBienBanLayMauKhacService
} from "../../../../../services/qlnv-hang/nhap-hang/nhap-khac/quanLyBienBanLayMauKhac.service";
import {
  QuyetDinhGiaoNhapHangKhacService
} from "../../../../../services/qlnv-hang/nhap-hang/nhap-khac/quyetDinhGiaoNhapHangKhac.service";
import {DANH_MUC_LEVEL} from "../../../../luu-kho/luu-kho.constant";
import {HelperService} from "../../../../../services/helper.service";

@Component({
  selector: 'quan-ly-bien-ban-lay-mau',
  templateUrl: './quan-ly-bien-ban-lay-mau.component.html',
  styleUrls: ['./quan-ly-bien-ban-lay-mau.component.scss'],
})
export class QuanLyBienBanLayMauComponent implements OnInit {
  @Input() loaiVthh: string;

  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 0;
  dataTable: any[] = [];
  dataTableAll: any[] = [];
  searchFilter = {
    soQuyetDinhNhap: '',
    ngayLayMau: '',
    soHopDong: '',
    diemkho: '',
    nhaKho: '',
    nganLoBaoQuan: '',
    soBienBan: ''
  };
  routerUrl: string;
  listDataGroup: any[] = [];
  diemKho: string = '';
  nhaKho: string = '';
  nganLo: string = '';
  listOfData: any[] = [];
  userInfo: UserLogin;
  listDonVi: any = {};
  listCuc: any[] = [];
  listChiCuc: any[] = [];
  listDiemKho: any[] = [];
  listNhaKho: any[] = [];
  listNganKho: any[] = [];
  listLoKho: any[] = [];
  listNganLo: any[] = [];
  isDetail: boolean = false;
  selectedId: number = 0;
  idQdGvuNh: number = 0;
  isView: boolean;
  isTatCa: boolean = false;

  allChecked = false;
  indeterminate = false;
  tuNgayLm: Date | null = null;
  denNgayLm: Date | null = null;

  filterTable: any = {
    soQuyetDinhNhap: '',
    soBienBan: '',
    ngayLayMau: '',
    soHopDong: '',
    tenDiemKho: '',
    tenNganKho: '',
    tenNganLo: '',
    tenTrangThai: '',
  };
  STATUS = STATUS
  constructor(
    private spinner: NgxSpinnerService,
    private donViService: DonviService,
    private bienBanLayMauKhacService: QuanLyBienBanLayMauKhacService,
    private notification: NzNotificationService,
    private router: Router,
    private modal: NzModalService,
    private helperService: HelperService,
    private tinhTrangKhoHienThoiService: TinhTrangKhoHienThoiService,
    public userService: UserService,
    public globals: Globals,
    private quyetDinhGiaoNhapHangKhacService: QuyetDinhGiaoNhapHangKhacService,
  ) { }

  async ngOnInit() {
    this.routerUrl = this.router.url;
    this.spinner.show();
    try {
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
    if (this.dataTable.every(item => !item.checked)) {
      this.allChecked = false;
      this.indeterminate = false;
    } else if (this.dataTable.every(item => item.checked)) {
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
      loaiVthh: this.loaiVthh,
      soQd: this.searchFilter.soQuyetDinhNhap,
      soBienBan: this.searchFilter.soBienBan,
      tuNgayLm: this.tuNgayLm != null ? dayjs(this.tuNgayLm).format('YYYY-MM-DD') + " 00:00:00" : null,
      denNgayLm: this.denNgayLm != null ? dayjs(this.denNgayLm).format('YYYY-MM-DD') + " 24:59:59" : null,
    };
    let res = await this.quyetDinhGiaoNhapHangKhacService.dsQdNvuDuocLapBb(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.dataTable = data.content;
      this.convertDataTable();
      this.convertListDataLuongThuc();
      this.dataTableAll = cloneDeep(this.dataTable);
      this.totalRecord = data.totalElements;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    await this.spinner.hide();
  }

  convertDataTable() {
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

  convertListDataLuongThuc() {
    this.helperService.setIndexArray(this.dataTable);
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
      soQuyetDinhNhap: '',
      ngayLayMau: '',
      soHopDong: '',
      diemkho: '',
      nhaKho: '',
      nganLoBaoQuan: '',
      soBienBan: ''
    };
    this.tuNgayLm = null;
    this.denNgayLm = null;
    this.search();
  }

  xoaItem(item: any) {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn xóa?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: () => {
        this.spinner.show();
        try {
          this.bienBanLayMauKhacService.delete({ id: item.id }).then((res) => {
            if (res.msg == MESSAGE.SUCCESS) {
              this.notification.success(
                MESSAGE.SUCCESS,
                MESSAGE.DELETE_SUCCESS,
              );
              this.search();
            } else {
              this.notification.error(MESSAGE.ERROR, res.msg);
            }
            this.spinner.hide();
          });
        } catch (e) {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      },
    });
  }

  redirectToChiTiet(isView: boolean, id: number, idQdGiaoNvNh?: number) {
    this.selectedId = id;
    this.idQdGvuNh = idQdGiaoNvNh;
    this.isDetail = true;
    this.isView = isView;
  }

  async showList() {
    this.isDetail = false;
    await this.search()
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
          soQd: this.searchFilter.soQuyetDinhNhap,
          soBienBan: this.searchFilter.soBienBan,
          tuNgayLm: this.tuNgayLm != null ? dayjs(this.tuNgayLm).format('YYYY-MM-DD') + " 00:00:00" : null,
          denNgayLm: this.denNgayLm != null ? dayjs(this.denNgayLm).format('YYYY-MM-DD') + " 24:59:59" : null,
        };
        this.quyetDinhGiaoNhapHangKhacService
          .exportBbLm(body)
          .subscribe((blob) =>
            saveAs(blob, 'danh-sach-bien-ban-lay-mau-khac.xlsx'),
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

  deleteSelect() {
    let dataDelete = [];
    if (this.dataTable && this.dataTable.length > 0) {
      this.dataTable.forEach((item) => {
        if (item.checked) {
          dataDelete.push(item.id);
        }
      });
    }
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
            let res = await this.bienBanLayMauKhacService.deleteMultiple({ ids: dataDelete });
            if (res.msg == MESSAGE.SUCCESS) {
              this.notification.success(MESSAGE.SUCCESS, MESSAGE.DELETE_SUCCESS);
              await this.search();
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
    else {
      this.notification.error(MESSAGE.ERROR, "Không có dữ liệu phù hợp để xóa.");
    }
  }

  async loadDiemKho() {
    let res = await this.tinhTrangKhoHienThoiService.getAllDiemKho();
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data) {
        this.listDiemKho = res.data;
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async loadNhaKho(diemKhoId: any) {
    let body = {
      "diemKhoId": diemKhoId,
      "maNhaKho": null,
      "paggingReq": {
        "limit": 1000,
        "page": 1
      },
      "str": null,
      "tenNhaKho": null,
      "trangThai": null
    };
    let res = await this.tinhTrangKhoHienThoiService.nhaKhoGetList(body);
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data && res.data.content) {
        this.listNhaKho = res.data.content;
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async changeDiemKho() {
    let diemKho = this.listDiemKho.filter(x => x.maDiemkho == this.diemKho);
    this.nhaKho = null;
    if (diemKho && diemKho.length > 0) {
      await this.loadNhaKho(diemKho[0].id);
    }
  }

  async loadNganLo() {
    let body = {
      "maNganLo": null,
      "nganKhoId": null,
      "paggingReq": {
        "limit": 1000,
        "page": 1
      },
      "str": null,
      "tenNganLo": null,
      "trangThai": null
    };
    let res = await this.tinhTrangKhoHienThoiService.nganLoGetList(body);
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data && res.data.content) {
        this.listNganLo = res.data.content;
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  filterInTable(key: string, value: string) {
    if (value && value != '') {
      this.dataTable = [];
      let temp = [];
      if (this.dataTableAll && this.dataTableAll.length > 0) {
        this.dataTableAll.forEach((item) => {
          if (item[key].toString().toLowerCase().indexOf(value.toLowerCase()) != -1) {
            temp.push(item)
          }
        });
      }
      this.dataTable = [...this.dataTable, ...temp];
    }
    else {
      this.dataTable = cloneDeep(this.dataTableAll);
    }
  }

  clearFilterTable() {
    this.filterTable = {
      soQuyetDinhNhap: '',
      soBienBan: '',
      ngayLayMau: '',
      soHopDong: '',
      tenDiemKho: '',
      tenNganKho: '',
      tenNganLo: '',
      tenTrangThai: '',
    }
  }

  expandSet = new Set<number>();
  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

}
