import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as uuid from "uuid";
import { DanhMucHDVService } from '../../../../services/danhMucHDV.service';
import { DatePipe } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { DomSanitizer } from '@angular/platform-browser';
import * as fileSaver from 'file-saver';
import { TRANGTHAIBANGHI, Utils } from "../../../../Utility/utils";
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { min } from 'moment';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MESSAGE } from '../../../../constants/message';
import { elementEventFullName } from '@angular/compiler/src/view_compiler/view_compiler';
import { NzModalService } from 'ng-zorro-antd/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';

export class ItemData {
     id!: any;
     stt!: string;
     checked!: boolean;
     ngayTao!: string;
     maDvi!: string;
     nam!: number;
     ghiChu!: string;
     trangThai!: string;
}

@Component({
     selector: 'app-danh-sach-de-xuat-dieu-chinh-du-toan-chi-ngan-sach',
     templateUrl: './danh-sach-de-xuat-dieu-chinh-du-toan-chi-ngan-sach.component.html',
     styleUrls: ['./danh-sach-de-xuat-dieu-chinh-du-toan-chi-ngan-sach.component.scss'],
})



export class DanhSachDeXuatDieuChinhDuToanChiNganSachComponent implements OnInit {

     lstCTietBCao: ItemData[] = [];                      // list chi tiet bao cao
     totalPages!: number;
     totalElements!: number;
     donVis: any = [];                            //don vi se hien thi
     messageValidate: any = MESSAGEVALIDATE;

     trangThais: any[] = TRANGTHAIBANGHI;

     searchFilter = {
          tuNgay: "",
          denNgay: "",
          maDvi: null,
          nam: null,
     }

     tenDvi: string;
     capDvi: string;

     userInfo: any;
     status: boolean = false;                     // trang thai an/ hien cua cot noi dung
     userName: any;                              // ten nguoi dang nhap

     //dung de phan trang
     pages = {
          size: 10,
          page: 1,
     };


     statusBtnDel: boolean;                       // trang thai an/hien nut xoa
     statusBtnSave: boolean;                      // trang thai an/hien nut luu
     statusBtnApprove: boolean;                   // trang thai an/hien nut trinh duyet
     statusBtnTBP: boolean;                       // trang thai an/hien nut truong bo phan
     statusBtnLD: boolean;                        // trang thai an/hien nut lanh dao
     statusBtnGuiDVCT: boolean;                   // trang thai nut gui don vi cap tren
     statusBtnDVCT: boolean;                      // trang thai nut don vi cap tren

     constructor(private router: Router,
          private routerActive: ActivatedRoute,
          private spinner: NgxSpinnerService,
          private quanLyVonPhiService: QuanLyVonPhiService,
          private datePipe: DatePipe,
          private sanitizer: DomSanitizer,
          private userService: UserService,
          private notification: NzNotificationService,
          private danhMucService: DanhMucHDVService,
          private modal: NzModalService,
     ) {
     }


     async ngOnInit() {

          let userName = this.userService.getUserName();
          await this.getUserInfo(userName); //get user info
          this.searchFilter.maDvi = this.userInfo?.dvql;

          const utils = new Utils();
          //lay danh sach danh muc don vi
          await this.danhMucService.dMDonVi().toPromise().then(
               (data) => {
                    if (data.statusCode == 0) {
                         this.donVis = data.data;
                         this.donVis.forEach(e => {
                              if (e.maDvi == this.searchFilter.maDvi) {
                                   this.capDvi = e.capDvi;
                              }
                         })
                         if (this.capDvi == Utils.CHI_CUC){
                              this.status = false;
                         } else {
                              this.status = true;
                         }
                    } else {
                         this.notification.error(MESSAGE.ERROR, data?.msg);
                    }
               },
               (err) => {
                    this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
               }
          );
          this.tenDvi = this.getUnitName();
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

     // call chi tiet bao cao
     getDetailReport() {
          if (this.searchFilter.nam >= 3000 || this.searchFilter.nam < 1000) {
			this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.WRONG_FORMAT);
			return;
		}
          this.spinner.show();

          let request = {
               maDvi: this.searchFilter.maDvi,
               ngayTaoTu: this.datePipe.transform(this.searchFilter.tuNgay, Utils.FORMAT_DATE_STR),
               ngayTaoDen: this.datePipe.transform(this.searchFilter.denNgay, Utils.FORMAT_DATE_STR),
               nam: this.searchFilter.nam,
               paggingReq: {
                    limit: this.pages.size,
                    page: this.pages.page,
               },
               trangThai: "",
               soQd: "",
          }

          this.quanLyVonPhiService.timKiemDieuChinh(request).subscribe(
               (data) => {
                    if (data.statusCode == 0) {

                         this.lstCTietBCao = data.data.content;
                         this.lstCTietBCao.forEach(e => {
                              e.ngayTao = this.datePipe.transform(e.ngayTao, Utils.FORMAT_DATE_STR);
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

     xoaDieuKien() {
          this.searchFilter.nam = null
          this.searchFilter.tuNgay = null
          this.searchFilter.denNgay = null
     }

     taoMoi() {
          if (this.capDvi == Utils.CHI_CUC){
               this.router.navigate([
                    '/qlkh-von-phi/quan-ly-dieu-chinh-du-toan-chi-nsnn/lap-bao-cao-dieu-chinh-du-toan-chi-nsnn',
               ]);
          } else {
               this.router.navigate([
                    '/qlkh-von-phi/quan-ly-dieu-chinh-du-toan-chi-nsnn/lap-bao-cao-dieu-chinh-kiem-tra',
               ]);
          }
     }

     // xoa dong
     deleteById(id: any): void {
          this.lstCTietBCao = this.lstCTietBCao.filter(item => item.id != id)
     }

     // lay ten don vi tao
     getUnitName() {
          return this.donVis.find(item => item.maDvi == this.searchFilter.maDvi)?.tenDvi;
     }

     // lay ten trang thai
     getStatusName(trangThaiBanGhi: string) {
          return this.trangThais.find(e => e.id == trangThaiBanGhi)?.tenDm;
     }

     redirectChiTieuKeHoachNam() {
          this.router.navigate(['/kehoach/chi-tieu-ke-hoach-nam-cap-tong-cuc']);
     }

     xem(id: any){
          if (this.capDvi == Utils.CHI_CUC){
               this.router.navigate([
                    '/qlkh-von-phi/quan-ly-dieu-chinh-du-toan-chi-nsnn/lap-bao-cao-dieu-chinh-du-toan-chi-nsnn' + id,
               ]);
          } else {
               this.router.navigate([
                    '/qlkh-von-phi/quan-ly-dieu-chinh-du-toan-chi-nsnn/lap-bao-cao-dieu-chinh-kiem-tra' + id,
               ]);
          }
     }

     getStatusEdit(trangThai: any): boolean{
          if (
               trangThai == Utils.TT_BC_1 ||
               trangThai == Utils.TT_BC_3 ||
               trangThai == Utils.TT_BC_5 ||
               trangThai == Utils.TT_BC_8
          ) {
               return false;
          }
          return true;
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