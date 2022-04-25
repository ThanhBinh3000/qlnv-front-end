import { DatePipe, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { divMoney, DONVITIEN, mulMoney, Utils } from 'src/app/Utility/utils';
import * as uuid from 'uuid';
import * as fileSaver from 'file-saver';
import { UserService } from 'src/app/services/user.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MESSAGE } from 'src/app/constants/message';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';


export class ItemData {
  id!: any;
  stt: any;
  maNoiDung:number;
  maNhom: number;
  tongSo: any;
  listCtietDvi: ItemDvi[] = [];
  checked!: boolean;
  
}

export class ItemDvi {
  id!: any;
  maKhuVuc!: any;
  soTranChi!: any;
  tongSo:any;
 
}

@Component({
  selector: 'app-xaydungphuongangiaosokiemtratranchiNSNNchocacdonvi',
  templateUrl:
    './xaydungphuongangiaosokiemtratranchiNSNNchocacdonvi.component.html',
  styleUrls: [
    './xaydungphuongangiaosokiemtratranchiNSNNchocacdonvi.component.scss',
  ],
})
export class XaydungphuongangiaosokiemtratranchiNSNNchocacdonviComponent
  implements OnInit
{
  statusBtnDel: boolean; // trang thai an/hien nut xoa
  statusBtnSave: boolean; // trang thai an/hien nut luu
  statusBtnApprove: boolean; // trang thai an/hien nut trinh duyet
  statusBtnTBP: boolean; // trang thai an/hien nut truong bo phan
  statusBtnLD: boolean; // trang thai an/hien nut lanh dao
  statusBtnGuiDVCT: boolean; // trang thai nut gui don vi cap tren
  statusBtnDVCT: boolean; // trang thai nut don vi cap tren
  statusBtnLDDC:boolean; // trang thai nut lanh dao dieu chinh so kiem tra
  statusBtnCopy:boolean; // trang thai nut copy
  statusBtnPrint:boolean; // trang thai nut in
  currentday: Date = new Date();
  //////
  maPa: any;
  id:any;
  userInfor: any;
  status: boolean = false;
  ngaynhap: any;
  nguoinhap: any;
  donvitao: any;
  maphuongan: any;
  nampa: any;
  namBcaohienhanh: any;
  trangThaiBanGhi: string = '1';
  loaiBaocao: any;

  listDonViTien:any []=DONVITIEN;
  chiTietBcaos: any;
  lstCTietBCao: ItemData[] = [];
  lstFile: any[] = [];
  listIdFiles: string;
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
  maGiao: any;
  checknutgiao: boolean = true;
  listId: string = '';
  
  listDviThuocQuanLy:any []=[];
  listColNames:any []=[];
  cols:any;
  //tinh tong

  constructor(
    private quanLyVonPhiService: QuanLyVonPhiService,
    private danhmuc: DanhMucHDVService,

    private spinner: NgxSpinnerService,
    private router: ActivatedRoute,
    private datepipe: DatePipe,
    private sanitizer: DomSanitizer,
    private route: Router,
    private userService:UserService,
    private notification: NzNotificationService,
    private location: Location
  ) {}

  async ngOnInit() {
    let userName = this.userService.getUserName();
    await this.getUserInfo(userName); //get user info

    //check param dieu huong router
    this.maPa = this.router.snapshot.paramMap.get('maPa');

    if (this.maPa != null) {
      this.getDetailReport();
    } else {
      this.trangThaiBanGhi = '1';
      this.nguoinhap = this.userInfor?.username;
      this.donvitao = this.userInfor?.dvql;
      this.namBcaohienhanh = this.currentday.getFullYear();
      this.nampa = this.namBcaohienhanh;
      this.ngaynhap = this.datepipe.transform(this.currentday, 'dd/MM/yyyy');
      this.spinner.show();
      this.quanLyVonPhiService.maPhuongAn().toPromise().then(
        (res) => {
          if (res.statusCode == 0) {
            this.maphuongan = res.data;
          } else {
            this.notification.error(MESSAGE.ERROR, res?.msg);
          }
        },
        (err) => {
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        },
      );
    }
    this.danhmuc.dMNoiDung().toPromise().then(
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
    this.danhmuc.dMNhomChi().toPromise().then(
      (data) => {
        if (data.statusCode == 0) {
          this.listNhomchi = data.data?.content;
        } else {
          this.notification.error(MESSAGE.ERROR, data?.msg);
        }
      },
      (err) => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      },
    );
   await this.quanLyVonPhiService.dMDonVi().toPromise().then(res => {
      if(res.statusCode==0){
        this.donViTaos = res.data;
      }
    })
    let objectDonViThuocQuanLy={
      
        capDvi: null,
        kieuDvi: null,
        loaiDvi: null,
        maDvi: this.userInfor.dvql,
        maKbnn: null,
        maNsnn: null,
        maPhuong: null,
        maQuan: null,
        maTinh: null,
        paggingReq: {
          limit: 20,
          page: 1
        },
        str: '',
        tenDvi: '',
        trangThai: '01'
      
    }
    this.danhmuc.dmDonViThuocQuanLy(objectDonViThuocQuanLy).toPromise().then(res =>{
      if(res.statusCode==0){
        this.listColNames;
        res?.data.forEach(item => {
          item.tong = 0;
          this.listColNames.push(item)
        })
        this.listColNames = res.data;
        
        this.cols = this.listColNames.length;
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
    await this.userService
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

  tinhNam(){
    this.nampa = this.namBcaohienhanh;
  }
  // call chi tiet bao cao
  async getDetailReport() {
    this.spinner.show();
    await this.quanLyVonPhiService.chitietPhuongAn(this.maPa).subscribe(
      async (data) => {
        if (data.statusCode == 0) {
          this.chiTietBcaos = data.data;
          this.id = data.data.id;
          this.lstCTietBCao = data.data.listCtiet;
          this.donvitien = data.data.maDviTien;
          this.divMoneyTotal();
          this.updateEditCache();
          // this.maBaoCao = this.chiTietBcaos?.maBcao;
          this.nampa = this.chiTietBcaos.namPa;
          this.namBcaohienhanh = this.chiTietBcaos.namHienHanh;
          this.lstFile = data.data.lstFile;
          this.donvitien = data.data.maDviTien;
          this.trangThaiBanGhi = data.data.trangThai;
          this.maphuongan = data.data.maPa;
          this.donvitao = data.data.maDvi;
          this.nguoinhap = data.data.nguoiTao;
          this.ngaynhap = this.datepipe.transform(data.data.ngayTao,'dd/MM/yyyy');
          var soqd = data.data.soQd;
          var socv = data.data.soCv;
          if (
            this.trangThaiBanGhi == Utils.TT_BC_1 ||
            this.trangThaiBanGhi == Utils.TT_BC_3 ||
            this.trangThaiBanGhi == Utils.TT_BC_5 ||
            this.trangThaiBanGhi == Utils.TT_BC_8
          ) {
            this.status = false;
          } else {
            this.status = true;
          }
          let objectDonViThuocQuanLy={
            capDvi: null,
            kieuDvi: null,
            loaiDvi: null,
            maDvi: this.donvitao,
            maKbnn: null,
            maNsnn: null,
            maPhuong: null,
            maQuan: null,
            maTinh: null,
            paggingReq: {
              limit: 20,
              page: 1
            },
            str: '',
            tenDvi: '',
            trangThai: '01'
          
        }
        await this.danhmuc.dmDonViThuocQuanLy(objectDonViThuocQuanLy).toPromise().then(res =>{
          if(res.statusCode==0){
            this.listColNames;
            res?.data.forEach(item => {
              item.tong = 0;
              this.listColNames.push(item)
            })
            this.listColNames = res.data;
            
            this.cols = this.listColNames.length;
          }
        })
          
          this.changeInput();
          this.updateEditCache();
          if (soqd != null && socv != null) {
            this.checknutgiao = false;
          }
          
          this.getStatusButton();
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
      lyDoTuChoi: '',
    };
    if(this.id){
      this.spinner.show();
      this.quanLyVonPhiService.trinhDuyetPhuongAn(requestGroupButtons).subscribe(async (data) => {
        if (data.statusCode == 0) {
          await this.getDetailReport();
          if(mcn == Utils.TT_BC_3 || mcn == Utils.TT_BC_5 || mcn == Utils.TT_BC_3){
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.TU_CHOI_SUCCESS);
          }else{
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.APPROVE_SUCCESS);
          }
          this.getStatusButton();
        }else {
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
    this.changeInput();
  }

  //chọn row cần sửa và trỏ vào template
  startEdit(id: string): void {
    this.editCache[id].edit = true;
  }

  // them dong moi
  addLine(id: number): void {
    this.listDviThuocQuanLy=[];
    this.listColNames.forEach(e => {
      let objDonVi = {
        maKhuVuc: e.maDvi,
        soTranChi: 0,
        tongSo:0,
      }
      this.listDviThuocQuanLy.push(objDonVi);
    })
    let item: ItemData = {
      id: uuid.v4(),
      stt: 0,
      maNhom: 0,
      maNoiDung: 0,
      tongSo: 0,
      listCtietDvi: this.listDviThuocQuanLy,
      checked: false,
    };

    this.lstCTietBCao.splice(id, 0, item);
    this.editCache[item.id] = {
      edit: true,
      data: { ...item },
    };
  }


  //sinh ma cot
  //list vat tu la list cot da co trong danh sach
  // sinhMa(): number{
  //   var i: number = 1;
  //   var kt: boolean = true;
  //   while (kt){
  //     var index1: number = this.lstCTietBCao.findIndex(item => item.col == i);
  //     if (index1 > -1) {
  //       i++;
  //     } else {
  //       kt = false;
  //     }
  //   }
  //   return i;
  // }
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

    if (!this.editCache[id].data.maNoiDung || !this.editCache[id].data.maNhom){
      this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
      return;
    }
    var arr = this.editCache[id].data.listCtietDvi;
    let checkValidSoTranChi;
    arr.forEach( e => {
      if(!e.soTranChi && e.soTranChi!==0){
        checkValidSoTranChi = false;
      }
    })
    if(checkValidSoTranChi==false){
      this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
      return;
    }
    this.editCache[id].data.checked = this.lstCTietBCao.find(
      (item) => item.id === id,
    ).checked; // set checked editCache = checked lstCTietBCao
    const index = this.lstCTietBCao.findIndex((item) => item.id === id); // lay vi tri hang minh sua
    Object.assign(this.lstCTietBCao[index], this.editCache[id].data); // set lai data cua lstCTietBCao[index] = this.editCache[id].data
    this.editCache[id].edit = false; // CHUYEN VE DANG TEXT
    this.changeInput();
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

    this.lstCTietBCao.filter(item => {
      if(this.editCache[item.id].edit==true){
        checkSaveEdit = false;
      }
    })
    if(checkSaveEdit==false){
      this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTSAVE);
      return;
    }
    this.mullMoneyTotal();
    this.lstCTietBCao.forEach((e) => {
      if (typeof e.id != 'number') {
        e.id = null;
      }
    });
    
    // gui du lieu trinh duyet len server


    // lay id file dinh kem (gửi file theo danh sách )
    let listFile: any = [];
    for (const iterator of this.listFile) {
      listFile.push(await this.uploadFile(iterator));
    }
    // gui du lieu trinh duyet len server
    let request = {
      id: this.id,
      listIdDeletes: this.listIdDelete,
      fileDinhKems: listFile,
      listCtiet: this.lstCTietBCao,
      maDvi: this.donvitao,
      maDviTien: this.donvitien,
      maPa: this.maphuongan,
      namHienHanh: this.namBcaohienhanh.toString(),
      namPa: this.nampa,
      trangThai: this.trangThaiBanGhi,
    };
    this.spinner.show();
    if (this.maPa == null) {
      this.quanLyVonPhiService.themmoiPhuongAn(request).subscribe(
        (res) => {
          if (res.statusCode == 0) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
            this.id = res.data.id;
            this.maPa = res.data.maPa;
            this.getDetailReport();
            this.getStatusButton();
          } else {
            this.divMoneyTotal();
            this.notification.error(MESSAGE.ERROR, res?.msg);
          }
        },
        (err) => {
          this.divMoneyTotal();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        },
      );
    } else {
      this.quanLyVonPhiService.capnhatPhuongAn(request).subscribe(
        (res) => {
          if (res.statusCode == 0) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
            this.id = res.data.id;
            this.maPa = res.data.maPa;
            this.getDetailReport();
            this.getStatusButton();
          } else {
            this.divMoneyTotal();
            this.notification.error(MESSAGE.ERROR, res?.msg);
          }
        },
        (err) => {
          this.divMoneyTotal();
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
    upfile.append('folder', this.maphuongan + '/' + this.donvitao + '/');
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

  lstQlnvKhvonphiDsachGiaoSo: any[] = [];
  //giao
  giao(madvinhan: any) {
    this.lstQlnvKhvonphiDsachGiaoSo =[];
    this.quanLyVonPhiService.maGiao().subscribe((res) => {
      this.maGiao = res.data;
      this.lstCTietBCao.forEach((e) => {
        var manoidung = e.maNoiDung;
        var manhom = e.maNhom;
        var arr = e.listCtietDvi;
        var soduocgiao;
        arr.forEach((el) => {
          if (el.maKhuVuc == madvinhan) {
            soduocgiao = el.soTranChi;
          }
        });
        let ob = {
          maDviNhan: madvinhan.toString(),
          maDviTao: this.donvitao,
          maDviTien: this.donvitien,
          maGiao: this.maGiao,
          maNhom: manhom,
          maNoiDung: manoidung,
          maPa: this.maphuongan,
          namGiao: this.namBcaohienhanh,
          soDuocGiao: soduocgiao,
        };
        this.lstQlnvKhvonphiDsachGiaoSo.push(ob);
      });
      let req = {
        lstQlnvKhvonphiDsachGiaoSo: this.lstQlnvKhvonphiDsachGiaoSo,
      };
      console.log(req);
      this.quanLyVonPhiService.giaoSoTranChi(req).subscribe((res) => {
        if(res.statusCode==0){
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.GIAO_SO_TRAN_CHI_SUCCESS);
        }else{
          this.notification.error(MESSAGE.ERROR, res?.msg);
        }
      },err => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      });
    });
  }

  //giao toan bo
  giaotoanbo() {
    this.lstQlnvKhvonphiDsachGiaoSo =[];
    this.quanLyVonPhiService.maGiao().subscribe((res) => {
      this.maGiao = res.data;
      this.lstCTietBCao.forEach((e) => {
        var manoidung = e.maNoiDung;
        var nhom = e.maNhom;
        var madonvinhan;
        var array = e.listCtietDvi;
        var soduocgiao;

        array.forEach((el) => {
          madonvinhan = el.maKhuVuc;
          soduocgiao = el.soTranChi;
          let ob = {
            maDviNhan: madonvinhan.toString(),
            maDviTao: this.donvitao,
            maDviTien: this.donvitien,
            maGiao: this.maGiao,
            maNhom: nhom,
            maNoiDung: manoidung,
            maPa: this.maphuongan,
            namGiao: this.namBcaohienhanh,
            soDuocGiao: soduocgiao,
          };
          this.lstQlnvKhvonphiDsachGiaoSo.push(ob);
        });
      });
      let req = {
        lstQlnvKhvonphiDsachGiaoSo: this.lstQlnvKhvonphiDsachGiaoSo,
      };
      console.log(req);
      this.quanLyVonPhiService.giaoSoTranChi(req).subscribe((res) => {
        if(res.statusCode==0){
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.GIAO_SO_TRAN_CHI_TOAN_BO);
        }else{
          this.notification.error(MESSAGE.ERROR, res?.msg);
        }
      },err=> {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      });
    });
  }

  listTongCol:any []=[];
  changeInput() {
    this.listColNames.forEach(e =>{
      e.tong = 0;
      this.lstCTietBCao.forEach(item => {
        item.listCtietDvi.forEach(el =>{
         if(e.maDvi==el.maKhuVuc){
           e.tong += el.soTranChi;
         }
        })
      })
    })
    
  }

  tinhtong(id:any){
    var sum =0;
    this.editCache[id].data.listCtietDvi.forEach(e => {
      sum +=Number(e.soTranChi);
    })
    this.editCache[id].data.tongSo = sum;
    var index = this.lstCTietBCao.findIndex(item => item.id == id);
    Object.assign(this.lstCTietBCao[index] ,this.editCache[id].data);
  }

  updateSumtCache(): void {
    this.lstCTietBCao.forEach((item) => {
      var arr = item.listCtietDvi;
      const index = item.id;
      arr.forEach(el => {
        item.tongSo += Number(el.soTranChi)
      })
       // lay vi tri hang minh sua
     // set lai data cua lstCTietBCao[index] = this.editCache[id].data


      })
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

  dong(){
    this.location.back()
  }

  // action copy
  async doCopy(){
    this.spinner.show();

    let maPhuongAn = await this.quanLyVonPhiService.maPhuongAn().toPromise().then(
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
    if (!maPhuongAn) {
      return;
    }
    this.mullMoneyTotal();
    // replace nhung ban ghi dc them moi id thanh null
    this.lstCTietBCao.filter(item => {
      if (typeof item.id != "number") {
        item.id = null;
      }
    })
    
   
    // gui du lieu trinh duyet len server
    let request = {
      id:null,
      listIdDeletes: null,
      fileDinhKems: null,
      listCtiet: this.lstCTietBCao,
      maDvi: this.donvitao,
      maDviTien: this.donvitien,
      maPa: maPhuongAn,
      namHienHanh: this.namBcaohienhanh.toString(),
      namPa: this.nampa,
      trangThai: this.trangThaiBanGhi,
    };
    this.spinner.show();
    if (this.maPa == null) {
      this.quanLyVonPhiService.themmoiPhuongAn(request).subscribe(
        (res) => {
          if (res.statusCode == 0) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
            this.id = res.data.id;
            this.maPa = res.data.maPa;
            this.getDetailReport();
            this.getStatusButton();
            this.route.navigateByUrl('/qlkh-von-phi/quan-ly-lap-tham-dinh-du-toan-nsnn/xay-dung-phuong-an-giao-so-kiem-tra-tran-chi-nsnn-cho-cac-don-vi/' + this.id);
          } else {
            this.divMoneyTotal();
            this.notification.error(MESSAGE.ERROR, res?.msg);
          }
        },
        (err) => {
          this.divMoneyTotal();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        },
      );
    } 

    this.lstCTietBCao.filter(item => {
      if (!item.id) {
        item.id = uuid.v4();
      }
    });

    this.updateEditCache();
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
      item.listCtietDvi.forEach( e=>{
        e.soTranChi = mulMoney(e.soTranChi, this.donvitien);
      })
    })
  }
  

  divMoneyTotal(){
    this.lstCTietBCao.filter(item => {
      item.listCtietDvi.forEach( e=>{
        e.soTranChi = divMoney(e.soTranChi, this.donvitien);
      })
    })
  }
}
