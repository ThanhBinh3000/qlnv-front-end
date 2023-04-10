
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { saveAs } from 'file-saver';
import { cloneDeep, isEmpty, chain } from 'lodash';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { UserLogin } from 'src/app/models/userlogin';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { DonviService } from 'src/app/services/donvi.service';
import { QuanLyHangTrongKhoService } from 'src/app/services/quanLyHangTrongKho.service';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';
import dayjs from "dayjs";
import { KhCnQuyChuanKyThuat } from './../../../services/kh-cn-bao-quan/KhCnQuyChuanKyThuat';
import { STATUS } from 'src/app/constants/status';

@Component({
  selector: 'app-quan-ly-quy-chuan-ky-thuat-quoc-gia',
  templateUrl: './quan-ly-quy-chuan-ky-thuat-quoc-gia.component.html',
  styleUrls: ['./quan-ly-quy-chuan-ky-thuat-quoc-gia.component.scss']
})
export class QuanLyQuyChuanKyThuatQuocGiaComponent implements OnInit {

  @Input('maLoaiVthh') maLoaiVthh: string;
  @Input() typeVthh: string;
  qdTCDT: string = MESSAGE.QD_TCDT;
  userInfo: UserLogin;
  detail: any = {};
  dataTest: any = {};
  dsCha: any = {};
  dsCon: any = {};
  STATUS = STATUS;
  listChungLoaiHangHoa: any[] = [];
  formData: FormGroup;

  searchFilter = {
    soVanBan: '',
    soHieuQuyChuan: '',
    apDungTai: '',
    loaiVthh: '',
    cloaiVthh: '',
    ngayKy: '',
    ngayHieuLuc: '',
    trichYeu: '',
    tenLoaiVthh: '',
    tenCloaiVthh: '',
  };
  filterTable = {
    soVanBan: '',
    soVanBanThayThe: '',
    soHieuQuyChuan: '',
    apDungTai: '',
    tenLoaiVthh: '',
    tenCloaiVthh: '',
    listTenLoaiVthh: '',
    ngayKy: '',
    ngayHieuLuc: '',
    tenTrangThai: '',
    tenTrangThaiHl: '',
  };
  errorMessage = '';
  isDetail: boolean = false;
  selectedId: number = 0;
  isView: boolean = false;

  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 10;
  dataTable: any[] = [];
  dataTableAll: any[] = [];
  dsLoaiHangHoa: any[] = [];
  dsChungLoaiHangHoa: any[] = [];
  isTatCa: boolean = false;
  yearNow: number = 0;
  listNam: any[] = [];
  dsBoNganh: any[] = [];
  boNganhAd: any[] = [];
  listOfOption: any = [];
  allChecked = false;
  indeterminate = false;
  constructor(
    private fb: FormBuilder,
    private donviService: DonviService,
    private danhMucService: DanhMucService,
    private spinner: NgxSpinnerService,
    public userService: UserService,
    private notification: NzNotificationService,
    private quanLyHangTrongKhoService: QuanLyHangTrongKhoService,
    public globals: Globals,
    private modal: NzModalService,
    private khCnQuyChuanKyThuat: KhCnQuyChuanKyThuat,

  ) { }

