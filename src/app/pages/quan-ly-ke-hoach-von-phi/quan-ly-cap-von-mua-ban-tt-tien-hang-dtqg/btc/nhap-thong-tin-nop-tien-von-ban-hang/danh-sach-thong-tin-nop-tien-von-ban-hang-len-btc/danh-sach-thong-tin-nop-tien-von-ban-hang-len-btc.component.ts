import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as uuid from "uuid";
import { DanhMucService } from '../../../../../../services/danhMuc.service';
import { DatePipe } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { DomSanitizer } from '@angular/platform-browser';
import * as fileSaver from 'file-saver';
import { Utils } from "../../../../../../Utility/utils";
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { NzUploadFile } from 'ng-zorro-antd/upload';

@Component({
     selector: 'app-danh-sach-thong-tin-nop-tien-von-ban-hang-len-btc',
     templateUrl: './danh-sach-thong-tin-nop-tien-von-ban-hang-len-btc.component.html',
     styleUrls: ['./danh-sach-thong-tin-nop-tien-von-ban-hang-len-btc.component.scss'],
})

export class DanhSachThongTinNopTienVonBanHangLenBtcComponent implements OnInit {
     tuNgayLap!: string;
     denNgayLap!: string;
     tuNgayPd!: string;
     denNgayPd!: string;
     
     lstCTietBCao: any = [];              // list chi tiet bao cao

     userInfo: any;
     errorMessage!: String;                      //
     id!: any;                                   // id truyen tu router
     
     userName: any;   

     pages = {
          size: 10,
          page: 1,
     };
     totalPages!: number;
     totalElements!: number;

     statusBtnDuyet: boolean;                       // trang thai an/hien nut duyet
     statusBtnPheDuyet: boolean;                      // trang thai an/hien nut phe duyet
     statusBtnTuChoi: boolean;                   // trang thai an/hien nut tu choi
     statusBtnTaoMoi: boolean;

     constructor(private router: Router,
          private routerActive: ActivatedRoute,
          private spinner: NgxSpinnerService,
          private quanLyVonPhiService: QuanLyVonPhiService,
          private datePipe: DatePipe,
          private sanitizer: DomSanitizer,
          private userSerivce: UserService,
          private danhMucService: DanhMucService,
     ) {}


     async ngOnInit() {
          let userName = this.userSerivce.getUserName();
          let userInfo: any = await this.getUserInfo(userName); //get user info

          const utils = new Utils();
          this.statusBtnDuyet = utils.getRoleTBP('2', 2, userInfo?.roles[0]?.id);
          this.statusBtnPheDuyet = utils.getRoleLD('4', 2, userInfo?.roles[0]?.id);
          this.statusBtnTuChoi = (this.statusBtnDuyet && this.statusBtnPheDuyet);
          this.statusBtnTaoMoi = !this.statusBtnTuChoi;

          this.spinner.hide();
     }

     //get user info
     async getUserInfo(username: string) {
          let userInfo = await this.userSerivce.getUserInfo(username).toPromise().then(
               (data) => {
                    if (data?.statusCode == 0) {
                         this.userInfo = data?.data;
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
                         //this.chiTietBcaos = data.data;
                         this.lstCTietBCao = data.data.lstCTietBCao;
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
