import {
  Component, EventEmitter, Input,
  OnInit, Output,
} from '@angular/core';
import {Base2Component} from "../../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {MESSAGE} from "../../../../../constants/message";
import {
  KtKhSuaChuaBtcService
} from "../../../../../services/qlnv-kho/quy-hoach-ke-hoach/kh-sc-lon-btc/kt-kh-sua-chua-btc.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-quyet-dinh-sc-lon-btc',
  templateUrl: './quyet-dinh-sc-lon-btc.component.html',
  styleUrls: ['./quyet-dinh-sc-lon-btc.component.scss']
})
export class QuyetDinhScLonBtcComponent extends Base2Component implements OnInit {
  isViewDetail: boolean;
  listTrangThai: any[] = [
    {ma: this.STATUS.DU_THAO, giaTri: 'Dự thảo'},
    {ma: this.STATUS.BAN_HANH, giaTri: 'Ban hành'}
  ];
  idTongHop: number = 0;
  @Input() dataTongHop: any;
  @Output() removeData=new EventEmitter<any>();
  constructor(
    private httpClient: HttpClient,
    private storageService: StorageService,
    private router: Router,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private qdScBtcService: KtKhSuaChuaBtcService
  ) {
    super(httpClient, storageService, notification, spinner, modal, qdScBtcService);
    super.ngOnInit()
    this.formData = this.fb.group({
      maDvi: [null],
      soQd: [null],
      trichYeu: [null],
      ngayKy: [null],
      ngayKyTu: [null],
      ngayKyDen: [null],
      namKeHoach: [null],
      trangThai: [null],
      type: ['00']
    });
    this.filterTable = {};
  }

  async ngOnInit() {
    if (!this.userService.isAccessPermisson('QLKT_QHKHKT_KHSUACHUALON_QDBTC')) {
      this.router.navigateByUrl('/error/401')
    }
    if(this.dataTongHop && this.dataTongHop.id >0){
      this.isDetail=this.dataTongHop.quyetDinh;
      this.idTongHop=this.dataTongHop.id;
    }
    this.removeData.emit()
    this.spinner.show();
    try {
      this.userInfo = this.userService.getUserLogin();
      await Promise.all([
        this.filter()
      ]);
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  redirectToChiTiet(id: number, isView?: boolean) {
    this.idSelected = id;
    this.isDetail = true;
    this.isViewDetail = isView ?? false;
  }

  async filter() {
    this.formData.patchValue({
      maDvi: this.userInfo.MA_DVI
    })
    await this.search();
  }

  clearForm() {
    this.formData.reset();
    this.formData.patchValue({
      maDvi: this.userInfo.MA_DVI,
      type: "00"
    })
    this.search();
  }

}

