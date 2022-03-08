import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as uuid from "uuid";
import { DanhMucService } from '../../../../../services/danhMuc.service';
import { DatePipe } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { DomSanitizer } from '@angular/platform-browser';
import * as fileSaver from 'file-saver';
import { Utils } from "../../../../../Utility/utils";
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { NguoiDungService } from 'src/app/services/nguoidung.service';
import { NzUploadFile } from 'ng-zorro-antd/upload';
export class ItemData {
  tenDan!: string;
  maKhoach!: string;
  maKhoiDan!: string;
  maDdiemXd!: string;
  ddiemMoTaikhoan!: string;
  masoDan!: string;
  maNganhKte!: string;
  nlucTke!: string;
  namKcTte!: number;
  namHtTte!: number;
  qdDuyetDanDtuSongaythang!: string;
  qdDuyetDanDtuTongVon!: number;
  qdDchinhDanDtuSongaythang!: string;
  qdDchinhDanDtuTongVon!: number;
  qdDuyetTkDtoanSongaythang!: string;
  qdDuyetTkDtoanXl!: number;
  qdDuyetTkDtoanTb!: number;
  qdDuyetTkDtoanCk!: number;
  qdDuyetTkDtoanTong!: number;
  klthCapDen3006Songaythang!: string;
  klthCapDen3006Nstt!: number;
  klthCapDen3006DtoanChiTx!: number;
  klthCapDen3006Quykhac!: number;
  klthCapDen3112Songaythang!: string;
  klthCapDen3112Nstt!: number;
  klthCapDen3112DtoanChiTx!: number;
  klthCapDen3112Quykhac!: number;
  ncauVonN1!: number;
  ncauVonN2!: number;
  ncauVonN3!: number;
  ghiChu!: string;
  id!: any;
  maBcao!: String;
  stt!: String;
  checked!:boolean;
}

@Component({
  selector: 'app-xay-dung-ke-hoach-von-dau-tu',
  templateUrl: './xay-dung-ke-hoach-von-dau-tu.component.html',
  styleUrls: ['./xay-dung-ke-hoach-von-dau-tu.component.scss']
})

export class XayDungKeHoachVonDauTuComponent implements OnInit {
  userInfo: any;
  errorMessage!: String;                      //
  loaiKHs: any = [];
  khoiDuAns:any = [];
  diaDiemXDs:any = [];
  maNganhKinhTes:any = [];
  donVis: any =[];
  lstCTietBCao: ItemData[] = [];              // list chi tiet bao cao
  id!: any;                                   // id truyen tu router
  chiTietBcaos: any;                          // thong tin chi tiet bao cao
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


