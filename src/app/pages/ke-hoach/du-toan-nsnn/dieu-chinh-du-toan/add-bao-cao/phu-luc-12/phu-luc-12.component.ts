import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { FileManip, Operator, Status, Table, Utils } from 'src/app/Utility/utils';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { DieuChinhService } from 'src/app/services/quan-ly-von-phi/dieuChinhDuToan.service';
import { UserService } from 'src/app/services/user.service';
import * as uuid from "uuid";
import * as XLSX from 'xlsx';
import { BtnStatus, Doc, Form } from '../../dieu-chinh-du-toan.constant';
import { DANH_MUC } from './phu-luc-12.constant';

export class ItemData {
	level: any;
	id: string;
	stt: string;
	tenNoiDung: string;
	maNoiDung: string;
	coQuan: string;
	thoiGian: string;
	qDinhPheDuyet: number;
	dToanNamTruoc: number;
	dToanDaGiao: number;
	dToanTongSo: number;
	tongNcauDtoan: number;
	dtoanDnghiDchinh: number;
	dtoanVuTvqtDnghi: number;
	chenhLech: number;
	ghiChu: string;
	ykienDviCtren: string;
}

@Component({
	selector: 'app-phu-luc-12',
	templateUrl: './phu-luc-12.component.html',
	styleUrls: ['../add-bao-cao.component.scss'],
})
export class PhuLuc12Component implements OnInit {
	@Input() dataInfo;
	Op = new Operator('1');
	Utils = Utils;
	//thong tin chi tiet cua bieu mau
	formDetail: Form = new Form();
	total: ItemData = new ItemData();
	maDviTien: string = '1';
	namBcao: number;
	tongDieuChinhGiam: number;
	tongDieuChinhTang: number;
	dToanVuTang: number;
	dToanVuGiam: number;
	//danh muc
	noiDungs: any[] = DANH_MUC;
	lstCtietBcao: ItemData[] = [];
	keys = [
		"dToanNamTruoc",
		"dToanDaGiao",
		"dToanTongSo",
		"tongNcauDtoan",
		"dtoanDnghiDchinh",
		"dtoanVuTvqtDnghi",
		"chenhLech"
	]
	lstVatTuFull: any[] = [];
	dsDinhMuc: any[] = [];
	scrollX: string;
	//trang thai cac nut
	status: BtnStatus = new BtnStatus();
	editMoneyUnit = false;
	isDataAvailable = false;
	allChecked = false;
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
		private spinner: NgxSpinnerService,
		public userService: UserService,
		private modal: NzModalService,
		private _modalRef: NzModalRef,
		private notification: NzNotificationService,
		private dieuChinhDuToanService: DieuChinhService,
		private fileManip: FileManip,
	) { }

	ngOnInit() {
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
			// const category = await this.danhMucService.danhMucChungGetAll('LTD_PL2');
			// if (category) {
			// 	this.linhVucChis = category.data;
			// }
			this.scrollX = Table.tableWidth(350, 10, 1, 110);
		} else {
			if (this.status.editAppVal) {
				this.scrollX = Table.tableWidth(350, 14, 2, 60);
			} else if (this.status.viewAppVal) {
				this.scrollX = Table.tableWidth(350, 14, 2, 0);
			} else {
				this.scrollX = Table.tableWidth(350, 10, 1, 0);
			}
		}

		if (this.lstCtietBcao.length == 0) {
			this.noiDungs.forEach(e => {
				this.lstCtietBcao.push({
					...new ItemData(),
					id: uuid.v4() + 'FE',
					stt: e.ma,
					tenNoiDung: e.giaTri,
					maNoiDung: e.ma,
				})
			})
			this.setLevel();
			// this.lstCtietBcao.forEach(item => {
			// 	item.tenNoiDung += Utils.getName(item.level, item.maNoiDung);
			// })
		} else if (!this.lstCtietBcao[0]?.stt) {
			this.lstCtietBcao.forEach(item => {
				item.stt = item.maNoiDung;
			})
		}

		if (this.lstCtietBcao.length > 0) {
			if (!this.lstCtietBcao[0]?.stt) {
				this.lstCtietBcao = Table.sortWithoutIndex(this.lstCtietBcao, 'maNoiDung');
			} else {
				this.lstCtietBcao = Table.sortByIndex(this.lstCtietBcao);
			}
		}

		// this.lstCtietBcao.forEach(item => {
		// 	item.tenNoiDung = this.noiDungs.find(e => e.ma == item.maNoiDung)?.giaTri;
		// })

		this.getTotal();
		this.tinhTong();
		this.updateEditCache();
		this.getStatusButton();

		this.spinner.hide();
	};

	async getFormDetail() {
		await this.dieuChinhDuToanService.ctietBieuMau(this.dataInfo.id).toPromise().then(
			data => {
				if (data.statusCode == 0) {
					this.formDetail = data.data;
					this.formDetail.maDviTien = '1';
					this.lstCtietBcao = this.formDetail.lstCtietDchinh;
					this.listFile = [];
					this.formDetail.listIdDeleteFiles = [];
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

	setLevel() {
		this.lstCtietBcao.forEach(item => {
			const str: string[] = item.stt.split('.');
			item.level = str.length - 2;
		})
	}

	getStatusButton() {
		this.status.ok = this.status.ok && (this.formDetail.trangThai == Status.NOT_RATE || this.formDetail.trangThai == Status.COMPLETE);
	};

	getIndex(str: string): string {
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
				return "-";
			case 4:
				return String.fromCharCode(k + 96);
			case 4:
				return "-";
			default:
				return null;
		}
	}

	updateEditCache(): void {
		this.lstCtietBcao.forEach(item => {
			this.editCache[item.id] = {
				edit: false,
				data: { ...item }
			};
		});
	};

	async save(trangThai: string, lyDoTuChoi: string) {
		if (this.lstCtietBcao.some(e => this.editCache[e.id].edit)) {
			this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTSAVE);
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
			lstCtietBcaoTemp?.forEach(item => {
				item.dtoanVuTvqtDnghi = item.dtoanDnghiDchinh;
			})
		}

		const request = JSON.parse(JSON.stringify(this.formDetail));

		request.fileDinhKems = [];
		for (let iterator of this.listFile) {
			request.fileDinhKems.push(await this.fileManip.uploadFile(iterator, this.dataInfo.path));
		}

		request.lstCtietDchinh = lstCtietBcaoTemp;
		request.trangThai = trangThai;

		if (lyDoTuChoi) {
			request.lyDoTuChoi = lyDoTuChoi;
		}

		this.spinner.show();
		this.dieuChinhDuToanService.updatePLDieuChinh(request).toPromise().then(
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
	};

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
	};

	doPrint() {

	};

	sum(stt: string) {
		stt = Table.preIndex(stt);
		while (stt != '0') {
			const index = this.lstCtietBcao.findIndex(e => e.stt == stt);
			const data = this.lstCtietBcao[index];
			this.lstCtietBcao[index] = {
				...new ItemData(),
				id: data.id,
				stt: data.stt,
				tenNoiDung: data.tenNoiDung,
				level: data.level,
				maNoiDung: data.maNoiDung,
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
		// this.tinhTong();
	};

	addLine(data: any) {
		let parentItem: ItemData = this.lstCtietBcao.find(e => Table.preIndex(e.stt) == data.stt);
		parentItem = {
			...new ItemData(),
			id: uuid.v4() + 'FE',
			maNoiDung: "",
			level: data.level + 1,
			tenNoiDung: "",
		}
		this.lstCtietBcao = Table.addChild(data.id, parentItem, this.lstCtietBcao);
		this.updateEditCache();
	};

	addLow(id: string, initItem: ItemData) {
		this.lstCtietBcao = Table.addChild(id, initItem, this.lstCtietBcao);
	};

	checkDelete(stt: string) {
		const level = stt.split('.').length - 2;
		if (level == 3) {
			return true;
		}
		return false;
	};

	deleteLine(id: string) {
		const stt = this.lstCtietBcao.find(e => e.id === id)?.stt;
		this.lstCtietBcao = Table.deleteRow(id, this.lstCtietBcao);
		this.sum(stt);
		this.updateEditCache();
	}

	handleCancel() {
		this._modalRef.close();
	};

	changeModel(id: string): void {
		this.editCache[id].data.dToanTongSo = Operator.sum([this.editCache[id].data.dToanNamTruoc, this.editCache[id].data.dToanDaGiao]);
		this.editCache[id].data.dtoanDnghiDchinh = Operator.sum([this.editCache[id].data.tongNcauDtoan, - this.editCache[id].data.dToanTongSo]);
		this.editCache[id].data.chenhLech = Operator.sum([this.editCache[id].data.dtoanVuTvqtDnghi, - this.editCache[id].data.dtoanDnghiDchinh]);
	};

	getLowStatus(str: string) {
		return this.lstCtietBcao.findIndex(e => Table.preIndex(e.stt) == str) != -1;
	};

	checkEdit(stt: string) {
		const lstTemp = this.lstCtietBcao.filter(e => e.stt !== stt);
		return lstTemp.every(e => !e.stt.startsWith(stt));
	}

	startEdit(id: string): void {
		this.editCache[id].edit = true;
	};

	saveEdit(id: string): void {
		const index = this.lstCtietBcao.findIndex(item => item.id === id); // lay vi tri hang minh sua
		Object.assign(this.lstCtietBcao[index], this.editCache[id].data); // set lai data cua lstCtietBcao[index] = this.editCache[id].data
		this.editCache[id].edit = false; // CHUYEN VE DANG TEXT
		this.sum(this.lstCtietBcao[index].stt);
		this.getTotal()
		this.updateEditCache();
	};

	cancelEdit(id: string): void {
		const index = this.lstCtietBcao.findIndex(item => item.id === id);
		// lay vi tri hang minh sua
		this.editCache[id] = {
			data: { ...this.lstCtietBcao[index] },
			edit: false
		};
	};
	checkAdd(data: ItemData) {
		if (
			data.level == 2
		) {
			return true;
		}
		return false;
	};

	getTotal() {
		this.total = new ItemData();
		this.lstCtietBcao.forEach(item => {
			if (item.level == 0) {
				this.keys.forEach(key => {
					this.total[key] = Operator.sum([this.total[key], item[key]]);
				})
			}
		})
	};


	tinhTong() {
		this.tongDieuChinhGiam = 0;
		this.tongDieuChinhTang = 0;
		this.dToanVuTang = 0;
		this.dToanVuGiam = 0;
		this.lstCtietBcao.forEach(item => {
			const str = item.stt
			if (!(this.lstCtietBcao.findIndex(e => Table.preIndex(e.stt) == str) != -1)) {
				if (item.dtoanDnghiDchinh < 0) {
					Number(this.tongDieuChinhGiam += Number(item?.dtoanDnghiDchinh));
				} else {
					Number(this.tongDieuChinhTang += Number(item?.dtoanDnghiDchinh));
				}

				if (item.dtoanVuTvqtDnghi < 0) {
					Number(this.dToanVuGiam += Number(item?.dtoanVuTvqtDnghi));
				} else {
					Number(this.dToanVuTang += Number(item?.dtoanVuTvqtDnghi));
				}
			}
		})
	};

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
			{ t: 0, b: 3, l: 0, r: 13, val: null },
			{ t: 0, b: 2, l: 0, r: 0, val: 'STT' },
			{ t: 0, b: 2, l: 1, r: 1, val: 'Chương Trình/ Đề tài/ Dự án/ Nhiệm vụ HK&CN' },
			{ t: 0, b: 2, l: 2, r: 2, val: 'Cơ quan chủ trì' },
			{ t: 0, b: 2, l: 3, r: 3, val: 'Thời gian thực hiện' },
			{ t: 0, b: 2, l: 4, r: 4, val: 'Quyết định phê duyệt của cấp có thẩm quyền' },
			{ t: 0, b: 1, l: 5, r: 7, val: 'Dự toán, kinh phí được sử dụng trong năm' },
			{ t: 0, b: 2, l: 8, r: 8, val: 'Tổng nhu cầu dự toán' },
			{ t: 0, b: 2, l: 9, r: 9, val: 'Dự toán đề nghị điều chỉnh (+ tăng )(- giảm)' },
			{ t: 0, b: 2, l: 10, r: 10, val: 'Dự toán Vụ TVQT đề nghị (+ tăng) (- giảm)' },
			{ t: 0, b: 2, l: 11, r: 11, val: 'Ghi chú' },
			{ t: 0, b: 2, l: 12, r: 12, val: 'Dự toán chênh lệch giữa Vụ TVQT điều chỉnh và đơn vị đề nghị (+tăng) (- giảm)' },
			{ t: 0, b: 2, l: 13, r: 13, val: 'Ý kiến của đơn vị cấp trên' },

			{ t: 2, b: 2, l: 5, r: 5, val: 'Dự toán năm trước chuyển sang được phép sử dụng cho năm nay' },
			{ t: 2, b: 2, l: 6, r: 6, val: 'Dự toán, kinh phí đã giao trong năm' },
			{ t: 2, b: 2, l: 7, r: 7, val: 'Tổng số' },

			{ t: 3, b: 3, l: 0, r: 0, val: 'A' },
			{ t: 3, b: 3, l: 1, r: 1, val: 'B' },
			{ t: 3, b: 3, l: 2, r: 2, val: 'C' },
			{ t: 3, b: 3, l: 3, r: 3, val: 'D' },
			{ t: 3, b: 3, l: 4, r: 4, val: 'E' },
			{ t: 3, b: 3, l: 5, r: 5, val: '1' },
			{ t: 3, b: 3, l: 6, r: 6, val: '2=1+2' },
			{ t: 3, b: 3, l: 7, r: 7, val: '3 = 1 + 2' },
			{ t: 3, b: 3, l: 8, r: 8, val: '4' },
			{ t: 3, b: 3, l: 9, r: 9, val: '5 = 4 - 3 ' },
			{ t: 3, b: 3, l: 10, r: 10, val: '6' },
			{ t: 3, b: 3, l: 11, r: 11, val: '7' },
			{ t: 3, b: 3, l: 12, r: 12, val: '8 = 6 - 5' },
			{ t: 3, b: 3, l: 13, r: 13, val: '9' },
		]
		const fieldOrder = [
			'stt',
			'tenNoiDung',
			'coQuan',
			'thoiGian',
			'qDinhPheDuyet',
			'dToanNamTruoc',
			'dToanDaGiao',
			'dToanTongSo',
			'tongNcauDtoan',
			'dtoanDnghiDchinh',
			'dtoanVuTvqtDnghi',
			'chenhLech',
			'ghiChu',
			'ykienDviCtren',
		]

		const filterData = this.lstCtietBcao.map(item => {
			const row: any = {};
			fieldOrder.forEach(field => {
				row[field] = item[field]
			})
			return row;
		})
		filterData.forEach(item => {
			const level = item.stt.split('.').length - 2;
			item.stt = this.getIndex(item.stt);
			for (let i = 0; i < level; i++) {
				item.stt = '   ' + item.stt;
			}
		})

		const workbook = XLSX.utils.book_new();
		const worksheet = Table.initExcel(header);
		XLSX.utils.sheet_add_json(worksheet, filterData, { skipHeader: true, origin: Table.coo(header[0].l, header[0].b + 1) })
		XLSX.utils.book_append_sheet(workbook, worksheet, 'Dữ liệu');
		XLSX.writeFile(workbook, this.dataInfo.maBcao + '_Phu_luc_II.xlsx');
	}


}
