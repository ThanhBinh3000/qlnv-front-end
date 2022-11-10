import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { DataService } from 'src/app/services/data.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';
import { TRANG_THAI_PHU_LUC, Utils } from 'src/app/Utility/utils';
import { PHU_LUC } from './bao-cao.constant';

export class ItemData {
  id: any;
  maLoai: string;
  trangThai: string;
  maDviTien: string;
  lyDoTuChoi: string;
  thuyetMinh: string;
  giaoCho: string;
  lstCtietDchinh: any[];
  checked: boolean;
}

export class ItemCongVan {
  fileName: string;
  fileSize: number;
  fileUrl: number;
}
@Component({
  selector: 'app-bao-cao',
  templateUrl: './bao-cao.component.html',
  styleUrls: ['./bao-cao.component.scss']
})


export class BaoCaoComponent implements OnInit {
  @Input() data;

  @Output() dataChange = new EventEmitter();

  //thong tin dang nhap
  id!: any;
  loai!: string;
  userInfo: any;
  //thong tin chung bao cao
  maBaoCao!: string;
  namHienHanh: number = new Date().getFullYear();
  namBcao: string;
  ngayNhap!: string;
  nguoiNhap!: string;
  congVan: ItemCongVan = new ItemCongVan();
  ngayTrinhDuyet!: string;
  ngayDuyetTBP!: string;
  ngayDuyetLD!: string;
  ngayCapTrenTraKq!: string;
  trangThaiBaoCao = '1';
  maDviTao!: string;
  thuyetMinh: string;
  lyDoTuChoi: string;
  loaiTongHop!: string;
  maDviUser!: string;
  dotBcao: number;
  //danh muc
  dotBcaos: any[] = [
    {
      id: 1
    },
    {
      id: 2
    }
  ]
  lstDieuChinhs: ItemData[] = [];
  phuLucs: any[] = JSON.parse(JSON.stringify(PHU_LUC));
  donVis: any[] = [];
  tabs: any[] = [];
  lstDviTrucThuoc: any[] = [];
  trangThaiBaoCaos: any[] = [
    {
      id: Utils.TT_BC_1,
      tenDm: "Đang soạn",
    },
    {
      id: Utils.TT_BC_2,
      tenDm: "Trình duyệt",
    },
    {
      id: Utils.TT_BC_3,
      tenDm: "Trưởng BP từ chối",
    },
    {
      id: Utils.TT_BC_4,
      tenDm: "Trưởng BP chấp nhận",
    },
    {
      id: Utils.TT_BC_5,
      tenDm: "Lãnh đạo từ chối",
    },
    {
      id: Utils.TT_BC_7,
      tenDm: "Lãnh đạo chấp nhận",
    },
    {
      id: Utils.TT_BC_8,
      tenDm: "Từ chối",
    },
    {
      id: Utils.TT_BC_9,
      tenDm: "Tiếp nhận",
    },
  ];
  trangThaiBieuMaus: any[] = TRANG_THAI_PHU_LUC;
  canBos: any[];
  lstFiles: any[] = []; //show file ra man hinh
  //file
  listFile: File[] = [];                      // list file chua ten va id de hien tai o input
  fileList: NzUploadFile[] = [];
  fileDetail: NzUploadFile;
  //beforeUpload: any;
  listIdFilesDelete: any = [];                        // id file luc call chi tiet
  //trang thai cac nut
  // status = false;
  // statusEdit = false;
  // statusBtnSave = true;
  // statusBtnApprove = true;
  // statusBtnTBP = true;
  // statusBtnLD = true;
  // statusBtnDVCT = true;
  // statusBtnCopy = true;
  // statusBtnPrint = true;
  // statusBtnClose = false;
  // statusBtnOk: boolean;
  // statusBtnFinish: boolean;

  status = false;
  saveStatus = true;
  submitStatus = true;
  passStatus = true;
  approveStatus = true;
  acceptStatus = true;
  copyStatus = true;
  printStatus = true;
  okStatus = true;
  finishStatus = true;
  isParent = false;
  isChild = false;
  isDataAvailable = false;

  checkParent = false;
  //khac
  // data: any;
  selectedIndex = 1;
  allChecked = false;                         // check all checkbox
  loaiMH: number;

