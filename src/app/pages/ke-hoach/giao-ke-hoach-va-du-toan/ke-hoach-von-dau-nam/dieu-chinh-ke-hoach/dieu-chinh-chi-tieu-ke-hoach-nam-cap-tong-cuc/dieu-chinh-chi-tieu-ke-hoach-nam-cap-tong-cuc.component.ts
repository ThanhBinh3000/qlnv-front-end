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
import { QuyetDinhDieuChinhCTKHService } from 'src/app/services/dieu-chinh-chi-tieu-ke-hoach/quyet-dinh-dieu-chinh-ctkh';
import { QuyetDinhDieuChuyenCucService } from 'src/app/services/dieu-chuyen-noi-bo/quyet-dinh-dieu-chuyen/quyet-dinh-dieu-chuyen-c.service';
import { StorageService } from 'src/app/services/storage.service';
import { chain, cloneDeep } from 'lodash';
@Component({
  selector: 'app-dieu-chinh-chi-tieu-ke-hoach-nam-cap-tong-cuc',
  templateUrl: './dieu-chinh-chi-tieu-ke-hoach-nam-cap-tong-cuc.component.html',
  styleUrls: ['./dieu-chinh-chi-tieu-ke-hoach-nam-cap-tong-cuc.component.scss'],
})
export class DieuChinhChiTieuKeHoachNamComponent extends Base2Component implements OnInit {
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

  indexTab: number = 0;


  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private quyetDinhDieuChinhCTKHService: QuyetDinhDieuChinhCTKHService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, quyetDinhDieuChinhCTKHService);
    this.formData = this.fb.group({
      namKeHoach: [],
      soQuyetDinh: [],
      ngayKyTu: [],
      ngayKyDen: [],
      trichYeu: [],
      type: ["02"],
      cap: [],
    })
    this.filterTable = {
      namKeHoach: '',
      soQuyetDinh: '',
      ngayKy: '',
      trichYeu: '',
      soQuyetDinhGiaoCuaTc: '',
      soCongVan: '',
      soQuyetDinhDcCuaC: '',
      tenTrangThai: '',
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

  selectTab(cap: number) {
    this.allChecked = false
    this.indexTab = cap;
    this.timKiem();
  }

  updateAllCheckedDC(): void {
    this.indeterminate = false;
    if (this.allChecked) {
      if (this.dataTable && this.dataTable.length > 0) {
        this.dataTable.forEach((item) => {
          if (item.trangThai == this.STATUS.DANG_NHAP_DU_LIEU) {
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

  isButton() {
    if (this.isTongCuc() && this.indexTab == 0) return true
    if (this.isCuc() && this.indexTab == 1) return true
    return false
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
    // if (this.formData.value.soQdinh) this.formData.value.soQdinh = `${this.formData.value.soQdinh}/DCNB`
    if (this.indexTab == 0) {
      await this.searchTc();
    } else {
      await this.search();
    }

  }

  clearFormDCCTKH(currentSearch?: any) {
    this.formData.reset();
    if (currentSearch) {
      this.formData.patchValue(currentSearch)
    }
    this.formData.patchValue({
      cap: this.userInfo.CAP_DVI,
      type: "02"
    })
    this.timKiem();
  }

  async searchTc(roles?) {
    if (!this.checkPermission(roles)) {
      return
    }
    await this.spinner.show();
    try {
      let body = this.formData.value
      body.paggingReq = {
        limit: this.pageSize,
        page: this.page - 1
      }
      let res = await this.quyetDinhDieuChinhCTKHService.searchTc(body);
      if (res.msg == MESSAGE.SUCCESS) {
        let data = res.data;
        this.dataTable = data.content;
        this.totalRecord = data.totalElements;
        if (this.dataTable && this.dataTable.length > 0) {
          this.dataTable.forEach((item) => {
            item.checked = false;
          });
        }
        this.dataTableAll = cloneDeep(this.dataTable);
      } else {
        this.dataTable = [];
        this.totalRecord = 0;
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
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
          this.quyetDinhDieuChinhCTKHService.xoa(body).then(async () => {
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
            let res = await this.quyetDinhDieuChinhCTKHService.xoa({ ids: dataDelete });
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

        if (this.indexTab == 0) {
          this.quyetDinhDieuChinhCTKHService
            .exportlistTc(body)
            .subscribe((blob) =>
              saveAs(blob, 'quyet-dinh-dieu-chinh-chi-tieu-kh-tc.xlsx'),
            );
        } else {
          this.quyetDinhDieuChinhCTKHService
            .exportlist(body)
            .subscribe((blob) =>
              saveAs(blob, 'quyet-dinh-dieu-chinh-chi-tieu-kh.xlsx'),
            );
        }

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

