import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import dayjs from 'dayjs';
import { PAGE_SIZE_DEFAULT, LIST_VAT_TU_HANG_HOA } from './../../../../../constants/config';
import { UserLogin } from './../../../../../models/userlogin';
import { NgxSpinnerService } from 'ngx-spinner';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzModalService } from 'ng-zorro-antd/modal';
import { UserService } from './../../../../../services/user.service';
import { DonviService } from 'src/app/services/donvi.service';
import { Globals } from './../../../../../shared/globals';
import { cloneDeep, isEmpty } from 'lodash';
import { MESSAGE } from './../../../../../constants/message';
import { saveAs } from 'file-saver';
import { DANH_MUC_LEVEL } from './../../../../luu-kho/luu-kho.constant';
import { deXuatKhBdgService } from 'src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/de-xuat-kh-bdg/deXuatKhBdg.service';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-de-xuat',
  templateUrl: './de-xuat.component.html',
  styleUrls: ['./de-xuat.component.scss']
})
export class DeXuatComponent implements OnInit {
  @Input()
  loaiVthh: string;
  @Input()
  loaiVthhCache: string;
  @Input() idInput: number;
  @Input() isView: boolean;
  @Input() isDetail: boolean = true;
  @Output()
  showListEvent = new EventEmitter<any>();
  @Input() id: number;
  formData: FormGroup;
  selectedId: any;
  loaiVthhInput: any;

  constructor(
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    private deXuatKeHoachBanDauGiaService: deXuatKhBdgService,
    private modal: NzModalService,
    public userService: UserService,
    private donviService: DonviService,
    public globals: Globals,
  ) {
  }
  listNam: any[] = [];
  yearNow: number = 0;
  searchFilter = {
    loaiVthh: null,
    soDxuat: null,
    namKh: dayjs().get('year'),
    ngayTao: null,
    ngayPduyet: null,
    trichYeu: null,
  };
  filterTable: any = {
    soDxuat: '',
    namKh: '',
    ngayTao: '',
    ngayPduyet: '',
    ngayKy: '',
    tenLoaiVthh: '',
    tenCloaiVthh: '',
    soDviTsan: '',
    slHdDaKy: '',
    trichYeu: '',
    soQdCtieu: '',
    soQdPd: '',
    tenTrangThai: '',
  };
  getCount = new EventEmitter<any>();
  dataTableAll: any[] = [];
  listVthh: any[] = [];
  dataTable: any[] = [];
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 0;
  dsDonvi: any[] = [];
  userInfo: UserLogin;
  userdetail: any = {};
  isVatTu: boolean = false;
  allChecked = false;
  indeterminate = false;




