import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { FileManip, Operator, Status, Table, Utils } from "src/app/Utility/utils";
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { DanhMucDungChungService } from 'src/app/services/danh-muc-dung-chung.service';
import { LapThamDinhService } from 'src/app/services/quan-ly-von-phi/lapThamDinh.service';
import * as uuid from "uuid";
import { BtnStatus, Doc, Form } from '../../../lap-ke-hoach-va-tham-dinh-du-toan.constant';
import * as XLSX from 'xlsx'

export class ItemData {
	id: string;
	stt: string;
	maNdung: string;
	tenDmuc: string;
	level: number;
	thienNtruoc: number;
	namDtoan: number;
	namUocThien: number;
	namKh: number;
	giaTriThamDinh: number;
	chenhLech: number;
	ghiChu: string;
	ykienDviCtren: string;
}

@Component({
	selector: 'app-bieu-mau-13-8',
	templateUrl: './bieu-mau-13-8.component.html',
	styleUrls: ['../../bao-cao.component.scss']
})
export class BieuMau138Component implements OnInit {
	@Input() dataInfo;
	Op = Operator;
	Utils = Utils;
	//thong tin chi tiet cua bieu mau
	formDetail: Form = new Form();
	total: ItemData = new ItemData();
	maDviTien: string = '1';
	namBcao: number;
	//danh muc
	noiDungs: any[] = [];
	lstCtietBcao: ItemData[] = [];
	//trang thai cac nut
	status: BtnStatus = new BtnStatus();
	editMoneyUnit = false;
	isDataAvailable = false;
	//nho dem
	editCache: { [key: string]: { edit: boolean; data: ItemData } } = {};
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
		private danhMucService: DanhMucDungChungService,
		private notification: NzNotificationService,
		private modal: NzModalService,
		private fileManip: FileManip,
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
		this.namBcao = this.dataInfo?.namBcao;
		if (this.status.general) {
			const category = await this.danhMucService.danhMucChungGetAll('LTD_TT342_BM138');
			if (category) {
				this.noiDungs = category.data;
			}
			this.scrollX = Table.tableWidth(350, 4, 1, 60);
		} else {
			if (this.status.editAppVal) {
				this.scrollX = Table.tableWidth(350, 6, 2, 60);
			} else if (this.status.viewAppVal) {
				this.scrollX = Table.tableWidth(350, 6, 2, 0);
			} else {
				this.scrollX = Table.tableWidth(350, 4, 1, 0);
			}
		}

		if (this.lstCtietBcao.length == 0) {
			this.noiDungs.forEach(e => {
				this.lstCtietBcao.push({
					...new ItemData(),
					id: uuid.v4() + 'FE',
					stt: e.ma,
					maNdung: e.ma,
					tenDmuc: e.giaTri,
				})
			})
		} else if (!this.lstCtietBcao[0]?.stt) {
			this.lstCtietBcao.forEach(item => {
				item.stt = item.maNdung;
			})
		}
		this.lstCtietBcao = Table.sortByIndex(this.lstCtietBcao);
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
					this.lstCtietBcao = this.formDetail.lstCtietLapThamDinhs;
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

	changeModel(id: string): void {
		this.editCache[id].data.chenhLech = Operator.sum([this.editCache[id].data.giaTriThamDinh, this.editCache[id].data.namKh]);
	}

	// luu
	async save(trangThai: string, lyDoTuChoi: string) {
		if (this.lstCtietBcao.some(e => this.editCache[e.id].edit)) {
			this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTSAVE);
			return;
		}

