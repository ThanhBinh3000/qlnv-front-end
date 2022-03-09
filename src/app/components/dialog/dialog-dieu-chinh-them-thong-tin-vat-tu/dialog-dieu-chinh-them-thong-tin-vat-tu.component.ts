import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { MOCK_LIST } from 'src/app/pages/ke-hoach/thong-tin-chi-tieu-ke-hoach-nam-cap-tong-cuc/thong-tin-vat-tu-trong-nam/danh-sach-vat-tu-hang-hoa/danh-sach-vat-tu-hang-hoa.constant';
import { VatTu } from 'src/app/pages/ke-hoach/thong-tin-chi-tieu-ke-hoach-nam-cap-tong-cuc/thong-tin-vat-tu-trong-nam/danh-sach-vat-tu-hang-hoa/danh-sach-vat-tu-hang-hoa.type';

@Component({
  selector: 'dialog-dieu-chinh-them-thong-tin-vat-tu',
  templateUrl: './dialog-dieu-chinh-them-thong-tin-vat-tu.component.html',
  styleUrls: ['./dialog-dieu-chinh-them-thong-tin-vat-tu.component.scss'],
})
export class DialogDieuChinhThemThongTinVatTuComponent implements OnInit {
  formData: FormGroup;
  //treeview
  listOfMapData: VatTu[] = MOCK_LIST;
  mapOfExpandedData: { [key: string]: VatTu[] } = {};

  constructor(private fb: FormBuilder, private _modalRef: NzModalRef) { }

  ngOnInit(): void {
    this.formData = this.fb.group({
      maDv: [null, [Validators.required]],
      tenDv: [null],
      maHangHoa: [{ value: null, disabled: true }, [Validators.required]],
      tenHangHoa: [null],
      donViTinh: [null],
      soLuongTruoc: [null],
      soLuongGiam: [null],
      soLuongTang: [null],
      soLuongSau: [null],
      tongSo: [null],
      soLuongTheoNam1: [null],
      soLuongTheoNam2: [null],
      soLuongTheoNam3: [null],
    });
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

  handleOk() {
    this._modalRef.close();
  }

  handleCancel() {
    this._modalRef.close();
  }
}
