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

export class ItemData {
  id: any;
  stt!: number;
  maDvi!: string;
  tongCong!: number;
  k331KhongTchuCoDmucNx!: number;
  k331KhongTchuCoDmucVtct!: number;
  k331KhongTchuCoDmucBquan!: number;
  k331KhongTchuCoDmucCong!: number;// = this.k331KhongTchuCoDmucNx + this.k331KhongTchuCoDmucVtct + this.k331KhongTchuCoDmucBquan; // 3=4+5+6
  k331KhongTchuChuaDmucCntt!: number;
  k331KhongTchuChuaDmucThueKho!: number;
  k331KhongTchuChuaDmucMsamTsan!: number;
  k331KhongTchuChuaDmucBhiemHhoa!: number;
  k331KhongTchuChuaDmucPhongChongMoiKplb!: number;
  k331KhongTchuChuaDmucVchuyenBquanTsanQhiem!: number;
  k331KhongTchuChuaDmucSchuaKhoTang!: number;
  k331KhongTchuChuaDmucCong!: number;// = this.k331KhongTchuChuaDmucCntt + this.k331KhongTchuChuaDmucThueKho + this.k331KhongTchuChuaDmucMsamTsan + this.k331KhongTchuChuaDmucBhiemHhoa + this.k331KhongTchuChuaDmucPhongChongMoiKplb + this.k331KhongTchuChuaDmucVchuyenBquanTsanQhiem + this.k331KhongTchuChuaDmucSchuaKhoTang;
  k331Tcong!: number;// = this.k331KhongTchuCoDmucNx + this.k331KhongTchuCoDmucVtct + this.k331KhongTchuCoDmucBquan + this.k331KhongTchuChuaDmucCntt + this.k331KhongTchuChuaDmucThueKho + this.k331KhongTchuChuaDmucMsamTsan + this.k331KhongTchuChuaDmucBhiemHhoa + this.k331KhongTchuChuaDmucPhongChongMoiKplb + this.k331KhongTchuChuaDmucVchuyenBquanTsanQhiem + this.k331KhongTchuChuaDmucSchuaKhoTang; //2=3+7
  k341Luong!: number;
  k341TxTheoDmuc!: number;
  k341ChiTxKhongDmuc!: number;
  k341Tcong!: number;// = this.k341Luong + this.k341TxTheoDmuc + this.k341ChiTxKhongDmuc; //16 = 17+18+19
  checked!: boolean;
}

@Component({
  selector: 'app-tong-hop-du-toan-chi-thuong-xuyen-hang-nam',
  templateUrl: './tong-hop-du-toan-chi-thuong-xuyen-hang-nam.component.html',
  styleUrls: ['./tong-hop-du-toan-chi-thuong-xuyen-hang-nam.component.scss'],
})

export class TongHopDuToanChiThuongXuyenHangNamComponent implements OnInit {
  maDvi: any;
  maLoaiBacao: string = '25';
  nam: any;
  donVis: any = [];
  tong: ItemData = new ItemData();
  userInfo: any;
  errorMessage!: String;
  listBaoCao: ItemData[] = [];
  lstCTietBCao: ItemData[] = [];
  id!: any;
  chiTietBcaos: any;
  lstFile: any = [];
  status: boolean = false;
  namBcao = new Date().getFullYear()
  userData!: any;
  role!: any;
  unit!: any;
  userName: any;
  ngayNhap!: any;
  nguoiNhap!: string;
  maDonViTao!: any;
  maBaoCao!: string;
  namBaoCaoHienHanh!: any;
  trangThaiBanGhi: string = "1";
  maLoaiBaoCao: string = "01";
  maDviTien: string = "01";
  newDate = new Date();
  fileToUpload!: File;
  listFile: File[] = [];
  listId: string = "";
  listFileUploaded: any = [];
  box1 = true;
  fileUrl: any;
  currentFile?: File;
  progress = 0;
  message = '';
  fileName = 'Select File';
  listIdDelete: string = "";                  // list id delete
  tong1: number = 0;
  tong2: number = 0;
  tong3: number = 0;

