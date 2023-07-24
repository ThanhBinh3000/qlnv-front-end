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

  themMoiBangKeMuaLe($event, data?: null, index?: number) {
    console.log(data, 5555);
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

}

