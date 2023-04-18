import {Component, Input, OnInit} from '@angular/core';
import dayjs from 'dayjs';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NgxSpinnerService} from 'ngx-spinner';
import {MESSAGE} from 'src/app/constants/message';
import {UserLogin} from 'src/app/models/userlogin';
import {
  DeXuatPhuongAnCuuTroService
} from "src/app/services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/DeXuatPhuongAnCuuTro.service";
import {HttpClient} from '@angular/common/http';
import {StorageService} from 'src/app/services/storage.service';
import {Base2Component} from 'src/app/components/base2/base2.component';
import {DonviService} from 'src/app/services/donvi.service';
import {CHUC_NANG} from 'src/app/constants/status';
import {DanhMucService} from 'src/app/services/danhmuc.service';
import {Validators} from "@angular/forms";

@Component({
  selector: 'app-ke-hoach-dieu-chuyen',
  templateUrl: './ke-hoach-dieu-chuyen.component.html',
  styleUrls: ['./ke-hoach-dieu-chuyen.component.scss']
})
export class KeHoachDieuChuyenComponent extends Base2Component implements OnInit {

  @Input()
  loaiVthh: string;
  @Input()
  loaiVthhCache: string;
  CHUC_NANG = CHUC_NANG;
  listLoaiHangHoa: any[] = [];
  listHangHoaAll: any[] = [];
  listChungLoaiHangHoa: any[] = [];
  listTrangThai: any[] = [
    {ma: this.STATUS.DU_THAO, giaTri: 'Dự thảo'},
    {ma: this.STATUS.CHO_DUYET_TP, giaTri: 'Chờ duyệt - TP'},
    {ma: this.STATUS.TU_CHOI_TP, giaTri: 'Từ chối - TP'},
    {ma: this.STATUS.CHO_DUYET_LDC, giaTri: 'Chờ duyệt - LĐ Cục'},
    {ma: this.STATUS.TU_CHOI_LDC, giaTri: 'Từ chối - LĐ Cục'},
    {ma: this.STATUS.DA_DUYET_LDC, giaTri: 'Đã duyệt - LĐ Cục'},
    {ma: this.STATUS.DA_TAO_CBV, giaTri: 'Đã tạo - CB Vụ'},
  ];

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private donviService: DonviService,
    private danhMucService: DanhMucService,
    private deXuatPhuongAnCuuTroService: DeXuatPhuongAnCuuTroService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, deXuatPhuongAnCuuTroService);
    this.formData = this.fb.group({
      nam: [dayjs().get("year"), [Validators.required]],
      loaiDc: null,
      tenDvi: null,
      maDvi: null,
      ngayLapKh: null,
      ngayLapKhTu: null,
      ngayLapKhDen: null,
      ngayDuyetLdc: null,
      ngayDuyetLdcTu: null,
      ngayDuyetLdcDen: null,
      soDxuat: null,
      nguonChi: null,
      loaiVthh: null,
      cloaiVthh: null,
      trichYeu: null,
      type: null
    })
    this.filterTable = {
      nam: '',
      soDxuat: '',
      ngayLapKh: '',
      ngayDuyetLdc: '',
      loaiDc: '',
      maDvi: '',
      tenDvi: '',
      tenTrangThai: '',
    };
  }


  dsDonvi: any[] = [];
  userInfo: UserLogin;
  userdetail: any = {};
  selectedId: number = 0;
  isVatTu: boolean = false;
  isView = false;

  disabledStartNgayLapKh = (startValue: Date): boolean => {
    if (startValue && this.formData.value.ngayLapKhDen) {
      return startValue.getTime() > this.formData.value.ngayLapKhDen.getTime();
    } else {
      return false;
    }
  };

  disabledEndNgayLapKh = (endValue: Date): boolean => {
    if (!endValue || !this.formData.value.ngayLapKhTu) {
      return false;
    }
    return endValue.getTime() <= this.formData.value.ngayLapKhDen.getTime();
  };

  disabledStartNgayDuyetLdc = (startValue: Date): boolean => {
    if (startValue && this.formData.value.ngayDuyetLdcDen) {
      return startValue.getTime() > this.formData.value.ngayDuyetLdcDen.getTime();
    }
    return false;
  };

  disabledEndNgayDuyetLdc = (endValue: Date): boolean => {
    if (!endValue || !this.formData.value.ngayDuyetLdcTu) {
      return false;
    }
    return endValue.getTime() <= this.formData.value.ngayDuyetLdcDen.getTime();
  };

  async ngOnInit() {
    try {
      this.initData()
      await this.timKiem();
      await this.loadDsVthh();
      await this.spinner.hide();

    } catch (e) {
      console.log('error: ', e)
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async initData() {
    this.userInfo = this.userService.getUserLogin();
    this.userdetail.maDvi = this.userInfo.MA_DVI;
    this.userdetail.tenDvi = this.userInfo.TEN_DVI;
  }

  async loadDsVthh() {
    let res = await this.danhMucService.getDanhMucHangDvqlAsyn({});
    if (res.msg == MESSAGE.SUCCESS) {
      this.listHangHoaAll = res.data;
      this.listLoaiHangHoa = res.data?.filter((x) => (x.ma.length == 2 && !x.ma.match("^01.*")) || (x.ma.length == 4 && x.ma.match("^01.*")));
    }
  }

  async changeHangHoa(event: any) {
    if (event) {
      this.formData.patchValue({donViTinh: this.listHangHoaAll.find(s => s.ma == event)?.maDviTinh})

      let res = await this.danhMucService.loadDanhMucHangHoaTheoMaCha({str: event});
      if (res.msg == MESSAGE.SUCCESS) {
        if (res.data) {
          this.listChungLoaiHangHoa = res.data;
        }
      } else {
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    }
  }

  async timKiem() {
    if (this.formData.value.ngayDx) {
      this.formData.value.ngayDxTu = dayjs(this.formData.value.ngayDx[0]).format('YYYY-MM-DD')
      this.formData.value.ngayDxDen = dayjs(this.formData.value.ngayDx[1]).format('YYYY-MM-DD')
    }
    if (this.formData.value.ngayKetThuc) {
      this.formData.value.ngayKetThucTu = dayjs(this.formData.value.ngayKetThuc[0]).format('YYYY-MM-DD')
      this.formData.value.ngayKetThucDen = dayjs(this.formData.value.ngayKetThuc[1]).format('YYYY-MM-DD')
    }
    await this.search();
  }

  redirectDetail(id, b: boolean) {
    this.selectedId = id;
    this.isDetail = true;
    this.isView = b;
    // this.isViewDetail = isView ?? false;
  }

  async showList() {
    this.isDetail = false;
    await this.search();
  }

  xoa(data: any) {

  }
}
