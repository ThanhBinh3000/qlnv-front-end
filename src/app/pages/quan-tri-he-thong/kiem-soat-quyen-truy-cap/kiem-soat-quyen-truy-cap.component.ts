import {Component, OnInit} from '@angular/core';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NgxSpinnerService} from 'ngx-spinner';
import {Base2Component} from "../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../services/storage.service";
import {UserActivityService} from "../../../services/user-activity.service";
import {PAGE_SIZE_DEFAULT} from "../../../constants/config";


@Component({
  selector: 'app-kiem-soat-quyen-truy-cap',
  templateUrl: './kiem-soat-quyen-truy-cap.component.html',
  styleUrls: ['./kiem-soat-quyen-truy-cap.component.scss'],
})

export class KiemSoatQuyenTruyCapComponent extends Base2Component implements OnInit {

  listSystem: any[] = [{"code": "hang", "ten": "Quản lý hàng"}, {
    "code": "khoach",
    "ten": "Quản lý kế hoạch"
  }, {"code": "kho", "ten": "Quản lý kho"}];
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
    });
    this.search();
    this.filterTable = {};
  }

  async ngOnInit() {

  }

}



