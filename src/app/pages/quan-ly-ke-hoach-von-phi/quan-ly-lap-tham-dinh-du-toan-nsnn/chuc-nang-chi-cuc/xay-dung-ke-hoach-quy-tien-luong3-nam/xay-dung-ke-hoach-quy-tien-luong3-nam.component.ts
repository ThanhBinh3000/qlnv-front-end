import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as uuid from "uuid";
import { DanhMucHDVService } from '../../../../../services/danhMucHDV.service';
import { DatePipe, Location } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { DomSanitizer } from '@angular/platform-browser';
import * as fileSaver from 'file-saver';
import { divMoney, DONVITIEN, MONEYLIMIT, mulMoney, QLNV_KHVONPHI_KHOACH_QUY_TIEN_LUONG_GD3N, Utils } from "../../../../../Utility/utils";
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MESSAGE } from '../../../../../constants/message';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { NzModalService } from 'ng-zorro-antd/modal';
import { DialogCopyComponent } from 'src/app/components/dialog/dialog-copy/dialog-copy.component';


export class ItemData {
  maDvi!: String;
  tongCboN!: number;
  tongBcheDuocPdN!: number;
  tongQuyLuongCoTchatLuongN!: number;
  tuongCbanN!: number;
  phuCapN!: number;
  cacKhoanDgopN!: number;
  tongQuyLuongCoTchatLuongTheoBcheN!:number;

  tongCboThienN!: number;
  tongBcheDuocPdThienN!: number;
  tongQuyLuongCoTchatLuongThienN!: number;
  luongCbanThienN!: number;
  phuCapThienN!: number;
  cacKhoanDgopThienN!: number;
  tongQuyLuongCoTchatLuongTheoBcheThienN!: number;

  tongCboN1!: number;
  tongBcheDuocPdN1!: number;
  tongQuyLuongCoTchatLuongN1!: number;
  luongCbanN1!: number;
  phuCapN1!: number;
  cacKhoanDgopN1!: number;
  tongQuyLuongCoTchatLuongTheoBcheN1!: number;

  tongCboN2!: number;
  tongBcheDuocPdN2!: number;
  tongQuyLuongCoTchatLuongN2!: number;
  luongCbanN2!: number;
  phuCapN2!: number;
  cacKhoanDgopN2!: number;
  tongQuyLuongCoTchatLuongTheoBcheN2!: number;

  tongCboN3!: number;
  tongBcheDuocPdN3!: number;
  tongQuyLuongCoTchatLuongN3!: number;
  luongCbanN3!: number;
  phuCapN3!: number;
  cacKhoanDgopN3!: number;
  tongQuyLuongCoTchatLuongTheoBcheN3!: number;
  id!: any;
  maBcao!: String;
  stt!: String;
  checked!:boolean;
}

@Component({
  selector: 'app-xay-dung-ke-hoach-quy-tien-luong3-nam',
  templateUrl: './xay-dung-ke-hoach-quy-tien-luong3-nam.component.html',
  styleUrls: ['./xay-dung-ke-hoach-quy-tien-luong3-nam.component.scss']
})

export class XayDungKeHoachQuyTienLuong3NamComponent implements OnInit {
  userInfo: any;
  errorMessage!: String;                      //
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
  maLoaiBaoCao: string = QLNV_KHVONPHI_KHOACH_QUY_TIEN_LUONG_GD3N;                // nam bao cao
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
  checkKV:boolean;                       // trang thai
  capDvi:any;
  soVban:any;
  capDv:any;
  checkDv:boolean;
  currentday: Date = new Date();
  validateForm!: FormGroup;
  messageValidate:any =MESSAGEVALIDATE;
  donViTiens: any = DONVITIEN;

