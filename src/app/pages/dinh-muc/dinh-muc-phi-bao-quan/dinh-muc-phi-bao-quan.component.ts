import {cloneDeep} from 'lodash';
import {saveAs} from 'file-saver';
import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import dayjs from 'dayjs';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NgxSpinnerService} from 'ngx-spinner';
import {LOAI_HANG_DTQG, PAGE_SIZE_DEFAULT} from 'src/app/constants/config';
import {MESSAGE} from 'src/app/constants/message';
import {UserLogin} from 'src/app/models/userlogin';
import {DonviService} from 'src/app/services/donvi.service';
import {UserService} from 'src/app/services/user.service';
import {convertTrangThai} from 'src/app/shared/commonFunction';
import {ThongBaoDauGiaTaiSanService} from 'src/app/services/thongBaoDauGiaTaiSan.service';
import {Globals} from 'src/app/shared/globals';
import {DanhMucService} from 'src/app/services/danhmuc.service';
import {
  DialogDanhSachHangHoaComponent
} from "../../../components/dialog/dialog-danh-sach-hang-hoa/dialog-danh-sach-hang-hoa.component";
import {CanCuXacDinhPag, ThongTinKhaoSatGia} from "../../../models/DeXuatPhuongAnGia";
import {DinhMucPhiNxBq} from "../../../models/DinhMucPhi";
import {QlDinhMucPhiService} from "../../../services/qlnv-kho/QlDinhMucPhi.service";

@Component({
  selector: 'app-dinh-muc-phi-bao-quan',
  templateUrl: './dinh-muc-phi-bao-quan.component.html',
  styleUrls: ['./dinh-muc-phi-bao-quan.component.scss']
})
export class DinhMucPhiBaoQuanComponent implements OnInit {

  @Input() typeVthh: string;
  @Input() idInput: number;
  qdTCDT: string = MESSAGE.QD_TCDT;

  searchFilter = {
    tenDinhMuc: '',
    loaiVthh: '',
    tenLoaiVthh: '',
    cLoaiVthh: '',
    tenCLoaiVthh: '',
    loaiDinhMuc: '',
    loaiBaoQuan: '',
    trangThai: '',
  };
  defaultSearchFilter = {
    tenLoaiVthh: '',
    tenDinhMuc: '',
    loaiVthh: '',
    tenCLoaiVthh: '',
    cLoaiVthh: '',
    loaiDinhMuc: '',
    loaiBaoQuan: '',
    trangThai: '',
  };

  optionsDonVi: any[] = [];
  options: any[] = [];
  inputDonVi: string = '';
  errorMessage: string = '';
  startValue: Date | null = null;
  endValue: Date | null = null;
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 0;
  dataTable: any[] = [];
  dataTableAll: any[] = [];
  listHangHoa: any[] = [];
  listLoaiDinhMuc: any[] =[];
  listLoaiBaoQuan: any[] = [];
  listTrangThai: any[] = [{"ma": "00", "giaTri": "Không hoạt động"}, {"ma": "01", "giaTri": "Hoạt động"}];
  listDmDinhMuc: any[] = [{
    "ma": "001",
    "ten": "Mức chi phí nhập gạo",
    "donViTinh": "Đồng/tấn",
    "loaiDinhMuc": "01",
    "loaiBaoQuan": "01",
    "htBaoQuan": "01",
    "loaiVthh": "0101",
    "cloaiVthh": "02"
  }, {
    "ma": "002",
    "ten": "Mức chi phí xuất gạo", "donViTinh": "Đồng/tấn", "loaiDinhMuc": "01", "loaiBaoQuan": "01", "htBaoQuan": "01", "loaiVthh": "0101",
    "cloaiVthh": "02"
  }, {
    "ma": "003",
    "ten": "Mức bảo quản gạo lần đầu - Mới",
    "donViTinh": "Đồng/tấn",
    "loaiDinhMuc": "01",
    "loaiBaoQuan": "01",
    "htBaoQuan": "01",
    "loaiVthh": "0101",
    "cloaiVthh": "02"
  }, {
    "ma": "004",
    "ten": "Mức bảo quản gạo lần đầu - Bổ sung",
    "donViTinh": "Đồng/tấn",
    "loaiDinhMuc": "01",
    "loaiBaoQuan": "01",
    "htBaoQuan": "01",
    "loaiVthh": "0101",
    "cloaiVthh": "02"
  }, {
    "ma": "005",
    "ten": "Mức bảo quản gạo thường xuyên",
    "donViTinh": "Đồng/tấn",
    "loaiDinhMuc": "01",
    "loaiBaoQuan": "01",
    "htBaoQuan": "01",
    "loaiVthh": "0101",
    "cloaiVthh": "02"
  }];

  rowItem: DinhMucPhiNxBq = new DinhMucPhiNxBq();
  dataEdit: { [key: string]: { edit: boolean; data: DinhMucPhiNxBq } } = {};

