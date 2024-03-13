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
import { chain, cloneDeep } from 'lodash';
import { CHUC_NANG, STATUS } from 'src/app/constants/status';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { Subject } from 'rxjs';
import { QuyetDinhDieuChuyenTCService } from 'src/app/services/dieu-chuyen-noi-bo/quyet-dinh-dieu-chuyen/quyet-dinh-dieu-chuyen-tc.service';
import { BienBanNghiemThuBaoQuanLanDauService } from 'src/app/services/dieu-chuyen-noi-bo/nhap-dieu-chuyen/bien-ban-nghiem-thu-bao-quan-lan-dau.service';
import * as uuidv4 from "uuid";
import { ThongTinQuyetDinhDieuChuyenCucComponent } from 'src/app/pages/dieu-chuyen-noi-bo/quyet-dinh-dieu-chuyen/cuc/thong-tin-quyet-dinh-dieu-chuyen-cuc/thong-tin-quyet-dinh-dieu-chuyen-cuc.component';

@Component({
  selector: 'app-bien-ban-nghiem-thu-bao-quan-lan-dau',
  templateUrl: './bien-ban-nghiem-thu-bao-quan-lan-dau.component.html',
  styleUrls: ['./bien-ban-nghiem-thu-bao-quan-lan-dau.component.scss']
})
export class BienBanNghiemThuBaoQuanLanDauComponent extends Base2Component implements OnInit {
  @Input() loaiDc: string;

