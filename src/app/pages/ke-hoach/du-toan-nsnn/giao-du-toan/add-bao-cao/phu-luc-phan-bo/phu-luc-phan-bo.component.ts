import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { GiaoDuToanChiService } from 'src/app/services/quan-ly-von-phi/giaoDuToanChi.service';
import { UserService } from 'src/app/services/user.service';
import { displayNumber, exchangeMoney, sortByIndex, sumNumber } from 'src/app/Utility/func';
import { AMOUNT, DON_VI_TIEN, LA_MA } from 'src/app/Utility/utils';
import { NOI_DUNG } from './phu-luc-phan-bo.constant';

export class ItemData {
    id: string;
    stt: string;
    level: number;
    maNdung: number;
    tongCong: number;
    dtoanGiao: number;
    lstCtietDvis: ItemDvi[] = [];
    checked!: boolean;
}

export class ItemDvi {
    id: string;
    maDviNhan: string;
    soTranChi: number;
    trangThai: string;
}

@Component({
    selector: 'app-phu-luc-phan-bo',
    templateUrl: './phu-luc-phan-bo.component.html',
    styleUrls: ['../add-bao-cao.component.scss'],
})
export class PhuLucPhanBoComponent implements OnInit {
    @Input() dataInfo;

    isDataAvailable = false;
    editMoneyUnit = false;
    status = false;
    statusBtnFinish: boolean;
    statusBtnOk: boolean;
    statusPrint: boolean;
    donViTiens: any[] = DON_VI_TIEN;
    maDviTien = "1";
    lstDvi: any[] = [];
    donVis: any[] = [];
    capDvi: any;
    lstCtietBcao: ItemData[] = [];
    editCache: { [key: string]: { edit: boolean; data: ItemData } } = {};
    soLaMa: any[] = LA_MA;
    noiDungs: any[] = NOI_DUNG;
    thuyetMinh: string;
    maDvi: string;
    userInfo: any;
    formDetail: any;
    isSynthetic: any;
    amount = AMOUNT;
    total: ItemData = new ItemData();
    constructor(
        private modal: NzModalService,
        private _modalRef: NzModalRef,
        private danhMuc: DanhMucHDVService,
        private notification: NzNotificationService,
        private spinner: NgxSpinnerService,
        private giaoDuToanService: GiaoDuToanChiService,

    ) { }

    ngOnInit() {
        this.initialization().then(() => {
            this.isDataAvailable = true;
        })
    };

    async initialization() {
        this.spinner.show();
        this.maDvi = this.dataInfo.maDvi;
        // lấy danh sách đơn vị
        await this.danhMuc.dMDonVi().toPromise().then(
            (data) => {
                if (data.statusCode === 0) {
                    this.donVis = data?.data;
                    this.capDvi = this.donVis.find(e => e.maDvi == this.userInfo?.MA_DVI)?.capDvi;
                } else {
                    this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE)
                }
            }
        );

        this.formDetail = this.dataInfo?.data;
        this.status = this.dataInfo?.status;
        // this.status = false;
        this.statusBtnFinish = this.dataInfo?.statusBtnFinish;
        this.statusPrint = this.dataInfo?.statusBtnPrint;
        this.isSynthetic = this.dataInfo?.isSynthetic;
        this.statusBtnOk = this.dataInfo?.statusBtnOk;
        this.statusPrint = this.dataInfo?.statusBtnPrint;

        this.lstCtietBcao = this.dataInfo.data.lstCtietBcaos;
        if (this.isSynthetic && this.isSynthetic == true) {
            let lstDvi1 = this.donVis.filter(e => e?.maDviCha === this.maDvi);
            let lstDvi2 = []
            this.dataInfo.data?.lstCtietBcaos[0].lstCtietDvis.forEach(s => {
                const Dvi2 = lstDvi1.filter(v => v.maDvi === s.maDviNhan)[0]
                lstDvi2.push(Dvi2)
            })
            this.lstDvi = lstDvi2
        } else {
            this.lstDvi = this.donVis.filter(e => e?.maDvi === this.maDvi);
        }

        if (this.dataInfo?.extraData && this.dataInfo.extraData.length > 0) {
            this.dataInfo.extraData.forEach(item => {
                if (item.maNdung) {
                    const index = this.lstCtietBcao.findIndex(e => e.maNdung == item.maNdung);
                    this.lstCtietBcao[index].lstCtietDvis = item?.lstCtietDvis;
                }
            })
        }

        this.lstCtietBcao = sortByIndex(this.lstCtietBcao)

