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
import { BangKeCanHangService } from 'src/app/services/qlnv-hang/nhap-hang/nhap-khac/bangKeCanHang';
import * as uuidv4 from "uuid";
import { ThongTinQuyetDinhDieuChuyenCucComponent } from 'src/app/pages/dieu-chuyen-noi-bo/quyet-dinh-dieu-chuyen/cuc/thong-tin-quyet-dinh-dieu-chuyen-cuc/thong-tin-quyet-dinh-dieu-chuyen-cuc.component';
import { ThemmoiQdinhNhapXuatHangKhacComponent } from '../../quyet-dinh-giao-nv-nhap-hang/themmoi-qdinh-nhap-xuat-hang-khac/themmoi-qdinh-nhap-xuat-hang-khac.component';
import { ThongTinPhieuNhapKhoComponent } from '../phieu-nhap-kho/thong-tin-phieu-nhap-kho/thong-tin-phieu-nhap-kho.component';
@Component({
  selector: 'app-bang-ke-can-hang',
  templateUrl: './bang-ke-can-hang.component.html',
  styleUrls: ['./bang-ke-can-hang.component.scss']
})
export class BangKeCanHangComponent extends Base2Component implements OnInit {

  isVisibleChangeTab$ = new Subject();
  visibleTab: boolean = true;
  tabSelected: number = 0;

  @Input()
  loaiVthh: string;
  @Input()
  loaiVthhCache: string;

  CHUC_NANG = CHUC_NANG;
  listLoaiDieuChuyen: any[] = [
    { ma: "ALL", ten: "Tất cả" },
    { ma: "CHI_CUC", ten: "Giữa 2 chi cục trong cùng 1 cục" },
    { ma: "CUC", ten: "Giữa 2 cục DTNN KV" },
  ];
  listLoaiDCFilterTable: any[] = [
    { ma: "CHI_CUC", ten: "Giữa 2 chi cục trong cùng 1 cục" },
    { ma: "CUC", ten: "Giữa 2 cục DTNN KV" },
  ];
  dataTableView: any[] = [];
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

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private donviService: DonviService,
    private danhMucService: DanhMucService,
    private quyetDinhDieuChuyenTCService: QuyetDinhDieuChuyenTCService,
    private bangKeCanHangService: BangKeCanHangService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, bangKeCanHangService);
    this.formData = this.fb.group({
      nam: null,
      soQdGiaoNv: null,
      soBangKe: null,
      ngayNhapKhoTu: null,
      ngayNhapKhoDen: null,
      loaiVthh: [this.loaiVthh]
    })
  }


  dsDonvi: any[] = [];
  userInfo: UserLogin;
  userdetail: any = {};
  data: any = {};
  selectedId: number = 0;
  isVatTu: boolean = false;
  isView = false;


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
      // await this.loadDsVthh();
      await this.spinner.hide();

    } catch (e) {
      console.log('error: ', e)
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }


  }

  disabledStartNgayNK = (startValue: Date): boolean => {
    if (startValue && this.formData.value.ngayNhapKhoDen) {
      return startValue.getTime() > this.formData.value.ngayNhapKhoDen.getTime();
    } else {
      return false;
    }
  };

  disabledEndNgayNK = (endValue: Date): boolean => {
    if (endValue && this.formData.value.ngayNhapKhoTu) {
      return endValue.getTime() < this.formData.value.ngayNhapKhoTu.getTime();
    } else {
      return false;
    }
  };

  isShowDS() {
    if (this.userService.isAccessPermisson('DCNB_QUYETDINHDC_TONGCUC') && this.userService.isAccessPermisson('DCNB_QUYETDINHDC_XEM'))
      return true
    else return false
  }

  isTongCuc() {
    return this.userService.isTongCuc()
  }

  isCuc() {
    this.userService.isCuc()
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
    this.userInfo = this.userService.getUserLogin();
    this.userdetail.maDvi = this.userInfo.MA_DVI;
    this.userdetail.tenDvi = this.userInfo.TEN_DVI;
  }

  setExpand(parantExpand: boolean = false, children: any = []): void {
    if (parantExpand) {
      return children.map(f => ({ ...f, expand: false }))
    }
    return children
  }

  async timKiem() {
    if (this.formData.value.ngayNhapKhoTu) {
      this.formData.value.ngayNhapKhoTu = dayjs(this.formData.value.ngayNhapKhoTu).format('YYYY-MM-DD')
    }
    if (this.formData.value.ngayNhapKhoDen) {
      this.formData.value.ngayNhapKhoDen = dayjs(this.formData.value.ngayNhapKhoDen).format('YYYY-MM-DD')
    }
    let body = this.formData.value
    body.paggingReq = {
      limit: this.pageSize,
      page: this.page - 1
    }
    let res = await this.bangKeCanHangService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.totalRecord = res.data.totalElements;
      let data = res.data.content
        .map(element => {
          return {
            ...element,
            maKho: `${element.maLoKho}${element.maNganKho}${element.maNhaKho}${element.maDiemKho}`
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
          .groupBy("maKho")
          ?.map((value2, key2) => {
            // let children2 = chain(value2)
            //   .groupBy("maLoNganKho")
            //   ?.map((value3, key3) => {

            //     // const children3 = chain(value3).groupBy("maLoNganKho")
            //     //   ?.map((m, im) => {

            //     //     const maChiCucNhan = m.find(f => f.maLoNganKho == im);
            //     //     // const hasMaDiemKhoNhan = vs.some(f => f.maDiemKhoNhan);
            //     //     // if (!hasMaDiemKhoNhan) return {
            //     //     //   ...maChiCucNhan
            //     //     // }

            //     //     // const rssx = chain(m).groupBy("maDiemKhoNhan")?.map((n, inx) => {

            //     //     //   const maDiemKhoNhan = n.find(f => f.maDiemKhoNhan == inx);
            //     //     //   return {
            //     //     //     ...maDiemKhoNhan,
            //     //     //     children: n
            //     //     //   }
            //     //     // }).value()
            //     //     return {
            //     //       ...maChiCucNhan,
            //     //       children: m
            //     //     }
            //     //   }).value()

            //     const row3 = value3.find(s => s?.maLoNganKho == key3);
            //     return {
            //       ...row3,
            //       idVirtual: row3 ? row3.idVirtual ? row3.idVirtual : uuidv4.v4() : uuidv4.v4(),
            //       children: value3,
            //     }
            //   }
            //   ).value();

            let row2 = value2?.find(s => s.maKho == key2);

            return {
              ...row2,
              idVirtual: row2 ? row2.idVirtual ? row2.idVirtual : uuidv4.v4() : uuidv4.v4(),
              children: value2,
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
          this.bangKeCanHangService.delete(body).then(async () => {
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

  redirectDetail(id, b: boolean) {
    this.selectedId = id;
    this.isDetail = true;
    this.isView = b;
    this.data = null
  }

  quayLai() {
    this.showListEvent.emit();
    this.isDetail = false;
    this.isView = false;
    this.timKiem();
  }

}
