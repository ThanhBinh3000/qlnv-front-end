import { DatePipe, Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import * as fileSaver from 'file-saver';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogCopyComponent } from 'src/app/components/dialog/dialog-copy/dialog-copy.component';
import { DialogLuaChonThemPhuLucComponent } from 'src/app/components/dialog/dialog-lua-chon-them-phu-luc/dialog-lua-chon-them-phu-luc.component';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { divMoney, DONVITIEN, MONEYLIMIT, mulMoney, NOTOK, OK, Utils } from 'src/app/Utility/utils';
import * as uuid from "uuid";
import * as XLSX from 'xlsx';
import { SOLAMA } from '../../../quy-trinh-bao-ket-qua-THVP-hang-DTQG-tai-tong-cuc/nhom-chuc-nang-chi-cuc/lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-DTQG-tai-chi-cuc-mau04a/lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-DTQG.constant';
import { PHULUCLIST, TAB_SELECTED } from './bao-cao.constant';
export class ItemData {
  id!: any;
  maLoai!: string;
  maDviTien!: any;
  lstCTietBCao!: any;
  trangThai!: string;
  checked!: boolean;
  tieuDe!: string;
  tenPhuLuc!: string;
  thuyetMinh!: string;
  lyDoTuChoi!:string;
}

export class ItemDanhSach {
  id!: any;
  maBcao!: String;
  namBcao!: Number;
  thangBcao!: Number;
  trangThai!: string;
  ngayTao!: string;
  nguoiTao!: string;
  maDvi: number;
  congVan!: ItemCongVan;
  ngayTrinh!: string;
  ngayDuyet!: string;
  ngayPheDuyet!: string;
  ngayTraKq!: string;

  // dung cho request
  fileDinhKems!: any[];
  listIdDeletes!: string;
  listIdFiles!: string;
  maLoaiBcao!: string;
  maPhanBcao: string = "0";

  stt!: String;
  checked!: boolean;
  lstBCao: ItemData[] = [];
  lstFile: any[] = [];
  lstBCaoDviTrucThuoc: any[] = [];
  tongHopTu!: string;
}

export class ItemCongVan {
  fileName: string;
  fileSize: number;
  fileUrl: number;
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
  level!: number;
  id!: any;
  stt!: any;
  checked!: boolean;
}


export class linkList {
  id: any;
  vt: number;
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
  next: linkList[];
  checked: boolean;
}

@Component({
  selector: 'bao-cao',
  templateUrl: './bao-cao.component.html',
  styleUrls: ['./bao-cao.component.scss']
})

export class BaoCaoComponent implements OnInit {
  @Input() idDialog: any;
  soLaMa: any = SOLAMA;
  baoCao: ItemDanhSach = new ItemDanhSach();
  totalElements = 0;
  totalPages = 0;
  errorMessage = "";
  url!: string;
  id!: any;                                   // id truyen tu router
  loaiBaoCao!: any;                           // loai bao cao (thang/nam)
  trangThaiChiTiet!: any;

  pages = {
    size: 10,
    page: 1,
  }
  donViTaos: any = [];
  loaiBaoCaos: any = [];                          // danh muc loai bao cao

  userInfo: any;
  noiDungs: any = [];                         // danh muc noi dung
  nhomChis: any = [];                          // danh muc nhom chi
  loaiChis: any = [];                          // danh muc loai chi
  donVis: any = [];                            // danh muc don vi
  donViTiens: any = DONVITIEN;                        // danh muc don vi tien
  lstFile: any = [];                          // list File de day vao api
  status: boolean = false;                    // trang thai an/ hien cua trang thai
  maDonViTao!: any;                           // ma don vi tao

  maDviTien: string = "1";                   // ma don vi tien
  thuyetMinh: string;                   // ma don vi tien
  newDate = new Date();                       //
  fileToUpload!: File;                        // file tai o input
  listFile: File[] = [];                      // list file chua ten va id de hien tai o input
  box1 = true;                                // bien de an hien box1
  fileUrl: any;                               // url
  listIdDelete: string = "";                  // list id delete

  maDans: any = [];
  ddiemXdungs: any = [];

  statusBtnDel: boolean;                       // trang thai an/hien nut xoa
  statusBtnSave: boolean;                      // trang thai an/hien nut luu
  statusBtnApprove: boolean;                   // trang thai an/hien nut trinh duyet
  statusBtnTBP: boolean;                       // trang thai an/hien nut truong bo phan
  statusBtnLD: boolean;                        // trang thai an/hien nut lanh dao
  statusBtnGuiDVCT: boolean;                   // trang thai nut gui don vi cap tren
  statusBtnDVCT: boolean;                      // trang thai nut don vi cap tren
  statusBtnCopy: boolean;                      // trang thai copy
  statusBtnPrint: boolean;                     // trang thai print
  statusBtnOk: boolean;                        // trang thai ok/ not ok
  statusBtnClose: boolean = false;                        // trang thai ok/ not ok

  listIdFiles: string;                        // id file luc call chi tiet

  allChecked = false;                         // check all checkbox
  indeterminate = true;                       // properties allCheckBox
  allCheckedTemp = false;                    // check all checkbox temp
  indeterminateTemp = true;                   // properties allCheckBox temp
  editCache: { [key: string]: { edit: boolean; data: any } } = {};     // phuc vu nut chinh
  fileList: NzUploadFile[] = [];
  fileDetail: NzUploadFile;
  tabSelected: string;
  danhSachChiTietPhuLucTemp: any = [];
  nho!: boolean;                              // bien nho phuc vu sort
  tab = TAB_SELECTED;
  constructor(
    private routerActive: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private danhMucService: DanhMucHDVService,
    private userService: UserService,
    private notification: NzNotificationService,
    private quanLyVonPhiService: QuanLyVonPhiService,
    private danhMuc: DanhMucHDVService,
    private notifi: NzNotificationService,
    private modal: NzModalService,
    private location: Location,

  ) {
  }

