import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { FileFunction, GeneralFunction, NumberFunction, TableFunction } from 'src/app/Utility/func';
import { AMOUNT, DON_VI_TIEN, Utils } from "src/app/Utility/utils";
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { LapThamDinhService } from 'src/app/services/quan-ly-von-phi/lapThamDinh.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import * as uuid from "uuid";
import { BtnStatus, Doc, Form } from '../../../lap-ke-hoach-va-tham-dinh-du-toan.class';
import { UserService } from './../../../../../../../services/user.service';

export class ItemData {
	id: string;
	stt: string;
	maLvuc: string;
	tenDmuc: string;
	thienTsoBcTdiem: number;
	thienTsoBcTqGiao: number;
	thienQlPcap: number;
	thienLuongBac: number;
	thienPcapLuong: number;
	thienDgopLuong: number;
	thienKhac: number;
	dtoanTsoBcheTqGiao: number;
	dtoanQluongPcap: number;
	dtoanLuongBac: number;
	dtoanPcapLuong: number;
	dtoanDgopLuong: number;
	dtoanKhac: number;
	uocThTsoBcTqGiao: number;
	uocThTsoBcTdiem: number;
	uocThQlPcap: number;
	uocThLuongBac: number;
	uocThPCapLuong: number;
	uocThDgopLuong: number;
	uocThKhac: number;
	namKhTsoBcTqGiao: number;
	namKhQlPcap: number;
	namKhLuongBac: number;
	namKhPcapLuong: number;
	namKhDgopLuong: number;
	namKhKhac: number;
	checked: boolean;
	ghiChu: string;
}

@Component({
	selector: 'app-bieu-mau-15-1',
	templateUrl: './bieu-mau-15-1.component.html',
	styleUrls: ['../../bao-cao.component.scss']
})

