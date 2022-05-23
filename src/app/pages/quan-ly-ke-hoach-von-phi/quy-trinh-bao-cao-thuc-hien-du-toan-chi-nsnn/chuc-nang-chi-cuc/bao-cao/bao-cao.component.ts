import { DatePipe, Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
import { divMoney, DON_VI_TIEN, KHOAN_MUC, MONEY_LIMIT, mulMoney, NOT_OK, OK, Utils } from 'src/app/Utility/utils';
import * as uuid from "uuid";
import * as XLSX from 'xlsx';
// import { KHOAN_MUC } from '../../../quan-ly-dieu-chinh-du-toan-chi-nsnn/quan-ly-dieu-chinh-du-toan-chi-nsnn.constant';
import { SOLAMA } from '../../../quy-trinh-bao-ket-qua-THVP-hang-DTQG-tai-tong-cuc/nhom-chuc-nang-chi-cuc/lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-DTQG-tai-chi-cuc-mau04a/lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-DTQG.constant';
import { LISTCANBO, PHULUCLIST, TAB_SELECTED } from './bao-cao.constant';
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
  qlnvKhvonphiBcaoId!: string;
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
  totalElements = 0;
  totalPages = 0;
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
  donVis: any = [];                            // danh muc don vi
  donViTiens: any = DON_VI_TIEN;                        // danh muc don vi tien
  lstFiles: any = [];                          // list File de day vao api
  status: boolean = false;                    // trang thai an/ hien cua trang thai
  maDonViTao!: any;                           // ma don vi tao

  maDviTien: string = "1";                    // ma don vi tien
  thuyetMinh: string;                         // thuyet minh
  newDate = new Date();                       //
  listFile: File[] = [];                      // list file chua ten va id de hien tai o input
  listIdDelete: any = [];                  // list id delete



  maDans: any = [];
  ddiemXdungs: any = [];

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
  nguoiBcao: string;
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
    private datePipe : DatePipe,

  ) {
  }
  listOfData: any[] = [];

  async ngOnInit() {
    const data = [];
    for (let i = 0; i < 100; i++) {
      data.push({
        name: `Edward King ${i}`,
        age: 32,
        address: `London, Park Lane no. ${i}`
      });
    }
    this.listOfData = data;
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
          qlnvKhvonphiBcaoId: this.id,
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
          this.baoCao?.lstBcaos?.forEach(item => {
            let index = PHULUCLIST.findIndex(data => data.maPhuLuc == item.maLoai);
            if (index !== -1) {
              item.tieuDe = PHULUCLIST[index].tieuDe;
              item.tenPhuLuc = PHULUCLIST[index].tenPhuLuc;
              item.checked = false;
            }
          })
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
      let checkStatusReport = this.baoCao?.lstBcaos?.findIndex(item => (item.trangThai != '5' && item.trangThai != '1'));
      if (checkStatusReport != -1) {
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
  updateAllChecked(): void {
    this.indeterminate = false;                               // thuoc tinh su kien o checkbox all
    this.baoCao?.lstBcaos.filter(item =>
      item.checked = this.allChecked
    );
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
    this.danhSachChiTietPhuLucTemp.filter(item => item.checked = this.allCheckedTemp);
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

    //check xem tat ca cac dong du lieu da luu chua?
    //chua luu thi bao loi, luu roi thi cho di
    this.danhSachChiTietPhuLucTemp.filter(element => {
      if (this.editCache[element.id].edit === true) {
        checkSaveEdit = false
      }
    });

    if (checkSaveEdit == false) {
      this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTSAVE);
      return;
    }
    // set ma don vi tien trong list chinh = ma don vi tien vua chon tai man hinh
    this.baoCao?.lstBcaos.find(item => { if (item.maLoai == this.tabSelected) { item.lstCtietBcaos = Object.assign([], this.danhSachChiTietPhuLucTemp), item.maDviTien = this.maDviTien, item.thuyetMinh = this.thuyetMinh, item.lstIdDeletes = this.listIdDelete } });
    this.tabSelected = maPhuLuc;
    // set listBCaoTemp theo ma phu luc vua chon
    let lstBcaosTemp = this.baoCao?.lstBcaos.find(item => item.maLoai == maPhuLuc);
    this.danhSachChiTietPhuLucTemp = lstBcaosTemp?.lstCtietBcaos || [];
    this.maDviTien = lstBcaosTemp?.maDviTien;
    this.thuyetMinh = lstBcaosTemp?.thuyetMinh;
    this.listIdDelete = []
    this.trangThaiChiTiet = trangThaiChiTiet;
    this.danhSachChiTietPhuLucTemp?.filter(data => {
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
    if (maPhuLuc == PHULUCLIST[0].maPhuLuc) {
      this.sortByIndex();
    }
    this.updateEditCache();
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

    let roleNguoiTao = this.userInfo?.roles[0]?.code;
    let trangThaiBaoCao = this.baoCao?.trangThai;
    if (trangThaiBaoCao == Utils.TT_BC_7 && roleNguoiTao == '3' && checkParent && (this.trangThaiChiTiet == 5 || this.trangThaiChiTiet == 2)) {
      this.statusBtnOk = false;
    } else if (trangThaiBaoCao == Utils.TT_BC_2 && roleNguoiTao == '2' && checkChirld && (this.trangThaiChiTiet == 5 || this.trangThaiChiTiet == 2)) {
      this.statusBtnOk = false;
    } else if (trangThaiBaoCao == Utils.TT_BC_4 && roleNguoiTao == '1' && checkChirld && (this.trangThaiChiTiet == 5 || this.trangThaiChiTiet == 2)) {
      this.statusBtnOk = false;
    } else {
      this.statusBtnOk = true;
    }

    if ((trangThaiBaoCao == Utils.TT_BC_1 || trangThaiBaoCao == Utils.TT_BC_3 || trangThaiBaoCao == Utils.TT_BC_5 || trangThaiBaoCao == Utils.TT_BC_8) 
        && roleNguoiTao == '3' && checkChirld) {
      this.statusBtnFinish = false;
    } else {
      this.statusBtnFinish = true;
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

  // start edit
  startEdit(id: string): void {
    this.editCache[id].edit = true;
  }

  // them dong moi
  addLine(id: number): void {
    let item;
    if (this.tabSelected == TAB_SELECTED.phuLuc1) {
      item = {
        id: uuid.v4() + 'FE',
        checked: false,
      }
    } else if (this.tabSelected == TAB_SELECTED.phuLuc2) {
      item = {
        id: uuid.v4() + 'FE',
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
        id: uuid.v4() + 'FE',
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
    // lay vi tri hang minh sua
    const index = this.danhSachChiTietPhuLucTemp.findIndex(item => item.id === id);
    // xoa dong neu truoc do chua co du lieu
    if (!this.danhSachChiTietPhuLucTemp[index].maNdung) {
      this.deleteLine(id);
      return;
    }
    //return du lieu
    this.editCache[id] = {
      data: { ...this.danhSachChiTietPhuLucTemp[index] },
      edit: false
    };
  }

  // luu thay doi
  // saveEdit(id: string): void {
  //   this.editCache[id].data.checked = this.danhSachChiTietPhuLucTemp.find(item => item.id === id).checked; // set checked editCache = checked lstCtietBcaos
  //   const index = this.danhSachChiTietPhuLucTemp.findIndex(item => item.id === id);   // lay vi tri hang minh sua
  //   Object.assign(this.danhSachChiTietPhuLucTemp[index], this.editCache[id].data); // set lai data cua lstCtietBcaos[index] = this.editCache[id].data
  //   this.editCache[id].edit = false;  // CHUYEN VE DANG TEXT
  // }

  // luu thay doi
  saveEdit(id: string): void {
    this.editCache[id].data.checked = this.danhSachChiTietPhuLucTemp.find(item => item.id === id).checked; // set checked editCache = checked danhSachChiTietPhuLucTemp
    if (this.lstKhoanMuc.findIndex(e => e.idCha == this.editCache[id].data.maNdung) != -1) {
      this.editCache[id].data.status = true;
    }
    const index = this.danhSachChiTietPhuLucTemp.findIndex(item => item.id === id); // lay vi tri hang minh sua
    Object.assign(this.danhSachChiTietPhuLucTemp[index], this.editCache[id].data); // set lai data cua danhSachChiTietPhuLucTemp[index] = this.editCache[id].data
    this.editCache[id].edit = false; // CHUYEN VE DANG TEXT
  }

  // xoa voi checkbox
  deleteSelected() {
    // add list delete id
    this.danhSachChiTietPhuLucTemp.filter(item => {
      if (item.checked == true && item?.id?.length == 38) {
        this.listIdDelete.push(item.id);
      }
    })
    // delete object have checked = true
    this.danhSachChiTietPhuLucTemp = this.danhSachChiTietPhuLucTemp.filter(item => item.checked != true)
    this.allCheckedTemp = false;
  }

  // luu temp vao bang chinh
  saveTemp() {
    this.baoCao?.lstBcaos.forEach(item => {
      if (item.maLoai == this.tabSelected) {
        item.lstCtietBcaos = this.danhSachChiTietPhuLucTemp;
      }
    });
    this.tabSelected = null;
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
              qlnvKhvonphiBcaoId: this.id,
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
    let baoCaoChiTiet = this.baoCao?.lstBcaos.find(item => item.maLoai == this.tabSelected);
    let baoCaoChiTietTemp = JSON.parse(JSON.stringify(baoCaoChiTiet));

    baoCaoChiTietTemp.lstCtietBcaos = JSON.parse(JSON.stringify(this.danhSachChiTietPhuLucTemp));
    baoCaoChiTietTemp.maDviTien = this.maDviTien, baoCaoChiTietTemp.thuyetMinh = this.thuyetMinh;
    baoCaoChiTietTemp.lstIdDeletes = this.listIdDelete;

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
    baoCaoChiTietTemp?.lstCtietBcaos.filter(data => {
      if (baoCaoChiTietTemp.id?.length == 38) {
        data.id = null;
      }
      switch (baoCaoChiTietTemp.maLoai) {
        // phu luc 1
        case PHULUCLIST[0].maPhuLuc:
          data.kphiSdungTcong = divMoney(data.kphiSdungTcong, baoCaoChiTietTemp.maDviTien);
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
      item.trangThai = '3'; // set trang thai phu luc la chua danh gia
      item?.lstCtietBcaos.filter(data => {
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

  // gan editCache.data == lstCtietBcaos
  updateEditCache(): void {
    this.danhSachChiTietPhuLucTemp.forEach(item => {
      this.editCache[item.id] = {
        edit: false,
        data: { ...item }
      };
    })
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
        await this.getDetailReport();
        this.getStatusButtonOk();
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
    if (str) {
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
      async (data) => {
        if (data.statusCode == 0) {
          this.baoCao = data.data;
          await this.baoCao?.lstBcaos?.forEach(item => {
            item.maDviTien = '1';   // set defaul ma don vi tien la Dong
            item.checked = false;
            item.trangThai = '5';
            let index = PHULUCLIST.findIndex(data => data.maPhuLuc == item.maLoai);
            if (index !== -1) {
              item.tieuDe = PHULUCLIST[index].tieuDe;
              item.tenPhuLuc = PHULUCLIST[index].tenPhuLuc;
              item.trangThai = '3';
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
          this.sortWithoutIndex();
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
    this.baoCao?.lstBcaos.find(item => { if (item.maLoai == this.tabSelected) { item.maDviTien = this.maDviTien, item.thuyetMinh = this.thuyetMinh } });
    let baoCaoTemp = JSON.parse(JSON.stringify(this.baoCao));

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

  // lấy phần đầu của số thứ tự, dùng để xác định phần tử cha
  getHead(str: string): string {
    if (str)
      return str.substring(0, str.lastIndexOf('.'));
  }
  // lấy phần đuôi của stt
  getTail(str: string): number {
    if (str)
      return parseInt(str.substring(str.lastIndexOf('.') + 1, str.length), 10);
  }

  //tìm vị trí cần để thêm mới
  findVt(str: string): number {
    var start: number = this.danhSachChiTietPhuLucTemp.findIndex(e => e.stt == str);
    var index: number = start;
    for (var i = start + 1; i < this.danhSachChiTietPhuLucTemp.length; i++) {
      if (this.danhSachChiTietPhuLucTemp[i].stt.startsWith(str)) {
        index = i;
      }
    }
    return index;
  }
  //thay thế các stt khi danh sách được cập nhật, heSo=1 tức là tăng stt lên 1, heso=-1 là giảm stt đi 1
  replaceIndex(lstIndex: number[], heSo: number) {
    //thay doi lai stt cac vi tri vua tim duoc
    lstIndex.forEach(item => {
      var str = this.getHead(this.danhSachChiTietPhuLucTemp[item].stt) + "." + (this.getTail(this.danhSachChiTietPhuLucTemp[item].stt) + heSo).toString();
      var nho = this.danhSachChiTietPhuLucTemp[item].stt;
      this.danhSachChiTietPhuLucTemp.forEach(item => {
        item.stt = item.stt.replace(nho, str);
      })
    })
  }
  //thêm ngang cấp
  addSame(id: any, initItem: ItemData) {
    var index: number = this.danhSachChiTietPhuLucTemp.findIndex(e => e.id === id); // vi tri hien tai
    var head: string = this.getHead(this.danhSachChiTietPhuLucTemp[index].stt); // lay phan dau cua so tt
    var tail: number = this.getTail(this.danhSachChiTietPhuLucTemp[index].stt); // lay phan duoi cua so tt
    var ind: number = this.findVt(this.danhSachChiTietPhuLucTemp[index].stt); // vi tri can duoc them
    // tim cac vi tri can thay doi lai stt
    let lstIndex: number[] = [];
    for (var i = this.danhSachChiTietPhuLucTemp.length - 1; i > ind; i--) {
      if (this.getHead(this.danhSachChiTietPhuLucTemp[i].stt) == head) {
        lstIndex.push(i);
      }
    }
    this.replaceIndex(lstIndex, 1);
    // them moi phan tu
    if (initItem?.id) {
      let item = {
        ...initItem,
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
        giaiNganThangBcaoDtoan: 0,
        giaiNganThangBcaoNguonKhac: 0,
        giaiNganThangBcaoNguonQuy: 0,
        giaiNganThangBcaoNstt: 0,
        giaiNganThangBcaoCk: 0,
        luyKeGiaiNganTcong: 0,
        luyKeGiaiNganDtoan: 0,
        luyKeGiaiNganNguonKhac: 0,
        luyKeGiaiNganNguonQuy: 0,
        luyKeGiaiNganNstt: 0,
        luyKeGiaiNganCk: 0,
        stt: head + "." + (tail + 1).toString(),
      }
      this.danhSachChiTietPhuLucTemp.splice(ind + 1, 0, item);
      this.editCache[item.id] = {
        edit: false,
        data: { ...item }
      };
    } else {
      let item = {
        ...initItem,
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
        giaiNganThangBcaoDtoan: 0,
        giaiNganThangBcaoNguonKhac: 0,
        giaiNganThangBcaoNguonQuy: 0,
        giaiNganThangBcaoNstt: 0,
        giaiNganThangBcaoCk: 0,
        luyKeGiaiNganTcong: 0,
        luyKeGiaiNganDtoan: 0,
        luyKeGiaiNganNguonKhac: 0,
        luyKeGiaiNganNguonQuy: 0,
        luyKeGiaiNganNstt: 0,
        luyKeGiaiNganCk: 0,
        id: uuid.v4() + 'FE',
        stt: head + "." + (tail + 1).toString(),
        lstKm: this.danhSachChiTietPhuLucTemp[index].lstKm,
      }
      this.danhSachChiTietPhuLucTemp.splice(ind + 1, 0, item);
      this.editCache[item.id] = {
        edit: true,
        data: { ...item }
      };
    }
  }


  //thêm cấp thấp hơn
  addLow(id: any, initItem: ItemData) {
    var index: number = this.danhSachChiTietPhuLucTemp.findIndex(e => e.id === id); // vi tri hien tai
    //list các vị trí cần thay đôi lại stt
    let lstIndex: number[] = [];
    for (var i = this.danhSachChiTietPhuLucTemp.length - 1; i > index; i--) {
      if (this.getHead(this.danhSachChiTietPhuLucTemp[i].stt) == this.danhSachChiTietPhuLucTemp[index].stt) {
        lstIndex.push(i);
      }
    }
    this.replaceIndex(lstIndex, 1);
    // them moi phan tu
    if (initItem?.id) {
      let item = {
        ...initItem,
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
        giaiNganThangBcaoDtoan: 0,
        giaiNganThangBcaoNguonKhac: 0,
        giaiNganThangBcaoNguonQuy: 0,
        giaiNganThangBcaoNstt: 0,
        giaiNganThangBcaoCk: 0,
        luyKeGiaiNganTcong: 0,
        luyKeGiaiNganDtoan: 0,
        luyKeGiaiNganNguonKhac: 0,
        luyKeGiaiNganNguonQuy: 0,
        luyKeGiaiNganNstt: 0,
        luyKeGiaiNganCk: 0,
        stt: this.danhSachChiTietPhuLucTemp[index].stt + ".1",
      }
      this.danhSachChiTietPhuLucTemp.splice(index + 1, 0, item);
      this.editCache[item.id] = {
        edit: false,
        data: { ...item }
      };
    } else {
      let item = {
        ...initItem,
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
        giaiNganThangBcaoDtoan: 0,
        giaiNganThangBcaoNguonKhac: 0,
        giaiNganThangBcaoNguonQuy: 0,
        giaiNganThangBcaoNstt: 0,
        giaiNganThangBcaoCk: 0,
        luyKeGiaiNganTcong: 0,
        luyKeGiaiNganDtoan: 0,
        luyKeGiaiNganNguonKhac: 0,
        luyKeGiaiNganNguonQuy: 0,
        luyKeGiaiNganNstt: 0,
        luyKeGiaiNganCk: 0,
        id: uuid.v4() + 'FE',
        lstKm: this.lstKhoanMuc.filter(e => e.idCha == this.danhSachChiTietPhuLucTemp[index].maNdung),
        stt: this.danhSachChiTietPhuLucTemp[index].stt + ".1",
      }
      this.danhSachChiTietPhuLucTemp.splice(index + 1, 0, item);

      this.editCache[item.id] = {
        edit: true,
        data: { ...item }
      };
    }
  }
  //xóa dòng
  deleteLine(id: any) {
    var index: number = this.danhSachChiTietPhuLucTemp.findIndex(e => e.id === id); // vi tri hien tai
    var nho: string = this.danhSachChiTietPhuLucTemp[index].stt;
    var head: string = this.getHead(this.danhSachChiTietPhuLucTemp[index].stt); // lay phan dau cua so tt
    //xóa phần tử và con của nó
    this.danhSachChiTietPhuLucTemp = this.danhSachChiTietPhuLucTemp.filter(e => !e.stt.startsWith(nho));
    //update lại số thức tự cho các phần tử cần thiết
    let lstIndex: number[] = [];
    for (var i = this.danhSachChiTietPhuLucTemp.length - 1; i >= index; i--) {
      if (this.getHead(this.danhSachChiTietPhuLucTemp[i].stt) == head) {
        lstIndex.push(i);
      }
    }

    this.replaceIndex(lstIndex, -1);

    this.updateEditCache();
  }

  // xoa dong
  deleteById(id: any): void {
    this.danhSachChiTietPhuLucTemp = this.danhSachChiTietPhuLucTemp.filter(item => item.id != id)
    if (id?.length == 36) {
      this.listIdDelete.push(id);
    }
  }

  updateChecked(id: any) {
    var data = this.danhSachChiTietPhuLucTemp.find(e => e.id === id);
    //đặt các phần tử con có cùng trạng thái với nó
    this.danhSachChiTietPhuLucTemp.forEach(item => {
      if (item.stt.startsWith(data.stt)) {
        item.checked = data.checked;
      }
    })
    //thay đổi các phần tử cha cho phù hợp với tháy đổi của phần tử con
    var index: number = this.danhSachChiTietPhuLucTemp.findIndex(e => e.stt == this.getHead(data.stt));
    if (index == -1) {
      this.allChecked = this.checkAllChild('0');
    } else {
      var nho: boolean = this.danhSachChiTietPhuLucTemp[index].checked;
      while (nho != this.checkAllChild(this.danhSachChiTietPhuLucTemp[index].stt)) {
        this.danhSachChiTietPhuLucTemp[index].checked = !nho;
        index = this.danhSachChiTietPhuLucTemp.findIndex(e => e.stt == this.getHead(this.danhSachChiTietPhuLucTemp[index].stt));
        if (index == -1) {
          this.allChecked = !nho;
          break;
        }
        nho = this.danhSachChiTietPhuLucTemp[index].checked;
      }
    }
  }
  //kiểm tra các phần tử con có cùng được đánh dấu hay ko
  checkAllChild(str: string): boolean {
    var nho: boolean = true;
    this.danhSachChiTietPhuLucTemp.forEach(item => {
      if ((this.getHead(item.stt) == str) && (!item.checked) && (item.stt != str)) {
        nho = item.checked;
      }
    })
    return nho;
  }

  deleteAllChecked() {
    var lstId: any[] = [];
    this.danhSachChiTietPhuLucTemp.forEach(item => {
      if (item.checked) {
        lstId.push(item.id);
      }
    })
    lstId.forEach(item => {
      if (this.danhSachChiTietPhuLucTemp.findIndex(e => e.id == item) != -1) {
        this.deleteLine(item);
      }
    })
  }
  //thêm phần tử đầu tiên khi bảng rỗng
  addFirst(initItem: any) {

    if (initItem?.id) {
      let item = {
        ...initItem,
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
        giaiNganThangBcaoDtoan: 0,
        giaiNganThangBcaoNguonKhac: 0,
        giaiNganThangBcaoNguonQuy: 0,
        giaiNganThangBcaoNstt: 0,
        giaiNganThangBcaoCk: 0,
        luyKeGiaiNganTcong: 0,
        luyKeGiaiNganDtoan: 0,
        luyKeGiaiNganNguonKhac: 0,
        luyKeGiaiNganNguonQuy: 0,
        luyKeGiaiNganNstt: 0,
        luyKeGiaiNganCk: 0,
        stt: "0.1",
      }
      this.danhSachChiTietPhuLucTemp.push(item);
      this.editCache[item.id] = {
        edit: false,
        data: { ...item }
      };
    } else {
      let item = {
        id: uuid.v4() + 'FE',
        maNdung: 0,
        lstKm: this.lstKhoanMuc.filter(e => e.idCha == 0),
        status: false,
        stt: "0.1",
        checked: false,
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
        giaiNganThangBcaoDtoan: 0,
        giaiNganThangBcaoNguonKhac: 0,
        giaiNganThangBcaoNguonQuy: 0,
        giaiNganThangBcaoNstt: 0,
        giaiNganThangBcaoCk: 0,
        luyKeGiaiNganTcong: 0,
        luyKeGiaiNganDtoan: 0,
        luyKeGiaiNganNguonKhac: 0,
        luyKeGiaiNganNguonQuy: 0,
        luyKeGiaiNganNstt: 0,
        luyKeGiaiNganCk: 0,
      }
      this.danhSachChiTietPhuLucTemp.push(item);

      this.editCache[item.id] = {
        edit: true,
        data: { ...item }
      };
    }
  }

  sortByIndex() {
    this.danhSachChiTietPhuLucTemp.forEach(item => {
      this.setDetail(item.id);
    })
    this.danhSachChiTietPhuLucTemp.sort((item1, item2) => {
      if (item1.lstKm[0].level > item2.lstKm[0].level) {
        return 1;
      }
      if (item1.lstKm[0].level < item2.lstKm[0].level) {
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
    this.danhSachChiTietPhuLucTemp.forEach(item => {
      var index: number = lstTemp.findIndex(e => e.stt == this.getHead(item.stt));
      if (index == -1) {
        lstTemp.splice(0, 0, item);
      } else {
        lstTemp.splice(index + 1, 0, item);
      }
    })

    this.danhSachChiTietPhuLucTemp = lstTemp;
  }

  setDetail(id: any) {
    var index: number = this.danhSachChiTietPhuLucTemp.findIndex(item => item.id === id);
    var parentId: number = this.lstKhoanMuc.find(e => e.id == this.danhSachChiTietPhuLucTemp[index].maNdung).idCha;
    this.danhSachChiTietPhuLucTemp[index].lstKm = this.lstKhoanMuc.filter(e => e.idCha == parentId);
    if (this.lstKhoanMuc.findIndex(e => e.idCha === this.danhSachChiTietPhuLucTemp[index].maNdung) == -1) {
      this.danhSachChiTietPhuLucTemp[index].status = false;
    } else {
      this.danhSachChiTietPhuLucTemp[index].status = true;
    }
  }

  sortWithoutIndex() {
    this.danhSachChiTietPhuLucTemp.forEach(item => {
      this.setDetail(item.id);
    })

    var level = 0;
    var danhSachChiTietPhuLucTempTemp: any[] = this.danhSachChiTietPhuLucTemp;
    this.danhSachChiTietPhuLucTemp = [];
    var data = danhSachChiTietPhuLucTempTemp.find(e => e.lstKm[0].level == 0);
    this.addFirst(data);
    danhSachChiTietPhuLucTempTemp = danhSachChiTietPhuLucTempTemp.filter(e => e.id != data.id);
    var lstTemp = danhSachChiTietPhuLucTempTemp.filter(e => e.lstKm[0].level == level);
    while (lstTemp.length != 0 || level == 0) {
      lstTemp.forEach(item => {
        var index: number = this.danhSachChiTietPhuLucTemp.findIndex(e => e.maNdung === item.lstKm[0].idCha);
        if (index != -1) {
          this.addLow(this.danhSachChiTietPhuLucTemp[index].id, item);
        } else {
          index = this.danhSachChiTietPhuLucTemp.findIndex(e => e.lstKm[0].idCha === item.lstKm[0].idCha);
          this.addSame(this.danhSachChiTietPhuLucTemp[index].id, item);
        }
      })
      level += 1;
      lstTemp = danhSachChiTietPhuLucTempTemp.filter(e => e.lstKm[0].level == level);
    }
  }


}
