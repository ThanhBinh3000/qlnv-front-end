import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as fileSaver from 'file-saver';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { CapVonNguonChiService } from 'src/app/services/quan-ly-von-phi/capVonNguonChi.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';
import { AMOUNT, BOX_NUMBER_WIDTH, CAN_CU_GIA, CVNC, DON_VI_TIEN, FileManip, LOAI_DE_NGHI, Operator, QUATITY, Roles, Status, Table, Utils } from 'src/app/Utility/utils';
import { Dncv, ItemContract, ItemRequest, Report, Times, TRANG_THAI } from '../../../de-nghi-cap-von.constant';
import * as XLSX from 'xlsx';
import { BtnStatus } from '../../../de-nghi-cap-von.class';
import { Ltd } from 'src/app/pages/ke-hoach/du-toan-nsnn/lap-ke-hoach-va-tham-dinh-du-toan/lap-ke-hoach-va-tham-dinh-du-toan.constant';
import * as uuid from "uuid";
@Component({
  selector: 'app-hop-dong-cap-von',
  templateUrl: './hop-dong-cap-von.component.html',
  styleUrls: ['./hop-dong-cap-von.component.scss']
})

export class HopDongCapVonComponent implements OnInit {
  @Input() data;
  @Output() dataChange = new EventEmitter();
  Op = new Operator('1');
  Dncv = Dncv;
  //thong tin dang nhap
  userInfo: any;
  //thong tin chung bao cao
  baoCao: Report = new Report();
  lstCtiets: ItemContract[] = [];
  total: ItemContract = new ItemContract();
  isParent: boolean = false;
  //danh muc
  donVis: any[] = [];
  trangThais: any[] = TRANG_THAI;
  loaiDns: any[] = LOAI_DE_NGHI;
  canCuGias: any[] = CAN_CU_GIA;
  dviTinhs: any[] = [];
  vatTus: any[] = [];
  dviTiens: any[] = DON_VI_TIEN;
  amount = AMOUNT;
  quatity = QUATITY;
  scrollX: string;
  //trang thai cac nut
  status: BtnStatus = new BtnStatus();
  isDataAvailable = false;
  editCache: { [key: string]: { edit: boolean; data: ItemContract } } = {};
  //file
  listFile: File[] = [];
  fileList: NzUploadFile[] = [];
  fileDetail: NzUploadFile;
  selectedIndex = 0;
  listAppendix: any[] = Ltd.PHU_LUC;
  Status = Status;
  canBos: any[];
  idCallChitiet!: string;
  idCallChitietCapVon!: string;
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

  // them file vao danh sach
  handleUpload(): void {
    this.fileList.forEach((file: any) => {
      const id = file?.lastModified.toString();
      this.baoCao.lstFiles.push({ id: id, fileName: file?.name });
      this.listFile.push(file);
    });
    this.fileList = [];
  }

  constructor(
    private quanLyVonPhiService: QuanLyVonPhiService,
    private capVonNguonChiService: CapVonNguonChiService,
    private danhMuc: DanhMucHDVService,
    private spinner: NgxSpinnerService,
    private datePipe: DatePipe,
    public userService: UserService,
    private notification: NzNotificationService,
    private modal: NzModalService,
    public globals: Globals,
    private fileManip: FileManip,
  ) { }

