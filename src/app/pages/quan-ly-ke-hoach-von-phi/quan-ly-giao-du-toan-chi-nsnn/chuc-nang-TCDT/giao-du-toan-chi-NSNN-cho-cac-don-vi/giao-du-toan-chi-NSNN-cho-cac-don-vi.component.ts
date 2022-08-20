import { DatePipe, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import * as fileSaver from 'file-saver';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { DON_VI_TIEN, LA_MA, TRANG_THAI_GIAO, Utils } from 'src/app/Utility/utils';
import { NOI_DUNG } from './giao-du-toan-chi-NSNN-cho-cac-don-vi.constant';

export class ItemData {
  id: any;
  stt: string;
  level: number;
  maNdung: string;
  soTien: number;
}

export class ItemCongVan {
  fileName: string;
  fileSize: number;
  fileUrl: number;
}

export const TRANG_THAI_GIAO_DU_TOAN = [
  {
    id: '0',
    tenDm: "Chưa giao",
  },
  {
    id: '1',
    tenDm: "Đã giao",
  },
  {
    id: '2',
    tenDm: "Đã nhận",
  },
]
@Component({
  selector: 'app-giao-du-toan-chi-NSNN-cho-cac-don-vi',
  templateUrl: './giao-du-toan-chi-NSNN-cho-cac-don-vi.component.html',
  styleUrls: ['./giao-du-toan-chi-NSNN-cho-cac-don-vi.component.scss']
})
export class GiaoDuToanChiNSNNChoCacDonViComponent implements OnInit {
  //thong tin dang nhap
  id!: any;
  userInfo: any;
  //thong tin chung bao cao
  ngayNhap: string;
  maBaoCao: string;
  soQd: ItemCongVan;
  maDviTao: string;
  maPa: string;
  maGiao: string;
  trangThai: string;
  namDtoan: number;
  maDviTien: any;
  newDate = new Date();
  tenDvi: string;
  maDviNhan: string;
  //danh muc
  donViTiens: any[] = DON_VI_TIEN;
  lstCtietBcao: ItemData[] = [];
  donVis: any[] = [];
  trangThais: any[] = TRANG_THAI_GIAO_DU_TOAN;
  noiDungs: any[] = NOI_DUNG;
  soLaMa: any[] = LA_MA;
  //file
  fileDetail: NzUploadFile;

  constructor(
    private userService: UserService,
    private quanLyVonPhiService: QuanLyVonPhiService,
    private spinner: NgxSpinnerService,
    private routerActive: ActivatedRoute,
    private datepipe: DatePipe,
    private sanitizer: DomSanitizer,
    private router: Router,
    private notification: NzNotificationService,
    private location: Location,
    private danhMucService: DanhMucHDVService,
  ) { }

  async ngOnInit() {
    this.spinner.show()
    this.id = this.routerActive.snapshot.paramMap.get('id');
    const userName = this.userService.getUserName();
    await this.getUserInfo(userName); //get user info

    //lay danh sach danh muc
    this.danhMucService.dMDonVi().toPromise().then(
      data => {
        if (data.statusCode == 0) {
          this.donVis = data?.data;
        } else {
          this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
        }
      },
      err => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
    );

    if (this.id) {
      this.getDetailReport();
    }

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
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
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
      const file: any = this.fileDetail;
      const blob = new Blob([file], { type: "application/octet-stream" });
      fileSaver.saveAs(blob, file.name);
    }
  }

  // call chi tiet bao cao
  async getDetailReport() {
    this.spinner.show();
    await this.quanLyVonPhiService.QDGiaoChiTiet(this.id, "1").toPromise().then(
      async (data) => {
        if (data.statusCode == 0) {
          this.lstCtietBcao = data.data.lstCtiets;
          this.sortByIndex();
          this.soQd = data.data.soQd;
          this.maPa = data.data.maPa;
          this.maGiao = data.data.maGiao;
          this.namDtoan = data.data.namDtoan;
          this.ngayNhap = this.datepipe.transform(data.data.ngayTao, Utils.FORMAT_DATE_STR);
          this.maDviTao = data.data.maDvi;
          this.maDviNhan = data.data.maDviNhan;
          // this.trangThai = data.data.trangThai;

          this.tenDvi = this.donVis.find((item) => item.maDvi == data.data.maDvi)?.tenDvi;

          this.trangThai = this.trangThais.find(e => e.id == data.data.trangThai)?.tenDm;

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

  redirectkehoachvonphi() {
    // this.route.navigate(['/qlkh-von-phi/quan-ly-lap-tham-dinh-du-toan-nsnn']);
    this.location.back()
  }


  // chuyển đổi stt đang được mã hóa thành dạng I, II, a, b, c, ...
  getChiMuc(str: string): string {
    str = str.substring(str.indexOf('.') + 1, str.length);
    let xau = "";
    const chiSo: any = str.split('.');
    const n: number = chiSo.length - 1;
    let k: number = parseInt(chiSo[n], 10);
    if (n == 0) {
      for (let i = 0; i < this.soLaMa.length; i++) {
        while (k >= this.soLaMa[i].gTri) {
          xau += this.soLaMa[i].kyTu;
          k -= this.soLaMa[i].gTri;
        }
      }
    }
    if (n == 1) {
      xau = chiSo[n];
    }
    if (n == 2) {
      xau = chiSo[n - 1].toString() + "." + chiSo[n].toString();
    }
    if (n == 3) {
      xau = String.fromCharCode(k + 96);
    }
    if (n == 4) {
      xau = "-";
    }
    return xau;
  }

  // lấy phần đầu của số thứ tự, dùng để xác định phần tử cha
  getHead(str: string): string {
    return str.substring(0, str.lastIndexOf('.'));
  }
  // lấy phần đuôi của stt
  getTail(str: string): number {
    return parseInt(str.substring(str.lastIndexOf('.') + 1, str.length), 10);
  }

  sortByIndex() {
    this.setDetail();
    this.lstCtietBcao.sort((item1, item2) => {
      if (item1.level > item2.level) {
        return 1;
      }
      if (item1.level < item2.level) {
        return -1;
      }
      if (this.getTail(item1.stt) > this.getTail(item2.stt)) {
        return -1;
      }
      if (this.getTail(item1.stt) < this.getTail(item2.stt)) {
        return 1;
      }
      return 0;
    });
    const lstTemp: any[] = [];
    this.lstCtietBcao.forEach(item => {
      const index: number = lstTemp.findIndex(e => e.stt == this.getHead(item.stt));
      if (index == -1) {
        lstTemp.splice(0, 0, item);
      } else {
        lstTemp.splice(index + 1, 0, item);
      }
    })

    this.lstCtietBcao = lstTemp;
  }

  setDetail() {
    this.lstCtietBcao.forEach(item => {
      item.level = this.noiDungs.find(e => e.id == item.maNdung)?.level;
    })
  }


  //lay ten don vi tạo
  getUnitName() {
    return this.donVis.find((item) => item.maDvi == this.maDviNhan)?.tenDvi;
  }


  getStatusName() {
    return this.trangThais.find(e => e.id == this.trangThai)?.tenDm;
  }


}
