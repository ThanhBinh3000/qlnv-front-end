import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MESSAGE } from 'src/app/constants/message';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { BAOCAODOT, BAOCAONAM, NOTOK, OK, TRANGTHAIPHULUC, Utils } from 'src/app/Utility/utils';
import { BAO_CAO_NHAP_HANG_DTQG, BAO_CAO_XUAT_HANG_DTQG, LISTBIEUMAUDOT, LISTBIEUMAUNAM, TAB_SELECTED,SOLAMA, BAO_CAO_CHI_TIET_THUC_HIEN_PHI_XUAT_HANG_DTQG } from './bao-cao.constant';
import * as uuid from 'uuid';
import { DialogChonThemBieuMauBaoCaoComponent } from 'src/app/components/dialog/dialog-chon-them-bieu-mau-bao-cao-kqth-von-phi-hang-DTQG/dialog-chon-them-bieu-mau-bao-cao-kqth-von-phi-hang-DTQG.component';
import { NzModalService } from 'ng-zorro-antd/modal';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { NgxSpinnerService } from 'ngx-spinner';

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
  listIdDeleteFiles: string= '';
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
  maVtu: number;
  maDviTinh: number;
  soLuongKhoach: string;
  soLuongTte: number;
  dgGiaKhoach: number;
  dgGiaBanTthieu: number;
  dgGiaBanTte:any;
  ttGiaHtoan:any;
  ttGiaBanTte:any;
  ttClechGiaTteVaGiaHtoan:number;
  ghiChu:any;
  maVtuHeader:any;
  loai:any;
  checked!: boolean;
}


export class ItemDataMau04a1{
  id: any;
  stt: string;
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
  level:number;  //level chỉ dùng để in các stt thụt lùi trong html
  maLoai: number;
}

export class vatTu {
  id: number;
  maVtu: any;
  loaiMatHang: any;
  colName: any;
  sl: any;
  col:number;
}
@Component({
  selector: 'app-bao-cao',
  templateUrl: './bao-cao.component.html',
  styleUrls: ['./bao-cao.component.scss']
})
export class BaoCaoComponent implements OnInit {

  constructor(
    private nguoiDungSerivce : UserService,
    private notification: NzNotificationService,
    private route:Router,
    private router: ActivatedRoute,
    private danhMucService :DanhMucHDVService,
    private quanLyVonPhiService:QuanLyVonPhiService,
    private datePipe : DatePipe,
    private modal: NzModalService,
    private spinner: NgxSpinnerService,
  ) { }


  statusBtnDel: boolean; // trang thai an/hien nut xoa
  statusBtnSave: boolean; // trang thai an/hien nut luu
  statusBtnApprove: boolean; // trang thai an/hien nut trinh duyet
  statusBtnTBP: boolean; // trang thai an/hien nut truong bo phan
  statusBtnLD: boolean; // trang thai an/hien nut lanh dao
  statusBtnGuiDVCT: boolean; // trang thai nut gui don vi cap tren
  statusBtnDVCT: boolean; // trang thai nut don vi cap tren
  statusBtnOk:boolean; //trang thai nut ok - not ok


  //
  donViTaos:any[]=[];
  userInfor:any;
  maDonViTao:any;

  
  totalElements = 0;
  totalPages = 0;
  pages = {
    size: 10,
    page: 1,
  }
  status:boolean;
  beforeUpload:any;
  fileList:any;

  //nhóm biến router
  id:any; // id của bản ghi
  maLoaiBaoCaoParam:any;  // phân biệt 2 loại báo cáo (năm hoặc đợt)


  //----
  listVattu:any [] =[];
  baoCao:ItemDanhSach = new ItemDanhSach();
  currentday = new Date();
  maPhanBcao:string ='1'; //phân biệt phần giữa 3.2.9 và 3.2.8 
  maLoaiBaocao:any;
  listDonvitinh:any []=[];

  //nhóm biến biểu mẫu
  allChecked:any;
  indeterminate:boolean;
  tabSelected:number;
  tab =TAB_SELECTED;


