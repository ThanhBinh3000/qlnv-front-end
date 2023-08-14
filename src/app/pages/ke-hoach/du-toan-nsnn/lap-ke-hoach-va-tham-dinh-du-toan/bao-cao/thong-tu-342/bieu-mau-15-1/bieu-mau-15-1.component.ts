import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { Operator, Status, Table, Utils } from "src/app/Utility/utils";
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { LapThamDinhService } from 'src/app/services/quan-ly-von-phi/lapThamDinh.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import * as uuid from "uuid";
import * as XLSX from 'xlsx';
import { BtnStatus, Doc, Form } from '../../../lap-ke-hoach-va-tham-dinh-du-toan.constant';

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

	constructor(data: Partial<Pick<ItemData, keyof ItemData>>) {
		Object.assign(this, data);
	}

	changeModel() {
		this.thienQlPcap = Operator.sum([this.thienLuongBac, this.thienPcapLuong, this.thienDgopLuong, this.thienKhac]);
		this.dtoanQluongPcap = Operator.sum([this.dtoanLuongBac, this.dtoanPcapLuong, this.dtoanDgopLuong, this.dtoanKhac]);
		this.uocThQlPcap = Operator.sum([this.uocThLuongBac, this.uocThPCapLuong, this.uocThDgopLuong, this.uocThKhac]);
		this.namKhQlPcap = Operator.sum([this.namKhLuongBac, this.namKhPcapLuong, this.namKhDgopLuong, this.namKhKhac]);
	}

	upperBound() {
		return this.thienQlPcap > Utils.MONEY_LIMIT || this.dtoanQluongPcap > Utils.MONEY_LIMIT || this.uocThQlPcap > Utils.MONEY_LIMIT;
	}

	clear() {
		Object.keys(this).forEach(key => {
			if (typeof this[key] === 'number' && key != 'level') {
				this[key] = null;
			}
		})
	}

	sum(data: ItemData) {
		Object.keys(data).forEach(key => {
			if (key != 'level' && (typeof this[key] == 'number' || typeof data[key] == 'number')) {
				this[key] = Operator.sum([this[key], data[key]]);
			}
		})
	}

	request() {
		const temp = Object.assign({}, this);
		if (this.id?.length == 38) {
			temp.id = null;
		}
		return temp;
	}
}

@Component({
	selector: 'app-bieu-mau-15-1',
	templateUrl: './bieu-mau-15-1.component.html',
	styleUrls: ['../../bao-cao.component.scss']
})

