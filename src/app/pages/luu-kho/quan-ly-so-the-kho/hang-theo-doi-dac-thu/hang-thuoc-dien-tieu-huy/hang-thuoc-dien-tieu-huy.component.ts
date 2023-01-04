import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { UserLogin } from 'src/app/models/userlogin';
import { UserService } from 'src/app/services/user.service';
import { isEmpty } from 'lodash';
import { DonviService } from 'src/app/services/donvi.service';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { DANH_MUC_LEVEL } from '../../../luu-kho.constant';
import { MESSAGE } from 'src/app/constants/message';
import { QuanLyChatLuongLuuKhoService } from 'src/app/services/quanLyChatLuongLuuKho.service';
import { cloneDeep } from 'lodash';
import { NzModalService } from 'ng-zorro-antd/modal';
import { saveAs } from 'file-saver';
import { Globals } from 'src/app/shared/globals';
@Component({
  selector: 'app-hang-thuoc-dien-tieu-huy',
  templateUrl: './hang-thuoc-dien-tieu-huy.component.html',
  styleUrls: ['./hang-thuoc-dien-tieu-huy.component.scss'],
})
export class HangThuocDienTieuHuyComponent implements OnInit {
  userInfo: UserLogin;
  detail: any = {};
  isAddNew = false;
  formData: FormGroup;
  allChecked = false;
  indeterminate = false;
  filterDate = new Date();
  dsTrangThai: ITrangThai[] = [
    // fake
    { id: 1, giaTri: 'Đang xử lý' },
    { id: 2, giaTri: 'Chờ duyệt' },
    { id: 3, giaTri: 'Đã duyệt' },
    { id: 4, giaTri: 'Chưa xử lý' },
  ];
  dsTong;
  dsDonVi = [];
  dsDonViDataSource = [];
  dsHangHoa = [];
  dsLoaiHangHoa = [];
  dsLoaiHangHoaDataSource = [];

  listLoaiHangHoa: any[] = [];
  listChungLoaiHangHoa: any[] = [];

  searchInTable: any = {
    maDanhSach: '',
    tenDonVi: '',
    ngayTao: '',
    trangThaiXuLy: '',
  };

  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 10;
  setOfCheckedId = new Set<number>();
  dataTable: any[] = [];
  rangeTemplate: number = 0;
  dataTableAll: any[] = [];

  dataExample: IHangTieuHuy[] = [];
  dataDetail: any;
  isUpdate: boolean = false;
  editList: boolean = false;

  constructor(
    private readonly fb: FormBuilder,
    public userService: UserService,
    private readonly donviService: DonviService,
    private readonly danhMucService: DanhMucService,
    private readonly spinner: NgxSpinnerService,
    private readonly notification: NzNotificationService,
    private readonly quanlyChatLuongService: QuanLyChatLuongLuuKhoService,
    private modal: NzModalService,
    private globals: Globals,
  ) { }

