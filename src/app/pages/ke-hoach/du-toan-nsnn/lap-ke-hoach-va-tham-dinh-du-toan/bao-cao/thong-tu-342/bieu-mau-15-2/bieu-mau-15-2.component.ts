import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { FileFunction, GeneralFunction, NumberFunction, TableFunction } from 'src/app/Utility/func';
import { AMOUNT, DON_VI_TIEN, MONEY_LIMIT, Utils } from 'src/app/Utility/utils';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { DanhMucDungChungService } from 'src/app/services/danh-muc-dung-chung.service';
import { LapThamDinhService } from 'src/app/services/quan-ly-von-phi/lapThamDinh.service';
import * as uuid from 'uuid';
import { BtnStatus, Doc, Form } from '../../../lap-ke-hoach-va-tham-dinh-du-toan.class';
import * as XLSX from 'xlsx';

export class ItemData {
	id: any;
	khvonphiLapThamDinhCtietId: string;
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
}

@Component({
	selector: 'app-bieu-mau-15-2',
	templateUrl: './bieu-mau-15-2.component.html',
	styleUrls: ['../../bao-cao.component.scss']
})

export class BieuMau152Component implements OnInit {
	@Input() dataInfo;
	//thong tin chi tiet cua bieu mau
	formDetail: Form = new Form();
	total: ItemData = new ItemData();
	maDviTien: string = '1';
	namBcao: number;
	//danh muc
	linhVucChis: any[] = [];
	lstCtietBcao: ItemData[] = [];
	donViTiens: any[] = DON_VI_TIEN;
	keys = ['dtTsoNguoiLv', 'dtTongQlPcap', 'dtQlPcapTso', 'dtQlPcapLuongBac', 'dtQlPcapPcapLuong', 'dtQlPcapDgopLuong', 'dtQlPcapHdLd', 'dtKphiNsnn',
		'dtKphiSnDvu', 'dtKphiPhiDlai', 'dtKphiHphap', 'uocThTsoNguoiLv', 'uocThTsoBcTdiem', 'uocThTsoVcCc', 'uocThTongQlPcap', 'uocThQlPcapTso',
		'uocThQlPcapLuongBac', 'uocThQlPcapPcapLuong', 'uocThQlPcapDgopLuong', 'uocThQlPcapHdLd', 'uocThKphiNsnn', 'uocThKphiSnDvu', 'uocThKphiPhiDlai',
		'uocThKphiHphap', 'namKhTsoNguoiLv', 'namKhTongQlPcap', 'namKhQlPcapTso', 'namKhQlPcapLuongBac', 'namKhQlPcapPcapLuong', 'namKhQlPcapDgopLuong',
		'namKhQlPcapHdLd', 'namKhKphiNsnn', 'namKhKphiSnDvu', 'namKhKphiPhiDlai', 'namKhKphiHphap']
	amount = AMOUNT;
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
		private notification: NzNotificationService,
		private modal: NzModalService,
		private danhMucService: DanhMucDungChungService,
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
		if (this.status.general) {
			const category = await this.danhMucService.danhMucChungGetAll('LTD_TT342_BM152');
			if (category) {
				this.listDonVi = category.data;
			}
			this.scrollX = this.genFunc.tableWidth(350, 35, 1, 160);
		} else {
			this.scrollX = this.genFunc.tableWidth(350, 35, 1, 0);
		}

		if (this.lstCtietBcao.length == 0) {
			this.listDonVi.forEach(e => {
				this.lstCtietBcao.push({
					...new ItemData(),
					id: uuid.v4() + 'FE',
					stt: e.ma,
					donVi: e.ma,
					tenDmuc: e.giaTri,
				})
			})
		} else if (!this.lstCtietBcao[0]?.stt) {
			this.lstCtietBcao.forEach(item => {
				item.stt = item.donVi;
			})
		}
		this.lstCtietBcao = this.tableFunc.sortByIndex(this.lstCtietBcao);
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

