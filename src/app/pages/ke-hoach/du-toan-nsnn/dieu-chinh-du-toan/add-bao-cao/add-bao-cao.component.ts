import { ComponentType } from '@angular/cdk/portal';
import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as fileSaver from 'file-saver';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogChonThemBieuMauComponent } from 'src/app/components/dialog/dialog-chon-them-bieu-mau/dialog-chon-them-bieu-mau.component';
import { MESSAGE } from 'src/app/constants/message';
import { DieuChinhService } from 'src/app/services/quan-ly-von-phi/dieuChinhDuToan.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';
import { DCDT, TRANG_THAI_PHU_LUC, TRANG_THAI_TIM_KIEM, Utils } from 'src/app/Utility/utils';
import * as uuid from 'uuid';
import { PHU_LUC } from './add-bao-cao.constant';
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
  listIdFiles: any[];
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
  listAppendix: any[] = PHU_LUC;

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
    this.spinner.hide();
  };

  async initialization() {
    this.spinner.show();
    this.baoCao.id = this.data?.id;
    this.userInfo = this.userService.getUserLogin();
    this.getListUser();

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
      this.baoCao.listIdFiles = [];
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
    }

    if (this.baoCao.lstDviTrucThuoc.length == 0) {
      this.listAppendix.forEach(e => {
        this.baoCao.lstDchinh.push({
          ...new ItemData(),
          id: uuid.v4() + 'FE',
          maLoai: e.id,
          tenPl: e.tenPl,
          tenDm: e.tenDm + 'năm' + this.baoCao.namBcao,
          trangThai: "3",
          lstCtietDchinh: [],
        });
      });
    } else {
      this.baoCao?.lstDviTrucThuoc.forEach(e => {
        if (e.ngayDuyetTBP.includes('/')) {
          e.ngayDuyetTBP = e.ngayDuyetTBP;
          e.ngayDuyetLD = e.ngayDuyetLD;
        } else {
          e.ngayDuyetTBP = this.datePipe.transform(e.ngayDuyetTBP, Utils.FORMAT_DATE_STR);
          e.ngayDuyetLD = this.datePipe.transform(e.ngayDuyetLD, Utils.FORMAT_DATE_STR);
        }
      });
    }
    this.getStatusButton();
    this.spinner.hide();
  };

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

  async getDetailReport() {

  };

  async save() {

  };

  async onSubmit(mcn: string, lyDoTuChoi: string) {

  };

  async tuChoi(mcn: string) {

  };

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
