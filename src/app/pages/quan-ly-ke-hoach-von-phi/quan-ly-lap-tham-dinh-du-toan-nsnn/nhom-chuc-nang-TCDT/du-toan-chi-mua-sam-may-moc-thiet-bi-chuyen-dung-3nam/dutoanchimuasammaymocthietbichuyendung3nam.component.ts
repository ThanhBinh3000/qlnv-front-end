import { DatePipe, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserService } from 'src/app/services/user.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { divMoney, DONVITIEN, mulMoney, QLNV_KHVONPHI_TC_DTOAN_CHI_MSAM_MMOC_TBI_CHUYEN_DUNG_GD3N, Utils } from 'src/app/Utility/utils';
import * as uuid from "uuid";
import * as fileSaver from 'file-saver';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MESSAGE } from 'src/app/constants/message';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { miniData } from '../du-toan-phi-xuat-hang-dtqg-hang-nam-vtct/du-toan-phi-xuat-hang-dtqg-hang-nam-vtct.component';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export class MiniData {
  id!: any;
  maDvi!: string;
  n1!: number;
  n2!: number;
  n3!: number;
}

export class ItemData {
  id!: any;
  stt!: number;
  maVtuTbi!: String;
  tcongN1!: number;
  tcongN2!: number;
  tcongN3!: number;
  checked!: boolean;
  listCtiet!: MiniData[];
}

@Component({
  selector: 'app-dutoanchimuasammaymocthietbichuyendung3nam',
  templateUrl: './dutoanchimuasammaymocthietbichuyendung3nam.component.html',
  styleUrls: ['./dutoanchimuasammaymocthietbichuyendung3nam.component.scss']
})
export class Dutoanchimuasammaymocthietbichuyendung3namComponent implements OnInit {
  currentday: Date = new Date();
  //////
  id: any;
  maLoaiBacao: string = QLNV_KHVONPHI_TC_DTOAN_CHI_MSAM_MMOC_TBI_CHUYEN_DUNG_GD3N;
  userInfo: any;
  maDvi: any;
  nam: any;
  errorMessage!: String;
  chiTieus: any = [];                         // danh muc chi tieu
  lstRows: any = [];
  donVis: any = [];
  cucKhuVucs: any = [];                       // danh muc cuc khu vuc
  chiTietBcaos: any;                          // thong tin chi tiet bao cao
  lstCTietBCao: ItemData[] = [];              // list chi tiet bao cao
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
  maLoaiBaoCao: string = QLNV_KHVONPHI_TC_DTOAN_CHI_MSAM_MMOC_TBI_CHUYEN_DUNG_GD3N;                // nam bao cao
  maDviTien: string;                   // ma don vi tien
  newDate = new Date();                       //
  fileToUpload!: File;                        // file tai o input
  listFile: File[] = [];                      // list file chua ten va id de hien tai o input
  box1 = true;                                // bien de an hien box1
  fileUrl: any;                               // url
  listIdDelete: string = "";                  // list id delete
  listIdDeleteVtus: string = "";
  listDonViTien:any []= DONVITIEN;

  statusBtnDel: boolean;                       // trang thai an/hien nut xoa
  statusBtnSave: boolean;                      // trang thai an/hien nut luu
  statusBtnApprove: boolean;                   // trang thai an/hien nut trinh duyet
  statusBtnTBP: boolean;                       // trang thai an/hien nut truong bo phan
  statusBtnLD: boolean;                        // trang thai an/hien nut lanh dao
  statusBtnGuiDVCT: boolean;                   // trang thai nut gui don vi cap tren
  statusBtnDVCT: boolean;                      // trang thai nut don vi cap tren
  statusBtnLDDC:boolean;  // trang thai nut lanh dao dieu chinh so tran chi
  statusBtnCopy:boolean; // trang thai nut copy
  statusBtnPrint:boolean; // trang thai nut in
  
  listIdDeleteFiles: string = '';                        // id file luc call chi tiet


  allChecked = false;                         // check all checkbox
  indeterminate = true;                       // properties allCheckBox
  editCache: { [key: string]: { edit: boolean; data: ItemData } } = {};     // phuc vu nut chinh

