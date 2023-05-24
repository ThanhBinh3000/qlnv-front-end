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
  @Input() itemDuAn : any;

  selectedId: number;
  isViewDetail: boolean;
  constructor(
    private httpClient: HttpClient,
    private storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private bienBanSv : BienBanNghiemThuDtxdService
  ) {
    super(httpClient, storageService, notification, spinner, modal, bienBanSv);
    super.ngOnInit()
    this.formData = this.fb.group({
      namKh : [null]
    });
  }

  ngOnInit(): void {
    this.filter()
  }

  redirectToChiTiet(isView: boolean, id: number) {
    let modalQD = this.modal.create({
      nzTitle: "",
      nzContent: ThongTinBienBanNghiemThuDtxdComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: "1800px",
      nzStyle: {top: "90px"},
      nzFooter: null,
      nzComponentParams: {}
    });
    modalQD.afterClose.subscribe(async (listData) => {
    })
  }

  filter() {
    this.formData.patchValue({
      namKh : this.itemDuAn.namKeHoach
    })
    this.search()
  }
}
