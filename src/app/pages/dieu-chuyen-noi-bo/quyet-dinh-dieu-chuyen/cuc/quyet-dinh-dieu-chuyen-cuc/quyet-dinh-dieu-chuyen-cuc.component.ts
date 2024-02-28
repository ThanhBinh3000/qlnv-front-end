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
import { QuyetDinhDieuChuyenCucService } from 'src/app/services/dieu-chuyen-noi-bo/quyet-dinh-dieu-chuyen/quyet-dinh-dieu-chuyen-c.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-quyet-dinh-dieu-chuyen-cuc',
  templateUrl: './quyet-dinh-dieu-chuyen-cuc.component.html',
  styleUrls: ['./quyet-dinh-dieu-chuyen-cuc.component.scss']
})
export class QuyetDinhDieuChuyenCucComponent extends Base2Component implements OnInit {
  @Input() isViewOnModal: boolean;

  isVisibleChangeTab$ = new Subject();
  visibleTab: boolean = true;
  tabSelected: number = 0;

  selectedId: number = 0;
  isView = false;
  maQd: string = null;
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
    private quyetDinhDieuChuyenCucService: QuyetDinhDieuChuyenCucService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, quyetDinhDieuChuyenCucService);
    this.formData = this.fb.group({
      nam: null,
      soQdinh: null,
      ngayDuyetTcTu: null,
      ngayDuyetTcDen: null,
      ngayHieuLucTu: null,
      ngayHieuLucDen: null,
      loaiDc: null,
      trichYeu: null,
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
    this.maQd = this.userInfo.MA_QD || '';
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
    if (startValue && this.formData.value.ngayDuyetTcDen) {
      return startValue.getTime() > this.formData.value.ngayDuyetTcDen.getTime();
    } else {
      return false;
    }
  };

  disabledEndNgayQD = (endValue: Date): boolean => {
    if (endValue && this.formData.value.ngayDuyetTcTu) {
      return endValue.getTime() < this.formData.value.ngayDuyetTcTu.getTime();
    } else {
      return false;
    }
  };

  disabledStartNgayHL = (startValue: Date): boolean => {
    if (startValue && this.formData.value.ngayHieuLucDen) {
      return startValue.getTime() > this.formData.value.ngayHieuLucDen.getTime();
    } else {
      return false;
    }
  };

  disabledEndNgayHL = (endValue: Date): boolean => {
    if (endValue && this.formData.value.ngayHieuLucTu) {
      return endValue.getTime() < this.formData.value.ngayHieuLucTu.getTime();
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
    if (this.formData.value.ngayDuyetTcTu) {
      this.formData.value.ngayDuyetTcTu = dayjs(this.formData.value.ngayDuyetTcTu).format('YYYY-MM-DD')
    }
    if (this.formData.value.ngayDuyetTcDen) {
      this.formData.value.ngayDuyetTcDen = dayjs(this.formData.value.ngayDuyetTcDen).format('YYYY-MM-DD')
    }
    if (this.formData.value.ngayHieuLucTu) {
      this.formData.value.ngayHieuLucTu = dayjs(this.formData.value.ngayHieuLucTu).format('YYYY-MM-DD')
    }
    if (this.formData.value.ngayHieuLucDen) {
      this.formData.value.ngayHieuLucDen = dayjs(this.formData.value.ngayHieuLucDen).format('YYYY-MM-DD')
    }
    if (this.formData.value.soQdinh) this.formData.value.soQdinh = `${this.formData.value.soQdinh}/${this.maQd}`
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
        this.quyetDinhDieuChuyenCucService
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
