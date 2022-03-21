import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { Utils } from 'src/app/Utility/utils';
import * as uuid from 'uuid';
import * as fileSaver from 'file-saver';
import { UserService } from 'src/app/services/user.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MESSAGE } from 'src/app/constants/message';

export class ItemData {
  id!: any;
  stt: any;
  maNoiDung: any;
  maNhom: any;
  tongSo: any;
  lstPaGiaoSoKiemTraTcNsnnCtietDvi: ItemDvi[] = [];
  checked!: boolean;
}

export class ItemDvi {
  id!: any;
  khuvucId!: any;
  soTranchi!: any;
}

@Component({
  selector: 'app-xaydungphuongangiaosokiemtratranchiNSNNchocacdonvi',
  templateUrl:
    './xaydungphuongangiaosokiemtratranchiNSNNchocacdonvi.component.html',
  styleUrls: [
    './xaydungphuongangiaosokiemtratranchiNSNNchocacdonvi.component.scss',
  ],
})
export class XaydungphuongangiaosokiemtratranchiNSNNchocacdonviComponent
  implements OnInit
{
  statusBtnDel: boolean; // trang thai an/hien nut xoa
  statusBtnSave: boolean; // trang thai an/hien nut luu
  statusBtnApprove: boolean; // trang thai an/hien nut trinh duyet
  statusBtnTBP: boolean; // trang thai an/hien nut truong bo phan
  statusBtnLD: boolean; // trang thai an/hien nut lanh dao
  statusBtnGuiDVCT: boolean; // trang thai nut gui don vi cap tren
  statusBtnDVCT: boolean; // trang thai nut don vi cap tren

  currentday: Date = new Date();
  //////
  id: any;
  userInfor: any;
  status: boolean = false;
  ngaynhap: any;
  nguoinhap: any;
  donvitao: any;
  maphuongan: any;
  nampa: any;
  namBcaohienhanh: any;
  trangThaiBanGhi: string = '1';
  loaiBaocao: any;

  chiTietBcaos: any;
  lstCTietBCao: ItemData[] = [];
  lstFile: any[] = [];
  listIdFiles: string;
  errorMessage: any;
  donViTaos: any[] = [];
  donvitien: string;

  allChecked = false; // check all checkbox
  indeterminate = true; // properties allCheckBox
  editCache: { [key: string]: { edit: boolean; data: ItemData } } = {}; // phuc vu nut chinh
  listNoidung: any[] = [];
  listNhomchi: any[] = [];
  listIdDelete: string = '';
  fileList: NzUploadFile[] = [];
  listFile: File[] = [];
  fileUrl: any;
  fileToUpload!: File;
  listFileUploaded: any = [];
  maGiao: any;
  checknutgiao: boolean = true;
  listId: string = '';

  //tinh tong
  tongHaNoi: number = 0;
  tongtaybac: number = 0;
  tonghoangliension: number = 0;
  tongvinhphuc: number = 0;
  tongbacthai: number = 0;
  tonghabac: number = 0;
  tonghaihung: number = 0;
  tongdongbac: number = 0;
  tongthaibinh: number = 0;
  tonghanamninh: number = 0;
  tongnghetinh: number = 0;
  tongbinhtrithien: number = 0;
  tongdanang: number = 0;

  constructor(
    private quanLyVonPhiService: QuanLyVonPhiService,
    private spinner: NgxSpinnerService,
    private router: ActivatedRoute,
    private datepipe: DatePipe,
    private sanitizer: DomSanitizer,
    private route: Router,
    private userService:UserService,
    private notification: NzNotificationService,
  ) {}

  async ngOnInit() {
    let userName = this.userService.getUserName();
    let userInfor: any = await this.getUserInfo(userName); //get user info

    //check param dieu huong router
    this.id = this.router.snapshot.paramMap.get('id');

    if (this.id != null) {
      this.getDetailReport();
    } else {
      this.trangThaiBanGhi = '1';
      this.nguoinhap = userInfor?.username;
      this.donvitao = userInfor?.dvql;
      this.namBcaohienhanh = this.currentday.getFullYear();
      this.nampa = this.currentday.getFullYear();
      this.ngaynhap = this.datepipe.transform(this.currentday, 'dd/MM/yyyy');
      this.spinner.show();
      this.quanLyVonPhiService.maPhuongAn().subscribe(
        (res) => {
          if (res.statusCode == 0) {
            this.maphuongan = res.data;
          } else {
            this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
          }
        },
        (err) => {
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        },
      );
    }
    this.quanLyVonPhiService.dMNoiDung().subscribe(
      (res) => {
        if (res.statusCode == 0) {
          this.listNoidung = res.data?.content;
          console.log(this.listNoidung);
        } else {
          this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
        }
      },
      (err) => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      },
    );
    //get danh muc dự án
    this.quanLyVonPhiService.dMNhomChi().subscribe(
      (data) => {
        if (data.statusCode == 0) {
          this.listNhomchi = data.data?.content;
        } else {
          this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
        }
      },
      (err) => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      },
    );
    this.spinner.hide();
    //check role cho các nut trinh duyet
    const utils = new Utils();
    this.statusBtnDel = utils.getRoleDel(
      this.trangThaiBanGhi,
      2,
      userInfor?.roles[0]?.id,
    );
    this.statusBtnSave = utils.getRoleSave(
      this.trangThaiBanGhi,
      2,
      userInfor?.roles[0]?.id,
    );
    this.statusBtnApprove = utils.getRoleApprove(
      this.trangThaiBanGhi,
      2,
      userInfor?.roles[0]?.id,
    );
    this.statusBtnTBP = utils.getRoleTBP(
      this.trangThaiBanGhi,
      2,
      userInfor?.roles[0]?.id,
    );
    this.statusBtnLD = utils.getRoleLD(
      this.trangThaiBanGhi,
      2,
      userInfor?.roles[0]?.id,
    );
    this.statusBtnGuiDVCT = utils.getRoleGuiDVCT(
      this.trangThaiBanGhi,
      2,
      userInfor?.roles[0]?.id,
    );
    this.statusBtnDVCT = utils.getRoleDVCT(
      this.trangThaiBanGhi,
      2,
      userInfor?.roles[0]?.id,
    );
  }

  redirectkehoachvonphi() {
    this.route.navigate(['/qlkh-von-phi/quan-ly-lap-tham-dinh-du-toan-nsnn']);
  }

  //get user info
  async getUserInfo(username: string) {
    let userInfo = await this.userService
      .getUserInfo(username)
      .toPromise()
      .then(
        (data) => {
          if (data?.statusCode == 0) {
            this.userInfor = data?.data;
            return data?.data;
          } else {
          }
        },
        (err) => {
          console.log(err);
        },
      );
    return userInfo;
  }

  // call chi tiet bao cao
  getDetailReport() {
    this.spinner.hide();
    this.quanLyVonPhiService.chitietPhuongAn(this.id).subscribe(
      (data) => {
        if (data.statusCode == 0) {
          this.chiTietBcaos = data.data;
          console.log(data);
          this.lstCTietBCao = data.data.listCtiet;
          // this.maBaoCao = this.chiTietBcaos?.maBcao;
          this.nampa = this.chiTietBcaos.namPa;
          this.namBcaohienhanh = this.chiTietBcaos.namHienHanh;
          this.lstFile = data.data.lstFile;
          this.donvitien = data.data.maDviTien;
          this.trangThaiBanGhi = data.data.trangThai;
          this.maphuongan = data.data.maPa;
          this.donvitao = data.data.maDvi;
          this.nguoinhap = data.data.nguoiTao;
          this.ngaynhap = data.data.ngayTao;
          var soqd = data.data.soQd;
          var socv = data.data.soCv;
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
          this.updateEditCache();
          if (soqd != null && socv != null) {
            this.checknutgiao = false;
          }
         
        } else {
          this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
        }
      },
      (err) => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      },
    );
  }

  //lay ten don vi tạo
  getUnitName() {
    return this.donViTaos.find((item) => item.maDvi == this.donvitao)?.tenDvi;
  }

  getStatusName() {
    const utils = new Utils();
    return utils.getStatusName(this.trangThaiBanGhi);
  }

  //chuc nang trinh duyet len các cap tren
  onSubmit(mcn: String) {
    const requestGroupButtons = {
      id: this.id,
      maChucNang: mcn,
      type: '',
    };
    this.spinner.show();
    this.quanLyVonPhiService.approve(requestGroupButtons).subscribe((data) => {
      if (data.statusCode == 0) {
        this.getDetailReport();
        
      }
    });
    this.spinner.hide();
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
    this.changeInput();
  }

  //chọn row cần sửa và trỏ vào template
  startEdit(id: string): void {
    this.editCache[id].edit = true;
  }

  // them dong moi
  addLine(id: number): void {
    let item: ItemData = {
      id: uuid.v4(),
      stt: 0,
      maNhom: 0,
      maNoiDung: 0,
      tongSo: 0,
      lstPaGiaoSoKiemTraTcNsnnCtietDvi: [
        {
          id: null,
          soTranchi: null,
          khuvucId: 342,
        },
        {
          id: null,
          soTranchi: null,
          khuvucId: 343,
        },
        {
          id: null,
          soTranchi: null,
          khuvucId: 344,
        },
        {
          id: null,
          soTranchi: 0,
          khuvucId: 345,
        },
        {
          id: null,
          soTranchi: 0,
          khuvucId: 346,
        },
        {
          id: null,
          soTranchi: 0,
          khuvucId: 347,
        },
        {
          id: null,
          soTranchi: 0,
          khuvucId: 348,
        },
        {
          id: null,
          soTranchi: 0,
          khuvucId: 349,
        },
        {
          id: null,
          soTranchi: 0,
          khuvucId: 350,
        },
        {
          id: null,
          soTranchi: 0,
          khuvucId: 351,
        },
        {
          id: null,
          soTranchi: 0,
          khuvucId: 354,
        },
        {
          id: null,
          soTranchi: 0,
          khuvucId: 352,
        },
        {
          id: null,
          soTranchi: 0,
          khuvucId: 353,
        },
      ],
      checked: false,
    };

    this.lstCTietBCao.splice(id, 0, item);
    this.editCache[item.id] = {
      edit: true,
      data: { ...item },
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
    this.editCache[id].data.checked = this.lstCTietBCao.find(
      (item) => item.id === id,
    ).checked; // set checked editCache = checked lstCTietBCao
    const index = this.lstCTietBCao.findIndex((item) => item.id === id); // lay vi tri hang minh sua
    Object.assign(this.lstCTietBCao[index], this.editCache[id].data); // set lai data cua lstCTietBCao[index] = this.editCache[id].data
    this.editCache[id].edit = false; // CHUYEN VE DANG TEXT
    this.changeInput();
  }

  //hủy thao tác sửa update lại giá trị ban đầu
  cancelEdit(id: string): void {
    const index = this.lstCTietBCao.findIndex((item) => item.id === id); // lay vi tri hang minh sua
    this.editCache[id] = {
      data: { ...this.lstCTietBCao[index] },
      edit: false,
    };
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
  downloadFile(id: string) {
    let file!: File;
    this.listFile.forEach((element) => {
      if (element?.lastModified.toString() == id) {
        file = element;
      }
    });
    const blob = new Blob([file], { type: 'application/octet-stream' });
    this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      window.URL.createObjectURL(blob),
    );
    fileSaver.saveAs(blob, file.name);
  }

  // xoa file trong bang file
  deleteFile(id: string): void {
    this.lstFile = this.lstFile.filter((a: any) => a.id !== id);
    this.listFile = this.listFile.filter(
      (a: any) => a?.lastModified.toString() !== id,
    );
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
    this.lstCTietBCao.forEach((e) => {
      if (typeof e.id != 'number') {
        e.id = null;
      }
    });
    // donvi tien
    if (this.donvitien == undefined) {
      this.donvitien = '01';
    }
    // gui du lieu trinh duyet len server

    // lay id file dinh kem
    // let idFileDinhKems = '';
    // if(this.lstFile.length!=0){
    //   for (let i = 0; i < this.lstFile.length; i++) {
    //     idFileDinhKems += this.lstFile[i].id + ',';
    //   }
    // }

    // lay id file dinh kem (gửi file theo danh sách )
    let listFileUploaded: any = [];
    for (const iterator of this.listFile) {
      listFileUploaded.push(await this.uploadFile(iterator));
    }
    // gui du lieu trinh duyet len server
    // gui du lieu trinh duyet len server
    let request = {
      id: this.id,
      listIdDeletes: this.listId,
      fileDinhKems: this.listFileUploaded,
      lstPaGiaoSoKiemTraTcNsnnCtiet: this.lstCTietBCao,
      maDvi: this.donvitao,
      maDviTien: this.donvitien,
      maPa: this.maphuongan,
      namHienHanh: this.namBcaohienhanh.toString(),
      namPa: this.nampa,
      trangThai: this.trangThaiBanGhi,
    };
    if (this.id == null) {
      this.quanLyVonPhiService.themmoiPhuongAn(request).subscribe(
        (res) => {
          if (res.statusCode == 0) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
          } else {
            this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
          }
        },
        (err) => {
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        },
      );
    } else {
      this.quanLyVonPhiService.capnhatPhuongAn(request).subscribe(
        (res) => {
          if (res.statusCode == 0) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
          } else {
            this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
          }
        },
        (err) => {
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        },
      );
    }
    this.spinner.show();
    // console.log(request);

    this.updateEditCache();
    this.spinner.hide();
  }

  updateEditCache(): void {
    this.lstCTietBCao.forEach((item) => {
      this.editCache[item.id] = {
        edit: false,
        data: { ...item },
      };
    });
  }

  //upload file
  async uploadFile(file: File) {
    // day file len server
    const upfile: FormData = new FormData();
    upfile.append('file', file);
    upfile.append('folder', this.maphuongan + '/' + this.donvitao + '/');
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
          console.log('false :', err);
        },
      );
    return temp;
  }

  lstQlnvKhvonphiDsachGiaoSo: any[] = [];
  //giao
  giao(madvinhan: any) {
    this.quanLyVonPhiService.maGiao().subscribe((res) => {
      this.maGiao = res.data;

      console.log(this.maGiao);
      this.lstCTietBCao.forEach((e) => {
        var manoidung = e.maNoiDung;
        var manhom = e.maNhom;
        var arr = e.lstPaGiaoSoKiemTraTcNsnnCtietDvi;
        var soduocgiao;
        arr.forEach((el) => {
          if (el.khuvucId == madvinhan) {
            soduocgiao = el.soTranchi;
          }
        });
        let ob = {
          maDviNhan: madvinhan.toString(),
          maDviTao: this.donvitao,
          maDviTien: this.donvitien,
          maGiao: this.maGiao,
          maNhom: manhom,
          maNoiDung: manoidung,
          maPa: this.maphuongan,
          namGiao: this.namBcaohienhanh,
          soDuocGiao: soduocgiao,
        };
        this.lstQlnvKhvonphiDsachGiaoSo.push(ob);
      });
      let req = {
        lstQlnvKhvonphiDsachGiaoSo: this.lstQlnvKhvonphiDsachGiaoSo,
      };
      console.log(req);
      this.quanLyVonPhiService.giaoSoTranChi(req).subscribe((res) => {
        if(res.statusCode==0){
          this.notification.success(MESSAGE.SUCCESS, "Giao số trần chi thành công!");
        }else{
          this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
        }
      },err => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      });
    });
  }

  //giao toan bo
  giaotoanbo() {
    this.quanLyVonPhiService.maGiao().subscribe((res) => {
      this.maGiao = res.data;
      this.lstCTietBCao.forEach((e) => {
        var manoidung = e.maNoiDung;
        var nhom = e.maNhom;
        var madonvinhan;
        var array = e.lstPaGiaoSoKiemTraTcNsnnCtietDvi;
        var soduocgiao;

        array.forEach((el) => {
          madonvinhan = el.khuvucId;
          soduocgiao = el.soTranchi;
          let ob = {
            maDviNhan: madonvinhan.toString(),
            maDviTao: this.donvitao,
            maDviTien: this.donvitien,
            maGiao: this.maGiao,
            maNhom: nhom,
            maNoiDung: manoidung,
            maPa: this.maphuongan,
            namGiao: this.namBcaohienhanh,
            soDuocGiao: soduocgiao,
          };
          this.lstQlnvKhvonphiDsachGiaoSo.push(ob);
        });
      });
      let req = {
        lstQlnvKhvonphiDsachGiaoSo: this.lstQlnvKhvonphiDsachGiaoSo,
      };
      console.log(req);
      this.quanLyVonPhiService.giaoSoTranChi(req).subscribe((res) => {
        if(res.statusCode==0){
          this.notification.success(MESSAGE.SUCCESS, "Giao số trần chi thành công!");
        }else{
          this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
        }
      },err=> {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      });
    });
  }

  changeInput() {
    this.tongHaNoi = 0;
    this.tongtaybac = 0;
    this.tonghoangliension = 0;
    this.tongvinhphuc = 0;
    this.tongbacthai = 0;
    this.tonghabac = 0;
    this.tonghaihung = 0;
    this.tongdongbac = 0;
    this.tongthaibinh = 0;
    this.tonghanamninh = 0;
    this.tongnghetinh = 0;
    this.tongbinhtrithien = 0;
    this.tongdanang = 0;

    this.lstCTietBCao.filter((item) => {
     
      item.lstPaGiaoSoKiemTraTcNsnnCtietDvi.filter((itemCtiet) => {
        debugger
        if (itemCtiet.khuvucId == 342) {
          this.tongHaNoi +=
            typeof itemCtiet.soTranchi == 'number' ? itemCtiet.soTranchi : 0;
        }
        if (itemCtiet.khuvucId == 343) {
          this.tongtaybac +=
            typeof itemCtiet.soTranchi == 'number' ? itemCtiet.soTranchi : 0;
        }
        if (itemCtiet.khuvucId == 344) {
          this.tonghoangliension +=
            typeof itemCtiet.soTranchi == 'number' ? itemCtiet.soTranchi : 0;
        }
        if (itemCtiet.khuvucId == 345) {
          this.tongvinhphuc +=
            typeof itemCtiet.soTranchi == 'number' ? itemCtiet.soTranchi : 0;
        }
        if (itemCtiet.khuvucId == 346) {
          this.tongbacthai +=
            typeof itemCtiet.soTranchi == 'number' ? itemCtiet.soTranchi : 0;
        }
        if (itemCtiet.khuvucId == 347) {
          this.tonghabac +=
            typeof itemCtiet.soTranchi == 'number' ? itemCtiet.soTranchi : 0;
        }
        if (itemCtiet.khuvucId == 348) {
          this.tonghaihung +=
            typeof itemCtiet.soTranchi == 'number' ? itemCtiet.soTranchi : 0;
        }
        if (itemCtiet.khuvucId == 349) {
          this.tongdongbac +=
            typeof itemCtiet.soTranchi == 'number' ? itemCtiet.soTranchi : 0;
        }
        if (itemCtiet.khuvucId == 350) {
          this.tongthaibinh +=
            typeof itemCtiet.soTranchi == 'number' ? itemCtiet.soTranchi : 0;
        }
        if (itemCtiet.khuvucId == 351) {
          this.tonghanamninh +=
            typeof itemCtiet.soTranchi == 'number' ? itemCtiet.soTranchi : 0;
        }
        if (itemCtiet.khuvucId == 354) {
          this.tongnghetinh +=
            typeof itemCtiet.soTranchi == 'number' ? itemCtiet.soTranchi : 0;
        }
        if (itemCtiet.khuvucId == 352) {
          this.tongbinhtrithien +=
            typeof itemCtiet.soTranchi == 'number' ? itemCtiet.soTranchi : 0;
        }
        if (itemCtiet.khuvucId == 353) {
          this.tongdanang +=
            typeof itemCtiet.soTranchi == 'number' ? itemCtiet.soTranchi : 0;
        }
      });
    });
  }

  tinhtong(id:any){
    var sum =0;
    this.editCache[id].data.lstPaGiaoSoKiemTraTcNsnnCtietDvi.forEach(e => {
      sum +=Number(e.soTranchi);
    })
    this.editCache[id].data.tongSo = sum;
    var index = this.lstCTietBCao.findIndex(item => item.id == id);
    Object.assign(this.lstCTietBCao[index] ,this.editCache[id].data);
  }

  updateSumtCache(): void {
    this.lstCTietBCao.forEach((item) => {
      var arr = item.lstPaGiaoSoKiemTraTcNsnnCtietDvi;
      const index = item.id;
      arr.forEach(el => {
        item.tongSo += Number(el.soTranchi)
      })
       // lay vi tri hang minh sua
     // set lai data cua lstCTietBCao[index] = this.editCache[id].data
    
     
      })
  }
}
