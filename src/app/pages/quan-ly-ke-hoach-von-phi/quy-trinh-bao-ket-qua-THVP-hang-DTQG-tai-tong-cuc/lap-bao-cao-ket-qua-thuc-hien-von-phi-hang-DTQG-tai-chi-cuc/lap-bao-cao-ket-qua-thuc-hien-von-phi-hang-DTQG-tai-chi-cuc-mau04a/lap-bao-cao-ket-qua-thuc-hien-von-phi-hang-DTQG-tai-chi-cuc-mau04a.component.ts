import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import * as uuid from 'uuid';
import * as fileSaver from 'file-saver';
import { Utils } from 'src/app/Utility/utils';
import { UserService } from 'src/app/services/user.service';
import { DatePipe } from '@angular/common';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ActivatedRoute } from '@angular/router';
import { MESSAGE } from '../../../../../constants/message';
import { LISTBIEUMAUDOT, LISTBIEUMAUNAM, TAB_SELECTED } from './lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-DTQG.constant';
import { NzModalService } from 'ng-zorro-antd/modal';
import { DialogChonThemBieuMauBaoCaoComponent } from 'src/app/components/dialog/dialog-chon-them-bieu-mau-bao-cao-kqth-von-phi-hang-DTQG/dialog-chon-them-bieu-mau-bao-cao-kqth-von-phi-hang-DTQG.component';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';


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
  maLoai!:number;
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
  maVtuParent:any;
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
  maVtuParent:any;
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
}


