import { DatePipe, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserService } from 'src/app/services/user.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { divMoney, DONVITIEN, mulMoney, QLNV_KHVONPHI_TC_DTOAN_CHI_UDUNG_CNTT_GD3N, Utils } from 'src/app/Utility/utils';
import * as uuid from "uuid";
import * as fileSaver from 'file-saver';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MESSAGE } from 'src/app/constants/message';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export class ItemData {

  id!: any;
  stt!: number;
  ndung!: String;
  maLoaiKhoach!: String;
  maLoaiDan!: String;
  maDvi: string;
  tongDtoanSl!: number;
  tongDtoanGtri!: number;
  thienNamTruoc!: number;
  dtoanThienNCb!: number;
  dtoanThienNTh!: number;
  dtoanThienN1Cb!: number;
  dtoanThienN1Th!: number;
  dtoanThienN2Cb!: number;
  dtoanThienN2Th!: number;
  dtoanThienN3Cb!: number;
  dtoanThienN3Th!: number;
  ghiChu!:string;
  checked!:boolean;
}

@Component({
  selector: 'app-dutoanchiungdungCNTTgiaidoan3nam',
  templateUrl: './dutoanchiungdungCNTTgiaidoan3nam.component.html',
  styleUrls: ['./dutoanchiungdungCNTTgiaidoan3nam.component.scss']
})
export class DutoanchiungdungCNTTgiaidoan3namComponent implements OnInit {




  statusBtnDel: boolean; // trang thai an/hien nut xoa
  statusBtnSave: boolean; // trang thai an/hien nut luu
  statusBtnApprove: boolean; // trang thai an/hien nut trinh duyet
  statusBtnTBP: boolean; // trang thai an/hien nut truong bo phan
  statusBtnLD: boolean; // trang thai an/hien nut lanh dao
  statusBtnGuiDVCT: boolean; // trang thai nut gui don vi cap tren
  statusBtnDVCT: boolean; // trang thai nut don vi cap tren
  statusBtnLDDC:boolean; // trang thai nut lanh dao dieu chi so kiem tra

  currentday: Date = new Date();
  //////
  id: any;
  maDvi: any;
  maLoaiBacao: string = QLNV_KHVONPHI_TC_DTOAN_CHI_UDUNG_CNTT_GD3N;
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
  messageValidate:any = MESSAGEVALIDATE;
  validateForm: FormGroup;
  listDonViTien:any [] = DONVITIEN;
  cucKhuVucs: any = [];

