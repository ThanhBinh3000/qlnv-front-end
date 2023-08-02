import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import * as dayjs from 'dayjs';
import * as fileSaver from 'file-saver';
import { NzNotificationService } from "ng-zorro-antd/notification";
import { CurrencyMaskInputMode } from "ngx-currency";
import * as uuid from "uuid";
import * as XLSX from 'xlsx';
import { MESSAGE } from "../constants/message";
import { QuanLyVonPhiService } from "../services/quanLyVonPhi.service";

export class Status {
	//cac ma trang thai cua bao cao
	static readonly TT_KT = '-1';
	static readonly TT_00 = '0';
	static readonly TT_01 = '1';
	static readonly TT_02 = '2';
	static readonly TT_03 = '3';
	static readonly TT_04 = '4';
	static readonly TT_05 = '5';
	static readonly TT_06 = '6';
	static readonly TT_07 = '7';
	static readonly TT_08 = '8';
	static readonly TT_09 = '9';
	static readonly TRANG_THAI_FULL = [
		{
			id: Status.TT_01,
			tenDm: 'Đang soạn',
		},
		{
			id: Status.TT_02,
			tenDm: 'Trình duyệt',
		},
		{
			id: Status.TT_03,
			tenDm: 'Từ chối duyệt',
		},
		{
			id: Status.TT_04,
			tenDm: 'Duyệt',
		},
		{
			id: Status.TT_05,
			tenDm: 'Từ chối phê duyệt',
		},
		// {
		// 	id: Status.TT_06,
		// 	tenDm: 'Phê duyệt',
		// },
		{
			id: Status.TT_07,
			tenDm: 'Phê duyệt',
		},
		{
			id: Status.TT_08,
			tenDm: 'Từ chối tiếp nhận',
		},
		{
			id: Status.TT_09,
			tenDm: 'Tiếp nhận',
		},
	];

	static reportStatusName(status: string, isParent: boolean = false) {
		if (isParent && (status == Status.TT_06 || status == Status.TT_07)) {
			return 'Mới'
		}
		return Status.TRANG_THAI_FULL.find(e => e.id == status)?.tenDm;
	}

	//cac trang thai cua bieu mau
	static readonly NOT_OK = '0';
	static readonly OK = '1';
	static readonly NOT_RATE = '2';
	static readonly NEW = '3';
	static readonly ENTERING = '4';
	static readonly COMPLETE = '5';
	static readonly TRANG_THAI_BIEU_MAU = [
		{
			id: Status.NOT_OK,
			tenDm: 'Không chấp nhận',
		},
		{
			id: Status.OK,
			tenDm: 'Chấp nhận',
		},
		{
			id: Status.NOT_RATE,
			tenDm: 'Chưa đánh giá (để trống)',
		},
		{
			id: Status.NEW,
			tenDm: 'Mới',
		},
		{
			id: Status.ENTERING,
			tenDm: 'Đang nhập liệu',
		},
		{
			id: Status.COMPLETE,
			tenDm: 'Hoàn tất nhập liệu',
		},
	]

	static appendixStatusName(status: string) {
		return Status.TRANG_THAI_BIEU_MAU.find(e => e.id == status)?.tenDm;
	}

	static readonly TRANG_THAI_DVCD = [
		{
			id: Status.TT_01,
			tenDm: 'Đang soạn',
		},
		{
			id: Status.TT_02,
			tenDm: 'Trình duyệt',
		},
		{
			id: Status.TT_03,
			tenDm: 'Từ chối duyệt',
		},
		{
			id: Status.TT_04,
			tenDm: 'Duyệt',
		},
		{
			id: Status.TT_05,
			tenDm: 'Từ chối phê duyệt',
		},
		{
			id: Status.TT_06,
			tenDm: 'Phê duyệt',
		},
		{
			id: Status.TT_07,
			tenDm: 'Phê duyệt',
		},
	];

	static readonly statusRole = {
		'saveWHist': [Status.TT_01],
		'saveWOHist': [Status.TT_01, Status.TT_03, Status.TT_05, Status.TT_08],
		'submit': [Status.TT_01],
		'pass': [Status.TT_02],
		'approve': [Status.TT_04],
		'accept': [Status.TT_06, Status.TT_07],
		'ok': [Status.TT_02, Status.TT_04, Status.TT_06, Status.TT_07],
		'export': [Status.TT_09],
		'appraisal': [Status.TT_06, Status.TT_07, Status.TT_08, Status.TT_09],
		'reject': [Status.TT_03, Status.TT_05, Status.TT_08],
	}

	static check(key: string, status: string) {
		return Status.statusRole[key].includes(status);
	}

	static statusClass(status) {
		if (Status.check('saveWOHist', status)) {
			return 'du-thao-va-lanh-dao-duyet';
		} else {
			return 'da-ban-hanh';
		}
	}

	static readonly TRANG_THAI_DVCT = [
		{
			id: Status.TT_07,
			tenDm: 'Mới',
		},
		{
			id: Status.TT_08,
			tenDm: 'Từ chối tiếp nhận',
		},
		{
			id: Status.TT_09,
			tenDm: 'Tiếp nhận',
		},
	]

	static readonly TRANG_THAI_KIEM_TRA = [
		{
			id: Status.TT_09,
			tenDm: 'Tiếp nhận'
		},
		{
			id: Status.TT_07,
			tenDm: 'Mới'
		},
		{
			id: Status.TT_KT,
			tenDm: 'Chưa gửi đơn vị cấp trên'
		},
	]

	static checkStatusName(status: string) {
		return Status.TRANG_THAI_KIEM_TRA.find(e => e.id == status)?.tenDm;
	}

	static readonly TRANG_THAI_PD_DVCT = [
		{
			id: Status.TT_01,
			tenDm: 'Mới',
		},
		{
			id: Status.TT_02,
			tenDm: 'Trình duyệt',
		},
		{
			id: Status.TT_03,
			tenDm: 'Từ chối duyệt',
		},
		{
			id: Status.TT_04,
			tenDm: 'Duyệt',
		},
		{
			id: Status.TT_05,
			tenDm: 'Từ chối phê duyệt',
		},
		{
			id: Status.TT_06,
			tenDm: 'Phê duyệt',
		},
		{
			id: Status.TT_07,
			tenDm: 'Phê duyệt',
		},
	]

	static statusDvctName(id: string) {
		return Status.TRANG_THAI_PD_DVCT.find(e => e.id == id)?.tenDm;
	}

	static readonly DA_TONG_HOP = '1';
	static readonly CHUA_TONG_HOP = '0';
	static readonly TRANG_THAI_TONG_HOP = [
		{
			id: Status.CHUA_TONG_HOP,
			tenDm: 'Chưa được tổng hợp',
		},
		{
			id: Status.DA_TONG_HOP,
			tenDm: 'Đã được tổng hợp',
		},
	]

	static synthStatusName(id: string) {
		return Status.TRANG_THAI_TONG_HOP.find(e => e.id == id)?.tenDm;
	}
}

export class Table {
	private static readonly NUM_BOX_WIDTH = 150;
	private static readonly TEXT_BOX_WIDTH = 250;
	static tableWidth(leftW: number, numCol: number, textCol: number, rightW: number): string {
		return (leftW + numCol * Table.NUM_BOX_WIDTH + textCol * Table.TEXT_BOX_WIDTH + rightW).toString() + 'px';
	}

	//lấy phần đầu của stt, dùng để xác định cha cua phần tử
	static preIndex(str: string): string {
		return str.substring(0, str.lastIndexOf('.'));
	}
	// lấy phần đuôi của stt
	static subIndex(str: string): number {
		return parseInt(str.substring(str.lastIndexOf('.') + 1, str.length), 10);
	}
	//tìm vị trí cần để thêm mới
	static findIndex(str: string, lstCtietBcao: any[]): number {
		const start: number = lstCtietBcao.findIndex(e => e.stt == str);
		let index: number = start;
		for (let i = start + 1; i < lstCtietBcao.length; i++) {
			if (lstCtietBcao[i].stt.startsWith(str)) {
				index = i;
			}
		}
		return index;
	}

	//dat lai level cho cac ban ghi
	static setLevel(lstCtietBcao: any[], key: string) {
		lstCtietBcao.forEach(item => {
			const str: string[] = key ? item[key].split('.') : item.stt.split('.');
			item.level = str.length - 2;
		})
		return lstCtietBcao;
	}

	//sap xep co thu tu cua danh muc theo so thu tu co san
	static sortByIndex(lstCtietBcao: any[]) {
		lstCtietBcao = this.setLevel(lstCtietBcao, null);
		lstCtietBcao.sort((item1, item2) => {
			if (item1.level > item2.level) {
				return 1;
			}
			if (item1.level < item2.level) {
				return -1;
			}
			if (this.subIndex(item1.stt) > this.subIndex(item2.stt)) {
				return -1;
			}
			if (this.subIndex(item1.stt) < this.subIndex(item2.stt)) {
				return 1;
			}
			return 0;
		});
		const lstTemp: any[] = [];
		lstCtietBcao.forEach(item => {
			const index: number = lstTemp.findIndex(e => e.stt == this.preIndex(item.stt));
			if (index == -1) {
				lstTemp.splice(0, 0, item);
			} else {
				lstTemp.splice(index + 1, 0, item);
			}
		})

		return lstTemp;
	}

	static sortWithoutIndex(lstCtietBcao: any[], key: string) {
		lstCtietBcao = this.setLevel(lstCtietBcao, key);
		let level = 0;
		let lstCtietBcaoTemp: any[] = [];
		let lstTemp = lstCtietBcao.filter(e => e.level == level);
		while (lstTemp?.length > 0) {
			lstTemp.sort((a, b) => {
				if (this.subIndex(a[key]) > this.subIndex(b[key])) {
					return 1;
				}
				return -1;
			})
			lstTemp.forEach(item => {
				if (lstCtietBcaoTemp?.length == 0) {
					this.addHead(item, lstCtietBcaoTemp);
				} else {
					let index: number = lstCtietBcaoTemp.findIndex(e => e[key] === this.preIndex(item[key]));
					if (index != -1) {
						lstCtietBcaoTemp = this.addChild(lstCtietBcaoTemp[index].id, item, lstCtietBcaoTemp);
					} else {
						index = lstCtietBcaoTemp.findIndex(e => this.preIndex(e[key]) === this.preIndex(item[key]));
						lstCtietBcaoTemp = this.addParent(lstCtietBcaoTemp[index].id, item, lstCtietBcaoTemp);
					}
				}
			})
			level += 1;
			lstTemp = lstCtietBcao.filter(e => e.level == level);
		}
		return lstCtietBcaoTemp;
	}

	//them phan tu o vi tri dau tien cua mang
	static addHead(initItem: any, lstCtietBcao: any[]) {
		lstCtietBcao.push(initItem);
		lstCtietBcao[0].stt = '0.1';
		lstCtietBcao[0].id = !initItem.id ? uuid.v4() + 'FE' : initItem.id;
		return lstCtietBcao;
	}

	//them phan tu co cap cung voi cap cua vi tri hien tai
	static addParent(id: string, initItem: any, lstCtietBcao: any[]) {
		const index: number = lstCtietBcao.findIndex(e => e.id === id); // vi tri hien tai
		const head: string = this.preIndex(lstCtietBcao[index].stt); // lay phan dau cua so tt
		const tail: number = this.subIndex(lstCtietBcao[index].stt); // lay phan duoi cua so tt
		const ind: number = this.findIndex(lstCtietBcao[index].stt, lstCtietBcao); // vi tri can duoc them
		// tim cac vi tri can thay doi lai stt
		const lstIndex: number[] = [];
		for (let i = lstCtietBcao.length - 1; i > ind; i--) {
			if (this.preIndex(lstCtietBcao[i].stt) == head) {
				lstIndex.push(i);
			}
		}

		lstCtietBcao = this.replaceIndex(lstIndex, 1, lstCtietBcao);
		lstCtietBcao.splice(ind + 1, 0, initItem);
		lstCtietBcao[ind + 1].stt = head + "." + (tail + 1).toString();
		lstCtietBcao[ind + 1].id = !initItem.id ? uuid.v4() + 'FE' : initItem.id;

		return lstCtietBcao;
	}

