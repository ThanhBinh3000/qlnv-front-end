import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { AMOUNT, DON_VI_TIEN, GDT, LA_MA, MONEY_LIMIT, TRANG_THAI_TIM_KIEM, Utils } from 'src/app/Utility/utils';
import { NOI_DUNG } from './tao-moi-quyet-dinh-btc.constant';
import { Globals } from 'src/app/shared/globals';
import { GiaoDuToanChiService } from 'src/app/services/quan-ly-von-phi/giaoDuToanChi.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { MESSAGE } from 'src/app/constants/message';
import * as fileSaver from 'file-saver';
// import { DialogThemKhoanMucComponent } from 'src/app/components/dialog/dialog-them-khoan-muc/dialog-them-khoan-muc.component';
import * as uuid from 'uuid';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { UserService } from 'src/app/services/user.service';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { DialogCopyGiaoDuToanComponent } from 'src/app/components/dialog/dialog-copy-giao-du-toan/dialog-copy-giao-du-toan.component';
import { DialogCopyComponent } from 'src/app/components/dialog/dialog-copy/dialog-copy.component';
import { DialogThemKhoanMucComponent } from '../dialog-them-khoan-muc/dialog-them-khoan-muc.component';
import { displayNumber, exchangeMoney } from 'src/app/Utility/func';

export class ItemData {
  id!: any;
  stt: any;
  level: number;
  maNdung: number;
  idKm: number;
  tongCong: number;
  nguonNsnn: number;
  nguonKhac: number;
  checked!: boolean;
}

export class ItemDvi {
  id: any;
  maDviNhan: string;
  soTranChi: number;
  trangThai: string;
}

export class ItemCongVan {
  fileName: string;
  fileSize: number;
  fileUrl: number;
}

@Component({
  selector: 'app-tao-moi-quyet-dinh-btc',
  templateUrl: './tao-moi-quyet-dinh-btc.component.html',
  styleUrls: ['./tao-moi-quyet-dinh-btc.component.scss']
})

export class TaoMoiQuyetDinhBtcComponent implements OnInit {
  @Input() data;
  // @Input() isStatus;
  @Output() dataChange = new EventEmitter();

  id: string;
  userInfo: any;
  //thong tin chung bao cao
  userRole: string; // role người dùng
  ngayTao: string;
  maDonViTao: string;
  maPa: string;
  maPaCha: string;
  lstDvi: any[] = [];                                         //danh sach don vi da duoc chon
  namPa: any;
  soQd: ItemCongVan = new ItemCongVan();
  isStatus: any;
  newDate = new Date();
  maDviTien: string;
  thuyetMinh: string;
  maLoai = '2';
  //danh muc
  lstCtietBcao: ItemData[] = [];
  donVis: any[] = [];
  noiDungs: any[] = NOI_DUNG;
  donViTiens: any[] = DON_VI_TIEN;
  trangThais: any[] = TRANG_THAI_TIM_KIEM;
  soLaMa: any[] = LA_MA;
  initItem: ItemData = {
    id: null,
    stt: "0",
    level: null,
    maNdung: 0,
    idKm: null,
    tongCong: null,
    nguonNsnn: null,
    nguonKhac: null,
    checked: false,
  };
  total: ItemData = {
    id: null,
    stt: "0",
    level: null,
    maNdung: 0,
    idKm: null,
    tongCong: null,
    nguonNsnn: null,
    nguonKhac: null,
    checked: false,
  };
  //trang thai cac nut
  status = false;
  statusBtnSave: boolean;
  statusBtnNew: boolean;
  statusBtnEdit: boolean;
  statusBtnCopy: boolean;
  statusBtnPrint: boolean;
  allChecked = false;

  //khac
  editCache: { [key: string]: { edit: boolean; data: ItemData } } = {}; // phuc vu nut chinh
  listId = '';
  lstFiles: any[] = []; //show file ra man hinh
  //file
  listFile: File[] = [];                      // list file chua ten va id de hien tai o input
  fileList: NzUploadFile[] = [];
  fileDetail: NzUploadFile;
  //beforeUpload: any;
  listIdFilesDelete: any = [];                        // id file luc call chi tiet
  editMoneyUnit = false;
  isDataAvailable = false;
  amount = AMOUNT;
  // before uploaf file
  beforeUpload = (file: NzUploadFile): boolean => {
    this.fileList = this.fileList.concat(file);
    return false;
  };

