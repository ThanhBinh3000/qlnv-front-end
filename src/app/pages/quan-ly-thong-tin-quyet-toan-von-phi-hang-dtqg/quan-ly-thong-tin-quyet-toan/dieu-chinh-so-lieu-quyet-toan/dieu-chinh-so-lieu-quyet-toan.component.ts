import { DatePipe, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import * as fileSaver from 'file-saver';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogThemKhoanMucComponent } from 'src/app/components/dialog/dialog-them-khoan-muc/dialog-them-khoan-muc.component';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import * as uuid from "uuid";
import { DanhMucHDVService } from '../../../../services/danhMucHDV.service';
import { divMoney, DON_VI_TIEN, LA_MA, MONEY_LIMIT, mulMoney } from "../../../../Utility/utils";
import { Utils } from './../../../../Utility/utils';
import { NOI_DUNG } from './dieu-chinh-so-lieu-quyet-toan.constant';
export const TRANG_THAI_TIM_KIEM = [
  {
      id: "1",
      tenDm: 'Đang soạn'
  },
  {
      id: "2",
      tenDm: 'Trình duyệt'
  },
  {
      id: "3",
      tenDm: 'Trưởng BP từ chối'
  },
  {
      id: "4",
      tenDm: 'Trưởng BP duyệt'
  },
  {
      id: "5",
      tenDm: 'Lãnh đạo từ chối'
  },
  {
      id: "6",
      tenDm: 'Lãnh đạo phê duyệt'
  },
  {
      id: "8",
      tenDm: 'Đơn vị cấp trên từ chối'
  },
  {
      id: "9",
      tenDm: 'Đơn vị cấp trên tiếp nhận'
  },
  // {
  //     id: "10",
  //     tenDm: 'Lãnh đạo yêu cầu điều chỉnh'
  // },
]
export class ItemData {
  id!: any;
  stt!: string;
  level: number;
  maLoaiHang!: number;
  maDviTinh!: number;
  soLuong!: number;
  donGiaMua!: number;
  thanhTien!: number;
  checked!: boolean;
}

export class ItemCongVan {
  fileName: string;
  fileSize: number;
  fileUrl: number;
}

@Component({
  selector: 'app-dieu-chinh-so-lieu-quyet-toan',
  templateUrl: './dieu-chinh-so-lieu-quyet-toan.component.html',
  styleUrls: ['./dieu-chinh-so-lieu-quyet-toan.component.scss']
})
export class DieuChinhSoLieuQuyetToanComponent implements OnInit {
  //danh muc
  donVis: any = [];
  noiDungs: any[] = NOI_DUNG;
  lstCtietBcao: ItemData[] = [];
  donViTiens: any[] = DON_VI_TIEN;
  soLaMa: any[] = LA_MA;
  trangThaiBaoCaos: any[] = TRANG_THAI_TIM_KIEM;
  donViTinhs: any = [];
  //thong tin chung bao cao
  initItem: ItemData = {
    id: null,
    stt: "0",
    level: 0,
    maLoaiHang: 0,
    maDviTinh: null,
    soLuong: 0,
    donGiaMua: 0,
    thanhTien: 0,
    checked: false
  };
  total: ItemData = {
    id: null,
    stt: "0",
    level: 0,
    maLoaiHang: 0,
    maDviTinh: null,
    soLuong: 0,
    donGiaMua: 0,
    thanhTien: 0,
    checked: false
  };
  thongBao: string;
  id: string;
  userInfo: any;
  trangThaiPhuLuc: string;
  thuyetMinh: string;
  maDviTien: any;
  listIdDelete: string = "";
  maPhanBcao: string = "2";
  namQtoan!: number;
  ngayTao!: string;
  ngayTrinh!: string;
  ngayTrinhDuyet!: string;
  ngayPheDuyet!: string;
  ngayDuyet!: string;
  trangThaiBaoCao: string = '1';
  congVan: ItemCongVan = new ItemCongVan();
  maPhanBcao1: number = 2;
  maDviTao!: string;
  nguoiNhap!: string;
  capDvi: string;
  // trang thai cac nut
  status: boolean = false;
  statusEdit: boolean = false;
  statusBtnSave: boolean = true;                      // trang thai an/hien nut luu
  statusBtnApprove: boolean = true;                   // trang thai an/hien nut trinh duyet
  statusBtnTBP: boolean = true;                       // trang thai an/hien nut truong bo phan
  statusBtnLD: boolean = true;                        // trang thai an/hien nut lanh dao
  statusBtnGuiDVCT: boolean = true;                   // trang thai nut gui don vi cap tren
  statusBtnDVCT: boolean = true;                      // trang thai nut don vi cap tren
  statusBtnCopy: boolean = true;                      // trang thai copy
  statusBtnPrint: boolean = true;                     // trang thai print
  statusBtnClose: boolean = false;
  statusBtnOk: boolean;
  statusBtnFinish: boolean;
  statusBtnUser: boolean;
  statusBtnNhap: boolean;
  //file
  lstFiles: any[] = []; //show file ra man hinh
  listFile: File[] = [];                      // list file chua ten va id de hien tai o input
  fileList: NzUploadFile[] = [];
  fileDetail: NzUploadFile;
  //beforeUpload: any;
  listIdFilesDelete: any = [];                        // id file luc call chi tiet

