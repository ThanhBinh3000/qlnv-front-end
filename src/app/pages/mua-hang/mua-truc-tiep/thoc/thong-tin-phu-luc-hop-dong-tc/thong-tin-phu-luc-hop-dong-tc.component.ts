import { DialogChiTietQuyetDinhKhMuaTrucTiepComponent } from '../../../../../components/dialog/dialog-chi-tiet-quyet-dinh-ke-hoach-mua-truc-tiep/dialog-chi-tiet-quyet-dinh-ke-hoach-mua-truc-tiep.component';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Router } from '@angular/router';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Globals } from 'src/app/shared/globals';
import { DialogChiTietQuyetDinhGiaNhapComponent } from 'src/app/components/dialog/dialog-chi-tiet-quyet-dinh-gia-nhap/dialog-chi-tiet-quyet-dinh-gia-nhap.component';

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
  selector: 'thong-tin-phu-luc-hop-dong-tc',
  templateUrl: './thong-tin-phu-luc-hop-dong-tc.component.html',
  styleUrls: ['./thong-tin-phu-luc-hop-dong-tc.component.scss'],
})
export class ThongTinPhuLucHopDongTCComponent implements OnInit {
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
  constructor(
    public globals: Globals,
    private router: Router,
    private modal: NzModalService,
  ) {}

  ngOnInit(): void {
    this.listOfMapData.forEach((item) => {
      this.mapOfExpandedData[item.key] = this.convertTreeToList(item);
    });
  }
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
  back() {
    this.router.navigate([
      '/mua-hang/mua-truc-tiep/thoc/quyet-dinh-gia-nhap-tc',
    ]);
  }
  huyBo() {}
  themMoi() {
    const modalLuongThuc = this.modal.create({
      nzTitle: 'Chi tiết quyết định giá nhập',
      nzContent: DialogChiTietQuyetDinhGiaNhapComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {},
    });
    modalLuongThuc.afterClose.subscribe((res) => {
      if (res) {
      }
    });
  }
}
