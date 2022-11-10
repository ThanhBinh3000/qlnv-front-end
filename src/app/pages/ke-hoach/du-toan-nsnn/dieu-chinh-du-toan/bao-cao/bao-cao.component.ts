import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { DataService } from 'src/app/services/data.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';
import { DCDT, TRANG_THAI_PHU_LUC, Utils } from 'src/app/Utility/utils';
import { PHU_LUC } from './bao-cao.constant';
import * as uuid from "uuid";
import * as fileSaver from 'file-saver';
import { DialogChonThemBieuMauComponent } from 'src/app/components/dialog/dialog-chon-them-bieu-mau/dialog-chon-them-bieu-mau.component';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { DialogCopyComponent } from 'src/app/components/dialog/dialog-copy/dialog-copy.component';
import { DialogDieuChinhCopyComponent } from 'src/app/components/dialog/dialog-dieu-chinh-copy/dialog-dieu-chinh-copy.component';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
export class ItemData {
  id: any;
  maLoai: string;
  trangThai: string;
  maDviTien: string;
  lyDoTuChoi: string;
  thuyetMinh: string;
  giaoCho: string;
  lstCtietDchinh: any[];
  checked: boolean;
}

export class ItemCongVan {
  fileName: string;
  fileSize: number;
  fileUrl: number;
}
@Component({
  selector: 'app-bao-cao',
  templateUrl: './bao-cao.component.html',
  styleUrls: ['./bao-cao.component.scss']
})


export class BaoCaoComponent implements OnInit {
  @Input() data;

  @Output() dataChange = new EventEmitter();

  //thong tin dang nhap
  id!: any;
  loai!: string;
  userInfo: any;
  //thong tin chung bao cao
  maBaoCao!: string;
  namHienHanh: number;
  namBcao: string;
  ngayNhap!: string;
  nguoiNhap!: string;
  congVan: ItemCongVan = new ItemCongVan();
  ngayTrinhDuyet!: string;
  ngayDuyetTBP!: string;
  ngayDuyetLD!: string;
  ngayCapTrenTraKq!: string;
  trangThaiBaoCao = '1';
  maDviTao!: string;
  thuyetMinh: string;
  lyDoTuChoi: string;
  loaiTongHop!: string;
  maDviUser!: string;
  dotBcao: number;
  //danh muc
  dotBcaos: any[] = [
    {
      id: 1
    },
    {
      id: 2
    }
  ]
  lstDieuChinhs: ItemData[] = [];
  phuLucs: any[] = JSON.parse(JSON.stringify(PHU_LUC));
  donVis: any[] = [];
  tabs: any[] = [];
  lstDviTrucThuoc: any[] = [];
  trangThaiBaoCaos: any[] = [
    {
      id: Utils.TT_BC_1,
      tenDm: "Đang soạn",
    },
    {
      id: Utils.TT_BC_2,
      tenDm: "Trình duyệt",
    },
    {
      id: Utils.TT_BC_3,
      tenDm: "Trưởng BP từ chối",
    },
    {
      id: Utils.TT_BC_4,
      tenDm: "Trưởng BP chấp nhận",
    },
    {
      id: Utils.TT_BC_5,
      tenDm: "Lãnh đạo từ chối",
    },
    {
      id: Utils.TT_BC_7,
      tenDm: "Lãnh đạo chấp nhận",
    },
    {
      id: Utils.TT_BC_8,
      tenDm: "Từ chối",
    },
    {
      id: Utils.TT_BC_9,
      tenDm: "Tiếp nhận",
    },
  ];
  trangThaiBieuMaus: any[] = TRANG_THAI_PHU_LUC;
  canBos: any[];
  lstFiles: any[] = []; //show file ra man hinh
  //file
  listFile: File[] = [];                      // list file chua ten va id de hien tai o input
  fileList: NzUploadFile[] = [];
  fileDetail: NzUploadFile;
  //beforeUpload: any;
  listIdFilesDelete: any = [];                        // id file luc call chi tiet
  //trang thai cac nut
  // status = false;
  // statusEdit = false;
  // statusBtnSave = true;
  // statusBtnApprove = true;
  // statusBtnTBP = true;
  // statusBtnLD = true;
  // statusBtnDVCT = true;
  // statusBtnCopy = true;
  // statusBtnPrint = true;
  // statusBtnClose = false;
  // statusBtnOk: boolean;
  // statusBtnFinish: boolean;

