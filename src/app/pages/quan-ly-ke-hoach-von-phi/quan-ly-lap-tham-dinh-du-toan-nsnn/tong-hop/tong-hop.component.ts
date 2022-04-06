import { DatePipe, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MESSAGE } from 'src/app/constants/message';

import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { LOAIBAOCAO, Utils } from 'src/app/Utility/utils';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-tong-hop',
  templateUrl: './tong-hop.component.html',
  styleUrls: ['./tong-hop.component.scss']
})
export class TongHopComponent implements OnInit {

  validateForm!: FormGroup;

  submitForm(): void {
    if (this.validateForm.valid) {
      console.log('submit', this.validateForm.value);
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
  constructor(
    private quanLyVonPhiService: QuanLyVonPhiService,
    private router: Router,
    private datePipe: DatePipe,
    private nguoiDungSerivce: UserService,
    private notifi : NzNotificationService,
    private fb:FormBuilder,
    private location: Location,
  ) {}

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

  // validateForm!: FormGroup;

  async ngOnInit() {
    this.validateForm = this.fb.group({
      namhientai: [null, [Validators.required]],
      loaiBaocao: [null, [Validators.required]],
    });
    console.log(this.validateForm);
    let username = this.nguoiDungSerivce.getUserName();
    await this.getUserInfor(username);
    //lay danh sach loai bao cao
    this.baoCaos = LOAIBAOCAO;


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

  tonghop(){

    if(this.namhientai==undefined || this.loaiBaocao ==null){

      this.router.navigate(['/qlkh-von-phi/quan-ly-lap-tham-dinh-du-toan-nsnn/tong-hop'])
    } else{
      this.router.navigate(['/qlkh-von-phi/quan-ly-lap-tham-dinh-du-toan-nsnn/'+this.url+'/'+this.maDonViTao+'/'+this.loaiBaocao+'/'+this.namhientai])
    }

  }

  taomoi(){
    if(this.namhientai==undefined || this.loaiBaocao ==null){

      this.router.navigate(['/qlkh-von-phi/quan-ly-lap-tham-dinh-du-toan-nsnn/tong-hop'])
    } else{
      this.router.navigate(['/qlkh-von-phi/quan-ly-lap-tham-dinh-du-toan-nsnn/'+this.url])
    }
  }
  dong(){
    // this.router.navigate(['/qlkh-von-phi/quan-ly-lap-tham-dinh-du-toan-nsnn'])
    this.location.back();
  }

  setkeHoach(){
    this.kehoach=0;
    this.kehoach = Number(this.namhientai)+3
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
      case '24':
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
      case '14':
          this.url = '/ke-hoach-cai-tao-va-sua-chua-lon-3-nam';
          break;
      case '32':
          this.url = '/ke-hoach-dao-tao-boi-duong-3-nam-tc';
          break;
      case '16':
          this.url = '/nhu-cau-ke-hoach-dtxd3-nam/';
          break;
      case '17':
        this.url = '/tong-hop-du-toan-chi-thuong-xuyen-hang-nam';
        break;
      case '18':
        this.url = '/du-toan-xuat-nhap-hang-dtqg-hang-nam';
        break;
      case '19':
        this.url = '/ke-hoach-bao-quan-hang-nam';
        break;
      case '20':
        this.url = '/du-toan-phi-xuat-hang-dtqg-hang-nam-vtct';
        break;
      case '21':
        this.url = '/ke-hoach-du-toan-cai-tao-sua-chua-ht-kt3-nam/';
        break;
      case '22':
        this.url = '/ke-hoach-quy-tien-luong-nam-n1/';
        break;
      case '23':
          this.url ='/du-toan-chi-du-tru-quoc-gia-gd3-nam/';
        break;
      case '25':
        this.url = '/ke-hoach-xay-dung-van-ban-quy-pham-phap-luat-dtqg-giai-doan-3nam';
        break;
      case '26':
        this.url = '/du-toan-chi-ung-dung-cntt-giai-doan-3nam';
        break;
      case '27':
        this.url = '/du-toan-chi-mua-sam-may-moc-thiet-chi-chuyen-dung-3nam';
        break;
      case '28':
        this.url = '/tong-hop-nhu-cau-chi-ngan-sach-nha-nuoc-giai-doan-3nam';
        break;
      case '29':
        this.url = '/tong-hop-nhu-cau-chi-thuong-xuyen-giai-doan-3nam';
        break;
      case '30':
        this.url = '/chi-tiet-nhu-cau-chi-thuong-xuyen-giai-doan-3nam';
        break;
      case '31':
        this.url = '/tong-hop-muc-tieu-nhiem-vu-chu-yeu-va-nhu-cau-chi-moi-giai-doan-3nam';
        break;
      case '01':
        this.url = '/xay-dung-ke-hoach-von-dau-tu';
        break;
      case '06':
        this.url = '/xay-dung-ke-hoach-quy-tien-luong-hang-nam';
        break;
      case '15':
        this.url = '/ke-hoach-dao-tao-boi-duong-3-nam';
        break;
      default:
        this.url=null;
        break;
    }

  }

  //lay ten don vi tạo
  getUnitName() {
    return this.donViTaos.find(item => item.id == this.maDonViTao)?.tenDvi;
  }
  //doi so trang
  onPageIndexChange(page) {
    this.pages.page = page;
  }

  //doi so luong phan tu tren 1 trang
  onPageSizeChange(size) {
    this.pages.size = size;
  }
  redirectChiTieuKeHoachNam(){
    this.location.back()
  }
  xoaDieuKien(){
    this.namhientai = ''
    this.kehoach = ''
    this.loaiBaocao = ''
  }
  tinhnam(){
    this.kehoach= Number(this.namhientai) + 3
  }
}
