import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NgxSpinnerService} from 'ngx-spinner';
import {MESSAGE} from 'src/app/constants/message';
import {NzModalService} from 'ng-zorro-antd/modal';
import {Base2Component} from 'src/app/components/base2/base2.component';
import {HttpClient} from '@angular/common/http';
import {StorageService} from 'src/app/services/storage.service';
import {
  TongHopKhBanTrucTiepService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/de-xuat-kh-btt/tong-hop-kh-ban-truc-tiep.service';
import {LOAI_HANG_DTQG} from 'src/app/constants/config';
import {DanhMucService} from "../../../../../services/danhmuc.service";
import {DataService} from "../../../../../services/data.service";

@Component({
  selector: 'app-tong-hop-ke-hoach-ban-truc-tiep',
  templateUrl: './tong-hop-ke-hoach-ban-truc-tiep.component.html',
  styleUrls: ['./tong-hop-ke-hoach-ban-truc-tiep.component.scss']
})

export class TongHopKeHoachBanTrucTiepComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string;
  @Input() listVthh: any[] = [];
  @Output() eventTaoQd: EventEmitter<any> = new EventEmitter<any>();
  LOAI_HANG_DTQG = LOAI_HANG_DTQG;
  isView = false;
  idQdPd: number = 0;
  isViewQdPd: boolean = false;
  listLoaiHangHoa: any[] = [];
  listTrangThai: any = [];

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private danhMucService: DanhMucService,
    private dataService: DataService,
    private tongHopKhBanTrucTiepService: TongHopKhBanTrucTiepService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, tongHopKhBanTrucTiepService);
    this.formData = this.fb.group({
      namKh: null,
      loaiVthh: null,
      noiDungThop: null,
      ngayThopTu: null,
      ngayThopDen: null,
    })
    this.filterTable = {
      namKh: null,
      id: null,
      ngayTao: null,
      noiDungThop: null,
      soQdPd: null,
      tenLoaiVthh: null,
      tenCloaiVthh: null,
      tenTrangThai: null,
    }
    this.listTrangThai = [
      {
        value: this.STATUS.CHUA_TAO_QD,
        text: 'Chưa Tạo QĐ'
      },
      {
        value: this.STATUS.DA_DU_THAO_QD,
        text: 'Đã Dự Thảo QĐ'
      },
      {
        value: this.STATUS.DA_BAN_HANH_QD,
        text: 'Đã Ban Hành QĐ'
      },
    ]
  }

  async ngOnInit() {
    try {
      await this.spinner.show();
      this.formData.patchValue({
        loaiVthh: this.loaiVthh,
      })
      await this.search()
      if (this.loaiVthh.startsWith(LOAI_HANG_DTQG.VAT_TU)) {
        await this.loadDsVthh();
      }
    } catch (e) {
      console.log('error: ', e);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
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

  taoQuyetDinh(data) {
    this.eventTaoQd.emit(data);
  }

  taoQuyetDinhPd(data) {
    const dataSend = {
      ...data,
      isQuyetDinh: true
    }
    this.dataService.changeData(dataSend);
    this.eventTaoQd.emit(2);
  }

  disabledNgayThopTu = (startValue: Date): boolean => {
    if (!startValue || !this.formData.value.ngayThopDen) {
      return false;
    }
    const startDay = new Date(startValue.getFullYear(), startValue.getMonth(), startValue.getDate());
    const endDay = new Date(this.formData.value.ngayThopDen.getFullYear(), this.formData.value.ngayThopDen.getMonth(), this.formData.value.ngayThopDen.getDate());
    return startDay > endDay;
  };

  disabledNgayThopDen = (endValue: Date): boolean => {
    if (!endValue || !this.formData.value.ngayThopTu) {
      return false;
    }
    const endDay = new Date(endValue.getFullYear(), endValue.getMonth(), endValue.getDate());
    const startDay = new Date(this.formData.value.ngayThopTu.getFullYear(), this.formData.value.ngayThopTu.getMonth(), this.formData.value.ngayThopTu.getDate());
    return endDay < startDay;
  };

  openModalQdPd(id: number) {
    this.updateQdPd(id, true);
  }

  closeModalQdPd() {
    this.updateQdPd(null, false);
  }

  private updateQdPd(id: number | null, isView: boolean) {
    this.idQdPd = id;
    this.isViewQdPd = isView;
  }
}
