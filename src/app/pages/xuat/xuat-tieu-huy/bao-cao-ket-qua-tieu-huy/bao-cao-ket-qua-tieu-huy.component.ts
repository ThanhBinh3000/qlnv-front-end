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
import {BaoCaoKqTieuHuyService} from "../../../../services/qlnv-hang/xuat-hang/xuat-tieu-huy/BaoCaoKqTieuHuy.service";

@Component({
  selector: 'app-bao-cao-ket-qua-tieu-huy',
  templateUrl: './bao-cao-ket-qua-tieu-huy.component.html',
  styleUrls: ['./bao-cao-ket-qua-tieu-huy.component.scss']
})
export class BaoCaoKetQuaTieuHuyComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string;
  isDetail: boolean = false;
  selectedId: number = 0;
  isView = false;
  CHUC_NANG = CHUC_NANG;
  public vldTrangThai: XuatTieuHuyComponent;
  listHangHoaAll: any[] = [];
  listLoaiHangHoa: any[] = [];
  listTrangThai: any[] = [
    {ma: this.STATUS.DU_THAO, giaTri: 'Dự thảo'},
    {ma: this.STATUS.CHO_DUYET_TP, giaTri: 'Chờ duyệt - LĐ Vụ'},
    {ma: this.STATUS.TU_CHOI_TP, giaTri: 'Từ chối - LĐ Vụ'},
    {ma: this.STATUS.CHO_DUYET_LDC, giaTri: 'Chờ duyệt - LĐ TC'},
    {ma: this.STATUS.TU_CHOI_LDC, giaTri: 'Từ chối - LĐ TC'},
    {ma: this.STATUS.DA_DUYET_LDC, giaTri: 'Ban hành'},
  ];
  idHoSo: number = 0;
  openHoSo = false;

  constructor(httpClient: HttpClient,
              storageService: StorageService,
              notification: NzNotificationService,
              spinner: NgxSpinnerService,
              modal: NzModalService,
              private baoCaoKqTieuHuyService: BaoCaoKqTieuHuyService,
              private danhMucService: DanhMucService,
              private xuatTieuHuyComponent: XuatTieuHuyComponent,

  ) {
    super(httpClient, storageService, notification, spinner, modal, baoCaoKqTieuHuyService);
    this.vldTrangThai = this.xuatTieuHuyComponent;
    this.formData = this.fb.group({
      nam: [''],
      soQd: [''],
      soBaoCao: [''],
      maDvi: [''],
      ngayBaoCao: [''],
      ngayBaoCaoTu: [''],
      ngayBaoCaoDen: [''],
      loaiVthh: [''],
      trichYeu: [''],
      trangThai: [''],
    });
    this.filterTable = {
      soQd: '',
      trichYeu: '',
      ngayBaoCao: '',
      soHoSo: '',
      tenTrangThai: '',
      tenTrangThaiXh: '',

    };
  }
  disabledStartngayBaoCao = (startValue: Date): boolean => {
    if (startValue && this.formData.value.ngayBaoCaoDen) {
      return startValue.getTime() > this.formData.value.ngayBaoCaoDen.getTime();
    }
    return false;
  };

  disabledEndngayBaoCao = (endValue: Date): boolean => {
    if (!endValue || !this.formData.value.ngayBaoCaoTu) {
      return false;
    }
    return endValue.getTime() <= this.formData.value.ngayBaoCaoTu.getTime();
  };
  async ngOnInit() {
    await this.spinner.show();
    try {
      await Promise.all([
        this.timKiem(),
        this.loadDsVthh(),
      ])
      await this.spinner.hide();
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
      if (this.formData.value.ngayBaoCao) {
        this.formData.value.ngayBaoCaoTu = dayjs(this.formData.value.ngayBaoCao[0]).format('YYYY-MM-DD')
        this.formData.value.ngayBaoCaoDen = dayjs(this.formData.value.ngayBaoCao[1]).format('YYYY-MM-DD')
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
