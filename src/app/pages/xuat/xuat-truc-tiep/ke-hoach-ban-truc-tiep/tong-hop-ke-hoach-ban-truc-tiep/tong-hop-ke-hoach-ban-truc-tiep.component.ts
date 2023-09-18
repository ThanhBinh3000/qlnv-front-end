import {Component, Input, OnInit} from '@angular/core';
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
import {XuatTrucTiepComponent} from "../../xuat-truc-tiep.component";
import {CHUC_NANG} from "../../../../../constants/status";
import {LOAI_HANG_DTQG} from "../../../../../constants/config";
import {DanhMucService} from "../../../../../services/danhmuc.service";

@Component({
  selector: 'app-tong-hop-ke-hoach-ban-truc-tiep',
  templateUrl: './tong-hop-ke-hoach-ban-truc-tiep.component.html',
  styleUrls: ['./tong-hop-ke-hoach-ban-truc-tiep.component.scss']
})

export class TongHopKeHoachBanTrucTiepComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string;
  @Input() listVthh: any[] = [];
  CHUC_NANG = CHUC_NANG;
  public vldTrangThai: XuatTrucTiepComponent
  isView = false;
  idQdPd: number = 0;
  isViewQdPd: boolean = false;
  isQuyetDinh: boolean = false;
  listLoaiHangHoa: any[] = [];
  dataTongHop: any;
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
    private tongHopKhBanTrucTiepService: TongHopKhBanTrucTiepService,
    private xuatTrucTiepComponent: XuatTrucTiepComponent,
  ) {
    super(httpClient, storageService, notification, spinner, modal, tongHopKhBanTrucTiepService);
    this.vldTrangThai = this.xuatTrucTiepComponent;
    this.formData = this.fb.group({
      namKh: null,
      loaiVthh: null,
      noiDungThop: null,
      ngayThopTu: null,
      ngayThopDen: null,
    })
  }

  filterTable: any = {
    namKh: '',
    id: '',
    ngayTao: '',
    noiDungThop: '',
    soQdPd: '',
    tenLoaiVthh: '',
    tenCloaiVthh: '',
    tenTrangThai: '',
  }

  async ngOnInit() {
    try {
      await this.spinner.show();
      await Promise.all([this.timKiem(), this.search()]);
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

  async timKiem() {
    this.formData.patchValue({
      loaiVthh: this.loaiVthh,
    });
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
      this.listLoaiHangHoa = res.data?.filter(x => x.ma.length === 4) || [];
    }
  }

  async taoQdinh(data: number) {
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

