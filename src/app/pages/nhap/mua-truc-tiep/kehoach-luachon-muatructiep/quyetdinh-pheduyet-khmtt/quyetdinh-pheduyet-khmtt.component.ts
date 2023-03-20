import { Component, Input, OnInit } from '@angular/core';
import * as dayjs from 'dayjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import { QuyetDinhPheDuyetKeHoachMTTService } from 'src/app/services/quyet-dinh-phe-duyet-ke-hoach-mtt.service';
import { saveAs } from 'file-saver';
@Component({
  selector: 'app-quyetdinh-pheduyet-khmtt',
  templateUrl: './quyetdinh-pheduyet-khmtt.component.html',
  styleUrls: ['./quyetdinh-pheduyet-khmtt.component.scss']
})
export class QuyetdinhPheduyetKhmttComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string;

  listTrangThai: any[] = [
    { ma: this.STATUS.DU_THAO, giaTri: 'Dự thảo' },
    { ma: this.STATUS.BAN_HANH, giaTri: 'Ban hành' },
  ];
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private quyetDinhPheDuyetKeHoachMTTService: QuyetDinhPheDuyetKeHoachMTTService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, quyetDinhPheDuyetKeHoachMTTService);
    this.formData = this.fb.group({
      namKh: dayjs().get('year'),
      soQd: null,
      trichYeu: null,
      ngayQd: null,
      lastest: 0
    })
    this.filterTable = {
      soQd: '',
      ngayQd: '',
      trichYeu: '',
      soTrHdr: '',
      idThHdr: '',
      namKh: '',
      ptMuaTrucTiep: '',
      tenTrangThai: '',
    };
  }

  async ngOnInit() {
    await this.spinner.show();
    try {
      this.formData.patchValue({
        loaiVthh: this.loaiVthh
      })
      await this.search();
      await this.spinner.hide();
    }
    catch (e) {
      console.log('error: ', e)
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  export() {
    if (this.totalRecord > 0) {
      this.spinner.show();
      try {
        this.quyetDinhPheDuyetKeHoachMTTService
          .export(this.formData.value)
          .subscribe((blob) =>
            saveAs(blob, 'Danh-sach-quyet-dinh-phe-duyet-ke-hoach-mua-truc-tiep.xlsx'),
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


}
