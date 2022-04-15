import { DatePipe, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserService } from 'src/app/services/user.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { QLNV_KHVONPHI_TC_THOP_MTIEU_NVU_CYEU_NCAU_CHI_MOI_GD3N, Utils } from 'src/app/Utility/utils';
import * as uuid from "uuid";
import * as fileSaver from 'file-saver';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MESSAGE } from 'src/app/constants/message';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';

export class ItemData{
  id:any;
  stt:number;
  maLvuc:string;
  maMucChi:string;
  mtieuNvu:number;
  csPhapLyThien:number;
  hdongChuYeu:number;
  nguonKphi:number;
  tongSo:number;
  chiCs:number;
  chiMoi:number;
  dtuPtrien:number;
  dtuPtrienChiCs!:number;
  dtuPtrienChiMoi!:number;
  chiTx:number;
  chiTxChiCs!:number;
  chiTxChiMoi!:number;
  checked!:boolean;
}

@Component({
  selector: 'app-tonghopmuctieunhiemvuchuyeuvanhucauchimoigiaidoan3nam',
  templateUrl: './tonghopmuctieunhiemvuchuyeuvanhucauchimoigiaidoan3nam.component.html',
  styleUrls: ['./tonghopmuctieunhiemvuchuyeuvanhucauchimoigiaidoan3nam.component.scss']
})
export class Tonghopmuctieunhiemvuchuyeuvanhucauchimoigiaidoan3namComponent implements OnInit {


  statusBtnDel: boolean; // trang thai an/hien nut xoa
  statusBtnSave: boolean; // trang thai an/hien nut luu
  statusBtnApprove: boolean; // trang thai an/hien nut trinh duyet
  statusBtnTBP: boolean; // trang thai an/hien nut truong bo phan
  statusBtnLD: boolean; // trang thai an/hien nut lanh dao
  statusBtnGuiDVCT: boolean; // trang thai nut gui don vi cap tren
  statusBtnDVCT: boolean; // trang thai nut don vi cap tren

