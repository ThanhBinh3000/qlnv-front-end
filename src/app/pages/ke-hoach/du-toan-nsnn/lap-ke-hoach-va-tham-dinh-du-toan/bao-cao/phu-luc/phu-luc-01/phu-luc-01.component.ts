import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import * as fileSaver from 'file-saver';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogDanhSachVatTuHangHoaComponent } from 'src/app/components/dialog/dialog-danh-sach-vat-tu-hang-hoa/dialog-danh-sach-vat-tu-hang-hoa.component';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { LapThamDinhService } from 'src/app/services/quan-ly-von-phi/lapThamDinh.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { displayNumber, exchangeMoney, mulNumber, sumNumber } from 'src/app/Utility/func';
import { AMOUNT, BOX_NUMBER_WIDTH, DON_VI_TIEN, LA_MA, MONEY_LIMIT } from 'src/app/Utility/utils';
import * as uuid from 'uuid';
export class ItemData {
	id: any;
	khvonphiLapThamDinhCtietId: string;
	lstFiles: any[];
	fileDinhKems: any[];
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
	ghiChu: number;
	stt: string;
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
	donViTiens: any[] = DON_VI_TIEN;
	editMoneyUnit = false;
	maDviTien: string = '1';
	lstCtietBcao: ItemData[] = [];
	formDetail: any;
	thuyetMinh: string;
	status = false;
	statusBtnFinish: boolean;
	statusBtnOk: boolean;
	statusPrint: boolean;
	listVattu: any[] = [];
	lstVatTuFull = [];
	isDataAvailable = false;
	dsDinhMuc: any[] = [];
	maDviTao: any;
	total = new ItemData();
	soLaMa: any[] = LA_MA;
	allChecked = false;
	amount = AMOUNT;
	// tongSo: number;
	// tongSoTd: number;
	// tongThienNamTruoc: number;
	// tongDuToan: number;
	// tongUoc: number;
	// tongDmuc: number;
	editAppraisalValue: boolean;
	viewAppraisalValue: boolean;
	namBaoCao: number;
	//nho dem
	editCache: { [key: string]: { edit: boolean; data: ItemData } } = {};
	scrollX: string;
	fileList: NzUploadFile[] = [];
	listFile: File[] = [];                      // list file chua ten va id de hien tai o input
	lstFiles: any[] = [];
	listIdDeleteFiles: string[] = [];

	beforeUpload = (file: NzUploadFile): boolean => {
		this.fileList = this.fileList.concat(file);
		console.log(this.fileList);
		return false;
	};

	// them file vao danh sach
	handleUpload(): void {
		console.log(this.fileList);

		this.fileList.forEach((file: any) => {
			const id = file?.lastModified.toString();
			this.lstFiles.push({ id: id, fileName: file?.name });
			this.listFile.push(file);
		});
		this.fileList = [];
	}


	constructor(
		private _modalRef: NzModalRef,
		private spinner: NgxSpinnerService,
		private lapThamDinhService: LapThamDinhService,
		private notification: NzNotificationService,
		private modal: NzModalService,
		private quanLyVonPhiService: QuanLyVonPhiService,
	) {
	}


	async ngOnInit() {
		this.initialization().then(() => {
			this.isDataAvailable = true;
		})
	}


