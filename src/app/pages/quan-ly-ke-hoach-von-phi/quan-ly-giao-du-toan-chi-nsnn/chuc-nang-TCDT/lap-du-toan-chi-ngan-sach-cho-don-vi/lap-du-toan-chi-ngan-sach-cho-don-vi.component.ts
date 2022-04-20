import { DatePipe, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import * as fileSaver from 'file-saver';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogChonThemKhoanMucQlGiaoDuToanChiNSNNComponent } from 'src/app/components/dialog/dialog-chon-them-khoan-muc-qd-giao-du-toan-chi-NSNN/dialog-chon-them-khoan-muc-qd-giao-du-toan-chi-NSNN.component';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import * as uuid from "uuid";
import { MESSAGE } from '../../../../../constants/message';
import { DanhMucHDVService } from '../../../../../services/danhMucHDV.service';
import { Utils } from "../../../../../Utility/utils";

export class ItemData {
  tenLoaiKhoan!: string;
  maNdung!: number;
  uocThien!: number;
  dtoanGiao!: number;
  dtoanDaPbo!: number;
  pboChoCacDvi!: number;
  ghiChu!: string;
  checked!:boolean;
  id!: any;
}

@Component({
  selector: 'app-lap-du-toan-chi-ngan-sach-cho-don-vi',
  templateUrl: './lap-du-toan-chi-ngan-sach-cho-don-vi.component.html',
  styleUrls: ['./lap-du-toan-chi-ngan-sach-cho-don-vi.component.scss']
})

export class LapDuToanChiNganSachChoDonViComponent implements OnInit {
  qDinhBTC!: any;
  userInfo: any;
  errorMessage!: String;                      //
  ngayQd!: any;
  maKhoanMucs:any = [];                          // danh muc nhom chi

  donVis:any = [];                            // danh muc don vi
  lstCTietBCao: ItemData[] = [];              // list chi tiet bao cao
  id!: any;                                   // id truyen tu router
  chiTietBcaos: any;                          // thong tin chi tiet bao cao
  lstFile: any = [];                          // list File de day vao api
  status: boolean = false;                    // trang thai an/ hien cua trang thai
  nam !: any;         // nam bao cao
  userName: any;                              // ten nguoi dang nhap
  ngayNhap!: any;                             // ngay nhap
  nguoiNhap!: string;                         // nguoi nhap
  maDonViTao!: any;                           // ma don vi tao
  maBaoCao!: string;                          // ma bao cao
  trangThaiBanGhi: string = "1";              // trang thai cua ban ghi
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


  allChecked = false;                         // check all checkbox
  indeterminate = true;                       // properties allCheckBox
  editCache: { [key: string]: { edit: boolean; data: ItemData } } = {};     // phuc vu nut chinh

  fileList: NzUploadFile[] = [];
  maCucDtnnKvucs: any = [];
  capDv:any;

