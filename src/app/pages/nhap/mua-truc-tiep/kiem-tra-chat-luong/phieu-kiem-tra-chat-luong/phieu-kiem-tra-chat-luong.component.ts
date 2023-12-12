import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import dayjs from 'dayjs';
import { saveAs } from 'file-saver';
import { cloneDeep } from 'lodash';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { UserLogin } from 'src/app/models/userlogin';
import { DonviService } from 'src/app/services/donvi.service';
import { UserService } from 'src/app/services/user.service';
import { convertTrangThai } from 'src/app/shared/commonFunction';
import { Globals } from 'src/app/shared/globals';
import { STATUS } from "../../../../../constants/status";
import { QuyetDinhGiaoNvNhapHangService } from 'src/app/services/qlnv-hang/nhap-hang/mua-truc-tiep/qdinh-giao-nvu-nh/quyetDinhGiaoNvNhapHang.service';
import { N } from '@angular/cdk/keycodes';
import { MttPhieuKiemTraChatLuongService } from './../../../../../services/qlnv-hang/nhap-hang/mua-truc-tiep/MttPhieuKiemTraChatLuongService.service';

@Component({
  selector: 'app-phieu-kiem-tra-chat-luong',
  templateUrl: './phieu-kiem-tra-chat-luong.component.html',
  styleUrls: ['./phieu-kiem-tra-chat-luong.component.scss']
})
export class PhieuKiemTraChatLuongComponent implements OnInit {
  @Input() typeVthh: string;
  @Input()
  listVthh: any[] = [];
  qdTCDT: string = MESSAGE.QD_TCDT;
  yearNow: number = 0;
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

  userInfo: UserLogin;
  isDetail: boolean = false;
  selectedId: number = 0;
  isView: boolean = false;
  idQdGiaoNvNh: number = 0;
  isTatCa: boolean = false;

  allChecked = false;
  indeterminate = false;
  tuLapPhieu: Date | null = null;
  denLapPhieu: Date | null = null;
  tuNgayGiamDinh: Date | null = null;
  denNgayGiamDinh: Date | null = null;
  STATUS = STATUS;

  searchFilter = {
    soPhieu: '',
    ngayTongHop: '',
    ketLuan: '',
    soQuyetDinh: '',
    namKh: '',
  };
  filterTable: any = {
    soPhieu: '',
    ngayGdinh: '',
    kqDanhGia: '',
    soQuyetDinhNhap: '',
    soBienBan: '',
    tenDiemKho: '',
    tenNganLo: '',
    tenNhaKho: '',
    tenTrangThai: '',
  };
  titleStatus: "";
  listNam: any[] = [];

