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
import { KHOANMUCLIST } from './lap-bao-cao-dieu-chinh-du-toan-chi-nsnn.constant'
import { NzModalService } from 'ng-zorro-antd/modal';
import { DialogChonThemKhoanMucComponent } from 'src/app/components/dialog/dialog-chon-them-khoan-muc/dialog-chon-them-khoan-muc.component';

export class ItemData {
     id: any;
     stt!: string;
     maNdung: string;
     uocThien!: number;
     dtoanGiao: number;
     dcTang!: number;
     dcGiam!: number;
     ghiChu!: string;
     checked!: boolean;
}

@Component({
     selector: 'app-lap-bao-cao-dieu-chinh-du-toan-chi-nsnn',
     templateUrl: './lap-bao-cao-dieu-chinh-du-toan-chi-nsnn.component.html',
     styleUrls: ['./lap-bao-cao-dieu-chinh-du-toan-chi-nsnn.component.scss'],
})

export class LapBaoCaoDieuChinhDuToanChiNsnnComponent implements OnInit {
     donVis: any = [];                            //don vi se hien thi
     chiCucs: any = [];                           //danh muc don vi cap chi cuc
     cucKhuVucs: any = [];                        //danh muc don vi cap cuc khu vuc
     tongCucs: any = [];                           //danh muc don vi cap tong cuc
     dviTiens: any = [];
     dviTien: any;

     khoanMucs: any = KHOANMUCLIST;

     maDvi: string;
     status: boolean;
     tenDvi: string;
     tongCong: ItemData = {
          id: "",
          stt: "",
          maNdung: "",
          uocThien: 0,
          dtoanGiao: 0,
          dcTang: 0,
          dcGiam: 0,
          ghiChu: "",
          checked: true,
     };

     maNganSach: string;
     maSoKbnn: string;

