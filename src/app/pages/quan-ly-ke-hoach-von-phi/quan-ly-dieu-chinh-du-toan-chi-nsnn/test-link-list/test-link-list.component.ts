import { L } from '@angular/cdk/keycodes';
import { validateHorizontalPosition } from '@angular/cdk/overlay';
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Data, Router } from '@angular/router';
import * as fileSaver from 'file-saver';
import { Link } from 'gojs';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import * as uuid from "uuid";
import { DanhMucHDVService } from '../../../../services/danhMucHDV.service';
import { Utils } from "../../../../Utility/utils";


export class ItemData {
    abc!: number;
    id!: any;
    stt!: string;
    level!: number;
    checked!: boolean;
}

export class LinkList {
    abc!: number;
    vt!: number;
    checked!: boolean;
    next: LinkList[];
}

@Component({
    selector: 'app-test-link-list',
    templateUrl: './test-link-list.component.html',
    styleUrls: ['./test-link-list.component.scss'],
})

export class TestLinkListComponent implements OnInit {
    lstCTietBCao: ItemData[] = [];              // list chi tiet bao cao
    chiTietBcaos: LinkList = {
        vt: 0,
        abc: 0,
        checked: false,
        next: [],
    };

    soLaMa: any = [
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

    vt: number;
    stt: number;
    kt: boolean;
    status: boolean = false;
    disable: boolean = false;

    allChecked = false;                         // check all checkbox
    indeterminate = true;                       // properties allCheckBox
    editCache: { [key: string]: { edit: boolean; data: ItemData } } = {};     // phuc vu nut chinh

    constructor(private router: Router,
        private routerActive: ActivatedRoute,
        private spinner: NgxSpinnerService,
        private quanLyVonPhiService: QuanLyVonPhiService,
        private datePipe: DatePipe,
        private sanitizer: DomSanitizer,
        private danhMucService: DanhMucHDVService,
        private userService: UserService,
    ) {

    }


    async ngOnInit() {
        let value = {
            abc: 0,
            vt: 1,
            checked: false,
            next: [],
        }
        let value2 = {
            abc: 1,
            vt: 2,
            checked: false,
            next: [],
        }
        this.chiTietBcaos.next.push(value);
        this.chiTietBcaos.next.push(value2);
        console.log(this.chiTietBcaos);
        this.updateLstCTietBCao();
        console.log(this.lessThan(5));
    }
    //khoi tao
    duyet(data: LinkList, str: string, index: number, le: number) {
        if (index != 0) {
            let mm = {
                id: uuid.v4(),
                stt: str + index.toString(),
                level: le,
                abc: data.abc,
                checked: false,
            }
            this.lstCTietBCao.push(mm);
        }
        if (data.next.length == 0) return;
        for (var i = 0; i < data.next.length; i++) {
            if (index == 0) {
                this.duyet(data.next[i], str, i + 1, le + 1);
            } else {
                this.duyet(data.next[i], str + index.toString() + ".", i + 1, le +1);
            }

        }
    }

    updateLstCTietBCao() {
        this.lstCTietBCao = [];
        this.duyet(this.chiTietBcaos, "", 0, -1);
        console.log(this.lstCTietBCao);
        this.updateEditCache();
    }

    // gan editCache.data == lstCTietBCao
    updateEditCache(): void {
        this.lstCTietBCao.forEach(item => {
            this.editCache[item.id] = {
                edit: false,
                data: { ...item }
            };
        });
    }

    //chinh sua
    // them dong moi
    addLine(id: number): void {
        let item: ItemData = {
            abc: 0,
            stt: "",
            level: this.lstCTietBCao[id-1].level,
            id: uuid.v4(),
            checked: false,
        }


        this.lstCTietBCao.splice(id, 0, item);
        this.editCache[item.id] = {
            edit: true,
            data: { ...item }
        };
        this.status = false;
        this.disable = true;
    }

    updateSTT(data: LinkList) {
        if (data.next.length == 0) {
            return;
        }
        data.next.forEach(item => {
            item.vt = this.stt + 1;
            this.stt += 1;
            this.updateSTT(item);
        })
    }
    // xoa dong
    deleteByStt(idx: any): void {
        this.delete(this.chiTietBcaos, idx);
        this.stt = 0;
        this.updateSTT(this.chiTietBcaos);
        this.updateLstCTietBCao();
    }

    delete(data: LinkList, idx: number) {
        if (data.next.length == 0) return;
        var index = data.next.findIndex(item => item.vt == idx);
        if (index == -1) {
            data.next.forEach(item => {
                this.delete(item, idx);
            })
        } else {
            this.kt = true;
            data.next = data.next.filter(item => item.vt != idx);
            return;
        }
    }

    deleteSelected() {
        this.deleteAllSelected(this.chiTietBcaos);
        this.updateSTT(this.chiTietBcaos);
        this.updateLstCTietBCao();
        this.allChecked = false;
        this.chiTietBcaos.checked = false;
    }

    deleteAllSelected(data: LinkList) {
        if (data.next.length == 0) {
            return;
        }
        data.next = data.next.filter(item => item.checked == false);
        this.stt = 0;

        data.next.forEach(item => this.deleteAllSelected(item));
    }

    // click o checkbox all
    updateAllChecked(): void {
        this.subUpdateChecked(this.chiTietBcaos, this.allChecked);
    }

    updateChecked() {
        this.updateCheckedLL(this.chiTietBcaos);
    }

    updateCheckedLL(data: LinkList) {
        if (data.vt != 0) {
            if (data.checked != this.lstCTietBCao[data.vt - 1].checked) {
                this.subUpdateChecked(data, !data.checked);
                return;
            }
        }

        if (data.next.length == 0) return;
        var kt = true;
        data.next.forEach(item => {
            this.updateCheckedLL(item);
            if (!item.checked) kt = false;
        })
        if (data.vt == 0) {
            this.allChecked = kt;
        } else {
            this.lstCTietBCao[data.vt - 1].checked = kt;
        }
        data.checked = kt;
    }
    // gan tat ca con cua nó co cung trang thai
    subUpdateChecked(data: LinkList, kt: boolean) {
        data.checked = kt;
        if (data.vt > 0)
            this.lstCTietBCao[data.vt - 1].checked = kt;
        if (data.next.length == 0) return;
        data.next.forEach(item => this.subUpdateChecked(item, kt));
    }



    // start edit
    startEdit(id: string): void {
        this.editCache[id].edit = true;
        this.status = true;
        this.disable = true;
    }

    // huy thay doi
    cancelEdit(id: string): void {
        const index = this.lstCTietBCao.findIndex(item => item.id === id);  // lay vi tri hang minh sua
        this.editCache[id] = {
            data: { ...this.lstCTietBCao[index] },
            edit: false
        };
    }

    saveEdit(id: string): void {
        this.editCache[id].data.checked = this.lstCTietBCao.find(item => item.id === id).checked; // set checked editCache = checked lstCTietBCao
        const index = this.lstCTietBCao.findIndex(item => item.id === id);   // lay vi tri hang minh sua
        Object.assign(this.lstCTietBCao[index], this.editCache[id].data); // set lai data cua lstCTietBCao[index] = this.editCache[id].data
        this.editCache[id].edit = false;  // CHUYEN VE DANG TEXT
        this.saveEditLL(this.chiTietBcaos, index + 1);
        this.disable = false;
    }
    //save vao tu editcache vao trong linklist
    saveEditLL(data: LinkList, idx: number) {
        if (data.vt == idx) {
            data.abc = this.lstCTietBCao[idx - 1].abc;
            return;
        }
        if (data.next.length == 0) return;
        if (data.vt > idx) return;
        data.next.forEach(item => {
            this.saveEditLL(item, idx);
        })
    }

    // luu thay doi
    saveEdit1(id: string, index: number): void {
        var item: LinkList = {
            abc: this.editCache[id].data.abc,
            vt: 0,
            checked: false,
            next: [],
        }
        this.kt = false;
        this.addEqual(this.chiTietBcaos, item, index);
        if (!this.kt) {
            this.addEqual1(this.chiTietBcaos, item);
        }
        this.stt = 0;
        this.updateSTT(this.chiTietBcaos);
        console.log(this.chiTietBcaos);
        this.updateLstCTietBCao();
        this.disable = false;
    }

    // luu thay doi
    saveEdit2(id: string, index: number): void {
        var item: LinkList = {
            abc: this.editCache[id].data.abc,
            vt: 0,
            checked: false,
            next: [],
        }
        this.kt = false;
        this.addLess(this.chiTietBcaos, item, index);
        if (!this.kt) {
            this.addLess1(this.chiTietBcaos, item);
        }
        this.stt = 0;
        this.updateSTT(this.chiTietBcaos);
        console.log(this.chiTietBcaos);
        this.updateLstCTietBCao();
        this.disable = false;
    }



    addEqual(data: LinkList, value: LinkList, idx: number) {
        if (data.next.length == 0) return;
        var index = data.next.findIndex(item => item.vt == idx);
        if (index == -1) {
            data.next.forEach(item => {
                this.addEqual(item, value, idx);
            })
        } else {
            this.kt = true;
            data.next.splice(index + 1, 0, value);
            return;
        }
    }

    addEqual1(data: LinkList, value: LinkList) {
        var idx = data.next.length - 1;
        if (data.next[idx].next.length != 0) {
            this.addEqual1(data.next[idx], value);
        } else {
            data.next.push(value);
            return;
        }
    }

    addLess(data: LinkList, value: LinkList, idx: number) {
        if (data.next.length == 0) return;
        var index = data.next.findIndex(item => item.vt == idx);
        if (index == -1) {
            data.next.forEach(item => {
                this.addLess(item, value, idx);
            })
        } else {
            this.kt = true;
            data.next[index].next.splice(0, 0, value);
            return;
        }
    }

    addLess1(data: LinkList, value: LinkList) {
        if (data.next.length == 0) {
            data.next.push(value);
            return;
        }
        this.addLess1(data.next[data.next.length - 1], value);
    }

    getChiMuc(str: string): string {
        var xau: string = "";
        let chiSo: any = str.split('.');
        var n: number = chiSo.length - 1;
        var k: number = parseInt(chiSo[n], 10);
        if (n == 0){
            for(var i = 0; i < this.soLaMa.length; i++){
                while (k >= this.soLaMa[i].gTri){
                    xau += this.soLaMa[i].kyTu;
                    k -= this.soLaMa[i].gTri;
                }
            }
        };
        if (n == 1)  {
            xau = chiSo[n];
        };
        if (n==2) {
            xau = chiSo[n-1].toString() + "." + chiSo[n].toString();
        };
        if (n == 3) {
            xau = String.fromCharCode(k+96);
        }
        if (n == 4) {
            xau = "-";
        }
        return xau;
    }
    
    lessThan(level: number): boolean {
        return level > 3;
    }

}