  status = false;
  saveStatus = true;
  submitStatus = true;
  passStatus = true;
  approveStatus = true;
  acceptStatus = true;
  copyStatus = true;
  printStatus = true;
  okStatus = true;
  finishStatus = true;
  isParent = false;
  isDataAvailable = false;

  checkParent = false;
  //khac
  // data: any;
  selectedIndex = 1;
  allChecked = false;                         // check all checkbox
  loaiMH: number;

  // before uploaf file
  beforeUpload = (file: NzUploadFile): boolean => {
    this.fileList = this.fileList.concat(file);
    return false;
  };

  // before uploaf file
  beforeUploadCV = (file: NzUploadFile): boolean => {
    this.fileDetail = file;
    this.congVan = {
      fileName: file.name,
      fileSize: null,
      fileUrl: null,
    };
    return false;
  };

  // them file vao danh sach
  handleUpload(): void {
    this.fileList.forEach((file: any) => {
      const id = file?.lastModified.toString();
      this.lstFiles.push({ id: id, fileName: file?.name });
      this.listFile.push(file);
    });
    this.fileList = [];
  };

  constructor(
    private spinner: NgxSpinnerService,
    private datePipe: DatePipe,
    private userService: UserService,
    public globals: Globals,
    private quanLyVonPhiService: QuanLyVonPhiService,
    private notification: NzNotificationService,
    private modal: NzModalService,
  ) {
    this.ngayNhap = this.datePipe.transform(new Date(), Utils.FORMAT_DATE_STR,)
  };

