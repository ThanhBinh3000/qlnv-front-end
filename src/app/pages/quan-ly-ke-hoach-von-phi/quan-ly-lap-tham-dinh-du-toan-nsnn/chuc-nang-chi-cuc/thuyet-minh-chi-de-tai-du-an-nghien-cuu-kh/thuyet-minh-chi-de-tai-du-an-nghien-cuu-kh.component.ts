import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as uuid from "uuid";
import { DanhMucHDVService } from '../../../../../services/danhMucHDV.service';
import { DatePipe, Location } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { DomSanitizer } from '@angular/platform-browser';
import * as fileSaver from 'file-saver';
import { divMoney, DONVITIEN, mulMoney, QLNV_KHVONPHI_CHI_DTAI_DAN_NCKH_GD3N, Utils } from "../../../../../Utility/utils";
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MESSAGE } from '../../../../../constants/message';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';

export class ItemData {
  tenDtaiDan!: String;
  maDvi!: number;
  tgBdau!: number;
  tgKthuc!: number;
  kphiTongPhiDuocDuyet!: number;
  kphiDaDuocBoTriDenNamN!: number;
  kphiDuocThienDenThoiDiemBcao!: number;
  kphiDuKienBtriN1!: number;
  kphiDuKienBtriN2!: number;
  kphiDuKienBtriN3!: number;
  kphiThuhoi!: number;
  kphiTgianThuhoi!: number;
  id!: any;
  maBcao!: String;
  stt!: String;
  checked!:boolean;
}

@Component({
  selector: 'app-thuyet-minh-chi-de-tai-du-an-nghien-cuu-kh',
  templateUrl: './thuyet-minh-chi-de-tai-du-an-nghien-cuu-kh.component.html',
  styleUrls: ['./thuyet-minh-chi-de-tai-du-an-nghien-cuu-kh.component.scss']
})

export class ThuyetMinhChiDeTaiDuAnNghienCuuKhComponent implements OnInit {
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
  maLoaiBaoCao: string = QLNV_KHVONPHI_CHI_DTAI_DAN_NCKH_GD3N;                // nam bao cao
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

