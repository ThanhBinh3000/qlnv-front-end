import { DatePipe, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import * as fileSaver from 'file-saver';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import * as uuid from "uuid";
import { DanhMucHDVService } from '../../../../../services/danhMucHDV.service';
import { QLNV_KHVONPHI_CHI_TX_GD3N, Utils } from "../../../../../Utility/utils";
import { MESSAGE } from '../../../../../constants/message';

export class ItemData {
  namHhanhN!: number;
  tranChiDuocTbN1!: number;
  ncauChiCuaDviN1!: number;
  clechTranChiVsNcauN1: number;
  tranChiDuocTbN2!: number;
  ncauChiCuaDviN2!: number;
  clechTranChiVsNcauN2: number;
  tranChiDuocTbN3!: number;
  ncauChiCuaDviN3!: number;
  clechTranChiVsNcauN3: number;
  maNoiDung!: string;
  maNhomChi!: string;
  maLoaiChi!: string;
  id!: any;
  maBcao!: String;
  stt!: String;
  checked!: boolean;
}

@Component({
  selector: 'app-chi-thuong-xuyen-3-nam',
  templateUrl: './chi-thuong-xuyen-3-nam.component.html',
  styleUrls: ['./chi-thuong-xuyen-3-nam.component.scss'],
})

export class ChiThuongXuyen3NamComponent implements OnInit {
  userInfo: any;
  errorMessage!: String;                      //
  noiDungs: any = [];                         // danh muc noi dung
  nhomChis: any = [];                          // danh muc nhom chi
  loaiChis: any = [];                          // danh muc loai chi
  donVis: any = [];                            // danh muc don vi
  donViTiens: any = [];                        // danh muc don vi tien

  lstCTietBCao: ItemData[] = [];              // list chi tiet bao cao
  id!: any;                                   // id truyen tu router
  lstFile: any = [];                          // list File de day vao api
  status: boolean = false;                    // trang thai an/ hien cua trang thai
  namBcao = new Date().getFullYear();         // nam bao cao
  userName: any;                              // ten nguoi dang nhap
  ngayNhap!: any;                             // ngay nhap
  nguoiNhap!: string;                         // nguoi nhap
  maDonViTao!: any;                           // ma don vi tao
  maBaoCao!: string;                          // ma bao cao
  namBaoCaoHienHanh!: any;                    // nam bao cao hien hanh
  trangThaiBanGhi: string = "1";              // trang thai cua ban ghi
  maLoaiBaoCao: string = QLNV_KHVONPHI_CHI_TX_GD3N;                // nam bao cao
  maDviTien: string = "01";                   // ma don vi tien
  newDate = new Date();                       //
  fileToUpload!: File;                        // file tai o input
  listFile: File[] = [];                      // list file chua ten va id de hien tai o input
  box1 = true;                                // bien de an hien box1
  fileUrl: any;                               // url
  listIdDelete: string = "";                  // list id delete
  currentday: Date = new Date();

  statusBtnDel: boolean;                       // trang thai an/hien nut xoa
  statusBtnSave: boolean;                      // trang thai an/hien nut luu
  statusBtnApprove: boolean;                   // trang thai an/hien nut trinh duyet
  statusBtnTBP: boolean;                       // trang thai an/hien nut truong bo phan
  statusBtnLD: boolean;                        // trang thai an/hien nut lanh dao
  statusBtnGuiDVCT: boolean;                   // trang thai nut gui don vi cap tren
  statusBtnDVCT: boolean;                      // trang thai nut don vi cap tren

  listIdFiles: string;                        // id file luc call chi tiet


  allChecked = false;                         // check all checkbox
  indeterminate = true;                       // properties allCheckBox
  editCache: { [key: string]: { edit: boolean; data: ItemData } } = {};     // phuc vu nut chinh

  fileList: NzUploadFile[] = [];
  soVban: any;
  capDv: any;
  checkDv: boolean;

  beforeUpload = (file: NzUploadFile): boolean => {
    this.fileList = this.fileList.concat(file);
    return false;
  };

  // upload file
  addFile() {
    const id = this.fileToUpload?.lastModified.toString();
    this.lstFile.push({ id: id, fileName: this.fileToUpload?.name });
    this.listFile.push(this.fileToUpload);
  }

  handleUpload(): void {
    this.fileList.forEach((file: any) => {
      const id = file?.lastModified.toString();
      this.lstFile.push({ id: id, fileName: file?.name });
      this.listFile.push(file);
    });
    this.fileList = [];
  }


  constructor(private router: Router,
    private routerActive: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private quanLyVonPhiService: QuanLyVonPhiService,
    private datePipe: DatePipe,
    private sanitizer: DomSanitizer,
    private danhMucService: DanhMucHDVService,
    private userService: UserService,
    private notification: NzNotificationService,
    private location: Location,
  ) {
    this.ngayNhap = this.datePipe.transform(this.newDate, Utils.FORMAT_DATE_STR,)
  }


  async ngOnInit() {
    this.id = this.routerActive.snapshot.paramMap.get('id');
    this.maDonViTao = this.routerActive.snapshot.paramMap.get('maDvi');
    this.maLoaiBaoCao = this.routerActive.snapshot.paramMap.get('maLoaiBacao');
    this.namBaoCaoHienHanh = this.routerActive.snapshot.paramMap.get('nam');

    let userName = this.userService.getUserName();
    await this.getUserInfo(userName); //get user info

    if (this.id) {
      await this.getDetailReport();
    } else if (
      this.maDonViTao != null &&
      this.maLoaiBaoCao != null &&
      this.namBaoCaoHienHanh != null
    ) {
      await this.calltonghop();
      this.nguoiNhap = this.userInfo?.username;
      this.ngayNhap = this.datePipe.transform(this.currentday, Utils.FORMAT_DATE_STR);
      this.maDonViTao = this.userInfo?.dvql;
      this.quanLyVonPhiService.sinhMaBaoCao().subscribe(
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
      this.maBaoCao = '';
      this.namBaoCaoHienHanh = new Date().getFullYear();
    } else {
      this.trangThaiBanGhi = "1";
      this.nguoiNhap = this.userInfo?.username;
      this.maDonViTao = this.userInfo?.dvql;
      this.spinner.show();
      this.quanLyVonPhiService.sinhMaBaoCao().subscribe(
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
      this.maBaoCao = '';
      this.namBaoCaoHienHanh = new Date().getFullYear();
    }

    this.getStatusButton();
    //get danh muc noi dung
    this.danhMucService.dMNoiDung().toPromise().then(
      (data) => {
        if (data.statusCode == 0) {
          this.noiDungs = data.data?.content;
        } else {
          this.notification.error(MESSAGE.ERROR, data?.msg);
        }
      },
      (err) => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
      }
    );

    //get danh muc nhom chi
    this.danhMucService.dMNhomChi().toPromise().then(
      (data) => {
        if (data.statusCode == 0) {
          this.nhomChis = data.data?.content;
        } else {
          this.notification.error(MESSAGE.ERROR, data?.msg);
        }
      },
      (err) => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
      }
    );

    //get danh muc loai chi
    this.danhMucService.dMLoaiChi().toPromise().then(
      (data) => {
        if (data.statusCode == 0) {
          this.loaiChis = data.data?.content;
        } else {
          this.notification.error(MESSAGE.ERROR, data?.msg);
        }
      },
      (err) => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
      }
    );

    //get danh muc loai chi
    this.danhMucService.dMLoaiChi().toPromise().then(
      (data) => {
        if (data.statusCode == 0) {
          this.loaiChis = data.data?.content;
        } else {
          this.notification.error(MESSAGE.ERROR, data?.msg);
        }
      },
      (err) => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
      }
    );

    //lay danh sach danh muc don vi
    this.danhMucService.dMDonVi().toPromise().then(
      (data) => {
        if (data.statusCode == 0) {
          this.donVis = data.data;
          var Dvi = this.donVis.find(e => e.maDvi == this.maDonViTao);
          this.capDv = Dvi.capDvi;
          if (this.capDv == '2') {
            this.checkDv = false;
          } else {
            this.checkDv = true;
          }
        } else {
          this.notification.error(MESSAGE.ERROR, data?.msg);
        }
      },
      (err) => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
      }
    );

    //lay danh sach danh muc don vi tien
    this.danhMucService.dMDonViTien().toPromise().then(
      (data) => {
        if (data.statusCode == 0) {
          this.donViTiens = data.data?.content;
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

  getStatusButton() {
    const utils = new Utils();
    this.statusBtnDel = utils.getRoleDel(this.trangThaiBanGhi, 2, this.userInfo?.roles[0]?.id);
    this.statusBtnSave = utils.getRoleSave(this.trangThaiBanGhi, 2, this.userInfo?.roles[0]?.id);
    this.statusBtnApprove = utils.getRoleApprove(this.trangThaiBanGhi, 2, this.userInfo?.roles[0]?.id);
    this.statusBtnTBP = utils.getRoleTBP(this.trangThaiBanGhi, 2, this.userInfo?.roles[0]?.id);
    this.statusBtnLD = utils.getRoleLD(this.trangThaiBanGhi, 2, this.userInfo?.roles[0]?.id);
    this.statusBtnGuiDVCT = utils.getRoleGuiDVCT(this.trangThaiBanGhi, 2, this.userInfo?.roles[0]?.id);
    this.statusBtnDVCT = utils.getRoleDVCT(this.trangThaiBanGhi, 2, this.userInfo?.roles[0]?.id);
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

  //
  selectFile(files: FileList): void {
    this.fileToUpload = files.item(0);
  }

  // xoa
  xoa() {
    this.lstCTietBCao = [];
    this.lstFile = [];
    this.listFile = []
  }

  // luu
  async luu() {
    let listFile: any = [];
    for (const iterator of this.listFile) {
      listFile.push(await this.uploadFile(iterator));
    }

    // replace nhung ban ghi dc them moi id thanh null
    this.lstCTietBCao.filter(item => {
      if (typeof item.id != "number") {
        item.id = null;
      }
    })

    // gui du lieu trinh duyet len server
    let request = {
      id: this.id,
      fileDinhKems: listFile,
      listIdFiles: this.listIdFiles,                      // id file luc get chi tiet tra ra( de backend phuc vu xoa file)
      lstCTietBCao: this.lstCTietBCao,
      maBcao: this.maBaoCao,
      maDvi: this.maDonViTao,
      maDviTien: this.maDviTien = "01",
      maLoaiBcao: this.maLoaiBaoCao = QLNV_KHVONPHI_CHI_TX_GD3N,
      namHienHanh: this.namBaoCaoHienHanh,
      namBcao: this.namBaoCaoHienHanh + 1,
      soVban: this.soVban,
    };

    //call service them moi
    this.spinner.show();
    if (this.id == null) {
      this.quanLyVonPhiService.trinhDuyetService(request).toPromise().then(
        async data => {
          if (data.statusCode == 0) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.SUCCESS);
            this.id = data.data.id;
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
      this.quanLyVonPhiService.updatelist(request).toPromise().then(
        async data => {
          if (data.statusCode == 0) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.SUCCESS);
            await this.getDetailReport();
            this.getStatusButton();
          } else {
            this.notification.error(MESSAGE.ERROR, data?.msg);
          }
        }, err => {
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        })
    }
    this.lstCTietBCao.filter(item => {
      if (!item.id) {
        item.id = uuid.v4();
      }
    });
    this.updateEditCache();
    this.spinner.hide();
  }

  // chuc nang check role
  async onSubmit(mcn: String) {
    const requestGroupButtons = {
      id: this.id,
      maChucNang: mcn,
      type: "",
    };
    this.spinner.show();
    this.quanLyVonPhiService.approve(requestGroupButtons).toPromise().then(async (data) => {
      if (data.statusCode == 0) {
        await this.getDetailReport();
        this.getStatusButton();
        this.notification.success(MESSAGE.SUCCESS, MESSAGE.SUCCESS);
      } else {
        this.notification.error(MESSAGE.ERROR, data?.msg);
      }
    }, err => {
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    });
    this.spinner.hide();
  }

  //thay doi trang thai
  changeStatus(status: boolean) {
    this.status = status;
  }

  // call chi tiet bao cao
  async getDetailReport() {
    this.spinner.show();
    await this.quanLyVonPhiService.bCLapThamDinhDuToanChiTiet(this.id).toPromise().then(
      (data) => {
        if (data.statusCode == 0) {
          this.lstCTietBCao = data.data.lstCTietBCao;
          this.updateEditCache();
          this.lstFile = data.data.lstFile;

          // set thong tin chung bao cao
          this.ngayNhap = data.data.ngayTao;
          this.nguoiNhap = data.data.nguoiTao;
          this.maDonViTao = data.data.maDvi;
          this.maBaoCao = data.data.maBcao;
          this.namBaoCaoHienHanh = data.data.namHienHanh;
          this.trangThaiBanGhi = data.data.trangThai;
          this.soVban = data.data.soVban;

          // set list id file ban dau
          this.lstFile.filter(item => {
            this.listIdFiles += item.id + ",";
          })

          if (this.trangThaiBanGhi == '1' || this.trangThaiBanGhi == '3' || this.trangThaiBanGhi == '5' || this.trangThaiBanGhi == '8') {
            this.status = false;
          } else {
            this.status = true;
          }
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

  //upload file
  async uploadFile(file: File) {
    // day file len server
    const upfile: FormData = new FormData();
    upfile.append('file', file);
    upfile.append('folder', this.maBaoCao + '/' + this.maDonViTao + '/');
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

  // them dong moi
  addLine(id: number): void {
    let item: ItemData = {
      namHhanhN!: 0,
      tranChiDuocTbN1!: 0,
      ncauChiCuaDviN1!: 0,
      clechTranChiVsNcauN1: 0,
      tranChiDuocTbN2!: 0,
      ncauChiCuaDviN2!: 0,
      clechTranChiVsNcauN2: 0,
      tranChiDuocTbN3!: 0,
      ncauChiCuaDviN3!: 0,
      clechTranChiVsNcauN3: 0,
      maNoiDung!: "",
      maNhomChi!: "",
      maLoaiChi!: "",
      maBcao: "",
      stt: "",
      id: uuid.v4(),
      checked: false,
    }

    this.lstCTietBCao.splice(id, 0, item);
    this.editCache[item.id] = {
      edit: true,
      data: { ...item }
    };
  }

  // xoa dong
  deleteById(id: any): void {
    this.lstCTietBCao = this.lstCTietBCao.filter(item => item.id != id)
    if (typeof id == "number") {
      this.listIdDelete += id + ",";
    }
  }

  // xóa với checkbox
  deleteSelected() {
    // add list delete id
    this.lstCTietBCao.filter(item => {
      if (item.checked == true && typeof item.id == "number") {
        this.listIdDelete += item.id + ","
      }
    })
    // delete object have checked = true
    this.lstCTietBCao = this.lstCTietBCao.filter(item => item.checked != true)
    this.allChecked = false;
  }

  // xoa file trong bang file
  deleteFile(id: string): void {
    this.lstFile = this.lstFile.filter((a: any) => a.id !== id);
    this.listFile = this.listFile.filter((a: any) => a?.lastModified.toString() !== id);
  }

  //download file về máy tính
  downloadFile(id: string) {
    let file!: File;
    this.listFile.forEach(element => {
      if (element?.lastModified.toString() == id) {
        file = element;
      }
    });
    const blob = new Blob([file], { type: "application/octet-stream" });
    this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      window.URL.createObjectURL(blob)
    );
    fileSaver.saveAs(blob, file.name);
  }

  // click o checkbox all
  updateAllChecked(): void {
    this.indeterminate = false;                               // thuoc tinh su kien o checkbox all
    if (this.allChecked) {                                    // checkboxall == true thi set lai lstCTietBCao.checked = true
      this.lstCTietBCao = this.lstCTietBCao.map(item => ({
        ...item,
        checked: true
      }));
    } else {
      this.lstCTietBCao = this.lstCTietBCao.map(item => ({    // checkboxall == false thi set lai lstCTietBCao.checked = false
        ...item,
        checked: false
      }));
    }
  }

  // click o checkbox single
  updateSingleChecked(): void {
    if (this.lstCTietBCao.every(item => !item.checked)) {           // tat ca o checkbox deu = false thi set o checkbox all = false
      this.allChecked = false;
      this.indeterminate = false;
    } else if (this.lstCTietBCao.every(item => item.checked)) {     // tat ca o checkbox deu = true thi set o checkbox all = true
      this.allChecked = true;
      this.indeterminate = false;
    } else {                                                        // o checkbox vua = false, vua = true thi set o checkbox all = indeterminate
      this.indeterminate = true;
    }
  }

  redirectChiTieuKeHoachNam() {
    // this.router.navigate(['/qlkh-von-phi/quan-ly-lap-tham-dinh-du-toan-nsnn/tim-kiem']);
    this.location.back()
  }

  // lay ten trang thai
  getStatusName() {
    const utils = new Utils();
    return utils.getStatusName(this.trangThaiBanGhi);
  }

  // lay ten don vi tao
  getUnitName() {
    return this.donVis.find(item => item.maDvi == this.maDonViTao)?.tenDvi;
  }

  // start edit
  startEdit(id: string): void {
    this.editCache[id].edit = true;
  }

  // huy thay doi
  cancelEdit(id: string): void {
    const index = this.lstCTietBCao.findIndex(item => item.id === id);  // lay vi tri hang minh sua
    this.editCache[id] = {
      data: { ...this.lstCTietBCao[index] },
      edit: false
    };
  }

  // luu thay doi
  saveEdit(id: string): void {
    this.editCache[id].data.checked = this.lstCTietBCao.find(item => item.id === id).checked; // set checked editCache = checked lstCTietBCao
    const index = this.lstCTietBCao.findIndex(item => item.id === id);   // lay vi tri hang minh sua
    Object.assign(this.lstCTietBCao[index], this.editCache[id].data); // set lai data cua lstCTietBCao[index] = this.editCache[id].data
    this.editCache[id].edit = false;  // CHUYEN VE DANG TEXT
  }

  // gan editCache.data == lstCTietBCao
  updateEditCache(): void {
    this.lstCTietBCao.forEach(item => {
      this.editCache[item.id] = {
        edit: false,
        data: { ...item }
      };
    });
  }

  //gia tri cac o input thay doi thi tinh toan lai
  changeModel(id: string): void {
    this.editCache[id].data.clechTranChiVsNcauN1 = Number(this.editCache[id].data.ncauChiCuaDviN1) - Number(this.editCache[id].data.tranChiDuocTbN1);
    this.editCache[id].data.clechTranChiVsNcauN2 = Number(this.editCache[id].data.ncauChiCuaDviN2) - Number(this.editCache[id].data.tranChiDuocTbN2);
    this.editCache[id].data.clechTranChiVsNcauN3 = Number(this.editCache[id].data.ncauChiCuaDviN3) - Number(this.editCache[id].data.tranChiDuocTbN3);
  }

  async calltonghop() {
    this.spinner.show();
    let objtonghop = {
      maDvi: this.maDonViTao,
      maLoaiBcao: this.maLoaiBaoCao,
      namHienTai: this.namBaoCaoHienHanh,
    }
    await this.quanLyVonPhiService.tongHop(objtonghop).toPromise().then(res => {
      if (res.statusCode == 0) {
        this.lstCTietBCao = res.data;
        this.lstCTietBCao.forEach(e => {
          e.id = uuid.v4();
        })
      } else {
        this.notification.error(MESSAGE.ERROR, res?.msg);
      }
    }, err => {
      this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
    });
    this.updateEditCache()
    this.spinner.hide();
  }
}
