import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import dayjs from 'dayjs';
import { saveAs } from 'file-saver';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { MESSAGE } from 'src/app/constants/message';
import { DeXuatDieuChinhCTKHService } from 'src/app/services/dieu-chinh-chi-tieu-ke-hoach/de-xuat-dieu-chinh-ctkh';
import { QuyetDinhDieuChuyenCucService } from 'src/app/services/dieu-chuyen-noi-bo/quyet-dinh-dieu-chuyen/quyet-dinh-dieu-chuyen-c.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-de-xuat-dieu-chinh',
  templateUrl: './de-xuat-dieu-chinh.component.html',
  styleUrls: ['./de-xuat-dieu-chinh.component.scss'],
})
export class DeXuatDieuChinhComponent extends Base2Component implements OnInit {
  @Input() isViewOnModal: boolean;

  isVisibleChangeTab$ = new Subject();
  visibleTab: boolean = true;
  tabSelected: number = 0;

  selectedId: number = 0;
  isView = false;

  listLoaiDieuChuyen: any[] = [
    { ma: "DCNB", ten: "Trong nội bộ chi cục" },
    { ma: "CHI_CUC", ten: "Giữa 2 chi cục trong cùng 1 cục" },
    { ma: "CUC", ten: "Giữa 2 cục DTNN KV" }
  ];


  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private deXuatDieuChinhCTKHService: DeXuatDieuChinhCTKHService
  ) {
    super(httpClient, storageService, notification, spinner, modal, deXuatDieuChinhCTKHService);
    this.formData = this.fb.group({
      namKeHoach: [],
      tenDonVi: [],
      soDeXuat: [],
      ngayKyTu: [],
      ngayKyDen: [],
      trichYeu: [],
      type: ["00"],
      cap: [],
    })
    this.filterTable = {
      namKeHoach: '',
      soDeXuat: '',
      tenDonVi: '',
      ngayKy: '',
      trichYeu: '',
      soQuyetDinhGiaoCuaTc: '',
      // tenTrangThaiDX: '',
      tenTrangThai: '',
      soQuyetDinh: '',
    };
  }

  async ngOnInit() {
    this.isVisibleChangeTab$.subscribe((value: boolean) => {
      this.visibleTab = value;
    });

    this.formData.patchValue({
      cap: this.userInfo.CAP_DVI
    })

    try {
      this.initData()
      await this.timKiem();
      await this.spinner.hide();

    } catch (e) {
      console.log('error: ', e)
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }


  }

  async initData() {
    this.userInfo = this.userService.getUserLogin();
  }

  // disabledStartNgayQD = (startValue: Date): boolean => {
  //   if (startValue && this.formData.value.ngayKyDen) {
  //     return startValue.getTime() > this.formData.value.ngayKyDen.getTime();
  //   } else {
  //     return false;
  //   }
  // };

  // disabledEndNgayQD = (endValue: Date): boolean => {
  //   if (endValue && this.formData.value.ngayKyTu) {
  //     return endValue.getTime() < this.formData.value.ngayKyTu.getTime();
  //   } else {
  //     return false;
  //   }
  // };

  isShowDS() {
    if (this.isChiCuc()) return true
    else if (this.userService.isAccessPermisson('DCNB_QUYETDINHDC_CUC') && this.userService.isAccessPermisson('DCNB_QUYETDINHDC_XEM'))
      return true
    else return false
  }

  isTongCuc() {
    return this.userService.isTongCuc()
  }

  isCuc() {
    return this.userService.isCuc()
  }

  isChiCuc() {
    return this.userService.isChiCuc()
  }

  async timKiem() {
    if (this.formData.value.ngayKyTu) {
      this.formData.value.ngayKyTu = dayjs(this.formData.value.ngayDuyetTcTu).format('YYYY-MM-DD')
    }
    if (this.formData.value.ngayKyDen) {
      this.formData.value.ngayKyDen = dayjs(this.formData.value.ngayKyDen).format('YYYY-MM-DD')
    }
    if (this.formData.value.soQdinh) this.formData.value.soQdinh = `${this.formData.value.soQdinh}/DCNB`
    await this.search();
  }

  xoaMulti(roles?) {
    if (!this.checkPermission(roles)) {
      return
    }
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
            let res = await this.deXuatDieuChinhCTKHService.xoa({ ids: dataDelete });
            if (res.msg == MESSAGE.SUCCESS) {
              this.notification.success(MESSAGE.SUCCESS, MESSAGE.DELETE_SUCCESS);
              await this.search();
              this.allChecked = false;
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
      });
    } else {
      this.notification.error(MESSAGE.ERROR, "Không có dữ liệu phù hợp để xóa.");
    }
  }

  xoa(item: any, roles?) {
    if (!this.checkPermission(roles)) {
      return
    }
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
            // id: item.id,
            ids: [item.id]
          };
          this.deXuatDieuChinhCTKHService.xoa(body).then(async () => {
            await this.search();
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

  exportDataCuc() {
    if (this.totalRecord > 0) {
      this.spinner.show();
      try {
        if (this.formData.value.ngayKyTu) {
          this.formData.value.ngayKyTu = dayjs(this.formData.value.ngayDuyetTcTu).format('YYYY-MM-DD')
        }
        if (this.formData.value.ngayKyDen) {
          this.formData.value.ngayKyDen = dayjs(this.formData.value.ngayKyDen).format('YYYY-MM-DD')
        }
        let body = this.formData.value;

        this.deXuatDieuChinhCTKHService
          .exportlist(body)
          .subscribe((blob) =>
            saveAs(blob, 'de-xuat-dieu-chinh-chi-tieu-kh.xlsx'),
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

  redirectDetail(id, b: boolean) {
    this.selectedId = id;
    this.isDetail = true;
    this.isView = b;
  }

  quayLai() {
    this.showListEvent.emit();
    this.isDetail = false;
    this.isView = false;
    this.timKiem();
  }


}
