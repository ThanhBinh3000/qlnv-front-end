import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogNhomQuyenComponent } from 'src/app/components/dialog/dialog-nhom-quyen/dialog-nhom-quyen.component';
import { MESSAGE } from 'src/app/constants/message';
import { UserLogin } from 'src/app/models/userlogin';
import { DanhMucDungChungService } from 'src/app/services/danh-muc-dung-chung.service';
import { QlNhomQuyenService } from 'src/app/services/quantri-nguoidung/qlNhomQuyen.service';
import { QlQuyenNSDService } from 'src/app/services/quantri-nguoidung/qlQuyen.service';
import { UserService } from 'src/app/services/user.service';
import { convertTrangThai } from 'src/app/shared/commonFunction';
import { cloneDeep } from 'lodash';
import { Base3Component } from 'src/app/components/base3/base3.component';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TheoDoiBqDtlService } from 'src/app/services/luu-kho/theoDoiBqDtl.service';
import { DonviService } from 'src/app/services/donvi.service';
import dayjs from 'dayjs';
import { LOAI_CHOT } from 'src/app/constants/status';
import { QthtChotGiaNhapXuatService } from 'src/app/services/quantri-hethong/qthtChotGiaNhapXuat.service';

@Component({
  selector: 'app-chot-dieu-chinh',
  templateUrl: './chot-dieu-chinh.component.html',
  styleUrls: ['./chot-dieu-chinh.component.scss']
})
export class ChotDieuChinhComponent extends Base3Component implements OnInit {

  formData: FormGroup;
  isChotDieuChinhGia = false;
  isChoNhapXuat = false;
  checkAll = "0";
  listDonVi: any[] = [];
  listSelected: any[] = [];

  isCapNhat: boolean = false;

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    route: ActivatedRoute,
    router: Router,
    private qthtChotGiaNhapXuatService: QthtChotGiaNhapXuatService,
    private donviService: DonviService
  ) {
    super(httpClient, storageService, notification, spinner, modal, route, router, qthtChotGiaNhapXuatService);
    this.formData = this.fb.group({
      id: [],
      ngayChotSr: [],
      ngayHlucSr: [],
      taiKhoanSr: [],
      ngayHuySr: [],
      ngayChot: [dayjs().format('YYYY-MM-DD'), [Validators.required]],
      ngayHluc: [dayjs().format('YYYY-MM-DD'), [Validators.required]],
      type: ''
    });
    if (this.router.url.includes('chot-dieu-chinh')) {
      this.isChotDieuChinhGia = true;
      this.isChoNhapXuat = false;
    } else {
      this.isChotDieuChinhGia = false;
      this.isChoNhapXuat = true;
    }
    this.formData.patchValue({
      type: this.isChotDieuChinhGia ? LOAI_CHOT.CHOT_GIA : LOAI_CHOT.CHOT_NHAP_XUAT
    })
  }

  async ngOnInit() {
    try {
      await Promise.all([
        this.userInfo = this.userService.getUserLogin(),
        this.getDonVi(),
      ]);
      this.searchPage();
    } catch (e) {
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  themMoi() {
    this.id = null;
    this.checkAll = "0";
    this.onChangeCheck();
    this.formData.reset();
    this.formData.patchValue({
      ngayChot: [dayjs().format('YYYY-MM-DD'), [Validators.required]],
      ngayHluc: [dayjs().format('YYYY-MM-DD'), [Validators.required]],
    });
  }

  async getDonVi() {
    this.listDonVi = []
    this.donviService.getAll({ capDvi: '2' }).then((res) => {
      console.log(res);
      res.data?.forEach((item) => {
        let body = {
          value: item.maDvi,
          label: item.tenDvi
        };
        this.listDonVi.push(body);
      })
    })
  }


  onChangeCheck() {
    this.listDonVi.forEach(item => item.checked = this.checkAll == "1");
    if (this.checkAll == "1") {
      this.listSelected = [];
      this.listDonVi.forEach(item => this.listSelected.push(item.value));
    } else {
      this.listSelected = [];
    }
  }


  log($event) {
    this.listSelected = $event;
  }

  save() {
    if (this.listSelected.length == 0) {
      this.notification.info(MESSAGE.NOTIFICATION, 'Danh sách cục không được để trống');
      return;
    }
    let body = this.formData.value;
    body.listMaDvi = this.listSelected
    body.type = this.isChotDieuChinhGia ? LOAI_CHOT.CHOT_GIA : LOAI_CHOT.CHOT_NHAP_XUAT
    console.log(body);
    this.createUpdate(body).then(res => {
      if (res) {
        this.searchPage();
      }
    })
  }

  async showDetail($event, id: number) {
    this.spinner.show();
    $event.target.parentElement.parentElement.querySelector('.selectedRow')?.classList.remove('selectedRow');
    $event.target.parentElement.classList.add('selectedRow')
    this.id = id;
    await this.detail(id).then(res => {
      this.id = res.id;
      console.log(res);
      this.isCapNhat = true;
      // Nếu có ngày hủy thì cập nhập = false
      if (res.ngayHuy) {
        this.isCapNhat = false;
      }
      const currentDate = new Date();
      const targetDate = new Date(res.ngayHluc);
      if (currentDate > targetDate) {
        this.isCapNhat = false;
      }

      this.listDonVi.forEach((item) => {
        item.checked = res.listMaDvi.includes(item.value)
      });
      this.listSelected = res.listMaDvi;
    });
    this.spinner.hide();
  }

  huyBo() {
    if (this.id) {
      this.modal.confirm({
        nzClosable: false,
        nzTitle: 'Xác nhận',
        nzContent: 'Bạn có chắc chắn muốn hủy bỏ ?',
        nzOkText: 'Đồng ý',
        nzCancelText: 'Không',
        nzOkDanger: true,
        nzWidth: 310,
        nzOnOk: () => {
          this.spinner.show();
          try {
            this.qthtChotGiaNhapXuatService.delete({ id: this.id }).then((res) => {
              if (res.msg == MESSAGE.SUCCESS) {
                this.notification.success(
                  MESSAGE.SUCCESS,
                  MESSAGE.UPDATE_SUCCESS,
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
  }

  async searchPage() {
    this.search();
  }

  disabled() {
    return false;
  }

  disabledTuNow = (current: Date): boolean => {
    const today = new Date()
    today.setHours(0, 0, 0, 0);
    console.log(current, today, current < today);
    return current < today;
  };

}
