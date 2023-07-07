import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { UserService } from 'src/app/services/user.service';
import { AMOUNT, DON_VI_TIEN, LA_MA } from 'src/app/Utility/utils';
// import { NOI_DUNG } from './phu-luc-phan-bo.constant';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { DieuChinhService } from 'src/app/services/quan-ly-von-phi/dieuChinhDuToan.service';
import { displayNumber, exchangeMoney, sortByIndex, sumNumber } from 'src/app/Utility/func';
import { DANH_MUC_PL_TH } from './phu-luc-tong-hop.constant';

export class ItemData {
    id: string;
    stt: string;
    level: number;
    maNoiDung: string;
    tongCong: number;
    dtoanGiao: number;
    tongDchinhGiam: number;
    tongDchinhTang: number;
    child: ItemDvi[] = [];
    checked!: boolean;
}

export class ItemDvi {
    id: string;
    maDviBcao: string;
    dtoanVuTvqtDnghi: number;
}

@Component({
    selector: 'app-phu-luc-tong-hop',
    templateUrl: './phu-luc-tong-hop.component.html',
    styleUrls: ['./phu-luc-tong-hop.component.scss']
})
export class PhuLucTongHopComponent implements OnInit {
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
    noiDungs: any[] = DANH_MUC_PL_TH;
    thuyetMinh: string;
    maDvi: string;
    userInfo: any;
    formDetail: any;
    isSynthetic: any;
    amount = AMOUNT;
    total: ItemData = new ItemData();
    scrollX: string;
    constructor(
        private modal: NzModalService,
        private _modalRef: NzModalRef,
        private danhMuc: DanhMucHDVService,
        private notification: NzNotificationService,
        private spinner: NgxSpinnerService,
        private dieuChinhDuToanService: DieuChinhService,

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


        this.lstCtietBcao = this.dataInfo.data.lstCtietDchinh;
        if (this.isSynthetic && this.isSynthetic == true) {
            let lstDvi1 = this.donVis.filter(e => e?.maDviCha === this.maDvi);
            let lstDvi2 = []
            this.dataInfo.data?.lstCtietDchinh[0]?.child.forEach(s => {
                const Dvi2 = lstDvi1.filter(v => v.maDvi === s.maDviBcao)[0]
                lstDvi2.push(Dvi2)
            })
            this.lstDvi = lstDvi2
        } else {
            this.lstDvi = this.donVis.filter(e => e?.maDvi === this.maDvi);
        }
        if (this.dataInfo.data.trangThai == "3" && this.dataInfo?.extraData && this.dataInfo.extraData.length > 0) {
            this.dataInfo.extraData.forEach(item => {
                if (item.maNoiDung) {
                    const index = this.lstCtietBcao.findIndex(e => e.maNoiDung == item.maNoiDung);
                    this.lstCtietBcao[index].child = item.child;
                }
            })
        }
        // if (this.dataInfo.data.trangThai == "3") {
        //   if (this.isSynthetic || this.isSynthetic == false) {
        //     this.lstDvi = this.donVis.filter(e => e?.maDvi === this.maDvi);
        //     lstCtietTemp.forEach(s => {
        //       s.lstCtietDvis = []
        //       s.lstCtietDvis.push({
        //         id: uuid.v4() + 'FE',
        //         maDviNhan: this.maDvi,
        //         soTranChi: 0,
        //       })
        //     })
        //     this.lstCtietBcao = lstCtietTemp
        //     if (this.dataInfo?.extraData && this.dataInfo.extraData.length > 0) {
        //       this.dataInfo.extraData.forEach(item => {
        //         if (item.maNdung) {
        //           const index = this.lstCtietBcao.findIndex(e => e.maNdung == item.maNdung);
        //           this.lstCtietBcao[index].lstCtietDvis = item.lstCtietDvis;
        //           this.sum(this.lstCtietBcao[index].stt)
        //         }
        //       })
        //     }
        //   } else {
        //     // lstCtietTemp.forEach(s => {
        //     //   s.lstCtietDvis = []
        //     //   s.lstCtietDvis.push({
        //     //     id: uuid.v4() + 'FE',
        //     //     maDviNhan: this.maDvi,
        //     //     soTranChi: 0,
        //     //   })
        //     // })
        //     let lstDvi1 = this.donVis.filter(e => e?.maDviCha === this.maDvi);

        //     this.dataInfo.data?.lstCtietBcaos[0].lstCtietDvis.forEach(s => {
        //       lstDvi1 = lstDvi1.filter(v => v.maDvi === s.maDviNhan)
        //     })
        //     this.lstDvi = lstDvi1
        //     this.lstCtietBcao = this.dataInfo.data.lstCtietBcaos
        //     // if (this.dataInfo?.extraData && this.dataInfo.extraData.length > 0) {
        //     //   this.dataInfo.extraData.forEach(item => {
        //     //     if (item.maNdung) {
        //     //       const index = this.lstCtietBcao.findIndex(e => e.maNdung == item.maNdung);
        //     //       this.lstCtietBcao[index].lstCtietDvis = item.lstCtietDvis;
        //     //       this.sum(this.lstCtietBcao[index].stt)
        //     //     }
        //     //   })
        //     // }
        //   }
        // } else if ((this.dataInfo.data.trangThai == "5" || this.dataInfo.data.trangThai == "4") && this.isSynthetic == false) {
        //   this.lstDvi = this.donVis.filter(e => e?.maDvi === this.maDvi);
        //   this.dataInfo.data.lstCtietBcaos.forEach(s => {
        //     if (s.listCtiet && s.listCtiet.length > 0) {
        //       s.lstCtietDvis = s.listCtiet
        //     }
        //     if (s.lstCtietDvis && s.lstCtietDvis.length > 0) {
        //       s.lstCtietDvis = s.lstCtietDvis
        //     }
        //   })
        //   this.lstCtietBcao = this.dataInfo.data.lstCtietBcaos;
        // }

        if (this.status) {
            this.scrollX = (350 + 250 * (this.lstDvi.length + 1)).toString() + 'px';
        } else {
            this.scrollX = (350 + 250 * (this.lstDvi.length + 1)).toString() + 'px';
        }
        this.lstCtietBcao = sortByIndex(this.lstCtietBcao)
        this.tinhTong();
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
        this.editCache[id].data.child.forEach(item => {
            this.editCache[id].data.dtoanGiao += item.dtoanVuTvqtDnghi;
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
        for (let itm of this.editCache[id].data.child) {
            if (itm.dtoanVuTvqtDnghi < 0) {
                this.notification.warning(MESSAGE.WARNING, 'giá trị nhập không được âm')
                return;
            }
            tongTranChi += itm.dtoanVuTvqtDnghi;
        }
        if (tongTranChi == null) {
            this.notification.warning(MESSAGE.WARNING, 'Dòng chưa có dữ liệu, vui lòng nhập!')
            return;
        }

        this.editCache[id].data.child.forEach(item => {
            data.push({
                id: item.id,
                maDviBcao: item.maDviBcao,
                dtoanVuTvqtDnghi: item.dtoanVuTvqtDnghi,
            })
        })
        this.lstCtietBcao[index] = {
            ...this.editCache[id].data,
            child: data,
        }
        this.editCache[id].edit = false; // CHUYEN VE DANG TEXT
        this.sum(this.lstCtietBcao[index].stt);
        this.updateEditCache();
    }

    sum(stt: string) {
        stt = this.getHead(stt);
        while (stt != '0') {
            const index = this.lstCtietBcao.findIndex(e => e.stt == stt);
            const data = this.lstCtietBcao[index];
            const mm: any[] = [];
            data.child.forEach(item => {
                mm.push({
                    ...item,
                    dtoanVuTvqtDnghiDvi: 0,
                })
            });
            this.lstCtietBcao[index] = {
                id: data.id,
                stt: data.stt,
                level: data.level,
                maNoiDung: data.maNoiDung,
                tongCong: data.tongCong,
                dtoanGiao: data.dtoanGiao,
                tongDchinhTang: data.tongDchinhTang,
                tongDchinhGiam: data.tongDchinhGiam,
                child: mm,
                checked: false,
            };
            this.lstCtietBcao.forEach(item => {
                if (this.getHead(item.stt) == stt) {
                    item.child.forEach(e => {
                        const ind = this.lstCtietBcao[index].child.findIndex(i => i.maDviBcao == e.maDviBcao);
                        this.lstCtietBcao[index].child[ind].dtoanVuTvqtDnghi += Number(e.dtoanVuTvqtDnghi);
                    })
                }
            });
            this.lstCtietBcao[index].tongDchinhGiam = 0
            this.lstCtietBcao[index].tongDchinhTang = 0
            this.lstCtietBcao[index].child.forEach(item => {
                if (item.dtoanVuTvqtDnghi < 0) {
                    this.lstCtietBcao[index].tongDchinhGiam += Number(item.dtoanVuTvqtDnghi);
                } else {
                    this.lstCtietBcao[index].tongDchinhTang += Number(item.dtoanVuTvqtDnghi);
                }
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
        this.lstCtietBcao[index].child.forEach(item => {
            data.push({
                id: item.id,
                maDviBcao: item.maDviBcao,
                dtoanVuTvqtDnghi: item.dtoanVuTvqtDnghi,
            })
        })
        this.editCache[id] = {
            data: {
                ...this.lstCtietBcao[index],
                child: data,
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
            if (item.child) {
                item.child.forEach(e => {
                    data.push({
                        id: e.id,
                        maDviBcao: e.maDviBcao,
                        dtoanVuTvqtDnghi: e.dtoanVuTvqtDnghi,
                    });
                })
            }
            this.editCache[item.id] = {
                edit: false,
                data: {
                    id: item.id,
                    stt: item.stt,
                    level: item.level,
                    maNoiDung: item.maNoiDung,
                    tongCong: item.tongCong,
                    dtoanGiao: item.dtoanGiao,
                    tongDchinhGiam: item.tongDchinhGiam,
                    tongDchinhTang: item.tongDchinhTang,
                    child: data,
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
        request.lstCtietDchinh = lstCtietBcaoTemp;
        if (lyDoTuChoi) {
            request.lyDoTuChoi = lyDoTuChoi;
        }
        request.trangThai = trangThai;
        this.spinner.show();
        this.dieuChinhDuToanService.updatePLDieuChinh(request).toPromise().then(
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
                this.total.tongDchinhGiam = sumNumber([this.total.tongDchinhGiam, item.tongDchinhGiam]);
                this.total.tongDchinhTang = sumNumber([this.total.tongDchinhTang, item.tongDchinhTang]);
                // this.total.tong = sumNumber([this.total.tong, item.tong]);
                // this.total.dtoanDaThien = sumNumber([this.total.dtoanDaThien, item.dtoanDaThien]);
                // this.total.dtoanUocThien = sumNumber([this.total.dtoanUocThien, item.dtoanUocThien]);
                // this.total.tongDtoanTrongNam = sumNumber([this.total.tongDtoanTrongNam, item.tongDtoanTrongNam]);
                // this.total.dtoanDnghiDchinh = sumNumber([this.total.dtoanDnghiDchinh, item.dtoanDnghiDchinh]);
                // this.total.dtoanVuTvqtDnghi = sumNumber([this.total.dtoanVuTvqtDnghi, item.dtoanVuTvqtDnghi]);
            }
        })
    };

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

    // tính tổng
    tinhTong() {
        this.lstCtietBcao.forEach(item => {
            const sttItem = item.stt
            const index = this.lstCtietBcao.findIndex(e => e.stt == sttItem);
            this.lstCtietBcao[index].tongDchinhGiam = 0
            this.lstCtietBcao[index].tongDchinhTang = 0
            this.lstCtietBcao[index].child.forEach(item => {
                if (item.dtoanVuTvqtDnghi < 0) {
                    this.lstCtietBcao[index].tongDchinhGiam += Number(item.dtoanVuTvqtDnghi);
                } else {
                    this.lstCtietBcao[index].tongDchinhTang += Number(item.dtoanVuTvqtDnghi);
                }
            })
        })
    };


}
