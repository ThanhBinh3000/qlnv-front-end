import { Component, Input, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import { DonviService } from 'src/app/services/donvi.service';
import { BangKeBttService } from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/hop-dong-btt/bang-ke-btt.service';
import { DialogThemMoiBangKeBanLeComponent } from 'src/app/components/dialog/dialog-them-moi-bang-ke-ban-le/dialog-them-moi-bang-ke-ban-le.component';
@Component({
  selector: 'app-bang-ke-ban-hang',
  templateUrl: './bang-ke-ban-hang.component.html',
  styleUrls: ['./bang-ke-ban-hang.component.scss']
})
export class BangKeBanHangComponent extends Base2Component implements OnInit {
  @Input()
  loaiVthh: string;
  dataEdit: any;

  idQdNv: number = 0;
  isViewQdNv: boolean = false;

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    private donviService: DonviService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
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
      this.timKiem();
      await Promise.all([
        this.search(),
      ]);
      await this.spinner.hide();
    }
    catch (e) {
      console.log('error: ', e)
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async timKiem() {
    this.formData.patchValue({
      loaiVthh: this.loaiVthh,
      maDvi: this.userService.isChiCuc() ? this.userInfo.MA_DVI : null,
    })
  }

  clearFilter() {
    this.formData.reset();
    this.timKiem();
    this.search();
  }

  themMoiBangKeBanLe($event, data?: null, index?: number) {
    const modalGT = this.modal.create({
      nzContent: DialogThemMoiBangKeBanLeComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzStyle: { top: '200px' },
      nzWidth: '1500px',
      nzFooter: null,
      nzComponentParams: {
        idInput: data,
        loaiVthh: this.loaiVthh,
      },
    });
    modalGT.afterClose.subscribe((data) => {
      this.search();
      if (!data) {
        return;
      }
      if (index >= 0) {
        this.dataTable[index] = data;
      } else {
        this.dataTable.push(data);
      }
    });
  };

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
