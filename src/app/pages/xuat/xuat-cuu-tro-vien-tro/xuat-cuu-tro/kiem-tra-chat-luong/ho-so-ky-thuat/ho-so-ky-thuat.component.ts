import {Component, Input, OnInit} from '@angular/core';
import {Base2Component} from "../../../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {
  PhieuKiemNghiemChatLuongService
} from "../../../../../../services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/PhieuKiemNghiemChatLuong.service";
import dayjs from "dayjs";
import {
  HoSoKyThuatCtvtService
} from "../../../../../../services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/HoSoKyThuatCtvt.service";
import {MESSAGE} from "../../../../../../constants/message";

@Component({
  selector: 'app-ho-so-ky-thuat',
  templateUrl: './ho-so-ky-thuat.component.html',
  styleUrls: ['./ho-so-ky-thuat.component.scss']
})
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
    private phieuKiemNghiemChatLuongService: PhieuKiemNghiemChatLuongService,
    private hoSoKyThuatCtvtService: HoSoKyThuatCtvtService
  ) {
    super(httpClient, storageService, notification, spinner, modal, hoSoKyThuatCtvtService);
    this.formData = this.fb.group({
      id: [],
      nam: [],
      idQdGiaoNvNh: [],
      soQdGiaoNvNh: [],
      soBbLayMau: [],
      soHd: [],
      maDvi: [],
      tenDvi: [],
      soHoSoKyThuat: [],
      idBbLayMauXuat: [],
      kqKiemTra: [],
      loaiNhap: [],
      maDiemKho: [],
      maNhaKho: [],
      maNganKho: [],
      maLoKho: [],
      ngayTao: []
    })
  }

  async ngOnInit() {
    await this.spinner.show();
    try {
      await Promise.all([
        this.search(),
        // this.loadDsVthh(),
      ])
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      await this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  redirectToChiTiet(id: number, isView?: boolean) {
    this.selectedId = id;
    this.isDetail = true;
    this.isViewDetail = isView ?? false;
  }
}
