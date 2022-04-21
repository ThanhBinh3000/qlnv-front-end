import { Component, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
export interface TreeNodeInterface {
  key: string;
  name: string;
  age?: string;
  level?: number;
  expand?: boolean;
  address?: string;
  children?: TreeNodeInterface[];
  parent?: TreeNodeInterface;
}
@Component({
  selector: 'dialog-danh-sach-chi-tiet-ngan-kho',
  templateUrl: './dialog-danh-sach-chi-tiet-ngan-kho.component.html',
  styleUrls: ['./dialog-danh-sach-chi-tiet-ngan-kho.component.scss'],
})
export class DialogDanhSachChiTietNganKhoComponent implements OnInit {
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 0;
  dataTable: any[] = [];
  text: string = '';
  listOfMapData: TreeNodeInterface[] = [
    {
      key: `1`,
      name: 'Nhà kho A1',
      age: '0102010101',
      address: '',
      children: [
        {
          key: `1-1`,
          name: 'Ngăn kho A1/1',
          age: '010201010101',
          address: '',
        },
        {
          key: `1-2`,
          name: 'Ngăn kho A1/2',
          age: '010201010101',
          address: '',
          children: [
            {
              key: `1-2-1`,
              name: 'Lô số 1 Ngăn kho A1/1',
              age: '0102010101010101',
              address: '',
            },
          ],
        },
        // {
        //   key: `1-3`,
        //   name: 'Jim Green sr.',
        //   age: '72',
        //   address: 'London No. 1 Lake Park',
        //   children: [
        //     {
        //       key: `1-3-1`,
        //       name: 'Jim Green',
        //       age: '42',
        //       address: 'London No. 2 Lake Park',
        //       children: [
        //         {
        //           key: `1-3-1-1`,
        //           name: 'Jim Green jr.',
        //           age: '25',
        //           address: 'London No. 3 Lake Park',
        //         },
        //         {
        //           key: `1-3-1-2`,
        //           name: 'Jimmy Green sr.',
        //           age: '18',
        //           address: 'London No. 4 Lake Park',
        //         },
        //       ],
        //     },
        //   ],
        // },
      ],
    },
    // {
    //   key: `2`,
    //   name: 'Joe Black',
    //   age: '32',
    //   address: 'Sidney No. 1 Lake Park',
    // },
  ];
  mapOfExpandedData: { [key: string]: TreeNodeInterface[] } = {};
  constructor(
    private _modalRef: NzModalRef,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
  ) {}
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

  async ngOnInit() {
    this.listOfMapData.forEach((item) => {
      this.mapOfExpandedData[item.key] = this.convertTreeToList(item);
    });
    this.spinner.show();
    try {
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  onCancel() {
    this._modalRef.destroy();
  }
  save() {
    this._modalRef.close();
  }
}
