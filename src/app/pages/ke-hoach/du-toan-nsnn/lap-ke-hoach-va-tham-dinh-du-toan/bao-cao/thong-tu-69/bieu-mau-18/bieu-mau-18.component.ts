import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { FileFunction, GeneralFunction, NumberFunction, TableFunction } from 'src/app/Utility/func';
import { AMOUNT, DON_VI_TIEN, MONEY_LIMIT, Utils } from "src/app/Utility/utils";
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { DanhMucDungChungService } from 'src/app/services/danh-muc-dung-chung.service';
import { LapThamDinhService } from 'src/app/services/quan-ly-von-phi/lapThamDinh.service';
import * as uuid from "uuid";
import { BtnStatus, Doc, Form } from '../../../lap-ke-hoach-va-tham-dinh-du-toan.class';
import * as XLSX from 'xlsx'

export class ItemData {
	id: string;
	stt: string;
	maLvuc: string;
	tenLvuc: string;
	level: number;
	mtieuNvu: string;
	csPhapLyThien: string;
	hdongChuYeu: string;
	nguonKphi: string;
	ncauChiTongSo: number;
	ncauChiTrongDoChiCs: number;
	ncauChiTrongDoChiMoi: number;
	ncauChiChiaRaDtuPtrien: number;
	ncauChiChiaRaChiCs1: number;
	ncauChiChiaRaChiMoi1: number;
	ncauChiChiaRaChiTx: number;
	ncauChiChiaRaChiCs2: number;
	ncauChiChiaRaChiMoi2: number;
	ncauChiChiaRaChiDtqg: number;
	ncauChiChiaRaChiCs3: number;
	ncauChiChiaRaChiMoi3: number;
	ghiChu: string;
}

