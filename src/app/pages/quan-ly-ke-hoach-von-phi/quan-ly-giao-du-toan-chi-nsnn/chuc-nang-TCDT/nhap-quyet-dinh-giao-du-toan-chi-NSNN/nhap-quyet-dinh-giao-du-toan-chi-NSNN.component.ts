import { DatePipe, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import * as fileSaver from 'file-saver';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogLuaChonThemDonViComponent } from 'src/app/components/dialog/dialog-lua-chon-them-don-vi/dialog-lua-chon-them-don-vi.component';
import { DialogThemKhoanMucComponent } from 'src/app/components/dialog/dialog-them-khoan-muc/dialog-them-khoan-muc.component';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { divMoney, DON_VI_TIEN, KHOAN_MUC, LA_MA, MONEY_LIMIT, mulMoney, TRANG_THAI_TIM_KIEM, Utils } from 'src/app/Utility/utils';
import * as uuid from 'uuid';
import { ItemCongVan, ItemDataMau02 } from '../../../quy-trinh-bao-ket-qua-THVP-hang-DTQG-tai-tong-cuc/nhom-chuc-nang-chi-cuc/bao-cao/bao-cao.component';


export class ItemData {
  id!: any;
  stt: any;
  level: number;
  maNdung: number;
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

@Component({
  selector: 'app-nhap-quyet-dinh-giao-du-toan-chi-NSNN',
  templateUrl: './nhap-quyet-dinh-giao-du-toan-chi-NSNN.component.html',
  styleUrls: ['./nhap-quyet-dinh-giao-du-toan-chi-NSNN.component.scss']
})
export class NhapQuyetDinhGiaoDuToanChiNSNNComponent implements OnInit {
  //thong tin dang nhap
  id: any;
  userInfo: any;
  //thong tin chung bao cao

  ngayTao: string;
  maDonViTao: string;
  maPa: string;
  maPaCha: string;
  lstDvi: any[] = [];                                         //danh sach don vi da duoc chon
  namPa: number;
  soQd: ItemCongVan = new ItemCongVan();
  trangThaiBanGhi: string = '1';
  newDate = new Date();
  maDviTien: string;
  thuyetMinh: string;
  maLoai: string = '2';
  //danh muc
  lstCtietBcao: ItemData[] = [];
  donVis: any[] = [];
  noiDungs: any[] = KHOAN_MUC;
  donViTiens: any[] = DON_VI_TIEN;
  trangThais: any[] = TRANG_THAI_TIM_KIEM;
  soLaMa: any[] = LA_MA;
  initItem: ItemData = {
    id: null,
    stt: "0",
    level: 0,
    maNdung: 0,
    tongCong: 0,
    nguonNsnn: 0,
    nguonKhac: 0,
    checked: false,
  };
  total: ItemData = {
    id: null,
    stt: "0",
    level: 0,
    maNdung: 0,
    tongCong: 0,
    nguonNsnn: 0,
    nguonKhac: 0,
    checked: false,
  };
  //trang thai cac nut
  status: boolean = false;
  statusBtnSave: boolean;
  statusBtnNew: boolean;
  statusBtnEdit: boolean;
  statusBtnCopy: boolean;
  statusBtnPrint: boolean;
  allChecked = false;
  //khac
  editCache: { [key: string]: { edit: boolean; data: ItemData } } = {}; // phuc vu nut chinh
  listId: string = '';
  lstFiles: any[] = []; //show file ra man hinh
  //file
  listFile: File[] = [];                      // list file chua ten va id de hien tai o input
  fileList: NzUploadFile[] = [];
  fileDetail: NzUploadFile;
  //beforeUpload: any;
  listIdFilesDelete: any = [];                        // id file luc call chi tiet

  // before uploaf file
  beforeUpload = (file: NzUploadFile): boolean => {
    this.fileList = this.fileList.concat(file);
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
    private quanLyVonPhiService: QuanLyVonPhiService,
    private danhMuc: DanhMucHDVService,
    private spinner: NgxSpinnerService,
    private routerActive: ActivatedRoute,
    private datePipe: DatePipe,
    private sanitizer: DomSanitizer,
    private router: Router,
    private userService: UserService,
    private notification: NzNotificationService,
    private location: Location,
    private modal: NzModalService,
  ) { }

