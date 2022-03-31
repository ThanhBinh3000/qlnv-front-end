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
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

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

export class ItemDataPL1 {
  maNdung: string;
  kphiSdungTcong: number;
  kphiSdungDtoan: number;
  kphiSdungNguonKhac: number;
  kphiSdungNguonQuy: number;
  kphiSdungNstt: number;
  kphiSdungCk: number;
  kphiChuyenSangTcong: number;
  kphiChuyenSangDtoan: number;
  kphiChuyenSangNguonKhac: number;
  kphiChuyenSangNguonQuy: number;
  kphiChuyenSangNstt: number;
  kphiChuyenSangCk: number;
  dtoanGiaoTcong: number;
  dtoanGiaoDtoan: number;
  dtoanGiaoNguonKhac: number;
  dtoanGiaoNguonQuy: number;
  dtoanGiaoNstt: number;
  dtoanGiaoCk: number;
  giaiNganThangBcaoTcong: number;
  giaiNganThangBcaoTcongTle: number;
  giaiNganThangBcaoDtoan: number;
  giaiNganThangBcaoDtoanTle: number;
  giaiNganThangBcaoNguonKhac: number;
  giaiNganThangBcaoNguonKhacTle: number;
  giaiNganThangBcaoNguonQuy: number;
  giaiNganThangBcaoNguonQuyTle: number;
  giaiNganThangBcaoNstt: number;
  giaiNganThangBcaoNsttTle: number;
  giaiNganThangBcaoCk: number;
  giaiNganThangBcaoCkTle: number;
  luyKeGiaiNganTcong: number;
  luyKeGiaiNganTcongTle: number;
  luyKeGiaiNganDtoan: number;
  luyKeGiaiNganDtoanTle: number;
  luyKeGiaiNganNguonKhac: number;
  luyKeGiaiNganNguonKhacTle: number;
  luyKeGiaiNganNguonQuy: number;
  luyKeGiaiNganNguonQuyTle: number;
  luyKeGiaiNganNstt: number;
  luyKeGiaiNganNsttTle: number;
  luyKeGiaiNganCk: number;
  luyKeGiaiNganCkTle: number;
  id!: any;
  parentId!: any;
  stt!: any;
  checked!:boolean;
}

