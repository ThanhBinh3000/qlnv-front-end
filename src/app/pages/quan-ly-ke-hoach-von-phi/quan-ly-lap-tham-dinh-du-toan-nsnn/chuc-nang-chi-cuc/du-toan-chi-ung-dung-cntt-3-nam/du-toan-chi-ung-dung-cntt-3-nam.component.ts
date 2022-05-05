import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as uuid from "uuid";
import { DanhMucHDVService } from '../../../../../services/danhMucHDV.service';
import { DatePipe, Location } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { DomSanitizer } from '@angular/platform-browser';
import * as fileSaver from 'file-saver';
import { divMoney, DONVITIEN, MONEYLIMIT, mulMoney, QLNV_KHVONPHI_CHI_UDUNG_CNTT_GD3N, Utils } from "../../../../../Utility/utils";
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MESSAGE } from '../../../../../constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { NzModalService } from 'ng-zorro-antd/modal';
import { DialogCopyComponent } from 'src/app/components/dialog/dialog-copy/dialog-copy.component';

export class ItemData {
	id!: any;
	maBcao!: string;
	maDvi!: string;
	stt!: string;
	loaiKhoach!: string;
	loaiDan!: string;
	tongDtoanSl!: number;
	tongDtoanGtri!: number;
	thienNamTruoc!: number;
	cbDtuN!: number;
	thDtuN!: number;
	cbDtuN1!: number;
	thDtuN1!: number;
	cbDtuN2!: number;
	thDtuN2!: number;
	cbDtuN3!: number;
	thDtuN3!: number;
	ghiChu!: string;
	ndung!: string;
	checked!: boolean;
}

@Component({
	selector: 'app-du-toan-chi-ung-dung-cntt-3-nam',
	templateUrl: './du-toan-chi-ung-dung-cntt-3-nam.component.html',
	styleUrls: ['./du-toan-chi-ung-dung-cntt-3-nam.component.scss'],
})

export class DuToanChiUngDungCntt3NamComponent implements OnInit {
	listMaDonvi!: any;
	userInfo: any;
	errorMessage!: String;
	noiDungs!: any;
	loaiKhoachs: any = [];
	loaiDans: any = [];
	donVis: any = [];
	cucKhuVucs: any = [];
	donViTiens: any = DONVITIEN; // danh muc don vi tien
	listBaoCao: ItemData[] = [];
	lstCTietBCao: ItemData[] = [];
	tong: ItemData = {
		id: null,
		maBcao: null,
		maDvi: null,
		stt: null,
		loaiKhoach: null,
		loaiDan: null,
		tongDtoanSl: 0,
		tongDtoanGtri: 0,
		thienNamTruoc: 0,
		cbDtuN: 0,
		thDtuN: 0,
		cbDtuN1: 0,
		thDtuN1: 0,
		cbDtuN2: 0,
		thDtuN2: 0,
		cbDtuN3: 0,
		thDtuN3: 0,
		ghiChu: null,
		ndung: null,
		checked: false,
	}
	id!: any;
	chiTietBcaos: any;
	lstFile: any = [];
	status: boolean = false;
	namBcao = new Date().getFullYear()
	userData!: any;
	role!: any;
	unit!: any;
	userName: any;
	ngayNhap!: any;
	nguoiNhap!: string;
	maDonViTao!: any;
	maBaoCao!: string;
	namBaoCaoHienHanh!: any;
	trangThaiBanGhi: string = "1";
	maLoaiBaoCao: string = QLNV_KHVONPHI_CHI_UDUNG_CNTT_GD3N;
	maDviTien: string;
	newDate = new Date();
	fileToUpload!: File;
	listFile: File[] = [];
	box1 = true;
	fileUrl: any;
	namBaoCao!: any;
	listId: string = "";
	listIdDelete: string = ""; // list id delete

	capDvi: any;
	checkKV: boolean; // check khu vuc
	soVban: any;
	capDv: any;
	checkDv: boolean;
	statusDvi: boolean;
	currentday: Date = new Date();


