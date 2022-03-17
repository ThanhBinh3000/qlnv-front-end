import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NzTreeComponent } from 'ng-zorro-antd/tree';
import { DanhMucService } from '../../../../../services/danhMuc.service';
import { QuanLyVonPhiService } from '../../../../../services/quanLyVonPhi.service';

@Component({
  selector: 'app-dsach-tong-hop-lap-khoach-pbo-giao-dtoan-cua-dvi-trinh-tc',
  templateUrl: './dsach-tong-hop-lap-khoach-pbo-giao-dtoan-cua-dvi-trinh-tc.component.html',
  styleUrls: ['./dsach-tong-hop-lap-khoach-pbo-giao-dtoan-cua-dvi-trinh-tc.component.scss']
})

export class DsachTongHopLapKhoachPboGiaoDtoanCuaDviTrinhTcComponent implements OnInit {
  @ViewChild('nzTreeComponent', { static: false })
  nzTreeComponent!: NzTreeComponent;
  detailDonVi: FormGroup;
  danhSachBaoCao: any = [];
  totalElements = 0;
  totalPages = 0;
  errorMessage = "";
  url!: string;
  indeterminate = true;

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
    nam: "",
    tuNgay: "",
    denNgay: "",
    maBaoCao: "",
    donViTao: "",
    loaiBaoCao: "",
  };
  pages = {
    size: 10,
    page: 1,
  }
  donViTaos: any = [];
  baoCaos: any = [];
  allChecked: any;
  constructor(
    private quanLyVonPhiService: QuanLyVonPhiService,
    private danhMuc: DanhMucService,
    private router: Router,
    private datePipe: DatePipe,
  ) {
  }

  ngOnInit(): void {
    //lay danh sach loai bao cao
    this.danhMuc.dMLoaiBaoCao().toPromise().then(
      data => {
        console.log(data);
        if (data.statusCode == 0) {
          this.baoCaos = data.data?.content;
        } else {
          this.errorMessage = "Có lỗi trong quá trình vấn tin!";
        }
      },
      err => {
        console.log(err);
        this.errorMessage = "err.error.message";
      }
    );

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
      '/kehoach/thong-tin-chi-tieu-ke-hoach-nam-cap-tong-cuc',
      0,
    ]);
  }

  redirectSuaThongTinTimKiem(id) {
    this.router.navigate([
      '/kehoach/thong-tin-chi-tieu-ke-hoach-nam-cap-tong-cuc',
      id,
    ]);
  }

  //search list bao cao theo tieu chi
  onSubmit() {
    let requestReport = {
      maBcao: this.searchFilter.maBaoCao,
      maDvi: this.searchFilter.donViTao,
      maLoaiBcao: this.searchFilter.loaiBaoCao,
      namBcao: this.searchFilter.nam,
      ngayTaoDen: this.searchFilter.tuNgay,
      ngayTaoTu: this.searchFilter.denNgay,
      paggingReq: {
        limit: this.pages.size,
        page: this.pages.page,
      },
      str: "",
      trangThai: "",
    };

    //let latest_date =this.datepipe.transform(this.tuNgay, 'yyyy-MM-dd');
    this.quanLyVonPhiService.timBaoCao(requestReport).toPromise().then(
      (data) => {
        if (data.statusCode == 0) {
          this.danhSachBaoCao = data.data.content;
          this.totalElements = data.data.totalElements;
          this.totalPages = data.data.totalPages;
        } else {
          this.errorMessage = "Có lỗi trong quá trình vấn tin!";
        }
      },
      (err) => {
        this.errorMessage = err.error.message;
      }
    );
  }

  //set url khi
  setUrl(id) {
    switch (id) {
      case 26:
        this.url = '/chi-thuong-xuyen-3-nam/'
        break;
      default:
        this.url = null;
        break;
    }
    console.log(id);

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
  // click o checkbox all
  updateAllChecked(): void {
    this.indeterminate = false;                               // thuoc tinh su kien o checkbox all
    if (this.allChecked) {                                    // checkboxall == true thi set lai lstCTietBCao.checked = true
      this.danhSachBaoCao = this.danhSachBaoCao.map(item => ({
        ...item,
        checked: true
      }));
    } else {
      this.danhSachBaoCao = this.danhSachBaoCao.map(item => ({    // checkboxall == false thi set lai lstCTietBCao.checked = false
        ...item,
        checked: false
      }));
    }
  }
  // click o checkbox single
  updateSingleChecked(): void {
    if (this.danhSachBaoCao.every(item => !item.checked)) {           // tat ca o checkbox deu = false thi set o checkbox all = false
      this.allChecked = false;
      this.indeterminate = false;
    } else if (this.danhSachBaoCao.every(item => item.checked)) {     // tat ca o checkbox deu = true thi set o checkbox all = true
      this.allChecked = true;
      this.indeterminate = false;
    } else {                                                        // o checkbox vua = false, vua = true thi set o checkbox all = indeterminate
      this.indeterminate = true;
    }
  }
}
