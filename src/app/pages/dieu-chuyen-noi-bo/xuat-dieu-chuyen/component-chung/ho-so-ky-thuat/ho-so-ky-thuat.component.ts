import { Component, Input, OnInit } from '@angular/core';
import { Base2Component } from "src/app/components/base2/base2.component";
import { HttpClient } from "@angular/common/http";
import { StorageService } from "src/app/services/storage.service";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NgxSpinnerService } from "ngx-spinner";
import { NzModalService } from "ng-zorro-antd/modal";
import {
  PhieuKiemNghiemChatLuongService
} from "src/app/services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/PhieuKiemNghiemChatLuong.service";
import dayjs from "dayjs";
import {
  HoSoKyThuatCtvtService
} from "src/app/services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/HoSoKyThuatCtvt.service";
import { MESSAGE } from "src/app/constants/message";

@Component({
  selector: 'app-ho-so-ky-thuat-xuat-dieu-chuyen',
  templateUrl: './ho-so-ky-thuat.component.html',
  styleUrls: ['./ho-so-ky-thuat.component.scss']
})
export class HoSoKyThuatXuatDieuChuyenComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string;
  isDetail: boolean = false;
  selectedId: number = 0;
  isViewDetail: boolean;

  listHangHoaAll: any[] = [];
  listLoaiHangHoa: any[] = [];

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private phieuKiemNghiemChatLuongService: PhieuKiemNghiemChatLuongService,
    private hoSoKyThuatCtvtService: HoSoKyThuatCtvtService
  ) {
    super(httpClient, storageService, notification, spinner, modal, hoSoKyThuatCtvtService);
    this.formData = this.fb.group({
      id: [],
      idQdGiaoNvNh: [],
      soQdGiaoNvNh: [],
      soBbLayMau: [],
      soHd: [],
      maDvi: [],
      soHoSoKyThuat: [],
      nam: [],
      idBbLayMauXuat: [],
      kqKiemTra: [],
      loaiNhap: [],
      maDiemKho: [],
      maNhaKho: [],
      maNganKho: [],
      maLoKho: [],
      tenDiemKho: [],
      tenNhaKho: [],
      tenNganKho: [],
      tenLoKho: [],
      loaiVthh: [],
      cloaiVthh: [],
      tenLoaiVthh: [],
      tenCloaiVthh: [],
      trangThai: [],
      tenTrangThai: [],
      tenDvi: [],
      ngayTao: [],
      soBbKtNgoaiQuan: [],
      soBbKtVanHanh: [],
      soBbKtHskt: [],
      type: []
    })
  }

  async ngOnInit() {
    await this.spinner.show();
    try {
      this.formData.patchValue({
        type: 'DCNBX'
      });
      await Promise.all([
        this.search(),
      ])
    } catch (e) {
      console.log('error: ', e);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
    finally {
      await this.spinner.hide();
    }
  }

  redirectToChiTiet(id: number, isView?: boolean) {
    this.selectedId = id;
    this.isDetail = true;
    this.isViewDetail = isView ?? false;
  }
}
