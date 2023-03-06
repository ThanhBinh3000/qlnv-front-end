import { Component, Input, OnInit } from '@angular/core';
import dayjs from 'dayjs';
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
      namKh: [dayjs().get('year')],
      soBangKe: [],
      soQd: [],
      tenNguoiMua: [],
      ngayBanHang: [],
      maDvi: [],
      loaiVthh: [],
      ngayBanHangTu: [],
      ngayBanHangDen: []

    });

    this.filterTable = {
      namKh: '',
      soBangKe: '',
      soQd: '',
      tenNguoiMua: '',
      diaChi: '',
      cmt: '',
      tenLoaiVthh: '',
      tenCloaiVthh: '',
      soLuong: '',
      donGia: '',
      thanhTien: '',
    };
  }

  async ngOnInit() {
    try {
      this.formData.patchValue({
        loaiVthh: this.loaiVthh,
        maDvi: this.userService.isChiCuc() ? this.userInfo.MA_DVI : null,
      })
      await this.timKiem();
      await this.spinner.hide();
    }
    catch (e) {
      console.log('error: ', e)
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async timKiem() {
    if (this.formData.value.ngayBanHang) {
      this.formData.value.ngayBanHangTu = dayjs(this.formData.value.ngayBanHang[0]).format('YYYY-MM-DD')
      this.formData.value.ngayBanHangDen = dayjs(this.formData.value.ngayBanHang[1]).format('YYYY-MM-DD')
    }
    await this.search();
  }

  themMoiBangKeBanLe($event, data?: null, index?: number) {

    const modalGT = this.modal.create({
      // nzTitle: 'THÊM BẢNG KÊ',
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

}