  isVisibleChangeTab$ = new Subject();
  visibleTab: boolean = true;
  tabSelected: number = 0;

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private bbNghiemThuBaoQuanLanDauService: BienBanNghiemThuBaoQuanLanDauService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, bbNghiemThuBaoQuanLanDauService);
    this.formData = this.fb.group({
      nam: null,
      soQdinh: null,
      soBban: null,
      tuNgayLap: [],
      denNgayLap: [],
      tuNgayKtnt: [],
      denNgayKtnt: [],
      type: ["01"],
      loaiDc: ["DCNB"],
      loaiQdinh: [],
      thayDoiThuKho: []
    })
  }

  dataTableView: any[] = [];
  selectedId: number = 0;
  data: any;
  isView = false;

  async ngOnInit() {
    this.isVisibleChangeTab$.subscribe((value: boolean) => {
      this.visibleTab = value;
    });
    this.formData.patchValue({
      loaiDc: this.loaiDc,
      loaiQdinh: this.loaiDc === "CUC" ? "NHAP" : null,
      thayDoiThuKho: true
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

  disabledStartNgayKT = (startValue: Date): boolean => {
    if (startValue && this.formData.value.denNgayKtnt) {
      return startValue.getTime() > this.formData.value.denNgayKtnt.getTime();
    } else {
      return false;
    }
  };

  disabledEndNgayKT = (endValue: Date): boolean => {
    if (endValue && this.formData.value.tuNgayKtnt) {
      return endValue.getTime() < this.formData.value.tuNgayKtnt.getTime();
    } else {
      return false;
    }
  };

  isShowDS() {
    return (this.userService.isAccessPermisson('DCNB_NHAP_NBCC_KTCL_LT_BBNTBQLD_XEM') || this.userService.isAccessPermisson('DCNB_NHAP_CUNG1CUC_KTCL_LT_BBNTBQLD_XEM') || this.userService.isAccessPermisson('DCNB_NHAP_2CUC_KTCL_LT_BBNTBQLD_XEM'))
  }

  isXoa() {
    return this.isChiCuc() && (this.userService.isAccessPermisson('DCNB_NHAP_NBCC_KTCL_LT_BBNTBQLD_XOA') || this.userService.isAccessPermisson('DCNB_NHAP_CUNG1CUC_KTCL_LT_BBNTBQLD_XOA') || this.userService.isAccessPermisson('DCNB_NHAP_2CUC_KTCL_LT_BBNTBQLD_XOA'))
  }

  isExport() {
    return this.isChiCuc() && (this.userService.isAccessPermisson('DCNB_NHAP_NBCC_KTCL_LT_BBNTBQLD_EXP') || this.userService.isAccessPermisson('DCNB_NHAP_CUNG1CUC_KTCL_LT_BBNTBQLD_EXP') || this.userService.isAccessPermisson('DCNB_NHAP_2CUC_KTCL_LT_BBNTBQLD_EXP'))
  }

  isThem() {
    return this.isChiCuc() && (this.userService.isAccessPermisson('DCNB_NHAP_NBCC_KTCL_LT_BBNTBQLD_THEM') || this.userService.isAccessPermisson('DCNB_NHAP_CUNG1CUC_KTCL_LT_BBNTBQLD_THEM') || this.userService.isAccessPermisson('DCNB_NHAP_2CUC_KTCL_LT_BBNTBQLD_THEM'))
  }

  isDuyetTK() {
    return this.isChiCuc() && (this.userService.isAccessPermisson('DCNB_NHAP_NBCC_KTCL_LT_BBNTBQLD_DUYET_THUKHO') || this.userService.isAccessPermisson('DCNB_NHAP_CUNG1CUC_KTCL_LT_BBNTBQLD_DUYET_THUKHO') || this.userService.isAccessPermisson('DCNB_NHAP_2CUC_KTCL_LT_BBNTBQLD_DUYET_THUKHO'))
  }

  isDuyetKT() {
    return this.isChiCuc() && (this.userService.isAccessPermisson('DCNB_NHAP_NBCC_KTCL_LT_BBNTBQLD_DUYET_KETOAN') || this.userService.isAccessPermisson('DCNB_NHAP_CUNG1CUC_KTCL_LT_BBNTBQLD_DUYET_KETOAN') || this.userService.isAccessPermisson('DCNB_NHAP_2CUC_KTCL_LT_BBNTBQLD_DUYET_KETOAN'))
  }

  isDuyetLD() {
    return this.isChiCuc() && (this.userService.isAccessPermisson('DCNB_NHAP_NBCC_KTCL_LT_BBNTBQLD_DUYET_LDCCUC') || this.userService.isAccessPermisson('DCNB_NHAP_CUNG1CUC_KTCL_LT_BBNTBQLD_DUYET_LDCCUC') || this.userService.isAccessPermisson('DCNB_NHAP_2CUC_KTCL_LT_BBNTBQLD_DUYET_LDCCUC'))
  }

  isCuc() {
    return this.userService.isCuc()
  }

  isChiCuc() {
    return this.userService.isChiCuc()
  }

  isDuyet(row) {
    return this.userService.isChiCuc() && this.isDuyetLD() && (row.trangThai === STATUS.CHO_DUYET_TK || row.trangThai === STATUS.CHO_DUYET_KT || row.trangThai === STATUS.CHO_DUYET_LDCC)
  }

  isEdit(row) {
    return this.userService.isChiCuc() && this.isThem() && (row.trangThai == STATUS.DU_THAO || row.trangThai == STATUS.TU_CHOI_TK || row.trangThai == STATUS.TU_CHOI_KT || row.trangThai == STATUS.TU_CHOI_LDCC)
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
    if (this.formData.value.tuNgayKtnt) {
      this.formData.value.tuNgayKtnt = dayjs(this.formData.value.tuNgayKtnt).format('YYYY-MM-DD')
    }
    if (this.formData.value.denNgayKtnt) {
      this.formData.value.denNgayKtnt = dayjs(this.formData.value.denNgayKtnt).format('YYYY-MM-DD')
    }
    let body = this.formData.value
    // if (body.soQdinh) body.soQdinh = `${body.soQdinh}/DCNB`
    body.paggingReq = {
      limit: this.pageSize,
      page: this.page - 1
    }
    let res = await this.bbNghiemThuBaoQuanLanDauService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.totalRecord = res.data.totalElements;
      let data = res.data.content
        .map(element => {
          return {
            ...element,
            maKhoXuat: `${element.thoiHanDieuChuyen}${element.maLoKhoXuat}${element.maNganKhoXuat}`,
            maloNganKhoNhan: `${element.maLoKhoNhan}${element.maNganKhoNhan}`
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
          .groupBy("maKhoXuat")
          ?.map((value2, key2) => {
            let children2 = chain(value2)
              .groupBy("maDiemKhoNhan")
              ?.map((value3, key3) => {

                const children3 = chain(value3).groupBy("maloNganKhoNhan")
                  ?.map((m, im) => {

                    const maChiCucNhan = m.find(f => f.maloNganKhoNhan == im);
                    return {
                      ...maChiCucNhan,
                      children: m
                    }
                  }).value()

                const row3 = value3.find(s => s?.maDiemKhoNhan == key3);
                return {
                  ...row3,
                  idVirtual: row3 ? row3.idVirtual ? row3.idVirtual : uuidv4.v4() : uuidv4.v4(),
                  children: children3,
                }
              }
              ).value();

            let row2 = value2?.find(s => s.maKhoXuat == key2);

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
        if (this.formData.value.tuNgayKtnt) {
          this.formData.value.tuNgayKtnt = dayjs(this.formData.value.tuNgayKtnt).format('YYYY-MM-DD')
        }
        if (this.formData.value.denNgayKtnt) {
          this.formData.value.denNgayKtnt = dayjs(this.formData.value.denNgayKtnt).format('YYYY-MM-DD')
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
        this.bbNghiemThuBaoQuanLanDauService
          .export(body)
          .subscribe((blob) =>
            saveAs(blob, 'dcnb-bien-ban-nghiem-thu-bao-quan-lan-dau.xlsx'),
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
          this.bbNghiemThuBaoQuanLanDauService.delete(body).then(async () => {
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
