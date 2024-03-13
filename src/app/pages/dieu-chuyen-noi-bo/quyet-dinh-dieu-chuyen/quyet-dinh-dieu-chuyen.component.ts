import { Component, Input, OnInit } from '@angular/core';
import dayjs from 'dayjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { UserLogin } from 'src/app/models/userlogin';
import { saveAs } from 'file-saver';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { DonviService } from 'src/app/services/donvi.service';
import { isEmpty } from 'lodash';
import { CHUC_NANG, STATUS } from 'src/app/constants/status';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { Subject } from 'rxjs';
import { QuyetDinhDieuChuyenTCService } from 'src/app/services/dieu-chuyen-noi-bo/quyet-dinh-dieu-chuyen/quyet-dinh-dieu-chuyen-tc.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-quyet-dinh-dieu-chuyen',
  templateUrl: './quyet-dinh-dieu-chuyen.component.html',
  styleUrls: ['./quyet-dinh-dieu-chuyen.component.scss']
})
export class QuyetDinhDieuChuyenComponent extends Base2Component implements OnInit {
  isVisibleChangeTab$ = new Subject();
  visibleTab: boolean = true;
  tabSelected: string = 'QDDC';

  @Input()
  loaiVthh: string;
  @Input()
  loaiVthhCache: string;

  CHUC_NANG = CHUC_NANG;
  listLoaiDieuChuyen: any[] = [];

  listLoaiHangHoa: any[] = [];
  listHangHoaAll: any[] = [];
  listChungLoaiHangHoa: any[] = [];
  listTrangThai: any[] = [
    { ma: this.STATUS.DU_THAO, giaTri: 'Dự thảo' },
    { ma: this.STATUS.CHO_DUYET_TP, giaTri: 'Chờ duyệt - TP' },
    { ma: this.STATUS.TU_CHOI_TP, giaTri: 'Từ chối - TP' },
    { ma: this.STATUS.CHO_DUYET_LDC, giaTri: 'Chờ duyệt - LĐ Cục' },
    { ma: this.STATUS.TU_CHOI_LDC, giaTri: 'Từ chối - LĐ Cục' },
    { ma: this.STATUS.DA_DUYET_LDC, giaTri: 'Đã duyệt - LĐ Cục' },
    { ma: this.STATUS.DA_TAO_CBV, giaTri: 'Đã tạo - CB Vụ' },
  ];

  idTongHop: number
  qdDcId: number
  isViewOnModal: boolean
  dsDonvi: any[] = [];
  userInfo: UserLogin;
  userdetail: any = {};
  selectedId: number = 0;
  isVatTu: boolean = false;
  isView = false;

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private router: Router,
    private donviService: DonviService,
    private routerActive: ActivatedRoute,
    private danhMucService: DanhMucService,
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
      ngayLapKh: '',
      ngayDuyetTcTu: '',
      loaiDc: '',
      trichYeu: '',
      tenDvi: '',
      tenTrangThai: '',
    };
    router.events.subscribe((val) => {
      this.idTongHop = +this.routerActive.snapshot.paramMap.get('id');
      this.qdDcId = +this.routerActive.snapshot.paramMap.get('qdDcId');
      this.isViewOnModal = this.routerActive.snapshot.paramMap.has('isViewOnModal');
    });
  }



  disabledStartNgayLapKh = (startValue: Date): boolean => {
    if (startValue && this.formData.value.ngayLapKhDen) {
      return startValue.getTime() > this.formData.value.ngayLapKhDen.getTime();
    } else {
      return false;
    }
  };

  disabledEndNgayLapKh = (endValue: Date): boolean => {
    if (!endValue || !this.formData.value.ngayLapKhTu) {
      return false;
    }
    return endValue.getTime() <= this.formData.value.ngayLapKhDen.getTime();
  };

  disabledStartNgayDuyetLdc = (startValue: Date): boolean => {
    if (startValue && this.formData.value.ngayDuyetLdcDen) {
      return startValue.getTime() > this.formData.value.ngayDuyetLdcDen.getTime();
    }
    return false;
  };

  disabledEndNgayDuyetLdc = (endValue: Date): boolean => {
    if (!endValue || !this.formData.value.ngayDuyetLdcTu) {
      return false;
    }
    return endValue.getTime() <= this.formData.value.ngayDuyetLdcDen.getTime();
  };

  async ngOnInit() {
    this.isVisibleChangeTab$.subscribe((value: boolean) => {
      this.visibleTab = value;
    });

    if (this.userService.isAccessPermisson('DCNB_QUYETDINHDC_TONGCUC')) this.tabSelected = "TC"
    else this.tabSelected = "CUC"




    if (this.isChiCuc()) this.tabSelected = 'CUC';
    if (this.tabSelected == 'TC') {
      this.listLoaiDieuChuyen = [
        { ma: "ALL", ten: "Tất cả" },
        { ma: "CHI_CUC", ten: "Giữa 2 chi cục trong cùng 1 cục" },
        { ma: "CUC", ten: "Giữa 2 cục DTNN KV" },
      ]
    }

    if (this.tabSelected == 'CUC') {
      this.listLoaiDieuChuyen = [
        { ma: "NOi_BO", ten: "Trong nội bộ chi cục" },
        { ma: "CHI_CUC", ten: "Giữa 2 chi cục trong cùng 1 cục" },
        { ma: "CUC", ten: "Giữa 2 cục DTNN KV" },
      ]
    }

    try {
      this.initData()
      await this.timKiem();
      // await this.loadDsVthh();
      await this.spinner.hide();

    } catch (e) {
      console.log('error: ', e)
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }


  }

  isShowDS() {
    if (this.isChiCuc()) return true

    if (this.tabSelected == 'TC' && this.userService.isAccessPermisson('DCNB_QUYETDINHDC_TONGCUC') && this.userService.isAccessPermisson('DCNB_QUYETDINHDC_XEM'))
      return true
    else if (this.tabSelected == 'CUC' && this.userService.isAccessPermisson('DCNB_QUYETDINHDC_CUC') && this.userService.isAccessPermisson('DCNB_QUYETDINHDC_XEM'))
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

  selectTab(tab: string) {
    if (this.isDetail) {
      this.quayLai()
    }
    this.tabSelected = tab;
  }

  async initData() {
    this.userInfo = this.userService.getUserLogin();
    this.userdetail.maDvi = this.userInfo.MA_DVI;
    this.userdetail.tenDvi = this.userInfo.TEN_DVI;
  }

  // async loadDsVthh() {
  //   let res = await this.danhMucService.getDanhMucHangDvqlAsyn({});
  //   if (res.msg == MESSAGE.SUCCESS) {
  //     this.listHangHoaAll = res.data;
  //     this.listLoaiHangHoa = res.data?.filter((x) => (x.ma.length == 2 && !x.ma.match("^01.*")) || (x.ma.length == 4 && x.ma.match("^01.*")));
  //   }
  // }

  async changeHangHoa(event: any) {
    if (event) {
      this.formData.patchValue({ donViTinh: this.listHangHoaAll.find(s => s.ma == event)?.maDviTinh })

      let res = await this.danhMucService.loadDanhMucHangHoaTheoMaCha({ str: event });
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          this.listChungLoaiHangHoa = res.data;
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }
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

  exportData() {
    debugger
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
        this.quyetDinhDieuChuyenTCService
          .export(body)
          .subscribe((blob) =>
            saveAs(blob, 'quyet-dinh-dieu-chuyen.xlsx'),
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
    console.log('QuyetDinhDieuChuyenComponent', 'quayLai')
    this.showListEvent.emit();
    this.isDetail = false;
    this.isView = false;
  }


}
