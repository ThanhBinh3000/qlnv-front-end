import { DatePipe, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router, RoutesRecognized } from '@angular/router';
import * as fileSaver from 'file-saver';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import * as uuid from "uuid";
import { DanhMucHDVService } from '../../../../../services/danhMucHDV.service';
import { QLNV_KHVONPHI_CHI_TX_GD3N, Utils, divMoney, mulMoney, DONVITIEN, MONEYLIMIT } from "../../../../../Utility/utils";
import { MESSAGE } from '../../../../../constants/message';
import { MESSAGEVALIDATE } from '../../../../../constants/messageValidate';
import { filter, pairwise } from 'rxjs/operators';
import { NzModalService } from 'ng-zorro-antd/modal';
import { DialogCopyComponent } from 'src/app/components/dialog/dialog-copy/dialog-copy.component';


export class ItemData {
	namHhanhN!: number;
	tranChiDuocTbN1!: number;
	ncauChiCuaDviN1!: number;
	clechTranChiVsNcauN1: number;
	tranChiDuocTbN2!: number;
	ncauChiCuaDviN2!: number;
	clechTranChiVsNcauN2: number;
	tranChiDuocTbN3!: number;
	ncauChiCuaDviN3!: number;
	clechTranChiVsNcauN3: number;
	maNoiDung!: string;
	maNhomChi!: string;
	maLoaiChi!: string;
	id!: any;
	maBcao!: string;
	stt!: string;
	checked!: boolean;
}

@Component({
	selector: 'app-chi-thuong-xuyen-3-nam',
	templateUrl: './chi-thuong-xuyen-3-nam.component.html',
	styleUrls: ['./chi-thuong-xuyen-3-nam.component.scss'],
})

export class ChiThuongXuyen3NamComponent implements OnInit {
	userInfo: any;
	errorMessage!: String;                      //
	noiDungs: any = [];                         // danh muc noi dung
	nhomChis: any = [];                          // danh muc nhom chi
	loaiChis: any = [];                          // danh muc loai chi
	donVis: any = [];                            // danh muc don vi
	donViTiens: any = DONVITIEN;                        // danh muc don vi tien
	tong: ItemData = {
		namHhanhN: 0,
		tranChiDuocTbN1: 0,
		ncauChiCuaDviN1: 0,
		clechTranChiVsNcauN1: 0,
		tranChiDuocTbN2: 0,
		ncauChiCuaDviN2: 0,
		clechTranChiVsNcauN2: 0,
		tranChiDuocTbN3: 0,
		ncauChiCuaDviN3: 0,
		clechTranChiVsNcauN3: 0,
		maNoiDung: "",
		maNhomChi: "",
		maLoaiChi: "",
		id: '',
		maBcao: '',
		stt: '',
		checked: false,
	};
	lstCTietBCao: ItemData[] = [];              // list chi tiet bao cao
	id!: any;                                   // id truyen tu router
	lstFile: any = [];                          // list File de day vao api
	status: boolean = false;                    // trang thai an/ hien cua trang thai
	namBcao = new Date().getFullYear();         // nam bao cao
	userName: any;                              // ten nguoi dang nhap
	ngayNhap!: any;                             // ngay nhap
	nguoiNhap!: string;                         // nguoi nhap
	maDonViTao!: any;                           // ma don vi tao
	maBaoCao!: string;                          // ma bao cao
	namBaoCaoHienHanh!: any;                    // nam bao cao hien hanh
	trangThaiBanGhi: string = "1";              // trang thai cua ban ghi
	maLoaiBaoCao: string = QLNV_KHVONPHI_CHI_TX_GD3N;                // nam bao cao
	maDviTien: any;                             // ma don vi tien
	newDate = new Date();                       //
	fileToUpload!: File;                        // file tai o input
	listFile: File[] = [];                      // list file chua ten va id de hien tai o input
	box1 = true;                                // bien de an hien box1
	fileUrl: any;                               // url
	listIdDelete: string = "";                  // list id delete
	currentday: Date = new Date();

