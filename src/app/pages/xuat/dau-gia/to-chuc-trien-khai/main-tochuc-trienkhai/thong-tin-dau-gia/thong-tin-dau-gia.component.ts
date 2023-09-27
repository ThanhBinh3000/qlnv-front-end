import {Component, Input, OnInit} from '@angular/core';
import {NgxSpinnerService} from "ngx-spinner";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NzModalService} from "ng-zorro-antd/modal";
import {MESSAGE} from "../../../../../../constants/message";
import {Base2Component} from 'src/app/components/base2/base2.component';
import {HttpClient} from '@angular/common/http';
import {StorageService} from 'src/app/services/storage.service';
import {cloneDeep} from 'lodash';
import {
  QuyetDinhPdKhBdgService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/de-xuat-kh-bdg/quyetDinhPdKhBdg.service';
import {saveAs} from 'file-saver';

@Component({
  selector: 'app-thong-tin-dau-gia',
  templateUrl: './thong-tin-dau-gia.component.html',
  styleUrls: ['./thong-tin-dau-gia.component.scss']
})
export class ThongTinDauGiaComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string;
  idQdPdKh: number = 0;
  isViewQdPdKh: boolean = false;
  idQdDc: number = 0;
  isViewQdDc: boolean = false;
  idDxBdg: number = 0;
  isViewDxBdg: boolean = false;
  idKqBdg: number = 0;
  isViewKqBdg: boolean = false;
  listTrangThai: any[] = [
    {ma: this.STATUS.CHUA_CAP_NHAT, giaTri: 'Chưa cập nhật'},
    {ma: this.STATUS.DANG_CAP_NHAT, giaTri: 'Đang cập nhật'},
    {ma: this.STATUS.HOAN_THANH_CAP_NHAT, giaTri: 'Hoàn thành cập nhật'},
  ];

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private quyetDinhPdKhBdgService: QuyetDinhPdKhBdgService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, quyetDinhPdKhBdgService);
    this.formData = this.fb.group({
      nam: null,
      soDxuat: null,
      soQdPd: null,
      soQdPdKqBdg: null,
      ngayKyQdPdKqBdgTu: null,
      ngayKyQdPdKqBdgDen: null,
      loaiVthh: null,
      // isDieuChinh: 0,

    })
    this.filterTable = {
      nam: '',
      soQdPd: '',
      soQdDcBdg: '',
      soQdPdKqBdg: '',
      soDxuat: '',
      ngayKyQdPdKqBdg: '',
      slDviTsan: '',
      soDviTsanThanhCong: '',
      soDviTsanKhongThanh: '',
      tenCloaiVthh: '',
      tenTrangThai: '',
      ketQuaDauGia: '',
    };
  }

  async ngOnInit() {
    try {
      await this.spinner.show();
      await Promise.all([
        this.timKiem(),
        this.searchDtl()
      ]);
    } catch (e) {
      console.log('error: ', e);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      this.spinner.hide();
    }
  }

  async timKiem() {
    this.formData.patchValue({
      loaiVthh: this.loaiVthh,
    })
  }

  async clearFilter() {
    this.formData.reset();
    await Promise.all([
      this.timKiem(),
      this.search()
    ]);
  }

  async searchDtl() {
    try {
      await this.spinner.show();
      const body = {
        ...this.formData.value,
      };
      const res = await this.quyetDinhPdKhBdgService.searchDtl(body);
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

  exportDataDtl(fileName?: string) {
    if (this.totalRecord > 0) {
      this.spinner.show();
      this.quyetDinhPdKhBdgService.exportDtl(this.formData.value).subscribe(
        (blob) => {
          saveAs(blob, fileName ? fileName : 'data.xlsx');
          this.spinner.hide();
        },
        (error) => {
          console.log('error: ', error);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      );
    } else {
      this.notification.error(MESSAGE.ERROR, MESSAGE.DATA_EMPTY);
    }
  }

  openModal(id: number, modalType: string) {
    switch (modalType) {
      case 'QdPdKh':
        this.idQdPdKh = id;
        this.isViewQdPdKh = true;
        break;
      case 'QdPdDc' :
        this.idQdDc = id;
        this.isViewQdDc = true;
        break;
      case 'DxBdg':
        this.idDxBdg = id;
        this.isViewDxBdg = true;
        break;
      case 'KqBdg':
        this.idKqBdg = id;
        this.isViewKqBdg = true;
        break;
      default:
        break;
    }
  }

  closeModal(modalType: string) {
    switch (modalType) {
      case 'QdPdKh':
        this.idQdPdKh = null;
        this.isViewQdPdKh = false;
        break;
      case 'QdPdDc' :
        this.idQdDc = null;
        this.isViewQdDc = false;
        break;
      case 'DxBdg':
        this.idDxBdg = null;
        this.isViewDxBdg = false;
        break;
      case 'KqBdg':
        this.idKqBdg = null;
        this.isViewKqBdg = false;
        break;
      default:
        break;
    }
  }

  async showListDtl() {
    this.isDetail = false;
    await this.searchDtl();
    this.showListEvent.emit();
  }

  disabledNgayPduyetKqTu = (startValue: Date): boolean => {
    if (!startValue || !this.formData.value.ngayKyQdPdKqBdgDen) {
      return false;
    }
    return startValue.getTime() > this.formData.value.ngayKyQdPdKqBdgDen.getTime();
  };

  disabledNgayPduyetKqDen = (endValue: Date): boolean => {
    if (!endValue || !this.formData.value.ngayKyQdPdKqBdgTu) {
      return false;
    }
    return endValue.getTime() <= this.formData.value.ngayKyQdPdKqBdgTu.getTime();
  };
}
