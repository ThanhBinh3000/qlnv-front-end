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

export class ItemData {
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
    private spinner: NgxSpinnerService,
    private sanitizer: DomSanitizer,
    private nguoiDungSerivce: UserService,
    private datepipe: DatePipe,
    private notification: NzNotificationService,
    private router: ActivatedRoute,
  ) {}

  async ngOnInit() {
    this.cols = 3;
    let userName = this.nguoiDungSerivce.getUserName();
    let userInfor: any = await this.getUserInfo(userName); //get user info
   

    this.id = this.router.snapshot.paramMap.get('id');
    this.maDvi = this.router.snapshot.paramMap.get('maDvi');
    this.maLoaiBaocao = this.router.snapshot.paramMap.get('maLoaiBaocao');
    this.nam = this.router.snapshot.paramMap.get('nam');
    this.dotBaocao = this.router.snapshot.paramMap.get('dotBaocao');

    //xem chi tiet xuất file exel;
    this.checkxemkhaithac = this.router.snapshot.paramMap.get('status');

    if ( this.id!=null && this.checkxemkhaithac!=null) {
      this.getDetailReportToExportFile();
    }else if (this.id != null) {
      //call service lay chi tiet
      this.getDetailReport();
    }else if(this.maDvi!=null && this.maLoaiBaocao !=null && this.nam !=null && this.dotBaocao !=null){
      this.callTonghop();
      this.nguoinhap = userInfor?.username;
      this.donvitao = userInfor?.dvql;
      this.namBcao = this.currentday.getFullYear();
      this.ngaynhap = this.datepipe.transform(this.currentday, 'dd/MM/yyyy');
      this.maLoaiBaocao = '92';
      this.trangThaiBanGhi='1';
      this.quanLyVonPhiService.sinhMaBaoCao().subscribe(
        (res) => {
          if (res.statusCode == 0) {
            this.mabaocao = res.data;
            this.notification.success(MESSAGE.SUCCESS, res?.msg);
          } else {
            this.notification.error(MESSAGE.ERROR, res?.msg);
          }
        },
        (err) => {
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        },
      );
    }
     else {
      this.trangThaiBanGhi = '1';
      this.nguoinhap = userInfor?.username;
      this.donvitao = userInfor?.dvql;
      this.namBcao = this.currentday.getFullYear();
      this.ngaynhap = this.datepipe.transform(this.currentday, 'dd/MM/yyyy');
      this.maLoaiBaocao = '92';
      this.quanLyVonPhiService.sinhMaBaoCao().subscribe(
        (res) => {
          if (res.statusCode == 0) {
            this.mabaocao = res.data;
            this.notification.success(MESSAGE.SUCCESS, res?.msg);
          } else {
            this.notification.error(MESSAGE.ERROR, res?.msg);
          }
        },
        (err) => {
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        },
      );
    }
    const utils = new Utils();
    this.statusBtnDel = utils.getRoleDel(
      this.trangThaiBanGhi,
      2,
      userInfor?.roles[0]?.id,
    );
    this.statusBtnSave = utils.getRoleSave(
      this.trangThaiBanGhi,
      2,
      userInfor?.roles[0]?.id,
    );
    this.statusBtnApprove = utils.getRoleApprove(
      this.trangThaiBanGhi,
      2,
      userInfor?.roles[0]?.id,
    );
    this.statusBtnTBP = utils.getRoleTBP(
      this.trangThaiBanGhi,
      2,
      userInfor?.roles[0]?.id,
    );
    this.statusBtnLD = utils.getRoleLD(
      this.trangThaiBanGhi,
      2,
      userInfor?.roles[0]?.id,
    );
    this.statusBtnGuiDVCT = utils.getRoleGuiDVCT(
      this.trangThaiBanGhi,
      2,
      userInfor?.roles[0]?.id,
    );
    this.statusBtnDVCT = utils.getRoleDVCT(
      this.trangThaiBanGhi,
      2,
      userInfor?.roles[0]?.id,
    );
    //get danh muc noi dung
    this.quanLyVonPhiService.dmVattuhanghoa().subscribe(
      (data) => {
        if (data.statusCode == 0) {
          this.listVattu = data.data?.content;
          this.notification.success(MESSAGE.SUCCESS,data?.msg);
        } else {
          this.notification.error(MESSAGE.ERROR, data?.msg);
        }
      },
      (err) => {
        console.log(err);
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      },
    );
  }

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

  ngaynhap: any;
  nguoinhap: any;
  donvitao: any;
  mabaocao: any;
  trangThaiBanGhi: string = '1';
  namBcao: any;
  loaiBaocao: any;
  dotbaocao: any;
  nho: boolean;

  lstCTietBCao: ItemData[] = [];
  chiTietBcaos: linkList = {
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
  listIdDelete: string = '';
  allChecked = false; // check all checkbox
  indeterminate = true; // properties allCheckBox
  status: boolean = false;
  donViTaos: any[] = [];
  userInfor: any;
  currentday: Date = new Date();
  maLoaiBaocao: any;
  listColTrongDot: any[] = [];
  listColLuyke: any[] = [];
  cols: number = 0;
  listVattu: any[] = [];
  ObjCol: any;
  listVtuTrongDot: any[] = [];
  listVtuLuyKe: any[] = [];
  lenghtTh = 0;
  stt: number;
  kt: boolean;
  statusB: boolean = false;
  disable: boolean = false;
  donvitien: any;
  listIdFiles: string;
  statusButton: boolean = false;
  maDvi:any;
  nam:any;
  dotBaocao:any;
  checkxemkhaithac:any;
  editCache: { [key: string]: { edit: boolean; data: ItemData } } = {}; // phuc vu nut chinh

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

  async luu() {
    this.lstCTietBCao.forEach((e) => {
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
      lstCTietBCao: this.lstCTietBCao,
      maBcao: this.mabaocao,
      maDvi: (this.donvitao = 235),
      maDviCha: '',
      maDviTien: null,
      maLoaiBcao: this.maLoaiBaocao,
      namBcao: this.namBcao,
      namHienHanh: null,
      thangBcao: null,
      trangThai: this.trangThaiBanGhi,
      dotBcao: this.dotbaocao,
      loaiBaoCao: 1,
    };

    this.spinner.show();
    console.log(request);

    if (this.id != null) {
      this.quanLyVonPhiService.capnhatbaocao(request).subscribe((res) => {
        if (res.statusCode == 0) {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
        } else {
          this.notification.error(MESSAGE.ERROR, res?.msg);
        }
      },err =>{
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      });
    } else {
      this.quanLyVonPhiService.themmoibaocaoketquathuchien(request).subscribe(
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
    // let objLuyke = {
    //   id: objTrongdot.id,
    //   maVtu: this.ObjCol,
    //   loaiMatHang: 1,
    //   colName: colname,
    //   sl: 0,
    // };
    this.listColTrongDot.push(objTrongdot);
    // this.listColLuyke.push(objLuyke);

    this.addColLL(this.chiTietBcaos, objTrongdot);
    this.updateLstCTietBCao();
    this.cols++;
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

  addLine(idx: any) {
    var listVtu: vatTu[] = [];

    this.listColTrongDot.forEach((e) => {
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
    this.lstCTietBCao.splice(idx, 0, item);
    this.editCache[item.id] = {
      edit: true,
      data: { ...item },
    };

    this.statusB = false;
    this.disable = true;
  }

  //xóa cột
  deleteCol(id: any) {
    debugger;

    let idx = this.listColTrongDot.findIndex((e) => e.id == id);
    this.listColTrongDot.splice(idx, 1);
    this.listColLuyke.splice(idx, 1);
    this.lstCTietBCao.forEach((e) => {
      e.listCtiet.splice(2 * id, 1);
      e.listCtiet.splice(2 * id, 1);
    });

    this.deleteColLL(this.chiTietBcaos, 2 * id);
    this.cols = this.cols - 1;
    console.log(this.lstCTietBCao);
    console.log(this.chiTietBcaos);
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
    this.quanLyVonPhiService.chitietmaubaocao(this.id).subscribe(
      (data) => {
        console.log(data);
        if (data.statusCode == 0) {
          // this.chiTietBcaos = data.data;
          this.lstCTietBCao = data.data.lstCTietBCao;

          this.lstFile = data.data.lstFile;
          this.maLoaiBaocao = '92';
          // set thong tin chung bao cao
          this.ngaynhap = data.data.ngayTao;
          this.nguoinhap = data.data.nguoiTao;
          this.donvitao = data.data.maDvi;
          this.mabaocao = data.data.maBcao;
          this.namBcao = data.data.namBcao;
          this.dotbaocao = data.data.dotBcao;
          this.trangThaiBanGhi = data.data.trangThai;
          let e = this.lstCTietBCao[0];

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
                  this.listColTrongDot.push(objTrongdot);
                }
              });
            }
          });

          this.lstCTietBCao.forEach((item) => {
            this.transformToLinkList(item);
          });
          console.log(this.chiTietBcaos);
          this.updateLstCTietBCao();
          console.log(this.lstCTietBCao);
          this.cols = this.cols + this.listColTrongDot.length;
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
          this.notification.success(MESSAGE.SUCCESS, data?.msg);
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
    this.quanLyVonPhiService.chitietmaubaocao(this.id).subscribe(
      (data) => {
        console.log(data);
        if (data.statusCode == 0) {
          // this.chiTietBcaos = data.data;
          this.lstCTietBCao = data.data.lstCTietBCao;
          this.lstFile = data.data.lstFile;
          this.maLoaiBaocao = '92';
          // set thong tin chung bao cao
          this.ngaynhap = data.data.ngayTao;
          this.nguoinhap = data.data.nguoiTao;
          this.donvitao = data.data.maDvi;
          this.mabaocao = data.data.maBcao;
          this.namBcao = data.data.namBcao;
          this.dotbaocao = data.data.dotBcao;
          this.trangThaiBanGhi = data.data.trangThai;
          let e = this.lstCTietBCao[0];

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
                  this.listColTrongDot.push(objTrongdot);
                }
              });
            }
          });

          this.lstCTietBCao.forEach((item) => {
            this.transformToLinkList(item);
          });
          this.updateLstCTietBCao();
          this.cols = this.cols + this.listColTrongDot.length;
          this.status = true;
          
          // set list id file ban dau
          this.lstFile.filter((item) => {
            this.listIdFiles += item.id + ',';
          });
          this.updateLstCTietBCao();
          this.notification.success(MESSAGE.SUCCESS, data?.msg);
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
        this.lstCTietBCao = res.data;
        this.lstFile = res.data.lstFile;
        this.maLoaiBaocao = '92';
        let e = this.lstCTietBCao[0];
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
                  this.listColTrongDot.push(objTrongdot);
                }
              });
            }
          });
        this.lstCTietBCao.forEach((item) => {
            this.transformToLinkList(item);
        });
        this.updateLstCTietBCao();
        this.cols = this.cols + this.listColTrongDot.length;

        // set list id file ban dau
        this.lstFile.filter((item) => {
          this.listIdFiles += item.id + ',';
        });
        this.updateLstCTietBCao();

        this.notification.success(MESSAGE.SUCCESS, res?.msg);
       
      }else{
        this.notification.error(MESSAGE.ERROR,res?.msg);
      }
    },err=>{
      this.notification.error(MESSAGE.ERROR,MESSAGE.SYSTEM_ERROR);
    })
  }


  transformToLinkList(item: ItemData) {
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
    this.addToLinkList(this.chiTietBcaos, obj);
    if (!this.nho) {
      this.chiTietBcaos.next.forEach((item) => {
        if (item.maNdungChiParent == obj.parentId) {
          obj.next.push(item);
        }
      });
      obj.next = obj.next.sort((a, b) => (a.vt < b.vt ? -1 : 1));
      obj.next.forEach((item) => {
        let idx = this.chiTietBcaos.next.findIndex((e) => e.vt == item.vt);
        this.chiTietBcaos.next.splice(idx, 1);
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
    this.lstCTietBCao.forEach((item) => {
      this.editCache[item.id] = {
        edit: false,
        data: { ...item },
      };
    });
  }

  // start edit
  startEdit(id: string): void {
    this.editCache[id].edit = true;
    this.statusB = true;
    this.disable = true;
  }

  //update khi sửa
  saveEdit(id: string): void {
    this.editCache[id].data.checked = this.lstCTietBCao.find(
      (item) => item.id === id,
    ).checked; // set checked editCache = checked lstCTietBCao
    const index = this.lstCTietBCao.findIndex((item) => item.id === id); // lay vi tri hang minh sua
    Object.assign(this.lstCTietBCao[index], this.editCache[id].data); // set lai data cua lstCTietBCao[index] = this.editCache[id].data
    this.editCache[id].edit = false; // CHUYEN VE DANG TEXT
    this.saveEditLL(this.chiTietBcaos, index + 1);
    this.disable = false;
  }

  //hủy thao tác sửa update lại giá trị ban đầu
  cancelEdit(id: string): void {
    const index = this.lstCTietBCao.findIndex((item) => item.id === id); // lay vi tri hang minh sua
    this.editCache[id] = {
      data: { ...this.lstCTietBCao[index] },
      edit: false,
    };
    this.disable = false;
  }

  // xoa dong
  deleteById(id: any): void {
    this.lstCTietBCao = this.lstCTietBCao.filter((item) => item.id != id);
    if (typeof id == 'number') {
      this.listIdDelete += id + ',';
    }
  }

  //checkox trên tùng row
  updateSingleChecked(): void {
    if (this.lstCTietBCao.every((item) => !item.checked)) {
      this.allChecked = false;
      this.indeterminate = false;
    } else if (this.lstCTietBCao.every((item) => item.checked)) {
      this.allChecked = true;
      this.indeterminate = false;
    } else {
      this.indeterminate = true;
    }
  }

  //lay ten trang thai
  getStatusName() {
    const utils = new Utils();
    return utils.getStatusName(this.trangThaiBanGhi);
  }

  //lay ten don vi tạo
  getUnitName() {
    return this.donViTaos.find((item) => item.maDvi == this.donvitao)?.tenDvi;
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
    upfile.append('folder', this.mabaocao + '/' + this.donvitao + '/');
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

  // // xóa với checkbox
  // deleteSelected() {
  //   // add list delete id
  //   this.lstCTietBCao.filter((item) => {
  //     if (item.checked == true && typeof item.id == 'number') {
  //       this.listIdDelete += item.id + ',';
  //     }
  //   });
  //   // delete object have checked = true
  //   this.lstCTietBCao = this.lstCTietBCao.filter(
  //     (item) => item.checked != true,
  //   );
  //   this.allChecked = false;
  // }

  //thao tác bảng

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
      this.lstCTietBCao.push(mm);
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
    this.lstCTietBCao = [];
    this.duyet(this.chiTietBcaos, '', 0, 0);
    this.updateEditCache();
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
    
    this.delete(this.chiTietBcaos, idx);
    this.stt = 0;
    this.updateSTT(this.chiTietBcaos);
    this.updateLstCTietBCao();
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
      //this.getListIdDelete(data.next[index]);
      data.next = data.next.filter((item) => item.vt != idx);
      return;
    }
  }

  getListIdDelete(data: linkList){
    if (typeof this.lstCTietBCao[data.vt-1].id == 'number'){
      this.listIdDelete += this.lstCTietBCao[data.vt-1].id + ',';
    }
    if (data.next.length == 0) return;
    data.next.forEach(item => {
      this.getListIdDelete(item);
    })
  }

  //xoa bằng checkbox
  deleteSelected() {
    // this.lstCTietBCao.forEach((item) => {
    //   if (item.checked && typeof item.id == 'number') {
    //     this.listIdDelete += item.id + ',';
    //   }
    // });
    this.deleteAllSelected(this.chiTietBcaos);
    this.updateSTT(this.chiTietBcaos);
    this.updateLstCTietBCao();
    this.allChecked = false;
    this.chiTietBcaos.checked = false;
  }

  deleteAllSelected(data: linkList) {
    if (data.next.length == 0) {
      return;
    }
    data.next = data.next.filter((item) => item.checked == false);
    this.stt = 0;

    data.next.forEach((item) => this.deleteAllSelected(item));
  }

  // click o checkbox all
  updateAllChecked(): void {
    this.subUpdateChecked(this.chiTietBcaos, this.allChecked);
  }

  updateChecked() {
    this.updateCheckedLL(this.chiTietBcaos);
  }

  updateCheckedLL(data: linkList) {
    if (data.vt != 0) {
      if (data.checked != this.lstCTietBCao[data.vt - 1].checked) {
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
      this.lstCTietBCao[data.vt - 1].checked = true;
    } else {
      data.checked = false;
      this.lstCTietBCao[data.vt - 1].checked = false;
    }
  }

  subUpdateChecked(data: linkList, kt: boolean) {
    data.checked = kt;
    if (data.vt > 0) this.lstCTietBCao[data.vt - 1].checked = kt;
    if (data.next.length == 0) return;
    data.next.forEach((item) => this.subUpdateChecked(item, kt));
  }

  saveEditLL(data: linkList, idx: number) {
    if (data.vt == idx) {
      this.tranferData(data, this.lstCTietBCao[idx - 1]);
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
      stt: this.editCache[id].data.stt,
      maNdungChi: this.editCache[id].data.maNdungChi,
      maNdungChiParent: this.editCache[id].data.maNdungChiParent,
      trongDotTcong: this.editCache[id].data.trongDotTcong,
      trongDotThoc: this.editCache[id].data.trongDotThoc,
      trongDotGao: this.editCache[id].data.trongDotGao,
      luyKeTcong: this.editCache[id].data.luyKeTcong,
      luyKeThoc: this.editCache[id].data.luyKeThoc,
      luyKeGao: this.editCache[id].data.luyKeGao,
      listCtiet: this.editCache[id].data.listCtiet,
      parentId: this.editCache[id].data.parentId,
      ghiChu: this.editCache[id].data.ghiChu,
      next: [],
      checked: false,
    };

    this.kt = false;
    this.addEqual(this.chiTietBcaos, item, index);
    if (!this.kt) {
      this.addEqual1(this.chiTietBcaos, item);
    }
    this.stt = 0;
    this.updateSTT(this.chiTietBcaos);
    console.log(this.chiTietBcaos);
    this.updateLstCTietBCao();
    this.disable = false;
  }

  // lưu cấp con
  saveEdit2(id: string, index: number): void {
    var item: linkList = {
      id: uuid.v4(),
      vt: 0,
      stt: this.editCache[id].data.stt,
      maNdungChi: this.editCache[id].data.maNdungChi,
      maNdungChiParent: this.editCache[id].data.maNdungChiParent,
      trongDotTcong: this.editCache[id].data.trongDotTcong,
      trongDotThoc: this.editCache[id].data.trongDotThoc,
      trongDotGao: this.editCache[id].data.trongDotGao,
      luyKeTcong: this.editCache[id].data.luyKeTcong,
      luyKeThoc: this.editCache[id].data.luyKeThoc,
      luyKeGao: this.editCache[id].data.luyKeGao,
      listCtiet: this.editCache[id].data.listCtiet,
      parentId: this.editCache[id].data.parentId,
      ghiChu: this.editCache[id].data.ghiChu,
      next: [],
      checked: false,
    };

    // this.tranferData(item,this.editCache[id].data);
    // item.vt =0;
    // item.checked=false;
    // item.next=[];

    this.kt = false;
    this.addLess(this.chiTietBcaos, item, index);
    if (!this.kt) {
      this.addLess1(this.chiTietBcaos, item);
    }
    this.stt = 0;
    this.updateSTT(this.chiTietBcaos);
    console.log(this.chiTietBcaos);
    this.updateLstCTietBCao();
    console.log(this.lstCTietBCao);
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

  tranferData(data: linkList, item: ItemData) {
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
}
