import {Component, Input, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {ActivatedRoute, Router} from "@angular/router";
import {TheoDoiBqDtlService} from "../../../../../services/luu-kho/theoDoiBqDtl.service";
import {Base3Component} from "../../../../../components/base3/base3.component";
import {LOAI_HANG_DTQG} from "../../../../../constants/config";

@Component({
  selector: 'app-table-cscl',
  templateUrl: './table-cscl.component.html',
  styleUrls: ['./table-cscl.component.scss']
})
export class TableCsclComponent extends Base3Component implements OnInit {

  @Input()
  loaiVthh : string;
  @Input()
  idChiTiet : number;
  @Input()
  dataTk : any;
  @Input()
  dataKtv : any;
  @Input()
  dataLdcc : any;

  LOAI_HANG_DTQG = LOAI_HANG_DTQG;


  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    route: ActivatedRoute,
    router: Router,
    private theoDoiBqDtlService: TheoDoiBqDtlService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, route, router, theoDoiBqDtlService);
  }

  ngOnInit(): void {

  }

  disabled(){
    return true
  }

}

