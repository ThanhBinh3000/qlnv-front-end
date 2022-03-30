import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTreeComponent } from 'ng-zorro-antd/tree';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { MESSAGE } from 'src/app/constants/message';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-tong-hop-bao-cao-ket-qua-thuc-hien-von-phi-hang-DTQG',
  templateUrl: './tong-hop-bao-cao-ket-qua-thuc-hien-von-phi-hang-DTQG.component.html',
  styleUrls: ['./tong-hop-bao-cao-ket-qua-thuc-hien-von-phi-hang-DTQG.component.scss']
})
export class TongHopBaoCaoKetQuaThucHienVonPhiHangDTQGComponent implements OnInit {

  constructor(
    private quanLyVonPhiService: QuanLyVonPhiService,
    private danhmuc: DanhMucHDVService,
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

  //-----------
  ngayNhap:any;
  nguoiNhap:any;
  donVitao:any;
  namBaocao:any;
  loaiBaocao:any;
  dotBaocao:any;
  async ngOnInit() {

    let username = this.nguoiDungSerivce.getUserName();
    await this.getUserInfor(username);
    //lay danh sach loai bao cao
    this.danhmuc.dMLoaiBaoCaoKetQuaThucHienHangDTQG().subscribe(
      data => {

        if (data.statusCode == 0) {
          this.baoCaos = data.data?.content;

        } else {
          this.notifi.error(MESSAGE.ERROR,data?.msg);
        }
      },
      err => {
        this.notifi.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
    );

    //lay danh sach danh muc
    this.quanLyVonPhiService.dMDonVi().subscribe(
      data => {
        if (data.statusCode == 0) {
          console.log(data);
          this.donViTaos = data.data;

        } else {
          this.notifi.error(MESSAGE.ERROR,data?.msg);
        }
      },
      err => {
        this.notifi.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
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
          this.donVitao = this.userInfo?.dvql;
          this.nguoiNhap = data?.data.username;
          console.log(this.userInfo);
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
      case 407:
        this.url = '/lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-dtqg-tai-chi-cuc-mau02/';
        break;
      case 408:
          this.url = '/lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-dtqg-tai-chi-cuc-mau03/';
          break;
      case 409:
        this.url = '/lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-dtqg-tai-chi-cuc-mau04a/';
        break;
      case 410:
        this.url = '/lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-dtqg-tai-chi-cuc-mau04b/';
        break;
      case 411:
        this.url = '/lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-dtqg-tai-chi-cuc-mau05/';
        break;
      default:
        break;
    }

  }

  //lay ten don vi tạo
  getUnitName() {
    return this.donViTaos.find(item => item.maDvi == this.donVitao)?.tenDvi;
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
