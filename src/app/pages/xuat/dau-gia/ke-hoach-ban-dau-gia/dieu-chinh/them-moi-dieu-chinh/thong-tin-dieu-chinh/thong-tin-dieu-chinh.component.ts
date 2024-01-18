import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {cloneDeep} from 'lodash';
import dayjs from "dayjs";
import {LOAI_HANG_DTQG} from "../../../../../../../constants/config";
import {Base2Component} from "../../../../../../../components/base2/base2.component";
import {AMOUNT_ONE_DECIMAL} from "../../../../../../../Utility/utils";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../../../services/storage.service";
import {
  QuyetDinhPdKhBdgService
} from "../../../../../../../services/qlnv-hang/xuat-hang/ban-dau-gia/de-xuat-kh-bdg/quyetDinhPdKhBdg.service";
import {MESSAGE} from "../../../../../../../constants/message";
import {
  ThongTinDauGiaService
} from "../../../../../../../services/qlnv-hang/xuat-hang/ban-dau-gia/tochuc-trienkhai/thongTinDauGia.service";

@Component({
  selector: 'app-thong-tin-dieu-chinh',
  templateUrl: './thong-tin-dieu-chinh.component.html',
  styleUrls: ['./thong-tin-dieu-chinh.component.scss']
})
export class ThongTinDieuChinhComponent extends Base2Component implements OnChanges {
  @Input() title;
  @Input() idInput;
  @Input() dataInput;
  @Input() dataInputCache;
  @Input() isView;
  @Input() trangThaiDc;
  @Input() isCache;
  @Input() loaiVthhCache;
  @Output() countChanged: EventEmitter<any> = new EventEmitter();
  LOAI_HANG_DTQG = LOAI_HANG_DTQG;
  amount = {...AMOUNT_ONE_DECIMAL};
  listKho: any[] = []

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private thongTinDauGiaService: ThongTinDauGiaService,
    private quyetDinhPdKhBdgService: QuyetDinhPdKhBdgService,
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
      khoanTienDatTruoc: [],
      donViTinh: [''],
      tongSoLuong: [],
      tongTienKhoiDiemDx: [],
      tongTienDuocDuyet: [],
      tongTienDatTruocDx: [],
      tongKtienDtruocDduyet: [],
    })
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
        if (this.dataTable) {
          if (!this.idInput) {
            await this.getdonGiaDuocDuyet(dataInput);
          }
          await this.getNganLoKho(dataInput);
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
      const giaDuyet = await this.quyetDinhPdKhBdgService.getDonGiaDuocDuyet({
        nam: data.nam,
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

  async getNganLoKho(item) {
    const res = await this.thongTinDauGiaService.search({
      nam: item.nam,
      loaiVthh: item.loaiVthh,
      cloaiVthh: item.cloaiVthh,
      soQdPd: item.soQdPd,
    });
    if (res && res.msg === MESSAGE.SUCCESS) {
      res.data.content.forEach(item => {
        item.children.forEach(child => {
          this.listKho = [
            ...this.listKho,
            ...child.children.filter(s => s.toChucCaNhan != null)
          ];
        })
      })
    }
    this.dataTable.forEach(item => {
      item.children.forEach(child => {
        this.listKho.forEach(kho => {
          if (child.maDiemKho === kho.maDiemKho && child.maNhaKho === kho.maNhaKho && child.maNganKho === kho.maNganKho && child.maLoKho === kho.maLoKho) {
            child.toChucCaNhan = kho.toChucCaNhan
          }
        })
      })
    })
  }

  expandSet = new Set<number>();

  onExpandChange(id: number, checked: boolean): void {
    checked ? this.expandSet.add(id) : this.expandSet.delete(id);
  }

  async changeTable(event?, index?, index1?) {
    const updateChild = (child) => {
      child.soLuongDeXuat = event ? event : child.soLuongDeXuat;
      child.giaKhoiDiemDx = child.soLuongDeXuat * child.donGiaDeXuat;
      child.soTienDtruocDx = child.soLuongDeXuat * (child.donGiaDeXuat * this.formData.value.khoanTienDatTruoc / 100);
      child.thanhTienDuocDuyet = child.soLuongDeXuat * child.donGiaDuocDuyet;
      child.tienDatTruocDuocDuyet = child.soLuongDeXuat * (child.donGiaDuocDuyet * this.formData.value.khoanTienDatTruoc / 100);
    };
    const updateItem = (item) => {
      item.tongSlXuatBanDx = item.children.reduce((prev, child) => prev + child.soLuongDeXuat, 0);
      item.tongTienDatTruocDx = item.children.reduce((prev, child) => prev + child.soTienDtruocDx, 0);
      item.giaKhoiDiemDx = item.children.reduce((prev, child) => prev + child.giaKhoiDiemDx, 0);
      item.soTienDuocDuyet = item.children.reduce((prev, child) => prev + child.thanhTienDuocDuyet, 0);
      item.soTienDtruocDduyet = item.children.reduce((prev, child) => prev + child.tienDatTruocDuocDuyet, 0);
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
      tongSoLuong: this.dataTable.reduce((prev, cur) => prev + cur.tongSlXuatBanDx, 0),
      tongTienKhoiDiemDx: this.dataTable.reduce((prev, cur) => prev + cur.giaKhoiDiemDx, 0),
      tongTienDuocDuyet: this.dataTable.reduce((prev, cur) => prev + cur.soTienDuocDuyet, 0),
      tongTienDatTruocDx: this.dataTable.reduce((prev, cur) => prev + cur.tongTienDatTruocDx, 0),
      tongKtienDtruocDduyet: this.dataTable.reduce((prev, cur) => prev + cur.soTienDtruocDduyet, 0),
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

  isDisable() {
    return false;
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
