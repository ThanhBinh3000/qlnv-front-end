import { ComponentType } from '@angular/cdk/portal';
import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as fileSaver from 'file-saver';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogChonThemBieuMauComponent } from 'src/app/components/dialog/dialog-chon-them-bieu-mau/dialog-chon-them-bieu-mau.component';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { DieuChinhService } from 'src/app/services/quan-ly-von-phi/dieuChinhDuToan.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';
import { DCDT, TRANG_THAI_PHU_LUC, TRANG_THAI_TIM_KIEM, Utils } from 'src/app/Utility/utils';
import * as uuid from 'uuid';
import { PHU_LUC, PHU_LUC_TH } from './add-bao-cao.constant';
import { PhuLuc1Component } from './phu-luc-1/phu-luc-1.component';
import { PhuLuc10Component } from './phu-luc-10/phu-luc-10.component';
import { PhuLuc2Component } from './phu-luc-2/phu-luc-2.component';
import { PhuLuc3Component } from './phu-luc-3/phu-luc-3.component';
import { PhuLuc4Component } from './phu-luc-4/phu-luc-4.component';
import { PhuLuc5Component } from './phu-luc-5/phu-luc-5.component';
import { PhuLuc6Component } from './phu-luc-6/phu-luc-6.component';
import { PhuLuc7Component } from './phu-luc-7/phu-luc-7.component';
import { PhuLuc8Component } from './phu-luc-8/phu-luc-8.component';
import { PhuLuc9Component } from './phu-luc-9/phu-luc-9.component';
import { PhuLucTongHopComponent } from './phu-luc-tong-hop/phu-luc-tong-hop.component';

export class ItemCongVan {
  fileName: string;
  fileSize: number;
  fileUrl: number;
}

export class ItemData {
  id: any;
  maLoai: string;
  tenPl: string;
  tenDm: string;
  trangThai: string;
  maDviTien: string;
  lyDoTuChoi: string;
  thuyetMinh: string;
  giaoCho: string;
  lstCtietDchinh: any[];
  checked: boolean;
}

export class BaoCao {
  id: string;
  maBcao: string;
  namBcao: number;
  namHienHanh: number;
  ngayNhap: any;
  nguoiNhap: string;
  congVan: ItemCongVan;
  ngayTrinhDuyet: any;
  ngayDuyetTBP: any;
  ngayDuyetLD: any;
  ngayCapTrenTraKq: any;
  maDvi: string;
  maDviCha: string;
  maDviTien: string;
  thuyetMinh: string;
  lyDoTuChoi: string;
  dotBcao: number;
  trangThaiBaoCao: string;
  lstDchinh: ItemData[];
  lstDviTrucThuoc: any[];
  lstFiles: any[];
  fileDinhKems: any[];
  listIdFiles: string[];
  tongHopTuIds: any[];
}


@Component({
  selector: 'app-add-bao-cao',
  templateUrl: './add-bao-cao.component.html',
  styleUrls: ['./add-bao-cao.component.scss']
})
export class AddBaoCaoComponent implements OnInit {
  @Input() data;
  @Output() dataChange = new EventEmitter();

  userInfo: any;
  trangThais: any[] = TRANG_THAI_TIM_KIEM;
  canBos: any[];
  isDataAvailable = false;
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
  viewRecommendedValue = true;

  baoCao: BaoCao = new BaoCao();
  listAppendix: any[] = [];

  fileDetail: NzUploadFile;
  fileList: NzUploadFile[] = [];
  listFile: File[] = [];
  childUnit: any[] = [];
  selectedIndex = 0;

  // truoc khi upload file 
  beforeUpload = (file: NzUploadFile): boolean => {
    this.fileList = this.fileList.concat(file);
    return false;
  };

