import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MESSAGE } from 'src/app/constants/message';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';

@Component({
    selector: 'dialog-mua-luong-thuc-muoi',
    templateUrl: './dialog-mua-luong-thuc-muoi.component.html',
    styleUrls: ['./dialog-mua-luong-thuc-muoi.component.scss'],
})
export class DialogMuaLuongThucMuoiComponent implements OnInit {
    @Input() obj: any;

    nguonHangs: any = [
        {
            id: 1,
            tenDm: "Dự trữ đầu năm",
        },
        {
            id: 2,
            tenDm: "Bố sung",
        },
        {
            id: 3,
            tenDm: "Mua ngoài thị trường",
        },
        {
            id: 4,
            tenDm: "Viện trợ",
        },
    ];
    matHangs: any = [
        {
            id: 1,
            tenDm: "Muối",
        },
        {
            id: 2,
            tenDm: "Gạo",
        },
    ];
    hinhThucs: any = [
        {
            id: 1,
            tenDm: "Chuyển sang",
        },
        {
            id: 2,
            tenDm: "Tái nhập",
        },
        {
            id: 3,
            tenDm: "Mua",
        },
        {
            id: 4,
            tenDm: "Miễn phí",
        },
    ];
    donViTinhs: any = [];

    donVis: any = [];
    constructor(
        private _modalRef: NzModalRef,
        private danhMucService: DanhMucHDVService,
        private notification: NzNotificationService,
    ) { }

    async ngOnInit() {
        // this.danhMucService.dMVatTu().toPromise().then(
        //     (data) => {
        //         if (data.statusCode == 0) {
        //             this.matHangs = data.data?.content;
        //         } else {
        //             this.notification.error(MESSAGE.ERROR, data?.msg);
        //         }
        //     },
        //     (err) => {
        //         this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
        //     }
        // );

        this.danhMucService.dMDviTinh().toPromise().then(
            (data) => {
                if (data.statusCode == 0) {
                    this.donViTinhs = data.data?.content;
                } else {
                    this.notification.error(MESSAGE.ERROR, data?.msg);
                }
            },
            (err) => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
            }
        );
    }

    changeModel(){
        this.obj.thanhTien = this.obj.soLuong * this.obj.giaTdaTthieu;
    }

    handleOk() {
        this._modalRef.close(this.obj);
    }

    handleCancel() {
        this._modalRef.close();
    }
}
[]