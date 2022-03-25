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
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { UserService } from 'src/app/services/user.service';
export class ItemData {
  maCucDtnnKvuc!:string;
  bcheGia0N1!:number;
  dkienCcvcCoMat0101n1!:number;
  dkienHdongCoMat0101n1!:number;
  ccvc0101n1Luong!:number;
  ccvc0101n1Pcap!:number;
  ccvc0101n1Ckdg!:number;
  quyLuongTangThemDoNangBacLuongCcvc0101n1!:number;
  bcheChuaSdungLuongHeSo234!:number;
  bcheChuaSdungCkdg!:number;
  quyLuongPcapCkdgTheoLuongHdld!:number;

  // 14
  bcheChuaSdungCong: number = this.bcheChuaSdungLuongHeSo234 + this.bcheChuaSdungCkdg
  // 6
  bcheChuaSdung: number = this.bcheGia0N1 - this.dkienCcvcCoMat0101n1;

  // 9
  ccvc0101n1Cong: number = this.ccvc0101n1Luong + this.ccvc0101n1Pcap + this.ccvc0101n1Ckdg;

  // 8
  tongSo: number = this.ccvc0101n1Cong + this.quyLuongTangThemDoNangBacLuongCcvc0101n1 + this.bcheChuaSdungCong;

  // 7
  tongQuyLuongPcapCkdgTheoLuongCcvcHdld: number = this.tongSo + this.ccvc0101n1Ckdg + this.quyLuongTangThemDoNangBacLuongCcvc0101n1 + this.bcheChuaSdungCkdg
  id!: any;
  maBcao!: String;
  stt!: String;
  checked!:boolean;
}

@Component({
  selector: 'app-ke-hoach-quy-tien-luong-nam-n1',
  templateUrl: './ke-hoach-quy-tien-luong-nam-n1.component.html',
  styleUrls: ['./ke-hoach-quy-tien-luong-nam-n1.component.scss']
})

export class KeHoachQuyTienLuongNamN1Component implements OnInit {
  userInfo: any;
  errorMessage!: String;                      //
  maCucDtnnKvucs: any = [];     // ma cuc khu vuc
  donVis:any = [];                            // danh muc don vi
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
  maDvi: any;
  maLoaiBacao: any;
  nam: any;
  namBcaohienhanh: any;
  currentday: Date = new Date();
  mabaocao: any;

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
              private nguoiDungSerivce: UserService,
              private danhMucService: DanhMucHDVService,
              ) {
                this.ngayNhap = this.datePipe.transform(this.newDate, 'dd-MM-yyyy',)
              }


  async ngOnInit() {
    //check param dieu huong router
    this.id = this.routerActive.snapshot.paramMap.get('id');
    this.maDvi = this.routerActive.snapshot.paramMap.get('maDvi');
    this.maLoaiBacao = this.routerActive.snapshot.paramMap.get('maLoaiBacao');
    this.nam = this.routerActive.snapshot.paramMap.get('nam');
    let userName = this.nguoiDungSerivce.getUserName();
    let userInfo: any = await this.getUserInfo(userName); //get user info
    if (this.id) {
      this.getDetailReport();
    }
    else if (
      this.maDvi != null &&
      this.maLoaiBacao != null &&
      this.nam != null
    ) {
      this.calltonghop();
      this.nguoiNhap = userInfo?.username;
      this.maDonViTao = userInfo?.dvql;
      this.namBaoCaoHienHanh = this.currentday.getFullYear();
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
    }
    else {
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

    this.danhMucService.dMMaCucDtnnKvucs().toPromise().then(
      (data) => {
        if (data.statusCode == 0) {
          this.maCucDtnnKvucs = data.data?.content;
        } else {
          this.errorMessage = "Có lỗi trong quá trình vấn tin!";
        }
      },
      (err) => {
        this.errorMessage = "err.error.message";
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
  async luu() {
    debugger
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
      namBcao: this.namBcao,
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
    this.updateEditCache();
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
    this.quanLyVonPhiService.bCLapThamDinhDuToanChiTiet(this.id).subscribe(
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
          this.namBcao = data.data.namBcao;
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
      maCucDtnnKvuc!: '',
      bcheGia0N1: 0,
      dkienCcvcCoMat0101n1: 0,
      dkienHdongCoMat0101n1: 0,
      ccvc0101n1Luong: 0,
      ccvc0101n1Pcap: 0,
      ccvc0101n1Ckdg: 0,
      quyLuongTangThemDoNangBacLuongCcvc0101n1: 0,
      bcheChuaSdungLuongHeSo234: 0,
      bcheChuaSdungCkdg: 0,
      quyLuongPcapCkdgTheoLuongHdld: 0,
      bcheChuaSdungCong: 0,
      bcheChuaSdung: 0,
      ccvc0101n1Cong: 0,
      tongSo: 0,
      tongQuyLuongPcapCkdgTheoLuongCcvcHdld: 0,
      maBcao: "",
      stt: "",
      id: uuid.v4(),
      checked:false,
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
 return this.donVis.find(item => item.maDvi== this.maDonViTao)?.tenDvi;
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
    this.editCache[id].data.bcheChuaSdungCong = Number(this.editCache[id].data.bcheChuaSdungLuongHeSo234) + Number(this.editCache[id].data.bcheChuaSdungCkdg);
    this.editCache[id].data.bcheChuaSdung = Number(this.editCache[id].data.bcheGia0N1) - Number(this.editCache[id].data.dkienCcvcCoMat0101n1);
    this.editCache[id].data.ccvc0101n1Cong = Number(this.editCache[id].data.ccvc0101n1Luong) + Number(this.editCache[id].data.ccvc0101n1Pcap) + Number(this.editCache[id].data.ccvc0101n1Ckdg);
    this.editCache[id].data.tongSo = Number(this.editCache[id].data.ccvc0101n1Cong) + Number(this.editCache[id].data.quyLuongTangThemDoNangBacLuongCcvc0101n1) + Number(this.editCache[id].data.bcheChuaSdungCong);
    this.editCache[id].data.tongQuyLuongPcapCkdgTheoLuongCcvcHdld = Number(this.editCache[id].data.tongSo) + Number(this.editCache[id].data.ccvc0101n1Ckdg) + Number(this.editCache[id].data.quyLuongTangThemDoNangBacLuongCcvc0101n1) + Number(this.editCache[id].data.bcheChuaSdungCkdg);
  }
  //call tong hop
  calltonghop(){
    this.spinner.hide();
    let objtonghop={
        maDvi: this.maDvi,
        maLoaiBcao: this.maLoaiBacao,
        namHienTai: this.nam,
    }
    this.quanLyVonPhiService.tongHop(objtonghop).subscribe(res => {
        if(res.statusCode==0){
            this.lstCTietBCao = res.data;
            // this.namBaoCao = this.namBcao;
            this.namBcaohienhanh = this.currentday.getFullYear();
            if(this.lstCTietBCao==null){
                this.lstCTietBCao =[];
            }
            console.log(this.lstCTietBCao)
            this.namBcaohienhanh = this.namBcaohienhanh
        }else{
            alert('co loi trong qua trinh van tin');
        }
    },err =>{
        alert(err.error.message);
    });
    this.quanLyVonPhiService.sinhMaBaoCao().subscribe(res => {
        if (res.statusCode == 0) {
            this.mabaocao = res.data;
        } else {
            this.errorMessage = 'Có lỗi trong quá trình vấn tin!';
        }
    })
    this.spinner.show();
}
}

