import { Component, OnInit } from '@angular/core';
import dayjs from "dayjs";
import { UserService } from "../../../../services/user.service";
import { STATUS } from 'src/app/constants/status';
import { DANH_MUC_LEVEL } from "../../../luu-kho/luu-kho.constant";
import { UserLogin } from "../../../../models/userlogin";
import { DonviService } from "../../../../services/donvi.service";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NgxSpinnerService } from "ngx-spinner";
import { MESSAGE } from "../../../../constants/message";
import { PAGE_SIZE_DEFAULT } from "../../../../constants/config";
import { DxKhNhapKhacService } from "../../../../services/qlnv-hang/nhap-hang/nhap-khac/dxKhNhapKhac.service";
import { cloneDeep } from 'lodash';
import { saveAs } from 'file-saver';
import { NzModalService } from "ng-zorro-antd/modal";
@Component({
  selector: 'app-ke-hoach-nhap-khac',
  templateUrl: './ke-hoach-nhap-khac.component.html',
  styleUrls: ['./ke-hoach-nhap-khac.component.scss']
})
export class KeHoachNhapKhacComponent implements OnInit {
  listNam: any[] = [];
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 0;
  allChecked = false;
  indeterminate = false;
  selectedId: number = 0;
  isDetail: boolean = false;
  isView: boolean = false;
  searchFilter = {
    namKhoach: '',
    soDxuat: '',
    maDviDxuat: '',
    trangThai: '',
  };
  danhSachCuc: any[] = [];
  dataTable: any[] = [];
  dataTableAll: any[] = [];
  STATUS = STATUS;
  userInfo: UserLogin;
  listTrangThai: any[] = [
    { ma: this.STATUS.DU_THAO, giaTri: 'Dự thảo' },
    { ma: this.STATUS.CHO_DUYET_TP, giaTri: 'Chờ duyệt - TP' },
    { ma: this.STATUS.TU_CHOI_TP, giaTri: 'Từ chối - TP' },
    { ma: this.STATUS.CHO_DUYET_LDC, giaTri: 'Chờ duyệt - LĐ Cục' },
    { ma: this.STATUS.TU_CHOI_LDC, giaTri: 'Từ chối - LĐ Cục' },
    { ma: this.STATUS.DA_DUYET_LDC, giaTri: 'Đã duyệt - LĐ Cục' },
    { ma: this.STATUS.DA_DUYET_CBV, giaTri: 'Đã duyệt - CB Vụ' },
    { ma: this.STATUS.TU_CHOI_CBV, giaTri: 'Từ chối - CB Vụ' },
    { ma: this.STATUS.DA_TAO_CBV, giaTri: 'Đã tạo - CB Vụ' },
  ];
  listTrangThaiTh: any[] = [
    { ma: this.STATUS.CHUA_TONG_HOP, giaTri: 'Chưa Tổng Hợp' },
    { ma: this.STATUS.DA_TONG_HOP, giaTri: 'Đã Tổng Hợp' },
    { ma: this.STATUS.CHUA_TAO_QD, giaTri: 'Chưa Tạo QĐ' },
    { ma: this.STATUS.DA_DU_THAO_QD, giaTri: 'Đã Dự Thảo QĐ' },
    { ma: this.STATUS.DA_BAN_HANH_QD, giaTri: 'Đã Ban Hành QĐ' },
  ];
  filterTable: any = {
    namKhoach: '',
    tenDvi: '',
    soDxuat: '',
    ngayDxuat: '',
    ngayPduyet: '',
    tenLoaiVthh: '',
    tongSlNhap: '',
    dvt: '',
    trichYeu: '',
    trangThai: '',
    tenTrangThai: '',
    trangThaiTh: '',
    tenTrangThaiTh: '',
    maTh: '',
  };
  constructor(
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    public userService: UserService,
    private dviService: DonviService,
    private dxKhNhapKhacService: DxKhNhapKhacService,
    private modal: NzModalService,
  ) { }
  tuNgayDxuat: Date | null = null;
  denNgayDxuat: Date | null = null;
  tuNgayDuyet: Date | null = null;
  denNgayDuyet: Date | null = null;
  disabledStartDate = (startValue: Date): boolean => {
    if (!startValue || !this.denNgayDxuat) {
      return false;
    }
    return startValue.getTime() > this.denNgayDxuat.getTime();
  };

