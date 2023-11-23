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
import {LOAI_HANG_DTQG} from 'src/app/constants/config';

@Component({
  selector: 'app-thong-tin-dau-gia',
  templateUrl: './thong-tin-dau-gia.component.html',
  styleUrls: ['./thong-tin-dau-gia.component.scss']
})
export class ThongTinDauGiaComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string;
  LOAI_HANG_DTQG = LOAI_HANG_DTQG
  idQdPdKh: number = 0;
  isViewQdPdKh: boolean = false;
  idQdDc: number = 0;
  isViewQdDc: boolean = false;
  idDxBdg: number = 0;
  isViewDxBdg: boolean = false;
  idKqBdg: number = 0;
  isViewKqBdg: boolean = false;
  listTrangThai: any = [];

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
      soQdKq: null,
      ngayKyQdKqTu: null,
      ngayKyQdKqDen: null,
      loaiVthh: null,
    })
    this.filterTable = {
      nam: null,
      soQdPd: null,
      soQdDc: null,
      soQdKq: null,
      soDxuat: null,
      ngayKyQdKq: null,
      slDviTsan: null,
      soDviTsanThanhCong: null,
      soDviTsanKhongThanh: null,
      tenLoaiVthh: null,
      tenCloaiVthh: null,
      tenTrangThai: null,
      ketQuaDauGia: null,
    };
    this.listTrangThai = [
      {
        value: this.STATUS.CHUA_THUC_HIEN,
        text: 'Chưa thực hiện'
      },
      {
        value: this.STATUS.DANG_THUC_HIEN,
        text: 'Đang thực hiện'
      },
      {
        value: this.STATUS.DA_HOAN_THANH,
        text: 'Đã hoàn thành'
      },
    ]
  }

  async ngOnInit() {
    try {
      await this.spinner.show();
      this.formData.patchValue({
        loaiVthh: this.loaiVthh,
      })
      await this.searchDtl();
    } catch (e) {
      console.log('error: ', e);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      this.spinner.hide();
    }
  }

  async clearFilter() {
    this.formData.reset();
    this.formData.patchValue({
      loaiVthh: this.loaiVthh,
    })
    await this.searchDtl()
  }

  async searchDtl() {
    try {
      await this.spinner.show();
      const body = {
        ...this.formData.value,
      };
      const res = await this.quyetDinhPdKhBdgService.searchDtl(body);
      if (res.msg == MESSAGE.SUCCESS) {
        let data = res.data;
        this.dataTable = data.content;
        this.totalRecord = data.totalElements;
        if (this.dataTable && this.dataTable.length > 0) {
          this.dataTable.forEach((item) => {
            item.checked = false;
          });
        }
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

  isInvalidDateRange = (startValue: Date, endValue: Date, formDataKey: string): boolean => {
    const startDate = this.formData.value[formDataKey + 'Tu'];
    const endDate = this.formData.value[formDataKey + 'Den'];
    return !!startValue && !!endValue && startValue.getTime() > endValue.getTime();
  };

  disabledNgayPduyetKqTu = (startValue: Date): boolean => {
    return this.isInvalidDateRange(startValue, this.formData.value.ngayKyQdPdKqBdgDen, 'ngayKyQdPdKqBdg');
  };

  disabledNgayPduyetKqDen = (endValue: Date): boolean => {
    return this.isInvalidDateRange(endValue, this.formData.value.ngayKyQdPdKqBdgTu, 'ngayKyQdPdKqBdg');
  };
}
