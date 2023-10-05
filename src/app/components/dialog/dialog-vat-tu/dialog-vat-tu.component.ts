import { E } from '@angular/cdk/keycodes';
import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
    selector: 'dialog-vat-tu',
    templateUrl: './dialog-vat-tu.component.html',
    styleUrls: ['./dialog-vat-tu.component.scss'],
})
export class DialogThemVatTuComponent implements OnInit {
    @Input() obj: any;

    maKhoanMuc: any;
    lstKhoanMuc: any[] = [];
    lstParent: any[] = [];
    lstChild: any[] = [];

    constructor(
        private _modalRef: NzModalRef,
    ) { }

    async ngOnInit() {
        this.maKhoanMuc = this.obj.maKhoanMuc;
        this.obj.lstKhoanMuc.forEach(item => {
            this.lstKhoanMuc.push({
                ...item,
                status: false,
            })
        })
        this.lstKhoanMuc = this.obj.lstKhoanMuc;
        if (!this.maKhoanMuc) {
            this.maKhoanMuc = this.lstKhoanMuc.find(e => e.level == 0).id;
            this.lstParent = this.lstKhoanMuc.filter(e => e.level == 0);
        } else {
            var idCha: number = this.lstKhoanMuc.find(e => e.id == this.maKhoanMuc).idCha;
            this.lstParent = this.lstKhoanMuc.filter(e => e.idCha == idCha);
        }
        this.changeModel();
    }

    changeModel() {
        this.lstChild = this.lstKhoanMuc.filter(e => e.idCha == this.maKhoanMuc);
        if(this.obj.tab == '1' || this.obj.tab == '2'){
            this.lstChild = this.lstChild.filter(item => this.obj.baoCaos.findIndex(el => el.maNdung == item.id) == -1);
        }else if(this.obj.tab == '3'){
            this.lstChild = this.lstChild.filter(item => this.obj.baoCaos.findIndex(el => el.maDan == item.id) == -1);
        }else if(this.obj.tab == '4' || this.obj.tab == '5'){
            this.lstChild = this.lstChild.filter(item => this.obj.baoCaos.findIndex(el => el.maVtu == item.id) == -1);
        }else {
            this.lstChild = this.lstChild.filter(item => this.obj.baoCaos.findIndex(el => el.maNdungChi == item.id) == -1);
        }
    }

    handleOk() {
        let data: any = {
            maKhoanMuc: this.maKhoanMuc,
            lstKhoanMuc: this.lstChild.filter(e => e.status == true),
        }
        this._modalRef.close(data);
    }

    handleCancel() {
        this._modalRef.close();
    }
}
[]