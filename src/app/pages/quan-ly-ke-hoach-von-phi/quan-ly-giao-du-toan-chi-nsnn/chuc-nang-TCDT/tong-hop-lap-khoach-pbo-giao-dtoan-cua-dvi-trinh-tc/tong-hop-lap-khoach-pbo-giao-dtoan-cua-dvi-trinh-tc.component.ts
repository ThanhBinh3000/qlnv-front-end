import { NzNotificationService } from 'ng-zorro-antd/notification';
// import { LA_MA } from './../../../quan-ly-dieu-chinh-du-toan-chi-nsnn/quan-ly-dieu-chinh-du-toan-chi-nsnn.constant';
import { FormGroup } from '@angular/forms';
import { LA_MA, TRANG_THAI_PHAN_BO } from './../../../../../Utility/utils';

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as uuid from "uuid";
import { DanhMucHDVService } from '../../../../../services/danhMucHDV.service';
import { DatePipe } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { DomSanitizer } from '@angular/platform-browser';
import * as fileSaver from 'file-saver';
import { DON_VI_TIEN, Utils } from "../../../../../Utility/utils";
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { DialogChonKeHoachPhanBoGiaoDuToanChoChiCucVanPhongCucComponent } from 'src/app/components/dialog/dialog-chon-ke-hoach-phan-bo-giao-du-toan-cho-chi-cuc-van-phong-cuc/dialog-chon-ke-hoach-phan-bo-giao-du-toan-cho-chi-cuc-van-phong-cuc.component';
import { NzModalService } from 'ng-zorro-antd/modal';
import { MESSAGE } from 'src/app/constants/message';

export class ItemData {
  uocThien!: number;
  dtoanGiao!: number;
  dtoanDaPbo!: number;
  pboChoCacDvi!: number;
  maKhoanMuc!: number;
  lstKm: any[];
  status: boolean;
  id!: any;
  tenLoaiKhoan!: string;
  checked!: boolean;
}


@Component({
  selector: 'app-tong-hop-lap-khoach-pbo-giao-dtoan-cua-dvi-trinh-tc',
  templateUrl: './tong-hop-lap-khoach-pbo-giao-dtoan-cua-dvi-trinh-tc.component.html',
  styleUrls: ['./tong-hop-lap-khoach-pbo-giao-dtoan-cua-dvi-trinh-tc.component.scss']
})

export class TongHopLapKhoachPboGiaoDtoanCuaDviTrinhTcComponent implements OnInit {
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

     maNganSach!: any;
     maSoKBNN!:any;
     lanLapThu: number = 1;
     khoanMucs: any = [];
     lyDoTuChoi!: any;
     nam!: any; // nam btc
     nguoiKyBTC!: any; // nguoi ky BTC
     veViec!: any; // ve viec
     validateForm!: FormGroup;
     soQdCha: any;
     ngayQdCha: any;
     namQdCha: any;
     loaiQd: string;
     trangThaiPbos: any []= TRANG_THAI_PHAN_BO
     nguoiKys: any [] = [
       {maNguoiKy: "111", tenNguoiKy: "Đoàn Minh Vương"},
       {maNguoiKy: "112", tenNguoiKy: "Nguyễn Thành Công"},
       {maNguoiKy: "113", tenNguoiKy: "Nguyễn Xuân Hùng"},
       {maNguoiKy: "114", tenNguoiKy: "Vú Anh Tuấn"},
     ]
     maNguoiKyTC: any
     trangThaiPbo: any;
     matrangThaiPbo: any;
     maNguoiKyBTC: any;
     tongPBoChoDviTT: number;
     tongDuToanPb: number;
     tongUocTHien: number;
     tongDuToanGiao: any;
     donViTiens: any = DON_VI_TIEN;

     lstKhoanMuc: any[] ;

     soLaMa: any[] = LA_MA;

     initItem: ItemData = {
       dtoanDaPbo: 0,
       dtoanGiao: 0,
       pboChoCacDvi: 0,
       uocThien: 0,
       maKhoanMuc: 0,
       lstKm: [],
       status: false,
       id: null,
       tenLoaiKhoan: "0",
       checked: false,
     };

