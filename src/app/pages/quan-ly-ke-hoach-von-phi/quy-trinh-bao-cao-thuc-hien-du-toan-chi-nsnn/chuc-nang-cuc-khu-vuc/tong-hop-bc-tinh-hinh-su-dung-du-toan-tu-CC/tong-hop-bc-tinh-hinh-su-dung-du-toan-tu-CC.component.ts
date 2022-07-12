import { DatePipe, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { LBC_QUY_TRINH_THUC_HIEN_DU_TOAN_CHI, TRANG_THAI_GUI_DVCT, Utils } from 'src/app/Utility/utils';


@Component({
  selector: 'app-tong-hop-bc-tinh-hinh-su-dung-dtc-tu-cc',
  templateUrl: './tong-hop-bc-tinh-hinh-su-dung-du-toan-tu-CC.component.html',
  styleUrls: ['./tong-hop-bc-tinh-hinh-su-dung-du-toan-tu-CC.component.scss']
})

export class TongHopBCTinhHinhSuDungDuToanTuCCComponent implements OnInit {
  totalElements = 0;
  totalPages = 0;

  listBcaoKqua:any []=[];

  trangThais: any = TRANG_THAI_GUI_DVCT;                          // danh muc loai bao cao
  searchFilter = {
    ngayTaoTu:'',
    ngayTaoDen:'',
    trangThais:['9'],
    maBcao:'',
    maLoaiBcao:'',
    namBcao:null,
    thangBcao: null,
    dotBcao:'',
    paggingReq: {
      limit: 10,
      page: 1
    },
    str: '',
    donVi:'',
    maPhanBcao:'0',
    loaiTimKiem:'1',
  };

  donViTaos: any = [];
  baoCaos: any = LBC_QUY_TRINH_THUC_HIEN_DU_TOAN_CHI;
  constructor(
    private quanLyVonPhiService: QuanLyVonPhiService,
    private danhMuc: DanhMucHDVService,
    private router: Router,
    private datePipe: DatePipe,
    private notification:NzNotificationService,
    private location: Location,
    private spinner: NgxSpinnerService,
  ) {
  }

  ngOnInit(): void {
    const date = new Date();
    this.searchFilter.namBcao = date.getFullYear();
    this.searchFilter.thangBcao = date.getMonth();
    this.searchFilter.maLoaiBcao='526';
    this.onSubmit();
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
    this.listBcaoKqua = []
  }

  // lay ten don vi tao
  getUnitName(dvitao:any){
    return this.donViTaos.find(item => item.maDvi == dvitao)?.tenDvi;
  }

  async onSubmit(){
    this.spinner.show();
    await this.quanLyVonPhiService.timBaoCao(this.searchFilter).toPromise().then(res => {
      if(res.statusCode==0){
        this.listBcaoKqua = res.data.content;
        this.listBcaoKqua.forEach(e => {
          e.ngayPheDuyet = this.datePipe.transform(e.ngayPheDuyet, Utils.FORMAT_DATE_STR);
          e.ngayDuyet = this.datePipe.transform(e.ngayDuyet, Utils.FORMAT_DATE_STR);
          e.ngayTrinh = this.datePipe.transform(e.ngayTrinh, Utils.FORMAT_DATE_STR);
          e.ngayTraKq = this.datePipe.transform(e.ngayTraKq, Utils.FORMAT_DATE_STR);
          e.ngayTao = this.datePipe.transform(e.ngayTao, Utils.FORMAT_DATE_STR);
        })
        this.totalElements = res.data.totalElements;
        this.totalPages = res.data.totalPages;
      }else{
        this.notification.error(MESSAGE.ERROR, res?.msg);
      }
      console.log(res);
    },err =>{
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    })
    this.spinner.hide();
  }

  //doi so trang
  onPageIndexChange(page) {
    this.searchFilter.paggingReq.page = page;
    this.onSubmit();
  }

  //doi so luong phan tu tren 1 trang
  onPageSizeChange(size) {
    this.searchFilter.paggingReq.limit = size;
    this.onSubmit();
  }

  // tong hop bao cao tu cap duoi
  tongHop(){
    // let request = {
    //   dotBcao: null,
    //   maLoaiBcao: this.searchFilter.maLoaiBcao,
    //   maPhanBCao: '0',
    //   namBcao: this.searchFilter.namBcao,
    //   thangBcao: this.searchFilter.thangBcao
    // }

      if(!this.searchFilter.namBcao || !this.searchFilter.maLoaiBcao || (!this.searchFilter.thangBcao && this.searchFilter.maLoaiBcao == '526')){
        this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
        return;
      }
      if (this.searchFilter.namBcao >= 3000 || this.searchFilter.namBcao < 1000){
        this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.WRONG_FORMAT);
        return;
      }
  
      this.router.navigate(["/qlkh-von-phi/quy-trinh-bc-thuc-hien-du-toan-chi-nsnn/tong-hop/" + this.searchFilter.maLoaiBcao +'/' +(this.searchFilter.maLoaiBcao == '526' ? this.searchFilter.thangBcao : '0')+'/'+this.searchFilter.namBcao])
  }

  // lay ten trang thai ban ghi
  getStatusName(id) {
    return TRANG_THAI_GUI_DVCT.find(item => item.id == id)?.ten
  }

  close() {
    this.location.back();
  }
}