  async ngOnInit() {
    this.spinner.show();
    try {
      this.listVthh = LIST_VAT_TU_HANG_HOA;
      this.yearNow = dayjs().get('year');
      for (let i = -3; i < 23; i++) {
        this.listNam.push({
          value: this.yearNow - i,
          text: this.yearNow - i,
        });
      }
      this.searchFilter.loaiVthh = this.loaiVthhInput;
      this.initData()
      await this.search();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }
  async initData() {
    this.userInfo = this.userService.getUserLogin();
    this.userdetail.maDvi = this.userInfo.MA_DVI;
    this.userdetail.tenDvi = this.userInfo.TEN_DVI;
    await this.loadDsTong();
  }
  async loadDsTong() {
    const body = {
      maDviCha: this.userdetail.maDvi,
      trangThai: '01',
    };
    const dsTong = await this.donviService.layDonViTheoCapDo(body);
    if (!isEmpty(dsTong)) {
      this.dsDonvi = dsTong[DANH_MUC_LEVEL.CUC];
    }

  }
  updateAllChecked(): void {
    this.indeterminate = false;
    if (this.allChecked) {
      if (this.dataTable && this.dataTable.length > 0) {
        this.dataTable.forEach((item) => {
          if (item.trangThai == this.globals.prop.NHAP_DU_THAO) {
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

  async search() {
    this.spinner.show();
    let body = {
      ngayTaoTu: this.searchFilter.ngayTao ? dayjs(this.searchFilter.ngayTao[0]).format('YYYY-MM-DD') : null,
      ngayTaoDen: this.searchFilter.ngayTao ? dayjs(this.searchFilter.ngayTao[1]).format('YYYY-MM-DD') : null,
      ngayDuyetTu: this.searchFilter.ngayPduyet ? dayjs(this.searchFilter.ngayPduyet[0]).format('YYYY-MM-DD') : null,
      ngayDuyetDen: this.searchFilter.ngayPduyet ? dayjs(this.searchFilter.ngayPduyet[1]).format('YYYY-MM-DD') : null,
      soDxuat: this.searchFilter.soDxuat ?? null,
      namKh: this.searchFilter.namKh,
      trichYeu: this.searchFilter.trichYeu ?? null,
      maDvis: [this.userInfo.MA_DVI],
      paggingReq: {
        limit: this.pageSize,
        page: this.page - 1,
      },
    };
    let res = await this.deXuatKeHoachBanDauGiaService.search(body);

    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.dataTable = data.content;
      if (this.dataTable && this.dataTable.length > 0) {
        this.dataTable.forEach((item) => {
          item.checked = false;
        });
      }
      this.dataTableAll = cloneDeep(this.dataTable);
      this.totalRecord = data.totalElements;
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
      await this.search();
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
      if (this.page === 1) {
        await this.search();
      }
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  themMoi() {
    this.isDetail = true;
    this.isView = false;
    if (this.userService.isTongCuc()) {
      this.isVatTu = true;
    } else {
      this.isVatTu = false;
    }
    this.selectedId = 0;
    this.loaiVthhInput = this.loaiVthhCache;
  }

  showList() {
    this.isDetail = false;
    this.search();
  }

  detail(data?: any, isView?: boolean) {
    this.selectedId = data.id;
    this.isDetail = true;
    this.loaiVthhInput = data.loaiVthh;
    this.isView = isView;
    // if (data.loaiVthh.startsWith('02')) {
    //   this.isVatTu = true;
    // } else {
    //   this.isVatTu = false;
    // }
  }

  clearFilter() {
    this.searchFilter.namKh = dayjs().get('year');
    this.searchFilter.soDxuat = null;
    this.searchFilter.ngayTao = null;
    this.searchFilter.ngayPduyet = null;
    this.searchFilter.trichYeu = null;
    this.search();
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
            id: item.id,
            maDvi: '',
          };
          this.deXuatKeHoachBanDauGiaService.delete(body).then(async () => {
            await this.search();
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



  exportData() {
    if (this.totalRecord > 0) {
      this.spinner.show();
      try {
        let body = {
          ngayTaoTu: this.searchFilter.ngayTao ? dayjs(this.searchFilter.ngayTao[0]).format('YYYY-MM-DD') : null,
          ngayTaoDen: this.searchFilter.ngayTao ? dayjs(this.searchFilter.ngayTao[0]).format('YYYY-MM-DD') : null,
          ngayDuyetTu: this.searchFilter.ngayPduyet ? dayjs(this.searchFilter.ngayPduyet[1]).format('YYYY-MM-DD') : null,
          ngayDuyetDen: this.searchFilter.ngayPduyet ? dayjs(this.searchFilter.ngayPduyet[1]).format('YYYY-MM-DD') : null,
          soDxuat: this.searchFilter.soDxuat ?? null,
          namKh: this.searchFilter.namKh,
          trichYeu: this.searchFilter.trichYeu ?? null,
          maDvis: [this.userInfo.MA_DVI],
          pageable: null,
        };
        this.deXuatKeHoachBanDauGiaService
          .export(body)
          .subscribe((blob) =>
            saveAs(blob, 'danh-sach-de-xuat-ke-hoach-ban-dau-gia.xlsx'),
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

  xoa() {
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
        nzTitle: 'Xác nhận',
        nzContent: 'Bạn có chắc chắn muốn xóa các bản ghi đã chọn?',
        nzOkText: 'Đồng ý',
        nzCancelText: 'Không',
        nzOkDanger: true,
        nzWidth: 310,
        nzOnOk: async () => {
          this.spinner.show();
          try {
            let res = await this.deXuatKeHoachBanDauGiaService.deleteMuti({ idList: dataDelete });
            if (res.msg == MESSAGE.SUCCESS) {
              this.notification.success(MESSAGE.SUCCESS, MESSAGE.DELETE_SUCCESS);
              await this.search();
              this.getCount.emit();
              this.allChecked = false;
            } else {
              this.notification.error(MESSAGE.ERROR, res.msg);
            }
          } catch (e) {
            console.log('error: ', e);
            this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
          } finally {
            this.spinner.hide();
          }
        },
      });
    }
    else {
      this.notification.error(MESSAGE.ERROR, "Không có dữ liệu phù hợp để xóa.");
    }
  }

  filterInTable(key: string, value: string) {
    if (value && value != '') {
      this.dataTable = [];
      let temp = [];
      if (this.dataTableAll && this.dataTableAll.length > 0) {
        this.dataTableAll.forEach((item) => {
          if (
            item[key] &&
            item[key]
              .toString()
              .toLowerCase()
              .indexOf(value.toString().toLowerCase()) != -1
          ) {
            temp.push(item);
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
      soKeHoach: '',
      ngayLapKeHoach: '',
      ngayKy: '',
      trichYeu: '',
      tenHangHoa: '',
      soQuyetDinhGiaoChiTieu: '',
      soQuyetDinhPheDuyet: '',
      namKeHoach: '',
      tenVthh: '',
      tenCloaiVthh: '',
      tenTrangThai: '',
    };
  }

}