	statusBtnDel: boolean;                       // trang thai an/hien nut xoa
	statusBtnSave: boolean;                      // trang thai an/hien nut luu
	statusBtnApprove: boolean;                   // trang thai an/hien nut trinh duyet
	statusBtnTBP: boolean;                       // trang thai an/hien nut truong bo phan
	statusBtnLD: boolean;                        // trang thai an/hien nut lanh dao
	statusBtnGuiDVCT: boolean;                   // trang thai nut gui don vi cap tren
	statusBtnDVCT: boolean;                      // trang thai nut don vi cap tren
	statusBtnLDDC: boolean;                      // trang thai lanh dao dieu chinh
	statusBtnCopy: boolean;                      // trang thai copy
	statusBtnPrint: boolean;                     // trang thai print
	listIdDeleteFiles: string = "";                        // id file luc call chi tiet


	allChecked = false;                         // check all checkbox
	indeterminate = true;                       // properties allCheckBox
	editCache: { [key: string]: { edit: boolean; data: ItemData } } = {};     // phuc vu nut chinh

	fileList: NzUploadFile[] = [];
	soVban: any;
	capDv: any;
	checkDv: boolean;

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
		private danhMucService: DanhMucHDVService,
		private userService: UserService,
		private notification: NzNotificationService,
		private location: Location,
		private modal: NzModalService,
	) {
		this.ngayNhap = this.datePipe.transform(this.newDate, Utils.FORMAT_DATE_STR,)
	}

	currentUrl: string;
	previousUrl: string;
	async ngOnInit() {
		this.router.events
			.pipe(filter((evt: any) => evt instanceof RoutesRecognized), pairwise())
			.subscribe((events: RoutesRecognized[]) => {
				debugger
				this.currentUrl = events[0].urlAfterRedirects;
				this.previousUrl = events[1].urlAfterRedirects;
				console.log('previous url', events[0].urlAfterRedirects);
				console.log('current url', events[1].urlAfterRedirects);
			});
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
			await this.callSynthetic();
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

		// this.getStatusButton();
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
		this.danhMucService.dMNhomChi().toPromise().then(
			(data) => {
				if (data.statusCode == 0) {
					this.nhomChis = data.data?.content;
				} else {
					this.notification.error(MESSAGE.ERROR, data?.msg);
				}
			},
			(err) => {
				this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
			}
		);

		//get danh muc loai chi
		this.danhMucService.dMLoaiChi().toPromise().then(
			(data) => {
				if (data.statusCode == 0) {
					this.loaiChis = data.data?.content;
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
					let Dvi = this.donVis.find(e => e.maDvi == this.maDonViTao);
					this.capDv = Dvi.capDvi;
					if (this.capDv == '2') {
						this.checkDv = false;
					} else {
						this.checkDv = true;
					}
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

	// luu
	async save() {
		let checkSaveEdit;
		if (!this.maDviTien || !this.namBaoCaoHienHanh) {
			this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
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

		// this.mulMoneyTotal();

		//upload file
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
			let tranChiDuocTbN1 = mulMoney(element.tranChiDuocTbN1, this.maDviTien);
			let ncauChiCuaDviN1 = mulMoney(element.ncauChiCuaDviN1, this.maDviTien);
			let clechTranChiVsNcauN1 = mulMoney(element.clechTranChiVsNcauN1, this.maDviTien);
			let tranChiDuocTbN2 = mulMoney(element.tranChiDuocTbN2, this.maDviTien);
			let ncauChiCuaDviN2 = mulMoney(element.ncauChiCuaDviN2, this.maDviTien);
			let clechTranChiVsNcauN2 = mulMoney(element.clechTranChiVsNcauN2, this.maDviTien);
			let tranChiDuocTbN3 = mulMoney(element.tranChiDuocTbN3, this.maDviTien);
			let ncauChiCuaDviN3 = mulMoney(element.ncauChiCuaDviN3, this.maDviTien);
			let clechTranChiVsNcauN3 = mulMoney(element.clechTranChiVsNcauN3, this.maDviTien);
			debugger
			if (tranChiDuocTbN1 > MONEYLIMIT || ncauChiCuaDviN1 > MONEYLIMIT || clechTranChiVsNcauN1 > MONEYLIMIT ||
				tranChiDuocTbN2 > MONEYLIMIT || ncauChiCuaDviN2 > MONEYLIMIT || clechTranChiVsNcauN2 > MONEYLIMIT ||
				tranChiDuocTbN3 > MONEYLIMIT || ncauChiCuaDviN3 > MONEYLIMIT || clechTranChiVsNcauN3 > MONEYLIMIT) {
				checkMoneyRange = false;
				return;
			}
			lstCTietBCaoTemp.push({
				...element,
				tranChiDuocTbN1: tranChiDuocTbN1,
				ncauChiCuaDviN1: ncauChiCuaDviN1,
				clechTranChiVsNcauN1: clechTranChiVsNcauN1,
				tranChiDuocTbN2: tranChiDuocTbN2,
				ncauChiCuaDviN2: ncauChiCuaDviN2,
				clechTranChiVsNcauN2: clechTranChiVsNcauN2,
				tranChiDuocTbN3: tranChiDuocTbN3,
				ncauChiCuaDviN3: ncauChiCuaDviN3,
				clechTranChiVsNcauN3: clechTranChiVsNcauN3,
			})
		});
		if (!checkMoneyRange == true) {
			this.notification.error(MESSAGE.ERROR, MESSAGEVALIDATE.MONEYRANGE);
		} else {
			// gui du lieu trinh duyet len server
			let request = {
				id: this.id,
				listIdDeletes: this.listIdDelete,
				fileDinhKems: listFile,
				listIdDeleteFiles: this.listIdDeleteFiles,                      // id file luc get chi tiet tra ra( de backend phuc vu xoa file)
				lstCTietBCao: lstCTietBCaoTemp,
				maBcao: this.maBaoCao,
				maDvi: this.maDonViTao,
				maDviTien: this.maDviTien,
				maLoaiBcao: this.maLoaiBaoCao = QLNV_KHVONPHI_CHI_TX_GD3N,
				namHienHanh: this.namBaoCaoHienHanh,
				namBcao: this.namBaoCaoHienHanh + 1,
				soVban: this.soVban,
			};

			//call service them moi
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
					this.total(-1, this.tong);
					this.lstCTietBCao = data.data.lstCTietBCao;
					this.maDviTien = data.data.maDviTien;
					this.divMoneyTotal();
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
					this.soVban = data.data.soVban;

					if (this.trangThaiBanGhi == Utils.TT_BC_1 ||
						this.trangThaiBanGhi == Utils.TT_BC_3 ||
						this.trangThaiBanGhi == Utils.TT_BC_5 ||
						this.trangThaiBanGhi == Utils.TT_BC_8 ||
						this.trangThaiBanGhi == Utils.TT_BC_10) {
						this.status = false;
					} else {
						this.status = true;
					}
					this.lstCTietBCao.forEach(item => {
						this.total(1, item);
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
			namHhanhN!: 0,
			tranChiDuocTbN1!: 0,
			ncauChiCuaDviN1!: 0,
			clechTranChiVsNcauN1: 0,
			tranChiDuocTbN2!: 0,
			ncauChiCuaDviN2!: 0,
			clechTranChiVsNcauN2: 0,
			tranChiDuocTbN3!: 0,
			ncauChiCuaDviN3!: 0,
			clechTranChiVsNcauN3: 0,
			maNoiDung!: "",
			maNhomChi!: "",
			maLoaiChi!: "",
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
		var index: number = this.lstCTietBCao.findIndex(e => e.id == id);
		this.total(-1, this.lstCTietBCao[index]);
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
				this.total(-1, item);
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
		this.indeterminate = false;                               // thuoc tinh su kien o checkbox all
		if (this.allChecked) {                                    // checkboxall == true thi set lai lstCTietBCao.checked = true
			this.lstCTietBCao = this.lstCTietBCao.map(item => ({
				...item,
				checked: true
			}));
		} else {
			this.lstCTietBCao = this.lstCTietBCao.map(item => ({    // checkboxall == false thi set lai lstCTietBCao.checked = false
				...item,
				checked: false
			}));
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
		// this.router.navigate(['/qlkh-von-phi/quan-ly-lap-tham-dinh-du-toan-nsnn/tim-kiem']);
		this.location.back();

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
		const index = this.lstCTietBCao.findIndex(item => item.id === id);  // lay vi tri hang minh sua
		this.editCache[id] = {
			data: { ...this.lstCTietBCao[index] },
			edit: false
		};
	}

	// luu thay doi
	saveEdit(id: string): void {
		if (!this.editCache[id].data.maNoiDung || !this.editCache[id].data.maNhomChi || !this.editCache[id].data.maLoaiChi) {
			this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
		} else {
			this.editCache[id].data.checked = this.lstCTietBCao.find(item => item.id === id).checked; // set checked editCache = checked lstCTietBCao
			const index = this.lstCTietBCao.findIndex(item => item.id === id);   // lay vi tri hang minh sua
			this.total(-1, this.lstCTietBCao[index]);
			Object.assign(this.lstCTietBCao[index], this.editCache[id].data); // set lai data cua lstCTietBCao[index] = this.editCache[id].data
			this.editCache[id].edit = false;  // CHUYEN VE DANG TEXT
			this.total(1, this.lstCTietBCao[index]);
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

	//gia tri cac o input thay doi thi tinh toan lai
	changeModel(id: string): void {
		this.editCache[id].data.clechTranChiVsNcauN1 = Number(this.editCache[id].data.ncauChiCuaDviN1) - Number(this.editCache[id].data.tranChiDuocTbN1);
		this.editCache[id].data.clechTranChiVsNcauN2 = Number(this.editCache[id].data.ncauChiCuaDviN2) - Number(this.editCache[id].data.tranChiDuocTbN2);
		this.editCache[id].data.clechTranChiVsNcauN3 = Number(this.editCache[id].data.ncauChiCuaDviN3) - Number(this.editCache[id].data.tranChiDuocTbN3);
	}

	total(heSo: number, item: ItemData) {
		this.tong.namHhanhN += heSo * item.namHhanhN;
		this.tong.tranChiDuocTbN1 += heSo * item.tranChiDuocTbN1;
		this.tong.ncauChiCuaDviN1 += heSo * item.ncauChiCuaDviN1;
		this.tong.clechTranChiVsNcauN1 += heSo * item.clechTranChiVsNcauN1;
		this.tong.tranChiDuocTbN2 += heSo * item.tranChiDuocTbN2;
		this.tong.ncauChiCuaDviN2 += heSo * item.ncauChiCuaDviN2;
		this.tong.clechTranChiVsNcauN2 += heSo * item.clechTranChiVsNcauN2;
		this.tong.tranChiDuocTbN3 += heSo * item.tranChiDuocTbN3;
		this.tong.ncauChiCuaDviN3 += heSo * item.ncauChiCuaDviN3;
		this.tong.clechTranChiVsNcauN3 += heSo * item.clechTranChiVsNcauN3;
	}

	async callSynthetic() {
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
			} else {
				this.notification.error(MESSAGE.ERROR, res?.msg);
			}
		}, err => {
			this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
		});
		this.updateEditCache()
		this.spinner.hide();
	}

	deleteReport() {
		if (this.id) {
			this.quanLyVonPhiService.xoaBaoCao(this.id).toPromise().then(async res => {
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

		// replace nhung ban ghi dc them moi id thanh null
		let lstCTietBCaoTemp = [];
		let checkMoneyRange = true;
		this.lstCTietBCao.filter(element => {
			let tranChiDuocTbN1 = mulMoney(element.tranChiDuocTbN1, this.maDviTien);
			let ncauChiCuaDviN1 = mulMoney(element.ncauChiCuaDviN1, this.maDviTien);
			let clechTranChiVsNcauN1 = mulMoney(element.clechTranChiVsNcauN1, this.maDviTien);
			let tranChiDuocTbN2 = mulMoney(element.tranChiDuocTbN2, this.maDviTien);
			let ncauChiCuaDviN2 = mulMoney(element.ncauChiCuaDviN2, this.maDviTien);
			let clechTranChiVsNcauN2 = mulMoney(element.clechTranChiVsNcauN2, this.maDviTien);
			let tranChiDuocTbN3 = mulMoney(element.tranChiDuocTbN3, this.maDviTien);
			let ncauChiCuaDviN3 = mulMoney(element.ncauChiCuaDviN3, this.maDviTien);
			let clechTranChiVsNcauN3 = mulMoney(element.clechTranChiVsNcauN3, this.maDviTien);
			if (tranChiDuocTbN1 > MONEYLIMIT || ncauChiCuaDviN1 > MONEYLIMIT || clechTranChiVsNcauN1 > MONEYLIMIT ||
				tranChiDuocTbN2 > MONEYLIMIT || ncauChiCuaDviN2 > MONEYLIMIT || clechTranChiVsNcauN2 > MONEYLIMIT ||
				tranChiDuocTbN3 > MONEYLIMIT || ncauChiCuaDviN3 > MONEYLIMIT || clechTranChiVsNcauN3 > MONEYLIMIT) {
				checkMoneyRange = false;
				return;
			}
			lstCTietBCaoTemp.push({
				...element,
				tranChiDuocTbN1: tranChiDuocTbN1,
				ncauChiCuaDviN1: ncauChiCuaDviN1,
				clechTranChiVsNcauN1: clechTranChiVsNcauN1,
				tranChiDuocTbN2: tranChiDuocTbN2,
				ncauChiCuaDviN2: ncauChiCuaDviN2,
				clechTranChiVsNcauN2: clechTranChiVsNcauN2,
				tranChiDuocTbN3: tranChiDuocTbN3,
				ncauChiCuaDviN3: ncauChiCuaDviN3,
				clechTranChiVsNcauN3: clechTranChiVsNcauN3,
			})
		});
		if (!checkMoneyRange == true) {
			this.notification.error(MESSAGE.ERROR, MESSAGEVALIDATE.MONEYRANGE);
		} else {
			let request = {
				listIdDeletes: null,
				fileDinhKems: null,
				listIdDeleteFiles: null,                      // id file luc get chi tiet tra ra( de backend phuc vu xoa file)
				lstCTietBCao: lstCTietBCaoTemp,
				maBcao: maBaoCao,
				maDvi: this.maDonViTao,
				maDviTien: this.maDviTien,
				maLoaiBcao: this.maLoaiBaoCao = QLNV_KHVONPHI_CHI_TX_GD3N,
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
		}
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

	divMoneyTotal() {
		this.lstCTietBCao.filter(item => {
			item.tranChiDuocTbN1 = divMoney(item.tranChiDuocTbN1, this.maDviTien);
			item.ncauChiCuaDviN1 = divMoney(item.ncauChiCuaDviN1, this.maDviTien);
			item.clechTranChiVsNcauN1 = divMoney(item.clechTranChiVsNcauN1, this.maDviTien);
			item.tranChiDuocTbN2 = divMoney(item.tranChiDuocTbN2, this.maDviTien);
			item.ncauChiCuaDviN2 = divMoney(item.ncauChiCuaDviN2, this.maDviTien);
			item.clechTranChiVsNcauN2 = divMoney(item.clechTranChiVsNcauN2, this.maDviTien);
			item.tranChiDuocTbN3 = divMoney(item.tranChiDuocTbN3, this.maDviTien);
			item.ncauChiCuaDviN3 = divMoney(item.ncauChiCuaDviN3, this.maDviTien);
			item.clechTranChiVsNcauN3 = divMoney(item.clechTranChiVsNcauN3, this.maDviTien);
		})
	}
}
