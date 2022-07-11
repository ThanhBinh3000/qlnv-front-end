import { ROLE_CAN_BO, ROLE_TRUONG_BO_PHAN, ROLE_LANH_DAO } from './../../../../Utility/utils';
import { DialogDieuChinhCopyComponent } from './../../../../components/dialog/dialog-dieu-chinh-copy/dialog-dieu-chinh-copy.component';
import { DatePipe, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import * as fileSaver from 'file-saver';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogChonThemBieuMauComponent } from 'src/app/components/dialog/dialog-chon-them-bieu-mau/dialog-chon-them-bieu-mau.component';
import { DialogCopyComponent } from 'src/app/components/dialog/dialog-copy/dialog-copy.component';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import * as uuid from "uuid";
import { MESSAGE } from '../../../../constants/message';
import { MESSAGEVALIDATE } from '../../../../constants/messageValidate';
import { DanhMucHDVService } from '../../../../services/danhMucHDV.service';
import { TRANG_THAI_PHU_LUC, Utils } from "../../../../Utility/utils";
import { PHU_LUC } from '../quan-ly-dieu-chinh-du-toan-chi-nsnn.constant';
import { A } from '@angular/cdk/keycodes';


// export class ItemData {
// 	id: any;
// 	maLoai: string;
// 	trangThai: string;
// 	maDviTien: string;
// 	lyDoTuChoi: string;
// 	thuyetMinh: string;
// 	giaoCho: string;
// 	lstCtietDieuChinhs: any[];
// 	checked: boolean;
// }
export class ItemData {
	id: any;
	maLoai: string;
	trangThai: string;
	maDviTien: string;
	lyDoTuChoi: string;
	thuyetMinh: string;
	giaoCho: string;
	lstCtietDchinh: any[] ;
	checked: boolean;
}

export class ItemCongVan {
	fileName: string;
	fileSize: number;
	fileUrl: number;
}
@Component({
	selector: 'app-giao-nhiem-vu',
	templateUrl: './giao-nhiem-vu.component.html',
	styleUrls: ['./giao-nhiem-vu.component.scss'],
})

