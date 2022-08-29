import { DatePipe, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { DataService } from 'src/app/services/data.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { Utils } from 'src/app/Utility/utils';
import { GIAO_DU_TOAN, MAIN_ROUTE_DU_TOAN, MAIN_ROUTE_KE_HOACH } from '../../giao-du-toan-chi-nsnn.constant';

// loai trang thai kiem tra
export const TRANG_THAI_GIAO_DU_TOAN = [
  {
    id: '1',
    tenDm: "Chưa nhận",
  },
  {
    id: '2',
    tenDm: "Đã nhận",
  },
]
@Component({
  selector: 'app-kiem-tra-ra-soat-phuong-an-tu-cuc-khu-vuc',
  templateUrl: './kiem-tra-ra-soat-phuong-an-tu-cuc-khu-vuc.component.html',
  styleUrls: ['./kiem-tra-ra-soat-phuong-an-tu-cuc-khu-vuc.component.scss']
})

export class KiemTraRaSoatPhuongAnTuCucKhuVucComponent implements OnInit {
  totalElements = 0;
  totalPages = 0;
  listBcaoKqua: any[] = [];
  trangThais: any = TRANG_THAI_GIAO_DU_TOAN;                          // danh muc loai bao cao
  trangThai!: string;
  pages = {
    size: 10,
    page: 1,
  }
  searchFilter = {
    maPhanGiao: '2',
    maLoai: '1',
    loaiTimKiem: "1",
    maDvi: '',
    ngayTaoTu: '',
    ngayTaoDen: '',
    trangThais: [],
    maBcao: '',
    maLoaiDuAn: '',
    namBcao: null,
    thangBcao: '',
    dotBcao: '',
    paggingReq: {
      limit: this.pages.size,
      page: this.pages.page
    },
    str: '',
    donVi: '',
  };
  date: any = new Date()

  donViTaos: any = [];
  loaiDuAns: any[] = [
    {
      id: '1',
      tenDm: 'Giao dự toán'
    },
    {
      id: '2',
      tenDm: 'Giao, diều chỉnh dự toán'
    }
  ];


  constructor(
    private quanLyVonPhiService: QuanLyVonPhiService,
    private danhMuc: DanhMucHDVService,
    private router: Router,
    private datePipe: DatePipe,
    private notification: NzNotificationService,
    private location: Location,
    private spinner: NgxSpinnerService,
    private dataSource: DataService,
  ) {
  }

  async ngOnInit() {
    this.spinner.show()
    this.searchFilter.ngayTaoDen = new Date().toISOString().slice(0, 16);
    this.date.setMonth(this.date.getMonth() - 1);
    this.searchFilter.ngayTaoTu = this.date.toISOString().slice(0, 16);
    this.searchFilter.namBcao = new Date().getFullYear()
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
    this.listBcaoKqua = []
    await this.onSubmit();
    this.spinner.hide();
  }

  // lay ten don vi tao
  getUnitName(dvitao: any) {
    return this.donViTaos.find(item => item.maDvi == dvitao)?.tenDvi;
  }

  async onSubmit() {
    this.spinner.show();
    this.searchFilter.trangThais = [];
    if (this.trangThai) {
      this.searchFilter.trangThais.push(this.trangThai)
    } else {
      this.searchFilter.trangThais = ['1', '2']
    }
    await this.quanLyVonPhiService.timBaoCaoGiao(this.searchFilter).toPromise().then(res => {
      if (res.statusCode == 0) {
        console.log(res);
        this.listBcaoKqua = res.data.content;
        this.listBcaoKqua.forEach(e => {
          e.ngayPheDuyet = this.datePipe.transform(e.ngayPheDuyet, Utils.FORMAT_DATE_STR);
          e.ngayDuyet = this.datePipe.transform(e.ngayDuyet, Utils.FORMAT_DATE_STR);
          e.ngayTrinh = this.datePipe.transform(e.ngayTrinh, Utils.FORMAT_DATE_STR);
          e.ngayTraKq = this.datePipe.transform(e.ngayTraKq, Utils.FORMAT_DATE_STR);
          e.ngayTao = this.datePipe.transform(e.ngayTao, Utils.FORMAT_DATE_STR);
        })
        this.totalElements = res.data?.totalElements;
        this.totalPages = res.data?.totalPages;
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
    const obj = {
      tabSelected: 'giaodutoan',
    }
    this.dataSource.changeData(obj);
    this.router.navigate([
      MAIN_ROUTE_KE_HOACH + '/' + MAIN_ROUTE_DU_TOAN,
    ]);
  }

  getStatusName(id) {

    return this.getStatusName1(id);
  }

  // lay ten trang thai theo ma trang thai
  public getStatusName1(id: string) {
    let statusName;
    switch (id) {
      case Utils.TT_BC_1:
        statusName = "Chưa nhận"
        break;
      case Utils.TT_BC_2:
        statusName = "Đã nhận"
        break;
      default:
        statusName = id;
        break;
    }
    return statusName;
  }

  xemChiTiet(id: string) {
    this.router.navigate([
      MAIN_ROUTE_KE_HOACH + '/' + MAIN_ROUTE_DU_TOAN + '/' + GIAO_DU_TOAN + '/giao-du-toan-chi-NSNN-cho-cac-don-vi/' + id,
    ])
  }
  xoaDieuKien() {
    this.searchFilter.namBcao = null;
    this.searchFilter.maLoaiDuAn = null;
    this.trangThai = null
  }
}