	async initialization() {
		this.spinner.show();
		this.formDetail = this.dataInfo?.data;
		this.maDviTao = this.dataInfo?.maDvi;
		this.thuyetMinh = this.formDetail?.thuyetMinh;
		this.lstFiles = this.formDetail?.lstFiles;
		this.status = !this.dataInfo?.status;
		this.namBaoCao = this.dataInfo?.namBcao;
		this.statusBtnFinish = this.dataInfo?.statusBtnFinish;
		this.statusPrint = this.dataInfo?.statusBtnPrint;
		this.editAppraisalValue = this.dataInfo?.editAppraisalValue;
		this.viewAppraisalValue = this.dataInfo?.viewAppraisalValue;
		if (this.status) {
			this.scrollX = (510 + BOX_NUMBER_WIDTH * 7).toString() + 'px';
		} else {
			if (this.editAppraisalValue) {
				this.scrollX = (410 + BOX_NUMBER_WIDTH * 9).toString() + 'px';
			} else if (this.viewAppraisalValue) {
				this.scrollX = (350 + BOX_NUMBER_WIDTH * 9).toString() + 'px';
			} else {
				this.scrollX = (350 + BOX_NUMBER_WIDTH * 7).toString() + 'px';
			}
		}
		this.formDetail?.lstCtietLapThamDinhs.forEach(item => {
			this.lstCtietBcao.push({
				...item,
			})
		})

		if (this.formDetail.maBieuMau == "pl01N") {
			await this.getDinhMucPL2N();
		} else {
			await this.getDinhMucPL2X();
		}

		if (this.dataInfo?.isSynthetic && this.formDetail.trangThai == "3") {
			this.lstCtietBcao.forEach(item => {
				const dinhMuc = this.dsDinhMuc.find(e => e.cloaiVthh == item.danhMuc && e.loaiDinhMuc == item.maDmuc);
				if (!item.tenDanhMuc) {
					item.tenDanhMuc = dinhMuc?.tenDinhMuc;
				}
				item.dmucNamDtoan = dinhMuc?.tongDmuc;
				item.dviTinh = dinhMuc?.donViTinh;
				item.ttienNamDtoan = mulNumber(item.dmucNamDtoan, item.sluongNamDtoan);
				item.ttienTd = mulNumber(item.dmucNamDtoan, item.sluongTd);
			})
		}
		this.sortByIndex();
		// this.sum1();
		this.tinhTong();
		this.updateEditCache();
		this.getStatusButton();

		this.spinner.hide();
	}

