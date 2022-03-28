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
     selector: 'app-chon-chi-tiet-cua-phan-bo-du-toan-chi-da-giao',
     templateUrl: './chon-chi-tiet-cua-phan-bo-du-toan-chi-da-giao.component.html',
     styleUrls: ['./chon-chi-tiet-cua-phan-bo-du-toan-chi-da-giao.component.scss'],
})



export class ChonChiTietCuaPhanBoDuToanChiDaGiaoComponent implements OnInit {
     donVis: danhMuc[] = [];                            //don vi se hien thi
     chiCucs: any = [];                           //danh muc don vi cap chi cuc
     cucKhuVucs: any = [];                        //danh muc don vi cap cuc khu vuc
     tongCucs: any = [];                           //danh muc don vi cap tong cuc

     idDvi: number;                               //id don vi tim kiem
     lstCTietBCao: any = [
          {
               checked: false,
               stt : "1",
               ten: "Kinh phí giao tự chủ"
          },
          {
               checked: false,
               stt : "2",
               ten: "Quỹ lương"
          },
          {
               checked: false,
               stt : "2.1",
               ten: "Chi phí quản lý hành chính theo hạn mức"
          },
          {
               checked: false,
               stt : "2.2",
               ten: "Khác"
          },
          {
               checked: false,
               stt : "2.3",
               ten: "Chi hỗ trợ đảm chi thường xuyên ở đơn vị sự nghiệp"
          },
          {
               checked: false,
               stt : "2.4",
               ten: "Chi khác"
          },
     ];                      
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
          this.danhMucService.dMMaCucDtnnKvucs().toPromise().then(
               (data) => {
                    if (data.statusCode == 0) {
                         this.cucKhuVucs = data.data?.content;
                    } else {
                         this.notification.error(MESSAGE.ERROR, data?.msg);
                    }
               },
               (err) => {
                    this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
               }
          );

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

     redirectChiTieuKeHoachNam() {
          this.router.navigate(['/kehoach/chi-tieu-ke-hoach-nam-cap-tong-cuc']);
     }

 

}