	static addChild(id: string, initItem: any, lstCtietBcao: any[]) {
		const data: any = lstCtietBcao.find(e => e.id === id);
		let index: number = lstCtietBcao.findIndex(e => e.id === id); // vi tri hien tai
		let stt: string;
		if (lstCtietBcao.findIndex(e => this.preIndex(e.stt) == data.stt) == -1) {
			stt = data.stt + '.1';
		} else {
			index = this.findIndex(data.stt, lstCtietBcao);
			for (let i = lstCtietBcao.length - 1; i >= 0; i--) {
				if (this.preIndex(lstCtietBcao[i].stt) == data.stt) {
					stt = data.stt + '.' + (this.subIndex(lstCtietBcao[i].stt) + 1).toString();
					break;
				}
			}
		}

		lstCtietBcao.splice(index + 1, 0, initItem);
		lstCtietBcao[index + 1].stt = stt;
		lstCtietBcao[index + 1].id = !initItem.id ? uuid.v4() + 'FE' : initItem.id;
		return lstCtietBcao;
	}

	//thay thế các stt khi danh sách được cập nhật, heSo=1 tức là tăng stt lên 1, heso=-1 là giảm stt đi 1
	static replaceIndex(lstIndex: number[], heSo: number, lstCtietBcao: any[]) {
		if (heSo == -1) {
			lstIndex.reverse();
		}
		//thay doi lai stt cac vi tri vua tim duoc
		lstIndex.forEach(item => {
			const str = this.preIndex(lstCtietBcao[item].stt) + "." + (this.subIndex(lstCtietBcao[item].stt) + heSo).toString();
			const nho = lstCtietBcao[item].stt;
			lstCtietBcao.forEach(item => {
				item.stt = item.stt.replace(nho, str);
			})
		})
		return lstCtietBcao;
	}

	//xoa hang
	static deleteRow(id: string, lstCtietBcao: any[]) {
		const index: number = lstCtietBcao.findIndex(e => e.id === id); // vi tri hien tai
		const nho: string = lstCtietBcao[index].stt;
		const head: string = this.preIndex(lstCtietBcao[index].stt); // lay phan dau cua so tt
		//xóa phần tử và con của nó
		lstCtietBcao = lstCtietBcao.filter(e => !e.stt.startsWith(nho));
		//update lại số thức tự cho các phần tử cần thiết
		const lstIndex: number[] = [];
		for (let i = lstCtietBcao.length - 1; i >= index; i--) {
			if (this.preIndex(lstCtietBcao[i].stt) == head) {
				lstIndex.push(i);
			}
		}
		lstCtietBcao = this.replaceIndex(lstIndex, -1, lstCtietBcao);

		return lstCtietBcao;
	}

	static coo(c: number, r: number) {
		const thuong = Math.floor(c / 26);
		const du = c % 26;
		if (thuong > 0) {
			return String.fromCharCode(thuong + 96).toUpperCase() + String.fromCharCode(du + 97).toUpperCase() + (r + 1).toString();
		}
		return String.fromCharCode(du + 97).toUpperCase() + (r + 1).toString();
	}

	static excelHeader(r: number, c: number) {
		const data = [];
		const subData = [];
		for (let i = 0; i <= c; i++) {
			subData.push('');
		}
		for (let i = 0; i <= r; i++) {
			data.push(subData);
		}
		return data;
	}

	static initExcel(data: any[]) {
		const ori = data[0];
		data = data.filter(item => item.val !== null);
		const mergeCells = [];
		const worksheet = XLSX.utils.aoa_to_sheet(this.excelHeader(ori.t + ori.b, ori.l + ori.r));
		data.forEach(item => {
			worksheet[this.coo(ori.l + item.l, ori.t + item.t)].v = item.val;
			mergeCells.push({ s: { r: ori.t + item.t, c: ori.l + item.l }, e: { r: ori.t + item.b, c: ori.l + item.r } })
		})
		worksheet['!merges'] = mergeCells;
		return worksheet;
	}
}

export class Operator {
	maDviTien: string;
	precision: number;
	amount: any;

	constructor(maDviTien: string, precision: number = 4) {
		this.maDviTien = maDviTien;
		this.precision = precision;
		this.amount = {
			allowZero: true,
			allowNegative: false,
			precision: this.precision,
			prefix: '',
			thousands: '.',
			decimal: ',',
			align: "left",
			nullable: true,
			inputMode: CurrencyMaskInputMode.NATURAL,
		}
	}

	setMoneyUnit(maDviTien: string) {
		this.maDviTien = maDviTien;
	}

	static readonly amount = {
		allowZero: true,
		allowNegative: false,
		precision: 4,
		prefix: '',
		thousands: '.',
		decimal: ',',
		align: "left",
		nullable: true,
		inputMode: CurrencyMaskInputMode.NATURAL,
	}

	static exchangeMoney(value: number, oldMoneyUnit: string, newMoneyUnit: string): number {
		const oldUnit = (parseInt(oldMoneyUnit, 10) - 1) * 3;
		const newUnit = (parseInt(newMoneyUnit, 10) - 1) * 3;
		if (!value && value !== 0) {
			return null;
		}
		return value * Math.pow(10, oldUnit - newUnit);
	}
	//cong day cac so
	static sum(num: any): number {
		let check = true;
		let tong = 0;
		num.forEach(item => {
			if (item || item === 0) {
				check = false;
			}
			tong += (+item) ? (+item) : 0;
		})
		if (check) {
			return null;
		}
		return tong;
	}

	//nhan hai so
	static mul(num1: number, num2: number) {
		if (((!num1 && num1 !== 0) || num1 == 1 || num1 == -1) && (!num2 && num2 !== 0)) {
			return null;
		}
		if (!num1) {
			num1 = 0;
		}
		if (!num2) {
			num2 = 0;
		}
		return num1 * num2;
	}

	//chia hai so
	static div(num1, num2): number {
		if ((!num1 && num1 !== 0) &&
			(!num2 && num2 !== 0)) {
			return null;
		}
		if (Number(num2) == 0) {
			return 0 / 0;
		} else {
			return Number(num1) / Number(+num2);
		}
	}

	static percent(num1, num2): number {
		return Operator.div(Operator.mul(num1, 100), num2);
	}

	//hien thi cac so theo dinh dang
	static displayNumber(num: number): string {
		let displayValue: string;
		if (Number.isNaN(num)) {
			return 'NaN';
		}
		if (!num && num !== 0) {
			return '';
		}
		const dau = num < 0 ? '-' : '';
		num = Math.abs(num);
		let real!: string;
		let imaginary!: string;
		if (num == Math.floor(num)) {
			real = num.toString();
		} else {
			const str = num.toFixed(4);
			real = str.split('.')[0];
			imaginary = str.split('.')[1];
			while (imaginary[imaginary.length - 1] == '0') {
				imaginary = imaginary.slice(0, -1);
			}
		}
		if (!imaginary) {
			displayValue = dau + Operator.separateNumber(real);
		} else {
			displayValue = dau + Operator.separateNumber(real) + ',' + imaginary;
		}
		return displayValue;
	}

	//hien thi cac so theo dinh dang
	static fmtNum(num: number): string {
		let displayValue: string;
		if (Number.isNaN(num)) {
			return 'NaN';
		}
		if (!num && num !== 0) {
			return '';
		}
		const dau = num < 0 ? '-' : '';
		num = Math.abs(num);
		let real!: string;
		let imaginary!: string;
		if (num == Math.floor(num)) {
			real = num.toString();
		} else {
			const str = num.toFixed(4);
			real = str.split('.')[0];
			imaginary = str.split('.')[1];
			while (imaginary[imaginary.length - 1] == '0') {
				imaginary = imaginary.slice(0, -1);
			}
		}
		if (!imaginary) {
			displayValue = dau + Operator.separateNumber(real);
		} else {
			displayValue = dau + Operator.separateNumber(real) + ',' + imaginary;
		}
		return displayValue;
	}

	//ngan cach nghin trong so boi dau .
	static separateNumber(str: string): string {
		if (str.length < 4) {
			return str;
		}
		let displayValue!: string;
		let index = str.indexOf('.');
		if (index == -1) {
			displayValue = str.slice(0, -3) + '.' + str.slice(-3);
			str = displayValue;
			index = str.indexOf('.');
		}
		while (index - 3 > 0) {
			displayValue = str.slice(0, index - 3) + '.' + str.slice(index - 3);
			str = displayValue;
			index = str.indexOf('.');
		}
		return displayValue;
	}

	static fmtVal(num: number, moneyUnit: string): string {
		num = Operator.exchangeMoney(num, '1', moneyUnit);
		return Operator.displayNumber(num);
	}

	fmtNum(num: number) {
		return Operator.displayNumber(num);
	}

	fmtVal(num: number): string {
		num = Operator.exchangeMoney(num, '1', this.maDviTien);
		return Operator.displayNumber(num);
	}

	//kiem tra xem chuoi co phai toan ky tu so ko
	static numOnly(str: string): boolean {
		let check = true;
		if (!str) {
			return true;
		}
		for (let i = 0; i < str.length; i++) {
			if (str.charCodeAt(i) < 48 || str.charCodeAt(i) > 57) {
				check = false;
			}
		}
		return check;
	}
}

@Injectable({
	providedIn: 'root',
})
export class FileManip {
	constructor(
		public quanLyVonPhiService: QuanLyVonPhiService,
		private notification: NzNotificationService,
	) { }

	async uploadFile(file: File, path: string) {
		const upfile: FormData = new FormData();
		upfile.append('file', file);
		upfile.append('folder', path);
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
			}
		);
		return temp;
	}

	async downloadFile(file, doc) {
		if (doc.fileUrl) {
			await this.quanLyVonPhiService.downloadFile(doc.fileUrl).toPromise().then(
				(data) => {
					let fileName = doc.fileName;
					if (fileName.split('.').length == 1) {
						fileName = doc.fileName + doc.fileUrl.substring(doc.fileUrl.lastIndexOf('.'))
					}
					fileSaver.saveAs(data, fileName);
				},
				err => {
					this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
				},
			);
		} else {
			const blob = new Blob([file], { type: "application/octet-stream" });
			fileSaver.saveAs(blob, file.name);
		}
	}
}
export class Utils {
	public static FORMAT_DATE_STR = "dd/MM/yyyy";
	public static FORMAT_DATE_TIME_STR = "dd/MM/yyyy HH:mm:ss";

	static fmtDate(date: any) {
		const datePipe = new DatePipe('en-US');
		return datePipe.transform(date, Utils.FORMAT_DATE_STR);
	}

	static getName(n: number, name: string) {
		const lstStr: string[] = name.split('$');
		let newName = lstStr[0];
		for (let i = 1; i < lstStr.length; i = i + 2) {
			let year = 0;
			let sign = 1;
			Array.from(lstStr[i]).forEach(item => {
				if (item == 'n') {
					year += sign * n;
				};
				if (item.charCodeAt(0) == 43) {
					sign = 1;
				}
				if (item.charCodeAt(0) == 45) {
					sign = -1;
				}
				if (item.charCodeAt(0) > 47 && item.charCodeAt(0) < 58) {
					year += sign * (item.charCodeAt(0) - 48);
				}
			})
			newName += year.toString();
			if (lstStr[i + 1]) {
				newName += lstStr[i + 1];
			}
		}
		return newName;
	}

