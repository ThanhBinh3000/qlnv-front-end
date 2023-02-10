import { Component, OnInit, Input } from '@angular/core';
import { cloneDeep } from 'lodash';
import { UserLogin } from 'src/app/models/userlogin';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { NgxSpinnerService } from 'ngx-spinner';
import { DonviService } from 'src/app/services/donvi.service';
import { QuanLyPhieuKiemNghiemChatLuongHangService } from 'src/app/services/qlnv-hang/nhap-hang/dau-thau/kiemtra-cl/quanLyPhieuKiemNghiemChatLuongHang.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { TinhTrangKhoHienThoiService } from 'src/app/services/tinhTrangKhoHienThoi.service';
import { UserService } from 'src/app/services/user.service';
import { MESSAGE } from 'src/app/constants/message';
import * as dayjs from 'dayjs';
import { saveAs } from 'file-saver';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Globals } from 'src/app/shared/globals';

@Component({
  selector: 'app-quan-ly-phieu-kiem-nghiem-chat-luong',
  templateUrl: './quan-ly-phieu-kiem-nghiem-chat-luong.component.html',
  styleUrls: ['./quan-ly-phieu-kiem-nghiem-chat-luong.component.scss'],
})
export class QuanLyPhieuKiemNghiemChatLuongComponent implements OnInit {
  @Input() typeVthh: string;

  formData: FormGroup;

  isView = false;
  dataTable: any[] = [];
  dataTableAll: any[] = [];

  filterTable: any = {
    soPhieu: '',
    ngayKnghiem: '',
    soPhieuNhapKho: '',
    ngayLayMau: '',
    tenDiemKho: '',
    tenNhaKho: '',
    tenNganKho: '',
    tenLoKho: '',
    tenTrangThai: '',
  };

  isTatCa: boolean = false;

  userInfo: UserLogin;
  detail: any = {};

  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 0;
  isDetail: boolean = false;
  selectedId: number = 0;

  allChecked = false;
  indeterminate = false;

  constructor(
    private spinner: NgxSpinnerService,
    private donViService: DonviService,
    private phieuKiemNghiemChatLuongHangService: QuanLyPhieuKiemNghiemChatLuongHangService,
    private notification: NzNotificationService,
    private router: Router,
    private modal: NzModalService,
    public userService: UserService,
    private fb: FormBuilder,
    public globals: Globals
  ) { }

  async ngOnInit() {
    this.spinner.show();
    try {
      if (this.typeVthh == 'tat-ca') {
        this.isTatCa = true;
      }
      this.userInfo = this.userService.getUserLogin();
      this.initForm()
      await this.search();
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }
  initForm(): void {
    this.formData = this.fb.group({
      soPhieuKN: [null],
      ngayKN: [null],
      soBienBanLayMau: [null],
    })
  }
  initData(): void {
    this.userInfo = this.userService.getUserLogin();
    this.detail.maDvi = this.userInfo.MA_DVI;
    this.detail.tenDvi = this.userInfo.TEN_DVI;
    this.detail.capDvi = this.userInfo.CAP_DVI;
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
      "capDvis": this.detail.capDvi,
      "kqDanhGia": null,
      "maDonVi": this.detail.maDvi,
      "maVatTuCha": null,
      "maNganKho": null,
      "ngayKiemTraDenNgay": null,
      "ngayKiemTraTuNgay": null,
      "ngayLapPhieu": null,
      "orderBy": null,
      "orderDirection": null,
      "paggingReq": {
        "limit": this.pageSize,
        "orderBy": null,
        "orderType": null,
        "page": this.page,
      },
      "soPhieu": this.formData.value.soPhieuKN ? this.formData.value.soPhieuKN : null,
      "soQd": null,
      "str": null,
      "tenNguoiGiao": null,
      "trangThai": null,
    };
    let res = await this.phieuKiemNghiemChatLuongHangService.search(body);

    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.dataTable = [...data.content];
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

  clearFilter() {
    this.formData.reset()
    this.search();
    this.filterTable = {
      soPhieu: '',
      ngayKnghiem: '',
      soPhieuNhapKho: '',
      ngayLayMau: '',
      tenDiemKho: '',
      tenNhaKho: '',
      tenNganKho: '',
      tenLoKho: '',
      tenTrangThai: '',
    };
  }

  xoaItem(id) {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn xóa?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: async () => {
        this.spinner.show();
        try {
          const res = await this.phieuKiemNghiemChatLuongHangService.delete(id);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.DELETE_SUCCESS);
            this.search();
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
        } catch (e) {
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        } finally {
          this.spinner.hide();
        }
      },
    });
  }

  deleteSelect() {
    const dataDelete = this.dataTable
      .filter((item) => item.checked)
      .map((item) => item.id);
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
            let res =
              await this.phieuKiemNghiemChatLuongHangService.deleteMuti({
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
          } catch (e) {
            console.log('error: ', e);
            this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
          } finally {
            this.spinner.hide();
            this.allChecked = false;
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


  redirectToChiTiet(isView: boolean, id: number) {
    this.selectedId = id;
    this.isDetail = true;
    this.isView = isView;
  }

  async showList() {
    this.isDetail = false;
    await this.search();
  }

  filterInTable(key: string, value: string | Date) {
    if (value instanceof Date) {
      value = dayjs(value).format('YYYY-MM-DD');
    }

    if (value && value != '') {
      this.dataTable = this.dataTableAll.filter((item) =>
        item[key]
          ?.toString()
          .toLowerCase()
          .includes(value.toString().toLowerCase()),
      );
    } else {
      this.dataTable = cloneDeep(this.dataTableAll);
    }
  }

  async export() {
    if (this.totalRecord && this.totalRecord > 0) {
      this.spinner.show();
      try {
        let body = {
          "capDvis": null,
          "kqDanhGia": null,
          "maDonVi": null,
          "maVatTuCha": null,
          "maNganKho": null,
          "ngayKiemTraDenNgay": null,
          "ngayKiemTraTuNgay": null,
          "ngayLapPhieu": null,
          "orderBy": null,
          "orderDirection": null,
          "paggingReq": {
            "limit": this.pageSize,
            "orderBy": null,
            "orderType": null,
            "page": this.page,
          },
          "soPhieu": this.formData.value.soPhieuKN ? this.formData.value.soPhieuKN : null,
          "soQd": null,
          "str": null,
          "tenNguoiGiao": null,
          "trangThai": null,
        };
        const blob = await this.phieuKiemNghiemChatLuongHangService.export(
          body,
        );
        saveAs(blob, 'danh-sach-phieu-kiem-nghiem-chat-luong-xuat.xlsx');
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

}
