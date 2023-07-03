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
import * as XLSX from 'xlsx'

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

	exportToExcel() {
		const header = [
			{ t: 0, b: 2, l: 0, r: 28, val: null },
			{ t: 0, b: 2, l: 0, r: 0, val: 'STT' },
			{ t: 0, b: 2, l: 1, r: 1, val: 'Lĩnh vực/Tên đơn vị' },
			{ t: 0, b: 0, l: 2, r: 8, val: 'Thực hiện năm ' + (this.namBcao - 2).toString() },
			{ t: 1, b: 2, l: 2, r: 2, val: 'Tổng số biên chế được cấp có thẩm quyền giao (Người)' },
			{ t: 1, b: 2, l: 3, r: 3, val: 'Tống số biên chế có mặt thời điểm 31/12 (Người)' },
			{ t: 1, b: 2, l: 4, r: 4, val: 'Quỹ lương, phụ cấp và các khoản đóng góp theo lương theo biên chế có mặt 31/12' },
			{ t: 1, b: 1, l: 5, r: 8, val: 'Trong đó' },
			{ t: 2, b: 2, l: 5, r: 5, val: 'Lương theo ngạch, bậc' },
			{ t: 2, b: 2, l: 6, r: 6, val: 'Phụ cấp theo lương' },
			{ t: 2, b: 2, l: 7, r: 7, val: 'Các khoản đóng góp theo lương' },
			{ t: 2, b: 2, l: 8, r: 8, val: 'Khác' },
			{ t: 0, b: 0, l: 9, r: 14, val: 'Dự toán năm ' + (this.namBcao - 1).toString() },
			{ t: 1, b: 2, l: 9, r: 9, val: 'Tổng số biên chế được cấp có thẩm quyền giao (Người)' },
			{ t: 1, b: 2, l: 10, r: 10, val: 'Quỹ lương, phụ cấp và các khoản đóng góp theo lương (Người)' },
			{ t: 1, b: 1, l: 11, r: 14, val: 'Trong đó' },
			{ t: 2, b: 2, l: 11, r: 11, val: 'Lương theo ngạch, bậc' },
			{ t: 2, b: 2, l: 12, r: 12, val: 'Phụ cấp theo lương' },
			{ t: 2, b: 2, l: 13, r: 13, val: 'Các khoản đóng góp theo lương' },
			{ t: 2, b: 2, l: 14, r: 14, val: 'Khác' },
			{ t: 0, b: 0, l: 15, r: 21, val: 'Ước thực hiện năm ' + (this.namBcao - 1).toString() },
			{ t: 1, b: 2, l: 15, r: 15, val: 'Tổng số biên chế được cấp có thẩm quyền giao (Người)' },
			{ t: 1, b: 2, l: 16, r: 16, val: 'Tống số biên chế có mặt thời điểm 31/12 (Người)' },
			{ t: 1, b: 2, l: 17, r: 17, val: 'Quỹ lương, phụ cấp và các khoản đóng góp theo lương theo biên chế có mặt 31/12' },
			{ t: 1, b: 1, l: 18, r: 21, val: 'Trong đó' },
			{ t: 2, b: 2, l: 18, r: 18, val: 'Lương theo ngạch, bậc' },
			{ t: 2, b: 2, l: 19, r: 19, val: 'Phụ cấp theo lương' },
			{ t: 2, b: 2, l: 20, r: 20, val: 'Các khoản đóng góp theo lương' },
			{ t: 2, b: 2, l: 21, r: 21, val: 'Khác' },
			{ t: 0, b: 0, l: 22, r: 27, val: 'Dự toán năm ' + this.namBcao.toString() },
			{ t: 1, b: 2, l: 22, r: 22, val: 'Tổng số biên chế được cấp có thẩm quyền giao (Người)' },
			{ t: 1, b: 2, l: 23, r: 23, val: 'Quỹ lương, phụ cấp và các khoản đóng góp theo lương (Người)' },
			{ t: 1, b: 1, l: 24, r: 27, val: 'Trong đó' },
			{ t: 2, b: 2, l: 24, r: 24, val: 'Lương theo ngạch, bậc' },
			{ t: 2, b: 2, l: 25, r: 25, val: 'Phụ cấp theo lương' },
			{ t: 2, b: 2, l: 26, r: 26, val: 'Các khoản đóng góp theo lương' },
			{ t: 2, b: 2, l: 27, r: 27, val: 'Khác' },
			{ t: 0, b: 2, l: 28, r: 28, val: 'Ghi chú' },
		]
		const fieldOrder = ['stt', 'tenDmuc', 'thienTsoBcTqGiao', 'thienTsoBcTdiem', 'thienQlPcap', 'thienLuongBac', 'thienPcapLuong', 'thienDgopLuong', 'thienKhac', 'dtoanTsoBcheTqGiao',
			'dtoanQluongPcap', 'dtoanLuongBac', 'dtoanPcapLuong', 'dtoanDgopLuong', 'dtoanKhac', 'uocThTsoBcTqGiao', 'uocThTsoBcTdiem', 'uocThQlPcap', 'uocThLuongBac', 'uocThPCapLuong',
			'uocThDgopLuong', 'uocThKhac', 'namKhTsoBcTqGiao', 'namKhQlPcap', 'namKhLuongBac', 'namKhPcapLuong', 'namKhDgopLuong', 'namKhKhac', 'ghiChu']
		const filterData = this.lstCtietBcao.map(item => {
			const row: any = {};
			fieldOrder.forEach(field => {
				row[field] = item[field]
			})
			return row;
		})
		let ind = 1;
		filterData.forEach(item => {
			item.stt = ind.toString();
			ind += 1;
		})

		const workbook = XLSX.utils.book_new();
		const worksheet = this.genFunc.initExcel(header);
		XLSX.utils.sheet_add_json(worksheet, filterData, { skipHeader: true, origin: this.genFunc.coo(header[0].l, header[0].b + 1) })
		XLSX.utils.book_append_sheet(workbook, worksheet, 'Dữ liệu');
		XLSX.writeFile(workbook, this.dataInfo.maBcao + '_TT342_15.1.xlsx');
	}
}