  maNganSach!: any;
  maSoKBNN!:any;
  lanLapThu!: number;
  tongCong: ItemData = {
    id: "",
    tenLoaiKhoan: "",
    maNdung: 0,
    uocThien: 0,
    dtoanGiao: 0,
    dtoanDaPbo: 0,
    pboChoCacDvi: 0,
    ghiChu: "",
    checked: true,
  };
  khoanMucs: any = [];
  qDinhBTCs: any = [];
  ghiChu!: any
  loaiQd!: any;
  lyDoTuChoi!: any;
  maQdCha!: any;
  noiQd!: any;
  tenDvi!: any;
  veViec!: any;
  soQd!: any;
  vanBan!: any;
  nguoiKy!: any;
  validateForm!: FormGroup;
  messageValidate:any =MESSAGEVALIDATE;
  noiDung: any;

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
              private sanitizer: DomSanitizer,
              private danhMucService: DanhMucHDVService,
              private userService: UserService,
              private notification: NzNotificationService,
              private modal: NzModalService,
              private location: Location,
              private datePipe: DatePipe,
              private fb:FormBuilder,
              ) {
                // this.ngayNhap =  this.datePipe.transform(this.newDate, Utils.FORMAT_DATE_STR)
              }


  async ngOnInit() {
    this.validateForm = this.fb.group({
      nam: [null, [Validators.required,Validators.pattern('^[12][0-9]{3}$')]],
      temp: [null],
    });
    this.id = this.routerActive.snapshot.paramMap.get('id');
    let userName = this.userService.getUserName();
    let userInfo: any = await this.getUserInfo(userName); //get user info
    if (this.id) {
      await this.getDetailReport();
    } else {
      this.trangThaiBanGhi = "1";
      this.nguoiNhap = userInfo?.username;
      this.maDonViTao = userInfo?.dvql;
      this.spinner.show();
      this.maBaoCao = '';
      // this.nam = new Date().getFullYear();
      this.lanLapThu = 1
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


    //lay danh sach danh muc don vi
    this.danhMucService.dMDonVi().toPromise().then(
      (data) => {
        if (data.statusCode == 0) {
          this.donVis = data.data;
          var Dvi = this.donVis.find(e =>  e.maDvi == this.maDonViTao);
          this.capDv = Dvi.capDvi;

          this.maCucDtnnKvucs = this.donVis.filter(item => item.capDvi === '2');



        } else {
          this.notification.error(MESSAGE.ERROR, data?.msg);
        }
      },
      (err) => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
    );

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
  this.danhMucService.dmQuyetDinhBTC().toPromise().then(
      (data) => {
        if (data.statusCode == 0) {
          let qDinhCuaBtc = data.data
          // this.qDinhBTCs = data;
          qDinhCuaBtc.forEach(e => {
            this.qDinhBTCs.push(e)
          })
        } else {
          this.notification.error(MESSAGE.ERROR, data?.msg);
        }
      },
      (err) => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
  )

    this.spinner.hide();
  }

  changeQdinhBTC(id: any){
    this.qDinhBTCs.forEach(e => {
      if(id == e.id){
        this.ngayNhap =  this.datePipe.transform(e.ngayQd, Utils.FORMAT_DATE_STR)
      }
    })
  }

  changeMaCucKhuVuc(maDvi: any){
    this.maCucDtnnKvucs.forEach(e => {
      if(maDvi == e.maDvi){
        this.maNganSach = e.maNsnn;
        this.maSoKBNN = e.maKbnn;
      }
    });
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
      maDviTien: "01",
      maNguoiKy: this.nguoiKy,
      maQdCha: this.maQdCha,
      nam: this.nam,
      ngayQD: this.ngayQd,
      // noiDung: "1",
      noiQd: this.noiQd,
      soQd: this.soQd,
      tenDvi: this.tenDvi,
      trangThai: "1",
      vanBan: this.vanBan,
      veViec: this.veViec,
      noiDung: this.noiDung,
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
        },
      );
    } else {
      this.quanLyVonPhiService.updatelistGiaoDuToan(request).subscribe(res => {
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
    debugger
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
    await this.quanLyVonPhiService.bCLapThamDinhDuToanChiTiet(this.id).toPromise().then(
      (data) => {
        if (data.statusCode == 0) {
          this.chiTietBcaos = data.data;
          this.lstCTietBCao = data.data.lstCTietBCao;
          this.updateEditCache();
          this.lstFile = data.data.lstFile;

          // set thong tin chung bao cao
          this.ngayNhap = data.data.ngayTao;
          this.nguoiNhap = data.data.nguoiTao;
          this.maDonViTao = data.data.maDvi;
          this.maBaoCao = data.data.maBcao;
          this.nam = data.data.nam;
          this.trangThaiBanGhi = data.data.trangThai;
          this.lanLapThu = data.data.lanLapThu

          // set list id file ban dau
          this.lstFile.filter(item => {
            this.listIdFiles += item.id + ",";
          })

          if (this.trangThaiBanGhi == '1' || this.trangThaiBanGhi == '3' || this.trangThaiBanGhi == '5' || this.trangThaiBanGhi == '8') {
            this.status = false;
          } else {
            this.status = true;
          }
          var idDanhMuc  = this.lstCTietBCao[0].maNdung;
          let requestReport = {
            id: idDanhMuc,
          };

          this.danhMucService.dMKhoanMuc().toPromise().then(
            (data) => {
              if (data.statusCode == 0) {
                this.khoanMucs = data.data?.content;
              } else {
                this.notification.error(MESSAGE.ERROR, data?.msg);
              }
            },
            (err) => {
              this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
            }
          );

          this.quanLyVonPhiService.timDanhSachBCGiaoBTCPD(requestReport).toPromise().then(res => {
            if (data.statusCode == 0) {
              var tempArr = res.data;
              tempArr.forEach(e =>{
                this.khoanMucs.push(e);
                e.lstQlnvDmKhoachVonPhi.forEach( el => {
                this.khoanMucs.push(el);
                })
              })
              this.khoanMucs.forEach(e => {
                this.lstCTietBCao.push(e)
              })
            } else {
              this.notification.error(MESSAGE.ERROR, data?.msg);
            }
           })
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
    // this.router.navigate(['/qlkh-von-phi/quan-ly-giao-du-toan-chi-nsnn']);
    this.location.back()
  }

  //gia tri cac o input thay doi thi tinh toan lai
  // changeModel(id: string): void {
  //   this.editCache[id].data.clechTranChiVsNcauN1 = Number(this.editCache[id].data.ncauChiCuaDviN1) - Number(this.editCache[id].data.tranChiDuocTbN1);
  //   this.editCache[id].data.clechTranChiVsNcauN2 = Number(this.editCache[id].data.ncauChiCuaDviN2) - Number(this.editCache[id].data.tranChiDuocTbN2);
  //   this.editCache[id].data.clechTranChiVsNcauN3 = Number(this.editCache[id].data.ncauChiCuaDviN3) - Number(this.editCache[id].data.tranChiDuocTbN3);
  // }


  addKmuc() {
    // KHOANMUCLIST.forEach(item => item.status = false);
    // .filter(item => this.lstCTietBCao?.findIndex(data => data.maNdung == item.maKmuc) == -1);
    var danhSach = this.khoanMucs
    const modalIn = this.modal.create({
         nzTitle: 'Danh sách khoản mục',
         nzContent: DialogChonThemKhoanMucQlGiaoDuToanChiNSNNComponent,
         nzMaskClosable: false,
         nzClosable: false,
         nzWidth: '600px',
         nzFooter: null,
         nzComponentParams: {
              danhSachKhoanMuc: danhSach
         },
    });
    modalIn.afterClose.subscribe((res) => {
         if (res) {
           this.maKhoanMucs.forEach(e => {
             if(res.id == e.id){
                this.khoanMucs.push({id: e.id, thongTin: e.thongTin})
                return res.id = e.id
                }
           })
          this.lstCTietBCao.push({
            id: uuid.v4(),
            tenLoaiKhoan: "I",
            maNdung: res.id,
            uocThien: 0,
            dtoanGiao: 0,
            dtoanDaPbo: 0,
            pboChoCacDvi: 0,
            ghiChu: "",
            checked: false,
       });
              res.danhSachKhoanMuc.forEach(item => {
                   if (item.status) {
                        this.lstCTietBCao.push({
                             id: uuid.v4(),
                             tenLoaiKhoan: item.tenDm,
                             maNdung: item.id,
                             uocThien: 0,
                             dtoanGiao: 0,
                             dtoanDaPbo: 0,
                             pboChoCacDvi: 0,
                             ghiChu: "",
                             checked: false,
                        });
                   }
              })
              this.updateEditCache();
         }
    });
}

  changeTong(id: string): void {
    let index = this.lstCTietBCao.findIndex(item => item.id == id);
    // this.editCache[id].data.tong = this.editCache[id].data.nguonNsnn + this.editCache[id].data.nguonKhac;
    // this.lstCTietBCao.forEach(e => {
    //   this.editCache[id].data.tong = e[index].tong;
    // })
  }

  nhapQdTongCuc(){
    this.router.navigate(['/qlkh-von-phi/quan-ly-giao-du-toan-chi-nsnn/nhap-quyet-dinh-cua-tong-cuc-va-phan-bo-cho-cac-don-vi']);
  }
}

