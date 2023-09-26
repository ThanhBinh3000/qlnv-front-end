import {Component, OnInit, Input} from '@angular/core';
import {NgxSpinnerService} from 'ngx-spinner';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NzModalService} from 'ng-zorro-antd/modal';
import {MESSAGE} from 'src/app/constants/message';
import {Base2Component} from 'src/app/components/base2/base2.component';
import {HttpClient} from '@angular/common/http';
import {StorageService} from 'src/app/services/storage.service';
import {
  XhPhieuKnghiemCluongService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/kiem-tra-chat-luong/xhPhieuKnghiemCluong.service';
import * as uuid from "uuid";
import {CHUC_NANG} from "../../../../../constants/status";
import _ from 'lodash';
import {DauGiaComponent} from "../../dau-gia.component";

@Component({
  selector: 'app-quan-ly-phieu-kiem-nghiem-chat-luong',
  templateUrl: './quan-ly-phieu-kiem-nghiem-chat-luong.component.html',
  styleUrls: ['./quan-ly-phieu-kiem-nghiem-chat-luong.component.scss'],
})
export class QuanLyPhieuKiemNghiemChatLuongComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string;
  CHUC_NANG = CHUC_NANG;
  public vldTrangThai: DauGiaComponent;
  isView: boolean = false;
  tableDataView: any = [];
  expandSetString = new Set<string>();
  idQdNv: number = 0;
  isViewQdNv: boolean = false;
  idLayMau: number = 0;
  isViewLayMau: boolean = false;
  idTinhKho: number = 0;
  isViewTinhKho: boolean = false;

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private dauGiaComponent: DauGiaComponent,
    private xhPhieuKnghiemCluongService: XhPhieuKnghiemCluongService
  ) {
    super(httpClient, storageService, notification, spinner, modal, xhPhieuKnghiemCluongService);
    this.vldTrangThai = this.dauGiaComponent;
    this.formData = this.fb.group({
      nam: null,
      soQdNv: null,
      soPhieuKiemNghiem: null,
      ngayKiemNghiemMauTu: null,
      ngayKiemNghiemMauDen: null,
      soBbLayMau: null,
      soBbTinhKho: null,
      loaiVthh: null,
    })

    this.filterTable = {
      soQdNv: '',
      nam: '',
      ngayKyQdNv: '',
      tenDiemKho: '',
      tenLoKho: '',
      tenNganKho: '',
      soPhieuKiemNghiem: '',
      ngayKiemNghiemMau: '',
      soBbLayMau: '',
      ngayLayMau: '',
      soBbTinhKho: '',
      ngayLapTinhKho: '',
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
      case 'layMau' :
        this.idLayMau = id;
        this.isViewLayMau = true;
        break;
      case 'tinhKho' :
        this.idTinhKho = id;
        this.isViewTinhKho = true;
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
      case 'layMau' :
        this.idLayMau = null;
        this.isViewLayMau = false;
        break;
      case 'tinhKho' :
        this.idTinhKho = null;
        this.isViewTinhKho = false;
        break;
      default:
        break;
    }
  }

  disabledStartngayKnghiem = (startValue: Date): boolean => {
    if (!startValue || !this.formData.value.ngayKiemNghiemMauTu) {
      return false;
    }
    return startValue.getTime() > this.formData.value.ngayKiemNghiemMauDen.getTime();
  };

  disabledEndngayKnghiem = (endValue: Date): boolean => {
    if (!endValue || !this.formData.value.ngayKiemNghiemMauTu) {
      return false;
    }
    return endValue.getTime() <= this.formData.value.ngayKiemNghiemMauDen.getTime();
  };
}
