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
import { LA_MA } from '../../../quan-ly-dieu-chinh-du-toan-chi-nsnn/quan-ly-dieu-chinh-du-toan-chi-nsnn.constant';

export class ItemData {
  uocThien!: number;
  dtoanGiao!: number;
  dtoanDaPbo!: number;
  pboChoCacDvi!: number;
  maKhoanMuc!: number;
  lstKm: any[];
  status: boolean;
  id!: any;
  tenLoaiKhoan!: string;
  checked!: boolean;
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

  lstKhoanMuc: any[] ;

  soLaMa: any[] = LA_MA;

  initItem: ItemData = {
    dtoanDaPbo: 0,
    dtoanGiao: 0,
    pboChoCacDvi: 0,
    uocThien: 0,
    maKhoanMuc: 0,
    lstKm: [],
    status: false,
    id: null,
    tenLoaiKhoan: "0",
    checked: false,
  };

  vt: number;
  stt: number;
  kt: boolean;
  disable: boolean = false;
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
    let userInfo: any = await this.getUserInfo(userName); //get user info
    if (this.id) {
      await this.quanLyVonPhiService.timDanhSachBCGiaoBTCPD1().toPromise().then(
        (data) => {
          if (data.statusCode == 0) {
            this.lstKhoanMuc = data.data;
          } else {
            this.notification.error(MESSAGE.ERROR, data?.msg);
          }

        },
        (err) => {
          this.notification.error(MESSAGE.ERROR, err?.msg);
        }
      );
      await this.getDetailReport();
    } else {

      this.maDonViTao = userInfo?.dvql;
      this.namBaoCaoHienHanh != null
    }

    //lay danh sach danh muc don vi
    await this.danhMucService.dMDonVi().toPromise().then(
      (data) => {
        if (data.statusCode == 0) {
          this.donVis = data.data;
          this.maCucDtnnKvucs = this.donVis.filter(item => item.capDvi === '2');
          console.log(this.maCucDtnnKvucs);
          let Dvi = this.donVis.find(e => e.maDvi == this.maDonViTao);
          this.capDv = Dvi?.capDvi;

        } else {
          this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
        }
      },
      (err) => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
    );


