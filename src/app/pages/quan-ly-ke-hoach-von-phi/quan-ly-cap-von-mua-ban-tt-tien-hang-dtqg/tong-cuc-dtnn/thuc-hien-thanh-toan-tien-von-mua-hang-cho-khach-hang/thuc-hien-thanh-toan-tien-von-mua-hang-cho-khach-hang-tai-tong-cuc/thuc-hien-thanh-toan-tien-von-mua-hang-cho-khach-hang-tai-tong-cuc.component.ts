import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as uuid from "uuid";
import { DanhMucHDVService } from '../../../../../../services/danhMucHDV.service';
import { DatePipe } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { DomSanitizer } from '@angular/platform-browser';
import * as fileSaver from 'file-saver';
import { Utils } from "../../../../../../Utility/utils";
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MESSAGE } from '../../../../../../constants/message';
import { utils } from 'xlsx';

export class ItemData {
     maVtu!: string;
     maChungLoai!: string;
     sl!: number;
     donGia!: number;
     maDviTinh: string;
     thanhTien!: number;
     ghiChu!: string;
     soTienThanhToan!: number;
     id!: any;
     stt!: String;
     checked!: boolean;
}

@Component({
     selector: 'app-thuc-hien-thanh-toan-tien-von-mua-hang-cho-khach-hang-tai-tong-cuc',
     templateUrl: './thuc-hien-thanh-toan-tien-von-mua-hang-cho-khach-hang-tai-tong-cuc.component.html',
     styleUrls: ['./thuc-hien-thanh-toan-tien-von-mua-hang-cho-khach-hang-tai-tong-cuc.component.scss'],
})

export class ThucHienThanhToanTienVonMuaHangChoKhachHangTaiTongCucComponent implements OnInit {
     donVis: any = [];
     vatTus: any = [];
     chungLoais: any = [];
     dviTinhs: any = [];
     soHds: any = [];
     ngayNhap!: string;
     nguoiNhap!: string;
     noiLap: string;
     noiNhan!: string;
     trangThaiBanGhi: string = "1";
     ccQd!: string;
     ngayQd!: string;
     soHd!: number;
     tenHd!: string;
     tenKH!: string;
     ngayKy!: string;
     gtriHd!: number;
     lyDoTuChoi!: string;
     tongTien: number = 0;

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

     allChecked = false;                         // check all checkbox
     indeterminate = true;                       // properties allCheckBox
     editCache: { [key: string]: { edit: boolean; data: ItemData } } = {};     // phuc vu nut chinh

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
          //      this.quanLyVonPhiService.updateLapThamDinh(request).subscribe(res => {
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
          upfile.append('folder', this.soHd + '/' + this.noiLap + '/');
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

     changeStatus(){
          this.status = !this.status;
     }

     // them dong moi
     addLine(id: number): void {
          let item: ItemData = {
               maVtu: "",
               maChungLoai: "",
               sl: 0,
               donGia: 0,
               maDviTinh: "",
               thanhTien: 0,
               ghiChu: "",
               soTienThanhToan: 0,
               stt: "",
               id: uuid.v4(),
               checked: false,
          }

          this.lstCTietBCao.splice(id, 0, item);
          this.editCache[item.id] = {
               edit: true,
               data: { ...item }
          };
     }


     // xóa với checkbox
     deleteSelected() {
          // add list delete id
          this.lstCTietBCao.filter(item => {
               if (item.checked) this.tongTien -= item.soTienThanhToan;
               if (item.checked == true && typeof item.id == "number") {
                    this.listIdDelete += item.id + ","
               }
          })
          // delete object have checked = true
          this.lstCTietBCao = this.lstCTietBCao.filter(item => item.checked != true)
          this.allChecked = false;
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


     // start edit
     startEdit(id: string): void {
          this.editCache[id].edit = true;
     }

     // huy thay doi
     cancelEdit(id: string): void {
          const index = this.lstCTietBCao.findIndex(item => item.id === id);  // lay vi tri hang minh sua
          this.editCache[id] = {
               data: { ...this.lstCTietBCao[index] },
               edit: false
          };
     }

     // luu thay doi
     saveEdit(id: string): void {
          this.editCache[id].data.checked = this.lstCTietBCao.find(item => item.id === id).checked; // set checked editCache = checked lstCTietBCao
          const index = this.lstCTietBCao.findIndex(item => item.id == id);   // lay vi tri hang minh sua
          this.tongTien += this.editCache[id].data.soTienThanhToan;
          this.tongTien -= this.lstCTietBCao[index].soTienThanhToan;
          Object.assign(this.lstCTietBCao[index], this.editCache[id].data); // set lai data cua lstCTietBCao[index] = this.editCache[id].data
          this.editCache[id].edit = false;  // CHUYEN VE DANG TEXT
     }

     // gan editCache.data == lstCTietBCao
     updateEditCache(): void {
          this.lstCTietBCao.forEach(item => {
               this.editCache[item.id] = {
                    edit: false,
                    data: { ...item }
               };
          });
     }

     changeModel(id: string): void {
          this.editCache[id].data.thanhTien = this.editCache[id].data.sl * this.editCache[id].data.donGia;
     }

}
