import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as uuid from "uuid";
import { DanhMucHDVService } from '../../../../services/danhMucHDV.service';
import { DatePipe } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { DomSanitizer } from '@angular/platform-browser';
import * as fileSaver from 'file-saver';
import { divMoney, DONVITIEN, mulMoney, TRANGTHAIBANGHI, Utils } from "../../../../Utility/utils";
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MESSAGE } from '../../../../constants/message';
import { KHOANMUCLIST } from './lap-bao-cao-dieu-chinh-du-toan-chi-nsnn.constant'
import { NzModalService } from 'ng-zorro-antd/modal';
import { DialogChonThemKhoanMucComponent } from 'src/app/components/dialog/dialog-quan-ly-dieu-chinh-du-toan-chi-nsnn/dialog-chon-them-khoan-muc/dialog-chon-them-khoan-muc.component';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { DialogDanhSachKeHoachPhanBoGiaoDuToanComponent } from 'src/app/components/dialog/dialog-quan-ly-dieu-chinh-du-toan-chi-nsnn/dialog-danh-sach-ke-hoach-phan-bo-giao-du-toan-cua-don-vi/dialog-danh-sach-ke-hoach-phan-bo-giao-du-toan-cua-don-vi.component';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';

export class ItemData {
     id: any;
     stt!: string;
     loaiKhoan!: string;
     maNdung!: string;
     tongNhuCauKphiNam!: number;
     namTruocChuyenSang!: number;
     daGiaoTrongNam!: number;
     cong!: number;
     kphiUocThien!: number;
     tang!: number;
     giam!: number;
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
     donViTiens: any[] = DONVITIEN;
     trangThais: any[] = TRANGTHAIBANGHI;
     khoanMucs: any[] = KHOANMUCLIST;

     maDviTien: any;
     status: boolean = false;
     tongCong: ItemData = {
          id: "",
          stt: "",
          loaiKhoan: "",
          maNdung: "",
          tongNhuCauKphiNam: 0,
          namTruocChuyenSang: 0,
          daGiaoTrongNam: 0,
          cong: 0,
          kphiUocThien: 0,
          tang: 0,
          giam: 0,
          ghiChu: "",
          checked: false,
     };

     dvql!: any;
     maNganSach!: string;
     maSoKbnn!: string;

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
     trangThaiBanGhi: any = '1';

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

