import {Component, OnInit} from '@angular/core';
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
import {isEmpty} from 'lodash';
import {QuanLyDanhSachHangHongHocService} from 'src/app/services/quanLyDanhSachHangHongHoc.service';
import {cloneDeep} from 'lodash';
import * as dayjs from 'dayjs';
import {
  DialogDanhSachHangHoaComponent
} from "../../../../../components/dialog/dialog-danh-sach-hang-hoa/dialog-danh-sach-hang-hoa.component";
import {NzModalService} from "ng-zorro-antd/modal";


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
      await this.search(),
      await this.loaiVTHHGetAll(),
      await this.loadDanhSachChiCuc(),
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
      this.dataTable = [...res.data.content]
      this.totalRecord = res.data.totalElements;
      this.dataTableAll = cloneDeep(this.dataTable)
    } else {
      this.dataTable = [];
      this.totalRecord = 0;
      this.notification.error(MESSAGE.ERROR, res.msg)
    }
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
  }

  xoa() {
  }

  themMoi() {
    this.isAddNew = true;
  }

  onAllChecked(checked) {
    this.dataTable.forEach(({id}) => this.updateCheckedSet(id, checked));
    this.refreshCheckedStatus();
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
          const res = await this.quanLyDanhSachHangHongHocService.deteleData(id);
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