  statusBtnDel: boolean;                       // trang thai an/hien nut xoa
  statusBtnSave: boolean = false;                      // trang thai an/hien nut luu
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
    private nguoiDungSerivce: UserService,
    private danhMucService: DanhMucHDVService,
  ) {
    this.ngayNhap = this.datePipe.transform(this.newDate, 'dd-MM-yyyy',)
  }


  async ngOnInit() {
    this.id = this.routerActive.snapshot.paramMap.get('id');
    let userName = localStorage.getItem('userName');
    let userInfo: any = await this.getUserInfo(userName); //get user info

    //check prama dieu huong router
    this.maDvi = this.routerActive.snapshot.paramMap.get('maDvi');
    this.maLoaiBacao = this.routerActive.snapshot.paramMap.get('maLoaiBacao');
    this.nam = this.routerActive.snapshot.paramMap.get('nam');
    if (this.id) {
      this.getDetailReport();
    } else if (
      this.maDvi != null &&
      this.maLoaiBacao != null &&
      this.nam != null
    ) {
      this.calltonghop();
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

    this.tong.tongCong = 0;
    this.tong.k331KhongTchuCoDmucNx = 0;
    this.tong.k331KhongTchuCoDmucVtct = 0;
    this.tong.k331KhongTchuCoDmucBquan = 0;
    this.tong.k331KhongTchuCoDmucCong = 0;
    this.tong.k331KhongTchuChuaDmucCntt = 0;
    this.tong.k331KhongTchuChuaDmucThueKho = 0;
    this.tong.k331KhongTchuChuaDmucMsamTsan = 0;
    this.tong.k331KhongTchuChuaDmucBhiemHhoa = 0;
    this.tong.k331KhongTchuChuaDmucPhongChongMoiKplb = 0;
    this.tong.k331KhongTchuChuaDmucVchuyenBquanTsanQhiem = 0;
    this.tong.k331KhongTchuChuaDmucSchuaKhoTang = 0;
    this.tong.k331KhongTchuChuaDmucCong = 0;
    this.tong.k331Tcong = 0;
    this.tong.k341Luong = 0;
    this.tong.k341TxTheoDmuc = 0;
    this.tong.k341ChiTxKhongDmuc = 0;
    this.tong.k341Tcong = 0;

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
      idFileDinhKem: listFile,
      lstCTietBCao: this.lstCTietBCao,
      maBcao: this.maBaoCao,
      maDvi: this.maDonViTao = "01",
      maDviTien: this.maDviTien = "01",
      maLoaiBcao: this.maLoaiBaoCao = "01",
      namBcao: this.namBaoCaoHienHanh,
      namHienHanh: this.namBaoCaoHienHanh,
    };
    this.spinner.show();
    if (this.id == null) {
      this.quanLyVonPhiService.trinhDuyetService(request).subscribe(
        (data) => {
          alert("trinh duyet thanh cong!");
          console.log(data);
        },
        (err) => {
          alert("trinh duyet that bai!");
          console.log();
        })
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

          for (var i = 0; i < this.lstCTietBCao.length; i++){
            this.congItemData(i);
          }

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
    let item: ItemData = {
      id: uuid.v4(),
      stt: 0,
      maDvi: "",
      tongCong: 0,
      k331KhongTchuCoDmucNx: 0,
      k331KhongTchuCoDmucVtct: 0,
      k331KhongTchuCoDmucBquan: 0,
      k331KhongTchuCoDmucCong: 0, // 3=4+5+6
      k331KhongTchuChuaDmucCntt: 0,
      k331KhongTchuChuaDmucThueKho: 0,
      k331KhongTchuChuaDmucMsamTsan: 0,
      k331KhongTchuChuaDmucBhiemHhoa: 0,
      k331KhongTchuChuaDmucPhongChongMoiKplb: 0,
      k331KhongTchuChuaDmucVchuyenBquanTsanQhiem: 0,
      k331KhongTchuChuaDmucSchuaKhoTang: 0,
      k331KhongTchuChuaDmucCong: 0,
      k331Tcong: 0, //2=3+7
      k341Luong: 0,
      k341TxTheoDmuc: 0,
      k341ChiTxKhongDmuc: 0,
      k341Tcong: 0,
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
    const index = this.lstCTietBCao.findIndex(item => item.id === id);
    this.truItemData(index);
    this.lstCTietBCao = this.lstCTietBCao.filter(item => item.id != id)
    if (typeof id == "number") {
      this.listIdDelete += id + ",";
    }
  }

  // xóa với checkbox
  deleteSelected() {
    // add list delete id
    for (var i=0; i < this.lstCTietBCao.length; i++){
      let item = this.lstCTietBCao[i];
      if (item.checked == true) {
        this.truItemData(i);
      }
      if (item.checked == true && typeof item.id == "number") {
        this.listIdDelete += item.id + ","
      }
    }
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
    this.router.navigate(['/kehoach/chi-tieu-ke-hoach-nam-cap-tong-cuc']);
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
    this.truItemData(index);
    Object.assign(this.lstCTietBCao[index], this.editCache[id].data); // set lai data cua lstCTietBCao[index] = this.editCache[id].data
    this.editCache[id].edit = false;  // CHUYEN VE DANG TEXT
    this.congItemData(index);
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

  changeModel(id: string): void {
    let k: any = this.editCache[id].data;
    this.editCache[id].data.k331KhongTchuCoDmucCong = k.k331KhongTchuCoDmucNx + k.k331KhongTchuCoDmucVtct + k.k331KhongTchuCoDmucBquan;
    this.editCache[id].data.k331KhongTchuChuaDmucCong = k.k331KhongTchuChuaDmucCntt + k.k331KhongTchuChuaDmucThueKho + k.k331KhongTchuChuaDmucMsamTsan + k.k331KhongTchuChuaDmucBhiemHhoa + k.k331KhongTchuChuaDmucPhongChongMoiKplb + k.k331KhongTchuChuaDmucVchuyenBquanTsanQhiem + k.k331KhongTchuChuaDmucSchuaKhoTang;
    this.editCache[id].data.k331Tcong = k.k331KhongTchuCoDmucCong + k.k331KhongTchuChuaDmucCong;
    this.editCache[id].data.k341Tcong = k.k341Luong + k.k341ChiTxKhongDmuc + k.k341TxTheoDmuc;
    this.editCache[id].data.tongCong = k.k331Tcong + k.k341Tcong + 3 * k.k341TxTheoDmuc;
  }

  // //gia tri cac o input thay doi thi tinh toan lai
  // changeModel1(id: string): void {
  //   const index = this.lstCTietBCao.findIndex(item => item.id === id);
  //   this.tong1 += this.editCache[id].data.n1 - this.lstCTietBCao[index].n1;
  // }
  // changeModel2(id: string): void {
  //   const index = this.lstCTietBCao.findIndex(item => item.id === id);
  //   this.tong2 += this.editCache[id].data.n2 - this.lstCTietBCao[index].n2;
  // }
  // changeModel3(id: string): void {
  //   const index = this.lstCTietBCao.findIndex(item => item.id === id);
  //   this.tong3 += this.editCache[id].data.n3 - this.lstCTietBCao[index].n3;
  // }

  congItemData(index: number) {
    let item : ItemData = this.lstCTietBCao[index];
    this.tong.tongCong += item.tongCong;
    this.tong.k331KhongTchuCoDmucNx += item.k331KhongTchuCoDmucNx;
    this.tong.k331KhongTchuCoDmucVtct += item.k331KhongTchuCoDmucVtct;
    this.tong.k331KhongTchuCoDmucBquan += item.k331KhongTchuCoDmucBquan;
    this.tong.k331KhongTchuCoDmucCong += item.k331KhongTchuCoDmucCong;
    this.tong.k331KhongTchuChuaDmucCntt += item.k331KhongTchuChuaDmucCntt;
    this.tong.k331KhongTchuChuaDmucThueKho += item.k331KhongTchuChuaDmucThueKho;
    this.tong.k331KhongTchuChuaDmucMsamTsan += item.k331KhongTchuChuaDmucMsamTsan;
    this.tong.k331KhongTchuChuaDmucBhiemHhoa += item.k331KhongTchuChuaDmucBhiemHhoa;
    this.tong.k331KhongTchuChuaDmucPhongChongMoiKplb += item.k331KhongTchuChuaDmucPhongChongMoiKplb;
    this.tong.k331KhongTchuChuaDmucVchuyenBquanTsanQhiem += item.k331KhongTchuChuaDmucVchuyenBquanTsanQhiem;
    this.tong.k331KhongTchuChuaDmucSchuaKhoTang += item.k331KhongTchuChuaDmucSchuaKhoTang;
    this.tong.k331KhongTchuChuaDmucCong += item.k331KhongTchuChuaDmucCong;
    this.tong.k331Tcong += item.k331Tcong;
    this.tong.k341Luong += item.k341Luong;
    this.tong.k341TxTheoDmuc += item.k341TxTheoDmuc;
    this.tong.k341ChiTxKhongDmuc += item.k341ChiTxKhongDmuc;
    this.tong.k341Tcong += item.k341Tcong;
  }

  truItemData(index: number) {
    let item : ItemData = this.lstCTietBCao[index];
    this.tong.tongCong -= item.tongCong;
    this.tong.k331KhongTchuCoDmucNx -= item.k331KhongTchuCoDmucNx;
    this.tong.k331KhongTchuCoDmucVtct -= item.k331KhongTchuCoDmucVtct;
    this.tong.k331KhongTchuCoDmucBquan -= item.k331KhongTchuCoDmucBquan;
    this.tong.k331KhongTchuCoDmucCong -= item.k331KhongTchuCoDmucCong;
    this.tong.k331KhongTchuChuaDmucCntt -= item.k331KhongTchuChuaDmucCntt;
    this.tong.k331KhongTchuChuaDmucThueKho -= item.k331KhongTchuChuaDmucThueKho;
    this.tong.k331KhongTchuChuaDmucMsamTsan -= item.k331KhongTchuChuaDmucMsamTsan;
    this.tong.k331KhongTchuChuaDmucBhiemHhoa -= item.k331KhongTchuChuaDmucBhiemHhoa;
    this.tong.k331KhongTchuChuaDmucPhongChongMoiKplb -= item.k331KhongTchuChuaDmucPhongChongMoiKplb;
    this.tong.k331KhongTchuChuaDmucVchuyenBquanTsanQhiem -= item.k331KhongTchuChuaDmucVchuyenBquanTsanQhiem;
    this.tong.k331KhongTchuChuaDmucSchuaKhoTang -= item.k331KhongTchuChuaDmucSchuaKhoTang;
    this.tong.k331KhongTchuChuaDmucCong -= item.k331KhongTchuChuaDmucCong;
    this.tong.k331Tcong -= item.k331Tcong;
    this.tong.k341Luong -= item.k341Luong;
    this.tong.k341TxTheoDmuc -= item.k341TxTheoDmuc;
    this.tong.k341ChiTxKhongDmuc -= item.k341ChiTxKhongDmuc;
    this.tong.k341Tcong -= item.k341Tcong;
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
            this.namBaoCaoHienHanh = new Date().getFullYear();
            if(this.lstCTietBCao==null){
                this.lstCTietBCao =[];
            }
            console.log(this.lstCTietBCao)
            //this.namBcaohienhanh = this.namBcaohienhanh
        }else{
            alert('co loi trong qua trinh van tin');
        }
    },err =>{
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