export class GiaoNhiemVuComponent implements OnInit {
	//thong tin dang nhap
	id!: any;
  loai!: string;
	userInfo: any;
	//thong tin chung bao cao
	maBaoCao!: string;
	namHienHanh: number = new Date().getFullYear();
	namBcao : string;
	ngayNhap!: string;
	nguoiNhap!: string;
	congVan: ItemCongVan = new ItemCongVan();
	ngayTrinhDuyet!: string;
	ngayDuyetTBP!: string;
	ngayDuyetLD!: string;
	ngayCapTrenTraKq!: string;
	trangThaiBaoCao: string = '1';
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
	phuLucs: any[] = JSON.parse(JSON.stringify(PHU_LUC)) ;
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
	];;
	trangThaiBieuMaus: any[] = TRANG_THAI_PHU_LUC;
	canBos: any[] = [
		{
			id: "10008",
			fullName: "canbocc",
		},
		{
			id: "10005",
			fullName: "canboc",
		},
		{
			id: "10002",
			fullName: "canbotc",
		}
	];
	lstFiles: any[] = []; //show file ra man hinh
	//file
	listFile: File[] = [];                      // list file chua ten va id de hien tai o input
	fileList: NzUploadFile[] = [];
	fileDetail: NzUploadFile;
	//beforeUpload: any;
	listIdFilesDelete: any = [];                        // id file luc call chi tiet
	//trang thai cac nut
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
	//khac
	data: any;
	selectedIndex: number = 1;
	allChecked = false;                         // check all checkbox

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


	constructor(private router: Router,
		private routerActive: ActivatedRoute,
		private spinner: NgxSpinnerService,
		private quanLyVonPhiService: QuanLyVonPhiService,
		private datePipe: DatePipe,
		private sanitizer: DomSanitizer,
		private danhMucService: DanhMucHDVService,
		private userService: UserService,
		private notification: NzNotificationService,
		private location: Location,
		private modal: NzModalService,
	) {
		this.ngayNhap = this.datePipe.transform(new Date(), Utils.FORMAT_DATE_STR,)
	}

	async ngOnInit() {
		this.id = this.routerActive.snapshot.paramMap.get('id');
    this.loai = this.routerActive.snapshot.paramMap.get('loai');
		this.maDviTao = this.routerActive.snapshot.paramMap.get('maDvi');
		var dotBcaoDieuChinh = this.routerActive.snapshot.paramMap.get('dotBcao');
    this.dotBcao = parseInt(dotBcaoDieuChinh, 10)
		var nam: any = this.routerActive.snapshot.paramMap.get('namHienHanh');
		let userName = this.userService.getUserName();
		await this.getUserInfo(userName); //get user info
		if (this.id) {
			await this.getDetailReport();
		} else {
			if (dotBcaoDieuChinh && nam) {
        		this.loai = "1";
				this.namHienHanh = parseInt(nam, 10);
				await this.tongHop();
				this.trangThaiBaoCao = "1";
				this.nguoiNhap = this.userInfo?.username;
				this.quanLyVonPhiService.sinhMaBaoCaoDieuChinh().toPromise().then(
					(data) => {
						if (data.statusCode == 0) {
							this.maBaoCao = data.data;
						} else {
							this.notification.error(MESSAGE.ERROR, data?.msg);
						}
					},
					(err) => {
						this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
					}
				);
				this.maBaoCao = '';
			} else {
        this.loai = "0";
				this.phuLucs.forEach(item => {
					this.lstDieuChinhs.push({
						id: uuid.v4() + 'FE',
						maLoai: item.id,
						trangThai: '3',
						maDviTien: '',
						lyDoTuChoi: "",
						thuyetMinh: "",
						giaoCho: "",
						lstCtietDchinh: [],
						checked: false,
					})
				})
        // this.dotBcao = 1
				this.trangThaiBaoCao = "1";
				this.nguoiNhap = this.userInfo?.username;
				this.maDviTao = this.userInfo?.dvql;
				this.spinner.show();
				this.quanLyVonPhiService.sinhMaBaoCaoDieuChinh().toPromise().then(
					(data) => {
						if (data.statusCode == 0) {
							this.maBaoCao = data.data;
						} else {
							this.notification.error(MESSAGE.ERROR, data?.msg);
						}
					},
					(err) => {
						this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
					}
				);
				this.maBaoCao = '';
				if (nam) {
					this.namHienHanh = parseInt(nam, 10);
				} else {
				}
			}

		}
    this.changeNam();
    this.changeDot();
		//lay danh sach danh muc don vi
		await this.danhMucService.dMDonVi().toPromise().then(
			(data) => {
				if (data.statusCode == 0) {
					this.donVis = data.data;
				} else {
					this.notification.error(MESSAGE.ERROR, data?.msg);
				}
			},
			(err) => {
				this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
			}
		);
		this.getStatusButton();
		this.spinner.hide();
	}

  changeNam(){
    this.phuLucs.forEach(item => {
      item.tenDm = PHU_LUC.find(el => el.id == item.id)?.tenDm + this.namHienHanh;
    })
    this.changeDot()
  }
  changeDot(){
    let item1 = this.phuLucs.find(item => item.id == "1")
    item1.tenDm = "Tổng hợp điều chỉnh dự toán chi ngân sách nhà nước đợt " + this.dotBcao +"/năm " + this.namHienHanh
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
		let roleNguoiTao = this.userInfo?.roles[0]?.code;
		if( ROLE_TRUONG_BO_PHAN.includes(roleNguoiTao) ||  ROLE_LANH_DAO.includes(roleNguoiTao)){
			this.status = true;
		}
		let checkParent = false;
		let checkChirld = false;
		let dVi = this.donVis.find(e => e.maDvi == this.maDviTao);
		if (dVi && dVi.maDvi == this.userInfo.dvql) {
			checkChirld = true;
		}
		if (dVi && dVi?.maDviCha == this.userInfo.dvql) {
			checkParent = true;
		}
		const utils = new Utils();
		this.statusBtnSave = utils.getRoleSave(this.trangThaiBaoCao, checkChirld, roleNguoiTao);
		this.statusBtnApprove = utils.getRoleApprove(this.trangThaiBaoCao, checkChirld, roleNguoiTao);
		this.statusBtnTBP = utils.getRoleTBP(this.trangThaiBaoCao, checkChirld, roleNguoiTao);
		this.statusBtnLD = utils.getRoleLD(this.trangThaiBaoCao, checkChirld, roleNguoiTao);
		this.statusBtnGuiDVCT = utils.getRoleGuiDVCT(this.trangThaiBaoCao, checkChirld, roleNguoiTao);
		this.statusBtnDVCT = utils.getRoleDVCT(this.trangThaiBaoCao, checkParent, roleNguoiTao);
		this.statusBtnCopy = utils.getRoleCopy(this.trangThaiBaoCao, checkChirld, roleNguoiTao);
		// this.statusBtnPrint = utils.getRolePrint(this.trangThaiBaoCao, checkChirld, roleNguoiTao);
    this.statusBtnPrint = false
		if ((this.trangThaiBaoCao == Utils.TT_BC_7 && ROLE_CAN_BO.includes(roleNguoiTao) && checkParent) ||
			(this.trangThaiBaoCao == Utils.TT_BC_2 && ROLE_TRUONG_BO_PHAN.includes(roleNguoiTao) && checkChirld) ||
			(this.trangThaiBaoCao == Utils.TT_BC_4 && ROLE_LANH_DAO.includes(roleNguoiTao) && checkChirld)) {
			this.statusBtnOk = true;
		} else {
			this.statusBtnOk = false;
		}
		if ((this.trangThaiBaoCao == Utils.TT_BC_1 || this.trangThaiBaoCao == Utils.TT_BC_3 || this.trangThaiBaoCao == Utils.TT_BC_5 || this.trangThaiBaoCao == Utils.TT_BC_8)
			&& ROLE_CAN_BO.includes(roleNguoiTao) && checkChirld) {
			this.statusBtnFinish = false;
		} else {
			this.statusBtnFinish = true;
		}
	}

	//get user info
	async getUserInfo(username: string) {
		await this.userService.getUserInfo(username).toPromise().then(
			(data) => {
				if (data?.statusCode == 0) {
					this.userInfo = data?.data
					this.maDviUser = data?.data.dvql;
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

	//upload file
	async uploadFile(file: File) {
		// day file len server
		const upfile: FormData = new FormData();
		upfile.append('file', file);
		upfile.append('folder', this.maBaoCao + '/' + this.maDviTao);
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

	//download file về máy tính
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

	// luu
	async save() {
    // check lưu trong bảng trước khi nhấn lưu
    let checkSave = true;
    this.lstDieuChinhs.forEach(e => {
      if (!e.giaoCho) {
        checkSave = false;
      }
    })
    if (!checkSave) {
      this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
      return;
    }
	if(!this.dotBcao){
		this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOT_EMPTY_DOTBC)
		return
	}

		// replace nhung ban ghi dc them moi id thanh null
		this.lstDieuChinhs.forEach(item => {
			if (item.id?.length == 38) {
				item.id = null;
			}
		})

    // thêm cac dvi trực thuộc vào danh sách thêm mới sau khi tổng hợp
		let tongHopTuIds = [];
		this.lstDviTrucThuoc.forEach(item => {
			tongHopTuIds.push(item.id);
		})
    //get list file url
    let checkFile = true;
    for (const iterator of this.listFile) {
        if (iterator.size > Utils.FILE_SIZE){
            checkFile = false;
        }
    }
    if (!checkFile){
        this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.OVER_SIZE);
        return;
    }
    //get list file url
    let listFile: any = [];
    for (const iterator of this.listFile) {
      listFile.push(await this.uploadFile(iterator));
    }

		let request = JSON.parse(JSON.stringify({
			id: this.id,
			fileDinhKems: this.lstFiles,
			listIdFiles: this.listIdFilesDelete,                      // id file luc get chi tiet tra ra( de backend phuc vu xoa file)
			lstDchinh: this.lstDieuChinhs,
			maBcao: this.maBaoCao,
			maDvi: this.maDviTao,
			namBcao: this.namHienHanh,
			namHienHanh: this.namHienHanh,
      dotBcao: this.dotBcao,
      congVan: this.congVan,
			tongHopTuIds: tongHopTuIds,
		}));
    if (request.congVan.fileName == null){
      this.notification.warning(MESSAGE.WARNING, "Vui lòng nhập file công văn");
      return;
    }
    //get file cong van url
		let file: any = this.fileDetail;
    if (file) {
      if (file.size > Utils.FILE_SIZE){
          this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.OVER_SIZE);
      return;
      } else {
          request.congVan = await this.uploadFile(file);
      }
    }
		if (file) {
			request.congVan = await this.uploadFile(file);
		}
    if (!request.congVan){
			this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.DOCUMENTARY);
			return;
		}
    if(!request.dotBcao){
      this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS)
    }
		//call service them moi
		this.spinner.show();
		if (this.id == null) {
			this.quanLyVonPhiService.trinhDuyetDieuChinhService(request).toPromise().then(
				async data => {
					if (data.statusCode == 0) {
						this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
						if (!this.id) {
							this.router.navigate([
								'/qlkh-von-phi/quan-ly-dieu-chinh-du-toan-chi-nsnn/giao-nhiem-vu/'+ data.data.id
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
			this.quanLyVonPhiService.updateDieuChinh(request).toPromise().then(
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
		this.lstDieuChinhs.filter(item => {
			if (!item.id) {
				item.id = uuid.v4() + 'FE';
			}
		});
		this.spinner.hide();
	}

	// chuc nang check role
	async onSubmit(mcn: string, lyDoTuChoi: string) {
		if (mcn == Utils.TT_BC_2){
			let check = true;
			this.lstDieuChinhs.forEach(item => {
				if (item.trangThai != '5'){
					check = false;
				}
			})
			if (!check){
				this.notification.warning(MESSAGE.ERROR, "Vui lòng hoàn tất nhập liệu các biểu mẫu trước khi thực hiện thao tác!");
				return;
			}
		}
		if (this.id) {
			const requestGroupButtons = {
				id: this.id,
				maChucNang: mcn,
				lyDoTuChoi: lyDoTuChoi,
			};
			this.spinner.show();
			await this.quanLyVonPhiService.approveDieuChinh(requestGroupButtons).toPromise().then(async (data) => {
				if (data.statusCode == 0) {
					this.trangThaiBaoCao = mcn;
					this.ngayTrinhDuyet = this.datePipe.transform(data.data.ngayTrinh, Utils.FORMAT_DATE_STR);
					this.ngayDuyetTBP = this.datePipe.transform(data.data.ngayDuyet, Utils.FORMAT_DATE_STR);
					this.ngayDuyetLD = this.datePipe.transform(data.data.ngayPheDuyet,Utils.FORMAT_DATE_STR);
					this.ngayCapTrenTraKq = this.datePipe.transform(data.data.ngayTraKq,Utils.FORMAT_DATE_STR);
					this.getStatusButton();
          // this.getStatusButtonOk();
					if (mcn == Utils.TT_BC_8 || mcn == Utils.TT_BC_5 || mcn == Utils.TT_BC_3) {
						this.notification.success(MESSAGE.SUCCESS, MESSAGE.REVERT_SUCCESS);
					} else {
						this.notification.success(MESSAGE.SUCCESS, MESSAGE.APPROVE_SUCCESS);
					}
					this.tabs = [];
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
	// call chi tiet bao cao
	async getDetailReport() {
		this.spinner.show();
		await this.quanLyVonPhiService.bCDieuChinhDuToanChiTiet(this.id).toPromise().then(
			(data) => {
				if (data.statusCode == 0) {
					this.lstDieuChinhs = data.data.lstDchinhs;
					this.lstDviTrucThuoc = data.data.lstDchinhDviTrucThuocs;
          			this.lstFiles = data.data.lstFiles;
					this.listFile = [];
					// set thong tin chung bao cao
					this.namBcao = data.data.namBcao;
					this.ngayNhap = this.datePipe.transform(data.data.ngayTao, Utils.FORMAT_DATE_STR);
					this.nguoiNhap = data.data.nguoiTao;
					this.maBaoCao = data.data.maBcao;
					this.maDviTao = data.data.maDvi;
					this.namHienHanh = data.data.namHienHanh;
					this.trangThaiBaoCao = data.data.trangThai;
					this.ngayTrinhDuyet = this.datePipe.transform(data.data.ngayTrinh, Utils.FORMAT_DATE_STR);
					this.ngayDuyetTBP = this.datePipe.transform(data.data.ngayDuyet, Utils.FORMAT_DATE_STR);
					this.ngayDuyetLD = this.datePipe.transform(data.data.ngayPheDuyet, Utils.FORMAT_DATE_STR);
					this.ngayCapTrenTraKq = this.datePipe.transform(data.data.ngayTraKq, Utils.FORMAT_DATE_STR);
					this.congVan = data.data.congVan;
					this.lstDviTrucThuoc.forEach(item => {
						item.ngayDuyet = this.datePipe.transform(item.ngayDuyet, Utils.FORMAT_DATE_STR);
						item.ngayPheDuyet = this.datePipe.transform(item.ngayPheDuyet, Utils.FORMAT_DATE_STR);
					})
          			this.dotBcao = data.data.dotBcao;
					this.loai = "0";
				} else {
					this.notification.error(MESSAGE.ERROR, data?.msg);
				}
			},
			(err) => {
				this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
			}
		);
		this.spinner.hide();
	}

	// call tong hop dieu chinh
	async tongHop() {
		let request = {
			dotBcao: this.dotBcao,
			namBcao: this.namHienHanh,
		}
		this.spinner.show();
		await this.quanLyVonPhiService.tongHopDieuChinhDuToan(request).toPromise().then(
			(data) => {
				if (data.statusCode == 0) {
					this.lstDieuChinhs = data.data.lstDchinhs;
					this.lstDviTrucThuoc = data.data.lstDchinhDviTrucThuocs;
					this.lstDieuChinhs.forEach(item => {
						if (!item.id){
							item.id = uuid.v4() + 'FE';
						}
						item.giaoCho = this.userInfo?.username;
						item.maDviTien = '1';
					})
					this.lstDviTrucThuoc.forEach(item => {
						item.ngayDuyet = this.datePipe.transform(item.ngayDuyet, Utils.FORMAT_DATE_STR);
						item.ngayPheDuyet = this.datePipe.transform(item.ngayPheDuyet, Utils.FORMAT_DATE_STR);
					})
				} else {
					this.notification.error(MESSAGE.ERROR, data?.msg);
				}
			},
			(err) => {
				this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
			}
		);
		this.spinner.hide();
	}

	// them phu luc
	addBieuMau() {
		this.phuLucs.forEach(item => item.status = false);
		var danhSach = this.phuLucs.filter(item => this.lstDieuChinhs.findIndex(e => e.maLoai == item.id) == -1);

		const modalIn = this.modal.create({
			nzTitle: 'Danh sách biểu mẫu',
			nzContent: DialogChonThemBieuMauComponent,
			nzMaskClosable: false,
			nzClosable: false,
			nzWidth: '600px',
			nzFooter: null,
			nzComponentParams: {
				danhSachBieuMau: danhSach
			},
		});
		modalIn.afterClose.subscribe((res) => {
			if (res) {
				res.forEach(item => {
					if (item.status) {
						this.lstDieuChinhs.push({
							id: uuid.v4() + 'FE',
							maLoai: item.id,
							trangThai: '3',
							maDviTien: '',
							lyDoTuChoi: "",
							thuyetMinh: "",
							giaoCho: "",
							lstCtietDchinh: [],
							checked: false,
						});
					}
				})
			}
		});
	}

	// xóa với checkbox
	deleteSelected() {
		this.lstDieuChinhs.forEach(item => {
			if (this.tabs.findIndex(e => e.id == item.maLoai) != -1) {
				this.tabs = [];
			}
		})
		// delete object have checked = true
		this.lstDieuChinhs = this.lstDieuChinhs.filter(item => item.checked != true)
		this.allChecked = false;
	}

	// click o checkbox all
	updateAllChecked(): void {
		if (this.allChecked) {                                    // checkboxall == true thi set lai lstDieuChinhs.checked = true
			this.lstDieuChinhs = this.lstDieuChinhs.map(item => ({
				...item,
				checked: true
			}));
		} else {
			this.lstDieuChinhs = this.lstDieuChinhs.map(item => ({    // checkboxall == false thi set lai lstDieuChinhs.checked = false
				...item,
				checked: false
			}));
		}
	}

	// click o checkbox single
	updateSingleChecked(): void {
		if (this.lstDieuChinhs.every(item => !item.checked)) {           // tat ca o checkbox deu = false thi set o checkbox all = false
			this.allChecked = false;
		} else if (this.lstDieuChinhs.every(item => item.checked)) {     // tat ca o checkbox deu = true thi set o checkbox all = true
			this.allChecked = true;
		}
	}

	redirectChiTieuKeHoachNam() {
		// this.router.navigate(['/qlkh-von-phi/quan-ly-lap-tham-dinh-du-toan-nsnn/tim-kiem']);
		this.location.back();

	}

	xemChiTiet(id: string) {
		this.router.navigate([
			'/qlkh-von-phi/quan-ly-dieu-chinh-du-toan-chi-nsnn/giao-nhiem-vu-/' + id,
		])
	}

	getStatusName(trangThai: string) {
		return this.trangThaiBaoCaos.find(e => e.id == trangThai)?.tenDm;
	}

	getUnitName(maDvi: string) {
		return this.donVis.find(e => e.maDvi == maDvi)?.tenDvi;
	}

	// lay trang thai cua bieu mau
	getStatusBM(trangThai: string) {
		return this.trangThaiBieuMaus.find(e => e.id == trangThai)?.ten;
	}

	closeTab({ index }: { index: number }): void {
		this.tabs.splice(index - 1, 1);
	}

  newTab(id: any): void {
		var index: number = this.tabs.findIndex(e => e.id === id);
		if (index != -1) {
			this.selectedIndex = index + 1;
		} else {
			let item = this.lstDieuChinhs.find(e => e.maLoai == id);
			this.data = {
				...item,
        maDviTao: this.maDviTao,
				namHienHanh: this.namHienHanh,
				trangThaiBaoCao: this.trangThaiBaoCao,
				statusBtnOk: this.statusBtnOk,
				statusBtnFinish: this.statusBtnFinish,
				status: this.status,
				namBcao: this.namBcao,
			}
			this.tabs = [];
			this.tabs.push(PHU_LUC.find(e => e.id === id));
			this.selectedIndex = this.tabs.length + 1;
		}

	}

	getNewData(obj: any) {
		let index = this.lstDieuChinhs.findIndex(e => e.maLoai == this.tabs[0].id);
		if (obj?.trangThai == '-1') {
			this.getDetailReport();
			this.data = {
				...this.lstDieuChinhs[index],
        maDviTao: this.maDviTao,
				namHienHanh: this.namHienHanh,
				trangThaiBaoCao: this.trangThaiBaoCao,
				statusBtnOk: this.statusBtnOk,
				statusBtnFinish: this.statusBtnFinish,
				status: this.status,
				namBcao: this.namBcao,
			}
			this.tabs = [];
			this.tabs.push(PHU_LUC.find(e => e.id == this.lstDieuChinhs[index].maLoai));
			this.selectedIndex = this.tabs.length + 1;
		} else {
			this.lstDieuChinhs[index].trangThai = obj?.trangThai;
			this.lstDieuChinhs[index].lyDoTuChoi = obj?.lyDoTuChoi;
		}
	}

	close() {
		debugger
		if (this.loai == "0" && this.maDviTao != this.maDviUser) {
			this.router.navigate(['/qlkh-von-phi/quan-ly-dieu-chinh-du-toan-chi-nsnn/tong-hop-dieu-chinh-du-toan-chi-NSNN']);
			return;
		}
		if(this.loai == "0" && this.maDviTao == this.maDviUser){
			this.location.back();
			return;
		}
		if(this.loai == "1"){
			this.location.back();
			return;
		}else{
			this.router.navigate(['/qlkh-von-phi/quan-ly-dieu-chinh-du-toan-chi-nsnn/tim-kiem-dieu-chinh-du-toan-chi-NSNN']);
		}
			//  else {
			// 	this.location.back();
			// }
	}

  showDialogCopy(){
		let obj = {
			namBcao: this.namHienHanh,
      dotBcao: this.dotBcao,
      loaiCopy: '',
      checkDvtt: this.lstDviTrucThuoc.length > 0 ? true : false,
		}
		const modalTuChoi = this.modal.create({
			nzTitle: 'Copy Báo Cáo',
			nzContent: DialogDieuChinhCopyComponent,
			nzMaskClosable: false,
			nzClosable: false,
			nzWidth: '900px',
			nzFooter: null,
			nzComponentParams: {
			  obj
			},
		  });
		  modalTuChoi.afterClose.toPromise().then(async (res) => {
			if (res){
				this.doCopy(res);
			}
		  });
	}

	async doCopy(response: any) {
		var maBcaoNew: string;
		await this.quanLyVonPhiService.sinhMaBaoCaoDieuChinh().toPromise().then(
			(data) => {
				if (data.statusCode == 0) {
					maBcaoNew = data.data;
				} else {
					this.notification.error(MESSAGE.ERROR, data?.msg);
					return;
				}
			},
			(err) => {
				this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
				return;
			}
		);
		let lstDieuChinhTemps: any[] = [];
		this.lstDieuChinhs.forEach(data => {
			let lstCtietTemp: any[] = [];
			data.lstCtietDchinh?.forEach(item => {
				lstCtietTemp.push({
					...item,
					id: null,
				})
			})
			lstDieuChinhTemps.push({
				...data,
				giaoCho: this.userInfo?.username,
				lstCtietDieuChinhs: lstCtietTemp,
				id: null,
			})
		})
    let tongHopTuIds = [];
    if (response.loaiCopy == 'D') {
      //xoa lst don vi truc thuoc theo lua chon tu dialog
      tongHopTuIds = [];
    }else{
      // thêm cac dvi trực thuộc vào danh sách thêm mới sau khi tổng hợp
      this.lstDviTrucThuoc.forEach(item => {
        tongHopTuIds.push(item.id);
      })
    }
		let request = {
			id: null,
			fileDinhKems: [],
			listIdFiles: [],                      // id file luc get chi tiet tra ra( de backend phuc vu xoa file)
			lstDchinh: lstDieuChinhTemps,
			maBcao: maBcaoNew,
			maDvi: this.maDviTao,
			namBcao: response?.namBcao,
			namHienHanh: response?.namBcao,
			dotBcao: response?.dotBcao,
			congVan: null,
			tongHopTuIds: tongHopTuIds ,
		};

		this.quanLyVonPhiService.trinhDuyetDieuChinhService(request).toPromise().then(
			async data => {
				if (data.statusCode == 0) {
					this.notification.success(MESSAGE.SUCCESS, MESSAGE.COPY_SUCCESS);
					const modalCopy = this.modal.create({
						nzTitle: MESSAGE.ALERT,
						nzContent: DialogCopyComponent,
						nzMaskClosable: false,
						nzClosable: false,
						nzWidth: '900px',
						nzFooter: null,
						nzComponentParams: {
						  maBcao: maBcaoNew
						},
					  });
				} else {
					this.notification.error(MESSAGE.ERROR, data?.msg);
				}
			},
			err => {
				this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
			},
		);

	}

  // action print
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
}
