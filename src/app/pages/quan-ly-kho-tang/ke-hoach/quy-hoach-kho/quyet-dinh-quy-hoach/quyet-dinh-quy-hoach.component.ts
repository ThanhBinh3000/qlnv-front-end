import {Component, Input, OnInit,} from '@angular/core';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NgxSpinnerService} from 'ngx-spinner';
import {MESSAGE} from 'src/app/constants/message';
import {QuyHoachKhoService} from "../../../../../services/quy-hoach-kho.service";
import {Router} from "@angular/router";
import {Base2Component} from "../../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../services/storage.service";
import {DanhMucService} from "../../../../../services/danhmuc.service";
import dayjs from "dayjs";
import {cloneDeep} from 'lodash';

@Component({
  selector: 'app-quyet-dinh-quy-hoach',
  templateUrl: './quyet-dinh-quy-hoach.component.html',
  styleUrls: ['./quyet-dinh-quy-hoach.component.scss']
})
export class QuyetDinhQuyHoachComponent extends Base2Component implements OnInit {
  @Input() type: string;
  isViewDetail: boolean;
  isDetail: boolean = false;
  listVungMien: any[] = [];
  listTrangThai: any[] = [
    {ma: this.STATUS.DANG_NHAP_DU_LIEU, giaTri: "Đang nhập dữ liệu"},
    {ma: this.STATUS.BAN_HANH, giaTri: "Ban hành"}
  ];

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private quyHoachKhoService: QuyHoachKhoService,
    private router: Router,
    private danhMucService: DanhMucService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, quyHoachKhoService)
    super.ngOnInit();
    this.formData = this.fb.group({
      maDvi: [null],
      soQuyetDinh: [null],
      soQdGoc: [null],
      namKeHoach: [null],
      soCongVan: [null],
      ngayKyTu: [null],
      ngayKyDen: [null],
      namBatDau: [null],
      namKetThuc: [null],
      vungMien: [null],
      diaDiemKho: [null],
      loai: [null],
    });
    this.filterTable = {};
  }

  async ngOnInit() {
    if (!this.userService.isAccessPermisson('QLKT_QHKHKT_QHK_QDQH')) {
      this.router.navigateByUrl('/error/401')
    }
    this.spinner.show();
    try {
      this.getListVungMien();
      this.filter();
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  redirectToChiTiet(id: number, isView?: boolean) {
    this.idSelected = id;
    this.isDetail = true;
    this.isViewDetail = isView ?? false;
  }

  async getListVungMien() {
    this.listVungMien = [];
    let res = await this.danhMucService.danhMucChungGetAll('VUNG_MIEN');
    if (res.msg == MESSAGE.SUCCESS) {
      this.listVungMien = res.data;
    }
  }

  async filter() {
    this.formData.patchValue({
      loai : this.type
    })
    await this.search();
  }

  filterInTable(key: string, value: string, type?: string) {
    if (value && value != '') {
      this.dataTable = [];
      let temp = [];
      if (this.dataTableAll && this.dataTableAll.length > 0) {
        this.dataTableAll.forEach((item) => {
          item.giaiDoan = item.namBatDau + " - " + item.namKetThuc;
          if (['ngayKy'].includes(key)) {
            if (item[key] && dayjs(item[key]).format('DD/MM/YYYY').indexOf(value.toString()) != -1) {
              temp.push(item)
            }
          } else {
            if (type) {
              if ('eq' == type) {
                if (item[key] && item[key].toString().toLowerCase() == value.toString().toLowerCase()) {
                  temp.push(item)
                }
              } else {
                if (item[key] && item[key].toString().toLowerCase().indexOf(value.toString().toLowerCase()) != -1) {
                  temp.push(item)
                }
              }
            } else {
              if (item[key] && item[key].toString().toLowerCase().indexOf(value.toString().toLowerCase()) != -1) {
                temp.push(item)
              }
            }
          }
        });
      }
      this.dataTable = [...this.dataTable, ...temp];
    } else {
      this.dataTable = cloneDeep(this.dataTableAll);
    }
  }
}
