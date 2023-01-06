import { Component, Input, OnInit } from '@angular/core';
import dayjs from 'dayjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import { QuyetDinhGiaoNvNhapHangService } from './../../../../../services/qlnv-hang/nhap-hang/mua-truc-tiep/qdinh-giao-nvu-nh/quyetDinhGiaoNvNhapHang.service';
import { async } from '@angular/core/testing';
@Component({
  selector: 'app-bien-ban-lay-ban-giao-mau',
  templateUrl: './bien-ban-lay-ban-giao-mau.component.html',
  styleUrls: ['./bien-ban-lay-ban-giao-mau.component.scss']
})
export class BienBanLayBanGiaoMauComponent extends Base2Component implements OnInit {
  @Input()
  loaiVthh: string;
  @Input()
  typeVthh: string;
  selectedId: number = 0;
  isView: boolean = false;
  idQdGiaoNvNh: number
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private quyetDinhGiaoNvNhapHangService: QuyetDinhGiaoNvNhapHangService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, quyetDinhGiaoNvNhapHangService);
    this.formData = this.fb.group({
      soQuyetDinhNhap: [],
      soBienBan: [],
      tenDvi: [],
      ngayLayMau: [],

    });

    this.filterTable = {
      namKh: '',
      soDxuat: '',
      ngayTao: '',
      ngayPduyet: '',
      ngayKyQd: '',
      trichYeu: '',
      tenLoaiVthh: '',
      tenCloaiVthh: '',
      soDviTsan: '',
      slHdDaKy: '',
      soQdCtieu: '',
      soQdPd: '',
      tenTrangThai: '',
    };
  }

  async ngOnInit() {
    try {
      this.formData.patchValue({
        loaiVthh: this.loaiVthh
      })
      await this.search();
      await this.convertDataTable();
    }
    catch (e) {
      console.log('error: ', e)
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async showList() {
    this.isDetail = false;
    await this.search();
    await this.convertDataTable();
  }
  convertDataTable() {
    this.dataTable.forEach(item => {
      if (this.userService.isChiCuc()) {
        item.detail = item.hhQdGiaoNvNhangDtlList.filter(item => item.maDvi == this.userInfo.MA_DVI)[0]
        item.detail.children = item.detail.listBienBanLayMau

      } else {
        let data = [];
        item.hhQdGiaoNvNhangDtlList.forEach(item => {
          data = [...data, ...item.listBienBanLayMau];
        })
        item.detail = {
          children: data
        }

      };
    });
  }

  redirectToChiTiet(isView: boolean, id: number, idQdGiaoNvNh?: number) {
    this.selectedId = id;
    this.isDetail = true;
    this.isView = isView;
    this.idQdGiaoNvNh = idQdGiaoNvNh
  }
}
