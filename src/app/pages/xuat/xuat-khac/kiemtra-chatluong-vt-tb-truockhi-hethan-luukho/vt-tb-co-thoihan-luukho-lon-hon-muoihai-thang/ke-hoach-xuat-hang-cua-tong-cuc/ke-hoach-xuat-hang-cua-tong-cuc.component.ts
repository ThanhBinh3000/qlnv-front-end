import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Base2Component} from "../../../../../../components/base2/base2.component";
import {STATUS} from "../../../../../../constants/status";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {DonviService} from "../../../../../../services/donvi.service";
import {DanhMucService} from "../../../../../../services/danhmuc.service";
import {KeHoachXuatHangService} from 'src/app/services/qlnv-hang/xuat-hang/xuatkhac/xuatvt/KeHoachXuatHang.service';
import {MESSAGE} from "../../../../../../constants/message";
import {DataService} from "../../../../../../services/data.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-ke-hoach-xuat-hang-cua-tong-cuc',
  templateUrl: './ke-hoach-xuat-hang-cua-tong-cuc.component.html',
  styleUrls: ['./ke-hoach-xuat-hang-cua-tong-cuc.component.scss']
})
export class KeHoachXuatHangCuaTongCucComponent extends Base2Component implements OnInit {

  dataTongHop: any;
  isDetail: boolean = false;
  selectedId: number;
  isView: boolean = false;
  KE_HOACH: string = "00";
  STATUS = STATUS;
  private dataSubscription: Subscription;
  @Output() tabFocus = new EventEmitter<number>();

  constructor(httpClient: HttpClient,
              storageService: StorageService,
              notification: NzNotificationService,
              spinner: NgxSpinnerService,
              modal: NzModalService,
              private dataService: DataService,
              private donviService: DonviService,
              private danhMucService: DanhMucService,
              private keHoachXuatHangService: KeHoachXuatHangService) {
    super(httpClient, storageService, notification, spinner, modal, keHoachXuatHangService);
    this.formData = this.fb.group({
      namKeHoach: [],
      soToTrinh: [],
      trichYeu: [],
      capDvi: [1],
      loai: [this.KE_HOACH],
      ngayKeHoach: [],
      ngayKeHoachTu: [],
      ngayKeHoachDen: [],
      ngayDuyetKeHoach: [],
      ngayDuyetKeHoachTu: [],
      ngayDuyetKeHoachDen: [],
      ngayDuyetKeHoachBtcTu: [],
      ngayDuyetKeHoachBtcDen: [],
    })

  }

  removeData() {
    this.dataService.removeData();
  }

  async ngOnInit(): Promise<void> {
    try {
      this.emitTab(4)
      await this.spinner.show();
      await this.dataService.currentData.subscribe(data => {
        if (data && data.dataTongHop) {
          this.dataTongHop = data.dataTongHop;
          this.isDetail = true;
        }
      });
      await this.removeData();
      await this.timKiem();
    } catch (e) {
      console.log('error: ', e)
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  disabledNgayLapKhTu = (startValue: Date): boolean => {
    if (startValue && this.formData.value.ngayDeXuatDen) {
      return startValue.getTime() > this.formData.value.ngayDeXuatDen.getTime();
    } else {
      return false;
    }
  };

  disabledNgayLapKhDen = (endValue: Date): boolean => {
    if (!endValue || !this.formData.value.ngayDeXuatTu) {
      return false;
    }
    return endValue.getTime() <= this.formData.value.ngayDeXuatTu.getTime();
  };

  disabledNgayDuyetKhTu = (startValue: Date): boolean => {
    if (startValue && this.formData.value.ngayDuyetKeHoachDen) {
      return startValue.getTime() > this.formData.value.ngayDuyetKeHoachDen.getTime();
    }
    return false;
  };

  disabledNgayDuyetKhDen = (endValue: Date): boolean => {
    if (!endValue || !this.formData.value.ngayDuyetKeHoachTu) {
      return false;
    }
    return endValue.getTime() <= this.formData.value.ngayDuyetKeHoachTu.getTime();
  };

  async timKiem() {
    await this.search();
  }

  themMoi(id, isView) {
    this.isDetail = true;
    this.selectedId = id;
    this.isView = isView;
  };

  async showList() {
    await this.search();
    this.isDetail = false;
  }

  emitTab(tab) {
    this.tabFocus.emit(tab);
  }
}
