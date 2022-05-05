import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as uuid from "uuid";
import { DanhMucHDVService } from '../../../../../services/danhMucHDV.service';
import { DatePipe, Location } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { DomSanitizer } from '@angular/platform-browser';
import * as fileSaver from 'file-saver';
import { QLNV_KHVONPHI_TC_DTOAN_PHI_XUAT_DTQG_VTRO_CTRO_HNAM, Utils } from "../../../../../Utility/utils";
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { C, L } from '@angular/cdk/keycodes';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MESSAGE } from '../../../../../constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';


export class superMiniData {
	vitri!: any;
	maVtuTbi!: string;
	sl!: number;
}

export class ItemData {
	maCucDtnnKvuc!: string;
	luongGao!: number;
	cphiXuatCoDmucGao!: number;
	cphiXuatChuaDmucGao!: number;
	thanhTienCoDmucGao!: number;
	thanhTienKhongDmucGao!: number;
	thanhTienCongGao!: number;
	luongThoc!: number;
	cphiXuatCoDmucThoc!: number;
	cphiXuatChuaDmucThoc!: number;
	thanhTienCoDmucThoc!: number;
	thanhTienKhongDmucThoc!: number;
	thanhTienCongThoc!: number;
	listCtiet!: superMiniData[];
	id!: any;
	stt!: String;
	checked!: boolean;
}

export class miniData {
	id!: any;
	stt!: number;
	checked!: boolean;
	maVtuTbi!: string;
	tong: number;
	cphiXuatCoDmuc!: number;
	cphiXuatChuaDmuc!: number;
	thanhTienCoDmuc!: number;
	thanhTienKhongDmuc!: number;
	thanhTienCong!: number;
}

@Component({
	selector: 'app-du-toan-phi-xuat-hang-dtqg-hang-nam-vtct',
	templateUrl: './du-toan-phi-xuat-hang-dtqg-hang-nam-vtct.component.html',
	styleUrls: ['./du-toan-phi-xuat-hang-dtqg-hang-nam-vtct.component.scss'],
})

export class DuToanPhiXuatHangDtqgHangNamVtctComponent implements OnInit {
	userInfo: any;
	maDvi: any;
	tong: ItemData = {
		maCucDtnnKvuc: "",
		luongGao: 0,
		cphiXuatCoDmucGao: 0,
		cphiXuatChuaDmucGao: 0,
		thanhTienCoDmucGao: 0,
		thanhTienKhongDmucGao: 0,
		thanhTienCongGao: 0,
		luongThoc: 0,
		cphiXuatCoDmucThoc: 0,
		cphiXuatChuaDmucThoc: 0,
		thanhTienCoDmucThoc: 0,
		thanhTienKhongDmucThoc: 0,
		thanhTienCongThoc: 0,
		listCtiet: [],
		id: "",
		stt: "",
		checked: false,
	};
	maLoaiBacao: string = QLNV_KHVONPHI_TC_DTOAN_PHI_XUAT_DTQG_VTRO_CTRO_HNAM;
	nam: any;
	errorMessage!: String;
	vatTus: any = [];
	donVis: any = [];                            // danh muc don vi
	cucKhuVucs: any = [];
	chiTietBcaos: any;                          // thong tin chi tiet bao cao
	lstVtu: miniData[] = [];
	lstCTietBCao: ItemData[] = [];              // list chi tiet bao cao
	//lstCTiet: miniData[] = [];
	id!: any;                                   // id truyen tu router
	lstFile: any = [];                          // list File de day vao api
	status: boolean = false;                    // trang thai an/ hien cua trang thai
	namBcao = new Date().getFullYear();         // nam bao cao
	userName: any;                              // ten nguoi dang nhap
	ngayNhap!: any;                             // ngay nhap
	nguoiNhap!: string;                         // nguoi nhap
	maDonViTao!: any;                           // ma don vi tao
	maBaoCao!: string;                          // ma bao cao
	namBaoCaoHienHanh: any = new Date().getFullYear();                    // nam bao cao hien hanh
	trangThaiBanGhi: string = "1";              // trang thai cua ban ghi
	maLoaiBaoCao: string = QLNV_KHVONPHI_TC_DTOAN_PHI_XUAT_DTQG_VTRO_CTRO_HNAM;                // nam bao cao
	maDviTien: string = "01";                   // ma don vi tien
	newDate = new Date();                       //
	fileToUpload!: File;                        // file tai o input
	listFile: File[] = [];                      // list file chua ten va id de hien tai o input
	box1 = true;                                // bien de an hien box1
	fileUrl: any;                               // url
	listIdDelete: string = "";                  // list id delete
	listIdDeleteVtus: string = "";

