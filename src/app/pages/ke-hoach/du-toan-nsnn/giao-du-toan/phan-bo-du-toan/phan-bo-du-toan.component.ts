import { DatePipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { cloneDeep } from 'lodash';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { Utils } from 'src/app/Utility/utils';
export const TRANG_THAI_TIM_KIEM = [
  {
    id: "1",
    tenDm: 'Đang soạn'
  },
  {
    id: "2",
    tenDm: 'Trình duyệt'
  },
  {
    id: "3",
    tenDm: 'Trưởng BP từ chối'
  },
  {
    id: "4",
    tenDm: 'Trưởng BP duyệt'
  },
  {
    id: "5",
    tenDm: 'Lãnh đạo từ chối'
  },
  {
    id: "6",
    tenDm: 'Lãnh đạo phê duyệt'
  },
  {
    id: "7",
    tenDm: 'Gửi đơn vị cấp trên'
  },
  // {
  //   id: "8",
  //   tenDm: 'Đơn vị cấp trên từ chối'
  // },
  // {
  //   id: "9",
  //   tenDm: 'Đơn vị cấp trên tiếp nhận'
  // },
  // {
  //     id: "10",
  //     tenDm: 'Lãnh đạo yêu cầu điều chỉnh'
  // },
]
@Component({
  selector: 'app-phan-bo-du-toan',
  templateUrl: './phan-bo-du-toan.component.html',
  styleUrls: ['./phan-bo-du-toan.component.scss']
})
export class PhanBoDuToanComponent implements OnInit {
  @Output() dataChange = new EventEmitter();

  searchFilter = {
    loaiTimKiem: "0",
    maPhanGiao: '2',
    maLoai: '2',
    namPa: null,
    ngayTaoTu: "",
    ngayTaoDen: "",
    donViTao: "",
    loai: null,
    trangThais: [],
    maPa: "",
    maLoaiDan: null,
    soQd: "",
    trangThaiGiaos: [],
    paggingReq: {
      limit: 10,
      page: 1
    },
  };

  filterTable: any = {
    maPa: "",
    ngayTao: "",
    namPa: "",
    maLoaiDan: "",
    trangThaiGiao: "",
    trangThai: "",
  };

  pages = {
    size: 10,
    page: 1,
  };

  trangThais: any = TRANG_THAI_TIM_KIEM;
  loaiDuAns: any[] = [
    {
      id: '1',
      tenDm: 'Giao dự toán'
    },
    {
      id: '2',
      tenDm: 'Giao, diều chỉnh dự toán'
    }
  ];
  trangThaiGiaos: any[] = [
    {
      id: '0',
      tenDm: 'Chưa giao'
    },
    {
      id: '2',
      tenDm: 'Đang giao'
    },
    {
      id: '1',
      tenDm: 'Đã giao hết'
    }
  ];


  dataTable: any[] = [];
  dataTableAll: any[] = [];
  trangThai!: string;
  trangThaiGiao!: string;


  statusCreate = true;
  statusTaoMoi = true;
  statusDelete = true;
  statusNewReport = true;
  allChecked = false;

  totalElements = 0;
  totalPages = 0;
  date: any = new Date()


  constructor(
    private datePipe: DatePipe,
    private notification: NzNotificationService,
  ) { }

  ngOnInit() {
  }

  clearFilter() {
    this.searchFilter.namPa = null;
    this.searchFilter.ngayTaoTu = null;
    this.searchFilter.ngayTaoTu = null;
    this.searchFilter.maPa = null;
    this.search();
  };

  search() {

  };

  updateSingleChecked(): void {
    if (this.dataTable.every((item) => !item.checked && item.isDelete)) {
      this.allChecked = false;
    } else if (this.dataTable.every((item) => item.checked && item.isDelete)) {
      this.allChecked = true;
    }
  };

  xemChiTiet(id: string, maLoaiDan: string) {
    if (maLoaiDan == "1") {
      // this.router.navigate([
      //   MAIN_ROUTE_KE_HOACH + '/' + MAIN_ROUTE_DU_TOAN + '/' + GIAO_DU_TOAN + '/xay-dung-phuong-an-giao-du-toan-chi-NSNN-cho-cac-don-vi/' + id,
      // ])
    } else if (maLoaiDan == "2") {
      // this.router.navigate([
      //   MAIN_ROUTE_KE_HOACH + '/' + MAIN_ROUTE_DU_TOAN + '/' + GIAO_DU_TOAN + '/xay-dung-phuong-an-giao-dieu-chinh-du-toan-chi-NSNN-cho-cac-don-vi/' + id,
      // ])
    } else {
      this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
    }
  }

  deleteReport(id: string) {

  };

  addNewReport() {

  };

  updateAllChecked(): void {

  };

  getStatusName(trangThai: string) {
    return this.trangThais.find(e => e.id == trangThai)?.tenDm;
  };

  filterInTable(key: string, value: string, isDate: boolean) {
    if (value && value != '') {
      this.dataTable = [];
      let temp = [];
      if (this.dataTableAll && this.dataTableAll.length > 0) {
        if (isDate) {
          value = this.datePipe.transform(value, Utils.FORMAT_DATE_STR);
        }
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
  };

  viewDetail(data: any) {
    const obj = {
      id: data.id,
      tabSelected: 'quyetDinhBTC',
    }
    this.dataChange.emit(obj);
  };

  onPageIndexChange(page) {
    this.pages.page = page;
    this.search();
  };

  //doi so luong phan tu tren 1 trang
  onPageSizeChange(size) {
    this.pages.size = size;
    this.search();
  };

}
