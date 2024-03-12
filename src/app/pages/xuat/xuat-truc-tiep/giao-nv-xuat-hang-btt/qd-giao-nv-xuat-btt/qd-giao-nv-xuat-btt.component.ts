import {Component, Input, OnInit} from '@angular/core';
import {MESSAGE} from "../../../../../constants/message";
import {NgxSpinnerService} from "ngx-spinner";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NzModalService} from "ng-zorro-antd/modal";
import {Base2Component} from 'src/app/components/base2/base2.component';
import {StorageService} from 'src/app/services/storage.service';
import {HttpClient} from '@angular/common/http';
import {
  QuyetDinhNvXuatBttService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/quyet-dinh-nv-xuat-btt/quyet-dinh-nv-xuat-btt.service';
import {LOAI_HANG_DTQG} from 'src/app/constants/config';
import {DanhMucService} from "../../../../../services/danhmuc.service";

@Component({
  selector: 'app-qd-giao-nv-xuat-btt',
  templateUrl: './qd-giao-nv-xuat-btt.component.html',
  styleUrls: ['./qd-giao-nv-xuat-btt.component.scss']
})
export class QdGiaoNvXuatBttComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string;
  @Input() listVthh: any[] = [];
  LOAI_HANG_DTQG = LOAI_HANG_DTQG
  listLoaiHangHoa: any[] = [];
  isView = false;
  idHopDong: number = 0;
  isViewHopDong: boolean = false;
  idTinhKho: number = 0;
  isViewTinhKho: boolean = false;
  idHaoDoi: number = 0;
  isViewHaoDoi: boolean = false
  listTrangThai: any = [];
  listTrangThaiXh: any = [];


  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private danhMucService: DanhMucService,
    private quyetDinhNvXuatBttService: QuyetDinhNvXuatBttService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, quyetDinhNvXuatBttService);
    this.formData = this.fb.group({
      namKh: null,
      soQdNv: null,
      loaiVthh: null,
      trichYeu: null,
      ngayKyQdNvTu: null,
      ngayKyQdNvDen: null,
    })

    this.filterTable = {
      namKh: null,
      soQdNv: null,
      ngayKyQdNv: null,
      soHopDong: null,
      soBangKeBanLe: null,
      tenLoaiVthh: null,
      tenCloaiVthh: null,
      tgianGiaoNhan: null,
      trichYeu: null,
      tenTrangThai: null,
      tenTrangThaiXh: null,
    };
    this.listTrangThai = [
      {
        value: this.STATUS.DU_THAO,
        text: 'Dự thảo'
      },
      {
        value: this.STATUS.CHO_DUYET_TP,
        text: 'Chờ duyệt - TP'
      },
      {
        value: this.STATUS.TU_CHOI_TP,
        text: 'Từ chối - TP'
      },
      {
        value: this.STATUS.CHO_DUYET_LDC,
        text: 'Chờ duyệt - LĐ Cục'
      },
      {
        value: this.STATUS.TU_CHOI_LDC,
        text: 'Từ chối - LĐ Cục'
      },
      {
        value: this.STATUS.BAN_HANH,
        text: 'Ban hành'
      },
    ]
    this.listTrangThaiXh = [
      {
        value: this.STATUS.CHUA_THUC_HIEN,
        text: 'Chưa thực hiện'
      },
      {
        value: this.STATUS.DANG_THUC_HIEN,
        text: 'Đang thực hiện'
      },
      {
        value: this.STATUS.DA_HOAN_THANH,
        text: 'Đã hoàn thành'
      },
    ]
  }

  async ngOnInit() {
    try {
      await this.spinner.show();
      this.formData.patchValue({
        loaiVthh: this.loaiVthh,
      })
      if (this.loaiVthh.startsWith(LOAI_HANG_DTQG.VAT_TU)) {
        await this.loadDsVthh();
      }
      await this.search();
      await this.checkPriceAdjust('xuất hàng');
    } catch (e) {
      console.error('error: ', e);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  async loadDsVthh() {
    const res = await this.danhMucService.getDanhMucHangDvqlAsyn({});
    if (res.msg === MESSAGE.SUCCESS) {
      this.listLoaiHangHoa = res.data?.filter(x => x.ma.length === 4) || [];
    }
  }

  redirectDetail(id, isView: boolean) {
    if (id === 0 && this.checkPrice && this.checkPrice.boolean) {
      this.notification.error(MESSAGE.ERROR, this.checkPrice.msgSuccess);
      return;
    }
    if (id === 0 && this.checkPrice && this.checkPrice.booleanNhapXuat) {
      this.notification.error(MESSAGE.ERROR, this.checkPrice.msgNhapXuat);
      return;
    }
    this.idSelected = id;
    this.isDetail = true;
    this.isView = isView;
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

  disabledNgayKyQdNvTu = (startValue: Date): boolean => {
    if (!startValue || !this.formData.value.ngayKyQdNvDen) {
      return false;
    }
    const startDay = new Date(startValue.getFullYear(), startValue.getMonth(), startValue.getDate());
    const endDay = new Date(this.formData.value.ngayKyQdNvDen.getFullYear(), this.formData.value.ngayKyQdNvDen.getMonth(), this.formData.value.ngayKyQdNvDen.getDate());
    return startDay > endDay;
  };

  disabledNgayKyQdNvDen = (endValue: Date): boolean => {
    if (!endValue || !this.formData.value.ngayKyQdNvTu) {
      return false;
    }
    const endDay = new Date(endValue.getFullYear(), endValue.getMonth(), endValue.getDate());
    const startDay = new Date(this.formData.value.ngayKyQdNvTu.getFullYear(), this.formData.value.ngayKyQdNvTu.getMonth(), this.formData.value.ngayKyQdNvTu.getDate());
    return endDay < startDay;
  };

  isActionAllowed(action: string, data: any): boolean {
    const permissions = {
      XEM: 'XHDTQG_PTTT_QDGNVXH_XEM',
      THEM: 'XHDTQG_PTTT_QDGNVXH_THEM',
      XOA: 'XHDTQG_PTTT_QDGNVXH_XOA',
      DUYET_TP: 'XHDTQG_PTTT_QDGNVXH_DUYET_TP',
      DUYET_LDCUC: 'XHDTQG_PTTT_QDGNVXH_DUYET_LDCUC',
    };
    switch (action) {
      case 'XEM':
        return (
          this.userService.isAccessPermisson(permissions.XEM) && ((this.userService.isAccessPermisson(permissions.THEM) &&
              [
                this.STATUS.CHO_DUYET_TP,
                this.STATUS.CHO_DUYET_LDC,
                this.STATUS.CHO_DUYET_LDC,
                this.STATUS.BAN_HANH,
              ].includes(data.trangThai)) ||
            (!this.userService.isAccessPermisson(permissions.THEM) && [
                this.STATUS.DU_THAO,
                this.STATUS.TU_CHOI_TP,
                this.STATUS.TU_CHOI_LDC,
                this.STATUS.BAN_HANH
              ].includes(data.trangThai) ||
              (data.trangThai === this.STATUS.CHO_DUYET_TP &&
                !this.userService.isAccessPermisson(permissions.DUYET_TP)) ||
              (data.trangThai === this.STATUS.CHO_DUYET_LDC &&
                !this.userService.isAccessPermisson(permissions.DUYET_LDCUC))))
        );
      case 'SUA':
        return [
          this.STATUS.DU_THAO,
          this.STATUS.TU_CHOI_TP,
          this.STATUS.TU_CHOI_LDC
        ].includes(data.trangThai) && this.userService.isAccessPermisson(permissions.THEM);
      case 'PHEDUYET':
        return (
          (this.userService.isAccessPermisson(permissions.DUYET_TP) &&
            data.trangThai === this.STATUS.CHO_DUYET_TP) ||
          (this.userService.isAccessPermisson(permissions.DUYET_LDCUC) &&
            data.trangThai === this.STATUS.CHO_DUYET_LDC)
        );
      case 'XOA':
        return data.trangThai === this.STATUS.DU_THAO &&
          this.userService.isAccessPermisson(permissions.XOA);
      default:
        return false;
    }
  }
}
