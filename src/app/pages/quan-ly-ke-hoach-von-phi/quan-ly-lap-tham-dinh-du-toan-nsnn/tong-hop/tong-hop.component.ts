import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NguoiDungService } from 'src/app/services/nguoidung.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { Utils } from 'src/app/Utility/utils';

@Component({
  selector: 'app-tong-hop',
  templateUrl: './tong-hop.component.html',
  styleUrls: ['./tong-hop.component.scss']
})
export class TongHopComponent implements OnInit {

  constructor(
    private quanLyVonPhiService: QuanLyVonPhiService,
    private router: Router,
    private datePipe: DatePipe,
    private nguoiDungSerivce: NguoiDungService,
  ) { }

  url:any;
  danhSachBaoCao: any = [];
  baoCaos:any =[];
  donViTaos:any [] = []
  
  errorMessage:any='';
  userInfo:any;
  namhientai:any;
  kehoach:any;
  maDonViTao:any;
  loaiBaocao:any;
  async ngOnInit() {

    let username = localStorage.getItem('userName');
    await this.getUserInfor(username);
     //lay danh sach loai bao cao
     this.quanLyVonPhiService.dMLoaiBaoCao().subscribe(
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
  this.quanLyVonPhiService.dMDonVi().subscribe(
      data => {
          if (data.statusCode == 0) {
            console.log(data);
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

  

  totalElements = 0;
  totalPages = 0;
  pages = {
    size: 10,
    page: 1,
  }

  //get user info
  async getUserInfor(username: string) {
    let userInfo = await this.nguoiDungSerivce.getUserInfo(username).toPromise().then(
      (data) => {
        if (data?.statusCode == 0) {
          console.log(data);
          this.userInfo = data?.data
          this.maDonViTao = this.userInfo?.dvql;
          console.log(this.maDonViTao);
          return data?.data;
        } else {

        }
      },
      (err) => {
        console.log(err);
      }
    );
    return userInfo;
  }
 

  //set url khi
  setUrl(){
    debugger
    switch (this.loaiBaocao) {

        case 207:
            this.url = '/quan-ly-dcdtc-nsnn/du-toan-phi-xuat-hang/'
            break;
        case 204:
            this.url = '/quan-ly-dcdtc-nsnn/ke-hoach-bao-quan-hang-nam'
            break;
        case 324:
          this.url = '/ke-hoach-xay-dung-van-ban-quy-pham-phap-luat-dtqg-giai-doan-3nam'
            break;
        case 307:
          this.url = '/thuyet-minh-chi-cac-de-tai-du-an-nghien-cuu-khoa-hoc-giai-doan-3nam'
            break;
        default:
            break;
    }
    
}

//lay ten don vi tạo
  getUnitName(){
    return this.donViTaos.find(item => item.maDvi == this.maDonViTao)?.tenDvi;
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
