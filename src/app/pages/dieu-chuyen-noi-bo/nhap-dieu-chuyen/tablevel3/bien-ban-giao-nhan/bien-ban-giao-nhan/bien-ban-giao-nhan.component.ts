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
import { chain } from 'lodash';
import { CHUC_NANG, STATUS } from 'src/app/constants/status';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { Subject } from 'rxjs';
import { QuyetDinhDieuChuyenTCService } from 'src/app/services/dieu-chuyen-noi-bo/quyet-dinh-dieu-chuyen/quyet-dinh-dieu-chuyen-tc.service';
import { BienBanGiaoNhanService } from 'src/app/services/dieu-chuyen-noi-bo/nhap-dieu-chuyen/bien-ban-giao-nhan';
import * as uuidv4 from "uuid";
import { ThongTinQuyetDinhDieuChuyenCucComponent } from 'src/app/pages/dieu-chuyen-noi-bo/quyet-dinh-dieu-chuyen/cuc/thong-tin-quyet-dinh-dieu-chuyen-cuc/thong-tin-quyet-dinh-dieu-chuyen-cuc.component';
@Component({
  selector: 'app-bien-ban-giao-nhan',
  templateUrl: './bien-ban-giao-nhan.component.html',
  styleUrls: ['./bien-ban-giao-nhan.component.scss']
})
export class BienBanGiaoNhanComponent extends Base2Component implements OnInit {

  isVisibleChangeTab$ = new Subject();
  visibleTab: boolean = true;
  tabSelected: number = 0;
  @Input() loaiDc: string;

  // @Input()
  // loaiVthh: string;
  // @Input()
  // loaiVthhCache: string;