  beforeUpload = (file: NzUploadFile): boolean => {
    this.fileList = this.fileList.concat(file);
    return false;
  };

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
              private userSerivce: UserService,
              private danhMucService: DanhMucHDVService,
              private notification: NzNotificationService,
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
    this.id = this.routerActive.snapshot.paramMap.get('id');
    this.maDonViTao = this.routerActive.snapshot.paramMap.get('maDvi');
    this.maLoaiBaoCao = this.routerActive.snapshot.paramMap.get('maLoaiBacao');
    this.namBaoCaoHienHanh = this.routerActive.snapshot.paramMap.get('nam');
    let userName = this.userSerivce.getUserName();
    await this.getUserInfo(userName); //get user info
    if (this.id) {
      await this.getDetailReport();
    }else if (
      this.maDonViTao != null &&
      this.maLoaiBaoCao != null &&
      this.namBaoCaoHienHanh != null
    ) {
      await this.calltonghop();
      this.nguoiNhap = this.userInfo?.username;
      this.ngayNhap = this.datePipe.transform(this.currentday, Utils.FORMAT_DATE_STR);
      this.maDonViTao = this.userInfo?.dvql;
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
    } else {
      this.trangThaiBanGhi = "1";
      this.nguoiNhap = this.userInfo?.username;
      this.maDonViTao = this.userInfo?.dvql;
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

    this.getStatusButton();

    //lay danh sach danh muc don vi
    await this.danhMucService.dMDonVi().toPromise().then(
      (data) => {
        if (data.statusCode == 0) {
          this.donVis = data.data;
          this.donVis.forEach(e => {
            if(e.maDvi==this.maDonViTao){
              this.capDvi = e.capDvi;
            }
          })
          let Dvi = this.donVis.find(e => e.maDvi == this.maDonViTao);
          this.capDv = Dvi.capDvi;
          if( this.capDv == '2'){
            this.checkDv = false;
          }else{
            this.checkDv = true;
          }

        } else {
          this.notification.error(MESSAGE.ERROR, data?.msg);
        }
      },
      (err) => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
    );

    if(this.capDvi=='3'){
      this.checkKV=true;
    }else{
      this.checkKV = false;
    }
    this.getStatusButton()
    this.spinner.hide();
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
    this.statusBtnDel = utils.getRoleDel(this.trangThaiBanGhi, checkChirld, this.userInfo?.roles[0]?.id);
    this.statusBtnSave = utils.getRoleSave(this.trangThaiBanGhi, checkChirld, this.userInfo?.roles[0]?.id);
    this.statusBtnApprove = utils.getRoleApprove(this.trangThaiBanGhi, checkChirld, this.userInfo?.roles[0]?.id);
    this.statusBtnTBP = utils.getRoleTBP(this.trangThaiBanGhi, checkChirld, this.userInfo?.roles[0]?.id);
    this.statusBtnLD = utils.getRoleLD(this.trangThaiBanGhi, checkChirld, this.userInfo?.roles[0]?.id);
    this.statusBtnGuiDVCT = utils.getRoleGuiDVCT(this.trangThaiBanGhi, checkChirld, this.userInfo?.roles[0]?.id);
    this.statusBtnDVCT = utils.getRoleDVCT(this.trangThaiBanGhi, checkParent, this.userInfo?.roles[0]?.id);
    this.statusBtnLDDC = utils.getRoleLDDC(this.trangThaiBanGhi, checkChirld, this.userInfo?.roles[0]?.id);
    this.statusBtnCopy = utils.getRoleCopy(this.trangThaiBanGhi, checkChirld, this.userInfo?.roles[0]?.id);
    this.statusBtnPrint = utils.getRolePrint(this.trangThaiBanGhi, checkChirld, this.userInfo?.roles[0]?.id);
  }

