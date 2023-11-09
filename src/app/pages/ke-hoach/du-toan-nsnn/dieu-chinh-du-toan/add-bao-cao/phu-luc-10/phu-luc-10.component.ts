import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { CurrencyMaskInputMode } from 'ngx-currency';
import { NgxSpinnerService } from 'ngx-spinner';
import { Operator, Status, Table, Utils } from 'src/app/Utility/utils';
import { DialogChonDanhMucComponent } from 'src/app/components/dialog/dialog-chon-danh-muc/dialog-chon-danh-muc.component';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { DanhMucDungChungService } from 'src/app/services/danh-muc-dung-chung.service';
import { DieuChinhService } from 'src/app/services/quan-ly-von-phi/dieuChinhDuToan.service';
import { UserService } from 'src/app/services/user.service';
import * as XLSX from 'xlsx-js-style';
import { BtnStatus, Doc, Form } from '../../dieu-chinh-du-toan.constant';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
export class ItemData {
	level: any;
	checked: boolean;
	id: string;
	qlnvKhvonphiDchinhCtietId: string;
	stt: string;
	congTrinh: string;
	kh2021: number;
	dtoanGiaoLke: number;
	gtriCtrinh: number;
	dtoanDchinhDnghi: number;
	kh2021SauDchinh: number;
	dtoanDnghiDchinhLnay: number;
	dtoanVuTvqtDnghi: number;
	ghiChu: string;
	maCongTrinh: string;
	chenhLech: number;
	ykienDviCtren: string;

