import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { DanhMucHDVService } from '../../../../services/danhMucHDV.service';
import { MESSAGE } from 'src/app/constants/message';
import { QuanLyVonPhiService } from '../../../../services/quanLyVonPhi.service';
import { LOAIBAOCAO, TRANGTHAITIMKIEM } from 'src/app/Utility/utils';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { NgxSpinnerService } from 'ngx-spinner';



@Component({
  selector: 'app-tim-kiem',
  templateUrl: './tim-kiem.component.html',
  styleUrls: ['./tim-kiem.component.scss'],
})
export class TimKiemComponent implements OnInit {

  danhSachBaoCao: any = [];
  totalElements = 0;
  totalPages = 0;
  errorMessage = "";
  url!: string;
  messageValidate:any = MESSAGEVALIDATE

  trangThais: any = TRANGTHAITIMKIEM;


  
  searchFilter = {
    nam: null,
    tuNgay: "",
    denNgay: "",
    maBaoCao: "",
    donViTao: "",
    loaiBaoCao: "",
    trangThai: "",
  };
  pages = {                           // page
    size: 10,
    page: 1,
  }
  donViTaos: any = [];
  baoCaos: any = [];

  validateForm!: FormGroup;           // form

  submitForm(){
    
    if (this.validateForm.valid) {
      return true;
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      if(!this.searchFilter.nam || !this.searchFilter.loaiBaoCao){
        this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
      }
      if (this.searchFilter.nam >= 3000 || this.searchFilter.nam < 1000){
        this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.WRONG_FORMAT);
      }
      return false;
    }
  }
  constructor(
    private quanLyVonPhiService: QuanLyVonPhiService,
    private danhMuc: DanhMucHDVService,
    private router: Router,
    private datePipe: DatePipe,
    private notification: NzNotificationService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
  ) {
  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      namhientai: [null, [Validators.pattern('^[12][0-9]{3}$')]],
      loaiBaocao: [null, [Validators.required]],
      temp: [null],
    });

    //lay danh sach loai bao cao
    this.baoCaos = LOAIBAOCAO;
    //lay danh sach danh muc
    this.danhMuc.dMDonVi().toPromise().then(
      data => {
        if (data.statusCode == 0) {
          this.donViTaos = data.data;
        } else {
          this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
        }
      },
      err => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
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
      ngayTaoDen: this.datePipe.transform(this.searchFilter.denNgay, 'dd/MM/yyyy'),
      ngayTaoTu: this.datePipe.transform(this.searchFilter.tuNgay, 'dd/MM/yyyy'),
      paggingReq: {
        limit: this.pages.size,
        page: this.pages.page,
      },
      str: "",
      trangThai: this.searchFilter.trangThai,
    };
    this.spinner.show();
    //let latest_date =this.datepipe.transform(this.tuNgay, 'yyyy-MM-dd');
    this.quanLyVonPhiService.timBaoCaoLapThamDinh(requestReport).toPromise().then(
      (data) => {
        if (data.statusCode == 0) {
          this.danhSachBaoCao = data.data.content;
          this.danhSachBaoCao.forEach( e=>{
            e.ngayTao = this.datePipe.transform(e.ngayTao, 'dd/MM/yyyy');
          })
          this.totalElements = data.data.totalElements;
          this.totalPages = data.data.totalPages;

        } else {
          this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
        }
      },
      (err) => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
    );
    this.spinner.hide();
  }

  //set url khi
  setUrl(id) {
    switch (id) {
      case '12':
        this.url = '/chi-thuong-xuyen-3-nam/'
        break;
      case '01':
        this.url = '/xay-dung-ke-hoach-von-dau-tu/'
        break;
      case '02':
        this.url = '/xay-dung-nhu-cau-nhap-xuat-hang-nam/'
        break;
      case '03':
        this.url = '/xay-dung-ke-hoach-bao-quan-hang-nam/'
        break;
      case '04':
        this.url = '/nhu-cau-xuat-hang-vien-tro/'
        break;
      case '05':
        this.url = '/xay-dung-ke-hoach-quy-tien-luong3-nam/'
        break;
      case '06':
        this.url = '/xay-dung-ke-hoach-quy-tien-luong-hang-nam/'
        break;
      case '07':
        this.url = '/thuyet-minh-chi-de-tai-du-an-nghien-cuu-kh/'
        break;
      case '08':
        this.url = '/ke-hoach-xay-dung-van-ban-qppl-dtqg-3-nam/'
        break;
      case '09':
        this.url = '/du-toan-chi-ung-dung-cntt-3-nam/'
        break;
      case '10':
        this.url = '/chi-mua-sam-thiet-bi-chuyen-dung-3-nam/'
        break;
      case '11':
        this.url = '/chi-ngan-sach-nha-nuoc-3-nam/'
        break;
      case '13':
        this.url = '/nhu-cau-phi-nhap-xuat-3-nam/'
        break;
      case '14':
        this.url = '/ke-hoach-cai-tao-va-sua-chua-lon-3-nam/'
        break;
      case '15':
        this.url = '/ke-hoach-dao-tao-boi-duong-3-nam/'
        break;
      case '16':
        this.url = '/nhu-cau-ke-hoach-dtxd3-nam/'
        break;
      case '17':
        this.url = '/tong-hop-du-toan-chi-thuong-xuyen-hang-nam/'
        break;
      case '18':
        this.url = '/du-toan-xuat-nhap-hang-dtqg-hang-nam/'
        break;
      case '19':
        this.url = '/ke-hoach-bao-quan-hang-nam/'
        break;
      case '20':
        this.url = '/du-toan-phi-xuat-hang-dtqg-hang-nam-vtct/'
        break;
      case '21':
        this.url = '/ke-hoach-du-toan-cai-tao-sua-chua-ht-kt3-nam/'
        break;
      case '22':
        this.url = '/ke-hoach-quy-tien-luong-nam-n1/'
        break;
      case '23':
        this.url = '/du-toan-chi-du-tru-quoc-gia-gd3-nam/'
        break;
      case '24':
        this.url = '/thuyet-minh-chi-cac-de-tai-du-an-nghien-cuu-khoa-hoc-giai-doan-3nam/'
        break;
      case '25':
        this.url = '/ke-hoach-xay-dung-van-ban-quy-pham-phap-luat-dtqg-giai-doan-3nam/'
        break;
      case '26':
        this.url = '/du-toan-chi-ung-dung-cntt-giai-doan-3nam/'
        break;
      case '27':
        this.url = '/du-toan-chi-mua-sam-may-moc-thiet-chi-chuyen-dung-3nam/'
        break;
      case '28':
        this.url = '/tong-hop-nhu-cau-chi-ngan-sach-nha-nuoc-giai-doan-3nam/'
        break;
      case '29':
        this.url = '/tong-hop-nhu-cau-chi-thuong-xuyen-giai-doan-3nam/'
        break;
      case '30':
        this.url = '/chi-tiet-nhu-cau-chi-thuong-xuyen-giai-doan-3nam/'
        break;
      case '31':
        this.url = '/tong-hop-muc-tieu-nhiem-vu-chu-yeu-va-nhu-cau-chi-moi-giai-doan-3nam/'
        break;
      case '32':
        this.url = '/ke-hoach-dao-tao-boi-duong-3-nam-tc/'
        break;
      default:
        this.url = null;
        break;
    }
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
  xoaDieuKien() {
    this.searchFilter.nam = null
    this.searchFilter.tuNgay = null
    this.searchFilter.denNgay = null
    this.searchFilter.maBaoCao = null
    this.searchFilter.donViTao = null
    this.searchFilter.loaiBaoCao = null
    this.searchFilter.trangThai = null
  }

  taoMoi() {
    if (!this.submitForm()) {
      return;
    }
    this.router.navigate([
      '/qlkh-von-phi/quan-ly-lap-tham-dinh-du-toan-nsnn/' + this.url,
    ]);
  }

  xemChiTiet(maLoaiBaoCao: string, id: string) {
    let url: string;
    switch (maLoaiBaoCao) {
      case '12':
        url = '/chi-thuong-xuyen-3-nam/'
        break;
      case '01':
        url = '/xay-dung-ke-hoach-von-dau-tu/'
        break;
      case '02':
        url = '/xay-dung-nhu-cau-nhap-xuat-hang-nam/'
        break;
      case '03':
        url = '/xay-dung-ke-hoach-bao-quan-hang-nam/'
        break;
      case '04':
        url = '/nhu-cau-xuat-hang-vien-tro/'
        break;
      case '05':
        url = '/xay-dung-ke-hoach-quy-tien-luong3-nam/'
        break;
      case '06':
        url = '/xay-dung-ke-hoach-quy-tien-luong-hang-nam/'
        break;
      case '07':
        url = '/thuyet-minh-chi-de-tai-du-an-nghien-cuu-kh/'
        break;
      case '08':
        url = '/ke-hoach-xay-dung-van-ban-qppl-dtqg-3-nam/'
        break;
      case '09':
        url = '/du-toan-chi-ung-dung-cntt-3-nam/'
        break;
      case '10':
        url = '/chi-mua-sam-thiet-bi-chuyen-dung-3-nam/'
        break;
      case '11':
        url = '/chi-ngan-sach-nha-nuoc-3-nam/'
        break;
      case '13':
        url = '/nhu-cau-phi-nhap-xuat-3-nam/'
        break;
      case '14':
        url = '/ke-hoach-cai-tao-va-sua-chua-lon-3-nam/'
        break;
      case '15':
        url = '/ke-hoach-dao-tao-boi-duong-3-nam/'
        break;
      case '16':
        url = '/nhu-cau-ke-hoach-dtxd3-nam/'
        break;
      case '17':
        url = '/tong-hop-du-toan-chi-thuong-xuyen-hang-nam/'
        break;
      case '18':
        url = '/du-toan-xuat-nhap-hang-dtqg-hang-nam/'
        break;
      case '19':
        url = '/ke-hoach-bao-quan-hang-nam/'
        break;
      case '20':
        url = '/du-toan-phi-xuat-hang-dtqg-hang-nam-vtct/'
        break;
      case '21':
        url = '/ke-hoach-du-toan-cai-tao-sua-chua-ht-kt3-nam/'
        break;
      case '22':
        url = '/ke-hoach-quy-tien-luong-nam-n1/'
        break;
      case '23':
        url = '/du-toan-chi-du-tru-quoc-gia-gd3-nam/'
        break;
      case '24':
        url = '/thuyet-minh-chi-cac-de-tai-du-an-nghien-cuu-khoa-hoc-giai-doan-3nam/'
        break;
      case '25':
        url = '/ke-hoach-xay-dung-van-ban-quy-pham-phap-luat-dtqg-giai-doan-3nam/'
        break;
      case '26':
        url = '/du-toan-chi-ung-dung-cntt-giai-doan-3nam/'
        break;
      case '27':
        url = '/du-toan-chi-mua-sam-may-moc-thiet-chi-chuyen-dung-3nam/'
        break;
      case '28':
        url = '/tong-hop-nhu-cau-chi-ngan-sach-nha-nuoc-giai-doan-3nam/'
        break;
      case '29':
        url = '/tong-hop-nhu-cau-chi-thuong-xuyen-giai-doan-3nam/'
        break;
      case '30':
        url = '/chi-tiet-nhu-cau-chi-thuong-xuyen-giai-doan-3nam/'
        break;
      case '31':
        url = '/tong-hop-muc-tieu-nhiem-vu-chu-yeu-va-nhu-cau-chi-moi-giai-doan-3nam/'
        break;
      case '32':
        url = '/ke-hoach-dao-tao-boi-duong-3-nam-tc/'
        break;
      default:
        url = null;
        break;
    }
    if(url != null){
      this.router.navigate([
        '/qlkh-von-phi/quan-ly-lap-tham-dinh-du-toan-nsnn/' + url + id
      ]);
    }
  }
}
