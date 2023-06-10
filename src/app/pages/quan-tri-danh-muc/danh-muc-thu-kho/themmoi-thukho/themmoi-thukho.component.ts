import { Component, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-themmoi-thukho',
  templateUrl: './themmoi-thukho.component.html',
  styleUrls: ['./themmoi-thukho.component.scss']
})
export class ThemmoiThukhoComponent implements OnInit {

  data: any;
  dataTree: any[] = [];

  constructor(
    private _modalRef: NzModalRef,

  ) { }

  ngOnInit(): void {
    this.data = this.dataTree[0];
    this.dataTree = this.data.children;
    console.log("🚀 ~ this.dataTree:", this.dataTree)
  }

  onExpandChange(item: any, checked: boolean): void {
    item.expandSet = checked
  }


  handleCancel() {
    this._modalRef.close();
  }

  handleOk() {
    console.log(this.setOfCheckedId);
    this._modalRef.close();
  }

  checked = false;
  indeterminate = false;
  setOfCheckedId = new Set<number>();

  onItemChecked(dataChecked: any, checked: boolean): void {
    this.updateCheckedSet(dataChecked, checked);
  }

  updateCheckedSet(dataChecked: any, checked: boolean): void {
    if (checked) {
      this.addChildren(dataChecked, dataChecked.capDvi, true);
    } else {
      // this.setOfCheckedId.delete(dataChecked.maDvi);
      this.addChildren(dataChecked, dataChecked.capDvi, false);
    }
  }

  addChildren(data: any, level: string, isAdd: boolean) {
    switch (level) {
      // Cấp ngăn kho
      case '6':
        this.setOfCheckedId.add(data.maDvi);
        // Add toàn bộ cấp 7 ( Lô Kho ).
        data.children.forEach(element => {
          isAdd ? this.setOfCheckedId.add(element.maDvi) : this.setOfCheckedId.delete(element.maDvi);
        });
        break;
      case '7':
        isAdd ? this.setOfCheckedId.add(data.maDvi) : this.setOfCheckedId.delete(data.maDvi);
    }
    console.log(this.setOfCheckedId);
  }

}