  // them file vao danh sach
  handleUpload(): void {
    this.fileList.forEach((file: any) => {
      const id = file?.lastModified.toString();
      this.lstFiles.push({ id: id, fileName: file?.name, fileUrl: file?.url, fileSize: file?.size });
      this.listFile.push(file);
    });
    this.fileList = [];
  }

  // before upload file so quyet dinh
  beforeUploadSoQuyetDinh = (file: NzUploadFile): boolean => {
    this.fileDetail = file;
    this.soQd = {
      fileName: file.name,
      fileSize: null,
      fileUrl: null,
    };
    return false;
  };

  constructor(
    private spinner: NgxSpinnerService,
    private datePipe: DatePipe,
    private notification: NzNotificationService,
    private modal: NzModalService,
    public globals: Globals,
    public giaoDuToanChiService: GiaoDuToanChiService,
    public quanLyVonPhiService: QuanLyVonPhiService,
    private userService: UserService,
    private danhMuc: DanhMucHDVService,
  ) { }

  ngOnInit() {
    this.action('init');
  };

  async action(code: string) {
    this.spinner.show();
    this.isDataAvailable = false;
    switch (code) {
      case 'init':
        await this.initialization().then(() => {
          this.isDataAvailable = true;
        });
        break;
      case 'save':
        await this.save().then(() => {
          this.isDataAvailable = true;
        })
        break;
      case 'detail':
        await this.getDetailReport().then(() => {
          this.isDataAvailable = true;
        });
        break;
      default:
        break;
    }
    this.spinner.hide();
  };


  async initialization() {
    this.id = this.data?.id;
    this.userInfo = this.userService.getUserLogin();
    console.log(this.userInfo);

    this.maDonViTao = this.userInfo?.MA_DVI;
    await this.danhMuc.dMDonVi().toPromise().then(
      data => {
        if (data.statusCode == 0) {
          this.donVis = data.data;
        } else {
          this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
        }
      },
      err => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
    );
    if (this.id) {
      await this.getDetailReport();
    } else {
      this.isStatus = this.data.isStatus;
      this.maDonViTao = this.userInfo?.MA_DVI;
      this.lstDvi = this.donVis.filter(e => e?.maDviCha === this.maDonViTao && (e.type === "DV"));
      this.ngayTao = this.datePipe.transform(this.newDate, Utils.FORMAT_DATE_STR);
      this.maDviTien = '1';
      this.spinner.show();

      this.namPa = this.data?.namPa;

      this.giaoDuToanChiService.maPhuongAnGiao(this.maLoai).toPromise().then(
        (res) => {
          if (res.statusCode == 0) {
            this.maPa = res.data;
            const sub = "BTC";
            this.maPa = this.maPa.slice(0, 2) + sub + this.maPa.slice(2);
          } else {
            this.notification.error(MESSAGE.ERROR, res?.msg);
          }
        },
        (err) => {
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        },
      );
      // this.namPa = this.newDate.getFullYear();
      this.spinner.hide()
    }

    if (this.lstCtietBcao.length == 0) {
      this.noiDungs.forEach(e => {
        this.lstCtietBcao.push({
          ...new ItemData(),
          id: uuid.v4() + 'FE',
          stt: e.ma,
          maNdung: e.ma,
          idKm: e.id
        })
      })
      this.setLevel();
    } else if (!this.lstCtietBcao[0]?.stt) {
      this.lstCtietBcao.forEach(item => {
        item.stt = item.maNdung;
      })
    }
    this.sortByIndex();
    const capDvi = this.donVis.find(e => e.maDvi == this.userInfo?.MA_DVI)?.capDvi;
    if (capDvi != Utils.TONG_CUC) {
      this.statusBtnSave = true;
      this.statusBtnNew = true;
      this.statusBtnCopy = true;
      this.statusBtnPrint = true;
      this.status = true;
    }
    this.getStatusButton();
    this.updateEditCache();
    this.spinner.hide();
  };

  setLevel() {
    this.lstCtietBcao.forEach(item => {
      const str: string[] = item.stt.split('.');
      item.level = str.length - 2;
    })
  }

