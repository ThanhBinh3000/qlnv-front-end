import { DatePipe, Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as fileSaver from 'file-saver';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogBaoCaoCopyComponent } from 'src/app/components/dialog/dialog-bao-cao-copy/dialog-bao-cao-copy.component';
import { DialogCopyComponent } from 'src/app/components/dialog/dialog-copy/dialog-copy.component';
import { DialogLuaChonThemPhuLucComponent } from 'src/app/components/dialog/dialog-lua-chon-them-phu-luc/dialog-lua-chon-them-phu-luc.component';
import { DialogThemKhoanMucComponent } from 'src/app/components/dialog/dialog-them-khoan-muc/dialog-them-khoan-muc.component';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { divMoney, DON_VI_TIEN, KHOAN_MUC, MONEY_LIMIT, mulMoney, NOT_OK, OK, ROLE_CAN_BO, ROLE_LANH_DAO, ROLE_TRUONG_BO_PHAN, Utils } from 'src/app/Utility/utils';
import * as uuid from "uuid";
import * as XLSX from 'xlsx';
// import { KHOAN_MUC } from '../../../quan-ly-dieu-chinh-du-toan-chi-nsnn/quan-ly-dieu-chinh-du-toan-chi-nsnn.constant';
import { SOLAMA } from '../../../quy-trinh-bao-ket-qua-THVP-hang-DTQG-tai-tong-cuc/nhom-chuc-nang-chi-cuc/bao-cao/bao-cao.constant';
import { DIADIEM, LISTCANBO, MA_DU_AN, NOI_DUNG, NOI_DUNG_PL2, PHULUCLIST, TAB_SELECTED } from './bao-cao.constant';
export class ItemData {
  id!: any;
  maLoai!: string;
  maDviTien!: any;
  lstCtietBcaos!: any;
  trangThai!: string;
  checked!: boolean;
  tieuDe!: string;
  tenPhuLuc!: string;
  thuyetMinh!: string;
  lyDoTuChoi!: string;
  lstIdDeletes!: [];
  nguoiBcao!: string;
  bcaoId!: string;
}

export class ItemDanhSach {
  id!: any;
  maBcao!: String;
  namBcao!: number;
  thangBcao!: number;
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
  listIdFiles!: string;     //list id file xoa khi cap nhat
  maLoaiBcao!: string;
  maPhanBcao: string = "0";

  stt!: String;
  checked!: boolean;
  lstBcaos: ItemData[] = [];
  lstFiles: any[] = [];
  lstBcaoDviTrucThuocs: any[] = [];
  tongHopTuIds!: [];
}

export class ItemDataPL1 {
  id = null;
  header = null;
  stt = '0';
  checked = false;
  lstKm: any[] = [];
  level = 0;
  maNdung = null;
  kphiSdungTcong = 0;
  kphiSdungDtoan = 0;
  kphiSdungNguonKhac = 0;
  kphiSdungNguonQuy = 0;
  kphiSdungNstt = 0;
  kphiSdungCk = 0;
  kphiChuyenSangTcong = 0;
  kphiChuyenSangDtoan = 0;
  kphiChuyenSangNguonKhac = 0;
  kphiChuyenSangNguonQuy = 0;
  kphiChuyenSangNstt = 0;
  kphiChuyenSangCk = 0;
  dtoanGiaoTcong = 0;
  dtoanGiaoDtoan = 0;
  dtoanGiaoNguonKhac = 0;
  dtoanGiaoNguonQuy = 0;
  dtoanGiaoNstt = 0;
  dtoanGiaoCk = 0;
  giaiNganThangBcaoTcong = 0;
  giaiNganThangBcaoTcongTle = 0;
  giaiNganThangBcaoDtoan = 0;
  giaiNganThangBcaoDtoanTle = 0;
  giaiNganThangBcaoNguonKhac = 0;
  giaiNganThangBcaoNguonKhacTle = 0;
  giaiNganThangBcaoNguonQuy = 0;
  giaiNganThangBcaoNguonQuyTle = 0;
  giaiNganThangBcaoNstt = 0;
  giaiNganThangBcaoNsttTle = 0;
  giaiNganThangBcaoCk = 0;
  giaiNganThangBcaoCkTle = 0;
  luyKeGiaiNganTcong = 0;
  luyKeGiaiNganTcongTle = 0;
  luyKeGiaiNganDtoan = 0;
  luyKeGiaiNganDtoanTle = 0;
  luyKeGiaiNganNguonKhac = 0;
  luyKeGiaiNganNguonKhacTle = 0;
  luyKeGiaiNganNguonQuy = 0;
  luyKeGiaiNganNguonQuyTle = 0;
  luyKeGiaiNganNstt = 0;
  luyKeGiaiNganNsttTle = 0;
  luyKeGiaiNganCk = 0;
  luyKeGiaiNganCkTle = 0;
}

export class ItemDataPL2 {
  id = null;
  header = null;
  stt = '0';
  checked = false;
  lstKm: any[] = [];
  level = 0;
  maNdung = null;
  dtoanSdungNamTcong = 0;
  dtoanSdungNamNguonNsnn = 0;
  dtoanSdungNamNguonSn = 0;
  dtoanSdungNamNguonQuy = 0;
  giaiNganThangTcong = 0;
  giaiNganThangTcongTle = 0;
  giaiNganThangNguonNsnn = 0;
  giaiNganThangNguonNsnnTle = 0;
  giaiNganThangNguonSn = 0;
  giaiNganThangNguonSnTle = 0;
  giaiNganThangNguonQuy = 0;
  giaiNganThangNguonQuyTle = 0;
  luyKeGiaiNganTcong = 0;
  luyKeGiaiNganTcongTle = 0;
  luyKeGiaiNganNguonNsnn = 0;
  luyKeGiaiNganNguonNsnnTle = 0;
  luyKeGiaiNganNguonSn = 0;
  luyKeGiaiNganNguonSnTle = 0;
  luyKeGiaiNganNguonQuy = 0;
  luyKeGiaiNganNguonQuyTle = 0;
}

export class ItemDataPL3 {
  id = null;
  header = null;
  stt = '0';
  checked = false;
  lstKm: any[] = [];
  level = 0;
  maNdung = 0;
  maDan = null;
  ddiemXdung = null;
  qddtSoQdinh = null;
  qddtTmdtTso = 0;
  qddtTmdtNsnn = 0;
  luyKeVonTso = 0;
  luyKeVonNsnn = 0;
  luyKeVonDt = 0;
  luyKeVonThue = 0;
  luyKeVonScl = 0;
  luyKeGiaiNganHetNamTso = 0;
  luyKeGiaiNganHetNamNsnnTso = 0;
  luyKeGiaiNganHetNamNsnnKhNamTruoc = 0;
  khoachVonNamTruocKeoDaiTso = 0;
  khoachVonNamTruocKeoDaiDtpt = 0;
  khoachVonNamTruocKeoDaiVonKhac = 0;
  khoachNamVonTso = 0;
  khoachNamVonNsnn = 0;
  khoachNamVonDt = 0;
  khoachNamVonThue = 0;
  khoachNamVonScl = 0;
  kluongThienTso = 0;
  kluongThienThangBcao = 0;
  giaiNganTso = 0;
  giaiNganTsoTle = 0;
  giaiNganNsnn = 0;
  giaiNganNsnnVonDt = 0;
  giaiNganNsnnVonThue = 0;
  giaiNganNsnnVonScl = 0;
  giaiNganNsnnTle = 0;
  giaiNganNsnnTleVonDt = 0;
  giaiNganNsnnTleVonThue = 0;
  giaiNganNsnnTleVonScl = 0;
  luyKeGiaiNganDauNamTso = 0;
  luyKeGiaiNganDauNamTsoTle = 0;
  luyKeGiaiNganDauNamNsnn = 0;
  luyKeGiaiNganDauNamNsnnVonDt = 0;
  luyKeGiaiNganDauNamNsnnVonThue = 0;
  luyKeGiaiNganDauNamNsnnVonScl = 0;
  luyKeGiaiNganDauNamNsnnTle = 0;
  luyKeGiaiNganDauNamNsnnTleVonDt = 0;
  luyKeGiaiNganDauNamNsnnTleVonThue = 0;
  luyKeGiaiNganDauNamNsnnTleVonScl = 0;
  ndungCviecHthanhCuoiThang = null;
  ndungCviecDangThien = null;
  khoachThienNdungCviecThangConLaiNam = null;
  ghiChu = null;
}


export class ItemCongVan {
  fileName: string;
  fileSize: number;
  fileUrl: number;
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

  //nhóm biến phụ lục 1------------------
  danhSachChiTietPhuLuc11Temp: ItemDataPL1[] = [];
  danhSachChiTietPhuLuc12Temp: ItemDataPL1[] = [];

  tabs: any[] = [];

  id!: any;                                   // id truyen tu router
  loaiBaoCao!: any;                           // loai bao cao (thang/nam)
  trangThaiChiTiet!: any;
  userInfo: any;
  noiDungs: any;                              // danh muc noi dung
  noiDungFull = [];

  noiDungPL2s: any = NOI_DUNG_PL2;            // danh muc noi dung PL2
  donVis: any = [];                           // danh muc don vi
  donViTiens: any = DON_VI_TIEN;              // danh muc don vi tien
  lstFiles: any = [];                         // list File de day vao api
  status: boolean = false;                    // trang thai an/ hien cua trang thai
  maDonViTao!: any;                           // ma don vi tao

  maDviTien: string = "1";                    // ma don vi tien
  thuyetMinh: string;                         // thuyet minh
  newDate = new Date();                       //
  listFile: File[] = [];                      // list file chua ten va id de hien tai o input
  listIdDelete: any = [];                     // list id delete

  maDans: any = [];
  maDanFull: any = [];
  ddiemXdungs: any = DIADIEM;

  statusBtnDel: boolean = true;                       // trang thai an/hien nut xoa
  statusBtnSave: boolean = true;                      // trang thai an/hien nut luu
  statusBtnApprove: boolean = true;                   // trang thai an/hien nut trinh duyet
  statusBtnTBP: boolean = true;                       // trang thai an/hien nut truong bo phan
  statusBtnLD: boolean = true;                        // trang thai an/hien nut lanh dao
  statusBtnGuiDVCT: boolean = true;                   // trang thai nut gui don vi cap tren
  statusBtnDVCT: boolean = true;                      // trang thai nut don vi cap tren
  statusBtnCopy: boolean = true;                      // trang thai copy
  statusBtnPrint: boolean = true;                     // trang thai print
  statusBtnOk: boolean = true;                        // trang thai ok/ not ok
  statusBtnClose: boolean = false;                    // trang thai ok/ not ok
  statusBtnFinish: boolean = true;                    // trang thai hoan tat nhap lieu

  listIdFilesDelete: any = [];                        // id file luc call chi tiet

  allChecked = false;                         // check all checkbox
  indeterminate = true;                       // properties allCheckBox
  allCheckedTemp = false;                    // check all checkbox temp
  indeterminateTemp = true;                   // properties allCheckBox temp
  editCache: { [key: string]: { edit: boolean; data: any } } = {};     // phuc vu nut chinh
  fileList: NzUploadFile[] = [];
  fileDetail: NzUploadFile;
  tabSelected: string;
  danhSachChiTietPhuLucTemp: any[] = [];
  tab = TAB_SELECTED;
  lstKhoanMuc: any[] = KHOAN_MUC;
  nguoiBcaos: any[] = LISTCANBO;
  selectedIndex: number = 1;

  //tong
  kphiSdungTcong = 0;
  kphiSdungDtoan = 0;
  kphiSdungNguonKhac = 0;
  kphiSdungNguonQuy = 0;
  kphiSdungNstt = 0;
  kphiSdungCk = 0;
  kphiChuyenSangTcong = 0;
  kphiChuyenSangDtoan = 0;
  kphiChuyenSangNguonKhac = 0;
  kphiChuyenSangNguonQuy = 0;
  kphiChuyenSangNstt = 0;
  kphiChuyenSangCk = 0;
  dtoanGiaoTcong = 0;
  dtoanGiaoDtoan = 0;
  dtoanGiaoNguonKhac = 0;
  dtoanGiaoNguonQuy = 0;
  dtoanGiaoNstt = 0;
  dtoanGiaoCk = 0;
  giaiNganThangBcaoTcong = 0;
  giaiNganThangBcaoTcongTle = 0;
  giaiNganThangBcaoDtoan = 0;
  giaiNganThangBcaoDtoanTle = 0;
  giaiNganThangBcaoNguonKhac = 0;
  giaiNganThangBcaoNguonKhacTle = 0;
  giaiNganThangBcaoNguonQuy = 0;
  giaiNganThangBcaoNguonQuyTle = 0;
  giaiNganThangBcaoNstt = 0;
  giaiNganThangBcaoNsttTle = 0;
  giaiNganThangBcaoCk = 0;
  giaiNganThangBcaoCkTle = 0;
  luyKeGiaiNganTcong = 0;
  luyKeGiaiNganTcongTle = 0;
  luyKeGiaiNganDtoan = 0;
  luyKeGiaiNganDtoanTle = 0;
  luyKeGiaiNganNguonKhac = 0;
  luyKeGiaiNganNguonKhacTle = 0;
  luyKeGiaiNganNguonQuy = 0;
  luyKeGiaiNganNguonQuyTle = 0;
  luyKeGiaiNganNstt = 0;
  luyKeGiaiNganNsttTle = 0;
  luyKeGiaiNganCk = 0;
  luyKeGiaiNganCkTle = 0;

  constructor(
    private routerActive: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private danhMucService: DanhMucHDVService,
    private userService: UserService,
    private notification: NzNotificationService,
    private quanLyVonPhiService: QuanLyVonPhiService,
    private modal: NzModalService,
    private location: Location,
    private datePipe: DatePipe,
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
      this.quanLyVonPhiService.taoMaBaoCao().toPromise().then(
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
      this.baoCao.nguoiTao = userName;
      this.baoCao.ngayTao = new Date().toDateString();
      this.baoCao.trangThai = "1";

    } else {
      this.maDonViTao = this.userInfo?.dvql;
      this.spinner.show();
      this.quanLyVonPhiService.taoMaBaoCao().toPromise().then(
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

      this.baoCao.nguoiTao = userName;
      this.baoCao.ngayTao = this.datePipe.transform(new Date(), Utils.FORMAT_DATE_STR);
      this.baoCao.trangThai = "1";
      PHULUCLIST.forEach(item => {
        this.baoCao.lstBcaos.push({
          id: uuid.v4() + 'FE',
          checked: false,
          tieuDe: item.tieuDe,
          maLoai: item.maPhuLuc,
          tenPhuLuc: item.tenPhuLuc,
          trangThai: '3',
          lstCtietBcaos: [],
          maDviTien: '1',
          thuyetMinh: null,
          lyDoTuChoi: null,
          lstIdDeletes: [],
          nguoiBcao: null,
          bcaoId: this.id,
        });
      })
    }

    //get danh muc noi dung
    await this.danhMucService.dMNoiDungPhuLuc1().toPromise().then(
      (data) => {
        if (data.statusCode == 0) {
          this.noiDungs = data.data;
        } else {
          this.notification.error(MESSAGE.ERROR, data?.msg);
        }
      },
      (err) => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
      }
    );

    //get danh muc noi dung
    await this.danhMucService.dMMaDuAnPhuLuc3().toPromise().then(
      (data) => {
        if (data.statusCode == 0) {
          this.maDans = data.data;
        } else {
          this.notification.error(MESSAGE.ERROR, data?.msg);
        }
      },
      (err) => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
      }
    );

