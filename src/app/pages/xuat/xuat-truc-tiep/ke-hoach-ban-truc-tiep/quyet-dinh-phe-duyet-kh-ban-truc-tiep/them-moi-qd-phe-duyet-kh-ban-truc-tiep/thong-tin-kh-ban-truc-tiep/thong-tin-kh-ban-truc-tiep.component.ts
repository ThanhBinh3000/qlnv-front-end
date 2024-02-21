import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {NgxSpinnerService} from 'ngx-spinner';
import {NzModalService} from "ng-zorro-antd/modal";
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {LOAI_HANG_DTQG} from "../../../../../../../constants/config";
import dayjs from "dayjs";
import {AMOUNT_ONE_DECIMAL} from "../../../../../../../Utility/utils";
import {Base2Component} from "../../../../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../../../services/storage.service";
import {cloneDeep} from 'lodash';
import {
  QuyetDinhPdKhBanTrucTiepService
} from "../../../../../../../services/qlnv-hang/xuat-hang/ban-truc-tiep/de-xuat-kh-btt/quyet-dinh-pd-kh-ban-truc-tiep.service";

@Component({
  selector: 'app-thong-tin-kh-ban-truc-tiep',
  templateUrl: './thong-tin-kh-ban-truc-tiep.component.html',
  styleUrls: ['./thong-tin-kh-ban-truc-tiep.component.scss']
})
export class ThongTinKhBanTrucTiepComponent extends Base2Component implements OnChanges {
  @Input() title;
  @Input() idInput;
  @Input() dataInput;
  @Input() dataInputCache;
  @Input() isView;
  @Input() isCache: boolean = false;
  @Input() trangThaiQd;
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
    private quyetDinhPdKhBanTrucTiepService: QuyetDinhPdKhBanTrucTiepService,
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
    const processChange = async (data: any) => {
      await this.spinner.show();
      if (data) {
        this.helperService.bidingDataInFormGroup(this.formData, data);
      } else {
        this.formData.reset();
      }
      await this.spinner.hide();
    };
    const handleDataTableAll = async (dataInputCache: any) => {
      if (dataInputCache) {
        await processChange(dataInputCache);
        this.dataTableAll = cloneDeep(dataInputCache.children);
      }
    };
    const handleDataTable = async (dataInput: any) => {
      if (dataInput) {
        await processChange(dataInput);
        this.dataTable = dataInput.children;
        if (!this.idInput) {
          await this.getdonGiaDuocDuyet(dataInput);
        }
      }
    };
    if (changes.dataInputCache) {
      await handleDataTableAll(changes.dataInputCache.currentValue);
    }
    if (changes.dataInput) {
      await handleDataTable(changes.dataInput.currentValue);
    }
  }

  async getdonGiaDuocDuyet(data) {
    const getChildGiaDuyet = async (item, child) => {
      const giaDuyet = await this.quyetDinhPdKhBanTrucTiepService.getDonGiaDuocDuyet({
        nam: data.namKh,
        loaiVthh: data.loaiVthh,
        cloaiVthh: data.cloaiVthh,
        maDvi: item.maDvi,
        typeLoaiVthh: this.loaiVthhCache,
      });
      if (giaDuyet.data) {
        child.donGiaDuocDuyet = giaDuyet.data;
      }
    };
    const giaDuyetPromises = this.dataTable.flatMap(item =>
      item.children.map(child => getChildGiaDuyet(item, child))
    );
    await Promise.all(giaDuyetPromises);
    await this.changeTable();
  }


  expandSet = new Set<number>();

  onExpandChange(id: number, checked: boolean): void {
    checked ? this.expandSet.add(id) : this.expandSet.delete(id);
  }


  async changeTable(event?, index?, index1?) {
    const updateChild = (child) => {
      child.soLuongDeXuat = event ? event : child.soLuongDeXuat;
      child.thanhTienDeXuat = child.soLuongDeXuat * child.donGiaDeXuat;
      child.thanhTienDuocDuyet = child.soLuongDeXuat * child.donGiaDuocDuyet;
    }
    const updateItem = (item) => {
      item.soLuongChiCuc = item.children.reduce((total, child) => total + child.soLuongDeXuat, 0);
      item.thanhTien = item.children.reduce((total, child) => total + child.thanhTienDeXuat, 0);
      item.tienDuocDuyet = item.children.reduce((total, child) => total + child.thanhTienDuocDuyet, 0);
    };
    if (index >= 0 && index1 >= 0) {
      const item = this.dataTable[index];
      const child = this.dataTable[index].children[index1];
      updateChild(child);
      updateItem(item);
    } else {
      this.dataTable.forEach((item) => {
        item.children.forEach(updateChild);
        updateItem(item);
      });
    }
    this.formData.patchValue({
      tongSoLuong: this.dataTable.reduce((prev, cur) => prev + cur.soLuongChiCuc, 0),
      thanhTien: this.dataTable.reduce((prev, cur) => prev + cur.thanhTien, 0),
      thanhTienDuocDuyet: this.dataTable.reduce((prev, cur) => prev + cur.tienDuocDuyet, 0),
    });
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
    const startDay = new Date(startValue.getFullYear(), startValue.getMonth(), startValue.getDate());
    const endDay = new Date(tgianDkienDen.getFullYear(), tgianDkienDen.getMonth(), tgianDkienDen.getDate());
    return startDay > endDay;
  };

  disabledTgianTocChucDen = (endValue: Date): boolean => {
    const tgianDkienTu = this.formData.value.tgianDkienTu as Date;
    if (!endValue || !tgianDkienTu || !(tgianDkienTu instanceof Date)) {
      return false;
    }
    const endDay = new Date(endValue.getFullYear(), endValue.getMonth(), endValue.getDate());
    const startDay = new Date(tgianDkienTu.getFullYear(), tgianDkienTu.getMonth(), tgianDkienTu.getDate());
    return endDay < startDay;
  };
}
