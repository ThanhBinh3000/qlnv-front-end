import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { FileManip, Operator, Status, Table, Utils } from 'src/app/Utility/utils';
import { DialogDanhSachVatTuHangHoaComponent } from 'src/app/components/dialog/dialog-danh-sach-vat-tu-hang-hoa/dialog-danh-sach-vat-tu-hang-hoa.component';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { LapThamDinhService } from 'src/app/services/quan-ly-von-phi/lapThamDinh.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import * as uuid from 'uuid';
import { BtnStatus, Doc, Form } from '../../../lap-ke-hoach-va-tham-dinh-du-toan.constant';
import * as XLSX from 'xlsx'

export class ItemData {
	id: any;
	stt: string;
	danhMuc: string;
	maDmuc: string;
	tenDanhMuc: string;
	dviTinh: string;
	thienNamTruoc: number;
	dtoanNamHtai: number;
	uocNamHtai: number;
	dmucNamDtoan: number;
	sluongNamDtoan: number;
	ttienNamDtoan: number;
	sluongTd: number;
	ttienTd: number;
	chenhLech: number;
	ghiChu: string;
	ykienDviCtren: string;
	level: any;
	checked: boolean;
}

@Component({
	selector: 'app-phu-luc-01',
	templateUrl: './phu-luc-01.component.html',
	styleUrls: ['../../bao-cao.component.scss']
})

export class PhuLuc01Component implements OnInit {
	@Input() dataInfo;
	Op = new Operator('1');
	Utils = Utils;
	//thong tin chi tiet cua bieu mau
	formDetail: Form = new Form();
	total: ItemData = new ItemData();
	maDviTien: string = '1';
	namBcao: number;
	//danh muc
	linhVucChis: any[] = [];
	lstCtietBcao: ItemData[] = [];
	keys = ['ttienNamDtoan', 'thienNamTruoc', 'dtoanNamHtai', 'uocNamHtai', 'sluongNamDtoan', 'sluongTd', 'ttienTd', 'chenhLech']
	listVattu: any[] = [];
	lstVatTuFull = [];
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
		private _modalRef: NzModalRef,
		private spinner: NgxSpinnerService,
		private lapThamDinhService: LapThamDinhService,
		private notification: NzNotificationService,
		private modal: NzModalService,
		private quanLyVonPhiService: QuanLyVonPhiService,
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
		this.namBcao = this.dataInfo.namBcao;
		if (this.status.general) {
			if (this.dataInfo.maBieuMau == "pl01N") {
				await this.getDinhMuc('01');
			} else {
				await this.getDinhMuc('02');
			}
			this.scrollX = Table.tableWidth(350, 7, 1, 110);
		} else {
			if (this.status.editAppVal) {
				this.scrollX = Table.tableWidth(350, 10, 2, 60);
			} else if (this.status.viewAppVal) {
				this.scrollX = Table.tableWidth(350, 10, 2, 0);
			} else {
				this.scrollX = Table.tableWidth(350, 7, 1, 0);
			}
		}

		if (this.dataInfo?.isSynthetic && this.formDetail.trangThai == Status.NEW) {
			this.lstCtietBcao.forEach(item => {
				const dinhMuc = this.dsDinhMuc.find(e => e.cloaiVthh == item.danhMuc && e.loaiDinhMuc == item.maDmuc);
				if (!item.tenDanhMuc) {
					item.tenDanhMuc = dinhMuc?.tenDinhMuc;
				}
				item.dmucNamDtoan = dinhMuc?.tongDmuc;
				item.dviTinh = dinhMuc?.donViTinh;
				item.ttienNamDtoan = Operator.mul(item.dmucNamDtoan, item.sluongNamDtoan);
				item.ttienTd = Operator.mul(item.dmucNamDtoan, item.sluongTd);
			})
		}
		if (!this.lstCtietBcao[0]?.stt) {
			this.setIndex();
		}
		this.lstCtietBcao = Table.sortByIndex(this.lstCtietBcao);
		this.tinhTong();
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
					Object.assign(this.lstCtietBcao, this.formDetail.lstCtietLapThamDinhs);// this.lstCtietBcao = this.formDetail.lstCtietLapThamDinhs;
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

