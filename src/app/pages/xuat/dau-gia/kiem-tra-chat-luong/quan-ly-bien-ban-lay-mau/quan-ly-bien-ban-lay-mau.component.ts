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

  ) { }

  async ngOnInit() {
    this.spinner.show();
    this.initForm();
    try {
      if (!this.typeVthh || this.typeVthh == '') {
        this.isTatCa = true;
      }

      Promise.all([this.initData(),])
      // await this.search();
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
      diemKho: [null],
      nhaKho: [null],
      nganKho: [null],
      loKho: [null],
    })
  }

  async initData() {
    this.userInfo = this.userService.getUserLogin();
    this.detail.maDvi = this.userInfo.MA_DVI;
    this.detail.tenDvi = this.userInfo.TEN_DVI;
    await this.loadDsTong()

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
      const chiCuc = this.dsDonVi[0]
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
    this.formData.get('nhaKho').setValue(null);
    this.formData.get('nganKho').setValue(null);
    this.formData.get('loKho').setValue(null);
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
    this.formData.get('nganKho').setValue(null);
    this.formData.get('loKho').setValue(null);
    if (nhaKho) {
      const result = { ...this.donviService.layDsPhanTuCon(this.dsTong, nhaKho), };
      this.dsNganKho = result[DANH_MUC_LEVEL.NGAN_KHO];
    } else {
      this.dsNganKho = [];
    }
  }

  onChangeNganKho(id) {
    const nganKho = this.dsNganKho.find((item) => item.maDvi === id);
    this.formData.get('loKho').setValue(null);
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

  async search() {
    this.spinner.show();
    console.log(this.formData.value);
    let body = {
      // "capDvis": '3',
      // "maDvis": this.userInfo.MA_DVI,
      // "maVatTuCha": this.isTatCa ? null : this.typeVthh,
      // soQuyetDinhNhap: this.searchFilter.soQuyetDinhNhap ?? null,
      // soBienBan: this.searchFilter.soBienBan ?? null,
      // ngayLayMauTu: this.searchFilter.ngayLayMau ? dayjs(this.searchFilter.ngayLayMau[0]).format('YYYY/MM/DD') : null,
      // ngayLayMauDen: this.searchFilter.ngayLayMau ? dayjs(this.searchFilter.ngayLayMau[1]).format('YYYY/MM/DD') : null,
      // pageNumber: this.page,
      // pageSize: this.pageSize,
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

    this.formData.reset()
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

  redirectToChiTiet(isView: boolean, id: number) {
    this.selectedId = id;
    this.isDetail = true;
    this.isView = isView;
  }

  async showList() {
    this.isDetail = false;
    await this.search()
  }

  export() {
    if (this.totalRecord > 0) {
      this.spinner.show();
      try {
        let body = {
          // "maDvi": this.userInfo.MA_DVI,
          // "maVatTuCha": this.isTatCa ? null : this.typeVthh,
          // "ngayLayMauDen": this.searchFilter.ngayLayMau ? dayjs(this.searchFilter.ngayLayMau[1]).format('YYYY/MM/DD') : null,
          // "ngayLayMauTu": this.searchFilter.ngayLayMau ? dayjs(this.searchFilter.ngayLayMau[0]).format('YYYY/MM/DD') : null,
          // "orderBy": null,
          // "orderDirection": null,
          // "paggingReq": null,
          // "soBienBan": this.searchFilter.soBienBan,
          // "soQuyetDinhNhap": this.searchFilter.soQuyetDinhNhap,
          // "str": null,
          // "trangThai": null
        };
        this.bienBanLayMauXuatService
          .exportList(body)
          .subscribe((blob) =>
            saveAs(blob, 'danh-sach-bien-ban-lay-mau.xlsx'),
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
            let res = await this.bienBanLayMauXuatService.deleteMultiple({ ids: dataDelete });
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

  filterInTable(key: string, value: string | Date) {
    if (value instanceof Date) {
      value = dayjs(value).format('DD-MM-YYYY');
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


  clearFilterTable() {
    this.filterTable = {
      soQuyetDinhNhap: '',
      soBienBan: '',
      ngayLayMau: '',
      soHopDong: '',
      tenDiemKho: '',
      tenNhaKho: '',
      tenNganKho: '',
      tenNganLo: '',
      tenTrangThai: '',
    }
  }
}
