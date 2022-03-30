import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as uuid from "uuid";
import { DanhMucHDVService } from '../../../../../services/danhMucHDV.service';
import { DatePipe } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { DomSanitizer } from '@angular/platform-browser';
import * as fileSaver from 'file-saver';
import { QLNV_KHVONPHI_TC_DTOAN_PHI_XUAT_DTQG_VTRO_CTRO_HNAM, Utils } from "../../../../../Utility/utils";
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { C } from '@angular/cdk/keycodes';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MESSAGE } from '../../../../../constants/message';


export class ItemData {
  maCucDtnnKvuc!: string;
  luongGao!: number;
  cphiXuatCoDmucGao!: number;
  cphiXuatChuaDmucGao!: number;
  thanhTienCoDmucGao!: number;
  thanhTienKhongDmucGao!: number;
  thanhTienCongGao!: number;
  luongThoc!: number;
  cphiXuatCoDmucThoc!: number;
  cphiXuatChuaDmucThoc!: number;
  thanhTienCoDmucThoc!: number;
  thanhTienKhongDmucThoc!: number;
  thanhTienCongThoc!: number;
  id!: any;
  stt!: String;
  checked!: boolean;
}

export class superMiniData {
  id!: any;
  maDvi!: string;
  sl!: number;
  col!: any;
}

export class miniData {
  id!: any;
  stt!: number;
  checked!: boolean;
  maVtu!: string;
  SL: any[] = [];
  tong: number;
  cphiXuatCoDmuc!: number;
  cphiXuatChuaDmuc!: number;
  thanhTienCoDmuc!: number;
  thanhTienKhongDmuc!: number;
  thanhTienCong!: number;
}

@Component({
  selector: 'app-du-toan-phi-xuat-hang-dtqg-hang-nam-vtct',
  templateUrl: './du-toan-phi-xuat-hang-dtqg-hang-nam-vtct.component.html',
  styleUrls: ['./du-toan-phi-xuat-hang-dtqg-hang-nam-vtct.component.scss'],
})

export class DuToanPhiXuatHangDtqgHangNamVtctComponent implements OnInit {
  [x: string]: any;
  userInfo: any;
  maDvi: any;
  maLoaiBacao: string = QLNV_KHVONPHI_TC_DTOAN_PHI_XUAT_DTQG_VTRO_CTRO_HNAM;
  nam: any;
  errorMessage!: String;
  vatTus: any = [];
  donVis: any = [];                            // danh muc don vi
  cucKhuVucs: any = [];
  bangDvi: superMiniData[] = [];
  chiTietBcaos: any;                          // thong tin chi tiet bao cao
  lstVtu: any = [];
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
  maLoaiBaoCao: string = QLNV_KHVONPHI_TC_DTOAN_PHI_XUAT_DTQG_VTRO_CTRO_HNAM;                // nam bao cao
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
    this.ngayNhap = this.datePipe.transform(this.newDate, Utils.FORMAT_DATE_TIME_STR,)
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
          //console.log(this.vatTus);
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
          console.log(this.donVis);
          this.cucKhuVucs = this.donVis.filter(item => item.capDvi === "2");
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
    //gan lai id bang null
    this.lstCTiet.forEach(item => {
      if (typeof item.id != 'number') {
        item.id = null;
      }
      item.SL.forEach(data => {
        if (typeof data.id != 'number') {
          data.id = null;
        }
      })
    })

    this.lstCTietBCao.forEach(item => {
      if (typeof item.id != 'number') {
        item.id = null;
      } 
    })

