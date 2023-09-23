import {Component, Input, OnInit} from '@angular/core';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NgxSpinnerService} from 'ngx-spinner';
import {Base2Component} from 'src/app/components/base2/base2.component';
import {HttpClient} from '@angular/common/http';
import {StorageService} from 'src/app/services/storage.service';
import {MESSAGE} from 'src/app/constants/message';
import * as uuid from "uuid";
import {
  BienBanLayMauXhService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/kiem-tra-chat-luong/bienBanLayMauXh.service';
import {DauGiaComponent} from "../../dau-gia.component";
import {CHUC_NANG} from "../../../../../constants/status";
import _ from 'lodash';

@Component({
  selector: 'app-table-bien-ban-lay-mau',
  templateUrl: './table-bien-ban-lay-mau.component.html',
  styleUrls: ['./table-bien-ban-lay-mau.component.scss'],
})
export class TableBienBanLayMauComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string;
  CHUC_NANG = CHUC_NANG;
  public vldTrangThai: DauGiaComponent;
  isView: boolean = false;
  tableDataView: any = [];
  expandSetString = new Set<string>();
  idQdNv: number = 0;
  isViewQdNv: boolean = false;
  idTinhKho: number = 0;
  isViewTinhKho: boolean = false;
  idHaoDoi: number = 0;
  isViewHaoDoi: boolean = false;

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private bienBanLayMauXhService: BienBanLayMauXhService,
    private dauGiaComponent: DauGiaComponent,
  ) {
    super(httpClient, storageService, notification, spinner, modal, bienBanLayMauXhService);
    this.vldTrangThai = this.dauGiaComponent;
    this.formData = this.fb.group({
      soBbLayMau: null,
      soQdNv: null,
      donViKnghiem: null,
      ngayLayMauTu: null,
      ngayLayMauDen: null,
      maDvi: null,
      loaiVthh: null,
    })

    this.filterTable = {
      soQdNv: '',
      nam: '',
      ngayKyQdNv: '',
      tenDiemKho: '',
      tenLoKho: '',
      tenNganKho: '',
      ngayLayMau: '',
      soBbTinhKho: '',
      ngayXuatDocKho: '',
      soBbHaoDoi: '',
      tenTrangThai: '',
    };
  }

  async ngOnInit() {
    try {
      await this.spinner.show();
      await this.search();
    } catch (e) {
      console.log('error: ', e);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }


  async search(): Promise<void> {
    await this.spinner.show();
    this.formData.patchValue({
      loaiVthh: this.loaiVthh,
    });
    await super.search();
    this.dataTable.forEach(s => s.idVirtual = uuid.v4());
    this.buildTableView();
    await this.spinner.hide();
  }

  buildTableView() {
    this.tableDataView = _(this.dataTable).groupBy("soQdNv").map((soQdNvGroup, soQdNvKey) => {
      const firstRowInGroup = _.find(soQdNvGroup, (row) => row.tenDiemKho === soQdNvGroup[0].tenDiemKho);
      firstRowInGroup.idVirtual = uuid.v4();
      this.expandSetString.add(firstRowInGroup.idVirtual);
      const childData = _(soQdNvGroup).groupBy("tenDiemKho").map((tenDiemKhoGroup, tenDiemKhoKey) => ({
        idVirtual: firstRowInGroup.idVirtual,
        tenDiemKho: tenDiemKhoKey,
        childData: tenDiemKhoGroup,
      })).value();
      return {
        idVirtual: firstRowInGroup.idVirtual,
        soQdNv: soQdNvKey,
        nam: firstRowInGroup.nam,
        idQdNv: firstRowInGroup.idQdNv,
        ngayKyQdNv: firstRowInGroup.ngayKyQdNv,
        childData,
      };
    }).value();
    this.expandAll();
  }

  expandAll() {
    this.dataTable.forEach(row => {
      this.expandSetString.add(row.idVirtual);
    });
  }

  onExpandStringChange(idVirtual: string, isExpanded: boolean): void {
    if (isExpanded) {
      this.expandSetString.add(idVirtual);
    } else {
      this.expandSetString.delete(idVirtual);
    }
  }

  redirectDetail(id, isView: boolean) {
    this.idSelected = id;
    this.isDetail = true;
    this.isView = isView;
  }

  openModal(id: number, modalType: string) {
    switch (modalType) {
      case 'QdNv' :
        this.idQdNv = id;
        this.isViewQdNv = true;
        break;
      case 'tinhKho' :
        this.idTinhKho = id;
        this.isViewTinhKho = true;
        break;
      case 'haoDoi' :
        this.idHaoDoi = id;
        this.isViewHaoDoi = true;
        break;
      default:
        break;
    }
  }

  closeModal(modalType: string) {
    switch (modalType) {
      case 'QdNv' :
        this.idQdNv = null;
        this.isViewQdNv = false;
        break;
      case 'tinhKho' :
        this.idTinhKho = null;
        this.isViewTinhKho = false;
        break;
      case 'haoDoi' :
        this.idHaoDoi = null;
        this.isViewHaoDoi = false;
        break;
      default:
        break;
    }
  }

  disabledNgayLayMauTu = (startValue: Date): boolean => {
    if (!startValue || !this.formData.value.ngayKyQdDen) {
      return false;
    }
    return startValue.getTime() > this.formData.value.ngayKyQdDen.getTime();
  };

  disabledNgayLayMauDen = (endValue: Date): boolean => {
    if (!endValue || !this.formData.value.ngayKyQdTu) {
      return false;
    }
    return endValue.getTime() <= this.formData.value.ngayKyQdTu.getTime();
  };
}
