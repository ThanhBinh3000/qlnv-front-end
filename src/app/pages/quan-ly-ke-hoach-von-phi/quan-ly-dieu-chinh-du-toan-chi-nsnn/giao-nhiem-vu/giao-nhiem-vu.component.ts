import { Component, OnInit } from '@angular/core';
import * as fileSaver from 'file-saver';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { MESSAGE } from 'src/app/constants/message';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { Utils } from 'src/app/Utility/utils';
import * as uuid from "uuid";
import { DialogChonPhuLucDieuChinhComponent } from './../../../../components/dialog/dialog-quan-ly-dieu-chinh-du-toan-chi-nsnn/dialog-chon-phu-luc-dieu-chinh/dialog-chon-phu-luc-dieu-chinh.component';
import { PHULUCLIST, TAB_SELECTED } from './giao-nhiem-vu.constant';


export class ItemDanhSachPhuLuc {
  maBcao!: any;
  bCaoNam!: any;
  dotBcao!: any;
  ngayTao!: any;
  nguoiTao!: any;
  soCongVan!: any;
  ngayTongHop!: any;
  ngayTrinhDuyet!: any;
  ngayDuyetTBP!: any;
  ngayDuyetLD!: any;
  ngayDVCTTraKQ!: any;
  trangThai!: any;

  // dung cho request
  fileDinhKems!: any[];
  listIdDeletes!: string;
  listIdFiles!: string;
  maLoaiBcao!: string;
  maPhanBcao: string = "0";

  stt!: String;
  checked!: boolean;
  lstBCao: ItemData[] = [];
  lstFile: any[] = [];
  lstBCaoDviTrucThuoc: any[] = [];
  tongHopTu!: string;
};

export class ItemData {
  id!: any;
  maLoai!: string;
  maDviTien!: any;
  lstCTietBCao!: any;
  trangThai!: string;
  checked!: boolean;
  tieuDe!: string;
  tenPhuLuc!: string;
  thuyetMinh!: string;
  lyDoTuChoi!:string;
}

@Component({
  selector: 'app-giao-nhiem-vu',
  templateUrl: './giao-nhiem-vu.component.html',
  styleUrls: ['./giao-nhiem-vu.component.scss']
})

export class GiaoNhiemVuComponent implements OnInit {

  danhSachPhuLuc: ItemDanhSachPhuLuc = new ItemDanhSachPhuLuc();
  lstFile: any = [];                          // list File de day vao api
  fileList: NzUploadFile[] = [];
  listFile: File[] = [];                      // list file chua ten va id de hien tai o input
  status: boolean = false;                    // trang thai an/ hien cua trang thai
  allChecked = false;                         // check all checkbox
  indeterminate = true;                       // properties allCheckBox
  lstBCao: ItemData[] = [];
  tabSelected: string;
  danhSachChiTietPhuLucTemp: any = [];
  tab = TAB_SELECTED;

  // status button
  statusBtnDel: boolean;                       // trang thai an/hien nut xoa
  statusBtnSave: boolean;                      // trang thai an/hien nut luu
  statusBtnApprove: boolean;                   // trang thai an/hien nut trinh duyet
  statusBtnTBP: boolean;                       // trang thai an/hien nut truong bo phan
  statusBtnLD: boolean;                        // trang thai an/hien nut lanh dao
  statusBtnGuiDVCT: boolean;                   // trang thai nut gui don vi cap tren
  statusBtnDVCT: boolean;                      // trang thai nut don vi cap tren
  statusBtnCopy: boolean;                      // trang thai copy
  statusBtnPrint: boolean;                     // trang thai print
  statusBtnOk: boolean;                        // trang thai ok/ not ok
  statusBtnClose: boolean = false;                        // trang thai ok/ not ok

  constructor(
    private quanLyVonPhiService: QuanLyVonPhiService,
    private notification: NzNotificationService,
    private modal: NzModalService,
  ) {
  }

  async ngOnInit() {
  }

  // lay ten trang thai ban ghi
  getStatusName(id) {
    const utils = new Utils();
    return utils.getStatusName(id);
  };

  // before uploaf file
  beforeUpload = (file: NzUploadFile): boolean => {
    this.fileList = this.fileList.concat(file);
    return false;
  };

