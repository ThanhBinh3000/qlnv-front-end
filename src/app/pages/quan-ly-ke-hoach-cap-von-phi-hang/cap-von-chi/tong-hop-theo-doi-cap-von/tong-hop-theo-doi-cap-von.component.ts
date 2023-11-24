import { Component, Input, OnInit } from '@angular/core';
import { saveAs } from 'file-saver';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { chain, cloneDeep, isEmpty } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { STATUS } from 'src/app/constants/status';
import { UserLogin } from 'src/app/models/userlogin';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { TongHopTheoDoiCapVonService } from 'src/app/services/ke-hoach/von-phi/tongHopTheoDoiCapVon.service';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';
import { DonviService } from '../../../../services/donvi.service';
import { NumberToRoman } from '../../../../shared/commonFunction';

@Component({
  selector: 'app-tong-hop-theo-doi-cap-von',
  templateUrl: './tong-hop-theo-doi-cap-von.component.html',
  styleUrls: ['./tong-hop-theo-doi-cap-von.component.scss'],
})
export class TongHopTheoDoiCapVonComponent implements OnInit {
  @Input()
  loaiVthh: string;
  @Input()
  loaiVthhCache: string;
  STATUS = STATUS;
  isDetail: boolean = false;
  listNam: any[] = [];
  yearNow: number = 0;
  listTrangThai: any[] = [
    { ma: this.STATUS.DANG_THUC_HIEN, giaTri: 'Đang thực hiện' },
    { ma: this.STATUS.DA_HOAN_THANH, giaTri: 'Đã hoàn thành' },
  ];

  searchFilter = {
    soThongTri: null,
    dviThongTri: null,
    soLenhChiTien: null,
    chuong: null,
    loai: null,
    khoan: null,
    nam: null,
  };

  dataTableAll: any[] = [];
  dataTable: any[] = [];
  // listVthh: any[] = [];
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 0;

  dsDonvi: any[] = [];
  userInfo: UserLogin;
  userdetail: any = {};
  dsBoNganh: any[] = [];
  dataTableTree: any[] = [];

  selectedId: number = 0;
  isVatTu: boolean = false;
  allChecked = false;
  indeterminate = false;
  isView = false;
  expandSetString = new Set<string>();

  constructor(
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    private modal: NzModalService,
    public userService: UserService,
    public globals: Globals,
    private tongHopTheoDoiCapVonService: TongHopTheoDoiCapVonService,
    private danhMucService: DanhMucService,
    private donviService: DonviService,
  ) {
  }

