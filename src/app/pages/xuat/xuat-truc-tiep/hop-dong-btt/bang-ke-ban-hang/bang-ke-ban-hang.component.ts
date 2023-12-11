import {Component, Input, OnInit} from '@angular/core';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NgxSpinnerService} from 'ngx-spinner';
import {MESSAGE} from 'src/app/constants/message';
import {Base2Component} from 'src/app/components/base2/base2.component';
import {HttpClient} from '@angular/common/http';
import {StorageService} from 'src/app/services/storage.service';
import {DonviService} from 'src/app/services/donvi.service';
import {BangKeBttService} from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/hop-dong-btt/bang-ke-btt.service';
import {
  DialogThemMoiBangKeBanLeComponent
} from 'src/app/components/dialog/dialog-them-moi-bang-ke-ban-le/dialog-them-moi-bang-ke-ban-le.component';
import {LOAI_HANG_DTQG} from 'src/app/constants/config';

@Component({
  selector: 'app-bang-ke-ban-hang',
  templateUrl: './bang-ke-ban-hang.component.html',
  styleUrls: ['./bang-ke-ban-hang.component.scss']
})
export class BangKeBanHangComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string;
  LOAI_HANG_DTQG = LOAI_HANG_DTQG
  idQdNv: number = 0;
  isViewQdNv: boolean = false;

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private donviService: DonviService,
    private bangKeBttService: BangKeBttService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, bangKeBttService);
    this.formData = this.fb.group({
      namKh: [],
      soBangKe: [],
      soQdNv: [],
      tenNguoiMua: [],
      ngayBanHangTu: [],
      ngayBanHangDen: [],
      maDvi: [],
      loaiVthh: [],
    });

    this.filterTable = {
      namKh: '',
      soBangKe: '',
      soQdNv: '',
      tenNguoiMua: '',
      diaChi: '',
      cmt: '',
      tenLoaiVthh: '',
      tenCloaiVthh: '',
      soLuongBanLe: '',
      donGia: '',
      thanhTien: '',
    };
  }

  async ngOnInit() {
    try {
      await this.spinner.show();
      this.formData.patchValue({
        loaiVthh: this.loaiVthh,
      })
      await this.search();
    } catch (e) {
      console.error('error: ', e);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  async themMoiBangKeBanLe($event, isView: boolean, idInput?: number, index?: number) {
    try {
      const modalGT = this.modal.create({
        nzContent: DialogThemMoiBangKeBanLeComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzStyle: {top: '200px'},
        nzWidth: '1500px',
        nzFooter: null,
        nzComponentParams: {
          idInput,
          loaiVthh: this.loaiVthh,
          isView,
        },
      });
      const data = await modalGT.afterClose.toPromise();
      if (data) {
        if (index >= 0) {
          this.dataTable[index] = data;
        } else {
          this.dataTable.push(data);
        }
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      await this.search();
    }
  }

  openModalQdNv(id: number) {
    this.idQdNv = id;
    this.isViewQdNv = true;
  }

  closeModalQdNv() {
    this.idQdNv = null;
    this.isViewQdNv = false;
  }

  disabledNgayBanHangTu = (startValue: Date): boolean => {
    if (!startValue || !this.formData.value.ngayBanHangDen) {
      return false;
    }
    return startValue.getTime() > this.formData.value.ngayBanHangDen.getTime();
  };

  disabledNgayBanHangDen = (endValue: Date): boolean => {
    if (!endValue || !this.formData.value.ngayBanHangTu) {
      return false;
    }
    return endValue.getTime() <= this.formData.value.ngayBanHangTu.getTime();
  };
}