	currentFile?: File;
	progress = 0;
	message = '';
	fileName = 'Select File';


	statusBtnDel: boolean; // trang thai an/hien nut xoa
	statusBtnSave: boolean; // trang thai an/hien nut luu
	statusBtnApprove: boolean; // trang thai an/hien nut trinh duyet
	statusBtnTBP: boolean; // trang thai an/hien nut truong bo phan
	statusBtnLD: boolean; // trang thai an/hien nut lanh dao
	statusBtnGuiDVCT: boolean; // trang thai nut gui don vi cap tren
	statusBtnDVCT: boolean; // trang thai nut don vi cap tren
	statusBtnLDDC: boolean;
	statusBtnCopy: boolean;                      // trang thai copy
	statusBtnPrint: boolean;                     // trang thai print

	listIdDeleteFiles: string = ""; // id file luc call chi tiet


	allChecked = false; // check all checkbox
	indeterminate = true; // properties allCheckBox
	editCache: {
		[key: string]: { edit: boolean; data: ItemData }
	} = {}; // phuc vu nut chinh

	fileList: NzUploadFile[] = [];



	beforeUpload = (file: NzUploadFile): boolean => {
		this.fileList = this.fileList.concat(file);
		return false;
	};

	// upload file
	addFile() {
		const id = this.fileToUpload?.lastModified.toString();
		this.lstFile.push({ id: id, fileName: this.fileToUpload?.name });
		this.listFile.push(this.fileToUpload);
	}

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
		private userService: UserService,
		private notification: NzNotificationService,
		private danhMucService: DanhMucHDVService,
		private location: Location,
		private modal: NzModalService,
	) {
		this.ngayNhap = this.datePipe.transform(this.newDate, Utils.FORMAT_DATE_STR,)
	}


	async ngOnInit() {
		this.id = this.routerActive.snapshot.paramMap.get('id');
		this.maDonViTao = this.routerActive.snapshot.paramMap.get('maDvi');
		this.maLoaiBaoCao = this.routerActive.snapshot.paramMap.get('maLoaiBacao');
		this.namBaoCaoHienHanh = this.routerActive.snapshot.paramMap.get('nam');
		let userName = this.userService.getUserName();
		await this.getUserInfo(userName); //get user info
		if (this.id) {
			await this.getDetailReport();
		} else if (
			this.maDonViTao != null &&
			this.maLoaiBaoCao != null &&
			this.namBaoCaoHienHanh != null
		) {
			await this.calltonghop();
			this.nguoiNhap = this.userInfo?.username;
			this.ngayNhap = this.datePipe.transform(this.currentday, Utils.FORMAT_DATE_STR);
			this.maDonViTao = this.userInfo?.dvql;
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
			this.namBaoCaoHienHanh = new Date().getFullYear();
		} else {
			this.trangThaiBanGhi = "1";
			this.nguoiNhap = this.userInfo?.username;
			this.maDonViTao = this.userInfo?.dvql;
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
			this.namBaoCaoHienHanh = new Date().getFullYear();
		}


		//get danh muc noi dung
		this.danhMucService.dMNoiDung().toPromise().then(
			(data) => {
				if (data.statusCode == 0) {
					this.noiDungs = data.data?.content;
				} else {
					this.notification.error(MESSAGE.ERROR, data?.msg);
				}
			},
			(err) => {
				this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
			}
		);

		//get danh muc nhom chi
		this.danhMucService.dMLoaiKeHoach().toPromise().then(
			(data) => {
				if (data.statusCode == 0) {
					this.loaiKhoachs = data.data?.content;
				} else {
					this.notification.error(MESSAGE.ERROR, data?.msg);
				}
			},
			(err) => {
				this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
			}
		);

		//get danh muc loai chi
		this.danhMucService.dMLoaiDan().toPromise().then(
			(data) => {
				if (data.statusCode == 0) {
					this.loaiDans = data.data?.content;
				} else {
					this.notification.error(MESSAGE.ERROR, data?.msg);
				}
			},
			(err) => {
				this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
			}
		);

		//lay danh sach danh muc don vi
		await this.danhMucService.dMDonVi().toPromise().then(
			(data) => {
				if (data.statusCode == 0) {
					this.donVis = data.data;
					this.donVis.forEach(e => {
						if (e.maDvi == this.maDonViTao) {
							this.capDvi = e.capDvi;
						}
					})
					// xac dinh cap tong cuc
					if (this.capDvi == '1') {
						this.statusDvi = false;
					} else {
						this.statusDvi = true;
					}
					//lay danh muc cuc khu vuc
					this.cucKhuVucs = this.donVis.filter(item => item.capDvi === '2');

					var Dvi = this.donVis.find(e => e.maDvi == this.maDonViTao);
					this.capDv = Dvi.capDvi;
					if (this.capDv == '2') {
						this.checkDv = false;
					} else {
						this.checkDv = true;
					}
				} else {
					this.errorMessage = "Có lỗi trong quá trình vấn tin!";
				}
			},
			(err) => {
				this.errorMessage = "err.error.message";
			}
		);

		this.callListMaDonVi();

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
		this.statusBtnLDDC = utils.getRoleLDDC(this.trangThaiBanGhi, checkChirld, this.userInfo?.roles[0]?.id);
		this.statusBtnCopy = utils.getRoleCopy(this.trangThaiBanGhi, checkChirld, this.userInfo?.roles[0]?.id);
		this.statusBtnPrint = utils.getRolePrint(this.trangThaiBanGhi, checkChirld, this.userInfo?.roles[0]?.id);
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

	// luu
	async save() {
		let checkSaveEdit;
		if (!this.maDviTien || !this.namBaoCaoHienHanh) {
			this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTSAVE);
			return;
		}
		if (this.namBaoCaoHienHanh >= 3000 || this.namBaoCaoHienHanh < 1000) {
			this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.WRONG_FORMAT);
			return;
		}
		//check xem tat ca cac dong du lieu da luu chua?
		//chua luu thi bao loi, luu roi thi cho di
		this.lstCTietBCao.filter(element => {
			if (this.editCache[element.id].edit === true) {
				checkSaveEdit = false
			}
		});
		if (checkSaveEdit == false) {
			this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTSAVE);
			return;
		}

		let listFile: any = [];
		for (const iterator of this.listFile) {
			listFile.push(await this.uploadFile(iterator));
		}

		// replace nhung ban ghi dc them moi id thanh null
		this.lstCTietBCao.filter(item => {
			if (typeof item.id != "number") {
				item.id = null;
			}
		})

		let lstCTietBCaoTemp = [];
		let checkMoneyRange = true;
		this.lstCTietBCao.filter(element => {
			let tongDtoanGtri = mulMoney(element.tongDtoanGtri, this.maDviTien);
			let cbDtuN = mulMoney(element.cbDtuN, this.maDviTien);
			let thienNamTruoc = mulMoney(element.thienNamTruoc, this.maDviTien);
			let thDtuN = mulMoney(element.thDtuN, this.maDviTien);
			let cbDtuN1 = mulMoney(element.cbDtuN1, this.maDviTien);
			let thDtuN1 = mulMoney(element.thDtuN1, this.maDviTien);
			let cbDtuN2 = mulMoney(element.cbDtuN2, this.maDviTien);
			let thDtuN2 = mulMoney(element.thDtuN2, this.maDviTien);
			let cbDtuN3 = mulMoney(element.cbDtuN3, this.maDviTien);
			let thDtuN3 = mulMoney(element.thDtuN3, this.maDviTien);
			debugger
			if (tongDtoanGtri > MONEYLIMIT || cbDtuN > MONEYLIMIT || thienNamTruoc > MONEYLIMIT ||
				thDtuN > MONEYLIMIT || cbDtuN1 > MONEYLIMIT || thDtuN1 > MONEYLIMIT ||
				cbDtuN2 > MONEYLIMIT || thDtuN2 > MONEYLIMIT || cbDtuN3 > MONEYLIMIT || thDtuN3 > MONEYLIMIT) {
				checkMoneyRange = false;
				return;
			}
			lstCTietBCaoTemp.push({
				...element,
				tongDtoanGtri: tongDtoanGtri,
				cbDtuN: cbDtuN,
				thienNamTruoc: thienNamTruoc,
				thDtuN: thDtuN,
				cbDtuN1: cbDtuN1,
				thDtuN1: thDtuN1,
				cbDtuN2: cbDtuN2,
				thDtuN2: thDtuN2,
				cbDtuN3: cbDtuN3,
				thDtuN3: thDtuN3,
			})
		});
		if (!checkMoneyRange == true) {
			this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.MONEYRANGE);
			return;
		}

		// gui du lieu trinh duyet len server
		let request = {
			id: this.id,
			fileDinhKems: listFile,
			listIdDeletes: this.listIdDelete,
			listIdDeleteFiles: this.listIdDeleteFiles,
			lstCTietBCao: lstCTietBCaoTemp,
			maBcao: this.maBaoCao,
			maDvi: this.maDonViTao,
			maDviTien: this.maDviTien,
			maLoaiBcao: this.maLoaiBaoCao = QLNV_KHVONPHI_CHI_UDUNG_CNTT_GD3N,
			namBcao: this.namBaoCaoHienHanh + 1,
			namHienHanh: this.namBaoCaoHienHanh,
		};
		this.spinner.show();
		if (this.id == null) {
			this.quanLyVonPhiService.trinhDuyetService(request).toPromise().then(
				async data => {
					if (data.statusCode == 0) {
						this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
						this.id = data.data.id;
						await this.getDetailReport();
						this.getStatusButton();
					} else {
						this.notification.error(MESSAGE.ERROR, data?.msg);
					}
				},
				err => {
					this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
				},
			);
		} else {
			this.quanLyVonPhiService.updatelist(request).toPromise().then(
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
				item.id = uuid.v4();
			}
		});
		this.updateEditCache();
		this.spinner.hide();
	}

	// chuc nang check role
	async onSubmit(mcn: String) {
		if (this.id) {
			const requestGroupButtons = {
				id: this.id,
				maChucNang: mcn,
				type: "",
			};
			this.spinner.show();
			this.quanLyVonPhiService.approve(requestGroupButtons).toPromise().then(async (data) => {
				if (data.statusCode == 0) {
					await this.getDetailReport();
					this.getStatusButton();
					this.notification.success(MESSAGE.SUCCESS, MESSAGE.APPROVE_SUCCESS);
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

	//thay doi trang thai
	changeStatus(status: boolean) {
		this.status = status;
	}

	// call chi tiet bao cao
	async getDetailReport() {
		this.spinner.show();
		await this.quanLyVonPhiService.bCLapThamDinhDuToanChiTiet(this.id).toPromise().then(
			(data) => {
				if (data.statusCode == 0) {
					this.tinhTong(-1, this.tong);
					this.chiTietBcaos = data.data;
					this.lstCTietBCao = data.data.lstCTietBCao;
					this.maDviTien = data.data.maDviTien;
					this.divMoneyTotal();
					this.lstCTietBCao.forEach(item => {
						this.tinhTong(1, item);
					})
					this.updateEditCache();
					this.lstFile = data.data.lstFile;
					this.listFile = [];

					// set thong tin chung bao cao
					this.ngayNhap = this.datePipe.transform(data.data.ngayTao, Utils.FORMAT_DATE_STR);
					this.nguoiNhap = data.data.nguoiTao;
					this.maDonViTao = data.data.maDvi;
					this.maBaoCao = data.data.maBcao;
					this.namBaoCaoHienHanh = data.data.namHienHanh;
					this.trangThaiBanGhi = data.data.trangThai;
					if (
						this.trangThaiBanGhi == Utils.TT_BC_1 ||
						this.trangThaiBanGhi == Utils.TT_BC_3 ||
						this.trangThaiBanGhi == Utils.TT_BC_5 ||
						this.trangThaiBanGhi == Utils.TT_BC_8 ||
						this.trangThaiBanGhi == Utils.TT_BC_10
					) {
						this.status = false;
					} else {
						this.status = true;
					}

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

	//upload file
	async uploadFile(file: File) {
		// day file len server
		const upfile: FormData = new FormData();
		upfile.append('file', file);
		upfile.append('folder', this.maBaoCao + '/' + this.maDonViTao);
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

	// them dong moi
	addLine(id: number): void {
		let item: ItemData = {
			loaiKhoach: "",
			maDvi: this.maDonViTao,
			loaiDan: "",
			tongDtoanSl: 0,
			tongDtoanGtri: 0,
			thienNamTruoc: 0,
			cbDtuN: 0,
			thDtuN: 0,
			cbDtuN1: 0,
			thDtuN1: 0,
			cbDtuN2: 0,
			thDtuN2: 0,
			cbDtuN3: 0,
			thDtuN3: 0,
			ghiChu: "",
			ndung: "",
			maBcao: "",
			stt: "",
			id: uuid.v4(),
			checked: false,
		}

		this.lstCTietBCao.splice(id, 0, item);
		this.editCache[item.id] = {
			edit: true,
			data: { ...item }
		};
	}

	// xoa dong
	deleteById(id: any): void {
		var index: number = this.lstCTietBCao.findIndex(e => e.id === id);
		this.tinhTong(-1, this.lstCTietBCao[index]);
		this.lstCTietBCao = this.lstCTietBCao.filter(item => item.id != id)
		if (typeof id == "number") {
			this.listIdDelete += id + ",";
		}
	}

	// xóa với checkbox
	deleteSelected() {
		// add list delete id
		this.lstCTietBCao.filter(item => {
			if (item.checked) {
				this.tinhTong(-1, item);
			}
			if (item.checked == true && typeof item.id == "number") {
				this.listIdDelete += item.id + ","
			}
		})
		// delete object have checked = true
		this.lstCTietBCao = this.lstCTietBCao.filter(item => item.checked != true)
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

	// click o checkbox all
	updateAllChecked(): void {
		this.indeterminate = false; // thuoc tinh su kien o checkbox all
		if (this.allChecked) { // checkboxall == true thi set lai lstCTietBCao.checked = true
			this.lstCTietBCao = this.lstCTietBCao.map(item => ({
				...item,
				checked: true
			}));
		} else {
			this.lstCTietBCao = this.lstCTietBCao.map(item => ({ // checkboxall == false thi set lai lstCTietBCao.checked = false
				...item,
				checked: false
			}));
		}
	}

	// click o checkbox single
	updateSingleChecked(): void {
		if (this.lstCTietBCao.every(item => !item.checked)) { // tat ca o checkbox deu = false thi set o checkbox all = false
			this.allChecked = false;
			this.indeterminate = false;
		} else if (this.lstCTietBCao.every(item => item.checked)) { // tat ca o checkbox deu = true thi set o checkbox all = true
			this.allChecked = true;
			this.indeterminate = false;
		} else { // o checkbox vua = false, vua = true thi set o checkbox all = indeterminate
			this.indeterminate = true;
		}
	}

	redirectChiTieuKeHoachNam() {
		// this.router.navigate(['/qlkh-von-phi/quan-ly-lap-tham-dinh-du-toan-nsnn/tim-kiem']);
		this.location.back()
	}

	// lay ten trang thai
	getStatusName() {
		const utils = new Utils();
		return utils.getStatusName(this.trangThaiBanGhi);
	}

	// lay ten don vi tao
	getUnitName() {
		return this.donVis.find(item => item.maDvi == this.maDonViTao)?.tenDvi;
	}

	// start edit
	startEdit(id: string): void {
		this.editCache[id].edit = true;
	}

	// huy thay doi
	cancelEdit(id: string): void {
		const index = this.lstCTietBCao.findIndex(item => item.id === id); // lay vi tri hang minh sua
		if (!this.lstCTietBCao[index].ndung) {
			this.deleteById(id);
			return;
		}
		this.editCache[id] = {
			data: { ...this.lstCTietBCao[index] },
			edit: false
		};
	}

	// luu thay doi
	saveEdit(id: string): void {
		if (!this.editCache[id].data.ndung ||
			!this.editCache[id].data.loaiKhoach ||
			!this.editCache[id].data.loaiDan ||
			(!this.editCache[id].data.tongDtoanGtri && this.editCache[id].data.tongDtoanGtri !== 0)) {
			this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
			return;
		}
		this.editCache[id].data.checked = this.lstCTietBCao.find(item => item.id === id).checked; // set checked editCache = checked lstCTietBCao
		const index = this.lstCTietBCao.findIndex(item => item.id === id); // lay vi tri hang minh sua
		this.tinhTong(-1, this.lstCTietBCao[index]);
		Object.assign(this.lstCTietBCao[index], this.editCache[id].data); // set lai data cua lstCTietBCao[index] = this.editCache[id].data
		this.editCache[id].edit = false; // CHUYEN VE DANG TEXT
		this.tinhTong(1, this.lstCTietBCao[index]);
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

	tinhTong(heSo: number, item: ItemData) {
		this.tong.tongDtoanSl += heSo * item.tongDtoanSl;
		this.tong.tongDtoanGtri += heSo * item.tongDtoanGtri;
		this.tong.thienNamTruoc += heSo * item.thienNamTruoc;
		this.tong.cbDtuN += heSo * item.cbDtuN;
		this.tong.thDtuN += heSo * item.thDtuN;
		this.tong.cbDtuN1 += heSo * item.cbDtuN1;
		this.tong.thDtuN1 += heSo * item.thDtuN1;
		this.tong.cbDtuN2 += heSo * item.cbDtuN2;
		this.tong.thDtuN2 += heSo * item.thDtuN2;
		this.tong.cbDtuN3 += heSo * item.cbDtuN3;
		this.tong.thDtuN3 += heSo * item.thDtuN3;
	}

	callListMaDonVi() {
		this.danhMucService.dMDonVi().toPromise().then(res => {
			this.listMaDonvi = res.data;
		});
	}

	async calltonghop() {
		this.spinner.show();
		this.maDviTien = "1";
		let objtonghop = {
			maDvi: this.maDonViTao,
			maLoaiBcao: this.maLoaiBaoCao,
			namHienTai: this.namBaoCaoHienHanh,
		}
		await this.quanLyVonPhiService.tongHop(objtonghop).toPromise().then(res => {
			if (res.statusCode == 0) {
				this.lstCTietBCao = res.data;
				this.lstCTietBCao.forEach(e => {
					e.id = uuid.v4();
				})
				this.lstCTietBCao.forEach(item => {
					this.tinhTong(1, item);
				})
			} else {
				this.notification.error(MESSAGE.ERROR, res?.msg);
			}
		}, err => {
			this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
		});
		this.updateEditCache()
		this.spinner.hide();
	}

	xoaBaoCao() {
		if (this.id) {
			this.quanLyVonPhiService.xoaBaoCaoLapThamDinh(this.id).toPromise().then(async res => {
				if (res.statusCode == 0) {
					this.notification.success(MESSAGE.SUCCESS, MESSAGE.DELETE_SUCCESS);
					this.location.back();
				} else {
					this.notification.error(MESSAGE.ERROR, res?.msg);
				}
			}, err => {
				this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
			})
		} else {
			this.notification.warning(MESSAGE.WARNING, MESSAGE.MESSAGE_DELETE_WARNING)
		}
	}

	divMoneyTotal() {
		this.lstCTietBCao.filter(element => {
			element.tongDtoanGtri = divMoney(element.tongDtoanGtri, this.maDviTien);
			element.cbDtuN = divMoney(element.cbDtuN, this.maDviTien);
			element.thienNamTruoc = divMoney(element.thienNamTruoc, this.maDviTien);
			element.thDtuN = divMoney(element.thDtuN, this.maDviTien);
			element.cbDtuN1 = divMoney(element.cbDtuN1, this.maDviTien);
			element.thDtuN1 = divMoney(element.thDtuN1, this.maDviTien);
			element.cbDtuN2 = divMoney(element.cbDtuN2, this.maDviTien);
			element.thDtuN2 = divMoney(element.thDtuN2, this.maDviTien);
			element.cbDtuN3 = divMoney(element.cbDtuN3, this.maDviTien);
			element.thDtuN3 = divMoney(element.thDtuN3, this.maDviTien);
		});
	}

	// action copy
	async doCopy() {
		this.spinner.show();

		let maBaoCao = await this.quanLyVonPhiService.sinhMaBaoCao().toPromise().then(
			(data) => {
				if (data.statusCode == 0) {
					return data.data;
				} else {
					this.notification.error(MESSAGE.ERROR, data?.msg);
					return null;
				}
			},
			(err) => {
				this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
				return null;
			}
		);
		this.spinner.hide();
		if (!maBaoCao) {
			return;
		}

		let lstCTietBCaoTemp = [];
		let checkMoneyRange = true;
		this.lstCTietBCao.filter(element => {
			let tongDtoanGtri = mulMoney(element.tongDtoanGtri, this.maDviTien);
			let cbDtuN = mulMoney(element.cbDtuN, this.maDviTien);
			let thienNamTruoc = mulMoney(element.thienNamTruoc, this.maDviTien);
			let thDtuN = mulMoney(element.thDtuN, this.maDviTien);
			let cbDtuN1 = mulMoney(element.cbDtuN1, this.maDviTien);
			let thDtuN1 = mulMoney(element.thDtuN1, this.maDviTien);
			let cbDtuN2 = mulMoney(element.cbDtuN2, this.maDviTien);
			let thDtuN2 = mulMoney(element.thDtuN2, this.maDviTien);
			let cbDtuN3 = mulMoney(element.cbDtuN3, this.maDviTien);
			let thDtuN3 = mulMoney(element.thDtuN3, this.maDviTien);
			debugger
			if (tongDtoanGtri > MONEYLIMIT || cbDtuN > MONEYLIMIT || thienNamTruoc > MONEYLIMIT ||
				thDtuN > MONEYLIMIT || cbDtuN1 > MONEYLIMIT || thDtuN1 > MONEYLIMIT ||
				cbDtuN2 > MONEYLIMIT || thDtuN2 > MONEYLIMIT || cbDtuN3 > MONEYLIMIT || thDtuN3 > MONEYLIMIT) {
				checkMoneyRange = false;
				return;
			}
			lstCTietBCaoTemp.push({
				...element,
				id: null,
				tongDtoanGtri: tongDtoanGtri,
				cbDtuN: cbDtuN,
				thienNamTruoc: thienNamTruoc,
				thDtuN: thDtuN,
				cbDtuN1: cbDtuN1,
				thDtuN1: thDtuN1,
				cbDtuN2: cbDtuN2,
				thDtuN2: thDtuN2,
				cbDtuN3: cbDtuN3,
				thDtuN3: thDtuN3,
			})
		});
		if (!checkMoneyRange == true) {
			this.notification.error(MESSAGE.ERROR, MESSAGEVALIDATE.MONEYRANGE);
			return;
		}

		let request = {
			id: null,
			listIdDeletes: null,
			fileDinhKems: null,
			listIdDeleteFiles: null,                      // id file luc get chi tiet tra ra( de backend phuc vu xoa file)
			lstCTietBCao: lstCTietBCaoTemp,
			maBcao: maBaoCao,
			maDvi: this.maDonViTao,
			maDviTien: this.maDviTien,
			maLoaiBcao: this.maLoaiBaoCao = QLNV_KHVONPHI_CHI_UDUNG_CNTT_GD3N,
			namHienHanh: this.namBaoCaoHienHanh,
			namBcao: this.namBaoCaoHienHanh + 1,
			soVban: null,
		};

		//call service them moi
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
							maBcao: maBaoCao
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
