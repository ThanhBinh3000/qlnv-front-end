import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { Utils } from 'src/app/Utility/utils';

@Component({
  selector: 'app-timkiemphuonganQDCVgiaosokiemtraNSNN',
  templateUrl: './timkiemphuonganQDCVgiaosokiemtraNSNN.component.html',
  styleUrls: ['./timkiemphuonganQDCVgiaosokiemtraNSNN.component.scss'],
})
export class TimkiemphuonganQDCVgiaosokiemtraNSNNComponent implements OnInit {
  nguoinhap!: any;
  namPa!: string;
  ngaylap: string = null;
  denngay: string = null;
  donvitao: number = null;
  donvinhan: string = null;
  trangthai: string = null;
  loaivanban: string = '';
  soQd: string = null;
  soCV: string = null;
  maPa: string = null;
  currentYear: Date = new Date();
  listVanban: any[] = [];
  donviTaos:any []=[];
  totalitem:any;
  constructor(
    private userService: UserService,
     private router: Router,
     private quankhoachvon :QuanLyVonPhiService,
     ) {
    this.namPa = this.currentYear.getFullYear().toString();
  }

  ngOnInit() {
    let username = this.userService.getUserName();
    this.getUserInfo(username);
    this.quankhoachvon.dMDonVi().subscribe(res => {
      this.donviTaos = res.data;
      console.log(this.donviTaos);
    })
  }

  //get infor user
  async getUserInfo(username: any) {
    await this.userService.getUserInfo(username).subscribe(
      (data) => {
        if (data?.statusCode == 0) {
          this.donvitao = data?.data.dvql;
          this.nguoinhap = data?.data.username;
          console.log(data)
        } else {
        }
      },
      (err) => {
        console.log(err);
      },
    );
  }

  //lay ten don vi tạo
  getUnitName() {
    return this.donviTaos.find((item) => item.maDvi == this.donvitao)?.tenDvi;
  }

  //get trạng thai
  getStatusName(trangthai:any):string {
    const utils = new Utils();
    return utils.getStatusName(trangthai);
  }

  //tim kiếm
  timkiem(){
    let objsearch={
        maDviTao:this.donvitao,
        maPa:this.maPa,
        namPa:this.namPa,
        ngayTaoDen:this.denngay,
        ngayTaoTu:this.ngaylap,
        soCv:this.soCV,
        soQD:this.soQd,
        str:null,
        trangThai:this.trangthai,
        paggingReq:{
            limit: 20,
            page: 1
        }
    }
    console.log(objsearch);
    this.quankhoachvon.timkiemphuongan(objsearch).subscribe(res => {
        if(res.statusCode==0){
            console.log(res);
            this.listVanban=res.data.content;
            this.totalitem = res.data.totalElements;
            console.log(this.listVanban);
        }
    })
  }
  
  //tao moi
  taomoi(){
    
    console.log(this.loaivanban);
    if(this.loaivanban==""){
        alert('Bạn chưa chọn loại văn bản');
        this.router.navigate(["/qlkh-von-phi/quan-ly-lap-tham-dinh-du-toan-nsnn/tim-kiem-phuong-an-qd-cv-giao-so-kiem-tra-nsnn"])
    }
     if(this.loaivanban=="CV"){
        this.router.navigate(["/qlkh-von-phi/quan-ly-lap-tham-dinh-du-toan-nsnn/qd-cv-giao-so-kiem-tra-tran-chi-nsnn-cho-cac-don-vi"]);
    }if(this.loaivanban=="PA"){
        this.router.navigate(["qlkh-von-phi/quan-ly-lap-tham-dinh-du-toan-nsnn/xay-dung-phuong-an-giao-so-kiem-tra-tran-chi-nsnn-cho-cac-don-vi"]);
    }
}

  //
  dong(){
      this.router.navigate(['/'])
  }
}
