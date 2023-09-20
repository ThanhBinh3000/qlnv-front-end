import {Component, OnInit} from '@angular/core';
import {Base2Component} from "../../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {DonviService} from "../../../../../services/donvi.service";
import {MESSAGE} from "../../../../../constants/message";
import {saveAs} from 'file-saver';
import dayjs from "dayjs";
import {ThongTinDmScLonComponent} from "./thong-tin-dm-sc-lon/thong-tin-dm-sc-lon.component";
import {
  DanhMucSuaChuaService
} from "../../../../../services/qlnv-kho/quy-hoach-ke-hoach/danh-muc-kho/danh-muc-sua-chua.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-danh-muc-sc-lon',
  templateUrl: './danh-muc-sc-lon.component.html',
  styleUrls: ['./danh-muc-sc-lon.component.scss']
})
export class DanhMucScLonComponent extends Base2Component implements OnInit {
  isViewDetail: boolean;
  dsCuc: any[] = [];
  dsKho: any[] = [];
  listTrangThai: any[] = [
    {ma: this.STATUS.CHUA_THUC_HIEN, giaTri: 'Chưa thực hiện'},
    {ma: this.STATUS.DANG_THUC_HIEN, giaTri: 'Đang thực hiện'},
    {ma: this.STATUS.DA_HOAN_THANH, giaTri: 'Đã hoàn thành'},
  ];

  constructor(
    private httpClient: HttpClient,
    private storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private danhMucService: DanhMucSuaChuaService,
    private dviService: DonviService,
    private router: Router
  ) {
    super(httpClient, storageService, notification, spinner, modal, danhMucService);
    super.ngOnInit()
    this.formData = this.fb.group({
      maDvi: [null],
      soQdPdBcKtkt: [null],
      trangThai: [null],
      tgThucHien: [null],
      tgThucHienTu: [null],
      tgThucHienDen: [null],
      tgHoanThanh: [null],
      tgHoanThanhTu: [null],
      tgHoanThanhDen: [null],
      type: ["00"],
    });
    this.filterTable = {};
  }

  async ngOnInit() {
    if (!this.userService.isAccessPermisson('QLKT_QHKHKT_DM_CONGTRINHSCL')) {
      this.router.navigateByUrl('/error/401')
    }
    this.spinner.show();
    try {
       this.loadDsCuc()
      if (this.userService.isCuc()) {
        this.formData.patchValue({
          maDvi : this.userInfo.MA_DVI
        })
      }
      await this.filter()
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async filter() {
    if (this.formData.value.tgThucHien && this.formData.value.tgHoanThanh) {
      this.formData.patchValue({
        tgThucHienTu: dayjs(this.formData.value.tgThucHien[0]).get('year'),
        tgThucHienDen: dayjs(this.formData.value.tgThucHien[1]).get('year'),
        tgHoanThanhTu: dayjs(this.formData.value.tgHoanThanh[0]).get('year'),
        tgHoanThanhDen: dayjs(this.formData.value.tgHoanThanh[1]).get('year'),
      })
    }
    this.formData.patchValue({
      maDvi: this.userService.isCuc() ? this.userInfo.MA_DVI : null,
      type: "00"
    })
    await this.search();
  }

  clearForm() {
    this.formData.reset();
    this.filter();
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

  openDialog(data: any, isView: boolean) {
    let modalQD = this.modal.create({
      nzContent: ThongTinDmScLonComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzStyle: {top: '100px'},
      nzWidth: '1000px',
      nzFooter: null,
      nzComponentParams: {
        dataDetail: data,
        isViewDetail: isView
      },
    });
    modalQD.afterClose.subscribe(async (data) => {
      if (data) {
        await this.search()
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
            saveAs(blob, 'danh-sach-danh-muc-sua-chua-lon.xlsx'),
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
