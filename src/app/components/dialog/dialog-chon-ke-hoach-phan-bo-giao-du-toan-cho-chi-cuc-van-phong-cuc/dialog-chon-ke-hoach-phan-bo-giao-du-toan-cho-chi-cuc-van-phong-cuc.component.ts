import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-dialog-chon-ke-hoach-phan-bo-giao-du-toan-cho-chi-cuc-van-phong-cuc',
  templateUrl: './dialog-chon-ke-hoach-phan-bo-giao-du-toan-cho-chi-cuc-van-phong-cuc.component.html',
  styleUrls: ['./dialog-chon-ke-hoach-phan-bo-giao-du-toan-cho-chi-cuc-van-phong-cuc.component.scss']
})
export class DialogChonKeHoachPhanBoGiaoDuToanChoChiCucVanPhongCucComponent implements OnInit {
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