    //lay danh sach danh muc don vi
    await this.danhMucService.dMNoiDung().toPromise().then(
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
  await this.danhMucService.dMLoaiChi().toPromise().then(
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
    await this.danhMucService.dMKhoanMuc().toPromise().then(
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

  await this.quanLyVonPhiService.timDanhSachBCGiaoBTCPD1().toPromise().then(
    (data) => {
      if (data.statusCode == 0) {
        this.lstKhoanMuc = data.data;
      } else {
        this.notification.error(MESSAGE.ERROR, data?.msg);
      }

    },
    (err) => {
      this.notification.error(MESSAGE.ERROR, err?.msg);
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
    this.statusBtnDel = utils.getRoleDel(this.trangThaiBanGhi, checkChirld, this.userInfo?.roles[0]?.code);
    this.statusBtnSave = utils.getRoleSave(this.trangThaiBanGhi, checkChirld, this.userInfo?.roles[0]?.code);
    this.statusBtnApprove = utils.getRoleApprove(this.trangThaiBanGhi, checkChirld, this.userInfo?.roles[0]?.code);
    this.statusBtnTBP = utils.getRoleTBP(this.trangThaiBanGhi, checkChirld, this.userInfo?.roles[0]?.code);
    this.statusBtnLD = utils.getRoleLD(this.trangThaiBanGhi, checkChirld, this.userInfo?.roles[0]?.code);
    this.statusBtnGuiDVCT = utils.getRoleGuiDVCT(this.trangThaiBanGhi, checkChirld, this.userInfo?.roles[0]?.code);
    this.statusBtnDVCT = utils.getRoleDVCT(this.trangThaiBanGhi, checkParent, this.userInfo?.roles[0]?.code);
    this.statusBtnLDDC = utils.getRoleLDDC(this.trangThaiBanGhi, checkChirld, this.userInfo?.roles[0]?.code);
    this.statusBtnCopy = utils.getRoleCopy(this.trangThaiBanGhi, checkChirld, this.userInfo?.roles[0]?.code);
    this.statusBtnPrint = utils.getRolePrint(this.trangThaiBanGhi, checkChirld, this.userInfo?.roles[0]?.code);
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
      if (item.id?.length == 38) {
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
      soQd: this.soQd + "/QĐ-TC",
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
        item.id = uuid.v4()+'FE';
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
          this.lstCTietBCao = data.data.lstCtiet;
          this.sortByIndex()
          this.updateEditCache();
          this.lstFile = data.data.fileDinhKems;
					this.listFile = [];

          // set thong tin chung bao cao
          this.ngayQd = data.data?.ngayQD;
          this.maNguoiKyTC = data.data?.maNguoiKy;
          this.nguoiKyBTC = data.data?.qdCha.maNguoiKy;
          this.maDonViTao = data.data?.maDvi;
          this.maBaoCao = data.data?.maBcao;
          this.soQd = data.data?.soQd;
          this.soQd = this.soQd.replace('/QĐ-TC', '')
          this.trangThaiBanGhi = data.data?.trangThai;
          this.ghiChu = data.data?.ghiChu;
          this.veViec = data.data?.veViec;
          this.maDviTien = data.data?.maDviTien
          this.soQdCha = data.data?.qdCha.soQd
          this.soQdCha = this.soQdCha.replace('/QĐ-BTC', '')
          this.namQdCha = data.data?.qdCha.nam
          this.nam = data.data.nam
          this.ngayQdCha = this.datePipe.transform(data.data?.qdCha.ngayQd, Utils.FORMAT_DATE_STR)
          this.changeNguoiKy();
            this.maCucDtnnKvucs.forEach(e => {
              if (this.maDonViTao == e.maDvi) {
                this.maNganSach = e.maNsnn;
                this.maSoKBNN = e.maKbnn;
              }
            });
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
    if (id?.length == 36) {
      this.listIdDelete += id + ",";
    }
  }

  // xóa với checkbox
  deleteSelected() {
    // add list delete id
    this.lstCTietBCao.filter(item => {
      if(item.checked == true && item?.id?.length == 36){
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

  redirectQLGiaoDTChi() {
    this.router.navigate(['/qlkh-von-phi/quan-ly-giao-du-toan-chi-nsnn']);
  }

  async addKmuc() {
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
        this.soQdCha = this.soQdCha.replace('/QĐ-BTC', '')
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
              this.quanLyVonPhiService.timDanhSachBCGiaoBTCPD1().toPromise().then(
                (data) => {
                  if (data.statusCode == 0) {
                    this.lstKhoanMuc = data.data;
                  } else {
                    this.notification.error(MESSAGE.ERROR, data?.msg);
                  }

                },
                (err) => {
                  this.notification.error(MESSAGE.ERROR, err?.msg);
                }
              );
              this.lstCTietBCao = res.danhSachKhoanMuc
              this.sortByIndex()
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
    var start: number = this.lstCTietBCao.findIndex(e => e.tenLoaiKhoan == str);
    var index: number = start;
    for (var i = start + 1; i < this.lstCTietBCao.length; i++) {
        if (this.lstCTietBCao[i].tenLoaiKhoan.startsWith(str)) {
            index = i;
        }
    }
    return index;
}
//thay thế các stt khi danh sách được cập nhật, heSo=1 tức là tăng stt lên 1, heso=-1 là giảm stt đi 1
replaceIndex(lstIndex: number[], heSo: number) {
    //thay doi lai stt cac vi tri vua tim duoc
    lstIndex.forEach(item => {
        var str = this.getHead(this.lstCTietBCao[item].tenLoaiKhoan) + "." + (this.getTail(this.lstCTietBCao[item].tenLoaiKhoan) + heSo).toString();
        var nho = this.lstCTietBCao[item].tenLoaiKhoan;
        this.lstCTietBCao.forEach(item => {
            item.tenLoaiKhoan = item.tenLoaiKhoan.replace(nho, str);
        })
    })
}
//thêm ngang cấp
addSame(id: any, initItem: ItemData) {
    var index: number = this.lstCTietBCao.findIndex(e => e.id === id); // vi tri hien tai
    var head: string = this.getHead(this.lstCTietBCao[index].tenLoaiKhoan); // lay phan dau cua so tt
    var tail: number = this.getTail(this.lstCTietBCao[index].tenLoaiKhoan); // lay phan duoi cua so tt
    var ind: number = this.findVt(this.lstCTietBCao[index].tenLoaiKhoan); // vi tri can duoc them
    // tim cac vi tri can thay doi lai stt
    let lstIndex: number[] = [];
    for (var i = this.lstCTietBCao.length - 1; i > ind; i--) {
        if (this.getHead(this.lstCTietBCao[i].tenLoaiKhoan) == head) {
            lstIndex.push(i);
        }
    }
    this.replaceIndex(lstIndex, 1);
    // them moi phan tu
    if (initItem.id) {
        let item: ItemData = {
            ...initItem,
            tenLoaiKhoan: head + "." + (tail + 1).toString(),
        }
        this.lstCTietBCao.splice(ind + 1, 0, item);
        this.editCache[item.id] = {
            edit: false,
            data: { ...item }
        };
    } else {
        let item: ItemData = {
            ...initItem,
            id: uuid.v4() + 'FE',
            tenLoaiKhoan: head + "." + (tail + 1).toString(),
            lstKm: this.lstCTietBCao[index].lstKm,
        }
        this.lstCTietBCao.splice(ind + 1, 0, item);
        this.editCache[item.id] = {
            edit: true,
            data: { ...item }
        };
    }
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
//thêm cấp thấp hơn
addLow(id: any, initItem: ItemData) {
    var index: number = this.lstCTietBCao.findIndex(e => e.id === id); // vi tri hien tai
    //list các vị trí cần thay đôi lại stt
    let lstIndex: number[] = [];
    for (var i = this.lstCTietBCao.length - 1; i > index; i--) {
        if (this.getHead(this.lstCTietBCao[i].tenLoaiKhoan) == this.lstCTietBCao[index].tenLoaiKhoan) {
            lstIndex.push(i);
        }
    }
    this.replaceIndex(lstIndex, 1);
    // them moi phan tu
    if (initItem.id) {
        let item: ItemData = {
            ...initItem,
            tenLoaiKhoan: this.lstCTietBCao[index].tenLoaiKhoan + ".1",
        }
        this.lstCTietBCao.splice(index + 1, 0, item);
        this.editCache[item.id] = {
            edit: false,
            data: { ...item }
        };
    } else {
        let item: ItemData = {
            ...initItem,
            id: uuid.v4() + 'FE',
            lstKm: this.lstKhoanMuc.filter(e => e.idCha == this.lstCTietBCao[index].maKhoanMuc),
            tenLoaiKhoan: this.lstCTietBCao[index].tenLoaiKhoan + ".1",
        }
        this.lstCTietBCao.splice(index + 1, 0, item);

        this.editCache[item.id] = {
            edit: true,
            data: { ...item }
        };
    }
}
//xóa dòng
deleteLine(id: any) {
    var index: number = this.lstCTietBCao.findIndex(e => e.id === id); // vi tri hien tai
    var nho: string = this.lstCTietBCao[index].tenLoaiKhoan;
    var head: string = this.getHead(this.lstCTietBCao[index].tenLoaiKhoan); // lay phan dau cua so tt
    //xóa phần tử và con của nó
    this.lstCTietBCao = this.lstCTietBCao.filter(e => !e.tenLoaiKhoan.startsWith(nho));
    //update lại số thức tự cho các phần tử cần thiết
    let lstIndex: number[] = [];
    for (var i = this.lstCTietBCao.length - 1; i >= index; i--) {
        if (this.getHead(this.lstCTietBCao[i].tenLoaiKhoan) == head) {
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
    const index = this.lstCTietBCao.findIndex(item => item.id === id);
    if (!this.lstCTietBCao[index].maKhoanMuc) {
        this.deleteLine(id);
        return;
    }
    // lay vi tri hang minh sua
    this.editCache[id] = {
        data: { ...this.lstCTietBCao[index] },
        edit: false
    };
}

// luu thay doi
saveEdit(id: string): void {
    this.editCache[id].data.checked = this.lstCTietBCao.find(item => item.id === id).checked; // set checked editCache = checked lstCTietBCao
    if (this.lstKhoanMuc.findIndex(e => e.idCha == this.editCache[id].data.maKhoanMuc) != -1) {
        this.editCache[id].data.status = true;
    }
    const index = this.lstCTietBCao.findIndex(item => item.id === id); // lay vi tri hang minh sua
    Object.assign(this.lstCTietBCao[index], this.editCache[id].data); // set lai data cua lstCTietBCao[index] = this.editCache[id].data
    this.editCache[id].edit = false; // CHUYEN VE DANG TEXT
    this.tinhTong1()
}

updateChecked(id: any) {
  var data: ItemData = this.lstCTietBCao.find(e => e.id === id);
  //đặt các phần tử con có cùng trạng thái với nó
  this.lstCTietBCao.forEach(item => {
      if (item.tenLoaiKhoan.startsWith(data.tenLoaiKhoan)) {
          item.checked = data.checked;
      }
  })
  //thay đổi các phần tử cha cho phù hợp với tháy đổi của phần tử con
  var index: number = this.lstCTietBCao.findIndex(e => e.tenLoaiKhoan == this.getHead(data.tenLoaiKhoan));
  if (index == -1) {
      this.allChecked = this.checkAllChild('0');
  } else {
      var nho: boolean = this.lstCTietBCao[index].checked;
      while (nho != this.checkAllChild(this.lstCTietBCao[index].tenLoaiKhoan)) {
          this.lstCTietBCao[index].checked = !nho;
          index = this.lstCTietBCao.findIndex(e => e.tenLoaiKhoan == this.getHead(this.lstCTietBCao[index].tenLoaiKhoan));
          if (index == -1) {
              this.allChecked = !nho;
              break;
          }
          nho = this.lstCTietBCao[index].checked;
      }
  }
}
//kiểm tra các phần tử con có cùng được đánh dấu hay ko
checkAllChild(str: string): boolean {
    var nho: boolean = true;
    this.lstCTietBCao.forEach(item => {
        if ((this.getHead(item.tenLoaiKhoan) == str) && (!item.checked) && (item.tenLoaiKhoan != str)) {
            nho = item.checked;
        }
    })
    return nho;
}


updateAllChecked() {
    this.lstCTietBCao.forEach(item => {
        item.checked = this.allChecked;
    })
}

deleteAllChecked() {
    var lstId: any[] = [];
    this.lstCTietBCao.forEach(item => {
        if (item.checked) {
            lstId.push(item.id);
        }
    })
    lstId.forEach(item => {
        if (this.lstCTietBCao.findIndex(e => e.id == item) != -1) {
            this.deleteLine(item);
        }
    })
}
//thêm phần tử đầu tiên khi bảng rỗng
addFirst(initItem: ItemData) {
    if (initItem.id) {
        let item: ItemData = {
            ...initItem,
            tenLoaiKhoan: "0.1",
        }
        this.lstCTietBCao.push(item);
        this.editCache[item.id] = {
            edit: false,
            data: { ...item }
        };
    } else {
        let item: ItemData = {
            id: uuid.v4() + 'FE',
            maKhoanMuc: 0,
            lstKm: this.lstKhoanMuc.filter(e => e.idCha == 503),
            status: false,
            tenLoaiKhoan: "0.1",
            dtoanDaPbo: 0,
            dtoanGiao: 0,
            pboChoCacDvi: 0,
            uocThien: 0,
            checked: false,
        }
        this.lstCTietBCao.push(item);

        this.editCache[item.id] = {
            edit: true,
            data: { ...item }
        };
    }
}

sortByIndex() {

    this.lstCTietBCao.forEach(item => {
        this.setDetail(item.id);
    })
    this.lstCTietBCao.sort((item1, item2) => {
        if (item1.lstKm[0].levelDm > item2.lstKm[0].levelDm) {
            return -1;
        }
        if (item1.lstKm[0].levelDm < item2.lstKm[0].levelDm) {
            return 1;
        }
        if (this.getTail(item1.tenLoaiKhoan) > this.getTail(item2.tenLoaiKhoan)) {
            return 1;
        }
        if (this.getTail(item1.tenLoaiKhoan) < this.getTail(item2.tenLoaiKhoan)) {
            return -1;
        }
        return 0;
    });
    var lstTemp: any[] = [];
    this.lstCTietBCao.forEach(item => {
        var index: number = lstTemp.findIndex(e => e.stt == this.getHead(item.tenLoaiKhoan));
        if (index == -1) {
            lstTemp.splice(0, 0, item);
        } else {
            lstTemp.splice(index + 1, 0, item);
        }
    })

    this.lstCTietBCao = lstTemp;
}

setDetail(id: any) {
    var index: number = this.lstCTietBCao.findIndex(item => item.id === id);
    var parentId: number = this.lstKhoanMuc.find(e => e.id == this.lstCTietBCao[index].maKhoanMuc).idCha;
    this.lstCTietBCao[index].lstKm = this.lstKhoanMuc.filter(e => e.idCha == parentId);
    if (this.lstKhoanMuc.findIndex(e => e.idCha === this.lstCTietBCao[index].maKhoanMuc) == -1) {
        this.lstCTietBCao[index].status = false;
    } else {
        this.lstCTietBCao[index].status = true;
    }
}

sortWithoutIndex() {
    this.lstCTietBCao.forEach(item => {
        this.setDetail(item.id);
    })

    var level = 0;
    var lstCTietBCaoTemp: ItemData[] = this.lstCTietBCao;
    this.lstCTietBCao = [];
    var data: ItemData = lstCTietBCaoTemp.find(e => e.lstKm[0].levelDm == 0);
    this.addFirst(data);
    lstCTietBCaoTemp = lstCTietBCaoTemp.filter(e => e.id != data.id);
    var lstTemp: ItemData[] = lstCTietBCaoTemp.filter(e => e.lstKm[0].levelDm == level);
    while (lstTemp.length !=0 || level == 0){
        lstTemp.forEach(item => {
            var index: number = this.lstCTietBCao.findIndex(e => e.maKhoanMuc === item.lstKm[0].idCha);
            if (index != -1){
                this.addLow(this.lstCTietBCao[index].id, item);
            } else {
                index = this.lstCTietBCao.findIndex(e => e.lstKm[0].idCha === item.lstKm[0].idCha);
                this.addSame(this.lstCTietBCao[index].id, item);
            }
        })
        level += 1;
        lstTemp = lstCTietBCaoTemp.filter(e => e.lstKm[0].levelDm == level);
    }
}

}
