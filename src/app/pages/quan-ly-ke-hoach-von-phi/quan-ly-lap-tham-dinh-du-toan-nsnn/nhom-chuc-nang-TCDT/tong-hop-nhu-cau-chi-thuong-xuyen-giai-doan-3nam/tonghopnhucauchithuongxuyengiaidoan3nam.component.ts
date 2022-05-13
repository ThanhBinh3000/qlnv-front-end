import { DatePipe, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserService } from 'src/app/services/user.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { divMoney, DONVITIEN, MONEYLIMIT, mulMoney, QLNV_KHVONPHI_TC_THOP_NNCAU_CHI_TX_GD3N, Utils } from 'src/app/Utility/utils';
import * as uuid from "uuid";
import * as fileSaver from 'file-saver';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MESSAGE } from 'src/app/constants/message';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { DialogCopyComponent } from 'src/app/components/dialog/dialog-copy/dialog-copy.component';
import { NzModalService } from 'ng-zorro-antd/modal';

export class ItemData {
  id!: any;
  stt!: number;
  maNdung!: String;
  maNhomChi!: String;
  namHhanhN!: number;
  tranChiN1!: number;
  ncauChiN1!: number;
  clechTranChiVsNcauChiN1: number = this.ncauChiN1 - this.tranChiN1;
  tranChiN2!: number;
  ncauChiN2!: number;
  clechTranChiVsNcauChiN2: number = this.ncauChiN2 - this.tranChiN2;
  tranChiN3!: number;
  ncauChiN3!: number;
  clechTranChiVsNcauChiN3: number = this.ncauChiN3 - this.tranChiN3;
  checked!:boolean;
}

@Component({
  selector: 'app-tonghopnhucauchithuongxuyengiaidoan3nam',
  templateUrl: './tonghopnhucauchithuongxuyengiaidoan3nam.component.html',
  styleUrls: ['./tonghopnhucauchithuongxuyengiaidoan3nam.component.scss']
})
export class Tonghopnhucauchithuongxuyengiaidoan3namComponent implements OnInit {



  statusBtnDel: boolean; // trang thai an/hien nut xoa
  statusBtnSave: boolean; // trang thai an/hien nut luu
  statusBtnApprove: boolean; // trang thai an/hien nut trinh duyet
  statusBtnTBP: boolean; // trang thai an/hien nut truong bo phan
  statusBtnLD: boolean; // trang thai an/hien nut lanh dao
  statusBtnGuiDVCT: boolean; // trang thai nut gui don vi cap tren
  statusBtnDVCT: boolean; // trang thai nut don vi cap tren
  statusBtnLDDC:boolean; // trang thai nut lanh dao dieu chi so kiem tra
  statusBtnCopy:boolean; // trang thai nut copy
  statusBtnPrint:boolean; // trang thai nut in
  
  currentday: Date = new Date();
  //////
  id: any;
  maDvi: any;
  maLoaiBacao: string = QLNV_KHVONPHI_TC_THOP_NNCAU_CHI_TX_GD3N;
  nam: any;
  userInfor: any;
  status: boolean = false;
  ngaynhap: any;
  nguoinhap: any;
  donvitao: any;
  mabaocao: any;
  namBcaohienhanh: any;
  trangThaiBanGhi: string = '1';
  loaiBaocao: any;

  listDonViTien:any = DONVITIEN;
  chiTietBcaos: any;
  lstCTietBCao: ItemData[] = [];
  lstFile: any[] = [];
  listIdDeleteFiles: string ='';
  errorMessage: any;
  donViTaos: any[] = [];
  donvitien: string;

  allChecked = false; // check all checkbox
  indeterminate = true; // properties allCheckBox
  editCache: { [key: string]: { edit: boolean; data: ItemData } } = {}; // phuc vu nut chinh
  listNoidung: any[] = [];
  listNhomchi: any[] = [];
  listIdDelete: string = '';
  fileList: NzUploadFile[] = [];
  listFile: File[] = [];
  fileUrl: any;
  fileToUpload!: File;
  listFileUploaded: any = [];

