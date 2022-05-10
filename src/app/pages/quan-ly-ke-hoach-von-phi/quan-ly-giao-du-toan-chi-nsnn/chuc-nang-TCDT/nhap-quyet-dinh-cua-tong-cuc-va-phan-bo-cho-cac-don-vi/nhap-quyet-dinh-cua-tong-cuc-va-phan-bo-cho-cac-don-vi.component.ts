import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import * as fileSaver from 'file-saver';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogChonKeHoachPhanBoGiaoDuToanChoChiCucVanPhongCucComponent } from 'src/app/components/dialog/dialog-chon-ke-hoach-phan-bo-giao-du-toan-cho-chi-cuc-van-phong-cuc/dialog-chon-ke-hoach-phan-bo-giao-du-toan-cho-chi-cuc-van-phong-cuc.component';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import * as uuid from "uuid";
import { MESSAGE } from '../../../../../constants/message';
import { DanhMucHDVService } from '../../../../../services/danhMucHDV.service';
import { DONVITIEN, TRANGTHAIPHANBO, Utils } from "../../../../../Utility/utils";

export class ItemData {
  tenLoaiKhoan!: string;
  maNdung!: string;
  uocThien!: number;
  dtoanGiao!: number;
  dtoanDaPbo!: number;
  pboChoCacDvi!: number;
  checked!:boolean;
  id!: any;
}

@Component({
  selector: 'app-nhap-quyet-dinh-cua-tong-cuc-va-phan-bo-cho-cac-don-vi',
  templateUrl: './nhap-quyet-dinh-cua-tong-cuc-va-phan-bo-cho-cac-don-vi.component.html',
  styleUrls: ['./nhap-quyet-dinh-cua-tong-cuc-va-phan-bo-cho-cac-don-vi.component.scss']
})
export class NhapQuyetDinhCuaTongCucVaPhanBoChoCacDonViComponent implements OnInit {
  maQdCha!: any;
  userInfo: any;
  errorMessage!: String;                      //
  ngayQd!: any;
  maNoiDungs: any = [];                         // danh muc noi dung
  maKhoanMucs:any = [];                          // danh muc nhom chi
  maChis:any = [];                          // danh muc loai chi
  donVis:any = [];                            // danh muc don vi
  lstCTietBCao: ItemData[] = [];              // list chi tiet bao cao
  id!: any;                                   // id truyen tu router
  lstFile: any = [];                          // list File de day vao api
  status: boolean = false;                    // trang thai an/ hien cua trang thai
  ngayNhap!: any;                             // ngay nhap
  nguoiNhap!: string;                         // nguoi nhap
  maDonViTao!: any;                           // ma don vi tao
  maBaoCao!: string;                          // ma bao cao
  namBaoCaoHienHanh!: any;                    // nam bao cao hien hanh
  trangThaiBanGhi: string = "1";              // trang thai cua ban ghi
  newDate = new Date();                       //
  fileToUpload!: File;                        // file tai o input
  listFile: File[] = [];                      // list file chua ten va id de hien tai o input
  fileUrl: any;                               // url
  listIdDelete: string = "";                  // list id delete

  statusBtnDel: boolean;                       // trang thai an/hien nut xoa
  statusBtnSave: boolean;                      // trang thai an/hien nut luu
  statusBtnApprove: boolean;                   // trang thai an/hien nut trinh duyet
  statusBtnTBP: boolean;                       // trang thai an/hien nut truong bo phan
  statusBtnLD: boolean;                        // trang thai an/hien nut lanh dao
  statusBtnGuiDVCT: boolean;                   // trang thai nut gui don vi cap tren
  statusBtnDVCT: boolean;                      // trang thai nut don vi cap tren
  statusBtnLDDC: boolean;                      // trang thai lanh dao dieu chinh
  statusBtnCopy: boolean;                      // trang thai copy
  statusBtnPrint: boolean;                     // trang thai print

  listIdFiles: string;                        // id file luc call chi tiet
  allChecked = false;                         // check all checkbox
  indeterminate = true;                       // properties allCheckBox
  editCache: { [key: string]: { edit: boolean; data: ItemData } } = {};     // phuc vu nut chinh
  fileList: NzUploadFile[] = []; // list file
  maCucDtnnKvucs: any = [];
  capDv:any;

