import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as uuid from "uuid";
import { DanhMucService } from '../../../../services/danhMuc.service';
import { DatePipe } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { DomSanitizer } from '@angular/platform-browser';
import * as fileSaver from 'file-saver';
import { Utils } from "../../../../Utility/utils";
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { NzUploadFile } from 'ng-zorro-antd/upload';


@Component({
     selector: 'app-ktra-rsoat-ndung-bcao-dcdt-nsnn-do-chi-cuc-gui',
     templateUrl: './ktra-rsoat-ndung-bcao-dcdt-nsnn-do-chi-cuc-gui.component.html',
     styleUrls: ['./ktra-rsoat-ndung-bcao-dcdt-nsnn-do-chi-cuc-gui.component.scss'],
})

export class KtraRsoatNdungBcaoDcdtNsnnDoChiCucGuiComponent implements OnInit {
     noiDungs: any = [];
     nhomChis: any = [];
     khoanChis: any = [];
     phanBos: any = [];
     donVis: any = [];
     lstCTietBCao: any = [];              // list chi tiet bao cao
     userInfo: any;
     errorMessage!: String;                      //
     id!: any;                                   // id truyen tu router
     chiTietBcaos: any;                          // thong tin chi tiet bao cao
     lstFile: any = [];                          // list File de day vao api
     status: boolean = false;                     // trang thai an/ hien cua trang thai
     namBcao = new Date().getFullYear();         // nam bao cao
     userName: any;                              // ten nguoi dang nhap
     ngayNhap!: any;                             // ngay nhap
     nguoiNhap!: string;                         // nguoi nhap
     maDonViTao!: any;                           // ma don vi tao
     maBaoCao!: string;                          // ma bao cao
     namBaoCaoHienHanh!: any;                    // nam bao cao hien hanh
     trangThaiBanGhi: string = "1";                   // trang thai cua ban ghi
     maLoaiBaoCao: string = "26";                 // ma don vi tien
     lyDoTuChoi!: string;
     ghiChu!: string;
     donViThucHien!: string;
     soQd!: string;
     ngayQd!: string;
     phanBo!: string;
     tenTrangThai!: string;
     newDate = new Date();                       //
     fileToUpload!: File;                        // file tai o input
     listFile: File[] = [];                      // list file chua ten va id de hien tai o input
     box1 = true;                                // bien de an hien box1
     fileUrl: any;                               // url
     listIdDelete: string = "";                  // list id delete

