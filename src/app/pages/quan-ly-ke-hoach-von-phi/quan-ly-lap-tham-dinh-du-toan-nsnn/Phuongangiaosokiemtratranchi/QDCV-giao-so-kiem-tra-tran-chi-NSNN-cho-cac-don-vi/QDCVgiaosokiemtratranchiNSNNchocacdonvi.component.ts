import { DatePipe } from '@angular/common';
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
  lstFile: any[] = [];
  listFile: File[] = [];
  fileUrl: any;
  fileList: NzUploadFile[] = [];
  fileToUpload!: File;
  listPhuongAn:any[];
  length:number =0;
  msg:string='';
  constructor(
    private userService: UserService,
     private router: Router,
     private quankhoachvon :QuanLyVonPhiService,
     private danhmuc :DanhMucHDVService,
     private datepipe:DatePipe,
     private sanitizer: DomSanitizer,
     private notification: NzNotificationService,
     ) {
    this.namgiao = this.currentYear.getFullYear();
  }

  ngOnInit() {
    let username = this.userService.getUserName();
    this.getUserInfo(username);
    this.quankhoachvon.dMDonVi().subscribe(res => {
      this.donviTaos = res.data;
      console.log(this.donviTaos);
    })
    this.danhmuc.dmDonViNhan().subscribe(res =>{
      this.listDvi= res.data.content;
      console.log(res)
    })
    this.quankhoachvon.danhsachphuonganduocduyet().subscribe(res => {
      if(res.statusCode==0){
        this.listPhuongAn = res.data;

      }else{
        this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
      }
    },err => {
      this.notification.error(MESSAGE.ERROR,MESSAGE.SYSTEM_ERROR)
    })
  }

  //get infor user
  async getUserInfo(username: any) {
    await this.userService.getUserInfo(username).subscribe(
      (data) => {
        if (data?.statusCode == 0) {
          this.donvitao = data?.data.dvql;
          this.nguoinhap = data?.data.username;
          console.log(data)
        } else {
        }
      },
      (err) => {
        console.log(err);
      },
    );
  }



//xoa
xoaquyetdinh(){

  let objectXoa={

      fileDinhKems:[],
      listIdFiles: null,
      maDvi: null,
      maDviNhan: null,
      maPa: this.mapa,
      namGiao: null,
      ngayCv: null,
      ngayQd: null,
      nguoiTao: null,
      soCv: null,
      soQd: null,
  }
  console.log(objectXoa);
  this.quankhoachvon.xoaquyetdinhcongvan(objectXoa).subscribe(res => {
    if(res.statusCode==0){
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
showcongvan(){
  var id = this.mapa;
  this.listPhuongAn.forEach(e => {
    if(id ==e.maPa){
      id=e.id
    }
  })
  this.quankhoachvon.chitietPhuongAn(id).subscribe(res => {
    if(res.statusCode==0){
      var ob = res.data;
      this.soCv = ob.soCv;
      this.soQd = ob.soQd;
      console.log(res);
    }else{
      this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
    }
  },err => {
    this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
  })
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
      soCv:this.soCv,
      soQd:this.soQd
    }
    console.log(request);
    this.quankhoachvon.nhapsoqdcv(request).subscribe(res => {
      console.log(res);
      if(res.statusCode==0){
        this.notification.success('Lưu QĐ-CV','Lưu thành công');
      }else{
        this.notification.error('Lưu QĐ-CV','Có lỗi xảy ra vui lòng thử lại sau');
      }

    },err => {
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR)
    })
  }



  //xem thong tin PA
  xemphuongan(){
    var id = this.mapa;
    if(id!=undefined){
      this.listPhuongAn.forEach(e => {
        if(id ==e.maPa){
          id=e.id
        }
      })
      this.router.navigate(['/qlkh-von-phi/quan-ly-lap-tham-dinh-du-toan-nsnn/xay-dung-phuong-an-giao-so-kiem-tra-tran-chi-nsnn-cho-cac-don-vi/'+id])
    }

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
      this.router.navigate(['/'])
  }

}
