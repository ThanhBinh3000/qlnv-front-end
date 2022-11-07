import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { Globals } from 'src/app/shared/globals';
import { TRANG_THAI_TIM_KIEM, Utils } from 'src/app/Utility/utils';
import * as fileSaver from 'file-saver';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MESSAGE } from 'src/app/constants/message';
import { BAO_CAO_CHI_TIET_THUC_HIEN_PHI_NHAP_HANG_DTQG, BAO_CAO_CHI_TIET_THUC_HIEN_PHI_XUAT_HANG_CUU_TRO_VIEN_TRO, BAO_CAO_CHI_TIET_THUC_HIEN_PHI_XUAT_HANG_DTQG, KHAI_THAC_BAO_CAO_CHI_TIET_THUC_HIEN_PHI_BAO_QUAN_LAN_DAU_HANG_DTQG, PHU_LUC } from './bao-cao.constant';
import { NzModalService } from 'ng-zorro-antd/modal';
import { DialogChonThemBieuMauComponent } from 'src/app/components/dialog/dialog-chon-them-bieu-mau/dialog-chon-them-bieu-mau.component';
import * as uuid from "uuid";
import { DialogDieuChinhCopyComponent } from 'src/app/components/dialog/dialog-dieu-chinh-copy/dialog-dieu-chinh-copy.component';
import { DialogCopyComponent } from 'src/app/components/dialog/dialog-copy/dialog-copy.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { DatePipe } from '@angular/common';
import { UserService } from 'src/app/services/user.service';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';

export class ItemDanhSach {
  id!: any;
  maBcao!: string;
  namBcao!: number;
  dotBcao!: number;
  trangThai!: string;
  ngayTao!: string;
  nguoiTao!: string;
  maDviTien!: string;
  maDvi: number;
  congVan!: ItemCongVan;
  ngayTrinh!: string;
  ngayDuyet!: string;
  ngayPheDuyet!: string;
  ngayTraKq!: string;
  // dung cho request
  fileDinhKems!: any[];
  listIdDeletes!: string;
  listIdDeleteFiles = '';
  // maPhanBcao = "1";

  maLoaiBcao!: string;
  stt!: string;
  checked!: boolean;
  lstBcaos: ItemData[] = [];
  lstFile: any[] = [];
  lstBcaoDviTrucThuocs: any[] = [];
  tongHopTuIds!: [];
}

export class ItemData {
  id!: any;
  maLoai!: string;
  maDviTien!: any;
  lstCtietBcaos!: any;
  trangThai!: string;
  checked!: boolean;
  tenDm!: string;
  tenPl!: string;
  thuyetMinh!: string;
  lyDoTuChoi!: string;
  lstIdDeletes!: [];
  nguoiBcao!: string;
  bcaoId!: string;
  tuNgay: string;
  denNgay: string;
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

  userInfo: any;
  donVis: any = [];

  isDataAvailable = false;
  saveStatus = true;
  submitStatus = true;
  passStatus = true;
  approveStatus = true;
  acceptStatus = true;
  copyStatus = true;
  status = false;
  allChecked = false;
  okStatus = true;
  exportStatus = true;
  finishStatus = true;

  baoCao: ItemDanhSach = new ItemDanhSach();
  tabData: any;
  fileDetail: NzUploadFile;
  congVan: ItemCongVan = new ItemCongVan();
  fileList: NzUploadFile[] = [];
  lstFiles: any = [];
  listFile: File[] = [];
  listIdFilesDelete: string[] = [];

  selectedIndex = 1;
  tabSelected: string;
  tabs: any[] = [];
  trangThais: any[] = TRANG_THAI_TIM_KIEM;

  nguoiBcaos: any[];
  phuLucs: any[] = JSON.parse(JSON.stringify(PHU_LUC));

