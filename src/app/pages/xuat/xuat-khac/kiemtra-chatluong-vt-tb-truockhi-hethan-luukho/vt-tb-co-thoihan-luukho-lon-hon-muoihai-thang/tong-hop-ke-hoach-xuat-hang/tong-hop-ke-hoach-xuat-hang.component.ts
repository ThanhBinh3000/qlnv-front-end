import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Base2Component} from "../../../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../../services/storage.service";
import {chain, cloneDeep, isEmpty} from "lodash";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {DonviService} from "../../../../../../services/donvi.service";
import {DanhMucService} from "../../../../../../services/danhmuc.service";
import {
  KeHoachXuatHangService
} from "../../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuatvt/KeHoachXuatHang.service";
import {STATUS} from "../../../../../../constants/status";
import {MESSAGE} from "../../../../../../constants/message";
import {
  TongHopKeHoachXuatHangService
} from "../../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuatvt/TongHopKeHoachXuatHang.service";
import {DataService} from "../../../../../../services/data.service";

@Component({
  selector: 'app-tong-hop-ke-hoach-xuat-hang',
  templateUrl: './tong-hop-ke-hoach-xuat-hang.component.html',
  styleUrls: ['./tong-hop-ke-hoach-xuat-hang.component.scss']
})
export class TongHopKeHoachXuatHangComponent extends Base2Component implements OnInit {
  STATUS = STATUS;
  isDetail: boolean = false;
  selectedId: number;
  isView: boolean = false;
  TONG_HOP: string = "01";
  isTaoQdTongCuc: boolean = false;
  dataTongHop: any = {};
  @Output() tabFocus = new EventEmitter<object>();
  @Input() selectedTab: number;
  constructor(httpClient: HttpClient,
              storageService: StorageService,
              notification: NzNotificationService,
              spinner: NgxSpinnerService,
              modal: NzModalService,
              private dataService: DataService,
              private donviService: DonviService,
              private danhMucService: DanhMucService,
              private tongHopKeHoachXuatHangService: TongHopKeHoachXuatHangService) {
    super(httpClient, storageService, notification, spinner, modal, tongHopKeHoachXuatHangService);
    this.formData = this.fb.group({
      namKeHoach: [],
      loai: [this.TONG_HOP],
      thoiGianThTu: [],
      thoiGianThDen: [],
    })
  }

  async ngOnInit(): Promise<void> {
    try {
      await this.spinner.show();
      await Promise.all([]);
      await this.timKiem();
    } catch (e) {
      console.log('error: ', e)
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  disabledThoiGianThTu = (startValue: Date): boolean => {
    if (startValue && this.formData.value.thoiGianThDen) {
      return startValue.getTime() > this.formData.value.thoiGianThDen.getTime();
    }
    return false;
  };

  disabledThoiGianThDen = (endValue: Date): boolean => {
    if (!endValue || !this.formData.value.thoiGianThTu) {
      return false;
    }
    return endValue.getTime() <= this.formData.value.thoiGianThTu.getTime();
  };

  async timKiem() {
    await this.search();
  }

  redirectToChiTiet(id: number, isView?: boolean) {
    this.selectedId = id;
    this.isDetail = true;
    this.isView = isView ?? false;
  }

  emitTab(tab) {
    this.tabFocus.emit(tab);
  }

  taoKeHoachXuatHangTongCuc(data) {
    this.isTaoQdTongCuc = true;
    const dataSend = {
      tab: 4,
      dataTongHop: data,
      isTaoQdTongCuc: true
    }
    this.dataService.changeData(dataSend);
    this.emitTab(4);
  }
}
