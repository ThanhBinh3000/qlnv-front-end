
import { DatePipe, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
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
import { MESSAGE } from '../../../../constants/message';
import { MESSAGEVALIDATE } from '../../../../constants/messageValidate';
import { DanhMucHDVService } from '../../../../services/danhMucHDV.service';
import { Utils } from "../../../../Utility/utils";
import { PHU_LUC, Role, TRANGTHAIBAOCAO, TRANGTHAIPHULUC } from '../../quan-ly-dieu-chinh-du-toan-chi-nsnn/quan-ly-dieu-chinh-du-toan-chi-nsnn.constant';


export class ItemData {
	id!: any;
	stt!: string;
	maBcao!: string;
	canBo!: string;
	trangThai!: string;
	checked!: boolean;
}



@Component({
	selector: 'app-bao-cao',
	templateUrl: './giao-nhiem-vu.component.html',
	styleUrls: ['./giao-nhiem-vu.component.scss'],
})

export class GiaoNhiemVuComponent implements OnInit {
	//thong tin dang nhap
	id!: any;
	userInfo: any;
	//thong tin chung bao cao
	maBaoCao!: string;
	namHienHanh!: number;
	ngayNhap!: string;
	nguoiNhap!: string;
	congVan!: any;
	ngayTrinhDuyet!: string;
	ngayDuyetTBP!: string;
	ngayDuyetLD!: string;
	ngayCapTrenTraKq!: string;
	trangThaiBaoCao: string = '1';
	maDviTao!: string;
	thuyetMinh: string;
  dotBcao: number =  1;
	//danh muc
	lstCtietDchinh: ItemData[] = [];
	phuLucs: any[] = PHU_LUC;
	donVis: any[] = [];
	tabs: any[] = [];
	lstDviTrucThuoc: any[] = [];
	trangThaiBaoCaos: any[] = TRANGTHAIBAOCAO;
	trangThaiBieuMaus: any[] = TRANGTHAIPHULUC;
	canBos: any[] = [
		{
			id: 51520,
			fullName: "Vũ Anh Tuấn",
		},
		{
			id: 51550,
			fullName: "Đoàn Minh Vương",
		},
		{
			id: 51480,
			fullName: "Nguyễn Xuân Hùng",
		}
	];
	//file
	lstFile: any = [];
	fileToUpload!: File;
	listFile: File[] = [];
	fileUrl: any;
	listIdDelete: string = "";
	fileList: NzUploadFile[] = [];
	//beforeUpload: any;
	listIdDeleteFiles: string = "";
	fileDetail: NzUploadFile;
	//trang thai cac nut
	status: boolean = false;
	statusEdit: boolean = false;
	statusSaveReport: boolean;
	statusDelReport: boolean;
	statusApproveReport: boolean;
	statusTBPRejectReport: boolean;
	statusTBPAcceptReport: boolean;
	statusLDRejectReport: boolean;
	statusLDAcceptReport: boolean;
	statusDVCTRejectReport: boolean;
	statusDVCTAcceptReport: boolean;
	//khac
	data: any;
	selectedIndex: number = 1;
	allChecked = false;                         // check all checkbox

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
		this.ngayNhap = this.datePipe.transform(new Date(), Utils.FORMAT_DATE_STR,)
	}

	async ngOnInit() {

		this.data = {
			lstCTiet: [],
		}

		this.id = this.routerActive.snapshot.paramMap.get('id');
		this.maDviTao = this.routerActive.snapshot.paramMap.get('maDvi');
		var nam: any = this.routerActive.snapshot.paramMap.get('namHienHanh');
		let userName = this.userService.getUserName();
		await this.getUserInfo(userName); //get user info

		if (this.id) {
			await this.getDetailReport();
		} else {
			if (this.maDviTao && nam){

			} else {
				this.phuLucs.forEach(item => {
					this.lstCtietDchinh.push({
						id: uuid.v4(),
						stt: '',
						maBcao: item.id,
						canBo: '',
						trangThai: '1',
						checked: false,
					})
				})
				this.trangThaiBaoCao = "1";
				this.nguoiNhap = this.userInfo?.fullName;
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
					this.namHienHanh = new Date().getFullYear();
				}
			}

		}

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

	//nhóm các nút chức năng --báo cáo-----
	getStatusButton() {
		let checkParent = false;
		let checkChirld = false;
		let dVi = this.donVis.find(e => e.maDvi == this.maDviTao);
		if (dVi && dVi.maDvi == this.userInfo.dvql) {
			checkChirld = true;
		}
		if (dVi && dVi.parent?.maDvi == this.userInfo.dvql) {
			checkParent = true;
		}
		const roles = new Role();
		this.statusSaveReport = roles.getRoleSaveReport(this.trangThaiBaoCao, checkChirld, this.userInfo?.roles[0]?.code);
		this.statusDelReport = roles.getRoleDelReport(this.trangThaiBaoCao, checkChirld, this.userInfo?.roles[0]?.code);
		this.statusApproveReport = roles.getRoleApproveReport(this.trangThaiBaoCao, checkChirld, this.userInfo?.roles[0]?.code);
		this.statusTBPRejectReport = roles.getRoleTBPRejectReport(this.trangThaiBaoCao, checkChirld, this.userInfo?.roles[0]?.code);
		this.statusTBPAcceptReport = roles.getRoleTBPAcceptReport(this.trangThaiBaoCao, checkChirld, this.userInfo?.roles[0]?.code);
		this.statusLDRejectReport = roles.getRoleLDRejectReport(this.trangThaiBaoCao, checkChirld, this.userInfo?.roles[0]?.code);
		this.statusLDAcceptReport = roles.getRoleLDAcceptReport(this.trangThaiBaoCao, checkChirld, this.userInfo?.roles[0]?.code);
		this.statusDVCTRejectReport = roles.getRoleDVCTRejectReport(this.trangThaiBaoCao, checkParent, this.userInfo?.roles[0]?.code);
		this.statusDVCTAcceptReport = roles.getRoleDVCTAcceptReport(this.trangThaiBaoCao, checkParent, this.userInfo?.roles[0]?.code);
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
		let checkSaveEdit;
		if (this.namHienHanh >= 3000 || this.namHienHanh < 1000) {
			this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.WRONG_FORMAT);
			return;
		}

		//upload file
		let listFile: any = [];
		for (const iterator of this.listFile) {
			listFile.push(await this.uploadFile(iterator));
		}

		// replace nhung ban ghi dc them moi id thanh null
		this.lstCtietDchinh.filter(item => {
			if (typeof item.id != "number") {
				item.id = null;
			}
		})
		let lstCtietDchinhTemp = [];
		let checkMoneyRange = true;
		if (!checkMoneyRange == true) {
			this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.MONEYRANGE);
		} else {
			// gui du lieu trinh duyet len server
			let request = {
				id: this.id,
				listIdDeletes: this.listIdDelete,
				fileDinhKems: listFile,
				listIdFiles: [],                    // id file luc get chi tiet tra ra( de backend phuc vu xoa file)
				maBcao: this.maBaoCao,
				maDvi: this.maDviTao,
				namHienHanh: this.namHienHanh,
				congVan: this.congVan,
        dotBcao: this.dotBcao,
        lstDchinh:[
          {
            giaoCho: this.data.giaoCho,
            lstCtietDchinh: lstCtietDchinhTemp
          }
        ]
			};

			//call service them moi
			this.spinner.show();
			if (this.id == null) {
				this.quanLyVonPhiService.trinhDuyetDieuChinhService(request).toPromise().then(
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
		this.lstCtietDchinh.filter(item => {
			if (!item.id) {
				item.id = uuid.v4();
			}
		});
		this.spinner.hide();
	}

	// chuc nang check role
	async onSubmit(mcn: String, lyDoTuChoi: string) {
		if (this.id) {
			const requestGroupButtons = {
				id: this.id,
				maChucNang: mcn,
				lyDoTuChoi: lyDoTuChoi,
			};
			this.spinner.show();
			await this.quanLyVonPhiService.approveBaoCao(requestGroupButtons).toPromise().then(async (data) => {
				if (data.statusCode == 0) {
					await this.getDetailReport();
					this.getStatusButton();
					if (mcn == Utils.TT_BC_8 || mcn == Utils.TT_BC_5 || mcn == Utils.TT_BC_3) {
						this.notification.success(MESSAGE.SUCCESS, MESSAGE.REVERT_SUCCESS);
					} else {
						this.notification.success(MESSAGE.SUCCESS, MESSAGE.APPROVE_SUCCESS);
					}
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
					this.lstCtietDchinh = data.data.lstCtietDchinh;
					this.lstFile = data.data.lstFile;
					this.listFile = [];
					// set thong tin chung bao cao
					this.ngayNhap = this.datePipe.transform(data.data.ngayTao, Utils.FORMAT_DATE_STR);
					this.nguoiNhap = data.data.nguoiTao;
					this.maBaoCao = data.data.maBcao;
					this.namHienHanh = data.data.namHienHanh;
					this.trangThaiBaoCao = data.data.trangThai;
					this.congVan = data.data.congVan;

					// if (this.trangThaiBanGhi == Utils.TT_BC_1 ||
					// 	this.trangThaiBanGhi == Utils.TT_BC_3 ||
					// 	this.trangThaiBanGhi == Utils.TT_BC_5 ||
					// 	this.trangThaiBanGhi == Utils.TT_BC_8 ||
					// 	this.trangThaiBanGhi == Utils.TT_BC_10) {
					// 	this.status = false;
					// } else {
					// 	this.status = true;
					// }



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
		var danhSach = this.phuLucs.filter(item => this.lstCtietDchinh.findIndex(e => e.maBcao == item.id) == -1);

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
						this.lstCtietDchinh.push({
							id: uuid.v4(),
							stt: '',
							maBcao: item.id,
							canBo: '',
							trangThai: '1',
							checked: false,
						});
					}
				})
			}
		});
	}

	// xóa với checkbox
	deleteSelected() {
		// add list delete id
		this.lstCtietDchinh.filter(item => {
			if (item.checked == true && item.id.length == 36) {
				this.listIdDelete += item.id + ","
			}
		})
		// delete object have checked = true
		this.lstCtietDchinh = this.lstCtietDchinh.filter(item => item.checked != true)
		this.allChecked = false;
	}

	// click o checkbox all
	updateAllChecked(): void {
		if (this.allChecked) {                                    // checkboxall == true thi set lai lstCtietDchinh.checked = true
			this.lstCtietDchinh = this.lstCtietDchinh.map(item => ({
				...item,
				checked: true
			}));
		} else {
			this.lstCtietDchinh = this.lstCtietDchinh.map(item => ({    // checkboxall == false thi set lai lstCtietDchinh.checked = false
				...item,
				checked: false
			}));
		}
	}

	// click o checkbox single
	updateSingleChecked(): void {
		if (this.lstCtietDchinh.every(item => !item.checked)) {           // tat ca o checkbox deu = false thi set o checkbox all = false
			this.allChecked = false;
		} else if (this.lstCtietDchinh.every(item => item.checked)) {     // tat ca o checkbox deu = true thi set o checkbox all = true
			this.allChecked = true;
		}
	}

	redirectChiTieuKeHoachNam() {
		// this.router.navigate(['/qlkh-von-phi/quan-ly-lap-tham-dinh-du-toan-nsnn/tim-kiem']);
		this.location.back();

	}

	xemChiTiet(id: string) {
		this.router.navigate([
			'/qlkh-von-phi/quan-ly-lap-tham-dinh-du-toan-nsnn/bao-cao/' + id,
		])
	}

	getStatusName(trangThai: string){
		return this.trangThaiBaoCaos.find(e => e.id == trangThai)?.tenDm;
	}

	getUnitName(maDvi: string){
		return this.donVis.find(e => e.maDvi == maDvi)?.tenDvi;
	}

	// lay trang thai cua bieu mau
	getStatusBM(trangThai: string) {
		return this.trangThaiBieuMaus.find(e => e.id == trangThai).tenDm;
	}

	closeTab({ index }: { index: number }): void {
		this.tabs.splice(index - 1, 1);
	}

	newTab(id: any): void {
		var index: number = this.tabs.findIndex(e => e.id === id);
		if (index == -1) {
			if (this.tabs.length == 1) {
				this.notification.warning(MESSAGE.WARNING, 'Đóng tab hiện tại để mở tab mới');
				return;
			}
			this.tabs.push(PHU_LUC.find(e => e.id === id));
			this.selectedIndex = this.tabs.length + 1;
		} else {
			this.selectedIndex = index + 1;
		}

	}
}
