import { Component, OnInit } from "@angular/core";
import { NzModalService } from "ng-zorro-antd/modal";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NgxSpinnerService } from "ngx-spinner";
import { PAGE_SIZE_DEFAULT } from "src/app/constants/config";
import { MESSAGE } from "src/app/constants/message";
import { UserLogin } from "src/app/models/userlogin";
import { saveAs } from "file-saver";
import { DanhMucService } from "../../../../../services/danhmuc.service";
import { DanhMucKhoService } from "../../../../../services/danh-muc-kho.service";
import { STATUS } from "../../../../../constants/status";
import { DANH_MUC_LEVEL } from "../../../../luu-kho/luu-kho.constant";
import { DonviService } from "../../../../../services/donvi.service";
import { Base2Component } from "../../../../../components/base2/base2.component";
import { HttpClient } from "@angular/common/http";
import { StorageService } from "../../../../../services/storage.service";
import { ThemMoiDanhMucDuAnKhoComponent } from "./them-moi-danh-muc-du-an-kho/them-moi-danh-muc-du-an-kho.component";

@Component({
  selector: 'app-danh-muc-du-an',
  templateUrl: './danh-muc-du-an.component.html',
  styleUrls: ['./danh-muc-du-an.component.scss']
})
export class DanhMucDuAnComponent extends Base2Component implements OnInit {
  isDetail: boolean = false;
  selectedId: number = 0;
  isViewDetail: boolean;
  tabSelected: string = 'phuong-an-tong-hop'
  danhSachNam: any[] = [];

  listTrangThai = [{"ma": STATUS.CHUA_THUC_HIEN, "giaTri": "Chưa thực hiện"},
    {"ma": STATUS.DANG_THUC_HIEN, "giaTri": "Đang thực hiện"},
    {"ma": STATUS.DA_HOAN_THANH, "giaTri": "Đã hoàn thành"}
  ];

  allChecked = false;
  indeterminate = false;
  dataTableAll: any[] = [];
  dsKhoi: any[] = [];
  dataTable: any[] = [];
  danhSachCuc: any[] = [];
  dsChiCuc: any[] = [];
  dsDiemKho: any[] = [];
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 0;
  userInfo: UserLogin;

  constructor(
    private httpClient: HttpClient,
    private storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private danhMucKhoService: DanhMucKhoService,
    private dviService: DonviService,
    private dmService : DanhMucService
  ) {
    super(httpClient, storageService, notification, spinner, modal, danhMucKhoService);
    super.ngOnInit()
    this.formData = this.fb.group({
      maDvi: [null],
      capDvi: [null],
      soQd: [null],
      khoi: [null],
      tenDuAn: [null],
      diaDiem: [null],
      trangThai: [null],
      giaiDoanTu: [null],
      giaiDoanDen: [null],
      tgKhoiCongTu: [null],
      tgKhoiCongDen: [null],
      tgHoanThanhTu: [null],
      tgHoanThanhDen: [null],
    });
    this.filterTable = {};
  }

  async ngOnInit() {
    this.spinner.show();
    try {
      this.userInfo = this.userService.getUserLogin();
      if (this.userService.isCuc()) {
         this.loadDsKhoi();
         this.loadDsChiCuc();
      } else {
         this.loadDanhSachCuc();
      }
      this.filter();
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async loadDanhSachCuc() {
    if (this.userService.isTongCuc()) {
      const body = {
        maDviCha: this.userInfo.MA_DVI,
        trangThai: '01',
      };

      const dsTong = await this.dviService.layDonViTheoCapDo(body);
      this.danhSachCuc = dsTong[DANH_MUC_LEVEL.CUC];
      this.danhSachCuc = this.danhSachCuc.filter(item => item.type != "PB")
    }
  }


  async loadDsChiCuc() {
    let res = await this.dviService.layTatCaDonViByLevel(3);
    if (res && res.data) {
      this.dsChiCuc = res.data
      this.dsChiCuc = this.dsChiCuc.filter(item => item.type != "PB" && item.maDvi.startsWith(this.userInfo.MA_DVI))
    }
  }

   async changeChiCuc(event: any) {
    if (event) {
      let res = await this.dviService.layTatCaDonViByLevel(4);
      if (res && res.data) {
        this.dsDiemKho = res.data
        this.dsDiemKho = this.dsDiemKho.filter(item => item.type != "PB" && item.maDvi.startsWith(event))
      }
    }
  }

  async loadDsKhoi() {
    let res = await this.dmService.danhMucChungGetAll("KHOI_DU_AN_KT");
    if (res.msg == MESSAGE.SUCCESS) {
      this.dsKhoi = res.data
    }
  }

  exportData() {
    this.spinner.show();
    try {
      let body = this.formData.value;
      this.danhMucKhoService
        .export(body)
        .subscribe((blob) =>
          saveAs(blob, 'danh-muc-kho-tang.xlsx'),
        );
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  openDialog(data: any, isView: boolean) {
    let modalQD = this.modal.create({
      nzContent: ThemMoiDanhMucDuAnKhoComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzBodyStyle : { 'overflow-y': 'auto' },
      nzStyle: {top: '100px'},
      nzWidth: '800px',
      nzFooter: null,
      nzComponentParams: {
        dataDetail: data,
        isViewDetail: isView
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        await this.filter()
      }
    })
  }

  clearForm(currentSearch?: any) {
    this.formData.reset();
    this.filter();
  }

  filter() {
    this.formData.patchValue({
      maDvi : this.userService.isCuc() ? this.userInfo.MA_DVI : null,
      capDvi : this.userInfo.CAP_DVI
    })
    this.search()
  }
}

export class DanhMucKho {
  id: number;
  namKeHoach : number;
  idVirtual : any
  maDuAn: string;
  tenDuAn: string;
  diaDiem: string;
  khoi: string;
  maChiCuc : string;
  tenChiCuc : string;
  maDiemKho : string;
  tenDiemKho : string;
  giaiDoan: any
  tgKcHt: any
  tuNam: number;
  denNam: number;
  tgKhoiCong: any;
  tgHoanThanh: any;
  tmdtDuKien: number;
  nstwDuKien: number;
  soQdPd: string;
  soQdDcPd: string;
  soQdPdDtxd: string;
  tmdtDuyet: number;
  nstwDuyet: number;
  tongSoLuyKe: number;
  luyKeNstw: number;
  khVonTongSo : number;
  khVonNstw : number;
  ncKhTongSo  : number;
  ncKhNstw : number;
  trangThai: string;
  tenTrangThai: string;
  vonDauTu: number;
  maDvi: string
  loaiDuAn: string;
}