  //nhóm biến biểu mẫu 02------------------
  allChecked02:any;
  indeterminate02:boolean;
  lstCTietBCao02: ItemDataMau02[] = [];
  lstCTietBCao1: ItemDataMau02 [] =[];
  lstCTietBCao2:ItemDataMau02 [] =[];
  editCache1: { [key: string]: { edit: boolean; data: ItemDataMau02 } } = {};
  editCache2: { [key: string]: { edit: boolean; data: ItemDataMau02 } } = {};
  lstIdDeleteMau02:string ='';
  lstDeleteCTietBCao: any = [];

  //nhóm biến biểu mẫu 03----------
  allChecked03:any;
  indeterminate03:boolean;
  lstCTietBCao03: ItemDataMau03[] = [];
  lstCTietBCao031:ItemDataMau03[] = [];
  lstCTietBCao032:ItemDataMau03[] = [];
  lstCTietBCao033:ItemDataMau03[] = [];
  editCache031: { [key: string]: { edit: boolean; data: ItemDataMau03 } } = {};
  editCache032: { [key: string]: { edit: boolean; data: ItemDataMau03 } } = {};
  editCache033: { [key: string]: { edit: boolean; data: ItemDataMau03 } } = {};
  lstIdDeleteMau03:string ='';

  //nhóm biến biểu mẫu 04 --> 05
  vt: number;
  stt: number;
  kt: boolean;
  disable: boolean = false;
  soLaMa: any[] = SOLAMA;
  lstCTietBaoCaoTemp:any []=[];
  lstCTietBCao04ax: ItemDataMau04a1[] = [];
  editCache: { [key: string]: { edit: boolean; data: any } } = {};
  cols4ax: number = 0;
  cols4an: number = 0;
  cols4bx: number = 0;
  cols05: number = 0;
  allChecked1:any;
  listColTrongDot4ax:any []=[];
  listColTrongDot4an:any []=[];
  listColTrongDot4bx:any []=[];
  listColTrongDot05:any []=[];
  idVatTu:any;
  listColTemp:any []=[];
  cols:number=0;
  async ngOnInit() {
    this.cols = 3;

    let userName = this.nguoiDungSerivce.getUserName();
    await this.getUserInfo(userName); //get user info
    this.maDonViTao = this.userInfor?.dvql;

    this.maLoaiBaoCaoParam = this.router.snapshot.paramMap.get('loai');
    this.id = this.router.snapshot.paramMap.get('id');
    
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
    if(this.id!=null){
      // gọi xem chi tiết
    }else{
      //tạo mã báo cáo
      this.quanLyVonPhiService.taoMaBaoCao().toPromise().then(
        (res) => {
          if (res.statusCode == 0) {            
            this.baoCao.maBcao = res.data.data;
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
      
      if(this.maLoaiBaoCaoParam ==BAOCAODOT){
        await this.quanLyVonPhiService.sinhDotBaoCao().toPromise().then( res =>{
          if(res.statusCode==0){            
            this.baoCao.dotBcao = res.data;
          }else{
            this.notification.error(MESSAGE.ERROR,res?.msg);
          }
        },err => {
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        })
        this.maLoaiBaocao = BAOCAODOT;
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
        this.maLoaiBaocao =BAOCAONAM;
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
    this.quanLyVonPhiService.dmDonvitinh().toPromise().then(
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
    
    
    //lay danh sach cac đơn vị quản lý (hn, thái nguyên,...)
    await this.quanLyVonPhiService.dMDonVi().toPromise().then(res => {
      if(res.statusCode==0){
        this.donViTaos =res.data;

      } else {
        this.notification.error(MESSAGE.ERROR,res?.msg);
      }
    },
    (err) => {
      this.notification.error(MESSAGE.ERROR,MESSAGE.SYSTEM_ERROR);
    })
    this.getStatusButton();
  }

  //nhóm các nút chức năng --báo cáo-----
  getStatusButton(){
    let checkParent = false;
    let checkChirld = false;
    let dVi = this.donViTaos.find(e => e.maDvi == this.maDonViTao);
    if(dVi && dVi.maDvi == this.userInfor.dvql){ 
      checkChirld = true;
    }
    if(dVi && dVi.parent?.maDvi == this.userInfor.dvql){
      checkParent = true;
    }
    
    const utils = new Utils();
    this.statusBtnDel = utils.getRoleDel(this.baoCao.trangThai, checkChirld, this.userInfor?.roles[0]?.id);
    this.statusBtnSave = utils.getRoleSave(this.baoCao.trangThai, checkChirld, this.userInfor?.roles[0]?.id);
    this.statusBtnApprove = utils.getRoleApprove(this.baoCao.trangThai, checkChirld, this.userInfor?.roles[0]?.id);
    this.statusBtnTBP = utils.getRoleTBP(this.baoCao.trangThai, checkChirld, this.userInfor?.roles[0]?.id);
    this.statusBtnLD = utils.getRoleLD(this.baoCao.trangThai, checkChirld, this.userInfor?.roles[0]?.id);
    this.statusBtnDVCT = utils.getRoleDVCT(this.baoCao.trangThai, checkParent, this.userInfor?.roles[0]?.id);
    
  }

  //lay thong tin nguoi dang nhap
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

  getStatusName(Status:any){
    const utils = new Utils();
    return utils.getStatusName(Status);
  };


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
          // this.getDetailReport();
        }else{
          this.notification.error(MESSAGE.ERROR, res?.msg);
        }
    },err => {
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    })
    this.spinner.hide();
  }

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
    }

    
    this.updateEditCache02();
    // this.updateEditCache03();
    // this.updateEditCache();
    this.tabSelected = null;
  }
  //nhóm chức năng phụ vụ cho table biểu mẫu (phụ lục) ------------------------------------------

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
  getStatusNameBieuMau(Status:any){
    return TRANGTHAIPHULUC.find(item => item.id ==Number(Status))?.ten;
  }

