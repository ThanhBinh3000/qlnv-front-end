import { DatePipe ,Location} from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTreeComponent } from 'ng-zorro-antd/tree';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { MESSAGE } from 'src/app/constants/message';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { LBCQUYTRINHTHUCHIENDUTOANCHI, TRANGTHAIGUIDVCT } from 'src/app/Utility/utils';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-tong-hop-bc-tinh-hinh-su-dung-dtc-tu-cc',
  templateUrl: './tong-hop-bc-tinh-hinh-su-dung-du-toan-tu-CC.component.html',
  styleUrls: ['./tong-hop-bc-tinh-hinh-su-dung-du-toan-tu-CC.component.scss']
})

export class TongHopBCTinhHinhSuDungDuToanTuCCComponent implements OnInit {

  @ViewChild('nzTreeComponent', { static: false })
  nzTreeComponent!: NzTreeComponent;
  detailDonVi: FormGroup;
  danhSachBaoCao: any = [];
  totalElements = 0;
  totalPages = 0;
  errorMessage = "";
  url!: string;

  listBcaoKqua:any []=[];

  trangThais: any = TRANGTHAIGUIDVCT;                          // danh muc loai bao cao

  searchFilter = {
    ngayTaoTu:'',
    ngayTaoDen:'',
    trangThai:9,
    maBcao:'',
    maLoaiBcao:'',
    namBcao:null,
    thangBCao: null,
    dotBcao:'',
    paggingReq: {
      limit: 10,
      page: 1
    },
    str: '',
    donVi:'',
    maPhanBcao:'0'
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
    private notification:NzNotificationService,
    private location: Location,
    private spinner: NgxSpinnerService,
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
    await this.quanLyVonPhiService.timKiemDuyetBaoCao(this.searchFilter).toPromise().then(res => {
      if(res.statusCode==0){
        this.listBcaoKqua = res.data.content;
        this.listBcaoKqua.forEach(e => {
          e.ngayPheDuyet = this.datePipe.transform(e.ngayPheDuyet, 'dd/MM/yyyy');
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
  themMoi(){
    if(this.searchFilter.maLoaiBcao==''){
      this.notification.error('Thêm mới','Bạn chưa chọn loại báo cáo!');
      return;
    }
    this.router.navigate(["/qlkh-von-phi/quy-trinh-bc-thuc-hien-du-toan-chi-nsnn/"+this.url])
  }

  //set url khi
  setUrl(lbaocao:any) {
    // this.url = '/tong-hop/'
  }

  //doi so trang
  onPageIndexChange(page) {
    this.pages.page = page;
  }

  //doi so luong phan tu tren 1 trang
  onPageSizeChange(size) {
    this.pages.size = size;
  }

  // tong hop bao cao tu cap duoi
  tongHop(){
    let request = {
      dotBcao: null,
      maLoaiBcao: this.searchFilter.maLoaiBcao,
      maPhanBCao: '0',
      namBcao: this.searchFilter.namBcao,
      thangBcao: this.searchFilter.thangBCao
    }

      if(!this.searchFilter.namBcao || !this.searchFilter.maLoaiBcao || (!this.searchFilter.thangBCao && this.searchFilter.maLoaiBcao == '526')){
        this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
        return;
      }
      if (this.searchFilter.namBcao >= 3000 || this.searchFilter.namBcao < 1000){
        this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.WRONG_FORMAT);
        return;
      }
  
      this.router.navigate(["/qlkh-von-phi/quy-trinh-bc-thuc-hien-du-toan-chi-nsnn/tong-hop/" + this.searchFilter.maLoaiBcao +'/' +(this.searchFilter.thangBCao ? this.searchFilter.thangBCao : '0')+'/'+this.searchFilter.namBcao])
  }

  close() {
    this.location.back();
  }
}
