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
import { BienBanKetThucNhapKhoService } from 'src/app/services/dieu-chuyen-noi-bo/nhap-dieu-chuyen/bien-ban-ket-thuc-nhap-kho';
import { ThongTinQuyetDinhDieuChuyenCucComponent } from 'src/app/pages/dieu-chuyen-noi-bo/quyet-dinh-dieu-chuyen/cuc/thong-tin-quyet-dinh-dieu-chuyen-cuc/thong-tin-quyet-dinh-dieu-chuyen-cuc.component';

@Component({
  selector: 'app-bien-ban-ket-thuc-nhap-kho',
  templateUrl: './bien-ban-ket-thuc-nhap-kho.component.html',
  styleUrls: ['./bien-ban-ket-thuc-nhap-kho.component.scss']
})
export class BienBanKetThucNhapKhoComponent extends Base2Component implements OnInit {
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
    private bienBanKetThucNhapKhoService: BienBanKetThucNhapKhoService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, bienBanKetThucNhapKhoService);
    this.formData = this.fb.group({
      nam: null,
      soQdinh: null,
      soBban: null,
      tuNgayKtnk: null,
      denNgayKtnk: null,
      tuNgayThoiHanNhap: null,
      denNgayThoiHanNhap: null,
      type: ["01"],
      loaiDc: ["DCNB"],
      isVatTu: [true],
      loaiQdinh: [],
      thayDoiThuKho: [],
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

  disabledStartNgayNK = (startValue: Date): boolean => {
    if (startValue && this.formData.value.denNgayKtnk) {
      return startValue.getTime() > this.formData.value.denNgayKtnk.getTime();
    } else {
      return false;
    }
  };

  disabledEndNgayNK = (endValue: Date): boolean => {
    if (endValue && this.formData.value.tuNgayKtnk) {
      return endValue.getTime() < this.formData.value.tuNgayKtnk.getTime();
    } else {
      return false;
    }
  };

  disabledStartNgayNH = (startValue: Date): boolean => {
    if (startValue && this.formData.value.denNgayThoiHanNhap) {
      return startValue.getTime() > this.formData.value.denNgayThoiHanNhap.getTime();
    } else {
      return false;
    }
  };

  disabledEndNgayNH = (endValue: Date): boolean => {
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
    let res = await this.bienBanKetThucNhapKhoService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.totalRecord = res.data.totalElements;
      let data = res.data.content
        .map(element => {
          return {
            ...element,
            maloNganKho: `${element.maLoKho}${element.maNganKho}${element.soBBKtNH}`
          }
        });
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
            let children2 = chain(value2)
              .groupBy("maloNganKho")
              ?.map((value3, key3) => {

                // const children3 = chain(value3).groupBy("maloNganKhoNhan")
                //   ?.map((m, im) => {

                //     const maChiCucNhan = m.find(f => f.maloNganKhoNhan == im);
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
        this.bienBanKetThucNhapKhoService
          .export(body)
          .subscribe((blob) =>
            saveAs(blob, 'dcnb-bien-ban-ket-thuc-nhap-kho.xlsx'),
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

  isPheDuyet(row) {
    return row.trangThai == STATUS.CHO_DUYET_KTVBQ || row.trangThai == STATUS.CHO_DUYET_KT || row.trangThai == STATUS.CHO_DUYET_LDCC
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
          this.bienBanKetThucNhapKhoService.delete(body).then(async () => {
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

