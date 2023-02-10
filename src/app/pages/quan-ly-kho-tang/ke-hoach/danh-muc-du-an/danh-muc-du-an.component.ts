import {
  Component,
  OnInit,
} from '@angular/core';
import dayjs from 'dayjs';
import {cloneDeep} from 'lodash';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NgxSpinnerService} from 'ngx-spinner';
import {PAGE_SIZE_DEFAULT} from 'src/app/constants/config';
import {MESSAGE} from 'src/app/constants/message';
import {UserLogin} from 'src/app/models/userlogin';
import {UserService} from 'src/app/services/user.service';
import {Globals} from 'src/app/shared/globals';
import {saveAs} from 'file-saver';
import {DanhMucService} from "../../../../services/danhmuc.service";
import {DanhMucKhoService} from "../../../../services/danh-muc-kho.service";
import {STATUS} from "../../../../constants/status";
import {
  DialogDanhMucKhoComponent
} from "../../../../components/dialog/dialog-danh-muc-kho/dialog-danh-muc-kho.component";
import {DANH_MUC_LEVEL} from "../../../luu-kho/luu-kho.constant";
import {DonviService} from "../../../../services/donvi.service";

@Component({
  selector: 'app-danh-muc-du-an',
  templateUrl: './danh-muc-du-an.component.html',
  styleUrls: ['./danh-muc-du-an.component.scss']
})
export class DanhMucDuAnComponent implements OnInit {
  isDetail: boolean = false;
  selectedId: number = 0;
  isViewDetail: boolean;
  tabSelected: string = 'phuong-an-tong-hop'
  danhSachNam: any[] = [];

  STATUS = STATUS;
  rowItem: DanhMucKho = new DanhMucKho();
  itemDetail : any;

  dataEdit: { [key: string]: { edit: boolean; data: DanhMucKho } } = {};

  searchFilter = {
    maDvi: null,
    soQd: '',
    khoi: '',
    tenDuAn: '',
    diaDiem: '',
    trangThai: '',
    giaiDoan: '',
    tgKhoiCong: '',
    tgHoanThanh: ''
  };

  listTrangThai = [{"ma": "00", "giaTri": "Dự thảo"}, {"ma": "29", "giaTri": "Hoàn thành"}];

  allChecked = false;
  indeterminate = false;
  dataTableAll: any[] = [];
  dsKhoi : any[] = [];
  dataTable: any[] = [];
  danhSachCuc: any[] = [];
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 0;
  userInfo: UserLogin;

  constructor(
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    private dmService: DanhMucService,
    private modal: NzModalService,
    public userService: UserService,
    public globals: Globals,
    private dviService : DonviService,
    private danhMucKhoService: DanhMucKhoService,
  ) {
  }

