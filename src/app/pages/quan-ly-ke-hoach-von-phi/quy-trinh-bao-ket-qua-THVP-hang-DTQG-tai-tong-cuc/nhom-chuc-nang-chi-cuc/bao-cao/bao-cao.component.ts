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
import { BAO_CAO_CHI_TIET_THUC_HIEN_PHI_NhAP_HANG_DTQG, BAO_CAO_CHI_TIET_THUC_HIEN_PHI_XUAT_HANG_CUU_TRO_VIEN_TRO, BAO_CAO_CHI_TIET_THUC_HIEN_PHI_XUAT_HANG_DTQG, BAO_CAO_NHAP_HANG_DTQG, BAO_CAO_XUAT_HANG_DTQG, KHAI_THAC_BAO_CAO_CHI_TIET_THUC_HIEN_PHI_BAO_QUAN_LAN_DAU_HANG_DTQG, KHOAN_MUC, LISTBIEUMAUDOT, LISTBIEUMAUNAM, NOI_DUNG, NOI_DUNG_PL2, SOLAMA, TAB_SELECTED } from './bao-cao.constant';
import * as fileSaver from 'file-saver';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { DialogCopyComponent } from 'src/app/components/dialog/dialog-copy/dialog-copy.component';
import { DialogBaoCaoCopyComponent } from 'src/app/components/dialog/dialog-bao-cao-copy/dialog-bao-cao-copy.component';
import { DialogThemKhoanMucComponent } from 'src/app/components/dialog/dialog-them-khoan-muc/dialog-them-khoan-muc.component';
import { DialogLuaChonThemDonViComponent } from 'src/app/components/dialog/dialog-lua-chon-them-don-vi/dialog-lua-chon-them-don-vi.component';

export class ItemDanhSach {
  id!: any;
  maBcao!: string;
  namBcao!: number;
  dotBcao!: number;
  thangBcao!: number;
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
  stt!: string;
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
  bcaoId!: string;
  tuNgay: string;
  denNgay: string;
}

export class ItemDataMau02 {
  id = null;
  header = null;
  stt = '0';
  checked = false;
  lstKm: any[] = [];
  level = 0;
  maVtu = null;
  maDviTinh = null;
  soQd = null;
  khSoLuong = 0;
  khGiaMuaTd = 0;
  khTtien = 0;
  thSoLuong = 0;
  thGiaMuaTd = 0;
  thTtien = 0;
  ghiChu = null;

}

export class ItemDataMau03 {
  id = null;
  header = null;
  stt = '0';
  checked = false;
  lstKm: any[] = [];
  level = 0;

  maVtu = null;
  maDviTinh = null;
  soLuongKhoach = 0;
  soLuongTte = 0;
  dgGiaKhoach = 0;
  dgGiaBanTthieu = 0;
  dgGiaBanTte = 0;
  ttGiaHtoan = 0;
  ttGiaBanTte = 0;
  ttClechGiaTteVaGiaHtoan = 0;
  ghiChu = null;

}


export class ItemDataMau0405 {
  id = null;
  header = null;
  stt = '0';
  checked = false;
  lstKm: any[] = [];
  level = 0;

  maNdungChi = null;
  trongDotTcong = 0;
  trongDotThoc = 0;
  trongDotGao = 0;
  luyKeTcong = 0;
  luyKeThoc = 0;
  luyKeGao = 0;
  listCtiet: vatTu[] = [];
  ghiChu = null;
  maNdungChiCha = null;
}

