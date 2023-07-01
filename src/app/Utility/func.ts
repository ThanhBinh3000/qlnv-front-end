import { Injectable, NgModule } from "@angular/core";
import { NzNotificationService } from "ng-zorro-antd/notification";
import * as uuid from "uuid";
import { MESSAGE } from "../constants/message";
import { QuanLyVonPhiService } from "../services/quanLyVonPhi.service";
import { DON_VI_TIEN, LA_MA, NUM_BOX_WIDTH, TEXT_BOX_WIDTH, Utils } from "./utils";
import * as fileSaver from 'file-saver';
import { DatePipe } from "@angular/common";

@Injectable({
    providedIn: 'root',
})

export class GeneralFunction {
    constructor(
        private datePipe: DatePipe,
    ) { }
    statusClass(status) {
        if (Utils.statusSave.includes(status)) {
            return 'du-thao-va-lanh-dao-duyet';
        } else {
            return 'da-ban-hanh';
        }
    }

    //thuc hien thay the ky tu dat trong dau $$ boi nam n tuong ung
    getName(n: number, name: string) {
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

    setTableWidth(leftWidth: number, col: number, colWidth: number, rightWidth: number): string {
        return (leftWidth + col * colWidth + rightWidth).toString() + 'px';
    }

    tableWidth(leftW: number, numCol: number, textCol: number, rightW: number): string {
        return (leftW + numCol * NUM_BOX_WIDTH + textCol * TEXT_BOX_WIDTH + rightW).toString() + 'px';
    }

    fmtDate(date: any) {
        return this.datePipe.transform(date, Utils.FORMAT_DATE_STR);
    }

    moneyUnitName(moneyUnit: string) {
        return DON_VI_TIEN.find(e => e.id == moneyUnit)?.tenDm;
    }

    laMa(k: number) {
        let xau = "";
        for (let i = 0; i < LA_MA.length; i++) {
            while (k >= LA_MA[i].gTri) {
                xau += LA_MA[i].kyTu;
                k -= LA_MA[i].gTri;
            }
        }
        return xau;
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
}

@Injectable({
    providedIn: 'root',
})

export class NumberFunction {
    exchangeMoney(value: number, oldMoneyUnit: string, newMoneyUnit: string): number {
        const oldUnit = (parseInt(oldMoneyUnit, 10) - 1) * 3;
        const newUnit = (parseInt(newMoneyUnit, 10) - 1) * 3;
        if (!value && value !== 0) {
            return null;
        }
        return value * Math.pow(10, oldUnit - newUnit);
    }
    //cong day cac so
    sum(num: any): number {
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
    mul(num1: number, num2: number) {
        if ((!num1 && num1 !== 0) && (!num2 && num2 !== 0)) {
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
    div(num1, num2): number {
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

    percent(num1, num2): number {
        return divNumber(mulNumber(num1, 100), num2);
    }

    //hien thi cac so theo dinh dang
    numFmt(num: number): string {
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
            displayValue = dau + separateNumber(real);
        } else {
            displayValue = dau + separateNumber(real) + ',' + imaginary;
        }
        return displayValue;
    }

    //ngan cach nghin trong so boi dau .
    separateNumber(str: string): string {
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

    valFmt(num: number, moneyUnit: string): string {
        num = exchangeMoney(num, '1', moneyUnit);
        return displayNumber(num);
    }

    //kiem tra xem chuoi co phai toan ky tu so ko
    numOnly(str: string): boolean {
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

export class FileFunction {
    constructor(
        private quanLyVonPhiService: QuanLyVonPhiService,
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
                    fileSaver.saveAs(data, doc.fileName);
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

@Injectable({
    providedIn: 'root',
})

export class TableFunction {
    //lấy phần đầu của stt, dùng để xác định cha cua phần tử
    getHead(str: string): string {
        return str.substring(0, str.lastIndexOf('.'));
    }
    // lấy phần đuôi của stt
    getTail(str: string): number {
        return parseInt(str.substring(str.lastIndexOf('.') + 1, str.length), 10);
    }
    //tìm vị trí cần để thêm mới
    findIndex(str: string, lstCtietBcao: any[]): number {
        const start: number = lstCtietBcao.findIndex(e => e.stt == str);
        let index: number = start;
        for (let i = start + 1; i < lstCtietBcao.length; i++) {
            if (lstCtietBcao[i].stt.startsWith(str)) {
                index = i;
            }
        }
        return index;
    }

    //sap xep co thu tu cua danh muc theo so thu tu co san
    sortByIndex(lstCtietBcao: any[]) {
        lstCtietBcao = setLevel(lstCtietBcao, null);
        lstCtietBcao.sort((item1, item2) => {
            if (item1.level > item2.level) {
                return 1;
            }
            if (item1.level < item2.level) {
                return -1;
            }
            if (getTail(item1.stt) > getTail(item2.stt)) {
                return -1;
            }
            if (getTail(item1.stt) < getTail(item2.stt)) {
                return 1;
            }
            return 0;
        });
        const lstTemp: any[] = [];
        lstCtietBcao.forEach(item => {
            const index: number = lstTemp.findIndex(e => e.stt == getHead(item.stt));
            if (index == -1) {
                lstTemp.splice(0, 0, item);
            } else {
                lstTemp.splice(index + 1, 0, item);
            }
        })

        return lstTemp;
    }

    sortWithoutIndex(lstCtietBcao: any[], key: string) {
        lstCtietBcao = setLevel(lstCtietBcao, key);
        let level = 0;
        let lstCtietBcaoTemp: any[] = [];
        let lstTemp = lstCtietBcao.filter(e => e.level == level);
        while (lstTemp?.length > 0) {
            lstTemp.sort((a, b) => {
                if (getTail(a[key]) > getTail(b[key])) {
                    return 1;
                }
                return -1;
            })
            lstTemp.forEach(item => {
                if (lstCtietBcaoTemp?.length == 0) {
                    addHead(item, lstCtietBcaoTemp);
                } else {
                    let index: number = lstCtietBcaoTemp.findIndex(e => e[key] === getHead(item[key]));
                    if (index != -1) {
                        lstCtietBcaoTemp = addChild(lstCtietBcaoTemp[index].id, item, lstCtietBcaoTemp);
                    } else {
                        index = lstCtietBcaoTemp.findIndex(e => getHead(e[key]) === getHead(item[key]));
                        lstCtietBcaoTemp = addParent(lstCtietBcaoTemp[index].id, item, lstCtietBcaoTemp);
                    }
                }
            })
            level += 1;
            lstTemp = lstCtietBcao.filter(e => e.level == level);
        }
        return lstCtietBcaoTemp;
    }

    //them phan tu o vi tri dau tien cua mang
    addHead(initItem: any, lstCtietBcao: any[]) {
        const item: any = {
            ...initItem,
            stt: '0.1',
            id: !initItem.id ? uuid.v4() + 'FE' : initItem.id,
        }
        lstCtietBcao.push(item);
        return lstCtietBcao;
    }

    //them phan tu co cap cung voi cap cua vi tri hien tai
    addParent(id: string, initItem: any, lstCtietBcao: any[]) {
        const index: number = lstCtietBcao.findIndex(e => e.id === id); // vi tri hien tai
        const head: string = getHead(lstCtietBcao[index].stt); // lay phan dau cua so tt
        const tail: number = getTail(lstCtietBcao[index].stt); // lay phan duoi cua so tt
        const ind: number = findIndex(lstCtietBcao[index].stt, lstCtietBcao); // vi tri can duoc them
        // tim cac vi tri can thay doi lai stt
        const lstIndex: number[] = [];
        for (let i = lstCtietBcao.length - 1; i > ind; i--) {
            if (getHead(lstCtietBcao[i].stt) == head) {
                lstIndex.push(i);
            }
        }

        lstCtietBcao = replaceIndex(lstIndex, 1, lstCtietBcao);
        // them moi phan tu
        const item: any = {
            ...initItem,
            stt: head + "." + (tail + 1).toString(),
            id: !initItem.id ? uuid.v4() + 'FE' : initItem.id,
        }
        lstCtietBcao.splice(ind + 1, 0, item);

        return lstCtietBcao;
    }

    addChild(id: string, initItem: any, lstCtietBcao: any[]) {
        const data: any = lstCtietBcao.find(e => e.id === id);
        let index: number = lstCtietBcao.findIndex(e => e.id === id); // vi tri hien tai
        let stt: string;
        if (lstCtietBcao.findIndex(e => getHead(e.stt) == data.stt) == -1) {
            stt = data.stt + '.1';
        } else {
            index = findIndex(data.stt, lstCtietBcao);
            for (let i = lstCtietBcao.length - 1; i >= 0; i--) {
                if (getHead(lstCtietBcao[i].stt) == data.stt) {
                    stt = data.stt + '.' + (getTail(lstCtietBcao[i].stt) + 1).toString();
                    break;
                }
            }
        }

        const item: any = {
            ...initItem,
            stt: stt,
            id: !initItem.id ? uuid.v4() + 'FE' : initItem.id,
        }
        lstCtietBcao.splice(index + 1, 0, item);

        return lstCtietBcao;
    }

    //thay thế các stt khi danh sách được cập nhật, heSo=1 tức là tăng stt lên 1, heso=-1 là giảm stt đi 1
    replaceIndex(lstIndex: number[], heSo: number, lstCtietBcao: any[]) {
        if (heSo == -1) {
            lstIndex.reverse();
        }
        //thay doi lai stt cac vi tri vua tim duoc
        lstIndex.forEach(item => {
            const str = getHead(lstCtietBcao[item].stt) + "." + (getTail(lstCtietBcao[item].stt) + heSo).toString();
            const nho = lstCtietBcao[item].stt;
            lstCtietBcao.forEach(item => {
                item.stt = item.stt.replace(nho, str);
            })
        })
        return lstCtietBcao;
    }

    //xoa hang
    deleteRow(id: string, lstCtietBcao: any[]) {
        const index: number = lstCtietBcao.findIndex(e => e.id === id); // vi tri hien tai
        const nho: string = lstCtietBcao[index].stt;
        const head: string = getHead(lstCtietBcao[index].stt); // lay phan dau cua so tt
        //xóa phần tử và con của nó
        lstCtietBcao = lstCtietBcao.filter(e => !e.stt.startsWith(nho));
        //update lại số thức tự cho các phần tử cần thiết
        const lstIndex: number[] = [];
        for (let i = lstCtietBcao.length - 1; i >= index; i--) {
            if (getHead(lstCtietBcao[i].stt) == head) {
                lstIndex.push(i);
            }
        }
        lstCtietBcao = replaceIndex(lstIndex, -1, lstCtietBcao);

        return lstCtietBcao;
    }

    //dat lai level cho cac ban ghi
    setLevel(lstCtietBcao: any[], key: string) {
        lstCtietBcao.forEach(item => {
            const str: string[] = key ? item[key].split('.') : item.stt.split('.');
            item.level = str.length - 2;
        })
        return lstCtietBcao;
    }
}

//lấy phần đầu của stt, dùng để xác định cha cua phần tử
export function getHead(str: string): string {
    return str.substring(0, str.lastIndexOf('.'));
}
// lấy phần đuôi của stt
export function getTail(str: string): number {
    return parseInt(str.substring(str.lastIndexOf('.') + 1, str.length), 10);
}
//tìm vị trí cần để thêm mới
export function findIndex(str: string, lstCtietBcao: any[]): number {
    const start: number = lstCtietBcao.findIndex(e => e.stt == str);
    let index: number = start;
    for (let i = start + 1; i < lstCtietBcao.length; i++) {
        if (lstCtietBcao[i].stt.startsWith(str)) {
            index = i;
        }
    }
    return index;
}

//sap xep co thu tu cua danh muc theo so thu tu co san
export function sortByIndex(lstCtietBcao: any[]) {
    lstCtietBcao = setLevel(lstCtietBcao, null);
    lstCtietBcao.sort((item1, item2) => {
        if (item1.level > item2.level) {
            return 1;
        }
        if (item1.level < item2.level) {
            return -1;
        }
        if (getTail(item1.stt) > getTail(item2.stt)) {
            return -1;
        }
        if (getTail(item1.stt) < getTail(item2.stt)) {
            return 1;
        }
        return 0;
    });
    const lstTemp: any[] = [];
    lstCtietBcao.forEach(item => {
        const index: number = lstTemp.findIndex(e => e.stt == getHead(item.stt));
        if (index == -1) {
            lstTemp.splice(0, 0, item);
        } else {
            lstTemp.splice(index + 1, 0, item);
        }
    })

    return lstTemp;
}

export function sortWithoutIndex(lstCtietBcao: any[], key: string) {
    lstCtietBcao = setLevel(lstCtietBcao, key);
    let level = 0;
    let lstCtietBcaoTemp: any[] = [];
    let lstTemp = lstCtietBcao.filter(e => e.level == level);
    while (lstTemp?.length > 0) {
        lstTemp.sort((a, b) => {
            if (getTail(a[key]) > getTail(b[key])) {
                return 1;
            }
            return -1;
        })
        lstTemp.forEach(item => {
            if (lstCtietBcaoTemp?.length == 0) {
                addHead(item, lstCtietBcaoTemp);
            } else {
                let index: number = lstCtietBcaoTemp.findIndex(e => e[key] === getHead(item[key]));
                if (index != -1) {
                    lstCtietBcaoTemp = addChild(lstCtietBcaoTemp[index].id, item, lstCtietBcaoTemp);
                } else {
                    index = lstCtietBcaoTemp.findIndex(e => getHead(e[key]) === getHead(item[key]));
                    lstCtietBcaoTemp = addParent(lstCtietBcaoTemp[index].id, item, lstCtietBcaoTemp);
                }
            }
        })
        level += 1;
        lstTemp = lstCtietBcao.filter(e => e.level == level);
    }
    return lstCtietBcaoTemp;
}

// export function sortWithoutIndex(lstCtietBcao: any[], key: string) {
//     lstCtietBcao = setLevel(lstCtietBcao, key);
//     let level = 0;
//     let lstCtietBcaoTemp: any[] = lstCtietBcao;
//     lstCtietBcao = [];
//     const data: any = lstCtietBcaoTemp.find(e => e.level == 0);
//     lstCtietBcao = addHead(data, lstCtietBcao);
//     lstCtietBcaoTemp = lstCtietBcaoTemp.filter(e => e.id != data.id);
//     let lstTemp: any[] = lstCtietBcaoTemp.filter(e => e.level == level);
//     while (lstTemp.length != 0 || level == 0) {
//         lstTemp.forEach(item => {
//             let index: number = lstCtietBcao.findIndex(e => e[key] === getHead(item[key]));
//             if (index != -1) {
//                 lstCtietBcao = addChild(lstCtietBcao[index].id, item, lstCtietBcao);
//             } else {
//                 index = lstCtietBcao.findIndex(e => getHead(e[key]) === getHead(item[key]));
//                 lstCtietBcao = addParent(lstCtietBcao[index].id, item, lstCtietBcao);
//             }
//         })
//         level += 1;
//         lstTemp = lstCtietBcaoTemp.filter(e => e.level == level);
//     }
//     return lstCtietBcao;
// }

//them phan tu o vi tri dau tien cua mang
export function addHead(initItem: any, lstCtietBcao: any[]) {
    const item: any = {
        ...initItem,
        stt: '0.1',
        id: !initItem.id ? uuid.v4() + 'FE' : initItem.id,
    }
    lstCtietBcao.push(item);
    return lstCtietBcao;
}

//them phan tu co cap cung voi cap cua vi tri hien tai
export function addParent(id: string, initItem: any, lstCtietBcao: any[]) {
    const index: number = lstCtietBcao.findIndex(e => e.id === id); // vi tri hien tai
    const head: string = getHead(lstCtietBcao[index].stt); // lay phan dau cua so tt
    const tail: number = getTail(lstCtietBcao[index].stt); // lay phan duoi cua so tt
    const ind: number = findIndex(lstCtietBcao[index].stt, lstCtietBcao); // vi tri can duoc them
    // tim cac vi tri can thay doi lai stt
    const lstIndex: number[] = [];
    for (let i = lstCtietBcao.length - 1; i > ind; i--) {
        if (getHead(lstCtietBcao[i].stt) == head) {
            lstIndex.push(i);
        }
    }

    lstCtietBcao = replaceIndex(lstIndex, 1, lstCtietBcao);
    // them moi phan tu
    const item: any = {
        ...initItem,
        stt: head + "." + (tail + 1).toString(),
        id: !initItem.id ? uuid.v4() + 'FE' : initItem.id,
    }
    lstCtietBcao.splice(ind + 1, 0, item);

    return lstCtietBcao;
}

export function addChild(id: string, initItem: any, lstCtietBcao: any[]) {
    const data: any = lstCtietBcao.find(e => e.id === id);
    let index: number = lstCtietBcao.findIndex(e => e.id === id); // vi tri hien tai
    let stt: string;
    if (lstCtietBcao.findIndex(e => getHead(e.stt) == data.stt) == -1) {
        stt = data.stt + '.1';
    } else {
        index = findIndex(data.stt, lstCtietBcao);
        for (let i = lstCtietBcao.length - 1; i >= 0; i--) {
            if (getHead(lstCtietBcao[i].stt) == data.stt) {
                stt = data.stt + '.' + (getTail(lstCtietBcao[i].stt) + 1).toString();
                break;
            }
        }
    }

    const item: any = {
        ...initItem,
        stt: stt,
        id: !initItem.id ? uuid.v4() + 'FE' : initItem.id,
    }
    lstCtietBcao.splice(index + 1, 0, item);

    return lstCtietBcao;
}

//thay thế các stt khi danh sách được cập nhật, heSo=1 tức là tăng stt lên 1, heso=-1 là giảm stt đi 1
export function replaceIndex(lstIndex: number[], heSo: number, lstCtietBcao: any[]) {
    if (heSo == -1) {
        lstIndex.reverse();
    }
    //thay doi lai stt cac vi tri vua tim duoc
    lstIndex.forEach(item => {
        const str = getHead(lstCtietBcao[item].stt) + "." + (getTail(lstCtietBcao[item].stt) + heSo).toString();
        const nho = lstCtietBcao[item].stt;
        lstCtietBcao.forEach(item => {
            item.stt = item.stt.replace(nho, str);
        })
    })
    return lstCtietBcao;
}

//xoa hang
export function deleteRow(id: string, lstCtietBcao: any[]) {
    const index: number = lstCtietBcao.findIndex(e => e.id === id); // vi tri hien tai
    const nho: string = lstCtietBcao[index].stt;
    const head: string = getHead(lstCtietBcao[index].stt); // lay phan dau cua so tt
    //xóa phần tử và con của nó
    lstCtietBcao = lstCtietBcao.filter(e => !e.stt.startsWith(nho));
    //update lại số thức tự cho các phần tử cần thiết
    const lstIndex: number[] = [];
    for (let i = lstCtietBcao.length - 1; i >= index; i--) {
        if (getHead(lstCtietBcao[i].stt) == head) {
            lstIndex.push(i);
        }
    }
    lstCtietBcao = replaceIndex(lstIndex, -1, lstCtietBcao);

    return lstCtietBcao;
}

//dat lai level cho cac ban ghi
export function setLevel(lstCtietBcao: any[], key: string) {
    lstCtietBcao.forEach(item => {
        const str: string[] = key ? item[key].split('.') : item.stt.split('.');
        item.level = str.length - 2;
    })
    return lstCtietBcao;
}

//doi don vi tien
export function exchangeMoney(value: number, oldMoneyUnit: string, newMoneyUnit: string): number {
    const oldUnit = (parseInt(oldMoneyUnit, 10) - 1) * 3;
    const newUnit = (parseInt(newMoneyUnit, 10) - 1) * 3;
    if (!value && value !== 0) {
        return null;
    }
    return value * Math.pow(10, oldUnit - newUnit);
}

//cong day cac so
export function sumNumber(num: any): number {
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
export function mulNumber(num1: number, num2: number) {
    if ((!num1 && num1 !== 0) && (!num2 && num2 !== 0)) {
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
export function divNumber(num1, num2): number {
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

export function percent(num1, num2): number {
    return divNumber(mulNumber(num1, 100), num2);
}

//hien thi cac so theo dinh dang
export function displayNumber(num: number): string {
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
        displayValue = dau + separateNumber(real);
    } else {
        displayValue = dau + separateNumber(real) + ',' + imaginary;
    }
    return displayValue;
}

//ngan cach nghin trong so boi dau .
export function separateNumber(str: string): string {
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

//kiem tra xem chuoi co phai toan ky tu so ko
export function numberOnly(str: string): boolean {
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

//thuc hien thay the ky tu dat trong dau $$ boi nam n tuong ung
export function getName(n: number, name: string) {
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

export function setTableWidth(leftWidth: number, col: number, colWidth: number, rightWidth: number): string {
    return (leftWidth + col * colWidth + rightWidth).toString() + 'px';
}




