import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTreeComponent } from 'ng-zorro-antd/tree';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { MESSAGE } from 'src/app/constants/message';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { DomSanitizer } from '@angular/platform-browser';
import { UserService } from 'src/app/services/user.service';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { Utils } from 'src/app/Utility/utils';
import { NzModalService } from 'ng-zorro-antd/modal';
import { TAB_SELECTED, PHULUCLIST, } from './bao-cao.constant';
import { DialogLuaChonThemPhuLucComponent } from 'src/app/components/dialog/dialog-lua-chon-them-phu-luc/dialog-lua-chon-them-phu-luc.component';
import * as fileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import * as uuid from "uuid";
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { OK, NOTOK } from 'src/app/Utility/utils';
export class ItemData {
  id!: any;
  maLoai!:number;
  lstCTietBCao!: any;
  trangThai!: string;
  
  checked!:boolean;
  tieuDe!: string;
  tenPhuLuc!: string;
}

export class ItemDanhSach {
  id!: any;
  maBcao!: String;
  namBcao!: Number;
  thangBcao!: Number;
  trangThai!:string;
  ngayTao!: string;
  nguoiTao!:string;
  maDviTien!:string;
  maDvi:number;
  congVan!:string;
  ngayTrinh!:string;
  ngayDuyet!:string;
  ngayPheDuyet!:string;
  ngayTraKq!:string;

  // dung cho request
  fileDinhKems!: any[];
  listIdDeletes!: string;
  listIdFiles!: string;
  maLoaiBcao!: string;
  maPhanBcao: string = "0";

  stt!: String;
  checked!:boolean;
  lstBCao: ItemData[] = [];
  lstFile: any[] = [];
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
  parent!: number;
  own!: number;
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
  parent: any;            // id cha no
  own!: any;              // id chhinh no
  next: linkList[];
  checked: boolean;
}

@Component({
  selector: 'bao-cao',
  templateUrl: './bao-cao.component.html',
  styleUrls: ['./bao-cao.component.scss']
})
export class BaoCaoComponent implements OnInit {

  baoCao: ItemDanhSach = new ItemDanhSach();
  totalElements = 0;
  totalPages = 0;
  errorMessage = "";
  url!: string;
  id!: any;                                   // id truyen tu router

  pages = {
    size: 10,
    page: 1,
  }
  donViTaos: any = [];
  loaiBaoCaos: any = [];                          // danh muc loai bao cao


  userInfo: any;
  noiDungs: any = [];                         // danh muc noi dung
  nhomChis:any = [];                          // danh muc nhom chi
  loaiChis:any = [];                          // danh muc loai chi
  donVis:any = [];                            // danh muc don vi
  donViTiens:any = [];                        // danh muc don vi tien
  lstFile: any = [];                          // list File de day vao api
  status: boolean = false;                    // trang thai an/ hien cua trang thai
  maDonViTao!: any;                           // ma don vi tao

  maDviTien: string = "01";                   // ma don vi tien
  newDate = new Date();                       //
  fileToUpload!: File;                        // file tai o input
  listFile: File[] = [];                      // list file chua ten va id de hien tai o input
  box1 = true;                                // bien de an hien box1
  fileUrl: any;                               // url
  listIdDelete: string = "";                  // list id delete

  maDans: any=[];
  ddiemXdungs: any=[];

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
  allCheckedTemp  = false;                    // check all checkbox temp
  indeterminateTemp = true;                   // properties allCheckBox temp
  editCache: { [key: string]: { edit: boolean; data: any } } = {};     // phuc vu nut chinh
  fileList: NzUploadFile[] = [];
  tabSelected: number;
  danhSachChiTietPhuLucTemp: any = [];
  nho!: boolean;                              // bien nho phuc vu sort
  tab = TAB_SELECTED;
  constructor(
    private routerActive: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private sanitizer: DomSanitizer,
    private danhMucService: DanhMucHDVService,
    private userService: UserService,
    private notification: NzNotificationService,
    private quanLyVonPhiService: QuanLyVonPhiService,
    private danhMuc: DanhMucHDVService,
    private router: Router,
    private datePipe: DatePipe,
    private notifi: NzNotificationService,
    private modal: NzModalService,

  ) {
  }

