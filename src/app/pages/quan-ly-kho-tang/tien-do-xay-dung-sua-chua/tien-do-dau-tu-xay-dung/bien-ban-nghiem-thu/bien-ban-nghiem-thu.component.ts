import {Component, Input, OnInit} from '@angular/core';
import {Base2Component} from "../../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {
  ThongTinBienBanNghiemThuDtxdComponent
} from "./thong-tin-bien-ban-nghiem-thu-dtxd/thong-tin-bien-ban-nghiem-thu-dtxd.component";
import {
  BienBanNghiemThuDtxdService
} from "../../../../../services/qlnv-kho/tiendoxaydungsuachua/dautuxaydung/bien-ban-nghiem-thu-dtxd.service";
import dayjs from "dayjs";

@Component({
  selector: 'app-bien-ban-nghiem-thu',
  templateUrl: './bien-ban-nghiem-thu.component.html',
  styleUrls: ['./bien-ban-nghiem-thu.component.scss']
})
export class BienBanNghiemThuComponent extends Base2Component implements OnInit {
  @Input() itemDuAn: any;
  @Input() itemQdPdKhLcnt: any
  selectedId: number;
  isViewDetail: boolean;

  constructor(
    private httpClient: HttpClient,
    private storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private bienBanSv: BienBanNghiemThuDtxdService
  ) {
    super(httpClient, storageService, notification, spinner, modal, bienBanSv);
    super.ngOnInit()
    this.formData = this.fb.group({
      namKh: [null],
      maDvi: [null],
      idDuAn: [null],
    });
  }

  ngOnInit(): void {
    this.filter()
  }

  redirectToChiTiet(isView: boolean, id: number) {
    let modalQD = this.modal.create({
      nzTitle: "BIÊN BẢN NGHIỆM THU",
      nzContent: ThongTinBienBanNghiemThuDtxdComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '2000px',
      nzFooter: null,
      nzComponentParams: {
        itemDuAn: this.itemDuAn,
        itemQdPdKhLcnt: this.itemQdPdKhLcnt,
        isView : isView,
        id : id
      }
    });
    modalQD.afterClose.subscribe(async (listData) => {
      this.filter()
    })
  }

  async filter() {
    this.formData.patchValue({
      namKh: this.itemDuAn.namKeHoach,
      maDvi: this.userService.isCuc() ? this.userInfo.MA_DVI : null,
      idDuAn: this.itemDuAn.id
    })
    await this.search()
  }
}
