import { DatePipe, Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogChonThemBieuMauBaoCaoComponent } from 'src/app/components/dialog/dialog-chon-them-bieu-mau-bao-cao-kqth-von-phi-hang-DTQG/dialog-chon-them-bieu-mau-bao-cao-kqth-von-phi-hang-DTQG.component';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { BAO_CAO_DOT, BAO_CAO_NAM, divMoney, DON_VI_TIEN, MONEY_LIMIT, mulMoney, NOT_OK, OK, TRANG_THAI_PHU_LUC, Utils } from 'src/app/Utility/utils';
import * as uuid from 'uuid';
import { LISTCANBO } from '../../../quy-trinh-bao-cao-thuc-hien-du-toan-chi-nsnn/chuc-nang-chi-cuc/bao-cao/bao-cao.constant';
import { BAO_CAO_CHI_TIET_THUC_HIEN_PHI_NhAP_HANG_DTQG, BAO_CAO_CHI_TIET_THUC_HIEN_PHI_XUAT_HANG_CUU_TRO_VIEN_TRO, BAO_CAO_CHI_TIET_THUC_HIEN_PHI_XUAT_HANG_DTQG, BAO_CAO_NHAP_HANG_DTQG, BAO_CAO_XUAT_HANG_DTQG, KHAI_THAC_BAO_CAO_CHI_TIET_THUC_HIEN_PHI_BAO_QUAN_LAN_DAU_HANG_DTQG, KHOAN_MUC, LISTBIEUMAUDOT, LISTBIEUMAUNAM, SOLAMA, TAB_SELECTED } from './bao-cao.constant';
import * as fileSaver from 'file-saver';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { DialogCopyComponent } from 'src/app/components/dialog/dialog-copy/dialog-copy.component';

export class ItemDanhSach {
  id!: any;
  maBcao!: String;
  namBcao!: Number;
  dotBcao!: Number;
  thangBcao!: Number;
  trangThai!: string;
  ngayTao!: string;
  nguoiTao!: string;
  maDviTien!: string;
  maDvi: number;
  congVan!: ItemCongVan;
  ngayTrinh!: string;
  ngayDuyet!: string;
  ngayPheDuyet!: string;
  ngayTraKq!: string;
  // dung cho request
  fileDinhKems!: any[];
  listIdDeletes!: string;
  listIdDeleteFiles: string = '';
  maPhanBcao: string = "1";

  maLoaiBcao!: string;
  stt!: String;
  checked!: boolean;
  lstBcaos: ItemData[] = [];
  lstFile: any[] = [];
  lstBcaoDviTrucThuocs: any[] = [];
  tongHopTuIds!: [];
}

export class ItemCongVan {
  fileName: string;
  fileSize: number;
  fileUrl: number;
}
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

export class ItemDataMau02 {
  id: any;
  stt: any;
  index: any;
  maVtu: string;
  maDviTinh: string;
  soQd: string;
  khSoLuong: number;
  khGiaMuaTd: number;
  khTtien: number;
  thSoLuong: any;
  thGiaMuaTd: any;
  thTtien: any;
  ghiChu: any;
  maVtuHeader: any;
  loai: any;
  checked!: boolean;
}

export class ItemDataMau03 {
  id: any;
  stt: any;
  maVtu: number;
  maDviTinh: number;
  soLuongKhoach: string;
  soLuongTte: number;
  dgGiaKhoach: number;
  dgGiaBanTthieu: number;
  dgGiaBanTte: any;
  ttGiaHtoan: any;
  ttGiaBanTte: any;
  ttClechGiaTteVaGiaHtoan: number;
  ghiChu: any;
  maVtuHeader: any;
  loai: any;
  checked!: boolean;
}


export class ItemDataMau04a1 {
  id: any;
  stt: string;
  listKhoanMuc: any[];
  maNdungChi: string;
  maNdungChiParent: string;
  trongDotTcong: number;
  trongDotThoc: number;
  trongDotGao: number;
  luyKeTcong: number;
  luyKeThoc: number;
  luyKeGao: number;
  listCtiet: vatTu[] = [];
  parentId: any;
  ghiChu: string;
  checked: boolean;
  status: boolean;
  maLoai: number;
}

export class vatTu {
  id: number;
  maVtu: any;
  loaiMatHang: any;
  colName: any;
  sl: any;
  col: number;
}
@Component({
  selector: 'app-bao-cao',
  templateUrl: './bao-cao.component.html',
  styleUrls: ['./bao-cao.component.scss']
})
export class BaoCaoComponent implements OnInit {
  @Input() idDialog: any;

  constructor(
    private userService: UserService,
    private notification: NzNotificationService,
    private route: Router,
    private router: ActivatedRoute,
    private danhMucService: DanhMucHDVService,
    private quanLyVonPhiService: QuanLyVonPhiService,
    private datePipe: DatePipe,
    private modal: NzModalService,
    private spinner: NgxSpinnerService,
    private location: Location,
  ) { }

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
  statusBtnClose: boolean = false;                        // trang thai ok/ not ok
  statusBtnFinish: boolean = true;                    // trang thai hoan tat nhap lieu

  lstFiles: any = [];                          // list File de day vao api

  maDviTien: string = "1";                    // ma don vi tien
  thuyetMinh: string;                         // thuyet minh
  listIdDelete: any = [];                  // list id delete
  trangThaiChiTiet!: any;
  listIdFilesDelete: any = [];                        // id file luc call chi tiet
  donViTiens: any = DON_VI_TIEN;                        // danh muc don vi tien



  donVis: any[] = [];
  userInfor: any;
  maDonViTao: any;
  donvitien: string;
  listFile: File[] = [];
  lstFile: any[] = [];
  trangThaiBanGhi: any;
  totalElements = 0;
  totalPages = 0;
  pages = {
    size: 10,
    page: 1,
  }
  status: boolean = false;
  fileList: NzUploadFile[] = [];
  fileDetail: NzUploadFile;
  lstDeleteCTietBCao: any = [];

  //nhóm biến router
  id: any; // id của bản ghi

  //----
  listVattu: any[] = [];
  baoCao: ItemDanhSach = new ItemDanhSach();
  currentday = new Date();
  maPhanBcao: string = '1'; //phân biệt phần giữa 3.2.9 và 3.2.8 
  maLoaiBaocao: any;
  listDonvitinh: any[] = [];

  //nhóm biến biểu mẫu
  allChecked: any;
  indeterminate: boolean;
  tabSelected: string;
  tab = TAB_SELECTED;


  //nhóm biến biểu mẫu 02------------------
  allChecked02: any;
  indeterminate02: boolean;
  lstCtietBcao021: ItemDataMau02[] = [];
  lstCtietBcao022: ItemDataMau02[] = [];
  lstIdDeleteMau02: string = '';


  //nhóm biến biểu mẫu 03----------
  allChecked03: any;
  indeterminate03: boolean;
  lstCtietBcao031: ItemDataMau03[] = [];
  lstCtietBcao032: ItemDataMau03[] = [];
  lstCtietBcao033: ItemDataMau03[] = [];

  lstIdDeleteMau03: string = '';

  //nhóm biến biểu mẫu 04 --> 05
  vt: number;
  stt: number;
  kt: boolean;
  disable: boolean = false;
  soLaMa: any[] = SOLAMA;
  lstCTietBaoCaoTemp: any[] = [];
  lstCtietBcao04ax: ItemDataMau04a1[] = [];
  lstCtietBcao04an: ItemDataMau04a1[] = [];
  lstCtietBcao04bx: ItemDataMau04a1[] = [];
  lstCtietBcao05: ItemDataMau04a1[] = [];
  initItem: ItemDataMau04a1 = {
    id: null,
    stt: '0',
    listKhoanMuc: [],
    maNdungChi: '',
    maNdungChiParent: '',
    trongDotTcong: 0,
    trongDotThoc: 0,
    trongDotGao: 0,
    luyKeTcong: 0,
    luyKeThoc: 0,
    luyKeGao: 0,
    listCtiet: [],
    parentId: '',
    ghiChu: '',
    checked: false,
    status: false,
    maLoai: 0,
  }
  editCache: { [key: string]: { edit: boolean; data: any } } = {};
  cols4ax: number = 0;
  cols4an: number = 0;
  cols4bx: number = 0;
  cols05: number = 0;
  allChecked1: any;
  listColTrongDot4ax: any[] = [];
  listColTrongDot4an: any[] = [];
  listColTrongDot4bx: any[] = [];
  listColTrongDot05: any[] = [];
  idVatTu: any;
  listColTemp: any[] = [];
  cols: number = 0;
  lstIdDeleteCols: string = '';
  listKhoanMuc: any[] = KHOAN_MUC;
  lstIdDeleteMau04ax: string = '';
  lstIdDeleteMau04an: string = '';
  lstIdDeleteMau04bx: string = '';
  lstIdDeleteMau05: string = '';
  nguoiBcaos: any[] = LISTCANBO;

  async ngOnInit() {
    this.cols = 3;
    this.id = this.router.snapshot.paramMap.get('id');
    let lbc = this.router.snapshot.paramMap.get('baoCao');
    let userName = this.userService.getUserName();
    await this.getUserInfo(userName); //get user info
    if (this.idDialog) {
      this.id = this.idDialog;
      this.statusBtnClose = true;
      this.statusBtnSave = true;
    }

    if (this.id != null) {
      // gọi xem chi tiết
      await this.getDetailReport();
    } else if (lbc == 'tong-hop') {
      await this.callSynthetic();
      this.maDonViTao = this.userInfor?.dvql;
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
      this.baoCao.nguoiTao = userName;
      this.baoCao.ngayTao = new Date().toDateString();
      this.baoCao.trangThai = "1";

    } else {

      this.maDonViTao = this.userInfor?.dvql;
      //tạo mã báo cáo
      this.spinner.show();
      this.quanLyVonPhiService.taoMaBaoCao().toPromise().then(
        (res) => {
          if (res.statusCode == 0) {
            this.baoCao.maBcao = res.data;
            // this.notification.success(MESSAGE.SUCCESS, res?.msg);
          } else {
            this.notification.error(MESSAGE.ERROR, res?.msg);
          }
        },
        (err) => {
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        },
      );
      this.baoCao.namBcao = this.currentday.getFullYear();
      this.baoCao.ngayTao = this.datePipe.transform(this.currentday, Utils.FORMAT_DATE_STR);
      this.baoCao.trangThai = '1';
      this.baoCao.maLoaiBcao = this.router.snapshot.paramMap.get('loaiBaoCao');
      this.baoCao.namBcao = Number(this.router.snapshot.paramMap.get('nam'));
      this.baoCao.dotBcao = Number(this.router.snapshot.paramMap.get('dot')) == 0 ? null : Number(this.router.snapshot.paramMap.get('dot'));
      this.baoCao.nguoiTao = userName;

      if (this.baoCao.maLoaiBcao == BAO_CAO_DOT) {
        this.maLoaiBaocao = BAO_CAO_DOT;
        LISTBIEUMAUDOT.forEach(e => {
          this.baoCao.lstBcaos.push(
            {
              id: uuid.v4() + 'FE',
              checked: false,
              tieuDe: e.tieuDe + this.baoCao.dotBcao,
              maLoai: e.maPhuLuc,
              tenPhuLuc: e.tenPhuLuc,
              trangThai: '3',
              lstCtietBcaos: [],
              maDviTien: '1',
              thuyetMinh: null,
              lyDoTuChoi: null,
              lstIdDeletes: [],
              nguoiBcao: null,
              qlnvKhvonphiBcaoId: this.id,
            }
          )
        })
      } else {
        this.maLoaiBaocao = BAO_CAO_NAM;
        LISTBIEUMAUNAM.forEach(e => {
          this.baoCao.lstBcaos.push(
            {
              id: uuid.v4() + 'FE',
              checked: false,
              tieuDe: e.tieuDe + this.baoCao.namBcao,
              maLoai: e.maPhuLuc,
              tenPhuLuc: e.tenPhuLuc,
              trangThai: '3',
              lstCtietBcaos: [],
              maDviTien: '1',
              thuyetMinh: null,
              lyDoTuChoi: null,
              lstIdDeletes: [],
              nguoiBcao: null,
              qlnvKhvonphiBcaoId: this.id,
            }
          )
        })
      }
    }
    //lấy danh sách vật tư
    this.danhMucService.dMVatTu().subscribe(res => {
      if (res.statusCode == 0) {
        this.listVattu = res.data?.content;
      } else {
        this.notification.error(MESSAGE.ERROR, res?.msg);
      }
    }, err => {
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    })
    //danh sách đơn vị tính (đơn vị đo lường )
    this.quanLyVonPhiService.dmDonvitinh().toPromise().then(
      (data) => {
        if (data.statusCode == 0) {
          this.listDonvitinh = data.data?.content;

        } else {
          this.notification.error(MESSAGE.ERROR, data?.msg);
        }
      },
      (err) => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      },
    );

