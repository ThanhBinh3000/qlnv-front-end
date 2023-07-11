import { Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { StorageService } from 'src/app/services/storage.service';
import { HttpClient } from '@angular/common/http';
import { BangCaoDieuChuyenService } from './bao-cao.service';
import { MESSAGE } from 'src/app/constants/message';
import { UserLogin } from 'src/app/models/userlogin';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
@Component({
  selector: 'app-bao-cao',
  templateUrl: './bao-cao.component.html',
  styleUrls: ['./bao-cao.component.scss']
})
export class BaoCaoComponent extends Base2Component implements OnInit {
  userInfo: UserLogin;
  userdetail: any = {};
  selectedId: number = 0;
  isView: boolean;
  isDetail: boolean;
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 0;
  LIST_TRANG_THAI: Array<{ ma: string, giaTri: string }> = [
    { ma: this.STATUS.DU_THAO, giaTri: "Dự thảo" },
    { ma: this.STATUS.CHO_DUYET_TP, giaTri: "Chờ duyệt - TP" },
    { ma: this.STATUS.CHO_DUYET_LDC, giaTri: "Chờ duyệt - LĐ Cục" },
    { ma: this.STATUS.TU_CHOI_TP, giaTri: "Từ chối - TP" },
    { ma: this.STATUS.DA_DUYET_LDC, giaTri: "Đã duyệt - LĐ Cục" },
    { ma: this.STATUS.TU_CHOI_LDC, giaTri: "Từ chối - LĐ Cục" },
  ];
  TRANG_THAI: { [key: string]: string } = {
    [this.STATUS.DU_THAO]: "Dự thảo",
    [this.STATUS.CHO_DUYET_TP]: "Chờ duyệt - TP",
    [this.STATUS.CHO_DUYET_LDC]: "Chờ duyệt - LĐ Cục",
    [this.STATUS.TU_CHOI_TP]: "Từ chối - TP",
    [this.STATUS.DA_DUYET_LDC]: "Đã duyệt - LĐ Cục",
    [this.STATUS.TU_CHOI_LDC]: "Từ chối - LĐ Cục"
  }
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private bangCaoDieuChuyenService: BangCaoDieuChuyenService
    // private donviService: DonviService,
    // private danhMucService: DanhMucService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, bangCaoDieuChuyenService)
    this.formData = this.fb.group({
      soBc: [''],
      soQdinhCuc: [''],
      trangThai: [''],
      tuNgay: [''],
      denNgay: ['']

    })
    this.filterTable = {
      namBaoCao: '',
      soBaoCao: '',
      tenBaoCao: '',
      ngayBaoCao: '',
      soQdinhCuc: '',
      ngayKyQdCuc: '',
      soQdinhTongCuc: '',
      ngayKyQdTongCuc: '',
      trangThai: ''
    };
  }


  async ngOnInit(): Promise<void> {
    try {
      this.spinner.show()
      // if (this.userService.isTongCuc()) {
      //     this.loadDsCuc()
      // }
      await this.initData()
      this.timKiem();
    } catch (e) {
      console.log('error: ', e)
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
    finally {
      this.spinner.hide()
    }
  }

  async initData() {
    this.userInfo = this.userService.getUserLogin();
    this.userdetail.maDvi = this.userInfo.MA_DVI;
    this.userdetail.tenDvi = this.userInfo.TEN_DVI;
  }
  async clearForm() {
    this.formData.reset();
    await this.search()
  }
  async timKiem() {
    await this.search();
  }
  disabledTuNgay = (startValue: Date): boolean => {
    if (startValue && this.formData.value.denNgay) {
      return startValue.getTime() > this.formData.value.denNgay.getTime();
    }
    return false;
  };

  disabledDenNgay = (endValue: Date): boolean => {
    if (!endValue || !this.formData.value.tuNgay) {
      return false;
    }
    return endValue.getTime() <= this.formData.value.tuNgay.getTime();
  };
  deleteSelect() {
    let dataDelete = [];
    if (this.dataTable && this.dataTable.length > 0) {
      this.dataTable.forEach((item) => {
        if (item.checked) {
          dataDelete.push(item.id);
        }
      });
    }
    if (dataDelete && dataDelete.length > 0) {
      this.modal.confirm({
        nzClosable: false,
        nzTitle: 'Xác nhận',
        nzContent: 'Bạn có chắc chắn muốn xóa các bản ghi đã chọn?',
        nzOkText: 'Đồng ý',
        nzCancelText: 'Không',
        nzOkDanger: true,
        nzWidth: 310,
        nzOnOk: async () => {
          this.spinner.show();
          try {
            let res = await this.bangCaoDieuChuyenService.deleteMuti({ ids: dataDelete });
            if (res.msg == MESSAGE.SUCCESS) {
              this.notification.success(MESSAGE.SUCCESS, MESSAGE.DELETE_SUCCESS);
              await this.search();
              this.allChecked = false;
            } else {
              this.notification.error(MESSAGE.ERROR, res.msg);
            }
            this.spinner.hide();
          } catch (e) {
            console.log('error: ', e);
            this.spinner.hide();
            this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
          }
        },
      });
    }
    else {
      this.notification.error(MESSAGE.ERROR, "Không có dữ liệu phù hợp để xóa.");
    }
  }
  redirectDetail(id: number, isView: boolean) {
    this.idSelected = id;
    this.isDetail = true;
    this.isView = isView;
  }
  checkRoleView(trangThai: string): boolean {
    return !this.checkRoleEdit(trangThai) && !this.checkRoleApproveDc(trangThai) && !this.checkRoleDelete(trangThai)
  }
  checkRoleAdd(): boolean {
    return this.userService.isCuc()
  }
  checkRoleEdit(trangThai: string): boolean {
    return this.userService.isCuc() && (trangThai === this.STATUS.DU_THAO || trangThai === this.STATUS.TU_CHOI_TP || trangThai === this.STATUS.TU_CHOI_LDC)
  }
  checkRoleApproveDc(trangThai: string): boolean {
    return this.userService.isCuc() && (trangThai === this.STATUS.CHO_DUYET_TK || trangThai === this.STATUS.CHO_DUYET_LDC)
  }
  checkRoleDelete(trangThai: string): boolean {
    return this.userService.isCuc() && trangThai === this.STATUS.DU_THAO
  }
}
