import { Component, OnInit } from '@angular/core';
import {Base2Component} from "../../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {DonviService} from "../../../../../services/donvi.service";
import {MESSAGE} from "../../../../../constants/message";
import {saveAs} from 'file-saver';
import {HienTrangMayMoc} from "../../../../../constants/status";
import {
  DanhMucSuaChuaService
} from "../../../../../services/qlnv-kho/quy-hoach-ke-hoach/danh-muc-kho/danh-muc-sua-chua.service";
import {
  ThongTinDanhMucScThuongXuyenComponent
} from "./thong-tin-danh-muc-sc-thuong-xuyen/thong-tin-danh-muc-sc-thuong-xuyen.component";
import { Router } from "@angular/router";
@Component({
  selector: 'app-danh-muc-sc-thuong-xuyen',
  templateUrl: './danh-muc-sc-thuong-xuyen.component.html',
  styleUrls: ['./danh-muc-sc-thuong-xuyen.component.scss']
})
export class DanhMucScThuongXuyenComponent extends Base2Component implements OnInit {
  isViewDetail : boolean;
  dsCuc : any[] = [];
  dsKho : any[] = [];
  listTrangThai: any[] = [
    { ma: this.STATUS.CHUA_THUC_HIEN, giaTri: 'Chưa thực hiện' },
    { ma: this.STATUS.DANG_THUC_HIEN, giaTri: 'Đang thực hiện' },
    { ma: this.STATUS.DA_HOAN_THANH, giaTri: 'Đã hoàn thành' },
  ];
  constructor(
    private httpClient: HttpClient,
    private storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private danhMucService : DanhMucSuaChuaService,
    private dviService : DonviService,
    private router : Router
  ) {
    super(httpClient, storageService, notification, spinner, modal, danhMucService);
    super.ngOnInit()
    this.formData = this.fb.group({
      namKh: [null],
      maDvi: [null],
      tenCongTrinh: [null],
      maDiemKho: [null],
      trangThai: [null],
      tgThucHien: [null],
      tgThucHienTu: [null],
      tgThucHienDen: [null],
      type: ["01"],
    });
  }

  async ngOnInit() {
    if (!this.userService.isAccessPermisson('QLKT_QHKHKT_DM_CONGTRINHSCTX')) {
      this.router.navigateByUrl('/error/401')
    }
    this.spinner.show();
    try {
      if (this.userService.isTongCuc()) {
        this.loadDsCuc()
      }
      this.loadDsDiemKho()
      this.filter()
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }


  redirectToChiTiet(id: number, isView?: boolean) {
    this.idSelected = id;
    this.isDetail = true;
    this.isViewDetail = isView ?? false;
  }


  async loadDsCuc() {
    const dsTong = await this.dviService.layTatCaDonViByLevel(2);
    this.dsCuc = dsTong.data
    this.dsCuc = this.dsCuc.filter(item => item.type != "PB")
  }

  async loadDsDiemKho() {
    const dsTong = await this.dviService.layTatCaDonViByLevel(4);
    this.dsKho = dsTong.data
    this.dsKho = this.dsKho.filter(item => item.maDvi.startsWith(this.userInfo.MA_DVI) && item.type != 'PB')
  }

  openDialog(data : any, isView : boolean) {
    let modalQD = this.modal.create({
      nzContent: ThongTinDanhMucScThuongXuyenComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzStyle : {top : '150px'},
      nzWidth: '1000px',
      nzFooter: null,
      nzComponentParams: {
        dataDetail : data,
        isViewDetail : isView
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        await this.filter()
      }
    })
  }

  exportData() {
    if (this.totalRecord > 0) {
      this.spinner.show();
      try {
        let body = this.formData.value;
        body.paggingReq = {
          limit: this.pageSize,
          page: this.page - 1
        }
        this.danhMucService
          .export(body)
          .subscribe((blob) =>
            saveAs(blob, 'danh-sach-danh-muc-sua-chua-thuong-xuyen.xlsx'),
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


  clearForm(currentSearch?: any) {
    this.formData.reset();
    this.filter();
  }

  async filter() {
    this.formData.patchValue({
      maDvi : this.userService.isCuc() ? this.userInfo.MA_DVI : null,
      type : "01"
    })
    await this.search()
  }

  updateAllChecked(): void {
    this.indeterminate = false;
    if (this.allChecked) {
      if (this.dataTable && this.dataTable.length > 0) {
        this.dataTable.forEach((item) => {
          if (item.trangThai == this.STATUS.CHUA_THUC_HIEN) {
            item.checked = true;
          }
        });
      }
    } else {
      if (this.dataTable && this.dataTable.length > 0) {
        this.dataTable.forEach((item) => {
          item.checked = false;
        });
      }
    }
  }
}
