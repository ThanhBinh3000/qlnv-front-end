
import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NzTreeComponent } from 'ng-zorro-antd/tree';
import { DanhMucService } from '../../../../../services/danhMuc.service';
import { QuanLyVonPhiService } from '../../../../../services/quanLyVonPhi.service';


@Component({
  selector: 'app-ds-khoach-pbo-giao-dtoan-cho-chi-cuc-DTNN',
  templateUrl: './ds-khoach-pbo-giao-dtoan-cho-chi-cuc-DTNN.component.html',
  styleUrls: ['./ds-khoach-pbo-giao-dtoan-cho-chi-cuc-DTNN.component.scss']
})

export class DsKhoachPboGiaoDtoanChoChiCucDTNNComponent implements OnInit {
  @ViewChild('nzTreeComponent', { static: false })
  nzTreeComponent!: NzTreeComponent;
  detailDonVi: FormGroup;
  danhSachBaoCao: any = [];
  totalElements = 0;
  totalPages = 0;
  errorMessage = "";
  url: string = "nhap-quyet-dinh-giao-du-toan-chi-nsnn-btc-pd/";
  lyDoTuChoi!: any;
  allChecked = false;                         // check all checkbox
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
    tuNgay: "",
    denNgay: "",
    maBaoCao: "",
    donViTao: "",
    loaiBaoCao: "",
    noiQd: "",
    soQd: "",
    vanBan: "",
    nam: "",
    maDvi: "",
  };
  pages = {
    size: 10,
    page: 1,
  }
  donViTaos: any = [];
  baoCaos: any = [];
  constructor(
    private quanLyVonPhiService: QuanLyVonPhiService,
    private danhMuc: DanhMucService,
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
      '/qlkh-von-phi/quan-ly-giao-du-toan-chi-nsnn/lap-du-toan-chi-ngan-sach-cho-don-vi',
      0,
    ]);
  }

  redirectSuaThongTinTimKiem(id) {
    this.router.navigate([
      '/qlkh-von-phi/quan-ly-giao-du-toan-chi-nsnn/lap-du-toan-chi-ngan-sach-cho-don-vi',
      id,
    ]);
  }

  redirectQLGiaoDTChi() {
    this.router.navigate(['/qlkh-von-phi/quan-ly-giao-du-toan-chi-nsnn']);
  }

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
      trangThai: "",
      maDvi: this.searchFilter.maDvi,

    };

    //let latest_date =this.datepipe.transform(this.tuNgay, 'yyyy-MM-dd');
    this.quanLyVonPhiService.timDanhSachPhanBo(requestReport).toPromise().then(
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
