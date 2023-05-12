import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NgxSpinnerService } from "ngx-spinner";
import { NzModalService } from "ng-zorro-antd/modal";
import dayjs from "dayjs";
import { Base2Component } from 'src/app/components/base2/base2.component';
import { StorageService } from 'src/app/services/storage.service';
import { PhieuKiemNghiemChatLuongService } from 'src/app/services/qlnv-hang/xuat-hang/xuat-cap/PhieuKiemNghiemChatLuong.service';
import { HoSoKyThuatCtvtService } from 'src/app/services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/HoSoKyThuatCtvt.service';
import { MESSAGE } from 'src/app/constants/message';


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
      id: [0],
      // nam: [],
      idSoQdinh: [],
      soQdinh: [],
      idQdGiaoNvNh: [],
      soQdGiaoNvNh: [],
      soQd: [],
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
      ngayTao: [],
      ngayTaoTu: [],
      ngayTaoDen: [],
      loaiVthh: []
    })
  }

  async ngOnInit() {
    await this.spinner.show();
    try {
      await Promise.all([
        // this.search(),
        this.timKiem()
        // this.loadDsVthh(),
      ])
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      await this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }
  timKiem() {
    if (this.formData.value.ngayTao) {
      const ngayTaoTu = this.formData.value.ngayTao
        ? dayjs(this.formData.value.ngayTao[0]).format('YYYY-MM-DD')
        : null;
      const ngayTaoDen = this.formData.value.ngayTao
        ? dayjs(this.formData.value.ngayTao[1]).format('YYYY-MM-DD')
        : null;
      this.formData.patchValue({ ngayTaoTu, ngayTaoDen })
    }
    this.search()
  }

  clearForm() {
    this.formData.reset();
    this.timKiem()
  }
  redirectToChiTiet(id: number, isView?: boolean) {
    this.selectedId = id;
    this.isDetail = true;
    this.isViewDetail = isView ?? false;
  }
}