  // CHUC_NANG = CHUC_NANG;
  // listLoaiDieuChuyen: any[] = [
  //   { ma: "ALL", ten: "Tất cả" },
  //   { ma: "CHI_CUC", ten: "Giữa 2 chi cục trong cùng 1 cục" },
  //   { ma: "CUC", ten: "Giữa 2 cục DTNN KV" },
  // ];
  // listLoaiDCFilterTable: any[] = [
  //   { ma: "CHI_CUC", ten: "Giữa 2 chi cục trong cùng 1 cục" },
  //   { ma: "CUC", ten: "Giữa 2 cục DTNN KV" },
  // ];
  dataTableView: any[] = [];
  // listLoaiHangHoa: any[] = [];
  // listHangHoaAll: any[] = [];
  // listChungLoaiHangHoa: any[] = [];
  // listTrangThai: any[] = [
  //   { ma: this.STATUS.DU_THAO, giaTri: 'Dự thảo' },
  //   { ma: this.STATUS.CHO_DUYET_TP, giaTri: 'Chờ duyệt - TP' },
  //   { ma: this.STATUS.TU_CHOI_TP, giaTri: 'Từ chối - TP' },
  //   { ma: this.STATUS.CHO_DUYET_LDC, giaTri: 'Chờ duyệt - LĐ Cục' },
  //   { ma: this.STATUS.TU_CHOI_LDC, giaTri: 'Từ chối - LĐ Cục' },
  //   { ma: this.STATUS.DA_DUYET_LDC, giaTri: 'Đã duyệt - LĐ Cục' },
  //   { ma: this.STATUS.DA_TAO_CBV, giaTri: 'Đã tạo - CB Vụ' },
  // ];

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private donviService: DonviService,
    private danhMucService: DanhMucService,
    private bienBanGiaoNhanService: BienBanGiaoNhanService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, bienBanGiaoNhanService);
    this.formData = this.fb.group({
      nam: null,
      soQdinh: null,
      soBb: [],
      tuNgayKtnk: [],
      denNgayKtnk: [],
      tuNgayThoiHanNhap: [],
      denNgayThoiHanNhap: [],
      type: ["01"],
      loaiDc: ["DCNB"],
      isVatTu: [true],
      loaiQdinh: [],
      thayDoiThuKho: [],
    })
  }


  dsDonvi: any[] = [];
  userInfo: UserLogin;
  data: any = {};
  selectedId: number = 0;
  isVatTu: boolean = false;
  isView = false;

  async ngOnInit() {
    this.isVisibleChangeTab$.subscribe((value: boolean) => {
      this.visibleTab = value;
    });
    this.formData.patchValue({
      loaiDc: this.loaiDc,
      loaiQdinh: this.loaiDc === "CUC" ? "NHAP" : null,
      thayDoiThuKho: this.loaiDc !== "DCNB" ? true : null
    })


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

  disabledStartNgayKtnk = (startValue: Date): boolean => {
    if (startValue && this.formData.value.denNgayKtnk) {
      return startValue.getTime() > this.formData.value.denNgayKtnk.getTime();
    } else {
      return false;
    }
  };

  disabledEndNgayKtnk = (endValue: Date): boolean => {
    if (endValue && this.formData.value.tuNgayKtnk) {
      return endValue.getTime() < this.formData.value.tuNgayKtnk.getTime();
    } else {
      return false;
    }
  };

  disabledStartNgayTHN = (startValue: Date): boolean => {
    if (startValue && this.formData.value.denNgayThoiHanNhap) {
      return startValue.getTime() > this.formData.value.denNgayThoiHanNhap.getTime();
    } else {
      return false;
    }
  };

  disabledEndNgayTHN = (endValue: Date): boolean => {
    if (endValue && this.formData.value.tuNgayThoiHanNhap) {
      return endValue.getTime() < this.formData.value.tuNgayThoiHanNhap.getTime();
    } else {
      return false;
    }
  };

  isShowDS() {
    if (this.userService.isAccessPermisson('DCNB_QUYETDINHDC_TONGCUC') && this.userService.isAccessPermisson('DCNB_QUYETDINHDC_XEM'))
      return true
    else return false
  }

  isCuc() {
    return this.userService.isCuc()
  }

  isChiCuc() {
    return this.userService.isChiCuc()
  }

  selectTab(tab: number) {
    if (this.isDetail) {
      this.quayLai()
    }
    this.tabSelected = tab;
  }

  async initData() {
    // this.userInfo = this.userService.getUserLogin();
    // this.userdetail.maDvi = this.userInfo.MA_DVI;
    // this.userdetail.tenDvi = this.userInfo.TEN_DVI;
  }

  setExpand(parantExpand: boolean = false, children: any = []): void {
    if (parantExpand) {
      return children.map(f => ({ ...f, expand: false }))
    }
    return children
  }

  async changePageIndex(event) {
    this.page = event;
    await this.timKiem();
  }

  async changePageSize(event) {
    this.pageSize = event;
    await this.timKiem();
  }

  async timKiem() {
    if (this.formData.value.tuNgayKtnk) {
      this.formData.value.tuNgayKtnk = dayjs(this.formData.value.tuNgayKtnk).format('YYYY-MM-DD')
    }
    if (this.formData.value.denNgayKtnk) {
      this.formData.value.denNgayKtnk = dayjs(this.formData.value.denNgayKtnk).format('YYYY-MM-DD')
    }
    if (this.formData.value.tuNgayThoiHanNhap) {
      this.formData.value.tuNgayThoiHanNhap = dayjs(this.formData.value.tuNgayThoiHanNhap).format('YYYY-MM-DD')
    }
    if (this.formData.value.denNgayThoiHanNhap) {
      this.formData.value.denNgayThoiHanNhap = dayjs(this.formData.value.denNgayThoiHanNhap).format('YYYY-MM-DD')
    }
    let body = this.formData.value
    // if (body.soQdinh) body.soQdinh = `${body.soQdinh}/DCNB`
    body.paggingReq = {
      limit: this.pageSize,
      page: this.page - 1
    }
    let res = await this.bienBanGiaoNhanService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.totalRecord = res.data.totalElements;
      let data = res.data.content
      // .map(element => {
      //   return {
      //     ...element,
      //     maKho: `${element.thoiHanDieuChuyen}${element.maDiemKho}`,
      //     maloNganKhoNhan: `${element.maLoKhoNhan}${element.maNganKhoNhan}`
      //   }
      // });
      this.dataTableView = this.buildTableView(data)
      console.log('data', data, res)
      console.log('this.dataTableView', this.dataTableView)
    }
  }

  buildTableView(data: any[] = []) {
    let dataView = chain(data)
      .groupBy("soQdinh")
      ?.map((value1, key1) => {
        let children1 = chain(value1)
          .groupBy("maDiemKho")
          ?.map((value2, key2) => {

            let row2 = value2?.find(s => s.maDiemKho == key2);

            return {
              ...row2,
              idVirtual: row2 ? row2.idVirtual ? row2.idVirtual : uuidv4.v4() : uuidv4.v4(),
              children: value2,
            }
          }
          ).value();


        let row1 = value1?.find(s => s.soQdinh === key1);
        return {
          ...row1,
          idVirtual: row1 ? row1.idVirtual ? row1.idVirtual : uuidv4.v4() : uuidv4.v4(),
          children: children1,
          expand: true
        };
      }).value();

    return dataView
  }

  async openDialogQD(row) {
    this.modal.create({
      nzTitle: 'Thông tin quyết định điều chuyển',
      nzContent: ThongTinQuyetDinhDieuChuyenCucComponent,
      nzMaskClosable: false,
      nzClosable: true,
      nzBodyStyle: { overflowY: 'auto' },//maxHeight: 'calc(100vh - 200px)'
      nzWidth: '90%',
      nzFooter: null,
      nzComponentParams: {
        isViewOnModal: true,
        isView: true,
        idInput: row.qddccId
      },
    });
  }

  add(data: any) {
    this.data = data;
    this.selectedId = 0
    this.isDetail = true;
    this.isView = false;
  }

  xoa(data: any) {
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
            id: data.id
          };
          this.bienBanGiaoNhanService.delete(body).then(async () => {
            await this.timKiem();
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

  exportDataTC() {
    if (this.totalRecord > 0) {
      this.spinner.show();
      try {

        if (this.formData.value.tuNgayKtnk) {
          this.formData.value.tuNgayKtnk = dayjs(this.formData.value.tuNgayKtnk).format('YYYY-MM-DD')
        }
        if (this.formData.value.denNgayKtnk) {
          this.formData.value.denNgayKtnk = dayjs(this.formData.value.denNgayKtnk).format('YYYY-MM-DD')
        }
        if (this.formData.value.tuNgayThoiHanNhap) {
          this.formData.value.tuNgayThoiHanNhap = dayjs(this.formData.value.tuNgayThoiHanNhap).format('YYYY-MM-DD')
        }
        if (this.formData.value.denNgayThoiHanNhap) {
          this.formData.value.denNgayThoiHanNhap = dayjs(this.formData.value.denNgayThoiHanNhap).format('YYYY-MM-DD')
        }

        let body = this.formData.value;
        // if (this.formData.value.ngayDuyetTc) {
        //   body.ngayDuyetTcTu = body.ngayDuyetTc[0];
        //   body.ngayDuyetTcDen = body.ngayDuyetTc[1];
        // }
        // if (this.formData.value.ngayHieuLuc) {
        //   body.ngayHieuLucTu = body.ngayHieuLuc[0];
        //   body.ngayHieuLucDen = body.ngayHieuLuc[1];
        // }
        this.bienBanGiaoNhanService
          .export(body)
          .subscribe((blob) =>
            saveAs(blob, 'dcnb-bien-ban-giao-nhan.xlsx'),
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
    this.data = null
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
