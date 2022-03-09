import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NzTreeComponent } from 'ng-zorro-antd/tree';
import { DanhMucService } from 'src/app/services/danhMuc.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';

@Component({
  selector: 'app-tim-kiem-bao-cao-thuc-hien-von-phi-hang-DTQG',
  templateUrl: './tim-kiem-bao-cao-thuc-hien-von-phi-hang-DTQG.component.html',
  styleUrls: ['./tim-kiem-bao-cao-thuc-hien-von-phi-hang-DTQG.component.scss']
})
export class TimKiemBaoCaoThucHienVonPhiHangDTQGComponent implements OnInit {

  @ViewChild('nzTreeComponent', { static: false })
  nzTreeComponent!: NzTreeComponent;
  detailDonVi: FormGroup;
  danhSachBaoCao: any = [];
  totalElements = 0;
  totalPages = 0;
  errorMessage = "";
  url!: string;

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
    donvitao:'',
    ngaylap:'',
    denngay:'',
    trangthai:'',
    mabaocao:'',
    loaibaocao:'',
    nambaocao:'',
    dotbaocao:'',
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

  
  taomoi(){

  }
 

  //set url khi
  setUrl(lbaocao:any) {
    
    switch (lbaocao) {
      case '02':
        this.url = '/lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-dtqg-tai-chi-cuc-mau02'
        break;
      case '03':
        this.url = '/lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-dtqg-tai-chi-cuc-mau03'
        break;
      case '04a':
        this.url = '/lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-dtqg-tai-chi-cuc-mau04a'
        break;
      case '04b':
        this.url = '/lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-dtqg-tai-chi-cuc-mau04b'
        break;
      case '05':
        this.url = '/lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-dtqg-tai-chi-cuc-mau05'
        break;
      default:
        this.url = null;
        break;
    }
   console.log(lbaocao);

  }

  //doi so trang
  onPageIndexChange(page) {
    this.pages.page = page;
  }

  //doi so luong phan tu tren 1 trang
  onPageSizeChange(size) {
    this.pages.size = size;
  }

}
