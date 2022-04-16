import { DatePipe, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { Utils } from 'src/app/Utility/utils';
import * as fileSaver from 'file-saver';
import { DomSanitizer } from '@angular/platform-browser';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MESSAGE } from 'src/app/constants/message';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';

@Component({
  selector: 'app-QDCVgiaosokiemtratranchiNSNNchocacdonvi',
  templateUrl: './QDCVgiaosokiemtratranchiNSNNchocacdonvi.component.html',
  styleUrls: ['./QDCVgiaosokiemtratranchiNSNNchocacdonvi.component.scss']
})
export class QDCVgiaosokiemtratranchiNSNNchocacdonviComponent implements OnInit {

  ngaynhap:any;
  nguoinhap:any;
  donvitao:any;
  donvinhan:any;
  soQd:any;
  ngayQd:any;
  soCv:any;
  ngayCv:any;
  mapa:any;
  namgiao:any;
  currentYear: Date = new Date();
  listDvi:any[]=[];
  donviTaos:any []=[];
  listDonViNhan:any []=[];
  lstFile: any[] = [];
  listFile: File[] = [];
  fileUrl: any;
  fileList: NzUploadFile[] = [];
  fileToUpload!: File;
  listPhuongAn:any[];
  length:number =0;
  msg:string='';
  validateForm!: FormGroup;   
  message:any =MESSAGEVALIDATE;

  constructor(
    private userService: UserService,
     private router: Router,
     private quankhoachvon :QuanLyVonPhiService,
     private danhmuc :DanhMucHDVService,
     private datepipe:DatePipe,
     private sanitizer: DomSanitizer,
     private notification: NzNotificationService,
     private location: Location,
     private fb: FormBuilder
     ) {
    // this.namgiao = this.currentYear.getFullYear();
  }

  ngOnInit() {
    this.validateForm = this.fb.group({
      ngaynhap: [null,[Validators.required]],
      donvitao:[null, [Validators.required]],
      // donvinhan:[null, [Validators.required]],
      soQd:[null, [Validators.required]],
      ngayQd:[null, [Validators.required]],
      soCv:[null, [Validators.required]],
      ngayCv:[null, [Validators.required]],
      mapa:[null, [Validators.required]],
      namgiao:[null,[Validators.pattern('^[12][0-9]{3}$')]],
      temp: [null],
    });
    let username = this.userService.getUserName();
    this.getUserInfo(username);
    this.quankhoachvon.dMDonVi().toPromise().then(res => {
      this.donviTaos = res.data;
    })
    this.danhmuc.dmDonViNhan().toPromise().then(res =>{
      this.listDvi= res.data.content;
    })
    
  }

  //get infor user
  async getUserInfo(username: any) {
    await this.userService.getUserInfo(username).subscribe(
      (data) => {
        if (data?.statusCode == 0) {
          this.nguoinhap = data?.data.username;
        } else {
          this.notification.error(MESSAGE.ERROR, data?.smg);
        }
      },
      (err) => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      },
    );
  }

  submitForm(){
    if (this.validateForm.valid) {
      return true;
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return false;
    }
  }

//chọn đơn vị tạo => các đơn vị nhận
chonDonviTao(maDonVi:any){
  if(maDonVi){
    var donVi = this.donviTaos.find( item=> item.id==maDonVi)?.maDvi;
    let objectDonViThuocQuanLy={
      capDvi: null,
      kieuDvi: null,
      loaiDvi: null,
      maDvi: donVi,
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
        console.log(res);
        this.listDonViNhan = res.data;
      }
    })

    let obdCallDanhSachDuocDuyet={
      maDvi:donVi,
    }
    this.quankhoachvon.danhsachphuonganduocduyet(obdCallDanhSachDuocDuyet).subscribe(res => {
      if(res.statusCode==0){
        console.log(res);
        this.listPhuongAn = res.data;
      }else{
        this.notification.error(MESSAGE.ERROR, res?.msg);
      }
    },err => {
      this.notification.error(MESSAGE.ERROR,MESSAGE.SYSTEM_ERROR)
    })
  }
  
}

