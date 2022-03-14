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
import { DanhMucService } from '../../../../services/danhMuc.service';
import { Utils } from "../../../../Utility/utils";


export class ItemData {
  abc!: number;
  id!: any;
  stt!: String;
  checked!: boolean;
}

export class LinkList {
  abc!: number;
  vt!: number;
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
    next: [],
  };

  vt: number;
  stt: number;
  kt: boolean;

  allChecked = false;                         // check all checkbox
  indeterminate = true;                       // properties allCheckBox
  editCache: { [key: string]: { edit: boolean; data: ItemData } } = {};     // phuc vu nut chinh

  constructor(private router: Router,
    private routerActive: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private quanLyVonPhiService: QuanLyVonPhiService,
    private datePipe: DatePipe,
    private sanitizer: DomSanitizer,
    private danhMucService: DanhMucService,
    private userService: UserService,
  ) {

  }


  async ngOnInit() {
    let value = {
      abc: 0,
      vt: 1,
      next: [],
    }
    let value2 = {
      abc: 1,
      vt: 2,
      next: [],
    }
    this.chiTietBcaos.next.push(value);
    this.chiTietBcaos.next.push(value2);
    console.log(this.chiTietBcaos);
    this.updateLstCTietBCao();
  }
  //khoi tao
  duyet(data: LinkList, str: string, index: number) {
    if (index != 0) {
      let mm = {
        id: uuid.v4(),
        stt: str + index.toString(),
        abc: data.abc,
        checked: false,
      }
      this.lstCTietBCao.push(mm);
    }
    if (data.next.length == 0) return;
    for (var i = 0; i < data.next.length; i++) {
      if (index == 0){
        this.duyet(data.next[i], str, i + 1);
      } else {
        this.duyet(data.next[i], str + index.toString() + "." , i + 1);
      }
      
    }
  }

  updateLstCTietBCao() {
    this.lstCTietBCao = [];
    this.duyet(this.chiTietBcaos, "", 0);
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
      id: uuid.v4(),
      checked: false,
    }

    this.lstCTietBCao.splice(id, 0, item);
    this.editCache[item.id] = {
      edit: true,
      data: { ...item }
    };
  }

  updateSTT(data: LinkList){
    if (data.next.length == 0){
      return;
    }
    data.next.forEach(item =>{
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

  delete(data:LinkList, idx: number){
    if (data.next.length == 0) return;
    var index = data.next.findIndex(item => item.vt == idx);
    if (index == -1){
      data.next.forEach(item => {
        this.delete(item, idx);
      })
    } else {
      this.kt = true;
      data.next = data.next.filter(item => item.vt != idx);
      return;
    }
  }

  // click o checkbox all
  updateAllChecked(): void {
    this.indeterminate = false;                               // thuoc tinh su kien o checkbox all
    if (this.allChecked) {                                    // checkboxall == true thi set lai lstCTietBCao.checked = true
      this.lstCTietBCao = this.lstCTietBCao.map(item => ({
        ...item,
        checked: true
      }));
    } else {
      this.lstCTietBCao = this.lstCTietBCao.map(item => ({    // checkboxall == false thi set lai lstCTietBCao.checked = false
        ...item,
        checked: false
      }));
    }
  }

  updateChecked(){
    let index: number[] = [];
    for (var i = 0; i < this.lstCTietBCao.length; i++){
      if (this.lstCTietBCao[i].checked) index.push(i+1);
    }
    this.updateCheckedLL(this.chiTietBcaos, index);

  }

  updateCheckedLL(data: LinkList, index: number[]){
    if (data.next.length == 0) return;
    data.next.forEach(item => {
      this.updateCheckedLL(item, index);
    })
    var kt = true;
    data.next.forEach(item => {
      if (!index.includes(item.vt)) kt = false;
    })
    if (kt) {
      this.lstCTietBCao[data.vt-1].checked = true;
    } else {
      this.lstCTietBCao[data.vt-1].checked = false;
    }
  }
  // click o checkbox single
  updateSingleChecked(): void {
    if (this.lstCTietBCao.every(item => !item.checked)) {           // tat ca o checkbox deu = false thi set o checkbox all = false
      this.allChecked = false;
      this.indeterminate = false;
    } else if (this.lstCTietBCao.every(item => item.checked)) {     // tat ca o checkbox deu = true thi set o checkbox all = true
      this.allChecked = true;
      this.indeterminate = false;
    } else {                                                        // o checkbox vua = false, vua = true thi set o checkbox all = indeterminate
      this.indeterminate = true;
    }
  }


  // start edit
  startEdit(id: string): void {
    this.editCache[id].edit = true;
  }

  // huy thay doi
  cancelEdit(id: string): void {
    const index = this.lstCTietBCao.findIndex(item => item.id === id);  // lay vi tri hang minh sua
    this.editCache[id] = {
      data: { ...this.lstCTietBCao[index] },
      edit: false
    };
  }

  // luu thay doi
  saveEdit1(id: string, index: number): void {
    var item: LinkList = {
      abc: this.editCache[id].data.abc,
      vt: 0,
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
  }

  // luu thay doi
  saveEdit2(id: string, index: number): void {
    var item: LinkList = {
      abc: this.editCache[id].data.abc,
      vt: 0,
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
  }

  

  addEqual(data: LinkList, value: LinkList, idx: number) {
    if (data.next.length == 0) return;
    var index = data.next.findIndex(item => item.vt == idx);
    if (index == -1){
      data.next.forEach(item => {
        this.addEqual(item, value, idx);
      })
    } else {
      this.kt = true;
      data.next.splice(index+1, 0, value);
      return;
    }
  }
   
  addEqual1(data: LinkList, value: LinkList){
    var idx = data.next.length-1;
    if (data.next[idx].next.length != 0){
     this.addEqual1(data.next[idx], value);
    } else {
      data.next.push(value);
      return;
    }
  }

  addLess(data: LinkList, value: LinkList, idx: number) {
    if (data.next.length == 0) return;
    var index = data.next.findIndex(item => item.vt == idx);
    if (index == -1){
      data.next.forEach(item => {
        this.addLess(item, value, idx);
      })
    } else {
      this.kt = true;
      data.next[index].next.splice(0, 0, value);
      return;
    }
  }

  addLess1(data: LinkList, value: LinkList){
    if (data.next.length == 0){
      data.next.push(value);
      return;
    }
    this.addLess1(data.next[data.next.length-1], value);
  }

}
