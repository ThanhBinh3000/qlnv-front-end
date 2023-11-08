import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
    selector: 'dialog-chon-loai-bao-quan',
    templateUrl: './dialog-chon-loai-bao-quan.component.html',
    // styleUrls: ['./dialog-them-khoan-muc.component.scss'],
})
export class DialogChonLoaiBaoQuanComponent implements OnInit {
    @Input() dsBaoQuan: any[];
    loaiBaoQuan: any;
    constructor(
        private _modalRef: NzModalRef,
    ) { }

    async ngOnInit() {
    }

    changeModel() {
    }

    handleOk() {
        this._modalRef.close(this.loaiBaoQuan);
    }

    handleCancel() {
        this._modalRef.close();
    }
}