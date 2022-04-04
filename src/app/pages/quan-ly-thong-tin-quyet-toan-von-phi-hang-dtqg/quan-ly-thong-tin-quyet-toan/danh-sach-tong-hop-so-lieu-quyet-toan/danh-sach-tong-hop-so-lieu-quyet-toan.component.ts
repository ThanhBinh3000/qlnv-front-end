import { DatePipe, Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTreeComponent } from 'ng-zorro-antd/tree';
import { DanhMucHDVService } from '../../../../services/danhMucHDV.service';
import { QuanLyVonPhiService } from '../../../../services/quanLyVonPhi.service';
import { MESSAGE } from '../../../../constants/message';
import { QuanLyThongTinQuyetToanVonPhiHangDTQGService } from 'src/app/services/quanLyThongTinQuyetToanVonPhiHangDTQG.service';
import { Utils } from 'src/app/Utility/utils';



@Component({
  selector: 'app-danh-sach-tong-hop-so-lieu-quyet-toan',
  templateUrl: './danh-sach-tong-hop-so-lieu-quyet-toan.component.html',
  styleUrls: ['./danh-sach-tong-hop-so-lieu-quyet-toan.component.scss'],
})
export class DanhSachTongHopSoLieuQuyetToanComponent implements OnInit {
  @ViewChild('nzTreeComponent', { static: false })
  nzTreeComponent!: NzTreeComponent;
  detailDonVi: FormGroup;
  danhSachCongVan: any = [];
  totalElements = 0;
  totalPages = 0;
  errorMessage = "";
  url: string = "tong-hop-so-lieu-quyet-toan";

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
    soQd: "",
  };
  pages = {
    size: 10,
    page: 1,
  }
  donViTaos: any = [];
  baoCaos: any = [];
  trangThai:any;
  constructor(
    private tonghopSolieuQtoan: QuanLyThongTinQuyetToanVonPhiHangDTQGService,
    private danhMuc: DanhMucHDVService,
    private router: Router,
    private datePipe: DatePipe,
    private notification: NzNotificationService,
    private location: Location
  ) {
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
      soQd: this.searchFilter.soQd,
      str: "",
      trangThai: this.trangThai,
    };
    console.log(requestReport);
    //let latest_date =this.datepipe.transform(this.tuNgay, 'yyyy-MM-dd');
    this.tonghopSolieuQtoan.timDsachTongHopSoLieuQuyetToan(requestReport).toPromise().then(
      (data) => {
        if (data.statusCode == 0) {
          console.log(data);

          this.danhSachCongVan = data.data?.content;
          this.danhSachCongVan.forEach(e => {
            e.ngayTao = this.datePipe.transform(e.ngayTao,'dd/MM/yyyy');
            e.ngayQuyetDinh = this.datePipe.transform(e.ngayQuyetDinh,'dd/MM/yyyy');
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


  //xoa tong hop so lieu
  xoatonghop(id:any){
    let indx = this.danhSachCongVan.findIndex(item => item.id ===id);

    this.tonghopSolieuQtoan.xoatonghopsolieu(id).subscribe(res =>{

      if(res.statusCode==0){
        this.notification.success(MESSAGE.SUCCESS, res?.msg);
        this.danhSachCongVan.splice(indx,1);
      }else{
        this.notification.error(MESSAGE.ERROR, res?.msg);
      }
    },err => {
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    })
  }

  getStatusName(status:any) {
    const utils = new Utils();
    return utils.getStatusName(status);
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

  //checkox trên tùng row
  updateSingleChecked(): void {
    if (this.danhSachCongVan.every((item) => !item.checked)) {
      this.allChecked = false;
      this.indeterminate = false;
    } else if (this.danhSachCongVan.every((item) => item.checked)) {
      this.allChecked = true;
      this.indeterminate = false;
    } else {
      this.indeterminate = true;
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

  redirectChiTieuKeHoachNam() {
    this.location.back()
  }
}
