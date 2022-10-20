import { saveAs } from 'file-saver';
import { cloneDeep } from 'lodash';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DonviService } from 'src/app/services/donvi.service';
import { MESSAGE } from 'src/app/constants/message';
import * as dayjs from 'dayjs';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { DanhSachDauThauService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/kehoach-lcnt/danhSachDauThau.service';
import { Subject } from 'rxjs';
import { UserLogin } from 'src/app/models/userlogin';
import { UserService } from 'src/app/services/user.service';
import { TinhTrangKhoHienThoiService } from 'src/app/services/tinhTrangKhoHienThoi.service';
import { convertTrangThai } from 'src/app/shared/commonFunction';
import { NzModalService } from 'ng-zorro-antd/modal';
import { QuanLyPhieuNhapKhoService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/nhap-kho/quanLyPhieuNhapKho.service';
import { Globals } from 'src/app/shared/globals';
import { QuanLyBienBanHaoDoiService } from 'src/app/services/quanLyBienBanHaoDoi.service';
import { FormBuilder, FormGroup } from '@angular/forms';


// cần thay đổi services khi có
@Component({
  selector: 'app-bien-ban-hao-doi',
  templateUrl: './bien-ban-hao-doi.component.html',
  styleUrls: ['./bien-ban-hao-doi.component.scss'],
})
export class BienBanHaoDoiComponent implements OnInit {
  @Input() typeVthh: string;

  formData: FormGroup;

  listDiemKho: any[] = [];
  listNhaKho: any[] = [];
  listNganLo: any[] = [];

  userInfo: UserLogin;

  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 0;
  dataTable: any[] = [];
  dataTableAll: any[] = [];

  isDetail: boolean = false;
  selectedId: number = 0;
  isView: boolean = false;

  allChecked = false;
  indeterminate = false;

  filterTable: any = {
    soBienBan: '',
    soQd: '',
    ngayLapPhieu: '',
    diemKho: '',
    nhaKho: '',
    nganKho: '',
    loKho: '',
    tenTrangThai: '',
  };

  constructor(
    private spinner: NgxSpinnerService,
    private donViService: DonviService,
    private quanLyBienBanTinhKhoService: QuanLyPhieuNhapKhoService,
    private notification: NzNotificationService,
    private router: Router,
    public userService: UserService,
    private tinhTrangKhoHienThoiService: TinhTrangKhoHienThoiService,
    private modal: NzModalService,
    public globals: Globals,
    private quanLyBienBanHaoDoiService: QuanLyBienBanHaoDoiService,
    private fb: FormBuilder,
  ) { }

  async ngOnInit() {
    this.spinner.show();
    try {
      this.initForm();
      this.userInfo = this.userService.getUserLogin();
      await Promise.all([
        // this.loadDiemKho(),
        // this.loadNganLo(),
        this.search(),
      ]);
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  // tạo form
  initForm(): void {
    this.formData = this.fb.group({
      "soQuyetDinh": [null],
      "soBienBan": [null],
      "ngayBienBan": [[]],
    })
  }

  // tìm kiếm
  async search() {
    let body = {
      quyetDinhId: this.formData.value.soQuyetDinh ? this.formData.value.soQuyetDinh : null,
      soBienBan: this.formData.value.soBienBan ? this.formData.value.soBienBan : null,
      ngayBienBanDen:
        this.formData.value.ngayBienBan &&
          this.formData.value.ngayBienBan.length > 1
          ? dayjs(this.formData.value.ngayBienBan[1]).format('YYYY-MM-DD')
          : null,
      ngayBienBanTu:
        this.formData.value.ngayBienBan &&
          this.formData.value.ngayBienBan.length > 0
          ? dayjs(this.formData.value.ngayBienBan[0]).format('YYYY-MM-DD')
          : null,
      pageNumber: this.page,
      pageSize: this.pageSize,
    };

    let res = await this.quanLyBienBanHaoDoiService.timKiem(body);
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
      this.dataTable = [];
      this.totalRecord = 0;
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  // async loadDiemKho() {
  //   let res = await this.tinhTrangKhoHienThoiService.getAllDiemKho();
  //   if (res.msg == MESSAGE.SUCCESS) {
  //     if (res.data) {
  //       this.listDiemKho = res.data;
  //     }
  //   } else {
  //     this.notification.error(MESSAGE.ERROR, res.msg);
  //   }
  // }

  updateAllChecked(): void {
    this.indeterminate = false;
    if (this.allChecked) {
      if (this.dataTable && this.dataTable.length > 0) {
        this.dataTable.forEach((item) => {
          if (item.trangThai == '00') {
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

  // xóa tìm kiếm
  clearFilter() {
    this.formData.reset();
    this.search();
  }

  convertTrangThai(status: string) {
    return convertTrangThai(status);
  }

  // Xóa 1 bản ghi
  xoaItem(id: number) {
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
          this.quanLyBienBanHaoDoiService.deleteData(id).then((res) => {
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

  // Xuất file
  export() {
    if (this.totalRecord && this.totalRecord > 0) {
      this.spinner.show();
      try {
        let body = {
          "ngayBienBanDen": this.formData.value.ngayBienBan &&
            this.formData.value.ngayBienBan.length > 1
            ? dayjs(this.formData.value.ngayBienBan[1]).format('YYYY-MM-DD')
            : null,
          "ngayBienBanTu": this.formData.value.ngayBienBan &&
            this.formData.value.ngayBienBan.length > 0
            ? dayjs(this.formData.value.ngayBienBan[0]).format('YYYY-MM-DD')
            : null,
          "paggingReq": {
            "limit": this.pageSize,
            "page": this.page
          },
          "quyetDinhId": this.formData.value.soQuyetDinh ? this.formData.value.soQuyetDinh : null,
          "soBienBan": this.formData.value.soBienBan ? this.formData.value.soBienBan : null
        }
        this.quanLyBienBanHaoDoiService
          .exportList(body)
          .subscribe((blob) => saveAs(blob, 'danh-sach-bien-ban-hao-doi.xlsx'));
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

  // Xóa nhiều bản ghi
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
            let res = await this.quanLyBienBanHaoDoiService.deleteMultiple({
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

  // tìm kiếm trong bảng
  filterInTable(key: string, value: string, date: boolean) {
    if (value && value != '') {
      this.dataTable = [];
      let temp = [];
      if (this.dataTableAll && this.dataTableAll.length > 0) {
        if (date) {
          this.dataTableAll.forEach((item) => {
            if (item[key] && item[key].toString().toLowerCase() === dayjs(value).format('YYYY-MM-DD')) {
              temp.push(item)
            }
          });
        } else {
          this.dataTableAll.forEach((item) => {
            if (item[key] && item[key].toString().toLowerCase().indexOf(value.toString().toLowerCase()) != -1) {
              temp.push(item)
            }
          });
        }
      }
      this.dataTable = [...this.dataTable, ...temp]
    } else {
      this.dataTable = cloneDeep(this.dataTableAll);
    }
  }

  clearFilterTable() {
    this.filterTable = {
      soBienBan: '',
      soQd: '',
      ngayLapPhieu: '',
      diemKho: '',
      nhaKho: '',
      nganKho: '',
      loKho: '',
      tenTrangThai: '',
    };
  }
}
