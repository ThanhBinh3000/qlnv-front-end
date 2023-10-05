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
import {LOAI_HANG_DTQG} from "../../../../../constants/config";
import {DanhMucService} from "../../../../../services/danhmuc.service";
import {STATUS} from "../../../../../constants/status";

@Component({
  selector: 'app-qd-giao-nv-xuat-btt',
  templateUrl: './qd-giao-nv-xuat-btt.component.html',
  styleUrls: ['./qd-giao-nv-xuat-btt.component.scss']
})
export class QdGiaoNvXuatBttComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string;
  @Input() listVthh: any[] = [];
  listClVthh: any[] = [];
  isView = false;
  idHd: number = 0;
  isViewHd: boolean = false;
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
      ngayTaoTu: null,
      ngayTaoDen: null,
    })

    this.filterTable = {
      namKh: '',
      soQdNv: '',
      ngayTao: '',
      soHd: '',
      tenLoaiVthh: '',
      tenCloaiVthh: '',
      tgianGnhan: '',
      trichYeu: '',
      bbTinhKho: '',
      bbHaoDoi: '',
      tenTrangThai: '',
      tenTrangThaiXh: '',
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
      await Promise.all([
        this.timKiem(),
        this.search(),
      ]);
    } catch (e) {
      console.error('error: ', e);
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

  async loadDsVthh() {
    const res = await this.danhMucService.getDanhMucHangDvqlAsyn({});
    if (res.msg === MESSAGE.SUCCESS) {
      this.listClVthh = res.data?.filter(x => x.ma.length === 4) || [];
    }
  }

  redirectDetail(id, isView: boolean) {
    this.idSelected = id;
    this.isDetail = true;
    this.isView = isView;
  }

  openModalHd(id: number) {
    this.idHd = id;
    this.isViewHd = true;
  }

  closeModalHd() {
    this.idHd = null;
    this.isViewHd = false;
  }

  isInvalidDateRange = (startValue: Date, endValue: Date, formDataKey: string): boolean => {
    const startDate = this.formData.value[formDataKey + 'Tu'];
    const endDate = this.formData.value[formDataKey + 'Den'];
    return !!startValue && !!endValue && startValue.getTime() > endValue.getTime();
  };

  disabledNgayTaoTu = (startValue: Date): boolean => {
    return this.isInvalidDateRange(startValue, this.formData.value.ngayTaoDen, 'ngayTao');
  };

  disabledNgayTaoDen = (endValue: Date): boolean => {
    return this.isInvalidDateRange(endValue, this.formData.value.ngayTaoTu, 'ngayTao');
  };

  isActionAllowed(action: string, data: any): boolean {
    const permissionMapping = {
      XEM: 'XHDTQG_PTTT_QDGNVXH_XEM',
      THEM: 'XHDTQG_PTTT_QDGNVXH_THEM',
      XOA: 'XHDTQG_PTTT_QDGNVXH_XOA',
      DUYET_TP: 'XHDTQG_PTTT_QDGNVXH_DUYET_TP',
      DUYET_LDCUC: 'XHDTQG_PTTT_QDGNVXH_DUYET_LDCUC',
    };
    switch (action) {
      case 'XEM':
        return this.userService.isAccessPermisson(permissionMapping.XEM) &&
          (data.trangThai !== STATUS.DU_THAO &&
            data.trangThai !== STATUS.TU_CHOI_TP &&
            data.trangThai !== STATUS.TU_CHOI_LDC);
      case 'SUA':
        return (
          (data.trangThai === STATUS.DU_THAO ||
            data.trangThai === STATUS.TU_CHOI_TP ||
            data.trangThai === STATUS.TU_CHOI_LDC) &&
          this.userService.isAccessPermisson(permissionMapping.THEM)
        );
      case 'PHEDUYET':
        return (
          (this.userService.isAccessPermisson(permissionMapping.DUYET_TP) &&
            data.trangThai === STATUS.CHO_DUYET_TP) ||
          (this.userService.isAccessPermisson(permissionMapping.DUYET_LDCUC) &&
            data.trangThai === STATUS.CHO_DUYET_LDC)
        );
      case 'XOA':
        return (
          data.trangThai === STATUS.DU_THAO &&
          this.userService.isAccessPermisson(permissionMapping.XOA)
        );
      default:
        return false;
    }
  }
}
