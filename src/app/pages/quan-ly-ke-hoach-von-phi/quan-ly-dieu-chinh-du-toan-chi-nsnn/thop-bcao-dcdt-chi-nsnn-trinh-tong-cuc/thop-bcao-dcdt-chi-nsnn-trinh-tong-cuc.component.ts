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
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MESSAGE } from '../../../../constants/message';


@Component({
     selector: 'app-thop-bcao-dcdt-chi-nsnn-trinh-tong-cuc',
     templateUrl: './thop-bcao-dcdt-chi-nsnn-trinh-tong-cuc.component.html',
     styleUrls: ['./thop-bcao-dcdt-chi-nsnn-trinh-tong-cuc.component.scss'],
})

export class ThopBcaoDcdtChiNsnnTrinhTongCucComponent implements OnInit {
     lstCTietBCao: any = [];              // list chi tiet bao cao
     noiDungs: any = [];
     nhomChis: any = [];
     khoanChis: any = [];
     phanBos: any = [];
     donVis: any = [];
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
     noiNhan!: string;
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
          private notification: NzNotificationService,
          private danhMucService: DanhMucHDVService,
     ) {
          this.ngayNhap = this.datePipe.transform(this.newDate, 'dd-MM-yyyy',)
     }


     async ngOnInit() {
          this.id = this.routerActive.snapshot.paramMap.get('id');
          let userName = this.userSerivce.getUserName();
          let userInfo: any = await this.getUserInfo(userName); //get user info
          this.trangThaiBanGhi = "1";
          this.nguoiNhap = userInfo?.username;
          this.maDonViTao = userInfo?.dvql;

          this.namBaoCaoHienHanh = new Date().getFullYear();

          const utils = new Utils();
          this.statusBtnDuyet = utils.getRoleTBP('2', 2, userInfo?.roles[0]?.id);
          this.statusBtnPheDuyet = utils.getRoleLD('4', 2, userInfo?.roles[0]?.id);
          this.statusBtnTuChoi = (this.statusBtnDuyet && this.statusBtnPheDuyet);
          this.statusBtnTaoMoi = !(this.statusBtnTuChoi);

          this.danhMucService.dMNoiDung().toPromise().then(
               (data) => {
                    if (data.statusCode == 0) {
                         this.noiDungs = data.data?.content;
                    } else {
                         this.notification.error(MESSAGE.ERROR, data?.msg);
                    }
               },
               (err) => {
                    this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
               }
          );
          this.danhMucService.dMNhomChi().toPromise().then(
               (data) => {
                    if (data.statusCode == 0) {
                         this.nhomChis = data.data?.content;
                    } else {
                         this.notification.error(MESSAGE.ERROR, data?.msg);
                    }
               },
               (err) => {
                    this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
               }
          );
          this.danhMucService.dMKhoanChi().toPromise().then(
               (data) => {
                    if (data.statusCode == 0) {
                         this.khoanChis = data.data?.content;
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
                         this.donVis = data.data;
                         console.log(this.donVis);
                         this.donVis = this.donVis.filter(item => item.parent != null);
                         this.donVis = this.donVis.filter(item => item.parent.maDvi == '0802')
                         console.log(this.donVis);
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
          let listFile: any = [];
          for (const iterator of this.listFile) {
               listFile.push(await this.uploadFile(iterator));
          }

          // replace nhung ban ghi dc them moi id thanh null
          this.lstCTietBCao.filter(item => {
               if (typeof item.id != "number") {
                    item.id = null;
               }
          })
          // gui du lieu trinh duyet len server
          let request = {
               id: this.id,
               listIdFile: listFile,
               chiNsnnCtietReqs: this.lstCTietBCao,
               maDvi: this.maDonViTao = "01",
               ngayqd: this.datePipe.transform(this.ngayQd, 'dd/MM/yyyy',),
               phanBo: this.phanBo = "01",
               soQd: this.soQd,
               trangThai: this.trangThaiBanGhi = "01",
               namHienHanh: this.namBaoCaoHienHanh,
          };
          this.spinner.show();
          if (this.id == null) {
               this.quanLyVonPhiService.themmoi325(request).subscribe(
                    res => {
                         if (res.statusCode == 0) {
                              this.notification.success(MESSAGE.SUCCESS, MESSAGE.SUCCESS);
                         } else {
                              this.notification.error(MESSAGE.ERROR, res?.msg);
                         }
                    },
                    err => {
                         this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
                    }
               )

          } else {
               this.quanLyVonPhiService.update325(request).subscribe(
                    res => {
                         if (res.statusCode == 0) {
                              this.notification.success(MESSAGE.SUCCESS, MESSAGE.SUCCESS);
                         } else {
                              this.notification.error(MESSAGE.ERROR, res?.msg);
                         }
                    },
                    err => {
                         this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
                    }
               )
          }

          this.lstCTietBCao.filter(item => {
               if (!item.id) {
                    item.id = uuid.v4();
               }
          });
          this.spinner.hide();
     }


     // chuc nang check role
     onSubmit(mcn: String) {
          const requestGroupButtons = {
               id: this.id,
               maChucNang: mcn,
               type: "",
          };
          this.spinner.show();
          this.quanLyVonPhiService.approve(requestGroupButtons).subscribe(
               (data) => {
                    if (data.statusCode == 0) {
                         this.getDetailReport();
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
                         this.notification.error(MESSAGE.ERROR, data?.msg);
                    }
               },
               (err) => {
                    this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
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
                    this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
               },
          );
          return temp;
     }

     
     // xoa dong
     deleteById(id: any): void {
          this.lstCTietBCao = this.lstCTietBCao.filter(item => item.id != id)
          if (typeof id == "number") {
               this.listIdDelete += id + ",";
          }
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

     // lay ten don vi tao
     getUnitName() {
          return this.donVis.find(item => item.maDvi == this.maDonViTao)?.tenDvi;
     }

}