  fileList: NzUploadFile[] = [];

  constructor(
    private userService: UserService,
    private quanLyVonPhiService: QuanLyVonPhiService,
    private danhMucService: DanhMucHDVService,
    private spinner: NgxSpinnerService,
    private router: ActivatedRoute,
    private datepipe: DatePipe,
    private sanitizer: DomSanitizer,
    private route: Router,
    private notification: NzNotificationService,
    private location: Location,
  ) { }

  async ngOnInit() {
    await this.danhMucService.dMDonVi().toPromise().then(data => {
      if (data.statusCode == 0) {
        this.donVis = data.data;
        this.cucKhuVucs = this.donVis.filter(item => item.capDvi=='2');
      } else {
        this.notification.error(MESSAGE.ERROR, data?.msg);
      }
    }, err => {
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    })

    let userName = this.userService.getUserName();
    await this.getUserInfo(userName); //get user info

    //check param dieu huong router
    this.id = this.router.snapshot.paramMap.get('id');
    this.maDvi = this.router.snapshot.paramMap.get('maDvi');
    this.maLoaiBacao = this.router.snapshot.paramMap.get('maLoaiBacao');
    this.nam = this.router.snapshot.paramMap.get('nam');

    if (this.id != null) {
      await this.getDetailReport();
    } else if (
      this.maDvi != null &&
      this.maLoaiBacao != null &&
      this.nam != null
    ) {
      this.calltonghop();
      this.nguoiNhap = this.userInfo?.username;
      this.ngayNhap = this.datepipe.transform(this.currentday, 'dd/MM/yyyy');
      this.maDonViTao = this.userInfo?.dvql;
      this.quanLyVonPhiService.sinhMaBaoCao().subscribe(
        (res) => {
          if (res.statusCode == 0) {
            this.maBaoCao = res.data;
          } else {
            this.notification.error(MESSAGE.ERROR, res?.msg);
          }
        },
        (err) => {
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        },
      );
    } else {
      this.trangThaiBanGhi = '1';
      this.nguoiNhap = this.userInfo?.username;
      this.maDonViTao = this.userInfo?.dvql;
      this.namBaoCaoHienHanh = this.currentday.getFullYear();
      this.ngayNhap = this.datepipe.transform(this.currentday, 'dd/MM/yyyy');
      this.maLoaiBacao = QLNV_KHVONPHI_TC_DTOAN_CHI_MSAM_MMOC_TBI_CHUYEN_DUNG_GD3N;
      this.spinner.show();
      this.quanLyVonPhiService.sinhMaBaoCao().subscribe(
        (res) => {
          if (res.statusCode == 0) {
            this.maBaoCao = res.data;
          } else {
            this.notification.error(MESSAGE.ERROR, res?.msg);
          }
        },
        (err) => {
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        },
      );
    }
    //get danh muc chi tiêu
    await this.danhMucService.dMThietBi().toPromise().then(
      (data) => {
        if (data.statusCode == 0) {
          this.chiTieus = data.data?.content;
        } else {
          this.notification.error(MESSAGE.ERROR, data?.msg);
        }
      },
      (err) => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
    );

    // this.danhMucService.dMCucKhuVuc().toPromise().then(data => {
    //   if (data.statusCode == 0) {
    //     this.cucKhuVucs = data.data;
       
    //   } else {
    //     this.notification.error(MESSAGE.ERROR, data?.msg);
    //   }
    // }, err => {
    //   this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    // })
    this.getStatusButton();
    this.spinner.hide();
    //check role cho các nut trinh duyet
  }