        this.lstCtietBcao.forEach(item => {
            if (item.maNdung) {
                const index = this.lstCtietBcao.findIndex(e => e.maNdung == item.maNdung);
                let tongCong = 0
                this.lstCtietBcao[index].lstCtietDvis.forEach(itm => {
                    tongCong += itm.soTranChi
                })
                this.lstCtietBcao[index].dtoanGiao = tongCong;
                this.sum(this.lstCtietBcao[index].stt)
            }
        })
        this.getTotal();
        this.getStatusButton();
        this.updateEditCache();
        this.spinner.hide();
    };

    getTail(str: string): number {
        return parseInt(str.substring(str.lastIndexOf('.') + 1, str.length), 10);
    }


    changeModel(id: string) {
        this.editCache[id].data.dtoanGiao = 0;
        this.editCache[id].data.lstCtietDvis.forEach(item => {
            this.editCache[id].data.dtoanGiao += item.soTranChi;
        })
    };

    getStatusButton() {
        if (this.dataInfo?.statusBtnOk && (this.formDetail.trangThai == "2" || this.formDetail.trangThai == "5")) {
            this.statusBtnOk = false;
        } else {
            this.statusBtnOk = true;
        }
    }

    startEdit(id: string): void {
        this.editCache[id].edit = true;
    }

    saveEdit(id: string): void {
        // set checked editCache = checked lstCtietBcao
        this.editCache[id].data.checked = this.lstCtietBcao.find(item => item.id === id).checked;
        // lay vi tri hang minh sua
        const index = this.lstCtietBcao.findIndex(item => item.id === id);
        const data: ItemDvi[] = [];

        // check dòng có số âm, chưa có dữ liệu
        let tongTranChi = 0;
        for (let itm of this.editCache[id].data.lstCtietDvis) {
            if (itm.soTranChi < 0) {
                this.notification.warning(MESSAGE.WARNING, 'giá trị nhập không được âm')
                return;
            }
            tongTranChi += itm.soTranChi;
        }
        if (tongTranChi == null) {
            this.notification.warning(MESSAGE.WARNING, 'Dòng chưa có dữ liệu, vui lòng nhập!')
            return;
        }

        this.editCache[id].data.lstCtietDvis.forEach(item => {
            data.push({
                id: item.id,
                maDviNhan: item.maDviNhan,
                soTranChi: item.soTranChi,
                trangThai: item.trangThai,
            })
        })
        this.lstCtietBcao[index] = {
            ...this.editCache[id].data,
            lstCtietDvis: data,
        }
        this.editCache[id].edit = false; // CHUYEN VE DANG TEXT
        this.sum(this.lstCtietBcao[index].stt);
        this.getTotal();
        this.updateEditCache();
    }

    sum(stt: string) {
        stt = this.getHead(stt);
        while (stt != '0') {
            const index = this.lstCtietBcao.findIndex(e => e.stt == stt);
            const data = this.lstCtietBcao[index];
            const mm: any[] = [];
            data.lstCtietDvis.forEach(item => {
                mm.push({
                    ...item,
                    soTranChi: 0,
                })
            });
            this.lstCtietBcao[index] = {
                id: data.id,
                stt: data.stt,
                level: data.level,
                maNdung: data.maNdung,
                tongCong: data.tongCong,
                dtoanGiao: data.dtoanGiao,
                lstCtietDvis: mm,
                checked: false,
            };
            this.lstCtietBcao.forEach(item => {
                if (this.getHead(item.stt) == stt) {
                    item.lstCtietDvis.forEach(e => {
                        const ind = this.lstCtietBcao[index].lstCtietDvis.findIndex(i => i.maDviNhan == e.maDviNhan);
                        this.lstCtietBcao[index].lstCtietDvis[ind].soTranChi += Number(e.soTranChi);
                    })
                }
            });
            this.lstCtietBcao[index].dtoanGiao = 0
            this.lstCtietBcao[index].lstCtietDvis.forEach(item => {
                this.lstCtietBcao[index].dtoanGiao += Number(item.soTranChi);
            })
            stt = this.getHead(stt);
        };
    };

    getHead(str: string): string {
        return str.substring(0, str.lastIndexOf('.'));
    };

    cancelEdit(id: string): void {
        const index = this.lstCtietBcao.findIndex(item => item.id === id);
        // lay vi tri hang minh sua
        const data: ItemDvi[] = [];
        this.lstCtietBcao[index].lstCtietDvis.forEach(item => {
            data.push({
                id: item.id,
                maDviNhan: item.maDviNhan,
                soTranChi: item.soTranChi,
                trangThai: item.trangThai,
            })
        })
        this.editCache[id] = {
            data: {
                ...this.lstCtietBcao[index],
                lstCtietDvis: data,
            },
            edit: false
        };
    };

    getLowStatus(stt: string) {
        const index: number = this.lstCtietBcao.findIndex(e => this.getHead(e.stt) == stt);
        if (index == -1) {
            return false;
        }
        return true;
    };

    getMoneyUnit() {
        return this.donViTiens.find(e => e.id == this.maDviTien)?.tenDm;
    };

    // gán editCache.data = lstCtietBcao
    updateEditCache(): void {
        this.lstCtietBcao.forEach(item => {
            const data: ItemDvi[] = [];
            if (item.lstCtietDvis) {
                item.lstCtietDvis.forEach(e => {
                    data.push({
                        id: e.id,
                        maDviNhan: e.maDviNhan,
                        soTranChi: e.soTranChi,
                        trangThai: e.trangThai,
                    });
                })
            }
            this.editCache[item.id] = {
                edit: false,
                data: {
                    id: item.id,
                    stt: item.stt,
                    level: item.level,
                    maNdung: item.maNdung,
                    tongCong: item.tongCong,
                    dtoanGiao: item.dtoanGiao,
                    lstCtietDvis: data,
                    checked: false,
                }
            }
        })
    }


    getChiMuc(str: string): string {
        str = str.substring(str.indexOf('.') + 1, str.length);
        let xau = "";
        const chiSo: any = str.split('.');
        const n: number = chiSo.length - 1;
        let k: number = parseInt(chiSo[n], 10);
        if (n == 0) {
            for (let i = 0; i < this.soLaMa.length; i++) {
                while (k >= this.soLaMa[i].gTri) {
                    xau += this.soLaMa[i].kyTu;
                    k -= this.soLaMa[i].gTri;
                }
            }
        }
        if (n == 1) {
            xau = chiSo[n];
        }
        if (n == 2) {
            xau = chiSo[n - 1].toString() + "." + chiSo[n].toString();
        }
        if (n == 3) {
            xau = String.fromCharCode(k + 96);
        }
        if (n == 4) {
            xau = "-";
        }
        return xau;
    }


    displayValue(num: number): string {
        num = exchangeMoney(num, '1', this.maDviTien);
        return displayNumber(num);
    };

    doPrint() {
        const WindowPrt = window.open(
            '',
            '',
            'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0',
        );
        let printContent = '';
        printContent = printContent + '<div>';
        printContent =
            printContent + document.getElementById('tablePrint').innerHTML;
        printContent = printContent + '</div>';
        WindowPrt.document.write(printContent);
        WindowPrt.document.close();
        WindowPrt.focus();
        WindowPrt.print();
        WindowPrt.close();
    };

    async save(trangThai: string, lyDoTuChoi: string) {
        let checkSaveEdit;
        //check xem tat ca cac dong du lieu da luu chua?
        //chua luu thi bao loi, luu roi thi cho di
        this.lstCtietBcao.forEach(element => {
            if (this.editCache[element.id].edit === true) {
                checkSaveEdit = false
            }
        });
        if (checkSaveEdit == false) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTSAVE);
            return;
        }
        //tinh lai don vi tien va kiem tra gioi han cua chung
        const lstCtietBcaoTemp: ItemData[] = [];
        let checkMoneyRange = true;
        this.lstCtietBcao.forEach(item => {
            lstCtietBcaoTemp.push({
                ...item,
            })
        })

        if (!checkMoneyRange) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.MONEYRANGE);
            return;
        }

        // replace nhung ban ghi dc them moi id thanh null
        lstCtietBcaoTemp.forEach(item => {
            if (item.id?.length == 38) {
                item.id = null;
            }
        })

        const request = JSON.parse(JSON.stringify(this.formDetail));
        request.lstCtietBcaos = lstCtietBcaoTemp;
        if (lyDoTuChoi) {
            request.lyDoTuChoi = lyDoTuChoi;
        }
        request.trangThai = trangThai;
        this.spinner.show();
        this.giaoDuToanService.updateCTietBcao(request).toPromise().then(
            async data => {
                if (data.statusCode == 0) {
                    this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
                    this.formDetail = data.data;
                    this._modalRef.close({
                        formDetail: this.formDetail,
                    });
                } else {
                    this.notification.error(MESSAGE.ERROR, data?.msg);
                }
            },
            err => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
            },
        );

        this.spinner.hide();
        // this.getTotal()
    };

    getTotal() {
        this.total = new ItemData();
        this.lstCtietBcao.forEach(item => {
            const level = item.stt.split('.').length - 2;
            if (level == 0) {
                this.total.tongCong = sumNumber([this.total.tongCong, item.tongCong]);
                this.total.dtoanGiao = sumNumber([this.total.dtoanGiao, item.dtoanGiao]);
            }
        })
    }

    tuChoi(mcn: string) {
        const modalTuChoi = this.modal.create({
            nzTitle: 'Từ chối',
            nzContent: DialogTuChoiComponent,
            nzMaskClosable: false,
            nzClosable: false,
            nzWidth: '900px',
            nzFooter: null,
            nzComponentParams: {},
        });
        modalTuChoi.afterClose.subscribe(async (text) => {
            if (text) {
                this.save(mcn, text);
            }
        });
    };

    handleCancel() {
        this._modalRef.close();
    };
}
