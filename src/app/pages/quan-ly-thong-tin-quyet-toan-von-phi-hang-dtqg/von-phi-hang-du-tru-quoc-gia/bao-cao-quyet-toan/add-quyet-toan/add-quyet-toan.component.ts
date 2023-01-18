import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as fileSaver from 'file-saver';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogCopyQuyetToanVonPhiHangDtqgComponent } from 'src/app/components/dialog/dialog-copy-quyet-toan-von-phi-hang-dtqg/dialog-copy-quyet-toan-von-phi-hang-dtqg.component';
import { DialogCopyComponent } from 'src/app/components/dialog/dialog-copy/dialog-copy.component';
import { DialogThemKhoanMucComponent } from 'src/app/components/dialog/dialog-them-khoan-muc/dialog-them-khoan-muc.component';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { QuyetToanVonPhiService } from 'src/app/services/quan-ly-von-phi/quyetToanVonPhi.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';
import { displayNumber, DON_VI_TIEN, exchangeMoney, LA_MA, MONEY_LIMIT, QTVP, sumNumber, Utils } from 'src/app/Utility/utils';
import * as uuid from "uuid";
import { DialogAddVatTuComponent } from '../dialog-add-vat-tu/dialog-add-vat-tu.component';
import { TEN_HANG } from './add-quyet-toan.constant';
// import { NOI_DUNG } from './them-bao-cao-quyet-toan.constant';
export class ItemData {
  id!: any;
  stt!: string;
  level: number;
  tenHang: string;
  maLoaiHang!: string;
  maDviTinh!: string;
  soLuong!: number;
  donGiaMua!: number;
  thanhTien!: number;
  checked!: boolean;
}

export class ItemCongVan {
  fileName: string;
  fileSize: number;
  fileUrl: number;
}

@Component({
  selector: 'app-add-quyet-toan',
  templateUrl: './add-quyet-toan.component.html',
  styleUrls: ['./add-quyet-toan.component.scss']
})

export class AddQuyetToanComponent implements OnInit {
  @Input() data;
  @Input() idInput;
  @Input() isStatus;
  @Output('close') onClose = new EventEmitter<any>();

  // thong tin dang nhap
  userInfo: any;
  // info report 
  id: string;
  isDataAvailable = false;

  // status btn 
  titleStatus!: string;
  status = false;
  saveStatus = true;
  submitStatus = true;
  passStatus = true;
  approveStatus = true;
  acceptStatus = true;
  copyStatus = true;
  printStatus = true;

  // info data common
  maBcao!: string;
  namQtoan!: number;
  thangBcao: number;
  congVan: ItemCongVan = new ItemCongVan();
  ngayTao!: string;
  ngayTrinh!: string;
  ngayDuyet!: string;
  ngayPheDuyet!: string;
  // isStatus!: string;
  maPhanBcao = '1';
  capDvi: string;

  // thong tin chi tiet bao cao;
  lstCtietBcao: ItemData[] = [];
  noiDungs: any[] = TEN_HANG;
  donViTinhs: any[] = [];
  maDviTiens: any[] = DON_VI_TIEN;
  donVis: any = [];
  lstDsHangTrongKho: any[] = [];
  lstBcaoDviTrucThuocs: any[] = [];
  newDate = new Date();
  thuyetMinh: string;

  lstFiles: any[] = [];
  listFile: File[] = [];
  fileList: NzUploadFile[] = [];
  fileDetail: NzUploadFile;
  listIdFilesDelete: any = [];

  editCache: { [key: string]: { edit: boolean; data: ItemData } } = {};     // phuc vu nut chinh
  editMoneyUnit = false;

  maDviTao!: string;
  maDviTien!: string;
  allChecked = false;                         // check all checkbox
  soLaMa: any[] = LA_MA;
  PS_ARR: any[] = [];
  LK_ARR: any[] = [];
  LST_CHUNG_KHO: any[] = [];
  initItem: ItemData = {
    id: null,
    stt: "0",
    level: 0,
    tenHang: "",
    maLoaiHang: '',
    maDviTinh: null,
    soLuong: null,
    donGiaMua: null,
    thanhTien: null,
    checked: false
  };
  total: ItemData = {
    id: null,
    stt: "0",
    level: 0,
    tenHang: "",
    maLoaiHang: "",
    maDviTinh: null,
    soLuong: 0,
    donGiaMua: 0,
    thanhTien: null,
    checked: false
  };

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

