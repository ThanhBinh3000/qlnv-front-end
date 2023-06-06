import {Component, Input, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {StorageService} from "src/app/services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {DanhMucService} from "src/app/services/danhmuc.service";
import {DanhMucTieuChuanService} from "src/app/services/quantri-danhmuc/danhMucTieuChuan.service";
import dayjs from "dayjs";
import {MESSAGE} from "src/app/constants/message";
import {Base2Component} from "src/app/components/base2/base2.component";
import {
  QuyetDinhGiaoNvCuuTroService
} from "src/app/services/qlnv-hang/xuat-hang/xuat-cap/QuyetDinhGiaoNvCuuTro.service";
import {CHUC_NANG} from "../../../../../constants/status";
import {XuatCuuTroVienTroComponent} from "../../xuat-cuu-tro-vien-tro.component";

@Component({
  selector: 'app-xc-quyet-dinh-gnv-xuat-hang',
  templateUrl: './quyet-dinh-gnv-xuat-hang.component.html',
  styleUrls: ['./quyet-dinh-gnv-xuat-hang.component.scss']
})
export class QuyetDinhGnvXuatHangComponent extends Base2Component implements OnInit {

  @Input() loaiVthh: string;
  @Input() isView: boolean;
  isDetail: boolean = false;
  idSelected: number = 0;

  public vldTrangThai: XuatCuuTroVienTroComponent;
  public CHUC_NANG = CHUC_NANG;

  listHangHoaAll: any[] = [];
  listLoaiHangHoa: any[] = [];
  idQdPd: number = 0;
  openQdPd = false;
  idBbTk: number = 0;
  openBbTk = false;
  idBbHd: number = 0;
  openBbHd = false;

  listTrangThai: any[] = [
    {ma: this.STATUS.DU_THAO, giaTri: 'Dự thảo'},
    {ma: this.STATUS.CHO_DUYET_TP, giaTri: 'Chờ duyệt - TP'},
    {ma: this.STATUS.TU_CHOI_TP, giaTri: 'Từ chối - TP'},
    {ma: this.STATUS.CHO_DUYET_LDC, giaTri: 'Chờ duyệt - LĐ Cục'},
    {ma: this.STATUS.TU_CHOI_LDC, giaTri: 'Từ chối - LĐ Cục'},
    {ma: this.STATUS.DA_DUYET_LDC, giaTri: 'Đã duyệt - LĐ Cục'},
    {ma: this.STATUS.BAN_HANH, giaTri: 'Ban hành'},
  ];
  listTrangThaiXh: any[] = [
    {ma: this.STATUS.CHUA_THUC_HIEN, giaTri: 'Chưa thực hiện'},
    {ma: this.STATUS.DANG_THUC_HIEN, giaTri: 'Đang thực hiện'},
    {ma: this.STATUS.DA_HOAN_THANH, giaTri: 'Đã hoàn thành'}
  ];
  constructor(httpClient: HttpClient,
              storageService: StorageService,
              notification: NzNotificationService,
              spinner: NgxSpinnerService,
              modal: NzModalService,
              private quyetDinhGiaoNvCuuTroService: QuyetDinhGiaoNvCuuTroService,
              private danhMucService: DanhMucService,
              private danhMucTieuChuanService: DanhMucTieuChuanService,
              private xuatCuuTroVienTroComponent: XuatCuuTroVienTroComponent
  ) {
    super(httpClient, storageService, notification, spinner, modal, quyetDinhGiaoNvCuuTroService);
    this.vldTrangThai = xuatCuuTroVienTroComponent;
    this.formData = this.fb.group({
      nam: [''],
      soQd: [''],
      maDvi: [''],
      ngayKy: [''],
      ngayKyTu: [''],
      ngayKyDen: [''],
      loaiVthh: [''],
      trichYeu: [''],
    });
    this.filterTable = {
      nam: '',
      soQd: '',
      ngayKy: '',
      soQdPd: '',
      trichYeu: '',
      tenLoaiVthh: '',
      thoiGianGiaoNhan: '',
      soBbHaoDoi: '',
      soBbTinhKho: '',
      tenTrangThai: '',
      tenTrangThaiXh: '',

    };
  }
  disabledStartNgayKy = (startValue: Date): boolean => {
    if (startValue && this.formData.value.ngayKyDen) {
      return startValue.getTime() > this.formData.value.ngayKyDen.getTime();
    }
    return false;
  };

  disabledEndNgayKy = (endValue: Date): boolean => {
    if (!endValue || !this.formData.value.ngayKyTu) {
      return false;
    }
    return endValue.getTime() <= this.formData.value.ngayKyTu.getTime();
  };
  async ngOnInit() {
    await this.spinner.show();
    try {
      // this.formData.patchValue({
      //   loaiVthh: this.loaiVthh
      // })
      await Promise.all([
        this.timKiem(),
        this.loadDsVthh(),
      ])
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      await this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  redirectDetail(id, b: boolean) {
    console.log(id,55)
    this.idSelected = id;
    this.isDetail = true;
    this.isView = b;
  }

  async loadDsVthh() {
    let res = await this.danhMucService.getDanhMucHangDvqlAsyn({});
    if (res.msg == MESSAGE.SUCCESS) {
      this.listHangHoaAll = res.data;
      this.listLoaiHangHoa = res.data?.filter((x) => x.ma.length == 4);
    }
  }

  async timKiem() {
    await this.spinner.show();
    try {
      if (this.formData.value.ngayKy) {
        this.formData.value.ngayKyTu = dayjs(this.formData.value.ngayKy[0]).format('YYYY-MM-DD')
        this.formData.value.ngayKyDen = dayjs(this.formData.value.ngayKy[1]).format('YYYY-MM-DD')
      }
      await this.search();
    } catch (e) {
      console.log(e)
    }
    await this.spinner.hide();
  }

  openQdPdModal(id: any) {
    this.idQdPd = id;
    this.openQdPd = true;
  }

  closeQdPdModal() {
    this.idQdPd = null;
    this.openQdPd = false;
  }

  openSoBbTkModal(id: any) {
    this.idBbTk = id;
    this.openBbTk = true;
  }

  closeSoBbTkModal() {
    this.idBbTk = null;
    this.openBbTk = false;
  }

  openSoBbHdModal(id: any) {
    this.idBbHd = id;
    this.openBbHd = true;
  }

  closeSoBbHdModal() {
    this.idBbHd = null;
    this.openBbHd = false;
  }
}