  capDvi:any;
  checkKV:boolean;                            // check khu vuc
  soVban:any;
  capDv:any;
  checkDv:boolean;
  statusDvi: boolean;


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
  listLoaikehoach: any[] = [];
  listLoaiduan: any[] = [];
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
    private notification : NzNotificationService,
    private location: Location,
    private fb:FormBuilder,
  ) {}

  async ngOnInit() {
    
    this.validateForm = this.fb.group({
      namBcaohienhanh: [null, [Validators.required,Validators.pattern('^[12][0-9]{3}$')]],
      temp: [null],
    });
    
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
      this.maLoaiBacao = QLNV_KHVONPHI_TC_DTOAN_CHI_UDUNG_CNTT_GD3N;
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
    this.danhMucService.dMLoaiKeHoach().subscribe(
      (res) => {
        if (res.statusCode == 0) {
          this.listLoaikehoach = res.data?.content;

        } else {
          this.notification.error(MESSAGE.ERROR, res?.msg);
        }
      },
      (err) => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      },
    );
    //get danh muc dự án
    this.danhMucService.dMKhoiDuAn().subscribe(
      (data) => {
          if (data.statusCode == 0) {
              this.listLoaiduan = data.data?.content;

          } else {
            this.notification.error(MESSAGE.ERROR, data?.msg);
          }
      },
      (err) => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
    );
    //lay danh sach danh muc don vi
    this.quanLyVonPhiService.dMDonVi().toPromise().then(
      (data) => {
        if (data.statusCode == 0) {
          this.donViTaos = data.data;
          this.donViTaos.forEach(e => {
            if (e.maDvi == this.donvitao) {
              this.capDvi = e.capDvi;
            }
          })
          // xac dinh cap tong cuc
          if (this.capDvi == '1') {
            this.statusDvi = false;
          } else {
            this.statusDvi = true;
          }
          //lay danh muc cuc khu vuc
          this.cucKhuVucs = this.donViTaos.filter(item => item.capDvi === '2');

          var Dvi = this.donViTaos.find(e => e.maDvi == this.donvitao);
          this.capDv = Dvi.capDvi;
          if (this.capDv == '2') {
            this.checkDv = false;
          } else {
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
    this.getStatusButton();
    this.spinner.hide();
    //check role cho các nut trinh duyet
    
  }

  redirectkehoachvonphi() {
    // this.route.navigate(['/qlkh-von-phi/quan-ly-lap-tham-dinh-du-toan-nsnn/tim-kiem']);
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
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        },
      );
    
  }

  getStatusButton(){
    const utils = new Utils();
    this.statusBtnDel = utils.getRoleDel(this.trangThaiBanGhi, 2, this.userInfor?.roles[0]?.id);
    this.statusBtnSave = utils.getRoleSave(this.trangThaiBanGhi, 2, this.userInfor?.roles[0]?.id);
    this.statusBtnApprove = utils.getRoleApprove(this.trangThaiBanGhi, 2, this.userInfor?.roles[0]?.id);
    this.statusBtnTBP = utils.getRoleTBP(this.trangThaiBanGhi, 2, this.userInfor?.roles[0]?.id);
    this.statusBtnLD = utils.getRoleLD(this.trangThaiBanGhi, 2, this.userInfor?.roles[0]?.id);
    this.statusBtnGuiDVCT = utils.getRoleGuiDVCT(this.trangThaiBanGhi, 2, this.userInfor?.roles[0]?.id);
    this.statusBtnDVCT = utils.getRoleDVCT(this.trangThaiBanGhi, 2, this.userInfor?.roles[0]?.id);
    this.statusBtnLDDC = utils.getRoleLDDC(this.trangThaiBanGhi, 2, this.userInfor?.roles[0]?.id);
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
          this.lstCTietBCao.filter(element => {
            element.thienNamTruoc = divMoney(element.thienNamTruoc, this.donvitien);
            element.tongDtoanGtri = divMoney(element.tongDtoanGtri, this.donvitien);
            element.dtoanThienNCb = divMoney(element.dtoanThienNCb, this.donvitien);
            element.dtoanThienNTh = divMoney(element.dtoanThienNTh, this.donvitien);
            element.dtoanThienN1Cb = divMoney(element.dtoanThienN1Cb, this.donvitien);
            element.dtoanThienN1Th = divMoney(element.dtoanThienN1Th, this.donvitien);
            element.dtoanThienN2Cb = divMoney(element.dtoanThienN2Cb, this.donvitien);
            element.dtoanThienN2Th = divMoney(element.dtoanThienN2Th, this.donvitien);
            element.dtoanThienN3Cb = divMoney(element.dtoanThienN3Cb, this.donvitien);
            element.dtoanThienN3Th = divMoney(element.dtoanThienN3Th, this.donvitien);
          });
          this.updateEditCache();
          this.lstFile = data.data.lstFile;
          this.maLoaiBacao = QLNV_KHVONPHI_TC_DTOAN_CHI_UDUNG_CNTT_GD3N;
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
            this.trangThaiBanGhi == Utils.TT_BC_8 ){
            this.status = false;
          }else{
            this.status = true;
          }
          // set list id file ban dau
          this.lstFile.filter((item) => {
            this.listIdFiles += item.id + ',';
          });
        } else {
          this.notification.error(MESSAGE.ERROR, data?.msg);
        }
      },
      (err) => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      },
    );
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
      id!:uuid.v4(),
      stt!: 0,
      ndung!: '',
      maLoaiKhoach!: '',
      maLoaiDan!: '',
      maDvi: '',
      tongDtoanSl!: 0,
      tongDtoanGtri!: 0,
      thienNamTruoc!: 0,
      dtoanThienNCb!: 0,
      dtoanThienNTh!: 0,
      dtoanThienN1Cb!: 0,
      dtoanThienN1Th!: 0,
      dtoanThienN2Cb!: 0,
      dtoanThienN2Th!: 0,
      dtoanThienN3Cb!: 0,
      dtoanThienN3Th!: 0,
      ghiChu:'',
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
    if(!this.editCache[id].data.ndung || !this.editCache[id].data.maLoaiKhoach || !this.editCache[id].data.maLoaiDan
      || (!this.editCache[id].data.tongDtoanGtri  && this.editCache[id].data.tongDtoanGtri !==0)){
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
    if(!this.donvitien || this.namBcaohienhanh){
      this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
      return;
    }
    this.lstCTietBCao.filter(element => {
      element.thienNamTruoc = mulMoney(element.thienNamTruoc, this.donvitien);
      element.tongDtoanGtri = mulMoney(element.tongDtoanGtri, this.donvitien);
      element.dtoanThienNCb = mulMoney(element.dtoanThienNCb, this.donvitien);
      element.dtoanThienNTh = mulMoney(element.dtoanThienNTh, this.donvitien);
      element.dtoanThienN1Cb = mulMoney(element.dtoanThienN1Cb, this.donvitien);
      element.dtoanThienN1Th = mulMoney(element.dtoanThienN1Th, this.donvitien);
      element.dtoanThienN2Cb = mulMoney(element.dtoanThienN2Cb, this.donvitien);
      element.dtoanThienN2Th = mulMoney(element.dtoanThienN2Th, this.donvitien);
      element.dtoanThienN3Cb = mulMoney(element.dtoanThienN3Cb, this.donvitien);
      element.dtoanThienN3Th = mulMoney(element.dtoanThienN3Th, this.donvitien);
      if (this.editCache[element.id].edit === true) {
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
          this.notification.success(MESSAGE.SUCCESS,MESSAGE.UPDATE_SUCCESS);
            this.id = res.data.id;
            await this.getDetailReport();
            this.getStatusButton();
        } else {
          this.notification.error(MESSAGE.ERROR,res?.msg);
        }
      },err=> {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      });
    } else {
      this.quanLyVonPhiService.trinhDuyetService(request).subscribe(
        async (data) => {
          if (data.statusCode == 0) {
            this.notification.success(MESSAGE.SUCCESS,MESSAGE.ADD_SUCCESS);
            this.id = data.data.id;
            await this.getDetailReport();
            this.getStatusButton();
          } else {
            this.notification.error(MESSAGE.ERROR,data?.msg);
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
    this.donvitien = '1';
    let objtonghop={
        maDvi: this.maDvi,
        maLoaiBcao: this.maLoaiBacao,
        namHienTai: this.nam,
    }
    this.quanLyVonPhiService.tongHop(objtonghop).subscribe(res => {
        if(res.statusCode==0){
            this.lstCTietBCao = res.data;
            this.namBcaohienhanh = this.currentday.getFullYear();
            if(this.lstCTietBCao==null){
                this.lstCTietBCao =[];
            }else {
              this.lstCTietBCao.forEach( e => {
                e.id = uuid.v4();
              })
            }
            this.updateEditCache();
        }else{
          this.notification.error(MESSAGE.ERROR, res?.msg);
        }
    },err =>{
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    });
    this.quanLyVonPhiService.sinhMaBaoCao().subscribe(res => {
        if (res.statusCode == 0) {
            this.mabaocao = res.data;
        } else {
          this.notification.error(MESSAGE.ERROR, res?.msg);
        }
    },err => {
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
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
}
