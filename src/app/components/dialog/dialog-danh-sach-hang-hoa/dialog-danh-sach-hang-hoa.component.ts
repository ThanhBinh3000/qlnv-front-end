import { MESSAGE } from './../../../constants/message';
import { DanhMucService } from '../../../services/danhmuc.service';
import { VatTu } from './../dialog-them-thong-tin-vat-tu-trong-nam/danh-sach-vat-tu-hang-hoa.type';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'dialog-danh-sach-hang-hoa',
  templateUrl: './dialog-danh-sach-hang-hoa.component.html',
  styleUrls: ['./dialog-danh-sach-hang-hoa.component.scss'],
})
export class DialogDanhSachHangHoaComponent implements OnInit {
  data: any;
  radioValue: string = 'trung';
  listOfMapData: VatTu[];
  listOfMapDataClone: VatTu[];
  mapOfExpandedData: { [key: string]: VatTu[] } = {};
  isCaseSpecial: boolean = false;
  onlyLuongThuc: boolean = false;
  onlyVatTu: boolean = false;
  options = {
    luongThuc: false,
    muoi: false,
    vatTu: false,
  };

  constructor(
    private _modalRef: NzModalRef,
    private danhMucService: DanhMucService,
  ) { }

  ngOnInit(): void {
    this.loadDanhMucHang();
  }

  handleOk() {
    this._modalRef.close();
  }

  handleCancel() {
    this._modalRef.close();
  }

  loadDanhMucHang() {
    this.danhMucService.loadDanhMucHangHoa().subscribe((hangHoa) => {
      if (hangHoa.msg == MESSAGE.SUCCESS) {
        if (this.data) {
          this.listOfMapData = hangHoa.data.filter(item => item.ma == this.data.slice(0, 2));
        } else {
          if (this.onlyLuongThuc) {
            this.listOfMapData = hangHoa.data.filter(item => item.ma != "02");
          } else if (this.onlyVatTu) {
            this.listOfMapData = hangHoa.data.filter(item => item.ma == "02");
          } else {
            this.listOfMapData = hangHoa.data;
          }
        }
        this.listOfMapDataClone = [...this.listOfMapData];
        this.listOfMapData.forEach((item) => {
          // Với TH là thóc và gạo
          if (this.data && this.data.length > 2) {
            item.child = item.child.filter(item => item.ma == this.data);
          }
          if (this.isCaseSpecial) {
            item.child.forEach(item => {
              if (item.ma.startsWith("02")) {
                item.child = [];
              }
            })
          }
          this.mapOfExpandedData[item.id] = this.convertTreeToList(item);
        });
      }
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
      if (node.child) {
        for (let i = node.child.length - 1; i >= 0; i--) {
          stack.push({
            ...node.child[i],
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
    hashMap: { [id: string]: boolean },
    array: VatTu[],
  ): void {
    if (!hashMap[node.id]) {
      hashMap[node.id] = true;
      array.push(node);
    }
  }

  collapse(array: VatTu[], data: VatTu, $event: boolean): void {
    if (!$event) {
      if (data.child) {
        data.child.forEach((d) => {
          const target = array.find((a) => a.id === d.id)!;
          target.expand = false;
          this.collapse(array, target, false);
        });
      } else {
        return;
      }
    }
  }

  search(e: Event) {
    const value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.listOfMapData = this.listOfMapDataClone;
    } else {
      this.listOfMapData = this.listOfMapDataClone.filter(
        (x) => x.ten.toLowerCase().indexOf(value.toLowerCase()) != -1,
      );
    }
  }

  selectHangHoa(vatTu: any) {
    this._modalRef.close(vatTu);
  }
}
