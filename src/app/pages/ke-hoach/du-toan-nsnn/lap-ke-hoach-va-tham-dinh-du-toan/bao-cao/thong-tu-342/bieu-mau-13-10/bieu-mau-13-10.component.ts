
import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { Operator, Status, Table, Utils } from "src/app/Utility/utils";
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { DanhMucDungChungService } from 'src/app/services/danh-muc-dung-chung.service';
import { LapThamDinhService } from 'src/app/services/quan-ly-von-phi/lapThamDinh.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import * as uuid from "uuid";
import * as XLSX from 'xlsx';
import { BtnStatus, Doc, Form } from '../../../lap-ke-hoach-va-tham-dinh-du-toan.constant';

export class ItemData {
	id: string;
	stt: string;
	level: number;
	maNdung: string;
	tenDmuc: string;
	uocThien: number;
	namSoDtuong: number;
	namDtoanGiao: number;
	namUocThien: number;
	khSoDtuong: number;
	khMucTcap: number;
	chenhLech: number;
	ghiChu: string;
	khDtoanNamSluong: number;
	khDtoanNamDgia: number;
	khDtoanNamTtien: number;
	gtriTdinhSluong: number;
	gtriTdinhDgia: number;
	gtriTdinhTtien: number;
	ykienDviCtren: string;

	constructor(data: Partial<Pick<ItemData, keyof ItemData>>) {
		Object.assign(this, data);
	}

	changeModel() {
		this.khDtoanNamTtien = Operator.mul(this.khDtoanNamSluong, this.khDtoanNamDgia);
		this.gtriTdinhTtien = Operator.mul(this.gtriTdinhSluong, this.gtriTdinhDgia);
		this.chenhLech = Operator.sum([this.gtriTdinhTtien, -this.khDtoanNamTtien]);
	}

	upperBound() {
		return this.uocThien > Utils.MONEY_LIMIT || this.namUocThien > Utils.MONEY_LIMIT || this.khDtoanNamTtien > Utils.MONEY_LIMIT || this.gtriTdinhTtien > Utils.MONEY_LIMIT;
	}