  userInfo: UserLogin;
  isDetail: boolean = false;
  selectedId: number = 0;
  isView: boolean = false;
  isTatCa: boolean = false;

  allChecked = false;
  indeterminate = false;

  filterTable: any = {
    qdPheDuyetKhbdg: '',
    maThongBao: '',
    thoiGianToChucDauGiaTuNgay: '',
    trichYeu: '',
    hinhThucDauGia: '',
    phuongThucDauGia: '',
    loaiHangHoa: '',
    namKeHoach: '',
  };

  constructor(
    private spinner: NgxSpinnerService,
    private donViService: DonviService,
    private notification: NzNotificationService,
    private router: Router,
    private modal: NzModalService,
    public userService: UserService,
    private qlDinhMucPhiService: QlDinhMucPhiService,
    public globals: Globals,
    private danhMucService: DanhMucService,
  ) {
  }

  async ngOnInit() {
    this.spinner.show();
    try {
      this.userInfo = this.userService.getUserLogin();
      if (this.userInfo) {
        this.qdTCDT = this.userInfo.MA_QD;
      }
      await this.getAllLoaiDinhMuc();
      await this.loaiVTHHGetAll();
      await this.search();
      this.spinner.hide();
    } catch (e) {
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async loaiVTHHGetAll() {
    let res = await this.danhMucService.loaiVatTuHangHoaGetAll();
    if (res.msg == MESSAGE.SUCCESS) {
      if (!this.typeVthh) {
        this.listHangHoa = res.data;
      } else {
        this.listHangHoa = res.data?.filter(x => x.ma == this.typeVthh);
      }
      ;
    }
  }

  async getAllLoaiDinhMuc() {
    let resLoaiDinhMuc = await this.danhMucService.danhMucChungGetAll('LOAI_DINH_MUC');
    if (resLoaiDinhMuc.msg == MESSAGE.SUCCESS) {
        this.listLoaiDinhMuc = resLoaiDinhMuc.data;
    }
    let resLoaiHinhBaoQuan = await this.danhMucService.danhMucChungGetAll('LOAI_HINH_BAO_QUAN');
    if (resLoaiHinhBaoQuan.msg == MESSAGE.SUCCESS) {
      this.listLoaiBaoQuan = resLoaiHinhBaoQuan.data;
    }
   }

  changeDm(attr): void {
    let item;
    if (attr == 'ma') {
      item = this.listDmDinhMuc.filter(item => item.ma ==  this.rowItem.maDinhMuc);
    } else {
      item = this.listDmDinhMuc.filter(item => item.ten == this.rowItem.tenDinhMuc);
    }
    if (item) {
      this.rowItem.tenDinhMuc = item.map(item => item.ten).toString();
      this.rowItem.donViTinh = item.map(item => item.donViTinh).toString();
      this.rowItem.loaiDinhMuc = item.map(item => item.loaiDinhMuc).toString();
      this.rowItem.loaiBaoQuan = item.map(item => item.loaiBaoQuan).toString();
      this.rowItem.htBaoQuan = item.map(item => item.htBaoQuan).toString();
      this.rowItem.loaiVthh = item.map(item => item.loaiVthh).toString();
      this.rowItem.cloaiVthh = item.map(item => item.cloaiVthh).toString();
    }
  }

  async saveDinhMuc(id: number) {
    this.spinner.show();
    let res

    if (id > 0) {
      let msgRequired = '';
      //validator
      if (!this.dataEdit[id].data.tenDinhMuc) {
        msgRequired = "Tên định mức không được để trống";
      } else if (!this.dataEdit[id].data.maDinhMuc) {
        msgRequired = "Mã định mức không được để trống";
      } else if (!this.dataEdit[id].data.ngayHieuLuc) {
        msgRequired = "Ngày hiệu lực không được để trống";
      } else if (!this.dataEdit[id].data.trangThai) {
        msgRequired = "Trạng thái lực không được để trống";
      }
      if (msgRequired) {
        this.notification.error(MESSAGE.ERROR, msgRequired);
        this.spinner.hide();
        return;
      }
      res = await this.qlDinhMucPhiService.update(this.dataEdit[id].data);
    } else {
      let msgRequired = '';
      //validator
      if (!this.rowItem.tenDinhMuc) {
        msgRequired = "Tên định mức không được để trống";
      } else if (!this.rowItem.maDinhMuc) {
        msgRequired = "Mã định mức không được để trống";
      } else if (!this.rowItem.ngayHieuLuc) {
        msgRequired = "Ngày hiệu lực không được để trống";
      } else if (!this.rowItem.trangThai) {
        msgRequired = "Trạng thái lực không được để trống";
      }
      if (msgRequired) {
        this.notification.error(MESSAGE.ERROR, msgRequired);
        this.spinner.hide();
        return;
      }
      res = await this.qlDinhMucPhiService.create(this.rowItem);
    }
    if (res.msg == MESSAGE.SUCCESS) {
      if (id > 0) {
        this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
      } else {
        this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
      }
      this.rowItem = new DinhMucPhiNxBq();
      this.search();

    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    this.spinner.hide();
  }

  async saveEdit(id: number) {
    alert(id);
  }

  updateAllChecked(): void {
    this.indeterminate = false;
    if (this.allChecked) {
      if (this.dataTable && this.dataTable.length > 0) {
        this.dataTable.forEach((item) => {
          if (item.trangThai == this.globals.prop.NHAP_DU_THAO) {
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
    let body = {
      "tenDinhMuc": this.searchFilter.tenDinhMuc,
      "trangThai": this.searchFilter.trangThai,
      "loaiVthh": this.searchFilter.loaiVthh,
      "cLoaiVthh": this.searchFilter.cLoaiVthh,
      "loaiDinhMuc": this.searchFilter.loaiDinhMuc,
      "loaiBaoQuan": this.searchFilter.loaiBaoQuan,
      "paggingReq": {
        "limit": this.pageSize,
        "page": this.page - 1,
      }
    };
    let res = await this.qlDinhMucPhiService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.dataTable = data.content;
      if (this.dataTable && this.dataTable.length > 0) {
        this.dataTable.forEach((item) => {
          item.checked = false;
        });
      }
      // this.dataTableAll = cloneDeep(this.dataTable);
      this.totalRecord = data.totalElements;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    this.updateEditCache();
    this.spinner.hide();
  }

  selectHangHoa() {
    // let data = this.loaiVthh;
    const modalTuChoi = this.modal.create({
      nzTitle: 'Danh sách hàng hóa',
      nzContent: DialogDanhSachHangHoaComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {},
    });
    modalTuChoi.afterClose.subscribe(async (data) => {
      if (data) {
        this.bindingDataHangHoa(data);
      }
    });
  }

  async bindingDataHangHoa(data) {
    this.searchFilter.cLoaiVthh = data.ma
    this.searchFilter.tenCLoaiVthh = data.ten
    this.searchFilter.loaiVthh = data.parent.ma
    this.searchFilter.tenLoaiVthh = data.parent.ten
  }

  async changePageIndex(event) {
    this.spinner.show();
    try {
      this.page = event;
      await this.search();
      this.spinner.hide();
    } catch (e) {
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
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  clearFilter() {
    this.searchFilter = Object.assign({}, this.defaultSearchFilter);
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
        this.spinner.show();
        try {
          this.qlDinhMucPhiService.delete({id: item.id}).then((res) => {
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
    await this.search();
  }

  export() {
    if (this.totalRecord > 0) {
      this.spinner.show();
      try {
        let body = {
          "tenDinhMuc": this.searchFilter.tenDinhMuc ? this.searchFilter.tenDinhMuc : null,
          "loaiVthh": this.searchFilter.loaiVthh ? this.searchFilter.loaiVthh : null,
          "cLoaiVthh": this.searchFilter.cLoaiVthh ? this.searchFilter.cLoaiVthh : null,
          "trangThai": this.searchFilter.trangThai ? this.searchFilter.trangThai : null,
          "loaiBaoQuan": this.searchFilter.loaiBaoQuan ? this.searchFilter.loaiBaoQuan : null,
          "loaiDinhMuc": this.searchFilter.loaiDinhMuc ? this.searchFilter.loaiDinhMuc : null,
        };
        this.qlDinhMucPhiService
          .export(body)
          .subscribe((blob) =>
            saveAs(blob, 'danh-sach-dinh-muc-phi.xlsx'),
          );
        this.spinner.hide();
      } catch (e) {
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
            let res = await this.qlDinhMucPhiService.deleteMuti({ids: dataDelete});
            if (res.msg == MESSAGE.SUCCESS) {
              this.notification.success(MESSAGE.SUCCESS, MESSAGE.DELETE_SUCCESS);
              await this.search();
            } else {
              this.notification.error(MESSAGE.ERROR, res.msg);
            }
            this.spinner.hide();
          } catch (e) {
            this.spinner.hide();
            this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
          }
        },
      });
    } else {
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
    } else {
      this.dataTable = cloneDeep(this.dataTableAll);
    }
  }

  clearFilterTable() {
    this.filterTable = {
      qdPheDuyetKhbdg: '',
      maThongBao: '',
      thoiGianToChucDauGiaTuNgay: '',
      trichYeu: '',
      hinhThucDauGia: '',
      phuongThucDauGia: '',
      loaiHangHoa: '',
      namKeHoach: '',
    }
  }


  edit(id: number) {
    this.dataEdit[id].edit = true;
  }

  cancelEdit(id: number) {
    this.dataEdit[id] = {
      data: {...this.dataTable[id]},
      edit: false,
    };
  }

  updateEditCache(): void {
    if (this.dataTable) {
      this.dataTable.forEach((item) => {
        this.dataEdit[item.id] = {
          edit: false,
          data: {...item},
        };
      });
    }
  }

}
