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
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { UserLogin } from 'src/app/models/userlogin';
import { TinhTrangKhoHienThoiService } from 'src/app/services/tinhTrangKhoHienThoi.service';
import { Globals } from 'src/app/shared/globals';
import { QuyetDinhGiaoNvNhapHangService } from 'src/app/services/qlnv-hang/nhap-hang/mua-truc-tiep/qdinh-giao-nvu-nh/quyetDinhGiaoNvNhapHang.service';
import { STATUS } from 'src/app/constants/status';
import { MttBienBanNghiemThuBaoQuan } from './../../../../../services/qlnv-hang/nhap-hang/mua-truc-tiep/MttBienBanNghiemThuBaoQuan.service';

@Component({
  selector: 'app-bien-ban-nghiem-thu-bao-quan',
  templateUrl: './bien-ban-nghiem-thu-bao-quan.component.html',
  styleUrls: ['./bien-ban-nghiem-thu-bao-quan.component.scss']
})
export class BienBanNghiemThuBaoQuanComponent implements OnInit {
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
  listNam: any[] = [];
  tuNgayTao: Date | null = null;
  denNgayTao: Date | null = null;
  tuNgayKetThuc: Date | null = null;
  denNgayKetThuc: Date | null = null;
  searchFilter = {
    namKh: dayjs().get('year'),
    soQd: '',
    soBb: '',
    ngayKn: '',
  };

  STATUS = STATUS
  idQdGiaoNvNh: number
  constructor(
    private spinner: NgxSpinnerService,
    private donViService: DonviService,
    private bienBanNghiemThuBaoQuan: MttBienBanNghiemThuBaoQuan,
    private notification: NzNotificationService,
    private modal: NzModalService,
    private router: Router,
    public userService: UserService,
    private tinhTrangKhoHienThoiService: TinhTrangKhoHienThoiService,
    public globals: Globals,
    private quyetDinhGiaoNvNhapHangService: QuyetDinhGiaoNvNhapHangService,

  ) { }