		if (this.lstCtietBcao.some(e => e.thienNtruoc > Utils.MONEY_LIMIT || e.namDtoan > Utils.MONEY_LIMIT || e.namUocThien > Utils.MONEY_LIMIT || e.namKh > Utils.MONEY_LIMIT)) {
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

		if (this.status.general) {
			lstCtietBcaoTemp.forEach(item => {
				item.giaTriThamDinh = item.namDtoan;
			})
		}

		const request = JSON.parse(JSON.stringify(this.formDetail));

		request.fileDinhKems = [];
		for (let iterator of this.listFile) {
			request.fileDinhKems.push(await this.fileManip.uploadFile(iterator, this.dataInfo.path));
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
				return Utils.laMa(k);
			case 1:
				return chiSo[n];
			case 2:
				return chiSo[n - 1].toString() + "." + chiSo[n].toString();
			case 3:
				return '';
			case 4:
				return "-";
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
		this.sum(this.lstCtietBcao[index].stt);
		this.updateEditCache();
	}

	sum(stt: string) {
		stt = Table.preIndex(stt);
		while (stt != '0') {
			const index = this.lstCtietBcao.findIndex(e => e.stt == stt);
			const data = this.lstCtietBcao[index];
			this.lstCtietBcao[index] = {
				...new ItemData(),
				id: data.id,
				stt: data.stt,
				maNdung: data.maNdung,
				tenDmuc: data.tenDmuc,
				level: data.level,
			}
			this.lstCtietBcao.forEach(item => {
				if (Table.preIndex(item.stt) == stt) {
					this.lstCtietBcao[index].thienNtruoc = Operator.sum([this.lstCtietBcao[index].thienNtruoc, item.thienNtruoc]);
					this.lstCtietBcao[index].namDtoan = Operator.sum([this.lstCtietBcao[index].namDtoan, item.namDtoan]);
					this.lstCtietBcao[index].namUocThien = Operator.sum([this.lstCtietBcao[index].namUocThien, item.namUocThien]);
					this.lstCtietBcao[index].namKh = Operator.sum([this.lstCtietBcao[index].namKh, item.namKh]);
					this.lstCtietBcao[index].giaTriThamDinh = Operator.sum([this.lstCtietBcao[index].giaTriThamDinh, item.giaTriThamDinh]);
				}
			})
			stt = Table.preIndex(stt);
		}
	}

	checkEdit(stt: string) {
		if (stt.startsWith('0.1.1.1') || stt.startsWith('0.1.1.2') || stt.startsWith('0.1.1.3') ||
			(stt.startsWith('0.1.2') && this.status.editAppVal) || (stt.startsWith('0.1.3') && this.status.editAppVal)
			|| (stt.startsWith('0.1.4') && this.status.editAppVal) || (stt.startsWith('0.1.5') && this.status.editAppVal)) {
			return false;
		}
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
		await this.fileManip.downloadFile(file, doc);
	}

	exportToExcel() {
		const header = [
			{ t: 0, b: 1, l: 0, r: 9, val: null },
			{ t: 0, b: 1, l: 0, r: 0, val: 'STT' },
			{ t: 0, b: 1, l: 1, r: 1, val: 'Nội dung' },
			{ t: 0, b: 1, l: 2, r: 2, val: 'Thực hiện năm trước ' + (this.namBcao - 2).toString() },
			{ t: 0, b: 0, l: 3, r: 4, val: 'Năm ' + (this.namBcao - 1).toString() },
			{ t: 1, b: 1, l: 3, r: 3, val: 'Dự toán' },
			{ t: 1, b: 1, l: 4, r: 4, val: 'Ước thực hiện' },
			{ t: 0, b: 1, l: 5, r: 5, val: 'Dự toán năm ' + this.namBcao.toString() },
			{ t: 0, b: 1, l: 6, r: 6, val: 'Giá trị thẩm định' },
			{ t: 0, b: 1, l: 7, r: 7, val: 'Chênh lệch giữa thẩm định của DVCT và nhu cầu của DVCD' },
			{ t: 0, b: 1, l: 8, r: 8, val: 'Ghi chú' },
			{ t: 0, b: 1, l: 9, r: 9, val: 'Ý kiến của đơn vị cấp trên' },
		]
		const fieldOrder = ['stt', 'tenDmuc', 'thienNtruoc', 'namDtoan', 'namUocThien', 'namKh', 'giaTriThamDinh', 'chenhLech', 'ghiChu', 'ykienDviCtren']
		const filterData = this.lstCtietBcao.map(item => {
			const row: any = {};
			fieldOrder.forEach(field => {
				row[field] = item[field]
			})
			return row;
		})
		filterData.forEach(item => {
			const level = item.stt.split('.').length - 2;
			item.stt = this.getChiMuc(item.stt);
			for (let i = 0; i < level; i++) {
				item.stt = '   ' + item.stt;
			}
		})

		const workbook = XLSX.utils.book_new();
		const worksheet = Table.initExcel(header);
		XLSX.utils.sheet_add_json(worksheet, filterData, { skipHeader: true, origin: Table.coo(header[0].l, header[0].b + 1) })
		XLSX.utils.book_append_sheet(workbook, worksheet, 'Dữ liệu');
		XLSX.writeFile(workbook, this.dataInfo.maBcao + '_TT342_13.8.xlsx');
	}
}
