import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as uuid from "uuid";
import { DanhMucHDVService } from '../../../../../services/danhMucHDV.service';
import { DatePipe, Location } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { DomSanitizer } from '@angular/platform-browser';
import * as fileSaver from 'file-saver';
import { QLNV_KHVONPHI_TC_DTOAN_PHI_XUAT_DTQG_VTRO_CTRO_HNAM, Utils } from "../../../../../Utility/utils";
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { C, L } from '@angular/cdk/keycodes';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MESSAGE } from '../../../../../constants/message';


export class superMiniData {
  vitri!: any;
  maVtuTbi!: string;
  sl!: number;
}

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
  listCtiet!: superMiniData[];
  id!: any;
  stt!: String;
  checked!: boolean;
}

export class miniData {
  id!: any;
  stt!: number;
  checked!: boolean;
  maVtuTbi!: string;
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
  chiTietBcaos: any;                          // thong tin chi tiet bao cao
  lstVtu: miniData[] = [];
  lstCTietBCao: ItemData[] = [];              // list chi tiet bao cao
  lstBang: ItemData[] = [];
  //lstCTiet: miniData[] = [];
  id!: any;                                   // id truyen tu router
  lstFile: any = [];                          // list File de day vao api
  status: boolean = false;                    // trang thai an/ hien cua trang thai
  namBcao = new Date().getFullYear();         // nam bao cao
  userName: any;                              // ten nguoi dang nhap
  ngayNhap!: any;                             // ngay nhap
  nguoiNhap!: string;                         // nguoi nhap
  maDonViTao!: any;                           // ma don vi tao
  maBaoCao!: string;                          // ma bao cao
  namBaoCaoHienHanh: any = new Date().getFullYear();                    // nam bao cao hien hanh
  trangThaiBanGhi: string = "1";              // trang thai cua ban ghi
  maLoaiBaoCao: string = QLNV_KHVONPHI_TC_DTOAN_PHI_XUAT_DTQG_VTRO_CTRO_HNAM;                // nam bao cao
  maDviTien: string = "01";                   // ma don vi tien
  newDate = new Date();                       //
  fileToUpload!: File;                        // file tai o input
  listFile: File[] = [];                      // list file chua ten va id de hien tai o input
  box1 = true;                                // bien de an hien box1
  fileUrl: any;                               // url
  listIdDelete: string = "";                  // list id delete
  listIdDeleteVtus: string = "";

  statusBtnDel: boolean;                       // trang thai an/hien nut xoa
  statusBtnSave: boolean;                      // trang thai an/hien nut luu
  statusBtnApprove: boolean;                   // trang thai an/hien nut trinh duyet
  statusBtnTBP: boolean;                       // trang thai an/hien nut truong bo phan
  statusBtnLD: boolean;                        // trang thai an/hien nut lanh dao
  statusBtnGuiDVCT: boolean;                   // trang thai nut gui don vi cap tren
  statusBtnDVCT: boolean;                      // trang thai nut don vi cap tren

  listIdFiles: string;                        // id file luc call chi tiet


