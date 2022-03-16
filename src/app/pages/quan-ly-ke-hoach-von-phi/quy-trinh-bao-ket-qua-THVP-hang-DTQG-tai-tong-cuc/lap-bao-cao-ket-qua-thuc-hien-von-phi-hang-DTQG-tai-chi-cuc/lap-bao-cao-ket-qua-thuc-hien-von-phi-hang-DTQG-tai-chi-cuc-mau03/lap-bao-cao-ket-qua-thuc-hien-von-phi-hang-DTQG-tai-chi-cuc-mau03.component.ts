import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { Utils } from 'src/app/Utility/utils';
import * as uuid from 'uuid';
import * as fileSaver from 'file-saver';
import { NzNotificationService } from 'ng-zorro-antd/notification';



export class ItemData {
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

@Component({
  selector: 'app-lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-DTQG-tai-chi-cuc-mau03',
  templateUrl: './lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-DTQG-tai-chi-cuc-mau03.component.html',
  styleUrls: ['./lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-DTQG-tai-chi-cuc-mau03.component.scss']
})
export class LapBaoCaoKetQuaThucHienVonPhiHangDTQGTaiChiCucMau03Component implements OnInit {

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
  maLoaiBaocao: string = '91';
  nam: any;
  dotBaocao:any;
  userInfor: any;
  status: boolean = false;
  ngaynhap: any;
  nguoinhap: any;
  donvitao: any;
  mabaocao: any;
  trangThaiBanGhi: string = '1';
  namBcao: any;
  loaiBaocao: any;
  dotbaocao:any;

  chiTietBcaos: any;
  lstCTietBCao: ItemData[] = [ ];
  lstCTietBCao1: ItemData[] = [ ];
  lstCTietBCao2: ItemData[] = [ ];
  lstCTietBCao3: ItemData[] = [ ];
  lstFile: any[] = [];
  listIdFiles: string;
  errorMessage: any;
  donViTaos: any[] = [];
  donvitien: string;

  allChecked = false; // check all checkbox
  indeterminate = true;  // properties allCheckBox
  editCache1: { [key: string]: { edit: boolean; data: ItemData } } = {}; // phuc vu nut chinh
  editCache2: { [key: string]: { edit: boolean; data: ItemData } } = {}; // phuc vu nut chinh
  editCache3: { [key: string]: { edit: boolean; data: ItemData } } = {}; // phuc vu nut chinh
  listVattu: any[] = [];
  listDonvitinh: any[] = [];
  listIdDelete: string = '';
  fileList: NzUploadFile[] = [];
  listFile: File[] = [];
  fileUrl: any;
  fileToUpload!: File;
  listFileUploaded: any = [];

  constructor(
    private nguoiDungSerivce: UserService,
    private quanLyVonPhiService: QuanLyVonPhiService,
    private spinner: NgxSpinnerService,
    private router: ActivatedRoute,
    private datepipe: DatePipe,
    private sanitizer: DomSanitizer,
    private route: Router,
    private notification : NzNotificationService
  ) {}

  async ngOnInit() {
    let userName = this.nguoiDungSerivce.getUserName();
    let userInfor: any = await this.getUserInfo(userName); //get user info

    //check param dieu huong router
    this.id = this.router.snapshot.paramMap.get('id');
    this.maDvi = this.router.snapshot.paramMap.get('maDvi');
    this.maLoaiBaocao = this.router.snapshot.paramMap.get('maLoaiBaocao');
    this.nam = this.router.snapshot.paramMap.get('nam');
    this.dotBaocao = this.router.snapshot.paramMap.get('dotBaocao');

    if (this.id != null) {
      this.getDetailReport();
      // this.updateEditCache();
    }else if(this.maDvi!=null && this.maLoaiBaocao !=null && this.nam !=null && this.dotBaocao !=null){
      this.callTonghop();
      this.nguoinhap = userInfor?.username;
      this.donvitao = userInfor?.dvql;
      this.namBcao = this.currentday.getFullYear();
      this.ngaynhap = this.datepipe.transform(this.currentday, 'dd/MM/yyyy');
      this.maLoaiBaocao = '90';
      this.quanLyVonPhiService.sinhMaBaoCao().subscribe(
        (res) => {
          if (res.statusCode == 0) {
            this.mabaocao = res.data;
          } else {
            this.errorMessage =
              'Có lỗi trong quá trình sinh mã báo cáo vấn tin!';
          }
        },
        (err) => {
          this.errorMessage = err.error.message;
        },
      );
    } else {
      this.trangThaiBanGhi = '1';
      this.nguoinhap = userInfor?.username;
      this.donvitao = userInfor?.dvql;
      this.namBcao = this.currentday.getFullYear();
      this.ngaynhap = this.datepipe.transform(this.currentday, 'dd/MM/yyyy');
      this.maLoaiBaocao = '91';
      this.spinner.show();
      this.quanLyVonPhiService.sinhMaBaoCao().subscribe(
        (res) => {
          if (res.statusCode == 0) {
            this.mabaocao = res.data;
          } else {
            this.errorMessage =
              'Có lỗi trong quá trình sinh mã báo cáo vấn tin!';
          }
        },
        (err) => {
          this.errorMessage = err.error.message;
        },
      );
      // this.updateEditCache();
    }
    //get danh muc noi dung
    this.quanLyVonPhiService.dmVattuhanghoa().subscribe(
      (data) => {
        if (data.statusCode == 0) {
          this.listVattu = data.data?.content;
          console.log(this.listVattu);
        } else {
          this.errorMessage = 'Có lỗi trong quá trình vấn tin!';
        }
      },
      (err) => {
        console.log(err);
        this.errorMessage = err.error.message;
      },
    );
    this.quanLyVonPhiService.dmDonvitinh().subscribe(
      (data) => {
        if (data.statusCode == 0) {
          this.listDonvitinh = data.data?.content;
          console.log(data);
        } else {
          this.errorMessage = 'Có lỗi trong quá trình vấn tin!';
        }
      },
      (err) => {
        console.log(err);
        this.errorMessage = err.error.message;
      },
    );
    this.quanLyVonPhiService.dMDonVi().subscribe(res => {
      if(res.statusCode==0){
        this.donViTaos =res.data;
      }
    })
    //check role cho các nut trinh duyet
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
    this.spinner.hide();
  }

