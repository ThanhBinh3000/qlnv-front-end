import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import * as uuid from 'uuid';
import * as fileSaver from 'file-saver';
import { Utils } from 'src/app/Utility/utils';
import { UserService } from 'src/app/services/user.service';
import { DatePipe } from '@angular/common';
import { NzNotificationService } from 'ng-zorro-antd/notification';

export class ItemData{

  id:any;
  stt:any;
  maNdungChi:any;
  maNdungChiParent:any;
  maNdungChiChild:any;
  trongDotTcong:any;
  trongDotThoc:any;
  trongDotGao:any;
  luyKeTcong:any;
  luyKeThoc:any;
  luyKeGao:any;
  listCtiet:vatTu[]=[];
  ghiChu:any;
  checked:boolean;
}

export class vatTu{
  id:any;
  maVtu:any;
  loaiMatHang:any;
  colName:any;
  sl:any;
  vt:any;
}

@Component({
  selector:
    'app-lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-DTQG-tai-chi-cuc-mau04a',
  templateUrl:
    './lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-DTQG-tai-chi-cuc-mau04a.component.html',
  styleUrls: [
    './lap-bao-cao-ket-qua-thuc-hien-von-phi-hang-DTQG-tai-chi-cuc-mau04a.component.scss',
  ],
})
export class LapBaoCaoKetQuaThucHienVonPhiHangDTQGTaiChiCucMau04aComponent
  implements OnInit
{
  constructor(
    private quanLyVonPhiService: QuanLyVonPhiService,
    private spinner: NgxSpinnerService,
    private sanitizer: DomSanitizer,
    private nguoiDungSerivce: UserService,
    private datepipe: DatePipe,
    private notification: NzNotificationService,
  ) {}

  async ngOnInit() {
    let userName = this.nguoiDungSerivce.getUserName();
    let userInfor: any = await this.getUserInfo(userName); //get user info
    this.cols = 3;

    if (this.id != null) {
      //call service lay chi tiet
    } else {
      this.trangThaiBanGhi = '1';
      this.nguoinhap = userInfor?.username;
      this.donvitao = userInfor?.dvql;
      this.namBcao = this.currentday.getFullYear();
      this.ngaynhap = this.datepipe.transform(this.currentday, 'dd/MM/yyyy');
      this.maLoaiBacao = '91';
      this.quanLyVonPhiService.sinhMaBaoCao().subscribe(
        (res) => {
          if (res.statusCode == 0) {
            this.mabaocao = res.data;
          } else {
            this.notification.error(
              'Sinh Mã Báo Cáo',
              'Có lỗi trong quá trình vấn tin!',
            );
          }
        },
        (err) => {
          this.notification.error(
            'Sinh Mã Báo Cáo',
            'Có lỗi trong quá trình vấn tin!',
          );
        },
      );
    }

    //get danh muc noi dung
    this.quanLyVonPhiService.dmVattuhanghoa().subscribe(
      (data) => {
        if (data.statusCode == 0) {
          this.listVattu = data.data?.content;
          console.log(this.listVattu);
        } else {
          this.notification.error(
            'Lấy danh sách vật tư',
            'Có lỗi trong quá trình vấn tin!',
          );
        }
      },
      (err) => {
        console.log(err);
        this.notification.error(
          'Lấy danh sách vật tư',
          'Có lỗi trong quá trình vấn tin!',
        );
      },
    );
  }

  statusBtnDel: boolean; // trang thai an/hien nut xoa
  statusBtnSave: boolean; // trang thai an/hien nut luu
  statusBtnApprove: boolean; // trang thai an/hien nut trinh duyet
  statusBtnTBP: boolean; // trang thai an/hien nut truong bo phan
  statusBtnLD: boolean; // trang thai an/hien nut lanh dao
  statusBtnGuiDVCT: boolean; // trang thai nut gui don vi cap tren
  statusBtnDVCT: boolean; // trang thai nut don vi cap tren

  //-------------
  id: any;
  fileList: NzUploadFile[] = [];
  lstFile: any[] = [];
  listFile: File[] = [];
  fileToUpload!: File;
  fileUrl: any;

  ngaynhap: any;
  nguoinhap: any;
  donvitao: any;
  mabaocao: any;
  trangThaiBanGhi: string = '1';
  namBcao: any;
  loaiBaocao: any;
  dotbaocao: any;

  lstCTietBCao: ItemData[] = [];
  listIdDelete: string = '';
  allChecked = false; // check all checkbox
  indeterminate = true; // properties allCheckBox
  status: boolean = false;
  donViTaos: any[] = [];
  userInfor: any;
  currentday: Date = new Date();
  maLoaiBacao: any;
  listColTrongDot: any[] = [];
  listColLuyke: any[] = [];
  cols: number = 0;
  listVattu: any[] = [];
  ObjCol: any;
  listVtuTrongDot: any[] = [];
  listVtuLuyKe: any[] = [];
  lenghtTh=0;


  editCache: { [key: string]: { edit: boolean; data: ItemData } } = {}; // phuc vu nut chinh
  editCache1: { [key: string]: { edit: boolean; data: vatTu } } = {}; // phuc vu nut chinh
  editCache2: { [key: string]: { edit: boolean; data: vatTu } } = {}; // phuc vu nut chinh
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
        // this.getDetailReport();
      }
    });
    this.spinner.hide();
  }

  //get user info
  async getUserInfo(username: string) {
    let userInfo = await this.nguoiDungSerivce
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

  luu() {}


  temparr: vatTu[]=[];
  addCol() {

    
    if(this.ObjCol ==undefined) return
    var colname;
    this.listVattu.forEach(e => {
      if(this.ObjCol == e.id){
        colname = e.tenDm;
      }
    })
    let objTrongdot = {
      id: 0,
      maVtu: this.ObjCol,
      loaiMatHang: 0,
      colName:colname,
      sl: 0,
      vt:this.cols,
    };
    let objLuyke = {
      id: 0,
      maVtu: this.ObjCol,
      loaiMatHang: 1,
      colName:colname,
      sl: 0,
      vt:this.cols,
    };
    this.listColTrongDot.push(objTrongdot);
    this.listColLuyke.push(objLuyke);
    
    this.temparr.push(objTrongdot);
    this.temparr.push(objLuyke);
    this.lstCTietBCao.forEach(e =>{
      e.listCtiet =this.temparr;
    })
    this.cols++;
    this.lenghtTh = this.cols;
    this.updateEditCache();
    console.log(this.listColTrongDot)
    console.log(this.lstCTietBCao)

  }

  addLine(idx: any) {
    var listVtu:vatTu []=[];
    if(this.temparr.length==0){
      listVtu=[]
    }else{
      this.temparr.forEach(e => {
        debugger
        e.id = uuid.v4();
        listVtu.push(e);
      })
    }

    let item = {
      id: uuid.v4(),
      stt: 0,
      maNdungChi: 0,
      maNdungChiParent: 0,
      maNdungChiChild: 0,
      trongDotTcong: 0,
      trongDotThoc: 0,
      trongDotGao: 0,
      luyKeTcong: 0,
      luyKeThoc: 0,
      luyKeGao: 0,
      listCtiet: listVtu,
      ghiChu: 0,
      checked: false,
    };
    this.lstCTietBCao.splice(idx, 0, item);
    this.editCache[item.id] = {
      edit: true,
      data: { ...item },
    };
    console.log(this.lstCTietBCao);
    
  }


  updateEditCache(): void {
    this.lstCTietBCao.forEach((item) => {
      this.editCache[item.id] = {
        edit: false,
        data: { ...item },
      };
    });
  }

  // start edit
  startEdit(id: string): void {
    this.editCache[id].edit = true;
  }

   //update khi sửa
   saveEdit(id: string): void {
    this.editCache[id].data.checked = this.lstCTietBCao.find(
      (item) => item.id === id,
    ).checked; // set checked editCache = checked lstCTietBCao
    const index = this.lstCTietBCao.findIndex((item) => item.id === id); // lay vi tri hang minh sua
    Object.assign(this.lstCTietBCao[index], this.editCache[id].data); // set lai data cua lstCTietBCao[index] = this.editCache[id].data
    this.editCache[id].edit = false; // CHUYEN VE DANG TEXT
    
  }

//hủy thao tác sửa update lại giá trị ban đầu
cancelEdit(id: string): void {
  const index = this.lstCTietBCao.findIndex((item) => item.id === id); // lay vi tri hang minh sua
  this.editCache[id] = {
    data: { ...this.lstCTietBCao[index] },
    edit: false,
  };
}

// xoa dong
deleteById(id: any): void {
  this.lstCTietBCao = this.lstCTietBCao.filter(item => item.id != id)
  if (typeof id == "number") {
    this.listIdDelete += id + ",";
  }
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

  //lay ten trang thai
  getStatusName() {
    const utils = new Utils();
    return utils.getStatusName(this.trangThaiBanGhi);
  }

  //lay ten don vi tạo
  getUnitName() {
    return this.donViTaos.find((item) => item.maDvi == this.donvitao)?.tenDvi;
  }

  //nhom các chức năng phục vụ cho chọn file
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
}
