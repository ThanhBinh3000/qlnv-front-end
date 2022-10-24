import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { UserLogin } from 'src/app/models/userlogin';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { DonviService } from 'src/app/services/donvi.service';
import { UserService } from 'src/app/services/user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MESSAGE } from 'src/app/constants/message';
import { DANH_MUC_LEVEL } from 'src/app/pages/luu-kho/luu-kho.constant';
import { isEmpty, cloneDeep } from 'lodash';
import { QuanLyHangBiHongCanBaoHanhService } from 'src/app/services/quanLyHangBiHongCanBaoHanh.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { saveAs } from 'file-saver';
import * as dayjs from 'dayjs';
import { Globals } from 'src/app/shared/globals';

@Component({
  selector: 'app-hang-hong-can-bao-hanh',
  templateUrl: './hang-hong-can-bao-hanh.component.html',
  styleUrls: ['./hang-hong-can-bao-hanh.component.scss'],
})
export class HangHongCanBaoHanhComponent implements OnInit {
  userInfo: UserLogin;
  detail: any = {};
  isAddNew = false;
  formData: FormGroup;
  allChecked = false;
  indeterminate = false;
  filterDate = new Date();

  dsTrangThai: ITrangThai[] = [
    { id: 1, giaTri: 'Chưa xử lý' },
    { id: 2, giaTri: 'Đã tổng hợp' },
  ];

  dsTong;
  dsDonVi = [];

  searchInTable: any = {
    maLoaiHangHoa: null,
    maChungLoaiHangHoa: null,
  };

  listLoaiHangHoa: any[] = [];
  listChungLoaiHangHoa: any[] = [];
  dsLoaiHangHoaDataSource = [];
  dsChungLoaiHangHoaDataSource = [];

  idInput: number;
  isCheck: boolean;


  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 10;
  setOfCheckedId = new Set<number>();
  dataTable: any[] = [];
  dataTableAll: any[] = [];
  getCount = new EventEmitter<any>();

  constructor(
    private readonly fb: FormBuilder,
    public userService: UserService,
    private readonly donviService: DonviService,
    private readonly danhMucService: DanhMucService,
    private readonly spinner: NgxSpinnerService,
    private readonly notification: NzNotificationService,
    private quanLyHangBiHongCanBaoHanhService: QuanLyHangBiHongCanBaoHanhService,
    private modal: NzModalService,
    public globals: Globals,
  ) { }

