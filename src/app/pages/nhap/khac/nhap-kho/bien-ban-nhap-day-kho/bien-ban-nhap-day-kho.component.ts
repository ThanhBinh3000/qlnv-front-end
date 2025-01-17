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
import { BBNhapDayKhoService } from 'src/app/services/qlnv-hang/nhap-hang/nhap-khac/bbNhapDayKho';
import { ThongTinPhieuNhapKhoComponent } from '../phieu-nhap-kho/thong-tin-phieu-nhap-kho/thong-tin-phieu-nhap-kho.component';
import { ThemmoiQdinhNhapXuatHangKhacComponent } from '../../quyet-dinh-giao-nv-nhap-hang/themmoi-qdinh-nhap-xuat-hang-khac/themmoi-qdinh-nhap-xuat-hang-khac.component';

@Component({
  selector: 'app-bien-ban-nhap-day-kho',
  templateUrl: './bien-ban-nhap-day-kho.component.html',
  styleUrls: ['./bien-ban-nhap-day-kho.component.scss']
})
export class BienBanNhapDayKhoComponent extends Base2Component implements OnInit {

  isVisibleChangeTab$ = new Subject();
  visibleTab: boolean = true;
  tabSelected: number = 0;

  @Input()
  loaiVthh: string;

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
    private bienBanNhapDayKhoService: BBNhapDayKhoService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, bienBanNhapDayKhoService);
    this.formData = this.fb.group({
      nam: null,
      soQdPdNk: null,
      soBb: null,
      tuNgayBdNhap: null,
      denNgayBdNhap: null,
      tuNgayKtNhap: null,
      denNgayKtNhap: null,
      tuNgayThoiHanNh: null,
      denNgayThoiHanNh: null,
      loaiVthh: [this.loaiVthh]
    })
  }

  data: any = {};
  selectedId: number = 0;
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
      loaiVthh: this.loaiVthh
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

  // isChiCuc() {
  //   return false//this.userService.isChiCuc()
  // }

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
            maLoNganKho: `${element.maLoKho}${element.maNganKho}${element.soBbNhapDayKho}`
          }
        });
      this.dataTableView = this.buildTableView(data)
      console.log('data', data, res)
      console.log('this.dataTableView', this.dataTableView)
    }
  }

  async openDialogQD(row) {
    this.modal.create({
      nzTitle: 'Thông tin quyết định giao nhiệm vụ nhận hàng',
      nzContent: ThemmoiQdinhNhapXuatHangKhacComponent,
      nzMaskClosable: false,
      nzClosable: true,
      nzBodyStyle: { overflowY: 'auto' },//maxHeight: 'calc(100vh - 200px)'
      nzWidth: '95%',
      nzFooter: null,
      nzComponentParams: {
        isViewDetail: true,
        loaiVthh: this.loaiVthh,
        id: row.idQdPdNk
      },
    });
  }

  async openDialogPNK(row) {
    this.modal.create({
      nzTitle: 'Thông tin phiếu nhập kho',
      nzContent: ThongTinPhieuNhapKhoComponent,
      nzMaskClosable: false,
      nzClosable: true,
      nzBodyStyle: { overflowY: 'auto' },//maxHeight: 'calc(100vh - 200px)'
      nzWidth: '95%',
      nzFooter: null,
      nzComponentParams: {
        isView: true,
        loaiVthh: this.loaiVthh,
        idInput: row.phieuNhapKhoId
      },
    });
  }


  buildTableView(data: any[] = []) {
    let dataView = chain(data)
      .groupBy("soQdPdNk")
      ?.map((value1, key1) => {
        let children1 = chain(value1)
          .groupBy("maDiemKho")
          ?.map((value2, key2) => {
            let children2 = chain(value2)
              .groupBy("maLoNganKho")
              ?.map((value3, key3) => {

                // const children3 = chain(value3).groupBy("soBbNhapDayKho")
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


        let row1 = value1?.find(s => s.soQdPdNk === key1);
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

  redirectDetail(data, b: boolean) {
    console.log(data, "123")
    this.selectedId = data.id;
    this.isDetail = true;
    this.isView = b;
    // this.isViewDetail = isView ?? false;
  }

  quayLai() {
    this.showListEvent.emit();
    this.isDetail = false;
    this.isView = false;
    this.timKiem();
  }

}
