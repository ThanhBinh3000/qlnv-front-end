import { Component, Input, OnInit } from '@angular/core';
import dayjs from "dayjs";
import { MESSAGE } from "../../../../../constants/message";
import { Base2Component } from "../../../../../components/base2/base2.component";
import { HttpClient } from "@angular/common/http";
import { StorageService } from "../../../../../services/storage.service";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NgxSpinnerService } from "ngx-spinner";
import { NzModalService } from "ng-zorro-antd/modal";
import { BbNghiemThuBaoQuanService } from "../../../../../services/qlnv-hang/nhap-hang/nhap-khac/bbNghiemThuBaoQuan.service";
import { STATUS } from 'src/app/constants/status';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-bien-ban-nghiem-thu-bao-quan',
  templateUrl: './bien-ban-nghiem-thu-bao-quan.component.html',
  styleUrls: ['./bien-ban-nghiem-thu-bao-quan.component.scss']
})
export class BienBanNghiemThuBaoQuanComponent extends Base2Component implements OnInit {
  @Input() typeVthh: string;
  isDetail: boolean = false;
  selectedId: number = 0;
  isView: boolean = false;
  STATUS = STATUS
  idQdGiaoNvNh: number;
  dataDdiem: number;
  searchFilter = {
    soQd: '',
    namKhoach: '',
    soBb: ''
  };
  tuNgayLP: Date | null = null;
  denNgayLP: Date | null = null;
  tuNgayKT: Date | null = null;
  denNgayKT: Date | null = null;
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private bbNghiemThuBaoQuanService: BbNghiemThuBaoQuanService
  ) {
    super(httpClient, storageService, notification, spinner, modal, bbNghiemThuBaoQuanService);
  }

  async ngOnInit() {
    await this.spinner.show();
    try {
      await Promise.all([
        this.timKiem(),
      ])
      await this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      await this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  disabledTuNgayLP = (startValue: Date): boolean => {
    if (!startValue || !this.denNgayLP) {
      return false;
    }
    return startValue.getTime() > this.denNgayLP.getTime();
  };

  disabledDenNgayLP = (endValue: Date): boolean => {
    if (!endValue || !this.tuNgayLP) {
      return false;
    }
    return endValue.getTime() <= this.tuNgayLP.getTime();
  };

  disabledTuNgayKT = (startValue: Date): boolean => {
    if (!startValue || !this.denNgayLP) {
      return false;
    }
    return startValue.getTime() > this.denNgayLP.getTime();
  };

  disabledDenNgayKT = (endValue: Date): boolean => {
    if (!endValue || !this.tuNgayLP) {
      return false;
    }
    return endValue.getTime() <= this.tuNgayLP.getTime();
  };

  async timKiem() {
    await this.spinner.show();
    let body = {
      "paggingReq": {
        "limit": this.pageSize,
        "page": this.page - 1
      },
      loaiVthh: this.typeVthh,
      soQd: this.searchFilter.soQd,
      namKhoach: this.searchFilter.namKhoach,
      soBbNtBq: this.searchFilter.soBb,
      tuNgayLP: this.tuNgayLP != null ? dayjs(this.tuNgayLP).format('YYYY-MM-DD') + " 00:00:00" : null,
      denNgayLP: this.denNgayLP != null ? dayjs(this.denNgayLP).format('YYYY-MM-DD') + " 24:59:59" : null,
      tuNgayKT: this.tuNgayKT != null ? dayjs(this.tuNgayKT).format('YYYY-MM-DD') + " 00:00:00" : null,
      denNgayKT: this.denNgayKT != null ? dayjs(this.denNgayKT).format('YYYY-MM-DD') + " 24:59:59" : null,
    };
    let res = await this.bbNghiemThuBaoQuanService.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      this.dataTable = data.content;
      this.dataTable.forEach(item => {
        item.expand = true
      })
      this.totalRecord = data.totalElements;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
    await this.spinner.hide();
  }

  async clearFilter() {
    this.searchFilter = {
      soQd: '',
      namKhoach: '',
      soBb: ''
    };
    this.tuNgayLP = null;
    this.denNgayLP = null;
    this.tuNgayKT = null;
    this.denNgayKT = null;
    await this.timKiem();
  }

  export() {
    if (this.totalRecord > 0) {
      this.spinner.show();
      try {
        let body = {
          loaiVthh: this.typeVthh,
          soQd: this.searchFilter.soQd,
          namKhoach: this.searchFilter.namKhoach,
          soBbNtBq: this.searchFilter.soBb,
          tuNgayLP: this.tuNgayLP != null ? dayjs(this.tuNgayLP).format('YYYY-MM-DD') + " 00:00:00" : null,
          denNgayLP: this.denNgayLP != null ? dayjs(this.denNgayLP).format('YYYY-MM-DD') + " 24:59:59" : null,
          tuNgayKT: this.tuNgayKT != null ? dayjs(this.tuNgayKT).format('YYYY-MM-DD') + " 00:00:00" : null,
          denNgayKT: this.denNgayKT != null ? dayjs(this.denNgayKT).format('YYYY-MM-DD') + " 24:59:59" : null,
        };
        this.bbNghiemThuBaoQuanService
          .export(body)
          .subscribe((blob) =>
            saveAs(blob, 'Ds_bb_ntbq_lan_dau.xlsx'),
          );
        this.spinner.hide();
      } catch (e) {
        console.log('error: ', e);
        this.spinner.hide();
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
    } else {
      this.notification.error(MESSAGE.ERROR, MESSAGE.DATA_EMPTY);
    }
  }

  redirectToChiTiet(isView: boolean, id: number, idQdGiaoNvNh?: number, dataDdiem?: number) {
    this.selectedId = id;
    this.isDetail = true;
    this.isView = isView;
    this.idQdGiaoNvNh = idQdGiaoNvNh
    this.dataDdiem = dataDdiem
  }

  xoaItem(item: any) {
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
          this.bbNghiemThuBaoQuanService.delete({ id: item.id }).then((res) => {
            if (res.msg == MESSAGE.SUCCESS) {
              this.notification.success(
                MESSAGE.SUCCESS,
                MESSAGE.DELETE_SUCCESS,
              );
              this.timKiem();
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
  setExpand(parantExpand: boolean = false, children: any = []): void {
    if (parantExpand) {
      return children.map(f => ({ ...f, expand: false }))
    }
    return children
  }
  showList() {
    this.isDetail = false;
    this.timKiem();
  }

  hienThiPheDuyet(data) {
    return (this.userService.isAccessPermisson('NHDTQG_NK_KTCL_LT_BBNTBQLD_DUYET_THUKHO') && data.trangThai == STATUS.CHO_DUYET_TK)
      || (this.userService.isAccessPermisson('NHDTQG_NK_KTCL_LT_BBNTBQLD_DUYET_KETOAN') && data.trangThai == STATUS.CHO_DUYET_KT)
        || (this.userService.isAccessPermisson('NHDTQG_NK_KTCL_LT_BBNTBQLD_DUYET_LDCCUC') && data.trangThai == STATUS.CHO_DUYET_LDCC);
  }

  hienThiXem(data) {
    if (this.userService.isAccessPermisson('NHDTQG_NK_KTCL_LT_BBNTBQLD_XEM')) {
      if (this.userService.isAccessPermisson('NHDTQG_NK_KTCL_LT_BBNTBQLD_THEM') && (data.trangThai == STATUS.DU_THAO || data.trangThai == STATUS.TU_CHOI_TK || data.trangThai == STATUS.TU_CHOI_KT || data.trangThai == STATUS.TU_CHOI_LDCC)) {
        return false;
      } else if ((this.userService.isAccessPermisson('NHDTQG_NK_KTCL_LT_BBNTBQLD_DUYET_THUKHO') && data.trangThai == STATUS.CHO_DUYET_TK)
        || (this.userService.isAccessPermisson('NHDTQG_NK_KTCL_LT_BBNTBQLD_DUYET_KETOAN') && data.trangThai == STATUS.CHO_DUYET_KT)
        || (this.userService.isAccessPermisson('NHDTQG_NK_KTCL_LT_BBNTBQLD_DUYET_LDCCUC') && data.trangThai == STATUS.CHO_DUYET_LDCC)) {
        return false;
      }
      return true;
    }
    return false;
  }
}
