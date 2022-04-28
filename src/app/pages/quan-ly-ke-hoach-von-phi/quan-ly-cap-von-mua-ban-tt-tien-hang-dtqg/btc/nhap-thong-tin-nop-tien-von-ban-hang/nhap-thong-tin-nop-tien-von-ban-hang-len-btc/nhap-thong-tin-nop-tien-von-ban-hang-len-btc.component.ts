import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as uuid from "uuid";
import { DanhMucHDVService } from '../../../../../../services/danhMucHDV.service';
import { DatePipe } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { DomSanitizer } from '@angular/platform-browser';
import * as fileSaver from 'file-saver';
import { DONVITIEN, Utils } from "../../../../../../Utility/utils";
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MESSAGE } from '../../../../../../constants/message';
import { utils } from 'xlsx';

export class ItemData {
     maDvi!: string;
     loaiVon!: string;
     maVtu!: string;
     maChungLoai!: string;
     sl!: number;
     maDviTinh: string;
     soTien!: number;
     maDviTien!: number;
     thanhTien!: number;
     ngayGhiNhan!: string;
     ghiChu!: string;
     id!: any;
     stt!: String;
     checked!: boolean;
}

@Component({
     selector: 'app-nhap-thong-tin-nop-tien-von-ban-hang-len-btc',
     templateUrl: './nhap-thong-tin-nop-tien-von-ban-hang-len-btc.component.html',
     styleUrls: ['./nhap-thong-tin-nop-tien-von-ban-hang-len-btc.component.scss'],
})

export class NhapThongTinNopTienVonBanHangLenBtcComponent implements OnInit {
     donVis: any = [];
     cucKhuVucs: any = [];
     vatTus: any = [];
     nguonVons: any = [];
     chungLoais: any = [];
     dviTinhs: any = [];
     dviTiens: any = DONVITIEN;
     ngayNhap!: string;
     nguoiNhap!: string;
     noiLap: string = "Cục TVQT";
     noiNhan!: string;
     trangThaiBanGhi: string = "1";
     noiCap: string = "Bộ tài chính";
     ccQd!: string;
     ngayQd!: string;
     veViec!: string;
     lyDoTuChoi!: string;
     dviThucHien!: string;

     status: boolean = true;

     lstCTietBCao: ItemData[] = [];              // list chi tiet bao cao
     userInfo: any;
     errorMessage!: String;                      //
     id!: any;                                   // id truyen tu router
     chiTietBcaos: any;                          // thong tin chi tiet bao cao
     lstFile: any = [];
     userName: any;                              // ten nguoi dang nhap
     // trang thai cua ban gh
     newDate = new Date();                       //
     fileToUpload!: File;                        // file tai o input
     listFile: File[] = [];                      // list file chua ten va id de hien tai o input
     box1 = true;                                // bien de an hien box1
     fileUrl: any;                               // url
     listIdDelete: string = "";                  // list id delete

     statusBtnDuyet: boolean;                       // trang thai an/hien nut duyet
     statusBtnPheDuyet: boolean;                      // trang thai an/hien nut phe duyet
     statusBtnTuChoi: boolean;                   // trang thai an/hien nut tu choi
     statusBtnTaoMoi: boolean;
     listIdFiles: string;                        // id file luc call chi tiet
     

     fileList: NzUploadFile[] = [];

     beforeUpload = (file: NzUploadFile): boolean => {
          this.fileList = this.fileList.concat(file);
          return false;
     };

     // upload file
     addFile() {
          const id = this.fileToUpload?.lastModified.toString();
          this.lstFile.push({ id: id, fileName: this.fileToUpload?.name });
          this.listFile.push(this.fileToUpload);
     }

     handleUpload(): void {
          this.fileList.forEach((file: any) => {
               const id = file?.lastModified.toString();
               this.lstFile.push({ id: id, fileName: file?.name });
               this.listFile.push(file);
          });
          this.fileList = [];
     }


     constructor(private router: Router,
          private routerActive: ActivatedRoute,
          private spinner: NgxSpinnerService,
          private quanLyVonPhiService: QuanLyVonPhiService,
          private datePipe: DatePipe,
          private sanitizer: DomSanitizer,
          private userSerivce: UserService,
          private danhMucService: DanhMucHDVService,
          private notification: NzNotificationService,
     ) {
          this.ngayNhap = this.datePipe.transform(this.newDate, 'dd-MM-yyyy',)
     }


