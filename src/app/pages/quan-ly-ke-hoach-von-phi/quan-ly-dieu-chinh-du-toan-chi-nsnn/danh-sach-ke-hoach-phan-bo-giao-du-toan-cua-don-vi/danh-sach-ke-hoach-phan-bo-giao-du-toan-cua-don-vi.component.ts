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

export class danhMuc {
     id: number;
     tenDm: string;
}
@Component({
     selector: 'app-danh-sach-ke-hoach-phan-bo-giao-du-toan-cua-don-vi',
     templateUrl: './danh-sach-ke-hoach-phan-bo-giao-du-toan-cua-don-vi.component.html',
     styleUrls: ['./danh-sach-ke-hoach-phan-bo-giao-du-toan-cua-don-vi.component.scss'],
})



export class DanhSachKeHoachPhanBoGiaoDuToanCuaDonViComponent implements OnInit {
     donVis: danhMuc[] = [];                            //don vi se hien thi
     chiCucs: any = [];                           //danh muc don vi cap chi cuc
     cucKhuVucs: any = [];                        //danh muc don vi cap cuc khu vuc
     tongCucs: any = [];                           //danh muc don vi cap tong cuc

     tuNgayQd: string;                              //tim kiem tu ngay
     denNgayQd: string;                             //tim kiem den ngay
     tuNgayGn: string;
     denNgayGn: string;
     soQd: string;
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

          const utils = new Utils();
          this.statusBtnDuyet = utils.getRoleTBP('2', 2, userInfo?.roles[0]?.id);
          this.statusBtnPheDuyet = utils.getRoleLD('4', 2, userInfo?.roles[0]?.id);
          this.statusBtnTuChoi = (this.statusBtnDuyet && this.statusBtnPheDuyet);
          this.statusBtnTaoMoi = !(this.statusBtnTuChoi);

          //lay danh sach danh muc don vi
          this.danhMucService.dMDonVi().toPromise().then(
               (data) => {
                    if (data.statusCode == 0) {
                         this.chiCucs = data.data;
                    } else {
                         this.notification.error(MESSAGE.ERROR, data?.msg);
                    }
               },
               (err) => {
                    this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
               }
          );
          
          let idDviQl = userInfo?.dvql;
          if (this.chiCucs.findIndex(item => item.id == idDviQl)) {
               this.chiCucs.forEach(item => {
                    let mm: danhMuc = {
                         id: item.id,
                         tenDm: item.tenDvi,
                    }
                    this.donVis.push(mm);
               })
               this.status = false;
          } else {
               this.status = true;
               if (this.cucKhuVucs.findIndex(item => item.id == idDviQl)) {
                    this.cucKhuVucs.forEach(item => {
                         let mm: danhMuc = {
                              id: item.id,
                              tenDm: item.tenDvi,
                         }
                         this.donVis.push(mm);
                    })
               } else {
                    this.tongCucs.forEach(item => {
                         let mm: danhMuc = {
                              id: item.id,
                              tenDm: item.tenDvi,
                         }
                         this.donVis.push(mm);
                    })
               }
          }


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
               tuNgayQd: this.datePipe.transform(this.tuNgayQd, Utils.FORMAT_DATE_STR,),
               denNgayQd: this.datePipe.transform(this.denNgayQd, Utils.FORMAT_DATE_STR,),
               tuNgayGn: this.datePipe.transform(this.tuNgayGn, Utils.FORMAT_DATE_STR,),
               denNgayGn: this.datePipe.transform(this.denNgayGn, Utils.FORMAT_DATE_STR,),
               soQd: this.soQd,
               paggingReq: {
                    limit: this.pages.size,
                    page: this.pages.page,
               },
               trangThai: "",
          }


          this.quanLyVonPhiService.timkiem325(request).subscribe(
               (data) => {
                    if (data.statusCode == 0) {
                         this.lstCTietBCao = data.data.content;
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
