import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NgxSpinnerService} from 'ngx-spinner';
import {MESSAGE} from 'src/app/constants/message';
import {Base2Component} from "../../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../services/storage.service";
import {saveAs} from 'file-saver';
import {
  TongHopDxScLonService
} from "../../../../../services/qlnv-kho/quy-hoach-ke-hoach/ke-hoach-sc-lon/tong-hop-dx-sc-lon.service";
import {Router} from "@angular/router";
import {
  KtKhSuaChuaBtcService
} from "../../../../../services/qlnv-kho/quy-hoach-ke-hoach/kh-sc-lon-btc/kt-kh-sua-chua-btc.service";
import dayjs from "dayjs";

@Component({
  selector: 'app-tong-hop-sc-lon',
  templateUrl: './quyet-dinh-sc-lon-tcdt.component.html',
  styleUrls: ['./quyet-dinh-sc-lon-tcdt.component.scss']
})
export class QuyetDinhScLonTcdtComponent extends Base2Component implements OnInit {

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
    private tongHopDxScLon: TongHopDxScLonService,
    private qdScBtcService: KtKhSuaChuaBtcService,
    private router: Router,
  ) {
    super(httpClient, storageService, notification, spinner, modal, tongHopDxScLon)
    super.ngOnInit()
    this.formData = this.fb.group({
      maDvi: [''],
      capDvi: [''],
      namKeHoach: [dayjs().get('year')],
      maTongHop: [''],
      noiDung: [''],
      ngayTongHopTu: [''],
      ngayTongHopDen: [''],
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
      capDvi: this.userInfo.CAP_DVI,
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
        this.tongHopDxScLon
          .export(body)
          .subscribe((blob) =>
            saveAs(blob, 'tong-hop-sua-chua-lon.xlsx'),
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
    let res = await this.qdScBtcService.search(body);
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
