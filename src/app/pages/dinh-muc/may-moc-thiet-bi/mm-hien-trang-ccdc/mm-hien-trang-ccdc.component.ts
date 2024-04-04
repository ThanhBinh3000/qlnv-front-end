import { Component, OnInit } from '@angular/core';
import {Base2Component} from "../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {DonviService} from "../../../../services/donvi.service";
import {DANH_MUC_LEVEL} from "../../../luu-kho/luu-kho.constant";
import {MESSAGE} from "../../../../constants/message";
import {MmHienTrangMmService} from "../../../../services/mm-hien-trang-mm.service";
import {saveAs} from 'file-saver';
import {MmThongTinHienTrangComponent} from "./mm-thong-tin-hien-trang/mm-thong-tin-hien-trang.component";
import {HienTrangMayMoc} from "../../../../constants/status";
import dayjs from "dayjs";
@Component({
  selector: 'app-mm-hien-trang-ccdc',
  templateUrl: './mm-hien-trang-ccdc.component.html',
  styleUrls: ['./mm-hien-trang-ccdc.component.scss']
})
export class MmHienTrangCcdcComponent extends Base2Component implements OnInit {
  isViewDetail : boolean;
  dsCuc : any[] = [];
  dsChiCuc : any[] = [];
  statusMm = HienTrangMayMoc
  constructor(
    private httpClient: HttpClient,
    private storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private hienTrangSv : MmHienTrangMmService,
    private dviService : DonviService
  ) {
    super(httpClient, storageService, notification, spinner, modal, hienTrangSv);
    super.ngOnInit()
    this.formData = this.fb.group({
      maDvi: [null],
      namKeHoach: [null],
      tenCcdc: [null],
      maCcdc: [null],
      trangThaiKt: ["00"],
    });
  }

  async ngOnInit() {
    this.spinner.show();
    try {
      if (this.userService.isTongCuc()) {
        this.loadDsCuc()
      }
      if (this.userService.isCuc()) {
        this.loadDsChiCuc()
      }
      await this.searchData()
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async searchData() {
    this.formData.patchValue({
      maDvi : this.userInfo.MA_DVI
    })
    await this.search();
    if (this.dataTable && this.dataTable.length >0) {
      this.dataTable.forEach(item => {
        let slTon = item.soDuNamTruoc + item.slNhap + item.dieuChinhTang - item.dieuChinhGiam - item.slCanThanhLy
        if (slTon >= 0) {
          item.slTon = slTon
        } else {
          item.slTon = 0
        }
      })
    }
  }


  redirectToChiTiet(id: number, isView?: boolean) {
    this.idSelected = id;
    this.isDetail = true;
    this.isViewDetail = isView ?? false;
  }


  async loadDsCuc() {
    const body = {
      maDviCha: this.userInfo.MA_DVI,
      trangThai: '01',
    };

    const dsTong = await this.dviService.layDonViTheoCapDo(body);
    this.dsCuc = dsTong[DANH_MUC_LEVEL.CUC];
    this.dsCuc = this.dsCuc.filter(item => item.type != "PB")
  }

  async loadDsChiCuc() {
    const body = {
      maDviCha: this.userInfo.MA_DVI,
      trangThai: '01',
    };

    const dsTong = await this.dviService.layDonViTheoCapDo(body);
    this.dsChiCuc = dsTong[DANH_MUC_LEVEL.CHI_CUC];
    this.dsChiCuc = this.dsChiCuc.filter(item => item.type != "PB")
  }

  openDialog(data : any, isView : boolean) {
      let modalQD = this.modal.create({
        nzContent: MmThongTinHienTrangComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzStyle : {top : '150px'},
        nzWidth: '1200',
        nzFooter: null,
        nzComponentParams: {
          dataDetail : data,
          isViewDetail : isView
        },
      });
      modalQD.afterClose.subscribe(async (data) => {
        if (data) {
          await this.searchData()
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
        this.hienTrangSv
          .export(body)
          .subscribe((blob) =>
            saveAs(blob, 'hien-trang-may-moc-chuyen-dung.xlsx'),
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

  chotDuLieu() {
    const today: Date = new Date();
    const endOfYear: Date = new Date(today.getFullYear(), 11, 31);
    let currentYear = dayjs().get('year');
    if (today.getTime() < endOfYear.getTime()) {
      currentYear = currentYear - 1;
    }
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn chốt dữ liệu năm ' + dayjs().get('year') + '? (Không thể cập nhật lại)',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 400,
      nzOnOk: async () => {
        try {
          let body = {
            namKeHoach : currentYear,
            paggingReq : {
              limit: this.pageSize,
              page: this.page - 1
            }
          }
          let res = await this.hienTrangSv.chotDuLieu(body);
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, 'Chốt dữ liệu thành công!');
            await this.searchData()
          } else {
            this.notification.error(MESSAGE.ERROR, res.msg);
          }
        } catch (e) {
          console.log('error', e);
        }
      },
    });
  }
  async changePageIndex(event) {
    this.page = event;
    await this.searchData();
  }

  async changePageSize(event) {
    this.pageSize = event;
    await this.searchData();
  }
}


