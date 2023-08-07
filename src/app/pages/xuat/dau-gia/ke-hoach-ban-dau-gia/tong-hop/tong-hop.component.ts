import {Component, Input, OnInit} from '@angular/core';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NgxSpinnerService} from 'ngx-spinner';
import {MESSAGE} from 'src/app/constants/message';
import {NzModalService} from 'ng-zorro-antd/modal';
import {
  TongHopDeXuatKeHoachBanDauGiaService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/de-xuat-kh-bdg/tongHopDeXuatKeHoachBanDauGia.service';
import {Base2Component} from 'src/app/components/base2/base2.component';
import {HttpClient} from '@angular/common/http';
import {StorageService} from 'src/app/services/storage.service';
import {DanhMucService} from 'src/app/services/danhmuc.service';
import {LOAI_HANG_DTQG} from 'src/app/constants/config';
import {DauGiaComponent} from "../../dau-gia.component";
import {CHUC_NANG} from "../../../../../constants/status";

@Component({
  selector: 'app-tong-hop',
  templateUrl: './tong-hop.component.html',
  styleUrls: ['./tong-hop.component.scss']
})
export class TongHopComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string;
  @Input()
  listVthh: any[] = [];
  CHUC_NANG = CHUC_NANG;
  public vldTrangThai: DauGiaComponent;
  isView = false;
  listLoaiHangHoa: any[] = [];
  dataTongHop: any;
  isQuyetDinh: boolean = false;
  idQdPd: number = 0;
  isViewQdPd: boolean = false;

  listTrangThai: any[] = [
    {ma: this.STATUS.CHUA_TAO_QD, giaTri: 'Chưa Tạo QĐ'},
    {ma: this.STATUS.DA_DU_THAO_QD, giaTri: 'Đã Dự Thảo QĐ'},
    {ma: this.STATUS.DA_BAN_HANH_QD, giaTri: 'Đã Ban Hành QĐ'},
  ];

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private danhMucService: DanhMucService,
    private tongHopDeXuatKeHoachBanDauGiaService: TongHopDeXuatKeHoachBanDauGiaService,
    private dauGiaComponent: DauGiaComponent,
  ) {
    super(httpClient, storageService, notification, spinner, modal, tongHopDeXuatKeHoachBanDauGiaService);
    this.vldTrangThai = this.dauGiaComponent;
    this.formData = this.fb.group({
      namKh: '',
      loaiVthh: '',
      noiDungThop: '',
      ngayThopTu: '',
      ngayThopDen: '',
    })
  }

  filterTable: any = {
    id: '',
    ngayTao: '',
    noiDungThop: '',
    namKh: '',
    soQdPd: '',
    tenLoaiVthh: '',
    tenTrangThai: '',
  }

  async ngOnInit() {
    this.spinner.show();
    try {
      this.timKiem();
      await this.search();
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e)
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  redirectDetail(id, isView: boolean) {
    this.idSelected = id;
    this.isDetail = true;
    this.isView = isView;
  }

  timKiem() {
    this.formData.patchValue({
      loaiVthh: this.loaiVthh,
    })
    if (this.loaiVthh.startsWith(LOAI_HANG_DTQG.VAT_TU)) {
      this.loadDsVthh();
    }
  }

  clearFilter() {
    this.formData.reset();
    this.timKiem();
    this.search();
  }

  async loadDsVthh() {
    let res = await this.danhMucService.getDanhMucHangDvqlAsyn({});
    if (res.msg == MESSAGE.SUCCESS) {
      this.listLoaiHangHoa = res.data?.filter((x) => x.ma.length == 4);
    }
  }

  taoQdinh(data: number) {
    let elem = document.getElementById('mainTongCuc');
    let tabActive = elem.getElementsByClassName('ant-menu-item')[0];
    tabActive.classList.remove('ant-menu-item-selected')
    let setActive = elem.getElementsByClassName('ant-menu-item')[2];
    setActive.classList.add('ant-menu-item-selected');
    this.isQuyetDinh = true;
    this.dataTongHop = data;
  }

  async showTongHop() {
    let elem = document.getElementById('mainTongCuc');
    let tabActive = elem.getElementsByClassName('ant-menu-item')[2];
    tabActive.classList.remove('ant-menu-item-selected')
    let setActive = elem.getElementsByClassName('ant-menu-item')[0];
    setActive.classList.add('ant-menu-item-selected');
    this.isQuyetDinh = false;
    await this.search();
  }

  openModalQdPd(id: number) {
    this.idQdPd = id;
    this.isViewQdPd = true;
  }

  closeModalQdPd() {
    this.idQdPd = null;
    this.isViewQdPd = false;
  }

  disabledNgayThopTu = (startValue: Date): boolean => {
    if (!startValue || !this.formData.value.ngayThopDen) {
      return false;
    }
    return startValue.getTime() > this.formData.value.ngayThopDen.getTime();
  };

  disabledNgayThopDen = (endValue: Date): boolean => {
    if (!endValue || !this.formData.value.ngayThopTu) {
      return false;
    }
    return endValue.getTime() <= this.formData.value.ngayThopTu.getTime();
  };
}
