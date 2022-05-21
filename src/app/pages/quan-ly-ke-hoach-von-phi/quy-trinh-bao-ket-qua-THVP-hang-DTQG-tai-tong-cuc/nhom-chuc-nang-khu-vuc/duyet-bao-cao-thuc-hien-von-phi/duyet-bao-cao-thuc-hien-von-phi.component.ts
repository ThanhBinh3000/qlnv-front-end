import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTreeComponent } from 'ng-zorro-antd/tree';
import { MESSAGE } from 'src/app/constants/message';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import {  LBC_KET_QUA_THUC_HIEN_HANG_DTQG, TRANG_THAI_GUI_DVCT, Utils } from 'src/app/Utility/utils';

@Component({
  selector: 'app-duyet-bao-cao-thuc-hien-von-phi',
  templateUrl: './duyet-bao-cao-thuc-hien-von-phi.component.html',
  styleUrls: ['./duyet-bao-cao-thuc-hien-von-phi.component.scss']
})
export class DuyetBaoCaoThucHienVonPhiComponent implements OnInit {

  @ViewChild('nzTreeComponent', { static: false })
  nzTreeComponent!: NzTreeComponent;
  detailDonVi: FormGroup;
  danhSachBaoCao: any = [];
  totalElements = 0;
  totalPages = 0;
  errorMessage = "";
  url: string ='/lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-dtqg-tai-chi-cuc-chi-tiet/';

  userInfor:any;
  maDonVi:any;
  listDonViTao:any []=[];
  listBcaoKqua:any []=[];
  lenght:any=0;

  trangThais: any = TRANG_THAI_GUI_DVCT;                          // danh muc loai bao cao

  searchFilter = {
    dotBcao:'',
    maBcao:'',
    maDvi:'',
    maLoaiBcao:'',
    maPhanBcao:'1',
    namBcao:'',
    ngayTaoDen:'',
    ngayTaoTu:'',
    paggingReq: {
      limit: 20,
      page: 1
    },
    str: '',
    thangBcao: '',
    trangThai:'',
    loaiTimKiem:'1',
  };


  pages = {
    size: 10,
    page: 1,
  }
  donViTaos: any = [];
  baoCaos: any = LBC_KET_QUA_THUC_HIEN_HANG_DTQG;
  constructor(
    private quanLyVonPhiService: QuanLyVonPhiService,
    private danhMuc: DanhMucHDVService,
    private router: Router,
    private datePipe: DatePipe,
    private notifi:NzNotificationService,
    private nguoiDungSerivce : UserService,
  ) {
  }

  async ngOnInit(): Promise<void> {

    let userName = this.nguoiDungSerivce.getUserName();
    await this.getUserInfo(userName); //get user info
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

    let objectDonViThuocQuanLy={
      
      capDvi: null,
      kieuDvi: null,
      loaiDvi: null,
      maDvi: this.userInfor.dvql,
      maKbnn: null,
      maNsnn: null,
      maPhuong: null,
      maQuan: null,
      maTinh: null,
      paggingReq: {
        limit: 20,
        page: 1
      },
      str: '',
      tenDvi: '',
      trangThai: '01'
    
  }
  this.danhMuc.dmDonViThuocQuanLy(objectDonViThuocQuanLy).toPromise().then(res =>{
    if(res.statusCode==0){
     this.listDonViTao = res?.data;
     
    }else{
      this.notifi.error(MESSAGE.ERROR, res?.msg);
    }
  },err =>{
    this.notifi.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
  })
  }


  //get user info
  async getUserInfo(username: string) {
    await this.nguoiDungSerivce
      .getUserInfo(username)
      .toPromise()
      .then(
        (data) => {
          if (data?.statusCode == 0) {
            this.userInfor = data?.data;
            return data?.data;
          } else {
            this.notifi.error(MESSAGE.ERROR, data?.msg);
          }
        },
        (err) => {
          this.notifi.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        },
      );
  }
  // lay ten don vi tao
  getUnitName(dvitao:any){
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


  timkiem(){
    // if(this.searchFilter.maLoaiBcao==''){
    //   this.notifi.error('Tìm kiếm','Bạn chưa chọn loại báo cáo!');
    //   return;
    // }
    this.quanLyVonPhiService.timKiemDuyetBaoCao(this.searchFilter).subscribe(res => {
      if(res.statusCode==0){

        this.notifi.success(MESSAGE.SUCCESS, res?.msg);
        this.listBcaoKqua = res.data.content;
        if(this.listBcaoKqua.length!=0){
          this.lenght = this.listBcaoKqua.length;
          this.listBcaoKqua.forEach(e => {
            e.ngayTrinh = this.datePipe.transform(e.ngayTrinh,Utils.FORMAT_DATE_STR);
            e.ngayDuyet = this.datePipe.transform(e.ngayDuyet, Utils.FORMAT_DATE_STR);
          })
        }
      }else{
        this.notifi.error(MESSAGE.ERROR, res?.msg);
      }
      console.log(res);
    },err =>{
      this.notifi.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    })
  }
  themMoi(){
    if(this.searchFilter.maLoaiBcao==''){
      this.notifi.error('Thêm mới','Bạn chưa chọn loại báo cáo!');
      return;
    }
    this.router.navigate(["/qlkh-von-phi/quy-trinh-bc-thuc-hien-du-toan-chi-nsnn/"+this.url])
  }

  //set url khi
  setUrl(lbaocao:any) {
    console.log(lbaocao)
    switch (lbaocao) {
      case 1:
        this.url = '/lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-dtqg-tai-chi-cuc-chi-tiet/'
        break;
      case 2:
        this.url = '/lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-dtqg-tai-chi-cuc-chi-tiet/'
        break;
      default:
        this.url = null;
        break;
    }
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
