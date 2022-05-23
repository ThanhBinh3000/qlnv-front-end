import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import * as fileSaver from 'file-saver';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import * as uuid from "uuid";
import { DanhMucHDVService } from '../../../../services/danhMucHDV.service';
import { DON_VI_TIEN, Utils } from "../../../../Utility/utils";
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MESSAGE } from '../../../../constants/message';
import { stringify } from 'querystring';
import { NzModalService } from 'ng-zorro-antd/modal';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { DialogDanhSachMuaTbiVtuComponent } from 'src/app/components/dialog/dialog-quan-ly-ke-hoach-cap-von-phi-hang/dialog-quan-ly-cap-nguon-von-chi/dialog-danh-sach-mua-tbi-vtu/dialog-danh-sach-mua-tbi-vtu.component';

export class ItemData {
	maVattuLuongThuc!: string;
	maDviTinh!: string;
	soLuong!: number;
	donGia!: number;
	maDviTien!: string;
	thanhTien!: number;
	id!: any;
	stt!: String;
	checked!: boolean;
}

export class HopDong {
	id!: any;
	stt!: string;
	checked!: boolean;
	maHd!: string;
	tenHd!: string;
	maGoiThau!: string;
	ngayHd!: string;
	gtriHd!: number;
}

@Component({
	selector: 'app-lap-de-nghi-cap-von-mua-vat-tu-thiet-bi',
	templateUrl: './lap-de-nghi-cap-von-mua-vat-tu-thiet-bi.component.html',
	styleUrls: ['./lap-de-nghi-cap-von-mua-vat-tu-thiet-bi.component.scss']
})
export class LapDeNghiCapVonMuaVatTuThietBiComponent implements OnInit {

	userInfo!: any;
	maDviTao!: string;
	soQd!: string;
	ngayQd!: string;
	soCanCuQd!: string;
	ngayCanCuQd!: string;
	dtoanDaCap: number = 0;
	maHdong: string = "";
	veViec!: string;
	status: boolean = false;

	vatTus: any = [];
	dviTinhs: any = [];
	dviTiens: any = DON_VI_TIEN;
	donVis: any[] = [];

	lstCtietBcao: ItemData[] = [];
	lstHopDong: HopDong[] = [];

	id!: any;                                   // id truyen tu router
	chiTietBcaos: any;                          // thong tin chi tiet bao cao
	lstFile: any = [];                          // list File de day vao api
	tongGtriHd: number = 0;

	fileToUpload!: File;                        // file tai o input
	listFile: File[] = [];                      // list file chua ten va id de hien tai o input
	box1 = true;                                // bien de an hien box1
	fileUrl: any;                               // url
	listIdDelete: string = "";                  // list id delete