  // them file vao danh sach
  handleUpload(): void {
    this.fileList.forEach((file: any) => {
      const id = file?.lastModified.toString();
      this.lstFile.push({ id: id, fileName: file?.name });
      this.listFile.push(file);
    });
    this.fileList = [];
  };

  //download file về máy tính
  async downloadFile(id: string) {
    let file!: File;
    file = this.listFile.find(element => element?.lastModified.toString() == id);
    if (!file) {
      let fileAttach = this.lstFile.find(element => element?.id == id);
      if (fileAttach) {
        await this.quanLyVonPhiService.downloadFile(fileAttach.fileUrl).toPromise().then(
          (data) => {
            fileSaver.saveAs(data, fileAttach.fileName);
          },
          err => {
            this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
          },
        );
      }
    } else {
      const blob = new Blob([file], { type: "application/octet-stream" });
      fileSaver.saveAs(blob, file.name);
    }
  };

  // xoa file trong bang file
  deleteFile(id: string): void {
    this.lstFile = this.lstFile.filter((a: any) => a.id !== id);
    this.listFile = this.listFile.filter((a: any) => a?.lastModified.toString() !== id);
  };

  // update all
  updateAllChecked(): void {
    this.indeterminate = false;                               // thuoc tinh su kien o checkbox all
    if (this.allChecked) {                                    // checkboxall == true thi set lai lstCTietBCao.checked = true
      this.danhSachPhuLuc.lstBCao = this.danhSachPhuLuc?.lstBCao.map(item => ({
        ...item,
        checked: true
      }));
    } else {
      this.danhSachPhuLuc.lstBCao = this.danhSachPhuLuc?.lstBCao.map(item => ({    // checkboxall == false thi set lai lstCTietBCao.checked = false
        ...item,
        checked: false
      }));
    }
  }

  // save
  async save(){

  }

  // check role
  async onSubmit(mcn: String, lyDoTuChoi: string){

  }

  // show popup tu choi
  async tuChoi(mcn: string) {

  }

  // copy
  async doCopy() {

  }

  // print
  async doPrint(){

  }

  // close
  async close(){

  }

  // lay ten trang thai theo ma trang thai
  getStatusAppendixName(id) {
    const utils = new Utils();
    return utils.getStatusAppendixName(id);
  }

  // doi tab
  changeTab(maPhuLuc, trangThaiChiTiet) {

  }

  // click o checkbox single
  updateSingleChecked(): void {
    if (this.danhSachPhuLuc?.lstBCao.every(item => !item.checked)) {           // tat ca o checkbox deu = false thi set o checkbox all = false
      this.allChecked = false;
      this.indeterminate = false;
    } else if (this.danhSachPhuLuc?.lstBCao.every(item => item.checked)) {     // tat ca o checkbox deu = true thi set o checkbox all = true
      this.allChecked = true;
      this.indeterminate = false;
    } else {                                                        // o checkbox vua = false, vua = true thi set o checkbox all = indeterminate
      this.indeterminate = true;
    }
  }

  // them phu luc
  addPhuLuc() {
    PHULUCLIST.forEach(item => item.status = false);
    var danhSach = PHULUCLIST.filter(item => this.danhSachPhuLuc?.lstBCao?.findIndex(data => data.maLoai == item.maPhuLuc) == -1);

    const modalIn = this.modal.create({
      nzTitle: 'Danh sách phụ lục',
      nzContent: DialogChonPhuLucDieuChinhComponent,
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
          if (item.status) {
            this.danhSachPhuLuc.lstBCao.push({
              id: uuid.v4()+'FE',
              checked: false,
              tieuDe: item.tieuDe,
              maLoai: item.maPhuLuc,
              tenPhuLuc: item.tenPhuLuc,
              trangThai: '2',
              lstCTietBCao: [],
              maDviTien: '1',
              thuyetMinh: null,
              lyDoTuChoi:null,
            });
          }
        })
      }
    });
  }

  // xoa phu luc
  deletePhuLucList() {
    this.danhSachPhuLuc.lstBCao = this.danhSachPhuLuc?.lstBCao.filter(item => item.checked == false);
    if (this.danhSachPhuLuc?.lstBCao?.findIndex(item => item.maLoai == this.tabSelected) == -1) {
      this.tabSelected = null;
    }
    this.allChecked = false;
  }

}
