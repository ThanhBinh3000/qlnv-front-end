import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
    selector: 'dialog-lua-chon-them-don-vi',
    templateUrl: './dialog-lua-chon-them-don-vi.component.html',
    styleUrls: ['./dialog-lua-chon-them-don-vi.component.scss'],
})
export class DialogLuaChonThemDonViComponent implements OnInit {
    @Input() danhSachDonVi: any;

    donVis: any[] = [];

    constructor(
        private _modalRef: NzModalRef,
    ) { }

    async ngOnInit() {
        this.danhSachDonVi.forEach(item => {
            this.donVis.push({
                ...item,
                status: false,
            })
        })
    }

    handleOk() {
        this._modalRef.close(this.donVis.filter(item => item.status == true));
    }

    handleCancel() {
        this._modalRef.close();
    }
}
[]