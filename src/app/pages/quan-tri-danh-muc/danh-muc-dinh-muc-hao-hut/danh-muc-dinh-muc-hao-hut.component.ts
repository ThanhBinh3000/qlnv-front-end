import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {MESSAGE} from 'src/app/constants/message';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NgxSpinnerService} from 'ngx-spinner';
import {DanhMucService} from "../../../services/danhmuc.service";
import {PAGE_SIZE_DEFAULT} from "../../../constants/config";
import {UserLogin} from "../../../models/userlogin";
import {cloneDeep} from 'lodash';
import {UserService} from "../../../services/user.service";
import {DanhMucDinhMucHaoHutService} from "../../../services/danh-muc-dinh-muc-hao-hut.service";
import {Globals} from "../../../shared/globals";
import {AMOUNT} from "../../../Utility/utils";
import {DonviService} from "../../../services/donvi.service";


@Component({
  selector: 'app-danh-muc-dinh-muc-hao-hut',
  templateUrl: './danh-muc-dinh-muc-hao-hut.component.html',
  styleUrls: ['./danh-muc-dinh-muc-hao-hut.component.scss']
})
export class DanhMucDinhMucHaoHutComponent implements OnInit {
  dataTable: any[] = [];
  allChecked = false;
  indeterminate = false;
  listLoaiVthh: any[] = [];
  listCloaiVthh: any[] = [];
  listHinhThucBq: any[] = [];
  listLoaiHinhBq: any[] = [];
  listPhuongThucBq: any[] = [];
  dataTableAll: any[] = [];
  dsCuc: any[] = [];
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 0;
  userInfo: UserLogin;
  searchFilter = {
    tenDinhMuc: '',
    loaiVthh: '',
    cloaiVthh: '',
    hinhThucBq: '',
    loaiHinhBq: '',
    phuongThucBq: ''
  };
  rowItem: DmDinhMucHaoHut = new DmDinhMucHaoHut();
  dataEdit: { [key: string]: { edit: boolean; data: DmDinhMucHaoHut } } = {};
  amount = AMOUNT;
  constructor(
    private router: Router,
    public userService: UserService,
    private danhMucService: DanhMucService,
    private dviService: DonviService,
    private dmDinhMucHaoHut: DanhMucDinhMucHaoHutService,
    private notification: NzNotificationService,
    private modal: NzModalService,
    private spinner: NgxSpinnerService,
    public globals : Globals
  ) {
  }

