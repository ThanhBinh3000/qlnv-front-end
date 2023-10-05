import {Component, Input, OnInit} from '@angular/core';
import {Base2Component} from "../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {DanhMucService} from "../../../../services/danhmuc.service";
import {MESSAGE} from "../../../../constants/message";
import dayjs from "dayjs";
import {CHUC_NANG} from "../../../../constants/status";
import {XuatTieuHuyComponent} from "../xuat-tieu-huy.component";
import {
  QuyetDinhTieuHuyService
} from "../../../../services/qlnv-hang/xuat-hang/xuat-tieu-huy/QuyetDinhTieuHuyService.service";

@Component({
  selector: 'app-quyet-dinh-tieu-huy',
  templateUrl: './quyet-dinh-tieu-huy.component.html',
  styleUrls: ['./quyet-dinh-tieu-huy.component.scss']
})
export class QuyetDinhTieuHuyComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string;
  isDetail: boolean = false;
  selectedId: number = 0;
  isView = false;
  CHUC_NANG = CHUC_NANG;
  public vldTrangThai: XuatTieuHuyComponent;
  listHangHoaAll: any[] = [];
  listLoaiHangHoa: any[] = [];
  listTrangThai: any[] = [
    { ma: this.STATUS.DU_THAO, giaTri: 'Dự thảo' },
    { ma: this.STATUS.CHO_DUYET_LDV, giaTri: 'Chờ duyệt - LĐ Vụ' },
    { ma: this.STATUS.TU_CHOI_LDV, giaTri: 'Từ chối - LĐ Vụ' },
    { ma: this.STATUS.CHO_DUYET_LDTC, giaTri: 'Chờ duyệt - LĐ Tổng cục' },
    { ma: this.STATUS.TU_CHOI_LDTC, giaTri: 'Từ chối - LĐ Tổng cục' },
    { ma: this.STATUS.BAN_HANH, giaTri: 'Ban hành' },
  ];
  idHoSo: number = 0;
  openHoSo = false;

  constructor(httpClient: HttpClient,
              storageService: StorageService,
              notification: NzNotificationService,
              spinner: NgxSpinnerService,
              modal: NzModalService,
              private quyetDinhTieuHuyService: QuyetDinhTieuHuyService,
              private danhMucService: DanhMucService,
              private xuatTieuHuyComponent: XuatTieuHuyComponent,

  ) {
    super(httpClient, storageService, notification, spinner, modal, quyetDinhTieuHuyService);
    this.vldTrangThai = this.xuatTieuHuyComponent;
    this.formData = this.fb.group({
      nam: [''],
      soQd: [''],
      soHoSo: [''],
      maDvi: [''],
      ngayKy: [''],
      ngayKyTu: [''],
      ngayKyDen: [''],
      loaiVthh: [''],
      trichYeu: [''],
      trangThai: [''],
    });
    this.filterTable = {
      soQd: '',
      trichYeu: '',
      ngayKy: '',
      soHoSo: '',
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
    this.selectedId = id;
    this.isDetail = true;
    this.isView = b;
    // this.isViewDetail = isView ?? false;
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



  openHoSoModal(id: any) {
    this.idHoSo = id;
    this.openHoSo = true;
  }

  closeHoSoModal() {
    this.idHoSo = null;
    this.openHoSo = false;
  }
}
