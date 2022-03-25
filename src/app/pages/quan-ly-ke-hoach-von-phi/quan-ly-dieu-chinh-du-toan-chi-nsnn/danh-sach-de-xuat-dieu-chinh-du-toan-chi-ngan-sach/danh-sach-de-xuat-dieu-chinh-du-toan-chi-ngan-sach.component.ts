import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as uuid from "uuid";
import { DanhMucHDVService } from '../../../../services/danhMucHDV.service';
import { DatePipe } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { DomSanitizer } from '@angular/platform-browser';
import * as fileSaver from 'file-saver';
import { Utils } from "../../../../Utility/utils";
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { min } from 'moment';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MESSAGE } from '../../../../constants/message';
import { elementEventFullName } from '@angular/compiler/src/view_compiler/view_compiler';


@Component({
     selector: 'app-danh-sach-de-xuat-dieu-chinh-du-toan-chi-ngan-sach',
     templateUrl: './danh-sach-de-xuat-dieu-chinh-du-toan-chi-ngan-sach.component.html',
     styleUrls: ['./danh-sach-de-xuat-dieu-chinh-du-toan-chi-ngan-sach.component.scss'],
})



export class DanhSachDeXuatDieuChinhDuToanChiNganSachComponent implements OnInit {
     donVis: any = [];                            //don vi se hien thi
     chiCucs: any = [];                           //danh muc don vi cap chi cuc
     cucKhuVucs: any = [];                        //danh muc don vi cap cuc khu vuc
     tongCucs: any = [];                           //danh muc don vi cap tong cuc

     tuNgay: string;                              //tim kiem tu ngay
     denNgay: string;                             //tim kiem den ngay
     tenDvi: string;
     nam: number;                                 //nam tim kiem
     idDvi: number;                               //id don vi tim kiem
     lstCTietBCao: any = [];                      // list chi tiet bao cao
     userInfo: any;
     status: boolean = false;                     // trang thai an/ hien cua cot noi dung
     userName: any;                              // ten nguoi dang nhap

     //dung de phan trang
     pages = {
          size: 10,
          page: 1,
     };
     totalPages!: number;
     totalElements!: number;

     statusBtnDuyet: boolean;
     statusBtnPheDuyet: boolean;
     statusBtnTuChoi: boolean;
     statusBtnTaoMoi: boolean;


     constructor(private router: Router,
          private routerActive: ActivatedRoute,
          private spinner: NgxSpinnerService,
          private quanLyVonPhiService: QuanLyVonPhiService,
          private datePipe: DatePipe,
          private sanitizer: DomSanitizer,
          private userSerivce: UserService,
          private notification: NzNotificationService,
          private danhMucService: DanhMucHDVService,
     ) {
     }


     async ngOnInit() {
          let userName = this.userSerivce.getUserName();
          let userInfo: any = await this.getUserInfo(userName); //get user info
          console.log(userInfo);
          const utils = new Utils();
          this.statusBtnDuyet = utils.getRoleTBP('2', 2, userInfo?.roles[0]?.id);
          this.statusBtnPheDuyet = utils.getRoleLD('4', 2, userInfo?.roles[0]?.id);
          this.statusBtnTuChoi = (this.statusBtnDuyet && this.statusBtnPheDuyet);
          this.statusBtnTaoMoi = !(this.statusBtnTuChoi);
          //lay danh sach danh muc don vi
          await this.danhMucService.dMDonVi().toPromise().then(
               (data) => {
                    if (data.statusCode == 0) {
                         this.donVis = data.data;
                    } else {
                         this.notification.error(MESSAGE.ERROR, data?.msg);
                    }
               },
               (err) => {
                    this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
               }
          );

          await this.donVis.forEach(item => {
               if ((item.maDvi).length == 4) {
                    this.cucKhuVucs.push(item);
               } else {
                    if ((item.maDvi).length == 6) {
                         this.chiCucs.push(item);
                    } else {
                         this.tongCucs.push(item);
                    }
               }
          })

          this.idDvi = userInfo?.dvql;
          if (this.chiCucs.findIndex(item => item.id == this.idDvi) != -1) {
               this.donVis = this.chiCucs;
               this.status = false;
          } else {
               this.status = true;
               if (this.cucKhuVucs.findIndex(item => item.id == this.idDvi) != -1) {
                    this.donVis = this.cucKhuVucs;
               } else {
                    this.donVis = this.tongCucs;
               }
          }

          this.tenDvi = this.getUnitName();
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
                         this.notification.error(MESSAGE.ERROR, data?.msg);
                    }
               },
               (err) => {
                    this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
               }
          );
          return userInfo;
     }

     // chuc nang check role
     onSubmit(mcn: String) {
          const requestGroupButtons = {
               //id: this.id,
               maChucNang: mcn,
               type: "",
          };
          this.spinner.show();
          this.quanLyVonPhiService.approve(requestGroupButtons).subscribe(
               (data) => {
                    if (data.statusCode == 0) {
                         //this.getDetailReport();
                         this.notification.success(MESSAGE.SUCCESS, MESSAGE.SUCCESS);
                    } else {
                         this.notification.error(MESSAGE.ERROR, data?.msg);
                    }
               },
               err => {
                    this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
               }
          );
          this.spinner.hide();
     }


     // call chi tiet bao cao
     getDetailReport() {
          this.spinner.show();

          let request = {
               maDvi: this.idDvi,
               ngayTaoTu: this.datePipe.transform(this.tuNgay, 'dd/MM/yyyy',),
               ngayTaoDen: this.datePipe.transform(this.denNgay, 'dd/MM/yyyy',),
               namHienHanh: this.nam,
               paggingReq: {
                    limit: this.pages.size,
                    page: this.pages.page,
               },
               trangThai: "",
               soQd: "",
               str: "",
          }

          


          this.quanLyVonPhiService.timkiem325(request).subscribe(
               (data) => {
                    if (data.statusCode == 0) {
                         
                         this.lstCTietBCao = data.data.content;
                         console.log(this.lstCTietBCao);
                         this.lstCTietBCao.forEach(e => {
                              e.ngayTao = this.datePipe.transform(e.ngayTao, 'dd/MM/yyy');
                         });
                         this.totalElements = data.data.totalElements;
                         this.totalPages = data.data.totalPages;

                    } else {
                         this.notification.error(MESSAGE.ERROR, data?.msg);
                    }
               },
               (err) => {
                    this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
               }
          );
          this.spinner.hide();
     }



     // xoa dong
     deleteById(id: any): void {
          this.lstCTietBCao = this.lstCTietBCao.filter(item => item.id != id)
     }

     // lay ten don vi tao
     getUnitName() {
          return this.donVis.find(item => item.id == this.idDvi)?.tenDvi;
     }

     // lay ten trang thai
     getStatusName(trangThaiBanGhi: string) {
          const utils = new Utils();
          return utils.getStatusName(trangThaiBanGhi);
     }

     redirectChiTieuKeHoachNam() {
          this.router.navigate(['/kehoach/chi-tieu-ke-hoach-nam-cap-tong-cuc']);
     }

     //doi so trang
     onPageIndexChange(page) {
          this.pages.page = page;
          this.getDetailReport();
     }

     //doi so luong phan tu tren 1 trang
     onPageSizeChange(size) {
          this.pages.size = size;
          this.getDetailReport();
     }

}