  async ngOnInit() {

    this.id = this.routerActive.snapshot.paramMap.get('id');
    let lbc = this.routerActive.snapshot.paramMap.get('baoCao');
    let userName = this.userService.getUserName();
    await this.getUserInfo(userName); //get user info
    if (this.idDialog) {
      this.id = this.idDialog;
      this.statusBtnClose = true;
      this.statusBtnSave = true;
    }
    if (this.id) {
      await this.getDetailReport();
    } else if (lbc == 'tong-hop') {
      await this.callSynthetic();
      this.maDonViTao = this.userInfo?.dvql;
      this.spinner.show();
      this.quanLyVonPhiService.taoMaBaoCao().subscribe(
        (data) => {
          if (data.statusCode == 0) {
            this.baoCao.maBcao = data.data;
          } else {
            this.notification.error(MESSAGE.ERROR, data?.msg);
          }
        },
        (err) => {
          this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
        }
      );
      this.baoCao.maLoaiBcao = this.routerActive.snapshot.paramMap.get('loaiBaoCao');
      this.baoCao.namBcao = Number(this.routerActive.snapshot.paramMap.get('nam'));
      this.baoCao.thangBcao = Number(this.routerActive.snapshot.paramMap.get('thang')) == 0 ? null : Number(this.routerActive.snapshot.paramMap.get('thang'));

      this.baoCao.ngayTao = new Date().toDateString();
      this.baoCao.trangThai = "1";
    } else {
      this.maDonViTao = this.userInfo?.dvql;
      this.spinner.show();
      this.quanLyVonPhiService.taoMaBaoCao().subscribe(
        (data) => {
          if (data.statusCode == 0) {
            this.baoCao.maBcao = data.data;
          } else {
            this.notification.error(MESSAGE.ERROR, data?.msg);
          }
        },
        (err) => {
          this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
        }
      );
      this.baoCao.maLoaiBcao = this.routerActive.snapshot.paramMap.get('loaiBaoCao');
      this.baoCao.namBcao = Number(this.routerActive.snapshot.paramMap.get('nam'));
      this.baoCao.thangBcao = Number(this.routerActive.snapshot.paramMap.get('thang')) == 0 ? null : Number(this.routerActive.snapshot.paramMap.get('thang'));

      this.baoCao.ngayTao = new Date().toDateString();
      this.baoCao.trangThai = "1";
      PHULUCLIST.forEach(item => {
        this.baoCao.lstBCao.push({
          id: uuid.v4()+'FE',
          checked: false,
          tieuDe: item.tieuDe,
          maLoai: item.maPhuLuc,
          tenPhuLuc: item.tenPhuLuc,
          trangThai: '2',
          lstCTietBCao: [],
          maDviTien: '1',
          thuyetMinh: null,
          lyDoTuChoi:null,
        });
      })
    }



    //lay danh sach loai bao cao
    this.danhMuc.dMLoaiBaoCaoThucHienDuToanChi().toPromise().then(
      data => {
        if (data.statusCode == 0) {
          this.loaiBaoCaos = data.data?.content;
        } else {
          this.notifi.error(MESSAGE.ERROR, data?.msg);
        }
      },
      err => {
        this.notifi.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
    );

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
    this.statusBtnDel = utils.getRoleDel(this.baoCao?.trangThai, checkChirld, this.userInfo?.roles[0]?.code);
    this.statusBtnSave = utils.getRoleSave(this.baoCao?.trangThai, checkChirld, this.userInfo?.roles[0]?.code);
    this.statusBtnApprove = utils.getRoleApprove(this.baoCao?.trangThai, checkChirld, this.userInfo?.roles[0]?.code);
    this.statusBtnTBP = utils.getRoleTBP(this.baoCao?.trangThai, checkChirld, this.userInfo?.roles[0]?.code);
    this.statusBtnLD = utils.getRoleLD(this.baoCao?.trangThai, checkChirld, this.userInfo?.roles[0]?.code);
    this.statusBtnGuiDVCT = utils.getRoleGuiDVCT(this.baoCao?.trangThai, checkChirld, this.userInfo?.roles[0]?.code);
    this.statusBtnDVCT = utils.getRoleDVCT(this.baoCao?.trangThai, checkParent, this.userInfo?.roles[0]?.code);
    this.statusBtnCopy = utils.getRoleCopy(this.baoCao?.trangThai, checkChirld, this.userInfo?.roles[0]?.code);
    this.statusBtnPrint = utils.getRolePrint(this.baoCao?.trangThai, checkChirld, this.userInfo?.roles[0]?.code);
  }

  // lay ten don vi tao
  getUnitName(dvitao: any) {
    return this.donViTaos.find(item => item.maDvi == dvitao)?.tenDvi;
  }

  // call chi tiet bao cao
  async getDetailReport() {
    this.spinner.show();
    await this.quanLyVonPhiService.baoCaoChiTiet(this.id).toPromise().then(
      (data) => {
        if (data.statusCode == 0) {
          this.baoCao = data.data;
          this.baoCao?.lstBCao?.forEach(item => {
            let index = PHULUCLIST.findIndex(data => data.maPhuLuc == item.maLoai);
            if (index !== -1) {
              item.tieuDe = PHULUCLIST[index].tieuDe;
              item.tenPhuLuc = PHULUCLIST[index].tenPhuLuc;
              item.checked = false;
            }
          })
          this.baoCao?.lstBCao?.forEach((item) => {
            if (item.maLoai == PHULUCLIST[0].maPhuLuc) {
              this.lstCTietBCaoPL1 = item?.lstCTietBCao;
              this.lstCTietBCaoPL1.forEach(item => {
                item.level = item.stt.split('.').length - 1;
              })
              this.getLinkList(this.chiTietBcaosPL1, "", 0);
              this.updateSTT(this.chiTietBcaosPL1);
              this.updateLstCTietBCaoPL1();
            }
          });

          this.updateEditCache();
          this.updateEditCachePL1();
          this.lstFile = data.data.lstFile;
          this.listFile = [];
          this.maDonViTao = data.data.maDvi;
          if (this.baoCao.trangThai == Utils.TT_BC_1 ||
            this.baoCao.trangThai == Utils.TT_BC_3 ||
            this.baoCao.trangThai == Utils.TT_BC_5 ||
            this.baoCao.trangThai == Utils.TT_BC_8) {
            this.status = false;
            this.statusB = false;
          } else {
            this.status = true;
            this.statusB = true;
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

  getLinkList(data: linkList, head: string, lvl: number) {
    var lst: ItemDataPL1[] = [];
    this.lstCTietBCaoPL1.forEach(item => {
      if ((item.level == lvl) && (item.stt.indexOf(head) == 0)) {
        lst.push(item);
      }
    });
    if (lst.length == 0) return;
    lst.forEach(item => {
      var obj: linkList = {
        ...item,
        vt: 0,
        next: [],
        checked: false,
      };
      this.getLinkList(obj, item.stt, lvl + 1);
      data.next.push(obj);
    })
  }

  //doi so trang
  onPageIndexChange(page) {
    this.pages.page = page;
  }

  //doi so luong phan tu tren 1 trang
  onPageSizeChange(size) {
    this.pages.size = size;
  }

  // chuc nang check role
  async onSubmit(mcn: String, lyDoTuChoi: string) {
    if (this.id) {
      const requestGroupButtons = {
        id: this.id,
        maChucNang: mcn,
        lyDoTuChoi: lyDoTuChoi,
      };
      this.spinner.show();
      await this.quanLyVonPhiService.approveBaoCao(requestGroupButtons).toPromise().then(async (data) => {
        if (data.statusCode == 0) {
          await this.getDetailReport();
          this.getStatusButton();
          if (mcn == Utils.TT_BC_8 || mcn == Utils.TT_BC_5 || mcn == Utils.TT_BC_3) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.REJECT_SUCCESS);
          } else {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.APPROVE_SUCCESS);
          }
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

  // click o checkbox single
  updateSingleChecked(): void {
    if (this.baoCao?.lstBCao.every(item => !item.checked)) {           // tat ca o checkbox deu = false thi set o checkbox all = false
      this.allChecked = false;
      this.indeterminate = false;
    } else if (this.baoCao?.lstBCao.every(item => item.checked)) {     // tat ca o checkbox deu = true thi set o checkbox all = true
      this.allChecked = true;
      this.indeterminate = false;
    } else {                                                        // o checkbox vua = false, vua = true thi set o checkbox all = indeterminate
      this.indeterminate = true;
    }
  }

  // update all
  updateAllChecked(): void {
    this.indeterminate = false;                               // thuoc tinh su kien o checkbox all
    if (this.allChecked) {                                    // checkboxall == true thi set lai lstCTietBCao.checked = true
      this.baoCao.lstBCao = this.baoCao?.lstBCao.map(item => ({
        ...item,
        checked: true
      }));
    } else {
      this.baoCao.lstBCao = this.baoCao?.lstBCao.map(item => ({    // checkboxall == false thi set lai lstCTietBCao.checked = false
        ...item,
        checked: false
      }));
    }
  }

  // click o checkbox single
  updateSingleCheckedTemp(): void {
    if (this.danhSachChiTietPhuLucTemp.every(item => !item.checked)) {           // tat ca o checkbox deu = false thi set o checkbox all = false
      this.allCheckedTemp = false;
      this.indeterminateTemp = false;
    } else if (this.danhSachChiTietPhuLucTemp.every(item => item.checked)) {     // tat ca o checkbox deu = true thi set o checkbox all = true
      this.allCheckedTemp = true;
      this.indeterminateTemp = false;
    } else {                                                        // o checkbox vua = false, vua = true thi set o checkbox all = indeterminate
      this.indeterminateTemp = true;
    }
  }

  // update all
  updateAllCheckedTemp(): void {
    this.indeterminateTemp = false;                               // thuoc tinh su kien o checkbox all
    if (this.allCheckedTemp) {                                    // checkboxall == true thi set lai lstCTietBCao.checked = true
      this.danhSachChiTietPhuLucTemp = this.danhSachChiTietPhuLucTemp.map(item => ({
        ...item,
        checked: true
      }));
    } else {
      this.danhSachChiTietPhuLucTemp = this.danhSachChiTietPhuLucTemp.map(item => ({    // checkboxall == false thi set lai lstCTietBCao.checked = false
        ...item,
        checked: false
      }));
    }
  }

  exportData() {
    var workbook = XLSX.utils.book_new();
    const tableLuongThuc = document
      .getElementById('table-luong-thuc')
      .getElementsByTagName('table');
    if (tableLuongThuc && tableLuongThuc.length > 0) {
      let sheetLuongThuc = XLSX.utils.table_to_sheet(tableLuongThuc[0]);
      sheetLuongThuc['!cols'] = [];
      sheetLuongThuc['!cols'][24] = { hidden: true };
      sheetLuongThuc['!cols'][25] = { hidden: true };
      XLSX.utils.book_append_sheet(workbook, sheetLuongThuc, 'sheetLuongThuc');
    }
    const tableMuoi = document
      .getElementById('table-muoi')
      .getElementsByTagName('table');
    if (tableMuoi && tableMuoi.length > 0) {
      let sheetMuoi = XLSX.utils.table_to_sheet(tableMuoi[0]);
      sheetMuoi['!cols'] = [];
      sheetMuoi['!cols'][12] = { hidden: true };
      sheetMuoi['!cols'][13] = { hidden: true };
      XLSX.utils.book_append_sheet(workbook, sheetMuoi, 'sheetMuoi');
    }
    const tableVatTu = document
      .getElementById('table-vat-tu')
      .getElementsByTagName('table');
    if (tableVatTu && tableVatTu.length > 0) {
      let sheetVatTu = XLSX.utils.table_to_sheet(tableVatTu[0]);
      XLSX.utils.book_append_sheet(workbook, sheetVatTu, 'sheetVatTu');
    }
    XLSX.writeFile(workbook, 'thong-tin-chi-tieu-ke-hoach-nam.xlsx');
  }

  async importFileData(event: any) {
    this.spinner.show();
    try {
      const element = event.currentTarget as HTMLInputElement;
      let fileList: FileList | null = element.files;
      element.value = null;
      this.spinner.hide();
    } catch (e) {
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  // doi tab
  changeTab(maPhuLuc, trangThaiChiTiet) {
    let checkSaveEdit;
    if (!this.maDviTien) {
      this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
      return;
    }
    debugger
    //check xem tat ca cac dong du lieu da luu chua?
    //chua luu thi bao loi, luu roi thi cho di
    this.danhSachChiTietPhuLucTemp.filter(element => {
      if (this.editCache[element.id].edit === true) {
        checkSaveEdit = false
      }
    });
    this.lstCTietBCaoPL1.filter(element => {
      if (this.editCachePL1[element.id].edit === true) {
        checkSaveEdit = false
      }
    });

    if (checkSaveEdit == false) {
      this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTSAVE);
      return;
    }

    // set ma don vi tien trong list chinh = ma don vi tien vua chon tai man hinh
    this.baoCao?.lstBCao.find(item => { if (item.maLoai == this.tabSelected) { item.maDviTien = this.maDviTien, item.thuyetMinh = this.thuyetMinh } });

    this.tabSelected = maPhuLuc;
    // set listBCaoTemp theo ma phu luc vua chon
    let lstBCaoTemp = this.baoCao?.lstBCao.find(item => item.maLoai == maPhuLuc);
    this.danhSachChiTietPhuLucTemp = lstBCaoTemp?.lstCTietBCao;
    this.maDviTien = lstBCaoTemp?.maDviTien;
    this.thuyetMinh = lstBCaoTemp?.thuyetMinh;
    this.trangThaiChiTiet = trangThaiChiTiet;
    this.danhSachChiTietPhuLucTemp.filter(data => {
      switch (maPhuLuc) {
        // phu luc 1
        case PHULUCLIST[0].maPhuLuc:
          data.kphiSdungTcong = divMoney(data.kphiSdungTcong, this.maDviTien);
          data.kphiSdungDtoan = divMoney(data.kphiSdungDtoan, this.maDviTien);
          data.kphiSdungNguonKhac = divMoney(data.kphiSdungNguonKhac, this.maDviTien);
          data.kphiSdungNguonQuy = divMoney(data.kphiSdungNguonQuy, this.maDviTien);
          data.kphiSdungNstt = divMoney(data.kphiSdungNstt, this.maDviTien);
          data.kphiSdungCk = divMoney(data.kphiSdungCk, this.maDviTien);
          data.kphiChuyenSangTcong = divMoney(data.kphiChuyenSangTcong, this.maDviTien);
          data.kphiChuyenSangDtoan = divMoney(data.kphiChuyenSangDtoan, this.maDviTien);
          data.kphiChuyenSangNguonKhac = divMoney(data.kphiChuyenSangNguonKhac, this.maDviTien);
          data.kphiChuyenSangNguonQuy = divMoney(data.kphiChuyenSangNguonQuy, this.maDviTien);
          data.kphiChuyenSangNstt = divMoney(data.kphiChuyenSangNstt, this.maDviTien);
          data.kphiChuyenSangCk = divMoney(data.kphiChuyenSangCk, this.maDviTien);
          data.dtoanGiaoTcong = divMoney(data.dtoanGiaoTcong, this.maDviTien);
          data.dtoanGiaoDtoan = divMoney(data.dtoanGiaoDtoan, this.maDviTien);
          data.dtoanGiaoNguonKhac = divMoney(data.dtoanGiaoNguonKhac, this.maDviTien);
          data.dtoanGiaoNguonQuy = divMoney(data.dtoanGiaoNguonQuy, this.maDviTien);
          data.dtoanGiaoNstt = divMoney(data.dtoanGiaoNstt, this.maDviTien);
          data.dtoanGiaoCk = divMoney(data.dtoanGiaoCk, this.maDviTien);
          data.giaiNganThangBcaoTcong = divMoney(data.giaiNganThangBcaoTcong, this.maDviTien);
          data.giaiNganThangBcaoDtoan = divMoney(data.giaiNganThangBcaoDtoan, this.maDviTien);
          data.giaiNganThangBcaoNguonKhac = divMoney(data.giaiNganThangBcaoNguonKhac, this.maDviTien);
          data.giaiNganThangBcaoNguonQuy = divMoney(data.giaiNganThangBcaoNguonQuy, this.maDviTien);
          data.giaiNganThangBcaoNstt = divMoney(data.giaiNganThangBcaoNstt, this.maDviTien);
          data.giaiNganThangBcaoCk = divMoney(data.giaiNganThangBcaoCk, this.maDviTien);
          data.luyKeGiaiNganTcong = divMoney(data.luyKeGiaiNganTcong, this.maDviTien);
          data.luyKeGiaiNganDtoan = divMoney(data.luyKeGiaiNganDtoan, this.maDviTien);
          data.luyKeGiaiNganNguonKhac = divMoney(data.luyKeGiaiNganNguonKhac, this.maDviTien);
          data.luyKeGiaiNganNguonQuy = divMoney(data.luyKeGiaiNganNguonQuy, this.maDviTien);
          data.luyKeGiaiNganNstt = divMoney(data.luyKeGiaiNganNstt, this.maDviTien);
          data.luyKeGiaiNganCk = divMoney(data.luyKeGiaiNganCk, this.maDviTien);
          break;

        // phu luc 2
        case PHULUCLIST[1].maPhuLuc:
          data.dtoanSdungNamTcong = divMoney(data.dtoanSdungNamTcong, this.maDviTien);
          data.dtoanSdungNamNguonNsnn = divMoney(data.dtoanSdungNamNguonNsnn, this.maDviTien);
          data.dtoanSdungNamNguonSn = divMoney(data.dtoanSdungNamNguonSn, this.maDviTien);
          data.dtoanSdungNamNguonQuy = divMoney(data.dtoanSdungNamNguonQuy, this.maDviTien);
          data.giaiNganThangTcong = divMoney(data.giaiNganThangTcong, this.maDviTien);
          data.giaiNganThangNguonNsnn = divMoney(data.giaiNganThangNguonNsnn, this.maDviTien);
          data.giaiNganThangNguonSn = divMoney(data.giaiNganThangNguonSn, this.maDviTien);
          data.giaiNganThangNguonQuy = divMoney(data.giaiNganThangNguonQuy, this.maDviTien);
          data.luyKeGiaiNganTcong = divMoney(data.luyKeGiaiNganTcong, this.maDviTien);
          data.luyKeGiaiNganNguonNsnn = divMoney(data.luyKeGiaiNganNguonNsnn, this.maDviTien);
          data.luyKeGiaiNganNguonSn = divMoney(data.luyKeGiaiNganNguonSn, this.maDviTien);
          data.luyKeGiaiNganNguonQuy = divMoney(data.luyKeGiaiNganNguonQuy, this.maDviTien);
          break;

        // phu luc 3
        case PHULUCLIST[2].maPhuLuc:
          data.qddtTmdtTso = divMoney(data.qddtTmdtTso, this.maDviTien);
          data.qddtTmdtNsnn = divMoney(data.qddtTmdtNsnn, this.maDviTien);
          data.luyKeVonTso = divMoney(data.luyKeVonTso, this.maDviTien);
          data.luyKeVonNsnn = divMoney(data.luyKeVonNsnn, this.maDviTien);
          data.luyKeVonDt = divMoney(data.luyKeVonDt, this.maDviTien);
          data.luyKeVonThue = divMoney(data.luyKeVonThue, this.maDviTien);
          data.luyKeVonScl = divMoney(data.luyKeVonScl, this.maDviTien);
          data.luyKeGiaiNganHetNamTso = divMoney(data.luyKeGiaiNganHetNamTso, this.maDviTien);
          data.luyKeGiaiNganHetNamNsnnTso = divMoney(data.luyKeGiaiNganHetNamNsnnTso, this.maDviTien);
          data.luyKeGiaiNganHetNamNsnnKhNamTruoc = divMoney(data.luyKeGiaiNganHetNamNsnnKhNamTruoc, this.maDviTien);
          data.khoachVonNamTruocKeoDaiTso = divMoney(data.khoachVonNamTruocKeoDaiTso, this.maDviTien);
          data.khoachVonNamTruocKeoDaiDtpt = divMoney(data.khoachVonNamTruocKeoDaiDtpt, this.maDviTien);
          data.khoachVonNamTruocKeoDaiVonKhac = divMoney(data.khoachVonNamTruocKeoDaiVonKhac, this.maDviTien);
          data.khoachNamVonTso = divMoney(data.khoachNamVonTso, this.maDviTien);
          data.khoachNamVonNsnn = divMoney(data.khoachNamVonNsnn, this.maDviTien);
          data.khoachNamVonDt = divMoney(data.khoachNamVonDt, this.maDviTien);
          data.khoachNamVonThue = divMoney(data.khoachNamVonThue, this.maDviTien);
          data.khoachNamVonScl = divMoney(data.khoachNamVonScl, this.maDviTien);
          data.giaiNganTso = divMoney(data.giaiNganTso, this.maDviTien);
          data.giaiNganNsnn = divMoney(data.giaiNganNsnn, this.maDviTien);
          data.giaiNganNsnnVonDt = divMoney(data.giaiNganNsnnVonDt, this.maDviTien);
          data.giaiNganNsnnVonThue = divMoney(data.giaiNganNsnnVonThue, this.maDviTien);
          data.giaiNganNsnnVonScl = divMoney(data.giaiNganNsnnVonScl, this.maDviTien);
          data.luyKeGiaiNganDauNamTso = divMoney(data.luyKeGiaiNganDauNamTso, this.maDviTien);
          data.luyKeGiaiNganDauNamNsnn = divMoney(data.luyKeGiaiNganDauNamNsnn, this.maDviTien);
          data.luyKeGiaiNganDauNamNsnnVonDt = divMoney(data.luyKeGiaiNganDauNamNsnnVonDt, this.maDviTien);
          data.luyKeGiaiNganDauNamNsnnVonThue = divMoney(data.luyKeGiaiNganDauNamNsnnVonThue, this.maDviTien);
          data.luyKeGiaiNganDauNamNsnnVonScl = divMoney(data.luyKeGiaiNganDauNamNsnnVonScl, this.maDviTien);
          break;
        default:
          break;
      }
    });
    this.getStatusButtonOk();
  }

  getStatusButtonOk() {
    const utils = new Utils();
    let checkParent = false;
    let checkChirld = false;
    let dVi = this.donVis.find(e => e.maDvi == this.maDonViTao);
    if (dVi && dVi.maDvi == this.userInfo.dvql) {
      checkChirld = true;
    }
    if (dVi && dVi.parent?.maDvi == this.userInfo.dvql) {
      checkParent = true;
    }

    let a = this.userInfo?.roles[0]?.code;
    if (this.baoCao?.trangThai == Utils.TT_BC_7 && this.userInfo?.roles[0]?.code == '3' && checkParent && this.trangThaiChiTiet == 2) {
      this.statusBtnOk = false;
    } else if (this.baoCao?.trangThai == Utils.TT_BC_2 && this.userInfo?.roles[0]?.code == '2' && checkChirld && this.trangThaiChiTiet == 2) {
      this.statusBtnOk = false;
    } else if (this.baoCao?.trangThai == Utils.TT_BC_4 && this.userInfo?.roles[0]?.code == '1' && checkChirld && this.trangThaiChiTiet == 2) {
      this.statusBtnOk = false;
    } else {
      this.statusBtnOk = true;
    }
  }

  changeModel(id) {

  }
  changeModelPL1(id) {

  }

  changeModelPL2(id) {
    this.editCache[id].data.dtoanSdungNamTcong = this.editCache[id].data.dtoanSdungNamNguonNsnn + this.editCache[id].data.dtoanSdungNamNguonSn;
    this.editCache[id].data.giaiNganThangTcong = this.editCache[id].data.giaiNganThangNguonNsnn + this.editCache[id].data.giaiNganThangNguonSn + this.editCache[id].data.giaiNganThangNguonQuy;
    this.editCache[id].data.luyKeGiaiNganTcong = this.editCache[id].data.luyKeGiaiNganNguonNsnn + this.editCache[id].data.luyKeGiaiNganNguonSn + this.editCache[id].data.luyKeGiaiNganNguonQuy;
  }

  changeModelPL3(id) {

  }

  // xoa dong
  deleteById(id: any): void {
    this.danhSachChiTietPhuLucTemp = this.danhSachChiTietPhuLucTemp.filter(item => item.id != id)
    if (id?.length == 38) {
      this.listIdDelete += id + ",";
    }
  }

  // start edit
  startEdit(id: string): void {
    this.editCache[id].edit = true;
  }

  // them dong moi
  addLine(id: number): void {
    let item;
    if (this.tabSelected == TAB_SELECTED.phuLuc1) {
      item = {
        id: uuid.v4()+'FE',
        checked: false,
      }
    } else if (this.tabSelected == TAB_SELECTED.phuLuc2) {
      item = {
        id: uuid.v4()+'FE',
        dtoanSdungNamTcong: 0,
        dtoanSdungNamNguonNsnn: 0,
        dtoanSdungNamNguonSn: 0,
        dtoanSdungNamNguonQuy: 0,
        giaiNganThangTcong: 0,
        giaiNganThangTcongTle: 0,
        giaiNganThangNguonNsnn: 0,
        giaiNganThangNguonNsnnTl: 0,
        giaiNganThangNguonSn: 0,
        giaiNganThangNguonSnTle: 0,
        giaiNganThangNguonQuy: 0,
        giaiNganThangNguonQuyTle: 0,
        luyKeGiaiNganTcong: 0,
        luyKeGiaiNganTcongTle: 0,
        luyKeGiaiNganNguonNsnn: 0,
        luyKeGiaiNganNguonNsnnTl: 0,
        luyKeGiaiNganNguonSn: 0,
        luyKeGiaiNganNguonSnTle: 0,
        luyKeGiaiNganNguonQuy: 0,
        luyKeGiaiNganNguonQuyTle: 0,
        checked: false,
      }
    } else if (this.tabSelected == TAB_SELECTED.phuLuc3) {
      item = {
        id: uuid.v4()+'FE',
        luyKeVonTso: 0,
        luyKeVonNsnn: 0,
        luyKeVonDt: 0,
        luyKeVonThue: 0,
        luyKeVonScl: 0,
        luyKeGiaiNganHetNamTso: 0,
        luyKeGiaiNganHetNamNsnnTso: 0,
        luyKeGiaiNganHetNamNsnnKhNamTruoc: 0,
        khoachVonNamTruocKeoDaiTso: 0,
        khoachVonNamTruocKeoDaiDtpt: 0,
        khoachVonNamTruocKeoDaiVonKhac: 0,
        khoachNamVonTso: 0,
        khoachNamVonNsnn: 0,
        khoachNamVonDt: 0,
        khoachNamVonThue: 0,
        khoachNamVonScl: 0,
        kluongThienTso: 0,
        kluongThienThangBcao: 0,
        giaiNganTso: 0,
        giaiNganTsoTle: 0,
        giaiNganNsnn: 0,
        giaiNganNsnnVonDt: 0,
        giaiNganNsnnVonThue: 0,
        giaiNganNsnnVonScl: 0,
        giaiNganNsnnTle: 0,
        giaiNganNsnnTleVonDt: 0,
        giaiNganNsnnTleVonThue: 0,
        giaiNganNsnnTleVonScl: 0,
        luyKeGiaiNganDauNamTso: 0,
        luyKeGiaiNganDauNamTsoTle: 0,
        luyKeGiaiNganDauNamNsnn: 0,
        luyKeGiaiNganDauNamNsnnVonDt: 0,
        luyKeGiaiNganDauNamNsnnVonThue: 0,
        luyKeGiaiNganDauNamNsnnVonScl: 0,
        luyKeGiaiNganDauNamNsnnTle: 0,
        luyKeGiaiNganDauNamNsnnTleVonDt: 0,
        luyKeGiaiNganDauNamNsnnTleVonThu: 0,
        luyKeGiaiNganDauNamNsnnTleVonScl: 0,
        checked: false,
      }
    }
    this.danhSachChiTietPhuLucTemp.splice(id, 0, item);
    this.editCache[item.id] = {
      edit: true,
      data: { ...item }
    };
  }

  // huy thay doi
  cancelEdit(id: string): void {
    const index = this.danhSachChiTietPhuLucTemp.findIndex(item => item.id === id);  // lay vi tri hang minh sua
    this.editCache[id] = {
      data: { ...this.danhSachChiTietPhuLucTemp[index] },
      edit: false
    };
  }

  // luu thay doi
  saveEdit(id: string): void {
    this.editCache[id].data.checked = this.danhSachChiTietPhuLucTemp.find(item => item.id === id).checked; // set checked editCache = checked lstCTietBCao
    const index = this.danhSachChiTietPhuLucTemp.findIndex(item => item.id === id);   // lay vi tri hang minh sua
    Object.assign(this.danhSachChiTietPhuLucTemp[index], this.editCache[id].data); // set lai data cua lstCTietBCao[index] = this.editCache[id].data
    this.editCache[id].edit = false;  // CHUYEN VE DANG TEXT
  }

  // xoa voi checkbox
  deleteSelected() {
    // add list delete id
    this.danhSachChiTietPhuLucTemp.filter(item => {
      if (item.checked == true && item?.id?.length == 38) {
        this.listIdDelete += item.id + ","
      }
    })
    // delete object have checked = true
    this.danhSachChiTietPhuLucTemp = this.danhSachChiTietPhuLucTemp.filter(item => item.checked != true)
    this.allCheckedTemp = false;
  }

  // luu temp vao bang chinh
  saveTemp() {
    this.baoCao?.lstBCao.forEach(item => {
      if (item.maLoai == this.tabSelected) {
        item.lstCTietBCao = this.danhSachChiTietPhuLucTemp;
      }
    });
    this.tabSelected = null;
  }

  // xoa phu luc
  deletePhuLucList() {
    this.baoCao.lstBCao = this.baoCao?.lstBCao.filter(item => item.checked == false);
    if (this.baoCao?.lstBCao?.findIndex(item => item.maLoai == this.tabSelected) == -1) {
      this.tabSelected = null;
    }
    this.allChecked = false;
  }

  // them phu luc
  addPhuLuc() {
    PHULUCLIST.forEach(item => item.status = false);
    var danhSach = PHULUCLIST.filter(item => this.baoCao?.lstBCao?.findIndex(data => data.maLoai == item.maPhuLuc) == -1);

    const modalIn = this.modal.create({
      nzTitle: 'Danh sách phụ lục',
      nzContent: DialogLuaChonThemPhuLucComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '600px',
      nzFooter: null,
      nzComponentParams: {
        danhSachPhuLuc: danhSach
      },
    });
    modalIn.afterClose.subscribe((res) => {
      if (res) {
        res.forEach(item => {
          if (item.status) {
            this.baoCao.lstBCao.push({
              id: uuid.v4()+'FE',
              checked: false,
              tieuDe: item.tieuDe,
              maLoai: item.maPhuLuc,
              tenPhuLuc: item.tenPhuLuc,
              trangThai: '2',
              lstCTietBCao: [],
              maDviTien: '1',
              thuyetMinh: null,
              lyDoTuChoi:null,
            });
          }
        })
      }
    });
  }

  // them file vao danh sach
  handleUpload(): void {
    this.fileList.forEach((file: any) => {
      const id = file?.lastModified.toString();
      this.lstFile.push({ id: id, fileName: file?.name });
      this.listFile.push(file);
    });
    this.fileList = [];
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

  //download file về máy tính
  async downloadFileCv() {
    if (this.baoCao?.congVan?.fileUrl) {
      await this.quanLyVonPhiService.downloadFile(this.baoCao?.congVan?.fileUrl).toPromise().then(
        (data) => {
          fileSaver.saveAs(data, this.baoCao?.congVan?.fileName);
        },
        err => {
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        },
      );
    } else {
      let file: any = this.fileDetail ;
      const blob = new Blob([file], { type: "application/octet-stream" });
      fileSaver.saveAs(blob, file.name);
    }
  }

  // xoa file trong bang file
  deleteFile(id: string): void {
    this.lstFile = this.lstFile.filter((a: any) => a.id !== id);
    this.listFile = this.listFile.filter((a: any) => a?.lastModified.toString() !== id);
  }

  // before uploaf file
  beforeUpload = (file: NzUploadFile): boolean => {
    this.fileList = this.fileList.concat(file);
    return false;
  };

  // before uploaf file
  beforeUploadCV = (file: NzUploadFile): boolean => {
    this.fileDetail = file;
    this.baoCao.congVan = {
      fileName: file.name,
      fileSize: null,
      fileUrl: null,
    };
    return false;
  };

  // luu
  async save() {

    // set ma don vi tien trong list chinh = ma don vi tien vua chon tai man hinh
    this.baoCao?.lstBCao.find(item => { if (item.maLoai == this.tabSelected) { item.maDviTien = this.maDviTien, item.thuyetMinh = this.thuyetMinh } });

    let baoCaoTemp = JSON.parse(JSON.stringify(this.baoCao));
    
    //get list file url
    let listFile: any = [];
    for (const iterator of this.listFile) {
      listFile.push(await this.uploadFile(iterator));
    }

    //get file cong van url
    let file:any = this.fileDetail;
    if(file){
      baoCaoTemp.congVan = await this.uploadFile(file);
    }

    let checkMoneyRange = true;
    let lstCTietBCaoPL1Temp = JSON.parse(JSON.stringify(this.lstCTietBCaoPL1));
    // replace nhung ban ghi dc them moi id thanh null
    baoCaoTemp?.lstBCao?.filter(item => {
      if (item.id?.length == 38) {
        item.id = null;
      }
      item.trangThai = '2'; // set trang thai phu luc la chua danh gia
      if (item.maLoai == PHULUCLIST[0].maPhuLuc) {
        item.lstCTietBCao = lstCTietBCaoPL1Temp;
      }
      item?.lstCTietBCao.filter(data => {
        if (item.id?.length == 38) {
          data.id = null;
        }
        switch (item.maLoai) {
          // phu luc 1
          case PHULUCLIST[0].maPhuLuc:
            data.kphiSdungTcong = divMoney(data.kphiSdungTcong, item.maDviTien);
            data.kphiSdungDtoan = mulMoney(data.kphiSdungDtoan, item.maDviTien);
            data.kphiSdungNguonKhac = mulMoney(data.kphiSdungNguonKhac, item.maDviTien);
            data.kphiSdungNguonQuy = mulMoney(data.kphiSdungNguonQuy, item.maDviTien);
            data.kphiSdungNstt = mulMoney(data.kphiSdungNstt, item.maDviTien);
            data.kphiSdungCk = mulMoney(data.kphiSdungCk, item.maDviTien);
            data.kphiChuyenSangTcong = mulMoney(data.kphiChuyenSangTcong, item.maDviTien);
            data.kphiChuyenSangDtoan = mulMoney(data.kphiChuyenSangDtoan, item.maDviTien);
            data.kphiChuyenSangNguonKhac = mulMoney(data.kphiChuyenSangNguonKhac, item.maDviTien);
            data.kphiChuyenSangNguonQuy = mulMoney(data.kphiChuyenSangNguonQuy, item.maDviTien);
            data.kphiChuyenSangNstt = mulMoney(data.kphiChuyenSangNstt, item.maDviTien);
            data.kphiChuyenSangCk = mulMoney(data.kphiChuyenSangCk, item.maDviTien);
            data.dtoanGiaoTcong = mulMoney(data.dtoanGiaoTcong, item.maDviTien);
            data.dtoanGiaoDtoan = mulMoney(data.dtoanGiaoDtoan, item.maDviTien);
            data.dtoanGiaoNguonKhac = mulMoney(data.dtoanGiaoNguonKhac, item.maDviTien);
            data.dtoanGiaoNguonQuy = mulMoney(data.dtoanGiaoNguonQuy, item.maDviTien);
            data.dtoanGiaoNstt = mulMoney(data.dtoanGiaoNstt, item.maDviTien);
            data.dtoanGiaoCk = mulMoney(data.dtoanGiaoCk, item.maDviTien);
            data.giaiNganThangBcaoTcong = mulMoney(data.giaiNganThangBcaoTcong, item.maDviTien);
            data.giaiNganThangBcaoDtoan = mulMoney(data.giaiNganThangBcaoDtoan, item.maDviTien);
            data.giaiNganThangBcaoNguonKhac = mulMoney(data.giaiNganThangBcaoNguonKhac, item.maDviTien);
            data.giaiNganThangBcaoNguonQuy = mulMoney(data.giaiNganThangBcaoNguonQuy, item.maDviTien);
            data.giaiNganThangBcaoNstt = mulMoney(data.giaiNganThangBcaoNstt, item.maDviTien);
            data.giaiNganThangBcaoCk = mulMoney(data.giaiNganThangBcaoCk, item.maDviTien);
            data.luyKeGiaiNganTcong = mulMoney(data.luyKeGiaiNganTcong, item.maDviTien);
            data.luyKeGiaiNganDtoan = mulMoney(data.luyKeGiaiNganDtoan, item.maDviTien);
            data.luyKeGiaiNganNguonKhac = mulMoney(data.luyKeGiaiNganNguonKhac, item.maDviTien);
            data.luyKeGiaiNganNguonQuy = mulMoney(data.luyKeGiaiNganNguonQuy, item.maDviTien);
            data.luyKeGiaiNganNstt = mulMoney(data.luyKeGiaiNganNstt, item.maDviTien);
            data.luyKeGiaiNganCk = mulMoney(data.luyKeGiaiNganCk, item.maDviTien);

            if (data.kphiSdungTcong > MONEYLIMIT || data.kphiSdungDtoan > MONEYLIMIT || data.kphiSdungNguonKhac > MONEYLIMIT ||
              data.kphiSdungNguonQuy > MONEYLIMIT || data.kphiSdungNstt > MONEYLIMIT || data.kphiSdungCk > MONEYLIMIT ||
              data.kphiChuyenSangTcong > MONEYLIMIT || data.kphiChuyenSangDtoan > MONEYLIMIT || data.kphiChuyenSangNguonKhac > MONEYLIMIT ||
              data.kphiChuyenSangNguonQuy > MONEYLIMIT || data.kphiChuyenSangNstt > MONEYLIMIT || data.kphiChuyenSangCk > MONEYLIMIT ||
              data.dtoanGiaoTcong > MONEYLIMIT || data.dtoanGiaoDtoan > MONEYLIMIT || data.dtoanGiaoNguonKhac > MONEYLIMIT ||
              data.dtoanGiaoNguonQuy > MONEYLIMIT || data.dtoanGiaoNstt > MONEYLIMIT || data.dtoanGiaoCk > MONEYLIMIT ||
              data.giaiNganThangBcaoTcong > MONEYLIMIT || data.giaiNganThangBcaoDtoan > MONEYLIMIT || data.giaiNganThangBcaoNguonKhac > MONEYLIMIT ||
              data.giaiNganThangBcaoNguonQuy > MONEYLIMIT || data.giaiNganThangBcaoNstt > MONEYLIMIT || data.giaiNganThangBcaoCk > MONEYLIMIT ||
              data.luyKeGiaiNganTcong > MONEYLIMIT || data.luyKeGiaiNganDtoan > MONEYLIMIT || data.luyKeGiaiNganNguonKhac > MONEYLIMIT ||
              data.luyKeGiaiNganNguonQuy > MONEYLIMIT || data.luyKeGiaiNganNstt > MONEYLIMIT || data.luyKeGiaiNganCk > MONEYLIMIT) {

              checkMoneyRange = false;
              return;
            }
            break;

          // phu luc 2
          case PHULUCLIST[1].maPhuLuc:
            data.dtoanSdungNamTcong = mulMoney(data.dtoanSdungNamTcong, item.maDviTien);
            data.dtoanSdungNamNguonNsnn = mulMoney(data.dtoanSdungNamNguonNsnn, item.maDviTien);
            data.dtoanSdungNamNguonSn = mulMoney(data.dtoanSdungNamNguonSn, item.maDviTien);
            data.dtoanSdungNamNguonQuy = mulMoney(data.dtoanSdungNamNguonQuy, item.maDviTien);
            data.giaiNganThangTcong = mulMoney(data.giaiNganThangTcong, item.maDviTien);
            data.giaiNganThangNguonNsnn = mulMoney(data.giaiNganThangNguonNsnn, item.maDviTien);
            data.giaiNganThangNguonSn = mulMoney(data.giaiNganThangNguonSn, item.maDviTien);
            data.giaiNganThangNguonQuy = mulMoney(data.giaiNganThangNguonQuy, item.maDviTien);
            data.luyKeGiaiNganTcong = mulMoney(data.luyKeGiaiNganTcong, item.maDviTien);
            data.luyKeGiaiNganNguonNsnn = mulMoney(data.luyKeGiaiNganNguonNsnn, item.maDviTien);
            data.luyKeGiaiNganNguonSn = mulMoney(data.luyKeGiaiNganNguonSn, item.maDviTien);
            data.luyKeGiaiNganNguonQuy = mulMoney(data.luyKeGiaiNganNguonQuy, item.maDviTien);

            if (data.dtoanSdungNamTcong > MONEYLIMIT || data.dtoanSdungNamNguonNsnn > MONEYLIMIT || data.dtoanSdungNamNguonSn > MONEYLIMIT ||
              data.dtoanSdungNamNguonQuy > MONEYLIMIT || data.giaiNganThangTcong > MONEYLIMIT || data.giaiNganThangNguonNsnn > MONEYLIMIT ||
              data.giaiNganThangNguonSn > MONEYLIMIT || data.giaiNganThangNguonQuy > MONEYLIMIT || data.luyKeGiaiNganTcong > MONEYLIMIT ||
              data.luyKeGiaiNganNguonNsnn > MONEYLIMIT || data.luyKeGiaiNganNguonSn > MONEYLIMIT || data.luyKeGiaiNganNguonQuy > MONEYLIMIT) {
              checkMoneyRange = false;
              return;
            }
            break;

          // phu luc 3
          case PHULUCLIST[2].maPhuLuc:
            data.qddtTmdtTso = mulMoney(data.qddtTmdtTso, item.maDviTien);
            data.qddtTmdtNsnn = mulMoney(data.qddtTmdtNsnn, item.maDviTien);
            data.luyKeVonTso = mulMoney(data.luyKeVonTso, item.maDviTien);
            data.luyKeVonNsnn = mulMoney(data.luyKeVonNsnn, item.maDviTien);
            data.luyKeVonDt = mulMoney(data.luyKeVonDt, item.maDviTien);
            data.luyKeVonThue = mulMoney(data.luyKeVonThue, item.maDviTien);
            data.luyKeVonScl = mulMoney(data.luyKeVonScl, item.maDviTien);
            data.luyKeGiaiNganHetNamTso = mulMoney(data.luyKeGiaiNganHetNamTso, item.maDviTien);
            data.luyKeGiaiNganHetNamNsnnTso = mulMoney(data.luyKeGiaiNganHetNamNsnnTso, item.maDviTien);
            data.luyKeGiaiNganHetNamNsnnKhNamTruoc = mulMoney(data.luyKeGiaiNganHetNamNsnnKhNamTruoc, item.maDviTien);
            data.khoachVonNamTruocKeoDaiTso = mulMoney(data.khoachVonNamTruocKeoDaiTso, item.maDviTien);
            data.khoachVonNamTruocKeoDaiDtpt = mulMoney(data.khoachVonNamTruocKeoDaiDtpt, item.maDviTien);
            data.khoachVonNamTruocKeoDaiVonKhac = mulMoney(data.khoachVonNamTruocKeoDaiVonKhac, item.maDviTien);
            data.khoachNamVonTso = mulMoney(data.khoachNamVonTso, item.maDviTien);
            data.khoachNamVonNsnn = mulMoney(data.khoachNamVonNsnn, item.maDviTien);
            data.khoachNamVonDt = mulMoney(data.khoachNamVonDt, item.maDviTien);
            data.khoachNamVonThue = mulMoney(data.khoachNamVonThue, item.maDviTien);
            data.khoachNamVonScl = mulMoney(data.khoachNamVonScl, item.maDviTien);
            data.giaiNganTso = mulMoney(data.giaiNganTso, item.maDviTien);
            data.giaiNganNsnn = mulMoney(data.giaiNganNsnn, item.maDviTien);
            data.giaiNganNsnnVonDt = mulMoney(data.giaiNganNsnnVonDt, item.maDviTien);
            data.giaiNganNsnnVonThue = mulMoney(data.giaiNganNsnnVonThue, item.maDviTien);
            data.giaiNganNsnnVonScl = mulMoney(data.giaiNganNsnnVonScl, item.maDviTien);
            data.luyKeGiaiNganDauNamTso = mulMoney(data.luyKeGiaiNganDauNamTso, item.maDviTien);
            data.luyKeGiaiNganDauNamNsnn = mulMoney(data.luyKeGiaiNganDauNamNsnn, item.maDviTien);
            data.luyKeGiaiNganDauNamNsnnVonDt = mulMoney(data.luyKeGiaiNganDauNamNsnnVonDt, item.maDviTien);
            data.luyKeGiaiNganDauNamNsnnVonThue = mulMoney(data.luyKeGiaiNganDauNamNsnnVonThue, item.maDviTien);
            data.luyKeGiaiNganDauNamNsnnVonScl = mulMoney(data.luyKeGiaiNganDauNamNsnnVonScl, item.maDviTien);

            if (data.qddtTmdtTso > MONEYLIMIT || data.qddtTmdtNsnn > MONEYLIMIT || data.luyKeVonTso > MONEYLIMIT ||
              data.luyKeVonNsnn > MONEYLIMIT || data.luyKeVonDt > MONEYLIMIT || data.luyKeVonThue > MONEYLIMIT ||
              data.luyKeVonScl > MONEYLIMIT || data.luyKeGiaiNganHetNamTso > MONEYLIMIT || data.luyKeGiaiNganHetNamNsnnTso > MONEYLIMIT ||
              data.luyKeGiaiNganHetNamNsnnKhNamTruoc > MONEYLIMIT || data.khoachVonNamTruocKeoDaiTso > MONEYLIMIT || data.khoachVonNamTruocKeoDaiDtpt > MONEYLIMIT ||
              data.khoachVonNamTruocKeoDaiVonKhac > MONEYLIMIT || data.khoachNamVonTso > MONEYLIMIT || data.khoachNamVonNsnn > MONEYLIMIT ||
              data.khoachNamVonDt > MONEYLIMIT || data.khoachNamVonThue > MONEYLIMIT || data.khoachNamVonScl > MONEYLIMIT ||
              data.giaiNganTso > MONEYLIMIT || data.giaiNganNsnn > MONEYLIMIT || data.giaiNganNsnnVonDt > MONEYLIMIT ||
              data.giaiNganNsnnVonThue > MONEYLIMIT || data.giaiNganNsnnVonScl > MONEYLIMIT || data.luyKeGiaiNganDauNamTso > MONEYLIMIT ||
              data.luyKeGiaiNganDauNamNsnn > MONEYLIMIT || data.luyKeGiaiNganDauNamNsnnVonDt > MONEYLIMIT || data.luyKeGiaiNganDauNamNsnnVonThue > MONEYLIMIT ||
              data.luyKeGiaiNganDauNamNsnnVonScl > MONEYLIMIT) {
              checkMoneyRange = false;
              return;
            }
            break;
          default:
            break;
        }
      })
      if (!checkMoneyRange == true) {
        this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.MONEYRANGE);
      }
    })

    if (checkMoneyRange != true) {
      return;
    } else {
      // replace nhung ban ghi dc them moi id thanh null
      baoCaoTemp.tongHopTu = '';
      baoCaoTemp?.lstBCaoDviTrucThuoc?.filter(item => {
        baoCaoTemp.tongHopTu += item.id + ',';
      })

      baoCaoTemp.fileDinhKems = listFile;
      baoCaoTemp.listIdFiles = this.listIdFiles;
      baoCaoTemp.trangThai = "1";
      baoCaoTemp.maDvi = this.maDonViTao;
      baoCaoTemp.maPhanBcao = '0';

      //call service them moi
      this.spinner.show();
      if (this.id == null) {
        this.quanLyVonPhiService.trinhDuyetBaoCaoThucHienDTCService(baoCaoTemp).toPromise().then(
          async data => {
            if (data.statusCode == 0) {
              this.notification.success(MESSAGE.SUCCESS, MESSAGE.SUCCESS);
              this.id = data.data.id
              await this.getDetailReport();
              this.getStatusButton();
            } else {
              this.notification.error(MESSAGE.ERROR, data?.msg);
              this.spinner.hide();
            }
          },
          err => {
            this.spinner.hide();
            this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
          },
        );
      } else {
        this.quanLyVonPhiService.updateBaoCaoThucHienDTC(baoCaoTemp).toPromise().then(async res => {
          if (res.statusCode == 0) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.SUCCESS);
            this.id = res.data.id
            await this.getDetailReport();
            this.getStatusButton();
          } else {
            this.spinner.hide();
            this.notification.error(MESSAGE.ERROR, res?.msg);
          }
        }, err => {
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        })
      }
    }
    this.spinner.hide();
  }

  //upload file
  async uploadFile(file: File) {
    // day file len server
    const upfile: FormData = new FormData();
    upfile.append('file', file);
    upfile.append('folder', this.baoCao?.maBcao + '/' + this.maDonViTao + '/');
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

  lstCTietBCaoPL1: ItemDataPL1[] = [];        // list chi tiet bao cao

  chiTietBcaosPL1: linkList = {
    id: uuid.v4()+'FE',
    vt: 0,
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
    next: [],
    checked: false,
  };
  editCachePL1: { [key: string]: { edit: boolean; data: ItemDataPL1 } } = {};     // phuc vu nut chinh
  statusB: boolean = false;
  disable: boolean = false;
  stt: number;
  kt: boolean;
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

  // them dong moi phu luc 1
  addLinePL1(id: number): void {
    var lv: number = 0;
    if (id > 0) {
      lv = this.lstCTietBCaoPL1[id - 1].level;
    }
    let item: ItemDataPL1 = {
      maNdung: "",
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
      level: lv,
      stt: 0,
      id: uuid.v4()+'FE',
      checked: false,
    }

    this.lstCTietBCaoPL1.splice(id, 0, item);
    this.editCachePL1[item.id] = {
      edit: true,
      data: { ...item }
    };
    this.statusB = false;
    this.disable = true;
  }

  // lưu cấp con
  saveEdit2(id: string, index: number): void {
    var item: linkList = {
      id: uuid.v4()+'FE',
      vt: 0,
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
      next: [],
      checked: false,
    };

    this.kt = false;
    this.addLess(this.chiTietBcaosPL1, item, index);
    if (!this.kt) {
      this.addLess1(this.chiTietBcaosPL1, item);
    }
    this.stt = 0;
    this.updateSTT(this.chiTietBcaosPL1);
    this.updateLstCTietBCaoPL1();
    this.disable = false;
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

  updateLstCTietBCaoPL1() {
    this.lstCTietBCaoPL1 = [];
    this.duyet(this.chiTietBcaosPL1, '', 0, 0, -1);
    this.updateEditCachePL1();
  }

  //khoi tao
  duyet(data: linkList, str: string, index: number, parent: number, le: number) {

    if (index != 0) {
      let mm = {
        id: data.id,
        stt: str + index.toString(),
        maNdung: data.maNdung,
        kphiSdungTcong: data.kphiSdungTcong,
        kphiSdungDtoan: data.kphiSdungDtoan,
        kphiSdungNguonKhac: data.kphiSdungNguonKhac,
        kphiSdungNguonQuy: data.kphiSdungNguonQuy,
        kphiSdungNstt: data.kphiSdungNstt,
        kphiSdungCk: data.kphiSdungCk,
        kphiChuyenSangTcong: data.kphiChuyenSangTcong,
        kphiChuyenSangDtoan: data.kphiChuyenSangDtoan,
        kphiChuyenSangNguonKhac: data.kphiChuyenSangNguonKhac,
        kphiChuyenSangNguonQuy: data.kphiChuyenSangNguonQuy,
        kphiChuyenSangNstt: data.kphiChuyenSangNstt,
        kphiChuyenSangCk: data.kphiChuyenSangCk,
        dtoanGiaoTcong: data.dtoanGiaoTcong,
        dtoanGiaoDtoan: data.dtoanGiaoDtoan,
        dtoanGiaoNguonKhac: data.dtoanGiaoNguonKhac,
        dtoanGiaoNguonQuy: data.dtoanGiaoNguonQuy,
        dtoanGiaoNstt: data.dtoanGiaoNstt,
        dtoanGiaoCk: data.dtoanGiaoCk,
        giaiNganThangBcaoTcong: data.giaiNganThangBcaoTcong,
        giaiNganThangBcaoTcongTle: data.giaiNganThangBcaoTcongTle,
        giaiNganThangBcaoDtoan: data.giaiNganThangBcaoDtoan,
        giaiNganThangBcaoDtoanTle: data.giaiNganThangBcaoDtoanTle,
        giaiNganThangBcaoNguonKhac: data.giaiNganThangBcaoNguonKhac,
        giaiNganThangBcaoNguonKhacTle: data.giaiNganThangBcaoNguonKhacTle,
        giaiNganThangBcaoNguonQuy: data.giaiNganThangBcaoNguonQuy,
        giaiNganThangBcaoNguonQuyTle: data.giaiNganThangBcaoNguonQuyTle,
        giaiNganThangBcaoNstt: data.giaiNganThangBcaoNstt,
        giaiNganThangBcaoNsttTle: data.giaiNganThangBcaoNsttTle,
        giaiNganThangBcaoCk: data.giaiNganThangBcaoCk,
        giaiNganThangBcaoCkTle: data.giaiNganThangBcaoCkTle,
        luyKeGiaiNganTcong: data.luyKeGiaiNganTcong,
        luyKeGiaiNganTcongTle: data.luyKeGiaiNganTcongTle,
        luyKeGiaiNganDtoan: data.luyKeGiaiNganDtoan,
        luyKeGiaiNganDtoanTle: data.luyKeGiaiNganDtoanTle,
        luyKeGiaiNganNguonKhac: data.luyKeGiaiNganNguonKhac,
        luyKeGiaiNganNguonKhacTle: data.luyKeGiaiNganNguonKhacTle,
        luyKeGiaiNganNguonQuy: data.luyKeGiaiNganNguonQuy,
        luyKeGiaiNganNguonQuyTle: data.luyKeGiaiNganNguonQuyTle,
        luyKeGiaiNganNstt: data.luyKeGiaiNganNstt,
        luyKeGiaiNganNsttTle: data.luyKeGiaiNganNsttTle,
        luyKeGiaiNganCk: data.luyKeGiaiNganCk,
        luyKeGiaiNganCkTle: data.luyKeGiaiNganCkTle,
        level: le,
        // listCtiet: data.listCtiet,
        checked: false,
      };
      this.lstCTietBCaoPL1.push(mm);
    }
    if (data.next.length == 0) return;
    for (var i = 0; i < data.next.length; i++) {
      if (index == 0) {
        this.duyet(data.next[i], str, i + 1, data.vt, le + 1);
      } else {
        this.duyet(data.next[i], str + index.toString() + '.', i + 1, data.vt, le + 1);
      }
    }
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

  // huy thay doi phu luc 1
  cancelEditPL1(id: string): void {
    const index = this.lstCTietBCaoPL1.findIndex(item => item.id === id);  // lay vi tri hang minh sua
    this.editCachePL1[id] = {
      data: { ...this.lstCTietBCaoPL1[index] },
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

  tranferData(data: linkList, item: ItemDataPL1) {
    data.id = item.id;
    data.maNdung = item.maNdung;

    data.kphiSdungTcong = item.kphiSdungTcong;
    data.kphiSdungDtoan = item.kphiSdungDtoan;
    data.kphiSdungNguonKhac = item.kphiSdungNguonKhac;
    data.kphiSdungNguonQuy = item.kphiSdungNguonQuy;
    data.kphiSdungNstt = item.kphiSdungNstt;
    data.kphiSdungCk = item.kphiSdungCk;

    data.kphiChuyenSangTcong = item.kphiChuyenSangTcong;
    data.kphiChuyenSangDtoan = item.kphiChuyenSangDtoan;
    data.kphiChuyenSangNguonKhac = item.kphiChuyenSangNguonKhac;
    data.kphiChuyenSangNguonQuy = item.kphiChuyenSangNguonQuy;
    data.kphiChuyenSangNstt = item.kphiChuyenSangNstt;
    data.kphiChuyenSangCk = item.kphiChuyenSangCk;

    data.dtoanGiaoTcong = item.dtoanGiaoTcong;
    data.dtoanGiaoDtoan = item.dtoanGiaoDtoan;
    data.dtoanGiaoNguonKhac = item.dtoanGiaoNguonKhac;
    data.dtoanGiaoNguonQuy = item.dtoanGiaoNguonQuy;
    data.dtoanGiaoNstt = item.dtoanGiaoNstt;
    data.dtoanGiaoCk = item.dtoanGiaoCk;

    data.giaiNganThangBcaoTcong = item.giaiNganThangBcaoTcong;
    data.giaiNganThangBcaoTcongTle = item.giaiNganThangBcaoTcongTle;
    data.giaiNganThangBcaoDtoan = item.giaiNganThangBcaoDtoan;
    data.giaiNganThangBcaoDtoanTle = item.giaiNganThangBcaoDtoanTle;
    data.giaiNganThangBcaoNguonKhac = item.giaiNganThangBcaoNguonKhac;
    data.giaiNganThangBcaoNguonKhacTle = item.giaiNganThangBcaoNguonKhacTle;
    data.giaiNganThangBcaoNguonQuy = item.giaiNganThangBcaoNguonQuy;
    data.giaiNganThangBcaoNguonQuyTle = item.giaiNganThangBcaoNguonQuyTle;
    data.giaiNganThangBcaoNstt = item.giaiNganThangBcaoNstt;
    data.giaiNganThangBcaoNsttTle = item.giaiNganThangBcaoNsttTle;
    data.giaiNganThangBcaoCk = item.giaiNganThangBcaoCk;
    data.giaiNganThangBcaoCkTle = item.giaiNganThangBcaoCkTle;

    data.luyKeGiaiNganTcong = item.luyKeGiaiNganTcong;
    data.luyKeGiaiNganTcongTle = item.luyKeGiaiNganTcongTle;
    data.luyKeGiaiNganDtoan = item.luyKeGiaiNganDtoan;
    data.luyKeGiaiNganDtoanTle = item.luyKeGiaiNganDtoanTle;
    data.luyKeGiaiNganNguonKhac = item.luyKeGiaiNganNguonKhac;
    data.luyKeGiaiNganNguonKhacTle = item.luyKeGiaiNganNguonKhacTle;
    data.luyKeGiaiNganNguonQuy = item.luyKeGiaiNganNguonQuy;
    data.luyKeGiaiNganNguonQuyTle = item.luyKeGiaiNganNguonQuyTle;
    data.luyKeGiaiNganNstt = item.luyKeGiaiNganNstt;
    data.luyKeGiaiNganNsttTle = item.luyKeGiaiNganNsttTle;
    data.luyKeGiaiNganCk = item.luyKeGiaiNganCk;
    data.luyKeGiaiNganCkTle = item.luyKeGiaiNganCkTle;
  }

  saveEdit1(id: string, index: number): void {
    var item: linkList = {
      id: uuid.v4()+'FE',
      vt: 0,
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
    this.updateLstCTietBCaoPL1();
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

  // start edit pl2
  startEditPL1(id: string): void {
    this.editCachePL1[id].edit = true;
    this.statusB = true;
    this.disable = true;
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

  getListIdDelete(data: linkList) {
    if (data.vt > 0) {
      if (typeof this.lstCTietBCaoPL1[data.vt - 1].id == 'number') {
        this.listIdDelete += this.lstCTietBCaoPL1[data.vt - 1].id + ',';
      }
    }

    if (data.next.length == 0) return;
    data.next.forEach(item => {
      this.getListIdDelete(item);
    })
  }

  // gan editCache.data == lstCTietBCao
  updateEditCache(): void {
    this.baoCao?.lstBCao?.forEach(item => {
      item?.lstCTietBCao.forEach(item1 => {
        this.editCache[item1.id] = {
          edit: false,
          data: { ...item1 }
        };
      })
    });
  }

  // lay ten trang thai ban ghi
  getStatusName(id) {
    const utils = new Utils();
    return utils.getStatusName(id);
  }

  getStatusAppendixName(id) {
    const utils = new Utils();
    return utils.getStatusAppendixName(id);
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


  //show popup tu choi dùng cho nut ok - not ok
  async pheDuyetChiTiet(mcn: string, maLoai: any) {
    this.spinner.show();
    if (mcn == OK) {
      await this.pheDuyetBieuMau(mcn, maLoai, null);
    } else if (mcn == NOTOK) {
      const modalTuChoi = this.modal.create({
        nzTitle: 'Not OK',
        nzContent: DialogTuChoiComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzWidth: '900px',
        nzFooter: null,
        nzComponentParams: {},
      });
      modalTuChoi.afterClose.subscribe(async (text) => {
        if (text) {
          await this.pheDuyetBieuMau(mcn, maLoai, text);
        }
      });
    }
    this.getStatusButtonOk();
    this.spinner.hide();
  }

  //call api duyet bieu mau
  async pheDuyetBieuMau(trangThai: any, maLoai: any, lyDo: string) {
    var idBieuMau: any = this.baoCao.lstBCao.find((item) => item.maLoai == maLoai).id;
    const requestPheDuyetBieuMau = {
      id: idBieuMau,
      trangThai: trangThai,
      lyDoTuChoi: lyDo,
    };
    this.spinner.show();
    await this.quanLyVonPhiService.approveBieuMau(requestPheDuyetBieuMau).toPromise().then(async res => {
      if (res.statusCode == 0) {
        if (trangThai == NOTOK) {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.REJECT_SUCCESS);
        } else {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.APPROVE_SUCCESS);
        }
        this.trangThaiChiTiet = trangThai;
        await this.getDetailReport();
      } else {
        this.notification.error(MESSAGE.ERROR, res?.msg);
      }
    }, err => {
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    })
    this.spinner.hide();
  }

  //lay ra chi muc chi tung dong
  getChiMuc(str: string): string {
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
    SOLAMA
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

  // xac dinh da xuong toi cap toi da chua
  lessThan(level: number): boolean {
    return level > 3;
  }

  close() {
    this.location.back();
  }

  viewDetail(id) {
    const modalIn = this.modal.create({
      nzTitle: 'Danh sách phụ lục',
      nzContent: BaoCaoComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '1200px',
      nzFooter: [
        {
          label: 'Đóng',
          shape: 'round',
          onClick: () => this.modal.closeAll()
        },
      ],
      nzComponentParams: {
        idDialog: id
      },
    });
  }

  // call chi tiet bao cao
  async callSynthetic() {
    this.spinner.show();
    let request = {
      maLoaiBcao: this.routerActive.snapshot.paramMap.get('loaiBaoCao'),
      namBcao: Number(this.routerActive.snapshot.paramMap.get('nam')),
      thangBcao: Number(this.routerActive.snapshot.paramMap.get('thang')) == 0 ? null : Number(this.routerActive.snapshot.paramMap.get('thang')),
      dotBcao: null,
      maPhanBCao: '0',
    }
    await this.quanLyVonPhiService.tongHopBaoCaoKetQua(request).toPromise().then(
      (data) => {
        if (data.statusCode == 0) {
          this.baoCao = data.data;
          this.baoCao?.lstBCao?.forEach(item => {
            item.maDviTien = '1';   // set defaul ma don vi tien la Dong
            let index = PHULUCLIST.findIndex(data => data.maPhuLuc == item.maLoai);
            if (index !== -1) {
              item.tieuDe = PHULUCLIST[index].tieuDe;
              item.tenPhuLuc = PHULUCLIST[index].tenPhuLuc;
              item.checked = false;
              item.trangThai = '2';
            }
          })
          this.baoCao?.lstBCao?.forEach((item, index) => {
            if (item.maLoai == PHULUCLIST[0].maPhuLuc) {
              this.lstCTietBCaoPL1 = item?.lstCTietBCao;
              this.lstCTietBCaoPL1.forEach(item => {
                item.level = item.stt?.split('.').length - 1;
              })
              this.getLinkList(this.chiTietBcaosPL1, "", 0);
              this.updateSTT(this.chiTietBcaosPL1);
              this.updateLstCTietBCaoPL1();
            }
          });

          this.updateEditCache();
          this.updateEditCachePL1();
          this.listFile = [];
          this.baoCao.trangThai = "1";
          if (this.baoCao.trangThai == Utils.TT_BC_1 ||
            this.baoCao.trangThai == Utils.TT_BC_3 ||
            this.baoCao.trangThai == Utils.TT_BC_5 ||
            this.baoCao.trangThai == Utils.TT_BC_8) {
            this.status = false;
            this.statusB = false;
          } else {
            this.status = true;
            this.statusB = true;
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

  doPrint() {

  }

  async doCopy() {
    this.spinner.show();
    let maBaoCao = await this.quanLyVonPhiService.taoMaBaoCao().toPromise().then(
      (data) => {
        if (data.statusCode == 0) {
          return data.data;
        } else {
          this.notification.error(MESSAGE.ERROR, data?.msg);
          return null;
        }
      },
      (err) => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
        return null;
      }
    );
    this.spinner.hide();
    if (!maBaoCao) {
      return;
    }

    // set ma don vi tien trong list chinh = ma don vi tien vua chon tai man hinh
    this.baoCao?.lstBCao.find(item => { if (item.maLoai == this.tabSelected) { item.maDviTien = this.maDviTien, item.thuyetMinh = this.thuyetMinh } });
    let baoCaoTemp = JSON.parse(JSON.stringify(this.baoCao));

    let checkMoneyRange = true;
    let lstCTietBCaoPL1Temp = JSON.parse(JSON.stringify(this.lstCTietBCaoPL1));
    // replace nhung ban ghi dc them moi id thanh null
    baoCaoTemp?.lstBCao?.filter(item => {
      item.id = null;
      item.trangThai = '2'; // set trang thai phu luc la chua danh gia
      if (item.maLoai == PHULUCLIST[0].maPhuLuc) {
        item.lstCTietBCao = lstCTietBCaoPL1Temp;
      }
      item?.lstCTietBCao.filter(data => {
        data.id = null;
        switch (item.maLoai) {
          // phu luc 1
          case PHULUCLIST[0].maPhuLuc:
            data.kphiSdungTcong = divMoney(data.kphiSdungTcong, item.maDviTien);
            data.kphiSdungDtoan = mulMoney(data.kphiSdungDtoan, item.maDviTien);
            data.kphiSdungNguonKhac = mulMoney(data.kphiSdungNguonKhac, item.maDviTien);
            data.kphiSdungNguonQuy = mulMoney(data.kphiSdungNguonQuy, item.maDviTien);
            data.kphiSdungNstt = mulMoney(data.kphiSdungNstt, item.maDviTien);
            data.kphiSdungCk = mulMoney(data.kphiSdungCk, item.maDviTien);
            data.kphiChuyenSangTcong = mulMoney(data.kphiChuyenSangTcong, item.maDviTien);
            data.kphiChuyenSangDtoan = mulMoney(data.kphiChuyenSangDtoan, item.maDviTien);
            data.kphiChuyenSangNguonKhac = mulMoney(data.kphiChuyenSangNguonKhac, item.maDviTien);
            data.kphiChuyenSangNguonQuy = mulMoney(data.kphiChuyenSangNguonQuy, item.maDviTien);
            data.kphiChuyenSangNstt = mulMoney(data.kphiChuyenSangNstt, item.maDviTien);
            data.kphiChuyenSangCk = mulMoney(data.kphiChuyenSangCk, item.maDviTien);
            data.dtoanGiaoTcong = mulMoney(data.dtoanGiaoTcong, item.maDviTien);
            data.dtoanGiaoDtoan = mulMoney(data.dtoanGiaoDtoan, item.maDviTien);
            data.dtoanGiaoNguonKhac = mulMoney(data.dtoanGiaoNguonKhac, item.maDviTien);
            data.dtoanGiaoNguonQuy = mulMoney(data.dtoanGiaoNguonQuy, item.maDviTien);
            data.dtoanGiaoNstt = mulMoney(data.dtoanGiaoNstt, item.maDviTien);
            data.dtoanGiaoCk = mulMoney(data.dtoanGiaoCk, item.maDviTien);
            data.giaiNganThangBcaoTcong = mulMoney(data.giaiNganThangBcaoTcong, item.maDviTien);
            data.giaiNganThangBcaoDtoan = mulMoney(data.giaiNganThangBcaoDtoan, item.maDviTien);
            data.giaiNganThangBcaoNguonKhac = mulMoney(data.giaiNganThangBcaoNguonKhac, item.maDviTien);
            data.giaiNganThangBcaoNguonQuy = mulMoney(data.giaiNganThangBcaoNguonQuy, item.maDviTien);
            data.giaiNganThangBcaoNstt = mulMoney(data.giaiNganThangBcaoNstt, item.maDviTien);
            data.giaiNganThangBcaoCk = mulMoney(data.giaiNganThangBcaoCk, item.maDviTien);
            data.luyKeGiaiNganTcong = mulMoney(data.luyKeGiaiNganTcong, item.maDviTien);
            data.luyKeGiaiNganDtoan = mulMoney(data.luyKeGiaiNganDtoan, item.maDviTien);
            data.luyKeGiaiNganNguonKhac = mulMoney(data.luyKeGiaiNganNguonKhac, item.maDviTien);
            data.luyKeGiaiNganNguonQuy = mulMoney(data.luyKeGiaiNganNguonQuy, item.maDviTien);
            data.luyKeGiaiNganNstt = mulMoney(data.luyKeGiaiNganNstt, item.maDviTien);
            data.luyKeGiaiNganCk = mulMoney(data.luyKeGiaiNganCk, item.maDviTien);

            if (data.kphiSdungTcong > MONEYLIMIT || data.kphiSdungDtoan > MONEYLIMIT || data.kphiSdungNguonKhac > MONEYLIMIT ||
              data.kphiSdungNguonQuy > MONEYLIMIT || data.kphiSdungNstt > MONEYLIMIT || data.kphiSdungCk > MONEYLIMIT ||
              data.kphiChuyenSangTcong > MONEYLIMIT || data.kphiChuyenSangDtoan > MONEYLIMIT || data.kphiChuyenSangNguonKhac > MONEYLIMIT ||
              data.kphiChuyenSangNguonQuy > MONEYLIMIT || data.kphiChuyenSangNstt > MONEYLIMIT || data.kphiChuyenSangCk > MONEYLIMIT ||
              data.dtoanGiaoTcong > MONEYLIMIT || data.dtoanGiaoDtoan > MONEYLIMIT || data.dtoanGiaoNguonKhac > MONEYLIMIT ||
              data.dtoanGiaoNguonQuy > MONEYLIMIT || data.dtoanGiaoNstt > MONEYLIMIT || data.dtoanGiaoCk > MONEYLIMIT ||
              data.giaiNganThangBcaoTcong > MONEYLIMIT || data.giaiNganThangBcaoDtoan > MONEYLIMIT || data.giaiNganThangBcaoNguonKhac > MONEYLIMIT ||
              data.giaiNganThangBcaoNguonQuy > MONEYLIMIT || data.giaiNganThangBcaoNstt > MONEYLIMIT || data.giaiNganThangBcaoCk > MONEYLIMIT ||
              data.luyKeGiaiNganTcong > MONEYLIMIT || data.luyKeGiaiNganDtoan > MONEYLIMIT || data.luyKeGiaiNganNguonKhac > MONEYLIMIT ||
              data.luyKeGiaiNganNguonQuy > MONEYLIMIT || data.luyKeGiaiNganNstt > MONEYLIMIT || data.luyKeGiaiNganCk > MONEYLIMIT) {

              checkMoneyRange = false;
              return;
            }
            break;

          // phu luc 2
          case PHULUCLIST[1].maPhuLuc:
            data.dtoanSdungNamTcong = mulMoney(data.dtoanSdungNamTcong, item.maDviTien);
            data.dtoanSdungNamNguonNsnn = mulMoney(data.dtoanSdungNamNguonNsnn, item.maDviTien);
            data.dtoanSdungNamNguonSn = mulMoney(data.dtoanSdungNamNguonSn, item.maDviTien);
            data.dtoanSdungNamNguonQuy = mulMoney(data.dtoanSdungNamNguonQuy, item.maDviTien);
            data.giaiNganThangTcong = mulMoney(data.giaiNganThangTcong, item.maDviTien);
            data.giaiNganThangNguonNsnn = mulMoney(data.giaiNganThangNguonNsnn, item.maDviTien);
            data.giaiNganThangNguonSn = mulMoney(data.giaiNganThangNguonSn, item.maDviTien);
            data.giaiNganThangNguonQuy = mulMoney(data.giaiNganThangNguonQuy, item.maDviTien);
            data.luyKeGiaiNganTcong = mulMoney(data.luyKeGiaiNganTcong, item.maDviTien);
            data.luyKeGiaiNganNguonNsnn = mulMoney(data.luyKeGiaiNganNguonNsnn, item.maDviTien);
            data.luyKeGiaiNganNguonSn = mulMoney(data.luyKeGiaiNganNguonSn, item.maDviTien);
            data.luyKeGiaiNganNguonQuy = mulMoney(data.luyKeGiaiNganNguonQuy, item.maDviTien);

            if (data.dtoanSdungNamTcong > MONEYLIMIT || data.dtoanSdungNamNguonNsnn > MONEYLIMIT || data.dtoanSdungNamNguonSn > MONEYLIMIT ||
              data.dtoanSdungNamNguonQuy > MONEYLIMIT || data.giaiNganThangTcong > MONEYLIMIT || data.giaiNganThangNguonNsnn > MONEYLIMIT ||
              data.giaiNganThangNguonSn > MONEYLIMIT || data.giaiNganThangNguonQuy > MONEYLIMIT || data.luyKeGiaiNganTcong > MONEYLIMIT ||
              data.luyKeGiaiNganNguonNsnn > MONEYLIMIT || data.luyKeGiaiNganNguonSn > MONEYLIMIT || data.luyKeGiaiNganNguonQuy > MONEYLIMIT) {
              checkMoneyRange = false;
              return;
            }
            break;

          // phu luc 3
          case PHULUCLIST[2].maPhuLuc:
            data.qddtTmdtTso = mulMoney(data.qddtTmdtTso, item.maDviTien);
            data.qddtTmdtNsnn = mulMoney(data.qddtTmdtNsnn, item.maDviTien);
            data.luyKeVonTso = mulMoney(data.luyKeVonTso, item.maDviTien);
            data.luyKeVonNsnn = mulMoney(data.luyKeVonNsnn, item.maDviTien);
            data.luyKeVonDt = mulMoney(data.luyKeVonDt, item.maDviTien);
            data.luyKeVonThue = mulMoney(data.luyKeVonThue, item.maDviTien);
            data.luyKeVonScl = mulMoney(data.luyKeVonScl, item.maDviTien);
            data.luyKeGiaiNganHetNamTso = mulMoney(data.luyKeGiaiNganHetNamTso, item.maDviTien);
            data.luyKeGiaiNganHetNamNsnnTso = mulMoney(data.luyKeGiaiNganHetNamNsnnTso, item.maDviTien);
            data.luyKeGiaiNganHetNamNsnnKhNamTruoc = mulMoney(data.luyKeGiaiNganHetNamNsnnKhNamTruoc, item.maDviTien);
            data.khoachVonNamTruocKeoDaiTso = mulMoney(data.khoachVonNamTruocKeoDaiTso, item.maDviTien);
            data.khoachVonNamTruocKeoDaiDtpt = mulMoney(data.khoachVonNamTruocKeoDaiDtpt, item.maDviTien);
            data.khoachVonNamTruocKeoDaiVonKhac = mulMoney(data.khoachVonNamTruocKeoDaiVonKhac, item.maDviTien);
            data.khoachNamVonTso = mulMoney(data.khoachNamVonTso, item.maDviTien);
            data.khoachNamVonNsnn = mulMoney(data.khoachNamVonNsnn, item.maDviTien);
            data.khoachNamVonDt = mulMoney(data.khoachNamVonDt, item.maDviTien);
            data.khoachNamVonThue = mulMoney(data.khoachNamVonThue, item.maDviTien);
            data.khoachNamVonScl = mulMoney(data.khoachNamVonScl, item.maDviTien);
            data.giaiNganTso = mulMoney(data.giaiNganTso, item.maDviTien);
            data.giaiNganNsnn = mulMoney(data.giaiNganNsnn, item.maDviTien);
            data.giaiNganNsnnVonDt = mulMoney(data.giaiNganNsnnVonDt, item.maDviTien);
            data.giaiNganNsnnVonThue = mulMoney(data.giaiNganNsnnVonThue, item.maDviTien);
            data.giaiNganNsnnVonScl = mulMoney(data.giaiNganNsnnVonScl, item.maDviTien);
            data.luyKeGiaiNganDauNamTso = mulMoney(data.luyKeGiaiNganDauNamTso, item.maDviTien);
            data.luyKeGiaiNganDauNamNsnn = mulMoney(data.luyKeGiaiNganDauNamNsnn, item.maDviTien);
            data.luyKeGiaiNganDauNamNsnnVonDt = mulMoney(data.luyKeGiaiNganDauNamNsnnVonDt, item.maDviTien);
            data.luyKeGiaiNganDauNamNsnnVonThue = mulMoney(data.luyKeGiaiNganDauNamNsnnVonThue, item.maDviTien);
            data.luyKeGiaiNganDauNamNsnnVonScl = mulMoney(data.luyKeGiaiNganDauNamNsnnVonScl, item.maDviTien);

            if (data.qddtTmdtTso > MONEYLIMIT || data.qddtTmdtNsnn > MONEYLIMIT || data.luyKeVonTso > MONEYLIMIT ||
              data.luyKeVonNsnn > MONEYLIMIT || data.luyKeVonDt > MONEYLIMIT || data.luyKeVonThue > MONEYLIMIT ||
              data.luyKeVonScl > MONEYLIMIT || data.luyKeGiaiNganHetNamTso > MONEYLIMIT || data.luyKeGiaiNganHetNamNsnnTso > MONEYLIMIT ||
              data.luyKeGiaiNganHetNamNsnnKhNamTruoc > MONEYLIMIT || data.khoachVonNamTruocKeoDaiTso > MONEYLIMIT || data.khoachVonNamTruocKeoDaiDtpt > MONEYLIMIT ||
              data.khoachVonNamTruocKeoDaiVonKhac > MONEYLIMIT || data.khoachNamVonTso > MONEYLIMIT || data.khoachNamVonNsnn > MONEYLIMIT ||
              data.khoachNamVonDt > MONEYLIMIT || data.khoachNamVonThue > MONEYLIMIT || data.khoachNamVonScl > MONEYLIMIT ||
              data.giaiNganTso > MONEYLIMIT || data.giaiNganNsnn > MONEYLIMIT || data.giaiNganNsnnVonDt > MONEYLIMIT ||
              data.giaiNganNsnnVonThue > MONEYLIMIT || data.giaiNganNsnnVonScl > MONEYLIMIT || data.luyKeGiaiNganDauNamTso > MONEYLIMIT ||
              data.luyKeGiaiNganDauNamNsnn > MONEYLIMIT || data.luyKeGiaiNganDauNamNsnnVonDt > MONEYLIMIT || data.luyKeGiaiNganDauNamNsnnVonThue > MONEYLIMIT ||
              data.luyKeGiaiNganDauNamNsnnVonScl > MONEYLIMIT) {
              checkMoneyRange = false;
              return;
            }
            break;
          default:
            break;
        }
      })
      if (!checkMoneyRange == true) {
        this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.MONEYRANGE);
      }
    })

    if (checkMoneyRange != true) {
      return;
    } else {
      // replace nhung ban ghi dc them moi id thanh null
      baoCaoTemp.id = null;
      baoCaoTemp.maBcao = maBaoCao;
      baoCaoTemp.tongHopTu = '';
      baoCaoTemp?.lstBCaoDviTrucThuoc?.filter(item => {
        baoCaoTemp.tongHopTu += item.id + ',';
      })
      baoCaoTemp.fileDinhKems = [];
      baoCaoTemp.listIdFiles = null;
      baoCaoTemp.trangThai = "1";
      baoCaoTemp.maDvi = this.maDonViTao;
      baoCaoTemp.maPhanBcao = '0';

      //call service them moi
      this.spinner.show();
      this.quanLyVonPhiService.trinhDuyetBaoCaoThucHienDTCService(baoCaoTemp).toPromise().then(
        async data => {
          if (data.statusCode == 0) {
            const modalCopy = this.modal.create({
              nzTitle: MESSAGE.ALERT,
              nzContent: DialogCopyComponent,
              nzMaskClosable: false,
              nzClosable: false,
              nzWidth: '900px',
              nzFooter: null,
              nzComponentParams: {
                maBcao: maBaoCao
              },
            });
          } else {
            this.notification.error(MESSAGE.ERROR, data?.msg);
            this.spinner.hide();
          }
        },
        err => {
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        },
      );

    }
    this.spinner.hide();
  }
}
