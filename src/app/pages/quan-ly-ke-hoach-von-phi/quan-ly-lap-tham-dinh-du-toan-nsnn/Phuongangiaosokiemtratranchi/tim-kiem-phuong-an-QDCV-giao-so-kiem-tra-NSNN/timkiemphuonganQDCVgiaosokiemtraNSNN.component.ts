import { DatePipe, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { TRANGTHAI, Utils } from 'src/app/Utility/utils';

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
  donViTaos: any[] = [];
  totalitem:any;
  checkroleDvi:any;
  listTrangThai: any=TRANGTHAI;
  validateForm!: FormGroup; 
  messageValidate:any = MESSAGEVALIDATE;
  constructor(
    private userService: UserService,
     private router: Router,
     private quankhoachvon :QuanLyVonPhiService,
     private notification : NzNotificationService,
     private location: Location,
     private fb: FormBuilder,
     private datePipe : DatePipe,
     ) {
    // this.namPa = this.currentYear.getFullYear().toString();   
  }

  async ngOnInit() {
    this.validateForm = this.fb.group({
      loaivanban: [null, [Validators.required]],
      temp: [null],
    });
    let username = this.userService.getUserName();
    let userInfor: any = await this.getUserInfo(username); //get user info
    this.quankhoachvon.dMDonVi().subscribe(res => {
      this.donViTaos = res.data;
    })
  }

  //get infor user
  async getUserInfo(username: any) {
    await this.userService.getUserInfo(username).subscribe(
      (data) => {
        if (data?.statusCode == 0) {
          console.log(data);
          this.donvitao = data?.data.dvql;
          this.nguoinhap = data?.data.username;
          this.checkroleDvi = data?.data.roles[0].id;
        } else {
        }
      },
      (err) => {

      },
    );
  }

  submitForm(){
    if (this.validateForm.valid) {
      return true;
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return false;
    }
  }
  //lay ten don vi tạo
  getUnitName() {
     return this.donViTaos.find(item => item.maDvi== this.donvitao)?.tenDvi;
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
        ngayTaoDen:this.datePipe.transform(this.denngay,'dd/MM/yyyy'),
        ngayTaoTu:this.datePipe.transform(this.ngaylap,'dd/MM/yyyy') ,
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
          console.log(res)
            this.listVanban=res.data.content;
            this.listVanban.forEach( e => {
              e.ngayTao = this.datePipe.transform(e.ngayTao, 'dd/MM/yyyy')
            })
            this.totalitem = res.data.totalElements;
        }else{
          this.notification.error(MESSAGE.ERROR, res?.msg);
        }
    })
  }

  //tao moi
  taomoi(){

    
     if(this.loaivanban=="CV"){
        this.router.navigate(["/qlkh-von-phi/quan-ly-lap-tham-dinh-du-toan-nsnn/qd-cv-giao-so-kiem-tra-tran-chi-nsnn-cho-cac-don-vi"]);
    }if(this.loaivanban=="PA"){
        this.router.navigate(["qlkh-von-phi/quan-ly-lap-tham-dinh-du-toan-nsnn/xay-dung-phuong-an-giao-so-kiem-tra-tran-chi-nsnn-cho-cac-don-vi"]);
    }
}

  //
  dong(){
      // this.router.navigate(['/'])
      this.location.back()
  }
}