  async ngOnInit() {
    this.spinner.show();
    try {
      if (!this.typeVthh || this.typeVthh == '') {
        this.isTatCa = true;
      }
      for (let i = -3; i < 23; i++) {
        this.listNam.push({
          value: dayjs().get('year') - i,
          text: dayjs().get('year') - i,
        });
      }
      this.userInfo = this.userService.getUserLogin();
      let res = await this.donViService.layTatCaDonVi();
      this.optionsDonVi = [];
      if (res.msg == MESSAGE.SUCCESS) {
        for (let i = 0; i < res.data.length; i++) {
          var item = {
            ...res.data[i],
            labelDonVi: res.data[i].maDvi + ' - ' + res.data[i].tenDvi,
          };
          this.optionsDonVi.push(item);
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
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
      namKh: null,
      soQd: '',
      soBb: '',
      ngayKn: '',
    }
    this.search();
  }

  async search() {
    let body = {
      "paggingReq": {
        "limit": this.pageSize,
        "page": this.page - 1
      },
      trangThai: STATUS.BAN_HANH,
      tuNgayKetThuc: this.tuNgayKetThuc != null ? dayjs(this.tuNgayKetThuc).format('YYYY-MM-DD') + " 00:00:00" : null,
      denNgayKetThuc: this.denNgayKetThuc != null ? dayjs(this.denNgayKetThuc).format('YYYY-MM-DD') + " 23:59:59" : null,
      tuNgayTao: this.tuNgayTao != null ? dayjs(this.tuNgayTao).format('YYYY-MM-DD') + " 00:00:00" : null,
      denNgayTao: this.denNgayTao != null ? dayjs(this.denNgayTao).format('YYYY-MM-DD') + " 23:59:59": null,
    };
    let res = await this.quyetDinhGiaoNvNhapHangService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.dataTable = data.content;
      this.dataTable.forEach(item => {
        if (this.userService.isChiCuc()) {
          item.detail = item.hhQdGiaoNvNhangDtlList.filter(y => y.maDvi == this.userInfo.MA_DVI)[0]
          item.detail = {
            children: item.detail.children.filter(x => x.maDiemKho.substring(0, x.maDiemKho.length - 2) == this.userInfo.MA_DVI)
          }
          item.expand = true;
        } else {
          let data = [];
          item.hhQdGiaoNvNhangDtlList.forEach(res => {
            data = [...data, ...res.children.filter(x => x.idDtl == res.id)];
          })
          item.detail = {
            children: data
          }
          item.expand = true;
        };
      });
      console.log(this.dataTable)
      this.dataTableAll = cloneDeep(this.dataTable);
      this.totalRecord = data.totalElements;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  setExpand(parantExpand: boolean = false, children: any = []): void {
    if (parantExpand) {
      return children.map(f => ({ ...f, expand: false }))
    }
    return children
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
          this.bienBanNghiemThuBaoQuan.delete({ id: item.id }).then((res) => {
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
          this.bienBanNghiemThuBaoQuan.delete({ id: item.id }).then((res) => {
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
    if (this.totalRecord > 0) {
      this.spinner.show();
      try {
        let body = {
          "namKh": this.searchFilter.namKh,
          "maDonVi": this.userInfo.MA_DVI,
          "ngayKnDen": this.searchFilter.ngayKn && this.searchFilter.ngayKn.length > 1
            ? dayjs(this.searchFilter.ngayKn[1]).format('YYYY-MM-DD')
            : null,
          "ngayKnTu": this.searchFilter.ngayKn && this.searchFilter.ngayKn.length > 0
            ? dayjs(this.searchFilter.ngayKn[0]).format('YYYY-MM-DD')
            : null,
          "soQd": this.searchFilter.soQd,
          "soBb": this.searchFilter.soBb,
          "orderDirection": null,
          "paggingReq": null,
          "str": null,
          "tenNguoiGiao": null,
          "trangThai": null,
          tuNgayKetThuc: this.tuNgayKetThuc != null ? dayjs(this.tuNgayKetThuc).format('YYYY-MM-DD') + " 00:00:00" : null,
          denNgayKetThuc: this.denNgayKetThuc != null ? dayjs(this.denNgayKetThuc).format('YYYY-MM-DD') + " 23:59:59" : null,
          tuNgayTao: this.tuNgayTao != null ? dayjs(this.tuNgayTao).format('YYYY-MM-DD') + " 00:00:00" : null,
          denNgayTao: this.denNgayTao != null ? dayjs(this.denNgayTao).format('YYYY-MM-DD') + " 23:59:59": null,
        };
        this.bienBanNghiemThuBaoQuan
          .export(body)
          .subscribe((blob) =>
            saveAs(blob, 'danh-sach-bien-ban-nghiem-thu-bao-quan-lan-dau.xlsx'),
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
            let res = await this.bienBanNghiemThuBaoQuan.deleteMuti({
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

  disabledStartDate = (startValue: Date): boolean => {
    if (!startValue || !this.denNgayTao) {
      return false;
    }
    return startValue.getTime() > this.denNgayTao.getTime();
  };

  disabledEndDate = (endValue: Date): boolean => {
    if (!endValue || !this.tuNgayTao) {
      return false;
    }
    return endValue.getTime() <= this.tuNgayTao.getTime();
  };


  disabledTuNgayKetThuc = (startValue: Date): boolean => {
    if (!startValue || !this.denNgayKetThuc) {
      return false;
    }
    return startValue.getTime() > this.denNgayKetThuc.getTime();
  };

  disabledDenNgayKetThuc = (endValue: Date): boolean => {
    if (!endValue || !this.tuNgayKetThuc) {
      return false;
    }
    return endValue.getTime() <= this.tuNgayKetThuc.getTime();
  };

  hienThiXem(data){
    if (this.userService.isAccessPermisson('NHDTQG_PTMTT_KTCL_LT_BBNTBQLD_XEM')) {
      if(this.userService.isAccessPermisson('NHDTQG_PTMTT_KTCL_LT_BBNTBQLD_THEM') && (data.trangThai == STATUS.DU_THAO || data.trangThai == STATUS.TU_CHOI_TK || data.trangThai == STATUS.TU_CHOI_KT || data.trangThai == STATUS.TU_CHOI_LDCC)) {
        return false;
      } else if ((this.userService.isAccessPermisson('NHDTQG_PTMTT_KTCL_LT_BBNTBQLD_DUYET_TK') && data.trangThai == STATUS.CHO_DUYET_TK)
        || (this.userService.isAccessPermisson('NHDTQG_PTMTT_KTCL_LT_BBNTBQLD_DUYET_KT') && data.trangThai == STATUS.CHO_DUYET_KT)
        || (this.userService.isAccessPermisson('NHDTQG_PTMTT_KTCL_LT_BBNTBQLD_DUYET_LDCC') && data.trangThai == STATUS.CHO_DUYET_LDCC) ) {
        return false;
      }
      return true;
    }
    return false;
  }
}
