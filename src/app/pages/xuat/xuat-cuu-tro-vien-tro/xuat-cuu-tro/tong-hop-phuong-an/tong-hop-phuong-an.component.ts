import {ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import dayjs from 'dayjs';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NgxSpinnerService} from 'ngx-spinner';
import {MESSAGE} from 'src/app/constants/message';
import {UserLogin} from 'src/app/models/userlogin';
import {DonviService} from 'src/app/services/donvi.service';
import {
  TongHopPhuongAnCuuTroService
} from "src/app/services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/TongHopPhuongAnCuuTro.service";
import {CHUC_NANG, STATUS} from "src/app/constants/status";
import {Base2Component} from 'src/app/components/base2/base2.component';
import {HttpClient} from '@angular/common/http';
import {StorageService} from 'src/app/services/storage.service';
import {isEmpty} from 'lodash';
import {CuuTroVienTroComponent} from "../cuu-tro-vien-tro.component";

@Component({
  selector: 'app-tong-hop-phuong-an',
  templateUrl: './tong-hop-phuong-an.component.html',
  styleUrls: ['./tong-hop-phuong-an.component.scss']
})
export class TongHopPhuongAnComponent extends Base2Component implements OnInit {

  @Input()
  loaiVthh: string;
  @Input()
  loaiVthhCache: string;
  @Input() isView = false;
  @Output() eventTaoQd: EventEmitter<any> = new EventEmitter<any>();
  public vldTrangThai: CuuTroVienTroComponent;
  CHUC_NANG = CHUC_NANG;
  idQdPd: number = 0;
  isViewQdPd: boolean = false;
  listTrangThai: any[] = [
    {ma: this.STATUS.DU_THAO, giaTri: 'Dự thảo'},
    {ma: this.STATUS.CHO_DUYET_LDV, giaTri: 'Chờ duyệt - LĐ Vụ'},
    {ma: this.STATUS.TU_CHOI_LDV, giaTri: 'Từ chối - LĐ Vụ'},
    {ma: this.STATUS.DA_DUYET_LDV, giaTri: 'Đã duyệt - CĐ Vụ'},
  ];

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private donviService: DonviService,
    private tongHopPhuongAnCuuTroService: TongHopPhuongAnCuuTroService,
    private cuuTroVienTroComponent: CuuTroVienTroComponent,
    private el: ElementRef,
    private cdr: ChangeDetectorRef
  ) {
    super(httpClient, storageService, notification, spinner, modal, tongHopPhuongAnCuuTroService);
    this.vldTrangThai = cuuTroVienTroComponent;
    this.formData = this.fb.group({
      nam: null,
      soDx: null,
      tenDvi: null,
      maDvi: null,
      ngayDx: null,
      ngayDxTu: null,
      ngayDxDen: null,
      ngayKetThucDx: null,
      ngayKetThucDxTu: null,
      ngayKetThucDxDen: null,
      type: null
    })
    this.filterTable = {
      nam: '',
      maTongHop: '',
      ngayThop: '',
      soQdPd: '',
      ngayKyQd: '',
      tenLoaiVthh: '',
      tongSlCtVt: '',
      tongSlXuatCap: '',
      noiDungThop: '',
      tenTrangThai: '',
    };
  }

  dsDonvi: any[] = [];
  userInfo: UserLogin;
  userdetail: any = {};
  selectedId: number = 0;
  isVatTu: boolean = false;


  async ngOnInit() {
    try {
      this.initData()
      await this.timKiem();
    } catch (e) {
      console.log('error: ', e)
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  async initData() {
    this.userInfo = this.userService.getUserLogin();
    this.userdetail.maDvi = this.userInfo.MA_DVI;
    this.userdetail.tenDvi = this.userInfo.TEN_DVI;
    await this.loadDsTong();
  }

  async loadDsTong() {
    /*const body = {
      maDviCha: this.userdetail.maDvi,
      trangThai: '01',
    };*/
    const dsTong = await this.donviService.layDonViCon();
    if (!isEmpty(dsTong)) {
      this.dsDonvi = dsTong.data;
    }
  }

  async timKiem() {
    if (this.formData.value.ngayDx) {
      this.formData.value.ngayDxTu = dayjs(this.formData.value.ngayDx[0]).format('YYYY-MM-DD')
      this.formData.value.ngayDxDen = dayjs(this.formData.value.ngayDx[1]).format('YYYY-MM-DD')
    }
    if (this.formData.value.ngayKetThucDx) {
      this.formData.value.ngayKetThucDxTu = dayjs(this.formData.value.ngayKetThucDx[0]).format('YYYY-MM-DD')
      this.formData.value.ngayKetThucDxDen = dayjs(this.formData.value.ngayKetThucDx[1]).format('YYYY-MM-DD')
    }
    await this.search();
  }

  redirectDetail(id, b: boolean) {
    this.selectedId = id;
    this.isDetail = true;
    this.isView = b;
    // this.isViewDetail = isView ?? false;
  }

  taoQuyetDinh(data) {
    this.eventTaoQd.emit(data);
  }

  openModalQdPd(id: number) {
    this.idQdPd = id;
    this.isViewQdPd = true;
  }

  closeModalQdPd() {
    this.idQdPd = null;
    this.isViewQdPd = false;
  }

  disabledStartNgayKt = (startValue: Date): boolean => {
    if (startValue && this.formData.value.ngayKetThucDxDen) {
      return startValue.getTime() > this.formData.value.ngayKetThucDxDen.getTime();
    }
    return false;
  };

  disabledEndNgayKt = (endValue: Date): boolean => {
    if (!endValue || !this.formData.value.ngayKetThucDxTu) {
      return false;
    }
    return endValue.getTime() <= this.formData.value.ngayKetThucDxTu.getTime();
  };

  disabledStartNgayDx = (startValue: Date): boolean => {
    if (startValue && this.formData.value.ngayDxDen) {
      return startValue.getTime() > this.formData.value.ngayDxDen.getTime();
    }
    return false;
  };

  disabledEndNgayDx = (endValue: Date): boolean => {
    if (!endValue || !this.formData.value.ngayDxTu) {
      return false;
    }
    return endValue.getTime() <= this.formData.value.ngayDxTu.getTime();
  };
}
