import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { Operator, Status, Table, Utils } from 'src/app/Utility/utils';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { DieuChinhService } from 'src/app/services/quan-ly-von-phi/dieuChinhDuToan.service';
import * as XLSX from 'xlsx-js-style';
import { BtnStatus, Doc, Form } from '../../dieu-chinh-du-toan.constant';
import { DANH_MUC_PL_TH } from './phu-luc-tong-hop.constant';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { CurrencyMaskInputMode } from 'ngx-currency';
import { DanhMucService } from 'src/app/services/danhmuc.service';


export class ItemDvi {
    id: string;
    maDviBcao: string;
    dtoanVuTvqtDnghi: number;
}


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

    constructor(data: Partial<Pick<ItemData, keyof ItemData>>) {
        Object.assign(this, data);
    }

    index() {
        const str = this.stt.substring(this.stt.indexOf('.') + 1, this.stt.length);
        const chiSo: string[] = str.split('.');
        const n: number = chiSo.length - 1;
        let k: number = parseInt(chiSo[n], 10);
        switch (n) {
            case 0:
                return Utils.laMa(k);
            case 1:
                return chiSo[n];
            case 2:
                return chiSo[n - 1].toString() + "." + chiSo[n].toString();
            case 3:
                return String.fromCharCode(k + 96);
            case 4:
                return "-";
        }
    }

    clear() {
        Object.keys(this).forEach(key => {
            if (typeof this[key] === 'number' && key != 'level') {
                this[key] = null;
            }
        })
    }

    sum(data: ItemData) {
        Object.keys(data).forEach(key => {
            if (key != 'level' && (typeof this[key] == 'number' || typeof data[key] == 'number')) {
                this[key] = Operator.sum([this[key], data[key]]);
            }
        })
    }

    request() {
        const temp = Object.assign({}, this);
        if (this.id?.length == 38) {
            temp.id = null;
        }
        return temp;
    }
}
export const amount1 = {
    allowZero: true,
    allowNegative: true,
    precision: 4,
    prefix: '',
    thousands: '.',
    decimal: ',',
    align: "left",
    nullable: true,
    inputMode: CurrencyMaskInputMode.NATURAL,
}


@Component({
    selector: 'app-phu-luc-tong-hop',
    templateUrl: './phu-luc-tong-hop.component.html',
})
export class PhuLucTongHopComponent implements OnInit {
    @Input() dataInfo;
    Op = new Operator('1');
    Utils = Utils;
    //thong tin chi tiet cua bieu mau
    formDetail: Form = new Form();
    total: ItemData = new ItemData({});
    maDviTien: string = '1';
    namBcao: number;
    //danh muc
    lstCtietBcao: ItemData[] = [];
    noiDungs: any[] = [];
    lstDvi: any[] = [];
    donVis: any[] = [];
    // childUnit:any[] = []
    capDvi: any;
    //trang thai cac nut
    status: BtnStatus = new BtnStatus();
    editMoneyUnit = false;
    isDataAvailable = false;

    editCache: { [key: string]: { edit: boolean; data: ItemData } } = {};
    scrollX: string;

    fileList: NzUploadFile[] = [];
    listFile: File[] = [];
    listIdDeleteFiles: string[] = [];
    amount1 = amount1;
    beforeUpload = (file: NzUploadFile): boolean => {
        this.fileList = this.fileList.concat(file);
        return false;
    };

    // them file vao danh sach
    handleUpload(): void {
        this.fileList.forEach((file: any) => {
            const id = file?.lastModified.toString();
            this.formDetail.lstFiles.push({
                ... new Doc(),
                id: id,
                fileName: file?.name
            });
            this.listFile.push(file);
        });
        this.fileList = [];
    };




    constructor(
        private modal: NzModalService,
        private _modalRef: NzModalRef,
        private danhMuc: DanhMucHDVService,
        private notification: NzNotificationService,
        private spinner: NgxSpinnerService,
        private dieuChinhDuToanService: DieuChinhService,
        private quanLyVonPhiService: QuanLyVonPhiService,
        private danhMucService: DanhMucService,

    ) { }

    ngOnInit() {
        this.initialization().then(() => {
            this.isDataAvailable = true;
        })
    };

