import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { FileManip, Operator, Status, Table, Utils } from 'src/app/Utility/utils';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { GiaoDuToanChiService } from 'src/app/services/quan-ly-von-phi/giaoDuToanChi.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import * as XLSX from 'xlsx';
import { BtnStatus, Doc, Form } from '../../giao-du-toan.constant';
import { NOI_DUNG } from './phu-luc-phan-bo.constant';
import { DanhMucService } from 'src/app/services/danhmuc.service';

export class ItemData {
    id: string;
    stt: string;
    level: number;
    maNdung: number;
    tongCong: number;
    dtoanGiao: number;
    lstCtietDvis: ItemDvi[] = [];
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
    Op = new Operator('1');
    Utils = Utils;
    //thong tin chi tiet cua bieu mau
    formDetail: Form = new Form();
    total: ItemData = new ItemData({});
    maDviTien: string = '1';
    namBcao: number;
    //danh muc
    lstCtietBcaos: ItemData[] = [];
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
        private giaoDuToanService: GiaoDuToanChiService,
        private quanLyVonPhiService: QuanLyVonPhiService,
        private fileManip: FileManip,
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
        // this.maDvi = this.dataInfo.maDvi;
        // // lấy danh sách đơn vị
        // await this.danhMuc.dMDonVi().toPromise().then(
        //     (data) => {
        //         if (data.statusCode === 0) {
        //             this.donVis = data?.data;
        //             this.capDvi = this.donVis.find(e => e.maDvi == this.userInfo?.MA_DVI)?.capDvi;
        //         } else {
        //             this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE)
        //         }
        //     }
        // );

        Object.assign(this.status, this.dataInfo.status);
        await this.getFormDetail();
        await this.getChildUnit();
        this.namBcao = this.dataInfo?.namBcao;