    //lay danh sach cac đơn vị quản lý (chi cục, cục khu vực,...)
    await this.quanLyVonPhiService.dMDonVi().toPromise().then(res => {
      if (res.statusCode == 0) {
        this.donVis = res.data;
      } else {
        this.notification.error(MESSAGE.ERROR, res?.msg);
      }
    },
      (err) => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      })
    this.getStatusButton();
    this.spinner.hide();
  }

  //nhóm các nút chức năng --báo cáo-----
  getStatusButton() {
    let checkParent = false;
    let checkChirld = false;
    let dVi = this.donVis.find(e => e.maDvi == this.maDonViTao);
    if (dVi && dVi.maDvi == this.userInfor.dvql) {
      checkChirld = true;
    }
    if (dVi && dVi.parent?.maDvi == this.userInfor.dvql) {
      checkParent = true;
    }
    const utils = new Utils();
    this.statusBtnDel = utils.getRoleDel(this.baoCao?.trangThai, checkChirld, this.userInfor?.roles[0]?.code);
    this.statusBtnSave = utils.getRoleSave(this.baoCao?.trangThai, checkChirld, this.userInfor?.roles[0]?.code);
    this.statusBtnApprove = utils.getRoleApprove(this.baoCao?.trangThai, checkChirld, this.userInfor?.roles[0]?.code);
    this.statusBtnTBP = utils.getRoleTBP(this.baoCao?.trangThai, checkChirld, this.userInfor?.roles[0]?.code);
    this.statusBtnLD = utils.getRoleLD(this.baoCao?.trangThai, checkChirld, this.userInfor?.roles[0]?.code);
    this.statusBtnGuiDVCT = utils.getRoleGuiDVCT(this.baoCao?.trangThai, checkChirld, this.userInfor?.roles[0]?.code);
    this.statusBtnDVCT = utils.getRoleDVCT(this.baoCao?.trangThai, checkParent, this.userInfor?.roles[0]?.code);
    this.statusBtnCopy = utils.getRoleCopy(this.baoCao?.trangThai, checkChirld, this.userInfor?.roles[0]?.code);
    this.statusBtnPrint = utils.getRolePrint(this.baoCao?.trangThai, checkChirld, this.userInfor?.roles[0]?.code);
  }

  // lay ten don vi tao
  getUnitName(dvitao: any) {
    return this.donVis.find(item => item.maDvi == dvitao)?.tenDvi;
  }

  //call service xem chi tiết
  async getDetailReport() {
    this.spinner.show();
    await this.quanLyVonPhiService.baoCaoChiTiet(this.id).toPromise().then(data => {
      if (data.statusCode == 0) {
        this.baoCao = data.data;
        this.baoCao?.lstBcaos?.forEach(item => {
          if (this.baoCao.maLoaiBcao == BAO_CAO_DOT) {
            let index = LISTBIEUMAUDOT.findIndex(data => data.maPhuLuc == item.maLoai);
            if (index !== -1) {
              item.checked = false;
              item.tieuDe = LISTBIEUMAUDOT[index].tieuDe + this.baoCao.dotBcao;
              item.tenPhuLuc = LISTBIEUMAUDOT[index].tenPhuLuc;
            }
          } else {
            let index = LISTBIEUMAUNAM.findIndex(data => data.maPhuLuc == item.maLoai);
            if (index !== -1) {
              item.checked = false;
              item.tieuDe = LISTBIEUMAUNAM[index].tieuDe + this.baoCao.namBcao;
              item.tenPhuLuc = LISTBIEUMAUNAM[index].tenPhuLuc;
            }
          }
          switch (item.maLoai) {
            // bm 02
            case BAO_CAO_NHAP_HANG_DTQG:
              data.khTtien = divMoney(data.khTtien, item.maDviTien);
              data.khGiaMuaTd = divMoney(data.khGiaMuaTd, item.maDviTien);
              data.thTtien = divMoney(data.thTtien, item.maDviTien);
              data.thGiaMuaTd = divMoney(data.thGiaMuaTd, item.maDviTien);
              break;
            // bm 03

            case BAO_CAO_XUAT_HANG_DTQG:
              data.dgGiaKhoach = divMoney(data.dgGiaKhoach, item.maDviTien);
              data.dgGiaBanTthieu = divMoney(data.dgGiaBanTthieu, item.maDviTien);
              data.dgGiaBanTte = divMoney(data.dgGiaBanTte, item.maDviTien);
              data.ttGiaHtoan = divMoney(data.ttGiaHtoan, item.maDviTien);
              data.ttGiaBanTte = divMoney(data.ttGiaBanTte, item.maDviTien);
              data.ttClechGiaTteVaGiaHtoan = divMoney(data.ttClechGiaTteVaGiaHtoan, item.maDviTien);
              break;

            // 04a/BCPN-X_x
            case BAO_CAO_CHI_TIET_THUC_HIEN_PHI_XUAT_HANG_DTQG:
              // nhan tien va validate
              break;

            // 04a/BCPN-X_n
            case BAO_CAO_CHI_TIET_THUC_HIEN_PHI_NhAP_HANG_DTQG:
              // nhan tien va validate
              break;

            // 04b/BCPN-X
            case BAO_CAO_CHI_TIET_THUC_HIEN_PHI_XUAT_HANG_CUU_TRO_VIEN_TRO:
              // nhan tien va validate
              break;

            // 05/BCPBQ
            case KHAI_THAC_BAO_CAO_CHI_TIET_THUC_HIEN_PHI_BAO_QUAN_LAN_DAU_HANG_DTQG:
              // nhan tien va validate
              break;
            default:
              break;
          }
        })

        this.lstFiles = data.data.lstFiles;
        this.listFile = [];
        this.maDonViTao = data.data.maDvi;
        this.baoCao.ngayDuyet = this.datePipe.transform(data.data.ngayDuyet, Utils.FORMAT_DATE_STR);
        this.baoCao.ngayPheDuyet = this.datePipe.transform(data.data.ngayPheDuyet, Utils.FORMAT_DATE_STR);
        this.baoCao.ngayTraKq = this.datePipe.transform(data.data.ngayTraKq, Utils.FORMAT_DATE_STR);
        this.baoCao.ngayTrinh = this.datePipe.transform(data.data.ngayTrinh, Utils.FORMAT_DATE_STR);
        this.baoCao.ngayTao = this.datePipe.transform(data.data.ngayTao, Utils.FORMAT_DATE_STR);

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
    }, (err) => {
      this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
    })
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

  //lay thong tin nguoi dang nhap
  async getUserInfo(username: string) {
    let userInfo = await this.userService.getUserInfo(username).toPromise().then(
      (data) => {
        if (data?.statusCode == 0) {
          this.userInfor = data?.data
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

  resetList() {
    this.lstCtietBcao021 = [];
    this.lstCtietBcao022 = [];
    this.lstCtietBcao031 = [];
    this.lstCtietBcao032 = [];
    this.lstCtietBcao033 = [];
    this.listColTrongDot4ax = [];
    this.listColTrongDot4an = [];
    this.listColTrongDot4bx = [];
    this.listColTrongDot05 = [];
    this.updateEditCache02();
    this.updateAllChecked03();
    this.updateEditCache();
  }

  //nhóm chức năng phụ vụ cho table biểu mẫu (phụ lục) ------------------------------------------
  updateAllDanhSachMauBcao(): void {
    this.indeterminate = false;                               // thuoc tinh su kien o checkbox all
    if (this.allChecked) {                                    // checkboxall == true thi set lai lstCtietBcaos.checked = true
      this.baoCao.lstBcaos = this.baoCao?.lstBcaos.map(item => ({
        ...item,
        checked: true
      }));
    } else {
      this.baoCao.lstBcaos = this.baoCao?.lstBcaos.map(item => ({    // checkboxall == false thi set lai lstCtietBcaos.checked = false
        ...item,
        checked: false
      }));
    }
  }
  getStatusNameBieuMau(Status: any) {
    return TRANG_THAI_PHU_LUC.find(item => item.id == Status)?.ten;
  }

  changeTab(maPhuLuc, trangThaiChiTiet) {
    let checkSaveEdit;
    if (!this.maDviTien) {
      this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
      return;
    }

    //check xem tat ca cac dong du lieu da luu chua?
    //chua luu thi bao loi, luu roi thi cho di
    this.lstCTietBaoCaoTemp.filter(element => {
      if (this.editCache[element.id].edit === true) {
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
        item.lstCtietBcaos = Object.assign([], this.lstCTietBaoCaoTemp),
          item.maDviTien = this.maDviTien, item.thuyetMinh = this.thuyetMinh, item.lstIdDeletes = this.listIdDelete
      }
    });
    this.tabSelected = maPhuLuc;
    // set listBCaoTemp theo ma phu luc vua chon
    let lstBcaosTemp = this.baoCao?.lstBcaos.find(item => item.maLoai == maPhuLuc);
    this.lstCTietBaoCaoTemp = lstBcaosTemp?.lstCtietBcaos || [];
    this.maDviTien = lstBcaosTemp?.maDviTien;
    this.thuyetMinh = lstBcaosTemp?.thuyetMinh;
    this.listIdDelete = []
    this.trangThaiChiTiet = trangThaiChiTiet;
    ////////////////////////////////////////
    this.resetList();
    // tinh toan tien va tach bao cao ra cac bao cao nho
    switch (maPhuLuc) {
      // bm 02
      case BAO_CAO_NHAP_HANG_DTQG:
        this.lstCTietBaoCaoTemp?.filter(data => {


          if (data.maVtuHeader == '1') {
            this.lstCtietBcao021.push(data);
          } else {
            this.lstCtietBcao022.push(data);
          }
        });
        break;
      // bm 03

      case BAO_CAO_XUAT_HANG_DTQG:
        this.lstCTietBaoCaoTemp?.filter(data => {


          if (data.maVtuHeader == '1') {
            this.lstCtietBcao031.push(data);
          } else if (data.maVtuHeader == '2') {
            this.lstCtietBcao032.push(data);
          } else {
            this.lstCtietBcao033.push(data);
          }
        });
        break;

      // 04a/BCPN-X_x
      case BAO_CAO_CHI_TIET_THUC_HIEN_PHI_XUAT_HANG_DTQG:
        this.lstCTietBaoCaoTemp?.filter(data => {


        });
        if (this.lstCTietBaoCaoTemp.length != 0) {
          let e = this.lstCTietBaoCaoTemp[0];
          e.listCtiet.forEach((el) => {
            if (el.loaiMatHang == 0) {
              this.listVattu.forEach((vt) => {
                if (vt.id == el.maVtu) {
                  let objTrongdot = {
                    id: el.id,
                    maVtu: vt.id,
                    loaiMatHang: el.loaiMatHang,
                    colName: vt.tenDm,
                    sl: el.sl,
                    col: el.col,
                  };
                  this.listColTrongDot4ax.push(objTrongdot);
                }
              });
            }
          });
          this.cols4ax = this.cols4ax + this.listColTrongDot4ax.length;
        }
        this.listColTemp = this.listColTrongDot4ax;
        this.cols = this.cols + this.listColTrongDot4ax.length;
        break;

      // 04a/BCPN-X_n
      case BAO_CAO_CHI_TIET_THUC_HIEN_PHI_NhAP_HANG_DTQG:
        this.lstCTietBaoCaoTemp?.filter(data => {


        });
        if (this.lstCTietBaoCaoTemp.length != 0) {
          let e1 = this.lstCTietBaoCaoTemp[0];
          e1.listCtiet.forEach((el) => {
            if (el.loaiMatHang == 0) {
              this.listVattu.forEach((vt) => {
                if (vt.id == el.maVtu) {
                  let objTrongdot = {
                    id: el.id,
                    maVtu: vt.id,
                    loaiMatHang: el.loaiMatHang,
                    colName: vt.tenDm,
                    sl: el.sl,
                    col: el.col,
                  };
                  this.listColTrongDot4an.push(objTrongdot);
                }
              });
            }
          });
          this.cols4an = this.cols4an + this.listColTrongDot4an.length;
        }
        this.listColTemp = this.listColTrongDot4an;
        this.cols = this.cols + this.listColTrongDot4an.length;
        break;

      // 04b/BCPN-X
      case BAO_CAO_CHI_TIET_THUC_HIEN_PHI_XUAT_HANG_CUU_TRO_VIEN_TRO:
        this.lstCTietBaoCaoTemp?.filter(data => {


        });
        if (this.lstCTietBaoCaoTemp.length != 0) {
          let e2 = this.lstCTietBaoCaoTemp[0];
          e2.listCtiet.forEach((el) => {
            if (el.loaiMatHang == 0) {
              this.listVattu.forEach((vt) => {
                if (vt.id == el.maVtu) {
                  let objTrongdot = {
                    id: el.id,
                    maVtu: vt.id,
                    loaiMatHang: el.loaiMatHang,
                    colName: vt.tenDm,
                    sl: el.sl,
                    col: el.col,
                  };
                  this.listColTrongDot4bx.push(objTrongdot);
                }
              });
            }
          });
          this.cols4bx = this.cols4bx + this.listColTrongDot4bx.length;
        }
        this.listColTemp = this.listColTrongDot4bx;
        this.cols = this.cols + this.listColTrongDot4bx.length;
        break;

      // 05/BCPBQ
      case KHAI_THAC_BAO_CAO_CHI_TIET_THUC_HIEN_PHI_BAO_QUAN_LAN_DAU_HANG_DTQG:
        this.lstCTietBaoCaoTemp?.filter(data => {


        });
        if (this.lstCTietBaoCaoTemp.length != 0) {
          let e3 = this.lstCTietBaoCaoTemp[0];
          e3.listCtiet.forEach((el) => {
            if (el.loaiMatHang == 0) {
              this.listVattu.forEach((vt) => {
                if (vt.id == el.maVtu) {
                  let objTrongdot = {
                    id: el.id,
                    maVtu: vt.id,
                    loaiMatHang: el.loaiMatHang,
                    colName: vt.tenDm,
                    sl: el.sl,
                    col: el.col,
                  };
                  this.listColTrongDot05.push(objTrongdot);
                }
              });
            }
          });
          this.cols05 = this.cols05 + this.listColTrongDot05.length;
        }
        this.listColTemp = this.listColTrongDot05;
        this.cols = this.cols + this.listColTrongDot05.length;
        break;
      default:
        break;
    }

    if (maPhuLuc == BAO_CAO_CHI_TIET_THUC_HIEN_PHI_XUAT_HANG_DTQG ||
      maPhuLuc == BAO_CAO_CHI_TIET_THUC_HIEN_PHI_NhAP_HANG_DTQG ||
      maPhuLuc == BAO_CAO_CHI_TIET_THUC_HIEN_PHI_XUAT_HANG_CUU_TRO_VIEN_TRO ||
      maPhuLuc == KHAI_THAC_BAO_CAO_CHI_TIET_THUC_HIEN_PHI_BAO_QUAN_LAN_DAU_HANG_DTQG) {
      this.sortByIndex();
    }
    this.updateEditCache02();
    this.updateEditCache03();
    this.updateEditCache();
    this.getStatusButtonOk();
  }

  getStatusButtonOk() {
    const utils = new Utils();
    let checkParent = false;
    let checkChirld = false;
    let dVi = this.donVis.find(e => e.maDvi == this.maDonViTao);
    if (dVi && dVi.maDvi == this.userInfor.dvql) {
      checkChirld = true;
    }
    if (dVi && dVi.parent?.maDvi == this.userInfor.dvql) {
      checkParent = true;
    }

    let roleNguoiTao = this.userInfor?.roles[0]?.code;
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

  updateSingleChecked() {
    if (this.baoCao?.lstBcaos.every((item) => !item.checked)) {
      this.allChecked = false;
      this.indeterminate = false;
    } else if (this.baoCao?.lstBcaos.every((item) => item.checked)) {
      this.allChecked = true;
      this.indeterminate = false;
    } else {
      this.indeterminate = true;
    }
  }

  addPhuLuc() {
    var danhSach: any;
    if (this.baoCao.maLoaiBcao == BAO_CAO_DOT) {
      LISTBIEUMAUDOT.forEach(item => item.status = false);
      danhSach = LISTBIEUMAUDOT.filter(item => this.baoCao?.lstBcaos?.findIndex(data => data.maLoai == item.maPhuLuc) == -1);
    } else {
      LISTBIEUMAUNAM.forEach(item => item.status = false);
      danhSach = LISTBIEUMAUNAM.filter(item => this.baoCao?.lstBcaos?.findIndex(data => data.maLoai == item.maPhuLuc) == -1);
    }

    const modalIn = this.modal.create({
      nzTitle: 'Danh sách mẫu báo cáo',
      nzContent: DialogChonThemBieuMauBaoCaoComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '600px',
      nzFooter: null,
      nzComponentParams: {
        ChonThemBieuMauBaoCao: danhSach
      },
    });
    modalIn.afterClose.subscribe((res) => {
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


  deletePhuLucList() {
    this.baoCao.lstBcaos = this.baoCao?.lstBcaos.filter(item => item.checked == false);
    if (this.baoCao?.lstBcaos?.findIndex(item => item.maLoai == this.tabSelected) == -1) {
      this.tabSelected = null;
    }
    this.allChecked = false;
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

    if (this.tabSelected == BAO_CAO_NHAP_HANG_DTQG) {
      await this.saveMau02();
    } else if (this.tabSelected == BAO_CAO_XUAT_HANG_DTQG) {
      await this.saveMau03();
    }
    let baoCaoChiTiet = this.baoCao?.lstBcaos.find(item => item.maLoai == this.tabSelected);
    let baoCaoChiTietTemp = JSON.parse(JSON.stringify(baoCaoChiTiet));

    baoCaoChiTietTemp.lstCtietBcaos = JSON.parse(JSON.stringify(this.lstCTietBaoCaoTemp));
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
    let checkSaveEdit;
    switch (this.tabSelected) {
      // bm 02
      case BAO_CAO_NHAP_HANG_DTQG:
        baoCaoChiTietTemp?.lstCtietBcaos.filter(data => {
          if (this.editCache[data.id].edit == true) {
            checkSaveEdit = false;
            return;
          }
          if (data.id?.length == 38) {
            data.id = null;
          }
          // nhan tien va validate
          data.khTtien = mulMoney(data.khTtien, baoCaoChiTietTemp.maDviTien);
          data.khGiaMuaTd = mulMoney(data.khGiaMuaTd, baoCaoChiTietTemp.maDviTien);
          data.thTtien = mulMoney(data.thTtien, baoCaoChiTietTemp.maDviTien);
          data.thGiaMuaTd = mulMoney(data.thGiaMuaTd, baoCaoChiTietTemp.maDviTien);
          if (data.khTtien > MONEY_LIMIT || data.khGiaMuaTd > MONEY_LIMIT || data.thTtien > MONEY_LIMIT || data.thGiaMuaTd > MONEY_LIMIT) {
            checkMoneyRange = false;
            return;
          }
        })
        break;

      // bm 03
      case BAO_CAO_XUAT_HANG_DTQG:
        baoCaoChiTietTemp?.lstCtietBcaos.filter(data => {
          if (this.editCache[data.id].edit == true) {
            checkSaveEdit = false;
            return;
          }
          if (data.id?.length == 38) {
            data.id = null;
          }
          // nhan tien va validate
          data.dgGiaKhoach = mulMoney(data.dgGiaKhoach, baoCaoChiTietTemp.maDviTien);
          data.dgGiaBanTthieu = mulMoney(data.dgGiaBanTthieu, baoCaoChiTietTemp.maDviTien);
          data.dgGiaBanTte = mulMoney(data.dgGiaBanTte, baoCaoChiTietTemp.maDviTien);
          data.ttGiaHtoan = mulMoney(data.ttGiaHtoan, baoCaoChiTietTemp.maDviTien);
          data.ttGiaBanTte = mulMoney(data.ttGiaBanTte, baoCaoChiTietTemp.maDviTien);
          data.ttClechGiaTteVaGiaHtoan = mulMoney(data.ttClechGiaTteVaGiaHtoan, baoCaoChiTietTemp.maDviTien);
          if (data.dgGiaKhoach > MONEY_LIMIT || data.dgGiaBanTthieu > MONEY_LIMIT || data.dgGiaBanTte > MONEY_LIMIT
            || data.ttGiaHtoan > MONEY_LIMIT || data.ttGiaBanTte > MONEY_LIMIT || data.thGittClechGiaTteVaGiaHtoanaMuaTd > MONEY_LIMIT) {
            checkMoneyRange = false;
            return;
          }
        })
        break;

      // 04a/BCPN-X_x
      case BAO_CAO_CHI_TIET_THUC_HIEN_PHI_XUAT_HANG_DTQG:
        baoCaoChiTietTemp?.lstCtietBcaos.filter(data => {
          if (this.editCache[data.id].edit == true) {
            checkSaveEdit = false;
            return;
          }
          if (data.id?.length == 38) {
            data.id = null;
          }
          //nhan chia tinh toan cho nay
          //...
        })
        break;

      // 04a/BCPN-X_n
      case BAO_CAO_CHI_TIET_THUC_HIEN_PHI_NhAP_HANG_DTQG:
        baoCaoChiTietTemp?.lstCtietBcaos.filter(data => {
          if (this.editCache[data.id].edit == true) {
            checkSaveEdit = false;
            return;
          }
          if (data.id?.length == 38) {
            data.id = null;
          }
          //nhan chia tinh toan cho nay
          //...
        })
        break;

      // 04b/BCPN-X
      case BAO_CAO_CHI_TIET_THUC_HIEN_PHI_XUAT_HANG_CUU_TRO_VIEN_TRO:
        baoCaoChiTietTemp?.lstCtietBcaos.filter(data => {
          if (this.editCache[data.id].edit == true) {
            checkSaveEdit = false;
            return;
          }
          if (data.id?.length == 38) {
            data.id = null;
          }
          //nhan chia tinh toan cho nay
          //...
        })
        break;

      // 05/BCPBQ
      case KHAI_THAC_BAO_CAO_CHI_TIET_THUC_HIEN_PHI_BAO_QUAN_LAN_DAU_HANG_DTQG:
        baoCaoChiTietTemp?.lstCtietBcaos.filter(data => {
          if (this.editCache[data.id].edit == true) {
            checkSaveEdit = false;
            return;
          }
          if (data.id?.length == 38) {
            data.id = null;
          }
          //nhan chia tinh toan cho nay
          //...
        })
        break;
      default:
        break;
    }

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

  async save() {
    this.baoCao?.lstBcaos.find(item => { if (item.maLoai == this.tabSelected) { item.lstCtietBcaos = Object.assign([], this.lstCTietBaoCaoTemp), item.maDviTien = this.maDviTien, item.thuyetMinh = this.thuyetMinh, item.lstIdDeletes = this.listIdDelete } });
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
    /////////////////////////////
    baoCaoTemp.lstBcaos.forEach((item) => {
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
      item.lstCtietBcaos.forEach(data => {
        if (data?.id.length == 38) {
          data.id = null;
        }
        if (data.maLoai == BAO_CAO_CHI_TIET_THUC_HIEN_PHI_XUAT_HANG_DTQG || data.maLoai == BAO_CAO_CHI_TIET_THUC_HIEN_PHI_NhAP_HANG_DTQG ||
          data.maLoai == BAO_CAO_CHI_TIET_THUC_HIEN_PHI_XUAT_HANG_CUU_TRO_VIEN_TRO || data.maLoai == KHAI_THAC_BAO_CAO_CHI_TIET_THUC_HIEN_PHI_BAO_QUAN_LAN_DAU_HANG_DTQG) {
          data.listCtiet.forEach(element => {
            if (element?.id.length == 38) {
              element.id = null;
            }
          })
        }
        switch (item.maLoai) {
          // bm 02
          case BAO_CAO_NHAP_HANG_DTQG:
            // nhan tien va validate
            data.khTtien = mulMoney(data.khTtien, item.maDviTien);
            data.khGiaMuaTd = mulMoney(data.khGiaMuaTd, item.maDviTien);
            data.thTtien = mulMoney(data.thTtien, item.maDviTien);
            data.thGiaMuaTd = mulMoney(data.thGiaMuaTd, item.maDviTien);
            if (data.khTtien > MONEY_LIMIT || data.khGiaMuaTd > MONEY_LIMIT || data.thTtien > MONEY_LIMIT || data.thGiaMuaTd > MONEY_LIMIT) {
              checkMoneyRange = false;
              return;
            }
            break;
          // bm 03

          case BAO_CAO_XUAT_HANG_DTQG:
            // nhan tien va validate
            data.dgGiaKhoach = mulMoney(data.dgGiaKhoach, item.maDviTien);
            data.dgGiaBanTthieu = mulMoney(data.dgGiaBanTthieu, item.maDviTien);
            data.dgGiaBanTte = mulMoney(data.dgGiaBanTte, item.maDviTien);
            data.ttGiaHtoan = mulMoney(data.ttGiaHtoan, item.maDviTien);
            data.ttGiaBanTte = mulMoney(data.ttGiaBanTte, item.maDviTien);
            data.ttClechGiaTteVaGiaHtoan = mulMoney(data.ttClechGiaTteVaGiaHtoan, item.maDviTien);
            if (data.dgGiaKhoach > MONEY_LIMIT || data.dgGiaBanTthieu > MONEY_LIMIT || data.dgGiaBanTte > MONEY_LIMIT
              || data.ttGiaHtoan > MONEY_LIMIT || data.ttGiaBanTte > MONEY_LIMIT || data.thGittClechGiaTteVaGiaHtoanaMuaTd > MONEY_LIMIT) {
              checkMoneyRange = false;
              return;
            }
            break;

          // 04a/BCPN-X_x
          case BAO_CAO_CHI_TIET_THUC_HIEN_PHI_XUAT_HANG_DTQG:
            // nhan tien va validate
            break;

          // 04a/BCPN-X_n
          case BAO_CAO_CHI_TIET_THUC_HIEN_PHI_NhAP_HANG_DTQG:
            // nhan tien va validate
            break;

          // 04b/BCPN-X
          case BAO_CAO_CHI_TIET_THUC_HIEN_PHI_XUAT_HANG_CUU_TRO_VIEN_TRO:
            // nhan tien va validate
            break;

          // 05/BCPBQ
          case KHAI_THAC_BAO_CAO_CHI_TIET_THUC_HIEN_PHI_BAO_QUAN_LAN_DAU_HANG_DTQG:
            // nhan tien va validate
            break;
          default:
            break;
        }
      })
      if (!checkMoneyRange == true) {
        this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.MONEYRANGE);
      }
    });

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
      baoCaoTemp.maPhanBcao = '1';

      //call service them moi
      this.spinner.show();
      if (this.id == null) {
        //net la tao bao cao moi thi khong luu lstCtietBcaos, con la tong hop thi khong luu
        let lbc = this.router.snapshot.paramMap.get('baoCao');
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

  getStatusName(Status: any) {
    const utils = new Utils();
    return utils.getStatusName(Status);
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
    let maLoaiBcao = this.router.snapshot.paramMap.get('loaiBaoCao');
    let namBcao = Number(this.router.snapshot.paramMap.get('nam'));
    let dotBcao = Number(this.router.snapshot.paramMap.get('dot')) == 0 ? null : Number(this.router.snapshot.paramMap.get('dot'));
    let request = {
      maLoaiBcao: maLoaiBcao,
      namBcao: namBcao,
      thangBcao: null,
      dotBcao: dotBcao,
      maPhanBcao: '1',
    }
    await this.quanLyVonPhiService.tongHopBaoCaoKetQua(request).toPromise().then(
      async (data) => {
        if (data.statusCode == 0) {
          this.baoCao = data.data;
          await this.baoCao?.lstBcaos?.forEach(item => {
            item.maDviTien = '1';   // set defaul ma don vi tien la Dong
            item.checked = false;
            item.trangThai = '3';
            this.baoCao.maLoaiBcao = maLoaiBcao;
            this.baoCao.namBcao = namBcao;
            this.baoCao.dotBcao = dotBcao;
            item.lyDoTuChoi = null;
            item.qlnvKhvonphiBcaoId = null;
            item.thuyetMinh = null;
            if (maLoaiBcao == BAO_CAO_DOT) {
              let index = LISTBIEUMAUDOT.findIndex(data => data.maPhuLuc == item.maLoai);
              if (index !== -1) {
                item.tieuDe = LISTBIEUMAUDOT[index].tieuDe + this.baoCao.dotBcao;
                item.tenPhuLuc = LISTBIEUMAUDOT[index].tenPhuLuc;
                item.nguoiBcao = this.userInfor.username;
              }
            } else {
              let index = LISTBIEUMAUNAM.findIndex(data => data.maPhuLuc == item.maLoai);
              if (index !== -1) {
                item.tieuDe = LISTBIEUMAUNAM[index].tieuDe + this.baoCao.namBcao;
                item.tenPhuLuc = LISTBIEUMAUNAM[index].tenPhuLuc;
                item.nguoiBcao = this.userInfor.username;
              }
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
         // bm 02
         case BAO_CAO_NHAP_HANG_DTQG:
          // nhan tien va validate
          data.khTtien = mulMoney(data.khTtien, item.maDviTien);
          data.khGiaMuaTd = mulMoney(data.khGiaMuaTd, item.maDviTien);
          data.thTtien = mulMoney(data.thTtien, item.maDviTien);
          data.thGiaMuaTd = mulMoney(data.thGiaMuaTd, item.maDviTien);
          if (data.khTtien > MONEY_LIMIT || data.khGiaMuaTd > MONEY_LIMIT || data.thTtien > MONEY_LIMIT || data.thGiaMuaTd > MONEY_LIMIT) {
            checkMoneyRange = false;
            return;
          }
          break;
          
        // bm 03
        case BAO_CAO_XUAT_HANG_DTQG:
          // nhan tien va validate
          data.dgGiaKhoach = mulMoney(data.dgGiaKhoach, item.maDviTien);
          data.dgGiaBanTthieu = mulMoney(data.dgGiaBanTthieu, item.maDviTien);
          data.dgGiaBanTte = mulMoney(data.dgGiaBanTte, item.maDviTien);
          data.ttGiaHtoan = mulMoney(data.ttGiaHtoan, item.maDviTien);
          data.ttGiaBanTte = mulMoney(data.ttGiaBanTte, item.maDviTien);
          data.ttClechGiaTteVaGiaHtoan = mulMoney(data.ttClechGiaTteVaGiaHtoan, item.maDviTien);
          if (data.dgGiaKhoach > MONEY_LIMIT || data.dgGiaBanTthieu > MONEY_LIMIT || data.dgGiaBanTte > MONEY_LIMIT
            || data.ttGiaHtoan > MONEY_LIMIT || data.ttGiaBanTte > MONEY_LIMIT || data.thGittClechGiaTteVaGiaHtoanaMuaTd > MONEY_LIMIT) {
            checkMoneyRange = false;
            return;
          }
          break;

          // 04a/BCPN-X_x
          case BAO_CAO_CHI_TIET_THUC_HIEN_PHI_XUAT_HANG_DTQG:
            // nhan tien va validate
            break;

          // 04a/BCPN-X_n
          case BAO_CAO_CHI_TIET_THUC_HIEN_PHI_NhAP_HANG_DTQG:
            // nhan tien va validate
            break;

          // 04b/BCPN-X
          case BAO_CAO_CHI_TIET_THUC_HIEN_PHI_XUAT_HANG_CUU_TRO_VIEN_TRO:
            // nhan tien va validate
            break;

          // 05/BCPBQ
          case KHAI_THAC_BAO_CAO_CHI_TIET_THUC_HIEN_PHI_BAO_QUAN_LAN_DAU_HANG_DTQG:
            // nhan tien va validate
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
      baoCaoTemp.maPhanBcao = '1';

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

  // nhóm chúc năng biểu mẫu 02 -------------------------------------------
  //check all input
  updateAllChecked02(): void {
    this.indeterminate02 = false;
    this.lstCtietBcao021 = this.lstCtietBcao021.map((item) => ({
      ...item,
      checked: this.allChecked02,
    }));
    this.lstCtietBcao022 = this.lstCtietBcao022.map((item) => ({
      ...item,
      checked: this.allChecked02,
    }));
  }

  addLine02(idx: any, loaiList: any): void {

    var loaiDonVi;
    var parentID: any;
    if (loaiList == '1') {
      loaiDonVi = 'dv';
      parentID = 1;
    } else {
      loaiDonVi = 'tc';
      parentID = 2;
    }
    let item: ItemDataMau02 = {
      id: uuid.v4() + 'FE',
      stt: 0,
      index: 0,
      maVtu: '',
      maDviTinh: null,
      soQd: null,
      khSoLuong: null,
      khGiaMuaTd: null,
      khTtien: null,
      thSoLuong: null,
      thGiaMuaTd: null,
      thTtien: null,
      ghiChu: null,
      maVtuHeader: parentID,
      loai: loaiDonVi,
      checked!: false,
    };
    if (loaiList == '1') {
      this.lstCtietBcao021.splice(idx, 0, item);
    } else {
      this.lstCtietBcao022.splice(idx, 0, item);
    }
    this.editCache[item.id] = {
      edit: true,
      data: { ...item },
    };
  }


  // xoa dong
  deleteById02(id: any, loaiList: any): void {
    if (loaiList == '1') {
      this.lstCtietBcao021 = this.lstCtietBcao021.filter((item) => item?.id != id);
    } else {
      this.lstCtietBcao022 = this.lstCtietBcao022.filter((item) => item?.id != id);
    }
  }

  //chọn row cần sửa 
  startEdit02(id: string, loaiList: any): void {
    this.editCache[id].edit = true;
  }


  //checkox trên tùng row
  updateSingleChecked02(): void {
    if ((this.lstCtietBcao021.every((item) => !item.checked)) && (this.lstCtietBcao022.every((item) => !item.checked))) {
      this.allChecked02 = false;
      this.indeterminate02 = true;
    } else if ((this.lstCtietBcao021.every((item) => item.checked)) && (this.lstCtietBcao022.every((item) => item.checked))) {
      this.allChecked02 = true;
      this.indeterminate02 = false;
    } else {
      this.indeterminate02 = true;
    }
  }

  //tinh toan tong so
  changeModel02(id: string, loaiList: any) {
    this.editCache[id].data.khTtien = this.editCache[id].data.khSoLuong * this.editCache[id].data.khGiaMuaTd;
    this.editCache[id].data.thTtien = this.editCache[id].data.thSoLuong * this.editCache[id].data.thGiaMuaTd;
  }

  //update khi sửa
  saveEdit02(id: string, loaiList: any): void {
    if (loaiList == '1') {
      this.editCache[id].data.checked = this.lstCtietBcao021.find((item) => item.id === id).checked; // set checked editCache = checked lstCtietBcaos
      const index = this.lstCtietBcao021.findIndex((item) => item.id === id); // lay vi tri hang minh sua
      Object.assign(this.lstCtietBcao021[index], this.editCache[id].data); // set lai data cua lstCtietBcaos[index] = this.editCache[id].data
      this.editCache[id].edit = false; // CHUYEN VE DANG TEXT
    } else {
      this.editCache[id].data.checked = this.lstCtietBcao022.find((item) => item.id === id).checked; // set checked editCache = checked lstCtietBcaos
      const index = this.lstCtietBcao022.findIndex((item) => item.id === id); // lay vi tri hang minh sua
      Object.assign(this.lstCtietBcao022[index], this.editCache[id].data); // set lai data cua lstCtietBcaos[index] = this.editCache[id].data
      this.editCache[id].edit = false; // CHUYEN VE DANG TEXT
    }
  }

  //hủy thao tác sửa update lại giá trị ban đầu
  cancelEdit02(id: string, loaiList: any): void {
    if (loaiList == '1') {
      const index = this.lstCtietBcao021.findIndex((item) => item.id === id); // lay vi tri hang minh sua
      this.editCache[id] = {
        data: { ...this.lstCtietBcao021[index] },
        edit: false,
      };
    } else {
      const index = this.lstCtietBcao022.findIndex((item) => item.id === id); // lay vi tri hang minh sua
      this.editCache[id] = {
        data: { ...this.lstCtietBcao022[index] },
        edit: false,
      };
    }
  }

  async saveMau02() {

    this.lstCTietBaoCaoTemp = [];
    await this.lstCtietBcao021.forEach(e => {
      this.lstCTietBaoCaoTemp.push(e);
    })
    await this.lstCtietBcao022.forEach(e => {
      this.lstCTietBaoCaoTemp.push(e);
    })
  }

  updateEditCache02(): void {
    this.lstCtietBcao021.forEach((item) => {
      this.editCache[item.id] = {
        edit: false,
        data: { ...item },
      };
    });
    this.lstCtietBcao022.forEach((item) => {
      this.editCache[item.id] = {
        edit: false,
        data: { ...item },
      };
    });
  }

  // xóa với checkbox
  deleteSelected02() {
    // delete object have checked = true
    this.lstCtietBcao021 = this.lstCtietBcao021.filter(
      (item) => item.checked != true,
    );
    this.lstCtietBcao022 = this.lstCtietBcao022.filter(
      (item) => item.checked != true,
    );
    this.allChecked02 = false;
  }

  // nhóm chức năng biểu mẫu 03 -----------------------------------------------
  ////////////////////////////////////////////////////////////////////////
  updateAllChecked03(): void {
    this.indeterminate03 = false;
    this.lstCtietBcao031 = this.lstCtietBcao031.map((item) => ({
      ...item,
      checked: this.allChecked03,
    }));
    this.lstCtietBcao032 = this.lstCtietBcao032.map((item) => ({
      ...item,
      checked: this.allChecked03,
    }));
    this.lstCtietBcao033 = this.lstCtietBcao033.map((item) => ({
      ...item,
      checked: this.allChecked03,
    }));
  }


  addLine03(idx: any, loaiList: any): void {
    var loai: any;
    var parentId: any;
    if (loaiList == '1') {
      loai = 1;
      parentId = 1;
    } else if (loaiList == '2') {
      loai = 2;
      parentId = 2;
    } else {
      loai = 3;
      parentId = 3;
    }

    let item: ItemDataMau03 = {
      id: uuid.v4() + 'FE',
      stt: 0,
      maVtu: 0,
      maDviTinh: 0,
      soLuongKhoach: '',
      soLuongTte: 0,
      dgGiaKhoach: 0,
      dgGiaBanTthieu: 0,
      dgGiaBanTte: 0,
      ttGiaHtoan: 0,
      ttGiaBanTte: 0,
      ttClechGiaTteVaGiaHtoan: 0,
      ghiChu: 0,
      maVtuHeader: parentId,
      loai: loai,
      checked: false,
    };

    if (loaiList == '1') {
      this.lstCtietBcao031.splice(idx, 0, item);
    } else if (loaiList == '2') {
      this.lstCtietBcao032.splice(idx, 0, item);
    } else {
      this.lstCtietBcao033.splice(idx, 0, item);
    }
    this.editCache[item.id] = {
      edit: true,
      data: { ...item },
    };
  }

  deleteById03(id: any, loaiList: any): void {
    if (loaiList == '1') {
      this.lstCtietBcao031 = this.lstCtietBcao031.filter((item) => item.id != id);
    } else if (loaiList == '2') {
      this.lstCtietBcao032 = this.lstCtietBcao032.filter((item) => item.id != id);
    } else {
      this.lstCtietBcao033 = this.lstCtietBcao033.filter((item) => item.id != id);
    }
  }

  //chọn row cần sửa
  startEdit03(id: string, loaiList: any): void {
    this.editCache[id].edit = true;
  }

  //checkox trên tùng row
  updateSingleChecked03(): void {
    if ((this.lstCtietBcao031.every((item) => !item.checked)) && (this.lstCtietBcao032.every((item) => !item.checked)) && (this.lstCtietBcao033.every((item) => !item.checked))) {
      this.allChecked03 = false;
      this.indeterminate03 = true;
    } else if ((this.lstCtietBcao031.every((item) => item.checked)) && (this.lstCtietBcao032.every((item) => item.checked)) && (this.lstCtietBcao033.every((item) => item.checked))) {
      this.allChecked03 = true;
      this.indeterminate03 = false;
    } else {
      this.indeterminate03 = true;
    }
  }

  //tinh tong
  changeModel03(id: any, loaiList: any) {
    this.editCache[id].data.ttGiaHtoan = this.editCache[id].data.soLuongTte * this.editCache[id].data.dgGiaKhoach;
    this.editCache[id].data.ttGiaBanTte = this.editCache[id].data.soLuongTte * this.editCache[id].data.dgGiaBanTte;
    this.editCache[id].data.ttClechGiaTteVaGiaHtoan = this.editCache[id].data.ttGiaBanTte - this.editCache[id].data.ttGiaHtoan;
  }

  saveEdit03(id: string, loaiList: any): void {
    if (loaiList == '1') {
      this.editCache[id].data.checked = this.lstCtietBcao031.find((item) => item.id === id).checked; // set checked editCache = checked lstCtietBcaos
      const index = this.lstCtietBcao031.findIndex((item) => item.id === id); // lay vi tri hang minh sua
      Object.assign(this.lstCtietBcao031[index], this.editCache[id].data); // set lai data cua lstCtietBcaos[index] = this.editCache[id].data
      this.editCache[id].edit = false; // CHUYEN VE DANG TEXT
    } else if (loaiList == '2') {
      this.editCache[id].data.checked = this.lstCtietBcao032.find((item) => item.id === id).checked; // set checked editCache = checked lstCtietBcaos
      const index = this.lstCtietBcao032.findIndex((item) => item.id === id); // lay vi tri hang minh sua
      Object.assign(this.lstCtietBcao032[index], this.editCache[id].data); // set lai data cua lstCtietBcaos[index] = this.editCache[id].data
      this.editCache[id].edit = false; // CHUYEN VE DANG TEXT
    } else {
      this.editCache[id].data.checked = this.lstCtietBcao033.find((item) => item.id === id).checked; // set checked editCache = checked lstCtietBcaos
      const index = this.lstCtietBcao033.findIndex((item) => item.id === id); // lay vi tri hang minh sua
      Object.assign(this.lstCtietBcao033[index], this.editCache[id].data); // set lai data cua lstCtietBcaos[index] = this.editCache[id].data
      this.editCache[id].edit = false; // CHUYEN VE DANG TEXT
    }
  }

  //hủy thao tác sửa update lại giá trị ban đầu
  cancelEdit03(id: string, loaiList: any): void {
    if (loaiList == '1') {
      const index = this.lstCtietBcao031.findIndex((item) => item.id === id); // lay vi tri hang minh sua
      this.editCache[id] = {
        data: { ...this.lstCtietBcao031[index] },
        edit: false,
      };
    } else if (loaiList == '2') {
      const index = this.lstCtietBcao032.findIndex((item) => item.id === id); // lay vi tri hang minh sua
      this.editCache[id] = {
        data: { ...this.lstCtietBcao032[index] },
        edit: false,
      };
    } else {
      const index = this.lstCtietBcao033.findIndex((item) => item.id === id); // lay vi tri hang minh sua
      this.editCache[id] = {
        data: { ...this.lstCtietBcao033[index] },
        edit: false,
      };
    }
  }

  // xóa với checkbox
  deleteSelected03() {
    // delete object have checked = true
    this.lstCtietBcao031 = this.lstCtietBcao031.filter(
      (item) => item.checked != true,
    );
    this.lstCtietBcao032 = this.lstCtietBcao032.filter(
      (item) => item.checked != true,
    );
    this.lstCtietBcao033 = this.lstCtietBcao033.filter(
      (item) => item.checked != true,
    );
    this.allChecked03 = false;
  }

  updateEditCache03(): void {
    this.lstCtietBcao031.forEach((item) => {
      this.editCache[item.id] = {
        edit: false,
        data: { ...item },
      };
    });
    this.lstCtietBcao032.forEach((item) => {
      this.editCache[item.id] = {
        edit: false,
        data: { ...item },
      };
    });
    this.lstCtietBcao033.forEach((item) => {
      this.editCache[item.id] = {
        edit: false,
        data: { ...item },
      };
    });
  }

  async saveMau03() {
    this.lstCTietBaoCaoTemp = [];
    await this.lstCtietBcao031.forEach(e => {
      this.lstCTietBaoCaoTemp.push(e);
    })
    await this.lstCtietBcao032.forEach(e => {
      this.lstCTietBaoCaoTemp.push(e);
    })
    await this.lstCtietBcao033.forEach(e => {
      this.lstCTietBaoCaoTemp.push(e);
    })
  }


  //nhóm chức năng biểu mẫu 04 --> 05 --------------------------------
  // chuyển đổi stt đang được mã hóa thành dạng I, II, a, b, c, ...

  sinhMa(): number {
    var i: number = 1;
    var kt: boolean = true;
    while (kt) {
      var index1: number = this.listColTrongDot4an.findIndex(item => item.col == i);
      var index2: number = this.listColTrongDot4ax.findIndex(item => item.col == i);
      var index3: number = this.listColTrongDot4bx.findIndex(item => item.col == i);
      var index4: number = this.listColTrongDot05.findIndex(item => item.col == i);
      if (index1 > -1 || index2 > -1 || index3 > -1 || index4 > -1) {
        i++;
      } else {
        kt = false;
      }
    }
    return i;
  }

  addCol() {
    var listVtu: vatTu[] = [];
    var colname;
    this.listColTemp = [];
    //loại 6
    if (this.tabSelected == BAO_CAO_CHI_TIET_THUC_HIEN_PHI_XUAT_HANG_DTQG) {
      if (this.idVatTu == undefined) {
        return;
      } else {
        var checkVtu = this.listColTrongDot4ax.findIndex(item => item.maVtu == this.idVatTu);
        if (checkVtu != -1) {
          this.notification.warning(MESSAGE.WARNING, "Vật tư đã được thêm");
          this.listColTemp = this.listColTrongDot4ax;
          return;
        }
        colname = this.listVattu.find((item) => item.id == this.idVatTu).tenDm;
        let objTrongdot = {
          id: uuid.v4() + 'FE',
          maVtu: this.idVatTu,
          loaiMatHang: '0',
          colName: colname,
          sl: 0,
          col: this.sinhMa(),
        };

        this.listColTrongDot4ax.push(objTrongdot);
        this.cols4ax = 0;
        this.cols4ax++;
        this.listColTemp = this.listColTrongDot4ax;
        this.cols = this.cols + this.cols4ax;

        let objTrongD = {
          id: null,
          maVtu: null,
          loaiMatHang: '0',
          colName: null,
          sl: 0,
          col: null,
        };
        let objLke = {
          id: null,
          maVtu: null,
          loaiMatHang: '1',
          colName: null,
          sl: 0,
          col: null,
        };
        this.listColTemp.forEach((e) => {
          objTrongD.id = uuid.v4() + 'FE';
          objTrongD.maVtu = e.maVtu;
          objTrongD.col = e.col;

          objLke.id = uuid.v4() + 'FE',
            objLke.maVtu = e.maVtu;
          objLke.col = e.col;
          listVtu.push(objTrongD);
          listVtu.push(objLke);
        });
        this.lstCTietBaoCaoTemp.forEach(e => {
          if (e.listCtiet.length == 0) {
            e.listCtiet = listVtu;
          } else {
            var idx = e.listCtiet.findIndex(item => item.maVtu === this.idVatTu);
            if (idx == -1) {
              e.listCtiet.push(objTrongD);
              e.listCtiet.push(objLke);
            }
          }

        })
      }
      //loại 7
    } else if (this.tabSelected == BAO_CAO_CHI_TIET_THUC_HIEN_PHI_NhAP_HANG_DTQG) {
      if (this.idVatTu == undefined) {
        return;
      } else {
        var checkVtu = this.listColTrongDot4an.findIndex(item => item.maVtu == this.idVatTu);
        if (checkVtu != -1) {
          this.notification.warning(MESSAGE.WARNING, "Vật tư đã được thêm");
          this.listColTemp = this.listColTrongDot4an;
          return;
        }
        colname = this.listVattu.find((item) => item.id == this.idVatTu).tenDm;
        let objTrongdot = {
          id: uuid.v4() + 'FE',
          maVtu: this.idVatTu,
          loaiMatHang: '0',
          colName: colname,
          sl: 0,
          col: this.sinhMa(),
        };

        this.listColTrongDot4an.push(objTrongdot);
        this.cols4an = 0;
        this.cols4an++;
        this.listColTemp = this.listColTrongDot4an;
        this.cols = this.cols + this.cols4an;

        let objTrongD = {
          id: null,
          maVtu: null,
          loaiMatHang: '0',
          colName: null,
          sl: 0,
          col: null,
        };
        let objLke = {
          id: null,
          maVtu: null,
          loaiMatHang: '1',
          colName: null,
          sl: 0,
          col: null,
        };
        this.listColTemp.forEach((e) => {
          objTrongD.id = e.id;
          objTrongD.maVtu = e.maVtu;
          objTrongD.col = e.col;

          objLke.id = e.id,
            objLke.maVtu = e.maVtu;
          objLke.col = e.col;
          listVtu.push(objTrongD);
          listVtu.push(objLke);
        });
        this.lstCTietBaoCaoTemp.forEach(e => {
          if (e.listCtiet.length == 0) {
            e.listCtiet = listVtu;
          } else {
            var idx = e.listCtiet.findIndex(item => item.maVtu === this.idVatTu);
            if (idx == -1) {
              e.listCtiet.push(objTrongD);
              e.listCtiet.push(objLke);
            } else {
              this.notification.warning(MESSAGE.WARNING, "Vật tư đã được thêm");
              return;
            }
          }

        })
      }
      //loại 8
    } else if (this.tabSelected == BAO_CAO_CHI_TIET_THUC_HIEN_PHI_XUAT_HANG_CUU_TRO_VIEN_TRO) {
      if (this.idVatTu == undefined) {
        return;
      } else {
        var checkVtu = this.listColTrongDot4ax.findIndex(item => item.maVtu == this.idVatTu);
        if (checkVtu != -1) {
          this.notification.warning(MESSAGE.WARNING, "Vật tư đã được thêm");
          this.listColTemp = this.listColTrongDot4bx;
          return;
        }
        colname = this.listVattu.find((item) => item.id == this.idVatTu).tenDm;
        let objTrongdot = {
          id: uuid.v4() + 'FE',
          maVtu: this.idVatTu,
          loaiMatHang: '0',
          colName: colname,
          sl: 0,
          col: this.sinhMa(),
        };

        this.listColTrongDot4bx.push(objTrongdot);
        this.cols4bx = 0;
        this.cols4bx++;
        this.listColTemp = this.listColTrongDot4bx;
        this.cols = this.cols + this.cols4bx;

        let objTrongD = {
          id: null,
          maVtu: null,
          loaiMatHang: '0',
          colName: null,
          sl: 0,
          col: null,
        };
        let objLke = {
          id: null,
          maVtu: null,
          loaiMatHang: '1',
          colName: null,
          sl: 0,
          col: null,
        };
        this.listColTemp.forEach((e) => {
          objTrongD.id = e.id;
          objTrongD.maVtu = e.maVtu;
          objTrongD.col = e.col;

          objLke.id = e.id,
            objLke.maVtu = e.maVtu;
          objLke.col = e.col;
          listVtu.push(objTrongD);
          listVtu.push(objLke);
        });
        this.lstCTietBaoCaoTemp.forEach(e => {
          if (e.listCtiet.length == 0) {
            e.listCtiet = listVtu;
          } else {
            var idx = e.listCtiet.findIndex(item => item.maVtu === this.idVatTu);
            if (idx == -1) {
              e.listCtiet.push(objTrongD);
              e.listCtiet.push(objLke);
            } else {
              this.notification.warning(MESSAGE.WARNING, "Vật tư đã được thêm");
              return;
            }
          }

        })
      }
      // loai 9
    } else if (this.tabSelected == KHAI_THAC_BAO_CAO_CHI_TIET_THUC_HIEN_PHI_BAO_QUAN_LAN_DAU_HANG_DTQG) {
      if (this.idVatTu == undefined) {
        return;
      } else {
        var checkVtu = this.listColTrongDot05.findIndex(item => item.maVtu == this.idVatTu);
        if (checkVtu != -1) {
          this.notification.warning(MESSAGE.WARNING, "Vật tư đã được thêm");
          this.listColTemp = this.listColTrongDot05;
          return;
        }
        colname = this.listVattu.find((item) => item.id == this.idVatTu).tenDm;
        let objTrongdot = {
          id: uuid.v4() + 'FE',
          maVtu: this.idVatTu,
          loaiMatHang: '0',
          colName: colname,
          sl: 0,
          col: this.sinhMa(),
        };

        this.listColTrongDot05.push(objTrongdot);
        this.cols05 = 0;
        this.cols05++;
        this.listColTemp = this.listColTrongDot05;
        this.cols = this.cols + this.cols05;

        let objTrongD: any = {
          id: uuid.v4() + 'FE',
          maVtu: null,
          loaiMatHang: '0',
          colName: null,
          sl: 0,
          col: null,
        };
        let objLke: any = {
          id: uuid.v4() + 'FE',
          maVtu: null,
          loaiMatHang: '1',
          colName: null,
          sl: 0,
          col: null,
        };
        this.listColTemp.forEach((e) => {
          // objTrongD.id = e.id;
          objTrongD.maVtu = e.maVtu;
          objTrongD.col = e.col;

          // objLke.id= e.id,
          objLke.maVtu = e.maVtu;
          objLke.col = e.col;
          listVtu.push(objTrongD);
          listVtu.push(objLke);
        });
        this.lstCTietBaoCaoTemp.forEach(e => {
          if (e.listCtiet.length == 0) {
            e.listCtiet = listVtu;
          } else {
            var idx = e.listCtiet.findIndex(item => item.maVtu === this.idVatTu);
            if (idx == -1) {
              e.listCtiet.push(objTrongD);
              e.listCtiet.push(objLke);
            } else {
              this.notification.warning(MESSAGE.WARNING, "Vật tư đã được thêm");
              return;
            }
          }

        })
      }
    }

    console.log(this.lstCTietBaoCaoTemp)
    this.updateEditCache();
  }


  deleteCol(col: any) {
    if (this.tabSelected == BAO_CAO_CHI_TIET_THUC_HIEN_PHI_XUAT_HANG_DTQG) {
      var itemCol = this.listColTrongDot4ax.find((item) => item.col == col);
      if (itemCol?.id?.length == 36) {
        this.lstIdDeleteCols += itemCol.col + ',';
      }
      this.listColTrongDot4ax = this.listColTrongDot4ax.filter(item => item.col != col);
      this.listColTemp = this.listColTrongDot4ax;
      this.lstCTietBaoCaoTemp.forEach(e => {
        e.listCtiet = e.listCtiet.filter(item => item.col != col);
      });
      this.cols4ax = this.cols4ax - 1;
      this.cols = this.cols - 1;

    } else if (this.tabSelected == BAO_CAO_CHI_TIET_THUC_HIEN_PHI_NhAP_HANG_DTQG) {
      var itemCol = this.listColTrongDot4an.find((item) => item.col == col);
      if (itemCol?.id?.length == 36) {
        this.lstIdDeleteCols += itemCol.col + ',';
      }
      this.listColTrongDot4an = this.listColTrongDot4an.filter(item => item.col != col);
      this.listColTemp = this.listColTrongDot4an;
      this.lstCTietBaoCaoTemp.forEach(e => {
        e.listCtiet = e.listCtiet.filter(item => item.col != col);
      });
      this.cols4an = this.cols4an - 1;
      this.cols = this.cols - 1;
    } else if (this.tabSelected == BAO_CAO_CHI_TIET_THUC_HIEN_PHI_XUAT_HANG_CUU_TRO_VIEN_TRO) {
      var itemCol = this.listColTrongDot4bx.find((item) => item.col == col);
      if (itemCol?.id?.length == 36) {
        this.lstIdDeleteCols += itemCol.col + ',';
      }
      this.listColTrongDot4bx = this.listColTrongDot4bx.filter(item => item.col != col);
      this.listColTemp = this.listColTrongDot4bx;
      this.lstCTietBaoCaoTemp.forEach((e) => {
        e.listCtiet = e.listCtiet.filter(item => item.col != col);
      });
      this.cols4bx = this.cols4bx - 1;
      this.cols = this.cols - 1;
    } else if (this.tabSelected == KHAI_THAC_BAO_CAO_CHI_TIET_THUC_HIEN_PHI_BAO_QUAN_LAN_DAU_HANG_DTQG) {
      var itemCol = this.listColTrongDot05.find((item) => item.col == col);
      if (itemCol?.id?.length == 36) {
        this.lstIdDeleteCols += itemCol.col + ',';
      }
      this.listColTrongDot05 = this.listColTrongDot05.filter(item => item.col != col);
      this.listColTemp = this.listColTrongDot05;
      this.lstCTietBaoCaoTemp.forEach((e) => {
        e.listCtiet = e.listCtiet.filter(item => item.col != col);
      });
      this.cols05 = this.cols05 - 1;
      this.cols = this.cols - 1;
    }
    this.tinhTong2();

  }
  tinhTong(id: any) {
    let tonglstChitietVtuTrongDot = 0;
    if (this.editCache[id].data.listCtiet.length != 0) {
      this.editCache[id].data.listCtiet.forEach(e => {
        if (e.loaiMatHang == '0') {
          tonglstChitietVtuTrongDot += e.sl;
        }
      })
    }
    this.editCache[id].data.trongDotTcong = this.editCache[id].data.trongDotThoc + this.editCache[id].data.trongDotGao + tonglstChitietVtuTrongDot;
    let tonglstChitietVtuLuyke = 0;
    if (this.editCache[id].data.listCtiet.length != 0) {
      this.editCache[id].data.listCtiet.forEach(e => {
        if (e.loaiMatHang == '1') {
          tonglstChitietVtuLuyke += e.sl;
        }
      })
    }
    this.editCache[id].data.luyKeTcong = this.editCache[id].data.luyKeThoc + this.editCache[id].data.luyKeGao + tonglstChitietVtuLuyke;
  }

  tinhTong2() {
    let tonglstChitietVtuTrongDot = 0;
    let tonglstChitietVtuLuyke = 0;
    this.lstCTietBaoCaoTemp.forEach(e => {
      e.listCtiet.forEach(el => {
        if (e.loaiMatHang == '0') {
          tonglstChitietVtuTrongDot += el.sl;
        } else {
          tonglstChitietVtuLuyke += el.sl;
        }
      });
      e.trongDotTcong = e.trongDotThoc + e.trongDotGao + tonglstChitietVtuTrongDot;
      e.luyKeTcong = e.luyKeThoc + e.luyKeGao + tonglstChitietVtuLuyke;
    })
  }


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
        xau = chiSo[n - 1] + "." + chiSo[n];
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
    var start: number = this.lstCTietBaoCaoTemp.findIndex(e => e.stt == str);
    var index: number = start;
    for (var i = start + 1; i < this.lstCTietBaoCaoTemp.length; i++) {
      if (this.lstCTietBaoCaoTemp[i].stt.startsWith(str)) {
        index = i;
      }
    }
    return index;
  }

  //thay thế các stt khi danh sách được cập nhật, heSo=1 tức là tăng stt lên 1, heso=-1 là giảm stt đi 1
  replaceIndex(lstIndex: number[], heSo: number) {
    //thay doi lai stt cac vi tri vua tim duoc
    lstIndex.forEach(item => {
      var str = this.getHead(this.lstCTietBaoCaoTemp[item].stt) + "." + (this.getTail(this.lstCTietBaoCaoTemp[item].stt) + heSo);
      var nho = this.lstCTietBaoCaoTemp[item].stt;
      this.lstCTietBaoCaoTemp.forEach(item => {
        item.stt = item.stt.replace(nho, str);
      })
    })
  }

  //thêm ngang cấp
  addSame(id: any, initItem: ItemDataMau04a1) {
    var index: number = this.lstCTietBaoCaoTemp.findIndex(e => e.id === id); // vi tri hien tai
    var head: string = this.getHead(this.lstCTietBaoCaoTemp[index].stt); // lay phan dau cua so tt
    var tail: number = this.getTail(this.lstCTietBaoCaoTemp[index].stt); // lay phan duoi cua so tt
    var ind: number = this.findVt(this.lstCTietBaoCaoTemp[index].stt); // vi tri can duoc them
    // tim cac vi tri can thay doi lai stt
    let lstIndex: number[] = [];
    for (var i = this.lstCTietBaoCaoTemp.length - 1; i > ind; i--) {
      if (this.getHead(this.lstCTietBaoCaoTemp[i].stt) == head) {
        lstIndex.push(i);
      }
    }

    this.replaceIndex(lstIndex, 1);
    var listVtu: vatTu[] = [];
    var loai: number = 0;
    if (this.tabSelected == BAO_CAO_CHI_TIET_THUC_HIEN_PHI_XUAT_HANG_DTQG) {
      this.listColTemp.forEach((e) => {
        let objTrongD = {
          id: e.id,
          maVtu: e.maVtu,
          loaiMatHang: '0',
          colName: null,
          sl: 0,
          col: e.col,
        };
        let objLke = {
          id: e.id,
          maVtu: e.maVtu,
          loaiMatHang: '1',
          colName: null,
          sl: 0,
          col: e.col,
        };
        listVtu.push(objTrongD);
        listVtu.push(objLke);
      });
      loai = 6;
    } else if (this.tabSelected == BAO_CAO_CHI_TIET_THUC_HIEN_PHI_NhAP_HANG_DTQG) {
      this.listColTemp.forEach((e) => {
        let objTrongD = {
          id: e.id,
          maVtu: e.maVtu,
          loaiMatHang: '0',
          colName: null,
          sl: 0,
          col: e.col,
        };
        let objLke = {
          id: e.id,
          maVtu: e.maVtu,
          loaiMatHang: '1',
          colName: null,
          sl: 0,
          col: e.col,
        };
        listVtu.push(objTrongD);
        listVtu.push(objLke);
      });
      loai = 7;
    } else if (this.tabSelected == BAO_CAO_CHI_TIET_THUC_HIEN_PHI_XUAT_HANG_CUU_TRO_VIEN_TRO) {
      this.listColTemp.forEach((e) => {
        let objTrongD = {
          id: e.id,
          maVtu: e.maVtu,
          loaiMatHang: '0',
          colName: null,
          sl: 0,
          col: e.col,
        };
        let objLke = {
          id: e.id,
          maVtu: e.maVtu,
          loaiMatHang: '1',
          colName: null,
          sl: 0,
          col: e.col,
        };
        listVtu.push(objTrongD);
        listVtu.push(objLke);
      });
      loai = 8;
    } else if (this.tabSelected == KHAI_THAC_BAO_CAO_CHI_TIET_THUC_HIEN_PHI_BAO_QUAN_LAN_DAU_HANG_DTQG) {
      this.listColTemp.forEach((e) => {
        let objTrongD = {
          id: e.id,
          maVtu: e.maVtu,
          loaiMatHang: '0',
          colName: null,
          sl: 0,
          col: e.col,
        };
        let objLke = {
          id: e.id,
          maVtu: e.maVtu,
          loaiMatHang: '1',
          colName: null,
          sl: 0,
          col: e.col,
        };
        listVtu.push(objTrongD);
        listVtu.push(objLke);
      });
      loai = 9;
    }
    // them moi phan tu
    if (initItem.id) {
      let item: ItemDataMau04a1 = {
        ...initItem,
        stt: head + "." + (tail + 1),
        listCtiet: listVtu,
        maLoai: loai,
      }
      this.lstCTietBaoCaoTemp.splice(ind + 1, 0, item);
      this.editCache[item.id] = {
        edit: false,
        data: { ...item }
      };
    } else {
      let item: ItemDataMau04a1 = {
        ...initItem,
        id: uuid.v4() + 'FE',
        stt: head + "." + (tail + 1),
        listKhoanMuc: this.lstCTietBaoCaoTemp[index].listKhoanMuc,
        listCtiet: listVtu,
        maLoai: loai,
      }
      this.lstCTietBaoCaoTemp.splice(ind + 1, 0, item);
      this.editCache[item.id] = {
        edit: true,
        data: { ...item }
      };
    }
    // let item: ItemDataMau04a1 = {
    //     id: uuid.v4()+'FE',
    //     stt: head + "." + (tail + 1),
    //     listKhoanMuc: this.lstCTietBaoCaoTemp[index].listKhoanMuc,
    //     maNdungChi: '',
    //     maNdungChiParent: '',
    //     trongDotTcong: 0,
    //     trongDotThoc: 0,
    //     trongDotGao: 0,
    //     luyKeTcong: 0,
    //     luyKeThoc: 0,
    //     luyKeGao: 0,
    //     listCtiet: listVtu,
    //     parentId: null,
    //     ghiChu: '',
    //     maLoai: loai,
    //     checked: false,
    // }
    // this.lstCTietBaoCaoTemp.splice(ind + 1, 0, item);

    // this.editCache[item.id] = {
    //     edit: true,
    //     data: { ...item }
    // };
  }

  // gan editCache.data == lstCtietBcaos
  updateEditCache(): void {
    this.lstCTietBaoCaoTemp.forEach(item => {
      this.editCache[item.id] = {
        edit: false,
        data: { ...item }
      };
    });
  }

  //thêm cấp thấp hơn
  addLow(id: any, initItem: ItemDataMau04a1) {
    var index: number = this.lstCTietBaoCaoTemp.findIndex(e => e.id === id); // vi tri hien tai
    //list các vị trí cần thay đôi lại stt
    let lstIndex: number[] = [];
    for (var i = this.lstCTietBaoCaoTemp.length - 1; i > index; i--) {
      if (this.getHead(this.lstCTietBaoCaoTemp[i].stt) == this.lstCTietBaoCaoTemp[index].stt) {
        lstIndex.push(i);
      }
    }

    this.replaceIndex(lstIndex, 1);
    var listVtu: vatTu[] = [];
    var loai: number = 0;
    if (this.tabSelected == BAO_CAO_CHI_TIET_THUC_HIEN_PHI_XUAT_HANG_DTQG) {
      this.listColTemp.forEach((e) => {
        let objTrongD = {
          id: e.id,
          maVtu: e.maVtu,
          loaiMatHang: '0',
          colName: null,
          sl: 0,
          col: e.col,
        };
        let objLke = {
          id: e.id,
          maVtu: e.maVtu,
          loaiMatHang: '1',
          colName: null,
          sl: 0,
          col: e.col,
        };
        listVtu.push(objTrongD);
        listVtu.push(objLke);
      });
      loai = 6;
    } else if (this.tabSelected == BAO_CAO_CHI_TIET_THUC_HIEN_PHI_NhAP_HANG_DTQG) {
      this.listColTemp.forEach((e) => {
        let objTrongD = {
          id: e.id,
          maVtu: e.maVtu,
          loaiMatHang: '0',
          colName: null,
          sl: 0,
          col: e.col,
        };
        let objLke = {
          id: e.id,
          maVtu: e.maVtu,
          loaiMatHang: '1',
          colName: null,
          sl: 0,
          col: e.col,
        };
        listVtu.push(objTrongD);
        listVtu.push(objLke);
      });
      loai = 7;
    } else if (this.tabSelected == BAO_CAO_CHI_TIET_THUC_HIEN_PHI_XUAT_HANG_CUU_TRO_VIEN_TRO) {
      this.listColTemp.forEach((e) => {
        let objTrongD = {
          id: e.id,
          maVtu: e.maVtu,
          loaiMatHang: '0',
          colName: null,
          sl: 0,
          col: e.col,
        };
        let objLke = {
          id: e.id,
          maVtu: e.maVtu,
          loaiMatHang: '1',
          colName: null,
          sl: 0,
          col: e.col,
        };
        listVtu.push(objTrongD);
        listVtu.push(objLke);
      });
      loai = 8;
    } else if (this.tabSelected == KHAI_THAC_BAO_CAO_CHI_TIET_THUC_HIEN_PHI_BAO_QUAN_LAN_DAU_HANG_DTQG) {
      this.listColTemp.forEach((e) => {
        let objTrongD = {
          id: e.id,
          maVtu: e.maVtu,
          loaiMatHang: '0',
          colName: null,
          sl: 0,
          col: e.col,
        };
        let objLke = {
          id: e.id,
          maVtu: e.maVtu,
          loaiMatHang: '1',
          colName: null,
          sl: 0,
          col: e.col,
        };
        listVtu.push(objTrongD);
        listVtu.push(objLke);
      });
      loai = 9;
    }
    // them moi phan tu
    if (initItem.id) {
      let item: ItemDataMau04a1 = {
        ...initItem,
        stt: this.lstCTietBaoCaoTemp[index].stt + ".1",
        listCtiet: listVtu,
        maLoai: loai,
      }
      this.lstCTietBaoCaoTemp.splice(index + 1, 0, item);
      this.editCache[item.id] = {
        edit: false,
        data: { ...item }
      };
    } else {
      let item: ItemDataMau04a1 = {
        ...initItem,
        id: uuid.v4() + 'FE',
        listKhoanMuc: this.listKhoanMuc.filter(e => e.idCha == Number(this.lstCTietBaoCaoTemp[index].maNdungChi)),
        stt: this.lstCTietBaoCaoTemp[index].stt + ".1",
        listCtiet: listVtu,
        maLoai: loai,
      }
      this.lstCTietBaoCaoTemp.splice(index + 1, 0, item);

      this.editCache[item.id] = {
        edit: true,
        data: { ...item }
      };
    }
    //   let item: ItemDataMau04a1 = {
    //     id: uuid.v4()+'FE',
    //     stt: this.lstCTietBaoCaoTemp[index].stt + ".1",
    //     listKhoanMuc:this.listKhoanMuc.filter(e => e.idCha == Number(this.lstCTietBaoCaoTemp[index].maNdungChi)),
    //     maNdungChi:'',
    //     maNdungChiParent: '',
    //     trongDotTcong: 0,
    //     trongDotThoc: 0,
    //     trongDotGao: 0,
    //     luyKeTcong: 0,
    //     luyKeThoc: 0,
    //     luyKeGao: 0,
    //     listCtiet:listVtu,
    //     parentId: null,
    //     ghiChu: '',
    //     maLoai: loai,
    //     checked: false,
    // }
    //   this.lstCTietBaoCaoTemp.splice(index + 1, 0, item);

    //   this.editCache[item.id] = {
    //       edit: true,
    //       data: { ...item }
    //   };
  }

  //xóa dòng
  deleteLine(id: any) {
    var index: number = this.lstCTietBaoCaoTemp.findIndex(e => e.id === id); // vi tri hien tai
    var nho: string = this.lstCTietBaoCaoTemp[index].stt;
    var head: string = this.getHead(this.lstCTietBaoCaoTemp[index].stt); // lay phan dau cua so tt
    if (this.tabSelected == BAO_CAO_CHI_TIET_THUC_HIEN_PHI_XUAT_HANG_DTQG) {

      this.lstCTietBaoCaoTemp.forEach(e => {
        if (e.stt.startsWith(nho)) {
          if (id?.length == 36) {
            this.lstIdDeleteMau04ax += e.id + ',';
          }
        }
      })
      let objectDele = {
        maLoai: BAO_CAO_CHI_TIET_THUC_HIEN_PHI_XUAT_HANG_DTQG,
        lstIdDelete: this.lstIdDeleteMau04ax
      }

      this.lstDeleteCTietBCao.push(objectDele);
    } else if (this.tabSelected == BAO_CAO_CHI_TIET_THUC_HIEN_PHI_NhAP_HANG_DTQG) {

      this.lstCTietBaoCaoTemp.forEach(e => {
        if (e.stt.startsWith(nho)) {
          if (id?.length == 36) {
            this.lstIdDeleteMau04an += e.id + ',';
          }
        }
      })
      let objectDele = {
        maLoai: BAO_CAO_CHI_TIET_THUC_HIEN_PHI_NhAP_HANG_DTQG,
        lstIdDelete: this.lstIdDeleteMau04an
      }

      this.lstDeleteCTietBCao.push(objectDele);
    } else if (this.tabSelected == BAO_CAO_CHI_TIET_THUC_HIEN_PHI_XUAT_HANG_CUU_TRO_VIEN_TRO) {

      this.lstCTietBaoCaoTemp.forEach(e => {
        if (e.stt.startsWith(nho)) {
          if (id?.length == 36) {
            this.lstIdDeleteMau04bx += e.id + ',';
          }
        }
      })
      let objectDele = {
        maLoai: BAO_CAO_CHI_TIET_THUC_HIEN_PHI_XUAT_HANG_CUU_TRO_VIEN_TRO,
        lstIdDelete: this.lstIdDeleteMau04bx
      }

      this.lstDeleteCTietBCao.push(objectDele);
    } else if (this.tabSelected == KHAI_THAC_BAO_CAO_CHI_TIET_THUC_HIEN_PHI_BAO_QUAN_LAN_DAU_HANG_DTQG) {

      this.lstCTietBaoCaoTemp.forEach(e => {
        if (e.stt.startsWith(nho)) {
          if (id?.length == 36) {
            this.lstIdDeleteMau05 += e.id + ',';
          }
        }
      })
      let objectDele = {
        maLoai: KHAI_THAC_BAO_CAO_CHI_TIET_THUC_HIEN_PHI_BAO_QUAN_LAN_DAU_HANG_DTQG,
        lstIdDelete: this.lstIdDeleteMau05
      }

      this.lstDeleteCTietBCao.push(objectDele);
    }

    //xóa phần tử và con của nó
    this.lstCTietBaoCaoTemp = this.lstCTietBaoCaoTemp.filter(e => !e.stt.startsWith(nho));
    //update lại số thức tự cho các phần tử cần thiết
    let lstIndex: number[] = [];
    for (var i = this.lstCTietBaoCaoTemp.length - 1; i >= index; i--) {
      if (this.getHead(this.lstCTietBaoCaoTemp[i].stt) == head) {
        lstIndex.push(i);
      }
    }

    this.replaceIndex(lstIndex, -1);
    //save list lại cho bao cao
    this.baoCao?.lstBcaos.forEach(item => {
      if (item.maLoai == this.tabSelected) {
        item.lstCtietBcaos = this.lstCTietBaoCaoTemp;
      }
    });
    this.updateEditCache();
  }

  // start edit
  startEdit(id: string): void {
    this.editCache[id].edit = true;
  }

  // huy thay doi
  cancelEdit(id: string): void {
    const index = this.lstCTietBaoCaoTemp.findIndex(item => item.id === id);
    if (!this.lstCTietBaoCaoTemp[index].maNdungChi) {
      this.deleteLine(id);
      return;
    }
    // lay vi tri hang minh sua
    this.editCache[id] = {
      data: { ...this.lstCTietBaoCaoTemp[index] },
      edit: false
    };
  }

  // luu thay doi
  saveEdit(id: string): void {
    this.editCache[id].data.checked = this.lstCTietBaoCaoTemp.find(item => item.id === id).checked; // set checked editCache = checked lstCtietBcaos
    if (this.listKhoanMuc.findIndex(e => e.idCha == this.editCache[id].data.maNdungChi) != -1) {
      this.editCache[id].data.status = true;
    }
    const index = this.lstCTietBaoCaoTemp.findIndex(item => item.id === id); // lay vi tri hang minh sua
    Object.assign(this.lstCTietBaoCaoTemp[index], this.editCache[id].data); // set lai data cua lstCtietBcaos[index] = this.editCache[id].data
    this.editCache[id].edit = false; // CHUYEN VE DANG TEXT
    this.updateEditCache();
  }

  updateChecked(id: any) {
    var data: ItemDataMau04a1 = this.lstCTietBaoCaoTemp.find(e => e.id === id);
    //đặt các phần tử con có cùng trạng thái với nó
    this.lstCTietBaoCaoTemp.forEach(item => {
      if (item.stt.startsWith(data.stt)) {
        item.checked = data.checked;
      }
    })
    //thay đổi các phần tử cha cho phù hợp với tháy đổi của phần tử con
    var index: number = this.lstCTietBaoCaoTemp.findIndex(e => e.stt == this.getHead(data.stt));
    if (index == -1) {
      this.allChecked = this.checkAllChild('0');
    } else {
      var nho: boolean = this.lstCTietBaoCaoTemp[index].checked;
      while (nho != this.checkAllChild(this.lstCTietBaoCaoTemp[index].stt)) {
        this.lstCTietBaoCaoTemp[index].checked = !nho;
        index = this.lstCTietBaoCaoTemp.findIndex(e => e.stt == this.getHead(this.lstCTietBaoCaoTemp[index].stt));
        if (index == -1) {
          this.allChecked = !nho;
          break;
        }
        nho = this.lstCTietBaoCaoTemp[index].checked;
      }
    }
  }

  //kiểm tra các phần tử con có cùng được đánh dấu hay ko
  checkAllChild(str: string): boolean {
    var nho: boolean = true;
    this.lstCTietBaoCaoTemp.forEach(item => {
      if ((this.getHead(item.stt) == str) && (!item.checked) && (item.stt != str)) {
        nho = item.checked;
      }
    })
    return nho;
  }


  updateAllChecked() {
    this.lstCTietBaoCaoTemp.forEach(item => {
      item.checked = this.allChecked1;
    })
  }

  deleteAllChecked() {
    var lstId: any[] = [];
    this.lstCTietBaoCaoTemp.forEach(item => {
      if (item.checked) {
        lstId.push(item.id);
      }
    })
    lstId.forEach(item => {
      if (this.lstCTietBaoCaoTemp.findIndex(e => e.id == item) != -1) {
        this.deleteLine(item);
      }
    })
    this.allChecked1 = false;
  }

  //thêm phần tử đầu tiên khi bảng rỗng
  addFirst(initItem: ItemDataMau04a1) {
    var listVtu: vatTu[] = [];
    var loai: number = 0;
    if (this.tabSelected == BAO_CAO_CHI_TIET_THUC_HIEN_PHI_XUAT_HANG_DTQG) {
      this.listColTemp.forEach((e) => {
        let objTrongD = {
          id: e.id,
          maVtu: e.maVtu,
          loaiMatHang: '0',
          colName: null,
          sl: 0,
          col: e.col,
        };
        let objLke = {
          id: e.id,
          maVtu: e.maVtu,
          loaiMatHang: '1',
          colName: null,
          sl: 0,
          col: e.col,
        };
        listVtu.push(objTrongD);
        listVtu.push(objLke);
      });
      loai = 6;
    } else if (this.tabSelected == BAO_CAO_CHI_TIET_THUC_HIEN_PHI_NhAP_HANG_DTQG) {
      this.listColTemp.forEach((e) => {
        let objTrongD = {
          id: e.id,
          maVtu: e.maVtu,
          loaiMatHang: '0',
          colName: null,
          sl: 0,
          col: e.col,
        };
        let objLke = {
          id: e.id,
          maVtu: e.maVtu,
          loaiMatHang: '1',
          colName: null,
          sl: 0,
          col: e.col,
        };
        listVtu.push(objTrongD);
        listVtu.push(objLke);
      });
      loai = 7;
    } else if (this.tabSelected == BAO_CAO_CHI_TIET_THUC_HIEN_PHI_XUAT_HANG_CUU_TRO_VIEN_TRO) {
      this.listColTemp.forEach((e) => {
        let objTrongD = {
          id: e.id,
          maVtu: e.maVtu,
          loaiMatHang: '0',
          colName: null,
          sl: 0,
          col: e.col,
        };
        let objLke = {
          id: e.id,
          maVtu: e.maVtu,
          loaiMatHang: '1',
          colName: null,
          sl: 0,
          col: e.col,
        };
        listVtu.push(objTrongD);
        listVtu.push(objLke);
      });
      loai = 8;
    } else if (this.tabSelected == KHAI_THAC_BAO_CAO_CHI_TIET_THUC_HIEN_PHI_BAO_QUAN_LAN_DAU_HANG_DTQG) {
      this.listColTemp.forEach((e) => {
        let objTrongD = {
          id: e.id,
          maVtu: e.maVtu,
          loaiMatHang: '0',
          colName: null,
          sl: 0,
          col: e.col,
        };
        let objLke = {
          id: e.id,
          maVtu: e.maVtu,
          loaiMatHang: '1',
          colName: null,
          sl: 0,
          col: e.col,
        };
        listVtu.push(objTrongD);
        listVtu.push(objLke);
      });
      loai = 9;
    }
    if (initItem.id) {
      let item: ItemDataMau04a1 = {
        ...initItem,
        stt: "0.1",
        listCtiet: listVtu,
        maLoai: loai,
      }
      this.lstCTietBaoCaoTemp.push(item);
      this.editCache[item.id] = {
        edit: false,
        data: { ...item }
      };
    } else {
      let item: ItemDataMau04a1 = {
        id: uuid.v4() + 'FE',
        stt: "0.1",
        listKhoanMuc: this.listKhoanMuc.filter(e => e.idCha == 0),
        maNdungChi: '',
        maNdungChiParent: '',
        trongDotTcong: 0,
        trongDotThoc: 0,
        trongDotGao: 0,
        luyKeTcong: 0,
        luyKeThoc: 0,
        luyKeGao: 0,
        listCtiet: listVtu,
        parentId: '',
        ghiChu: '',
        maLoai: loai,
        checked: false,
        status: false,
      }
      this.lstCTietBaoCaoTemp.push(item);

      this.editCache[item.id] = {
        edit: true,
        data: { ...item }
      };
    }
  }

  sortByIndex() {

    this.lstCTietBaoCaoTemp.forEach(item => {
      this.setDetail(item.id);
    })
    this.lstCTietBaoCaoTemp.sort((item1, item2) => {
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
    this.lstCTietBaoCaoTemp.forEach(item => {
      var index: number = lstTemp.findIndex(e => e.stt == this.getHead(item.stt));
      if (index == -1) {
        lstTemp.splice(0, 0, item);
      } else {
        lstTemp.splice(index + 1, 0, item);
      }
    })

    this.lstCTietBaoCaoTemp = lstTemp;
  }

  setDetail(id: any) {
    var index: number = this.lstCTietBaoCaoTemp.findIndex(item => item.id === id);
    var parentId: number = this.listKhoanMuc.find(e => e.id == this.lstCTietBaoCaoTemp[index].maNdungChi)?.idCha;

    this.lstCTietBaoCaoTemp[index].lstKm = this.listKhoanMuc.filter(e => e.idCha == parentId);
    if (this.listKhoanMuc.findIndex(e => e.idCha === this.lstCTietBaoCaoTemp[index].maNdungChi) == -1) {
      this.lstCTietBaoCaoTemp[index].status = false;
    } else {
      this.lstCTietBaoCaoTemp[index].status = true;
    }
  }

  sortWithoutIndex() {
    this.lstCTietBaoCaoTemp.forEach(item => {
      this.setDetail(item.id);
    })
    var level = 0;
    var lstCtietBcaoTemp: ItemDataMau04a1[] = this.lstCTietBaoCaoTemp;
    this.lstCTietBaoCaoTemp = [];
    var data: ItemDataMau04a1 = lstCtietBcaoTemp.find(e => e.listKhoanMuc[0].level == 0);
    this.addFirst(data);
    lstCtietBcaoTemp = lstCtietBcaoTemp.filter(e => e.id != data.id);
    var lstTemp: ItemDataMau04a1[] = lstCtietBcaoTemp.filter(e => e.listKhoanMuc[0].level == level);
    while (lstTemp.length != 0 || level == 0) {
      lstTemp.forEach(item => {
        var index: number = this.lstCTietBaoCaoTemp.findIndex(e => e.maNdungChi === item.listKhoanMuc[0].idCha);
        if (index != -1) {
          this.addLow(this.lstCTietBaoCaoTemp[index].id, item);
        } else {
          index = this.lstCTietBaoCaoTemp.findIndex(e => e.lstKm[0].idCha === item.listKhoanMuc[0].idCha);
          this.addSame(this.lstCTietBaoCaoTemp[index].id, item);
        }
      })
      level += 1;
      lstTemp = lstCtietBcaoTemp.filter(e => e.listKhoanMuc[0].level == level);
    }
  }

  close() {
    this.location.back();
  }

  doPrint() {

  }
}
