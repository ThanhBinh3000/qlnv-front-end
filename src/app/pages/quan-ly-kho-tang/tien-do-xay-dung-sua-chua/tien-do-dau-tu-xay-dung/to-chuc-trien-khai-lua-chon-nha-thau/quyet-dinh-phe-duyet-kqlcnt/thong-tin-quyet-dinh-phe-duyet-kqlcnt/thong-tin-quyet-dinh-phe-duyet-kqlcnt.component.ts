import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormGroup, Validators} from "@angular/forms";
import {Base2Component} from "../../../../../../../components/base2/base2.component";
import {STATUS} from "../../../../../../../constants/status";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {DanhMucService} from "../../../../../../../services/danhmuc.service";
import {
  QuyetdinhpheduyetduandtxdService
} from "../../../../../../../services/quan-ly-kho-tang/tiendoxaydungsuachua/quyetdinhpheduyetduandtxd.service";
import {
  QuyetdinhpheduyetKhlcntService
} from "../../../../../../../services/quan-ly-kho-tang/tiendoxaydungsuachua/quyetdinhpheduyetKhlcnt.service";
import {MESSAGE} from "../../../../../../../constants/message";
import {
  QuyetdinhpheduyetKqLcntService
} from "../../../../../../../services/quan-ly-kho-tang/tiendoxaydungsuachua/quyetdinhpheduyetKqLcnt.service";

@Component({
  selector: 'app-thong-tin-quyet-dinh-phe-duyet-kqlcnt',
  templateUrl: './thong-tin-quyet-dinh-phe-duyet-kqlcnt.component.html',
  styleUrls: ['./thong-tin-quyet-dinh-phe-duyet-kqlcnt.component.scss']
})
export class ThongTinQuyetDinhPheDuyetKqlcntComponent extends Base2Component implements OnInit {
  formData: FormGroup;
  @Input('isViewDetail') isViewDetail: boolean;
  @Output()
  showListEvent = new EventEmitter<any>();
  @Input()
  idInput: number;
  STATUS = STATUS;
  maQd: string = '/QĐ-TCDT';
  listQdPdDaDtxd: any[] = []
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private danhMucService: DanhMucService,
    private quyetdinhpheduyetduandtxdService: QuyetdinhpheduyetduandtxdService,
    private quyetdinhpheduyetKqLcntService: QuyetdinhpheduyetKqLcntService
  ) {
    super(httpClient, storageService, notification, spinner, modal, quyetdinhpheduyetKqLcntService)
    super.ngOnInit()
    this.formData = this.fb.group({
      id: [null],
      maDvi: [this.userInfo.MA_DVI],
      soQd: [null, Validators.required],
      ngayKy: [null, Validators.required],
      soQdPdDaDtxd: [null, Validators.required],
      idQdPdDaDtxd: [null, Validators.required],
      trichYeu: [null, Validators.required],
      tenDuAn: [null, Validators.required],
      chuDauTu: [null, Validators.required],
      idDuAn: [null, Validators.required],
      tienCvDaTh: [0],
      tienCvKad: [0],
      tienCvKhlcnt: [0],
      tienCvChuaDdk: [0],
      tongTien: [0],
      trangThai: ['00'],
      tenTrangThai: ['Dự thảo'],
      fileDinhKems: [null],
      listKtXdscQuyetDinhPdKhlcntCvDaTh: null,
      listKtXdscQuyetDinhPdKhlcntCvKad: null,
      listKtXdscQuyetDinhPdKhlcntCvKh: null
    });
  }

  async ngOnInit() {
    this.spinner.show();
    try {
      await Promise.all([
        // this.loadQdPdDaĐtxd(),
      ]);
      if (this.idInput) {
        await this.detail(this.idInput)
      }
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }
  async banHanh(id) {
    let trangThai = STATUS.BAN_HANH;
    let mesg = 'Ban hành quyết định'
    this.approve(id, trangThai, mesg);
  }

  async save() {
    this.helperService.markFormGroupTouched(this.formData)
    if (this.formData.invalid) {
      return;
    }
    if (this.fileDinhKem && this.fileDinhKem.length > 0) {
      this.formData.value.fileDinhKems = this.fileDinhKem;
    }
    this.formData.value.soQd = this.formData.value.soQd + this.maQd;
    // this.formData.value.listKtXdscQuyetDinhPdKhlcntCvDaTh = this.dataCongViecDaTh;
    // this.formData.value.listKtXdscQuyetDinhPdKhlcntCvKad = this.dataCongViecKad;
    // this.formData.value.listKtXdscQuyetDinhPdKhlcntCvKh = this.dataCongViecKh;
    this.formData.value.tienCvChuaDdk = this.formData.value.tongTien - (this.formData.value.tienCvKhlcnt + this.formData.value.tienCvKad + this.formData.value.tienCvDaTh);
    let res = await this.createUpdate(this.formData.value)
    if (res) {
      this.goBack()
    }
  }

  async changeSoQdPdDaDtxd(event) {
    if (event) {
      let item = this.listQdPdDaDtxd.filter(item => item.soQd == event)[0];
      if (item) {
        this.formData.patchValue({
          idQdPdDaDtxd: item.id,
          tenDuAn: item.tenDuAn,
          chuDauTu: item.chuDauTu,
          idDuAn: item.idDuAn,
          tongTien: item.tongMucDt
        });
        let body = {
          "soQdPdDaDtxd": event,
          "paggingReq": {
            "limit": 10,
            "page": this.page - 1
          },
        };
        if (!this.idInput) {
          let res = await this.quyetdinhpheduyetKqLcntService.getLastRecordBySoQdPdDaDtxd(body);
          if (res.msg == MESSAGE.SUCCESS && res.data) {
            // this.dataCongViecDaTh = res.data.listKtXdscQuyetDinhPdKhlcntCvDaTh;
            // this.updateEditCongViecDaThCache();
          } else {
            // this.dataCongViecDaTh = [];
          }
        }
      } else
        this.formData.patchValue({
          idQdPdDaDtxd: null,
          tenDuAn: null,
          idDuAn: null,
          tongTien: 0
        });
    }
  }

}
