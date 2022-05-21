import { DialogCopyComponent } from './../../../../../components/dialog/dialog-copy/dialog-copy.component';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as uuid from "uuid";
import { DanhMucHDVService } from '../../../../../services/danhMucHDV.service';
import { DatePipe, Location } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { DomSanitizer } from '@angular/platform-browser';
import * as fileSaver from 'file-saver';
import { divMoney, DON_VI_TIEN, MONEY_LIMIT, mulMoney, QLNV_KHVONPHI_TC_NCAU_KHOACH_DTXD_GD3N, Utils } from "../../../../../Utility/utils";
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { UserService } from 'src/app/services/user.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export class ItemData {
  tenDan!:string;
  maKhoach!:string;
  maKhoiDan!:string;
  maDdiemXd!:string;
  ddiemMoTaikhoan!:string;
  masoDan!:string;
  maNganhKte!:string;
  nlucTke!:string;
  namKcTte!:number;
  namHtTte!:number;
  qdDuyetDanDtuSongaythang!:string;
  qdDuyetDanDtuTongVon!:number;
  qdDchinhDanDtuSongaythang!:string;
  qdDchinhDanDtuTongVon!:number;
  qdDuyetTkDtoanSongaythang!:string;
  qdDuyetTkDtoanTong!:number;
  qdDuyetTkDtoanXl!:number;
  qdDuyetTkDtoanTb!:number;
  qdDuyetTkDtoanCk!:number;
  klthCapDen3006Songaythang!:string;
  klthCapDen3006Nstt!:number;
  klthCapDen3006DtoanChiTx!:number;
  klthCapDen3006Quykhac!:number;
  klthCapDen3112Songaythang!:string;
  klthCapDen3112Nstt!:number;
  klthCapDen3112DtoanChiTx!:number;
  klthCapDen3112Quykhac!:number;
  ncauVonN1!:number;
  ncauVonN2!:number;
  ncauVonN3!:number;
  ghiChu!:string;

  id!: any;
  maBcao!: String;
  stt!: String;
  checked!:boolean;
}
@Component({
  selector: 'app-nhu-cau-ke-hoach-dtxd3-nam',
  templateUrl: './nhu-cau-ke-hoach-dtxd3-nam.component.html',
  styleUrls: ['./nhu-cau-ke-hoach-dtxd3-nam.component.scss']
})

export class NhuCauKeHoachDtxd3NamComponent implements OnInit {
  userInfo: any;
  errorMessage!: String;                      //
  maCucDtnnKvucs = [{ id: "", ten: "" }];
  maLoaiKhoachs!:any;
  maKhoiDans!:any;
  maDdiemXdungs!:any;
  maNganhKtes!:any;

  donVis:any = [];                            // danh muc don vi
  lstCTietBCao: ItemData[] = [];              // list chi tiet bao cao
  id!: any;                                   // id truyen tu router
  chiTietBcaos: any;                          // thong tin chi tiet bao cao
  lstFile: any = [];                          // list File de day vao api
  status: boolean = false;                    // trang thai an/ hien cua trang thai
  namBcao = new Date().getFullYear();         // nam bao cao
  userName: any;                              // ten nguoi dang nhap
  ngayNhap!: any;                             // ngay nhap
  nguoiNhap!: string;                         // nguoi nhap
  maDonViTao!: any;                           // ma don vi tao
  maBaoCao!: string;                          // ma bao cao
  namBaoCaoHienHanh!: any;                    // nam bao cao hien hanh
  trangThaiBanGhi: string = "1";              // trang thai cua ban ghi
  maLoaiBaoCao: string = QLNV_KHVONPHI_TC_NCAU_KHOACH_DTXD_GD3N;                // nam bao cao
  maDviTien: any;                   // ma don vi tien
  newDate = new Date();                       //
  fileToUpload!: File;                        // file tai o input
  listFile: File[] = [];                      // list file chua ten va id de hien tai o input
  box1 = true;                                // bien de an hien box1
  fileUrl: any;                               // url
  listIdDelete: string = "";                  // list id delete

  statusBtnDel: boolean;                       // trang thai an/hien nut xoa
  statusBtnSave: boolean;                      // trang thai an/hien nut luu
  statusBtnApprove: boolean;                   // trang thai an/hien nut trinh duyet
  statusBtnTBP: boolean;                       // trang thai an/hien nut truong bo phan
  statusBtnLD: boolean;                        // trang thai an/hien nut lanh dao
  statusBtnGuiDVCT: boolean;                   // trang thai nut gui don vi cap tren
  statusBtnDVCT: boolean;                      // trang thai nut don vi cap tren
  statusBtnLDDC:boolean;                       // trang thai
  statusBtnCopy: boolean;                      // trang thai copy
  statusBtnPrint: boolean;                     // trang thai print

  listIdDeleteFiles: string;                        // id file luc call chi tiet


  allChecked = false;                         // check all checkbox
  indeterminate = true;                       // properties allCheckBox
  editCache: { [key: string]: { edit: boolean; data: ItemData } } = {};     // phuc vu nut chinh

  fileList: NzUploadFile[] = [];

  beforeUpload = (file: NzUploadFile): boolean => {
    this.fileList = this.fileList.concat(file);
    return false;
  };
  nam: any;
  maLoaiBacao: string = QLNV_KHVONPHI_TC_NCAU_KHOACH_DTXD_GD3N;
  maDvi: any;
  currentday: Date = new Date();
  mabaocao: any;
  namBcaohienhanh: any;
  checkDv:boolean;
  messageValidate:any =MESSAGEVALIDATE;
  validateForm!: FormGroup;
  donViTiens: any = DON_VI_TIEN;
  capDv: any;

  // tong cong
  tongqdDuyetDanDtuTongVon: number;
  tongqdDchinhDanDtuTongVon: number;
  tongqdDuyetTkDtoanTong: number;
  tongklthCapDen3006Quykhac: number;
  tongklthCapDen3112Quykhac: number;
  tongqdDuyetTkDtoanXl: number;
  tongqdDuyetTkDtoanTb: number;
  tongqdDuyetTkDtoanCk: number;
  tongklthCapDen3006Nstt: number;
  tongklthCapDen3006DtoanChiTx: number;
  tongklthCapDen3112Nstt: number;
  tongklthCapDen3112DtoanChiTx: number;
  tongncauVonN1: number;
  tongncauVonN2: number;
  tongncauVonN3: number;

