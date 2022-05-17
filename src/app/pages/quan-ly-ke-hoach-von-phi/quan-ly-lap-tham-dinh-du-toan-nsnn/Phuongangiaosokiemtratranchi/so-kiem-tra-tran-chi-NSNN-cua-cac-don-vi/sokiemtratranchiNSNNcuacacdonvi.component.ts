import { DatePipe, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserService } from 'src/app/services/user.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { DONVITIEN, Utils } from 'src/app/Utility/utils';
import * as uuid from 'uuid';
import * as fileSaver from 'file-saver';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MESSAGE } from 'src/app/constants/message';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';

export class chitietpagiao {
  id: any;
  maDviNhan: string;
  maDviTao: string;
  maDviTien: string;
  maGiao: string;
  maNhom: string;
  maNoiDung: string;
  maPa: string;
  namGiao: any;
  ngayTao: any;
  nguoiTao: string;
  soDuocGiao: number;
  tenDviNhan: string;
  tenDviTao: string;
  tenDviTien: string;
  tenNhom: string;
  tenNoiDung: string;
  tenTrangThai: string;
  trangThai: string;
  soCv:string;
  soQd:string;
}

@Component({
  selector: 'app-sokiemtratranchiNSNNcuacacdonvi',
  templateUrl: './sokiemtratranchiNSNNcuacacdonvi.component.html',
  styleUrls: ['./sokiemtratranchiNSNNcuacacdonvi.component.scss']
})
export class SokiemtratranchiNSNNcuacacdonviComponent implements OnInit {


  statusBtnDel: boolean; // trang thai an/hien nut xoa
  statusBtnSave: boolean; // trang thai an/hien nut luu
  statusBtnApprove: boolean; // trang thai an/hien nut trinh duyet
  statusBtnTBP: boolean; // trang thai an/hien nut truong bo phan
  statusBtnLD: boolean; // trang thai an/hien nut lanh dao
  statusBtnGuiDVCT: boolean; // trang thai nut gui don vi cap tren
  statusBtnDVCT: boolean; // trang thai nut don vi cap tren

  listDonViTien:any []=DONVITIEN;
  currentday: Date = new Date();
  //////
    id!: any;
    ngaynhap: any;
    nguoinhap: any;
    chucvu: any;
    noitao: any;
    noinhan: any;
    mapa: any;
    magiao: any;
    trangthai: any;
    namhientai: any;
    objChitiet: chitietpagiao;
    checkdata: boolean = false;
    currentdate: Date = new Date();
    listchitiet: any[] = [];
    userInfor: any;
    tongso: number;
    trangThaiBanGhi:string ='1';
    donViTaos:any []=[];
    donvitao:any;
    maDviTien:any;
    //bien url
    maDonviNhan:any;
    maPa:any;
  constructor(
    private nguoiDungSerivce: UserService,
    private quanLyVonPhiService: QuanLyVonPhiService,
    private spinner: NgxSpinnerService,
    private router: ActivatedRoute,
    private datepipe: DatePipe,
    private sanitizer: DomSanitizer,
    private route: Router,
    private notification : NzNotificationService,
    private location: Location,
    private danhMucService : DanhMucHDVService,
  ) {}

  async ngOnInit() {
    let userName = this.nguoiDungSerivce.getUserName();
    let userInfor: any = await this.getUserInfo(userName); //get user info
    //check param dieu huong router
    this.maDonviNhan = this.router.snapshot.paramMap.get('maDonViNhan');
    this.maPa = this.router.snapshot.paramMap.get('maPa');
    let objChiTietSoTranChi ={
      maDviNhan:this.maDonviNhan,
      maPa:this.maPa
    }
    this.quanLyVonPhiService.getchitiettranchi(objChiTietSoTranChi).subscribe(
      res => {
          if (res.statusCode == 0) {
              this.listchitiet = res.data.lstCTiet;
              this.objChitiet = res.data;
              this.maDviTien = res.data.maDviTien;
             this.objChitiet.ngayTao = this.datepipe.transform(this.objChitiet?.ngayTao, 'dd/MM/yyyy');
              this.checkdata = true;
              if (this.listchitiet.length != 0) {
                  this.tongso = 0;
                  this.listchitiet.forEach(e => {
                      this.tongso += e.soDuocGiao;
                  });
              }

          } else {
            this.notification.error(MESSAGE.ERROR, res?.msg);
              this.checkdata = false;
          }
      },
      err => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
          this.checkdata = false;
      },
  );
  this.quanLyVonPhiService.dMDonVi().toPromise().then(res =>{
    if(res.statusCode==0){
      this.donViTaos = res.data;
    }
  })
    this.spinner.hide();
    //check role cho các nut trinh duyet
    const utils = new Utils();
    this.statusBtnDel = utils.getRoleDel(
      this.trangThaiBanGhi,
      2,
      userInfor?.roles[0]?.code,
    );
    this.statusBtnSave = utils.getRoleSave(
      this.trangThaiBanGhi,
      2,
      userInfor?.roles[0]?.code,
    );
    this.statusBtnApprove = utils.getRoleApprove(
      this.trangThaiBanGhi,
      2,
      userInfor?.roles[0]?.code,
    );
    this.statusBtnTBP = utils.getRoleTBP(
      this.trangThaiBanGhi,
      2,
      userInfor?.roles[0]?.code,
    );
    this.statusBtnLD = utils.getRoleLD(
      this.trangThaiBanGhi,
      2,
      userInfor?.roles[0]?.code,
    );
    this.statusBtnGuiDVCT = utils.getRoleGuiDVCT(
      this.trangThaiBanGhi,
      2,
      userInfor?.roles[0]?.code,
    );
    this.statusBtnDVCT = utils.getRoleDVCT(
      this.trangThaiBanGhi,
      2,
      userInfor?.roles[0]?.code,
    );
  }

  redirectkehoachvonphi() {
    // this.route.navigate(['/qlkh-von-phi/quan-ly-lap-tham-dinh-du-toan-nsnn']);
    this.location.back()
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



  //lay ten don vi tạo
  getUnitName(maDonVi:any) {
    return this.donViTaos.find((item) => item.maDvi == maDonVi)?.tenDvi;
  }

  getStatusName(maTrangThai:any) {
    const utils = new Utils();
    return utils.getStatusName(maTrangThai);
  }


}