  maNganSach!: any;
  maSoKBNN!:any;
  lanLapThu: number = 1;
  khoanMucs: any = [];
  soQd!: any;
  lyDoTuChoi!: any;
  nam!: any; // nam btc
  nguoiKyBTC!: any; // nguoi ky BTC
  veViec!: any; // ve viec
  ghiChu!: any; // ghi chu
  validateForm!: FormGroup;
  soQdCha: any;
  ngayQdCha: any;
  namQdCha: any;
  loaiQd: string;
  trangThaiPbos: any []= TRANGTHAIPHANBO
  nguoiKys: any [] = [
    {maNguoiKy: "111", tenNguoiKy: "Đoàn Minh Vương"},
    {maNguoiKy: "112", tenNguoiKy: "Nguyễn Thành Công"},
    {maNguoiKy: "113", tenNguoiKy: "Nguyễn Xuân Hùng"},
    {maNguoiKy: "114", tenNguoiKy: "Vú Anh Tuấn"},
  ]
  maNguoiKyTC: any
  trangThaiPbo: any;
  matrangThaiPbo: any;
  maNguoiKyBTC: any;
  tongPBoChoDviTT: number;
  tongDuToanPb: number;
  tongUocTHien: number;
  tongDuToanGiao: any;
  maDviTien: any;
  donViTiens: any = DONVITIEN;
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
              private modal: NzModalService,
              private fb:FormBuilder,
              ) {
                this.ngayNhap = this.datePipe.transform(this.newDate, Utils.FORMAT_DATE_STR)
              }


  async ngOnInit() {
    this.validateForm = this.fb.group({
      nam: [null, [Validators.required,Validators.pattern('^[12][0-9]{3}$')]],
    });
    this.id = this.routerActive.snapshot.paramMap.get('id');
    let userName = this.userService.getUserName();
    await this.getUserInfo(userName); //get user info
    if (this.id) {
      await this.getDetailReport();
    } else {
      this.maDonViTao != null &&
      // this.maLoaiBaoCao != null &&
      this.namBaoCaoHienHanh != null
    }

    //lay danh sach danh muc don vi
    await this.danhMucService.dMDonVi().toPromise().then(
      (data) => {
        if (data.statusCode == 0) {
          this.donVis = data.data;
          this.maCucDtnnKvucs = this.donVis.filter(item => item.capDvi === '2');
          console.log(this.maCucDtnnKvucs);
          // let Dvi = this.donVis.find(e => e.maDvi == this.maDonViTao);
          // this.capDv = Dvi?.capDvi;
          // if (this.capDv == '2') {
          //   this.checkDv = false;
          // } else {
          //   this.checkDv = true;
          // }
        } else {
          this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
        }
      },
      (err) => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
    );


    //lay danh sach danh muc don vi
  this.danhMucService.dMNoiDung().toPromise().then(
    (data) => {
      if (data.statusCode == 0) {
        this.maNoiDungs = data.data?.content;
      } else {
        this.notification.error(MESSAGE.ERROR, data?.msg);
      }
    },
    (err) => {
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  );
  // lay danh muc loai chi
  this.danhMucService.dMLoaiChi().toPromise().then(
    (data) => {
      if (data.statusCode == 0) {
        this.maChis = data.data?.content;
      } else {
        this.notification.error(MESSAGE.ERROR, data?.msg);
      }
    },
    (err) => {
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  );

    // lay danh muc khoan muc
  this.danhMucService.dMKhoanMuc().toPromise().then(
    (data) => {
      if (data.statusCode == 0) {
        this.maKhoanMucs = data.data?.content;
      } else {
        this.notification.error(MESSAGE.ERROR, data?.msg);
      }
    },
    (err) => {
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  );
    this.getStatusButton();
    this.spinner.hide();
  }

  getStatusButton() {

    let checkParent = false;
    let checkChirld = false;
    let dVi = this.donVis.find(e => e.maDvi == this.maDonViTao);
    if (dVi && dVi.maDvi == this.userInfo.dvql) {
      checkChirld = true;
    }
    if (dVi && dVi.parent?.maDvi == this.userInfo.dvql) {
      checkParent = true;
    }

    const utils = new Utils();
    this.statusBtnDel = utils.getRoleDel(this.trangThaiBanGhi, checkChirld, this.userInfo?.roles[0]?.id);
    this.statusBtnSave = utils.getRoleSave(this.trangThaiBanGhi, checkChirld, this.userInfo?.roles[0]?.id);
    this.statusBtnApprove = utils.getRoleApprove(this.trangThaiBanGhi, checkChirld, this.userInfo?.roles[0]?.id);
    this.statusBtnTBP = utils.getRoleTBP(this.trangThaiBanGhi, checkChirld, this.userInfo?.roles[0]?.id);
    this.statusBtnLD = utils.getRoleLD(this.trangThaiBanGhi, checkChirld, this.userInfo?.roles[0]?.id);
    this.statusBtnGuiDVCT = utils.getRoleGuiDVCT(this.trangThaiBanGhi, checkChirld, this.userInfo?.roles[0]?.id);
    this.statusBtnDVCT = utils.getRoleDVCT(this.trangThaiBanGhi, checkParent, this.userInfo?.roles[0]?.id);
    this.statusBtnLDDC = utils.getRoleLDDC(this.trangThaiBanGhi, checkChirld, this.userInfo?.roles[0]?.id);
    this.statusBtnCopy = utils.getRoleCopy(this.trangThaiBanGhi, checkChirld, this.userInfo?.roles[0]?.id);
    this.statusBtnPrint = utils.getRolePrint(this.trangThaiBanGhi, checkChirld, this.userInfo?.roles[0]?.id);
  }

  //get user info
  async getUserInfo(username: string) {
    let userInfo = await this.userService.getUserInfo(username).toPromise().then(
      (data) => {
        if (data?.statusCode == 0) {
          this.userInfo = data?.data
          return data?.data;
        } else {
          this.notification.error(MESSAGE.ERROR, data?.msg);
        }
      },
      (err) => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
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
      lstCtiet: this.lstCTietBCao,
      loaiQd: this.loaiQd = "2",
      lyDoTuChoi: this.lyDoTuChoi,
      maDvi: this.maDonViTao,
      maDviTien: this.maDviTien,
      maNguoiKy: this.maNguoiKyTC,
      maQdCha: this.maQdCha,
      nam: this.nam,
      ngayQD: this.ngayQd,
      soQd: this.soQd,
      trangThai: "1",
      veViec: this.veViec,
      ghiChu:this.ghiChu,
      trangThaiPbo: "1"

    };

    //call service them moi
    this.spinner.show();
    if (this.id == null) {
      this.quanLyVonPhiService.trinhDuyetGiaoService(request).subscribe(
        data => {
          if (data.statusCode == 0) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.SUCCESS);
          } else {
            this.notification.error(MESSAGE.ERROR, data?.msg);
          }
        },
        err => {
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
          console.log(err);
        },
      );
    } else {
      this.quanLyVonPhiService.updatelist(request).subscribe(res => {
        if (res.statusCode == 0) {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.SUCCESS);
        } else {
          this.notification.error(MESSAGE.ERROR, res?.msg);
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
    this.updateEditCache();
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
    this.quanLyVonPhiService.approve(requestGroupButtons).subscribe((data) => {
      if (data.statusCode == 0) {
        this.getDetailReport();
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

    await this.quanLyVonPhiService.chiTietPhanBo(this.id).toPromise().then(
      (data) => {
        if (data.statusCode == 0) {

          let requestReport = {
            id:data.data.lstCtiet[0].maNdung,
          };

          this.quanLyVonPhiService.timDanhSachBCGiaoBTCPD1().toPromise().then(
            (data) => {
              if (data.statusCode == 0) {
                var tempArr = data.data;
                tempArr.forEach(e =>{
                  this.maKhoanMucs.push(e);
                  e.lstQlnvDmKhoachVonPhi.forEach( el => {
                    this.maKhoanMucs.push(el);
                    console.log(this.maKhoanMucs);
                  })
                })
              } else {
                this.notification.error(MESSAGE.ERROR, data?.msg);
              }
            },
            (err) => {
              this.notification.error(MESSAGE.ERROR, err?.msg);
            }
          );

          this.lstCTietBCao = data.data.lstCtiet;


          // this.lstFile = data.data.lstFile;
          // // set thong tin chung bao cao
          // this.ngayNhap = data.data.ngayTao;
          // this.nguoiNhap = data.data.nguoiTao;
          // this.maDonViTao = data.data.maDvi;
          // this.maBaoCao = data.data.maBcao;
          // this.namBaoCaoHienHanh = data.data.namBcao;
          // this.trangThaiBanGhi = data.data.trangThai;

          // set list id file ban dau
          this.lstFile.filter(item => {
            this.listIdFiles += item.id + ",";
          })

          if (this.trangThaiBanGhi == '1' || this.trangThaiBanGhi == '3' || this.trangThaiBanGhi == '5' || this.trangThaiBanGhi == '8') {
            this.status = false;
          } else {
            this.status = true;
          }
          this.updateEditCache();
        } else {
          this.notification.error(MESSAGE.ERROR, data?.msg);
        }
      },
      (err) => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
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
      if(item.checked == true && typeof item.id == "number"){
        this.listIdDelete += item.id + ","
      }
    })
    // delete object have checked = true
    this.lstCTietBCao = this.lstCTietBCao.filter(item => item.checked != true )
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
    this.router.navigate(['/kehoach/chi-tieu-ke-hoach-nam-cap-tong-cuc']);
  }

  // lay ten trang thai
  getStatusName(){
    const utils = new Utils();
    return utils.getStatusName(this.trangThaiBanGhi);
  }

  // lay ten don vi tao
  getUnitName(){
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
    this.changeTong(id)
    this.tinhTong1()
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

  redirectQLGiaoDTChi() {
    this.router.navigate(['/qlkh-von-phi/quan-ly-giao-du-toan-chi-nsnn']);
  }

  addKmuc() {
    var danhSach = this.khoanMucs
    var maQdCha = this.maQdCha
    var maDvi = this.maDonViTao
    var soQdCha = this.soQdCha
    var ngayQdCha = this.ngayQdCha
    var namQdCha = this.namQdCha
    var maNguoiKyBTC = this.maNguoiKyBTC
    var matrangThaiPbo = this.matrangThaiPbo
    var maDviTien = this.maDviTien
    const modalIn = this.modal.create({
         nzTitle: 'Danh sách khoản mục',
         nzContent: DialogChonKeHoachPhanBoGiaoDuToanChoChiCucVanPhongCucComponent,
         nzMaskClosable: false,
         nzClosable: false,
         nzWidth: '600px',
         nzFooter: null,
         nzComponentParams: {
              danhSachKhoanMuc: danhSach,
              maQdCha: maQdCha,
              maDvi: maDvi,
              soQdCha: soQdCha,
              ngayQdCha: ngayQdCha,
              namQdCha: namQdCha,
              maNguoiKyBTC: maNguoiKyBTC,
              matrangThaiPbo: matrangThaiPbo,
              maDviTien: maDviTien
         },
    });
    modalIn.afterClose.subscribe((res) => {
        this.maQdCha = res.maQdCha
        this.maDonViTao = res.maDvi
        this.soQdCha = res.soQdCha
        this.ngayQdCha = res.ngayQdCha
        this.namQdCha = res.namQdCha
        this.nguoiKyBTC = res.nguoiKyBTC
        this.matrangThaiPbo = res.matrangThaiPbo
        this.maNguoiKyBTC = res.maNguoiKyBTC
        this.maDviTien = res.maDviTien
        this.changeMaCucKhuVuc(res.maDvi)
        // this.changeDonViTien()
        console.log(this.maDviTien);

        this.changeTrangThaiPbo()
        this.changeNguoiKy()
         if (res) {
              res.danhSachKhoanMuc.forEach(item => {
                this.lstCTietBCao.push({
                      id: uuid.v4(),
                      tenLoaiKhoan: item.tenLoaiKhoan,
                      maNdung: item.maNdung,
                      uocThien: item.uocThien,
                      dtoanGiao: item.dtoanGiao,
                      dtoanDaPbo: item.dtoanDaPbo,
                      pboChoCacDvi: item.pboChoCacDvi,
                      checked: false,
                });
              })
              let requestReport = {
                id: this.lstCTietBCao[0].maNdung,
              };
              this.quanLyVonPhiService.timDanhSachBCGiaoBTCPD().toPromise().then(
                (data) => {
                  if (data.statusCode == 0) {
                    var tempArr = data.data;
                    tempArr.forEach(e =>{
                      this.maKhoanMucs.push(e);
                      e.lstQlnvDmKhoachVonPhi.forEach( el => {
                        this.maKhoanMucs.push(el);
                      })
                    })
                  } else {
                    this.notification.error(MESSAGE.ERROR, data?.msg);
                  }
                },
                (err) => {
                  this.notification.error(MESSAGE.ERROR, err?.msg);
                }
              );
              this.tinhTong1()
              this.updateEditCache();
         }
    });
}

  getNameContent(id: any):string{
    return this.maKhoanMucs.find( item => item.id ==id )?.thongTin;
  }
  changeMaCucKhuVuc(maDvi: any) {
    this.maCucDtnnKvucs.forEach(e => {
      if (maDvi == e.maDvi) {
        this.maNganSach = e.maNsnn;
        this.maSoKBNN = e.maKbnn;
      }
    });
  }
  changeTrangThaiPbo(){
    this.trangThaiPbos.forEach(e => {
      if(this.matrangThaiPbo == e.id){
        this.trangThaiPbo = e.ten
      }
    })
  }
    changeNguoiKy(){
    this.nguoiKys.forEach(e => {
      if(this.maNguoiKyBTC == e.maNguoiKy){
        this.nguoiKyBTC = e.tenNguoiKy
      }
    })
  }
  // changeDonViTien(){
  //   this.donViTiens.forEach(e => {
  //     if(this.maDviTien == e.id){
  //       console.log(this.maDviTien);
  //     }
  //   })
  // }

  changeTong(id: string): void {
    this.editCache[id].data.dtoanGiao = this.editCache[id].data.dtoanDaPbo + this.editCache[id].data.pboChoCacDvi
  }
  tinhTong1(){
    this.tongUocTHien = 0
    this.tongDuToanPb = 0
    this.tongPBoChoDviTT = 0
    this.lstCTietBCao.forEach(e => {
      this.tongUocTHien += e.uocThien;
      this.tongDuToanPb += e.dtoanDaPbo;
      this.tongPBoChoDviTT += e.pboChoCacDvi
      this.tongDuToanGiao= this.tongDuToanPb + this.tongPBoChoDviTT;
    })
  }
}
