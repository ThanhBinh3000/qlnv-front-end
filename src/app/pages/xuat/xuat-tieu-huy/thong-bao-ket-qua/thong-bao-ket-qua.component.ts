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
  ThongBaoKqTieuHuyService
} from "../../../../services/qlnv-hang/xuat-hang/xuat-tieu-huy/ThongBaoKqTieuHuy.service";

@Component({
  selector: 'app-th-thong-bao-ket-qua',
  templateUrl: './thong-bao-ket-qua.component.html',
  styleUrls: ['./thong-bao-ket-qua.component.scss']
})
export class ThongBaoKetQuaComponent extends Base2Component implements OnInit {
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
    { ma: this.STATUS.DA_HOAN_THANH, giaTri: 'Đã hoàn thành' },
  ];
  idHoSo: number = 0;
  openHoSo = false;

  constructor(httpClient: HttpClient,
              storageService: StorageService,
              notification: NzNotificationService,
              spinner: NgxSpinnerService,
              modal: NzModalService,
              private thongBaoKqTieuHuyService: ThongBaoKqTieuHuyService,
              private danhMucService: DanhMucService,
              private xuatThanhLyComponent: XuatTieuHuyComponent,

  ) {
    super(httpClient, storageService, notification, spinner, modal, thongBaoKqTieuHuyService);
    this.vldTrangThai = this.xuatThanhLyComponent;
    this.formData = this.fb.group({
      nam: [''],
      soThongBao: [''],
      soHoSo: [''],
      maDvi: [''],
      ngayPduyet: [''],
      ngayPduyetTu: [''],
      ngayPduyetDen: [''],
      loaiVthh: [''],
      trichYeu: [''],
      trangThai: [''],
    });
    this.filterTable = {
      soThongBao: '',
      noiDung: '',
      ngayPduyet: '',
      soHoSo: '',
      tenTrangThai: '',
      tenTrangThaiXh: '',

    };
  }
  disabledStartngayPduyet = (startValue: Date): boolean => {
    if (startValue && this.formData.value.ngayPduyetDen) {
      return startValue.getTime() > this.formData.value.ngayPduyetDen.getTime();
    }
    return false;
  };

  disabledEndngayPduyet = (endValue: Date): boolean => {
    if (!endValue || !this.formData.value.ngayPduyetTu) {
      return false;
    }
    return endValue.getTime() <= this.formData.value.ngayPduyetTu.getTime();
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
      if (this.formData.value.ngayPduyet) {
        this.formData.value.ngayPduyetTu = dayjs(this.formData.value.ngayPduyet[0]).format('YYYY-MM-DD')
        this.formData.value.ngayPduyetDen = dayjs(this.formData.value.ngayPduyet[1]).format('YYYY-MM-DD')
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
