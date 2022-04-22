import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as uuid from "uuid";
import { DanhMucHDVService } from '../../../../../services/danhMucHDV.service';
import { DatePipe, Location } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { DomSanitizer } from '@angular/platform-browser';
import * as fileSaver from 'file-saver';
import { QLNV_KHVONPHI_TC_DTOAN_PHI_NXUAT_DTQG_THOC_GAO_HNAM, Utils } from "../../../../../Utility/utils";
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { C } from '@angular/cdk/keycodes';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MESSAGE } from '../../../../../constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';


export class ItemData {
	maCucDtnnKvuc!: string;
	nxuatThocLuongXuat!: number;
	nxuatThocLuongNhap!: number;
	nxuatThocLuongTtien!: number;
	nxuatThocLuongDmucPhiXuat!: number;
	nxuatThocLuongDmucPhiNhap!: number;
	nxuatGaoLuongXuat!: number;
	nxuatGaoLuongNhap!: number;
	nxuatGaoLuongDmucPhiXuat!: number;
	nxuatGaoLuongDmucPhiNhap!: number;
	nxuatGaoLuongTtien!: number;
	listCtiet: superMiniData[];
	id!: any;
	stt!: String;
	checked!: boolean;
}

export class superMiniData {
	vitri!: any;
	maVtuTbi!: string;
	sl!: number;
}


export class miniData {
	id!: any;
	stt!: string;
	checked!: boolean;
	maVtuTbi!: string;
	tongDvi!: number;
	tongVphong!: number;
	dmucNhapVttbDvi!: number;
	dmucNhapVttbVphong!: number;
	ttienNhapVttbDvi!: number;
	ttienNhapVttbVphong!: number;
}

@Component({
	selector: 'app-du-toan-xuat-nhap-hang-dtqg-hang-nam',
	templateUrl: './du-toan-xuat-nhap-hang-dtqg-hang-nam.component.html',
	styleUrls: ['./du-toan-xuat-nhap-hang-dtqg-hang-nam.component.scss'],
})

export class DuToanXuatNhapHangDtqgHangNamComponent implements OnInit {
	userInfo: any;
	maDvi: any;
	maLoaiBacao: string = '25';
	nam: any;
	errorMessage!: String;
	vatTus: any = [];
	donVis: any = [];                            // danh muc don vi
	cucKhuVucs: any = [];
	vanPhongs: any = [
		{
			maDvi: "101",
			capDvi: "1.5",
			tenDvi: "Văn phòng",
		},
	];
	tong: ItemData = {
		maCucDtnnKvuc: "",
		nxuatThocLuongXuat: 0,
		nxuatThocLuongNhap: 0,
		nxuatThocLuongDmucPhiNhap: 0,
		nxuatThocLuongDmucPhiXuat: 0,
		nxuatThocLuongTtien: 0,
		nxuatGaoLuongXuat: 0,
		nxuatGaoLuongNhap: 0,
		nxuatGaoLuongDmucPhiNhap: 0,
		nxuatGaoLuongDmucPhiXuat: 0,
		nxuatGaoLuongTtien: 0,
		listCtiet: [],
		stt: "",
		id: uuid.v4(),
		checked: false,
	};
	chiTietBcaos: any;                          // thong tin chi tiet bao cao
	lstCTietBCao: ItemData[] = [];              // list chi tiet bao cao
	lstVtu: miniData[] = [];
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
	maLoaiBaoCao: string = QLNV_KHVONPHI_TC_DTOAN_PHI_NXUAT_DTQG_THOC_GAO_HNAM;                // nam bao cao
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

	statusVP: boolean = true;                      // trang thai an hien cua van phong

