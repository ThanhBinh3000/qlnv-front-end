import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
    selector: 'dialog-chon-danh-muc',
    templateUrl: './dialog-chon-danh-muc.component.html',
    styleUrls: ['./dialog-chon-danh-muc.component.scss'],
})
export class DialogChonDanhMucComponent implements OnInit {
    @Input() obj: any;

    ma: string;
    lstDanhMuc: any[] = [];
    lstParent: any[] = [];
    lstChild: any[] = [];

    constructor(
        private _modalRef: NzModalRef,
    ) { }

    async ngOnInit() {
        this.ma = this.obj.ma;
        this.obj.lstDanhMuc.forEach(item => {
            this.lstDanhMuc.push({
                ...item,
                status: false,
            })
        })
        if (!this.ma) {
            this.ma = this.lstDanhMuc.find(e => e.level == 0).ma;
            this.lstParent = this.lstDanhMuc.filter(e => e.level == 0);
        } else {
            this.lstParent = this.lstDanhMuc.filter(e => this.getHead(e.ma) == this.getHead(this.ma));
        }
        this.changeModel();
    }

    changeModel() {
        this.lstChild = this.lstDanhMuc.filter(e => this.getHead(e.ma) == this.ma);
    }

    getHead(str: string): string {
        return str.substring(0, str.lastIndexOf('.'));
    }

    handleOk() {
        let data: any = {
            ma: this.ma,
            lstDanhMuc: this.lstChild.filter(e => e.status == true),
        }
        this._modalRef.close(data);
    }

    handleCancel() {
        this._modalRef.close();
    }
}
[]