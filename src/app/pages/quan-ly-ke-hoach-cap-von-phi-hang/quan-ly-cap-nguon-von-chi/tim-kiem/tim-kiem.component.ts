import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTreeComponent } from 'ng-zorro-antd/tree';
import { DanhMucService } from '../../../../services/danhMuc.service';
import { QuanLyVonPhiService } from '../../../../services/quanLyVonPhi.service';
import { MESSAGE } from '../../../../constants/message';


@Component({
  selector: 'app-tim-kiem',
  templateUrl: './tim-kiem.component.html',
  styleUrls: ['./tim-kiem.component.scss'],
})
export class TimKiemComponent implements OnInit {
  @ViewChild('nzTreeComponent', { static: false })
  nzTreeComponent!: NzTreeComponent;
  detailDonVi: FormGroup;
  danhSachCongVan: any = [];
  totalElements = 0;
  totalPages = 0;
  errorMessage = "";
  url!: string;

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
    private quanLyVonPhiService: QuanLyVonPhiService,
    private danhMuc: DanhMucService,
    private router: Router,
    private datePipe: DatePipe,
    private notification: NzNotificationService,
  ) {
  }

  ngOnInit(): void {
    //lay danh sach loai bao cao
    // this.danhMuc.dMLoaiBaoCao().toPromise().then(
    //   data => {
    //     console.log(data);
    //     if (data.statusCode == 0) {
    //       this.baoCaos = data.data?.content;
    //     } else {
    //       this.notification.error(MESSAGE.ERROR, data?.msg);
    //     }
    //   },
    //   err => {
    //     console.log(err);
    //     this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
    //   }
    // );

    // //lay danh sach danh muc
    // this.danhMuc.dMDonVi().toPromise().then(
    //   data => {
    //     if (data.statusCode == 0) {
    //       this.donViTaos = data.data;
    //     } else {
    //       this.notification.error(MESSAGE.ERROR, data?.msg);
    //     }
    //   },
    //   err => {
    //     this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
    //   }
    // );
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
    this.quanLyVonPhiService.timDsachCvanDnghi(requestReport).toPromise().then(
      (data) => {
        if (data.statusCode == 0) {
          console.log(data);
          
          this.danhSachCongVan = data.data?.content;
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
