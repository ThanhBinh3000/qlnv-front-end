import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTreeComponent } from 'ng-zorro-antd/tree';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { MESSAGE } from 'src/app/constants/message';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { LBCKETQUATHUCHIENHANGDTQG, Utils } from 'src/app/Utility/utils';
@Component({
  selector: 'app-tong-hop-bao-cao-ket-qua-thuc-hien-von-phi-hang-DTQG',
  templateUrl: './tong-hop-bao-cao-ket-qua-thuc-hien-von-phi-hang-DTQG.component.html',
  styleUrls: ['./tong-hop-bao-cao-ket-qua-thuc-hien-von-phi-hang-DTQG.component.scss']
})
export class TongHopBaoCaoKetQuaThucHienVonPhiHangDTQGComponent implements OnInit {

  @ViewChild('nzTreeComponent', { static: false })
  nzTreeComponent!: NzTreeComponent;
  detailDonVi: FormGroup;
  danhSachBaoCao: any = [];
  totalElements = 0;
  totalPages = 0;
  errorMessage = "";
  url: string='/lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-dtqg-tai-chi-cuc-chi-tiet/';
  urlTongHop:string ='/lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-dtqg-tai-chi-cuc-mau04a/';
  userInfor:any;
  maDonVi:any;
  listDonViTao:any []=[];
  listBcaoKqua:any []=[];
  lenght:any=0;
  currentDate = new Date();
  statusBtnTongHop:boolean = true;
  trangThais: any = LISTTRANGTHAIKIEMTRABAOCAO;                          // danh muc loai bao cao

  searchFilter = {
    dotBcao:0,
    maBcao:'',
    maDvi:'',
    maDviCha: '',
    maLoaiBcao:0,
    maPhanBcao:'1',
    namBcao:this.currentDate.getFullYear().toString(),
    ngayTaoDen:'',
    ngayTaoTu:'',
    paggingReq: {
      limit: 20,
      page: 1
    },
    str: '',
    thangBCao: '',
    trangThai:'',
  };


  pages = {
    size: 10,
    page: 1,
  }
  donViTaos: any = [];
  baoCaos: any = LBCKETQUATHUCHIENHANGDTQG;
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

  await this.quanLyVonPhiService.sinhDotBaoCao().toPromise().then( res =>{
    if(res.statusCode== 0){
        var dotBaoCao= res.data;
        if(dotBaoCao!=1){
          this.searchFilter.dotBcao = Number(dotBaoCao) - 1;
        }else{
          this.searchFilter.dotBcao = dotBaoCao;
        }
        
    }
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

  //statusName 
  getStatusName(status:string){
    return this.trangThais.find(item => item.id == status).ten;
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
    if(this.searchFilter.namBcao==''){
      this.notifi.error('Kiểm tra','Bạn chưa nhập năm báo cáo!');
      return;
    }
    if(this.searchFilter.maLoaiBcao==null){
      this.notifi.error('Kiểm tra','Bạn chưa chọn loại báo cáo!');
      return;
    }
    if(this.searchFilter.maLoaiBcao==0){
      this.searchFilter.maLoaiBcao =1;
    }
    this.searchFilter.trangThai = '9';    
    this.quanLyVonPhiService.timKiemDuyetBaoCao(this.searchFilter).subscribe(res => {
      if(res.statusCode==0){
        this.listBcaoKqua = res.data.content;
        if(this.listBcaoKqua.length!=0){
          this.lenght = this.listBcaoKqua.length;
          this.listBcaoKqua.forEach(e =>{
            e.ngayTrinh = this.datePipe.transform(e.ngayTrinh, Utils.FORMAT_DATE_STR);
            e.ngayDuyet = this.datePipe.transform(e.ngayDuyet,Utils.FORMAT_DATE_STR);
          })
          if(this.listBcaoKqua){
            this.statusBtnTongHop = false;
          }
        }
        this.tongHop();
      }else{
        this.notifi.error(MESSAGE.ERROR, res?.msg);
      }
    },err =>{
      this.notifi.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    })
  }
  tongHop(){
      if(this.searchFilter.maLoaiBcao == 1){
        this.urlTongHop = this.urlTongHop+ this.searchFilter.namBcao+"/"+this.searchFilter.maLoaiBcao+"/"+this.searchFilter.dotBcao;
      }else{
        this.urlTongHop = this.urlTongHop+ this.searchFilter.namBcao+"/"+this.searchFilter.maLoaiBcao;
      }
    console.log(this.urlTongHop);
    
  }

  // //set url khi
  // setUrl(lbaocao:any) {
  //   console.log(lbaocao)
  //   switch (lbaocao) {
  //     case 1:
  //       this.url = '/lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-dtqg-tai-chi-cuc-chi-tiet/'
  //       break;
  //     case 2:
  //       this.url = '/lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-dtqg-tai-chi-cuc-chi-tiet/'
  //       break;
  //     default:
  //       this.url = null;
  //       break;
  //   }
  // }

  //doi so trang
  onPageIndexChange(page) {
    this.pages.page = page;
  }

  //doi so luong phan tu tren 1 trang
  onPageSizeChange(size) {
    this.pages.size = size;
  }

}
export const LISTTRANGTHAIKIEMTRABAOCAO =[
  {
    id:'7',
    ten:'Mới'
  },
  {
    id:'8',
    ten:'Từ chối'
  },
  {
    id:'9',
    ten:'Chấp nhận'
  }
]

