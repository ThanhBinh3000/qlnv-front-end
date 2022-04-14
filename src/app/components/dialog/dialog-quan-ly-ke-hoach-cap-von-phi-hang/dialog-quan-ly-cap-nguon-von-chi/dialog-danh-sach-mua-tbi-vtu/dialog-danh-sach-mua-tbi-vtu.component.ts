import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MESSAGE } from 'src/app/constants/message';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';

export class HopDong {
      id!: any;
      checked!: boolean;
      maHd!: string;
      tenHd!: string;
      maGoiThau!: string;
      ngayHd!: string;
      gtriHd!: number;
    }

@Component({
      selector: 'dialog-danh-sach-mua-tbi-vtu',
      templateUrl: './dialog-danh-sach-mua-tbi-vtu.component.html',
      styleUrls: ['./dialog-danh-sach-mua-tbi-vtu.component.scss'],
})
export class DialogDanhSachMuaTbiVtuComponent implements OnInit {
      @Input() maGoiThau: any;

      tuNgayQd!: string;
      denNgayQd!: string;
      tuNgayKyHd!: string;
      denNgayKyHd!: string;

      lstHopDong: HopDong[] = [
            {
                  id: 1,
                  checked: false,
                  maHd: "112/HD-MBG",
                  tenHd: "Hợp đồng mua vật tư, thiết bị",
                  maGoiThau: "HST-120/BTC-HS",
                  ngayHd: "1/02/2021",
                  gtriHd: 5700000000,
            },
            {
                  id: 2,
                  checked: false,
                  maHd: "117/HD-MBG",
                  tenHd: "Hợp đồng mua vật tư, thiết bị",
                  maGoiThau: "HST-120/BTC-HS",
                  ngayHd: "7/02/2021",
                  gtriHd: 345888000,
            },
            {
                  id: 3,
                  checked: false,
                  maHd: "102/HD-MBG",
                  tenHd: "Hợp đồng mua vật tư, thiết bị",
                  maGoiThau: "HST-120/BTC-HS",
                  ngayHd: "2/02/2021",
                  gtriHd: 1200450000,
            },
            {
                  id: 4,
                  checked: false,
                  maHd: "122/HD-MBG",
                  tenHd: "Hợp đồng mua vật tư, thiết bị",
                  maGoiThau: "HST-120/BTC-HS",
                  ngayHd: "12/02/2021",
                  gtriHd: 201444000,
            },
      ];
      constructor(
            private _modalRef: NzModalRef,
            private danhMucService: DanhMucHDVService,
            private notification: NzNotificationService,
      ) { }

      async ngOnInit() {
            
      }

      handleOk() {
            this._modalRef.close(this.lstHopDong);
      }

      handleCancel() {
            this._modalRef.close();
      }
}
[]