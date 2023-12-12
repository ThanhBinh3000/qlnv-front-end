import { Component, OnInit } from "@angular/core";
import { PAGE_SIZE_DEFAULT } from "../../../../constants/config";
import { UserLogin } from "../../../../models/userlogin";
import { STATUS } from "src/app/constants/status";
import { NgxSpinnerService } from "ngx-spinner";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { UserService } from "../../../../services/user.service";
import { DonviService } from "../../../../services/donvi.service";
import { NzModalService } from "ng-zorro-antd/modal";
import dayjs from "dayjs";
import { cloneDeep } from 'lodash';
import { MESSAGE } from "../../../../constants/message";
import {
  TongHopDxKhNhapKhacService
} from "../../../../services/qlnv-hang/nhap-hang/nhap-khac/tongHopDxKhNhapKhac.service";
import { saveAs } from 'file-saver';

@Component({
  selector: "app-tong-hop-khnk",
  templateUrl: "./tong-hop-khnk.component.html",
  styleUrls: ["./tong-hop-khnk.component.scss"]
})
export class TongHopKhnkComponent implements OnInit {
  listNam: any[] = [];
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 0;
  allChecked = false;
  indeterminate = false;
  selectedId: number = 0;
  isDetail: boolean = false;
  isView: boolean = false;
  isQuyetDinh: boolean = false;
  dataTongHop: any;
  idQd: any;
  searchFilter = {
    namKhoach: "",
    maTh: "",
    // trangThai: "",

  };
  dataTable: any[] = [];
  dataTableAll: any[] = [];
  STATUS = STATUS;
  userInfo: UserLogin;
  listTrangThai: any[] = [
    { ma: this.STATUS.DU_THAO, giaTri: "Dự thảo" },
    { ma: this.STATUS.CHO_DUYET_LDV, giaTri: "Chờ duyệt - LĐ Vụ" },
    { ma: this.STATUS.TU_CHOI_LDV, giaTri: "Từ chối - LĐ Vụ" },
    { ma: this.STATUS.DA_DUYET_LDV, giaTri: "Đã duyệt - LĐ Vụ" }
  ];
  filterTable: any = {
    namKhoach: "",
    maTh: "",
    ngayTh: "",
    soQd: "",
    ngayKy: "",
    tenLoaiVthh: "",
    tongSlNhap: "",
    dvt: "",
    noiDungTh: "",
    trangThai: "",
  };

  constructor(
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    public userService: UserService,
    private dviService: DonviService,
    private tongHopDxKhNhapKhacService: TongHopDxKhNhapKhacService,
    private modal: NzModalService
  ) {
  }

  tuNgayTh: Date | null = null;
  denNgayTh: Date | null = null;
  tuNgayKy: Date | null = null;
  denNgayKy: Date | null = null;
  disabledStartDate = (startValue: Date): boolean => {
    if (!startValue || !this.denNgayTh) {
      return false;
    }
    return startValue.getTime() > this.denNgayTh.getTime();
  };

  disabledEndDate = (endValue: Date): boolean => {
    if (!endValue || !this.tuNgayTh) {
      return false;
    }
    return endValue.getTime() <= this.tuNgayTh.getTime();
  };

  disabledTuNgayKy = (startValue: Date): boolean => {
    if (!startValue || !this.denNgayKy) {
      return false;
    }
    return startValue.getTime() > this.denNgayKy.getTime();
  };

  disabledDenNgayKy = (endValue: Date): boolean => {
    if (!endValue || !this.tuNgayKy) {
      return false;
    }
    return endValue.getTime() <= this.tuNgayKy.getTime();
  };


