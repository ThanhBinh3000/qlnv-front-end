import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Base2Component} from "../../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {ThongTinBienBanSclComponent} from "./thong-tin-bien-ban-scl/thong-tin-bien-ban-scl.component";
import {
  BienBanNghiemThuTdscServiceService
} from "../../../../../services/qlnv-kho/tiendoxaydungsuachua/suachualon/bien-ban-nghiem-thu-tdsc.service";

@Component({
  selector: 'app-bien-ban-nghiem-thu-scl',
  templateUrl: './bien-ban-nghiem-thu-scl.component.html',
  styleUrls: ['./bien-ban-nghiem-thu-scl.component.scss']
})
export class BienBanNghiemThuSclComponent extends Base2Component implements OnInit {
  @Input() itemDuAn: any;
  @Input() itemQdPdKhLcnt: any
  @Input() itemQdPdKtkt: any
  @Output() dataBbnt = new EventEmitter<object>();
  selectedId: number;
  isViewDetail: boolean;

  constructor(
    private httpClient: HttpClient,
    private storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private bienBanSv: BienBanNghiemThuTdscServiceService
  ) {
    super(httpClient, storageService, notification, spinner, modal, bienBanSv);
    super.ngOnInit()
    this.formData = this.fb.group({
      namKh: [null],
      maDvi: [null],
      idDuAn: [null],
      loai: ['00']
    });
  }

  ngOnInit(): void {
    this.filter()
  }

  redirectToChiTiet(isView: boolean, id: number) {
    let modalQD = this.modal.create({
      nzTitle: "BIÊN BẢN NGHIỆM THU",
      nzContent: ThongTinBienBanSclComponent,
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
      this.filter();
      this.dataBbnt.emit()
    })
  }

  async filter() {
    this.formData.patchValue({
      namKh: this.itemDuAn.namKh,
      maDvi: this.userService.isCuc() ? this.userInfo.MA_DVI : null,
      idDuAn: this.itemDuAn.id
    })
    await this.search()
  }
}