	static readonly DVI_TIEN = [
		{
			id: '1',
			tenDm: 'Đồng',
			giaTri: 1
		},
		{
			id: '2',
			tenDm: 'Nghìn đồng',
			giaTri: 1000
		},
		{
			id: '3',
			tenDm: 'Triệu đồng',
			giaTri: 1000000
		},
		{
			id: '4',
			tenDm: 'Tỷ đồng',
			giaTri: 1000000000
		},
	]

	static moneyUnitName(moneyUnit: string) {
		return Utils.DVI_TIEN.find(e => e.id == moneyUnit)?.tenDm;
	}

	static readonly LA_MA = [
		{
			kyTu: "M",
			gTri: 1000,
		},
		{
			kyTu: "CM",
			gTri: 900,
		},
		{
			kyTu: "D",
			gTri: 500,
		},
		{
			kyTu: "CD",
			gTri: 400,
		},
		{
			kyTu: "C",
			gTri: 100,
		},
		{
			kyTu: "XC",
			gTri: 90,
		},
		{
			kyTu: "L",
			gTri: 50,
		},
		{
			kyTu: "XL",
			gTri: 40,
		},
		{
			kyTu: "X",
			gTri: 10,
		},
		{
			kyTu: "IX",
			gTri: 9,
		},
		{
			kyTu: "V",
			gTri: 5,
		},
		{
			kyTu: "IV",
			gTri: 4,
		},
		{
			kyTu: "I",
			gTri: 1,
		},
	]

	static laMa(k: number) {
		let xau = "";
		for (let i = 0; i < Utils.LA_MA.length; i++) {
			while (k >= Utils.LA_MA[i].gTri) {
				xau += Utils.LA_MA[i].kyTu;
				k -= Utils.LA_MA[i].gTri;
			}
		}
		return xau;
	}

	static doPrint() {
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

	static readonly MONEY_LIMIT = 9000000000000000;
	static readonly FILE_SIZE = 2097152;

	static getListYear(start: number, end: number) {
		const thisYear = dayjs().get('year');
		const lstNam = [];
		for (let i = -start; i < end; i++) {
			lstNam.push(thisYear + i);
		}
		return lstNam
	}

	static getDocName(soCv: string, ngayCv: string, tenDvi: string) {
		return 'Kèm theo Công văn số ' + soCv + ' ngày ' + Utils.fmtDate(ngayCv) + ' của ' + tenDvi;
	}

	public static ROUND = 4;

	// Trang thai response
	public static RESP_SUCC = 0;
	public static RESP_FAIL = 1;

	public static TYPE_USER_BACKEND = "BE";
	public static TYPE_USER_FRONTEND = "FE";

	// Trang thai
	public static MOI_TAO = "00";
	public static HOAT_DONG = "01";
	public static NGUNG_HOAT_DONG = "02";
	public static TAM_KHOA = "03";

	// Loai bao cao
	public static BCAO_CTXGD03N = "01";
	public static BCAO_02 = "02";
	public static BCAO_03 = "03";

	// Trang thái báo cáo
	public static TT_BC_KT = "-1"; // kiem tra
	public static TT_BC_0 = "0"; // Đã xóa
	public static TT_BC_1 = "1"; // Đang soạn,
	public static TT_BC_2 = "2"; // Trình duyệt,
	public static TT_BC_3 = "3"; // Trưởng BP từ chối,
	public static TT_BC_4 = "4"; // Trưởng BP duyệt,
	public static TT_BC_5 = "5"; // Lãnh đạo từ chối,
	public static TT_BC_6 = "6"; // Lãnh đạo phê duyệt,
	public static TT_BC_7 = "7"; // Gửi ĐV cấp trên,
	public static TT_BC_8 = "8"; // ĐV cấp trên từ chối,
	public static TT_BC_9 = "9"; // Đv cấp trên duyệt,
	public static TT_BC_10 = "10"; // Lãnh đạo điều chỉnh,
	public static TT_BC_11 = "11"; //Trạng thái của Phương án giao số trần chi (đã giao);
	// Danh sach quyen
	public static LANH_DAO = '1';// "Lãnh Đạo";
	public static TRUONG_BO_PHAN = '2';// "Trưởng Bộ Phận";
	public static NHAN_VIEN = '3';// "Nhân Viên";

	// Cap don vi
	public static CHI_CUC = "3";
	public static CUC_KHU_VUC = "2";
	public static TONG_CUC = "1";

	//loai de nghi
	public static MUA_THOC = "0";
	public static MUA_GAO = "1";
	public static MUA_MUOI = "2";
	public static MUA_VTU = "3";
	public static THOP_TU_CUC_KV = "4";
	public static THOP_TAI_TC = "5";
	//can cu gia
	public static HD_TRUNG_THAU = "0";
	public static QD_DON_GIA = "1";
	//loai von
	public static CAP_VON = "1";
	public static UNG_VON = "2";

	////////// TRANG THAI BAO CAO DE THUC HIEN THAO TAC /////////////////////////////////
	//xoa
	public static statusDelete = [Utils.TT_BC_1];
	//luu
	public static statusSave = [Utils.TT_BC_1];
	// trinh duyet
	public static statusApprove = [Utils.TT_BC_1];
	// duyet, tu choi
	public static statusDuyet = [Utils.TT_BC_2];
	//phe duyet, tu choi
	public static statusPheDuyet = [Utils.TT_BC_4];
	//tiep nhan, tu choi
	public static statusTiepNhan = [Utils.TT_BC_6, Utils.TT_BC_7];
	//copy
	public static statusCopy = [Utils.TT_BC_1, Utils.TT_BC_2, Utils.TT_BC_3, Utils.TT_BC_4, Utils.TT_BC_5, Utils.TT_BC_6, Utils.TT_BC_7, Utils.TT_BC_8, Utils.TT_BC_9];
	//print
	public static statusPrint = [Utils.TT_BC_1, Utils.TT_BC_2, Utils.TT_BC_3, Utils.TT_BC_4, Utils.TT_BC_5, Utils.TT_BC_6, Utils.TT_BC_7, Utils.TT_BC_8, Utils.TT_BC_9];
	//ok, not ok
	public static statusOK = [Utils.TT_BC_2, Utils.TT_BC_4, Utils.TT_BC_6, Utils.TT_BC_7];
	//export
	public static statusExport = [Utils.TT_BC_9];
	public static statusAppraisal = [Utils.TT_BC_6, Utils.TT_BC_7, Utils.TT_BC_8, Utils.TT_BC_9];

	// lay ten trang thai theo ma trang thai
	public getStatusName(id: string) {
		let statusName;
		switch (id) {
			case Utils.TT_BC_0:
				statusName = "Đã xóa";
				break;
			case Utils.TT_BC_1:
				statusName = "Đang soạn"
				break;
			case Utils.TT_BC_2:
				statusName = "Trình duyệt"
				break;
			case Utils.TT_BC_3:
				statusName = "Từ chối duyệt"
				break;
			case Utils.TT_BC_4:
				statusName = "Duyệt"
				break;
			case Utils.TT_BC_5:
				statusName = "Từ chối phê duyệt"
				break;
			case Utils.TT_BC_6:
				statusName = "Phê duyệt"
				break;
			case Utils.TT_BC_7:
				statusName = "Phê duyệt"
				break;
			case Utils.TT_BC_8:
				statusName = "Từ chối tiếp nhận"
				break;
			case Utils.TT_BC_9:
				statusName = "Tiếp nhận"
				break;
			case Utils.TT_BC_10:
				statusName = "Điều chỉnh theo số kiểm tra"
				break;
			case Utils.TT_BC_11:
				statusName = "Đã giao"
				break;
			case Utils.TT_BC_KT:
				statusName = "Chưa có"
				break;
			default:
				statusName = id;
				break;
		}
		return statusName;
	}

}

export class Roles {
	static readonly LTD = {
		ADD_REPORT: 'KHVDTNSNN_DTNSNN_LAPTD_LAP_BC',
		SUBMIT_REPORT: 'KHVDTNSNN_DTNSNN_LAPTD_TRINHDUYET_BC',
		EDIT_REPORT: 'KHVDTNSNN_DTNSNN_LAPTD_SUA_BC',
		DEL_REPORT: 'KHVDTNSNN_DTNSNN_LAPTD_XOA_BC',
		COPY_REPORT: 'KHVDTNSNN_DTNSNN_LAPTD_COPY_BC',
		PASS_REPORT: 'KHVDTNSNN_DTNSNN_LAPTD_DUYET_TUCHOIDUYET_BC',
		APPROVE_REPORT: 'KHVDTNSNN_DTNSNN_LAPTD_PHEDUYET_TUCHOIPHEDUYET_BC',
		VIEW_REPORT: 'KHVDTNSNN_DTNSNN_LAPTD_XEM_BC',
		PRINT_REPORT: 'KHVDTNSNN_DTNSNN_LAPTD_IN_BC',
		EXPORT_REPORT: 'KHVDTNSNN_DTNSNN_LAPTD_XUAT_BC',
		ACCEPT_REPORT: 'KHVDTNSNN_DTNSNN_LAPTD_TIEPNHAN_TUCHOI_BC',
		SYNTH_REPORT: 'KHVDTNSNN_DTNSNN_LAPTD_TONGHOP_BC',
		SUBMIT_SYNTH_REPORT: 'KHVDTNSNN_DTNSNN_LAPTD_TRINHDUYET_BC_TONGHOP',
		EDIT_SYNTH_REPORT: 'KHVDTNSNN_DTNSNN_LAPTD_SUA_BC_TONGHOP',
		DEL_SYNTH_REPORT: 'KHVDTNSNN_DTNSNN_LAPTD_XOA_BC_TONGHOP',
		COPY_SYNTH_REPORT: 'KHVDTNSNN_DTNSNN_LAPTD_COPY_BC_TONGHOP',
		PASS_SYNTH_REPORT: 'KHVDTNSNN_DTNSNN_LAPTD_DUYET_TUCHOI_BC_TH',
		APPROVE_SYNTH_REPORT: 'KHVDTNSNN_DTNSNN_LAPTD_PHEDUYET_TUCHOI_BC_TH',
		VIEW_SYNTH_REPORT: 'KHVDTNSNN_DTNSNN_LAPTD_XEM_BC_TONGHOP',
		PRINT_SYNTH_REPORT: 'KHVDTNSNN_DTNSNN_LAPTD_IN_BC_TONGHOP',
		EXPORT_SYNTH_REPORT: 'KHVDTNSNN_DTNSNN_LAPTD_XUAT_BC_TONGHOP',
		ADD_COEF_INS: 'KHVDTNSNN_DTNSNN_HSBH_LAP',
		SUBMIT_COEF_INS: 'KHVDTNSNN_DTNSNN_HSBH_TRINHDUYET',
		EDIT_COEF_INS: 'KHVDTNSNN_DTNSNN_HSBH_SUA',
		DEL_COEF_INS: 'KHVDTNSNN_DTNSNN_HSBH_XOA',
		COPY_COEF_INS: 'KHVDTNSNN_DTNSNN_HSBH_COPY',
		VIEW_COEF_INS: 'KHVDTNSNN_DTNSNN_HSBH_XEM',
		PASS_COEF_INS: 'KHVDTNSNN_DTNSNN_HSBH_DUYET_TUCHOIDUYET',
		APPROVE_COEF_INS: 'KHVDTNSNN_DTNSNN_HSBH_PHEDUYET_TUCHOIPHEDUYET',
	}

