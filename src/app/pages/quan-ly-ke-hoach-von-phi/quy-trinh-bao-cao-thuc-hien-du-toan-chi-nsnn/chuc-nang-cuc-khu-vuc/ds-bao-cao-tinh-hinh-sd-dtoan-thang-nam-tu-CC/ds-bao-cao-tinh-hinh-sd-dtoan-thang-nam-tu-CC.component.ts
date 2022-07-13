import { DatePipe, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as fileSaver from 'file-saver';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { LBC_QUY_TRINH_THUC_HIEN_DU_TOAN_CHI, TRANG_THAI_GUI_DVCT, Utils } from 'src/app/Utility/utils';


@Component({
  selector: 'app-ds-bao-cao-tinh-hinh-sd-dtoan-thang-nam-tu-CC',
  templateUrl: './ds-bao-cao-tinh-hinh-sd-dtoan-thang-nam-tu-CC.component.html',
  styleUrls: ['./ds-bao-cao-tinh-hinh-sd-dtoan-thang-nam-tu-CC.component.scss']
})

export class DsBaoCaoTinhHinhSdDtoanThangNamTuCCComponent implements OnInit {
  totalElements = 0;
  totalPages = 0;

  listBcaoKqua: any[] = [];

  trangThais: any = TRANG_THAI_GUI_DVCT;                          // danh muc loai bao cao
  trangThai!: string;
  searchFilter = {
    ngayTaoTu: '',
    ngayTaoDen: '',
    trangThais: [],
    maBcao: '',
    maLoaiBcao: '',
    namBcao: null,
    thangBcao: null,
    dotBcao: '',
    paggingReq: {
      limit: 10,
      page: 1
    },
    str: '',
    donVi: '',
    maPhanBcao: '0',
    loaiTimKiem: '1',
  };

  donViTaos: any = [];
  baoCaos: any = LBC_QUY_TRINH_THUC_HIEN_DU_TOAN_CHI;
  constructor(
    private quanLyVonPhiService: QuanLyVonPhiService,
    private danhMuc: DanhMucHDVService,
    private router: Router,
    private datePipe: DatePipe,
    private notification: NzNotificationService,
    private location: Location,
    private spinner: NgxSpinnerService,
  ) {
  }

  ngOnInit(): void {
    const date = new Date();
    this.searchFilter.namBcao = date.getFullYear();
    this.searchFilter.thangBcao = date.getMonth();
    this.trangThai = '7';
    this.searchFilter.maLoaiBcao='526';
    this.onSubmit();

    //lay danh sach danh muc
    this.danhMuc.dMDonVi().toPromise().then(
      data => {
        if (data.statusCode == 0) {
          this.donViTaos = data.data;
        } else {
          this.notification.error(MESSAGE.ERROR, data?.msg);
        }
      },
      err => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
    );
  }

  // lay ten don vi tao
  getUnitName(dvitao: any) {
    return this.donViTaos.find(item => item.maDvi == dvitao)?.tenDvi;
  }

  async onSubmit() {
    this.spinner.show();
    const searchFilterTemp = Object.assign({},this.searchFilter);
    searchFilterTemp.trangThais= [];
    searchFilterTemp.ngayTaoTu = this.datePipe.transform(searchFilterTemp.ngayTaoTu, Utils.FORMAT_DATE_STR) || searchFilterTemp.ngayTaoTu;
    searchFilterTemp.ngayTaoDen = this.datePipe.transform(searchFilterTemp.ngayTaoDen, Utils.FORMAT_DATE_STR) || searchFilterTemp.ngayTaoDen;
    if (this.trangThai) {
      searchFilterTemp.trangThais.push(this.trangThai)
    } else {
      searchFilterTemp.trangThais = [Utils.TT_BC_7, Utils.TT_BC_8, Utils.TT_BC_9]
    }
    await this.quanLyVonPhiService.timBaoCao(searchFilterTemp).toPromise().then(res => {
      if (res.statusCode == 0) {
        this.listBcaoKqua = res.data?.content;
        this.listBcaoKqua.forEach(e => {
          e.congVan = JSON.parse(e.congVan);          
          e.ngayPheDuyet = this.datePipe.transform(e.ngayPheDuyet, Utils.FORMAT_DATE_STR);
          e.ngayDuyet = this.datePipe.transform(e.ngayDuyet, Utils.FORMAT_DATE_STR);
          e.ngayTrinh = this.datePipe.transform(e.ngayTrinh, Utils.FORMAT_DATE_STR);
          e.ngayTraKq = this.datePipe.transform(e.ngayTraKq, Utils.FORMAT_DATE_STR);
          e.ngayTao = this.datePipe.transform(e.ngayTao, Utils.FORMAT_DATE_STR);
        })
        this.totalElements = res.data.totalElements;
        this.totalPages = res.data.totalPages;
      } else {
        this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
      }
    }, err => {
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    })
    this.spinner.hide();
  }

  //doi so trang
  onPageIndexChange(page) {
    this.searchFilter.paggingReq.page = page;
    this.onSubmit();
  }

  //doi so luong phan tu tren 1 trang
  onPageSizeChange(size) {
    this.searchFilter.paggingReq.limit = size;
    this.onSubmit();
  }

  close() {
    this.location.back();
  }

  // lay ten trang thai ban ghi
  getStatusName(id) {
    return TRANG_THAI_GUI_DVCT.find(item => item.id == id)?.ten
  }

  //download file về máy tính
  async downloadFileCv(fileUrl, fileName) {
    await this.quanLyVonPhiService.downloadFile(fileUrl).toPromise().then(
      (data) => {
        fileSaver.saveAs(data,fileName);
      },
      err => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      },
    );
  }
}
