import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTreeComponent } from 'ng-zorro-antd/tree';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { MESSAGE } from 'src/app/constants/message';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { DomSanitizer } from '@angular/platform-browser';
import { UserService } from 'src/app/services/user.service';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { Utils } from 'src/app/Utility/utils';
import { NzModalService } from 'ng-zorro-antd/modal';
import { TAB_SELECTED, PHULUCLIST } from './bao-cao.constant';
import { DialogLuaChonThemPhuLucComponent } from 'src/app/components/dialog/dialog-lua-chon-them-phu-luc/dialog-lua-chon-them-phu-luc.component';
import * as fileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import * as uuid from "uuid";

export class ItemData {
  id!: any;
  stt!: String;
  checked!:boolean;
  tieuDe!: string;
  maPhuLuc!:number;
  tenPhuLuc!: string;
  status!: string;
  danhSachChiTietPhuLuc!: any;
}

export class ItemDanhSach {
  id!: any;
  maBCao!: String;
  namBCao!: Number;
  thangBCao!: Number;
  ngayTao!: string;
  congVan!:string;
  ngayTrinhDuyet!:string;
  ngayDuyet!:string;
  ngayPheDuyet!:string;
  ngayCapTrenTraKq!:string;
  trangThai!:string;
  stt!: String;
  checked!:boolean;
  danhSachPhuLuc: ItemData[] = [];
}

@Component({
  selector: 'bao-cao',
  templateUrl: './bao-cao.component.html',
  styleUrls: ['./bao-cao.component.scss']
})
export class BaoCaoComponent implements OnInit {

  @ViewChild('nzTreeComponent', { static: false })
  nzTreeComponent!: NzTreeComponent;
  detailDonVi: FormGroup;
  danhSachBaoCao: ItemDanhSach = new ItemDanhSach();
  totalElements = 0;
  totalPages = 0;
  errorMessage = "";
  url!: string;
  id!: any;                                   // id truyen tu router

  pages = {
    size: 10,
    page: 1,
  }
  donViTaos: any = [];
  baoCaos: any = [];


  userInfo: any;
  noiDungs: any = [];                         // danh muc noi dung
  nhomChis:any = [];                          // danh muc nhom chi
  loaiChis:any = [];                          // danh muc loai chi
  donVis:any = [];                            // danh muc don vi
  donViTiens:any = [];                        // danh muc don vi tien

  //lstCTietBCao: ItemData[] = [];              // list chi tiet bao cao
  chiTietBcaos: any;                          // thong tin chi tiet bao cao
  lstFile: any = [];                          // list File de day vao api
  status: boolean = false;                    // trang thai an/ hien cua trang thai
  namBcao = new Date().getFullYear();         // nam bao cao
  userName: any;                              // ten nguoi dang nhap
  ngayNhap!: any;                             // ngay nhap
  maDonViTao!: any;                           // ma don vi tao
  maBaoCao!: string;                          // ma bao cao
  namBaoCao!: any;                            // nam bao cao
  thangBaoCao!:any;
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
  allCheckedTemp  = false;                    // check all checkbox temp
  indeterminateTemp = true;                   // properties allCheckBox temp
  editCache: { [key: string]: { edit: boolean; data: any } } = {};     // phuc vu nut chinh
  fileList: NzUploadFile[] = [];
  tabSelected: number;
  danhSachChiTietPhuLucTemp: any = [];

  tab = TAB_SELECTED;
  constructor(
    private routerActive: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private sanitizer: DomSanitizer,
    private danhMucService: DanhMucHDVService,
    private userService: UserService,
    private notification: NzNotificationService,
    private quanLyVonPhiService: QuanLyVonPhiService,
    private danhMuc: DanhMucHDVService,
    private router: Router,
    private datePipe: DatePipe,
    private notifi: NzNotificationService,
    private modal: NzModalService,

  ) {
  }