	static readonly GDT = {
		ADD_REPORT_BTC: 'KHVDTNSNN_DTNSNN_GIAODT_NHAP_QUYETDINH_BTC',
		EDIT_REPORT_BTC: 'KHVDTNSNN_DTNSNN_GIAODT_SUA_QUYETDINH_BTC',
		DELETE_REPORT_BTC: 'KHVDTNSNN_DTNSNN_GIAODT_XOA_QUYETDINH_BTC',

		ADD_REPORT_PA_PBDT: 'KHVDTNSNN_DTNSNN_GIAODT_LAP_PA_PBDT',
		APPROVE_REPORT_PA_PBDT: 'KHVDTNSNN_DTNSNN_GIAODT_TRINHDUYET_PA_PBDT',
		EDIT_REPORT_PA_PBDT: 'KHVDTNSNN_DTNSNN_GIAODT_SUA_PA_PBDT',
		DELETE_REPORT_PA_PBDT: 'KHVDTNSNN_DTNSNN_GIAODT_XOA_PA_PBDT',
		COPY_REPORT_PA_PBDT: 'KHVDTNSNN_DTNSNN_GIAODT_COPY_PA_PBDT',
		DUYET_REPORT_PA_PBDT: 'KHVDTNSNN_DTNSNN_GIAODT_DUYET_TUCHOI_PA_PBDT',
		PHE_DUYET_REPORT_PA_PBDT: 'KHVDTNSNN_DTNSNN_GIAODT_PHEDUYET_TUCHOI_PA_PBDT',
		VIEW_REPORT_PA_PBDT: 'KHVDTNSNN_DTNSNN_GIAODT_XEM_PA_PBDT',
		PRINT_REPORT_PA_PBDT: 'KHVDTNSNN_DTNSNN_GIAODT_IN_PA_PBDT',
		EXPORT_REPORT_PA_PBDT: 'KHVDTNSNN_DTNSNN_GIAODT_XUAT_PA_PBDT',

		ADD_REPORT_CV_QD_GIAO_PA_PBDT: 'KHVDTNSNN_DTNSNN_GIAODT_NHAP_CV_QD_GIAO_PA_PBDT',
		EDIT_REPORT_CV_QD_GIAO_PA_PBDT: 'KHVDTNSNN_DTNSNN_GIAODT_SUA_CV_QD_GIAO_PA_PBDT',
		DELETE_REPORT_CV_QD_GIAO_PA_PBDT: 'KHVDTNSNN_DTNSNN_GIAODT_XOA_CV_QD_GIAO_PA_PBDT',

		GIAO_PA_PBDT: 'KHVDTNSNN_DTNSNN_GIAODT_GIAO_PA_PBDT',
		NHAN_PA_PBDT: 'KHVDTNSNN_DTNSNN_GIAODT_NHAN_PA_PBDT',

		GIAODT_TRINHTONGCUC_PA_PBDT: 'KHVDTNSNN_DTNSNN_GIAODT_TRINHTONGCUC_PA_PBDT',
		TIEPNHAN_TUCHOI_PA_PBDT: 'KHVDTNSNN_DTNSNN_GIAODT_TIEPNHAN_TUCHOI_PA_PBDT',
		TONGHOP_PA_PBDT: 'KHVDTNSNN_DTNSNN_GIAODT_TONGHOP_PA_PBDT',
		TRINHDUYET_PA_TONGHOP_PBDT: 'KHVDTNSNN_DTNSNN_GIAODT_TRINHDUYET_PA_TONGHOP_PBDT',
		SUA_PA_TONGHOP_PBDT: 'KHVDTNSNN_DTNSNN_GIAODT_SUA_PA_TONGHOP_PBDT',
		XOA_PA_TONGHOP_PBDT: 'KHVDTNSNN_DTNSNN_GIAODT_XOA_PA_TONGHOP_PBDT',
		COPY_PA_TONGHOP_PBDT: 'KHVDTNSNN_DTNSNN_GIAODT_COPY_PA_TONGHOP_PBDT',
		DUYET_TUCHOI_PA_TH_PBDT: 'KHVDTNSNN_DTNSNN_GIAODT_DUYET_TUCHOI_PA_TH_PBDT',
		PHEDUYET_TUCHOI_PA_TH_PBDT: 'KHVDTNSNN_DTNSNN_GIAODT_PHEDUYET_TUCHOI_PA_TH_PBDT',
		XEM_PA_TONGHOP_PBDT: 'KHVDTNSNN_DTNSNN_GIAODT_XEM_PA_TONGHOP_PBDT',
		IN_PA_TONGHOP_PBDT: 'KHVDTNSNN_DTNSNN_GIAODT_IN_PA_TONGHOP_PBDT',
		XUAT_PA_TONGHOP_PBDT: 'KHVDTNSNN_DTNSNN_GIAODT_XUAT_PA_TONGHOP_PBDT',

		ADD_REPORT_TH: 'KHVDTNSNN_DTNSNN_GIAODT_LAP_BC',
		PRINT_REPORT: 'KHVDTNSNN_DTNSNN_GIAODT_IN_BC',
		EXPORT_REPORT: 'KHVDTNSNN_DTNSNN_GIAODT_XUAT_BC',
		APPROVE_REPORT_TH: 'KHVDTNSNN_DTNSNN_GIAODT_TRINHDUYET_BC',
		EDIT_REPORT_TH: 'KHVDTNSNN_DTNSNN_GIAODT_SUA_BC',
		XOA_REPORT_TH: 'KHVDTNSNN_DTNSNN_GIAODT_XOA_BC',
		COPY_REPORT_TH: 'KHVDTNSNN_DTNSNN_GIAODT_COPY_BC',
		VIEW_REPORT_TH: 'KHVDTNSNN_DTNSNN_GIAODT_XEM_BC',
		DUYET_REPORT_TH: "KHVDTNSNN_DTNSNN_GIAODT_DUYET_TUCHOI_BC",
		PHEDUYET_REPORT_TH: "KHVDTNSNN_DTNSNN_GIAODT_PHEDUYET_TUCHOI_BC",
		TIEP_NHAN_TC_REPORT_TH: "KHVDTNSNN_DTNSNN_GIAODT_TIEPNHAN_TUCHOI_BC",
	}

	static readonly DCDT = {
		ADD_REPORT: 'KHVDTNSNN_DTNSNN_DIEUCHINHDT_LAP_BC',
		APPROVE_REPORT: 'KHVDTNSNN_DTNSNN_DIEUCHINHDT_TRINHDUYET_BC',
		EDIT_REPORT: 'KHVDTNSNN_DTNSNN_DIEUCHINHDT_SUA_BC',
		DELETE_REPORT: 'KHVDTNSNN_DTNSNN_DIEUCHINHDT_XOA_BC',
		COPY_REPORT: 'KHVDTNSNN_DTNSNN_DIEUCHINHDT_COPY_BC',
		DUYET_REPORT: 'KHVDTNSNN_DTNSNN_DIEUCHINHDT_DUYET_TUCHOI_BC',
		PHE_DUYET_REPORT: 'KHVDTNSNN_DTNSNN_DIEUCHINHDT_PHEDUYET_TUCHOI_BC',
		VIEW_REPORT: 'KHVDTNSNN_DTNSNN_DIEUCHINHDT_XEM_BC',
		PRINT_REPORT: 'KHVDTNSNN_DTNSNN_DIEUCHINHDT_IN_BC',
		EXPORT_REPORT: 'KHVDTNSNN_DTNSNN_DIEUCHINHDT_XUAT_BC',
		TIEP_NHAN_REPORT: 'KHVDTNSNN_DTNSNN_DIEUCHINHDT_TIEPNHAN_TUCHOI_BC',
		SYNTHETIC_REPORT: 'KHVDTNSNN_DTNSNN_DIEUCHINHDT_TONGHOP_BC',
		APPROVE_SYNTHETIC_REPORT: 'KHVDTNSNN_DTNSNN_DIEUCHINHDT_TRINHDUYET_BC_TONGHOP',
		EDIT_SYNTHETIC_REPORT: 'KHVDTNSNN_DTNSNN_DIEUCHINHDT_SUA_BC_TONGHOP',
		DELETE_SYNTHETIC_REPORT: 'KHVDTNSNN_DTNSNN_DIEUCHINHDT_XOA_BC_TONGHOP',
		COPY_SYNTHETIC_REPORT: 'KHVDTNSNN_DTNSNN_DIEUCHINHDT_COPY_BC_TONGHOP',
		DUYET_SYNTHETIC_REPORT: 'KHVDTNSNN_DTNSNN_DIEUCHINHDT_DUYET_TUCHOI_BC_TH',
		PHE_DUYET_SYNTHETIC_REPORT: 'KHVDTNSNN_DTNSNN_DIEUCHINHDT_PHEDUYET_TUCHOI_BC_TH',
		VIEW_SYNTHETIC_REPORT: 'KHVDTNSNN_DTNSNN_DIEUCHINHDT_XEM_BC_TONGHOP',
		PRINT_SYTHETIC_REPORT: 'KHVDTNSNN_DTNSNN_DIEUCHINHDT_IN_BC_TONGHOP',
		EXPORT_SYNTHETIC_REPORT: 'KHVDTNSNN_DTNSNN_DIEUCHINHDT_XUAT_BC_TONGHOP',
	};

	static readonly DTC = {
		ADD_REPORT: 'KHVDTNSNN_BAOCAO_DTOANCHI_LAP_BC',
		SUBMIT_REPORT: 'KHVDTNSNN_BAOCAO_DTOANCHI_TRINHDUYET_BC',
		EDIT_REPORT: 'KHVDTNSNN_BAOCAO_DTOANCHI_SUA_BC',
		DEL_REPORT: 'KHVDTNSNN_BAOCAO_DTOANCHI_XOA_BC',
		COPY_REPORT: 'KHVDTNSNN_BAOCAO_DTOANCHI_COPY_BC',
		PASS_REPORT: 'KHVDTNSNN_BAOCAO_DTOANCHI_DUYET_TUCHOIDUYET_BC',
		APPROVE_REPORT: 'KHVDTNSNN_BAOCAO_DTOANCHI_PHEDUYET_TUCHOIPHEDUYET_BC',
		VIEW_REPORT: 'KHVDTNSNN_BAOCAO_DTOANCHI_XEM_BC',
		PRINT_REPORT: 'KHVDTNSNN_BAOCAO_DTOANCHI_IN_BC',
		EXPORT_REPORT: 'KHVDTNSNN_BAOCAO_DTOANCHI_XUAT_BC',
		ACCEPT_REPORT: 'KHVDTNSNN_BAOCAO_DTOANCHI_TIEPNHAN_TUCHOI_BC',
		SYNTH_REPORT: 'KHVDTNSNN_BAOCAO_DTOANCHI_TONGHOP_BC',
		SUBMIT_SYNTH_REPORT: 'KHVDTNSNN_BAOCAO_DTOANCHI_TRINHDUYET_BC_TONGHOP',
		EDIT_SYNTH_REPORT: 'KHVDTNSNN_BAOCAO_DTOANCHI_SUA_BC_TONGHOP',
		DEL_SYNTH_REPORT: 'KHVDTNSNN_BAOCAO_DTOANCHI_XOA_BC_TONGHOP',
		COPY_SYNTH_REPORT: 'KHVDTNSNN_BAOCAO_DTOANCHI_COPY_BC_TONGHOP',
		PASS_SYNTH_REPORT: 'KHVDTNSNN_BAOCAO_DTOANCHI_DUYET_TUCHOIDUYET_BC_TONGHOP',
		APPROVE_SYNTH_REPORT: 'KHVDTNSNN_BAOCAO_DTOANCHI_PHEDUYET_TUCHOIPHEDUYET_BC_TONGHOP',
		VIEW_SYNTH_REPORT: 'KHVDTNSNN_BAOCAO_DTOANCHI_XEM_BC_TONGHOP',
		PRINT_SYTH_REPORT: 'KHVDTNSNN_BAOCAO_DTOANCHI_IN_BC_TONGHOP',
		EXPORT_SYNTH_REPORT: 'KHVDTNSNN_BAOCAO_DTOANCHI_XUAT_BC_TONGHOP',
	};