     listIdDeleteFiles: string = "";                        // id file luc call chi tiet

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
          private modal: NzModalService,
     ) {

     }


     async ngOnInit() {
          await this.danhMucService.dMDonVi().toPromise().then(
               (data) => {
                    if (data.statusCode == 0) {
                         this.donVis = data.data;
                    } else {
                         this.notification.error(MESSAGE.ERROR, data?.msg);
                    }
               },
               (err) => {
                    this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
               }
          );
          this.id = this.routerActive.snapshot.paramMap.get('id');
          let userName = this.userService.getUserName();
          await this.getUserInfo(userName); //get user info
          if (this.id) {
               await this.getDetailReport();
          } else {
               this.maDonViTao = this.userInfo?.dvql;
               this.trangThaiBanGhi = '1';
               this.dvql = this.donVis.find(e => e.maDvi == this.maDonViTao);
               this.maNganSach = this.dvql?.maNsnn;
               this.maSoKbnn = this.dvql?.maKbnn;
          }
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
                    this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
               }
          );
     }

     //
     selectFile(files: FileList): void {
          this.fileToUpload = files.item(0);
     }

     // luu
     async luu() {
          let checkSaveEdit;
		if (!this.maDviTien ) {
			this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTSAVE);
			return;
		}
		this.lstCTietBCao.filter(element => {
			if (this.editCache[element.id].edit === true) {
				checkSaveEdit = false
			}
		});
		if (checkSaveEdit == false) {
			this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTSAVE);
			return;
		}

          this.mulMoneyTotal(this.lstCTietBCao);

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
               listIdFiles: "",
               listIdDeletes: this.listIdDelete,
               listCtiet: this.lstCTietBCao,
               listIdDtoan: "",
               maDvi: this.maDonViTao,
               ghiChu: this.noiDung,
               trangThai: this.trangThaiBanGhi,
               maDviTien: this.maDviTien,
               nam: this.namBcao,
          };
          this.spinner.show();
          if (this.id == null) {
               this.quanLyVonPhiService.themmoiDieuChinh(request).subscribe(
                    res => {
                         if (res.statusCode == 0) {
                              this.notification.success(MESSAGE.SUCCESS, MESSAGE.SUCCESS);
                              this.id = res.data.id;
                              this.getDetailReport();
                              this.getStatusButton();
                         } else {
                              this.divMoneyTotal(this.lstCTietBCao);
                              this.notification.error(MESSAGE.ERROR, res?.msg);
                         }
                    },
                    err => {
                         this.divMoneyTotal(this.lstCTietBCao);
                         this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
                    }
               )

          } else {
               this.quanLyVonPhiService.updateDieuChinh(request).subscribe(
                    res => {
                         if (res.statusCode == 0) {
                              this.getDetailReport();
                              this.getStatusButton();
                              this.notification.success(MESSAGE.SUCCESS, MESSAGE.SUCCESS);
                         } else {
                              this.divMoneyTotal(this.lstCTietBCao);
                              this.notification.error(MESSAGE.ERROR, res?.msg);
                         }
                    },
                    err => {
                         this.divMoneyTotal(this.lstCTietBCao);
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

     addPhanBo() {
          const modalIn = this.modal.create({
               nzTitle: 'Danh sách kế hoạch phân bổ, giao dự toán của đơn vị',
               nzContent: DialogDanhSachKeHoachPhanBoGiaoDuToanComponent,
               nzMaskClosable: false,
               nzClosable: false,
               nzWidth: '65%',
               nzFooter: null,
               nzComponentParams: {
                    maDvi: this.maDonViTao
               },
          });
          modalIn.afterClose.subscribe((res) => {
               if (res) {
                    this.addKmuc(res);
               }
          });
     }

     addKmuc(id: any) {

          const modalIn = this.modal.create({
               nzTitle: 'Danh sách khoản mục',
               nzContent: DialogChonThemKhoanMucComponent,
               nzMaskClosable: false,
               nzClosable: false,
               nzWidth: '65%',
               nzFooter: null,
               nzComponentParams: {
                    id: id
               },
          });
          modalIn.afterClose.subscribe((res) => {
               if (res) {
                    res.forEach(item => {
                         if(item.checked){
                              this.lstCTietBCao.push({
                                   id: uuid.v4(),
                                   stt: "",
                                   loaiKhoan: item.tenLoaiKhoan,
                                   maNdung: item.maNdung,
                                   tongNhuCauKphiNam: 0,
                                   namTruocChuyenSang: 0,
                                   daGiaoTrongNam: item.dtoanGiao,
                                   cong: item.dtoanGiao,
                                   kphiUocThien: 0,
                                   tang: 0,
                                   giam: 0,
                                   ghiChu: "",
                                   checked: false,
                              });
                         }
                    })
                    this.lstCTietBCao.forEach(item => {
                         this.tinhTong(1, item);
                    })
                    this.updateEditCache();
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
          this.spinner.show();
          await this.quanLyVonPhiService.chitietDieuChinh(this.id).subscribe(
               (data) => {
                    if (data.statusCode == 0) {
                         this.maDonViTao = data.data.maDvi;
                         this.maDviTien = data.data.maDviTien;
                         this.lstCTietBCao = data.data.listCtiet;
                         this.divMoneyTotal(this.lstCTietBCao);
                         this.updateEditCache();
                         this.lstFile = data.data.lstFile;
                         this.noiDung = data.data.ghiChu;
                         this.trangThaiBanGhi = data.data.trangThai;
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
          upfile.append('folder', this.maDonViTao);
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


     redirectChiTieuKeHoachNam() {
          this.router.navigate(['/kehoach/chi-tieu-ke-hoach-nam-cap-tong-cuc']);
     }

     // lay ten trang thai
     getStatusName() {
          return this.trangThais.find(e => e.id == this.trangThaiBanGhi)?.tenDm;
     }
     getUnitName() {
          return this.donVis.find(e => e.maDvi == this.maDonViTao)?.tenDvi;
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

     changeModel(id: any) {
          this.editCache[id].data.cong = this.editCache[id].data.namTruocChuyenSang + this.editCache[id].data.daGiaoTrongNam;
          this.editCache[id].data.kphiUocThien = this.editCache[id].data.tongNhuCauKphiNam + this.editCache[id].data.cong + this.editCache[id].data.tang + this.editCache[id].data.giam;
     }

     tinhTong(heSo: number, item: ItemData) {
          this.tongCong.tongNhuCauKphiNam += heSo * item.tongNhuCauKphiNam;
          this.tongCong.namTruocChuyenSang += heSo * item.namTruocChuyenSang;
          this.tongCong.daGiaoTrongNam += heSo * item.daGiaoTrongNam;
          this.tongCong.cong += heSo * item.cong;
          this.tongCong.kphiUocThien += heSo * item.kphiUocThien;
          this.tongCong.tang += heSo * item.tang;
          this.tongCong.giam += heSo * item.giam;
     }

     getKmName(maNdung: string){
		return this.khoanMucs.find(e => e.id == maNdung)?.tenDm;
	}

     divMoneyTotal(data: ItemData[]) {
          data.forEach(item => {
               item.tongNhuCauKphiNam = divMoney(item.tongNhuCauKphiNam, this.maDviTien);
               item.namTruocChuyenSang = divMoney(item.namTruocChuyenSang, this.maDviTien);
               item.daGiaoTrongNam = divMoney(item.daGiaoTrongNam, this.maDviTien);
               item.cong = divMoney(item.cong, this.maDviTien);
               item.kphiUocThien = divMoney(item.kphiUocThien, this.maDviTien);
               item.tang = divMoney(item.tang, this.maDviTien);
               item.giam = divMoney(item.giam, this.maDviTien);
          })
     }

     mulMoneyTotal(data: ItemData[]) {
          data.forEach(item => {
               item.tongNhuCauKphiNam = mulMoney(item.tongNhuCauKphiNam, this.maDviTien);
               item.namTruocChuyenSang = mulMoney(item.namTruocChuyenSang, this.maDviTien);
               item.daGiaoTrongNam = mulMoney(item.daGiaoTrongNam, this.maDviTien);
               item.cong = mulMoney(item.cong, this.maDviTien);
               item.kphiUocThien = mulMoney(item.kphiUocThien, this.maDviTien);
               item.tang = mulMoney(item.tang, this.maDviTien);
               item.giam = mulMoney(item.giam, this.maDviTien);
          })
     }
}