  async ngOnInit(){
    this.id = this.routerActive.snapshot.paramMap.get('id');
    let userName = this.userService.getUserName();
    let userInfo: any = await this.getUserInfo(userName); //get user info
    if (this.id) {
      //await this.getDetailReport();
    } else {
      this.maDonViTao = userInfo?.dvql;
      this.spinner.show();
      this.quanLyVonPhiService.sinhMaBaoCao().subscribe(
        (data) => {
          if (data.statusCode == 0) {
            this.danhSachBaoCao.maBCao = data.data;
          } else {
            this.notification.error(MESSAGE.ERROR, data?.msg);
          }
        },
        (err) => {
          this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
        }
      );
      this.danhSachBaoCao.namBCao = new Date().getFullYear();
      this.danhSachBaoCao.thangBCao = new Date().getMonth();
      this.danhSachBaoCao.ngayTao = new Date().toDateString();
      this.danhSachBaoCao.trangThai = "1";
      PHULUCLIST.forEach(item => {
        this.danhSachBaoCao.danhSachPhuLuc.push({
          stt: "",
          id: uuid.v4(),
          checked:false,
          tieuDe: item.tieuDe,
          maPhuLuc:item.maPhuLuc,
          tenPhuLuc: item.tenPhuLuc,
          status: '1',
          danhSachChiTietPhuLuc: []
        });
      })
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

    //lay danh sach loai bao cao
    this.danhMuc.dMLoaiBaoCaoThucHienDuToanChi().toPromise().then(
      data => {
        console.log(data);
        if (data.statusCode == 0) {
          this.baoCaos = data.data?.content;
        } else {
          this.notifi.error(MESSAGE.ERROR, data?.msg);
        }
      },
      err => {
        this.notifi.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
    );

    //lay danh sach danh muc
    this.danhMuc.dMDonVi().toPromise().then(
      data => {
        if (data.statusCode == 0) {
          this.donViTaos = data.data;
        } else {
          this.notifi.error(MESSAGE.ERROR, data?.msg);
        }
      },
      err => {
        this.notifi.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
    );
    this.spinner.hide();
  }

  // lay ten don vi tao
  getUnitName(dvitao: any) {
    return this.donViTaos.find(item => item.maDvi == dvitao)?.tenDvi;
  }

  redirectThongTinTimKiem() {
    this.router.navigate([
      '/kehoach/thong-tin-chi-tieu-ke-hoach-nam-cap-tong-cuc',
      0,
    ]);
  }

  redirectSuaThongTinTimKiem(id) {
    this.router.navigate([
      '/kehoach/thong-tin-chi-tieu-ke-hoach-nam-cap-tong-cuc',
      id,
    ]);
  }

  //set url khi
  setUrl(lbaocao: any) {
    console.log(lbaocao)
    switch (lbaocao) {
      case 526:
        this.url = '/lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-dtqg-tai-chi-cuc-mau02/'
        break;
      case 527:
        this.url = '/lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-dtqg-tai-chi-cuc-mau03/'
        break;
      default:
        this.url = null;
        break;
    }
  }

  //doi so trang
  onPageIndexChange(page) {
    this.pages.page = page;
  }

  //doi so luong phan tu tren 1 trang
  onPageSizeChange(size) {
    this.pages.size = size;
  }
  onSubmit(id) {

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
        this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
      }
    );
    return userInfo;
  }

  // click o checkbox single
  updateSingleChecked(): void {
    if (this.danhSachBaoCao?.danhSachPhuLuc.every(item => !item.checked)) {           // tat ca o checkbox deu = false thi set o checkbox all = false
      this.allChecked = false;
      this.indeterminate = false;
    } else if (this.danhSachBaoCao?.danhSachPhuLuc.every(item => item.checked)) {     // tat ca o checkbox deu = true thi set o checkbox all = true
      this.allChecked = true;
      this.indeterminate = false;
    } else {                                                        // o checkbox vua = false, vua = true thi set o checkbox all = indeterminate
      this.indeterminate = true;
    }
  }

  // update all
  updateAllChecked(): void {
    this.indeterminate = false;                               // thuoc tinh su kien o checkbox all
    if (this.allChecked) {                                    // checkboxall == true thi set lai lstCTietBCao.checked = true
      this.danhSachBaoCao.danhSachPhuLuc = this.danhSachBaoCao?.danhSachPhuLuc.map(item => ({
        ...item,
        checked: true
      }));
    } else {
      this.danhSachBaoCao.danhSachPhuLuc = this.danhSachBaoCao?.danhSachPhuLuc.map(item => ({    // checkboxall == false thi set lai lstCTietBCao.checked = false
        ...item,
        checked: false
      }));
    }
  }

  // click o checkbox single
  updateSingleCheckedTemp(): void {
    if (this.danhSachChiTietPhuLucTemp.every(item => !item.checked)) {           // tat ca o checkbox deu = false thi set o checkbox all = false
      this.allCheckedTemp = false;
      this.indeterminateTemp = false;
    } else if (this.danhSachChiTietPhuLucTemp.every(item => item.checked)) {     // tat ca o checkbox deu = true thi set o checkbox all = true
      this.allCheckedTemp = true;
      this.indeterminateTemp = false;
    } else {                                                        // o checkbox vua = false, vua = true thi set o checkbox all = indeterminate
      this.indeterminateTemp = true;
    }
  }

  // update all
  updateAllCheckedTemp(): void {
    this.indeterminateTemp = false;                               // thuoc tinh su kien o checkbox all
    if (this.allCheckedTemp) {                                    // checkboxall == true thi set lai lstCTietBCao.checked = true
      this.danhSachChiTietPhuLucTemp = this.danhSachChiTietPhuLucTemp.map(item => ({
        ...item,
        checked: true
      }));
    } else {
      this.danhSachChiTietPhuLucTemp = this.danhSachChiTietPhuLucTemp.map(item => ({    // checkboxall == false thi set lai lstCTietBCao.checked = false
        ...item,
        checked: false
      }));
    }
  }

  exportData() {
    var workbook = XLSX.utils.book_new();
    const tableLuongThuc = document
      .getElementById('table-luong-thuc')
      .getElementsByTagName('table');
    if (tableLuongThuc && tableLuongThuc.length > 0) {
      let sheetLuongThuc = XLSX.utils.table_to_sheet(tableLuongThuc[0]);
      sheetLuongThuc['!cols'] = [];
      sheetLuongThuc['!cols'][24] = { hidden: true };
      sheetLuongThuc['!cols'][25] = { hidden: true };
      XLSX.utils.book_append_sheet(workbook, sheetLuongThuc, 'sheetLuongThuc');
    }
    const tableMuoi = document
      .getElementById('table-muoi')
      .getElementsByTagName('table');
    if (tableMuoi && tableMuoi.length > 0) {
      let sheetMuoi = XLSX.utils.table_to_sheet(tableMuoi[0]);
      sheetMuoi['!cols'] = [];
      sheetMuoi['!cols'][12] = { hidden: true };
      sheetMuoi['!cols'][13] = { hidden: true };
      XLSX.utils.book_append_sheet(workbook, sheetMuoi, 'sheetMuoi');
    }
    const tableVatTu = document
      .getElementById('table-vat-tu')
      .getElementsByTagName('table');
    if (tableVatTu && tableVatTu.length > 0) {
      let sheetVatTu = XLSX.utils.table_to_sheet(tableVatTu[0]);
      XLSX.utils.book_append_sheet(workbook, sheetVatTu, 'sheetVatTu');
    }
    XLSX.writeFile(workbook, 'thong-tin-chi-tieu-ke-hoach-nam.xlsx');
  }

  async importFileData(event: any) {
    this.spinner.show();
    try {
      const element = event.currentTarget as HTMLInputElement;
      let fileList: FileList | null = element.files;
      // if (fileList) {
      //   let res = await this.chiTieuKeHoachNamService.importFile(fileList[0]);
      //   if (res.msg == MESSAGE.SUCCESS) {
      //     let temptData = res.data;
      //     if (temptData) {
      //       if (temptData.khluongthuc && temptData.khluongthuc.length > 0) {
      //         for (let i = 0; i < temptData.khluongthuc.length; i++) {
      //           this.checkDataExistLuongThuc(temptData.khluongthuc[i]);
      //         }
      //       }
      //       if (temptData.khMuoi && temptData.khMuoi.length > 0) {
      //         for (let i = 0; i < temptData.khMuoi.length; i++) {
      //           this.checkDataExistMuoi(temptData.khMuoi[i]);
      //         }
      //       }
      //       if (temptData.khVatTu && temptData.khVatTu.length > 0) {
      //         for (let i = 0; i < temptData.khVatTu.length; i++) {
      //           this.checkDataExistVatTu(temptData.khVatTu[i]);
      //         }
      //         this.thongTinChiTieuKeHoachNam.khVatTu = this.updateDataListVatTu(this.thongTinChiTieuKeHoachNam.khVatTu);
      //       }
      //     }
      //   }
      // }
      element.value = null;
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  // doi tab
  changeTab(maPhuLuc){
    this.tabSelected = maPhuLuc;
    this.danhSachChiTietPhuLucTemp = this.danhSachBaoCao?.danhSachPhuLuc.find(item => item.maPhuLuc == maPhuLuc)?.danhSachChiTietPhuLuc;
  }

  changeModel(id){

  }

  // xoa dong
  deleteById(id: any): void {
    this.danhSachChiTietPhuLucTemp = this.danhSachChiTietPhuLucTemp.filter(item => item.id != id)
    if (typeof id == "number") {
      this.listIdDelete += id + ",";
    }
  }

  // start edit
  startEdit(id: string): void {
    this.editCache[id].edit = true;
  }

  // them dong moi
  addLine(id: number): void {
    let item;
    if(this.tabSelected == TAB_SELECTED.phuLuc1){
      item = {
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
        checked:false,
      }
    }else if(this.tabSelected == TAB_SELECTED.phuLuc2){
      item = {
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
        checked:false,
      }
    }else if(this.tabSelected == TAB_SELECTED.phuLuc3){
      item = {
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
        checked:false,
      }
    }
    this.danhSachChiTietPhuLucTemp.splice(id, 0, item);
    this.editCache[item.id] = {
      edit: true,
      data: { ...item }
    };
    console.log(this.editCache[item.id]);
    
  }

  // huy thay doi
  cancelEdit(id: string): void {
    const index = this.danhSachChiTietPhuLucTemp.findIndex(item => item.id === id);  // lay vi tri hang minh sua
    this.editCache[id] = {
      data: { ...this.danhSachChiTietPhuLucTemp[index] },
      edit: false
    };
  }

  // luu thay doi
  saveEdit(id: string): void {
    this.editCache[id].data.checked = this.danhSachChiTietPhuLucTemp.find(item => item.id === id).checked; // set checked editCache = checked lstCTietBCao
    const index = this.danhSachChiTietPhuLucTemp.findIndex(item => item.id === id);   // lay vi tri hang minh sua
    Object.assign(this.danhSachChiTietPhuLucTemp[index], this.editCache[id].data); // set lai data cua lstCTietBCao[index] = this.editCache[id].data
    this.editCache[id].edit = false;  // CHUYEN VE DANG TEXT
  }

  // xoa voi checkbox
  deleteSelected() {
    // add list delete id
    this.danhSachChiTietPhuLucTemp.filter(item => {
      if(item.checked == true && typeof item.id == "number"){
        this.listIdDelete += item.id + ","
      }
    })
    // delete object have checked = true
    this.danhSachChiTietPhuLucTemp = this.danhSachChiTietPhuLucTemp.filter(item => item.checked != true )
    this.allCheckedTemp = false;
  }

  // luu temp vao bang chinh
  saveTemp(){
    this.danhSachBaoCao?.danhSachPhuLuc.forEach(item => {
      if(item.maPhuLuc == this.tabSelected){
        item.danhSachChiTietPhuLuc = this.danhSachChiTietPhuLucTemp;
      }
    });
    this.tabSelected = null;
  }

  // xoa phu luc
  deletePhuLucList(){
    this.danhSachBaoCao.danhSachPhuLuc = this.danhSachBaoCao?.danhSachPhuLuc.filter(item => item.checked == false);
    if(this.danhSachBaoCao?.danhSachPhuLuc?.findIndex(item => item.maPhuLuc == this.tabSelected) == -1){
      this.tabSelected = null;
    }
    this.allChecked = false;
  }

  // them phu luc
  addPhuLuc() {
    PHULUCLIST.forEach(item => item.status = false);
    var danhSach = PHULUCLIST.filter(item => this.danhSachBaoCao?.danhSachPhuLuc?.findIndex(data => data.maPhuLuc == item.maPhuLuc) == -1);
    
    const modalIn = this.modal.create({
      nzTitle: 'Danh sách phụ lục',
      nzContent: DialogLuaChonThemPhuLucComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '600px',
      nzFooter: null,
      nzComponentParams: {
        danhSachPhuLuc: danhSach
      },
    });
    modalIn.afterClose.subscribe((res) => {
      if (res) {
        res.forEach(item => {
          if(item.status){
            this.danhSachBaoCao.danhSachPhuLuc.push({
              stt: "",
              id: uuid.v4(),
              checked:false,
              tieuDe: item.tieuDe,
              maPhuLuc:item.maPhuLuc,
              tenPhuLuc: item.tenPhuLuc,
              status: '1',
              danhSachChiTietPhuLuc: []
            });
          }
        })
      }
    });
  }

  // them file vao danh sach
  handleUpload(): void {
    this.fileList.forEach((file: any) => {
      const id = file?.lastModified.toString();
      this.lstFile.push({ id: id, fileName: file?.name });
      this.listFile.push(file);
    });
    this.fileList = [];
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

  // xoa file trong bang file
  deleteFile(id: string): void {
    this.lstFile = this.lstFile.filter((a: any) => a.id !== id);
    this.listFile = this.listFile.filter((a: any) => a?.lastModified.toString() !== id);
  }

  // before uploaf file
  beforeUpload = (file: NzUploadFile): boolean => {
    this.fileList = this.fileList.concat(file);
    return false;
  };

  xoa() {

  }

  // luu
  async luu() {
    // let listFile: any = [];
    // for (const iterator of this.listFile) {
    //   listFile.push(await this.uploadFile(iterator));
    // }

    // // replace nhung ban ghi dc them moi id thanh null
    // this.lstCTietBCao.filter(item => {
    //   if (typeof item.id != "number") {
    //     item.id = null;
    //   }
    // })

    // // gui du lieu trinh duyet len server
    // let request = {
    //   id: this.id,
    //   fileDinhKems: listFile,
    //   listIdFiles: this.listIdFiles,                      // id file luc get chi tiet tra ra( de backend phuc vu xoa file)
    //   lstCTietBCao: this.lstCTietBCao,
    //   maBcao: this.maBaoCao,
    //   maDvi: this.maDonViTao,
    //   maDviTien: this.maDviTien,
    //   maLoaiBcao: this.maLoaiBaoCao,
    //   namHienHanh: this.namBaoCaoHienHanh,
    //   namBcao: this.namBaoCaoHienHanh,
    // };

    // //call service them moi
    // this.spinner.show();
    // if (this.id == null) {
    //   this.quanLyVonPhiService.trinhDuyetService(request).subscribe(
    //     data => {
    //       if (data.statusCode == 0) {
    //         this.notification.success(MESSAGE.SUCCESS, MESSAGE.SUCCESS);
    //       } else {
    //         this.notification.error(MESSAGE.ERROR, data?.msg);
    //       }
    //     },
    //     err => {
    //       this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    //       console.log(err);
    //     },
    //   );
    // } else {
    //   this.quanLyVonPhiService.updatelist(request).subscribe(res => {
    //     if (res.statusCode == 0) {
    //       this.notification.success(MESSAGE.SUCCESS, MESSAGE.SUCCESS);
    //     } else {
    //       this.notification.error(MESSAGE.ERROR, res?.msg);
    //     }
    //   },err =>{
    //     this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    //   })
    // }
    // this.lstCTietBCao.filter(item => {
    //   if (!item.id) {
    //     item.id = uuid.v4();
    //   }
    // });
    // this.updateEditCache();
    // this.spinner.hide();
  }
}
