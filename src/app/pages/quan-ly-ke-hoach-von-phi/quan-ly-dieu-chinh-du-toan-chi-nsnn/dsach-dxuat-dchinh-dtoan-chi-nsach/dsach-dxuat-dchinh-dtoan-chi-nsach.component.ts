import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as uuid from "uuid";
import { DanhMucService } from '../../../../services/danhMuc.service';
import { DatePipe } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { DomSanitizer } from '@angular/platform-browser';
import * as fileSaver from 'file-saver';
import { Utils } from "../../../../Utility/utils";
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { min } from 'moment';


@Component({
     selector: 'app-dsach-dxuat-dchinh-dtoan-chi-nsach',
     templateUrl: './dsach-dxuat-dchinh-dtoan-chi-nsach.component.html',
     styleUrls: ['./dsach-dxuat-dchinh-dtoan-chi-nsach.component.scss'],
})

export class DsachDxuatDchinhDtoanChiNsachComponent implements OnInit {
     donVis: any = [];
     cucKhuVucs: any = [];
     maDvi!: string;
     lstCTietBCao: any = [];              // list chi tiet bao cao
     userInfo: any;
     errorMessage!: String;                      //
     id!: any;                                   // id truyen tu router
     chiTietBcaos: any;                          // thong tin chi tiet bao cao
     lstFile: any = [];                          // list File de day vao api
     status: boolean = false;                     // trang thai an/ hien cua trang thai
     tuNgay!: string;
     denNgay!: string;
     lyDoTuChoi!: string; 
     namBcao = new Date().getFullYear();         // nam bao cao
     userName: any;                              // ten nguoi dang nhap
     ngayNhap!: any;                             // ngay nhap
     nguoiNhap!: string;                         // nguoi nhap
     maDonViTao!: any;                           // ma don vi tao
     maBaoCao!: string;                          // ma bao cao
     namBaoCaoHienHanh!: any;                    // nam bao cao hien hanh
     trangThaiBanGhi: string = "1";                   // trang thai cua ban ghi
     maLoaiBaoCao: string = "26";                // nam bao cao
     maDviTien: string = "";                   // ma don vi tien
     noiNhan!: string;
     ghiChu!: string;
     donViThucHien!: string;
     trang: number = 1;
     tenTrangThai!: string;
     newDate = new Date();                       //
     fileToUpload!: File;                        // file tai o input
     listFile: File[] = [];                      // list file chua ten va id de hien tai o input
     box1 = true;                                // bien de an hien box1
     fileUrl: any;                               // url
     listIdDelete: string = "";                  // list id delete

     statusBtnDel: boolean;                       // trang thai an/hien nut xoa
     statusBtnSave: boolean;                      // trang thai an/hien nut luu
     statusBtnApprove: boolean;                   // trang thai an/hien nut trinh duyet
     statusBtnTBP: boolean;                       // trang thai an/hien nut truong bo phan
     statusBtnLD: boolean;                        // trang thai an/hien nut lanh dao
     statusBtnGuiDVCT: boolean;                   // trang thai nut gui don vi cap tren
     statusBtnDVCT: boolean;                      // trang thai nut don vi cap tren

     listIdFiles: string;                        // id file luc call chi tiet

     constructor(private router: Router,
          private routerActive: ActivatedRoute,
          private spinner: NgxSpinnerService,
          private quanLyVonPhiService: QuanLyVonPhiService,
          private datePipe: DatePipe,
          private sanitizer: DomSanitizer,
          private userSerivce: UserService,
          private danhMucService: DanhMucService,
     ) {
          this.ngayNhap = this.datePipe.transform(this.newDate, 'dd-MM-yyyy',)
     }


