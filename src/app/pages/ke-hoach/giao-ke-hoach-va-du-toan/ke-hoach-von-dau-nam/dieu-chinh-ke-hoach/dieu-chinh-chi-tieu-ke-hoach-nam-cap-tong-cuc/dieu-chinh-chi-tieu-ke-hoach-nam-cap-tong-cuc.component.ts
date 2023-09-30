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
      nam: '',
      soQdinh: '',
      ngayKyQdinh: '',
      tenLoaiDc: '',
      tenLoaiQdinh: '',
      trichYeu: '',
      soDxuat: '',
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

  disabledStartNgayQD = (startValue: Date): boolean => {
    if (startValue && this.formData.value.ngayKyDen) {
      return startValue.getTime() > this.formData.value.ngayKyDen.getTime();
    } else {
      return false;
    }
  };

  disabledEndNgayQD = (endValue: Date): boolean => {
    if (endValue && this.formData.value.ngayKyTu) {
      return endValue.getTime() < this.formData.value.ngayKyTu.getTime();
    } else {
      return false;
    }
  };

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

  exportDataCuc() {
    if (this.totalRecord > 0) {
      this.spinner.show();
      try {

        let body = this.formData.value;
        debugger
        if (this.formData.value.ngayDuyetTc) {
          body.ngayDuyetTcTu = body.ngayDuyetTc[0];
          body.ngayDuyetTcDen = body.ngayDuyetTc[1];
        }
        if (this.formData.value.ngayHieuLuc) {
          body.ngayHieuLucTu = body.ngayHieuLuc[0];
          body.ngayHieuLucDen = body.ngayHieuLuc[1];
        }
        this.quyetDinhDieuChinhCTKHService
          .export(body)
          .subscribe((blob) =>
            saveAs(blob, 'quyet-dinh-dieu-chuyen-cuc.xlsx'),
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

