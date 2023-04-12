import { DatePipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { cloneDeep } from 'lodash';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { GiaoDuToanChiService } from 'src/app/services/quan-ly-von-phi/giaoDuToanChi.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { GDT, Utils } from 'src/app/Utility/utils';
import { DialogThemThongTinQuyetToanComponent } from '../dialog-them-thong-tin-quyet-toan/dialog-them-thong-tin-quyet-toan.component';
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
    maLoaiDan: [3],
    soQd: "",
    trangThaiGiaos: [],
    paggingReq: {
      limit: 10,
      page: 1
    },
  };

  filterTable: any = {
    maPaCha: "",
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
  isDataAvailable = false;

  totalElements = 0;
  totalPages = 0;
  date: any = new Date()

  userInfo: any;
  donVis: any[] = [];
  donViTaos: any[] = [];
  listIdDelete: string[] = [];
  constructor(
    private datePipe: DatePipe,
    private notification: NzNotificationService,
    private spinner: NgxSpinnerService,
    private userService: UserService,
    private danhMuc: DanhMucHDVService,
    private quanLyVonPhiService: QuanLyVonPhiService,
    private giaoDuToanChiService: GiaoDuToanChiService,
    private modal: NzModalService,
  ) { }

  ngOnInit() {
    this.action('init');
  }

  async action(code: string) {
    this.spinner.show();
    this.isDataAvailable = false;
    switch (code) {
      case 'init':
        await this.initialization().then(() => {
          this.isDataAvailable = true;
        });
        break;
      default:
        break;
    }
    this.spinner.hide();

  }

  async initialization() {
    this.userInfo = this.userService.getUserLogin();
    this.searchFilter.donViTao = this.userInfo?.MA_DVI;
    if (this.userService.isAccessPermisson(GDT.ADD_REPORT_CV_QD_GIAO_PA_PBDT)) {
      this.statusTaoMoi = false;
    }
    if (this.userService.isAccessPermisson(GDT.ADD_REPORT_CV_QD_GIAO_PA_PBDT)) {
      this.trangThai = '1';
    } else if (this.userService.isAccessPermisson(GDT.DUYET_REPORT_PA_PBDT)) {
      this.trangThai = '2';
    } else if (this.userService.isAccessPermisson(GDT.PHE_DUYET_REPORT_PA_PBDT)) {
      this.trangThai = '4';
    }
    //lay danh sach danh muc
    this.danhMuc.dMDonVi().toPromise().then(
      data => {
        if (data.statusCode == 0) {
          this.donVis = data.data;
          this.donViTaos = this.donVis.filter(e => e?.maDviCha === this.userInfo?.MA_DVI);
        } else {
          this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
        }
      },
      err => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
    );
    this.search()
  }

  clearFilter() {
    this.searchFilter.namPa = null;
    this.searchFilter.ngayTaoTu = null;
    this.searchFilter.ngayTaoDen = null;
    this.searchFilter.maPa = null;
    this.trangThai = null;
    this.trangThaiGiao = null;
    this.searchFilter.maLoaiDan = null;
    this.search();
  };

  async search() {
    this.statusCreate = true;
    if (this.searchFilter.namPa || this.searchFilter.namPa === 0) {
      if (this.searchFilter.namPa >= 3000 || this.searchFilter.namPa < 1000) {
        this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.WRONG_FORMAT);
        return;
      }
    }
    this.spinner.show();
    const searchFilterTemp = Object.assign({}, this.searchFilter);
    searchFilterTemp.trangThais = [];
    searchFilterTemp.trangThaiGiaos = [];
    searchFilterTemp.ngayTaoTu = this.datePipe.transform(searchFilterTemp.ngayTaoTu, Utils.FORMAT_DATE_STR) || searchFilterTemp.ngayTaoTu;
    searchFilterTemp.ngayTaoDen = this.datePipe.transform(searchFilterTemp.ngayTaoDen, Utils.FORMAT_DATE_STR) || searchFilterTemp.ngayTaoDen;
    if (this.trangThai) {
      searchFilterTemp.trangThais.push(this.trangThai)
    } else {
      searchFilterTemp.trangThais = [Utils.TT_BC_1, Utils.TT_BC_2, Utils.TT_BC_3, Utils.TT_BC_4, Utils.TT_BC_5, Utils.TT_BC_6, Utils.TT_BC_7, Utils.TT_BC_8, Utils.TT_BC_9]
    }
    if (this.trangThaiGiao) {
      searchFilterTemp.trangThaiGiaos.push(this.trangThaiGiao)
    } else {
      searchFilterTemp.trangThaiGiaos = ['0', '1', '2']
    }
    await this.giaoDuToanChiService.timBaoCaoGiao(searchFilterTemp).toPromise().then(
      (data) => {
        if (data.statusCode == 0) {
          this.dataTable = [];
          data.data.content.forEach(item => {
            if (this.listIdDelete.findIndex(e => e == item.id) == -1) {
              this.dataTable.push({
                ...item,
                checked: false,
                isEdit: this.checkEditStatus(item.trangThai),
                isDelete: this.checkDeleteStatus(item.trangThai),
              })
            } else {
              this.dataTable.push({
                ...item,
                checked: true,
              })
            }
          })
          this.dataTable.forEach(e => {
            e.ngayTao = this.datePipe.transform(e.ngayTao, Utils.FORMAT_DATE_STR);
            e.ngayTrinh = this.datePipe.transform(e.ngayTrinh, Utils.FORMAT_DATE_STR);
            e.ngayDuyet = this.datePipe.transform(e.ngayDuyet, Utils.FORMAT_DATE_STR);
            e.ngayPheDuyet = this.datePipe.transform(e.ngayPheDuyet, Utils.FORMAT_DATE_STR);
            e.ngayTraKq = this.datePipe.transform(e.ngayTraKq, Utils.FORMAT_DATE_STR);
          })
          this.dataTableAll = cloneDeep(this.dataTable);
          this.totalElements = data.data.totalElements;
          this.totalPages = data.data.totalPages;
        } else {
          this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
        }
      },
      (err) => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
    );
    this.spinner.hide();
  };

  checkEditStatus(trangThai: string) {
    return Utils.statusSave.includes(trangThai) &&
      (this.userService.isAccessPermisson(GDT.EDIT_REPORT_PA_PBDT));
  };

  checkDeleteStatus(trangThai: string) {
    return Utils.statusDelete.includes(trangThai) &&
      (this.userService.isAccessPermisson(GDT.DELETE_REPORT_PA_PBDT));
  };

  updateSingleChecked(): void {
    if (this.dataTable.every((item) => !item.checked && item.isDelete)) {
      this.allChecked = false;
    } else if (this.dataTable.every((item) => item.checked && item.isDelete)) {
      this.allChecked = true;
    }
  };

  xemChiTiet(id: string, maLoaiDan: string) {
    if (maLoaiDan == "3") {
      const obj = {
        id: id,
        tabSelected: 'phuongAnGiaoDuToan',
      }
      this.dataChange.emit(obj);
    }
    // else if (maLoaiDan == "3") {
    //   const obj = {
    //     id: id,
    //     tabSelected: 'phuongAnGiaoDieuChinh',
    //   }
    //   this.dataChange.emit(obj);
    // }
    else {
      this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
    }
  }

  deleteReport(id: string) {
    let request = [];
    if (!id) {
      request = this.listIdDelete;
    } else {
      request = [id];
    }
    this.spinner.show();
    this.giaoDuToanChiService.xoaBanGhiGiaoBTC(request).toPromise().then(
      data => {
        if (data.statusCode == 0) {
          this.listIdDelete = [];
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.DELETE_SUCCESS);
          this.search();
        } else {
          this.notification.error(MESSAGE.ERROR, data?.msg);
        }
      },
      err => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
    )
    this.spinner.hide();
  };

  addNewReport() {
    const modalTuChoi = this.modal.create({
      nzTitle: 'NHẬP QĐ/CV PHÂN BỔ DỰ TOÁN CHI',
      nzContent: DialogThemThongTinQuyetToanComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
      },
    });
    modalTuChoi.afterClose.toPromise().then(async (res) => {
      if (res ) {
        let obj = {
          id: res.id,
          tabSelected: 'phuongAnGiaoDuToan',
          isSynthetic: false,
        }
        this.dataChange.emit(obj);
      }
      // if (res && res?.loaiPa == "2") {
      //   let obj = {
      //     id: res.id,
      //     tabSelected: 'phuongAnGiaoDieuChinh',
      //     isSynthetic: false,
      //   }
      //   this.dataChange.emit(obj);
      // }
    });
  };

  updateAllChecked(): void {
    if (this.dataTable && this.dataTable.length > 0) {
      if (this.allChecked) {
        this.dataTable.forEach(item => {
          if (item.isDelete) {
            item.checked = true;
          }
        })
      } else {
        this.dataTable.forEach(item => {
          if (item.isDelete) {
            item.checked = false;
          }
        })
      }
    }
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

  // viewDetail(data: any) {
  //   debugger
  //   const obj = {
  //     id: data.id,
  //     tabSelected: 'quyetDinhBTC',
  //   }
  //   this.dataChange.emit(obj);
  // };

  //doi so trang
  onPageIndexChange(page) {
    this.searchFilter.paggingReq.page = page;
    this.search();
  }

  //doi so luong phan tu tren 1 trang
  onPageSizeChange(size) {
    this.searchFilter.paggingReq.limit = size;
    this.search();
  }

}