//xoa
xoaquyetdinh(){
  var idPa = this.listPhuongAn.find( item => item.maPa == this.mapa)?.id;
  
  this.quankhoachvon.xoaquyetdinhcongvan(idPa).subscribe(res => {
    if(res.statusCode==0){
      this.showcongvan(this.mapa)
      this.msg = 'Xóa thành công';
      this.notification.success('Xóa QĐ-CV',this.msg)

    }else{
      this.notification.error('Xóa QĐ-CV','Có lỗi xảy ra vui lòng thử lại sau');
    }

  },err => {
    this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
  })
}

//view so quyet dinh va cv
showcongvan(maPa:any){
  
  if(this.mapa!=undefined){
    // var idPa = this.listPhuongAn.find( item => item.maPa == maPa)?.id;
  this.quankhoachvon.chitietPhuongAn(maPa).subscribe(res => {
    if(res.statusCode==0){
      var ob = res.data;
      this.soCv = ob.soCv;
      this.soQd = ob.soQd;
    }else{
      this.notification.error(MESSAGE.ERROR, res?.msg);
    }
  },err => {
    this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
  })
}
}
//luu
async luu(){

  // lay id file dinh kem (gửi file theo danh sách )
    let listFileUploaded:any =[];
    for (const iterator of this.listFile) {
        listFileUploaded.push(await this.uploadFile(iterator));
    }
    let request ={
      fileDinhKems:listFileUploaded,
      listIdFiles:"",
      maDvi:this.donvitao,
      maDviNhan:this.donvinhan,
      maPa:this.mapa,
      namGiao:this.namgiao,
      ngayCv:this.ngayCv,
      ngayQd:this.ngayQd,
      soCv:this.soCv,
      soQd:this.soQd
    }
    
    if(this.validateForm.valid){
      this.quankhoachvon.nhapsoqdcv(request).subscribe(res => {
        if(res.statusCode==0){
          this.notification.success('Lưu QĐ-CV','Lưu thành công');
        }else{
          this.notification.error('Lưu QĐ-CV','Có lỗi xảy ra vui lòng thử lại sau');
        }
  
      },err => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR)
      })
    }else{
      return;
    }
    
  }



  //xem thong tin PA
  xemphuongan(){
      this.router.navigate(['/qlkh-von-phi/quan-ly-lap-tham-dinh-du-toan-nsnn/xay-dung-phuong-an-giao-so-kiem-tra-tran-chi-nsnn-cho-cac-don-vi/'+this.mapa])
      }
  //lay ten don vi tạo
  getUnitName(mdv:any):string {
    return this.donviTaos.find((item) => item.maDvi == this.donvitao)?.tenDvi;
  }

  //get trạng thai
  getStatusName(trangthai:any):string {
    const utils = new Utils();
    return utils.getStatusName(trangthai);
  }

  //upload file
  async uploadFile(file: File) {
    // day file len server
    const upfile: FormData = new FormData();
    upfile.append('file', file);
    upfile.append('folder', this.mapa + '/' + this.donvitao + '/');
    let temp = await this.quankhoachvon.uploadFile(upfile).toPromise().then(
        (data) => {
            let objfile ={
                fileName:data.filename,
                fileSize:data.size,
                fileUrl:data.url,
            }
            return objfile;
        },
        err => {
            console.log('false :', err);
        },
    );
    return temp;
  }


    // xoa file trong bang file
  deleteFile(id: string): void {
    this.lstFile = this.lstFile.filter((a: any) => a.id !== id);
    this.listFile = this.listFile.filter(
      (a: any) => a?.lastModified.toString() !== id,
    );
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


  //
  dong(){
      // this.router.navigate(['/'])
      this.location.back()
  }

}
