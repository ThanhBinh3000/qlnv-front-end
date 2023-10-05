import {Component, Input, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {MESSAGE} from 'src/app/constants/message';
import {Base2Component} from 'src/app/components/base2/base2.component';
import {StorageService} from 'src/app/services/storage.service';
import {DonviService} from 'src/app/services/donvi.service';
import {
  ChaoGiaMuaLeUyQuyenService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/to-chu-trien-khai-btt/chao-gia-mua-le-uy-quyen.service';
import {cloneDeep} from 'lodash';

@Component({
  selector: 'app-quyet-dinh-uy-quen-ban-le',
  templateUrl: './quyet-dinh-uy-quen-ban-le.component.html',
  styleUrls: ['./quyet-dinh-uy-quen-ban-le.component.scss']
})
export class QuyetDinhUyQuenBanLeComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string;
  isView: boolean = false;
  idQdPdKh: number = 0;
  isViewQdPdKh: boolean = false;
  idDxKh: number = 0;
  isViewDxKh: boolean = false;

  listTrangThai: any[] = [
    {ma: this.STATUS.BAN_HANH, giaTri: 'Ban Hành'},
  ];
  listPtBanTt: any[] = [
    {ma: '02', giaTri: 'Ủy Quyền'},
    {ma: '03', giaTri: 'Bán lẻ'},
  ]

  constructor(
    private httpClient: HttpClient,
    private donviService: DonviService,
    private storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private chaoGiaMuaLeUyQuyenService: ChaoGiaMuaLeUyQuyenService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, chaoGiaMuaLeUyQuyenService);
    super.ngOnInit();
    this.formData = this.fb.group({
      namKh: null,
      soDxuat: null,
      ngayTaoTu: null,
      ngayTaoDen: null,
      ngayDuyetTu: null,
      ngayDuyetDen: null,
      loaiVthh: null,
      pthucBanTrucTiep: null,
    });

    this.filterTable = {
      soQdPd: '',
      soDxuat: '',
      namKh: '',
      ngayPduyet: '',
      ngayNhanCgia: '',
      trichYeu: '',
      tenLoaiVthh: '',
      tenCloaiVthh: '',
      tongSoLuong: '',
      pthucBanTrucTiep: '',
      tenTrangThai: '',
    };
  }

  async ngOnInit() {
    try {
      await this.spinner.show();
      await Promise.all([
        this.timKiem(),
        this.searchThongTin(),
      ]);
    } catch (e) {
      console.log('error: ', e);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  async timKiem() {
    this.formData.patchValue({
      loaiVthh: this.loaiVthh,
      pthucBanTrucTiep: ['02', '03'],
    })
  }

  async clearFilter() {
    this.formData.reset();
    await this.timKiem();
    await this.searchThongTin();
  }

  async searchThongTin() {
    try {
      await this.spinner.show();
      const body = {
        ...this.formData.value,
      };
      const res = await this.chaoGiaMuaLeUyQuyenService.search(body);
      if (res.msg === MESSAGE.SUCCESS) {
        const data = res.data;
        const soDxuatMap = {};
        const filteredRecords = [];
        data.content.forEach(record => {
          if (!soDxuatMap[record.soDxuat]) {
            filteredRecords.push(record);
            soDxuatMap[record.soDxuat] = true;
          } else if (record.isDieuChinh) {
            const index = filteredRecords.findIndex(existingRecord => existingRecord.soDxuat === record.soDxuat);
            if (index !== -1) {
              filteredRecords[index] = record;
            }
          }
        });
        this.dataTable = filteredRecords;
        this.totalRecord = data.totalElements;
        this.dataTable?.forEach((item) => (item.checked = false));
        this.dataTableAll = cloneDeep(this.dataTable);
      } else {
        this.dataTable = [];
        this.totalRecord = 0;
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  async showListThongTin() {
    this.isDetail = false;
    await this.searchThongTin();
    this.showListEvent.emit();
  }

  redirectDetail(id, isView: boolean) {
    this.idSelected = id;
    this.isDetail = true;
    this.isView = isView;
  }

  openModal(id: number, modalType: string) {
    switch (modalType) {
      case 'QdKh':
        this.idQdPdKh = id;
        this.isViewQdPdKh = true;
        break;
      case 'DxKh':
        this.idDxKh = id;
        this.isViewDxKh = true;
        break;
      default:
        break;
    }
  }

  closeModal(modalType: string) {
    switch (modalType) {
      case 'QdKh':
        this.idQdPdKh = null;
        this.isViewQdPdKh = false;
        break;
      case 'DxKh':
        this.idDxKh = null;
        this.isViewDxKh = false;
        break;
      default:
        break;
    }
  }

  disabledNgayTaoTu = (startValue: Date): boolean => {
    if (!startValue || !this.formData.value.ngayTaoDen) {
      return false;
    }
    return startValue.getTime() > this.formData.value.ngayTaoDen.getTime();
  };

  disabledNgayTaoDen = (endValue: Date): boolean => {
    if (!endValue || !this.formData.value.ngayTaoTu) {
      return false;
    }
    return endValue.getTime() <= this.formData.value.ngayTaoTu.getTime();
  };

  disabledNgayDuyetTu = (startValue: Date): boolean => {
    if (!startValue || !this.formData.value.ngayDuyetDen) {
      return false;
    }
    return startValue.getTime() > this.formData.value.ngayDuyetDen.getTime();
  };

  disabledNgayDuyetDen = (endValue: Date): boolean => {
    if (!endValue || !this.formData.value.ngayDuyetTu) {
      return false;
    }
    return endValue.getTime() <= this.formData.value.ngayDuyetTu.getTime();
  };
}