		if (this.lstCtietBcao.some(e => e.dtTongQlPcap > MONEY_LIMIT || e.dtKphiNsnn > MONEY_LIMIT || e.dtKphiSnDvu > MONEY_LIMIT || e.dtKphiPhiDlai > MONEY_LIMIT || e.dtKphiHphap > MONEY_LIMIT ||
			e.uocThTongQlPcap > MONEY_LIMIT || e.uocThKphiNsnn > MONEY_LIMIT || e.uocThKphiSnDvu > MONEY_LIMIT || e.uocThKphiPhiDlai > MONEY_LIMIT || e.uocThKphiHphap > MONEY_LIMIT ||
			e.namKhTongQlPcap > MONEY_LIMIT || e.namKhKphiNsnn > MONEY_LIMIT || e.namKhKphiSnDvu > MONEY_LIMIT || e.namKhKphiPhiDlai > MONEY_LIMIT || e.namKhKphiHphap > MONEY_LIMIT)) {
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

	// luu thay doi
	saveEdit(id: string): void {
		const index = this.lstCtietBcao.findIndex(item => item.id === id); // lay vi tri hang minh sua
		Object.assign(this.lstCtietBcao[index], this.editCache[id].data); // set lai data cua lstCtietBcao[index] = this.editCache[id].data
		this.editCache[id].edit = false; // CHUYEN VE DANG TEXT
		// this.tinhTong();
		this.sum(this.lstCtietBcao[index].stt);
		this.updateEditCache();
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

	deleteAllChecked() {
		const lstId: any[] = [];
		this.lstCtietBcao.forEach(item => {
			if (item.checked) {
				lstId.push(item.id);
			}
		})
		lstId.forEach(item => {
			if (this.lstCtietBcao.findIndex(e => e.id == item) != -1) {
				this.deleteLine(item);
			}
		})
	}

	checkEdit(stt: string) {
		const lstTemp = this.lstCtietBcao.filter(e => e.stt !== stt);
		return lstTemp.every(e => !e.stt.startsWith(stt));
	}

	// start edit
	startEdit(id: string): void {
		this.editCache[id].edit = true;
	}

	// click o checkbox single
	updateSingleChecked(): void {
		if (this.lstCtietBcao.every(item => item.checked)) {     // tat ca o checkbox deu = true thi set o checkbox all = true
			this.allChecked = true;
		} else {                                                        // o checkbox vua = false, vua = true thi set o checkbox all = indeterminate
			this.allChecked = false;
		}
	}

	// click o checkbox all
	updateAllChecked(): void {
		if (this.allChecked) {                                    // checkboxall == true thi set lai lstCTietBCao.checked = true
			this.lstCtietBcao = this.lstCtietBcao.map(item => ({
				...item,
				checked: true
			}));
		} else {
			this.lstCtietBcao = this.lstCtietBcao.map(item => ({    // checkboxall == false thi set lai lstCTietBCao.checked = false
				...item,
				checked: false
			}));
		}
	}

	deleteLine(id: string) {
		const stt = this.lstCtietBcao.find(e => e.id === id)?.stt;
		this.lstCtietBcao = this.tableFunc.deleteRow(id, this.lstCtietBcao);
		this.sum(stt);
		this.updateEditCache();
	}
	// them dong moi

	addLine(id: string) {
		this.lstCtietBcao = this.tableFunc.addChild(id, new ItemData(), this.lstCtietBcao);
		this.updateEditCache();
	}

	checkAdd(data: ItemData) {
		if (data.stt.length == 3) {
			return true;
		}
		return false;
	}

	checkDelete(stt: string) {
		if (stt.length != 3) {
			return true;
		}
		return false;
	}

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
		}
	}

	sum(stt: string) {
		stt = this.tableFunc.getHead(stt);
		while (stt != '0') {
			const index = this.lstCtietBcao.findIndex(e => e.stt == stt);
			const data = this.lstCtietBcao[index];
			this.lstCtietBcao[index] = {
				...new ItemData(),
				id: data.id,
				stt: data.stt,
				donVi: data.donVi,
				tenDmuc: data.tenDmuc,
				level: data.level,
			}
			this.lstCtietBcao.forEach(item => {
				if (this.tableFunc.getHead(item.stt) == stt) {
					this.keys.forEach(key => {
						this.lstCtietBcao[index][key] = this.numFunc.sum([this.lstCtietBcao[index][key], item[key]]);
					})

				}
			})
			stt = this.tableFunc.getHead(stt);
		}
		this.getTotal();
	}

