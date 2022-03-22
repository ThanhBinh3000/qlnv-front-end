import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NzTreeComponent } from 'ng-zorro-antd/tree';
import { DanhMucHDVService } from '../../../../services/danhMucHDV.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MESSAGE } from '../../../../constants/message';
import { QuanLyThongTinQuyetToanVonPhiHangDTQGService } from 'src/app/services/quanLyThongTinQuyetToanVonPhiHangDTQG';



@Component({
  selector: 'app-danh-sach-dieu-chinh-so-lieu-sau-quyet-toan',
  templateUrl: './danh-sach-dieu-chinh-so-lieu-sau-quyet-toan.component.html',
  styleUrls: ['./danh-sach-dieu-chinh-so-lieu-sau-quyet-toan.component.scss'],
})
export class DanhSachDieuChinhSoLieuSauQuyetToanComponent implements OnInit {
  @ViewChild('nzTreeComponent', { static: false })
  nzTreeComponent!: NzTreeComponent;
  detailDonVi: FormGroup;
  danhSachCongVan: any []= [];
  totalElements = 0;
  totalPages = 0;
  errorMessage = "";
  url: string ='dieu-chinh-so-lieu-quyet-toan-von-mua-hang-dtqg';

  allChecked = false;                         // check all checkbox
  indeterminate = true;                       // properties allCheckBox


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
    donViTao: "",
  };
  pages = {
    size: 10,
    page: 1,
  }
  donViTaos: any = [];
  baoCaos: any = [];
  constructor(
        private tonghopSolieuQtoan: QuanLyThongTinQuyetToanVonPhiHangDTQGService,
        private danhMuc: DanhMucHDVService,
        private router: Router,
        private datePipe: DatePipe,
        private notification: NzNotificationService,

  ) 
  {
  }

  ngOnInit(): void {
    

    //lay danh sach danh muc
    this.danhMuc.dMDonVi().toPromise().then(
      data => {
        if (data.statusCode == 0) {
          this.donViTaos = data.data;
          
        } else {
          this.notification.error(MESSAGE.ERROR, data?.msg);
        }
      },
      err => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
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


  //lay ten don vi tạo
  getUnitName(dvTao:any) {
    return this.donViTaos.find((item) => item.maDvi == dvTao)?.tenDvi;
  }
  //search list bao cao theo tieu chi
  onSubmit() {
    let requestReport = {
      maDvi: this.searchFilter.donViTao,
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
    this.tonghopSolieuQtoan.timDsachDieuChinhSoLieuSauQuyetToan(requestReport).toPromise().then(
      (data) => {
        if (data.statusCode == 0) {
          console.log(data);
          
          this.danhSachCongVan = data.data?.content;
          this.danhSachCongVan.forEach(e =>{
            e.ngayQuyetDinh = this.datePipe.transform(e.ngayQuyetDinh,'dd/MM/yyyy');
            e.ngayTao = this.datePipe.transform(e.ngayTao,'dd/MM/yyyy');
          })
          this.totalElements = data.data.totalElements;
          this.totalPages = data.data.totalPages;
        } else {
          this.notification.error(MESSAGE.ERROR, data?.msg);
        }
      },
      (err) => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
      }
    );
  }


  xoadanhsachdieuchinh(id:any){
    var indx = this.danhSachCongVan.findIndex(item => {item.id ===id});
    
    this.tonghopSolieuQtoan.xoadieuchinhsolieu(id).subscribe(res => {
      if(res.statusCode==0){
        this.notification.success(MESSAGE.SUCCESS, res?.msg);
        this.danhSachCongVan.slice(indx,1);
      }else{
        this.notification.error(MESSAGE.ERROR, res?.msg);
      }
    })
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
    // updateAllChecked(): void {
    //   this.indeterminate = false;                               // thuoc tinh su kien o checkbox all
    //   if (this.allChecked) {                                    // checkboxall == true thi set lai lstCTietBCao.checked = true
    //     this.lstCTietBCao = this.lstCTietBCao.map(item => ({
    //       ...item,
    //       checked: true
    //     }));
    //   } else {
    //     this.lstCTietBCao = this.lstCTietBCao.map(item => ({    // checkboxall == false thi set lai lstCTietBCao.checked = false
    //       ...item,
    //       checked: false
    //     }));
    //   }
    // }
}