  constructor(
    private spinner: NgxSpinnerService,
    private donViService: DonviService,
    private phieuKtraCluongService: MttPhieuKiemTraChatLuongService,
    private quyetDinhGiaoNvNhapHangService: QuyetDinhGiaoNvNhapHangService,
    private notification: NzNotificationService,
    private router: Router,
    private modal: NzModalService,
    public userService: UserService,
    public globals: Globals,
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
      await this.search();
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
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

  async search() {
    await this.spinner.show();
    let body = {
      soQd: this.searchFilter.soQuyetDinh,
      namNhap: this.searchFilter.namKh,
      "paggingReq": {
        "limit": this.pageSize,
        "page": this.page - 1
      },
      tuNgayGiamDinh: this.tuNgayGiamDinh != null ? dayjs(this.tuNgayGiamDinh).format('YYYY-MM-DD') + " 00:00:00" : null,
      denNgayGiamDinh: this.denNgayGiamDinh != null ? dayjs(this.denNgayGiamDinh).format('YYYY-MM-DD') + " 23:59:59" : null,
      tuLapPhieu: this.tuLapPhieu != null ? dayjs(this.tuLapPhieu).format('YYYY-MM-DD') + " 00:00:00" : null,
      denNgayTao: this.denLapPhieu != null ? dayjs(this.denLapPhieu).format('YYYY-MM-DD') + " 23:59:59": null,
      trangThai: STATUS.BAN_HANH
    };
    let res = await this.quyetDinhGiaoNvNhapHangService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.dataTable = data.content;
      this.dataTable.forEach(item => {
        if (this.userService.isChiCuc()) {
          item.detail = item.hhQdGiaoNvNhangDtlList.filter(y => y.maDvi == this.userInfo.MA_DVI)[0]
          item.detail = {
            children: item.detail.children.filter(x => x.maDiemKho.substring(0, x.maDiemKho.length - 2) == this.userInfo.MA_DVI)
          }
          item.expand = true;
        } else {
          let data = [];
          item.hhQdGiaoNvNhangDtlList.forEach(res => {
            data = [...data, ...res.children.filter(x => x.idDtl == res.id)];
          })
          item.detail = {
            children: data
          }
          item.expand = true;
        };
      });
      this.dataTableAll = cloneDeep(this.dataTable);
      this.totalRecord = data.totalElements;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    await this.spinner.hide();
  }

  setExpand(parantExpand: boolean = false, children: any = []): void {
    if (parantExpand) {
      return children.map(f => ({ ...f, expand: false }))
    }
    return children
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
      await this.search();
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  clearFilter() {
    this.searchFilter = {
      soPhieu: '',
      ngayTongHop: '',
      ketLuan: '',
      soQuyetDinh: '',
      namKh: null,
    };
    this.tuLapPhieu = null;
    this.denLapPhieu = null;
    this.tuNgayGiamDinh = null;
    this.denNgayGiamDinh = null;
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
          this.phieuKtraCluongService.delete({ id: item.id }).then((res) => {
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

  redirectToChiTiet(isView: boolean, id: number, idQdGiaoNvNh?: number) {
    this.selectedId = id;
    this.isDetail = true;
    this.isView = isView;
    this.idQdGiaoNvNh = idQdGiaoNvNh;
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
          "kqDanhGia": this.searchFilter.ketLuan,
          "maDonVi": this.userInfo.MA_DVI,
          "maHangHoa": this.typeVthh,
          "maNganKho": null,
          tuNgayGiamDinh: this.tuNgayGiamDinh != null ? dayjs(this.tuNgayGiamDinh).format('YYYY-MM-DD') + " 00:00:00" : null,
          denNgayGiamDinh: this.denNgayGiamDinh != null ? dayjs(this.denNgayGiamDinh).format('YYYY-MM-DD') + " 23:59:59" : null,
          tuLapPhieu: this.tuLapPhieu != null ? dayjs(this.tuLapPhieu).format('YYYY-MM-DD') + " 00:00:00" : null,
          denLapPhieu: this.denLapPhieu != null ? dayjs(this.denLapPhieu).format('YYYY-MM-DD') + " 23:59:59": null,
          "ngayKiemTraDenNgay": this.searchFilter.ngayTongHop && this.searchFilter.ngayTongHop.length > 1
            ? dayjs(this.searchFilter.ngayTongHop[1]).format('YYYY-MM-DD')
            : null,
          "ngayKiemTraTuNgay": this.searchFilter.ngayTongHop && this.searchFilter.ngayTongHop.length > 0
            ? dayjs(this.searchFilter.ngayTongHop[0]).format('YYYY-MM-DD')
            : null,
          "ngayLapPhieu": null,
          "orderBy": null,
          "orderDirection": null,
          "paggingReq": null,
          "soPhieu": this.searchFilter.soPhieu,
          "soQd": this.searchFilter.soQuyetDinh,
          "str": null,
          "tenNguoiGiao": null,
          "trangThai": null
        };
        this.phieuKtraCluongService
          .export(body)
          .subscribe((blob) =>
            saveAs(blob, 'danh-sach-phieu-kiem-tra-chat-luong-hang.xlsx'),
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
            let res = await this.phieuKtraCluongService.deleteMuti({ ids: dataDelete });
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

  filterInTable(key: string, value: string) {
    if (value && value != '') {
      this.dataTable = [];
      let temp = [];
      if (this.dataTableAll && this.dataTableAll.length > 0) {
        this.dataTableAll.forEach((item) => {
          if (item[key] && item[key].toString().toLowerCase().indexOf(value.toLowerCase()) != -1) {
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
      soPhieu: '',
      ngayGdinh: '',
      kqDanhGia: '',
      soQuyetDinhNhap: '',
      soBienBan: '',
      tenDiemKho: '',
      tenNganLo: '',
      tenNhaKho: '',
      tenTrangThai: '',
    }
  }

  print() {

  }

  expandSet = new Set<number>();
  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  expandSet2 = new Set<number>();
  onExpandChange2(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet2.add(id);
    } else {
      this.expandSet2.delete(id);
    }
  }

  disabledStartDate = (startValue: Date): boolean => {
    if (!startValue || !this.denLapPhieu) {
      return false;
    }
    return startValue.getTime() > this.denLapPhieu.getTime();
  };

  disabledEndDate = (endValue: Date): boolean => {
    if (!endValue || !this.tuLapPhieu) {
      return false;
    }
    return endValue.getTime() <= this.tuLapPhieu.getTime();
  };

  disabledTuNgayGiaoDinh = (startValue: Date): boolean => {
    if (!startValue || !this.denNgayGiamDinh) {
      return false;
    }
    return startValue.getTime() > this.denNgayGiamDinh.getTime();
  };

  disabledDenNgayGiamDinh = (endValue: Date): boolean => {
    if (!endValue || !this.tuNgayGiamDinh) {
      return false;
    }
    return endValue.getTime() <= this.tuNgayGiamDinh.getTime();
  };
}
