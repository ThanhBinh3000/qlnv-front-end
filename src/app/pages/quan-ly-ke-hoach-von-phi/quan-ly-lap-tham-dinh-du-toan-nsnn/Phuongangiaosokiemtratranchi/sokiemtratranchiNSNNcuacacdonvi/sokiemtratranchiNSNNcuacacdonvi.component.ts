import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { NguoiDungService } from 'src/app/services/nguoidung.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { Utils } from 'src/app/Utility/utils';
import * as uuid from 'uuid';
import * as fileSaver from 'file-saver';

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
  constructor(
    private nguoiDungSerivce: NguoiDungService,
    private quanLyVonPhiService: QuanLyVonPhiService,
    private spinner: NgxSpinnerService,
    private router: ActivatedRoute,
    private datepipe: DatePipe,
    private sanitizer: DomSanitizer,
    private route: Router,
  ) {}

  async ngOnInit() {
    let userName = localStorage.getItem('userName');
    let userInfor: any = await this.getUserInfo(userName); //get user info
    //check param dieu huong router
    this.id = this.router.snapshot.paramMap.get('id');
    this.quanLyVonPhiService.getchitiettranchi(this.id).subscribe(
      res => {
          if (res.statusCode == 0) {
              this.listchitiet = res.data.lstCTiet;
              this.objChitiet = res.data;
             this.objChitiet.ngayTao = this.datepipe.transform(this.objChitiet?.ngayTao, 'dd/MM/yyyy');
              this.checkdata = true;
              if (this.listchitiet.length != 0) {
                  this.tongso = 0;
                  this.listchitiet.forEach(e => {
                      this.tongso += e.soDuocGiao;
                  });
              }
              console.log(res);
          } else {
              alert('Có lỗi trong quá trình vấn tin!');
              this.checkdata = false;
          }
      },
      err => {
          alert(err.error.message);
          this.checkdata = false;
      },
  );
    
    this.spinner.hide();
    //check role cho các nut trinh duyet
    const utils = new Utils();
    this.statusBtnDel = utils.getRoleDel(
      this.trangThaiBanGhi,
      2,
      userInfor?.roles[0]?.id,
    );
    this.statusBtnSave = utils.getRoleSave(
      this.trangThaiBanGhi,
      2,
      userInfor?.roles[0]?.id,
    );
    this.statusBtnApprove = utils.getRoleApprove(
      this.trangThaiBanGhi,
      2,
      userInfor?.roles[0]?.id,
    );
    this.statusBtnTBP = utils.getRoleTBP(
      this.trangThaiBanGhi,
      2,
      userInfor?.roles[0]?.id,
    );
    this.statusBtnLD = utils.getRoleLD(
      this.trangThaiBanGhi,
      2,
      userInfor?.roles[0]?.id,
    );
    this.statusBtnGuiDVCT = utils.getRoleGuiDVCT(
      this.trangThaiBanGhi,
      2,
      userInfor?.roles[0]?.id,
    );
    this.statusBtnDVCT = utils.getRoleDVCT(
      this.trangThaiBanGhi,
      2,
      userInfor?.roles[0]?.id,
    );
  }

  redirectkehoachvonphi() {
    this.route.navigate(['/qlkh-von-phi/quan-ly-lap-tham-dinh-du-toan-nsnn']);
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
  getUnitName() {
    return this.donViTaos.find((item) => item.maDvi == this.donvitao)?.tenDvi;
  }

  getStatusName() {
    const utils = new Utils();
    return utils.getStatusName(this.trangThaiBanGhi);
  }

  
}
