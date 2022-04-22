import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { divMoney, DONVITIEN, mulMoney, QLNV_KHVONPHI_TC_KHOACH_XDUNG_VBAN_QPHAM_PLUAT_DTQG_GD3N, Utils } from 'src/app/Utility/utils';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe, Location } from '@angular/common';
import * as uuid from "uuid";
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { DomSanitizer } from '@angular/platform-browser';
import * as fileSaver from 'file-saver';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MESSAGE } from 'src/app/constants/message';
import { SYSTYPE_CONFIRM } from 'src/app/constants/config';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


export class ItemData{
    id!: any;
    stt!: string;
    tenVban!: string;
    maHthucVban!: string;
    tgianDkien!: string;
    maDviChuTri!: string;
    dviPhop!: string;
    dtoanKphi!: number;
    ccuLapDtoan!: string;
    checked!:boolean;
}

@Component({
  selector: 'app-kehoachxaydungvanbanquyphamphapluatDTQGgiaidoan3nam',
  templateUrl:
    './kehoachxaydungvanbanquyphamphapluatDTQGgiaidoan3nam.component.html',
  styleUrls: [
    './kehoachxaydungvanbanquyphamphapluatDTQGgiaidoan3nam.component.scss',
  ],
})
export class KehoachxaydungvanbanquyphamphapluatDTQGgiaidoan3namComponent
  implements OnInit
{
  statusBtnDel: boolean; // trang thai an/hien nut xoa
  statusBtnSave: boolean; // trang thai an/hien nut luu
  statusBtnApprove: boolean; // trang thai an/hien nut trinh duyet
  statusBtnTBP: boolean; // trang thai an/hien nut truong bo phan
  statusBtnLD: boolean; // trang thai an/hien nut lanh dao
  statusBtnGuiDVCT: boolean; // trang thai nut gui don vi cap tren
  statusBtnDVCT: boolean; // trang thai nut don vi cap tren
  statusBtnLDDC:boolean;  // trang thai nut lanh dao dieu chinh so tran chi
  statusBtnCopy:boolean; // trang thai nut copy
  statusBtnPrint:boolean; // trang thai nut in
  currentday: Date = new Date();
  //////
  id: any;
  maDvi: any;
  maLoaiBacao: string = QLNV_KHVONPHI_TC_KHOACH_XDUNG_VBAN_QPHAM_PLUAT_DTQG_GD3N;
  nam: any;
  userInfor: any;
  status: boolean = false;
  ngaynhap: any;
  nguoinhap: any;
  donvitao!: any;
  mabaocao: any;
  namBcaohienhanh: any;
  trangThaiBanGhi: string = '1';
  loaiBaocao: any;

  listDonViTien:any []= DONVITIEN;
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
  listHinhThucVanBan: any[] = [];
  listDviChuTri: any[] = [];
  listIdDelete: string = '';
  fileList: NzUploadFile[] = [];
  listFile: File[] = [];
  fileUrl: any;
  fileToUpload!: File;
  listFileUploaded: any = [];
  constructor(
    private nguoiDungSerivce: UserService,
    private quanLyVonPhiService: QuanLyVonPhiService,
    private danhMucService: DanhMucHDVService,
    private spinner: NgxSpinnerService,
    private router: ActivatedRoute,
    private datepipe: DatePipe,
    private sanitizer: DomSanitizer,
    private route:Router,
    private notification:NzNotificationService,
    private location: Location,
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
      this.quanLyVonPhiService.sinhMaBaoCao().subscribe(
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
      this.maLoaiBacao = QLNV_KHVONPHI_TC_KHOACH_XDUNG_VBAN_QPHAM_PLUAT_DTQG_GD3N;
      this.spinner.show();
      this.quanLyVonPhiService.sinhMaBaoCao().toPromise().then(
        (res) => {
          if (res.statusCode == 0) {
            this.mabaocao = res.data;
          } else {
            this.notification.error(MESSAGE.ERROR,res?.msg);
          }
        },
        (err) => {
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        },
      );
    }
    this.danhMucService.dMMaHthucVban().toPromise().then(
      (res) => {
        if (res.statusCode == 0) {
          this.listHinhThucVanBan = res.data?.content;

        } else {
          this.notification.error(MESSAGE.ERROR,res?.msg);
        }
      },
      (err) => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      },
    );
    this.danhMucService.dMDonviChuTri().toPromise().then(
      (res) => {
        if (res.statusCode == 0) {
          this.listDviChuTri = res.data?.content;

        } else {
          this.notification.error(MESSAGE.ERROR,res?.msg);
        }
      },
      (err) => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      },
    );
    //lay danh sach danh muc don vi
    await this.danhMucService.dMDonVi().toPromise().then(
      (data) => {
        if (data.statusCode == 0) {
          this.donViTaos = data.data;
        } else {
          this.notification.error(MESSAGE.ERROR,data?.msg);
        }
      },
      (err) => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
    );
    this.getStatusButton();
    this.spinner.hide();
    //check role cho các nut trinh duyet
  }

  redirectkehoachvonphi() {
    // this.route.navigate(['./']);
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
            this.notification.error(MESSAGE.ERROR, data?.msg)
          }
        },
        (err) => {
          this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
        },
      );
  }

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
    this.statusBtnDel = utils.getRoleDel(this.trangThaiBanGhi, checkChirld, this.userInfor?.roles[0]?.id);
    this.statusBtnSave = utils.getRoleSave(this.trangThaiBanGhi, checkChirld, this.userInfor?.roles[0]?.id);
    this.statusBtnApprove = utils.getRoleApprove(this.trangThaiBanGhi, checkChirld, this.userInfor?.roles[0]?.id);
    this.statusBtnTBP = utils.getRoleTBP(this.trangThaiBanGhi, checkChirld, this.userInfor?.roles[0]?.id);
    this.statusBtnLD = utils.getRoleLD(this.trangThaiBanGhi, checkChirld, this.userInfor?.roles[0]?.id);
    this.statusBtnGuiDVCT = utils.getRoleGuiDVCT(this.trangThaiBanGhi, checkChirld, this.userInfor?.roles[0]?.id);
    this.statusBtnDVCT = utils.getRoleDVCT(this.trangThaiBanGhi, checkParent, this.userInfor?.roles[0]?.id);
    this.statusBtnLDDC = utils.getRoleLDDC(this.trangThaiBanGhi, checkChirld, this.userInfor?.roles[0]?.id);
    this.statusBtnCopy = utils.getRoleCopy(this.trangThaiBanGhi, checkChirld, this.userInfor?.roles[0]?.id);
    this.statusBtnPrint = utils.getRolePrint(this.trangThaiBanGhi, checkChirld, this.userInfor?.roles[0]?.id);
  }
  // call chi tiet bao cao
  async getDetailReport() {
    this.spinner.hide();
    await this.quanLyVonPhiService.bCLapThamDinhDuToanChiTiet(this.id).toPromise().then(
      (data) => {
        if (data.statusCode == 0) {
          this.chiTietBcaos = data.data;
          this.lstCTietBCao = data.data.lstCTietBCao;
          this.donvitien = data.data.maDviTien;
          this.lstCTietBCao.filter(item =>{
            item.dtoanKphi = divMoney(item.dtoanKphi, this.donvitien);
          })
          this.updateEditCache();
          this.lstFile = data.data.lstFile;
          this.maLoaiBacao = QLNV_KHVONPHI_TC_KHOACH_XDUNG_VBAN_QPHAM_PLUAT_DTQG_GD3N;
          // set thong tin chung bao cao
          this.ngaynhap = this.datepipe.transform(data.data.ngayTao,'dd/MM/yyyy');
          this.nguoinhap = data.data.nguoiTao;
          this.donvitao = data.data.maDvi;
          this.mabaocao = data.data.maBcao;
          this.namBcaohienhanh = data.data.namHienHanh;
          this.trangThaiBanGhi = data.data.trangThai;
          if(
            this.trangThaiBanGhi == Utils.TT_BC_1 ||
            this.trangThaiBanGhi == Utils.TT_BC_3 ||
            this.trangThaiBanGhi == Utils.TT_BC_5 ||
            this.trangThaiBanGhi == Utils.TT_BC_8 ){
            this.status = false;
          }else{
            this.status = true;
          }
          this.listFile =[];
          
        } else {
          this.notification.error(MESSAGE.ERROR,data?.msg);
        }
      },
      (err) => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      },
    );
  }

  //lay ten don vi tạo
  getUnitName() {
    return this.donViTaos.find((item) => item.maDvi == this.donvitao)?.tenDvi;
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
    if (typeof id == 'number') {
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
      id: uuid.v4(),
      stt: '',
      tenVban: '',
      maHthucVban: '',
      tgianDkien: '',
      maDviChuTri: '',
      dviPhop: '',
      dtoanKphi: 0,
      ccuLapDtoan: '',
      checked: false,
    };

    this.lstCTietBCao.splice(id, 0, item);
    this.editCache[item.id] = {
      edit: true,
      data: { ...item },
    };
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
    if(!this.editCache[id].data.tenVban || !this.editCache[id].data.maHthucVban 
      ||  !this.editCache[id].data.tgianDkien || !this.editCache[id].data.maDviChuTri
      || !this.editCache[id].data.dviPhop || (!this.editCache[id].data.dtoanKphi && this.editCache[id].data.dtoanKphi !==0) 
      || !this.editCache[id].data.ccuLapDtoan){
      this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
      return;
    }
    
    this.editCache[id].data.checked = this.lstCTietBCao.find(
      (item) => item.id === id,
    ).checked; // set checked editCache = checked lstCTietBCao
    const index = this.lstCTietBCao.findIndex((item) => item.id === id); // lay vi tri hang minh sua
    Object.assign(this.lstCTietBCao[index], this.editCache[id].data); // set lai data cua lstCTietBCao[index] = this.editCache[id].data
    this.editCache[id].edit = false; // CHUYEN VE DANG TEXT
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
    this.listIdDeleteFiles += id +',';
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
    //tinh đon vi tien
    this.lstCTietBCao.filter(item => {
      item.dtoanKphi = mulMoney(item.dtoanKphi, this.donvitien);
      if (this.editCache[item.id].edit === true) {
        checkSaveEdit = false
      }
    });
    if (checkSaveEdit == false) {
      this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTSAVE);
      return;
    }
    this.lstCTietBCao.forEach(e => {
      if(typeof e.id !="number"){
        e.id = null;
      }
    })
    
    // gui du lieu trinh duyet len server
    // lay id file dinh kem (gửi file theo danh sách )
    let listFile: any = [];
    for (const iterator of this.listFile) {
      listFile.push(await this.uploadFile(iterator));
    }
    // gui du lieu trinh duyet len server
    let request = {
      id: this.id,
      fileDinhKems: listFile,
      listIdDeleteFiles: this.listIdDeleteFiles,
      listIdDeletes: this.listIdDelete,  
      lstCTietBCao: this.lstCTietBCao,
      maBcao: this.mabaocao,
      maDvi: this.donvitao,
      maDviTien: this.donvitien,
      maLoaiBcao: this.maLoaiBacao,
      namBcao: this.namBcaohienhanh +1,
      namHienHanh: this.namBcaohienhanh,
    };
    this.spinner.show();

    if (this.id != null) {
      this.quanLyVonPhiService.updatelist(request).subscribe(async (res) => {
        if (res.statusCode == 0) {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
          this.id = res.data.id;
            await this.getDetailReport();
            this.getStatusButton();
        } else {
         this.notification.error(MESSAGE.ERROR, res?.msg);
        }
      },err => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      });
    } else {
      this.quanLyVonPhiService.trinhDuyetService(request).subscribe(
        async (data) => {
          if (data.statusCode == 0) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
            this.id = data.data.id;
            await this.getDetailReport();
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
    this.spinner.hide();
    this.donvitien ='1';
    let objtonghop={
        maDvi: this.maDvi,
        maLoaiBcao: this.maLoaiBacao,
        namHienTai: Number(this.nam),
    }
    this.quanLyVonPhiService.tongHop(objtonghop).subscribe(res => {
        if(res.statusCode==0){
            this.lstCTietBCao = res.data;
            // this.namBaoCao = this.namBcao;
            this.namBcaohienhanh = this.currentday.getFullYear();
            if(this.lstCTietBCao==null){
                this.lstCTietBCao =[];
            }

            this.namBcaohienhanh = this.namBcaohienhanh;
            this.updateEditCache();
        }else{
          this.notification.error(MESSAGE.ERROR,MESSAGE.ERROR_CALL_SERVICE);
        }
    },err =>{
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    });
    this.quanLyVonPhiService.sinhMaBaoCao().subscribe(res => {
        if (res.statusCode == 0) {
            this.mabaocao = res.data;
        } else {
          this.notification.error(MESSAGE.ERROR,MESSAGE.ERROR_CALL_SERVICE);
        }
    })
    this.spinner.show();
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
   doCopy(){
    
  }

  // action print
  doPrint(){
    
  }
}
