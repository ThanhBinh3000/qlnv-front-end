import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MESSAGE } from 'src/app/constants/message';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';

@Component({
    selector: 'dialog-mua-hang-dtqg',
    templateUrl: './dialog-mua-hang-dtqg.component.html',
    styleUrls: ['./dialog-mua-hang-dtqg.component.scss'],
})
export class DialogMuaHangDtqgComponent implements OnInit {
    @Input() obj: any;

    loaiVons: any = [
        {
            id: 1,
            tenDm: "Vốn mua",
        },
        {
            id: 2,
            tenDm: "Vốn bán",
        },
        {
            id: 3,
            tenDm: "Vốn ứng",
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
    donViTinhs: any = [];

    dviTiens: any = [];
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
        this.danhMucService.dMDonViTien().toPromise().then(
            (data) => {
                if (data.statusCode == 0) {
                    this.dviTiens = data.data?.content;
                } else {
                    this.notification.error(MESSAGE.ERROR, data?.msg);
                }
            },
            (err) => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
            }
        );
    }

    handleOk() {
        this._modalRef.close(this.obj);
    }

    handleCancel() {
        this._modalRef.close();
    }
}
[]