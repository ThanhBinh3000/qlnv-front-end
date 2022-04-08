import { DatePipe, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MESSAGE } from 'src/app/constants/message';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { Utils } from 'src/app/Utility/utils';

@Component({
  selector: 'app-timkiemsokiemtratranchiNSNNcuacacdonvi',
  templateUrl: './timkiemsokiemtratranchiNSNNcuacacdonvi.component.html',
  styleUrls: ['./timkiemsokiemtratranchiNSNNcuacacdonvi.component.scss']
})
export class TimkiemsokiemtratranchiNSNNcuacacdonviComponent implements OnInit {

  namgiao:any;
  ngaygiao:any;
  denngay:any;
  donvitao:string;
  trangthai:any;
  donvinhan:string;
  magiao:any;
  mapa:any;
  currentYear: Date = new Date();
  listDvnhan:any[]=[];
  listSogiaoTranChi:any []=[];
  totalitem:any;
  donviTaos:any []=[];
  listVanban:any []=[];
  length:number =0;
  constructor(
    private userService: UserService,
     private router: Router,
     private quankhoachvon :QuanLyVonPhiService,
     private danhmuc :DanhMucHDVService,
     private datepipe:DatePipe,
     private notification: NzNotificationService,
     private location: Location
     ) {
    this.namgiao = this.currentYear.getFullYear();
  }

  ngOnInit() {
    let username = this.userService.getUserName();
    this.getUserInfo(username);
    this.quankhoachvon.dMDonVi().subscribe(res => {
      if(res.statusCode==0){
        this.donviTaos = res.data;
        console.log(this.donviTaos)
      }else{
        this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
      }


    })
    this.danhmuc.dmDonViNhan().subscribe(res =>{
        if(res.statusCode==0){
          this.listDvnhan= res.data.content;
        }else{
          this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
        }


  })
  }

  //get infor user
  async getUserInfo(username: any) {
    await this.userService.getUserInfo(username).subscribe(
      (data) => {
        if (data?.statusCode == 0) {
          this.donvitao = data?.data.dvql;

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
  getUnitName(mdv:any):string {
    return this.donviTaos.find((item) => item.maDvi == this.donvitao)?.tenDvi;
  }

  //get trạng thai
  getStatusName(trangthai:any):string {
    const utils = new Utils();
    return utils.getStatusName(trangthai);
  }

  getlistsogiaokiemtra(){

    console.log(this.datepipe.transform(this.ngaygiao,'dd/MM/yyyy'));
    let req ={
        maDviNhan:this.donvinhan,
        maDviTao:this.donvitao,
        maGiao:this.magiao,
        maPa:this.mapa,
        namGiao:this.namgiao,
        ngayTaoDen:this.datepipe.transform(this.denngay,'dd/MM/yyyy'),
        ngayTaoTu:this.datepipe.transform(this.ngaygiao,'dd/MM/yyyy'),
        paggingReq: {
            limit: 1000,
            page: 1
        },
        str: "",
        trangThai: this.trangthai,
    }
    console.log(req);
    this.quankhoachvon.timkiemsokiemtratranchi(req).subscribe(res => {
        console.log(res);
        if(res.statusCode==0){
          this.length = res.data.totalElements;
          this.listSogiaoTranChi = res.data.content;
        }else{
          this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
        }

    })
  }


  //
  dong(){
      // this.router.navigate(['/'])
    this.location.back()
  }

}