  getIdCha(maKM: any) {
    return this.noiDungs.find(e => e.ma == maKM)?.maCha;
  }

  getStatusButton() {
    if (this.id && this.userService.isAccessPermisson(GDT.ADD_REPORT_PA_PBDT)) {
      this.status = true;
    } else {
      this.status = false;
    }
    const checkChirld = this.maDonViTao == this.userInfo?.MA_DVI;

    this.statusBtnSave = !(Utils.statusSave.includes(this.isStatus) && this.userService.isAccessPermisson(GDT.EDIT_REPORT_BTC) && checkChirld);

    if (this.id) {
      this.statusBtnSave = true;
    }
    if (!this.id) {
      this.statusBtnNew = true;
      this.statusBtnEdit = true;
    } else {
      if (this.lstCtietBcao.length > 0) {
        this.statusBtnNew = false;
        this.statusBtnEdit = true;
      } else {
        this.statusBtnNew = true;
        this.statusBtnEdit = false;
      }
    }
    // this.statusBtnCopy = utils.getRoleCopy(this.isStatus, checkChirld, this.userInfo?.roles[0]?.code);

    this.statusBtnCopy = !(Utils.statusCopy.includes(this.isStatus) && this.userService.isAccessPermisson(GDT.COPY_REPORT_PA_PBDT) && checkChirld);
    this.statusBtnPrint = !(Utils.statusPrint.includes(this.isStatus) && this.userService.isAccessPermisson(GDT.PRINT_REPORT_PA_PBDT) && checkChirld);

    if (this.userInfo.sub == "lanhdaotc" || this.userInfo.sub == "truongbophantc") {
      this.statusBtnSave = true;
      this.statusBtnNew = true;
      this.statusBtnCopy = true;
      this.statusBtnPrint = true;
      this.status = true;
    }


    if (!this.userService.isAccessPermisson(GDT.ADD_REPORT_CV_QD_GIAO_PA_PBDT)) {
      this.statusBtnNew = true;
    }
  };

