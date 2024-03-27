import { Component, OnInit } from '@angular/core';
import { HienTrangMayMoc } from '../../../constants/status';
import { HttpClient } from '@angular/common/http';
import { StorageService } from '../../../services/storage.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { NzModalService } from 'ng-zorro-antd/modal';
import { MmHienTrangMmService } from '../../../services/mm-hien-trang-mm.service';
import { DonviService } from '../../../services/donvi.service';
import { MESSAGE } from '../../../constants/message';
import { DANH_MUC_LEVEL } from '../../luu-kho/luu-kho.constant';
import {
  MmThongTinHienTrangComponent
} from '../../dinh-muc/may-moc-thiet-bi/mm-hien-trang-ccdc/mm-thong-tin-hien-trang/mm-thong-tin-hien-trang.component';
import dayjs from 'dayjs';
import { Base2Component } from '../../../components/base2/base2.component';
import { HtCongCuDungCuDtlKhoiTao, HtCongCuDungCuKhoiTao } from '../ht-cong-cu-dung-cu/ht-cong-cu-dung-cu.component';
import { FileDinhKem } from '../../../models/FileDinhKem';
import {saveAs} from 'file-saver';
import { cloneDeep } from 'lodash';
import { DanhMucService } from '../../../services/danhmuc.service';
import { HienTrangMayMocService } from '../../../services/dinh-muc-nhap-xuat-bao-quan/pvc/hien-trang-may-moc.service';
import { DanhMucTaiSanService } from '../../../services/danh-muc-tai-san.service';

@Component({
  selector: 'app-ht-may-moc-thiet-bi',
  templateUrl: './ht-may-moc-thiet-bi.component.html',
  styleUrls: ['./ht-may-moc-thiet-bi.component.scss']
})
export class HtMayMocThietBiComponent extends Base2Component implements OnInit  {
  isViewDetail : boolean;
  dsCuc : any[] = [];
  dsChiCuc : any[] = [];
  statusMm = HienTrangMayMoc;
  rowItem  = new HtCongCuDungCuKhoiTao();
  listDmTaiSan : any[] = [];
  constructor(
    private httpClient: HttpClient,
    private storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private dmTaiSanService: DanhMucTaiSanService,
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
      trangThaiKt: [null],
    });
  }

  async ngOnInit() {
    this.spinner.show();
    try {
      await this.getAllDmTaiSan();
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

  hoanThanh(id) {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn hoàn thành bản ghi khởi tạo này?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 310,
      nzOnOk: async () => {
        this.spinner.show();
        try {
          let body = {
            id: id,
          };
          let res =
            await this.hienTrangSv.hoanThanhKhoiTao(
              body,
            );
          if (res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
            this.searchData();
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
  async changePageIndex(event) {
    this.page = event;
    await this.searchData();
  }

  async changePageSize(event) {
    this.pageSize = event;
    await this.searchData();
  }

  async  themMoiItem() {
    if (!this.dataTable) {
      this.dataTable = [];
    }
    if (this.rowItem.maTaiSan &&  this.rowItem.tenTaiSan &&  this.rowItem.namKeHoach) {
      this.sortTableId();
      this.rowItem.maDvi  = this.userInfo.MA_DVI;
      this.rowItem.tenDvi  = this.userInfo.TEN_DVI;
      this.rowItem.capDvi  = (this.userInfo.MA_DVI.length / 2) -1;
      this.rowItem.trangThaiKt = '01';
      this.rowItem.trangThai = '00';
      let item = cloneDeep(this.rowItem);
      item.listQlDinhMucHienTrangMmtbDtlReq = this.taoChiTietGiaoDichCcdc(item);
      item.stt = this.dataTable.length + 1;
      item.edit = false;
      this.dataTable = [
        ...this.dataTable,
        item,
      ];
      let res = await this.hienTrangSv.create(item);
      if(res.msg == MESSAGE.SUCCESS){
        this.notification.success(MESSAGE.SUCCESS, 'Thêm mới thành công.');
      }
      this.rowItem = new HtCongCuDungCuKhoiTao();
      // this.updateEditCache();
      // this.emitDataTable();
    } else {
      this.notification.error(MESSAGE.ERROR, 'Vui lòng điền đầy đủ thông tin');
    }
  }

  taoChiTietGiaoDichCcdc(itemHdr){
    let  listDtl = [];
    //giao dịch nhập - khi có sl nhập
    if(itemHdr && itemHdr.slNhap > 0){
      let dtlNhap = new HtCongCuDungCuDtlKhoiTao()
      dtlNhap.slTang = itemHdr.slNhap;
      dtlNhap.loaiGiaoDich = '01';
      dtlNhap.soPhieu = 'Khởi tạo số dư';
      listDtl.push(dtlNhap);
    }
    if(itemHdr && itemHdr.dieuChinhTang > 0){
      let dtlNhap = new HtCongCuDungCuDtlKhoiTao()
      dtlNhap.slTang = itemHdr.dieuChinhTang;
      dtlNhap.loaiGiaoDich = '02';
      dtlNhap.soPhieu = 'Khởi tạo số dư';
      listDtl.push(dtlNhap);
    }
    if(itemHdr && itemHdr.dieuChinhGiam > 0){
      let dtlNhap = new HtCongCuDungCuDtlKhoiTao()
      dtlNhap.slGiam = itemHdr.dieuChinhGiam;
      dtlNhap.loaiGiaoDich = '02';
      dtlNhap.soPhieu = 'Khởi tạo số dư';
      listDtl.push(dtlNhap);
    }
    if(itemHdr && itemHdr.slCanSuaChua > 0){
      let dtlNhap = new HtCongCuDungCuDtlKhoiTao()
      dtlNhap.slTang = itemHdr.slCanSuaChua;
      dtlNhap.loaiGiaoDich = '04';
      dtlNhap.soPhieu = 'Khởi tạo số dư';
      listDtl.push(dtlNhap);
    }
    if(itemHdr && itemHdr.slCanThanhLy > 0){
      let dtlNhap = new HtCongCuDungCuDtlKhoiTao()
      dtlNhap.slTang = itemHdr.slCanThanhLy;
      dtlNhap.loaiGiaoDich = '03';
      dtlNhap.soPhieu = 'Khởi tạo số dư';
      listDtl.push(dtlNhap);
    }
    return listDtl;
  }

  sortTableId() {
    this.dataTable.forEach((lt, i) => {
      lt.stt = i + 1;
    });
  }

  clearData() {
    this.rowItem = new HtCongCuDungCuKhoiTao();
  }

  async getAllDmTaiSan() {
    let body = {
      paggingReq: {
        limit: 10000,
        page: 0,
      }
    };
    let res = await this.dmTaiSanService.searchDsChuaSuDung(body);
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data && res.data.content && res.data.content.length > 0) {
        this.listDmTaiSan = res.data.content;
      }
      console.log(this.listDmTaiSan ,'this.listDmTaiSanthis.listDmTaiSanthis.listDmTaiSan ');
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  onChangeCcdc(val){
    if(val){
      let item = this.listDmTaiSan.find(item => item.maCcdc ==val);
      this.rowItem.tenTaiSan = item ? item.tenCcdc : '';
      this.rowItem.donViTinh = item ? item.donViTinh : '';
    }
  }
}


