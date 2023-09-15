import {Component, Input, OnInit} from '@angular/core';
import {Base2Component} from "src/app/components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "src/app/services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";

import {MESSAGE} from "src/app/constants/message";
import {HoSoKyThuatThanhLyService} from "src/app/services/qlnv-hang/xuat-hang/xuat-thanh-ly/HoSoKyThuatThanhLy.service";
import {
  PhieuKiemNghiemChatLuongService
} from "src/app/services/qlnv-hang/xuat-hang/chung/kiem-tra-chat-luong/PhieuKiemNghiemChatLuong.service";

@Component({
  selector: 'app-ho-so-ky-thuat-thanh-ly',
  templateUrl: './ho-so-ky-thuat.component.html',
  styleUrls: ['./ho-so-ky-thuat.component.scss']
})
//hosokythuatchung
export class HoSoKyThuatComponent extends Base2Component implements OnInit {
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
    public phieuKiemNghiemChatLuongService: PhieuKiemNghiemChatLuongService,
    private hoSoKyThuatThanhLyService: HoSoKyThuatThanhLyService
  ) {
    super(httpClient, storageService, notification, spinner, modal, hoSoKyThuatThanhLyService);
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
    this.formData.patchValue({
      type: 'TL'
    });
    try {
      await Promise.all([
        this.search(),
      ])
    } catch (e) {
      console.log('error: ', e);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  redirectToChiTiet(id: number, isView?: boolean) {
    this.selectedId = id;
    this.isDetail = true;
    this.isViewDetail = isView ?? false;
  }
}