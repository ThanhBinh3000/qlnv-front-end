import { DatePipe, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import * as fileSaver from 'file-saver';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { GiaoDuToanChiService } from 'src/app/services/quan-ly-von-phi/giaoDuToanChi.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { GDT, Utils } from 'src/app/Utility/utils';
import { GIAO_DU_TOAN, MAIN_ROUTE_DU_TOAN, MAIN_ROUTE_KE_HOACH } from '../../giao-du-toan-chi-nsnn.constant';


export class ItemCongVan {
  fileName: string;
  fileSize: number;
  fileUrl: number;
}

@Component({
  selector: 'app-nhap-thong-tin-quyet-toan-giao-du-toan-chi-NSNN-cho-cac-don-vi',
  templateUrl: './nhap-thong-tin-quyet-toan-giao-du-toan-chi-NSNN-cho-cac-don-vi.component.html',
  styleUrls: ['./nhap-thong-tin-quyet-toan-giao-du-toan-chi-NSNN-cho-cac-don-vi.component.scss']
})
export class NhapThongTinQuyetToanGiaoDuToanChiNSNNChoCacDonViComponent implements OnInit {
  //thong tin nguoi dang nhap
  id!: any;
  userInfo: any;
  //thong tin chung bao cao
  lstMa: any[] = [];
  maGiao: string;
  ngayTao: string;
  maDviTao: string;
  soQd: ItemCongVan;
  maPa: string;
  namGiao: number;
  newDate = new Date();
  //cac danh muc
  donVis: any[] = [];
  phuongAns: any[] = [];
  //file
  fileDetail: NzUploadFile;
  status: boolean = false;
  //file
  lstFiles: any[] = []; //show file ra man hinh
  listFile: File[] = [];                      // list file chua ten va id de hien tai o input
  fileList: NzUploadFile[] = [];
  //beforeUpload: any;
  listIdFilesDelete: any = [];                        // id file luc call chi tiet
  // before uploaf file
  beforeUploadCV = (file: NzUploadFile): boolean => {
    this.fileDetail = file;
    this.soQd = {
      fileName: file.name,
      fileSize: null,
      fileUrl: null,
    };
    return false;
  };

  // before upload file
  beforeUpload = (file: NzUploadFile): boolean => {
    this.fileList = this.fileList.concat(file);
    return false;
  };
  // them file vao danh sach
  handleUpload(): void {
    this.fileList.forEach((file: any) => {
      const id = file?.lastModified.toString();
      this.lstFiles.push({
        id: id,
        fileName: file?.name,
        fileSize: file?.size,
        fileUrl: file?.url
      });
      this.listFile.push(file);
    });
    this.fileList = [];
  }
  constructor(
    private userService: UserService,
    private router: Router,
    private routerActive: ActivatedRoute,
    private quanLyVonPhiService: QuanLyVonPhiService,
    private giaoDuToanChiService: GiaoDuToanChiService,
    private danhMuc: DanhMucHDVService,
    private datePipe: DatePipe,
    private sanitizer: DomSanitizer,
    private notification: NzNotificationService,
    private location: Location,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
  ) {
    // this.namgiao = this.currentYear.getFullYear();
  }

  async ngOnInit() {
    this.spinner.show()
    this.id = this.routerActive.snapshot.paramMap.get('id');
    this.userInfo = this.userService.getUserLogin();
    this.maDviTao = this.userInfo?.MA_DVI;

    this.ngayTao = this.datePipe.transform(this.newDate, Utils.FORMAT_DATE_STR);
    this.namGiao = this.newDate.getFullYear();
    this.giaoDuToanChiService.maPhuongAnGiao('1').toPromise().then(
      (res) => {
        if (res.statusCode == 0) {
          this.maGiao = res.data;
        } else {
          this.notification.error(MESSAGE.ERROR, res?.msg);
        }
      },
      (err) => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      },
    );
    this.getPhuongAn();
    this.spinner.hide()
  }

  //get user info
  async getUserInfo(username: string) {
    await this.userService.getUserInfo(username).toPromise().then(
      (data) => {
        if (data?.statusCode == 0) {
          this.userInfo = data?.data
          return data?.data;
        } else {
          this.notification.error(MESSAGE.ERROR, data?.msg);
        }
      },
      (err) => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
      }
    );
  }

  async getPhuongAn() {
    await this.giaoDuToanChiService.timKiemMaPaGiaoNSNN().toPromise().then(
      (data) => {
        if (data.statusCode == 0) {
          this.lstMa = data.data
          this.lstMa.forEach(e => {
            this.phuongAns.push(e.maPa)
          })
          // this.phuongAns = data.data;
        } else {
          this.notification.error(MESSAGE.ERROR, data?.msg);
        }
      },
      err => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      },
    );
  }

  //download file về máy tính
  async downloadFileCv() {
    if (this.soQd?.fileUrl) {
      await this.quanLyVonPhiService.downloadFile(this.soQd?.fileUrl).toPromise().then(
        (data) => {
          fileSaver.saveAs(data, this.soQd?.fileName);
        },
        err => {
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        },
      );
    } else {
      let file: any = this.fileDetail;
      const blob = new Blob([file], { type: "application/octet-stream" });
      fileSaver.saveAs(blob, file.name);
    }
  }
  // xoa file trong bang file
  deleteFile(id: string): void {
    this.lstFiles = this.lstFiles.filter((a: any) => a.id !== id);
    this.listFile = this.listFile.filter((a: any) => a?.lastModified.toString() !== id);
    this.listIdFilesDelete.push(id);
  }

  //download file về máy tính
  async downloadFile(id: string) {
    let file!: File;
    file = this.listFile.find(element => element?.lastModified.toString() == id);
    if (!file) {
      let fileAttach = this.lstFiles.find(element => element?.id == id);
      if (fileAttach) {
        await this.quanLyVonPhiService.downloadFile(fileAttach.fileUrl).toPromise().then(
          (data) => {
            fileSaver.saveAs(data, fileAttach.fileName);
          },
          err => {
            this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
          },
        );
      }
    } else {
      const blob = new Blob([file], { type: "application/octet-stream" });
      fileSaver.saveAs(blob, file.name);
    }
  }

  //upload file
  async uploadFile(file: File) {
    // day file len server
    const upfile: FormData = new FormData();
    upfile.append('file', file);
    upfile.append('folder', this.maPa + '/' + this.maDviTao);
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
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      },
    );
    return temp;
  }

  //luu
  async luu() {
    if (!this.soQd.fileName || !this.maPa) {
      this.notification.warning(MESSAGE.WARNING, "Vui lòng nhập đầy đủ số QĐ và mã phương án");
      return;
    }
    //get list file url
    //get list file url
    let checkFile = true;
    for (const iterator of this.listFile) {
      if (iterator.size > Utils.FILE_SIZE) {
        checkFile = false;
      }
    }
    if (!checkFile) {
      this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.OVER_SIZE);
      return;
    }
    let listFile: any = [];
    for (const iterator of this.listFile) {
      listFile.push(await this.uploadFile(iterator));
    }

    let request = JSON.parse(JSON.stringify({
      id: this.id,
      namDtoan: this.namGiao,
      maPa: this.maPa,
      soQd: this.soQd,
      fileDinhKems: listFile,
      listIdFiles: this.listIdFilesDelete,                      // id file luc get chi tiet tra ra( de backend phuc vu xoa file)
      maGiao: this.maGiao,
    }))
    //get file cong van url
    let file: any = this.fileDetail;
    if (file) {
      if (file.size > Utils.FILE_SIZE) {
        this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.OVER_SIZE);
        return;
      } else {
        request.soQd = await this.uploadFile(file);
      }
    }
    if (file) {
      request.soQd = await this.uploadFile(file);
    }
    if (!request.soQd) {
      this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.DOCUMENTARY);
      return;
    }
    if (!this.id) {
      this.giaoDuToanChiService.themMoiQdCvGiaoNSNN(request).toPromise().then(async data => {
        if (data.statusCode == 0) {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
          this.xemphuongan()
        } else {
          this.notification.error(MESSAGE.ERROR, data?.msg);
        }
      }, err => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR)
      })
    }
  }
  checkViewReport() {
    return this.userService.isAccessPermisson(GDT.VIEW_REPORT_PA_PBDT);
  }

  //xem thong tin PA
  xemphuongan() {
    let CtietPA = this.lstMa.filter((a: any) => a.maPa == this.maPa)
    this.router.navigate([
      MAIN_ROUTE_KE_HOACH + '/' + MAIN_ROUTE_DU_TOAN + '/' + GIAO_DU_TOAN + '/xay-dung-phuong-an-giao-du-toan-chi-NSNN-cho-cac-don-vi/' + CtietPA[0].id
    ])
  }

  dong() {
    // this.router.navigate(['/'])
    this.location.back()
  }

}