  // upload file
  addFile() {
    const id = this.fileToUpload?.lastModified.toString();
    this.lstFile.push({ id: id, fileName: this.fileToUpload?.name });
    this.listFile.push(this.fileToUpload);
  }

  handleUpload(): void {
    this.fileList.forEach((file: any) => {
      const id = file?.lastModified.toString();
      this.lstFile.push({ id: id, fileName: file?.name });
      this.listFile.push(file);
    });
    this.fileList = [];
  }


  constructor(private router: Router,
              private routerActive: ActivatedRoute,
              private spinner: NgxSpinnerService,
              private quanLyVonPhiService: QuanLyVonPhiService,
              private datePipe: DatePipe,
              private sanitizer: DomSanitizer,
              private nguoiDungSerivce: UserService,
              private danhMucService: DanhMucHDVService,
              private notification:NzNotificationService,
              private location: Location,
              private fb:FormBuilder,
              private modal: NzModalService,

              ) {
                this.ngayNhap = this.datePipe.transform(this.newDate, Utils.FORMAT_DATE_STR,)
              }


  async ngOnInit() {
    this.validateForm = this.fb.group({
      namBaoCaoHienHanh: [null, [Validators.required,Validators.pattern('^[12][0-9]{3}$')]],
    });
    //check param dieu huong router
    this.id = this.routerActive.snapshot.paramMap.get('id');
    this.maDvi = this.routerActive.snapshot.paramMap.get('maDvi');
    this.maLoaiBacao = this.routerActive.snapshot.paramMap.get('maLoaiBacao');
    this.nam = this.routerActive.snapshot.paramMap.get('nam');
    let userName = this.nguoiDungSerivce.getUserName();
    await this.getUserInfo(userName); //get user info
    if (this.id) {
      await this.getDetailReport();
    }
    else if (
      this.maDvi != null &&
      this.maLoaiBacao != null &&
      this.nam != null
    ) {
      await this.calltonghop();
      this.nguoiNhap = this.userInfo?.username;
      this.ngayNhap = this.datePipe.transform(this.currentday, Utils.FORMAT_DATE_STR);
      this.maDonViTao =this.userInfo?.dvql;
      this.quanLyVonPhiService.sinhMaBaoCao().subscribe(
        (data) => {
          if (data.statusCode == 0) {
            this.maBaoCao = data.data;
          } else {
            this.notification.error(MESSAGE.ERROR, data?.msg);
          }
        },
        (err) => {
         this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      );
      this.maBaoCao = '';
      this.namBaoCaoHienHanh = new Date().getFullYear();
    }
    else {
      this.trangThaiBanGhi = '1';
      this.nguoiNhap = this.userInfo?.username;
      this.maDonViTao = this.userInfo?.dvql;
      this.namBcaohienhanh = this.currentday.getFullYear();
      this.ngayNhap = this.datePipe.transform(this.currentday, Utils.FORMAT_DATE_STR);
      this.maLoaiBacao = QLNV_KHVONPHI_TC_NCAU_KHOACH_DTXD_GD3N;
      this.spinner.show();
      this.quanLyVonPhiService.sinhMaBaoCao().subscribe(
        (data) => {
          if (data.statusCode == 0) {
            this.maBaoCao = data.data;
          } else {
            this.notification.error(MESSAGE.ERROR, data?.msg);
          }
        },
        (err) => {
         this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      );
      this.maBaoCao = '';
      this.namBaoCaoHienHanh = new Date().getFullYear();
    }


    this.getStatusButton()
    //get danh muc noi dung
    this.danhMucService.dMLoaiKeHoach().subscribe(
      (data) => {
        if (data.statusCode == 0) {
          this.maLoaiKhoachs = data.data?.content;
        } else {
          this.notification.error(MESSAGE.ERROR, data?.msg);
        }
      },
      (err) => {
       this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
    );

    //get danh muc nhom chi
    this.danhMucService.dMKhoiDuAn().subscribe(
      (data) => {
        if (data.statusCode == 0) {
          this.maKhoiDans = data.data?.content;
        } else {
          this.notification.error(MESSAGE.ERROR, data?.msg);
        }
      },
      (err) => {
       this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
    );

    //get danh muc loai chi
    this.danhMucService.dMDiaDiemXayDung().subscribe(
      (data) => {
        if (data.statusCode == 0) {
          this.maDdiemXdungs = data.data?.content;
        } else {
          this.notification.error(MESSAGE.ERROR, data?.msg);
        }
      },
      (err) => {
       this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
    );

    //get danh muc loai chi
    this.danhMucService.dMMaNganhKinhTe().subscribe(
      (data) => {
        if (data.statusCode == 0) {
          this.maNganhKtes = data.data?.content;
        } else {
          this.notification.error(MESSAGE.ERROR, data?.msg);
        }
      },
      (err) => {
       this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
    );

    //lay danh sach danh muc don vi
    await this.danhMucService.dMDonVi().toPromise().then(
      (data) => {
        if (data.statusCode == 0) {
          this.donVis = data.data;
          let Dvi = this.donVis.find(e => e.maDvi == this.maDonViTao);
          this.capDv = Dvi?.capDvi;
          if (this.capDv == '2') {
            this.checkDv = false;
          } else {
            this.checkDv = true;
          }
        } else {
          this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
        }
      },
      (err) => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
    );
    this.getStatusButton()
    this.spinner.hide();
  }

  //get user info
  async getUserInfo(username: string) {
    let userInfo = await this.nguoiDungSerivce.getUserInfo(username).toPromise().then(
      (data) => {
        if (data?.statusCode == 0) {
          this.userInfo = data?.data
          return data?.data;
        } else {
          this.notification.error(MESSAGE.ERROR, data?.msg)
        }
      },
      (err) => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
    );
  }

  getStatusButton() {
    let checkParent = false;
    let checkChirld = false;
    let dVi = this.donVis.find(e => e.maDvi == this.maDonViTao);
    if(dVi && dVi.maDvi == this.userInfo.dvql){
      checkChirld = true;
    }
    if(dVi && dVi.parent?.maDvi == this.userInfo.dvql){
      checkParent = true;
    }

    const utils = new Utils();
    this.statusBtnDel = utils.getRoleDel(this.trangThaiBanGhi, checkChirld, this.userInfo?.roles[0]?.code);
    this.statusBtnSave = utils.getRoleSave(this.trangThaiBanGhi, checkChirld, this.userInfo?.roles[0]?.code);
    this.statusBtnApprove = utils.getRoleApprove(this.trangThaiBanGhi, checkChirld, this.userInfo?.roles[0]?.code);
    this.statusBtnTBP = utils.getRoleTBP(this.trangThaiBanGhi, checkChirld, this.userInfo?.roles[0]?.code);
    this.statusBtnLD = utils.getRoleLD(this.trangThaiBanGhi, checkChirld, this.userInfo?.roles[0]?.code);
    this.statusBtnGuiDVCT = utils.getRoleGuiDVCT(this.trangThaiBanGhi, checkChirld, this.userInfo?.roles[0]?.code);
    this.statusBtnDVCT = utils.getRoleDVCT(this.trangThaiBanGhi, checkParent, this.userInfo?.roles[0]?.code);
    this.statusBtnLDDC = utils.getRoleLDDC(this.trangThaiBanGhi, checkChirld, this.userInfo?.roles[0]?.code);
    this.statusBtnCopy = utils.getRoleCopy(this.trangThaiBanGhi, checkChirld, this.userInfo?.roles[0]?.code);
    this.statusBtnPrint = utils.getRolePrint(this.trangThaiBanGhi, checkChirld, this.userInfo?.roles[0]?.code);
  }
  //
  selectFile(files: FileList): void {
    this.fileToUpload = files.item(0);
  }

  // xoa
  xoa() {
    this.lstCTietBCao = [];
    this.lstFile = [];
    this.listFile = []
  }

  // luu
  async luu() {




    let checkSaveEdit;
    if (!this.maDviTien || !this.namBaoCaoHienHanh) {
      this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
      return;
    }
    if (this.namBaoCaoHienHanh >= 3000 || this.namBaoCaoHienHanh < 1000){
      this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.WRONG_FORMAT);
      return;
    }

    //check xem tat ca cac dong du lieu da luu chua?
    //chua luu thi bao loi, luu roi thi cho di
    this.lstCTietBCao.filter(element => {
      if (this.editCache[element.id].edit === true) {
        checkSaveEdit = false
      }
    });
    if (checkSaveEdit == false) {
      this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTSAVE);
      return;
    }

    let listFile: any = [];
    for (const iterator of this.listFile) {
      listFile.push(await this.uploadFile(iterator));
    }

    // replace nhung ban ghi dc them moi id thanh null
    this.lstCTietBCao.filter(item => {
      if (item.id?.length == 38) {
        item.id = null;
      }
    })
    let lstCTietBCaoTemp = [];
    let checkMoneyRange = true;
    this.lstCTietBCao.filter(e => {
      let qdDuyetDanDtuTongVon = mulMoney(e.qdDuyetDanDtuTongVon, this.maDviTien)
      let qdDchinhDanDtuTongVon = mulMoney(e.qdDchinhDanDtuTongVon, this.maDviTien)
      let qdDuyetTkDtoanTong  = mulMoney(e.qdDuyetTkDtoanTong, this.maDviTien)
      let klthCapDen3006Quykhac  = mulMoney(e.klthCapDen3006Quykhac, this.maDviTien)
      let klthCapDen3112Quykhac  = mulMoney(e.klthCapDen3112Quykhac, this.maDviTien)
      let qdDuyetTkDtoanXl = mulMoney(e.qdDuyetTkDtoanXl, this.maDviTien)
      let qdDuyetTkDtoanTb = mulMoney(e.qdDuyetTkDtoanTb, this.maDviTien)
      let qdDuyetTkDtoanCk = mulMoney(e.qdDuyetTkDtoanCk, this.maDviTien)
      let klthCapDen3006Nstt = mulMoney(e.klthCapDen3006Nstt, this.maDviTien)
      let klthCapDen3006DtoanChiTx = mulMoney(e.klthCapDen3006DtoanChiTx, this.maDviTien)
      let klthCapDen3112Nstt = mulMoney(e.klthCapDen3112Nstt, this.maDviTien)
      let klthCapDen3112DtoanChiTx = mulMoney(e.klthCapDen3112DtoanChiTx, this.maDviTien)
      let ncauVonN1  = mulMoney(e.ncauVonN1, this.maDviTien)
      let ncauVonN2  = mulMoney(e.ncauVonN2, this.maDviTien)
      let ncauVonN3  = mulMoney(e.ncauVonN3, this.maDviTien)
      if(
        qdDuyetDanDtuTongVon > MONEY_LIMIT ||
        qdDchinhDanDtuTongVon > MONEY_LIMIT ||
        qdDuyetTkDtoanTong > MONEY_LIMIT ||
        klthCapDen3006Quykhac > MONEY_LIMIT ||
        klthCapDen3112Quykhac > MONEY_LIMIT ||
        qdDuyetTkDtoanXl > MONEY_LIMIT ||
        qdDuyetTkDtoanTb > MONEY_LIMIT ||
        qdDuyetTkDtoanCk > MONEY_LIMIT ||
        klthCapDen3006Nstt > MONEY_LIMIT ||
        klthCapDen3006DtoanChiTx > MONEY_LIMIT ||
        klthCapDen3112Nstt > MONEY_LIMIT ||
        klthCapDen3112DtoanChiTx > MONEY_LIMIT ||
        ncauVonN1 > MONEY_LIMIT ||
        ncauVonN2 > MONEY_LIMIT ||
        ncauVonN3 > MONEY_LIMIT
      ){
        checkMoneyRange = false;
        return
      }
      lstCTietBCaoTemp.push({
        ...e,
         qdDuyetDanDtuTongVon : qdDuyetDanDtuTongVon ,
         qdDchinhDanDtuTongVon : qdDchinhDanDtuTongVon ,
         qdDuyetTkDtoanTong  : qdDuyetTkDtoanTong ,
         klthCapDen3006Quykhac  : klthCapDen3006Quykhac ,
         klthCapDen3112Quykhac  : klthCapDen3112Quykhac ,
         qdDuyetTkDtoanXl : qdDuyetTkDtoanXl ,
         qdDuyetTkDtoanTb : qdDuyetTkDtoanTb ,
         qdDuyetTkDtoanCk : qdDuyetTkDtoanCk ,
         klthCapDen3006Nstt : klthCapDen3006Nstt ,
         klthCapDen3006DtoanChiTx : klthCapDen3006DtoanChiTx ,
         klthCapDen3112Nstt : klthCapDen3112Nstt ,
         klthCapDen3112DtoanChiTx : klthCapDen3112DtoanChiTx ,
         ncauVonN1  : ncauVonN1 ,
         ncauVonN2  : ncauVonN2 ,
         ncauVonN3  : ncauVonN3 ,
      })
    })
    if(!checkMoneyRange == true){
      this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.MONEYRANGE)
    }else{
      // gui du lieu trinh duyet len server
      let request = {
        id: this.id,
        fileDinhKems: listFile,
        listIdDeleteFiles: this.listIdDeleteFiles,                      // id file luc get chi tiet tra ra( de backend phuc vu xoa file)
        listIdDeletes: this.listIdDelete,
        lstCTietBCao: lstCTietBCaoTemp,
        maBcao: this.maBaoCao,
        maDvi: this.maDonViTao,
        maDviTien: this.maDviTien,
        maLoaiBcao: QLNV_KHVONPHI_TC_NCAU_KHOACH_DTXD_GD3N,
        namHienHanh: this.namBaoCaoHienHanh,
        namBcao: this.namBaoCaoHienHanh,
      };

      //call service them moi
      this.spinner.show();
      if (this.id == null) {
        this.quanLyVonPhiService.trinhDuyetService(request).subscribe(
          async data => {
            if (data.statusCode == 0) {
              this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
              this.id = data.data.id;
              await this.getDetailReport();
              this.getStatusButton();
            } else {
              this.divMoneyTotal()
              this.notification.error(MESSAGE.ERROR, data?.msg);
            }
          },
          err => {
            this.divMoneyTotal()
            this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
          },
        );
      } else {
        this.quanLyVonPhiService.updatelist(request).subscribe(async res => {
          if (res.statusCode == 0) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
            this.id = res.data.id;
              await this.getDetailReport();
              this.getStatusButton();
          } else {
            this.divMoneyTotal()
            this.notification.error(MESSAGE.ERROR, res?.msg);
          }
        }, err => {
          this.divMoneyTotal()
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        })
      }
    }
    this.lstCTietBCao.filter(item => {
      if (!item.id) {
        item.id = uuid.v4()+'FE';
      }
    });
    this.updateEditCache()
    this.spinner.hide();
  }

  // chuc nang check role
  onSubmit(mcn: String) {
    const requestGroupButtons = {
      id: this.id,
      maChucNang: mcn,
      type: "",
    };
    if(this.id){
      this.spinner.show();
      this.quanLyVonPhiService.approve(requestGroupButtons).toPromise().then(async (data) => {
        if (data.statusCode == 0) {
          await this.getDetailReport();
          this.getStatusButton();
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.APPROVE_SUCCESS);
        }else{
          this.notification.error(MESSAGE.ERROR, data?.msg);
        }
      },err => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      });
      this.spinner.hide();
      this.updateEditCache();
    }else{
      this.notification.warning(MESSAGE.WARNING, MESSAGE.MESSAGE_DELETE_WARNING)
    }
  }