	statusBtnDel: boolean;                       // trang thai an/hien nut xoa
	statusBtnSave: boolean;                      // trang thai an/hien nut luu
	statusBtnApprove: boolean;                   // trang thai an/hien nut trinh duyet
	statusBtnTBP: boolean;                       // trang thai an/hien nut truong bo phan
	statusBtnLD: boolean;                        // trang thai an/hien nut lanh dao
	statusBtnGuiDVCT: boolean;                   // trang thai nut gui don vi cap tren
	statusBtnDVCT: boolean;                      // trang thai nut don vi cap tren
	statusBtnLDDC: boolean;
	statusBtnCopy: boolean;                      // trang thai copy
	statusBtnPrint: boolean;                     // trang thai print

	listIdDeleteFiles: string = "";                        // id file luc call chi tiet


	allChecked = false;                         // check all checkbox
	allChecked1 = false;
	indeterminate = true;                       // properties allCheckBox
	editCache: { [key: string]: { edit: boolean; data: ItemData } } = {};     // phuc vu nut chinh
	editCache1: { [key: string]: { edit: boolean; data: miniData } } = {};

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
		private location: Location
	) {
		this.ngayNhap = this.datePipe.transform(this.newDate, Utils.FORMAT_DATE_STR,)
	}


	async ngOnInit() {
		this.id = this.routerActive.snapshot.paramMap.get('id');
		this.maDvi = this.routerActive.snapshot.paramMap.get('maDvi');
		this.maLoaiBacao = this.routerActive.snapshot.paramMap.get('maLoaiBacao');
		this.nam = this.routerActive.snapshot.paramMap.get('nam');
		let userName = this.userService.getUserName();
		await this.getUserInfo(userName);

		if (this.id) {
			await this.getDetailReport();
		} else if (
			this.maDvi != null &&
			this.maLoaiBacao != null &&
			this.nam != null
		) {
			await this.calltonghop();
			this.nguoiNhap = this.userInfo?.username;
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
			this.namBcao = parseInt(this.namBaoCaoHienHanh, 10) + 1;
		}

		//get danh muc noi dung
		await this.danhMucService.dMVatTu().toPromise().then(
			(data) => {
				if (data.statusCode == 0) {
					this.vatTus = data.data?.content;
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
					this.cucKhuVucs = this.donVis.filter(item => item.capDvi === "2");
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

	// xoa
	xoa() {
		this.lstCTietBCao = [];
		this.lstFile = [];
		this.listFile = []
	}

	// luu
	async luu() {
		let checkSaveEdit;
		if (!this.namBaoCaoHienHanh) {
			this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTSAVE);
			return;
		}
		if (this.namBaoCaoHienHanh >= 3000 || this.namBaoCaoHienHanh < 1000) {
			this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.WRONG_FORMAT);
			return;
		}
		//check xem tat ca cac dong du lieu da luu chua?
		//chua luu thi bao loi, luu roi thi cho di
		this.lstCTietBCao.forEach(element => {
			if (this.editCache[element.id].edit === true) {
				checkSaveEdit = false
			}
		});
		this.lstVtu.forEach(item => {
			if (this.editCache1[item.id].edit === true) {
				checkSaveEdit = false;
			}
		})
		if (checkSaveEdit == false) {
			this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTSAVE);
			return;
		}

		let listFile: any = [];
		for (const iterator of this.listFile) {
			listFile.push(await this.uploadFile(iterator));
		}
		//gan lai id bang null
		this.lstVtu.forEach(item => {
			if (typeof item.id != 'number') {
				item.id = null;
			}
		})

		this.lstCTietBCao.forEach(item => {
			if (typeof item.id != 'number') {
				item.id = null;
			}
		})

		// gui du lieu trinh duyet len server
		let request = {
			id: this.id,
			fileDinhKems: listFile,
			listIdDeletes: this.listIdDelete,
			listDeleteVtus: this.listIdDeleteVtus,
			listIdDeleteFiles: this.listIdDeleteFiles,
			lstCTietBCao: this.lstCTietBCao,
			lstTongVtu: this.lstVtu,
			maBcao: this.maBaoCao,
			maDvi: this.maDonViTao,
			//maDviTien: this.maDviTien,
			maLoaiBcao: this.maLoaiBaoCao,
			namBcao: this.namBaoCaoHienHanh + 1,
			maDviTien: this.maDviTien,
			namHienHanh: this.namBaoCaoHienHanh,
		};

		this.spinner.show();
		if (this.id == null) {
			this.quanLyVonPhiService.trinhDuyetService(request).toPromise().then(
				async (data) => {
					if (data.statusCode == 0) {
						this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
						this.id = data.data.id;
						await this.getDetailReport();
						this.getStatusButton();
					} else {
						this.notification.error(MESSAGE.ERROR, data?.msg);
					}
				},
				(err) => {
					this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
				})
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
		this.lstVtu.forEach(item => {
			if (!item.id) {
				item.id = uuid.v4();
			}
		})
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
					// set thong tin chung bao cao
					this.ngayNhap = this.datePipe.transform(data.data.ngayTao, Utils.FORMAT_DATE_STR);
					this.nguoiNhap = data.data.nguoiTao;
					this.maDonViTao = data.data.maDvi;
					this.maBaoCao = data.data.maBcao;
					this.namBaoCaoHienHanh = data.data.namHienHanh;
					this.namBcao = data.data.namBcao
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
					this.lstCTietBCao = [];
					this.lstVtu = [];
					this.chiTietBcaos = data.data.lstCTietBCao;
					this.chiTietBcaos.forEach(item => {
						var mm: ItemData = {
							maCucDtnnKvuc: item.maCucDtnnKvuc,
							luongGao: item.luongGao,
							cphiXuatCoDmucGao: item.cphiXuatCoDmucGao,
							cphiXuatChuaDmucGao: item.cphiXuatChuaDmucGao,
							thanhTienCoDmucGao: item.thanhTienCoDmucGao,
							thanhTienKhongDmucGao: item.thanhTienKhongDmucGao,
							thanhTienCongGao: item.thanhTienCongGao,
							luongThoc: item.luongThoc,
							cphiXuatCoDmucThoc: item.cphiXuatCoDmucThoc,
							cphiXuatChuaDmucThoc: item.cphiXuatChuaDmucThoc,
							thanhTienCoDmucThoc: item.thanhTienCoDmucThoc,
							thanhTienKhongDmucThoc: item.thanhTienKhongDmucThoc,
							thanhTienCongThoc: item.thanhTienCongThoc,
							listCtiet: item.listCtiet,
							stt: item.stt,
							id: item.id,
							checked: false,
						}
						this.lstCTietBCao.push(mm);
					})

					this.lstFile = data.data.lstFile;
					this.listFile = [];

					var listVatTu: any = data.data.lstTongVtu;
					listVatTu.forEach(item => {
						var mm: miniData = {
							maVtuTbi: item.maVtuTbi,
							stt: item.stt,
							id: item.id,
							checked: false,
							tong: item.tong,
							cphiXuatCoDmuc: item.cphiXuatCoDmuc,
							cphiXuatChuaDmuc: item.cphiXuatChuaDmuc,
							thanhTienCoDmuc: item.thanhTienCoDmuc,
							thanhTienKhongDmuc: item.thanhTienKhongDmuc,
							thanhTienCong: item.thanhTienCong,
						}
						this.lstVtu.push(mm);
					})
					this.lstCTietBCao.forEach(data => {
						data.listCtiet.forEach(item => {
							item.vitri = this.lstVtu.find(e => e.maVtuTbi == item.maVtuTbi).id;
						})
					})

					this.lstCTietBCao.forEach(item => {
						this.tinhTong(1, item);
					})

					this.updateEditCache();
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
	// lay ten trang thai
	getStatusName() {
		const utils = new Utils();
		return utils.getStatusName(this.trangThaiBanGhi);
	}

	// lay ten don vi tao
	getUnitName() {
		return this.donVis.find(item => item.maDvi == this.maDonViTao)?.tenDvi;
	}

	redirectChiTieuKeHoachNam() {
		// this.router.navigate(['/qlkh-von-phi/quan-ly-lap-tham-dinh-du-toan-nsnn/tim-kiem']);
		this.location.back()
	}
	///////////////////////////////////////////////////////////////////////////////////////////////
	////////////////////// CONG VIEC CUA BANG CHINH //////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////
	// them dong moi
	addLine(id: number): void {
		var data: superMiniData[] = [];
		var data1: superMiniData[] = [];
		this.lstVtu.forEach(item => {
			var mini: superMiniData = {
				maVtuTbi: item.maVtuTbi,
				sl: 0,
				vitri: item.id,
			};
			var mini1: superMiniData = {
				maVtuTbi: item.maVtuTbi,
				sl: 0,
				vitri: item.id,
			}
			data.push(mini);
			data1.push(mini1);
		})
		let item: ItemData = {
			maCucDtnnKvuc: null,
			luongGao: 0,
			cphiXuatCoDmucGao: 0,
			cphiXuatChuaDmucGao: 0,
			thanhTienCoDmucGao: 0,
			thanhTienKhongDmucGao: 0,
			thanhTienCongGao: 0,
			luongThoc: 0,
			cphiXuatCoDmucThoc: 0,
			cphiXuatChuaDmucThoc: 0,
			thanhTienCoDmucThoc: 0,
			thanhTienKhongDmucThoc: 0,
			thanhTienCongThoc: 0,
			listCtiet: data,
			stt: "",
			id: uuid.v4(),
			checked: false,
		}

		let item1: ItemData = {
			maCucDtnnKvuc: "",
			luongGao: 0,
			cphiXuatCoDmucGao: 0,
			cphiXuatChuaDmucGao: 0,
			thanhTienCoDmucGao: 0,
			thanhTienKhongDmucGao: 0,
			thanhTienCongGao: 0,
			luongThoc: 0,
			cphiXuatCoDmucThoc: 0,
			cphiXuatChuaDmucThoc: 0,
			thanhTienCoDmucThoc: 0,
			thanhTienKhongDmucThoc: 0,
			thanhTienCongThoc: 0,
			listCtiet: data1,
			stt: "",
			id: item.id,
			checked: false,
		}

		this.lstCTietBCao.splice(id, 0, item);
		this.editCache[item.id] = {
			edit: true,
			data: { ...item1 }
		};
	}

	// xoa dong
	deleteById(id: any): void {
		var index = this.lstCTietBCao.findIndex(e => e.id === id);
		this.tinhTong(-1, this.lstCTietBCao[index]);
		this.lstCTietBCao = this.lstCTietBCao.filter(item => item.id != id);

		if (typeof id == "number") {
			this.listIdDelete += id + ",";
		}
		//can cap nhat lai lstCTiet
		this.tinhLaiTongSl();
	}

	// xóa với checkbox
	deleteSelected() {
		// add list delete id
		this.lstCTietBCao.forEach(item => {
			if (item.checked) {
				this.tinhTong(-1, item);
			}
			if (item.checked == true && typeof item.id == "number") {
				this.listIdDelete += item.id + ","
			}
		})
		// delete object have checked = true
		this.lstCTietBCao = this.lstCTietBCao.filter(item => item.checked != true);
		this.allChecked = false;
		// can cap nhat lai lstCTiet
		this.tinhLaiTongSl();
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

	// start edit
	startEdit(id: string): void {
		this.editCache[id].edit = true;
	}

	// huy thay doi
	cancelEdit(id: string): void {
		const index = this.lstCTietBCao.findIndex(item => item.id === id);  // lay vi tri hang minh sua
		if (!this.lstCTietBCao[index].maCucDtnnKvuc) {
			this.deleteById(id);
			return;
		}
		var item: ItemData = this.lstCTietBCao[index];
		this.editCache[id].data.maCucDtnnKvuc = item.maCucDtnnKvuc;
		this.editCache[id].data.luongGao = item.luongGao;
		this.editCache[id].data.cphiXuatCoDmucGao = item.cphiXuatCoDmucGao;
		this.editCache[id].data.cphiXuatChuaDmucGao = item.cphiXuatChuaDmucGao;
		this.editCache[id].data.thanhTienCoDmucGao = item.thanhTienCoDmucGao;
		this.editCache[id].data.thanhTienKhongDmucGao = item.thanhTienKhongDmucGao;
		this.editCache[id].data.thanhTienCongGao = item.thanhTienCongGao;
		this.editCache[id].data.luongThoc = item.luongThoc;
		this.editCache[id].data.cphiXuatCoDmucThoc = item.cphiXuatCoDmucThoc;
		this.editCache[id].data.cphiXuatChuaDmucThoc = item.cphiXuatChuaDmucThoc;
		this.editCache[id].data.thanhTienCoDmucThoc = item.thanhTienCoDmucThoc;
		this.editCache[id].data.thanhTienKhongDmucThoc = item.thanhTienKhongDmucThoc;
		this.editCache[id].data.thanhTienCongThoc = item.thanhTienCongThoc;
		this.editCache[id].data.stt = item.stt;
		this.editCache[id].data.id = item.id;
		this.editCache[id].data.checked = false;
		this.editCache[id].edit = false;
	}

	// luu thay doi
	saveEdit(id: string): void {
		if (!this.editCache[id].data.maCucDtnnKvuc) {
			this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
			return;
		}
		this.editCache[id].data.checked = this.lstCTietBCao.find(item => item.id === id).checked;  // set checked editCache = checked lstCTietBCao
		const index = this.lstCTietBCao.findIndex(item => item.id === id);
		this.tinhTong(-1, this.lstCTietBCao[index]);
		var item: ItemData = this.editCache[id].data;
		this.lstCTietBCao[index].maCucDtnnKvuc = item.maCucDtnnKvuc;
		this.lstCTietBCao[index].luongGao = item.luongGao;
		this.lstCTietBCao[index].cphiXuatCoDmucGao = item.cphiXuatCoDmucGao;
		this.lstCTietBCao[index].cphiXuatChuaDmucGao = item.cphiXuatChuaDmucGao;
		this.lstCTietBCao[index].thanhTienCoDmucGao = item.thanhTienCoDmucGao;
		this.lstCTietBCao[index].thanhTienKhongDmucGao = item.thanhTienKhongDmucGao;
		this.lstCTietBCao[index].thanhTienCongGao = item.thanhTienCongGao;
		this.lstCTietBCao[index].luongThoc = item.luongThoc;
		this.lstCTietBCao[index].cphiXuatCoDmucThoc = item.cphiXuatCoDmucThoc;
		this.lstCTietBCao[index].cphiXuatChuaDmucThoc = item.cphiXuatChuaDmucThoc;
		this.lstCTietBCao[index].thanhTienCoDmucThoc = item.thanhTienCoDmucThoc;
		this.lstCTietBCao[index].thanhTienKhongDmucThoc = item.thanhTienKhongDmucThoc;
		this.lstCTietBCao[index].thanhTienCongThoc = item.thanhTienCongThoc;
		this.lstCTietBCao[index].stt = item.stt;
		this.lstCTietBCao[index].id = item.id;
		this.lstCTietBCao[index].checked = false;
		this.editCache[id].edit = false;
		this.tinhTong(1, this.lstCTietBCao[index]);
	}

	// gan editCache.data == lstCTietBCao
	updateEditCache(): void {
		this.lstCTietBCao.forEach(data => {
			var mm: superMiniData[] = [];
			data.listCtiet.forEach(item => {
				var ss: superMiniData = {
					maVtuTbi: item.maVtuTbi,
					sl: item.sl,
					vitri: item.vitri,
				}
				mm.push(ss);
			})
			var zz: ItemData = {
				maCucDtnnKvuc: data.maCucDtnnKvuc,
				luongGao: data.luongGao,
				cphiXuatCoDmucGao: data.cphiXuatCoDmucGao,
				cphiXuatChuaDmucGao: data.cphiXuatChuaDmucGao,
				thanhTienCoDmucGao: data.thanhTienCoDmucGao,
				thanhTienKhongDmucGao: data.thanhTienKhongDmucGao,
				thanhTienCongGao: data.thanhTienCongGao,
				luongThoc: data.luongThoc,
				cphiXuatCoDmucThoc: data.cphiXuatCoDmucThoc,
				cphiXuatChuaDmucThoc: data.cphiXuatChuaDmucThoc,
				thanhTienCoDmucThoc: data.thanhTienCoDmucThoc,
				thanhTienKhongDmucThoc: data.thanhTienKhongDmucThoc,
				thanhTienCongThoc: data.thanhTienCongThoc,
				listCtiet: mm,
				stt: data.stt,
				id: data.id,
				checked: false,
			}
			this.editCache[data.id] = {
				edit: false,
				data: { ...zz }
			};
		});
		this.lstVtu.forEach(item => {
			this.editCache1[item.id] = {
				edit: false,
				data: { ...item }
			};
		});
	}

	changeModel(id: string): void {
		this.editCache[id].data.thanhTienCoDmucGao = Number((this.editCache[id].data.luongGao * this.editCache[id].data.cphiXuatCoDmucGao).toFixed(3));
		this.editCache[id].data.thanhTienKhongDmucGao = Number((this.editCache[id].data.luongGao * this.editCache[id].data.cphiXuatChuaDmucGao).toFixed(3));
		this.editCache[id].data.thanhTienCongGao = this.editCache[id].data.thanhTienCoDmucGao + this.editCache[id].data.thanhTienKhongDmucGao;
		this.editCache[id].data.thanhTienCoDmucThoc = Number((this.editCache[id].data.luongThoc * this.editCache[id].data.cphiXuatCoDmucThoc).toFixed(3));
		this.editCache[id].data.thanhTienKhongDmucThoc = Number((this.editCache[id].data.luongThoc * this.editCache[id].data.cphiXuatChuaDmucThoc).toFixed(3));
		this.editCache[id].data.thanhTienCongThoc = this.editCache[id].data.thanhTienCoDmucThoc + this.editCache[id].data.thanhTienKhongDmucThoc;
	}

	//////////////////////////////////////////////////////////////////////////////////////
	////////////////////// CONG VIEC CUA BANG PHU ////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////
	// them dong moi
	addLine1(id: number): void {
		var mm: string = uuid.v4();
		let item: miniData = {
			maVtuTbi: "",
			stt: 0,
			id: mm,
			checked: false,
			tong: 0,
			cphiXuatCoDmuc: 0,
			cphiXuatChuaDmuc: 0,
			thanhTienCoDmuc: 0,
			thanhTienKhongDmuc: 0,
			thanhTienCong: 0,
		}
		this.lstCTietBCao.forEach(data => {
			var mm: superMiniData = {
				maVtuTbi: item.maVtuTbi,
				sl: 0,
				vitri: item.id,
			}
			var mm1: superMiniData = {
				maVtuTbi: item.maVtuTbi,
				sl: 0,
				vitri: item.id,
			}
			data.listCtiet.splice(id, 0, mm);
			this.editCache[data.id].data.listCtiet.splice(id, 0, mm1);
		})
		this.lstVtu.splice(id, 0, item);
		this.editCache1[item.id] = {
			edit: true,
			data: { ...item }
		};

	}

	// xoa dong
	deleteById1(id: any): void {
		var ll: miniData = this.lstVtu.find(e => e.id === id);

		this.lstCTietBCao.forEach(item => {
			item.listCtiet = item.listCtiet.filter(e => e.vitri != id);
		})


		if (typeof id == 'number')
			this.listIdDeleteVtus += ll.maVtuTbi + ",";
		this.lstVtu = this.lstVtu.filter(item => item.id != id);
		//can cap nhat lai lstCTiet
		this.tinhLaiTongSl();
	}

	// xóa với checkbox
	deleteSelected1() {
		// add list delete id
		this.lstVtu.filter(item => {
			if (item.checked) {
				this.lstCTietBCao.forEach(data => {
					data.listCtiet = data.listCtiet.filter(e => e.vitri != item.id);
				});
			}
			if (item.checked == true && typeof item.id == "number") {
				this.listIdDeleteVtus += item.maVtuTbi + ",";
			}
		})

		// delete object have checked = true
		this.lstVtu = this.lstVtu.filter(item => item.checked != true)
		this.allChecked1 = false;
		// can cap nhat lai lstCTiet
		this.tinhLaiTongSl();
	}



	// click o checkbox all
	updateAllChecked1(): void {
		this.indeterminate = false;                               // thuoc tinh su kien o checkbox all
		if (this.allChecked1) {                                    // checkboxall == true thi set lai lstCTietBCao.checked = true
			this.lstVtu = this.lstVtu.map(item => ({
				...item,
				checked: true
			}));
		} else {
			this.lstVtu = this.lstVtu.map(item => ({    // checkboxall == false thi set lai lstCTietBCao.checked = false
				...item,
				checked: false
			}));
		}
	}

	// click o checkbox single
	updateSingleChecked1(): void {
		if (this.lstVtu.every(item => !item.checked)) {           // tat ca o checkbox deu = false thi set o checkbox all = false
			this.allChecked1 = false;
			this.indeterminate = false;
		} else if (this.lstVtu.every(item => item.checked)) {     // tat ca o checkbox deu = true thi set o checkbox all = true
			this.allChecked1 = true;
			this.indeterminate = false;
		} else {                                                        // o checkbox vua = false, vua = true thi set o checkbox all = indeterminate
			this.indeterminate = true;
		}
	}

	// start edit
	startEdit1(id: string): void {
		console.log(this.editCache1[id].data);

		this.editCache1[id].edit = true;
	}

	// huy thay doi
	cancelEdit1(id: string): void {
		if (!this.editCache1[id].data.maVtuTbi) {
			this.notification.error(MESSAGE.ERROR, MESSAGE.NULL_ERROR);
			return;
		}

		const index = this.lstVtu.findIndex(item => item.id === id);  // lay vi tri hang minh sua
		this.editCache1[id] = {
			data: { ...this.lstVtu[index] },
			edit: false
		};
		this.lstCTietBCao.forEach(item => {
			var ind: number = item.listCtiet.findIndex(e => e.maVtuTbi == this.lstVtu[index].maVtuTbi);
			this.editCache[item.id].data.listCtiet.forEach(data => {
				if (data.maVtuTbi == this.lstVtu[index].maVtuTbi) {
					data.sl = item.listCtiet[ind].sl;
				}
			})
		})
	}

	// luu thay doi
	saveEdit1(id: string): void {
		if (!this.editCache1[id].data.maVtuTbi ||
			(!this.editCache1[id].data.cphiXuatCoDmuc && this.editCache1[id].data.cphiXuatCoDmuc !== 0) ||
			(!this.editCache1[id].data.cphiXuatChuaDmuc && this.editCache1[id].data.cphiXuatChuaDmuc !== 0)) {
			this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
			return;
		}
		this.editCache1[id].data.checked = this.lstVtu.find(item => item.id === id).checked; // set checked editCache = checked lstCTietBCao
		const index = this.lstVtu.findIndex(item => item.id === id);   // lay vi tri hang minh sua
		Object.assign(this.lstVtu[index], this.editCache1[id].data);
		this.editCache1[id].edit = false;  // CHUYEN VE DANG TEXT
		//debugger
		this.lstCTietBCao.forEach(item => {
			var ind: number = item.listCtiet.findIndex(e => e.vitri == this.lstVtu[index].id);
			this.editCache[item.id].data.listCtiet.forEach(data => {
				if (data.vitri == this.lstVtu[index].id) {
					item.listCtiet[ind].maVtuTbi = this.lstVtu[index].maVtuTbi;
					item.listCtiet[ind].sl = data.sl;
				}
			})
		});
	}

	tinhLaiTongSl() {
		this.lstVtu.forEach(item => {
			item.tong = 0;
			this.lstCTietBCao.forEach(data => {
				data.listCtiet.forEach(e => {
					if (item.id == e.vitri) {
						item.tong += e.sl;
					}
				})
			})
			item.thanhTienCoDmuc = item.tong * item.cphiXuatCoDmuc;
			item.thanhTienKhongDmuc = item.tong * item.cphiXuatChuaDmuc;
			item.thanhTienCong = item.thanhTienCoDmuc + item.thanhTienKhongDmuc;
		})
	}

	tongSl(id: any) {
		var col: any = this.editCache1[id].data.id;
		this.editCache1[id].data.tong = 0;
		this.lstCTietBCao.forEach(item => {
			this.editCache[item.id].data.listCtiet.forEach(e => {
				if (e.vitri == col) {
					this.editCache1[id].data.tong += e.sl;
				}
			})
		})
		this.thanhTien(id);
	}

	thanhTien(id: any) {
		this.editCache1[id].data.thanhTienCoDmuc = Number((this.editCache1[id].data.tong * this.editCache1[id].data.cphiXuatCoDmuc).toFixed(Utils.ROUND));
		this.editCache1[id].data.thanhTienKhongDmuc = Number((this.editCache1[id].data.tong * this.editCache1[id].data.cphiXuatChuaDmuc).toFixed(Utils.ROUND));
		this.editCache1[id].data.thanhTienCong = this.editCache1[id].data.thanhTienCoDmuc + this.editCache1[id].data.thanhTienKhongDmuc;
	}

	tinhTong(heSo: number, item: ItemData) {
		this.tong.luongGao += heSo * item.luongGao;
		this.tong.cphiXuatCoDmucGao += heSo * item.cphiXuatCoDmucGao;
		this.tong.cphiXuatChuaDmucGao += heSo * item.cphiXuatChuaDmucGao;
		this.tong.thanhTienCoDmucGao += heSo * item.thanhTienCoDmucGao;
		this.tong.thanhTienKhongDmucGao += heSo * item.thanhTienKhongDmucGao;
		this.tong.thanhTienCongGao += heSo * item.thanhTienCongGao;
		this.tong.luongThoc += heSo * item.luongThoc;
		this.tong.cphiXuatCoDmucThoc += heSo * item.cphiXuatCoDmucThoc;
		this.tong.cphiXuatChuaDmucThoc += heSo * item.cphiXuatChuaDmucThoc;
		this.tong.thanhTienCoDmucThoc += heSo * item.thanhTienCoDmucThoc;
		this.tong.thanhTienKhongDmucThoc += heSo * item.thanhTienKhongDmucThoc;
		this.tong.thanhTienCongThoc += heSo * item.thanhTienCongThoc;
	}

	//call tong hop
	calltonghop() {
		this.spinner.show();
		let objtonghop = {
			maDvi: this.maDvi,
			maLoaiBcao: this.maLoaiBacao,
			namHienTai: this.nam,
		}
		this.quanLyVonPhiService.tongHop(objtonghop).toPromise().then(data => {
			if (data.statusCode == 0) {
				this.chiTietBcaos = data.data;
				this.lstCTietBCao = [];
				this.lstVtu = [];

				this.chiTietBcaos.forEach(item => {
					var mm: ItemData = {
						maCucDtnnKvuc: item.maCucDtnnKvuc,
						luongGao: item.luongGao,
						cphiXuatCoDmucGao: 0,
						cphiXuatChuaDmucGao: 0,
						thanhTienCoDmucGao: 0,
						thanhTienKhongDmucGao: 0,
						thanhTienCongGao: 0,
						luongThoc: item.luongThoc,
						cphiXuatCoDmucThoc: 0,
						cphiXuatChuaDmucThoc: 0,
						thanhTienCoDmucThoc: 0,
						thanhTienKhongDmucThoc: 0,
						thanhTienCongThoc: 0,
						listCtiet: [],
						stt: "",
						id: item.id,
						checked: false,
					}
					item.listCtiet.forEach(e => {
						let ss: superMiniData = {
							vitri: e.id,
							maVtuTbi: e.maVtuTbi,
							sl: e.sl,
						}
						mm.listCtiet.push(ss);
					})
					this.lstCTietBCao.push(mm);
				})

				this.lstCTietBCao[0].listCtiet.forEach(item => {
					var mm: miniData = {
						maVtuTbi: item.maVtuTbi,
						stt: 0,
						id: item.vitri,
						checked: false,
						tong: 0,
						cphiXuatCoDmuc: 0,
						cphiXuatChuaDmuc: 0,
						thanhTienCoDmuc: 0,
						thanhTienKhongDmuc: 0,
						thanhTienCong: 0,
					}
					this.lstVtu.push(mm);
				})

				this.lstCTietBCao.forEach(data => {
					data.listCtiet.forEach(item => {
						item.vitri = this.lstVtu.find(e => e.maVtuTbi == item.maVtuTbi).id;
					})
				})

				this.lstCTietBCao.forEach(item => {
					this.tinhTong(1, item);
				})
				this.tinhLaiTongSl();
				console.log(this.lstCTietBCao);

				this.updateEditCache();
			} else {
				this.notification.error(MESSAGE.ERROR, data?.msg);
			}
		}, err => {
			this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
		});
		this.spinner.hide();
	}
	//kiem tra xem vat tu da duoc chon hay chua
	checkVtu(id: any) {
		var index: number = this.lstVtu.findIndex(e => e.id === id);
		var ma: any = this.editCache1[id].data.maVtuTbi;
		var kt: boolean = false;
		this.lstVtu.forEach(item => {
			if ((id != item.id) && (item.maVtuTbi == ma)) {
				kt = true;
			}
		})
		if (kt) {
			this.notification.warning(MESSAGE.ERROR, MESSAGE.ERROR_ADD_VTU);
			this.deleteById1(id);
			this.addLine1(index + 1);
		}
	}
	//kiem tra xe cuc DTNN KV duoc chon hay chua
	checkCucKV(id: any) {
		var index: number = this.lstCTietBCao.findIndex(e => e.id === id);
		var ma: any = this.editCache[id].data.maCucDtnnKvuc;
		var kt: boolean = false;
		this.lstCTietBCao.forEach(item => {
			if ((id != item.id) && (item.maCucDtnnKvuc == ma)) {
				kt = true;
			}
		})
		if (kt) {
			this.notification.warning(MESSAGE.ERROR, MESSAGE.ERROR_ADD_UNIT);
			this.deleteById(id);
			this.addLine(index + 1);
		}
	}

	checkNull(id: any) {
		if (this.editCache[id].data.maCucDtnnKvuc) {
			this.notification.error(MESSAGE.ERROR, MESSAGE.NULL_ERROR);
		}
	}

	getName(maDvi: string): string {
		return this.cucKhuVucs.find(e => e.maDvi === maDvi)?.tenDvi;
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
		let lstTemp = [];
		let lstVtuTemp= [];

		this.lstCTietBCao.forEach(item => {
			var lstCTietTemp = [];
			item.listCtiet.forEach(e => {
				lstCTietTemp.push({
					...e,
					id: null,
				})
			})
			lstTemp.push({
				...item,
				id: null,
				listCtiet: lstCTietTemp,
			})
		})

		this.lstVtu.forEach(item => {
			lstVtuTemp.push({
				...item,
				id: null,
			})
		})
		let request = {
			id: null,
			listIdDeletes: null,
			fileDinhKems: null,
			listIdDeleteFiles: null,                      // id file luc get chi tiet tra ra( de backend phuc vu xoa file)
			lstCTietBCao: lstTemp,
			maBcao: maBaoCao,
			maDvi: this.maDonViTao,
			maDviTien: this.maDviTien,
			maLoaiBcao: this.maLoaiBaoCao = QLNV_KHVONPHI_TC_DTOAN_PHI_XUAT_DTQG_VTRO_CTRO_HNAM,
			namHienHanh: this.namBaoCaoHienHanh,
			namBcao: this.namBaoCaoHienHanh + 1,
			soVban: null,
			listDeleteVtus: null,
			lstTongVtu: lstVtuTemp,
		};

		//call service them moi
		this.spinner.show();
		this.quanLyVonPhiService.trinhDuyetService(request).toPromise().then(
			async data => {
				if (data.statusCode == 0) {
					this.notification.success(MESSAGE.SUCCESS, MESSAGE.COPY_SUCCESS);
					this.id = data.data.id;
					await this.getDetailReport();
					this.getStatusButton();
					this.router.navigateByUrl('/qlkh-von-phi/quan-ly-lap-tham-dinh-du-toan-nsnn/du-toan-phi-xuat-hang-dtqg-hang-nam-vtct/' + this.id);
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