  async ngOnInit() {
    await this.spinner.show();
    try {
      for (let i = -3; i < 23; i++) {
        this.listNam.push({
          value: dayjs().get("year") - i,
          text: dayjs().get("year") - i
        });
      }
      this.userInfo = this.userService.getUserLogin();
      await Promise.all([
        this.search()
      ]);
      await this.spinner.hide();
    } catch (e) {
      console.log("error: ", e);
      await this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  clearFilter() {
    this.searchFilter.namKhoach = null;
    this.searchFilter.maTh = null;
    // this.searchFilter.trangThai = null;
    this.tuNgayKy = null;
    this.denNgayKy = null;
    this.tuNgayTh = null;
    this.denNgayTh = null;
    this.search();
  }

  async search() {
    this.spinner.show();
    let body = {
      tuNgayKy: this.tuNgayKy != null ? dayjs(this.tuNgayKy).format("YYYY-MM-DD") + " 00:00:00" : null,
      denNgayKy: this.denNgayKy != null ? dayjs(this.denNgayKy).format("YYYY-MM-DD") + " 23:59:59" : null,
      tuNgayTh: this.tuNgayTh != null ? dayjs(this.tuNgayTh).format("YYYY-MM-DD") + " 00:00:00" : null,
      denNgayTh: this.denNgayTh != null ? dayjs(this.denNgayTh).format("YYYY-MM-DD") + " 23:59:59" : null,
      namKhoach: this.searchFilter.namKhoach,
      maTh: this.searchFilter.maTh,
      // trangThai: this.searchFilter.trangThai,
      paggingReq: {
        limit: this.pageSize,
        page: this.page - 1
      }
    };
    let res = await this.tongHopDxKhNhapKhacService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      if (data && data.content && data.content.length > 0) {
        this.dataTable = data.content;
        this.dataTable.forEach((item) => {
          item.checked = false;
        });
        this.dataTableAll = cloneDeep(this.dataTable);
        this.totalRecord = data.totalElements;
      } else {
        this.dataTable = [];
        this.totalRecord = 0;
      }
    } else {
      this.dataTable = [];
      this.totalRecord = 0;
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    this.spinner.hide();
  };

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
            let res = await this.tongHopDxKhNhapKhacService.deleteMuti({ idList: dataDelete });
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
  };

  exportData() {
    if (this.totalRecord > 0) {
      this.spinner.show();
      try {
        let body = {
          tuNgayKy: this.tuNgayKy != null ? dayjs(this.tuNgayKy).format("YYYY-MM-DD") + " 00:00:00" : null,
          denNgayKy: this.denNgayKy != null ? dayjs(this.denNgayKy).format("YYYY-MM-DD") + " 23:59:59" : null,
          tuNgayTh: this.tuNgayTh != null ? dayjs(this.tuNgayTh).format("YYYY-MM-DD") + " 00:00:00" : null,
          denNgayTh: this.denNgayTh != null ? dayjs(this.denNgayTh).format("YYYY-MM-DD") + " 23:59:59" : null,
          namKhoach: this.searchFilter.namKhoach,
          maTh: this.searchFilter.maTh,
          // trangThai: this.searchFilter.trangThai,
        };
        this.tongHopDxKhNhapKhacService
          .export(body)
          .subscribe((blob) =>
            saveAs(blob, 'danh-sach-tong-hop-de-xuat-khnk.xlsx'),
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
  };
  tongHop() {
    this.isDetail = true;
    this.selectedId = null;
    this.isView = false;
  };

  updateAllChecked(): void {
    this.indeterminate = false;
    if (this.allChecked) {
      if (this.dataTable && this.dataTable.length > 0) {
        this.dataTable.forEach((item) => {
          if (item.trangThai == "00") {
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

  filterInTable(key: string, value: string) {
    if (value != null && value != "") {
      this.dataTable = [];
      let temp = [];
      if (this.dataTableAll && this.dataTableAll.length > 0) {
        this.dataTableAll.forEach((item) => {
          if (["ngayKy", "ngayTh"].includes(key)) {
            if (item[key] && dayjs(item[key]).format("DD/MM/YYYY").indexOf(value.toString()) != -1) {
              temp.push(item);
            }
          } else if (item[key] && item[key].toString().toLowerCase().indexOf(value.toString().toLowerCase()) != -1 || item[key] == value) {
            temp.push(item);
          }
        });
      }
      this.dataTable = [...this.dataTable, ...temp];
    } else {
      this.dataTable = cloneDeep(this.dataTableAll);
    }
  }

  convertDateToString(event: any): string {
    let result = "";
    if (event) {
      result = dayjs(event).format("DD/MM/YYYY").toString();
    }
    return result;
  }

  async changePageIndex(event) {
    this.spinner.show();
    try {
      this.page = event;
      await this.search();
      this.spinner.hide();
    } catch (e) {
      console.log("error: ", e);
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
      console.log("error: ", e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  detail(data?, isView?) {
    this.selectedId = data.id;
    this.isDetail = true;
    if (isView != null) {
      this.isView = isView;
    }
  }

  xoaItem(item: any) {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: "Xác nhận",
      nzContent: "Bạn có chắc chắn muốn xóa?",
      nzOkText: "Đồng ý",
      nzCancelText: "Không",
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: () => {
        this.spinner.show();
        try {
          let body = {
            "id": item.id
          };
          this.tongHopDxKhNhapKhacService.delete(body).then((res) => {
            if (res.msg == MESSAGE.SUCCESS) {
              this.notification.success(
                MESSAGE.SUCCESS,
                MESSAGE.DELETE_SUCCESS
              );
              this.search();
            } else {
              this.notification.error(MESSAGE.ERROR, res.msg);
            }
          });
          this.spinner.hide();
        } catch (e) {
          console.log("error: ", e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      }
    });
  }

  showList() {
    this.isDetail = false;
    this.isQuyetDinh = false;
    this.search();
  }

  async taoQdinh(data: any) {
    this.dataTongHop = data;
    this.isQuyetDinh = true;
  }
  async showQd(data: any) {
    this.idQd = data.idQd;
    this.isQuyetDinh = true;
  }
}