	index() {
		const str = this.stt.substring(this.stt.indexOf('.') + 1, this.stt.length);
		const chiSo: string[] = str.split('.');
		const n: number = chiSo.length - 1;
		switch (n) {
			case 0:
				return chiSo[n];
			case 1:
				return '';
		}
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
			if (!['level', 'khDtoanNamSluong', 'khDtoanNamDgia', 'gtriTdinhSluong'].includes(key) && (typeof this[key] == 'number' || typeof data[key] == 'number')) {
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
	selector: 'app-bieu-mau-13-10',
	templateUrl: './bieu-mau-13-10.component.html',
	styleUrls: ['../../bao-cao.component.scss']
})

export class BieuMau1310Component implements OnInit {
	@Input() dataInfo;
	Op = new Operator('1');
	Utils = Utils;
	//thong tin chi tiet cua bieu mau
	formDetail: Form = new Form();
	total: ItemData = new ItemData({});
	maDviTien: string = '1';
	namBcao: number;
	//danh muc
	duAns: any[] = [];
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
		private quanLyVonPhiService: QuanLyVonPhiService,
		private danhMucService: DanhMucDungChungService,
		private notification: NzNotificationService,
		private modal: NzModalService,
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
			const category = await this.danhMucService.danhMucChungGetAll('LTD_TT342_BM1310');
			if (category) {
				this.duAns = category.data;
			}
			this.scrollX = Table.tableWidth(350, 9, 1, 110);
		} else {
			if (this.status.editAppVal) {
				this.scrollX = Table.tableWidth(350, 13, 2, 60);
			} else if (this.status.viewAppVal) {
				this.scrollX = Table.tableWidth(350, 13, 2, 0);
			} else {
				this.scrollX = Table.tableWidth(350, 9, 1, 0);
			}
		}
		if (this.lstCtietBcao.length == 0) {
			this.duAns.forEach(e => {
				this.lstCtietBcao.push(new ItemData({
					id: uuid.v4() + 'FE',
					stt: e.ma,
					tenDmuc: e.giaTri,
					maNdung: e.ma,
				}))
			})
		} else if (!this.lstCtietBcao[0]?.stt) {
			this.lstCtietBcao.forEach(item => {
				item.stt = item.maNdung;
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

		if (this.status.general) {
			lstCtietBcaoTemp?.forEach(item => {
				item.gtriTdinhSluong = item.khDtoanNamSluong;
				item.gtriTdinhDgia = item.khDtoanNamDgia;
				item.gtriTdinhTtien = item.khDtoanNamTtien;
				item.chenhLech = Operator.sum([item.gtriTdinhTtien, -item.khDtoanNamTtien]);
			})
		}

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
				data: new ItemData(item)
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
			data: new ItemData(this.lstCtietBcao[index]),
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
		this.lstCtietBcao = Table.addChild(id, new ItemData({}), this.lstCtietBcao);
		this.updateEditCache();
	}

	sum(stt: string) {
		stt = Table.preIndex(stt);
		while (stt != '0') {
			const index = this.lstCtietBcao.findIndex(e => e.stt == stt);
			this.lstCtietBcao[index].clear();
			this.lstCtietBcao.forEach(item => {
				if (Table.preIndex(item.stt) == stt) {
					this.lstCtietBcao[index].sum(item);
				}
			})
			stt = Table.preIndex(stt);
		}
		this.getTotal();
	}

	getTotal() {
		this.total.clear();
		this.lstCtietBcao.forEach(item => {
			if (item.level == 0) {
				this.total.sum(item);
			}
		})
	}

	checkEdit(stt: string) {
		const lstTemp = this.lstCtietBcao.filter(e => e.stt !== stt);
		return lstTemp.every(e => !e.stt.startsWith(stt));
	}

	checkAdd(data: ItemData) {
		if ((data.level == 0 && data.maNdung)) {
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
		await this.quanLyVonPhiService.downFile(file, doc);
	}

	exportToExcel() {
		if (this.lstCtietBcao.some(e => this.editCache[e.id].edit)) {
			this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTSAVE);
			return;
		}
		let header = [];
		let fieldOrder = [];
		let calHeader = [];
		if (this.status.viewAppVal) {
			header = [
				{ t: 0, b: 6, l: 0, r: 16, val: null },
				{ t: 0, b: 0, l: 0, r: 1, val: this.dataInfo.tenPl },
				{ t: 1, b: 1, l: 0, r: 8, val: this.dataInfo.tieuDe },
				{ t: 2, b: 2, l: 0, r: 8, val: this.dataInfo.congVan },
				{ t: 4, b: 6, l: 0, r: 0, val: 'STT' },
				{ t: 4, b: 6, l: 1, r: 1, val: 'Nội dung' },
				{ t: 4, b: 6, l: 2, r: 2, val: 'Ước thực hiện năm ' + (this.namBcao - 2).toString() },
				{ t: 4, b: 4, l: 3, r: 5, val: 'Năm ' + (this.namBcao - 1).toString() },
				{ t: 5, b: 6, l: 3, r: 3, val: 'Số đối tượng' },
				{ t: 5, b: 6, l: 4, r: 4, val: 'Dự toán được giao' },
				{ t: 5, b: 6, l: 5, r: 5, val: 'Ước thực hiện' },
				{ t: 4, b: 4, l: 6, r: 10, val: 'Kế hoạch năm ' + this.namBcao.toString() },
				{ t: 5, b: 6, l: 6, r: 6, val: 'Số đối tượng' },
				{ t: 5, b: 6, l: 7, r: 7, val: 'Mức trợ cấp/Mức chi' },
				{ t: 5, b: 5, l: 8, r: 10, val: 'Dự toán năm ' + this.namBcao.toString() },
				{ t: 6, b: 6, l: 8, r: 8, val: 'Số lượng' },
				{ t: 6, b: 6, l: 9, r: 9, val: 'Đơn giá' },
				{ t: 6, b: 6, l: 10, r: 10, val: 'Thành tiền' },
				{ t: 4, b: 5, l: 11, r: 13, val: 'Thẩm định dự toán năm ' + this.namBcao.toString() },
				{ t: 6, b: 6, l: 11, r: 11, val: 'Số lượng' },
				{ t: 6, b: 6, l: 12, r: 12, val: 'Đơn giá' },
				{ t: 6, b: 6, l: 13, r: 13, val: 'Thành tiền' },
				{ t: 4, b: 6, l: 14, r: 14, val: 'Chênh lệch giữa thẩm định của DVCT và nhu cầu của DVCD' },
				{ t: 4, b: 6, l: 15, r: 15, val: 'Ghi chú' },
				{ t: 4, b: 6, l: 16, r: 16, val: 'Ý kiến của đơn vị cấp trên' },
			]
			fieldOrder = ['stt', 'tenDmuc', 'uocThien', 'namSoDtuong', 'namDtoanGiao', 'namUocThien', 'khSoDtuong', 'khMucTcap', 'khDtoanNamSluong', 'khDtoanNamDgia', 'khDtoanNamTtien',
				'gtriTdinhSluong', 'gtriTdinhDgia', 'gtriTdinhTtien', 'chenhLech', 'ghiChu', 'ykienDviCtren'];
			calHeader = ['A', 'B', '1', '2', '3', '4', '5', '6', '7', '8', '9=7*8', '10', '11', '12=10*11', '13=12-9', '14', '15'];
		} else {
			header = [
				{ t: 0, b: 6, l: 0, r: 11, val: null },
				{ t: 0, b: 0, l: 0, r: 1, val: this.dataInfo.tenPl },
				{ t: 1, b: 1, l: 0, r: 8, val: this.dataInfo.tieuDe },
				{ t: 2, b: 2, l: 0, r: 8, val: this.dataInfo.congVan },
				{ t: 4, b: 6, l: 0, r: 0, val: 'STT' },
				{ t: 4, b: 6, l: 1, r: 1, val: 'Nội dung' },
				{ t: 4, b: 6, l: 2, r: 2, val: 'Ước thực hiện năm ' + (this.namBcao - 2).toString() },
				{ t: 4, b: 4, l: 3, r: 5, val: 'Năm ' + (this.namBcao - 1).toString() },
				{ t: 5, b: 6, l: 3, r: 3, val: 'Số đối tượng' },
				{ t: 5, b: 6, l: 4, r: 4, val: 'Dự toán được giao' },
				{ t: 5, b: 6, l: 5, r: 5, val: 'Ước thực hiện' },
				{ t: 4, b: 4, l: 6, r: 10, val: 'Kế hoạch năm ' + this.namBcao.toString() },
				{ t: 5, b: 6, l: 6, r: 6, val: 'Số đối tượng' },
				{ t: 5, b: 6, l: 7, r: 7, val: 'Mức trợ cấp/Mức chi' },
				{ t: 5, b: 5, l: 8, r: 10, val: 'Dự toán năm ' + this.namBcao.toString() },
				{ t: 6, b: 6, l: 8, r: 8, val: 'Số lượng' },
				{ t: 6, b: 6, l: 9, r: 9, val: 'Đơn giá' },
				{ t: 6, b: 6, l: 10, r: 10, val: 'Thành tiền' },
				{ t: 4, b: 6, l: 11, r: 11, val: 'Ghi chú' },
			]
			fieldOrder = ['stt', 'tenDmuc', 'uocThien', 'namSoDtuong', 'namDtoanGiao', 'namUocThien', 'khSoDtuong', 'khMucTcap', 'khDtoanNamSluong', 'khDtoanNamDgia', 'khDtoanNamTtien',
				'ghiChu'];
			calHeader = ['A', 'B', '1', '2', '3', '4', '5', '6', '7', '8', '9=7*8', '10'];
		}

		const filterData = this.lstCtietBcao.map(item => {
			const row: any = {};
			fieldOrder.forEach(field => {
				row[field] = field == 'stt' ? item.index() : ((!item[field] && item[field] !== 0) ? '' : item[field]);
			})
			return row;
		})
		let row: any = {};
		fieldOrder.forEach(field => {
			if (field == 'tenDmuc') {
				row[field] = 'Tổng cộng'
			} else {
				if (!['namSoDtuong', 'khSoDtuong', 'khDtoanNamSluong', 'khDtoanNamDgia', 'gtriTdinhSluong', 'gtriTdinhDgia'].includes(field)) {
					row[field] = (!this.total[field] && this.total[field] !== 0) ? '' : this.total[field];
				} else {
					row[field] = '';
				}
			}
		})
		filterData.unshift(row);
		// thêm công thức tính cho biểu mẫu
		let cal = {};
		fieldOrder.forEach((field, index) => {
			cal[field] = calHeader[index];
		})
		filterData.unshift(cal);
		const workbook = XLSX.utils.book_new();
		const worksheet = Table.initExcel(header);
		XLSX.utils.sheet_add_json(worksheet, filterData, { skipHeader: true, origin: Table.coo(header[0].l, header[0].b + 1) })
		XLSX.utils.book_append_sheet(workbook, worksheet, 'Dữ liệu');
		XLSX.writeFile(workbook, this.dataInfo.maBcao + '_TT342_13.10.xlsx');
	}
}


