import {
  Component,
  Input,
  OnInit
} from "@angular/core";
import dayjs from "dayjs";
import { cloneDeep } from "lodash";
import { NzModalService } from "ng-zorro-antd/modal";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NgxSpinnerService } from "ngx-spinner";
import { PAGE_SIZE_DEFAULT } from "src/app/constants/config";
import { MESSAGE } from "src/app/constants/message";
import { UserLogin } from "src/app/models/userlogin";
import { UserService } from "src/app/services/user.service";
import { convertTrangThai } from "src/app/shared/commonFunction";
import { Globals } from "src/app/shared/globals";
import { saveAs } from "file-saver";
import { DANH_MUC_LEVEL } from "../../../../luu-kho/luu-kho.constant";
import { DonviService } from "../../../../../services/donvi.service";
import { DxXdTrungHanService } from "../../../../../services/dx-xd-trung-han.service";
import { CHUC_NANG, STATUS } from "../../../../../constants/status";
import { TongHopKhTrungHanService } from "../../../../../services/tong-hop-kh-trung-han.service";
import { Route, Router } from "@angular/router";
import { KeHoachComponent } from "../../ke-hoach.component";

@Component({
  selector: "app-de-xuat-ke-hoach",
  templateUrl: "./de-xuat-ke-hoach.component.html",
  styleUrls: ["./de-xuat-ke-hoach.component.scss"]
})
export class DeXuatKeHoachComponent implements OnInit {
  @Input() typeVthh: string;

  idTongHop: number = 0;
  isViewTh: boolean;
  CHUC_NANG = CHUC_NANG;
  isDetail: boolean = false;
  selectedId: number = 0;
  isViewDetail: boolean;
  tabSelected: string = "phuong-an-tong-hop";
  searchValue = "";
  listNam: any[] = [];
  danhSachCuc: any[] = [];

  STATUS = STATUS;

  searchFilter = {
    namKeHoach: "",
    soCongVan: "",
    maDvi: null,
    capDvi: "",
    ngayDuyetTu: "",
    ngayDuyetDen: "",
    namBatDau: "",
    namKetThuc: ""
  };

  filterTable: any = {
    soCongVan: "",
    namKeHoach: "",
    giaiDoan: "",
    tenDvi: "",
    ngayDuyet: "",
    soQdGoc: "",
    tmdt: "",
    trichYeu: "",
    maTongHop: "",
    tenTrangThai: ""
  };
  public vldTrangThai: KeHoachComponent;
  allChecked = false;
  indeterminate = false;
  dataTableAll: any[] = [];
  dataTable: any[] = [];
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 0;
  userInfo: UserLogin;
  listTrangThai: any[] = [
    { ma: this.STATUS.DU_THAO, giaTri: "Dự thảo" },
    { ma: this.STATUS.CHO_DUYET_TP, giaTri: "Chờ duyệt - TP" },
    { ma: this.STATUS.TU_CHOI_TP, giaTri: "Từ chối - TP" },
    { ma: this.STATUS.CHO_DUYET_LDC, giaTri: "Chờ duyệt - LĐC" },
    { ma: this.STATUS.TU_CHOI_LDC, giaTri: "Từ chối - LĐC" },
    { ma: this.STATUS.DA_DUYET_LDC, giaTri: "Đã duyệt - LĐC" },
    { ma: this.STATUS.DA_DUYET_CBV, giaTri: "Đã duyệt - Cán bộ Vụ" },
    { ma: this.STATUS.TU_CHOI_CBV, giaTri: "Từ chối - Cán bộ Vụ" }
  ];

  constructor(
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    private dviService: DonviService,
    private deXuatTrungHanService: DxXdTrungHanService,
    private modal: NzModalService,
    public userService: UserService,
    public globals: Globals,
    private tongHopTrungHanService: TongHopKhTrungHanService,
    private router: Router
  ) {
  }