  allChecked = false;                         // check all checkbox
  allChecked1 = false;
  indeterminate = true;                       // properties allCheckBox
  editCache: { [key: string]: { edit: boolean; data: ItemData } } = {};     // phuc vu nut chinh
  editCache1: { [key: string]: { edit: boolean; data: miniData } } = {};

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
    private userService: UserService,
    private notification: NzNotificationService,
    private danhMucService: DanhMucHDVService,
    private location: Location
  ) {
    this.ngayNhap = this.datePipe.transform(this.newDate, Utils.FORMAT_DATE_STR,)
  }


  async ngOnInit() {
    this.id = this.routerActive.snapshot.paramMap.get('id');
    this.maDvi = this.routerActive.snapshot.paramMap.get('maDvi');
    this.maLoaiBacao = this.routerActive.snapshot.paramMap.get('maLoaiBacao');
    this.nam = this.routerActive.snapshot.paramMap.get('nam');
    let userName = this.userService.getUserName();
    await this.getUserInfo(userName);

    if (this.id) {
      await this.getDetailReport();
    } else if (
      this.maDvi != null &&
      this.maLoaiBacao != null &&
      this.nam != null
    ) {
      await this.calltonghop();
      this.nguoiNhap = this.userInfo?.username;
      this.maDonViTao = this.userInfo?.dvql;
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

  getStatusButton(){
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
    //gan lai id bang null
    this.lstVtu.forEach(item => {
      if (typeof item.id != 'number') {
        item.id = null;
      }
    })

    this.lstCTietBCao.forEach(item => {
      if (typeof item.id != 'number') {
        item.id = null;
      }
    })

    // gui du lieu trinh duyet len server
    let request = {
      id: this.id,
      fileDinhKems: listFile,
      listIdDeletes: this.listIdDelete,
      listColDeleteVtus: this.listIdDeleteVtus,
      lstCTietBCao: this.lstCTietBCao,
      lstTongVtu: this.lstVtu,
      maBcao: this.maBaoCao,
      maDvi: this.maDonViTao,
      //maDviTien: this.maDviTien,
      maLoaiBcao: this.maLoaiBaoCao,
      namBcao: this.namBcao,
      maDviTien: this.maDviTien,
      namHienHanh: 2022,
    };

    this.spinner.show();
    if (this.id == null) {
      this.quanLyVonPhiService.trinhDuyetService(request).toPromise().then(
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
      this.quanLyVonPhiService.updatelist(request).toPromise().then(
        async data => {
          if (data.statusCode == 0) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.SUCCESS);
            await this.getDetailReport();
            this.getStatusButton();
          } else {
            this.notification.error(MESSAGE.ERROR, data?.msg);
          }
      },err =>{
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      })

    }

    this.lstCTietBCao.filter(item => {
      if (!item.id) {
        item.id = uuid.v4();
      }
    });
    this.lstVtu.forEach(item => {
      if (!item.id) {
        item.id = uuid.v4();
      }
    })
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
      }else{
        this.notification.error(MESSAGE.ERROR, data?.msg);
      }
    },err => {
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
          // set thong tin chung bao cao
          this.ngayNhap = data.data.ngayTao;
          this.nguoiNhap = data.data.nguoiTao;
          this.maDonViTao = data.data.maDvi;
          this.maBaoCao = data.data.maBcao;
          this.namBaoCaoHienHanh = data.data.namBaoCaoHienHanh;
          this.namBcao = data.data.namBcao
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
          this.chiTietBcaos = data.data.lstCTietBCao;
          this.chiTietBcaos.forEach(item => {
            var mm: ItemData = {
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
              listCtiet: item.listCtiet,
              stt: item.stt,
              id: item.id,
              checked: false,
            }
            this.lstCTietBCao.push(mm);
          })
          
          this.lstFile = data.data.lstFile;
          var listVatTu: any = data.data.lstTongVtu;
          listVatTu.forEach(item => {
            var mm: miniData = {
              maVtuTbi: item.maVtuTbi,
              stt: item.stt,
              id: item.id,
              checked: false,
              tong: item.tong,
              cphiXuatCoDmuc: item.cphiXuatCoDmuc,
              cphiXuatChuaDmuc: item.cphiXuatChuaDmuc,
              thanhTienCoDmuc: item.thanhTienCoDmuc,
              thanhTienKhongDmuc: item.thanhTienKhongDmuc,
              thanhTienCong: item.thanhTienCong,
            }
            this.lstVtu.push(mm);
          })
          this.lstCTietBCao.forEach(data => {
            data.listCtiet.forEach( item => {
              item.vitri = this.lstVtu.find(e => e.maVtuTbi==item.maVtuTbi).id;
            })
          })

          this.lstBang = this.lstCTietBCao;
          this.updateEditCache();

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
    // this.router.navigate(['/qlkh-von-phi/quan-ly-lap-tham-dinh-du-toan-nsnn/tim-kiem']);
    this.location.back()
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////// CONG VIEC CUA BANG CHINH //////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////////////
  // them dong moi
  addLine(id: number): void {
    var data: superMiniData[] = [];
    var data1: superMiniData[] = [];
    this.lstVtu.forEach(item => {
      var mini: superMiniData = {
        maVtuTbi: item.maVtuTbi,
        sl: 0,
        vitri: item.id,
      };
      var mini1: superMiniData = {
        maVtuTbi: item.maVtuTbi,
        sl: 0,
        vitri: item.id,
      }
      data.push(mini);
      data1.push(mini1);
    })
    let item: ItemData = {
      maCucDtnnKvuc: null,
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
      listCtiet: data,
      stt: "",
      id: uuid.v4(),
      checked: false,
    }

    let item1: ItemData = {
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
      listCtiet: data1,
      stt: "",
      id: item.id,
      checked: false,
    }

    this.lstCTietBCao.splice(id, 0, item);
    this.editCache[item.id] = {
      edit: true,
      data: { ...item1 }
    };
  }

  // xoa dong
  deleteById(id: any): void {
    this.lstBang = this.lstBang.filter(item => item.id != id);
    this.lstCTietBCao = this.lstCTietBCao.filter(item => item.id != id);

    if (typeof id == "number") {
      this.listIdDelete += id + ",";
    }
    //can cap nhat lai lstCTiet
    this.tinhLaiTongSl();
  }

  // xóa với checkbox
  deleteSelected() {
    // add list delete id
    this.lstCTietBCao.forEach(item => {
        if(item.checked == true && typeof item.id == "number"){
          this.listIdDelete += item.id + ","
        }
    })
    // delete object have checked = true
    this.lstBang = this.lstBang.filter(item => item.checked != true);
    this.lstCTietBCao = this.lstCTietBCao.filter(item => item.checked != true);
    this.allChecked = false;
    // can cap nhat lai lstCTiet
    this.tinhLaiTongSl();
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

  // start edit
  startEdit(id: string): void {
    this.editCache[id].edit = true;
  }

  // huy thay doi
  cancelEdit(id: string): void {
    if (!this.editCache[id].data.maCucDtnnKvuc){
      this.notification.error(MESSAGE.ERROR, MESSAGE.NULL_ERROR);
      return;
    }

    const index = this.lstCTietBCao.findIndex(item => item.id === id);  // lay vi tri hang minh sua
    var item: ItemData = this.lstCTietBCao[index];
    this.editCache[id].data.maCucDtnnKvuc = item.maCucDtnnKvuc;
    this.editCache[id].data.luongGao = item.luongGao;
    this.editCache[id].data.cphiXuatCoDmucGao = item.cphiXuatCoDmucGao;
    this.editCache[id].data.cphiXuatChuaDmucGao = item.cphiXuatChuaDmucGao;
    this.editCache[id].data.thanhTienCoDmucGao = item.thanhTienCoDmucGao;
    this.editCache[id].data.thanhTienKhongDmucGao = item.thanhTienKhongDmucGao;
    this.editCache[id].data.thanhTienCongGao = item.thanhTienCongGao;
    this.editCache[id].data.luongThoc = item.luongThoc;
    this.editCache[id].data.cphiXuatCoDmucThoc = item.cphiXuatCoDmucThoc;
    this.editCache[id].data.cphiXuatChuaDmucThoc = item.cphiXuatChuaDmucThoc;
    this.editCache[id].data.thanhTienCoDmucThoc = item.thanhTienCoDmucThoc;
    this.editCache[id].data.thanhTienKhongDmucThoc = item.thanhTienKhongDmucThoc;
    this.editCache[id].data.thanhTienCongThoc = item.thanhTienCongThoc;
    this.editCache[id].data.stt = item.stt;
    this.editCache[id].data.id = item.id;
    this.editCache[id].data.checked = false;
    this.editCache[id].edit = false;
  }

  // luu thay doi
  saveEdit(id: string): void {
    if (!this.editCache[id].data.maCucDtnnKvuc){
      this.notification.error(MESSAGE.ERROR, MESSAGE.NULL_ERROR);
      return;
    }
    this.lstBang = this.lstBang.filter(e => e.id != id);   
    this.editCache[id].data.checked = this.lstCTietBCao.find(item => item.id === id).checked;  // set checked editCache = checked lstCTietBCao
    const index = this.lstCTietBCao.findIndex(item => item.id === id);
    var item: ItemData = this.editCache[id].data;
    this.lstCTietBCao[index].maCucDtnnKvuc = item.maCucDtnnKvuc;
    this.lstCTietBCao[index].luongGao = item.luongGao;
    this.lstCTietBCao[index].cphiXuatCoDmucGao = item.cphiXuatCoDmucGao;
    this.lstCTietBCao[index].cphiXuatChuaDmucGao = item.cphiXuatChuaDmucGao;
    this.lstCTietBCao[index].thanhTienCoDmucGao = item.thanhTienCoDmucGao;
    this.lstCTietBCao[index].thanhTienKhongDmucGao = item.thanhTienKhongDmucGao;
    this.lstCTietBCao[index].thanhTienCongGao = item.thanhTienCongGao;
    this.lstCTietBCao[index].luongThoc = item.luongThoc;
    this.lstCTietBCao[index].cphiXuatCoDmucThoc = item.cphiXuatCoDmucThoc;
    this.lstCTietBCao[index].cphiXuatChuaDmucThoc = item.cphiXuatChuaDmucThoc;
    this.lstCTietBCao[index].thanhTienCoDmucThoc = item.thanhTienCoDmucThoc;
    this.lstCTietBCao[index].thanhTienKhongDmucThoc = item.thanhTienKhongDmucThoc;
    this.lstCTietBCao[index].thanhTienCongThoc = item.thanhTienCongThoc;
    this.lstCTietBCao[index].stt = item.stt;
    this.lstCTietBCao[index].id = item.id;
    this.lstCTietBCao[index].checked = false;
    this.editCache[id].edit = false;
    this.lstBang.splice(index, 0, this.lstCTietBCao[index]);
  }

  // gan editCache.data == lstCTietBCao
  updateEditCache(): void {
    this.lstCTietBCao.forEach(data => {
      var mm: superMiniData[] = [];
      data.listCtiet.forEach(item => {
        var ss: superMiniData = {
          maVtuTbi: item.maVtuTbi,
          sl: item.sl,
          vitri: item.vitri,
        }
        mm.push(ss);
      })
      var zz: ItemData = {
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
        listCtiet: mm,
        stt: data.stt,
        id: data.id,
        checked: false,
      }
      this.editCache[data.id] = {
        edit: false,
        data: { ...zz }
      };
    });
    this.lstVtu.forEach(item => {
      this.editCache1[item.id] = {
        edit: false,
        data: { ...item }
      };
    });
  }

  changeModel(id: string): void {
    this.editCache[id].data.thanhTienCoDmucGao = this.editCache[id].data.luongGao * this.editCache[id].data.cphiXuatCoDmucGao;
    this.editCache[id].data.thanhTienKhongDmucGao = this.editCache[id].data.luongGao * this.editCache[id].data.cphiXuatChuaDmucGao;
    this.editCache[id].data.thanhTienCongGao = this.editCache[id].data.thanhTienCoDmucGao + this.editCache[id].data.thanhTienKhongDmucGao;
    this.editCache[id].data.thanhTienCoDmucThoc = this.editCache[id].data.luongThoc * this.editCache[id].data.cphiXuatCoDmucThoc;
    this.editCache[id].data.thanhTienKhongDmucThoc = this.editCache[id].data.luongThoc * this.editCache[id].data.cphiXuatChuaDmucThoc;
    this.editCache[id].data.thanhTienCongThoc = this.editCache[id].data.thanhTienCoDmucThoc + this.editCache[id].data.thanhTienKhongDmucThoc;
  }

  //////////////////////////////////////////////////////////////////////////////////////
  ////////////////////// CONG VIEC CUA BANG PHU ////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////
  // them dong moi
  addLine1(id: number): void {
    var mm: string = uuid.v4();
    let item: miniData = {
      maVtuTbi: "",
      stt: 0,
      id: mm,
      checked: false,
      tong: 0,
      cphiXuatCoDmuc: 0,
      cphiXuatChuaDmuc: 0,
      thanhTienCoDmuc: 0,
      thanhTienKhongDmuc: 0,
      thanhTienCong: 0,
    }
    this.lstCTietBCao.forEach(data => {
      var mm: superMiniData = {
        maVtuTbi: item.maVtuTbi,
        sl: 0,
        vitri: item.id,
      }
      var mm1: superMiniData = {
        maVtuTbi: item.maVtuTbi,
        sl: 0,
        vitri: item.id,
      }
      data.listCtiet.splice(id, 0, mm);
      this.editCache[data.id].data.listCtiet.splice(id, 0, mm1);
    })
    this.lstVtu.splice(id, 0, item);
    this.editCache1[item.id] = {
      edit: true,
      data: { ...item }
    };
    this.lstBang = this.lstCTietBCao.filter(item => item.maCucDtnnKvuc);

  }

  // xoa dong
  deleteById1(id: any): void {
    var ll: miniData = this.lstVtu.find(e => e.id === id);

    this.lstCTietBCao.forEach(item => {
      item.listCtiet = item.listCtiet.filter(e => e.vitri != id);
    })

    this.lstBang = this.lstCTietBCao.filter(item => item.maCucDtnnKvuc);

    if (typeof id == 'number')
      this.listIdDeleteVtus += ll.maVtuTbi + ",";
    this.lstVtu = this.lstVtu.filter(item => item.id != id);
    //can cap nhat lai lstCTiet
    this.tinhLaiTongSl();
  }

  // xóa với checkbox
  deleteSelected1() {
    // add list delete id
    this.lstVtu.filter(item => {
      if (item.checked) {
        this.lstCTietBCao.forEach(data => {
          data.listCtiet = data.listCtiet.filter(e => e.vitri != item.id);
        });
      }
      if (item.checked == true && typeof item.id == "number") {
        this.listIdDeleteVtus += item.maVtuTbi + ",";
      }
    })
    this.lstBang = this.lstCTietBCao.filter(item => item.maCucDtnnKvuc);

    // delete object have checked = true
    this.lstVtu = this.lstVtu.filter(item => item.checked != true)
    this.allChecked1 = false;
    // can cap nhat lai lstCTiet
    this.tinhLaiTongSl();
  }



  // click o checkbox all
  updateAllChecked1(): void {
    this.indeterminate = false;                               // thuoc tinh su kien o checkbox all
    if (this.allChecked1) {                                    // checkboxall == true thi set lai lstCTietBCao.checked = true
      this.lstVtu = this.lstVtu.map(item => ({
        ...item,
        checked: true
      }));
    } else {
      this.lstVtu = this.lstVtu.map(item => ({    // checkboxall == false thi set lai lstCTietBCao.checked = false
        ...item,
        checked: false
      }));
    }
  }

  // click o checkbox single
  updateSingleChecked1(): void {
    if (this.lstVtu.every(item => !item.checked)) {           // tat ca o checkbox deu = false thi set o checkbox all = false
      this.allChecked1 = false;
      this.indeterminate = false;
    } else if (this.lstVtu.every(item => item.checked)) {     // tat ca o checkbox deu = true thi set o checkbox all = true
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
    if (!this.editCache1[id].data.maVtuTbi){
      this.notification.error(MESSAGE.ERROR, MESSAGE.NULL_ERROR);
      return;
    }

    const index = this.lstVtu.findIndex(item => item.id === id);  // lay vi tri hang minh sua
    this.editCache1[id] = {
      data: { ...this.lstVtu[index] },
      edit: false
    };
    this.lstCTietBCao.forEach(item => {
      var ind: number = item.listCtiet.findIndex(e => e.maVtuTbi == this.lstVtu[index].maVtuTbi);
      this.editCache[item.id].data.listCtiet.forEach(data => {
        if (data.maVtuTbi == this.lstVtu[index].maVtuTbi) {
          data.sl = item.listCtiet[ind].sl;
        }
      })
    })
  }

  // luu thay doi
  saveEdit1(id: string): void {
    if (!this.editCache1[id].data.maVtuTbi){
      this.notification.error(MESSAGE.ERROR, MESSAGE.NULL_ERROR);
      return;
    }
    this.editCache1[id].data.checked = this.lstVtu.find(item => item.id === id).checked; // set checked editCache = checked lstCTietBCao
    const index = this.lstVtu.findIndex(item => item.id === id);   // lay vi tri hang minh sua
    Object.assign(this.lstVtu[index], this.editCache1[id].data);
    this.editCache1[id].edit = false;  // CHUYEN VE DANG TEXT
    this.lstCTietBCao.forEach(item => {
      var ind: number = item.listCtiet.findIndex(e => e.vitri == this.lstVtu[index].id);
      this.editCache[item.id].data.listCtiet.forEach(data => {
        if (data.vitri == this.lstVtu[index].id) {
          item.listCtiet[ind].sl = data.sl;
        }
      })
    });
    this.lstBang = this.lstCTietBCao.filter(item => item.maCucDtnnKvuc);
  }

  tinhLaiTongSl() {
    this.lstVtu.forEach(item => {
      item.tong = 0;
      this.lstBang.forEach(data => {
        data.listCtiet.forEach(e => {
          if (item.id == e.vitri) {
            item.tong += e.sl;
          }
        })
      })
      item.thanhTienCoDmuc = item.tong * item.cphiXuatCoDmuc;
      item.thanhTienKhongDmuc = item.tong * item.cphiXuatChuaDmuc;
      item.thanhTienCong = item.thanhTienCoDmuc + item.thanhTienKhongDmuc;
    })
  }

  tongSl(id: any) {
    var col: any = this.editCache1[id].data.id;
    this.editCache1[id].data.tong = 0;
    this.lstCTietBCao.forEach(item => {
      this.editCache[item.id].data.listCtiet.forEach(e => {
        if (e.vitri == col) {
          this.editCache1[id].data.tong += e.sl;
        }
      })
    })
    this.thanhTien(id);
  }

  thanhTien(id: any) {
    this.editCache1[id].data.thanhTienCoDmuc = this.editCache1[id].data.tong * this.editCache1[id].data.cphiXuatCoDmuc;
    this.editCache1[id].data.thanhTienKhongDmuc = this.editCache1[id].data.tong * this.editCache1[id].data.cphiXuatChuaDmuc;
    this.editCache1[id].data.thanhTienCong = this.editCache1[id].data.thanhTienCoDmuc + this.editCache1[id].data.thanhTienKhongDmuc;
  }

  //call tong hop
  calltonghop() {
    this.spinner.hide();
    let objtonghop = {
      maDvi: this.maDvi,
      maLoaiBcao: this.maLoaiBacao,
      namHienTai: this.nam,
    }
    this.quanLyVonPhiService.tongHop(objtonghop).toPromise().then(res => {
      if (res.statusCode == 0) {
        this.lstCTietBCao = res.data;
        // this.namBaoCao = this.namBcao;
        this.namBaoCaoHienHanh = new Date().getFullYear();
        if (this.lstCTietBCao == null) {
          this.lstCTietBCao = [];
        }
        //this.namBcaohienhanh = this.namBcaohienhanh
      } else {
        this.notification.error(MESSAGE.ERROR, res?.msg);
      }
    }, err => {
      this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
    });
    this.quanLyVonPhiService.sinhMaBaoCao().toPromise().then(
      res => {
        if (res.statusCode == 0) {
          this.maBaoCao = res.data;
        } else {
          this.notification.error(MESSAGE.ERROR, res?.msg);
        }
      }),
      err => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
      }
    this.spinner.show();
  }
  //kiem tra xem vat tu da duoc chon hay chua
  checkVtu(id: any){
    var index: number = this.lstVtu.findIndex(e => e.id === id);
    var ma: any = this.editCache1[id].data.maVtuTbi;
    var kt: boolean = false;
    this.lstVtu.forEach(item => {
      if ((id != item.id)&&(item.maVtuTbi == ma)) {
        kt = true;
      }
    })
    if (kt) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_ADD_VTU);
      this.deleteById1(id);
      this.addLine1(index + 1);
    }
  }
  //kiem tra xe cuc DTNN KV duoc chon hay chua
  checkCucKV(id: any){
    var index: number = this.lstCTietBCao.findIndex(e => e.id === id);
    var ma: any = this.editCache[id].data.maCucDtnnKvuc;
    var kt: boolean = false;
    this.lstCTietBCao.forEach(item => {
      if ((id != item.id)&&(item.maCucDtnnKvuc == ma)) {
        kt = true;
      }
    })
    if (kt) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_ADD_UNIT);
      this.deleteById(id);
      this.addLine(index + 1);
    }
  }

  checkNull(id: any){
    if (this.editCache[id].data.maCucDtnnKvuc){
      this.notification.error(MESSAGE.ERROR, MESSAGE.NULL_ERROR);
    }
  }

  getName(maDvi: string): string {
    return this.cucKhuVucs.find(e => e.maDvi === maDvi)?.tenDvi;
  }
}