  redirectkehoachvonphi() {
    this.route.navigate(['/qlkh-von-phi/quan-ly-lap-tham-dinh-du-toan-nsnn']);
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

  // call chi tiet bao cao
  getDetailReport() {
    this.spinner.hide();
    this.quanLyVonPhiService.chitietmaubaocao(this.id).subscribe(
      (data) => {
        console.log(data);
        if (data.statusCode == 0) {
          this.chiTietBcaos = data.data;
          this.lstCTietBCao = data.data.lstCTietBCao;
          this.lstCTietBCao.forEach(e => {
            if(e.maVtuParent=='1'){
              this.lstCTietBCao1.push(e);
            }else if(e.maVtuParent=='2'){
              this.lstCTietBCao2.push(e);
            }else{
              this.lstCTietBCao3.push(e);
            }
          })
          this.lstFile = data.data.lstFile;
          this.maLoaiBaocao = '91';
          // set thong tin chung bao cao
          this.ngaynhap = data.data.ngayTao;
          this.nguoinhap = data.data.nguoiTao;
          this.donvitao = data.data.maDvi;
          this.mabaocao = data.data.maBcao;
          this.namBcao = data.data.namBcao;
          this.dotbaocao = data.data.dotBcao;
          this.trangThaiBanGhi = data.data.trangThai;
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
          this.updateEditCache1();
          this.updateEditCache2();
          this.updateEditCache3();
        } else {
          this.errorMessage = 'Có lỗi trong quá trình vấn tin!';
        }
      },
      (err) => {
        console.log(err);
        this.errorMessage = err.error.message;
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
    this.spinner.show();
    this.quanLyVonPhiService.approve(requestGroupButtons).subscribe((data) => {
      if (data.statusCode == 0) {
        this.getDetailReport();
      }
    });
    this.spinner.hide();
  }


  //check all input
  updateAllChecked(): void {
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
      this.lstCTietBCao3 = this.lstCTietBCao3.map((item) => ({
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
      this.lstCTietBCao3 = this.lstCTietBCao3.map((item) => ({
        ...item,
        checked: false,
      }));
    }
  
  }


  // xoa dong
  deleteById1(id: any): void {
    console.log(typeof id);
      this.lstCTietBCao1 = this.lstCTietBCao1.filter((item) => item.id != id);
      if (typeof id == 'number') {
        this.listIdDelete += id + ',';
      }
    
    
  }
  //chọn row cần sửa và trỏ vào template
  startEdit1(id: string): void {
    this.editCache1[id].edit = true;
  }

  addLine1(idx:any): void {

    let item: ItemData = {
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

    this.lstCTietBCao1.splice(idx, 0, item);
    this.editCache1[item.id] = {
      edit: true,
      data: { ...item },
    };
    
  }

   //update khi sửa
   saveEdit1(id: string): void {
    this.editCache1[id].data.checked = this.lstCTietBCao1.find(
      (item) => item.id === id,
    ).checked; // set checked editCache = checked lstCTietBCao
    const index = this.lstCTietBCao1.findIndex((item) => item.id === id); // lay vi tri hang minh sua
    Object.assign(this.lstCTietBCao1[index], this.editCache1[id].data); // set lai data cua lstCTietBCao[index] = this.editCache[id].data
    this.editCache1[id].edit = false; // CHUYEN VE DANG TEXT
  }

  //hủy thao tác sửa update lại giá trị ban đầu
  cancelEdit1(id: string): void {
    const index = this.lstCTietBCao1.findIndex((item) => item.id === id); // lay vi tri hang minh sua
    this.editCache1[id] = {
      data: { ...this.lstCTietBCao1[index] },
      edit: false,
    };
  }

  updateEditCache1(): void {
    this.lstCTietBCao1.forEach((item) => {
      this.editCache1[item.id] = {
        edit: false,
        data: { ...item },
      };
    });
  }


   // xoa dong
   deleteById2(id: any): void {
    console.log(typeof id);
      this.lstCTietBCao2 = this.lstCTietBCao2.filter((item) => item.id != id);
      if (typeof id == 'number') {
        this.listIdDelete += id + ',';
      }
    
    
  }

  

  //chọn row cần sửa và trỏ vào template
  startEdit2(id: string): void {
    this.editCache2[id].edit = true;
  }


  // them dong moi
  addLine2(idx:any): void {

    let item: ItemData = {
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
      maVtuParent:2,
      loai:2,
      checked: false,
    };

    this.lstCTietBCao2.splice(idx, 0, item);
    this.editCache2[item.id] = {
      edit: true,
      data: { ...item },
    };
    
  }

   //update khi sửa
   saveEdit2(id: string): void {
    this.editCache2[id].data.checked = this.lstCTietBCao2.find(
      (item) => item.id === id,
    ).checked; // set checked editCache = checked lstCTietBCao
    const index = this.lstCTietBCao2.findIndex((item) => item.id === id); // lay vi tri hang minh sua
    Object.assign(this.lstCTietBCao2[index], this.editCache2[id].data); // set lai data cua lstCTietBCao[index] = this.editCache[id].data
    this.editCache2[id].edit = false; // CHUYEN VE DANG TEXT
  }

  //hủy thao tác sửa update lại giá trị ban đầu
  cancelEdit2(id: string): void {
    const index = this.lstCTietBCao2.findIndex((item) => item.id === id); // lay vi tri hang minh sua
    this.editCache2[id] = {
      data: { ...this.lstCTietBCao2[index] },
      edit: false,
    };
  }

  updateEditCache2(): void {
    this.lstCTietBCao2.forEach((item) => {
      this.editCache2[item.id] = {
        edit: false,
        data: { ...item },
      };
    });
  }

 // xoa dong
 deleteById3(id: any): void {
  console.log(typeof id);
    this.lstCTietBCao3 = this.lstCTietBCao3.filter((item) => item.id != id);
    if (typeof id == 'number') {
      this.listIdDelete += id + ',';
    }
  
  
}
//chọn row cần sửa và trỏ vào template
startEdit3(id: string): void {
  this.editCache3[id].edit = true;
}

addLine3(idx:any): void {

  let item: ItemData = {
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
      maVtuParent:3,
      loai:3,
      checked: false,
  };

  this.lstCTietBCao3.splice(idx, 0, item);
  this.editCache3[item.id] = {
    edit: true,
    data: { ...item },
  };
  
}

 //update khi sửa
 saveEdit3(id: string): void {
  this.editCache3[id].data.checked = this.lstCTietBCao3.find(
    (item) => item.id === id,
  ).checked; // set checked editCache = checked lstCTietBCao
  const index = this.lstCTietBCao3.findIndex((item) => item.id === id); // lay vi tri hang minh sua
  Object.assign(this.lstCTietBCao3[index], this.editCache3[id].data); // set lai data cua lstCTietBCao[index] = this.editCache[id].data
  this.editCache3[id].edit = false; // CHUYEN VE DANG TEXT
}

//hủy thao tác sửa update lại giá trị ban đầu
cancelEdit3(id: string): void {
  const index = this.lstCTietBCao3.findIndex((item) => item.id === id); // lay vi tri hang minh sua
  this.editCache3[id] = {
    data: { ...this.lstCTietBCao3[index] },
    edit: false,
  };
}

updateEditCache3(): void {
  this.lstCTietBCao3.forEach((item) => {
    this.editCache3[item.id] = {
      edit: false,
      data: { ...item },
    };
  });
}



  //checkox trên tùng row
  updateSingleChecked(): void {
    if ((this.lstCTietBCao1.every((item) => !item.checked)) && (this.lstCTietBCao2.every((item)=> !item.checked)) && (this.lstCTietBCao3.every((item)=> !item.checked))) {
      this.allChecked = false;
      this.indeterminate = true;
    } else if ((this.lstCTietBCao1.every((item) => item.checked)) && (this.lstCTietBCao2.every((item) => item.checked)) && (this.lstCTietBCao3.every((item) => item.checked))) {
      this.allChecked = true;
      this.indeterminate = false;
    } else {
      this.indeterminate = true;
    }
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
    this.lstCTietBCao3.filter((item) => {
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
    this.lstCTietBCao3 = this.lstCTietBCao3.filter(
      (item) => item.checked != true,
    );
    this.allChecked = false;
  }

  // luu
  async luu() {

    this.lstCTietBCao =[];
    await this.lstCTietBCao1.forEach(e => {
      this.lstCTietBCao.push(e);
    })

    await this.lstCTietBCao2.forEach(e => {
      this.lstCTietBCao.push(e);
    })
    await this.lstCTietBCao3.forEach(e =>{
      this.lstCTietBCao.push(e);
    })

    
    this.lstCTietBCao.forEach(e =>{
      if (typeof e.id != 'number') {
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
      fileDinhKems: listFileUploaded,
      listIdDeletes:this.listIdDelete,
      listIdFiles: null,
      lstCTietBCao: this.lstCTietBCao,
      maBcao: this.mabaocao,
      maDvi: this.donvitao ='235',
      maDviCha:'',
      maDviTien:null,
      maLoaiBcao: this.maLoaiBaocao,
      namBcao: this.namBcao,
      namHienHanh:null,
      thangBcao:null,
      trangThai: this.trangThaiBanGhi,
      dotBcao: this.dotbaocao,
      loaiBaoCao:null,
    };
    this.spinner.show();
    console.log(request);

    if (this.id != null) {
      this.quanLyVonPhiService.capnhatbaocao(request).subscribe((res) => {
        if (res.statusCode == 0) {
          this.notification.success('Cập nhật','Cập nhật thành công');
        } else {
          this.notification.error('Cập nhật','Cập nhật thất bại');
        }
      });
    } else {
      this.quanLyVonPhiService.themmoibaocaoketquathuchien(request).subscribe(
        (data) => {
          if(data.statusCode==0){
            this.notification.success('Thêm mới','Thêm mới thành công');
          }else{
            this.notification.error('Thêm mới','Thêm mới thất bại');
          }
        },
        (err) => {
          this.notification.error('Thêm mới','Cập nhật thất bại');
        },
      );
    }
    this.updateEditCache1();
    this.updateEditCache2();
    this.updateEditCache3();
    this.spinner.hide();
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

  
  changeModel1(id: string): void {
    this.editCache1[id].data.ttGiaHtoan = this.editCache1[id].data.soLuongTte * this.editCache1[id].data.dgGiaKhoach;
    this.editCache1[id].data.ttGiaBanTte = this.editCache1[id].data.soLuongTte * this.editCache1[id].data.dgGiaBanTte;
    this.editCache1[id].data.ttClechGiaTteVaGiaHtoan = this.editCache1[id].data.ttGiaBanTte - this.editCache1[id].data.ttGiaHtoan;
  }

  changeModel2(id: string): void {
    this.editCache2[id].data.ttGiaHtoan = this.editCache2[id].data.soLuongTte * this.editCache2[id].data.dgGiaKhoach;
    this.editCache2[id].data.ttGiaBanTte = this.editCache2[id].data.soLuongTte * this.editCache2[id].data.dgGiaBanTte;
    this.editCache2[id].data.ttClechGiaTteVaGiaHtoan = this.editCache2[id].data.ttGiaBanTte - this.editCache2[id].data.ttGiaHtoan;
  }

  changeModel3(id: string): void {
    this.editCache3[id].data.ttGiaHtoan = this.editCache3[id].data.soLuongTte * this.editCache3[id].data.dgGiaKhoach;
    this.editCache3[id].data.ttGiaBanTte = this.editCache3[id].data.soLuongTte * this.editCache3[id].data.dgGiaBanTte;
    this.editCache3[id].data.ttClechGiaTteVaGiaHtoan = this.editCache3[id].data.ttGiaBanTte - this.editCache3[id].data.ttGiaHtoan;
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
        this.lstCTietBCao.forEach(element => {
          if(element.maVtuParent=='1'){
            this.lstCTietBCao1.push(element);
          }else if(element.maVtuParent=='2'){
            this.lstCTietBCao2.push(element);
          }else{
            this.lstCTietBCao3.push(element);
          }
        });
        this.notification.success('Tổng hợp báo cáo','Tổng hợp báo cáo thành công');
        this.updateEditCache1();
        this.updateEditCache2();
      }else{
        this.notification.error('Tổng hợp báo cáo','Có lỗi trong quá trình vấn tin!');
      }
    },err=>{
      this.notification.error('Tổng hợp báo cáo','Có lỗi trong quá trình vấn tin!');
    })
  }
}
