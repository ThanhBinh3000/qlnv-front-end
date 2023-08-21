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
import * as uuidv4 from "uuid";
import { ThongTinQuyetDinhDieuChuyenCucComponent } from 'src/app/pages/dieu-chuyen-noi-bo/quyet-dinh-dieu-chuyen/cuc/thong-tin-quyet-dinh-dieu-chuyen-cuc/thong-tin-quyet-dinh-dieu-chuyen-cuc.component';
import { BangKeNhapKhacNhapVatTuService } from './bang-ke-nhap-khac-nhap-vat-tu.service';

@Component({
  selector: 'app-bang-ke-nhap-khac-nhap-vat-tu',
  templateUrl: './bang-ke-nhap-khac-nhap-vat-tu.component.html',
  styleUrls: ['./bang-ke-nhap-khac-nhap-vat-tu.component.scss']
})
export class BangKeNhapKhacNhapVatTuComponent extends Base2Component implements OnInit {

  isVisibleChangeTab$ = new Subject();
  visibleTab: boolean = true;
  tabSelected: number = 0;
  @Input() loaiDc: string;

  dataTableView: any[] = [];

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private donviService: DonviService,
    private danhMucService: DanhMucService,
    private bangKeNhapKhacNhapVatTuService: BangKeNhapKhacNhapVatTuService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, bangKeNhapKhacNhapVatTuService);
    this.formData = this.fb.group({
      nam: null,
      // loaiVthh: '02',
      soQdPdNk: null,
      soBangKe: null,
      tuNgayThoiHan: null,
      denNgayThoiHan: null,
      tuNgayNhapKho: null,
      denNgayNhapKho: null
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


  data: any = {};
  selectedId: number = 0;
  isView = false;

  async ngOnInit() {
    this.isVisibleChangeTab$.subscribe((value: boolean) => {
      this.visibleTab = value;
    });



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
    if (this.userService.isAccessPermisson('DCNB_QUYETDINHDC_TONGCUC') && this.userService.isAccessPermisson('DCNB_QUYETDINHDC_XEM'))
      return true
    else return false
  }

  isTongCuc() {
    return this.userService.isTongCuc()
  }

  isCuc() {
    return false//this.userService.isCuc()
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
    // if (this.formData.value.ngayDuyetTc) {
    //   this.formData.value.ngayDuyetTcTu = dayjs(this.formData.value.ngayDuyetTc[0]).format('YYYY-MM-DD')
    //   this.formData.value.ngayDuyetTcDen = dayjs(this.formData.value.ngayDuyetTc[1]).format('YYYY-MM-DD')
    // }
    // if (this.formData.value.ngayHieuLuc) {
    //   this.formData.value.ngayHieuLucTu = dayjs(this.formData.value.ngayHieuLuc[0]).format('YYYY-MM-DD')
    //   this.formData.value.ngayHieuLucDen = dayjs(this.formData.value.ngayHieuLuc[1]).format('YYYY-MM-DD')
    // }
    let body = this.formData.value
    body.paggingReq = {
      limit: this.pageSize,
      page: this.page - 1
    }
    let res = await this.bangKeNhapKhacNhapVatTuService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data.content
        .map(element => {
          return {
            ...element,
            // diemKho: `${element.thoiHanDieuChuyen}${element.maDiemKho}`,
            maLoNganKho: element.maLoKho ? `${element.maLoKho}${element.maNganKho}` : element.maNganKho
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
      .groupBy("soQdPdNk")
      ?.map((value1, key1) => {
        let children1 = chain(value1)
          .groupBy("maDiemKho")
          ?.map((value2, key2) => {
            let children2 = chain(value2)
              .groupBy("maLoNganKho")
              ?.map((value3, key3) => {
                const row3 = value3.find(s => s?.maLoNganKho == key3);
                return {
                  ...row3,
                  idVirtual: row3 ? row3.idVirtual ? row3.idVirtual : uuidv4.v4() : uuidv4.v4(),
                  children: value3.filter(f => f.id),
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
          this.bangKeNhapKhacNhapVatTuService.delete(body).then(async () => {
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
        this.bangKeNhapKhacNhapVatTuService
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
  disabledTuNgayThoiHan(startValue: Date): boolean {
    if (startValue && this.formData.value.denNgayThoiHan) {
      return startValue.getTime() > this.formData.value.denNgayThoiHan.getTime();
    }
    return false;
  }
  disabledDenNgayThoiHan(endValue: Date): boolean {
    if (!endValue || !this.formData.value.tuNgayThoiHan) {
      return false;
    }
    return endValue.getTime() <= this.formData.value.tuNgayThoiHan.getTime();
  };
  disabledTuNgayNhapKho(startValue: Date): boolean {
    if (startValue && this.formData.value.denNgayNhapKho) {
      return startValue.getTime() > this.formData.value.denNgayNhapKho.getTime();
    }
    return false;
  }
  disabledDenNgayNhapKho(endValue: Date): boolean {
    if (!endValue || !this.formData.value.tuNgayNhapKho) {
      return false;
    }
    return endValue.getTime() <= this.formData.value.tuNgayNhapKho.getTime();
  }
  redirectDetail(id, b: boolean) {
    this.selectedId = id;
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
