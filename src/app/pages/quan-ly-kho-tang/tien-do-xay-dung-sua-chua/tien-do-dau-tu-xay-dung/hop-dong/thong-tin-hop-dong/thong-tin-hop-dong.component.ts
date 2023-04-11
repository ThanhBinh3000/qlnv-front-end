import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Base2Component} from "../../../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {DanhMucService} from "../../../../../../services/danhmuc.service";
import {
  QuyetdinhpheduyetKhlcntService
} from "../../../../../../services/quan-ly-kho-tang/tiendoxaydungsuachua/quyetdinhpheduyetKhlcnt.service";
import {
  QuyetdinhpheduyetKqLcntService
} from "../../../../../../services/quan-ly-kho-tang/tiendoxaydungsuachua/quyetdinhpheduyetKqLcnt.service";
import {HopdongService} from "../../../../../../services/quan-ly-kho-tang/tiendoxaydungsuachua/hopdong.service";
import {Validators} from "@angular/forms";
import {MESSAGE} from "../../../../../../constants/message";

@Component({
  selector: 'app-thong-tin-hop-dong',
  templateUrl: './thong-tin-hop-dong.component.html',
  styleUrls: ['./thong-tin-hop-dong.component.scss']
})
export class ThongTinHopDongComponent extends Base2Component implements OnInit {
  @Input()
  idInput: number;
  @Output()
  showListEvent = new EventEmitter<any>();
  @Input('isViewDetail') isViewDetail: boolean;
  tongMucDt: number = 0;
  @Input()
  flagThemMoi: string;

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private danhMucService: DanhMucService,
    private quyetdinhpheduyetKhlcntService: QuyetdinhpheduyetKhlcntService,
    private quyetdinhpheduyetKqLcntService: QuyetdinhpheduyetKqLcntService,
    private hopdongService: HopdongService
  ) {
    super(httpClient, storageService, notification, spinner, modal, quyetdinhpheduyetKqLcntService)
    this.formData = this.fb.group({
      id: [],
      maDvi: [],
      soQd: [],
      ngayKy: [],
      soQdPdDaDtxd: [],
      idQdPdDaDtxd: [],
      trichYeu: [],
      tenDuAn: [],
      chuDauTu: [],
      diaChi: [],
      idDuAn: [],
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
    super.ngOnInit()
  }

  async ngOnInit() {
    this.spinner.show();
    try {
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

  save(isHoanThanh?) {

  }

  async detail(id) {
    this.spinner.show();
    try {
      let res = await this.quyetdinhpheduyetKhlcntService.getDetail(id);
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          const data = res.data;
          this.helperService.bidingDataInFormGroup(this.formData, data);
          this.formData.patchValue({
            soQd: data.soQd ? data.soQd.split('/')[0] : null,
          })
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
