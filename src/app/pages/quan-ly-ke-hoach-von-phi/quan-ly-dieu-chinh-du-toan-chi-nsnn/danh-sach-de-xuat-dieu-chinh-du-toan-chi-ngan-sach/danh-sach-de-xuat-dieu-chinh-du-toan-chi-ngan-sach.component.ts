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
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { NzModalService } from 'ng-zorro-antd/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';

export class ItemData {
     id!: any;
     stt!: string;
     checked!: boolean;
     ngayTao!: string;
     maDvi!: string;
     namPb!: number;
     noiDung!: string;
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
          private modal: NzModalService,
          private fb: FormBuilder,
     ) {
     }


     async ngOnInit() {

          this.validateForm = this.fb.group({
               namhientai: [null, [Validators.pattern('^[12][0-9]{3}$')]],
               temp: null,
               dviTemp: [null],
          });

          let userName = this.userService.getUserName();
          await this.getUserInfo(userName); //get user info
          this.searchFilter.maDvi = this.userInfo?.dvql;

          const utils = new Utils();
          //lay danh sach danh muc don vi
          await this.danhMucService.dMDonVi().toPromise().then(
               (data) => {
                    if (data.statusCode == 0) {
                         this.donVis = data.data;
                         console.log(this.donVis);
                         this.donVis.forEach(e => {
                              if (e.maDvi == this.searchFilter.maDvi) {
                                   this.capDvi = e.capDvi;
                              }
                         })
                    } else {
                         this.notification.error(MESSAGE.ERROR, data?.msg);
                    }
               },
               (err) => {
                    this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
               }
          );
          if (this.capDvi == '3') {
               this.status = false;
          } else {
               this.status = true;
          }

          this.tenDvi = this.getUnitName();
          this.spinner.hide();
     }

     getStatusButton() {
          const utils = new Utils();
          // this.statusBtnDel = utils.getRoleDel(this.trangThaiBanGhi, 2, this.userInfo?.roles[0]?.id);
          // this.statusBtnSave = utils.getRoleSave(this.trangThaiBanGhi, 2, this.userInfo?.roles[0]?.id);
          // this.statusBtnApprove = utils.getRoleApprove(this.trangThaiBanGhi, 2, this.userInfo?.roles[0]?.id);
          // this.statusBtnTBP = utils.getRoleTBP(this.trangThaiBanGhi, 2, this.userInfo?.roles[0]?.id);
          // this.statusBtnLD = utils.getRoleLD(this.trangThaiBanGhi, 2, this.userInfo?.roles[0]?.id);
          // this.statusBtnGuiDVCT = utils.getRoleGuiDVCT(this.trangThaiBanGhi, 2, this.userInfo?.roles[0]?.id);
          // this.statusBtnDVCT = utils.getRoleDVCT(this.trangThaiBanGhi, 2, this.userInfo?.roles[0]?.id);
          // this.statusBtnLDDC = utils.getRoleLDDC(this.trangThaiBanGhi, 2, this.userInfo?.roles[0]?.id);
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
     onSubmit(mcn: String, lyDoTuChoi: string) {
          this.lstCTietBCao.forEach(item => {
               if (item.checked) {
                    const requestGroupButtons = {
                         id: item.id,
                         maChucNang: mcn,
                         lyDotuChoi: lyDoTuChoi,
                    };
                    this.spinner.show();
                    this.quanLyVonPhiService.approveBaoCao(requestGroupButtons).toPromise().then(
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
          })
     }

     tuChoi(mcn: string) {
          const modalTuChoi = this.modal.create({
               nzTitle: 'Từ chối',
               nzContent: DialogTuChoiComponent,
               nzMaskClosable: false,
               nzClosable: false,
               nzWidth: '900px',
               nzFooter: null,
               nzComponentParams: {},
          });
          modalTuChoi.afterClose.subscribe(async (text) => {
               if (text) {
                    this.onSubmit(mcn, text);
               }
          });
     }


     // call chi tiet bao cao
     getDetailReport() {
          this.spinner.show();

          let request = {
               maDvi: this.searchFilter.maDvi,
               ngayTaoTu: this.datePipe.transform(this.searchFilter.tuNgay, Utils.FORMAT_DATE_STR),
               ngayTaoDen: this.datePipe.transform(this.searchFilter.denNgay, Utils.FORMAT_DATE_STR),
               namHienHanh: this.searchFilter.nam,
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
                         if (!this.statusBtnTBP) {
                              this.lstCTietBCao = this.lstCTietBCao.filter(e => e.trangThai == '2');
                         } else {
                              if (!this.statusBtnLD) {
                                   this.lstCTietBCao = this.lstCTietBCao.filter(e => e.trangThai == '4');
                              } else {
                                   this.lstCTietBCao = this.lstCTietBCao.filter(e => ((e.trangThai) != '2') && (e.trangThai != '4'));
                              }
                         }
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
          this.router.navigate([
               '/qlkh-von-phi/quan-ly-dieu-chinh-du-toan-chi-nsnn/lap-bao-cao-dieu-chinh-du-toan-chi-nsnn',
          ]);
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