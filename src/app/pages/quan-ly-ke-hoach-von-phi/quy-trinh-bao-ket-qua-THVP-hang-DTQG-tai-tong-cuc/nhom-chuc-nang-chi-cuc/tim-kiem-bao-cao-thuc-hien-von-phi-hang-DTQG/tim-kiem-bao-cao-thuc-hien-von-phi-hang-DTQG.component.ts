import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTreeComponent } from 'ng-zorro-antd/tree';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { MESSAGE } from 'src/app/constants/message';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { LBC_KET_QUA_THUC_HIEN_HANG_DTQG, TRANG_THAI_TIM_KIEM, Utils} from 'src/app/Utility/utils';
import { TRANG_THAI } from 'src/app/Utility/utils';
import { UserService } from 'src/app/services/user.service';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { NgxSpinnerService } from 'ngx-spinner';
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
  errorMessage = "";
  url: string ='/bao-cao-/';
  urlChiTiet:string ='/bao-cao/'
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
  messageValidate:any =MESSAGEVALIDATE;
  listTrangThai:any = TRANG_THAI;
  
  listBcaoKqua:any []=[];
  lenght:any=0;
  userInfor:any;
  btnPheDuyet:boolean = true;
  btnCanBo:boolean =true;
  btnLanhDao:boolean =true;

  searchFilter = {
    maPhanBcao: '1',
    maDvi: '',
    ngayTaoTu: '',
    ngayTaoDen: '',
    trangThais: [],
    maBcao: '',
    maLoaiBcao: '',
    namBcao: null,
    thangBcao: null,
    dotBcao: '',
    paggingReq: {
      limit: 10,
      page: 1
    },
    str: "",
    loaiTimKiem:'0',
  }
  trangThais: any = TRANG_THAI_TIM_KIEM;
  trangThai!:string;
  validateForm!: FormGroup;
  totalElements = 0;
  totalPages = 0;
  pages = {
    size: 10,
    page: 1,
  }

  donViTaos: any = [];
  baoCaos: any = LBC_KET_QUA_THUC_HIEN_HANG_DTQG;


  submitForm(): void {
    if (this.validateForm.valid) {
     
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
  
  constructor(
    private quanLyVonPhiService: QuanLyVonPhiService,
    private danhMuc: DanhMucHDVService,
    private router: Router,
    private datePipe: DatePipe,
    private notifi:NzNotificationService,
    private nguoiDungSerivce:UserService,
    private fb:FormBuilder,
    private spinner: NgxSpinnerService,

  ) {
  }

 async ngOnInit() {

  this.validateForm = this.fb.group({
    loaiBaocao: [null, [Validators.required]],
    namBaoCao:[null, [Validators.required,Validators.pattern('^[12][0-9]{3}$')]],
    temp:[null]
  });

    let userName = this.nguoiDungSerivce.getUserName();
    let userInfor: any = await this.getUserInfo(userName); //get user info
    const utils = new Utils();
    var role = utils.getRole(Number(userInfor.roles[0]?.code));
    if(role=='TRUONG_BO_PHAN'){
      this.btnPheDuyet = false;
    }else if(role =='LANH_DAO'){
      this.btnLanhDao =false;
    }else{
      this.btnCanBo = false;
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
          this.notifi.error(MESSAGE.ERROR, data?.msg);
        }
      },
      (err) => {
        this.notifi.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
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


  async onSubmit(){
    this.spinner.show();
    this.searchFilter.trangThais= [];
    this.searchFilter.ngayTaoTu = this.datePipe.transform(this.searchFilter.ngayTaoTu, 'dd/MM/yyyy');
    this.searchFilter.ngayTaoDen = this.datePipe.transform(this.searchFilter.ngayTaoDen, 'dd/MM/yyyy');
    if(this.trangThai){
      this.searchFilter.trangThais.push(this.trangThai)
    }else{
      this.searchFilter.trangThais = [Utils.TT_BC_1,Utils.TT_BC_2,Utils.TT_BC_3,Utils.TT_BC_4,Utils.TT_BC_5,Utils.TT_BC_6,Utils.TT_BC_7,Utils.TT_BC_8,Utils.TT_BC_9]
    }
    await this.quanLyVonPhiService.timBaoCao(this.searchFilter).toPromise().then(res => {
      if(res.statusCode==0){
        this.listBcaoKqua = res.data.content;
        if(this.listBcaoKqua.length==0){
          this.listBcaoKqua =[];
        }else{
          this.lenght = this.listBcaoKqua.length;
          this.listBcaoKqua.forEach(e =>{
            e.ngayTao = this.datePipe.transform(e.ngayTao, 'dd/MM/yyyy');
            e.ngayTrinh = this.datePipe.transform(e.ngayTrinh, 'dd/MM/yyyy');
            e.ngayDuyet = this.datePipe.transform(e.ngayDuyet, 'dd/MM/yyyy');
            e.ngayPheDuyet = this.datePipe.transform(e.ngayPheDuyet, 'dd/MM/yyyy');
            e.ngayTraKq = this.datePipe.transform(e.ngayTraKq, 'dd/MM/yyyy');
          })
        }
        this.totalElements = res.data.totalElements;
        this.totalPages = res.data.totalPages;
        
      }else{
        this.notifi.error(MESSAGE.ERROR, res?.msg);
      }
    },err =>{
      this.notifi.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    })
    this.spinner.hide();
  }



  themMoi(){
    if(!this.validateForm.valid){
      this.notifi.error(MESSAGE.ERROR, MESSAGEVALIDATE.NOTEMPTYS)
      return;
    }
    else{
      this.router.navigate(['qlkh-von-phi/quy-trinh-bao-cao-ket-qua-thuc-hien-von-phi-hang-dtqg-tai-tong-cuc-dtnn'+this.url + this.searchFilter.maLoaiBcao+"/"+this.searchFilter.namBcao]);
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

}