  async ngOnInit() {
    if (!this.userService.isAccessPermisson('QTDM_DM_DINHMUC_HAOHUT')) {
      this.router.navigateByUrl('/error/401')
    }
    this.spinner.show();
    try {
      this.userInfo = this.userService.getUserLogin();
      this.getListHtbq();
      this.getListLhbq();
      this.getListPtbq();
      this.loadDsVthh();
      this.loadDsCuc();
       this.search();
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async loadDsCuc() {
    const dsTong = await this.dviService.layTatCaDonViByLevel(2);
    this.dsCuc = dsTong.data
    this.dsCuc = this.dsCuc.filter(item => item.type != "PB")
  }

  async getListHtbq() {
    this.listHinhThucBq = [];
    let res = await this.danhMucService.danhMucChungGetAll('HINH_THUC_BAO_QUAN');
    if (res.msg == MESSAGE.SUCCESS) {
      this.listHinhThucBq = res.data;
    }
  }

  async getListLhbq() {
    this.listLoaiHinhBq = [];
    let res = await this.danhMucService.danhMucChungGetAll('LOAI_HINH_BAO_QUAN');
    if (res.msg == MESSAGE.SUCCESS) {
      this.listLoaiHinhBq = res.data;
    }
  }

  async getListPtbq() {
    this.listPhuongThucBq = [];
    let res = await this.danhMucService.danhMucChungGetAll('PT_BAO_QUAN');
    if (res.msg == MESSAGE.SUCCESS) {
      this.listPhuongThucBq = res.data;
    }
  }

  async loadDsVthh() {
    this.listLoaiVthh = [];
    let res = await this.danhMucService.getDanhMucHangDvqlAsyn({});
    if (res.msg == MESSAGE.SUCCESS) {
      this.listLoaiVthh = res.data;
      this.listLoaiVthh = res.data?.filter((x) => x.ma.length == 4);
    }
  }

  async selectLoaiHangHoa(event: any) {
    if (event) {
      let res = await this.danhMucService.loadDanhMucHangHoaTheoMaCha({ str: event });
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          this.listCloaiVthh = res.data;
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }
  }



  async search() {
    this.spinner.show();
    let body = {
      "paggingReq": {
        "limit": 10,
        "page": this.page - 1
      },
      "tenDinhMuc": this.searchFilter.tenDinhMuc,
      "loaiVthh": this.searchFilter.loaiVthh,
      "cloaiVthh": this.searchFilter.cloaiVthh,
      "hinhThucBq": this.searchFilter.hinhThucBq,
      "phuongThucBq": this.searchFilter.phuongThucBq
    }
    let res = await this.dmDinhMucHaoHut.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.dataTable = data.content;
      this.totalRecord = data.totalElements;
      if (this.dataTable && this.dataTable.length > 0) {
        this.dataTable.forEach((item) => {
          item.checked = false;
          item.listPtbq = item.phuongThucBq.split(",");
          item.listHtbq = item.hinhThucBq.split(",");
          item.listLhbq = item.loaiHinhBq.split(",");
          item.listCloaiVthh = item.cloaiVthh.split(",");
          item.listCuc = item.apDungTai.split(",");
        });
      }
      this.dataTableAll = cloneDeep(this.dataTable);
    } else {
      this.dataTable = [];
      this.totalRecord = 0;
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    this.updateEditCache()
    this.spinner.hide();
  }

  async themMoiItem(data: DmDinhMucHaoHut, id?: number) {
    this.spinner.show();
    data.hinhThucBq =data.listHtbq.toString();
    data.phuongThucBq = data.listPtbq.toString();
    data.loaiHinhBq = data.listLhbq.toString();
    if (data.listCuc && data.listCuc.length > 0) {
      data.apDungTai = data.listCuc.toString();
    } else {
      data.apDungTai= this.dsCuc.map(item => item.maDvi).toString();
    }
    if (data.listCloaiVthh && data.listCloaiVthh.length > 0) {
      data.cloaiVthh = data.listCloaiVthh.toString();
    } else {
      data.cloaiVthh = this.listCloaiVthh.map(item => item.ma).toString();
    }
    if (!this.checkValidators(data)) {
      this.notification.error(MESSAGE.ERROR, "Vui lòng không để trống!!")
      this.spinner.hide();
      return;
    }
    let body = {
      "id": id && id > 0 ? id : null,
      "maDinhMuc": data.maDinhMuc,
      "tenDinhMuc": data.tenDinhMuc,
      "loaiVthh": data.loaiVthh,
      "cloaiVthh": data.cloaiVthh,
      "hinhThucBq": data.hinhThucBq,
      "loaiHinhBq": data.loaiHinhBq,
      "phuongThucBq": data.phuongThucBq,
      "tgBaoQuanTu": data.tgBaoQuanTu,
      "tgBaoQuanDen": data.tgBaoQuanDen,
      "dinhMuc": data.dinhMuc,
      "apDungTai": data.apDungTai,
      "maDvi": this.userInfo.MA_DVI
    }
    let res;
    if (id && id > 0) {
      res = await this.dmDinhMucHaoHut.update(body);
    } else {
      res = await this.dmDinhMucHaoHut.create(body);
    }
    if (res.msg == MESSAGE.SUCCESS) {
      if (id && id > 0) {
        this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
      } else {
        this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
      }
      this.rowItem = new DmDinhMucHaoHut();
      await this.search();
      this.updateEditCache();
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    this.spinner.hide();
  }

  checkValidators(rowItem: DmDinhMucHaoHut) {
    let arr = [];
    let check = true;
    arr.push(
      rowItem.maDinhMuc, rowItem.tenDinhMuc, rowItem.loaiVthh, rowItem.hinhThucBq, rowItem.loaiHinhBq,
      rowItem.phuongThucBq, rowItem.dinhMuc
    )
    if (arr && arr.length > 0) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i] == '' || arr[i] == null || arr[i] == undefined) {
          check = false;
          break;
        }
      }
    }
    return check;
  }


  refresh() {
    this.rowItem = new DmDinhMucHaoHut();
  }

  clearFilter() {
    this.searchFilter = {
      tenDinhMuc: '',
      loaiVthh: '',
      cloaiVthh: '',
      hinhThucBq: '',
      loaiHinhBq: '',
      phuongThucBq: ''
    };
    this.search();
  }

  huyEdit(idx: number): void {
    this.dataEdit[idx] = {
      data: {...this.dataTable[idx]},
      edit: false,
    };
  }

  xoaItem(item: any) {
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
            ids: item.id
          }
          this.dmDinhMucHaoHut.delete(body).then(async (res) => {
            if (res.msg == MESSAGE.SUCCESS) {
              this.notification.success(MESSAGE.SUCCESS, MESSAGE.DELETE_SUCCESS,);
              await this.search();
            } else {
              this.notification.error(MESSAGE.ERROR, res.msg);
            }
            await this.search();
            this.spinner.hide();
          });
        } catch (e) {
          console.log('error: ', e)
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      },
    });
  }


  updateAllChecked(): void {
    this.indeterminate = false;
    if (this.allChecked) {
      if (this.dataTable && this.dataTable.length > 0) {
        this.dataTable.forEach((item) => {
          item.checked = true;
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

  updateEditCache(): void {
    if (this.dataTable) {
      this.dataTable.forEach((item, index) => {
        this.dataEdit[index] = {
          edit: false,
          data: {...item},
        }
      });
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

  async changePageIndex(event) {
    this.spinner.show();
    try {
      this.page = event;
      await this.search();
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e)
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async changePageSize(event) {
    this.spinner.show();
    try {
      this.pageSize = event;
      await this.search();
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e)
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  startEdit(i: number) {
    this.dataEdit[i].edit = true;
  }

  onOptionClick(event: Event): void {
    event.preventDefault();
  }
}

export class DmDinhMucHaoHut {
  id: number;
  maDinhMuc: string;
  tenDinhMuc: string;
  loaiVthh: string;
  cloaiVthh: string;
  listCloaiVthh: string;
  hinhThucBq: string;
  loaiHinhBq: string;
  phuongThucBq: string;
  tgBaoQuanTu: number = 0;
  tgBaoQuanDen: number = 0;
  dinhMuc: number;
  apDungTai: string;
  tenLoaiVthh: string;
  tenCloaiVthh: string;
  tenHinhThucBq: string;
  tenPhuongThucBq: string;
  listPtbq : any[];
  listHtbq : any[];
  listCuc : any[];
  listLhbq : any[];
}