	constructor(data: Partial<Pick<ItemData, keyof ItemData>>) {
		Object.assign(this, data);
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

export const amount1 = {
	allowZero: true,
	allowNegative: true,
	precision: 4,
	prefix: '',
	thousands: '.',
	decimal: ',',
	align: "left",
	nullable: true,
	inputMode: CurrencyMaskInputMode.NATURAL,
}

@Component({
	selector: 'app-phu-luc-10',
	templateUrl: './phu-luc-10.component.html',
	styleUrls: ['../add-bao-cao.component.scss'],
})
export class PhuLuc10Component implements OnInit {
	@Input() dataInfo;
	Op = new Operator('1');
	Utils = Utils;
	amount1 = amount1;
	//thong tin chi tiet cua bieu mau
	formDetail: Form = new Form();
	total: ItemData = new ItemData({});
	tongDcGiam: ItemData = new ItemData({});
	tongDcTang: ItemData = new ItemData({});
	maDviTien: string = '1';
	namBcao: number;
	//danh muc
	noiDungs: any[] = [];
	lstCtietBcao: ItemData[] = [];
	keys = [
		"kh2021",
		"dtoanGiaoLke",
		"gtriCtrinh",
		"dtoanDchinhDnghi",
		"kh2021SauDchinh",
		"dtoanDnghiDchinhLnay",
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

	tongDieuChinhTang: number;
	tongDieuChinhGiam: number;
	dToanVuTang: number;
	dToanVuGiam: number;

	constructor(
		private _modalRef: NzModalRef,
		private spinner: NgxSpinnerService,
		private dieuChinhDuToanService: DieuChinhService,
		private notification: NzNotificationService,
		private modal: NzModalService,
		public userService: UserService,
		private danhMucService: DanhMucDungChungService,
		private quanLyVonPhiService: QuanLyVonPhiService,
	) { }

	async ngOnInit() {
		this.initialization().then(() => {
			this.isDataAvailable = true;
		})
	}

	async initialization() {
		this.spinner.show();

		this.spinner.show();
		Object.assign(this.status, this.dataInfo.status);
		await this.getFormDetail();
		this.namBcao = this.dataInfo.namBcao;

		if (this.status.general) {
			const category = await this.danhMucService.danhMucChungGetAll('BC_DC_PL10');
			if (category) {
				category.data.forEach(
					item => {
						this.noiDungs.push({
							...item,
							level: item.ma?.split('.').length - 2,
							giaTri: Utils.getName(this.namBcao, item.giaTri),
						})
					}
				)
			}
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

		// if (!this.lstCtietBcao[0]?.stt) {
		// 	this.setIndex();
		// }

		if (this.lstCtietBcao.length > 0) {
			if (!this.lstCtietBcao[0]?.stt) {
				this.lstCtietBcao = Table.sortWithoutIndex(this.lstCtietBcao, 'maCongTrinh');
			} else {
				this.lstCtietBcao = Table.sortByIndex(this.lstCtietBcao);
			}
		}
		// this.lstCtietBcao.forEach(item => {
		// 	item.congTrinh = this.noiDungs.find(e => e.ma == item.maCongTrinh)?.giaTri;
		// })
		this.tinhTong();
		this.getTotal();
		this.getInTotal();
		this.updateEditCache();
		this.getStatusButton();
		this.spinner.hide();
	};

	setIndex() {
		const lstVtuTemp = this.lstCtietBcao.filter(e => !e.maCongTrinh);
		for (let i = 0; i < lstVtuTemp.length; i++) {
			const stt = '0.' + (i + 1).toString();
			const index = this.lstCtietBcao.findIndex(e => e.id == lstVtuTemp[i].id);
			this.lstCtietBcao[index].stt = stt;
			const lstDmTemp = this.lstCtietBcao.filter(e => e.maCongTrinh == lstVtuTemp[i].maCongTrinh && !!e.maCongTrinh);
			for (let j = 0; j < lstDmTemp.length; j++) {
				const ind = this.lstCtietBcao.findIndex(e => e.id == lstDmTemp[j].id);
				this.lstCtietBcao[ind].stt = stt + '.' + (j + 1).toString();
			}
		}
		lstVtuTemp.forEach(item => {
			this.sum(item.stt + '.1');
		})
	}


	async getFormDetail() {
		await this.dieuChinhDuToanService.ctietBieuMau(this.dataInfo.id).toPromise().then(
			data => {
				if (data.statusCode == 0) {
					this.formDetail = data.data;
					this.formDetail.maDviTien = '1';
					this.formDetail.lstCtietDchinh.forEach(item => {
						this.lstCtietBcao.push(new ItemData(item))
					})
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

	getLowStatus(str: string) {
		return this.lstCtietBcao.findIndex(e => Table.preIndex(e.stt) == str) != -1;
	}


	getTotal() {
		this.total = new ItemData({});
		this.lstCtietBcao.forEach(item => {
			if (item.level == 0) {
				this.keys.forEach(key => {
					this.total[key] = Operator.sum([this.total[key], item[key]]);
				})
			}
		})
	};

	getStatusButton() {
		this.status.ok = this.status.ok && (this.formDetail.trangThai == Status.NOT_RATE || this.formDetail.trangThai == Status.COMPLETE);
	};

	// luu
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
			lstCtietBcaoTemp.push(item.request())
		})

		if (this.status.general) {
			lstCtietBcaoTemp?.forEach(item => {
				item.dtoanVuTvqtDnghi = item.dtoanDnghiDchinhLnay;
			})
		}

		const request = JSON.parse(JSON.stringify(this.formDetail));

		request.fileDinhKems = [];
		for (let iterator of this.listFile) {
			const id = iterator?.lastModified.toString();
			const noiDung = this.formDetail.lstFiles.find(e => e.id == id)?.noiDung;
			request.fileDinhKems.push(await this.quanLyVonPhiService.upFile(iterator, this.dataInfo.path, noiDung));
		}
		request.fileDinhKems = request.fileDinhKems.concat(this.formDetail.lstFiles.filter(e => typeof e.id == 'number'))

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

	handleCancel() {
		this._modalRef.close();
	};

	deleteLine(id: string) {
		const stt = this.lstCtietBcao.find(e => e.id === id)?.stt;
		this.lstCtietBcao = Table.deleteRow(id, this.lstCtietBcao);
		this.sum(stt);
		this.updateEditCache();
	}

	startEdit(id: string): void {
		this.editCache[id].edit = true;
	};

	checkEdit(stt: string) {
		const lstTemp = this.lstCtietBcao.filter(e => e.stt !== stt);
		return lstTemp.every(e => !e.stt.startsWith(stt));
	}

	updateSingleChecked(): void {
		if (this.lstCtietBcao.every(item => item.checked || item.level != 0)) {     // tat ca o checkbox deu = true thi set o checkbox all = true
			this.allChecked = true;
		} else {                                                        // o checkbox vua = false, vua = true thi set o checkbox all = indeterminate
			this.allChecked = false;
		}
	}

	saveEdit(id: string): void {
		const index = this.lstCtietBcao.findIndex(item => item.id === id); // lay vi tri hang minh sua
		Object.assign(this.lstCtietBcao[index], this.editCache[id].data); // set lai data cua lstCtietBcao[index] = this.editCache[id].data
		this.editCache[id].edit = false; // CHUYEN VE DANG TEXT
		this.sum(this.lstCtietBcao[index].stt);
		this.getTotal();
		this.getInTotal();
		this.updateEditCache();
	}

	updateEditCache(): void {
		this.lstCtietBcao.forEach(item => {
			this.editCache[item.id] = {
				edit: false,
				data: new ItemData(item)
			};
		});
	};

	sum(stt: string) {
		stt = this.getHead(stt);
		while (stt != '0') {
			const index = this.lstCtietBcao.findIndex(e => e.stt == stt);
			const data = this.lstCtietBcao[index];
			this.lstCtietBcao[index] = new ItemData({
				id: data.id,
				stt: data.stt,
				congTrinh: data.congTrinh,
				level: data.level,
				maCongTrinh: data.maCongTrinh,

			})
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
		this.tinhTong();
	};

	cancelEdit(id: string): void {
		const index = this.lstCtietBcao.findIndex(item => item.id === id);
		// lay vi tri hang minh sua
		this.editCache[id] = {
			data: new ItemData(this.lstCtietBcao[index]),
			edit: false
		};
	}


	tinhTong() {
		this.tongDieuChinhGiam = 0;
		this.tongDieuChinhTang = 0;
		this.dToanVuTang = 0;
		this.dToanVuGiam = 0;
		this.lstCtietBcao.forEach(item => {
			item.chenhLech = Operator.sum([item.dtoanVuTvqtDnghi, - item.dtoanDnghiDchinhLnay])
			const str = item.stt
			if (!(this.lstCtietBcao.findIndex(e => Table.preIndex(e.stt) == str) != -1)) {
				if (item.dtoanDnghiDchinhLnay && item.dtoanDnghiDchinhLnay !== null) {
					if (item.dtoanDnghiDchinhLnay < 0) {
						Number(this.tongDieuChinhGiam += Number(item?.dtoanDnghiDchinhLnay));
					} else {
						Number(this.tongDieuChinhTang += Number(item?.dtoanDnghiDchinhLnay));
					}
				}

				if (item.dtoanVuTvqtDnghi && item.dtoanVuTvqtDnghi !== null) {
					if (item.dtoanVuTvqtDnghi < 0) {
						Number(this.dToanVuGiam += Number(item?.dtoanVuTvqtDnghi));
					} else {
						Number(this.dToanVuTang += Number(item?.dtoanVuTvqtDnghi));
					}
				}
			}
		})
	};

	changeModel(id: string): void {
		this.editCache[id].data.kh2021SauDchinh = Operator.sum([this.editCache[id].data.kh2021, this.editCache[id].data.dtoanDchinhDnghi]);
		this.editCache[id].data.dtoanDnghiDchinhLnay = Operator.sum([this.editCache[id].data.kh2021SauDchinh, - this.editCache[id].data.dtoanGiaoLke]);
		this.editCache[id].data.chenhLech = Operator.sum([this.editCache[id].data.dtoanVuTvqtDnghi, - this.editCache[id].data.dtoanDnghiDchinhLnay]);
	};

	deleteAllChecked() {
		const lstId: any[] = [];
		this.lstCtietBcao.forEach(item => {
			if (item.checked) {
				lstId.push(item.id);
			}
		})
		lstId.forEach(item => {
			if (this.lstCtietBcao.findIndex(e => e.id == item) != 0) {
				this.deleteLine(item);
			}
		})
	}



	getIndex(str: string): string {
		str = str.substring(str.indexOf('.') + 1, str.length);
		const chiSo: string[] = str.split('.');
		const n: number = chiSo.length - 1;
		let k: number = parseInt(chiSo[n], 10);
		switch (n) {
			case 0:
				return String.fromCharCode(k + 64);
			case 1:
				return Utils.laMa(k);
			case 2:
				return chiSo[n];
			case 3:
				return chiSo[n - 1].toString() + "." + chiSo[n].toString();
			case 4:
				return String.fromCharCode(k + 96);
			case 5:
				return "-";
			default:
				return null;
		}
	}
	// lấy phần đầu của số thứ tự, dùng để xác định phần tử cha
	getHead(str: string): string {
		return str.substring(0, str.lastIndexOf('.'));
	}
	// lấy phần đuôi của stt
	getTail(str: string): number {
		return parseInt(str.substring(str.lastIndexOf('.') + 1, str.length), 10);
	}

	checkDelete(stt: string) {
		const level = stt.split('.').length - 2;
		if (level == 0) {
			return true;
		}
		return false;
	};


	addLine(id: string) {
		const maNdung: string = this.lstCtietBcao.find(e => e.id == id)?.maCongTrinh;
		const obj = {
			ma: maNdung,
			lstDanhMuc: this.noiDungs,
		}

		const modalIn = this.modal.create({
			nzTitle: 'Danh sách nội dung ',
			nzContent: DialogChonDanhMucComponent,
			nzMaskClosable: false,
			nzClosable: false,
			nzWidth: '65%',
			nzFooter: null,
			nzComponentParams: {
				obj: obj
			},
		});
		modalIn.afterClose.subscribe((res) => {
			if (res) {
				const index: number = this.lstCtietBcao.findIndex(e => e.maCongTrinh == res.ma);
				if (index == -1) {
					const data: ItemData = new ItemData({
						maCongTrinh: res.ma,
						level: this.noiDungs.find(e => e.ma == res.ma)?.level,
						congTrinh: this.noiDungs.find(e => e.ma == res.ma)?.giaTri,
					});
					if (this.lstCtietBcao.length == 0) {
						this.lstCtietBcao = Table.addHead(data, this.lstCtietBcao);
					} else {
						this.addSame(id, data);
					}
				}
				id = this.lstCtietBcao.find(e => e.maCongTrinh == res.ma)?.id;
				res.lstDanhMuc.forEach(item => {
					if (this.lstCtietBcao.findIndex(e => e.maCongTrinh == item.ma) == -1) {
						const data: ItemData = new ItemData({
							maCongTrinh: item.ma,
							level: item.level,
							congTrinh: item.giaTri,
						});
						this.addLow(id, data);
					}
				})
				this.updateEditCache();
			}
		});

	};

	addSame(id: string, initItem: ItemData) {
		this.lstCtietBcao = Table.addParent(id, initItem, this.lstCtietBcao);
	};


	addLow(id: string, initItem: ItemData) {
		this.lstCtietBcao = Table.addChild(id, initItem, this.lstCtietBcao);
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
		await this.quanLyVonPhiService.downFile(file, doc);
	};

	getInTotal() {
		this.tongDcTang.clear()
		this.tongDcGiam.clear()
		this.lstCtietBcao.forEach(item => {
			const str = item.stt
			if (!(this.lstCtietBcao.findIndex(e => Table.preIndex(e.stt) == str) != -1)) {
				if (item.dtoanDnghiDchinhLnay < 0) {
					this.tongDcGiam.sum(item);
				}
				else {
					this.tongDcTang.sum(item);
				}
			}
		})

	}

	exportToExcel() {
		if (this.lstCtietBcao.some(e => this.editCache[e.id].edit)) {
			this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTSAVE);
			return;
		}

		let header = [];
		let fieldOrder = [];

		if (this.status.viewAppVal) {
			header = [
				{ t: 0, b: 7, l: 0, r: 11, val: null },

				{ t: 0, b: 0, l: 0, r: 1, val: this.dataInfo.tenPl },
				{ t: 1, b: 1, l: 0, r: 8, val: this.dataInfo.tieuDe },
				{ t: 2, b: 2, l: 0, r: 8, val: this.dataInfo.congVan },
				{ t: 3, b: 3, l: 0, r: 8, val: 'Trạng thái biểu mẫu' + Status.reportStatusName(this.dataInfo.trangThai) },

				{ t: 4, b: 6, l: 0, r: 0, val: 'STT' },
				{ t: 4, b: 6, l: 1, r: 1, val: 'Tên công trình (Ghi chính xác theo danh mục kế hoạch năm ...)' },
				{ t: 4, b: 6, l: 2, r: 2, val: 'Kế hoạch vốn năm' + (this.namBcao - 1).toString() },
				{ t: 4, b: 6, l: 3, r: 3, val: 'Dự toán đã giao lũy kế đến thời điểm báo cáo' },
				{ t: 4, b: 6, l: 4, r: 4, val: 'Giá trị công trình (Ghi giá trị quyết toán, giá trị dự toán hoặc tổng mức đầu tư)' },
				{ t: 4, b: 6, l: 5, r: 5, val: 'Kế hoạch điều chỉnh (+ tăng) (- giảm)' },
				{ t: 4, b: 6, l: 6, r: 6, val: 'Kế hoạch năm' + (this.namBcao - 1).toString() + 'sau điều chỉnh' },
				{ t: 4, b: 6, l: 7, r: 7, val: 'Dự toán đề nghị điều chỉnh lần này' },
				{ t: 4, b: 6, l: 8, r: 8, val: 'Dự toán Vụ TVQT đề nghị (+ tăng) (- giảm)' },
				{ t: 4, b: 6, l: 9, r: 9, val: 'Ghi chú (Đã duyệt quyết toán/ chưa duyệt quyết toán)' },
				{ t: 4, b: 6, l: 10, r: 10, val: 'Dự toán chênh lệch giữa Vụ TVQT điều chỉnh và đơn vị đề nghị (+ tăng) (- giảm)' },
				{ t: 4, b: 6, l: 11, r: 11, val: 'Ý kiến của đơn vị cấp trên' },


				{ t: 7, b: 7, l: 0, r: 0, val: 'A' },
				{ t: 7, b: 7, l: 1, r: 1, val: 'B' },
				{ t: 7, b: 7, l: 2, r: 2, val: '1' },
				{ t: 7, b: 7, l: 3, r: 3, val: '2' },
				{ t: 7, b: 7, l: 4, r: 4, val: '3' },
				{ t: 7, b: 7, l: 5, r: 5, val: '4' },
				{ t: 7, b: 7, l: 6, r: 6, val: '5 = 1 + 4' },
				{ t: 7, b: 7, l: 7, r: 7, val: '6 = 5 - 2' },
				{ t: 7, b: 7, l: 8, r: 8, val: '7' },
				{ t: 7, b: 7, l: 9, r: 9, val: '8' },
				{ t: 7, b: 7, l: 10, r: 10, val: '9 = 7 - 6' },
				{ t: 7, b: 7, l: 11, r: 11, val: '10' },

			]
			fieldOrder = [
				'stt',
				'congTrinh',
				'kh2021',
				'dtoanGiaoLke',
				'gtriCtrinh',
				'dtoanDchinhDnghi',
				'kh2021SauDchinh',
				'dtoanDnghiDchinhLnay',
				'dtoanVuTvqtDnghi',
				'ghiChu',
				'chenhLech',
				'ykienDviCtren',
			]
		} else {
			header = [
				{ t: 0, b: 7, l: 0, r: 8, val: null },

				{ t: 0, b: 0, l: 0, r: 1, val: this.dataInfo.tenPl },
				{ t: 1, b: 1, l: 0, r: 8, val: this.dataInfo.tieuDe },
				{ t: 2, b: 2, l: 0, r: 8, val: this.dataInfo.congVan },
				{ t: 3, b: 3, l: 0, r: 8, val: 'Trạng thái biểu mẫu' + Status.reportStatusName(this.dataInfo.trangThai) },

				{ t: 4, b: 6, l: 0, r: 0, val: 'STT' },
				{ t: 4, b: 6, l: 1, r: 1, val: 'Tên công trình (Ghi chính xác theo danh mục kế hoạch năm ...)' },
				{ t: 4, b: 6, l: 2, r: 2, val: 'Kế hoạch vốn năm' + (this.namBcao - 1).toString() },
				{ t: 4, b: 6, l: 3, r: 3, val: 'Dự toán đã giao lũy kế đến thời điểm báo cáo' },
				{ t: 4, b: 6, l: 4, r: 4, val: 'Giá trị công trình (Ghi giá trị quyết toán, giá trị dự toán hoặc tổng mức đầu tư)' },
				{ t: 4, b: 6, l: 5, r: 5, val: 'Kế hoạch điều chỉnh (+ tăng) (- giảm)' },
				{ t: 4, b: 6, l: 6, r: 6, val: 'Kế hoạch năm' + (this.namBcao - 1).toString() + 'sau điều chỉnh' },
				{ t: 4, b: 6, l: 7, r: 7, val: 'Dự toán đề nghị điều chỉnh lần này' },
				{ t: 4, b: 6, l: 8, r: 8, val: 'Ghi chú (Đã duyệt quyết toán/ chưa duyệt quyết toán)' },


				{ t: 7, b: 7, l: 0, r: 0, val: 'A' },
				{ t: 7, b: 7, l: 1, r: 1, val: 'B' },
				{ t: 7, b: 7, l: 2, r: 2, val: '1' },
				{ t: 7, b: 7, l: 3, r: 3, val: '2' },
				{ t: 7, b: 7, l: 4, r: 4, val: '3' },
				{ t: 7, b: 7, l: 5, r: 5, val: '4' },
				{ t: 7, b: 7, l: 6, r: 6, val: '5 = 1 + 4' },
				{ t: 7, b: 7, l: 7, r: 7, val: '6 = 5 - 2' },
				{ t: 7, b: 7, l: 8, r: 8, val: '7' },

			]
			fieldOrder = [
				'stt',
				'congTrinh',
				'kh2021',
				'dtoanGiaoLke',
				'gtriCtrinh',
				'dtoanDchinhDnghi',
				'kh2021SauDchinh',
				'dtoanDnghiDchinhLnay',
				'ghiChu',
			]
		}


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
		});

		let row: any = {};
		row = {}
		fieldOrder.forEach(field => {
			if (field == 'congTrinh') {
				row[field] = 'Phát sinh điều chỉnh giảm'
			} else {
				if (![
					'kh2021',
					'dtoanGiaoLke',
					'gtriCtrinh',
					'dtoanDchinhDnghi',
					'kh2021SauDchinh',
				].includes(field)) {
					row[field] = (!this.tongDcGiam[field] && this.tongDcGiam[field] !== 0) ? '' : this.tongDcGiam[field];
				} else {
					row[field] = '';
				}
			}
		})
		filterData.unshift(row)

		row = {}
		fieldOrder.forEach(field => {
			if (field == 'congTrinh') {
				row[field] = 'Phát sinh điều chỉnh tăng'
			} else {
				if (![
					'kh2021',
					'dtoanGiaoLke',
					'gtriCtrinh',
					'dtoanDchinhDnghi',
					'kh2021SauDchinh',
				].includes(field)) {
					row[field] = (!this.tongDcTang[field] && this.tongDcTang[field] !== 0) ? '' : this.tongDcTang[field];
				} else {
					row[field] = '';
				}
			}
		})
		filterData.unshift(row)

		row = {}
		fieldOrder.forEach(field => {
			row[field] = field == 'congTrinh' ? 'Tổng cộng' : (!this.total[field] && this.total[field] !== 0) ? '' : this.total[field];
		})
		filterData.unshift(row)

		const workbook = XLSX.utils.book_new();
		const worksheet = Table.initExcel(header);
		XLSX.utils.sheet_add_json(worksheet, filterData, { skipHeader: true, origin: Table.coo(header[0].l, header[0].b + 1) })
		for (const cell in worksheet) {
			if (cell.startsWith('!') || XLSX.utils.decode_cell(cell).r < 4) continue;
			worksheet[cell].s = Table.borderStyle;
		}
		XLSX.utils.book_append_sheet(workbook, worksheet, 'Dữ liệu');
		let excelName = this.dataInfo.maBcao;
		excelName = excelName + '_BCDC_PL10.xlsx'
		XLSX.writeFile(workbook, excelName);
	}

}





