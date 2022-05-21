import { NzNotificationService } from 'ng-zorro-antd/notification';
import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NzTreeComponent } from 'ng-zorro-antd/tree';
import { DanhMucHDVService } from '../../../../services/danhMucHDV.service';
import { QuanLyVonPhiService } from '../../../../services/quanLyVonPhi.service';
import { MESSAGE } from 'src/app/constants/message';



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
  url: string = "nhap-quyet-dinh-giao-du-toan-chi-nsnn-btc-pd/";

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
    ngayTaoDen: "",
    ngayTaoTu: "",
    noiQd: "Bộ tài chính",
    soQd: "",
    veViec: "",
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

  xoaBanGhiGiao(id: any) {
      if (id) {
        this.quanLyVonPhiService.xoaBanGhiGiaoBTC(id).toPromise().then(async res => {
          if (res.statusCode == 0) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.DELETE_SUCCESS);
            this.onSubmit()
          } else {
            this.notification.error(MESSAGE.ERROR, res?.msg);
          }
        }, err => {
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        })
      } else {
        this.notification.warning(MESSAGE.WARNING, MESSAGE.MESSAGE_DELETE_WARNING)
    }

  }

  redirectSuaThongTinTimKiem(id) {
    this.router.navigate([
      '/qlkh-von-phi/quan-ly-giao-du-toan-chi-nsnn/nhap-quyet-dinh-giao-du-toan-chi-nsnn-btc-pd',
      id,
    ]);
  }

  redirectQLGiaoDTChi() {
    this.router.navigate(['/qlkh-von-phi/quan-ly-giao-du-toan-chi-nsnn']);
  }

  //search list bao cao theo tieu chi
  onSubmit() {
    let requestReport = {
      id: 0,
      ngayTaoDen: this.searchFilter.ngayTaoDen,
      ngayTaoTu: this.searchFilter.ngayTaoTu,
      noiQd: this.searchFilter.noiQd,
      paggingReq: {
        limit: this.pages.size,
        page: this.pages.page
      },
      soQd: this.searchFilter.soQd,
      str: "",
      trangThai: "",
      veViec: ""
    };

    //let latest_date =this.datepipe.transform(this.tuNgay, 'yyyy-MM-dd');
    this.quanLyVonPhiService.timBaoCaoGiao1(requestReport).toPromise().then(
      (data) => {
        if (data.statusCode == 0) {
          this.danhSachBaoCao = data.data.content;
          this.totalElements = data.data.totalElements;
          this.totalPages = data.data.totalPages;
          console.log(this.danhSachBaoCao);

        } else {
          this.errorMessage = "Có lỗi trong quá trình vấn tin!";
        }
      },
      (err) => {
        this.errorMessage = err.error.message;
      }
    );
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
}