     async ngOnInit() {
          this.id = this.routerActive.snapshot.paramMap.get('id');
          let userName = this.userSerivce.getUserName();
          let userInfo: any = await this.getUserInfo(userName); //get user info
          console.log(userInfo);
          if (this.id) {
               this.getDetailReport();
          } else {
               this.nguoiNhap = userInfo?.username;
               this.spinner.show();
          }

          const utils = new Utils();
          this.statusBtnDuyet = utils.getRoleTBP('2', 2, userInfo?.roles[0]?.id);
          this.statusBtnPheDuyet = utils.getRoleLD('4', 2, userInfo?.roles[0]?.id);
          this.statusBtnTuChoi = (this.statusBtnDuyet && this.statusBtnPheDuyet);
          this.statusBtnTaoMoi = !this.statusBtnTuChoi;


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
          //lay danh sach danh muc don vi
          this.danhMucService.dMCucKhuVuc().toPromise().then(
               (data) => {
                    if (data.statusCode == 0) {
                         this.cucKhuVucs = data.data;
                    } else {
                         this.errorMessage = "Có lỗi trong quá trình vấn tin!";
                    }
               },
               (err) => {
                    this.errorMessage = "err.error.message";
               }
          );
          //lay danh sach danh muc nguon von
          this.danhMucService.dMNguonVon().toPromise().then(
               (data) => {
                    if (data.statusCode == 0) {
                         this.nguonVons = data.data?.content;
                    } else {
                         this.errorMessage = "Có lỗi trong quá trình vấn tin!";
                    }
               },
               (err) => {
                    this.errorMessage = "err.error.message";
               }
          );
          //lay danh sach danh muc don vi tinh
          this.danhMucService.dMDviTinh().toPromise().then(
               (data) => {
                    if (data.statusCode == 0) {
                         this.dviTinhs = data.data?.content;
                    } else {
                         this.errorMessage = "Có lỗi trong quá trình vấn tin!";
                    }
               },
               (err) => {
                    this.errorMessage = "err.error.message";
               }
          );

          //lay danh sach danh muc vat tu
          this.danhMucService.dMVatTu().toPromise().then(
               (data) => {
                    if (data.statusCode == 0) {
                         this.vatTus = data.data?.content;
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

     //
     selectFile(files: FileList): void {
          this.fileToUpload = files.item(0);
     }

     // xoa
     xoa() {
          this.lstCTietBCao = [];
          this.lstFile = [];
          this.listFile = []
     }

     // luu
     async luu() {
          // let listFile: any = [];
          // for (const iterator of this.listFile) {
          //      listFile.push(await this.uploadFile(iterator));
          // }

          // // replace nhung ban ghi dc them moi id thanh null
          // this.lstCTietBCao.filter(item => {
          //      if (typeof item.id != "number") {
          //           item.id = null;
          //      }
          // })

          // // gui du lieu trinh duyet len server
          // let request = {
          //      id: this.id,
          //      fileDinhKems: listFile,
          //      listIdFiles: this.listIdFiles,                      // id file luc get chi tiet tra ra( de backend phuc vu xoa file)
          //      lstCTietBCao: this.lstCTietBCao,
          //      maBcao: this.maBaoCao,
          //      maDvi: this.maDonViTao,
          //      maDviTien: this.maDviTien,
          //      maLoaiBcao: this.maLoaiBaoCao,
          //      namHienHanh: this.namBaoCaoHienHanh,
          //      namBcao: this.namBaoCaoHienHanh,
          // };

          // //call service them moi
          // this.spinner.show();
          // if (this.id == null) {
          //      this.quanLyVonPhiService.trinhDuyetService(request).subscribe(
          //           data => {
          //                if (data.statusCode == 0) {
          //                     this.notification.success(MESSAGE.SUCCESS, MESSAGE.SUCCESS);
          //                } else {
          //                     this.notification.error(MESSAGE.ERROR, data?.msg);
          //                }
          //           },
          //           err => {
          //                this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
          //                console.log(err);
          //           },
          //      );
          // } else {
          //      this.quanLyVonPhiService.updatelist(request).subscribe(res => {
          //           if (res.statusCode == 0) {
          //                this.notification.success(MESSAGE.SUCCESS, MESSAGE.SUCCESS);
          //           } else {
          //                this.notification.error(MESSAGE.ERROR, res?.msg);
          //           }
          //      }, err => {
          //           this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
          //      })
          // }
          // this.lstCTietBCao.filter(item => {
          //      if (!item.id) {
          //           item.id = uuid.v4();
          //      }
          // });
          // this.updateEditCache();
          // this.spinner.hide();
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
          this.quanLyVonPhiService.bCLapThamDinhDuToanChiTiet(this.id).subscribe(
               (data) => {
                    if (data.statusCode == 0) {
                         this.chiTietBcaos = data.data;
                         this.lstCTietBCao = data.data.lstCTietBCao;
                         this.lstFile = data.data.lstFile;

                         // set thong tin chung bao cao
                         this.ngayNhap = data.data.ngayTao;
                         this.nguoiNhap = data.data.nguoiTao;
                         this.trangThaiBanGhi = data.data.trangThai;

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

     //upload file
     async uploadFile(file: File) {
          // day file len server
          const upfile: FormData = new FormData();
          upfile.append('file', file);
          upfile.append('folder', this.noiCap + '/' + this.noiLap + '/');
          let temp = await this.quanLyVonPhiService.uploadFile(upfile).toPromise().then(
               (data) => {
                    let objfile = {
                         fileName: data.filename,
                         fileSize: data.size,
                         fileUrl: data.url,
                    }
                    return objfile;
               },
               err => {
                    this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
               },
          );
          return temp;
     }

     changeStatus() {
          this.status = !this.status;
     }

     // xóa với checkbox
     deleteSelected() {
          // add list delete id
          this.lstCTietBCao.filter(item => {
               if (item.checked == true && typeof item.id == "number") {
                    this.listIdDelete += item.id + ","
               }
          })
          // delete object have checked = true
          this.lstCTietBCao = this.lstCTietBCao.filter(item => item.checked != true)
     }

     // xoa file trong bang file
     deleteFile(id: string): void {
          this.lstFile = this.lstFile.filter((a: any) => a.id !== id);
          this.listFile = this.listFile.filter((a: any) => a?.lastModified.toString() !== id);
     }

     //download file về máy tính
     downloadFile(id: string) {
          let file!: File;
          this.listFile.forEach(element => {
               if (element?.lastModified.toString() == id) {
                    file = element;
               }
          });
          const blob = new Blob([file], { type: "application/octet-stream" });
          this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
               window.URL.createObjectURL(blob)
          );
          fileSaver.saveAs(blob, file.name);
     }


     redirectChiTieuKeHoachNam() {
          this.router.navigate(['/kehoach/chi-tieu-ke-hoach-nam-cap-tong-cuc']);
     }

     // lay ten trang thai
     getStatusName() {
          const utils = new Utils();
          return utils.getStatusName(this.trangThaiBanGhi);
     }

}
