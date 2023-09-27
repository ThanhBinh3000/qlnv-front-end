import {Component, Input, OnInit} from '@angular/core';
import {MESSAGE} from "../../../../../constants/message";
import {NgxSpinnerService} from "ngx-spinner";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NzModalService} from "ng-zorro-antd/modal";
import {Base2Component} from 'src/app/components/base2/base2.component';
import {StorageService} from 'src/app/services/storage.service';
import {HttpClient} from '@angular/common/http';
import {
  QuyetDinhGiaoNvXuatHangService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/quyetdinh-nhiemvu-xuathang/quyet-dinh-giao-nv-xuat-hang.service';
import {DanhMucService} from 'src/app/services/danhmuc.service';
import {LOAI_HANG_DTQG} from 'src/app/constants/config';
import {DauGiaComponent} from "../../dau-gia.component";
import {CHUC_NANG} from "../../../../../constants/status";

@Component({
  selector: 'app-table-giao-xh',
  templateUrl: './table-giao-xh.component.html',
  styleUrls: ['./table-giao-xh.component.scss'],
})

export class TableGiaoXh extends Base2Component implements OnInit {
  @Input() loaiVthh: string;
  @Input() listVthh: any[] = [];
  CHUC_NANG = CHUC_NANG;
  public vldTrangThai: DauGiaComponent;
  listLoaiHangHoa: any[] = [];
  isView = false;
  idHopDong: number = 0;
  isViewHopDong: boolean = false;
  idTinhKho: number = 0;
  isViewTinhKho: boolean = false;
  idHaoDoi: number = 0;
  isViewHaoDoi: boolean = false

  listTrangThai: any[] = [
    {ma: this.STATUS.DU_THAO, giaTri: 'Dự thảo'},
    {ma: this.STATUS.TU_CHOI_TP, giaTri: 'Từ chối - TP'},
    {ma: this.STATUS.CHO_DUYET_TP, giaTri: 'Đã Chờ duyệt - TP'},
    {ma: this.STATUS.CHO_DUYET_LDC, giaTri: 'Chờ duyệt - LĐ Cục'},
    {ma: this.STATUS.TU_CHOI_LDC, giaTri: 'Từ chối - LĐ Cục'},
    {ma: this.STATUS.BAN_HANH, giaTri: 'Ban Hành'},
  ];

  listTrangThaiXh: any[] = [
    {ma: this.STATUS.CHUA_THUC_HIEN, giaTri: 'Chưa thực hiện'},
    {ma: this.STATUS.DANG_THUC_HIEN, giaTri: 'Đang thực hiện'},
    {ma: this.STATUS.DA_HOAN_THANH, giaTri: 'Đã hoàn thành'},
  ];

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private danhMucService: DanhMucService,
    private dauGiaComponent: DauGiaComponent,
    private quyetDinhGiaoNvXuatHangService: QuyetDinhGiaoNvXuatHangService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, quyetDinhGiaoNvXuatHangService);
    this.vldTrangThai = this.dauGiaComponent;
    this.formData = this.fb.group({
      nam: [null],
      soQdNv: [null],
      loaiVthh: [null],
      trichYeu: [null],
      ngayKyTu: [null],
      ngayKyDen: [null],
    });

    this.filterTable = {
      nam: '',
      soQdNv: '',
      ngayKy: '',
      soHopDong: '',
      tenLoaiVthh: '',
      tenCloaiVthh: '',
      tgianGiaoHang: '',
      trichYeu: '',
      BienBanTinhKho: '',
      BienBanHaoDoi: '',
      tenTrangThai: '',
      tenTrangThaiXh: '',
    };
  }

  async ngOnInit() {
    try {
      await this.spinner.show();
      await Promise.all([
        this.timKiem(),
        this.search(),
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
    })
    if (this.loaiVthh.startsWith(LOAI_HANG_DTQG.VAT_TU)) {
      await this.loadDsVthh();
    }
  }

  async clearFilter() {
    this.formData.reset();
    await Promise.all([this.timKiem(), this.search()]);
  }

  redirectDetail(id, isView: boolean) {
    this.idSelected = id;
    this.isDetail = true;
    this.isView = isView;
  }

  async loadDsVthh() {
    const res = await this.danhMucService.getDanhMucHangDvqlAsyn({});
    if (res.msg === MESSAGE.SUCCESS) {
      this.listLoaiHangHoa = res.data?.filter(x => x.ma.length === 4) || [];
    }
  }

  openModal(id: number, modalType: string) {
    switch (modalType) {
      case 'hopDong' :
        this.idHopDong = id;
        this.isViewHopDong = true;
        break;
      case 'tinhKho' :
        this.idTinhKho = id;
        this.isViewTinhKho = true;
        break;
      case 'haoDoi' :
        this.idHaoDoi = id;
        this.isViewHaoDoi = true;
        break;
      default:
        break;
    }
  }

  closeModal(modalType: string) {
    switch (modalType) {
      case 'hopDong' :
        this.idHopDong = null;
        this.isViewHopDong = false;
        break;
      case 'tinhKho' :
        this.idTinhKho = null;
        this.isViewTinhKho = false;
        break;
      case 'haoDoi' :
        this.idHaoDoi = null;
        this.isViewHaoDoi = false;
        break;
      default:
        break;
    }
  }

  disabledNgayTaoTu = (startValue: Date): boolean => {
    if (!startValue || !this.formData.value.ngayKyDen) {
      return false;
    }
    return startValue.getTime() > this.formData.value.ngayKyDen.getTime();
  };

  disabledNgayTaoDen = (endValue: Date): boolean => {
    if (!endValue || !this.formData.value.ngayKyTu) {
      return false;
    }
    return endValue.getTime() <= this.formData.value.ngayKyTu.getTime();
  };
}
