import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import * as fileSaver from 'file-saver';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import * as uuid from "uuid";
import { DanhMucHDVService } from '../../../../../services/danhMucHDV.service';
import { Utils } from "../../../../../Utility/utils";
import { MESSAGE } from '../../../../../constants/message';

export class ItemDataPL2 {
  maNdung: string;
  dtoanSdungNamTcong: number;
  dtoanSdungNamNguonNsnn: number;
  dtoanSdungNamNguonSn: number;
  dtoanSdungNamNguonQuy: number;
  giaiNganThangTcong: number;
  giaiNganThangTcongTle: number;
  giaiNganThangNguonNsnn: number;
  giaiNganThangNguonNsnnTle: number;
  giaiNganThangNguonSn: number;
  giaiNganThangNguonSnTle: number;
  giaiNganThangNguonQuy: number;
  giaiNganThangNguonQuyTle: number;
  luyKeGiaiNganTcong: number;
  luyKeGiaiNganTcongTle: number;
  luyKeGiaiNganNguonNsnn: number;
  luyKeGiaiNganNguonNsnnTle: number;
  luyKeGiaiNganNguonSn: number;
  luyKeGiaiNganNguonSnTle: number;
  luyKeGiaiNganNguonQuy: number;
  luyKeGiaiNganNguonQuyTle: number;
  id!: any;
  maBcao!: String;
  stt!: String;
  checked!:boolean;
}

export class ItemDataPL3 {
  maDan: string;
  ddiemXdung: string;
  qddtSoQdinh: string;
  qddtTmdtTso: number;
  qddtTmdtNsnn: number;
  luyKeVonTso: number;
  luyKeVonNsnn: number;
  luyKeGiaiNganHetNamTso: number;
  luyKeGiaiNganHetNamNsnnTso: number;
  luyKeGiaiNganHetNamNsnnKhNamTruoc: number;
  khoachVonDtu: number;
  khoachTso: number;
  khoachNsnn: number;
  kluongThien: number;
  giaiNganTso: number;
  giaiNganTsoTle: number;
  giaiNganNsnn: number;
  giaiNganNsnnTle: number;
  luyKeGiaiNganDauNamNsnnTso: number;
  luyKeGiaiNganDauNamNsnnTsoTle: number;
  luyKeGiaiNganDauNamNsnnNsnn: number;
  luyKeGiaiNganDauNamNsnnNsnnTle: number;
  ndungCviecHthanhCuoiThang: string;
  ndungCviecDangThien: string;
  khoachThienNdungCviecThangConLaiNam: string;
  ghiChu: string;
  id!: any;
  maBcao!: String;
  stt!: String;
  checked!:boolean;
}

@Component({
  selector: 'app-ds-chi-tiet-nhap-lieu-bao-cao',
  templateUrl: './ds-chi-tiet-nhap-lieu-bao-cao.component.html',
  styleUrls: ['./ds-chi-tiet-nhap-lieu-bao-cao.component.scss']
})

export class DsChiTietNhapLieuBaoCaoComponent implements OnInit {
  userInfo: any;
  errorMessage!: String;                      //
  noiDungs: any = [];                         // danh muc noi dung
  nhomChis:any = [];                          // danh muc nhom chi
  loaiChis:any = [];                          // danh muc loai chi
  donVis:any = [];                            // danh muc don vi
  donViTiens:any = [];                        // danh muc don vi tien
  maDans: any=[];
  ddiemXdungs: any=[];

