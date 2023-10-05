import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { NzModalRef } from "ng-zorro-antd/modal";

@Component({
    selector: 'app-tree-select',
    templateUrl: './tree-select.component.html',
    styleUrls: ['./tree-select.component.scss'],
})
export class TreeSelectSapNhapComponent implements OnInit {
    treeData: any[] = [];
    isView: boolean = false;
    searchValue: string = "";
    constructor(
        private _modalRef: NzModalRef,
    ) {
    }

    ngOnInit(): void {
    }
    handleOk(item: any) {
        if (!item.origin.isLeaf) {
            item.isSelectable = false;
            item.isExpanded = !item.isExpanded;
        } else {
            this._modalRef.close(item);
        }
    }

    onCancel() {
        this._modalRef.close();
    }

}
