import { saveAs } from 'file-saver';
import { cloneDeep } from 'lodash';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DonviService } from 'src/app/services/donvi.service';
import { MESSAGE } from 'src/app/constants/message';
import * as dayjs from 'dayjs';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { DanhSachDauThauService } from 'src/app/services/danhSachDauThau.service';
import { Subject } from 'rxjs';
import { UserLogin } from 'src/app/models/userlogin';
import { UserService } from 'src/app/services/user.service';
import { TinhTrangKhoHienThoiService } from 'src/app/services/tinhTrangKhoHienThoi.service';
import { convertTrangThai } from 'src/app/shared/commonFunction';
import { NzModalService } from 'ng-zorro-antd/modal';
import { QuanLyPhieuNhapKhoService } from 'src/app/services/quanLyPhieuNhapKho.service';

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
    soPhieuXuat: '',
    soQuyetDinhXuat: '',
    soHopDong: '',
    ngayXuatKho: '',
    tenDiemKho: '',
    tenNhaKho: '',
    tenNganKho: '',
    tenLoKho: '',
    trangThai: ''
  };

  constructor(
    private spinner: NgxSpinnerService,
    private donViService: DonviService,
    private quanLyPhieuNhapKhoService: QuanLyPhieuNhapKhoService,
    private notification: NzNotificationService,
    private router: Router,
    public userService: UserService,
    private tinhTrangKhoHienThoiService: TinhTrangKhoHienThoiService,
    private modal: NzModalService,
    private fb: FormBuilder,
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

  initForm(): void {
    this.formData = this.fb.group({
      "soQuyetDinhXuat": [null],
      "soPhieuXuat": [null],
      "ngayXuatKho": [null],
      "soHopDong": [null]
    })
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
        "diemKhoId": diemKhoId,
        "maNhaKho": null,
        "paggingReq": {
          "limit": 1000,
          "page": 1
        },
        "str": null,
        "tenNhaKho": null,
        "trangThai": null
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
      "maNganLo": null,
      "nganKhoId": null,
      "paggingReq": {
        "limit": 1000,
        "page": 1
      },
      "str": null,
      "tenNganLo": null,
      "trangThai": null
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
          this.quanLyPhieuNhapKhoService.deleteData(item.id).then((res) => {
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
      "denNgayXuatKho": this.formData.value.ngayXuatKho && this.formData.value.ngayXuatKho.length > 1 ? dayjs(this.formData.value.ngayXuatKho[1]).format('YYYY-MM-DD') : null,
      "maDvi": this.userInfo.MA_DVI,
      "loaiVthh": this.typeVthh,
      "orderBy": null,
      "orderDirection": null,
      "pageNumber": this.page,
      "pageSize": this.pageSize,
      "soPhieu": this.formData.value.soPhieuXuat,
      "soQdNhap": this.formData.value.soQuyetDinhXuat,
      "str": null,
      "trangThai": null,
      "tuNgayXuatKho": this.formData.value.ngayXuatKho && this.formData.value.ngayXuatKho.length > 0 ? dayjs(this.formData.value.ngayXuatKho[0]).format('YYYY-MM-DD') : null,
    };

    let res = await this.quanLyPhieuNhapKhoService.timKiem(body);
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
      // this.spinner.show();
      try {
        let body = {
          "denNgayXuatKho": this.formData.value.ngayXuatKho && this.formData.value.ngayXuatKho.length > 1 ? dayjs(this.formData.value.ngayXuatKho[1]).format('YYYY-MM-DD') : null,
          "maDvi": this.userInfo.MA_DVI,
          "orderBy": null,
          "orderDirection": null,
          "soPhieu": this.formData.value.soPhieuXuat,
          "soQdNhap": this.formData.value.soQuyetDinhXuat,
          "str": null,
          "trangThai": null,
          "tuNgayXuatKho": this.formData.value.ngayXuatKho && this.formData.value.ngayXuatKho.length > 0 ? dayjs(this.formData.value.ngayXuatKho[0]).format('YYYY-MM-DD') : null,
        };
        this.quanLyPhieuNhapKhoService
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
          // this.spinner.show();
          try {
            let res = await this.quanLyPhieuNhapKhoService.deleteMultiple({ ids: dataDelete });
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
      soQuyetDinhNhap: '',
      soPhieu: '',
      ngayXuatKho: '',
      tenDiemKho: '',
      tenNhaKho: '',
      tenNganLo: '',
    }
  }

  print() {

  }


}