    let listCTBC: any = [];
    let listVtu: any = [];
    //do du lieu vao listVtu
    this.lstCTiet.forEach(item => {
      let mm : any = {
        id: item.id,
        stt: item.stt,
        maVtu: item.maVtu.toString(),
        tong: item.tong,
        cphiXuatCoDmuc: item.cphiXuatCoDmuc,
        cphiXuatChuaDmuc: item.cphiXuatChuaDmuc,
        thanhTienCoDmuc: item.thanhTienCoDmuc,
        thanhTienKhongDmuc: item.thanhTienKhongDmuc,
        thanhTienCong: item.thanhTienCong,
      }
      listVtu.push(mm);
    })
    //do du lieu vao listCTBC
    this.lstCTietBCao.forEach(data => {
      let CTBC: any = {
        maCucDtnnKvuc: data.maCucDtnnKvuc,
        luongGao: data.luongGao,
        cphiXuatCoDmucGao: data.cphiXuatCoDmucGao,
        cphiXuatChuaDmucGao: data.cphiXuatChuaDmucGao,
        thanhTienCoDmucGao: data.thanhTienCoDmucGao,
        thanhTienKhongDmucGao: data.thanhTienKhongDmucGao,
        thanhTienCongGao: data.thanhTienCongGao,
        luongThoc: data.luongThoc,
        cphiXuatCoDmucThoc: data.cphiXuatCoDmucThoc,
        cphiXuatChuaDmucThoc: data.cphiXuatChuaDmucThoc,
        thanhTienCoDmucThoc: data.thanhTienCoDmucThoc,
        thanhTienKhongDmucThoc: data.thanhTienKhongDmucThoc,
        thanhTienCongThoc: data.thanhTienCongThoc,
        id: data.id,
        stt: data.stt,
        listCtiet: [],
      }
      this.lstCTiet.forEach(item => {
        const index = item.SL.findIndex(e => e.maDvi == data.maCucDtnnKvuc);
        let mm : any = {
          id: item.id,
          stt: item.stt,
          maVtu: item.maVtu.toString(),
          sl: item.SL[index].sl,
          col: item.SL[index].col.toString(),
        }
        CTBC.listCtiet.push(mm);
      })
      listCTBC.push(CTBC);
    })

    console.log(listCTBC);
        
    // gui du lieu trinh duyet len server
    let request = {
      id: this.id,
      fileDinhKems: listFile,
      listIdDelete: this.listIdDelete,
      lstCTietBCao: listCTBC,
      lstTongVtu: listVtu,
      maBcao: this.maBaoCao,
      maDvi: this.maDonViTao,
      //maDviTien: this.maDviTien,
      maLoaiBcao: this.maLoaiBaoCao,
      namBcao: this.namBaoCaoHienHanh.toString(),
      maDviTien: this.maDviTien,
      namHienHanh: this.namBaoCaoHienHanh,
    };

