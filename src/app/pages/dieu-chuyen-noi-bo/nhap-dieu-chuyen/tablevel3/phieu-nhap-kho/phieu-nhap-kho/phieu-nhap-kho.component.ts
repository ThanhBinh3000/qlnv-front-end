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
import { PhieuNhapKhoService } from 'src/app/services/dieu-chuyen-noi-bo/nhap-dieu-chuyen/phieu-nhap-kho';
import { ThongTinQuyetDinhDieuChuyenCucComponent } from 'src/app/pages/dieu-chuyen-noi-bo/quyet-dinh-dieu-chuyen/cuc/thong-tin-quyet-dinh-dieu-chuyen-cuc/thong-tin-quyet-dinh-dieu-chuyen-cuc.component';
import * as uuidv4 from "uuid";

@Component({
  selector: 'app-phieu-nhap-kho',
  templateUrl: './phieu-nhap-kho.component.html',
  styleUrls: ['./phieu-nhap-kho.component.scss']
})
export class PhieuNhapKhoComponent extends Base2Component implements OnInit {

  isVisibleChangeTab$ = new Subject();
  visibleTab: boolean = true;
  tabSelected: number = 0;
  @Input() loaiDc: string;
  @Input() isVatTu: boolean;

  dataTableView: any[] = [];

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private donviService: DonviService,
    private danhMucService: DanhMucService,
    private quyetDinhDieuChuyenTCService: QuyetDinhDieuChuyenTCService,
    private phieuNhapKhoService: PhieuNhapKhoService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, phieuNhapKhoService);
    this.formData = this.fb.group({
      nam: null,
      soQdinh: null,
      tuNgayLap: null,
      denNgayLap: null,
      trichYeu: null,
      type: ["01"],
      loaiDc: [this.loaiDc],
      isVatTu: [this.isVatTu],
      loaiQdinh: [],
      thayDoiThuKho: [],
    })
    // this.filterTable = {
    //   nam: '',
    //   soQdinh: '',
    //   ngayKyQdinh: '',
    //   loaiDc: '',
    //   trichYeu: '',
    //   maDxuat: '',
    //   maThop: '',
    //   soQdinhXuatCuc: '',
    //   soQdinhNhapCuc: '',
    //   tenTrangThai: '',
    // };
  }


  data: any = {};
  selectedId: number = 0;
  isView = false;

  async ngOnInit() {
    this.isVisibleChangeTab$.subscribe((value: boolean) => {
      this.visibleTab = value;
    });

    this.formData.patchValue({
      loaiDc: this.loaiDc,
      isVatTu: this.isVatTu,
      loaiQdinh: this.loaiDc === "CUC" ? "NHAP" : null,
      thayDoiThuKho: this.loaiDc !== "DCNB" ? true : null
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

  disabledStartNgayLap = (startValue: Date): boolean => {
    if (startValue && this.formData.value.denNgayLap) {
      return startValue.getTime() > this.formData.value.denNgayLap.getTime();
    } else {
      return false;
    }
  };

  disabledEndNgayLap = (endValue: Date): boolean => {
    if (endValue && this.formData.value.tuNgayLap) {
      return endValue.getTime() < this.formData.value.tuNgayLap.getTime();
    } else {
      return false;
    }
  };

  isShowDS() {
    return (this.userService.isAccessPermisson('DCNB_NHAP_NBCC_NK_LT_PNK_XEM') || this.userService.isAccessPermisson('DCNB_NHAP_CUNG1CUC_NK_LT_PNK_XEM') || this.userService.isAccessPermisson('DCNB_NHAP_2CUC_NK_LT_PNK_XEM'))
  }

  isXoa() {
    return this.isChiCuc() && (this.userService.isAccessPermisson('DCNB_NHAP_NBCC_NK_LT_PNK_XOA') || this.userService.isAccessPermisson('DCNB_NHAP_CUNG1CUC_NK_LT_PNK_XOA') || this.userService.isAccessPermisson('DCNB_NHAP_2CUC_NK_LT_PNK_XOA'))
  }

  isExport() {
    return this.isChiCuc() && (this.userService.isAccessPermisson('DCNB_NHAP_NBCC_NK_LT_PNK_EXP') || this.userService.isAccessPermisson('DCNB_NHAP_CUNG1CUC_NK_LT_PNK_EXP') || this.userService.isAccessPermisson('DCNB_NHAP_2CUC_NK_LT_PNK_EXP'))
  }

  isThem() {
    return this.isChiCuc() && (this.userService.isAccessPermisson('DCNB_NHAP_NBCC_NK_LT_PNK_THEM') || this.userService.isAccessPermisson('DCNB_NHAP_CUNG1CUC_NK_LT_PNK_THEM') || this.userService.isAccessPermisson('DCNB_NHAP_2CUC_NK_LT_PNK_THEM'))
  }

  isDuyet() {
    return this.isChiCuc() && (this.userService.isAccessPermisson('DCNB_NHAP_NBCC_NK_LT_PNK_DUYET') || this.userService.isAccessPermisson('DCNB_NHAP_CUNG1CUC_NK_LT_PNK_DUYET') || this.userService.isAccessPermisson('DCNB_NHAP_2CUC_NK_LT_PNK_DUYET'))
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
    if (this.formData.value.tuNgayLap) {
      this.formData.value.tuNgayLap = dayjs(this.formData.value.tuNgayLap).format('YYYY-MM-DD')
    }
    if (this.formData.value.denNgayLap) {
      this.formData.value.denNgayLap = dayjs(this.formData.value.denNgayLap).format('YYYY-MM-DD')
    }

    let body = this.formData.value
    // if (body.soQdinh) body.soQdinh = `${body.soQdinh}/DCNB`
    body.paggingReq = {
      limit: this.pageSize,
      page: this.page - 1
    }
    let res = await this.phieuNhapKhoService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.totalRecord = res.data.totalElements;
      let data = res.data.content
        .map(element => {
          return {
            ...element,
            diemKho: `${element.thoiHanDieuChuyen}${element.maDiemKho}`,
            maloNganKho: `${element.maLoKho}${element.maNganKho}`
          }
        });
      this.dataTableView = this.buildTableView(data)
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
          .groupBy("diemKho")
          ?.map((value2, key2) => {
            let children2 = chain(value2)
              .groupBy("maloNganKho")
              ?.map((value3, key3) => {

                // const children3 = chain(value3).groupBy("maloNganKho")
                //   ?.map((m, im) => {

                //     const maChiCucNhan = m.find(f => f.maloNganKho == im);
                //     // const hasMaDiemKhoNhan = vs.some(f => f.maDiemKhoNhan);
                //     // if (!hasMaDiemKhoNhan) return {
                //     //   ...maChiCucNhan
                //     // }

                //     // const rssx = chain(m).groupBy("maDiemKhoNhan")?.map((n, inx) => {

                //     //   const maDiemKhoNhan = n.find(f => f.maDiemKhoNhan == inx);
                //     //   return {
                //     //     ...maDiemKhoNhan,
                //     //     children: n
                //     //   }
                //     // }).value()
                //     return {
                //       ...maChiCucNhan,
                //       children: m
                //     }
                //   }).value()

                const row3 = value3.find(s => s?.maloNganKho == key3);
                return {
                  ...row3,
                  idVirtual: row3 ? row3.idVirtual ? row3.idVirtual : uuidv4.v4() : uuidv4.v4(),
                  children: value3,
                }
              }
              ).value();

            let row2 = value2?.find(s => s.diemKho == key2);

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
          this.phieuNhapKhoService.delete(body).then(async () => {
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
        if (this.formData.value.tuNgayLap) {
          this.formData.value.tuNgayLap = dayjs(this.formData.value.tuNgayLap).format('YYYY-MM-DD')
        }
        if (this.formData.value.denNgayLap) {
          this.formData.value.denNgayLap = dayjs(this.formData.value.denNgayLap).format('YYYY-MM-DD')
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
        this.phieuNhapKhoService
          .export(body)
          .subscribe((blob) =>
            saveAs(blob, 'dcnb-phieu-nhap-kho.xlsx'),
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
