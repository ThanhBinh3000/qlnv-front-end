import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import * as dayjs from 'dayjs';
import { cloneDeep } from 'lodash';
import { DonviService } from 'src/app/services/donvi.service';
import { isEmpty } from 'lodash';
import { DANH_MUC_LEVEL } from '../../luu-kho.constant';
import { NgxSpinnerService } from 'ngx-spinner';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MESSAGE } from 'src/app/constants/message';
import { UserLogin } from 'src/app/models/userlogin';
import { UserService } from 'src/app/services/user.service';
import { QuanLySoKhoTheKhoService } from 'src/app/services/quan-ly-so-kho-the-kho.service';
import { convertTrangThai } from 'src/app/shared/commonFunction';
import { NzModalService } from 'ng-zorro-antd/modal';
import { saveAs } from 'file-saver';
import { Globals } from 'src/app/shared/globals';

@Component({
  selector: 'app-so-kho-the-kho',
  templateUrl: './so-kho-the-kho.component.html',
  styleUrls: ['./so-kho-the-kho.component.scss'],
})
export class SoKhoTheKhoComponent implements OnInit {
  userInfo: UserLogin;
  detail: any = {};
  isDetail: false;

  formData: FormGroup;

  isAddNew = false;

  allChecked = false;
  indeterminate = false;

  filterDate = new Date();

  dsNam: string[] = []
  filterTable: any = {
    nam: null,
    tuNgay: null,
    denNgay: null,
    loaiHangHoa: null,
    chungLoaiHangHoa: null,
    ngayTao: null,
    donVi: null,
    diemKho: null,
    nhaKho: null,
    nganKho: null,
    loKho: null,
    trangThai: null,
  };
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 10;
  setOfCheckedId = new Set<number>();

  dataTable: any[] = [];
  dataTableAll: any[] = []

  idSelected: number = 0
  isCheck: boolean = false
  isStatus: any
  getCount = new EventEmitter<any>();

  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    private quanLySoKhoTheKhoService: QuanLySoKhoTheKhoService,
    private modal: NzModalService,
    public userService: UserService,
    public globals: Globals,
  ) {
    this.formData = this.fb.group({
      "denNgay": "",
      "limit": 20,
      "loaiHH": "",
      "maChungLoaiHang": "",
      "maDvi": "",
      "nam": "",
      "orderBy": "",
      "orderType": "",
      "page": 0,
      "tenDVi": "",
      "tuNgay": ""
    })
  }

  async ngOnInit() {
    try {
      this.spinner.show();
      this.loadDsNam();
      await this.search()
      this.spinner.hide();
    } catch (error) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      this.spinner.hide();
    }
  }

  async search() {
    this.spinner.show();

    let body = this.formData.value
    // set defaulue value ô ngày tạo
    // if (body.ngayTao != null) {
    //   body.tuNgay = body.ngayTao[0]
    //   body.denNgay = body.ngayTao[1]
    // }

    let res = await this.quanLySoKhoTheKhoService.timKiem(body);
    if (res.msg = MESSAGE.SUCCESS) {
      this.dataTable = res.data.content
      if (this.dataTable && this.dataTable.length > 0) {
        this.dataTable.forEach(item => item.checked = false)
      }
      this.dataTableAll = cloneDeep(this.dataTable);
      console.log(this.dataTableAll);
      this.totalRecord = res.data.totalElements;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg)
    }
    this.spinner
  }
  // sử lý cột trạng thái trong bảng
  convertTrangThai(status: string) {
    return convertTrangThai(status);
  }
  // hiển thị danh sách năm
  loadDsNam() {
    let thisYear = dayjs().get('year');
    for (let i = -3; i < 23; i++) {
      this.dsNam.push((thisYear - i).toString());
    }
  }
  // bắt dự kiện clear input search()
  clearFilter() {
    this.formData.reset()
    // mạng lag nên tạm thời cmt lại
    // this.search();
  }
  //sự kiện click all check box
  updateAllChecked(): void {
    this.indeterminate = false;
    if (this.allChecked) {
      if (this.dataTable && this.dataTable.length > 0) {
        this.dataTable.forEach((item) => {
          if (item.trangThai == '00') {
            item.checked = true;
            console.log(item.checked);
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
  // sự kiện checkbox từng hàng
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

  // sự kiện ấn nút xoá
  xoa() {
    let dataDelete = [];
    if (this.dataTable && this.dataTable.length > 0) {
      this.dataTable.forEach((item) => {
        if (item.checked) {
          dataDelete.push(item.id)
        }
      })
    }
    console.log(dataDelete);

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
            let res = await this.quanLySoKhoTheKhoService.deleteMultiple({ idList: dataDelete });
            if (res.msg == MESSAGE.SUCCESS) {
              this.notification.success(MESSAGE.SUCCESS, MESSAGE.DELETE_SUCCESS);
              await this.search();
              this.getCount.emit();
              this.allChecked = false;
            } else {
              this.notification.error(MESSAGE.ERROR, res.msg);
            }
          } catch (e) {
            console.log('error: ', e);
            this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
          } finally {
            this.spinner.hide();
          }
        },
      })
    } else {
      this.notification.error(MESSAGE.ERROR, "Không có dữ liệu phù hợp để xóa.");
    }
  }

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
      this.dataTable = [...this.dataTable, ...temp]
    } else {
      this.dataTable = cloneDeep(this.dataTableAll);
    }
  }

  exportData() {
    if (this.totalRecord > 0) {
      this.spinner.show()
      try {
        let body = this.formData.value;
        this.quanLySoKhoTheKhoService.exportList(body).subscribe((blob) => {
          saveAs(blob, 'danh-sach-so-kho.xlsx')
        });
        this.spinner.hide();
      } catch (e) {
        console.log('error: ', e);
        this.spinner.hide();
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
    } else {
      this.notification.error(MESSAGE.ERROR, MESSAGE.DATA_EMPTY)
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

  viewDetail(id: number, check: boolean, status: any) {
    this.isAddNew = true;
    this.idSelected = id;
    this.isCheck = check
    this.isStatus = status
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
          this.quanLySoKhoTheKhoService.deleteData(item).then((res) => {
            if (res.msg == MESSAGE.SUCCESS) {
              this.notification.success(
                MESSAGE.SUCCESS,
                MESSAGE.DELETE_SUCCESS,
              );
              this.search();
              this.getCount.emit();
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
  onClose() {
    this.isAddNew = false;
  }
}