export class BieuMau151Component implements OnInit {
	@Input() dataInfo;
	Op = new Operator('1');
	Utils = Utils;
	//thong tin chi tiet cua bieu mau
	formDetail: Form = new Form();
	total: ItemData = new ItemData({});
	namBcao: number;
	maDviTien: string = '1';
	//danh muc
	donVis: any[] = [];
	linhVucChis: any[] = [];
	lstCtietBcao: ItemData[] = [];
	//trang thai cac nut
	status: BtnStatus = new BtnStatus();
	editMoneyUnit = false;
	isDataAvailable = false;
	//nho dem
	editCache: { [key: string]: { edit: boolean; data: ItemData } } = {};
	allChecked = false;
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
		private quanLyVonPhiService: QuanLyVonPhiService,
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
			this.scrollX = Table.tableWidth(350, 26, 1, 60);
		} else {
			this.scrollX = Table.tableWidth(350, 26, 1, 0);
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
					this.lstCtietBcao.push(new ItemData({
						id: uuid.v4() + 'FE',
						maLvuc: item.maDvi,
						tenDmuc: item.tenDvi
					}))
				}
			})
		} else {
			if (this.lstCtietBcao.length == 0) {
				this.lstCtietBcao.push(new ItemData({
					id: uuid.v4() + 'FE',
					maLvuc: this.dataInfo.maDvi,
					tenDmuc: this.dataInfo?.tenDvi
				}))
			}
		}

		this.getTotal();
		this.updateEditCache();
		this.getStatusButton();
		this.spinner.hide();
	}

	getStatusButton() {
		this.status.ok = this.status.ok && (this.formDetail.trangThai == Status.NOT_RATE || this.formDetail.trangThai == Status.COMPLETE);
	}

	async getFormDetail() {
		await this.lapThamDinhService.ctietBieuMau(this.dataInfo.id).toPromise().then(
			data => {
				if (data.statusCode == 0) {
					this.formDetail = data.data;
					this.formDetail.maDviTien = '1';
					this.formDetail.lstCtietLapThamDinhs.forEach(item => {
						this.lstCtietBcao.push(new ItemData(item))
					})
					this.formDetail.listIdDeleteFiles = [];
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

		if (this.lstCtietBcao.some(e => e.upperBound())) {
			this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.MONEYRANGE);
			return;
		}

		if (this.listFile.some(file => file.size > Utils.FILE_SIZE)) {
			this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.OVER_SIZE);
			return;
		}

		const lstCtietBcaoTemp: ItemData[] = [];
		this.lstCtietBcao.forEach(item => {
			lstCtietBcaoTemp.push(item.request())
		})

		const request = JSON.parse(JSON.stringify(this.formDetail));

		request.fileDinhKems = [];
		for (let iterator of this.listFile) {
			request.fileDinhKems.push(await this.quanLyVonPhiService.upFile(iterator, this.dataInfo.path));
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
						lyDoTuChoi: data.data.lyDoTuChoi,
						thuyetMinh: data.data.thuyetMinh,
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
				data: new ItemData(item),
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
			data: new ItemData(this.lstCtietBcao[index]),
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

	getTotal() {
		this.total.clear();
		this.lstCtietBcao.forEach(item => {
			this.total.sum(item);
		})
	}

	addLine(id: number): void {
		const item: ItemData = new ItemData({
			id: uuid.v4() + 'FE',
			checked: false,
		});

		this.lstCtietBcao.splice(id + 1, 0, item);
		this.editCache[item.id] = {
			edit: true,
			data: new ItemData(item)
		};
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
		await this.quanLyVonPhiService.downFile(file, doc);
	}

	exportToExcel() {
		const header = [
			{ t: 0, b: 6, l: 0, r: 28, val: null },
			{ t: 0, b: 0, l: 0, r: 1, val: this.dataInfo.tenPl },
			{ t: 1, b: 1, l: 0, r: 8, val: this.dataInfo.tieuDe },
			{ t: 2, b: 2, l: 0, r: 8, val: this.dataInfo.congVan },
			{ t: 4, b: 6, l: 0, r: 0, val: 'STT' },
			{ t: 4, b: 6, l: 1, r: 1, val: 'Lĩnh vực/Tên đơn vị' },
			{ t: 4, b: 4, l: 2, r: 8, val: 'Thực hiện năm ' + (this.namBcao - 2).toString() },
			{ t: 5, b: 6, l: 2, r: 2, val: 'Tổng số biên chế được cấp có thẩm quyền giao (Người)' },
			{ t: 5, b: 6, l: 3, r: 3, val: 'Tống số biên chế có mặt thời điểm 31/12 (Người)' },
			{ t: 5, b: 6, l: 4, r: 4, val: 'Quỹ lương, phụ cấp và các khoản đóng góp theo lương theo biên chế có mặt 31/12' },
			{ t: 5, b: 5, l: 5, r: 8, val: 'Trong đó' },
			{ t: 6, b: 6, l: 5, r: 5, val: 'Lương theo ngạch, bậc' },
			{ t: 6, b: 6, l: 6, r: 6, val: 'Phụ cấp theo lương' },
			{ t: 6, b: 6, l: 7, r: 7, val: 'Các khoản đóng góp theo lương' },
			{ t: 6, b: 6, l: 8, r: 8, val: 'Khác' },
			{ t: 4, b: 4, l: 9, r: 14, val: 'Dự toán năm ' + (this.namBcao - 1).toString() },
			{ t: 5, b: 6, l: 9, r: 9, val: 'Tổng số biên chế được cấp có thẩm quyền giao (Người)' },
			{ t: 5, b: 6, l: 10, r: 10, val: 'Quỹ lương, phụ cấp và các khoản đóng góp theo lương (Người)' },
			{ t: 5, b: 5, l: 11, r: 14, val: 'Trong đó' },
			{ t: 6, b: 6, l: 11, r: 11, val: 'Lương theo ngạch, bậc' },
			{ t: 6, b: 6, l: 12, r: 12, val: 'Phụ cấp theo lương' },
			{ t: 6, b: 6, l: 13, r: 13, val: 'Các khoản đóng góp theo lương' },
			{ t: 6, b: 6, l: 14, r: 14, val: 'Khác' },
			{ t: 4, b: 4, l: 15, r: 21, val: 'Ước thực hiện năm ' + (this.namBcao - 1).toString() },
			{ t: 5, b: 6, l: 15, r: 15, val: 'Tổng số biên chế được cấp có thẩm quyền giao (Người)' },
			{ t: 5, b: 6, l: 16, r: 16, val: 'Tống số biên chế có mặt thời điểm 31/12 (Người)' },
			{ t: 5, b: 6, l: 17, r: 17, val: 'Quỹ lương, phụ cấp và các khoản đóng góp theo lương theo biên chế có mặt 31/12' },
			{ t: 5, b: 5, l: 18, r: 21, val: 'Trong đó' },
			{ t: 6, b: 6, l: 18, r: 18, val: 'Lương theo ngạch, bậc' },
			{ t: 6, b: 6, l: 19, r: 19, val: 'Phụ cấp theo lương' },
			{ t: 6, b: 6, l: 20, r: 20, val: 'Các khoản đóng góp theo lương' },
			{ t: 6, b: 6, l: 21, r: 21, val: 'Khác' },
			{ t: 4, b: 4, l: 22, r: 27, val: 'Dự toán năm ' + this.namBcao.toString() },
			{ t: 5, b: 6, l: 22, r: 22, val: 'Tổng số biên chế được cấp có thẩm quyền giao (Người)' },
			{ t: 5, b: 6, l: 23, r: 23, val: 'Quỹ lương, phụ cấp và các khoản đóng góp theo lương (Người)' },
			{ t: 5, b: 5, l: 24, r: 27, val: 'Trong đó' },
			{ t: 6, b: 6, l: 24, r: 24, val: 'Lương theo ngạch, bậc' },
			{ t: 6, b: 6, l: 25, r: 25, val: 'Phụ cấp theo lương' },
			{ t: 6, b: 6, l: 26, r: 26, val: 'Các khoản đóng góp theo lương' },
			{ t: 6, b: 6, l: 27, r: 27, val: 'Khác' },
			{ t: 4, b: 6, l: 28, r: 28, val: 'Ghi chú' },
		]
		const fieldOrder = ['stt', 'tenDmuc', 'thienTsoBcTqGiao', 'thienTsoBcTdiem', 'thienQlPcap', 'thienLuongBac', 'thienPcapLuong', 'thienDgopLuong', 'thienKhac', 'dtoanTsoBcheTqGiao',
			'dtoanQluongPcap', 'dtoanLuongBac', 'dtoanPcapLuong', 'dtoanDgopLuong', 'dtoanKhac', 'uocThTsoBcTqGiao', 'uocThTsoBcTdiem', 'uocThQlPcap', 'uocThLuongBac', 'uocThPCapLuong',
			'uocThDgopLuong', 'uocThKhac', 'namKhTsoBcTqGiao', 'namKhQlPcap', 'namKhLuongBac', 'namKhPcapLuong', 'namKhDgopLuong', 'namKhKhac', 'ghiChu']
		const filterData = this.lstCtietBcao.map(item => {
			const row: any = {};
			fieldOrder.forEach(field => {
				row[field] = ((!item[field] && item[field] !== 0) ? '' : item[field]);
			})
			return row;
		})
		let ind = 1;
		filterData.forEach(item => {
			item.stt = ind.toString();
			ind += 1;
		})

		const workbook = XLSX.utils.book_new();
		const worksheet = Table.initExcel(header);
		XLSX.utils.sheet_add_json(worksheet, filterData, { skipHeader: true, origin: Table.coo(header[0].l, header[0].b + 1) })
		XLSX.utils.book_append_sheet(workbook, worksheet, 'Dữ liệu');
		XLSX.writeFile(workbook, this.dataInfo.maBcao + '_TT342_15.1.xlsx');
	}
}