@Component({
	selector: 'app-bieu-mau-18',
	templateUrl: './bieu-mau-18.component.html',
	styleUrls: ['../../bao-cao.component.scss']
})
export class BieuMau18Component implements OnInit {
	@Input() dataInfo;
	//thong tin chi tiet cua bieu mau
	formDetail: Form = new Form();
	total: ItemData = new ItemData();
	maDviTien: string = '1';
	//danh muc
	linhVucChis: any[] = [];
	lstCtietBcao: ItemData[] = [];
	donViTiens: any[] = DON_VI_TIEN;
	keys = ['ncauChiTongSo', 'ncauChiTrongDoChiCs', 'ncauChiTrongDoChiMoi', 'ncauChiChiaRaDtuPtrien', 'ncauChiChiaRaChiCs1', 'ncauChiChiaRaChiMoi1',
		'ncauChiChiaRaChiTx', 'ncauChiChiaRaChiCs2', 'ncauChiChiaRaChiMoi2', 'ncauChiChiaRaChiCs3', 'ncauChiChiaRaChiMoi3', 'ncauChiChiaRaChiDtqg']
	amount = AMOUNT;
	scrollX: string;
	//trang thai cac nut
	status: BtnStatus = new BtnStatus();
	editMoneyUnit = false;
	isDataAvailable = false;
	//nho dem
	editCache: { [key: string]: { edit: boolean; data: ItemData } } = {};

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
		private danhMucService: DanhMucDungChungService,
		private lapThamDinhService: LapThamDinhService,
		private notification: NzNotificationService,
		private modal: NzModalService,
		public numFunc: NumberFunction,
		public gen: GeneralFunction,
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
		if (this.status.general) {
			const category = await this.danhMucService.danhMucChungGetAll('LTD_TT69_BM18');
			if (category) {
				this.linhVucChis = category.data;
			}
			this.scrollX = this.gen.tableWidth(350, 12, 5, 60);
		} else {
			this.scrollX = this.gen.tableWidth(350, 12, 5, 0);
		}
		if (this.lstCtietBcao.length == 0) {
			this.linhVucChis.forEach(e => {
				this.lstCtietBcao.push({
					...new ItemData(),
					id: uuid.v4() + 'FE',
					stt: e.ma,
					maLvuc: e.ma,
					tenLvuc: e.giaTri,
				})
			})
		} else if (!this.lstCtietBcao[0]?.stt) {
			this.lstCtietBcao.forEach(item => {
				item.stt = item.maLvuc;
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

		if (this.lstCtietBcao.some(e => e.ncauChiTongSo > MONEY_LIMIT)) {
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

	// chuyển đổi stt đang được mã hóa thành dạng I, II, a, b, c, ...
	getChiMuc(str: string): string {
		str = str.substring(str.indexOf('.') + 1, str.length);
		const chiSo: string[] = str.split('.');
		const n: number = chiSo.length - 1;
		let k: number = parseInt(chiSo[n], 10);
		switch (n) {
			case 0:
				return this.gen.laMa(k);
			case 1:
				return chiSo[n];
			case 2:
				return chiSo[n - 1].toString() + "." + chiSo[n].toString();
			case 3:
				return String.fromCharCode(k + 96);
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

	changeModel(id: string): void {
		this.editCache[id].data.ncauChiChiaRaDtuPtrien = this.numFunc.sum([this.editCache[id].data.ncauChiChiaRaChiCs1, this.editCache[id].data.ncauChiChiaRaChiMoi1]);
		this.editCache[id].data.ncauChiChiaRaChiTx = this.numFunc.sum([this.editCache[id].data.ncauChiChiaRaChiCs2, this.editCache[id].data.ncauChiChiaRaChiMoi2]);
		this.editCache[id].data.ncauChiTrongDoChiCs = this.numFunc.sum([this.editCache[id].data.ncauChiChiaRaChiCs1, this.editCache[id].data.ncauChiChiaRaChiCs2]);
		this.editCache[id].data.ncauChiTrongDoChiMoi = this.numFunc.sum([this.editCache[id].data.ncauChiChiaRaChiMoi1, this.editCache[id].data.ncauChiChiaRaChiMoi2]);
		this.editCache[id].data.ncauChiChiaRaChiDtqg = this.numFunc.sum([this.editCache[id].data.ncauChiChiaRaChiCs3, this.editCache[id].data.ncauChiChiaRaChiMoi3]);
		this.editCache[id].data.ncauChiTongSo = this.numFunc.sum([this.editCache[id].data.ncauChiTrongDoChiCs, this.editCache[id].data.ncauChiTrongDoChiMoi]);
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
				tenLvuc: data.tenLvuc,
				maLvuc: data.maLvuc,
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

	exportToExcel() {
		const header = [
			{ t: 0, b: 3, l: 0, r: 18, val: null },
			{ t: 0, b: 3, l: 0, r: 0, val: 'STT' },
			{ t: 0, b: 3, l: 1, r: 1, val: 'Lĩnh vực chi' },
			{ t: 0, b: 3, l: 2, r: 2, val: 'Mục tiêu, nhiệm vụ' },
			{ t: 0, b: 3, l: 3, r: 3, val: 'Cơ sở pháp lý/ thực tiễn' },
			{ t: 0, b: 3, l: 4, r: 4, val: 'Hoạt động chủ yếu' },
			{ t: 0, b: 3, l: 5, r: 5, val: 'Nguồn kinh phí' },
			{ t: 0, b: 0, l: 6, r: 17, val: 'Nhu cầu chi' },
			{ t: 1, b: 3, l: 6, r: 6, val: 'Tổng số' },
			{ t: 1, b: 1, l: 7, r: 8, val: 'Trong đó' },
			{ t: 2, b: 3, l: 7, r: 7, val: 'Chi cơ sở' },
			{ t: 2, b: 3, l: 8, r: 8, val: 'Chi mới' },
			{ t: 1, b: 1, l: 9, r: 17, val: 'Chia ra' },
			{ t: 2, b: 3, l: 9, r: 9, val: 'Đầu tư phát triển' },
			{ t: 2, b: 2, l: 10, r: 11, val: 'Trong đó' },
			{ t: 3, b: 3, l: 10, r: 10, val: 'Chi cơ sở' },
			{ t: 3, b: 3, l: 11, r: 11, val: 'Chi mới' },
			{ t: 2, b: 3, l: 12, r: 12, val: 'Chi thường xuyên' },
			{ t: 2, b: 2, l: 13, r: 14, val: 'Trong đó' },
			{ t: 3, b: 3, l: 13, r: 13, val: 'Chi cơ sở' },
			{ t: 3, b: 3, l: 14, r: 14, val: 'Chi mới' },
			{ t: 2, b: 3, l: 15, r: 15, val: 'Chi DTQG' },
			{ t: 2, b: 2, l: 16, r: 17, val: 'Trong đó' },
			{ t: 3, b: 3, l: 16, r: 16, val: 'Chi cơ sở' },
			{ t: 3, b: 3, l: 17, r: 17, val: 'Chi mới' },
			{ t: 0, b: 3, l: 18, r: 18, val: 'Ghi chú' },
		]
		const fieldOrder = ['stt', 'tenLvuc', 'mtieuNvu', 'csPhapLyThien', 'hdongChuYeu', 'nguonKphi', 'ncauChiTongSo', 'ncauChiTrongDoChiCs', 'ncauChiTrongDoChiMoi', 'ncauChiChiaRaDtuPtrien',
			'ncauChiChiaRaChiCs1', 'ncauChiChiaRaChiMoi1', 'ncauChiChiaRaChiTx', 'ncauChiChiaRaChiCs2', 'ncauChiChiaRaChiMoi2', 'ncauChiChiaRaChiDtqg', 'ncauChiChiaRaChiCs3', 'ncauChiChiaRaChiMoi3', 'ghiChu']
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
		const worksheet = this.gen.initExcel(header);
		XLSX.utils.sheet_add_json(worksheet, filterData, { skipHeader: true, origin: this.gen.coo(header[0].l, header[0].b + 1) })
		XLSX.utils.book_append_sheet(workbook, worksheet, 'Dữ liệu');
		XLSX.writeFile(workbook, this.dataInfo.maBcao + '_TT69_18.xlsx');
	}

}
