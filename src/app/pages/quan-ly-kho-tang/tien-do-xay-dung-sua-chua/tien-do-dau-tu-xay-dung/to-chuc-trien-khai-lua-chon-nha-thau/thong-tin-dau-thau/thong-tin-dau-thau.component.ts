import {Component, OnInit} from '@angular/core';
import {Base2Component} from "../../../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {
  QuyetdinhpheduyetKhlcntService
} from "../../../../../../services/quan-ly-kho-tang/tiendoxaydungsuachua/quyetdinhpheduyetKhlcnt.service";

@Component({
  selector: 'app-thong-tin-dau-thau',
  templateUrl: './thong-tin-dau-thau.component.html',
  styleUrls: ['./thong-tin-dau-thau.component.scss']
})
export class ThongTinDauThauComponent extends Base2Component implements OnInit {
  selectedId: number = 0;
  isViewDetail: boolean;
  isDetail: boolean = false;
  listTrangThai: any[] = [
    {ma: this.STATUS.DANG_CAP_NHAT, giaTri: 'Đang cập nhật'},
    {ma: this.STATUS.CHUA_CAP_NHAT, giaTri: 'Chưa cập nhật'},
    {ma: this.STATUS.DA_HOAN_THANH, giaTri: 'Hoàn thành'},
  ];

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    quyetdinhpheduyetKhlcntService: QuyetdinhpheduyetKhlcntService
  ) {
    super(httpClient, storageService, notification, spinner, modal, quyetdinhpheduyetKhlcntService)
    super.ngOnInit()
    this.filterTable = {};
  }

  async ngOnInit() {
    this.formData = this.fb.group({
      soQd: [''],
      tenDuAn: [''],
      chuDauTu: [''],
      soQdPdDaDtxd: [''],
      trangThai: [''],
      ngayKy: [''],
      trichYeu: [''],
    });
    this.filter();
  }

  filter() {
    if (this.formData.value.ngayKy && this.formData.value.ngayKy.length > 0) {
      this.formData.value.ngayKyTu = this.formData.value.ngayKy[0];
      this.formData.value.ngayKyDen = this.formData.value.ngayKy[1];
    }
    this.search();
  }

  redirectToChiTiet(id: number, isView?: boolean) {
    this.selectedId = id;
    this.isDetail = true;
    this.isViewDetail = isView ?? false;
  }
}