  lstCTietBCaoPL2: ItemDataPL2[] = [];        // list chi tiet bao cao
  lstCTietBCaoPL3: ItemDataPL3[] = [];        // list chi tiet bao cao
  id!: any;                                   // id truyen tu router
  chiTietBcaos: any;                          // thong tin chi tiet bao cao
  lstFile: any = [];                          // list File de day vao api
  status: boolean = false;                    // trang thai an/ hien cua trang thai
  namBcao = new Date().getFullYear();         // nam bao cao
  userName: any;                              // ten nguoi dang nhap
  ngayNhap!: any;                             // ngay nhap
  nguoiNhap!: string;                         // nguoi nhap
  maDonViTao!: any;                           // ma don vi tao
  maBaoCao!: string;                          // ma bao cao
  namBaoCaoHienHanh!: any;                    // nam bao cao hien hanh
  trangThaiBanGhi: string = "1";              // trang thai cua ban ghi
  maLoaiBaoCao: string = "26";                // nam bao cao
  maDviTien: string = "01";                   // ma don vi tien
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
  editCachePL2: { [key: string]: { edit: boolean; data: ItemDataPL2 } } = {};     // phuc vu nut chinh
  editCachePL3: { [key: string]: { edit: boolean; data: ItemDataPL3 } } = {};     // phuc vu nut chinh

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
              private danhMucService: DanhMucHDVService,
              private userService: UserService,
              private notification: NzNotificationService,
              ) {
                this.ngayNhap = this.datePipe.transform(this.newDate, 'dd-MM-yyyy',)
              }


  async ngOnInit() {
    this.id = this.routerActive.snapshot.paramMap.get('id');
    let userName = this.userService.getUserName();
    let userInfo: any = await this.getUserInfo(userName); //get user info
    if (this.id) {
      await this.getDetailReport();
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
          this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
        }
      );
      this.maBaoCao = '';
      this.namBaoCaoHienHanh = new Date().getFullYear();
    }
    const utils = new Utils();
    this.statusBtnDel = utils.getRoleDel(this.trangThaiBanGhi, 2, userInfo?.roles[0]?.id);
    this.statusBtnSave = utils.getRoleSave(this.trangThaiBanGhi, 2, userInfo?.roles[0]?.id);
    this.statusBtnApprove = utils.getRoleApprove(this.trangThaiBanGhi, 2, userInfo?.roles[0]?.id);
    this.statusBtnTBP = utils.getRoleTBP(this.trangThaiBanGhi, 2, userInfo?.roles[0]?.id);
    this.statusBtnLD = utils.getRoleLD(this.trangThaiBanGhi, 2, userInfo?.roles[0]?.id);
    this.statusBtnGuiDVCT = utils.getRoleGuiDVCT(this.trangThaiBanGhi, 2, userInfo?.roles[0]?.id);
    this.statusBtnDVCT = utils.getRoleDVCT(this.trangThaiBanGhi, 2, userInfo?.roles[0]?.id);
    //get danh muc noi dung
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
    this.danhMucService.dMKhoiDuAn().toPromise().then(
      (data) => {
        if (data.statusCode == 0) {
          this.maDans = data.data?.content;
        } else {
          this.notification.error(MESSAGE.ERROR, data?.msg);
        }
      },
      (err) => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
      }
    );
    this.danhMucService.dMDiaDiemXayDung().toPromise().then(
      (data) => {
        if (data.statusCode == 0) {
          this.ddiemXdungs = data.data?.content;
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
        } else {
          this.notification.error(MESSAGE.ERROR, data?.msg);
        }
      },
      (err) => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
      }
    );

    //lay danh sach danh muc don vi tien
    this.danhMucService.dMDonViTien().toPromise().then(
      (data) => {
        if (data.statusCode == 0) {
          this.donViTiens = data.data?.content;
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
    let userInfo = await this.userService.getUserInfo(username).toPromise().then(
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
    this.lstCTietBCaoPL2 = [];
    this.lstCTietBCaoPL3 = [];
    this.lstFile = [];
    this.listFile = []
  }

  // luu
  async luu() {
    let listFile: any = [];
    for (const iterator of this.listFile) {
      listFile.push(await this.uploadFile(iterator));
    }

    // replace nhung ban ghi dc them moi id thanh null phu luc 2
    this.lstCTietBCaoPL2.filter(item => {
      if (typeof item.id != "number") {
        item.id = null;
      }
    })

    // replace nhung ban ghi dc them moi id thanh null phu luc 3
    this.lstCTietBCaoPL3.filter(item => {
      if (typeof item.id != "number") {
        item.id = null;
      }
    })

    // gui du lieu trinh duyet len server
    let request = {
      id: this.id,
      fileDinhKems: listFile,
      listIdFiles: this.listIdFiles,                      // id file luc get chi tiet tra ra( de backend phuc vu xoa file)
      lstCTietBCao: this.lstCTietBCaoPL2,
      // lstCTietBCao: this.lstCTietBCaoPL3,
      maBcao: this.maBaoCao,
      maDvi: this.maDonViTao,
      maDviTien: this.maDviTien,
      maLoaiBcao: this.maLoaiBaoCao,
      namHienHanh: this.namBaoCaoHienHanh,
      namBcao: this.namBaoCaoHienHanh,
    };

    //call service them moi
    this.spinner.show();
    if (this.id == null) {
      this.quanLyVonPhiService.trinhDuyetService(request).subscribe(
        data => {
          if (data.statusCode == 0) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.SUCCESS);
          } else {
            this.notification.error(MESSAGE.ERROR, data?.msg);
          }
        },
        err => {
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
          console.log(err);
        },
      );
    } else {
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
    this.lstCTietBCaoPL2.filter(item => {
      if (!item.id) {
        item.id = uuid.v4();
      }
    });
    this.lstCTietBCaoPL3.filter(item => {
      if (!item.id) {
        item.id = uuid.v4();
      }
    });
    this.updateEditCachePL2();
    this.updateEditCachePL3();
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
        this.notification.success(MESSAGE.SUCCESS, MESSAGE.SUCCESS);
      }else{
        this.notification.error(MESSAGE.ERROR, data?.msg);
      }
    },err => {
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    });
    this.spinner.hide();
  }

  //thay doi trang thai
  changeStatus(status: boolean) {
    this.status = status;
  }

  // call chi tiet bao cao
  async getDetailReport() {
    this.spinner.show();
    await this.quanLyVonPhiService.bCChiTiet(this.id).toPromise().then(
      (data) => {
        if (data.statusCode == 0) {
          this.chiTietBcaos = data.data;
          this.lstCTietBCaoPL2 = data.data.lstCTietBCao;
          this.lstCTietBCaoPL3 = data.data.lstCTietBCao;
          this.updateEditCachePL2();
          this.updateEditCachePL3();
          this.lstFile = data.data.lstFile;

          // set thong tin chung bao cao
          this.ngayNhap = data.data.ngayTao;
          this.nguoiNhap = data.data.nguoiTao;
          this.maDonViTao = data.data.maDvi;
          this.maBaoCao = data.data.maBcao;
          this.namBaoCaoHienHanh = data.data.namBcao;
          this.trangThaiBanGhi = data.data.trangThai;

          // set list id file ban dau
          this.lstFile.filter(item => {
            this.listIdFiles += item.id + ",";
          })

          if (this.trangThaiBanGhi == '1' || this.trangThaiBanGhi == '3' || this.trangThaiBanGhi == '5' || this.trangThaiBanGhi == '8') {
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

  // them dong moi phu luc 2
  addLinePL2(id: number): void {
    let item : ItemDataPL2 = {
      maNdung:"",
      dtoanSdungNamTcong: 0,
      dtoanSdungNamNguonNsnn: 0,
      dtoanSdungNamNguonSn: 0,
      dtoanSdungNamNguonQuy: 0,
      giaiNganThangTcong: 0,
      giaiNganThangTcongTle: 0,
      giaiNganThangNguonNsnn: 0,
      giaiNganThangNguonNsnnTle: 0,
      giaiNganThangNguonSn: 0,
      giaiNganThangNguonSnTle: 0,
      giaiNganThangNguonQuy: 0,
      giaiNganThangNguonQuyTle: 0,
      luyKeGiaiNganTcong: 0,
      luyKeGiaiNganTcongTle: 0,
      luyKeGiaiNganNguonNsnn: 0,
      luyKeGiaiNganNguonNsnnTle: 0,
      luyKeGiaiNganNguonSn: 0,
      luyKeGiaiNganNguonSnTle: 0,
      luyKeGiaiNganNguonQuy: 0,
      luyKeGiaiNganNguonQuyTle: 0,
      maBcao: "",
      stt: "",
      id: uuid.v4(),
      checked:false,
    }

    this.lstCTietBCaoPL2.splice(id, 0, item);
    this.editCachePL2[item.id] = {
      edit: true,
      data: { ...item }
    };
  }
  // them dong moi phu luc 2
  addLinePL3(id: number): void {
    let item : ItemDataPL3 = {
      maDan: "",
      ddiemXdung: "",
      qddtSoQdinh: "",
      qddtTmdtTso: 0,
      qddtTmdtNsnn: 0,
      luyKeVonTso: 0,
      luyKeVonNsnn: 0,
      luyKeGiaiNganHetNamTso: 0,
      luyKeGiaiNganHetNamNsnnTso: 0,
      luyKeGiaiNganHetNamNsnnKhNamTruoc: 0,
      khoachVonDtu: 0,
      khoachTso: 0,
      khoachNsnn: 0,
      kluongThien: 0,
      giaiNganTso: 0,
      giaiNganTsoTle: 0,
      giaiNganNsnn: 0,
      giaiNganNsnnTle: 0,
      luyKeGiaiNganDauNamNsnnTso: 0,
      luyKeGiaiNganDauNamNsnnTsoTle: 0,
      luyKeGiaiNganDauNamNsnnNsnn: 0,
      luyKeGiaiNganDauNamNsnnNsnnTle: 0,
      ndungCviecHthanhCuoiThang: "",
      ndungCviecDangThien: "",
      khoachThienNdungCviecThangConLaiNam: "",
      ghiChu: "",
      maBcao: "",
      stt: "",
      id: uuid.v4(),
      checked:false,
    }

    this.lstCTietBCaoPL3.splice(id, 0, item);
    this.editCachePL3[item.id] = {
      edit: true,
      data: { ...item }
    };
  }

  // xoa dong phu luc 2
  deleteByIdPL2(id: any): void {
    this.lstCTietBCaoPL2 = this.lstCTietBCaoPL2.filter(item => item.id != id)
    if (typeof id == "number") {
      this.listIdDelete += id + ",";
    }
  }
  // xoa dong phu luc 3
  deleteByIdPL3(id: any): void {
    this.lstCTietBCaoPL3 = this.lstCTietBCaoPL3.filter(item => item.id != id)
    if (typeof id == "number") {
      this.listIdDelete += id + ",";
    }
  }

  // xóa với checkbox phu luc 2
  deleteSelectedPL2() {
    // add list delete id
    this.lstCTietBCaoPL2.filter(item => {
      if(item.checked == true && typeof item.id == "number"){
        this.listIdDelete += item.id + ","
      }
    })
    // delete object have checked = true
    this.lstCTietBCaoPL2 = this.lstCTietBCaoPL2.filter(item => item.checked != true )
    this.allChecked = false;
  }
  // xóa với checkbox phu luc 3
  deleteSelectedPL3() {
    // add list delete id
    this.lstCTietBCaoPL3.filter(item => {
      if(item.checked == true && typeof item.id == "number"){
        this.listIdDelete += item.id + ","
      }
    })
    // delete object have checked = true
    this.lstCTietBCaoPL3 = this.lstCTietBCaoPL3.filter(item => item.checked != true )
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

  // click o checkbox all phu luc 2
  updateAllCheckedPL2(): void {
    this.indeterminate = false;                               // thuoc tinh su kien o checkbox all
    if (this.allChecked) {                                    // checkboxall == true thi set lai lstCTietBCao.checked = true
      this.lstCTietBCaoPL2 = this.lstCTietBCaoPL2.map(item => ({
        ...item,
        checked: true
      }));
    } else {
      this.lstCTietBCaoPL2 = this.lstCTietBCaoPL2.map(item => ({    // checkboxall == false thi set lai lstCTietBCao.checked = false
        ...item,
        checked: false
      }));
    }
  }
  // click o checkbox all phu luc 3
  updateAllCheckedPL3(): void {
    this.indeterminate = false;                               // thuoc tinh su kien o checkbox all
    if (this.allChecked) {                                    // checkboxall == true thi set lai lstCTietBCao.checked = true
      this.lstCTietBCaoPL3 = this.lstCTietBCaoPL3.map(item => ({
        ...item,
        checked: true
      }));
    } else {
      this.lstCTietBCaoPL3 = this.lstCTietBCaoPL3.map(item => ({    // checkboxall == false thi set lai lstCTietBCao.checked = false
        ...item,
        checked: false
      }));
    }
  }

  // click o checkbox single phu luc 2
  updateSingleCheckedPL2(): void {
    if (this.lstCTietBCaoPL2.every(item => !item.checked)) {           // tat ca o checkbox deu = false thi set o checkbox all = false
      this.allChecked = false;
      this.indeterminate = false;
    } else if (this.lstCTietBCaoPL2.every(item => item.checked)) {     // tat ca o checkbox deu = true thi set o checkbox all = true
      this.allChecked = true;
      this.indeterminate = false;
    } else {                                                        // o checkbox vua = false, vua = true thi set o checkbox all = indeterminate
      this.indeterminate = true;
    }
  }
  // click o checkbox single phu luc 3
  updateSingleCheckedPL3(): void {
    if (this.lstCTietBCaoPL3.every(item => !item.checked)) {           // tat ca o checkbox deu = false thi set o checkbox all = false
      this.allChecked = false;
      this.indeterminate = false;
    } else if (this.lstCTietBCaoPL3.every(item => item.checked)) {     // tat ca o checkbox deu = true thi set o checkbox all = true
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
  getStatusName(){
    const utils = new Utils();
    return utils.getStatusName(this.trangThaiBanGhi);
  }

  // lay ten don vi tao
  getUnitName(){
    return this.donVis.find(item => item.maDvi == this.maDonViTao)?.tenDvi;
  }

  // start edit pl2
  startEditPL2(id: string): void {
    this.editCachePL2[id].edit = true;
  }
  // start edit
  startEditPL3(id: string): void {
    this.editCachePL3[id].edit = true;
  }

  // huy thay doi phu luc 2
  cancelEditPL2(id: string): void {
    const index = this.lstCTietBCaoPL2.findIndex(item => item.id === id);  // lay vi tri hang minh sua
    this.editCachePL2[id] = {
      data: { ...this.lstCTietBCaoPL2[index] },
      edit: false
    };
  }
  // huy thay doi phu luc 3
  cancelEditPL3(id: string): void {
    const index = this.lstCTietBCaoPL3.findIndex(item => item.id === id);  // lay vi tri hang minh sua
    this.editCachePL3[id] = {
      data: { ...this.lstCTietBCaoPL3[index] },
      edit: false
    };
  }

  // luu thay doi phu luc 2
  saveEditPL2(id: string): void {
    this.editCachePL2[id].data.checked = this.lstCTietBCaoPL2.find(item => item.id === id).checked; // set checked editCachePL2 = checked lstCTietBCao
    const index = this.lstCTietBCaoPL2.findIndex(item => item.id === id);   // lay vi tri hang minh sua
    Object.assign(this.lstCTietBCaoPL2[index], this.editCachePL2[id].data); // set lai data cua lstCTietBCao[index] = this.editCachePL2[id].data
    this.editCachePL2[id].edit = false;  // CHUYEN VE DANG TEXT
  }

  // luu thay doi phu luc 3
  saveEditPL3(id: string): void {
    this.editCachePL3[id].data.checked = this.lstCTietBCaoPL3.find(item => item.id === id).checked; // set checked editCachePL3 = checked lstCTietBCao
    const index = this.lstCTietBCaoPL3.findIndex(item => item.id === id);   // lay vi tri hang minh sua
    Object.assign(this.lstCTietBCaoPL3[index], this.editCachePL3[id].data); // set lai data cua lstCTietBCao[index] = this.editCachePL3[id].data
    this.editCachePL3[id].edit = false;  // CHUYEN VE DANG TEXT
  }

  // gan editCachePL2.data == lstCTietBCao phu luc 2
  updateEditCachePL2(): void {
    this.lstCTietBCaoPL2.forEach(item => {
      this.editCachePL2[item.id] = {
        edit: false,
        data: { ...item }
      };
    });
  }
  // gan editCachePL2.data == lstCTietBCao phu luc 3
  updateEditCachePL3(): void {
    this.lstCTietBCaoPL3.forEach(item => {
      this.editCachePL3[item.id] = {
        edit: false,
        data: { ...item }
      };
    });
  }

  //gia tri cac o input thay doi thi tinh toan lai
  changeModel(id: string): void {
    this.editCachePL2[id].data.dtoanSdungNamTcong = Number(this.editCachePL2[id].data.dtoanSdungNamNguonNsnn) + Number(this.editCachePL2[id].data.dtoanSdungNamNguonSn) + Number(this.editCachePL2[id].data.dtoanSdungNamNguonQuy);
    this.editCachePL2[id].data.giaiNganThangTcong = Number(this.editCachePL2[id].data.giaiNganThangNguonNsnn) + Number(this.editCachePL2[id].data.giaiNganThangNguonSn) + Number(this.editCachePL2[id].data.giaiNganThangNguonQuy);
    this.editCachePL2[id].data.luyKeGiaiNganTcong = Number(this.editCachePL2[id].data.luyKeGiaiNganNguonNsnn) + Number(this.editCachePL2[id].data.luyKeGiaiNganNguonSn) + Number(this.editCachePL2[id].data.luyKeGiaiNganNguonQuy);
  }
}