  // before uploaf file
  beforeUpload = (file: NzUploadFile): boolean => {
    this.fileList = this.fileList.concat(file);
    return false;
  };

  // before uploaf file
  beforeUploadCV = (file: NzUploadFile): boolean => {
    this.fileDetail = file;
    this.congVan = {
      fileName: file.name,
      fileSize: null,
      fileUrl: null,
    };
    return false;
  };

  // them file vao danh sach
  handleUpload(): void {
    this.fileList.forEach((file: any) => {
      const id = file?.lastModified.toString();
      this.lstFiles.push({ id: id, fileName: file?.name });
      this.listFile.push(file);
    });
    this.fileList = [];
  }


  constructor(
    private spinner: NgxSpinnerService,
    private datePipe: DatePipe,
    private userService: UserService,
    public globals: Globals,
  ) {
    this.ngayNhap = this.datePipe.transform(new Date(), Utils.FORMAT_DATE_STR,)
  }

  async ngOnInit() {
    this.action('init');
  }

  async action(code: string) {
    this.spinner.show();
    this.isDataAvailable = false;
    switch (code) {
      case 'init':
        await this.initialization().then(() => {
          this.isDataAvailable = true;
        });
        break;
      case 'detail':
        await this.getDetailReport().then(() => {
          this.isDataAvailable = true;
        });
        break;
      case 'save':
        await this.save().then(() => {
          this.isDataAvailable = true;
        })
        break;
      case 'submit':
        await this.onSubmit('2', null).then(() => {
          this.isDataAvailable = true;
        })
        break;
      case 'nonpass':
        await this.tuChoi('3').then(() => {
          this.isDataAvailable = true;
        })
        break;
      case 'pass':
        await this.onSubmit('4', null).then(() => {
          this.isDataAvailable = true;
        })
        break;
      case 'nonapprove':
        await this.tuChoi('5').then(() => {
          this.isDataAvailable = true;
        })
        break;
      case 'approve':
        await this.onSubmit('7', null).then(() => {
          this.isDataAvailable = true;
        })
        break;
      case 'nonaccept':
        await this.tuChoi('8').then(() => {
          this.isDataAvailable = true;
        })
        break;
      case 'accept':
        await this.onSubmit('9', null).then(() => {
          this.isDataAvailable = true;
        })
        break;
      default:
        break;
    }
    this.tabs = [];
    this.spinner.hide();
  };

  async initialization() {
    this.id = this.data?.id;
    this.userInfo = this.userService.getUserLogin();
  };

  async getDetailReport() {

  };

  async save() {

  };

  async onSubmit(mcn: string, lyDoTuChoi: string) {

  };

  async tuChoi(mcn: string) {

  };


  back() {

  };

  showDialogCopy() {

  };

  statusClass() {
    if (Utils.statusSave.includes(this.trangThaiBaoCao)) {
      return 'du-thao-va-lanh-dao-duyet';
    } else {
      return 'da-ban-hanh';
    }
  };

  getStatusName(status: string) {
    const statusMoi = status == Utils.TT_BC_6 || status == Utils.TT_BC_7;
    if (statusMoi && this.isParent) {
      return 'Mới';
    } else {
      return this.trangThaiBaoCaos.find(e => e.id == status)?.tenDm;
    }
  };

  async downloadFileCv() {

  };

  closeTab({ index }: { index: number }): void {
    this.tabs.splice(index - 1, 1);
  };


  getStatusBM(trangThai: string) {
    return this.trangThaiBieuMaus.find(e => e.id == trangThai)?.ten;
  }

  deleteSelected() {

  };

  addBieuMau() {

  };

  updateAllChecked() {

  };

  newTab(id: any): void {

  };

  updateSingleChecked(): void {

  };

  getUnitName(maDvi: string) {
    return this.donVis.find(item => item.maDvi == maDvi)?.tenDvi;
  }

  viewDetail(id) {
    const obj = {
      id: id,
      preData: this.data,
      tabSelected: 'next' + this.data?.tabSelected,
    }
    this.dataChange.emit(obj);
  };

  async downloadFile(id: string) {

  };

  deleteFile(id: string): void {

  };

  getNewData(obj: any) {

  };


}
