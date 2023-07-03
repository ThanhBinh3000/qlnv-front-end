import {Component, OnInit} from '@angular/core';
import {Base2Component} from "../../../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {DonviService} from "../../../../../../services/donvi.service";
import {DanhMucService} from "../../../../../../services/danhmuc.service";
import {v4 as uuidv4} from "uuid";
import {
  DanhSachVttbTruocHethanLuuKhoService
} from "../../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuatvt/DanhSachVttbTruocHethanLuuKho.service";
import {LOAI_HH_XUAT_KHAC, PAGE_SIZE_DEFAULT} from "../../../../../../constants/config";
import {CHUC_NANG, STATUS} from "../../../../../../constants/status";
import {
  KeHoachXuatHangService
} from "../../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuatvt/KeHoachXuatHang.service";
import {MESSAGE} from "../../../../../../constants/message";

@Component({
  selector: 'app-ke-hoach-xuat-hang-cua-cuc',
  templateUrl: './ke-hoach-xuat-hang-cua-cuc.component.html',
  styleUrls: ['./ke-hoach-xuat-hang-cua-cuc.component.scss']
})
export class KeHoachXuatHangCuaCucComponent extends Base2Component implements OnInit {
  STATUS = STATUS;
  dsDonvi: any[] = [];
  dsLoaiVthh: any[] = [];
  dsCloaiVthh: any[] = [];
  dataTableView: any = [];
  tongHop = false;
  expandSetString = new Set<string>();

  constructor(httpClient: HttpClient,
              storageService: StorageService,
              notification: NzNotificationService,
              spinner: NgxSpinnerService,
              modal: NzModalService,
              private donviService: DonviService,
              private danhMucService: DanhMucService,
              private keHoachXuatHangService: KeHoachXuatHangService) {
    super(httpClient, storageService, notification, spinner, modal, keHoachXuatHangService);
    this.formData = this.fb.group({
      namKeHoach: [],
      soToTrinh: [],
      trichYeu: [],
      ngayKeHoach: [],
      ngayKeHoachTu: [],
      ngayKeHoachDen: [],
      ngayDuyetKeHoach: [],
      ngayDuyetKeHoachTu: [],
      ngayDuyetKeHoachDen: [],
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
}
