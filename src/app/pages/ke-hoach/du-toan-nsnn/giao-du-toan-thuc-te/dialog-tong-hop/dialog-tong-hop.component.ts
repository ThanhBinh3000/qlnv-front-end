import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import * as dayjs from 'dayjs';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { GiaoDuToanChiService } from 'src/app/services/quan-ly-von-phi/giaoDuToanChi.service';
import { UserService } from 'src/app/services/user.service';

@Component({
    selector: 'app-dialog-tong-hop',
    templateUrl: './dialog-tong-hop.component.html',
    styleUrls: ['./dialog-tong-hop.component.scss']
})

export class DialogTongHopComponent implements OnInit {
    @Input() obj

    userInfo: any;
    response: any = {
        namHienTai: null,
        maDvi: null,
        lstCtietBcao: [],
        lstDviTrucThuoc: [],
        maBcao: null,
        loai: null,
        maPa: null,
        maPaCha: null,
        idSoTranChi: null,
    };

    lstLoaiPa = [
        {
            id: "1",
            tenDm: 'Phương án phân bổ giao dự toán chi',
        },
        {
            id: "2",
            tenDm: 'Phương án giao, điều chỉnh dự toán chi',
        }
    ]
    lstNam: number[] = [];
    lstPa: any[] = [];
    lstPaLoai: any[] = [];
    checkReport: boolean;


    constructor(
        private _modalRef: NzModalRef,
        private userService: UserService,
        private giaoDuToanChiService: GiaoDuToanChiService,
        private spinner: NgxSpinnerService,
        private datePipe: DatePipe,
        private notification: NzNotificationService,
    ) { }

    async ngOnInit() {
        this.userInfo = this.userService.getUserLogin();
        this.response.maDvi = this.userInfo?.MA_DVI;

        const thisYear = dayjs().get('year');
        for (let i = -5; i < 10; i++) {
            this.lstNam.push(thisYear + i);
        }
    }
    // tong hop theo ma phuong an
    async tongHopPa() {
        const request = {
            maPa: this.response.maPa,
            maDvi: this.obj.maDvi,
            namPa: this.response.namHienTai,
            maLoaiDan: this.response.loai,
        }
        this.spinner.show();
        await this.giaoDuToanChiService.tongHopGiaoThucTe(request).toPromise().then(
            (data) => {
                if (data.statusCode == 0) {
                    this.response.lstCtietBcao = data.data.lstPa;
                    this.response.lstDviTrucThuoc = data.data.lstGiaoDtoanDviTrucThuocs;
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

    changeModel() {
        this.getListPA();
    }



    //lay danh sach cac phuong an co the tong hop lai
    async getListPA() {
        this.spinner.show()
        const requestReport = {
            maDvi: this.obj.maDvi,
            namPa: this.response.namHienTai
        };
        await this.giaoDuToanChiService.dsPaTongHopGiao(requestReport).toPromise().then(res => {
            if (res.statusCode == 0) {
                this.lstPa = res.data;
            } else {
                this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
            }
        }, err => {
            this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        })
        this.spinner.hide()
    }

    changeLoai() {
        let lstPaTemp = []
        this.lstPaLoai = []
        lstPaTemp = this.lstPa.filter(s => s.maLoaiDan == this.response.loai);
        if (this.userInfo.CAP_DVI == "1") {
            lstPaTemp.forEach(s => {
                this.lstPaLoai.push(
                    {
                        maPa: s.maPaCha
                    }
                )
            })
        } else {
            lstPaTemp.forEach(s => {
                this.lstPaLoai.push(
                    {
                        maPa: s.maPa
                    }
                )
            })
        }
        const lstClone = []
        this.lstPaLoai.forEach(item => {
            lstClone.push(item.maPa)
        })
        const set2 = new Set(lstClone);
        this.lstPaLoai = [];
        set2.forEach(itm => {
            this.lstPaLoai.push(
                {
                    maPa: itm
                }
            )
        })
    }

    async handleOk() {
        if (!this.response.loai) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
            return;
        } else {
            if ((this.response.loai == 1 && !this.response.maPa) || (this.response.loai == 2 && !this.response.namHienTai)) {
                this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
                return;
            }
        }
        await this.tongHopPa();
        if (this.response.lstDviTrucThuoc?.length == 0) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOT_EXIST_REPORT);
            return;
        }

        let maBcao
        await this.giaoDuToanChiService.SinhMaBaoCao().toPromise().then(
            (res) => {
                if (res.statusCode == 0) {
                    maBcao = res.data;
                } else {
                    this.notification.error(MESSAGE.ERROR, res?.msg);
                    return;
                }
            },
            (err) => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
                return;
            },
        );

        const request1 = {
            id: null,
            fileDinhKems: [],
            listIdDeleteFiles: [],
            lstGiaoDtoanTrucThuocs: this.response.lstDviTrucThuoc,
            lstCtiets: this.response.lstCtietBcao,
            maDvi: this.response.maDvi,
            maDviTien: "1",
            maBcao: maBcao,
            maPa: this.response.maPa,
            maPaCha: this.response.maPaCha,
            namPa: this.response.namHienTai,
            // soQd: null,
            maPhanGiao: "2",
            maLoaiDan: '1',
            trangThai: "1",
            thuyetMinh: "",
            idPaBTC: null,
            tabSelected: 'addBaoCao',
        };

        const request2 = {
            id: null,
            fileDinhKems: [],
            listIdDeleteFiles: [],
            lstGiaoDtoanTrucThuocs: this.response.lstDviTrucThuoc,
            lstCtiets: this.response.lstCtietBcao,
            maDvi: this.response.maDvi,
            maDviTien: "1",
            maBcao: maBcao,
            maPa: this.response.maPa,
            maPaCha: this.response.maPaCha,
            namPa: this.response.namHienTai,
            // soQd: null,
            maPhanGiao: "2",
            maLoaiDan: '2',
            trangThai: "1",
            thuyetMinh: "",
            idPaBTC: null,
            tabSelected: 'addBaoCao',
        };

        if (this.response.loai == "1") {
            this._modalRef.close(request1);
        }
        if (this.response.loai == "2") {
            this._modalRef.close(request2);
        }
    }

    handleCancel() {
        this._modalRef.close();
    }
}