	listIdDeletes: string;                        // id file luc call chi tiet

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
		private danhMucService: DanhMucHDVService,
		private userService: UserService,
		private notification: NzNotificationService,
		private modal: NzModalService,
	) {
	}


	async ngOnInit() {
		this.id = this.routerActive.snapshot.paramMap.get('id');
		let userName = this.userService.getUserName();
		await this.getUserInfo(userName); //get user info
		if (this.id) {
			await this.getDetailReport();
		} else {
			this.maDviTao = this.userInfo?.dvql;
			this.spinner.show();
		}

		//GET danh muc vat tu
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

		//get don vi tinh
		this.danhMucService.dMDviTinh().toPromise().then(
			(data) => {
				if (data.statusCode == 0) {
					this.dviTinhs = data.data?.content;
				} else {
					this.notification.error(MESSAGE.ERROR, data?.msg);
				}
			},
			(err) => {
				this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
			}
		);

		//get don vi tinh
		this.danhMucService.dMDonVi().toPromise().then(
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

		this.spinner.hide();
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
		this.lstCtietBcao = [];
		this.lstFile = [];
		this.listFile = []
	}

	// luu
	async luu() {
		let listFile: any = [];
		for (const iterator of this.listFile) {
			listFile.push(await this.uploadFile(iterator));
		}

		// replace nhung ban ghi dc them moi id thanh null
		this.lstCtietBcao.filter(item => {
			if (item.id?.length == 38) {
				item.id = null;
			}
		})

		// gui du lieu trinh duyet len server
		let request = {
			id: this.id,
			fileDinhKems: listFile,
			listIdDeletes: this.listIdDeletes,              
			listCtiet: this.lstCtietBcao,
			maDvi: this.maDviTao,
			soQd: this.soQd,
			ngayQd: this.datePipe.transform(this.ngayQd, Utils.FORMAT_DATE_STR),
			soCanCuQd: this.soCanCuQd,
			ngayCanCuQd: this.datePipe.transform(this.ngayCanCuQd, Utils.FORMAT_DATE_STR),
			dtoanDaCap: this.dtoanDaCap,
			maHdong: this.maHdong,
			maGoiThau: this.soCanCuQd,
			vanBan: this.veViec,
			loaiCapVon: "1",
		};

		//call service them moi
		this.spinner.show();
		if (this.id == null) {
			this.quanLyVonPhiService.themDeNghiCapVon(request).subscribe(
				data => {
					if (data.statusCode == 0) {
						this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
					} else {
						this.notification.error(MESSAGE.ERROR, data?.msg);
					}
				},
				err => {
					this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
					console.log(err);
				},
			);
		} else {
			this.quanLyVonPhiService.updatelist(request).subscribe(res => {
				if (res.statusCode == 0) {
					this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
				} else {
					this.notification.error(MESSAGE.ERROR, res?.msg);
				}
			})
		}
		this.lstCtietBcao.filter(item => {
			if (!item.id) {
				item.id = uuid.v4()+'FE';
			}
		});
		this.spinner.hide();
	}

	// chuc nang check role
	onSubmit(mcn: String, lyDoTuChoi: string) {
		const requestGroupButtons = {
			id: this.id,
			maChucNang: mcn,
			lyDotuChoi: lyDoTuChoi,
		};
		this.spinner.show();
		this.quanLyVonPhiService.approveBaoCao(requestGroupButtons).toPromise().then(
			(data) => {
				if (data.statusCode == 0) {
					//this.getDetailReport();
					this.notification.success(MESSAGE.SUCCESS, MESSAGE.APPROVE_SUCCESS);
				} else {
					this.notification.error(MESSAGE.ERROR, data?.msg);
				}
			},
			err => {
				this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
			}
		);
		this.spinner.hide();
	}

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
	getDetailReport() {
		this.spinner.show();
		this.quanLyVonPhiService.bCLapThamDinhDuToanChiTiet(this.id).subscribe(
			(data) => {
				if (data.statusCode == 0) {
					this.lstCtietBcao = data.data.lstCtietBcao;
					this.lstFile = data.data.lstFile;

					// set thong tin chung bao cao
					this.soQd = data.data.soQd;
					this.soCanCuQd = data.data.soCanCuQd;
					this.maDviTao = data.data.maDvi;
					this.ngayQd = data.data.ngayQd;
					this.ngayCanCuQd = data.data.ngayCanCuQd;
					this.dtoanDaCap = data.data.dtoanDaCap;

					// set list id file ban dau
					this.lstFile.filter(item => {
						this.listIdDeletes += item.id + ",";
					})
				} else {
					this.notification.error(MESSAGE.ERROR, data?.msg);
				}
			},
			(err) => {
				console.log(err);
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
		upfile.append('folder', this.maDviTao + '/' + this.soQd + '/');
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
		var item: ItemData = {
			maVattuLuongThuc: "",
			maDviTinh: "",
			soLuong: 0,
			donGia: 0,
			maDviTien: "",
			thanhTien: 0,
			id: uuid.v4()+'FE',
			stt: "",
			checked: false,
		};
		this.lstCtietBcao.splice(id, 0, item);
		this.editCache[item.id] = {
			edit: true,
			data: { ...item }
		};
	}

	startEdit(id: string): void {
		this.editCache[id].edit = true;
	}

	// huy thay doi
	cancelEdit(id: string): void {
		const index = this.lstCtietBcao.findIndex(item => item.id === id);  // lay vi tri hang minh sua
		this.editCache[id] = {
			data: { ...this.lstCtietBcao[index] },
			edit: false
		};
	}

	// luu thay doi
	saveEdit(id: string): void {
		this.editCache[id].data.checked = this.lstCtietBcao.find(item => item.id === id).checked; // set checked editCache = checked lstCtietBcao
		const index = this.lstCtietBcao.findIndex(item => item.id === id);   // lay vi tri hang minh sua
		Object.assign(this.lstCtietBcao[index], this.editCache[id].data); // set lai data cua lstCtietBcao[index] = this.editCache[id].data
		this.editCache[id].edit = false;  // CHUYEN VE DANG TEXT
	}

	// gan editCache.data == lstCtietBcao
	updateEditCache(): void {
		this.lstCtietBcao.forEach(item => {
			this.editCache[item.id] = {
				edit: false,
				data: { ...item }
			};
		});
	}


	// xoa dong
	deleteById(id: any): void {
		this.lstCtietBcao = this.lstCtietBcao.filter(item => item.id != id)
		if (id?.length == 36) {
			this.listIdDelete += id + ",";
		}
	}

	// xóa với checkbox
	deleteSelected() {
		// add list delete id
		this.lstCtietBcao.filter(item => {
			if (item.checked == true && item?.id?.length == 36) {
				this.listIdDelete += item.id + ","
			}
		})
		// delete object have checked = true
		this.lstCtietBcao = this.lstCtietBcao.filter(item => item.checked != true)
		this.allChecked = false;
	}

	// xoa file trong bang file
	deleteFile(id: string): void {
		this.lstFile = this.lstFile.filter((a: any) => a.id !== id);
		this.listFile = this.listFile.filter((a: any) => a?.lastModified.toString() !== id);
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
		if (this.allChecked) {                                    // checkboxall == true thi set lai lstCtietBcao.checked = true
			this.lstCtietBcao = this.lstCtietBcao.map(item => ({
				...item,
				checked: true
			}));
		} else {
			this.lstCtietBcao = this.lstCtietBcao.map(item => ({    // checkboxall == false thi set lai lstCtietBcao.checked = false
				...item,
				checked: false
			}));
		}
	}

	// click o checkbox single
	updateSingleChecked(): void {
		if (this.lstCtietBcao.every(item => !item.checked)) {           // tat ca o checkbox deu = false thi set o checkbox all = false
			this.allChecked = false;
			this.indeterminate = false;
		} else if (this.lstCtietBcao.every(item => item.checked)) {     // tat ca o checkbox deu = true thi set o checkbox all = true
			this.allChecked = true;
			this.indeterminate = false;
		} else {                                                        // o checkbox vua = false, vua = true thi set o checkbox all = indeterminate
			this.indeterminate = true;
		}
	}

	redirectChiTieuKeHoachNam() {
		this.router.navigate(['/kehoach/chi-tieu-ke-hoach-nam-cap-tong-cuc']);
	}

	changeModel(id: any) {
		this.editCache[id].data.thanhTien = this.editCache[id].data.soLuong * this.editCache[id].data.donGia;
	}

	getContract() {
		const modalIn = this.modal.create({
			nzTitle: 'Danh sách hợp đồng',
			nzContent: DialogDanhSachMuaTbiVtuComponent,
			nzMaskClosable: false,
			nzClosable: false,
			nzWidth: '1000px',
			nzFooter: null,
			nzComponentParams: {
				maGoiThau: this.soCanCuQd
			},
		});
		modalIn.afterClose.subscribe((res) => {
			if (res) {
				this.lstHopDong = res.filter(e => e.checked === true);
				this.tongGtriHd = 0;
				this.lstHopDong.forEach(item => {
					this.tongGtriHd += item.gtriHd;
					this.maHdong += item.maHd + ",";
				})
			}
		});
	}

	getUnitName(){
		return this.donVis.find(e => e.maDvi === this.maDviTao)?.tenDvi;
	}
}