  async ngOnInit() {
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
      case 'detail':
        await this.getDetailReport().then(() => {
          this.isDataAvailable = true;
        });
        break;
      case 'save':
        await this.save().then(() => {
          this.isDataAvailable = true;
        })
        break;
      case 'submit':
        await this.onSubmit('2', null).then(() => {
          this.isDataAvailable = true;
        })
        break;
      case 'nonpass':
        await this.tuChoi('3').then(() => {
          this.isDataAvailable = true;
        })
        break;
      case 'pass':
        await this.onSubmit('4', null).then(() => {
          this.isDataAvailable = true;
        })
        break;
      case 'nonapprove':
        await this.tuChoi('5').then(() => {
          this.isDataAvailable = true;
        })
        break;
      case 'approve':
        await this.onSubmit('7', null).then(() => {
          this.isDataAvailable = true;
        })
        break;
      case 'nonaccept':
        await this.tuChoi('8').then(() => {
          this.isDataAvailable = true;
        })
        break;
      case 'accept':
        await this.onSubmit('9', null).then(() => {
          this.isDataAvailable = true;
        })
        break;
      default:
        break;
    }
    this.tabs = [];
    this.spinner.hide();
  };

  async initialization() {
    this.spinner.show();
    this.id = this.data?.id;
    this.userInfo = this.userService.getUserLogin();

    await this.getListUser();
    if (this.id) {
      await this.getDetailReport();
    } else {
      this.namHienHanh = this.data?.namBcao;
      this.namBcao = this.data?.namBcao;
      this.dotBcao = this.data?.dotBcao;
      this.trangThaiBaoCao = "1";
      this.nguoiNhap = this.userInfo?.sub;
      this.maDviTao = this.userInfo?.MA_DVI;

      this.quanLyVonPhiService.sinhMaBaoCaoDieuChinh().toPromise().then(
        (data) => {
          if (data.statusCode == 0) {
            this.maBaoCao = data.data;
          } else {
            this.notification.error(MESSAGE.ERROR, data?.msg);
          }
        },
        (err) => {
          this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
        }
      );
      if (this.lstDviTrucThuoc?.length == 0) {
        this.phuLucs.forEach(item => {
          this.lstDieuChinhs.push({
            id: uuid.v4() + 'FE',
            maLoai: item.id,
            trangThai: '3',
            maDviTien: '',
            lyDoTuChoi: "",
            thuyetMinh: "",
            giaoCho: "",
            lstCtietDchinh: [],
            checked: false,
          })
        })
      }
    }
    await this.getDviCon();
    this.getStatusButton();
    this.changeNam();
    this.changeDot();
    this.spinner.hide();
  };

  changeNam() {
    this.phuLucs.forEach(item => {
      item.tenDm = PHU_LUC.find(el => el.id == item.id)?.tenDm + this.namHienHanh;
    })
    this.changeDot()
  };

  changeDot() {
    const item1 = this.phuLucs.find(item => item.id == "1")
    item1.tenDm = "Tổng hợp điều chỉnh dự toán chi ngân sách nhà nước đợt " + this.dotBcao + "/năm " + this.namHienHanh
  };

  async getDviCon() {
    const request = {
      maDviCha: this.maDviTao,
      trangThai: '01',
    }
    await this.quanLyVonPhiService.dmDviCon(request).toPromise().then(
      data => {
        if (data.statusCode == 0) {
          this.donVis = data.data;
        } else {
          this.notification.error(MESSAGE.ERROR, data?.msg);
        }
      },
      (err) => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
      }
    )
  };

  async getDetailReport() {
    this.spinner.show();
    await this.quanLyVonPhiService.bCDieuChinhDuToanChiTiet(this.id).toPromise().then(
      (data) => {
        if (data.statusCode == 0) {
          this.lstDieuChinhs = data.data.lstDchinhs;
          this.lstDviTrucThuoc = data.data.lstDchinhDviTrucThuocs;
          this.lstFiles = data.data.lstFiles;
          this.listFile = [];
          // set thong tin chung bao cao
          this.namBcao = data.data.namBcao;
          this.ngayNhap = this.datePipe.transform(data.data.ngayTao, Utils.FORMAT_DATE_STR);
          this.nguoiNhap = data.data.nguoiTao;
          this.maBaoCao = data.data.maBcao;
          this.maDviTao = data.data.maDvi;
          this.namHienHanh = data.data.namHienHanh;
          this.trangThaiBaoCao = data.data.trangThai;
          this.ngayTrinhDuyet = this.datePipe.transform(data.data.ngayTrinh, Utils.FORMAT_DATE_STR);
          this.ngayDuyetTBP = this.datePipe.transform(data.data.ngayDuyet, Utils.FORMAT_DATE_STR);
          this.ngayDuyetLD = this.datePipe.transform(data.data.ngayPheDuyet, Utils.FORMAT_DATE_STR);
          this.ngayCapTrenTraKq = this.datePipe.transform(data.data.ngayTraKq, Utils.FORMAT_DATE_STR);
          this.congVan = data.data.congVan;
          this.lstDviTrucThuoc.forEach(item => {
            item.ngayDuyet = this.datePipe.transform(item.ngayDuyet, Utils.FORMAT_DATE_STR);
            item.ngayPheDuyet = this.datePipe.transform(item.ngayPheDuyet, Utils.FORMAT_DATE_STR);
          })
          this.dotBcao = data.data.dotBcao;
          this.thuyetMinh = data.data.thuyetMinh;
          this.getStatusButton();
        } else {
          this.notification.error(MESSAGE.ERROR, data?.msg);
        }
      },
      (err) => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
      }
    );
    this.spinner.hide();
  };

  getStatusButton() {
    const isSynthetic = this.lstDviTrucThuoc.length != 0;
    //kiem tra quyen cua cac user
    const checkSave = isSynthetic ? this.userService.isAccessPermisson(DCDT.EDIT_SYNTHETIC_REPORT) : this.userService.isAccessPermisson(DCDT.EDIT_REPORT);
    const checkSunmit = isSynthetic ? this.userService.isAccessPermisson(DCDT.APPROVE_SYNTHETIC_REPORT) : this.userService.isAccessPermisson(DCDT.APPROVE_REPORT);
    const checkPass = isSynthetic ? this.userService.isAccessPermisson(DCDT.DUYET_SYNTHETIC_REPORT) : this.userService.isAccessPermisson(DCDT.DUYET_REPORT);
    const checkApprove = isSynthetic ? this.userService.isAccessPermisson(DCDT.PHE_DUYET_SYNTHETIC_REPORT) : this.userService.isAccessPermisson(DCDT.PHE_DUYET_REPORT);
    const checkAccept = this.userService.isAccessPermisson(DCDT.TIEP_NHAN_REPORT);
    const checkCopy = isSynthetic ? this.userService.isAccessPermisson(DCDT.COPY_SYNTHETIC_REPORT) : this.userService.isAccessPermisson(DCDT.COPY_REPORT);
    const checkPrint = isSynthetic ? this.userService.isAccessPermisson(DCDT.PRINT_SYTHETIC_REPORT) : this.userService.isAccessPermisson(DCDT.PRINT_REPORT);
    if (Utils.statusSave.includes(this.trangThaiBaoCao) && checkSave) {
      this.status = false;
    } else {
      this.status = true;
    }
    this.checkParent = false;
    const checkChirld = this.maDviTao == this.userInfo?.MA_DVI;
    this.checkParent = this.donVis.findIndex(e => e.maDvi == this.maDviTao) != -1;

    this.saveStatus = Utils.statusSave.includes(this.trangThaiBaoCao) && checkSave && checkChirld;
    this.submitStatus = Utils.statusApprove.includes(this.trangThaiBaoCao) && checkSunmit && checkChirld;
    this.passStatus = Utils.statusDuyet.includes(this.trangThaiBaoCao) && checkPass && checkChirld;
    this.approveStatus = Utils.statusPheDuyet.includes(this.trangThaiBaoCao) && checkApprove && checkChirld;
    this.acceptStatus = Utils.statusTiepNhan.includes(this.trangThaiBaoCao) && checkAccept && this.checkParent;
    this.copyStatus = Utils.statusCopy.includes(this.trangThaiBaoCao) && checkCopy && checkChirld;
    this.printStatus = Utils.statusPrint.includes(this.trangThaiBaoCao) && checkPrint && checkChirld;

    if (this.acceptStatus || this.approveStatus || this.passStatus) {
      this.okStatus = true;
    } else {
      this.okStatus = false;
    }
    if (this.saveStatus) {
      this.finishStatus = false;
    } else {
      this.finishStatus = true;
    }
  };

  async getListUser() {
    this.quanLyVonPhiService.getListUser().toPromise().then(
      res => {
        if (res.statusCode == 0) {
          this.canBos = res.data;
        }
      },
      (err) => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      })
  };

  //upload file
  async uploadFile(file: File) {
    // day file len server
    const upfile: FormData = new FormData();
    upfile.append('file', file);
    upfile.append('folder', this.maBaoCao + '/' + this.maDviTao);
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
  };

  // xoa file trong bang file
  deleteFile(id: string): void {
    this.lstFiles = this.lstFiles.filter((a: any) => a.id !== id);
    this.listFile = this.listFile.filter((a: any) => a?.lastModified.toString() !== id);
    this.listIdFilesDelete.push(id);
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

  //download file về máy tính
  async downloadFileCv() {
    if (this.congVan?.fileUrl) {
      await this.quanLyVonPhiService.downloadFile(this.congVan?.fileUrl).toPromise().then(
        (data) => {
          fileSaver.saveAs(data, this.congVan?.fileName);
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



  async save() {
    // check lưu trong bảng trước khi nhấn lưu
    let checkSave = true;
    this.lstDieuChinhs.forEach(e => {
      if (!e.giaoCho) {
        checkSave = false;
      }
    })
    if (!checkSave) {
      this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
      return;
    }
    if (!this.dotBcao) {
      this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOT_EMPTY_DOTBC)
      return
    }

    if (this.congVan.fileName == null) {
      this.notification.warning(MESSAGE.WARNING, "Vui lòng nhập file công văn");
      return;
    }
    this.spinner.show();
    // replace nhung ban ghi dc them moi id thanh null
    this.lstDieuChinhs.forEach(item => {
      if (item.id?.length == 38) {
        item.id = null;
      }
    })

    // thêm cac dvi trực thuộc vào danh sách thêm mới sau khi tổng hợp
    const tongHopTuIds = [];
    this.lstDviTrucThuoc.forEach(item => {
      tongHopTuIds.push(item.id);
    })
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


    const request = JSON.parse(JSON.stringify({
      id: this.id,
      fileDinhKems: this.lstFiles,
      listIdFiles: this.listIdFilesDelete,                      // id file luc get chi tiet tra ra( de backend phuc vu xoa file)
      lstDchinh: this.lstDieuChinhs,
      maBcao: this.maBaoCao,
      maDvi: this.maDviTao,
      namBcao: this.namHienHanh,
      namHienHanh: this.namHienHanh,
      dotBcao: this.dotBcao,
      congVan: this.congVan,
      thuyetMinh: this.thuyetMinh,
      tongHopTuIds: tongHopTuIds,
    }));
    //get file cong van url
    const file: any = this.fileDetail;
    if (file) {
      if (file.size > Utils.FILE_SIZE) {
        this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.OVER_SIZE);
        return;
      } else {
        request.congVan = await this.uploadFile(file);
      }
    }
    if (file) {
      request.congVan = await this.uploadFile(file);
    }
    if (!request.congVan) {
      this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.DOCUMENTARY);
      return;
    }
    if (!request.dotBcao) {
      this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS)
    }
    //call service them moi

    if (this.id == null) {
      this.quanLyVonPhiService.trinhDuyetDieuChinhService(request).toPromise().then(
        async data => {
          if (data.statusCode == 0) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
            this.id = data.data.id;
            this.getDetailReport();
            const dataTemp = {
              id: data.data.id,
              tabSelected: this.data.tabSelected,
              preTab: this.data.preTab,
            }
            this.data = dataTemp;
          } else {
            this.notification.error(MESSAGE.ERROR, data?.msg);
          }
        },
        err => {
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        },
      );
    } else {
      this.quanLyVonPhiService.updateDieuChinh(request).toPromise().then(
        async data => {
          if (data.statusCode == 0) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
            await this.getDetailReport();
          } else {
            this.notification.error(MESSAGE.ERROR, data?.msg);
          }
        }, err => {
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        })
    }
    this.lstDieuChinhs.filter(item => {
      if (!item.id) {
        item.id = uuid.v4() + 'FE';
      }
    });
    this.spinner.hide();
  };

  // chuc nang check role
  async onSubmit(mcn: string, lyDoTuChoi: string) {
    if (!this.congVan) {
      this.notification.warning(MESSAGE.WARNING, 'Chưa nhập file công văn')
      return
    }
    if (mcn == Utils.TT_BC_2) {
      let check = true;
      this.lstDieuChinhs.forEach(item => {
        if (item.trangThai != '5') {
          check = false;
        }
      })
      if (!check) {
        this.notification.warning(MESSAGE.ERROR, MESSAGE.FINISH_FORM);
        return;
      }
    } else {
      let check = true;
      if (mcn == Utils.TT_BC_4 || mcn == Utils.TT_BC_7 || mcn == Utils.TT_BC_9) {
        this.lstDieuChinhs.forEach(item => {
          if (item.trangThai == '2') {
            check = false;
          }
        })
      }
      if (!check) {
        this.notification.warning(MESSAGE.ERROR, MESSAGE.RATE_FORM);
        return;
      }
    }
    if (this.id) {
      const requestGroupButtons = {
        id: this.id,
        maChucNang: mcn,
        lyDoTuChoi: lyDoTuChoi,
      };
      this.spinner.show();
      await this.quanLyVonPhiService.approveDieuChinh(requestGroupButtons).toPromise().then(async (data) => {
        if (data.statusCode == 0) {
          this.trangThaiBaoCao = mcn;
          this.ngayTrinhDuyet = this.datePipe.transform(data.data.ngayTrinh, Utils.FORMAT_DATE_STR);
          this.ngayDuyetTBP = this.datePipe.transform(data.data.ngayDuyet, Utils.FORMAT_DATE_STR);
          this.ngayDuyetLD = this.datePipe.transform(data.data.ngayPheDuyet, Utils.FORMAT_DATE_STR);
          this.ngayCapTrenTraKq = this.datePipe.transform(data.data.ngayTraKq, Utils.FORMAT_DATE_STR);
          this.getStatusButton();
          // this.getStatusButtonOk();
          if (mcn == Utils.TT_BC_8 || mcn == Utils.TT_BC_5 || mcn == Utils.TT_BC_3) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.REJECT_SUCCESS);
          } else {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.APPROVE_SUCCESS);
          }
          this.tabs = [];
        } else {
          this.notification.error(MESSAGE.ERROR, data?.msg);
        }
      }, err => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      });
      this.spinner.hide();
    } else {
      this.notification.warning(MESSAGE.WARNING, MESSAGE.MESSAGE_DELETE_WARNING)
    }
  }

  async tuChoi(mcn: string) {
    const modalTuChoi = this.modal.create({
      nzTitle: 'Từ chối',
      nzContent: DialogTuChoiComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {},
    });
    modalTuChoi.afterClose.subscribe(async (text) => {
      if (text) {
        this.onSubmit(mcn, text);
      }
    });
  }


  back() {
    if (this.data?.preData) {
      this.dataChange.emit(this.data?.preData)
    } else {
      const obj = {
        tabSelected: this.data?.preTab,
      }
      this.dataChange.emit(obj);
    }
  };

  getStatusAppendixName(id) {
    const utils = new Utils();
    return utils.getStatusAppendixName(id);
  }


  statusClass() {
    if (Utils.statusSave.includes(this.trangThaiBaoCao)) {
      return 'du-thao-va-lanh-dao-duyet';
    } else {
      return 'da-ban-hanh';
    }
  };

  getStatusName(status: string) {
    const statusMoi = status == Utils.TT_BC_6 || status == Utils.TT_BC_7;
    if (statusMoi && this.isParent) {
      return 'Mới';
    } else {
      return this.trangThaiBaoCaos.find(e => e.id == status)?.tenDm;
    }
  };


  closeTab({ index }: { index: number }): void {
    this.tabs.splice(index - 1, 1);
  };


  getStatusBM(trangThai: string) {
    return this.trangThaiBieuMaus.find(e => e.id == trangThai)?.ten;
  };

  deleteSelected() {
    this.lstDieuChinhs.forEach(item => {
      if (this.tabs.findIndex(e => e.id == item.maLoai) != -1) {
        this.tabs = [];
      }
    })
    // delete object have checked = true
    this.lstDieuChinhs = this.lstDieuChinhs.filter(item => item.checked != true)
    this.allChecked = false;
  };

  addBieuMau() {
    this.phuLucs.forEach(item => item.status = false);
    const danhSach = this.phuLucs.filter(item => this.lstDieuChinhs.findIndex(e => e.maLoai == item.id) == -1);

    const modalIn = this.modal.create({
      nzTitle: 'Danh sách biểu mẫu',
      nzContent: DialogChonThemBieuMauComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '600px',
      nzFooter: null,
      nzComponentParams: {
        danhSachBieuMau: danhSach
      },
    });
    modalIn.afterClose.subscribe((res) => {
      if (res) {
        res.forEach(item => {
          if (item.status) {
            this.lstDieuChinhs.push({
              id: uuid.v4() + 'FE',
              maLoai: item.id,
              trangThai: '3',
              maDviTien: '',
              lyDoTuChoi: "",
              thuyetMinh: "",
              giaoCho: "",
              lstCtietDchinh: [],
              checked: false,
            });
          }
        })
      }
    });
  };

  // click o checkbox all
  updateAllChecked(): void {
    if (this.allChecked) {                                    // checkboxall == true thi set lai lstDieuChinhs.checked = true
      this.lstDieuChinhs = this.lstDieuChinhs.map(item => ({
        ...item,
        checked: true
      }));
    } else {
      this.lstDieuChinhs = this.lstDieuChinhs.map(item => ({    // checkboxall == false thi set lai lstDieuChinhs.checked = false
        ...item,
        checked: false
      }));
    }
  }

  newTab(id: any): void {
    const index: number = this.tabs.findIndex(e => e.id === id);
    if (index != -1) {
      this.selectedIndex = index + 1;
    } else {
      const item = this.lstDieuChinhs.find(e => e.maLoai == id);
      this.data = {
        ...item,
        maDviTao: this.maDviTao,
        namHienHanh: this.namHienHanh,
        trangThaiBaoCao: this.trangThaiBaoCao,
        statusBtnOk: this.okStatus,
        statusBtnFinish: this.finishStatus,
        status: this.status,
        namBcao: this.namBcao,
        maBaoCao: this.maBaoCao
      }
      this.tabs = [];
      this.tabs.push(PHU_LUC.find(e => e.id === id));
      this.selectedIndex = this.tabs.length + 1;
    }
  };

  // click o checkbox single
  updateSingleChecked(): void {
    if (this.lstDieuChinhs.every(item => !item.checked)) {           // tat ca o checkbox deu = false thi set o checkbox all = false
      this.allChecked = false;
    } else if (this.lstDieuChinhs.every(item => item.checked)) {     // tat ca o checkbox deu = true thi set o checkbox all = true
      this.allChecked = true;
    }
  };

  getUnitName(maDvi: string) {
    return this.donVis.find(item => item.maDvi == maDvi)?.tenDvi;
  };

  viewDetail(id) {
    const obj = {
      id: id,
      preData: this.data,
      tabSelected: 'next' + this.data?.tabSelected,
    }
    this.dataChange.emit(obj);
  };

  getNewData(obj: any) {
    const index = this.lstDieuChinhs.findIndex(e => e.maLoai == this.tabs[0].id);
    if (obj?.trangThai == '-1') {
      this.getDetailReport();
      this.data = {
        ...this.lstDieuChinhs[index],
        maDviTao: this.maDviTao,
        namHienHanh: this.namHienHanh,
        trangThaiBaoCao: this.trangThaiBaoCao,
        statusBtnOk: this.okStatus,
        statusBtnFinish: this.finishStatus,
        status: this.status,
        namBcao: this.namBcao,
        maBaoCao: this.maBaoCao
      }
      this.tabs = [];
      this.tabs.push(PHU_LUC.find(e => e.id == this.lstDieuChinhs[index].maLoai));
      this.selectedIndex = this.tabs.length + 1;
    } else {
      this.lstDieuChinhs[index].trangThai = obj?.trangThai;
      this.lstDieuChinhs[index].lyDoTuChoi = obj?.lyDoTuChoi;
    }
  };

  showDialogCopy() {
    const obj = {
      namBcao: this.namHienHanh,
      dotBcao: this.dotBcao,
      loaiCopy: '',
      checkDvtt: this.lstDviTrucThuoc.length > 0 ? true : false,
    }
    const modalTuChoi = this.modal.create({
      nzTitle: 'Copy Báo Cáo',
      nzContent: DialogDieuChinhCopyComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        obj
      },
    });
    modalTuChoi.afterClose.toPromise().then(async (res) => {
      if (res) {
        this.doCopy(res);
      }
    });
  };

  async doCopy(response: any) {
    let maBcaoNew: string;
    await this.quanLyVonPhiService.sinhMaBaoCaoDieuChinh().toPromise().then(
      (data) => {
        if (data.statusCode == 0) {
          maBcaoNew = data.data;
        } else {
          this.notification.error(MESSAGE.ERROR, data?.msg);
          return;
        }
      },
      (err) => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
        return;
      }
    );
    const lstDieuChinhTemps: any[] = [];
    this.lstDieuChinhs.forEach(data => {
      const lstCtietTemp: any[] = [];
      data.lstCtietDchinh.forEach(item => {
        lstCtietTemp.push({
          ...item,
          id: null,
        })
      })
      lstDieuChinhTemps.push({
        ...data,
        giaoCho: this.userInfo?.sub,
        lstCtietDchinh: lstCtietTemp,
        id: null,
      })
    })
    let tongHopTuIds = [];
    if (response.loaiCopy == 'D') {
      //xoa lst don vi truc thuoc theo lua chon tu dialog
      tongHopTuIds = [];
    } else {
      // thêm cac dvi trực thuộc vào danh sách thêm mới sau khi tổng hợp
      this.lstDviTrucThuoc.forEach(item => {
        tongHopTuIds.push(item.id);
      })
    }
    const request = {
      id: null,
      fileDinhKems: [],
      listIdFiles: [],                      // id file luc get chi tiet tra ra( de backend phuc vu xoa file)
      lstDchinh: lstDieuChinhTemps,
      maBcao: maBcaoNew,
      maDvi: this.maDviTao,
      namBcao: response?.namBcao,
      namHienHanh: response?.namBcao,
      dotBcao: response?.dotBcao,
      congVan: null,
      tongHopTuIds: tongHopTuIds,
    };

    this.quanLyVonPhiService.trinhDuyetDieuChinhService(request).toPromise().then(
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

  };

}
