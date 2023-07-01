import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { FileFunction, GeneralFunction, NumberFunction } from 'src/app/Utility/func';
import { AMOUNT, DON_VI_TIEN, LTD, MONEY_LIMIT, Utils } from "src/app/Utility/utils";
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { LapThamDinhService } from 'src/app/services/quan-ly-von-phi/lapThamDinh.service';
import { UserService } from 'src/app/services/user.service';
import * as uuid from "uuid";
import { BtnStatus, Doc, Form } from '../../../lap-ke-hoach-va-tham-dinh-du-toan.class';

export class ItemData {
	id: string;
	stt: string;
	matHang: string;
	tenDmuc: string;
	maDviTinh: string;
	khSluong: number;
	khTtien: number;
	uocThSluong: number;
	uocThTtien: number;
	tonKho: number;
	tongMucDtru: number;
	namKhSluong: number;
	namKhTtien: number;
	tdinhSluong: number;
	tdinhTtien: number;
	checked: boolean;
	isDelete: false;
	chenhLech: number;
	ghiChu: string;
	ykienDviCtren: string;
}

@Component({
	selector: 'app-bieu-mau-16-0',
	templateUrl: './bieu-mau-16-0.component.html',
	styleUrls: ['../../bao-cao.component.scss']
})
export class BieuMau160Component implements OnInit {
	@Input() dataInfo;
	//thong tin chi tiet cua bieu mau
	formDetail: Form = new Form();
	total: ItemData = new ItemData();
	maDviTien: string = '1';
	namBcao: number;
	//danh muc
	linhVucChis: any[] = [];
	listVatTu: any[] = [];
	listVatTuFull: any[] = [];
	lstCtietBcao: ItemData[] = [];
	donViTiens: any[] = DON_VI_TIEN;
	//trang thai cac nut
	status: BtnStatus = new BtnStatus();
	editMoneyUnit = false;
	isDataAvailable = false;
	//nho dem
	editCache: { [key: string]: { edit: boolean; data: ItemData } } = {};
	allChecked = false;
	amount = AMOUNT;
	scrollX: string;

	fileList: NzUploadFile[] = [];
	listFile: File[] = [];
	listIdDeleteFiles: string[] = [];

	beforeUpload = (file: NzUploadFile): boolean => {
		this.fileList = this.fileList.concat(file);
		return false;
	};

	// them file vao danh sach
	handleUpload(): void {
		this.fileList.forEach((file: any) => {
			const id = file?.lastModified.toString();
			this.formDetail.lstFiles.push({
				... new Doc(),
				id: id,
				fileName: file?.name
			});
			this.listFile.push(file);
		});
		this.fileList = [];
	};

	constructor(
		private _modalRef: NzModalRef,
		private spinner: NgxSpinnerService,
		private lapThamDinhService: LapThamDinhService,
		public userService: UserService,
		private danhMucService: DanhMucHDVService,
		private notification: NzNotificationService,
		private modal: NzModalService,
		public numFunc: NumberFunction,
		public genFunc: GeneralFunction,
		private fileFunc: FileFunction,
	) { }

	async ngOnInit() {
		this.initialization().then(() => {
			this.isDataAvailable = true;
		})
	}

	async initialization() {
		this.spinner.show();
		Object.assign(this.status, this.dataInfo.status);
		await this.getFormDetail();
		this.namBcao = this.dataInfo.namBcao;
		if (this.status) {
			this.scrollX = this.genFunc.tableWidth(350, 9, 1, 160);
		} else {
			if (this.status.editAppVal) {
				this.scrollX = this.genFunc.tableWidth(350, 12, 2, 60);
			} else if (this.status.viewAppVal) {
				this.scrollX = this.genFunc.tableWidth(350, 12, 1, 0);
			} else {
				this.scrollX = this.genFunc.tableWidth(350, 9, 1, 0);
			}
		}
		await this.getListVtu()
		await this.addListVatTu()

		this.getTotal();
		this.updateEditCache();
		this.getStatusButton();
		this.spinner.hide();
	}

	getStatusButton() {
		this.status.ok = this.status.ok && (this.formDetail.trangThai == "2" || this.formDetail.trangThai == "5");
	}

