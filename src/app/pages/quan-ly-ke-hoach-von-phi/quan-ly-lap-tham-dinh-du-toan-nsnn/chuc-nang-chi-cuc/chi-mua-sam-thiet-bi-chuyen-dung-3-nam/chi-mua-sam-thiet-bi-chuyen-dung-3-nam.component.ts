import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as uuid from "uuid";
import { DanhMucHDVService } from '../../../../../services/danhMucHDV.service';
import { DatePipe, Location } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { DomSanitizer } from '@angular/platform-browser';
import * as fileSaver from 'file-saver';
import { divMoney, DONVITIEN, mulMoney, QLNV_KHVONPHI_DTOAN_CHI_MUASAM_MAYMOC_TBI_GD3N, Utils } from "../../../../../Utility/utils";
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MESSAGE } from '../../../../../constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export class ItemData {
	id: any;
	stt!: number;
	maTbi!: string;
	n1!: number;
	n2!: number;
	n3!: number;
	checked!: boolean;
}

@Component({
	selector: 'app-chi-mua-sam-thiet-bi-chuyen-dung-3-nam',
	templateUrl: './chi-mua-sam-thiet-bi-chuyen-dung-3-nam.component.html',
	styleUrls: ['./chi-mua-sam-thiet-bi-chuyen-dung-3-nam.component.scss'],
})

export class ChiMuaSamThietBiChuyenDung3NamComponent implements OnInit {
	userInfo: any;
	errorMessage!: String;
	listBaoCao: ItemData[] = [];
	lstCTietBCao: ItemData[] = [];
	donVis: any = [];
	listMachitieu: any = [];
	donViTiens: any = DONVITIEN;                        // danh muc don vi tien
	id!: any;
	chiTietBcaos: any;
	lstFile: any = [];
	status: boolean = false;
	namBcao: number;
	userData!: any;
	role!: any;
	unit!: any;
	userName!: any;
	ngayNhap!: any;
	nguoiNhap!: string;
	maDonViTao: any;
	maBaoCao!: string;
	namBaoCaoHienHanh!: any;
	namBaoCao!: any;
	trangThaiBanGhi: string = "1";
	maLoaiBaoCao: string = QLNV_KHVONPHI_DTOAN_CHI_MUASAM_MAYMOC_TBI_GD3N;
	maDviTien: string = '';
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
	tong1: number = 0;
	tong2: number = 0;
	tong3: number = 0;

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
	indeterminate = true;                       // properties allCheckBox
	editCache: { [key: string]: { edit: boolean; data: ItemData } } = {};     // phuc vu nut chinh

	fileList: NzUploadFile[] = [];

	soVban: any;
	capDv: any;
	checkDv: boolean;
	currentday: Date = new Date();

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
			this.quanLyVonPhiService.sinhMaBaoCao().subscribe(
				(data) => {
					if (data.statusCode == 0) {
						this.maBaoCao = data.data;
					} else {
						this.notification.error(MESSAGE.ERROR, data?.msg);
					}
				},
				(err) => {
					this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
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
					this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
				}
			);
			this.maBaoCao = '';
			this.namBaoCaoHienHanh = new Date().getFullYear();
		}

		//get danh muc noi dung
		this.danhMucService.dMVatTu().toPromise().then(
			(data) => {
				if (data.statusCode == 0) {
					this.listMachitieu = data.data?.content;
				} else {
					this.notification.error(MESSAGE.ERROR, data?.msg);
				}
			},
			(err) => {
				this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
			}
		);

		//lay danh sach danh muc don vi
		await this.danhMucService.dMDonVi().toPromise().then(
			(data) => {
				if (data.statusCode == 0) {
					this.donVis = data.data;
					var Dvi = this.donVis.find(e => e.maDvi == this.maDonViTao);
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
				this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
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
		if (dVi && dVi.parent.maDvi == this.userInfo.dvql) {
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
				this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
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
			element.n1 = mulMoney(element.n1, this.maDviTien);
			element.n2 = mulMoney(element.n2, this.maDviTien);
			element.n3 = mulMoney(element.n3, this.maDviTien);
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
			listIdDeletes: this.listIdDelete,
			listIdDeleteFiles: this.listIdDeleteFiles,
			lstCTietBCao: this.lstCTietBCao,
			maBcao: this.maBaoCao,
			maDvi: this.maDonViTao,
			maDviTien: this.maDviTien,
			maLoaiBcao: this.maLoaiBaoCao = QLNV_KHVONPHI_DTOAN_CHI_MUASAM_MAYMOC_TBI_GD3N,
			namBcao: this.namBaoCaoHienHanh + 1,
			namHienHanh: this.namBaoCaoHienHanh,
			soVban: this.soVban,
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
					console.log(data);
					this.chiTietBcaos = data.data;
					this.lstCTietBCao = data.data.lstCTietBCao;
					this.maDviTien = data.data.maDviTien;
					this.lstCTietBCao.filter(element => {
						element.n1 = divMoney(element.n1, this.maDviTien);
						element.n2 = divMoney(element.n2, this.maDviTien);
						element.n3 = divMoney(element.n3, this.maDviTien);
					});
					if (this.lstCTietBCao.length != null) {
						this.updateEditCache();
					}

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

					if (this.lstCTietBCao.length != 0) {
						this.lstCTietBCao.forEach(e => {
							this.tinhTong(1, e);
						})
					}

					
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
			stt!: 0,
			maTbi!: '',
			n1!: 0,
			n2!: 0,
			n3!: 0,
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
		this.lstCTietBCao.filter(item => {
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
		const index = this.lstCTietBCao.findIndex(item => item.id === id);  // lay vi tri hang minh sua
		this.editCache[id] = {
			data: { ...this.lstCTietBCao[index] },
			edit: false
		};
	}

	// luu thay doi
	saveEdit(id: string): void {
		if (!this.editCache[id].data.maTbi ||
			(!this.editCache[id].data.n1 && this.editCache[id].data.n1 !== 0) ||
			(!this.editCache[id].data.n2 && this.editCache[id].data.n2 !== 0) ||
			(!this.editCache[id].data.n3 && this.editCache[id].data.n3 !== 0)) {
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

	tinhTong(heSo: number, item: ItemData) {
		this.tong1 += heSo * item.n1;
		this.tong2 += heSo * item.n2;
		this.tong3 += heSo * item.n3;
	}

	//call tong hop
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
				if (this.lstCTietBCao.length != 0) {
					this.lstCTietBCao.forEach(e => {
						this.tinhTong(1, e);
					})
				}
			} else {
				this.notification.error(MESSAGE.ERROR, res?.msg);
			}
		}, err => {
			this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
		});
		this.updateEditCache()
		this.spinner.hide();
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
	doCopy(){
    
	}
  
	// action print
	doPrint(){
	  
	}

}
