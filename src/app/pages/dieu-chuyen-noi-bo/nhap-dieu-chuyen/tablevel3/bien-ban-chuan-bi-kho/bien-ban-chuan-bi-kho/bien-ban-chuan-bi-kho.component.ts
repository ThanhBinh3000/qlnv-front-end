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
import { BienBanNghiemThuBaoQuanLanDauService } from 'src/app/services/dieu-chuyen-noi-bo/nhap-dieu-chuyen/bien-ban-nghiem-thu-bao-quan-lan-dau.service';
import { BienBanChuanBiKhoService } from 'src/app/services/dieu-chuyen-noi-bo/nhap-dieu-chuyen/bien-ban-chuan-bi-kho';
import { ThongTinQuyetDinhDieuChuyenCucComponent } from 'src/app/pages/dieu-chuyen-noi-bo/quyet-dinh-dieu-chuyen/cuc/thong-tin-quyet-dinh-dieu-chuyen-cuc/thong-tin-quyet-dinh-dieu-chuyen-cuc.component';
import * as uuidv4 from "uuid";

@Component({
  selector: 'app-bien-ban-chuan-bi-kho',
  templateUrl: './bien-ban-chuan-bi-kho.component.html',
  styleUrls: ['./bien-ban-chuan-bi-kho.component.scss']
})
export class BienBanChuanBiKhoComponent extends Base2Component implements OnInit {

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
    private bbChuanBiKhoService: BienBanChuanBiKhoService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, bbChuanBiKhoService);
    this.formData = this.fb.group({
      nam: null,
      soQdinh: null,
      soBban: null,
      ngayLap: null,
      ngayKetThuc: null,
      type: ["01"],
      loaiDc: ["DCNB"]
    })
  }


  // dsDonvi: any[] = [];
  // userInfo: UserLogin;
  data: any = {};
  selectedId: number = 0;
  // isVatTu: boolean = false;
  isView = false;



  async ngOnInit() {
    this.isVisibleChangeTab$.subscribe((value: boolean) => {
      this.visibleTab = value;
    });

    // if (this.idTHop)
    //   this.redirectDetail(0, false)

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
    // console.log('DSQuyetDinhDieuChuyenComponent/this.formData.value=>', this.formData.value)
    // await this.search();
    let body = this.formData.value
    body.paggingReq = {
      limit: this.pageSize,
      page: this.page - 1
    }
    let res = await this.bbChuanBiKhoService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data.content
        .map(element => {
          return {
            ...element,
            // maKho: `${element.thoiHanDieuChuyen}${element.tenDiemKho}`,
            // maloNganKho: `${element.maloKho}${element.maNganKho}`
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
          this.bbChuanBiKhoService.delete(body).then(async () => {
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
        // if (this.formData.value.ngayDuyetTc) {
        //   body.ngayDuyetTcTu = body.ngayDuyetTc[0];
        //   body.ngayDuyetTcDen = body.ngayDuyetTc[1];
        // }
        // if (this.formData.value.ngayHieuLuc) {
        //   body.ngayHieuLucTu = body.ngayHieuLuc[0];
        //   body.ngayHieuLucDen = body.ngayHieuLuc[1];
        // }
        this.bbChuanBiKhoService
          .export(body)
          .subscribe((blob) =>
            saveAs(blob, 'bien-ban-nghiem-thu-bao-quan-lan-dau.xlsx'),
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
    // this.isViewDetail = isView ?? false;
  }

  quayLai() {
    this.showListEvent.emit();
    this.isDetail = false;
    this.isView = false;
    this.timKiem();
  }

}
