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
import { linkList } from '../../quy-trinh-bao-cao-thuc-hien-du-toan-chi-nsnn/chuc-nang-chi-cuc/bao-cao/bao-cao.component';
import { KHOAN_MUC, LA_MA } from '../quan-ly-dieu-chinh-du-toan-chi-nsnn.constant';


export class ItemData {
    abc!: number;
    maKhoanMuc!: number;
    lstKm: any[];
    level: number; //level chỉ dùng để in các stt thụt lùi trong html, ngoài ra ko có tác dụng gì.
    id!: any;
    stt!: string;
    checked!: boolean;
}



@Component({
    selector: 'app-test-link-list',
    templateUrl: './test-link-list.component.html',
    styleUrls: ['./test-link-list.component.scss'],
})

export class TestLinkListComponent implements OnInit {
    lstCTietBCao: ItemData[] = []; // list chi tiet bao cao

    lstKhoanMuc: any[] = KHOAN_MUC;

    soLaMa: any[] = LA_MA;

    vt: number;
    stt: number;
    kt: boolean;
    status: boolean = false;
    disable: boolean = false;

    allChecked = false; // check all checkbox
    indeterminate = true; // properties allCheckBox
    editCache: {
        [key: string]: { edit: boolean;data: ItemData }
    } = {}; // phuc vu nut chinh

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

    }

    // chuyển đổi stt đang được mã hóa thành dạng I, II, a, b, c, ...
    getChiMuc(str: string): string {
        str = str.substring(str.indexOf('.') + 1, str.length);
        var xau: string = "";
        let chiSo: any = str.split('.');
        var n: number = chiSo.length - 1;
        var k: number = parseInt(chiSo[n], 10);
        if (n == 0) {
            for (var i = 0; i < this.soLaMa.length; i++) {
                while (k >= this.soLaMa[i].gTri) {
                    xau += this.soLaMa[i].kyTu;
                    k -= this.soLaMa[i].gTri;
                }
            }
        };
        if (n == 1) {
            xau = chiSo[n];
        };
        if (n == 2) {
            xau = chiSo[n - 1].toString() + "." + chiSo[n].toString();
        };
        if (n == 3) {
            xau = String.fromCharCode(k + 96);
        }
        if (n == 4) {
            xau = "-";
        }
        return xau;
    }
    // lấy phần đầu của số thứ tự, dùng để xác định phần tử cha
    getHead(str: string): string {
        return str.substring(0, str.lastIndexOf('.'));
    }
    // lấy phần đuôi của stt 
    getTail(str: string): number {
        return parseInt(str.substring(str.lastIndexOf('.') + 1, str.length), 10);
    }
    //tìm vị trí cần để thêm mới
    findVt(str: string): number {
        var start: number = this.lstCTietBCao.findIndex(e => e.stt == str);
        var index: number = start;
        for (var i = start + 1; i < this.lstCTietBCao.length; i++) {
            if (this.lstCTietBCao[i].stt.startsWith(str)) {
                index = i;
            }
        }
        return index;
    }
    //thay thế các stt khi danh sách được cập nhật, heSo=1 tức là tăng stt lên 1, heso=-1 là giảm stt đi 1
    replaceIndex(lstIndex: number[], heSo: number) {
        //thay doi lai stt cac vi tri vua tim duoc
        lstIndex.forEach(item => {
            var str = this.getHead(this.lstCTietBCao[item].stt) + "." + (this.getTail(this.lstCTietBCao[item].stt) + heSo).toString();
            var nho = this.lstCTietBCao[item].stt;
            this.lstCTietBCao.forEach(item => {
                item.stt = item.stt.replace(nho, str);
            })
        })
    }
    //thêm ngang cấp
    addSame(id: any) {
        var index: number = this.lstCTietBCao.findIndex(e => e.id === id); // vi tri hien tai
        var head: string = this.getHead(this.lstCTietBCao[index].stt); // lay phan dau cua so tt
        var tail: number = this.getTail(this.lstCTietBCao[index].stt); // lay phan duoi cua so tt
        var ind: number = this.findVt(this.lstCTietBCao[index].stt); // vi tri can duoc them
        // tim cac vi tri can thay doi lai stt
        let lstIndex: number[] = [];
        for (var i = this.lstCTietBCao.length - 1; i > ind; i--) {
            if (this.getHead(this.lstCTietBCao[i].stt) == head) {
                lstIndex.push(i);
            }
        }

        this.replaceIndex(lstIndex, 1);

        // them moi phan tu
        let item: ItemData = {
            id: uuid.v4(),
            stt: head + "." + (tail + 1).toString(),
            lstKm: this.lstCTietBCao[index].lstKm,
            level: this.lstCTietBCao[index].level,
            maKhoanMuc: 0,
            abc: 0,
            checked: false,
        }
        this.lstCTietBCao.splice(ind + 1, 0, item);

        this.editCache[item.id] = {
            edit: true,
            data: { ...item }
        };
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
    //thêm cấp thấp hơn
    addLow(id: any) {
        var index: number = this.lstCTietBCao.findIndex(e => e.id === id); // vi tri hien tai
        //list các vị trí cần thay đôi lại stt
        let lstIndex: number[] = [];
        for (var i = this.lstCTietBCao.length - 1; i > index; i--) {
            if (this.getHead(this.lstCTietBCao[i].stt) == this.lstCTietBCao[index].stt) {
                lstIndex.push(i);
            }
        }

        this.replaceIndex(lstIndex, 1);

        // them moi phan tu
        let item: ItemData = {
            id: uuid.v4(),
            maKhoanMuc: 0,
            lstKm: this.lstKhoanMuc.filter(e => e.idCha == this.lstCTietBCao[index].maKhoanMuc),
            level: this.lstCTietBCao[index].level + 1,
            stt: this.lstCTietBCao[index].stt + ".1",
            abc: 0,
            checked: false,
        }
        this.lstCTietBCao.splice(index + 1, 0, item);

        this.editCache[item.id] = {
            edit: true,
            data: { ...item }
        };
    }
    //xóa dòng
    deleteLine(id: any) {
        var index: number = this.lstCTietBCao.findIndex(e => e.id === id); // vi tri hien tai
        var nho: string = this.lstCTietBCao[index].stt;
        var head: string = this.getHead(this.lstCTietBCao[index].stt); // lay phan dau cua so tt
        //xóa phần tử và con của nó
        this.lstCTietBCao = this.lstCTietBCao.filter(e => !e.stt.startsWith(nho));
        //update lại số thức tự cho các phần tử cần thiết
        let lstIndex: number[] = [];
        for (var i = this.lstCTietBCao.length - 1; i >= index; i--) {
            if (this.getHead(this.lstCTietBCao[i].stt) == head) {
                lstIndex.push(i);
            }
        }

        this.replaceIndex(lstIndex, -1);

        this.updateEditCache();
    }

    // start edit
    startEdit(id: string): void {
        this.editCache[id].edit = true;
    }

    // huy thay doi
    cancelEdit(id: string): void {
        const index = this.lstCTietBCao.findIndex(item => item.id === id);

        // lay vi tri hang minh sua
        this.editCache[id] = {
            data: { ...this.lstCTietBCao[index] },
            edit: false
        };
    }

    // luu thay doi
    saveEdit(id: string): void {
        this.editCache[id].data.checked = this.lstCTietBCao.find(item => item.id === id).checked; // set checked editCache = checked lstCTietBCao
        const index = this.lstCTietBCao.findIndex(item => item.id === id); // lay vi tri hang minh sua
        Object.assign(this.lstCTietBCao[index], this.editCache[id].data); // set lai data cua lstCTietBCao[index] = this.editCache[id].data
        this.editCache[id].edit = false; // CHUYEN VE DANG TEXT
    }

    updateChecked(id: any){
        var data: ItemData = this.lstCTietBCao.find(e => e.id === id);
        //đặt các phần tử con có cùng trạng thái với nó
        this.lstCTietBCao.forEach(item => {
            if (item.stt.startsWith(data.stt)){
                item.checked = data.checked;
            }
        })
        //thay đổi các phần tử cha cho phù hợp với tháy đổi của phần tử con
        var index: number = this.lstCTietBCao.findIndex(e => e.stt == this.getHead(data.stt));
        if (index == -1){
            this.allChecked = data.checked;
        } else {
            var nho: boolean = this.lstCTietBCao[index].checked;
            while (nho != this.checkAllChild(this.lstCTietBCao[index].stt)){
                this.lstCTietBCao[index].checked = !nho;
                index = this.lstCTietBCao.findIndex(e => e.stt == this.getHead(this.lstCTietBCao[index].stt));
                if (index == -1){
                    this.allChecked = !nho;
                    break;
                } 
                nho = this.lstCTietBCao[index].checked;
            }
        }
    }
    //kiểm tra các phần tử con có cùng được đánh dấu hay ko
    checkAllChild(str: string): boolean{
        var nho: boolean = true;
        this.lstCTietBCao.forEach(item => {
            if ((item.stt.startsWith(str)) && (!item.checked) && (item.stt != str)){
                nho = item.checked;
            }
        })
        return nho;
    }


    updateAllChecked(){
        this.lstCTietBCao.forEach(item => {
            item.checked = this.allChecked;
        })
    }

    deleteAllChecked() {
        var lstId: any[] = [];
        this.lstCTietBCao.forEach(item => {
            if (item.checked) {
                lstId.push(item.id);
            }
        })
        lstId.forEach(item => {
            if (this.lstCTietBCao.findIndex(e => e.id == item) != -1) {
                this.deleteLine(item);
            }
        })
    }
    //thêm phần tử đầu tiên khi bảng rỗng
    addFirst(){
        let item: ItemData = {
            id: uuid.v4(),
            maKhoanMuc: 0,
            lstKm: this.lstKhoanMuc.filter(e => e.idCha == 0),
            level: 0,
            stt: "0.1",
            abc: 0,
            checked: false,
        }
        this.lstCTietBCao.push(item);

        this.editCache[item.id] = {
            edit: true,
            data: { ...item }
        };
    }

}
