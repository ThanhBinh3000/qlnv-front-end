import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as uuid from "uuid";
import { DanhMucHDVService } from '../../../../../services/danhMucHDV.service';
import { DatePipe } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { DomSanitizer } from '@angular/platform-browser';
import * as fileSaver from 'file-saver';
import { Utils } from "../../../../../Utility/utils";
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { C } from '@angular/cdk/keycodes';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MESSAGE } from '../../../../../constants/message';


export class ItemData {
  maDvi!: string;
  lxuatThoc!: number;
  lnhapThoc!: number;
  dmucPxuatThoc!: number;
  dmucPnhapThoc!: number;
  thanhTienThoc!: number;
  lxuatGao!: number;
  lnhapGao!: number;
  dmucPxuatGao!: number;
  dmucPnhapGao!: number;
  thanhTienGao!: number;
  id!: any;
  stt!: String;
  checked!: boolean;
}

export class superMiniData {
  id!: any;
  maDvi!: string;
  sl!: number;
}

export class miniData {
  id!: any;
  stt!: string;
  checked!: boolean;
  maVtu!: string;
  SL: superMiniData[] = [];
}

@Component({
  selector: 'app-du-toan-xuat-nhap-hang-dtqg-hang-nam',
  templateUrl: './du-toan-xuat-nhap-hang-dtqg-hang-nam.component.html',
  styleUrls: ['./du-toan-xuat-nhap-hang-dtqg-hang-nam.component.scss'],
})

export class DuToanXuatNhapHangDtqgHangNamComponent implements OnInit {
  userInfo: any;
  maDvi: any;
  maLoaiBacao: string = '25';
  nam: any;
  errorMessage!: String;
  vatTus: any = [];
  donVis: any = [];                            // danh muc don vi
  bangDvi: superMiniData[] = [];
  tong: ItemData = {
    maDvi: "",
    lxuatThoc: 0,
    lnhapThoc: 0,
    dmucPxuatThoc: 0,
    dmucPnhapThoc: 0,
    thanhTienThoc: 0,
    lxuatGao: 0,
    lnhapGao: 0,
    dmucPxuatGao: 0,
    dmucPnhapGao: 0,
    thanhTienGao: 0,
    stt: "",
    id: uuid.v4(),
    checked: false,
  };
  chiTietBcaos: any;                          // thong tin chi tiet bao cao
  lstCTietBCao: ItemData[] = [];              // list chi tiet bao cao
  lstCTiet: miniData[] = [];
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
  maLoaiBaoCao: string = "26";                // nam bao cao
  maDviTien: string = "01";                   // ma don vi tien
  newDate = new Date();                       //
  fileToUpload!: File;                        // file tai o input
  listFile: File[] = [];                      // list file chua ten va id de hien tai o input
  box1 = true;                                // bien de an hien box1
  fileUrl: any;                               // url
  listIdDelete: string = "";                  // list id delete

  statusBtnDel: boolean;                       // trang thai an/hien nut xoa
  statusBtnSave: boolean;                      // trang thai an/hien nut luu
  statusBtnApprove: boolean;                   // trang thai an/hien nut trinh duyet
  statusBtnTBP: boolean;                       // trang thai an/hien nut truong bo phan
  statusBtnLD: boolean;                        // trang thai an/hien nut lanh dao
  statusBtnGuiDVCT: boolean;                   // trang thai nut gui don vi cap tren
  statusBtnDVCT: boolean;                      // trang thai nut don vi cap tren

  listIdFiles: string;                        // id file luc call chi tiet


  allChecked1 = false;                         // check all checkbox
  allChecked2 = false;
  indeterminate = true;                       // properties allCheckBox
  editCache1: { [key: string]: { edit: boolean; data: ItemData } } = {};     // phuc vu nut chinh
  editCache2: { [key: string]: { edit: boolean; data: miniData } } = {};