  async ngOnInit(): Promise<void> {
    try {
      this.spinner.show();
      this.initForm();
      await this.initData();
      await this.loaiVTHHGetAll();
      this.loadDsTong();
      await this.search();
    } catch (error) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      this.spinner.hide();
    }
  }

  // Tạo form search
  initForm(): void {
    this.formData = this.fb.group({
      idDonVi: [null],
      maDonVi: [''],
      maLoaiHang: [''],
      maChungLoaiHangHoa: [''],
      ngayTao: ['', ''],
    });
  }

  // load dữ liệu user login
  async initData() {
    this.userInfo = this.userService.getUserLogin();
    this.detail.maDvi = this.userInfo.MA_DVI;
    this.detail.tenDvi = this.userInfo.TEN_DVI;
  }

  // Tra cứu danh sách
  async search() {
    this.spinner.show();

    if (this.formData.value.maDonVi) {
      this.detail.maDvi = this.formData.value.maDonVi
    }

    const body = {
      "denNgay": this.formData.value.ngayTao[1] === undefined ? "" : dayjs(this.formData.value.ngayTao[1]).format("YYYY-MM-DD"),
      "limit": this.pageSize,
      "maDonVi": this.detail.maDvi,
      // "maChungLoaiHang": this.searchInTable.maChungLoaiHangHoa ? this.searchInTable.maChungLoaiHangHoa : null,
      "maVTHH": this.searchInTable.maChungLoaiHangHoa ? this.searchInTable.maChungLoaiHangHoa : null,
      // "maVTHH": this.searchInTable.maLoaiHangHoa ? this.searchInTable.maLoaiHangHoa : null,
      "orderBy": "",
      "orderType": "",
      "page": this.page - 1,
      "tuNgay": this.formData.value.ngayTao[0] === undefined ? "" : dayjs(this.formData.value.ngayTao[0]).format("YYYY-MM-DD")
    }

    const res = await this.quanLyHangBiHongCanBaoHanhService.tracuu(body);

    if (res.msg = MESSAGE.SUCCESS) {
      this.dataTable = res.data.content;

      if (this.dataTable && this.dataTable.length > 0) {
        this.dataTable.forEach(item => item.checked = false)
      }
      this.dataTableAll = cloneDeep(this.dataTable);
      this.totalRecord = res.data.totalElements;

    } else {
      this.dataTable = [];
      this.totalRecord = 0;
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    this.spinner.hide()
  }

  // Search trong bảng
  filterInTable(key: string, value: string, date: boolean) {
    if (value) {
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
            if (item[key].toString().toLowerCase().indexOf(value.toLowerCase()) != -1) {
              temp.push(item)
            }
          });

        }
      }
      this.dataTable = [...this.dataTable, ...temp];
    }
    else {
      this.dataTable = cloneDeep(this.dataTableAll);
    }
  }

  // Update trạng thái check sang true cho All: khi xóa sẽ sét check
  updateAllChecked(): void {
    this.indeterminate = false;
    if (this.allChecked) {
      if (this.dataTable && this.dataTable.length > 0) {
        this.dataTable.forEach((item) => {
          item.checked = true;
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

  // Update trạng thái check sang true cho Item được chọn
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

  // Xóa nhứng ITem chó checked
  xoa() {
    let dataDelete = [];
    if (this.dataTable && this.dataTable.length > 0) {
      this.dataTable.forEach((item) => {
        if (item.checked) {
          dataDelete.push(item.id)
        }
      })
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
            let res = await this.quanLyHangBiHongCanBaoHanhService.deleteMultiple({ ids: dataDelete });
            if (res.msg == MESSAGE.SUCCESS) {
              this.notification.success(MESSAGE.SUCCESS, MESSAGE.DELETE_SUCCESS);
              await this.search();
              this.indeterminate = false;
              this.allChecked = false;
              this.getCount.emit();
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
      })
    } else {
      this.notification.error(MESSAGE.ERROR, "Không có dữ liệu phù hợp để xóa.");
    }
  }

  // Xóa 1 Item
  xoaItem(id: number) {
    if (id > 0) {
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
            this.quanLyHangBiHongCanBaoHanhService.xoa(id).then((res) => {
              if (res.msg == MESSAGE.SUCCESS) {
                this.notification.success(
                  MESSAGE.SUCCESS,
                  MESSAGE.DELETE_SUCCESS,
                );
                this.search();
                this.getCount.emit();
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
    } else {
      this.notification.error(MESSAGE.ERROR, "Dữ liệu không phù hợp để xóa.");
    }

  }

  // Xuất file excel
  exportData() {
    if (this.totalRecord > 0) {
      this.spinner.show()
      try {
        let body = {
          "denNgay": "",
          "limit": 20,
          "maDonVi": this.detail.maDvi,
          "maDs": "",
          "maVTHH": "",
          "orderBy": "",
          "orderType": "",
          "page": 0,
          "tuNgay": ""
        }
        this.quanLyHangBiHongCanBaoHanhService.exportList(body).subscribe((blob) => {
          saveAs(blob, 'danh-sach-hang-bi-hong-can-bao-hanh.xlsx')
        });
        this.spinner.hide();
      } catch (e) {
        console.log('error: ', e);
        this.spinner.hide();
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
    } else {
      this.notification.error(MESSAGE.ERROR, MESSAGE.DATA_EMPTY)
    }
  }

  // Xóa giá trị search
  async clearFilter() {
    this.formData.patchValue({
      maDonVi: '',
      maLoaiHang: '',
      maChungLoaiHangHoa: '',
      ngayTao: ''
    })

    this.searchInTable.maLoaiHangHoa = null;
    this.searchInTable.maChungLoaiHangHoa = null;
    this.initData();

    await this.search();
  }

  // Hiển thị màn hình thêm mới
  themMoi() {
    this.isAddNew = true;
  }

  // Quay lại page đầu tiên
  async onClose() {
    this.isAddNew = false;
    await this.search();
  }

  // Load loại hàng hóa
  async loaiVTHHGetAll() {
    try {
      await this.danhMucService.loadDanhMucHangHoa().subscribe((hangHoa) => {
        if (hangHoa.msg == MESSAGE.SUCCESS) {
          hangHoa.data.forEach((item) => {
            if (item.cap === "1" && item.ma != '01') {
              this.listLoaiHangHoa = [
                ...this.listLoaiHangHoa,
                item
              ];
              this.onChangeLoaiHHAutoComplete('')
            }
            else {
              this.listLoaiHangHoa = [
                ...this.listLoaiHangHoa,
                ...item.child
              ];
            }
          })
        }
      })
    } catch (error) {
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  onChangeLoaiHHAutoComplete(value: any) {
    this.dsChungLoaiHangHoaDataSource = []
    this.formData.get('maChungLoaiHangHoa').setValue('')
    if (value) {
      this.dsLoaiHangHoaDataSource = this.listLoaiHangHoa
        .filter((item) => item?.ten?.toLowerCase()?.includes(value.toString().toLowerCase()),)
        .map((item) => item.ten);
      let data = this.listLoaiHangHoa.find((item) => item.ten.toString().toLowerCase() == this.formData.value.maLoaiHang.toString().toLowerCase());

      if (data && data.child.length > 0 && data !== undefined) {
        this.listChungLoaiHangHoa = data.child;
        this.dsChungLoaiHangHoaDataSource = this.listChungLoaiHangHoa.map((item => item.ten));
        this.searchInTable.maLoaiHangHoa = data.ma;
      } else {
        this.formData.get('maChungLoaiHangHoa').setValue('')
        this.dsChungLoaiHangHoaDataSource = []
      }
    } else {
      this.dsLoaiHangHoaDataSource = this.listLoaiHangHoa.map(
        (item) => item.ten,
      );
    }
  }

  onChangeChungLoaiHHAutoComplete(value: any) {
    if (value) {
      let data = this.listChungLoaiHangHoa.find((item) => item.ten.toString().toLowerCase() == this.formData.value.maChungLoaiHangHoa.toString().toLowerCase())
      if (data !== undefined) {
        this.searchInTable.maChungLoaiHangHoa = data.ma
      } else {
        this.searchInTable.maChungLoaiHangHoa = this.formData.value.maChungLoaiHangHoa
      }
    } else {
      this.searchInTable.maChungLoaiHangHoa = this.formData.value.maChungLoaiHangHoa
      this.dsChungLoaiHangHoaDataSource = this.listChungLoaiHangHoa.map(
        (item) => item.ten,
      );
    }
  }


  // load danh sách đơn vị
  async loadDsTong() {
    const body = {
      maDviCha: this.detail.maDvi,
      trangThai: '01',
    };

    const dsTong = await this.donviService.layDonViTheoCapDo(body);
    if (!isEmpty(dsTong)) {
      this.dsTong = dsTong;
      this.dsDonVi = dsTong[DANH_MUC_LEVEL.CHI_CUC];
    }
  }

  changePageIndex(event: any) {
    this.page = event;
    this.search();
  }

  changePageSize(event: any) {
    this.pageSize = event;
    this.page = 1;
    this.search();
  }

  viewDetail(id: number, isUpdate: boolean) {
    this.idInput = id;
    this.isCheck = isUpdate;
    this.isAddNew = true;
  }

}

interface ITrangThai {
  id: number;
  giaTri: string;
}

