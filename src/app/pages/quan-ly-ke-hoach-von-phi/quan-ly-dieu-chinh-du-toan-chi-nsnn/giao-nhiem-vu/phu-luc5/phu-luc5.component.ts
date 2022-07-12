import { NzUploadFile } from 'ng-zorro-antd/upload';
import { DialogTuChoiComponent } from './../../../../../components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MONEY_LIMIT } from './../../../../../Utility/utils';
import { mulMoney, divMoney } from 'src/app/Utility/utils';
import { DatePipe, Location } from '@angular/common';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import * as uuid from "uuid";
import { DanhMucHDVService } from '../../../../../services/danhMucHDV.service';
import { DON_VI_TIEN, QLNV_KHVONPHI_TC_THOP_NCAU_CHI_NSNN_GD3N } from "../../../../../Utility/utils";
import * as fileSaver from 'file-saver';
// export class ItemData {
//     id!: any;
//     stt!: number;
//     maDvi: string;
//     bcheGiao2021: number;
//     bcheChuaTuyen: number;
//     ldongHdong: number;
//     hslPcapTso: number;
//     hslPcapHsl: number;
//     hslPcapTong: number;
//     hslPcapChucVu: number;
//     hslPcapTnhiem: number;
//     hslPcapTnienVkhung: number;
//     hslPcapHsbl: number;
//     hslPcapCongVu: number;
//     hslPcapTnien: number;
//     hslPcapUdai: number;
//     hslPcapKvuc: number;
//     hslPcapKhac: number;
//     tqtlPcapTso: number;
//     tqtlPcapTluong: number;
//     tqtlPcapTong: number;
//     tqtlPcapChucVu: number;
//     tqtlPcapTniem: number;
//     tqtlPcapTnienVkhung: number;
//     tqtlPcapHsbl: number;
//     tqtlPcapCongVu: number;
//     tqtlPcapTnien: number;
//     tqtlPcapUdai: number;
//     tqtlPcapKvuc: number;
//     tqtlPcapKhac: number;
//     tongNcauTluong: number;
//     baoGomTluongBche: number;
//     baoGomKhoanDgop: number;
//     baoGomLuongCbcc: number;

//     checked!: boolean;
// }

@Component({
  selector: 'app-phu-luc5',
  templateUrl: './phu-luc5.component.html',
  styleUrls: ['./phu-luc5.component.scss'],
})
export class PhuLuc5Component implements OnInit {
  @Input() data;
  @Output() dataChange = new EventEmitter();
  //danh muc
  // donVis: any = [];
  // matHangs: any[] = [];
  // nhomChis: any[] = [];
  // lstDchinh: ItemData[] = [];
  // donViTiens: any[] = DON_VI_TIEN;
  // maCucDtnnKvucs: any [] = [];
  //thong tin chung
  id: any;
  namHienHanh: number;
  maBieuMau: string;
  trangThaiPhuLuc = '1';
  trangThaiPhuLucGetDeTail!: string;
  // initItem: ItemData = {
  //   id: null,
  //   stt: 0,
  //   maDvi: "",
  //   bcheGiao2021: 0,
  // bcheChuaTuyen: 0,
  // ldongHdong: 0,
  // hslPcapTso: 0,
  // hslPcapHsl: 0,
  // hslPcapTong: 0,
  // hslPcapChucVu: 0,
  // hslPcapTnhiem: 0,
  // hslPcapTnienVkhung: 0,
  // hslPcapHsbl: 0,
  // hslPcapCongVu: 0,
  // hslPcapTnien: 0,
  // hslPcapUdai: 0,
  // hslPcapKvuc: 0,
  // hslPcapKhac: 0,
  // tqtlPcapTso: 0,
  // tqtlPcapTluong: 0,
  // tqtlPcapTong: 0,
  // tqtlPcapChucVu: 0,
  // tqtlPcapTniem: 0,
  // tqtlPcapTnienVkhung: 0,
  // tqtlPcapHsbl: 0,
  // tqtlPcapCongVu: 0,
  // tqtlPcapTnien: 0,
  // tqtlPcapUdai: 0,
  // tqtlPcapKvuc: 0,
  // tqtlPcapKhac: 0,
  // tongNcauTluong: 0,
  // baoGomTluongBche: 0,
  // baoGomKhoanDgop: 0,
  // baoGomLuongCbcc: 0,
  //   checked: false,
  // };

