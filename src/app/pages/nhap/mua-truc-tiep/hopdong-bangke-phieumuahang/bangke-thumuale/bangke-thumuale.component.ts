import { cloneDeep } from 'lodash';
import { Component, Input, OnInit } from '@angular/core';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import * as dayjs from 'dayjs';
import { STATUS } from "../../../../../constants/status";
import { StorageService } from 'src/app/services/storage.service';
import { HttpClient } from '@angular/common/http';
import { Base2Component } from './../../../../../components/base2/base2.component';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { NzModalService } from 'ng-zorro-antd/modal';
import { BangKeThuMuaLeService } from './../../../../../services/qlnv-hang/nhap-hang/mua-truc-tiep/BangKeThuMuaLeService.service';
import { DialogThemDiaDiemPhanLoComponent } from 'src/app/components/dialog/dialog-them-dia-diem-phan-lo/dialog-them-dia-diem-phan-lo.component';
import { DialogThemMoiBangKeThuMuaLeComponent } from './../../../../../components/dialog/dialog-them-moi-bang-ke-thu-mua-le/dialog-them-moi-bang-ke-thu-mua-le.component';
@Component({
  selector: 'app-bangke-thumuale',
  templateUrl: './bangke-thumuale.component.html',
  styleUrls: ['./bangke-thumuale.component.scss']
})
export class BangkeThumualeComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: String;
  dataEdit: any;
  tuNgayMua: Date | null = null;
  denNgayMua: Date | null = null;
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private banKeThuMuaLeService: BangKeThuMuaLeService,

  ) {
    super(httpClient, storageService, notification, spinner, modal, banKeThuMuaLeService);
    this.formData = this.fb.group({
      namQd: [],
      soBangKe: [],
      soQdGiaoNvNh: [],
      nguoiMua: [],
      ngayMua: [],
    });

    this.filterTable = {
      namQd: '',
      soBangKe: '',
      soQdGiaoNvNh: '',
      nguoiBan: '',
      diaChiNguoiBan: '',
      soCmt: '',
      tenLoaiVthh: '',
      soLuongMtt: '',
      donGia: '',
      thanhTien: '',

    };
  }

  async ngOnInit() {
    this.spinner.show();
    super.ngOnInit();
    try {
      this.formData.patchValue({
        loaiVthh: this.loaiVthh
      })
      await this.search();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  showList() {
    this.isDetail = false;
    this.search()
  }

  async search() {
    await this.spinner.show();
    try {
      let body = this.formData.value
      body.maDvi = this.userInfo.MA_DVI
      body.tuNgayMua = this.tuNgayMua != null ? dayjs(this.tuNgayMua).format('YYYY-MM-DD') + " 00:00:00" : null
      body.denNgayMua = this.denNgayMua != null ? dayjs(this.denNgayMua).format('YYYY-MM-DD') + " 23:59:59" : null
      body.paggingReq = {
        limit: this.pageSize,
        page: this.page - 1
      }
      let res = await this.service.search(body);
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
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  themMoiBangKeMuaLe($event, data?: any, index?: number) {
    if ((data == null || data?.id == null) && this.checkPrice.boolean) {
      this.notification.error(MESSAGE.ERROR, this.checkPrice.msgSuccess);
      return;
    }
    const modalGT = this.modal.create({
      nzTitle: 'THÊM BẢNG KÊ',
      nzContent: DialogThemMoiBangKeThuMuaLeComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzStyle: { top: '200px' },
      nzWidth: '1500px',
      nzFooter: null,
      nzComponentParams: {
        dataEdit: data,
        id: data ? data.id : 0
      },
    });
    modalGT.afterClose.subscribe((data) => {
      if (!data) {
        return;
      }
      this.search()
      if (index >= 0) {
        this.dataTable[index] = data;
      } else {
        this.dataTable.push(data);
      }
    });
  };

  disabledStartDate = (startValue: Date): boolean => {
    if (!startValue || !this.denNgayMua) {
      return false;
    }
    return startValue.getTime() > this.denNgayMua.getTime();
  };

  disabledEndDate = (endValue: Date): boolean => {
    if (!endValue || !this.tuNgayMua) {
      return false;
    }
    return endValue.getTime() <= this.tuNgayMua.getTime();
  };

}

