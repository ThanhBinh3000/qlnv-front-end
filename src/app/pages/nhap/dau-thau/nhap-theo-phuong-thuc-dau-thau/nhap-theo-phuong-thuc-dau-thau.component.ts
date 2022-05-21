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
    donViId: '',
    tenDonVi: '',
    trichYeu: '',
    namKeHoach: '',
  };
  listNam: any[] = [];
  loaiVthh: string = '';

  constructor(
    private spinner: NgxSpinnerService,
    private donViService: DonviService,
    private quyetDinhGiaoNhapHangService: QuyetDinhGiaoNhapHangService,
    private notification: NzNotificationService,
    private router: Router,
    private modal: NzModalService,
    private route: ActivatedRoute,
    public userService: UserService
  ) { }

  async ngOnInit() {
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
    this.router.navigate(['/nhap/nhap-theo-ke-hoach/nhap-theo-phuong-thuc-dau-thau/' + this.route.snapshot.paramMap.get('type')]);
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

  redirectToChiTiet(id: number) {
    this.router.navigate([
      `/${NHAP_MAIN_ROUTE}/${NHAP_THEO_KE_HOACH}/${NHAP_THEO_PHUONG_THUC_DAU_THAU}/${THOC}/thong-tin-quyet-dinh-giao-nhiem-vu-nhap-hang`,
      id,
    ]);
  }

  clearFilter() {
    this.soQD = null;
    this.startValue = null;
    this.canCu = null;
    this.inputDonVi = null;
    this.loaiVTHH = null;
    this.loaiQd = null;
  }

  async search() {
    let maDonVi = null;
    if (this.inputDonVi && this.inputDonVi.length > 0) {
      let getDonVi = this.optionsDonVi.filter(
        (x) => x.labelDonVi == this.inputDonVi,
      );
      if (getDonVi && getDonVi.length > 0) {
        maDonVi = getDonVi[0].maDvi;
      }
    }
    let body = {
      loaiQd: this.loaiQd,
      maDvi: maDonVi,
      maVthh: this.loaiVTHH,
      ngayQd: this.startValue
        ? dayjs(this.startValue).format('YYYY-MM-DD')
        : null,
      orderBy: null,
      orderDirection: null,
      paggingReq: {
        limit: this.pageSize,
        page: this.page,
      },
      soHd: this.soHd,
      soQd: this.soQD,
      str: null,
      trangThai: null,
    };
    let res = await this.quyetDinhGiaoNhapHangService.timKiem(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      if (data && data.content && data.content.length > 0) {
        this.dataTable = data.content;
        for (let i = 0; i < this.dataTable.length; i++) {
          let item = this.dataTable[i];
          if (item && item.children && item.children.length > 0) {
            this.dataTable[i].tenHangDTQG = item.children[0].tenVthh;
          }
        }
      }
      this.totalRecord = data.totalElements;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
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
        let maDonVi = null;
        if (this.inputDonVi && this.inputDonVi.length > 0) {
          let getDonVi = this.optionsDonVi.filter(
            (x) => x.labelDonVi == this.inputDonVi,
          );
          if (getDonVi && getDonVi.length > 0) {
            maDonVi = getDonVi[0].maDvi;
          }
        }
        let body = {
          loaiQd: this.loaiQd,
          maDvi: maDonVi,
          maVthh: this.loaiVTHH,
          ngayQd: this.startValue
            ? dayjs(this.startValue).format('YYYY-MM-DD')
            : null,
          orderBy: null,
          orderDirection: null,
          paggingReq: null,
          soHd: this.soHd,
          soQd: this.soQD,
          str: null,
          trangThai: null,
        };
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

  xemDanhSachQuyetDinh() {

  }

  chiTietQuyetDinh(isView: boolean, id: number) {
    this.router.navigate([
      `/nhap/nhap-theo-ke-hoach/nhap-theo-phuong-thuc-dau-thau/Th%C3%B3c/chi-tiet/${id}/bien-ban`,
    ]);
  }
}