	static readonly VP = {
		ADD_REPORT: 'KHVDTNSNN_BAOCAO_THVONPHI_LAP_BC',
		SUBMIT_REPORT: 'KHVDTNSNN_BAOCAO_THVONPHI_TRINHDUYET_BC',
		EDIT_REPORT: 'KHVDTNSNN_BAOCAO_THVONPHI_SUA_BC',
		DEL_REPORT: 'KHVDTNSNN_BAOCAO_THVONPHI_XOA_BC',
		COPY_REPORT: 'KHVDTNSNN_BAOCAO_THVONPHI_COPY_BC',
		PASS_REPORT: 'KHVDTNSNN_BAOCAO_THVONPHI_DUYET_TUCHOIDUYET_BC',
		APPROVE_REPORT: 'KHVDTNSNN_BAOCAO_THVONPHI_PHEDUYET_TUCHOIPHEDUYET_BC',
		VIEW_REPORT: 'KHVDTNSNN_BAOCAO_THVONPHI_XEM_BC',
		PRINT_REPORT: 'KHVDTNSNN_BAOCAO_THVONPHI_IN_BC',
		EXPORT_REPORT: 'KHVDTNSNN_BAOCAO_THVONPHI_XUAT_BC',
		ACCEPT_REPORT: 'KHVDTNSNN_BAOCAO_THVONPHI_TIEPNHAN_TUCHOI_BC',
		SYNTH_REPORT: 'KHVDTNSNN_BAOCAO_THVONPHI_TONGHOP_BC',
		SUBMIT_SYNTH_REPORT: 'KHVDTNSNN_BAOCAO_THVONPHI_TRINHDUYET_BC_TONGHOP',
		EDIT_SYNTH_REPORT: 'KHVDTNSNN_BAOCAO_THVONPHI_SUA_BC_TONGHOP',
		DEL_SYNTH_REPORT: 'KHVDTNSNN_BAOCAO_THVONPHI_XOA_BC_TONGHOP',
		COPY_SYNTH_REPORT: 'KHVDTNSNN_BAOCAO_THVONPHI_COPY_BC_TONGHOP',
		PASS_SYNTH_REPORT: 'KHVDTNSNN_BAOCAO_THVONPHI_DUYET_TUCHOIDUYET_BC_TONGHOP',
		APPROVE_SYNTH_REPORT: 'KHVDTNSNN_BAOCAO_THVONPHI_PHEDUYET_BC_TONGHOP',
		VIEW_SYNTH_REPORT: 'KHVDTNSNN_BAOCAO_THVONPHI_XEM_BC_TONGHOP',
		PRINT_SYTH_REPORT: 'KHVDTNSNN_BAOCAO_THVONPHI_IN_BC_TONGHOP',
		EXPORT_SYNTH_REPORT: 'KHVDTNSNN_BAOCAO_THVONPHI_XUAT_BC_TONGHOP',
		EXPORT_EXCEL_REPORT: 'KHVDTNSNN_BAOCAO_THVONPHI_XUAT_BC_EXCEL',
	};

	static readonly CVMB = {
		//thanh toan cho khach hang
		ADD_TTKH: 'VONPHIHANG_VONMBANTT_LAP_BC_TT_KH',
		SUBMIT_TTKH: 'VONPHIHANG_VONMBANTT_TRINHDUYET_BC_TT_KH',
		EDIT_TTKH: 'VONPHIHANG_VONMBANTT_SUA_BC_TT_KH',
		DEL_TTKH: 'VONPHIHANG_VONMBANTT_XOA_BC_TT_KH',
		COPY_TTKH: 'VONPHIHANG_VONMBANTT_COPY_BC_TT_KH',
		PASS_TTKH: 'VONPHIHANG_VONMBANTT_DUYET_TUCHOIDUYET_BC_TT_KH',
		APPROVE_TTKH: 'VONPHIHANG_VONMBANTT_PHEDUYET_TUCHOIPHEDUYET_BC_TT_KH',
		VIEW_TTKH: 'VONPHIHANG_VONMBANTT_XEM_BC_TT_KH',
		PRINT_TTKH: 'VONPHIHANG_VONMBANTT_IN_BC_TT_KH',
		EXPORT_TTKH: 'VONPHIHANG_VONMBANTT_XUAT_BC_TT_KH',
		//bao cao cap von
		ADD_CV: 'VONPHIHANG_VONMBANTT_LAP_CV',
		SUBMIT_CV: 'VONPHIHANG_VONMBANTT_TRINHDUYET_CV',
		EDIT_CV: 'VONPHIHANG_VONMBANTT_SUA_CV',
		DEL_CV: 'VONPHIHANG_VONMBANTT_XOA_CV',
		COPY_CV: 'VONPHIHANG_VONMBANTT_COPY_CV',
		PASS_CV: 'VONPHIHANG_VONMBANTT_DUYET_TUCHOIDUYET_CV',
		APPROVE_CV: 'VONPHIHANG_VONMBANTT_PHEDUYET_TUCHOIPHEDUYET_CV',
		VIEW_CV: 'VONPHIHANG_VONMBANTT_XEM_CV',
		PRINT_CV: 'VONPHIHANG_VONMBANTT_IN_CV',
		EXPORT_CV: 'VONPHIHANG_VONMBANTT_XUAT_CV',
		//nop tien von ban hang
		ADD_VB: 'VONPHIHANG_VONMBANTT_LAP_BC_NTV_BH',
		SUBMIT_VB: 'VONPHIHANG_VONMBANTT_TRINHDUYET_BC_NTV_BH',
		EDIT_VB: 'VONPHIHANG_VONMBANTT_SUA_BC_NTV_BH',
		DEL_VB: 'VONPHIHANG_VONMBANTT_XOA_BC_NTV_BH',
		COPY_VB: 'VONPHIHANG_VONMBANTT_COPY_BC_NTV_BH',
		PASS_VB: 'VONPHIHANG_VONMBANTT_DUYET_TUCHOIDUYET_BC_NTV_BH',
		APPROVE_VB: 'VONPHIHANG_VONMBANTT_PHEDUYET_TUCHOIPHEDUYET_NTV_BH',
		VIEW_VB: 'VONPHIHANG_VONMBANTT_XEM_BC_NTV_BH',
		PRINT_VB: 'VONPHIHANG_VONMBANTT_IN_BC_NTV_BH',
		EXPORT_VB: 'VONPHIHANG_VONMBANTT_XUAT_BC_NTV_BH',
		SYNTH_VB: 'VONPHIHANG_VONMBANTT_TONGHOP_BC_NTV_BH',
		ACCEPT_VB: 'VONPHIHANG_VONMBANTT_TIEPNHAN_TUCHOI_NTV_BH',
		//ghi nhan von
		ADD_GNV: 'VONPHIHANG_VONMBANTT_LAP_BC_GNV',
		ADD_GNV_TC: 'VONPHIHANG_VONMBANTT_TC_LAP_BC_GNV',
		SUBMIT_GNV: 'VONPHIHANG_VONMBANTT_TRINHDUYET_BC_GNV',
		EDIT_GNV: 'VONPHIHANG_VONMBANTT_SUA_BC_GNV',
		DEL_GNV: 'VONPHIHANG_VONMBANTT_XOA_BC_GNV',
		COPY_GNV: 'VONPHIHANG_VONMBANTT_COPY_BC_GNV',
		PASS_GNV: 'VONPHIHANG_VONMBANTT_DUYET_TUCHOIDUYET_BC_GNV',
		APPROVE_GNV: 'VONPHIHANG_VONMBANTT_PHEDUYET_TUCHOIPHEDUYET_GNV',
		VIEW_GNV: 'VONPHIHANG_VONMBANTT_XEM_BC_GNV',
		PRINT_GNV: 'VONPHIHANG_VONMBANTT_IN_BC_GNV',
		EXPORT_GNV: 'VONPHIHANG_VONMBANTT_XUAT_BC_GNV',
		//hop dong von ban

		//ghi nhan von ban hang
		// ADD_REPORT_GNV_BH: 'VONPHIHANG_VONMBANTT_LAP_BC_GNV_BH',
		// APPROVE_REPORT_GNV_BH: 'VONPHIHANG_VONMBANTT_TRINHDUYET_BC_GNV_BH',
		// EDIT_REPORT_GNV_BH: 'VONPHIHANG_VONMBANTT_SUA_BC_GNV_BH',
		// COPY_REPORT_GNV_BH: 'VONPHIHANG_VONMBANTT_COPY_BC_GNV_BH',
		// DUYET_REPORT_GNV_BH: 'VONPHIHANG_VONMBANTT_DUYET_TUCHOIDUYET_BC_GNV_BH',
		// PHE_DUYET_REPORT_GNV_BH: 'VONPHIHANG_VONMBANTT_PHEDUYET_TUCHOIPHEDUYET_BC_GNV_BH',
		VIEW_VB_GN: 'VONPHIHANG_VONMBANTT_XEM_BC_GNV_BH',
		// PRINT_REPORT_GNV_BH: 'VONPHIHANG_VONMBANTT_IN_BC_GNV_BH',
		// EXPORT_REPORT_GNV_BH: 'VONPHIHANG_VONMBANTT_XUAT_BC_GNV_BH',
		//nop tien von thua
		ADD_NTT: 'VONPHIHANG_VONMBANTT_LAP_BC_NTV_TH',
		SUBMIT_NTT: 'VONPHIHANG_VONMBANTT_TRINHDUYET_BC_NTV_TH',
		EDIT_NTT: 'VONPHIHANG_VONMBANTT_SUA_BC_NTV_TH',
		DEL_NTT: 'VONPHIHANG_VONMBANTT_XOA_BC_NTV_TH',
		COPY_NTT: 'VONPHIHANG_VONMBANTT_COPY_BC_NTV_TH',
		PASS_NTT: 'VONPHIHANG_VONMBANTT_DUYET_TUCHOIDUYET_BC_NTV_TH',
		APPROVE_NTT: 'VONPHIHANG_VONMBANTT_PHEDUYET_TUCHOIPHEDUYET_NTV_TH',
		ACCEPT_NTT: 'VONPHIHANG_VONMBANTT_TIEPNHAN_TUCHOI_NTV_TH',
		VIEW_NTT: 'VONPHIHANG_VONMBANTT_XEM_BC_NTV_TH',
		PRINT_NTT: 'VONPHIHANG_VONMBANTT_IN_BC_NTV_TH',
		EXPORT_NTT: 'VONPHIHANG_VONMBANTT_XUAT_BC_NTV_TH',
		//ghi nhan tien von thua
		// ADD_REPORT_GNV_TH: 'VONPHIHANG_VONMBANTT_LAP_BC_GNV_TH',
		SUBMIT_NTT_GN: 'VONPHIHANG_VONMBANTT_TRINHDUYET_BC_GNV_TH',
		// EDIT_NTT_GN: 'VONPHIHANG_VONMBANTT_SUA_BC_GNV_TH',
		COPY_NTT_GN: 'VONPHIHANG_VONMBANTT_COPY_BC_GNV_TH',
		PASS_NTT_GN: 'VONPHIHANG_VONMBANTT_DUYET_TUCHOIDUYET_BC_GNV_TH',
		APPROVE_NTT_GN: 'VONPHIHANG_VONMBANTT_PHEDUYET_TUCHOIPHEDUYET_BC_GNV_TH',
		VIEW_NTT_GN: 'VONPHIHANG_VONMBANTT_XEM_BC_GNV_TH',
		PRINT_NTT_GN: 'VONPHIHANG_VONMBANTT_IN_BC_GNV_TH',
		EXPORT_NTT_GN: 'VONPHIHANG_VONMBANTT_XUAT_BC_GNV_TH',
	};

