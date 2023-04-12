import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {
  QuyetdinhpheduyetKhlcntService
} from "../../../../../services/quan-ly-kho-tang/tiendoxaydungsuachua/quyetdinhpheduyetKhlcnt.service";
import {Base2Component} from "../../../../../components/base2/base2.component";
import {HopdongService} from "../../../../../services/quan-ly-kho-tang/tiendoxaydungsuachua/hopdong.service";

@Component({
  selector: 'app-hop-dong',
  templateUrl: './hop-dong.component.html',
  styleUrls: ['./hop-dong.component.scss']
})
export class HopDongComponent extends Base2Component implements OnInit {
  selectedId: number = 0;
  isViewDetail: boolean;
  isDetail: boolean = false;
  flagInfo: string = 'addnew';
  listTrangThai: any[] = [
    {ma: this.STATUS.CHUA_THUC_HIEN, giaTri: 'Chưa thực hiện'},
    {ma: this.STATUS.DANG_THUC_HIEN, giaTri: 'Đang thực hiện'},
    {ma: this.STATUS.DA_HOAN_THANH, giaTri: 'Đã hoàn thành'},
  ];

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private hopdongService: HopdongService,
    quyetdinhpheduyetKhlcntService: QuyetdinhpheduyetKhlcntService
  ) {
    super(httpClient, storageService, notification, spinner, modal, hopdongService)
    super.ngOnInit()
    this.filterTable = {};
  }

  async ngOnInit() {
    this.formData = this.fb.group({
      soHopDong: [''],
      tenHopDong: [''],
      tenDuAn: [''],
      ngayKyQdPdKqlct: [''],
    });
    this.filter();
  }

  filter() {
    if (this.formData.value.ngayKyQdPdKqlct && this.formData.value.ngayKyQdPdKqlct.length > 0) {
      this.formData.value.ngayKyTu = this.formData.value.ngayKyQdPdKqlct[0];
      this.formData.value.ngayKyDen = this.formData.value.ngayKyQdPdKqlct[1];
    }
    this.search();
  }

  redirectToChiTiet(id: number,action, isView?: boolean) {
    this.selectedId = id;
    this.isDetail = true;
    this.flagInfo = action;
    this.isViewDetail = isView ?? false;
  }
}