export class BieuMau151Component implements OnInit {
	@Input() dataInfo;
	//thong tin chi tiet cua bieu mau
	formDetail: Form = new Form();
	total: ItemData = new ItemData();
	namBcao: number;
	maDviTien: string = '1';
	//danh muc
	donVis: any[] = [];
	linhVucChis: any[] = [];
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
		private notification: NzNotificationService,
		private modal: NzModalService,
		private userService: UserService,
		private quanLyVonPhiService: QuanLyVonPhiService,
		public numFunc: NumberFunction,
		public genFunc: GeneralFunction,
		private fileFunc: FileFunction,
		private tableFunc: TableFunction,
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
			this.scrollX = this.genFunc.tableWidth(350, 26, 1, 60);
		} else {
			this.scrollX = this.genFunc.tableWidth(350, 26, 1, 0);
		}
		const reqGetDonViCon = {
			maDviCha: this.dataInfo.maDvi,
			trangThai: '01',
		}
		await this.quanLyVonPhiService.dmDviCon(reqGetDonViCon).toPromise().then(res => {
			if (res.statusCode == 0) {
				if (this.dataInfo.capDvi == "1") {
					this.donVis = res.data.filter(e => e.tenVietTat && (e.tenVietTat?.startsWith('CDT') || e.tenVietTat?.includes('_VP') || e.tenVietTat?.includes('CNTT')));
				} else if (this.dataInfo.capDvi == "2") {
					this.donVis = res.data.filter(e => e.tenVietTat && (e.tenVietTat?.startsWith('CCDT') || e.tenVietTat?.includes('_VP') || e.tenVietTat?.includes('CNTT')));
				}
			} else {
				this.notification.error(MESSAGE.ERROR, res?.msg);
			}
		}, err => {
			this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
		})
		if (this.dataInfo?.isSynthetic) {
			this.donVis.forEach(item => {
				if (this.lstCtietBcao.findIndex(e => e.maLvuc == item.maDvi) == -1) {
					this.lstCtietBcao.push({
						... new ItemData(),
						maLvuc: item.maDvi,
						tenDmuc: item.tenDvi
					})
				}
			})
		} else {
			if (this.lstCtietBcao.length == 0) {
				this.lstCtietBcao.push({
					... new ItemData(),
					maLvuc: this.dataInfo.maDvi,
					tenDmuc: this.dataInfo?.tenDvi
				})
			}
		}

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

		// if (this.lstCtietBcao.some(e => e.ncauChiTongSo > MONEY_LIMIT)) {
		// 	this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.MONEYRANGE);
		// 	return;
		// }

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
				this.save(mcn, text);
			}
		});
	}

	// chuyển đổi stt đang được mã hóa thành dạng I, II, a, b, c, ...
	getChiMuc(str: string): string {
		str = str.substring(str.indexOf('.') + 1, str.length);
		const chiSo: string[] = str.split('.');
		const n: number = chiSo.length - 1;
		let k: number = parseInt(chiSo[n], 10);
		switch (n) {
			case 0:
				return this.genFunc.laMa(k);
			case 1:
				return chiSo[n];
			case 2:
				return chiSo[n - 1].toString() + "." + chiSo[n].toString();
			case 3:
				return String.fromCharCode(k + 96);
			case 4:
				return "-"
		}
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
		// this.sum(this.lstCtietBcao[index].stt);
		this.getTotal();
		this.updateEditCache();
	}

	changeModel(id: string): void {
		this.editCache[id].data.thienQlPcap = this.numFunc.sum([this.editCache[id].data.thienLuongBac, this.editCache[id].data.thienPcapLuong, this.editCache[id].data.thienDgopLuong, this.editCache[id].data.thienKhac]);
		this.editCache[id].data.dtoanQluongPcap = this.numFunc.sum([this.editCache[id].data.dtoanLuongBac, this.editCache[id].data.dtoanPcapLuong, this.editCache[id].data.dtoanDgopLuong, this.editCache[id].data.dtoanKhac]);
		this.editCache[id].data.uocThQlPcap = this.numFunc.sum([this.editCache[id].data.uocThLuongBac, this.editCache[id].data.uocThPCapLuong, this.editCache[id].data.uocThDgopLuong, this.editCache[id].data.uocThKhac]);
		this.editCache[id].data.namKhQlPcap = this.numFunc.sum([this.editCache[id].data.namKhLuongBac, this.editCache[id].data.namKhPcapLuong, this.editCache[id].data.namKhDgopLuong, this.editCache[id].data.namKhKhac]);
		// this.editCache[id].data.ncauChiTongSo = this.numFunc.sum([this.editCache[id].data.ncauChiTrongDoChiCs, this.editCache[id].data.ncauChiTrongDoChiMoi]);
	}

	getLowStatus(str: string) {
		const index: number = this.lstCtietBcao.findIndex(e => this.tableFunc.getHead(e.stt) == str);
		if (index == -1) {
			return false;
		}
		return true;
	}

	getTotal() {
		this.total = new ItemData();
		this.lstCtietBcao.forEach(item => {
			this.total.thienTsoBcTdiem = this.numFunc.sum([this.total.thienTsoBcTdiem, item.thienTsoBcTdiem]);
			this.total.thienTsoBcTqGiao = this.numFunc.sum([this.total.thienTsoBcTqGiao, item.thienTsoBcTqGiao]);
			this.total.thienQlPcap = this.numFunc.sum([this.total.thienQlPcap, item.thienQlPcap]);
			this.total.thienLuongBac = this.numFunc.sum([this.total.thienLuongBac, item.thienLuongBac]);
			this.total.thienPcapLuong = this.numFunc.sum([this.total.thienPcapLuong, item.thienPcapLuong]);
			this.total.thienDgopLuong = this.numFunc.sum([this.total.thienDgopLuong, item.thienDgopLuong]);
			this.total.thienKhac = this.numFunc.sum([this.total.thienKhac, item.thienKhac]);
			this.total.dtoanTsoBcheTqGiao = this.numFunc.sum([this.total.dtoanTsoBcheTqGiao, item.dtoanTsoBcheTqGiao]);
			this.total.dtoanQluongPcap = this.numFunc.sum([this.total.dtoanQluongPcap, item.dtoanQluongPcap]);
			this.total.dtoanLuongBac = this.numFunc.sum([this.total.dtoanLuongBac, item.dtoanLuongBac]);
			this.total.dtoanPcapLuong = this.numFunc.sum([this.total.dtoanPcapLuong, item.dtoanPcapLuong]);
			this.total.dtoanDgopLuong = this.numFunc.sum([this.total.dtoanDgopLuong, item.dtoanDgopLuong]);
			this.total.dtoanKhac = this.numFunc.sum([this.total.dtoanKhac, item.dtoanKhac]);
			this.total.uocThTsoBcTqGiao = this.numFunc.sum([this.total.uocThTsoBcTqGiao, item.uocThTsoBcTqGiao]);
			this.total.uocThTsoBcTdiem = this.numFunc.sum([this.total.uocThTsoBcTdiem, item.uocThTsoBcTdiem]);
			this.total.uocThQlPcap = this.numFunc.sum([this.total.uocThQlPcap, item.uocThQlPcap]);
			this.total.uocThLuongBac = this.numFunc.sum([this.total.uocThLuongBac, item.uocThLuongBac]);
			this.total.uocThPCapLuong = this.numFunc.sum([this.total.uocThPCapLuong, item.uocThPCapLuong]);
			this.total.uocThDgopLuong = this.numFunc.sum([this.total.uocThDgopLuong, item.uocThDgopLuong]);
			this.total.uocThKhac = this.numFunc.sum([this.total.uocThKhac, item.uocThKhac]);
			this.total.namKhTsoBcTqGiao = this.numFunc.sum([this.total.namKhTsoBcTqGiao, item.namKhTsoBcTqGiao]);
			this.total.namKhQlPcap = this.numFunc.sum([this.total.namKhQlPcap, item.namKhQlPcap]);
			this.total.namKhLuongBac = this.numFunc.sum([this.total.namKhLuongBac, item.namKhLuongBac]);
			this.total.namKhPcapLuong = this.numFunc.sum([this.total.namKhPcapLuong, item.namKhPcapLuong]);
			this.total.namKhDgopLuong = this.numFunc.sum([this.total.namKhDgopLuong, item.namKhDgopLuong]);
			this.total.namKhKhac = this.numFunc.sum([this.total.namKhKhac, item.namKhKhac]);
			// }
		})
	}

	addLine(id: number): void {
		const item: ItemData = {
			...new ItemData(),
			id: uuid.v4(),
			checked: false,
		};

		this.lstCtietBcao.splice(id + 1, 0, item);
		this.editCache[item.id] = {
			edit: true,
			data: { ...item }
		};
	}
	// check all
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
		this.getTotal();
	}

	// check tung dong
	updateSingleChecked(): void {
		if (this.lstCtietBcao.every(item => !item.checked)) {
			this.allChecked = false;
		} else if (this.lstCtietBcao.every(item => item.checked)) {
			this.allChecked = true;
		}
		this.getTotal();
	}

	// xoa het
	deleteAllChecked() {
		this.lstCtietBcao = this.lstCtietBcao.filter(e => !e.checked);
		this.allChecked = false;
		this.getTotal();
	}

	// xoa theo id
	deleteById(id: any): void {
		this.lstCtietBcao = this.lstCtietBcao.filter(item => item.id != id)
	}

	checkDelete(maDa: string) {
		if (!maDa) {
			return true;
		}
		return false;
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
