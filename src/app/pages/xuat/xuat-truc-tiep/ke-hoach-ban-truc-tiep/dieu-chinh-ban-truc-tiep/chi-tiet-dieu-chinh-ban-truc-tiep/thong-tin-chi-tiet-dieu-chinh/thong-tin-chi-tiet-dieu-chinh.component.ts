import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {NzNotificationService} from "ng-zorro-antd/notification";
import dayjs from "dayjs";
import {LOAI_HANG_DTQG} from "../../../../../../../constants/config";
import {AMOUNT_ONE_DECIMAL} from "../../../../../../../Utility/utils";
import {Base2Component} from "../../../../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../../../services/storage.service";
import {cloneDeep} from 'lodash';

@Component({
  selector: 'app-thong-tin-chi-tiet-dieu-chinh',
  templateUrl: './thong-tin-chi-tiet-dieu-chinh.component.html',
  styleUrls: ['./thong-tin-chi-tiet-dieu-chinh.component.scss']
})
export class ThongTinChiTietDieuChinhComponent extends Base2Component implements OnChanges {
  @Input() title;
  @Input() dataInput;
  @Input() isView;
  @Input() trangThaiDc;
  @Input() isCache;
  @Input() loaiVthhCache;
  @Output() countChanged: EventEmitter<any> = new EventEmitter();
  LOAI_HANG_DTQG = LOAI_HANG_DTQG;
  amount = {...AMOUNT_ONE_DECIMAL};

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, null);
    this.formData = this.fb.group({
      id: [],
      maDvi: [''],
      tenDvi: [''],
      tgianDkienTu: [''],
      tgianDkienDen: [''],
      tgianTtoan: [],
      tgianTtoanGhiChu: [''],
      pthucTtoan: [''],
      tenPthucTtoan: [''],
      tgianGnhan: [],
      tgianGnhanGhiChu: [''],
      pthucGnhan: [''],
      thongBao: [''],
      tongSoLuong: [],
      thanhTien: [],
      thanhTienDuocDuyet: [],
      donViTinh: [''],
    });
  }

  async ngOnChanges(changes: SimpleChanges) {
    if (changes.dataInput) {
      await this.spinner.show();
      const dataInput = changes.dataInput.currentValue;
      if (dataInput) {
        this.helperService.bidingDataInFormGroup(this.formData, dataInput);
        this.dataTableAll = dataInput.children;
        this.dataTable = cloneDeep(dataInput.children);
      } else {
        this.formData.reset();
      }
      await this.spinner.hide();
    }
  }


  expandSet = new Set<number>();

  onExpandChange(id: number, checked: boolean): void {
    checked ? this.expandSet.add(id) : this.expandSet.delete(id);
  }


  async changeTable(item: any, child: any) {
    if (item && child) {
      child.thanhTienDeXuat = child.soLuongDeXuat * child.donGiaDeXuat;
      child.thanhTienDuocDuyet = child.soLuongDeXuat * child.donGiaDuocDuyet;
      item.soLuongChiCuc = item.children.reduce((total, child) => total + child.soLuongDeXuat, 0);
      item.thanhTien = item.children.reduce((total, child) => total + child.thanhTienDeXuat, 0);
      item.tienDuocDuyet = item.children.reduce((total, child) => total + child.thanhTienDuocDuyet, 0);
      this.formData.patchValue({
        tongSoLuong: this.dataTable.reduce((prev, cur) => prev + cur.soLuongChiCuc, 0),
        thanhTien: this.dataTable.reduce((prev, cur) => prev + cur.thanhTien, 0),
        thanhTienDuocDuyet: this.dataTable.reduce((prev, cur) => prev + cur.tienDuocDuyet, 0),
      });
      this.dataTable = this.dataTableAll
    }
    await this.sendDataToParent();
  }

  async onChangeThoiGian(event: Date, changeType: string) {
    if (event && changeType) {
      const formattedDate = this.formatDate(event);
      if ((changeType === 'tu' && formattedDate !== this.formData.get('tgianDkienTu').value) ||
        (changeType === 'den' && formattedDate !== this.formData.get('tgianDkienDen').value)) {
        if (changeType === 'tu') {
          this.formData.patchValue({tgianDkienTu: formattedDate});
        } else if (changeType === 'den') {
          this.formData.patchValue({tgianDkienDen: formattedDate});
        }
        await this.sendDataToParent();
      }
    }
  }

  formatDate(date: Date): string | null {
    return date ? dayjs(date).format('YYYY-MM-DD') : null;

  }

  async sendDataToParent() {
    this.countChanged.emit(this.formData.value);
  }

  disabledTgianTocChucTu = (startValue: Date): boolean => {
    const tgianDkienDen = this.formData.value.tgianDkienDen as Date;
    if (!startValue || !tgianDkienDen || !(tgianDkienDen instanceof Date)) {
      return false;
    }
    return startValue.getTime() > tgianDkienDen.getTime();
  };

  disabledTgianTocChucDen = (endValue: Date): boolean => {
    const tgianDkienTu = this.formData.value.tgianDkienTu as Date;
    if (!endValue || !tgianDkienTu || !(tgianDkienTu instanceof Date)) {
      return false;
    }
    return endValue.getTime() <= tgianDkienTu.getTime();
  };
}