  async ngOnInit(): Promise<void> {
    try {
      this.spinner.show();
      this.initForm();
      await this.initData();
    } catch (error) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      this.spinner.hide();
    }
  }

  initForm(): void {
    this.formData = this.fb.group({
      "maDvi": [null],
      "tenDVi": [null],
      "loaiHang": [null],
      "maChungLoaiHang": [null],
      "ngayTao": [[]]
    });
  }

  async traCuuDsHangTieuHuy() {
    const body = {
      denNgay: this.formData.controls.ngayTao.value ? this.formData.controls.ngayTao.value[1] : '',
      tuNgay: this.formData.controls.ngayTao?.value ? this.formData.controls.ngayTao.value[0] : '',
      maDonVi: this.formData.controls.maDvi?.value ? this.formData.controls.maDvi.value : null,
      maVTHH: this.formData.value.maChungLoaiHang ?? this.formData.value.loaiHang,
      limit: this.pageSize,
      page: this.page - 1,
    }
    const res = await this.quanlyChatLuongService.hangTieuHuytraCuu(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.totalRecord = res.data.totalElements;
      this.rangeTemplate = res.data.totalPages;
      this.dataTable = res.data?.content;
      console.log(this.dataTable)
      this.dataTableAll = cloneDeep(this.dataTable);
      this.convertTrangThai();
    }
  }

  async initData() {
    this.userInfo = this.userService.getUserLogin();
    this.detail.maDvi = this.userInfo.MA_DVI;
    this.detail.tenDvi = this.userInfo.TEN_DVI;
    await Promise.all([this.loadDsTong(), this.loaiVTHHGetAll()]);
    await this.traCuuDsHangTieuHuy();
  }

  convertTrangThai() {
    this.dataTable.forEach((item, idx) => {
      if (item.trangThaiXuLy === this.globals.prop.NHAP_CHUA_TONG_HOP) {
        this.dataTable[idx].trangThaiXuLy = 'Chưa xử lý';
      }
    })
  }

  async loadDsTong() {
    const body = {
      maDviCha: this.detail.maDvi,
      trangThai: '01',
    };

    const dsTong = await this.donviService.layDonViTheoCapDo(body);
    if (!isEmpty(dsTong)) {
      this.dsTong = dsTong;
      this.dsDonVi = dsTong[DANH_MUC_LEVEL.CHI_CUC];
      this.dsDonViDataSource = dsTong[DANH_MUC_LEVEL.CHI_CUC].map(
        (item) => item.tenDvi,
      );
    }
  }

  async loaiVTHHGetAll() {
    try {
      await this.danhMucService.loadDanhMucHangHoa().subscribe((hangHoa) => {
        if (hangHoa.msg == MESSAGE.SUCCESS) {
          hangHoa.data.forEach((item) => {
            if (item.cap === "1" && item.ma != '01') {
              this.listLoaiHangHoa = [...this.listLoaiHangHoa, item];
            }
            else {
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

  async changeLoaiHangHoa(id: any) {
    if (id && id > 0) {
      let loaiHangHoa = this.listLoaiHangHoa.filter(item => item.ma === id);
      this.listChungLoaiHangHoa = loaiHangHoa[0].child;
    }

  }

  onChangeAutoComplete(e) {
    const value = (e.target as HTMLInputElement).value;
    if (value) {
      this.dsDonViDataSource = this.dsDonVi
        .filter((item) =>
          item?.tenDvi?.toLowerCase()?.includes(value.toLowerCase()),
        )
        .map((item) => item.tenDvi);
    } else {
      this.dsDonViDataSource = this.dsDonVi.map((item) => item.tenDvi);
    }
  }

  onChangeLoaiHHAutoComplete(e) {
    const value = (e.target as HTMLInputElement).value;
    if (value) {
      this.dsLoaiHangHoaDataSource = this.dsLoaiHangHoa
        .filter((item) =>
          item?.giaTri?.toLowerCase()?.includes(value.toLowerCase()),
        )
        .map((item) => item.giaTri);
    } else {
      this.dsLoaiHangHoaDataSource = this.dsLoaiHangHoa.map(
        (item) => item.giaTri,
      );
    }
  }

  clearFilter() {
    this.formData.reset();
  }

  exportData() {
    if (this.totalRecord > 0) {
      this.spinner.show();
      try {
        const body = {
          denNgay: this.formData.controls.ngayTao.value ? this.formData.controls.ngayTao.value[1] : '',
          tuNgay: this.formData.controls.ngayTao?.value ? this.formData.controls.ngayTao.value[0] : '',
          maDonVi: this.formData.controls.maDvi?.value ? this.formData.controls.maDvi.value : null,
          maVTHH: this.formData.value.maChungLoaiHang ?? this.formData.value.loaiHang,
        }
        this.quanlyChatLuongService
          .hangTieuHuyExportList(body)
          .subscribe((blob) =>
            saveAs(blob, 'danh-sach-hang-tieu-huy.xlsx'),
          );
        this.spinner.hide();
      } catch (e) {
        console.log('error: ', e);
        this.spinner.hide();
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
    }
  }

  xoa() {
    // this.setOfCheckedId
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

          const body = { "ids": [] }
          this.setOfCheckedId.forEach(item => {
            body.ids.push(item)
          })
          this.quanlyChatLuongService.hangTieuHuyXoalstds(body).then(async (res) => {
            if (res.msg == MESSAGE.SUCCESS) {
              this.notification.success(
                MESSAGE.SUCCESS,
                MESSAGE.DELETE_SUCCESS,
              );
              this.traCuuDsHangTieuHuy()
            } else {
              this.notification.error(MESSAGE.ERROR, res.msg);
            }
            await this.traCuuDsHangTieuHuy();
            this.spinner.hide();
          });
        }
        catch (e) {
          console.log('error: ', e)
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      },
    });
  }

  inDanhSach() { }

  themMoi() {
    this.isAddNew = true;
    this.editList = false;
    this.isUpdate = false;
  }

  onAllChecked(checked) {
    this.dataTable.forEach(({ id }) => this.updateCheckedSet(id, checked));
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
    this.allChecked = this.dataTable.every(({ id }) =>
      this.setOfCheckedId.has(id),
    );
    this.indeterminate =
      this.dataTable.some(({ id }) => this.setOfCheckedId.has(id)) &&
      !this.allChecked;
  }

  onChangeFilterDate(event) { }

  async changePageIndex(event) {
    this.spinner.show();
    try {
      this.page = event;
      await this.traCuuDsHangTieuHuy();
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
      await this.traCuuDsHangTieuHuy();
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  viewDetail(id: number, isUpdate: boolean) {
    this.quanlyChatLuongService.hangTieuHuyDetail(id).then((res) => {
      if (res.msg == MESSAGE.SUCCESS) {
        this.dataDetail = res.data;
        this.isUpdate = true;
        this.isAddNew = true;
        this.editList = isUpdate;
      }
    });
  }

  async xoaItem(id: number) {
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
          this.quanlyChatLuongService.hangTieuHuyXoads(id).then(async (res) => {
            if (res.msg == MESSAGE.SUCCESS) {
              this.notification.success(
                MESSAGE.SUCCESS,
                MESSAGE.DELETE_SUCCESS,
              );
              this.traCuuDsHangTieuHuy()
            } else {
              this.notification.error(MESSAGE.ERROR, res.msg);
            }
            await this.traCuuDsHangTieuHuy();
            this.spinner.hide();
          });
        }
        catch (e) {
          console.log('error: ', e)
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
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
    this.traCuuDsHangTieuHuy();
  }

  filterInTable(key: string, value: string) {
    if (value && value != '') {
      this.dataTable = [];
      let temp = [];
      if (this.dataTableAll && this.dataTableAll.length > 0) {
        if (key == 'trangThaiXuLy') {
          this.dsTrangThai.map(item => {
            if (item.id.toString() == value) {
              value = item.giaTri;
            }
          })
        } else if (key === 'ngayTao') {
          const date = new Date(value);
          value = date.getFullYear() + "-" + ((date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)) + "-" + date.getDate();
        } else if (key === 'tenDonvi') {
          value = value.replace('Chi cục Dự trữ Nhà nước ', '');
        }
        this.dataTableAll.forEach((item) => {
          if (item[key] && item[key].toString().toLowerCase().indexOf(value.toString().toLowerCase()) != -1) {
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
    this.searchInTable = {
      maDanhSach: '',
      tenDonVi: '',
      ngayTao: '',
      trangThaiXuLy: '',
    }
  }
}

interface ITrangThai {
  id: number;
  giaTri: string;
}

interface IHangTieuHuy {
  id: number;
  maDanhSach: string;
  idDonVi: number;
  tenDonVi: string;
  ngayTao: Date;
  trangThai: string;
}