  // before uploaf file
  beforeUploadCV = (file: NzUploadFile): boolean => {
    this.fileDetail = file;
    this.baoCao.congVan = {
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
      this.baoCao.lstFiles.push({
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
    private spinner: NgxSpinnerService,
    private datePipe: DatePipe,
    private userService: UserService,
    private notification: NzNotificationService,
    private modal: NzModalService,
    public globals: Globals,
    private quanLyVonPhiService: QuanLyVonPhiService,
    private dieuChinhDuToanService: DieuChinhService,
  ) { }

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
        await this.submitReport().then(() => {
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
    this.spinner.hide();
  };

  async initialization() {
    this.spinner.show();
    this.baoCao.id = this.data?.id;
    this.userInfo = this.userService.getUserLogin();
    this.getListUser();
    await this.getChildUnit();

    if (this.baoCao.id) {
      await this.getDetailReport();
    } else {
      this.baoCao.namBcao = this.data.namBcao;
      this.baoCao.maBcao = this.data.maBao;
      this.baoCao.congVan = this.data?.congVan;
      this.baoCao.maDvi = this.data?.maDvi ? this.data?.maDvi : this.userInfo?.MA_DVI;
      this.baoCao.lstDchinh = this.data?.lstDieuChinhs ? this.data?.lstDieuChinhs : [];
      this.baoCao.lstDviTrucThuoc = this.data?.lstDviTrucThuoc ? this.data?.lstDviTrucThuoc : [];
      this.baoCao.trangThaiBaoCao = "1";
      this.baoCao.nguoiNhap = this.userInfo?.sub;
      this.baoCao.ngayNhap = this.datePipe.transform(new Date(), Utils.FORMAT_DATE_STR);
      this.baoCao.tongHopTuIds = [];
      this.baoCao.lstFiles = [];
      // this.baoCao.listIdFiles = [];
      this.baoCao.dotBcao = this.data?.dotBcao

      await this.dieuChinhDuToanService.sinhMaBaoCaoDieuChinh().toPromise().then(
        (data) => {
          if (data.statusCode == 0) {
            this.baoCao.maBcao = data.data;
          } else {
            this.notification.error(MESSAGE.ERROR, data?.msg);
          }
        },
        (err) => {
          this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
        }
      );

      if (this.baoCao.lstDviTrucThuoc.length == 0) {
        this.listAppendix = PHU_LUC
        this.listAppendix.forEach(e => {
          this.baoCao.lstDchinh.push({
            ...new ItemData(),
            id: uuid.v4() + 'FE',
            maLoai: e.id,
            tenPl: e.tenPl,
            tenDm: e.tenDm + 'năm ' + this.baoCao.namBcao,
            trangThai: "3",
            lstCtietDchinh: [],
          });
        });
      } else {
        if (this.userInfo.CAP_DVI == "2") {
          this.listAppendix = PHU_LUC
        } else {
          this.listAppendix = PHU_LUC_TH
        }
        this.baoCao?.lstDchinh.forEach(item => {
          const pl = this.listAppendix.find(e => e.id == item.maLoai);
          item.tenPl = pl.tenPl;
          item.tenDm = pl.tenDm + 'năm ' + this.baoCao.namBcao;
        })
        this.baoCao?.lstDviTrucThuoc.forEach(e => {
          if (e.ngayDuyet.includes('/')) {
            e.ngayDuyet = e.ngayDuyet;
            e.ngayPheDuyet = e.ngayPheDuyet;
          } else {
            e.ngayDuyet = this.datePipe.transform(e.ngayDuyet, Utils.FORMAT_DATE_STR);
            e.ngayPheDuyet = this.datePipe.transform(e.ngayPheDuyet, Utils.FORMAT_DATE_STR);
          }
        });
      }
    }

    this.getStatusButton();
    this.spinner.hide();
  };

  async getChildUnit() {
    const request = {
      maDviCha: this.baoCao.maDvi,
      trangThai: '01',
    }
    await this.quanLyVonPhiService.dmDviCon(request).toPromise().then(
      data => {
        if (data.statusCode == 0) {
          this.childUnit = data.data;
        } else {
          this.notification.error(MESSAGE.ERROR, data?.msg);
        }
      },
      (err) => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
      }
    )
  }

  getStatusButton() {
    const isSynthetic = this.baoCao.lstDviTrucThuoc && this.baoCao.lstDviTrucThuoc.length != 0;
    const isChild = this.userInfo.MA_DVI == this.baoCao.maDvi;
    const isParent = this.userInfo.MA_DVI == this.baoCao.maDviCha;
    //kiem tra quyen cua cac user
    const checkSave = isSynthetic ? this.userService.isAccessPermisson(DCDT.EDIT_SYNTHETIC_REPORT) : this.userService.isAccessPermisson(DCDT.EDIT_REPORT);
    const checkSunmit = isSynthetic ? this.userService.isAccessPermisson(DCDT.APPROVE_SYNTHETIC_REPORT) : this.userService.isAccessPermisson(DCDT.APPROVE_REPORT);
    const checkPass = isSynthetic ? this.userService.isAccessPermisson(DCDT.DUYET_SYNTHETIC_REPORT) : this.userService.isAccessPermisson(DCDT.DUYET_REPORT);
    const checkApprove = isSynthetic ? this.userService.isAccessPermisson(DCDT.PHE_DUYET_SYNTHETIC_REPORT) : this.userService.isAccessPermisson(DCDT.PHE_DUYET_REPORT);
    const checkAccept = this.userService.isAccessPermisson(DCDT.TIEP_NHAN_REPORT);
    const checkCopy = isSynthetic ? this.userService.isAccessPermisson(DCDT.COPY_SYNTHETIC_REPORT) : this.userService.isAccessPermisson(DCDT.COPY_REPORT);
    const checkPrint = isSynthetic ? this.userService.isAccessPermisson(DCDT.PRINT_SYTHETIC_REPORT) : this.userService.isAccessPermisson(DCDT.PRINT_REPORT);
    if (Utils.statusSave.includes(this.baoCao.trangThaiBaoCao) && checkSave) {
      this.status = false;
    } else {
      this.status = true;
    }

    this.viewRecommendedValue = Utils.statusAppraisal.includes(this.baoCao.trangThaiBaoCao);
    this.saveStatus = Utils.statusSave.includes(this.baoCao.trangThaiBaoCao) && checkSave && isChild;
    this.submitStatus = Utils.statusApprove.includes(this.baoCao.trangThaiBaoCao) && checkSunmit && isChild && !(!this.baoCao.id);
    this.passStatus = Utils.statusDuyet.includes(this.baoCao.trangThaiBaoCao) && checkPass && isChild;
    this.approveStatus = Utils.statusPheDuyet.includes(this.baoCao.trangThaiBaoCao) && checkApprove && isChild;
    this.acceptStatus = Utils.statusTiepNhan.includes(this.baoCao.trangThaiBaoCao) && checkAccept && isParent;
    this.copyStatus = Utils.statusCopy.includes(this.baoCao.trangThaiBaoCao) && checkCopy && isChild;
    this.printStatus = Utils.statusPrint.includes(this.baoCao.trangThaiBaoCao) && checkPrint && isChild;

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


  async submitReport() {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn trình duyệt?<br/>(Trình duyệt trước khi lưu báo cáo có thể gây mất dữ liệu)',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 500,
      nzOnOk: () => {
        this.onSubmit(Utils.TT_BC_2, '')
      },
    });
  }

  async getDetailReport() {
    await this.dieuChinhDuToanService.bCDieuChinhDuToanChiTiet(this.baoCao.id).toPromise().then(
      (data) => {
        if (data.statusCode == 0) {
          this.baoCao = data.data;

          this.baoCao.trangThaiBaoCao = data.data.trangThai
          this.baoCao.ngayNhap = data.data.ngayTao;
          this.baoCao.ngayTrinhDuyet = data.data.ngayTrinh;
          this.baoCao.ngayDuyetTBP = data.data.ngayDuyet;
          this.baoCao.ngayDuyetLD = data.data.ngayPheDuyet;
          this.baoCao.ngayCapTrenTraKq = data.data.ngayTraKq;
          this.baoCao.ngayNhap = this.datePipe.transform(this.baoCao.ngayNhap, Utils.FORMAT_DATE_STR);
          this.baoCao.ngayTrinhDuyet = this.datePipe.transform(this.baoCao.ngayTrinhDuyet, Utils.FORMAT_DATE_STR);
          this.baoCao.ngayDuyetTBP = this.datePipe.transform(this.baoCao.ngayDuyetTBP, Utils.FORMAT_DATE_STR);
          this.baoCao.ngayDuyetLD = this.datePipe.transform(this.baoCao.ngayDuyetLD, Utils.FORMAT_DATE_STR);
          this.baoCao.ngayCapTrenTraKq = this.datePipe.transform(this.baoCao.ngayCapTrenTraKq, Utils.FORMAT_DATE_STR);
          this.baoCao.nguoiNhap = data.data.nguoiTao;
          this.baoCao.listIdFiles = this.baoCao.listIdFiles;
          this.baoCao.lstDviTrucThuoc.forEach(item => {
            item.ngayDuyet = this.datePipe.transform(item.ngayDuyet, Utils.FORMAT_DATE_STR);
            item.ngayPheDuyet = this.datePipe.transform(item.ngayPheDuyet, Utils.FORMAT_DATE_STR);
          })
          if (this.baoCao.lstDviTrucThuoc.length == 0) {
            this.listAppendix = PHU_LUC
          } else {
            if (this.userInfo.CAP_DVI == "2") {
              this.listAppendix = PHU_LUC
            } else {
              this.listAppendix = PHU_LUC_TH
            }
          }
          this.baoCao.lstDchinh.forEach(item => {
            const appendix = this.listAppendix.find(e => e.id == item.maLoai);
            item.tenPl = appendix.tenPl;
            item.tenDm = appendix.tenDm + 'năm ' + this.baoCao.namBcao;
          })
          this.listFile = [];
          this.getStatusButton();
        } else {
          this.notification.error(MESSAGE.ERROR, data?.msg);
        }
      },
      (err) => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
      }
    );
  };

  //upload file
  async uploadFile(file: File) {
    // day file len server
    const upfile: FormData = new FormData();
    upfile.append('file', file);
    upfile.append('folder', this.baoCao.maDvi + '/' + this.baoCao.maBcao);
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
    if (!this.baoCao.lstDchinh.every(e => e.giaoCho)) {
      this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
      return;
    }
    //kiem tra kich co cua file
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
    const tongHopTuIds = []
    const baoCaoTemp = JSON.parse(JSON.stringify({
      ...this.baoCao,
      tongHopTuIds
    }));
    this.baoCao.lstDviTrucThuoc.forEach(item => {
      baoCaoTemp.tongHopTuIds.push(item.id);
    })
    if (!baoCaoTemp.fileDinhKems) {
      baoCaoTemp.fileDinhKems = [];
    }
    for (const iterator of this.listFile) {
      baoCaoTemp.fileDinhKems.push(await this.uploadFile(iterator));
    }
    if (!baoCaoTemp.congVan) {
      this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.DOCUMENTARY);
      return;
    }

    // replace nhung ban ghi dc them moi id thanh null
    baoCaoTemp.lstDchinh.forEach(item => {
      if (item.id?.length == 38) {
        item.id = null;
      }
    })

    //call service them moi
    if (!this.baoCao.id) {
      this.dieuChinhDuToanService.trinhDuyetDieuChinhService(baoCaoTemp).toPromise().then(
        async data => {
          if (data.statusCode == 0) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
            this.baoCao.id = data.data.id;
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
      this.dieuChinhDuToanService.updateDieuChinh(baoCaoTemp).toPromise().then(
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
  };

  // chuc nang check role
  async onSubmit(mcn: string, lyDoTuChoi: string) {
    if (mcn == Utils.TT_BC_2) {
      if (!this.baoCao.congVan) {
        this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.DOCUMENTARY);
        return;
      }
      if (!this.baoCao.lstDchinh.every(e => e.trangThai == '5')) {
        this.notification.warning(MESSAGE.ERROR, MESSAGE.FINISH_FORM);
        return;
      }
    } else {
      let check = true;
      if (mcn == Utils.TT_BC_4 || mcn == Utils.TT_BC_7 || mcn == Utils.TT_BC_9) {
        this.baoCao.lstDchinh.forEach(item => {
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
    const requestGroupButtons = {
      id: this.baoCao.id,
      maChucNang: mcn,
      lyDoTuChoi: lyDoTuChoi,
    };
    await this.dieuChinhDuToanService.approveDieuChinh(requestGroupButtons).toPromise().then(async (data) => {
      if (data.statusCode == 0) {
        this.baoCao.trangThaiBaoCao = mcn;
        this.getStatusButton();
        if (mcn == Utils.TT_BC_8 || mcn == Utils.TT_BC_5 || mcn == Utils.TT_BC_3) {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.REJECT_SUCCESS);
        } else {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.APPROVE_SUCCESS);
        }
        // this.tabs = [];
      } else {
        this.notification.error(MESSAGE.ERROR, data?.msg);
      }
    }, err => {
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    });
  }

  //show popup tu choi
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
    modalTuChoi.afterClose.toPromise().then(async (text) => {
      if (text) {
        this.onSubmit(mcn, text);
      }
    });
  }

  getListUser() {
    this.quanLyVonPhiService.getListUser().toPromise().then(
      res => {
        if (res.statusCode == 0) {
          this.canBos = res.data;
        }
      },
      (err) => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
    )
  };

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

  statusClass() {
    if (Utils.statusSave.includes(this.baoCao.trangThaiBaoCao)) {
      return 'du-thao-va-lanh-dao-duyet';
    } else {
      return 'da-ban-hanh';
    }
  };

  getStatusName(status: string) {
    const statusMoi = status == Utils.TT_BC_6 || status == Utils.TT_BC_7;
    const maDviCha = this.baoCao.maDvi.slice(0, (this.baoCao.maDvi.length - 2));
    if (statusMoi && this.userInfo.MA_DVI == maDviCha) {
      return "Mới";
    } else {
      return this.trangThais.find(e => e.id == status)?.tenDm;
    }
  };

  //download file về máy tính
  async downloadFileCv() {
    if (this.baoCao.congVan?.fileUrl) {
      await this.quanLyVonPhiService.downloadFile(this.baoCao.congVan?.fileUrl).toPromise().then(
        (data) => {
          fileSaver.saveAs(data, this.baoCao.congVan?.fileName);
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

  getIndex(maBieuMau: string) {
    let header = '';
    if (maBieuMau.startsWith('pl')) {
      header = 'pl';
    };
    let index = 0;
    for (let i = 0; i < this.baoCao.lstDchinh.length; i++) {
      if (this.baoCao.lstDchinh[i].maLoai.startsWith(header)) {
        index += 1;
      }
      if (this.baoCao.lstDchinh[i].maLoai == maBieuMau) {
        break;
      }
    }
    return index;
  };

  getStatusAppendixName(id) {
    return TRANG_THAI_PHU_LUC.find(item => item.id == id)?.ten
  };

  viewAppendix(formDetail: ItemData) {
    const isSynthetic = this.baoCao.lstDviTrucThuoc && this.baoCao.lstDviTrucThuoc.length != 0;
    const dataInfo = {
      data: formDetail,
      extraData: null,
      maDvi: this.baoCao.maDvi,
      namBcao: this.baoCao.namBcao,
      statusBtnOk: this.okStatus,
      statusBtnFinish: this.finishStatus,
      statusBtnPrint: this.printStatus,
      accepStatus: this.acceptStatus,
      status: this.status || !(this.userInfo?.sub == formDetail.giaoCho),
      viewRecommendedValue: this.viewRecommendedValue,
      editRecommendedValue: this.acceptStatus,
      isSynthetic: isSynthetic
    };

    dataInfo.data.maDviTien = "1";
    let nzContent: ComponentType<any>;
    switch (formDetail.maLoai) {
      case 'pl01':
        nzContent = PhuLuc1Component;
        if (isSynthetic == false) {
          if (Utils.statusSave.includes(this.baoCao.trangThaiBaoCao) || Utils.statusTiepNhan.includes(this.baoCao.trangThaiBaoCao)) {
            dataInfo.extraData = [];

            const data2 = this.baoCao.lstDchinh.find(e => e.maLoai == 'pl02');
            let dtoanKphiNamTruoc2 = 0;
            let dtoanKphiNamNay2 = 0;
            let tong2 = 0;
            let tongDtoanTrongNam2 = 0;
            let dtoanDnghiDchinh2 = 0;
            if (data2?.trangThai != '3') {
              data2?.lstCtietDchinh?.forEach(item => {
                dtoanKphiNamTruoc2 += Number(item?.dtoanSuDung);
                dtoanKphiNamNay2 += Number(item?.dtoanDaGiao);
                tong2 += Number(item?.tongCongDtoan);
                tongDtoanTrongNam2 += Number(item?.thanhTienTh);
                dtoanDnghiDchinh2 += Number(item?.dieuChinhDtoan);

                dataInfo.extraData.push({
                  stt: "0.1.1.4.1",
                  maNdung: '0.1.1.4.1',
                  dtoanKphiNamTruoc: dtoanKphiNamTruoc2,
                  dtoanKphiNamNay: dtoanKphiNamNay2,
                  tong: tong2,
                  tongDtoanTrongNam: tongDtoanTrongNam2,
                  dtoanDnghiDchinh: dtoanDnghiDchinh2,
                  dtoanVuTvqtDnghi: 0,
                })

              })
            }

            const data3 = this.baoCao.lstDchinh.find(e => e.maLoai == 'pl03');
            let dtoanKphiNamTruoc3 = 0;
            let dtoanKphiNamNay3 = 0;
            let tong3 = 0;
            let tongDtoanTrongNam3 = 0;
            let dtoanDnghiDchinh3 = 0;
            if (data3?.trangThai != '3') {
              data3?.lstCtietDchinh?.forEach(item => {
                dtoanKphiNamTruoc3 += Number(item?.dtoanKphiNtruoc);
                dtoanKphiNamNay3 += Number(item?.dtoanKphiDaGiao);
                tong3 += Number(item?.dtoanKphiCong);
                tongDtoanTrongNam3 += Number(item?.ncauKphi);
                dtoanDnghiDchinh3 += Number(item?.dtoanDchinh ? item?.dtoanDchinh : 0);

                dataInfo.extraData.push({
                  stt: "0.2.1.2",
                  maNdung: '0.2.1.2',
                  dtoanKphiNamTruoc: 0,
                  dtoanKphiNamNay: dtoanKphiNamNay3,
                  tong: tong3,
                  tongDtoanTrongNam: tongDtoanTrongNam3,
                  dtoanDnghiDchinh: dtoanDnghiDchinh3,
                  dtoanVuTvqtDnghi: 0,
                })

              })
            }

            const data4 = this.baoCao.lstDchinh.find(e => e.maLoai == 'pl04');
            if (data4?.trangThai != '3') {
              let dtoanKphiNamNay4 = 0;
              let tong4 = 0;
              let tongDtoanTrongNam4 = 0;
              let dtoanDnghiDchinh4 = 0;
              data4?.lstCtietDchinh?.forEach(item => {
                const level = item.stt.split('.').length - 2;
                if (level == 0) {
                  dtoanKphiNamNay4 += Number(item?.dtoanDaGiaoLke);
                  tong4 += Number(item?.dtoanDaGiaoLke);
                  tongDtoanTrongNam4 += Number(item?.khoachSauDchinh);
                  dtoanDnghiDchinh4 += Number(item?.dtoanDchinhDnghiLanNay ? item?.dtoanDchinhDnghiLanNay : 0);
                }
                dataInfo.extraData.push({
                  stt: "0.1.1.3",
                  maNdung: '0.1.1.3',
                  dtoanKphiNamTruoc: 0,
                  dtoanKphiNamNay: dtoanKphiNamNay4,
                  tong: tong4,
                  tongDtoanTrongNam: tongDtoanTrongNam4,
                  dtoanDnghiDchinh: dtoanDnghiDchinh4,
                  dtoanVuTvqtDnghi: 0,
                })
              })
            }

            const data5 = this.baoCao.lstDchinh.find(e => e.maLoai == 'pl05');
            if (data5?.trangThai != '3') {
              let dtoanKphiNamNay5 = 0;
              let tong5 = 0;
              let tongDtoanTrongNam5 = 0;
              let dtoanDnghiDchinh5 = 0;
              data5?.lstCtietDchinh?.forEach(item => {
                const level = item.stt.split('.').length - 2;
                if (level == 0) {
                  dtoanKphiNamNay5 += Number(item?.dtoanDaGiaoLke);
                  tong5 += Number(item?.dtoanDaGiaoLke);
                  tongDtoanTrongNam5 += Number(item?.thanhTien);
                  dtoanDnghiDchinh5 += Number(item?.dtoanDchinh ? item?.dtoanDchinh : 0);
                }
                dataInfo.extraData.push({
                  stt: "0.1.1.2.2",
                  maNdung: '0.1.1.2.2',
                  dtoanKphiNamTruoc: 0,
                  dtoanKphiNamNay: dtoanKphiNamNay5,
                  tong: tong5,
                  tongDtoanTrongNam: tongDtoanTrongNam5,
                  dtoanDnghiDchinh: dtoanDnghiDchinh5,
                  dtoanVuTvqtDnghi: 0,
                })
              })
            }

            const data6 = this.baoCao.lstDchinh.find(e => e.maLoai == 'pl06');
            if (data6?.trangThai != '3') {
              let dtoanKphiNamNay6 = 0;
              let tong6 = 0;
              let tongDtoanTrongNam6 = 0;
              let dtoanDnghiDchinh6 = 0;
              data6?.lstCtietDchinh?.forEach(item => {
                const level = item.stt.split('.').length - 2;
                if (level == 0) {
                  dtoanKphiNamNay6 += Number(item?.dtoanGiaoLke);
                  tong6 += Number(item?.dtoanGiaoLke);
                  tongDtoanTrongNam6 += Number(item?.sluongThienTtien);
                  dtoanDnghiDchinh6 += Number(item?.dtoanDchinh ? item?.dtoanDchinh : 0);
                }
                dataInfo.extraData.push({
                  stt: "0.1.1.2.3",
                  maNdung: '0.1.1.2.3',
                  dtoanKphiNamTruoc: 0,
                  dtoanKphiNamNay: dtoanKphiNamNay6,
                  tong: tong6,
                  tongDtoanTrongNam: tongDtoanTrongNam6,
                  dtoanDnghiDchinh: dtoanDnghiDchinh6,
                  dtoanVuTvqtDnghi: 0,
                })
              })
            }

            const data7 = this.baoCao.lstDchinh.find(e => e.maLoai == 'pl07');
            if (data7?.trangThai != '3') {

              let dtoanKphiNamNay7 = 0;
              let tong7 = 0;
              let tongDtoanTrongNam7 = 0;
              let dtoanDnghiDchinh7 = 0;
              data7?.lstCtietDchinh?.forEach(item => {
                dtoanKphiNamNay7 += Number(item?.dtoanLkeDaGiao);
                tong7 += Number(item?.dtoanLkeDaGiao);
                tongDtoanTrongNam7 += Number(item?.ncauDtoan);
                dtoanDnghiDchinh7 += Number(item?.dtoanDnghiDchinh ? item?.dtoanDnghiDchinh : 0);

                dataInfo.extraData.push({
                  stt: "0.1.1.2.4",
                  maNdung: '0.1.1.2.4',
                  dtoanKphiNamTruoc: 0,
                  dtoanKphiNamNay: dtoanKphiNamNay7,
                  tong: tong7,
                  tongDtoanTrongNam: tongDtoanTrongNam7,
                  dtoanDnghiDchinh: dtoanDnghiDchinh7,
                  dtoanVuTvqtDnghi: 0,
                })
              })
            }

            const data8 = this.baoCao.lstDchinh.find(e => e.maLoai == 'pl08');
            if (data8?.trangThai != '3') {
              let dtoanKphiNamTruoc8 = 0;
              let dtoanKphiNamNay8 = 0;
              let tong8 = 0;
              let tongDtoanTrongNam8 = 0;
              let dtoanDnghiDchinh8 = 0;
              data8?.lstCtietDchinh?.forEach(item => {
                const level = item.stt.split('.').length - 2;
                if (level == 0) {
                  dtoanKphiNamTruoc8 += Number(item?.kphiDtoanNtruoc);
                  dtoanKphiNamNay8 += Number(item?.kphiDtoanGiaoTnam);
                  tong8 += Number(item?.kphiCong);
                  tongDtoanTrongNam8 += item.tongNcauDtoan;
                  dtoanDnghiDchinh8 += Number(item?.dtoanDchinhDnghi ? item?.dtoanDchinhDnghi : 0);
                }
                dataInfo.extraData.push({
                  stt: "0.1.1.2.1",
                  maNdung: '0.1.1.2.1',
                  dtoanKphiNamTruoc: dtoanKphiNamTruoc8,
                  dtoanKphiNamNay: dtoanKphiNamNay8,
                  tong: tong8,
                  tongDtoanTrongNam: tongDtoanTrongNam8,
                  dtoanDnghiDchinh: dtoanDnghiDchinh8,
                  dtoanVuTvqtDnghi: 0,
                })
              })
            }

            const data9 = this.baoCao.lstDchinh.find(e => e.maLoai == 'pl09');
            if (data9?.trangThai != '3') {
              let dtoanKphiNamTruoc9 = 0;
              let dtoanKphiNamNay9 = 0;
              let tong9 = 0;
              let tongDtoanTrongNam9 = 0;
              let dtoanDnghiDchinh9 = 0;
              data9?.lstCtietDchinh?.forEach(item => {
                const level = item.stt.split('.').length - 2;
                if (level == 0) {
                  dtoanKphiNamTruoc9 += Number(item?.dtoanKphiDtoanNtruoc);
                  dtoanKphiNamNay9 += Number(item?.dtoanKphiDaGiao);
                  tong9 += Number(item?.dtoanKphiCong);
                  tongDtoanTrongNam9 += Number(item?.tongNcauTluong);
                  dtoanDnghiDchinh9 += Number(item?.dtoanDnghiDchinh ? item?.dtoanDnghiDchinh : 0);
                }
                dataInfo.extraData.push({
                  stt: "0.2.1.1",
                  maNdung: '0.2.1.1',
                  dtoanKphiNamTruoc: dtoanKphiNamTruoc9,
                  dtoanKphiNamNay: dtoanKphiNamNay9,
                  tong: tong9,
                  tongDtoanTrongNam: tongDtoanTrongNam9,
                  dtoanDnghiDchinh: dtoanDnghiDchinh9,
                  dtoanVuTvqtDnghi: 0,
                })
              })
            }

            const data10 = this.baoCao.lstDchinh.find(e => e.maLoai == 'pl10');
            if (data10?.trangThai != '3') {
              let dtoanKphiNamTruoc10 = 0;
              let dtoanKphiNamNay10 = 0;
              let tong10 = 0;
              let tongDtoanTrongNam10 = 0;
              let dtoanDnghiDchinh10 = 0;
              let dtoanVuTvqtDnghi10 = 0;
              data10?.lstCtietDchinh?.forEach(item => {
                const level = item.stt.split('.').length - 2;
                if (level == 0) {
                  dtoanKphiNamNay10 += Number(item?.dtoanGiaoLke);
                  tong10 += Number(item?.dtoanGiaoLke);
                  tongDtoanTrongNam10 += Number(item?.kh2021SauDchinh);
                  dtoanDnghiDchinh10 += Number(item?.dtoanDnghiDchinhLnay ? item?.dtoanDnghiDchinhLnay : 0);
                }
                dataInfo.extraData.push({
                  stt: "0.1.1.1",
                  maNdung: '0.1.1.1',
                  dtoanKphiNamTruoc: 0,
                  dtoanKphiNamNay: dtoanKphiNamNay10,
                  tong: tong10,
                  tongDtoanTrongNam: tongDtoanTrongNam10,
                  dtoanDnghiDchinh: dtoanDnghiDchinh10,
                  dtoanVuTvqtDnghi: 0,
                })
              })
            }


          }
        }
        break;
      case 'pl02':
        nzContent = PhuLuc2Component;
        break;
      case 'pl03':
        nzContent = PhuLuc3Component;
        break;
      case 'pl04':
        nzContent = PhuLuc4Component;
        break;
      case 'pl05':
        nzContent = PhuLuc5Component;
        break;
      case 'pl06':
        nzContent = PhuLuc6Component;
        break;
      case 'pl07':
        nzContent = PhuLuc7Component;
        break;
      case 'pl08':
        nzContent = PhuLuc8Component;
        break;
      case 'pl09':
        nzContent = PhuLuc9Component;
        break;
      case 'pl10':
        nzContent = PhuLuc10Component;
        break;
      case 'pl01TH':
        nzContent = PhuLucTongHopComponent;
        break;
      default:
        break;
    }

    const modalAppendix = this.modal.create({
      nzTitle: formDetail.tenDm,
      nzContent: nzContent,
      nzBodyStyle: { overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' },
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '90%',
      nzFooter: null,
      nzComponentParams: {
        dataInfo: dataInfo
      },
    });
    modalAppendix.afterClose.toPromise().then(async (res) => {
      if (res) {
        // gan lai thong tin sau khi bieu mau duoc luu
        const index = this.baoCao.lstDchinh.findIndex(e => e.maLoai == res.formDetail.maLoai);
        this.baoCao.lstDchinh[index] = res.formDetail;
        this.baoCao.lstDchinh[index].tenPl = formDetail.tenPl;
        this.baoCao.lstDchinh[index].tenDm = formDetail.tenDm;
      }
    });
  };

  deleteAppendix(id: string) {
    this.baoCao.lstDchinh = this.baoCao.lstDchinh.filter(item => item.id != id);
  };

  addAppendix() {
    let danhMuc = [];
    let danhSach = [];
    let title = '';
    switch (this.selectedIndex) {
      case 0:
        danhMuc = this.listAppendix.filter(e => e.id.startsWith('pl'));
        danhSach = danhMuc.filter(item => this.baoCao.lstDchinh.findIndex(e => e.maLoai == item.id) == -1);
        title = 'Danh sách phụ lục';
        break;
      default:
        break;
    }

    const modalIn = this.modal.create({
      nzTitle: title,
      nzContent: DialogChonThemBieuMauComponent,
      nzBodyStyle: { overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' },
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
            const newItem: ItemData = {
              ... new ItemData(),
              id: uuid.v4() + 'FE',
              maLoai: item.id,
              tenPl: item.tenPl,
              tenDm: item.tenDm,
              trangThai: '3',
              lstCtietDchinh: [],
            }
            this.baoCao.lstDchinh.push(newItem);
          }
        })
      }
    });
  }


  getUnitName(maDvi: string) {
    return this.childUnit.find(item => item.maDvi == maDvi)?.tenDvi;
  };


  viewDetail(id) {
    const obj = {
      id: id,
      preData: this.data,
      tabSelected: 'next' + this.data?.tabSelected,
    }
    this.dataChange.emit(obj);
  };

  //download file về máy tính
  async downloadFile(id: string) {
    const file: File = this.listFile.find(element => element?.lastModified.toString() == id);
    if (!file) {
      const fileAttach = this.baoCao.lstFiles.find(element => element?.id == id);
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

  // xoa file trong bang file
  deleteFile(id: string): void {
    this.baoCao.lstFiles = this.baoCao.lstFiles.filter((a: any) => a.id !== id);
    this.listFile = this.listFile.filter((a: any) => a?.lastModified.toString() !== id);
    this.baoCao.listIdFiles.push(id);
  };

}