     noiDung: string;
     lstCTietBCao: ItemData[] = [];              // list chi tiet bao cao
     userInfo: any;
     errorMessage!: String;                      //
     id!: any;                                   // id truyen tu router
     chiTietBcaos: any;                          // thong tin chi tiet bao cao
     lstFile: any = [];                            // trang thai an/ hien cua trang thai
     namBcao = new Date().getFullYear();         // nam bao cao
     userName: any;                              // ten nguoi dang nhap
     maDonViTao!: any;                           // ma don vi tao
     trangThaiBanGhi!: any;

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
          private notification: NzNotificationService,
          private danhMucService: DanhMucHDVService,
          private modal: NzModalService,
     ) {

     }


     async ngOnInit() {
          this.id = this.routerActive.snapshot.paramMap.get('id');
          let userName = this.userSerivce.getUserName();
          let userInfo: any = await this.getUserInfo(userName); //get user info
          console.log(userInfo);
          if (this.id) {
               this.getDetailReport();
          } else {
               this.maDonViTao = userInfo?.dvql;
          }

          const utils = new Utils();
          this.statusBtnDuyet = utils.getRoleTBP('2', 2, userInfo?.roles[0]?.id);
          this.statusBtnPheDuyet = utils.getRoleLD('4', 2, userInfo?.roles[0]?.id);
          this.statusBtnTuChoi = (this.statusBtnDuyet && this.statusBtnPheDuyet);
          this.statusBtnTaoMoi = !(this.statusBtnTuChoi);

          //lay danh sach danh muc don vi
          await this.danhMucService.dMDonVi().toPromise().then(
               (data) => {
                    if (data.statusCode == 0) {
                         this.donVis = data.data;
                         console.log(this.donVis);
                    } else {
                         this.notification.error(MESSAGE.ERROR, data?.msg);
                    }
               },
               (err) => {
                    this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
               }
          );
          await this.danhMucService.dMDonViTien().toPromise().then(
               (data) => {
                    if (data.statusCode == 0) {
                         this.dviTiens = data.data?.content;
                    } else {
                         this.notification.error(MESSAGE.ERROR, data?.msg);
                    }
               },
               (err) => {
                    this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
               }
          );

          await this.donVis.forEach(item => {
               if ((item.maDvi).length == 4) {
                    this.cucKhuVucs.push(item);
               } else {
                    if ((item.maDvi).length == 6) {
                         this.chiCucs.push(item);
                    } else {
                         this.tongCucs.push(item);
                    }
               }
          })

          this.maDvi = userInfo?.dvql;
          if (this.chiCucs.findIndex(item => item.maDvi == this.maDvi) != -1) {
               this.donVis = this.chiCucs;
               this.status = false;
          } else {
               this.status = true;
               if (this.cucKhuVucs.findIndex(item => item.maDvi == this.maDvi) != -1) {
                    this.donVis = this.cucKhuVucs;
               } else {
                    this.donVis = this.tongCucs;
               }
          }

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
               listCtiet: this.lstCTietBCao,
               maDvi: this.maDvi,
               tenDvi: this.tenDvi,
               noiDung: this.noiDung,
               trangThai: "01",
               tenTrangThai: this.getStatusName("01"),
               maNganSach: "1",
               maSoKbnn: "1",
               maPbo: "1",
               namPbo: this.namBcao,
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
                         this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
                    }
               )
          }

          this.lstCTietBCao.filter(item => {
               if (!item.id) {
                    item.id = uuid.v4();
               }
          });
          this.updateEditCache();
          this.spinner.hide();
     }

     addKmuc() {
          KHOANMUCLIST.forEach(item => item.status = false);
          var danhSach = KHOANMUCLIST.filter(item => this.lstCTietBCao?.findIndex(data => data.maNdung == item.maKmuc) == -1);

          const modalIn = this.modal.create({
               nzTitle: 'Danh sách khoản mục',
               nzContent: DialogChonThemKhoanMucComponent,
               nzMaskClosable: false,
               nzClosable: false,
               nzWidth: '600px',
               nzFooter: null,
               nzComponentParams: {
                    danhSachKhoanMuc: danhSach
               },
          });
          modalIn.afterClose.subscribe((res) => {
               if (res) {
                    res.forEach(item => {
                         if (item.status) {
                              this.lstCTietBCao.push({
                                   id: uuid.v4(),
                                   stt: "",
                                   maNdung: item.maKmuc,
                                   uocThien: 0,
                                   dtoanGiao: 0,
                                   dcTang: 0,
                                   dcGiam: 0,
                                   ghiChu: "",
                                   checked: false,
                              });
                         }
                    })
                    this.updateEditCache();
               }
          });
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
          this.spinner.hide();
          this.quanLyVonPhiService.chitiet325(this.id).subscribe(
               (data) => {
                    if (data.statusCode == 0) {
                         this.chiTietBcaos = data.data;
                         this.lstCTietBCao = this.chiTietBcaos.listCtiet;
                         this.lstCTietBCao.forEach(item => {
                              this.tongCong.uocThien += item.uocThien;
                              this.tongCong.dtoanGiao += item.dtoanGiao;
                              this.tongCong.dcTang += item.dcTang;
                              this.tongCong.dcGiam += item.dcGiam;
                         })
                         this.updateEditCache();
                         this.lstFile = data.data.lstFile;
                         this.noiDung = this.chiTietBcaos.noiDung;
                         this.trangThaiBanGhi = data.data.trangThai;
                         this.maNganSach = data.data.maNganSach;
                         this.maSoKbnn = data.data.maSoKbnn;
                         this.trangThaiBanGhi = data.data.trangThai;
                         // set list id file ban dau
                         this.lstFile.filter(item => {
                              this.listIdFiles += item.id + ",";
                         })
                    } else {
                         this.notification.error(MESSAGE.ERROR, data?.msg);
                    }
               },
               (err) => {
                    this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
               }
          );
          this.spinner.show();
     }

     //upload file
     async uploadFile(file: File) {
          // day file len server
          const upfile: FormData = new FormData();
          upfile.append('file', file);
          upfile.append('folder', this.maDonViTao + '/' + this.maDonViTao + '/');
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

     // lay ten don vi tao
     getUnitName() {
          return this.donVis.find(item => item.maDvi == this.maDvi)?.tenDvi;
     }

     // lay ten trang thai
     getStatusName(trangThaiBanGhi: string) {
          const utils = new Utils();
          return utils.getStatusName(trangThaiBanGhi);
     }
     // start edit
     startEdit(id: string): void {
          this.editCache[id].edit = true;
     }

     // huy thay doi
     cancelEdit(id: string): void {
          const index = this.lstCTietBCao.findIndex(item => item.id === id);  // lay vi tri hang minh sua
          this.tongCong.uocThien += this.lstCTietBCao[index].uocThien - this.editCache[id].data.uocThien;
          this.tongCong.dtoanGiao += this.lstCTietBCao[index].dtoanGiao - this.editCache[id].data.dtoanGiao;
          this.tongCong.dcTang += this.lstCTietBCao[index].dcTang - this.editCache[id].data.dcTang;
          this.tongCong.dcGiam += this.lstCTietBCao[index].dcGiam - this.editCache[id].data.dcGiam;
          this.editCache[id] = {
               data: { ...this.lstCTietBCao[index] },
               edit: false
          };
     }

     // luu thay doi
     saveEdit(id: string): void {
          this.editCache[id].data.checked = this.lstCTietBCao.find(item => item.id === id).checked; // set checked editCache = checked lstCTietBCao
          const index = this.lstCTietBCao.findIndex(item => item.id === id);   // lay vi tri hang minh sua
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

     changeUocThien(id: string) {
          let index = this.lstCTietBCao.findIndex(item => item.id == id);
          this.tongCong.uocThien += this.editCache[id].data.uocThien - this.lstCTietBCao[index].uocThien;
     }
     changeDtoanGiao(id: string) {
          let index = this.lstCTietBCao.findIndex(item => item.id == id);
          this.tongCong.dtoanGiao += this.editCache[id].data.dtoanGiao - this.lstCTietBCao[index].dtoanGiao;
     }
     changeDcTang(id: string) {
          let index = this.lstCTietBCao.findIndex(item => item.id == id);
          this.tongCong.dcTang += this.editCache[id].data.dcTang - this.lstCTietBCao[index].dcTang;
     }
     changeDcGiam(id: string) {
          let index = this.lstCTietBCao.findIndex(item => item.id == id);
          this.tongCong.dcGiam += this.editCache[id].data.dcGiam - this.lstCTietBCao[index].dcGiam;
     }

}
