import {Component, OnInit} from '@angular/core';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NgxSpinnerService} from 'ngx-spinner';
import {Base2Component} from "../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {saveAs} from 'file-saver';
import {StorageService} from "../../../services/storage.service";
import {UserActivityService} from "../../../services/user-activity.service";
import {PAGE_SIZE_DEFAULT} from "../../../constants/config";
import {MESSAGE} from "../../../constants/message";


@Component({
  selector: 'app-kiem-soat-quyen-truy-cap',
  templateUrl: './kiem-soat-quyen-truy-cap.component.html',
  styleUrls: ['./kiem-soat-quyen-truy-cap.component.scss'],
})

export class KiemSoatQuyenTruyCapComponent extends Base2Component implements OnInit {

  listSystem: any[] = [{"code": "hang", "ten": "Quản lý hàng"}, {
    "code": "khoach",
    "ten": "Quản lý kế hoạch"
  }, {"code": "kho", "ten": "Quản lý kho"}, {"code": "security", "ten": "Quản lý đăng nhập"}];
  pageSize: number = 100;

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private UserActivityService: UserActivityService
  ) {
    super(httpClient, storageService, notification, spinner, modal, UserActivityService);
    super.ngOnInit()
    this.formData = this.fb.group({
      userName: [''],
      ip: [''],
      system: [''],
      ngayHd: [''],
      tuNgay: [''],
      denNgay: [''],
    });
    this.search();
    this.filterTable = {};
  }

  async ngOnInit() {
    this.filter();
  }


  filter() {
    if (this.formData.value.ngayHd && this.formData.value.ngayHd.length > 0) {
      this.formData.value.tuNgay = this.formData.value.ngayHd[0];
      this.formData.value.denNgay = this.formData.value.ngayHd[1];
    }
    this.search();
  }
  exportData() {
    if (this.totalRecord > 0) {
      this.spinner.show();
      try {
        this.UserActivityService
          .export(this.formData.value)
          .subscribe((blob) =>
            saveAs(blob, 'lich-su-truy-cap.xlsx'),
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