  trangThais: any[] = [
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
      tenDm: "Trưởng BP duyệt",
    },
    {
      id: Utils.TT_BC_5,
      tenDm: "Lãnh đạo từ chối",
    },
    {
      id: Utils.TT_BC_6,
      tenDm: "Lãnh đạo phê duyệt",
    },
    {
      id: Utils.TT_BC_7,
      tenDm: "Mới",
    },
    {
      id: Utils.TT_BC_8,
      tenDm: "Cấp trên từ chối",
    },
    {
      id: Utils.TT_BC_9,
      tenDm: "Tiếp nhận",
    },
  ]


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
    private quanLyVonPhiService: QuanLyVonPhiService,
    private quyetToanVonPhiService: QuyetToanVonPhiService,
    private danhMucService: DanhMucHDVService,
    private spinner: NgxSpinnerService,
    private userService: UserService,
    private datePipe: DatePipe,
    private notification: NzNotificationService,
    private modal: NzModalService,
    public globals: Globals,
  ) {

  }

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
        await this.onSubmit('6', null).then(() => {
          this.isDataAvailable = true;
        })
        break;
      default:
        break;
    }
    // this.titleStatus = this.trangThais.find(e => e.id == this.isStatus)?.tenDm;
    this.spinner.hide();
  };

  async initialization() {
    this.userInfo = this.userService.getUserLogin();
    this.getChildUnit();
    if (this.idInput) {
      await this.getDetailReport();
    } else {
      this.isStatus = '1';
      this.ngayTao = this.datePipe.transform(this.newDate, Utils.FORMAT_DATE_STR);
      this.namQtoan = this.data?.namQtoan;
      this.thangBcao = this.data?.thangBcao;
      this.maDviTao = this.userInfo?.MA_DVI;
      const rqKho = {
        maDvi: this.maDviTao,
        nam: Number(this?.namQtoan),
        thang: this?.thangBcao,
      }
      await this.quyetToanVonPhiService.getHangHoaKho(rqKho).toPromise().then(
        async (data) => {
          this.lstDsHangTrongKho = data.data;
          this.PS_ARR = data.data.filter(e => e.maLoai == "PS")
          this.LK_ARR = data.data.filter(e => e.maLoai == "LK")


          console.log("PS_ARR:", this.PS_ARR);
          console.log("LK_ARR:", this.LK_ARR);
          console.log("this.lstDsHangTrongKho:", this.lstDsHangTrongKho);

        },
        (err) => {
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        },
      );

      await this.quyetToanVonPhiService.sinhMaBaoCaoQuyetToan(1).toPromise().then(
        (data) => {
          if (data.statusCode == 0) {
            this.maBcao = data.data;
          } else {
            this.notification.error(MESSAGE.ERROR, data?.msg);
          }
        },
        (err) => {
          this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
        }
      );
      //lay danh sach danh muc don vi
      await this.danhMucService.dMDonVi().toPromise().then(
        (data) => {
          if (data.statusCode == 0) {
            this.donVis = data.data;
            this.donVis.forEach(e => {
              if (e.maDvi == this.userInfo?.MA_DVI) {
                this.capDvi = e.capDvi;
              }
            })
          } else {
            this.notification.error(MESSAGE.ERROR, data?.msg);
          }
        },
        (err) => {
          this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
        }
      );
      // danh sách đơn vị tính
      await this.danhMucService.dMDviTinh().toPromise().then(
        (data) => {
          if (data.statusCode == 0) {
            this.donViTinhs = data?.data;
          } else {
            this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
          }
        },
        (err) => {
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      );

      this.maDviTien = '1';

      if (this.lstCtietBcao.length == 0) {
        this.noiDungs.forEach(s => {
          this.lstCtietBcao.push(
            {
              ...new ItemData(),
              id: uuid.v4() + 'FE',
              stt: s.ma,
              tenHang: s.tenHang,
              maLoaiHang: s.ma,
            }
          )
        })
        this.setLevel();
        this.lstCtietBcao.forEach(item => {
          item.tenHang += this.getName(item.level, item.maLoaiHang);
        })
      }

    }
    if (this.lstBcaoDviTrucThuocs.length > 0) {
      this.lstBcaoDviTrucThuocs.forEach(item => {
        if (item.ngayDuyet.includes("/")) {
          item.ngayDuyet = item.ngayDuyet;
          item.ngayPheDuyet = item.ngayPheDuyet;
        } else {
          item.ngayDuyet = this.datePipe.transform(item.ngayDuyet, Utils.FORMAT_DATE_STR);
          item.ngayPheDuyet = this.datePipe.transform(item.ngayPheDuyet, Utils.FORMAT_DATE_STR);
        }
      })
    }
    this.sortByIndex();
    this.getTotal();
    this.updateEditCache()
    this.getStatusButton();
  };


  setLevel() {
    this.lstCtietBcao.forEach(item => {
      const str: string[] = item.stt.split('.');
      item.level = str.length - 2;
    })
  }

  getName(level: number, ma: string) {
    const type = this.getTail(ma);
    let str = '';
    return str;
  }

  getStatusName(status: string) {
    return this.trangThais.find(e => e.id == status)?.tenDm;
  }

  async onSubmit(mcn: string, lyDoTuChoi: string) {
    if (this.submitStatus != true && mcn < '2') {
      this.notification.warning(MESSAGE.WARNING, MESSAGE.MESSAGE_DELETE_WARNING);
      return;
    }
    if (this.idInput) {
      const requestGroupButtons = {
        id: this.idInput,
        maChucNang: mcn,
        lyDoTuChoi: lyDoTuChoi,
      };
      this.spinner.show();
      await this.quyetToanVonPhiService.approveQuyetToan(requestGroupButtons).toPromise().then(async (data) => {
        if (data.statusCode == 0) {
          this.isStatus = mcn;
          this.titleStatus = mcn;
          this.ngayTrinh = this.datePipe.transform(data.data.ngayTrinh, Utils.FORMAT_DATE_STR);
          this.ngayDuyet = this.datePipe.transform(data.data.ngayDuyet, Utils.FORMAT_DATE_STR);
          this.ngayPheDuyet = this.datePipe.transform(data.data.ngayPheDuyet, Utils.FORMAT_DATE_STR);
          this.getStatusButton();
          // danh sách đơn vị tính
          await this.danhMucService.dMDviTinh().toPromise().then(
            (data) => {
              if (data.statusCode == 0) {
                this.donViTinhs = data?.data;
              } else {
                this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
              }
            },
            (err) => {
              this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
            }
          );
          if (mcn == Utils.TT_BC_8 || mcn == Utils.TT_BC_5 || mcn == Utils.TT_BC_3) {
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
      this.spinner.hide();
    } else {
      this.notification.warning(MESSAGE.WARNING, MESSAGE.MESSAGE_DELETE_WARNING)
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
    this.spinner.show();
    // danh sách đơn vị tính
    await this.danhMucService.dMDviTinh().toPromise().then(
      (data) => {
        if (data.statusCode == 0) {
          this.donViTinhs = data?.data;
        } else {
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      },
      (err) => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
    );
    await this.quyetToanVonPhiService.CtietBcaoQuyetToan1(this.idInput).toPromise().then(
      async (data) => {
        if (data.statusCode == 0) {
          this.idInput = data.data.id;
          this.lstCtietBcao = data.data.lstCtiet;
          this.lstBcaoDviTrucThuocs = data.data.lstBcaoDviTrucThuocs;
          this.maDviTien = data.data.maDviTien;
          this.sortByIndex();
          // this.lstCtietBcao.forEach(item => {
          //   item.donGiaMua = divMoney(item.donGiaMua, this.maDviTien);
          //   item.thanhTien = divMoney(item.thanhTien, this.maDviTien);
          // })
          this.ngayTrinh = this.datePipe.transform(data.data.ngayTrinh, Utils.FORMAT_DATE_STR);
          this.ngayDuyet = this.datePipe.transform(data.data.ngayDuyet, Utils.FORMAT_DATE_STR);
          this.ngayPheDuyet = this.datePipe.transform(data.data.ngayPheDuyet, Utils.FORMAT_DATE_STR);
          this.maBcao = data.data.maBcao;
          this.isStatus = data.data.trangThai;
          this.namQtoan = data.data.namQtoan;
          this.thangBcao = data.data.thangQtoan;
          this.maDviTao = data.data.maDvi;
          this.thuyetMinh = data.data.thuyetMinh;
          this.ngayTao = this.datePipe.transform(data.data.ngayTao, Utils.FORMAT_DATE_STR);
          this.congVan = data.data.congVan;
          this.lstFiles = data.data.fileDinhKems;

          this.listFile = [];
          if (this.lstBcaoDviTrucThuocs.length > 0) {
            this.lstBcaoDviTrucThuocs.forEach(item => {
              if (item.ngayDuyet.includes("/")) {
                item.ngayDuyet = item.ngayDuyet;
                item.ngayPheDuyet = item.ngayPheDuyet;
              } else {
                item.ngayDuyet = this.datePipe.transform(item.ngayDuyet, Utils.FORMAT_DATE_STR);
                item.ngayPheDuyet = this.datePipe.transform(item.ngayPheDuyet, Utils.FORMAT_DATE_STR);
              }
            })
          }
          this.getTotal()
          this.updateEditCache();
          this.getStatusButton();
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
  childUnit: any[] = [];
  getUnitName(maDvi: string) {
    return this.childUnit.find(item => item.maDvi == maDvi)?.tenDvi;
  }

  async getChildUnit() {
    const request = {
      maDviCha: this.maDviTao,
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

  async viewDetail(id) {
    console.log(id);
    this.spinner.show();
    localStorage.setItem('idInput', this.idInput);
    this.idInput = id
    await this.getDetailReport();
    this.sortByIndex();
    this.getStatusButton();
    this.spinner.hide();
  }

  // luu
  async save() {

    let checkSaveEdit;
    // if (!this.maDviTien) {
    //   this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTSAVE);
    //   return;
    // }
    //check xem tat ca cac dong du lieu da luu chua?
    //chua luu thi bao loi, luu roi thi cho di
    // for (const itm of this.lstCtietBcao) {
    //   if (!itm.maDviTinh && !itm.soLuong && !itm.donGiaMua && !itm.thanhTien) {
    //     this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTSAVE);
    //     return;
    //   }
    // }
    this.lstCtietBcao.forEach(element => {
      if (this.editCache[element.id].edit === true) {
        checkSaveEdit = false
      }
    });
    if (checkSaveEdit == false) {
      this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTSAVE);
      return;
    }
    //tinh lai don vi tien va kiem tra gioi han cua chung
    const lstCtietBcaoTemp: any = [];
    let checkMoneyRange = true;
    this.lstCtietBcao.forEach(item => {
      if (item.donGiaMua > MONEY_LIMIT || item.thanhTien > MONEY_LIMIT) {
        checkMoneyRange = false;
        return;
      }
      lstCtietBcaoTemp.push({
        ...item,
      })
    })

    if (!checkMoneyRange == true) {
      this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.MONEYRANGE);
      return;
    }

    // replace nhung ban ghi dc them moi id thanh null
    lstCtietBcaoTemp.forEach(item => {
      if (item.id?.length == 38) {
        item.id = null;
      }
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
    const listFile: any = [];
    for (const iterator of this.listFile) {
      listFile.push(await this.uploadFile(iterator));
    }
    const tongHopTuIds = []
    const request = JSON.parse(JSON.stringify({
      id: this.idInput,
      fileDinhKems: listFile,
      listIdFiles: this.listIdFilesDelete,                      // id file luc get chi tiet tra ra( de backend phuc vu xoa file)
      lstCtiet: lstCtietBcaoTemp,
      maDviTien: this.maDviTien,
      thuyetMinh: this.thuyetMinh,
      trangThai: this.isStatus,
      congVan: this.congVan,
      maDvi: this.maDviTao,
      namQtoan: this.namQtoan,
      thangQtoan: this.thangBcao,
      maBcao: this.maBcao,
      maPhanBcao: this.maPhanBcao,
      tongHopTuIds: tongHopTuIds,
    }));

    this.lstBcaoDviTrucThuocs.forEach(item => {
      request.tongHopTuIds.push(item.id);
    })

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
    if (!request.congVan.fileName) {
      this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.DOCUMENTARY);
      return;
    }

    //call service them moi
    this.spinner.show();
    if (this.idInput == null) {
      this.quyetToanVonPhiService.trinhDuyetServiceQuyetToan1(request).toPromise().then(
        async data => {
          if (data.statusCode == 0) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
            this.idInput = data.data.id;
            await this.getDetailReport();
            this.sortByIndex();
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
      this.quyetToanVonPhiService.updateBaoCaoQuyetToan1(request).toPromise().then(
        async data => {
          if (data.statusCode == 0) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
            await this.getDetailReport();
            this.sortByIndex();
            this.getStatusButton();
          } else {
            this.notification.error(MESSAGE.ERROR, data?.msg);
          }
        }, err => {
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        })
    }
    this.lstCtietBcao.filter(item => {
      if (!item.id) {
        item.id = uuid.v4() + 'FE';
      }
    });
    this.submitStatus = true;
    this.spinner.hide();
  };

  //upload file
  async uploadFile(file: File) {
    // day file len server
    const upfile: FormData = new FormData();
    upfile.append('file', file);
    upfile.append('folder', this.maDviTao + '/' + this.maPhanBcao);
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
  };

  //nhóm các nút chức năng --báo cáo-----
  getStatusButton() {
    if (Utils.statusSave.includes(this.isStatus) && this.userService.isAccessPermisson(QTVP.EDIT_REPORT)) {
      this.status = false;
    } else {
      this.status = true;
    }
    const checkChirld = this.maDviTao == this.userInfo?.MA_DVI;
    this.saveStatus = this.getBtnStatus(Utils.statusSave, QTVP.ADD_REPORT, checkChirld);
    this.submitStatus = this.getBtnStatus(Utils.statusApprove, QTVP.APPROVE_REPORT, checkChirld);
    this.passStatus = this.getBtnStatus(Utils.statusDuyet, QTVP.DUYET_QUYET_TOAN_REPORT, checkChirld);
    this.approveStatus = this.getBtnStatus(Utils.statusPheDuyet, QTVP.PHE_DUYET_QUYET_TOAN_REPORT, checkChirld);
    this.copyStatus = this.getBtnStatus(Utils.statusCopy, QTVP.COPY_REPORT, checkChirld);
    this.printStatus = this.getBtnStatus(Utils.statusPrint, QTVP.PRINT_REPORT, checkChirld);
  }

  getBtnStatus(status: string[], role: string, check: boolean) {
    return !(status.includes(this.isStatus) && this.userService.isAccessPermisson(role) && check);
  }

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
    const lstTemp: ItemData[] = [];
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
      item.level = this.noiDungs.find(e => e.id == item.maLoaiHang)?.level;
    })
  };

  getIdCha(maKM: any) {
    return this.noiDungs.find(e => e.id == maKM)?.idCha;
  };

  showDialogCopy() {
    const obj = {
      namBcao: this.namQtoan,
    }
    const modalTuChoi = this.modal.create({
      nzTitle: 'Copy Báo Cáo',
      nzContent: DialogCopyQuyetToanVonPhiHangDtqgComponent,
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
  };

  async doCopy(response: any) {
    let maBcaoNew: string;
    await this.quyetToanVonPhiService.sinhMaBaoCaoQuyetToan(1).toPromise().then(
      (data) => {
        if (data.statusCode == 0) {
          maBcaoNew = data.data;
        } else {
          this.notification.error(MESSAGE.ERROR, data?.msg);
        }
      },
      (err) => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
      }
    );

    const lstCtietBcaoTemps: any[] = [];
    this.lstCtietBcao.forEach(data => {
      lstCtietBcaoTemps.push({
        ...data,
        id: null,
      })
    })
    const request = {
      id: null,
      fileDinhKems: [],
      listIdFiles: [],                      // id file luc get chi tiet tra ra( de backend phuc vu xoa file)
      lstCtiet: lstCtietBcaoTemps,
      maDviTien: this.maDviTien,
      thuyetMinh: this.thuyetMinh,
      trangThai: this.isStatus,
      congVan: this.congVan,
      maDvi: this.maDviTao,
      namQtoan: response.namBcao,
      maBcao: maBcaoNew,
      maPhanBcao: this.maPhanBcao,
    };

    this.quyetToanVonPhiService.trinhDuyetServiceQuyetToan(request).toPromise().then(
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

  back() {
    const idStorage = localStorage.getItem('idInput');
    if (idStorage) {
      this.idInput = idStorage
      this.getDetailReport();
      this.sortByIndex();
      this.getStatusButton();
      localStorage.removeItem('idInput');
    } else {
      this.onClose.emit();
    }
  };

  getMoneyUnit() {
    return this.maDviTiens.find(e => e.id == this.maDviTien)?.tenDm;
  };

  statusClass() {
    if (Utils.statusSave.includes(this.isStatus)) {
      return 'du-thao-va-lanh-dao-duyet';
    } else {
      return 'da-ban-hanh';
    }
  };

  //download file công văn về máy tính
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
    // if (n == 3) {
    //   xau = String.fromCharCode(k + 96);
    // }
    if (n == 3) {
      xau = "-";
    }
    return xau;
  };
  // lấy phần đầu của số thứ tự, dùng để xác định phần tử cha
  getHead(str: string): string {
    return str.substring(0, str.lastIndexOf('.'));
  };
  // lấy phần đuôi của stt
  getTail(str: string): number {
    return parseInt(str.substring(str.lastIndexOf('.') + 1, str.length), 10);
  };
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
  };
  //thay thế các stt khi danh sách được cập nhật, heSo=1 tức là tăng stt lên 1, heso=-1 là giảm stt đi 1
  replaceIndex(lstIndex: number[], heSo: number) {
    if (heSo == -1) {
      lstIndex.reverse();
    }
    //thay doi lai stt cac vi tri vua tim duoc
    lstIndex.forEach(item => {
      const str = this.getHead(this.lstCtietBcao[item].stt) + "." + (this.getTail(this.lstCtietBcao[item].stt) + heSo).toString();
      const nho = this.lstCtietBcao[item].stt;
      this.lstCtietBcao.forEach(item => {
        item.stt = item.stt.replace(nho, str);
      })
    })
  }


  // gan editCache.data == lstCtietBcao
  updateEditCache(): void {
    this.lstCtietBcao.forEach(item => {
      this.editCache[item.id] = {
        edit: false,
        data: { ...item }
      };
    });
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
        maLoaiHang: data.maLoaiHang,
        tenHang: data.tenHang,
        maDviTinh: data.maDviTinh,
        donGiaMua: null,
        soLuong: null,
        checked: data.checked,
        level: data.level,
      }
      this.lstCtietBcao.forEach(item => {
        if (this.getHead(item.stt) == stt) {
          this.lstCtietBcao[index].soLuong = null;
          this.lstCtietBcao[index].donGiaMua = null;
          this.lstCtietBcao[index].thanhTien = sumNumber([this.lstCtietBcao[index].thanhTien, item.thanhTien]);
        }
      })
      stt = this.getHead(stt);
    }
    this.getTotal();
  };

  getTotal() {
    this.total = new ItemData();
    this.lstCtietBcao.forEach(item => {
      if (item.level == 0) {
        this.total.thanhTien = sumNumber([this.total.thanhTien, item.thanhTien]);
      }
    })

  };

  sum1() {
    this.lstCtietBcao.forEach(itm => {
      let stt = this.getHead(itm.stt);
      while (stt != '0') {
        const index = this.lstCtietBcao.findIndex(e => e.stt == stt);
        const data = this.lstCtietBcao[index];
        this.lstCtietBcao[index] = {
          ...new ItemData(),
          id: data.id,
          stt: data.stt,
          donGiaMua: data.donGiaMua,
          maLoaiHang: data.maLoaiHang,
          level: data.level,
          tenHang: data.tenHang,
          soLuong: data.soLuong,
          maDviTinh: data.maDviTinh,
          thanhTien: data.thanhTien,
        }
        this.lstCtietBcao.forEach(item => {
          if (this.getHead(item.stt) == stt) {
            this.lstCtietBcao[index].thanhTien = sumNumber([this.lstCtietBcao[index].thanhTien, item.thanhTien]);
          }
        })
        stt = this.getHead(stt);
      }
      this.getTotal();
    })

  }


  displayValue(num: number): string {
    num = exchangeMoney(num, '1', this.maDviTien);
    return displayNumber(num);
  };

  // deleteLine(id: any) {
  //   const index: number = this.lstCtietBcao.findIndex(e => e.id === id); // vi tri hien tai
  //   const nho: string = this.lstCtietBcao[index].stt;
  //   const head: string = this.getHead(this.lstCtietBcao[index].stt); // lay phan dau cua so tt
  //   const stt: string = this.lstCtietBcao[index].stt;
  //   //xóa phần tử và con của nó
  //   this.lstCtietBcao = this.lstCtietBcao.filter(e => !e.stt.startsWith(nho));
  //   //update lại số thức tự cho các phần tử cần thiết
  //   const lstIndex: number[] = [];
  //   for (let i = this.lstCtietBcao.length - 1; i >= index; i--) {
  //     if (this.getHead(this.lstCtietBcao[i].stt) == head) {
  //       lstIndex.push(i);
  //     }
  //   }

  //   this.replaceIndex(lstIndex, -1);
  //   this.sum(stt);
  //   this.updateEditCache();
  //   console.log(this.lstCtietBcao);

  // };

  deleteLine(id: string) {
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
    this.sum(stt);
    this.getTotal();
    this.updateEditCache();
    console.log(this.lstCtietBcao);

  }


  // start edit
  startEdit(id: string): void {
    this.editCache[id].edit = true;
  };

  changeModel(id: string): void {
    this.editCache[id].data.thanhTien = Number(this.editCache[id].data.soLuong) * Number(this.editCache[id].data.donGiaMua);
  };

  saveEdit(id: string): void {
    if (
      (!this.editCache[id].data.soLuong && this.editCache[id].data.soLuong !== 0) ||
      (!this.editCache[id].data.donGiaMua && this.editCache[id].data.donGiaMua !== 0)
    ) {
      this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS)
      return;
    }
    if (
      this.editCache[id].data.soLuong < 0 ||
      this.editCache[id].data.donGiaMua < 0
    ) {
      this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOT_NEGATIVE);
      return;
    }
    this.editCache[id].data.checked = this.lstCtietBcao.find(item => item.id === id).checked; // set checked editCache = checked lstCtietBcao
    const index = this.lstCtietBcao.findIndex(item => item.id === id); // lay vi tri hang minh sua
    Object.assign(this.lstCtietBcao[index], this.editCache[id].data); // set lai data cua lstCtietBcao[index] = this.editCache[id].data
    this.editCache[id].edit = false; // CHUYEN VE DANG TEXT
    this.sum(this.lstCtietBcao[index].stt);
    this.updateEditCache();
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

  //kiểm tra các phần tử con có cùng được đánh dấu hay ko
  checkAllChild(str: string): boolean {
    let nho = true;
    this.lstCtietBcao.forEach(item => {
      if ((this.getHead(item.stt) == str) && (!item.checked) && (item.stt != str)) {
        nho = item.checked;
      }
    })
    return nho;
  };


  updateAllChecked() {
    this.lstCtietBcao.forEach(item => {
      item.checked = this.allChecked;
    })
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

  // xoa file trong bang file
  deleteFile(id: string): void {
    this.lstFiles = this.lstFiles.filter((a: any) => a.id !== id);
    this.listFile = this.listFile.filter((a: any) => a?.lastModified.toString() !== id);
    this.listIdFilesDelete.push(id);
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

  handlSelectGoods(dataHang: any) {
    const obj = {
      stt: dataHang.stt,
    }

    const modalTuChoi = this.modal.create({
      nzTitle: 'Danh sách hàng hóa',
      nzContent: DialogAddVatTuComponent,
      nzBodyStyle: { overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' },
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {
        obj: obj
      },
    });
    modalTuChoi.afterClose.subscribe(async (data) => {

      if (data) {
        console.log("hang hoa duoc chon:", data);
        // const dm = this.lstDsHangTrongKho.find(e => e.cloaiVthh == data.ma);
        const dataLK = this.lstDsHangTrongKho.find(e => e.cloaiVthh == data.ma && e.maLoai == "LK");
        const dataPS = this.lstDsHangTrongKho.find(e => e.cloaiVthh == data.ma && e.maLoai == "PS");
        if (
          this.lstCtietBcao.findIndex(e => (e.maLoaiHang == data.ma && e.donGiaMua == dataLK?.donGia)) == -1 ||
          this.lstCtietBcao.findIndex(e => (e.maLoaiHang == data.ma && e.donGiaMua == dataPS?.donGia)) == -1
        ) {
          let stt: any;
          if (data.ma.startsWith('01') && dataHang.stt == "0.1.1") {
            const LST_LT = this.lstCtietBcao.filter(s => s.stt.startsWith("0.1"));
            const LST_LT_LK = LST_LT.filter(v => v.stt.startsWith("0.1.1"));
            const LST_LT_LK_CHA = LST_LT_LK.filter(v => v.level == 2);
            if (LST_LT_LK_CHA.length == 0) {
              stt = '0.1.1.' + (LST_LT_LK_CHA.length + 1).toString();
            } else {
              stt = '0.1.1.' + (LST_LT_LK_CHA.length + 1).toString();
            }
            const lastdata = LST_LT_LK[LST_LT_LK.length - 1]

            const indexLtLk = this.lstCtietBcao.findIndex(e => e.maLoaiHang == lastdata.maLoaiHang) + 1;
            // them vat tu moi vao bang
            this.lstCtietBcao.splice(indexLtLk, 0, {
              ... new ItemData(),
              id: uuid.v4() + 'FE',
              stt: stt,
              maLoaiHang: data.ma,
              tenHang: data.ten,
              maDviTinh: null,
              soLuong: null,
              donGiaMua: null,
              thanhTien: null,
              level: 2,
            })

            const lstTemp = this.lstDsHangTrongKho.filter(e => e.cloaiVthh == data.ma && e.maLoai == "LK");
            for (let i = 1; i <= lstTemp.length; i++) {
              this.lstCtietBcao.splice(indexLtLk + 1, 0, {
                ...new ItemData(),
                id: uuid.v4() + 'FE',
                stt: stt + '.' + i.toString(),
                maLoaiHang: stt + '.' + i.toString(),
                tenHang: data.ten,
                maDviTinh: lstTemp[i - 1].donViTinh,
                soLuong: !lstTemp[i - 1].soLuongThucNhap ? 0 : lstTemp[i - 1]?.soLuongThucNhap,
                donGiaMua: !lstTemp[i - 1].donGia ? 0 : lstTemp[i - 1]?.donGia,
                thanhTien: lstTemp[i - 1].soLuongThucNhap * lstTemp[i - 1].donGia,
                level: 3,
              })
            }
            this.getTotal()
            this.updateEditCache();
          } else if (data.ma.startsWith('01') && dataHang.stt == "0.1.2") {
            const LST_LT = this.lstCtietBcao.filter(s => s.stt.startsWith("0.1"))
            const LST_LT_PS = LST_LT.filter(v => v.stt.startsWith("0.1.2"))
            const LST_LT_PS_CHA = LST_LT_PS.filter(v => v.level == 2);
            if (LST_LT_PS_CHA.length == 0) {
              stt = '0.1.2.' + (LST_LT_PS_CHA.length + 1).toString();
            } else {
              stt = '0.1.2.' + (LST_LT_PS_CHA.length + 1).toString();
            }
            const lastdata = LST_LT_PS[LST_LT_PS.length - 1]
            const indexLtLk = this.lstCtietBcao.findIndex(e => e.maLoaiHang == lastdata.maLoaiHang) + 1;
            // them vat tu moi vao bang
            this.lstCtietBcao.splice(indexLtLk, 0, {
              ... new ItemData(),
              id: uuid.v4() + 'FE',
              stt: stt,
              maLoaiHang: data.ma,
              tenHang: data.ten,
              maDviTinh: null,
              soLuong: null,
              donGiaMua: null,
              thanhTien: null,
              level: 2,
            })
            const lstTemp = this.lstDsHangTrongKho.filter(e => e.cloaiVthh == data.ma && e.maLoai == "LK");
            for (let i = 1; i <= lstTemp.length; i++) {
              this.lstCtietBcao.splice(indexLtLk + 1, 0, {
                ...new ItemData(),
                id: uuid.v4() + 'FE',
                stt: stt + '.' + i.toString(),
                maLoaiHang: stt + '.' + i.toString(),
                tenHang: data.ten,
                maDviTinh: lstTemp[i - 1].donViTinh,
                soLuong: !lstTemp[i - 1].soLuongThucNhap ? 0 : lstTemp[i - 1]?.soLuongThucNhap,
                donGiaMua: !lstTemp[i - 1].donGia ? 0 : lstTemp[i - 1]?.donGia,
                thanhTien: lstTemp[i - 1].soLuongThucNhap * lstTemp[i - 1].donGia,
                level: 3,
              })
            }
            this.getTotal()
            this.updateEditCache();
          } else
            if (data.ma.startsWith('02') && dataHang.stt == "0.2.1") {
              const LST_LT = this.lstCtietBcao.filter(s => s.stt.startsWith("0.2"));
              const LST_LT_LK = LST_LT.filter(v => v.stt.startsWith("0.2.1"));
              const LST_LT_LK_CHA = LST_LT_LK.filter(v => v.level == 2);
              if (LST_LT_LK_CHA.length == 0) {
                stt = '0.2.1.' + (LST_LT_LK_CHA.length + 1).toString();
              } else {
                stt = '0.2.1.' + (LST_LT_LK_CHA.length + 1).toString();
              }
              const lastdata = LST_LT_LK[LST_LT_LK.length - 1]

              const indexLtLk = this.lstCtietBcao.findIndex(e => e.maLoaiHang == lastdata.maLoaiHang) + 1;
              // them vat tu moi vao bang
              this.lstCtietBcao.splice(indexLtLk, 0, {
                ... new ItemData(),
                id: uuid.v4() + 'FE',
                stt: stt,
                maLoaiHang: data.ma,
                tenHang: data.ten,
                maDviTinh: null,
                soLuong: null,
                donGiaMua: null,
                thanhTien: null,
                level: 2,
              })

              const lstTemp = this.lstDsHangTrongKho.filter(e => e.cloaiVthh == data.ma && e.maLoai == "LK");
              for (let i = 1; i <= lstTemp.length; i++) {
                this.lstCtietBcao.splice(indexLtLk + 1, 0, {
                  ...new ItemData(),
                  id: uuid.v4() + 'FE',
                  stt: stt + '.' + i.toString(),
                  maLoaiHang: stt + '.' + i.toString(),
                  tenHang: data.ten,
                  maDviTinh: lstTemp[i - 1].donViTinh,
                  soLuong: !lstTemp[i - 1].soLuongThucNhap ? 0 : lstTemp[i - 1]?.soLuongThucNhap,
                  donGiaMua: !lstTemp[i - 1].donGia ? 0 : lstTemp[i - 1]?.donGia,
                  thanhTien: lstTemp[i - 1].soLuongThucNhap * lstTemp[i - 1].donGia,
                  level: 3,
                })
              }
              // this.sum1()
              this.getTotal()
              this.updateEditCache();
            } else if (data.ma.startsWith('02') && dataHang.stt == "0.2.2") {
              const LST_LT = this.lstCtietBcao.filter(s => s.stt.startsWith("0.2"))
              const LST_LT_PS = LST_LT.filter(v => v.stt.startsWith("0.2.2"))
              const LST_LT_PS_CHA = LST_LT_PS.filter(v => v.level == 2);
              if (LST_LT_PS_CHA.length == 0) {
                stt = '0.2.2.' + (LST_LT_PS_CHA.length + 1).toString();
              } else {
                stt = '0.2.2.' + (LST_LT_PS_CHA.length + 1).toString();
              }
              const lastdata = LST_LT_PS[LST_LT_PS.length - 1]
              const indexLtLk = this.lstCtietBcao.findIndex(e => e.maLoaiHang == lastdata.maLoaiHang) + 1;
              // them vat tu moi vao bang
              this.lstCtietBcao.splice(indexLtLk, 0, {
                ... new ItemData(),
                id: uuid.v4() + 'FE',
                stt: stt,
                maLoaiHang: data.ma,
                tenHang: data.ten,
                maDviTinh: null,
                soLuong: null,
                donGiaMua: null,
                thanhTien: null,
                level: 2,
              })
              const lstTemp = this.lstDsHangTrongKho.filter(e => e.cloaiVthh == data.ma && e.maLoai == "LK");
              for (let i = 1; i <= lstTemp.length; i++) {
                this.lstCtietBcao.splice(indexLtLk + 1, 0, {
                  ...new ItemData(),
                  id: uuid.v4() + 'FE',
                  stt: stt + '.' + i.toString(),
                  maLoaiHang: stt + '.' + i.toString(),
                  tenHang: data.ten,
                  maDviTinh: lstTemp[i - 1].donViTinh,
                  soLuong: !lstTemp[i - 1].soLuongThucNhap ? 0 : lstTemp[i - 1]?.soLuongThucNhap,
                  donGiaMua: !lstTemp[i - 1].donGia ? 0 : lstTemp[i - 1]?.donGia,
                  thanhTien: lstTemp[i - 1].soLuongThucNhap * lstTemp[i - 1].donGia,
                  level: 3,
                })
              }
              this.getTotal()
              this.updateEditCache();
            }
        }
      }
      this.sum1();
      this.getTotal()
      this.updateEditCache();
    });
  }


  checkDelete(stt: string) {
    const level = stt.split('.').length - 2;
    if (level == 2) {
      return true;
    }
    return false;
  }

  checkEdit(stt: string) {
    const lstTemp = this.lstCtietBcao.filter(e => e.stt !== stt);
    return lstTemp.every(e => !e.stt.startsWith(stt));
  }

  checkAdd(stt: string) {

    if (
      stt == "0.1.1" ||
      stt == "0.1.2" ||
      stt == "0.2.1" ||
      stt == "0.2.2"
    ) {
      return true;
    }
    return false;
  }

};