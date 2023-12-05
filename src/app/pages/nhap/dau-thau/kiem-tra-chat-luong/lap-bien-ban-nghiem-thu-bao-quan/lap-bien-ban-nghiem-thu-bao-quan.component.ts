import { cloneDeep } from 'lodash';
import { saveAs } from 'file-saver';
import { Component, Input, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { LOAI_HANG_DTQG, PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import * as dayjs from 'dayjs';
import { DonviService } from 'src/app/services/donvi.service';
import { QuanLyNghiemThuKeLotService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/kiemtra-cl/quanLyNghiemThuKeLot.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { UserLogin } from 'src/app/models/userlogin';
import { TinhTrangKhoHienThoiService } from 'src/app/services/tinhTrangKhoHienThoi.service';
import { Globals } from 'src/app/shared/globals';
import { STATUS } from 'src/app/constants/status';
import { QuyetDinhGiaoNhapHangService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/qd-giaonv-nh/quyetDinhGiaoNhapHang.service';

@Component({
  selector: 'app-lap-bien-ban-nghiem-thu-bao-quan',
  templateUrl: './lap-bien-ban-nghiem-thu-bao-quan.component.html',
  styleUrls: ['./lap-bien-ban-nghiem-thu-bao-quan.component.scss'],
})
export class LapBienBanNghiemThuBaoQuanComponent implements OnInit {
  @Input() typeVthh: string;
  inputDonVi: string = '';
  options: any[] = [];
  optionsDonVi: any[] = [];

  startValue: Date | null = null;
  endValue: Date | null = null;
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 0;
  dataTable: any[] = [];
  dataTableAll: any[] = [];
  listNam: any[] = [];
  yearNow = dayjs().get('year');
  thocIdDefault: string = LOAI_HANG_DTQG.THOC;
  gaoIdDefault: string = LOAI_HANG_DTQG.GAO;
  muoiIdDefault: string = LOAI_HANG_DTQG.MUOI;
  tuNgayLP: Date | null = null;
  denNgayLP: Date | null = null;
  tuNgayKT: Date | null = null;
  denNgayKT: Date | null = null;
  soQuyetDinh: string;
  soBB: number = null;
  ngayTongHop: any = null;
  diemKho: string = '';
  nhaKho: string = '';
  nganLo: string = '';

  userInfo: UserLogin;

  listDiemKho: any[] = [];
  listNhaKho: any[] = [];
  listNganLo: any[] = [];

  isDetail: boolean = false;
  selectedId: number = 0;
  isView: boolean = false;
  isTatCa: boolean = false;

  allChecked = false;
  indeterminate = false;

  searchFilter = {
    soPhieu: '',
    ngayTongHop: '',
    ketLuan: '',
    soQuyetDinh: '',
    namKhoach: '',
    soBb: ''
  };

  filterTable: any = {
    soQuyetDinhNhap: '',
    soBb: '',
    ngayNghiemThuShow: '',
    tenDiemKho: '',
    tenNhaKho: '',
    tenNganLo: '',
    chiPhiThucHienTrongNam: '',
    chiPhiThucHienNamTruoc: '',
    tongGiaTri: '',
    trangThaiDuyet: '',
  };

  STATUS = STATUS
  idQdGiaoNvNh: number

  constructor(
    private spinner: NgxSpinnerService,
    private donViService: DonviService,
    private quanLyNghiemThuKeLotService: QuanLyNghiemThuKeLotService,
    private notification: NzNotificationService,
    private modal: NzModalService,
    private router: Router,
    public userService: UserService,
    private tinhTrangKhoHienThoiService: TinhTrangKhoHienThoiService,
    public globals: Globals,
    private quyetDinhGiaoNhapHangService: QuyetDinhGiaoNhapHangService,
  ) { }

  async ngOnInit() {
    this.spinner.show();
    try {
      // if (!this.typeVthh || this.typeVthh == '') {
      //   this.isTatCa = true;
      // }
      for (let i = -3; i < 23; i++) {
        this.listNam.push({
          value: this.yearNow - i,
          text: this.yearNow - i,
        });
      }
      this.userInfo = this.userService.getUserLogin();
      // let res = await this.donViService.layTatCaDonVi();
      // this.optionsDonVi = [];
      // if (res.msg == MESSAGE.SUCCESS) {
      //   for (let i = 0; i < res.data.length; i++) {
      //     var item = {
      //       ...res.data[i],
      //       labelDonVi: res.data[i].maDvi + ' - ' + res.data[i].tenDvi,
      //     };
      //     this.optionsDonVi.push(item);
      //   }
      // } else {
      //   this.notification.error(MESSAGE.ERROR, res.msg);
      // }
      await Promise.all([this.search()]);
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
    if (diemKhoId && diemKhoId > 0) {
      let body = {
        diemKhoId: diemKhoId,
        maNhaKho: null,
        paggingReq: {
          limit: 1000,
          page: 1,
        },
        str: null,
        tenNhaKho: null,
        trangThai: null,
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
  }

  async changeDiemKho() {
    let diemKho = this.listDiemKho.filter((x) => x.maDiemkho == this.diemKho);
    this.nhaKho = null;
    if (diemKho && diemKho.length > 0) {
      await this.loadNhaKho(diemKho[0].id);
    }
  }

  async loadNganLo() {
    let body = {
      maNganLo: null,
      nganKhoId: null,
      paggingReq: {
        limit: 1000,
        page: 1,
      },
      str: null,
      tenNganLo: null,
      trangThai: null,
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

  clearFilter() {
    this.searchFilter = {
      soPhieu: '',
      ngayTongHop: '',
      ketLuan: '',
      soQuyetDinh: '',
      namKhoach: '',
      soBb: ''
    };
    this.tuNgayLP = null;
    this.denNgayLP = null;
    this.tuNgayKT = null;
    this.denNgayKT = null;
    this.search();
  }

  async search() {
    await this.spinner.show();
    let body = {
      "paggingReq": {
        "limit": this.pageSize,
        "page": this.page - 1
      },
      loaiVthh: this.typeVthh,
      trangThai: STATUS.BAN_HANH,
      soQd: this.searchFilter.soQuyetDinh,
      namNhap: this.searchFilter.namKhoach,
      soBbNtBq: this.searchFilter.soBb,
      tuNgayLP: this.tuNgayLP != null ? dayjs(this.tuNgayLP).format('YYYY-MM-DD') + " 00:00:00" : null,
      denNgayLP: this.denNgayLP != null ? dayjs(this.denNgayLP).format('YYYY-MM-DD') + " 24:59:59" : null,
      tuNgayKT: this.tuNgayKT != null ? dayjs(this.tuNgayKT).format('YYYY-MM-DD') + " 00:00:00" : null,
      denNgayKT: this.denNgayKT != null ? dayjs(this.denNgayKT).format('YYYY-MM-DD') + " 24:59:59" : null,
    };
    let res = await this.quyetDinhGiaoNhapHangService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.dataTable = data.content;
      for (let i = 0; i < this.dataTable.length; i++) {
        this.dataTable[i].detail = this.dataTable[i].dtlList.filter(i => i.maDvi.startsWith(this.userInfo.MA_DVI))[0]
        this.expandSet.add(i)
      }
      this.dataTableAll = cloneDeep(this.dataTable);
      this.totalRecord = data.totalElements;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    await this.spinner.hide();
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
      await this.search();
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
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
          this.quanLyNghiemThuKeLotService.delete({ id: item.id }).then((res) => {
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

  pheDuyet(item: any) {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn phê duyệt?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: () => {
        this.spinner.show();
        try {
          this.quanLyNghiemThuKeLotService.delete({ id: item.id }).then((res) => {
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

  export() {
    if (this.totalRecord && this.totalRecord > 0) {
      this.spinner.show();
      try {
        let body = {
          denNgayLap:
            this.ngayTongHop && this.ngayTongHop.length > 1
              ? dayjs(this.ngayTongHop[1]).format('YYYY-MM-DD')
              : null,
          loaiVthh: this.typeVthh,
          maDvi: this.userInfo.MA_DVI,
          maNganKho: this.nganLo,
          orderBy: null,
          orderDirection: null,
          paggingReq: null,
          soBb: this.soBB,
          str: null,
          trangThai: null,
          tuNgayLap:
            this.ngayTongHop && this.ngayTongHop.length > 0
              ? dayjs(this.ngayTongHop[0]).format('YYYY-MM-DD')
              : null,
        };
        this.quanLyNghiemThuKeLotService
          .export(body)
          .subscribe((blob) =>
            saveAs(blob, 'danh-sach-bien-ban-nghiem-thu-bao-quan.xlsx'),
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

  redirectToChiTiet(isView: boolean, id: number, idQdGiaoNvNh?: number) {
    this.selectedId = id;
    this.isDetail = true;
    this.isView = isView;
    this.idQdGiaoNvNh = idQdGiaoNvNh
  }

  async showList() {
    this.isDetail = false;
    await this.search();
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
            let res = await this.quanLyNghiemThuKeLotService.deleteMuti({
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
            this.spinner.hide();
          } catch (e) {
            console.log('error: ', e);
            this.spinner.hide();
            this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
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

  filterInTable(key: string, value: string) {
    if (value && value != '') {
      this.dataTable = [];
      let temp = [];
      if (this.dataTableAll && this.dataTableAll.length > 0) {
        this.dataTableAll.forEach((item) => {
          if (
            item[key].toString().toLowerCase().indexOf(value.toLowerCase()) !=
            -1
          ) {
            temp.push(item);
          }
        });
      }
      this.dataTable = [...this.dataTable, ...temp];
    } else {
      this.dataTable = cloneDeep(this.dataTableAll);
    }
  }

  clearFilterTable() {
    this.filterTable = {
      soQuyetDinhNhap: '',
      soBb: '',
      ngayNghiemThuShow: '',
      tenDiemKho: '',
      tenNhaKho: '',
      tenNganLo: '',
      chiPhiThucHienTrongNam: '',
      chiPhiThucHienNamTruoc: '',
      tongGiaTri: '',
      trangThaiDuyet: '',
    };
  }

  print() { }

  expandSet = new Set<number>();
  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  expandSet2 = new Set<number>();
  onExpandChange2(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet2.add(id);
    } else {
      this.expandSet2.delete(id);
    }
  }

  disabledTuNgayLP = (startValue: Date): boolean => {
    if (!startValue || !this.denNgayLP) {
      return false;
    }
    return startValue.getTime() > this.denNgayLP.getTime();
  };

  disabledDenNgayLP = (endValue: Date): boolean => {
    if (!endValue || !this.tuNgayLP) {
      return false;
    }
    return endValue.getTime() <= this.tuNgayLP.getTime();
  };

  disabledTuNgayKT = (startValue: Date): boolean => {
    if (!startValue || !this.denNgayLP) {
      return false;
    }
    return startValue.getTime() > this.denNgayLP.getTime();
  };

  disabledDenNgayKT = (endValue: Date): boolean => {
    if (!endValue || !this.tuNgayLP) {
      return false;
    }
    return endValue.getTime() <= this.tuNgayLP.getTime();
  };

  hienThiXem(data){
    if (this.userService.isAccessPermisson('NHDTQG_PTDT_KTCL_LT_BBNTBQLD_XEM') && data != null) {
      if(this.userService.isAccessPermisson('NHDTQG_PTDT_KTCL_LT_BBNTBQLD_THEM') && (data.trangThai == STATUS.DU_THAO
        || data.trangThai == STATUS.TU_CHOI_KT
        || data.trangThai == STATUS.TU_CHOI_TK
        || data.trangThai == STATUS.TU_CHOI_LDCC)) {
        return false;
      } else if ((this.userService.isAccessPermisson('NHDTQG_PTDT_KTCL_LT_BBNTBQLD_DUYET_THUKHO') && data.trangThai == STATUS.CHO_DUYET_TK)
        || (this.userService.isAccessPermisson('NHDTQG_PTDT_KTCL_LT_BBNTBQLD_DUYET_KETOAN') && data.trangThai == STATUS.CHO_DUYET_KT)
        || (this.userService.isAccessPermisson('NHDTQG_PTDT_KTCL_LT_BBNTBQLD_DUYET_LDCCUC') && data.trangThai == STATUS.CHO_DUYET_LDCC)) {
        return false;
      }
      return true;
    }
    return false;
  }
}