  async getDetailReport() {
    this.spinner.show();
    await this.giaoDuToanChiService.QDGiaoChiTiet(this.id, this.maLoai).toPromise().then(
      async (data) => {
        if (data.statusCode == 0) {
          this.id = data.data.id;
          this.lstCtietBcao = data.data.lstCtiets[0];
          this.maDviTien = data.data.maDviTien;
          this.sortByIndex();
          // this.lstCtietBcao.forEach(item => {
          //   item.tongCong = divMoney(item.tongCong, this.maDviTien);
          //   item.nguonNsnn = divMoney(item.nguonNsnn, this.maDviTien);
          //   item.nguonKhac = divMoney(item.nguonKhac, this.maDviTien);
          // })
          this.namPa = data.data.namPa;
          this.isStatus = data.data.trangThai;
          this.maPa = data.data.maPa;
          this.maDonViTao = data.data.maDvi;
          this.thuyetMinh = data.data.thuyetMinh;
          this.ngayTao = this.datePipe.transform(data.data.ngayTao, Utils.FORMAT_DATE_STR);
          this.soQd = data.data.soQd;
          this.maPaCha = data.data.maPa;
          this.lstDvi = this.donVis.filter(e => e?.maDviCha === this.maDonViTao && (e.type === "DV"));
          this.lstFiles = data.data.lstFiles;
          this.listFile = [];
          if (this.userService.isAccessPermisson(GDT.VIEW_REPORT_PA_PBDT)) {
            this.statusBtnSave = true;
            this.statusBtnNew = true;
            this.statusBtnCopy = true;
            this.statusBtnPrint = true;
            this.status = true;
          }
          this.getStatusButton();
          this.updateEditCache();
        } else {
          this.notification.error(MESSAGE.ERROR, data?.msg);
        }
      },
      (err) => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      },
    );
    this.spinner.hide();
  };

  sortByIndex() {
    this.setLevel();
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
  };

  //upload file
  async uploadFile(file: File) {
    // day file len server
    const upfile: FormData = new FormData();
    upfile.append('file', file);
    upfile.append('folder', this.maDonViTao + '/' + this.maPa);
    const temp = await this.quanLyVonPhiService.uploadFile(upfile).toPromise().then(
      (data) => {
        const objfile = {
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

  async save() {
    let checkSaveEdit;
    if (!this.maDviTien) {
      this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
      return;
    }
    this.lstCtietBcao.filter(item => {
      if (this.editCache[item.id].edit == true) {
        checkSaveEdit = false;
      }
    })
    if (checkSaveEdit == false) {
      this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTSAVE);
      return;
    }

    const lstCtietBcaoTemp: any[] = [];
    let checkMoneyRange = true;
    // gui du lieu trinh duyet len server
    this.lstCtietBcao.forEach(item => {
      if (item.tongCong > MONEY_LIMIT) {
        checkMoneyRange = false;
        return;
      }
      lstCtietBcaoTemp.push({
        ...item,
        listCtietDvi: [],
      })
    })

    if (!checkMoneyRange == true) {
      this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.MONEYRANGE);
      return;
    }

    lstCtietBcaoTemp.forEach(item => {
      if (item.id?.length == 38) {
        item.id = null;
      }
    });
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
    //get list file url
    const listFile: any = [];
    for (const iterator of this.listFile) {
      listFile.push(await this.uploadFile(iterator));
    }

    // gui du lieu trinh duyet len server
    const request = JSON.parse(JSON.stringify({
      id: this.id,
      fileDinhKems: this.lstFiles,
      listIdFiles: this.listIdFilesDelete,
      lstCtiets: lstCtietBcaoTemp,
      maDvi: this.maDonViTao,
      maDviTien: this.maDviTien,
      maLoaiDan: "3",
      maPa: this.maPa,
      namPa: this.namPa,
      maPhanGiao: '1',
      trangThai: this.isStatus,
      thuyetMinh: this.thuyetMinh,
      soQd: this.soQd,
    }));



    //get file cong van url
    const file: any = this.fileDetail;
    //get file cong van url
    if (file) {
      if (file.size > Utils.FILE_SIZE) {
        this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.OVER_SIZE);
        return;
      } else {
        request.soQd = await this.uploadFile(file);
      }
    }
    if (this.soQd.fileName == null) {
      this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.DOCUMENTARY);
      return
    }
    // if (file) {
    //   request.soQd = await this.uploadFile(file);
    // }
    if (!request.soQd) {
      this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.DOCUMENTARY);
      return;
    }
    this.spinner.show();
    if (!this.id) {
      this.giaoDuToanChiService.giaoDuToan(request).toPromise().then(
        async (data) => {
          if (data.statusCode == 0) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
            this.id = data.data.id;
            this.getDetailReport();
          } else {
            this.notification.error(MESSAGE.ERROR, data?.msg);
          }
        },
        (err) => {
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        },
      );
    }
    else {
      this.giaoDuToanChiService.updateLapThamDinhGiaoDuToan(request).toPromise().then(
        async (data) => {
          if (data.statusCode == 0) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
            this.id = data.data.id;
            // this.getDetailReport();
          } else {
            this.notification.error(MESSAGE.ERROR, data?.msg);
          }
        },
        (err) => {
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        },
      );
    }
    this.spinner.hide();
  };

  back() {
    const obj = {
      tabSelected: "dsquyetDinh",
    }
    this.dataChange.emit(obj);
  };


  async taoMoiPhuongAn() {
    const listCtietDvi: any[] = [];
    const maPaCha = this.maPa
    let maPa
    await this.giaoDuToanChiService.maPhuongAnGiao(this.maLoai).toPromise().then(
      (res) => {
        if (res.statusCode == 0) {
          maPa = res.data;
        } else {
          this.notification.error(MESSAGE.ERROR, res?.msg);
          return;
        }
      },
      (err) => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        return;
      },
    );

    this.lstDvi.forEach(item => {
      listCtietDvi.push({
        id: uuid.v4() + 'FE',
        maDviNhan: item.maDvi,
        soTranChi: 0,
      })
    })

    const lstCtietBcaoTemp: any[] = [];
    // gui du lieu trinh duyet len server
    this.lstCtietBcao.forEach(item => {
      lstCtietBcaoTemp.push({
        ...item,
        tongCong: item.tongCong,
        nguonNsnn: item.nguonNsnn,
        nguonKhac: item.nguonKhac,
        lstCtietDvis: listCtietDvi,
        id: uuid.v4() + 'FE',
      })
    })
    const request1 = {
      id: null,
      fileDinhKems: [],
      listIdDeleteFiles: [],
      lstCtiets: lstCtietBcaoTemp,
      maDvi: this.maDonViTao,
      maDviTien: this.maDviTien,
      maPa: maPa,
      maPaCha: maPaCha,
      namPa: this.namPa,
      maPhanGiao: "2",
      maLoaiDan: '3',
      trangThai: "1",
      thuyetMinh: "",
      idPaBTC: this.id,
      tabSelected: 'phuongAnGiaoDuToan',
    };

    // const request2 = {
    //   id: null,
    //   fileDinhKems: [],
    //   listIdDeleteFiles: [],
    //   lstCtiets: lstCtietBcaoTemp,
    //   maDvi: this.maDonViTao,
    //   maDviTien: this.maDviTien,
    //   maPa: maPa,
    //   maPaCha: maPaCha,
    //   namPa: this.namPa,
    //   maPhanGiao: "2",
    //   maLoaiDan: '2',
    //   trangThai: "1",
    //   thuyetMinh: "",
    //   idPaBTC: this.id,
    //   tabSelected: 'phuongAnGiaoDieuChinh',
    // };

    // if (loaiPa) {
    //   if (loaiPa == 1) {
        this.dataChange.emit(request1);
      // }

    //   if (loaiPa == 2) {
    //     this.dataChange.emit(request2);
    //   }
    // }
  };

  showDialogCopy() {
    const obj = {
      namBcao: this.namPa,
    }
    const modalTuChoi = this.modal.create({
      nzTitle: 'Copy Báo Cáo',
      nzContent: DialogCopyGiaoDuToanComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        namBcao: obj.namBcao
      },
    });
    modalTuChoi.afterClose.toPromise().then(async (res) => {
      if (res) {
        this.doCopy(res);
      }
    });
  }

  async doCopy(response: any) {
    let maBcaoNew: string;
    await this.giaoDuToanChiService.maPhuongAnGiao(this.maLoai).toPromise().then(
      (res) => {
        if (res.statusCode == 0) {
          maBcaoNew = res.data;
          const sub = "BTC";
          maBcaoNew = maBcaoNew.slice(0, 2) + sub + maBcaoNew.slice(2);
        } else {
          this.notification.error(MESSAGE.ERROR, res?.msg);
        }
      },
      (err) => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      },
    );

    const lstCtietBcaoTemps: any[] = [];
    this.lstCtietBcao.forEach(data => {
      lstCtietBcaoTemps.push({
        ...data,
        id: null,
        listCtietDvi: [],
      })
    })
    const request = {
      id: null,
      fileDinhKems: [],
      listIdFiles: [],
      lstCtiets: lstCtietBcaoTemps,
      maDvi: this.maDonViTao,
      maDviTien: this.maDviTien,
      maPa: maBcaoNew,
      namPa: response.namBcao,
      maPhanGiao: '1',
      trangThai: this.isStatus,
      thuyetMinh: this.thuyetMinh,
      soQd: this.soQd,
    };

    this.giaoDuToanChiService.giaoDuToan(request).toPromise().then(
      async data => {
        if (data.statusCode == 0) {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.COPY_SUCCESS);
          const modalCopy = this.modal.create({
            nzTitle: MESSAGE.ALERT,
            nzContent: DialogCopyComponent,
            nzMaskClosable: false,
            nzClosable: false,
            nzWidth: '900px',
            nzFooter: null,
            nzComponentParams: {
              maBcao: maBcaoNew
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

  statusClass() {
    if (Utils.statusSave.includes(this.isStatus)) {
      return 'du-thao-va-lanh-dao-duyet';
    } else {
      return 'da-ban-hanh';
    }
  };

  getStatusName(status: string) {
    return this.trangThais.find(e => e.id == status)?.tenDm;
  };

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
  };

  //download file về máy tính
  async downloadFile(id: string) {
    const file: File = this.listFile.find(element => element?.lastModified.toString() == id);
    if (!file) {
      const fileAttach = this.lstFiles.find(element => element?.id == id);
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
  };

  getMoneyUnit() {
    return this.donViTiens.find(e => e.id == this.maDviTien)?.tenDm;
  };

  updateAllChecked() {
    this.lstCtietBcao.forEach(item => {
      item.checked = this.allChecked;
    })
  };

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
  };

  displayValue(num: number): string {
    num = exchangeMoney(num, '1', this.maDviTien);
    return displayNumber(num);
  };

  getHead(str: string): string {
    return str.substring(0, str.lastIndexOf('.'));
  }
  // lấy phần đuôi của stt
  getTail(str: string): number {
    return parseInt(str.substring(str.lastIndexOf('.') + 1, str.length), 10);
  }
  //tìm vị trí cần để thêm mới
  findVt(str: string): number {
    const start: number = this.lstCtietBcao.findIndex(e => e.stt == str);
    let index: number = start;
    for (let i = start + 1; i < this.lstCtietBcao.length; i++) {
      if (this.lstCtietBcao[i].stt.startsWith(str)) {
        index = i;
      }
    }
    return index;
  }
  //thay thế các stt khi danh sách được cập nhật, heSo=1 tức là tăng stt lên 1, heso=-1 là giảm stt đi 1
  replaceIndex(lstIndex: number[], heSo: number) {
    //thay doi lai stt cac vi tri vua tim duoc
    lstIndex.forEach(item => {
      const str = this.getHead(this.lstCtietBcao[item].stt) + "." + (this.getTail(this.lstCtietBcao[item].stt) + heSo).toString();
      const nho = this.lstCtietBcao[item].stt;
      this.lstCtietBcao.forEach(item => {
        item.stt = item.stt.replace(nho, str);
      })
    })
  }

  deleteLine(id: any) {
    const index: number = this.lstCtietBcao.findIndex(e => e.id === id); // vi tri hien tai
    const nho: string = this.lstCtietBcao[index].stt;
    const head: string = this.getHead(this.lstCtietBcao[index].stt); // lay phan dau cua so tt
    const stt: string = this.lstCtietBcao[index].stt;
    //xóa phần tử và con của nó
    this.lstCtietBcao = this.lstCtietBcao.filter(e => !e.stt.startsWith(nho));
    //update lại số thức tự cho các phần tử cần thiết
    const lstIndex: number[] = [];
    for (let i = this.lstCtietBcao.length - 1; i >= index; i--) {
      if (this.getHead(this.lstCtietBcao[i].stt) == head) {
        lstIndex.push(i);
      }
    }
    this.replaceIndex(lstIndex, -1);
    this.sum(stt)
    this.updateEditCache();
  };

  sum(stt: string) {
    stt = this.getHead(stt);
    while (stt != '0') {
      const index = this.lstCtietBcao.findIndex(e => e.stt == stt);
      const data = this.lstCtietBcao[index];
      this.lstCtietBcao[index] = {
        ...this.initItem,
        id: data.id,
        stt: data.stt,
        maNdung: data.maNdung,
        checked: data.checked,
        level: data.level,
      }
      this.lstCtietBcao.forEach(item => {
        if (this.getHead(item.stt) == stt) {
          this.lstCtietBcao[index].nguonKhac += item.nguonKhac;
          this.lstCtietBcao[index].nguonNsnn += item.nguonNsnn;
          this.lstCtietBcao[index].tongCong += item.tongCong;
        }
      })
      stt = this.getHead(stt);
    }
    this.getTotal();
  };

  getTotal() {
    this.total.nguonKhac = 0;
    this.total.nguonNsnn = 0;
    this.total.tongCong = 0;
    this.lstCtietBcao.forEach(item => {
      this.total.nguonKhac += item.nguonKhac;
      this.total.nguonNsnn += item.nguonNsnn;
      this.total.nguonKhac += item.nguonKhac;
    })
    if (
      this.total.nguonKhac == 0,
      this.total.nguonNsnn == 0,
      this.total.tongCong == 0
    ) {
      this.total.nguonKhac = null,
        this.total.nguonNsnn = null,
        this.total.tongCong = null
    }
  };

  updateEditCache(): void {
    this.lstCtietBcao.forEach(item => {
      this.editCache[item.id] = {
        edit: false,
        data: {
          ...item,
        }
      }
    })
  };

  getLowStatus(str: string) {
    const index: number = this.lstCtietBcao.findIndex(e => this.getHead(e.stt) == str);
    if (index == -1) {
      return false;
    }
    return true;
  };

  startEdit(id: string): void {
    this.editCache[id].edit = true;
  };

  // huy thay doi
  cancelEdit(id: string): void {
    const index = this.lstCtietBcao.findIndex(item => item.id === id);
    // lay vi tri hang minh sua
    this.editCache[id] = {
      data: { ...this.lstCtietBcao[index] },
      edit: false
    };
  };

  addLine(id: any) {
    const maNdung: any = this.lstCtietBcao.find(e => e.id == id)?.idKm;
    const obj = {
      maKhoanMuc: maNdung,
      lstKhoanMuc: this.noiDungs,
    }

    const modalIn = this.modal.create({
      nzTitle: 'Danh sách lĩnh vực',
      nzContent: DialogThemKhoanMucComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '65%',
      nzFooter: null,
      nzComponentParams: {
        obj: obj
      },
    });
    modalIn.afterClose.subscribe((res) => {
      if (res) {
        const index: number = this.lstCtietBcao.findIndex(e => e.maNdung == res.maKhoanMuc);
        if (index == -1) {
          const data: any = {
            ...this.initItem,
            maNdung: res.maKhoanMuc,
            level: this.noiDungs.find(e => e.id == maNdung)?.level,
          };
          if (this.lstCtietBcao.length == 0) {
            this.addFirst(data);
          } else {
            this.addSame(id, data);
          }
        }
        id = this.lstCtietBcao.find(e => e.maNdung == res.maKhoanMuc)?.id;
        res.lstKhoanMuc.forEach(item => {
          if (this.lstCtietBcao.findIndex(e => e.maNdung == item.id) == -1) {
            const data: ItemData = {
              ...this.initItem,
              maNdung: item.id,
              level: item.level,
            };
            this.addLow(id, data);
          }
        })
        this.updateEditCache();
      }
    });
  };

  addFirst(initItem: ItemData) {
    if (initItem.id) {
      const item: ItemData = {
        ...initItem,
        stt: "0.1",
      }
      this.lstCtietBcao.push(item);
      this.editCache[item.id] = {
        edit: false,
        data: { ...item }
      };
    } else {
      const item: ItemData = {
        ...initItem,
        level: 0,
        id: uuid.v4() + 'FE',
        stt: "0.1",
      }
      this.lstCtietBcao.push(item);

      this.editCache[item.id] = {
        edit: true,
        data: { ...item }
      };
    }
  };

  addLow(id: any, initItem: ItemData) {
    const data: ItemData = this.lstCtietBcao.find(e => e.id === id);
    let index: number = this.lstCtietBcao.findIndex(e => e.id === id); // vi tri hien tai
    let stt: string;
    if (this.lstCtietBcao.findIndex(e => this.getHead(e.stt) == data.stt) == -1) {
      stt = data.stt + '.1';
    } else {
      index = this.findVt(data.stt);
      for (let i = this.lstCtietBcao.length - 1; i >= 0; i--) {
        if (this.getHead(this.lstCtietBcao[i].stt) == data.stt) {
          stt = data.stt + '.' + (this.getTail(this.lstCtietBcao[i].stt) + 1).toString();
          break;
        }
      }
    }

    // them moi phan tu
    if (initItem.id) {
      const item: ItemData = {
        ...initItem,
        stt: stt,
      }
      this.lstCtietBcao.splice(index + 1, 0, item);
      this.editCache[item.id] = {
        edit: false,
        data: { ...item }
      };
    } else {
      if (this.lstCtietBcao.findIndex(e => this.getHead(e.stt) == this.getHead(stt)) == -1) {
        this.sum(stt);
        this.updateEditCache();
      }
      const item: ItemData = {
        ...initItem,
        id: uuid.v4() + "FE",
        stt: stt,
      }
      this.lstCtietBcao.splice(index + 1, 0, item);

      this.editCache[item.id] = {
        edit: true,
        data: { ...item }
      };
    }
  };

  addSame(id: any, initItem: ItemData) {
    const index: number = this.lstCtietBcao.findIndex(e => e.id === id); // vi tri hien tai
    const head: string = this.getHead(this.lstCtietBcao[index].stt); // lay phan dau cua so tt
    const tail: number = this.getTail(this.lstCtietBcao[index].stt); // lay phan duoi cua so tt
    const ind: number = this.findVt(this.lstCtietBcao[index].stt); // vi tri can duoc them
    // tim cac vi tri can thay doi lai stt
    const lstIndex: number[] = [];
    for (let i = this.lstCtietBcao.length - 1; i > ind; i--) {
      if (this.getHead(this.lstCtietBcao[i].stt) == head) {
        lstIndex.push(i);
      }
    }
    this.replaceIndex(lstIndex, 1);
    // them moi phan tu
    if (initItem.id) {
      const item: ItemData = {
        ...initItem,
        stt: head + "." + (tail + 1).toString(),
      }
      this.lstCtietBcao.splice(ind + 1, 0, item);
      this.editCache[item.id] = {
        edit: false,
        data: { ...item }
      };
    } else {
      const item: ItemData = {
        ...initItem,
        id: uuid.v4() + "FE",
        stt: head + "." + (tail + 1).toString(),
      }
      this.lstCtietBcao.splice(ind + 1, 0, item);
      this.editCache[item.id] = {
        edit: true,
        data: { ...item }
      };
    }
  };

  updateChecked(id: any) {
    const data: ItemData = this.lstCtietBcao.find(e => e.id === id);
    //đặt các phần tử con có cùng trạng thái với nó
    this.lstCtietBcao.forEach(item => {
      if (item.stt.startsWith(data.stt)) {
        item.checked = data.checked;
      }
    })
    //thay đổi các phần tử cha cho phù hợp với tháy đổi của phần tử con
    let index: number = this.lstCtietBcao.findIndex(e => e.stt == this.getHead(data.stt));
    if (index == -1) {
      this.allChecked = this.checkAllChild('0');
    } else {
      let nho: boolean = this.lstCtietBcao[index].checked;
      while (nho != this.checkAllChild(this.lstCtietBcao[index].stt)) {
        this.lstCtietBcao[index].checked = !nho;
        index = this.lstCtietBcao.findIndex(e => e.stt == this.getHead(this.lstCtietBcao[index].stt));
        if (index == -1) {
          this.allChecked = !nho;
          break;
        }
        nho = this.lstCtietBcao[index].checked;
      }
    }
  };

  checkAllChild(str: string): boolean {
    let nho = true;
    this.lstCtietBcao.forEach(item => {
      if ((this.getHead(item.stt) == str) && (!item.checked) && (item.stt != str)) {
        nho = item.checked;
      }
    })
    return nho;
  };

  changeModel(id: any) {
    this.editCache[id].data.tongCong = Number(this.editCache[id].data.nguonNsnn) + Number(this.editCache[id].data.nguonKhac);
  };

  saveEdit(id: string): void {
    if (
      (!this.editCache[id].data.nguonKhac && this.editCache[id].data.nguonKhac !== 0) ||
      (!this.editCache[id].data.nguonNsnn && this.editCache[id].data.nguonNsnn !== 0)
    ) {
      this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS)
      return;
    }
    if (this.editCache[id].data.nguonKhac < 0 ||
      this.editCache[id].data.nguonNsnn < 0) {
      this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOT_NEGATIVE)
      return;
    }
    this.editCache[id].data.checked = this.lstCtietBcao.find(item => item.id === id).checked; // set checked editCache = checked lstCtietBcao
    const index = this.lstCtietBcao.findIndex(item => item.id === id); // lay vi tri hang minh sua
    Object.assign(this.lstCtietBcao[index], this.editCache[id].data); // set lai data cua lstCtietBcao[index] = this.editCache[id].data
    this.editCache[id].edit = false; // CHUYEN VE DANG TEXT
    this.sum(this.lstCtietBcao[index].stt);
    this.updateEditCache();
  };

  deleteFile(id: string): void {
    this.lstFiles = this.lstFiles.filter((a: any) => a.id !== id);
    this.listFile = this.listFile.filter((a: any) => a?.lastModified.toString() !== id);
    this.listIdFilesDelete.push(id);
  };

  deleteAllChecked() {
    const lstId: any[] = [];
    this.lstCtietBcao.forEach(item => {
      if (item.checked) {
        lstId.push(item.id);
      }
    })
    lstId.forEach(item => {
      if (this.lstCtietBcao.findIndex(e => e.id == item) != -1) {
        this.deleteLine(item);
      }
    })
  };

}