  fileList: NzUploadFile[] = [];

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
    private userSerivce: UserService,
    private notification: NzNotificationService,
    private danhMucService: DanhMucHDVService,
  ) {
    this.ngayNhap = this.datePipe.transform(this.newDate, 'dd-MM-yyyy',)
  }


  async ngOnInit() {
    this.id = this.routerActive.snapshot.paramMap.get('id');
    this.maDvi = this.routerActive.snapshot.paramMap.get('maDvi');
    this.maLoaiBacao = this.routerActive.snapshot.paramMap.get('maLoaiBacao');
    this.nam = this.routerActive.snapshot.paramMap.get('nam');
    let userName = this.userSerivce.getUserName();
    let userInfo: any = await this.getUserInfo(userName); //get user info
    if (this.id) {
      this.getDetailReport();
    } else if (
      this.maDvi != null &&
      this.maLoaiBacao != null &&
      this.nam != null
    ) {
      this.calltonghop();
      this.nguoiNhap = userInfo?.username;
      this.maDonViTao = userInfo?.dvql;
    } else {
      this.trangThaiBanGhi = "1";
      this.nguoiNhap = userInfo?.username;
      this.maDonViTao = userInfo?.dvql;
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

    const utils = new Utils();
    this.statusBtnDel = utils.getRoleDel(this.trangThaiBanGhi, 2, userInfo?.roles[0]?.id);
    this.statusBtnSave = utils.getRoleSave(this.trangThaiBanGhi, 2, userInfo?.roles[0]?.id);
    this.statusBtnApprove = utils.getRoleApprove(this.trangThaiBanGhi, 2, userInfo?.roles[0]?.id);
    this.statusBtnTBP = utils.getRoleTBP(this.trangThaiBanGhi, 2, userInfo?.roles[0]?.id);
    this.statusBtnLD = utils.getRoleLD(this.trangThaiBanGhi, 2, userInfo?.roles[0]?.id);
    this.statusBtnGuiDVCT = utils.getRoleGuiDVCT(this.trangThaiBanGhi, 2, userInfo?.roles[0]?.id);
    this.statusBtnDVCT = utils.getRoleDVCT(this.trangThaiBanGhi, 2, userInfo?.roles[0]?.id);

    //get danh muc noi dung
    this.danhMucService.dMVatTu().toPromise().then(
      (data) => {
        if (data.statusCode == 0) {
          this.vatTus = data.data?.content;
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

  //get user info
  async getUserInfo(username: string) {
    let userInfo = await this.userSerivce.getUserInfo(username).toPromise().then(
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
    return userInfo;
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
    let listCTBC: any = [];
    for (var i = 0; i < this.lstCTietBCao.length; i++) {
      let data: any = this.lstCTietBCao[i];
      let listCT: any = [];
      this.lstCTiet.forEach(item => {
        const index = item.SL.findIndex(e => e.maDvi == data.maDvi);
        let mm: any = {
          stt: item.stt,
          maVtuTbi: item.maVtu,
          sl: item.SL[index].sl,
        }
        listCT.push(mm);
      })
      let CTBC: any = {
        maDvi: data.maDvi,
        lxuatThoc: data.lxuatThoc,
        lnhapThoc: data.lnhapThoc,
        dmucPxuatThoc: data.dmucPxuatThoc,
        dmucPnhapThoc: data.dmucPnhapThoc,
        thanhTienThoc: data.thanhTienThoc,
        lxuatGao: data.lxuatGao,
        lnhapGao: data.lnhapGao,
        dmucPxuatGao: data.dmucPxuatGao,
        dmucPnhapGao: data.dmucPnhapGao,
        thanhTienGao: data.thanhTienGao,
        id: data.id,
        stt: data.stt,
        listCtiet: listCT,
      }
      listCTBC.push(CTBC);
    }
    // replace nhung ban ghi dc them moi id thanh null
    listCTBC.filter(item => {
      if (typeof item.id != "number") {
        item.id = null;
      }
    })
    // gui du lieu trinh duyet len server
    let request = {
      id: this.id,
      idFileDinhKem: listFile,
      lstCTietBCao: listCTBC,
      maBcao: this.maBaoCao,
      maDvi: this.maDonViTao,
      maDviTien: this.maDviTien,
      maLoaiBcao: this.maLoaiBaoCao,
      namBcao: this.namBaoCaoHienHanh,
      namHienHanh: this.namBaoCaoHienHanh,
    };
    this.spinner.show();
    if (this.id == null) {
      this.quanLyVonPhiService.trinhDuyetService(request).subscribe(
        (data) => {
          if (data.statusCode == 0) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.SUCCESS);
          } else {
            this.notification.error(MESSAGE.ERROR, data?.msg);
          }
        },
        (err) => {
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        })
    } else {
      this.quanLyVonPhiService.updatelist(request).subscribe(
        res => {
          if (res.statusCode == 0) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.SUCCESS);
          } else {
            this.notification.error(MESSAGE.ERROR, res?.msg);
          }
        },
        err => {
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      )
    }
    this.lstCTietBCao.filter(item => {
      if (!item.id) {
        item.id = uuid.v4();
      }
    });
    this.spinner.hide();
  }

  // chuc nang check role
  onSubmit(mcn: String) {
    const requestGroupButtons = {
      id: this.id,
      maChucNang: mcn,
      type: "",
    };
    this.spinner.show();
    this.quanLyVonPhiService.approve(requestGroupButtons).subscribe(
      (data) => {
        if (data.statusCode == 0) {
          this.getDetailReport();
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.SUCCESS);
        } else {
          this.notification.error(MESSAGE.ERROR, data?.msg);
        }
      },
      err => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
    );
    this.spinner.hide();
  }

  //thay doi trang thai
  changeStatus(status: boolean) {
    this.status = status;
  }

  // call chi tiet bao cao
  getDetailReport() {
    this.spinner.hide();
    this.quanLyVonPhiService.bCChiTiet(this.id).subscribe(
      (data) => {
        if (data.statusCode == 0) {
          this.chiTietBcaos = data.data.lstCTietBCao;
          this.lstFile = data.data.lstFile;

          // set thong tin chung bao cao
          this.ngayNhap = data.data.ngayTao;
          this.nguoiNhap = data.data.nguoiTao;
          this.maDonViTao = data.data.maDvi;
          this.maBaoCao = data.data.maBcao;
          this.namBaoCaoHienHanh = data.data.namBcao;
          this.trangThaiBanGhi = data.data.trangThai;
          if (
            this.trangThaiBanGhi == '1' ||
            this.trangThaiBanGhi == '3' ||
            this.trangThaiBanGhi == '5' ||
            this.trangThaiBanGhi == '8'
          ) {
            this.status = false;
          } else {
            this.status = true;
          }

          //tach thong tin trong bao cao
          for (var i = 0; i < this.chiTietBcaos[0].listCtiet.length; i++) {
            let vatTu: miniData = {
              id: uuid.v4(),
              stt: this.chiTietBcaos[0].listCtiet[i].stt,
              checked: false,
              maVtu: this.chiTietBcaos[0].listCtiet[i].maVtuTbi,
              SL: [],
            }
            this.lstCTiet.push(vatTu);
          }

          this.chiTietBcaos.forEach(item => {
            let nDung: ItemData = {
              maDvi: data.maDvi,
              lxuatThoc: data.lxuatThoc,
              lnhapThoc: data.lnhapThoc,
              dmucPxuatThoc: data.dmucPxuatThoc,
              dmucPnhapThoc: data.dmucPnhapThoc,
              thanhTienThoc: data.thanhTienThoc,
              lxuatGao: data.lxuatGao,
              lnhapGao: data.lnhapGao,
              dmucPxuatGao: data.dmucPxuatGao,
              dmucPnhapGao: data.dmucPnhapGao,
              thanhTienGao: data.thanhTienGao,
              id: uuid.v4(),
              stt: item.stt,
              checked: false,
            }
            this.lstCTietBCao.push(nDung);

            let mn: superMiniData = {
              id:nDung.id,
              maDvi: item.maCucDtnnKvuc,
              sl:0,
            }
            this.bangDvi.push(mn);

            for (var i = 0; i < item.listCtiet.length; i++) {
              let mini: superMiniData = {
                id: nDung.id,
                maDvi: item.maDvi,
                sl: item.listCtiet[i].sl,
              }
              this.lstCTiet[i].SL.push(mini);
            }
          })


          this.updateEditCache1();
          this.updateEditCache2();
          // set list id file ban dau
          this.lstFile.filter(item => {
            this.listIdFiles += item.id + ",";
          })
        } else {
          this.notification.error(MESSAGE.ERROR, data?.msg);
        }
      },
      (err) => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
      }
    );
    this.spinner.show();
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

  // lay ten trang thai
  getStatusName() {
    const utils = new Utils();
    return utils.getStatusName(this.trangThaiBanGhi);
  }

  // lay ten don vi tao
  getUnitName() {
    return this.donVis.find(item => item.id == this.maDonViTao)?.tenDvi;
  }

  redirectChiTieuKeHoachNam() {
    this.router.navigate(['/kehoach/chi-tieu-ke-hoach-nam-cap-tong-cuc']);
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////// CONG VIEC CUA BANG CHINH //////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////////////
  // them dong moi
  addLine1(id: number): void {
    let item: ItemData = {
      maDvi: "",
      lxuatThoc: 0,
      lnhapThoc: 0,
      dmucPxuatThoc: 0,
      dmucPnhapThoc: 0,
      thanhTienThoc: 0,
      lxuatGao: 0,
      lnhapGao: 0,
      dmucPxuatGao: 0,
      dmucPnhapGao: 0,
      thanhTienGao: 0,
      stt: "",
      id: uuid.v4(),
      checked: false,
    }

    this.lstCTietBCao.splice(id, 0, item);
    this.editCache1[item.id] = {
      edit: true,
      data: { ...item }
    };
  }

  // xoa dong
  deleteById1(id: any): void {
    const index = this.lstCTietBCao.findIndex(item => item.id == id);

    this.bangDvi = this.bangDvi.filter(item => item.id != id);

    this.lstCTiet.forEach(item => {
      item.SL = item.SL.filter(data => data.id != id);
    })

    this.truItemData(index);

    this.lstCTietBCao = this.lstCTietBCao.filter(item => item.id != id)

    if (typeof id == "number") {
      this.listIdDelete += id + ",";
    }
    //can cap nhat lai lstCTiet
  }

  // xóa với checkbox
  deleteSelected1() {
    // add list delete id
    for (var i = 0; i < this.lstCTietBCao.length; i++) {
      if (this.lstCTietBCao[i].checked) {
        this.truItemData(i);
      }
    }
    this.lstCTietBCao.forEach(item => {
      if (item.checked) {
        this.bangDvi = this.bangDvi.filter(data => data.id != item.id);
        this.lstCTiet.forEach(data => {
          data.SL = data.SL.filter(e => e.id != item.id);
        })
      }
      if (item.checked == true && typeof item.id == "number") {
        this.listIdDelete += item.id + ","
      }
    })
    // delete object have checked = true
    this.lstCTietBCao = this.lstCTietBCao.filter(item => item.checked != true)
    this.allChecked1 = false;
    // can cap nhat lai lstCTiet
  }



  // click o checkbox all
  updateAllChecked1(): void {
    this.indeterminate = false;                               // thuoc tinh su kien o checkbox all
    if (this.allChecked1) {                                    // checkboxall == true thi set lai lstCTietBCao.checked = true
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
  updateSingleChecked1(): void {
    if (this.lstCTietBCao.every(item => !item.checked)) {           // tat ca o checkbox deu = false thi set o checkbox all = false
      this.allChecked1 = false;
      this.indeterminate = false;
    } else if (this.lstCTietBCao.every(item => item.checked)) {     // tat ca o checkbox deu = true thi set o checkbox all = true
      this.allChecked1 = true;
      this.indeterminate = false;
    } else {                                                        // o checkbox vua = false, vua = true thi set o checkbox all = indeterminate
      this.indeterminate = true;
    }
  }

  // start edit
  startEdit1(id: string): void {
    this.editCache1[id].edit = true;
  }

  // huy thay doi
  cancelEdit1(id: string): void {
    const index = this.lstCTietBCao.findIndex(item => item.id === id);  // lay vi tri hang minh sua
    this.editCache1[id] = {
      data: { ...this.lstCTietBCao[index] },
      edit: false
    };
  }

  // luu thay doi
  saveEdit1(id: string): void {
    this.editCache1[id].data.checked = this.lstCTietBCao.find(item => item.id === id).checked;  // set checked editCache = checked lstCTietBCao
    const index = this.lstCTietBCao.findIndex(item => item.id === id);                          // lay vi tri hang minh sua
    if (this.lstCTietBCao[index].maDvi == "") {                                         // trong truong hop them moi don vi                    
      let mini: superMiniData = {
        id: id,
        maDvi: this.editCache1[id].data.maDvi,
        sl: 0,
      }                                                         
      this.bangDvi.splice(index, 0, mini);
      this.lstCTiet.forEach(item => {
        item.SL.splice(index, 0, mini);
      })
    }
    else {
      if (this.lstCTietBCao[index].maDvi != this.editCache1[id].data.maDvi) {
        const ind = this.bangDvi.findIndex(item => item.id == this.lstCTietBCao[index].id);
        this.bangDvi[ind].maDvi = this.editCache1[id].data.maDvi;
        this.lstCTiet.forEach(item => {
          item.SL[ind].maDvi = this.bangDvi[ind].maDvi;
          item.SL[ind].sl = 0;
        })
      }
    }
    this.truItemData(index);
    Object.assign(this.lstCTietBCao[index], this.editCache1[id].data); // set lai data cua lstCTietBCao[index] = this.editCache[id].data
    this.congItemData(index);
    this.editCache1[id].edit = false;  // CHUYEN VE DANG TEXT
  }

  // gan editCache.data == lstCTietBCao
  updateEditCache1(): void {
    this.lstCTietBCao.forEach(item => {
      this.editCache1[item.id] = {
        edit: false,
        data: { ...item }
      };
    });
  }

  congItemData(index: number) {
    let item: ItemData = this.lstCTietBCao[index];
    this.tong.lxuatThoc += item.lxuatThoc;
    this.tong.lnhapThoc += item.lnhapThoc;
    this.tong.dmucPxuatThoc += item.dmucPxuatThoc;
    this.tong.dmucPnhapThoc += item.dmucPnhapThoc;
    this.tong.thanhTienThoc += item.thanhTienThoc;
    this.tong.lxuatGao += item.lxuatGao;
    this.tong.lnhapGao += item.lnhapGao;
    this.tong.dmucPxuatGao += item.dmucPxuatGao;
    this.tong.dmucPnhapGao += item.dmucPnhapGao;
    this.tong.thanhTienGao += item.thanhTienGao;
  }

  truItemData(index: number) {
    let item: ItemData = this.lstCTietBCao[index];
    this.tong.lxuatThoc -= item.lxuatThoc;
    this.tong.lnhapThoc -= item.lnhapThoc;
    this.tong.dmucPxuatThoc -= item.dmucPxuatThoc;
    this.tong.dmucPnhapThoc -= item.dmucPnhapThoc;
    this.tong.thanhTienThoc -= item.thanhTienThoc;
    this.tong.lxuatGao -= item.lxuatGao;
    this.tong.lnhapGao -= item.lnhapGao;
    this.tong.dmucPxuatGao -= item.dmucPxuatGao;
    this.tong.dmucPnhapGao -= item.dmucPnhapGao;
    this.tong.thanhTienGao -= item.thanhTienGao;
  }

  //////////////////////////////////////////////////////////////////////////////////////
  ////////////////////// CONG VIEC CUA BANG PHU ////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////
  // them dong moi
  addLine2(id: number): void {
    let data: superMiniData[] = [];
    this.bangDvi.forEach(item => {
      let mm: superMiniData = {
        id: item.id,
        maDvi: item.maDvi,
        sl: 0,
      }
      data.push(mm);
    })
    let item: miniData = {
      maVtu: "",
      SL: data,
      stt: "",
      id: uuid.v4(),
      checked: false,
    }

    this.lstCTiet.splice(id, 0, item);
    this.editCache2[item.id] = {
      edit: true,
      data: { ...item }
    };
  }

  // xoa dong
  deleteById2(id: any): void {
    this.lstCTiet = this.lstCTiet.filter(item => item.id != id)
    //can cap nhat lai lstCTiet
  }

  // xóa với checkbox
  deleteSelected2() {
    // // add list delete id
    // this.lstCTiet.filter(item => {
    //   if (item.checked == true && typeof item.id == "number") {
    //     this.listIdDelete += item.id + ","
    //   }
    // })
    // delete object have checked = true
    this.lstCTiet = this.lstCTiet.filter(item => item.checked != true)
    this.allChecked2 = false;
    // can cap nhat lai lstCTiet
  }



  // click o checkbox all
  updateAllChecked2(): void {
    this.indeterminate = false;                               // thuoc tinh su kien o checkbox all
    if (this.allChecked2) {                                    // checkboxall == true thi set lai lstCTietBCao.checked = true
      this.lstCTiet = this.lstCTiet.map(item => ({
        ...item,
        checked: true
      }));
    } else {
      this.lstCTiet = this.lstCTiet.map(item => ({    // checkboxall == false thi set lai lstCTietBCao.checked = false
        ...item,
        checked: false
      }));
    }
  }

  // click o checkbox single
  updateSingleChecked2(): void {
    if (this.lstCTiet.every(item => !item.checked)) {           // tat ca o checkbox deu = false thi set o checkbox all = false
      this.allChecked2 = false;
      this.indeterminate = false;
    } else if (this.lstCTiet.every(item => item.checked)) {     // tat ca o checkbox deu = true thi set o checkbox all = true
      this.allChecked2 = true;
      this.indeterminate = false;
    } else {                                                        // o checkbox vua = false, vua = true thi set o checkbox all = indeterminate
      this.indeterminate = true;
    }
  }

  // start edit
  startEdit2(id: string): void {
    this.editCache2[id].edit = true;
  }

  // huy thay doi
  cancelEdit2(id: string): void {
    const index = this.lstCTiet.findIndex(item => item.id === id);  // lay vi tri hang minh sua
    this.editCache2[id] = {
      data: { ...this.lstCTiet[index] },
      edit: false
    };
  }

  // luu thay doi
  saveEdit2(id: string): void {
    this.editCache2[id].data.checked = this.lstCTiet.find(item => item.id === id).checked; // set checked editCache = checked lstCTietBCao
    const index = this.lstCTiet.findIndex(item => item.id === id);   // lay vi tri hang minh sua
    Object.assign(this.lstCTiet[index], this.editCache2[id].data); // set lai data cua lstCTietBCao[index] = this.editCache[id].data
    this.editCache2[id].edit = false;  // CHUYEN VE DANG TEXT
  }

  // gan editCache.data == lstCTietBCao
  updateEditCache2(): void {
    this.lstCTiet.forEach(item => {
      this.editCache2[item.id] = {
        edit: false,
        data: { ...item }
      };
    });
  }


  //call tong hop
  calltonghop() {
    this.spinner.hide();
    let objtonghop = {
      maDvi: this.maDvi,
      maLoaiBcao: this.maLoaiBacao,
      namHienTai: this.nam,
    }
    this.quanLyVonPhiService.tongHop(objtonghop).subscribe(res => {
      if (res.statusCode == 0) {
        this.lstCTietBCao = res.data;
        // this.namBaoCao = this.namBcao;
        this.namBaoCaoHienHanh = new Date().getFullYear();
        if (this.lstCTietBCao == null) {
          this.lstCTietBCao = [];
        }
        console.log(this.lstCTietBCao)
        //this.namBcaohienhanh = this.namBcaohienhanh
      } else {
        alert('co loi trong qua trinh van tin');
      }
    }, err => {
      alert(err.error.message);
    });
    this.quanLyVonPhiService.sinhMaBaoCao().subscribe(res => {
      if (res.statusCode == 0) {
        this.maBaoCao = res.data;
      } else {
        this.errorMessage = 'Có lỗi trong quá trình vấn tin!';
      }
    })
    this.spinner.show();
  }
}
