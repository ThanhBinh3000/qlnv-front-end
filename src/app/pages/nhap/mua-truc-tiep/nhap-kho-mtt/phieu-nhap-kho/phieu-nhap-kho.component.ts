import { saveAs } from 'file-saver';
import { cloneDeep } from 'lodash';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DonviService } from 'src/app/services/donvi.service';
import { MESSAGE } from 'src/app/constants/message';
import * as dayjs from 'dayjs';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { UserLogin } from 'src/app/models/userlogin';
import { UserService } from 'src/app/services/user.service';
import { convertTrangThai } from 'src/app/shared/commonFunction';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Globals } from 'src/app/shared/globals';
import { STATUS } from "../../../../../constants/status";
import { PhieuNhapKhoMuaTrucTiepService } from 'src/app/services/phieu-nhap-kho-mua-truc-tiep.service';


@Component({
  selector: 'app-phieu-nhap-kho',
  templateUrl: './phieu-nhap-kho.component.html',
  styleUrls: ['./phieu-nhap-kho.component.scss'],
})
export class PhieuNhapKhoComponent implements OnInit {
  @Input() loaiVthh: string;

  searchFilter = {
    namKh: '',
    soQuyetDinhNhap: '',
    soPhieuNhapKho: '',
    ngayNkho: '',
  };

  filterTable: any = {
    soQuyetDinhNhap: '',
    soPhieu: '',
    ngayNhapKho: '',
    tenDiemKho: '',
    tenNhaKho: '',
    tenNganLo: '',
    tenTrangThai: '',
  };

  userInfo: UserLogin;
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  STATUS = STATUS
  totalRecord: number = 0;
  dataTable: any[] = [];
  dataTableAll: any[] = [];
  isDetail: boolean = false;
  selectedId: number = 0;
  isView: boolean = false;
  isTatCa: boolean = false;
  idQdGiaoNvNh: number = 0;
  allChecked = false;
  indeterminate = false;
  listNam: any[] = [];

  constructor(
    private spinner: NgxSpinnerService,
    private donViService: DonviService,
    private phieuNhapKhoMuaTrucTiepService: PhieuNhapKhoMuaTrucTiepService,
    private notification: NzNotificationService,
    private router: Router,
    public userService: UserService,
    private modal: NzModalService,
    public globals: Globals,
  ) { }

  async ngOnInit() {
    this.spinner.show();
    try {
      this.userInfo = this.userService.getUserLogin();
      for (let i = -3; i < 23; i++) {
        this.listNam.push({
          value: dayjs().get('year') - i,
          text: dayjs().get('year') - i,
        });
      }
      await Promise.all([
        this.search(),
      ]);
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
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
      soQuyetDinhNhap: '',
      soPhieuNhapKho: '',
      ngayNkho: '',
      namKh: ''
    };
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
          let body = {
            id: item.id,
            maDvi: '',
          };
          this.phieuNhapKhoMuaTrucTiepService.delete(body).then(async () => {
            this.search();
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

  async search() {
    await this.spinner.show();
    let body = {
      ngayNhapKhoTu: this.searchFilter.ngayNkho
        ? dayjs(this.searchFilter.ngayNkho[0]).format('YYYY-MM-DD')
        : null,
      ngayNhapKhoDen: this.searchFilter.ngayNkho
        ? dayjs(this.searchFilter.ngayNkho[1]).format('YYYY-MM-DD')
        : null,
      namKh: this.searchFilter.namKh,
      soQuyetDinhNhap: this.searchFilter.soQuyetDinhNhap,
      soPhieuNhapKho: this.searchFilter.soPhieuNhapKho,
      maDvi: this.userInfo.MA_DVI,
      paggingReq: {
        limit: this.pageSize,
        page: this.page - 1,
      },
    };
    let res = await this.phieuNhapKhoMuaTrucTiepService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.dataTable = data.content;
      this.dataTableAll = cloneDeep(this.dataTable);
      this.totalRecord = data.totalElements;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    await this.spinner.hide();
  }

  export() {
    if (this.totalRecord && this.totalRecord > 0) {
      this.spinner.show();
      try {
        let body = {
          ngayNhapKhoTu: this.searchFilter.ngayNkho
            ? dayjs(this.searchFilter.ngayNkho[0]).format('YYYY-MM-DD')
            : null,
          ngayNhapKhoDen: this.searchFilter.ngayNkho
            ? dayjs(this.searchFilter.ngayNkho[1]).format('YYYY-MM-DD')
            : null,
          namKh: this.searchFilter.namKh,
          soQuyetDinhNhap: this.searchFilter.soQuyetDinhNhap,
          soPhieuNhapKho: this.searchFilter.soPhieuNhapKho,
        };
        this.phieuNhapKhoMuaTrucTiepService
          .export(body)
          .subscribe((blob) =>
            saveAs(blob, 'danh-sach-phieu-nhap-kho.xlsx'),
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

  expandSet2 = new Set<number>();
  onExpandChange2(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet2.add(id);
    } else {
      this.expandSet2.delete(id);
    }
  }
}
