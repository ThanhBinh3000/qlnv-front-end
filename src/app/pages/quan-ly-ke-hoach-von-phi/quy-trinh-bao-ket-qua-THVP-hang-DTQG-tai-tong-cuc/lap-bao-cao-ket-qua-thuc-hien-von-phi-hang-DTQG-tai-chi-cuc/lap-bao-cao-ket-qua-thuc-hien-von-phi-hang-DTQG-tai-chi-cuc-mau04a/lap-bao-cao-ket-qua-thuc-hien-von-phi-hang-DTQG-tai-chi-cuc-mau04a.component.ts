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
  parentId:any;
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


export class linkList {
    id:any;
    vt:any;
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
    parentId:any;
    ghiChu:any;
    next:linkList[];
    checked:boolean;
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
    const utils = new Utils();
    this.statusBtnDel = utils.getRoleDel(this.trangThaiBanGhi, 2, userInfor?.roles[0]?.id);
    this.statusBtnSave = utils.getRoleSave(this.trangThaiBanGhi, 2, userInfor?.roles[0]?.id);
    this.statusBtnApprove = utils.getRoleApprove(this.trangThaiBanGhi, 2, userInfor?.roles[0]?.id);
    this.statusBtnTBP = utils.getRoleTBP(this.trangThaiBanGhi, 2, userInfor?.roles[0]?.id);
    this.statusBtnLD = utils.getRoleLD(this.trangThaiBanGhi, 2, userInfor?.roles[0]?.id);
    this.statusBtnGuiDVCT = utils.getRoleGuiDVCT(this.trangThaiBanGhi, 2, userInfor?.roles[0]?.id);
    this.statusBtnDVCT = utils.getRoleDVCT(this.trangThaiBanGhi, 2, userInfor?.roles[0]?.id);
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
  userInfo:any;
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
  chiTietBcaos: linkList = {
    id:null,
    vt:0,
    stt:null,
    maNdungChi:null,
    maNdungChiParent:null,
    maNdungChiChild:null,
    trongDotTcong:null,
    trongDotThoc:null,
    trongDotGao:null,
    luyKeTcong:null,
    luyKeThoc:null,
    luyKeGao:null,
    listCtiet:[],
    parentId:null,
    ghiChu:null,
    next:[],
    checked:false,
  };
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
  stt: number;
  kt: boolean;


  statusButton:boolean = false;
  
  editCache: { [key: string]: { edit: boolean; data: ItemData } } = {}; // phuc vu nut chinh

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
  // updateAllChecked(): void {
  //   this.indeterminate = false;
  //   if (this.allChecked) {
  //     this.lstCTietBCao = this.lstCTietBCao.map((item) => ({
  //       ...item,
  //       checked: true,
  //     }));
  //   } else {
  //     this.lstCTietBCao = this.lstCTietBCao.map((item) => ({
  //       ...item,
  //       checked: false,
  //     }));
  //   }
  // }

  luu() {}


  addCol() {
    if(this.ObjCol ==undefined) return
    var colname;
    this.listVattu.forEach(e => {
      if(this.ObjCol == e.id){
        colname = e.tenDm;
      }
    })
    let objTrongdot = {
      id: uuid.v4(),
      maVtu: this.ObjCol,
      loaiMatHang: 0,
      colName:colname,
      sl: 0,
      vt:this.cols,
    };
    let objLuyke = {
      id: objTrongdot.id,
      maVtu: this.ObjCol,
      loaiMatHang: 1,
      colName:colname,
      sl: 0,
      vt:this.cols,
    };
    this.listColTrongDot.push(objTrongdot);
    this.listColLuyke.push(objLuyke);
 
    // this.lstCTietBCao.forEach(e =>{
    //   e.listCtiet.push(objTrongdot);
    //   e.listCtiet.push(objLuyke);
    // })
    this.addColLL(this.chiTietBcaos, objTrongdot, objLuyke);

    this.updateLstCTietBCao();
    this.cols++;
    this.lenghtTh = this.cols;
    this.updateEditCache();
  }


  //them cot moi vao linklist
  addColLL(data:linkList, obj1:vatTu, obj2:vatTu){
    data.listCtiet.push(obj1);
    data.listCtiet.push(obj2);
    if (data.next.length == 0) return;
    data.next.forEach(item => {
      this.addColLL(item,obj1,obj2);
    })

  }


  addLine(idx: any) {
    var listVtu:vatTu []=[];

    this.listColTrongDot.forEach(e =>{
      let objTrongD ={
        id: e.id,
        maVtu: e.maVtu,
        loaiMatHang: 0,
        colName:'',
        sl: 0,
        vt:'',
      }
      let objLke ={
        id: e.id,
        maVtu: e.maVtu,
        loaiMatHang: 1,
        colName:'',
        sl: 0,
        vt:'',
      }
      listVtu.push(objTrongD);
      listVtu.push(objLke);
    })

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
      parentId:null,
      ghiChu: 0,
      checked: false,
    };
    this.lstCTietBCao.splice(idx, 0, item);
    this.editCache[item.id] = {
      edit: true,
      data: { ...item },
    };
    
