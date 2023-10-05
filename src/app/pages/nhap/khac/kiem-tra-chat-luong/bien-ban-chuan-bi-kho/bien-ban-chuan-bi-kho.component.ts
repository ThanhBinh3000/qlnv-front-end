import {Component, Input, OnInit} from '@angular/core';
import {Base2Component} from "../../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {
  BbNghiemThuBaoQuanService
} from "../../../../../services/qlnv-hang/nhap-hang/nhap-khac/bbNghiemThuBaoQuan.service";
import {MESSAGE} from "../../../../../constants/message";
import dayjs from "dayjs";
import { STATUS } from 'src/app/constants/status';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-bien-ban-chuan-bi-kho',
  templateUrl: './bien-ban-chuan-bi-kho.component.html',
  styleUrls: ['./bien-ban-chuan-bi-kho.component.scss']
})
export class BienBanChuanBiKhoComponent extends Base2Component implements OnInit {
  @Input() typeVthh: string;
  isDetail: boolean = false;
  selectedId: number = 0;
  isView: boolean = false;
  STATUS = STATUS
  dataDdiem: number;
  idQdGiaoNvNh: number;
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
    private bbNghiemThuBaoQuanService :BbNghiemThuBaoQuanService
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
    await this.search();
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

  redirectToChiTiet(isView: boolean, id: number, dataDdiem?: any, idQdGiaoNvNh?: number) {
    this.selectedId = id;
    this.isDetail = true;
    this.isView = isView;
    this.dataDdiem = dataDdiem
    this.idQdGiaoNvNh = idQdGiaoNvNh
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

  showList() {
    this.isDetail = false;
    this.timKiem();
  }
}