  async ngOnInit() {
    try {
      await this.initData();
      await this.search();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async initData() {
    this.userInfo = this.userService.getUserLogin();
    this.userdetail.maDvi = this.userInfo.MA_DVI;
    this.userdetail.tenDvi = this.userInfo.TEN_DVI;
    await Promise.all([
      this.getListBoNganh(),
    ]);
  }

  async getListBoNganh() {
    this.dsBoNganh = [];
    let res = await this.donviService.layTatCaDonViByLevel(0);
    if (res.msg == MESSAGE.SUCCESS) {
      this.dsBoNganh = res.data;
    }
  }

  updateAllChecked(): void {
    this.indeterminate = false;
    if (this.allChecked) {
      if (this.dataTable && this.dataTable.length > 0) {
        this.dataTable.forEach((item) => {
          if (item.trangThai == STATUS.DANG_THUC_HIEN) {
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
    this.spinner.show();
    let body = {
      'chuong': this.searchFilter.chuong,
      'khoan': this.searchFilter.khoan,
      'loai': this.searchFilter.loai,
      'nam': this.searchFilter.nam,
      'dviThongTri': this.searchFilter.dviThongTri,
      'soLenhChiTien': this.searchFilter.soLenhChiTien,
      'soThongTri': this.searchFilter.soThongTri,
      'paggingReq': {
        'limit': this.pageSize,
        'page': this.page - 1,
      },
    };
    let res = await this.tongHopTheoDoiCapVonService.timKiem(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.dataTable = data.content;
      this.dataTableAll = cloneDeep(this.dataTable);
      this.buildTableView(this.dataTableAll);
      this.totalRecord = data.totalElements;
    } else {
      this.dataTable = [];
      this.totalRecord = 0;
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    this.spinner.hide();
  }


  async buildTableView(data?: any) {
    this.dataTableTree = chain(data)
      .groupBy('tenDviThongTri')
      .map((value, key) => {
        let rs = chain(value)
          .groupBy('nam')
          .map((v, k) => {
              let idVirtual = uuidv4();
              this.expandSetString.add(idVirtual);
              return {
                idVirtual: idVirtual,
                nam: k,
                childData: v,
              };
            },
          ).value();
        let idVirtual = uuidv4();
        this.expandSetString.add(idVirtual);
        return {
          idVirtual: idVirtual,
          tenDviThongTri: key,
          childData: rs,
        };
      }).value();
    console.log(this.dataTableTree, 'this.dataTableTree this.dataTableTree ');
    // this.dataTableTree = chain(data)
    //   .groupBy('tenDviThongTri')
    //   .map((v, k) => {
    //       let rs = chain(v)
    //         .groupBy('nam')
    //         .map((v, k) => {
    //           return {
    //             idVirtual: uuidv4(),
    //             nam: k,
    //             childData: rs,
    //           };
    //         });
    //       let rowItem = v.find(s => s.tenDviThongTri === k);
    //       let idVirtual = uuidv4();
    //       this.expandSetString.add(idVirtual);
    //       return {
    //         idVirtual: idVirtual,
    //         tenDviThongTri: k,
    //         nam: rowItem?.nam,
    //         childData: v,
    //       };
    //     },
    //   ).value();
  }

  onExpandStringChange(id: string, checked: boolean) {
    if (checked) {
      this.expandSetString.add(id);
    } else {
      this.expandSetString.delete(id);
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

  // Hiện thị màn hình thêm mới
  themMoi() {
    this.isDetail = true;
    this.isView = false;
    if (this.userService.isTongCuc()) {
      this.isVatTu = true;
    } else {
      this.isVatTu = false;
    }
    this.selectedId = 0;
    this.loaiVthh = this.loaiVthhCache;
  }

  // Hàm truyền qua thêm mới
  showList() {
    this.isDetail = false;
    this.search();
  }

  // Hiện thị Edit, View
  detail(data?: any, isView?: boolean) {
    this.selectedId = data.id;
    this.isDetail = true;
    this.loaiVthh = data.loaiVthh;
    this.isView = isView;
  }

  // Reset tìm kiếm
  clearFilter() {
    this.searchFilter = {
      soThongTri: null,
      dviThongTri: null,
      soLenhChiTien: null,
      chuong: null,
      loai: null,
      khoan: null,
      nam: null,
    };

    this.search();
  }

  // Xóa bản ghi
  xoaItem(id: any) {
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
          this.tongHopTheoDoiCapVonService.deleteData(id).then((res) => {
            if (res.msg == MESSAGE.SUCCESS) {
              this.notification.success(
                MESSAGE.SUCCESS,
                MESSAGE.DELETE_SUCCESS,
              );
              this.search();
            } else {
              this.notification.error(MESSAGE.ERROR, res.msg);
            }
          });
          this.spinner.hide();
        } catch (e) {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      },
    });
  }

  exportData() {
    if (this.totalRecord > 0) {
      this.spinner.show();
      try {
        let body = {
          'chuong': this.searchFilter.chuong,
          'khoan': this.searchFilter.khoan,
          'nam': this.searchFilter.nam,
          'loai': this.searchFilter.loai,
          'dviThongTri': this.searchFilter.dviThongTri,
          'soLenhChiTien': this.searchFilter.soLenhChiTien,
          'soThongTri': this.searchFilter.soThongTri,
        };
        this.tongHopTheoDoiCapVonService.exportList(body).subscribe((blob) => {
          saveAs(blob, 'danh-sach-tong-hop-theo-doi-cap-von.xlsx');
        });
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

  // Xóa nhiều
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
            const body = {
              ids: dataDelete,
            };
            let res = await this.tongHopTheoDoiCapVonService.deleteMultiple(body);
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
    } else {
      this.notification.error(
        MESSAGE.ERROR,
        'Không có dữ liệu phù hợp để xóa.',
      );
    }
  }

  // Tìm kiếm trong bảng
  filterInTable(key: string, value: string) {
    if (value && value != '') {
      this.dataTable = [];
      let temp = [];
      if (this.dataTableAll && this.dataTableAll.length > 0) {
        this.dataTableAll.forEach((item) => {
          if (item[key] && item[key].toString().toLowerCase().indexOf(value.toString().toLowerCase()) != -1) {
            temp.push(item);
          }
        });
      }
      this.dataTable = [...this.dataTable, ...temp];
    } else {
      this.dataTable = cloneDeep(this.dataTableAll);
    }
  }

  protected readonly NumberToRoman = NumberToRoman;
}
