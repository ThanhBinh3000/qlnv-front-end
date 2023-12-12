import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { Operator, Status, Table, Utils } from "src/app/Utility/utils";
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { LapThamDinhService } from 'src/app/services/quan-ly-von-phi/lapThamDinh.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import * as uuid from "uuid";
import * as XLSX from 'xlsx-js-style';
import { BtnStatus, Doc, Form } from '../../../lap-ke-hoach-va-tham-dinh-du-toan.constant';

export class ItemData {
	id: string;
	stt: string;
	matHang: string;
	tenDmuc: string;
	maDviTinh: string;
	khSluong: number;
	khTtien: number;
	uocThSluong: number;
	uocThTtien: number;
	tonKho: number;
	tongMucDtru: number;
	namKhSluong: number;
	namKhTtien: number;
	tdinhSluong: number;
	tdinhTtien: number;
	checked: boolean;
	isDelete: false;
	chenhLech: number;
	ghiChu: string;
	ykienDviCtren: string;

	constructor(data: Partial<Pick<ItemData, keyof ItemData>>) {
		Object.assign(this, data);
	}

	changeModel() {
		this.chenhLech = Operator.sum([this.tdinhTtien, -this.namKhTtien])
	}

	upperBound() {
		return this.khTtien > Utils.MONEY_LIMIT || this.namKhTtien > Utils.MONEY_LIMIT || this.tdinhTtien > Utils.MONEY_LIMIT || this.uocThTtien > Utils.MONEY_LIMIT;
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
	selector: 'app-bieu-mau-16-0',
	templateUrl: './bieu-mau-16-0.component.html',
	styleUrls: ['../../bao-cao.component.scss']
})
export class BieuMau160Component implements OnInit {
	@Input() dataInfo;
	Op = new Operator('1');
	Utils = Utils;
	//thong tin chi tiet cua bieu mau
	formDetail: Form = new Form();
	total: ItemData = new ItemData({});
	maDviTien: string = '1';
	namBcao: number;
	//danh muc
	linhVucChis: any[] = [];
	listVatTu: any[] = [];
	listVatTuFull: any[] = [];
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
		private quanLyVonPhiService: QuanLyVonPhiService,
		public userService: UserService,
		private danhMucService: DanhMucHDVService,
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
		if (this.status) {
			this.scrollX = Table.tableWidth(350, 9, 1, 160);
		} else {
			if (this.status.editAppVal) {
				this.scrollX = Table.tableWidth(350, 12, 2, 60);
			} else if (this.status.viewAppVal) {
				this.scrollX = Table.tableWidth(350, 12, 1, 0);
			} else {
				this.scrollX = Table.tableWidth(350, 9, 1, 0);
			}
		}
		await this.getListVtu()
		await this.addListVatTu()

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

		if (this.formDetail.lstFiles.some(e => e.isEdit)) {
			this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOT_SAVE_FILE);
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
				item.tdinhSluong = item.namKhSluong;
				item.tdinhTtien = item.namKhTtien;
				item.chenhLech = Operator.sum([item.tdinhTtien, -item.namKhTtien])
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

	async getListVtu() {
		//lay danh sach vat tu
		await this.danhMucService.dMVatTu().toPromise().then(res => {
			if (res.statusCode == 0) {
				this.listVatTu = res.data;

			} else {
				this.notification.error(MESSAGE.ERROR, res?.msg);
			}
		}, err => {
			this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
		})
	};

	async addListVatTu() {
		const lstVtuCon1 = []
		const lstVtuCon2 = []

		this.listVatTu.forEach(vtu => {
			vtu?.child.forEach(vtuCon => {
				const maCha = vtuCon?.ma.slice(0, -2)
				lstVtuCon1.push({
					id: vtuCon.ma,
					maVtu: vtuCon.ma,
					tenDm: vtuCon.ten,
					maDviTinh: vtuCon.maDviTinh,
					maCha: maCha,
					level: Number(vtuCon.cap),
				})

				vtuCon?.child.forEach(vtuConn => {
					const maCha = vtuConn?.ma.slice(0, -2)
					lstVtuCon2.push({
						id: vtuConn.ma,
						maVtu: vtuConn.ma,
						tenDm: vtuConn.ten,
						maDviTinh: vtuConn.maDviTinh,
						maCha: maCha,
						level: Number(vtuConn.cap),
					})
				})
			})
		})
		const mangGop12 = lstVtuCon1.concat(lstVtuCon2)
		this.listVatTuFull = this.listVatTuFull.concat(mangGop12)
		this.listVatTuFull.forEach(item => {
			if (item.level.length == 2) {
				item.level = item.level.slice(0, -1)
			}
		})
		this.linhVucChis = this.listVatTuFull;
	}

