import { saveAs } from 'file-saver';
import { cloneDeep } from 'lodash';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import dayjs from 'dayjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { UserLogin } from 'src/app/models/userlogin';
import { DonviService } from 'src/app/services/donvi.service';
import { QuanLyBienBanLayMauXuatService } from 'src/app/services/qlnv-hang/xuat-hang/kiem-tra-chat-luong/quanLyBienBanLayMauXuat';
import { UserService } from 'src/app/services/user.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Globals } from 'src/app/shared/globals';
import { isEmpty } from 'lodash';
import { DANH_MUC_LEVEL } from 'src/app/pages/luu-kho/luu-kho.constant';

@Component({
  selector: 'quan-ly-bien-ban-lay-mau',
  templateUrl: './quan-ly-bien-ban-lay-mau.component.html',
  styleUrls: ['./quan-ly-bien-ban-lay-mau.component.scss'],
})
export class QuanLyBienBanLayMauComponent implements OnInit {
  @Input() typeVthh: string;

  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 0;
  dataTable: any[] = [];
  dataTableAll: any[] = [];

  loaiVthh: string;

  userInfo: UserLogin;
  detail: any = {};
  dsDonVi: any = [];

  dsTong;
  dsCuc = [];
  dsChiCuc = [];
  dsDiemKho = [];
  dsNhaKho = [];
  dsNganKho = [];
  dsLoKho = [];

  formData: FormGroup;

  isDetail: boolean = false;
  selectedId: number = 0;
  isView: boolean;
  isTatCa: boolean = false;

  allChecked = false;
  indeterminate = false;

  filterTable: any = {
    soBienBan: '',
    ngayLayMau: '',
    tenDiemKho: '',
    tenNhaKho: '',
    tenNganKho: '',
    tenLoKho: '',
    tenTrangThai: '',
  };

  constructor(
    private spinner: NgxSpinnerService,
    private bienBanLayMauXuatService: QuanLyBienBanLayMauXuatService,
    private notification: NzNotificationService,
    private modal: NzModalService,
    public userService: UserService,
    private fb: FormBuilder,
    private donviService: DonviService,
    public globals: Globals,
  ) {}

