
import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { DanhMucDungChungService } from 'src/app/services/danh-muc-dung-chung.service';
import { LapThamDinhService } from 'src/app/services/quan-ly-von-phi/lapThamDinh.service';
import { displayNumber, exchangeMoney, getHead, getTail, sortByIndex, sumNumber } from 'src/app/Utility/func';
import { AMOUNT, BOX_NUMBER_WIDTH, DON_VI_TIEN, LA_MA, MONEY_LIMIT } from "src/app/Utility/utils";
import * as uuid from "uuid";

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
}


@Component({
	selector: 'app-bieu-mau-13-3',
	templateUrl: './bieu-mau-13-3.component.html',
	styleUrls: ['../../bao-cao.component.scss']
})
export class BieuMau133Component implements OnInit {
	@Input() dataInfo;
	//thong tin chi tiet cua bieu mau
	formDetail: any;
	total: ItemData = new ItemData();
	maDviTien: string = '1';
	thuyetMinh: string;
	namBcao: number;
	namKeHoach: string;
	//danh muc
	duAns: any[] = [];
	soLaMa: any[] = LA_MA;
	lstCtietLapThamDinhs: ItemData[] = [];
	donViTiens: any[] = DON_VI_TIEN;
	//trang thai cac nut
	status = false;
	statusBtnFinish: boolean;
	statusBtnOk: boolean;
	statusPrint: boolean;
	editMoneyUnit = false;
	isDataAvailable = false;
	//nho dem
	editCache: { [key: string]: { edit: boolean; data: ItemData } } = {};
	amount = AMOUNT;
	scrollX: string;
	constructor(
		private _modalRef: NzModalRef,
		private spinner: NgxSpinnerService,
		private lapThamDinhService: LapThamDinhService,
		private danhMucService: DanhMucDungChungService,
		private notification: NzNotificationService,
		private modal: NzModalService,
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
		this.namBcao = this.dataInfo?.namBcao;
		this.thuyetMinh = this.formDetail?.thuyetMinh;
		this.status = !this.dataInfo?.status;
		if (this.status) {
			const category = await this.danhMucService.danhMucChungGetAll('LTD_TT342_BM133');
			if (category) {
				this.duAns = category.data;
			}
			this.scrollX = (760 + BOX_NUMBER_WIDTH * 15).toString() + 'px';
		} else {
			this.scrollX = (650 + BOX_NUMBER_WIDTH * 15).toString() + 'px';
		}
		this.statusBtnFinish = this.dataInfo?.statusBtnFinish;
		this.statusPrint = this.dataInfo?.statusBtnPrint;
		this.formDetail?.lstCtietLapThamDinhs.forEach(item => {
			this.lstCtietLapThamDinhs.push({
				...item,
			})
		})
		if (this.lstCtietLapThamDinhs.length == 0) {
			this.duAns.forEach(e => {
				this.lstCtietLapThamDinhs.push({
					...new ItemData(),
					id: uuid.v4() + 'FE',
					stt: e.ma,
					tenDmuc: e.giaTri,
					maDtaiDan: e.ma,
				})
			})
		} else if (!this.lstCtietLapThamDinhs[0]?.stt) {
			this.lstCtietLapThamDinhs.forEach(item => {
				item.stt = item.maDtaiDan;
			})
		}

		this.lstCtietLapThamDinhs = sortByIndex(this.lstCtietLapThamDinhs);

		this.getTotal();
		this.updateEditCache();
		this.getStatusButton();
		this.spinner.hide();
	}

	getStatusButton() {
		if (this.dataInfo?.statusBtnOk && (this.formDetail.trangThai == "2" || this.formDetail.trangThai == "5")) {
			this.statusBtnOk = false;
		} else {
			this.statusBtnOk = true;
		}
	}