  capDvi:any;
  checkKV:boolean;                            // check khu vuc
  soVban:any;
  capDv:any;
  checkDv:boolean;
  currentday: Date = new Date();
  messageValidate:any =MESSAGEVALIDATE;
  validateForm!: FormGroup;
  donViTiens: any = DONVITIEN;
  beforeUpload = (file: NzUploadFile): boolean => {
    this.fileList = this.fileList.concat(file);
    return false;
  };
  donViChuTris: any [] = [];

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
              private location : Location,
              private notification: NzNotificationService,
              private fb:FormBuilder,
              ) {
                this.ngayNhap = this.datePipe.transform(this.newDate, Utils.FORMAT_DATE_STR,)
              }


  async ngOnInit() {
    this.validateForm = this.fb.group({
      namBaoCaoHienHanh: [null, [Validators.required,Validators.pattern('^[12][0-9]{3}$')]],
    });
    //check param dieu huong router
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
      this.namBaoCaoHienHanh = new Date().getFullYear();
    }

     //lay danh sach danh muc don vi
     await this.danhMucService.dMDonVi().toPromise().then(
      (data) => {
        if (data.statusCode == 0) {
          this.donVis = data.data;
          this.donVis.forEach(e => {
            if(e.maDvi == this.maDonViTao){
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
     //lay danh sach danh muc don vi
     await this.danhMucService.dMDonviChuTri().toPromise().then(
      (data) => {
        if (data.statusCode == 0) {
          this.donViChuTris = data.data.content;
          console.log(this.donViChuTris);

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

    this.mullMoneyTotal()
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

    // gui du lieu trinh duyet len server
    let request = {
      id: this.id,
      fileDinhKems: listFile,
      listIdDeletes: this.listIdDelete,
      listIdDeleteFiles: this.listIdDeleteFiles,                      // id file luc get chi tiet tra ra( de backend phuc vu xoa file)
      lstCTietBCao: this.lstCTietBCao,
      maBcao: this.maBaoCao,
      maDvi: this.maDonViTao,
      maDviTien: this.maDviTien,
      maLoaiBcao: QLNV_KHVONPHI_CHI_DTAI_DAN_NCKH_GD3N,
      namHienHanh: this.namBaoCaoHienHanh,
      namBcao: this.namBaoCaoHienHanh,
      soVban:this.soVban,
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
      this.quanLyVonPhiService.updatelist(request).toPromise().then(
        async data => {
          if (data.statusCode == 0) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
            await this.getDetailReport();
            this.getStatusButton();
          } else {
            this.divMoneyTotal()
            this.notification.error(MESSAGE.ERROR, data?.msg);
          }
      },err =>{
        this.divMoneyTotal()
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      })
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
    }
    else{
      this.notification.warning(MESSAGE.WARNING, MESSAGE.MESSAGE_DELETE_WARNING);
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
          this.lstCTietBCao = data.data.lstCTietBCao;
          this.maDviTien = data.data.maDviTien;
          this.divMoneyTotal()
          this.updateEditCache();
          this.lstFile = data.data.lstFile;

          // set thong tin chung bao cao
          this.ngayNhap = this.datePipe.transform(data.data.ngayTao, Utils.FORMAT_DATE_STR,);
          this.nguoiNhap = data.data.nguoiTao;
          this.maDonViTao = data.data.maDvi;
          this.maBaoCao = data.data.maBcao;
          this.namBaoCaoHienHanh = data.data.namHienHanh;
          this.trangThaiBanGhi = data.data.trangThai;
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

          this.listFile=[]
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
      tenDtaiDan: "",
      maDvi: 0,
      tgBdau: this.namBaoCaoHienHanh,
      tgKthuc: this.namBaoCaoHienHanh,
      kphiTongPhiDuocDuyet: 0,
      kphiDaDuocBoTriDenNamN: 0,
      kphiDuocThienDenThoiDiemBcao: 0,
      kphiDuKienBtriN1: 0,
      kphiDuKienBtriN2: 0,
      kphiDuKienBtriN3: 0,
      kphiThuhoi: 0,
      kphiTgianThuhoi: 0,
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
    if (!this.lstCTietBCao[id].maDvi){
			this.deleteById(id);
			return;
		}
    if (!this.editCache[id].data.maDvi){
      this.notification.error(MESSAGE.ERROR, MESSAGE.NULL_ERROR);
      return;
    }
    const index = this.lstCTietBCao.findIndex(item => item.id === id);

    this.editCache[id] = {
      data: { ...this.lstCTietBCao[index] },
      edit: false
    };
  }

  // luu thay doi
  saveEdit(id: string): void {
    if (
      !this.editCache[id].data.maDvi ||
      !this.editCache[id].data.tgBdau ||
      !this.editCache[id].data.tgKthuc ||
      (!this.editCache[id].data.kphiTongPhiDuocDuyet && this.editCache[id].data.kphiTongPhiDuocDuyet  !==0) ||
      (!this.editCache[id].data.kphiDaDuocBoTriDenNamN && this.editCache[id].data.kphiDaDuocBoTriDenNamN !==0) ||
      (!this.editCache[id].data.kphiDuocThienDenThoiDiemBcao && this.editCache[id].data.kphiDuocThienDenThoiDiemBcao  !==0) ||
      (!this.editCache[id].data.kphiDuKienBtriN1 && this.editCache[id].data.kphiDuKienBtriN1 !==0) ||
      (!this.editCache[id].data.kphiDuKienBtriN2 && this.editCache[id].data.kphiDuKienBtriN2 !==0) ||
      (!this.editCache[id].data.kphiDuKienBtriN3 && this.editCache[id].data.kphiDuKienBtriN3 !==0)
    ) {
      this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
      return
    }
    if((this.editCache[id].data.tgBdau <= 1000 ||  this.editCache[id].data.tgBdau >= 2999) || (this.editCache[id].data.tgKthuc <= 1000 &&  this.editCache[id].data.tgKthuc >= 2999)){
      this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.WRONG_FORMAT);
    }
      this.editCache[id].data.checked = this.lstCTietBCao.find(item => item.id === id).checked; // set checked editCache = checked lstCTietBCao
      const index = this.lstCTietBCao.findIndex(item => item.id === id);   // lay vi tri hang minh sua
      Object.assign(this.lstCTietBCao[index], this.editCache[id].data); // set lai data cua lstCTietBCao[index] = this.editCache[id].data
      this.editCache[id].edit = false;  // CHUYEN VE DANG TEXT

  }

  updateEditCache(): void {
    this.lstCTietBCao.forEach(item => {
      this.editCache[item.id] = {
        edit: false,
        data: { ...item }
      };
    });
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
    this.spinner.hide();
  }

  xoaBaoCao(){
    if(this.id){
      this.quanLyVonPhiService.xoaBaoCao(this.id).toPromise().then( async res => {
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
    if (!maBaoCao) {
      return;
    }
    this.mullMoneyTotal();
    // replace nhung ban ghi dc them moi id thanh null
    let lstTemp = [];
    this.lstCTietBCao.filter(item => {
      lstTemp.push({
        ...item,
        id: null,
      })
    })
    let request = {
      id: null,
      listIdDeletes: null,
      fileDinhKems: null,
      listIdDeleteFiles: null,                      // id file luc get chi tiet tra ra( de backend phuc vu xoa file)
      lstCTietBCao: lstTemp,
      maBcao: maBaoCao,
      maDvi: this.maDonViTao,
      maDviTien: this.maDviTien,
      maLoaiBcao: this.maLoaiBaoCao = QLNV_KHVONPHI_CHI_DTAI_DAN_NCKH_GD3N,
      namHienHanh: this.namBaoCaoHienHanh,
      namBcao: this.namBaoCaoHienHanh + 1,
      soVban: null,
    };

    //call service them moi
    this.spinner.show();
    this.quanLyVonPhiService.trinhDuyetService(request).toPromise().then(
      async data => {
        if (data.statusCode == 0) {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.COPY_SUCCESS);
          this.id = data.data.id;
          await this.getDetailReport();
          this.getStatusButton();
          this.router.navigateByUrl('/qlkh-von-phi/quan-ly-lap-tham-dinh-du-toan-nsnn/thuyet-minh-chi-de-tai-du-an-nghien-cuu-kh/' + this.id);
        } else {
          this.notification.error(MESSAGE.ERROR, data?.msg);
          this.divMoneyTotal();
        }
      },
      err => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        this.divMoneyTotal();
      },
    );

    this.lstCTietBCao.filter(item => {
      if (!item.id) {
        item.id = uuid.v4();
      }
    });

    this.updateEditCache();
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

  mullMoneyTotal(){
    this.lstCTietBCao.filter(element => {
      element.kphiDaDuocBoTriDenNamN = mulMoney(element.kphiDaDuocBoTriDenNamN, this.maDviTien);
      element.kphiDuKienBtriN1 = mulMoney(element.kphiDuKienBtriN1, this.maDviTien);
      element.kphiDuKienBtriN2 = mulMoney(element.kphiDuKienBtriN2, this.maDviTien);
      element.kphiDuKienBtriN3 = mulMoney(element.kphiDuKienBtriN3, this.maDviTien);
      element.kphiDuocThienDenThoiDiemBcao = mulMoney(element.kphiDuocThienDenThoiDiemBcao, this.maDviTien);
      element.kphiTongPhiDuocDuyet = mulMoney(element.kphiTongPhiDuocDuyet, this.maDviTien);
      element.kphiThuhoi = mulMoney(element.kphiThuhoi, this.maDviTien);
    });
  }

  divMoneyTotal(){
    this.lstCTietBCao.filter(element => {
      element.kphiDaDuocBoTriDenNamN = divMoney(element.kphiDaDuocBoTriDenNamN, this.maDviTien);
      element.kphiDuKienBtriN1 = divMoney(element.kphiDuKienBtriN1, this.maDviTien);
      element.kphiDuKienBtriN2 = divMoney(element.kphiDuKienBtriN2, this.maDviTien);
      element.kphiDuKienBtriN3 = divMoney(element.kphiDuKienBtriN3, this.maDviTien);
      element.kphiDuocThienDenThoiDiemBcao = divMoney(element.kphiDuocThienDenThoiDiemBcao, this.maDviTien);
      element.kphiTongPhiDuocDuyet = divMoney(element.kphiTongPhiDuocDuyet, this.maDviTien);
      element.kphiThuhoi = divMoney(element.kphiThuhoi, this.maDviTien);
    });
  }
}
