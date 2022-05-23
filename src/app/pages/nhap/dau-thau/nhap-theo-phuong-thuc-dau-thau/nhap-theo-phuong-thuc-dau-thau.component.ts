import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import dayjs from 'dayjs';
import { saveAs } from 'file-saver';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogCanCuHopDongComponent } from 'src/app/components/dialog/dialog-can-cu-hop-dong/dialog-can-cu-hop-dong.component';
import {
  LOAI_HANG_DTQG,
  LOAI_QUYET_DINH,
  PAGE_SIZE_DEFAULT,
} from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { DonviService } from 'src/app/services/donvi.service';
import { QuyetDinhGiaoNhapHangService } from 'src/app/services/quyetDinhGiaoNhapHang.service';
import { convertTrangThai } from 'src/app/shared/commonFunction';
import {
  GAO,
  MUOI,
  NHAP_MAIN_ROUTE,
  NHAP_THEO_KE_HOACH,
  NHAP_THEO_PHUONG_THUC_DAU_THAU,
  THOC,
} from '../../../nhap/nhap.constant';
import { convertTenVthh } from 'src/app/shared/commonFunction';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'nhap-theo-phuong-thuc-dau-thau',
  templateUrl: './nhap-theo-phuong-thuc-dau-thau.component.html',
  styleUrls: ['./nhap-theo-phuong-thuc-dau-thau.component.scss'],
})
export class NhapTheoPhuongThucDauThauComponent implements OnInit {
  inputDonVi: string = '';
  options: any[] = [];
  optionsDonVi: any[] = [];

  startValue: Date | null = null;

  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 0;
  dataTable: any[] = [];

  thocIdDefault: string = LOAI_HANG_DTQG.THOC;
  gaoIdDefault: string = LOAI_HANG_DTQG.GAO;
  muoiIdDefault: string = LOAI_HANG_DTQG.MUOI;

  nhapIdDefault: string = LOAI_QUYET_DINH.NHAP;
  xuatIdDefault: string = LOAI_QUYET_DINH.XUAT;

  loaiVTHH: string = null;
  soQD: string = null;
  canCu: string = null;
  loaiQd: string = null;
  soHd: string = null;

  selectedCanCu: any = null;
  searchFilter = {
    soQD: '',
    ngayQuyetDinh: '',
    namNhap: '',
    noiDungCongVan: ''
  };
  listNam: any[] = [];
  loaiVthh: string = '';
  routerUrl: string;

  constructor(
    private spinner: NgxSpinnerService,
    private donViService: DonviService,
    private quyetDinhGiaoNhapHangService: QuyetDinhGiaoNhapHangService,
    private notification: NzNotificationService,
    private router: Router,
    private modal: NzModalService,
    private route: ActivatedRoute,
    public userService: UserService,
  ) { }