	async getDinhMucPL2N() {
		const request = {
			loaiDinhMuc: '01',
			maDvi: this.maDviTao,
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
	};
	async getDinhMucPL2X() {
		const request = {
			loaiDinhMuc: '02',
			maDvi: this.maDviTao,
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

	sortByIndex() {
		if (this.lstCtietBcao?.length > 0 && !this.lstCtietBcao[0].stt) {
			this.setIndex();
		}
		this.setLevel();
		this.lstCtietBcao.sort((item1, item2) => {
			if (item1.level > item2.level) {
				return 1;
			}
			if (item1.level < item2.level) {
				return -1;
			}
			if (this.getTail(item1.stt) > this.getTail(item2.stt)) {
				return -1;
			}
			if (this.getTail(item1.stt) < this.getTail(item2.stt)) {
				return 1;
			}
			return 0;
		});
		const lstTemp: ItemData[] = [];
		this.lstCtietBcao.forEach(item => {
			const index: number = lstTemp.findIndex(e => e.stt == this.getHead(item.stt));
			if (index == -1) {
				lstTemp.splice(0, 0, item);
			} else {
				lstTemp.splice(index + 1, 0, item);
			}
		})

		this.lstCtietBcao = lstTemp;
	}

	setLevel() {
		this.lstCtietBcao.forEach(item => {
			const str: string[] = item.stt.split('.');
			item.level = str.length - 2;
		})
	}

	checkDelete(stt: string) {
		const level = stt.split('.').length - 2;
		if (level == 0) {
			return true;
		}
		return false;
	}

	// lấy phần đầu của số thứ tự, dùng để xác định phần tử cha
	getHead(str: string): string {
		return str.substring(0, str.lastIndexOf('.'));
	}
	// lấy phần đuôi của stt
	getTail(str: string): number {
		return parseInt(str.substring(str.lastIndexOf('.') + 1, str.length), 10);
	}

	// chuyển đổi stt đang được mã hóa thành dạng I, II, a, b, c, ...
	getChiMuc(str: string): string {
		str = str.substring(str.indexOf('.') + 1, str.length);
		let xau = "";
		const chiSo: any = str.split('.');
		const n: number = chiSo.length - 1;
		if (n == 0) {
			xau = chiSo[n];
		}
		if (n == 1) {
			xau = "-";
		}
		return xau;
	}

	//upload file
	async uploadFile(file: File) {
		// day file len server
		const upfile: FormData = new FormData();
		upfile.append('file', file);
		upfile.append('folder', this.dataInfo.maDvi + '/' + this.dataInfo.maBcao);
		const temp = await this.quanLyVonPhiService.uploadFile(upfile).toPromise().then(
			(data) => {
				const objfile = {
					fileName: data.filename,
					fileSize: data.size,
					fileUrl: data.url,
				}
				return objfile;
			},
			err => {
				this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
			},
		);
		return temp;
	}

	// luu
	async save(trangThai: string, lyDoTuChoi: string) {
		let checkSaveEdit;
		//check xem tat ca cac dong du lieu da luu chua?
		//chua luu thi bao loi, luu roi thi cho di
		this.lstCtietBcao.forEach(element => {
			if (this.editCache[element.id].edit === true) {
				checkSaveEdit = false
			}
		});
		if (checkSaveEdit == false) {
			this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTSAVE);
			return;
		}
		//tinh lai don vi tien va kiem tra gioi han cua chung
		const lstCtietBcaoTemp: ItemData[] = [];
		let checkMoneyRange = true;
		this.lstCtietBcao.forEach(item => {
			if (item.ttienNamDtoan > MONEY_LIMIT) {
				checkMoneyRange = false;
				return;
			}
			lstCtietBcaoTemp.push({
				...item,
			})
		})

		if (!checkMoneyRange) {
			this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.MONEYRANGE);
			return;
		}

		// replace nhung ban ghi dc them moi id thanh null
		lstCtietBcaoTemp.forEach(item => {
			if (item.id?.length == 38) {
				item.id = null;
			}
		})

		if (!this.viewAppraisalValue) {
			lstCtietBcaoTemp?.forEach(item => {
				item.sluongTd = item.sluongNamDtoan;
				item.ttienTd = item.ttienNamDtoan;
			})
		}

		const request = JSON.parse(JSON.stringify(this.formDetail));
		if (!request.fileDinhKems) {
			request.fileDinhKems = [];
		}
		for (const iterator of this.listFile) {
			request.fileDinhKems.push(await this.uploadFile(iterator));
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
					this.formDetail = data.data;
					this._modalRef.close({
						formDetail: this.formDetail,
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

	// chuc nang check role
	async onSubmit(mcn: string, lyDoTuChoi: string) {
		if (!this.formDetail?.id) {
			this.notification.warning(MESSAGE.WARNING, MESSAGE.MESSAGE_DELETE_WARNING);
			return;
		}
		const requestGroupButtons = {
			id: this.formDetail.id,
			trangThai: mcn,
			lyDoTuChoi: lyDoTuChoi,
		};
		this.spinner.show();
		await this.lapThamDinhService.approveCtietThamDinh(requestGroupButtons).toPromise().then(async (data) => {
			if (data.statusCode == 0) {
				this.formDetail.trangThai = mcn;
				this.getStatusButton();
				if (mcn == "0") {
					this.notification.success(MESSAGE.SUCCESS, MESSAGE.REJECT_SUCCESS);
				} else {
					this.notification.success(MESSAGE.SUCCESS, MESSAGE.APPROVE_SUCCESS);
				}
				this._modalRef.close({
					formDetail: this.formDetail,
				});
			} else {
				this.notification.error(MESSAGE.ERROR, data?.msg);
			}
		}, err => {
			this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
		});
		this.spinner.hide();
	};

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

	deleteLine(id: any) {
		const index: number = this.lstCtietBcao.findIndex(e => e.id === id); // vi tri hien tai
		const nho: string = this.lstCtietBcao[index].stt;
		const head: string = this.getHead(this.lstCtietBcao[index].stt); // lay phan dau cua so tt
		const stt: string = this.lstCtietBcao[index].stt;
		//xóa phần tử và con của nó
		this.lstCtietBcao = this.lstCtietBcao.filter(e => !e.stt.startsWith(nho));
		//update lại số thức tự cho các phần tử cần thiết
		const lstIndex: number[] = [];
		for (let i = this.lstCtietBcao.length - 1; i >= index; i--) {
			if (this.getHead(this.lstCtietBcao[i].stt) == head) {
				lstIndex.push(i);
			}
		}
		this.replaceIndex(lstIndex, -1);
		this.tinhTong();
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
		stt = this.getHead(stt);
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
				if (this.getHead(item.stt) == stt) {
					this.lstCtietBcao[index].ttienNamDtoan = sumNumber([this.lstCtietBcao[index].ttienNamDtoan, item.ttienNamDtoan]);
					this.lstCtietBcao[index].thienNamTruoc = sumNumber([this.lstCtietBcao[index].thienNamTruoc, item.thienNamTruoc]);
					this.lstCtietBcao[index].dtoanNamHtai = sumNumber([this.lstCtietBcao[index].dtoanNamHtai, item.dtoanNamHtai]);
					this.lstCtietBcao[index].uocNamHtai = sumNumber([this.lstCtietBcao[index].uocNamHtai, item.uocNamHtai]);
					this.lstCtietBcao[index].sluongNamDtoan = sumNumber([this.lstCtietBcao[index].sluongNamDtoan, item.sluongNamDtoan]);
					this.lstCtietBcao[index].sluongTd = sumNumber([this.lstCtietBcao[index].sluongTd, item.sluongTd]);
					// this.lstCtietBcao[index].dmucNamDtoan = sumNumber([this.lstCtietBcao[index].dmucNamDtoan, item.dmucNamDtoan]);
					this.lstCtietBcao[index].ttienTd = sumNumber([this.lstCtietBcao[index].ttienTd, item.ttienTd]);
				}
			})
			stt = this.getHead(stt);
		}
		// this.getTotal();
		this.tinhTong();
	}
	// tinh tong tu cap duoi khong chuyen nstt
	sum1() {
		this.lstCtietBcao.forEach(itm => {
			let stt = this.getHead(itm.stt);
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
					// sluongNamDtoan: data.sluongNamDtoan,
					// ttienNamDtoan: data.ttienNamDtoan,
					// thienNamTruoc: data.thienNamTruoc,
					// dtoanNamHtai: data.dtoanNamHtai,
					// uocNamHtai: data.uocNamHtai,
					// dmucNamDtoan: data.dmucNamDtoan,
					// ttienTd: data.ttienTd,
				}
				this.lstCtietBcao.forEach(item => {
					if (this.getHead(item.stt) == stt) {
						this.lstCtietBcao[index].ttienNamDtoan = sumNumber([this.lstCtietBcao[index].ttienNamDtoan, item.ttienNamDtoan]);
						this.lstCtietBcao[index].thienNamTruoc = sumNumber([this.lstCtietBcao[index].thienNamTruoc, item.thienNamTruoc]);
						this.lstCtietBcao[index].dtoanNamHtai = sumNumber([this.lstCtietBcao[index].dtoanNamHtai, item.dtoanNamHtai]);
						this.lstCtietBcao[index].uocNamHtai = sumNumber([this.lstCtietBcao[index].uocNamHtai, item.uocNamHtai]);
						// this.lstCtietBcao[index].dmucNamDtoan = sumNumber([this.lstCtietBcao[index].dmucNamDtoan, item.dmucNamDtoan]);
						this.lstCtietBcao[index].ttienTd = sumNumber([this.lstCtietBcao[index].ttienTd, item.ttienTd]);
					}
				})
				stt = this.getHead(stt);
			}
			// this.getTotal();
			this.tinhTong();
		})

	}

