import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserService } from 'src/app/services/user.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { Utils } from 'src/app/Utility/utils';
import * as uuid from "uuid";
import * as fileSaver from 'file-saver';

export class ItemData {

  id!: any;
  stt!: number;
  ndung!: String;
  maLoaiKhoach!: String;
  maLoaiDan!: String;
  tongDtoanSl!: number;
  tongDtoanGtri!: number;
  thienNamTruoc!: number;
  dtoanThienNCb!: number;
  dtoanThienNTh!: number;
  dtoanThienN1Cb!: number;
  dtoanThienN1Th!: number;
  dtoanThienN2Cb!: number;
  dtoanThienN2Th!: number;
  dtoanThienN3Cb!: number;
  dtoanThienN3Th!: number;
  ghichu!:string;
  checked!:boolean;
}

@Component({
  selector: 'app-dutoanchiungdungCNTTgiaidoan3nam',
  templateUrl: './dutoanchiungdungCNTTgiaidoan3nam.component.html',
  styleUrls: ['./dutoanchiungdungCNTTgiaidoan3nam.component.scss']
})
export class DutoanchiungdungCNTTgiaidoan3namComponent implements OnInit {




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
  maDvi: any;
  maLoaiBacao: string = '26';
  nam: any;
  userInfor: any;
  status: boolean = false;
  ngaynhap: any;
  nguoinhap: any;
  donvitao: any;
  mabaocao: any;
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
  listLoaikehoach: any[] = [];
  listLoaiduan: any[] = [];
  listIdDelete: string = '';
  fileList: NzUploadFile[] = [];
  listFile: File[] = [];
  fileUrl: any;
  fileToUpload!: File;
  listFileUploaded: any = [];

  constructor(
    private nguoiDungSerivce: UserService,
    private quanLyVonPhiService: QuanLyVonPhiService,
    private spinner: NgxSpinnerService,
    private router: ActivatedRoute,
    private datepipe: DatePipe,
    private sanitizer: DomSanitizer,
    private route:Router
  ) {}

  async ngOnInit() {
    let userName = this.nguoiDungSerivce.getUserName();
    let userInfor: any = await this.getUserInfo(userName); //get user info

    //check param dieu huong router
    this.id = this.router.snapshot.paramMap.get('id');
    this.maDvi = this.router.snapshot.paramMap.get('maDvi');
    this.maLoaiBacao = this.router.snapshot.paramMap.get('maLoaiBacao');
    this.nam = this.router.snapshot.paramMap.get('nam');

    if (this.id != null) {
      this.getDetailReport();
    } else if (
      this.maDvi != null &&
      this.maLoaiBacao != null &&
      this.nam != null
    ) {
      this.calltonghop();
    } else {
      this.trangThaiBanGhi = '1';
      this.nguoinhap = userInfor?.username;
      this.donvitao = userInfor?.dvql;
      this.namBcaohienhanh = this.currentday.getFullYear();
      this.ngaynhap = this.datepipe.transform(this.currentday, 'dd/MM/yyyy');
      this.maLoaiBacao = '26';
      this.spinner.show();
      this.quanLyVonPhiService.sinhMaBaoCao().subscribe(
        (res) => {
          if (res.statusCode == 0) {
            this.mabaocao = res.data;
          } else {
            this.errorMessage =
              'Có lỗi trong quá trình sinh mã báo cáo vấn tin!';
          }
        },
        (err) => {
          this.errorMessage = err.error.message;
        },
      );
    }
    this.quanLyVonPhiService.dMKeHoachVon().subscribe(
      (res) => {
        if (res.statusCode == 0) {
          this.listLoaikehoach = res.data?.content;
          console.log(this.listLoaikehoach);
        } else {
          this.errorMessage = 'Có lỗi trong quá trình vấn tin!';
        }
      },
      (err) => {
        this.errorMessage = err.error.message;
      },
    );
    //get danh muc dự án
    this.quanLyVonPhiService.dMKhoiDuAn().subscribe(
      (data) => {
          if (data.statusCode == 0) {
              this.listLoaiduan = data.data?.content;
              console.log(this.listLoaiduan);
          } else {
              this.errorMessage = "Có lỗi trong quá trình vấn tin!";
          }
      },
      (err) => {
          console.log(err);
          this.errorMessage = err.error.message;
      }
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
          this.maLoaiBacao = "26";
          // set thong tin chung bao cao
          this.ngaynhap = data.data.ngayTao;
          this.nguoinhap = data.data.nguoiTao;
          this.donvitao = data.data.maDvi;
          this.mabaocao = data.data.maBcao;
          this.namBcaohienhanh = data.data.namBcao;
          this.trangThaiBanGhi = data.data.trangThai;
          if(this.trangThaiBanGhi == '1' ||this.trangThaiBanGhi == '3' ||this.trangThaiBanGhi == '5' ||this.trangThaiBanGhi == '8' ){
            this.status = false;
          }else{
            this.status = true;
          }
          // set list id file ban dau
          this.lstFile.filter((item) => {
            this.listIdFiles += item.id + ',';
          });
        } else {
          this.errorMessage = 'Có lỗi trong quá trình vấn tin!';
        }
      },
      (err) => {
        console.log(err);
        this.errorMessage = err.error.message;
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
        //this.getDetailReport();
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
  }