  constructor(
    public globals: Globals,
    private quanLyVonPhiService: QuanLyVonPhiService,
    private notification: NzNotificationService,
    private modal: NzModalService,
    private spinner: NgxSpinnerService,
    private datePipe: DatePipe,
    private userService: UserService,
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
    //lay thong tin chung bao cao
    this.baoCao.id = this.data?.id;
    this.baoCao.dotBcao = this.data?.dotBcao;
    this.baoCao.namBcao = this.data?.nambao;
    this.userInfo = this.userService.getUserLogin();

    this.getListUser();
    if (this.baoCao.id) {
      await this.getDetailReport();
    } else {
      this.baoCao.maDvi = this.userInfo?.MA_DVI;
      this.quanLyVonPhiService.sinhMaBaoCaoDieuChinh().toPromise().then(
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
      // this.baoCao.maLoaiBcao = this.data?.maLoaiBcao;
      this.baoCao.namBcao = this.data?.namBcao;
      this.baoCao.dotBcao = this.data?.dotBcao == 0 ? null : this.data?.dotBcao;
      this.baoCao.nguoiTao = this.userInfo.sub;
      this.baoCao.ngayTao = this.datePipe.transform(new Date(), Utils.FORMAT_DATE_STR);
      this.baoCao.trangThai = "1";
      this.phuLucs = PHU_LUC;
      if (this.data?.isSynthetic) {
        await this.callSynthetic();
      } else {
        this.phuLucs.forEach(item => {
          this.baoCao.lstBcaos.push({
            id: uuid.v4() + 'FE',
            checked: false,
            tenDm: item.tenDm,
            maLoai: item.maPhuLuc,
            tenPl: item.tenPl,
            trangThai: '3',
            lstCtietBcaos: [],
            maDviTien: '1',
            thuyetMinh: null,
            lyDoTuChoi: null,
            lstIdDeletes: [],
            nguoiBcao: null,
            bcaoId: this.baoCao.id,
            tuNgay: '',
            denNgay: '',
          });
        })
      }
    }
    //lay danh sach danh muc don vi
    await this.getDviCon();
    this.getStatusButton();
    this.spinner.hide();
  };

  async getDviCon() {
    const request = {
      maDviCha: this.userInfo?.MA_DVI,
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
  }

  async getDetailReport() {
    this.spinner.show();
    await this.quanLyVonPhiService.bCDieuChinhDuToanChiTiet(this.data.id).toPromise().then(
      (data) => {
        if (data.statusCode == 0) {
          this.baoCao = data.data;
          this.phuLucs = PHU_LUC;
          this.lstFiles = data.data.lstFiles;
          this.listFile = [];

          this.baoCao?.lstBcaos?.forEach(item => {
            const index = this.phuLucs.findIndex(data => data.id == item.maLoai);
            if (index != -1) {
              item.checked = false;
              item.tenPl = this.phuLucs[index].tenPl;
              item.tenDm = this.phuLucs[index].tenDm;
            }
          })
          // set thong tin chung bao cao
          this.baoCao.namBcao = data.data.namBcao;
          this.lstFiles = data.data.lstFiles;
          this.listFile = [];
          this.baoCao.ngayDuyet = this.datePipe.transform(data.data.ngayDuyet, Utils.FORMAT_DATE_STR);
          this.baoCao.ngayPheDuyet = this.datePipe.transform(data.data.ngayPheDuyet, Utils.FORMAT_DATE_STR);
          this.baoCao.ngayTraKq = this.datePipe.transform(data.data.ngayTraKq, Utils.FORMAT_DATE_STR);
          this.baoCao.ngayTrinh = this.datePipe.transform(data.data.ngayTrinh, Utils.FORMAT_DATE_STR);
          this.baoCao.ngayTao = this.datePipe.transform(data.data.ngayTao, Utils.FORMAT_DATE_STR);
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

  async save() {
    const baoCaoTemp = JSON.parse(JSON.stringify(this.baoCao));
    //get list file url
    const listFile: any = [];
    for (const iterator of this.listFile) {
      listFile.push(await this.uploadFile(iterator));
    }
    //get file cong van url
    const file: any = this.fileDetail;
    if (file) {
      baoCaoTemp.congVan = await this.uploadFile(file);
    }
    if (!baoCaoTemp.congVan) {
      this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.DOCUMENTARY);
      return;
    }

    let checkPersonReport = true;
    /////////////////////////////
    baoCaoTemp.lstBcaos.forEach((item) => {
      item.tuNgay = typeof item.tuNgay == 'string' ? new Date(item.tuNgay) : item.tuNgay;
      item.denNgay = typeof item.denNgay == 'string' ? new Date(item.denNgay) : item.denNgay;
      if (!item.nguoiBcao) {
        checkPersonReport = false;
        this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.PERSONREPORT);
        return;
      }
      if (item.id?.length == 38) {
        item.id = null;
      }
      if (!this.baoCao.id) {
        item.trangThai = '3'; // set trang thai phu luc la chua danh gia
      }
      item.lstCtietBcaos.forEach(data => {
        if (data?.id.length == 38) {
          data.id = null;
        }
        if (
          data.maLoai == BAO_CAO_CHI_TIET_THUC_HIEN_PHI_XUAT_HANG_DTQG ||
          data.maLoai == BAO_CAO_CHI_TIET_THUC_HIEN_PHI_NHAP_HANG_DTQG ||
          data.maLoai == BAO_CAO_CHI_TIET_THUC_HIEN_PHI_XUAT_HANG_CUU_TRO_VIEN_TRO ||
          data.maLoai == KHAI_THAC_BAO_CAO_CHI_TIET_THUC_HIEN_PHI_BAO_QUAN_LAN_DAU_HANG_DTQG
        ) {
          data.listCtiet.forEach(element => {
            if (element?.id.length == 38) {
              element.id = null;
            }
          })
        }
      })
    });

    if (!checkPersonReport) {
      return;
    } else {
      // replace nhung ban ghi dc them moi id thanh null
      baoCaoTemp.tongHopTuIds = [];
      baoCaoTemp?.lstBcaoDviTrucThuocs?.filter(item => {
        baoCaoTemp.tongHopTuIds.push(item.id);
      })

      baoCaoTemp.fileDinhKems = listFile;
      baoCaoTemp.listIdFiles = this.listIdFilesDelete;
      baoCaoTemp.trangThai = "1";
      //baoCaoTemp.maDvi = this.maDonViTao;
      baoCaoTemp.maPhanBcao = '1';

      //call service them moi
      if (!this.baoCao.id) {
        //net la tao bao cao moi thi khong luu lstCtietBcaos, con la tong hop thi khong luu
        if (!this.data?.isSynthetic) {
          baoCaoTemp?.lstBcaos?.filter(item => item.lstCtietBcaos = []);
        }
        await this.quanLyVonPhiService.trinhDuyetDieuChinhService(baoCaoTemp).toPromise().then(
          async data => {
            if (data.statusCode == 0) {
              this.notification.success(MESSAGE.SUCCESS, MESSAGE.SUCCESS);
              this.baoCao.id = data.data.id
              await this.getDetailReport();
              this.getStatusButton();
            } else {
              this.notification.error(MESSAGE.ERROR, data?.msg);
            }
          },
          err => {
            this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
          },
        );
      } else {
        await this.quanLyVonPhiService.updateDieuChinh(baoCaoTemp).toPromise().then(async res => {
          if (res.statusCode == 0) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.SUCCESS);
            await this.getDetailReport();
            this.getStatusButton();
          } else {
            this.notification.error(MESSAGE.ERROR, res?.msg);
          }
        }, err => {
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        })
      }
    }
    this.spinner.hide();
  };

  async onSubmit(mcn: string, lyDoTuChoi: string) {

  };

  async tuChoi(mcn: string) {

  };

  getStatusButton() {

  };

  // call tong hop dieu chinh
  async callSynthetic() {
    const request = {
      dotBcao: this.baoCao.dotBcao,
      namBcao: this.baoCao.namBcao,
    }
    this.spinner.show();
    await this.quanLyVonPhiService.tongHopDieuChinhDuToan(request).toPromise().then(
      (data) => {
        if (data.statusCode == 0) {
          this.baoCao.lstBcaos = data.data.lstDchinhs;
          this.baoCao.lstBcaoDviTrucThuocs = data.data.lstDchinhDviTrucThuocs;
          this.baoCao.lstBcaos.forEach(item => {
            if (!item.id) {
              item.id = uuid.v4() + 'FE';
            }
            item.nguoiBcao = this.userInfo?.sub;
            item.maDviTien = '1';
          })
          this.baoCao.lstBcaoDviTrucThuocs.forEach(item => {
            item.ngayDuyet = this.datePipe.transform(item.ngayDuyet, Utils.FORMAT_DATE_STR);
            item.ngayPheDuyet = this.datePipe.transform(item.ngayPheDuyet, Utils.FORMAT_DATE_STR);
          })
        } else {
          this.notification.error(MESSAGE.ERROR, data?.msg);
        }
      },
      (err) => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
      }
    );
    this.spinner.hide();
  }

  getListUser() {
    this.quanLyVonPhiService.getListUser().toPromise().then(
      res => {
        if (res.statusCode == 0) {
          this.nguoiBcaos = res.data;
        }
      },
      (err) => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      })
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

  closeTab({ index }: { index: number }): void {
    this.tabs.splice(index - 1, 1);
  }

  showDialogCopy() {
    const obj = {
      namBcao: this.baoCao.namBcao,
      dotBcao: this.baoCao.dotBcao,
      loaiCopy: '',
      checkDvtt: this.baoCao.lstBcaoDviTrucThuocs.length > 0 ? true : false,
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
  }

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
    const baoCaoTemp = JSON.parse(JSON.stringify(this.baoCao));
    baoCaoTemp.congVan = null;
    baoCaoTemp.namBcao = response.namBcao;
    baoCaoTemp.dotBcao = response.dotBcao;
    if (response.loaiCopy == 'D') {
      //xoa lst don vi truc thuoc theo lua chon tu dialog
      baoCaoTemp.lstBcaoDviTrucThuocs = [];
    }
    // replace nhung ban ghi dc them moi id thanh null
    baoCaoTemp?.lstBcaos?.filter(item => {
      item.id = null;
      item.listIdDelete = null;
      item.trangThai = '3'; // set trang thai phu luc la chua danh gia
      item?.lstCtietBcaos.filter(data => {
        data.id = null;
      })
    })

    // replace nhung ban ghi dc them moi id thanh null
    baoCaoTemp.id = null;
    baoCaoTemp.maBcao = maBcaoNew;
    baoCaoTemp.tongHopTuIds = [];
    baoCaoTemp?.lstBcaoDviTrucThuocs?.filter(item => {
      baoCaoTemp.tongHopTuIds.push(item.id);
    })
    baoCaoTemp.fileDinhKems = [];
    baoCaoTemp.listIdFiles = null;
    baoCaoTemp.trangThai = "1";

    this.quanLyVonPhiService.trinhDuyetDieuChinhService(baoCaoTemp).toPromise().then(
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

  statusClass() {
    if (Utils.statusSave.includes(this.baoCao.trangThai)) {
      return 'du-thao-va-lanh-dao-duyet';
    } else {
      return 'da-ban-hanh';
    }
  };

  getStatusName(status: string) {
    const statusMoi = status == Utils.TT_BC_6 || status == Utils.TT_BC_7;
    const isParent = this.donVis.findIndex(e => e.maDvi == this.baoCao.maDvi) != -1;
    if (statusMoi && isParent) {
      return 'Mới';
    } else {
      return this.trangThais.find(e => e.id == status)?.tenDm;
    }
  }

  getNewData(obj: any) {
    const index = this.baoCao?.lstBcaos.findIndex(e => e.maLoai == this.tabs[0].maLoai);
    if (obj?.lstCtietBcaos) {
      this.baoCao.lstBcaos[index].maDviTien = obj.maDviTien;
      this.baoCao.lstBcaos[index].lstCtietBcaos = obj.lstCtietBcaos;
      this.baoCao.lstBcaos[index].trangThai = obj.trangThai;
      this.baoCao.lstBcaos[index].thuyetMinh = obj.thuyetMinh;
      this.baoCao.lstBcaos[index].lyDoTuChoi = obj.lyDoTuChoi;
      this.baoCao.lstBcaos[index].tuNgay = obj.tuNgay;
      this.baoCao.lstBcaos[index].denNgay = obj.denNgay;
      this.tabs = [];
      this.tabs.push(this.baoCao?.lstBcaos.find(e => e.maLoai == this.baoCao?.lstBcaos[index].maLoai));
      this.selectedIndex = this.tabs.length + 1;
    } else {
      this.baoCao.lstBcaos[index].trangThai = obj?.trangThai;
      this.baoCao.lstBcaos[index].lyDoTuChoi = obj?.lyDoTuChoi;
    }
  };

  addPhuLuc() {
    this.phuLucs.forEach(item => item.status = false);
    const danhSach = this.phuLucs.filter(item => this.baoCao?.lstBcaos?.findIndex(e => e.maLoai == item.id) == -1);
    const modalIn = this.modal.create({
      nzTitle: 'Danh sách mẫu báo cáo',
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
            this.baoCao.lstBcaos.push({
              id: uuid.v4() + 'FE',
              checked: false,
              tenDm: item.tenDm,
              maLoai: item.maPhuLuc,
              tenPl: item.tenPl,
              trangThai: '3',
              lstCtietBcaos: [],
              maDviTien: '1',
              thuyetMinh: null,
              lyDoTuChoi: null,
              lstIdDeletes: [],
              nguoiBcao: null,
              bcaoId: this.baoCao.id,
              tuNgay: '',
              denNgay: '',
            });
          }
        })
      }
    });
  };

  deletePhuLucList() {
    this.baoCao.lstBcaos = this.baoCao?.lstBcaos.filter(item => item.checked == false);
    if (this.baoCao?.lstBcaos?.findIndex(item => item.maLoai == this.tabSelected) == -1) {
      this.tabSelected = null;
    }
    this.allChecked = false;
  };

  getStatusAppendixName(id) {
    const utils = new Utils();
    return utils.getStatusAppendixName(id);
  };


  newTab(maPhuLuc: any): void {
    const index: number = this.tabs.findIndex(e => e.id === maPhuLuc);
    if (index != -1) {
      this.selectedIndex = index + 1;
    } else {
      const item = this.baoCao.lstBcaos.find(e => e.maLoai == maPhuLuc);
      this.tabData = {
        ...item,
        trangThaiBaoCao: this.baoCao.trangThai,
        statusBtnOk: this.okStatus,
        statusBtnFinish: this.finishStatus,
        statusBtnExport: this.exportStatus,
        status: this.status,
        idBaoCao: this.baoCao.id,
        namBcao: this.baoCao.namBcao,
        maDvi: this.baoCao.maDvi,
      }
      this.tabs = [];
      this.tabs.push(this.baoCao?.lstBcaos.find(item => item.maLoai == maPhuLuc));
      this.selectedIndex = this.tabs.length + 1;
    }
  };

  updateSingleChecked(): void {
    if (this.baoCao?.lstBcaos.every(item => !item.checked)) {           // tat ca o checkbox deu = false thi set o checkbox all = false
      this.allChecked = false;
    } else if (this.baoCao?.lstBcaos.every(item => item.checked)) {     // tat ca o checkbox deu = true thi set o checkbox all = true
      this.allChecked = true;
    }
  };

  updateAllChecked(): void {
    this.baoCao?.lstBcaos.filter(item =>
      item.checked = this.allChecked
    );
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

  // them file vao danh sach
  handleUpload(): void {
    this.fileList.forEach((file: any) => {
      const id = file?.lastModified.toString();
      this.lstFiles.push({ id: id, fileName: file?.name });
      this.listFile.push(file);
    });
    this.fileList = [];
  }

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
  }

  //download file về máy tính
  async downloadFileCv() {
    if (this.baoCao?.congVan?.fileUrl) {
      await this.quanLyVonPhiService.downloadFile(this.baoCao?.congVan?.fileUrl).toPromise().then(
        (data) => {
          fileSaver.saveAs(data, this.baoCao?.congVan?.fileName);
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

  // xoa file trong bang file
  deleteFile(id: string): void {
    this.lstFiles = this.lstFiles.filter((a: any) => a.id !== id);
    this.listFile = this.listFile.filter((a: any) => a?.lastModified.toString() !== id);
    this.listIdFilesDelete.push(id);
  }

  // before uploaf file
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


}
