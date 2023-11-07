import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CuuTroVienTroComponent } from "src/app/pages/xuat/xuat-cuu-tro-vien-tro/xuat-cuu-tro/cuu-tro-vien-tro.component";
import { HttpClient } from "@angular/common/http";
import { StorageService } from "src/app/services/storage.service";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NgxSpinnerService } from "ngx-spinner";
import { NzModalService } from "ng-zorro-antd/modal";
import { DonviService } from "src/app/services/donvi.service";
import {
  TongHopPhuongAnCuuTroService
} from "src/app/services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/TongHopPhuongAnCuuTro.service";
import { UserLogin } from "src/app/models/userlogin";
import { MESSAGE } from "src/app/constants/message";
import { Base2Component } from "src/app/components/base2/base2.component";
import { CHUC_NANG } from "src/app/constants/status";
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-tong-hop',
  templateUrl: './tong-hop.component.html',
  styleUrls: ['./tong-hop.component.scss']
})
export class TongHopComponent extends Base2Component implements OnInit {


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
    { ma: this.STATUS.DU_THAO, giaTri: 'Dự thảo' },
    { ma: this.STATUS.CHO_DUYET_LDV, giaTri: 'Chờ duyệt - LĐ Vụ' },
    { ma: this.STATUS.TU_CHOI_LDV, giaTri: 'Từ chối - LĐ Vụ' },
    { ma: this.STATUS.DA_DUYET_LDV, giaTri: 'Đã duyệt - CĐ Vụ' },
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
    private cdr: ChangeDetectorRef,
    private dataService: DataService
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
      ngayTaoTu: null,
      ngayTaoDen: null,
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
  isVatTu: boolean = false;


  async ngOnInit() {
    try {
      await this.search();
    } catch (e) {
      console.log('error: ', e)
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  redirectDetail(id, b: boolean) {
    this.idSelected = id;
    this.isDetail = true;
    this.isView = b;
  }

  taoQuyetDinh(data) {
    this.eventTaoQd.emit(data);
  }
  taoQuyetDinhPdPa(data) {
    const dataSend = {
      ...data,
      type: "TH",
      isTaoQdPdPa: true
    }
    this.dataService.changeData(dataSend);
    this.eventTaoQd.emit(2);
  }
  openModalQdPd(id: number) {
    this.idQdPd = id;
    this.isViewQdPd = true;
  }

  closeModalQdPd() {
    this.idQdPd = null;
    this.isViewQdPd = false;
  }

  disabledStartNgayTao = (startValue: Date): boolean => {
    if (startValue && this.formData.value.ngayTaoDen) {
      return startValue.getTime() > this.formData.value.ngayTaoDen.getTime();
    }
    return false;
  };

  disabledEndNgayTao = (endValue: Date): boolean => {
    if (!endValue || !this.formData.value.ngayTaoTu) {
      return false;
    }
    return endValue.getTime() <= this.formData.value.ngayTaoTu.getTime();
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
