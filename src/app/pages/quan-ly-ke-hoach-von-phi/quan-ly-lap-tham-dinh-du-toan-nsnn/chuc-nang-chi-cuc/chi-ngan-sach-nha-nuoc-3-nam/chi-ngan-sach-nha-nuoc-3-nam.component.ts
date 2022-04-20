import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as uuid from "uuid";
import { DanhMucHDVService } from '../../../../../services/danhMucHDV.service';
import { DatePipe, Location } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { DomSanitizer } from '@angular/platform-browser';
import * as fileSaver from 'file-saver';
import { divMoney, DONVITIEN, mulMoney, QLNV_KHVONPHI_NCAU_CHI_NSNN_GD3N, Utils } from "../../../../../Utility/utils";
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MESSAGE } from '../../../../../constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';

export class ItemData {
     id: any;
     stt!: string;
     maNdung!: string;
     tenDan!: string;
     maLoaiChi!: string;
     maKhoanChi!: string;
     maMucChi!: string;
     maLoaiChiTx!: string;
     dtoanN!: number;
     uocThienN!: number;
     tranChiN1!: number;
     ncauChiN1!: number;
     clechTranChiVsNcauChiN1: number = this.tranChiN1 - this.tranChiN1;
     ssanhNcauNVoiN1: number = this.ncauChiN1 / this.uocThienN;
     tranChiN2!: number;
     ncauChiN2!: number;
     clechTranChiVsNcauChiN2: number = this.tranChiN2 - this.ncauChiN2;
     tranChiN3!: number;
     ncauChiN3!: number;
     clechTranChiVsNcauChiN3: number = this.tranChiN3 - this.ncauChiN3;
     checked!: boolean;
}

@Component({
     selector: 'app-chi-ngan-sach-nha-nuoc-3-nam',
     templateUrl: './chi-ngan-sach-nha-nuoc-3-nam.component.html',
     styleUrls: ['./chi-ngan-sach-nha-nuoc-3-nam.component.scss'],
})

export class ChiNganSachNhaNuoc3NamComponent implements OnInit {
     noiDungs: any = [];
     loaiChis: any = [];
     khoanChis: any = [];
     mucChis: any = [];
     donVis: any = [];
     maLoaiChiTxs: any = [];
     donViTiens: any = DONVITIEN;                        // danh muc don vi tien
     lstCTietBCao: ItemData[] = [];              // list chi tiet bao cao
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
     maLoaiBaoCao: string = QLNV_KHVONPHI_NCAU_CHI_NSNN_GD3N;                // nam bao cao
     maDviTien: string;                   // ma don vi tien
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
     statusBtnLDDC: boolean;

     listIdFiles: string;                        // id file luc call chi tiet


     allChecked = false;                         // check all checkbox
     indeterminate = true;                       // properties allCheckBox
     editCache: { [key: string]: { edit: boolean; data: ItemData } } = {};     // phuc vu nut chinh