  disabledEndDate = (endValue: Date): boolean => {
    if (!endValue || !this.tuNgayDxuat) {
      return false;
    }
    return endValue.getTime() <= this.tuNgayDxuat.getTime();
  };

  disabledTuNgayDuyet = (startValue: Date): boolean => {
    if (!startValue || !this.denNgayDuyet) {
      return false;
    }
    return startValue.getTime() > this.denNgayDuyet.getTime();
  };

  disabledDenNgayDuyet = (endValue: Date): boolean => {
    if (!endValue || !this.tuNgayDuyet) {
      return false;
    }
    return endValue.getTime() <= this.tuNgayDuyet.getTime();
  };
  async ngOnInit(){
    await this.spinner.show();
    try {
      for (let i = -3; i < 23; i++) {
        this.listNam.push({
          value: dayjs().get('year') - i,
          text: dayjs().get('year') - i,
        });
      }
      this.userInfo = this.userService.getUserLogin();
      await Promise.all([
        this.loadDanhSachCuc(),
        this.search(),
      ])
      await this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      await this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }
  async loadDanhSachCuc() {
    const body = {
      maDviCha: this.userInfo.MA_DVI,
      trangThai: "01"
    };
    const dsTong = await this.dviService.layDonViTheoCapDo(body);
    this.danhSachCuc = dsTong[DANH_MUC_LEVEL.CUC];
    this.danhSachCuc = this.danhSachCuc.filter(item => item.type != "PB");
    let vuQlh = dsTong[DANH_MUC_LEVEL.CUC].filter(item => item.maDvi == "010124" );
    this.danhSachCuc = [...this.danhSachCuc, vuQlh[0]]
  }
  clearFilter() {
    this.searchFilter.namKhoach = null;
    this.searchFilter.soDxuat = null;
    this.searchFilter.trangThai = null;
    this.tuNgayDxuat = null;
    this.denNgayDxuat = null;
    this.tuNgayDuyet = null;
    this.denNgayDuyet = null;
    this.search();
  }
  async search(){
    this.spinner.show();
    let body = {
      tuNgayDxuat: this.tuNgayDxuat != null ? dayjs(this.tuNgayDxuat).format('YYYY-MM-DD') + " 00:00:00" : null,
      denNgayDxuat: this.denNgayDxuat != null ? dayjs(this.denNgayDxuat).format('YYYY-MM-DD') + " 23:59:59" : null,
      tuNgayDuyet: this.tuNgayDuyet != null ? dayjs(this.tuNgayDuyet).format('YYYY-MM-DD') + " 00:00:00" : null,
      denNgayDuyet: this.denNgayDuyet != null ? dayjs(this.denNgayDuyet).format('YYYY-MM-DD') + " 23:59:59" : null,
      namKhoach:  this.searchFilter.namKhoach,
      soDxuat: this.searchFilter.soDxuat,
      maDviDxuat: this.searchFilter.maDviDxuat,
      trangThai: this.searchFilter.trangThai,
      paggingReq: {
        limit: this.pageSize,
        page: this.page - 1,
      },
    };
    let res = await this.dxKhNhapKhacService.search(body);
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
      this.dataTable = [];
      this.totalRecord = 0;
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    this.spinner.hide();
  };
  deleteSelect(){};
  exportData(){
    if (this.totalRecord > 0) {
      this.spinner.show();
      try {
        let body = {
          tuNgayDxuat: this.tuNgayDxuat != null ? dayjs(this.tuNgayDxuat).format('YYYY-MM-DD') + " 00:00:00" : null,
          denNgayDxuat: this.denNgayDxuat != null ? dayjs(this.denNgayDxuat).format('YYYY-MM-DD') + " 23:59:59" : null,
          tuNgayDuyet: this.tuNgayDuyet != null ? dayjs(this.tuNgayDuyet).format('YYYY-MM-DD') + " 00:00:00" : null,
          denNgayDuyet: this.denNgayDuyet != null ? dayjs(this.denNgayDuyet).format('YYYY-MM-DD') + " 23:59:59" : null,
          namKhoach:  this.searchFilter.namKhoach,
          soDxuat: this.searchFilter.soDxuat,
          maDviDxuat: this.searchFilter.maDviDxuat,
          trangThai: this.searchFilter.trangThai,

        };
        this.dxKhNhapKhacService.export(body).subscribe(
          blob => saveAs(blob, 'danh-sach-ke-hoach-nhap_khac.xlsx')
        );
        this.spinner.hide();
      }
      catch (e) {
        console.log('error: ', e)
        this.spinner.hide();
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
    }
  };
  themMoi(){
    this.isDetail = true;
    this.selectedId = null;
    this.isView = false;
  };
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
  filterInTable(key: string, value: string) {
    if (value !=null && value != '') {
      this.dataTable = [];
      let temp = [];
      if (this.dataTableAll && this.dataTableAll.length > 0) {
        this.dataTableAll.forEach((item) => {
          if (['ngayDxuat', 'ngayPduyet'].includes(key)) {
            if (item[key] && dayjs(item[key]).format('DD/MM/YYYY').indexOf(value.toString()) != -1) {
              temp.push(item)
            }
          } else if (item[key] && item[key].toString().toLowerCase().indexOf(value.toString().toLowerCase()) != -1 || item[key] == value) {
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
  convertDateToString(event: any): string {
    let result = '';
    if (event) {
      result = dayjs(event).format('DD/MM/YYYY').toString()
    }
    return result;
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
  detail(data?, isView?) {
    this.selectedId = data.id;
    this.isDetail = true;
    if (isView != null) {
      this.isView = isView;
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
          let body = {
            "id": item.id,
          }
          this.dxKhNhapKhacService.delete(body).then((res) => {
            if (res.msg == MESSAGE.SUCCESS) {
              this.notification.success(
                MESSAGE.SUCCESS,
                MESSAGE.DELETE_SUCCESS,
              );
              this.search();
            } else {
              this.notification.error(MESSAGE.ERROR, res.msg);
            }
          });
          this.spinner.hide();
        }
        catch (e) {
          console.log('error: ', e)
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      },
    });
  }
  showList() {
    this.isDetail = false;
    this.search()
  }

  hienThiPheDuyet(data) {
    return (this.userService.isAccessPermisson('NHDTQG_NK_KHNK_DUYETTP') && data.trangThai == STATUS.CHO_DUYET_TP)
      || (this.userService.isAccessPermisson('NHDTQG_NK_KHNK_DUYETLDC') && data.trangThai == STATUS.CHO_DUYET_LDC)
      || (this.userService.isAccessPermisson('NHDTQG_NK_KHNK_DUYETCBV') && data.trangThai == STATUS.DA_DUYET_LDC);
  }

  hienThiXem(data){
    if (this.userService.isAccessPermisson('NHDTQG_NK_KHNK_XEM')) {
      if(this.userService.isAccessPermisson('NHDTQG_NK_KHNK_THEM') && (data.trangThai == STATUS.DU_THAO || data.trangThai == STATUS.TU_CHOI_TP || data.trangThai == STATUS.TU_CHOI_LDC || data.trangThai == STATUS.TU_CHOI_CBV)) {
        return false;
      } else if (this.userService.isAccessPermisson('NHDTQG_NK_KHNK_DUYETTP') && data.trangThai == STATUS.CHO_DUYET_TP
        || (this.userService.isAccessPermisson('NHDTQG_NK_KHNK_DUYETLDC') && data.trangThai == STATUS.CHO_DUYET_LDC)
      || (this.userService.isAccessPermisson('NHDTQG_NK_KHNK_DUYETCBV') && data.trangThai == STATUS.DA_DUYET_LDC) ) {
        return false;
      }
      return true;
    }
    return false;
  }
}
