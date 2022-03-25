import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NzTreeComponent } from 'ng-zorro-antd/tree';
import { DanhMucHDVService } from '../../../../../services/danhMucHDV.service';
import { QuanLyVonPhiService } from '../../../../../services/quanLyVonPhi.service';

@Component({
  selector: 'app-chon-khoan-muc',
  templateUrl: './chon-khoan-muc.component.html',
  styleUrls: ['./chon-khoan-muc.component.scss']
})

export class ChonKhoanMucComponent implements OnInit {
  @ViewChild('nzTreeComponent', { static: false })
  nzTreeComponent!: NzTreeComponent;
  detailDonVi: FormGroup;
  danhSachBaoCao: any = [];
  totalElements = 0;
  totalPages = 0;
  errorMessage = "";
  url: string = "nhap-quyet-dinh-giao-du-toan-chi-nsnn-btc-pd/";

  // phan cu cua teca
  visible = false;
  nodes: any = [];
  nodeDetail: any;
  listDonViDuoi = [];
  cureentNodeParent: any = [];
  datasNguoiDung: any = [];
  nodeSelected: any = [];
  listHTDV: any = [];
  listKPB: any = [];
  noParent = true;
  searchValue = '';

  searchFilter = {
    tuNgay: "",
    denNgay: "",
    maBaoCao: "",
    donViTao: "",
    loaiBaoCao: "",
    noiQd: "",
    soQd: "",
    vanBan: "",
  };
  pages = {
    size: 10,
    page: 1,
  }
  donViTaos: any = [];
  baoCaos: any = [];
  constructor(
    private quanLyVonPhiService: QuanLyVonPhiService,
    private danhMuc: DanhMucHDVService,
    private router: Router,
    private datePipe: DatePipe,
  ) {
  }

  ngOnInit(): void {
    //lay danh sach danh muc
    this.danhMuc.dMDonVi().toPromise().then(
      data => {
        if (data.statusCode == 0) {
          this.donViTaos = data.data;
        } else {
          this.errorMessage = "Có lỗi trong quá trình vấn tin!";
        }
      },
      err => {
        this.errorMessage = "err.error.message";
      }
    );
  }

  redirectThongTinTimKiem() {
    this.router.navigate([
      '/qlkh-von-phi/quan-ly-giao-du-toan-chi-nsnn/nhap-quyet-dinh-giao-du-toan-chi-nsnn-btc-pd',
      0,
    ]);
  }

  redirectSuaThongTinTimKiem(id) {
    this.router.navigate([
      '/qlkh-von-phi/quan-ly-giao-du-toan-chi-nsnn/nhap-quyet-dinh-giao-du-toan-chi-nsnn-btc-pd',
      id,
    ]);
  }

  redirectQLGiaoDTChi() {
    this.router.navigate(['/qlkh-von-phi/quan-ly-giao-du-toan-chi-nsnn']);
  }

  //search list bao cao theo tieu chi
  onSubmit() {
    let requestReport = {
      ngayTaoDen: this.searchFilter.denNgay,
      ngayTaoTu: this.searchFilter.tuNgay,
      noiQd: this.searchFilter.noiQd,
      paggingReq: {
        limit: this.pages.size,
        page: this.pages.page
      },
      soQd: this.searchFilter.soQd,
      str: "",
      trangThai: ""
    };

    //let latest_date =this.datepipe.transform(this.tuNgay, 'yyyy-MM-dd');
    this.quanLyVonPhiService.timBaoCaoGiao(requestReport).toPromise().then(
      (data) => {
        if (data.statusCode == 0) {
          this.danhSachBaoCao = data.data.content;
          this.totalElements = data.data.totalElements;
          this.totalPages = data.data.totalPages;
          console.log(this.danhSachBaoCao);

        } else {
          this.errorMessage = "Có lỗi trong quá trình vấn tin!";
        }
      },
      (err) => {
        this.errorMessage = err.error.message;
      }
    );
  }

  //doi so trang
  onPageIndexChange(page) {
    this.pages.page = page;
    this.onSubmit();
  }

  //doi so luong phan tu tren 1 trang
  onPageSizeChange(size) {
    this.pages.size = size;
    this.onSubmit();
  }
}
