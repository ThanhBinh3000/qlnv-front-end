import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as uuid from "uuid";
import { DanhMucHDVService } from '../../../../../services/danhMucHDV.service';
import { DatePipe, Location } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { DomSanitizer } from '@angular/platform-browser';
import * as fileSaver from 'file-saver';
import { divMoney, DONVITIEN, mulMoney, QLNV_KHVONPHI_KHOACH_CTAO_SCHUA_GD3N, Utils } from "../../../../../Utility/utils";
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MESSAGE } from '../../../../../constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';

export class ItemData {
     id!: any;
     maBcao!: String;
     stt!: Number;
     tenCtrinh!: String;
     maNguonVon!: String;
     maLoaiCt!: String;
     tgianKc!: Number;
     tgianHt!: Number;
     maCquanQd!: Number;
     tongGtri!: Number;
     dtoanKphi3006n!: Number;
     uocThienN!: Number;
     daTtoan3006n!: Number;
     uocTtoanN!: Number;
     tsoN1!: Number;
     ttoanN1!: Number;
     phatSinhN1!: Number;
     tsoN2!: Number;
     ttoanN2!: Number;
     phatSinhN2!: Number;
     tsoN3!: Number;
     ttoanN3!: Number;
     phatSinhN3!: Number;
     checked!: boolean;
}

@Component({
     selector: 'app-ke-hoach-cai-tao-va-sua-chua-lon-3-nam',
     templateUrl: './ke-hoach-cai-tao-va-sua-chua-lon-3-nam.component.html',
     styleUrls: ['./ke-hoach-cai-tao-va-sua-chua-lon-3-nam.component.scss'],
})

export class KeHoachCaiTaoVaSuaChuaLon3NamComponent implements OnInit {
     listMaDonvi!: any;
     userInfo: any;
     errorMessage!: String;
     maNguonVons!: any;
     maLoaiCts: any = [];
     maCquanQds: any = [];
     donVis: any = [];
     donViTiens: any = DONVITIEN;                        // danh muc don vi tien
     listBaoCao: ItemData[] = [];
     lstCTietBCao: ItemData[] = [];
     id!: any;
     chiTietBcaos: any;
     lstFile: any = [];
     status: boolean = false;
     namBcao = new Date().getFullYear()
     userData!: any;
     role!: any;
     unit!: any;
     userName: any;
     ngayNhap!: any;
     nguoiNhap!: string;
     maDonViTao!: any;
     maBaoCao!: string;
     namBaoCaoHienHanh!: any;
     trangThaiBanGhi: string = "1";
     maLoaiBaoCao: string = QLNV_KHVONPHI_KHOACH_CTAO_SCHUA_GD3N;
     maDviTien: string;
     newDate = new Date();
     fileToUpload!: File;                        // file tai o input
     listFile: File[] = [];                      // list file chua ten va id de hien tai o input
     box1 = true;                                // bien de an hien box1
     fileUrl: any;                               // url
     listIdDelete: string = "";                  // list id delete

     capDvi: any;
     checkKV: boolean;                            // check khu vuc
     soVban: any;
     capDv: any;
     checkDv: boolean;
     currentday: Date = new Date();

     statusBtnDel: boolean;                       // trang thai an/hien nut xoa
     statusBtnSave: boolean;                      // trang thai an/hien nut luu
     statusBtnApprove: boolean;                   // trang thai an/hien nut trinh duyet
     statusBtnTBP: boolean;                       // trang thai an/hien nut truong bo phan
     statusBtnLD: boolean;                        // trang thai an/hien nut lanh dao
     statusBtnGuiDVCT: boolean;                   // trang thai nut gui don vi cap tren
     statusBtnDVCT: boolean;                      // trang thai nut don vi cap tren
     statusBtnLDDC: boolean;
     statusBtnCopy: boolean;                      // trang thai copy
     statusBtnPrint: boolean;                     // trang thai print

