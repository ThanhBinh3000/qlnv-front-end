import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTreeComponent } from 'ng-zorro-antd/tree';
import { DanhMucHDVService } from '../../../../services/danhMucHDV.service';
import { MESSAGE } from 'src/app/constants/message';
import { QuanLyVonPhiService } from '../../../../services/quanLyVonPhi.service';
import { LOAIBAOCAO } from 'src/app/Utility/utils';



@Component({
  selector: 'app-tim-kiem',
  templateUrl: './tim-kiem.component.html',
  styleUrls: ['./tim-kiem.component.scss'],
})
export class TimKiemComponent implements OnInit {
  @ViewChild('nzTreeComponent', { static: false })
  nzTreeComponent!: NzTreeComponent;
  detailDonVi: FormGroup;
  danhSachBaoCao: any = [];
  totalElements = 0;
  totalPages = 0;
  errorMessage = "";
  url!: string;


  trangThai:any;


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
  constructor(
    private quanLyVonPhiService: QuanLyVonPhiService,
    private danhMuc: DanhMucHDVService,
    private router: Router,
    private datePipe: DatePipe,
    private notifi:NzNotificationService,
  ) {
  }

  ngOnInit(): void {
    //lay danh sach loai bao cao
    this.baoCaos = LOAIBAOCAO;
    //lay danh sach danh muc
    this.danhMuc.dMDonVi().toPromise().then(
      data => {
        if (data.statusCode == 0) {
          this.donViTaos = data.data;
        } else {
          this.notifi.error(MESSAGE.ERROR,MESSAGE.ERROR_CALL_SERVICE);
        }
      },
      err => {
        this.notifi.error(MESSAGE.ERROR,MESSAGE.SYSTEM_ERROR);
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
      trangThai: this.trangThai,
    };

    //let latest_date =this.datepipe.transform(this.tuNgay, 'yyyy-MM-dd');
    this.quanLyVonPhiService.timBaoCaoLapThamDinh(requestReport).toPromise().then(
      (data) => {
        if (data.statusCode == 0) {
          this.danhSachBaoCao = data.data.content;
          this.totalElements = data.data.totalElements;
          this.totalPages = data.data.totalPages;

        } else {
          this.notifi.error(MESSAGE.ERROR,MESSAGE.ERROR_CALL_SERVICE);
        }
      },
      (err) => {
        this.notifi.error(MESSAGE.ERROR,MESSAGE.SYSTEM_ERROR);
      }
    );
  }

  //set url khi
  setUrl(id) {
    console.log(id);
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
  xoaDieuKien(){
    this.searchFilter.nam = ""
    this.searchFilter.tuNgay = ""
    this.searchFilter.denNgay = ""
    this.searchFilter.maBaoCao = ""
    this.searchFilter.donViTao = ""
    this.searchFilter.loaiBaoCao = ""
    this.trangThai = ""
  }
}
