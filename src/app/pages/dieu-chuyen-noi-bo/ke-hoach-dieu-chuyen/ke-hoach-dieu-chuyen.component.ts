import {Component, Input, OnInit} from '@angular/core';
import dayjs from 'dayjs';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NgxSpinnerService} from 'ngx-spinner';
import {MESSAGE} from 'src/app/constants/message';
import {UserLogin} from 'src/app/models/userlogin';
import {HttpClient} from '@angular/common/http';
import {StorageService} from 'src/app/services/storage.service';
import {Base2Component} from 'src/app/components/base2/base2.component';
import {DonviService} from 'src/app/services/donvi.service';
import {CHUC_NANG} from 'src/app/constants/status';
import {DanhMucService} from 'src/app/services/danhmuc.service';
import {Validators} from "@angular/forms";
import {KeHoachDieuChuyenService} from "./ke-hoach-dieu-chuyen.service";

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
  listLoaiDc: any [] = [
    {ma: 'CHI_CUC', giaTri: 'Giữa 2 chi cục trong cùng 1 cục'},
    {ma: 'CUC', giaTri: 'Giữa 2 cục DTNN KV'}
  ];
  listLoaiHangHoa: any[] = [];
  listHangHoaAll: any[] = [];
  listChungLoaiHangHoa: any[] = [];
  listTrangThai: any[] = [
    {ma: this.STATUS.DU_THAO, giaTri: 'Dự thảo'},
    {ma: this.STATUS.CHODUYET_TBP_TVQT, giaTri: 'Chờ duyệt - TBP TVQT'},
    {ma: this.STATUS.TUCHOI_TBP_TVQT, giaTri: 'Từ chối - TBP TVQT'},
    {ma: this.STATUS.CHO_DUYET_LDCC, giaTri: 'Chờ duyệt - LĐ Chi Cục'},
    {ma: this.STATUS.TU_CHOI_LDCC, giaTri: 'Từ chối - LĐ Chi Cục'},
    {ma: this.STATUS.DA_DUYET_LDCC, giaTri: 'Đã duyệt - LĐ Chi Cục'},
    {ma: this.STATUS.YC_CHICUC_PHANBO_DC, giaTri: 'Y/c Chi cục xác định điểm nhập ĐC'},
    {ma: this.STATUS.DA_PHANBO_DC_CHODUYET_TBP_TVQT, giaTri: 'Đã xác định điểm nhập, chờ duyệt – TBP TVQT'},
    {ma: this.STATUS.DA_PHANBO_DC_TUCHOI_TBP_TVQT, giaTri: 'Đã xác định điểm nhập, từ chối – TBP TVQT'},
    {ma: this.STATUS.DA_PHANBO_DC_CHODUYET_LDCC, giaTri: 'Đã xác định điểm nhập, chờ duyệt – LĐ Chi cục'},
    {ma: this.STATUS.DA_PHANBO_DC_TUCHOI_LDCC, giaTri: 'Đã xác định điểm nhập, từ chối – LĐ Chi cục'},
    {ma: this.STATUS.DA_PHANBO_DC_DADUYET_LDCC, giaTri: 'Đã xác định điểm nhập, đã duyệt – LĐ Chi cục'},
    {ma: this.STATUS.DA_PHANBO_DC_CHODUYET_TP, giaTri: 'Đã xác định điểm nhập, chờ duyệt – TP'},
    {ma: this.STATUS.DA_PHANBO_DC_TUCHOI_TP, giaTri: 'Đã xác định điểm nhập, từ chối – TP'},
    {ma: this.STATUS.DA_PHANBO_DC_CHODUYET_LDC, giaTri: 'Đã xác định điểm nhập, chờ duyệt – LĐ Cục'},
    {ma: this.STATUS.DA_PHANBO_DC_TUCHOI_LDC, giaTri: 'Đã xác định điểm nhập, từ chối – LĐ Cục'},
    {ma: this.STATUS.DA_PHANBO_DC_DADUYET_LDC, giaTri: 'Đã xác định điểm nhập, đã duyệt – LĐ Cục'},
  ];

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private donviService: DonviService,
    private danhMucService: DanhMucService,
    private keHoachDieuChuyenService: KeHoachDieuChuyenService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, keHoachDieuChuyenService);
    this.formData = this.fb.group({
      nam: null,
      loaiDc: null,
      tenDvi: null,
      maDvi: null,
      ngayLapKhTu: null,
      ngayLapKhDen: null,
      ngayDuyetLdccTu: null,
      ngayDuyetLdccDen: null,
      soDxuat: null,
      loaiVthh: null,
      cloaiVthh: null,
      trichYeu: null
    })
    this.filterTable = {
      nam: '',
      soDxuat: '',
      ngayLapKh: '',
      ngayDuyetLdcc: '',
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

  disabledStartNgayDuyetLdcc = (startValue: Date): boolean => {
    if (startValue && this.formData.value.ngayDuyetLdccDen) {
      return startValue.getTime() > this.formData.value.ngayDuyetLdccDen.getTime();
    }
    return false;
  };

  disabledEndNgayDuyetLdcc = (endValue: Date): boolean => {
    if (!endValue || !this.formData.value.ngayDuyetLdccTu) {
      return false;
    }
    return endValue.getTime() <= this.formData.value.ngayDuyetLdccDen.getTime();
  };

  async ngOnInit() {
    try {
      this.initData()
      await this.timKiem();
      await this.loadDsVthh();
      await this.spinner.hide();

    } catch (e) {
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
    await this.search('DCNB_KHDC_XEM');
  }

  redirectDetail(data, b: boolean) {
    this.isDetail = true;
    this.isView = b;
    if (data) {
      this.selectedId = data.id;
      if (!(data.trangThai == this.STATUS.DU_THAO || data.trangThai == this.STATUS.TUCHOI_TBP_TVQT || data.trangThai == this.STATUS.TU_CHOI_LDCC
        || data.trangThai == this.STATUS.YC_CHICUC_PHANBO_DC || data.trangThai == this.STATUS.DA_PHANBO_DC_TUCHOI_LDCC || data.trangThai == this.STATUS.DA_PHANBO_DC_TUCHOI_TBP_TVQT  || (data.trangThai == this.STATUS.DA_PHANBO_DC_TUCHOI_TP && !!data.xdLaiDiemNhap) || (data.trangThai == this.STATUS.DA_PHANBO_DC_TUCHOI_LDC && !!data.xdLaiDiemNhap))) {
        this.isView = true;
      }
    } else {
      this.selectedId = 0;
    }
  }

  async showList() {
    this.isDetail = false;
    await this.search();
  }

  xoa(item: any) {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn xóa?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: () => {
        this.spinner.show();
        try {
          this.keHoachDieuChuyenService.delete({ id: item.id }).then((res) => {
            if (res.msg == MESSAGE.SUCCESS) {
              this.notification.success(
                MESSAGE.SUCCESS,
                MESSAGE.DELETE_SUCCESS,
              );
              this.search();
            } else {
              this.notification.error(MESSAGE.ERROR, res.msg);
            }
            this.spinner.hide();
          });
        } catch (e) {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      },
    });
  }

  checkAllowEdit(data: any): boolean {
    return (data.trangThai == this.STATUS.DU_THAO || data.trangThai == this.STATUS.TUCHOI_TBP_TVQT || data.trangThai == this.STATUS.TU_CHOI_LDCC
        || data.trangThai == this.STATUS.YC_CHICUC_PHANBO_DC || data.trangThai == this.STATUS.DA_PHANBO_DC_TUCHOI_TBP_TVQT || data.trangThai == this.STATUS.DA_PHANBO_DC_TUCHOI_LDCC || (data.trangThai == this.STATUS.DA_PHANBO_DC_TUCHOI_TP && !!data.xdLaiDiemNhap) || (data.trangThai == this.STATUS.DA_PHANBO_DC_TUCHOI_LDC && !!data.xdLaiDiemNhap))
      && this.userService.isAccessPermisson('DCNB_KHDC_THEM');
  }

  checkAllowDelete(data: any): boolean {
    return data.trangThai == this.STATUS.DU_THAO && this.userService.isAccessPermisson('DCNB_KHDC_XOA');
  }

  checkApproveDcTvqt(data: any) {
    return (data.trangThai == this.STATUS.CHODUYET_TBP_TVQT && this.userService.isAccessPermisson('DCNB_KHDC_DUYET_TBPTVQT'));
  }

  checkApproveDcLdcc(data: any) {
    return ( data.trangThai == this.STATUS.CHO_DUYET_LDCC && this.userService.isAccessPermisson('DCNB_KHDC_DUYET_LDCCUC'));
  }

  checkApproveNdcTvqt(data: any) {
    return (data.trangThai == this.STATUS.DA_PHANBO_DC_CHODUYET_TBP_TVQT  && this.userService.isAccessPermisson('DCNB_KHDC_DUYET_TBPTVQT'));
  }

  checkApproveNdcLdcc(data: any) {
    return (data.trangThai == this.STATUS.DA_PHANBO_DC_CHODUYET_LDCC && this.userService.isAccessPermisson('DCNB_KHDC_DUYET_LDCCUC'));
  }

  checkAllowView(data: any) {
    return !(this.checkAllowEdit(data) || this.checkAllowDelete(data) || this.checkApproveDcLdcc(data) || this.checkApproveDcTvqt(data) || this.checkApproveNdcLdcc(data) || this.checkApproveNdcTvqt(data))
      && this.userService.isAccessPermisson('DCNB_KHDC_XEM');
  }
}
