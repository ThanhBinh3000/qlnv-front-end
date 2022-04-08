import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import * as uuid from 'uuid';
import * as fileSaver from 'file-saver';
import { NOTOK, OK, TRANGTHAIPHULUC, Utils } from 'src/app/Utility/utils';
import { UserService } from 'src/app/services/user.service';
import { DatePipe, Location } from '@angular/common';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ActivatedRoute, Router } from '@angular/router';
import { MESSAGE } from '../../../../../constants/message';
import { BAO_CAO_CHI_TIET_THUC_HIEN_PHI_NhAP_HANG_DTQG, BAO_CAO_CHI_TIET_THUC_HIEN_PHI_XUAT_HANG_CUU_TRO_VIEN_TRO, BAO_CAO_CHI_TIET_THUC_HIEN_PHI_XUAT_HANG_DTQG, BAO_CAO_NHAP_HANG_DTQG, BAO_CAO_XUAT_HANG_DTQG, KHAI_THAC_BAO_CAO_CHI_TIET_THUC_HIEN_PHI_BAO_QUAN_LAN_DAU_HANG_DTQG, LISTBIEUMAUDOT, LISTBIEUMAUNAM, SOLAMA, TAB_SELECTED } from './lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-DTQG.constant';
import { NzModalService } from 'ng-zorro-antd/modal';
import { DialogChonThemBieuMauBaoCaoComponent } from 'src/app/components/dialog/dialog-chon-them-bieu-mau-bao-cao-kqth-von-phi-hang-DTQG/dialog-chon-them-bieu-mau-bao-cao-kqth-von-phi-hang-DTQG.component';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';


export class ItemDanhSach {
  id!: any;
  maBcao!: String;
  namBcao!: Number;
  dotBcao!: Number;
  trangThai!:string;
  ngayTao!: string;
  nguoiTao!:string;
  maDviTien!:string;
  maDvi:number;
  congVan!:string;
  ngayTrinhDuyet!:string;
  ngayDuyet!:string;
  ngayPheDuyet!:string;
  ngayCapTrenTraKq!:string;

  // dung cho request
  fileDinhKems!: any[];
  listIdDeletes!: string;
  listIdFiles!: string;
  maLoaiBcao!: string;


  stt!: String;
  checked!:boolean;
  lstBCao: ItemData[] = [];
  lstFile: any[] = [];
}

export class ItemData {
  id!: any;
  maLoai!:string;
  lstCTietBCao!: any;
  trangThai!: string;
  checked!:boolean;
  tieuDe!: string;
  tenPhuLuc!: string;

}

export class ItemDataMau02 {
  id: any;
  stt: any;
  index:any;
  maVtu: string;
  maDviTinh: string;
  soQd: string;
  khSoLuong: number;
  khGiaMuaTd: number;
  khTtien: number;
  thSoLuong:any;
  thGiaMuaTd:any;
  thTtien:any;
  ghiChu:any;
  maVtuHeader:any;
  loai:any;
  checked!: boolean;
}

export class ItemDataMau03 {
  id: any;
  stt: any;
  maVtu: string;
  maDviTinh: string;
  soLuongKhoach: string;
  soLuongTte: number;
  dgGiaKhoach: number;
  dgGiaBanTthieu: number;
  dgGiaBanTte:any;
  ttGiaHtoan:any;
  ttGiaBanTte:any;
  ttClechGiaTteVaGiaHtoan
  ghiChu:any;
  maVtuHeader:any;
  loai:any;
  checked!: boolean;
}

export class ItemDataMau04a1{
  id: any;
  stt: any;
  maNdungChi: any;
  maNdungChiParent: any;
  trongDotTcong: any;
  trongDotThoc: any;
  trongDotGao: any;
  luyKeTcong: any;
  luyKeThoc: any;
  luyKeGao: any;
  listCtiet: vatTu[] = [];
  parentId: any;
  ghiChu: any;
  checked: boolean;
  level:number;
  maLoai: number;
}


export class vatTu {
  id: any;
  maVtu: any;
  loaiMatHang: any;
  colName: any;
  sl: any;
  col:number;
}

export class linkList {
  id: any;
  vt: number;
  stt: any;
  maNdungChi: any;
  maNdungChiParent: any;
  trongDotTcong: any;
  trongDotThoc: any;
  trongDotGao: any;
  luyKeTcong: any;
  luyKeThoc: any;
  luyKeGao: any;
  listCtiet: vatTu[] = [];
  parentId: any;
  ghiChu: any;
  next: linkList[];
  checked: boolean;
  maLoai: number;
}