    console.log(request);
    this.spinner.show();
    if (this.id == null) {
      this.quanLyVonPhiService.trinhDuyetService1(request).subscribe(
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
    this.lstCTiet.forEach(item => {
      if (!item.id) {
        item.id = uuid.v4();
      }
      item.SL.forEach(data => {
        if (!data.id) {
          data.id = uuid.v4();
        }
      })
    })
    this.updateEditCache1();
    this.updateEditCache2();
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
    this.spinner.show();
    this.quanLyVonPhiService.bCLapThamDinhDuToanChiTiet1(this.id).subscribe(
      (data) => {
        if (data.statusCode == 0) {
          console.log(data.data);
          this.chiTietBcaos = data.data.lstCTietBCao;
          this.lstFile = data.data.lstFile;
          this.lstVtu = data.data.lstTongVtu;

          // set thong tin chung bao cao
          this.ngayNhap = data.data.ngayTao;
          this.nguoiNhap = data.data.nguoiTao;
          this.maDonViTao = data.data.maDvi;
          this.maBaoCao = data.data.maBcao;
          this.namBaoCaoHienHanh = data.data.namBaoCaoHienHanh;
          this.namBcao = data.data.namBaoCao
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
          this.lstVtu.forEach(item => {
            let vTu: miniData = {
              id: item.id,
              stt: item.stt,
              checked: false,
              maVtu: item.maVtu,
              SL: [],
              tong: item.tong,
              cphiXuatCoDmuc: item.cphiXuatCoDmuc,
              cphiXuatChuaDmuc: item.cphiXuatChuaDmuc,
              thanhTienCoDmuc: item.thanhTienCoDmuc,
              thanhTienKhongDmuc: item.thanhTienKhongDmuc,
              thanhTienCong: item.thanhTienCong,
            }
            this.lstCTiet.push(vTu);
          })

          this.chiTietBcaos.forEach(item => {
            //them vao cac hang cua bang chinh
            let nDung: ItemData = {
              maCucDtnnKvuc: item.maCucDtnnKvuc,
              luongGao: item.luongGao,
              cphiXuatCoDmucGao: item.cphiXuatCoDmucGao,
              cphiXuatChuaDmucGao: item.cphiXuatChuaDmucGao,
              thanhTienCoDmucGao: item.thanhTienCoDmucGao,
              thanhTienKhongDmucGao: item.thanhTienKhongDmucGao,
              thanhTienCongGao: item.thanhTienCongGao,
              luongThoc: item.luongThoc,
              cphiXuatCoDmucThoc: item.cphiXuatCoDmucThoc,
              cphiXuatChuaDmucThoc: item.cphiXuatChuaDmucThoc,
              thanhTienCoDmucThoc: item.thanhTienCoDmucThoc,
              thanhTienKhongDmucThoc: item.thanhTienKhongDmucThoc,
              thanhTienCongThoc: item.thanhTienCongThoc,
              id:  item.id,
              stt: item.stt,
              checked: false,
            }
            this.lstCTietBCao.push(nDung);
            //tao danh sach cac cot cua bang phu
            let mn: superMiniData = {
              id: nDung.id,
              maDvi: item.maCucDtnnKvuc,
              sl: 0,
              col: nDung.id,
            }
            this.bangDvi.push(mn);
            //them du lieu vao cac cot cua bang phu
            for (var i = 0; i < item.listCtiet.length; i++) {
              let mini: superMiniData = {
                id: nDung.id,
                maDvi: item.maCucDtnnKvuc,
                sl: item.listCtiet[i].sl,
                col: nDung.id,
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
    return this.donVis.find(item => item.maDvi == this.maDonViTao)?.tenDvi;
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
      maCucDtnnKvuc: "",
      luongGao: 0,
      cphiXuatCoDmucGao: 0,
      cphiXuatChuaDmucGao: 0,
      thanhTienCoDmucGao: 0,
      thanhTienKhongDmucGao: 0,
      thanhTienCongGao: 0,
      luongThoc: 0,
      cphiXuatCoDmucThoc: 0,
      cphiXuatChuaDmucThoc: 0,
      thanhTienCoDmucThoc: 0,
      thanhTienKhongDmucThoc: 0,
      thanhTienCongThoc: 0,
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
    this.bangDvi = this.bangDvi.filter(item => item.col != id);

    this.lstCTiet.forEach(item => {
      item.SL = item.SL.filter(data => data.col != id);
    })

    this.lstCTietBCao = this.lstCTietBCao.filter(item => item.id != id)

    if (typeof id == "number") {
      this.listIdDelete += id + ",";
    }
    //can cap nhat lai lstCTiet
  }

  // xóa với checkbox
  deleteSelected1() {
    // add list delete id
    this.lstCTietBCao.forEach(item => {
      if (item.checked) {
        this.bangDvi = this.bangDvi.filter(data => data.col != item.id);
        this.lstCTiet.forEach(data => {
          data.SL = data.SL.filter(e => e.col != item.id);
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
    this.editCache1[id].data.checked = this.lstCTietBCao.find(item => item.id == id).checked;  // set checked editCache = checked lstCTietBCao
    const index = this.lstCTietBCao.findIndex(item => item.id === id);                          // lay vi tri hang minh sua
    if (this.lstCTietBCao[index].maCucDtnnKvuc == "") {
      let mini: superMiniData = {
        id: uuid.v4(),
        maDvi: this.editCache1[id].data.maCucDtnnKvuc,
        sl: 0,
        col: id,
      }
      this.bangDvi.splice(index, 0, mini);
      this.lstCTiet.forEach(item => {
        item.SL.splice(index, 0, mini);
      })
    }
    else {
      if (this.lstCTietBCao[index].maCucDtnnKvuc != this.editCache1[id].data.maCucDtnnKvuc) {
        const ind = this.bangDvi.findIndex(item => item.col == this.lstCTietBCao[index].id);
        this.bangDvi[ind].maDvi = this.editCache1[id].data.maCucDtnnKvuc;
        this.lstCTiet.forEach(item => {
          item.SL[ind].maDvi = this.bangDvi[ind].maDvi;
          item.SL[ind].sl = 0;
        })
      }
    }
    Object.assign(this.lstCTietBCao[index], this.editCache1[id].data); // set lai data cua lstCTietBCao[index] = this.editCache[id].data
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
  changeModel(id: string): void {
    this.editCache1[id].data.thanhTienCoDmucGao = this.editCache1[id].data.luongGao * this.editCache1[id].data.cphiXuatCoDmucGao;
    this.editCache1[id].data.thanhTienKhongDmucGao = this.editCache1[id].data.luongGao * this.editCache1[id].data.cphiXuatChuaDmucGao;
    this.editCache1[id].data.thanhTienCongGao = this.editCache1[id].data.thanhTienCoDmucGao + this.editCache1[id].data.thanhTienKhongDmucGao;
    this.editCache1[id].data.thanhTienCoDmucThoc = this.editCache1[id].data.luongThoc * this.editCache1[id].data.cphiXuatCoDmucThoc;
    this.editCache1[id].data.thanhTienKhongDmucThoc = this.editCache1[id].data.luongThoc * this.editCache1[id].data.cphiXuatChuaDmucThoc;
    this.editCache1[id].data.thanhTienCongThoc = this.editCache1[id].data.thanhTienCoDmucThoc + this.editCache1[id].data.thanhTienKhongDmucThoc;
  }

  //////////////////////////////////////////////////////////////////////////////////////
  ////////////////////// CONG VIEC CUA BANG PHU ////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////
  // them dong moi
  addLine2(id: number): void {
    let data: superMiniData[] = [];
    this.bangDvi.forEach(item => {
      let mm: superMiniData = {
        id: uuid.v4(),
        maDvi: item.maDvi,
        sl: 0,
        col: item.id,
      }
      data.push(mm);
    })
    let data1: superMiniData[] = [];
    this.bangDvi.forEach(item => {
      let mm: superMiniData = {
        id: uuid.v4(),
        maDvi: item.maDvi,
        sl: 0,
        col: item.id,
      }
      data1.push(mm);
    })
    
    let item: miniData = {
      maVtu: "",
      SL: data,
      stt:0,
      id: uuid.v4(),
      checked: false,
      tong: 0,
      cphiXuatCoDmuc: 0,
      cphiXuatChuaDmuc: 0,
      thanhTienCoDmuc: 0,
      thanhTienKhongDmuc: 0,
      thanhTienCong: 0,
    }

    let item1: miniData = {
      maVtu: "",
      SL: data1,
      stt:0,
      id: item.id,
      checked: false,
      tong: 0,
      cphiXuatCoDmuc: 0,
      cphiXuatChuaDmuc: 0,
      thanhTienCoDmuc: 0,
      thanhTienKhongDmuc: 0,
      thanhTienCong: 0,
    }

    this.lstCTiet.splice(id, 0, item);
    this.editCache2[item.id] = {
      edit: true,
      data: { ...item1,
      }
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
    let mm: superMiniData[] = [];
    this.lstCTiet[index].SL.forEach(item => {
      let ss: superMiniData = {
        id: item.id,
        maDvi: item.maDvi,
        sl: item.sl,
        col: item.col,
      }
      mm.push(ss);
    })
    let data: miniData = {
      maVtu: this.lstCTiet[index].maVtu,
      SL: mm,
      stt: this.lstCTiet[index].stt,
      id: this.lstCTiet[index].id,
      checked: this.lstCTiet[index].checked,
      tong: this.lstCTiet[index].tong,
      cphiXuatCoDmuc: this.lstCTiet[index].cphiXuatCoDmuc,
      cphiXuatChuaDmuc: this.lstCTiet[index].cphiXuatChuaDmuc,
      thanhTienCoDmuc: this.lstCTiet[index].thanhTienCoDmuc,
      thanhTienKhongDmuc: this.lstCTiet[index].thanhTienKhongDmuc,
      thanhTienCong: this.lstCTiet[index].thanhTienCong,
    }
    this.editCache2[id] = {
      data: { ...data},
      edit: false
    };
  }

  // luu thay doi
  saveEdit2(id: string): void {
    this.editCache2[id].data.checked = this.lstCTiet.find(item => item.id === id).checked; // set checked editCache = checked lstCTietBCao
    let mm: superMiniData[] = [];
    this.editCache2[id].data.SL.forEach(item => {
      let ss: superMiniData = {
        id: item.id,
        maDvi: item.maDvi,
        sl: item.sl,
        col: item.col,
      }
      mm. push(ss);
    })
    let data: miniData = {
      maVtu: this.editCache2[id].data.maVtu,
      SL: mm,
      stt: this.editCache2[id].data.stt,
      id: this.editCache2[id].data.id,
      checked: this.editCache2[id].data.checked,
      tong: this.editCache2[id].data.tong,
      cphiXuatCoDmuc: this.editCache2[id].data.cphiXuatCoDmuc,
      cphiXuatChuaDmuc: this.editCache2[id].data.cphiXuatChuaDmuc,
      thanhTienCoDmuc: this.editCache2[id].data.thanhTienCoDmuc,
      thanhTienKhongDmuc: this.editCache2[id].data.thanhTienKhongDmuc,
      thanhTienCong: this.editCache2[id].data.thanhTienCong,
    }
    
    const index = this.lstCTiet.findIndex(item => item.id === id);   // lay vi tri hang minh sua
    this.lstCTiet[index] = data;
    this.editCache2[id].edit = false;  // CHUYEN VE DANG TEXT
  }

  // gan editCache.data == lstCTietBCao
  updateEditCache2(): void {
    this.lstCTiet.forEach(data => {
      var mm: superMiniData[] = [];
      data.SL.forEach(item => {
        var ss: superMiniData = {
          id: item.id,
          maDvi: item.maDvi,
          sl: item.sl,
          col: item.col,
        }
        mm.push(ss);
      })
      var ll: miniData = {
        id: data.id,
        stt: data.stt,
        checked: data.checked,
        maVtu: data.maVtu,
        SL: mm,
        tong: data.tong,
        cphiXuatCoDmuc: data.cphiXuatCoDmuc,
        cphiXuatChuaDmuc: data.cphiXuatChuaDmuc,
        thanhTienCoDmuc: data.thanhTienCoDmuc,
        thanhTienKhongDmuc: data.thanhTienKhongDmuc,
        thanhTienCong: data.thanhTienCong,
      }
      this.editCache2[data.id] = {
        edit: false,
        data: { ...ll }
      };
    })
  }

  tongSl(id: any){
    
    this.editCache2[id].data.tong = 0;
    this.editCache2[id].data.SL.forEach(item => {
      this.editCache2[id].data.tong += item.sl;
    })
    this.thanhTien(id);
  }

  thanhTien(id: any){
    this.editCache2[id].data.thanhTienCoDmuc = this.editCache2[id].data.cphiXuatCoDmuc * this.editCache2[id].data.tong;
    this.editCache2[id].data.thanhTienKhongDmuc = this.editCache2[id].data.cphiXuatChuaDmuc * this.editCache2[id].data.tong;
    this.editCache2[id].data.thanhTienCong = this.editCache2[id].data.thanhTienCoDmuc + this.editCache2[id].data.thanhTienKhongDmuc;
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