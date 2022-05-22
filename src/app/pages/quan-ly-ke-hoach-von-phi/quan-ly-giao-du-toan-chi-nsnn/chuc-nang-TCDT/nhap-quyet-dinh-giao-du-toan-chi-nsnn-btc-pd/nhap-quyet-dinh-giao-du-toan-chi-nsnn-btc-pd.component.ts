import { LA_MA } from './../../../../../Utility/utils';
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import * as fileSaver from 'file-saver';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import * as uuid from "uuid";
import { MESSAGE } from '../../../../../constants/message';
import { DanhMucHDVService } from '../../../../../services/danhMucHDV.service';
import { DON_VI_TIEN, Utils } from "../../../../../Utility/utils";
// import { LA_MA } from './../../../quan-ly-dieu-chinh-du-toan-chi-nsnn/quan-ly-dieu-chinh-du-toan-chi-nsnn.constant';


export class ItemData {
  nguonNsnn!: number;
  nguonKhac!: number;
  tong!: number;
  maKhoanMuc!: number;
  lstKm: any[];
  status: boolean;
  id!: any;
  stt!: string;
  checked!: boolean;
}


@Component({
  selector: 'app-nhap-quyet-dinh-giao-du-toan-chi-nsnn-btc-pd',
  templateUrl: './nhap-quyet-dinh-giao-du-toan-chi-nsnn-btc-pd.component.html',
  styleUrls: ['./nhap-quyet-dinh-giao-du-toan-chi-nsnn-btc-pd.component.scss']
})

export class NhapQuyetDinhGiaoDuToanChiNsnnBtcPdComponent implements OnInit {
  userInfo: any;
  errorMessage!: String;                      //

  maLoais: any = [];                          // ma loai
  maNhoms: any = [];                          // ma nhom
  maMatHangs: any = [] ;                      // ma mat hang
  maDviTiens: any = DON_VI_TIEN;                // ma don vi tien
  maDviTinhs:any = [];                        // ma don vi tinh
  donVis: any = [];                           // ma don vi
  ngayQd!: any;                               // ngay quyet dinh
  soQd!: any;                                 // so quyet dinh
  vanBan!: any;                               // noi dung
  nguoiKy!: any;                              // nguoi ky
  ghiChu!: string;
  lstCTietBCao: ItemData[] = [];              // list chi tiet bao cao
  id!: any;                                   // id truyen tu router
  chiTietBcaos: any;                          // thong tin chi tiet bao cao
  lstFile: any = [];                          // list File de day vao api
  status: boolean = false;                    // trang thai an/ hien cua trang thai
  userName: any;                              // ten nguoi dang nhap
  ngayNhap!: any;                             // ngay nhap
  nguoiNhap!: string;                         // nguoi nhap
  maDonViTao!: any;                           // ma don vi tao
  maBaoCao!: string;                          // ma bao cao
  trangThaiBanGhi: string = "1";              // trang thai cua ban ghi
  maDviTien: string ;                   // ma don vi tien
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

  tongCong!: number;
  tongCongNguonNSNN!: number  ;
  tongCongNguonKhac!: number ;
  khoanMucs: any = [];
  allChecked = false;                         // check all checkbox
  indeterminate = true;                       // properties allCheckBox
  editCache: { [key: string]: { edit: boolean; data: ItemData } } = {};     // phuc vu nut chinh
  fileList: NzUploadFile[] = [];
  maKhoanMucs: any = [];
  loaiQd!: any;
  lyDoTuChoi!: any;
  maQdCha!: any;
  nam!: any;
  noiQd: string = "Bộ Tài Chính";
  tenDvi!: any;
  veViec!: any;
  validateForm!: FormGroup;
  nguoiKys: any [] = [
    {maNguoiKy: "111", tenNguoiKy: "Đoàn Minh Vương"},
    {maNguoiKy: "112", tenNguoiKy: "Nguyễn Thành Công"},
    {maNguoiKy: "113", tenNguoiKy: "Nguyễn Xuân Hùng"},
    {maNguoiKy: "114", tenNguoiKy: "Vú Anh Tuấn"},
  ]
  maNguoiKyTC: any

    lstKhoanMuc: any[] ;

    soLaMa: any[] = LA_MA;

    initItem: ItemData = {
        nguonKhac:0,
        nguonNsnn: 0,
        tong: 0,
        maKhoanMuc: 0,
        lstKm: [],
        status: false,
        id: null,
        stt: "0",
        checked: false,
    };

