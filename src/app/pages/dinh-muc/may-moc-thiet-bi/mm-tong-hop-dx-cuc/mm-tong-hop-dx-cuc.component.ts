import { Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import {Base2Component} from "../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../services/storage.service";
import { saveAs } from 'file-saver';
import {MmDxChiCucService} from "../../../../services/mm-dx-chi-cuc.service";
import {
  TimKiemVanBanComponent
} from "../../../khkn-bao-quan/quan-ly-quy-chuan-ky-thuat-quoc-gia/thong-tin-quan-ly-quy-chuan-ky-thuat-quoc-gia/tim-kiem-van-ban/tim-kiem-van-ban.component";
import {MmDialogThongBaoTuChoiComponent} from "./mm-dialog-thong-bao-tu-choi/mm-dialog-thong-bao-tu-choi.component";
@Component({
  selector: 'app-mm-tong-hop-dx-cuc',
  templateUrl: './mm-tong-hop-dx-cuc.component.html',
  styleUrls: ['./mm-tong-hop-dx-cuc.component.scss']
})
export class MmTongHopDxCucComponent extends Base2Component implements OnInit {

  selectedId: number = 0;
  isViewDetail: boolean;
  isDetail: boolean = false;
  listTrangThai: any[] = [
    { ma: this.STATUS.DU_THAO, giaTri: 'Dự thảo' },
    { ma: this.STATUS.CHO_DUYET_LDV, giaTri: 'Chờ duyệt LĐ-Vụ' },
    { ma: this.STATUS.DA_DUYET_LDV, giaTri: 'Đã duyệt LĐ-Vụ' },
    { ma: this.STATUS.TU_CHOI_LDV, giaTri: 'Từ chối LĐ-Vụ' },
  ];


  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private dxChiCucService: MmDxChiCucService
  ) {
    super(httpClient, storageService, notification, spinner, modal, dxChiCucService)
    super.ngOnInit()
    this.formData = this.fb.group({
      maDvi: [''],
      capDvi: [''],
      namKeHoach: [''],
      maTh: [''],
      trichYeu: [''],
      ngayKy: [''],
      ngayKyTu: [''],
      ngayKyDen: [''],
    });
    this.filterTable = {};
  }
  async ngOnInit() {
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
    if (this.formData.value.ngayKy && this.formData.value.ngayKy.length > 0) {
      this.formData.patchValue({
        ngayKyTu : this.formData.value.ngayKy[0],
        ngayKyDen : this.formData.value.ngayKy[1]
      })
    }
    this.formData.patchValue({
      maDvi : this.userInfo.MA_DVI,
      capDvi : this.userInfo.CAP_DVI
    })
    await this.search();
  }

  async clearForm() {
    this.formData.reset();
    this.formData.patchValue({
      maDvi :this.userInfo.MA_DVI ,
      capDvi :this.userInfo.CAP_DVI
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
        this.dxChiCucService
          .export(body)
          .subscribe((blob) =>
            saveAs(blob, 'tong-hop-dx-cuc.xlsx'),
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

  openDialogThongBao(idHdr: number) {
    const modalQD = this.modal.create({
      nzTitle: '',
      nzContent: MmDialogThongBaoTuChoiComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        idHdr : idHdr
      },
    });
    modalQD.afterClose.subscribe((data) => {
      if (data) {
        this.filter();
      }
  })
  }
}
