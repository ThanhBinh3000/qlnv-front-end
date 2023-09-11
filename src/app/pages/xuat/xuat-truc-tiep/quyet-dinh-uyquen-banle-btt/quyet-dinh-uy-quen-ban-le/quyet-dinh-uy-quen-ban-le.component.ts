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

@Component({
  selector: 'app-quyet-dinh-uy-quen-ban-le',
  templateUrl: './quyet-dinh-uy-quen-ban-le.component.html',
  styleUrls: ['./quyet-dinh-uy-quen-ban-le.component.scss']
})
export class QuyetDinhUyQuenBanLeComponent extends Base2Component implements OnInit {
  @Input()
  loaiVthh: string;
  idDxKh: number = 0;
  isViewDxKh: boolean = false;
  pthucBanTrucTiep: string;
  selectedId: number = 0;
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
      trichYeu: '',
      loaiVthh: '',
      tenLoaiVthh: '',
      cloaiVthh: '',
      tenCloaiVthh: '',
      soLuong: '',
      pthucBanTrucTiep: '',
      trangThai: '',
      tenTrangThai: '',

    };
  }

  async ngOnInit() {
    try {
      await this.spinner.show();
      await Promise.all([
        this.timKiem(),
        this.search()
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
    await Promise.all([
      this.timKiem(),
      this.search()
    ]);
  }

  redirectToChiTiet(id: number) {
    this.selectedId = id;
    this.isDetail = true;
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

  openModalDxKh(id: number) {
    this.idDxKh = id;
    this.isViewDxKh = true;
  }

  closeModalDxKh() {
    this.idDxKh = null;
    this.isViewDxKh = false;
  }
}
