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


export class ItemData {
  id!: any;
  stt: any;
  level: number;
  maNdung: number;
  tongSo: any;
  lstCtietDvis: ItemDvi[] = [];
  checked!: boolean;
}

export class ItemDvi {
  id: any;
  maDviNhan: string;
  soTranChi: number;
  trangThai: string;
}

export class ItemFile {
  fileName: string;
  fileSize: number;
  fileUrl: number;
}

@Component({
  selector: 'app-xay-dung-phuong-an-giao-du-toan-chi-NSNN-cho-cac-don-vi',
  templateUrl: './xay-dung-phuong-an-giao-du-toan-chi-NSNN-cho-cac-don-vi.component.html',
  styleUrls: ['./xay-dung-phuong-an-giao-du-toan-chi-NSNN-cho-cac-don-vi.component.scss']
})
export class XayDungPhuongAnGiaoDuToanChiNSNNChoCacDonViComponent implements OnInit {
  //thong tin dang nhap
  id: any;
  userInfo: any;
  //thong tin chung bao cao
  ngayTao: string;
  maDonViTao: string;
  maPa: string;
  maPaBTC: string = "PABTC-1";
  namPa: number;
  soQd: ItemFile;
  qdGiaoDuToan: ItemFile;
  trangThaiBanGhi: string = '1';
  newDate = new Date();
  maDviTien: string;
  thuyetMinh: string;
  //danh muc
  lstCtietBcao: ItemData[] = [];
  donVis: any[] = [];
  noiDungs: any[] = KHOAN_MUC;
  donViTiens: any[] = DON_VI_TIEN;
  trangThais: any[] = TRANG_THAI_TIM_KIEM;
  soLaMa: any[] = LA_MA;
  lstDvi: any[] = [];                                         //danh sach don vi da duoc chon
  lstDviChon: any[] = [];                                     //danh sach don vi chua duoc chon
  //trang thai cac nut
  status: boolean = false;
  statusBtnDel: boolean;
  statusBtnSave: boolean;
  statusBtnApprove: boolean;
  statusBtnTBP: boolean;
  statusBtnLD: boolean;
  statusBtnCopy: boolean;
  statusBtnPrint: boolean;
  statusBtnGiao: boolean;
  statusBtnGiaoToanBo: boolean = false;
  statusAn: boolean = true;
  allChecked = false;
  lstDviTrucThuoc: any[] = [];
  //khac
  editCache: { [key: string]: { edit: boolean; data: ItemData } } = {}; // phuc vu nut chinh
  checkGiao: boolean = true;
  listId: string = '';
  fileDetail: NzUploadFile;
  maGiao: any;
  maLoai: string = '2';
  //file
  lstFiles: any[] = []; //show file ra man hinh
  listFile: File[] = [];                      // list file chua ten va id de hien tai o input
  fileList: NzUploadFile[] = [];
  //beforeUpload: any;
  listIdFilesDelete: any = [];                        // id file luc call chi tiet