  changeTab(maPhuLuc){
    this.tabSelected = Number(maPhuLuc);
    this.lstCTietBaoCaoTemp = this.baoCao?.lstBCao.find(item => item.maLoai == maPhuLuc)?.lstCTietBCao;
    if(this.id==null){
      
      }
  }

  updateSingleChecked(){
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

  addPhuLuc() {
    var danhSach:any;    
    if(this.maLoaiBaoCaoParam==BAOCAODOT){
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


  deletePhuLucList(){
    this.baoCao.lstBCao = this.baoCao?.lstBCao.filter(item => item.checked == false);
    if(this.baoCao?.lstBCao?.findIndex(item => Number(item.maLoai) == this.tabSelected) == -1){
      this.tabSelected = null;
    }
    this.allChecked = false;
  }


  // nhóm chúc năng biểu mẫu 02 -------------------------------------------
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


  // xoa dong
  deleteById02(id: any,loaiList:any): void {
    if(loaiList=='1'){
      this.lstCTietBCao1 = this.lstCTietBCao1.filter((item) => item?.id != id);
      if (typeof id == 'number') {
        this.lstIdDeleteMau02 += id + ',';
        let objecDele ={
          maLoai:BAO_CAO_NHAP_HANG_DTQG.toString(),
          lstIdDelete:this.lstIdDeleteMau02
        }
        this.lstDeleteCTietBCao.push(objecDele);
      }
    }else{
      this.lstCTietBCao2 = this.lstCTietBCao2.filter((item) => item?.id != id);
      if (typeof id == 'number') {
        this.lstIdDeleteMau02 += id + ',';
        let objecDele ={
          maLoai:BAO_CAO_NHAP_HANG_DTQG.toString(),
          lstIdDelete:this.lstIdDeleteMau02
        }
        this.lstDeleteCTietBCao.push(objecDele);
      }
    }
  }

  //chọn row cần sửa 
  startEdit02(id: string,loaiList:any): void {
    if(loaiList=='1'){
      this.editCache1[id].edit = true;
    }else{
      this.editCache2[id].edit = true;
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

  // nhóm chức năng biểu mẫu 03 -----------------------------------------------
   ////////////////////////////////////////////////////////////////////////
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
      maVtu: 0,
      maDviTinh: 0,
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

  deleteById03(id: any,loaiList:any): void {
    if(loaiList=='1'){
      this.lstCTietBCao031 = this.lstCTietBCao031.filter((item) => item.id != id);
      if (typeof id == 'number') {
        this.lstIdDeleteMau03 += id + ',';
        let objecDele = {
          maLoai:BAO_CAO_XUAT_HANG_DTQG.toString(),
          lstIdDelete:this.lstIdDeleteMau03,
        }
        this.lstDeleteCTietBCao.push(objecDele);
      }
    }else if(loaiList=='2'){
      this.lstCTietBCao032 = this.lstCTietBCao032.filter((item) => item.id != id);
      if (typeof id == 'number') {
        this.lstIdDeleteMau03 += id + ',';
        let objecDele = {
          maLoai:BAO_CAO_XUAT_HANG_DTQG.toString(),
          lstIdDelete:this.lstIdDeleteMau03,
        }
        this.lstDeleteCTietBCao.push(objecDele);
      }
    }else{
      this.lstCTietBCao033 = this.lstCTietBCao033.filter((item)=> item.id!=id);
      if(typeof id =='number'){
        this.lstIdDeleteMau03 +=id +',';
        let objecDele = {
          maLoai:BAO_CAO_XUAT_HANG_DTQG.toString(),
          lstIdDelete:this.lstIdDeleteMau03,
        }
        this.lstDeleteCTietBCao.push(objecDele);
      }
    }    
  }

  //chọn row cần sửa
  startEdit03(id: string, loaiList:any): void {
    if(loaiList=='1'){
      this.editCache031[id].edit = true;
    }else if(loaiList=='2'){
      this.editCache032[id].edit = true;
    }else{
      this.editCache033[id].edit = true;
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


  //nhóm chức năng biểu mẫu 04 --> 05 --------------------------------
  // chuyển đổi stt đang được mã hóa thành dạng I, II, a, b, c, ...

  sinhMa(): number{
    var i: number = 1;
    var kt: boolean = true;
    while (kt){
      var index1: number = this.listColTrongDot4an.findIndex(item => item.col == i);
      var index2: number = this.listColTrongDot4ax.findIndex(item => item.col == i);
      var index3: number = this.listColTrongDot4bx.findIndex(item => item.col == i);
      var index4: number = this.listColTrongDot05.findIndex(item => item.col == i);
      if (index1 > -1 || index2 >-1 || index3 > -1 || index4 > -1) {
        i++;
      } else {
        kt = false;
      }
    }
    return i;
  }

  addCol(){
    var listVtu: vatTu[]=[];
    var loai:number =0;
    var colname;
    if(this.tabSelected==BAO_CAO_CHI_TIET_THUC_HIEN_PHI_XUAT_HANG_DTQG){
      if (this.idVatTu == undefined ) {
        return;
      }else{
        colname  = this.listVattu.find( (item) => item.id ==this.idVatTu).tenDm;
        let objTrongdot = {
          id: uuid.v4(),
          maVtu: this.idVatTu,
          loaiMatHang: '0',
          colName: colname,
          sl: 0,
          col:this.sinhMa(),
        };
    
        this.listColTrongDot4ax.push(objTrongdot);
        this.cols4ax=0;
        this.cols4ax++;
        this.listColTemp = this.listColTrongDot4ax;
        this.cols = this.cols + this.cols4ax;

        let objTrongD = {
          id: null,
          maVtu: null,
          loaiMatHang: '0',
          colName: null,
          sl: 0,
          col:null,
        };
        let objLke = {
          id: null,
          maVtu: null,
          loaiMatHang: '1',
          colName: null,
          sl: 0,
          col:null,
        };
        this.listColTemp.forEach((e) => {
            objTrongD.id = e.id;
            objTrongD.maVtu= e.maVtu;
            objTrongD.col=e.col;
          
       
            objLke.id= e.id,
            objLke.maVtu= e.maVtu;
            objLke.col=e.col;
          listVtu.push(objTrongD);
          listVtu.push(objLke);
        });
        loai=6;
        this.lstCTietBaoCaoTemp.forEach( e =>{
          if(e.listCtiet.length==0){
            e.listCtiet=listVtu;
          }else{
            var idx = e.listCtiet.findIndex( item =>item.maVtu ===this.idVatTu);
            if(idx==-1){
              e.listCtiet.push(objTrongD);
              e.listCtiet.push(objLke);
            }else{
              this.notification.warning(MESSAGE.WARNING, "Vật tư đã được thêm");
              return;
            }
          }
          
        })
        console.log(this.lstCTietBaoCaoTemp);
        
      }
    }
    
    
    this.updateEditCache();
  }


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
        var str = this.getHead(this.lstCTietBaoCaoTemp[item].stt) + "." + (this.getTail(this.lstCTietBaoCaoTemp[item].stt) + heSo).toString();
        var nho = this.lstCTietBaoCaoTemp[item].stt;
        this.lstCTietBaoCaoTemp.forEach(item => {
            item.stt = item.stt.replace(nho, str);
        })
    })
  }

  //thêm ngang cấp
  addSame(id: any) {
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
    var loai:number =0;
    if(this.tabSelected==BAO_CAO_CHI_TIET_THUC_HIEN_PHI_XUAT_HANG_DTQG){
      this.listColTemp.forEach((e) => {
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
    }
    // them moi phan tu
    let item: ItemDataMau04a1 = {
        id: uuid.v4(),
        stt: head + "." + (tail + 1).toString(),
        maNdungChi: '',
        maNdungChiParent: '',
        trongDotTcong: 0,
        trongDotThoc: 0,
        trongDotGao: 0,
        luyKeTcong: 0,
        luyKeThoc: 0,
        luyKeGao: 0,
        listCtiet: listVtu,
        parentId: null,
        ghiChu: '',
        level:this.lstCTietBaoCaoTemp[index].level, //level chỉ dùng để in các stt thụt lùi trong html
        maLoai: loai,
        checked: false,
    }
    this.lstCTietBaoCaoTemp.splice(ind + 1, 0, item);

    this.editCache[item.id] = {
        edit: true,
        data: { ...item }
    };
  }

  // gan editCache.data == lstCTietBCao
  updateEditCache(): void {
    this.lstCTietBaoCaoTemp.forEach(item => {
        this.editCache[item.id] = {
            edit: false,
            data: { ...item }
        };
    });
  }

  //thêm cấp thấp hơn
  addLow(id: any) {
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
    var loai:number =0;
    if(this.tabSelected==BAO_CAO_CHI_TIET_THUC_HIEN_PHI_XUAT_HANG_DTQG){
      this.listColTemp.forEach((e) => {
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
    }
    // them moi phan tu
    let item: ItemDataMau04a1 = {
      id: uuid.v4(),
      stt: this.lstCTietBaoCaoTemp[index].stt + ".1",
      maNdungChi: '',
      maNdungChiParent: '',
      trongDotTcong: 0,
      trongDotThoc: 0,
      trongDotGao: 0,
      luyKeTcong: 0,
      luyKeThoc: 0,
      luyKeGao: 0,
      listCtiet:listVtu,
      parentId: null,
      ghiChu: '',
      level:this.lstCTietBaoCaoTemp[index].level + 1, //level chỉ dùng để in các stt thụt lùi trong html
      maLoai: loai,
      checked: false,
  }
    this.lstCTietBaoCaoTemp.splice(index + 1, 0, item);

    this.editCache[item.id] = {
        edit: true,
        data: { ...item }
    };
  }

  //xóa dòng
  deleteLine(id: any) {
    var index: number = this.lstCTietBaoCaoTemp.findIndex(e => e.id === id); // vi tri hien tai
    var nho: string = this.lstCTietBaoCaoTemp[index].stt;
    var head: string = this.getHead(this.lstCTietBaoCaoTemp[index].stt); // lay phan dau cua so tt
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

    this.updateEditCache();
  }

  // start edit
  startEdit(id: string): void {
    this.editCache[id].edit = true;
  }

  // huy thay doi
  cancelEdit(id: string): void {
      const index = this.lstCTietBaoCaoTemp.findIndex(item => item.id === id);

      // lay vi tri hang minh sua
      this.editCache[id] = {
          data: { ...this.lstCTietBaoCaoTemp[index] },
          edit: false
      };
  }

  // luu thay doi
  saveEdit(id: string): void {
      this.editCache[id].data.checked = this.lstCTietBaoCaoTemp.find(item => item.id === id).checked; // set checked editCache = checked lstCTietBCao
      const index = this.lstCTietBaoCaoTemp.findIndex(item => item.id === id); // lay vi tri hang minh sua
      Object.assign(this.lstCTietBaoCaoTemp[index], this.editCache[id].data); // set lai data cua lstCTietBCao[index] = this.editCache[id].data
      this.editCache[id].edit = false; // CHUYEN VE DANG TEXT
  }

  updateChecked(id: any){
      var data: ItemDataMau04a1 = this.lstCTietBaoCaoTemp.find(e => e.id === id);
      //đặt các phần tử con có cùng trạng thái với nó
      this.lstCTietBaoCaoTemp.forEach(item => {
          if (item.stt.startsWith(data.stt)){
              item.checked = data.checked;
          }
      })
      //thay đổi các phần tử cha cho phù hợp với tháy đổi của phần tử con
      var index: number = this.lstCTietBaoCaoTemp.findIndex(e => e.stt == this.getHead(data.stt));
      if (index == -1){
          this.allChecked1 = data.checked;
      } else {
          var nho: boolean = this.lstCTietBaoCaoTemp[index].checked;
          while (nho != this.checkAllChild(this.lstCTietBaoCaoTemp[index].stt)){
              this.lstCTietBaoCaoTemp[index].checked = !nho;
              index = this.lstCTietBaoCaoTemp.findIndex(e => e.stt == this.getHead(this.lstCTietBaoCaoTemp[index].stt));
              if (index == -1){
                  this.allChecked1 = !nho;
                  break;
              } 
              nho = this.lstCTietBaoCaoTemp[index].checked;
          }
      }
  }

  //kiểm tra các phần tử con có cùng được đánh dấu hay ko
  checkAllChild(str: string): boolean{
    var nho: boolean = true;
    this.lstCTietBaoCaoTemp.forEach(item => {
        if ((item.stt.startsWith(str)) && (!item.checked) && (item.stt != str)){
            nho = item.checked;
        }
    })
    return nho;
  }


  updateAllChecked(){
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
      this.allChecked1= false;
  }
  
  //thêm phần tử đầu tiên khi bảng rỗng
  addFirst(){
    var listVtu: vatTu[] = [];
    var loai:number =0;
    if(this.tabSelected==BAO_CAO_CHI_TIET_THUC_HIEN_PHI_XUAT_HANG_DTQG){
      this.listColTemp.forEach((e) => {
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
    }

    let item: ItemDataMau04a1 = {
        id: uuid.v4(),
        stt: "0.1",
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
        ghiChu:'',
        level:0, //level chỉ dùng để in các stt thụt lùi trong html
        maLoai:loai,
        checked: false,
       
    }
    this.lstCTietBaoCaoTemp.push(item);

    this.editCache[item.id] = {
        edit: true,
        data: { ...item }
    };
  }


  dong(){}
  xoa(){}
  onSubmit(mcn,text){}
  
  tuChoi(mcn){}
  luu(){}
  
  
  downloadFile(fileName:any){}
  // update all xoa danh sách mẫu báo cáo
  
  

  

  onPageIndexChange(page) {
    this.pages.page = page;
  }

  //doi so luong phan tu tren 1 trang
  onPageSizeChange(size) {
    this.pages.size = size;
  }

  
}
