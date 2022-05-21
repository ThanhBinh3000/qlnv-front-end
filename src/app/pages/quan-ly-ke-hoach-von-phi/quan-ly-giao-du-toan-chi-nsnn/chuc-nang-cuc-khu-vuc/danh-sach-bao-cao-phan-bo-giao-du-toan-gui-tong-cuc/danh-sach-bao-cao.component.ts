import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTreeComponent } from 'ng-zorro-antd/tree';
import { DanhMucHDVService } from '../../../../../services/danhMucHDV.service';
import { QuanLyVonPhiService } from '../../../../../services/quanLyVonPhi.service';
import { MESSAGE } from '../../../../../constants/message';
import { TRANG_THAI_TIM_KIEM } from 'src/app/Utility/utils';

@Component({
  selector: 'app-danh-sach-bao-cao',
  templateUrl: './danh-sach-bao-cao.component.html',
  styleUrls: ['./danh-sach-bao-cao.component.scss']
})

export class DanhSachBaoCaoComponent implements OnInit {
  @ViewChild('nzTreeComponent', { static: false })
  nzTreeComponent!: NzTreeComponent;
  detailDonVi: FormGroup;
  danhSachBaoCao: any = [];
  totalElements = 0;
  totalPages = 0;
  errorMessage = "";
  url!: string;
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
    nam: "",
    ngayTaoTu: "",
    ngayTaoDen: "",
    maBaoCao: "",
    donViTao: "",
    loaiBaoCao: "",
    trangThai: "",
  };
  pages = {
    size: 10,
    page: 1,
  }
  donViTaos: any = [];
  baoCaos: any = [];
  allChecked: any;
  trangThais: any = TRANG_THAI_TIM_KIEM;

  constructor(
    private quanLyVonPhiService: QuanLyVonPhiService,
    private danhMuc: DanhMucHDVService,
    private router: Router,
    private datePipe: DatePipe,
    private notification: NzNotificationService,
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
          this.notification.error(MESSAGE.ERROR, data?.msg);
        }
      },
      err => {
        console.log(err);
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
    );

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
      ngayTaoDen: this.searchFilter.ngayTaoDen,
      ngayTaoTu: this.searchFilter.ngayTaoTu,
      paggingReq: {
        limit: this.pages.size,
        page: this.pages.page,
      },
      str: "",
      trangThai: "",
    };

    //let latest_date =this.datepipe.transform(this.tuNgay, 'yyyy-MM-dd');
    this.quanLyVonPhiService.timBaoCao(requestReport).toPromise().then(
      (data) => {
        if (data.statusCode == 0) {
          this.danhSachBaoCao = data.data.content;
          this.totalElements = data.data.totalElements;
          this.totalPages = data.data.totalPages;
        } else {
          this.notification.error(MESSAGE.ERROR, data?.msg);
        }
      },
      (err) => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
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
  updateAllChecked(): void {
    this.indeterminate = false;                               // thuoc tinh su kien o checkbox all
    if (this.allChecked) {                                    // checkboxall == true thi set lai lstCTietBCao.checked = true
      this.danhSachBaoCao = this.danhSachBaoCao.map(item => ({
        ...item,
        checked: true
      }));
    } else {
      this.danhSachBaoCao = this.danhSachBaoCao.map(item => ({    // checkboxall == false thi set lai lstCTietBCao.checked = false
        ...item,
        checked: false
      }));
    }
  }
  // click o checkbox single
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
}