     fileList: NzUploadFile[] = [];
     soVban: any;
     capDv: any;
     checkDv: boolean;
     currentday: Date = new Date();

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
          this.id = this.routerActive.snapshot.paramMap.get('id');
          this.maDonViTao = this.routerActive.snapshot.paramMap.get('maDvi');
          this.maLoaiBaoCao = this.routerActive.snapshot.paramMap.get('maLoaiBacao');
          this.namBaoCaoHienHanh = this.routerActive.snapshot.paramMap.get('nam');
          let userName = this.userService.getUserName();
          await this.getUserInfo(userName); //get user info
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
                              this.notification.error(MESSAGE.ERROR, data?.msg);
                         }
                    },
                    (err) => {
                         this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
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

          this.getStatusButton();
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
          this.danhMucService.dMLoaiChi().toPromise().then(
               (data) => {
                    if (data.statusCode == 0) {
                         this.loaiChis = data.data?.content;
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
          this.danhMucService.dMMucChi().toPromise().then(
               (data) => {
                    if (data.statusCode == 0) {
                         this.mucChis = data.data?.content;
                    } else {
                         this.notification.error(MESSAGE.ERROR, data?.msg);
                    }
               },
               (err) => {
                    this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
               }
          );
          this.danhMucService.dMLoaiChiTX().toPromise().then(
               (data) => {
                    if (data.statusCode == 0) {
                         this.maLoaiChiTxs = data.data?.content;
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
          this.spinner.hide();
     }

     getStatusButton() {
          const utils = new Utils();
          this.statusBtnDel = utils.getRoleDel(this.trangThaiBanGhi, 2, this.userInfo?.roles[0]?.id);
          this.statusBtnSave = utils.getRoleSave(this.trangThaiBanGhi, 2, this.userInfo?.roles[0]?.id);
          this.statusBtnApprove = utils.getRoleApprove(this.trangThaiBanGhi, 2, this.userInfo?.roles[0]?.id);
          this.statusBtnTBP = utils.getRoleTBP(this.trangThaiBanGhi, 2, this.userInfo?.roles[0]?.id);
          this.statusBtnLD = utils.getRoleLD(this.trangThaiBanGhi, 2, this.userInfo?.roles[0]?.id);
          this.statusBtnGuiDVCT = utils.getRoleGuiDVCT(this.trangThaiBanGhi, 2, this.userInfo?.roles[0]?.id);
          this.statusBtnDVCT = utils.getRoleDVCT(this.trangThaiBanGhi, 2, this.userInfo?.roles[0]?.id);
          this.statusBtnLDDC = utils.getRoleLDDC(this.trangThaiBanGhi, 2, this.userInfo?.roles[0]?.id);
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
          if (!this.maDviTien) {
               this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTSAVE);
               return;
          }
          //check xem tat ca cac dong du lieu da luu chua?
          //chua luu thi bao loi, luu roi thi cho di
          this.lstCTietBCao.forEach(element => {
               element.dtoanN = mulMoney(element.dtoanN, this.maDviTien);
               element.uocThienN = mulMoney(element.uocThienN, this.maDviTien);
               element.tranChiN1 = mulMoney(element.tranChiN1, this.maDviTien);
               element.ncauChiN1 = mulMoney(element.ncauChiN1, this.maDviTien);
               element.clechTranChiVsNcauChiN1 = mulMoney(element.clechTranChiVsNcauChiN1, this.maDviTien);
               element.tranChiN2 = mulMoney(element.tranChiN2, this.maDviTien);
               element.ncauChiN2 = mulMoney(element.ncauChiN2, this.maDviTien);
               element.clechTranChiVsNcauChiN2 = mulMoney(element.clechTranChiVsNcauChiN2, this.maDviTien);
               element.tranChiN3 = mulMoney(element.tranChiN3, this.maDviTien);
               element.ncauChiN3 = mulMoney(element.ncauChiN3, this.maDviTien);
               element.clechTranChiVsNcauChiN3 = mulMoney(element.clechTranChiVsNcauChiN3, this.maDviTien);
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
               idFileDinhKem: listFile,
               listIdDeletes: this.listIdDelete,
               lstCTietBCao: this.lstCTietBCao,
               maBcao: this.maBaoCao,
               maDvi: this.maDonViTao,
               maDviTien: this.maDviTien,
               maLoaiBcao: this.maLoaiBaoCao = QLNV_KHVONPHI_NCAU_CHI_NSNN_GD3N,
               namBcao: this.namBaoCaoHienHanh + 1,
               namHienHanh: this.namBaoCaoHienHanh,
               soVban: this.soVban,
          };
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
          this.updateEditCache();
          this.spinner.hide();
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
                              element.dtoanN = divMoney(element.dtoanN, this.maDviTien);
                              element.uocThienN = divMoney(element.uocThienN, this.maDviTien);
                              element.tranChiN1 = divMoney(element.tranChiN1, this.maDviTien);
                              element.ncauChiN1 = divMoney(element.ncauChiN1, this.maDviTien);
                              element.clechTranChiVsNcauChiN1 = divMoney(element.clechTranChiVsNcauChiN1, this.maDviTien);
                              element.tranChiN2 = divMoney(element.tranChiN2, this.maDviTien);
                              element.ncauChiN2 = divMoney(element.ncauChiN2, this.maDviTien);
                              element.clechTranChiVsNcauChiN2 = divMoney(element.clechTranChiVsNcauChiN2, this.maDviTien);
                              element.tranChiN3 = divMoney(element.tranChiN3, this.maDviTien);
                              element.ncauChiN3 = divMoney(element.ncauChiN3, this.maDviTien);
                              element.clechTranChiVsNcauChiN3 = divMoney(element.clechTranChiVsNcauChiN3, this.maDviTien);
                         });
                         this.updateEditCache();
                         this.lstFile = data.data.lstFile;

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
          this.spinner.hide();
     }
     changeInput(a) {
          console.log(a);

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

     // them dong moi
     addLine(id: number): void {
          let item: ItemData = {
               id: uuid.v4(),
               stt: '',
               maNdung: '',
               tenDan: '',
               maLoaiChi: '',
               maKhoanChi: '',
               maMucChi: '',
               maLoaiChiTx: '',
               dtoanN: 0,
               uocThienN: 0,
               tranChiN1: 0,
               ncauChiN1: 0,
               clechTranChiVsNcauChiN1: 0,
               ssanhNcauNVoiN1: 0,
               tranChiN2: 0,
               ncauChiN2: 0,
               clechTranChiVsNcauChiN2: 0,
               tranChiN3: 0,
               ncauChiN3: 0,
               clechTranChiVsNcauChiN3: 0,
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
          this.router.navigate(['/qlkh-von-phi/quan-ly-lap-tham-dinh-du-toan-nsnn/tim-kiem']);
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
          if (!this.editCache[id].data.maNdung ||
               !this.editCache[id].data.maLoaiChi ||
               !this.editCache[id].data.maKhoanChi ||
               !this.editCache[id].data.maMucChi ||
               !this.editCache[id].data.maLoaiChiTx ||
               (!this.editCache[id].data.dtoanN && this.editCache[id].data.dtoanN !== 0) ||
               (!this.editCache[id].data.uocThienN && this.editCache[id].data.uocThienN !== 0) ||
               (!this.editCache[id].data.ncauChiN1 && this.editCache[id].data.ncauChiN1 !== 0) ||
               (!this.editCache[id].data.ncauChiN2 && this.editCache[id].data.ncauChiN2 !== 0)) {
               this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
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

     //gia tri cac o input thay doi thi tinh toan lai
     changeModel(id: string): void {
          this.editCache[id].data.clechTranChiVsNcauChiN1 = this.editCache[id].data.tranChiN1 - this.editCache[id].data.ncauChiN1;
          this.editCache[id].data.ssanhNcauNVoiN1 = this.editCache[id].data.ncauChiN1 / this.editCache[id].data.uocThienN;
          this.editCache[id].data.clechTranChiVsNcauChiN2 = this.editCache[id].data.tranChiN2 - this.editCache[id].data.ncauChiN2;
          this.editCache[id].data.clechTranChiVsNcauChiN3 = this.editCache[id].data.tranChiN3 - this.editCache[id].data.ncauChiN3;
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
}