    vt: number;
    stt: number;
    kt: boolean;
    disable: boolean = false;

  beforeUpload = (file: NzUploadFile): boolean => {
    this.fileList = this.fileList.concat(file);
    return false;
  };
  tongNguonNsnn: number;
  tongNguonKhac: number;
  tongDtoanChiNSNN: number;
  listIdDeleteFiles: string = "";

  // upload file
  // addFile() {
  //   const id = this.fileToUpload?.lastModified.toString();
  //   this.lstFile.push({ id: id, fileName: this.fileToUpload?.name });
  //   this.listFile.push(this.fileToUpload);
  // }

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
              private danhMucService: DanhMucHDVService,
              private userService: UserService,
              private notification: NzNotificationService,
              private modal: NzModalService,
              private fb:FormBuilder,
              ) {
              }


  async ngOnInit() {
    this.validateForm = this.fb.group({
      namBaoCaoHienHanh: [null, [Validators.required,Validators.pattern('^[12][0-9]{3}$')]],
    });
    this.id = this.routerActive.snapshot.paramMap.get('id');
    let userName = this.userService.getUserName();
    let userInfo: any = await this.getUserInfo(userName); //get user info
    if (this.id) {
      await this.quanLyVonPhiService.timDanhSachBCGiaoBTCPD1().toPromise().then(
        (data) => {
          if (data.statusCode == 0) {
            this.lstKhoanMuc = data.data;
          } else {
            this.notification.error(MESSAGE.ERROR, data?.msg);
          }

        },
        (err) => {
          this.notification.error(MESSAGE.ERROR, err?.msg);
        }
      );
      await this.getDetailReport();
    } else {
      this.trangThaiBanGhi = "1";
      this.nguoiNhap = userInfo?.username;
      this.maDonViTao = userInfo?.dvql;
      this.spinner.show();
    }

    //get danh muc loại quyết định
    this.danhMucService.dMLoaiQDGiaoDT().toPromise().then(
      (data) => {
        if (data.statusCode == 0) {
          this.maLoais = data.data?.content;
        } else {
          this.notification.error(MESSAGE.ERROR, data?.msg);
        }
      },
      (err) => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
    );

    //get danh muc nhóm giao
    this.danhMucService.dMNhomQDGiaoDT().toPromise().then(
      (data) => {
        if (data.statusCode == 0) {
          this.maNhoms = data.data?.content;
        } else {
          this.notification.error(MESSAGE.ERROR, data?.msg);
        }
      },
      (err) => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
    );

    //get danh muc mặt hàng
    this.danhMucService.dMMatHangQDGiaoDT().toPromise().then(
      (data) => {
        if (data.statusCode == 0) {
          this.maMatHangs = data.data?.content;
        } else {
          this.notification.error(MESSAGE.ERROR, data?.msg);
        }
      },
      (err) => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
    );

    //get danh muc đơn vị tính
    this.danhMucService.dMDviHangQDGiaoDT().toPromise().then(
      (data) => {
        if (data.statusCode == 0) {
          this.maDviTinhs = data.data?.content;
        } else {
          this.notification.error(MESSAGE.ERROR, data?.msg);
        }
      },
      (err) => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
    );

    //get danh muc nhom chi
    this.danhMucService.dMKhoanMuc().toPromise().then(
      (data) => {
        if (data.statusCode == 0) {
          this.maKhoanMucs = data.data?.content;
        } else {
          this.notification.error(MESSAGE.ERROR, data?.msg);
        }
      },
      (err) => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
    );


    //lay danh sach danh muc don vi
    this.danhMucService.dMDonVi().toPromise().then(
      (data) => {
        if (data.statusCode == 0) {
          this.donVis = data.data;
        } else {
          this.notification.error(MESSAGE.ERROR, data?.msg);
        }
      },
      (err) => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
    );

    // lay danh sach khoan muc
    this.quanLyVonPhiService.timDanhSachBCGiaoBTCPD1().toPromise().then(
      (data) => {
        if (data.statusCode == 0) {
          this.lstKhoanMuc = data.data;
          console.log(this.lstKhoanMuc);

        } else {
          this.notification.error(MESSAGE.ERROR, data?.msg);
        }

      },
      (err) => {
        this.notification.error(MESSAGE.ERROR, err?.msg);
      }
    );
    this.getStatusButton();
    this.spinner.hide();
  }
  getStatusButton() {

		let checkParent = false;
		let checkChirld = false;
		let dVi = this.donVis.find(e => e.maDvi == this.maDonViTao);
		if (dVi && dVi.maDvi == this.userInfo.dvql) {
			checkChirld = true;
		}
		if (dVi && dVi.parent?.maDvi == this.userInfo.dvql) {
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
		// this.statusBtnLDDC = utils.getRoleLDDC(this.trangThaiBanGhi, checkChirld, this.userInfo?.roles[0]?.id);
		// this.statusBtnCopy = utils.getRoleCopy(this.trangThaiBanGhi, checkChirld, this.userInfo?.roles[0]?.id);
		// this.statusBtnPrint = utils.getRolePrint(this.trangThaiBanGhi, checkChirld, this.userInfo?.roles[0]?.id);
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
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
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

  checkLuu:boolean=false;
  // luu
  async luu() {
    //upload file
		let listFile: any = [];
		for (const iterator of this.listFile) {
			listFile.push(await this.uploadFile(iterator));
		}

    // replace nhung ban ghi dc them moi id thanh null
    this.lstCTietBCao.filter(item => {
      if (item.id?.length == 38) {
        item.id = null;
      }
    })

    // gui du lieu trinh duyet len server
    let request = {
      id: this.id,
      fileDinhKems: listFile,
      listIdFiles: this.listIdFiles,                      // id file luc get chi tiet tra ra( de backend phuc vu xoa file)
      listIdDeleteFiles: this.listIdDeleteFiles,
      lstCtiet: this.lstCTietBCao,
      loaiQd: this.loaiQd = "1",
      lyDoTuChoi: this.lyDoTuChoi,
      maDvi: this.maDonViTao,
      maDviTien: this.maDviTien,
      maNguoiKy: this.maNguoiKyTC,
      maQdCha: this.maQdCha,
      nam: this.nam,
      ngayQD: this.ngayQd,
      noiDung: "1",
      noiQd: this.noiQd,
      soQd: this.soQd + "/QĐ-BTC",
      tenDvi: this.tenDvi,
      trangThai: "1",
      vanBan: this.vanBan,
      veViec: this.veViec,
      ghiChu: this.ghiChu,
    };
    //call service them moi
			this.spinner.show();
			if (this.id == null) {
				this.quanLyVonPhiService.trinhDuyetGiaoService1(request).toPromise().then(
					async data => {
						if (data.statusCode == 0) {
							this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
							this.id = data.data.id;
							await this.getDetailReport();
              this.checkLuu = true;
						} else {
							this.notification.error(MESSAGE.ERROR, data?.msg);
						}
					},
					err => {
						this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
					},
				);
			} else {
				this.quanLyVonPhiService.updatelistGiaoDuToan1(request).toPromise().then(
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
    this.lstCTietBCao.filter(item => {
      if (!item.id) {
        item.id = uuid.v4()+'FE';
      }
    });
    this.updateEditCache();
    this.spinner.hide();
  }


  //thay doi trang thai
  changeStatus(status: boolean) {
    this.status = status;
  }

  // call chi tiet bao cao
  async getDetailReport() {
    this.spinner.show();
    await this.quanLyVonPhiService.QDGiaoChiTiet1(this.id).toPromise().then(
      (data) => {
        if (data.statusCode == 0) {
          this.chiTietBcaos = data.data;
          this.lstCTietBCao = data.data.lstCtiet;
          this.sortByIndex();
          this.updateEditCache()
          this.lstFile = data.data.fileDinhKems;
					this.listFile = [];

          // set thong tin chung bao cao
          this.ngayQd = data.data?.ngayQD;
          this.maNguoiKyTC = data.data?.maNguoiKy;
          this.maDonViTao = data.data?.maDvi;
          this.maBaoCao = data.data?.maBcao;
          this.vanBan = data.data?.vanBan;
          this.soQd = data.data?.soQd;
          this.soQd = this.soQd.replace('/QĐ-BTC', '')
          this.trangThaiBanGhi = data.data?.trangThai;
          this.ghiChu = data.data?.ghiChu;
          this.veViec = data.data?.veViec;
          this.maDviTien = data.data?.maDviTien
          // set list id file ban dau
          this.lstFile?.filter(item => {
            this.listIdFiles += item.id + ",";
          })

          if (this.trangThaiBanGhi == '1' || this.trangThaiBanGhi == '3' || this.trangThaiBanGhi == '5' || this.trangThaiBanGhi == '8') {
            this.status = false;
          } else {
            this.status = true;
          }
          this.tinhTong1()
          this.lstCTietBCao.forEach(e => {
            e.tong = e.nguonKhac + e.nguonNsnn
          })



        } else {
          this.notification.error(MESSAGE.ERROR, data?.msg);
        }
      },
      (err) => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
    );
    this.spinner.hide();

  }

  //upload file
	async uploadFile(file: File) {
		// day file len server
		const upfile: FormData = new FormData();
		upfile.append('file', file);
		upfile.append('folder', 'QD_GIAO_PHAN_BO_NSNN' + '/' + this.maDonViTao);
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

  // xoa dong
  deleteById(id: any): void {
    this.lstCTietBCao = this.lstCTietBCao.filter(item => item.id != id)
    if (id?.length == 36) {
      this.listIdDelete += id + ",";
    }
  }

  // xóa với checkbox
  deleteSelected() {
    // add list delete id
    this.lstCTietBCao.filter(item => {
      if(item.checked == true && item?.id?.length == 36){
        this.listIdDelete += item.id + ","
      }
    })
    // delete object have checked = true
    this.lstCTietBCao = this.lstCTietBCao.filter(item => item.checked != true )
    this.allChecked = false;
  }

  // xoa file trong bang file
	deleteFile(id: string): void {
		this.lstFile = this.lstFile.filter((a: any) => a.id !== id);
		this.listFile = this.listFile.filter((a: any) => a?.lastModified.toString() !== id);

		// set list for delete
		this.listIdDeleteFiles += id + ",";
	}

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
    this.router.navigate(['/qlkh-von-phi/quan-ly-giao-du-toan-chi-nsnn/tim-kiem']);
  }

  // lay ten trang thai
  getStatusName(){
    const utils = new Utils();
    return utils.getStatusName(this.trangThaiBanGhi);
  }

  // lay ten don vi tao
  getUnitName(){
    return this.donVis.find(item => item.maDvi == this.maDonViTao)?.tenDvi;
  }

  changeTong(id: string): void {
    this.editCache[id].data.tong = this.editCache[id].data.nguonNsnn + this.editCache[id].data.nguonKhac;
  }
  tinhTong1(){
    this.tongNguonNsnn = 0
    this.tongNguonKhac = 0
    this.lstCTietBCao.forEach(e => {
      this.tongNguonNsnn += e.nguonNsnn;
      this.tongNguonKhac += e.nguonKhac;
      this.tongDtoanChiNSNN= this.tongNguonNsnn + this.tongNguonKhac;
    })
  }
  changeNguoiKy(){
    this.nguoiKys.forEach(e => {
      if(this.maNguoiKyTC == e.maNguoiKy){
        this.nguoiKy = e.tenNguoiKy
      }
    })
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
    var start: number = this.lstCTietBCao.findIndex(e => e.stt == str);
    var index: number = start;
    for (var i = start + 1; i < this.lstCTietBCao.length; i++) {
        if (this.lstCTietBCao[i].stt.startsWith(str)) {
            index = i;
        }
    }
    return index;
}
//thay thế các stt khi danh sách được cập nhật, heSo=1 tức là tăng stt lên 1, heso=-1 là giảm stt đi 1
replaceIndex(lstIndex: number[], heSo: number) {
    //thay doi lai stt cac vi tri vua tim duoc
    lstIndex.forEach(item => {
        var str = this.getHead(this.lstCTietBCao[item].stt) + "." + (this.getTail(this.lstCTietBCao[item].stt) + heSo).toString();
        var nho = this.lstCTietBCao[item].stt;
        this.lstCTietBCao.forEach(item => {
            item.stt = item.stt.replace(nho, str);
        })
    })
}
//thêm ngang cấp
addSame(id: any, initItem: ItemData) {
    var index: number = this.lstCTietBCao.findIndex(e => e.id === id); // vi tri hien tai
    var head: string = this.getHead(this.lstCTietBCao[index].stt); // lay phan dau cua so tt
    var tail: number = this.getTail(this.lstCTietBCao[index].stt); // lay phan duoi cua so tt
    var ind: number = this.findVt(this.lstCTietBCao[index].stt); // vi tri can duoc them
    // tim cac vi tri can thay doi lai stt
    let lstIndex: number[] = [];
    for (var i = this.lstCTietBCao.length - 1; i > ind; i--) {
        if (this.getHead(this.lstCTietBCao[i].stt) == head) {
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
        this.lstCTietBCao.splice(ind + 1, 0, item);
        this.editCache[item.id] = {
            edit: false,
            data: { ...item }
        };
    } else {
        let item: ItemData = {
            ...initItem,
            id: uuid.v4() + 'FE',
            stt: head + "." + (tail + 1).toString(),
            lstKm: this.lstCTietBCao[index].lstKm,
        }
        this.lstCTietBCao.splice(ind + 1, 0, item);
        this.editCache[item.id] = {
            edit: true,
            data: { ...item }
        };
    }
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
//thêm cấp thấp hơn
addLow(id: any, initItem: ItemData) {
    var index: number = this.lstCTietBCao.findIndex(e => e.id === id); // vi tri hien tai
    //list các vị trí cần thay đôi lại stt
    let lstIndex: number[] = [];
    for (var i = this.lstCTietBCao.length - 1; i > index; i--) {
        if (this.getHead(this.lstCTietBCao[i].stt) == this.lstCTietBCao[index].stt) {
            lstIndex.push(i);
        }
    }
    this.replaceIndex(lstIndex, 1);
    // them moi phan tu
    if (initItem.id) {
        let item: ItemData = {
            ...initItem,
            stt: this.lstCTietBCao[index].stt + ".1",
        }
        this.lstCTietBCao.splice(index + 1, 0, item);
        this.editCache[item.id] = {
            edit: false,
            data: { ...item }
        };
    } else {
        let item: ItemData = {
            ...initItem,
            id: uuid.v4() + 'FE',
            lstKm: this.lstKhoanMuc.filter(e => e.idCha == this.lstCTietBCao[index].maKhoanMuc),
            stt: this.lstCTietBCao[index].stt + ".1",
        }
        this.lstCTietBCao.splice(index + 1, 0, item);

        this.editCache[item.id] = {
            edit: true,
            data: { ...item }
        };
    }
}
//xóa dòng
deleteLine(id: any) {
    var index: number = this.lstCTietBCao.findIndex(e => e.id === id); // vi tri hien tai
    var nho: string = this.lstCTietBCao[index].stt;
    var head: string = this.getHead(this.lstCTietBCao[index].stt); // lay phan dau cua so tt
    //xóa phần tử và con của nó
    this.lstCTietBCao = this.lstCTietBCao.filter(e => !e.stt.startsWith(nho));
    //update lại số thức tự cho các phần tử cần thiết
    let lstIndex: number[] = [];
    for (var i = this.lstCTietBCao.length - 1; i >= index; i--) {
        if (this.getHead(this.lstCTietBCao[i].stt) == head) {
            lstIndex.push(i);
        }
    }

    this.replaceIndex(lstIndex, -1);

    this.updateEditCache();
}

// start edit
startEdit(id: string): void {
    this.editCache[id].edit = true;
}

// huy thay doi
cancelEdit(id: string): void {
    const index = this.lstCTietBCao.findIndex(item => item.id === id);
    if (!this.lstCTietBCao[index].maKhoanMuc) {
        this.deleteLine(id);
        return;
    }
    // lay vi tri hang minh sua
    this.editCache[id] = {
        data: { ...this.lstCTietBCao[index] },
        edit: false
    };
}

// luu thay doi
saveEdit(id: string): void {
    this.editCache[id].data.checked = this.lstCTietBCao.find(item => item.id === id).checked; // set checked editCache = checked lstCTietBCao
    if (this.lstKhoanMuc.findIndex(e => e.idCha == this.editCache[id].data.maKhoanMuc) != -1) {
        this.editCache[id].data.status = true;
    }
    const index = this.lstCTietBCao.findIndex(item => item.id === id); // lay vi tri hang minh sua
    Object.assign(this.lstCTietBCao[index], this.editCache[id].data); // set lai data cua lstCTietBCao[index] = this.editCache[id].data
    this.editCache[id].edit = false; // CHUYEN VE DANG TEXT
    this.tinhTong1()
}

updateChecked(id: any) {
  var data: ItemData = this.lstCTietBCao.find(e => e.id === id);
  //đặt các phần tử con có cùng trạng thái với nó
  this.lstCTietBCao.forEach(item => {
      if (item.stt.startsWith(data.stt)) {
          item.checked = data.checked;
      }
  })
  //thay đổi các phần tử cha cho phù hợp với tháy đổi của phần tử con
  var index: number = this.lstCTietBCao.findIndex(e => e.stt == this.getHead(data.stt));
  if (index == -1) {
      this.allChecked = this.checkAllChild('0');
  } else {
      var nho: boolean = this.lstCTietBCao[index].checked;
      while (nho != this.checkAllChild(this.lstCTietBCao[index].stt)) {
          this.lstCTietBCao[index].checked = !nho;
          index = this.lstCTietBCao.findIndex(e => e.stt == this.getHead(this.lstCTietBCao[index].stt));
          if (index == -1) {
              this.allChecked = !nho;
              break;
          }
          nho = this.lstCTietBCao[index].checked;
      }
  }
}
//kiểm tra các phần tử con có cùng được đánh dấu hay ko
checkAllChild(str: string): boolean {
    var nho: boolean = true;
    this.lstCTietBCao.forEach(item => {
        if ((this.getHead(item.stt) == str) && (!item.checked) && (item.stt != str)) {
            nho = item.checked;
        }
    })
    return nho;
}


updateAllChecked() {
    this.lstCTietBCao.forEach(item => {
        item.checked = this.allChecked;
    })
}

deleteAllChecked() {
    var lstId: any[] = [];
    this.lstCTietBCao.forEach(item => {
        if (item.checked) {
            lstId.push(item.id);
        }
    })
    lstId.forEach(item => {
        if (this.lstCTietBCao.findIndex(e => e.id == item) != -1) {
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
        this.lstCTietBCao.push(item);
        this.editCache[item.id] = {
            edit: false,
            data: { ...item }
        };
    } else {
        let item: ItemData = {
            id: uuid.v4() + 'FE',
            maKhoanMuc: 0,
            lstKm: this.lstKhoanMuc.filter(e => e.idCha == 503),
            status: false,
            stt: "0.1",
            nguonKhac: 0,
            nguonNsnn: 0,
            tong: 0,
            checked: false,
        }
        this.lstCTietBCao.push(item);

        this.editCache[item.id] = {
            edit: true,
            data: { ...item }
        };
    }
}

sortByIndex() {
    this.lstCTietBCao.forEach(item => {
        this.setDetail(item.id);
    })
    this.lstCTietBCao.sort((item1, item2) => {
        if (item1.lstKm[0].levelDm > item2.lstKm[0].levelDm) {
            return 1;
        }
        if (item1.lstKm[0].levelDm < item2.lstKm[0].levelDm) {
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
    this.lstCTietBCao.forEach(item => {
        var index: number = lstTemp.findIndex(e => e.stt == this.getHead(item.stt));
        if (index == -1) {
            lstTemp.splice(0, 0, item);
        } else {
            lstTemp.splice(index + 1, 0, item);
        }
    })

    this.lstCTietBCao = lstTemp;
}

setDetail(id: any) {
    var index: number = this.lstCTietBCao.findIndex(item => item.id === id);
    var parentId: number = this.lstKhoanMuc.find(e => e.id == this.lstCTietBCao[index].maKhoanMuc).idCha;
    this.lstCTietBCao[index].lstKm = this.lstKhoanMuc.filter(e => e.idCha == parentId);
    if (this.lstKhoanMuc.findIndex(e => e.idCha === this.lstCTietBCao[index].maKhoanMuc) == -1) {
        this.lstCTietBCao[index].status = false;
    } else {
        this.lstCTietBCao[index].status = true;
    }
}

sortWithoutIndex() {
    this.lstCTietBCao.forEach(item => {
        this.setDetail(item.id);
    })

    var level = 0;
    var lstCTietBCaoTemp: ItemData[] = this.lstCTietBCao;
    this.lstCTietBCao = [];
    var data: ItemData = lstCTietBCaoTemp.find(e => e.lstKm[0].levelDm == 0);
    this.addFirst(data);
    lstCTietBCaoTemp = lstCTietBCaoTemp.filter(e => e.id != data.id);
    var lstTemp: ItemData[] = lstCTietBCaoTemp.filter(e => e.lstKm[0].levelDm == level);
    while (lstTemp.length !=0 || level == 0){
        lstTemp.forEach(item => {
            var index: number = this.lstCTietBCao.findIndex(e => e.maKhoanMuc === item.lstKm[0].idCha);
            if (index != -1){
                this.addLow(this.lstCTietBCao[index].id, item);
            } else {
                index = this.lstCTietBCao.findIndex(e => e.lstKm[0].idCha === item.lstKm[0].idCha);
                this.addSame(this.lstCTietBCao[index].id, item);
            }
        })
        level += 1;
        lstTemp = lstCTietBCaoTemp.filter(e => e.lstKm[0].levelDm == level);
    }
}


}
