import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {PAGE_SIZE_DEFAULT} from 'src/app/constants/config';
import {UserLogin} from 'src/app/models/userlogin';
import {UserService} from 'src/app/services/user.service';
import {isEmpty} from 'lodash';
import {DonviService} from 'src/app/services/donvi.service';
import {DANH_MUC_LEVEL} from '../../../luu-kho.constant';
import {DanhMucService} from 'src/app/services/danhmuc.service';
import {MESSAGE} from 'src/app/constants/message';
import {NgxSpinnerService} from 'ngx-spinner';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {QuanLyChatLuongLuuKhoService} from 'src/app/services/quanLyChatLuongLuuKho.service';
import {cloneDeep} from 'lodash';
import {NzModalService} from 'ng-zorro-antd/modal';
import {saveAs} from 'file-saver';
import {STATUS} from "../../../../../constants/status";

@Component({
  selector: 'app-hang-thuoc-dien-thanh-ly',
  templateUrl: './hang-thuoc-dien-thanh-ly.component.html',
  styleUrls: ['./hang-thuoc-dien-thanh-ly.component.scss'],
})
export class HangThuocDienThanhLyComponent implements OnInit {
  userInfo: UserLogin;
  detail: any = {};
  formData: FormGroup;
  allChecked = false;
  indeterminate = false;
  dsTong;
  STATUS = STATUS

  dsDonVi = [];
  dsDonViDataSource = [];
  dsHangHoa = [];
  dsLoaiHangHoa = [];
  dsLoaiHangHoaDataSource = [];

  listLoaiHangHoa: any[] = [];
  listChungLoaiHangHoa: any[] = [];

  idSelected: number;

  searchInTable: any = {
    maDanhSach: '',
    tenDvi: '',
    ngayTao: '',
    trangThaiCuc: '',
    trangThaiChiCuc: '',
  };
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 10;
  rangeTemplate: number = 0;
  setOfCheckedId = new Set<number>();
  dataTable: any[] = [];
  dataTableAll: any[] = [];

  dataExample: IHangThanhLy[] = [];
  dataDetail: any;
  isUpdate: boolean = false;
  editList: boolean = false;
  isAddNew = false;
  isShowUpdate: boolean = true;
  isView: boolean;

  constructor(
    private readonly fb: FormBuilder,
    public userService: UserService,
    private readonly donviService: DonviService,
    private readonly danhMucService: DanhMucService,
    private readonly quanlyChatLuongService: QuanLyChatLuongLuuKhoService,
    private readonly spinner: NgxSpinnerService,
    private readonly notification: NzNotificationService,
    private modal: NzModalService,
  ) {
  }

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

  async initData() {
    this.userInfo = this.userService.getUserLogin();
    if (this.userInfo.sub == 'cuc') {
      this.isShowUpdate = false;
    }
    this.detail.maDvi = this.userInfo.MA_DVI;
    this.detail.tenDvi = this.userInfo.TEN_DVI;
    await this.traCuuDsHangThanhLy();
    await Promise.all([this.loaiVTHHGetAll()]);
  }

  async traCuuDsHangThanhLy() {
    this.spinner.show();
    let body = this.formData.value;
    body.tuNgay = this.formData.value.ngayTao ? this.formData.value.ngayTao[0] : null;
    body.denNgay = this.formData.value.ngayTao ? this.formData.value.ngayTao[1] : null;
    body.maDvi = this.userInfo.MA_DVI
    const res = await this.quanlyChatLuongService.traCuuHTL(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.dataTable = data.content;
      this.dataTableAll = cloneDeep(this.dataTable);
      this.totalRecord = data.totalElements;
    } else {
      this.dataTable = [];
      this.totalRecord = 0;
      this.notification.error(MESSAGE.ERROR, res.msg);
      this.spinner.hide()
    }
    this.spinner.hide()
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

  async changeLoaiHangHoa(id: any) {
    if (id && id > 0) {
      let loaiHangHoa = this.listLoaiHangHoa.filter(item => item.ma === id);
      this.listChungLoaiHangHoa = loaiHangHoa[0].child;
    }

  }

  onChangeAutoComplete(e: Event) {
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

  onChangeLoaiHHAutoComplete(e: Event) {
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

  exportData() {
    this.spinner.show()
    try {
      let body = this.formData.value
      if (this.formData.value.ngayTao) {
        body.tuNgay = this.formData.value.ngayTao[0]
        body.denNgay = this.formData.value.ngayTao[1]
      }
      body.maDvi = this.userInfo.MA_DVI;
      this.quanlyChatLuongService.exportList(body).subscribe((blob) => {
        saveAs(blob, 'danh-sach-so-kho.xlsx')
      });
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  xoa() {
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

          const body = {"ids": []}
          this.setOfCheckedId.forEach(item => {
            body.ids.push(item)
          })
          this.quanlyChatLuongService.xoalstds(body).then(async (res) => {
            if (res.msg == MESSAGE.SUCCESS) {
              this.notification.success(
                MESSAGE.SUCCESS,
                MESSAGE.DELETE_SUCCESS,
              );
              this.traCuuDsHangThanhLy()
            } else {
              this.notification.error(MESSAGE.ERROR, res.msg);
            }
            await this.traCuuDsHangThanhLy();
            this.spinner.hide();
          });
        } catch (e) {
          console.log('error: ', e)
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      },
    });
  }

  inDanhSach() {
  }

  themMoi() {
    this.isAddNew = true;
    this.editList = false;
    this.isUpdate = false;
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

  async clearFilter() {
    this.formData.reset();
    await this.traCuuDsHangThanhLy();
  }

  async changePageIndex(event) {
    this.spinner.show();
    try {
      this.page = event;
      await this.traCuuDsHangThanhLy();
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
        await this.traCuuDsHangThanhLy();
      }
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  viewDetail(id: number, isView: boolean) {
    this.isAddNew = true;
    this.idSelected = id;
    this.isView = isView
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
          this.quanlyChatLuongService.xoads(id).then(async (res) => {
            if (res.msg == MESSAGE.SUCCESS) {
              this.notification.success(
                MESSAGE.SUCCESS,
                MESSAGE.DELETE_SUCCESS,
              );
              this.traCuuDsHangThanhLy()
            } else {
              this.notification.error(MESSAGE.ERROR, res.msg);
            }
            await this.traCuuDsHangThanhLy();
            this.spinner.hide();
          });
        } catch (e) {
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
    this.traCuuDsHangThanhLy();
  }

  filterInTable(key: string, value: string) {
    if (value && value != '') {
      this.dataTable = [];
      let temp = [];
      if (this.dataTableAll && this.dataTableAll.length > 0) {
        if (key === 'ngayTao') {
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
    } else {
      this.dataTable = cloneDeep(this.dataTableAll);
    }
  }

  clearFilterTable() {
    this.searchInTable = {
      maDanhSach: null,
      donVi: null,
      ngayTao: null,
      trangThai: null,
    }
  }
}

interface ITrangThai {
  id: number;
  giaTri: string;
}

interface IHangThanhLy {
  id: number;
  maDanhSach: string;
  idDonVi: number;
  tenDonVi: string;
  ngayTao: Date;
  trangThai: string;
}

