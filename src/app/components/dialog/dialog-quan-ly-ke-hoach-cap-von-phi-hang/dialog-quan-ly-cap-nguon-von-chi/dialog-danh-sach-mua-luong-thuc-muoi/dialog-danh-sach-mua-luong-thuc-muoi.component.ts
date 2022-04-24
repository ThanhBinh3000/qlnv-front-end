import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { Utils } from 'src/app/Utility/utils';

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
      selector: 'dialog-danh-sach-mua-luong-thuc-muoi',
      templateUrl: './dialog-danh-sach-mua-luong-thuc-muoi.component.html',
      styleUrls: ['./dialog-danh-sach-mua-luong-thuc-muoi.component.scss'],
})
export class DialogDanhSachMuaLuongThucMuoiComponent implements OnInit {
      @Input() maGoiThau: any;

      tuNgayQd!: string;
      denNgayQd!: string;
      tuNgayKyHd!: string;
      denNgayKyHd!: string;
      totalPages: number = 0;
      totalElements: number = 0;

      pages = {
            size: 10,
            page: 1,
      };

      lstHopDong: HopDong[] = [
            {
                  id: 1,
                  checked: false,
                  maHd: "112/HD-MBG",
                  tenHd: "Hợp đồng mua Gạo",
                  maGoiThau: "HST-120/BTC-HS",
                  ngayHd: "1/02/2021",
                  gtriHd: 5700000000,
            },
            {
                  id: 2,
                  checked: false,
                  maHd: "117/HD-MBG",
                  tenHd: "Hợp đồng mua Gạo",
                  maGoiThau: "HST-120/BTC-HS",
                  ngayHd: "7/02/2021",
                  gtriHd: 345888000,
            },
            {
                  id: 3,
                  checked: false,
                  maHd: "102/HD-MBG",
                  tenHd: "Hợp đồng mua Gạo",
                  maGoiThau: "HST-120/BTC-HS",
                  ngayHd: "2/02/2021",
                  gtriHd: 1200450000,
            },
            {
                  id: 4,
                  checked: false,
                  maHd: "122/HD-MBG",
                  tenHd: "Hợp đồng mua Gạo",
                  maGoiThau: "HST-120/BTC-HS",
                  ngayHd: "12/02/2021",
                  gtriHd: 201444000,
            },
      ];

      lstCTietBCao: HopDong[] = [];
      constructor(
            private _modalRef: NzModalRef,
            private notification: NzNotificationService,
            private spinner: NgxSpinnerService,
            private quanLyVonPhiService: QuanLyVonPhiService,
            private datePipe: DatePipe,
      ) { }

      async ngOnInit() {

      }

      getDetailReport() {
            this.spinner.show();

            let request = {
                  //maDvi: this.searchFilter.maDviTao,
                  tuNgayQd: this.datePipe.transform(this.tuNgayQd, Utils.FORMAT_DATE_STR),
                  denNgayQd: this.datePipe.transform(this.denNgayQd, Utils.FORMAT_DATE_STR),
                  tuNgayKyHd: this.datePipe.transform(this.tuNgayKyHd, Utils.FORMAT_DATE_STR),
                  denNgayKyHd: this.datePipe.transform(this.denNgayKyHd, Utils.FORMAT_DATE_STR),
                  paggingReq: {
                        limit: this.pages.size,
                        page: this.pages.page,
                  },
            }

            this.quanLyVonPhiService.timkiemDieuChinh(request).toPromise().then(
                  (data) => {
                        if (data.statusCode == 0) {
                              this.lstCTietBCao = data.data.content;
                              this.totalElements = data.data.totalElements;
                              this.totalPages = data.data.totalPages;

                        } else {
                              this.notification.error(MESSAGE.ERROR, data?.msg);
                        }
                  },
                  (err) => {
                        this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
                  }
            );
            this.spinner.hide();
      }

      updateLstHopDong(){
            this.lstCTietBCao.forEach(item => {
                  var index: number = this.lstHopDong.findIndex(e => e.maHd === item.maHd);
                  if (index == -1){
                        this.lstHopDong.push(item);
                  } else {
                        this.lstHopDong[index].checked = item.checked;
                  }
            })
      }

      //doi so trang
      onPageIndexChange(page) {
            this.pages.page = page;
            this.getDetailReport();
            this.updateLstHopDong();
      }

      //doi so luong phan tu tren 1 trang
      onPageSizeChange(size) {
            this.pages.size = size;
            this.getDetailReport();
            this.updateLstHopDong();
      }

      handleOk() {
            this.updateLstHopDong();
            this._modalRef.close(this.lstHopDong);
      }

      handleCancel() {
            this._modalRef.close();
      }
}
[]