export class linkList {
  id: any;
  vt: number;
  stt: any;
  maNdung: string;
  kphiSdungTcong: number;
  kphiSdungDtoan: number;
  kphiSdungNguonKhac: number;
  kphiSdungNguonQuy: number;
  kphiSdungNstt: number;
  kphiSdungCk: number;
  kphiChuyenSangTcong: number;
  kphiChuyenSangDtoan: number;
  kphiChuyenSangNguonKhac: number;
  kphiChuyenSangNguonQuy: number;
  kphiChuyenSangNstt: number;
  kphiChuyenSangCk: number;
  dtoanGiaoTcong: number;
  dtoanGiaoDtoan: number;
  dtoanGiaoNguonKhac: number;
  dtoanGiaoNguonQuy: number;
  dtoanGiaoNstt: number;
  dtoanGiaoCk: number;
  giaiNganThangBcaoTcong: number;
  giaiNganThangBcaoTcongTle: number;
  giaiNganThangBcaoDtoan: number;
  giaiNganThangBcaoDtoanTle: number;
  giaiNganThangBcaoNguonKhac: number;
  giaiNganThangBcaoNguonKhacTle: number;
  giaiNganThangBcaoNguonQuy: number;
  giaiNganThangBcaoNguonQuyTle: number;
  giaiNganThangBcaoNstt: number;
  giaiNganThangBcaoNsttTle: number;
  giaiNganThangBcaoCk: number;
  giaiNganThangBcaoCkTle: number;
  luyKeGiaiNganTcong: number;
  luyKeGiaiNganTcongTle: number;
  luyKeGiaiNganDtoan: number;
  luyKeGiaiNganDtoanTle: number;
  luyKeGiaiNganNguonKhac: number;
  luyKeGiaiNganNguonKhacTle: number;
  luyKeGiaiNganNguonQuy: number;
  luyKeGiaiNganNguonQuyTle: number;
  luyKeGiaiNganNstt: number;
  luyKeGiaiNganNsttTle: number;
  luyKeGiaiNganCk: number;
  luyKeGiaiNganCkTle: number;
  // listCtiet: vatTu[] = [];
  parentId: any;
  next: linkList[];
  checked: boolean;
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
  lstCTietBCaoPL1: ItemDataPL1[] = [];        // list chi tiet bao cao
  id!: any;                                   // id truyen tu router
  chiTietBcaos: any;                          // thong tin chi tiet bao cao
  chiTietBcaosPL1: linkList = {
    id: uuid.v4(),
    vt: 0,
    stt: null,
    maNdung: '',
    kphiSdungTcong: null,
    kphiSdungDtoan: null,
    kphiSdungNguonKhac: null,
    kphiSdungNguonQuy: null,
    kphiSdungNstt: null,
    kphiSdungCk: null,
    kphiChuyenSangTcong: null,
    kphiChuyenSangDtoan: null,
    kphiChuyenSangNguonKhac: null,
    kphiChuyenSangNguonQuy: null,
    kphiChuyenSangNstt: null,
    kphiChuyenSangCk: null,
    dtoanGiaoTcong: null,
    dtoanGiaoDtoan: null,
    dtoanGiaoNguonKhac: null,
    dtoanGiaoNguonQuy: null,
    dtoanGiaoNstt: null,
    dtoanGiaoCk: null,
    giaiNganThangBcaoTcong: null,
    giaiNganThangBcaoTcongTle: null,
    giaiNganThangBcaoDtoan: null,
    giaiNganThangBcaoDtoanTle: null,
    giaiNganThangBcaoNguonKhac: null,
    giaiNganThangBcaoNguonKhacTle: null,
    giaiNganThangBcaoNguonQuy: null,
    giaiNganThangBcaoNguonQuyTle: null,
    giaiNganThangBcaoNstt: null,
    giaiNganThangBcaoNsttTle: null,
    giaiNganThangBcaoCk: null,
    giaiNganThangBcaoCkTle: null,
    luyKeGiaiNganTcong: null,
    luyKeGiaiNganTcongTle: null,
    luyKeGiaiNganDtoan: null,
    luyKeGiaiNganDtoanTle: null,
    luyKeGiaiNganNguonKhac: null,
    luyKeGiaiNganNguonKhacTle: null,
    luyKeGiaiNganNguonQuy: null,
    luyKeGiaiNganNguonQuyTle: null,
    luyKeGiaiNganNstt: null,
    luyKeGiaiNganNsttTle: null,
    luyKeGiaiNganCk: null,
    luyKeGiaiNganCkTle: null,
    // listCtiet: vatTu[] = [];
    parentId: null,
    next: [],
    checked: false,
  };
  stt: number;
  kt: boolean;
  statusB: boolean = false;
  disable: boolean = false;
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
  editCachePL1: { [key: string]: { edit: boolean; data: ItemDataPL1 } } = {};     // phuc vu nut chinh
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
          // this.notification.error(MESSAGE.ERROR, data?.msg);
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
    await this.quanLyVonPhiService.bCLapThamDinhDuToanChiTiet(this.id).toPromise().then(
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
  addLinePL1(id: number): void {
    let item : ItemDataPL1 = {
      maNdung:"",
      kphiSdungTcong: 0,
      kphiSdungDtoan: 0,
      kphiSdungNguonKhac: 0,
      kphiSdungNguonQuy: 0,
      kphiSdungNstt: 0,
      kphiSdungCk: 0,
      kphiChuyenSangTcong: 0,
      kphiChuyenSangDtoan: 0,
      kphiChuyenSangNguonKhac: 0,
      kphiChuyenSangNguonQuy: 0,
      kphiChuyenSangNstt: 0,
      kphiChuyenSangCk: 0,
      dtoanGiaoTcong: 0,
      dtoanGiaoDtoan: 0,
      dtoanGiaoNguonKhac: 0,
      dtoanGiaoNguonQuy: 0,
      dtoanGiaoNstt: 0,
      dtoanGiaoCk: 0,
      giaiNganThangBcaoTcong: 0,
      giaiNganThangBcaoTcongTle: 0,
      giaiNganThangBcaoDtoan: 0,
      giaiNganThangBcaoDtoanTle: 0,
      giaiNganThangBcaoNguonKhac: 0,
      giaiNganThangBcaoNguonKhacTle: 0,
      giaiNganThangBcaoNguonQuy: 0,
      giaiNganThangBcaoNguonQuyTle: 0,
      giaiNganThangBcaoNstt: 0,
      giaiNganThangBcaoNsttTle: 0,
      giaiNganThangBcaoCk: 0,
      giaiNganThangBcaoCkTle: 0,
      luyKeGiaiNganTcong: 0,
      luyKeGiaiNganTcongTle: 0,
      luyKeGiaiNganDtoan: 0,
      luyKeGiaiNganDtoanTle: 0,
      luyKeGiaiNganNguonKhac: 0,
      luyKeGiaiNganNguonKhacTle: 0,
      luyKeGiaiNganNguonQuy: 0,
      luyKeGiaiNganNguonQuyTle: 0,
      luyKeGiaiNganNstt: 0,
      luyKeGiaiNganNsttTle: 0,
      luyKeGiaiNganCk: 0,
      luyKeGiaiNganCkTle: 0,
      stt: 0,
      parentId: null,
      id: uuid.v4(),
      checked:false,
    }

    this.lstCTietBCaoPL1.splice(id, 0, item);
    this.editCachePL1[item.id] = {
      edit: true,
      data: { ...item }
    };
    this.statusB = false;
    this.disable = true;
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
  // them dong moi phu luc 3
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

  // click o checkbox single phu luc 1
  updateSingleCheckedPL1(): void {
    if (this.lstCTietBCaoPL1.every(item => !item.checked)) {           // tat ca o checkbox deu = false thi set o checkbox all = false
      this.allChecked = false;
      this.indeterminate = false;
    } else if (this.lstCTietBCaoPL1.every(item => item.checked)) {     // tat ca o checkbox deu = true thi set o checkbox all = true
      this.allChecked = true;
      this.indeterminate = false;
    } else {                                                        // o checkbox vua = false, vua = true thi set o checkbox all = indeterminate
      this.indeterminate = true;
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
  startEditPL1(id: string): void {
    this.editCachePL1[id].edit = true;
    this.statusB = true;
    this.disable = true;
  }
  // start edit pl2
  startEditPL2(id: string): void {
    this.editCachePL2[id].edit = true;
  }
  // start edit
  startEditPL3(id: string): void {
    this.editCachePL3[id].edit = true;
  }

  // huy thay doi phu luc 1
  cancelEditPL1(id: string): void {
    const index = this.lstCTietBCaoPL1.findIndex(item => item.id === id);  // lay vi tri hang minh sua
    this.editCachePL1[id] = {
      data: { ...this.lstCTietBCaoPL1[index] },
      edit: false
    };
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

  // luu thay doi phu luc 1
  saveEditPL1(id: string): void {
    this.editCachePL1[id].data.checked = this.lstCTietBCaoPL1.find(item => item.id === id).checked; // set checked editCachePL1 = checked lstCTietBCao
    const index = this.lstCTietBCaoPL1.findIndex(item => item.id === id);   // lay vi tri hang minh sua
    Object.assign(this.lstCTietBCaoPL1[index], this.editCachePL1[id].data); // set lai data cua lstCTietBCao[index] = this.editCachePL1[id].data
    this.editCachePL1[id].edit = false;  // CHUYEN VE DANG TEXT
    this.saveEditLL(this.chiTietBcaosPL1, index + 1);
    this.disable = false;
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

  // gan editCachePL2.data == lstCTietBCao phu luc 1
  updateEditCachePL1(): void {
    this.lstCTietBCaoPL1.forEach(item => {
      this.editCachePL1[item.id] = {
        edit: false,
        data: { ...item }
      };
    });
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

  // phu luc 1

  //thao tác bảng

  //khoi tao
  duyet(data: linkList, str: string, index: number, parent: number) {
    if (index != 0) {
      let mm = {
        id: data.id,
        stt: str + index.toString(),
        maNdung:data.maNdung,
        kphiSdungTcong:data.kphiSdungTcong,
        kphiSdungDtoan:data.kphiSdungDtoan,
        kphiSdungNguonKhac:data.kphiSdungNguonKhac,
        kphiSdungNguonQuy:data.kphiSdungNguonQuy,
        kphiSdungNstt:data.kphiSdungNstt,
        kphiSdungCk:data.kphiSdungCk,
        kphiChuyenSangTcong:data.kphiChuyenSangTcong,
        kphiChuyenSangDtoan:data.kphiChuyenSangDtoan,
        kphiChuyenSangNguonKhac:data.kphiChuyenSangNguonKhac,
        kphiChuyenSangNguonQuy:data.kphiChuyenSangNguonQuy,
        kphiChuyenSangNstt:data.kphiChuyenSangNstt,
        kphiChuyenSangCk:data.kphiChuyenSangCk,
        dtoanGiaoTcong:data.dtoanGiaoTcong,
        dtoanGiaoDtoan:data.dtoanGiaoDtoan,
        dtoanGiaoNguonKhac:data.dtoanGiaoNguonKhac,
        dtoanGiaoNguonQuy:data.dtoanGiaoNguonQuy,
        dtoanGiaoNstt:data.dtoanGiaoNstt,
        dtoanGiaoCk:data.dtoanGiaoCk,
        giaiNganThangBcaoTcong:data.giaiNganThangBcaoTcong,
        giaiNganThangBcaoTcongTle:data.giaiNganThangBcaoTcongTle,
        giaiNganThangBcaoDtoan:data.giaiNganThangBcaoDtoan,
        giaiNganThangBcaoDtoanTle:data.giaiNganThangBcaoDtoanTle,
        giaiNganThangBcaoNguonKhac:data.giaiNganThangBcaoNguonKhac,
        giaiNganThangBcaoNguonKhacTle:data.giaiNganThangBcaoNguonKhacTle,
        giaiNganThangBcaoNguonQuy:data.giaiNganThangBcaoNguonQuy,
        giaiNganThangBcaoNguonQuyTle:data.giaiNganThangBcaoNguonQuyTle,
        giaiNganThangBcaoNstt:data.giaiNganThangBcaoNstt,
        giaiNganThangBcaoNsttTle:data.giaiNganThangBcaoNsttTle,
        giaiNganThangBcaoCk:data.giaiNganThangBcaoCk,
        giaiNganThangBcaoCkTle:data.giaiNganThangBcaoCkTle,
        luyKeGiaiNganTcong:data.luyKeGiaiNganTcong,
        luyKeGiaiNganTcongTle:data.luyKeGiaiNganTcongTle,
        luyKeGiaiNganDtoan:data.luyKeGiaiNganDtoan,
        luyKeGiaiNganDtoanTle:data.luyKeGiaiNganDtoanTle,
        luyKeGiaiNganNguonKhac:data.luyKeGiaiNganNguonKhac,
        luyKeGiaiNganNguonKhacTle:data.luyKeGiaiNganNguonKhacTle,
        luyKeGiaiNganNguonQuy:data.luyKeGiaiNganNguonQuy,
        luyKeGiaiNganNguonQuyTle:data.luyKeGiaiNganNguonQuyTle,
        luyKeGiaiNganNstt:data.luyKeGiaiNganNstt,
        luyKeGiaiNganNsttTle:data.luyKeGiaiNganNsttTle,
        luyKeGiaiNganCk:data.luyKeGiaiNganCk,
        luyKeGiaiNganCkTle:data.luyKeGiaiNganCkTle,
        // listCtiet: data.listCtiet,
        parentId: data.vt,
        checked: false,
      };
      this.lstCTietBCaoPL1.push(mm);
    }
    if (data.next.length == 0) return;
    for (var i = 0; i < data.next.length; i++) {
      if (index == 0) {
        this.duyet(data.next[i], str, i + 1, data.vt);
      } else {
        this.duyet(data.next[i], str + index.toString() + '.', i + 1, data.vt);
      }
    }
  }

  updateLstCTietBCaoPL1() {
    this.lstCTietBCaoPL1 = [];
    this.duyet(this.chiTietBcaosPL1, '', 0, 0);
    this.updateEditCachePL1();
  }

  updateSTT(data: linkList) {
    if (data.next.length == 0) {
      return;
    }
    data.next.forEach((item) => {
      item.vt = this.stt + 1;
      this.stt += 1;
      this.updateSTT(item);
    });
  }

  // xoa dong theo so thu tu
  deleteByStt(idx: any): void {

    this.delete(this.chiTietBcaosPL1, idx);
    this.stt = 0;
    this.updateSTT(this.chiTietBcaosPL1);
    this.updateLstCTietBCaoPL1();
  }

  //xoa theo so thu tu
  delete(data: linkList, idx: number) {
    if (data.next.length == 0) return;
    var index = data.next.findIndex((item) => item.vt == idx);
    if (index == -1) {
      data.next.forEach((item) => {
        this.delete(item, idx);
      });
    } else {
      this.kt = true;
      this.getListIdDelete(data.next[index]);
      data.next = data.next.filter((item) => item.vt != idx);
      return;
    }
  }

  getListIdDelete(data: linkList){
    if(data.vt>0){
      if (typeof this.lstCTietBCaoPL1[data.vt-1].id == 'number'){
        this.listIdDelete += this.lstCTietBCaoPL1[data.vt-1].id + ',';
      }
    }

    if (data.next.length == 0) return;
    data.next.forEach(item => {
      this.getListIdDelete(item);
    })
  }

  //xoa bằng checkbox
  deleteSelected() {
    this.deleteAllSelected(this.chiTietBcaosPL1);
    this.updateSTT(this.chiTietBcaosPL1);
    this.updateLstCTietBCaoPL1();
    this.allChecked = false;
    this.chiTietBcaosPL1.checked = false;

    // add list delete id
    this.lstCTietBCaoPL1.filter(item => {
      if(item.checked == true && typeof item.id == "number"){
        this.listIdDelete += item.id + ","
      }
    })
    // delete object have checked = true
    this.lstCTietBCaoPL1 = this.lstCTietBCaoPL1.filter(item => item.checked != true )
    this.allChecked = false;
  }

  deleteAllSelected(data: linkList) {
    if (data.next.length == 0) {
      return;
    }

    if(data.checked==true){
      this.getListIdDelete(data);
    }
    data.next = data.next.filter((item) => item.checked == false);
    this.stt = 0;
    data.next.forEach((item) => this.deleteAllSelected(item));
  }

  // click o checkbox all
  updateAllChecked(): void {
    this.subUpdateChecked(this.chiTietBcaosPL1, this.allChecked);
  }

  updateChecked() {
    this.updateCheckedLL(this.chiTietBcaosPL1);
  }

  updateCheckedLL(data: linkList) {
    if (data.vt != 0) {
      if (data.checked != this.lstCTietBCaoPL1[data.vt - 1].checked) {
        this.subUpdateChecked(data, !data.checked);
        return;
      }
    }

    if (data.next.length == 0) return;
    var kt = true;
    data.next.forEach((item) => {
      this.updateCheckedLL(item);
      if (!item.checked) kt = false;
    });
    data.checked = kt;
    if (kt) {
      this.allChecked = kt;
    } else {
      this.lstCTietBCaoPL1[data.vt - 1].checked = kt;
    }
  }

  subUpdateChecked(data: linkList, kt: boolean) {
    data.checked = kt;
    if (data.vt > 0) this.lstCTietBCaoPL1[data.vt - 1].checked = kt;
    if (data.next.length == 0) return;
    data.next.forEach((item) => this.subUpdateChecked(item, kt));
  }

  saveEditLL(data: linkList, idx: number) {
    if (data.vt == idx) {
      this.tranferData(data, this.lstCTietBCaoPL1[idx - 1]);
      return;
    }
    if (data.next.length == 0) return;
    if (data.vt > idx) return;
    data.next.forEach((item) => {
      this.saveEditLL(item, idx);
    });
  }

  // lưu bằng cấp
  saveEdit1(id: string, index: number): void {
    var item: linkList = {
      id: uuid.v4(),
      vt: 0,
      stt: this.editCachePL1[id].data.stt,
      maNdung: this.editCachePL1[id].data.maNdung,
      kphiSdungTcong: this.editCachePL1[id].data.kphiSdungTcong,
      kphiSdungDtoan: this.editCachePL1[id].data.kphiSdungDtoan,
      kphiSdungNguonKhac: this.editCachePL1[id].data.kphiSdungNguonKhac,
      kphiSdungNguonQuy: this.editCachePL1[id].data.kphiSdungNguonQuy,
      kphiSdungNstt: this.editCachePL1[id].data.kphiSdungNstt,
      kphiSdungCk: this.editCachePL1[id].data.kphiSdungCk,
      kphiChuyenSangTcong: this.editCachePL1[id].data.kphiChuyenSangTcong,
      kphiChuyenSangDtoan: this.editCachePL1[id].data.kphiChuyenSangDtoan,
      kphiChuyenSangNguonKhac: this.editCachePL1[id].data.kphiChuyenSangNguonKhac,
      kphiChuyenSangNguonQuy: this.editCachePL1[id].data.kphiChuyenSangNguonQuy,
      kphiChuyenSangNstt: this.editCachePL1[id].data.kphiChuyenSangNstt,
      kphiChuyenSangCk: this.editCachePL1[id].data.kphiChuyenSangCk,
      dtoanGiaoTcong: this.editCachePL1[id].data.dtoanGiaoTcong,
      dtoanGiaoDtoan: this.editCachePL1[id].data.dtoanGiaoDtoan,
      dtoanGiaoNguonKhac: this.editCachePL1[id].data.dtoanGiaoNguonKhac,
      dtoanGiaoNguonQuy: this.editCachePL1[id].data.dtoanGiaoNguonQuy,
      dtoanGiaoNstt: this.editCachePL1[id].data.dtoanGiaoNstt,
      dtoanGiaoCk: this.editCachePL1[id].data.dtoanGiaoCk,
      giaiNganThangBcaoTcong: this.editCachePL1[id].data.giaiNganThangBcaoTcong,
      giaiNganThangBcaoTcongTle: this.editCachePL1[id].data.giaiNganThangBcaoTcongTle,
      giaiNganThangBcaoDtoan: this.editCachePL1[id].data.giaiNganThangBcaoDtoan,
      giaiNganThangBcaoDtoanTle: this.editCachePL1[id].data.giaiNganThangBcaoDtoanTle,
      giaiNganThangBcaoNguonKhac: this.editCachePL1[id].data.giaiNganThangBcaoNguonKhac,
      giaiNganThangBcaoNguonKhacTle: this.editCachePL1[id].data.giaiNganThangBcaoNguonKhacTle,
      giaiNganThangBcaoNguonQuy: this.editCachePL1[id].data.giaiNganThangBcaoNguonQuy,
      giaiNganThangBcaoNguonQuyTle: this.editCachePL1[id].data.giaiNganThangBcaoNguonQuyTle,
      giaiNganThangBcaoNstt: this.editCachePL1[id].data.giaiNganThangBcaoNstt,
      giaiNganThangBcaoNsttTle: this.editCachePL1[id].data.giaiNganThangBcaoNsttTle,
      giaiNganThangBcaoCk: this.editCachePL1[id].data.giaiNganThangBcaoCk,
      giaiNganThangBcaoCkTle: this.editCachePL1[id].data.giaiNganThangBcaoCkTle,
      luyKeGiaiNganTcong: this.editCachePL1[id].data.luyKeGiaiNganTcong,
      luyKeGiaiNganTcongTle: this.editCachePL1[id].data.luyKeGiaiNganTcongTle,
      luyKeGiaiNganDtoan: this.editCachePL1[id].data.luyKeGiaiNganDtoan,
      luyKeGiaiNganDtoanTle: this.editCachePL1[id].data.luyKeGiaiNganDtoanTle,
      luyKeGiaiNganNguonKhac: this.editCachePL1[id].data.luyKeGiaiNganNguonKhac,
      luyKeGiaiNganNguonKhacTle: this.editCachePL1[id].data.luyKeGiaiNganNguonKhacTle,
      luyKeGiaiNganNguonQuy: this.editCachePL1[id].data.luyKeGiaiNganNguonQuy,
      luyKeGiaiNganNguonQuyTle: this.editCachePL1[id].data.luyKeGiaiNganNguonQuyTle,
      luyKeGiaiNganNstt: this.editCachePL1[id].data.luyKeGiaiNganNstt,
      luyKeGiaiNganNsttTle: this.editCachePL1[id].data.luyKeGiaiNganNsttTle,
      luyKeGiaiNganCk: this.editCachePL1[id].data.luyKeGiaiNganCk,
      luyKeGiaiNganCkTle: this.editCachePL1[id].data.luyKeGiaiNganCkTle,
      parentId: this.editCachePL1[id].data.parentId,
      next: [],
      checked: false,
    };

    this.kt = false;
    this.addEqual(this.chiTietBcaosPL1, item, index);
    if (!this.kt) {
      this.addEqual1(this.chiTietBcaosPL1, item);
    }
    this.stt = 0;
    this.updateSTT(this.chiTietBcaosPL1);
    console.log(this.chiTietBcaosPL1);
    this.updateLstCTietBCaoPL1();
    this.disable = false;
  }

  // lưu cấp con
  saveEdit2(id: string, index: number): void {
    var item: linkList = {
      id: uuid.v4(),
      vt: 0,
      stt: this.editCachePL1[id].data.stt,
      maNdung: this.editCachePL1[id].data.maNdung,
      kphiSdungTcong: this.editCachePL1[id].data.kphiSdungTcong,
      kphiSdungDtoan: this.editCachePL1[id].data.kphiSdungDtoan,
      kphiSdungNguonKhac: this.editCachePL1[id].data.kphiSdungNguonKhac,
      kphiSdungNguonQuy: this.editCachePL1[id].data.kphiSdungNguonQuy,
      kphiSdungNstt: this.editCachePL1[id].data.kphiSdungNstt,
      kphiSdungCk: this.editCachePL1[id].data.kphiSdungCk,
      kphiChuyenSangTcong: this.editCachePL1[id].data.kphiChuyenSangTcong,
      kphiChuyenSangDtoan: this.editCachePL1[id].data.kphiChuyenSangDtoan,
      kphiChuyenSangNguonKhac: this.editCachePL1[id].data.kphiChuyenSangNguonKhac,
      kphiChuyenSangNguonQuy: this.editCachePL1[id].data.kphiChuyenSangNguonQuy,
      kphiChuyenSangNstt: this.editCachePL1[id].data.kphiChuyenSangNstt,
      kphiChuyenSangCk: this.editCachePL1[id].data.kphiChuyenSangCk,
      dtoanGiaoTcong: this.editCachePL1[id].data.dtoanGiaoTcong,
      dtoanGiaoDtoan: this.editCachePL1[id].data.dtoanGiaoDtoan,
      dtoanGiaoNguonKhac: this.editCachePL1[id].data.dtoanGiaoNguonKhac,
      dtoanGiaoNguonQuy: this.editCachePL1[id].data.dtoanGiaoNguonQuy,
      dtoanGiaoNstt: this.editCachePL1[id].data.dtoanGiaoNstt,
      dtoanGiaoCk: this.editCachePL1[id].data.dtoanGiaoCk,
      giaiNganThangBcaoTcong: this.editCachePL1[id].data.giaiNganThangBcaoTcong,
      giaiNganThangBcaoTcongTle: this.editCachePL1[id].data.giaiNganThangBcaoTcongTle,
      giaiNganThangBcaoDtoan: this.editCachePL1[id].data.giaiNganThangBcaoDtoan,
      giaiNganThangBcaoDtoanTle: this.editCachePL1[id].data.giaiNganThangBcaoDtoanTle,
      giaiNganThangBcaoNguonKhac: this.editCachePL1[id].data.giaiNganThangBcaoNguonKhac,
      giaiNganThangBcaoNguonKhacTle: this.editCachePL1[id].data.giaiNganThangBcaoNguonKhacTle,
      giaiNganThangBcaoNguonQuy: this.editCachePL1[id].data.giaiNganThangBcaoNguonQuy,
      giaiNganThangBcaoNguonQuyTle: this.editCachePL1[id].data.giaiNganThangBcaoNguonQuyTle,
      giaiNganThangBcaoNstt: this.editCachePL1[id].data.giaiNganThangBcaoNstt,
      giaiNganThangBcaoNsttTle: this.editCachePL1[id].data.giaiNganThangBcaoNsttTle,
      giaiNganThangBcaoCk: this.editCachePL1[id].data.giaiNganThangBcaoCk,
      giaiNganThangBcaoCkTle: this.editCachePL1[id].data.giaiNganThangBcaoCkTle,
      luyKeGiaiNganTcong: this.editCachePL1[id].data.luyKeGiaiNganTcong,
      luyKeGiaiNganTcongTle: this.editCachePL1[id].data.luyKeGiaiNganTcongTle,
      luyKeGiaiNganDtoan: this.editCachePL1[id].data.luyKeGiaiNganDtoan,
      luyKeGiaiNganDtoanTle: this.editCachePL1[id].data.luyKeGiaiNganDtoanTle,
      luyKeGiaiNganNguonKhac: this.editCachePL1[id].data.luyKeGiaiNganNguonKhac,
      luyKeGiaiNganNguonKhacTle: this.editCachePL1[id].data.luyKeGiaiNganNguonKhacTle,
      luyKeGiaiNganNguonQuy: this.editCachePL1[id].data.luyKeGiaiNganNguonQuy,
      luyKeGiaiNganNguonQuyTle: this.editCachePL1[id].data.luyKeGiaiNganNguonQuyTle,
      luyKeGiaiNganNstt: this.editCachePL1[id].data.luyKeGiaiNganNstt,
      luyKeGiaiNganNsttTle: this.editCachePL1[id].data.luyKeGiaiNganNsttTle,
      luyKeGiaiNganCk: this.editCachePL1[id].data.luyKeGiaiNganCk,
      luyKeGiaiNganCkTle: this.editCachePL1[id].data.luyKeGiaiNganCkTle,
      parentId: this.editCachePL1[id].data.parentId,
      next: [],
      checked: false,
    };

    // this.tranferData(item,this.editCache[id].data);
    // item.vt =0;
    // item.checked=false;
    // item.next=[];

    this.kt = false;
    this.addLess(this.chiTietBcaosPL1, item, index);
    if (!this.kt) {
      this.addLess1(this.chiTietBcaosPL1, item);
    }
    this.stt = 0;
    this.updateSTT(this.chiTietBcaosPL1);
    console.log(this.chiTietBcaosPL1);
    this.updateLstCTietBCaoPL1();
    console.log(this.lstCTietBCaoPL1);
    this.disable = false;
  }

  addEqual(data: linkList, value: linkList, idx: number) {
    if (data.next.length == 0) return;
    var index = data.next.findIndex((item) => item.vt == idx);
    if (index == -1) {
      data.next.forEach((item) => {
        this.addEqual(item, value, idx);
      });
    } else {
      this.kt = true;
      data.next.splice(index + 1, 0, value);
      return;
    }
  }

  addEqual1(data: linkList, value: linkList) {
    var idx = data.next.length - 1;
    if (data.next[idx].next.length != 0) {
      this.addEqual1(data.next[idx], value);
    } else {
      data.next.push(value);
      return;
    }
  }

  addLess(data: linkList, value: linkList, idx: number) {
    if (data.next.length == 0) return;
    var index = data.next.findIndex((item) => item.vt == idx);
    if (index == -1) {
      data.next.forEach((item) => {
        this.addLess(item, value, idx);
      });
    } else {
      this.kt = true;
      data.next[index].next.splice(0, 0, value);
      return;
    }
  }

  addLess1(data: linkList, value: linkList) {
    if (data.next.length == 0) {
      data.next.push(value);
      return;
    }
    this.addLess1(data.next[data.next.length - 1], value);
  }

  tranferData(data: linkList, item: ItemDataPL1) {
    data.id = item.id,
    data.maNdung= item.maNdung,

    data.kphiSdungTcong= item.kphiSdungTcong,
    data.kphiSdungDtoan= item.kphiSdungDtoan,
    data.kphiSdungNguonKhac= item.kphiSdungNguonKhac,
    data.kphiSdungNguonQuy= item.kphiSdungNguonQuy,
    data.kphiSdungNstt= item.kphiSdungNstt,
    data.kphiSdungCk= item.kphiSdungCk,

    data.kphiChuyenSangTcong= item.kphiChuyenSangTcong,
    data.kphiChuyenSangDtoan= item.kphiChuyenSangDtoan,
    data.kphiChuyenSangNguonKhac= item.kphiChuyenSangNguonKhac,
    data.kphiChuyenSangNguonQuy= item.kphiChuyenSangNguonQuy,
    data.kphiChuyenSangNstt= item.kphiChuyenSangNstt,
    data.kphiChuyenSangCk= item.kphiChuyenSangCk,

    data.dtoanGiaoTcong= item.dtoanGiaoTcong,
    data.dtoanGiaoDtoan= item.dtoanGiaoDtoan,
    data.dtoanGiaoNguonKhac= item.dtoanGiaoNguonKhac,
    data.dtoanGiaoNguonQuy= item.dtoanGiaoNguonQuy,
    data.dtoanGiaoNstt= item.dtoanGiaoNstt,
    data.dtoanGiaoCk= item.dtoanGiaoCk,

    data.giaiNganThangBcaoTcong= item.giaiNganThangBcaoTcong,
    data.giaiNganThangBcaoTcongTle= item.giaiNganThangBcaoTcongTle,
    data.giaiNganThangBcaoDtoan= item.giaiNganThangBcaoDtoan,
    data.giaiNganThangBcaoDtoanTle= item.giaiNganThangBcaoDtoanTle,
    data.giaiNganThangBcaoNguonKhac= item.giaiNganThangBcaoNguonKhac,
    data.giaiNganThangBcaoNguonKhacTle= item.giaiNganThangBcaoNguonKhacTle,
    data.giaiNganThangBcaoNguonQuy= item.giaiNganThangBcaoNguonQuy,
    data.giaiNganThangBcaoNguonQuyTle= item.giaiNganThangBcaoNguonQuyTle,
    data.giaiNganThangBcaoNstt= item.giaiNganThangBcaoNstt,
    data.giaiNganThangBcaoNsttTle= item.giaiNganThangBcaoNsttTle,
    data.giaiNganThangBcaoCk= item.giaiNganThangBcaoCk,
    data.giaiNganThangBcaoCkTle= item.giaiNganThangBcaoCkTle,

    data.luyKeGiaiNganTcong= item.luyKeGiaiNganTcong,
    data.luyKeGiaiNganTcongTle= item.luyKeGiaiNganTcongTle,
    data.luyKeGiaiNganDtoan= item.luyKeGiaiNganDtoan,
    data.luyKeGiaiNganDtoanTle= item.luyKeGiaiNganDtoanTle,
    data.luyKeGiaiNganNguonKhac= item.luyKeGiaiNganNguonKhac,
    data.luyKeGiaiNganNguonKhacTle= item.luyKeGiaiNganNguonKhacTle,
    data.luyKeGiaiNganNguonQuy= item.luyKeGiaiNganNguonQuy,
    data.luyKeGiaiNganNguonQuyTle= item.luyKeGiaiNganNguonQuyTle,
    data.luyKeGiaiNganNstt= item.luyKeGiaiNganNstt,
    data.luyKeGiaiNganNsttTle= item.luyKeGiaiNganNsttTle,
    data.luyKeGiaiNganCk= item.luyKeGiaiNganCk,
    data.luyKeGiaiNganCkTle= item.luyKeGiaiNganCkTle,
    data.parentId = item.parentId;
  }

  //gia tri cac o input thay doi thi tinh toan lai PL2
  changeModelPL2(id: string): void {
    this.editCachePL2[id].data.dtoanSdungNamTcong = Number(this.editCachePL2[id].data.dtoanSdungNamNguonNsnn) + Number(this.editCachePL2[id].data.dtoanSdungNamNguonSn) + Number(this.editCachePL2[id].data.dtoanSdungNamNguonQuy);
    this.editCachePL2[id].data.giaiNganThangTcong = Number(this.editCachePL2[id].data.giaiNganThangNguonNsnn) + Number(this.editCachePL2[id].data.giaiNganThangNguonSn) + Number(this.editCachePL2[id].data.giaiNganThangNguonQuy);
    this.editCachePL2[id].data.luyKeGiaiNganTcong = Number(this.editCachePL2[id].data.luyKeGiaiNganNguonNsnn) + Number(this.editCachePL2[id].data.luyKeGiaiNganNguonSn) + Number(this.editCachePL2[id].data.luyKeGiaiNganNguonQuy);
  }
  //gia tri cac o input thay doi thi tinh toan lai PL1
  changeModelPL1(id: string): void {
    // 31
    this.editCachePL1[id].data.luyKeGiaiNganTcong = Number(this.editCachePL1[id].data.luyKeGiaiNganDtoan) + Number(this.editCachePL1[id].data.luyKeGiaiNganNguonKhac) + Number(this.editCachePL1[id].data.luyKeGiaiNganNguonQuy) + Number(this.editCachePL1[id].data.luyKeGiaiNganNstt) + Number(this.editCachePL1[id].data.luyKeGiaiNganCk);

    // 19
    this.editCachePL1[id].data.giaiNganThangBcaoTcong = Number(this.editCachePL1[id].data.giaiNganThangBcaoDtoan) + Number(this.editCachePL1[id].data.giaiNganThangBcaoNguonKhac) + Number(this.editCachePL1[id].data.giaiNganThangBcaoNguonQuy) + Number(this.editCachePL1[id].data.giaiNganThangBcaoNstt) + Number(this.editCachePL1[id].data.giaiNganThangBcaoCk);

    // 13
    this.editCachePL1[id].data.dtoanGiaoTcong = Number(this.editCachePL1[id].data.dtoanGiaoDtoan) + Number(this.editCachePL1[id].data.dtoanGiaoNguonKhac) + Number(this.editCachePL1[id].data.dtoanGiaoNguonQuy) + Number(this.editCachePL1[id].data.dtoanGiaoNstt) + Number(this.editCachePL1[id].data.dtoanGiaoCk);

    // 7
    this.editCachePL1[id].data.kphiChuyenSangTcong = Number(this.editCachePL1[id].data.kphiChuyenSangDtoan) + Number(this.editCachePL1[id].data.kphiChuyenSangNguonKhac) + Number(this.editCachePL1[id].data.kphiChuyenSangNguonQuy) + Number(this.editCachePL1[id].data.kphiChuyenSangNstt) + Number(this.editCachePL1[id].data.kphiChuyenSangCk);

    // 6
    this.editCachePL1[id].data.kphiSdungCk = Number(this.editCachePL1[id].data.kphiChuyenSangCk) + Number(this.editCachePL1[id].data.dtoanGiaoCk) ;

    // 5
    this.editCachePL1[id].data.kphiSdungNstt = Number(this.editCachePL1[id].data.kphiChuyenSangNstt) + Number(this.editCachePL1[id].data.dtoanGiaoNstt) ;

    // 4
    this.editCachePL1[id].data.kphiSdungNguonQuy = Number(this.editCachePL1[id].data.kphiChuyenSangNguonQuy) + Number(this.editCachePL1[id].data.dtoanGiaoNguonQuy) ;

    // 3
    this.editCachePL1[id].data.kphiSdungNguonKhac = Number(this.editCachePL1[id].data.kphiChuyenSangNguonKhac) + Number(this.editCachePL1[id].data.dtoanGiaoNguonKhac) ;

    // 2
    this.editCachePL1[id].data.kphiSdungDtoan = Number(this.editCachePL1[id].data.kphiChuyenSangDtoan) + Number(this.editCachePL1[id].data.dtoanGiaoDtoan) ;

    // 1
    this.editCachePL1[id].data.kphiSdungTcong = Number(this.editCachePL1[id].data.kphiSdungDtoan) + Number(this.editCachePL1[id].data.kphiSdungNguonKhac) + Number(this.editCachePL1[id].data.kphiSdungNguonQuy) + Number(this.editCachePL1[id].data.kphiSdungNstt) + Number(this.editCachePL1[id].data.kphiSdungCk);
  }
}