  async ngOnInit() {
    this.spinner.show();
    try {
      if (!this.typeVthh || this.typeVthh == '') {
        this.isTatCa = true;
      }
      this.userInfo = this.userService.getUserLogin();
      if (this.userInfo) {
        this.qdTCDT = this.userInfo.MA_QD;
      }
      this.yearNow = dayjs().get('year');
      for (let i = -3; i < 23; i++) {
        this.listNam.push({
          value: this.yearNow - i,
          text: this.yearNow - i,
        });
      }
      await this.loadLoaiHangHoa();
      await this.getListBoNganh();
      await this.search();
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async loadLoaiHangHoa() {
    let ds = [];
    try {
      let hangHoa = await this.danhMucService.loadDanhMucHangHoa().toPromise();
      if (hangHoa) {
        if (hangHoa.msg == MESSAGE.SUCCESS) {
          hangHoa.data.forEach(element => {
            ds = [...ds, element.children];
            ds = ds.flat();
            this.listOfOption = ds;
          });
        }
      }
    } catch (error) {
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }
  async onChangeLoaiHH(id: number) {
    if (id && id > 0) {
      let loaiHangHoa = this.dsLoaiHangHoa.filter(item => item.ma === id)
      if (loaiHangHoa && loaiHangHoa.length > 0) {
        this.dsChungLoaiHangHoa = loaiHangHoa[0].child
      }
    }
  }
  async changeHangHoa(event: any) {
    if (event) {
      let res = await this.danhMucService.loadDanhMucHangHoaTheoMaCha({ str: event });
      console.log(res, 5555);
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          this.listChungLoaiHangHoa = res.data;
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }
  }

  async getListBoNganh() {
    this.dsBoNganh = [];
    let res = await this.donviService.layTatCaDonViByLevel(0);
    if (res.msg == MESSAGE.SUCCESS) {
      this.dsBoNganh = res.data.filter(s => s.tenDvi);
      let boTaiChinh = res.data.find(s => s.code === 'BTC');
      Object.assign(this.dsBoNganh, boTaiChinh)
    }
  }

  async initData() {
    this.userInfo = this.userService.getUserLogin();
    this.detail.maDvi = this.userInfo.MA_DVI;
    this.detail.tenDvi = this.userInfo.TEN_DVI;
    await this.search();
  }

  redirectToChiTiet(isView: boolean, id: number) {
    this.selectedId = id;
    this.isDetail = true;
    this.isView = isView;
  }



  async search() {
    this.spinner.show();
    try {
      let body = {
        soVanBan: this.searchFilter.soVanBan,
        soHieuQuyChuan: this.searchFilter.soHieuQuyChuan,
        loaiVthh: this.searchFilter.loaiVthh,
        apDungTai: this.searchFilter.apDungTai,
        cloaiVthh: this.searchFilter.cloaiVthh,
        ngayKyTu: this.searchFilter.ngayKy
          ? dayjs(this.searchFilter.ngayKy[0]).format('YYYY-MM-DD')
          : null,
        ngayKyDen: this.searchFilter.ngayKy
          ? dayjs(this.searchFilter.ngayKy[1]).format('YYYY-MM-DD')
          : null,
        ngayHieuLucTu: this.searchFilter.ngayHieuLuc
          ? dayjs(this.searchFilter.ngayHieuLuc[0]).format('YYYY-MM-DD')
          : null,
        ngayHieuLucDen: this.searchFilter.ngayHieuLuc
          ? dayjs(this.searchFilter.ngayHieuLuc[1]).format('YYYY-MM-DD')
          : null,
        trichYeu: this.searchFilter.trichYeu,
        paggingReq: {
          limit: this.pageSize,
          page: this.page - 1,
        }
      };
      let res = await this.khCnQuyChuanKyThuat.search(body);
      if (res.msg == MESSAGE.SUCCESS) {
        let data = res.data;
        this.dataTable = data.content;
        if (this.dataTable && this.dataTable.length > 0) {
          this.dataTable.forEach((item) => {
            item.checked = false;
            const tt = this.dsBoNganh.find(s =>
              s.key === item.apDungTai,
            );
            if (tt) {
              this.boNganhAd = tt.tenDvi;
              Object.assign(item, { boNganhAd: this.boNganhAd })
            }
          });
        }
        this.dataTableAll = cloneDeep(this.dataTable);
        this.totalRecord = data.totalElements;
      } else {
        this.dataTable = [];
        this.totalRecord = 0;
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
      this.spinner.hide();
    } catch (e) {
      console.log(e)
      this.spinner.hide();
    }

  }

  async clearFilter() {
    this.searchFilter = {
      soVanBan: '',
      soHieuQuyChuan: '',
      apDungTai: '',
      loaiVthh: '',
      cloaiVthh: '',
      ngayKy: '',
      ngayHieuLuc: '',
      trichYeu: '',
      tenLoaiVthh: '',
      tenCloaiVthh: '',
    };
    this.search();
  }

  filterInTable(key: string, value: string) {
    if (value && value != '') {
      this.dataTable = [];
      let temp = [];
      if (this.dataTableAll && this.dataTableAll.length > 0) {
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
    this.filterTable = {
      soVanBan: '',
      soVanBanThayThe: '',
      soHieuQuyChuan: '',
      apDungTai: '',
      tenLoaiVthh: '',
      tenCloaiVthh: '',
      listTenLoaiVthh: '',
      ngayKy: '',
      ngayHieuLuc: '',
      tenTrangThai: '',
      tenTrangThaiHl: '',
    }
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
          this.khCnQuyChuanKyThuat.delete({ id: item.id }).then((res) => {
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
            let res = await this.khCnQuyChuanKyThuat.deleteMuti({ idList: dataDelete });
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

  async showList() {
    this.isDetail = false;
    await this.search();
  }


  exportData() {
    if (this.totalRecord > 0) {
      this.spinner.show();
      try {
        let body = {
          soVanBan: this.searchFilter.soVanBan,
          soHieuQuyChuan: this.searchFilter.soHieuQuyChuan,
          loaiVthh: this.searchFilter.loaiVthh,
          cloaiVthh: this.searchFilter.cloaiVthh,
          ngayKyTu: this.searchFilter.ngayKy
            ? dayjs(this.searchFilter.ngayKy[0]).format('YYYY-MM-DD')
            : null,
          ngayKyDen: this.searchFilter.ngayKy
            ? dayjs(this.searchFilter.ngayKy[1]).format('YYYY-MM-DD')
            : null,
          ngayHieuLucTu: this.searchFilter.ngayHieuLuc
            ? dayjs(this.searchFilter.ngayHieuLuc[0]).format('YYYY-MM-DD')
            : null,
          ngayHieuLucDen: this.searchFilter.ngayHieuLuc
            ? dayjs(this.searchFilter.ngayHieuLuc[1]).format('YYYY-MM-DD')
            : null,
          trichYeu: this.searchFilter.trichYeu,
        };
        this.khCnQuyChuanKyThuat
          .export(body)
          .subscribe((blob) =>
            saveAs(blob, 'danh-sach-quy-chuan-quoc-gia.xlsx'),
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

  expandSet = new Set<number>();
  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }
  convertDateToString(event: any): string {
    let result = '';
    if (event) {
      result = dayjs(event).format('DD/MM/YYYY').toString()
    }
    return result;
  }
}
