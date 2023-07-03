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
import { DonviService } from 'src/app/services/donvi.service';


@Component({
  selector: 'app-ho-so-ky-thuat-xuat-dieu-chuyen',
  templateUrl: './ho-so-ky-thuat.component.html',
  styleUrls: ['./ho-so-ky-thuat.component.scss']
})
export class HoSoKyThuatXuatDieuChuyenComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string;
  @Input() loaiDc: string;
  @Input() isVatTu: boolean;
  @Input() thayDoiThuKho: boolean;
  @Input() type: string
  isDetail: boolean = false;
  selectedId: number = 0;
  isViewDetail: boolean;

  listHangHoaAll: any[] = [];
  listLoaiHangHoa: any[] = [];

  listDiemKho: any[] = [];
  listNhaKho: any[] = [];
  listNganKho: any[] = [];
  listLoKho: any[] = []
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private phieuKiemNghiemChatLuongService: PhieuKiemNghiemChatLuongService,
    private hoSoKyThuatCtvtService: HoSoKyThuatCtvtService,
    private donViService: DonviService
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
        this.timKiem(),
        this.getListDiemKho(this.userInfo.MA_DVI)
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
  async getListDiemKho(maDvi) {
    if (maDvi) {
      try {
        let body = {
          maDviCha: maDvi,
          trangThai: '01',
        }
        const res = await this.donViService.getTreeAll(body);
        if (res.msg == MESSAGE.SUCCESS) {

          if (res.data && res.data.length > 0) {
            res.data.forEach(element => {
              if (element && element.capDvi == '3' && element.children) {
                // this.listDiemKho = [];
                this.listDiemKho = [
                  ...this.listDiemKho,
                  ...element.children
                ]
              }
            });
          }
        }

      } catch (error) {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      } finally {
        this.spinner.hide();
      }
    }
  };
  getListNhaKho(maDiemKho: string) {
    this.listNhaKho = Array.isArray(this.listDiemKho) && this.listDiemKho.find(f => f.maDvi == maDiemKho) && Array.isArray(this.listDiemKho.find(f => f.maDvi == maDiemKho).children) ? this.listDiemKho.find(f => f.maDvi == maDiemKho).children : [];
  }
  getListNganKho(maNhaKho: string) {
    this.listNganKho = Array.isArray(this.listNhaKho) && this.listNhaKho.find(f => f.maDvi == maNhaKho) && Array.isArray(this.listNhaKho.find(f => f.maDvi == maNhaKho).children) ? this.listNhaKho.find(f => f.maDvi == maNhaKho).children : [];
  }
  getListLoKho(maNganKho: string) {
    this.listLoKho = Array.isArray(this.listNganKho) && this.listNganKho.find(f => f.maDvi == maNganKho) && Array.isArray(this.listNganKho.find(f => f.maDvi == maNganKho).children) ? this.listNganKho.find(f => f.maDvi == maNganKho).children : [];
  }
  handleChangeDiemKho(maDiemKho: string) {
    console.log("maDiemKho", maDiemKho)
    this.listNhaKho = [];
    this.listNganKho = [];
    this.listLoKho = [];
    this.formData.patchValue({ maNhaKho: '', maNganKho: '', maLoKho: '' });
    this.getListNhaKho(maDiemKho)
  };
  handleChangeNhaKho(maNhaKho: string) {
    this.listNganKho = [];
    this.listLoKho = [];
    this.formData.patchValue({ maNganKho: '', maLoKho: '' });
    this.getListNganKho(maNhaKho)
  };
  handleChangeNganKho(maNganKho: string) {
    this.listLoKho = [];
    this.formData.patchValue({ maLoKho: '' });
    this.getListLoKho(maNganKho)
  }
  disabledTuNgay = (startValue: Date): boolean => {
    if (startValue && this.formData.value.ngayTaoDen) {
      return startValue.getTime() > this.formData.value.ngayTaoDen.getTime();
    }
    return false;
  };

  disabledDenNgay = (endValue: Date): boolean => {
    if (!endValue || !this.formData.value.ngayTaoTu) {
      return false;
    }
    return endValue.getTime() <= this.formData.value.ngayTaoTu.getTime();
  };
  redirectToChiTiet(id: number, isView?: boolean) {
    this.selectedId = id;
    this.isDetail = true;
    this.isViewDetail = isView ?? false;
  }
}
