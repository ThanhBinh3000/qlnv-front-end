
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
import { BtnStatus, Doc, Form } from '../../../lap-ke-hoach-va-tham-dinh-du-toan.class';
import * as XLSX from 'xlsx'

export class ItemData {
	id: string;
	stt: string;
	level: number;
	maDtaiDan: string;
	tenDmuc: string;
	coQuanCtri: string;
	tgianThien: '';
	qdinhPduyet: string;
	kphiPduyetTso: number;
	kphiPduyetNsnn: number;
	kphiPduyetNkhac: number;
	kphiThienNamTso: number;
	kphiThienNamNsnnDtoan: number;
	kphiThienNamNsnnUth: number;
	kphiThienNamKphiThien: number;
	kphiThienLkeTso: number;
	kphiThienLkeNsnn: number;
	kphiThienLkeNkhac: number;
	kphiThienDtoanTso: number;
	kphiThienDtoanNsnn: number;
	kphiThienDtoanNkhac: number;
	ghiChu: string;
}


@Component({
	selector: 'app-bieu-mau-13-3',
	templateUrl: './bieu-mau-13-3.component.html',
	styleUrls: ['../../bao-cao.component.scss']
})
export class BieuMau133Component implements OnInit {
	@Input() dataInfo;
	Op = Operator;
	Utils = Utils;
	//thong tin chi tiet cua bieu mau
	formDetail: Form = new Form();
	total: ItemData = new ItemData();
	maDviTien: string = '1';
	namBcao: number;
	//danh muc
	duAns: any[] = [];
	lstCtietBcao: ItemData[] = [];
	keys = ['kphiPduyetTso', 'kphiPduyetNsnn', 'kphiPduyetNkhac', 'kphiThienNamTso', 'kphiThienNamNsnnDtoan', 'kphiThienNamNsnnUth', 'kphiThienNamKphiThien',
		'kphiThienLkeTso', 'kphiThienLkeNsnn', 'kphiThienLkeNkhac', 'kphiThienDtoanTso', 'kphiThienDtoanNsnn', 'kphiThienDtoanNkhac'];
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
			const category = await this.danhMucService.danhMucChungGetAll('LTD_TT342_BM133');
			if (category) {
				this.duAns = category.data;
			}
			this.scrollX = Table.tableWidth(350, 13, 4, 110);
		} else {
			this.scrollX = Table.tableWidth(650, 13, 4, 0);
		}

		if (this.lstCtietBcao.length == 0) {
			this.duAns.forEach(e => {
				this.lstCtietBcao.push({
					...new ItemData(),
					id: uuid.v4() + 'FE',
					stt: e.ma,
					tenDmuc: e.giaTri,
					maDtaiDan: e.ma,
				})
			})
		} else if (!this.lstCtietBcao[0]?.stt) {
			this.lstCtietBcao.forEach(item => {
				item.stt = item.maDtaiDan;
			})
		}

		this.lstCtietBcao = Table.sortByIndex(this.lstCtietBcao);

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

	// luu
	async save(trangThai: string, lyDoTuChoi: string) {
		if (this.lstCtietBcao.some(e => this.editCache[e.id].edit)) {
			this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTSAVE);
			return;
		}

		if (this.lstCtietBcao.some(e => e.kphiPduyetTso > Utils.MONEY_LIMIT || e.kphiThienNamTso > Utils.MONEY_LIMIT || e.kphiThienLkeTso > Utils.MONEY_LIMIT || e.kphiThienDtoanTso > Utils.MONEY_LIMIT)) {
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
				return Utils.laMa(parseInt(chiSo[n - 1], 10)) + '.' + chiSo[n];
			case 2:
				return chiSo[n].toString();
			case 3:
				return null;
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
		if (this.lstCtietBcao.every(e => !this.editCache[e.id].edit)) {
			this.editCache[id].edit = true;
		} else {
			this.notification.warning(MESSAGE.WARNING, 'Vui lòng lưu bản ghi đang sửa trước khi thực hiện thao tác');
			return;
		}
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

	addLine(id: string) {
		this.lstCtietBcao = Table.addChild(id, new ItemData(), this.lstCtietBcao);
		this.updateEditCache();
	}

	changeModel(id: string): void {
		this.editCache[id].data.kphiPduyetTso = Operator.sum([this.editCache[id].data.kphiPduyetNsnn, this.editCache[id].data.kphiPduyetNkhac]);
		this.editCache[id].data.kphiThienNamTso = Operator.sum([this.editCache[id].data.kphiThienNamNsnnUth, this.editCache[id].data.kphiThienNamKphiThien]);
		this.editCache[id].data.kphiThienLkeTso = Operator.sum([this.editCache[id].data.kphiThienLkeNsnn, this.editCache[id].data.kphiThienLkeNkhac]);
		this.editCache[id].data.kphiThienDtoanTso = Operator.sum([this.editCache[id].data.kphiThienDtoanNsnn, this.editCache[id].data.kphiThienDtoanNkhac]);
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
				maDtaiDan: data.maDtaiDan,
				tenDmuc: data.tenDmuc,
				level: data.level,
			}
			this.lstCtietBcao.forEach(item => {
				if (Table.preIndex(item.stt) == stt) {
					this.keys.forEach(key => {
						this.lstCtietBcao[index][key] = Operator.sum([this.lstCtietBcao[index][key], item[key]]);
					})
				}
			})
			stt = Table.preIndex(stt);
		}
		this.getTotal();
	}

	getTotal() {
		this.total = new ItemData();
		this.lstCtietBcao.forEach(item => {
			if (item.level == 0) {
				this.keys.forEach(key => {
					this.total[key] = Operator.sum([this.total[key], item[key]]);
				})
			}
		})
	}

	checkEdit(stt: string) {
		const lstTemp = this.lstCtietBcao.filter(e => e.stt !== stt);
		return lstTemp.every(e => !e.stt.startsWith(stt));

	}

	checkAdd(data: ItemData) {
		if (data.level == 1 && data.maDtaiDan) {
			return true;
		}
		return false;
	}

	checkDelete(maDa: string) {
		if (!maDa) {
			return true;
		}
		return false;
	}

	//xóa dòng
	deleteLine(id: string) {
		const stt = this.lstCtietBcao.find(e => e.id === id)?.stt;
		this.lstCtietBcao = Table.deleteRow(id, this.lstCtietBcao);
		this.sum(stt);
		this.updateEditCache();
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
			{ t: 0, b: 3, l: 0, r: 18, val: null },
			{ t: 0, b: 3, l: 0, r: 0, val: 'STT' },
			{ t: 0, b: 3, l: 1, r: 1, val: 'Chương trình/Đề tài/Dự án/Nhiệm vụ/ KH&CN' },
			{ t: 0, b: 3, l: 2, r: 2, val: 'Cơ quan chủ trì' },
			{ t: 0, b: 3, l: 3, r: 3, val: 'Thời gian thực hiện' },
			{ t: 0, b: 3, l: 4, r: 4, val: 'Quyết định phê duyệt của cấp có thẩm quyền' },
			{ t: 0, b: 1, l: 5, r: 7, val: 'Kinh phí được phê duyệt' },
			{ t: 2, b: 3, l: 5, r: 5, val: 'Tổng số' },
			{ t: 2, b: 2, l: 6, r: 7, val: 'Trong đó' },
			{ t: 3, b: 3, l: 6, r: 6, val: 'Nguồn NSNN' },
			{ t: 3, b: 3, l: 7, r: 7, val: 'Nguồn khác' },
			{ t: 0, b: 0, l: 8, r: 17, val: 'Kinh phí thực hiện' },
			{ t: 1, b: 1, l: 8, r: 11, val: 'Năm ' + (this.namBcao - 1).toString() },
			{ t: 2, b: 3, l: 8, r: 8, val: 'Tổng số' },
			{ t: 2, b: 2, l: 9, r: 10, val: 'Kinh phí bố trí từ NSNN' },
			{ t: 3, b: 3, l: 9, r: 9, val: 'Dự toán' },
			{ t: 3, b: 3, l: 10, r: 10, val: 'Ước thực hiện đến hết năm ' + (this.namBcao - 1).toString() },
			{ t: 2, b: 3, l: 11, r: 11, val: 'Kinh phí thực hiện từ nguồn khác' },
			{ t: 1, b: 1, l: 12, r: 14, val: 'Lũy kế số kinh phí bố trí đến hết năm ' + (this.namBcao - 1).toString() },
			{ t: 2, b: 3, l: 12, r: 12, val: 'Tổng số' },
			{ t: 2, b: 3, l: 13, r: 13, val: 'Nguồn NSNN' },
			{ t: 2, b: 3, l: 14, r: 14, val: 'Nguồn khác' },
			{ t: 1, b: 1, l: 15, r: 17, val: 'Dự toán bố trí năm ' + this.namBcao.toString() },
			{ t: 2, b: 3, l: 15, r: 15, val: 'Tổng số' },
			{ t: 2, b: 3, l: 16, r: 16, val: 'Nguồn NSNN' },
			{ t: 2, b: 3, l: 17, r: 17, val: 'Nguồn khác' },
			{ t: 0, b: 3, l: 18, r: 18, val: 'Ghi chú' },
		]
		const fieldOrder = ['stt', 'tenDmuc', 'coQuanCtri', 'tgianThien', 'qdinhPduyet', 'kphiPduyetTso', 'kphiPduyetNsnn', 'kphiPduyetNkhac', 'kphiThienNamTso', 'kphiThienNamNsnnDtoan',
			'kphiThienNamNsnnUth', 'kphiThienNamKphiThien', 'kphiThienLkeTso', 'kphiThienLkeNsnn', 'kphiThienLkeNkhac', 'kphiThienDtoanTso', 'kphiThienDtoanNsnn', 'kphiThienDtoanNkhac', 'ghiChu']

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
		XLSX.writeFile(workbook, this.dataInfo.maBcao + '_TT342_13.3.xlsx');
	}
}

