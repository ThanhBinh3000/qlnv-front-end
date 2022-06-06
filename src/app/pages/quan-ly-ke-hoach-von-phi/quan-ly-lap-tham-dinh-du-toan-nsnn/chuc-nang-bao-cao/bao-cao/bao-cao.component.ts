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
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import * as uuid from "uuid";
import { MESSAGE } from '../../../../../constants/message';
import { MESSAGEVALIDATE } from '../../../../../constants/messageValidate';
import { DanhMucHDVService } from '../../../../../services/danhMucHDV.service';
import { TRANG_THAI_PHU_LUC, TRANG_THAI_TIM_KIEM, Utils } from "../../../../../Utility/utils";
import { PHU_LUC } from '../../quan-ly-lap-tham-dinh-du-toan-nsnn.constant';


export class ItemData {
	id: any;
	maBieuMau: string;
	trangThai: string;
	maDviTien: string;
	lyDoTuChoi: string;
	thuyetMinh: string;
	nguoiBcao: string;
	lstCtietLapThamDinhs: any[];
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
	styleUrls: ['./bao-cao.component.scss'],
})

export class BaoCaoComponent implements OnInit {
	//thong tin dang nhap
	id!: any;
	loai!: string;
	userInfo: any;
	//thong tin chung bao cao
	maBaoCao!: string;
	namHienHanh!: number;
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
	giaoSoTranChiId: any;
	capDvi: string;
	//danh muc
	lstLapThamDinhs: ItemData[] = [];
	phuLucs: any[] = PHU_LUC;
	donVis: any[] = [];
	tabs: any[] = [];
	lstDviTrucThuoc: any[] = [];
	trangThaiBaoCaos: any[] = TRANG_THAI_TIM_KIEM;
	trangThaiBieuMaus: any[] = TRANG_THAI_PHU_LUC;
	canBos: any[] = [
		{
			id: "51520",
			fullName: "canbo1",
		},
		{
			id: "51550",
			fullName: "canbo2",
		},
		{
			id: "51480",
			fullName: "canbo",
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
	statusBtnUser: boolean;
	statusBtnNhap: boolean;
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
		this.loai = this.routerActive.snapshot.paramMap.get('loai');
		this.id = this.routerActive.snapshot.paramMap.get('id');
		this.maDviTao = this.routerActive.snapshot.paramMap.get('maDvi');
		var nam: any = this.routerActive.snapshot.paramMap.get('namHienHanh');
		let userName = this.userService.getUserName();
		await this.getUserInfo(userName); //get user info
		if (this.id) {
			await this.getDetailReport();
		} else {
			if (this.maDviTao && nam) {
				this.loai = "1";
				this.namHienHanh = parseInt(nam, 10);
				await this.tongHop();
				this.trangThaiBaoCao = "1";
				this.nguoiNhap = this.userInfo?.username;
				this.quanLyVonPhiService.sinhMaBaoCao().toPromise().then(
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
					this.lstLapThamDinhs.push({
						id: uuid.v4() + 'FE',
						maBieuMau: item.id,
						trangThai: '3',
						maDviTien: '',
						lyDoTuChoi: "",
						thuyetMinh: "",
						nguoiBcao: "",
						lstCtietLapThamDinhs: [],
						checked: false,
					})
				})
				this.trangThaiBaoCao = "1";
				this.nguoiNhap = this.userInfo?.username;
				this.maDviTao = this.userInfo?.dvql;
				this.spinner.show();
				this.quanLyVonPhiService.sinhMaBaoCao().toPromise().then(
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
					this.namHienHanh = new Date().getFullYear();
				}
			}


		}

		//lay danh sach danh muc don vi
		await this.danhMucService.dMDonVi().toPromise().then(
			(data) => {
				if (data.statusCode == 0) {
					this.donVis = data.data;
					this.donVis.forEach(e => {
						if (e.maDvi == this.userInfo?.dvql){
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

	//upload file
	async uploadFile(file: File) {
		// day file len server
		const upfile: FormData = new FormData();
		upfile.append('file', file);
		upfile.append('folder', this.maDviTao + '/' + this.maBaoCao);
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
		let checkSave = true;
		this.lstLapThamDinhs.forEach(e => {
			if (!e.nguoiBcao) {
				checkSave = false;
			}
		})

		if (!checkSave) {
			this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
			return;
		}

		// replace nhung ban ghi dc them moi id thanh null
		this.lstLapThamDinhs.forEach(item => {
			if (item.id?.length == 38) {
				item.id = null;
			}
		})

		let tongHopTuIds = [];
		this.lstDviTrucThuoc.forEach(item => {
			tongHopTuIds.push(item.id);
		})

		//get list file url
		let listFile: any = [];
		for (const iterator of this.listFile) {
			listFile.push(await this.uploadFile(iterator));
		}
		let request = JSON.parse(JSON.stringify({
			id: this.id,
			fileDinhKems: this.lstFiles,
			listIdDeleteFiles: this.listIdFilesDelete,                      // id file luc get chi tiet tra ra( de backend phuc vu xoa file)
			lstLapThamDinhs: this.lstLapThamDinhs,
			maBcao: this.maBaoCao,
			maDvi: this.maDviTao,
			namBcao: this.namHienHanh,
			namHienHanh: this.namHienHanh,
			congVan: this.congVan,
			tongHopTuIds: tongHopTuIds,
		})) ;
		//get file cong van url
		let file: any = this.fileDetail;
		if (file) {
		  request.congVan = await this.uploadFile(file);
		}

		//call service them moi
		this.spinner.show();
		if (this.id == null) {
			this.quanLyVonPhiService.trinhDuyetService(request).toPromise().then(
				async data => {
					if (data.statusCode == 0) {
						this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
						if (!this.id) {
							this.router.navigate([
								'/qlkh-von-phi/quan-ly-lap-tham-dinh-du-toan-nsnn/bao-cao/'+ this.loai+ "/" + data.data.id,
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
			this.quanLyVonPhiService.updateBieuMau(request).toPromise().then(
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
		this.lstLapThamDinhs.filter(item => {
			if (!item.id) {
				item.id = uuid.v4() + 'FE';
			}
		});
		this.spinner.hide();
	}

	// chuc nang check role
	async onSubmit(mcn: string, lyDoTuChoi: string) {
		if (mcn == Utils.TT_BC_2) {
			let check = true;
			this.lstLapThamDinhs.forEach(item => {
				if (item.trangThai != '5') {
					check = false;
				}
			})
			if (!check) {
				this.notification.warning(MESSAGE.ERROR, MESSAGE.FINISH_FORM);
				return;
			}
		} else {
			let check = true;
			this.lstLapThamDinhs.forEach(item => {
				if (item.trangThai == '2') {
					check = false;
				}
			})
			if (!check) {
				this.notification.warning(MESSAGE.ERROR, MESSAGE.RATE_FORM);
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
			await this.quanLyVonPhiService.approveThamDinh(requestGroupButtons).toPromise().then(async (data) => {
				if (data.statusCode == 0) {
					this.trangThaiBaoCao = mcn;
					this.getStatusButton();
					if (mcn == Utils.TT_BC_8 || mcn == Utils.TT_BC_5 || mcn == Utils.TT_BC_3) {
						this.notification.success(MESSAGE.SUCCESS, MESSAGE.REJECT_SUCCESS);
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
		await this.quanLyVonPhiService.bCLapThamDinhDuToanChiTiet(this.id).toPromise().then(
			(data) => {
				if (data.statusCode == 0) {
					this.lstLapThamDinhs = data.data.lstLapThamDinhs;
					this.lstDviTrucThuoc = data.data.lstBcaoDviTrucThuocs;
					this.lstFiles = data.data.lstFiles;
					this.listFile = [];
					// set thong tin chung bao cao
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
					this.lyDoTuChoi = data.data.lyDoTuChoi;
					this.giaoSoTranChiId = data.data.giaoSoTranChiId;
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

	// call chi tiet bao cao
	async tongHop() {
		let request = {
			maDvi: this.maDviTao,
			namHienTai: this.namHienHanh,
		}
		this.spinner.show();
		await this.quanLyVonPhiService.tongHop(request).toPromise().then(
			(data) => {
				if (data.statusCode == 0) {
					this.lstLapThamDinhs = data.data.lstLapThamDinhs;
					this.lstDviTrucThuoc = data.data.lstBcaoDviTrucThuocs;
					this.lstLapThamDinhs.forEach(item => {
						if (!item.id) {
							item.id = uuid.v4() + 'FE';
						}
						item.nguoiBcao = this.userInfo?.username;
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
		var danhSach = this.phuLucs.filter(item => this.lstLapThamDinhs.findIndex(e => e.maBieuMau == item.id) == -1);

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
						this.lstLapThamDinhs.push({
							id: uuid.v4() + 'FE',
							maBieuMau: item.id,
							trangThai: '3',
							maDviTien: '',
							lyDoTuChoi: "",
							thuyetMinh: "",
							nguoiBcao: "",
							lstCtietLapThamDinhs: [],
							checked: false,
						});
					}
				})
			}
		});
	}

	// xóa với checkbox
	deleteSelected() {
		this.lstLapThamDinhs.forEach(item => {
			if (this.tabs.findIndex(e => e.id == item.maBieuMau) != -1) {
				this.tabs = [];
			}
		})
		// delete object have checked = true
		this.lstLapThamDinhs = this.lstLapThamDinhs.filter(item => item.checked != true)
		this.allChecked = false;
	}

	// click o checkbox all
	updateAllChecked(): void {
		if (this.allChecked) {                                    // checkboxall == true thi set lai lstLapThamDinhs.checked = true
			this.lstLapThamDinhs = this.lstLapThamDinhs.map(item => ({
				...item,
				checked: true
			}));
		} else {
			this.lstLapThamDinhs = this.lstLapThamDinhs.map(item => ({    // checkboxall == false thi set lai lstLapThamDinhs.checked = false
				...item,
				checked: false
			}));
		}
	}

	// click o checkbox single
	updateSingleChecked(): void {
		if (this.lstLapThamDinhs.every(item => !item.checked)) {           // tat ca o checkbox deu = false thi set o checkbox all = false
			this.allChecked = false;
		} else if (this.lstLapThamDinhs.every(item => item.checked)) {     // tat ca o checkbox deu = true thi set o checkbox all = true
			this.allChecked = true;
		}
	}

	redirectChiTieuKeHoachNam() {
		// this.router.navigate(['/qlkh-von-phi/quan-ly-lap-tham-dinh-du-toan-nsnn/tim-kiem']);
		this.location.back();

	}

	xemChiTiet(id: any) {
		this.router.navigate([
			'/qlkh-von-phi/quan-ly-lap-tham-dinh-du-toan-nsnn/bao-cao/' + id,
		])
		// window.location.reload();
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
			let item = this.lstLapThamDinhs.find(e => e.maBieuMau == id);
			this.data = {
				...item,
				namHienHanh: this.namHienHanh,
				trangThaiBaoCao: this.trangThaiBaoCao,
				statusBtnOk: this.statusBtnOk,
				statusBtnFinish: this.statusBtnFinish,
				status: this.status,
			}
			this.tabs = [];
			this.tabs.push(PHU_LUC.find(e => e.id === id));
			this.selectedIndex = this.tabs.length + 1;
		}
	}

	getNewData(obj: any) {
		let index = this.lstLapThamDinhs.findIndex(e => e.maBieuMau == this.tabs[0].id);
		if (obj?.trangThai == '-1') {
			this.getDetailReport();
			this.data = {
				...this.lstLapThamDinhs[index],
				namHienHanh: this.namHienHanh,
				trangThaiBaoCao: this.trangThaiBaoCao,
				statusBtnOk: this.statusBtnOk,
				statusBtnFinish: this.statusBtnFinish,
				status: this.status,
			}
			this.tabs = [];
			this.tabs.push(PHU_LUC.find(e => e.id == this.lstLapThamDinhs[index].maBieuMau));
			this.selectedIndex = this.tabs.length + 1;
		} else {
			this.lstLapThamDinhs[index].trangThai = obj?.trangThai;
			this.lstLapThamDinhs[index].lyDoTuChoi = obj?.lyDoTuChoi;
		}
	}

	close() {
		if (this.loai == "0") {
			this.router.navigate(['/qlkh-von-phi/quan-ly-lap-tham-dinh-du-toan-nsnn/tim-kiem']);
		} else {
			if (this.loai == "1"){
				this.router.navigate(['/qlkh-von-phi/quan-ly-lap-tham-dinh-du-toan-nsnn/tong-hop']);
			} else {
				this.location.back();
			}
		}
	}

	xemSoKiemTra(){
		if (this.capDvi == Utils.TONG_CUC){
			this.router.navigate(['/qlkh-von-phi/quan-ly-lap-tham-dinh-du-toan-nsnn/so-kiem-tra-tran-chi-tu-btc' + this.giaoSoTranChiId]);
		} else {
			this.router.navigate(['/qlkh-von-phi/quan-ly-lap-tham-dinh-du-toan-nsnn/so-kiem-tra-chi-nsnn' + this.giaoSoTranChiId]);
		}
	}
}