  redirectkehoachvonphi() {
    // this.route.navigate(['/qlkh-von-phi/quan-ly-lap-tham-dinh-du-toan-nsnn/tim-kiem']);
    this.location.back()
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
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
    );
  }

  getStatusButton() {
    let checkParent = false;
    let checkChirld = false;
    let dVi = this.donVis.find(e => e.maDvi == this.maDonViTao);
    if(dVi && dVi.maDvi == this.userInfo.dvql){ 
      checkChirld = true;
    }
    if(dVi && dVi.parent?.maDvi == this.userInfo.dvql){
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

  // call chi tiet bao cao
  async getDetailReport() {
    this.spinner.show();
    await this.quanLyVonPhiService.bCLapThamDinhDuToanChiTiet(this.id).toPromise().then(
      (data) => {
        if (data.statusCode == 0) {
          this.lstCTietBCao = data.data.lstCTietBCao;
          this.maDviTien = data.data.maDviTien;
          this.lstCTietBCao.forEach(data => {
            var mm: MiniData[] = [];
            this.cucKhuVucs.forEach(item => {
              mm.push(data.listCtiet.find(e => e.maDvi == item.maDvi));
            })
            data.listCtiet = mm;
          })
          this.divMoneyTotal();
          this.updateEditCache();
          this.lstFile = data.data.lstFile;
          this.maLoaiBacao = QLNV_KHVONPHI_TC_DTOAN_CHI_MSAM_MMOC_TBI_CHUYEN_DUNG_GD3N;
          // set thong tin chung bao cao
          this.ngayNhap = this.datepipe.transform(data.data.ngayTao,'dd/MM/yyyy');
          this.nguoiNhap = data.data.nguoiTao;
          this.maDonViTao = data.data.maDvi;
          this.maBaoCao = data.data.maBcao;
          this.namBaoCaoHienHanh = data.data.namHienHanh;
          this.trangThaiBanGhi = data.data.trangThai;
          if (this.trangThaiBanGhi == Utils.TT_BC_1 ||
            this.trangThaiBanGhi == Utils.TT_BC_3 ||
            this.trangThaiBanGhi == Utils.TT_BC_5 ||
            this.trangThaiBanGhi == Utils.TT_BC_8 ||
            this.trangThaiBanGhi == Utils.TT_BC_10) {
            this.status = false;
          } else {
            this.status = true;
          }
          this.listFile =[];
        } else {
          this.notification.error(MESSAGE.ERROR, data?.msg);
        }
      },
      (err) => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      },
    );
    this.spinner.hide();
  }

  //lay ten don vi tạo
  getUnitName() {
    return this.donVis.find(item => item.maDvi == this.maDonViTao)?.tenDvi;
  }

  getStatusName() {
    const utils = new Utils();
    return utils.getStatusName(this.trangThaiBanGhi);
  }

  // chuc nang check role
  async onSubmit(mcn: String) {
    const requestGroupButtons = {
      id: this.id,
      maChucNang: mcn,
      type: "",
    };
    if(this.id){
      this.spinner.show();
      this.quanLyVonPhiService.approve(requestGroupButtons).toPromise().then(async (data) => {
        if (data.statusCode == 0) {
          await this.getDetailReport();
          this.getStatusButton();
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.APPROVE_SUCCESS);
        } else {
          this.notification.error(MESSAGE.ERROR, data?.msg);
        }
      }, err => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      });
      this.spinner.hide();
    }else{
      this.notification.warning(MESSAGE.WARNING, MESSAGE.MESSAGE_DELETE_WARNING);
    }
    
  }

  //check all input
  updateAllChecked(): void {
    this.indeterminate = false;
    if (this.allChecked) {
      this.lstCTietBCao = this.lstCTietBCao.map((item) => ({
        ...item,
        checked: true,
      }));
    } else {
      this.lstCTietBCao = this.lstCTietBCao.map((item) => ({
        ...item,
        checked: false,
      }));
    }
  }

  // xoa dong
  deleteById(id: any): void {
    this.lstCTietBCao = this.lstCTietBCao.filter((item) => item.id != id);
    if (typeof id == 'number') {
      this.listIdDelete += id + ',';
    }
  }

  //chọn row cần sửa và trỏ vào template
  startEdit(id: string): void {
    console.log(this.editCache[id].data);
    
    this.editCache[id].edit = true;
  }

  // them dong moi
  addLine(id: number): void {
    var data: MiniData[] = [];
    var data1: MiniData[] = [];
    this.cucKhuVucs.forEach(item => {
      var mm: MiniData = {
        id: uuid.v4(),
        maDvi: item.maDvi,
        n1: 0,
        n2: 0,
        n3: 0,
      }
      var mm1: MiniData = {
        id: mm.id,
        maDvi: item.maDvi,
        n1: 0,
        n2: 0,
        n3: 0,
      }
      data.push(mm);
      data1.push(mm1);
    })

    let item: ItemData = {
      id: uuid.v4(),
      stt: 0,
      maVtuTbi: '',
      tcongN1: 0,
      tcongN2: 0,
      tcongN3: 0,
      listCtiet: data,
      checked: false,
    };

    let item1: ItemData = {
      id: uuid.v4(),
      stt: 0,
      maVtuTbi: '',
      tcongN1: 0,
      tcongN2: 0,
      tcongN3: 0,
      listCtiet: data1,
      checked: false,
    };

    this.lstCTietBCao.splice(id, 0, item);
    this.editCache[item.id] = {
      edit: true,
      data: { ...item1 },
    };
  }

  //checkox trên tùng row
  updateSingleChecked(): void {
    if (this.lstCTietBCao.every((item) => !item.checked)) {
      this.allChecked = false;
      this.indeterminate = false;
    } else if (this.lstCTietBCao.every((item) => item.checked)) {
      this.allChecked = true;
      this.indeterminate = false;
    } else {
      this.indeterminate = true;
    }
  }

  //update khi sửa
  saveEdit(id: string): void {
    if (!this.editCache[id].data.maVtuTbi) {
      this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
      return;
    }
    var arr = this.editCache[id].data.listCtiet;
    let checkNam:boolean;
    arr.forEach(e =>{
      if( (!e.n1 && e.n1!==0) || (!e.n2 && e.n2!==0) || (!e.n3 && e.n3!==0)){
        checkNam = true;
      }
    })
    if(checkNam){
      this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
      return;
    }
    this.editCache[id].data.checked = this.lstCTietBCao.find((item) => item.id === id).checked; // set checked editCache = checked lstCTietBCao
    const index = this.lstCTietBCao.findIndex((item) => item.id === id); // lay vi tri hang minh sua
    this.lstCTietBCao[index].maVtuTbi = this.editCache[id].data.maVtuTbi;
    this.editCache[id].data.listCtiet.forEach(item => {
      var ind: number = this.lstCTietBCao[index].listCtiet.findIndex(e => e.maDvi === item.maDvi);
      this.lstCTietBCao[index].listCtiet[ind].n1 = item.n1;
      this.lstCTietBCao[index].listCtiet[ind].n2 = item.n2;
      this.lstCTietBCao[index].listCtiet[ind].n3 = item.n3;
    });
    this.editCache[id].edit = false; // CHUYEN VE DANG TEXT
    this.tinhTong(index);
  }

  //hủy thao tác sửa update lại giá trị ban đầu
  cancelEdit(id: string): void {
    const index = this.lstCTietBCao.findIndex((item) => item.id === id); // lay vi tri hang minh sua
    this.lstCTietBCao[index].listCtiet.forEach(item => {
      var ind: number = this.editCache[id].data.listCtiet.findIndex(e => e.maDvi === item.maDvi);
      this.editCache[id].data.listCtiet[ind].n1 = item.n1;
      this.editCache[id].data.listCtiet[ind].n2 = item.n2;
      this.editCache[id].data.listCtiet[ind].n3 = item.n3;
    });
    this.editCache[id].edit = false;
  }

  beforeUpload = (file: NzUploadFile): boolean => {
    this.fileList = this.fileList.concat(file);
    return false;
  };

  handleUpload(): void {
    this.fileList.forEach((file: any) => {
      const id = file?.lastModified.toString();
      this.lstFile.push({ id: id, fileName: file?.name });
      this.listFile.push(file);
    });
    this.fileList = [];
  }

  //event ng dung thay doi file
  selectFile(files: FileList): void {
    this.fileToUpload = files.item(0);
  }

  //download file về máy tính
  async downloadFile(id: string) {
    let file!: File;
    file = this.listFile.find(element => element?.lastModified.toString() == id );
    if(!file){
      let fileAttach = this.lstFile.find(element => element?.id == id );
      if(fileAttach){
        await this.quanLyVonPhiService.downloadFile(fileAttach.fileUrl).toPromise().then(
          (data) => {
            fileSaver.saveAs(data, fileAttach.fileName);
          },
          err => {
            this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
          },
        );
      }
    }else{
      const blob = new Blob([file], { type: "application/octet-stream" });
      fileSaver.saveAs(blob, file.name);
    }
  }

  // xoa file trong bang file
  deleteFile(id: string): void {
    this.lstFile = this.lstFile.filter((a: any) => a.id !== id);
    this.listFile = this.listFile.filter(
      (a: any) => a?.lastModified.toString() !== id,
    );
    this.listIdDeleteFiles +=id+',';
  }

  // xóa với checkbox
  deleteSelected() {
    // add list delete id
    this.lstCTietBCao.filter((item) => {
      if (item.checked == true && typeof item.id == 'number') {
        this.listIdDelete += item.id + ',';
      }
    });
    // delete object have checked = true
    this.lstCTietBCao = this.lstCTietBCao.filter(
      (item) => item.checked != true,
    );
    this.allChecked = false;
  }

  // luu
  async luu() {
    
    let checkSaveEdit;
    if(!this.maDviTien || !this.namBaoCaoHienHanh){
      this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
      return;
    }
    if (this.namBaoCaoHienHanh >= 3000 || this.namBaoCaoHienHanh < 1000){
      this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.WRONG_FORMAT);
      return;
    }
    this.lstCTietBCao.forEach(e => {
      if (this.editCache[e.id].edit === true) {
        checkSaveEdit = false
      }
    })
    if (checkSaveEdit == false) {
      this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTSAVE);
      return;
    }
    this.mullMoneyTotal();
    this.lstCTietBCao.forEach(e => {
      if (typeof e.id != "number") {
        e.id = null;
      }
      e.listCtiet.forEach(item => {
        if (typeof item.id != "number"){
          item.id = null;
        }
      })
    })
    
    // gui du lieu trinh duyet len server
   
    let listFile: any = [];
    for (const iterator of this.listFile) {
      listFile.push(await this.uploadFile(iterator));
    }
    // gui du lieu trinh duyet len server
    let request = {
      id: this.id,
      fileDinhKems: listFile,
      listIdDeleteFiles: this.listIdDeleteFiles, // lay id file dinh kem (gửi file theo danh sách )
      listIdDeletes: this.listIdDelete, 
      lstCTietBCao: this.lstCTietBCao,
      maBcao: this.maBaoCao,
      maDvi: this.maDonViTao,
      maDviTien: this.maDviTien,
      maLoaiBcao: this.maLoaiBacao,
      namBcao: this.namBaoCaoHienHanh+1,
      namHienHanh: this.namBaoCaoHienHanh,
    };
    this.spinner.show();
    if (this.id == null) {
      this.quanLyVonPhiService.trinhDuyetService(request).toPromise().then(
        async (res) => {
          if (res.statusCode == 0) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
            this.id = res.data.id;
            await this.getDetailReport();
            this.getStatusButton();
          } else {
            this.divMoneyTotal();
            this.notification.error(MESSAGE.ERROR, res?.msg);
          }
        }, err => {
          this.divMoneyTotal();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        });
    } else {
      this.quanLyVonPhiService.updatelist(request).toPromise().then(
        async (data) => {
          if (data.statusCode == 0) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
            this.id = data.data.id;
            await this.getDetailReport();
            this.getStatusButton();
          } else {
            this.divMoneyTotal();
            this.notification.error(MESSAGE.ERROR, data?.msg);
          }
        },
        (err) => {
          this.divMoneyTotal();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        },
      );
    }
    this.lstCTietBCao.forEach(item => {
      if (!item.id) {
        item.id = uuid.v4();
      }
      item.listCtiet.forEach(e => {
        if (!e.id){
          e.id = uuid.v4();
        }
      })
    })
    this.updateEditCache();
    this.spinner.hide();
  }

  updateEditCache(): void {
    this.lstCTietBCao.forEach(data => {
      var ss: MiniData[] = [];
      data.listCtiet.forEach(item => {
        var mm: MiniData = {
          id: item.id,
          maDvi: item.maDvi,
          n1: item.n1,
          n2: item.n2,
          n3: item.n3,
        }
        ss.push(mm);
      })
      var mm: ItemData = {
        id: data.id,
        stt: data.stt,
        checked: false,
        maVtuTbi: data.maVtuTbi,
        tcongN1: data.tcongN1,
        tcongN2: data.tcongN2,
        tcongN3: data.tcongN3,
        listCtiet: ss,
      }
      this.editCache[data.id] = {
        edit: false,
        data: { ...mm }
      };
    })
  }

  //upload file
  async uploadFile(file: File) {
    // day file len server
    const upfile: FormData = new FormData();
    upfile.append('file', file);
    upfile.append('folder', this.maBaoCao + '/' + this.maDonViTao);
    let temp = await this.quanLyVonPhiService
      .uploadFile(upfile)
      .toPromise()
      .then(
        (data) => {
          let objfile = {
            fileName: data.filename,
            fileSize: data.size,
            fileUrl: data.url,
          };
          return objfile;
        },
        (err) => {
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        },
      );
    return temp;
  }


  //call tong hop
  calltonghop() {
    
    this.maDviTien = '1';
    let objtonghop = {
      maDvi: this.maDvi,
      maLoaiBcao: this.maLoaiBacao,
      namHienTai: this.nam,
    }
    this.spinner.show();
    this.quanLyVonPhiService.tongHop(objtonghop).subscribe(res => {
      if (res.statusCode == 0) {
        this.lstCTietBCao = res.data;
        this.namBaoCaoHienHanh = this.currentday.getFullYear();
        if (this.lstCTietBCao == null) {
          this.lstCTietBCao = [];
        }else{
         
          this.lstCTietBCao.forEach(e => {
              this.cucKhuVucs.forEach(item => {
                var idx = e.listCtiet.findIndex( (i) => i.maDvi ==item.maDvi);
                if(idx==-1){
                    var obJect = {
                      id!: uuid.v4(),
                      maDvi: item.maDvi,
                      n1: 0,
                      n2: 0,
                      n3: 0,
                    }
                  e.listCtiet.push(obJect);
                }else{
                  e.listCtiet[idx].id = uuid.v4();
                }
              })
            
            const index = this.lstCTietBCao.findIndex((item) => item.id === e.id);
            this.tinhTong(index); 
            e.id = uuid.v4();
          })
          
          this.updateEditCache();
          console.log(this.lstCTietBCao);
        }
        
      } else {
        this.notification.error(MESSAGE.ERROR, res?.msg);
      }
    }, err => {
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    });
    // this.quanLyVonPhiService.sinhMaBaoCao().subscribe(res => {
    //   if (res.statusCode == 0) {
    //     this.maBaoCao = res.data;
    //   } else {
    //     this.notification.error(MESSAGE.ERROR, res?.msg);
    //   }
    // },err => {
    //   this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR)
    // })
    this.spinner.hide();
  }

  tinhTong(index: any) {
    this.lstCTietBCao[index].tcongN1 = 0;
    this.lstCTietBCao[index].tcongN2 = 0;
    this.lstCTietBCao[index].tcongN3 = 0;
    this.lstCTietBCao[index].listCtiet.forEach(item => {
      this.lstCTietBCao[index].tcongN1 += item.n1;
      this.lstCTietBCao[index].tcongN2 += item.n2;
      this.lstCTietBCao[index].tcongN3 += item.n3;
    })
  }

 
  dong(){
    this.location.back();
  }

  xoaBaoCao(){
    if(this.id){
      this.quanLyVonPhiService.xoaBaoCao(this.id).toPromise().then( async res => {
        if(res.statusCode==0){
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.DELETE_SUCCESS);
          this.location.back();
        }else {
          this.notification.error(MESSAGE.ERROR, res?.msg);
        }
      },err => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      })
      }else {
        this.notification.warning(MESSAGE.WARNING, MESSAGE.MESSAGE_DELETE_WARNING)
      }
    }

     // action copy
   async doCopy(){
    this.spinner.show();

    let maBaoCao = await this.quanLyVonPhiService.sinhMaBaoCao().toPromise().then(
      (data) => {
        if (data.statusCode == 0) {
          return data.data;
        } else {
          this.notification.error(MESSAGE.ERROR, data?.msg);
          return null;
        }
      },
      (err) => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
        return null;
      }
    );
    if (!maBaoCao) {
      return;
    }
    this.mullMoneyTotal();
    // replace nhung ban ghi dc them moi id thanh null
    let lstTemp = [];
    this.lstCTietBCao.filter( item =>{
      lstTemp.push({
        ...item,
        id:null
      })
    })
    
   
    // gui du lieu trinh duyet len server
    let request = {
      id: null,
      fileDinhKems: null,
      listIdDeleteFiles: null,
      listIdDeletes: null,  
      lstCTietBCao: lstTemp,
      maBcao: maBaoCao,
      maDvi: this.maDonViTao,
      maDviTien: this.maDviTien,
      maLoaiBcao: this.maLoaiBacao,
      namBcao: this.namBaoCaoHienHanh +1,
      namHienHanh: this.namBaoCaoHienHanh,
    };
    this.quanLyVonPhiService.trinhDuyetService(request).toPromise().then(
      async data => {
        if (data.statusCode == 0) {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.COPY_SUCCESS);
          this.id = data.data.id;
          await this.getDetailReport();
          this.getStatusButton();
          this.route.navigateByUrl('/qlkh-von-phi/quan-ly-lap-tham-dinh-du-toan-nsnn/du-toan-chi-ung-dung-cntt-giai-doan-3nam/' + this.id);
        } else {
          this.notification.error(MESSAGE.ERROR, data?.msg);
          this.divMoneyTotal();
        }
      },
      err => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        this.divMoneyTotal();
      },
    );

    this.lstCTietBCao.filter(item => {
      if (!item.id) {
        item.id = uuid.v4();
      }
    });

    this.updateEditCache();
    this.spinner.hide();
  }

  // action print
  doPrint(){
    let WindowPrt = window.open(
      '',
      '',
      'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0',
    );
    let printContent = '';
    printContent = printContent + '<div> <div>';
    printContent =
      printContent + document.getElementById('tablePrint').innerHTML;
    printContent = printContent + '</div> </div>';
    WindowPrt.document.write(printContent);
    WindowPrt.document.close();
    WindowPrt.focus();
    WindowPrt.print();
    WindowPrt.close();
  }

  mullMoneyTotal(){
    this.lstCTietBCao.filter(item =>{
      item.listCtiet.forEach( e =>{
        e.n1 = mulMoney(e.n1, this.maDviTien);
        e.n2 = mulMoney(e.n2, this.maDviTien);
        e.n3 = mulMoney(e.n3, this.maDviTien);
      })
      item.tcongN1 = mulMoney(item.tcongN1, this.maDviTien);
      item.tcongN2 = mulMoney(item.tcongN2, this.maDviTien);
      item.tcongN3 = mulMoney(item.tcongN3, this.maDviTien);
    })
  }

  divMoneyTotal(){
    this.lstCTietBCao.filter( item =>{
      item.listCtiet.forEach( e =>{
        e.n1 =divMoney(e.n1, this.maDviTien);
        e.n2 = divMoney(e.n2, this.maDviTien);
        e.n3 = divMoney(e.n3, this.maDviTien);
      })
      item.tcongN1 = divMoney(item.tcongN1, this.maDviTien);
      item.tcongN2 = divMoney(item.tcongN2, this.maDviTien);
      item.tcongN3 = divMoney(item.tcongN3, this.maDviTien);
    })
  }
}