@Component({
  selector:
    'app-lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-DTQG-tai-chi-cuc-mau04a',
  templateUrl:
    './lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-DTQG-tai-chi-cuc-mau04a.component.html',
  styleUrls: [
    './lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-DTQG-tai-chi-cuc-mau04a.component.scss',
  ],
})
export class LapBaoCaoKetQuaThucHienVonPhiHangDTQGTaiChiCucMau04aComponent
  implements OnInit
{
  constructor(
    private quanLyVonPhiService: QuanLyVonPhiService,
    private danhMuc: DanhMucHDVService,
    private spinner: NgxSpinnerService,
    private sanitizer: DomSanitizer,
    private nguoiDungSerivce: UserService,
    private datepipe: DatePipe,
    private notification: NzNotificationService,
    private router: ActivatedRoute,
    private modal: NzModalService,
    private danhMucService :DanhMucHDVService,
    private location : Location,
    private route:Router,
  ) {}


  statusBtnDel: boolean; // trang thai an/hien nut xoa
  statusBtnSave: boolean; // trang thai an/hien nut luu
  statusBtnApprove: boolean; // trang thai an/hien nut trinh duyet
  statusBtnTBP: boolean; // trang thai an/hien nut truong bo phan
  statusBtnLD: boolean; // trang thai an/hien nut lanh dao
  statusBtnGuiDVCT: boolean; // trang thai nut gui don vi cap tren
  statusBtnDVCT: boolean; // trang thai nut don vi cap tren

  statusBtnDuyetBieuMau:boolean = true;
  userInfo: any;
  //-------------
  id: any;
  fileList: NzUploadFile[] = [];
  lstFile: any[] = [];
  listFile: File[] = [];
  fileToUpload!: File;
  fileUrl: any;
  urlDetail:string ='qlkh-von-phi/quy-trinh-bao-cao-ket-qua-thuc-hien-von-phi-hang-dtqg-tai-tong-cuc-dtnn/lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-dtqg-tai-chi-cuc-chi-tiet/'

  loaiBaoCaoParam:any;
  
  nho: boolean;
  tab =TAB_SELECTED;
  tabSelected: number;


  totalElements = 0;
  totalPages = 0;
  pages = {
    size: 10,
    page: 1,
  }
  baoCao:ItemDanhSach= new ItemDanhSach();
  
  listIdDelete: string = '';
  allChecked = false; // check all checkbox
  allChecked02 = false; // check all checkbox
  allChecked03 = false; // check all checkbox
  allChecked1 = false; // check all checkbox
  allChecked2 = false; // check all checkbox
  allChecked3= false; // check all checkbox
  allChecked4= false; // check all checkbox

  indeterminate = true; // properties allCheckBox
  indeterminate02 = true; // properties allCheckBox
  indeterminate03 = true; // properties allCheckBox
  indeterminate1 = true; // properties allCheckBox
  indeterminate2 = true; // properties allCheckBox
  indeterminate3 = true; // properties allCheckBox
  indeterminate4 = true; // properties allCheckBox

  status: boolean = false;
  checkXem:boolean = false;

  donViTaos: any[] = [];
  userInfor: any;
  currentday: Date = new Date();

  maLoaiBaocao: any; // phân biệt kiểu báo cáo năm hoặc đợt
  maPhanBcao:string ='1'; //phân biệt phần giữa 3.2.9 và 3.2.8 

  maBcao:any;
  maDonViTao:any;
  donvitien: any;
  trangThaiBanGhi:any;
  
  listVattu: any[] = [];
  
  // listVtuTrongDot: any[] = [];
  // listVtuLuyKe: any[] = [];
  // lenghtTh = 0;
  stt: number;
  kt: boolean;
  
  
  listIdFiles: string;
  statusButton: boolean = false;
  maDvi:any;
  nam:any;
  dotBaocao:any;
  checkxemkhaithac:any;
  

  lstDeleteCTietBCao: any = [];
  lstIdDeleteMau02:string= '';
  lstIdDeleteMau03:string='';
  lstIdDeleteMau04ax:string='';
  lstIdDeleteMau04an:string='';
  lstIdDeleteMau04bx:string='';
  lstIdDeleteMau05:string='';

  lstIdDeleteCols:string='';
  soLaMa: any = SOLAMA;
    

  statusB4ax: boolean = false;
  statusB4an: boolean = false;
  statusB4bx: boolean = false;
  statusB5: boolean = false;
  //hidden nut lưu
  disable4ax: boolean = false;
  disable4an: boolean = false;
  disable4bx: boolean = false;
  disable5: boolean = false;
  //bảng chính
  lstCTietBCao04ax: ItemDataMau04a1[] = [];
  lstCTietBCao04an: ItemDataMau04a1[] = [];
  lstCTietBCao04bx: ItemDataMau04a1[] = [];
  lstCTietBCao05: ItemDataMau04a1[] = [];
  //bảng lưu tạm
  editCache04ax: { [key: string]: { edit: boolean; data: ItemDataMau04a1 } } = {}; // phuc vu nut chinh
  editCache04an: { [key: string]: { edit: boolean; data: ItemDataMau04a1 } } = {}; // phuc vu nut chinh
  editCache04bx: { [key: string]: { edit: boolean; data: ItemDataMau04a1 } } = {}; // phuc vu nut chinh
  editCache05: { [key: string]: { edit: boolean; data: ItemDataMau04a1 } } = {}; // phuc vu nut chinh
  //khởi tạo link list
  // chiTietBcao4ax: linkList = {
  //   id: uuid.v4(),
  //   vt: 0,
  //   stt: null,
  //   maNdungChi: '',
  //   maNdungChiParent: '0',
  //   trongDotTcong: null,
  //   trongDotThoc: null,
  //   trongDotGao: null,
  //   luyKeTcong: null,
  //   luyKeThoc: null,
  //   luyKeGao: null,
  //   listCtiet: [],
  //   parentId: null,
  //   ghiChu: '',
  //   next: [],
  //   checked: false,
  //   maLoai: null,
  // };
  // chiTietBcao4an: linkList = {
  //   id: uuid.v4(),
  //   vt: 0,
  //   stt: null,
  //   maNdungChi: '',
  //   maNdungChiParent: '0',
  //   trongDotTcong: null,
  //   trongDotThoc: null,
  //   trongDotGao: null,
  //   luyKeTcong: null,
  //   luyKeThoc: null,
  //   luyKeGao: null,
  //   listCtiet: [],
  //   parentId: null,
  //   ghiChu: '',
  //   next: [],
  //   checked: false,
  //   maLoai: null,
  // };
  // chiTietBcao4bx: linkList = {
  //   id: uuid.v4(),
  //   vt: 0,
  //   stt: null,
  //   maNdungChi: '',
  //   maNdungChiParent: '0',
  //   trongDotTcong: null,
  //   trongDotThoc: null,
  //   trongDotGao: null,
  //   luyKeTcong: null,
  //   luyKeThoc: null,
  //   luyKeGao: null,
  //   listCtiet: [],
  //   parentId: null,
  //   ghiChu: '',
  //   next: [],
  //   checked: false,
  //   maLoai: null,
  // };
  // chiTietBcao5: linkList = {
  //   id: uuid.v4(),
  //   vt: 0,
  //   stt: null,
  //   maNdungChi: '',
  //   maNdungChiParent: '0',
  //   trongDotTcong: null,
  //   trongDotThoc: null,
  //   trongDotGao: null,
  //   luyKeTcong: null,
  //   luyKeThoc: null,
  //   luyKeGao: null,
  //   listCtiet: [],
  //   parentId: null,
  //   ghiChu: '',
  //   next: [],
  //   checked: false,
  //   maLoai: null,
  // };
  chiTietBcao4ax:linkList;
  chiTietBcao4an:linkList;
  chiTietBcao4bx:linkList;
  chiTietBcao5:linkList;
  //biến col table
  listColTrongDot4ax: any[] = [];
  listColTrongDot4an: any[] = [];
  listColTrongDot4bx: any[] = [];
  listColTrongDot5: any[] = [];
  //---------
  listColLuyke4ax: any[] = [];
  listColLuyke4an: any[] = [];
  listColLuyke4bx: any[] = [];
  listColLuyke5: any[] = [];
  //dùng để làm cột động
  cols4ax: number = 0;
  cols4an: number = 0;
  cols4bx: number = 0;
  cols05: number = 0;
  //dùng để lấy mã tên cột 
  ObjCol4ax: any;
  ObjCol4an:any;
  ObjCol4bx:any;
  ObjCol5:any;

  async ngOnInit() {
    this.cols4ax = 3;
    this.cols4an = 3;
    this.cols4bx = 3;
    this.cols05  = 3;
    this.initLinkList();
    let userName = this.nguoiDungSerivce.getUserName();
    await this.getUserInfo(userName); //get user info
    this.maDonViTao = this.userInfor?.dvql;
    //check router
    this.id = this.router.snapshot.paramMap.get('id');
    // this.maDvi = this.router.snapshot.paramMap.get('maDvi');
    // this.maLoaiBaocao = this.router.snapshot.paramMap.get('maLoaiBaocao');
    // this.nam = this.router.snapshot.paramMap.get('nam');
    // this.dotBaocao = this.router.snapshot.paramMap.get('dotBaocao');

    this.loaiBaoCaoParam = this.router.snapshot.paramMap.get('loai');
    //xem chi tiet xuất file exel;
    this.checkxemkhaithac = this.router.snapshot.paramMap.get('status');

    //lấy danh sách vật tư
    this.danhMucService.dMVatTu().subscribe(res => {
      if(res.statusCode==0){
        this.listVattu = res.data?.content;
      }else{
        this.notification.error(MESSAGE.ERROR, res?.msg);
      }
    },err => {
    this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    })
    
    if ( this.id!=null && this.checkxemkhaithac!=null) {
      this.getDetailReportToExportFile();
    }else if (this.id != null) {
      //call service lay chi tiet
     await this.getDetailReport();
    }else if(this.maDvi!=null && this.maLoaiBaocao !=null && this.nam !=null && this.dotBaocao !=null){
      this.callTonghop();
    }
     else {
      //tạo mã báo cáo
      this.quanLyVonPhiService.sinhMaBaoCao().subscribe(
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
      this.baoCao.ngayTao = this.currentday.toDateString();
      this.nam = this.currentday.getFullYear();
      //khởi tạo trạng thái tạo mới
      this.baoCao.trangThai = '1';
      if(this.loaiBaoCaoParam=='1'){
        //thiếu service lấy đợt báo cáo
       await this.quanLyVonPhiService.sinhDotBaoCao().toPromise().then( res =>{
          if(res.statusCode==0){
            this.baoCao.dotBcao = res.data;
          }else{
            this.notification.error(MESSAGE.ERROR,res?.msg);
          }
        },err => {
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        })
        this.maLoaiBaocao = '1';
        LISTBIEUMAUDOT.forEach(e => {
          this.baoCao.lstBCao.push(
            {
              id:uuid.v4(),
              checked:false,
              tieuDe: e.tieuDe+this.baoCao.dotBcao,
              maLoai:e.maPhuLuc.toString(),
              tenPhuLuc: e.tenPhuLuc,
              trangThai: '2',
              lstCTietBCao: []
            }
          )
        })
      }else{
        this.maLoaiBaocao ='2';
        LISTBIEUMAUNAM.forEach(e => {
          this.baoCao.lstBCao.push(
            {
              id:uuid.v4(),
              checked:false,
              tieuDe: e.tieuDe+this.baoCao.namBcao,
              maLoai:e.maPhuLuc.toString(),
              tenPhuLuc: e.tenPhuLuc,
              trangThai: '2',
              lstCTietBCao: []
            }
          )
        })
      }
    }
   

     
    
    //danh sách đơn vị tính (đơn vị đo lường )
    this.quanLyVonPhiService.dmDonvitinh().subscribe(
      (data) => {
        if (data.statusCode == 0) {
          this.listDonvitinh = data.data?.content;

        } else {
          this.notification.error(MESSAGE.ERROR,data?.msg);
        }
      },
      (err) => {
        this.notification.error(MESSAGE.ERROR,MESSAGE.SYSTEM_ERROR);
      },
    );
    
    this.getStatusButton();
    if(this.userInfor.roles[0]?.id==2){
      this.statusBtnDuyetBieuMau= false;
    }
    //lay danh sach cac đơn vị quản lý (hn, thái nguyên,...)
    this.quanLyVonPhiService.dMDonVi().subscribe(res => {
      if(res.statusCode==0){
        this.donViTaos =res.data;

      } else {
        this.notification.error(MESSAGE.ERROR,res?.msg);
      }
    },
    (err) => {
      this.notification.error(MESSAGE.ERROR,MESSAGE.SYSTEM_ERROR);
    })
  }


  //chuc nang trinh duyet len các cap tren
  onSubmit(mcn: String) {
    const requestGroupButtons = {
      id: this.id,
      maChucNang: mcn,
      lyDoTuChoi: '',
    };
    this.spinner.show();
    this.quanLyVonPhiService.approveBaoCao(requestGroupButtons).subscribe(async (data) => {
      if (data.statusCode == 0) {
       await this.getDetailReport();
        this.getStatusButton();
        this.notification.success(MESSAGE.SUCCESS, MESSAGE.SUCCESS);
      }else{
        this.notification.error(MESSAGE.ERROR, data?.msg);
      }
    },err =>{
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    });
    this.spinner.hide();
  }

  //get role button
  getStatusButton(){
    const utils = new Utils();
    this.statusBtnDel = utils.getRoleDel(this.baoCao.trangThai, 2, this.userInfor?.roles[0]?.id);
    this.statusBtnSave = utils.getRoleSave(this.baoCao.trangThai, 2, this.userInfor?.roles[0]?.id);
    this.statusBtnApprove = utils.getRoleApprove(this.baoCao.trangThai, 2, this.userInfor?.roles[0]?.id);
    this.statusBtnTBP = utils.getRoleTBP(this.baoCao.trangThai, 2, this.userInfor?.roles[0]?.id);
    this.statusBtnLD = utils.getRoleLD(this.baoCao.trangThai, 2, this.userInfor?.roles[0]?.id);
    this.statusBtnGuiDVCT = utils.getRoleGuiDVCT(this.baoCao.trangThai, 2, this.userInfor?.roles[0]?.id);
    this.statusBtnDVCT = utils.getRoleDVCT(this.baoCao.trangThai, 2, this.userInfor?.roles[0]?.id);
  }
//khoi tao link list
  initLinkList(){
    this.chiTietBcao4ax = {
      id: uuid.v4(),
      vt: 0,
      stt: null,
      maNdungChi: '',
      maNdungChiParent: '0',
      trongDotTcong: null,
      trongDotThoc: null,
      trongDotGao: null,
      luyKeTcong: null,
      luyKeThoc: null,
      luyKeGao: null,
      listCtiet: [],
      parentId: null,
      ghiChu: '',
      next: [],
      checked: false,
      maLoai: null,
    };
    this.chiTietBcao4an = {
      id: uuid.v4(),
      vt: 0,
      stt: null,
      maNdungChi: '',
      maNdungChiParent: '0',
      trongDotTcong: null,
      trongDotThoc: null,
      trongDotGao: null,
      luyKeTcong: null,
      luyKeThoc: null,
      luyKeGao: null,
      listCtiet: [],
      parentId: null,
      ghiChu: '',
      next: [],
      checked: false,
      maLoai: null,
    };
    this.chiTietBcao4bx = {
      id: uuid.v4(),
      vt: 0,
      stt: null,
      maNdungChi: '',
      maNdungChiParent: '0',
      trongDotTcong: null,
      trongDotThoc: null,
      trongDotGao: null,
      luyKeTcong: null,
      luyKeThoc: null,
      luyKeGao: null,
      listCtiet: [],
      parentId: null,
      ghiChu: '',
      next: [],
      checked: false,
      maLoai: null,
    };
    this.chiTietBcao5 = {
      id: uuid.v4(),
      vt: 0,
      stt: null,
      maNdungChi: '',
      maNdungChiParent: '0',
      trongDotTcong: null,
      trongDotThoc: null,
      trongDotGao: null,
      luyKeTcong: null,
      luyKeThoc: null,
      luyKeGao: null,
      listCtiet: [],
      parentId: null,
      ghiChu: '',
      next: [],
      checked: false,
      maLoai: null,
    };
  }
  //get user info
  async getUserInfo(username: string) {
    await this.nguoiDungSerivce
      .getUserInfo(username)
      .toPromise()
      .then(
        (data) => {
          if (data?.statusCode == 0) {
            this.userInfor = data?.data;
            return data?.data;
          } else {
            this.notification.error(MESSAGE.ERROR, data?.msg);
          }
        },
        (err) => {
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        },
      );
  }

  //show popup tu choi dùng cho nut ok - not ok
  pheDuyetChiTiet(mcn: string,maLoai:any) {
    if (mcn == OK) {
      this.pheDuyetBieuMau(mcn,maLoai, null);
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
          this.pheDuyetBieuMau(mcn,maLoai, text);
        }
      });
    }
  }

  //call api duyet bieu mau
  pheDuyetBieuMau(trangThai:any,maLoai:any,lyDo:string){
    var idBieuMau:any  = this.baoCao.lstBCao.find((item)=> item.maLoai==maLoai).id;
    const requestPheDuyetBieuMau = {
      id: idBieuMau,
      trangThai: trangThai,
      lyDoTuChoi: lyDo,
    };
    this.spinner.show();
    this.quanLyVonPhiService.approveBieuMau(requestPheDuyetBieuMau).subscribe(res =>{
        if(res.statusCode==0){
          this.notification.success(MESSAGE.SUCCESS,MESSAGE.APPROVE_SUCCESS);
          this.getDetailReport();
        }else{
          this.notification.error(MESSAGE.ERROR, res?.msg);
        }
    },err => {
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    })
    this.spinner.hide();
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
        // this.onSubmit(mcn, text);
      }
    });
  }

  //xử lý phần phụ lục
  // them phu luc
  addPhuLuc() {
    var danhSach:any;
    if(this.loaiBaoCaoParam=='1'){
      LISTBIEUMAUDOT.forEach(item => item.status = false);
       danhSach = LISTBIEUMAUDOT.filter(item => this.baoCao?.lstBCao?.findIndex(data => Number(data.maLoai) == item.maPhuLuc) == -1);
    }else{
      LISTBIEUMAUNAM.forEach(item => item.status = false);
       danhSach = LISTBIEUMAUNAM.filter(item => this.baoCao?.lstBCao?.findIndex(data => Number(data.maLoai) == item.maPhuLuc) == -1);
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
          if(item.status){
            this.baoCao.lstBCao.push({
              id: uuid.v4(),
              checked:false,
              tieuDe: item.tieuDe,
              maLoai:item.maPhuLuc.toString(),
              tenPhuLuc: item.tenPhuLuc,
              trangThai: '2',
              lstCTietBCao: []
            });
          }
        })
      }
    });
  }
  // xoa phu luc
  deletePhuLucList(){
    this.baoCao.lstBCao = this.baoCao?.lstBCao.filter(item => item.checked == false);
    if(this.baoCao?.lstBCao?.findIndex(item => Number(item.maLoai) == this.tabSelected) == -1){
      this.tabSelected = null;
    }
    // this.allChecked = false;
  }
 
  // doi tab
  changeTab(maPhuLuc){
    this.tabSelected = Number(maPhuLuc);
    if(this.id==null){
      if(this.tabSelected==BAO_CAO_NHAP_HANG_DTQG){
        this.lstCTietBCao02 = this.baoCao?.lstBCao.find(item => item.maLoai == maPhuLuc)?.lstCTietBCao;
      }else if(this.tabSelected==BAO_CAO_XUAT_HANG_DTQG){
        this.lstCTietBCao03 = this.baoCao?.lstBCao.find(item => item.maLoai == maPhuLuc)?.lstCTietBCao;
      }else if(this.tabSelected==BAO_CAO_CHI_TIET_THUC_HIEN_PHI_XUAT_HANG_DTQG){
        this.lstCTietBCao04ax = this.baoCao?.lstBCao.find(item => item.maLoai == maPhuLuc)?.lstCTietBCao;
      }else if(this.tabSelected==BAO_CAO_CHI_TIET_THUC_HIEN_PHI_NhAP_HANG_DTQG){
        this.lstCTietBCao04an = this.baoCao?.lstBCao.find(item => item.maLoai == maPhuLuc)?.lstCTietBCao;
      }else if(this.tabSelected==BAO_CAO_CHI_TIET_THUC_HIEN_PHI_XUAT_HANG_CUU_TRO_VIEN_TRO){
        this.lstCTietBCao04bx = this.baoCao?.lstBCao.find(item => item.maLoai== maPhuLuc)?.lstCTietBCao;
      }else if(this.tabSelected == KHAI_THAC_BAO_CAO_CHI_TIET_THUC_HIEN_PHI_BAO_QUAN_LAN_DAU_HANG_DTQG){
        this.lstCTietBCao05 = this.baoCao?.lstBCao.find(item => item.maLoai== maPhuLuc)?.lstCTietBCao;
      }
    }
    
   
   this.updateEditCache02();
   this.updateEditCache03();
   this.updateEditCache();
  }


  // luu temp vao bang chinh
  saveTemp(){
    
    if(this.tabSelected==BAO_CAO_NHAP_HANG_DTQG){
      this.saveMau02();
      this.baoCao?.lstBCao.forEach(item => {
        if(Number(item.maLoai) == this.tabSelected){
          item.lstCTietBCao = this.lstCTietBCao02;
        }
      });
    }else if(this.tabSelected==BAO_CAO_XUAT_HANG_DTQG){
      this.saveMau03();
      this.baoCao?.lstBCao.forEach(item => {
        if(Number(item.maLoai) == this.tabSelected){
          item.lstCTietBCao = this.lstCTietBCao03;
        }
      });
    }else if(this.tabSelected==BAO_CAO_CHI_TIET_THUC_HIEN_PHI_XUAT_HANG_DTQG){
      this.baoCao?.lstBCao.forEach(item => {
        if(Number(item.maLoai) == this.tabSelected){
          item.lstCTietBCao = this.lstCTietBCao04ax;
        }
      });
    }else if(this.tabSelected==BAO_CAO_CHI_TIET_THUC_HIEN_PHI_NhAP_HANG_DTQG){
      this.baoCao?.lstBCao.forEach(item => {
        if(Number(item.maLoai) == this.tabSelected){
          item.lstCTietBCao = this.lstCTietBCao04an;
        }
      });
    }else if(this.tabSelected==BAO_CAO_CHI_TIET_THUC_HIEN_PHI_XUAT_HANG_CUU_TRO_VIEN_TRO){
      this.baoCao?.lstBCao.forEach(item => {
        if(Number(item.maLoai) == this.tabSelected){
          item.lstCTietBCao = this.lstCTietBCao04bx;
        }
      });
    }else if(this.tabSelected==KHAI_THAC_BAO_CAO_CHI_TIET_THUC_HIEN_PHI_BAO_QUAN_LAN_DAU_HANG_DTQG){
      this.baoCao?.lstBCao.forEach(item => {
        if(Number(item.maLoai) == this.tabSelected){
          item.lstCTietBCao = this.lstCTietBCao05;
        }
      });
    }
    
    this.updateEditCache02();
    this.updateEditCache03();
    this.updateEditCache();
    this.tabSelected = null;
  }
  
  ///////////////////////////////xử lý chung /////////////////////// lưu vào CSDL
  xoa(){};
  dong(){
    // this.location.back();  
    this.route.navigate(['/qlkh-von-phi/quy-trinh-bao-cao-ket-qua-thuc-hien-von-phi-hang-dtqg-tai-tong-cuc-dtnn/'])
  }
  async luu() {
    this.baoCao.lstBCao.forEach((e) => {
      
      if (typeof e.id != 'number') {
        e.id = null;
      }

      e.lstCTietBCao.forEach(el => {
        if (typeof el.id != 'number') {
          el.id = null;
        }
        if(el.maLoai=='6' || el.maLoai=='7' ||el.maLoai=='8' || el.maLoai=='9'){
          el.listCtiet.forEach(element=>{
            if (typeof element.id != 'number') {
              element.id = null;
            }
          })
        }
      })
    });
  
    
    // donvi tien
    if (this.donvitien == undefined) {
      this.donvitien = '01';
    }

    // lay id file dinh kem
    let idFileDinhKems = '';
    for (let i = 0; i < this.lstFile.length; i++) {
      idFileDinhKems += this.lstFile[i].id + ',';
    }

    // lay id file dinh kem (gửi file theo danh sách )
    let listFileUploaded: any = [];
    for (const iterator of this.listFile) {
      listFileUploaded.push(await this.uploadFile(iterator));
    }

    // gui du lieu trinh duyet len server
    let request = {
      id: this.id,
      fileDinhKems: listFileUploaded,
      lstDeleteCTietBCao: this.lstDeleteCTietBCao,
      listColDeleteVtus:this.lstIdDeleteCols,
      listIdFiles: idFileDinhKems,
      lstBCao: this.baoCao.lstBCao,
      maBcao:this.baoCao.maBcao,
      maDvi:this.maDonViTao,
      maDviTien: this.donvitien,
      maLoaiBcao: this.maLoaiBaocao,
      maPhanBcao:this.maPhanBcao,
      namBcao:this.baoCao.namBcao,
      namHienHanh: this.nam,
      dotBcao:this.baoCao.dotBcao,
      trangThai: this.baoCao.trangThai,
    };

    this.spinner.show();
    if (this.id != null) {
      this.quanLyVonPhiService.updateBaoCaoThucHienDTC(request).toPromise().then(async (res) => {
        if (res.statusCode == 0) {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
          this.getDetailReport();
          this.getStatusButton();
        } else {
          this.notification.error(MESSAGE.ERROR, res?.msg);
        }
      },err =>{
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      });
    } else {
      this.quanLyVonPhiService.trinhDuyetBaoCaoThucHienDTCService(request).toPromise().then(
        async (data) => {
          if (data.statusCode == 0) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
            this.id = data.data.id;
            this.getDetailReport();
            this.getStatusButton();
          } else {
            this.notification.error(MESSAGE.ERROR, data?.msg);
          }
        },
        (err) => {
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        },
      );
    }
    this.updateEditCache02();
    this.updateAllChecked03();
    this.updateEditCache();
    this.spinner.hide();
  }
    getChiMuc(str: string): string {
      var xau: string = "";
      let chiSo: any = str.split('.');
      var n: number = chiSo.length - 1;
      var k: number = parseInt(chiSo[n], 10);
      if (n == 0){
          for(var i = 0; i < this.soLaMa.length; i++){
              while (k >= this.soLaMa[i].gTri){
                  xau += this.soLaMa[i].kyTu;
                  k -= this.soLaMa[i].gTri;
              }
          }
      };
      if (n == 1)  {
          xau = chiSo[n];
      };
      if (n==2) {
          xau = chiSo[n-1].toString() + "." + chiSo[n].toString();
      };
      if (n == 3) {
          xau = String.fromCharCode(k+96);
      }
      if (n == 4) {
          xau = "-";
      }
      return xau;
  }

  lessThan(level: number): boolean {
      return level > 3;
  }
  //sinh ma cot
  //list vat tu la list cot da co trong danh sach
  sinhMa(): number{
    var i: number = 1;
    var kt: boolean = true;
    while (kt){
      var index1: number = this.listColTrongDot4an.findIndex(item => item.col == i);
      var index2: number = this.listColTrongDot4ax.findIndex(item => item.col == i);
      var index3: number = this.listColTrongDot4bx.findIndex(item => item.col == i);
      var index4: number = this.listColTrongDot5.findIndex(item => item.col == i);
      if (index1 > -1 || index2 >-1 || index3 > -1 || index4 > -1) {
        i++;
      } else {
        kt = false;
      }
    }
    return i;
  }

  //thêm cột
  addCol(maLoai:any) {

    var colname;
    if(maLoai==1){
      if (this.ObjCol4ax == undefined ) return;
      this.listVattu.forEach((e) => {
        if (this.ObjCol4ax == e.id) {
          colname = e.tenDm;
        }
      });
      let objTrongdot = {
        id: uuid.v4(),
        maVtu: this.ObjCol4ax,
        loaiMatHang: '0',
        colName: colname,
        sl: 0,
        col:this.sinhMa(),
      };
  
      this.listColTrongDot4ax.push(objTrongdot);
      this.addColLL(this.chiTietBcao4ax, objTrongdot);
      this.updateLstCTietBCao(maLoai);
      this.cols4ax++;
    }else if(maLoai==2){
      if(this.ObjCol4an==undefined) return;
      this.listVattu.forEach((e) => {
        if (this.ObjCol4an == e.id) {
          colname = e.tenDm;
        }
      });
      let objTrongdot = {
        id: uuid.v4(),
        maVtu: this.ObjCol4an,
        loaiMatHang: '0',
        colName: colname,
        sl: 0,
        col:this.sinhMa(),
      };
  
      this.listColTrongDot4an.push(objTrongdot);
  
  
      this.addColLL(this.chiTietBcao4an, objTrongdot);
      this.updateLstCTietBCao(maLoai);
      this.cols4an++;
    }else if(maLoai==3){
      if(this.ObjCol4bx==undefined) return;
      this.listVattu.forEach((e) => {
        if (this.ObjCol4bx == e.id) {
          colname = e.tenDm;
        }
      });
      let objTrongdot = {
        id: uuid.v4(),
        maVtu: this.ObjCol4bx,
        loaiMatHang: '0',
        colName: colname,
        sl: 0,
        col:this.sinhMa(),
      };
  
      this.listColTrongDot4bx.push(objTrongdot);
  
  
      this.addColLL(this.chiTietBcao4bx, objTrongdot);
      this.updateLstCTietBCao(maLoai);
      this.cols4bx++;
    }else if(maLoai==4){
      if(this.ObjCol5==undefined) return;
      this.listVattu.forEach((e) => {
        if (this.ObjCol5 == e.id) {
          colname = e.tenDm;
        }
      });
      let objTrongdot = {
        id: uuid.v4(),
        maVtu: this.ObjCol5,
        loaiMatHang: '0',
        colName: colname,
        sl: 0,
        col:this.sinhMa(),
      };
  
      this.listColTrongDot5.push(objTrongdot);
  
  
      this.addColLL(this.chiTietBcao5, objTrongdot);
      this.updateLstCTietBCao(maLoai);
      this.cols05++;
      console.log(this.listColTrongDot5);
    }
    
  }

  //them cot moi vao linklist
  addColLL(data: linkList, obj: vatTu) {
    let objTrongdot = {
      id: obj.id,
      maVtu: obj.maVtu,
      loaiMatHang: '0',
      colName: obj.colName,
      sl: 0,
      col:obj.col,
    };
    let objLuyke = {
      id: obj.id,
      maVtu: obj.maVtu,
      loaiMatHang: '1',
      colName: obj.colName,
      sl: 0,
      col:obj.col,
    };
    data.listCtiet.push(objTrongdot);
    data.listCtiet.push(objLuyke);
    if (data.next.length == 0) return;
    data.next.forEach((item) => {
      this.addColLL(item, obj);
    });
  }
  
  //them dong
  addLine(idx: any,maLoai:any) {
    var listVtu: vatTu[] = [];
    var loai:number =0;
    if(maLoai==1){
      this.listColTrongDot4ax.forEach((e) => {
        let objTrongD = {
          id: e.id,
          maVtu: e.maVtu,
          loaiMatHang: '0',
          colName: null,
          sl: 0,
          col:e.col,
        };
        let objLke = {
          id: e.id,
          maVtu: e.maVtu,
          loaiMatHang: '1',
          colName: null,
          sl: 0,
          col:e.col,
        };
        listVtu.push(objTrongD);
        listVtu.push(objLke);
      });
      loai=6;
    }else if(maLoai==2){
      this.listColTrongDot4an.forEach((e) => {
        let objTrongD = {
          id: e.id,
          maVtu: e.maVtu,
          loaiMatHang: '0',
          colName: null,
          sl: 0,
          col:e.col,
        };
        let objLke = {
          id: e.id,
          maVtu: e.maVtu,
          loaiMatHang: '1',
          colName: null,
          sl: 0,
          col:e.col,
        };
        listVtu.push(objTrongD);
        listVtu.push(objLke);
      });
      loai=7;
    }else if(maLoai==3){
      this.listColTrongDot4bx.forEach((e) => {
        let objTrongD = {
          id: e.id,
          maVtu: e.maVtu,
          loaiMatHang: '0',
          colName: null,
          sl: 0,
          col:e.col,
        };
        let objLke = {
          id: e.id,
          maVtu: e.maVtu,
          loaiMatHang: '1',
          colName: null,
          sl: 0,
          col:e.col,
        };
        listVtu.push(objTrongD);
        listVtu.push(objLke);
      });
      loai=8;
    }else if(maLoai==4){
      this.listColTrongDot5.forEach((e) => {
        let objTrongD = {
          id: e.id,
          maVtu: e.maVtu,
          loaiMatHang: '0',
          colName: null,
          sl: 0,
          col:e.col,
        };
        let objLke = {
          id: e.id,
          maVtu: e.maVtu,
          loaiMatHang: '1',
          colName:null,
          sl: 0,
          col:e.col,
        };
        listVtu.push(objTrongD);
        listVtu.push(objLke);
      });
      loai=9;
    }
  
    
    var lv:number = 0;
    if(maLoai==1){
      lv= this.lstCTietBCao04ax[idx-1]?.level;
    }else if(maLoai ==2){
      lv = this.lstCTietBCao04an[idx-1]?.level;
    }else if(maLoai==3){
      lv = this.lstCTietBCao04bx[idx-1]?.level;
    }else if(maLoai==4){
      lv = this.lstCTietBCao05[idx-1]?.level;
    }

    let item = {
      id: uuid.v4(),
      stt: 0,
      maNdungChi: '',
      maNdungChiParent: '',
      maNdungChiChild: 0,
      trongDotTcong: 0,
      trongDotThoc: 0,
      trongDotGao: 0,
      luyKeTcong: 0,
      luyKeThoc: 0,
      luyKeGao: 0,
      listCtiet: listVtu,
      parentId: null,
      ghiChu: '',
      checked: false,
      level:lv,
      maLoai:loai,
    };

    if(maLoai==1){
      this.lstCTietBCao04ax.splice(idx, 0, item);
      this.editCache04ax[item.id] = {
        edit: true,
        data: { ...item },
      };
  
      this.statusB4ax = false;
      this.disable4ax = true;
    }else if(maLoai==2){
      this.lstCTietBCao04an.splice(idx, 0, item);
        this.editCache04an[item.id] = {
        edit: true,
        data: { ...item },
      };

    this.statusB4an = false;
    this.disable4an = true;
    }else if(maLoai==3){
      this.lstCTietBCao04bx.splice(idx, 0, item);
        this.editCache04bx[item.id] = {
        edit: true,
        data: { ...item },
      };

      this.statusB4bx = false;
      this.disable4bx = true;
    }else if(maLoai==4){
      this.lstCTietBCao05.splice(idx, 0, item);
        this.editCache05[item.id] = {
        edit: true,
        data: { ...item },
      };

      
      this.statusB5 = false;
      this.disable5 = true;
    }
   
  }

  //xóa cột
  deleteCol(col: any,maLoai:any) {
    if(maLoai==1){
       var itemCol= this.listColTrongDot4ax.find((item) => item.col==col);
       if(typeof itemCol.id=="number"){
        this.lstIdDeleteCols += itemCol.col + ',';
       }
      this.listColTrongDot4ax =  this.listColTrongDot4ax.filter(item => item.col!=col);
      this.listColLuyke4ax =  this.listColLuyke4ax.filter(item => item.col!=col);
        this.lstCTietBCao04ax.forEach((e) => {
          e.listCtiet = e.listCtiet.filter(item => item.col!=col);
      });
      
      this.deleteColLL(this.chiTietBcao4ax, col);
      this.cols4ax = this.cols4ax - 1;
    
    }else if(maLoai ==2){
      var itemCol= this.listColTrongDot4an.find((item) => item.col==col);
       if(typeof itemCol.id=="number"){
        this.lstIdDeleteCols += itemCol.col + ',';
       }
      
      this.listColTrongDot4an =  this.listColTrongDot4an.filter(item => item.col!=col);
      this.listColLuyke4an =  this.listColLuyke4an.filter(item => item.col!=col);
        this.lstCTietBCao04an.forEach((e) => {
          e.listCtiet = e.listCtiet.filter(item => item.col!=col);
      });
      
      this.deleteColLL(this.chiTietBcao4an, col);
      this.cols4an = this.cols4an - 1;
    }else if(maLoai==3){
      var itemCol= this.listColTrongDot4bx.find((item) => item.col==col);
       if(typeof itemCol.id=="number"){
        this.lstIdDeleteCols += itemCol.col + ',';
       }
     
      this.listColTrongDot4bx =  this.listColTrongDot4bx.filter(item => item.col!=col);
      this.listColLuyke4bx =  this.listColLuyke4bx.filter(item => item.col!=col);
        this.lstCTietBCao04bx.forEach((e) => {
          e.listCtiet = e.listCtiet.filter(item => item.col!=col);
      });
      
      this.deleteColLL(this.chiTietBcao4bx, col);
      this.cols4bx = this.cols4bx - 1;
    }else if(maLoai==4){
      var itemCol= this.listColTrongDot5.find((item) => item.col==col);
       if(typeof itemCol.id=="number"){
        this.lstIdDeleteCols += itemCol.col + ',';
       }
     
      this.listColTrongDot5 =  this.listColTrongDot5.filter(item => item.col!=col);
      this.listColLuyke5 =  this.listColLuyke5.filter(item => item.col!=col);
        this.lstCTietBCao05.forEach((e) => {
          e.listCtiet = e.listCtiet.filter(item => item.col!=col);
      });
      
      this.deleteColLL(this.chiTietBcao5, col);
      this.cols05 = this.cols05 - 1;
    }
  }

  deleteColLL(data: linkList, col: any) {
    data.listCtiet = data.listCtiet.filter(item => item.col != col);
    if (data.next.length == 0) return;
    data.next.forEach((item) => {
      this.deleteColLL(item, col);
    });
    this.updateEditCache02();
    this.updateEditCache03();
    this.updateEditCache();
  }

  // call chi tiet bao cao
  async getDetailReport() {
    this.spinner.show();
     this.quanLyVonPhiService.baoCaoChiTiet(this.id).toPromise().then(
      async (data) => {
        if (data.statusCode == 0) {
          // set thong tin chung bao cao
          this.baoCao.lstBCao = data.data.lstBCao;
          this.baoCao.dotBcao = data.data.dotBcao;
          this.baoCao.maBcao = data.data.maBcao;
          this.baoCao.namBcao = data.data.namBcao;
          this.baoCao.maDvi = data.data.maDvi;
          this.baoCao.ngayDuyet = data.data.ngayDuyet;
          this.baoCao.ngayPheDuyet = data.data.ngayPheDuyet;
          this.baoCao.ngayCapTrenTraKq = data.data.ngayTraKq;
          this.baoCao.ngayTrinhDuyet = data.data.ngayTrinh;
          this.baoCao.trangThai = data.data.trangThai;
          this.donvitien = data.data.maDviTien;
          this.maLoaiBaocao = data.data.maLoaiBcao;
          this.lstFile = data.data.lstFile;
          this.trangThaiBanGhi = data.data.trangThai;
          if(this.maLoaiBaocao=='1'){
            this.baoCao?.lstBCao?.forEach(item => {
              let index = LISTBIEUMAUDOT.findIndex(data => data.maPhuLuc == Number(item.maLoai));
              if(index !== -1){
                item.tieuDe = LISTBIEUMAUDOT[index].tieuDe;
                item.tenPhuLuc = LISTBIEUMAUDOT[index].tenPhuLuc;
              }
            })
          }else{
            this.baoCao?.lstBCao?.forEach(item => {
              let index = LISTBIEUMAUNAM.findIndex(data => data.maPhuLuc == Number(item.maLoai));
              if(index !== -1){
                item.tieuDe = LISTBIEUMAUNAM[index].tieuDe;
                item.tenPhuLuc = LISTBIEUMAUNAM[index].tenPhuLuc;
              }
            })
          }
         await this.resetList();
         this.initLinkList();
        
          //set data cho cac bieu mau
          this.lstCTietBCao02 = this.baoCao?.lstBCao.find(item => Number(item.maLoai) ==BAO_CAO_NHAP_HANG_DTQG)?.lstCTietBCao; //nhập hàng
          this.lstCTietBCao02.forEach(e => {
            if(e.maVtuHeader =='1'){
              this.lstCTietBCao1.push(e);
            }else{
              this.lstCTietBCao2.push(e);
            }
          })
          this.lstCTietBCao03 = this.baoCao?.lstBCao.find(item => Number(item.maLoai) ==BAO_CAO_XUAT_HANG_DTQG)?.lstCTietBCao; // xuất hàng
          this.lstCTietBCao03.forEach(e => {
            if(e.maVtuHeader=='1'){
              this.lstCTietBCao031.push(e);
            }else if(e.maVtuHeader=='2'){
              this.lstCTietBCao032.push(e);
            }else{
              this.lstCTietBCao033.push(e);
            }
          })
          //------ mẫu 04a xuất
          this.lstCTietBCao04ax = this.baoCao?.lstBCao.find(item => Number(item.maLoai) ==BAO_CAO_CHI_TIET_THUC_HIEN_PHI_XUAT_HANG_DTQG)?.lstCTietBCao;
          this.lstCTietBCao04ax.forEach(item => {
            item.level = item.stt.split('.').length -1;
          })
          this.getLinkList(this.chiTietBcao4ax,'',0,this.lstCTietBCao04ax);
          this.stt = 0;
          this.updateSTT(this.chiTietBcao4ax);
          
          //-----mẫu 04a nhập
          this.lstCTietBCao04an = this.baoCao?.lstBCao.find(item => Number(item.maLoai) ==BAO_CAO_CHI_TIET_THUC_HIEN_PHI_NhAP_HANG_DTQG)?.lstCTietBCao;
          this.lstCTietBCao04an.forEach(item => {
            item.level = item.stt.split('.').length -1;
          })
          this.getLinkList(this.chiTietBcao4an,'',0,this.lstCTietBCao04an);
          this.stt = 0;
          this.updateSTT(this.chiTietBcao4an);
          //-- mẫu 04b xuất
          this.lstCTietBCao04bx = this.baoCao?.lstBCao.find(item => Number(item.maLoai) ==BAO_CAO_CHI_TIET_THUC_HIEN_PHI_XUAT_HANG_CUU_TRO_VIEN_TRO)?.lstCTietBCao;
          this.lstCTietBCao04bx.forEach(item => {
            item.level = item.stt.split('.').length -1;
          })
          this.getLinkList(this.chiTietBcao4bx,'',0,this.lstCTietBCao04bx);
          this.stt = 0;
          this.updateSTT(this.chiTietBcao4bx);
          //-- mẫu 05
          this.lstCTietBCao05 = this.baoCao?.lstBCao.find(item => Number(item.maLoai) ==KHAI_THAC_BAO_CAO_CHI_TIET_THUC_HIEN_PHI_BAO_QUAN_LAN_DAU_HANG_DTQG)?.lstCTietBCao;
          this.lstCTietBCao05.forEach(item => {
            item.level = item.stt.split('.').length -1;
          })
          this.getLinkList(this.chiTietBcao5,'',0,this.lstCTietBCao05);
          this.stt = 0;
          this.updateSTT(this.chiTietBcao5);


          //lấy tên cột 
          if(this.lstCTietBCao04ax.length!=0){
            let e = this.lstCTietBCao04ax[0];
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
                      col:el.col,
                    };
                    this.listColTrongDot4ax.push(objTrongdot);
                  }
                });
              }
            });
            this.cols4ax = this.cols4ax + this.listColTrongDot4ax.length;
          }
          
          //-------
          if(this.lstCTietBCao04an.length!=0){
            let e1 = this.lstCTietBCao04an[0];
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
                      col:el.col,
                    };
                    this.listColTrongDot4an.push(objTrongdot);
                  }
                });
              }
            });
            this.cols4an = this.cols4an + this.listColTrongDot4an.length;
          }
          //-------
          if(this.lstCTietBCao04bx.length!=0){
            let e2 = this.lstCTietBCao04bx[0];
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
                      col:el.col,
                    };
                    this.listColTrongDot4bx.push(objTrongdot);
                  }
                });
              }
            });
            this.cols4bx = this.cols4bx + this.listColTrongDot4bx.length;
          }
          //-------
          if(this.lstCTietBCao05.length!=0){
            let e3 = this.lstCTietBCao05[0];
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
                    col:el.col,
                  };
                  this.listColTrongDot5.push(objTrongdot);
                }
              });
            }
          });
          this.cols05 = this.cols05 + this.listColTrongDot5.length;
          }
          
          if (
            this.baoCao.trangThai == '1' ||
            this.baoCao.trangThai == '3' ||
            this.baoCao.trangThai == '5' ||
            this.baoCao.trangThai == '8'
          ) {
            this.status = false;
          } else {
            this.status = true;
          }
          this.checkXem= true;
          // set list id file ban dau
          this.lstFile.filter((item) => {
            this.listIdFiles += item.id + ',';
          });
          this.getStatusButton();
          this.updateEditCache();
          this.updateEditCache02();
          this.updateEditCache03();
          this.updateLstCTietBCao(1);
          this.updateLstCTietBCao(2);
          this.updateLstCTietBCao(3);
          this.updateLstCTietBCao(4);
          
          
          
        } else {
          this.notification.error(MESSAGE.ERROR, data?.msg);
        }
      },
      (err) => {
        this.notification.error(MESSAGE.ERROR,MESSAGE.SYSTEM_ERROR);
      },
    );
    this.spinner.hide();
  }


  getDetailReportToExportFile(){
    this.spinner.hide();
    this.quanLyVonPhiService.baoCaoChiTiet(this.id).subscribe(
      (data) => {
        console.log(data);
        if (data.statusCode == 0) {
          // this.chiTietBcaos = data.data;
          this.lstCTietBCao04ax = data.data.lstCTietBCao;
          this.lstFile = data.data.lstFile;
          this.maLoaiBaocao = '92';
          // set thong tin chung bao cao
          this.trangThaiBanGhi = data.data.trangThai;
          let e = this.lstCTietBCao04ax[0];

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
                  };
                  this.listColTrongDot4ax.push(objTrongdot);
                }
              });
            }
          });

         
          this.updateLstCTietBCao(1);
          this.cols4ax = this.cols4ax + this.listColTrongDot4ax.length;
          this.status = true;

          // set list id file ban dau
          this.lstFile.filter((item) => {
            this.listIdFiles += item.id + ',';
          });
          this.updateLstCTietBCao(1);

        } else {
          this.notification.error(MESSAGE.ERROR,data?.msg
          );
        }
      },
      (err) => {
        this.notification.error(
          MESSAGE.ERROR,MESSAGE.SYSTEM_ERROR
        );
      },
    );
  }

  resetList(){
    
    this.lstCTietBCao1 =[];
    this.lstCTietBCao2 =[];
    this.lstCTietBCao031 =[];
    this.lstCTietBCao032 =[];
    this.lstCTietBCao033 =[];
    this.updateEditCache02();
    this.updateAllChecked03();
    this.updateEditCache();
  }
  callTonghop(){

    if(Number(this.maLoaiBaocao) == 407){
      this.maLoaiBaocao ='90';
    }
    if(Number(this.maLoaiBaocao) == 408){
      this.maLoaiBaocao ='91';
    }
    if(Number(this.maLoaiBaocao) == 409){
      this.maLoaiBaocao ='92';
    }
    if(Number(this.maLoaiBaocao) == 410){
      this.maLoaiBaocao ='93';
    }
    if(Number(this.maLoaiBaocao) == 411){
      this.maLoaiBaocao ='94';
    }
    let objTonghop ={
      maDvi:this.maDvi = '0402',
      maLoaiBcao:this.maLoaiBaocao,
      namBcao:this.nam,
      thangordotBcao:this.dotBaocao,
    }
    this.quanLyVonPhiService.tonghopbaocaoketqua(objTonghop).subscribe(res => {
      if(res.statusCode==0){
        this.lstCTietBCao04ax = res.data;
        this.lstFile = res.data.lstFile;
        this.maLoaiBaocao = '92';
        let e = this.lstCTietBCao04ax[0];
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
                  };
                  this.listColTrongDot4ax.push(objTrongdot);
                }
              });
            }
          });
       
        this.updateLstCTietBCao(1);
        this.cols4ax = this.cols4ax + this.listColTrongDot4ax.length;

        // set list id file ban dau
        this.lstFile.filter((item) => {
          this.listIdFiles += item.id + ',';
        });
        this.updateLstCTietBCao(1);



      }else{
        this.notification.error(MESSAGE.ERROR,res?.msg);
      }
    },err=>{
      this.notification.error(MESSAGE.ERROR,MESSAGE.SYSTEM_ERROR);
    })
  }

  transToLL(){
    var n: number = 0;
    while (this.lstCTietBCao04ax.length != 0) {
      let lst = this.lstCTietBCao04ax.filter(item => item.maNdungChiParent == n.toString());
      lst.forEach(item => {
        var obj: linkList = {
          id: item.id,
          vt: item.parentId,
          stt: item.stt,
          maNdungChi: item.maNdungChi,
          maNdungChiParent: item.maNdungChiParent,
          trongDotTcong: item.trongDotTcong,
          trongDotThoc: item.trongDotThoc,
          trongDotGao: item.trongDotGao,
          luyKeTcong: item.luyKeTcong,
          luyKeThoc: item.luyKeThoc,
          luyKeGao: item.luyKeGao,
          listCtiet: item.listCtiet,
          parentId: item.parentId,
          ghiChu: item.ghiChu,
          next: [],
          checked: false,
          maLoai: item.maLoai,
        };
      })
    }
  }


  getLinkList(data: linkList, head: string, lvl: number,listInput:any){
    var lst: ItemDataMau04a1[] = [];
    listInput.forEach(item =>  {
        if ((item.level == lvl) && (item.stt.indexOf(head) == 0)){
            lst.push(item);
        }
    });
    if (lst.length == 0) return;
    lst.forEach(item => {
        var obj: linkList = {
      id: item.id,
      vt: item.parentId,
      stt: item.stt,
      maNdungChi: item.maNdungChi,
      maNdungChiParent: item.maNdungChiParent,
      trongDotTcong: item.trongDotTcong,
      trongDotThoc: item.trongDotThoc,
      trongDotGao: item.trongDotGao,
      luyKeTcong: item.luyKeTcong,
      luyKeThoc: item.luyKeThoc,
      luyKeGao: item.luyKeGao,
      listCtiet: item.listCtiet,
      parentId: item.parentId,
      ghiChu: item.ghiChu,
      next: [],
      checked: false,
      maLoai: item.maLoai,
    };
        this.getLinkList(obj, item.stt, lvl + 1,listInput);
        data.next.push(obj);
    })
}
  

  updateEditCache(): void {
    if(this.tabSelected==BAO_CAO_CHI_TIET_THUC_HIEN_PHI_XUAT_HANG_DTQG){
      this.lstCTietBCao04ax.forEach((item) => {
        this.editCache04ax[item.id] = {
          edit: false,
          data: { ...item },
        };
      });
    }else if(this.tabSelected==BAO_CAO_CHI_TIET_THUC_HIEN_PHI_NhAP_HANG_DTQG){
      this.lstCTietBCao04an.forEach((item) => {
        this.editCache04an[item.id] = {
          edit: false,
          data: { ...item },
        };
      });
    }else if(this.tabSelected==BAO_CAO_CHI_TIET_THUC_HIEN_PHI_XUAT_HANG_CUU_TRO_VIEN_TRO){
      this.lstCTietBCao04bx.forEach((item) => {
        this.editCache04bx[item.id] = {
          edit: false,
          data: { ...item },
        };
      });
    }else if(this.tabSelected==KHAI_THAC_BAO_CAO_CHI_TIET_THUC_HIEN_PHI_BAO_QUAN_LAN_DAU_HANG_DTQG){
      this.lstCTietBCao05.forEach((item) => {
        this.editCache05[item.id] = {
          edit: false,
          data: { ...item },
        };
      });
    }else {
      this.lstCTietBCao04ax.forEach((item) => {
        this.editCache04ax[item.id] = {
          edit: false,
          data: { ...item },
        };
      });
      this.lstCTietBCao04an.forEach((item) => {
        this.editCache04an[item.id] = {
          edit: false,
          data: { ...item },
        };
      });
      this.lstCTietBCao04bx.forEach((item) => {
        this.editCache04bx[item.id] = {
          edit: false,
          data: { ...item },
        };
      });
      this.lstCTietBCao05.forEach((item) => {
        this.editCache05[item.id] = {
          edit: false,
          data: { ...item },
        };
      });
    }
    
  }

  // start edit
  startEdit(id: string,maLoai:any): void {
    if(maLoai==1){
      this.editCache04ax[id].edit = true;
      this.statusB4ax = true;
      this.disable4ax = true;
    }else if(maLoai==2){
      this.editCache04an[id].edit = true;
      this.statusB4an = true;
      this.disable4an = true;
    }else if(maLoai==3){
      this.editCache04bx[id].edit = true;
      this.statusB4bx = true;
      this.disable4bx = true;
    }else if(maLoai==4){
      this.editCache05[id].edit = true;
      this.statusB5 = true;
      this.disable5 = true;
    }
    
  }

  //update khi sửa
  saveEdit(id: string, maLoai:any): void {

    if(maLoai==1){
      this.editCache04ax[id].data.checked = this.lstCTietBCao04ax.find(
        (item) => item.id === id,
      ).checked; // set checked editCache = checked lstCTietBCao
      const index = this.lstCTietBCao04ax.findIndex((item) => item.id === id); // lay vi tri hang minh sua
      Object.assign(this.lstCTietBCao04ax[index], this.editCache04ax[id].data); // set lai data cua lstCTietBCao[index] = this.editCache[id].data
      this.editCache04ax[id].edit = false; // CHUYEN VE DANG TEXT
      this.saveEditLL(this.chiTietBcao4ax, index + 1);
      this.disable4ax = false;
    }else if(maLoai==2){
      this.editCache04an[id].data.checked = this.lstCTietBCao04an.find(
        (item) => item.id === id,
      ).checked; // set checked editCache = checked lstCTietBCao
      const index = this.lstCTietBCao04an.findIndex((item) => item.id === id); // lay vi tri hang minh sua
      Object.assign(this.lstCTietBCao04an[index], this.editCache04an[id].data); // set lai data cua lstCTietBCao[index] = this.editCache[id].data
      this.editCache04an[id].edit = false; // CHUYEN VE DANG TEXT
      this.saveEditLL(this.chiTietBcao4an, index + 1);
      this.disable4an = false;
    }else if(maLoai==3){
      this.editCache04bx[id].data.checked = this.lstCTietBCao04bx.find(
        (item) => item.id === id,
      ).checked; // set checked editCache = checked lstCTietBCao
      const index = this.lstCTietBCao04bx.findIndex((item) => item.id === id); // lay vi tri hang minh sua
      Object.assign(this.lstCTietBCao04bx[index], this.editCache04bx[id].data); // set lai data cua lstCTietBCao[index] = this.editCache[id].data
      this.editCache04bx[id].edit = false; // CHUYEN VE DANG TEXT
      this.saveEditLL(this.chiTietBcao4bx, index + 1);
      this.disable4bx = false;
    }else if(maLoai==4){
      this.editCache05[id].data.checked = this.lstCTietBCao05.find(
        (item) => item.id === id,
      ).checked; // set checked editCache = checked lstCTietBCao
      const index = this.lstCTietBCao05.findIndex((item) => item.id === id); // lay vi tri hang minh sua
      Object.assign(this.lstCTietBCao05[index], this.editCache05[id].data); // set lai data cua lstCTietBCao[index] = this.editCache[id].data
      this.editCache05[id].edit = false; // CHUYEN VE DANG TEXT
      this.saveEditLL(this.chiTietBcao5, index + 1);
      this.disable5 = false;
    }
    
  }

  //hủy thao tác sửa update lại giá trị ban đầu
  cancelEdit(id: string,maLoai:any): void {
    if(maLoai==1){
      const index = this.lstCTietBCao04ax.findIndex((item) => item.id === id); // lay vi tri hang minh sua
      this.editCache04ax[id] = {
        data: { ...this.lstCTietBCao04ax[index] },
        edit: false,
      };
      this.disable4ax = false;
    }else if(maLoai==2){
      const index = this.lstCTietBCao04an.findIndex((item) => item.id === id); // lay vi tri hang minh sua
      this.editCache04an[id] = {
        data: { ...this.lstCTietBCao04an[index] },
        edit: false,
      };
      this.disable4an = false;
    }else if(maLoai==3){
      const index = this.lstCTietBCao04bx.findIndex((item) => item.id === id); // lay vi tri hang minh sua
      this.editCache04bx[id] = {
        data: { ...this.lstCTietBCao04bx[index] },
        edit: false,
      };
      this.disable4bx = false;
    }else if(maLoai==4){
      const index = this.lstCTietBCao05.findIndex((item) => item.id === id); // lay vi tri hang minh sua
      this.editCache05[id] = {
        data: { ...this.lstCTietBCao05[index] },
        edit: false,
      };
      this.disable5 = false;
    }
    
  }

  // xoa dong
  deleteById(id: any): void {
    this.lstCTietBCao04ax = this.lstCTietBCao04ax.filter((item) => item.id != id);
    if (typeof id == 'number') {
      this.listIdDelete += id + ',';
    }
  }


  //checkox trên tùng row
  updateSingleChecked(): void {
    if (this.baoCao?.lstBCao.every((item) => !item.checked)) {
      this.allChecked = false;
      this.indeterminate = false;
    } else if (this.baoCao?.lstBCao.every((item) => item.checked)) {
      this.allChecked = true;
      this.indeterminate = false;
    } else {
      this.indeterminate = true;
    }
  }

  // update all xoa danh sách mẫu báo cáo
  updateAllDanhSachMauBcao(): void {
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
  
  //lay tên trang thai bao cao
  getStatusName(status:any):string {
    const utils = new Utils();
    return utils.getStatusName(status);
  }
  //lay ten trang thai biểu mẫu
  getStatusNameBieuMau(status:any):string {
    return TRANGTHAIPHULUC.find(item => item.id ==Number(status))?.ten;
  }

  //lay ten don vi tạo
  getUnitName(maDonvi:any) {
    return this.donViTaos.find((item) => item.maDvi == maDonvi)?.tenDvi;
  }

  //nhom các chức năng phục vụ cho chọn file
  beforeUpload = (file: NzUploadFile): boolean => {
    this.fileList = this.fileList.concat(file);
    return false;
  };

  handleUpload(): void {
    this.fileList.forEach((file: any) => {
      const id = file?.lastModified.toString();
      this.lstFile.push({ id: id, fileName: file?.name });
      this.listFile.push(file);
    });
    this.fileList = [];
  }

  //event ng dung thay doi file
  selectFile(files: FileList): void {
    this.fileToUpload = files.item(0);
  }

  //download file về máy tính
  downloadFile(id: string) {
    let file!: File;
    this.listFile.forEach((element) => {
      if (element?.lastModified.toString() == id) {
        file = element;
      }
    });
    const blob = new Blob([file], { type: 'application/octet-stream' });
    this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      window.URL.createObjectURL(blob),
    );
    fileSaver.saveAs(blob, file.name);
  }

  // xoa file trong bang file
  deleteFile(id: string): void {
    this.lstFile = this.lstFile.filter((a: any) => a.id !== id);
    this.listFile = this.listFile.filter(
      (a: any) => a?.lastModified.toString() !== id,
    );
  }

  //upload file
  async uploadFile(file: File) {
    // day file len server
    const upfile: FormData = new FormData();
    upfile.append('file', file);
    upfile.append('folder', this.baoCao.maBcao + '/' + this.maDonViTao + '/');
    let temp = await this.quanLyVonPhiService
      .uploadFile(upfile)
      .toPromise()
      .then(
        (data) => {
          let objfile = {
            fileName: data.filename,
            fileSize: data.size,
            fileUrl: data.url,
          };
          return objfile;
        },
        (err) => {
          console.log('false :', err);
        },
      );
    return temp;
  }

  onPageIndexChange(page) {
    this.pages.page = page;
  }

  //doi so luong phan tu tren 1 trang
  onPageSizeChange(size) {
    this.pages.size = size;
  }

  //thao tác bảng mau 04a -5

  //khoi tao
  duyet(data: linkList, str: string, index: number, parent: number, item: ItemDataMau04a1[], lv: number) {
    if (data.vt != 0) {
      let mm = {
        id: data.id,
        stt: str + index.toString(),
        maNdungChi: data.maNdungChi,
        maNdungChiParent: parent.toString(),
        trongDotTcong: data.trongDotTcong,
        trongDotThoc: data.trongDotThoc,
        trongDotGao: data.trongDotGao,
        luyKeTcong: data.luyKeTcong,
        luyKeThoc: data.luyKeThoc,
        luyKeGao: data.luyKeGao,
        listCtiet: data.listCtiet,
        parentId: data.vt,
        ghiChu: data.ghiChu,
        checked: false,
        level: lv,
        maLoai:data.maLoai,
      };
     item.push(mm);
    }
    if (data.next.length == 0) return;
    for (var i = 0; i < data.next.length; i++) {
      if (index == 0) {
        this.duyet(data.next[i], str, i + 1, data.vt,item, lv+1);
      } else {
        this.duyet(data.next[i], str + index.toString() + '.', i + 1, data.vt,item, lv+1);
      }
    }
  }

  updateLstCTietBCao(maloai:any) {
    if(maloai==1){
      this.lstCTietBCao04ax = [];
      this.duyet(this.chiTietBcao4ax, '', 0, 0,this.lstCTietBCao04ax, -1);
      this.updateEditCache();
    }else if(maloai==2){
      this.lstCTietBCao04an =[];
      this.duyet(this.chiTietBcao4an, '', 0, 0,this.lstCTietBCao04an, -1);
      this.updateEditCache();
    }else if(maloai==3){
      this.lstCTietBCao04bx =[];
      this.duyet(this.chiTietBcao4bx, '', 0, 0,this.lstCTietBCao04bx, -1);
      this.updateEditCache();
    }else if(maloai==4){
      this.lstCTietBCao05 =[];
      this.duyet(this.chiTietBcao5, '', 0, 0,this.lstCTietBCao05, -1);
      this.updateEditCache();
    }
    
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
  deleteByStt(idx: any,maLoai:any): void {
    if(maLoai==1){
      this.delete(this.chiTietBcao4ax, idx,maLoai);
      this.stt = 0;
      this.updateSTT(this.chiTietBcao4ax);
      this.updateLstCTietBCao(maLoai);
    }else if(maLoai==2){
      this.delete(this.chiTietBcao4an, idx,maLoai);
      this.stt = 0;
      this.updateSTT(this.chiTietBcao4an);
      this.updateLstCTietBCao(maLoai);
    }else if(maLoai==3){
      this.delete(this.chiTietBcao4bx, idx,maLoai);
      this.stt = 0;
      this.updateSTT(this.chiTietBcao4bx);
      this.updateLstCTietBCao(maLoai);
    }else if(maLoai==4){
      this.delete(this.chiTietBcao5, idx,maLoai);
      this.stt = 0;
      this.updateSTT(this.chiTietBcao5);
      this.updateLstCTietBCao(maLoai);
    }
  
    console.log(this.lstIdDeleteMau04bx);

  }

  //xoa theo so thu tu
  delete(data: linkList, idx: number, maLoai:any) {
    if (data.next.length == 0) return;
    var index = data.next.findIndex((item) => item.vt == idx);
    if (index == -1) {
      data.next.forEach((item) => {
        this.delete(item, idx,maLoai);
      });
    } else {
      this.kt = true;
      this.getListIdDelete(data.next[index],maLoai);
      data.next = data.next.filter((item) => item.vt != idx);
      return;
    }
  }

  getListIdDelete(data: linkList,maLoai:any){
    if(data.vt>0){
      if(maLoai==1){
        if (typeof this.lstCTietBCao04ax[data.vt-1].id == 'number'){
          this.lstIdDeleteMau04ax += this.lstCTietBCao04ax[data.vt-1].id + ',';
          let objectDele ={
            maLoai:'6',
            lstIdDelete:this.lstIdDeleteMau04ax
          }
          this.lstDeleteCTietBCao.push(objectDele);
        }
      }else if(maLoai==2){
        if (typeof this.lstCTietBCao04an[data.vt-1].id == 'number'){
          this.lstIdDeleteMau04an += this.lstCTietBCao04an[data.vt-1].id + ',';
          let objectDele ={
            maLoai:'7',
            lstIdDelete:this.lstIdDeleteMau04an
          }
          this.lstDeleteCTietBCao.push(objectDele);
        }
      }else if(maLoai==3){
        if (typeof this.lstCTietBCao04bx[data.vt-1].id == 'number'){
          this.lstIdDeleteMau04bx += this.lstCTietBCao04bx[data.vt-1].id + ',';
          let objectDele ={
            maLoai:'8',
            lstIdDelete:this.lstIdDeleteMau04bx
          }
          this.lstDeleteCTietBCao.push(objectDele);
        }
      }else if(maLoai==4){
        if (typeof this.lstCTietBCao05[data.vt-1].id == 'number'){
          this.lstIdDeleteMau05 += this.lstCTietBCao05[data.vt-1].id + ',';
          let objectDele ={
            maLoai:'9',
            lstIdDelete:this.lstIdDeleteMau05
          }
          this.lstDeleteCTietBCao.push(objectDele);
        }
      }
    }

    if (data.next.length == 0) return;
    data.next.forEach(item => {
      this.getListIdDelete(item, maLoai);
    })
    
  }

  //xoa bằng checkbox
  deleteSelected(maLoai:any) {
    if(maLoai==1){
      this.deleteAllSelected(this.chiTietBcao4ax,maLoai);
      this.updateSTT(this.chiTietBcao4ax);
      this.updateLstCTietBCao(maLoai);
      this.allChecked = false;
      this.chiTietBcao4ax.checked = false;
    }else if(maLoai==2){
      this.deleteAllSelected(this.chiTietBcao4an,maLoai);
      this.updateSTT(this.chiTietBcao4an);
      this.updateLstCTietBCao(maLoai);
      this.allChecked1 = false;
      this.chiTietBcao4an.checked = false;
    }else if(maLoai==3){
      this.deleteAllSelected(this.chiTietBcao4bx,maLoai);
      this.updateSTT(this.chiTietBcao4bx);
      this.updateLstCTietBCao(maLoai);
      this.allChecked2 = false;
      this.chiTietBcao4bx.checked = false;
    }else if(maLoai==4){
      this.deleteAllSelected(this.chiTietBcao5,maLoai);
      this.updateSTT(this.chiTietBcao5);
      this.updateLstCTietBCao(maLoai);
      this.allChecked3 = false;
      this.chiTietBcao5.checked = false;
    }
  }

  deleteAllSelected(data: linkList,maLoai:any) {
    if (data.next.length == 0) {
      return;
    }

    if(data.checked==true){
      this.getListIdDelete(data,maLoai);
    }
    data.next = data.next.filter((item) => item.checked == false);
    this.stt = 0;
    data.next.forEach((item) => this.deleteAllSelected(item,maLoai));
  }

  // click o checkbox all
  updateAllChecked(maLoai:any): void {
    if(maLoai==1){
      this.subUpdateChecked(this.chiTietBcao4ax, this.allChecked1,maLoai);
    }else if(maLoai==2){
      this.subUpdateChecked(this.chiTietBcao4an, this.allChecked2,maLoai);
    }else if(maLoai==3){
      this.subUpdateChecked(this.chiTietBcao4bx, this.allChecked3,maLoai);
    }else if(maLoai==4){
      this.subUpdateChecked(this.chiTietBcao5, this.allChecked4,maLoai);
    }
  }

  updateChecked(maLoai:any) {
    if(maLoai==1){
      this.updateCheckedLL(this.chiTietBcao4ax,maLoai);
    }else if(maLoai==2){
      this.updateCheckedLL(this.chiTietBcao4an,maLoai);
    }else if(maLoai==3){
      this.updateCheckedLL(this.chiTietBcao4bx,maLoai);
    }else if(maLoai==4){
      this.updateCheckedLL(this.chiTietBcao5,maLoai);
    }
        
  }

  updateCheckedLL(data: linkList,maLoai:any) {
    if (data.vt != 0) {
      if(maLoai==1){
        if (data.checked != this.lstCTietBCao04ax[data.vt - 1].checked) {
          this.subUpdateChecked(data, !data.checked,maLoai);
          return;
        }
      }else if(maLoai==2){
        if (data.checked != this.lstCTietBCao04an[data.vt - 1].checked) {
          this.subUpdateChecked(data, !data.checked,maLoai);
          return;
        }
      }else if(maLoai==3){
        if (data.checked != this.lstCTietBCao04bx[data.vt - 1].checked) {
          this.subUpdateChecked(data, !data.checked,maLoai);
          return;
        }
      }else if(maLoai==4){
        if (data.checked != this.lstCTietBCao05[data.vt - 1].checked) {
          this.subUpdateChecked(data, !data.checked,maLoai);
          return;
        }
      }
    }

    if (data.next.length == 0) return;
    var kt = true;
    data.next.forEach((item) => {
      this.updateCheckedLL(item,maLoai);
      if (!item.checked) kt = false;
    });
    data.checked = kt;
    if(maLoai==1){
        this.lstCTietBCao04ax[data.vt - 1].checked = kt;
    }
    if(maLoai==2){
        this.lstCTietBCao04an[data.vt - 1].checked = kt;
    }
    if(maLoai==3){
        this.lstCTietBCao04bx[data.vt - 1].checked = kt;
    }
    if(maLoai==4){
        this.lstCTietBCao05[data.vt - 1].checked = kt;
    }
    
  }

  subUpdateChecked(data: linkList, kt: boolean,maLoai:any) {
    data.checked = kt;
    if (data.vt > 0){
      if(maLoai==1){
        this.lstCTietBCao04ax[data.vt - 1].checked = kt;
      }else if(maLoai==2){
        this.lstCTietBCao04an[data.vt - 1].checked = kt;
      }else if(maLoai==3){
        this.lstCTietBCao04bx[data.vt - 1].checked = kt;
      }else if(maLoai==4){
        this.lstCTietBCao05[data.vt - 1].checked = kt;
      }
    }
    if (data.next.length == 0) return;
    data.next.forEach((item) => this.subUpdateChecked(item, kt,maLoai));
  }

  saveEditLL(data: linkList, idx: number) {
    if (data.vt == idx) {
      this.tranferData(data, this.lstCTietBCao04ax[idx - 1]);
      return;
    }
    if (data.next.length == 0) return;
    if (data.vt > idx) return;
    data.next.forEach((item) => {
      this.saveEditLL(item, idx);
    });
  }

  // lưu bằng cấp
  saveEdit1(id: string, index: number,maLoai:any): void {
    if(maLoai==1){
      var item: linkList = {
        id: uuid.v4(),
        vt: 0,
        stt: this.editCache04ax[id].data.stt,
        maNdungChi: this.editCache04ax[id].data.maNdungChi,
        maNdungChiParent: this.editCache04ax[id].data.maNdungChiParent,
        trongDotTcong: this.editCache04ax[id].data.trongDotTcong,
        trongDotThoc: this.editCache04ax[id].data.trongDotThoc,
        trongDotGao: this.editCache04ax[id].data.trongDotGao,
        luyKeTcong: this.editCache04ax[id].data.luyKeTcong,
        luyKeThoc: this.editCache04ax[id].data.luyKeThoc,
        luyKeGao: this.editCache04ax[id].data.luyKeGao,
        listCtiet: this.editCache04ax[id].data.listCtiet,
        parentId: this.editCache04ax[id].data.parentId,
        ghiChu: this.editCache04ax[id].data.ghiChu,
        next: [],
        checked: false,
        maLoai:this.editCache04ax[id].data.maLoai,
      };
  
      this.kt = false;
      this.addEqual(this.chiTietBcao4ax, item, index);
      if (!this.kt) {
        this.addEqual1(this.chiTietBcao4ax, item);
      }
      this.stt = 0;
      this.updateSTT(this.chiTietBcao4ax);
      console.log(this.chiTietBcao4ax);
      this.updateLstCTietBCao(maLoai);
      this.disable4ax = false;
    }else if(maLoai==2){
      var item: linkList = {
        id: uuid.v4(),
        vt: 0,
        stt: this.editCache04an[id].data.stt,
        maNdungChi: this.editCache04an[id].data.maNdungChi,
        maNdungChiParent: this.editCache04an[id].data.maNdungChiParent,
        trongDotTcong: this.editCache04an[id].data.trongDotTcong,
        trongDotThoc: this.editCache04an[id].data.trongDotThoc,
        trongDotGao: this.editCache04an[id].data.trongDotGao,
        luyKeTcong: this.editCache04an[id].data.luyKeTcong,
        luyKeThoc: this.editCache04an[id].data.luyKeThoc,
        luyKeGao: this.editCache04an[id].data.luyKeGao,
        listCtiet: this.editCache04an[id].data.listCtiet,
        parentId: this.editCache04an[id].data.parentId,
        ghiChu: this.editCache04an[id].data.ghiChu,
        next: [],
        checked: false,
        maLoai:this.editCache04an[id].data.maLoai,
      };
  
      this.kt = false;
      this.addEqual(this.chiTietBcao4an, item, index);
      if (!this.kt) {
        this.addEqual1(this.chiTietBcao4an, item);
      }
      this.stt = 0;
      this.updateSTT(this.chiTietBcao4an);
      this.updateLstCTietBCao(maLoai);
      this.disable4an = false;
    }else if(maLoai==3){
      var item: linkList = {
        id: uuid.v4(),
        vt: 0,
        stt: this.editCache04bx[id].data.stt,
        maNdungChi: this.editCache04bx[id].data.maNdungChi,
        maNdungChiParent: this.editCache04bx[id].data.maNdungChiParent,
        trongDotTcong: this.editCache04bx[id].data.trongDotTcong,
        trongDotThoc: this.editCache04bx[id].data.trongDotThoc,
        trongDotGao: this.editCache04bx[id].data.trongDotGao,
        luyKeTcong: this.editCache04bx[id].data.luyKeTcong,
        luyKeThoc: this.editCache04bx[id].data.luyKeThoc,
        luyKeGao: this.editCache04bx[id].data.luyKeGao,
        listCtiet: this.editCache04bx[id].data.listCtiet,
        parentId: this.editCache04bx[id].data.parentId,
        ghiChu: this.editCache04bx[id].data.ghiChu,
        next: [],
        checked: false,
        maLoai:this.editCache04bx[id].data.maLoai,
      };
  
      this.kt = false;
      this.addEqual(this.chiTietBcao4bx, item, index);
      if (!this.kt) {
        this.addEqual1(this.chiTietBcao4bx, item);
      }
      this.stt = 0;
      this.updateSTT(this.chiTietBcao4bx);
      this.updateLstCTietBCao(maLoai);
      this.disable4bx = false;
    }else if(maLoai==4){
      var item: linkList = {
        id: uuid.v4(),
        vt: 0,
        stt: this.editCache05[id].data.stt,
        maNdungChi: this.editCache05[id].data.maNdungChi,
        maNdungChiParent: this.editCache05[id].data.maNdungChiParent,
        trongDotTcong: this.editCache05[id].data.trongDotTcong,
        trongDotThoc: this.editCache05[id].data.trongDotThoc,
        trongDotGao: this.editCache05[id].data.trongDotGao,
        luyKeTcong: this.editCache05[id].data.luyKeTcong,
        luyKeThoc: this.editCache05[id].data.luyKeThoc,
        luyKeGao: this.editCache05[id].data.luyKeGao,
        listCtiet: this.editCache05[id].data.listCtiet,
        parentId: this.editCache05[id].data.parentId,
        ghiChu: this.editCache05[id].data.ghiChu,
        next: [],
        checked: false,
        maLoai:this.editCache05[id].data.maLoai,
      };
  
      this.kt = false;
      this.addEqual(this.chiTietBcao5, item, index);
      if (!this.kt) {
        this.addEqual1(this.chiTietBcao5, item);
      }
      this.stt = 0;
      this.updateSTT(this.chiTietBcao5);
      this.updateLstCTietBCao(maLoai);
      this.disable5 = false;
    }
    
  }

  // lưu cấp con
  saveEdit2(id: string, index: number,maLoai:any): void {
    if(maLoai==1){
      var item: linkList = {
        id: uuid.v4(),
        vt: 0,
        stt: this.editCache04ax[id].data.stt,
        maNdungChi: this.editCache04ax[id].data.maNdungChi,
        maNdungChiParent: this.editCache04ax[id].data.maNdungChiParent,
        trongDotTcong: this.editCache04ax[id].data.trongDotTcong,
        trongDotThoc: this.editCache04ax[id].data.trongDotThoc,
        trongDotGao: this.editCache04ax[id].data.trongDotGao,
        luyKeTcong: this.editCache04ax[id].data.luyKeTcong,
        luyKeThoc: this.editCache04ax[id].data.luyKeThoc,
        luyKeGao: this.editCache04ax[id].data.luyKeGao,
        listCtiet: this.editCache04ax[id].data.listCtiet,
        parentId: this.editCache04ax[id].data.parentId,
        ghiChu: this.editCache04ax[id].data.ghiChu,
        next: [],
        checked: false,
        maLoai:this.editCache04ax[id].data.maLoai,
      };
  
      this.kt = false;
      this.addLess(this.chiTietBcao4ax, item, index);
      if (!this.kt) {
        this.addLess1(this.chiTietBcao4ax, item);
      }
      this.stt = 0;
      this.updateSTT(this.chiTietBcao4ax);
      this.updateLstCTietBCao(maLoai);
      this.disable4ax = false;
    }else if(maLoai==2){
      var item1: linkList = {
        id: uuid.v4(),
        vt: 0,
        stt: this.editCache04an[id].data.stt,
        maNdungChi: this.editCache04an[id].data.maNdungChi,
        maNdungChiParent: this.editCache04an[id].data.maNdungChiParent,
        trongDotTcong: this.editCache04an[id].data.trongDotTcong,
        trongDotThoc: this.editCache04an[id].data.trongDotThoc,
        trongDotGao: this.editCache04an[id].data.trongDotGao,
        luyKeTcong: this.editCache04an[id].data.luyKeTcong,
        luyKeThoc: this.editCache04an[id].data.luyKeThoc,
        luyKeGao: this.editCache04an[id].data.luyKeGao,
        listCtiet: this.editCache04an[id].data.listCtiet,
        parentId: this.editCache04an[id].data.parentId,
        ghiChu: this.editCache04an[id].data.ghiChu,
        next: [],
        checked: false,
        maLoai:this.editCache04an[id].data.maLoai,
      };
  
      this.kt = false;
      this.addLess(this.chiTietBcao4an, item1, index);
      if (!this.kt) {
        this.addLess1(this.chiTietBcao4an, item1);
      }
      this.stt = 0;
      this.updateSTT(this.chiTietBcao4an);
      this.updateLstCTietBCao(maLoai);
      this.disable4an = false;
    }else if(maLoai==3){
      var item2: linkList = {
        id: uuid.v4(),
        vt: 0,
        stt: this.editCache04bx[id].data.stt,
        maNdungChi: this.editCache04bx[id].data.maNdungChi,
        maNdungChiParent: this.editCache04bx[id].data.maNdungChiParent,
        trongDotTcong: this.editCache04bx[id].data.trongDotTcong,
        trongDotThoc: this.editCache04bx[id].data.trongDotThoc,
        trongDotGao: this.editCache04bx[id].data.trongDotGao,
        luyKeTcong: this.editCache04bx[id].data.luyKeTcong,
        luyKeThoc: this.editCache04bx[id].data.luyKeThoc,
        luyKeGao: this.editCache04bx[id].data.luyKeGao,
        listCtiet: this.editCache04bx[id].data.listCtiet,
        parentId: this.editCache04bx[id].data.parentId,
        ghiChu: this.editCache04bx[id].data.ghiChu,
        next: [],
        checked: false,
        maLoai:this.editCache04bx[id].data.maLoai,
      };
  
      this.kt = false;
      this.addLess(this.chiTietBcao4bx, item2, index);
      if (!this.kt) {
        this.addLess1(this.chiTietBcao4bx, item2);
      }
      this.stt = 0;
      this.updateSTT(this.chiTietBcao4bx);
      this.updateLstCTietBCao(maLoai);
      this.disable4bx = false;
    }else if(maLoai==4){
      var item3: linkList = {
        id: uuid.v4(),
        vt: 0,
        stt: this.editCache05[id].data.stt,
        maNdungChi: this.editCache05[id].data.maNdungChi,
        maNdungChiParent: this.editCache05[id].data.maNdungChiParent,
        trongDotTcong: this.editCache05[id].data.trongDotTcong,
        trongDotThoc: this.editCache05[id].data.trongDotThoc,
        trongDotGao: this.editCache05[id].data.trongDotGao,
        luyKeTcong: this.editCache05[id].data.luyKeTcong,
        luyKeThoc: this.editCache05[id].data.luyKeThoc,
        luyKeGao: this.editCache05[id].data.luyKeGao,
        listCtiet: this.editCache05[id].data.listCtiet,
        parentId: this.editCache05[id].data.parentId,
        ghiChu: this.editCache05[id].data.ghiChu,
        next: [],
        checked: false,
        maLoai:this.editCache05[id].data.maLoai,
      };
  
      this.kt = false;
      this.addLess(this.chiTietBcao5, item3, index);
      if (!this.kt) {
        this.addLess1(this.chiTietBcao5, item3);
      }
      this.stt = 0;
      this.updateSTT(this.chiTietBcao5);
      this.updateLstCTietBCao(maLoai);
      this.disable5 = false;
    }
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

  tranferData(data: linkList, item: ItemDataMau04a1) {
    data.id = item.id,
    data.maNdungChi = item.maNdungChi;
    data.maNdungChiParent = item.maNdungChiParent;
    data.trongDotTcong = item.trongDotTcong;
    data.trongDotThoc = item.trongDotThoc;
    data.trongDotGao = item.trongDotGao;
    data.luyKeTcong = item.luyKeTcong;
    data.luyKeThoc = item.luyKeThoc;
    data.luyKeGao = item.luyKeGao;
    data.listCtiet = item.listCtiet;
    data.parentId = item.parentId;
    data.ghiChu = item.ghiChu;
  }

  tinhtong(id:any,maLoai:any){
    if(maLoai==1){
      let tonglstChitietVtuTrongDot=0;
      if(this.editCache04ax[id].data.listCtiet.length!=0){
        this.editCache04ax[id].data.listCtiet.forEach(e => {
          tonglstChitietVtuTrongDot +=e.sl;
        })
      }
  
      this.editCache04ax[id].data.trongDotTcong = this.editCache04ax[id].data.trongDotThoc + this.editCache04ax[id].data.trongDotGao + tonglstChitietVtuTrongDot;
  
      let tonglstChitietVtuLuyke =0;
      if(this.editCache04ax[id].data.listCtiet.length!=0){
        this.editCache04ax[id].data.listCtiet.forEach(e => {
          tonglstChitietVtuLuyke +=e.sl;
        })
      }
      this.editCache04ax[id].data.luyKeTcong = this.editCache04ax[id].data.luyKeThoc + this.editCache04ax[id].data.luyKeGao + tonglstChitietVtuLuyke;
    }else if(maLoai==2){
      let tonglstChitietVtuTrongDot=0;
      if(this.editCache04an[id].data.listCtiet.length!=0){
        this.editCache04an[id].data.listCtiet.forEach(e => {
          tonglstChitietVtuTrongDot +=e.sl;
        })
      }

      this.editCache04an[id].data.trongDotTcong = this.editCache04an[id].data.trongDotThoc + this.editCache04an[id].data.trongDotGao + tonglstChitietVtuTrongDot;

      let tonglstChitietVtuLuyke =0;
      if(this.editCache04an[id].data.listCtiet.length!=0){
        this.editCache04an[id].data.listCtiet.forEach(e => {
          tonglstChitietVtuLuyke +=e.sl;
        })
      }
      this.editCache04an[id].data.luyKeTcong = this.editCache04an[id].data.luyKeThoc + this.editCache04an[id].data.luyKeGao + tonglstChitietVtuLuyke;
    }else if(maLoai==3){
      let tonglstChitietVtuTrongDot=0;
      if(this.editCache04bx[id].data.listCtiet.length!=0){
        this.editCache04bx[id].data.listCtiet.forEach(e => {
          tonglstChitietVtuTrongDot +=e.sl;
        })
      }

      this.editCache04bx[id].data.trongDotTcong = this.editCache04bx[id].data.trongDotThoc + this.editCache04bx[id].data.trongDotGao + tonglstChitietVtuTrongDot;

      let tonglstChitietVtuLuyke =0;
      if(this.editCache04bx[id].data.listCtiet.length!=0){
        this.editCache04bx[id].data.listCtiet.forEach(e => {
          tonglstChitietVtuLuyke +=e.sl;
        })
      }
      this.editCache04bx[id].data.luyKeTcong = this.editCache04bx[id].data.luyKeThoc + this.editCache04bx[id].data.luyKeGao + tonglstChitietVtuLuyke;
    }else if(maLoai==4){
      let tonglstChitietVtuTrongDot=0;
      if(this.editCache05[id].data.listCtiet.length!=0){
        this.editCache05[id].data.listCtiet.forEach(e => {
          tonglstChitietVtuTrongDot +=e.sl;
        })
      }

      this.editCache05[id].data.trongDotTcong = this.editCache05[id].data.trongDotThoc + this.editCache05[id].data.trongDotGao + tonglstChitietVtuTrongDot;

      let tonglstChitietVtuLuyke =0;
      if(this.editCache05[id].data.listCtiet.length!=0){
        this.editCache05[id].data.listCtiet.forEach(e => {
          tonglstChitietVtuLuyke +=e.sl;
        })
      }
      this.editCache05[id].data.luyKeTcong = this.editCache05[id].data.luyKeThoc + this.editCache05[id].data.luyKeGao + tonglstChitietVtuLuyke;
    }
    
  }

//checkox trên tùng row
updateSingleCheckedBcao(maLoai:any): void {
  if(maLoai==1){
    if (this.lstCTietBCao04ax.every((item) => !item.checked)) {
      this.allChecked1 = false;
      // this.indeterminate1 = false;
    } else if (this.lstCTietBCao04ax.every((item) => item.checked)) {
      this.allChecked1 = true;
      // this.indeterminate1 = false;
    } else {
      // this.indeterminate1 = true;
    }
  }else if(maLoai==2){
    if (this.lstCTietBCao04an.every((item) => !item.checked)) {
      this.allChecked2 = false;
      // this.indeterminate2 = false;
    } else if (this.lstCTietBCao04an.every((item) => item.checked)) {
      this.allChecked2 = true;
      // this.indeterminate2 = false;
    } else {
      // this.indeterminate2 = true;
    }
  }else if(maLoai==3){
    if (this.lstCTietBCao04bx.every((item) => !item.checked)) {
      this.allChecked3 = false;
      // this.indeterminate3 = false;
    } else if (this.lstCTietBCao04bx.every((item) => item.checked)) {
      this.allChecked3 = true;
      // this.indeterminate3 = false;
    } else {
      // this.indeterminate3 = true;
    }
  }else if(maLoai==4){
    if (this.lstCTietBCao05.every((item) => !item.checked)) {
      this.allChecked4 = false;
      // this.indeterminate4 = false;
    } else if (this.lstCTietBCao05.every((item) => item.checked)) {
      this.allChecked4 = true;
      // this.indeterminate4 = false;
    } else {
      // this.indeterminate4 = true;
    }
  }
  
}

  //mau bao cao 02 -----------------------------------------------------
  /////////////////////////////////////////////////////////////////////////////////////////

  lstCTietBCao02: ItemDataMau02[] = [];
  lstCTietBCao1: ItemDataMau02[] = [ ];
  lstCTietBCao2: ItemDataMau02[] = [ ];
  editCache1: { [key: string]: { edit: boolean; data: ItemDataMau02 } } = {}; // phuc vu nut chinh
  editCache2: { [key: string]: { edit: boolean; data: ItemDataMau02 } } = {}; // phuc vu nut chinh
  listDonvitinh:any []=[];

  //check all input
  updateAllChecked02(): void {
    this.indeterminate02 = false;
    if(this.allChecked02){

      this.lstCTietBCao1 = this.lstCTietBCao1.map((item) => ({
        ...item,
        checked: true,
      }));
      this.lstCTietBCao2 = this.lstCTietBCao2.map((item) => ({
        ...item,
        checked: true,
      }));
    }else{
      this.lstCTietBCao1 = this.lstCTietBCao1.map((item) => ({
        ...item,
        checked: false,
      }));
      this.lstCTietBCao2 = this.lstCTietBCao2.map((item) => ({
        ...item,
        checked: false,
      }));
    }

  }

  // xoa dong
  deleteById02(id: any,loaiList:any): void {
    if(loaiList=='1'){
      this.lstCTietBCao1 = this.lstCTietBCao1.filter((item) => item?.id != id);
      if (typeof id == 'number') {
        this.lstIdDeleteMau02 += id + ',';
        let objecDele ={
          maLoai:'4',
          lstIdDelete:this.lstIdDeleteMau02
        }
        this.lstDeleteCTietBCao.push(objecDele);
      }
    }else{
      this.lstCTietBCao2 = this.lstCTietBCao2.filter((item) => item?.id != id);
      if (typeof id == 'number') {
        this.lstIdDeleteMau02 += id + ',';
        let objecDele ={
          maLoai:'4',
          lstIdDelete:this.lstIdDeleteMau02
        }
        this.lstDeleteCTietBCao.push(objecDele);
      }
    }
  }

  //chọn row cần sửa và trỏ vào template
  startEdit02(id: string,loaiList:any): void {
    if(loaiList=='1'){
      this.editCache1[id].edit = true;
    }else{
      this.editCache2[id].edit = true;
    }

  }

  addLine02(idx:any, loaiList:any): void {

    var loaiDonVi ;
    var parentID:any;
    if(loaiList=='1'){
      loaiDonVi='dv';
      parentID=1;
    }else{
      loaiDonVi='tc';
      parentID=2;
    }
    let item: ItemDataMau02 = {
      id: uuid.v4(),
      stt: 0,
      index:0,
      maVtu: '',
      maDviTinh: null,
      soQd: null,
      khSoLuong: null,
      khGiaMuaTd: null,
      khTtien: null,
      thSoLuong:null,
      thGiaMuaTd:null,
      thTtien:null,
      ghiChu:null,
      maVtuHeader:parentID,
      loai:loaiDonVi,
      checked!: false,
    };
    if(loaiList=='1'){
      this.lstCTietBCao1.splice(idx, 0, item);
      this.editCache1[item.id] = {
        edit: true,
        data: { ...item },
      };
    }else{
      this.lstCTietBCao2.splice(idx, 0, item);
      this.editCache2[item.id] = {
        edit: true,
        data: { ...item },
      };
    }
  }

  //checkox trên tùng row
  updateSingleChecked02(): void {
    if ((this.lstCTietBCao1.every((item) => !item.checked)) && (this.lstCTietBCao2.every((item)=> !item.checked))) {
      this.allChecked02 = false;
      this.indeterminate02 = true;
    } else if ((this.lstCTietBCao1.every((item) => item.checked)) && (this.lstCTietBCao2.every((item) => item.checked)) ) {
      this.allChecked02 = true;
      this.indeterminate02 = false;
    } else {
      this.indeterminate02 = true;
    }
  }

  //tinh toan tong so
  changeModel02(id: string,loaiList:any){
    if(loaiList=='1'){
      this.editCache1[id].data.khTtien = Number(this.editCache1[id].data.khSoLuong) * Number(this.editCache1[id].data.khGiaMuaTd);
      this.editCache1[id].data.thTtien = Number(this.editCache1[id].data.thSoLuong) * Number(this.editCache1[id].data.thGiaMuaTd);
    }else{
      this.editCache2[id].data.khTtien = Number(this.editCache2[id].data.khSoLuong) * Number(this.editCache2[id].data.khGiaMuaTd);
      this.editCache2[id].data.thTtien = Number(this.editCache2[id].data.thSoLuong) * Number(this.editCache2[id].data.thGiaMuaTd);
    }
  }


  //update khi sửa
  saveEdit02(id: string,loaiList:any): void {
    if(loaiList=='1'){
      this.editCache1[id].data.checked = this.lstCTietBCao1.find(
        (item) => item.id === id,
      ).checked; // set checked editCache = checked lstCTietBCao
      const index = this.lstCTietBCao1.findIndex((item) => item.id === id); // lay vi tri hang minh sua
      Object.assign(this.lstCTietBCao1[index], this.editCache1[id].data); // set lai data cua lstCTietBCao[index] = this.editCache[id].data
      this.editCache1[id].edit = false; // CHUYEN VE DANG TEXT
    }else{
      this.editCache2[id].data.checked = this.lstCTietBCao2.find(
        (item) => item.id === id,
      ).checked; // set checked editCache = checked lstCTietBCao
      const index = this.lstCTietBCao2.findIndex((item) => item.id === id); // lay vi tri hang minh sua
      Object.assign(this.lstCTietBCao2[index], this.editCache2[id].data); // set lai data cua lstCTietBCao[index] = this.editCache[id].data
      this.editCache2[id].edit = false; // CHUYEN VE DANG TEXT
    }

  }
  //hủy thao tác sửa update lại giá trị ban đầu
  cancelEdit02(id: string, loaiList:any): void {
    if(loaiList=='1'){
      const index = this.lstCTietBCao1.findIndex((item) => item.id === id); // lay vi tri hang minh sua
      this.editCache1[id] = {
        data: { ...this.lstCTietBCao1[index] },
        edit: false,
      };
    }else{
      const index = this.lstCTietBCao2.findIndex((item) => item.id === id); // lay vi tri hang minh sua
      this.editCache2[id] = {
        data: { ...this.lstCTietBCao2[index] },
        edit: false,
      };
    }
  }

  // xóa với checkbox
  deleteSelected02() {
    // add list delete id
    this.lstCTietBCao1.filter((item) => {
      if (item.checked == true && typeof item.id == 'number') {
        this.lstIdDeleteMau02 += item.id + ',';
      }

    });
    this.lstCTietBCao2.filter((item) => {
      if (item.checked == true && typeof item.id == 'number') {
        this.lstIdDeleteMau02 += item.id + ',';
      }

    });
    // delete object have checked = true
    this.lstCTietBCao1 = this.lstCTietBCao1.filter(
      (item) => item.checked != true,
    );
    this.lstCTietBCao2 = this.lstCTietBCao2.filter(
      (item) => item.checked != true,
    );
    this.allChecked02 = false;
  }

  updateEditCache02(): void {
    this.lstCTietBCao1.forEach((item) => {
      this.editCache1[item.id] = {
        edit: false,
        data: { ...item },
      };
    });
    this.lstCTietBCao2.forEach((item) => {
      this.editCache2[item.id] = {
        edit: false,
        data: { ...item },
      };
    });
  }

  async saveMau02(){
    this.lstCTietBCao02 =[];
    await this.lstCTietBCao1.forEach(e => {
      this.lstCTietBCao02.push(e);
    })

    await this.lstCTietBCao2.forEach(e => {
      this.lstCTietBCao02.push(e);
    })

    this.lstCTietBCao02.forEach(e =>{
      if (typeof e.id != 'number') {
        e.id = null;
      }
    })
    this.updateEditCache02();
  }

  //Mau 03 ----------------------------------------------------------------------
  /////////////////////////////////////////////////////////////////////////////////////
  lstCTietBCao03: ItemDataMau03[] = [];
  lstCTietBCao031: ItemDataMau03[] = [];
  lstCTietBCao032: ItemDataMau03[] = [];
  lstCTietBCao033: ItemDataMau03[] = [];

  editCache031: { [key: string]: { edit: boolean; data: ItemDataMau03 } } = {}; // phuc vu nut chinh
  editCache032: { [key: string]: { edit: boolean; data: ItemDataMau03 } } = {}; // phuc vu nut chinh
  editCache033: { [key: string]: { edit: boolean; data: ItemDataMau03 } } = {}; // phuc vu nut chinh

  //check all input
  updateAllChecked03(): void {
    this.indeterminate03 = false;
    if(this.allChecked03){

      this.lstCTietBCao031 = this.lstCTietBCao031.map((item) => ({
        ...item,
        checked: true,
      }));
      this.lstCTietBCao032 = this.lstCTietBCao032.map((item) => ({
        ...item,
        checked: true,
      }));
      this.lstCTietBCao033 = this.lstCTietBCao033.map((item) => ({
        ...item,
        checked: true,
      }));
    }else{
      this.lstCTietBCao031 = this.lstCTietBCao031.map((item) => ({
        ...item,
        checked: false,
      }));
      this.lstCTietBCao032 = this.lstCTietBCao032.map((item) => ({
        ...item,
        checked: false,
      }));
      this.lstCTietBCao033 = this.lstCTietBCao033.map((item) => ({
        ...item,
        checked: false,
      }));
    }
  }

  // xoa dong
  deleteById03(id: any,loaiList:any): void {
    if(loaiList=='1'){
      this.lstCTietBCao031 = this.lstCTietBCao031.filter((item) => item.id != id);
      if (typeof id == 'number') {
        this.lstIdDeleteMau03 += id + ',';
        let objecDele = {
          maLoai:'5',
          lstIdDelete:this.lstIdDeleteMau03,
        }
        this.lstDeleteCTietBCao.push(objecDele);
      }
    }else if(loaiList=='2'){
      this.lstCTietBCao032 = this.lstCTietBCao032.filter((item) => item.id != id);
      if (typeof id == 'number') {
        this.lstIdDeleteMau03 += id + ',';
        let objecDele = {
          maLoai:'5',
          lstIdDelete:this.lstIdDeleteMau03,
        }
        this.lstDeleteCTietBCao.push(objecDele);
      }
    }else{
      this.lstCTietBCao033 = this.lstCTietBCao033.filter((item)=> item.id!=id);
      if(typeof id =='number'){
        this.lstIdDeleteMau03 +=id +',';
        let objecDele = {
          maLoai:'5',
          lstIdDelete:this.lstIdDeleteMau03,
        }
        this.lstDeleteCTietBCao.push(objecDele);
      }
    }    
  }


  //chọn row cần sửa và trỏ vào template
  startEdit03(id: string, loaiList:any): void {
    if(loaiList=='1'){
      this.editCache031[id].edit = true;
    }else if(loaiList=='2'){
      this.editCache032[id].edit = true;
    }else{
      this.editCache033[id].edit = true;
    }
  }

  addLine03(idx:any,loaiList:any): void {
    var loai:any;
    var parentId:any;
    if(loaiList=='1'){
      loai=1;
      parentId=1;
    }else if(loaiList=='2'){
      loai=2;
      parentId=2;
    }else{
      loai=3;
      parentId=3;
    }

    let item: ItemDataMau03 = {
      id: uuid.v4(),
      stt: 0,
      maVtu: '',
      maDviTinh: '',
      soLuongKhoach: '',
      soLuongTte: 0,
      dgGiaKhoach: 0,
      dgGiaBanTthieu: 0,
      dgGiaBanTte:0,
      ttGiaHtoan:0,
      ttGiaBanTte:0,
      ttClechGiaTteVaGiaHtoan:0,
      ghiChu:0,
      maVtuHeader:parentId,
      loai:loai,
      checked: false,
    };
    
    if(loaiList=='1'){
      this.lstCTietBCao031.splice(idx, 0, item);
      this.editCache031[item.id] = {
        edit: true,
        data: { ...item },
      };
    }else if(loaiList=='2'){
      this.lstCTietBCao032.splice(idx, 0, item);
      this.editCache032[item.id] = {
        edit: true,
        data: { ...item },
      };
    }else{
      this.lstCTietBCao033.splice(idx, 0, item);
      this.editCache033[item.id] = {
        edit: true,
        data: { ...item },
      };
    }
  }

 //checkox trên tùng row
 updateSingleChecked03(): void {
    if ((this.lstCTietBCao031.every((item) => !item.checked)) && (this.lstCTietBCao032.every((item)=> !item.checked)) && (this.lstCTietBCao033.every((item)=> !item.checked))) {
      this.allChecked03 = false;
      this.indeterminate03 = true;
    } else if ((this.lstCTietBCao031.every((item) => item.checked)) && (this.lstCTietBCao032.every((item) => item.checked)) && (this.lstCTietBCao033.every((item) => item.checked))) {
      this.allChecked03 = true;
      this.indeterminate03 = false;
    } else {
      this.indeterminate03 = true;
    }
  }

  //tinh tong
  changeModel03(id:any, loaiList:any){
    if(loaiList=='1'){
      this.editCache031[id].data.ttGiaHtoan = this.editCache031[id].data.soLuongTte * this.editCache031[id].data.dgGiaKhoach;
      this.editCache031[id].data.ttGiaBanTte = this.editCache031[id].data.soLuongTte * this.editCache031[id].data.dgGiaBanTte;
      this.editCache031[id].data.ttClechGiaTteVaGiaHtoan = this.editCache031[id].data.ttGiaBanTte - this.editCache031[id].data.ttGiaHtoan;
    }else if (loaiList=='2'){
      this.editCache032[id].data.ttGiaHtoan = this.editCache032[id].data.soLuongTte * this.editCache032[id].data.dgGiaKhoach;
      this.editCache032[id].data.ttGiaBanTte = this.editCache032[id].data.soLuongTte * this.editCache032[id].data.dgGiaBanTte;
      this.editCache032[id].data.ttClechGiaTteVaGiaHtoan = this.editCache032[id].data.ttGiaBanTte - this.editCache032[id].data.ttGiaHtoan;
    }else{
      this.editCache033[id].data.ttGiaHtoan = this.editCache033[id].data.soLuongTte * this.editCache033[id].data.dgGiaKhoach;
      this.editCache033[id].data.ttGiaBanTte = this.editCache033[id].data.soLuongTte * this.editCache033[id].data.dgGiaBanTte;
      this.editCache033[id].data.ttClechGiaTteVaGiaHtoan = this.editCache033[id].data.ttGiaBanTte - this.editCache033[id].data.ttGiaHtoan;
    }
  }

   //update khi sửa
   saveEdit03(id: string,loaiList:any): void {
    if(loaiList=='1'){
      this.editCache031[id].data.checked = this.lstCTietBCao031.find(
        (item) => item.id === id,
      ).checked; // set checked editCache = checked lstCTietBCao
      const index = this.lstCTietBCao031.findIndex((item) => item.id === id); // lay vi tri hang minh sua
      Object.assign(this.lstCTietBCao031[index], this.editCache031[id].data); // set lai data cua lstCTietBCao[index] = this.editCache[id].data
      this.editCache031[id].edit = false; // CHUYEN VE DANG TEXT
    }else if(loaiList=='2'){
      this.editCache032[id].data.checked = this.lstCTietBCao032.find(
        (item) => item.id === id,
      ).checked; // set checked editCache = checked lstCTietBCao
      const index = this.lstCTietBCao032.findIndex((item) => item.id === id); // lay vi tri hang minh sua
      Object.assign(this.lstCTietBCao032[index], this.editCache032[id].data); // set lai data cua lstCTietBCao[index] = this.editCache[id].data
      this.editCache032[id].edit = false; // CHUYEN VE DANG TEXT
    }else{
      this.editCache033[id].data.checked = this.lstCTietBCao033.find(
        (item) => item.id === id,
      ).checked; // set checked editCache = checked lstCTietBCao
      const index = this.lstCTietBCao033.findIndex((item) => item.id === id); // lay vi tri hang minh sua
      Object.assign(this.lstCTietBCao033[index], this.editCache033[id].data); // set lai data cua lstCTietBCao[index] = this.editCache[id].data
      this.editCache033[id].edit = false; // CHUYEN VE DANG TEXT
    }
  }

  //hủy thao tác sửa update lại giá trị ban đầu
  cancelEdit03(id: string, loaiList:any): void {
    if(loaiList=='1'){
      const index = this.lstCTietBCao031.findIndex((item) => item.id === id); // lay vi tri hang minh sua
      this.editCache031[id] = {
        data: { ...this.lstCTietBCao031[index] },
        edit: false,
      };
    }else if(loaiList=='2'){
      const index = this.lstCTietBCao032.findIndex((item) => item.id === id); // lay vi tri hang minh sua
      this.editCache032[id] = {
        data: { ...this.lstCTietBCao032[index] },
        edit: false,
      };
    }else{
      const index = this.lstCTietBCao033.findIndex((item) => item.id === id); // lay vi tri hang minh sua
      this.editCache033[id] = {
        data: { ...this.lstCTietBCao033[index] },
        edit: false,
      };
    }
  }

  // xóa với checkbox
  deleteSelected03() {
    // add list delete id
    this.lstCTietBCao031.filter((item) => {
      if (item.checked == true && typeof item.id == 'number') {
        this.lstIdDeleteMau03 += item.id + ',';
      }

    });
    this.lstCTietBCao032.filter((item) => {
      if (item.checked == true && typeof item.id == 'number') {
        this.lstIdDeleteMau03 += item.id + ',';
      }

    });
    this.lstCTietBCao033.filter((item) => {
      if (item.checked == true && typeof item.id == 'number') {
        this.lstIdDeleteMau03 += item.id + ',';
      }

    });
    // delete object have checked = true
    this.lstCTietBCao031 = this.lstCTietBCao031.filter(
      (item) => item.checked != true,
    );
    this.lstCTietBCao032 = this.lstCTietBCao032.filter(
      (item) => item.checked != true,
    );
    this.lstCTietBCao033 = this.lstCTietBCao033.filter(
      (item) => item.checked != true,
    );
    this.allChecked03 = false;
  }

  updateEditCache03(): void {
    this.lstCTietBCao031.forEach((item) => {
      this.editCache031[item.id] = {
        edit: false,
        data: { ...item },
      };
    });
    this.lstCTietBCao032.forEach((item) => {
      this.editCache032[item.id] = {
        edit: false,
        data: { ...item },
      };
    });
    this.lstCTietBCao033.forEach((item) => {
      this.editCache033[item.id] = {
        edit: false,
        data: { ...item },
      };
    });
  }

  async saveMau03(){
    this.lstCTietBCao03 =[];
   await this.lstCTietBCao031.forEach(e => {
      this.lstCTietBCao03.push(e);
    })

   await this.lstCTietBCao032.forEach(e => {
      this.lstCTietBCao03.push(e);
    })
   await this.lstCTietBCao033.forEach(e =>{
      this.lstCTietBCao03.push(e);
    })
    this.lstCTietBCao03.forEach(e =>{
      if (typeof e.id != 'number') {
        e.id = null;
      }
    })
    this.updateEditCache03();
  }
}