		if (this.lstCtietBcao.some(e => e.ttienNamDtoan > Utils.MONEY_LIMIT)) {
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
			lstCtietBcaoTemp?.forEach(item => {
				item.sluongTd = item.sluongNamDtoan;
				item.ttienTd = item.ttienNamDtoan;
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


	async getDinhMuc(code: string) {
		const request = {
			loaiDinhMuc: code,
			maDvi: this.dataInfo.maDvi,
		}
		await this.quanLyVonPhiService.getDinhMuc(request).toPromise().then(
			res => {
				if (res.statusCode == 0) {
					this.dsDinhMuc = res.data;
				} else {
					this.notification.error(MESSAGE.ERROR, res?.msg);
				}
			},
			err => {
				this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
			}
		)
	}

	setIndex() {
		const lstVtuTemp = this.lstCtietBcao.filter(e => !e.maDmuc);
		for (let i = 0; i < lstVtuTemp.length; i++) {
			const stt = '0.' + (i + 1).toString();
			const index = this.lstCtietBcao.findIndex(e => e.id == lstVtuTemp[i].id);
			this.lstCtietBcao[index].stt = stt;
			const lstDmTemp = this.lstCtietBcao.filter(e => e.danhMuc == lstVtuTemp[i].danhMuc && !!e.maDmuc);
			for (let j = 0; j < lstDmTemp.length; j++) {
				const ind = this.lstCtietBcao.findIndex(e => e.id == lstDmTemp[j].id);
				this.lstCtietBcao[ind].stt = stt + '.' + (j + 1).toString();
			}
		}
		lstVtuTemp.forEach(item => {
			this.sum(item.stt + '.1');
		})
	}

	checkDelete(stt: string) {
		const level = stt.split('.').length - 2;
		return level == 0;
	}

	// chuyển đổi stt đang được mã hóa thành dạng I, II, a, b, c, ...
	getChiMuc(str: string): string {
		str = str.substring(str.indexOf('.') + 1, str.length);
		const chiSo: any = str.split('.');
		const n: number = chiSo.length - 1;
		switch (n) {
			case 0:
				return chiSo[n];
			case 1:
				return "-";
		}
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
	};

	// xoa tat ca cac dong duoc check
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
		if (this.lstCtietBcao.every(e => !this.editCache[e.id].edit)) {
			this.editCache[id].edit = true;
		} else {
			this.notification.warning(MESSAGE.WARNING, 'Vui lòng lưu bản ghi đang sửa trước khi thực hiện thao tác');
			return;
		}
	}

	// luu thay doi
	saveEdit(id: string): void {
		const index = this.lstCtietBcao.findIndex(item => item.id === id); // lay vi tri hang minh sua
		Object.assign(this.lstCtietBcao[index], this.editCache[id].data); // set lai data cua lstCtietBcao[index] = this.editCache[id].data
		this.editCache[id].edit = false; // CHUYEN VE DANG TEXT
		this.updateEditCache();
		this.sum(this.lstCtietBcao[index].stt);
	}

	// huy thay doi
	cancelEdit(id: string): void {
		const index = this.lstCtietBcao.findIndex(item => item.id === id);
		// lay vi tri hang minh sua
		this.editCache[id] = {
			data: { ...this.lstCtietBcao[index] },
			edit: false
		};
		this.tinhTong();
	}

	// click o checkbox single
	updateSingleChecked(): void {
		if (this.lstCtietBcao.every(item => item.checked || item.level != 0)) {     // tat ca o checkbox deu = true thi set o checkbox all = true
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
		this.lstCtietBcao = Table.deleteRow(id, this.lstCtietBcao);
		this.sum(stt);
		this.updateEditCache();
	}

	selectGoods() {
		const modalTuChoi = this.modal.create({
			nzTitle: 'Danh sách hàng hóa',
			nzContent: DialogDanhSachVatTuHangHoaComponent,
			nzBodyStyle: { overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' },
			nzMaskClosable: false,
			nzClosable: false,
			nzWidth: '900px',
			nzFooter: null,
			nzComponentParams: {},
		});
		modalTuChoi.afterClose.subscribe(async (data) => {
			if (data) {
				if (this.lstCtietBcao.findIndex(e => e.danhMuc == data.ma) == -1) {
					//tim so thu tu cho loai vat tu moi
					let index = 1;
					this.lstCtietBcao.forEach(item => {
						if (item.danhMuc && !item.maDmuc) {
							index += 1;
						}
					})
					const stt = '0.' + index.toString();
					//them vat tu moi vao bang
					this.lstCtietBcao.push({
						... new ItemData(),
						id: uuid.v4() + 'FE',
						stt: stt,
						danhMuc: data.ma,
						tenDanhMuc: data.ten,
						level: 0,
					})
					const lstTemp = this.dsDinhMuc.filter(e => e.cloaiVthh == data.ma);
					for (let i = 1; i <= lstTemp.length; i++) {
						this.lstCtietBcao.push({
							...new ItemData(),
							id: uuid.v4() + 'FE',
							stt: stt + '.' + i.toString(),
							danhMuc: data.ma,
							maDmuc: lstTemp[i - 1].loaiDinhMuc,
							tenDanhMuc: lstTemp[i - 1].tenDinhMuc,
							dviTinh: lstTemp[i - 1].donViTinh,
							level: 1,
							dmucNamDtoan: lstTemp[i - 1].tongDmuc,
						})
					}
					this.updateEditCache();
				}
			}
		});
	}

	// tinh tong tu cap duoi
	sum(stt: string) {
		stt = Table.preIndex(stt);
		while (stt != '0') {
			const index = this.lstCtietBcao.findIndex(e => e.stt == stt);
			const data = this.lstCtietBcao[index];
			this.lstCtietBcao[index] = {
				...new ItemData(),
				id: data.id,
				stt: data.stt,
				tenDanhMuc: data.tenDanhMuc,
				level: data.level,
				danhMuc: data.danhMuc,
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
		this.tinhTong();
	}

	tinhTong() {
		this.total = new ItemData();
		this.lstCtietBcao.forEach(item => {
			if (item.level == "0") {
				this.keys.forEach(key => {
					this.total[key] = Operator.sum([this.total[key], item[key]]);
				})
			}
		})

	}

	changeModel(id: string): void {
		this.editCache[id].data.ttienNamDtoan = Operator.mul(this.editCache[id].data.dmucNamDtoan, this.editCache[id].data.sluongNamDtoan);
		this.editCache[id].data.ttienTd = Operator.mul(this.editCache[id].data.dmucNamDtoan, this.editCache[id].data.sluongTd);
		this.editCache[id].data.chenhLech = Operator.sum([this.editCache[id].data.ttienTd, -this.editCache[id].data.ttienNamDtoan]);
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
		await this.fileManip.downloadFile(file, doc);
	}

	exportToExcel() {
		const header = [
			{ t: 0, b: 1, l: 0, r: 13, val: null },
			{ t: 0, b: 1, l: 0, r: 0, val: 'STT' },
			{ t: 0, b: 1, l: 1, r: 1, val: 'Danh mục' },
			{ t: 0, b: 1, l: 2, r: 2, val: 'Đơn vị tính' },
			{ t: 0, b: 1, l: 3, r: 3, val: 'Thực hiện năm trước' },
			{ t: 0, b: 0, l: 4, r: 5, val: 'Năm ' + (this.namBcao - 1).toString() },
			{ t: 1, b: 1, l: 4, r: 4, val: 'Dự toán' },
			{ t: 1, b: 1, l: 5, r: 5, val: 'Ước thực hiện' },
			{ t: 0, b: 0, l: 6, r: 8, val: 'Năm dự toán' },
			{ t: 1, b: 1, l: 6, r: 6, val: 'Số lượng' },
			{ t: 1, b: 1, l: 7, r: 7, val: 'Định mức' },
			{ t: 1, b: 1, l: 8, r: 8, val: 'Thành tiền' },
			{ t: 0, b: 0, l: 9, r: 10, val: 'Thẩm định' },
			{ t: 1, b: 1, l: 9, r: 9, val: 'Số lượng' },
			{ t: 1, b: 1, l: 10, r: 10, val: 'Thành tiền' },
			{ t: 0, b: 1, l: 11, r: 11, val: 'Chênh lệch giữa thẩm định của DVCT và nhu cầu của DVCD' },
			{ t: 0, b: 1, l: 12, r: 12, val: 'Ghi chú' },
			{ t: 0, b: 1, l: 13, r: 13, val: 'Ý kiến của đơn vị cấp trên' },
		]
		const fieldOrder = ['stt', 'tenDanhMuc', 'dviTinh', 'thienNamTruoc', 'dtoanNamHtai', 'uocNamHtai', 'sluongNamDtoan',
			'sluongNamDtoan', 'dmucNamDtoan', 'ttienNamDtoan', 'sluongTd', 'ttienTd', 'chenhLech', 'ghiChu', 'ykienDviCtren']

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
		let excelName = this.dataInfo.maBcao;
		if (this.dataInfo.maBieuMau == "pl01N") {
			excelName = excelName + '_Phu_luc_I_nhap.xlsx'
		} else {
			excelName = excelName + '_Phu_luc_I_xuat.xlsx'
		}
		XLSX.writeFile(workbook, excelName);
	}
}