  async ngOnInit() {
    this.spinner.show();
    this.initForm();
    try {
      if (!this.typeVthh || this.typeVthh == '') {
        this.isTatCa = true;
      }
      await this.initData();
      Promise.all([, this.search()]);
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  initForm(): void {
    this.formData = this.fb.group({
      soBienBan: [null],
      ngayLayMau: [null],
      maDiemKho: [null],
      maNhaKho: [null],
      maNganKho: [null],
      maNganLo: [null],
    });
  }

  async initData() {
    this.userInfo = this.userService.getUserLogin();
    this.detail.maDvi = this.userInfo.MA_DVI;
    this.detail.tenDvi = this.userInfo.TEN_DVI;
    this.detail.capDvi = this.userInfo.CAP_DVI;
    await this.loadDsTong();
  }
  async loadDsTong() {
    const body = {
      maDviCha: this.detail.maDvi,
      trangThai: '01',
    };
    const dsTong = await this.donviService.layDonViTheoCapDo(body);
    if (!isEmpty(dsTong)) {
      this.dsTong = dsTong;
      if (this.userInfo.CAP_DVI === this.globals.prop.CUC) {
        this.dsDonVi = dsTong[DANH_MUC_LEVEL.CUC];
      }
      if (this.userInfo.CAP_DVI === this.globals.prop.CHICUC) {
        this.dsDonVi = dsTong[DANH_MUC_LEVEL.CHI_CUC];
      }
      const chiCuc = this.dsDonVi[0];
      if (chiCuc) {
        const result = {
          ...this.donviService.layDsPhanTuCon(this.dsTong, chiCuc),
        };
        this.dsDiemKho = result[DANH_MUC_LEVEL.DIEM_KHO];
      } else {
        this.dsDiemKho = [];
      }
    }
  }

  onChangeDiemKho(id) {
    const dsDiemKho = this.dsDiemKho.find((item) => item.maDvi === id);
    this.formData.get('maNhaKho').setValue(null);
    this.formData.get('maNganKho').setValue(null);
    this.formData.get('maNganLo').setValue(null);
    if (dsDiemKho) {
      const result = {
        ...this.donviService.layDsPhanTuCon(this.dsTong, dsDiemKho),
      };
      this.dsNhaKho = result[DANH_MUC_LEVEL.NHA_KHO];
    } else {
      this.dsNhaKho = [];
    }
  }
  onChangeNhaKho(id) {
    const nhaKho = this.dsNhaKho.find((item) => item.maDvi === id);
    this.formData.get('maNganKho').setValue(null);
    this.formData.get('maNganLo').setValue(null);
    if (nhaKho) {
      const result = {
        ...this.donviService.layDsPhanTuCon(this.dsTong, nhaKho),
      };
      this.dsNganKho = result[DANH_MUC_LEVEL.NGAN_KHO];
    } else {
      this.dsNganKho = [];
    }
  }

  onChangeNganKho(id) {
    const nganKho = this.dsNganKho.find((item) => item.maDvi === id);
    this.formData.get('maNganLo').setValue(null);
    if (nganKho) {
      const result = {
        ...this.donviService.layDsPhanTuCon(this.dsTong, nganKho),
      };
      this.dsLoKho = result[DANH_MUC_LEVEL.NGAN_LO];
    } else {
      this.dsLoKho = [];
    }
  }

  updateAllChecked(): void {
    this.indeterminate = false;
    if (this.allChecked) {
      if (this.dataTable && this.dataTable.length > 0) {
        this.dataTable.forEach((item) => {
          if (item.trangThaiId == '00') {
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
      soBienBan: this.formData.value.soBienBan
        ? this.formData.value.soBienBan
        : null,
      maDvis: null,
      maDiemKho: this.formData.value.maDiemKho
        ? this.formData.value.maDiemKho
        : null,
      maNhaKho: this.formData.value.maNhaKho
        ? this.formData.value.maNhaKho
        : null,
      maNganKho: this.formData.value.maNganKho
        ? this.formData.value.maNganKho
        : null,
      maNganLo: this.formData.value.maNganLo
        ? this.formData.value.maNganLo
        : null,
      ngayLayMauDenNgay: this.formData.value.ngayLayMau
        ? dayjs(this.formData.value.ngayLayMau[0]).format('DD/MM/YYYY')
        : null,
      ngayLayMauTuNgay: this.formData.value.ngayLayMau
        ? dayjs(this.formData.value.ngayLayMau[1]).format('DD/MM/YYYY')
        : null,
      pageNumber: this.page,
      pageSize: this.pageSize,
    };
    try {
      let res = await this.bienBanLayMauXuatService.search(body);
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
    } catch (error) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      this.spinner.hide();
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

  clearFilter() {
    this.formData.reset();
    this.filterTable = {
      soBienBan: '',
      ngayLayMau: '',
      tenDiemKho: '',
      tenNhaKho: '',
      tenNganKho: '',
      tenLoKho: '',
      tenTrangThai: '',
    };
    this.search();
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
          this.bienBanLayMauXuatService.delete(item.id).then((res) => {
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

  export() {
    if (this.totalRecord > 0) {
      this.spinner.show();
      try {
        let body = {
          soBienBan: this.formData.value.soBienBan
            ? this.formData.value.soBienBan
            : null,
          capDvis: [this.detail.capDvi],
          maDvis: [this.detail.maDvi],
          maDiemKho: this.formData.value.maDiemKho
            ? this.formData.value.maDiemKho
            : null,
          maNhaKho: this.formData.value.maNhaKho
            ? this.formData.value.maNhaKho
            : null,
          maNganKho: this.formData.value.maNganKho
            ? this.formData.value.maNganKho
            : null,
          maNganLo: this.formData.value.maNganLo
            ? this.formData.value.maNganLo
            : null,
          ngayLayMauDenNgay: this.formData.value.ngayLayMau
            ? dayjs(this.formData.value.ngayLayMau[0]).format('DD/MM/YYYY')
            : null,
          ngayLayMauTuNgay: this.formData.value.ngayLayMau
            ? dayjs(this.formData.value.ngayLayMau[1]).format('DD/MM/YYYY')
            : null,
        };
        this.bienBanLayMauXuatService
          .exportList(body)
          .subscribe((blob) =>
            saveAs(blob, 'danh-sach-xuat-bien-ban-lay-mau.xlsx'),
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
            let res = await this.bienBanLayMauXuatService.deleteMultiple({
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

  redirectToChiTiet(isView: boolean, id: number) {
    this.selectedId = id;
    this.isDetail = true;
    this.isView = isView;
  }

  async showList() {
    this.isDetail = false;
    await this.search();
  }
}