export class vatTu {
  id: number;
  maVtu: any;
  loaiMatHang: any;
  sl: any;
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
  tuNgay: any;
  denNgay: any;


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
  lstCtietBcao04ax: ItemDataMau0405[] = [];
  lstCtietBcao04an: ItemDataMau0405[] = [];
  lstCtietBcao04bx: ItemDataMau0405[] = [];
  lstCtietBcao05: ItemDataMau0405[] = [];
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
  lstKm: any[] = KHOAN_MUC;
  lstIdDeleteMau04ax: string = '';
  lstIdDeleteMau04an: string = '';
  lstIdDeleteMau04bx: string = '';
  lstIdDeleteMau05: string = '';
  nguoiBcaos: any[] = LISTCANBO;
  lstVatTuFull = [];
  vatTusBC02 = NOI_DUNG;
  vatTusBC03 = NOI_DUNG;
  noiDungChisBC04 = NOI_DUNG;
  noiDungChisBC05 = NOI_DUNG;
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
              bcaoId: this.id,
              tuNgay: '',
              denNgay: '',
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
              bcaoId: this.id,
              tuNgay: '',
              denNgay: '',
            }
          )
        })
      }
    }
    //lấy danh sách vật tư
    await this.danhMucService.dMVatTu().toPromise().then(res => {
      if (res.statusCode == 0) {
        this.listVattu = res.data;
      } else {
        this.notification.error(MESSAGE.ERROR, res?.msg);
      }
    }, err => {
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    })
    this.addListVatTu(this.listVattu);
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

  addListVatTu(listVattu) {
    listVattu.forEach(item => {
      this.lstVatTuFull.push(item);
      if (item.child) {
        this.addListVatTu(item.child);
      }
    });
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
              item?.lstCtietBcaos.filter(el => {
                el.khTtien = divMoney(el.khTtien, item.maDviTien);
                el.khGiaMuaTd = divMoney(el.khGiaMuaTd, item.maDviTien);
                el.thTtien = divMoney(el.thTtien, item.maDviTien);
                el.thGiaMuaTd = divMoney(el.thGiaMuaTd, item.maDviTien);
              })
              break;
            // bm 03

            case BAO_CAO_XUAT_HANG_DTQG:
              item?.lstCtietBcaos.filter(el => {
                el.dgGiaKhoach = divMoney(el.dgGiaKhoach, item.maDviTien);
                el.dgGiaBanTthieu = divMoney(el.dgGiaBanTthieu, item.maDviTien);
                el.dgGiaBanTte = divMoney(el.dgGiaBanTte, item.maDviTien);
                el.ttGiaHtoan = divMoney(el.ttGiaHtoan, item.maDviTien);
                el.ttGiaBanTte = divMoney(el.ttGiaBanTte, item.maDviTien);
                el.ttClechGiaTteVaGiaHtoan = divMoney(el.ttClechGiaTteVaGiaHtoan, item.maDviTien);
              })
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
  async onSubmit(mcn: string, lyDoTuChoi: string) {
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

  async changeTab(maPhuLuc, trangThaiChiTiet) {
    let checkSaveEdit;
    await this.saveMau02();
    await this.saveMau03();
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
          item.maDviTien = this.maDviTien, item.thuyetMinh = this.thuyetMinh, item.lstIdDeletes = this.listIdDelete, item.tuNgay = this.datePipe.transform(this.tuNgay, 'yyyy-MM-dd'), item.denNgay = this.denNgay
      }
    });
    this.tabSelected = maPhuLuc;
    // set listBCaoTemp theo ma phu luc vua chon
    let lstBcaosTemp = this.baoCao?.lstBcaos.find(item => item.maLoai == maPhuLuc);
    this.lstCTietBaoCaoTemp = lstBcaosTemp?.lstCtietBcaos || [];
    this.maDviTien = lstBcaosTemp?.maDviTien;
    this.thuyetMinh = lstBcaosTemp?.thuyetMinh;
    this.tuNgay = lstBcaosTemp?.tuNgay;
    this.denNgay = lstBcaosTemp?.denNgay;
    this.trangThaiChiTiet = trangThaiChiTiet;
    ////////////////////////////////////////
    this.resetList();
    // tinh toan tien va tach bao cao ra cac bao cao nho
    switch (maPhuLuc) {
      // bm 02
      case BAO_CAO_NHAP_HANG_DTQG:
        this.lstCTietBaoCaoTemp?.filter(data => {
          if (data.header == '21') {
            this.lstCtietBcao021.push(data);
          } else if (data.header == '22') {
            this.lstCtietBcao022.push(data);
          }
        });
        break;
      // bm 03
      case BAO_CAO_XUAT_HANG_DTQG:
        this.lstCTietBaoCaoTemp?.filter(data => {
          if (data.header == '31') {
            this.lstCtietBcao031.push(data);
          } else if (data.header == '32') {
            this.lstCtietBcao032.push(data);
          } else if (data.header == '33') {
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
              this.lstVatTuFull.forEach((vt) => {
                if (vt.id == el.maVtu) {
                  let objTrongdot = {
                    id: el.id,
                    maVtu: vt.id,
                    loaiMatHang: el.loaiMatHang,
                    sl: el.sl,
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
              this.lstVatTuFull.forEach((vt) => {
                if (vt.id == el.maVtu) {
                  let objTrongdot = {
                    id: el.id,
                    maVtu: vt.id,
                    loaiMatHang: el.loaiMatHang,
                    sl: el.sl,
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
              this.lstVatTuFull.forEach((vt) => {
                if (vt.id == el.maVtu) {
                  let objTrongdot = {
                    id: el.id,
                    maVtu: vt.id,
                    loaiMatHang: el.loaiMatHang,
                    sl: el.sl,
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
              this.lstVatTuFull.forEach((vt) => {
                if (vt.id == el.maVtu) {
                  let objTrongdot = {
                    id: el.id,
                    maVtu: vt.id,
                    loaiMatHang: el.loaiMatHang,
                    sl: el.sl,
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
    //this.updateEditCache02();
    let idPhuLuc = LISTBIEUMAUDOT.find(item => item.maPhuLuc == this.tabSelected)?.lstId;
    idPhuLuc.forEach(phuLuc => {
      this.updateEditCache(phuLuc);
    })
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
              bcaoId: this.id,
              tuNgay: '',
              denNgay: '',
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
    await this.saveMau02();
    await this.saveMau03();
    let baoCaoChiTiet = this.baoCao?.lstBcaos.find(item => item.maLoai == this.tabSelected);
    let baoCaoChiTietTemp = JSON.parse(JSON.stringify(baoCaoChiTiet));

    baoCaoChiTietTemp.lstCtietBcaos = JSON.parse(JSON.stringify(this.lstCTietBaoCaoTemp));
    baoCaoChiTietTemp.maDviTien = this.maDviTien;
    baoCaoChiTietTemp.thuyetMinh = this.thuyetMinh;
    baoCaoChiTietTemp.tuNgay = this.tuNgay;
    baoCaoChiTietTemp.denNgay = this.denNgay;
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
    this.baoCao?.lstBcaos.find(item => {
      if (item.maLoai == this.tabSelected) {
        item.lstCtietBcaos = Object.assign([], this.lstCTietBaoCaoTemp),
          item.maDviTien = this.maDviTien, item.thuyetMinh = this.thuyetMinh, item.lstIdDeletes = this.listIdDelete,
          item.tuNgay = this.tuNgay, item.denNgay = this.denNgay
      }
    });
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
            item.bcaoId = null;
            item.thuyetMinh = null;
            item.tuNgay = '';
            item.denNgay = '';
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


  doShowDialogCopy() {
    const modalTuChoi = this.modal.create({
      nzTitle: 'Copy Báo Cáo',
      nzContent: DialogBaoCaoCopyComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        maPhanBcao: '1',
        maLoaiBcao: this.baoCao.maLoaiBcao,
        namBcao: this.baoCao.namBcao,
        dotBcao: this.baoCao.dotBcao,
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
    this.baoCao?.lstBcaos.find(item => {
      if (item.maLoai == this.tabSelected) {
        item.maDviTien = this.maDviTien, item.thuyetMinh = this.thuyetMinh, item.tuNgay = this.tuNgay, item.denNgay = this.denNgay
      }
    });
    let baoCaoTemp = JSON.parse(JSON.stringify(this.baoCao));
    baoCaoTemp.congVan = null;
    // set nambao,dot bao cao tu dialog gui ve
    baoCaoTemp.namBcao = response.namBcao;
    baoCaoTemp.dotBcao = response.dotBcao;
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
            data?.listCtiet.filter(el => el.id = null);
            break;

          // 04a/BCPN-X_n
          case BAO_CAO_CHI_TIET_THUC_HIEN_PHI_NhAP_HANG_DTQG:
            // nhan tien va validate
            data?.listCtiet.filter(el => el.id = null);
            break;

          // 04b/BCPN-X
          case BAO_CAO_CHI_TIET_THUC_HIEN_PHI_XUAT_HANG_CUU_TRO_VIEN_TRO:
            // nhan tien va validate
            data?.listCtiet.filter(el => el.id = null);
            break;

          // 05/BCPBQ
          case KHAI_THAC_BAO_CAO_CHI_TIET_THUC_HIEN_PHI_BAO_QUAN_LAN_DAU_HANG_DTQG:
            // nhan tien va validate
            data?.listCtiet.filter(el => el.id = null);
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

  // // nhóm chúc năng biểu mẫu 02 -------------------------------------------
  // //check all input
  // updateAllChecked02(): void {
  //   this.indeterminate02 = false;
  //   this.lstCtietBcao021 = this.lstCtietBcao021.map((item) => ({
  //     ...item,
  //     checked: this.allChecked02,
  //   }));
  //   this.lstCtietBcao022 = this.lstCtietBcao022.map((item) => ({
  //     ...item,
  //     checked: this.allChecked02,
  //   }));
  // }


  // // xoa dong
  // deleteById02(id: any, loaiList: any): void {
  //   if (loaiList == '21') {
  //     this.lstCtietBcao021 = this.lstCtietBcao021.filter((item) => item?.id != id);
  //   } else if (loaiList == '22') {
  //     this.lstCtietBcao022 = this.lstCtietBcao022.filter((item) => item?.id != id);
  //   }
  // }

  // //chọn row cần sửa 
  // startEdit02(id: string, loaiList: any): void {
  //   this.editCache[id].edit = true;
  // }


  // //checkox trên tùng row
  // updateSingleChecked02(): void {
  //   if ((this.lstCtietBcao021.every((item) => !item.checked)) && (this.lstCtietBcao022.every((item) => !item.checked))) {
  //     this.allChecked02 = false;
  //     this.indeterminate02 = true;
  //   } else if ((this.lstCtietBcao021.every((item) => item.checked)) && (this.lstCtietBcao022.every((item) => item.checked))) {
  //     this.allChecked02 = true;
  //     this.indeterminate02 = false;
  //   } else {
  //     this.indeterminate02 = true;
  //   }
  // }

  //tinh toan tong so
  changeModel02(id: string, loaiList: any) {
    this.editCache[id].data.khTtien = Number(this.editCache[id].data.khSoLuong) * Number(this.editCache[id].data.khGiaMuaTd);
    this.editCache[id].data.thTtien = Number(this.editCache[id].data.thSoLuong) * Number(this.editCache[id].data.thGiaMuaTd);
  }

  // //update khi sửa
  // saveEdit02(id: string, loaiList: any): void {
  //   if (!this.editCache[id].data.maVtu) {
  //     this.notification.warning(MESSAGE.WARNING, MESSAGE.FINISH_FORM);
  //     return;
  //   }
  //   if (loaiList == '21') {
  //     this.editCache[id].data.checked = this.lstCtietBcao021.find((item) => item.id === id).checked; // set checked editCache = checked lstCtietBcaos
  //     const index = this.lstCtietBcao021.findIndex((item) => item.id === id); // lay vi tri hang minh sua
  //     Object.assign(this.lstCtietBcao021[index], this.editCache[id].data); // set lai data cua lstCtietBcaos[index] = this.editCache[id].data
  //     this.editCache[id].edit = false; // CHUYEN VE DANG TEXT
  //   } else if (loaiList == '22') {
  //     this.editCache[id].data.checked = this.lstCtietBcao022.find((item) => item.id === id).checked; // set checked editCache = checked lstCtietBcaos
  //     const index = this.lstCtietBcao022.findIndex((item) => item.id === id); // lay vi tri hang minh sua
  //     Object.assign(this.lstCtietBcao022[index], this.editCache[id].data); // set lai data cua lstCtietBcaos[index] = this.editCache[id].data
  //     this.editCache[id].edit = false; // CHUYEN VE DANG TEXT
  //   }
  // }

  // //hủy thao tác sửa update lại giá trị ban đầu
  // cancelEdit02(id: string, loaiList: any): void {
  //   if (loaiList == '21') {
  //     const index = this.lstCtietBcao021.findIndex((item) => item.id === id); // lay vi tri hang minh sua
  //     // xoa dong neu truoc do chua co du lieu
  //     if (!this.lstCtietBcao021[index].maVtu) {
  //       this.deleteById02(id, loaiList);
  //       return;
  //     }
  //     this.editCache[id] = {
  //       data: { ...this.lstCtietBcao021[index] },
  //       edit: false,
  //     };
  //   } else if (loaiList == '22') {
  //     const index = this.lstCtietBcao022.findIndex((item) => item.id === id); // lay vi tri hang minh sua
  //     // xoa dong neu truoc do chua co du lieu
  //     if (!this.lstCtietBcao022[index].maVtu) {
  //       this.deleteById02(id, loaiList);
  //       return;
  //     }
  //     this.editCache[id] = {
  //       data: { ...this.lstCtietBcao022[index] },
  //       edit: false,
  //     };
  //   }
  // }

  // updateEditCache02(): void {
  //   this.lstCtietBcao021.forEach((item) => {
  //     this.editCache[item.id] = {
  //       edit: false,
  //       data: { ...item },
  //     };
  //   });
  //   this.lstCtietBcao022.forEach((item) => {
  //     this.editCache[item.id] = {
  //       edit: false,
  //       data: { ...item },
  //     };
  //   });
  // }

  // // xóa với checkbox
  // deleteSelected02() {
  //   // delete object have checked = true
  //   this.lstCtietBcao021 = this.lstCtietBcao021.filter(
  //     (item) => item.checked != true,
  //   );
  //   this.lstCtietBcao022 = this.lstCtietBcao022.filter(
  //     (item) => item.checked != true,
  //   );
  //   this.allChecked02 = false;
  // }


  //tinh tong
  changeModel03(id: any, loaiList: any) {
    this.editCache[id].data.ttGiaHtoan = Number(this.editCache[id].data.soLuongTte) * Number(this.editCache[id].data.dgGiaKhoach);
    this.editCache[id].data.ttGiaBanTte = Number(this.editCache[id].data.soLuongTte) * Number(this.editCache[id].data.dgGiaBanTte);
    this.editCache[id].data.ttClechGiaTteVaGiaHtoan = Number(this.editCache[id].data.ttGiaBanTte) - Number(this.editCache[id].data.ttGiaHtoan);
  }

  async saveMau02() {
    if (this.tabSelected == BAO_CAO_NHAP_HANG_DTQG) {
      this.lstCTietBaoCaoTemp = [];
      await this.lstCtietBcao021.forEach(e => {
        this.lstCTietBaoCaoTemp.push(e);
      })
      await this.lstCtietBcao022.forEach(e => {
        this.lstCTietBaoCaoTemp.push(e);
      })
    }
  }

  async saveMau03() {
    if (this.tabSelected == BAO_CAO_XUAT_HANG_DTQG) {
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
  }

  addAllCol() {
    let lstDviChon = this.lstVatTuFull.filter(item => this.listColTemp?.findIndex(data => data.maVtu == item.id) == -1);
    const modalIn = this.modal.create({
      nzTitle: 'Danh sách vật tư',
      nzContent: DialogLuaChonThemDonViComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '65%',
      nzFooter: null,
      nzComponentParams: {
        danhSachDonVi: lstDviChon
      },
    });
    modalIn.afterClose.subscribe((res) => {
      if (res) {
        res.forEach(async item => {
      
          await this.addCol(item);
        })
        // this.lstCtietBcao.forEach(item => {
        //   this.total(item.id);
        // })
        // 
      }
      let idPhuLuc = LISTBIEUMAUDOT.find(item => item.maPhuLuc == this.tabSelected)?.lstId;
      idPhuLuc.forEach(phuLuc => {
        this.updateEditCache(phuLuc);
      })
    });
  }

  addCol(vatTu: any) {
    let objTrongD = {
      id: uuid.v4() + 'FE',
      maVtu: vatTu.id,
      colName: vatTu.ten,
      loaiMatHang: '0',
      sl: 0,
    }
    let objLke = {
      id: uuid.v4() + 'FE',
      maVtu: vatTu.id,
      colName: vatTu.ten,
      loaiMatHang: '1',
      sl: 0,
    }

    this.lstCTietBaoCaoTemp.forEach(data => {
      data.listCtiet.push(objTrongD);
      data.listCtiet.push(objLke);
    })
    this.listColTemp.push(objTrongD);
  }

  deleteCol(maVtu: string) {

    this.lstCTietBaoCaoTemp.forEach(data => {
      data.listCtiet = data.listCtiet.filter(e => e.maVtu != maVtu);
    })
    this.listColTemp = this.listColTemp.filter(e => e.maVtu != maVtu);
    // this.lstCtietBcao.forEach(item => {
    //     this.total(item.id);
    // })
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

  // sortWithoutIndex() {
  //   this.lstCTietBaoCaoTemp.forEach(item => {
  //     this.setDetail(item.id);
  //   })
  //   var level = 0;
  //   var lstCtietBcaoTemp: ItemDataMau04a1[] = this.lstCTietBaoCaoTemp;
  //   this.lstCTietBaoCaoTemp = [];
  //   var data: ItemDataMau04a1 = lstCtietBcaoTemp.find(e => e.lstKm[0].level == 0);
  //   this.addFirst(data);
  //   lstCtietBcaoTemp = lstCtietBcaoTemp.filter(e => e.id != data.id);
  //   var lstTemp: ItemDataMau04a1[] = lstCtietBcaoTemp.filter(e => e.lstKm[0].level == level);
  //   while (lstTemp.length != 0 || level == 0) {
  //     lstTemp.forEach(item => {
  //       var index: number = this.lstCTietBaoCaoTemp.findIndex(e => e.maNdungChi === item.lstKm[0].idCha);
  //       if (index != -1) {
  //         this.addLow(this.lstCTietBaoCaoTemp[index].id, item);
  //       } else {
  //         index = this.lstCTietBaoCaoTemp.findIndex(e => e.lstKm[0].idCha === item.lstKm[0].idCha);
  //         this.addSame(this.lstCTietBaoCaoTemp[index].id, item);
  //       }
  //     })
  //     level += 1;
  //     lstTemp = lstCtietBcaoTemp.filter(e => e.lstKm[0].level == level);
  //   }
  // }

  close() {
    this.location.back();
  }

  doPrint() {

  }

  //hixhix///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
  findVt(str: string, phuLuc): number {
    let hunghixhix = this.getBieuMau(phuLuc)
    var start: number = hunghixhix.findIndex(e => e.stt == str);
    var index: number = start;
    for (var i = start + 1; i < hunghixhix.length; i++) {
      if (hunghixhix[i].stt.startsWith(str)) {
        index = i;
      }
    }
    return index;
  }
  //thay thế các stt khi danh sách được cập nhật, heSo=1 tức là tăng stt lên 1, heso=-1 là giảm stt đi 1
  replaceIndex(lstIndex: number[], heSo: number, phuLuc: string) {
    let hunghixhix = this.getBieuMau(phuLuc);
    //thay doi lai stt cac vi tri vua tim duoc
    lstIndex.forEach(item => {
      var str = this.getHead(hunghixhix[item].stt) + "." + (this.getTail(hunghixhix[item].stt) + heSo).toString();
      var nho = hunghixhix[item].stt;
      hunghixhix.forEach(item => {
        item.stt = item.stt.replace(nho, str);
      })
    })
  }

  addLine(id: any, phuLuc) {
    let hunghixhix = this.getBieuMau(phuLuc);
    let dataPL;                 // du lieu default phu luc
    let lstKmTemp;              // list khoan muc chinh
    var maKm;                   // ma khoan muc

    if (BAO_CAO_NHAP_HANG_DTQG == this.tabSelected) {
      dataPL = new ItemDataMau02();
      lstKmTemp = this.vatTusBC02;
      maKm = hunghixhix.find(e => e.id == id)?.maVtu;
    } else if (BAO_CAO_XUAT_HANG_DTQG == this.tabSelected) {
      dataPL = new ItemDataMau03();
      lstKmTemp = this.vatTusBC03;
      maKm = hunghixhix.find(e => e.id == id)?.maVtu;
    } else if (BAO_CAO_CHI_TIET_THUC_HIEN_PHI_XUAT_HANG_DTQG == this.tabSelected) {
      dataPL = new ItemDataMau0405();
      lstKmTemp = this.noiDungChisBC04;
      maKm = hunghixhix.find(e => e.id == id)?.maNdungChi;
    } else if (BAO_CAO_CHI_TIET_THUC_HIEN_PHI_NhAP_HANG_DTQG == this.tabSelected) {
      dataPL = new ItemDataMau0405();
      lstKmTemp = this.noiDungChisBC04;
      maKm = hunghixhix.find(e => e.id == id)?.maNdungChi;
    } else if (BAO_CAO_CHI_TIET_THUC_HIEN_PHI_XUAT_HANG_CUU_TRO_VIEN_TRO == this.tabSelected) {
      dataPL = new ItemDataMau0405();
      lstKmTemp = this.noiDungChisBC04;
      maKm = hunghixhix.find(e => e.id == id)?.maNdungChi;
    } else if (KHAI_THAC_BAO_CAO_CHI_TIET_THUC_HIEN_PHI_BAO_QUAN_LAN_DAU_HANG_DTQG == this.tabSelected) {
      dataPL = new ItemDataMau0405();
      lstKmTemp = this.noiDungChisBC05;
      maKm = hunghixhix.find(e => e.id == id)?.maNdungChi;
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
    modalIn.afterClose.subscribe((res) => {
      if (res) {
        var index: number;
        if (BAO_CAO_NHAP_HANG_DTQG == this.tabSelected || BAO_CAO_XUAT_HANG_DTQG == this.tabSelected) {
          index = hunghixhix.findIndex(e => e.maVtu == res.maKhoanMuc);
        } else if (BAO_CAO_CHI_TIET_THUC_HIEN_PHI_XUAT_HANG_DTQG == this.tabSelected || BAO_CAO_CHI_TIET_THUC_HIEN_PHI_NhAP_HANG_DTQG == this.tabSelected
          || BAO_CAO_CHI_TIET_THUC_HIEN_PHI_XUAT_HANG_CUU_TRO_VIEN_TRO == this.tabSelected
          || KHAI_THAC_BAO_CAO_CHI_TIET_THUC_HIEN_PHI_BAO_QUAN_LAN_DAU_HANG_DTQG == this.tabSelected) {
          index = hunghixhix.findIndex(e => e.maNdungChi == res.maKhoanMuc);
        }
    
        if (index == -1) {
          let data: any = {
            ...dataPL,
            maNdungChi: res.maKhoanMuc,
            maVtu: res.maKhoanMuc,
            level: lstKmTemp.find(e => e.id == maKm)?.level,
          };
          if (hunghixhix.length == 0) {
            this.addFirst(data, phuLuc);
          } else {
            this.addSame(id, data, phuLuc);
          }
        }
        if (BAO_CAO_NHAP_HANG_DTQG == this.tabSelected || BAO_CAO_XUAT_HANG_DTQG == this.tabSelected) {
          id = hunghixhix.find(e => e.maVtu == res.maKhoanMuc)?.id;
        } else if (BAO_CAO_CHI_TIET_THUC_HIEN_PHI_XUAT_HANG_DTQG == this.tabSelected || BAO_CAO_CHI_TIET_THUC_HIEN_PHI_NhAP_HANG_DTQG == this.tabSelected
          || BAO_CAO_CHI_TIET_THUC_HIEN_PHI_XUAT_HANG_CUU_TRO_VIEN_TRO == this.tabSelected
          || KHAI_THAC_BAO_CAO_CHI_TIET_THUC_HIEN_PHI_BAO_QUAN_LAN_DAU_HANG_DTQG == this.tabSelected) {
          id = hunghixhix.find(e => e.maNdungChi == res.maKhoanMuc)?.id;
        }
        res.lstKhoanMuc.forEach(item => {
          var data: any = {
            ...dataPL,
            maNdungChi: item.id,
            maVtu: item.id,
            level: item.level,
          };
          this.addLow(id, data, phuLuc);
        })
        this.updateEditCache(phuLuc);
      }
    });
  }

  //thêm ngang cấp
  addSame(id: any, initItem, phuLuc: string) {
    let hunghixhix = this.getBieuMau(phuLuc);
    var index: number = hunghixhix.findIndex(e => e.id == id); // vi tri hien tai
    var head: string = this.getHead(hunghixhix[index].stt); // lay phan dau cua so tt
    var tail: number = this.getTail(hunghixhix[index].stt); // lay phan duoi cua so tt
    var ind: number = this.findVt(hunghixhix[index].stt, phuLuc); // vi tri can duoc them
    // tim cac vi tri can thay doi lai stt
    let lstIndex: number[] = [];
    for (var i = hunghixhix.length - 1; i > ind; i--) {
      if (this.getHead(hunghixhix[i].stt) == head) {
        lstIndex.push(i);
      }
    }
    this.replaceIndex(lstIndex, 1, phuLuc);
    var listVtu: vatTu[] = [];
    if (this.tabSelected == BAO_CAO_CHI_TIET_THUC_HIEN_PHI_XUAT_HANG_DTQG || this.tabSelected == BAO_CAO_CHI_TIET_THUC_HIEN_PHI_NhAP_HANG_DTQG ||
      this.tabSelected == BAO_CAO_CHI_TIET_THUC_HIEN_PHI_XUAT_HANG_CUU_TRO_VIEN_TRO || this.tabSelected == KHAI_THAC_BAO_CAO_CHI_TIET_THUC_HIEN_PHI_BAO_QUAN_LAN_DAU_HANG_DTQG) {
      this.listColTemp.forEach((e) => {
        let objTrongD = {
          id: e.id,
          maVtu: e.maVtu,
          loaiMatHang: '0',
          sl: 0,
        };
        let objLke = {
          id: e.id,
          maVtu: e.maVtu,
          loaiMatHang: '1',
          sl: 0,
        };
        listVtu.push(objTrongD);
        listVtu.push(objLke);
      });
    }

    // them moi phan tu
    if (initItem?.id) {
      let item = {
        ...initItem,
        stt: head + "." + (tail + 1).toString(),
        maLoai: this.tabSelected,
        listCtiet: listVtu,
      }
      hunghixhix.splice(ind + 1, 0, item);
      this.editCache[item.id] = {
        edit: false,
        data: { ...item }
      };
    } else {
      let item = {
        ...initItem,
        id: uuid.v4() + "FE",
        stt: head + "." + (tail + 1).toString(),
        maLoai: this.tabSelected,
        listCtiet: listVtu,
        maNdungChiCha: Number(hunghixhix[index].maNdungChiCha),
      }
      hunghixhix.splice(ind + 1, 0, item);
      this.editCache[item.id] = {
        edit: true,
        data: { ...item }
      };
    }
  }

  // gan editCache.data == lstCtietBcao
  updateEditCache(phuLuc: string): void {
    let hunghixhix = this.getBieuMau(phuLuc);
    hunghixhix.forEach(item => {
      this.editCache[item.id] = {
        edit: false,
        data: { ...item }
      };
    });
  }

  //thêm cấp thấp hơn
  addLow(id: any, initItem, phuLuc: string) {
    let hunghixhix = this.getBieuMau(phuLuc);
    var data = hunghixhix.find(e => e.id == id);
    var index: number = hunghixhix.findIndex(e => e.id == id); // vi tri hien tai
    var stt: string;
    if (hunghixhix.findIndex(e => this.getHead(e.stt) == data.stt) == -1) {
      stt = data.stt + '.1';
    } else {
      index = this.findVt(data.stt, phuLuc);
      for (var i = hunghixhix.length - 1; i >= 0; i--) {
        if (this.getHead(hunghixhix[i].stt) == data.stt) {
          stt = data.stt + '.' + (this.getTail(hunghixhix[i].stt) + 1).toString();
          break;
        }
      }
    }
    var listVtu: vatTu[] = [];
    if (this.tabSelected == BAO_CAO_CHI_TIET_THUC_HIEN_PHI_XUAT_HANG_DTQG || this.tabSelected == BAO_CAO_CHI_TIET_THUC_HIEN_PHI_NhAP_HANG_DTQG ||
      this.tabSelected == BAO_CAO_CHI_TIET_THUC_HIEN_PHI_XUAT_HANG_CUU_TRO_VIEN_TRO || this.tabSelected == KHAI_THAC_BAO_CAO_CHI_TIET_THUC_HIEN_PHI_BAO_QUAN_LAN_DAU_HANG_DTQG) {
      this.listColTemp.forEach((e) => {
        let objTrongD = {
          id: e.id,
          maVtu: e.maVtu,
          loaiMatHang: '0',
          sl: 0,
        };
        let objLke = {
          id: e.id,
          maVtu: e.maVtu,
          loaiMatHang: '1',
          sl: 0,
        };
        listVtu.push(objTrongD);
        listVtu.push(objLke);
      });
    }
    // them moi phan tu
    if (initItem?.id) {
      let item = {
        ...initItem,
        stt: stt,
        listCtiet: listVtu,
      }
      hunghixhix.splice(index + 1, 0, item);
      this.editCache[item.id] = {
        edit: false,
        data: { ...item }
      };
    } else {
      let item = {
        ...initItem,
        id: uuid.v4() + "FE",
        stt: stt,
        listCtiet: listVtu,
        maNdungChiCha: Number(hunghixhix[index].maNdungChi),
      }
      hunghixhix.splice(index + 1, 0, item);
      this.editCache[item.id] = {
        edit: true,
        data: { ...item }
      };
    }
  }

  //xóa dòng
  deleteLine(id: any, phuLuc: string) {
    let hunghixhix = this.getBieuMau(phuLuc);
    var index: number = hunghixhix.findIndex(e => e.id == id); // vi tri hien tai
    // khong tim thay thi out ra
    if (index == -1) return;
    var nho: string = hunghixhix[index].stt;
    var head: string = this.getHead(hunghixhix[index].stt); // lay phan dau cua so tt
    //xóa phần tử và con của nó
    hunghixhix = hunghixhix.filter(e => !e.stt.startsWith(nho));
    this.setBieuMau(hunghixhix, phuLuc);
    //update lại số thức tự cho các phần tử cần thiết
    let lstIndex: number[] = [];
    for (var i = hunghixhix.length - 1; i >= index; i--) {
      if (this.getHead(hunghixhix[i].stt) == head) {
        lstIndex.push(i);
      }
    }
    this.replaceIndex(lstIndex, -1, phuLuc);
    this.updateEditCache(phuLuc);
  }

  // start edit
  startEdit(id: string): void {
    this.editCache[id].edit = true;
  }

  // huy thay doi
  cancelEdit(id: string, phuLuc: string): void {
    let hunghixhix = this.getBieuMau(phuLuc);
    // lay vi tri hang minh sua
    const index = hunghixhix.findIndex(item => item.id == id);
    // xoa dong neu truoc do chua co du lieu
    if ((this.tabSelected == BAO_CAO_NHAP_HANG_DTQG || this.tabSelected == BAO_CAO_XUAT_HANG_DTQG) && !hunghixhix[index].maVtu) {
      this.deleteLine(id, phuLuc);
      return;
    } else if ((this.tabSelected == BAO_CAO_CHI_TIET_THUC_HIEN_PHI_XUAT_HANG_DTQG || this.tabSelected == BAO_CAO_CHI_TIET_THUC_HIEN_PHI_NhAP_HANG_DTQG ||
      this.tabSelected == BAO_CAO_CHI_TIET_THUC_HIEN_PHI_XUAT_HANG_CUU_TRO_VIEN_TRO || this.tabSelected == KHAI_THAC_BAO_CAO_CHI_TIET_THUC_HIEN_PHI_BAO_QUAN_LAN_DAU_HANG_DTQG)
      && !hunghixhix[index].maNdungChi) {
      this.deleteLine(id, phuLuc);
      return;
    }
    //return du lieu
    this.editCache[id] = {
      data: { ...hunghixhix[index] },
      edit: false
    };
  }

  // luu thay doi
  saveEdit(id: string, phuLuc: string): void {
    if (this.tabSelected == BAO_CAO_NHAP_HANG_DTQG || this.tabSelected == BAO_CAO_XUAT_HANG_DTQG) {
      if (!this.editCache[id].data.maVtu || !this.editCache[id].data.maDviTinh) {
        this.notification.warning(MESSAGE.WARNING, MESSAGE.FINISH_FORM);
        return;
      }
    } else if (this.tabSelected == BAO_CAO_CHI_TIET_THUC_HIEN_PHI_XUAT_HANG_DTQG || this.tabSelected == BAO_CAO_CHI_TIET_THUC_HIEN_PHI_NhAP_HANG_DTQG ||
      this.tabSelected == BAO_CAO_CHI_TIET_THUC_HIEN_PHI_XUAT_HANG_CUU_TRO_VIEN_TRO || this.tabSelected == KHAI_THAC_BAO_CAO_CHI_TIET_THUC_HIEN_PHI_BAO_QUAN_LAN_DAU_HANG_DTQG) {
      if (!this.editCache[id].data.maNdungChi) {
        this.notification.warning(MESSAGE.WARNING, MESSAGE.FINISH_FORM);
        return;
      }
    }
    let hunghixhix = this.getBieuMau(phuLuc);
    this.editCache[id].data.checked = hunghixhix.find(item => item.id == id).checked; // set checked editCache = checked danhSachChiTiethunghixhix
    const index = hunghixhix.findIndex(item => item.id == id); // lay vi tri hang minh sua
    Object.assign(hunghixhix[index], this.editCache[id].data); // set lai data cua danhSachChiTiethunghixhix[index] = this.editCache[id].data
    this.editCache[id].edit = false; // CHUYEN VE DANG TEXT
  }

  updateChecked(id: any, phuLuc: string) {
    let hunghixhix = this.getBieuMau(phuLuc);
    var data = hunghixhix.find(e => e.id == id);
    //đặt các phần tử con có cùng trạng thái với nó
    hunghixhix.forEach(item => {
      if (item.stt.startsWith(data.stt)) {
        item.checked = data.checked;
      }
    })
    //thay đổi các phần tử cha cho phù hợp với tháy đổi của phần tử con
    var index: number = hunghixhix.findIndex(e => e.stt == this.getHead(data.stt));
    if (index == -1) {
      this.allChecked = this.checkAllChild('0', phuLuc);
    } else {
      var nho: boolean = hunghixhix[index].checked;
      while (nho != this.checkAllChild(hunghixhix[index].stt, phuLuc)) {
        hunghixhix[index].checked = !nho;
        index = hunghixhix.findIndex(e => e.stt == this.getHead(hunghixhix[index].stt));
        if (index == -1) {
          this.allChecked = !nho;
          break;
        }
        nho = hunghixhix[index].checked;
      }
    }
  }
  //kiểm tra các phần tử con có cùng được đánh dấu hay ko
  checkAllChild(str: string, phuLuc: string): boolean {
    let hunghixhix = this.getBieuMau(phuLuc);
    var nho: boolean = true;
    hunghixhix.forEach(item => {
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
    let idPhuLuc = LISTBIEUMAUDOT.find(item => item.maPhuLuc == this.tabSelected)?.lstId;
    idPhuLuc.forEach(phuLuc => {
      let hunghixhix = this.getBieuMau(phuLuc);
      var lstId: any[] = [];
      hunghixhix.forEach(item => {
        if (item.checked) {
          lstId.push(item.id);
        }
      })
      lstId.forEach(item => {
        if (hunghixhix.findIndex(e => e.id == item) != -1) {
          this.deleteLine(item, phuLuc);
        }
      })
    });
  }

  //thêm phần tử đầu tiên khi bảng rỗng
  addFirst(initItem: any, phuLuc: string) {
    var listVtu: vatTu[] = [];
    if (this.tabSelected == BAO_CAO_CHI_TIET_THUC_HIEN_PHI_XUAT_HANG_DTQG || this.tabSelected == BAO_CAO_CHI_TIET_THUC_HIEN_PHI_NhAP_HANG_DTQG ||
      this.tabSelected == BAO_CAO_CHI_TIET_THUC_HIEN_PHI_XUAT_HANG_CUU_TRO_VIEN_TRO || this.tabSelected == KHAI_THAC_BAO_CAO_CHI_TIET_THUC_HIEN_PHI_BAO_QUAN_LAN_DAU_HANG_DTQG) {
      this.listColTemp.forEach((e) => {
        let objTrongD = {
          id: e.id,
          maVtu: e.maVtu,
          loaiMatHang: '0',
          sl: 0,
        };
        let objLke = {
          id: e.id,
          maVtu: e.maVtu,
          loaiMatHang: '1',
          sl: 0,
        };
        listVtu.push(objTrongD);
        listVtu.push(objLke);
      });
    }
    let hunghixhix = this.getBieuMau(phuLuc);
    let item;
    if (initItem?.id) {
      item = {
        ...initItem,
        stt: "0.1",
        listCtiet: listVtu,
      }
    } else {
      item = {
        ...initItem,
        id: uuid.v4() + 'FE',
        stt: "0.1",
        listCtiet: listVtu,
      }
    }
    hunghixhix.push(item);
    this.editCache[item.id] = {
      edit: true,
      data: { ...item }
    };
  }

  sortByIndex() {
    let idPhuLuc = LISTBIEUMAUDOT.find(item => item.maPhuLuc == this.tabSelected)?.lstId;
    idPhuLuc.forEach(async phuLuc => {
      await this.setDetail(phuLuc);
      let hunghixhix = this.getBieuMau(phuLuc);
      hunghixhix.sort((item1, item2) => {
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
      hunghixhix.forEach(item => {
        var index: number = lstTemp.findIndex(e => e.stt == this.getHead(item.stt));
        if (index == -1) {
          lstTemp.splice(0, 0, item);
        } else {
          lstTemp.splice(index + 1, 0, item);
        }
      })
      hunghixhix = lstTemp;
      this.setBieuMau(hunghixhix, phuLuc);
    })
  }

  setDetail(phuLuc) {
    let hunghixhix = this.getBieuMau(phuLuc);
    hunghixhix.forEach(item => {
      if (BAO_CAO_NHAP_HANG_DTQG == this.tabSelected) {
        item.level = this.vatTusBC02.find(e => e.id == item.maVtu)?.level;
      } else if (BAO_CAO_XUAT_HANG_DTQG == this.tabSelected) {
        item.level = this.vatTusBC03.find(e => e.id == item.maVtu)?.level;
      } else if (BAO_CAO_CHI_TIET_THUC_HIEN_PHI_XUAT_HANG_DTQG == this.tabSelected) {
        item.level = this.noiDungChisBC04.find(e => e.id == item.maNdungChi)?.level;
      } else if (KHAI_THAC_BAO_CAO_CHI_TIET_THUC_HIEN_PHI_BAO_QUAN_LAN_DAU_HANG_DTQG == this.tabSelected) {
        item.level = this.noiDungChisBC05.find(e => e.id == item.maNdungChi)?.level;
      }
    })
    this.setBieuMau(hunghixhix, phuLuc);
  }

  // getIdCha(maKM: any) {
  //   return this.noiDungs.find(e => e.id == maKM)?.idCha;
  // }

  // sortWithoutIndex() {
  //   let idPhuLuc = PHULUCLIST.find(item => item.maPhuLuc == this.tabSelected)?.lstId;
  //   idPhuLuc.forEach(async phuLuc => {
  //     await this.setDetail(phuLuc);
  //     let hunghixhix = this.getBieuMau(phuLuc);
  //     this.setDetail(phuLuc);
  //     var level = 0;
  //     var danhSachChiTiethunghixhixTemp: any[] = hunghixhix;
  //     hunghixhix = [];
  //     var data = danhSachChiTiethunghixhixTemp.find(e => e.level == 0);
  //     this.addFirst(data, phuLuc);
  //     danhSachChiTiethunghixhixTemp = danhSachChiTiethunghixhixTemp.filter(e => e.id != data.id);
  //     var lstTemp = danhSachChiTiethunghixhixTemp.filter(e => e.level == level);
  //     while (lstTemp.length != 0 || level == 0) {
  //       lstTemp.forEach(item => {
  //         let idCha = this.getIdCha(item.maNdung);
  //         var index: number = hunghixhix.findIndex(e => e.maNdung == idCha);
  //         if (index != -1) {
  //           this.addLow(hunghixhix[index].id, item, phuLuc);
  //         } else {
  //           index = hunghixhix.findIndex(e => this.getIdCha(e.maNdung) == idCha);
  //           this.addSame(hunghixhix[index].id, item, phuLuc);
  //         }
  //       })
  //       level += 1;
  //       lstTemp = danhSachChiTiethunghixhixTemp.filter(e => e.level == level);
  //     }
  //   })
  // }



  getLowStatus(str: string, phuLuc: string) {
    let hunghixhix = this.getBieuMau(phuLuc);
    var index: number = hunghixhix.findIndex(e => this.getHead(e.stt) == str);
    if (index == -1) {
      return false;
    }
    return true;
  }

  getBieuMau(phuLuc) {
    if (phuLuc == '21') {
      return this.lstCtietBcao021;
    } else if (phuLuc == '22') {
      return this.lstCtietBcao022;
    } else if (phuLuc == '31') {
      return this.lstCtietBcao031;
    } else if (phuLuc == '32') {
      return this.lstCtietBcao032;
    } else if (phuLuc == '33') {
      return this.lstCtietBcao033;
    } else {
      return this.lstCTietBaoCaoTemp;
    }
  }

  setBieuMau(listPhuLuc: any, phuLuc: string) {
    if (phuLuc == '21') {
      this.lstCtietBcao021 = listPhuLuc;
    } else if (phuLuc == '22') {
      this.lstCtietBcao022 = listPhuLuc;
    } else if (phuLuc == '31') {
      this.lstCtietBcao031 = listPhuLuc;
    } else if (phuLuc == '32') {
      this.lstCtietBcao032 = listPhuLuc;
    } else if (phuLuc == '33') {
      this.lstCtietBcao033 = listPhuLuc;
    } else {
      this.lstCTietBaoCaoTemp = listPhuLuc;
    }
  }

  async savePhuLuc2() {
    if (this.tabSelected == BAO_CAO_NHAP_HANG_DTQG) {
      this.lstCTietBaoCaoTemp = [];
      await this.lstCtietBcao021.forEach(e => {
        this.lstCTietBaoCaoTemp.push(e);
      })
      await this.lstCtietBcao022.forEach(e => {
        this.lstCTietBaoCaoTemp.push(e);
      })
    }
  }

  async savePhuLuc3() {
    if (this.tabSelected == BAO_CAO_XUAT_HANG_DTQG) {
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
  }
}