  async ngOnInit() {
    //lay id cua ban ghi
    this.id = this.routerActive.snapshot.paramMap.get('id');
    //lay thong tin user
    let userName = this.userService.getUserName();
    await this.getUserInfo(userName);

    //lay danh sach danh muc
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
      this.trangThaiBanGhi = '1';
      this.maDonViTao = this.userInfo?.dvql;
      this.lstDvi = this.donVis.filter(e => e.parent?.maDvi === this.maDonViTao);
      this.ngayTao = this.newDate.toISOString().slice(0, 16);
      this.spinner.show();
      this.quanLyVonPhiService.maPhuongAnGiao(this.maLoai).toPromise().then(
        (res) => {
          if (res.statusCode == 0) {
            this.maPa = res.data;
            let sub = "BTC";
            this.maPa = this.maPa.slice(0, 2) + sub + this.maPa.slice(2);
          } else {
            this.notification.error(MESSAGE.ERROR, res?.msg);
          }
        },
        (err) => {
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        },
      );
      this.namPa = this.newDate.getFullYear();
    }
    this.getStatusButton();
    this.spinner.hide();

  }

  redirectkehoachvonphi() {
    this.location.back()
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
  //check role cho các nut trinh duyet
  getStatusButton() {
    if (this.id) {
      this.status = true;
    } else {
      this.status = false;
    }

    let checkChirld = false;
    let dVi = this.donVis.find(e => e.maDvi == this.maDonViTao);
    if (dVi && dVi.maDvi == this.userInfo?.dvql) {
      checkChirld = true;
    }
    const utils = new Utils();
    this.statusBtnSave = utils.getRoleSave(this.trangThaiBanGhi, checkChirld, this.userInfo?.roles[0]?.code);
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
    this.statusBtnCopy = utils.getRoleCopy(this.trangThaiBanGhi, checkChirld, this.userInfo?.roles[0]?.code);
    this.statusBtnPrint = utils.getRolePrint(this.trangThaiBanGhi, checkChirld, this.userInfo?.roles[0]?.code);
  }
  //upload file
  async uploadFile(file: File) {
    // day file len server
    const upfile: FormData = new FormData();
    upfile.append('file', file);
    upfile.append('folder', this.maLoai + '/' + this.maDonViTao);
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


  //download file về máy tính
  async downloadFileSoQuyetDinh() {
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

  // call chi tiet bao cao
  async getDetailReport() {
    this.spinner.show();
    await this.quanLyVonPhiService.QDGiaoChiTiet(this.id, this.maLoai).toPromise().then(
      async (data) => {
        if (data.statusCode == 0) {
          this.id = data.data.id;
          this.lstCtietBcao = data.data.lstCtiets[0];
          this.maDviTien = data.data.maDviTien;
          this.sortByIndex();
          this.lstCtietBcao.forEach(item => {
            item.tongCong = divMoney(item.tongCong, this.maDviTien);
            item.nguonNsnn = divMoney(item.nguonNsnn, this.maDviTien);
            item.nguonKhac = divMoney(item.nguonKhac, this.maDviTien);
          })
          this.namPa = data.data.namPa;
          this.trangThaiBanGhi = data.data.trangThai;
          this.maPa = data.data.maPa;
          this.maDonViTao = data.data.maDvi;
          this.thuyetMinh = data.data.thuyetMinh;
          this.ngayTao = data.data.ngayTao
          this.soQd = data.data.soQd;
          this.maPaCha = data.data.maPa;
          this.lstDvi = this.donVis.filter(e => e.parent?.maDvi === this.maDonViTao);
          this.lstFiles = data.data.lstFiles;
          this.listFile = [];
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
  }

  // chuc nang check role
  async onSubmit(mcn: string, lyDoTuChoi: string) {
    if (this.id) {
      const requestGroupButtons = {
        id: this.id,
        maChucNang: mcn,
        lyDoTuChoi: lyDoTuChoi,
      };
      this.spinner.show();
      await this.quanLyVonPhiService.trinhDuyetPhuongAnGiao(requestGroupButtons).toPromise().then(async (data) => {
        if (data.statusCode == 0) {
          this.trangThaiBanGhi = mcn;
          this.getStatusButton();
          if (mcn == Utils.TT_BC_8 || mcn == Utils.TT_BC_5 || mcn == Utils.TT_BC_3) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.REVERT_SUCCESS);
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
  }

  //show popup tu choi
  tuChoi(mcn: string) {
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


  // luu
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

    let lstCtietBcaoTemp: any[] = [];
    let checkMoneyRange = true;
    // gui du lieu trinh duyet len server
    this.lstCtietBcao.forEach(item => {
      if (mulMoney(item.tongCong, this.maDviTien) > MONEY_LIMIT) {
        checkMoneyRange = false;
        return;
      }
      lstCtietBcaoTemp.push({
        ...item,
        tongCong: mulMoney(item.tongCong, this.maDviTien),
        nguonNsnn: mulMoney(item.nguonNsnn, this.maDviTien),
        nguonKhac: mulMoney(item.nguonKhac, this.maDviTien),
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
    let listFile: any = [];
    for (const iterator of this.listFile) {
      listFile.push(await this.uploadFile(iterator));
    }

    // gui du lieu trinh duyet len server
    let request = JSON.parse(JSON.stringify({
      id: this.id,
      fileDinhKems: this.lstFiles,
      listIdFiles: this.listIdFilesDelete,
      lstCtiets: lstCtietBcaoTemp,
      maDvi: this.maDonViTao,
      maDviTien: this.maDviTien,
      // maPa: this.maPa,
      maPa: this.maPa,
      namPa: this.namPa,
      maPhanGiao: '1',
      trangThai: this.trangThaiBanGhi,
      thuyetMinh: this.thuyetMinh,
      soQd: this.soQd,
    }));
    if (this.soQd.fileName == null) {
      this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.DOCUMENTARY);
      return
    }
    //get file cong van url
    let file: any = this.fileDetail;
    if (file) {
      request.soQd = await this.uploadFile(file);
    }
    this.spinner.show();
    if (!this.id) {
      this.quanLyVonPhiService.giaoDuToan(request).toPromise().then(
        async (data) => {
          if (data.statusCode == 0) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
            if (!this.id) {
              this.router.navigate([
                '/qlkh-von-phi/quan-ly-giao-du-toan-chi-nsnn/nhap-quyet-dinh-giao-du-toan-chi-NSNN-BTC/' + data.data.id,
              ])
            }
            else {
              await this.getDetailReport();
              this.getStatusButton();
            }
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
      this.quanLyVonPhiService.updateLapThamDinhGiaoDuToan(request).toPromise().then(
        async (data) => {
          if (data.statusCode == 0) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
            if (!this.id) {
              this.router.navigate([
                '/qlkh-von-phi/quan-ly-giao-du-toan-chi-nsnn/nhap-quyet-dinh-giao-du-toan-chi-NSNN-BTC/' + data.data.id,
              ])
            }
            else {
              await this.getDetailReport();
              this.getStatusButton();
            }
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
  }

  //lay ten don vi tạo
  getUnitName() {
    return this.donVis.find((item) => item.maDvi == this.maDonViTao)?.tenDvi;
  }

  getStatusName() {
    const utils = new Utils();
    return utils.getStatusName(this.trangThaiBanGhi);
  }

  // chuyển đổi stt đang được mã hóa thành dạng I, II, a, b, c, ...
  getChiMuc(str: string): string {
    str = str.substring(str.indexOf('.') + 1, str.length);
    var xau: string = "";
    let chiSo: any = str.split('.');
    var n: number = chiSo.length - 1;
    var k: number = parseInt(chiSo[n], 10);
    if (n == 0) {
      for (var i = 0; i < this.soLaMa.length; i++) {
        while (k >= this.soLaMa[i].gTri) {
          xau += this.soLaMa[i].kyTu;
          k -= this.soLaMa[i].gTri;
        }
      }
    };
    if (n == 1) {
      xau = chiSo[n];
    };
    if (n == 2) {
      xau = chiSo[n - 1].toString() + "." + chiSo[n].toString();
    };
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
  //tìm vị trí cần để thêm mới
  findVt(str: string): number {
    var start: number = this.lstCtietBcao.findIndex(e => e.stt == str);
    var index: number = start;
    for (var i = start + 1; i < this.lstCtietBcao.length; i++) {
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
      var str = this.getHead(this.lstCtietBcao[item].stt) + "." + (this.getTail(this.lstCtietBcao[item].stt) + heSo).toString();
      var nho = this.lstCtietBcao[item].stt;
      this.lstCtietBcao.forEach(item => {
        item.stt = item.stt.replace(nho, str);
      })
    })
  }

  //thêm ngang cấp
  addSame(id: any, initItem: ItemData) {
    var index: number = this.lstCtietBcao.findIndex(e => e.id === id); // vi tri hien tai
    var head: string = this.getHead(this.lstCtietBcao[index].stt); // lay phan dau cua so tt
    var tail: number = this.getTail(this.lstCtietBcao[index].stt); // lay phan duoi cua so tt
    var ind: number = this.findVt(this.lstCtietBcao[index].stt); // vi tri can duoc them
    // tim cac vi tri can thay doi lai stt
    let lstIndex: number[] = [];
    for (var i = this.lstCtietBcao.length - 1; i > ind; i--) {
      if (this.getHead(this.lstCtietBcao[i].stt) == head) {
        lstIndex.push(i);
      }
    }
    this.replaceIndex(lstIndex, 1);
    // them moi phan tu
    if (initItem.id) {
      let item: ItemData = {
        ...initItem,
        stt: head + "." + (tail + 1).toString(),
      }
      this.lstCtietBcao.splice(ind + 1, 0, item);
      this.editCache[item.id] = {
        edit: false,
        data: { ...item }
      };
    } else {
      let item: ItemData = {
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
  }

  // gan editCache.data == lstCtietBcao
  updateEditCache(): void {
    this.lstCtietBcao.forEach(item => {
      this.editCache[item.id] = {
        edit: false,
        data: {
          ...item,
        }
      }
    })
  }
  //thêm cấp thấp hơn
  addLow(id: any, initItem: ItemData) {
    var data: ItemData = this.lstCtietBcao.find(e => e.id === id);
    var index: number = this.lstCtietBcao.findIndex(e => e.id === id); // vi tri hien tai
    var stt: string;
    if (this.lstCtietBcao.findIndex(e => this.getHead(e.stt) == data.stt) == -1) {
      stt = data.stt + '.1';
    } else {
      index = this.findVt(data.stt);
      for (var i = this.lstCtietBcao.length - 1; i >= 0; i--) {
        if (this.getHead(this.lstCtietBcao[i].stt) == data.stt) {
          stt = data.stt + '.' + (this.getTail(this.lstCtietBcao[i].stt) + 1).toString();
          break;
        }
      }
    }

    // them moi phan tu
    if (initItem.id) {
      let item: ItemData = {
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
      let item: ItemData = {
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

  }
  //xóa dòng
  deleteLine(id: any) {
    var index: number = this.lstCtietBcao.findIndex(e => e.id === id); // vi tri hien tai
    var nho: string = this.lstCtietBcao[index].stt;
    var head: string = this.getHead(this.lstCtietBcao[index].stt); // lay phan dau cua so tt
    //xóa phần tử và con của nó
    this.lstCtietBcao = this.lstCtietBcao.filter(e => !e.stt.startsWith(nho));
    //update lại số thức tự cho các phần tử cần thiết
    let lstIndex: number[] = [];
    for (var i = this.lstCtietBcao.length - 1; i >= index; i--) {
      if (this.getHead(this.lstCtietBcao[i].stt) == head) {
        lstIndex.push(i);
      }
    }
    this.replaceIndex(lstIndex, -1);
    this.updateEditCache();
  }

  // start edit
  startEdit(id: string): void {
    this.editCache[id].edit = true;
  }

  // huy thay doi
  cancelEdit(id: string): void {
    const index = this.lstCtietBcao.findIndex(item => item.id === id);
    // lay vi tri hang minh sua
    this.editCache[id] = {
      data: { ...this.lstCtietBcao[index] },
      edit: false
    };
  }


  // luu thay doi
  saveEdit(id: string): void {
    if (
      (!this.editCache[id].data.nguonKhac && this.editCache[id].data.nguonKhac !== 0) ||
      (!this.editCache[id].data.nguonNsnn && this.editCache[id].data.nguonNsnn !== 0)
    ) {
      this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS)
      return;
    }
    this.editCache[id].data.checked = this.lstCtietBcao.find(item => item.id === id).checked; // set checked editCache = checked lstCtietBcao
    const index = this.lstCtietBcao.findIndex(item => item.id === id); // lay vi tri hang minh sua
    Object.assign(this.lstCtietBcao[index], this.editCache[id].data); // set lai data cua lstCtietBcao[index] = this.editCache[id].data
    this.editCache[id].edit = false; // CHUYEN VE DANG TEXT
    this.sum(this.lstCtietBcao[index].stt);
    this.updateEditCache();
  }

  updateChecked(id: any) {
    var data: ItemData = this.lstCtietBcao.find(e => e.id === id);
    //đặt các phần tử con có cùng trạng thái với nó
    this.lstCtietBcao.forEach(item => {
      if (item.stt.startsWith(data.stt)) {
        item.checked = data.checked;
      }
    })
    //thay đổi các phần tử cha cho phù hợp với tháy đổi của phần tử con
    var index: number = this.lstCtietBcao.findIndex(e => e.stt == this.getHead(data.stt));
    if (index == -1) {
      this.allChecked = this.checkAllChild('0');
    } else {
      var nho: boolean = this.lstCtietBcao[index].checked;
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
  }
  //kiểm tra các phần tử con có cùng được đánh dấu hay ko
  checkAllChild(str: string): boolean {
    var nho: boolean = true;
    this.lstCtietBcao.forEach(item => {
      if ((this.getHead(item.stt) == str) && (!item.checked) && (item.stt != str)) {
        nho = item.checked;
      }
    })
    return nho;
  }


  updateAllChecked() {
    this.lstCtietBcao.forEach(item => {
      item.checked = this.allChecked;
    })
  }

  deleteAllChecked() {
    var lstId: any[] = [];
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
  }
  //thêm phần tử đầu tiên khi bảng rỗng
  addFirst(initItem: ItemData) {
    if (initItem.id) {
      let item: ItemData = {
        ...initItem,
        stt: "0.1",
      }
      this.lstCtietBcao.push(item);
      this.editCache[item.id] = {
        edit: false,
        data: { ...item }
      };
    } else {
      let item: ItemData = {
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
    var lstTemp: any[] = [];
    this.lstCtietBcao.forEach(item => {
      var index: number = lstTemp.findIndex(e => e.stt == this.getHead(item.stt));
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

  addLine(id: any) {
    var maNdung: any = this.lstCtietBcao.find(e => e.id == id)?.maNdung;
    let obj = {
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
        var index: number = this.lstCtietBcao.findIndex(e => e.maNdung == res.maKhoanMuc);
        if (index == -1) {
          let data: any = {
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
          var data: ItemData = {
            ...this.initItem,
            maNdung: item.id,
            level: item.level,
          };
          this.addLow(id, data);
        })
        this.updateEditCache();
      }
    });

  }

  changeModel(id: any) {
    this.editCache[id].data.tongCong = Number(this.editCache[id].data.nguonNsnn) + Number(this.editCache[id].data.nguonKhac);
  }
  close() {
    this.location.back();
  }

  async linkToPaPbo() {
    let listCtietDvi: any[] = [];
    let maPaCha = this.maPa
    await this.quanLyVonPhiService.maPhuongAnGiao(this.maLoai).toPromise().then(
      (res) => {
        if (res.statusCode == 0) {
          this.maPa = res.data;
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
        id: null,
        maDviNhan: item.maDvi,
        soTranChi: 0,
      })
    })

    let lstCtietBcaoTemp: any[] = [];
    // gui du lieu trinh duyet len server
    this.lstCtietBcao.forEach(item => {
      lstCtietBcaoTemp.push({
        ...item,
        tongCong: mulMoney(item.tongCong, this.maDviTien),
        nguonNsnn: mulMoney(item.nguonNsnn, this.maDviTien),
        nguonKhac: mulMoney(item.nguonKhac, this.maDviTien),
        lstCtietDvis: listCtietDvi,
        id: null,
      })
    })

    lstCtietBcaoTemp.forEach(item => {
      if (item.id?.length == 38) {
        item.id = null;
      }
    });

    // gui du lieu trinh duyet len server
    let request = {
      id: null,
      fileDinhKems: [],
      listIdDeleteFiles: [],
      lstCtiets: lstCtietBcaoTemp,
      maDvi: this.maDonViTao,
      maDviTien: this.maDviTien,
      maPa: this.maPa,
      maPaCha: maPaCha,
      namPa: this.namPa,
      maPhanGiao: "2",
      maLoaiDan: '1',
      trangThai: "1",
      thuyetMinh: "",
    };
    this.spinner.show();
    this.quanLyVonPhiService.giaoDuToan(request).toPromise().then(
      async (data) => {
        if (data.statusCode == 0) {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
          this.router.navigate([
            '/qlkh-von-phi/quan-ly-giao-du-toan-chi-nsnn/xay-dung-phuong-an-giao-du-toan-chi-NSNN-cho-cac-don-vi/' + data.data.id,
          ])
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

  async linkToPaGiaoDC() {
    let listCtietDvi: any[] = [];
    let maPaCha = this.maPa
    await this.quanLyVonPhiService.maPhuongAnGiao(this.maLoai).toPromise().then(
      (res) => {
        if (res.statusCode == 0) {
          this.maPa = res.data;
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
        id: null,
        maDviNhan: item.maDvi,
        soTranChi: 0,
      })
    })

    let lstCtietBcaoTemp: any[] = [];
    // gui du lieu trinh duyet len server
    this.lstCtietBcao.forEach(item => {
      lstCtietBcaoTemp.push({
        ...item,
        tongCong: mulMoney(item.tongCong, this.maDviTien),
        nguonNsnn: mulMoney(item.nguonNsnn, this.maDviTien),
        nguonKhac: mulMoney(item.nguonKhac, this.maDviTien),
        lstCtietDvis: listCtietDvi,
        id: null,
      })
    })

    lstCtietBcaoTemp.forEach(item => {
      if (item.id?.length == 38) {
        item.id = null;
      }
    });

    // gui du lieu trinh duyet len server
    let request = {
      id: null,
      fileDinhKems: [],
      listIdDeleteFiles: [],
      lstCtiets: lstCtietBcaoTemp,
      maDvi: this.maDonViTao,
      maDviTien: this.maDviTien,
      maPa: this.maPa,
      maPaCha: maPaCha,
      namPa: this.namPa,
      maPhanGiao: "2",
      maLoaiDan: '2',
      trangThai: "1",
      thuyetMinh: "",
    };
    this.spinner.show();
    this.quanLyVonPhiService.giaoDuToan(request).toPromise().then(
      async (data) => {
        if (data.statusCode == 0) {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
          this.router.navigate([
            '/qlkh-von-phi/quan-ly-giao-du-toan-chi-nsnn/xay-dung-phuong-an-giao-dieu-chinh-du-toan-chi-NSNN-cho-cac-don-vi/' + data.data.id,
          ])
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

  getLowStatus(str: string) {
    var index: number = this.lstCtietBcao.findIndex(e => this.getHead(e.stt) == str);
    if (index == -1) {
      return false;
    }
    return true;
  }

  sum(stt: string) {
    stt = this.getHead(stt);
    while (stt != '0') {
      var index = this.lstCtietBcao.findIndex(e => e.stt == stt);
      let data = this.lstCtietBcao[index];
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
  }

  getTotal() {
    this.total.nguonKhac = 0;
    this.total.nguonNsnn = 0;
    this.total.tongCong = 0;
    this.lstCtietBcao.forEach(item => {
      if (item.level == 0) {
        this.total.nguonKhac += item.nguonKhac;
        this.total.nguonNsnn += item.nguonNsnn;
        this.total.nguonKhac += item.nguonKhac;
      }
    })
  }

}
