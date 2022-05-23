
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as uuid from "uuid";
import { DanhMucHDVService } from '../../../../../services/danhMucHDV.service';
import { DatePipe } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { DomSanitizer } from '@angular/platform-browser';
import * as fileSaver from 'file-saver';
import { Utils } from "../../../../../Utility/utils";
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MESSAGE } from '../../../../../constants/message';
import { DialogChonThemKhoanMucQlGiaoDuToanChiNSNNComponent } from 'src/app/components/dialog/dialog-chon-them-khoan-muc-qd-giao-du-toan-chi-NSNN/dialog-chon-them-khoan-muc-qd-giao-du-toan-chi-NSNN.component';
import { NzModalService } from 'ng-zorro-antd/modal';

export class ItemData {
  stt!: string;
  maNdung!: string;
  uocThucHienNam!: number;
  duToanGiao2021!: number;
  duToanDapBo!: number;
  pBoChoDviTT!: number;
  tong!: number;
  checked!:boolean;
  id!: any;
}

@Component({
  selector: 'app-bao-cao-tong-cuc-khoach-phan-bo',
  templateUrl: './bao-cao-tong-cuc-khoach-phan-bo.component.html',
  styleUrls: ['./bao-cao-tong-cuc-khoach-phan-bo.component.scss']
})

export class BaoCaoTongCucKhoachPhanBoComponent implements OnInit {
     noiDungs: any = [];
     loaiChis: any = [];
     khoanChis: any = [];
     phanBos: any = [];
     donVis: any = [];
     lstCtietBcao: ItemData[] = [];              // list chi tiet bao cao
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
     maLoaiBaoCao: string = "26";                // nam bao cao
     maDviTien: string = "";                   // ma don vi tien
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

     statusBtnDel: boolean;                       // trang thai an/hien nut xoa
     statusBtnSave: boolean;                      // trang thai an/hien nut luu
     statusBtnApprove: boolean;                   // trang thai an/hien nut trinh duyet
     statusBtnTBP: boolean;                       // trang thai an/hien nut truong bo phan
     statusBtnLD: boolean;                        // trang thai an/hien nut lanh dao
     statusBtnGuiDVCT: boolean;                   // trang thai nut gui don vi cap tren
     statusBtnDVCT: boolean;                      // trang thai nut don vi cap tren

     listIdFiles: string;                        // id file luc call chi tiet


     allChecked = false;                         // check all checkbox
     indeterminate = true;                       // properties allCheckBox
     editCache: { [key: string]: { edit: boolean; data: ItemData } } = {};     // phuc vu nut chinh

