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

export class  ItemData {
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
     donVis: any = [];                            //don vi se hien thi

     tuNgay: string;                              //tim kiem tu ngay
     denNgay: string;                             //tim kiem den ngay
     tenDvi: string;
     nam: number;                                 //nam tim kiem
     maDvi: string;                               //id don vi tim kiem
     capDvi: string;
     lstCTietBCao: ItemData[] = [];                      // list chi tiet bao cao
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
          private userSerivce: UserService,
          private notification: NzNotificationService,
          private danhMucService: DanhMucHDVService,
          private modal: NzModalService,
     ) {
     }


     async ngOnInit() {
          let userName = this.userSerivce.getUserName();
          let userInfo: any = await this.getUserInfo(userName); //get user info
          this.maDvi = userInfo?.dvql;

          const utils = new Utils();

          this.statusBtnDel = utils.getRoleDel('1', 2, userInfo?.roles[0]?.id);
          this.statusBtnSave = utils.getRoleSave('1', 2, userInfo?.roles[0]?.id);
          this.statusBtnApprove = utils.getRoleApprove('1', 2, userInfo?.roles[0]?.id);
          this.statusBtnTBP = utils.getRoleTBP('2', 2, userInfo?.roles[0]?.id);
          this.statusBtnLD = utils.getRoleLD('4', 2, userInfo?.roles[0]?.id);
          this.statusBtnGuiDVCT = utils.getRoleGuiDVCT('6', 2, userInfo?.roles[0]?.id);
          this.statusBtnDVCT = utils.getRoleDVCT('7', 2, userInfo?.roles[0]?.id);
          
          //lay danh sach danh muc don vi
          await this.danhMucService.dMDonVi().toPromise().then(
               (data) => {
                    if (data.statusCode == 0) {
                         this.donVis = data.data;
                         console.log(this.donVis);
                         this.donVis.forEach(e => {
                              if (e.maDvi == this.maDvi) {
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
               maDvi: this.maDvi,
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
                         if (!this.statusBtnTBP) {
                              this.lstCTietBCao = this.lstCTietBCao.filter(e => e.trangThai == '2');
                         } else {
                              if (!this.statusBtnLD) {
                                   this.lstCTietBCao = this.lstCTietBCao.filter(e => e.trangThai == '4');
                              } else {
                                   this.lstCTietBCao = this.lstCTietBCao.filter(e => ((e.trangThai)!='2')&&(e.trangThai!='4'));
                              }
                         }
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
          return this.donVis.find(item => item.maDvi == this.maDvi)?.tenDvi;
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