import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTreeComponent } from 'ng-zorro-antd/tree';
import { MESSAGE } from 'src/app/constants/message';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { TRANGTHAI, LBCKETQUATHUCHIENHANGDTQG } from 'src/app/Utility/utils';

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
  url: string ='';
  urlChiTiet:string ='/lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-dtqg-tai-chi-cuc-chi-tiet/'
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

  listTrangThai:any = TRANGTHAI;
  // listTrangThai:any =[
  //   {
  //     id:'1',
  //     tenDm:'Đợt',
  //   },
  //   {
  //     id:'2',
  //     tenDm:'Năm'
  //   }
  // ]
  listBcaoKqua:any []=[];
  lenght:any=0;


  
  searchFilter = {
    maBcao: "",
    maDvi: "",
    trangThai: "",
    maLoaiBcao: "",
    dotBcao: "",
    namBcao: "",
    ngayTaoDen: "",
    ngayTaoTu: "",
    maPhanBcao:1,
    paggingReq: {
      limit: 20,
      page: 1
    }
    
  }

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
    this.quanLyVonPhiService.timBaoCao(this.searchFilter).subscribe(res => {
      if(res.statusCode==0){
        console.log(res);
        this.notifi.success(MESSAGE.SUCCESS, res?.msg);
        this.listBcaoKqua = res.data.content;
        this.totalElements = res.data.totalElements;
          this.totalPages = res.data.totalPages;
        if(this.listBcaoKqua.length!=0){
          this.lenght = this.listBcaoKqua.length;
        }
      }else{
        this.notifi.error(MESSAGE.ERROR, res?.msg);
      }
    },err =>{
      this.notifi.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    })
  }


  //set url khi
  setUrl(lbaocao:any) {
    // console.log(lbaocao);
      
      switch (lbaocao) {
        case 1:
          this.url = '/lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-dtqg-tai-chi-cuc-mau04a-/'+lbaocao
          break;
        case 2:
          this.url = '/lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-dtqg-tai-chi-cuc-mau04a-/'+lbaocao
          break;
        default:
          this.url = null;
          break;
      }
  }

  themMoi(){
    console.log(this.url)
    if(this.url==""){
      this.notifi.warning(MESSAGE.ERROR, "Bạn chưa chọn loại báo cáo")
      return;
    }
    else{
      this.router.navigate(['qlkh-von-phi/quy-trinh-bao-cao-ket-qua-thuc-hien-von-phi-hang-dtqg-tai-tong-cuc-dtnn'+this.url]);
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
