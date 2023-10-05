import {Component, EventEmitter, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {PAGE_SIZE_DEFAULT} from 'src/app/constants/config';
import {UserLogin} from 'src/app/models/userlogin';
import {DanhMucService} from 'src/app/services/danhmuc.service';
import {DonviService} from 'src/app/services/donvi.service';
import {UserService} from 'src/app/services/user.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {MESSAGE} from 'src/app/constants/message';
import {DANH_MUC_LEVEL} from 'src/app/pages/luu-kho/luu-kho.constant';
import { saveAs } from 'file-saver';
import {QuanLyDanhSachHangHongHocService} from 'src/app/services/quanLyDanhSachHangHongHoc.service';
import {cloneDeep} from 'lodash';
import {NzModalService} from "ng-zorro-antd/modal";
import {Globals} from "../../../../../shared/globals";
import {STATUS} from "../../../../../constants/status";


@Component({
  selector: 'app-hang-hong-hoc-giam-chat-luong',
  templateUrl: './hang-hong-hoc-giam-chat-luong.component.html',
  styleUrls: ['./hang-hong-hoc-giam-chat-luong.component.scss'],
})
export class HangHongHocGiamChatLuongComponent implements OnInit {
  userInfo: UserLogin;
  detail: any = {};
  isAddNew = false;

  formData: FormGroup;

  allChecked = false;
  indeterminate = false;


  dsTong;
  dsDonVi = [];
  dsDonViDataSource = [];
  dsHangHoa = [];
  dsLoaiHangHoa = [];
  dsLoaiHangHoaDataSource = [];

  searchInTable: any = {
    maDanhSach: null,
    donVi: null,
    ngayTao: new Date(),
    trangThai: null,
  };
  filterTable: any = {
    maDS: [null],
    tenDVi: [null],
    ngayTao: [null],
    trangThaiXL: [null],
  }

  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 10;

  setOfCheckedId = new Set<number>();
  dataTable: any[] = [];
  dataTableAll: any[] = [];
  danhSachChiCuc: any[] = [];
  listLoaiHangHoa: any[] = [];
  listChungLoaiHangHoa: any[] = [];
  idSelected: number;
   isViewDetail: boolean;
  getCount = new EventEmitter<any>();

  constructor(
    private readonly fb: FormBuilder,
    public userService: UserService,
    private readonly donviService: DonviService,
    private readonly danhMucService: DanhMucService,
    private readonly spinner: NgxSpinnerService,
    private modal: NzModalService,
    private donViService: DonviService,
    private readonly notification: NzNotificationService,
    private quanLyDanhSachHangHongHocService: QuanLyDanhSachHangHongHocService,
    public globals: Globals,
  ) {
    this.formData = this.fb.group({
      maDvi: [null],
      loaiVthh: [null],
      cloaiVthh: [null],
      ngayDeXuat: [null],
      tenLoaiVthh: [null],
      tenCloaiVthh: [null],
    });
  }


  async ngOnInit() {
      this.spinner.show();
    await Promise.all([
      this.userInfo = this.userService.getUserLogin(),
      await this.loaiVTHHGetAll(),
      await this.loadDanhSachChiCuc(),
      await this.search(),
    ])
   this.spinner.hide()
  }

  async changeLoaiHangHoa(id: any) {
    if (id && id > 0) {
      let loaiHangHoa = this.listLoaiHangHoa.filter(item => item.ma === id);
      this.listChungLoaiHangHoa = loaiHangHoa[0].child;
    }
  }

  async loadDanhSachChiCuc() {
    if (!this.userService.isChiCuc()) {
      const body = {
        maDviCha: this.userInfo.MA_DVI,
        trangThai: '01',
      };
      const dsTong = await this.donViService.layDonViTheoCapDo(body);
      this.danhSachChiCuc = dsTong[DANH_MUC_LEVEL.CHI_CUC];
    }
  }

  async search() {
    this.spinner.show();
    let body = {
      ngayDeXuatTu: this.formData.value.ngayDeXuat ? this.formData.value.ngayDeXuat[0] : null,
      ngayDeXuatDen: this.formData.value.ngayDeXuat ?  this.formData.value.ngayDeXuat[1] : null,
      loaiVthh: this.formData.value.loaiVthh,
      cloaiVthh: this.formData.value.cloaiVthh,
      maDvi : this.userInfo.MA_DVI
    };
    let res = await this.quanLyDanhSachHangHongHocService.search(body)
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

  async loaiVTHHGetAll() {
    try {
      await this.danhMucService.loadDanhMucHangHoa().subscribe((hangHoa) => {
        if (hangHoa.msg == MESSAGE.SUCCESS) {
          hangHoa.data.forEach((item) => {
            if (item.cap === "1" && item.ma != '01') {
              this.listLoaiHangHoa = [...this.listLoaiHangHoa, item];
            } else {
              this.listLoaiHangHoa = [...this.listLoaiHangHoa, ...item.child];
            }
          })
        }
      })
    } catch (error) {
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async clearFilter() {
    this.formData.reset();
    await this.search()
  }

  exportData() {
    if (this.totalRecord > 0) {
      this.spinner.show();
      try {
        let body = {
          ngayDeXuatTu: this.formData.value.ngayDeXuat ? this.formData.value.ngayDeXuat[0] : null,
          ngayDeXuatDen: this.formData.value.ngayDeXuat ?  this.formData.value.ngayDeXuat[1] : null,
          loaiVthh: this.formData.value.loaiVthh,
          cloaiVthh: this.formData.value.cloaiVthh,
          maDvi : this.userInfo.MA_DVI
        };
        this.quanLyDanhSachHangHongHocService
          .export(body)
          .subscribe((blob) =>
            saveAs(blob, 'danh-sach-hang-hong-hoc.xlsx'),
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

  xoa() {
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
            let res = await this.quanLyDanhSachHangHongHocService.deleteMuti({ ids: dataDelete });
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
      });
    }
    else {
      this.notification.error(MESSAGE.ERROR, "Không có dữ liệu phù hợp để xóa.");
    }
  }

  themMoi() {
    this.isAddNew = true;
  }

  onAllChecked(checked) {
    this.dataTable.forEach(({id}) => this.updateCheckedSet(id, checked));
    this.refreshCheckedStatus();
  }

  updateAllChecked(): void {
    this.indeterminate = false;
    if (this.allChecked) {
      if (this.dataTable && this.dataTable.length > 0) {
        this.dataTable.forEach((item) => {
          if (item.trangThai == STATUS.CHUA_TONG_HOP) {
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

  updateCheckedSet(id: number, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }

  refreshCheckedStatus(): void {
    this.allChecked = this.dataTable.every(({id}) =>
      this.setOfCheckedId.has(id),
    );
    this.indeterminate =
      this.dataTable.some(({id}) => this.setOfCheckedId.has(id)) &&
      !this.allChecked;
  }

  changePageIndex(event) {
  }

  changePageSize(event) {
  }

  viewDetail(id: number, isView: boolean) {
    this.idSelected = id;
    this.isAddNew = true;
    this.isViewDetail = isView ?? false;
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
          let body = {
            "id": id,
            "ids": [
              0
            ]
          }
          const res = await this.quanLyDanhSachHangHongHocService.delete(body);
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


  onItemChecked(id: number, checked) {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }

  onClose() {
    this.isAddNew = false;
    this.search()
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
}

