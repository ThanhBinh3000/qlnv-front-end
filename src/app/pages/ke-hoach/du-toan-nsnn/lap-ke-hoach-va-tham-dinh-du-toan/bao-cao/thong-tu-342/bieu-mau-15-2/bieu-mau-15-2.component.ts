import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { Operator, Status, Table, Utils } from 'src/app/Utility/utils';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { DanhMucDungChungService } from 'src/app/services/danh-muc-dung-chung.service';
import { LapThamDinhService } from 'src/app/services/quan-ly-von-phi/lapThamDinh.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import * as uuid from 'uuid';
import * as XLSX from 'xlsx-js-style';
import { BtnStatus, Doc, Form } from '../../../lap-ke-hoach-va-tham-dinh-du-toan.constant';

export class ItemData {
	id: any;
	stt: string;
	donVi: string;
	tenDmuc: string;
	dtTsoNguoiLv: number;
	dtTongQlPcap: number;
	dtQlPcapTso: number;
	dtQlPcapLuongBac: number;
	dtQlPcapPcapLuong: number;
	dtQlPcapDgopLuong: number;
	dtQlPcapHdLd: number;
	dtKphiNsnn: number;
	dtKphiSnDvu: number;
	dtKphiPhiDlai: number;
	dtKphiHphap: number;
	uocThTsoNguoiLv: number;
	uocThTsoBcTdiem: number;
	uocThTsoVcCc: number;
	uocThTongQlPcap: number;
	uocThQlPcapTso: number;
	uocThQlPcapLuongBac: number;
	uocThQlPcapPcapLuong: number;
	uocThQlPcapDgopLuong: number;
	uocThQlPcapHdLd: number;
	uocThKphiNsnn: number;
	uocThKphiSnDvu: number;
	uocThKphiPhiDlai: number;
	uocThKphiHphap: number;
	namKhTsoNguoiLv: number;
	namKhTongQlPcap: number;
	namKhQlPcapTso: number;
	namKhQlPcapLuongBac: number;
	namKhQlPcapPcapLuong: number;
	namKhQlPcapDgopLuong: number;
	namKhQlPcapHdLd: number;
	namKhKphiNsnn: number;
	namKhKphiSnDvu: number;
	namKhKphiPhiDlai: number;
	namKhKphiHphap: number;
	level: any;
	checked: boolean;
	ghiChu: string;

	constructor(data: Partial<Pick<ItemData, keyof ItemData>>) {
		Object.assign(this, data);
	}

	changeModel() {
		this.dtQlPcapTso = Operator.sum([this.dtQlPcapLuongBac, this.dtQlPcapPcapLuong, this.dtQlPcapDgopLuong]);
		this.uocThQlPcapTso = Operator.sum([this.uocThQlPcapLuongBac, this.uocThQlPcapPcapLuong, this.uocThQlPcapDgopLuong]);
		this.namKhQlPcapTso = Operator.sum([this.namKhQlPcapLuongBac, this.namKhQlPcapPcapLuong, this.namKhQlPcapDgopLuong]);
		this.dtTongQlPcap = Operator.sum([this.dtQlPcapTso, this.dtQlPcapHdLd]);
		this.uocThTongQlPcap = Operator.sum([this.uocThQlPcapTso, this.uocThQlPcapHdLd]);
		this.namKhTongQlPcap = Operator.sum([this.namKhQlPcapTso, this.namKhQlPcapHdLd]);
	}

	upperBound() {
		return this.dtTongQlPcap > Utils.MONEY_LIMIT || this.dtKphiNsnn > Utils.MONEY_LIMIT || this.dtKphiSnDvu > Utils.MONEY_LIMIT || this.dtKphiPhiDlai > Utils.MONEY_LIMIT || this.dtKphiHphap > Utils.MONEY_LIMIT ||
			this.uocThTongQlPcap > Utils.MONEY_LIMIT || this.uocThKphiNsnn > Utils.MONEY_LIMIT || this.uocThKphiSnDvu > Utils.MONEY_LIMIT || this.uocThKphiPhiDlai > Utils.MONEY_LIMIT || this.uocThKphiHphap > Utils.MONEY_LIMIT ||
			this.namKhTongQlPcap > Utils.MONEY_LIMIT || this.namKhKphiNsnn > Utils.MONEY_LIMIT || this.namKhKphiSnDvu > Utils.MONEY_LIMIT || this.namKhKphiPhiDlai > Utils.MONEY_LIMIT || this.namKhKphiHphap > Utils.MONEY_LIMIT;
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
	selector: 'app-bieu-mau-15-2',
	templateUrl: './bieu-mau-15-2.component.html',
	styleUrls: ['../../bao-cao.component.scss']
})

