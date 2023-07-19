import {Component, Input, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {StorageService} from "src/app/services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {MESSAGE} from 'src/app/constants/message';
import {DanhMucService} from 'src/app/services/danhmuc.service';
import {Base2Component} from 'src/app/components/base2/base2.component';
import {
  QuyetDinhPheDuyetKetQuaService
} from "src/app/services/qlnv-hang/xuat-hang/xuat-thanh-ly/QuyetDinhPheDuyetKetQua.service";
import {XuatThanhLyComponent} from "src/app/pages/xuat/xuat-thanh-ly/xuat-thanh-ly.component";
import {CHUC_NANG} from "src/app/constants/status";
import dayjs from "dayjs";

@Component({
  selector: 'app-quyet-dinh-phe-duyet-kq-bdg-thanh-ly',
  templateUrl: './quyet-dinh-phe-duyet-kq-bdg-thanh-ly.component.html',
  styleUrls: ['./quyet-dinh-phe-duyet-kq-bdg-thanh-ly.component.scss']
})
export class QuyetDinhPheDuyetKqBdgThanhLyComponent extends Base2Component implements OnInit {
  @Input()
  loaiVthh: string;
  @Input()
  typeLoaiVthh: any[] = [];
  id:any=[];
  listVthh: any[] = [];
  listCloaiVthh: any[] = [];
  idQdPd: number = 0;
  isViewQdPd: boolean = false;
  idThongTin: number = 0;
  isViewThongTin: boolean = false;
  isDetail: boolean = false;
  selectedId: number = 0;
  isEdit = false;
  listTrangThai: any[] = [
    {ma: this.STATUS.DU_THAO, giaTri: 'Dự thảo'},
    {ma: this.STATUS.TU_CHOI_TP, giaTri: 'Từ chối - TP'},
    {ma: this.STATUS.CHO_DUYET_TP, giaTri: 'Chờ duyệt - TP'},
    {ma: this.STATUS.CHO_DUYET_LDC, giaTri: 'Chờ duyệt - LĐ Cục'},
    {ma: this.STATUS.TU_CHOI_LDC, giaTri: 'Từ chối - LĐ Cục'},
    {ma: this.STATUS.DA_DUYET_LDC, giaTri: 'Đã duyệt - LĐ Cục'},
    {ma: this.STATUS.BAN_HANH, giaTri: 'Ban Hành'},
  ];
  CHUC_NANG = CHUC_NANG;
  public vldTrangThai: XuatThanhLyComponent;

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private danhMucService: DanhMucService,
    private xuatThanhLyComponent: XuatThanhLyComponent,
    private quyetDinhPheDuyetKetQuaService: QuyetDinhPheDuyetKetQuaService
  ) {
    super(httpClient, storageService, notification, spinner, modal, quyetDinhPheDuyetKetQuaService);
    this.vldTrangThai = this.xuatThanhLyComponent;
    this.formData = this.fb.group({
      nam: [null],
      soQd: [null],
      trichYeu: [null],
      ngayKyTu: [null],
      ngayKyDen: [null],
      maDvi: [null]
    });
    this.filterTable = {
      nam: '',
      soQd: '',
      ngayKy: '',
      trichYeu: '',
      ngayToChuc: '',
      soQdThanhLy: '',
      maThongBao: '',
      hthucDauGia: '',
      pthucDauGia: '',
      soTbKhongThanh: '',
      soBienBan: '',
      tenTrangThai: '',
    };
  }

  async ngOnInit() {
    await this.spinner.show();
    try {
      await this.timKiem()
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
      if (this.formData.value.ngayKy) {
        this.formData.value.ngayKyTu = dayjs(this.formData.value.ngayKy[0]).format('YYYY-MM-DD')
        this.formData.value.ngayKyDen = dayjs(this.formData.value.ngayKy[1]).format('YYYY-MM-DD')
      }
      await this.search();
    } catch (e) {
      console.log(e)
    } finally {
      await this.spinner.hide();
    }

  }

  clearFilter() {
    this.formData.reset();
    this.timKiem();
    this.search();
  }

  redirectDetail(id, isEdit: boolean) {
    this.selectedId = id;
    this.isDetail = true;
    this.isEdit = isEdit;
  }

  disabledNgayKyTu = (startValue: Date): boolean => {
    if (!startValue || !this.formData.value.ngayKyDen) {
      return false;
    }
    return startValue.getTime() > this.formData.value.ngayKyDen.getTime();
  };

  disabledNgayKyDen = (endValue: Date): boolean => {
    if (!endValue || !this.formData.value.ngayKyTu) {
      return false;
    }
    return endValue.getTime() <= this.formData.value.ngayKyTu.getTime();
  };

  openModalQdPd(id: number) {
    this.idQdPd = id;
    this.isViewQdPd = true;
  }

  closeModalQdPd() {
    this.idQdPd = null;
    this.isViewQdPd = false;
  }

  openModalMaThongBao(id: number) {
    this.idThongTin = id;
    this.isViewThongTin = true;
  }

  closeModalMaThongBao() {
    this.idThongTin = null;
    this.isViewThongTin = false;
  }
}
