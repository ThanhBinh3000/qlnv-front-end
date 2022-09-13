import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as dayjs from 'dayjs';
import { saveAs } from 'file-saver';
import { cloneDeep } from 'lodash';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { UserLogin } from 'src/app/models/userlogin';
import { QuanLyPhieuXuatKhoService } from 'src/app/services/quanLyPhieuXuatKho.service';
import { UserService } from 'src/app/services/user.service';
import { convertTrangThai } from 'src/app/shared/commonFunction';
import { Globals } from 'src/app/shared/globals';

@Component({
  selector: 'app-quan-ly-phieu-xuat-kho',
  templateUrl: './quan-ly-phieu-xuat-kho.component.html',
  styleUrls: ['./quan-ly-phieu-xuat-kho.component.scss']
})
export class QuanLyPhieuXuatKhoComponent implements OnInit {
  @Input() typeVthh: string;

  // các input search
  formData: FormGroup;

  // lấy data vào bảng
  listDiemKho: any[] = [];
  listNhaKho: any[] = [];
  listNganLo: any[] = [];
  listLoKho: any[] = [];
  // user : quyền và một số data
  userInfo: UserLogin;
  // phân trang trong table
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 0;
  dataTable: any[] = [];
  dataTableAll: any[] = [];
  // check view
  isDetail: boolean = false;
  selectedId: number = 0;
  isView: boolean = false;
  isTatCa: boolean = false;
  // check all trong table
  allChecked = false;
  indeterminate = false;
  // chức năng search trong table
  filterTable: any = {
    tenSqdx: '',
    spXuatKho: '',
    soHd: '',
    xuatKho: '',
    tenDiemkho: '',
    tenNhakho: '',
    tenNgankho: '',
    tenNganlo: '',
    tenTrangThai: '',
  };

  constructor(
    private spinner: NgxSpinnerService,
    private quanLyPhieuXuatKhoService: QuanLyPhieuXuatKhoService,
    private notification: NzNotificationService,
    public userService: UserService,
    private modal: NzModalService,
    private fb: FormBuilder,
    public globals: Globals,
  ) { }

  async ngOnInit() {
    // this.spinner.show();
    this.initForm();
    try {
      this.userInfo = this.userService.getUserLogin();
      if (!this.typeVthh || this.typeVthh == '') {
        this.isTatCa = true;
      }
      await Promise.all([
        this.search(),
      ]);
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  initForm(): void {
    this.formData = this.fb.group({
      "soQuyetDinhXuat": [null],
      "soPhieuXuat": [null],
      "ngayXuatKho": [null],
      "soHopDong": [null]
    })
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

  redirectToChiTiet(isView: boolean, id: number) {
    this.selectedId = id;
    this.isDetail = true;
    this.isView = isView;
  }

  async showList() {
    this.isDetail = false;
    await this.search();
  }

  async changePageIndex(event) {
    // this.spinner.show();
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
    // this.spinner.show();
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


  clearFilter() {
    this.formData.reset();
    this.search();
  }

  convertTrangThai(status: string) {
    return convertTrangThai(status);
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
        // this.spinner.show();
        try {
          this.quanLyPhieuXuatKhoService.deleteData(item.id).then((res) => {
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

  async search() {
    // cần thay đổi cái key-name đúng nếu có services
    let body = {
      "denNgay": this.formData.value.ngayXuatKho && this.formData.value.ngayXuatKho.length > 1 ? dayjs(this.formData.value.ngayXuatKho[1]).format('YYYY-MM-DD') : null,
      "maDvi": this.userInfo.MA_DVI,
      "loaiVthh": this.typeVthh,
      "paggingReq": {
        "limit": this.pageSize,
        "page": this.page - 1,
      },
      "soPhieu": this.formData.value.soPhieuXuat,
      "soQuyetDinh": this.formData.value.soQuyetDinhXuat,
      "soHd": this.formData.value.soHopDong,
      "tuNgay": this.formData.value.ngayXuatKho && this.formData.value.ngayXuatKho.length > 0 ? dayjs(this.formData.value.ngayXuatKho[0]).format('YYYY-MM-DD') : null,
    };
    let res = await this.quanLyPhieuXuatKhoService.timKiem(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.dataTable = data.content;
      if (this.dataTable && this.dataTable.length > 0) {
        this.dataTable.forEach((item) => {
          item.checked = false;
        });
      }
      this.dataTableAll = cloneDeep(this.dataTable);
      this.totalRecord = data.totalElements;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  export() {
    if (this.totalRecord && this.totalRecord > 0) {
      this.spinner.show();
      try {
        let body = {
          "denNgay": this.formData.value.ngayXuatKho && this.formData.value.ngayXuatKho.length > 1 ? dayjs(this.formData.value.ngayXuatKho[1]).format('YYYY-MM-DD') : null,
          "maDvi": this.userInfo.MA_DVI,
          "loaiVthh": this.typeVthh,
          "soPhieu": this.formData.value.soPhieuXuat,
          "soQuyetDinh": this.formData.value.soQuyetDinhXuat,
          "soHd": this.formData.value.soQuyetDinhXuat,
          "tuNgay": this.formData.value.ngayXuatKho && this.formData.value.ngayXuatKho.length > 0 ? dayjs(this.formData.value.ngayXuatKho[0]).format('YYYY-MM-DD') : null,
        };
        this.quanLyPhieuXuatKhoService
          .exportList(body)
          .subscribe((blob) =>
            saveAs(blob, 'danh-sach-phieu-xuat-kho.xlsx'),
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
            let res = await this.quanLyPhieuXuatKhoService.deleteMultiple({ ids: dataDelete });
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
      tenSqdx: '',
      spXuatKho: '',
      soHd: '',
      xuatKho: '',
      tenDiemkho: '',
      tenNhakho: '',
      tenNgankho: '',
      tenNganlo: '',
      tenTrangThai: '',
    }
  }

  print() {

  }


}