	async getFormDetail() {
		await this.lapThamDinhService.ctietBieuMau(this.dataInfo.id).toPromise().then(
			data => {
				if (data.statusCode == 0) {
					this.formDetail = data.data;
					this.formDetail.maDviTien = '1';
					this.lstCtietBcao = this.formDetail.lstCtietLapThamDinhs;
					this.listFile = [];
					this.getStatusButton();
				} else {
					this.notification.error(MESSAGE.ERROR, data?.msg);
				}
			},
			err => {
				this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
			}
		)
	}

	// luu
	async save(trangThai: string, lyDoTuChoi: string) {
		if (this.lstCtietBcao.some(e => this.editCache[e.id].edit)) {
			this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTSAVE);
			return;
		}

		if (this.lstCtietBcao.some(e => e.khTtien > MONEY_LIMIT || e.namKhTtien > MONEY_LIMIT || e.tdinhTtien > MONEY_LIMIT || e.uocThTtien > MONEY_LIMIT)) {
			this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.MONEYRANGE);
			return;
		}

		if (this.listFile.some(file => file.size > Utils.FILE_SIZE)) {
			this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.OVER_SIZE);
			return;
		}

		const lstCtietBcaoTemp: ItemData[] = [];
		this.lstCtietBcao.forEach(item => {
			lstCtietBcaoTemp.push({
				...item,
				id: item.id?.length == 38 ? null : item.id,
			})
		})

		// if (!this.status.viewAppVal) {
		// 	lstCtietBcaoTemp?.forEach(item => {
		// 		item.tdinhSluong = item.namKhSluong;
		// 		item.tdinhTtien = item.namKhTtien;
		// 	})
		// }

		const request = JSON.parse(JSON.stringify(this.formDetail));

		request.fileDinhKems = [];
		for (let iterator of this.listFile) {
			request.fileDinhKems.push(await this.fileFunc.uploadFile(iterator, this.dataInfo.path));
		}

		request.lstCtietLapThamDinhs = lstCtietBcaoTemp;
		request.trangThai = trangThai;

		if (lyDoTuChoi) {
			request.lyDoTuChoi = lyDoTuChoi;
		}

		this.spinner.show();
		this.lapThamDinhService.updateLapThamDinh(request).toPromise().then(
			async data => {
				if (data.statusCode == 0) {
					this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
					this._modalRef.close({
						trangThai: data.data.trangThai,
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
				this.save(mcn, text);
			}
		});
	}

	async getListVtu() {
		//lay danh sach vat tu
		await this.danhMucService.dMVatTu().toPromise().then(res => {
			if (res.statusCode == 0) {
				this.listVatTu = res.data;

			} else {
				this.notification.error(MESSAGE.ERROR, res?.msg);
			}
		}, err => {
			this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
		})
	};

	async addListVatTu() {
		const lstVtuCon1 = []
		const lstVtuCon2 = []

		this.listVatTu.forEach(vtu => {
			vtu?.child.forEach(vtuCon => {
				const maCha = vtuCon?.ma.slice(0, -2)
				lstVtuCon1.push({
					id: vtuCon.ma,
					maVtu: vtuCon.ma,
					tenDm: vtuCon.ten,
					maDviTinh: vtuCon.maDviTinh,
					maCha: maCha,
					level: Number(vtuCon.cap),
				})

				vtuCon?.child.forEach(vtuConn => {
					const maCha = vtuConn?.ma.slice(0, -2)
					lstVtuCon2.push({
						id: vtuConn.ma,
						maVtu: vtuConn.ma,
						tenDm: vtuConn.ten,
						maDviTinh: vtuConn.maDviTinh,
						maCha: maCha,
						level: Number(vtuConn.cap),
					})
				})
			})
		})
		const mangGop12 = lstVtuCon1.concat(lstVtuCon2)
		this.listVatTuFull = this.listVatTuFull.concat(mangGop12)
		this.listVatTuFull.forEach(item => {
			if (item.level.length == 2) {
				item.level = item.level.slice(0, -1)
			}
		})
		this.linhVucChis = this.listVatTuFull;
	}

	changeMatHang(matHang: any, id: any) {
		const index = this.lstCtietBcao.findIndex(item => item.id === id); // lay vi tri hang minh sua
		const donViTinh = this.linhVucChis.find(vtu => vtu.id == matHang)?.maDviTinh;
		this.editCache[id].data.maDviTinh = donViTinh;
		this.lstCtietBcao[index].maDviTinh = donViTinh;
	}

	updateSingleChecked(): void {
		if (this.lstCtietBcao.every(item => !item.checked)) {
			this.allChecked = false;
		} else if (this.lstCtietBcao.every(item => item.checked)) {
			this.allChecked = true;
		}
	}

	deleteById(id: any): void {
		this.lstCtietBcao = this.lstCtietBcao.filter(item => item.id != id)
	}

	checkDeleteStatus(item: any) {
		const isSynthetic = item.tongHopTu != "[]";
		return Utils.statusDelete.includes(item.trangThai) &&
			(isSynthetic ? this.userService.isAccessPermisson(LTD.DELETE_SYNTHETIC_REPORT) : this.userService.isAccessPermisson(LTD.DELETE_REPORT));
	}

	addLine(id: any) {
		const item: ItemData = {
			... new ItemData(),
			id: uuid.v4(),
		};

		this.lstCtietBcao.splice(id, 0, item);
		this.editCache[item.id] = {
			edit: true,
			data: { ...item }
		};
	}

	updateAllChecked(): void {
		if (this.allChecked) {
			this.lstCtietBcao = this.lstCtietBcao.map(item => ({
				...item,
				checked: true
			}));
		} else {
			this.lstCtietBcao = this.lstCtietBcao.map(item => ({
				...item,
				checked: false
			}));
		}
	}

	deleteAllChecked() {
		this.lstCtietBcao = this.lstCtietBcao.filter(e => !e.checked);
		this.allChecked = false;
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

	// start edit
	startEdit(id: string): void {
		this.editCache[id].edit = true;
	}

	// huy thay doi
	cancelEdit(id: string): void {
		const index = this.lstCtietBcao.findIndex(item => item.id === id);
		// lay vi tri hang minh sua
		this.editCache[id] = {
			data: { ...this.lstCtietBcao[index] },
			edit: false
		};
	}

	// luu thay doi
	saveEdit(id: string): void {
		const index = this.lstCtietBcao.findIndex(item => item.id === id); // lay vi tri hang minh sua
		Object.assign(this.lstCtietBcao[index], this.editCache[id].data); // set lai data cua lstCtietBcao[index] = this.editCache[id].data
		this.editCache[id].edit = false; // CHUYEN VE DANG TEXT
		this.getTotal()
		this.lstCtietBcao.forEach(item => {
			const tenDmuc = this.listVatTuFull.find(itm => itm.id == item.matHang)?.tenDm
			item.tenDmuc = tenDmuc
		})
		this.updateEditCache();
	}

	changeModel(id: string): void {
		this.editCache[id].data.chenhLech = this.editCache[id].data.tdinhTtien - this.editCache[id].data.khTtien
	}

	getTotal() {
		this.total = new ItemData();
		this.lstCtietBcao.forEach(item => {
			this.total.khTtien = this.numFunc.sum([this.total.khTtien, item.khTtien])
			this.total.uocThTtien = this.numFunc.sum([this.total.uocThTtien, item.uocThTtien])
			this.total.namKhTtien = this.numFunc.sum([this.total.namKhTtien, item.namKhTtien])
			this.total.tdinhTtien = this.numFunc.sum([this.total.tdinhTtien, item.tdinhTtien])
		})
	}

	checkEdit(stt: string) {
		const lstTemp = this.lstCtietBcao.filter(e => e.stt !== stt);
		return lstTemp.every(e => !e.stt.startsWith(stt));
	}

	// xoa file trong bang file
	deleteFile(id: string): void {
		this.formDetail.lstFiles = this.formDetail.lstFiles.filter((a: any) => a.id !== id);
		this.listFile = this.listFile.filter((a: any) => a?.lastModified.toString() !== id);
		this.formDetail.listIdDeleteFiles.push(id);
	}

	async downloadFile(id: string) {
		let file: any = this.listFile.find(element => element?.lastModified.toString() == id);
		let doc: any = this.formDetail.lstFiles.find(element => element?.id == id);
		await this.fileFunc.downloadFile(file, doc);
	}
}

