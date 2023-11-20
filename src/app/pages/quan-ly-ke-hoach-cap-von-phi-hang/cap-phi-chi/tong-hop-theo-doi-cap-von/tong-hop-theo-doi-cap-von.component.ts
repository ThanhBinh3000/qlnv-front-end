import { Component, Input, OnInit } from '@angular/core';
import { saveAs } from 'file-saver';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { UserLogin } from 'src/app/models/userlogin';
import {chain, cloneDeep, isEmpty} from "lodash";
import {v4 as uuidv4} from "uuid";
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { DonviService } from 'src/app/services/donvi.service';
import { TongHopTheoDoiCapPhiService } from 'src/app/services/ke-hoach/von-phi/tongHopTheoDoiCapPhi.service';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';
import { STATUS } from '../../../../constants/status';

@Component({
  selector: 'app-tong-hop-theo-doi-cap-von',
  templateUrl: './tong-hop-theo-doi-cap-von.component.html',
  styleUrls: ['./tong-hop-theo-doi-cap-von.component.scss']
})
export class TongHopTheoDoiCapVonComponent implements OnInit {
  @Input()
  loaiVthh: string;
  @Input()
  loaiVthhCache: string;


  isDetail: boolean = false;
  listNam: any[] = [];
  yearNow: number = 0;


  searchFilter = {
    soThongTri: null,
    donViDuocDuyet: null,
    soLenhChiTien: null,
    chuong: null,
    loai: null,
    khoan: null,
  };

  filterTable: any = {
    soThongTri: '',
    tenDviDuocDuyet: '',
    soLenhChiTien: '',
    chuong: '',
    loai: '',
    khoan: '',
    lyDoChi: '',
    soTien: '',
    dviThuHuong: '',
    tenTrangThai: '',
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

  selectedId: number = 0;

  isVatTu: boolean = false;
  STATUS = STATUS;
  allChecked = false;
  indeterminate = false;
  expandSetString = new Set<string>();
  dataTableTree: any[] = [];
  isView = false;
  constructor(
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    private modal: NzModalService,
    public userService: UserService,
    private donviService: DonviService,
    public globals: Globals,
    private tongHopTheoDoiCapVonService: TongHopTheoDoiCapPhiService,
    private danhMucService: DanhMucService,
  ) { }

  async ngOnInit() {
    try {
      await this.initData()
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
    this.spinner.show();
    let body = {
      "chuong": this.searchFilter.chuong,
      "khoan": this.searchFilter.khoan,
      "loai": this.searchFilter.loai,
      "maDviDuocDuyet": this.searchFilter.donViDuocDuyet,
      "paggingReq": {
        "limit": this.pageSize,
        "page": this.page - 1
      },
      "soLenhChiTien": this.searchFilter.soLenhChiTien,
      "soThongTri": this.searchFilter.soThongTri,
    };

    let res = await this.tongHopTheoDoiCapVonService.timKiem(body);

    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.dataTable = data.content;
      if (this.dataTable && this.dataTable.length > 0) {
        this.dataTable.forEach((item) => {
          item.checked = false;
        });
      }
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
      donViDuocDuyet: null,
      soLenhChiTien: null,
      chuong: null,
      loai: null,
      khoan: null,
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
          "chuong": this.searchFilter.chuong,
          "khoan": this.searchFilter.khoan,
          "loai": this.searchFilter.loai,
          "maDviDuocDuyet": this.searchFilter.donViDuocDuyet,
          "paggingReq": {
            "limit": this.pageSize,
            "page": this.page - 1
          },
          "soLenhChiTien": this.searchFilter.soLenhChiTien,
          "soThongTri": this.searchFilter.soThongTri,
        };
        this.tongHopTheoDoiCapVonService.exportList(body).subscribe((blob) => {
          saveAs(blob, 'danh-sach-tong-hop-theo-doi-cap-von.xlsx')
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
              ids: dataDelete
            }
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
            temp.push(item)
          }
        });
      }
      this.dataTable = [...this.dataTable, ...temp];
    } else {
      this.dataTable = cloneDeep(this.dataTableAll);
    }
  }

  onExpandStringChange(id: string, checked: boolean) {
    if (checked) {
      this.expandSetString.add(id);
    } else {
      this.expandSetString.delete(id);
    }
  }

  async buildTableView(data?: any) {
    this.dataTableTree = chain(data)
      .groupBy("tenDviThongTri")
      .map((v, k) => {
          let rowItem = v.find(s => s.tenDviThongTri === k);
          let idVirtual = uuidv4();
          this.expandSetString.add(idVirtual);
          return {
            idVirtual: idVirtual,
            tenDviThongTri: k,
            nam: rowItem?.nam,
            childData: v
          }
        }
      ).value();
  }

}