	getTotal() {
		this.total = new ItemData();
		this.lstCtietBcao.forEach(item => {
			if (item.level == 0) {
				this.keys.forEach(key => {
					this.total[key] = this.numFunc.sum([this.total[key], item[key]]);
				})
			}
		})
	}
	changeModel(id: string): void {
		this.editCache[id].data.dtQlPcapTso = this.editCache[id].data.dtQlPcapLuongBac + this.editCache[id].data.dtQlPcapPcapLuong + this.editCache[id].data.dtQlPcapDgopLuong;
		this.editCache[id].data.uocThQlPcapTso = this.editCache[id].data.uocThQlPcapLuongBac + this.editCache[id].data.uocThQlPcapPcapLuong + this.editCache[id].data.uocThQlPcapDgopLuong;
		this.editCache[id].data.namKhQlPcapTso = this.editCache[id].data.namKhQlPcapLuongBac + this.editCache[id].data.namKhQlPcapPcapLuong + this.editCache[id].data.namKhQlPcapDgopLuong;
		this.editCache[id].data.dtTongQlPcap = this.editCache[id].data.dtQlPcapTso + this.editCache[id].data.dtQlPcapHdLd;
		this.editCache[id].data.uocThTongQlPcap = this.editCache[id].data.uocThQlPcapTso + this.editCache[id].data.uocThQlPcapHdLd;
		this.editCache[id].data.namKhTongQlPcap = this.editCache[id].data.namKhQlPcapTso + this.editCache[id].data.namKhQlPcapHdLd;

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
			{ t: 0, b: 3, l: 0, r: 37, val: null },
			{ t: 0, b: 3, l: 0, r: 0, val: 'STT' },
			{ t: 0, b: 3, l: 1, r: 1, val: 'Tên đơn vị' },
			{ t: 0, b: 0, l: 2, r: 12, val: 'Dự toán năm ' + (this.namBcao - 1).toString() },
			{ t: 1, b: 3, l: 2, r: 2, val: 'Tổng số người làm việc được cấp có thẩm quyền giao (Người)' },
			{ t: 1, b: 3, l: 3, r: 3, val: 'Tổng quỹ lương, phụ cấp và các khoản đóng góp theo lương' },
			{ t: 1, b: 1, l: 4, r: 8, val: 'Trong đó' },
			{ t: 2, b: 2, l: 4, r: 7, val: 'Quỹ lương, phụ cấp và các khoản đóng góp theo lương của biên chế được giao' },
			{ t: 3, b: 3, l: 4, r: 4, val: 'Tổng số' },
			{ t: 3, b: 3, l: 5, r: 5, val: 'Lương theo ngạch, bậc' },
			{ t: 3, b: 3, l: 6, r: 6, val: 'Phụ cấp theo lương' },
			{ t: 3, b: 3, l: 7, r: 7, val: 'Các khoản đóng góp theo lương' },
			{ t: 2, b: 3, l: 8, r: 8, val: 'Quỹ lương, phụ cấp và các khoản đóng góp theo lương của hợp đồng lao động' },
			{ t: 1, b: 1, l: 9, r: 12, val: 'Nguồn kinh phí bảo đảm' },
			{ t: 2, b: 3, l: 9, r: 9, val: 'Nguồn NSNN' },
			{ t: 2, b: 3, l: 10, r: 10, val: 'Nguồn thu sự nghiệp, dịch vụ' },
			{ t: 2, b: 3, l: 11, r: 11, val: 'Nguồn phí được để lại' },
			{ t: 2, b: 3, l: 12, r: 12, val: 'Nguồn thu hợp pháp khác' },
			{ t: 0, b: 0, l: 13, r: 25, val: 'Ước thực hiện ' + (this.namBcao - 1).toString() },
			{ t: 1, b: 3, l: 13, r: 13, val: 'Tổng số người làm việc được cấp có thẩm quyền giao (Người)' },
			{ t: 1, b: 3, l: 14, r: 14, val: 'Tổng số người làm việc được cấp có thẩm quyền giao có mặt tại thời điểm 31/12 (Người)' },
			{ t: 1, b: 3, l: 15, r: 15, val: 'Trong đó: Tổng số viên chức, công chức (Người)' },
			{ t: 1, b: 3, l: 16, r: 16, val: 'Tổng quỹ lương, phụ cấp và các khoản đóng góp theo lương theo số người làm việc có mặt tại thời điểm 31/12' },
			{ t: 1, b: 1, l: 17, r: 21, val: 'Trong đó' },
			{ t: 2, b: 2, l: 17, r: 20, val: 'Quỹ lương, phụ cấp và các khoản đóng góp theo lương của số biên chế thực có mặt thời điểm 31/12' },
			{ t: 3, b: 3, l: 17, r: 17, val: 'Tổng số' },
			{ t: 3, b: 3, l: 18, r: 18, val: 'Lương theo ngạch, bậc' },
			{ t: 3, b: 3, l: 19, r: 19, val: 'Phụ cấp theo lương' },
			{ t: 3, b: 3, l: 20, r: 20, val: 'Các khoản đóng góp theo lương' },
			{ t: 2, b: 3, l: 21, r: 21, val: 'Quỹ lương, phụ cấp và các khoản đóng góp theo lương của hợp đồng lao động có mặt tại thời điểm 31/12' },
			{ t: 1, b: 1, l: 22, r: 25, val: 'Nguồn kinh phí bảo đảm' },
			{ t: 2, b: 3, l: 22, r: 22, val: 'Nguồn NSNN' },
			{ t: 2, b: 3, l: 23, r: 23, val: 'Nguồn thu sự nghiệp, dịch vụ' },
			{ t: 2, b: 3, l: 24, r: 24, val: 'Nguồn phí được để lại' },
			{ t: 2, b: 3, l: 25, r: 25, val: 'Nguồn thu hợp pháp khác' },
			{ t: 0, b: 0, l: 26, r: 36, val: 'Dự toán năm ' + (this.namBcao).toString() },
			{ t: 1, b: 3, l: 26, r: 26, val: 'Tổng số người làm việc được cấp có thẩm quyền giao (Người)' },
			{ t: 1, b: 3, l: 27, r: 27, val: 'Tổng quỹ lương, phụ cấp và các khoản đóng góp theo lương' },
			{ t: 1, b: 1, l: 28, r: 32, val: 'Trong đó' },
			{ t: 2, b: 2, l: 28, r: 31, val: 'Quỹ lương, phụ cấp và các khoản đóng góp theo lương của biên chế' },
			{ t: 3, b: 3, l: 28, r: 28, val: 'Tổng số' },
			{ t: 3, b: 3, l: 29, r: 29, val: 'Lương theo ngạch, bậc' },
			{ t: 3, b: 3, l: 30, r: 30, val: 'Phụ cấp theo lương' },
			{ t: 3, b: 3, l: 31, r: 31, val: 'Các khoản đóng góp theo lương' },
			{ t: 2, b: 3, l: 32, r: 32, val: 'Quỹ lương, phụ cấp và các khoản đóng góp theo lương của hợp đồng lao động' },
			{ t: 1, b: 1, l: 33, r: 36, val: 'Nguồn kinh phí bảo đảm' },
			{ t: 2, b: 3, l: 33, r: 33, val: 'Nguồn NSNN' },
			{ t: 2, b: 3, l: 34, r: 34, val: 'Nguồn thu sự nghiệp, dịch vụ' },
			{ t: 2, b: 3, l: 35, r: 35, val: 'Nguồn phí được để lại' },
			{ t: 2, b: 3, l: 36, r: 36, val: 'Nguồn thu hợp pháp khác' },
			{ t: 0, b: 3, l: 37, r: 37, val: 'Ghi chú' },
		]
		const filterData = this.lstCtietBcao.map(item => {
			const { id, donVi, khvonphiLapThamDinhCtietId, level, checked, ...rest } = item;
			return rest;
		})
		filterData.forEach(item => {
			const level = item.stt.split('.').length - 2;
			item.stt = this.getChiMuc(item.stt);
			for (let i = 0; i < level; i++) {
				item.stt = '   ' + item.stt;
			}
		})

		const workbook = XLSX.utils.book_new();
		const worksheet = this.genFunc.initExcel(header);
		XLSX.utils.sheet_add_json(worksheet, filterData, { skipHeader: true, origin: this.genFunc.coo(header[0].l, header[0].b + 1) })
		XLSX.utils.book_append_sheet(workbook, worksheet, 'Dữ liệu');
		XLSX.writeFile(workbook, 'TT342_15.2.xlsx');
	}
}