  allChecked = false;                         // check all checkbox
  indeterminate = true;                       // properties allCheckBox
  editCache: { [key: string]: { edit: boolean; data: ItemData } } = {};     // phuc vu nut chinh

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
              private nguoiDungSerivce: NguoiDungService,
              private danhMucService: DanhMucService,
              ) {
                this.ngayNhap = this.datePipe.transform(this.newDate, 'dd-MM-yyyy',)
              }


  async ngOnInit() {
    this.id = +this.routerActive.snapshot.paramMap.get('id');
    let userName = localStorage.getItem('userName');
    let userInfo: any = await this.getUserInfo(userName); //get user info
    if (this.id) {
      this.getDetailReport();
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
            this.errorMessage = "Có lỗi trong quá trình sinh mã báo cáo vấn tin!";
          }
        },
        (err) => {
          this.errorMessage = err.error.message;
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
    this.danhMucService.dMLoaiKeHoach().subscribe(
      (data) => {
        if (data.statusCode == 0) {
          this.loaiKHs = data.data?.content;
        } else {
          this.errorMessage = "Có lỗi trong quá trình vấn tin!";
        }
      },
      (err) => {
        this.errorMessage = err.error.message;
      }
    );

    //get danh muc nhom chi
    this.danhMucService.dMKhoiDuAn().subscribe(
      (data) => {
        if (data.statusCode == 0) {
          this.khoiDuAns = data.data?.content;
        } else {
          this.errorMessage = "Có lỗi trong quá trình vấn tin!";
        }
      },
      (err) => {
        this.errorMessage = err.error.message;
      }
    );

    //get danh muc loai chi
    this.danhMucService.dMDiaDiemXayDung().subscribe(
      (data) => {
        if (data.statusCode == 0) {
          this.diaDiemXDs = data.data?.content;
        } else {
          this.errorMessage = "Có lỗi trong quá trình vấn tin!";
        }
      },
      (err) => {
        this.errorMessage = err.error.message;
      }
    );

    //get danh muc loai chi
    this.danhMucService.dMMaNganhKinhTe().subscribe(
      (data) => {
        if (data.statusCode == 0) {
          this.maNganhKinhTes = data.data?.content;
        } else {
          this.errorMessage = "Có lỗi trong quá trình vấn tin!";
        }
      },
      (err) => {
        this.errorMessage = err.error.message;
      }
    );

    //lay danh sach danh muc don vi
    this.danhMucService.dMDonVi().toPromise().then(
      (data) => {
        if (data.statusCode == 0) {
          this.donVis = data.data;
        } else {
          this.errorMessage = "Có lỗi trong quá trình vấn tin!";
        }
      },
      (err) => {
        this.errorMessage = "err.error.message";
      }
    );
    this.spinner.hide();
  }

  //get user info
  async getUserInfo(username: string) {
    let userInfo = await this.nguoiDungSerivce.getUserInfo(username).toPromise().then(
      (data) => {
        if (data?.statusCode == 0) {
          this.userInfo = data?.data
          return data?.data;
        } else {

        }
      },
      (err) => {
        console.log(err);
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
  luu() {
    // lay id file dinh kem
    let idFileDinhKems = ""
    for (let i = 0; i < this.lstFile.length; i++) {
      idFileDinhKems += this.lstFile[i].id + ",";
    }
    // gui du lieu trinh duyet len server
    let request = {
      id: this.chiTietBcaos.id,
      idFileDinhKem: idFileDinhKems,
      lstCTietBCao: this.lstCTietBCao,
      maBcao: this.maBaoCao,
      maDvi: this.maDonViTao,
      maDviTien: this.maDviTien,
      maLoaiBcao: this.maLoaiBaoCao,
      namBcao: this.namBaoCaoHienHanh,
    };
    this.spinner.show();
    this.quanLyVonPhiService.trinhDuyetService(request).subscribe(
      (data) => {
        alert("trinh duyet thanh cong!");
        console.log(data);
      },
      (err) => {
        alert("trinh duyet that bai!");
        console.log();
      })
    this.spinner.hide();
  }


  // trinh duyet
  async trinhduyet() {
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
      maDviTien: this.maDviTien,
      maLoaiBcao: this.maLoaiBaoCao,
      namHienHanh: this.namBaoCaoHienHanh,
      namBcao: this.namBaoCaoHienHanh,
    };

    //call service them moi
    this.spinner.show();
    if (this.id == null) {
      this.quanLyVonPhiService.trinhDuyetService(request).subscribe(
        data => {
          if (data.statusCode == 0) {
            alert('trinh duyet thanh cong!');
          } else {
            alert('đã có lỗi xảy ra, vui lòng thử lại sau!');
          }
        },
        err => {
          alert('trinh duyet that bai!');
          console.log(err);
        },
      );
    } else {
      this.quanLyVonPhiService.updatelist(request).subscribe(res => {
        if (res.statusCode == 0) {
          alert('trinh duyet thanh cong!');
        } else {
          alert('đã có lỗi xảy ra, vui lòng thử lại sau!');
        }
      })
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
    this.quanLyVonPhiService.approve(requestGroupButtons).subscribe((data) => {
      if (data.statusCode == 0) {
        this.getDetailReport();
      }
    });
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
          this.chiTietBcaos = data.data;
          this.lstCTietBCao = data.data.lstCTietBCao;
          this.updateEditCache();
          this.lstFile = data.data.lstFile;

          // set thong tin chung bao cao
          this.ngayNhap = data.data.ngayTao;
          this.nguoiNhap = data.data.nguoiTao;
          this.maDonViTao = data.data.maDvi;
          this.maBaoCao = data.data.maBcao;
          this.namBaoCaoHienHanh = data.data.namBcao;
          this.trangThaiBanGhi = data.data.trangThai;

          // set list id file ban dau
          this.lstFile.filter(item => {
            this.listIdFiles += item.id + ",";
          })
        } else {
          this.errorMessage = "Có lỗi trong quá trình vấn tin!";
        }
      },
      (err) => {
        console.log(err);
        this.errorMessage = err.error.message;
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
        console.log('false :', err);
      },
    );
    return temp;
  }

  // them dong moi
  addLine(id: number): void {
    let item : ItemData = {
      tenDan: "",
      maKhoach: "",
      maKhoiDan: "",
      maDdiemXd: "",
      ddiemMoTaikhoan: "",
      masoDan: "",
      maNganhKte: "",
      nlucTke: "",
      namKcTte: 0,
      namHtTte: 0,
      qdDuyetDanDtuSongaythang: "",
      qdDuyetDanDtuTongVon: 0,
      qdDchinhDanDtuSongaythang: "",
      qdDchinhDanDtuTongVon: 0,
      qdDuyetTkDtoanSongaythang: "",
      qdDuyetTkDtoanXl: 0,
      qdDuyetTkDtoanTb: 0,
      qdDuyetTkDtoanCk: 0,
      qdDuyetTkDtoanTong: 0,
      klthCapDen3006Songaythang: "",
      klthCapDen3006Nstt: 0,
      klthCapDen3006DtoanChiTx: 0,
      klthCapDen3006Quykhac: 0,
      klthCapDen3112Songaythang: "",
      klthCapDen3112Nstt: 0,
      klthCapDen3112DtoanChiTx: 0,
      klthCapDen3112Quykhac: 0,
      ncauVonN1: 0,
      ncauVonN2: 0,
      ncauVonN3: 0,
      ghiChu: "",
      stt: "",
      id: uuid.v4(),
      checked:false,
      maBcao: "",

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
      this.listIdDelete += id + ","
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

  updateAllChecked(): void {
    this.indeterminate = false;
    if (this.allChecked) {
      this.lstCTietBCao = this.lstCTietBCao.map(item => ({
        ...item,
        checked: true
      }));
    } else {
      this.lstCTietBCao = this.lstCTietBCao.map(item => ({
        ...item,
        checked: false
      }));
    }
  }

  updateSingleChecked(): void {
    if (this.lstCTietBCao.every(item => !item.checked)) {
      this.allChecked = false;
      this.indeterminate = false;
    } else if (this.lstCTietBCao.every(item => item.checked)) {
      this.allChecked = true;
      this.indeterminate = false;
    } else {
      this.indeterminate = true;
    }
  }

  redirectChiTieuKeHoachNam() {
    this.router.navigate(['/kehoach/chi-tieu-ke-hoach-nam-cap-tong-cuc']);
  }

  getStatusName(){
    const utils = new Utils();
    return utils.getStatusName(this.trangThaiBanGhi);
  }

  getUnitName(){
    return this.donVis.find(item => item.maDvi == item.maDvi)?.tenDvi;
  }

  startEdit(id: string): void {
    this.editCache[id].edit = true;
  }

  cancelEdit(id: string): void {
    const index = this.lstCTietBCao.findIndex(item => item.id === id);

    this.editCache[id] = {
      data: { ...this.lstCTietBCao[index] },
      edit: false
    };
  }

  saveEdit(id: string): void {
    const index = this.lstCTietBCao.findIndex(item => item.id === id);
    this.editCache[id].data.checked = this.lstCTietBCao.find(item => item.id === id).checked;
    Object.assign(this.lstCTietBCao[index], this.editCache[id].data);
    this.editCache[id].edit = false;
  }

  updateEditCache(): void {
    this.lstCTietBCao.forEach(item => {
      this.editCache[item.id] = {
        edit: false,
        data: { ...item }
      };
    });
  }

  changeModel(id: string): void {
    this.editCache[id].data.qdDuyetTkDtoanTong = Number(this.editCache[id].data.qdDuyetTkDtoanXl) + Number(this.editCache[id].data.qdDuyetTkDtoanTb) + Number(this.editCache[id].data.qdDuyetTkDtoanCk);
  }
}
