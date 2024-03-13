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
import { BienBanNhapDayKhoService } from 'src/app/services/dieu-chuyen-noi-bo/nhap-dieu-chuyen/bien-ban-nhap-day-kho';
import { ThongTinQuyetDinhDieuChuyenCucComponent } from 'src/app/pages/dieu-chuyen-noi-bo/quyet-dinh-dieu-chuyen/cuc/thong-tin-quyet-dinh-dieu-chuyen-cuc/thong-tin-quyet-dinh-dieu-chuyen-cuc.component';
import * as uuidv4 from "uuid";
@Component({
  selector: 'app-bien-ban-nhap-day-du',
  templateUrl: './bien-ban-nhap-day-du.component.html',
  styleUrls: ['./bien-ban-nhap-day-du.component.scss']
})
export class BienBanNhapDayDuComponent extends Base2Component implements OnInit {

  isVisibleChangeTab$ = new Subject();
  visibleTab: boolean = true;
  tabSelected: number = 0;
  @Input() loaiDc: string;

  @Input()
  loaiVthh: string;
  @Input()
  loaiVthhCache: string;

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
    private quyetDinhDieuChuyenTCService: QuyetDinhDieuChuyenTCService,
    private bienBanNhapDayKhoService: BienBanNhapDayKhoService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, bienBanNhapDayKhoService);
    this.formData = this.fb.group({
      nam: null,
      soQdDcCuc: null,
      soBb: null,
      tuNgayBdNhap: null,
      denNgayBdNhap: null,
      tuNgayKtNhap: null,
      denNgayKtNhap: null,
      tuNgayThoiHanNh: null,
      denNgayThoiHanNh: null,
      type: ["01"],
      loaiDc: [this.loaiDc],
      loaiQdinh: [],
      thayDoiThuKho: [],
      isVatTu: false
    })
  }


  dsDonvi: any[] = [];
  userInfo: UserLogin;
  data: any = {};
  selectedId: number = 0;
  isVatTu: boolean = false;
  isView = false;

  disabledStartNgayBdNhap = (startValue: Date): boolean => {
    if (startValue && this.formData.value.denNgayBdNhap) {
      return startValue.getTime() > this.formData.value.denNgayBdNhap.getTime();
    } else {
      return false;
    }
  };

  disabledEndNgayBdNhap = (endValue: Date): boolean => {
    if (endValue && this.formData.value.tuNgayBdNhap) {
      return endValue.getTime() < this.formData.value.tuNgayBdNhap.getTime();
    } else {
      return false;
    }
  };

  disabledStartNgayKTNhap = (startValue: Date): boolean => {
    if (startValue && this.formData.value.denNgayKtNhap) {
      return startValue.getTime() > this.formData.value.denNgayKtNhap.getTime();
    } else {
      return false;
    }
  };

  disabledEndNgayKTNhap = (endValue: Date): boolean => {
    if (endValue && this.formData.value.tuNgayKtNhap) {
      return endValue.getTime() < this.formData.value.tuNgayKtNhap.getTime();
    } else {
      return false;
    }
  };

  disabledStartNgayTHNhap = (startValue: Date): boolean => {
    if (startValue && this.formData.value.denNgayThoiHanNh) {
      return startValue.getTime() > this.formData.value.denNgayThoiHanNh.getTime();
    } else {
      return false;
    }
  };

  disabledEndNgayTHNhap = (endValue: Date): boolean => {
    if (endValue && this.formData.value.tuNgayThoiHanNh) {
      return endValue.getTime() < this.formData.value.tuNgayThoiHanNh.getTime();
    } else {
      return false;
    }
  };

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

  isShowDS() {
    return (this.userService.isAccessPermisson('DCNB_NHAP_NBCC_NK_LT_BBNDK_XEM') || this.userService.isAccessPermisson('DCNB_NHAP_CUNG1CUC_NK_LT_BBNDK_XEM') || this.userService.isAccessPermisson('DCNB_NHAP_2CUC_NK_LT_BBNDK_XEM'))
  }

  isXoa() {
    return this.isChiCuc() && (this.userService.isAccessPermisson('DCNB_NHAP_NBCC_NK_LT_BBNDK_XOA') || this.userService.isAccessPermisson('DCNB_NHAP_CUNG1CUC_NK_LT_BBNDK_XOA') || this.userService.isAccessPermisson('DCNB_NHAP_2CUC_NK_LT_BBNDK_XOA'))
  }

  isExport() {
    return this.isChiCuc() && (this.userService.isAccessPermisson('DCNB_NHAP_NBCC_NK_LT_BBNDK_EXP') || this.userService.isAccessPermisson('DCNB_NHAP_CUNG1CUC_NK_LT_BBNDK_EXP') || this.userService.isAccessPermisson('DCNB_NHAP_2CUC_NK_LT_BBNDK_EXP'))
  }

  isThem() {
    return this.isChiCuc() && (this.userService.isAccessPermisson('DCNB_NHAP_NBCC_NK_LT_BBNDK_THEM') || this.userService.isAccessPermisson('DCNB_NHAP_CUNG1CUC_NK_LT_BBNDK_THEM') || this.userService.isAccessPermisson('DCNB_NHAP_2CUC_NK_LT_BBNDK_THEM'))
  }

  isDuyetKTVBQ() {
    return this.isChiCuc() && (this.userService.isAccessPermisson('DCNB_NHAP_NBCC_NK_LT_BBNDK_DUYET_KTVBQ') || this.userService.isAccessPermisson('DCNB_NHAP_CUNG1CUC_NK_LT_BBNDK_DUYET_KTVBQ') || this.userService.isAccessPermisson('DCNB_NHAP_2CUC_NK_LT_BBNDK_DUYET_KTVBQ'))
  }

  isDuyetKT() {
    return this.isChiCuc() && (this.userService.isAccessPermisson('DCNB_NHAP_NBCC_NK_LT_BBNDK_DUYET_KETOAN') || this.userService.isAccessPermisson('DCNB_NHAP_CUNG1CUC_NK_LT_BBNDK_DUYET_KETOAN') || this.userService.isAccessPermisson('DCNB_NHAP_2CUC_NK_LT_BBNDK_DUYET_KETOAN'))
  }

  isDuyetLD() {
    return this.isChiCuc() && (this.userService.isAccessPermisson('DCNB_NHAP_NBCC_NK_LT_BBNDK_DUYET_LDCCUC') || this.userService.isAccessPermisson('DCNB_NHAP_CUNG1CUC_NK_LT_BBNDK_DUYET_LDCCUC') || this.userService.isAccessPermisson('DCNB_NHAP_2CUC_NK_LT_BBNDK_DUYET_LDCCUC'))
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
    if (this.formData.value.tuNgayBdNhap) {
      this.formData.value.tuNgayBdNhap = dayjs(this.formData.value.tuNgayBdNhap).format('YYYY-MM-DD')
    }
    if (this.formData.value.denNgayBdNhap) {
      this.formData.value.denNgayBdNhap = dayjs(this.formData.value.denNgayBdNhap).format('YYYY-MM-DD')
    }

    if (this.formData.value.tuNgayKtNhap) {
      this.formData.value.tuNgayKtNhap = dayjs(this.formData.value.tuNgayKtNhap).format('YYYY-MM-DD')
    }
    if (this.formData.value.denNgayKtNhap) {
      this.formData.value.denNgayKtNhap = dayjs(this.formData.value.denNgayKtNhap).format('YYYY-MM-DD')
    }

    if (this.formData.value.tuNgayThoiHanNh) {
      this.formData.value.tuNgayThoiHanNh = dayjs(this.formData.value.tuNgayThoiHanNh).format('YYYY-MM-DD')
    }
    if (this.formData.value.denNgayThoiHanNh) {
      this.formData.value.denNgayThoiHanNh = dayjs(this.formData.value.denNgayThoiHanNh).format('YYYY-MM-DD')
    }
    let body = this.formData.value
    body.paggingReq = {
      limit: this.pageSize,
      page: this.page - 1
    }
    let res = await this.bienBanNhapDayKhoService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.totalRecord = res.data.totalElements;
      let data = res.data.content
        .map(element => {
          return {
            ...element,
            maLoNganKho: `${element.maLoKho}${element.maNganKho}`
          }
        });
      this.dataTableView = this.buildTableView(data)
      console.log('data', data, res)
      console.log('this.dataTableView', this.dataTableView)
    }
  }

  async openDialogQD(row) {
    this.modal.create({
      nzTitle: 'Thông tin quyết định điều chuyển',
      nzContent: ThongTinQuyetDinhDieuChuyenCucComponent,
      nzMaskClosable: false,
      nzClosable: true,
      nzBodyStyle: { overflowY: 'auto' },//maxHeight: 'calc(100vh - 200px)'
      nzWidth: '95%',
      nzFooter: null,
      nzComponentParams: {
        isViewOnModal: true,
        isView: true,
        idInput: row.qdinhDccId
      },
    });
  }


  buildTableView(data: any[] = []) {
    let dataView = chain(data)
      .groupBy("soQdinh")
      ?.map((value1, key1) => {
        let children1 = chain(value1)
          .groupBy("maDiemKho")
          ?.map((value2, key2) => {
            let children2 = chain(value2)
              .groupBy("maLoNganKho")
              ?.map((value3, key3) => {

                const children3 = chain(value3).groupBy("soBbNhapDayKho")
                  ?.map((value4, key4) => {

                    const row4 = value4.find(f => f.soBbNhapDayKho == key4);
                    // const hasMaDiemKhoNhan = vs.some(f => f.maDiemKhoNhan);
                    // if (!hasMaDiemKhoNhan) return {
                    //   ...maChiCucNhan
                    // }

                    // const rssx = chain(m).groupBy("maDiemKhoNhan")?.map((n, inx) => {

                    //   const maDiemKhoNhan = n.find(f => f.maDiemKhoNhan == inx);
                    //   return {
                    //     ...maDiemKhoNhan,
                    //     children: n
                    //   }
                    // }).value()
                    return {
                      ...row4,
                      children: value4
                    }
                  }).value()

                const row3 = value3.find(s => s?.maLoNganKho == key3);
                return {
                  ...row3,
                  idVirtual: row3 ? row3.idVirtual ? row3.idVirtual : uuidv4.v4() : uuidv4.v4(),
                  children: value3,
                }
              }
              ).value();

            let row2 = value2?.find(s => s.maDiemKho == key2);

            return {
              ...row2,
              idVirtual: row2 ? row2.idVirtual ? row2.idVirtual : uuidv4.v4() : uuidv4.v4(),
              children: children2,
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

  add(data: any) {
    this.selectedId = 0;
    this.data = data;
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
          this.bienBanNhapDayKhoService.delete(body).then(async () => {
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

        if (this.formData.value.tuNgayBdNhap) {
          this.formData.value.tuNgayBdNhap = dayjs(this.formData.value.tuNgayBdNhap).format('YYYY-MM-DD')
        }
        if (this.formData.value.denNgayBdNhap) {
          this.formData.value.denNgayBdNhap = dayjs(this.formData.value.denNgayBdNhap).format('YYYY-MM-DD')
        }

        if (this.formData.value.tuNgayKtNhap) {
          this.formData.value.tuNgayKtNhap = dayjs(this.formData.value.tuNgayKtNhap).format('YYYY-MM-DD')
        }
        if (this.formData.value.denNgayKtNhap) {
          this.formData.value.denNgayKtNhap = dayjs(this.formData.value.denNgayKtNhap).format('YYYY-MM-DD')
        }

        if (this.formData.value.tuNgayThoiHanNh) {
          this.formData.value.tuNgayThoiHanNh = dayjs(this.formData.value.tuNgayThoiHanNh).format('YYYY-MM-DD')
        }
        if (this.formData.value.denNgayThoiHanNh) {
          this.formData.value.denNgayThoiHanNh = dayjs(this.formData.value.denNgayThoiHanNh).format('YYYY-MM-DD')
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

        this.bienBanNhapDayKhoService
          .export(body)
          .subscribe((blob) =>
            saveAs(blob, 'dcnb-bien-ban-nhap-day-kho.xlsx'),
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
    this.data = null
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