  //thay doi trang thai
  changeStatus(status: boolean) {
    this.status = status;
  }

  // call chi tiet bao cao
  async getDetailReport() {
    this.spinner.show();
    await this.quanLyVonPhiService.bCLapThamDinhDuToanChiTiet(this.id).toPromise().then(
      (data) => {
        if (data.statusCode == 0) {
          this.chiTietBcaos = data.data;
          this.lstCTietBCao = data.data?.lstCTietBCao;
          if( data.data.lstCTietBCao){
            this.lstFile = data.data.lstFile;

            // set thong tin chung bao cao
            this.ngayNhap = this.datePipe.transform(data.data.ngayTao,Utils.FORMAT_DATE_STR);
            this.nguoiNhap = data.data.nguoiTao;
            this.maDonViTao = data.data.maDvi;
            this.maBaoCao = data.data.maBcao;
            this.namBaoCaoHienHanh = data.data.namHienHanh;
            this.trangThaiBanGhi = data.data.trangThai;
            this.maDviTien = data.data.maDviTien;
            this.divMoneyTotal()
            this.listFile=[]
            this.tinhTong()
            if (
              this.trangThaiBanGhi == Utils.TT_BC_1 ||
              this.trangThaiBanGhi == Utils.TT_BC_3 ||
              this.trangThaiBanGhi == Utils.TT_BC_5 ||
              this.trangThaiBanGhi == Utils.TT_BC_8 ||
              this.trangThaiBanGhi == Utils.TT_BC_10
            ) {
              this.status = false;
            } else {
              this.status = true;
            }


            this.updateEditCache();
          }else{
            this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);

          }


        } else {
          this.notification.error(MESSAGE.ERROR, data?.msg);
        }
      },
      (err) => {
        console.log(err);
       this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
    );
    this.spinner.hide();
  }