  //chọn row cần sửa và trỏ vào template
  startEdit(id: string): void {
    this.editCache[id].edit = true;
  }

  // them dong moi
  addLine(id: number): void {
    let item: ItemData = {
      id!:uuid.v4(),
      stt!: 0,
      ndung!: '',
      maLoaiKhoach!: '',
      maLoaiDan!: '',
      tongDtoanSl!: 0,
      tongDtoanGtri!: 0,
      thienNamTruoc!: 0,
      dtoanThienNCb!: 0,
      dtoanThienNTh!: 0,
      dtoanThienN1Cb!: 0,
      dtoanThienN1Th!: 0,
      dtoanThienN2Cb!: 0,
      dtoanThienN2Th!: 0,
      dtoanThienN3Cb!: 0,
      dtoanThienN3Th!: 0,
      ghichu:'',
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

    this.lstCTietBCao.forEach(e => {
      if(typeof e.id !="number"){
        e.id = null;
      }
    })
    // donvi tien
    if (this.donvitien == undefined) {
      this.donvitien = '01';
    }
    // gui du lieu trinh duyet len server

    // lay id file dinh kem
    let idFileDinhKems = '';
    for (let i = 0; i < this.lstFile.length; i++) {
      idFileDinhKems += this.lstFile[i].id + ',';
    }

    // lay id file dinh kem (gửi file theo danh sách )
    let listFileUploaded: any = [];
    for (const iterator of this.listFile) {
      listFileUploaded.push(await this.uploadFile(iterator));
    }
    // gui du lieu trinh duyet len server
    let request = {
      id: this.id,
      fileDinhKems: this.listFileUploaded,
      listIdFiles: idFileDinhKems,
      lstCTietBCao: this.lstCTietBCao,
      maBcao: this.mabaocao,
      maDvi: this.donvitao,
      maDviTien: this.donvitien,
      maLoaiBcao: this.maLoaiBacao,
      namBcao: this.namBcaohienhanh.toString(),
      namHienHanh: this.namBcaohienhanh.toString(),
    };
    this.spinner.show();
    console.log(request);

    if (
      this.id != null
      
    ) {
      this.quanLyVonPhiService.updatelist(request).subscribe((res) => {
        if (res.statusCode == 0) {
          alert('Cập nhật thành công');
        } else {
          alert('Có lỗi trong quá trình vấn tin');
        }
      });
    } else {
      this.quanLyVonPhiService.trinhDuyetService(request).subscribe(
        (data) => {
          alert('trinh duyet thanh cong!');
          console.log(data);
        },
        (err) => {
          alert('trinh duyet that bai!');
          console.log();
        },
      );
    }
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
    upfile.append('folder', this.mabaocao + '/' + this.donvitao + '/');
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
