import { Component, Input, OnInit } from '@angular/core';
import dayjs from "dayjs";
import { NgxSpinnerService } from "ngx-spinner";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NzModalService } from "ng-zorro-antd/modal";
import { MESSAGE } from "../../../../../../constants/message";
import { Base2Component } from 'src/app/components/base2/base2.component';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import { cloneDeep } from 'lodash';
import {
  QuyetDinhPdKhBdgService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/de-xuat-kh-bdg/quyetDinhPdKhBdg.service';

@Component({
  selector: 'app-thong-tin-dau-gia',
  templateUrl: './thong-tin-dau-gia.component.html',
  styleUrls: ['./thong-tin-dau-gia.component.scss']
})
export class ThongTinDauGiaComponent extends Base2Component implements OnInit {

  @Input()
  loaiVthh: string;

  idQdPdKh: number = 0;
  isViewQdPdKh: boolean = false;

  idDxBdg: number = 0;
  isViewDxBdg: boolean = false;

  idKqBdg: number = 0;
  isViewKqBdg: boolean = false;

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private quyetDinhPdKhBdgService: QuyetDinhPdKhBdgService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, quyetDinhPdKhBdgService);
    this.formData = this.fb.group({
      namKh: dayjs().get('year'),
      soDxuat: null,
      soQdPd: null,
      soQdPdKhBdg: null,
      thoiGianThucHien: null,
      soQdPdKqBdg: null,
      trichYeu: null,
      loaiVthh: null,
      ngayKyQd: null,
      soTrHdr: null,
      lastest: 1
    })
    this.filterTable = {
      namKh: '',
      soQdPd: '',
      ngayKyQd: '',
      trichYeu: '',
      soTrHdr: '',
      idThHdr: '',
      tenLoaiVthh: '',
      tenCloaiVthh: '',
      soDviTsan: '',
      slHdDaKy: '',
      tenTrangThai: '',
    };
  }

  async ngOnInit() {
    try {
      await this.timKiem();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async timKiem() {
    let arr = [];
    try {
      this.formData.patchValue({
        loaiVthh: this.loaiVthh
      })
      await this.search();
      let dt = this.dataTable.flatMap(row => {
        return row.children.map(data => {
          return Object.assign(cloneDeep(row), data);
        })
      })
      console.log(arr)
      this.dataTable = cloneDeep(dt);
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  showList() {
    this.isDetail = false;
    this.timKiem();
  }

  clearForm(currentSearch?: any) {
    this.formData.reset();
    if (currentSearch) {
      this.formData.patchValue(currentSearch)
    }
    this.timKiem();
  }


  openModalQdPdKh(id: number) {
    this.idQdPdKh = id;
    this.isViewQdPdKh = true;
  }

  closeModalQdPdKh() {
    this.idQdPdKh = null;
    this.isViewQdPdKh = false;
  }

  openModalDxBdg(id: number) {
    this.idDxBdg = id;
    this.isViewDxBdg = true;
  }

  closeModalDxBdg() {
    this.idDxBdg = null;
    this.isViewDxBdg = false;
  }

  openModalKqBdg(id: number) {
    this.idKqBdg = id;
    this.isViewKqBdg = true;
  }

  closeModalKqBdg() {
    this.idKqBdg = null;
    this.isViewKqBdg = false;
  }
}