     listIdDeleteFiles: string = "";                        // id file luc call chi tiet


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
          private userService: UserService,
          private notification: NzNotificationService,
          private danhMucService: DanhMucHDVService,
          private location: Location,
     ) {
          this.ngayNhap = this.datePipe.transform(this.newDate, Utils.FORMAT_DATE_STR,)
     }


     async ngOnInit() {
          //check param dieu huong router
          this.id = this.routerActive.snapshot.paramMap.get('id');
          this.maDonViTao = this.routerActive.snapshot.paramMap.get('maDvi');
          this.maLoaiBaoCao = this.routerActive.snapshot.paramMap.get('maLoaiBacao');
          this.namBaoCaoHienHanh = this.routerActive.snapshot.paramMap.get('nam');
          let userName = this.userService.getUserName();
          await this.getUserInfo(userName);
          if (this.id) {
               await this.getDetailReport();
          } else if (
               this.maDonViTao != null &&
               this.maLoaiBaoCao != null &&
               this.namBaoCaoHienHanh != null
          ) {
               await this.calltonghop();
               this.nguoiNhap = this.userInfo?.username;
               this.ngayNhap = this.datePipe.transform(this.currentday, Utils.FORMAT_DATE_STR);
               this.maDonViTao = this.userInfo?.dvql;
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
          } else {
               this.trangThaiBanGhi = "1";
               this.nguoiNhap = this.userInfo?.username;
               this.maDonViTao = this.userInfo?.dvql;
               this.spinner.show();
               this.quanLyVonPhiService.sinhMaBaoCao().subscribe(
                    (data) => {
                         if (data.statusCode == 0) {
                              this.maBaoCao = data.data;
                         } else {
                              this.notification.error(MESSAGE.ERROR, data?.msg);
                         }
                    },
                    (err) => {
                         this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
                    }
               );
               this.maBaoCao = '';
               this.namBaoCaoHienHanh = new Date().getFullYear();
          }

          this.danhMucService.dMNguonVon().toPromise().then(
               (data) => {
                    if (data.statusCode == 0) {
                         this.maNguonVons = data.data?.content;
                    } else {
                         this.notification.error(MESSAGE.ERROR, data?.msg);
                    }
               },
               (err) => {
                    this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
               }
          );
          this.danhMucService.dMLoaiCongTrinh().toPromise().then(
               (data) => {
                    if (data.statusCode == 0) {
                         this.maLoaiCts = data.data?.content;
                    } else {
                         this.notification.error(MESSAGE.ERROR, data?.msg);
                    }
               },
               (err) => {
                    this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
               }
          );
          this.danhMucService.dMucCoQuan().toPromise().then(
               (data) => {
                    if (data.statusCode == 0) {
                         this.maCquanQds = data.data?.content;
                    } else {
                         this.notification.error(MESSAGE.ERROR, data?.msg);
                    }
               },
               (err) => {
                    this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
               }
          );

          //lay danh sach danh muc don vi
          await this.danhMucService.dMDonVi().toPromise().then(
               (data) => {
                    if (data.statusCode == 0) {
                         this.donVis = data.data;
                         this.donVis.forEach(e => {
                              if (e.maDvi == this.maDonViTao) {
                                   this.capDvi = e.capDvi;
                              }
                         })
                         var Dvi = this.donVis.find(e => e.maDvi == this.maDonViTao);
                         this.capDv = Dvi.capDvi;
                         if (this.capDv == '2') {
                              this.checkDv = false;
                         } else {
                              this.checkDv = true;
                         }
                    } else {
                         this.notification.error(MESSAGE.ERROR, data?.msg);
                    }
               },
               (err) => {
                    this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
               }
          );

          this.getStatusButton();

          this.spinner.hide();
     }

     getStatusButton() {
          let checkParent = false;
          let checkChirld = false;
          let dVi = this.donVis.find(e => e.maDvi == this.maDonViTao);
          if (dVi && dVi.maDvi == this.userInfo.dvql) {
               checkChirld = true;
          }
          if (dVi && dVi.parent?.maDvi == this.userInfo.dvql) {
               checkParent = true;
          }

          const utils = new Utils();
          this.statusBtnDel = utils.getRoleDel(this.trangThaiBanGhi, checkChirld, this.userInfo?.roles[0]?.id);
          this.statusBtnSave = utils.getRoleSave(this.trangThaiBanGhi, checkChirld, this.userInfo?.roles[0]?.id);
          this.statusBtnApprove = utils.getRoleApprove(this.trangThaiBanGhi, checkChirld, this.userInfo?.roles[0]?.id);
          this.statusBtnTBP = utils.getRoleTBP(this.trangThaiBanGhi, checkChirld, this.userInfo?.roles[0]?.id);
          this.statusBtnLD = utils.getRoleLD(this.trangThaiBanGhi, checkChirld, this.userInfo?.roles[0]?.id);
          this.statusBtnGuiDVCT = utils.getRoleGuiDVCT(this.trangThaiBanGhi, checkChirld, this.userInfo?.roles[0]?.id);
          this.statusBtnDVCT = utils.getRoleDVCT(this.trangThaiBanGhi, checkParent, this.userInfo?.roles[0]?.id);
          this.statusBtnLDDC = utils.getRoleLDDC(this.trangThaiBanGhi, checkChirld, this.userInfo?.roles[0]?.id);
          this.statusBtnCopy = utils.getRoleCopy(this.trangThaiBanGhi, checkChirld, this.userInfo?.roles[0]?.id);
          this.statusBtnPrint = utils.getRolePrint(this.trangThaiBanGhi, checkChirld, this.userInfo?.roles[0]?.id);
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
          let checkSaveEdit;
          if (!this.maDviTien || !this.namBaoCaoHienHanh) {
               this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTSAVE);
               return;
          }
          if (this.namBaoCaoHienHanh >= 3000 || this.namBaoCaoHienHanh < 1000) {
               this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.WRONG_FORMAT);
               return;
          }
          //check xem tat ca cac dong du lieu da luu chua?
          //chua luu thi bao loi, luu roi thi cho di
          this.lstCTietBCao.forEach(element => {
               element.tongGtri = mulMoney(element.tongGtri, this.maDviTien);
               element.dtoanKphi3006n = mulMoney(element.dtoanKphi3006n, this.maDviTien);
               element.uocThienN = mulMoney(element.uocThienN, this.maDviTien);
               element.daTtoan3006n = mulMoney(element.daTtoan3006n, this.maDviTien);
               element.uocTtoanN = mulMoney(element.uocTtoanN, this.maDviTien);
               element.ttoanN1 = mulMoney(element.ttoanN1, this.maDviTien);
               element.phatSinhN1 = mulMoney(element.phatSinhN1, this.maDviTien);
               element.tsoN1 = mulMoney(element.tsoN1, this.maDviTien);
               element.ttoanN2 = mulMoney(element.ttoanN2, this.maDviTien);
               element.phatSinhN2 = mulMoney(element.phatSinhN2, this.maDviTien);
               element.tsoN2 = mulMoney(element.tsoN2, this.maDviTien);
               element.ttoanN3 = mulMoney(element.ttoanN3, this.maDviTien);
               element.phatSinhN3 = mulMoney(element.phatSinhN3, this.maDviTien);
               element.tsoN3 = mulMoney(element.tsoN3, this.maDviTien);
               if (this.editCache[element.id].edit === true) {
                    checkSaveEdit = false
               }
          });
          if (checkSaveEdit == false) {
               this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTSAVE);
               return;
          }

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
               fileDinhKems: listFile,
               listIdDeleteFiles: this.listIdDeleteFiles,
               listIdDeletes: this.listIdDelete,                    // id file luc get chi tiet tra ra( de backend phuc vu xoa file)
               lstCTietBCao: this.lstCTietBCao,
               maBcao: this.maBaoCao,
               maDvi: this.maDonViTao,
               maDviTien: this.maDviTien,
               maLoaiBcao: QLNV_KHVONPHI_KHOACH_CTAO_SCHUA_GD3N,
               namHienHanh: this.namBaoCaoHienHanh,
               namBcao: this.namBaoCaoHienHanh + 1,
               soVban: this.soVban,
          };

          //call service them moi
          this.spinner.show();
          if (this.id == null) {
               this.quanLyVonPhiService.trinhDuyetService(request).toPromise().then(
                    async data => {
                         if (data.statusCode == 0) {
                              this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
                              this.id = data.data.id;
                              await this.getDetailReport();
                              this.getStatusButton();
                         } else {
                              this.notification.error(MESSAGE.ERROR, data?.msg);
                         }
                    },
                    err => {
                         this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
                    },
               );
          } else {
               this.quanLyVonPhiService.updatelist(request).toPromise().then(
                    async data => {
                         if (data.statusCode == 0) {
                              this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
                              await this.getDetailReport();
                              this.getStatusButton();
                         } else {
                              this.notification.error(MESSAGE.ERROR, data?.msg);
                         }
                    }, err => {
                         this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
                    })
          }
          this.lstCTietBCao.filter(item => {
               if (!item.id) {
                    item.id = uuid.v4();
               }
          });
          this.spinner.hide();
          this.updateEditCache()
     }


     // chuc nang check role
     async onSubmit(mcn: String) {
          if (this.id) {
               const requestGroupButtons = {
                    id: this.id,
                    maChucNang: mcn,
                    type: "",
               };
               this.spinner.show();
               this.quanLyVonPhiService.approve(requestGroupButtons).toPromise().then(async (data) => {
                    if (data.statusCode == 0) {
                         await this.getDetailReport();
                         this.getStatusButton();
                         this.notification.success(MESSAGE.SUCCESS, MESSAGE.APPROVE_SUCCESS);
                    } else {
                         this.notification.error(MESSAGE.ERROR, data?.msg);
                    }
               }, err => {
                    this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
               });
               this.spinner.hide();
          } else {
               this.notification.warning(MESSAGE.WARNING, MESSAGE.MESSAGE_DELETE_WARNING)
          }

     }

     //thay doi trang thai
     changeStatus(status: boolean) {
          this.status = status;
     }

     // call chi tiet bao cao
     async getDetailReport() {
          this.spinner.show();
          await this.quanLyVonPhiService.bCLapThamDinhDuToanChiTiet(this.id).toPromise().then(
               (data) => {
                    if (data.statusCode == 0) {
                         this.chiTietBcaos = data.data;
                         this.lstCTietBCao = data.data.lstCTietBCao;
                         this.maDviTien = data.data.maDviTien;
                         this.lstCTietBCao.forEach(element => {
                              element.tongGtri = divMoney(element.tongGtri, this.maDviTien);
                              element.dtoanKphi3006n = divMoney(element.dtoanKphi3006n, this.maDviTien);
                              element.uocThienN = divMoney(element.uocThienN, this.maDviTien);
                              element.daTtoan3006n = divMoney(element.daTtoan3006n, this.maDviTien);
                              element.uocTtoanN = divMoney(element.uocTtoanN, this.maDviTien);
                              element.ttoanN1 = divMoney(element.ttoanN1, this.maDviTien);
                              element.phatSinhN1 = divMoney(element.phatSinhN1, this.maDviTien);
                              element.tsoN1 = divMoney(element.tsoN1, this.maDviTien);
                              element.ttoanN2 = divMoney(element.ttoanN2, this.maDviTien);
                              element.phatSinhN2 = divMoney(element.phatSinhN2, this.maDviTien);
                              element.tsoN2 = divMoney(element.tsoN2, this.maDviTien);
                              element.ttoanN3 = divMoney(element.ttoanN3, this.maDviTien);
                              element.phatSinhN3 = divMoney(element.phatSinhN3, this.maDviTien);
                              element.tsoN3 = divMoney(element.tsoN3, this.maDviTien);
                         });
                         this.updateEditCache();
                         this.lstFile = data.data.lstFile;
                         this.listFile = [];

                         // set thong tin chung bao cao
                         this.ngayNhap = this.datePipe.transform(data.data.ngayTao, Utils.FORMAT_DATE_STR);
                         this.nguoiNhap = data.data.nguoiTao;
                         this.maDonViTao = data.data.maDvi;
                         this.maBaoCao = data.data.maBcao;
                         this.namBaoCaoHienHanh = data.data.namHienHanh;
                         this.trangThaiBanGhi = data.data.trangThai;
                         this.soVban = data.data.soVban;
                         if (
                              this.trangThaiBanGhi == Utils.TT_BC_1 ||
                              this.trangThaiBanGhi == Utils.TT_BC_3 ||
                              this.trangThaiBanGhi == Utils.TT_BC_5 ||
                              this.trangThaiBanGhi == Utils.TT_BC_8
                         ) {
                              this.status = false;
                         } else {
                              this.status = true;
                         }

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
          upfile.append('folder', this.maBaoCao + '/' + this.maDonViTao);
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

     // them dong moi
     addLine(id: number): void {
          let item: ItemData = {
               tenCtrinh: "",
               maNguonVon: "",
               maLoaiCt: "",
               tgianKc: this.namBaoCaoHienHanh,
               tgianHt: this.namBaoCaoHienHanh,
               maCquanQd: 0,
               tongGtri: 0,
               dtoanKphi3006n: 0,
               uocThienN: 0,
               daTtoan3006n: 0,
               uocTtoanN: 0,
               tsoN1: 0,
               ttoanN1: 0,
               phatSinhN1: 0,
               tsoN2: 0,
               ttoanN2: 0,
               phatSinhN2: 0,
               tsoN3: 0,
               ttoanN3: 0,
               phatSinhN3: 0,
               // maDviTien:"",
               maBcao: "",
               stt: 0,
               id: uuid.v4(),
               checked: false,
          }

          this.lstCTietBCao.splice(id, 0, item);
          this.editCache[item.id] = {
               edit: true,
               data: { ...item }
          };
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
          this.allChecked = false;
     }

     // xoa file trong bang file
     deleteFile(id: string): void {
          this.lstFile = this.lstFile.filter((a: any) => a.id !== id);
          this.listFile = this.listFile.filter((a: any) => a?.lastModified.toString() !== id);
          // set list for delete
          this.listIdDeleteFiles += id + ",";
     }

     //download file về máy tính
     async downloadFile(id: string) {
          let file!: File;
          file = this.listFile.find(element => element?.lastModified.toString() == id);
          if (!file) {
               let fileAttach = this.lstFile.find(element => element?.id == id);
               if (fileAttach) {
                    await this.quanLyVonPhiService.downloadFile(fileAttach.fileUrl).toPromise().then(
                         (data) => {
                              fileSaver.saveAs(data, fileAttach.fileName);
                         },
                         err => {
                              this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
                         },
                    );
               }
          } else {
               const blob = new Blob([file], { type: "application/octet-stream" });
               fileSaver.saveAs(blob, file.name);
          }
     }

     // click o checkbox all
     updateAllChecked(): void {
          this.indeterminate = false;                               // thuoc tinh su kien o checkbox all
          if (this.allChecked) {                                    // checkboxall == true thi set lai lstCTietBCao.checked = true
               this.lstCTietBCao = this.lstCTietBCao.map(item => ({
                    ...item,
                    checked: true
               }));
          } else {
               this.lstCTietBCao = this.lstCTietBCao.map(item => ({    // checkboxall == false thi set lai lstCTietBCao.checked = false
                    ...item,
                    checked: false
               }));
          }
     }

     // click o checkbox single
     updateSingleChecked(): void {
          if (this.lstCTietBCao.every(item => !item.checked)) {           // tat ca o checkbox deu = false thi set o checkbox all = false
               this.allChecked = false;
               this.indeterminate = false;
          } else if (this.lstCTietBCao.every(item => item.checked)) {     // tat ca o checkbox deu = true thi set o checkbox all = true
               this.allChecked = true;
               this.indeterminate = false;
          } else {                                                        // o checkbox vua = false, vua = true thi set o checkbox all = indeterminate
               this.indeterminate = true;
          }
     }

     redirectChiTieuKeHoachNam() {
          // this.router.navigate(['/qlkh-von-phi/quan-ly-lap-tham-dinh-du-toan-nsnn/tim-kiem']);
          this.location.back()
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
          if (!this.editCache[id].data.tenCtrinh ||
               !this.editCache[id].data.maNguonVon ||
               !this.editCache[id].data.maLoaiCt ||
               !this.editCache[id].data.tgianKc ||
               !this.editCache[id].data.tgianHt ||
               !this.editCache[id].data.maCquanQd ||
               (!this.editCache[id].data.tongGtri && this.editCache[id].data.tongGtri !== 0)) {
               this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
               return;
          }
          if ((this.editCache[id].data.tgianKc >= 3000 || this.editCache[id].data.tgianKc < 1000) ||
               (this.editCache[id].data.tgianHt >= 3000 || this.editCache[id].data.tgianHt < 1000)) {
               this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.WRONG_FORMAT);
               return;
          }
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

     //call tong hop
     async calltonghop() {
          this.spinner.show();
          this.maDviTien = "1";
          let objtonghop = {
               maDvi: this.maDonViTao,
               maLoaiBcao: this.maLoaiBaoCao,
               namHienTai: this.namBaoCaoHienHanh,
          }
          await this.quanLyVonPhiService.tongHop(objtonghop).toPromise().then(res => {
               if (res.statusCode == 0) {
                    this.lstCTietBCao = res.data;
                    this.lstCTietBCao.forEach(e => {
                         e.id = uuid.v4();
                    })
               } else {
                    this.notification.error(MESSAGE.ERROR, res?.msg);
               }
          }, err => {
               this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
          });
          this.updateEditCache()
          this.spinner.hide();
     }

     xoaBaoCao() {
          if (this.id) {
               this.quanLyVonPhiService.xoaBaoCao(this.id).toPromise().then(async res => {
                    if (res.statusCode == 0) {
                         this.notification.success(MESSAGE.SUCCESS, MESSAGE.DELETE_SUCCESS);
                         this.location.back();
                    } else {
                         this.notification.error(MESSAGE.ERROR, res?.msg);
                    }
               }, err => {
                    this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
               })
          } else {
               this.notification.warning(MESSAGE.WARNING, MESSAGE.MESSAGE_DELETE_WARNING)
          }
     }
     // action copy
     doCopy() {

     }

     // action print
     doPrint() {

     }
}
