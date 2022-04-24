import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTreeComponent } from 'ng-zorro-antd/tree';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { MESSAGE } from 'src/app/constants/message';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { LBCQUYTRINHTHUCHIENDUTOANCHI } from 'src/app/Utility/utils';
import { TRANGTHAITIMKIEM } from 'src/app/Utility/utils';

@Component({
  selector: 'app-ds-bao-cao-tinh-hinh-sd-dtoan-thang-nam',
  templateUrl: './ds-bao-cao-tinh-hinh-sd-dtoan-thang-nam.component.html',
  styleUrls: ['./ds-bao-cao-tinh-hinh-sd-dtoan-thang-nam.component.scss']
})

export class DsBaoCaoTinhHinhSdDtoanThangNamComponent implements OnInit {

  @ViewChild('nzTreeComponent', { static: false })
  nzTreeComponent!: NzTreeComponent;
  detailDonVi: FormGroup;
  danhSachBaoCao: any = [];
  totalElements = 0;
  totalPages = 0;
  errorMessage = "";
  url!: string;

  trangThais: any = TRANGTHAITIMKIEM;

  listBcaoKqua: any[] = [];
  lenght: any = 0;


  searchFilter = {
    maPhanBcao: '0',
    maDvi: '',
    ngayTaoTu: '',
    ngayTaoDen: '',
    trangThai: '',
    maBcao: '',
    maLoaiBcao: '',
    namBcao: '',
    thangBCao: '',
    dotBcao: '',
    paggingReq: {
      limit: 20,
      page: 1
    },
    str: "",
  };


  pages = {
    size: 10,
    page: 1,
  }
  donViTaos: any = [];
  baoCaos: any = LBCQUYTRINHTHUCHIENDUTOANCHI;
  constructor(
    private quanLyVonPhiService: QuanLyVonPhiService,
    private danhMuc: DanhMucHDVService,
    private router: Router,
    private datePipe: DatePipe,
    private notifi: NzNotificationService,
  ) {
  }

  ngOnInit(): void {
    //lay danh sach danh muc
    this.danhMuc.dMDonVi().toPromise().then(
      data => {
        if (data.statusCode == 0) {
          this.donViTaos = data.data;
        } else {
          this.notifi.error(MESSAGE.ERROR, data?.msg);
        }
      },
      err => {
        this.notifi.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
    );
  }

  // lay ten don vi tao
  getUnitName(dvitao: any) {
    return this.donViTaos.find(item => item.maDvi == dvitao)?.tenDvi;
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


  timkiem() {
    if (this.searchFilter.maLoaiBcao == '') {
      this.notifi.error('Tìm kiếm', 'Bạn chưa chọn loại báo cáo!');
      return;
    }
    this.quanLyVonPhiService.timBaoCao(this.searchFilter).subscribe(res => {
      if (res.statusCode == 0) {

        this.notifi.success(MESSAGE.SUCCESS, res?.msg);
        this.listBcaoKqua = res.data.content;
        if (this.listBcaoKqua.length != 0) {
          this.lenght = this.listBcaoKqua.length;
        }
      } else {
        this.notifi.error(MESSAGE.ERROR, res?.msg);
      }
      console.log(res);
    }, err => {
      this.notifi.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    })
  }
  themMoi() {
    if (this.searchFilter.maLoaiBcao == '') {
      this.notifi.error('Thêm mới', 'Bạn chưa chọn loại báo cáo!');
      return;
    }
    this.router.navigate(["/qlkh-von-phi/quy-trinh-bc-thuc-hien-du-toan-chi-nsnn/" + this.url +'/' +this.searchFilter.thangBCao+'/'+this.searchFilter.namBcao])
  }

  //set url khi
  setUrl(lbaocao: any) {
    this.url = '/bao-cao/'+lbaocao;
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