  async ngOnInit(){
    this.id = this.routerActive.snapshot.paramMap.get('id');
    let userName = this.userService.getUserName();
    let userInfo: any = await this.getUserInfo(userName); //get user info
    if (this.id) {
      await this.getDetailReport();
    } else {
      this.maDonViTao = userInfo?.dvql;
      this.spinner.show();
      this.quanLyVonPhiService.sinhMaBaoCao().subscribe(
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
      this.baoCao.namBcao = new Date().getFullYear();
      this.baoCao.thangBcao = new Date().getMonth();
      this.baoCao.ngayTao = new Date().toDateString();
      this.baoCao.trangThai = "1";
      PHULUCLIST.forEach(item => {
        this.baoCao.lstBCao.push({
          id: uuid.v4(),
          checked:false,
          tieuDe: item.tieuDe,
          maLoai:item.maPhuLuc,
          tenPhuLuc: item.tenPhuLuc,
          trangThai: '1',
          lstCTietBCao: []
        });
      })
    }
    const utils = new Utils();
    this.statusBtnDel = utils.getRoleDel(this.baoCao.trangThai, 2, userInfo?.roles[0]?.id);
    this.statusBtnSave = utils.getRoleSave(this.baoCao.trangThai, 2, userInfo?.roles[0]?.id);
    this.statusBtnApprove = utils.getRoleApprove(this.baoCao.trangThai, 2, userInfo?.roles[0]?.id);
    this.statusBtnTBP = utils.getRoleTBP(this.baoCao.trangThai, 2, userInfo?.roles[0]?.id);
    this.statusBtnLD = utils.getRoleLD(this.baoCao.trangThai, 2, userInfo?.roles[0]?.id);
    this.statusBtnGuiDVCT = utils.getRoleGuiDVCT(this.baoCao.trangThai, 2, userInfo?.roles[0]?.id);
    this.statusBtnDVCT = utils.getRoleDVCT(this.baoCao.trangThai, 2, userInfo?.roles[0]?.id);
    //get danh muc noi dung

    //lay danh sach loai bao cao
    this.danhMuc.dMLoaiBaoCaoThucHienDuToanChi().toPromise().then(
      data => {
        console.log(data);
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
          if(index !== -1){
            item.tieuDe = PHULUCLIST[index].tieuDe;
            item.tenPhuLuc = PHULUCLIST[index].tenPhuLuc;
          }
        })
        this.baoCao?.lstBCao?.forEach((item) => {
          if(item.maLoai == PHULUCLIST[0].maPhuLuc){
            this.lstCTietBCaoPL1 = item?.lstCTietBCao;
            item?.lstCTietBCao.filter(item1 =>{
              this.transformToLinkList(item1);
            })
          }
        });

        this.updateEditCache();
        this.updateEditCachePL1();
        this.lstFile = data.data.lstFile;

        // set list id file ban dau
        this.lstFile.filter(item => {
          this.listIdFiles += item.id + ",";
        })

        if (this.baoCao.trangThai == '1' || this.baoCao.trangThai == '3' || this.baoCao.trangThai == '5' || this.baoCao.trangThai == '8') {
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

transformToLinkList(item: ItemDataPL1) {
  var obj: linkList = {
  id: item.id,
  vt: item.own,
  stt: item.stt,
  maNdung: item.maNdung,
  kphiSdungTcong: item.kphiSdungTcong,
  kphiSdungDtoan: item.kphiSdungDtoan,
  kphiSdungNguonKhac: item.kphiSdungNguonKhac,
  kphiSdungNguonQuy: item.kphiSdungNguonQuy,
  kphiSdungNstt: item.kphiSdungNstt,
  kphiSdungCk: item.kphiSdungCk,
  kphiChuyenSangTcong: item.kphiChuyenSangTcong,
  kphiChuyenSangDtoan: item.kphiChuyenSangDtoan,
  kphiChuyenSangNguonKhac: item.kphiChuyenSangNguonKhac,
  kphiChuyenSangNguonQuy: item.kphiChuyenSangNguonQuy,
  kphiChuyenSangNstt: item.kphiChuyenSangNstt,
  kphiChuyenSangCk: item.kphiChuyenSangCk,
  dtoanGiaoTcong: item.dtoanGiaoTcong,
  dtoanGiaoDtoan: item.dtoanGiaoDtoan,
  dtoanGiaoNguonKhac: item.dtoanGiaoNguonKhac,
  dtoanGiaoNguonQuy: item.dtoanGiaoNguonQuy,
  dtoanGiaoNstt: item.dtoanGiaoNstt,
  dtoanGiaoCk: item.dtoanGiaoCk,
  giaiNganThangBcaoTcong: item.giaiNganThangBcaoTcong,
  giaiNganThangBcaoTcongTle: item.giaiNganThangBcaoTcongTle,
  giaiNganThangBcaoDtoan: item.giaiNganThangBcaoDtoan,
  giaiNganThangBcaoDtoanTle: item.giaiNganThangBcaoDtoanTle,
  giaiNganThangBcaoNguonKhac: item.giaiNganThangBcaoNguonKhac,
  giaiNganThangBcaoNguonKhacTle: item.giaiNganThangBcaoNguonKhacTle,
  giaiNganThangBcaoNguonQuy: item.giaiNganThangBcaoNguonQuy,
  giaiNganThangBcaoNguonQuyTle: item.giaiNganThangBcaoNguonQuyTle,
  giaiNganThangBcaoNstt: item.giaiNganThangBcaoNstt,
  giaiNganThangBcaoNsttTle: item.giaiNganThangBcaoNsttTle,
  giaiNganThangBcaoCk: item.giaiNganThangBcaoCk,
  giaiNganThangBcaoCkTle: item.giaiNganThangBcaoCkTle,
  luyKeGiaiNganTcong: item.luyKeGiaiNganTcong,
  luyKeGiaiNganTcongTle: item.luyKeGiaiNganTcongTle,
  luyKeGiaiNganDtoan: item.luyKeGiaiNganDtoan,
  luyKeGiaiNganDtoanTle: item.luyKeGiaiNganDtoanTle,
  luyKeGiaiNganNguonKhac: item.luyKeGiaiNganNguonKhac,
  luyKeGiaiNganNguonKhacTle: item.luyKeGiaiNganNguonKhacTle,
  luyKeGiaiNganNguonQuy: item.luyKeGiaiNganNguonQuy,
  luyKeGiaiNganNguonQuyTle: item.luyKeGiaiNganNguonQuyTle,
  luyKeGiaiNganNstt: item.luyKeGiaiNganNstt,
  luyKeGiaiNganNsttTle: item.luyKeGiaiNganNsttTle,
  luyKeGiaiNganCk: item.luyKeGiaiNganCk,
  luyKeGiaiNganCkTle: item.luyKeGiaiNganCkTle,
  // listCtiet: vatTu[] = [];
  parent: item.parent,
  own : item.own,
  next: [],
  checked: false,
  };
  this.nho = false;
  this.addToLinkList(this.chiTietBcaosPL1, obj);
  if (!this.nho) {
    this.chiTietBcaosPL1.next.forEach((item) => {
      if (item.parent == obj.own) {
        obj.next.push(item);
      }
    });
    obj.next = obj.next.sort((a, b) => (a.vt < b.vt ? -1 : 1));
    obj.next.forEach((item) => {
      let idx = this.chiTietBcaosPL1.next.findIndex((e) => e.vt == item.vt);
      this.chiTietBcaosPL1.next.splice(idx, 1);
    });
  }
}
// let sortedCompany = company.sort((a, b) => (a.name < b.name) ? -1 : 1);

addToLinkList(data: linkList, item: linkList) {
  if (item.parent == data.vt) {
    data.next.push(item);
    data.next = data.next.sort((a, b) => (a.vt < b.vt ? -1 : 1));
  }
  data.next.forEach((e) => {
    this.addToLinkList(e, item);
  });
  if (data.next.length == 0) return;
}


  //set url khi
  setUrl(lbaocao: any) {
    console.log(lbaocao)
    switch (lbaocao) {
      case 526:
        this.url = '/lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-dtqg-tai-chi-cuc-mau02/'
        break;
      case 527:
        this.url = '/lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-dtqg-tai-chi-cuc-mau03/'
        break;
      default:
        this.url = null;
        break;
    }
  }

  //doi so trang
  onPageIndexChange(page) {
    this.pages.page = page;
  }

  //doi so luong phan tu tren 1 trang
  onPageSizeChange(size) {
    this.pages.size = size;
  }
  onSubmit(mcn: String, lyDoTuChoi: string) {
    const requestGroupButtons = {
      id: this.id,
      maChucNang: mcn,
      lyDoTuChoi: lyDoTuChoi,
    };
    this.spinner.show();
    this.quanLyVonPhiService.approveBaoCao(requestGroupButtons).subscribe((data) => {
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
      // if (fileList) {
      //   let res = await this.chiTieuKeHoachNamService.importFile(fileList[0]);
      //   if (res.msg == MESSAGE.SUCCESS) {
      //     let temptData = res.data;
      //     if (temptData) {
      //       if (temptData.khluongthuc && temptData.khluongthuc.length > 0) {
      //         for (let i = 0; i < temptData.khluongthuc.length; i++) {
      //           this.checkDataExistLuongThuc(temptData.khluongthuc[i]);
      //         }
      //       }
      //       if (temptData.khMuoi && temptData.khMuoi.length > 0) {
      //         for (let i = 0; i < temptData.khMuoi.length; i++) {
      //           this.checkDataExistMuoi(temptData.khMuoi[i]);
      //         }
      //       }
      //       if (temptData.khVatTu && temptData.khVatTu.length > 0) {
      //         for (let i = 0; i < temptData.khVatTu.length; i++) {
      //           this.checkDataExistVatTu(temptData.khVatTu[i]);
      //         }
      //         this.thongTinChiTieuKeHoachNam.khVatTu = this.updateDataListVatTu(this.thongTinChiTieuKeHoachNam.khVatTu);
      //       }
      //     }
      //   }
      // }
      element.value = null;
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  // doi tab
  changeTab(maPhuLuc){
    this.tabSelected = maPhuLuc;
   this.danhSachChiTietPhuLucTemp = this.baoCao?.lstBCao.find(item => item.maLoai == maPhuLuc)?.lstCTietBCao;
  }

  changeModel(id){

  }
  changeModelPL1(id){

  }
  changeModelPL2(id){

  }
  changeModelPL3(id){

  }

  // xoa dong
  deleteById(id: any): void {
    this.danhSachChiTietPhuLucTemp = this.danhSachChiTietPhuLucTemp.filter(item => item.id != id)
    if (typeof id == "number") {
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
    if(this.tabSelected == TAB_SELECTED.phuLuc1){
      item = {
        id: uuid.v4(),
        checked:false,
      }
    }else if(this.tabSelected == TAB_SELECTED.phuLuc2){
      item = {
        id: uuid.v4(),
        checked:false,
      }
    }else if(this.tabSelected == TAB_SELECTED.phuLuc3){
      item = {
        id: uuid.v4(),
        checked:false,
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
      if(item.checked == true && typeof item.id == "number"){
        this.listIdDelete += item.id + ","
      }
    })
    // delete object have checked = true
    this.danhSachChiTietPhuLucTemp = this.danhSachChiTietPhuLucTemp.filter(item => item.checked != true )
    this.allCheckedTemp = false;
  }

  // luu temp vao bang chinh
  saveTemp(){
    this.baoCao?.lstBCao.forEach(item => {
      if(item.maLoai == this.tabSelected){
        item.lstCTietBCao = this.danhSachChiTietPhuLucTemp;
      }
    });
    this.tabSelected = null;
  }

  // xoa phu luc
  deletePhuLucList(){
    this.baoCao.lstBCao = this.baoCao?.lstBCao.filter(item => item.checked == false);
    if(this.baoCao?.lstBCao?.findIndex(item => item.maLoai == this.tabSelected) == -1){
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
          if(item.status){
            this.baoCao.lstBCao.push({
              id: uuid.v4(),
              checked:false,
              tieuDe: item.tieuDe,
              maLoai:item.maPhuLuc,
              tenPhuLuc: item.tenPhuLuc,
              trangThai: '1',
              lstCTietBCao: []
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

  xoa() {

  }

  // luu
  async luu() {
    let listFile: any = [];
    for (const iterator of this.listFile) {
      listFile.push(await this.uploadFile(iterator));
    }

    // replace nhung ban ghi dc them moi id thanh null
    this.baoCao?.lstBCao?.filter(item => {
      if (typeof item.id != "number") {
        item.id = null;
      }
      item?.lstCTietBCao.filter(data => {
        if (typeof data.id != "number") {
          data.id = null;
        } 
      })
    })

    // gui du lieu trinh duyet len server
    // let request = {
    //   id: this.id,
    //   fileDinhKems: listFile,
    //   listIdFiles: this.listIdFiles,                      // id file luc get chi tiet tra ra( de backend phuc vu xoa file)
    //   lstCTietBCao: this.lstCTietBCao,
    //   maBcao: this.maBaoCao,
    //   maDvi: this.maDonViTao,
    //   maDviTien: this.maDviTien,
    //   maLoaiBcao: this.maLoaiBaoCao,
    //   namHienHanh: this.namBaoCaoHienHanh,
    //   namBcao: this.namBaoCaoHienHanh,
    // };
    this.baoCao.maLoaiBcao = '526';
    this.baoCao.fileDinhKems = listFile;
    this.baoCao.listIdFiles = this.listIdFiles;
    this.baoCao.trangThai = "1";
    this.baoCao.maDvi = this.maDonViTao;
    this.lstCTietBCaoPL1.filter(item => {
      if (typeof item.id != "number") {
        item.id = null;
      } 
    })
    this.baoCao?.lstBCao.filter(item => {
      if(item.maLoai == PHULUCLIST[0].maPhuLuc){
        item.lstCTietBCao = this.lstCTietBCaoPL1;
      }
    })
    //call service them moi
    this.spinner.show();
    if (this.id == null) {
      this.quanLyVonPhiService.trinhDuyetBaoCaoThucHienDTCService(this.baoCao).subscribe(
        data => {
          if (data.statusCode == 0) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.SUCCESS);
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
      this.quanLyVonPhiService.updatelist(this.baoCao).subscribe(res => {
        if (res.statusCode == 0) {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.SUCCESS);
        } else {
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, res?.msg);
        }
      },err =>{
        this.spinner.hide();
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      })
    }
    this.baoCao?.lstBCao?.filter(item => {
      if (!item.id) {
        item.id = uuid.v4();
      }
      item?.lstCTietBCao.filter(item1 =>{
        if (!item1.id) {
          item1.id = uuid.v4();
        } 
      })
    });
    this.lstCTietBCaoPL1.filter(item => {
      if (!item.id) {
        item.id = uuid.v4();
      }
    })
    this.updateEditCache();
    this.updateEditCachePL1();
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
    parent: null,
    own: null,
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
      parent: null,
      own: null,
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
      parent: this.editCachePL1[id].data.parent,
      own: this.editCachePL1[id].data.own,
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
    this.duyet(this.chiTietBcaosPL1, '', 0, 0);
    this.updateEditCachePL1();
  }

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
        parent: parent,
        own: data.vt,
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
    data.maNdung= item.maNdung;

    data.kphiSdungTcong= item.kphiSdungTcong;
    data.kphiSdungDtoan= item.kphiSdungDtoan;
    data.kphiSdungNguonKhac= item.kphiSdungNguonKhac;
    data.kphiSdungNguonQuy= item.kphiSdungNguonQuy;
    data.kphiSdungNstt= item.kphiSdungNstt;
    data.kphiSdungCk= item.kphiSdungCk;

    data.kphiChuyenSangTcong= item.kphiChuyenSangTcong;
    data.kphiChuyenSangDtoan= item.kphiChuyenSangDtoan;
    data.kphiChuyenSangNguonKhac= item.kphiChuyenSangNguonKhac;
    data.kphiChuyenSangNguonQuy= item.kphiChuyenSangNguonQuy;
    data.kphiChuyenSangNstt= item.kphiChuyenSangNstt;
    data.kphiChuyenSangCk= item.kphiChuyenSangCk;

    data.dtoanGiaoTcong= item.dtoanGiaoTcong;
    data.dtoanGiaoDtoan= item.dtoanGiaoDtoan;
    data.dtoanGiaoNguonKhac= item.dtoanGiaoNguonKhac;
    data.dtoanGiaoNguonQuy= item.dtoanGiaoNguonQuy;
    data.dtoanGiaoNstt= item.dtoanGiaoNstt;
    data.dtoanGiaoCk= item.dtoanGiaoCk;

    data.giaiNganThangBcaoTcong= item.giaiNganThangBcaoTcong;
    data.giaiNganThangBcaoTcongTle= item.giaiNganThangBcaoTcongTle;
    data.giaiNganThangBcaoDtoan= item.giaiNganThangBcaoDtoan;
    data.giaiNganThangBcaoDtoanTle= item.giaiNganThangBcaoDtoanTle;
    data.giaiNganThangBcaoNguonKhac= item.giaiNganThangBcaoNguonKhac;
    data.giaiNganThangBcaoNguonKhacTle= item.giaiNganThangBcaoNguonKhacTle;
    data.giaiNganThangBcaoNguonQuy= item.giaiNganThangBcaoNguonQuy;
    data.giaiNganThangBcaoNguonQuyTle= item.giaiNganThangBcaoNguonQuyTle;
    data.giaiNganThangBcaoNstt= item.giaiNganThangBcaoNstt;
    data.giaiNganThangBcaoNsttTle= item.giaiNganThangBcaoNsttTle;
    data.giaiNganThangBcaoCk= item.giaiNganThangBcaoCk;
    data.giaiNganThangBcaoCkTle= item.giaiNganThangBcaoCkTle;

    data.luyKeGiaiNganTcong= item.luyKeGiaiNganTcong;
    data.luyKeGiaiNganTcongTle= item.luyKeGiaiNganTcongTle;
    data.luyKeGiaiNganDtoan= item.luyKeGiaiNganDtoan;
    data.luyKeGiaiNganDtoanTle= item.luyKeGiaiNganDtoanTle;
    data.luyKeGiaiNganNguonKhac= item.luyKeGiaiNganNguonKhac;
    data.luyKeGiaiNganNguonKhacTle= item.luyKeGiaiNganNguonKhacTle;
    data.luyKeGiaiNganNguonQuy= item.luyKeGiaiNganNguonQuy;
    data.luyKeGiaiNganNguonQuyTle= item.luyKeGiaiNganNguonQuyTle;
    data.luyKeGiaiNganNstt= item.luyKeGiaiNganNstt;
    data.luyKeGiaiNganNsttTle= item.luyKeGiaiNganNsttTle;
    data.luyKeGiaiNganCk= item.luyKeGiaiNganCk;
    data.luyKeGiaiNganCkTle= item.luyKeGiaiNganCkTle;
    data.parent = item.parent;
    data.own = item.own;
  }

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
      parent: this.editCachePL1[id].data.parent,
      own: this.editCachePL1[id].data.own,
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
  getStatusName(id){
    const utils = new Utils();
    return utils.getStatusName(id);
  }

  //show popup tu choi
  tuChoi(mcn:string) {
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
        this.onSubmit(mcn,text);
      }
    });
  }


  //show popup tu choi
  pheDuyetChiTiet(mcn:string) {
    if(mcn == OK){
      this.onSubmit(mcn,null);
    }else if(mcn == NOTOK){
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
          this.onSubmit(mcn,text);
        }
      });
    }
  }
}