     async ngOnInit() {
          this.id = this.routerActive.snapshot.paramMap.get('id');
          let userName = this.userSerivce.getUserName();
          let userInfo: any = await this.getUserInfo(userName); //get user info
          if (this.id) {
               this.getDetailReport();
          } else {
               this.trangThaiBanGhi = "1";
               this.nguoiNhap = userInfo?.username;
               this.maDonViTao = userInfo?.dvql;
               this.spinner.show();
               this.quanLyVonPhiService.sinhMaBaoCao().subscribe(
                    (data) => {
                         if (data.statusCode == 0) {
                              this.maBaoCao = data.data;
                         } else {
                              this.errorMessage = "Có lỗi trong quá trình sinh mã báo cáo vấn tin!";
                         }
                    },
                    (err) => {
                         this.errorMessage = err.error.message;
                    }
               );
               this.maBaoCao = '';
               this.namBaoCaoHienHanh = new Date().getFullYear();
          }

          const utils = new Utils();
          this.statusBtnDel = utils.getRoleDel(this.trangThaiBanGhi, 2, userInfo?.roles[0]?.id);
          this.statusBtnSave = utils.getRoleSave(this.trangThaiBanGhi, 2, userInfo?.roles[0]?.id);
          this.statusBtnApprove = utils.getRoleApprove(this.trangThaiBanGhi, 2, userInfo?.roles[0]?.id);
          this.statusBtnTBP = utils.getRoleTBP(this.trangThaiBanGhi, 2, userInfo?.roles[0]?.id);
          this.statusBtnLD = utils.getRoleLD(this.trangThaiBanGhi, 2, userInfo?.roles[0]?.id);
          this.statusBtnGuiDVCT = utils.getRoleGuiDVCT(this.trangThaiBanGhi, 2, userInfo?.roles[0]?.id);
          this.statusBtnDVCT = utils.getRoleDVCT(this.trangThaiBanGhi, 2, userInfo?.roles[0]?.id);

          
          //lay danh sach danh muc don vi
          this.danhMucService.dMDonVi().toPromise().then(
               (data) => {
                    if (data.statusCode == 0) {
                         this.donVis = data.data;
                    } else {
                         this.errorMessage = "Có lỗi trong quá trình vấn tin!";
                    }
               },
               (err) => {
                    this.errorMessage = "err.error.message";
               }
          );
          this.spinner.hide();
     }

     //get user info
     async getUserInfo(username: string) {
          let userInfo = await this.userSerivce.getUserInfo(username).toPromise().then(
               (data) => {
                    if (data?.statusCode == 0) {
                         this.userInfo = data?.data
                         return data?.data;
                    } else {

                    }
               },
               (err) => {
                    console.log(err);
               }
          );
          return userInfo;
     }

     // chuc nang check role
     onSubmit(mcn: String) {
          const requestGroupButtons = {
               id: this.id,
               maChucNang: mcn,
               type: "",
          };
          this.spinner.show();
          this.quanLyVonPhiService.approve(requestGroupButtons).subscribe((data) => {
               if (data.statusCode == 0) {
                    this.getDetailReport();
               }
          });
          this.spinner.hide();
     }


     // call chi tiet bao cao
     getDetailReport() {
          this.spinner.hide();
          this.quanLyVonPhiService.bCChiTiet(this.id).subscribe(
               (data) => {
                    if (data.statusCode == 0) {
                         this.chiTietBcaos = data.data;
                         this.lstCTietBCao = data.data.lstCTietBCao;
                         this.lstFile = data.data.lstFile;

                         // set thong tin chung bao cao
                         this.ngayNhap = data.data.ngayTao;
                         this.nguoiNhap = data.data.nguoiTao;
                         this.maDonViTao = data.data.maDvi;
                         this.maBaoCao = data.data.maBcao;
                         this.namBaoCaoHienHanh = data.data.namBcao;
                         this.trangThaiBanGhi = data.data.trangThai;
                         if (
                              this.trangThaiBanGhi == '1' ||
                              this.trangThaiBanGhi == '3' ||
                              this.trangThaiBanGhi == '5' ||
                              this.trangThaiBanGhi == '8'
                         ) {
                              this.status = false;
                         } else {
                              this.status = true;
                         }
                         // set list id file ban dau
                         this.lstFile.filter(item => {
                              this.listIdFiles += item.id + ",";
                         })
                    } else {
                         this.errorMessage = "Có lỗi trong quá trình vấn tin!";
                    }
               },
               (err) => {
                    console.log(err);
                    this.errorMessage = err.error.message;
               }
          );
          this.spinner.show();
     }

     // xoa dong
     deleteById(id: any): void {
          this.lstCTietBCao = this.lstCTietBCao.filter(item => item.id != id)
          if (typeof id == "number") {
               this.listIdDelete += id + ",";
          }
     }


     redirectChiTieuKeHoachNam() {
          this.router.navigate(['/kehoach/chi-tieu-ke-hoach-nam-cap-tong-cuc']);
     }

     // lay ten trang thai
     getStatusName() {
          const utils = new Utils();
          return utils.getStatusName(this.trangThaiBanGhi);
     }

     // lay ten don vi tao
     getUnitName() {
          return this.donVis.find(item => item.maDvi == this.maDonViTao)?.tenDvi;
     }

     firstPage(){
          this.trang = 1;
     }
     prePage() {
          if (this.trang > 1) {
               this.trang -= 1;
          }
     }
     nextPage(){
          this.trang += 1;
     }

}