  //upload file
  async uploadFile(file: File) {
    // day file len server
    const upfile: FormData = new FormData();
    upfile.append('file', file);
    upfile.append('folder', this.maBaoCao + '/' + this.maDonViTao + '/');
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
        console.log('false :', err);
      },
    );
    return temp;
  }

  // them dong moi
  addLine(id: number): void {
    let item : ItemData = {
      tenDan:"",
      maKhoach:"",
      maKhoiDan:"",
      maDdiemXd:"",
      ddiemMoTaikhoan:"",
      masoDan:"",
      maNganhKte:"",
      nlucTke:"",
      namKcTte:0,
      namHtTte:0,
      qdDuyetDanDtuSongaythang:"",
      qdDuyetDanDtuTongVon:0,
      qdDchinhDanDtuSongaythang:"",
      qdDchinhDanDtuTongVon:0,
      qdDuyetTkDtoanSongaythang:"",
      qdDuyetTkDtoanTong:0,
      qdDuyetTkDtoanXl:0,
      qdDuyetTkDtoanTb:0,
      qdDuyetTkDtoanCk:0,
      klthCapDen3006Songaythang:"",
      klthCapDen3006Nstt:0,
      klthCapDen3006DtoanChiTx:0,
      klthCapDen3006Quykhac:0,
      klthCapDen3112Songaythang:"",
      klthCapDen3112Nstt:0,
      klthCapDen3112DtoanChiTx:0,
      klthCapDen3112Quykhac:0,
      ncauVonN1:0,
      ncauVonN2:0,
      ncauVonN3:0,
      ghiChu:"",
      maBcao: "",
      stt: "",
      id: uuid.v4()+'FE',
      checked:false,
    }

    this.lstCTietBCao.splice(id, 0, item);
    this.editCache[item.id] = {
      edit: true,
      data: { ...item }
    };
  }

  // xoa dong
  deleteById(id: any): void {
    this.tongqdDuyetDanDtuTongVon -= this.lstCTietBCao.find(e => e.id == id).qdDuyetDanDtuTongVon
    this.tongqdDchinhDanDtuTongVon -= this.lstCTietBCao.find(e => e.id == id).qdDchinhDanDtuTongVon
    this.tongqdDuyetTkDtoanTong -= this.lstCTietBCao.find(e => e.id == id).qdDuyetTkDtoanTong
    this.tongklthCapDen3006Quykhac -= this.lstCTietBCao.find(e => e.id == id).klthCapDen3006Quykhac
    this.tongklthCapDen3112Quykhac -= this.lstCTietBCao.find(e => e.id == id).klthCapDen3112Quykhac
    this.tongqdDuyetTkDtoanXl -= this.lstCTietBCao.find(e => e.id == id).qdDuyetTkDtoanXl
    this.tongqdDuyetTkDtoanTb -= this.lstCTietBCao.find(e => e.id == id).qdDuyetTkDtoanTb
    this.tongqdDuyetTkDtoanCk -= this.lstCTietBCao.find(e => e.id == id).qdDuyetTkDtoanCk
    this.tongklthCapDen3006Nstt -= this.lstCTietBCao.find(e => e.id == id).klthCapDen3006Nstt
    this.tongklthCapDen3006DtoanChiTx -= this.lstCTietBCao.find(e => e.id == id).klthCapDen3006DtoanChiTx
    this.tongklthCapDen3112Nstt -= this.lstCTietBCao.find(e => e.id == id).klthCapDen3112Nstt
    this.tongklthCapDen3112DtoanChiTx -= this.lstCTietBCao.find(e => e.id == id).klthCapDen3112DtoanChiTx
    this.tongncauVonN1 -= this.lstCTietBCao.find(e => e.id == id).ncauVonN1
    this.tongncauVonN2 -= this.lstCTietBCao.find(e => e.id == id).ncauVonN2
    this.tongncauVonN3 -= this.lstCTietBCao.find(e => e.id == id).ncauVonN3
    this.lstCTietBCao = this.lstCTietBCao.filter(item => item.id != id)
    if (id?.length == 36) {
      this.listIdDelete += id + ","
    }
  }

  // xóa với checkbox
  deleteSelected() {
    // add list delete id
    this.lstCTietBCao.filter(item => {
      if(item.checked){
        this.tongqdDuyetDanDtuTongVon -= item.qdDuyetDanDtuTongVon
        this.tongqdDchinhDanDtuTongVon -= item.qdDchinhDanDtuTongVon
        this.tongqdDuyetTkDtoanTong -= item.qdDuyetTkDtoanTong
        this.tongklthCapDen3006Quykhac -= item.klthCapDen3006Quykhac
        this.tongklthCapDen3112Quykhac -= item.klthCapDen3112Quykhac
        this.tongqdDuyetTkDtoanXl -= item.qdDuyetTkDtoanXl
        this.tongqdDuyetTkDtoanTb -= item.qdDuyetTkDtoanTb
        this.tongqdDuyetTkDtoanCk -= item.qdDuyetTkDtoanCk
        this.tongklthCapDen3006Nstt -= item.klthCapDen3006Nstt
        this.tongklthCapDen3006DtoanChiTx -= item.klthCapDen3006DtoanChiTx
        this.tongklthCapDen3112Nstt -= item.klthCapDen3112Nstt
        this.tongklthCapDen3112DtoanChiTx -= item.klthCapDen3112DtoanChiTx
        this.tongncauVonN1 -= item.ncauVonN1
        this.tongncauVonN2 -= item.ncauVonN2
        this.tongncauVonN3 -= item.ncauVonN3
      }
      if(item.checked == true && item?.id?.length == 36){
        this.listIdDelete += item.id + ","
      }
    })
    // delete object have checked = true
    this.lstCTietBCao = this.lstCTietBCao.filter(item => item.checked != true )
    this.allChecked = false;
  }
  // xoa file trong bang file
  deleteFile(id: string): void {
    this.lstFile = this.lstFile.filter((a: any) => a.id !== id);
    this.listFile = this.listFile.filter((a: any) => a?.lastModified.toString() !== id);
    // set list for delete
    this.listIdDeleteFiles += id + ",";
  }

  //download file về máy tính
  async downloadFile(id: string) {
    let file!: File;
    file = this.listFile.find(element => element?.lastModified.toString() == id );
    if(!file){
      let fileAttach = this.lstFile.find(element => element?.id == id );
      if(fileAttach){
        await this.quanLyVonPhiService.downloadFile(fileAttach.fileUrl).toPromise().then(
          (data) => {
            fileSaver.saveAs(data, fileAttach.fileName);
          },
          err => {
            this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
          },
        );
      }
    }else{
      const blob = new Blob([file], { type: "application/octet-stream" });
      fileSaver.saveAs(blob, file.name);
    }
  }
  updateAllChecked(): void {
    this.indeterminate = false;
    if (this.allChecked) {
      this.lstCTietBCao = this.lstCTietBCao.map(item => ({
        ...item,
        checked: true
      }));
    } else {
      this.lstCTietBCao = this.lstCTietBCao.map(item => ({
        ...item,
        checked: false
      }));
    }
  }

  updateSingleChecked(): void {
    if (this.lstCTietBCao.every(item => !item.checked)) {
      this.allChecked = false;
      this.indeterminate = false;
    } else if (this.lstCTietBCao.every(item => item.checked)) {
      this.allChecked = true;
      this.indeterminate = false;
    } else {
      this.indeterminate = true;
    }
  }

  redirectChiTieuKeHoachNam() {
    // this.router.navigate(['/kehoach/chi-tieu-ke-hoach-nam-cap-tong-cuc']);
    this.location.back()
  }

  getStatusName(){
    const utils = new Utils();
    return utils.getStatusName(this.trangThaiBanGhi);
  }

  getUnitName(){
 return this.donVis.find(item => item.maDvi== this.maDonViTao)?.tenDvi;
  }

  startEdit(id: string): void {
    this.editCache[id].edit = true;
  }

  cancelEdit(id: string): void {
    const index = this.lstCTietBCao.findIndex(item => item.id === id);
    if (!this.lstCTietBCao[index].maKhoach){
			this.deleteById(id);
			return;
		}

    this.editCache[id] = {
      data: { ...this.lstCTietBCao[index] },
      edit: false
    };
  }

  // luu thay doi
  saveEdit(id: string): void {
    if (
      !this.editCache[id].data.maKhoach ||
      !this.editCache[id].data.maKhoiDan ||
      !this.editCache[id].data.maDdiemXd ||
      !this.editCache[id].data.maDdiemXd ||
      !this.editCache[id].data.tenDan||
      !this.editCache[id].data.masoDan||
      !this.editCache[id].data.ddiemMoTaikhoan||
      !this.editCache[id].data.klthCapDen3006Songaythang ||
      !this.editCache[id].data.qdDuyetTkDtoanSongaythang||
      !this.editCache[id].data.qdDuyetDanDtuSongaythang||
      !this.editCache[id].data.nlucTke||
      !this.editCache[id].data.ghiChu||
      !this.editCache[id].data.klthCapDen3112Songaythang ||
      // !this.editCache[id].data.namKcTte||
      // !this.editCache[id].data.namHtTte||
      (!this.editCache[id].data.qdDuyetDanDtuTongVon && this.editCache[id].data.qdDuyetDanDtuTongVon !==0)||
      // (!this.editCache[id].data.qdDchinhDanDtuTongVon && this.editCache[id].data.qdDchinhDanDtuTongVon !==0)||
      (!this.editCache[id].data.qdDuyetTkDtoanXl && this.editCache[id].data.qdDuyetTkDtoanXl !==0)||
      (!this.editCache[id].data.qdDuyetTkDtoanTb && this.editCache[id].data.qdDuyetTkDtoanTb !==0)||
      (!this.editCache[id].data.qdDuyetTkDtoanCk && this.editCache[id].data.qdDuyetTkDtoanCk !==0)||
      (!this.editCache[id].data.klthCapDen3006Nstt && this.editCache[id].data.klthCapDen3006Nstt !==0)||
      (!this.editCache[id].data.klthCapDen3006DtoanChiTx && this.editCache[id].data.klthCapDen3006DtoanChiTx !==0)||
      (!this.editCache[id].data.klthCapDen3006Quykhac && this.editCache[id].data.klthCapDen3006Quykhac !==0)||
      (!this.editCache[id].data.klthCapDen3112Nstt && this.editCache[id].data.klthCapDen3112Nstt !==0)||
      (!this.editCache[id].data.klthCapDen3112DtoanChiTx && this.editCache[id].data.klthCapDen3112DtoanChiTx !==0)||
      (!this.editCache[id].data.klthCapDen3112Quykhac && this.editCache[id].data.klthCapDen3112Quykhac !==0)||
      (!this.editCache[id].data.ncauVonN1 && this.editCache[id].data.ncauVonN1 !==0)||
      (!this.editCache[id].data.ncauVonN2 && this.editCache[id].data.ncauVonN2 !==0)||
      (!this.editCache[id].data.ncauVonN3 && this.editCache[id].data.ncauVonN3 !==0)
      ) {
      this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
      return
    }
    // if((this.editCache[id].data.namKcTte <= 1000 ||  this.editCache[id].data.namKcTte >= 2999) || (this.editCache[id].data.namHtTte <= 1000 ||  this.editCache[id].data.namHtTte >= 2999))
    // {
    //   this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.WRONG_FORMAT);
    //   return
    // }
      this.editCache[id].data.checked = this.lstCTietBCao.find(item => item.id === id).checked; // set checked editCache = checked lstCTietBCao
      const index = this.lstCTietBCao.findIndex(item => item.id === id);   // lay vi tri hang minh sua
      Object.assign(this.lstCTietBCao[index], this.editCache[id].data); // set lai data cua lstCTietBCao[index] = this.editCache[id].data
      this.editCache[id].edit = false;  // CHUYEN VE DANG TEXT
      this.tinhTong()
  }

  updateEditCache(): void {
    this.lstCTietBCao.forEach(item => {
      this.editCache[item.id] = {
        edit: false,
        data: { ...item }
      };
    });
  }

  changeModel(id: string): void {
    this.editCache[id].data.qdDuyetTkDtoanTong = Number(this.editCache[id].data.qdDuyetTkDtoanXl) + Number(this.editCache[id].data.qdDuyetTkDtoanTb) +  Number(this.editCache[id].data.qdDuyetTkDtoanCk);
  }
  //call tong hop
  async calltonghop(){
    this.spinner.show();
    this.maDviTien = "1"
    let objtonghop={
        maDvi: this.maDvi,
        maLoaiBcao: this.maLoaiBacao,
        namHienTai: this.nam,
    }
    await this.quanLyVonPhiService.tongHop(objtonghop).toPromise().then(res => {
        if(res.statusCode==0){
            this.lstCTietBCao = res.data;
            this.lstCTietBCao.forEach(e => {
              e.id = uuid.v4()+'FE';
            })
        }else{
          this.notification.error(MESSAGE.ERROR, res?.msg);
        }
    },err =>{
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      console.log(err);
    });
    this.tinhTong()
    this.updateEditCache()
    this.spinner.hide();
  }

  xoaBaoCao(){
    if(this.id){
      this.quanLyVonPhiService.xoaBaoCaoLapThamDinh(this.id).toPromise().then( async res => {
        if(res.statusCode==0){
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.DELETE_SUCCESS);
          this.location.back();
        }else {
          this.notification.error(MESSAGE.ERROR, res?.msg);
        }
      },err => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      })
      }else {
        this.notification.warning(MESSAGE.WARNING, MESSAGE.MESSAGE_DELETE_WARNING)
      }
    }
    // action copy
  async doCopy() {
    this.spinner.show();

    let maBaoCao = await this.quanLyVonPhiService.sinhMaBaoCao().toPromise().then(
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

    // replace nhung ban ghi dc them moi id thanh null
    let lstTemp = []
    let checkMoneyRange = true;
    this.lstCTietBCao.filter(e => {
      let qdDuyetDanDtuTongVon = mulMoney(e.qdDuyetDanDtuTongVon, this.maDviTien)
      let qdDchinhDanDtuTongVon = mulMoney(e.qdDchinhDanDtuTongVon, this.maDviTien)
      let qdDuyetTkDtoanTong  = mulMoney(e.qdDuyetTkDtoanTong, this.maDviTien)
      let klthCapDen3006Quykhac  = mulMoney(e.klthCapDen3006Quykhac, this.maDviTien)
      let klthCapDen3112Quykhac  = mulMoney(e.klthCapDen3112Quykhac, this.maDviTien)
      let qdDuyetTkDtoanXl = mulMoney(e.qdDuyetTkDtoanXl, this.maDviTien)
      let qdDuyetTkDtoanTb = mulMoney(e.qdDuyetTkDtoanTb, this.maDviTien)
      let qdDuyetTkDtoanCk = mulMoney(e.qdDuyetTkDtoanCk, this.maDviTien)
      let klthCapDen3006Nstt = mulMoney(e.klthCapDen3006Nstt, this.maDviTien)
      let klthCapDen3006DtoanChiTx = mulMoney(e.klthCapDen3006DtoanChiTx, this.maDviTien)
      let klthCapDen3112Nstt = mulMoney(e.klthCapDen3112Nstt, this.maDviTien)
      let klthCapDen3112DtoanChiTx = mulMoney(e.klthCapDen3112DtoanChiTx, this.maDviTien)
      let ncauVonN1  = mulMoney(e.ncauVonN1, this.maDviTien)
      let ncauVonN2  = mulMoney(e.ncauVonN2, this.maDviTien)
      let ncauVonN3  = mulMoney(e.ncauVonN3, this.maDviTien)
      if(
        qdDuyetDanDtuTongVon > MONEY_LIMIT ||
        qdDchinhDanDtuTongVon > MONEY_LIMIT ||
        qdDuyetTkDtoanTong > MONEY_LIMIT ||
        klthCapDen3006Quykhac > MONEY_LIMIT ||
        klthCapDen3112Quykhac > MONEY_LIMIT ||
        qdDuyetTkDtoanXl > MONEY_LIMIT ||
        qdDuyetTkDtoanTb > MONEY_LIMIT ||
        qdDuyetTkDtoanCk > MONEY_LIMIT ||
        klthCapDen3006Nstt > MONEY_LIMIT ||
        klthCapDen3006DtoanChiTx > MONEY_LIMIT ||
        klthCapDen3112Nstt > MONEY_LIMIT ||
        klthCapDen3112DtoanChiTx > MONEY_LIMIT ||
        ncauVonN1 > MONEY_LIMIT ||
        ncauVonN2 > MONEY_LIMIT ||
        ncauVonN3 > MONEY_LIMIT
      ){
        checkMoneyRange = false;
        return
      }
      lstTemp.push({
        ...e,
         qdDuyetDanDtuTongVon : qdDuyetDanDtuTongVon ,
         qdDchinhDanDtuTongVon : qdDchinhDanDtuTongVon ,
         qdDuyetTkDtoanTong  : qdDuyetTkDtoanTong ,
         klthCapDen3006Quykhac  : klthCapDen3006Quykhac ,
         klthCapDen3112Quykhac  : klthCapDen3112Quykhac ,
         qdDuyetTkDtoanXl : qdDuyetTkDtoanXl ,
         qdDuyetTkDtoanTb : qdDuyetTkDtoanTb ,
         qdDuyetTkDtoanCk : qdDuyetTkDtoanCk ,
         klthCapDen3006Nstt : klthCapDen3006Nstt ,
         klthCapDen3006DtoanChiTx : klthCapDen3006DtoanChiTx ,
         klthCapDen3112Nstt : klthCapDen3112Nstt ,
         klthCapDen3112DtoanChiTx : klthCapDen3112DtoanChiTx ,
         ncauVonN1  : ncauVonN1 ,
         ncauVonN2  : ncauVonN2 ,
         ncauVonN3  : ncauVonN3 ,
      })
    })
    if(!checkMoneyRange == true){
      this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.MONEYRANGE)
    }else{
      let request = {
        id: null,
        listIdDeletes: null,
        fileDinhKems: null,
        listIdDeleteFiles: null,                      // id file luc get chi tiet tra ra( de backend phuc vu xoa file)
        lstCTietBCao: lstTemp,
        maBcao: maBaoCao,
        maDvi: this.maDonViTao,
        maDviTien: this.maDviTien,
        maLoaiBcao: this.maLoaiBaoCao = QLNV_KHVONPHI_TC_NCAU_KHOACH_DTXD_GD3N,
        namHienHanh: this.namBaoCaoHienHanh,
        namBcao: this.namBaoCaoHienHanh + 1,
        soVban: null,
      };
      //call service them moi
      this.spinner.show();
      this.quanLyVonPhiService.trinhDuyetService(request).toPromise().then(
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
          }
        },
        err => {
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        },
      );
    }
  this.spinner.hide();
  }

  // action print
  doPrint() {
    let WindowPrt = window.open(
      '',
      '',
      'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0',
    );
    let printContent = '';
    printContent = printContent + '<div>';
    printContent =
      printContent + document.getElementById('tablePrint').innerHTML;
    printContent = printContent + '</div>';
    WindowPrt.document.write(printContent);
    WindowPrt.document.close();
    WindowPrt.focus();
    WindowPrt.print();
    WindowPrt.close();
  }
  divMoneyTotal() {
    this.lstCTietBCao.filter(element => {
      element.qdDuyetDanDtuTongVon= divMoney(element.qdDuyetDanDtuTongVon, this.maDviTien);
      element.qdDuyetTkDtoanTong = divMoney(element.qdDuyetTkDtoanTong, this.maDviTien);
      element.qdDchinhDanDtuTongVon= divMoney(element.qdDchinhDanDtuTongVon, this.maDviTien);
      element.klthCapDen3006Quykhac = divMoney(element.klthCapDen3006Quykhac, this.maDviTien);
      element.klthCapDen3112Quykhac = divMoney(element.klthCapDen3112Quykhac, this.maDviTien);
      element.qdDuyetTkDtoanXl= divMoney(element.qdDuyetTkDtoanXl, this.maDviTien);
      element.qdDuyetTkDtoanTb= divMoney(element.qdDuyetTkDtoanTb, this.maDviTien);
      element.qdDuyetTkDtoanCk= divMoney(element.qdDuyetTkDtoanCk, this.maDviTien);
      element.klthCapDen3006Nstt= divMoney(element.klthCapDen3006Nstt, this.maDviTien);
      element.klthCapDen3006DtoanChiTx= divMoney(element.klthCapDen3006DtoanChiTx, this.maDviTien);
      element.klthCapDen3112Nstt= divMoney(element.klthCapDen3112Nstt, this.maDviTien);
      element.klthCapDen3112DtoanChiTx= divMoney(element.klthCapDen3112DtoanChiTx, this.maDviTien);
      element.ncauVonN1 = divMoney(element.ncauVonN1, this.maDviTien);
      element.ncauVonN2 = divMoney(element.ncauVonN2, this.maDviTien);
      element.ncauVonN3 = divMoney(element.ncauVonN3, this.maDviTien);
    });
  }
  mulMoneyTotal() {
    this.lstCTietBCao.filter(element => {
      element.qdDuyetDanDtuTongVon= mulMoney(element.qdDuyetDanDtuTongVon, this.maDviTien);
      element.qdDchinhDanDtuTongVon= mulMoney(element.qdDchinhDanDtuTongVon, this.maDviTien);
      element.qdDuyetTkDtoanTong = mulMoney(element.qdDuyetTkDtoanTong, this.maDviTien);
      element.klthCapDen3006Quykhac = mulMoney(element.klthCapDen3006Quykhac, this.maDviTien);
      element.klthCapDen3112Quykhac = mulMoney(element.klthCapDen3112Quykhac, this.maDviTien);
      element.qdDuyetTkDtoanXl= mulMoney(element.qdDuyetTkDtoanXl, this.maDviTien);
      element.qdDuyetTkDtoanTb= mulMoney(element.qdDuyetTkDtoanTb, this.maDviTien);
      element.qdDuyetTkDtoanCk= mulMoney(element.qdDuyetTkDtoanCk, this.maDviTien);
      element.klthCapDen3006Nstt= mulMoney(element.klthCapDen3006Nstt, this.maDviTien);
      element.klthCapDen3006DtoanChiTx= mulMoney(element.klthCapDen3006DtoanChiTx, this.maDviTien);
      element.klthCapDen3112Nstt= mulMoney(element.klthCapDen3112Nstt, this.maDviTien);
      element.klthCapDen3112DtoanChiTx= mulMoney(element.klthCapDen3112DtoanChiTx, this.maDviTien);
      element.ncauVonN1 = mulMoney(element.ncauVonN1, this.maDviTien);
      element.ncauVonN2 = mulMoney(element.ncauVonN2, this.maDviTien);
      element.ncauVonN3 = mulMoney(element.ncauVonN3, this.maDviTien);
    });
  }

  tinhTong(){
    this.tongqdDuyetDanDtuTongVon = 0;
    this.tongqdDchinhDanDtuTongVon = 0;
    this.tongqdDuyetTkDtoanTong = 0;
    this.tongklthCapDen3006Quykhac = 0;
    this.tongklthCapDen3112Quykhac = 0;
    this.tongqdDuyetTkDtoanXl = 0;
    this.tongqdDuyetTkDtoanTb = 0;
    this.tongqdDuyetTkDtoanCk = 0;
    this.tongklthCapDen3006Nstt = 0;
    this.tongklthCapDen3006DtoanChiTx = 0;
    this.tongklthCapDen3112Nstt = 0;
    this.tongklthCapDen3112DtoanChiTx = 0;
    this.tongncauVonN1 = 0;
    this.tongncauVonN2 = 0;
    this.tongncauVonN3 = 0;
    this.lstCTietBCao.forEach( e => {
      this.tongqdDuyetDanDtuTongVon += e.qdDuyetDanDtuTongVon
      this.tongqdDchinhDanDtuTongVon += e.qdDchinhDanDtuTongVon
      this.tongqdDuyetTkDtoanTong += e.qdDuyetTkDtoanTong
      this.tongklthCapDen3006Quykhac += e.klthCapDen3006Quykhac
      this.tongklthCapDen3112Quykhac += e.klthCapDen3112Quykhac
      this.tongqdDuyetTkDtoanXl += e.qdDuyetTkDtoanXl
      this.tongqdDuyetTkDtoanTb += e.qdDuyetTkDtoanTb
      this.tongqdDuyetTkDtoanCk += e.qdDuyetTkDtoanCk
      this.tongklthCapDen3006Nstt += e.klthCapDen3006Nstt
      this.tongklthCapDen3006DtoanChiTx += e.klthCapDen3006DtoanChiTx
      this.tongklthCapDen3112Nstt += e.klthCapDen3112Nstt
      this.tongklthCapDen3112DtoanChiTx += e.klthCapDen3112DtoanChiTx
      this.tongncauVonN1 += e.ncauVonN1
      this.tongncauVonN2 += e.ncauVonN2
      this.tongncauVonN3 += e.ncauVonN3
    })
  }

}
