import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import dayjs from 'dayjs';
import { saveAs } from 'file-saver';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { MESSAGE } from 'src/app/constants/message';
import { QuyetDinhDieuChuyenTCService } from 'src/app/services/dieu-chuyen-noi-bo/quyet-dinh-dieu-chuyen/quyet-dinh-dieu-chuyen-tc.service';
import { QLChungTuService } from 'src/app/services/quantri-nguoidung/quan-ly-thong-tin/quan-ly-chung-tu';
import { StorageService } from 'src/app/services/storage.service';
import { cloneDeep } from 'lodash';
import { ThemTiepNhanBcBoNganhComponent } from './them-chung-thu-so/them-tiep-nhan-bc-bo-nganh.component';
import customParseFormat from "dayjs/plugin/customParseFormat";
import moment from 'moment';
import {DanhMucService} from "../../../../services/danhmuc.service";
import {
  DialogThemDanhMucDungChungComponent
} from "../../../../components/dialog/dialog-them-danh-muc-dung-chung/dialog-them-danh-muc-dung-chung.component";
import {
  DialogThemTiepNhanBcBoNganhComponent
} from "../../../../components/dialog/dialog-them-tiep-nhan-bc-bo-nganh/dialog-them-tiep-nhan-bc-bo-nganh.component";
import {DanhMucDungChungService} from "../../../../services/danh-muc-dung-chung.service";
import {
  DialogDanhSachTiepNhanBcBoNganhComponent
} from "../../../../components/dialog/dialog-danh-sach-tiep-nhan-bc-bo-nganh/dialog-danh-sach-tiep-nhan-bc-bo-nganh.component";

@Component({
  selector: 'app-quan-ly-tiep-nhan-bc-bo-nganh',
  templateUrl: './quan-ly-tiep-nhan-bc-bo-nganh.component.html',
  styleUrls: ['./quan-ly-tiep-nhan-bc-bo-nganh.component.scss']
})
export class QuanLyTiepNhanBcBoNganhComponent extends Base2Component implements OnInit {

