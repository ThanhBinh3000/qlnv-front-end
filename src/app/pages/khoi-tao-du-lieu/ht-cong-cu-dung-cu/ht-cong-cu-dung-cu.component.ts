import { Component, OnInit } from '@angular/core';
import { Base2Component } from '../../../components/base2/base2.component';
import { HienTrangMayMoc, TRANG_THAI_CTNC } from '../../../constants/status';
import { HttpClient } from '@angular/common/http';
import { StorageService } from '../../../services/storage.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { NzModalService } from 'ng-zorro-antd/modal';
import { HienTrangMayMocService } from '../../../services/dinh-muc-nhap-xuat-bao-quan/pvc/hien-trang-may-moc.service';
import { DonviService } from '../../../services/donvi.service';
import { MESSAGE } from '../../../constants/message';
import { DANH_MUC_LEVEL } from '../../luu-kho/luu-kho.constant';
import {saveAs} from 'file-saver';
import {
  PvcThongTinHienTrangComponent
} from '../../dinh-muc/mang-pvc-cong-cu-dung-cu/hien-trang-ccdc-pvc/pvc-thong-tin-hien-trang/pvc-thong-tin-hien-trang.component';
import dayjs from 'dayjs';
import { TienDoThucHien } from '../../../models/KhoaHocCongNgheBaoQuan';

@Component({
  selector: 'app-ht-cong-cu-dung-cu',
  templateUrl: './ht-cong-cu-dung-cu.component.html',
  styleUrls: ['./ht-cong-cu-dung-cu.component.scss']
})
export class HtCongCuDungCuComponent extends Base2Component implements OnInit  {
  isViewDetail : boolean;
  dsCuc : any[] = [];
  dsChiCuc : any[] = [];
  statusMm = HienTrangMayMoc;
  TRANG_THAI_CTNC = TRANG_THAI_CTNC;
  constructor(
    private httpClient: HttpClient,
    private storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private hienTrangSv : HienTrangMayMocService,
    private dviService : DonviService
  ) {
    super(httpClient, storageService, notification, spinner, modal, hienTrangSv);
    super.ngOnInit()
    this.formData = this.fb.group({
      maDvi: [null],
      capDvi: [null],
      namKeHoach: [null],
      tenCcdc: [null],
      maCcdc: [null],
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
      nzContent: PvcThongTinHienTrangComponent,
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
            namKeHoach : dayjs().get('year'),
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
            this.notification.error(MESSAGE.ERROR, 'Thao tác thất bại!');
          }
        } catch (e) {
          console.log('error', e);
        }
      },
    });
  }

  themMoiItem() {
    if (!this.dataTable) {
      this.dataTable = [];
    }
    // if (this.rowItem.noiDung && this.rowItem.sanPham != null) {
    //   this.sortTableId();
    //   let item = cloneDeep(this.rowItem);
    //   item.stt = this.dataTable.length + 1;
    //   item.edit = false;
    //   this.dataTable = [
    //     ...this.dataTable,
    //     item,
    //   ];
    //
    //   this.rowItem = new TienDoThucHien();
    //   this.updateEditCache();
    //   this.emitDataTable();
    // } else {
    //   this.notification.error(MESSAGE.ERROR, 'Vui lòng điền đầy đủ thông tin');
    // }
  }

  clearData() {
    // this.rowItem = new TienDoThucHien();
  }


}
