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
import { QuyetDinhDieuChuyenTCService } from 'src/app/services/dieu-chuyen-noi-bo/quyet-dinh-dieu-chuyen/quyet-dinh-dieu-chuyen-tc.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-quan-ly-chung-thu-so',
  templateUrl: './quan-ly-chung-thu-so.component.html',
  styleUrls: ['./quan-ly-chung-thu-so.component.scss']
})
export class QuanLyChungThuSoComponent extends Base2Component implements OnInit {
  isVisibleChangeTab$ = new Subject();
  visibleTab: boolean = true;

  @Input()
  idTHop: number;
  @Input()
  qdDcId: number;
  @Input() isViewOnModal: boolean;

  selectedId: number = 0;
  isView = false;

  listLoaiDieuChuyen: any[] = [
    { ma: "ALL", ten: "Tất cả" },
    { ma: "CHI_CUC", ten: "Giữa 2 chi cục trong cùng 1 cục" },
    { ma: "CUC", ten: "Giữa 2 cục DTNN KV" },
  ];
  listLoaiDCFilterTable: any[] = [
    { ma: "CHI_CUC", ten: "Giữa 2 chi cục trong cùng 1 cục" },
    { ma: "CUC", ten: "Giữa 2 cục DTNN KV" },
  ];

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private quyetDinhDieuChuyenTCService: QuyetDinhDieuChuyenTCService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, quyetDinhDieuChuyenTCService);
    this.formData = this.fb.group({
      nam: null,
      soQdinh: null,
      ngayDuyetTc: null,
      ngayHieuLuc: null,
      loaiDc: null,
      trichYeu: null,
    })
    this.filterTable = {
      nam: '',
      soQdinh: '',
      ngayKyQdinh: '',
      loaiDc: '',
      trichYeu: '',
      maDxuat: '',
      maThop: '',
      soQdinhXuatCuc: '',
      soQdinhNhapCuc: '',
      tenTrangThai: '',
    };
  }


  async ngOnInit() {
    this.isVisibleChangeTab$.subscribe((value: boolean) => {
      this.visibleTab = value;
    });

    if (this.idTHop)
      this.redirectDetail(0, false)
    if (this.qdDcId)
      this.redirectDetail(this.qdDcId, true)

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

  isShowDS() {
    if (this.userService.isAccessPermisson('DCNB_QUYETDINHDC_TONGCUC') && this.userService.isAccessPermisson('DCNB_QUYETDINHDC_XEM'))
      return true
    else return false
  }

  isTongCuc() {
    return this.userService.isTongCuc()
  }

  isCuc() {
    return this.userService.isCuc()
  }


  async initData() {
    this.userInfo = this.userService.getUserLogin();
  }

  async timKiem() {
    if (this.formData.value.ngayDuyetTc) {
      this.formData.value.ngayDuyetTcTu = dayjs(this.formData.value.ngayDuyetTc[0]).format('YYYY-MM-DD')
      this.formData.value.ngayDuyetTcDen = dayjs(this.formData.value.ngayDuyetTc[1]).format('YYYY-MM-DD')
    }
    if (this.formData.value.ngayHieuLuc) {
      this.formData.value.ngayHieuLucTu = dayjs(this.formData.value.ngayHieuLuc[0]).format('YYYY-MM-DD')
      this.formData.value.ngayHieuLucDen = dayjs(this.formData.value.ngayHieuLuc[1]).format('YYYY-MM-DD')
    }
    await this.search();
  }

  exportDataTC() {
    if (this.totalRecord > 0) {
      this.spinner.show();
      try {

        let body = this.formData.value;
        if (this.formData.value.ngayDuyetTc) {
          body.ngayDuyetTcTu = body.ngayDuyetTc[0];
          body.ngayDuyetTcDen = body.ngayDuyetTc[1];
        }
        if (this.formData.value.ngayHieuLuc) {
          body.ngayHieuLucTu = body.ngayHieuLuc[0];
          body.ngayHieuLucDen = body.ngayHieuLuc[1];
        }
        this.quyetDinhDieuChuyenTCService
          .export(body)
          .subscribe((blob) =>
            saveAs(blob, 'quyet-dinh-dieu-chuyen-tc.xlsx'),
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