  selectedId: number = 0;
  isView = false;
  listStatus: any[] = [
    { value: '01', text: "Hoạt động" },
    { value: '02', text: "Ngừng hoạt động" },
  ];
  listTenDm: any[];
  openBcBn = false;
  ma: any;
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private qlChungTuService: QLChungTuService,
    private danhMucService: DanhMucService,
    private dmDungChungService: DanhMucDungChungService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, qlChungTuService);
    this.formData = this.fb.group({
      ma: [null],
      maCha: [null],
      giaTri: [null],
      ghiChu: [null],
      loai: [null]
    })
    this.filterTable = {
      loai: '',
      ma: '',
      giaTri: '',
      trangThai: '',
      nguoiTao: '',
      ngayTao: '',
      nguoiSua: '',
      ngaySua: '',
    };
  }

  async ngOnInit() {

    try {
      this.initData()
      await this.search();
      await this.spinner.hide();

    } catch (e) {
      console.log('error: ', e)
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }


  }

  disabledStart = (startValue: Date): boolean => {
    if (startValue && this.formData.value.endDate) {
      return startValue.getTime() > this.formData.value.endDate.getTime();
    } else {
      return false;
    }
  };

  disabledEnd = (endValue: Date): boolean => {
    if (endValue && this.formData.value.startDate) {
      return endValue.getTime() < this.formData.value.startDate.getTime();
    } else {
      return false;
    }
  };


  async initData() {
    this.userInfo = this.userService.getUserLogin();
  }

  async timKiem() {
    // if (this.formData.value.startDate) {
    //   this.formData.value.startDate = dayjs(this.formData.value.startDate).format('DD/MM/YYYY')
    // }
    // if (this.formData.value.endDate) {
    //   this.formData.value.endDate = dayjs(this.formData.value.endDate).format('DD/MM/YYYY')
    // }
    this.search()
  }

  async search() {
    this.spinner.show();
    let body = this.formData.value;
    body.loai = 'web_service';
    body.paggingReq = {
      limit: this.pageSize,
      page: this.page - 1,
    }
    let res = await this.dmDungChungService.search(body);
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

  deleteMulti(roles?) {
    if (!this.checkPermission(roles)) {
      return
    }
    let dataDelete = [];
    if (this.dataTable && this.dataTable.length > 0) {
      this.dataTable.forEach((item) => {
        if (item.checked) {
          dataDelete.push({ id: item.id });
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
            let res = await this.qlChungTuService.deleteMuti(dataDelete);
            if (res.statusCode == 0) {
              this.notification.success(MESSAGE.SUCCESS, MESSAGE.SUCCESS);
              await this.search();
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
    } else {
      this.notification.error(MESSAGE.ERROR, "Không có dữ liệu phù hợp để xóa.");
    }
  }

  exportDataTC() {
    if (this.totalRecord > 0) {
      this.spinner.show();
      try {

        let body = this.formData.value;
        this.qlChungTuService
          .export(body)
          .subscribe((blob) =>
            saveAs(blob, 'danh-sach-chung-thu-so.xlsx'),
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

  updateAllChecked(): void {
    this.indeterminate = false;
    if (this.allChecked) {
      if (this.dataTable && this.dataTable.length > 0) {
        this.dataTable.forEach((item) => {
          if (item.status) {
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

  them(data?: any, isView?: boolean) {
    let modalTuChoi = this.modal.create({
      nzTitle: "Thông tin danh mục dùng chung",
      nzContent: DialogThemTiepNhanBcBoNganhComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '1000px',
      nzFooter: null,
      nzClassName: 'themdmdungchung',
      nzComponentParams: {
        dataEdit: data,
        isView: isView,
      },
    });
    modalTuChoi.afterClose.subscribe((data) => {
      this.search();
    })
  }

  delete(item: any, roles?) {
    if (!this.checkPermission(roles)) {
      return
    }
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
          this.qlChungTuService.delete(item.id).then(async (res) => {
            if (res.statusCode == 0) this.notification.success(MESSAGE.SUCCESS, MESSAGE.DELETE_SUCCESS);
            console.log(res)
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


  quayLai() {
    this.showListEvent.emit();
    this.isDetail = false;
    this.isView = false;
    this.search();
  }

  changeGtri(event: any, column: string) {
    let arr  = this.dataTableAll.filter(option =>
      option[column].toLowerCase().includes(event.toLowerCase())
    );
    if (arr && arr.length > 0) {
      this.listTenDm = arr.map(item => item.giaTri);
    }
  }
  filterInTable(key: string, value: string) {
    this.search();

  }

  openBc(data?: any, isView?: boolean) {
    console.log(data.ma, "openBc")
    let bieuSo;
    let loaiBc;
    if(data.ma == 'BCBN_145_01'){
      bieuSo = 'PL01'
      loaiBc = 145
    }
    if(data.ma == 'BCBN_145_02'){
      bieuSo = 'PL02'
      loaiBc = 145
    }
    if(data.ma == 'BCBN_145_03'){
      bieuSo = 'PL03'
      loaiBc = 145
    }
    if(data.ma == 'BCBN_145_04'){
      bieuSo = 'PL04'
      loaiBc = 145
    }
    if(data.ma == 'BCBN_145_05'){
      bieuSo = 'PL05'
      loaiBc = 145
    }
    if(data.ma == 'BCBN_145_06'){
      bieuSo = 'PL06'
      loaiBc = 145
    }
    if(data.ma == 'BCBN_145_07'){
      bieuSo = 'PL07'
      loaiBc = 145
    }
    if(data.ma == 'BCBN_130_01'){
      bieuSo = '001.H/BCDTQG-BN'
      loaiBc = 130
    }
    if(data.ma == 'BCBN_130_02'){
      bieuSo = '002.H/BCDTQG-BN'
      loaiBc = 130
    }
    if(data.ma == 'BCBN_130_03'){
      bieuSo = '003.H/BCDTQG-BN'
      loaiBc = 130
    }
    if(data.ma == 'BCBN_130_04'){
      bieuSo = '004.H/BCDTQG-BN'
      loaiBc = 130
    }
    if(data.ma == 'BCBN_130_05'){
      bieuSo = '005.H/BCDTQG-BN'
      loaiBc = 130
    }
    if(data.ma == 'BCBN_130_06'){
      bieuSo = '006.H/BCDTQG-BN'
      loaiBc = 130
    }
    if(data.ma == 'BCBN_130_07'){
      bieuSo = '007.H/BCDTQG-BN'
      loaiBc = 130
    }
    if(data.ma == 'BCBN_130_08'){
      bieuSo = '008.H/BCDTQG-BN'
      loaiBc = 130
    }
    if(data.ma == 'BCBN_130_09'){
      bieuSo = '009.H/BCDTQG-BN'
      loaiBc = 130
    }
    if(data.ma == 'BCBN_130_10'){
      bieuSo = '010.H/BCDTQG-BN'
      loaiBc = 130
    }
    let modalTuChoi = this.modal.create({
      nzTitle: "Danh sách tiếp nhận báo cáo Bộ/Ngành",
      nzContent: DialogDanhSachTiepNhanBcBoNganhComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '1000px',
      nzFooter: null,
      nzClassName: 'themdmdungchung',
      nzComponentParams: {
        bieuSo: bieuSo,
        loaiBc: loaiBc,
        tenBc: data.giaTri,
      },
    });
    modalTuChoi.afterClose.subscribe((data) => {
      this.search();
    })
  }

}
