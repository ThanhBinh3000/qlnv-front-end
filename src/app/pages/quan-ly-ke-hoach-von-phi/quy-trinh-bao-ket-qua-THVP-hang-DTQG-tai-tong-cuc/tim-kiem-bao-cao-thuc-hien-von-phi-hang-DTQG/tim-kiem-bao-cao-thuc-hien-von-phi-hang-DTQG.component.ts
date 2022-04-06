import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTreeComponent } from 'ng-zorro-antd/tree';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { MESSAGE } from 'src/app/constants/message';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { LBCKETQUATHUCHIENHANGDTQG, Utils} from 'src/app/Utility/utils';
import { TRANGTHAI } from 'src/app/Utility/utils';
import { UserService } from 'src/app/services/user.service';
@Component({
  selector: 'app-tim-kiem-bao-cao-thuc-hien-von-phi-hang-DTQG',
  templateUrl: './tim-kiem-bao-cao-thuc-hien-von-phi-hang-DTQG.component.html',
  styleUrls: ['./tim-kiem-bao-cao-thuc-hien-von-phi-hang-DTQG.component.scss']
})
export class TimKiemBaoCaoThucHienVonPhiHangDTQGComponent implements OnInit {

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
  
  listBcaoKqua:any []=[];
  lenght:any=0;
  userInfor:any;
  btnPheDuyet:boolean = true;
  
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
    private nguoiDungSerivce:UserService,
  ) {
  }

 async ngOnInit() {

    let userName = this.nguoiDungSerivce.getUserName();
    let userInfor: any = await this.getUserInfo(userName); //get user info
    console.log(userInfor);
    const utils = new Utils();
    var role = utils.getRole(Number(userInfor.roles[0]?.code));
    if(role=='TRUONG_BO_PHAN'){
      this.btnPheDuyet = false;
    }
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

//get user info
async getUserInfo(username: string) {
  let userInfo = await this.nguoiDungSerivce
    .getUserInfo(username)
    .toPromise()
    .then(
      (data) => {
        if (data?.statusCode == 0) {
          this.userInfor = data?.data;
          return data?.data;
        } else {
        }
      },
      (err) => {
        console.log(err);
      },
    );
  return userInfo;
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
    this.searchFilter.ngayTaoDen = this.datePipe.transform(this.searchFilter.ngayTaoDen,'dd/MM/yyyy');
    this.searchFilter.ngayTaoTu = this.datePipe.transform(this.searchFilter.ngayTaoTu,'dd/MM/yyyy');
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