	tinhTong() {
		this.total = new ItemData();
		this.lstCtietBcao.forEach(item => {
			if (item.level == "0") {
				this.total.thienNamTruoc = sumNumber([this.total.thienNamTruoc, item.thienNamTruoc]);
				this.total.dtoanNamHtai = sumNumber([this.total.dtoanNamHtai, item.dtoanNamHtai]);
				this.total.uocNamHtai = sumNumber([this.total.uocNamHtai, item.uocNamHtai]);
				this.total.sluongNamDtoan = sumNumber([this.total.sluongNamDtoan, item.sluongNamDtoan]);
				this.total.ttienNamDtoan = sumNumber([this.total.ttienNamDtoan, item.ttienNamDtoan]);
				this.total.sluongTd = sumNumber([this.total.sluongTd, item.sluongTd]);
				this.total.ttienTd = sumNumber([this.total.ttienTd, item.ttienTd]);
			}
		})

	}

	changeModel(id: string): void {
		this.editCache[id].data.ttienNamDtoan = mulNumber(this.editCache[id].data.dmucNamDtoan, this.editCache[id].data.sluongNamDtoan);
		this.editCache[id].data.ttienTd = mulNumber(this.editCache[id].data.dmucNamDtoan, this.editCache[id].data.sluongTd);

	}

