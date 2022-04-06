import { DatePipe, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import * as fileSaver from 'file-saver';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import * as uuid from "uuid";
import { DanhMucHDVService } from '../../../../../services/danhMucHDV.service';
import { Utils } from "../../../../../Utility/utils";
import { MESSAGE } from '../../../../../constants/message';
import { ItemDanhSach } from '../../../quy-trinh-bao-cao-thuc-hien-du-toan-chi-nsnn/chuc-nang-chi-cuc/bao-cao/bao-cao.component';

@Component({
     selector: 'app-danh-sach-van-ban-gui-tcdt-ve-du-toan-nsnn',
     templateUrl: './danh-sach-van-ban-gui-tcdt-ve-du-toan-nsnn.component.html',
     styleUrls: ['./danh-sach-van-ban-gui-tcdt-ve-du-toan-nsnn.component.scss'],
})

export class DanhSachVanBanGuiTcdtVeDuToanNsnnComponent implements OnInit {
     userInfo: any;
     errorMessage!: String;                      //
     trangThais: any = [
          {
               id: "1",
               tenDm: "Đang soạn",
          },
          {
               id: "2",
               tenDm: "Đã gửi TCDT",
          },
     ];
     cucKhuVucs: any = [];                          // danh muc nhom chi

     lstCTietBCao: any = [];              // list chi tiet bao cao
     chiTietBcaos: any;                          // thong tin chi tiet bao cao

     tuNgay: string;
     denNgay: string;
     soVanBan: string;
     maDvi: string;
     maTrangThai: number;

     pages = {
          size: 10,
          page: 1,
     };
     totalPages!: number;
     totalElements!: number;

     userName: any;                              // ten nguoi dang nhap

     constructor(private router: Router,
          private routerActive: ActivatedRoute,
          private spinner: NgxSpinnerService,
          private quanLyVonPhiService: QuanLyVonPhiService,
          private datePipe: DatePipe,
          private sanitizer: DomSanitizer,
          private danhMucService: DanhMucHDVService,
          private userService: UserService,
          private notification: NzNotificationService,
          private location: Location
     ) {
     }


     async ngOnInit() {
          let userName = this.userService.getUserName();
          let userInfo: any = await this.getUserInfo(userName); //get user info

          this.danhMucService.dMDonVi().toPromise().then(
               (data) => {
                    if (data.statusCode == 0) {
                         this.cucKhuVucs = data.data;
                         this.cucKhuVucs = this.cucKhuVucs.filter(item => item.capDvi === "2");
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
          let userInfo = await this.userService.getUserInfo(username).toPromise().then(
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


     // call chi tiet bao cao
     async getDetailReport() {
          this.spinner.show();
          let request = {
               maDonVi: null, //this.maDvi,
               ngayTaoTu: null,// this.datePipe.transform(this.tuNgay, Utils.FORMAT_DATE_STR),
               ngayTaoDen: null, //this.datePipe.transform(this.denNgay, Utils.FORMAT_DATE_STR),
               paggingReq: {
                    limit: this.pages.size,
                    page: this.pages.page,
               },
               soVban: null,//this.soVanBan,
               trangThai: this.maTrangThai,
          }
          await this.quanLyVonPhiService.timDsachVban(request).toPromise().then(
               (data) => {
                    if (data.statusCode == 0) {
                         this.chiTietBcaos = data.data;
                         this.lstCTietBCao = data.data.content;
                         this.totalPages = data.data.totalPages;
                         this.totalElements = data.data.totalElements;
                    } else {
                         this.notification.error(MESSAGE.ERROR, data?.msg);
                    }
               },
               (err) => {
                     this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE)
               }
          );
          this.spinner.hide();
     }

     redirectChiTieuKeHoachNam() {
          // this.router.navigate(['/kehoach/chi-tieu-ke-hoach-nam-cap-tong-cuc']);
          this.location.back()
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
     dong(){
       this.location.back()
     }
}