    await this.noiDungs.forEach(item => {
      if (!item.maCha) {
        this.noiDungFull.push({
          ...item,
          tenDm: item.giaTri,
          ten: item.giaTri,
          level: 0,
          idCha: 0,
        })
      }
    })
    this.addListNoiDung(this.noiDungFull);
    debugger
    await this.maDans.forEach(item => {
      if (!item.maCha) {
        this.maDanFull.push({
          ...item,
          tenDm: item.giaTri,
          ten: item.giaTri,
          level: 0,
          idCha: 0,
        })
      }
    })
    this.addListMaDuAn(this.maDanFull);
    console.log(this.maDanFull);

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
  addListNoiDung(noiDungTemp) {
    let a = [];
    noiDungTemp.forEach(item => {
      this.noiDungs.forEach(el => {
        if (item.ma == el.maCha) {
          el = {
            ...el,
            tenDm: el.giaTri,
            ten: item.giaTri,
            level: item.level + 1,
            idCha: item.id,
          }
          this.noiDungFull.push(el);
          a.push(el);
        }
      });
    })
    if (a.length > 0) {
      this.addListNoiDung(a);
    }
  }

  addListMaDuAn(maDanTemp) {
    let a = [];
    maDanTemp.forEach(item => {
      this.maDans.forEach(el => {
        if (item.ma == el.maCha) {
          el = {
            ...el,
            tenDm: el.giaTri,
            ten: item.giaTri,
            level: item.level + 1,
            idCha: item.id,
          }
          this.maDanFull.push(el);
          a.push(el);
        }
      });
    })
    if (a.length > 0) {
      this.addListMaDuAn(a);
    }
  }