  // khac
  allChecked = false;                         // check all checkbox
  editCache: { [key: string]: { edit: boolean; data: ItemData } } = {};     // phuc vu nut chinh

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
  maBcao!: string;
  maDchinh!: string;

  // them file vao danh sach
  handleUpload(): void {
    this.fileList.forEach((file: any) => {
      const id = file?.lastModified.toString();
      this.lstFiles.push({ id: id, fileName: file?.name });
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
    private userService: UserService,
    private danhMucService: DanhMucHDVService,
    private notification: NzNotificationService,
    private location: Location,
    private fb: FormBuilder,
    private modal: NzModalService,
  ) {
    this.ngayTao = this.datePipe.transform(new Date(), Utils.FORMAT_DATE_STR,)
  }

  async ngOnInit() {
    this.id = this.routerActive.snapshot.paramMap.get('id');
    let namQtoan = this.routerActive.snapshot.paramMap.get('namQtoan');
    let userName = this.userService.getUserName();
    await this.getUserInfo(userName); //get user info
    this.namQtoan = Number(namQtoan)

    if (this.id) {
      await this.getDetailReport();
    } else if(this.namQtoan){
      await this.getQuyetToan()
      await this.quanLyVonPhiService.sinhMaBaoCaoQuyetToan(this.maPhanBcao1).toPromise().then(
        (data) => {
          if (data.statusCode == 0) {
            this.maBcao = data.data;
            // this.maBcao = this.maBcao.substring(0, 2) + "ĐC" + this.maBcao.substring(2)
          } else {
            this.notification.error(MESSAGE.ERROR, data?.msg);
          }
        },
        (err) => {
          this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
        }
      );
      this.trangThaiBaoCao = "1";
      this.nguoiNhap = this.userInfo?.username;
      this.maDviTao = this.userInfo?.dvql;
    }

    //lay danh sach danh muc don vi
    await this.danhMucService.dMDonVi().toPromise().then(
      (data) => {
        if (data.statusCode == 0) {
          this.donVis = data.data;
          this.donVis.forEach(e => {
            if (e.maDvi == this.userInfo?.dvql) {
              this.capDvi = e.capDvi;
            }
          })
        } else {
          this.notification.error(MESSAGE.ERROR, data?.msg);
        }
      },
      (err) => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
      }
    );
    // danh sách đơn vị tính
    await this.danhMucService.dMDviTinh().toPromise().then(
      (data) => {
        if (data.statusCode == 0) {
          this.donViTinhs = data?.data;
        } else {
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      },
      (err) => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
    );
    this.getStatusButton();
    this.spinner.hide();
  }

  //nhóm các nút chức năng --báo cáo-----
	getStatusButton() {
		if (this.trangThaiBaoCao == Utils.TT_BC_1 ||
			this.trangThaiBaoCao == Utils.TT_BC_3 ||
			this.trangThaiBaoCao == Utils.TT_BC_5 ||
			this.trangThaiBaoCao == Utils.TT_BC_8 ||
			this.trangThaiBaoCao == Utils.TT_BC_10) {
			this.status = false;
		} else {
			this.status = true;
		}
		let checkParent = false;
		let checkChirld = false;
		let dVi = this.donVis.find(e => e.maDvi == this.maDviTao);
		if (dVi && dVi.maDvi == this.userInfo.dvql) {
			checkChirld = true;
		}
		if (dVi && dVi.parent?.maDvi == this.userInfo.dvql) {
			checkParent = true;
		}
		let roleNguoiTao = this.userInfo?.roles[0]?.code;
		const utils = new Utils();
		this.statusBtnSave = utils.getRoleSave(this.trangThaiBaoCao, checkChirld, roleNguoiTao);
		this.statusBtnApprove = utils.getRoleApprove(this.trangThaiBaoCao, checkChirld, roleNguoiTao);
		this.statusBtnTBP = utils.getRoleTBP(this.trangThaiBaoCao, checkChirld, roleNguoiTao);
		this.statusBtnLD = utils.getRoleLD(this.trangThaiBaoCao, checkChirld, roleNguoiTao);
		this.statusBtnGuiDVCT = utils.getRoleGuiDVCT(this.trangThaiBaoCao, checkChirld, roleNguoiTao);
		this.statusBtnDVCT = utils.getRoleDVCT(this.trangThaiBaoCao, checkParent, roleNguoiTao);
		this.statusBtnCopy = utils.getRoleCopy(this.trangThaiBaoCao, checkChirld, roleNguoiTao);
		this.statusBtnPrint = utils.getRolePrint(this.trangThaiBaoCao, checkChirld, roleNguoiTao);
		if ((this.trangThaiBaoCao == Utils.TT_BC_7 && roleNguoiTao == '3' && checkParent) ||
			(this.trangThaiBaoCao == Utils.TT_BC_2 && roleNguoiTao == '2' && checkChirld) ||
			(this.trangThaiBaoCao == Utils.TT_BC_4 && roleNguoiTao == '1' && checkChirld)) {
			this.statusBtnOk = true;
		} else {
			this.statusBtnOk = false;
		}
		if ((this.trangThaiBaoCao == Utils.TT_BC_1 || this.trangThaiBaoCao == Utils.TT_BC_3 || this.trangThaiBaoCao == Utils.TT_BC_5 || this.trangThaiBaoCao == Utils.TT_BC_8)
			&& roleNguoiTao == '3' && checkChirld) {
			this.statusBtnFinish = false;
		} else {
			this.statusBtnFinish = true;
		}

	}


  async getDetailReport() {
    this.spinner.show();
    await this.quanLyVonPhiService.CtietBcaoQuyetToan(this.id).toPromise().then(
      async (data) => {
        if (data.statusCode == 0) {
          this.id = data.data.id;
          this.lstCtietBcao = data.data.lstCtiet;
          this.maDviTien = data.data.maDviTien;
          this.sortByIndex();
          this.lstCtietBcao.forEach(item => {
            item.donGiaMua = divMoney(item.donGiaMua, this.maDviTien);
            item.thanhTien = divMoney(item.thanhTien, this.maDviTien);
          })
          this.ngayTrinh = this.datePipe.transform(data.data.ngayTrinh, Utils.FORMAT_DATE_STR);
					this.ngayDuyet = this.datePipe.transform(data.data.ngayDuyet, Utils.FORMAT_DATE_STR);
					this.ngayPheDuyet = this.datePipe.transform(data.data.ngayPheDuyet, Utils.FORMAT_DATE_STR);
          this.maBcao = data.data.maBcao;
          this.maDchinh = data.data.maDchinh;
          this.trangThaiBaoCao = data.data.trangThai;
          this.namQtoan = data.data.namQtoan;
          this.maDviTao = data.data.maDvi;
          this.thuyetMinh = data.data.thuyetMinh;
          this.ngayTao = this.datePipe.transform(data.data.ngayTao, Utils.FORMAT_DATE_STR);
          this.congVan = data.data.congVan;
          this.lstFiles = data.data.fileDinhKems;
          this.thongBao = data.data.thongBao;
					this.listFile = [];;
          this.getTotal()
          this.updateEditCache();
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

  async getQuyetToan() {
    const res = {
      namQtoan: this.namQtoan
    }
    this.spinner.show();
    await this.quanLyVonPhiService.CtietBcaoQuyetToanNam(res).toPromise().then(
      async (data) => {
        if (data.statusCode == 0) {
          console.log(data);
          this.lstCtietBcao = data.data.lstCtiet;
          this.maDviTien = data.data.maDviTien;
          this.sortByIndex();
          this.lstCtietBcao.forEach(item => {
            item.donGiaMua = divMoney(item.donGiaMua, this.maDviTien);
            item.thanhTien = divMoney(item.thanhTien, this.maDviTien);
          })
          this.maDchinh = data.data.maBcao;
          this.thuyetMinh = data.data.thuyetMinh;
          this.congVan = data.data.congVan;
          this.lstFiles = data.data.fileDinhKems;

					this.listFile = [];;
          this.getTotal()
          this.updateEditCache();
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


  // luu
  async save() {
    let checkSaveEdit;
    if (!this.maDviTien) {
      this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTSAVE);
      return;
    }
    //check xem tat ca cac dong du lieu da luu chua?
    //chua luu thi bao loi, luu roi thi cho di
    this.lstCtietBcao.forEach(element => {
      if (this.editCache[element.id].edit === true) {
        checkSaveEdit = false
      }
    });
    if (checkSaveEdit == false) {
      this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTSAVE);
      return;
    }
    //tinh lai don vi tien va kiem tra gioi han cua chung
    let lstCtietBcaoTemp: any = [];
    let checkMoneyRange = true;
    this.lstCtietBcao.forEach(item => {
      let donGiaMua = mulMoney(item.donGiaMua, this.maDviTien);
      let thanhTien = mulMoney(item.thanhTien, this.maDviTien);
      if (donGiaMua > MONEY_LIMIT || thanhTien > MONEY_LIMIT) {
        checkMoneyRange = false;
        return;
      }
      lstCtietBcaoTemp.push({
        ...item,
        donGiaMua: donGiaMua,
        thanhTien: thanhTien,
      })
    })

    if (!checkMoneyRange == true) {
      this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.MONEYRANGE);
      return;
    }

    // replace nhung ban ghi dc them moi id thanh null
    lstCtietBcaoTemp.forEach(item => {
      if (item.id?.length == 36) {
        item.id = null;
      }
    })
    //get list file url
		let listFile: any = [];
		for (const iterator of this.listFile) {
			listFile.push(await this.uploadFile(iterator));
		}

    let request = JSON.parse(JSON.stringify({
      id: this.id,
      fileDinhKems: this.lstFiles,
			listIdFiles: this.listIdFilesDelete,                      // id file luc get chi tiet tra ra( de backend phuc vu xoa file)
      lstCtiet: lstCtietBcaoTemp,
      maDviTien: this.maDviTien,
      thuyetMinh: this.thuyetMinh,
      trangThai: this.trangThaiBaoCao,
      congVan: this.congVan,
      maDvi: this.maDviTao,
      namQtoan: this.namQtoan,
      maBcao: this.maBcao,
      maDchinh:this.maDchinh,
      maPhanBcao: this.maPhanBcao,
      thongBao: this.thongBao
    }));
    //get file cong van url
    let file: any = this.fileDetail;
    if (file) {
      request.congVan = await this.uploadFile(file);
    }

    //call service them moi
    this.spinner.show();
    if (this.id == null) {
      this.quanLyVonPhiService.trinhDuyetServiceQuyetToan(request).toPromise().then(
        async data => {
          if (data.statusCode == 0) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
            if (!this.id) {
              this.router.navigate([
                '/quan-ly-thong-tin-quyet-toan-von-phi-hang-dtqg/quan-ly-thong-tin-quyet-toan/dieu-chinh-so-lieu-quyet-toan/' + data.data.id,
              ])
            }
            else {
              await this.getDetailReport();
              this.getStatusButton();
            }
          } else {
            this.notification.error(MESSAGE.ERROR, data?.msg);
          }
        },
        err => {
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        },
      );
    } else {
      this.quanLyVonPhiService.updateBaoCaoQuyetToan(request).toPromise().then(
        async data => {
          if (data.statusCode == 0) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
            await this.getDetailReport();
            this.getStatusButton();
          } else {
            this.notification.error(MESSAGE.ERROR, data?.msg);
          }
        }, err => {
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        })
    }
    this.lstCtietBcao.filter(item => {
      if (!item.id) {
        item.id = uuid.v4() + 'FE';
      }
    });
    this.spinner.hide();
  }

  //upload file
  async uploadFile(file: File) {
    // day file len server
    const upfile: FormData = new FormData();
    upfile.append('file', file);
    upfile.append('folder', this.maDviTao + '/' + this.maPhanBcao);
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
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      },
    );
    return temp;
  }

  // chuc nang check role
  async onSubmit(mcn: string, lyDoTuChoi: string) {
    if (this.id) {
      const requestGroupButtons = {
        id: this.id,
        maChucNang: mcn,
        lyDoTuChoi: lyDoTuChoi,
      };
      this.spinner.show();
      await this.quanLyVonPhiService.approveQuyetToan(requestGroupButtons).toPromise().then(async (data) => {
        if (data.statusCode == 0) {
					this.trangThaiBaoCao = mcn;
          this.ngayTrinh = this.datePipe.transform(data.data.ngayTrinh, Utils.FORMAT_DATE_STR);
					this.ngayDuyet = this.datePipe.transform(data.data.ngayDuyet, Utils.FORMAT_DATE_STR);
					this.ngayPheDuyet = this.datePipe.transform(data.data.ngayPheDuyet, Utils.FORMAT_DATE_STR);
					this.getStatusButton();
					if (mcn == Utils.TT_BC_8 || mcn == Utils.TT_BC_5 || mcn == Utils.TT_BC_3) {
						this.notification.success(MESSAGE.SUCCESS, MESSAGE.REJECT_SUCCESS);
					} else {
						this.notification.success(MESSAGE.SUCCESS, MESSAGE.APPROVE_SUCCESS);
					}
				} else {
					this.notification.error(MESSAGE.ERROR, data?.msg);
				}
      }, err => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      });
      this.spinner.hide();
    } else {
      this.notification.warning(MESSAGE.WARNING, MESSAGE.MESSAGE_DELETE_WARNING)
    }
  }

  //show popup tu choi
  tuChoi(mcn: string) {
    const modalTuChoi = this.modal.create({
      nzTitle: 'Từ chối',
      nzContent: DialogTuChoiComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {},
    });
    modalTuChoi.afterClose.subscribe(async (text) => {
      if (text) {
        this.onSubmit(mcn, text);
      }
    });
  }

  // chuyển đổi stt đang được mã hóa thành dạng I, II, a, b, c, ...
  getChiMuc(str: string): string {
    str = str.substring(str.indexOf('.') + 1, str.length);
    var xau: string = "";
    let chiSo: any = str.split('.');
    var n: number = chiSo.length - 1;
    var k: number = parseInt(chiSo[n], 10);
    if (n == 0) {
      for (var i = 0; i < this.soLaMa.length; i++) {
        while (k >= this.soLaMa[i].gTri) {
          xau += this.soLaMa[i].kyTu;
          k -= this.soLaMa[i].gTri;
        }
      }
    };
    if (n == 1) {
      xau = chiSo[n];
    };
    if (n == 2) {
      xau = chiSo[n - 1].toString() + "." + chiSo[n].toString();
    };
    if (n == 3) {
      xau = String.fromCharCode(k + 96);
    }
    if (n == 4) {
      xau = "-";
    }
    return xau;
  }
  // lấy phần đầu của số thứ tự, dùng để xác định phần tử cha
  getHead(str: string): string {
    return str.substring(0, str.lastIndexOf('.'));
  }
  // lấy phần đuôi của stt
  getTail(str: string): number {
    return parseInt(str.substring(str.lastIndexOf('.') + 1, str.length), 10);
  }
  //tìm vị trí cần để thêm mới
  findVt(str: string): number {
    var start: number = this.lstCtietBcao.findIndex(e => e.stt == str);
    var index: number = start;
    for (var i = start + 1; i < this.lstCtietBcao.length; i++) {
      if (this.lstCtietBcao[i].stt.startsWith(str)) {
        index = i;
      }
    }
    return index;
  }
  //thay thế các stt khi danh sách được cập nhật, heSo=1 tức là tăng stt lên 1, heso=-1 là giảm stt đi 1
  replaceIndex(lstIndex: number[], heSo: number) {
    //thay doi lai stt cac vi tri vua tim duoc
    lstIndex.forEach(item => {
      var str = this.getHead(this.lstCtietBcao[item].stt) + "." + (this.getTail(this.lstCtietBcao[item].stt) + heSo).toString();
      var nho = this.lstCtietBcao[item].stt;
      this.lstCtietBcao.forEach(item => {
        item.stt = item.stt.replace(nho, str);
      })
    })
  }
  //thêm ngang cấp
  addSame(id: any, initItem: ItemData) {
    var index: number = this.lstCtietBcao.findIndex(e => e.id === id); // vi tri hien tai
    var head: string = this.getHead(this.lstCtietBcao[index].stt); // lay phan dau cua so tt
    var tail: number = this.getTail(this.lstCtietBcao[index].stt); // lay phan duoi cua so tt
    var ind: number = this.findVt(this.lstCtietBcao[index].stt); // vi tri can duoc them
    // tim cac vi tri can thay doi lai stt
    let lstIndex: number[] = [];
    for (var i = this.lstCtietBcao.length - 1; i > ind; i--) {
      if (this.getHead(this.lstCtietBcao[i].stt) == head) {
        lstIndex.push(i);
      }
    }
    this.replaceIndex(lstIndex, 1);
    // them moi phan tu
    if (initItem.id) {
      let item: ItemData = {
        ...initItem,
        stt: head + "." + (tail + 1).toString(),
      }
      this.lstCtietBcao.splice(ind + 1, 0, item);
      this.editCache[item.id] = {
        edit: false,
        data: { ...item }
      };
    } else {
      let item: ItemData = {
        ...initItem,
        id: uuid.v4() + "FE",
        stt: head + "." + (tail + 1).toString(),
      }
      this.lstCtietBcao.splice(ind + 1, 0, item);
      this.editCache[item.id] = {
        edit: true,
        data: { ...item }
      };
    }
  }

  // gan editCache.data == lstCtietBcao
  updateEditCache(): void {
    this.lstCtietBcao.forEach(item => {
      this.editCache[item.id] = {
        edit: false,
        data: { ...item }
      };
    });
  }
  //thêm cấp thấp hơn
  addLow(id: any, initItem: ItemData) {
    var data: ItemData = this.lstCtietBcao.find(e => e.id === id);
    var index: number = this.lstCtietBcao.findIndex(e => e.id === id); // vi tri hien tai
    var stt: string;
    if (this.lstCtietBcao.findIndex(e => this.getHead(e.stt) == data.stt) == -1) {
      stt = data.stt + '.1';
    } else {
      index = this.findVt(data.stt);
      for (var i = this.lstCtietBcao.length - 1; i >= 0; i--) {
        if (this.getHead(this.lstCtietBcao[i].stt) == data.stt) {
          stt = data.stt + '.' + (this.getTail(this.lstCtietBcao[i].stt) + 1).toString();
          break;
        }
      }
    }
    if (this.lstCtietBcao.findIndex(e => this.getHead(e.stt) == this.getHead(stt)) == -1) {
      this.sum(stt);
      this.updateEditCache();
    }
    // them moi phan tu
    if (initItem.id) {
      let item: ItemData = {
        ...initItem,
        stt: stt,
      }
      this.lstCtietBcao.splice(index + 1, 0, item);
      this.editCache[item.id] = {
        edit: false,
        data: { ...item }
      };
    } else {
      let item: ItemData = {
        ...initItem,
        id: uuid.v4() + "FE",
        stt: stt,
      }
      this.lstCtietBcao.splice(index + 1, 0, item);

      this.editCache[item.id] = {
        edit: true,
        data: { ...item }
      };
    }
  }
  //xóa dòng
  deleteLine(id: any) {
    var index: number = this.lstCtietBcao.findIndex(e => e.id === id); // vi tri hien tai
    var nho: string = this.lstCtietBcao[index].stt;
    var head: string = this.getHead(this.lstCtietBcao[index].stt); // lay phan dau cua so tt
    var stt: string = this.lstCtietBcao[index].stt;
    //xóa phần tử và con của nó
    this.lstCtietBcao = this.lstCtietBcao.filter(e => !e.stt.startsWith(nho));
    //update lại số thức tự cho các phần tử cần thiết
    let lstIndex: number[] = [];
    for (var i = this.lstCtietBcao.length - 1; i >= index; i--) {
      if (this.getHead(this.lstCtietBcao[i].stt) == head) {
        lstIndex.push(i);
      }
    }

    this.replaceIndex(lstIndex, -1);
    this.sum(stt);
    this.updateEditCache();
  }

  // start edit
  startEdit(id: string): void {
    this.editCache[id].edit = true;
  }

  // huy thay doi
  cancelEdit(id: string): void {
    const index = this.lstCtietBcao.findIndex(item => item.id === id);
    // lay vi tri hang minh sua
    this.editCache[id] = {
      data: { ...this.lstCtietBcao[index] },
      edit: false
    };
  }

  // luu thay doi
  saveEdit(id: string): void {
    this.editCache[id].data.checked = this.lstCtietBcao.find(item => item.id === id).checked; // set checked editCache = checked lstCtietBcao
    const index = this.lstCtietBcao.findIndex(item => item.id === id); // lay vi tri hang minh sua
    Object.assign(this.lstCtietBcao[index], this.editCache[id].data); // set lai data cua lstCtietBcao[index] = this.editCache[id].data
    this.editCache[id].edit = false; // CHUYEN VE DANG TEXT
    this.sum(this.lstCtietBcao[index].stt);
    this.updateEditCache();
  }


  updateChecked(id: any) {
    var data: ItemData = this.lstCtietBcao.find(e => e.id === id);
    //đặt các phần tử con có cùng trạng thái với nó
    this.lstCtietBcao.forEach(item => {
      if (item.stt.startsWith(data.stt)) {
        item.checked = data.checked;
      }
    })
    //thay đổi các phần tử cha cho phù hợp với tháy đổi của phần tử con
    var index: number = this.lstCtietBcao.findIndex(e => e.stt == this.getHead(data.stt));
    if (index == -1) {
      this.allChecked = this.checkAllChild('0');
    } else {
      var nho: boolean = this.lstCtietBcao[index].checked;
      while (nho != this.checkAllChild(this.lstCtietBcao[index].stt)) {
        this.lstCtietBcao[index].checked = !nho;
        index = this.lstCtietBcao.findIndex(e => e.stt == this.getHead(this.lstCtietBcao[index].stt));
        if (index == -1) {
          this.allChecked = !nho;
          break;
        }
        nho = this.lstCtietBcao[index].checked;
      }
    }
  }
  //kiểm tra các phần tử con có cùng được đánh dấu hay ko
  checkAllChild(str: string): boolean {
    var nho: boolean = true;
    this.lstCtietBcao.forEach(item => {
      if ((this.getHead(item.stt) == str) && (!item.checked) && (item.stt != str)) {
        nho = item.checked;
      }
    })
    return nho;
  }


  updateAllChecked() {
    this.lstCtietBcao.forEach(item => {
      item.checked = this.allChecked;
    })
  }

  deleteAllChecked() {
    var lstId: any[] = [];
    this.lstCtietBcao.forEach(item => {
      if (item.checked) {
        lstId.push(item.id);
      }
    })
    lstId.forEach(item => {
      if (this.lstCtietBcao.findIndex(e => e.id == item) != -1) {
        this.deleteLine(item);
      }
    })
  }
  //thêm phần tử đầu tiên khi bảng rỗng
  addFirst(initItem: ItemData) {
    if (initItem.id) {
      let item: ItemData = {
        ...initItem,
        stt: "0.1",
      }
      this.lstCtietBcao.push(item);
      this.editCache[item.id] = {
        edit: false,
        data: { ...item }
      };
    } else {
      let item: ItemData = {
        ...initItem,
        level: 0,
        id: uuid.v4() + 'FE',
        stt: "0.1",
      }
      this.lstCtietBcao.push(item);

      this.editCache[item.id] = {
        edit: true,
        data: { ...item }
      };
    }
  }

  sortByIndex() {
    this.setDetail();
    this.lstCtietBcao.sort((item1, item2) => {
      if (item1.level > item2.level) {
        return 1;
      }
      if (item1.level < item2.level) {
        return -1;
      }
      if (this.getTail(item1.stt) > this.getTail(item2.stt)) {
        return -1;
      }
      if (this.getTail(item1.stt) < this.getTail(item2.stt)) {
        return 1;
      }
      return 0;
    });
    var lstTemp: any[] = [];
    this.lstCtietBcao.forEach(item => {
      var index: number = lstTemp.findIndex(e => e.stt == this.getHead(item.stt));
      if (index == -1) {
        lstTemp.splice(0, 0, item);
      } else {
        lstTemp.splice(index + 1, 0, item);
      }
    })

    this.lstCtietBcao = lstTemp;
  }

  setDetail() {
    this.lstCtietBcao.forEach(item => {
      item.level = this.noiDungs.find(e => e.id == item.maLoaiHang)?.level;
    })
  }

  getIdCha(maKM: any) {
    return this.noiDungs.find(e => e.id == maKM)?.idCha;
  }

  addLine(id: any) {
    var maLoaiHang: any = this.lstCtietBcao.find(e => e.id == id)?.maLoaiHang;
    let obj = {
      maKhoanMuc: maLoaiHang,
      lstKhoanMuc: this.noiDungs,
    }

    const modalIn = this.modal.create({
      nzTitle: 'Danh sách nội dung',
      nzContent: DialogThemKhoanMucComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '65%',
      nzFooter: null,
      nzComponentParams: {
        obj: obj
      },
    });
    modalIn.afterClose.subscribe((res) => {
      if (res) {
        var index: number = this.lstCtietBcao.findIndex(e => e.maLoaiHang == res.maKhoanMuc);
        if (index == -1) {
          let data: any = {
            ...this.initItem,
            maLoaiHang: res.maKhoanMuc,
            level: this.noiDungs.find(e => e.id == maLoaiHang)?.level,
          };
          if (this.lstCtietBcao.length == 0) {
            this.addFirst(data);
          } else {
            this.addSame(id, data);
          }
        }
        id = this.lstCtietBcao.find(e => e.maLoaiHang == res.maKhoanMuc)?.id;
        res.lstKhoanMuc.forEach(item => {
          var data: ItemData = {
            ...this.initItem,
            maLoaiHang: item.id,
            level: item.level,
          };
          this.addLow(id, data);
        })
        this.updateEditCache();
      }
    });
  }

  getLowStatus(str: string) {
    var index: number = this.lstCtietBcao.findIndex(e => this.getHead(e.stt) == str);
    if (index == -1) {
      return false;
    }
    return true;
  }

  sum(stt: string) {
    stt = this.getHead(stt);
    while (stt != '0') {
      var index = this.lstCtietBcao.findIndex(e => e.stt == stt);
      let data = this.lstCtietBcao[index];
      this.lstCtietBcao[index] = {
        ...this.initItem,
        id: data.id,
        stt: data.stt,
        maLoaiHang: data.maLoaiHang,
        checked: data.checked,
        level: data.level,
      }
      this.lstCtietBcao.forEach(item => {
        if (this.getHead(item.stt) == stt) {
          // this.lstCtietBcao[index].soLuong += item.soLuong;
          // this.lstCtietBcao[index].donGiaMua += item.donGiaMua;
          this.lstCtietBcao[index].thanhTien += item.thanhTien;
        }
      })
      stt = this.getHead(stt);
    }
    this.getTotal();
  }

  getTotal() {
    this.total.soLuong = 0;
    this.total.donGiaMua = 0;
    this.total.thanhTien = 0;
    this.lstCtietBcao.forEach(item => {
      if (item.level == 0) {
        // this.total.soLuong += item.soLuong;
        // this.total.donGiaMua += item.donGiaMua;
        this.total.thanhTien += item.thanhTien;
      }
    })
  }



  //gia tri cac o input thay doi thi tinh toan lai
  changeModel(id: string): void {
    this.editCache[id].data.thanhTien = Number(this.editCache[id].data.soLuong) * Number(this.editCache[id].data.donGiaMua);
  }

  doPrint() {
    let WindowPrt = window.open(
      '',
      '',
      'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0',
    );
    let printContent = '';
    printContent = printContent + '<div>';
    printContent =
      printContent + document.getElementById('tablePrint').innerHTML;
    printContent = printContent + '</div>';
    WindowPrt.document.write(printContent);
    WindowPrt.document.close();
    WindowPrt.focus();
    WindowPrt.print();
    WindowPrt.close();
  }

  //download file công văn về máy tính
  async downloadFileCv() {
    if (this.congVan?.fileUrl) {
      await this.quanLyVonPhiService.downloadFile(this.congVan?.fileUrl).toPromise().then(
        (data) => {
          fileSaver.saveAs(data, this.congVan?.fileName);
        },
        err => {
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        },
      );
    } else {
      let file: any = this.fileDetail;
      const blob = new Blob([file], { type: "application/octet-stream" });
      fileSaver.saveAs(blob, file.name);
    }
  }

  // lay trang thai
  getStatusName(trangThai: string) {
    return this.trangThaiBaoCaos.find(e => e.id == trangThai)?.tenDm;
  }


  // xoa file trong bang file
  deleteFile(id: string): void {
    this.lstFiles = this.lstFiles.filter((a: any) => a.id !== id);
    this.listFile = this.listFile.filter((a: any) => a?.lastModified.toString() !== id);
    this.listIdFilesDelete.push(id);
  }

  //download file về máy tính
  async downloadFile(id: string) {
    let file!: File;
    file = this.listFile.find(element => element?.lastModified.toString() == id);
    if (!file) {
      let fileAttach = this.lstFiles.find(element => element?.id == id);
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
        this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
      }
    );
  }

  // quay lai
  redirectChiTieuKeHoachNam() {
    this.location.back();
  }
  close() {
    this.location.back();
  }
}