    async initialization() {
        this.spinner.show();
        const category = await this.danhMucService.danhMucChungGetAll('BC_DC_PL1');
        if (category) {
            this.noiDungs = category.data;
        }


        Object.assign(this.status, this.dataInfo.status);
        await this.getFormDetail();
        await this.getChildUnit();
        this.namBcao = this.dataInfo?.namBcao;

        if (this.status.general) {
            this.scrollX = Table.tableWidth(350, 5, 1, 60);
        } else {
            if (this.status.editAppVal) {
                this.scrollX = Table.tableWidth(350, 7, 2, 60);
            } else if (this.status.viewAppVal) {
                this.scrollX = Table.tableWidth(350, 7, 2, 0);
            } else {
                this.scrollX = Table.tableWidth(350, 5, 1, 0);
            }
        }

        this.formDetail.lstCtietDchinh[0]?.child.forEach(s => {
            this.lstDvi.push(this.donVis.filter(v => v.maDvi === s.maDviBcao)[0])


        })

        this.lstCtietBcao = Table.sortByIndex(this.lstCtietBcao)
        // this.sum1()
        this.tinhTong();
        this.getTotal();
        this.getStatusButton();
        this.updateEditCache();
        this.spinner.hide();
    };

    async getChildUnit() {
        const request = {
            maDviCha: this.dataInfo.maDvi,
            trangThai: '01',
        }
        await this.quanLyVonPhiService.dmDviCon(request).toPromise().then(
            data => {
                if (data.statusCode == 0) {
                    this.donVis = data.data;

                } else {
                    this.notification.error(MESSAGE.ERROR, data?.msg);
                }
            },
            (err) => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
            }
        )
    }
    async getFormDetail() {
        await this.dieuChinhDuToanService.ctietBieuMau(this.dataInfo.id).toPromise().then(
            data => {
                if (data.statusCode == 0) {
                    this.formDetail = data.data;
                    this.formDetail.maDviTien = '1';
                    this.formDetail.lstCtietDchinh.forEach(item => {
                        this.lstCtietBcao.push(new ItemData(item));
                    })
                    this.formDetail.listIdDeleteFiles = [];


                    this.listFile = [];
                    this.getStatusButton();
                } else {
                    this.notification.error(MESSAGE.ERROR, data?.msg);
                }
            },
            err => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
            }
        )
    }

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
        this.status.ok = this.status.ok && (this.formDetail.trangThai == Status.NOT_RATE || this.formDetail.trangThai == Status.COMPLETE);
    };

    startEdit(id: string): void {
        this.editCache[id].edit = true;
    }

    saveEdit(id: string): void {
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
        this.editCache[id].data.child = data
        Object.assign(this.lstCtietBcao[index], this.editCache[id].data);
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
            this.lstCtietBcao[index] = new ItemData(
                {
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
                }
            )

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
        this.lstCtietBcao[index].child = data
        this.editCache[id] = {
            data: new ItemData(this.lstCtietBcao[index]),
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
                data: new ItemData({
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
                })
            }
        })
    }


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
        if (this.dataInfo.trangThai == Status.TT_07) {
            if (this.dataInfo.isLinkDuLieu == false) {
                this.notification.warning(MESSAGE.WARNING, "Vui lòng đánh giá các biểu mẫu khác !");
                return;
            }
        }

        if (this.lstCtietBcao.some(e => this.editCache[e.id].edit)) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTSAVE);
            return;
        }


        if (this.listFile.some(file => file.size > Utils.FILE_SIZE)) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.OVER_SIZE);
            return;
        }

        const lstCtietBcaoTemp: ItemData[] = [];
        this.lstCtietBcao.forEach(item => {
            lstCtietBcaoTemp.push(item.request())
        })

        const request = JSON.parse(JSON.stringify(this.formDetail));

        request.fileDinhKems = [];
        for (let iterator of this.listFile) {
            const id = iterator?.lastModified.toString();
            const noiDung = this.formDetail.lstFiles.find(e => e.id == id)?.noiDung;
            request.fileDinhKems.push(await this.quanLyVonPhiService.upFile(iterator, this.dataInfo.path, noiDung));
        }
        request.fileDinhKems = request.fileDinhKems.concat(this.formDetail.lstFiles.filter(e => typeof e.id == 'number'))

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
                    this._modalRef.close({
                        trangThai: data.data.trangThai,
                        lyDoTuChoi: data.data.lyDoTuChoi,
                        thuyetMinh: data.data.thuyetMinh,
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
        this.total.clear();
        this.lstCtietBcao.forEach(item => {
            if (item.level == 0) {
                this.total.sum(item);
            }
        })

        this.total.child = [];
        this.lstDvi.forEach(item => {
            this.total.child.push({
                ...new ItemDvi(),
                maDviBcao: item.maDvi,
                dtoanVuTvqtDnghi: 0
            })
        })
        this.lstCtietBcao.forEach(item => {
            if (item.stt.split('.')?.length == 2) {
                item.child.forEach(ele => {
                    this.total.child.find(e => e.maDviBcao == ele.maDviBcao).dtoanVuTvqtDnghi += ele.dtoanVuTvqtDnghi;
                })
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

    // tính tổng
    tinhTong() {
        this.lstCtietBcao.forEach(item => {
            const sttItem = item.stt
            const index = this.lstCtietBcao.findIndex(e => e.stt == sttItem);
            this.lstCtietBcao[index].tongDchinhGiam = 0
            this.lstCtietBcao[index].tongDchinhTang = 0
            this.lstCtietBcao[index].child.forEach(item => {
                if (item.dtoanVuTvqtDnghi && item.dtoanVuTvqtDnghi !== null && this.lstCtietBcao[index].level !== 0) {
                    if (item.dtoanVuTvqtDnghi < 0) {
                        this.lstCtietBcao[index].tongDchinhGiam += Number(item.dtoanVuTvqtDnghi);
                    } else {
                        this.lstCtietBcao[index].tongDchinhTang += Number(item.dtoanVuTvqtDnghi);
                    }
                }
            })

            let stt = this.getHead(item.stt);
            while (stt != '0') {
                const index = this.lstCtietBcao.findIndex(e => e.stt == stt);
                const data = this.lstCtietBcao[index];
                this.lstCtietBcao[index] = new ItemData({
                    id: data.id,
                    stt: data.stt,
                    maNoiDung: data.maNoiDung,
                    level: data.level,
                    child: data.child,
                })
                this.lstCtietBcao.forEach(itm => {
                    if (this.getHead(itm.stt) == stt) {
                        this.lstCtietBcao[index].tongDchinhGiam = Operator.sum([this.lstCtietBcao[index].tongDchinhGiam, itm.tongDchinhGiam]);
                        this.lstCtietBcao[index].tongDchinhTang = Operator.sum([this.lstCtietBcao[index].tongDchinhTang, itm.tongDchinhTang]);
                    }
                })
                stt = this.getHead(stt);
            }
        })

    }


    // xoa file trong bang file
    deleteFile(id: string): void {
        this.formDetail.lstFiles = this.formDetail.lstFiles.filter((a: any) => a.id !== id);
        this.listFile = this.listFile.filter((a: any) => a?.lastModified.toString() !== id);
        this.formDetail.listIdDeleteFiles.push(id);
    }

    async downloadFile(id: string) {
        let file: any = this.listFile.find(element => element?.lastModified.toString() == id);
        let doc: any = this.formDetail.lstFiles.find(element => element?.id == id);
        await this.quanLyVonPhiService.downFile(file, doc);
    }

    exportToExcel() {
        if (this.lstCtietBcao.some(e => this.editCache[e.id].edit)) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTSAVE);
            return;
        }
        const header = [
            { t: 0, b: 1 + this.lstCtietBcao.length, l: 0, r: 1 + this.lstDvi.length, val: null },
            { t: 0, b: 1, l: 0, r: 0, val: 'STT' },
            { t: 0, b: 1, l: 1, r: 1, val: 'Nhóm' },
            { t: 0, b: 1, l: 2, r: 2, val: 'Tổng điều chỉnh giảm' },
            { t: 0, b: 1, l: 3, r: 3, val: 'Tổng điều chỉnh tăng' },
        ]
        const fieldOrder = [
            "maNoiDung",
            "tongCong",
            "dtoanGiao",
            "tongDchinhGiam",
            "tongDchinhTang",
        ]
        const filterData = this.lstCtietBcao.map(item => {
            const row: any = {};
            fieldOrder.forEach(field => {
                item[field] = item[field] ? item[field] : ""
                row[field] = field == 'stt' ? item.index() : item[field]
            })
            return row;
        })

        const workbook = XLSX.utils.book_new();
        const worksheet = Table.initExcel(header);
        XLSX.utils.sheet_add_json(worksheet, filterData, { skipHeader: true, origin: Table.coo(header[0].l, header[0].b + 1) })
        for (const cell in worksheet) {
            if (cell.startsWith('!') || XLSX.utils.decode_cell(cell).r < 4) continue;
            worksheet[cell].s = Table.borderStyle;
        }
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Dữ liệu');
        let excelName = this.dataInfo.maBcao;
        excelName = excelName + '_BCDC_PLTH.xlsx'
        XLSX.writeFile(workbook, excelName);
    }


}