  currentday: Date = new Date();
  //////
  id: any;
  maDvi: any;
  maLoaiBacao: string = QLNV_KHVONPHI_TC_THOP_MTIEU_NVU_CYEU_NCAU_CHI_MOI_GD3N;
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
  listlinhvucchi: any[] = [];
  listMucchi: any[] = [];
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
      this.maLoaiBacao = QLNV_KHVONPHI_TC_THOP_MTIEU_NVU_CYEU_NCAU_CHI_MOI_GD3N;
      this.spinner.show();
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
    }
    this.quanLyVonPhiService.dMDonVi().subscribe(res => {
      if(res.statusCode==0){
        this.donViTaos =res.data;
      }
    })
    //get list linh vuc chi va muc chi
    this.callListLinhVucChi();
    this.getStatusButton();
    this.spinner.hide();
    
  }

  redirectkehoachvonphi() {
    // this.route.navigate(['/qlkh-von-phi/quan-ly-lap-tham-dinh-du-toan-nsnn']);
    this.location.back()
  }

 //get lít ma don vi
 callListLinhVucChi() {
  this.danhMuc.linhvucchi().subscribe(res => {
      this.listlinhvucchi = res.data.content;
  });
  this.danhMuc.mucchi().subscribe( res => {
      this.listMucchi = res.data.content;
  })
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
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        },
      );
  }


  //check role cho các nut trinh duyet
  getStatusButton(){
    const utils = new Utils();
    this.statusBtnDel = utils.getRoleDel(this.trangThaiBanGhi, 2, this.userInfor?.roles[0]?.id);
    this.statusBtnSave = utils.getRoleSave(this.trangThaiBanGhi, 2, this.userInfor?.roles[0]?.id);
    this.statusBtnApprove = utils.getRoleApprove(this.trangThaiBanGhi, 2, this.userInfor?.roles[0]?.id);
    this.statusBtnTBP = utils.getRoleTBP(this.trangThaiBanGhi, 2, this.userInfor?.roles[0]?.id);
    this.statusBtnLD = utils.getRoleLD(this.trangThaiBanGhi, 2, this.userInfor?.roles[0]?.id);
    this.statusBtnGuiDVCT = utils.getRoleGuiDVCT(this.trangThaiBanGhi, 2, this.userInfor?.roles[0]?.id);
    this.statusBtnDVCT = utils.getRoleDVCT(this.trangThaiBanGhi, 2, this.userInfor?.roles[0]?.id);
  }

  // call chi tiet bao cao
  async getDetailReport() {
    this.spinner.show();
    await this.quanLyVonPhiService.bCLapThamDinhDuToanChiTiet(this.id).toPromise().then(
      (data) => {
        if (data.statusCode == 0) {
          this.chiTietBcaos = data.data;
          this.lstCTietBCao = data.data.lstCTietBCao;
          this.updateEditCache();
          this.lstFile = data.data.lstFile;
          this.maLoaiBacao = QLNV_KHVONPHI_TC_THOP_MTIEU_NVU_CYEU_NCAU_CHI_MOI_GD3N;
          // set thong tin chung bao cao
          this.ngaynhap = this.datepipe.transform(data.data.ngayTao,'dd/MM/yyyy');
          this.nguoinhap = data.data.nguoiTao;
          this.donvitao = data.data.maDvi;
          this.mabaocao = data.data.maBcao;
          this.namBcaohienhanh = data.data.namHienHanh;
          this.trangThaiBanGhi = data.data.trangThai;
          if(this.trangThaiBanGhi == '1' ||this.trangThaiBanGhi == '3' ||this.trangThaiBanGhi == '5' ||this.trangThaiBanGhi == '8' ){
            this.status = false;
          }else{
            this.status = true;
          }
          // set list id file ban dau
          this.lstFile.filter((item) => {
            this.listIdFiles += item.id + ',';
          });
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
      id:uuid.v4(),
      stt:0,
      maLvuc:'',
      maMucChi:'',
      mtieuNvu:0,
      csPhapLyThien:0,
      hdongChuYeu:0,
      nguonKphi:0,
      tongSo:0,
      chiCs:0,
      chiMoi:0,
      dtuPtrien:0,
      dtuPtrienChiCs!:0,
      dtuPtrienChiMoi!:0,
      chiTx:0,
      chiTxChiCs!:0,
      chiTxChiMoi!:0,
      checked!:false,
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

    this.lstCTietBCao.forEach(e => {
      if(typeof e.id !="number"){
        e.id = null;
      }
    })
    // donvi tien
    if (this.donvitien == undefined) {
      this.donvitien = '01';
    }
    // gui du lieu trinh duyet len server

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
      fileDinhKems: this.listFileUploaded,
      listIdFiles: idFileDinhKems,
      lstCTietBCao: this.lstCTietBCao,
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
         this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
         this.id = res.data.id;
            await this.getDetailReport();
            this.getStatusButton();
        } else {
          this.notification.error(MESSAGE.ERROR, res?.msg);
        }
      }, err => {
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


  //call tong hop
  calltonghop(){
    this.spinner.hide();
    let objtonghop={
        maDvi: this.maDvi,
        maLoaiBcao: this.maLoaiBacao,
        namHienTai: this.nam,
    }
    this.quanLyVonPhiService.tongHop(objtonghop).subscribe(res => {
        if(res.statusCode==0){
            this.lstCTietBCao = res.data;
            // this.namBaoCao = this.namBcao;
            this.namBcaohienhanh = this.currentday.getFullYear();
            if(this.lstCTietBCao==null){
                this.lstCTietBCao =[];
            }else {
              this.lstCTietBCao.forEach(e =>{
                e.id = uuid.v4();
              })
            }
            this.updateEditCache();
        }else{
          this.notification.error(MESSAGE.ERROR, res?.msg);
        }
    },err =>{
      this.notification.error(MESSAGE.ERROR,MESSAGE.SYSTEM_ERROR);
    });
    this.quanLyVonPhiService.sinhMaBaoCao().subscribe(res => {
        if (res.statusCode == 0) {
            this.mabaocao = res.data;
        } else {
          this.notification.error(MESSAGE.ERROR, res?.msg);
        }
    },err => {
      this.notification.error(MESSAGE.ERROR,MESSAGE.SYSTEM_ERROR);
    })
    this.spinner.show();
}

//gia tri cac o input thay doi thi tinh toan lai
changeModel(id: string): void {

  this.editCache[id].data.tongSo = Number(this.editCache[id].data.dtuPtrienChiCs) + Number( this.editCache[id].data.chiTxChiCs) + Number(this.editCache[id].data.dtuPtrienChiMoi) + Number(this.editCache[id].data.chiTxChiMoi);
  this.editCache[id].data.chiCs = Number(this.editCache[id].data.dtuPtrienChiCs) + Number( this.editCache[id].data.chiTxChiCs);
  this.editCache[id].data.chiMoi = Number(this.editCache[id].data.dtuPtrienChiMoi) + Number(this.editCache[id].data.chiTxChiMoi);
  this.editCache[id].data.dtuPtrien =Number(this.editCache[id].data.dtuPtrienChiCs) + Number(this.editCache[id].data.dtuPtrienChiMoi);
  this.editCache[id].data.chiTx = Number(this.editCache[id].data.chiTxChiCs) + Number(this.editCache[id].data.chiTxChiMoi);
  }

  //tinh hang tong cong
  tong1:number =0;
  tong2:number = 0;
  tong3:number =0;
  tong4:number =0;
  tong5:number =0;
  tong6:number =0;
  tong7:number =0;
  tong8:number =0;
  tong9:number =0;
  tong10:number =0;
  tong11:number =0;
  tong12:number =0;
  tong13:number =0;
  tinhTong(){
  this.tong1 =0;
  this.tong2= 0;
  this.tong3=0;
  this.tong4=0;
  this.tong5=0;
  this.tong6=0;
  this.tong7=0;
  this.tong8=0;
  this.tong9=0;
  this.tong10 =0;
  this.tong11 =0;
  this.tong12=0;
  this.tong13 =0;
  this.lstCTietBCao.forEach(e =>{

    this.tong1 +=e.mtieuNvu;
    this.tong2 +=e.csPhapLyThien;
    this.tong3 +=e.hdongChuYeu;
    this.tong4 +=e.nguonKphi;
    this.tong5 +=e.tongSo;
    this.tong6 +=e.chiCs;
    this.tong7 +=e.chiMoi;
    this.tong8 +=e.dtuPtrien;
    this.tong9 +=e.dtuPtrienChiCs;
    this.tong10 +=e.dtuPtrienChiMoi;
    this.tong11 +=e.chiTx;
    this.tong12 +=e.chiTxChiCs;
    this.tong13 +=e.chiTxChiMoi;
  })
  }
}
