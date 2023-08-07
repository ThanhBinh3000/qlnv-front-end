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
import { QuyetDinhGiaoNvNhapHangService } from 'src/app/services/qlnv-hang/nhap-hang/mua-truc-tiep/qdinh-giao-nvu-nh/quyetDinhGiaoNvNhapHang.service';


@Component({
  selector: 'app-phieu-nhap-kho',
  templateUrl: './phieu-nhap-kho.component.html',
  styleUrls: ['./phieu-nhap-kho.component.scss'],
})
export class PhieuNhapKhoComponent implements OnInit {
  @Input() loaiVthh: string;

  searchFilter = {
    namKh: dayjs().get('year'),
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
    private quyetDinhGiaoNvNhapHangService: QuyetDinhGiaoNvNhapHangService,
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
      namKh: dayjs().get('year'),
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
          this.phieuNhapKhoMuaTrucTiepService.delete(body).then(async (res) => {
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
      trangThai: STATUS.BAN_HANH,
      maDvi: this.userInfo.MA_DVI,
      paggingReq: {
        limit: this.pageSize,
        page: this.page - 1,
      },
    };
    let res = await this.quyetDinhGiaoNvNhapHangService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.dataTable = data.content;
      // this.convertDataTable();
      this.dataTable.forEach(item => {
        if (this.userService.isChiCuc()) {
          item.detail = item.hhQdGiaoNvNhangDtlList.filter(y => y.maDvi == this.userInfo.MA_DVI)[0]
          item.detail = {
            children: item.detail.children.filter(x => x.maDiemKho.includes(this.userInfo.MA_DVI))
          }
        } else {
          let data = [];
          item.hhQdGiaoNvNhangDtlList.forEach(res => {
            data = [...data, ...res.children.filter(x => x.idDtl == res.id)];
          })
          item.detail = {
            hhQdGiaoNvNhDdiemList: data,
          }
        };
      });
      this.dataTableAll = cloneDeep(this.dataTable);
      console.log(this.dataTable)
      this.totalRecord = data.totalElements;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    await this.spinner.hide();
  }

  convertDataTable() {
    this.dataTable.forEach(item => {
      if (this.userService.isChiCuc()) {
        item.detail = item.hhPhieuNhapKhoHdrList.filter(item => item.maDvi == this.userInfo.MA_DVI)[0]
      } else {
        let data = [];
        item.hhPhieuNhapKhoHdrList.forEach(item => {
          // data = [...data, ...item.children];
        })
        item.detail = {
          // children: data
        }
      };
    });
    console.log(this.dataTable)
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