	//thay thế các stt khi danh sách được cập nhật, heSo=1 tức là tăng stt lên 1, heso=-1 là giảm stt đi 1
	replaceIndex(lstIndex: number[], heSo: number) {
		if (heSo == -1) {
			lstIndex.reverse();
		}
		//thay doi lai stt cac vi tri vua tim duoc
		lstIndex.forEach(item => {
			const str = this.getHead(this.lstCtietBcao[item].stt) + "." + (this.getTail(this.lstCtietBcao[item].stt) + heSo).toString();
			const nho = this.lstCtietBcao[item].stt;
			this.lstCtietBcao.forEach(item => {
				item.stt = item.stt.replace(nho, str);
			})
		})
	}

	//tìm vị trí cần để thêm mới
	findVt(str: string): number {
		const start: number = this.lstCtietBcao.findIndex(e => e.stt == str);
		let index: number = start;
		for (let i = start + 1; i < this.lstCtietBcao.length; i++) {
			if (this.lstCtietBcao[i].stt.startsWith(str)) {
				index = i;
			}
		}
		return index;
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

	getStatusButton() {
		if (this.dataInfo?.statusBtnOk && (this.formDetail.trangThai == "2" || this.formDetail.trangThai == "5")) {
			this.statusBtnOk = false;
		} else {
			this.statusBtnOk = true;
		}
	}
	// action print
	doPrint() {
		const WindowPrt = window.open(
			'',
			'',
			'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0',
		);
		let printContent = '';
		printContent = printContent + '<div>';
		printContent =
			printContent + document.getElementById('tablePrint').innerHTML;
		printContent = printContent + '</div>';
		WindowPrt.document.write(printContent);
		WindowPrt.document.close();
		WindowPrt.focus();
		WindowPrt.print();
		WindowPrt.close();
	}

	displayValue(num: number): string {
		num = exchangeMoney(num, '1', this.maDviTien);
		return displayNumber(num);
	}
	getMoneyUnit() {
		return this.donViTiens.find(e => e.id == this.maDviTien)?.tenDm;
	}

	handleCancel() {
		this._modalRef.close();
	}

	deleteFile(id: string): void {
		this.lstFiles = this.lstFiles.filter((a: any) => a.id !== id);
		this.listFile = this.listFile.filter((a: any) => a?.lastModified.toString() !== id);
		this.listIdDeleteFiles.push(id);
	};

	//download file về máy tính
	async downloadFile(id: string) {
		//let file!: File;
		const file: File = this.listFile.find(element => element?.lastModified.toString() == id);
		if (!file) {
			const fileAttach = this.lstFiles.find(element => element?.id == id);
			if (fileAttach) {
				await this.quanLyVonPhiService.downloadFile(fileAttach.fileUrl).toPromise().then(
					(data) => {
						fileSaver.saveAs(data, fileAttach.fileName);
					},
					err => {
						this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
					},
				);
			}
		} else {
			const blob = new Blob([file], { type: "application/octet-stream" });
			fileSaver.saveAs(blob, file.name);
		}
	}

}
