import {Component, Input, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {StorageService} from "src/app/services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {DanhMucService} from "src/app/services/danhmuc.service";
import {Base2Component} from "src/app/components/base2/base2.component";
import {CHUC_NANG} from 'src/app/constants/status';
import {XuatThanhLyComponent} from "src/app/pages/xuat/xuat-thanh-ly/xuat-thanh-ly.component";
import {HoSoThanhLyService} from "src/app/services/qlnv-hang/xuat-hang/xuat-thanh-ly/HoSoThanhLy.service";
import dayjs from "dayjs";
import {MESSAGE} from "src/app/constants/message";

@Component({
  selector: 'app-ho-so-thanh-ly',
  templateUrl: './ho-so-thanh-ly.component.html',
  styleUrls: ['./ho-so-thanh-ly.component.scss']
})
export class HoSoThanhLyComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string;
  isDetail: boolean = false;
  selectedId: number = 0;
  isView = false;
  CHUC_NANG = CHUC_NANG;
  public vldTrangThai: XuatThanhLyComponent;
  listHangHoaAll: any[] = [];
  listLoaiHangHoa: any[] = [];
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
  idQd: number = 0;
  openQd = false;
  idTb: number = 0;
  openTb = false;

  constructor(httpClient: HttpClient,
              storageService: StorageService,
              notification: NzNotificationService,
              spinner: NgxSpinnerService,
              modal: NzModalService,
              private hoSoThanhLyService: HoSoThanhLyService,
              private danhMucService: DanhMucService,
              private xuatThanhLyComponent: XuatThanhLyComponent
  ) {

    super(httpClient, storageService, notification, spinner, modal, hoSoThanhLyService);
    this.vldTrangThai = this.xuatThanhLyComponent;
    this.formData = this.fb.group({
      soHoSo: [''],
      soQd: [''],
      soTb: [''],
      trangThai: [''],
      ngayDuyetLan1: [''],
      ngayDuyetLan1Tu: [''],
      ngayDuyetLan1Den: ['']
    });
    this.filterTable = {
      soHoSo: '',
      trichYeu: '',
      ngayDuyetLan1: '',
      ngayDuyetLan2: '',
      ngayDuyetLan3: '',
      soQd: '',
      soTb: '',
      tenTrangThai: '',
    };
  }

  async ngOnInit() {
    await this.spinner.show();
    try {
      await Promise.all([
        this.timKiem(),
      ])
    } catch (e) {
      console.log('error: ', e);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();

    }
  }

  async timKiem() {
    await this.spinner.show();
    try {
      if (this.formData.value.ngayDuyetLan1) {
        this.formData.value.ngayDuyetLan1Tu = dayjs(this.formData.value.ngayDuyetLan1[0]).format('YYYY-MM-DD')
        this.formData.value.ngayDuyetLan1Den = dayjs(this.formData.value.ngayDuyetLan1[1]).format('YYYY-MM-DD')
      }
      await this.search();
    } catch (e) {
      console.log(e)
    } finally {
      await this.spinner.hide();
    }
  }

  disabledNgayDuyetLan1Tu = (startValue: Date): boolean => {
    if (startValue && this.formData.value.disabledNgayDuyetLan1Den) {
      return startValue.getTime() > this.formData.value.disabledNgayDuyetLan1Den.getTime();
    }
    return false;
  }

  disabledNgayDuyetLan1Den = (endValue: Date): boolean => {
    if (!endValue || !this.formData.value.disabledNgayDuyetLan1Tu) {
      return false;
    }
    return endValue.getTime() <= this.formData.value.disabledNgayDuyetLan1Tu.getTime();
  }

  redirectDetail(id, b: boolean) {
    this.selectedId = id;
    this.isDetail = true;
    this.isView = b;
  }

  openQdModal(id: any) {
    this.idQd = id;
    this.openQd = true;
  }

  closeQdModal() {
    this.idQd = null;
    this.openQd = false;
  }
  openTbModal(id: any) {
    this.idTb = id;
    this.openTb = true;
  }

  closeTbModal() {
    this.idTb = null;
    this.openTb = false;
  }


}