	listIdDeleteFiles: string;                        // id file luc call chi tiet


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
			this.quanLyVonPhiService.sinhMaBaoCao().subscribe(
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
			this.quanLyVonPhiService.sinhMaBaoCao().subscribe(
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
		this.danhMucService.dMVatTu().toPromise().then(
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
					this.cucKhuVucs = this.donVis.filter(item => item.capDvi === '2');
					this.vanPhongs.forEach(item => {
						this.cucKhuVucs.push(item);
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
			listIdDeleteFiles: this.listIdDeleteFiles,
			listIdDeletes: this.listIdDelete,
			listDeleteVtus: this.listIdDeleteVtus,
			lstCTietBCao: this.lstCTietBCao,
			lstTongVtu: this.lstVtu,
			maBcao: this.maBaoCao,
			maDvi: this.maDonViTao,
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
						this.trangThaiBanGhi == Utils.TT_BC_8
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
							nxuatThocLuongXuat: item.nxuatThocLuongXuat,
							nxuatThocLuongNhap: item.nxuatThocLuongNhap,
							nxuatThocLuongDmucPhiXuat: item.nxuatThocLuongDmucPhiXuat,
							nxuatThocLuongDmucPhiNhap: item.nxuatThocLuongDmucPhiNhap,
							nxuatThocLuongTtien: item.nxuatThocLuongTtien,
							nxuatGaoLuongXuat: item.nxuatGaoLuongXuat,
							nxuatGaoLuongNhap: item.nxuatGaoLuongNhap,
							nxuatGaoLuongDmucPhiNhap: item.nxuatGaoLuongDmucPhiNhap,
							nxuatGaoLuongDmucPhiXuat: item.nxuatGaoLuongDmucPhiXuat,
							nxuatGaoLuongTtien: item.nxuatGaoLuongTtien,
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
							tongDvi: item.tongDvi,
							tongVphong: item.tongVphong,
							dmucNhapVttbDvi: item.dmucNhapVttbDvi,
							dmucNhapVttbVphong: item.dmucNhapVttbVphong,
							ttienNhapVttbDvi: item.ttienNhapVttbDvi,
							ttienNhapVttbVphong: item.ttienNhapVttbVphong,
						}
						this.lstVtu.push(mm);
					})

					this.lstCTietBCao.forEach(data => {
						data.listCtiet.forEach(item => {
							item.vitri = this.lstVtu.find(e => e.maVtuTbi == item.maVtuTbi).id;
						})
					})

					this.lstCTietBCao.forEach(item => {
						this.tongCong(1, item);
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
	addLine(id: number): void {
		var data: superMiniData[] = [];
		var data1: superMiniData[] = [];
		this.lstVtu.forEach(item => {
			var mini: superMiniData = {
				maVtuTbi: item.maVtuTbi,
				sl: 0,
				vitri: item.id,
			}
			var mini1: superMiniData = {
				maVtuTbi: item.maVtuTbi,
				sl: 0,
				vitri: item.id,
			}
			data.push(mini);
			data1.push(mini1);
		})
		let item: ItemData = {
			maCucDtnnKvuc: "",
			nxuatThocLuongXuat: 0,
			nxuatThocLuongNhap: 0,
			nxuatThocLuongDmucPhiNhap: 0,
			nxuatThocLuongDmucPhiXuat: 0,
			nxuatThocLuongTtien: 0,
			nxuatGaoLuongNhap: 0,
			nxuatGaoLuongXuat: 0,
			nxuatGaoLuongDmucPhiNhap: 0,
			nxuatGaoLuongDmucPhiXuat: 0,
			nxuatGaoLuongTtien: 0,
			listCtiet: data,
			stt: "",
			id: uuid.v4(),
			checked: false,
		}

		let item1: ItemData = {
			maCucDtnnKvuc: "",
			nxuatThocLuongXuat: 0,
			nxuatThocLuongNhap: 0,
			nxuatThocLuongDmucPhiNhap: 0,
			nxuatThocLuongDmucPhiXuat: 0,
			nxuatThocLuongTtien: 0,
			nxuatGaoLuongNhap: 0,
			nxuatGaoLuongXuat: 0,
			nxuatGaoLuongDmucPhiNhap: 0,
			nxuatGaoLuongDmucPhiXuat: 0,
			nxuatGaoLuongTtien: 0,
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
		const index = this.lstCTietBCao.findIndex(item => item.id === id);
		this.tongCong(-1, this.lstCTietBCao[index]);
		this.lstCTietBCao = this.lstCTietBCao.filter(item => item.id != id)

		if (typeof id == "number") {
			this.listIdDelete += id + ",";
		}
		if (this.lstCTietBCao.findIndex(e => e.maCucDtnnKvuc === this.vanPhongs[0].maDvi) != -1) {
			this.statusVP = false;
		} else {
			this.statusVP = true;
		}
		//can cap nhat lai lstCTiet
		this.tinhLaiTongSl();
	}

	// xóa với checkbox
	deleteSelected() {
		// add list delete id
		this.lstCTietBCao.forEach(item => {
			if (item.checked == true) {
				this.tongCong(-1, item);
			}
			if (item.checked == true && typeof item.id == "number") {
				this.listIdDelete += item.id + ","
			}
		})
		// delete object have checked = true
		this.lstCTietBCao = this.lstCTietBCao.filter(item => item.checked != true)
		this.allChecked = false;
		if (this.lstCTietBCao.findIndex(e => e.maCucDtnnKvuc === this.vanPhongs[0].maDvi) != -1) {
			this.statusVP = false;
		} else {
			this.statusVP = true;
		}
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
		if (!this.editCache[id].data.maCucDtnnKvuc) {
			this.notification.error(MESSAGE.ERROR, MESSAGE.NULL_ERROR);
			return;
		}
		const index = this.lstCTietBCao.findIndex(item => item.id === id);  // lay vi tri hang minh sua
		var item: ItemData = this.lstCTietBCao[index];
		this.editCache[id].data.maCucDtnnKvuc = item.maCucDtnnKvuc;
		this.editCache[id].data.nxuatThocLuongNhap = item.nxuatThocLuongNhap;
		this.editCache[id].data.nxuatThocLuongXuat = item.nxuatThocLuongXuat;
		this.editCache[id].data.nxuatThocLuongDmucPhiNhap = item.nxuatThocLuongDmucPhiNhap;
		this.editCache[id].data.nxuatThocLuongTtien = item.nxuatThocLuongTtien;
		this.editCache[id].data.nxuatThocLuongDmucPhiXuat = item.nxuatThocLuongDmucPhiXuat;
		this.editCache[id].data.nxuatGaoLuongNhap = item.nxuatGaoLuongNhap;
		this.editCache[id].data.nxuatGaoLuongXuat = item.nxuatGaoLuongXuat;
		this.editCache[id].data.nxuatGaoLuongDmucPhiNhap = item.nxuatGaoLuongDmucPhiNhap;
		this.editCache[id].data.nxuatGaoLuongDmucPhiXuat = item.nxuatGaoLuongDmucPhiXuat;
		this.editCache[id].data.nxuatGaoLuongTtien = item.nxuatGaoLuongTtien;
		this.editCache[id].data.stt = item.stt;
		this.editCache[id].data.id = item.id;
		this.editCache[id].data.checked = false;
		this.editCache[id].edit = false;
	}

	// luu thay doi
	saveEdit(id: string): void {
		if (!this.editCache[id].data.maCucDtnnKvuc ||
			(!this.editCache[id].data.nxuatGaoLuongDmucPhiNhap && this.editCache[id].data.nxuatGaoLuongDmucPhiNhap !== 0) ||
			(!this.editCache[id].data.nxuatGaoLuongDmucPhiXuat && this.editCache[id].data.nxuatGaoLuongDmucPhiXuat !== 0) ||
			(!this.editCache[id].data.nxuatThocLuongTtien && this.editCache[id].data.nxuatThocLuongTtien !== 0) ||
			(!this.editCache[id].data.nxuatGaoLuongTtien && this.editCache[id].data.nxuatGaoLuongTtien !== 0) ||
			(!this.editCache[id].data.nxuatThocLuongDmucPhiNhap && this.editCache[id].data.nxuatThocLuongDmucPhiNhap !== 0) ||
			(!this.editCache[id].data.nxuatThocLuongDmucPhiXuat && this.editCache[id].data.nxuatThocLuongDmucPhiXuat !== 0)) {
			this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
			return;
		}
		this.editCache[id].data.checked = this.lstCTietBCao.find(item => item.id === id).checked;  // set checked editCache = checked lstCTietBCao
		const index = this.lstCTietBCao.findIndex(item => item.id === id);
		this.tongCong(1, this.editCache[id].data);
		this.tongCong(-1, this.lstCTietBCao[index]);
		var item: ItemData = this.editCache[id].data;
		this.lstCTietBCao[index].maCucDtnnKvuc = item.maCucDtnnKvuc;
		this.lstCTietBCao[index].nxuatThocLuongNhap = item.nxuatThocLuongNhap;
		this.lstCTietBCao[index].nxuatThocLuongXuat = item.nxuatThocLuongXuat;
		this.lstCTietBCao[index].nxuatThocLuongDmucPhiNhap = item.nxuatThocLuongDmucPhiNhap;
		this.lstCTietBCao[index].nxuatThocLuongDmucPhiXuat = item.nxuatThocLuongDmucPhiXuat;
		this.lstCTietBCao[index].nxuatThocLuongTtien = item.nxuatThocLuongTtien;
		this.lstCTietBCao[index].nxuatGaoLuongNhap = item.nxuatGaoLuongNhap;
		this.lstCTietBCao[index].nxuatGaoLuongXuat = item.nxuatGaoLuongXuat;
		this.lstCTietBCao[index].nxuatGaoLuongDmucPhiNhap = item.nxuatGaoLuongDmucPhiNhap;
		this.lstCTietBCao[index].nxuatGaoLuongDmucPhiXuat = item.nxuatGaoLuongDmucPhiXuat;
		this.lstCTietBCao[index].nxuatGaoLuongTtien = item.nxuatGaoLuongTtien;
		this.lstCTietBCao[index].stt = item.stt;
		this.lstCTietBCao[index].id = item.id;
		this.lstCTietBCao[index].checked = false;
		this.editCache[id].edit = false;

		if (this.lstCTietBCao.findIndex(e => e.maCucDtnnKvuc === this.vanPhongs[0].maDvi) != -1) {
			this.statusVP = false;
		} else {
			this.statusVP = true;
		}
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
				nxuatThocLuongXuat: data.nxuatThocLuongXuat,
				nxuatThocLuongNhap: data.nxuatThocLuongNhap,
				nxuatThocLuongDmucPhiNhap: data.nxuatThocLuongDmucPhiNhap,
				nxuatThocLuongDmucPhiXuat: data.nxuatThocLuongDmucPhiXuat,
				nxuatThocLuongTtien: data.nxuatThocLuongTtien,
				nxuatGaoLuongNhap: data.nxuatGaoLuongNhap,
				nxuatGaoLuongXuat: data.nxuatGaoLuongXuat,
				nxuatGaoLuongDmucPhiNhap: data.nxuatGaoLuongDmucPhiNhap,
				nxuatGaoLuongDmucPhiXuat: data.nxuatGaoLuongDmucPhiXuat,
				nxuatGaoLuongTtien: data.nxuatGaoLuongTtien,
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

	tongCong(heSo: number, item: ItemData) {
		this.tong.nxuatThocLuongXuat += heSo * item.nxuatThocLuongXuat;
		this.tong.nxuatThocLuongNhap += heSo * item.nxuatThocLuongNhap;
		this.tong.nxuatThocLuongDmucPhiNhap += heSo * item.nxuatThocLuongDmucPhiNhap;
		this.tong.nxuatThocLuongDmucPhiXuat += heSo * item.nxuatThocLuongDmucPhiXuat;
		this.tong.nxuatThocLuongTtien += heSo * item.nxuatThocLuongTtien;
		this.tong.nxuatGaoLuongNhap += heSo * item.nxuatGaoLuongNhap;
		this.tong.nxuatGaoLuongXuat += heSo * item.nxuatGaoLuongXuat;
		this.tong.nxuatGaoLuongDmucPhiNhap += heSo * item.nxuatGaoLuongDmucPhiNhap;
		this.tong.nxuatGaoLuongDmucPhiXuat += heSo * item.nxuatGaoLuongDmucPhiXuat;
		this.tong.nxuatGaoLuongTtien += heSo * item.nxuatGaoLuongTtien;
	}

	//////////////////////////////////////////////////////////////////////////////////////
	////////////////////// CONG VIEC CUA BANG PHU ////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////
	// them dong moi
	addLine1(id: number): void {
		let item: miniData = {
			maVtuTbi: "",
			stt: "",
			id: uuid.v4(),
			checked: false,
			tongDvi: 0,
			tongVphong: 0,
			dmucNhapVttbDvi: 0,
			dmucNhapVttbVphong: 0,
			ttienNhapVttbDvi: 0,
			ttienNhapVttbVphong: 0,
		}
		this.lstCTietBCao.forEach(data => {
			var mm: superMiniData = {
				maVtuTbi: item.maVtuTbi,
				vitri: item.id,
				sl: 0,
			}
			var mm1: superMiniData = {
				maVtuTbi: item.maVtuTbi,
				vitri: item.id,
				sl: 0,
			}
			data.listCtiet.push(mm);
			this.editCache[data.id].data.listCtiet.push(mm1);
		})
		this.lstVtu.splice(id, 0, item);
		this.editCache1[item.id] = {
			edit: true,
			data: { ...item }
		};
	}

	// xoa dong
	deleteById1(id: any): void {
		var ll: any = this.lstVtu.find(item => item.id === id);

		this.lstCTietBCao.forEach(item => {
			item.listCtiet = item.listCtiet.filter(e => e.vitri != id);
		})

		if (typeof id == 'number')
			this.listIdDeleteVtus += ll.maVtuTbi + ",";
		this.lstVtu = this.lstVtu.filter(item => item.id != ll.id);
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
				})
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
					data.maVtuTbi = item.listCtiet[ind].maVtuTbi;
					data.sl = item.listCtiet[ind].sl;
				}
			})
		})
	}

	// luu thay doi
	saveEdit1(id: string): void {
		if (!this.editCache1[id].data.maVtuTbi ||
			(!this.editCache1[id].data.dmucNhapVttbDvi && this.editCache1[id].data.dmucNhapVttbDvi !== 0) ||
			(!this.editCache1[id].data.dmucNhapVttbVphong && this.editCache1[id].data.dmucNhapVttbVphong !== 0)) {
			this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
			return;
		}
		this.editCache1[id].data.checked = this.lstVtu.find(item => item.id === id).checked; // set checked editCache = checked lstCTietBCao
		const index = this.lstVtu.findIndex(item => item.id === id);   // lay vi tri hang minh sua
		Object.assign(this.lstVtu[index], this.editCache1[id].data);
		this.editCache1[id].edit = false;  // CHUYEN VE DANG TEXT
		this.lstCTietBCao.forEach(item => {
			var ind: number = item.listCtiet.findIndex(e => e.vitri == this.lstVtu[index].id);
			this.editCache[item.id].data.listCtiet.forEach(data => {
				if (data.vitri == this.lstVtu[index].id) {
					item.listCtiet[ind].maVtuTbi = this.lstVtu[index].maVtuTbi;
					item.listCtiet[ind].sl = data.sl;
				}
			})
		})
	}

	tinhLaiTongSl() {
		this.lstVtu.forEach(item => {
			item.tongDvi = 0;
			item.tongVphong = 0;
			this.lstCTietBCao.forEach(data => {
				data.listCtiet.forEach(e => {
					if (item.maVtuTbi == e.maVtuTbi) {
						if (this.vanPhongs.findIndex(et => et.maDvi === data.maCucDtnnKvuc) != -1) {
							item.tongVphong += e.sl;
						} else {
							item.tongDvi += e.sl;
						}
					}
				})
			})
			item.ttienNhapVttbDvi = item.tongDvi * item.dmucNhapVttbDvi;
			item.ttienNhapVttbVphong = item.tongVphong * item.dmucNhapVttbVphong;
		})
	}

	tongSl(id: any) {
		var col: any = this.editCache1[id].data.id;
		this.editCache1[id].data.tongDvi = 0;
		this.editCache1[id].data.tongVphong = 0;
		this.lstCTietBCao.forEach(item => {
			this.editCache[item.id].data.listCtiet.forEach(e => {
				if (e.vitri == col) {
					if (this.vanPhongs.findIndex(et => et.maDvi === item.maCucDtnnKvuc) != -1) {
						this.editCache1[id].data.tongVphong += e.sl;
					} else {
						this.editCache1[id].data.tongDvi += e.sl;
					}
				}
			})
		})
		this.thanhTien(id);
	}

	thanhTien(id: any) {
		this.editCache1[id].data.ttienNhapVttbDvi = Number((this.editCache1[id].data.tongDvi * this.editCache1[id].data.dmucNhapVttbDvi).toFixed(3));
		this.editCache1[id].data.ttienNhapVttbVphong = Number((this.editCache1[id].data.tongVphong * this.editCache1[id].data.dmucNhapVttbVphong).toFixed(3));
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
						nxuatThocLuongXuat: item.nxuatThocLuongXuat,
						nxuatThocLuongNhap: item.nxuatThocLuongNhap,
						nxuatThocLuongDmucPhiXuat: 0,
						nxuatThocLuongDmucPhiNhap: 0,
						nxuatThocLuongTtien: 0,
						nxuatGaoLuongXuat: item.nxuatGaoLuongXuat,
						nxuatGaoLuongNhap: item.nxuatGaoLuongNhap,
						nxuatGaoLuongDmucPhiNhap: 0,
						nxuatGaoLuongDmucPhiXuat: 0,
						nxuatGaoLuongTtien: 0,
						listCtiet: [],
						stt: item.stt,
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
						stt: "",
						id: item.vitri,
						checked: false,
						tongDvi: 0,
						tongVphong: 0,
						dmucNhapVttbDvi: 0,
						dmucNhapVttbVphong: 0,
						ttienNhapVttbDvi: 0,
						ttienNhapVttbVphong: 0,
					}
					this.lstVtu.push(mm);
				})

				this.lstCTietBCao.forEach(data => {
					data.listCtiet.forEach(item => {
						item.vitri = this.lstVtu.find(e => e.maVtuTbi == item.maVtuTbi).id;
					})
				})

				this.lstCTietBCao.forEach(item => {
					this.tongCong(1, item);
				})

				this.tinhLaiTongSl();

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

	xoaBaoCao() {
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
	doCopy() {

	}

	// action print
	doPrint() {

	}
}
