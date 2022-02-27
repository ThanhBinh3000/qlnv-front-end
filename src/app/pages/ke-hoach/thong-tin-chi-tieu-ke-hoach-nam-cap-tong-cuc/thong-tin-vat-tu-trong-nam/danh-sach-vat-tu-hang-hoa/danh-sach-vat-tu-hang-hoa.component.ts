import { Component, OnInit } from '@angular/core';
import { MOCK_LIST } from './danh-sach-vat-tu-hang-hoa.constant';
import { TreeNodeInterface, VatTu } from './danh-sach-vat-tu-hang-hoa.type';

@Component({
  selector: 'app-danh-sach-vat-tu-hang-hoa',
  templateUrl: './danh-sach-vat-tu-hang-hoa.component.html',
  styleUrls: ['./danh-sach-vat-tu-hang-hoa.component.scss'],
})
export class DanhSachVatTuHangHoaComponent implements OnInit {
  //treeview
  listOfMapData: VatTu[] = MOCK_LIST;
  mapOfExpandedData: { [key: string]: VatTu[] } = {};

  constructor() {}

  ngOnInit(): void {
    //treeview
    this.listOfMapData.forEach((item) => {
      this.mapOfExpandedData[item.key] = this.convertTreeToList(item);
    });
  }

  //treeview func
  convertTreeToList(root: VatTu): VatTu[] {
    const stack: VatTu[] = [];
    const array: VatTu[] = [];
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
    node: VatTu,
    hashMap: { [key: string]: boolean },
    array: VatTu[],
  ): void {
    if (!hashMap[node.key]) {
      hashMap[node.key] = true;
      array.push(node);
    }
  }

  collapse(array: VatTu[], data: VatTu, $event: boolean): void {
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
}