        if (this.status.general) {
            // const category = await this.danhMucService.danhMucChungGetAll('LTD_TT342_BM131');
            // if (category) {
            //     this.chiTieus = category.data;
            // }
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

        // if (this.dataInfo?.isSynthetic && this.dataInfo?.isSynthetic == true) {
        //     let lstDvi1 = this.donVis.filter(e => e?.maDviCha === this.dataInfo.maDvi);
        //     let lstDvi2 = []
        //     this.dataInfo.data?.lstCtietBcaos[0].lstCtietDvis.forEach(s => {
        //         const Dvi2 = lstDvi1.filter(v => v.maDvi === s.maDviNhan)[0]
        //         lstDvi2.push(Dvi2)
        //     })
        //     this.lstDvi = lstDvi2
        // } else {
        //     this.lstDvi = this.donVis.filter(e => e?.maDvi === this.dataInfo.maDvi);
        // }

        // if (this.dataInfo?.extraData && this.dataInfo.extraData.length > 0) {
        //     this.dataInfo.extraData.forEach(item => {
        //         if (item.maNdung) {
        //             const index = this.lstCtietBcaos.findIndex(e => e.maNdung == item.maNdung);
        //             this.lstCtietBcaos[index].lstCtietDvis = item?.lstCtietDvis;
        //         }
        //     })
        // }

        // console.log(this.donVis);

        // this.formDetail.lstCtietBcaos[0]?.lstCtietDvis.forEach(s => {
        //     this.lstDvi = this.donVis.filter(v => v.maDvi === s.maDviNhan)
        // })

        console.log(this.dataInfo?.capDvi);

        if (this.dataInfo?.capDvi == "3") {
            // let lstDvi1 = this.donVis.filter(e => e?.maDviCha === this.dataInfo.maDvi);
            // let lstDvi2 = []
            // this.dataInfo.data?.lstCtietBcaos[0].lstCtietDvis.forEach(s => {
            //     const Dvi2 = lstDvi1.filter(v => v.maDvi === s.maDviNhan)[0]
            //     lstDvi2.push(Dvi2)
            // })
            // this.lstDvi = lstDvi2
            this.donVis = []
            this.donVis.push(
                {
                    tenDvi: this.dataInfo?.tenDvi,
                    maDvi: this.dataInfo?.maDvi
                }
            )
            this.lstDvi = this.donVis;
            console.log(this.lstDvi);

        } else {
            this.formDetail.lstCtietBcaos[0]?.lstCtietDvis.forEach(s => {
                this.lstDvi = this.donVis.filter(v => v.maDvi === s.maDviNhan)
            })
        }

        this.lstCtietBcaos = Table.sortByIndex(this.lstCtietBcaos)

        this.lstCtietBcaos.forEach(item => {
            if (item.maNdung) {
                const index = this.lstCtietBcaos.findIndex(e => e.maNdung == item.maNdung);
                let tongCong = 0
                this.lstCtietBcaos[index].lstCtietDvis.forEach(itm => {
                    tongCong += itm.soTranChi
                })
                // this.lstCtietBcaos[index].dtoanGiao = tongCong;
                this.sum(this.lstCtietBcaos[index].stt)
            }
        })
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
                    this.donVis = data?.data;
                    this.capDvi = this.dataInfo?.capDvi;

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
        await this.giaoDuToanService.ctietBieuMau(this.dataInfo.id).toPromise().then(
            data => {
                if (data.statusCode == 0) {
                    this.formDetail = data.data;
                    this.formDetail.maDviTien = '1';
                    this.formDetail.lstCtietBcaos.forEach(item => {
                        this.lstCtietBcaos.push(new ItemData(item));
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
        this.editCache[id].data.tongCong = 0;
        this.editCache[id].data.lstCtietDvis.forEach(item => {
            this.editCache[id].data.tongCong += item.soTranChi;
        })
    };

    getStatusButton() {
        this.status.ok = this.status.ok && (this.formDetail.trangThai == Status.NOT_RATE || this.formDetail.trangThai == Status.COMPLETE);
    };

    startEdit(id: string): void {
        this.editCache[id].edit = true;
    }

    saveEdit(id: string): void {
        // set checked editCache = checked lstCtietBcaos
        this.editCache[id].data.checked = this.lstCtietBcaos.find(item => item.id === id).checked;
        // lay vi tri hang minh sua
        const index = this.lstCtietBcaos.findIndex(item => item.id === id);
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
        this.editCache[id].data.lstCtietDvis = data
        // this.lstCtietBcaos[index] = {
        //     ...this.editCache[id].data,
        //     lstCtietDvis: data,
        // }
        this.editCache[id].edit = false; // CHUYEN VE DANG TEXT
        this.sum(this.lstCtietBcaos[index].stt);
        this.getTotal();
        this.updateEditCache();
    }

    sum(stt: string) {
        stt = this.getHead(stt);
        while (stt != '0') {
            const index = this.lstCtietBcaos.findIndex(e => e.stt == stt);
            const data = this.lstCtietBcaos[index];
            const mm: any[] = [];
            data.lstCtietDvis.forEach(item => {
                mm.push({
                    ...item,
                    soTranChi: 0,
                })
            });
            this.lstCtietBcaos[index] = new ItemData({
                id: data.id,
                stt: data.stt,
                level: data.level,
                maNdung: data.maNdung,
                tongCong: data.tongCong,
                dtoanGiao: data.dtoanGiao,
                lstCtietDvis: mm,
                checked: false,
            });
            this.lstCtietBcaos.forEach(item => {
                if (this.getHead(item.stt) == stt) {
                    item.lstCtietDvis.forEach(e => {
                        const ind = this.lstCtietBcaos[index].lstCtietDvis.findIndex(i => i.maDviNhan == e.maDviNhan);
                        this.lstCtietBcaos[index].lstCtietDvis[ind].soTranChi += Number(e.soTranChi);
                    })
                }
            });
            this.lstCtietBcaos[index].tongCong = 0
            this.lstCtietBcaos[index].lstCtietDvis.forEach(item => {
                this.lstCtietBcaos[index].tongCong += Number(item.soTranChi);
            })
            stt = this.getHead(stt);
        };
    };

    getHead(str: string): string {
        return str.substring(0, str.lastIndexOf('.'));
    };

    cancelEdit(id: string): void {
        const index = this.lstCtietBcaos.findIndex(item => item.id === id);
        // lay vi tri hang minh sua
        const data: ItemDvi[] = [];
        this.lstCtietBcaos[index].lstCtietDvis.forEach(item => {
            data.push({
                id: item.id,
                maDviNhan: item.maDviNhan,
                soTranChi: item.soTranChi,
                trangThai: item.trangThai,
            })
        })
        this.editCache[id].data.lstCtietDvis = data
        this.editCache[id] = {
            data: new ItemData(this.lstCtietBcaos[index]),
            // data: {
            //     ...this.lstCtietBcaos[index],
            //     lstCtietDvis: data,
            // },
            edit: false
        };
    };

    getLowStatus(stt: string) {
        const index: number = this.lstCtietBcaos.findIndex(e => this.getHead(e.stt) == stt);
        if (index == -1) {
            return false;
        }
        return true;
    };


    // gán editCache.data = lstCtietBcaos
    updateEditCache(): void {
        this.lstCtietBcaos.forEach(item => {
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
                data: new ItemData({
                    id: item.id,
                    stt: item.stt,
                    level: item.level,
                    maNdung: item.maNdung,
                    tongCong: item.tongCong,
                    dtoanGiao: item.dtoanGiao,
                    lstCtietDvis: data,
                    checked: false,
                })
            }
        })
    }

    async save(trangThai: string, lyDoTuChoi: string) {
        if (this.lstCtietBcaos.some(e => this.editCache[e.id].edit)) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTSAVE);
            return;
        }


        if (this.listFile.some(file => file.size > Utils.FILE_SIZE)) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.OVER_SIZE);
            return;
        }

        const lstCtietBcaoTemp: ItemData[] = [];
        this.lstCtietBcaos.forEach(item => {
            lstCtietBcaoTemp.push(item.request())
        })

        const request = JSON.parse(JSON.stringify(this.formDetail));

        request.fileDinhKems = [];
        for (let iterator of this.listFile) {
            request.fileDinhKems.push(await this.fileManip.uploadFile(iterator, this.dataInfo.path));
        }

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
                    this._modalRef.close({
                        trangThai: data.data.trangThai,
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
    };

    getTotal() {
        this.total.clear();
        this.lstCtietBcaos.forEach(item => {
            this.total.sum(item);
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


    deleteFile(id: string): void {
        this.formDetail.lstFiles = this.formDetail.lstFiles.filter((a: any) => a.id !== id);
        this.listFile = this.listFile.filter((a: any) => a?.lastModified.toString() !== id);
        this.formDetail.listIdDeleteFiles.push(id);
    }

    async downloadFile(id: string) {
        let file: any = this.listFile.find(element => element?.lastModified.toString() == id);
        let doc: any = this.formDetail.lstFiles.find(element => element?.id == id);
        await this.fileManip.downloadFile(file, doc);
    }

    exportToExcel() {
        const header = [
            { t: 0, b: 1, l: 0, r: 13, val: null },
            { t: 0, b: 1, l: 0, r: 0, val: 'STT' },
            { t: 0, b: 1, l: 1, r: 1, val: 'Danh mục' },
            { t: 0, b: 1, l: 2, r: 2, val: 'Đơn vị tính' },
            { t: 0, b: 1, l: 3, r: 3, val: 'Thực hiện năm trước' },
            { t: 0, b: 0, l: 4, r: 5, val: 'Năm ' + (this.namBcao - 1).toString() },
            { t: 1, b: 1, l: 4, r: 4, val: 'Dự toán' },
            { t: 1, b: 1, l: 5, r: 5, val: 'Ước thực hiện' },
            { t: 0, b: 0, l: 6, r: 8, val: 'Năm dự toán' },
            { t: 1, b: 1, l: 6, r: 6, val: 'Số lượng' },
            { t: 1, b: 1, l: 7, r: 7, val: 'Định mức' },
            { t: 1, b: 1, l: 8, r: 8, val: 'Thành tiền' },
            { t: 0, b: 0, l: 9, r: 10, val: 'Thẩm định' },
            { t: 1, b: 1, l: 9, r: 9, val: 'Số lượng' },
            { t: 1, b: 1, l: 10, r: 10, val: 'Thành tiền' },
            { t: 0, b: 1, l: 11, r: 11, val: 'Chênh lệch giữa thẩm định của DVCT và nhu cầu của DVCD' },
            { t: 0, b: 1, l: 12, r: 12, val: 'Ghi chú' },
            { t: 0, b: 1, l: 13, r: 13, val: 'Ý kiến của đơn vị cấp trên' },
        ]
        const fieldOrder = ['stt', 'tenDanhMuc', 'dviTinh', 'thienNamTruoc', 'dtoanNamHtai', 'uocNamHtai', 'sluongNamDtoan',
            'sluongNamDtoan', 'dmucNamDtoan', 'ttienNamDtoan', 'sluongTd', 'ttienTd', 'chenhLech', 'ghiChu', 'ykienDviCtren']

        const filterData = this.lstCtietBcaos.map(item => {
            const row: any = {};
            fieldOrder.forEach(field => {
                row[field] = field == 'stt' ? item.index() : item[field]
            })
            return row;
        })

        const workbook = XLSX.utils.book_new();
        const worksheet = Table.initExcel(header);
        XLSX.utils.sheet_add_json(worksheet, filterData, { skipHeader: true, origin: Table.coo(header[0].l, header[0].b + 1) })
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Dữ liệu');
        let excelName = this.dataInfo.maBcao;
        if (this.dataInfo.maBieuMau == "pl01N") {
            excelName = excelName + '_Phu_luc_I_nhap.xlsx'
        } else {
            excelName = excelName + '_Phu_luc_I_xuat.xlsx'
        }
        XLSX.writeFile(workbook, excelName);
    }

}
