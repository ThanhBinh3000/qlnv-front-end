import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as uuid from "uuid";
import { DanhMucHDVService } from '../../../../../services/danhMucHDV.service';
import { DatePipe, Location } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { DomSanitizer } from '@angular/platform-browser';
import * as fileSaver from 'file-saver';
import { divMoney, DONVITIEN, mulMoney, QLNV_KHVONPHI_TC_THOP_DTOAN_CHI_TX_HNAM, Utils } from "../../../../../Utility/utils";
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MESSAGE } from '../../../../../constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';

export class ItemData {
	id: any;
	stt!: number;
	maDvi!: string;
	tongCong!: number;
	k331Tcong!: number;
	k331KhongTchuCoDmucCong!: number;
	k331KhongTchuCoDmucNx!: number;
	k331KhongTchuCoDmucVtct!: number;
	k331KhongTchuCoDmucBquan!: number;
	k331KhongTchuChuaDmucCong!: number;
	k331KhongTchuChuaDmucCntt!: number;
	k331KhongTchuChuaDmucThueKho!: number;
	k331KhongTchuChuaDmucMsamTsan!: number;
	k331KhongTchuChuaDmucBhiemHhoa!: number;
	k331KhongTchuChuaDmucPhongChongMoiKplb!: number;
	k331KhongTchuChuaDmucVchuyenBquanTsanQhiem!: number;
	k331KhongTchuChuaDmucSchuaKhoTang!: number;
	k341Tcong!: number;
	k341LuongTuChu!: number;
	k341TxTheoDmucTuChu!: number;
	k341ChiTxKhongDmucTuChu!: number;
	k341LuongKhongTuChu!: number;
	k341TxTheoDmucKhongTuChu!: number;
	k341ChiTxKhongDmucKhongTuChu!: number;
	k085DaoTao!: number;
	k102NghienCuuKhoaHoc!: number;
	k398DamBaoXaHoi!: number;
	checked!: boolean;
}

@Component({
	selector: 'app-tong-hop-du-toan-chi-thuong-xuyen-hang-nam',
	templateUrl: './tong-hop-du-toan-chi-thuong-xuyen-hang-nam.component.html',
	styleUrls: ['./tong-hop-du-toan-chi-thuong-xuyen-hang-nam.component.scss'],
})

export class TongHopDuToanChiThuongXuyenHangNamComponent implements OnInit {
	maDvi: any;
	maLoaiBacao: string = '25';
	nam: any;
	donVis: any = [];
	donViTiens: any = DONVITIEN;                        // danh muc don vi tien
	tong: ItemData = {
		id: "",
		stt: 0,
		maDvi: "",
		tongCong: 0,
		k331Tcong: 0,
		k331KhongTchuCoDmucCong: 0,
		k331KhongTchuCoDmucNx: 0,
		k331KhongTchuCoDmucVtct: 0,
		k331KhongTchuCoDmucBquan: 0,
		k331KhongTchuChuaDmucCong: 0,
		k331KhongTchuChuaDmucCntt: 0,
		k331KhongTchuChuaDmucThueKho: 0,
		k331KhongTchuChuaDmucMsamTsan: 0,
		k331KhongTchuChuaDmucBhiemHhoa: 0,
		k331KhongTchuChuaDmucPhongChongMoiKplb: 0,
		k331KhongTchuChuaDmucVchuyenBquanTsanQhiem: 0,
		k331KhongTchuChuaDmucSchuaKhoTang: 0,
		k341Tcong: 0,
		k341LuongTuChu: 0,
		k341TxTheoDmucTuChu: 0,
		k341ChiTxKhongDmucTuChu: 0,
		k341LuongKhongTuChu: 0,
		k341TxTheoDmucKhongTuChu: 0,
		k341ChiTxKhongDmucKhongTuChu: 0,
		k085DaoTao: 0,
		k102NghienCuuKhoaHoc: 0,
		k398DamBaoXaHoi: 0,
		checked!: false,
	};
	userInfo: any;
	errorMessage!: String;
	listBaoCao: ItemData[] = [];
	lstCTietBCao: ItemData[] = [];
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
	maLoaiBaoCao: string = QLNV_KHVONPHI_TC_THOP_DTOAN_CHI_TX_HNAM;
	maDviTien: string;
	newDate = new Date();
	fileToUpload!: File;
	listFile: File[] = [];
	listId: string = "";
	listFileUploaded: any = [];
	box1 = true;
	fileUrl: any;
	currentFile?: File;
	progress = 0;
	message = '';
	fileName = 'Select File';
	listIdDelete: string = "";                  // list id delete