	static readonly CVNC = {
		ADD_DN_MLT: 'VONPHIHANG_VONCHIDTQG_LAP_DN_MLT',
		APPROVE_DN_MLT: 'VONPHIHANG_VONCHIDTQG_TRINHDUYET_DN_MLT',
		EDIT_DN_MLT: 'VONPHIHANG_VONCHIDTQG_SUA_DN_MLT',
		DELETE_DN_MLT: 'VONPHIHANG_VONCHIDTQG_XOA_DN_MLT',
		COPY_DN_MLT: 'VONPHIHANG_VONCHIDTQG_COPY_DN_MLT',
		PHE_DUYET_DN_MLT: 'VONPHIHANG_VONCHIDTQG_PHEDUYET_TUCHOIPHEDUYET_DN_MLT',
		VIEW_DN_MLT: 'VONPHIHANG_VONCHIDTQG_XEM_DN_MLT',
		PRINT_DN_MLT: 'VONPHIHANG_VONCHIDTQG_IN_DN_MLT',
		EXPORT_DN_MLT: 'VONPHIHANG_VONCHIDTQG_XUAT_DN_MLT',
		ADD_SYNTHETIC_MLT: 'VONPHIHANG_VONCHIDTQG_TONGHOP_DN_MLT',
		APPROVE_SYNTHETIC_MLT: 'VONPHIHANG_VONCHIDTQG_TRINHDUYET_DN_MLT_TONGHOP',
		EDIT_SYNTHETIC_MLT: 'VONPHIHANG_VONCHIDTQG_SUA_DN_MLT_TONGHOP',
		DELETE_SYNTHETIC_MLT: 'VONPHIHANG_VONCHIDTQG_XOA_DN_MLT_TONGHOP',
		COPY_SYNTHETIC_MLT: 'VONPHIHANG_VONCHIDTQG_COPY_DN_MLT_TONGHOP',
		DUYET_SYNTHETIC_MLT: 'VONPHIHANG_VONCHIDTQG_DUYET_TUCHOIDUYET_DN_MLT_TONGHOP',
		PHE_DUYET_SYNTHETIC_MLT: 'VONPHIHANG_VONCHIDTQG_PHEDUYET_TUCHOIPHEDUYET_DN_MLT_TONGHOP',
		VIEW_SYNTHETIC_MLT: 'VONPHIHANG_VONCHIDTQG_XEM_DN_MLT_TONGHOP',
		PRINT_SYNTHETIC_MLT: 'VONPHIHANG_VONCHIDTQG_IN_DN_MLT_TONGHOP',
		EXPORT_SYNTHETIC_MLT: 'VONPHIHANG_VONCHIDTQG_XUAT_DN_MLT_TONGHOP',
		ADD_DN_MVT: 'VONPHIHANG_VONCHIDTQG_LAP_DN_MVT',
		APPROVE_DN_MVT: 'VONPHIHANG_VONCHIDTQG_TRINHDUYET_DN_MVT',
		EDIT_DN_MVT: 'VONPHIHANG_VONCHIDTQG_SUA_DN_MVT',
		DELETE_DN_MVT: 'VONPHIHANG_VONCHIDTQG_XOA_DN_MVT',
		COPY_DN_MVT: 'VONPHIHANG_VONCHIDTQG_COPY_DN_MVT',
		PHE_DUYET_DN_MVT: 'VONPHIHANG_VONCHIDTQG_PHEDUYET_TUCHOIPHEDUYET_DN_MVT',
		VIEW_DN_MVT: 'VONPHIHANG_VONCHIDTQG_XEM_DN_MVT',
		PRINT_DN_MVT: 'VONPHIHANG_VONCHIDTQG_IN_DN_MVT',
		EXPORT_DN_MVT: 'VONPHIHANG_VONCHIDTQG_XUAT_DN_MVT',
		ADD_SYNTHETIC_TC: 'VONPHIHANG_VONCHIDTQG_TONGHOP_DN_MLT_VT',
		APPROVE_SYNTHETIC_TC: 'VONPHIHANG_VONCHIDTQG_TRINHDUYET_DN_MLT_VT',
		EDIT_SYNTHETIC_TC: 'VONPHIHANG_VONCHIDTQG_SUA_DN_MLT_VT',
		DELETE_SYNTHETIC_TC: 'VONPHIHANG_VONCHIDTQG_XOA_DN_MLT_VT',
		COPY_SYNTHETIC_TC: 'VONPHIHANG_VONCHIDTQG_COPY_DN_MLT_VT',
		DUYET_SYNTHETIC_TC: 'VONPHIHANG_VONCHIDTQG_DUYET_TUCHOIDUYET_DN_MLT_VT',
		PHE_DUYET_SYNTHETIC_TC: 'VONPHIHANG_VONCHIDTQG_PHEDUYET_TUCHOIPHEDUYET_DN_MLT_VT',
		VIEW_SYNTHETIC_TC: 'VONPHIHANG_VONCHIDTQG_XEM_DN_MLT_VT',
		PRINT_SYNTHETIC_TC: 'VONPHIHANG_VONCHIDTQG_IN_DN_MLT_VT',
		EXPORT_SYNTHETIC_TC: 'VONPHIHANG_VONCHIDTQG_XUAT_DN_MLT_VT',
		ACCEPT_OR_REJECT: 'VONPHIHANG_VONCHIDTQG_TIEPNHAN_TUCHOI_DN',
		DUYET_OR_TU_CHOI: 'VONPHIHANG_VONCHIDTQG_DUYET_TUCHOIDUYET_DN_MLT_VT',
	};