  getStatusButton() {
    let checkParent = false;
    let checkChirld = false;
    let dVi = this.donVis.find(e => e.maDvi == this.maDonViTao);
    if (dVi && dVi.maDvi == this.userInfo.dvql) {
      checkChirld = true;
    }
    if (dVi && dVi.maDviCha == this.userInfo.dvql) {
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
    return this.donVis.find(item => item.maDvi == dvitao)?.tenDvi;
  }

  // call chi tiet bao cao
  async getDetailReport() {
    this.spinner.show();
    await this.quanLyVonPhiService.baoCaoChiTiet(this.id).toPromise().then(
      (data) => {
        if (data.statusCode == 0) {
          this.baoCao = data.data;
          this.baoCao?.lstBcaos?.forEach(item => {
            let index = PHULUCLIST.findIndex(data => data.maPhuLuc == item.maLoai);
            if (index !== -1) {
              item.tieuDe = PHULUCLIST[index].tieuDe;
              item.tenPhuLuc = PHULUCLIST[index].tenPhuLuc;
              item.checked = false;
            }
            item?.lstCtietBcaos?.filter(data => {
              switch (item.maLoai) {
                // phu luc 1
                case PHULUCLIST[0].maPhuLuc:
                  data.kphiSdungTcong = divMoney(data.kphiSdungTcong, item.maDviTien);
                  data.kphiSdungDtoan = divMoney(data.kphiSdungDtoan, item.maDviTien);
                  data.kphiSdungNguonKhac = divMoney(data.kphiSdungNguonKhac, item.maDviTien);
                  data.kphiSdungNguonQuy = divMoney(data.kphiSdungNguonQuy, item.maDviTien);
                  data.kphiSdungNstt = divMoney(data.kphiSdungNstt, item.maDviTien);
                  data.kphiSdungCk = divMoney(data.kphiSdungCk, item.maDviTien);
                  data.kphiChuyenSangTcong = divMoney(data.kphiChuyenSangTcong, item.maDviTien);
                  data.kphiChuyenSangDtoan = divMoney(data.kphiChuyenSangDtoan, item.maDviTien);
                  data.kphiChuyenSangNguonKhac = divMoney(data.kphiChuyenSangNguonKhac, item.maDviTien);
                  data.kphiChuyenSangNguonQuy = divMoney(data.kphiChuyenSangNguonQuy, item.maDviTien);
                  data.kphiChuyenSangNstt = divMoney(data.kphiChuyenSangNstt, item.maDviTien);
                  data.kphiChuyenSangCk = divMoney(data.kphiChuyenSangCk, item.maDviTien);
                  data.dtoanGiaoTcong = divMoney(data.dtoanGiaoTcong, item.maDviTien);
                  data.dtoanGiaoDtoan = divMoney(data.dtoanGiaoDtoan, item.maDviTien);
                  data.dtoanGiaoNguonKhac = divMoney(data.dtoanGiaoNguonKhac, item.maDviTien);
                  data.dtoanGiaoNguonQuy = divMoney(data.dtoanGiaoNguonQuy, item.maDviTien);
                  data.dtoanGiaoNstt = divMoney(data.dtoanGiaoNstt, item.maDviTien);
                  data.dtoanGiaoCk = divMoney(data.dtoanGiaoCk, item.maDviTien);
                  data.giaiNganThangBcaoTcong = divMoney(data.giaiNganThangBcaoTcong, item.maDviTien);
                  data.giaiNganThangBcaoDtoan = divMoney(data.giaiNganThangBcaoDtoan, item.maDviTien);
                  data.giaiNganThangBcaoNguonKhac = divMoney(data.giaiNganThangBcaoNguonKhac, item.maDviTien);
                  data.giaiNganThangBcaoNguonQuy = divMoney(data.giaiNganThangBcaoNguonQuy, item.maDviTien);
                  data.giaiNganThangBcaoNstt = divMoney(data.giaiNganThangBcaoNstt, item.maDviTien);
                  data.giaiNganThangBcaoCk = divMoney(data.giaiNganThangBcaoCk, item.maDviTien);
                  data.luyKeGiaiNganTcong = divMoney(data.luyKeGiaiNganTcong, item.maDviTien);
                  data.luyKeGiaiNganDtoan = divMoney(data.luyKeGiaiNganDtoan, item.maDviTien);
                  data.luyKeGiaiNganNguonKhac = divMoney(data.luyKeGiaiNganNguonKhac, item.maDviTien);
                  data.luyKeGiaiNganNguonQuy = divMoney(data.luyKeGiaiNganNguonQuy, item.maDviTien);
                  data.luyKeGiaiNganNstt = divMoney(data.luyKeGiaiNganNstt, item.maDviTien);
                  data.luyKeGiaiNganCk = divMoney(data.luyKeGiaiNganCk, item.maDviTien);
                  break;

                // phu luc 2
                case PHULUCLIST[1].maPhuLuc:
                  data.dtoanSdungNamTcong = divMoney(data.dtoanSdungNamTcong, item.maDviTien);
                  data.dtoanSdungNamNguonNsnn = divMoney(data.dtoanSdungNamNguonNsnn, item.maDviTien);
                  data.dtoanSdungNamNguonSn = divMoney(data.dtoanSdungNamNguonSn, item.maDviTien);
                  data.dtoanSdungNamNguonQuy = divMoney(data.dtoanSdungNamNguonQuy, item.maDviTien);
                  data.giaiNganThangTcong = divMoney(data.giaiNganThangTcong, item.maDviTien);
                  data.giaiNganThangNguonNsnn = divMoney(data.giaiNganThangNguonNsnn, item.maDviTien);
                  data.giaiNganThangNguonSn = divMoney(data.giaiNganThangNguonSn, item.maDviTien);
                  data.giaiNganThangNguonQuy = divMoney(data.giaiNganThangNguonQuy, item.maDviTien);
                  data.luyKeGiaiNganTcong = divMoney(data.luyKeGiaiNganTcong, item.maDviTien);
                  data.luyKeGiaiNganNguonNsnn = divMoney(data.luyKeGiaiNganNguonNsnn, item.maDviTien);
                  data.luyKeGiaiNganNguonSn = divMoney(data.luyKeGiaiNganNguonSn, item.maDviTien);
                  data.luyKeGiaiNganNguonQuy = divMoney(data.luyKeGiaiNganNguonQuy, item.maDviTien);
                  break;

                // phu luc 3
                case PHULUCLIST[2].maPhuLuc:
                  data.qddtTmdtTso = divMoney(data.qddtTmdtTso, item.maDviTien);
                  data.qddtTmdtNsnn = divMoney(data.qddtTmdtNsnn, item.maDviTien);
                  data.luyKeVonTso = divMoney(data.luyKeVonTso, item.maDviTien);
                  data.luyKeVonNsnn = divMoney(data.luyKeVonNsnn, item.maDviTien);
                  data.luyKeVonDt = divMoney(data.luyKeVonDt, item.maDviTien);
                  data.luyKeVonThue = divMoney(data.luyKeVonThue, item.maDviTien);
                  data.luyKeVonScl = divMoney(data.luyKeVonScl, item.maDviTien);
                  data.luyKeGiaiNganHetNamTso = divMoney(data.luyKeGiaiNganHetNamTso, item.maDviTien);
                  data.luyKeGiaiNganHetNamNsnnTso = divMoney(data.luyKeGiaiNganHetNamNsnnTso, item.maDviTien);
                  data.luyKeGiaiNganHetNamNsnnKhNamTruoc = divMoney(data.luyKeGiaiNganHetNamNsnnKhNamTruoc, item.maDviTien);
                  data.khoachVonNamTruocKeoDaiTso = divMoney(data.khoachVonNamTruocKeoDaiTso, item.maDviTien);
                  data.khoachVonNamTruocKeoDaiDtpt = divMoney(data.khoachVonNamTruocKeoDaiDtpt, item.maDviTien);
                  data.khoachVonNamTruocKeoDaiVonKhac = divMoney(data.khoachVonNamTruocKeoDaiVonKhac, item.maDviTien);
                  data.khoachNamVonTso = divMoney(data.khoachNamVonTso, item.maDviTien);
                  data.khoachNamVonNsnn = divMoney(data.khoachNamVonNsnn, item.maDviTien);
                  data.khoachNamVonDt = divMoney(data.khoachNamVonDt, item.maDviTien);
                  data.khoachNamVonThue = divMoney(data.khoachNamVonThue, item.maDviTien);
                  data.khoachNamVonScl = divMoney(data.khoachNamVonScl, item.maDviTien);
                  data.giaiNganTso = divMoney(data.giaiNganTso, item.maDviTien);
                  data.giaiNganNsnn = divMoney(data.giaiNganNsnn, item.maDviTien);
                  data.giaiNganNsnnVonDt = divMoney(data.giaiNganNsnnVonDt, item.maDviTien);
                  data.giaiNganNsnnVonThue = divMoney(data.giaiNganNsnnVonThue, item.maDviTien);
                  data.giaiNganNsnnVonScl = divMoney(data.giaiNganNsnnVonScl, item.maDviTien);
                  data.luyKeGiaiNganDauNamTso = divMoney(data.luyKeGiaiNganDauNamTso, item.maDviTien);
                  data.luyKeGiaiNganDauNamNsnn = divMoney(data.luyKeGiaiNganDauNamNsnn, item.maDviTien);
                  data.luyKeGiaiNganDauNamNsnnVonDt = divMoney(data.luyKeGiaiNganDauNamNsnnVonDt, item.maDviTien);
                  data.luyKeGiaiNganDauNamNsnnVonThue = divMoney(data.luyKeGiaiNganDauNamNsnnVonThue, item.maDviTien);
                  data.luyKeGiaiNganDauNamNsnnVonScl = divMoney(data.luyKeGiaiNganDauNamNsnnVonScl, item.maDviTien);
                  break;
                default:
                  break;
              }
            });
          })
          this.baoCao.ngayDuyet = this.datePipe.transform(data.data.ngayDuyet, Utils.FORMAT_DATE_STR);
          this.baoCao.ngayPheDuyet = this.datePipe.transform(data.data.ngayPheDuyet, Utils.FORMAT_DATE_STR);
          this.baoCao.ngayTraKq = this.datePipe.transform(data.data.ngayTraKq, Utils.FORMAT_DATE_STR);
          this.baoCao.ngayTrinh = this.datePipe.transform(data.data.ngayTrinh, Utils.FORMAT_DATE_STR);
          this.baoCao.ngayTao = this.datePipe.transform(data.data.ngayTao, Utils.FORMAT_DATE_STR);
          this.lstFiles = data.data.lstFiles;
          this.listFile = [];
          this.maDonViTao = data.data.maDvi;
          if (this.baoCao.trangThai == Utils.TT_BC_1 ||
            this.baoCao.trangThai == Utils.TT_BC_3 ||
            this.baoCao.trangThai == Utils.TT_BC_5 ||
            this.baoCao.trangThai == Utils.TT_BC_8) {
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

  // chuc nang check role
  async onSubmit(mcn: String, lyDoTuChoi: string) {
    if (this.id) {
      let checkStatusReport = this.baoCao?.lstBcaos?.findIndex(item => item.trangThai != '5');
      if (checkStatusReport != -1 && mcn == Utils.TT_BC_2) {
        this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.WARNING_FINISH_INPUT);
        return;
      }
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
          this.getStatusButtonOk();
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
      this.notification.warning(MESSAGE.WARNING, MESSAGE.MESSAGE_DELETE_WARNING);
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
    if (this.baoCao?.lstBcaos.every(item => !item.checked)) {           // tat ca o checkbox deu = false thi set o checkbox all = false
      this.allChecked = false;
      this.indeterminate = false;
    } else if (this.baoCao?.lstBcaos.every(item => item.checked)) {     // tat ca o checkbox deu = true thi set o checkbox all = true
      this.allChecked = true;
      this.indeterminate = false;
    } else {                                                        // o checkbox vua = false, vua = true thi set o checkbox all = indeterminate
      this.indeterminate = true;
    }
  }

  // update all
  updateAllCheckedTemp(): void {
    let idPhuLuc = PHULUCLIST.find(item => item.maPhuLuc == this.tabSelected)?.lstId;
    idPhuLuc.forEach(phuLuc => {
      let phuLucTemp = this.getPhuLuc(phuLuc);
      phuLucTemp.filter(item => item.checked = this.allCheckedTemp);
    })
    this.indeterminateTemp = false;                               // thuoc tinh su kien o checkbox all
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
  async changeTab(maPhuLuc, trangThaiChiTiet) {
    var index: number = this.tabs.findIndex(e => e.id === maPhuLuc);
    if (index != -1) {
      this.selectedIndex = index + 1;
    } else {
      this.tabs = [];
      this.tabs.push(this.baoCao?.lstBcaos.find(item => item.maLoai == maPhuLuc));
      this.selectedIndex = this.tabs.length + 1;
    }
    // this.savePhuLuc1(); // add cac danh sach phu luc 1 con vao danhSachChiTietPhuLucTemp
    if (!this.maDviTien) {
      this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
      return;
    }
    //check xem tat ca cac dong du lieu da luu chua?
    let checkSaveEdit;
    this.danhSachChiTietPhuLucTemp.filter(element => {
      if (this.editCache[element.id].edit == true) {
        checkSaveEdit = false
      }
    });

    if (checkSaveEdit == false) {
      this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTSAVE);
      return;
    }
    // set ma don vi tien trong list chinh = ma don vi tien vua chon tai man hinh
    this.baoCao?.lstBcaos.find(item => {
      if (item.maLoai == this.tabSelected) {
        item.lstCtietBcaos = Object.assign([], this.danhSachChiTietPhuLucTemp),
          item.maDviTien = this.maDviTien, item.thuyetMinh = this.thuyetMinh, item.lstIdDeletes = this.listIdDelete
      }
    });
    this.tabSelected = maPhuLuc;
    // set listBCaoTemp theo ma phu luc vua chon
    let lstBcaosTemp = this.baoCao?.lstBcaos.find(item => item.maLoai == maPhuLuc);
    this.danhSachChiTietPhuLucTemp = lstBcaosTemp?.lstCtietBcaos || [];
    this.maDviTien = lstBcaosTemp?.maDviTien;
    this.thuyetMinh = lstBcaosTemp?.thuyetMinh;
    this.trangThaiChiTiet = trangThaiChiTiet;
    this.resetList();
    switch (maPhuLuc) {
      //phu luc 1
      case PHULUCLIST[0].maPhuLuc:
        this.updateEditCache('1111');
        break;

      //phu luc 2
      case PHULUCLIST[1].maPhuLuc:
        this.updateEditCache('1111');
        break;
      //phu luc 3
      case PHULUCLIST[2].maPhuLuc:
        this.updateEditCache('1111');
        break;
      default:
        break;
    }

    if (this.danhSachChiTietPhuLucTemp.length > 0) {
      if (!this.danhSachChiTietPhuLucTemp[0].stt) {
        await this.sortWithoutIndex();
      } else {
        await this.sortByIndex();
      }
    }
    this.changeModel();
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
    if (dVi && dVi.maDviCha == this.userInfo.dvql) {
      checkParent = true;
    }
    let roleNguoiTao = this.userInfo?.roles[0]?.code;
    let trangThaiBaoCao = this.baoCao?.trangThai;
    if (trangThaiBaoCao == Utils.TT_BC_7 && ROLE_CAN_BO.includes(roleNguoiTao) && checkParent && (this.trangThaiChiTiet == 5 || this.trangThaiChiTiet == 2)) {
      this.statusBtnOk = false;
    } else if (trangThaiBaoCao == Utils.TT_BC_2 && ROLE_TRUONG_BO_PHAN.includes(roleNguoiTao) && checkChirld && (this.trangThaiChiTiet == 5 || this.trangThaiChiTiet == 2)) {
      this.statusBtnOk = false;
    } else if (trangThaiBaoCao == Utils.TT_BC_4 && ROLE_LANH_DAO.includes(roleNguoiTao) && checkChirld && (this.trangThaiChiTiet == 5 || this.trangThaiChiTiet == 2)) {
      this.statusBtnOk = false;
    } else {
      this.statusBtnOk = true;
    }

    if ((trangThaiBaoCao == Utils.TT_BC_1 || trangThaiBaoCao == Utils.TT_BC_3 || trangThaiBaoCao == Utils.TT_BC_5 || trangThaiBaoCao == Utils.TT_BC_8)
      && ROLE_CAN_BO.includes(roleNguoiTao) && checkChirld) {
      this.statusBtnFinish = false;
    } else {
      this.statusBtnFinish = true;
    }
  }

  changeModel() {
    this.kphiSdungTcong = 0;
    this.kphiSdungDtoan = 0;
    this.kphiSdungNguonKhac = 0;
    this.kphiSdungNguonQuy = 0;
    this.kphiSdungNstt = 0;
    this.kphiSdungCk = 0;
    this.kphiChuyenSangTcong = 0;
    this.kphiChuyenSangDtoan = 0;
    this.kphiChuyenSangNguonKhac = 0;
    this.kphiChuyenSangNguonQuy = 0;
    this.kphiChuyenSangNstt = 0;
    this.kphiChuyenSangCk = 0;
    this.dtoanGiaoTcong = 0;
    this.dtoanGiaoDtoan = 0;
    this.dtoanGiaoNguonKhac = 0;
    this.dtoanGiaoNguonQuy = 0;
    this.dtoanGiaoNstt = 0;
    this.dtoanGiaoCk = 0;
    this.giaiNganThangBcaoTcong = 0;
    this.giaiNganThangBcaoTcongTle = 0;
    this.giaiNganThangBcaoDtoan = 0;
    this.giaiNganThangBcaoDtoanTle = 0;
    this.giaiNganThangBcaoNguonKhac = 0;
    this.giaiNganThangBcaoNguonKhacTle = 0;
    this.giaiNganThangBcaoNguonQuy = 0;
    this.giaiNganThangBcaoNguonQuyTle = 0;
    this.giaiNganThangBcaoNstt = 0;
    this.giaiNganThangBcaoNsttTle = 0;
    this.giaiNganThangBcaoCk = 0;
    this.giaiNganThangBcaoCkTle = 0;
    this.luyKeGiaiNganTcong = 0;
    this.luyKeGiaiNganTcongTle = 0;
    this.luyKeGiaiNganDtoan = 0;
    this.luyKeGiaiNganDtoanTle = 0;
    this.luyKeGiaiNganNguonKhac = 0;
    this.luyKeGiaiNganNguonKhacTle = 0;
    this.luyKeGiaiNganNguonQuy = 0;
    this.luyKeGiaiNganNguonQuyTle = 0;
    this.luyKeGiaiNganNstt = 0;
    this.luyKeGiaiNganNsttTle = 0;
    this.luyKeGiaiNganCk = 0;
    this.luyKeGiaiNganCkTle = 0;

    this.danhSachChiTietPhuLucTemp.forEach(element => {
      if (element?.stt?.split('.').length == 2) {
        this.kphiSdungTcong += Number(element?.kphiSdungTcong);
        this.kphiSdungDtoan += Number(element?.kphiSdungDtoan);
        this.kphiSdungNguonKhac += Number(element?.kphiSdungNguonKhac);
        this.kphiSdungNguonQuy += Number(element?.kphiSdungNguonQuy);
        this.kphiSdungNstt += Number(element?.kphiSdungNstt);
        this.kphiSdungCk += Number(element?.kphiSdungCk);
        this.kphiChuyenSangTcong += Number(element?.kphiChuyenSangTcong);
        this.kphiChuyenSangDtoan += Number(element?.kphiChuyenSangDtoan);
        this.kphiChuyenSangNguonKhac += Number(element?.kphiChuyenSangNguonKhac);
        this.kphiChuyenSangNguonQuy += Number(element?.kphiChuyenSangNguonQuy);
        this.kphiChuyenSangNstt += Number(element?.kphiChuyenSangNstt);
        this.kphiChuyenSangCk += Number(element?.kphiChuyenSangCk);
        this.dtoanGiaoTcong += Number(element?.dtoanGiaoTcong);
        this.dtoanGiaoDtoan += Number(element?.dtoanGiaoDtoan);
        this.dtoanGiaoNguonKhac += Number(element?.dtoanGiaoNguonKhac);
        this.dtoanGiaoNguonQuy += Number(element?.dtoanGiaoNguonQuy);
        this.dtoanGiaoNstt += Number(element?.dtoanGiaoNstt);
        this.dtoanGiaoCk += Number(element?.dtoanGiaoCk);
        this.giaiNganThangBcaoTcong += Number(element?.giaiNganThangBcaoTcong);
        this.giaiNganThangBcaoDtoan += Number(element?.giaiNganThangBcaoDtoan);
        this.giaiNganThangBcaoNguonKhac += Number(element?.giaiNganThangBcaoNguonKhac);
        this.giaiNganThangBcaoNguonQuy += Number(element?.giaiNganThangBcaoNguonQuy);
        this.giaiNganThangBcaoNstt += Number(element?.giaiNganThangBcaoNstt);
        this.giaiNganThangBcaoCk += Number(element?.giaiNganThangBcaoCk);
        this.luyKeGiaiNganTcong += Number(element?.luyKeGiaiNganTcong);
        this.luyKeGiaiNganDtoan += Number(element?.luyKeGiaiNganDtoan);
        this.luyKeGiaiNganNguonKhac += Number(element?.luyKeGiaiNganNguonKhac);
        this.luyKeGiaiNganNguonQuy += Number(element?.luyKeGiaiNganNguonQuy);
        this.luyKeGiaiNganNstt += Number(element?.luyKeGiaiNganNstt);
        this.luyKeGiaiNganCk += Number(element?.luyKeGiaiNganCk);
        //ty le
        this.giaiNganThangBcaoTcongTle = Number(this.giaiNganThangBcaoTcong) / Number(this.kphiSdungTcong);
        this.giaiNganThangBcaoDtoanTle = Number(this.giaiNganThangBcaoDtoan) / Number(this.kphiSdungTcong);
        this.giaiNganThangBcaoNguonKhacTle = Number(this.giaiNganThangBcaoNguonKhac) / Number(this.kphiSdungTcong);
        this.giaiNganThangBcaoNguonQuyTle = Number(this.giaiNganThangBcaoNguonQuy) / Number(this.kphiSdungTcong);
        this.giaiNganThangBcaoNsttTle = Number(this.giaiNganThangBcaoNstt) / Number(this.kphiSdungTcong);
        this.giaiNganThangBcaoCkTle = Number(this.giaiNganThangBcaoCk) / Number(this.kphiSdungTcong);
        this.luyKeGiaiNganTcongTle = Number(this.luyKeGiaiNganTcong) / Number(this.kphiSdungTcong);
        this.luyKeGiaiNganDtoanTle = Number(this.luyKeGiaiNganDtoan) / Number(this.kphiSdungDtoan);
        this.luyKeGiaiNganNguonKhacTle = Number(this.luyKeGiaiNganNguonKhac) / Number(this.kphiSdungNguonKhac);
        this.luyKeGiaiNganNguonQuyTle = Number(this.luyKeGiaiNganNguonQuy) / Number(this.kphiSdungNguonQuy);
        this.luyKeGiaiNganNsttTle = Number(this.luyKeGiaiNganNstt) / Number(this.kphiSdungNstt);
        this.luyKeGiaiNganCkTle = Number(this.luyKeGiaiNganCk) / Number(this.kphiSdungCk);
    }
    });
  }

  changeModelPL1(id) {
    this.editCache[id].data.kphiSdungDtoan = Number(this.editCache[id].data.kphiChuyenSangDtoan) + Number(this.editCache[id].data.dtoanGiaoDtoan);
    this.editCache[id].data.kphiSdungNguonKhac = Number(this.editCache[id].data.kphiChuyenSangNguonKhac) + Number(this.editCache[id].data.dtoanGiaoNguonKhac);
    this.editCache[id].data.kphiSdungNguonQuy = Number(this.editCache[id].data.kphiChuyenSangNguonQuy) + Number(this.editCache[id].data.dtoanGiaoNguonQuy);
    this.editCache[id].data.kphiSdungNstt = Number(this.editCache[id].data.kphiChuyenSangNstt) + Number(this.editCache[id].data.dtoanGiaoNstt);
    this.editCache[id].data.kphiSdungCk = Number(this.editCache[id].data.kphiChuyenSangCk) + Number(this.editCache[id].data.dtoanGiaoCk);

    this.editCache[id].data.kphiSdungTcong = Number(this.editCache[id].data.kphiSdungDtoan) + Number(this.editCache[id].data.kphiSdungNguonKhac) + Number(this.editCache[id].data.kphiSdungNguonQuy)
      + Number(this.editCache[id].data.kphiSdungNstt) + Number(this.editCache[id].data.kphiSdungCk);

    this.editCache[id].data.kphiChuyenSangTcong = Number(this.editCache[id].data.kphiChuyenSangDtoan) + Number(this.editCache[id].data.kphiChuyenSangNguonKhac) + Number(this.editCache[id].data.kphiChuyenSangNguonQuy)
      + Number(this.editCache[id].data.kphiChuyenSangNstt) + Number(this.editCache[id].data.kphiChuyenSangCk);

    this.editCache[id].data.dtoanGiaoTcong = Number(this.editCache[id].data.dtoanGiaoDtoan) + Number(this.editCache[id].data.dtoanGiaoNguonKhac) + Number(this.editCache[id].data.dtoanGiaoNguonQuy)
      + Number(this.editCache[id].data.dtoanGiaoNstt) + Number(this.editCache[id].data.dtoanGiaoCk);

    this.editCache[id].data.giaiNganThangBcaoTcong = Number(this.editCache[id].data.giaiNganThangBcaoDtoan) + Number(this.editCache[id].data.giaiNganThangBcaoNguonKhac) + Number(this.editCache[id].data.giaiNganThangBcaoNguonQuy)
      + Number(this.editCache[id].data.giaiNganThangBcaoNstt) + Number(this.editCache[id].data.giaiNganThangBcaoCk);

    this.editCache[id].data.luyKeGiaiNganTcong = Number(this.editCache[id].data.luyKeGiaiNganDtoan) + Number(this.editCache[id].data.luyKeGiaiNganNguonKhac) + Number(this.editCache[id].data.luyKeGiaiNganNguonQuy)
      + Number(this.editCache[id].data.luyKeGiaiNganNstt) + Number(this.editCache[id].data.luyKeGiaiNganCk);

    this.editCache[id].data.giaiNganThangBcaoTcongTle = Number(this.editCache[id].data.giaiNganThangBcaoTcong) / Number(this.editCache[id].data.kphiSdungTcong);
    this.editCache[id].data.giaiNganThangBcaoDtoanTle = Number(this.editCache[id].data.giaiNganThangBcaoDtoan) / Number(this.editCache[id].data.kphiSdungTcong);
    this.editCache[id].data.giaiNganThangBcaoNguonKhacTle = Number(this.editCache[id].data.giaiNganThangBcaoNguonKhac) / Number(this.editCache[id].data.kphiSdungTcong);
    this.editCache[id].data.giaiNganThangBcaoNguonQuyTle = Number(this.editCache[id].data.giaiNganThangBcaoNguonQuy) / Number(this.editCache[id].data.kphiSdungTcong);
    this.editCache[id].data.giaiNganThangBcaoNsttTle = Number(this.editCache[id].data.giaiNganThangBcaoNstt) / Number(this.editCache[id].data.kphiSdungTcong);
    this.editCache[id].data.giaiNganThangBcaoCkTle = Number(this.editCache[id].data.giaiNganThangBcaoCk) / Number(this.editCache[id].data.kphiSdungTcong);
    this.editCache[id].data.luyKeGiaiNganTcongTle = Number(this.editCache[id].data.luyKeGiaiNganTcong) / Number(this.editCache[id].data.kphiSdungTcong);
    this.editCache[id].data.luyKeGiaiNganDtoanTle = Number(this.editCache[id].data.luyKeGiaiNganDtoan) / Number(this.editCache[id].data.kphiSdungDtoan);
    this.editCache[id].data.luyKeGiaiNganNguonKhacTle = Number(this.editCache[id].data.luyKeGiaiNganNguonKhac) / Number(this.editCache[id].data.kphiSdungNguonKhac);
    this.editCache[id].data.luyKeGiaiNganNguonQuyTle = Number(this.editCache[id].data.luyKeGiaiNganNguonQuy) / Number(this.editCache[id].data.kphiSdungNguonQuy);
    this.editCache[id].data.luyKeGiaiNganNsttTle = Number(this.editCache[id].data.luyKeGiaiNganNstt) / Number(this.editCache[id].data.kphiSdungNstt);
    this.editCache[id].data.luyKeGiaiNganCkTle = Number(this.editCache[id].data.luyKeGiaiNganCk) / Number(this.editCache[id].data.kphiSdungCk);


  }

  changeModelPL2(id) {
    this.editCache[id].data.dtoanSdungNamTcong = Number(this.editCache[id].data.dtoanSdungNamNguonNsnn) + Number(this.editCache[id].data.dtoanSdungNamNguonSn);
    this.editCache[id].data.giaiNganThangTcong = Number(this.editCache[id].data.giaiNganThangNguonNsnn) + Number(this.editCache[id].data.giaiNganThangNguonSn) + Number(this.editCache[id].data.giaiNganThangNguonQuy);
    this.editCache[id].data.luyKeGiaiNganTcong = Number(this.editCache[id].data.luyKeGiaiNganNguonNsnn) + Number(this.editCache[id].data.luyKeGiaiNganNguonSn) + Number(this.editCache[id].data.luyKeGiaiNganNguonQuy);
  }

  changeModelPL3(id) {

  }

  // xoa phu luc
  deletePhuLucList() {
    this.baoCao.lstBcaos = this.baoCao?.lstBcaos.filter(item => item.checked == false);
    if (this.baoCao?.lstBcaos?.findIndex(item => item.maLoai == this.tabSelected) == -1) {
      this.tabSelected = null;
    }
    this.allChecked = false;
  }

  // them phu luc
  addPhuLuc() {
    PHULUCLIST.forEach(item => item.status = false);
    var danhSach = PHULUCLIST.filter(item => this.baoCao?.lstBcaos?.findIndex(data => data.maLoai == item.maPhuLuc) == -1);

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
    modalIn.afterClose.toPromise().then((res) => {
      if (res) {
        res.forEach(item => {
          if (item.status) {
            this.baoCao.lstBcaos.push({
              id: uuid.v4() + 'FE',
              checked: false,
              tieuDe: item.tieuDe,
              maLoai: item.maPhuLuc,
              tenPhuLuc: item.tenPhuLuc,
              trangThai: '3',
              lstCtietBcaos: [],
              maDviTien: '1',
              thuyetMinh: null,
              lyDoTuChoi: null,
              lstIdDeletes: [],
              nguoiBcao: null,
              bcaoId: this.id,
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
      this.lstFiles.push({ id: id, fileName: file?.name });
      this.listFile.push(file);
    });
    this.fileList = [];
  }

  //download file về máy tính
  async downloadFile(id: string) {
    let file!: File;
    file = this.listFile.find(element => element?.lastModified.toString() == id);
    if (!file) {
      let fileAttach = this.lstFiles.find(element => element?.id == id);
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
      let file: any = this.fileDetail;
      const blob = new Blob([file], { type: "application/octet-stream" });
      fileSaver.saveAs(blob, file.name);
    }
  }

  // xoa file trong bang file
  deleteFile(id: string): void {
    this.lstFiles = this.lstFiles.filter((a: any) => a.id !== id);
    this.listFile = this.listFile.filter((a: any) => a?.lastModified.toString() !== id);
    this.listIdFilesDelete.push(id);
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

  //luu chi tiet phu luc
  async saveAppendix(maChucNang: string) {
    // await this.savePhuLuc1(); // add cac danh sach phu luc 1 con vao danhSachChiTietPhuLucTemp

    let baoCaoChiTiet = this.baoCao?.lstBcaos.find(item => item.maLoai == this.tabSelected);
    let baoCaoChiTietTemp = JSON.parse(JSON.stringify(baoCaoChiTiet));

    baoCaoChiTietTemp.lstCtietBcaos = JSON.parse(JSON.stringify(this.danhSachChiTietPhuLucTemp));
    baoCaoChiTietTemp.maDviTien = this.maDviTien, baoCaoChiTietTemp.thuyetMinh = this.thuyetMinh;
    // baoCaoChiTietTemp.lstIdDeletes = this.listIdDelete;

    let checkMoneyRange = true;
    let checkPersonReport = true;

    // validate nguoi thuc hien bao cao
    if (!baoCaoChiTietTemp.nguoiBcao) {
      checkPersonReport = false;
      this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.PERSONREPORT);
      return;
    }
    // validate bao cao
    if (baoCaoChiTietTemp.id?.length != 36) {
      this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.SAVEREPORT);
      return;
    }
    baoCaoChiTietTemp.trangThai = maChucNang;
    let checkSaveEdit;
    baoCaoChiTietTemp?.lstCtietBcaos.filter(data => {
      if (this.editCache[data.id].edit == true) {
        checkSaveEdit = false;
        return;
      }
      if (data.id?.length == 38) {
        data.id = null;
      }
      switch (baoCaoChiTietTemp.maLoai) {
        // phu luc 1
        case PHULUCLIST[0].maPhuLuc:
          data.kphiSdungTcong = mulMoney(data.kphiSdungTcong, baoCaoChiTietTemp.maDviTien);
          data.kphiSdungDtoan = mulMoney(data.kphiSdungDtoan, baoCaoChiTietTemp.maDviTien);
          data.kphiSdungNguonKhac = mulMoney(data.kphiSdungNguonKhac, baoCaoChiTietTemp.maDviTien);
          data.kphiSdungNguonQuy = mulMoney(data.kphiSdungNguonQuy, baoCaoChiTietTemp.maDviTien);
          data.kphiSdungNstt = mulMoney(data.kphiSdungNstt, baoCaoChiTietTemp.maDviTien);
          data.kphiSdungCk = mulMoney(data.kphiSdungCk, baoCaoChiTietTemp.maDviTien);
          data.kphiChuyenSangTcong = mulMoney(data.kphiChuyenSangTcong, baoCaoChiTietTemp.maDviTien);
          data.kphiChuyenSangDtoan = mulMoney(data.kphiChuyenSangDtoan, baoCaoChiTietTemp.maDviTien);
          data.kphiChuyenSangNguonKhac = mulMoney(data.kphiChuyenSangNguonKhac, baoCaoChiTietTemp.maDviTien);
          data.kphiChuyenSangNguonQuy = mulMoney(data.kphiChuyenSangNguonQuy, baoCaoChiTietTemp.maDviTien);
          data.kphiChuyenSangNstt = mulMoney(data.kphiChuyenSangNstt, baoCaoChiTietTemp.maDviTien);
          data.kphiChuyenSangCk = mulMoney(data.kphiChuyenSangCk, baoCaoChiTietTemp.maDviTien);
          data.dtoanGiaoTcong = mulMoney(data.dtoanGiaoTcong, baoCaoChiTietTemp.maDviTien);
          data.dtoanGiaoDtoan = mulMoney(data.dtoanGiaoDtoan, baoCaoChiTietTemp.maDviTien);
          data.dtoanGiaoNguonKhac = mulMoney(data.dtoanGiaoNguonKhac, baoCaoChiTietTemp.maDviTien);
          data.dtoanGiaoNguonQuy = mulMoney(data.dtoanGiaoNguonQuy, baoCaoChiTietTemp.maDviTien);
          data.dtoanGiaoNstt = mulMoney(data.dtoanGiaoNstt, baoCaoChiTietTemp.maDviTien);
          data.dtoanGiaoCk = mulMoney(data.dtoanGiaoCk, baoCaoChiTietTemp.maDviTien);
          data.giaiNganThangBcaoTcong = mulMoney(data.giaiNganThangBcaoTcong, baoCaoChiTietTemp.maDviTien);
          data.giaiNganThangBcaoDtoan = mulMoney(data.giaiNganThangBcaoDtoan, baoCaoChiTietTemp.maDviTien);
          data.giaiNganThangBcaoNguonKhac = mulMoney(data.giaiNganThangBcaoNguonKhac, baoCaoChiTietTemp.maDviTien);
          data.giaiNganThangBcaoNguonQuy = mulMoney(data.giaiNganThangBcaoNguonQuy, baoCaoChiTietTemp.maDviTien);
          data.giaiNganThangBcaoNstt = mulMoney(data.giaiNganThangBcaoNstt, baoCaoChiTietTemp.maDviTien);
          data.giaiNganThangBcaoCk = mulMoney(data.giaiNganThangBcaoCk, baoCaoChiTietTemp.maDviTien);
          data.luyKeGiaiNganTcong = mulMoney(data.luyKeGiaiNganTcong, baoCaoChiTietTemp.maDviTien);
          data.luyKeGiaiNganDtoan = mulMoney(data.luyKeGiaiNganDtoan, baoCaoChiTietTemp.maDviTien);
          data.luyKeGiaiNganNguonKhac = mulMoney(data.luyKeGiaiNganNguonKhac, baoCaoChiTietTemp.maDviTien);
          data.luyKeGiaiNganNguonQuy = mulMoney(data.luyKeGiaiNganNguonQuy, baoCaoChiTietTemp.maDviTien);
          data.luyKeGiaiNganNstt = mulMoney(data.luyKeGiaiNganNstt, baoCaoChiTietTemp.maDviTien);
          data.luyKeGiaiNganCk = mulMoney(data.luyKeGiaiNganCk, baoCaoChiTietTemp.maDviTien);

          if (data.kphiSdungTcong > MONEY_LIMIT || data.kphiSdungDtoan > MONEY_LIMIT || data.kphiSdungNguonKhac > MONEY_LIMIT ||
            data.kphiSdungNguonQuy > MONEY_LIMIT || data.kphiSdungNstt > MONEY_LIMIT || data.kphiSdungCk > MONEY_LIMIT ||
            data.kphiChuyenSangTcong > MONEY_LIMIT || data.kphiChuyenSangDtoan > MONEY_LIMIT || data.kphiChuyenSangNguonKhac > MONEY_LIMIT ||
            data.kphiChuyenSangNguonQuy > MONEY_LIMIT || data.kphiChuyenSangNstt > MONEY_LIMIT || data.kphiChuyenSangCk > MONEY_LIMIT ||
            data.dtoanGiaoTcong > MONEY_LIMIT || data.dtoanGiaoDtoan > MONEY_LIMIT || data.dtoanGiaoNguonKhac > MONEY_LIMIT ||
            data.dtoanGiaoNguonQuy > MONEY_LIMIT || data.dtoanGiaoNstt > MONEY_LIMIT || data.dtoanGiaoCk > MONEY_LIMIT ||
            data.giaiNganThangBcaoTcong > MONEY_LIMIT || data.giaiNganThangBcaoDtoan > MONEY_LIMIT || data.giaiNganThangBcaoNguonKhac > MONEY_LIMIT ||
            data.giaiNganThangBcaoNguonQuy > MONEY_LIMIT || data.giaiNganThangBcaoNstt > MONEY_LIMIT || data.giaiNganThangBcaoCk > MONEY_LIMIT ||
            data.luyKeGiaiNganTcong > MONEY_LIMIT || data.luyKeGiaiNganDtoan > MONEY_LIMIT || data.luyKeGiaiNganNguonKhac > MONEY_LIMIT ||
            data.luyKeGiaiNganNguonQuy > MONEY_LIMIT || data.luyKeGiaiNganNstt > MONEY_LIMIT || data.luyKeGiaiNganCk > MONEY_LIMIT) {

            checkMoneyRange = false;
            return;
          }
          break;

        // phu luc 2
        case PHULUCLIST[1].maPhuLuc:
          data.dtoanSdungNamTcong = mulMoney(data.dtoanSdungNamTcong, baoCaoChiTietTemp.maDviTien);
          data.dtoanSdungNamNguonNsnn = mulMoney(data.dtoanSdungNamNguonNsnn, baoCaoChiTietTemp.maDviTien);
          data.dtoanSdungNamNguonSn = mulMoney(data.dtoanSdungNamNguonSn, baoCaoChiTietTemp.maDviTien);
          data.dtoanSdungNamNguonQuy = mulMoney(data.dtoanSdungNamNguonQuy, baoCaoChiTietTemp.maDviTien);
          data.giaiNganThangTcong = mulMoney(data.giaiNganThangTcong, baoCaoChiTietTemp.maDviTien);
          data.giaiNganThangNguonNsnn = mulMoney(data.giaiNganThangNguonNsnn, baoCaoChiTietTemp.maDviTien);
          data.giaiNganThangNguonSn = mulMoney(data.giaiNganThangNguonSn, baoCaoChiTietTemp.maDviTien);
          data.giaiNganThangNguonQuy = mulMoney(data.giaiNganThangNguonQuy, baoCaoChiTietTemp.maDviTien);
          data.luyKeGiaiNganTcong = mulMoney(data.luyKeGiaiNganTcong, baoCaoChiTietTemp.maDviTien);
          data.luyKeGiaiNganNguonNsnn = mulMoney(data.luyKeGiaiNganNguonNsnn, baoCaoChiTietTemp.maDviTien);
          data.luyKeGiaiNganNguonSn = mulMoney(data.luyKeGiaiNganNguonSn, baoCaoChiTietTemp.maDviTien);
          data.luyKeGiaiNganNguonQuy = mulMoney(data.luyKeGiaiNganNguonQuy, baoCaoChiTietTemp.maDviTien);

          if (data.dtoanSdungNamTcong > MONEY_LIMIT || data.dtoanSdungNamNguonNsnn > MONEY_LIMIT || data.dtoanSdungNamNguonSn > MONEY_LIMIT ||
            data.dtoanSdungNamNguonQuy > MONEY_LIMIT || data.giaiNganThangTcong > MONEY_LIMIT || data.giaiNganThangNguonNsnn > MONEY_LIMIT ||
            data.giaiNganThangNguonSn > MONEY_LIMIT || data.giaiNganThangNguonQuy > MONEY_LIMIT || data.luyKeGiaiNganTcong > MONEY_LIMIT ||
            data.luyKeGiaiNganNguonNsnn > MONEY_LIMIT || data.luyKeGiaiNganNguonSn > MONEY_LIMIT || data.luyKeGiaiNganNguonQuy > MONEY_LIMIT) {
            checkMoneyRange = false;
            return;
          }
          break;

        // phu luc 3
        case PHULUCLIST[2].maPhuLuc:
          data.qddtTmdtTso = mulMoney(data.qddtTmdtTso, baoCaoChiTietTemp.maDviTien);
          data.qddtTmdtNsnn = mulMoney(data.qddtTmdtNsnn, baoCaoChiTietTemp.maDviTien);
          data.luyKeVonTso = mulMoney(data.luyKeVonTso, baoCaoChiTietTemp.maDviTien);
          data.luyKeVonNsnn = mulMoney(data.luyKeVonNsnn, baoCaoChiTietTemp.maDviTien);
          data.luyKeVonDt = mulMoney(data.luyKeVonDt, baoCaoChiTietTemp.maDviTien);
          data.luyKeVonThue = mulMoney(data.luyKeVonThue, baoCaoChiTietTemp.maDviTien);
          data.luyKeVonScl = mulMoney(data.luyKeVonScl, baoCaoChiTietTemp.maDviTien);
          data.luyKeGiaiNganHetNamTso = mulMoney(data.luyKeGiaiNganHetNamTso, baoCaoChiTietTemp.maDviTien);
          data.luyKeGiaiNganHetNamNsnnTso = mulMoney(data.luyKeGiaiNganHetNamNsnnTso, baoCaoChiTietTemp.maDviTien);
          data.luyKeGiaiNganHetNamNsnnKhNamTruoc = mulMoney(data.luyKeGiaiNganHetNamNsnnKhNamTruoc, baoCaoChiTietTemp.maDviTien);
          data.khoachVonNamTruocKeoDaiTso = mulMoney(data.khoachVonNamTruocKeoDaiTso, baoCaoChiTietTemp.maDviTien);
          data.khoachVonNamTruocKeoDaiDtpt = mulMoney(data.khoachVonNamTruocKeoDaiDtpt, baoCaoChiTietTemp.maDviTien);
          data.khoachVonNamTruocKeoDaiVonKhac = mulMoney(data.khoachVonNamTruocKeoDaiVonKhac, baoCaoChiTietTemp.maDviTien);
          data.khoachNamVonTso = mulMoney(data.khoachNamVonTso, baoCaoChiTietTemp.maDviTien);
          data.khoachNamVonNsnn = mulMoney(data.khoachNamVonNsnn, baoCaoChiTietTemp.maDviTien);
          data.khoachNamVonDt = mulMoney(data.khoachNamVonDt, baoCaoChiTietTemp.maDviTien);
          data.khoachNamVonThue = mulMoney(data.khoachNamVonThue, baoCaoChiTietTemp.maDviTien);
          data.khoachNamVonScl = mulMoney(data.khoachNamVonScl, baoCaoChiTietTemp.maDviTien);
          data.giaiNganTso = mulMoney(data.giaiNganTso, baoCaoChiTietTemp.maDviTien);
          data.giaiNganNsnn = mulMoney(data.giaiNganNsnn, baoCaoChiTietTemp.maDviTien);
          data.giaiNganNsnnVonDt = mulMoney(data.giaiNganNsnnVonDt, baoCaoChiTietTemp.maDviTien);
          data.giaiNganNsnnVonThue = mulMoney(data.giaiNganNsnnVonThue, baoCaoChiTietTemp.maDviTien);
          data.giaiNganNsnnVonScl = mulMoney(data.giaiNganNsnnVonScl, baoCaoChiTietTemp.maDviTien);
          data.luyKeGiaiNganDauNamTso = mulMoney(data.luyKeGiaiNganDauNamTso, baoCaoChiTietTemp.maDviTien);
          data.luyKeGiaiNganDauNamNsnn = mulMoney(data.luyKeGiaiNganDauNamNsnn, baoCaoChiTietTemp.maDviTien);
          data.luyKeGiaiNganDauNamNsnnVonDt = mulMoney(data.luyKeGiaiNganDauNamNsnnVonDt, baoCaoChiTietTemp.maDviTien);
          data.luyKeGiaiNganDauNamNsnnVonThue = mulMoney(data.luyKeGiaiNganDauNamNsnnVonThue, baoCaoChiTietTemp.maDviTien);
          data.luyKeGiaiNganDauNamNsnnVonScl = mulMoney(data.luyKeGiaiNganDauNamNsnnVonScl, baoCaoChiTietTemp.maDviTien);

          if (data.qddtTmdtTso > MONEY_LIMIT || data.qddtTmdtNsnn > MONEY_LIMIT || data.luyKeVonTso > MONEY_LIMIT ||
            data.luyKeVonNsnn > MONEY_LIMIT || data.luyKeVonDt > MONEY_LIMIT || data.luyKeVonThue > MONEY_LIMIT ||
            data.luyKeVonScl > MONEY_LIMIT || data.luyKeGiaiNganHetNamTso > MONEY_LIMIT || data.luyKeGiaiNganHetNamNsnnTso > MONEY_LIMIT ||
            data.luyKeGiaiNganHetNamNsnnKhNamTruoc > MONEY_LIMIT || data.khoachVonNamTruocKeoDaiTso > MONEY_LIMIT || data.khoachVonNamTruocKeoDaiDtpt > MONEY_LIMIT ||
            data.khoachVonNamTruocKeoDaiVonKhac > MONEY_LIMIT || data.khoachNamVonTso > MONEY_LIMIT || data.khoachNamVonNsnn > MONEY_LIMIT ||
            data.khoachNamVonDt > MONEY_LIMIT || data.khoachNamVonThue > MONEY_LIMIT || data.khoachNamVonScl > MONEY_LIMIT ||
            data.giaiNganTso > MONEY_LIMIT || data.giaiNganNsnn > MONEY_LIMIT || data.giaiNganNsnnVonDt > MONEY_LIMIT ||
            data.giaiNganNsnnVonThue > MONEY_LIMIT || data.giaiNganNsnnVonScl > MONEY_LIMIT || data.luyKeGiaiNganDauNamTso > MONEY_LIMIT ||
            data.luyKeGiaiNganDauNamNsnn > MONEY_LIMIT || data.luyKeGiaiNganDauNamNsnnVonDt > MONEY_LIMIT || data.luyKeGiaiNganDauNamNsnnVonThue > MONEY_LIMIT ||
            data.luyKeGiaiNganDauNamNsnnVonScl > MONEY_LIMIT) {
            checkMoneyRange = false;
            return;
          }
          break;
        default:
          break;
      }
    })
    if (checkSaveEdit == false) {
      this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTSAVE);
      return;
    }
    if (!checkMoneyRange == true) {
      this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.MONEYRANGE);
      return;
    }

    //call service cap nhat phu luc
    this.spinner.show();
    this.quanLyVonPhiService.baoCaoCapNhatChiTiet(baoCaoChiTietTemp).toPromise().then(
      async data => {
        if (data.statusCode == 0) {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.SUCCESS);
          this.baoCao?.lstBcaos?.filter(item => {
            if (item.maLoai == this.tabSelected) {
              item.trangThai = maChucNang;
            }
          })
          //await this.getDetailReport();
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
    this.spinner.hide();
  }

  // luu
  async save() {

    // set ma don vi tien trong list chinh = ma don vi tien vua chon tai man hinh
    this.baoCao?.lstBcaos.find(item => { if (item.maLoai == this.tabSelected) { item.lstCtietBcaos = Object.assign([], this.danhSachChiTietPhuLucTemp), item.maDviTien = this.maDviTien, item.thuyetMinh = this.thuyetMinh, item.lstIdDeletes = this.listIdDelete } });
    let baoCaoTemp = JSON.parse(JSON.stringify(this.baoCao));
    //get list file url
    let listFile: any = [];
    for (const iterator of this.listFile) {
      listFile.push(await this.uploadFile(iterator));
    }

    //get file cong van url
    let file: any = this.fileDetail;
    if (file) {
      baoCaoTemp.congVan = await this.uploadFile(file);
    }
    if (!baoCaoTemp.congVan) {
      this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.DOCUMENTARY);
      return;
    }

    let checkMoneyRange = true;
    let checkPersonReport = true;
    // replace nhung ban ghi dc them moi id thanh null
    baoCaoTemp?.lstBcaos?.filter(item => {
      if (!item.nguoiBcao) {
        checkPersonReport = false;
        this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.PERSONREPORT);
        return;
      }
      if (item.id?.length == 38) {
        item.id = null;
      }
      if (this.id == null) {
        item.trangThai = '3'; // set trang thai phu luc la chua danh gia
      }
      item?.lstCtietBcaos.filter(data => {
        if (item.id?.length == 38) {
          data.id = null;
        }
        switch (item.maLoai) {
          // phu luc 1
          case PHULUCLIST[0].maPhuLuc:
            data.kphiSdungTcong = mulMoney(data.kphiSdungTcong, item.maDviTien);
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

            if (data.kphiSdungTcong > MONEY_LIMIT || data.kphiSdungDtoan > MONEY_LIMIT || data.kphiSdungNguonKhac > MONEY_LIMIT ||
              data.kphiSdungNguonQuy > MONEY_LIMIT || data.kphiSdungNstt > MONEY_LIMIT || data.kphiSdungCk > MONEY_LIMIT ||
              data.kphiChuyenSangTcong > MONEY_LIMIT || data.kphiChuyenSangDtoan > MONEY_LIMIT || data.kphiChuyenSangNguonKhac > MONEY_LIMIT ||
              data.kphiChuyenSangNguonQuy > MONEY_LIMIT || data.kphiChuyenSangNstt > MONEY_LIMIT || data.kphiChuyenSangCk > MONEY_LIMIT ||
              data.dtoanGiaoTcong > MONEY_LIMIT || data.dtoanGiaoDtoan > MONEY_LIMIT || data.dtoanGiaoNguonKhac > MONEY_LIMIT ||
              data.dtoanGiaoNguonQuy > MONEY_LIMIT || data.dtoanGiaoNstt > MONEY_LIMIT || data.dtoanGiaoCk > MONEY_LIMIT ||
              data.giaiNganThangBcaoTcong > MONEY_LIMIT || data.giaiNganThangBcaoDtoan > MONEY_LIMIT || data.giaiNganThangBcaoNguonKhac > MONEY_LIMIT ||
              data.giaiNganThangBcaoNguonQuy > MONEY_LIMIT || data.giaiNganThangBcaoNstt > MONEY_LIMIT || data.giaiNganThangBcaoCk > MONEY_LIMIT ||
              data.luyKeGiaiNganTcong > MONEY_LIMIT || data.luyKeGiaiNganDtoan > MONEY_LIMIT || data.luyKeGiaiNganNguonKhac > MONEY_LIMIT ||
              data.luyKeGiaiNganNguonQuy > MONEY_LIMIT || data.luyKeGiaiNganNstt > MONEY_LIMIT || data.luyKeGiaiNganCk > MONEY_LIMIT) {
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

            if (data.dtoanSdungNamTcong > MONEY_LIMIT || data.dtoanSdungNamNguonNsnn > MONEY_LIMIT || data.dtoanSdungNamNguonSn > MONEY_LIMIT ||
              data.dtoanSdungNamNguonQuy > MONEY_LIMIT || data.giaiNganThangTcong > MONEY_LIMIT || data.giaiNganThangNguonNsnn > MONEY_LIMIT ||
              data.giaiNganThangNguonSn > MONEY_LIMIT || data.giaiNganThangNguonQuy > MONEY_LIMIT || data.luyKeGiaiNganTcong > MONEY_LIMIT ||
              data.luyKeGiaiNganNguonNsnn > MONEY_LIMIT || data.luyKeGiaiNganNguonSn > MONEY_LIMIT || data.luyKeGiaiNganNguonQuy > MONEY_LIMIT) {
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

            if (data.qddtTmdtTso > MONEY_LIMIT || data.qddtTmdtNsnn > MONEY_LIMIT || data.luyKeVonTso > MONEY_LIMIT ||
              data.luyKeVonNsnn > MONEY_LIMIT || data.luyKeVonDt > MONEY_LIMIT || data.luyKeVonThue > MONEY_LIMIT ||
              data.luyKeVonScl > MONEY_LIMIT || data.luyKeGiaiNganHetNamTso > MONEY_LIMIT || data.luyKeGiaiNganHetNamNsnnTso > MONEY_LIMIT ||
              data.luyKeGiaiNganHetNamNsnnKhNamTruoc > MONEY_LIMIT || data.khoachVonNamTruocKeoDaiTso > MONEY_LIMIT || data.khoachVonNamTruocKeoDaiDtpt > MONEY_LIMIT ||
              data.khoachVonNamTruocKeoDaiVonKhac > MONEY_LIMIT || data.khoachNamVonTso > MONEY_LIMIT || data.khoachNamVonNsnn > MONEY_LIMIT ||
              data.khoachNamVonDt > MONEY_LIMIT || data.khoachNamVonThue > MONEY_LIMIT || data.khoachNamVonScl > MONEY_LIMIT ||
              data.giaiNganTso > MONEY_LIMIT || data.giaiNganNsnn > MONEY_LIMIT || data.giaiNganNsnnVonDt > MONEY_LIMIT ||
              data.giaiNganNsnnVonThue > MONEY_LIMIT || data.giaiNganNsnnVonScl > MONEY_LIMIT || data.luyKeGiaiNganDauNamTso > MONEY_LIMIT ||
              data.luyKeGiaiNganDauNamNsnn > MONEY_LIMIT || data.luyKeGiaiNganDauNamNsnnVonDt > MONEY_LIMIT || data.luyKeGiaiNganDauNamNsnnVonThue > MONEY_LIMIT ||
              data.luyKeGiaiNganDauNamNsnnVonScl > MONEY_LIMIT) {
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

    if (checkMoneyRange != true || checkPersonReport != true) {
      return;
    } else {
      // replace nhung ban ghi dc them moi id thanh null
      baoCaoTemp.tongHopTuIds = [];
      baoCaoTemp?.lstBcaoDviTrucThuocs?.filter(item => {
        baoCaoTemp.tongHopTuIds.push(item.id);
      })

      baoCaoTemp.fileDinhKems = listFile;
      baoCaoTemp.listIdFiles = this.listIdFilesDelete;
      baoCaoTemp.trangThai = "1";
      baoCaoTemp.maDvi = this.maDonViTao;
      baoCaoTemp.maPhanBcao = '0';

      //call service them moi
      this.spinner.show();
      if (this.id == null) {
        //net la tao bao cao moi thi khong luu lstCtietBcaos, con la tong hop thi khong luu
        let lbc = this.routerActive.snapshot.paramMap.get('baoCao');
        if (lbc == 'bao-cao') {
          baoCaoTemp?.lstBcaos?.filter(item => item.lstCtietBcaos = []);
        }
        await this.quanLyVonPhiService.trinhDuyetBaoCaoThucHienDTCService(baoCaoTemp).toPromise().then(
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
        await this.quanLyVonPhiService.updateBaoCaoThucHienDTC(baoCaoTemp).toPromise().then(async res => {
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
    upfile.append('folder', this.baoCao?.maBcao + '/' + this.maDonViTao);
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

  // lay ten trang thai ban ghi
  getStatusName(Status: any) {
    const utils = new Utils();
    return utils.getStatusName(Status == '7' ? '6' : Status);
  };

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
    modalTuChoi.afterClose.toPromise().then(async (text) => {
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
    } else if (mcn == NOT_OK) {
      const modalTuChoi = this.modal.create({
        nzTitle: 'Not OK',
        nzContent: DialogTuChoiComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzWidth: '900px',
        nzFooter: null,
        nzComponentParams: {},
      });
      modalTuChoi.afterClose.toPromise().then(async (text) => {
        if (text) {
          await this.pheDuyetBieuMau(mcn, maLoai, text);
        }
      });
    }
    this.spinner.hide();
  }

  //call api duyet bieu mau
  async pheDuyetBieuMau(trangThai: any, maLoai: any, lyDo: string) {
    var idBieuMau: any = this.baoCao.lstBcaos.find((item) => item.maLoai == maLoai).id;
    const requestPheDuyetBieuMau = {
      id: idBieuMau,
      trangThai: trangThai,
      lyDoTuChoi: lyDo,
    };
    this.spinner.show();

    await this.quanLyVonPhiService.approveBieuMau(requestPheDuyetBieuMau).toPromise().then(async res => {
      if (res.statusCode == 0) {
        if (trangThai == NOT_OK) {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.REJECT_SUCCESS);
        } else {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.APPROVE_SUCCESS);
        }
        this.trangThaiChiTiet = trangThai;
        this.baoCao?.lstBcaos?.filter(item => {
          if (item.maLoai == maLoai) {
            item.trangThai = trangThai;
            item.lyDoTuChoi = lyDo;
          }
        })
        this.getStatusButtonOk();
      } else {
        this.notification.error(MESSAGE.ERROR, res?.msg);
      }
    }, err => {
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    })
    this.spinner.hide();
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
      maPhanBcao: '0',
    }
    await this.quanLyVonPhiService.tongHopBaoCaoKetQua(request).toPromise().then(
      async (data) => {
        if (data.statusCode == 0) {
          this.baoCao = data.data;
          await this.baoCao?.lstBcaos?.forEach(item => {
            item.maDviTien = '1';   // set defaul ma don vi tien la Dong
            item.checked = false;
            let index = PHULUCLIST.findIndex(data => data.maPhuLuc == item.maLoai);
            if (index !== -1) {
              item.tieuDe = PHULUCLIST[index].tieuDe;
              item.tenPhuLuc = PHULUCLIST[index].tenPhuLuc;
              item.trangThai = '3';
              item.nguoiBcao = this.userInfo.username;
            }
          })
          this.listFile = [];
          this.baoCao.trangThai = "1";
          if (this.baoCao.trangThai == Utils.TT_BC_1 ||
            this.baoCao.trangThai == Utils.TT_BC_3 ||
            this.baoCao.trangThai == Utils.TT_BC_5 ||
            this.baoCao.trangThai == Utils.TT_BC_8) {
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

  doPrint() {

  }

  doShowDialogCopy() {
    const modalTuChoi = this.modal.create({
      nzTitle: 'Copy Báo Cáo',
      nzContent: DialogBaoCaoCopyComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        maPhanBcao: '0',
        maLoaiBcao: this.baoCao.maLoaiBcao,
        namBcao: this.baoCao.namBcao,
        dotBcao: null,
        thangBcao: this.baoCao.thangBcao,
      },
    });
    modalTuChoi.afterClose.toPromise().then(async (response) => {
      if (response) {
        this.doCopy(response);
      }
    });
  }

  async doCopy(response) {
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
    this.baoCao?.lstBcaos.find(item => { if (item.maLoai == this.tabSelected) { item.maDviTien = this.maDviTien, item.thuyetMinh = this.thuyetMinh } });
    let baoCaoTemp = JSON.parse(JSON.stringify(this.baoCao));
    baoCaoTemp.congVan = null;
    // set nambao,dot bao cao tu dialog gui ve
    baoCaoTemp.namBcao = response.namBcao;
    baoCaoTemp.thangBcao = response.thangBcao;
    if (response.loaiCopy == 'D') {
      //xoa lst don vi truc thuoc theo lua chon tu dialog
      baoCaoTemp.lstBcaoDviTrucThuocs = [];
    }
    let checkMoneyRange = true;
    // replace nhung ban ghi dc them moi id thanh null
    baoCaoTemp?.lstBcaos?.filter(item => {
      item.id = null;
      item.listIdDelete = null;
      item.trangThai = '3'; // set trang thai phu luc la chua danh gia
      item?.lstCtietBcaos.filter(data => {
        data.id = null;
        switch (item.maLoai) {
          // phu luc 1
          case PHULUCLIST[0].maPhuLuc:
            data.kphiSdungTcong = mulMoney(data.kphiSdungTcong, item.maDviTien);
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
            if (data.kphiSdungTcong > MONEY_LIMIT || data.kphiSdungDtoan > MONEY_LIMIT || data.kphiSdungNguonKhac > MONEY_LIMIT ||
              data.kphiSdungNguonQuy > MONEY_LIMIT || data.kphiSdungNstt > MONEY_LIMIT || data.kphiSdungCk > MONEY_LIMIT ||
              data.kphiChuyenSangTcong > MONEY_LIMIT || data.kphiChuyenSangDtoan > MONEY_LIMIT || data.kphiChuyenSangNguonKhac > MONEY_LIMIT ||
              data.kphiChuyenSangNguonQuy > MONEY_LIMIT || data.kphiChuyenSangNstt > MONEY_LIMIT || data.kphiChuyenSangCk > MONEY_LIMIT ||
              data.dtoanGiaoTcong > MONEY_LIMIT || data.dtoanGiaoDtoan > MONEY_LIMIT || data.dtoanGiaoNguonKhac > MONEY_LIMIT ||
              data.dtoanGiaoNguonQuy > MONEY_LIMIT || data.dtoanGiaoNstt > MONEY_LIMIT || data.dtoanGiaoCk > MONEY_LIMIT ||
              data.giaiNganThangBcaoTcong > MONEY_LIMIT || data.giaiNganThangBcaoDtoan > MONEY_LIMIT || data.giaiNganThangBcaoNguonKhac > MONEY_LIMIT ||
              data.giaiNganThangBcaoNguonQuy > MONEY_LIMIT || data.giaiNganThangBcaoNstt > MONEY_LIMIT || data.giaiNganThangBcaoCk > MONEY_LIMIT ||
              data.luyKeGiaiNganTcong > MONEY_LIMIT || data.luyKeGiaiNganDtoan > MONEY_LIMIT || data.luyKeGiaiNganNguonKhac > MONEY_LIMIT ||
              data.luyKeGiaiNganNguonQuy > MONEY_LIMIT || data.luyKeGiaiNganNstt > MONEY_LIMIT || data.luyKeGiaiNganCk > MONEY_LIMIT) {
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

            if (data.dtoanSdungNamTcong > MONEY_LIMIT || data.dtoanSdungNamNguonNsnn > MONEY_LIMIT || data.dtoanSdungNamNguonSn > MONEY_LIMIT ||
              data.dtoanSdungNamNguonQuy > MONEY_LIMIT || data.giaiNganThangTcong > MONEY_LIMIT || data.giaiNganThangNguonNsnn > MONEY_LIMIT ||
              data.giaiNganThangNguonSn > MONEY_LIMIT || data.giaiNganThangNguonQuy > MONEY_LIMIT || data.luyKeGiaiNganTcong > MONEY_LIMIT ||
              data.luyKeGiaiNganNguonNsnn > MONEY_LIMIT || data.luyKeGiaiNganNguonSn > MONEY_LIMIT || data.luyKeGiaiNganNguonQuy > MONEY_LIMIT) {
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

            if (data.qddtTmdtTso > MONEY_LIMIT || data.qddtTmdtNsnn > MONEY_LIMIT || data.luyKeVonTso > MONEY_LIMIT ||
              data.luyKeVonNsnn > MONEY_LIMIT || data.luyKeVonDt > MONEY_LIMIT || data.luyKeVonThue > MONEY_LIMIT ||
              data.luyKeVonScl > MONEY_LIMIT || data.luyKeGiaiNganHetNamTso > MONEY_LIMIT || data.luyKeGiaiNganHetNamNsnnTso > MONEY_LIMIT ||
              data.luyKeGiaiNganHetNamNsnnKhNamTruoc > MONEY_LIMIT || data.khoachVonNamTruocKeoDaiTso > MONEY_LIMIT || data.khoachVonNamTruocKeoDaiDtpt > MONEY_LIMIT ||
              data.khoachVonNamTruocKeoDaiVonKhac > MONEY_LIMIT || data.khoachNamVonTso > MONEY_LIMIT || data.khoachNamVonNsnn > MONEY_LIMIT ||
              data.khoachNamVonDt > MONEY_LIMIT || data.khoachNamVonThue > MONEY_LIMIT || data.khoachNamVonScl > MONEY_LIMIT ||
              data.giaiNganTso > MONEY_LIMIT || data.giaiNganNsnn > MONEY_LIMIT || data.giaiNganNsnnVonDt > MONEY_LIMIT ||
              data.giaiNganNsnnVonThue > MONEY_LIMIT || data.giaiNganNsnnVonScl > MONEY_LIMIT || data.luyKeGiaiNganDauNamTso > MONEY_LIMIT ||
              data.luyKeGiaiNganDauNamNsnn > MONEY_LIMIT || data.luyKeGiaiNganDauNamNsnnVonDt > MONEY_LIMIT || data.luyKeGiaiNganDauNamNsnnVonThue > MONEY_LIMIT ||
              data.luyKeGiaiNganDauNamNsnnVonScl > MONEY_LIMIT) {
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
      baoCaoTemp.tongHopTuIds = [];
      baoCaoTemp?.lstBcaoDviTrucThuocs?.filter(item => {
        baoCaoTemp.tongHopTuIds.push(item.id);
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

  // xoa dong
  deleteById(id: any): void {
    this.danhSachChiTietPhuLucTemp = this.danhSachChiTietPhuLucTemp.filter(item => item.id != id)
    if (id?.length == 36) {
      this.listIdDelete.push(id);
    }
  }

  // chuyển đổi stt đang được mã hóa thành dạng I, II, a, b, c, ...
  getChiMuc(str: string): string {
    if (str) {
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
  }
  // lấy phần đầu của số thứ tự, dùng để xác định phần tử cha
  getHead(str: string): string {
    return str?.substring(0, str.lastIndexOf('.'));
  }
  // lấy phần đuôi của stt
  getTail(str: string): number {
    return parseInt(str.substring(str.lastIndexOf('.') + 1, str.length), 10);
  }
  //tìm vị trí cần để thêm mới
  findVt(str: string, phuLuc): number {
    let phuLucTemp = this.getPhuLuc(phuLuc)
    var start: number = phuLucTemp.findIndex(e => e.stt == str);
    var index: number = start;
    for (var i = start + 1; i < phuLucTemp.length; i++) {
      if (phuLucTemp[i].stt.startsWith(str)) {
        index = i;
      }
    }
    return index;
  }
  //thay thế các stt khi danh sách được cập nhật, heSo=1 tức là tăng stt lên 1, heso=-1 là giảm stt đi 1
  replaceIndex(lstIndex: number[], heSo: number, phuLuc: string) {
    let phuLucTemp = this.getPhuLuc(phuLuc);
    //thay doi lai stt cac vi tri vua tim duoc
    lstIndex.forEach(item => {
      var str = this.getHead(phuLucTemp[item].stt) + "." + (this.getTail(phuLucTemp[item].stt) + heSo).toString();
      var nho = phuLucTemp[item].stt;
      phuLucTemp.forEach(item => {
        item.stt = item.stt.replace(nho, str);
      })
    })
  }
  //thêm ngang cấp
  addSame(id: any, initItem, phuLuc: string) {
    let phuLucTemp = this.getPhuLuc(phuLuc);
    var index: number = phuLucTemp.findIndex(e => e.id == id); // vi tri hien tai
    var head: string = this.getHead(phuLucTemp[index].stt); // lay phan dau cua so tt
    var tail: number = this.getTail(phuLucTemp[index].stt); // lay phan duoi cua so tt
    var ind: number = this.findVt(phuLucTemp[index].stt, phuLuc); // vi tri can duoc them
    // tim cac vi tri can thay doi lai stt
    let lstIndex: number[] = [];
    for (var i = phuLucTemp.length - 1; i > ind; i--) {
      if (this.getHead(phuLucTemp[i].stt) == head) {
        lstIndex.push(i);
      }
    }
    this.replaceIndex(lstIndex, 1, phuLuc);
    // them moi phan tu
    if (initItem?.id) {
      let item = {
        ...initItem,
        stt: head + "." + (tail + 1).toString(),
      }
      phuLucTemp.splice(ind + 1, 0, item);
      this.editCache[item.id] = {
        edit: false,
        data: { ...item }
      };
    } else {
      let item = {
        ...initItem,
        id: uuid.v4() + "FE",
        stt: head + "." + (tail + 1).toString(),
      }
      phuLucTemp.splice(ind + 1, 0, item);
      this.editCache[item.id] = {
        edit: true,
        data: { ...item }
      };
    }
  }

  // gan editCache.data == lstCtietBcao
  updateEditCache(phuLuc: string): void {
    let phuLucTemp = this.getPhuLuc(phuLuc);
    phuLucTemp.forEach(item => {
      this.editCache[item.id] = {
        edit: false,
        data: { ...item }
      };
    });
  }


  //thêm cấp thấp hơn
  addLow(id: any, initItem, phuLuc: string) {

    let phuLucTemp = this.getPhuLuc(phuLuc);
    var data = phuLucTemp.find(e => e.id == id);
    var index: number = phuLucTemp.findIndex(e => e.id == id); // vi tri hien tai
    var stt: string;
    if (phuLucTemp.findIndex(e => this.getHead(e.stt) == data.stt) == -1) {
      stt = data.stt + '.1';
    } else {
      index = this.findVt(data.stt, phuLuc);
      for (var i = phuLucTemp.length - 1; i >= 0; i--) {
        if (this.getHead(phuLucTemp[i].stt) == data.stt) {
          stt = data.stt + '.' + (this.getTail(phuLucTemp[i].stt) + 1).toString();
          break;
        }
      }
    }

    // them moi phan tu
    if (initItem?.id) {
      let item = {
        ...initItem,
        stt: stt,
      }
      phuLucTemp.splice(index + 1, 0, item);
      this.editCache[item.id] = {
        edit: false,
        data: { ...item }
      };
    } else {
      if (phuLucTemp.findIndex(e => this.getHead(e.stt) == this.getHead(stt)) == -1) {
        this.sum(stt, phuLuc);
      }
      let item = {
        ...initItem,
        id: uuid.v4() + "FE",
        stt: stt,
      }
      phuLucTemp.splice(index + 1, 0, item);
      this.editCache[item.id] = {
        edit: true,
        data: { ...item }
      };
    }
  }
  //xóa dòng
  deleteLine(id: any, phuLuc: string) {
    let phuLucTemp = this.getPhuLuc(phuLuc);
    var index: number = phuLucTemp.findIndex(e => e.id == id); // vi tri hien tai
    var stt: string = phuLucTemp[index].stt;
    // khong tim thay thi out ra
    if (index == -1) return;
    var nho: string = phuLucTemp[index].stt;
    var head: string = this.getHead(phuLucTemp[index].stt); // lay phan dau cua so tt
    //xóa phần tử và con của nó
    phuLucTemp = phuLucTemp.filter(e => !e.stt.startsWith(nho));
    this.setPhuLuc(phuLucTemp, phuLuc);
    //update lại số thức tự cho các phần tử cần thiết
    let lstIndex: number[] = [];
    for (var i = phuLucTemp.length - 1; i >= index; i--) {
      if (this.getHead(phuLucTemp[i].stt) == head) {
        lstIndex.push(i);
      }
    }

    this.replaceIndex(lstIndex, -1, phuLuc);
    this.sum(stt, phuLuc);
    this.updateEditCache(phuLuc);
  }

  // start edit
  startEdit(id: string): void {
    this.editCache[id].edit = true;
  }


  // huy thay doi
  cancelEdit(id: string, phuLuc: string): void {
    let phuLucTemp = this.getPhuLuc(phuLuc);
    // lay vi tri hang minh sua
    const index = phuLucTemp.findIndex(item => item.id == id);
    // xoa dong neu truoc do chua co du lieu
    if (this.tabSelected == TAB_SELECTED.phuLuc1 && !phuLucTemp[index].maNdung) {
      this.deleteLine(id, phuLuc);
      return;
    } else if (this.tabSelected == TAB_SELECTED.phuLuc2 && !phuLucTemp[index].maNdung) {
      this.deleteLine(id, phuLuc);
      return;
    } else if (this.tabSelected == TAB_SELECTED.phuLuc3 && !phuLucTemp[index].maDan) {
      this.deleteLine(id, phuLuc);
      return;
    }
    //return du lieu
    this.editCache[id] = {
      data: { ...phuLucTemp[index] },
      edit: false
    };
  }

  // luu thay doi
  saveEdit(id: string, phuLuc: string): void {

    if (this.tabSelected == TAB_SELECTED.phuLuc1) {
      if (!this.editCache[id].data.maNdung) {
        this.notification.warning(MESSAGE.WARNING, MESSAGE.FINISH_FORM);
        return;
      }
    } else if (this.tabSelected == TAB_SELECTED.phuLuc2) {
      if (!this.editCache[id].data.maNdung) {
        this.notification.warning(MESSAGE.WARNING, MESSAGE.FINISH_FORM);
        return;
      }
    } else if (this.tabSelected == TAB_SELECTED.phuLuc3) {
      if (!this.editCache[id].data.maDan || !this.editCache[id].data.ddiemXdung) {
        this.notification.warning(MESSAGE.WARNING, MESSAGE.FINISH_FORM);
        return;
      }
    }
    let phuLucTemp = this.getPhuLuc(phuLuc);
    this.editCache[id].data.checked = phuLucTemp.find(item => item.id == id).checked; // set checked editCache = checked danhSachChiTietPhuLucTemp
    const index = phuLucTemp.findIndex(item => item.id == id); // lay vi tri hang minh sua
    Object.assign(phuLucTemp[index], this.editCache[id].data); // set lai data cua danhSachChiTietPhuLucTemp[index] = this.editCache[id].data
    this.editCache[id].edit = false; // CHUYEN VE DANG TEXT
    this.sum(phuLucTemp[index].stt, phuLuc);
    this.changeModel();
  }

  updateChecked(id: any, phuLuc: string) {
    let phuLucTemp = this.getPhuLuc(phuLuc);
    var data = phuLucTemp.find(e => e.id == id);
    //đặt các phần tử con có cùng trạng thái với nó
    phuLucTemp.forEach(item => {
      if (item.stt.startsWith(data.stt)) {
        item.checked = data.checked;
      }
    })
    //thay đổi các phần tử cha cho phù hợp với tháy đổi của phần tử con
    var index: number = phuLucTemp.findIndex(e => e.stt == this.getHead(data.stt));
    if (index == -1) {
      this.allChecked = this.checkAllChild('0', phuLuc);
    } else {
      var nho: boolean = phuLucTemp[index].checked;
      while (nho != this.checkAllChild(phuLucTemp[index].stt, phuLuc)) {
        phuLucTemp[index].checked = !nho;
        index = phuLucTemp.findIndex(e => e.stt == this.getHead(phuLucTemp[index].stt));
        if (index == -1) {
          this.allChecked = !nho;
          break;
        }
        nho = phuLucTemp[index].checked;
      }
    }

  }
  //kiểm tra các phần tử con có cùng được đánh dấu hay ko
  checkAllChild(str: string, phuLuc: string): boolean {
    let phuLucTemp = this.getPhuLuc(phuLuc);
    var nho: boolean = true;
    phuLucTemp.forEach(item => {
      if ((this.getHead(item.stt) == str) && (!item.checked) && (item.stt != str)) {
        nho = item.checked;
      }
    })
    return nho;
  }


  // update all
  updateAllChecked(): void {
    this.indeterminate = false;                               // thuoc tinh su kien o checkbox all
    this.baoCao?.lstBcaos.filter(item =>
      item.checked = this.allChecked
    );
  }

  deleteAllChecked() {
    let idPhuLuc = PHULUCLIST.find(item => item.maPhuLuc == this.tabSelected)?.lstId;
    idPhuLuc.forEach(phuLuc => {
      let phuLucTemp = this.getPhuLuc(phuLuc);
      var lstId: any[] = [];
      phuLucTemp.forEach(item => {
        if (item.checked) {
          lstId.push(item.id);
        }
      })
      lstId.forEach(item => {
        if (phuLucTemp.findIndex(e => e.id == item) != -1) {
          this.deleteLine(item, phuLuc);
        }
      })
    });
  }

  //thêm phần tử đầu tiên khi bảng rỗng
  async addFirst(initItem: any, phuLuc: string) {
    let phuLucTemp = [];
    let item;
    if (initItem?.id) {
      item = {
        ...initItem,
        stt: "0.1",
      }
    } else {
      item = {
        ...initItem,
        id: uuid.v4() + 'FE',
        stt: "0.1",
      }
    }
    phuLucTemp.push(item);
    this.editCache[item.id] = {
      edit: false,
      data: { ...item }
    };
    await this.setPhuLuc(phuLucTemp, phuLuc)
  }

  sortByIndex() {
    let idPhuLuc = PHULUCLIST.find(item => item.maPhuLuc == this.tabSelected)?.lstId;
    idPhuLuc.forEach(async phuLuc => {
      await this.setDetail(phuLuc);
      let phuLucTemp = this.getPhuLuc(phuLuc);
      phuLucTemp.sort((item1, item2) => {
        if (item1.level > item2.level) {
          return 1;
        }
        if (item1.level < item2.level) {
          return -1;
        }
        if (this.getTail(item1.stt) > this.getTail(item2.stt)) {
          return -1;
        }
        if (this.getTail(item1.stt) < this.getTail(item2.stt)) {
          return 1;
        }
        return 0;
      });
      var lstTemp: any[] = [];
      phuLucTemp.forEach(item => {
        var index: number = lstTemp.findIndex(e => e.stt == this.getHead(item.stt));
        if (index == -1) {
          lstTemp.splice(0, 0, item);
        } else {
          lstTemp.splice(index + 1, 0, item);
        }
      })
      phuLucTemp = lstTemp;
      this.setPhuLuc(phuLucTemp, phuLuc);
    })
  }

  setDetail(phuLuc) {
    let phuLucTemp = this.getPhuLuc(phuLuc);
    phuLucTemp.forEach(item => {
      if (PHULUCLIST[0].maPhuLuc == this.tabSelected) {
        item.level = this.noiDungFull.find(e => e.id == item.maNdung)?.level;
      } else if (PHULUCLIST[1].maPhuLuc == this.tabSelected) {
        item.level = this.noiDungPL2s.find(e => e.id == item.maNdung)?.level;
      } else if (PHULUCLIST[2].maPhuLuc == this.tabSelected) {
        item.level = this.maDanFull.find(e => e.id == item.maDan)?.level;
      }
    })
    this.setPhuLuc(phuLucTemp, phuLuc);
  }

  getIdCha(maKM: any) {
    if (PHULUCLIST[0].maPhuLuc == this.tabSelected) {
      return this.noiDungFull.find(e => e.id == maKM)?.idCha;
    } else if (PHULUCLIST[1].maPhuLuc == this.tabSelected) {
      return this.noiDungPL2s.find(e => e.id == maKM)?.idCha;
    } else if (PHULUCLIST[2].maPhuLuc == this.tabSelected) {
      return this.maDanFull.find(e => e.id == maKM)?.idCha;
    } else {
      return null;
    }
  }

  sortWithoutIndex() {
    let idPhuLuc = PHULUCLIST.find(item => item.maPhuLuc == this.tabSelected)?.lstId;
    idPhuLuc.forEach(async phuLuc => {
      let phuLucTemp = this.getPhuLuc(phuLuc);
      if (phuLucTemp && phuLucTemp.length > 0) {

        this.setDetail(phuLuc);
        var level = 0;
        var danhSachChiTietPhuLucTempTemp: any[] = phuLucTemp;
        phuLucTemp = [];
        var data = danhSachChiTietPhuLucTempTemp.find(e => e.level == 0);
        await this.addFirst(data, phuLuc);
        phuLucTemp = this.getPhuLuc(phuLuc);
        danhSachChiTietPhuLucTempTemp = danhSachChiTietPhuLucTempTemp.filter(e => e.id != data.id);
        var lstTemp = danhSachChiTietPhuLucTempTemp.filter(e => e.level == level);
        while (lstTemp.length != 0 || level == 0) {
          lstTemp.forEach(item => {
            let idCha = this.getIdCha(item.maNdung);
            var index: number = phuLucTemp.findIndex(e => e.maNdung == idCha);
            if (index != -1) {
              this.addLow(phuLucTemp[index].id, item, phuLuc);
            } else {
              index = phuLucTemp.findIndex(e => this.getIdCha(e.maNdung) == idCha);
              this.addSame(phuLucTemp[index].id, item, phuLuc);
            }
          })
          level += 1;
          lstTemp = danhSachChiTietPhuLucTempTemp.filter(e => e.level == level);
          // phuLucTemp = this.getPhuLuc(phuLuc);
        }

      }
    })
  }

  addLine(id: any, phuLuc) {
    let phuLucTemp = this.getPhuLuc(phuLuc);
    let dataPL;                 // du lieu default phu luc
    let lstKmTemp;              // list khoan muc chinh
    var maKm;                   // ma khoan muc

    if (PHULUCLIST[0].maPhuLuc == this.tabSelected) {
      dataPL = new ItemDataPL1();
      lstKmTemp = this.noiDungFull;
      maKm = phuLucTemp.find(e => e.id == id)?.maNdung;
    } else if (PHULUCLIST[1].maPhuLuc == this.tabSelected) {
      dataPL = new ItemDataPL2();
      lstKmTemp = this.noiDungPL2s;
      maKm = phuLucTemp.find(e => e.id == id)?.maNdung;
    } else if (PHULUCLIST[2].maPhuLuc == this.tabSelected) {
      dataPL = new ItemDataPL3();
      lstKmTemp = this.maDanFull;
      maKm = phuLucTemp.find(e => e.id == id)?.maDan;
    }
    dataPL.header = phuLuc;
    let obj = {
      maKhoanMuc: maKm,
      lstKhoanMuc: lstKmTemp,
    }
    const modalIn = this.modal.create({
      nzTitle: 'Danh sách nội dung',
      nzContent: DialogThemKhoanMucComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '65%',
      nzFooter: null,
      nzComponentParams: {
        obj: obj
      },
    });
    modalIn.afterClose.subscribe(async (res) => {
      if (res) {
        var index: number;
        if (PHULUCLIST[0].maPhuLuc == this.tabSelected) {
          index = phuLucTemp.findIndex(e => e.maNdung == res.maKhoanMuc);
        } else if (PHULUCLIST[1].maPhuLuc == this.tabSelected) {
          index = phuLucTemp.findIndex(e => e.maNdung == res.maKhoanMuc);
        } else if (PHULUCLIST[2].maPhuLuc == this.tabSelected) {
          index = phuLucTemp.findIndex(e => e.maDan == res.maKhoanMuc);
        }
        if (index == -1) {
          let data: any = {
            ...dataPL,
            maNdung: res.maKhoanMuc,
            maDan: res.maKhoanMuc,
            level: lstKmTemp.find(e => e.id == maKm)?.level,
          };
          if (phuLucTemp.length == 0) {
            await this.addFirst(data, phuLuc);
          } else {
            await this.addSame(id, data, phuLuc);
          }
        }
        phuLucTemp = this.getPhuLuc(phuLuc);
        if (PHULUCLIST[0].maPhuLuc == this.tabSelected) {
          id = phuLucTemp.find(e => e.maNdung == res.maKhoanMuc)?.id;
        } else if (PHULUCLIST[1].maPhuLuc == this.tabSelected) {
          id = phuLucTemp.find(e => e.maNdung == res.maKhoanMuc)?.id;
        } else if (PHULUCLIST[2].maPhuLuc == this.tabSelected) {
          id = phuLucTemp.find(e => e.maDan == res.maKhoanMuc)?.id;
        }
        res.lstKhoanMuc.forEach(item => {
          var data: any = {
            ...dataPL,
            maNdung: item.id,
            maDan: item.id,
            level: item.level,
          };
          this.addLow(id, data, phuLuc);
        })
        this.updateEditCache(phuLuc);
      }
    });
  }

  getLowStatus(str: string, phuLuc: string) {
    let phuLucTemp = this.getPhuLuc(phuLuc);
    var index: number = phuLucTemp.findIndex(e => this.getHead(e.stt) == str);
    if (index == -1) {
      return false;
    }
    return true;


  }

  getPhuLuc(phuLuc) {
    return this.danhSachChiTietPhuLucTemp;
  }

  setPhuLuc(listPhuLuc: any, phuLuc: string) {
    this.danhSachChiTietPhuLucTemp = listPhuLuc;
  }

  resetList() {
    this.danhSachChiTietPhuLuc11Temp = [];
    this.danhSachChiTietPhuLuc12Temp = [];
  }

  sum(stt: string, phuLuc) {
    let dataPL;
    if (PHULUCLIST[0].maPhuLuc == this.tabSelected) {
      dataPL = new ItemDataPL1();
    } else if (PHULUCLIST[1].maPhuLuc == this.tabSelected) {
      dataPL = new ItemDataPL2();
    } else if (PHULUCLIST[2].maPhuLuc == this.tabSelected) {
      dataPL = new ItemDataPL3();
    }
    let phuLucTemp = this.getPhuLuc(phuLuc);
    stt = this.getHead(stt);
    while (stt != '0') {
      var index = phuLucTemp.findIndex(e => e.stt == stt);
      let data = phuLucTemp[index];
      phuLucTemp[index] = {
        ...dataPL,
        id: data.id,
        stt: data.stt,
        header: data.header,
        checked: data.checked,
        level: data.level,
        bcaoCtietId: data.bcaoCtietId,
        maNdung: data.maNdung,       // pl 1,2
        ddiemXdung: data.ddiemXdung, // pl 3
        maDan: data.maDan, // pl 3
        qddtSoQdinh: data.qddtSoQdinh,
        ghiChu: data.ghiChu, // pl 3
        khoachThienNdungCviecThangConLaiNam: data.khoachThienNdungCviecThangConLaiNam, // pl 3
        ndungCviecDangThien: data.ndungCviecDangThien, // pl 3
        ndungCviecHthanhCuoiThang: data.ndungCviecHthanhCuoiThang, // pl 3
      }
      phuLucTemp.forEach(item => {
        if (this.getHead(item.stt) == stt) {
          if (PHULUCLIST[0].maPhuLuc == this.tabSelected) {
            phuLucTemp[index].kphiSdungTcong += item.kphiSdungTcong;
            phuLucTemp[index].kphiSdungDtoan += item.kphiSdungDtoan;
            phuLucTemp[index].kphiSdungNguonKhac += item.kphiSdungNguonKhac;
            phuLucTemp[index].kphiSdungNguonQuy += item.kphiSdungNguonQuy;
            phuLucTemp[index].kphiSdungNstt += item.kphiSdungNstt;
            phuLucTemp[index].kphiSdungCk += item.kphiSdungCk;
            phuLucTemp[index].kphiChuyenSangTcong += item.kphiChuyenSangTcong;
            phuLucTemp[index].kphiChuyenSangDtoan += item.kphiChuyenSangDtoan;
            phuLucTemp[index].kphiChuyenSangNguonKhac += item.kphiChuyenSangNguonKhac;
            phuLucTemp[index].kphiChuyenSangNguonQuy += item.kphiChuyenSangNguonQuy;
            phuLucTemp[index].kphiChuyenSangNstt += item.kphiChuyenSangNstt;
            phuLucTemp[index].kphiChuyenSangCk += item.kphiChuyenSangCk;
            phuLucTemp[index].dtoanGiaoTcong += item.dtoanGiaoTcong;
            phuLucTemp[index].dtoanGiaoDtoan += item.dtoanGiaoDtoan;
            phuLucTemp[index].dtoanGiaoNguonKhac += item.dtoanGiaoNguonKhac;
            phuLucTemp[index].dtoanGiaoNguonQuy += item.dtoanGiaoNguonQuy;
            phuLucTemp[index].dtoanGiaoNstt += item.dtoanGiaoNstt;
            phuLucTemp[index].dtoanGiaoCk += item.dtoanGiaoCk;
            phuLucTemp[index].giaiNganThangBcaoTcong += item.giaiNganThangBcaoTcong;
            phuLucTemp[index].giaiNganThangBcaoTcongTle += item.giaiNganThangBcaoTcongTle;
            phuLucTemp[index].giaiNganThangBcaoDtoan += item.giaiNganThangBcaoDtoan;
            phuLucTemp[index].giaiNganThangBcaoDtoanTle += item.giaiNganThangBcaoDtoanTle;
            phuLucTemp[index].giaiNganThangBcaoNguonKhac += item.giaiNganThangBcaoNguonKhac;
            phuLucTemp[index].giaiNganThangBcaoNguonKhacTle += item.giaiNganThangBcaoNguonKhacTle;
            phuLucTemp[index].giaiNganThangBcaoNguonQuy += item.giaiNganThangBcaoNguonQuy;
            phuLucTemp[index].giaiNganThangBcaoNguonQuyTle += item.giaiNganThangBcaoNguonQuyTle;
            phuLucTemp[index].giaiNganThangBcaoNstt += item.giaiNganThangBcaoNstt;
            phuLucTemp[index].giaiNganThangBcaoNsttTle += item.giaiNganThangBcaoNsttTle;
            phuLucTemp[index].giaiNganThangBcaoCk += item.giaiNganThangBcaoCk;
            phuLucTemp[index].giaiNganThangBcaoCkTle += item.giaiNganThangBcaoCkTle;
            phuLucTemp[index].luyKeGiaiNganTcong += item.luyKeGiaiNganTcong;
            phuLucTemp[index].luyKeGiaiNganTcongTle += item.luyKeGiaiNganTcongTle;
            phuLucTemp[index].luyKeGiaiNganDtoan += item.luyKeGiaiNganDtoan;
            phuLucTemp[index].luyKeGiaiNganDtoanTle += item.luyKeGiaiNganDtoanTle;
            phuLucTemp[index].luyKeGiaiNganNguonKhac += item.luyKeGiaiNganNguonKhac;
            phuLucTemp[index].luyKeGiaiNganNguonKhacTle += item.luyKeGiaiNganNguonKhacTle;
            phuLucTemp[index].luyKeGiaiNganNguonQuy += item.luyKeGiaiNganNguonQuy;
            phuLucTemp[index].luyKeGiaiNganNguonQuyTle += item.luyKeGiaiNganNguonQuyTle;
            phuLucTemp[index].luyKeGiaiNganNstt += item.luyKeGiaiNganNstt;
            phuLucTemp[index].luyKeGiaiNganNsttTle += item.luyKeGiaiNganNsttTle;
            phuLucTemp[index].luyKeGiaiNganCk += item.luyKeGiaiNganCk;
            phuLucTemp[index].luyKeGiaiNganCkTle += item.luyKeGiaiNganCkTle;
          } else if (PHULUCLIST[1].maPhuLuc == this.tabSelected) {
            phuLucTemp[index].dtoanSdungNamTcong += item.dtoanSdungNamTcong;
            phuLucTemp[index].dtoanSdungNamNguonNsnn += item.dtoanSdungNamNguonNsnn;
            phuLucTemp[index].dtoanSdungNamNguonSn += item.dtoanSdungNamNguonSn;
            phuLucTemp[index].dtoanSdungNamNguonQuy += item.dtoanSdungNamNguonQuy;
            phuLucTemp[index].giaiNganThangTcong += item.giaiNganThangTcong;
            phuLucTemp[index].giaiNganThangTcongTle += item.giaiNganThangTcongTle;
            phuLucTemp[index].giaiNganThangNguonNsnn += item.giaiNganThangNguonNsnn;
            phuLucTemp[index].giaiNganThangNguonNsnnTle += item.giaiNganThangNguonNsnnTle;
            phuLucTemp[index].giaiNganThangNguonSn += item.giaiNganThangNguonSn;
            phuLucTemp[index].giaiNganThangNguonSnTle += item.giaiNganThangNguonSnTle;
            phuLucTemp[index].giaiNganThangNguonQuy += item.giaiNganThangNguonQuy;
            phuLucTemp[index].giaiNganThangNguonQuyTle += item.giaiNganThangNguonQuyTle;
            phuLucTemp[index].luyKeGiaiNganTcong += item.luyKeGiaiNganTcong;
            phuLucTemp[index].luyKeGiaiNganTcongTle += item.luyKeGiaiNganTcongTle;
            phuLucTemp[index].luyKeGiaiNganNguonNsnn += item.luyKeGiaiNganNguonNsnn;
            phuLucTemp[index].luyKeGiaiNganNguonNsnnTle += item.luyKeGiaiNganNguonNsnnTle;
            phuLucTemp[index].luyKeGiaiNganNguonSn += item.luyKeGiaiNganNguonSn;
            phuLucTemp[index].luyKeGiaiNganNguonSnTle += item.luyKeGiaiNganNguonSnTle;
            phuLucTemp[index].luyKeGiaiNganNguonQuy += item.luyKeGiaiNganNguonQuy;
            phuLucTemp[index].luyKeGiaiNganNguonQuyTle += item.luyKeGiaiNganNguonQuyTle;
          } else if (PHULUCLIST[2].maPhuLuc == this.tabSelected) {
            phuLucTemp[index].qddtTmdtTso += item.qddtTmdtTso;
            phuLucTemp[index].qddtTmdtNsnn += item.qddtTmdtNsnn;
            phuLucTemp[index].luyKeVonTso += item.luyKeVonTso;
            phuLucTemp[index].luyKeVonNsnn += item.luyKeVonNsnn;
            phuLucTemp[index].luyKeVonDt += item.luyKeVonDt;
            phuLucTemp[index].luyKeVonThue += item.luyKeVonThue;
            phuLucTemp[index].luyKeVonScl += item.luyKeVonScl;
            phuLucTemp[index].luyKeGiaiNganHetNamTso += item.luyKeGiaiNganHetNamTso;
            phuLucTemp[index].luyKeGiaiNganHetNamNsnnTso += item.luyKeGiaiNganHetNamNsnnTso;
            phuLucTemp[index].luyKeGiaiNganHetNamNsnnKhNamTruoc += item.luyKeGiaiNganHetNamNsnnKhNamTruoc;
            phuLucTemp[index].khoachVonNamTruocKeoDaiTso += item.khoachVonNamTruocKeoDaiTso;
            phuLucTemp[index].khoachVonNamTruocKeoDaiDtpt += item.khoachVonNamTruocKeoDaiDtpt;
            phuLucTemp[index].khoachVonNamTruocKeoDaiVonKhac += item.khoachVonNamTruocKeoDaiVonKhac;
            phuLucTemp[index].khoachNamVonTso += item.khoachNamVonTso;
            phuLucTemp[index].khoachNamVonNsnn += item.khoachNamVonNsnn;
            phuLucTemp[index].khoachNamVonDt += item.khoachNamVonDt;
            phuLucTemp[index].khoachNamVonThue += item.khoachNamVonThue;
            phuLucTemp[index].khoachNamVonScl += item.khoachNamVonScl;
            phuLucTemp[index].kluongThienTso += item.kluongThienTso;
            phuLucTemp[index].kluongThienThangBcao += item.kluongThienThangBcao;
            phuLucTemp[index].giaiNganTso += item.giaiNganTso;
            phuLucTemp[index].giaiNganTsoTle += item.giaiNganTsoTle;
            phuLucTemp[index].giaiNganNsnn += item.giaiNganNsnn;
            phuLucTemp[index].giaiNganNsnnVonDt += item.giaiNganNsnnVonDt;
            phuLucTemp[index].giaiNganNsnnVonThue += item.giaiNganNsnnVonThue;
            phuLucTemp[index].giaiNganNsnnVonScl += item.giaiNganNsnnVonScl;
            phuLucTemp[index].giaiNganNsnnTle += item.giaiNganNsnnTle;
            phuLucTemp[index].giaiNganNsnnTleVonDt += item.giaiNganNsnnTleVonDt;
            phuLucTemp[index].giaiNganNsnnTleVonThue += item.giaiNganNsnnTleVonThue;
            phuLucTemp[index].giaiNganNsnnTleVonScl += item.giaiNganNsnnTleVonScl;
            phuLucTemp[index].luyKeGiaiNganDauNamTso += item.luyKeGiaiNganDauNamTso;
            phuLucTemp[index].luyKeGiaiNganDauNamTsoTle += item.luyKeGiaiNganDauNamTsoTle;
            phuLucTemp[index].luyKeGiaiNganDauNamNsnn += item.luyKeGiaiNganDauNamNsnn;
            phuLucTemp[index].luyKeGiaiNganDauNamNsnnVonDt += item.luyKeGiaiNganDauNamNsnnVonDt;
            phuLucTemp[index].luyKeGiaiNganDauNamNsnnVonThue += item.luyKeGiaiNganDauNamNsnnVonThue;
            phuLucTemp[index].luyKeGiaiNganDauNamNsnnVonScl += item.luyKeGiaiNganDauNamNsnnVonScl;
            phuLucTemp[index].luyKeGiaiNganDauNamNsnnTle += item.luyKeGiaiNganDauNamNsnnTle;
            phuLucTemp[index].luyKeGiaiNganDauNamNsnnTleVonDt += item.luyKeGiaiNganDauNamNsnnTleVonDt;
            phuLucTemp[index].luyKeGiaiNganDauNamNsnnTleVonThue += item.luyKeGiaiNganDauNamNsnnTleVonThue;
            phuLucTemp[index].luyKeGiaiNganDauNamNsnnTleVonScl += item.luyKeGiaiNganDauNamNsnnTleVonScl;
          }
        }
      })
      stt = this.getHead(stt);
    }
    // this.getTotal();
  }

  newTab(maPhuLuc: any): void {
    this.getStatusButtonOk();
    var index: number = this.tabs.findIndex(e => e.id === maPhuLuc);
    if (index != -1) {
      this.selectedIndex = index + 1;
    } else {
      this.tabs = [];
      this.tabs.push(this.baoCao?.lstBcaos.find(item => item.maLoai == maPhuLuc));
      this.selectedIndex = this.tabs.length + 1;
    }
  }

  closeTab({ index }: { index: number }): void {
    this.tabs.splice(index - 1, 1);
  }

  export() {
    let idBaoCao = this.baoCao.lstBcaos?.find(item => item.maLoai == this.tabSelected).id;
    let baoCao;
    if (this.tabSelected == TAB_SELECTED.phuLuc1) {
      baoCao = "phuLuc1.xlsx";
    } else if (this.tabSelected == TAB_SELECTED.phuLuc2) {
      baoCao = "phuLuc2.xlsx";
    } else if (this.tabSelected == TAB_SELECTED.phuLuc3) {
      baoCao = "phuLuc3.xlsx";
    }
    if (idBaoCao) {
      this.quanLyVonPhiService.exportBaoCao(this.id, idBaoCao).toPromise().then(
        (data) => {
          fileSaver.saveAs(data, baoCao);
        },
        (err) => {
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        },
      );
    }
  }
}
