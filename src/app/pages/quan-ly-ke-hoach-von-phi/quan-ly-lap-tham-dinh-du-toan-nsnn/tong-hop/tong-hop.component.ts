import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MESSAGE } from 'src/app/constants/message';

import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
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
    private nguoiDungSerivce: UserService,
    private notifi : NzNotificationService
  ) { }

  url: any;
  danhSachBaoCao: any = [];
  baoCaos: any = [];
  donViTaos: any[] = []

  errorMessage: any = '';
  userInfo: any;
  namhientai: any;
  kehoach: any;
  maDonViTao: any;
  loaiBaocao: any;
  async ngOnInit() {

    let username = this.nguoiDungSerivce.getUserName();
    await this.getUserInfor(username);
    //lay danh sach loai bao cao
    this.quanLyVonPhiService.dMLoaiBaoCao().subscribe(
      data => {
        console.log(data);
        if (data.statusCode == 0) {
          this.baoCaos = data.data?.content;
         
        } else {
          this.notifi.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
        }
      },
      err => {
        this.notifi.error(MESSAGE.ERROR,MESSAGE.SYSTEM_ERROR);
      }
    );

    //lay danh sach danh muc
    this.quanLyVonPhiService.dMDonVi().subscribe(
      data => {
        if (data.statusCode == 0) {
          console.log(data);
          this.donViTaos = data.data;
          
        } else {
          this.notifi.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
        }
      },
      err => {
        this.notifi.error(MESSAGE.ERROR,MESSAGE.SYSTEM_ERROR);
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
  setUrl() {
    switch (this.loaiBaocao) {
      
     
      case 207:
        this.url = '/quan-ly-dcdtc-nsnn/du-toan-phi-xuat-hang/';
        break;
      case 204:
        this.url = '/quan-ly-dcdtc-nsnn/ke-hoach-bao-quan-hang-nam';
        break;
      case 307:
          this.url = '/thuyet-minh-chi-cac-de-tai-du-an-nghien-cuu-khoa-hoc-giai-doan-3nam/';
          break;
      case 308:
          this.url = '/ke-hoach-xay-dung-van-ban-qppl-dtqg-3-nam';
          break;
      case 309:
          this.url = '/du-toan-chi-ung-dung-cntt-3-nam';
          break;
      case 310:
          this.url = '/chi-mua-sam-thiet-bi-chuyen-dung-3-nam';
          break;
      case 311:
          this.url = '/chi-ngan-sach-nha-nuoc-3-nam';
          break;
      case 312:
          this.url = '/nhu-cau-phi-nhap-xuat-3-nam';
          break;
      case 313:
          this.url = '/ke-hoach-cai-tao-va-sua-chua-lon-3-nam';
          break;
      case 314:
          this.url = '/ke-hoach-dao-tao-boi-duong-3-nam';
          break;
      case 315:
          this.url = '/nhu-cau-ke-hoach-dtxd3-nam/';
          break;
      case 316:
        this.url = '/tong-hop-du-toan-chi-thuong-xuyen-hang-nam';
        break;
      case 317:
        this.url = '/du-toan-xuat-nhap-hang-dtqg-hang-nam';
        break;
      case 318:
        this.url = '/ke-hoach-bao-quan-hang-nam';
        break;
      case 319:
        this.url = '/du-toan-phi-xuat-hang-dtqg-hang-nam-vtct';
        break;
      case 320:
        this.url = '/ke-hoach-du-toan-cai-tao-sua-chua-ht-kt3-nam/';
        break;
      case 321:
        this.url = '/ke-hoach-quy-tien-luong-nam-n1/';
        break;
      case 322:
          this.url ='/du-toan-chi-du-tru-quoc-gia-gd3-nam/';
        break;
      case 324:
        this.url = '/ke-hoach-xay-dung-van-ban-quy-pham-phap-luat-dtqg-giai-doan-3nam';
        break;
      case 325:
        this.url = '/du-toan-chi-ung-dung-cntt-giai-doan-3nam';
        break;
      case 326:
        this.url = '/du-toan-chi-mua-sam-may-moc-thiet-chi-chuyen-dung-3nam';
        break;
      case 327:
        this.url = '/tong-hop-nhu-cau-chi-ngan-sach-nha-nuoc-giai-doan-3nam';
        break;
      case 328:
        this.url = '/tong-hop-nhu-cau-chi-thuong-xuyen-giai-doan-3nam';
        break;
      case 329:
        this.url = '/chi-tiet-nhu-cau-chi-thuong-xuyen-giai-doan-3nam';
        break;
      case 330:
        this.url = '/tong-hop-muc-tieu-nhiem-vu-chu-yeu-va-nhu-cau-chi-moi-giai-doan-3nam';
        break;
      default:
        break;
    }

  }

  //lay ten don vi tạo
  getUnitName() {
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
