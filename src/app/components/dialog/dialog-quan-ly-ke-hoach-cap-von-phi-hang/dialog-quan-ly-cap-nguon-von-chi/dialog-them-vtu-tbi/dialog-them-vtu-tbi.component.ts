import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MESSAGE } from 'src/app/constants/message';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';

@Component({
  selector: 'dialog-them-vtu-tbi',
  templateUrl: './dialog-them-vtu-tbi.component.html',
  styleUrls: ['./dialog-them-vtu-tbi.component.scss'],
})
export class DialogThemVtuTbiComponent implements OnInit {
  @Input() objVtu:any;

  loaiGias: any = [];
  vatTus: any = [];
  chungLoais: any = [];
  dviTinhs: any = [];
  maKhos: any = [];

  constructor(
    private _modalRef: NzModalRef,
    private danhMucService: DanhMucHDVService,
    private notification: NzNotificationService,
  ) { }

  async ngOnInit() {
    this.danhMucService.dMVatTu().toPromise().then(
      (data) => {
        if (data.statusCode == 0) {
          this.vatTus = data.data?.content;
        } else {
          this.notification.error(MESSAGE.ERROR, data?.msg);
        }
      },
      (err) => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
      }
    );

    this.danhMucService.dMDviTinh().toPromise().then(
      (data) => {
        if (data.statusCode == 0) {
          this.dviTinhs = data.data?.content;
        } else {
          this.notification.error(MESSAGE.ERROR, data?.msg);
        }
      },
      (err) => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
      }
    );
  }

  handleOk() {
    this._modalRef.close(this.objVtu);
  }

  handleCancel() {
    this._modalRef.close();
  }
}
[]