	statusBtnDel: boolean;                       // trang thai an/hien nut xoa
	statusBtnSave: boolean = false;                      // trang thai an/hien nut luu
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
	indeterminate = true;                       // properties allCheckBox
	editCache: { [key: string]: { edit: boolean; data: ItemData } } = {};     // phuc vu nut chinh

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
		this.ngayNhap = this.datePipe.transform(this.newDate, Utils.FORMAT_DATE_STR)
	}


	async ngOnInit() {
		this.id = this.routerActive.snapshot.paramMap.get('id');
		let userName = this.userService.getUserName();
		await this.getUserInfo(userName); //get user info

		//check prama dieu huong router
		this.maDvi = this.routerActive.snapshot.paramMap.get('maDvi');
		this.maLoaiBacao = this.routerActive.snapshot.paramMap.get('maLoaiBacao');
		this.nam = this.routerActive.snapshot.paramMap.get('nam');
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
		}


		//lay danh sach danh muc don vi
		await this.danhMucService.dMDonVi().toPromise().then(
			(data) => {
				if (data.statusCode == 0) {
					console.log(data);
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
		// replace nhung ban ghi dc them moi id thanh null
		this.lstCTietBCao.filter(item => {
			if (typeof item.id != "number") {
				item.id = null;
			}
		})
		// gui du lieu trinh duyet len server
		let request = {
			id: this.id,
			fileDinhKems: listFile,
			listIdDeleteFiles: this.listIdDeleteFiles,
			listIdDeletes: this.listIdDelete,
			lstCTietBCao: this.mulMoneyTotal(0),
			maBcao: this.maBaoCao,
			maDvi: this.maDonViTao,
			maDviTien: this.maDviTien,
			maLoaiBcao: this.maLoaiBaoCao = QLNV_KHVONPHI_TC_THOP_DTOAN_CHI_TX_HNAM,
			namBcao: this.namBaoCaoHienHanh + 1,
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
		this.tinhTong(-1, this.tong);
		this.spinner.show();
		await this.quanLyVonPhiService.bCLapThamDinhDuToanChiTiet(this.id).toPromise().then(
			(data) => {
				if (data.statusCode == 0) {
					this.chiTietBcaos = data.data;
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

					this.lstCTietBCao.forEach(item => {
						this.tinhTong(1, item);
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
			id: uuid.v4(),
			stt: 0,
			maDvi: "",
			tongCong: 0,
			k331KhongTchuCoDmucNx: 0,
			k331KhongTchuCoDmucVtct: 0,
			k331KhongTchuCoDmucBquan: 0,
			k331KhongTchuCoDmucCong: 0, // 3=4+5+6
			k331KhongTchuChuaDmucCntt: 0,
			k331KhongTchuChuaDmucThueKho: 0,
			k331KhongTchuChuaDmucMsamTsan: 0,
			k331KhongTchuChuaDmucBhiemHhoa: 0,
			k331KhongTchuChuaDmucPhongChongMoiKplb: 0,
			k331KhongTchuChuaDmucVchuyenBquanTsanQhiem: 0,
			k331KhongTchuChuaDmucSchuaKhoTang: 0,
			k331KhongTchuChuaDmucCong: 0,
			k331Tcong: 0, //2=3+7
			k341Tcong: 0,
			k341LuongTuChu: 0,
			k341TxTheoDmucTuChu: 0,
			k341ChiTxKhongDmucTuChu: 0,
			k341LuongKhongTuChu: 0,
			k341TxTheoDmucKhongTuChu: 0,
			k341ChiTxKhongDmucKhongTuChu: 0,
			k085DaoTao: 0,
			k102NghienCuuKhoaHoc: 0,
			k398DamBaoXaHoi: 0,
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
		const index = this.lstCTietBCao.findIndex(item => item.id === id);
		this.tinhTong(-1, this.lstCTietBCao[index]);
		this.lstCTietBCao = this.lstCTietBCao.filter(item => item.id != id)
		if (typeof id == "number") {
			this.listIdDelete += id + ",";
		}
	}

	// xóa với checkbox
	deleteSelected() {
		// add list delete id
		this.lstCTietBCao.forEach(item => {
			if (item.checked == true) {
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
		// this.router.navigate(['/kehoach/chi-tieu-ke-hoach-nam-cap-tong-cuc']);
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
		const index = this.lstCTietBCao.findIndex(item => item.id === id);  // lay vi tri hang minh sua
		if (!this.lstCTietBCao[index].maDvi) {
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
		if (!this.editCache[id].data.maDvi) {
			this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
			return;
		}
		this.editCache[id].data.checked = this.lstCTietBCao.find(item => item.id === id).checked; // set checked editCache = checked lstCTietBCao
		const index = this.lstCTietBCao.findIndex(item => item.id === id);   // lay vi tri hang minh sua
		this.tinhTong(-1, this.lstCTietBCao[index]);
		this.tinhTong(1, this.editCache[id].data);
		Object.assign(this.lstCTietBCao[index], this.editCache[id].data); // set lai data cua lstCTietBCao[index] = this.editCache[id].data
		this.editCache[id].edit = false;  // CHUYEN VE DANG TEXT
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

	changeModel(id: string): void {
		let k: any = this.editCache[id].data;
		this.editCache[id].data.k331KhongTchuCoDmucCong = k.k331KhongTchuCoDmucNx + k.k331KhongTchuCoDmucVtct + k.k331KhongTchuCoDmucBquan;
		this.editCache[id].data.k331KhongTchuChuaDmucCong = k.k331KhongTchuChuaDmucCntt + k.k331KhongTchuChuaDmucThueKho + k.k331KhongTchuChuaDmucMsamTsan + k.k331KhongTchuChuaDmucBhiemHhoa + k.k331KhongTchuChuaDmucPhongChongMoiKplb + k.k331KhongTchuChuaDmucVchuyenBquanTsanQhiem + k.k331KhongTchuChuaDmucSchuaKhoTang;
		this.editCache[id].data.k331Tcong = k.k331KhongTchuCoDmucCong + k.k331KhongTchuChuaDmucCong;
		this.editCache[id].data.k341Tcong = k.k341LuongTuChu + k.k341TxTheoDmucTuChu + k.k341ChiTxKhongDmucTuChu + k.k341LuongKhongTuChu + k.k341TxTheoDmucKhongTuChu+ k.k341ChiTxKhongDmucKhongTuChu;
		this.editCache[id].data.tongCong = k.k331Tcong + k.k341Tcong + k.k085DaoTao + k.k102NghienCuuKhoaHoc + k.k398DamBaoXaHoi;
	}

	tinhTong(heSo: number, item: ItemData) {
		this.tong.tongCong += heSo * item.tongCong;
		this.tong.k331Tcong += heSo * item.k331Tcong;
		this.tong.k331KhongTchuCoDmucCong += heSo * item.k331KhongTchuCoDmucCong;
		this.tong.k331KhongTchuCoDmucNx += heSo * item.k331KhongTchuCoDmucNx;
		this.tong.k331KhongTchuCoDmucVtct += heSo * item.k331KhongTchuCoDmucVtct;
		this.tong.k331KhongTchuCoDmucBquan += heSo * item.k331KhongTchuCoDmucBquan;
		this.tong.k331KhongTchuChuaDmucCong += heSo * item.k331KhongTchuChuaDmucCong;
		this.tong.k331KhongTchuChuaDmucCntt += heSo * item.k331KhongTchuChuaDmucCntt;
		this.tong.k331KhongTchuChuaDmucThueKho += heSo * item.k331KhongTchuChuaDmucThueKho;
		this.tong.k331KhongTchuChuaDmucMsamTsan += heSo * item.k331KhongTchuChuaDmucMsamTsan;
		this.tong.k331KhongTchuChuaDmucBhiemHhoa += heSo * item.k331KhongTchuChuaDmucBhiemHhoa;
		this.tong.k331KhongTchuChuaDmucPhongChongMoiKplb += heSo * item.k331KhongTchuChuaDmucPhongChongMoiKplb;
		this.tong.k331KhongTchuChuaDmucVchuyenBquanTsanQhiem += heSo * item.k331KhongTchuChuaDmucVchuyenBquanTsanQhiem;
		this.tong.k331KhongTchuChuaDmucSchuaKhoTang += heSo * item.k331KhongTchuChuaDmucSchuaKhoTang;
		this.tong.k341Tcong += heSo * item.k341Tcong;
		this.tong.k341LuongTuChu += heSo * item.k341LuongTuChu;
		this.tong.k341TxTheoDmucTuChu += heSo * item.k341TxTheoDmucTuChu;
		this.tong.k341ChiTxKhongDmucTuChu += heSo * item.k341ChiTxKhongDmucTuChu;
		this.tong.k341LuongKhongTuChu += heSo * item.k341LuongKhongTuChu;
		this.tong.k341TxTheoDmucKhongTuChu += heSo * item.k341TxTheoDmucKhongTuChu;
		this.tong.k341ChiTxKhongDmucKhongTuChu += heSo * item.k341ChiTxKhongDmucKhongTuChu;
		this.tong.k085DaoTao += heSo * item.k085DaoTao;
		this.tong.k102NghienCuuKhoaHoc += heSo * item.k102NghienCuuKhoaHoc;
		this.tong.k398DamBaoXaHoi += heSo * item.k398DamBaoXaHoi;
	}

	//call tong hop
	calltonghop() {
		this.spinner.hide();
		this.maDviTien = '1';
		let objtonghop = {
			maDvi: this.maDvi,
			maLoaiBcao: this.maLoaiBacao,
			namHienTai: this.nam,
		}
		this.quanLyVonPhiService.tongHop(objtonghop).toPromise().then(res => {
			if (res.statusCode == 0) {
				this.lstCTietBCao = res.data;
				this.lstCTietBCao.forEach(e => {
					e.id = uuid.v4();
				})
				// this.namBaoCao = this.namBcao;
				this.updateEditCache();
				this.namBaoCaoHienHanh = new Date().getFullYear();
				if (this.lstCTietBCao == null) {
					this.lstCTietBCao = [];
				}
				//this.namBcaohienhanh = this.namBcaohienhanh
			} else {
				this.notification.error(MESSAGE.ERROR, res?.msg);
			}
		}, err => {
			this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);;
		});

		this.spinner.show();
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

	divMoneyTotal() {
		this.lstCTietBCao.forEach(element => {
			element.tongCong = divMoney(element.tongCong, this.maDviTien);
			element.k331Tcong = divMoney(element.k331Tcong, this.maDviTien);
			element.k331KhongTchuCoDmucCong = divMoney(element.k331KhongTchuCoDmucCong, this.maDviTien);
			element.k331KhongTchuChuaDmucCong = divMoney(element.k331KhongTchuChuaDmucCong, this.maDviTien);
			element.k341Tcong = divMoney(element.k341Tcong, this.maDviTien);
			element.k331KhongTchuCoDmucNx = divMoney(element.k331KhongTchuCoDmucNx, this.maDviTien);
			element.k331KhongTchuCoDmucVtct = divMoney(element.k331KhongTchuCoDmucVtct, this.maDviTien);
			element.k331KhongTchuCoDmucBquan = divMoney(element.k331KhongTchuCoDmucBquan, this.maDviTien);
			element.k331KhongTchuChuaDmucCntt = divMoney(element.k331KhongTchuChuaDmucCntt, this.maDviTien);
			element.k331KhongTchuChuaDmucThueKho = divMoney(element.k331KhongTchuChuaDmucThueKho, this.maDviTien);
			element.k331KhongTchuChuaDmucMsamTsan = divMoney(element.k331KhongTchuChuaDmucMsamTsan, this.maDviTien);
			element.k331KhongTchuChuaDmucBhiemHhoa = divMoney(element.k331KhongTchuChuaDmucBhiemHhoa, this.maDviTien);
			element.k331KhongTchuChuaDmucPhongChongMoiKplb = divMoney(element.k331KhongTchuChuaDmucPhongChongMoiKplb, this.maDviTien);
			element.k331KhongTchuChuaDmucVchuyenBquanTsanQhiem = divMoney(element.k331KhongTchuChuaDmucVchuyenBquanTsanQhiem, this.maDviTien);
			element.k331KhongTchuChuaDmucSchuaKhoTang = divMoney(element.k331KhongTchuChuaDmucSchuaKhoTang, this.maDviTien);
			element.k341LuongTuChu = divMoney(element.k341LuongTuChu, this.maDviTien);
			element.k341ChiTxKhongDmucTuChu = divMoney(element.k341ChiTxKhongDmucTuChu, this.maDviTien);
			element.k341TxTheoDmucTuChu = divMoney(element.k341TxTheoDmucTuChu, this.maDviTien);
			element.k341LuongKhongTuChu = divMoney(element.k341LuongKhongTuChu, this.maDviTien);
			element.k341ChiTxKhongDmucKhongTuChu = divMoney(element.k341ChiTxKhongDmucKhongTuChu, this.maDviTien);
			element.k341TxTheoDmucKhongTuChu = divMoney(element.k341TxTheoDmucKhongTuChu, this.maDviTien);
			element.k085DaoTao = divMoney(element.k085DaoTao, this.maDviTien);
			element.k102NghienCuuKhoaHoc = divMoney(element.k102NghienCuuKhoaHoc, this.maDviTien);
			element.k398DamBaoXaHoi = divMoney(element.k398DamBaoXaHoi, this.maDviTien);
		});
	}

	mulMoneyTotal(id: number) {
		let lstCTietBCaoTemp = [];
		this.lstCTietBCao.forEach(element => {
			lstCTietBCaoTemp.push({
				...element,
				tongCong: mulMoney(element.tongCong, this.maDviTien),
				k331Tcong: mulMoney(element.k331Tcong, this.maDviTien),
				k331KhongTchuCoDmucCong: mulMoney(element.k331KhongTchuCoDmucCong, this.maDviTien),
				k331KhongTchuChuaDmucCong: mulMoney(element.k331KhongTchuChuaDmucCong, this.maDviTien),
				k341Tcong: mulMoney(element.k341Tcong, this.maDviTien),
				k331KhongTchuCoDmucNx: mulMoney(element.k331KhongTchuCoDmucNx, this.maDviTien),
				k331KhongTchuCoDmucVtct: mulMoney(element.k331KhongTchuCoDmucVtct, this.maDviTien),
				k331KhongTchuCoDmucBquan: mulMoney(element.k331KhongTchuCoDmucBquan, this.maDviTien),
				k331KhongTchuChuaDmucCntt: mulMoney(element.k331KhongTchuChuaDmucCntt, this.maDviTien),
				k331KhongTchuChuaDmucThueKho: mulMoney(element.k331KhongTchuChuaDmucThueKho, this.maDviTien),
				k331KhongTchuChuaDmucMsamTsan: mulMoney(element.k331KhongTchuChuaDmucMsamTsan, this.maDviTien),
				k331KhongTchuChuaDmucBhiemHhoa: mulMoney(element.k331KhongTchuChuaDmucBhiemHhoa, this.maDviTien),
				k331KhongTchuChuaDmucPhongChongMoiKplb: mulMoney(element.k331KhongTchuChuaDmucPhongChongMoiKplb, this.maDviTien),
				k331KhongTchuChuaDmucVchuyenBquanTsanQhiem: mulMoney(element.k331KhongTchuChuaDmucVchuyenBquanTsanQhiem, this.maDviTien),
				k331KhongTchuChuaDmucSchuaKhoTang: mulMoney(element.k331KhongTchuChuaDmucSchuaKhoTang, this.maDviTien),
				k341LuongTuChu: mulMoney(element.k341LuongTuChu, this.maDviTien),
				k341ChiTxKhongDmucTuChu: mulMoney(element.k341ChiTxKhongDmucTuChu, this.maDviTien),
				k341TxTheoDmucTuChu: mulMoney(element.k341TxTheoDmucTuChu, this.maDviTien),
				k341LuongKhongTuChu: mulMoney(element.k341LuongKhongTuChu, this.maDviTien),
				k341ChiTxKhongDmucKhongTuChu: mulMoney(element.k341ChiTxKhongDmucKhongTuChu, this.maDviTien),
				k341TxTheoDmucKhongTuChu: mulMoney(element.k341TxTheoDmucKhongTuChu, this.maDviTien),
				k085DaoTao: mulMoney(element.k085DaoTao, this.maDviTien),
				k102NghienCuuKhoaHoc: mulMoney(element.k102NghienCuuKhoaHoc, this.maDviTien),
				k398DamBaoXaHoi: mulMoney(element.k398DamBaoXaHoi, this.maDviTien),
			})
		});
		if (id == 1) {
			lstCTietBCaoTemp.forEach(item => {
				item.id = null;
			})
		}
		return lstCTietBCaoTemp;
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
		if (!maBaoCao) {
			return;
		}
		let request = {
			id: null,
			listIdDeletes: null,
			fileDinhKems: null,
			listIdDeleteFiles: null,                      // id file luc get chi tiet tra ra( de backend phuc vu xoa file)
			lstCTietBCao: this.mulMoneyTotal(1),
			maBcao: maBaoCao,
			maDvi: this.maDonViTao,
			maDviTien: this.maDviTien,
			maLoaiBcao: this.maLoaiBaoCao = QLNV_KHVONPHI_TC_THOP_DTOAN_CHI_TX_HNAM,
			namHienHanh: this.namBaoCaoHienHanh,
			namBcao: this.namBaoCaoHienHanh + 1,
			soVban: null,
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
					this.router.navigateByUrl('/qlkh-von-phi/quan-ly-lap-tham-dinh-du-toan-nsnn/tong-hop-du-toan-chi-thuong-xuyen-hang-nam/' + this.id);
				} else {
					this.notification.error(MESSAGE.ERROR, data?.msg);
					this.divMoneyTotal();
				}
			},
			err => {
				this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
				this.divMoneyTotal();
			},
		);

		this.lstCTietBCao.filter(item => {
			if (!item.id) {
				item.id = uuid.v4();
			}
		});

		this.updateEditCache();
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
