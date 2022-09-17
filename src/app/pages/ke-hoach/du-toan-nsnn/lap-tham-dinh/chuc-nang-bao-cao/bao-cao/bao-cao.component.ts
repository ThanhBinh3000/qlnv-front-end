import { DatePipe, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as fileSaver from 'file-saver';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogChonThemBieuMauComponent } from 'src/app/components/dialog/dialog-chon-them-bieu-mau/dialog-chon-them-bieu-mau.component';
import { DialogCopyComponent } from 'src/app/components/dialog/dialog-copy/dialog-copy.component';
import { DialogDoCopyComponent } from 'src/app/components/dialog/dialog-do-copy/dialog-do-copy.component';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { DataService } from 'src/app/services/data.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import * as uuid from "uuid";
import { MESSAGE } from '../../../../../../constants/message';
import { MESSAGEVALIDATE } from '../../../../../../constants/messageValidate';
import { DanhMucHDVService } from '../../../../../../services/danhMucHDV.service';
import { LTD, ROLE_CAN_BO, ROLE_LANH_DAO, ROLE_TRUONG_BO_PHAN, TRANG_THAI_PHU_LUC, Utils } from "../../../../../../Utility/utils";
import { LAP_THAM_DINH, MAIN_ROUTE_DU_TOAN, MAIN_ROUTE_KE_HOACH, PHU_LUC } from '../../lap-tham-dinh.constant';


export class ItemData {
	id: string;
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
	id!: string;
	loai!: string;
	userInfo: any;
	//thong tin chung bao cao
	maBaoCao!: string;
	namHienHanh!: number;
	ngayNhap!: string;
	nguoiNhap!: string;
	congVan!: ItemCongVan;
	ngayTrinhDuyet!: string;
	ngayDuyetTBP!: string;
	ngayDuyetLD!: string;
	ngayCapTrenTraKq!: string;
	trangThaiBaoCao = Utils.TT_BC_1;
	maDviTao!: string;
	thuyetMinh: string;
	lyDoTuChoi: string;
	giaoSoTranChiId: string;