    this.statusButton = false;
  }

  //xóa cột
  deleteCol(id:any){
    debugger
    this.listColTrongDot =  this.listColTrongDot.splice(id,1);
    this.listColLuyke = this.listColLuyke.splice(id,1);
    this.lstCTietBCao.forEach(e => {
      e.listCtiet = e.listCtiet.splice(id,1);
    })
    this.cols= this.cols-1;
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
    this.status = true;
  }

   //update khi sửa
   saveEdit(id: string): void {
    this.editCache[id].data.checked = this.lstCTietBCao.find(item => item.id === id).checked; // set checked editCache = checked lstCTietBCao
    const index = this.lstCTietBCao.findIndex(item => item.id === id);   // lay vi tri hang minh sua
    Object.assign(this.lstCTietBCao[index], this.editCache[id].data); // set lai data cua lstCTietBCao[index] = this.editCache[id].data
    this.editCache[id].edit = false;  // CHUYEN VE DANG TEXT
    this.saveEditLL(this.chiTietBcaos, index + 1);
    
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

  // // xóa với checkbox
  // deleteSelected() {
  //   // add list delete id
  //   this.lstCTietBCao.filter((item) => {
  //     if (item.checked == true && typeof item.id == 'number') {
  //       this.listIdDelete += item.id + ',';
  //     }
  //   });
  //   // delete object have checked = true
  //   this.lstCTietBCao = this.lstCTietBCao.filter(
  //     (item) => item.checked != true,
  //   );
  //   this.allChecked = false;
  // }


  //thao tác bảng

  //khoi tao
  duyet(data: linkList, str: string, index: number) {
    if (index != 0) {
      let mm = {
        id:uuid.v4(),
        stt :str + index.toString(),
        maNdungChi:data.maNdungChi,
        maNdungChiParent:data.maNdungChiParent,
        maNdungChiChild:data.maNdungChiChild,
        trongDotTcong:data.trongDotTcong,
        trongDotThoc:data.trongDotThoc,
        trongDotGao:data.trongDotGao,
        luyKeTcong:data.luyKeTcong,
        luyKeThoc:data.luyKeThoc,
        luyKeGao:data.luyKeGao,
        listCtiet:data.listCtiet,
        parentId:data.parentId,
        ghiChu:data.ghiChu,
        checked:false,
      }
      this.lstCTietBCao.push(mm);
    }
    if (data.next.length == 0) return;
    for (var i = 0; i < data.next.length; i++) {
      if (index == 0) {
        this.duyet(data.next[i], str, i + 1);
      } else {
        this.duyet(data.next[i], str + index.toString() + ".", i + 1);
      }

    }
  }

  updateLstCTietBCao() {
    this.lstCTietBCao = [];
    this.duyet(this.chiTietBcaos, "", 0);
    this.updateEditCache();
  }

  updateSTT(data: linkList) {
    if (data.next.length == 0) {
      return;
    }
    data.next.forEach(item => {
      item.vt = this.stt + 1;
      this.stt += 1;
      this.updateSTT(item);
    })
  }

  // xoa dong theo so thu tu
  deleteByStt(idx: any): void {
    this.delete(this.chiTietBcaos, idx);
    this.stt = 0;
    this.updateSTT(this.chiTietBcaos);
    this.updateLstCTietBCao();
  }


  //xoa theo so thu tu
  delete(data: linkList, idx: number) {
    if (data.next.length == 0) return;
    var index = data.next.findIndex(item => item.vt == idx);
    if (index == -1) {
      data.next.forEach(item => {
        this.delete(item, idx);
      })
    } else {
      this.kt = true;
      data.next = data.next.filter(item => item.vt != idx);
      return;
    }
  }

  //xoa bằng checkbox
  deleteSelected() {
    this.deleteAllSelected(this.chiTietBcaos);
    this.updateSTT(this.chiTietBcaos);
    this.updateLstCTietBCao();
    this.allChecked = false;
    this.chiTietBcaos.checked = false;
  }

  deleteAllSelected(data: linkList) {
    if (data.next.length == 0) {
      return;
    }
    data.next = data.next.filter(item => item.checked == false);
    this.stt = 0;

    data.next.forEach(item => this.deleteAllSelected(item));
  }

  // click o checkbox all
  updateAllChecked(): void {
    this.subUpdateChecked(this.chiTietBcaos, this.allChecked);
  }

  updateChecked() {
    this.updateCheckedLL(this.chiTietBcaos);
  }

  updateCheckedLL(data: linkList) {
    if (data.vt != 0) {
      if (data.checked != this.lstCTietBCao[data.vt - 1].checked) {
        this.subUpdateChecked(data, !data.checked);
        return;
      }
    }

    if (data.next.length == 0) return;
    var kt = true;
    data.next.forEach(item => {
      this.updateCheckedLL(item);
      if (!item.checked) kt = false;
    })

    if (kt) {
      data.checked = true;
      this.lstCTietBCao[data.vt - 1].checked = true;
    } else {
      data.checked = false;
      this.lstCTietBCao[data.vt - 1].checked = false;
    }
  }

  subUpdateChecked(data: linkList, kt: boolean) {
    data.checked = kt;
    if (data.vt > 0)
      this.lstCTietBCao[data.vt - 1].checked = kt;
    if (data.next.length == 0) return;
    data.next.forEach(item => this.subUpdateChecked(item, kt));
  }

  saveEditLL(data: linkList, idx: number) {
    if (data.vt == idx) {
      this.tranferData(data,this.lstCTietBCao[idx-1]);
      return;
    }
    if (data.next.length == 0) return;
    if (data.vt > idx) return;
    data.next.forEach(item => {
      this.saveEditLL(item, idx);
    })
  }

  // lưu bằng cấp 
  saveEdit1(id: string, index: number): void {
    
    var item: linkList = {
      id:0,
      vt:0,
      stt:this.editCache[id].data.stt,
      maNdungChi:this.editCache[id].data.maNdungChi,
      maNdungChiParent:this.editCache[id].data.maNdungChiParent,
      maNdungChiChild:this.editCache[id].data.maNdungChiChild,
      trongDotTcong:this.editCache[id].data.trongDotTcong,
      trongDotThoc:this.editCache[id].data.trongDotThoc,
      trongDotGao:this.editCache[id].data.trongDotGao,
      luyKeTcong:this.editCache[id].data.luyKeTcong,
      luyKeThoc:this.editCache[id].data.luyKeThoc,
      luyKeGao:this.editCache[id].data.luyKeGao,
      listCtiet:this.editCache[id].data.listCtiet,
      parentId:this.editCache[id].data.parentId,
      ghiChu:this.editCache[id].data.ghiChu,
      next: [],
      checked:false,
    }
    
    
    this.kt = false;
    this.addEqual(this.chiTietBcaos, item, index);
    if (!this.kt) {
      this.addEqual1(this.chiTietBcaos, item);
    }
    this.stt = 0;
    this.updateSTT(this.chiTietBcaos);
    console.log(this.chiTietBcaos);
    this.updateLstCTietBCao();
  }

  // lưu cấp con
  saveEdit2(id: string, index: number): void {
    var item: linkList ;
    this.tranferData(item,this.editCache[id].data);
    item.vt =0;
    item.checked=false;
    item.next=[];
  
    this.kt = false;
    this.addLess(this.chiTietBcaos, item, index);
    if (!this.kt) {
      this.addLess1(this.chiTietBcaos, item);
    }
    this.stt = 0;
    this.updateSTT(this.chiTietBcaos);
    console.log(this.chiTietBcaos);
    this.updateLstCTietBCao();
    
  }


  addEqual(data: linkList, value: linkList, idx: number) {
    if (data.next.length == 0) return;
    var index = data.next.findIndex(item => item.vt == idx);
    if (index == -1) {
      data.next.forEach(item => {
        this.addEqual(item, value, idx);
      })
    } else {
      this.kt = true;
      data.next.splice(index + 1, 0, value);
      return;
    }
  }

  addEqual1(data: linkList, value: linkList) {
    var idx = data.next.length - 1;
    if (data.next[idx].next.length != 0) {
      this.addEqual1(data.next[idx], value);
    } else {
      data.next.push(value);
      return;
    }
  }

  addLess(data: linkList, value: linkList, idx: number) {
    if (data.next.length == 0) return;
    var index = data.next.findIndex(item => item.vt == idx);
    if (index == -1) {
      data.next.forEach(item => {
        this.addLess(item, value, idx);
      })
    } else {
      this.kt = true;
      data.next[index].next.splice(0, 0, value);
      return;
    }
  }

  addLess1(data: linkList, value: linkList) {
    if (data.next.length == 0) {
      data.next.push(value);
      return;
    }
    this.addLess1(data.next[data.next.length - 1], value);
  }


  tranferData(data:linkList, item:ItemData){
    data.maNdungChi = item.maNdungChi;
    data.maNdungChiParent=item.maNdungChiParent;
    data.maNdungChiChild=item.maNdungChiChild;
    data.trongDotTcong=item.trongDotTcong;
    data.trongDotThoc=item.trongDotThoc;
    data.trongDotGao=item.trongDotGao;
    data.luyKeTcong=item.luyKeTcong;
    data.luyKeThoc=item.luyKeThoc;
    data.luyKeGao=item.luyKeGao;
    data.listCtiet=item.listCtiet;
    data.parentId=item.parentId;
    data.ghiChu=item.ghiChu;
  }
}