	changeMatHang(matHang: any, id: any) {
		const index = this.lstCtietBcao.findIndex(item => item.id === id); // lay vi tri hang minh sua
		const donViTinh = this.linhVucChis.find(vtu => vtu.id == matHang)?.maDviTinh;
		this.editCache[id].data.maDviTinh = donViTinh;
		this.lstCtietBcao[index].maDviTinh = donViTinh;
	}

	updateSingleChecked(): void {
		if (this.lstCtietBcao.every(item => !item.checked)) {
			this.allChecked = false;
		} else if (this.lstCtietBcao.every(item => item.checked)) {
			this.allChecked = true;
		}
	}

	deleteById(id: any): void {
		this.lstCtietBcao = this.lstCtietBcao.filter(item => item.id != id)
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

	addLine(id: any) {
		const item: ItemData = new ItemData({
			id: uuid.v4(),
		});

		this.lstCtietBcao.splice(id, 0, item);
		this.editCache[item.id] = {
			edit: true,
			data: new ItemData(item)
		};
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
		this.getTotal()
		this.lstCtietBcao.forEach(item => {
			const tenDmuc = this.listVatTuFull.find(itm => itm.id == item.matHang)?.tenDm
			item.tenDmuc = tenDmuc
		})
		this.updateEditCache();
	}

	getTotal() {
		this.total.clear();
		this.lstCtietBcao.forEach(item => {
			this.total.sum(item);
		})
	}

	checkEdit(stt: string) {
		return this.lstCtietBcao.every(e => Table.preIndex(e.stt) != stt);
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
				{ t: 0, b: 5, l: 0, r: 15, val: null },
				{ t: 0, b: 0, l: 0, r: 1, val: this.dataInfo.tenPl },
				{ t: 1, b: 1, l: 0, r: 8, val: this.dataInfo.tieuDe },
				{ t: 2, b: 2, l: 0, r: 8, val: this.dataInfo.congVan },
				{ t: 3, b: 3, l: 0, r: 4, val: 'Trạng thái báo cáo: ' + this.dataInfo.tenTrangThai },
				{ t: 4, b: 5, l: 0, r: 0, val: 'STT' },
				{ t: 4, b: 5, l: 1, r: 1, val: 'Mặt hàng' },
				{ t: 4, b: 5, l: 2, r: 2, val: 'Đơn vị tính' },
				{ t: 4, b: 4, l: 3, r: 4, val: 'Kế hoạch năm ' + (this.namBcao - 1).toString() },
				{ t: 5, b: 5, l: 3, r: 3, val: 'Số lượng' },
				{ t: 5, b: 5, l: 4, r: 4, val: 'Thành tiền' },
				{ t: 4, b: 4, l: 5, r: 6, val: 'Ước thực hiện năm ' + (this.namBcao - 1).toString() },
				{ t: 5, b: 5, l: 5, r: 5, val: 'Số lượng' },
				{ t: 5, b: 5, l: 6, r: 6, val: 'Thành tiền' },
				{ t: 4, b: 5, l: 7, r: 7, val: 'Tồn kho đến 31/12 năm ' + (this.namBcao - 1).toString() },
				{ t: 4, b: 5, l: 8, r: 8, val: 'Tổng mức dự trữ theo quyết định của cấp có thẩm quyền' },
				{ t: 4, b: 4, l: 9, r: 10, val: 'Kế hoạch năm ' + (this.namBcao).toString() },
				{ t: 5, b: 5, l: 9, r: 9, val: 'Số lượng' },
				{ t: 5, b: 5, l: 10, r: 10, val: 'Thành tiền' },
				{ t: 4, b: 4, l: 11, r: 12, val: 'Thẩm định kế hoạch năm ' + (this.namBcao).toString() },
				{ t: 5, b: 5, l: 11, r: 11, val: 'Số lượng' },
				{ t: 5, b: 5, l: 12, r: 12, val: 'Thành tiền' },
				{ t: 4, b: 5, l: 13, r: 13, val: 'Chênh lệch giữa thẩm định của DVCT và nhu cầu của DVCD' },
				{ t: 4, b: 5, l: 14, r: 14, val: 'Ghi chú' },
				{ t: 4, b: 5, l: 15, r: 15, val: 'Ý kiến của đơn vị cấp trên' },
			]
			fieldOrder = ['stt', 'tenDmuc', 'maDviTinh', 'khSluong', 'khTtien', 'uocThSluong', 'uocThTtien', 'tonKho', 'tongMucDtru', 'namKhSluong', 'namKhTtien', 'tdinhSluong', 'tdinhTtien',
				'chenhLech', 'ghiChu', 'ykienDviCtren']
			calHeader = ['A', 'B', 'C', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11=10-8', '12', '13'];
		} else {
			header = [
				{ t: 0, b: 5, l: 0, r: 11, val: null },
				{ t: 0, b: 0, l: 0, r: 1, val: this.dataInfo.tenPl },
				{ t: 1, b: 1, l: 0, r: 8, val: this.dataInfo.tieuDe },
				{ t: 2, b: 2, l: 0, r: 8, val: this.dataInfo.congVan },
				{ t: 3, b: 3, l: 0, r: 4, val: 'Trạng thái báo cáo: ' + this.dataInfo.tenTrangThai },
				{ t: 4, b: 5, l: 0, r: 0, val: 'STT' },
				{ t: 4, b: 5, l: 1, r: 1, val: 'Mặt hàng' },
				{ t: 4, b: 5, l: 2, r: 2, val: 'Đơn vị tính' },
				{ t: 4, b: 4, l: 3, r: 4, val: 'Kế hoạch năm ' + (this.namBcao - 1).toString() },
				{ t: 5, b: 5, l: 3, r: 3, val: 'Số lượng' },
				{ t: 5, b: 5, l: 4, r: 4, val: 'Thành tiền' },
				{ t: 4, b: 4, l: 5, r: 6, val: 'Ước thực hiện năm ' + (this.namBcao - 1).toString() },
				{ t: 5, b: 5, l: 5, r: 5, val: 'Số lượng' },
				{ t: 5, b: 5, l: 6, r: 6, val: 'Thành tiền' },
				{ t: 4, b: 5, l: 7, r: 7, val: 'Tồn kho đến 31/12 năm ' + (this.namBcao - 1).toString() },
				{ t: 4, b: 5, l: 8, r: 8, val: 'Tổng mức dự trữ theo quyết định của cấp có thẩm quyền' },
				{ t: 4, b: 4, l: 9, r: 10, val: 'Kế hoạch năm ' + (this.namBcao).toString() },
				{ t: 5, b: 5, l: 9, r: 9, val: 'Số lượng' },
				{ t: 5, b: 5, l: 10, r: 10, val: 'Thành tiền' },
				{ t: 4, b: 5, l: 11, r: 11, val: 'Ghi chú' },
			]
			fieldOrder = ['stt', 'tenDmuc', 'maDviTinh', 'khSluong', 'khTtien', 'uocThSluong', 'uocThTtien', 'tonKho', 'tongMucDtru', 'namKhSluong', 'namKhTtien', 'ghiChu']
			calHeader = ['A', 'B', 'C', '1', '2', '3', '4', '5', '6', '7', '8', '12'];
		}

		const filterData = this.lstCtietBcao.map(item => {
			const row: any = {};
			fieldOrder.forEach(field => {
				row[field] = Utils.getValue(item[field]);
			})
			return row;
		})
		let ind = 1;
		filterData.forEach(item => {
			item.stt = ind.toString();
			ind += 1;
		})
		let row: any = {};
		fieldOrder.forEach(field => {
			if (field == 'tenDmuc') {
				row[field] = 'Tổng cộng'
			} else {
				if (!['khSluong', 'uocThSluong', 'tonKho', 'tongMucDtru', 'namKhSluong', 'tdinhSluong'].includes(field)) {
					row[field] = Utils.getValue(this.total[field]);
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
		//Thêm khung viền cho bảng
		for (const cell in worksheet) {
			if (cell.startsWith('!') || XLSX.utils.decode_cell(cell).r < 4) continue;
			worksheet[cell].s = Table.borderStyle;
		}

		XLSX.utils.book_append_sheet(workbook, worksheet, 'Dữ liệu');
		XLSX.writeFile(workbook, this.dataInfo.maBcao + '_TT342_16.xlsx');
	}
}