  //get user info
  async getUserInfo(username: string) {
    let userInfo = await this.userSerivce.getUserInfo(username).toPromise().then(
      (data) => {
        if (data?.statusCode == 0) {
          this.userInfo = data?.data
          return data?.data;
        } else {

        }
      },
      (err) => {
        console.log(err);
      }
    );
    return userInfo;
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
      if (typeof item.id != "number") {
        item.id = null;
      }
    })
    let lstCTietBCaoTemp = [];
    let checkMoneyRange = true;
    this.lstCTietBCao.filter(e => {
      let tongQuyLuongCoTchatLuongN = mulMoney(e.tongQuyLuongCoTchatLuongN, this.maDviTien)
      let tongQuyLuongCoTchatLuongTheoBcheN = mulMoney(e.tongQuyLuongCoTchatLuongTheoBcheN, this.maDviTien)
      let tuongCbanN = mulMoney(e.tuongCbanN, this.maDviTien)
      let phuCapN = mulMoney(e.phuCapN, this.maDviTien)
      let cacKhoanDgopN = mulMoney(e.cacKhoanDgopN, this.maDviTien)
      let tongQuyLuongCoTchatLuongThienN = mulMoney(e.tongQuyLuongCoTchatLuongThienN, this.maDviTien)
      let tongQuyLuongCoTchatLuongTheoBcheThienN = mulMoney(e.tongQuyLuongCoTchatLuongTheoBcheThienN, this.maDviTien)
      let luongCbanThienN = mulMoney(e.luongCbanThienN, this.maDviTien)
      let phuCapThienN = mulMoney(e.phuCapThienN, this.maDviTien)
      let cacKhoanDgopThienN = mulMoney(e.cacKhoanDgopThienN, this.maDviTien)
      let tongQuyLuongCoTchatLuongTheoBcheN1 = mulMoney(e.tongQuyLuongCoTchatLuongTheoBcheN1, this.maDviTien)
      let tongQuyLuongCoTchatLuongN1 = mulMoney(e.tongQuyLuongCoTchatLuongN1, this.maDviTien)
      let luongCbanN1 = mulMoney(e.luongCbanN1, this.maDviTien)
      let phuCapN1 = mulMoney(e.phuCapN1, this.maDviTien)
      let cacKhoanDgopN1 = mulMoney(e.cacKhoanDgopN1, this.maDviTien)
      let tongQuyLuongCoTchatLuongN2 = mulMoney(e.tongQuyLuongCoTchatLuongN2, this.maDviTien)
      let tongQuyLuongCoTchatLuongTheoBcheN2 = mulMoney(e.tongQuyLuongCoTchatLuongTheoBcheN2, this.maDviTien)
      let luongCbanN2 = mulMoney(e.luongCbanN2, this.maDviTien)
      let phuCapN2 = mulMoney(e.phuCapN2, this.maDviTien)
      let cacKhoanDgopN2 = mulMoney(e.cacKhoanDgopN2, this.maDviTien)
      let tongQuyLuongCoTchatLuongN3 = mulMoney(e.tongQuyLuongCoTchatLuongN3, this.maDviTien)
      let tongQuyLuongCoTchatLuongTheoBcheN3 = mulMoney(e.tongQuyLuongCoTchatLuongTheoBcheN3, this.maDviTien)
      let luongCbanN3 = mulMoney(e.luongCbanN3, this.maDviTien)
      let phuCapN3 = mulMoney(e.phuCapN3, this.maDviTien)
      let cacKhoanDgopN3 = mulMoney(e.cacKhoanDgopN3, this.maDviTien)
      if(
        tongQuyLuongCoTchatLuongN > MONEYLIMIT ||
        tongQuyLuongCoTchatLuongTheoBcheN > MONEYLIMIT ||
        tuongCbanN > MONEYLIMIT ||
        phuCapN > MONEYLIMIT ||
        cacKhoanDgopN > MONEYLIMIT ||
        tongQuyLuongCoTchatLuongThienN > MONEYLIMIT ||
        tongQuyLuongCoTchatLuongTheoBcheThienN > MONEYLIMIT ||
        luongCbanThienN > MONEYLIMIT ||
        phuCapThienN > MONEYLIMIT ||
        cacKhoanDgopThienN > MONEYLIMIT ||
        tongQuyLuongCoTchatLuongTheoBcheN1 > MONEYLIMIT ||
        tongQuyLuongCoTchatLuongN1 > MONEYLIMIT ||
        luongCbanN1 > MONEYLIMIT ||
        phuCapN1 > MONEYLIMIT ||
        cacKhoanDgopN1 > MONEYLIMIT ||
        tongQuyLuongCoTchatLuongN2 > MONEYLIMIT ||
        tongQuyLuongCoTchatLuongTheoBcheN2 > MONEYLIMIT ||
        luongCbanN2 > MONEYLIMIT ||
        phuCapN2 > MONEYLIMIT ||
        cacKhoanDgopN2 > MONEYLIMIT ||
        tongQuyLuongCoTchatLuongN3 > MONEYLIMIT ||
        tongQuyLuongCoTchatLuongTheoBcheN3 > MONEYLIMIT ||
        luongCbanN3 > MONEYLIMIT ||
        phuCapN3 > MONEYLIMIT ||
        cacKhoanDgopN3 > MONEYLIMIT
      ){
        checkMoneyRange = false;
        return
      }
      lstCTietBCaoTemp.push({
        ...e,
        tongQuyLuongCoTchatLuongN : tongQuyLuongCoTchatLuongN,
        tongQuyLuongCoTchatLuongTheoBcheN : tongQuyLuongCoTchatLuongTheoBcheN,
        tuongCbanN : tuongCbanN,
        phuCapN : phuCapN,
        cacKhoanDgopN : cacKhoanDgopN,
        tongQuyLuongCoTchatLuongThienN : tongQuyLuongCoTchatLuongThienN,
        tongQuyLuongCoTchatLuongTheoBcheThienN : tongQuyLuongCoTchatLuongTheoBcheThienN,
        luongCbanThienN : luongCbanThienN,
        phuCapThienN : phuCapThienN,
        cacKhoanDgopThienN : cacKhoanDgopThienN,
        tongQuyLuongCoTchatLuongTheoBcheN1 : tongQuyLuongCoTchatLuongTheoBcheN1,
        tongQuyLuongCoTchatLuongN1 : tongQuyLuongCoTchatLuongN1,
        luongCbanN1 : luongCbanN1,
        phuCapN1 : phuCapN1,
        cacKhoanDgopN1 : cacKhoanDgopN1,
        tongQuyLuongCoTchatLuongN2 : tongQuyLuongCoTchatLuongN2,
        tongQuyLuongCoTchatLuongTheoBcheN2 : tongQuyLuongCoTchatLuongTheoBcheN2,
        luongCbanN2 : luongCbanN2,
        phuCapN2 : phuCapN2,
        cacKhoanDgopN2 : cacKhoanDgopN2,
        tongQuyLuongCoTchatLuongN3 : tongQuyLuongCoTchatLuongN3,
        tongQuyLuongCoTchatLuongTheoBcheN3 : tongQuyLuongCoTchatLuongTheoBcheN3,
        luongCbanN3 : luongCbanN3,
        phuCapN3 : phuCapN3,
        cacKhoanDgopN3 : cacKhoanDgopN3,
      })
    })
    if(!checkMoneyRange == true) {
      this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.MONEYRANGE)
    }else{
      // gui du lieu trinh duyet len server
      let request = {
        id: this.id,
        fileDinhKems: listFile,
        listIdDeleteFiles: this.listIdDeleteFiles,                      // id file luc get chi tiet tra ra( de backend phuc vu xoa file)
        lstCTietBCao: lstCTietBCaoTemp,
        listIdDeletes: this.listIdDelete,// id file luc get chi tiet tra ra( de backend phuc vu xoa file)
        maBcao: this.maBaoCao,
        maDvi: this.maDonViTao,
        maDviTien: this.maDviTien,
        maLoaiBcao: QLNV_KHVONPHI_KHOACH_QUY_TIEN_LUONG_GD3N,
        namHienHanh: this.namBaoCaoHienHanh,
        namBcao: this.namBaoCaoHienHanh,
        soVban: this.soVban,
      };

      //call service them moi
      this.spinner.show();
      if (this.id == null) {
        this.quanLyVonPhiService.trinhDuyetService(request).toPromise().then(
          async data => {
            if (data.statusCode == 0) {
              this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
              this.id = data.data.id;
              await this.getDetailReport();
              this.getStatusButton();
            } else {
              this.notification.error(MESSAGE.ERROR, data?.msg);
            }
          },
          err => {
            this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
          },
        );
      } else {
        this.quanLyVonPhiService.updatelist(request).toPromise().then(
          async data => {
            if (data.statusCode == 0) {
              this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
              await this.getDetailReport();
              this.getStatusButton();
            } else {
              this.notification.error(MESSAGE.ERROR, data?.msg);
            }
        },err =>{
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        })
      }
    }

    this.lstCTietBCao.filter(item => {
      if (!item.id) {
        item.id = uuid.v4();
      }
    });
    this.updateEditCache();
    this.spinner.hide();
  }

  // chuc nang check role
  async onSubmit(mcn: String) {
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
          this.ngayNhap = this.datePipe.transform(data.data.ngayTao, Utils.FORMAT_DATE_STR);
          this.nguoiNhap = data.data.nguoiTao;
          this.maDonViTao = data.data.maDvi;
          this.maBaoCao = data.data.maBcao;
          this.namBaoCaoHienHanh = data.data.namHienHanh;
          this.trangThaiBanGhi = data.data.trangThai;
          this.soVban = data.data.soVban;
          this.maDviTien = data.data.maDviTien;
          this.listFile=[]
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
          this.divMoneyTotal()
          this.updateEditCache();
         }else{
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
         }

        } else {
          this.notification.error(MESSAGE.ERROR, data?.msg);
        }
      },
      (err) => {
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
      maDvi!: this.maDonViTao,
      tongCboN: 0,
      tongBcheDuocPdN: 0,
      tongQuyLuongCoTchatLuongN: 0,
      tuongCbanN: 0,
      phuCapN: 0,
      cacKhoanDgopN: 0,
      tongQuyLuongCoTchatLuongTheoBcheN:0,

      tongCboThienN: 0,
      tongBcheDuocPdThienN: 0,
      tongQuyLuongCoTchatLuongThienN: 0,
      luongCbanThienN: 0,
      phuCapThienN: 0,
      cacKhoanDgopThienN: 0,
      tongQuyLuongCoTchatLuongTheoBcheThienN: 0,

      tongCboN1: 0,
      tongBcheDuocPdN1: 0,
      tongQuyLuongCoTchatLuongN1: 0,
      luongCbanN1: 0,
      phuCapN1: 0,
      cacKhoanDgopN1: 0,
      tongQuyLuongCoTchatLuongTheoBcheN1: 0,

      tongCboN2: 0,
      tongBcheDuocPdN2: 0,
      tongQuyLuongCoTchatLuongN2: 0,
      luongCbanN2: 0,
      phuCapN2: 0,
      cacKhoanDgopN2: 0,
      tongQuyLuongCoTchatLuongTheoBcheN2: 0,

      tongCboN3: 0,
      tongBcheDuocPdN3: 0,
      tongQuyLuongCoTchatLuongN3: 0,
      luongCbanN3: 0,
      phuCapN3: 0,
      cacKhoanDgopN3: 0,
      tongQuyLuongCoTchatLuongTheoBcheN3: 0,
      maBcao: "",
      stt: "",
      id: uuid.v4(),
      checked:false,
    }

    this.lstCTietBCao.splice(id, 0, item);
    this.editCache[item.id] = {
      edit: true,
      data: { ...item }
    };
    if(this.capDvi==3){
      this.checkKV=true;
    }else{
      this.checkKV=false;
    }
  }

  // xoa dong
  deleteById(id: any): void {
    this.lstCTietBCao = this.lstCTietBCao.filter(item => item.id != id)
    if (typeof id == "number") {
      this.listIdDelete += id + ","
    }
  }

  // xóa với checkbox
  deleteSelected() {
    // add list delete id
    this.lstCTietBCao.filter(item => {
      if(item.checked == true && typeof item.id == "number"){
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
    // this.router.navigate(['/qlkh-von-phi/quan-ly-lap-tham-dinh-du-toan-nsnn/tim-kiem']);
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
    if (!this.lstCTietBCao[index].maDvi){
			this.deleteById(id);
			return;
		}

    this.editCache[id] = {
      data: { ...this.lstCTietBCao[index] },
      edit: false
    };
  }

  saveEdit(id: string): void {
    if (
      !this.editCache[id].data.maDvi ||
      (!this.editCache[id].data.tongCboN && this.editCache[id].data.tongCboN !==0) ||
      (!this.editCache[id].data.tongBcheDuocPdN && this.editCache[id].data.tongBcheDuocPdN !==0) ||
      (!this.editCache[id].data.tongQuyLuongCoTchatLuongN && this.editCache[id].data.tongQuyLuongCoTchatLuongN !==0) ||
      (!this.editCache[id].data.tuongCbanN && this.editCache[id].data.tuongCbanN !==0) ||
      (!this.editCache[id].data.phuCapN && this.editCache[id].data.phuCapN !==0) ||
      (!this.editCache[id].data.cacKhoanDgopN && this.editCache[id].data.cacKhoanDgopN !==0) ||
      (!this.editCache[id].data.tongCboThienN && this.editCache[id].data.tongCboThienN !==0) ||
      (!this.editCache[id].data.tongBcheDuocPdThienN && this.editCache[id].data.tongBcheDuocPdThienN !==0) ||
      (!this.editCache[id].data.tongQuyLuongCoTchatLuongThienN && this.editCache[id].data.tongQuyLuongCoTchatLuongThienN !==0) ||
      (!this.editCache[id].data.luongCbanThienN && this.editCache[id].data.luongCbanThienN !==0) ||
      (!this.editCache[id].data.phuCapThienN && this.editCache[id].data.phuCapThienN !==0) ||
      (!this.editCache[id].data.cacKhoanDgopThienN && this.editCache[id].data.cacKhoanDgopThienN !==0) ||
      (!this.editCache[id].data.tongCboN1 && this.editCache[id].data.tongCboN1 !==0) ||
      (!this.editCache[id].data.tongBcheDuocPdN1 && this.editCache[id].data.tongBcheDuocPdN1 !==0) ||
      (!this.editCache[id].data.tongQuyLuongCoTchatLuongN1 && this.editCache[id].data.tongQuyLuongCoTchatLuongN1 !==0) ||
      (!this.editCache[id].data.luongCbanN1 && this.editCache[id].data.luongCbanN1 !==0) ||
      (!this.editCache[id].data.phuCapN1 && this.editCache[id].data.phuCapN1 !==0) ||
      (!this.editCache[id].data.cacKhoanDgopN1 && this.editCache[id].data.cacKhoanDgopN1 !==0) ||
      (!this.editCache[id].data.tongCboN2 && this.editCache[id].data.tongCboN2 !==0) ||
      (!this.editCache[id].data.tongBcheDuocPdN2 && this.editCache[id].data.tongBcheDuocPdN2 !==0) ||
      (!this.editCache[id].data.tongQuyLuongCoTchatLuongN2 && this.editCache[id].data.tongQuyLuongCoTchatLuongN2 !==0) ||
      (!this.editCache[id].data.luongCbanN2 && this.editCache[id].data.luongCbanN2 !==0) ||
      (!this.editCache[id].data.phuCapN2 && this.editCache[id].data.phuCapN2 !==0) ||
      (!this.editCache[id].data.cacKhoanDgopN2 && this.editCache[id].data.cacKhoanDgopN2 !==0) ||
      (!this.editCache[id].data.tongCboN3 && this.editCache[id].data.tongCboN3 !==0) ||
      (!this.editCache[id].data.tongBcheDuocPdN3 && this.editCache[id].data.tongBcheDuocPdN3 !==0) ||
      (!this.editCache[id].data.tongQuyLuongCoTchatLuongN3 && this.editCache[id].data.tongQuyLuongCoTchatLuongN3 !==0) ||
      (!this.editCache[id].data.luongCbanN3 && this.editCache[id].data.luongCbanN3 !==0) ||
      (!this.editCache[id].data.phuCapN3 && this.editCache[id].data.phuCapN3 !==0) ||
      (!this.editCache[id].data.cacKhoanDgopN3 && this.editCache[id].data.cacKhoanDgopN3 !==0)
    ){
      this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
      return;
    }else{
      const index = this.lstCTietBCao.findIndex(item => item.id === id);
      this.editCache[id].data.checked = this.lstCTietBCao.find(item => item.id === id).checked;
      Object.assign(this.lstCTietBCao[index], this.editCache[id].data);
      this.editCache[id].edit = false;
    }
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
    this.editCache[id].data.tongQuyLuongCoTchatLuongTheoBcheN = Number(this.editCache[id].data.tuongCbanN) + Number(this.editCache[id].data.phuCapN) + Number(this.editCache[id].data.cacKhoanDgopN);
    this.editCache[id].data.tongQuyLuongCoTchatLuongTheoBcheThienN = Number(this.editCache[id].data.luongCbanThienN) + Number(this.editCache[id].data.phuCapThienN) + Number(this.editCache[id].data.cacKhoanDgopThienN);
    this.editCache[id].data.tongQuyLuongCoTchatLuongTheoBcheN1 = Number(this.editCache[id].data.luongCbanN1) + Number(this.editCache[id].data.phuCapN1) + Number(this.editCache[id].data.cacKhoanDgopN1);
    this.editCache[id].data.tongQuyLuongCoTchatLuongTheoBcheN2 = Number(this.editCache[id].data.luongCbanN2) + Number(this.editCache[id].data.phuCapN2) + Number(this.editCache[id].data.cacKhoanDgopN2);
    this.editCache[id].data.tongQuyLuongCoTchatLuongTheoBcheN3 = Number(this.editCache[id].data.luongCbanN3) + Number(this.editCache[id].data.phuCapN3) + Number(this.editCache[id].data.cacKhoanDgopN3);
  }

  //call tong hop
  async calltonghop(){
    this.spinner.show();
    this.maDviTien="1"
    let objtonghop={
        maDvi: this.maDonViTao,
        maLoaiBcao: this.maLoaiBaoCao,
        namHienTai: this.namBaoCaoHienHanh,
    }
    await this.quanLyVonPhiService.tongHop(objtonghop).toPromise().then(res => {
        if(res.statusCode==0){
            this.lstCTietBCao = res.data;
            this.lstCTietBCao.forEach(e => {
              e.id = uuid.v4();
            })
        }else{
          this.notification.error(MESSAGE.ERROR, res?.msg);
        }
    },err =>{
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    });
    this.updateEditCache()
    this.lstCTietBCao.forEach(e => {
      this.changeModel(e.id)
    })
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
    let checkMoneyRange = true
    this.lstCTietBCao.filter(item => {
      let tongQuyLuongCoTchatLuongN = mulMoney(item.tongQuyLuongCoTchatLuongN, this.maDviTien)
      let tongQuyLuongCoTchatLuongTheoBcheN = mulMoney(item.tongQuyLuongCoTchatLuongTheoBcheN, this.maDviTien)
      let tuongCbanN = mulMoney(item.tuongCbanN, this.maDviTien)
      let phuCapN = mulMoney(item.phuCapN, this.maDviTien)
      let cacKhoanDgopN = mulMoney(item.cacKhoanDgopN, this.maDviTien)
      let tongQuyLuongCoTchatLuongThienN = mulMoney(item.tongQuyLuongCoTchatLuongThienN, this.maDviTien)
      let tongQuyLuongCoTchatLuongTheoBcheThienN = mulMoney(item.tongQuyLuongCoTchatLuongTheoBcheThienN, this.maDviTien)
      let luongCbanThienN = mulMoney(item.luongCbanThienN, this.maDviTien)
      let phuCapThienN = mulMoney(item.phuCapThienN, this.maDviTien)
      let cacKhoanDgopThienN = mulMoney(item.cacKhoanDgopThienN, this.maDviTien)
      let tongQuyLuongCoTchatLuongTheoBcheN1 = mulMoney(item.tongQuyLuongCoTchatLuongTheoBcheN1, this.maDviTien)
      let tongQuyLuongCoTchatLuongN1 = mulMoney(item.tongQuyLuongCoTchatLuongN1, this.maDviTien)
      let luongCbanN1 = mulMoney(item.luongCbanN1, this.maDviTien)
      let phuCapN1 = mulMoney(item.phuCapN1, this.maDviTien)
      let cacKhoanDgopN1 = mulMoney(item.cacKhoanDgopN1, this.maDviTien)
      let tongQuyLuongCoTchatLuongN2 = mulMoney(item.tongQuyLuongCoTchatLuongN2, this.maDviTien)
      let tongQuyLuongCoTchatLuongTheoBcheN2 = mulMoney(item.tongQuyLuongCoTchatLuongTheoBcheN2, this.maDviTien)
      let luongCbanN2 = mulMoney(item.luongCbanN2, this.maDviTien)
      let phuCapN2 = mulMoney(item.phuCapN2, this.maDviTien)
      let cacKhoanDgopN2 = mulMoney(item.cacKhoanDgopN2, this.maDviTien)
      let tongQuyLuongCoTchatLuongN3 = mulMoney(item.tongQuyLuongCoTchatLuongN3, this.maDviTien)
      let tongQuyLuongCoTchatLuongTheoBcheN3 = mulMoney(item.tongQuyLuongCoTchatLuongTheoBcheN3, this.maDviTien)
      let luongCbanN3 = mulMoney(item.luongCbanN3, this.maDviTien)
      let phuCapN3 = mulMoney(item.phuCapN3, this.maDviTien)
      let cacKhoanDgopN3 = mulMoney(item.cacKhoanDgopN3, this.maDviTien)
      if(
        tongQuyLuongCoTchatLuongN > MONEYLIMIT ||
        tongQuyLuongCoTchatLuongTheoBcheN > MONEYLIMIT ||
        tuongCbanN > MONEYLIMIT ||
        phuCapN > MONEYLIMIT ||
        cacKhoanDgopN > MONEYLIMIT ||
        tongQuyLuongCoTchatLuongThienN > MONEYLIMIT ||
        tongQuyLuongCoTchatLuongTheoBcheThienN > MONEYLIMIT ||
        luongCbanThienN > MONEYLIMIT ||
        phuCapThienN > MONEYLIMIT ||
        cacKhoanDgopThienN > MONEYLIMIT ||
        tongQuyLuongCoTchatLuongTheoBcheN1 > MONEYLIMIT ||
        tongQuyLuongCoTchatLuongN1 > MONEYLIMIT ||
        luongCbanN1 > MONEYLIMIT ||
        phuCapN1 > MONEYLIMIT ||
        cacKhoanDgopN1 > MONEYLIMIT ||
        tongQuyLuongCoTchatLuongN2 > MONEYLIMIT ||
        tongQuyLuongCoTchatLuongTheoBcheN2 > MONEYLIMIT ||
        luongCbanN2 > MONEYLIMIT ||
        phuCapN2 > MONEYLIMIT ||
        cacKhoanDgopN2 > MONEYLIMIT ||
        tongQuyLuongCoTchatLuongN3 > MONEYLIMIT ||
        tongQuyLuongCoTchatLuongTheoBcheN3 > MONEYLIMIT ||
        luongCbanN3 > MONEYLIMIT ||
        phuCapN3 > MONEYLIMIT ||
        cacKhoanDgopN3 > MONEYLIMIT
      ){
        checkMoneyRange = false;
        return
      }
      lstTemp.push({
        ...item,
        id: null,
        tongQuyLuongCoTchatLuongN :tongQuyLuongCoTchatLuongN,
        tongQuyLuongCoTchatLuongTheoBcheN :tongQuyLuongCoTchatLuongTheoBcheN,
        tuongCbanN :tuongCbanN,
        phuCapN :phuCapN,
        cacKhoanDgopN :cacKhoanDgopN,
        tongQuyLuongCoTchatLuongThienN :tongQuyLuongCoTchatLuongThienN,
        tongQuyLuongCoTchatLuongTheoBcheThienN :tongQuyLuongCoTchatLuongTheoBcheThienN,
        luongCbanThienN :luongCbanThienN,
        phuCapThienN :phuCapThienN,
        cacKhoanDgopThienN :cacKhoanDgopThienN,
        tongQuyLuongCoTchatLuongTheoBcheN1 :tongQuyLuongCoTchatLuongTheoBcheN1,
        tongQuyLuongCoTchatLuongN1 :tongQuyLuongCoTchatLuongN1,
        luongCbanN1 :luongCbanN1,
        phuCapN1 :phuCapN1,
        cacKhoanDgopN1 :cacKhoanDgopN1,
        tongQuyLuongCoTchatLuongN2 :tongQuyLuongCoTchatLuongN2,
        tongQuyLuongCoTchatLuongTheoBcheN2 :tongQuyLuongCoTchatLuongTheoBcheN2,
        luongCbanN2 :luongCbanN2,
        phuCapN2 :phuCapN2,
        cacKhoanDgopN2 :cacKhoanDgopN2,
        tongQuyLuongCoTchatLuongN3 :tongQuyLuongCoTchatLuongN3,
        tongQuyLuongCoTchatLuongTheoBcheN3 :tongQuyLuongCoTchatLuongTheoBcheN3,
        luongCbanN3 :luongCbanN3,
        phuCapN3 :phuCapN3,
        cacKhoanDgopN3 :cacKhoanDgopN3,
      })
    })
    if(!checkMoneyRange == true) {
       this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.MONEYRANGE)
    }else {
      let request = {
        id: null,
        listIdDeletes: null,
        fileDinhKems: null,
        listIdDeleteFiles: null,                      // id file luc get chi tiet tra ra( de backend phuc vu xoa file)
        lstCTietBCao: lstTemp,
        maBcao: maBaoCao,
        maDvi: this.maDonViTao,
        maDviTien: this.maDviTien,
        maLoaiBcao: this.maLoaiBaoCao = QLNV_KHVONPHI_KHOACH_QUY_TIEN_LUONG_GD3N,
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
  divMoneyTotal(){
    this.lstCTietBCao.filter(element => {

      element.tongQuyLuongCoTchatLuongN = divMoney(element.tongQuyLuongCoTchatLuongN, this.maDviTien);
      element.tongQuyLuongCoTchatLuongTheoBcheN = divMoney(element.tongQuyLuongCoTchatLuongTheoBcheN, this.maDviTien);

      element.tuongCbanN = divMoney(element.tuongCbanN, this.maDviTien);
      element.phuCapN = divMoney(element.phuCapN, this.maDviTien);
      element.cacKhoanDgopN = divMoney(element.cacKhoanDgopN, this.maDviTien);


      element.tongQuyLuongCoTchatLuongThienN = divMoney(element.tongQuyLuongCoTchatLuongThienN, this.maDviTien);
      element.tongQuyLuongCoTchatLuongTheoBcheThienN = divMoney(element.tongQuyLuongCoTchatLuongTheoBcheThienN, this.maDviTien);
      element.luongCbanThienN = divMoney(element.luongCbanThienN, this.maDviTien);
      element.phuCapThienN = divMoney(element.phuCapThienN, this.maDviTien);
      element.cacKhoanDgopThienN = divMoney(element.cacKhoanDgopThienN, this.maDviTien);


      element.tongQuyLuongCoTchatLuongN1 = divMoney(element.tongQuyLuongCoTchatLuongN1, this.maDviTien);
      element.tongQuyLuongCoTchatLuongTheoBcheN1 = divMoney(element.tongQuyLuongCoTchatLuongTheoBcheN1, this.maDviTien);
      element.luongCbanN1 = divMoney(element.luongCbanN1, this.maDviTien);
      element.phuCapN1 = divMoney(element.phuCapN1, this.maDviTien);
      element.cacKhoanDgopN1 = divMoney(element.cacKhoanDgopN1, this.maDviTien);


      element.tongQuyLuongCoTchatLuongN2 = divMoney(element.tongQuyLuongCoTchatLuongN2, this.maDviTien);
      element.tongQuyLuongCoTchatLuongTheoBcheN2 = divMoney(element.tongQuyLuongCoTchatLuongTheoBcheN2, this.maDviTien);
      element.luongCbanN2 = divMoney(element.luongCbanN2, this.maDviTien);
      element.phuCapN2 = divMoney(element.phuCapN2, this.maDviTien);
      element.cacKhoanDgopN2 = divMoney(element.cacKhoanDgopN2, this.maDviTien);

      element.tongQuyLuongCoTchatLuongN3 = divMoney(element.tongQuyLuongCoTchatLuongN3, this.maDviTien);
      element.tongQuyLuongCoTchatLuongTheoBcheN3 = divMoney(element.tongQuyLuongCoTchatLuongTheoBcheN3, this.maDviTien);
      element.luongCbanN3 = divMoney(element.luongCbanN3, this.maDviTien);
      element.phuCapN3 = divMoney(element.phuCapN3, this.maDviTien);
      element.cacKhoanDgopN3 = divMoney(element.cacKhoanDgopN3, this.maDviTien);
    });
  }
  mulMoneyTotal() {
    this.lstCTietBCao.filter(element => {


      element.tongQuyLuongCoTchatLuongN = mulMoney(element.tongQuyLuongCoTchatLuongN, this.maDviTien);
      element.tongQuyLuongCoTchatLuongTheoBcheN = mulMoney(element.tongQuyLuongCoTchatLuongTheoBcheN, this.maDviTien);

      element.tuongCbanN = mulMoney(element.tuongCbanN, this.maDviTien);
      element.phuCapN = mulMoney(element.phuCapN, this.maDviTien);
      element.cacKhoanDgopN = mulMoney(element.cacKhoanDgopN, this.maDviTien);

      element.tongQuyLuongCoTchatLuongThienN = mulMoney(element.tongQuyLuongCoTchatLuongThienN, this.maDviTien);
      element.tongQuyLuongCoTchatLuongTheoBcheThienN = mulMoney(element.tongQuyLuongCoTchatLuongTheoBcheThienN, this.maDviTien);
      element.luongCbanThienN = mulMoney(element.luongCbanThienN, this.maDviTien);
      element.phuCapThienN = mulMoney(element.phuCapThienN, this.maDviTien);
      element.cacKhoanDgopThienN = mulMoney(element.cacKhoanDgopThienN, this.maDviTien);

      element.tongQuyLuongCoTchatLuongTheoBcheN1 = mulMoney(element.tongQuyLuongCoTchatLuongTheoBcheN1, this.maDviTien);
      element.tongQuyLuongCoTchatLuongN1 = mulMoney(element.tongQuyLuongCoTchatLuongN1, this.maDviTien);
      element.luongCbanN1 = mulMoney(element.luongCbanN1, this.maDviTien);
      element.phuCapN1 = mulMoney(element.phuCapN1, this.maDviTien);
      element.cacKhoanDgopN1 = mulMoney(element.cacKhoanDgopN1, this.maDviTien);

      element.tongQuyLuongCoTchatLuongN2 = mulMoney(element.tongQuyLuongCoTchatLuongN2, this.maDviTien);
      element.tongQuyLuongCoTchatLuongTheoBcheN2 = mulMoney(element.tongQuyLuongCoTchatLuongTheoBcheN2, this.maDviTien);
      element.luongCbanN2 = mulMoney(element.luongCbanN2, this.maDviTien);
      element.phuCapN2 = mulMoney(element.phuCapN2, this.maDviTien);
      element.cacKhoanDgopN2 = mulMoney(element.cacKhoanDgopN2, this.maDviTien);


      element.tongQuyLuongCoTchatLuongN3 = mulMoney(element.tongQuyLuongCoTchatLuongN3, this.maDviTien);
      element.tongQuyLuongCoTchatLuongTheoBcheN3 = mulMoney(element.tongQuyLuongCoTchatLuongTheoBcheN3, this.maDviTien);
      element.luongCbanN3 = mulMoney(element.luongCbanN3, this.maDviTien);
      element.phuCapN3 = mulMoney(element.phuCapN3, this.maDviTien);
      element.cacKhoanDgopN3 = mulMoney(element.cacKhoanDgopN3, this.maDviTien);
    });
  }
}
