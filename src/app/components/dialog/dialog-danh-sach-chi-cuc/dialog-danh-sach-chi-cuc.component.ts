import { DialogCanhBaoComponent } from './../dialog-canh-bao/dialog-canh-bao.component';
import { DanhSachGoiThau } from '../../../models/DeXuatKeHoachuaChonNhaThau';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import VNnum2words from 'vn-num2words';
import { Globals } from 'src/app/shared/globals';
export interface TreeNodeInterface {
  key: string;
  name: string;
  age?: number;
  level?: number;
  expand?: boolean;
  address?: string;
  children?: TreeNodeInterface[];
  parent?: TreeNodeInterface;
}
@Component({
  selector: 'dialog-danh-sach-chi-cuc',
  templateUrl: './dialog-danh-sach-chi-cuc.component.html',
  styleUrls: ['./dialog-danh-sach-chi-cuc.component.scss'],
})
export class DialogDanhSachChiCucComponent implements OnInit {
  constructor(
    private _modalRef: NzModalRef,
    private fb: FormBuilder,
    public globals: Globals,
    private modal: NzModalService,
  ) {}

  ngOnInit(): void {
    this.listOfMapData.forEach((item) => {
      this.mapOfExpandedData[item.key] = this.convertTreeToList(item);
    });
  }

  save() {
    this._modalRef.close();
  }

  huy() {
    this._modalRef.destroy();
  }
  listOfMapData: TreeNodeInterface[] = [
    {
      key: `1`,
      name: 'Cục DTNNKV Hoàng Liên Sơn',
      age: 60,
      address: '',
      children: [
        {
          key: `1-1`,
          name: 'Chi cục DTNNKV Tuyên Quang',
          age: 42,
          address: 'New York No. 2 Lake Park',
        },
        {
          key: `1-2`,
          name: 'Chi cục DTNNKV Tuyên Quang',
          age: 30,
          address: 'Chi cục DTNNKV Tuyên Quang',
          children: [
            {
              key: `1-2-1`,
              name: '010101',
              age: 16,
              address: 'Chi cục DTNNKV Tuyên Quang',
            },
          ],
        },
        {
          key: `1-3`,
          name: 'Cục DTNNKV Vĩnh Phú',
          age: 72,
          address: 'Cục DTNNKV Vĩnh Phú',
          children: [
            {
              key: `1-3-1`,
              name: '010102',
              age: 42,
              address: 'Chi cục DTNNKV Tuyên Quang',
            },
          ],
        },
      ],
    },
  ];
  mapOfExpandedData: { [key: string]: TreeNodeInterface[] } = {};

  collapse(
    array: TreeNodeInterface[],
    data: TreeNodeInterface,
    $event: boolean,
  ): void {
    if (!$event) {
      if (data.children) {
        data.children.forEach((d) => {
          const target = array.find((a) => a.key === d.key)!;
          target.expand = false;
          this.collapse(array, target, false);
        });
      } else {
        return;
      }
    }
  }

  convertTreeToList(root: TreeNodeInterface): TreeNodeInterface[] {
    const stack: TreeNodeInterface[] = [];
    const array: TreeNodeInterface[] = [];
    const hashMap = {};
    stack.push({ ...root, level: 0, expand: false });

    while (stack.length !== 0) {
      const node = stack.pop()!;
      this.visitNode(node, hashMap, array);
      if (node.children) {
        for (let i = node.children.length - 1; i >= 0; i--) {
          stack.push({
            ...node.children[i],
            level: node.level! + 1,
            expand: false,
            parent: node,
          });
        }
      }
    }

    return array;
  }

  visitNode(
    node: TreeNodeInterface,
    hashMap: { [key: string]: boolean },
    array: TreeNodeInterface[],
  ): void {
    if (!hashMap[node.key]) {
      hashMap[node.key] = true;
      array.push(node);
    }
  }
  capNhat() {
    const modalLuongThuc = this.modal.create({
      nzTitle: '',
      nzContent: DialogCanhBaoComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '400px',
      nzFooter: null,
      nzComponentParams: {},
    });
    modalLuongThuc.afterClose.subscribe((luongThuc) => {});
  }
}