  constructor(
    private nguoiDungSerivce: UserService,
    private quanLyVonPhiService: QuanLyVonPhiService,
    private danhMuc: DanhMucHDVService,
    private spinner: NgxSpinnerService,
    private router: ActivatedRoute,
    private datepipe: DatePipe,
    private sanitizer: DomSanitizer,
    private route:Router,
    private notification: NzNotificationService,
    private location: Location,
    private modal: NzModalService,
  ) {}

  async ngOnInit() {
    let userName = this.nguoiDungSerivce.getUserName();
    await this.getUserInfo(userName); //get user info

    //check param dieu huong router
    this.id = this.router.snapshot.paramMap.get('id');
    this.maDvi = this.router.snapshot.paramMap.get('maDvi');
    this.maLoaiBacao = this.router.snapshot.paramMap.get('maLoaiBacao');
    this.nam = this.router.snapshot.paramMap.get('nam');

    if (this.id != null) {
      await this.getDetailReport();
    } else if (
      this.maDvi != null &&
      this.maLoaiBacao != null &&
      this.nam != null
    ) {
      this.calltonghop();
      this.nguoinhap = this.userInfor?.username;
      this.ngaynhap = this.datepipe.transform(this.currentday, 'dd/MM/yyyy');
      this.donvitao = this.userInfor?.dvql;
      this.quanLyVonPhiService.sinhMaBaoCao().toPromise().then(
        (res) => {
          if (res.statusCode == 0) {
            this.mabaocao = res.data;
          } else {
            this.notification.error(MESSAGE.ERROR, res?.msg);
          }
        },
        (err) => {
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        },
      );
    } else {
      this.trangThaiBanGhi = '1';
      this.nguoinhap = this.userInfor?.username;
      this.donvitao = this.userInfor?.dvql;
      this.namBcaohienhanh = this.currentday.getFullYear();
      this.ngaynhap = this.datepipe.transform(this.currentday, 'dd/MM/yyyy');
      this.maLoaiBacao = QLNV_KHVONPHI_TC_THOP_NNCAU_CHI_TX_GD3N;
      this.spinner.show();
      this.quanLyVonPhiService.sinhMaBaoCao().toPromise().then(
        (res) => {
          if (res.statusCode == 0) {
            this.mabaocao = res.data;
          } else {
            this.notification.error(MESSAGE.ERROR, res?.msg);
          }
        },
        (err) => {
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        },
      );
    }
    this.danhMuc.dMNoiDung().toPromise().then(
      (res) => {
        if (res.statusCode == 0) {
          this.listNoidung = res.data?.content;

        } else {
          this.notification.error(MESSAGE.ERROR, res?.msg);
        }
      },
      (err) => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      },
    );
    //get danh muc dự án
    this.danhMuc.dMNhomChi().toPromise().then(
      (data) => {
          if (data.statusCode == 0) {
              this.listNhomchi = data.data?.content;

          } else {
            this.notification.error(MESSAGE.ERROR, data?.msg);
          }
      },
      (err) => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
    );
   await this.quanLyVonPhiService.dMDonVi().toPromise().then(res => {
      if(res.statusCode==0){
        this.donViTaos =res.data;
      }else {
        this.notification.error(MESSAGE.ERROR, res?.msg);
      }
    })
    this.getStatusButton();
    this.spinner.hide();
    
  }

  redirectkehoachvonphi() {
    // this.route.navigate(['/qlkh-von-phi/quan-ly-lap-tham-dinh-du-toan-nsnn']);
    this.location.back()
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
          }
        },
        (err) => {
          console.log(err);
        },
      );
  }

  //check role cho các nut trinh duyet
  getStatusButton(){
    let checkParent = false;
    let checkChirld = false;
    let dVi = this.donViTaos.find(e => e.maDvi == this.donvitao);
    if(dVi && dVi.maDvi == this.userInfor.dvql){ 
      checkChirld = true;
    }
    if(dVi && dVi.parent?.maDvi == this.userInfor.dvql){
      checkParent = true;
    }
    
    const utils = new Utils();
    this.statusBtnDel = utils.getRoleDel(this.trangThaiBanGhi, checkChirld, this.userInfor?.roles[0]?.code);
    this.statusBtnSave = utils.getRoleSave(this.trangThaiBanGhi, checkChirld, this.userInfor?.roles[0]?.code);
    this.statusBtnApprove = utils.getRoleApprove(this.trangThaiBanGhi, checkChirld, this.userInfor?.roles[0]?.code);
    this.statusBtnTBP = utils.getRoleTBP(this.trangThaiBanGhi, checkChirld, this.userInfor?.roles[0]?.code);
    this.statusBtnLD = utils.getRoleLD(this.trangThaiBanGhi, checkChirld, this.userInfor?.roles[0]?.code);
    this.statusBtnGuiDVCT = utils.getRoleGuiDVCT(this.trangThaiBanGhi, checkChirld, this.userInfor?.roles[0]?.code);
    this.statusBtnDVCT = utils.getRoleDVCT(this.trangThaiBanGhi, checkParent, this.userInfor?.roles[0]?.code);
    this.statusBtnLDDC = utils.getRoleLDDC(this.trangThaiBanGhi, checkChirld, this.userInfor?.roles[0]?.code);
    this.statusBtnCopy = utils.getRoleCopy(this.trangThaiBanGhi, checkChirld, this.userInfor?.roles[0]?.code);
    this.statusBtnPrint = utils.getRolePrint(this.trangThaiBanGhi, checkChirld, this.userInfor?.roles[0]?.code);
  }

  // call chi tiet bao cao
  async getDetailReport() {
    this.spinner.show();
    await this.quanLyVonPhiService.bCLapThamDinhDuToanChiTiet(this.id).toPromise().then(
      (data) => {
        if (data.statusCode == 0) {
          this.chiTietBcaos = data.data;
          this.lstCTietBCao = data.data.lstCTietBCao;
          this.donvitien = data.data.maDviTien;
          this.divMoneyTotal();
          this.updateEditCache();
          this.lstFile = data.data.lstFile;
          this.maLoaiBacao = QLNV_KHVONPHI_TC_THOP_NNCAU_CHI_TX_GD3N;
          // set thong tin chung bao cao
          this.ngaynhap = this.datepipe.transform(data.data.ngayTao,'dd/MM/yyyy');
          this.nguoinhap = data.data.nguoiTao;
          this.donvitao = data.data.maDvi;
          this.mabaocao = data.data.maBcao;
          this.namBcaohienhanh = data.data.namHienHanh;
          this.trangThaiBanGhi = data.data.trangThai;
          if(this.trangThaiBanGhi == Utils.TT_BC_1 ||
            this.trangThaiBanGhi == Utils.TT_BC_3 ||
            this.trangThaiBanGhi == Utils.TT_BC_5 ||
            this.trangThaiBanGhi == Utils.TT_BC_8 ||
            this.trangThaiBanGhi == Utils.TT_BC_10){
            this.status = false;
          }else{
            this.status = true;
          }
          this.listFile =[];
          this.tinhTong();
        } else {
          this.notification.error(MESSAGE.ERROR, data?.msg);
        }
      },
      (err) => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      },
    );
    this.spinner.hide();
  }

  //lay ten don vi tạo
  getUnitName() {
     return this.donViTaos.find(item => item.maDvi== this.donvitao)?.tenDvi;
  }

  getStatusName() {
    const utils = new Utils();
    return utils.getStatusName(this.trangThaiBanGhi);
  }

  //chuc nang trinh duyet len các cap tren
  onSubmit(mcn: String) {
    const requestGroupButtons = {
      id: this.id,
      maChucNang: mcn,
      type: '',
    };
    if(this.id){
      this.spinner.show();
      this.quanLyVonPhiService.approve(requestGroupButtons).subscribe(async (data) => {
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
      this.notification.warning(MESSAGE.WARNING, MESSAGE.MESSAGE_DELETE_WARNING);
    }
    
  }

  //check all input
  updateAllChecked(): void {
    this.indeterminate = false;
    if (this.allChecked) {
      this.lstCTietBCao = this.lstCTietBCao.map((item) => ({
        ...item,
        checked: true,
      }));
    } else {
      this.lstCTietBCao = this.lstCTietBCao.map((item) => ({
        ...item,
        checked: false,
      }));
    }
  }

  // xoa dong
  deleteById(id: any): void {
    this.lstCTietBCao = this.lstCTietBCao.filter((item) => item.id != id);
    if (id?.length == 36) {
      this.listIdDelete += id + ',';
    }
  }

  //chọn row cần sửa và trỏ vào template
  startEdit(id: string): void {
    this.editCache[id].edit = true;
  }

  // them dong moi
  addLine(id: number): void {
    let item: ItemData = {
      id: uuid.v4()+'FE',
      stt: 0,
      maNdung: '',
      maNhomChi: '',
      namHhanhN: 0,
      tranChiN1: 0,
      ncauChiN1: 0,
      clechTranChiVsNcauChiN1: 0,
      tranChiN2: 0,
      ncauChiN2: 0,
      clechTranChiVsNcauChiN2: 0,
      tranChiN3: 0,
      ncauChiN3: 0,
      clechTranChiVsNcauChiN3: 0,
      checked:false,
    };

    this.lstCTietBCao.splice(id, 0, item);
    this.editCache[item.id] = {
      edit: true,
      data: { ...item },
    };
  }

  //nut xoa bang
  xoaBang(){
    this.lstCTietBCao=[];
    this.lstFile = [];
    this.listFile = []
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

  //update khi sửa
  saveEdit(id: string): void {
    if(!this.editCache[id].data.maNdung || !this.editCache[id].data.maNhomChi){
      this.notification.warning(MESSAGE.WARNING,MESSAGEVALIDATE.NOTEMPTYS);
      return;
    }
    this.editCache[id].data.checked = this.lstCTietBCao.find(
      (item) => item.id === id,
    ).checked; // set checked editCache = checked lstCTietBCao
    const index = this.lstCTietBCao.findIndex((item) => item.id === id); // lay vi tri hang minh sua
    Object.assign(this.lstCTietBCao[index], this.editCache[id].data); // set lai data cua lstCTietBCao[index] = this.editCache[id].data
    this.editCache[id].edit = false; // CHUYEN VE DANG TEXT
    this.tinhTong();
  }

  //hủy thao tác sửa update lại giá trị ban đầu
  cancelEdit(id: string): void {
    const index = this.lstCTietBCao.findIndex((item) => item.id === id); // lay vi tri hang minh sua
    this.editCache[id] = {
      data: { ...this.lstCTietBCao[index] },
      edit: false,
    };
  }

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

  // xoa file trong bang file
  deleteFile(id: string): void {
    this.lstFile = this.lstFile.filter((a: any) => a.id !== id);
    this.listFile = this.listFile.filter(
      (a: any) => a?.lastModified.toString() !== id,
    );
    this.listIdDeleteFiles +=id+',';
  }

  // xóa với checkbox
  deleteSelected() {
    // add list delete id
    this.lstCTietBCao.filter((item) => {
      if (item.checked == true && typeof item.id == 'number') {
        this.listIdDelete += item.id + ',';
      }
    });
    // delete object have checked = true
    this.lstCTietBCao = this.lstCTietBCao.filter(
      (item) => item.checked != true,
    );
    this.allChecked = false;
  }

  // luu
  async luu() {

    let checkSaveEdit;
    if(!this.donvitien || !this.namBcaohienhanh){
      this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
      return;
    }
    if (this.namBcaohienhanh >= 3000 || this.namBcaohienhanh < 1000){
      this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.WRONG_FORMAT);
      return;
    }
    this.lstCTietBCao.filter(item =>{
      if(this.editCache[item.id].edit === true){
        checkSaveEdit = false;
      }
    })
    if (checkSaveEdit == false) {
      this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTSAVE);
      return;
    }
    this.lstCTietBCao.forEach(e => {
      if(e?.id?.length == 38){
        e.id = null;
      }
    })

    let lstCTietBCaoTemp = [];
    let checkMoneyRange = true;
    this.lstCTietBCao.filter(item => {
       let namHhanhN = mulMoney(item.namHhanhN, this.donvitien);
       let tranChiN1 = mulMoney(item.tranChiN1, this.donvitien);
       let ncauChiN1 = mulMoney(item.ncauChiN1, this.donvitien);
       let clechTranChiVsNcauChiN1 = mulMoney(item.clechTranChiVsNcauChiN1, this.donvitien);
       let tranChiN2 = mulMoney(item.tranChiN2, this.donvitien);
       let ncauChiN2 = mulMoney(item.ncauChiN2, this.donvitien);
       let clechTranChiVsNcauChiN2 = mulMoney(item.clechTranChiVsNcauChiN2, this.donvitien);
       let tranChiN3 = mulMoney(item.tranChiN3, this.donvitien);
       let ncauChiN3 = mulMoney(item.ncauChiN3, this.donvitien);
       let clechTranChiVsNcauChiN3 = mulMoney(item.clechTranChiVsNcauChiN3, this.donvitien);
       if(namHhanhN > MONEYLIMIT || tranChiN1 >MONEYLIMIT || ncauChiN1 > MONEYLIMIT || clechTranChiVsNcauChiN1 > MONEYLIMIT ||
        tranChiN2 > MONEYLIMIT || ncauChiN2 > MONEYLIMIT || clechTranChiVsNcauChiN2 > MONEYLIMIT || tranChiN3 > MONEYLIMIT ||
        ncauChiN3 > MONEYLIMIT || clechTranChiVsNcauChiN3 > MONEYLIMIT){
          checkMoneyRange = false;
          return;
        }
      lstCTietBCaoTemp.push({
        ...item,
        namHhanhN : namHhanhN,
        tranChiN1 : tranChiN1,
        ncauChiN1 : ncauChiN1,
        clechTranChiVsNcauChiN1 : clechTranChiVsNcauChiN1,
        tranChiN2 :tranChiN2,
        ncauChiN2 : ncauChiN2,
        clechTranChiVsNcauChiN2 :clechTranChiVsNcauChiN2,
        tranChiN3 : tranChiN3,
        ncauChiN3 : ncauChiN3,
        clechTranChiVsNcauChiN3 : clechTranChiVsNcauChiN3,
      })
    });
    
    let listFile: any = [];
    for (const iterator of this.listFile) {
      listFile.push(await this.uploadFile(iterator));
    }
    // gui du lieu trinh duyet len server
    if(!checkMoneyRange ==true){
      this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.MONEYRANGE);
    }else{
      let request = {
        id: this.id,
        fileDinhKems: listFile,
        listIdDeleteFiles: this.listIdDeleteFiles, // lay id file dinh kem (gửi file theo danh sách )
        listIdDeletes: this.listIdDelete,  
        lstCTietBCao: lstCTietBCaoTemp,
        maBcao: this.mabaocao,
        maDvi: this.donvitao,
        maDviTien: this.donvitien,
        maLoaiBcao: this.maLoaiBacao,
        namBcao: this.namBcaohienhanh+1,
        namHienHanh: this.namBcaohienhanh,
      };
      this.spinner.show();
  
      if (
        this.id != null
  
      ) {
        this.quanLyVonPhiService.updatelist(request).subscribe(async (res) => {
          if (res.statusCode == 0) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS)
            this.id = res.data.id;
            await this.getDetailReport();
            this.getStatusButton();
          } else {
            this.notification.error(MESSAGE.ERROR, res?.msg)
          }
        },err => {
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        });
      } else {
        this.quanLyVonPhiService.trinhDuyetService(request).subscribe(
          async (data) => {
            if(data.statusCode==0){
              this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
              this.id = data.data.id;
              await this.getDetailReport();
              this.getStatusButton();
            }else{
              this.notification.error(MESSAGE.ERROR, data?.msg)
            }
          },
          (err) => {
            this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR)
          },
        );
      }
    }
    this.lstCTietBCao.filter(item => {
			if (!item.id) {
				item.id = uuid.v4()+'FE';
			}
		});
    this.updateEditCache();
    this.spinner.hide();
  }

  updateEditCache(): void {
    this.lstCTietBCao.forEach((item) => {
      this.editCache[item.id] = {
        edit: false,
        data: { ...item },
      };
    });
  }

  //upload file
  async uploadFile(file: File) {
    // day file len server
    const upfile: FormData = new FormData();
    upfile.append('file', file);
    upfile.append('folder', this.mabaocao + '/' + this.donvitao);
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


  //call tong hop
  calltonghop(){
    this.donvitien = '1';
    let objtonghop={
        maDvi: this.maDvi,
        maLoaiBcao: this.maLoaiBacao,
        namHienTai: this.nam,
    }
    this.spinner.show();
    this.quanLyVonPhiService.tongHop(objtonghop).subscribe(res => {
        if(res.statusCode==0){
            this.lstCTietBCao = res.data;
            // this.namBaoCao = this.namBcao;
            this.namBcaohienhanh = this.currentday.getFullYear();
            if(this.lstCTietBCao==null){
                this.lstCTietBCao =[];
            }else {
              this.lstCTietBCao.forEach(e =>{
                e.id = uuid.v4()+'FE';
              })
            }
            this.updateEditCache();
            this.tinhTong();
        }else{
          this.notification.error(MESSAGE.ERROR, res?.msg)
        }
    },err =>{
      this.notification.error(MESSAGE.ERROR,MESSAGE.SYSTEM_ERROR);
    });
    this.quanLyVonPhiService.sinhMaBaoCao().subscribe(res => {
        if (res.statusCode == 0) {
            this.mabaocao = res.data;
        } else {
          this.notification.error(MESSAGE.ERROR, res?.msg)
        }
    },err => {
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    })
    this.spinner.hide();
}

//gia tri cac o input thay doi thi tinh toan lai
changeModel(id: string): void {
  this.editCache[id].data.clechTranChiVsNcauChiN1 =  this.editCache[id].data.ncauChiN1 -this.editCache[id].data.tranChiN1;
  this.editCache[id].data.clechTranChiVsNcauChiN2 =  this.editCache[id].data.ncauChiN2 - this.editCache[id].data.tranChiN2;
  this.editCache[id].data.clechTranChiVsNcauChiN3 =  this.editCache[id].data.ncauChiN3 - this.editCache[id].data.tranChiN3;
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
  async doCopy(){
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
    // replace nhung ban ghi dc them moi id thanh null
    let lstTemp = [];
    let checkMoneyRange = true;
    this.lstCTietBCao.filter( item =>{
      let namHhanhN = mulMoney(item.namHhanhN, this.donvitien);
       let tranChiN1 = mulMoney(item.tranChiN1, this.donvitien);
       let ncauChiN1 = mulMoney(item.ncauChiN1, this.donvitien);
       let clechTranChiVsNcauChiN1 = mulMoney(item.clechTranChiVsNcauChiN1, this.donvitien);
       let tranChiN2 = mulMoney(item.tranChiN2, this.donvitien);
       let ncauChiN2 = mulMoney(item.ncauChiN2, this.donvitien);
       let clechTranChiVsNcauChiN2 = mulMoney(item.clechTranChiVsNcauChiN2, this.donvitien);
       let tranChiN3 = mulMoney(item.tranChiN3, this.donvitien);
       let ncauChiN3 = mulMoney(item.ncauChiN3, this.donvitien);
       let clechTranChiVsNcauChiN3 = mulMoney(item.clechTranChiVsNcauChiN3, this.donvitien);
       if(namHhanhN > MONEYLIMIT || tranChiN1 >MONEYLIMIT || ncauChiN1 > MONEYLIMIT || clechTranChiVsNcauChiN1 > MONEYLIMIT ||
        tranChiN2 > MONEYLIMIT || ncauChiN2 > MONEYLIMIT || clechTranChiVsNcauChiN2 > MONEYLIMIT || tranChiN3 > MONEYLIMIT ||
        ncauChiN3 > MONEYLIMIT || clechTranChiVsNcauChiN3 > MONEYLIMIT){
          checkMoneyRange = false;
          return;
        }
      lstTemp.push({
        ...item,
        namHhanhN : namHhanhN,
        tranChiN1 : tranChiN1,
        ncauChiN1 : ncauChiN1,
        clechTranChiVsNcauChiN1 : clechTranChiVsNcauChiN1,
        tranChiN2 :tranChiN2,
        ncauChiN2 : ncauChiN2,
        clechTranChiVsNcauChiN2 :clechTranChiVsNcauChiN2,
        tranChiN3 : tranChiN3,
        ncauChiN3 : ncauChiN3,
        clechTranChiVsNcauChiN3 : clechTranChiVsNcauChiN3,
        id:null
      })
    })
    
    // gui du lieu trinh duyet len server
    if(!checkMoneyRange==true){
      this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.MONEYRANGE);
    }else{
      let request = {
        id: null,
        fileDinhKems: null,
        listIdDeleteFiles: null,
        listIdDeletes: null,  
        lstCTietBCao: lstTemp,
        maBcao: maBaoCao,
        maDvi: this.donvitao,
        maDviTien: this.donvitien,
        maLoaiBcao: this.maLoaiBacao,
        namBcao: this.namBcaohienhanh +1,
        namHienHanh: this.namBcaohienhanh,
      };
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
  doPrint(){
    let WindowPrt = window.open(
      '',
      '',
      'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0',
    );
    let printContent = '';
    printContent = printContent + '<div> <div>';
    printContent =
    printContent + document.getElementById('tablePrint').innerHTML;
    printContent = printContent + '</div> </div>';
    WindowPrt.document.write(printContent);
    WindowPrt.document.close();
    WindowPrt.focus();
    WindowPrt.print();
    WindowPrt.close();
  }

  mullMoneyTotal(){
    this.lstCTietBCao.filter(item =>{
      item.namHhanhN = mulMoney(item.namHhanhN, this.donvitien);
      item.tranChiN1 = mulMoney(item.tranChiN1, this.donvitien);
      item.ncauChiN1 = mulMoney(item.ncauChiN1, this.donvitien);
      item.clechTranChiVsNcauChiN1 = mulMoney(item.clechTranChiVsNcauChiN1, this.donvitien);
      item.tranChiN2 = mulMoney(item.tranChiN2, this.donvitien);
      item.ncauChiN2 = mulMoney(item.ncauChiN2, this.donvitien);
      item.clechTranChiVsNcauChiN2 = mulMoney(item.clechTranChiVsNcauChiN2, this.donvitien);
      item.tranChiN3 = mulMoney(item.tranChiN3, this.donvitien);
      item.ncauChiN3 = mulMoney(item.ncauChiN3, this.donvitien);
      item.clechTranChiVsNcauChiN3 = mulMoney(item.clechTranChiVsNcauChiN3, this.donvitien);
    })
  }
  
  divMoneyTotal(){
    this.lstCTietBCao.filter(item =>{
      item.namHhanhN = divMoney(item.namHhanhN, this.donvitien);
      item.tranChiN1 = divMoney(item.tranChiN1, this.donvitien);
      item.ncauChiN1 = divMoney(item.ncauChiN1, this.donvitien);
      item.clechTranChiVsNcauChiN1 = divMoney(item.clechTranChiVsNcauChiN1, this.donvitien);
      item.tranChiN2 = divMoney(item.tranChiN2, this.donvitien);
      item.ncauChiN2 = divMoney(item.ncauChiN2, this.donvitien);
      item.clechTranChiVsNcauChiN2 = divMoney(item.clechTranChiVsNcauChiN2, this.donvitien);
      item.tranChiN3 = divMoney(item.tranChiN3, this.donvitien);
      item.ncauChiN3 = divMoney(item.ncauChiN3, this.donvitien);
      item.clechTranChiVsNcauChiN3 = divMoney(item.clechTranChiVsNcauChiN3, this.donvitien);
    })
  }

  tongNamHH:number =0;
  tongTChi1:number =0;
  tongNhuCau1:number =0;
  tongChenhLech1:number =0;
  tongTChi2:number =0;
  tongNhuCau2:number =0;
  tongChenhLech2:number =0;
  tongTChi3:number =0;
  tongNhuCau3:number =0;
  tongChenhLech3:number =0;
  tinhTong(){
    this.tongNamHH =0;
    this.tongTChi1 =0;
    this.tongNhuCau1 =0;
    this.tongChenhLech1 =0;
    this.tongTChi2 =0;
    this.tongNhuCau2 =0;
    this.tongChenhLech2 =0;
    this.tongTChi3 =0;
    this.tongNhuCau3 =0;
    this.tongChenhLech3 =0;
    this.lstCTietBCao.forEach(e =>{
      this.tongNamHH +=e.namHhanhN;
      this.tongTChi1 += e.tranChiN1;
      this.tongNhuCau1 +=e.ncauChiN1;
      this.tongChenhLech1 +=e.clechTranChiVsNcauChiN1;
      this.tongTChi2 += e.tranChiN2;
      this.tongNhuCau2 +=e.ncauChiN2;
      this.tongChenhLech2 +=e.clechTranChiVsNcauChiN2;
      this.tongTChi3 += e.tranChiN3;
      this.tongNhuCau3 +=e.ncauChiN3;
      this.tongChenhLech3 +=e.clechTranChiVsNcauChiN3;
    })
  }
}
