import { DatePipe, Location} from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTreeComponent } from 'ng-zorro-antd/tree';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import {  LBC_KET_QUA_THUC_HIEN_HANG_DTQG, TRANG_THAI_GUI_DVCT, Utils } from 'src/app/Utility/utils';
import * as fileSaver from 'file-saver';

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
  url: string ='/bao-cao/';

  userInfor:any;
  maDonVi:any;
  listDonViTao:any []=[];
  listBcaoKqua:any []=[];
  lenght:any=0;

  trangThais: any = TRANG_THAI_GUI_DVCT;                          // danh muc loai bao cao
  trangThai!: string;

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
    trangThais: [],
    loaiTimKiem:'1',
    donVi: '',
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
    private notification:NzNotificationService,
    private nguoiDungSerivce : UserService,
    private spinner: NgxSpinnerService,
    private location: Location,
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
          this.notification.error(MESSAGE.ERROR, data?.msg);
        }
      },
      err => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
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
        limit: 10,
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
      this.notification.error(MESSAGE.ERROR, res?.msg);
    }
  },err =>{
    this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
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
            this.notification.error(MESSAGE.ERROR, data?.msg);
          }
        },
        (err) => {
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        },
      );
  }
  // lay ten don vi tao
  getUnitName(dvitao:any){
    return this.donViTaos.find(item => item.maDvi == dvitao)?.tenDvi;
  }

  async onSubmit() {
    this.spinner.show();
    this.searchFilter.trangThais = [];
    if (this.trangThai) {
      this.searchFilter.trangThais.push(this.trangThai)
    } else {
      this.searchFilter.trangThais = [Utils.TT_BC_7, Utils.TT_BC_8, Utils.TT_BC_9]
    }
    await this.quanLyVonPhiService.timBaoCao(this.searchFilter).toPromise().then(res => {
      if (res.statusCode == 0) {
        this.listBcaoKqua = res.data?.content;
        this.listBcaoKqua.forEach(e => {
          e.congVan = JSON.parse(e.congVan);          
          e.ngayDuyet = this.datePipe.transform(e.ngayDuyet, 'dd/MM/yyyy');
          e.ngayTrinh = this.datePipe.transform(e.ngayTrinh, 'dd/MM/yyyy');
        })
        this.totalElements = res.data?.totalElements;
        this.totalPages = res.data?.totalPages;
      } else {
        this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
      }
    }, err => {
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    })
    this.spinner.hide();
  }
  themMoi(){
    if(this.searchFilter.maLoaiBcao==''){
      this.notification.error('Thêm mới','Bạn chưa chọn loại báo cáo!');
      return;
    }
    this.router.navigate(["/qlkh-von-phi/quy-trinh-bc-thuc-hien-du-toan-chi-nsnn/"+this.url])
  }

  //set url khi
  setUrl(lbaocao:any) {
    console.log(lbaocao)
    switch (lbaocao) {
      case 1:
        this.url = '/bao-cao/'
        break;
      case 2:
        this.url = '/bao-cao/'
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

  close() {
    this.location.back();
  }

  // lay ten trang thai ban ghi
  getStatusName(id) {
    const utils = new Utils();
    return utils.getStatusName(id);
  }

  //download file về máy tính
  async downloadFileCv(fileUrl, fileName) {
    debugger
    await this.quanLyVonPhiService.downloadFile(fileUrl).toPromise().then(
      (data) => {
        fileSaver.saveAs(data,fileName);
      },
      err => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      },
    );
  }

}
