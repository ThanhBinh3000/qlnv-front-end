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
import { PhieuKiemNghiemChatLuongService } from 'src/app/services/dieu-chuyen-noi-bo/nhap-dieu-chuyen/phieu-kiem-nghiem-chat-luong';
import * as uuidv4 from "uuid";
import { ThongTinQuyetDinhDieuChuyenCucComponent } from 'src/app/pages/dieu-chuyen-noi-bo/quyet-dinh-dieu-chuyen/cuc/thong-tin-quyet-dinh-dieu-chuyen-cuc/thong-tin-quyet-dinh-dieu-chuyen-cuc.component';
@Component({
  selector: 'app-kiem-nghiem-chat-luong',
  templateUrl: './kiem-nghiem-chat-luong.component.html',
  styleUrls: ['./kiem-nghiem-chat-luong.component.scss']
})
export class KiemNghiemChatLuongComponent extends Base2Component implements OnInit {

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
    private quyetDinhDieuChuyenTCService: QuyetDinhDieuChuyenTCService,
    private phieuKiemNghiemChatLuongService: PhieuKiemNghiemChatLuongService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, phieuKiemNghiemChatLuongService);
    this.formData = this.fb.group({
      nam: null,
      soQdinhDcc: null,
      soPhieu: null,
      tuNgayLapPhieu: null,
      denNgayLapPhieu: null,
      soBbLayMau: null,
      soBbXuatDocKho: null,
      type: ["01"],
      loaiDc: ["DCNB"],
      loaiQdinh: [],
      thayDoiThuKho: []
    })
  }


  data: any[] = [];
  userInfo: UserLogin;
  userdetail: any = {};
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

  disabledStartNgayKN = (startValue: Date): boolean => {
    if (startValue && this.formData.value.denNgayLapPhieu) {
      return startValue.getTime() > this.formData.value.denNgayLapPhieu.getTime();
    } else {
      return false;
    }
  };

  disabledEndNgayKN = (endValue: Date): boolean => {
    if (endValue && this.formData.value.tuNgayLapPhieu) {
      return endValue.getTime() < this.formData.value.tuNgayLapPhieu.getTime();
    } else {
      return false;
    }
  };

  isShowDS() {
    return (this.userService.isAccessPermisson('DCNB_NHAP_NBCC_KTCL_LT_PKNCL_XEM') || this.userService.isAccessPermisson('DCNB_NHAP_CUNG1CUC_KTCL_LT_PKNCL_XEM') || this.userService.isAccessPermisson('DCNB_NHAP_2CUC_KTCL_LT_PKNCL_XEM'))
  }

  isXoa() {
    return this.isCuc() && (this.userService.isAccessPermisson('DCNB_NHAP_NBCC_KTCL_LT_PKNCL_XOA') || this.userService.isAccessPermisson('DCNB_NHAP_CUNG1CUC_KTCL_LT_PKNCL_XOA') || this.userService.isAccessPermisson('DCNB_NHAP_2CUC_KTCL_LT_PKNCL_XOA'))
  }

  isExport() {
    return this.isCuc() && (this.userService.isAccessPermisson('DCNB_NHAP_NBCC_KTCL_LT_PKNCL_EXP') || this.userService.isAccessPermisson('DCNB_NHAP_CUNG1CUC_KTCL_LT_PKNCL_EXP') || this.userService.isAccessPermisson('DCNB_NHAP_2CUC_KTCL_LT_PKNCL_EXP'))
  }

  isThem() {
    return this.isCuc() && (this.userService.isAccessPermisson('DCNB_NHAP_NBCC_KTCL_LT_PKNCL_THEM') || this.userService.isAccessPermisson('DCNB_NHAP_CUNG1CUC_KTCL_LT_PKNCL_THEM') || this.userService.isAccessPermisson('DCNB_NHAP_2CUC_KTCL_LT_PKNCL_THEM'))
  }

  isDuyetTP() {
    return this.isCuc() && (this.userService.isAccessPermisson('DCNB_NHAP_NBCC_KTCL_LT_PKNCL_DUYET_TP') || this.userService.isAccessPermisson('DCNB_NHAP_CUNG1CUC_KTCL_LT_PKNCL_DUYET_TP') || this.userService.isAccessPermisson('DCNB_NHAP_2CUC_KTCL_LT_PKNCL_DUYET_TP'))
  }

  isDuyetLD() {
    return this.isCuc() && (this.userService.isAccessPermisson('DCNB_NHAP_NBCC_KTCL_LT_PKNCL_DUYET_LDCUC') || this.userService.isAccessPermisson('DCNB_NHAP_CUNG1CUC_KTCL_LT_PKNCL_DUYET_LDCUC') || this.userService.isAccessPermisson('DCNB_NHAP_2CUC_KTCL_LT_PKNCL_DUYET_LDCUC'))
  }

  isCuc() {
    return this.userService.isCuc()
  }


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

  async changePageIndex(event) {
    this.page = event;
    await this.timKiem();
  }

  async changePageSize(event) {
    this.pageSize = event;
    await this.timKiem();
  }

  async timKiem() {
    if (this.formData.value.tuNgayLapPhieu) {
      this.formData.value.tuNgayLapPhieu = dayjs(this.formData.value.tuNgayLapPhieu).format('YYYY-MM-DD')
    }
    if (this.formData.value.denNgayLapPhieu) {
      this.formData.value.denNgayLapPhieu = dayjs(this.formData.value.denNgayLapPhieu).format('YYYY-MM-DD')
    }
    let body = this.formData.value
    // if (body.soQdinh) body.soQdinh = `${body.soQdinh}/DCNB`
    body.paggingReq = {
      limit: this.pageSize,
      page: this.page - 1
    }
    let res = await this.phieuKiemNghiemChatLuongService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      this.totalRecord = res.data.totalElements;
      let data = res.data.content
        .map(element => {
          return {
            ...element,
            maKho: `${element.thoiHanDieuChuyen}${element.tenDiemKho}`,
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
      nzWidth: '90%',
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
          .groupBy("maKho")
          ?.map((value2, key2) => {

            let row2 = value2?.find(s => s.maKho == key2);

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

  exportDataTC() {
    if (this.totalRecord > 0) {
      this.spinner.show();
      try {

        if (this.formData.value.tuNgayLapPhieu) {
          this.formData.value.tuNgayLapPhieu = dayjs(this.formData.value.tuNgayLapPhieu).format('YYYY-MM-DD')
        }
        if (this.formData.value.denNgayLapPhieu) {
          this.formData.value.denNgayLapPhieu = dayjs(this.formData.value.denNgayLapPhieu).format('YYYY-MM-DD')
        }

        let body = this.formData.value;

        this.phieuKiemNghiemChatLuongService
          .export(body)
          .subscribe((blob) =>
            saveAs(blob, 'dcnb-phieu-kiem-nghiem-chat-luong.xlsx'),
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
          this.phieuKiemNghiemChatLuongService.delete(body).then(async () => {
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