     statusBtnDuyet: boolean;
     statusBtnPheDuyet: boolean;
     statusBtnTuChoi: boolean;
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
          private danhMucService: DanhMucService,
     ) {
          this.ngayNhap = this.datePipe.transform(this.newDate, 'dd-MM-yyyy',)
     }


     async ngOnInit() {
          this.id = this.routerActive.snapshot.paramMap.get('id');
          let userName = this.userSerivce.getUserName();
          let userInfo: any = await this.getUserInfo(userName); //get user info
          if (this.id) {
               this.getDetailReport();
          } else {
               this.trangThaiBanGhi = "1";
               this.nguoiNhap = userInfo?.username;
               this.maDonViTao = userInfo?.dvql;
               this.spinner.show();
               this.quanLyVonPhiService.sinhMaBaoCao().subscribe(
                    (data) => {
                         if (data.statusCode == 0) {
                              this.maBaoCao = data.data;
                         } else {
                              this.errorMessage = "Có lỗi trong quá trình sinh mã báo cáo vấn tin!";
                         }
                    },
                    (err) => {
                         this.errorMessage = err.error.message;
                    }
               );
               this.maBaoCao = '';
               this.namBaoCaoHienHanh = new Date().getFullYear();
          }

          const utils = new Utils();
          this.statusBtnDuyet = utils.getRoleTBP('2', 2, userInfo?.roles[0]?.id);
          this.statusBtnPheDuyet = utils.getRoleLD('4', 2, userInfo?.roles[0]?.id);
          this.statusBtnTuChoi = (this.statusBtnDuyet && this.statusBtnPheDuyet);
          this.statusBtnTaoMoi = !(this.statusBtnTuChoi);

          this.danhMucService.dMNoiDung().toPromise().then(
               (data) => {
                    if (data.statusCode == 0) {
                         this.noiDungs = data.data?.content;
                         //console.log(this.noiDungs);
                    } else {
                         this.errorMessage = "Có lỗi trong quá trình vấn tin!";
                    }
               },
               (err) => {
                    console.log(err);
                    this.errorMessage = err.error.message;
               }
          );
          this.danhMucService.dMNhomChi().toPromise().then(
               (data) => {
                    if (data.statusCode == 0) {
                         this.nhomChis = data.data?.content;
                    } else {
                         this.errorMessage = "Có lỗi trong quá trình vấn tin!";
                    }
               },
               (err) => {
                    console.log(err);
                    this.errorMessage = err.error.message;
               }
          );
          this.danhMucService.dMKhoanChi().toPromise().then(
               (data) => {
                    if (data.statusCode == 0) {
                         this.khoanChis = data.data?.content;
                         //console.log(this.khoanChis);
                    } else {
                         this.errorMessage = "Có lỗi trong quá trình vấn tin!";
                    }
               },
               (err) => {
                    console.log(err);
                    this.errorMessage = err.error.message;
               }
          );

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
          //      idFileDinhKem: listFile,
          //      lstCTietBCao: this.lstCTietBCao,
          //      maBcao: this.maBaoCao,
          //      maDvi: this.maDonViTao = "01",
          //      maDviTien: this.maDviTien = "01",
          //      maLoaiBcao: this.maLoaiBaoCao = "01",
          //      namBcao: this.namBaoCaoHienHanh,
          //      namHienHanh: this.namBaoCaoHienHanh,
          // };
          // this.spinner.show();
          // if (this.id == null) {
          //      this.quanLyVonPhiService.trinhDuyetService(request).subscribe(
          //           (data) => {
          //                alert("trinh duyet thanh cong!");
          //                console.log(data);
          //           },
          //           (err) => {
          //                alert("trinh duyet that bai!");
          //                console.log();
          //           })
          // } else {
          //      this.quanLyVonPhiService.updatelist(request).subscribe(res => {
          //           if (res.statusCode == 0) {
          //                alert('trinh duyet thanh cong!');
          //           } else {
          //                alert('đã có lỗi xảy ra, vui lòng thử lại sau!');
          //           }
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

     //thay doi trang thai
     changeStatus(status: boolean) {
          this.status = status;
     }

     // call chi tiet bao cao
     getDetailReport() {
          this.spinner.show();

          let request = {
               maDvi: 235,
               namHienHanh: this.namBaoCaoHienHanh,
               ngayTaoTu: "",
               ngayTaoDen: "",
               paggingReq: {
                    limit: 1000,
                    page: 1,
               },
               trangThai: "",
          }


          this.quanLyVonPhiService.timkiem325(request).subscribe(
               (data) => {
                    if (data.statusCode == 0) {
                         this.chiTietBcaos = data.data.content;
                         this.chiTietBcaos.forEach(item => {
                              item.listCtiet.forEach(data => {
                                   this.lstCTietBCao.push(data);
                              })
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
          this.spinner.hide();
     }

     //upload file
     async uploadFile(file: File) {
          // day file len server
          const upfile: FormData = new FormData();
          upfile.append('file', file);
          upfile.append('folder', this.maBaoCao + '/' + this.maDonViTao + '/');
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
                    console.log('false :', err);
               },
          );
          return temp;
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

     // lay ten don vi tao
     getUnitName() {
          return this.donVis.find(item => item.maDvi == this.maDonViTao)?.tenDvi;
     }

}