  async ngOnInit() {
    this.spinner.show();
    try {
      this.userInfo = this.userService.getUserLogin();
      this.loadDsNam();
      await this.search();
      await this.loadDsKhoi();
      await this.loadDanhSachCuc();
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  loadDsNam() {
    for (let i = -3; i < 23; i++) {
      this.danhSachNam.push({
        value: dayjs().get('year') - i,
        text: dayjs().get('year') - i,
      });
    }
  }

  async loadDsKhoi() {
    let res = await this.dmService.danhMucChungGetAll("KHOI_DU_AN_KT");
    if (res.msg == MESSAGE.SUCCESS) {
      this.dsKhoi = res.data
    }
  }

  async loadDanhSachCuc() {
    const body = {
      maDviCha: this.userInfo.MA_DVI,
      trangThai: '01',
    };

    const dsTong = await this.dviService.layDonViTheoCapDo(body);
    this.danhSachCuc = dsTong[DANH_MUC_LEVEL.CUC];
    this.danhSachCuc = this.danhSachCuc.filter(item => item.type != "PB")
    if (this.userService.isCuc()) {
      this.searchFilter.maDvi = this.userInfo.MA_DVI
    }
  }


  async search() {
    this.spinner.show();
    let body = {
      "role" : this.userService.isTongCuc() ? 'TC' : 'CUC',
      "denNam": this.searchFilter.giaiDoan ? dayjs(this.searchFilter.giaiDoan[1] ).get('year'): null,
      "diaDiem": this.searchFilter.diaDiem,
      "khoi": this.searchFilter.khoi,
      "paggingReq": {
        "limit": 10,
        "page": this.page - 1
      },
      "soQd": this.searchFilter.soQd,
      "tenDuAn": this.searchFilter.tenDuAn,
      "tgHoanThanhTu": this.searchFilter.tgHoanThanh ? dayjs(this.searchFilter.tgHoanThanh[0]).get('year') : null,
      "tgHoanThanhDen": this.searchFilter.tgHoanThanh ? dayjs(this.searchFilter.tgHoanThanh[1]).get('year') : null,
      "tgKhoiCongTu": this.searchFilter.tgKhoiCong ? dayjs(this.searchFilter.tgKhoiCong[0]).get('year') : null,
      "tgKhoiCongDen": this.searchFilter.tgHoanThanh ? dayjs(this.searchFilter.tgHoanThanh[1]).get('year') : null,
      "trangThai": this.searchFilter.trangThai,
      "tuNam": this.searchFilter.giaiDoan ? dayjs(this.searchFilter.giaiDoan[0]).get('year') : null,
      "maDvi" : this.userService.isTongCuc() ? this.searchFilter.maDvi : this.userInfo.MA_DVI
    };
    let res = await this.danhMucKhoService.search(body);
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
      this.spinner.hide();
    }
    this.spinner.hide();
  }

  async changePageIndex(event) {
    this.spinner.show();
    try {
      this.page = event;
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async changePageSize(event) {
    this.spinner.show();
    try {
      this.pageSize = event;
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  clearFilter() {
    this.searchFilter = {
      soQd: '',
      maDvi : null,
      khoi: '',
      tenDuAn: '',
      diaDiem: '',
      trangThai: '',
      giaiDoan: '',
      tgKhoiCong: '',
      tgHoanThanh: '',
    };
    this.search();
  }

  xoaItem(id) {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn xóa?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: async () => {
        this.spinner.show();
        try {
          let body = {
            "ids": id,
          }
          const res = await this.danhMucKhoService.delete(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.DELETE_SUCCESS);
            await this.search();
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
        } catch (e) {
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        } finally {
          this.spinner.hide();
        }
      },
    });
  }

  async getDetail(id) {
      let res = await this.danhMucKhoService.getDetail(id);
      if (res.msg == MESSAGE.SUCCESS) {
        this.itemDetail = res.data;
      } else {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR )
      }
  }


  exportData() {
      this.spinner.show();
      try {
        let body = {
          "denNam": this.searchFilter.giaiDoan ? this.searchFilter.giaiDoan[1] : null,
          "diaDiem": this.searchFilter.diaDiem,
          "khoi": this.searchFilter.khoi,
          "paggingReq": {
            "limit": 10,
            "page": this.page - 1
          },
          "soQd": this.searchFilter.soQd,
          "tenDuAn": this.searchFilter.tenDuAn,
          "tgHoanThanhTu": this.searchFilter.tgHoanThanh ? dayjs(this.searchFilter.tgHoanThanh[0]).get('year') : null,
          "tgHoanThanhDen": this.searchFilter.tgHoanThanh ? dayjs(this.searchFilter.tgHoanThanh[1]).get('year') : null,
          "tgKhoiCongTu": this.searchFilter.tgKhoiCong ? dayjs(this.searchFilter.tgKhoiCong[0]).get('year') : null,
          "tgKhoiCongDen": this.searchFilter.tgHoanThanh ? dayjs(this.searchFilter.tgHoanThanh[1]).get('year') : null,
          "trangThai": this.searchFilter.trangThai,
          "tuNam": this.searchFilter.giaiDoan ? this.searchFilter.giaiDoan[0] : null,
        };
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

  startEdit(idx: number) {
    this.dataEdit[idx].edit = true;
  }

  cancelEdit(index: number) {
    this.dataEdit[index] = {
      data: {...this.dataTable[index]},
      edit: false,
    };
  }

  async openDialog(id) {
    await this.getDetail(id);
    let modalQD = this.modal.create({
      nzTitle: 'CHI TIẾT DỰ ÁN',
      nzContent: DialogDanhMucKhoComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '700px',
      nzStyle: {top: '150px'},
      nzFooter: null,
      nzComponentParams: {
        item : this.itemDetail
      },
    });
  }

  async themMoiItem() {
    this.spinner.show();
    if (!this.checkValidators(this.rowItem)) {
      this.notification.error(MESSAGE.ERROR, "Vui lòng không để trống!!")
      this.spinner.hide();
      return;
    }
    let body = {
      "diaDiem": this.rowItem.diaDiem,
      "id": null,
      "khoi": this.rowItem.khoi,
      "luyKeNstw": this.rowItem.luyKeNstw,
      "maDuAn": this.rowItem.maDuAn,
      "nstwDuKien": this.rowItem.nstwDuKien,
      "nstwDuyet": this.rowItem.nstwDuyet,
      "soQdPd": this.rowItem.soQdPd,
      "tenDuAn": this.rowItem.tenDuAn,
      "tgHoanThanhTu": this.rowItem.tgHoanThanh ? dayjs(this.searchFilter.tgHoanThanh[0]).get('year') : null,
      "tgHoanThanhDen": this.rowItem.tgHoanThanh ? dayjs(this.searchFilter.tgHoanThanh[1]).get('year') : null,
      "tgKhoiCongTu": this.rowItem.tgKhoiCong ? dayjs(this.searchFilter.tgKhoiCong[0]).get('year') : null,
      "tgKhoiCongDen": this.rowItem.tgHoanThanh ? dayjs(this.searchFilter.tgHoanThanh[1]).get('year') : null,
      "tmdtDuKien": this.rowItem.tmdtDuKien,
      "tmdtDuyet": this.rowItem.tmdtDuyet,
      "tongSoLuyKe": this.rowItem.tongSoLuyKe,
      "trangThai": STATUS.DU_THAO,
      "maDvi" : this.userInfo.MA_DVI
    }
    let res = await this.danhMucKhoService.create(body);
    if (res.msg == MESSAGE.SUCCESS) {
        this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
      this.rowItem = new DanhMucKho();
      await this.search();
      this.updateEditCache();
      }
    this.spinner.hide();
  }

  async update() {
    this.spinner.show();
    if (!this.checkValidators(this.rowItem)) {
      this.notification.error(MESSAGE.ERROR, "Vui lòng không để trống!!")
      this.spinner.hide();
      return;
    }
    let body = {
      "diaDiem": this.rowItem.diaDiem,
      "id": null,
      "khoi": this.rowItem.khoi,
      "luyKeNstw": this.rowItem.luyKeNstw,
      "maDuAn": this.rowItem.maDuAn,
      "nstwDuKien": this.rowItem.nstwDuKien,
      "nstwDuyet": this.rowItem.nstwDuyet,
      "soQdPd": this.rowItem.soQdPd,
      "tenDuAn": this.rowItem.tenDuAn,
      "tgHoanThanhTu": this.rowItem.tgHoanThanh && this.rowItem.tgHoanThanh[0] ? dayjs(this.rowItem.tgHoanThanh[0]).get('year')  :null,
      "tgHoanThanhDen": this.rowItem.tgHoanThanh && this.rowItem.tgHoanThanh[1] ? dayjs(this.rowItem.tgHoanThanh[1]).get('year')  :null,
      "tgKhoiCongTu": this.rowItem.tgKhoiCong && this.rowItem.tgKhoiCong[0] ? dayjs(this.rowItem.tgKhoiCong[0]).get('year') :null,
      "tgKhoiCongDen": this.rowItem.tgKhoiCong && this.rowItem.tgKhoiCong[1] ? dayjs(this.rowItem.tgKhoiCong[1]).get('year') :null,
      "tmdtDuKien": this.rowItem.tmdtDuKien,
      "tmdtDuyet": this.rowItem.tmdtDuyet,
      "tongSoLuyKe": this.rowItem.tongSoLuyKe,
      "trangThai": this.rowItem.trangThai,
      "maDvi" : this.userInfo.MA_DVI
    }
    let res = await this.danhMucKhoService.update(body);
    if (res.msg == MESSAGE.SUCCESS) {
        this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
      this.rowItem = new DanhMucKho();
      await this.search();
      this.updateEditCache();
    }
    this.spinner.hide();
  }

  checkValidators(rowItem : DanhMucKho) {
    let arr = [];
    let check = true;
    arr.push(
      rowItem.maDuAn, rowItem.tenDuAn, rowItem.diaDiem, rowItem.khoi, rowItem.tgKcHt && rowItem.tgKcHt[0] ? rowItem.tgKcHt[0] : null,rowItem.tgKcHt && rowItem.tgKcHt[1] ? rowItem.tgKcHt[1] : null, rowItem.tmdtDuKien, rowItem.nstwDuKien
    )
    if (arr && arr.length > 0) {
      for (let  i = 0; i < arr.length; i++) {
        if (arr[i] == '' || arr[i] == null || arr[i] == undefined) {
          check = false;
          break;
        }
      }
    }
    return check;
  }

  updateEditCache(): void {
    if (this.dataTable) {
      this.dataTable.forEach((item, index) => {
        this.dataEdit[index] = {
          edit: false,
          data: {...item},
        };
      });
    }
  }

  luuEdit(idx: number): void {
    Object.assign(this.dataTable[idx], this.dataEdit[idx].data);
    this.dataEdit[idx].edit = false;
  }

  clearData() {
    this.rowItem = new DanhMucKho();
  }
}

export class DanhMucKho {
  id: number;
  maDuAn: string;
  tenDuAn: string;
  diaDiem: string;
  khoi: string;

  giaiDoan : any
  tgKcHt : any
  tuNam: number;
  denNam: number;
  tgKhoiCong: number;
  tgHoanThanh: number;
  tmdtDuKien: number;
  nstwDuKien: number;
  soQdPd: string;
  tmdtDuyet: number;
  nstwDuyet: number;
  tongSoLuyKe: number;
  luyKeNstw: number;
  trangThai: string;
  tenTrangThai: string;

  vonDauTu : number;

  maDvi : string

  loaiDuAn : string;
}