export class vatTu {
  id: any;
  maVtu: any;
  loaiMatHang: any;
  colName: any;
  sl: any;
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
  ) {}


  statusBtnDel: boolean; // trang thai an/hien nut xoa
  statusBtnSave: boolean; // trang thai an/hien nut luu
  statusBtnApprove: boolean; // trang thai an/hien nut trinh duyet
  statusBtnTBP: boolean; // trang thai an/hien nut truong bo phan
  statusBtnLD: boolean; // trang thai an/hien nut lanh dao
  statusBtnGuiDVCT: boolean; // trang thai nut gui don vi cap tren
  statusBtnDVCT: boolean; // trang thai nut don vi cap tren
  userInfo: any;
  //-------------
  id: any;
  fileList: NzUploadFile[] = [];
  lstFile: any[] = [];
  listFile: File[] = [];
  fileToUpload!: File;
  fileUrl: any;


  loaiBaoCaoParam:any;
  maDonViTao:any;
  trangThaiBanGhi:any;
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
  indeterminate = true; // properties allCheckBox
  status: boolean = false;
  donViTaos: any[] = [];
  userInfor: any;
  currentday: Date = new Date();
  maLoaiBaocao: any;
  
  
  listVattu: any[] = [];
  
  // listVtuTrongDot: any[] = [];
  // listVtuLuyKe: any[] = [];
  // lenghtTh = 0;
  stt: number;
  kt: boolean;
  
  donvitien: any;
  listIdFiles: string;
  statusButton: boolean = false;
  maDvi:any;
  nam:any;
  dotBaocao:any;
  checkxemkhaithac:any;
  

  danhSachChiTietPhuLucTemp: any = [];


  statusB4ax: boolean = false;
  statusB4an: boolean = false;
  disable4ax: boolean = false;
  disable4an: boolean = false;
  lstCTietBCao04ax: ItemDataMau04a1[] = [];
  lstCTietBCao04an: ItemDataMau04a1[] = [];
  editCache04ax: { [key: string]: { edit: boolean; data: ItemDataMau04a1 } } = {}; // phuc vu nut chinh
  editCache04an: { [key: string]: { edit: boolean; data: ItemDataMau04a1 } } = {}; // phuc vu nut chinh
  chiTietBcao4ax: linkList = {
    id: uuid.v4(),
    vt: 0,
    stt: null,
    maNdungChi: '',
    maNdungChiParent: '',
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
  };
  chiTietBcao4an: linkList = {
    id: uuid.v4(),
    vt: 0,
    stt: null,
    maNdungChi: '',
    maNdungChiParent: '',
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
  };
  listColTrongDot4ax: any[] = [];
  listColTrongDot4an: any[] = [];
  listColLuyke4ax: any[] = [];
  listColLuyke4an: any[] = [];
  cols4ax: number = 0;
  cols4an: number = 0;
  ObjCol: any;

  async ngOnInit() {
    this.cols4ax = 3;
    this.cols4an = 3;
    let userName = this.nguoiDungSerivce.getUserName();
    let userInfor: any = await this.getUserInfo(userName); //get user info

    this.maDonViTao = userInfor?.dvql;

    //check router
    this.id = this.router.snapshot.paramMap.get('id');
    this.maDvi = this.router.snapshot.paramMap.get('maDvi');
    this.maLoaiBaocao = this.router.snapshot.paramMap.get('maLoaiBaocao');
    this.nam = this.router.snapshot.paramMap.get('nam');
    this.dotBaocao = this.router.snapshot.paramMap.get('dotBaocao');

    this.loaiBaoCaoParam = this.router.snapshot.paramMap.get('loai');
    //xem chi tiet xuất file exel;
    this.checkxemkhaithac = this.router.snapshot.paramMap.get('status');

    if ( this.id!=null && this.checkxemkhaithac!=null) {
      this.getDetailReportToExportFile();
    }else if (this.id != null) {
      //call service lay chi tiet
      this.getDetailReport();
    }else if(this.maDvi!=null && this.maLoaiBaocao !=null && this.nam !=null && this.dotBaocao !=null){
      this.callTonghop();
    }
     else {
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
    }
    this.baoCao.namBcao = this.currentday.getFullYear();
    this.baoCao.ngayTao = this.currentday.toDateString();
    this.baoCao.trangThai = '1';

    if(this.loaiBaoCaoParam=='1'){
      LISTBIEUMAUDOT.forEach(e => {
        this.baoCao.lstBCao.push(
          {
            id:uuid.v4(),
            checked:false,
            tieuDe: e.tieuDe+this.baoCao.dotBcao,
            maLoai:e.maPhuLuc,
            tenPhuLuc: e.tenPhuLuc,
            trangThai: '1',
            lstCTietBCao: []
          }
        )
      })
    }else{
      LISTBIEUMAUNAM.forEach(e => {
        this.baoCao.lstBCao.push(
          {
            id:uuid.v4(),
            checked:false,
            tieuDe: e.tieuDe+this.baoCao.namBcao,
            maLoai:e.maPhuLuc,
            tenPhuLuc: e.tenPhuLuc,
            trangThai: '1',
            lstCTietBCao: []
          }
        )
      })
    }

    this.danhMucService.dMVatTu().subscribe(res => {
        if(res.statusCode==0){
          this.listVattu = res.data?.content;
        }else{
          this.notification.error(MESSAGE.ERROR, res?.msg);
        }
    },err => {
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    })

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
    const utils = new Utils();
    this.statusBtnDel = utils.getRoleDel(this.baoCao.trangThai, 2, userInfor?.roles[0]?.id);
    this.statusBtnSave = utils.getRoleSave(this.baoCao.trangThai, 2, userInfor?.roles[0]?.id);
    this.statusBtnApprove = utils.getRoleApprove(this.baoCao.trangThai, 2, userInfor?.roles[0]?.id);
    this.statusBtnTBP = utils.getRoleTBP(this.baoCao.trangThai, 2, userInfor?.roles[0]?.id);
    this.statusBtnLD = utils.getRoleLD(this.baoCao.trangThai, 2, userInfor?.roles[0]?.id);
    this.statusBtnGuiDVCT = utils.getRoleGuiDVCT(this.baoCao.trangThai, 2, userInfor?.roles[0]?.id);
    this.statusBtnDVCT = utils.getRoleDVCT(this.baoCao.trangThai, 2, userInfor?.roles[0]?.id);

    //lay danh sach cac don vi
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
      type: '',
    };
    this.spinner.show();
    this.quanLyVonPhiService.approve(requestGroupButtons).subscribe((data) => {
      if (data.statusCode == 0) {
        // this.getDetailReport();
      }
    });
    this.spinner.hide();
  }

  //get user info
  async getUserInfo(username: string) {
    let userInfo = await this.nguoiDungSerivce
      .getUserInfo(username)
      .toPromise()
      .then(
        (data) => {
          if (data?.statusCode == 0) {
            this.userInfor = data?.data;
            return data?.data;
          } else {
          }
        },
        (err) => {
          console.log(err);
        },
      );
    return userInfo;
  }



  //xử lý phần phụ lục
  // them phu luc
  addPhuLuc() {
    var danhSach:any;
    if(this.loaiBaoCaoParam=='1'){
      LISTBIEUMAUDOT.forEach(item => item.status = false);
       danhSach = LISTBIEUMAUDOT.filter(item => this.baoCao?.lstBCao?.findIndex(data => data.maLoai == item.maPhuLuc) == -1);
    }else{
      LISTBIEUMAUNAM.forEach(item => item.status = false);
       danhSach = LISTBIEUMAUNAM.filter(item => this.baoCao?.lstBCao?.findIndex(data => data.maLoai == item.maPhuLuc) == -1);
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
  // xoa phu luc
  deletePhuLucList(){
    this.baoCao.lstBCao = this.baoCao?.lstBCao.filter(item => item.checked == false);
    if(this.baoCao?.lstBCao?.findIndex(item => item.maLoai == this.tabSelected) == -1){
      this.tabSelected = null;
    }
    this.allChecked = false;
  }
 
  // doi tab
  changeTab(maPhuLuc){
    this.tabSelected = maPhuLuc;
    if(this.tabSelected==1){
      this.lstCTietBCao02 = this.baoCao?.lstBCao.find(item => item.maLoai == maPhuLuc)?.lstCTietBCao;
    }else if(this.tabSelected==2){
      this.lstCTietBCao03 = this.baoCao?.lstBCao.find(item => item.maLoai == maPhuLuc)?.lstCTietBCao;
    }else if(this.tabSelected==3){
      this.lstCTietBCao04ax = this.baoCao?.lstBCao.find(item => item.maLoai == maPhuLuc)?.lstCTietBCao;
    }else if(this.tabSelected==5){
      this.lstCTietBCao04an = this.baoCao?.lstBCao.find(item => item.maLoai == maPhuLuc)?.lstCTietBCao;
    }else if(this.tabSelected==6){
      this.lstCTietBCao02 = this.baoCao?.lstBCao.find(item => item.maLoai == maPhuLuc)?.lstCTietBCao;
    }
   
   this.updateEditCache02();
   this.updateEditCache03();
  }


  // luu temp vao bang chinh
  saveTemp(){
    
    if(this.tabSelected==1){
      this.saveMau02();
      console.log(this.lstCTietBCao02);
      this.baoCao?.lstBCao.forEach(item => {
        if(item.maLoai == this.tabSelected){
          item.lstCTietBCao = this.lstCTietBCao02;
        }
      });
    }else if(this.tabSelected==2){
      this.saveMau03();
      this.baoCao?.lstBCao.forEach(item => {
        if(item.maLoai == this.tabSelected){
          item.lstCTietBCao = this.lstCTietBCao03;
        }
      });
    }else if(this.tabSelected==3){
      this.baoCao?.lstBCao.forEach(item => {
        if(item.maLoai == this.tabSelected){
          item.lstCTietBCao = this.lstCTietBCao04ax;
        }
      });
    }
    this.updateEditCache02();
    this.updateEditCache03();
    this.updateEditCache();
    this.tabSelected = null;
    
    console.log(this.baoCao);
  }
  xoa(){};
  ///////////////////////////////xử lý chung /////////////////////// lưu vào CSDL
  async luu() {
    this.lstCTietBCao04ax.forEach((e) => {
      e.stt=0;
      if (typeof e.id != 'number') {
        e.id = null;
      }
      e.listCtiet.forEach((el) => {
        if (typeof el.id != 'number') {
          el.id = null;
        }
      });
    });

    this.baoCao?.lstBCao.filter(item => {
      if(item.maLoai == LISTBIEUMAUDOT[0].maPhuLuc){
        item.lstCTietBCao = this.lstCTietBCao02;
      }
    })
    console.log(this.baoCao);
    this.updateEditCache02();
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
      listIdDeletes: this.listIdDelete,
      listIdFiles: null,
      lstCTietBCao: this.lstCTietBCao04ax,

      maDviCha: '',
      maDviTien: null,
      maLoaiBcao: this.maLoaiBaocao,
      namHienHanh: null,
      thangBcao: null,
      trangThai: this.trangThaiBanGhi,
      loaiBaoCao: 1,
    };

    this.spinner.show();
    console.log(request);

    if (this.id != null) {
      this.quanLyVonPhiService.updateBaoCaoThucHienDTC(request).subscribe((res) => {
        if (res.statusCode == 0) {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
        } else {
          this.notification.error(MESSAGE.ERROR, res?.msg);
        }
      },err =>{
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      });
    } else {
      this.quanLyVonPhiService.trinhDuyetBaoCaoThucHienDTCService(request).subscribe(
        (data) => {
          if (data.statusCode == 0) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
          } else {
            this.notification.error(MESSAGE.ERROR, data?.msg);
          }
        },
        (err) => {
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        },
      );
    }

    this.updateEditCache();
    this.spinner.hide();
  }


  //thêm cột
  addCol() {
    if (this.ObjCol == undefined) return;
    var colname;
    this.listVattu.forEach((e) => {
      if (this.ObjCol == e.id) {
        colname = e.tenDm;
      }
    });
    let objTrongdot = {
      id: uuid.v4(),
      maVtu: this.ObjCol,
      loaiMatHang: '0',
      colName: colname,
      sl: 0,
    };

    this.listColTrongDot4ax.push(objTrongdot);


    this.addColLL(this.chiTietBcao4ax, objTrongdot);
    this.updateLstCTietBCao();
    this.cols4ax++;
  }

  //them cot moi vao linklist
  addColLL(data: linkList, obj: vatTu) {
    let objTrongdot = {
      id: obj.id,
      maVtu: obj.maVtu,
      loaiMatHang: '0',
      colName: obj.colName,
      sl: 0,
    };
    let objLuyke = {
      id: obj.id,
      maVtu: obj.maVtu,
      loaiMatHang: '1',
      colName: obj.colName,
      sl: 0,
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
    if(maLoai==1){
      this.listColTrongDot4ax.forEach((e) => {
        let objTrongD = {
          id: e.id,
          maVtu: e.maVtu,
          loaiMatHang: '0',
          colName: '',
          sl: 0,
        };
        let objLke = {
          id: e.id,
          maVtu: e.maVtu,
          loaiMatHang: '1',
          colName: '',
          sl: 0,
        };
        listVtu.push(objTrongD);
        listVtu.push(objLke);
      });
    }else if(maLoai==2){
      this.listColTrongDot4an.forEach((e) => {
        let objTrongD = {
          id: e.id,
          maVtu: e.maVtu,
          loaiMatHang: '0',
          colName: '',
          sl: 0,
        };
        let objLke = {
          id: e.id,
          maVtu: e.maVtu,
          loaiMatHang: '1',
          colName: '',
          sl: 0,
        };
        listVtu.push(objTrongD);
        listVtu.push(objLke);
      });
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
    }
    
  }

  //xóa cột
  deleteCol(id: any,maLoai:any) {
    if(maLoai==1){
      let idx = this.listColTrongDot4ax.findIndex((e) => e.id == id);
      this.listColTrongDot4ax.splice(idx, 1);
      this.listColLuyke4ax.splice(idx, 1);
      this.lstCTietBCao04ax.forEach((e) => {
        e.listCtiet.splice(2 * id, 1);
        e.listCtiet.splice(2 * id, 1);
      });
  
      this.deleteColLL(this.chiTietBcao4ax, 2 * id);
      this.cols4ax = this.cols4ax - 1;
    }else if(maLoai ==2){
      let idx = this.listColTrongDot4an.findIndex((e) => e.id == id);
      this.listColTrongDot4an.splice(idx, 1);
      this.listColLuyke4an.splice(idx, 1);
      this.lstCTietBCao04an.forEach((e) => {
      e.listCtiet.splice(2 * id, 1);
      e.listCtiet.splice(2 * id, 1);
    });

    this.deleteColLL(this.chiTietBcao4an, 2 * id);
    this.cols4an = this.cols4an - 1;
    }
    
  }

  deleteColLL(data: linkList, id: any) {
    data.listCtiet.splice(id, 1);
    if (data.next.length == 0) return;
    data.next.forEach((item) => {
      this.deleteColLL(item, id);
    });
  }

  // call chi tiet bao cao
  getDetailReport() {
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

          this.lstCTietBCao04ax.forEach((item) => {
            this.transformToLinkList(item);
          });
          console.log(this.chiTietBcao4ax);
          this.updateLstCTietBCao();
          console.log(this.lstCTietBCao04ax);
          this.cols4ax = this.cols4ax + this.listColTrongDot4ax.length;
          if (
            this.trangThaiBanGhi == '1' ||
            this.trangThaiBanGhi == '3' ||
            this.trangThaiBanGhi == '5' ||
            this.trangThaiBanGhi == '8'
          ) {
            this.status = false;
          } else {
            this.status = true;
          }
          // set list id file ban dau
          this.lstFile.filter((item) => {
            this.listIdFiles += item.id + ',';
          });
          this.updateLstCTietBCao();

        } else {
          this.notification.error(MESSAGE.ERROR, data?.msg);
        }
      },
      (err) => {
        this.notification.error(MESSAGE.ERROR,MESSAGE.SYSTEM_ERROR);
      },
    );
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

          this.lstCTietBCao04ax.forEach((item) => {
            this.transformToLinkList(item);
          });
          this.updateLstCTietBCao();
          this.cols4ax = this.cols4ax + this.listColTrongDot4ax.length;
          this.status = true;

          // set list id file ban dau
          this.lstFile.filter((item) => {
            this.listIdFiles += item.id + ',';
          });
          this.updateLstCTietBCao();

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
        this.lstCTietBCao04ax.forEach((item) => {
            this.transformToLinkList(item);
        });
        this.updateLstCTietBCao();
        this.cols4ax = this.cols4ax + this.listColTrongDot4ax.length;

        // set list id file ban dau
        this.lstFile.filter((item) => {
          this.listIdFiles += item.id + ',';
        });
        this.updateLstCTietBCao();



      }else{
        this.notification.error(MESSAGE.ERROR,res?.msg);
      }
    },err=>{
      this.notification.error(MESSAGE.ERROR,MESSAGE.SYSTEM_ERROR);
    })
  }


  transformToLinkList(item: ItemDataMau04a1) {
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
    };
    this.nho = false;
    this.addToLinkList(this.chiTietBcao4ax, obj);
    if (!this.nho) {
      this.chiTietBcao4ax.next.forEach((item) => {
        if (item.maNdungChiParent == obj.parentId) {
          obj.next.push(item);
        }
      });
      obj.next = obj.next.sort((a, b) => (a.vt < b.vt ? -1 : 1));
      obj.next.forEach((item) => {
        let idx = this.chiTietBcao4ax.next.findIndex((e) => e.vt == item.vt);
        this.chiTietBcao4ax.next.splice(idx, 1);
      });
    }
  }
  // let sortedCompany = company.sort((a, b) => (a.name < b.name) ? -1 : 1);

  addToLinkList(data: linkList, item: linkList) {
    if (item.maNdungChiParent == data.vt) {
      data.next.push(item);
      data.next = data.next.sort((a, b) => (a.vt < b.vt ? -1 : 1));
    }
    data.next.forEach((e) => {
      this.addToLinkList(e, item);
    });
    if (data.next.length == 0) return;
  }

  updateEditCache(): void {
    if(this.tabSelected==3){
      this.lstCTietBCao04ax.forEach((item) => {
        this.editCache04ax[item.id] = {
          edit: false,
          data: { ...item },
        };
      });
    }else if(this.tabSelected==4){
      this.lstCTietBCao04an.forEach((item) => {
        this.editCache04an[item.id] = {
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
      this.editCache04an[id].data.checked = this.lstCTietBCao04ax.find(
        (item) => item.id === id,
      ).checked; // set checked editCache = checked lstCTietBCao
      const index = this.lstCTietBCao04an.findIndex((item) => item.id === id); // lay vi tri hang minh sua
      Object.assign(this.lstCTietBCao04an[index], this.editCache04an[id].data); // set lai data cua lstCTietBCao[index] = this.editCache[id].data
      this.editCache04an[id].edit = false; // CHUYEN VE DANG TEXT
      this.saveEditLL(this.chiTietBcao4an, index + 1);
      this.disable4an = false;
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

  //lay ten trang thai
  getStatusName(status:any) {
    const utils = new Utils();
    return utils.getStatusName(status);
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
  duyet(data: linkList, str: string, index: number, parent: number) {
    if (index != 0) {
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
      };
      this.lstCTietBCao04ax.push(mm);
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

  updateLstCTietBCao() {
    this.lstCTietBCao04ax = [];
    this.lstCTietBCao04an =[];
    if(this.tabSelected==3){
      this.duyet(this.chiTietBcao4ax, '', 0, 0);
      this.updateEditCache();
    }else if(this.tabSelected==4){
      this.duyet(this.chiTietBcao4an, '', 0, 0);
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
      this.delete(this.chiTietBcao4ax, idx);
      this.stt = 0;
      this.updateSTT(this.chiTietBcao4ax);
      this.updateLstCTietBCao();
    }else if(maLoai==2){
      this.delete(this.chiTietBcao4an, idx);
      this.stt = 0;
      this.updateSTT(this.chiTietBcao4an);
      this.updateLstCTietBCao();
    }
    
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
      if (typeof this.lstCTietBCao04ax[data.vt-1].id == 'number'){
        this.listIdDelete += this.lstCTietBCao04ax[data.vt-1].id + ',';
      }
    }

    if (data.next.length == 0) return;
    data.next.forEach(item => {
      this.getListIdDelete(item);
    })
  }

  //xoa bằng checkbox
  deleteSelected() {
    this.deleteAllSelected(this.chiTietBcao4ax);
    this.updateSTT(this.chiTietBcao4ax);
    this.updateLstCTietBCao();
    this.allChecked = false;
    this.chiTietBcao4ax.checked = false;
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
    this.subUpdateChecked(this.chiTietBcao4ax, this.allChecked);
  }

  updateChecked() {
    this.updateCheckedLL(this.chiTietBcao4ax);
  }

  updateCheckedLL(data: linkList) {
    if (data.vt != 0) {
      if (data.checked != this.lstCTietBCao04ax[data.vt - 1].checked) {
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

    if (kt) {
      data.checked = true;
      this.lstCTietBCao04ax[data.vt - 1].checked = true;
    } else {
      data.checked = false;
      this.lstCTietBCao04ax[data.vt - 1].checked = false;
    }
  }

  subUpdateChecked(data: linkList, kt: boolean) {
    data.checked = kt;
    if (data.vt > 0) this.lstCTietBCao04ax[data.vt - 1].checked = kt;
    if (data.next.length == 0) return;
    data.next.forEach((item) => this.subUpdateChecked(item, kt));
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
      };
  
      this.kt = false;
      this.addEqual(this.chiTietBcao4ax, item, index);
      if (!this.kt) {
        this.addEqual1(this.chiTietBcao4ax, item);
      }
      this.stt = 0;
      this.updateSTT(this.chiTietBcao4ax);
      console.log(this.chiTietBcao4ax);
      this.updateLstCTietBCao();
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
      };
  
      this.kt = false;
      this.addEqual(this.chiTietBcao4an, item, index);
      if (!this.kt) {
        this.addEqual1(this.chiTietBcao4an, item);
      }
      this.stt = 0;
      this.updateSTT(this.chiTietBcao4an);
      this.updateLstCTietBCao();
      this.disable4an = false;
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
      };
  
      this.kt = false;
      this.addLess(this.chiTietBcao4ax, item, index);
      if (!this.kt) {
        this.addLess1(this.chiTietBcao4ax, item);
      }
      this.stt = 0;
      this.updateSTT(this.chiTietBcao4ax);
      this.updateLstCTietBCao();
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
      };
  
      this.kt = false;
      this.addLess(this.chiTietBcao4an, item, index);
      if (!this.kt) {
        this.addLess1(this.chiTietBcao4an, item);
      }
      this.stt = 0;
      this.updateSTT(this.chiTietBcao4an);
      this.updateLstCTietBCao();
      this.disable4an = false;
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
    }
    
  }

//checkox trên tùng row
updateSingleCheckedBcao(maLoai:any): void {
  if(maLoai==1){
    if (this.lstCTietBCao04ax.every((item) => !item.checked)) {
      this.allChecked = false;
      this.indeterminate = false;
    } else if (this.lstCTietBCao04ax.every((item) => item.checked)) {
      this.allChecked = true;
      this.indeterminate = false;
    } else {
      this.indeterminate = true;
    }
  }else if(maLoai==2){
    if (this.lstCTietBCao04an.every((item) => !item.checked)) {
      this.allChecked = false;
      this.indeterminate = false;
    } else if (this.lstCTietBCao04an.every((item) => item.checked)) {
      this.allChecked = true;
      this.indeterminate = false;
    } else {
      this.indeterminate = true;
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
    this.indeterminate = false;
    if(this.allChecked){

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
      this.lstCTietBCao1 = this.lstCTietBCao1.filter((item) => item.id != id);
      if (typeof id == 'number') {
        this.listIdDelete += id + ',';
      }
    }else{
      this.lstCTietBCao2 = this.lstCTietBCao2.filter((item) => item.id != id);
      if (typeof id == 'number') {
        this.listIdDelete += id + ',';
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
      maVtuParent:1,
      loai:'dv',
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
      this.allChecked = false;
      this.indeterminate = true;
    } else if ((this.lstCTietBCao1.every((item) => item.checked)) && (this.lstCTietBCao2.every((item) => item.checked)) ) {
      this.allChecked = true;
      this.indeterminate = false;
    } else {
      this.indeterminate = true;
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
        this.listIdDelete += item.id + ',';
      }

    });
    this.lstCTietBCao2.filter((item) => {
      if (item.checked == true && typeof item.id == 'number') {
        this.listIdDelete += item.id + ',';
      }

    });
    // delete object have checked = true
    this.lstCTietBCao1 = this.lstCTietBCao1.filter(
      (item) => item.checked != true,
    );
    this.lstCTietBCao2 = this.lstCTietBCao2.filter(
      (item) => item.checked != true,
    );
    this.allChecked = false;
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
    this.indeterminate = false;
    if(this.allChecked){

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
        this.listIdDelete += id + ',';
      }
    }else if(loaiList=='2'){
      this.lstCTietBCao032 = this.lstCTietBCao032.filter((item) => item.id != id);
      if (typeof id == 'number') {
        this.listIdDelete += id + ',';
      }
    }else{
      this.lstCTietBCao033 = this.lstCTietBCao033.filter((item)=> item.id!=id);
      if(typeof id =='number'){
        this.listIdDelete +=id +',';
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
      maVtuParent:1,
      loai:1,
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
      this.allChecked = false;
      this.indeterminate = true;
    } else if ((this.lstCTietBCao031.every((item) => item.checked)) && (this.lstCTietBCao032.every((item) => item.checked)) && (this.lstCTietBCao033.every((item) => item.checked))) {
      this.allChecked = true;
      this.indeterminate = false;
    } else {
      this.indeterminate = true;
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
        this.listIdDelete += item.id + ',';
      }

    });
    this.lstCTietBCao032.filter((item) => {
      if (item.checked == true && typeof item.id == 'number') {
        this.listIdDelete += item.id + ',';
      }

    });
    this.lstCTietBCao033.filter((item) => {
      if (item.checked == true && typeof item.id == 'number') {
        this.listIdDelete += item.id + ',';
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
    this.allChecked = false;
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
  }
}