  async ngOnInit() {
    this.action('init');
  }

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
      default:
        break;
    }
    this.spinner.hide();
  }


  async initialization() {
    //lay id cua de nghi
    this.userInfo = this.userService.getUserLogin();
    if (this.data?.id) {
      this.baoCao.id = this.data?.id;
      await this.getDetailReport();
    } else {
      this.baoCao = this.data?.baoCao;
      this.lstCtiets = this.baoCao.lstCtiets;
      this.lstCtiets = Table.sortByIndex(this.lstCtiets)
      this.setLevel();
      this.sum('0.1')
    }
    this.updateEditCache();
    this.getStatusButton();
    // this.getTotal();
  }

  getStatusButton() {
    const checkChirld = this.baoCao.maDvi == this.userInfo?.MA_DVI;
    this.isParent = this.baoCao.maDviCha == this.userInfo?.MA_DVI;

    this.status.save = Status.check('saveWHist', this.baoCao.trangThai) && checkChirld
    this.status.general = Utils.statusSave.includes(this.baoCao.trangThai) && this.userService.isAccessPermisson(CVNC.EDIT_DN_MLT) && !this.userService.isTongCuc();
    this.status.congVan = Utils.statusSave.includes(this.baoCao.trangThai) && this.userService.isAccessPermisson(CVNC.EDIT_DN_MLT);
    // this.status.save = Utils.statusSave.includes(this.baoCao.trangThai) && this.userService.isAccessPermisson(CVNC.EDIT_DN_MLT) && checkChirld;
    this.status.submit = Utils.statusApprove.includes(this.baoCao.trangThai) && this.userService.isAccessPermisson(CVNC.APPROVE_DN_MLT) && checkChirld && !(!this.baoCao.id);
    this.status.approve = this.baoCao.trangThai == Utils.TT_BC_2 && this.userService.isAccessPermisson(CVNC.PHE_DUYET_DN_MLT) && checkChirld;
    this.status.copy = Utils.statusCopy.includes(this.baoCao.trangThai) && this.userService.isAccessPermisson(CVNC.COPY_DN_MLT) && checkChirld;

    this.status.save = this.status.save && this.userService.isAccessPermisson(Roles.CVNC.EDIT_DN_MLT)
    if (this.status.general) {
      this.scrollX = (550 + 14 * BOX_NUMBER_WIDTH).toString() + 'px';
    } else {
      this.scrollX = (500 + 14 * BOX_NUMBER_WIDTH).toString() + 'px';
    }
  }

  back() {
    const obj = {
      tabSelected: 'ds-capvon',
    }
    this.dataChange.emit(obj);
  }

  setLevel() {
    this.lstCtiets.forEach(item => {
      item.level = item.stt.split('.').length - 2;
    })
  }

  getStatusName() {
    return this.trangThais.find(e => e.id == this.baoCao.trangThai)?.tenDm;
  }

  getDate(date: any) {
    return this.datePipe.transform(date, Utils.FORMAT_DATE_STR);
  }

  // call chi tiet bao cao
  async getDetailReport() {
    await this.capVonNguonChiService.ctietDeNghi(this.baoCao.id).toPromise().then(
      (data) => {
        if (data.statusCode == 0) {
          this.baoCao = data.data;
          this.lstCtiets = [];
          data.data.lstCtiets.forEach((item) => {
            this.lstCtiets.push({ ... new ItemContract(), ...item })
          })
          this.lstCtiets = Table.sortByIndex(this.lstCtiets)
          this.setLevel()
          this.listFile = [];
          this.updateEditCache();
          this.getStatusButton();
        } else {
          this.notification.error(MESSAGE.ERROR, data?.msg);
        }
      },
      (err) => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
    )
  }

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
        this.onSubmit(Status.TT_02, '')
      },
    });
  }

  // chuc nang check role
  async onSubmit(mcn: string, lyDoTuChoi?: string) {
    const requestGroupButtons = {
      id: this.baoCao.id,
      maChucNang: mcn,
      lyDoTuChoi: lyDoTuChoi,
    };
    await this.capVonNguonChiService.trinhDeNghi(requestGroupButtons).toPromise().then(async (data) => {
      if (data.statusCode == 0) {
        this.baoCao.trangThai = mcn;
        this.getStatusButton();
        if (Status.check('reject', mcn)) {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.REJECT_SUCCESS);
        } else {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.APPROVE_SUCCESS);
        }
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
    modalTuChoi.afterClose.subscribe(async (text) => {
      if (text) {
        this.onSubmit(mcn, text);
      }
    });
  }

  // upperBound() {
  //   return this.gt > Utils.MONEY_LIMIT || this.gtHopDong > Utils.MONEY_LIMIT || this.gtriHdSauVat > Utils.MONEY_LIMIT || this.luyKeCong > Utils.MONEY_LIMIT || this.luyKeCapUng > Utils.MONEY_LIMIT;
  // }

  request() {
    const temp = Object.assign({}, this);
    if (this.baoCao.id?.length == 38) {
      temp.baoCao.id = null;
    }
    return temp;
  }

  //   upperBound() {
  //     return this.gtKeHoach > Utils.MONEY_LIMIT 
  //     || this.gtHopDong > Utils.MONEY_LIMIT 
  //     || this.gtThucHien > Utils.MONEY_LIMIT 
  //     || this.lkCong > Utils.MONEY_LIMIT 
  //     || this.lkSauLanNay > Utils.MONEY_LIMIT;
  // }

  // luu
  async save() {

    if (this.lstCtiets.some(e => this.editCache[e.id].edit)) {
      this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTSAVE);
      return;
    }

    // if (this.lstCtiets.some(e => e.upperBound())) {
    //   this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.MONEYRANGE);
    //   return;
    // }

    if (this.listFile.some(file => file.size > Utils.FILE_SIZE)) {
      this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.OVER_SIZE);
      return;
    }

    const lstCtietTemp: ItemContract[] = [];
    this.lstCtiets.forEach(item => {
      lstCtietTemp.push(item)
    })
    const request = JSON.parse(JSON.stringify(this.baoCao));
    request.maLoai = '0';
    request.maDviTien = '1';
    request.lstCtiets = lstCtietTemp;
    request.fileDinhKems = [];
    for (let iterator of this.listFile) {
      // request.fileDinhKems.push(await this.fileManip.uploadFile(iterator, this.baoCao.maDvi + '/' + this.baoCao.maCapUng));
    }

    if (!this.baoCao.id) {
      this.capVonNguonChiService.taoMoiDeNghi(request).toPromise().then(
        async (data) => {
          if (data.statusCode == 0) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
            this.baoCao.id = data.data.id;
            this.action('detail');
          } else {
            this.notification.error(MESSAGE.ERROR, data?.msg);
          }
        },
        (err) => {
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        },
      );
    } else {
      this.capVonNguonChiService.updateDeNghi(request).toPromise().then(
        async (data) => {
          if (data.statusCode == 0) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
            this.action('detail');
          } else {
            this.notification.error(MESSAGE.ERROR, data?.msg);
          }
        },
        (err) => {
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        },
      );
    }
  }

  updateEditCache(): void {
    this.lstCtiets.forEach(item => {
      this.editCache[item.id] = {
        edit: false,
        data: ({
          ... new ItemContract(),
          ...item
        })
      };
    });
  }

  startEdit(id: string): void {
    this.editCache[id].edit = true;
  }

  // huy thay doi
  cancelEdit(id: string): void {
    const index = this.lstCtiets.findIndex(item => item.id === id);
    // lay vi tri hang minh sua
    this.editCache[id] = {
      data: { ... this.lstCtiets[index] },
      edit: false
    };
  }

  // luu thay doi
  saveEdit(id: string): void {
    const index = this.lstCtiets.findIndex(item => item.id === id); // lay vi tri hang minh sua
    Object.assign(this.lstCtiets[index], this.editCache[id].data); // set lai data cua lstCtietBcao[index] = this.editCache[id].data
    this.editCache[id].edit = false; // CHUYEN VE DANG TEXT
    this.sum(Table.preIndex(this.lstCtiets[index].stt));
    this.updateEditCache()
  }

  // changeModel(data: ItemContract) {
  //   // this.editCache[data.id].data.changeModel(false, data);
  // }

  changeModel(id: string) {
    this.editCache[id].data.tongVonVaDtDaCap = Operator.sum([this.editCache[id].data.duToanDaGiao, this.editCache[id].data.luyKeCong]);
    this.editCache[id].data.vonDnghiCapLanNay = Operator.sum([this.editCache[id].data.gtHopDong, -this.editCache[id].data.tongVonVaDtDaCap]);
    this.editCache[id].data.vonDuyetCong = Operator.sum([this.editCache[id].data.vonDuyetCapUng, this.editCache[id].data.vonDuyetCapVon]);
    this.editCache[id].data.tongCap = Operator.sum([this.editCache[id].data.tongVonVaDtDaCap, this.editCache[id].data.vonDuyetCong]);
    this.editCache[id].data.soConDuocCap = Operator.sum([this.editCache[id].data.gtHopDong, -this.editCache[id].data.tongCap]);
  }

  sum(stt: string) {
    while (stt != '0') {
      const index = this.lstCtiets.findIndex(e => e.stt == stt);
      this.lstCtiets[index].slKeHoach = null;
      this.lstCtiets[index].slHopDong = null;
      this.lstCtiets[index].gtHopDong = null;
      this.lstCtiets[index].viPhamHopDong = null;
      this.lstCtiets[index].thanhLyHdongSl = null;
      this.lstCtiets[index].thanhLyHdongTt = null;
      // this.lstCtiets[index].tlThanhTien = null;
      this.lstCtiets.forEach(item => {
        if (Table.preIndex(item.stt) == stt) {
          this.lstCtiets[index].slKeHoach = Operator.sum([this.lstCtiets[index].slKeHoach, item.slKeHoach]);
          this.lstCtiets[index].slHopDong = Operator.sum([this.lstCtiets[index].slHopDong, item.slHopDong]);
          this.lstCtiets[index].gtHopDong = Operator.sum([this.lstCtiets[index].gtHopDong, item.gtHopDong]);
          this.lstCtiets[index].viPhamHopDong = Operator.sum([this.lstCtiets[index].viPhamHopDong, item.viPhamHopDong]);
          this.lstCtiets[index].thanhLyHdongSl = Operator.sum([this.lstCtiets[index].thanhLyHdongSl, item.thanhLyHdongSl]);
          this.lstCtiets[index].thanhLyHdongTt = Operator.sum([this.lstCtiets[index].thanhLyHdongTt, item.thanhLyHdongTt]);
          // this.lstCtiets[index].tlThanhTien = Operator.sum([this.lstCtiets[index].tlThanhTien, item.tlThanhTien]);
        }
      })
      stt = Table.preIndex(stt)
    }
  }

  changeHd(id: string) {
    // this.editCache[id].data.gtThucHien = Operator.mul(this.editCache[id].data.slThucHien, this.editCache[id].data.donGia);
  }

  changeDn(id: string) {
    this.editCache[id].data.luyKeCong = Operator.sum([this.editCache[id].data.luyKeCapUng, this.editCache[id].data.luyKeCapVon]);
    this.editCache[id].data.tongVonVaDuToanDaCap = Operator.sum([this.editCache[id].data.luyKeCong, this.editCache[id].data.duToanDaGiao]);
    this.editCache[id].data.vonDnghiCapLanNay = Operator.sum([this.editCache[id].data.gtHopDong, -this.editCache[id].data.viPhamHopDong, -this.editCache[id].data.tongVonVaDuToanDaCap]);
    this.editCache[id].data.cong = Operator.sum([this.editCache[id].data.capUng, this.editCache[id].data.capVon]);
    this.editCache[id].data.tongTien = Operator.sum([this.editCache[id].data.tongVonVaDuToanDaCap, this.editCache[id].data.capVon]);
    this.editCache[id].data.soConDuocCap = Operator.sum([this.editCache[id].data.gtHopDong, -this.editCache[id].data.tongTien]);

  }

  viewDetail(id: string) {
    const obj = {
      id: id,
      preData: this.data,
      // tabSelected: this.data.tabSelected == Tab.VB_HOP_DONG ? Tab.VB_HOP_DONG_1 : Tab.VB_HOP_DONG,
    }
    this.dataChange.emit(obj);
  }

  // xoa file trong bang file
  deleteFile(id: string): void {
    this.baoCao.lstFiles = this.baoCao.lstFiles.filter((a: any) => a.id !== id);
    this.listFile = this.listFile.filter((a: any) => a?.lastModified.toString() !== id);
    this.baoCao.listIdDeleteFiles.push(id);
  }

  async downloadFile(id: string) {
    let file: any = this.listFile.find(element => element?.lastModified.toString() == id);
    let doc: any = this.baoCao.lstFiles.find(element => element?.id == id);
    await this.fileManip.downloadFile(file, doc);
  }



  //check role cho các nut trinh duyet


  //upload file
  // async uploadFile(file: File) {
  //   const upfile: FormData = new FormData();
  //   upfile.append('file', file);
  //   upfile.append('folder', this.baoCao.maDvi + '/' + this.baoCao.maDnghi);
  //   const temp = await this.quanLyVonPhiService.uploadFile(upfile).toPromise().then(
  //     (data) => {
  //       const objfile = {
  //         fileName: data.filename,
  //         fileSize: data.size,
  //         fileUrl: data.url,
  //       }
  //       return objfile;
  //     },
  //     err => {
  //       this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
  //     },
  //   );
  //   return temp;
  // }

  // xoa file trong bang file
  // deleteFile(id: string): void {
  //   this.baoCao.lstFiles = this.baoCao.lstFiles.filter((a: any) => a.id !== id);
  //   this.listFile = this.listFile.filter((a: any) => a?.lastModified.toString() !== id);
  //   this.baoCao.listIdDeleteFiles.push(id);
  // }

  //download file về máy tính
  // async downloadFile(id: string) {
  //   const file: File = this.listFile.find(element => element?.lastModified.toString() == id);
  //   if (!file) {
  //     const fileAttach = this.baoCao.lstFiles.find(element => element?.id == id);
  //     if (fileAttach) {
  //       await this.quanLyVonPhiService.downloadFile(fileAttach.fileUrl).toPromise().then(
  //         (data) => {
  //           fileSaver.saveAs(data, fileAttach.fileName);
  //         },
  //         err => {
  //           this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
  //         },
  //       );
  //     }
  //   } else {
  //     const blob = new Blob([file], { type: "application/octet-stream" });
  //     fileSaver.saveAs(blob, file.name);
  //   }
  // }

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
  }

  // call chi tiet bao cao
  // async getDetailReport() {
  //   await this.capVonNguonChiService.ctietDeNghi(this.baoCao.id).toPromise().then(
  //     async (data) => {
  //       if (data.statusCode == 0) {
  //         this.baoCao = data.data;
  //         this.listFile = [];
  //         this.updateEditCache();
  //         this.getStatusButton();
  //         this.getTotal();
  //         // this.getSum();
  //       } else {
  //         this.notification.error(MESSAGE.ERROR, data?.msg);
  //       }
  //     },
  //     (err) => {
  //       this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
  //     },
  //   );
  // }

  // async submitReport() {
  //   this.modal.confirm({
  //     nzClosable: false,
  //     nzTitle: 'Xác nhận',
  //     nzContent: 'Bạn có chắc chắn muốn trình duyệt?<br/>(Trình duyệt trước khi lưu báo cáo có thể gây mất dữ liệu)',
  //     nzOkText: 'Đồng ý',
  //     nzCancelText: 'Không',
  //     nzOkDanger: true,
  //     nzWidth: 500,
  //     nzOnOk: () => {
  //       this.onSubmit(Utils.TT_BC_2, '')
  //     },
  //   });
  // }

  // chuc nang check role
  // async onSubmit(mcn: string, lyDoTuChoi: string) {
  //   if (!this.baoCao.congVan) {
  //     this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.DOCUMENTARY);
  //     return;
  //   }
  //   const requestGroupButtons = {
  //     id: this.baoCao.id,
  //     maChucNang: mcn,
  //     lyDoTuChoi: lyDoTuChoi,
  //   };
  //   await this.capVonNguonChiService.trinhDeNghi(requestGroupButtons).toPromise().then(async (data) => {
  //     if (data.statusCode == 0) {
  //       this.baoCao.trangThai = mcn;
  //       this.getStatusButton();
  //       if (mcn == Utils.TT_BC_8 || mcn == Utils.TT_BC_5 || mcn == Utils.TT_BC_3) {
  //         this.notification.success(MESSAGE.SUCCESS, MESSAGE.REJECT_SUCCESS);
  //       } else {
  //         this.notification.success(MESSAGE.SUCCESS, MESSAGE.APPROVE_SUCCESS);
  //       }
  //     } else {
  //       this.notification.error(MESSAGE.ERROR, data?.msg);
  //     }
  //   }, err => {
  //     this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
  //   });
  // }

  //show popup tu choi
  // async tuChoi(mcn: string) {
  //   const modalTuChoi = this.modal.create({
  //     nzTitle: 'Từ chối',
  //     nzContent: DialogTuChoiComponent,
  //     nzMaskClosable: false,
  //     nzClosable: false,
  //     nzWidth: '900px',
  //     nzFooter: null,
  //     nzComponentParams: {},
  //   });
  //   modalTuChoi.afterClose.subscribe(async (text) => {
  //     if (text) {
  //       this.onSubmit(mcn, text);
  //     }
  //   });
  // }


  // luu
  // async save() {
  //   let checkFile = true;
  //   for (const iterator of this.listFile) {
  //     if (iterator.size > Utils.FILE_SIZE) {
  //       checkFile = false;
  //     }
  //   }
  //   if (!checkFile) {
  //     this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.OVER_SIZE);
  //     return;
  //   }
  //   const baoCaoTemp = JSON.parse(JSON.stringify(this.baoCao));
  //   baoCaoTemp.maLoai = '1'

  //   if (!baoCaoTemp.fileDinhKems) {
  //     baoCaoTemp.fileDinhKems = [];
  //   }
  //   for (const iterator of this.listFile) {
  //     baoCaoTemp.fileDinhKems.push(await this.uploadFile(iterator));
  //   }
  //get file cong van url
  // const file: any = this.fileDetail;
  // if (file) {
  //   if (file.size > Utils.FILE_SIZE) {
  //     this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.OVER_SIZE);
  //     return;
  //   } else {
  //     baoCaoTemp.congVan = await this.uploadFile(file);
  //   }
  // }

  // if (!baoCaoTemp.congVan) {
  //   this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.DOCUMENTARY);
  //   return;
  // }

  // replace nhung ban ghi dc them moi id thanh null
  // baoCaoTemp.lstCtiets.forEach(item => {
  //   if (item.id?.length == 38) {
  //     item.id = null;
  //   };
  // item.dnghiCapvonLuyKes.forEach(e => {
  // 	if (e.id?.length == 38) {
  // 		e.id = null;
  // 	}
  // })
  // })

  //   this.spinner.show();
  //   if (!this.baoCao.id) {
  //     this.capVonNguonChiService.taoMoiDeNghi(baoCaoTemp).toPromise().then(
  //       async (data) => {
  //         if (data.statusCode == 0) {
  //           this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
  //           this.baoCao.id = data.data.id;
  //           await this.getDetailReport();
  //         } else {
  //           this.notification.error(MESSAGE.ERROR, data?.msg);
  //         }
  //       },
  //       (err) => {
  //         this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
  //       },
  //     );
  //   } else {
  //     this.capVonNguonChiService.updateDeNghi(baoCaoTemp).toPromise().then(
  //       async data => {
  //         if (data.statusCode == 0) {
  //           this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
  //           await this.getDetailReport();
  //         } else {
  //           this.notification.error(MESSAGE.ERROR, data?.msg);
  //         }
  //       },
  //       err => {
  //         this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
  //       },
  //     );
  //   }
  // }

  // updateEditCache(): void {
  // this.baoCao.lstCtiets.forEach(item => {
  // 	const data: Times[] = [];
  // 	// item.dnghiCapvonLuyKes.forEach(e => {
  // 	// 	data.push({ ...e });
  // 	// })
  // 	// this.editCache[item.id] = {
  // 	// 	edit: false,
  // 	// 	data: {
  // 	// 		...item,
  // 	// 		dnghiCapvonLuyKes: data,
  // 	// 	}
  // 	// };
  // });
  // }

  // startEdit(id: string): void {
  //   this.editCache[id].edit = true;
  // }

  // huy thay doi
  // cancelEdit(id: string): void {
  //   const index = this.baoCao.lstCtiets.findIndex(item => item.id === id);
  // lay vi tri hang minh sua
  // this.editCache[id] = {
  // 	data: { ...this.baoCao.lstCtiets[index] },
  // 	edit: false
  // };
  // }

  // luu thay doi
  // saveEdit(id: string): void {
  //   const index = this.baoCao.lstCtiets.findIndex(item => item.id === id); // lay vi tri hang minh sua
  //   Object.assign(this.baoCao.lstCtiets[index], this.editCache[id].data); // set lai data cua lstCtietBcao[index] = this.editCache[id].data
  //   this.editCache[id].edit = false; // CHUYEN VE DANG TEXT
  //   this.getTotal();
  // }



  // getTotal() {
  //   this.total = new ItemContract();
  //   // this.baoCao.lstCtiets.forEach(item => {
  //   //   if (item.isParent) {
  //   //     this.total.slKeHoach = Operator.sum([this.total.slKeHoach, item.slKeHoach]);
  //   //     this.total.slHopDong = Operator.sum([this.total.slHopDong, item.slHopDong]);
  //   //     this.total.gtHopDong = Operator.sum([this.total.gtHopDong, item.gtHopDong]);
  //   //     this.total.daGiaoDuToan = Operator.sum([this.total.daGiaoDuToan, item.daGiaoDuToan]);
  //   //     this.total.viPhamHopDong = Operator.sum([this.total.viPhamHopDong, item.viPhamHopDong]);
  //   //     this.total.thanhLyHdongSl = Operator.sum([this.total.thanhLyHdongSl, item.thanhLyHdongSl]);
  //   //     this.total.thanhLyHdongTt = Operator.sum([this.total.thanhLyHdongTt, item.thanhLyHdongTt]);
  //   //   }
  //   // })
  // }

  // async selectab() {
  //   switch (this.selectedIndex) {
  //     case 0:
  //       // danhMuc = this.listAppendix.filter(e => e.id.startsWith('hopdong'));
  //       // danhSach = danhMuc.filter(item => this.baoCao.lstCtiets.findIndex(e => e.maBieuMau == item.id) == -1);
  //       // title = 'Danh sách hơp đồng';
  //       break;
  //     case 1:
  //       const requestData = {
  //         maDvi: this.userInfo?.MA_DVI,
  //         namHdong: this.response.namBcao,
  //         loaiDnghi: this.response.loaiDnghi,
  //         maDviTien: '1',
  //         maLoai: '0',
  //         paggingReq: {
  //           limit: 10,
  //           page: 1,
  //         },
  //         trangThai: Utils.TT_BC_7,
  //         loaiTimKiem: '',
  //       }
  //       if (this.userService.isTongCuc()) {
  //         requestData.loaiTimKiem = '1';
  //       }
  //       this.spinner.show();
  //       await this.capVonNguonChiService.timKiemDeNghi(requestData).toPromise().then(
  //         (data) => {
  //           if (data.statusCode == 0) {
  //             this.idCallChitietCapVon = data.data.content[0].id;
  //           } else {
  //             this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
  //           }
  //         },
  //         (err) => {
  //           this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
  //         }
  //       );
  //       await this.capVonNguonChiService.ctietDeNghi(this.idCallChitietCapVon).toPromise().then(
  //         async (data) => {
  //           if (data.statusCode == 0) {
  //             const dataRequest = data.data.lstCtiets;
  //             if (this.response.lstCtiets.length == 0) {
  //               dataRequest.forEach(item => {
  //                 this.response.lstCtiets.push({
  //                   ...item,
  //                   id: uuid.v4() + 'FE',
  //                   maDvi: this.userInfo?.MA_DVI,
  //                   tenDvi: this.userInfo?.TEN_DVI,
  //                 });
  //               })
  //             } else {
  //               return this.response
  //             }
  //           } else {
  //             this.notification.error(MESSAGE.ERROR, data?.msg);
  //           }
  //         },
  //         (err) => {
  //           this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
  //         },
  //       );
  //       this.spinner.hide();
  //       break;
  //     default:
  //       break;
  //   }
  // }

  // // sum() {
  // // 	this.baoCao.lstCtiets.forEach(item => {
  // // 		if (item.isParent) {
  // // 			item.tongVonVaDtDaCap = Operator.sum([item.duToanDaGiao, item.luyKeCong]);
  // // 			item.vonDnghiCapLanNay = Operator.sum([item.gtHopDong, -item.tongVonVaDtDaCap]);
  // // 			item.tongCap = Operator.sum([item.tongVonVaDtDaCap, item.vonDuyetCong]);
  // // 			item.soConDuocCap = Operator.sum([item.gtHopDong, -item.tongCap]);
  // // 		}
  // // 	})
  // // }

  // showDialogCopy() {
  //   // const obj = {
  //   //     qdChiTieu: this.qdChiTieu,
  //   // }
  //   // const modalTuChoi = this.modal.create({
  //   //     nzTitle: 'Copy Đề nghị',
  //   //     nzContent: DialogDoCopyComponent,
  //   //     nzMaskClosable: false,
  //   //     nzClosable: false,
  //   //     nzWidth: '900px',
  //   //     nzFooter: null,
  //   //     nzComponentParams: {
  //   //         obj
  //   //     },
  //   // });
  //   // modalTuChoi.afterClose.toPromise().then(async (res) => {
  //   //     if (res) {
  //   //         this.doCopy(res);
  //   //     }
  //   // });
  // }

  // async doCopy(response: any) {
  //   // let maDeNghiNew: string;
  //   // await this.capVonNguonChiService.maDeNghi().toPromise().then(
  //   //     (res) => {
  //   //         if (res.statusCode == 0) {
  //   //             maDeNghiNew = res.data;
  //   //         } else {
  //   //             this.notification.error(MESSAGE.ERROR, res?.msg);
  //   //         }
  //   //     },
  //   //     (err) => {
  //   //         this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
  //   //     },
  //   // );
  //   // if (!this.kphiDaCap && this.kphiDaCap !== 0) {
  //   //     this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
  //   //     return;
  //   // }

  //   // const lstCtietBcaoTemp: any[] = [];
  //   // this.lstCtietBcao.forEach(item => {
  //   //     lstCtietBcaoTemp.push({
  //   //         ...item,
  //   //         id: null,
  //   //     })
  //   // })
  //   // // gui du lieu trinh duyet len server
  //   // const request = JSON.parse(JSON.stringify({
  //   //     id: null,
  //   //     fileDinhKems: [],
  //   //     listIdDeleteFiles: [],
  //   //     lstCtiets: lstCtietBcaoTemp,
  //   //     congVan: null,
  //   //     maDvi: this.maDviTao,
  //   //     maDnghi: maDeNghiNew,
  //   //     namDn: this.namDn,
  //   //     loaiDnghi: this.loaiDn,
  //   //     canCuVeGia: this.canCuGia,
  //   //     maDviTien: "1",
  //   //     soQdChiTieu: response.qdChiTieu,
  //   //     tongTien: this.tongTien,
  //   //     kphiDaCap: this.kphiDaCap,
  //   //     ycauCapThem: this.tongTien - this.kphiDaCap,
  //   //     trangThai: this.trangThai,
  //   //     thuyetMinh: this.thuyetMinh,
  //   // }));

  //   // this.capVonNguonChiService.taoMoiDeNghi(request).toPromise().then(
  //   //     async (data) => {
  //   //         if (data.statusCode == 0) {
  //   //             const modalCopy = this.modal.create({
  //   //                 nzTitle: MESSAGE.ALERT,
  //   //                 nzContent: DialogCopyComponent,
  //   //                 nzMaskClosable: false,
  //   //                 nzClosable: false,
  //   //                 nzWidth: '900px',
  //   //                 nzFooter: null,
  //   //                 nzComponentParams: {
  //   //                     maBcao: maDeNghiNew
  //   //                 },
  //   //             });
  //   //         } else {
  //   //             this.notification.error(MESSAGE.ERROR, data?.msg);
  //   //         }
  //   //     },
  //   //     (err) => {
  //   //         this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
  //   //     },
  //   // );
  // }

  // displayValue(num: number): string {
  //   return displayNumber(num);
  // }

  statusClass() {
    if (Utils.statusSave.includes(this.baoCao.trangThai)) {
      return 'du-thao-va-lanh-dao-duyet';
    } else {
      return 'da-ban-hanh';
    }
  }

  // addAppendix() {
  //   let danhMuc = [];
  //   let danhSach = [];
  //   let title = '';
  //   switch (this.selectedIndex) {
  //     case 0:
  //       danhMuc = this.listAppendix.filter(e => e.id.startsWith('hopdong'));
  //       // danhSach = danhMuc.filter(item => this.baoCao.lstCtiets.findIndex(e => e.maBieuMau == item.id) == -1);
  //       title = 'Danh sách hơp đồng';
  //       break;
  //     case 1:
  //       danhMuc = this.listAppendix.filter(e => e.id.startsWith('denghi'));
  //       // danhSach = danhMuc.filter(item => this.baoCao.lstCtiets.findIndex(e => e.maBieuMau == item.id) == -1);
  //       title = 'Danh sách đề nghị';
  //       break;
  //     default:
  //       break;
  //   }

  //   const modalIn = this.modal.create({
  //     nzTitle: title,
  //     nzContent: DialogTaoMoiCapVonComponent,
  //     nzBodyStyle: { overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' },
  //     nzMaskClosable: false,
  //     nzClosable: false,
  //     nzWidth: '600px',
  //     nzFooter: null,
  //     nzComponentParams: {
  //       // danhSachBieuMau: danhSach
  //     },
  //   });
  //   // modalIn.afterClose.subscribe((res) => {
  //   //     if (res) {
  //   //         res.forEach(item => {
  //   //             if (item.status) {
  //   //                 const newItem: Form = {
  //   //                     ... new Form(),
  //   //                     id: uuid.v4() + 'FE',
  //   //                     maBieuMau: item.id,
  //   //                     tenPl: item.tenPl,
  //   //                     tenDm: item.tenDm,
  //   //                     trangThai: '3',
  //   //                     lstCtietLapThamDinhs: [],
  //   //                 }
  //   //                 this.baoCao.lstLapThamDinhs.push(newItem);
  //   //             }
  //   //         })
  //   //     }
  //   // });
  // }

  // getIndex(maBieuMau: string) {
  //   let header = '';
  //   if (maBieuMau.startsWith('hopdong')) {
  //     header = 'hopdong';
  //   };
  //   if (maBieuMau.startsWith('denghi')) {
  //     header = 'denghi';
  //   };
  //   let index = 0;
  //   // for (let i = 0; i < this.baoCao.lstLapThamDinhs.length; i++) {
  //   //     if (this.baoCao.lstLapThamDinhs[i].maBieuMau.startsWith(header)) {
  //   //         index += 1;
  //   //     }
  //   //     if (this.baoCao.lstLapThamDinhs[i].maBieuMau == maBieuMau) {
  //   //         break;
  //   //     }
  //   // }
  //   return index;
  // }
}


