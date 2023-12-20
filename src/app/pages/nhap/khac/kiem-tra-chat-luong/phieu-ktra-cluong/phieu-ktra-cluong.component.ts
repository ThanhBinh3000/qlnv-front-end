import {Component, Input, OnInit} from '@angular/core';
import {STATUS} from "../../../../../constants/status";
import {PAGE_SIZE_DEFAULT} from "../../../../../constants/config";
import {UserLogin} from "../../../../../models/userlogin";
import {NgxSpinnerService} from "ngx-spinner";
import {DonviService} from "../../../../../services/donvi.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {Router} from "@angular/router";
import {NzModalService} from "ng-zorro-antd/modal";
import {UserService} from "../../../../../services/user.service";
import {Globals} from "../../../../../shared/globals";
import dayjs from "dayjs";
import {MESSAGE} from "../../../../../constants/message";
import {PhieuKtraCluongService} from "../../../../../services/qlnv-hang/nhap-hang/nhap-khac/phieuKtraCluong.service";

@Component({
  selector: 'app-phieu-ktra-cluong',
  templateUrl: './phieu-ktra-cluong.component.html',
  styleUrls: ['./phieu-ktra-cluong.component.scss']
})
export class PhieuKtraCluongComponent implements OnInit {
  @Input() typeVthh: string;
  STATUS = STATUS;
  userInfo: UserLogin;
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 0;
  dataTable: any[] = [];
  dataTableAll: any[] = [];
  isDetail: boolean = false;
  selectedId: number = 0;
  isView: boolean = false;
  idQdGiaoNvNh: number = 0;
  listNam: any[] = [];
  searchFilter = {
    soPhieu: '',
    ketLuan: '',
    soQuyetDinh: '',
    namKh: dayjs().get('year'),
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
  tuNgayLP: Date | null = null;
  denNgayLP: Date | null = null;
  tuNgayGd: Date | null = null;
  denNgayGd: Date | null = null;
  constructor(
    private spinner: NgxSpinnerService,
    private donViService: DonviService,
    private phieuKtraCluongService: PhieuKtraCluongService,
    private notification: NzNotificationService,
    private router: Router,
    private modal: NzModalService,
    public userService: UserService,
    public globals: Globals,

  ) { }

  async ngOnInit() {
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
        this.search(),
      ])
      await this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      await this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  disabledTuNgayLP = (startValue: Date): boolean => {
    if (!startValue || !this.denNgayLP) {
      return false;
    }
    return startValue.getTime() > this.denNgayLP.getTime();
  };

  disabledDenNgayLP = (endValue: Date): boolean => {
    if (!endValue || !this.tuNgayLP) {
      return false;
    }
    return endValue.getTime() <= this.tuNgayLP.getTime();
  };

  disabledTuNgayGd = (startValue: Date): boolean => {
    if (!startValue || !this.denNgayGd) {
      return false;
    }
    return startValue.getTime() > this.denNgayLP.getTime();
  };

  disabledDenNgayGd = (endValue: Date): boolean => {
    if (!endValue || !this.tuNgayLP) {
      return false;
    }
    return endValue.getTime() <= this.tuNgayLP.getTime();
  };

  async clearFilter() {
    this.searchFilter = {
      soQuyetDinh: null,
      namKh: null,
      soPhieu: null,
      ketLuan: null
    };
    this.tuNgayLP = null;
    this.denNgayLP = null;
    this.tuNgayGd = null;
    this.denNgayGd = null;
    await this.search();
  }

  async search(){
    await this.spinner.show();
    let body = {
      "paggingReq": {
        "limit": this.pageSize,
        "page": this.page - 1
      },
      loaiVthh: this.typeVthh,
      soQd: this.searchFilter.soQuyetDinh,
      namKhoach: this.searchFilter.namKh,
      soPhieu: this.searchFilter.soPhieu,
      kqDanhGia: this.searchFilter.ketLuan,
      // trangThai: STATUS.BAN_HANH,
      tuNgayLP: this.tuNgayLP != null ? dayjs(this.tuNgayLP).format('YYYY-MM-DD') + " 00:00:00" : null,
      denNgayLP: this.denNgayLP != null ? dayjs(this.denNgayLP).format('YYYY-MM-DD') + " 24:59:59" : null,
      tuNgayGd: this.tuNgayGd != null ? dayjs(this.tuNgayGd).format('YYYY-MM-DD') + " 00:00:00" : null,
      denNgayGd: this.denNgayGd != null ? dayjs(this.denNgayGd).format('YYYY-MM-DD') + " 24:59:59" : null,
    };
    let res = await this.phieuKtraCluongService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.dataTable = data.content;
      this.dataTable.forEach(item => {
        item.expand = true
      })
      this.totalRecord = data.totalElements;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    await this.spinner.hide();
  }

  export() {

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

  hienThiXem(data){
    if (this.userService.isAccessPermisson('NHDTQG_NK_KTCL_LT_PKTCL_XEM') && data != null) {
      if(this.userService.isAccessPermisson('NHDTQG_NK_KTCL_LT_PKTCL_THEM') && (data.trangThai == STATUS.DU_THAO || data.trangThai == STATUS.TU_CHOI_LDCC)) {
        return false;
      } else if (this.userService.isAccessPermisson('NHDTQG_NK_KTCL_LT_PKTCL_DUYET_LDCCUC') && data.trangThai == STATUS.CHO_DUYET_LDCC) {
        return false;
      }
      return true;
    }
    return false;
  }

  setExpand(parantExpand: boolean = false, children: any = []): void {
    if (parantExpand) {
      return children.map(f => ({ ...f, expand: false }))
    }
    return children
  }
}