     vt: number;
     stt: number;
     kt: boolean;
     disable: boolean = false;
     fileList: NzUploadFile[] = []; // list file
     maCucDtnnKvucs: any = [];
     capDv:any;// ma don vi tien
     maKhoanMucs:any = [];                          // danh muc nhom chi
     noiDung!: string;
     beforeUpload = (file: NzUploadFile): boolean => {
          this.fileList = this.fileList.concat(file);
          return false;
     };
  maQdCha: any;

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
          private modal: NzModalService,
          private notification: NzNotificationService,

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
                         this.errorMessage = "Có lỗi trong quá trình vấn tin!";
                    }
               },
               (err) => {
                    console.log(err);
                    this.errorMessage = err.error.message;
               }
          );
          this.danhMucService.dMLoaiChi().toPromise().then(
               (data) => {
                    if (data.statusCode == 0) {
                         this.loaiChis = data.data?.content;
                         console.log(this.loaiChis);
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
                         console.log(this.khoanChis);
                    } else {
                         this.errorMessage = "Có lỗi trong quá trình vấn tin!";
                    }
               },
               (err) => {
                    console.log(err);
                    this.errorMessage = err.error.message;
               }
          );
          // this.danhMucService.dMMucChi().toPromise().then(
          //      (data) => {
          //           if (data.statusCode == 0) {
          //                this.mucChis = data.data?.content;
          //                console.log(this.mucChis);
          //           } else {
          //                this.errorMessage = "Có lỗi trong quá trình vấn tin!";
          //           }
          //      },
          //      (err) => {
          //           console.log(err);
          //           this.errorMessage = err.error.message;
          //      }
          // );

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
                         alert("trinh duyet thanh cong!");
                         console.log(data);
                    },
                    (err) => {
                         alert("trinh duyet that bai!");
                         console.log();
                    })
          } else {
               this.quanLyVonPhiService.updateLapThamDinh(request).subscribe(res => {
                    if (res.statusCode == 0) {
                         alert('trinh duyet thanh cong!');
                    } else {
                         alert('đã có lỗi xảy ra, vui lòng thử lại sau!');
                    }
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



     async addKmuc() {
      var danhSach = this.khoanMucs
      var maQdCha = this.maQdCha
      var maDvi = this.maDonViTao
      var soQdCha = this.soQdCha
      var ngayQdCha = this.ngayQdCha
      var namQdCha = this.namQdCha
      var maNguoiKyBTC = this.maNguoiKyBTC
      var matrangThaiPbo = this.matrangThaiPbo
      var maDviTien = this.maDviTien
      const modalIn = this.modal.create({
           nzTitle: 'Danh sách khoản mục',
           nzContent: DialogChonKeHoachPhanBoGiaoDuToanChoChiCucVanPhongCucComponent,
           nzMaskClosable: false,
           nzClosable: false,
           nzWidth: '600px',
           nzFooter: null,
           nzComponentParams: {
                danhSachKhoanMuc: danhSach,
                maQdCha: maQdCha,
                maDvi: maDvi,
                soQdCha: soQdCha,
                ngayQdCha: ngayQdCha,
                namQdCha: namQdCha,
                maNguoiKyBTC: maNguoiKyBTC,
                matrangThaiPbo: matrangThaiPbo,
                maDviTien: maDviTien
           },
      });
      modalIn.afterClose.subscribe((res) => {
          this.maQdCha = res.maQdCha
          this.maDonViTao = res.maDvi
          this.soQdCha = res.soQdCha
          this.soQdCha = this.soQdCha.replace('/QĐ-BTC', '')
          this.ngayQdCha = res.ngayQdCha
          this.namQdCha = res.namQdCha
          this.nguoiKyBTC = res.nguoiKyBTC
          this.matrangThaiPbo = res.matrangThaiPbo
          this.maNguoiKyBTC = res.maNguoiKyBTC
          this.maDviTien = res.maDviTien
          this.changeMaCucKhuVuc(res.maDvi)
          // this.changeDonViTien()
          console.log(this.maDviTien);


           if (res) {
                this.quanLyVonPhiService.timDanhSachBCGiaoBTCPD1().toPromise().then(
                  (data) => {
                    if (data.statusCode == 0) {
                      this.lstKhoanMuc = data.data;
                    } else {
                      this.notification.error(MESSAGE.ERROR, data?.msg);
                    }

                  },
                  (err) => {
                    this.notification.error(MESSAGE.ERROR, err?.msg);
                  }
                );
                this.lstCtietBcao = res.danhSachKhoanMuc
                this.sortByIndex()
                this.tinhTong1()
                this.updateEditCache();
           }
      });
  }
  getNameContent(id: any):string{
    return this.maKhoanMucs.find( item => item.id ==id )?.thongTin;
  }
  changeMaCucKhuVuc(maDvi: any) {
    this.maCucDtnnKvucs.forEach(e => {
      if (maDvi == e.maDvi) {
        this.maNganSach = e.maNsnn;
        this.maSoKBNN = e.maKbnn;
      }
    });
  }
  // changeTrangThaiPbo(){
  //   this.trangThaiPbos.forEach(e => {
  //     if(this.matrangThaiPbo == e.id){
  //       this.trangThaiPbo = e.ten
  //     }
  //   })
  // }
  // changeNguoiKy(){
  //   this.nguoiKys.forEach(e => {
  //     if(this.maNguoiKyBTC == e.maNguoiKy){
  //       this.nguoiKyBTC = e.tenNguoiKy
  //     }
  //   })
  // }

  changeTong(id: string): void {
    this.editCache[id].data.dtoanGiao = this.editCache[id].data.dtoanDaPbo + this.editCache[id].data.pboChoCacDvi
  }
  tinhTong1(){
    this.tongUocTHien = 0
    this.tongDuToanPb = 0
    this.tongPBoChoDviTT = 0
    this.lstCtietBcao.forEach(e => {
      this.tongUocTHien += e.uocThien;
      this.tongDuToanPb += e.dtoanDaPbo;
      this.tongPBoChoDviTT += e.pboChoCacDvi
      this.tongDuToanGiao= this.tongDuToanPb + this.tongPBoChoDviTT;
    })
  }

  // chuyển đổi stt đang được mã hóa thành dạng I, II, a, b, c, ...
  getChiMuc(str: string): string {
    str = str.substring(str.indexOf('.') + 1, str.length);
    var xau: string = "";
    let chiSo: any = str.split('.');
    var n: number = chiSo.length - 1;
    var k: number = parseInt(chiSo[n], 10);
    if (n == 0) {
        for (var i = 0; i < this.soLaMa.length; i++) {
            while (k >= this.soLaMa[i].gTri) {
                xau += this.soLaMa[i].kyTu;
                k -= this.soLaMa[i].gTri;
            }
        }
    };
    if (n == 1) {
        xau = chiSo[n];
    };
    if (n == 2) {
        xau = chiSo[n - 1].toString() + "." + chiSo[n].toString();
    };
    if (n == 3) {
        xau = String.fromCharCode(k + 96);
    }
    if (n == 4) {
        xau = "-";
    }
    return xau;
}
// lấy phần đầu của số thứ tự, dùng để xác định phần tử cha
getHead(str: string): string {
    return str.substring(0, str.lastIndexOf('.'));
}
// lấy phần đuôi của stt
getTail(str: string): number {
    return parseInt(str.substring(str.lastIndexOf('.') + 1, str.length), 10);
}
//tìm vị trí cần để thêm mới
findVt(str: string): number {
    var start: number = this.lstCtietBcao.findIndex(e => e.tenLoaiKhoan == str);
    var index: number = start;
    for (var i = start + 1; i < this.lstCtietBcao.length; i++) {
        if (this.lstCtietBcao[i].tenLoaiKhoan.startsWith(str)) {
            index = i;
        }
    }
    return index;
}
//thay thế các stt khi danh sách được cập nhật, heSo=1 tức là tăng stt lên 1, heso=-1 là giảm stt đi 1
replaceIndex(lstIndex: number[], heSo: number) {
    //thay doi lai stt cac vi tri vua tim duoc
    lstIndex.forEach(item => {
        var str = this.getHead(this.lstCtietBcao[item].tenLoaiKhoan) + "." + (this.getTail(this.lstCtietBcao[item].tenLoaiKhoan) + heSo).toString();
        var nho = this.lstCtietBcao[item].tenLoaiKhoan;
        this.lstCtietBcao.forEach(item => {
            item.tenLoaiKhoan = item.tenLoaiKhoan.replace(nho, str);
        })
    })
}
//thêm ngang cấp
addSame(id: any, initItem: ItemData) {
    var index: number = this.lstCtietBcao.findIndex(e => e.id === id); // vi tri hien tai
    var head: string = this.getHead(this.lstCtietBcao[index].tenLoaiKhoan); // lay phan dau cua so tt
    var tail: number = this.getTail(this.lstCtietBcao[index].tenLoaiKhoan); // lay phan duoi cua so tt
    var ind: number = this.findVt(this.lstCtietBcao[index].tenLoaiKhoan); // vi tri can duoc them
    // tim cac vi tri can thay doi lai stt
    let lstIndex: number[] = [];
    for (var i = this.lstCtietBcao.length - 1; i > ind; i--) {
        if (this.getHead(this.lstCtietBcao[i].tenLoaiKhoan) == head) {
            lstIndex.push(i);
        }
    }
    this.replaceIndex(lstIndex, 1);
    // them moi phan tu
    if (initItem.id) {
        let item: ItemData = {
            ...initItem,
            tenLoaiKhoan: head + "." + (tail + 1).toString(),
        }
        this.lstCtietBcao.splice(ind + 1, 0, item);
        this.editCache[item.id] = {
            edit: false,
            data: { ...item }
        };
    } else {
        let item: ItemData = {
            ...initItem,
            id: uuid.v4() + 'FE',
            tenLoaiKhoan: head + "." + (tail + 1).toString(),
            lstKm: this.lstCtietBcao[index].lstKm,
        }
        this.lstCtietBcao.splice(ind + 1, 0, item);
        this.editCache[item.id] = {
            edit: true,
            data: { ...item }
        };
    }
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
//thêm cấp thấp hơn
addLow(id: any, initItem: ItemData) {
    var index: number = this.lstCtietBcao.findIndex(e => e.id === id); // vi tri hien tai
    //list các vị trí cần thay đôi lại stt
    let lstIndex: number[] = [];
    for (var i = this.lstCtietBcao.length - 1; i > index; i--) {
        if (this.getHead(this.lstCtietBcao[i].tenLoaiKhoan) == this.lstCtietBcao[index].tenLoaiKhoan) {
            lstIndex.push(i);
        }
    }
    this.replaceIndex(lstIndex, 1);
    // them moi phan tu
    if (initItem.id) {
        let item: ItemData = {
            ...initItem,
            tenLoaiKhoan: this.lstCtietBcao[index].tenLoaiKhoan + ".1",
        }
        this.lstCtietBcao.splice(index + 1, 0, item);
        this.editCache[item.id] = {
            edit: false,
            data: { ...item }
        };
    } else {
        let item: ItemData = {
            ...initItem,
            id: uuid.v4() + 'FE',
            lstKm: this.lstKhoanMuc.filter(e => e.idCha == this.lstCtietBcao[index].maKhoanMuc),
            tenLoaiKhoan: this.lstCtietBcao[index].tenLoaiKhoan + ".1",
        }
        this.lstCtietBcao.splice(index + 1, 0, item);

        this.editCache[item.id] = {
            edit: true,
            data: { ...item }
        };
    }
}
//xóa dòng
deleteLine(id: any) {
    var index: number = this.lstCtietBcao.findIndex(e => e.id === id); // vi tri hien tai
    var nho: string = this.lstCtietBcao[index].tenLoaiKhoan;
    var head: string = this.getHead(this.lstCtietBcao[index].tenLoaiKhoan); // lay phan dau cua so tt
    //xóa phần tử và con của nó
    this.lstCtietBcao = this.lstCtietBcao.filter(e => !e.tenLoaiKhoan.startsWith(nho));
    //update lại số thức tự cho các phần tử cần thiết
    let lstIndex: number[] = [];
    for (var i = this.lstCtietBcao.length - 1; i >= index; i--) {
        if (this.getHead(this.lstCtietBcao[i].tenLoaiKhoan) == head) {
            lstIndex.push(i);
        }
    }

    this.replaceIndex(lstIndex, -1);

    this.updateEditCache();
}

// start edit
startEdit(id: string): void {
    this.editCache[id].edit = true;
}

// huy thay doi
cancelEdit(id: string): void {
    const index = this.lstCtietBcao.findIndex(item => item.id === id);
    if (!this.lstCtietBcao[index].maKhoanMuc) {
        this.deleteLine(id);
        return;
    }
    // lay vi tri hang minh sua
    this.editCache[id] = {
        data: { ...this.lstCtietBcao[index] },
        edit: false
    };
}

// luu thay doi
saveEdit(id: string): void {
    this.editCache[id].data.checked = this.lstCtietBcao.find(item => item.id === id).checked; // set checked editCache = checked lstCtietBcao
    if (this.lstKhoanMuc.findIndex(e => e.idCha == this.editCache[id].data.maKhoanMuc) != -1) {
        this.editCache[id].data.status = true;
    }
    const index = this.lstCtietBcao.findIndex(item => item.id === id); // lay vi tri hang minh sua
    Object.assign(this.lstCtietBcao[index], this.editCache[id].data); // set lai data cua lstCtietBcao[index] = this.editCache[id].data
    this.editCache[id].edit = false; // CHUYEN VE DANG TEXT
    this.tinhTong1()
}

updateChecked(id: any) {
  var data: ItemData = this.lstCtietBcao.find(e => e.id === id);
  //đặt các phần tử con có cùng trạng thái với nó
  this.lstCtietBcao.forEach(item => {
      if (item.tenLoaiKhoan.startsWith(data.tenLoaiKhoan)) {
          item.checked = data.checked;
      }
  })
  //thay đổi các phần tử cha cho phù hợp với tháy đổi của phần tử con
  var index: number = this.lstCtietBcao.findIndex(e => e.tenLoaiKhoan == this.getHead(data.tenLoaiKhoan));
  if (index == -1) {
      this.allChecked = this.checkAllChild('0');
  } else {
      var nho: boolean = this.lstCtietBcao[index].checked;
      while (nho != this.checkAllChild(this.lstCtietBcao[index].tenLoaiKhoan)) {
          this.lstCtietBcao[index].checked = !nho;
          index = this.lstCtietBcao.findIndex(e => e.tenLoaiKhoan == this.getHead(this.lstCtietBcao[index].tenLoaiKhoan));
          if (index == -1) {
              this.allChecked = !nho;
              break;
          }
          nho = this.lstCtietBcao[index].checked;
      }
  }
}
//kiểm tra các phần tử con có cùng được đánh dấu hay ko
checkAllChild(str: string): boolean {
    var nho: boolean = true;
    this.lstCtietBcao.forEach(item => {
        if ((this.getHead(item.tenLoaiKhoan) == str) && (!item.checked) && (item.tenLoaiKhoan != str)) {
            nho = item.checked;
        }
    })
    return nho;
}


updateAllChecked() {
    this.lstCtietBcao.forEach(item => {
        item.checked = this.allChecked;
    })
}

deleteAllChecked() {
    var lstId: any[] = [];
    this.lstCtietBcao.forEach(item => {
        if (item.checked) {
            lstId.push(item.id);
        }
    })
    lstId.forEach(item => {
        if (this.lstCtietBcao.findIndex(e => e.id == item) != -1) {
            this.deleteLine(item);
        }
    })
}
//thêm phần tử đầu tiên khi bảng rỗng
addFirst(initItem: ItemData) {
    if (initItem.id) {
        let item: ItemData = {
            ...initItem,
            tenLoaiKhoan: "0.1",
        }
        this.lstCtietBcao.push(item);
        this.editCache[item.id] = {
            edit: false,
            data: { ...item }
        };
    } else {
        let item: ItemData = {
            id: uuid.v4() + 'FE',
            maKhoanMuc: 0,
            lstKm: this.lstKhoanMuc.filter(e => e.idCha == 503),
            status: false,
            tenLoaiKhoan: "0.1",
            dtoanDaPbo: 0,
            dtoanGiao: 0,
            pboChoCacDvi: 0,
            uocThien: 0,
            checked: false,
        }
        this.lstCtietBcao.push(item);

        this.editCache[item.id] = {
            edit: true,
            data: { ...item }
        };
    }
}

sortByIndex() {

    this.lstCtietBcao.forEach(item => {
        this.setDetail(item.id);
    })
    this.lstCtietBcao.sort((item1, item2) => {
        if (item1.lstKm[0].levelDm > item2.lstKm[0].levelDm) {
            return -1;
        }
        if (item1.lstKm[0].levelDm < item2.lstKm[0].levelDm) {
            return 1;
        }
        if (this.getTail(item1.tenLoaiKhoan) > this.getTail(item2.tenLoaiKhoan)) {
            return 1;
        }
        if (this.getTail(item1.tenLoaiKhoan) < this.getTail(item2.tenLoaiKhoan)) {
            return -1;
        }
        return 0;
    });
    var lstTemp: any[] = [];
    this.lstCtietBcao.forEach(item => {
        var index: number = lstTemp.findIndex(e => e.stt == this.getHead(item.tenLoaiKhoan));
        if (index == -1) {
            lstTemp.splice(0, 0, item);
        } else {
            lstTemp.splice(index + 1, 0, item);
        }
    })

    this.lstCtietBcao = lstTemp;
}

setDetail(id: any) {
    var index: number = this.lstCtietBcao.findIndex(item => item.id === id);
    var parentId: number = this.lstKhoanMuc.find(e => e.id == this.lstCtietBcao[index].maKhoanMuc).idCha;
    this.lstCtietBcao[index].lstKm = this.lstKhoanMuc.filter(e => e.idCha == parentId);
    if (this.lstKhoanMuc.findIndex(e => e.idCha === this.lstCtietBcao[index].maKhoanMuc) == -1) {
        this.lstCtietBcao[index].status = false;
    } else {
        this.lstCtietBcao[index].status = true;
    }
}

sortWithoutIndex() {
    this.lstCtietBcao.forEach(item => {
        this.setDetail(item.id);
    })

    var level = 0;
    var lstCtietBcaoTemp: ItemData[] = this.lstCtietBcao;
    this.lstCtietBcao = [];
    var data: ItemData = lstCtietBcaoTemp.find(e => e.lstKm[0].levelDm == 0);
    this.addFirst(data);
    lstCtietBcaoTemp = lstCtietBcaoTemp.filter(e => e.id != data.id);
    var lstTemp: ItemData[] = lstCtietBcaoTemp.filter(e => e.lstKm[0].levelDm == level);
    while (lstTemp.length !=0 || level == 0){
        lstTemp.forEach(item => {
            var index: number = this.lstCtietBcao.findIndex(e => e.maKhoanMuc === item.lstKm[0].idCha);
            if (index != -1){
                this.addLow(this.lstCtietBcao[index].id, item);
            } else {
                index = this.lstCtietBcao.findIndex(e => e.lstKm[0].idCha === item.lstKm[0].idCha);
                this.addSame(this.lstCtietBcao[index].id, item);
            }
        })
        level += 1;
        lstTemp = lstCtietBcaoTemp.filter(e => e.lstKm[0].levelDm == level);
    }
}
}