  async ngOnInit() {
    this.routerUrl = this.router.url;
    this.spinner.show();
    try {
      this.getTitleVthh();
      let dayNow = dayjs().get('year');
      for (let i = -3; i < 23; i++) {
        this.listNam.push({
          value: dayNow - i,
          text: dayNow - i,
        });
      }
      let res = await this.donViService.layTatCaDonVi();
      this.optionsDonVi = [];
      if (res.msg == MESSAGE.SUCCESS) {
        for (let i = 0; i < res.data.length; i++) {
          var item = {
            ...res.data[i],
            labelDonVi: res.data[i].maDvi + ' - ' + res.data[i].tenDvi,
          };
          this.optionsDonVi.push(item);
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
      await this.search();
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  getTitleVthh() {
    this.loaiVthh = convertTenVthh(this.route.snapshot.paramMap.get('type'));
    this.router.navigate([
      '/nhap/nhap-theo-ke-hoach/nhap-theo-phuong-thuc-dau-thau/' +
      this.route.snapshot.paramMap.get('type'),
    ]);
  }

  openDialogHopDong() {
    const modalQD = this.modal.create({
      nzTitle: 'Thông tin căn cứ trên hợp đồng',
      nzContent: DialogCanCuHopDongComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {},
    });
    modalQD.afterClose.subscribe((data) => {
      if (data) {
        this.soHd = data.soHdong;
      }
    });
  }

  onInput(e: Event): void {
    const value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.options = [];
    } else {
      this.options = this.optionsDonVi.filter(
        (x) => x.labelDonVi.toLowerCase().indexOf(value.toLowerCase()) != -1,
      );
    }
  }

  redirectToThongTin(id: number) {
    this.router.navigate([
      `/${NHAP_MAIN_ROUTE}/${NHAP_THEO_KE_HOACH}/${NHAP_THEO_PHUONG_THUC_DAU_THAU}/${THOC}/thong-tin`,
      id,
    ]);
  }
  redirectToChiTiet(id: number) {
    this.router.navigate([
      `/${NHAP_MAIN_ROUTE}/${NHAP_THEO_KE_HOACH}/${NHAP_THEO_PHUONG_THUC_DAU_THAU}/${THOC}/chi-tiet`,
      id,
    ]);
  }

  clearFilter() {
    this.searchFilter = {
      soQD: '',
      ngayQuyetDinh: '',
      namNhap: '',
      noiDungCongVan: ''
    }
    this.search();
  }

  async search() {
    this.spinner.show();
    let body = {
      "denNgayQd": this.searchFilter.ngayQuyetDinh
        ? dayjs(this.searchFilter.ngayQuyetDinh[1]).format('YYYY-MM-DD')
        : null,
      "loaiQd": "",
      "maDvi": "",
      "maVthh": "",
      "namNhap": this.searchFilter.namNhap,
      "ngayQd": "",
      "orderBy": "",
      "orderDirection": "",
      "paggingReq": {
        "limit": this.pageSize,
        "orderBy": "",
        "orderType": "",
        "page": this.page - 1
      },
      "soHd": "",
      "soQd": this.searchFilter.soQD.trim(),
      "str": "",
      "trangThai": "",
      "tuNgayQd": this.searchFilter.ngayQuyetDinh
        ? dayjs(this.searchFilter.ngayQuyetDinh[0]).format('YYYY-MM-DD')
        : null,
      "veViec": this.searchFilter.noiDungCongVan.trim()
    }
    let res = await this.quyetDinhGiaoNhapHangService.timKiem(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.dataTable = data.content;
      this.totalRecord = data.totalElements;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    this.spinner.hide();
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
          this.quyetDinhGiaoNhapHangService.xoa({ id: item.id }).then((res) => {
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

  export() {
    if (this.totalRecord > 0) {
      this.spinner.show();
      try {
        let body = {
          "denNgayQd": this.searchFilter.ngayQuyetDinh
            ? dayjs(this.searchFilter.ngayQuyetDinh[1]).format('YYYY-MM-DD')
            : null,
          "loaiQd": "",
          "maDvi": "",
          "maVthh": "",
          "namNhap": this.searchFilter.namNhap,
          "ngayQd": "",
          "orderBy": "",
          "orderDirection": "",
          "paggingReq": {
            "limit": null,
            "orderBy": "",
            "orderType": "",
            "page": null
          },
          "soHd": "",
          "soQd": this.searchFilter.soQD.trim(),
          "str": "",
          "trangThai": "",
          "tuNgayQd": this.searchFilter.ngayQuyetDinh
            ? dayjs(this.searchFilter.ngayQuyetDinh[0]).format('YYYY-MM-DD')
            : null,
          "veViec": this.searchFilter.noiDungCongVan.trim()
        }
        this.quyetDinhGiaoNhapHangService
          .exportList(body)
          .subscribe((blob) =>
            saveAs(blob, 'danh-sach-quyet-dinh-giao-nhiem-vu-nhap-hang.xlsx'),
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

  duyet(item: any) {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn duyệt?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: async () => {
        this.spinner.show();
        try {
          let body = {
            id: item.id,
            lyDoTuChoi: null,
            trangThai: '02',
          };
          let res = await this.quyetDinhGiaoNhapHangService.updateStatus(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
            this.search();
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

  chiTietQuyetDinh(isView: boolean, id: number) {
    this.router.navigate([
      `/nhap/nhap-theo-ke-hoach/nhap-theo-phuong-thuc-dau-thau/thoc/chi-tiet/${id}/bien-ban`,
    ]);
  }

}