     fileList: NzUploadFile[] = [];
     isChecked= false;
     khoanMucs: any = [];
     maKhoanMucs: any = [];
     lyDoTuChoi!: any;
     maCucDtnnKvucs: any = [];
     maNganSach!:any;
     maSoKBNN!: any;
     trangThai!: any;
     nam!: any;
     noiDung!: any;
    tongCong: ItemData = {
      id: "",
      stt: "",
      maNdung: "",
      uocThucHienNam: 0,
      duToanDapBo: 0,
      duToanGiao2021: 0,
      pBoChoDviTT: 0,
      tong: 0,
      checked: true,
    };

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
          private modal: NzModalService,

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
                    this.notification.error(MESSAGE.ERROR, data?.msg);
                  }
                },
                (err) => {
                  this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
                }
              );
               this.maBaoCao = '';
               this.namBaoCaoHienHanh = new Date().getFullYear();
          }

          const utils = new Utils();
          this.statusBtnDel = utils.getRoleDel(this.trangThaiBanGhi, 2, userInfo?.roles[0]?.code);
          this.statusBtnSave = utils.getRoleSave(this.trangThaiBanGhi, 2, userInfo?.roles[0]?.code);
          this.statusBtnApprove = utils.getRoleApprove(this.trangThaiBanGhi, 2, userInfo?.roles[0]?.code);
          this.statusBtnTBP = utils.getRoleTBP(this.trangThaiBanGhi, 2, userInfo?.roles[0]?.code);
          this.statusBtnLD = utils.getRoleLD(this.trangThaiBanGhi, 2, userInfo?.roles[0]?.code);
          this.statusBtnGuiDVCT = utils.getRoleGuiDVCT(this.trangThaiBanGhi, 2, userInfo?.roles[0]?.code);
          this.statusBtnDVCT = utils.getRoleDVCT(this.trangThaiBanGhi, 2, userInfo?.roles[0]?.code);

          this.danhMucService.dMNoiDung().toPromise().then(
               (data) => {
                    if (data.statusCode == 0) {
                         this.noiDungs = data.data?.content;
                         console.log(this.noiDungs);
                    } else {
                         this.notification.error(MESSAGE.ERROR, data?.msg);
                    }
               },
               (err) => {
                    console.log(err);
                    this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
               }
          );
          this.danhMucService.dMLoaiChi().toPromise().then(
               (data) => {
                    if (data.statusCode == 0) {
                         this.loaiChis = data.data?.content;
                         console.log(this.loaiChis);
                    } else {
                         this.notification.error(MESSAGE.ERROR, data?.msg);
                    }
               },
               (err) => {
                    console.log(err);
                    this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
               }
          );
          this.danhMucService.dMKhoanChi().toPromise().then(
               (data) => {
                    if (data.statusCode == 0) {
                         this.khoanChis = data.data?.content;
                         console.log(this.khoanChis);
                    } else {
                         this.notification.error(MESSAGE.ERROR, data?.msg);
                    }
               },
               (err) => {
                    console.log(err);
                    this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
               }
          );
          // this.danhMucService.dMMucChi().toPromise().then(
          //      (data) => {
          //           if (data.statusCode == 0) {
          //                this.mucChis = data.data?.content;
          //                console.log(this.mucChis);
          //           } else {
          //                this.notification.error(MESSAGE.ERROR, data?.msg);
          //           }
          //      },
          //      (err) => {
          //           console.log(err);
          //           this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
          //      }
          // );

          //lay danh sach danh muc don vi
          this.danhMucService.dMDonVi().toPromise().then(
               (data) => {
                    if (data.statusCode == 0) {
                         this.donVis = data.data;
                    } else {
                         this.notification.error(MESSAGE.ERROR, data?.msg);
                    }
               },
               (err) => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
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
          this.lstCtietBcao = [];
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
          this.lstCtietBcao.filter(item => {
               if (item.id?.length == 38) {
                    item.id = null;
               }
          })
          // gui du lieu trinh duyet len server
          let request = {
               id: this.id,
               idFileDinhKem: listFile,
               lstCtietBcao: this.lstCtietBcao,
               maBcao: this.maBaoCao,
               maDvi: this.maDonViTao = "01",
               maDviTien: this.maDviTien = "01",
               maLoaiBcao: this.maLoaiBaoCao = "01",
               namBcao: this.namBaoCaoHienHanh,
               namHienHanh: this.namBaoCaoHienHanh,
          };
          this.spinner.show();
          if (this.id == null) {
               this.quanLyVonPhiService.trinhDuyetService(request).subscribe(
                    (data) => {
                      if (data.statusCode == 0) {
                        this.notification.success(MESSAGE.SUCCESS, MESSAGE.SUCCESS);
                      } else {
                        this.notification.error(MESSAGE.ERROR, data?.msg);
                      }
                    },
                    (err) => {
                      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
                      console.log(err);
                    })
          }else {
            this.quanLyVonPhiService.updatelist(request).subscribe(res => {
              if (res.statusCode == 0) {
                this.notification.success(MESSAGE.SUCCESS, MESSAGE.SUCCESS);
              } else {
                this.notification.error(MESSAGE.ERROR, res?.msg);
              }
            },err =>{
              this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
            })
          }

          this.lstCtietBcao.filter(item => {
               if (!item.id) {
                    item.id = uuid.v4()+'FE';
               }
          });
          this.updateEditCache();
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
          this.spinner.hide();
          this.quanLyVonPhiService.bCLapThamDinhDuToanChiTiet(this.id).subscribe(
               (data) => {
                    if (data.statusCode == 0) {
                         this.chiTietBcaos = data.data;
                         this.lstCtietBcao = data.data.lstCtietBcao;
                         this.updateEditCache();
                         this.lstFile = data.data.lstFile;

                         // set thong tin chung bao cao
                         this.ngayNhap = data.data.ngayTao;
                         this.nguoiNhap = data.data.nguoiTao;
                         this.maDonViTao = data.data.maDvi;
                         this.maBaoCao = data.data.maBcao;
                         this.namBaoCaoHienHanh = data.data.namBcao;
                         this.trangThaiBanGhi = data.data.trangThai;
                         if (
                              this.trangThaiBanGhi == '1' ||
                              this.trangThaiBanGhi == '3' ||
                              this.trangThaiBanGhi == '5' ||
                              this.trangThaiBanGhi == '8'
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
                    console.log(err);
                    this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
               }
          );
          this.spinner.show();
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

     // them dong moi
    //  addLine(id: number): void {
    //       let item: ItemData = {
    //            id: uuid.v4()+'FE',
    //            stt: "",
    //            ngayLap: this.ngayNhap,
    //            maDvi: this.maDonViTao,
    //            nam: this.namBcao,
    //            maKhoanMuc: "",
    //            noiDung: "",
    //            maLoaiChi: "",
    //            phanBo: 0,
    //            ngayGhiNhan: "",
    //            dieuChinh: "",
    //            ghiChu: "",
    //            checked: false,
    //       }

    //       this.lstCtietBcao.splice(id, 0, item);
    //       this.editCache[item.id] = {
    //            edit: true,
    //            data: { ...item }
    //       };
    //  }

     // xoa dong
     deleteById(id: any): void {
          this.lstCtietBcao = this.lstCtietBcao.filter(item => item.id != id)
          if (id?.length == 36) {
               this.listIdDelete += id + ",";
          }
     }

     // xóa với checkbox
     deleteSelected() {
          // add list delete id
          this.lstCtietBcao.filter(item => {
               if (item.checked == true && item?.id?.length == 36) {
                    this.listIdDelete += item.id + ","
               }
          })
          // delete object have checked = true
          this.lstCtietBcao = this.lstCtietBcao.filter(item => item.checked != true)
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

     // click o checkbox all
     updateAllChecked(): void {
          this.indeterminate = false;                               // thuoc tinh su kien o checkbox all
          if (this.allChecked) {                                    // checkboxall == true thi set lai lstCtietBcao.checked = true
               this.lstCtietBcao = this.lstCtietBcao.map(item => ({
                    ...item,
                    checked: true
               }));
          } else {
               this.lstCtietBcao = this.lstCtietBcao.map(item => ({    // checkboxall == false thi set lai lstCtietBcao.checked = false
                    ...item,
                    checked: false
               }));
          }
     }

     // click o checkbox single
     updateSingleChecked(): void {
          if (this.lstCtietBcao.every(item => !item.checked)) {           // tat ca o checkbox deu = false thi set o checkbox all = false
               this.allChecked = false;
               this.indeterminate = false;
          } else if (this.lstCtietBcao.every(item => item.checked)) {     // tat ca o checkbox deu = true thi set o checkbox all = true
               this.allChecked = true;
               this.indeterminate = false;
          } else {                                                        // o checkbox vua = false, vua = true thi set o checkbox all = indeterminate
               this.indeterminate = true;
          }
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

     // start edit
     startEdit(id: string): void {
          this.editCache[id].edit = true;
     }

     // huy thay doi
     cancelEdit(id: string): void {
          const index = this.lstCtietBcao.findIndex(item => item.id === id);  // lay vi tri hang minh sua
          this.editCache[id] = {
               data: { ...this.lstCtietBcao[index] },
               edit: false
          };
     }

     // luu thay doi
     saveEdit(id: string): void {
          this.editCache[id].data.checked = this.lstCtietBcao.find(item => item.id === id).checked; // set checked editCache = checked lstCtietBcao
          const index = this.lstCtietBcao.findIndex(item => item.id === id);   // lay vi tri hang minh sua
          Object.assign(this.lstCtietBcao[index], this.editCache[id].data); // set lai data cua lstCtietBcao[index] = this.editCache[id].data
          this.editCache[id].edit = false;  // CHUYEN VE DANG TEXT
     }

     // gan editCache.data == lstCtietBcao
     updateEditCache(): void {
          this.lstCtietBcao.forEach(item => {
               this.editCache[item.id] = {
                    edit: false,
                    data: { ...item }
               };
          });
     }

     checkValue(event: any) {
      console.log(event);
     }

     addKmuc() {
      // KHOANMUCLIST.forEach(item => item.status = false);
      // .filter(item => this.lstCtietBcao?.findIndex(data => data.maNdung == item.maKmuc) == -1);

      var danhSach = this.khoanMucs

      const modalIn = this.modal.create({
           nzTitle: 'Danh sách khoản mục',
           nzContent: DialogChonThemKhoanMucQlGiaoDuToanChiNSNNComponent,
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
             this.maKhoanMucs.forEach(e => {
               if(res.id == e.id){
                   return res.id = e.tenDm
               }
             })

            this.lstCtietBcao.push({
              id: uuid.v4()+'FE',
              stt: "I",
              maNdung: res.id,
              uocThucHienNam: 0,
              duToanGiao2021: 0,
              duToanDapBo: 0,
              pBoChoDviTT: 0,
              tong: 0,
              checked: false,
         });
                res.danhSachKhoanMuc.forEach(item => {
                     if (item.status) {
                          this.lstCtietBcao.push({
                               id: uuid.v4()+'FE',
                               stt: "",
                               maNdung: item.tenDm,
                               uocThucHienNam: 0,
                               duToanGiao2021: 0,
                               duToanDapBo: 0,
                               pBoChoDviTT: 0,
                               tong: 0,
                               checked: false,
                          });
                     }
                })
                this.updateEditCache();
           }
      });
  }

    changeTong(id: string): void {
      let index = this.lstCtietBcao.findIndex(item => item.id == id);
      // this.editCache[id].data.tong = this.editCache[id].data.nguonNSNN + this.editCache[id].data.nguonKhac;
      // this.tongCong.nguonNSNN += this.editCache[id].data.nguonNSNN - this.lstCtietBcao[index].nguonNSNN;
    }
}