	static readonly QTVP = {
		ADD_REPORT: 'QTOANVONPHI_LAP_BC',
		APPROVE_REPORT: 'QTOANVONPHI_TRINHDUYET_BC',
		EDIT_REPORT: 'QTOANVONPHI_SUA_BC',
		DELETE_REPORT: 'QTOANVONPHI_XOA_BC',
		COPY_REPORT: 'QTOANVONPHI_COPY_BC',
		DIEU_CHINH_REPORT: 'QTOANVONPHI_DIEUCHINH_BC',
		EDIT_DIEU_CHINH_REPORT: 'QTOANVONPHI_SUA_BC_DIEUCHINH',
		DELETE_DIEU_CHINH_REPORT: 'QTOANVONPHI_XOA_BC_DIEUCHINH',
		COPY_DIEU_CHINH: 'QTOANVONPHI_COPY_BC_DIEUCHINH',
		DUYET_QUYET_TOAN_REPORT: 'QTOANVONPHI_DUYET_TUCHOIDUYET_BC',
		PHE_DUYET_QUYET_TOAN_REPORT: 'QTOANVONPHI_PHEDUYET_TUCHOIPHEDUYET_BC',
		TIEP_NHAN_REPORT: 'QTOANVONPHI_TIEPNHAN_TUCHOI_BC',
		SYNTHETIC_REPORT: 'QTOANVONPHI_TONGHOP_BC',
		VIEW_REPORT: 'QTOANVONPHI_XEM_BC',
		PRINT_REPORT: 'QTOANVONPHI_IN_BC',
		EXPORT_REPORT: 'QTOANVONPHI_XUAT_BC',
	};
}

// //////////////////// LAP THAM DINH /////////////////////////////////
export const LTD = {
	ADD_REPORT: 'KHVDTNSNN_DTNSNN_LAPTD_LAP_BC',  									//lap bao cao
	APPROVE_REPORT: 'KHVDTNSNN_DTNSNN_LAPTD_TRINHDUYET_BC',							//trinh duyet bao cao
	EDIT_REPORT: 'KHVDTNSNN_DTNSNN_LAPTD_SUA_BC',									//sua bao cao
	DELETE_REPORT: 'KHVDTNSNN_DTNSNN_LAPTD_XOA_BC',									//xoa bao cao
	COPY_REPORT: 'KHVDTNSNN_DTNSNN_LAPTD_COPY_BC',									//copy bao cao
	DUYET_REPORT: 'KHVDTNSNN_DTNSNN_LAPTD_DUYET_TUCHOIDUYET_BC',					//duyet bao cao
	PHE_DUYET_REPORT: 'KHVDTNSNN_DTNSNN_LAPTD_PHEDUYET_TUCHOIPHEDUYET_BC',			//phe duyet bao cao
	VIEW_REPORT: 'KHVDTNSNN_DTNSNN_LAPTD_XEM_BC',									//xem bao cao
	PRINT_REPORT: 'KHVDTNSNN_DTNSNN_LAPTD_IN_BC',									//in bao cao
	EXPORT_REPORT: 'KHVDTNSNN_DTNSNN_LAPTD_XUAT_BC',								//xuat bao cao
	TIEP_NHAN_REPORT: 'KHVDTNSNN_DTNSNN_LAPTD_TIEPNHAN_TUCHOI_BC',					//tiep nhan bao cao
	SYNTHETIC_REPORT: 'KHVDTNSNN_DTNSNN_LAPTD_TONGHOP_BC',							//tong hop bao cao
	APPROVE_SYNTHETIC_REPORT: 'KHVDTNSNN_DTNSNN_LAPTD_TRINHDUYET_BC_TONGHOP',		//trinh duyet bao cao tong hop
	EDIT_SYNTHETIC_REPORT: 'KHVDTNSNN_DTNSNN_LAPTD_SUA_BC_TONGHOP',					//sua bao cao tong hop
	DELETE_SYNTHETIC_REPORT: 'KHVDTNSNN_DTNSNN_LAPTD_XOA_BC_TONGHOP',				//xoa bao cao tong hop
	COPY_SYNTHETIC_REPORT: 'KHVDTNSNN_DTNSNN_LAPTD_COPY_BC_TONGHOP',				//copy bao cao tong hop
	DUYET_SYNTHETIC_REPORT: 'KHVDTNSNN_DTNSNN_LAPTD_DUYET_TUCHOI_BC_TH',			//duyet bao cao tong hop
	PHE_DUYET_SYNTHETIC_REPORT: 'KHVDTNSNN_DTNSNN_LAPTD_PHEDUYET_TUCHOI_BC_TH',		//phe duyet bao cao tong hop
	VIEW_SYNTHETIC_REPORT: 'KHVDTNSNN_DTNSNN_LAPTD_XEM_BC_TONGHOP',					//xem bao cao tong hop
	PRINT_SYNTHETIC_REPORT: 'KHVDTNSNN_DTNSNN_LAPTD_IN_BC_TONGHOP',					//in bao cao tong hop
	EXPORT_SYNTHETIC_REPORT: 'KHVDTNSNN_DTNSNN_LAPTD_XUAT_BC_TONGHOP',				//xuat bao cao tong hop
	ADD_COEFFCIENT_INSURANCE: 'KHVDTNSNN_DTNSNN_HSBH_LAP',
	APPROVE_COEFFCIENT_INSURANCE: 'KHVDTNSNN_DTNSNN_HSBH_TRINHDUYET',
	EDIT_COEFFCIENT_INSURANCE: 'KHVDTNSNN_DTNSNN_HSBH_SUA',
	DELETE_COEFFCIENT_INSURANCE: 'KHVDTNSNN_DTNSNN_HSBH_XOA',
	COPY_COEFFCIENT_INSURANCE: 'KHVDTNSNN_DTNSNN_HSBH_COPY',
	VIEW_COEFFCIENT_INSURANCE: 'KHVDTNSNN_DTNSNN_HSBH_XEM',
	DUYET_COEFFCIENT_INSURANCE: 'KHVDTNSNN_DTNSNN_HSBH_DUYET_TUCHOIDUYET',
	PHE_DUYET_COEFFCIENT_INSURANCE: 'KHVDTNSNN_DTNSNN_HSBH_PHEDUYET_TUCHOIPHEDUYET',
};

///////////////////// GIAO DU TOAN /////////////////////////////////
export const GDT = {
	ADD_REPORT_BTC: 'KHVDTNSNN_DTNSNN_GIAODT_NHAP_QUYETDINH_BTC',
	EDIT_REPORT_BTC: 'KHVDTNSNN_DTNSNN_GIAODT_SUA_QUYETDINH_BTC',
	DELETE_REPORT_BTC: 'KHVDTNSNN_DTNSNN_GIAODT_XOA_QUYETDINH_BTC',

	ADD_REPORT_PA_PBDT: 'KHVDTNSNN_DTNSNN_GIAODT_LAP_PA_PBDT',
	APPROVE_REPORT_PA_PBDT: 'KHVDTNSNN_DTNSNN_GIAODT_TRINHDUYET_PA_PBDT',
	EDIT_REPORT_PA_PBDT: 'KHVDTNSNN_DTNSNN_GIAODT_SUA_PA_PBDT',
	DELETE_REPORT_PA_PBDT: 'KHVDTNSNN_DTNSNN_GIAODT_XOA_PA_PBDT',
	COPY_REPORT_PA_PBDT: 'KHVDTNSNN_DTNSNN_GIAODT_COPY_PA_PBDT',
	DUYET_REPORT_PA_PBDT: 'KHVDTNSNN_DTNSNN_GIAODT_DUYET_TUCHOI_PA_PBDT',
	PHE_DUYET_REPORT_PA_PBDT: 'KHVDTNSNN_DTNSNN_GIAODT_PHEDUYET_TUCHOI_PA_PBDT',
	VIEW_REPORT_PA_PBDT: 'KHVDTNSNN_DTNSNN_GIAODT_XEM_PA_PBDT',
	PRINT_REPORT_PA_PBDT: 'KHVDTNSNN_DTNSNN_GIAODT_IN_PA_PBDT',
	EXPORT_REPORT_PA_PBDT: 'KHVDTNSNN_DTNSNN_GIAODT_XUAT_PA_PBDT',

	ADD_REPORT_CV_QD_GIAO_PA_PBDT: 'KHVDTNSNN_DTNSNN_GIAODT_NHAP_CV_QD_GIAO_PA_PBDT',
	EDIT_REPORT_CV_QD_GIAO_PA_PBDT: 'KHVDTNSNN_DTNSNN_GIAODT_SUA_CV_QD_GIAO_PA_PBDT',
	DELETE_REPORT_CV_QD_GIAO_PA_PBDT: 'KHVDTNSNN_DTNSNN_GIAODT_XOA_CV_QD_GIAO_PA_PBDT',

	GIAO_PA_PBDT: 'KHVDTNSNN_DTNSNN_GIAODT_GIAO_PA_PBDT',
	NHAN_PA_PBDT: 'KHVDTNSNN_DTNSNN_GIAODT_NHAN_PA_PBDT',

	GIAODT_TRINHTONGCUC_PA_PBDT: 'KHVDTNSNN_DTNSNN_GIAODT_TRINHTONGCUC_PA_PBDT',
	TIEPNHAN_TUCHOI_PA_PBDT: 'KHVDTNSNN_DTNSNN_GIAODT_TIEPNHAN_TUCHOI_PA_PBDT',
	TONGHOP_PA_PBDT: 'KHVDTNSNN_DTNSNN_GIAODT_TONGHOP_PA_PBDT',
	TRINHDUYET_PA_TONGHOP_PBDT: 'KHVDTNSNN_DTNSNN_GIAODT_TRINHDUYET_PA_TONGHOP_PBDT',
	SUA_PA_TONGHOP_PBDT: 'KHVDTNSNN_DTNSNN_GIAODT_SUA_PA_TONGHOP_PBDT',
	XOA_PA_TONGHOP_PBDT: 'KHVDTNSNN_DTNSNN_GIAODT_XOA_PA_TONGHOP_PBDT',
	COPY_PA_TONGHOP_PBDT: 'KHVDTNSNN_DTNSNN_GIAODT_COPY_PA_TONGHOP_PBDT',
	DUYET_TUCHOI_PA_TH_PBDT: 'KHVDTNSNN_DTNSNN_GIAODT_DUYET_TUCHOI_PA_TH_PBDT',
	PHEDUYET_TUCHOI_PA_TH_PBDT: 'KHVDTNSNN_DTNSNN_GIAODT_PHEDUYET_TUCHOI_PA_TH_PBDT',
	XEM_PA_TONGHOP_PBDT: 'KHVDTNSNN_DTNSNN_GIAODT_XEM_PA_TONGHOP_PBDT',
	IN_PA_TONGHOP_PBDT: 'KHVDTNSNN_DTNSNN_GIAODT_IN_PA_TONGHOP_PBDT',
	XUAT_PA_TONGHOP_PBDT: 'KHVDTNSNN_DTNSNN_GIAODT_XUAT_PA_TONGHOP_PBDT',

	ADD_REPORT_TH: 'KHVDTNSNN_DTNSNN_GIAODT_LAP_BC',
	APPROVE_REPORT_TH: 'KHVDTNSNN_DTNSNN_GIAODT_TRINHDUYET_BC',
	EDIT_REPORT_TH: 'KHVDTNSNN_DTNSNN_GIAODT_SUA_BC',
	XOA_REPORT_TH: 'KHVDTNSNN_DTNSNN_GIAODT_XOA_BC',
	COPY_REPORT_TH: 'KHVDTNSNN_DTNSNN_GIAODT_COPY_BC',
	VIEW_REPORT_TH: 'KHVDTNSNN_DTNSNN_GIAODT_XEM_BC',
	DUYET_REPORT_TH: "KHVDTNSNN_DTNSNN_GIAODT_DUYET_TUCHOI_BC",
	PHEDUYET_REPORT_TH: "KHVDTNSNN_DTNSNN_GIAODT_PHEDUYET_TUCHOI_BC",
	TIEP_NHAN_TC_REPORT_TH: "KHVDTNSNN_DTNSNN_GIAODT_TIEPNHAN_TUCHOI_BC",
}

///////////////////// DIEU CHINH DU TOAN ////////////////////////////
export const DCDT = {
	ADD_REPORT: 'KHVDTNSNN_DTNSNN_DIEUCHINHDT_LAP_BC',
	APPROVE_REPORT: 'KHVDTNSNN_DTNSNN_DIEUCHINHDT_TRINHDUYET_BC',
	EDIT_REPORT: 'KHVDTNSNN_DTNSNN_DIEUCHINHDT_SUA_BC',
	DELETE_REPORT: 'KHVDTNSNN_DTNSNN_DIEUCHINHDT_XOA_BC',
	COPY_REPORT: 'KHVDTNSNN_DTNSNN_DIEUCHINHDT_COPY_BC',
	DUYET_REPORT: 'KHVDTNSNN_DTNSNN_DIEUCHINHDT_DUYET_TUCHOI_BC',
	PHE_DUYET_REPORT: 'KHVDTNSNN_DTNSNN_DIEUCHINHDT_PHEDUYET_TUCHOI_BC',
	VIEW_REPORT: 'KHVDTNSNN_DTNSNN_DIEUCHINHDT_XEM_BC',
	PRINT_REPORT: 'KHVDTNSNN_DTNSNN_DIEUCHINHDT_IN_BC',
	EXPORT_REPORT: 'KHVDTNSNN_DTNSNN_DIEUCHINHDT_XUAT_BC',
	TIEP_NHAN_REPORT: 'KHVDTNSNN_DTNSNN_DIEUCHINHDT_TIEPNHAN_TUCHOI_BC',
	SYNTHETIC_REPORT: 'KHVDTNSNN_DTNSNN_DIEUCHINHDT_TONGHOP_BC',
	APPROVE_SYNTHETIC_REPORT: 'KHVDTNSNN_DTNSNN_DIEUCHINHDT_TRINHDUYET_BC_TONGHOP',
	EDIT_SYNTHETIC_REPORT: 'KHVDTNSNN_DTNSNN_DIEUCHINHDT_SUA_BC_TONGHOP',
	DELETE_SYNTHETIC_REPORT: 'KHVDTNSNN_DTNSNN_DIEUCHINHDT_XOA_BC_TONGHOP',
	COPY_SYNTHETIC_REPORT: 'KHVDTNSNN_DTNSNN_DIEUCHINHDT_COPY_BC_TONGHOP',
	DUYET_SYNTHETIC_REPORT: 'KHVDTNSNN_DTNSNN_DIEUCHINHDT_DUYET_TUCHOI_BC_TH',
	PHE_DUYET_SYNTHETIC_REPORT: 'KHVDTNSNN_DTNSNN_DIEUCHINHDT_PHEDUYET_TUCHOI_BC_TH',
	VIEW_SYNTHETIC_REPORT: 'KHVDTNSNN_DTNSNN_DIEUCHINHDT_XEM_BC_TONGHOP',
	PRINT_SYTHETIC_REPORT: 'KHVDTNSNN_DTNSNN_DIEUCHINHDT_IN_BC_TONGHOP',
	EXPORT_SYNTHETIC_REPORT: 'KHVDTNSNN_DTNSNN_DIEUCHINHDT_XUAT_BC_TONGHOP',
};

////////////////// CAP VON NGUON CHI /////////////////////////////////
export const CVNC = {
	ADD_DN_MLT: 'VONPHIHANG_VONCHIDTQG_LAP_DN_MLT',
	APPROVE_DN_MLT: 'VONPHIHANG_VONCHIDTQG_TRINHDUYET_DN_MLT',
	EDIT_DN_MLT: 'VONPHIHANG_VONCHIDTQG_SUA_DN_MLT',
	DELETE_DN_MLT: 'VONPHIHANG_VONCHIDTQG_XOA_DN_MLT',
	COPY_DN_MLT: 'VONPHIHANG_VONCHIDTQG_COPY_DN_MLT',
	PHE_DUYET_DN_MLT: 'VONPHIHANG_VONCHIDTQG_PHEDUYET_TUCHOIPHEDUYET_DN_MLT',
	VIEW_DN_MLT: 'VONPHIHANG_VONCHIDTQG_XEM_DN_MLT',
	PRINT_DN_MLT: 'VONPHIHANG_VONCHIDTQG_IN_DN_MLT',
	EXPORT_DN_MLT: 'VONPHIHANG_VONCHIDTQG_XUAT_DN_MLT',
	ADD_SYNTHETIC_MLT: 'VONPHIHANG_VONCHIDTQG_TONGHOP_DN_MLT',
	APPROVE_SYNTHETIC_MLT: 'VONPHIHANG_VONCHIDTQG_TRINHDUYET_DN_MLT_TONGHOP',
	EDIT_SYNTHETIC_MLT: 'VONPHIHANG_VONCHIDTQG_SUA_DN_MLT_TONGHOP',
	DELETE_SYNTHETIC_MLT: 'VONPHIHANG_VONCHIDTQG_XOA_DN_MLT_TONGHOP',
	COPY_SYNTHETIC_MLT: 'VONPHIHANG_VONCHIDTQG_COPY_DN_MLT_TONGHOP',
	DUYET_SYNTHETIC_MLT: 'VONPHIHANG_VONCHIDTQG_DUYET_TUCHOIDUYET_DN_MLT_TONGHOP',
	PHE_DUYET_SYNTHETIC_MLT: 'VONPHIHANG_VONCHIDTQG_PHEDUYET_TUCHOIPHEDUYET_DN_MLT_TONGHOP',
	VIEW_SYNTHETIC_MLT: 'VONPHIHANG_VONCHIDTQG_XEM_DN_MLT_TONGHOP',
	PRINT_SYNTHETIC_MLT: 'VONPHIHANG_VONCHIDTQG_IN_DN_MLT_TONGHOP',
	EXPORT_SYNTHETIC_MLT: 'VONPHIHANG_VONCHIDTQG_XUAT_DN_MLT_TONGHOP',
	ADD_DN_MVT: 'VONPHIHANG_VONCHIDTQG_LAP_DN_MVT',
	APPROVE_DN_MVT: 'VONPHIHANG_VONCHIDTQG_TRINHDUYET_DN_MVT',
	EDIT_DN_MVT: 'VONPHIHANG_VONCHIDTQG_SUA_DN_MVT',
	DELETE_DN_MVT: 'VONPHIHANG_VONCHIDTQG_XOA_DN_MVT',
	COPY_DN_MVT: 'VONPHIHANG_VONCHIDTQG_COPY_DN_MVT',
	PHE_DUYET_DN_MVT: 'VONPHIHANG_VONCHIDTQG_PHEDUYET_TUCHOIPHEDUYET_DN_MVT',
	VIEW_DN_MVT: 'VONPHIHANG_VONCHIDTQG_XEM_DN_MVT',
	PRINT_DN_MVT: 'VONPHIHANG_VONCHIDTQG_IN_DN_MVT',
	EXPORT_DN_MVT: 'VONPHIHANG_VONCHIDTQG_XUAT_DN_MVT',
	ADD_SYNTHETIC_TC: 'VONPHIHANG_VONCHIDTQG_TONGHOP_DN_MLT_VT',
	APPROVE_SYNTHETIC_TC: 'VONPHIHANG_VONCHIDTQG_TRINHDUYET_DN_MLT_VT',
	EDIT_SYNTHETIC_TC: 'VONPHIHANG_VONCHIDTQG_SUA_DN_MLT_VT',
	DELETE_SYNTHETIC_TC: 'VONPHIHANG_VONCHIDTQG_XOA_DN_MLT_VT',
	COPY_SYNTHETIC_TC: 'VONPHIHANG_VONCHIDTQG_COPY_DN_MLT_VT',
	DUYET_SYNTHETIC_TC: 'VONPHIHANG_VONCHIDTQG_DUYET_TUCHOIDUYET_DN_MLT_VT',
	PHE_DUYET_SYNTHETIC_TC: 'VONPHIHANG_VONCHIDTQG_PHEDUYET_TUCHOIPHEDUYET_DN_MLT_VT',
	VIEW_SYNTHETIC_TC: 'VONPHIHANG_VONCHIDTQG_XEM_DN_MLT_VT',
	PRINT_SYNTHETIC_TC: 'VONPHIHANG_VONCHIDTQG_IN_DN_MLT_VT',
	EXPORT_SYNTHETIC_TC: 'VONPHIHANG_VONCHIDTQG_XUAT_DN_MLT_VT',
};

/////////////////////// QUYET TOAN VON PHI ///////////////////////////
export const QTVP = {
	ADD_REPORT: 'QTOANVONPHI_LAP_BC',
	APPROVE_REPORT: 'QTOANVONPHI_TRINHDUYET_BC',
	EDIT_REPORT: 'QTOANVONPHI_SUA_BC',
	DELETE_REPORT: 'QTOANVONPHI_XOA_BC',
	COPY_REPORT: 'QTOANVONPHI_COPY_BC',
	DIEU_CHINH_REPORT: 'QTOANVONPHI_DIEUCHINH_BC',
	EDIT_DIEU_CHINH_REPORT: 'QTOANVONPHI_SUA_BC_DIEUCHINH',
	DELETE_DIEU_CHINH_REPORT: 'QTOANVONPHI_XOA_BC_DIEUCHINH',
	COPY_DIEU_CHINH: 'QTOANVONPHI_COPY_BC_DIEUCHINH',
	DUYET_QUYET_TOAN_REPORT: 'QTOANVONPHI_DUYET_TUCHOIDUYET_BC',
	PHE_DUYET_QUYET_TOAN_REPORT: 'QTOANVONPHI_PHEDUYET_TUCHOIPHEDUYET_BC',
	TIEP_NHAN_REPORT: 'QTOANVONPHI_TIEPNHAN_TUCHOI_BC',
	SYNTHETIC_REPORT: 'QTOANVONPHI_TONGHOP_BC',
	VIEW_REPORT: 'QTOANVONPHI_XEM_BC',
	PRINT_REPORT: 'QTOANVONPHI_IN_BC',
	EXPORT_REPORT: 'QTOANVONPHI_XUAT_BC',
};

// chuan hoa cho nhap so lieu tien
export const AMOUNT = {
	allowZero: true,
	allowNegative: false,
	precision: 4,
	prefix: '',
	thousands: '.',
	decimal: ',',
	align: "left",
	nullable: true,
	inputMode: CurrencyMaskInputMode.NATURAL,
}

export const QUATITY = {
	allowZero: true,
	allowNegative: false,
	precision: 0,
	prefix: '',
	thousands: '.',
	decimal: ',',
	align: "left",
	nullable: true,
	inputMode: CurrencyMaskInputMode.NATURAL,
}

export const AMOUNT_NO_DECIMAL = {
	allowZero: true,
	allowNegative: false,
	precision: 0,
	prefix: '',
	thousands: '.',
	decimal: ',',
	align: "right",
	nullable: true,
	min: 0,
	max: 1000000000000,
	inputMode: CurrencyMaskInputMode.NATURAL,
}

export const AMOUNT_ONE_DECIMAL = {
	allowZero: true,
	allowNegative: false,
	precision: 1,
	prefix: '',
	thousands: '.',
	decimal: ',',
	align: "right",
	nullable: true,
	min: 0,
	max: 1000000000000,
	inputMode: CurrencyMaskInputMode.NATURAL,
}

export const AMOUNT_TWO_DECIMAL = {
	allowZero: true,
	allowNegative: false,
	precision: 2,
	prefix: '',
	thousands: '.',
	decimal: ',',
	align: "right",
	nullable: true,
	min: 0,
	max: 1000000000000,
	inputMode: CurrencyMaskInputMode.NATURAL,
}

export const AMOUNT_THREE_DECIMAL = {
	allowZero: true,
	allowNegative: false,
	precision: 3,
	prefix: '',
	thousands: '.',
	decimal: ',',
	align: "right",
	nullable: true,
	min: 0,
	max: 1000000000000,
	inputMode: CurrencyMaskInputMode.NATURAL,
}

//kich co cua o nhap so lieu
export const BOX_NUMBER_WIDTH = 150;

export const NUM_BOX_WIDTH = 150;
export const TEXT_BOX_WIDTH = 250;

export const TRANG_THAI_TIM_KIEM = [
	{
		id: "1",
		tenDm: 'Đang soạn'
	},
	{
		id: "2",
		tenDm: 'Trình duyệt'
	},
	{
		id: "3",
		tenDm: 'Từ chối duyệt'
	},
	{
		id: "4",
		tenDm: 'Duyệt'
	},
	{
		id: "5",
		tenDm: 'Từ chối phê duyệt'
	},
	{
		id: "6",
		tenDm: 'Phê duyệt',
	},
	{
		id: "7",
		tenDm: 'Phê duyệt'
	},
	{
		id: "8",
		tenDm: 'Từ chối tiếp nhận'
	},
	{
		id: "9",
		tenDm: 'Tiếp nhận'
	},
	// {
	//     id: "10",
	//     tenDm: 'Lãnh đạo yêu cầu điều chỉnh'
	// },
]

// trang thai chi tiet bao cao
export const OK = "1";
export const NOT_OK = "0";
export const CHUA_DANH_GIA = "2";
export const MOI = "3";
export const DANG_NHAP_LIEU = "4";
export const HOAN_TAT_NHAP_LIEU = "5";

// loai trang thai gui don vi cap tren
export const TRANG_THAI_GUI_DVCT = [
	{
		id: '9',
		ten: 'Tiếp nhận'
	},
	{
		id: '8',
		ten: 'Từ chối'
	},
	{
		id: '7',
		ten: 'Mới'
	},
]

// loai trang thai kiem tra
export const TRANG_THAI_KIEM_TRA_BAO_CAO = [
	{
		id: '9',
		ten: 'Tiếp nhận'
	},
	{
		id: '8',
		ten: 'Từ chối'
	},
	{
		id: '7',
		ten: 'Mới'
	},
	{
		id: '-1',
		ten: 'Chưa gửi đơn vị cấp trên'
	},
]

export const TRANG_THAI_PHU_LUC = [
	{
		id: 0,
		ten: 'Không chấp nhận'
	},
	{
		id: 1,
		ten: 'Chấp nhận'
	},
	{
		id: 2,
		ten: 'Chưa đánh giá (để trống)'
	},
	{
		id: 3,
		ten: 'Mới'
	},
	{
		id: 4,
		ten: 'Đang nhập liệu'
	},
	{
		id: 5,
		ten: 'Hoàn tất nhập liệu'
	}
]

// loai bao cao quy trinh thuc hien du toan chi
export const DON_VI_TIEN = [
	{
		id: '1',
		tenDm: 'Đồng',
		giaTri: 1
	},
	{
		id: '2',
		tenDm: 'Nghìn đồng',
		giaTri: 1000
	},
	{
		id: '3',
		tenDm: 'Triệu đồng',
		giaTri: 1000000
	},
	{
		id: '4',
		tenDm: 'Tỷ đồng',
		giaTri: 1000000000
	},
]


export const MONEY_LIMIT = 9000000000000000;


export const LA_MA = [
	{
		kyTu: "M",
		gTri: 1000,
	},
	{
		kyTu: "CM",
		gTri: 900,
	},
	{
		kyTu: "D",
		gTri: 500,
	},
	{
		kyTu: "CD",
		gTri: 400,
	},
	{
		kyTu: "C",
		gTri: 100,
	},
	{
		kyTu: "XC",
		gTri: 90,
	},
	{
		kyTu: "L",
		gTri: 50,
	},
	{
		kyTu: "XL",
		gTri: 40,
	},
	{
		kyTu: "X",
		gTri: 10,
	},
	{
		kyTu: "IX",
		gTri: 9,
	},
	{
		kyTu: "V",
		gTri: 5,
	},
	{
		kyTu: "IV",
		gTri: 4,
	},
	{
		kyTu: "I",
		gTri: 1,
	},
];

export const LOAI_DE_NGHI = [
	{
		id: Utils.MUA_GAO,
		tenDm: "Gạo",
	},
	{
		id: Utils.MUA_THOC,
		tenDm: "Thóc",
	},
	{
		id: Utils.MUA_MUOI,
		tenDm: "Muối",
	},
	{
		id: Utils.MUA_VTU,
		tenDm: "Vật tư",
	},
]

export const NGUON_BAO_CAO = [
	{
		id: Utils.THOP_TU_CUC_KV,
		tenDm: "Tổng hợp từ cục khu vực",
	},
	{
		id: Utils.THOP_TAI_TC,
		tenDm: "Tổng hợp tại tổng cục",
	},
]

export const CAN_CU_GIA = [
	{
		id: Utils.HD_TRUNG_THAU,
		tenDm: "Hợp đồng trúng thầu",
	},
	{
		id: Utils.QD_DON_GIA,
		tenDm: "Quyết định đơn giá",
	}
]

export const LOAI_VON = [
	{
		id: Utils.CAP_VON,
		tenDm: "Cấp vốn",
	},
	{
		id: Utils.UNG_VON,
		tenDm: "Ứng vốn",
	}
]