export class BieuMau152Component implements OnInit {
	@Input() dataInfo;
	Op = new Operator('1');
	Utils = Utils;
	//thong tin chi tiet cua bieu mau
	formDetail: Form = new Form();
	total: ItemData = new ItemData({});
	maDviTien: string = '1';
	namBcao: number;
	//danh muc
	donVis: any[];
	linhVucChis: any[] = [];
	lstCtietBcao: ItemData[] = [];
	scrollX: string;
	//trang thai cac nut
	status: BtnStatus = new BtnStatus();
	editMoneyUnit = false;
	isDataAvailable = false;
	//nho dem
	editCache: { [key: string]: { edit: boolean; data: ItemData } } = {};

	listDonVi: any[] = [];
	lstVatTuFull = [];
	allChecked = false;

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
		private quanLyVonPhiService: QuanLyVonPhiService,
		private notification: NzNotificationService,
		private modal: NzModalService,
		private danhMucService: DanhMucDungChungService,
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
		if (this.status.general) {
			this.scrollX = Table.tableWidth(350, 35, 1, 160);
		} else {
			this.scrollX = Table.tableWidth(350, 35, 1, 0);
		}

		if (this.dataInfo?.isSynthetic && this.formDetail.trangThai == Status.NEW) {
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
			this.donVis.forEach(item => {
				if (this.lstCtietBcao.findIndex(e => e.donVi == item.maDvi) == -1) {
					this.lstCtietBcao.push(new ItemData({
						id: uuid.v4() + 'FE',
						donVi: item.maDvi,
						tenDmuc: item.tenDvi
					}))
				}
			})
		} else {
			if (this.lstCtietBcao.length == 0) {
				this.lstCtietBcao.push(new ItemData({
					id: uuid.v4() + 'FE',
					donVi: this.dataInfo.maDvi,
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
						this.lstCtietBcao.push(new ItemData(item));
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
		this.getTotal();
		this.updateEditCache();
	}

	getTotal() {
		this.total.clear();
		this.lstCtietBcao.forEach(item => {
			this.total.sum(item);
		})
	}

	// gan editCache.data == lstCtietBcao
	updateEditCache(): void {
		this.lstCtietBcao.forEach(item => {
			this.editCache[item.id] = {
				edit: false,
				data: new ItemData(item)
			};
		});
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
		if (this.lstCtietBcao.some(e => this.editCache[e.id].edit)) {
			this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTSAVE);
			return;
		}
		const header = [
			{ t: 0, b: 7, l: 0, r: 37, val: null },
			{ t: 0, b: 0, l: 0, r: 1, val: this.dataInfo.tenPl },
			{ t: 1, b: 1, l: 0, r: 8, val: this.dataInfo.tieuDe },
			{ t: 2, b: 2, l: 0, r: 8, val: this.dataInfo.congVan },
			{ t: 4, b: 7, l: 0, r: 0, val: 'STT' },
			{ t: 4, b: 7, l: 1, r: 1, val: 'Tên đơn vị' },
			{ t: 4, b: 4, l: 2, r: 12, val: 'Dự toán năm ' + (this.namBcao - 1).toString() },
			{ t: 5, b: 7, l: 2, r: 2, val: 'Tổng số người làm việc được cấp có thẩm quyền giao (Người)' },
			{ t: 5, b: 7, l: 3, r: 3, val: 'Tổng quỹ lương, phụ cấp và các khoản đóng góp theo lương' },
			{ t: 5, b: 5, l: 4, r: 8, val: 'Trong đó' },
			{ t: 6, b: 6, l: 4, r: 7, val: 'Quỹ lương, phụ cấp và các khoản đóng góp theo lương của biên chế được giao' },
			{ t: 7, b: 7, l: 4, r: 4, val: 'Tổng số' },
			{ t: 7, b: 7, l: 5, r: 5, val: 'Lương theo ngạch, bậc' },
			{ t: 7, b: 7, l: 6, r: 6, val: 'Phụ cấp theo lương' },
			{ t: 7, b: 7, l: 7, r: 7, val: 'Các khoản đóng góp theo lương' },
			{ t: 6, b: 7, l: 8, r: 8, val: 'Quỹ lương, phụ cấp và các khoản đóng góp theo lương của hợp đồng lao động' },
			{ t: 5, b: 5, l: 9, r: 12, val: 'Nguồn kinh phí bảo đảm' },
			{ t: 6, b: 7, l: 9, r: 9, val: 'Nguồn NSNN' },
			{ t: 6, b: 7, l: 10, r: 10, val: 'Nguồn thu sự nghiệp, dịch vụ' },
			{ t: 6, b: 7, l: 11, r: 11, val: 'Nguồn phí được để lại' },
			{ t: 6, b: 7, l: 12, r: 12, val: 'Nguồn thu hợp pháp khác' },
			{ t: 4, b: 4, l: 13, r: 25, val: 'Ước thực hiện ' + (this.namBcao - 1).toString() },
			{ t: 5, b: 7, l: 13, r: 13, val: 'Tổng số người làm việc được cấp có thẩm quyền giao (Người)' },
			{ t: 5, b: 7, l: 14, r: 14, val: 'Tổng số người làm việc được cấp có thẩm quyền giao có mặt tại thời điểm 31/12 (Người)' },
			{ t: 5, b: 7, l: 15, r: 15, val: 'Trong đó: Tổng số viên chức, công chức (Người)' },
			{ t: 5, b: 7, l: 16, r: 16, val: 'Tổng quỹ lương, phụ cấp và các khoản đóng góp theo lương theo số người làm việc có mặt tại thời điểm 31/12' },
			{ t: 5, b: 5, l: 17, r: 21, val: 'Trong đó' },
			{ t: 6, b: 6, l: 17, r: 20, val: 'Quỹ lương, phụ cấp và các khoản đóng góp theo lương của số biên chế thực có mặt thời điểm 31/12' },
			{ t: 7, b: 7, l: 17, r: 17, val: 'Tổng số' },
			{ t: 7, b: 7, l: 18, r: 18, val: 'Lương theo ngạch, bậc' },
			{ t: 7, b: 7, l: 19, r: 19, val: 'Phụ cấp theo lương' },
			{ t: 7, b: 7, l: 20, r: 20, val: 'Các khoản đóng góp theo lương' },
			{ t: 6, b: 7, l: 21, r: 21, val: 'Quỹ lương, phụ cấp và các khoản đóng góp theo lương của hợp đồng lao động có mặt tại thời điểm 31/12' },
			{ t: 5, b: 5, l: 22, r: 25, val: 'Nguồn kinh phí bảo đảm' },
			{ t: 6, b: 7, l: 22, r: 22, val: 'Nguồn NSNN' },
			{ t: 6, b: 7, l: 23, r: 23, val: 'Nguồn thu sự nghiệp, dịch vụ' },
			{ t: 6, b: 7, l: 24, r: 24, val: 'Nguồn phí được để lại' },
			{ t: 6, b: 7, l: 25, r: 25, val: 'Nguồn thu hợp pháp khác' },
			{ t: 4, b: 4, l: 26, r: 36, val: 'Dự toán năm ' + (this.namBcao).toString() },
			{ t: 5, b: 7, l: 26, r: 26, val: 'Tổng số người làm việc được cấp có thẩm quyền giao (Người)' },
			{ t: 5, b: 7, l: 27, r: 27, val: 'Tổng quỹ lương, phụ cấp và các khoản đóng góp theo lương' },
			{ t: 5, b: 5, l: 28, r: 32, val: 'Trong đó' },
			{ t: 6, b: 6, l: 28, r: 31, val: 'Quỹ lương, phụ cấp và các khoản đóng góp theo lương của biên chế' },
			{ t: 7, b: 7, l: 28, r: 28, val: 'Tổng số' },
			{ t: 7, b: 7, l: 29, r: 29, val: 'Lương theo ngạch, bậc' },
			{ t: 7, b: 7, l: 30, r: 30, val: 'Phụ cấp theo lương' },
			{ t: 7, b: 7, l: 31, r: 31, val: 'Các khoản đóng góp theo lương' },
			{ t: 6, b: 7, l: 32, r: 32, val: 'Quỹ lương, phụ cấp và các khoản đóng góp theo lương của hợp đồng lao động' },
			{ t: 5, b: 5, l: 33, r: 36, val: 'Nguồn kinh phí bảo đảm' },
			{ t: 6, b: 7, l: 33, r: 33, val: 'Nguồn NSNN' },
			{ t: 6, b: 7, l: 34, r: 34, val: 'Nguồn thu sự nghiệp, dịch vụ' },
			{ t: 6, b: 7, l: 35, r: 35, val: 'Nguồn phí được để lại' },
			{ t: 6, b: 7, l: 36, r: 36, val: 'Nguồn thu hợp pháp khác' },
			{ t: 4, b: 7, l: 37, r: 37, val: 'Ghi chú' },
		]
		const fieldOrder = ['stt', 'tenDmuc', 'dtTsoNguoiLv', 'dtTongQlPcap', 'dtQlPcapTso', 'dtQlPcapLuongBac', 'dtQlPcapPcapLuong', 'dtQlPcapDgopLuong', 'dtQlPcapHdLd', 'dtKphiNsnn',
			'dtKphiSnDvu', 'dtKphiPhiDlai', 'dtKphiHphap', 'uocThTsoNguoiLv', 'uocThTsoBcTdiem', 'uocThTsoVcCc', 'uocThTongQlPcap', 'uocThQlPcapTso', 'uocThQlPcapLuongBac', 'uocThQlPcapPcapLuong',
			'uocThQlPcapDgopLuong', 'uocThQlPcapHdLd', 'uocThKphiNsnn', 'uocThKphiSnDvu', 'uocThKphiPhiDlai', 'uocThKphiHphap', 'namKhTsoNguoiLv', 'namKhTongQlPcap', 'namKhQlPcapTso',
			'namKhQlPcapLuongBac', 'namKhQlPcapPcapLuong', 'namKhQlPcapDgopLuong', 'namKhQlPcapHdLd', 'namKhKphiNsnn', 'namKhKphiSnDvu', 'namKhKphiPhiDlai', 'namKhKphiHphap', 'ghiChu']

		const filterData = this.lstCtietBcao.map((item, index) => {
			const row: any = {};
			fieldOrder.forEach(field => {
				row[field] = field == 'stt' ? (index + 1) : Utils.getValue(item[field]);
			})
			return row;
		})
		let row: any = {};
		fieldOrder.forEach(field => {
			row[field] = field == 'tenDmuc' ? 'Tổng cộng' : Utils.getValue(this.total[field]);
		})
		filterData.unshift(row);
		// thêm công thức tính cho biểu mẫu
		const calHeader = ['A', 'B', '1', '2=3+7', '3=4+5+6', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15=16+20', '16=17+18+19', '17', '18',
			'19', '20', '21', '22', '23', '24', '25', '26=27+31', '27=28+29+30', '28', '29', '30', '31', '32', '33', '34', '35', ''];
		let cal = {};
		fieldOrder.forEach((field, index) => {
			cal[field] = calHeader[index];
		})
		filterData.unshift(cal);
		const workbook = XLSX.utils.book_new();
		const worksheet = Table.initExcel(header);
		XLSX.utils.sheet_add_json(worksheet, filterData, { skipHeader: true, origin: Table.coo(header[0].l, header[0].b + 1) })
		//Thêm khung viền cho bảng
		for (const cell in worksheet) {
			if (cell.startsWith('!') || XLSX.utils.decode_cell(cell).r < 4) continue;
			worksheet[cell].s = Table.borderStyle;
		}

		XLSX.utils.book_append_sheet(workbook, worksheet, 'Dữ liệu');
		XLSX.writeFile(workbook, this.dataInfo.namBcao + '_TT342_15.2.xlsx');
	}
}