  async ngOnInit() {
    if (!this.userService.isAccessPermisson('QLKT_QHKHKT_KHDTXDTRUNGHAN_DX')) {
      this.router.navigateByUrl('/error/401')
    }
    this.spinner.show();
    try {
      this.userInfo = this.userService.getUserLogin();
      this.loadDsNam();
      await this.search();
      await this.loadDanhSachCuc();
      this.spinner.hide();
    } catch (e) {
      console.log("error: ", e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  loadDsNam() {
    for (let i = -3; i < 23; i++) {
      this.listNam.push({
        value: dayjs().get("year") - i,
        text: dayjs().get("year") - i
      });
    }
  }

  async loadDanhSachCuc() {
    const body = {
      maDviCha: this.userInfo.MA_DVI,
      trangThai: "01"
    };

    const dsTong = await this.dviService.layDonViTheoCapDo(body);
    this.danhSachCuc = dsTong[DANH_MUC_LEVEL.CUC];
    this.danhSachCuc = this.danhSachCuc.filter(item => item.type != "PB");
    if (this.userService.isCuc()) {
      this.searchFilter.maDvi = this.userInfo.MA_DVI;
    }
  }

  async search() {
    this.spinner.show();
    let body = {
      namKeHoach: this.searchFilter.namKeHoach,
      namBatDau: this.searchFilter.namBatDau,
      namKetThuc: this.searchFilter.namKetThuc,
      ngayDuyetTu: this.searchFilter.ngayDuyetTu,
      ngayDuyetDen: this.searchFilter.ngayDuyetDen,
      soCongVan: this.searchFilter.soCongVan,
      paggingReq: {
        limit: this.pageSize,
        page: this.page - 1
      },
      maDvi: this.userService.isCuc() ? this.userInfo.MA_DVI : this.searchFilter.maDvi,
      capDvi: this.userInfo.CAP_DVI
    };
    let res = await this.deXuatTrungHanService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.dataTable = data.content;
      this.totalRecord = data.totalElements;
      if (this.dataTable && this.dataTable.length > 0) {
        this.dataTable.forEach((item) => {
          item.checked = false;
        });
      }
      this.dataTableAll = cloneDeep(this.dataTable);
    } else {
      this.dataTable = [];
      this.totalRecord = 0;
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    this.spinner.hide();
  }

  async changePageIndex(event) {
    this.spinner.show();
    try {
      this.page = event;
      this.spinner.hide();
      await this.search();
    } catch (e) {
      console.log("error: ", e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  updateAllChecked(): void {
    this.indeterminate = false;
    if (this.allChecked) {
      if (this.dataTable && this.dataTable.length > 0) {
        this.dataTable.forEach((item) => {
          if (item.trangThai == STATUS.DU_THAO) {
            item.checked = true;
          }
        });
      }
    } else {
      if (this.dataTable && this.dataTable.length > 0) {
        this.dataTable.forEach((item) => {
          item.checked = false;
        });
      }
    }
  }

  updateSingleChecked(): void {
    if (this.dataTable.every((item) => !item.checked)) {
      this.allChecked = false;
      this.indeterminate = false;
    } else if (this.dataTable.every((item) => item.checked)) {
      this.allChecked = true;
      this.indeterminate = false;
    } else {
      this.indeterminate = true;
    }
  }

  async changePageSize(event) {
    this.spinner.show();
    try {
      this.pageSize = event;
      this.spinner.hide();
      await this.search();
    } catch (e) {
      console.log("error: ", e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  redirectToChiTiet(id: number, isView?: boolean) {
    this.selectedId = id;
    this.isDetail = true;
    this.isViewDetail = isView ?? false;
  }

  convertTrangThai(status: string) {
    return convertTrangThai(status);
  }

  async showList() {
    this.isDetail = false;
    await this.search();
  }

  clearFilter() {
    this.searchFilter = {
      namKeHoach: "",
      soCongVan: "",
      maDvi: "",
      capDvi: "",
      ngayDuyetTu: "",
      ngayDuyetDen: "",
      namBatDau: "",
      namKetThuc: ""
    };
    this.search();
  }

  xoaItem(item: any) {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: "Xác nhận",
      nzContent: "Bạn có chắc chắn muốn xóa?",
      nzOkText: "Đồng ý",
      nzCancelText: "Không",
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: () => {
        this.spinner.show();
        try {
          let body = {
            id: item.id,
            maDvi: ""
          };
          this.deXuatTrungHanService.delete(body).then(async () => {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.DELETE_SUCCESS);
            await this.search();
            this.spinner.hide();
          });
        } catch (e) {
          console.log("error: ", e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      }
    });
  }

  exportData() {
    if (this.totalRecord > 0) {
      this.spinner.show();
      try {
        let body = {
          namKeHoach: this.searchFilter.namKeHoach,
          namBatDau: this.searchFilter.namBatDau,
          namKetThuc: this.searchFilter.namKetThuc,
          ngayDuyetTu: this.searchFilter.ngayDuyetTu,
          ngayDuyetDen: this.searchFilter.ngayDuyetDen,
          soCongVan: this.searchFilter.soCongVan,
          paggingReq: {
            limit: this.pageSize,
            page: this.page - 1
          },
          maDvi: this.userService.isCuc() ? this.userInfo.MA_DVI : null,
          capDvi: this.userInfo.CAP_DVI
        };
        this.deXuatTrungHanService
          .export(body)
          .subscribe((blob) =>
            saveAs(blob, "de-xuat-ke-hoach-trung-han.xlsx")
          );
        this.spinner.hide();
      } catch (e) {
        console.log("error: ", e);
        this.spinner.hide();
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
    } else {
      this.notification.error(MESSAGE.ERROR, MESSAGE.DATA_EMPTY);
    }
  }

  filterInTable(key: string, value: string) {
    if (value && value != "") {
      this.dataTable = [];
      let temp = [];
      if (this.dataTableAll && this.dataTableAll.length > 0) {
        this.dataTableAll.forEach((item) => {
          item.giaiDoan = item.namBatDau + " - " + item.namKetThuc;
          if (["ngayKy", "ngayGiaoNhan", "ngayHieuLuc", "ngayHetHieuLuc", "ngayDeXuat", "ngayTongHop", "ngayTao", "ngayQd", "tgianNhang", "tgianThien", "ngayDx", "ngayPduyet", "ngayThop", "thoiGianGiaoNhan", "ngayKyQd", "ngayNhanCgia", "ngayKyDc", "tgianGnhan"].includes(key)) {
            if (item[key] && dayjs(item[key]).format("DD/MM/YYYY").indexOf(value.toString()) != -1) {
              temp.push(item);
            }
          } else {
            if (item[key] && item[key].toString().toLowerCase().indexOf(value.toString().toLowerCase()) != -1) {
              temp.push(item);
            }
          }
        });
      }
      this.dataTable = [...this.dataTable, ...temp];
    } else {
      this.dataTable = cloneDeep(this.dataTableAll);
    }
  }

  clearFilterTable() {
    this.filterTable = {
      soQd: "",
      ngayQd: "",
      trichYeu: "",
      soQdGoc: "",
      namKhoach: "",
      tenVthh: "",
      soGoiThau: "",
      trangThai: ""
    };
  }

  deleteMulti(roles?) {
    let dataDelete = [];
    if (this.dataTable && this.dataTable.length > 0) {
      this.dataTable.forEach((item) => {
        if (item.checked) {
          dataDelete.push(item.id);
        }
      });
    }
    if (dataDelete && dataDelete.length > 0) {
      this.modal.confirm({
        nzClosable: false,
        nzTitle: "Xác nhận",
        nzContent: "Bạn có chắc chắn muốn xóa các bản ghi đã chọn?",
        nzOkText: "Đồng ý",
        nzCancelText: "Không",
        nzOkDanger: true,
        nzWidth: 310,
        nzOnOk: async () => {
          this.spinner.show();
          try {
            let res = await this.deXuatTrungHanService.deleteMuti({ ids: dataDelete });
            if (res.msg == MESSAGE.SUCCESS) {
              this.notification.success(MESSAGE.SUCCESS, MESSAGE.DELETE_SUCCESS);
              await this.search();
              this.allChecked = false;
            } else {
              this.notification.error(MESSAGE.ERROR, res.msg);
            }
          } catch (e) {
            console.log("error: ", e);
            this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
          } finally {
            this.spinner.hide();
          }
        }
      });
    } else {
      this.notification.error(MESSAGE.ERROR, "Không có dữ liệu phù hợp để xóa.");
    }
  }


  convertDateToString(event: any): string {
    let result = "";
    if (event) {
      result = dayjs(event).format("DD/MM/YYYY").toString();
    }
    return result;
  }
}