	// luu
	async save(trangThai: string, lyDoTuChoi: string) {
		let checkSaveEdit;
		//check xem tat ca cac dong du lieu da luu chua?
		//chua luu thi bao loi, luu roi thi cho di
		this.lstCtietLapThamDinhs.forEach(element => {
			if (this.editCache[element.id].edit === true) {
				checkSaveEdit = false
			}
		});
		if (checkSaveEdit == false) {
			this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTSAVE);
			return;
		}
		//tinh lai don vi tien va kiem tra gioi han cua chung
		const lstCtietLapThamDinhsTemp: ItemData[] = [];
		let checkMoneyRange = true;
		this.lstCtietLapThamDinhs.forEach(item => {
			if (item.kphiPduyetTso > MONEY_LIMIT || item.kphiThienNamTso > MONEY_LIMIT || item.kphiThienLkeTso > MONEY_LIMIT || item.kphiThienDtoanTso > MONEY_LIMIT) {
				checkMoneyRange = false;
				return;
			}
			lstCtietLapThamDinhsTemp.push({
				...item,
			})
		})

		if (!checkMoneyRange) {
			this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.MONEYRANGE);
			return;
		}

		// replace nhung ban ghi dc them moi id thanh null
		lstCtietLapThamDinhsTemp.forEach(item => {
			if (item.id?.length == 38) {
				item.id = null;
			}
		})

		const request = JSON.parse(JSON.stringify(this.formDetail));
		request.lstCtietLapThamDinhs = lstCtietLapThamDinhsTemp;
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
			k = parseInt(chiSo[n - 1], 10);;
			for (let i = 0; i < this.soLaMa.length; i++) {
				while (k >= this.soLaMa[i].gTri) {
					xau += this.soLaMa[i].kyTu;
					k -= this.soLaMa[i].gTri;
				}
			}
			xau += "." + chiSo[n].toString()
		}
		if (n == 2) {
			xau += chiSo[n].toString()
		}
		if (n == 3) {
			xau = null;
		}
		if (n == 4) {
			xau = "-";
		}
		return xau;
	}

	// gan editCache.data == lstCtietLapThamDinhs
	updateEditCache(): void {
		this.lstCtietLapThamDinhs.forEach(item => {
			this.editCache[item.id] = {
				edit: false,
				data: { ...item }
			};
		});
	}

	// start edit
	startEdit(id: string): void {
		if (this.lstCtietLapThamDinhs.every(e => !this.editCache[e.id].edit)) {
			this.editCache[id].edit = true;
		} else {
			this.notification.warning(MESSAGE.WARNING, 'Vui lòng lưu bản ghi đang sửa trước khi thực hiện thao tác');
			return;
		}
	}

	// huy thay doi
	cancelEdit(id: string): void {
		const index = this.lstCtietLapThamDinhs.findIndex(item => item.id === id);
		// lay vi tri hang minh sua
		this.editCache[id] = {
			data: { ...this.lstCtietLapThamDinhs[index] },
			edit: false
		};
	}

	// luu thay doi
	saveEdit(id: string): void {
		const index = this.lstCtietLapThamDinhs.findIndex(item => item.id === id); // lay vi tri hang minh sua
		Object.assign(this.lstCtietLapThamDinhs[index], this.editCache[id].data); // set lai data cua lstCtietLapThamDinhs[index] = this.editCache[id].data
		this.editCache[id].edit = false; // CHUYEN VE DANG TEXT
		this.sum(this.lstCtietLapThamDinhs[index].stt);
		this.updateEditCache();
	}

	addLine(stt: string) {
		let index = -1;
		for (let i = this.lstCtietLapThamDinhs.length - 1; i > 0; i--) {
			if (this.lstCtietLapThamDinhs[i].stt.startsWith(stt)) {
				index = i;
				break;
			}
		}
		const tail = stt == this.lstCtietLapThamDinhs[index].stt ? '1' : (getTail(this.lstCtietLapThamDinhs[index].stt) + 1).toString();
		const item: ItemData = {
			... new ItemData(),
			id: uuid.v4() + 'FE',
			stt: stt + '.' + tail,
		}
		const str: string[] = item.stt.split('.');
		item.level = str.length - 2;
		this.lstCtietLapThamDinhs.splice(index + 1, 0, item);
		this.editCache[item.id] = {
			edit: false,
			data: { ...item }
		};
	}


	// changeModel(id: string): void {
	// }
	changeModel(id: string): void {
		this.editCache[id].data.kphiPduyetTso = sumNumber([this.editCache[id].data.kphiPduyetNsnn, this.editCache[id].data.kphiPduyetNkhac]);
		this.editCache[id].data.kphiThienNamTso = sumNumber([this.editCache[id].data.kphiThienNamNsnnUth, this.editCache[id].data.kphiThienNamKphiThien]);
		this.editCache[id].data.kphiThienLkeTso = sumNumber([this.editCache[id].data.kphiThienLkeNsnn, this.editCache[id].data.kphiThienLkeNkhac]);
		this.editCache[id].data.kphiThienDtoanTso = sumNumber([this.editCache[id].data.kphiThienDtoanNsnn, this.editCache[id].data.kphiThienDtoanNkhac]);
	}

	sum(stt: string) {
		stt = getHead(stt);
		while (stt != '0') {
			const index = this.lstCtietLapThamDinhs.findIndex(e => e.stt == stt);
			const data = this.lstCtietLapThamDinhs[index];
			this.lstCtietLapThamDinhs[index] = {
				...new ItemData(),
				id: data.id,
				stt: data.stt,
				maDtaiDan: data.maDtaiDan,
				tenDmuc: data.tenDmuc,
				level: data.level,
			}
			this.lstCtietLapThamDinhs.forEach(item => {
				if (getHead(item.stt) == stt) {
					this.lstCtietLapThamDinhs[index].kphiPduyetTso = sumNumber([this.lstCtietLapThamDinhs[index].kphiPduyetTso, item.kphiPduyetTso])
					this.lstCtietLapThamDinhs[index].kphiPduyetNsnn = sumNumber([this.lstCtietLapThamDinhs[index].kphiPduyetNsnn, item.kphiPduyetNsnn])
					this.lstCtietLapThamDinhs[index].kphiPduyetNkhac = sumNumber([this.lstCtietLapThamDinhs[index].kphiPduyetNkhac, item.kphiPduyetNkhac])
					this.lstCtietLapThamDinhs[index].kphiThienNamTso = sumNumber([this.lstCtietLapThamDinhs[index].kphiThienNamTso, item.kphiThienNamTso])
					this.lstCtietLapThamDinhs[index].kphiThienNamNsnnDtoan = sumNumber([this.lstCtietLapThamDinhs[index].kphiThienNamNsnnDtoan, item.kphiThienNamNsnnDtoan])
					this.lstCtietLapThamDinhs[index].kphiThienNamNsnnUth = sumNumber([this.lstCtietLapThamDinhs[index].kphiThienNamNsnnUth, item.kphiThienNamNsnnUth])
					this.lstCtietLapThamDinhs[index].kphiThienNamKphiThien = sumNumber([this.lstCtietLapThamDinhs[index].kphiThienNamKphiThien, item.kphiThienNamKphiThien])
					this.lstCtietLapThamDinhs[index].kphiThienLkeTso = sumNumber([this.lstCtietLapThamDinhs[index].kphiThienLkeTso, item.kphiThienLkeTso])
					this.lstCtietLapThamDinhs[index].kphiThienLkeNsnn = sumNumber([this.lstCtietLapThamDinhs[index].kphiThienLkeNsnn, item.kphiThienLkeNsnn])
					this.lstCtietLapThamDinhs[index].kphiThienLkeNkhac = sumNumber([this.lstCtietLapThamDinhs[index].kphiThienLkeNkhac, item.kphiThienLkeNkhac])
					this.lstCtietLapThamDinhs[index].kphiThienDtoanTso = sumNumber([this.lstCtietLapThamDinhs[index].kphiThienDtoanTso, item.kphiThienDtoanTso])
					this.lstCtietLapThamDinhs[index].kphiThienDtoanNsnn = sumNumber([this.lstCtietLapThamDinhs[index].kphiThienDtoanNsnn, item.kphiThienDtoanNsnn])
					this.lstCtietLapThamDinhs[index].kphiThienDtoanNkhac = sumNumber([this.lstCtietLapThamDinhs[index].kphiThienDtoanNkhac, item.kphiThienDtoanNkhac])
				}
			})
			stt = getHead(stt);
		}
		this.getTotal();
	}

	getTotal() {
		this.total = new ItemData();
		this.lstCtietLapThamDinhs.forEach(item => {
			if (item.level == 0) {
				this.total.kphiPduyetTso = sumNumber([this.total.kphiPduyetTso, item.kphiPduyetTso]);
				this.total.kphiPduyetNsnn = sumNumber([this.total.kphiPduyetNsnn, item.kphiPduyetNsnn]);
				this.total.kphiPduyetNkhac = sumNumber([this.total.kphiPduyetNkhac, item.kphiPduyetNkhac]);
				this.total.kphiThienNamTso = sumNumber([this.total.kphiThienNamTso, item.kphiThienNamTso]);
				this.total.kphiThienNamNsnnDtoan = sumNumber([this.total.kphiThienNamNsnnDtoan, item.kphiThienNamNsnnDtoan]);
				this.total.kphiThienNamNsnnUth = sumNumber([this.total.kphiThienNamNsnnUth, item.kphiThienNamNsnnUth]);
				this.total.kphiThienNamKphiThien = sumNumber([this.total.kphiThienNamKphiThien, item.kphiThienNamKphiThien]);
				this.total.kphiThienLkeTso = sumNumber([this.total.kphiThienLkeTso, item.kphiThienLkeTso]);
				this.total.kphiThienLkeNsnn = sumNumber([this.total.kphiThienLkeNsnn, item.kphiThienLkeNsnn]);
				this.total.kphiThienLkeNkhac = sumNumber([this.total.kphiThienLkeNkhac, item.kphiThienLkeNkhac]);
				this.total.kphiThienDtoanTso = sumNumber([this.total.kphiThienDtoanTso, item.kphiThienDtoanTso]);
				this.total.kphiThienDtoanNsnn = sumNumber([this.total.kphiThienDtoanNsnn, item.kphiThienDtoanNsnn]);
				this.total.kphiThienDtoanNkhac = sumNumber([this.total.kphiThienDtoanNkhac, item.kphiThienDtoanNkhac]);
			}
		})
	}

	checkEdit(stt: string) {
		const lstTemp = this.lstCtietLapThamDinhs.filter(e => e.stt !== stt);
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
	deleteLine(stt: string) {
		const head = getHead(stt);
		const tail = getTail(stt);
		this.lstCtietLapThamDinhs = this.lstCtietLapThamDinhs.filter(e => e.stt !== stt);
		this.lstCtietLapThamDinhs.forEach(item => {
			if (item.stt.startsWith(head) && item.stt != head && getTail(item.stt) > tail) {
				item.stt = head + '.' + (getTail(item.stt) - 1).toString();
			}
		})
		this.sum(stt);
		this.updateEditCache();
	}

	//thay thế các stt khi danh sách được cập nhật, heSo=1 tức là tăng stt lên 1, heso=-1 là giảm stt đi 1
	replaceIndex(lstIndex: number[], heSo: number) {
		if (heSo == -1) {
			lstIndex.reverse();
		}
		//thay doi lai stt cac vi tri vua tim duoc
		lstIndex.forEach(item => {
			const str = getHead(this.lstCtietLapThamDinhs[item].stt) + "." + (getTail(this.lstCtietLapThamDinhs[item].stt) + heSo).toString();
			const nho = this.lstCtietLapThamDinhs[item].stt;
			this.lstCtietLapThamDinhs.forEach(item => {
				item.stt = item.stt.replace(nho, str);
			})
		})
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

}

