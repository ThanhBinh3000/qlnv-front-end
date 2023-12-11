import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Base2Component} from "../../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {
  TongHopDxScLonService
} from "../../../../../services/qlnv-kho/quy-hoach-ke-hoach/ke-hoach-sc-lon/tong-hop-dx-sc-lon.service";
import {
  KtKhSuaChuaBtcService
} from "../../../../../services/qlnv-kho/quy-hoach-ke-hoach/kh-sc-lon-btc/kt-kh-sua-chua-btc.service";
import {Router} from "@angular/router";
import {MESSAGE} from "../../../../../constants/message";
import { saveAs } from 'file-saver';
import {
   KhScQdGiaoNvService
} from "../../../../../services/qlnv-kho/quy-hoach-ke-hoach/ke-hoach-sc-lon/khScQdGiaoNv.service";

@Component({
  selector: 'app-quyet-dinh-giao-nv',
  templateUrl: './quyet-dinh-giao-nv.component.html',
  styleUrls: ['./quyet-dinh-giao-nv.component.scss']
})
export class QuyetDinhGiaoNvComponent extends Base2Component implements OnInit {

  selectedId: number = 0;
  isViewDetail: boolean;
  isDetail: boolean = false;
  @Output() tabFocus: EventEmitter<number> = new EventEmitter<number>();

  listTrangThai: any[] = [
    {ma: this.STATUS.DU_THAO, giaTri: 'Dự thảo'},
    {ma: this.STATUS.CHO_DUYET_LDV, giaTri: 'Chờ duyệt - LĐ Vụ'},
    {ma: this.STATUS.CHO_DUYET_LDTC, giaTri: 'Chờ duyệt - LĐ Tổng cục'},
    {ma: this.STATUS.TU_CHOI_LDV, giaTri: 'Từ chối LĐ-Vụ'},
    {ma: this.STATUS.TU_CHOI_LDTC, giaTri: 'Từ chối - LĐ Tổng cục'},
    {ma: this.STATUS.DA_DUYET_LDTC, giaTri: 'Đã duyệt - LĐ Tổng cục'},
  ];
  isViewModal: boolean;
  idQd: number;
  typeModal: string;

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private _service: KhScQdGiaoNvService,
    private router: Router,
  ) {
    super(httpClient, storageService, notification, spinner, modal, _service)
    super.ngOnInit()
    this.formData = this.fb.group({
      maDvi: [''],
      capDvi: [''],
      namKeHoach: [''],
      maTongHop: [''],
      noiDung: [''],
      ngayTu: [''],
      ngayDen: [''],
      trangThai: [''],
    });
    this.filterTable = {};
  }

  async ngOnInit() {
    if (!this.userService.isAccessPermisson('QLKT_QHKHKT_KHSUACHUALON_TH')) {
      this.router.navigateByUrl('/error/401')
    }
    this.spinner.show();
    try {
      await this.filter();
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  redirectToChiTiet(isView: boolean, id: number) {
    this.selectedId = id;
    this.isDetail = true;
    this.isViewDetail = isView;
  }

  async filter() {
    this.formData.patchValue({
      maDvi: this.userInfo.MA_DVI,
      capDvi: this.userInfo.CAP_DVI
    })
    await this.search();
  }

  async clearForm() {
    this.formData.reset();
    this.formData.patchValue({
      maDvi: this.userInfo.MA_DVI,
      capDvi: this.userInfo.CAP_DVI
    })
    await this.search();
  }


  async showList() {
    this.isDetail = false;
    await this.search();
  }

  exportData() {
    if (this.totalRecord > 0) {
      this.spinner.show();
      try {
        let body = this.formData.value;
        body.paggingReq = {
          limit: this.pageSize,
          page: this.page - 1
        }
        this._service
          .export(body)
          .subscribe((blob) =>
            saveAs(blob, 'danh-sach-quyet-dinh-gnv.xlsx'),
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

  closeModal() {
    this.idQd = null;
    this.typeModal = null;
    this.isViewModal = false;
  }

  async openModalQdDc(soQd, type: string) {
    this.typeModal = type;
    let body = {
      type: type,
      paggingReq: {
        limit: 888,
        page: 0,
      }
    }
    let res = await this._service.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data.content;
      if (data && data.length > 0) {
        let qd = data.find(item => item.soQuyetDinh == soQd);
        if (qd) {
          this.idQd = qd.id;
          this.isViewModal = true
        }
      }
    }
  };

  receivedTab(tab) {
    if (tab) {
      this.emitTab(tab);
    }
  }
  emitTab(tab) {
    this.tabFocus.emit(tab);
  }

}