	//danh muc
	lstLapThamDinhs: ItemData[] = [];
	phuLucs: any[] = PHU_LUC;
	donVis: any[] = [];						//danh muc don vi con cua don vi dang nhap
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
			tenDm: "Trưởng BP duyệt",
		},
		{
			id: Utils.TT_BC_5,
			tenDm: "Lãnh đạo từ chối",
		},
		{
			id: Utils.TT_BC_7,
			tenDm: "Lãnh đạo phê duyệt",
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
	roles: string[] = [];
	lstFiles: any[] = []; //show file ra man hinh
	//file
	listFile: File[] = [];                      // list file chua ten va id de hien tai o input
	fileList: NzUploadFile[] = [];
	fileDetail: NzUploadFile;
	//beforeUpload: any;
	listIdFilesDelete: any = [];                        // id file luc call chi tiet
	//trang thai cac nut
	status = true;
	statusEdit = true;
	statusBtnSave = true;                      // trang thai an/hien nut luu
	statusBtnApprove = true;                   // trang thai an/hien nut trinh duyet
	statusBtnTBP = true;                       // trang thai an/hien nut truong bo phan
	statusBtnLD = true;                        // trang thai an/hien nut lanh dao
	statusBtnGuiDVCT = true;                   // trang thai nut gui don vi cap tren
	statusBtnDVCT = true;                      // trang thai nut don vi cap tren
	statusBtnCopy = true;                      // trang thai copy
	statusBtnPrint = true;                     // trang thai print
	statusBtnClose = false;
	statusBtnOk: boolean;
	statusBtnFinish: boolean;
	checkParent = false;
	statusBtnUser: boolean;
	statusBtnNhap: boolean;
	//khac
	data: any;
	selectedIndex = 1;
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
		private danhMucService: DanhMucHDVService,
		private userService: UserService,
		private notification: NzNotificationService,
		private location: Location,
		private modal: NzModalService,
		private dataSource: DataService,
	) {
		this.ngayNhap = this.datePipe.transform(new Date(), Utils.FORMAT_DATE_STR,)
	}

	async ngOnInit() {
		this.loai = this.routerActive.snapshot.paramMap.get('loai');
		this.id = this.routerActive.snapshot.paramMap.get('id');
		this.userInfo = this.userService.getUserLogin();
		this.roles = this.userInfo?.roles;

		this.spinner.show();
		await this.getListUser();
		if (this.id) {
			await this.getDetailReport();
		} else {
			await this.dataSource.currentData.subscribe(obj => {
				this.namHienHanh = obj?.namHienTai;
				this.maDviTao = obj?.maDvi ? obj?.maDvi : this.userInfo?.MA_DVI;
				this.lstLapThamDinhs = obj?.lstLapThamDinhs ? obj?.lstLapThamDinhs : [];
				this.lstDviTrucThuoc = obj?.lstDviTrucThuoc ? obj?.lstDviTrucThuoc : [];
			})
			if (!this.namHienHanh) {
				this.close();
			}
			this.trangThaiBaoCao = "1";
			this.nguoiNhap = this.userInfo?.username;
			await this.quanLyVonPhiService.sinhMaBaoCao().toPromise().then(
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
			if (this.lstDviTrucThuoc?.length > 0) {
				this.loai = "1";
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
			}
		}

		//lay danh sach danh muc don vi con
		await this.danhMucService.dMDviCon().toPromise().then(
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

	//nhóm các nút chức năng --báo cáo-----
	getStatusButton() {
		const isSynthetic = this.lstDviTrucThuoc.length != 0;
		const checkSave = isSynthetic ? this.roles.includes(LTD.EDIT_SYNTHETIC_REPORT) : this.roles.includes(LTD.EDIT_REPORT);
		const checkAppove = isSynthetic ? this.roles.includes(LTD.APPROVE_SYNTHETIC_REPORT) : this.roles.includes(LTD.APPROVE_REPORT);
		const checkDuyet = isSynthetic ? this.roles.includes(LTD.DUYET_SYNTHETIC_REPORT) : this.roles.includes(LTD.DUYET_REPORT);
		const checkPheDuyet = isSynthetic ? this.roles.includes(LTD.PHE_DUYET_SYNTHETIC_REPORT) : this.roles.includes(LTD.PHE_DUYET_REPORT);
		const checkTiepNhan = this.roles.includes(LTD.TIEP_NHAN_REPORT);
		const checkCopy = isSynthetic ? this.roles.includes(LTD.COPY_SYNTHETIC_REPORT) : this.roles.includes(LTD.COPY_REPORT);
		const checkPrint = isSynthetic ? this.roles.includes(LTD.PRINT_SYNTHETIC_REPORT) : this.roles.includes(LTD.PRINT_REPORT);
		if (checkSave && Utils.statusSave.includes(this.trangThaiBaoCao)) {
			this.status = false;
		} else {
			this.status = true;
		}
		this.checkParent = false;
		const checkChirld = this.maDviTao == this.userInfo?.MA_DVI;
		this.checkParent = this.donVis.findIndex(e => e.maDvi == this.maDviTao) != -1;

		if (this.checkParent) {
			const index: number = this.trangThaiBaoCaos.findIndex(e => e.id == Utils.TT_BC_7);
			this.trangThaiBaoCaos[index].tenDm = "Mới";
		}
		this.statusBtnSave = !(Utils.statusSave.includes(this.trangThaiBaoCao) && checkSave && checkChirld);
		this.statusBtnApprove = !(Utils.statusApprove.includes(this.trangThaiBaoCao) && checkAppove && checkChirld);
		this.statusBtnTBP = !(Utils.statusDuyet.includes(this.trangThaiBaoCao) && checkDuyet && checkChirld);
		this.statusBtnLD = !(Utils.statusPheDuyet.includes(this.trangThaiBaoCao) && checkPheDuyet && checkChirld);
		this.statusBtnDVCT = !(Utils.statusTiepNhan.includes(this.trangThaiBaoCao) && checkTiepNhan && this.checkParent);
		this.statusBtnCopy = !(Utils.statusCopy.includes(this.trangThaiBaoCao) && checkCopy && checkChirld);
		this.statusBtnPrint = !(Utils.statusPrint.includes(this.trangThaiBaoCao) && checkPrint && checkChirld);

		if (Utils.statusOK.includes(this.trangThaiBaoCao) && (checkTiepNhan || checkDuyet || checkPheDuyet)) {
			this.statusBtnOk = true;
		} else {
			this.statusBtnOk = false;
		}
		if (Utils.statusSave.includes(this.trangThaiBaoCao)
			&& checkSave && checkChirld) {
			this.statusBtnFinish = false;
		} else {
			this.statusBtnFinish = true;
		}

	}

	getBtnStatus(status: string[], role: string, check: boolean) {
		return !(status.includes(this.trangThaiBaoCao) && this.roles.includes(role) && check);
	}

	getListUser() {
		this.quanLyVonPhiService.getListUser().toPromise().then(res => {
			if (res.statusCode == 0) {
				this.canBos = res.data;
			}
		}, (err) => {
			this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
		})
	}

	//upload file
	async uploadFile(file: File) {
		// day file len server
		const upfile: FormData = new FormData();
		upfile.append('file', file);
		upfile.append('folder', this.maDviTao + '/' + this.maBaoCao);
		const temp = await this.quanLyVonPhiService.uploadFile(upfile).toPromise().then(
			(data) => {
				const objfile = {
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
		//let file!: File;
		const file: File = this.listFile.find(element => element?.lastModified.toString() == id);
		if (!file) {
			const fileAttach = this.lstFiles.find(element => element?.id == id);
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
			const file: any = this.fileDetail;
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

		const tongHopTuIds = [];
		this.lstDviTrucThuoc.forEach(item => {
			tongHopTuIds.push(item.id);
		})

		//get list file url
		let checkFile = true;
		for (const iterator of this.listFile) {
			if (iterator.size > Utils.FILE_SIZE) {
				checkFile = false;
			}
		}
		if (!checkFile) {
			this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.OVER_SIZE);
			return;
		}
		const listFile: any = [];
		for (const iterator of this.listFile) {
			listFile.push(await this.uploadFile(iterator));
		}

		const request = JSON.parse(JSON.stringify({
			id: this.id,
			fileDinhKems: this.lstFiles,
			listIdDeleteFiles: this.listIdFilesDelete,                      // id file luc get chi tiet tra ra( de backend phuc vu xoa file)
			lstLapThamDinhs: this.lstLapThamDinhs,
			maBcao: this.maBaoCao,
			maDvi: this.maDviTao,
			namBcao: this.namHienHanh,
			namHienHanh: this.namHienHanh,
			congVan: this.congVan,
			thuyetMinh: this.thuyetMinh,
			tongHopTuIds: tongHopTuIds,
		}));
		//get file cong van url
		const file: any = this.fileDetail;
		if (file) {
			if (file.size > Utils.FILE_SIZE) {
				this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.OVER_SIZE);
				return;
			} else {
				request.congVan = await this.uploadFile(file);
			}
		}

		if (!request.congVan) {
			this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.DOCUMENTARY);
			return;
		}

		// replace nhung ban ghi dc them moi id thanh null
		request.lstLapThamDinhs.forEach(item => {
			if (item.id?.length == 38) {
				item.id = null;
			}
		})

		//call service them moi
		this.spinner.show();
		if (!this.id) {
			this.quanLyVonPhiService.trinhDuyetService(request).toPromise().then(
				async data => {
					if (data.statusCode == 0) {
						this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
						this.router.navigate([
							MAIN_ROUTE_KE_HOACH + '/' + MAIN_ROUTE_DU_TOAN + '/' + LAP_THAM_DINH + '/bao-cao/' + this.loai + "/" + data.data.id,
						])
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
			if (mcn == Utils.TT_BC_4 || mcn == Utils.TT_BC_7 || mcn == Utils.TT_BC_9) {
				this.lstLapThamDinhs.forEach(item => {
					if (item.trangThai == '2') {
						check = false;
					}
				})
			}
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
					this.ngayTrinhDuyet = this.datePipe.transform(data.data.ngayTrinh, Utils.FORMAT_DATE_STR);
					this.ngayDuyetTBP = this.datePipe.transform(data.data.ngayDuyet, Utils.FORMAT_DATE_STR);
					this.ngayDuyetLD = this.datePipe.transform(data.data.ngayPheDuyet, Utils.FORMAT_DATE_STR);
					this.ngayCapTrenTraKq = this.datePipe.transform(data.data.ngayTraKq, Utils.FORMAT_DATE_STR);
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
					this.thuyetMinh = data.data.thuyetMinh;
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
	}

	// call chi tiet bao cao
	// async tongHop() {
	// 	const request = {
	// 		maDvi: this.maDviTao,
	// 		namHienTai: this.namHienHanh,
	// 	}
	// 	this.spinner.show();
	// 	await this.quanLyVonPhiService.tongHop(request).toPromise().then(
	// 		(data) => {
	// 			if (data.statusCode == 0) {
	// 				this.lstLapThamDinhs = data.data.lstLapThamDinhs;
	// 				this.lstDviTrucThuoc = data.data.lstBcaoDviTrucThuocs;
	// 				this.lstLapThamDinhs.forEach(item => {
	// 					if (!item.id) {
	// 						item.id = uuid.v4() + 'FE';
	// 					}
	// 					item.nguoiBcao = this.userInfo?.username;
	// 					item.maDviTien = '1';
	// 				})
	// 				this.lstDviTrucThuoc.forEach(item => {
	// 					item.ngayDuyet = this.datePipe.transform(item.ngayDuyet, Utils.FORMAT_DATE_STR);
	// 					item.ngayPheDuyet = this.datePipe.transform(item.ngayPheDuyet, Utils.FORMAT_DATE_STR);
	// 				})
	// 			} else {
	// 				this.notification.error(MESSAGE.ERROR, data?.msg);
	// 			}
	// 		},
	// 		(err) => {
	// 			this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
	// 		}
	// 	);
	// 	this.spinner.hide();
	// }

	// them phu luc
	addBieuMau() {
		this.phuLucs.forEach(item => item.status = false);
		const danhSach = this.phuLucs.filter(item => this.lstLapThamDinhs.findIndex(e => e.maBieuMau == item.id) == -1);

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

	xemChiTiet(id: string) {
		const url = MAIN_ROUTE_KE_HOACH + '/' + MAIN_ROUTE_DU_TOAN + '/' + LAP_THAM_DINH + '/bao-cao/' + id;
		window.open(url, '_blank');
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

	newTab(id: string): void {
		const index: number = this.tabs.findIndex(e => e.id === id);
		if (index != -1) {
			this.selectedIndex = index + 1;
		} else {
			const item = this.lstLapThamDinhs.find(e => e.maBieuMau == id);
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
		const index = this.lstLapThamDinhs.findIndex(e => e.maBieuMau == this.tabs[0].id);
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
			this.router.navigate([
				MAIN_ROUTE_KE_HOACH + '/' + MAIN_ROUTE_DU_TOAN + '/' + LAP_THAM_DINH + '/tim-kiem'
			]);
		} else {
			if (this.loai == "1") {
				this.router.navigate([
					MAIN_ROUTE_KE_HOACH + '/' + MAIN_ROUTE_DU_TOAN + '/' + LAP_THAM_DINH + '/tong-hop'
				]);
			} else {
				this.location.back();
			}
		}
	}

	xemSoKiemTra() {
		if (this.userService.isTongCuc()) {
			this.router.navigate([
				MAIN_ROUTE_KE_HOACH + '/' + MAIN_ROUTE_DU_TOAN + '/' + LAP_THAM_DINH + '/so-kiem-tra-tran-chi-tu-btc/' + this.giaoSoTranChiId
			]);
		} else {
			this.router.navigate([
				MAIN_ROUTE_KE_HOACH + '/' + MAIN_ROUTE_DU_TOAN + '/' + LAP_THAM_DINH + '/so-kiem-tra-chi-nsnn/' + this.giaoSoTranChiId
			]);
		}
	}

	showDialogCopy() {
		const obj = {
			namBcao: this.namHienHanh,
		}
		const modalTuChoi = this.modal.create({
			nzTitle: 'Copy Báo Cáo',
			nzContent: DialogDoCopyComponent,
			nzMaskClosable: false,
			nzClosable: false,
			nzWidth: '900px',
			nzFooter: null,
			nzComponentParams: {
				obj
			},
		});
		modalTuChoi.afterClose.toPromise().then(async (res) => {
			if (res) {
				this.doCopy(res);
			}
		});
	}

	async doCopy(response: any) {
		let maBcaoNew: string;
		await this.quanLyVonPhiService.sinhMaBaoCao().toPromise().then(
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
		const lstLapThamDinhTemps: any[] = [];
		this.lstLapThamDinhs.forEach(data => {
			const lstCtietTemp: any[] = [];
			data.lstCtietLapThamDinhs.forEach(item => {
				lstCtietTemp.push({
					...item,
					id: null,
				})
			})
			lstLapThamDinhTemps.push({
				...data,
				nguoiBcao: this.userInfo?.username,
				lstCtietLapThamDinhs: lstCtietTemp,
				id: null,
			})
		})
		const request = {
			id: null,
			fileDinhKems: [],
			listIdDeleteFiles: [],                      // id file luc get chi tiet tra ra( de backend phuc vu xoa file)
			lstLapThamDinhs: lstLapThamDinhTemps,
			maBcao: maBcaoNew,
			maDvi: this.maDviTao,
			namBcao: response?.namBcao,
			namHienHanh: response?.namBcao,
			congVan: null,
			tongHopTuIds: [],
		};
		this.spinner.show();
		this.quanLyVonPhiService.trinhDuyetService(request).toPromise().then(
			async data => {
				if (data.statusCode == 0) {
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
		this.spinner.hide();
	}
}
