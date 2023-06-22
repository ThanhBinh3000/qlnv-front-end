import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { DanhMucDungChungService } from 'src/app/services/danh-muc-dung-chung.service';
import { LapThamDinhService } from 'src/app/services/quan-ly-von-phi/lapThamDinh.service';
import { displayNumber, exchangeMoney, getHead, setTableWidth, sortByIndex, sumNumber } from 'src/app/Utility/func';
import { AMOUNT, BOX_NUMBER_WIDTH, DON_VI_TIEN, LA_MA, MONEY_LIMIT, QUATITY } from "src/app/Utility/utils";
import * as uuid from "uuid";
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import * as fileSaver from 'file-saver';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { BtnStatus, Form } from '../../bao-cao.class';

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
	soLaMa: any[] = LA_MA;
	lstCtietBcao: ItemData[] = [];
	donViTiens: any[] = DON_VI_TIEN;
	amount = AMOUNT;
	quatity = QUATITY;
	scrollX: string;
	//trang thai cac nut
	status: BtnStatus = new BtnStatus();
	editMoneyUnit = false;
	isDataAvailable = false;
	//nho dem
	editCache: { [key: string]: { edit: boolean; data: ItemData } } = {};

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
	};
	constructor(
		private _modalRef: NzModalRef,
		private spinner: NgxSpinnerService,
		private danhMucService: DanhMucDungChungService,
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
		Object.assign(this.formDetail, this.dataInfo.data);
		Object.assign(this.status, this.dataInfo.status);
		if (this.status.general) {
			const category = await this.danhMucService.danhMucChungGetAll('LTD_TT69_BM18');
			if (category) {
				this.linhVucChis = category.data;
			}
			this.scrollX = setTableWidth(1350, 12, BOX_NUMBER_WIDTH, 60);
		} else {
			this.scrollX = setTableWidth(1350, 12, BOX_NUMBER_WIDTH, 0);
		}
		this.formDetail?.lstCtietLapThamDinhs.forEach(item => {
			this.lstCtietBcao.push({
				...item,
			})
		})
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

		this.lstCtietBcao = sortByIndex(this.lstCtietBcao);

		this.getTotal();
		this.updateEditCache();
		this.getStatusButton();
		this.spinner.hide();
	}


	getStatusButton() {
		if (this.status.ok && (this.formDetail.trangThai == "2" || this.formDetail.trangThai == "5")) {
			this.status.ok = false;
		} else {
			this.status.ok = true;
		}
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
			if (item.ncauChiTongSo > MONEY_LIMIT) {
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
		let xau = "";
		const chiSo: string[] = str.split('.');
		const n: number = chiSo.length - 1;
		let k: number = parseInt(chiSo[n], 10);
		if (n == 0) {
			for (let i = 0; i < this.soLaMa.length; i++) {
				while (k >= this.soLaMa[i].gTri) {
					xau += this.soLaMa[i].kyTu;
					k -= this.soLaMa[i].gTri;
				}
			}
		}
		if (n == 1) {
			xau = chiSo[n];
		}
		if (n == 2) {
			xau = chiSo[n - 1].toString() + "." + chiSo[n].toString();
		}
		if (n == 3) {
			xau = String.fromCharCode(k + 96);
		}
		if (n == 4) {
			xau = "-";
		}
		return xau;
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
		this.editCache[id].data.ncauChiChiaRaDtuPtrien = sumNumber([this.editCache[id].data.ncauChiChiaRaChiCs1, this.editCache[id].data.ncauChiChiaRaChiMoi1]);
		this.editCache[id].data.ncauChiChiaRaChiTx = sumNumber([this.editCache[id].data.ncauChiChiaRaChiCs2, this.editCache[id].data.ncauChiChiaRaChiMoi2]);
		this.editCache[id].data.ncauChiTrongDoChiCs = sumNumber([this.editCache[id].data.ncauChiChiaRaChiCs1, this.editCache[id].data.ncauChiChiaRaChiCs2]);
		this.editCache[id].data.ncauChiTrongDoChiMoi = sumNumber([this.editCache[id].data.ncauChiChiaRaChiMoi1, this.editCache[id].data.ncauChiChiaRaChiMoi2]);
		this.editCache[id].data.ncauChiChiaRaChiDtqg = sumNumber([this.editCache[id].data.ncauChiChiaRaChiCs3, this.editCache[id].data.ncauChiChiaRaChiMoi3]);
		this.editCache[id].data.ncauChiTongSo = sumNumber([this.editCache[id].data.ncauChiTrongDoChiCs, this.editCache[id].data.ncauChiTrongDoChiMoi]);
	}

	sum(stt: string) {
		stt = getHead(stt);
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
				if (getHead(item.stt) == stt) {
					this.lstCtietBcao[index].ncauChiTongSo = sumNumber([this.lstCtietBcao[index].ncauChiTongSo, item.ncauChiTongSo]);
					this.lstCtietBcao[index].ncauChiTrongDoChiCs = sumNumber([this.lstCtietBcao[index].ncauChiTrongDoChiCs, item.ncauChiTrongDoChiCs]);
					this.lstCtietBcao[index].ncauChiTrongDoChiMoi = sumNumber([this.lstCtietBcao[index].ncauChiTrongDoChiMoi, item.ncauChiTrongDoChiMoi]);
					this.lstCtietBcao[index].ncauChiChiaRaDtuPtrien = sumNumber([this.lstCtietBcao[index].ncauChiChiaRaDtuPtrien, item.ncauChiChiaRaDtuPtrien]);
					this.lstCtietBcao[index].ncauChiChiaRaChiCs1 = sumNumber([this.lstCtietBcao[index].ncauChiChiaRaChiCs1, item.ncauChiChiaRaChiCs1]);
					this.lstCtietBcao[index].ncauChiChiaRaChiMoi1 = sumNumber([this.lstCtietBcao[index].ncauChiChiaRaChiMoi1, item.ncauChiChiaRaChiMoi1]);
					this.lstCtietBcao[index].ncauChiChiaRaChiTx = sumNumber([this.lstCtietBcao[index].ncauChiChiaRaChiTx, item.ncauChiChiaRaChiTx]);
					this.lstCtietBcao[index].ncauChiChiaRaChiCs2 = sumNumber([this.lstCtietBcao[index].ncauChiChiaRaChiCs2, item.ncauChiChiaRaChiCs2]);
					this.lstCtietBcao[index].ncauChiChiaRaChiMoi2 = sumNumber([this.lstCtietBcao[index].ncauChiChiaRaChiMoi2, item.ncauChiChiaRaChiMoi2]);
					this.lstCtietBcao[index].ncauChiChiaRaChiCs3 = sumNumber([this.lstCtietBcao[index].ncauChiChiaRaChiCs3, item.ncauChiChiaRaChiCs3]);
					this.lstCtietBcao[index].ncauChiChiaRaChiMoi3 = sumNumber([this.lstCtietBcao[index].ncauChiChiaRaChiMoi3, item.ncauChiChiaRaChiMoi3]);
					this.lstCtietBcao[index].ncauChiChiaRaChiDtqg = sumNumber([this.lstCtietBcao[index].ncauChiChiaRaChiDtqg, item.ncauChiChiaRaChiDtqg]);
				}
			})
			stt = getHead(stt);
		}
		this.getTotal();
	}

	getTotal() {
		this.total = new ItemData();
		this.lstCtietBcao.forEach(item => {
			if (item.level == 0) {
				this.total.ncauChiTongSo = sumNumber([this.total.ncauChiTongSo, item.ncauChiTongSo]);
				this.total.ncauChiTrongDoChiCs = sumNumber([this.total.ncauChiTrongDoChiCs, item.ncauChiTrongDoChiCs]);
				this.total.ncauChiTrongDoChiMoi = sumNumber([this.total.ncauChiTrongDoChiMoi, item.ncauChiTrongDoChiMoi]);
				this.total.ncauChiChiaRaDtuPtrien = sumNumber([this.total.ncauChiChiaRaDtuPtrien, item.ncauChiChiaRaDtuPtrien]);
				this.total.ncauChiChiaRaChiCs1 = sumNumber([this.total.ncauChiChiaRaChiCs1, item.ncauChiChiaRaChiCs1]);
				this.total.ncauChiChiaRaChiMoi1 = sumNumber([this.total.ncauChiChiaRaChiMoi1, item.ncauChiChiaRaChiMoi1]);
				this.total.ncauChiChiaRaChiTx = sumNumber([this.total.ncauChiChiaRaChiTx, item.ncauChiChiaRaChiTx]);
				this.total.ncauChiChiaRaChiCs2 = sumNumber([this.total.ncauChiChiaRaChiCs2, item.ncauChiChiaRaChiCs2]);
				this.total.ncauChiChiaRaChiMoi2 = sumNumber([this.total.ncauChiChiaRaChiMoi2, item.ncauChiChiaRaChiMoi2]);
				this.total.ncauChiChiaRaChiCs3 = sumNumber([this.total.ncauChiChiaRaChiCs3, item.ncauChiChiaRaChiCs3]);
				this.total.ncauChiChiaRaChiMoi3 = sumNumber([this.total.ncauChiChiaRaChiMoi3, item.ncauChiChiaRaChiMoi3]);
				this.total.ncauChiChiaRaChiDtqg = sumNumber([this.total.ncauChiChiaRaChiDtqg, item.ncauChiChiaRaChiDtqg]);
			}
		})
	}

	checkEdit(stt: string) {
		const lstTemp = this.lstCtietBcao.filter(e => e.stt !== stt);
		return lstTemp.every(e => !e.stt.startsWith(stt));
	}

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
	};

}
