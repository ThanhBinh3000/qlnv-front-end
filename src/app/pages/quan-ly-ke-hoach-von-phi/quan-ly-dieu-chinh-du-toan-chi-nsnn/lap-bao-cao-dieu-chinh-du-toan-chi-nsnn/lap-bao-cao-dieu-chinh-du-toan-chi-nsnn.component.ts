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
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';

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
     capDvi: string;
     tenTrangThai!: string;

     newDate = new Date();                       //
     fileToUpload!: File;                        // file tai o input
     listFile: File[] = [];                      // list file chua ten va id de hien tai o input
     box1 = true;                                // bien de an hien box1
     fileUrl: any;                               // url
     listIdDelete: string = "";                  // list id delete

     statusBtnDel: boolean;                       // trang thai an/hien nut xoa
     statusBtnSave: boolean;                      // trang thai an/hien nut luu
     statusBtnApprove: boolean;                   // trang thai an/hien nut trinh duyet
     statusBtnTBP: boolean;                       // trang thai an/hien nut truong bo phan
     statusBtnLD: boolean;                        // trang thai an/hien nut lanh dao
     statusBtnGuiDVCT: boolean;                   // trang thai nut gui don vi cap tren
     statusBtnDVCT: boolean;                      // trang thai nut don vi cap tren
     statusAdd: boolean = false;                          // trang thai nut them moi
     statusEdit: boolean;                         // trang thai nut chinh sua


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
               await this.getDetailReport();
               if ((this.trangThaiBanGhi == '2')||(this.trangThaiBanGhi == '4') || (this.trangThaiBanGhi == '6')){
                    this.statusEdit = false;
               } else {this.statusEdit = true;}
          } else {
               this.maDonViTao = userInfo?.dvql;
               this.trangThaiBanGhi = '1';
               this.statusEdit = false;
          }

          const utils = new Utils();
          this.statusBtnDel = utils.getRoleDel(this.trangThaiBanGhi, 2, userInfo?.roles[0]?.id);
          this.statusBtnSave = utils.getRoleSave(this.trangThaiBanGhi, 2, userInfo?.roles[0]?.id);
          this.statusBtnApprove = utils.getRoleApprove(this.trangThaiBanGhi, 2, userInfo?.roles[0]?.id);
          this.statusBtnTBP = utils.getRoleTBP(this.trangThaiBanGhi, 2, userInfo?.roles[0]?.id);
          this.statusBtnLD = utils.getRoleLD(this.trangThaiBanGhi, 2, userInfo?.roles[0]?.id);
          this.statusBtnGuiDVCT = utils.getRoleGuiDVCT(this.trangThaiBanGhi, 2, userInfo?.roles[0]?.id);
          this.statusBtnDVCT = utils.getRoleDVCT(this.trangThaiBanGhi, 2, userInfo?.roles[0]?.id);

          //lay danh sach danh muc don vi
          this.maDvi = userInfo?.dvql;

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

          if (this.capDvi == '3'){
               this.status = false;
          } else {
               this.status = true;
          }
          this.tenDvi = this.getUnitName();
          this.tenTrangThai = this.getStatusName(this.trangThaiBanGhi);
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
               trangThai: this.trangThaiBanGhi,
               tenTrangThai: this.getStatusName(this.trangThaiBanGhi),
               maNganSach: this.maNganSach,
               maSoKbnn: this.maSoKbnn,
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
                    this.statusAdd = true;
               }
          });
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
     async getDetailReport() {
          this.spinner.hide();
          await this.quanLyVonPhiService.chitiet325(this.id).subscribe(
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
          this.tinhTong(-1, this.lstCTietBCao[index]);
          this.tinhTong(1, this.editCache[id].data);
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

     changeModel(id: string) {
          if (this.editCache[id].data.uocThien < this.editCache[id].data.dtoanGiao){
               this.editCache[id].data.dcTang = this.editCache[id].data.dtoanGiao - this.editCache[id].data.uocThien;
               this.editCache[id].data.dcGiam = 0;
          } else {
               this.editCache[id].data.dcGiam = this.editCache[id].data.uocThien - this.editCache[id].data.dtoanGiao;
               this.editCache[id].data.dcTang = 0;
          }

     }

     tinhTong(heSo: number, item: ItemData){
          this.tongCong.uocThien += heSo*item.uocThien;
          this.tongCong.dtoanGiao += heSo*item.dtoanGiao;
          this.tongCong.dcTang += heSo*item.dcTang;
          this.tongCong.dcGiam += heSo*item.dcGiam;
     }
}