  // before uploaf file
  beforeUploadQdGiaoDuToan = (file: NzUploadFile): boolean => {
    this.fileDetail = file;
    this.qdGiaoDuToan = {
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
      this.lstFiles.push({ id: id, fileName: file?.name });
      this.listFile.push(file);
    });
    this.fileList = [];
  }

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
          console.log(this.donVis);

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
      this.ngayTao = this.datePipe.transform(this.newDate, Utils.FORMAT_DATE_STR);
      this.spinner.show();
      this.quanLyVonPhiService.maPhuongAnGiao(this.maLoai).toPromise().then(
        (res) => {
          if (res.statusCode == 0) {
            this.maPa = res.data;
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
    // this.route.navigate(['/qlkh-von-phi/quan-ly-lap-tham-dinh-du-toan-nsnn']);
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
    let checkChirld = false;
    let dVi = this.donVis.find(e => e.maDvi == this.maDonViTao);
    if (dVi && dVi.maDvi == this.userInfo?.dvql) {
      checkChirld = true;
    }
    const utils = new Utils();
    this.statusBtnDel = utils.getRoleDel(this.trangThaiBanGhi, checkChirld, this.userInfo?.roles[0]?.code);
    this.statusBtnSave = utils.getRoleSave(this.trangThaiBanGhi, checkChirld, this.userInfo?.roles[0]?.code);
    this.statusBtnApprove = utils.getRoleApprove(this.trangThaiBanGhi, checkChirld, this.userInfo?.roles[0]?.code);
    this.statusBtnTBP = utils.getRoleTBP(this.trangThaiBanGhi, checkChirld, this.userInfo?.roles[0]?.code);
    this.statusBtnLD = utils.getRoleLD(this.trangThaiBanGhi, checkChirld, this.userInfo?.roles[0]?.code);
    this.statusBtnCopy = utils.getRoleCopy(this.trangThaiBanGhi, checkChirld, this.userInfo?.roles[0]?.code);
    this.statusBtnPrint = utils.getRolePrint(this.trangThaiBanGhi, checkChirld, this.userInfo?.roles[0]?.code);
    if (this.userInfo?.roles[0]?.code == '3' && this.soQd) {
      this.statusBtnGiao = false;
    } else {
      this.statusBtnGiao = true;
    }
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
    upfile.append('folder', this.maPa + '/' + this.maDonViTao);
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

  // call chi tiet bao cao
  async getDetailReport() {
    this.spinner.show();
    await this.quanLyVonPhiService.QDGiaoChiTiet1(this.id, this.maLoai).toPromise().then(
      async (data) => {
        if (data.statusCode == 0) {
          this.id = data.data.id;
          this.lstCtietBcao = data.data.lstCtiets[0];
          this.maDviTien = data.data.maDviTien;
          this.lstDvi = [];
          this.lstCtietBcao[0]?.lstCtietDvis.forEach(item => {
            this.lstDvi.push(this.donVis.find(e => e.maDvi == item.maDviNhan));
          })
          this.sortByIndex();
          this.maDviTien = data.data.maDviTien;
          this.lstCtietBcao.forEach(item => {
            item.tongSo = divMoney(item.tongSo, this.maDviTien);
            item.lstCtietDvis.forEach(e => {
              e.soTranChi = divMoney(e.soTranChi, this.maDviTien);
            })
          })
          debugger
          this.lstCtietBcao[0]?.lstCtietDvis.forEach(item => {
            if(item.trangThai == "1"){
              this.statusBtnGiaoToanBo = true;
            }
          })
          this.namPa = data.data.namPa;
          this.trangThaiBanGhi = data.data.trangThai;
          this.maPa = data.data.maPa;
          this.maDonViTao = data.data.maDvi;
          this.thuyetMinh = data.data.thuyetMinh;
          this.ngayTao = this.datePipe.transform(data.data.ngayTao, Utils.FORMAT_DATE_STR);
          this.soQd = data.data.soQd;
          this.lstFiles = data.data.lstFiles;
          this.listFile = [];
          this.maGiao = data.data.maGiao;
          if (
            this.trangThaiBanGhi == Utils.TT_BC_1 ||
            this.trangThaiBanGhi == Utils.TT_BC_3 ||
            this.trangThaiBanGhi == Utils.TT_BC_5 ||
            this.trangThaiBanGhi == Utils.TT_BC_8
          ) {
            this.status = false;
            this.lstDviChon = [];
            this.donVis.forEach(item => {
              if ((this.lstDvi.findIndex(e => e.maDvi == item.maDvi) == -1) && (item.parent?.maDvi === this.maDonViTao)) {
                this.lstDviChon.push(item);
              }
            })
          } else {
            this.status = true;
            this.statusAn = false;
          }
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

    let lstCtietBcaoTemp: ItemData[] = [];
    let checkMoneyRange = true;

    // gui du lieu trinh duyet len server
    this.lstCtietBcao.forEach(item => {
      if (mulMoney(item.tongSo, this.maDviTien) > MONEY_LIMIT) {
        checkMoneyRange = false;
        return;
      }
      let data: ItemDvi[] = [];
      item.lstCtietDvis.forEach(e => {
        data.push({
          ...e,
          soTranChi: mulMoney(e.soTranChi, this.maDviTien),
        })
      })
      lstCtietBcaoTemp.push({
        ...item,
        tongSo: mulMoney(item.tongSo, this.maDviTien),
        lstCtietDvis: data,
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
      item.lstCtietDvis.forEach(e => {
        if (e.id?.length == 38) {
          e.id = null;
        }
      })
    });

    //get list file url
    let listFile: any = [];
    for (const iterator of this.listFile) {
      listFile.push(await this.uploadFile(iterator));
    }

    let tongHopTuIds = [];
    this.lstDviTrucThuoc.forEach(item => {
      tongHopTuIds.push(item.id);
    })

    let request = JSON.parse(JSON.stringify({
      id: this.id,
      fileDinhKems: this.lstFiles,
      listIdDeleteFiles: this.listIdFilesDelete,                      // id file luc get chi tiet tra ra( de backend phuc vu xoa file)
      lstCtiets: lstCtietBcaoTemp,
      maDvi: this.maDonViTao,
      maDviTien: this.maDviTien,
      maPa: this.maPa,
      namPa: this.namPa,
      maPhanGiao: "2",
      trangThai: this.trangThaiBanGhi,
      thuyetMinh: this.thuyetMinh,
      ngayTao: this.ngayTao,
      maLoaiDan: "1",
      maGiao: this.maGiao,
    }));
    this.spinner.show();
    if (!this.id) {
      this.quanLyVonPhiService.giaoDuToan1(request).toPromise().then(
        async (data) => {
          if (data.statusCode == 0) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
            if (!this.id) {
              this.router.navigate([
                '/qlkh-von-phi/quan-ly-giao-du-toan-chi-nsnn/xay-dung-phuong-an-giao-du-toan-chi-NSNN-cho-cac-don-vi/' + data.data.id,
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
    } else {
      this.quanLyVonPhiService.capnhatPhuongAn(request).toPromise().then(
        async (data) => {
          if (data.statusCode == 0) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
            await this.getDetailReport();
            this.getStatusButton();
          } else {
            this.notification.error(MESSAGE.ERROR, data?.msg);
          }
        },
        (err) => {
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        },
      );
    }
    this.lstCtietBcao.filter(item => {
      if (!item.id) {
        item.id = uuid.v4() + 'FE';
      }
    });
    this.spinner.hide();
  }

  giaoSoTranChi(maDvi: any) {
    let lstGiao: any[] = [];

    if (maDvi) {
      let lstCtiet: any[] = [];
      this.lstCtietBcao.forEach(item => {
        lstCtiet.push({
          stt: item.stt,
          maNoiDung: item.maNdung,
          soTien: item.lstCtietDvis.find(e => e.maDviNhan == maDvi).soTranChi,
        })
      })
      lstGiao.push({
        maGiao: this.maGiao,
        maPa: this.maPa,
        maDvi: this.maDonViTao,
        maDviNhan: maDvi,
        trangThai: '1',
        maDviTien: this.maDviTien,
        soQd: this.soQd,
        listCtiet: lstCtiet,
        maLoaiDan: "1",
        namDtoan: this.namPa,
        ngayGiao: this.ngayTao,
        ngayTao: this.ngayTao,
      })
    } else {
      console.log(this.lstCtietBcao[0]);
      if (this.lstCtietBcao.length > 0) {
        this.lstCtietBcao[0].lstCtietDvis.forEach(item => {
          if (item.trangThai == "0") {
            let lstCtiet: any[] = [];

            this.lstCtietBcao.forEach(data => {
              let soTien = data.lstCtietDvis.find(e => e.maDviNhan !== maDvi).soTranChi
              lstCtiet.push({
                stt: data.stt,
                maNhom: data.maNdung,
                soTien: soTien,
              })
            })

            lstGiao.push({
              maGiao: this.maGiao,
              maPa: this.maPa,
              maDvi: this.maDonViTao,
              maDviNhan: item.maDviNhan,
              trangThai: '1',
              maDviTien: this.maDviTien,
              soQd: this.soQd,
              listCtiet: lstCtiet,
              maLoaiDan: "1",
              namDtoan: this.namPa,
              ngayGiao: this.ngayTao,
              ngayTao: this.ngayTao,
            })
          }
        })
      }
    }

    this.quanLyVonPhiService.giaoSoTranChiGiaoDuToan(lstGiao).toPromise().then(
      data => {
        if (data.statusCode == 0) {
          if (maDvi) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.GIAO_SO_TRAN_CHI_SUCCESS);
          } else {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.GIAO_SO_TRAN_CHI_TOAN_BO)
          }
          this.getDetailReport();
          // lstDviNhan.forEach(item => {
          //     let index = this.lstCtietBcao[0].lstCtietDvis.findIndex(e => e.maDviNhan == item);
          //     this.lstCtietBcao[0].lstCtietDvis[index].trangThai = '1';
          // })

        } else {
          this.notification.error(MESSAGE.ERROR, data?.msg);
        }
      },
      err => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
    )
  }



  //lay ten don vi tạo
  getUnitName() {
    return this.donVis.find((item) => item.maDvi == this.maDonViTao)?.tenDvi;
  }

  getStatusName() {
    const utils = new Utils();
    return utils.getStatusName(this.trangThaiBanGhi);
  }

  getStatusGiao(trangThai: string) {
    return (!this.statusBtnGiao && (trangThai == '0'));
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
  addSame(id: any, khoanMuc: any) {
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
    let data: ItemDvi[] = [];
    let data1: ItemDvi[] = [];
    this.lstDvi.forEach(item => {
      let mm: ItemDvi = {
        id: uuid.v4() + 'FE',
        maDviNhan: item.maDvi,
        soTranChi: 0,
        trangThai: "0",
      }
      let mm1: ItemDvi = {
        id: mm.id,
        maDviNhan: item.Dvi,
        soTranChi: 0,
        trangThai: "0",
      }
      data.push(mm);
      data1.push(mm1);
    })
    let item: ItemData = {
      id: uuid.v4() + 'FE',
      stt: head + "." + (tail + 1).toString(),
      maNdung: khoanMuc.id,
      level: khoanMuc.level,
      tongSo: 0,
      lstCtietDvis: data,
      checked: false,
    };
    let item1: ItemData = {
      id: item.id,
      stt: item.stt,
      maNdung: khoanMuc.id,
      level: khoanMuc.level,
      tongSo: 0,
      lstCtietDvis: data1,
      checked: false,
    };
    this.lstCtietBcao.splice(ind + 1, 0, item);
    this.editCache[item.id] = {
      edit: true,
      data: { ...item1 }
    };
  }

  // gan editCache.data == lstCtietBcao
  updateEditCache(): void {
    this.lstCtietBcao.forEach(item => {
      let data: ItemDvi[] = [];
      item.lstCtietDvis.forEach(e => {
        data.push({
          id: e.id,
          maDviNhan: e.maDviNhan,
          soTranChi: e.soTranChi,
          trangThai: e.trangThai,
        });
      })
      this.editCache[item.id] = {
        edit: false,
        data: {
          id: item.id,
          stt: item.stt,
          level: item.level,
          maNdung: item.maNdung,
          tongSo: item.tongSo,
          lstCtietDvis: data,
          checked: false,
        }
      }
    })
  }
  //thêm cấp thấp hơn
  addLow(id: any, khoanMuc: any) {
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

    let obj: ItemDvi[] = [];
    let obj1: ItemDvi[] = [];
    this.lstDvi.forEach(item => {
      let mm: ItemDvi = {
        id: uuid.v4() + 'FE',
        maDviNhan: item.maDvi,
        soTranChi: 0,
        trangThai: "0",
      }
      let mm1: ItemDvi = {
        id: mm.id,
        maDviNhan: item.Dvi,
        soTranChi: 0,
        trangThai: "0",
      }
      obj.push(mm);
      obj1.push(mm1);
    })
    let item: ItemData = {
      id: uuid.v4() + 'FE',
      stt: stt,
      maNdung: khoanMuc.id,
      level: khoanMuc.level,
      tongSo: 0,
      lstCtietDvis: obj,
      checked: false,
    };
    let item1: ItemData = {
      id: item.id,
      stt: item.stt,
      maNdung: khoanMuc.id,
      level: khoanMuc.level,
      tongSo: 0,
      lstCtietDvis: obj1,
      checked: false,
    };
    this.lstCtietBcao.splice(index + 1, 0, item);
    this.editCache[item.id] = {
      edit: true,
      data: { ...item1 }
    };
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
    let data: ItemDvi[] = [];
    this.lstCtietBcao[index].lstCtietDvis.forEach(item => {
      data.push({
        id: item.id,
        maDviNhan: item.maDviNhan,
        soTranChi: item.soTranChi,
        trangThai: item.trangThai,
      })
    })
    this.editCache[id] = {
      data: {
        ...this.lstCtietBcao[index],
        lstCtietDvis: data,
      },
      edit: false
    };
  }

  // luu thay doi
  saveEdit(id: string): void {
    this.editCache[id].data.checked = this.lstCtietBcao.find(item => item.id === id).checked; // set checked editCache = checked lstCtietBcao
    const index = this.lstCtietBcao.findIndex(item => item.id === id); // lay vi tri hang minh sua
    let data: ItemDvi[] = [];
    this.editCache[id].data.lstCtietDvis.forEach(item => {
      data.push({
        id: item.id,
        maDviNhan: item.maDviNhan,
        soTranChi: item.soTranChi,
        trangThai: item.trangThai,
      })
    })
    this.lstCtietBcao[index] = {
      ...this.editCache[id].data,
      lstCtietDvis: data,
    }
    this.total(id);
    this.editCache[id].edit = false; // CHUYEN VE DANG TEXT
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
  addFirst(khoanMuc: any) {
    // them moi phan tu
    let data: ItemDvi[] = [];
    let data1: ItemDvi[] = [];
    this.lstDvi.forEach(item => {
      let mm: ItemDvi = {
        id: uuid.v4() + 'FE',
        maDviNhan: item.maDvi,
        soTranChi: 0,
        trangThai: "0",
      }
      let mm1: ItemDvi = {
        id: mm.id,
        maDviNhan: item.Dvi,
        soTranChi: 0,
        trangThai: "0",
      }
      data.push(mm);
      data1.push(mm1);
    })
    let item: ItemData = {
      id: uuid.v4() + 'FE',
      stt: '0.1',
      maNdung: khoanMuc.id,
      level: khoanMuc.level,
      tongSo: 0,
      lstCtietDvis: data,
      checked: false,
    };
    let item1: ItemData = {
      id: item.id,
      stt: item.stt,
      maNdung: khoanMuc.id,
      level: khoanMuc.level,
      tongSo: 0,
      lstCtietDvis: data1,
      checked: false,
    };
    this.lstCtietBcao.push(item);
    this.editCache[item.id] = {
      edit: true,
      data: { ...item1 }
    };
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
    var maNhom: any = this.lstCtietBcao.find(e => e.id == id)?.maNdung;
    let obj = {
      maKhoanMuc: maNhom,
      lstKhoanMuc: this.noiDungs,
    }

    const modalIn = this.modal.create({
      nzTitle: 'Danh sách nhóm',
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
          let data: any = this.noiDungs.find(e => e.id == res.maKhoanMuc);
          if (this.lstCtietBcao.length == 0) {
            this.addFirst(data);
          } else {
            this.addSame(id, data);
          }
        }
        id = this.lstCtietBcao.find(e => e.maNdung == res.maKhoanMuc)?.id;
        res.lstKhoanMuc.forEach(item => {
          this.addLow(id, item);
        })
        this.updateEditCache();
      }
    });
  }

  deleteCol(maDvi: string) {
    this.lstCtietBcao.forEach(data => {
      data.lstCtietDvis = data.lstCtietDvis.filter(e => e.maDviNhan != maDvi);
    })
    this.lstDviChon.push(this.lstDvi.find(e => e.maDvi == maDvi));
    this.lstDvi = this.lstDvi.filter(e => e.maDvi != maDvi);
    this.lstCtietBcao.forEach(item => {
      this.total(item.id);
    })
  }

  addCol(maDvi: string) {
    this.lstDvi.push(this.lstDviChon.find(e => e.maDvi == maDvi));
    this.lstDviChon = this.lstDviChon.filter(e => e.maDvi != maDvi);
    this.lstCtietBcao.forEach(data => {
      data.lstCtietDvis.push({
        id: uuid.v4() + 'FE',
        maDviNhan: maDvi,
        soTranChi: 0,
        trangThai: "0",
      })
    })
  }

  addAllCol() {
    const modalIn = this.modal.create({
      nzTitle: 'Danh sách đơn vị',
      nzContent: DialogLuaChonThemDonViComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '65%',
      nzFooter: null,
      nzComponentParams: {
        danhSachDonVi: this.lstDviChon
      },
    });
    modalIn.afterClose.subscribe((res) => {
      if (res) {
        res.forEach(item => {
          if (item.status) {
            this.addCol(item.maDvi);
          }
        })
        this.lstCtietBcao.forEach(item => {
          this.total(item.id);
        })
        this.updateEditCache();
      }
    });
  }

  total(id: any) {
    var index: number = this.lstCtietBcao.findIndex(e => e.id == id);
    this.lstCtietBcao[index].tongSo = 0;
    this.lstCtietBcao[index].lstCtietDvis.forEach(item => {
      this.lstCtietBcao[index].tongSo += item.soTranChi;
    })
  }

  close() {
    this.location.back();
  }



}
