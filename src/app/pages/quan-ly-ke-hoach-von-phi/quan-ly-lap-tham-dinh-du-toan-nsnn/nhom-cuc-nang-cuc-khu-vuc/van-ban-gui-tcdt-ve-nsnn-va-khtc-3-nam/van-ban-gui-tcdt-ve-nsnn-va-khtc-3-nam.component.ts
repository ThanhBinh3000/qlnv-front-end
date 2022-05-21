import { DatePipe, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import * as fileSaver from 'file-saver';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import * as uuid from "uuid";
import { DanhMucHDVService } from '../../../../../services/danhMucHDV.service';
import { LOAI_BAO_CAO, Utils } from "../../../../../Utility/utils";
import { MESSAGE } from '../../../../../constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';

export class ObjResp {
	id: string;
	maBcao: string;
	maLoaiBcao: string;
}

export class ItemData {
	id!: any;
	objResp: ObjResp;
	checked!: boolean;
}

@Component({
	selector: 'app-van-ban-gui-tcdt-ve-nsnn-va-khtc-3-nam',
	templateUrl: './van-ban-gui-tcdt-ve-nsnn-va-khtc-3-nam.component.html',
	styleUrls: ['./van-ban-gui-tcdt-ve-nsnn-va-khtc-3-nam.component.scss'],
})

export class VanBanGuiTcdtVeNsnnVaKhtc3NamComponent implements OnInit {
	userInfo: any;
	errorMessage!: String;                      //
	ngayNhap!: string;                             // ngay nhap
	nguoiNhap!: string;                         // nguoi nhap
	noiTao!: string;
	soVban!: string;
	ngayDuyetVban!: string;
	baoCaos: any = LOAI_BAO_CAO;
	donVis: any = [];
	cucKhuVucs: any = [];
	lstBcao: any = [];

	capDvi!: string;
	status: boolean;

	url: string;

	lstCTietBCao: ItemData[] = [];              // list chi tiet bao cao
	id!: any;                                   // id truyen tu router
	chiTietBcaos: any[];                          // thong tin chi tiet bao cao
	userName: any;                              // ten nguoi dang nhap

	maDonViTao!: any;                           // ma don vi tao
	maBaoCao!: string;                          // ma bao cao
	namBaoCaoHienHanh!: any;                    // nam bao cao hien hanh
	trangThaiBanGhi: string = "1";              // trang thai cua ban ghi
	newDate = new Date();
	kt: boolean;                   //

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

	listIdDelete: string = "";


	allChecked = false;                         // check all checkbox
	indeterminate = true;                       // properties allCheckBox
	editCache: { [key: string]: { edit: boolean; data: ItemData } } = {};     // phuc vu nut chinh

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
	lstFile: any = [];
	listIdDeleteFiles: string = "";
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
		private danhMucService: DanhMucHDVService,
		private userService: UserService,
		private notification: NzNotificationService,
		private location: Location
	) {
		this.ngayNhap = this.datePipe.transform(this.newDate, Utils.FORMAT_DATE_STR,)
	}


	async ngOnInit() {
		this.id = this.routerActive.snapshot.paramMap.get('id');
		let userName = this.userService.getUserName();
		await this.getUserInfo(userName);
		if (this.id) {
			await this.getDetailReport();
			this.kt = false;
		} else {
			this.kt = true;
			this.trangThaiBanGhi = "1";
			this.nguoiNhap = this.userInfo?.username;
			this.maDonViTao = this.userInfo?.dvql;
			this.ngayDuyetVban = this.ngayNhap;
			this.spinner.show();
			this.quanLyVonPhiService.sinhMaVban().toPromise().then(
				(data) => {
					if (data.statusCode == 0) {
						this.soVban = data.data;
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

		if (this.trangThaiBanGhi == '7') this.status = true;
		//get danh muc nhom chi
		await this.danhMucService.dMDonVi().toPromise().then(
			(data) => {
				if (data.statusCode == 0) {
					this.donVis = data.data;
					this.donVis.forEach(item => {
						if (item.maDvi == this.userInfo?.dvql) {
							this.capDvi = item.capDvi;
						}
					})
					this.cucKhuVucs = this.donVis.filter(item => item.capDvi = '2');
				} else {
					this.notification.error(MESSAGE.ERROR, data?.msg);
				}
			},
			(err) => {
				this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
			}
		);

		this.getStatusButton();

		this.danhMucService.dMucBcaoDuyet().toPromise().then(
			(data) => {
				if (data.statusCode == 0) {
					this.lstBcao = data.data;
					console.log(this.lstBcao);
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
		//this.statusBtnDel = utils.getRoleDel(this.trangThaiBanGhi, checkChirld, this.userInfo?.roles[0]?.code);
		this.statusBtnSave = utils.getRoleSave(this.trangThaiBanGhi, checkChirld, this.userInfo?.roles[0]?.code);
		//this.statusBtnApprove = utils.getRoleApprove(this.trangThaiBanGhi, checkChirld, this.userInfo?.roles[0]?.code);
		//this.statusBtnTBP = utils.getRoleTBP(this.trangThaiBanGhi, checkChirld, this.userInfo?.roles[0]?.code);
		//this.statusBtnLD = utils.getRoleLD(this.trangThaiBanGhi, checkChirld, this.userInfo?.roles[0]?.code);
		this.statusBtnGuiDVCT = utils.getRoleGuiDVCT('6', checkChirld, this.userInfo?.roles[0]?.code);
		this.statusBtnDVCT = utils.getRoleDVCT(this.trangThaiBanGhi, checkParent, this.userInfo?.roles[0]?.code);
		//this.statusBtnLDDC = utils.getRoleLDDC(this.trangThaiBanGhi, checkChirld, this.userInfo?.roles[0]?.code);
		//this.statusBtnCopy = utils.getRoleCopy(this.trangThaiBanGhi, checkChirld, this.userInfo?.roles[0]?.code);
		this.statusBtnPrint = utils.getRolePrint(this.trangThaiBanGhi, checkChirld, this.userInfo?.roles[0]?.code);
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


	// luu
	async luu() {
		let checkSaveEdit;

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
		this.lstCTietBCao.forEach(item => {
			if (item.id?.length == 38) {
				item.id = null;
			}
		})
		let request = {
			id: this.id,                 // id file luc get chi tiet tra ra( de backend phuc vu xoa file)
			listIdDeletes: this.listIdDelete,
			fileDinhKems: listFile,
			listIdDeleteFiles: this.listIdDeleteFiles,
			lstCtiet: this.lstCTietBCao,
			maDonVi: this.maDonViTao,
			ngayDuyetVban: this.ngayDuyetVban,
			soVban: this.soVban,
			stt: "",
			trangThai: this.trangThaiBanGhi,
		};
		//call service them moi
		this.spinner.show();
		if (this.id == null) {

			this.quanLyVonPhiService.themMoiVban(request).toPromise().then(
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

			this.quanLyVonPhiService.capNhatVban(request).toPromise().then(
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
		this.lstCTietBCao.forEach(item => {
			if (!item.id) {
				item.id = uuid.v4()+'FE';
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
			this.quanLyVonPhiService.approveVB(requestGroupButtons).toPromise().then(async (data) => {
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
			this.notification.warning(MESSAGE.WARNING, MESSAGE.MESSAGE_DELETE_WARNING);
		}

	}

	// call chi tiet bao cao
	async getDetailReport() {
		this.spinner.show();
		await this.quanLyVonPhiService.ctietVban(this.id).toPromise().then(
			(data) => {
				if (data.statusCode == 0) {
					this.chiTietBcaos = data.data.lstCtiet;
					this.lstCTietBCao = [];
					this.chiTietBcaos.forEach(item => {
						let mm: ItemData = {
							id: item.id,
							objResp: {
								id: item.objResp.id,
								maBcao: item.objResp.maBcao,
								maLoaiBcao: item.objResp.maLoaiBcao,
							},
							checked: false,
						}
						this.lstCTietBCao.push(mm);
					})
					this.updateEditCache();
					this.lstFile = data.data.lstFile;
					// set thong tin chung bao cao
					this.ngayDuyetVban = data.data.ngayDuyetVban;
					this.nguoiNhap = data.data.nguoiTao;
					this.ngayNhap = this.datePipe.transform(data.data.ngayTao, Utils.FORMAT_DATE_STR);
					this.maDonViTao = data.data.maDonVi;
					this.soVban = data.data.soVban;
					this.namBaoCaoHienHanh = data.data.namBcao;
					this.trangThaiBanGhi = data.data.trangThai;
					if (
						this.trangThaiBanGhi == Utils.TT_BC_1 ||
						this.trangThaiBanGhi == Utils.TT_BC_8
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
	xoa() {
		this.lstCTietBCao = [];
	}

	// them dong moi
	addLine(id: number): void {
		let item: ItemData = {
			id: uuid.v4()+'FE',
			objResp: {
				id: "",
				maBcao: "",
				maLoaiBcao: "",
			},
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
		this.lstCTietBCao = this.lstCTietBCao.filter(item => item.id != id)
		if (id?.length == 36) {
			this.listIdDelete += id + ",";
		}
	}

	// xóa với checkbox
	deleteSelected() {
		// add list delete id
		this.lstCTietBCao.filter(item => {
			if (item.checked == true && item?.id?.length == 36) {
				this.listIdDelete += item.id + ","
			}
		})
		// delete object have checked = true
		this.lstCTietBCao = this.lstCTietBCao.filter(item => item.checked != true)
		this.allChecked = false;
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
		return this.cucKhuVucs.find(item => item.maDvi == this.maDonViTao)?.tenDvi;
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
		this.editCache[id].data.checked = this.lstCTietBCao.find(item => item.id === id).checked; // set checked editCache = checked lstCTietBCao
		const index = this.lstCTietBCao.findIndex(item => item.id === id);   // lay vi tri hang minh sua
		Object.assign(this.lstCTietBCao[index], this.editCache[id].data); // set lai data cua lstCTietBCao[index] = this.editCache[id].data
		this.editCache[id].edit = false;  // CHUYEN VE DANG TEXT
		console.log(this.lstCTietBCao);
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
		let mm = this.lstBcao.filter(item => item.maBcao == this.editCache[id].data.objResp.maBcao)
		console.log(mm);
		this.editCache[id].data.objResp.id = mm[0].id;
		this.editCache[id].data.objResp.maLoaiBcao = mm[0].maLoaiBcao;
		console.log(this.editCache[id].data);
	}

	xemChiTiet(maLoaiBaoCao: string, id: string) {
		let url: string;
		switch (maLoaiBaoCao) {
			case '12':
				url = '/chi-thuong-xuyen-3-nam/'
				break;
			case '01':
				url = '/xay-dung-ke-hoach-von-dau-tu/'
				break;
			case '02':
				url = '/xay-dung-nhu-cau-nhap-xuat-hang-nam/'
				break;
			case '03':
				url = '/xay-dung-ke-hoach-bao-quan-hang-nam/'
				break;
			case '04':
				url = '/nhu-cau-xuat-hang-vien-tro/'
				break;
			case '05':
				url = '/xay-dung-ke-hoach-quy-tien-luong3-nam/'
				break;
			case '06':
				url = '/xay-dung-ke-hoach-quy-tien-luong-hang-nam/'
				break;
			case '07':
				url = '/thuyet-minh-chi-de-tai-du-an-nghien-cuu-kh/'
				break;
			case '08':
				url = '/ke-hoach-xay-dung-van-ban-qppl-dtqg-3-nam/'
				break;
			case '09':
				url = '/du-toan-chi-ung-dung-cntt-3-nam/'
				break;
			case '10':
				url = '/chi-mua-sam-thiet-bi-chuyen-dung-3-nam/'
				break;
			case '11':
				url = '/chi-ngan-sach-nha-nuoc-3-nam/'
				break;
			case '13':
				url = '/nhu-cau-phi-nhap-xuat-3-nam/'
				break;
			case '14':
				url = '/ke-hoach-cai-tao-va-sua-chua-lon-3-nam/'
				break;
			case '15':
				url = '/ke-hoach-dao-tao-boi-duong-3-nam/'
				break;
			case '16':
				url = '/nhu-cau-ke-hoach-dtxd3-nam/'
				break;
			case '17':
				url = '/tong-hop-du-toan-chi-thuong-xuyen-hang-nam/'
				break;
			case '18':
				url = '/du-toan-xuat-nhap-hang-dtqg-hang-nam/'
				break;
			case '19':
				url = '/ke-hoach-bao-quan-hang-nam/'
				break;
			case '20':
				url = '/du-toan-phi-xuat-hang-dtqg-hang-nam-vtct/'
				break;
			case '21':
				url = '/ke-hoach-du-toan-cai-tao-sua-chua-ht-kt3-nam/'
				break;
			case '22':
				url = '/ke-hoach-quy-tien-luong-nam-n1/'
				break;
			case '23':
				url = '/du-toan-chi-du-tru-quoc-gia-gd3-nam/'
				break;
			case '24':
				url = '/thuyet-minh-chi-cac-de-tai-du-an-nghien-cuu-khoa-hoc-giai-doan-3nam/'
				break;
			case '25':
				url = '/ke-hoach-xay-dung-van-ban-quy-pham-phap-luat-dtqg-giai-doan-3nam/'
				break;
			case '26':
				url = '/du-toan-chi-ung-dung-cntt-giai-doan-3nam/'
				break;
			case '27':
				url = '/du-toan-chi-mua-sam-may-moc-thiet-chi-chuyen-dung-3nam/'
				break;
			case '28':
				url = '/tong-hop-nhu-cau-chi-ngan-sach-nha-nuoc-giai-doan-3nam/'
				break;
			case '29':
				url = '/tong-hop-nhu-cau-chi-thuong-xuyen-giai-doan-3nam/'
				break;
			case '30':
				url = '/chi-tiet-nhu-cau-chi-thuong-xuyen-giai-doan-3nam/'
				break;
			case '31':
				url = '/tong-hop-muc-tieu-nhiem-vu-chu-yeu-va-nhu-cau-chi-moi-giai-doan-3nam/'
				break;
			case '32':
				url = '/ke-hoach-dao-tao-boi-duong-3-nam-tc/'
				break;
			default:
				url = null;
				break;
		}
		if (url != null) {
			this.router.navigate([
				'/qlkh-von-phi/quan-ly-lap-tham-dinh-du-toan-nsnn/' + url + id
			]);
		}
	}

	dong() {
		this.location.back()
	}

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

	//
	selectFile(files: FileList): void {
		this.fileToUpload = files.item(0);
	}

	//upload file
	async uploadFile(file: File) {
		// day file len server
		const upfile: FormData = new FormData();
		upfile.append('file', file);
		upfile.append('folder', this.soVban + '/' + this.maDonViTao);
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
}
