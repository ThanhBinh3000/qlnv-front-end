import {Component, Input, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {
  QuyetdinhpheduyetKhlcntService
} from "../../../../../../services/qlnv-kho/tiendoxaydungsuachua/dautuxaydung/quyetdinhpheduyetKhlcnt.service";
import {Base2Component} from "../../../../../../components/base2/base2.component";
import {
  QuyetdinhpheduyetKqLcntService
} from "../../../../../../services/qlnv-kho/tiendoxaydungsuachua/dautuxaydung/quyetdinhpheduyetKqLcnt.service";
import {MESSAGE} from "../../../../../../constants/message";

@Component({
  selector: 'app-quyet-dinh-phe-duyet-kqlcnt',
  templateUrl: './quyet-dinh-phe-duyet-kqlcnt.component.html',
  styleUrls: ['./quyet-dinh-phe-duyet-kqlcnt.component.scss']
})
export class QuyetDinhPheDuyetKqlcntComponent extends Base2Component implements OnInit {
  selectedId: number = 0;
  isViewDetail: boolean;
  isDetail: boolean = false;
  @Input()
  itemDuAn: any;
  @Input()
  itemTtdt: any;
  listTrangThai: any[] = [
    {ma: this.STATUS.DU_THAO, giaTri: 'Dự thảo'},
    {ma: this.STATUS.BAN_HANH, giaTri: 'Ban hành'},
  ];
  openPopThongTin = false;
  trangThaiTtdt = false;

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    quyetdinhpheduyetKqLcntService: QuyetdinhpheduyetKqLcntService,
    private quyetdinhpheduyetKhlcntService: QuyetdinhpheduyetKhlcntService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, quyetdinhpheduyetKqLcntService)
    super.ngOnInit()
    this.filterTable = {};
  }

  async ngOnInit() {
    this.checkTrangThaiTtdt();
    this.formData = this.fb.group({
      soQd: [''],
      tenDuAn: [''],
      chuDauTu: [''],
      namKh: [this.itemTtdt.namKh],
      soQdPdKhlcnt: [this.itemTtdt.soQd],
      idQdPdKhlcnt: [this.itemTtdt.id],
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
    this.checkTrangThaiTtdt();
    this.search();
  }

  redirectToChiTiet(id: number, isView?: boolean) {
    this.selectedId = id;
    this.isDetail = true;
    this.isViewDetail = isView ?? false;
  }

  openThongTinModal(id?, isView?: boolean) {
    if (!id && this.trangThaiTtdt) {
      this.notification.warning(MESSAGE.WARNING, "Tất cả các gói thầu của dự án đã được tạo quyết định phê duyệt kết quả lựa chọn nhà thầu, không thể tạo thêm quyết định!");
      return;
    }
    this.selectedId = id;
    this.isDetail = true;
    this.isViewDetail = isView ?? false;
    this.openPopThongTin = true;
  }

  closeThongTinModal() {
    this.openPopThongTin = false;
    this.filter();
  }

  async checkTrangThaiTtdt() {
    this.spinner.show();
    try {
      let body = {
        "trangThaiGt": "1",
        "soQd": this.itemTtdt.soQd,
        "paggingReq": {
          "limit": 5000,
          "page": this.page - 1
        },
      };
      let res = await this.quyetdinhpheduyetKhlcntService.search(body);
      if (res.msg == MESSAGE.SUCCESS) {
        if (!res.data || !res.data.content || res.data.content.length == 0) {
          this.trangThaiTtdt = true;
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
        this.spinner.hide();
      }
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, e);
      this.spinner.hide();
    } finally {
      this.spinner.hide();
    }
  }

}