  // namBcao: number = 2022;
  thuyetMinh: string;
  // maDviTien: any;
  listIdDelete = "";
  //trang thai cac nut
  status = false;
  // capDv:any;
  // allChecked = false;                         // check all checkbox
  // editCache: { [key: string]: { edit: boolean; data: ItemData } } = {};     // phuc vu nut chinh
  statusBtnFinish: boolean;
  statusBtnOk: boolean;

  // khac
  lstFiles: any[] = []; //show file ra man hinh
  //file
  listFile: File[] = [];                      // list file chua ten va id de hien tai o input
  fileList: NzUploadFile[] = [];
  fileDetail: NzUploadFile;
  //beforeUpload: any;
  listIdFilesDelete: any = [];                        // id file luc call chi tiet

  // before uploaf file
  beforeUpload = (file: NzUploadFile): boolean => {
    this.fileList = this.fileList.concat(file);
    return false;
  };
  // them file vao danh sach
  handleUpload(): void {
    // this.lstFiles = [];
    this.fileList.forEach((file: any) => {
      const id = file?.lastModified.toString();
      // this.lstFiles = [];
      this.lstFiles.push({ id: id, fileName: file?.name });
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
    private danhMucService: DanhMucHDVService,
    private notification: NzNotificationService,
    private location: Location,
    private fb: FormBuilder,
    private modal: NzModalService,
  ) {
  }


  async ngOnInit() {
    this.spinner.show();
    this.id = this.data?.id;
    this.maBieuMau = this.data?.maBieuMau;
    // this.maDviTien = this.data?.maDviTien;
    this.thuyetMinh = this.data?.thuyetMinh;
    this.trangThaiPhuLuc = this.data?.trangThai;
    this.trangThaiPhuLucGetDeTail = this.data?.lstDchinhs?.trangThai;
    this.namHienHanh = this.data?.namHienHanh;
    // this.lstDchinh = this.data?.lstCtiet;
    if(!this.data.fileData){
      this.lstFiles = []
    }else {
      this.lstFiles = this.data.fileData;
    }

    this.listFile = [];
    this.status = this.data?.status;
    this.statusBtnFinish = this.data?.statusBtnFinish;
    // this.data?.lstCtietDchinh.forEach(item => {
    //   this.lstDchinh.push({
    //     ...item,
    //     bcheGiao2021: divMoney(item.bcheGiao2021, this.maDviTien),
    //     bcheChuaTuyen: divMoney(item.bcheChuaTuyen, this.maDviTien),
    //     ldongHdong: divMoney(item.ldongHdong, this.maDviTien),
    //     hslPcapTso: divMoney(item.hslPcapTso, this.maDviTien),
    //     hslPcapHsl: divMoney(item.hslPcapHsl, this.maDviTien),
    //     hslPcapTong: divMoney(item.hslPcapTong, this.maDviTien),
    //     hslPcapChucVu: divMoney(item.hslPcapChucVu, this.maDviTien),
    //     hslPcapTnhiem: divMoney(item.hslPcapTnhiem, this.maDviTien),
    //     hslPcapTnienVkhung: divMoney(item.hslPcapTnienVkhung, this.maDviTien),
    //     hslPcapHsbl: divMoney(item.hslPcapHsbl, this.maDviTien),
    //     hslPcapCongVu: divMoney(item.hslPcapCongVu, this.maDviTien),
    //     hslPcapTnien: divMoney(item.hslPcapTnien, this.maDviTien),
    //     hslPcapUdai: divMoney(item.hslPcapUdai, this.maDviTien),
    //     hslPcapKvuc: divMoney(item.hslPcapKvuc, this.maDviTien),
    //     hslPcapKhac: divMoney(item.hslPcapKhac, this.maDviTien),
    //     tqtlPcapTso: divMoney(item.tqtlPcapTso, this.maDviTien),
    //     tqtlPcapTluong: divMoney(item.tqtlPcapTluong, this.maDviTien),
    //     tqtlPcapTong: divMoney(item.tqtlPcapTong, this.maDviTien),
    //     tqtlPcapChucVu: divMoney(item.tqtlPcapChucVu, this.maDviTien),
    //     tqtlPcapTniem: divMoney(item.tqtlPcapTniem, this.maDviTien),
    //     tqtlPcapTnienVkhung: divMoney(item.tqtlPcapTnienVkhung, this.maDviTien),
    //     tqtlPcapHsbl: divMoney(item.tqtlPcapHsbl, this.maDviTien),
    //     tqtlPcapCongVu: divMoney(item.tqtlPcapCongVu, this.maDviTien),
    //     tqtlPcapTnien: divMoney(item.tqtlPcapTnien, this.maDviTien),
    //     tqtlPcapUdai: divMoney(item.tqtlPcapUdai, this.maDviTien),
    //     tqtlPcapKvuc: divMoney(item.tqtlPcapKvuc, this.maDviTien),
    //     tqtlPcapKhac: divMoney(item.tqtlPcapKhac, this.maDviTien),
    //     tongNcauTluong: divMoney(item.tongNcauTluong, this.maDviTien),
    //     baoGomTluongBche: divMoney(item.baoGomTluongBche, this.maDviTien),
    //     baoGomKhoanDgop: divMoney(item.baoGomKhoanDgop, this.maDviTien),
    //     baoGomLuongCbcc: divMoney(item.baoGomLuongCbcc, this.maDviTien),
    //   })
    // })
    // this.updateEditCache();
    // this.danhMucService.dMNoiDung().toPromise().then(
    //     (res) => {
    //         if (res.statusCode == 0) {
    //             this.matHangs = res.data?.content;
    //         } else {
    //             this.notification.error(MESSAGE.ERROR, res?.msg);
    //         }
    //     },
    //     (err) => {
    //         this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    //     },
    // );
    //get danh muc dự án
    // this.danhMucService.dMLoaiChi().toPromise().then(
    //     (data) => {
    //         if (data.statusCode == 0) {
    //             this.nhomChis = data.data?.content;
    //         } else {
    //             this.notification.error(MESSAGE.ERROR, data?.msg);
    //         }
    //     },
    //     (err) => {
    //         this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    //     }
    // );
    //lay danh sach danh muc don vi
    // await this.danhMucService.dMDonVi().toPromise().then(
    //   (data) => {
    //       if (data.statusCode == 0) {
    //           this.donVis = data.data;
    //           // this.maCucDtnnKvucs = this.donVis.filter(item => item.capDvi === '2')
    //           // console.log(this.maCucDtnnKvucs);

    //       } else {
    //           this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    //       }
    //   },
    //   (err) => {
    //       this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    //   }
    // );
    this.getStatusButton();
    this.spinner.hide();
  }

  //upload file
  async uploadFile(file: File) {
    // day file len server
    const upfile: FormData = new FormData();
    upfile.append('file', file);
    upfile.append('folder', this.maBieuMau + '/' + this.namHienHanh);
    const temp = await this.quanLyVonPhiService.uploadFile(upfile).toPromise().then(
      (data) => {
        const objfile = {
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
    this.lstFiles = this.lstFiles.filter((a: any) => a.id !== id);
    this.listFile = this.listFile.filter((a: any) => a?.lastModified.toString() !== id);
    this.listIdFilesDelete.push(id);
  }

  //download file về máy tính
  async downloadFile(id: string) {
    const file: File = this.listFile.find(element => element?.lastModified.toString() == id);
    if (!file) {
      const fileAttach = this.lstFiles.find(element => element?.id == id);
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

  getStatusButton() {
    if (this.data?.statusBtnOk && (this.trangThaiPhuLuc == "2" || this.trangThaiPhuLuc == "5")) {
      this.statusBtnOk = false;
    } else {
      this.statusBtnOk = true;
    }
  }

  // chuc nang check role
  async onSubmit(mcn: string, lyDoTuChoi: string) {
    if (this.id) {
      const requestGroupButtons = {
        id: this.id,
        trangThai: mcn,
        lyDoTuChoi: lyDoTuChoi,
      };
      this.spinner.show();
      await this.quanLyVonPhiService.approveDieuChinhPheDuyet(requestGroupButtons).toPromise().then(async (data) => {
        if (data.statusCode == 0) {
          this.trangThaiPhuLuc = mcn;
          this.getStatusButton();
          const obj = {
            trangThai: mcn,
            lyDoTuChoi: lyDoTuChoi,
          }
          this.dataChange.emit(obj);
          // if (mcn == Utils.TT_BC_8 || mcn == Utils.TT_BC_5 || mcn == Utils.TT_BC_3) {
          // 	this.notification.success(MESSAGE.SUCCESS, MESSAGE.REVERT_SUCCESS);
          // } else {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.APPROVE_SUCCESS);
          // }
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

  //show popup tu choi
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

  // // them dong moi
  // addLine(id: number): void {
  //     let item: ItemData = {
  //         id: uuid.v4(),
  //         stt: 0,
  //         maDvi: '',
  //         bcheGiao2021: 0,
  //         bcheChuaTuyen: 0,
  //         ldongHdong: 0,
  //         hslPcapTso: 0,
  //         hslPcapHsl: 0,
  //         hslPcapTong: 0,
  //         hslPcapChucVu: 0,
  //         hslPcapTnhiem: 0,
  //         hslPcapTnienVkhung: 0,
  //         hslPcapHsbl: 0,
  //         hslPcapCongVu: 0,
  //         hslPcapTnien: 0,
  //         hslPcapUdai: 0,
  //         hslPcapKvuc: 0,
  //         hslPcapKhac: 0,
  //         tqtlPcapTso: 0,
  //         tqtlPcapTluong: 0,
  //         tqtlPcapTong: 0,
  //         tqtlPcapChucVu: 0,
  //         tqtlPcapTniem: 0,
  //         tqtlPcapTnienVkhung: 0,
  //         tqtlPcapHsbl: 0,
  //         tqtlPcapCongVu: 0,
  //         tqtlPcapTnien: 0,
  //         tqtlPcapUdai: 0,
  //         tqtlPcapKvuc: 0,
  //         tqtlPcapKhac: 0,
  //         tongNcauTluong: 0,
  //         baoGomTluongBche: 0,
  //         baoGomKhoanDgop: 0,
  //         baoGomLuongCbcc: 0,
  //         checked: false,
  //     };

  //     this.lstDchinh.splice(id, 0, item);
  //     this.editCache[item.id] = {
  //         edit: true,
  //         data: { ...item }
  //     };
  // }

  // // xoa dong
  // deleteById(id: any): void {
  //     this.lstDchinh = this.lstDchinh.filter(item => item.id != id)
  //     if (typeof id == "number") {
  //         this.listIdDelete += id + ","
  //     }
  // }

  // // xóa với checkbox
  // deleteSelected() {
  //     // add list delete id
  //     this.lstDchinh.filter(item => {
  //         if (item.checked == true && typeof item.id == "number") {
  //             this.listIdDelete += item.id + ","
  //         }
  //     })
  //     // delete object have checked = true
  //     this.lstDchinh = this.lstDchinh.filter(item => item.checked != true)
  //     this.allChecked = false;
  // }

  // updateAllChecked(): void {
  //     if (this.allChecked) {
  //         this.lstDchinh = this.lstDchinh.map(item => ({
  //             ...item,
  //             checked: true
  //         }));
  //     } else {
  //         this.lstDchinh = this.lstDchinh.map(item => ({
  //             ...item,
  //             checked: false
  //         }));
  //     }
  // }

  // updateSingleChecked(): void {
  //     if (this.lstDchinh.every(item => !item.checked)) {
  //         this.allChecked = false;
  //     } else if (this.lstDchinh.every(item => item.checked)) {
  //         this.allChecked = true;
  //     }
  // }

  // redirectChiTieuKeHoachNam() {
  //     // this.router.navigate(['/qlkh-von-phi/quan-ly-lap-tham-dinh-du-toan-nsnn/tim-kiem']);
  //     this.location.back()
  // }

  // startEdit(id: string): void {
  //     this.editCache[id].edit = true;
  // }

  // cancelEdit(id: string): void {
  //     const index = this.lstDchinh.findIndex(item => item.id === id);
  //     // if (!this.lstDchinh[index].maCucDtnnKvuc) {
  //     //     this.deleteById(id);
  //     //     return;
  //     // }
  //     this.editCache[id] = {
  //         data: { ...this.lstDchinh[index] },
  //         edit: false
  //     };
  // }

  //update khi sửa
  // saveEdit(id: string): void {
  //     // if (!this.editCache[id].data.maNdung || !this.editCache[id].data.maNhomChiNsnn
  //     //     || (!this.editCache[id].data.dtoanN && this.editCache[id].data.dtoanN !== 0)
  //     //     || (!this.editCache[id].data.uocThienN && this.editCache[id].data.uocThienN !== 0)
  //     //     || (!this.editCache[id].data.ncauChiN1 && this.editCache[id].data.ncauChiN1 !== 0)
  //     //     || (!this.editCache[id].data.ncauChiN2 && this.editCache[id].data.ncauChiN2 !== 0)) {
  //     //     this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
  //     //     return;
  //     // }
  //     // this.changeModel(id);
  //     this.editCache[id].data.checked = this.lstDchinh.find(
  //         (item) => item.id === id,
  //     ).checked; // set checked editCache = checked lstDchinh
  //     const index = this.lstDchinh.findIndex((item) => item.id === id); // lay vi tri hang minh sua
  //     Object.assign(this.lstDchinh[index], this.editCache[id].data); // set lai data cua lstDchinh[index] = this.editCache[id].data
  //     this.editCache[id].edit = false; // CHUYEN VE DANG TEXT
  // }

  // gan editCache.data == lstDchinh
  // updateEditCache(): void {
  //     this.lstDchinh.forEach(item => {
  //         this.editCache[item.id] = {
  //             edit: false,
  //             data: { ...item }
  //         };
  //     });
  // }

  //gia tri cac o input thay doi thi tinh toan lai
  // changeModel(id: string): void {
  //     this.editCache[id].data.clechTranChiVsNcauChiN1 = this.editCache[id].data.tranChiN1 - this.editCache[id].data.ncauChiN1;
  //     this.editCache[id].data.ssanhNcauNVoiN1 = Number((this.editCache[id].data.ncauChiN1 / this.editCache[id].data.uocThienN).toFixed(3));
  //     this.editCache[id].data.clechTranChiVsNcauChiN2 = this.editCache[id].data.tranChiN2 - this.editCache[id].data.ncauChiN2;
  //     this.editCache[id].data.clechTranChiVsNcauChiN3 = this.editCache[id].data.tranChiN3 - this.editCache[id].data.ncauChiN3;
  // }

  // luu
  async save(trangThai: string) {

    // let checkSaveEdit;
    // if (!this.maDviTien) {
    //   this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTSAVE);
    //   return;
    // }
    // //check xem tat ca cac dong du lieu da luu chua?
    // //chua luu thi bao loi, luu roi thi cho di
    // this.lstDchinh.forEach(element => {
    //   if (this.editCache[element.id].edit === true) {
    //     checkSaveEdit = false
    //   }
    // });
    // if (checkSaveEdit == false) {
    //   this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTSAVE);
    //   return;
    // }
    // //tinh lai don vi tien va kiem tra gioi han cua chung
    // let lstCtietBcaoTemp: any = [];
    // let checkMoneyRange = true;
    // this.lstDchinh.forEach(item => {
    //   let bcheGiao2021 = mulMoney(item.bcheGiao2021, this.maDviTien)
    //   let bcheChuaTuyen = mulMoney(item.bcheChuaTuyen, this.maDviTien)
    //   let ldongHdong = mulMoney(item.ldongHdong, this.maDviTien)
    //   let hslPcapTso = mulMoney(item.hslPcapTso, this.maDviTien)
    //   let hslPcapHsl = mulMoney(item.hslPcapHsl, this.maDviTien)
    //   let hslPcapTong = mulMoney(item.hslPcapTong, this.maDviTien)
    //   let hslPcapChucVu = mulMoney(item.hslPcapChucVu, this.maDviTien)
    //   let hslPcapTnhiem = mulMoney(item.hslPcapTnhiem, this.maDviTien)
    //   let hslPcapTnienVkhung = mulMoney(item.hslPcapTnienVkhung, this.maDviTien)
    //   let hslPcapHsbl = mulMoney(item.hslPcapHsbl, this.maDviTien)
    //   let hslPcapCongVu = mulMoney(item.hslPcapCongVu, this.maDviTien)
    //   let hslPcapTnien = mulMoney(item.hslPcapTnien, this.maDviTien)
    //   let hslPcapUdai = mulMoney(item.hslPcapUdai, this.maDviTien)
    //   let hslPcapKvuc = mulMoney(item.hslPcapKvuc, this.maDviTien)
    //   let hslPcapKhac = mulMoney(item.hslPcapKhac, this.maDviTien)
    //   let tqtlPcapTso = mulMoney(item.tqtlPcapTso, this.maDviTien)
    //   let tqtlPcapTluong = mulMoney(item.tqtlPcapTluong, this.maDviTien)
    //   let tqtlPcapTong = mulMoney(item.tqtlPcapTong, this.maDviTien)
    //   let tqtlPcapChucVu = mulMoney(item.tqtlPcapChucVu, this.maDviTien)
    //   let tqtlPcapTniem = mulMoney(item.tqtlPcapTniem, this.maDviTien)
    //   let tqtlPcapTnienVkhung = mulMoney(item.tqtlPcapTnienVkhung, this.maDviTien)
    //   let tqtlPcapHsbl = mulMoney(item.tqtlPcapHsbl, this.maDviTien)
    //   let tqtlPcapCongVu = mulMoney(item.tqtlPcapCongVu, this.maDviTien)
    //   let tqtlPcapTnien = mulMoney(item.tqtlPcapTnien, this.maDviTien)
    //   let tqtlPcapUdai = mulMoney(item.tqtlPcapUdai, this.maDviTien)
    //   let tqtlPcapKvuc = mulMoney(item.tqtlPcapKvuc, this.maDviTien)
    //   let tqtlPcapKhac = mulMoney(item.tqtlPcapKhac, this.maDviTien)
    //   let tongNcauTluong = mulMoney(item.tongNcauTluong, this.maDviTien)
    //   let baoGomTluongBche = mulMoney(item.baoGomTluongBche, this.maDviTien)
    //   let baoGomKhoanDgop = mulMoney(item.baoGomKhoanDgop, this.maDviTien)
    //   let baoGomLuongCbcc = mulMoney(item.baoGomLuongCbcc, this.maDviTien)
    //   if (
    //     (
    //       bcheGiao2021 > MONEY_LIMIT ||
    //       bcheChuaTuyen > MONEY_LIMIT ||
    //       ldongHdong > MONEY_LIMIT ||
    //       hslPcapTso > MONEY_LIMIT ||
    //       hslPcapHsl > MONEY_LIMIT ||
    //       hslPcapTong > MONEY_LIMIT ||
    //       hslPcapChucVu > MONEY_LIMIT ||
    //       hslPcapTnhiem > MONEY_LIMIT ||
    //       hslPcapTnienVkhung > MONEY_LIMIT ||
    //       hslPcapHsbl > MONEY_LIMIT ||
    //       hslPcapCongVu > MONEY_LIMIT ||
    //       hslPcapTnien > MONEY_LIMIT ||
    //       hslPcapUdai > MONEY_LIMIT ||
    //       hslPcapKvuc > MONEY_LIMIT ||
    //       hslPcapKhac > MONEY_LIMIT ||
    //       tqtlPcapTso > MONEY_LIMIT ||
    //       tqtlPcapTluong > MONEY_LIMIT ||
    //       tqtlPcapTong > MONEY_LIMIT ||
    //       tqtlPcapChucVu > MONEY_LIMIT ||
    //       tqtlPcapTniem > MONEY_LIMIT ||
    //       tqtlPcapTnienVkhung > MONEY_LIMIT ||
    //       tqtlPcapHsbl > MONEY_LIMIT ||
    //       tqtlPcapCongVu > MONEY_LIMIT ||
    //       tqtlPcapTnien > MONEY_LIMIT ||
    //       tqtlPcapUdai > MONEY_LIMIT ||
    //       tqtlPcapKvuc > MONEY_LIMIT ||
    //       tqtlPcapKhac > MONEY_LIMIT ||
    //       tongNcauTluong > MONEY_LIMIT ||
    //       baoGomTluongBche > MONEY_LIMIT ||
    //       baoGomKhoanDgop > MONEY_LIMIT ||
    //       baoGomLuongCbcc > MONEY_LIMIT
    //     )
    //   ) {
    //     checkMoneyRange = false;
    //     return;
    //   }
    //   lstCtietBcaoTemp.push({
    //     ...item,
    //     bcheGiao2021: bcheGiao2021,
    //     bcheChuaTuyen: bcheChuaTuyen,
    //     ldongHdong: ldongHdong,
    //     hslPcapTso: hslPcapTso,
    //     hslPcapHsl: hslPcapHsl,
    //     hslPcapTong: hslPcapTong,
    //     hslPcapChucVu: hslPcapChucVu,
    //     hslPcapTnhiem: hslPcapTnhiem,
    //     hslPcapTnienVkhung: hslPcapTnienVkhung,
    //     hslPcapHsbl: hslPcapHsbl,
    //     hslPcapCongVu: hslPcapCongVu,
    //     hslPcapTnien: hslPcapTnien,
    //     hslPcapUdai: hslPcapUdai,
    //     hslPcapKvuc: hslPcapKvuc,
    //     hslPcapKhac: hslPcapKhac,
    //     tqtlPcapTso: tqtlPcapTso,
    //     tqtlPcapTluong: tqtlPcapTluong,
    //     tqtlPcapTong: tqtlPcapTong,
    //     tqtlPcapChucVu: tqtlPcapChucVu,
    //     tqtlPcapTniem: tqtlPcapTniem,
    //     tqtlPcapTnienVkhung: tqtlPcapTnienVkhung,
    //     tqtlPcapHsbl: tqtlPcapHsbl,
    //     tqtlPcapCongVu: tqtlPcapCongVu,
    //     tqtlPcapTnien: tqtlPcapTnien,
    //     tqtlPcapUdai: tqtlPcapUdai,
    //     tqtlPcapKvuc: tqtlPcapKvuc,
    //     tqtlPcapKhac: tqtlPcapKhac,
    //     tongNcauTluong: tongNcauTluong,
    //     baoGomTluongBche: baoGomTluongBche,
    //     baoGomKhoanDgop: baoGomKhoanDgop,
    //     baoGomLuongCbcc: baoGomLuongCbcc,
    //   })
    // })

    // if (!checkMoneyRange == true) {
    //   this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.MONEYRANGE);
    //   return;
    // }
    // // replace nhung ban ghi dc them moi id thanh null
    // lstCtietBcaoTemp.forEach(item => {
    //   if (item.id?.length == 38) {
    //     item.id = null;
    //   }
    // })

    //get list file url
    const listFile: any = [];
    for (const iterator of this.listFile) {
      listFile.push(await this.uploadFile(iterator));
    }
    const request = {
      id: this.id,
      // lstCtietDchinh: lstCtietBcaoTemp,
      maBieuMau: this.maBieuMau,
      // maDviTien: this.maDviTien,
      giaoCho: this.data?.giaoCho,
      lyDoTuChoi: this.data?.lyDoTuChoi,
      thuyetMinh: this.thuyetMinh,
      trangThai: trangThai,
      maLoai: this.data?.maLoai,
      fileData: this.lstFiles,
      listIdFiles: this.listIdFilesDelete,                      // id file luc get chi tiet tra ra( de backend phuc vu xoa file)
    };
    this.quanLyVonPhiService.updatePLDieuChinh(request).toPromise().then(
      async data => {
        if (data.statusCode == 0) {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
          const obj = {
            trangThai: '-1',
            lyDoTuChoi: null,
          };
          this.dataChange.emit(obj);
        } else {
          this.notification.error(MESSAGE.ERROR, data?.msg);
        }
      },
      err => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      },
    );
    this.spinner.hide();
  }
}
