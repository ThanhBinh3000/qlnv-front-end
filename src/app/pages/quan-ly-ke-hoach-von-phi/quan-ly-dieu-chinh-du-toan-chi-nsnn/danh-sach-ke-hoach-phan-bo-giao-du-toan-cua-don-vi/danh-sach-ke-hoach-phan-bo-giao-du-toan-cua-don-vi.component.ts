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
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';


@Component({
     selector: 'app-danh-sach-ke-hoach-phan-bo-giao-du-toan-cua-don-vi',
     templateUrl: './danh-sach-ke-hoach-phan-bo-giao-du-toan-cua-don-vi.component.html',
     styleUrls: ['./danh-sach-ke-hoach-phan-bo-giao-du-toan-cua-don-vi.component.scss'],
})



export class DanhSachKeHoachPhanBoGiaoDuToanCuaDonViComponent implements OnInit {
     totalPages!: number;
     totalElements!: number;
     lstCTietBCao: any = [];                      // list chi tiet bao cao
     userInfo: any;

     donVis: any = [];                            //don vi se hien thi
     messageValidate: any = MESSAGEVALIDATE;

     searchFilter = {
          nam: null,
          tuNgayQd: null,
          denNgayQd: null,
          tuNgayGn: null,
          denNgayGn: null,
          soQd: null,
          maDvi: null,
     }

     status: boolean = false;                     // trang thai an/ hien cua cot noi dung
     userName: any;                              // ten nguoi dang nhap

     //dung de phan trang
     pages = {
          size: 10,
          page: 1,
     };


     statusBtnDuyet: boolean;
     statusBtnPheDuyet: boolean;
     statusBtnTuChoi: boolean;
     statusBtnTaoMoi: boolean;

     validateForm!: FormGroup;           // form

     submitForm() {
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


     constructor(private router: Router,
          private routerActive: ActivatedRoute,
          private spinner: NgxSpinnerService,
          private quanLyVonPhiService: QuanLyVonPhiService,
          private datePipe: DatePipe,
          private sanitizer: DomSanitizer,
          private userService: UserService,
          private notification: NzNotificationService,
          private danhMucService: DanhMucHDVService,
          private fb: FormBuilder,
     ) {
     }


     async ngOnInit() {
          this.validateForm = this.fb.group({
               namhientai: [null, [Validators.pattern('^[12][0-9]{3}$')]],
               temp: null,
               soQdTemp: [null],
          });

          let userName = this.userService.getUserName();
          await this.getUserInfo(userName); //get user info
          this.searchFilter.maDvi = this.userInfo?.dvql;
          const utils = new Utils();

          //lay danh sach danh muc don vi
          this.danhMucService.dMDonVi().toPromise().then(
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

          this.spinner.hide();
     }

     //get user info
     async getUserInfo(username: string) {
          await this.userService.getUserInfo(username).toPromise().then(
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
               maDvi: this.searchFilter.maDvi,
               tuNgayQd: this.datePipe.transform(this.searchFilter.tuNgayQd, Utils.FORMAT_DATE_STR,),
               denNgayQd: this.datePipe.transform(this.searchFilter.denNgayQd, Utils.FORMAT_DATE_STR,),
               tuNgayGn: this.datePipe.transform(this.searchFilter.tuNgayGn, Utils.FORMAT_DATE_STR,),
               denNgayGn: this.datePipe.transform(this.searchFilter.denNgayGn, Utils.FORMAT_DATE_STR,),
               soQd: this.searchFilter.soQd,
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

     xoaDieuKien() {
          this.searchFilter.nam = null
          this.searchFilter.tuNgayQd = null
          this.searchFilter.denNgayQd = null
          this.searchFilter.tuNgayGn = null
          this.searchFilter.denNgayGn = null
          this.searchFilter.soQd = null
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
