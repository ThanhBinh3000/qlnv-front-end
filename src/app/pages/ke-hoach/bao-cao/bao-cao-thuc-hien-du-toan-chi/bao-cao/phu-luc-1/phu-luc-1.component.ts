import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { FileManip, Operator, Status, Table, Utils } from "src/app/Utility/utils";
import { DialogChonDanhMucComponent } from 'src/app/components/dialog/dialog-chon-danh-muc/dialog-chon-danh-muc.component';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { DanhMucDungChungService } from 'src/app/services/danh-muc-dung-chung.service';
import { BaoCaoThucHienDuToanChiService } from 'src/app/services/quan-ly-von-phi/baoCaoThucHienDuToanChi.service';
import * as uuid from "uuid";
import { BtnStatus, Doc, Dtc, Form } from '../../bao-cao-thuc-hien-du-toan-chi.constant';
import * as XLSX from 'xlsx';

export class ItemData {
    id: string;
    stt: string;
    checked: boolean;
    level: number;
    maNdung: string;
    tenNdung: string;
    kphiSdungTcong: number;
    kphiSdungDtoan: number;
    kphiSdungNguonKhac: number;
    kphiSdungNguonQuy: number;
    kphiSdungNstt: number;
    kphiSdungCk: number;
    kphiChuyenSangTcong: number;
    kphiChuyenSangDtoan: number;
    kphiChuyenSangNguonKhac: number;
    kphiChuyenSangNguonQuy: number;
    kphiChuyenSangNstt: number;
    kphiChuyenSangCk: number;
    dtoanGiaoTcong: number;
    dtoanGiaoDtoan: number;
    dtoanGiaoNguonKhac: number;
    dtoanGiaoNguonQuy: number;
    dtoanGiaoNstt: number;
    dtoanGiaoCk: number;
    giaiNganThangBcaoTcong: number;
    giaiNganThangBcaoTcongTle: number;
    giaiNganThangBcaoDtoan: number;
    giaiNganThangBcaoDtoanTle: number;
    giaiNganThangBcaoNguonKhac: number;
    giaiNganThangBcaoNguonKhacTle: number;
    giaiNganThangBcaoNguonQuy: number;
    giaiNganThangBcaoNguonQuyTle: number;
    giaiNganThangBcaoNstt: number;
    giaiNganThangBcaoNsttTle: number;
    giaiNganThangBcaoCk: number;
    giaiNganThangBcaoCkTle: number;
    luyKeGiaiNganTcong: number;
    luyKeGiaiNganTcongTle: number;
    luyKeGiaiNganDtoan: number;
    luyKeGiaiNganDtoanTle: number;
    luyKeGiaiNganNguonKhac: number;
    luyKeGiaiNganNguonKhacTle: number;
    luyKeGiaiNganNguonQuy: number;
    luyKeGiaiNganNguonQuyTle: number;
    luyKeGiaiNganNstt: number;
    luyKeGiaiNganNsttTle: number;
    luyKeGiaiNganCk: number;
    luyKeGiaiNganCkTle: number;
}

@Component({
    selector: 'app-phu-luc-1',
    templateUrl: './phu-luc-1.component.html',
    styleUrls: ['../bao-cao.component.scss']
})
export class PhuLucIComponent implements OnInit {
    @Input() dataInfo;
    Op = new Operator('1');
    Utils = Utils;
    Dtc = Dtc;
    //thong tin 
    formDetail: Form = new Form();
    total: ItemData = new ItemData();
    maDviTien: string = '1';
    scrollX: string;
    namBcao: number;
    //danh muc
    noiDungs: any[] = [];
    lstCtietBcao: ItemData[] = [];
    luyKes: ItemData[] = [];
    keys = ['kphiSdungTcong', 'kphiSdungDtoan', 'kphiSdungNguonKhac', 'kphiSdungNguonQuy', 'kphiSdungNstt', 'kphiSdungCk', 'kphiChuyenSangTcong', 'kphiChuyenSangDtoan',
        'kphiChuyenSangNguonKhac', 'kphiChuyenSangNguonQuy', 'kphiChuyenSangNstt', 'kphiChuyenSangCk', 'dtoanGiaoTcong', 'dtoanGiaoDtoan', 'dtoanGiaoNguonKhac',
        'dtoanGiaoNguonQuy', 'dtoanGiaoNstt', 'dtoanGiaoCk', 'giaiNganThangBcaoTcong', 'giaiNganThangBcaoDtoan', 'giaiNganThangBcaoNguonKhac', 'giaiNganThangBcaoNguonQuy',
        'giaiNganThangBcaoNstt', 'giaiNganThangBcaoCk', 'luyKeGiaiNganTcong', 'luyKeGiaiNganDtoan', 'luyKeGiaiNganNguonKhac', 'luyKeGiaiNganNguonQuy', 'luyKeGiaiNganNstt', 'luyKeGiaiNganCk']
    //trang thai
    status: BtnStatus = new BtnStatus();
    editMoneyUnit = false;
    isDataAvailable = false;
    allChecked = false;
    editCache: { [key: string]: { edit: boolean; data: ItemData } } = {};

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
        private _modalRef: NzModalRef,
        private spinner: NgxSpinnerService,
        private baoCaoThucHienDuToanChiService: BaoCaoThucHienDuToanChiService,
        private danhMucService: DanhMucDungChungService,
        private notification: NzNotificationService,
        private modal: NzModalService,
        private fileManip: FileManip,
    ) {
    }

    ngOnInit() {
        this.initialization().then(() => {
            this.isDataAvailable = true;
        })
    }

    async initialization() {
        this.spinner.show();
        Object.assign(this.status, this.dataInfo.status);
        this.namBcao = this.dataInfo.namBcao;
        this.luyKes = this.dataInfo.luyKes?.lstCtietBcaos;
        if (this.status.save) {
            const category = await this.danhMucService.danhMucChungGetAll('BC_DTC_PL1');
            if (category) {
                category.data.forEach(
                    item => {
                        this.noiDungs.push({
                            ...item,
                            level: item.ma?.split('.').length - 2,
                        })
                    }
                )
            }
            if (this.lstCtietBcao.length == 0) {
                this.luyKes.forEach(item => {
                    this.lstCtietBcao.push({
                        ...item,
                        luyKeGiaiNganTcongTle: Operator.percent(item.luyKeGiaiNganTcong, item.kphiSdungTcong),
                        luyKeGiaiNganDtoanTle: Operator.percent(item.luyKeGiaiNganDtoan, item.kphiSdungDtoan),
                        luyKeGiaiNganNguonKhacTle: Operator.percent(item.luyKeGiaiNganNguonKhac, item.kphiSdungNguonKhac),
                        luyKeGiaiNganNguonQuyTle: Operator.percent(item.luyKeGiaiNganNguonQuy, item.kphiSdungNguonQuy),
                        luyKeGiaiNganNsttTle: Operator.percent(item.luyKeGiaiNganNstt, item.kphiSdungNstt),
                        luyKeGiaiNganCkTle: Operator.percent(item.luyKeGiaiNganCk, item.kphiSdungCk),
                        checked: false,
                        id: uuid.v4() + 'FE',
                    })
                })
            }
            this.scrollX = Table.tableWidth(350, 42, 0, 200);
        } else {
            this.scrollX = Table.tableWidth(350, 42, 0, 0);
        }
        // this.data?.lstCtietBcaos.forEach(item => {
        //     this.lstCtietBcao.push({
        //         ...item,
        //         giaiNganThangBcaoTcongTle: Operator.percent(item.giaiNganThangBcaoTcong, item.kphiSdungTcong),
        //         giaiNganThangBcaoDtoanTle: Operator.percent(item.giaiNganThangBcaoDtoan, item.kphiSdungDtoan),
        //         giaiNganThangBcaoNguonKhacTle: Operator.percent(item.giaiNganThangBcaoNguonKhac, item.kphiSdungNguonKhac),
        //         giaiNganThangBcaoNguonQuyTle: Operator.percent(item.giaiNganThangBcaoNguonQuy, item.kphiSdungNguonQuy),
        //         giaiNganThangBcaoNsttTle: Operator.percent(item.giaiNganThangBcaoNstt, item.kphiSdungNstt),
        //         giaiNganThangBcaoCkTle: Operator.percent(item.giaiNganThangBcaoCk, item.kphiSdungCk),
        //         luyKeGiaiNganTcongTle: Operator.percent(item.luyKeGiaiNganTcong, item.kphiSdungTcong),
        //         luyKeGiaiNganDtoanTle: Operator.percent(item.luyKeGiaiNganDtoan, item.kphiSdungDtoan),
        //         luyKeGiaiNganNguonKhacTle: Operator.percent(item.luyKeGiaiNganNguonKhac, item.kphiSdungNguonKhac),
        //         luyKeGiaiNganNguonQuyTle: Operator.percent(item.luyKeGiaiNganNguonQuy, item.kphiSdungNguonQuy),
        //         luyKeGiaiNganNsttTle: Operator.percent(item.luyKeGiaiNganNstt, item.kphiSdungNstt),
        //         luyKeGiaiNganCkTle: Operator.percent(item.luyKeGiaiNganCk, item.kphiSdungCk),
        //         checked: false,
        //     })
        // })



        if (this.lstCtietBcao.length > 0) {
            if (!this.lstCtietBcao[0]?.stt) {
                this.lstCtietBcao = Table.sortWithoutIndex(this.lstCtietBcao, 'maNdung');
            } else {
                this.lstCtietBcao = Table.sortByIndex(this.lstCtietBcao);
            }
        }

        // this.linkData(this.data.extraDataPL2?.maNdung);
        // this.linkData(this.data.extraDataPL3?.maNdung);
        this.getTotal();
        // this.lstCtietBcao.forEach(item => {
        //     item.tenNdung = this.noiDungs.find(e => e.ma == item.maNdung)?.giaTri;
        // })
        this.updateEditCache();
        this.getStatusButton();
        this.spinner.hide();
    }

    getStatusButton() {
        this.status.ok = this.status.ok && (this.formDetail.trangThai == Status.NOT_RATE || this.formDetail.trangThai == Status.COMPLETE);
    }

    // luu
    async save(trangThai: string) {
        if (this.lstCtietBcao.some(e => this.editCache[e.id].edit)) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTSAVE);
            return;
        }

        if (this.lstCtietBcao.some(e => e.kphiSdungTcong > Utils.MONEY_LIMIT || e.kphiChuyenSangTcong > Utils.MONEY_LIMIT || e.dtoanGiaoTcong > Utils.MONEY_LIMIT ||
            e.giaiNganThangBcaoTcong > Utils.MONEY_LIMIT || e.luyKeGiaiNganTcong > Utils.MONEY_LIMIT)) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.MONEYRANGE);
            return;
        }

        if (this.listFile.some(file => file.size > Utils.FILE_SIZE)) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.OVER_SIZE);
            return;
        }

        const lstCtietBcaoTemp: ItemData[] = [];
        this.lstCtietBcao.forEach(item => {
            lstCtietBcaoTemp.push({
                ...item,
                id: item.id?.length == 38 ? null : item.id,
            })
        })

        const request = JSON.parse(JSON.stringify(this.formDetail));
        request.fileDinhKems = [];
        for (let iterator of this.listFile) {
            request.fileDinhKems.push(await this.fileManip.uploadFile(iterator, this.dataInfo.path));
        }
        request.lstCtietLapThamDinhs = lstCtietBcaoTemp;
        request.trangThai = trangThai;
        this.spinner.show();
        this.baoCaoThucHienDuToanChiService.baoCaoCapNhatChiTiet(request).toPromise().then(
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
    }

    // chuc nang check role
    async onSubmit(mcn: string, lyDoTuChoi: string) {
        const requestGroupButtons = {
            id: this.formDetail.id,
            trangThai: mcn,
            lyDoTuChoi: lyDoTuChoi,
        };
        this.spinner.show();
        await this.baoCaoThucHienDuToanChiService.approveBieuMau(requestGroupButtons).toPromise().then(async (data) => {
            if (data.statusCode == 0) {
                if (mcn == Status.NOT_OK) {
                    this.notification.success(MESSAGE.SUCCESS, MESSAGE.REJECT_SUCCESS);
                } else {
                    this.notification.success(MESSAGE.SUCCESS, MESSAGE.APPROVE_SUCCESS);
                }
                this._modalRef.close({
                    trangThai: mcn,
                });
            } else {
                this.notification.error(MESSAGE.ERROR, data?.msg);
            }
        }, err => {
            this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        });
        this.spinner.hide();
    }

    //show popup tu choi
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
                this.onSubmit(mcn, text);
            }
        });
    }

    // chuyển đổi stt đang được mã hóa thành dạng I, II, a, b, c, ...
    getIndex(str: string): string {
        str = str.substring(str.indexOf('.') + 1, str.length);
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
            default:
                return "";
        }
    }

    //thêm ngang cấp
    addSame(id: string, initItem: ItemData) {
        this.lstCtietBcao = Table.addParent(id, initItem, this.lstCtietBcao);
        const data = this.lstCtietBcao.find(e => e.maNdung == initItem.maNdung);
        // if (data.maNdung == this.data.extraDataPL2?.maNdung || data.maNdung == this.data.extraDataPL3?.maNdung) {
        //     this.linkData(data.maNdung)
        // }
        this.sum(data.stt);
    }

    // gan editCache.data == lstCtietBcao
    updateEditCache(): void {
        this.lstCtietBcao.forEach(item => {
            this.editCache[item.id] = {
                edit: false,
                data: { ...item }
            };
        });
    }

    //thêm cấp thấp hơn
    addLow(id: string, initItem: ItemData) {
        this.lstCtietBcao = Table.addChild(id, initItem, this.lstCtietBcao);
        const data = this.lstCtietBcao.find(e => e.maNdung == initItem.maNdung);
        // if (data.maNdung == this.data.extraDataPL2?.maNdung || data.maNdung == this.data.extraDataPL3?.maNdung) {
        //     this.linkData(data.maNdung)
        // }
        this.sum(data.stt);

    }
    //xóa dòng
    deleteLine(id: string) {
        const stt = this.lstCtietBcao.find(e => e.id === id)?.stt;
        this.lstCtietBcao = Table.deleteRow(id, this.lstCtietBcao);
        this.sum(stt);
        this.updateEditCache();
    }

    // start edit
    startEdit(id: string): void {
        this.editCache[id].edit = true;
    }

    // huy thay doi
    cancelEdit(id: string): void {
        const data = this.lstCtietBcao.find(item => item.id === id);
        // lay vi tri hang minh sua
        this.editCache[id] = {
            data: { ...data },
            edit: false
        };
    }

    // luu thay doi
    saveEdit(id: string): void {
        this.editCache[id].data.checked = this.lstCtietBcao.find(item => item.id === id).checked; // set checked editCache = checked lstCtietBcao
        const index = this.lstCtietBcao.findIndex(item => item.id === id); // lay vi tri hang minh sua
        Object.assign(this.lstCtietBcao[index], this.editCache[id].data); // set lai data cua lstCtietBcao[index] = this.editCache[id].data
        this.editCache[id].edit = false; // CHUYEN VE DANG TEXT
        this.sum(this.lstCtietBcao[index].stt);
        this.updateEditCache();
    }


    updateChecked(id: string) {
        const data: ItemData = this.lstCtietBcao.find(e => e.id === id);
        //đặt các phần tử con có cùng trạng thái với nó
        this.lstCtietBcao.forEach(item => {
            if (item.stt.startsWith(data.stt)) {
                item.checked = data.checked;
            }
        })
        //thay đổi các phần tử cha cho phù hợp với tháy đổi của phần tử con
        let index: number = this.lstCtietBcao.findIndex(e => e.stt == Table.preIndex(data.stt));
        if (index == -1) {
            this.allChecked = this.checkAllChild('0');
        } else {
            let nho: boolean = this.lstCtietBcao[index].checked;
            while (nho != this.checkAllChild(this.lstCtietBcao[index].stt)) {
                this.lstCtietBcao[index].checked = !nho;
                index = this.lstCtietBcao.findIndex(e => e.stt == Table.preIndex(this.lstCtietBcao[index].stt));
                if (index == -1) {
                    this.allChecked = this.checkAllChild('0');
                    break;
                }
                nho = this.lstCtietBcao[index].checked;
            }
        }
    }

    //kiểm tra các phần tử con có cùng được đánh dấu hay ko
    checkAllChild(str: string): boolean {
        let nho = true;
        this.lstCtietBcao.forEach(item => {
            if ((Table.preIndex(item.stt) == str) && (!item.checked)) {
                nho = item.checked;
            }
        })
        return nho;
    }


    updateAllChecked() {
        this.lstCtietBcao.forEach(item => {
            item.checked = this.allChecked;
        })
    }

    deleteAllChecked() {
        const lstId: string[] = [];
        this.lstCtietBcao.forEach(item => {
            if (item.checked) {
                lstId.push(item.id);
            }
        })
        lstId.forEach(item => {
            if (this.lstCtietBcao.findIndex(e => e.id == item) != -1) {
                this.deleteLine(item);
            }
        })
    }

    addLine(id: string) {
        const maNdung: string = this.lstCtietBcao.find(e => e.id == id)?.maNdung;
        let lstNdung = this.noiDungs;
        // if (!this.data.extraDataPL2?.maNdung) {
        //     lstNdung = lstNdung.filter(e => e.ma != this.maCntt)
        // }
        // if (!this.data.extraDataPL3?.maNdung) {
        //     lstNdung = lstNdung.filter(e => e.ma != this.maSuaChua)
        // }
        const obj = {
            ma: maNdung,
            lstDanhMuc: lstNdung,
        }

        const modalIn = this.modal.create({
            nzTitle: 'Danh sách nội dung ',
            nzContent: DialogChonDanhMucComponent,
            nzMaskClosable: false,
            nzClosable: false,
            nzWidth: '65%',
            nzFooter: null,
            nzComponentParams: {
                obj: obj
            },
        });
        modalIn.afterClose.subscribe((res) => {
            if (res) {
                const index: number = this.lstCtietBcao.findIndex(e => e.maNdung == res.ma);
                if (index == -1) {
                    const data: ItemData = {
                        ...new ItemData(),
                        maNdung: res.ma,
                        level: this.noiDungs.find(e => e.ma == res.ma)?.level,
                        tenNdung: this.noiDungs.find(e => e.ma == res.ma)?.giaTri,
                    };
                    if (this.lstCtietBcao.length == 0) {
                        this.lstCtietBcao = Table.addHead(data, this.lstCtietBcao);
                    } else {
                        this.addSame(id, data);
                    }
                }
                id = this.lstCtietBcao.find(e => e.maNdung == res.ma)?.id;
                res.lstDanhMuc.forEach(item => {
                    if (this.lstCtietBcao.findIndex(e => e.maNdung == item.ma) == -1) {
                        const data: ItemData = {
                            ...new ItemData(),
                            maNdung: item.ma,
                            level: item.level,
                            tenNdung: item.giaTri,
                        };
                        this.addLow(id, data);
                    }
                })
                this.updateEditCache();
            }
        });

    }

    getLowStatus(str: string) {
        return this.lstCtietBcao.findIndex(e => Table.preIndex(e.stt) == str) != -1;
    }

    getDeleteStatus(data: ItemData) {
        return this.luyKes.findIndex(e => e.maNdung == data.maNdung) != -1;
    }

    sum(stt: string) {
        stt = Table.preIndex(stt);
        while (stt != '0') {
            const index = this.lstCtietBcao.findIndex(e => e.stt == stt);
            this.keys.forEach(key => {
                this.lstCtietBcao[index][key] = null;
            })
            // const data = this.lstCtietBcao[index];
            // this.lstCtietBcao[index] = {
            //     ... new ItemData(),
            //     id: data.id,
            //     stt: data.stt,
            //     checked: data.checked,
            //     level: data.level,
            //     maNdung: data.maNdung,
            //     tenNdung: data.tenNdung,
            // }
            this.lstCtietBcao.forEach(item => {
                if (Table.preIndex(item.stt) == stt) {
                    this.keys.forEach(key => {
                        this.lstCtietBcao[index][key] = Operator.sum([this.lstCtietBcao[index][key], item[key]]);
                    })
                }
            })
            this.lstCtietBcao[index].giaiNganThangBcaoTcongTle = Operator.percent(this.lstCtietBcao[index].giaiNganThangBcaoTcong, this.lstCtietBcao[index].kphiSdungTcong);
            this.lstCtietBcao[index].giaiNganThangBcaoDtoanTle = Operator.percent(this.lstCtietBcao[index].giaiNganThangBcaoDtoan, this.lstCtietBcao[index].kphiSdungDtoan);
            this.lstCtietBcao[index].giaiNganThangBcaoNguonKhacTle = Operator.percent(this.lstCtietBcao[index].giaiNganThangBcaoNguonKhac, this.lstCtietBcao[index].kphiSdungNguonKhac);
            this.lstCtietBcao[index].giaiNganThangBcaoNguonQuyTle = Operator.percent(this.lstCtietBcao[index].giaiNganThangBcaoNguonQuy, this.lstCtietBcao[index].kphiSdungNguonQuy);
            this.lstCtietBcao[index].giaiNganThangBcaoNsttTle = Operator.percent(this.lstCtietBcao[index].giaiNganThangBcaoNstt, this.lstCtietBcao[index].kphiSdungNstt);
            this.lstCtietBcao[index].giaiNganThangBcaoCkTle = Operator.percent(this.lstCtietBcao[index].giaiNganThangBcaoCk, this.lstCtietBcao[index].kphiSdungCk);
            this.lstCtietBcao[index].luyKeGiaiNganTcongTle = Operator.percent(this.lstCtietBcao[index].luyKeGiaiNganTcong, this.lstCtietBcao[index].kphiSdungTcong);
            this.lstCtietBcao[index].luyKeGiaiNganDtoanTle = Operator.percent(this.lstCtietBcao[index].luyKeGiaiNganDtoan, this.lstCtietBcao[index].kphiSdungDtoan);
            this.lstCtietBcao[index].luyKeGiaiNganNguonKhacTle = Operator.percent(this.lstCtietBcao[index].luyKeGiaiNganNguonKhac, this.lstCtietBcao[index].kphiSdungNguonKhac);
            this.lstCtietBcao[index].luyKeGiaiNganNguonQuyTle = Operator.percent(this.lstCtietBcao[index].luyKeGiaiNganNguonQuy, this.lstCtietBcao[index].kphiSdungNguonQuy);
            this.lstCtietBcao[index].luyKeGiaiNganNsttTle = Operator.percent(this.lstCtietBcao[index].luyKeGiaiNganNstt, this.lstCtietBcao[index].kphiSdungNstt);
            this.lstCtietBcao[index].luyKeGiaiNganCkTle = Operator.percent(this.lstCtietBcao[index].luyKeGiaiNganCk, this.lstCtietBcao[index].kphiSdungCk);
            stt = Table.preIndex(stt);
        }
        this.getTotal();
    }

    getTotal() {
        this.total = new ItemData();
        this.lstCtietBcao.forEach(item => {
            if (item.level == 0) {
                this.keys.forEach(key => {
                    this.total[key] = Operator.sum([this.total[key], item[key]]);
                })
            }
        })
        this.total.giaiNganThangBcaoTcongTle = Operator.percent(this.total.giaiNganThangBcaoTcong, this.total.kphiSdungTcong);
        this.total.giaiNganThangBcaoDtoanTle = Operator.percent(this.total.giaiNganThangBcaoDtoan, this.total.kphiSdungDtoan);
        this.total.giaiNganThangBcaoNguonKhacTle = Operator.percent(this.total.giaiNganThangBcaoNguonKhac, this.total.kphiSdungNguonKhac);
        this.total.giaiNganThangBcaoNguonQuyTle = Operator.percent(this.total.giaiNganThangBcaoNguonQuy, this.total.kphiSdungNguonQuy);
        this.total.giaiNganThangBcaoNsttTle = Operator.percent(this.total.giaiNganThangBcaoNstt, this.total.kphiSdungNstt);
        this.total.giaiNganThangBcaoCkTle = Operator.percent(this.total.giaiNganThangBcaoCk, this.total.kphiSdungCk);
        this.total.luyKeGiaiNganTcongTle = Operator.percent(this.total.luyKeGiaiNganTcong, this.total.kphiSdungTcong);
        this.total.luyKeGiaiNganDtoanTle = Operator.percent(this.total.luyKeGiaiNganDtoan, this.total.kphiSdungDtoan);
        this.total.luyKeGiaiNganNguonKhacTle = Operator.percent(this.total.luyKeGiaiNganNguonKhac, this.total.kphiSdungNguonKhac);
        this.total.luyKeGiaiNganNguonQuyTle = Operator.percent(this.total.luyKeGiaiNganNguonQuy, this.total.kphiSdungNguonQuy);
        this.total.luyKeGiaiNganNsttTle = Operator.percent(this.total.luyKeGiaiNganNstt, this.total.kphiSdungNstt);
        this.total.luyKeGiaiNganCkTle = Operator.percent(this.total.luyKeGiaiNganCk, this.total.kphiSdungCk);
    }

    changeModel(id: string) {
        const data = this.lstCtietBcao.find(e => e.id === id);
        this.editCache[id].data.kphiSdungDtoan = Operator.sum([this.editCache[id].data.kphiChuyenSangDtoan, this.editCache[id].data.dtoanGiaoDtoan]);
        this.editCache[id].data.kphiSdungNguonKhac = Operator.sum([this.editCache[id].data.kphiChuyenSangNguonKhac, this.editCache[id].data.dtoanGiaoNguonKhac]);
        this.editCache[id].data.kphiSdungNguonQuy = Operator.sum([this.editCache[id].data.kphiChuyenSangNguonQuy, this.editCache[id].data.dtoanGiaoNguonQuy]);
        this.editCache[id].data.kphiSdungNstt = Operator.sum([this.editCache[id].data.kphiChuyenSangNstt, this.editCache[id].data.dtoanGiaoNstt]);
        this.editCache[id].data.kphiSdungCk = Operator.sum([this.editCache[id].data.kphiChuyenSangCk, this.editCache[id].data.dtoanGiaoCk]);

        this.editCache[id].data.kphiSdungTcong = Operator.sum([this.editCache[id].data.kphiSdungDtoan, this.editCache[id].data.kphiSdungNguonKhac, this.editCache[id].data.kphiSdungNguonQuy,
        this.editCache[id].data.kphiSdungNstt, this.editCache[id].data.kphiSdungCk]);

        this.editCache[id].data.kphiChuyenSangTcong = Operator.sum([this.editCache[id].data.kphiChuyenSangDtoan, this.editCache[id].data.kphiChuyenSangNguonKhac, this.editCache[id].data.kphiChuyenSangNguonQuy,
        this.editCache[id].data.kphiChuyenSangNstt, this.editCache[id].data.kphiChuyenSangCk]);

        this.editCache[id].data.dtoanGiaoTcong = Operator.sum([this.editCache[id].data.dtoanGiaoDtoan, this.editCache[id].data.dtoanGiaoNguonKhac, this.editCache[id].data.dtoanGiaoNguonQuy,
        this.editCache[id].data.dtoanGiaoNstt, this.editCache[id].data.dtoanGiaoCk]);

        this.editCache[id].data.giaiNganThangBcaoTcong = Operator.sum([this.editCache[id].data.giaiNganThangBcaoDtoan, this.editCache[id].data.giaiNganThangBcaoNguonKhac, this.editCache[id].data.giaiNganThangBcaoNguonQuy,
        this.editCache[id].data.giaiNganThangBcaoNstt, this.editCache[id].data.giaiNganThangBcaoCk]);

        this.editCache[id].data.luyKeGiaiNganTcong = Operator.sum([this.editCache[id].data.luyKeGiaiNganDtoan, this.editCache[id].data.luyKeGiaiNganNguonKhac, this.editCache[id].data.luyKeGiaiNganNguonQuy,
        this.editCache[id].data.luyKeGiaiNganNstt, this.editCache[id].data.luyKeGiaiNganCk]);

        // cong luy ke
        this.editCache[id].data.luyKeGiaiNganTcong = Operator.sum([data.luyKeGiaiNganTcong, this.editCache[id].data.giaiNganThangBcaoTcong, -data.giaiNganThangBcaoTcong]);
        this.editCache[id].data.luyKeGiaiNganDtoan = Operator.sum([data.luyKeGiaiNganDtoan, this.editCache[id].data.giaiNganThangBcaoDtoan, -data.giaiNganThangBcaoDtoan]);
        this.editCache[id].data.luyKeGiaiNganNguonKhac = Operator.sum([data.luyKeGiaiNganNguonKhac, this.editCache[id].data.giaiNganThangBcaoNguonKhac, -data.giaiNganThangBcaoNguonKhac]);
        this.editCache[id].data.luyKeGiaiNganNguonQuy = Operator.sum([data.luyKeGiaiNganNguonQuy, this.editCache[id].data.giaiNganThangBcaoNguonQuy, -data.giaiNganThangBcaoNguonQuy]);
        this.editCache[id].data.luyKeGiaiNganNstt = Operator.sum([data.luyKeGiaiNganNstt, this.editCache[id].data.giaiNganThangBcaoNstt, -data.giaiNganThangBcaoNstt]);
        this.editCache[id].data.luyKeGiaiNganCk = Operator.sum([data.luyKeGiaiNganCk, this.editCache[id].data.giaiNganThangBcaoCk, -data.giaiNganThangBcaoCk]);

        //tinh ty le
        this.editCache[id].data.giaiNganThangBcaoTcongTle = Operator.percent(this.editCache[id].data.giaiNganThangBcaoTcong, this.editCache[id].data.kphiSdungTcong);
        this.editCache[id].data.giaiNganThangBcaoDtoanTle = Operator.percent(this.editCache[id].data.giaiNganThangBcaoDtoan, this.editCache[id].data.kphiSdungDtoan);
        this.editCache[id].data.giaiNganThangBcaoNguonKhacTle = Operator.percent(this.editCache[id].data.giaiNganThangBcaoNguonKhac, this.editCache[id].data.kphiSdungNguonKhac);
        this.editCache[id].data.giaiNganThangBcaoNguonQuyTle = Operator.percent(this.editCache[id].data.giaiNganThangBcaoNguonQuy, this.editCache[id].data.kphiSdungNguonQuy);
        this.editCache[id].data.giaiNganThangBcaoNsttTle = Operator.percent(this.editCache[id].data.giaiNganThangBcaoNstt, this.editCache[id].data.kphiSdungNstt);
        this.editCache[id].data.giaiNganThangBcaoCkTle = Operator.percent(this.editCache[id].data.giaiNganThangBcaoCk, this.editCache[id].data.kphiSdungCk);
        this.editCache[id].data.luyKeGiaiNganTcongTle = Operator.percent(this.editCache[id].data.luyKeGiaiNganTcong, this.editCache[id].data.kphiSdungTcong);
        this.editCache[id].data.luyKeGiaiNganDtoanTle = Operator.percent(this.editCache[id].data.luyKeGiaiNganDtoan, this.editCache[id].data.kphiSdungDtoan);
        this.editCache[id].data.luyKeGiaiNganNguonKhacTle = Operator.percent(this.editCache[id].data.luyKeGiaiNganNguonKhac, this.editCache[id].data.kphiSdungNguonKhac);
        this.editCache[id].data.luyKeGiaiNganNguonQuyTle = Operator.percent(this.editCache[id].data.luyKeGiaiNganNguonQuy, this.editCache[id].data.kphiSdungNguonQuy);
        this.editCache[id].data.luyKeGiaiNganNsttTle = Operator.percent(this.editCache[id].data.luyKeGiaiNganNstt, this.editCache[id].data.kphiSdungNstt);
        this.editCache[id].data.luyKeGiaiNganCkTle = Operator.percent(this.editCache[id].data.luyKeGiaiNganCk, this.editCache[id].data.kphiSdungCk)
    }

    //chuyen du lieu tu phu luc 2 va 3 sang phu luc 1
    // linkData(ma: string) {
    //     if (this.data.extraDataPL2 && ma == this.data.extraDataPL2?.maNdung) {
    //         const index = this.lstCtietBcao.findIndex(e => e.maNdung == this.data.extraDataPL2.maNdung);
    //         if (index != -1) {
    //             this.lstCtietBcao[index].dtoanGiaoDtoan = this.data.extraDataPL2.dtoanGiaoDtoan;
    //             this.lstCtietBcao[index].dtoanGiaoNguonKhac = this.data.extraDataPL2.dtoanGiaoNguonKhac;
    //             this.lstCtietBcao[index].dtoanGiaoNguonQuy = this.data.extraDataPL2.dtoanGiaoNguonQuy;
    //             this.lstCtietBcao[index].giaiNganThangBcaoDtoan = this.data.extraDataPL2.giaiNganThangBcaoDtoan;
    //             this.lstCtietBcao[index].giaiNganThangBcaoNguonKhac = this.data.extraDataPL2.giaiNganThangBcaoNguonKhac;
    //             this.lstCtietBcao[index].giaiNganThangBcaoNguonQuy = this.data.extraDataPL2.giaiNganThangBcaoNguonQuy;
    //             this.lstCtietBcao[index].luyKeGiaiNganDtoan = this.data.extraDataPL2.luyKeGiaiNganDtoan;
    //             this.lstCtietBcao[index].luyKeGiaiNganNguonKhac = this.data.extraDataPL2.luyKeGiaiNganNguonKhac;
    //             this.lstCtietBcao[index].luyKeGiaiNganNguonQuy = this.data.extraDataPL2.luyKeGiaiNganNguonQuy;
    //             this.changeData(index);
    //         }
    //     }
    //     if (this.data.extraDataPL3 && ma == this.data.extraDataPL3?.maNdung) {
    //         const index = this.lstCtietBcao.findIndex(e => e.maNdung == this.data.extraDataPL3.maNdung);
    //         if (index != -1) {
    //             this.lstCtietBcao[index].dtoanGiaoDtoan = this.data.extraDataPL3.dtoanGiaoDtoan;
    //             this.lstCtietBcao[index].giaiNganThangBcaoDtoan = this.data.extraDataPL3.giaiNganThangBcaoDtoan;
    //             this.lstCtietBcao[index].luyKeGiaiNganDtoan = this.data.extraDataPL3.luyKeGiaiNganDtoan;
    //             this.changeData(index);
    //         }

    //     }
    // }

    // changeData(index: number) {
    //     this.lstCtietBcao[index].kphiSdungDtoan = Operator.sum([this.lstCtietBcao[index].kphiChuyenSangDtoan, this.lstCtietBcao[index].dtoanGiaoDtoan]);
    //     this.lstCtietBcao[index].kphiSdungNguonKhac = Operator.sum([this.lstCtietBcao[index].kphiChuyenSangNguonKhac, this.lstCtietBcao[index].dtoanGiaoNguonKhac]);
    //     this.lstCtietBcao[index].kphiSdungNguonQuy = Operator.sum([this.lstCtietBcao[index].kphiChuyenSangNguonQuy, this.lstCtietBcao[index].dtoanGiaoNguonQuy]);

    //     this.lstCtietBcao[index].kphiSdungTcong = Operator.sum([this.lstCtietBcao[index].kphiSdungDtoan, this.lstCtietBcao[index].kphiSdungNguonKhac, this.lstCtietBcao[index].kphiSdungNguonQuy,
    //     this.lstCtietBcao[index].kphiSdungNstt, this.lstCtietBcao[index].kphiSdungCk]);

    //     this.lstCtietBcao[index].dtoanGiaoTcong = Operator.sum([this.lstCtietBcao[index].dtoanGiaoDtoan, this.lstCtietBcao[index].dtoanGiaoNguonKhac, this.lstCtietBcao[index].dtoanGiaoNguonQuy,
    //     this.lstCtietBcao[index].dtoanGiaoNstt, this.lstCtietBcao[index].dtoanGiaoCk]);

    //     this.lstCtietBcao[index].giaiNganThangBcaoTcong = Operator.sum([this.lstCtietBcao[index].giaiNganThangBcaoDtoan, this.lstCtietBcao[index].giaiNganThangBcaoNguonKhac, this.lstCtietBcao[index].giaiNganThangBcaoNguonQuy,
    //     this.lstCtietBcao[index].giaiNganThangBcaoNstt, this.lstCtietBcao[index].giaiNganThangBcaoCk]);

    //     this.lstCtietBcao[index].luyKeGiaiNganTcong = Operator.sum([this.lstCtietBcao[index].luyKeGiaiNganDtoan, this.lstCtietBcao[index].luyKeGiaiNganNguonKhac, this.lstCtietBcao[index].luyKeGiaiNganNguonQuy,
    //     this.lstCtietBcao[index].luyKeGiaiNganNstt, this.lstCtietBcao[index].luyKeGiaiNganCk]);
    //     //tinh lai ty le
    //     this.lstCtietBcao[index].giaiNganThangBcaoTcongTle = Operator.percent(this.lstCtietBcao[index].giaiNganThangBcaoTcong, this.lstCtietBcao[index].kphiSdungTcong);
    //     this.lstCtietBcao[index].giaiNganThangBcaoDtoanTle = Operator.percent(this.lstCtietBcao[index].giaiNganThangBcaoDtoan, this.lstCtietBcao[index].kphiSdungDtoan);
    //     this.lstCtietBcao[index].giaiNganThangBcaoNguonKhacTle = Operator.percent(this.lstCtietBcao[index].giaiNganThangBcaoNguonKhac, this.lstCtietBcao[index].kphiSdungNguonKhac);
    //     this.lstCtietBcao[index].giaiNganThangBcaoNguonQuyTle = Operator.percent(this.lstCtietBcao[index].giaiNganThangBcaoNguonQuy, this.lstCtietBcao[index].kphiSdungNguonQuy);
    //     this.lstCtietBcao[index].luyKeGiaiNganTcongTle = Operator.percent(this.lstCtietBcao[index].luyKeGiaiNganTcong, this.lstCtietBcao[index].kphiSdungTcong);
    //     this.lstCtietBcao[index].luyKeGiaiNganDtoanTle = Operator.percent(this.lstCtietBcao[index].luyKeGiaiNganDtoan, this.lstCtietBcao[index].kphiSdungDtoan);
    //     this.lstCtietBcao[index].luyKeGiaiNganNguonKhacTle = Operator.percent(this.lstCtietBcao[index].luyKeGiaiNganNguonKhac, this.lstCtietBcao[index].kphiSdungNguonKhac);
    //     this.lstCtietBcao[index].luyKeGiaiNganNguonQuyTle = Operator.percent(this.lstCtietBcao[index].luyKeGiaiNganNguonQuy, this.lstCtietBcao[index].kphiSdungNguonQuy);
    //     this.sum(this.lstCtietBcao[index].stt)
    // }

    // xoa file trong bang file
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
            { t: 0, b: 3, l: 0, r: 43, val: null },
            { t: 0, b: 3, l: 0, r: 0, val: 'STT' },
            { t: 0, b: 3, l: 1, r: 1, val: 'Đơn vị - nội dung' },
            { t: 0, b: 0, l: 2, r: 7, val: 'Kinh phí được sử dụng năm ' + this.namBcao.toString() },
            { t: 1, b: 3, l: 2, r: 2, val: 'Tổng cộng' },
            { t: 1, b: 1, l: 3, r: 7, val: 'Trong đó' },
            { t: 2, b: 3, l: 3, r: 3, val: 'Dự toán NSNN' },
            { t: 2, b: 3, l: 4, r: 4, val: 'Nguồn khác (nguồn thu SN, lệ phí hải quan...)' },
            { t: 2, b: 3, l: 5, r: 5, val: 'Nguồn quỹ' },
            { t: 2, b: 3, l: 6, r: 6, val: 'Vốn NSTT' },
            { t: 2, b: 3, l: 7, r: 7, val: 'Vốn CK' },
            { t: 0, b: 0, l: 8, r: 13, val: 'Nguồn kinh phí năm trước được chuyển sang năm ' + this.namBcao.toString() + ' sử dụng:' },
            { t: 1, b: 3, l: 8, r: 8, val: 'Tổng cộng' },
            { t: 1, b: 1, l: 9, r: 13, val: 'Trong đó' },
            { t: 2, b: 3, l: 9, r: 9, val: 'Dự toán NSNN' },
            { t: 2, b: 3, l: 10, r: 10, val: 'Nguồn khác (nguồn thu SN, lệ phí hải quan...)' },
            { t: 2, b: 3, l: 11, r: 11, val: 'Nguồn quỹ' },
            { t: 2, b: 3, l: 12, r: 12, val: 'Vốn NSTT' },
            { t: 2, b: 3, l: 13, r: 13, val: 'Vốn CK' },
            { t: 0, b: 0, l: 14, r: 19, val: 'Dự toán giao, phê duyệt sử dụng nguồn kinh phí năm ' + this.namBcao.toString() },
            { t: 1, b: 3, l: 14, r: 14, val: 'Tổng cộng' },
            { t: 1, b: 1, l: 15, r: 19, val: 'Trong đó' },
            { t: 2, b: 3, l: 15, r: 15, val: 'Dự toán NSNN' },
            { t: 2, b: 3, l: 16, r: 16, val: 'Nguồn khác (nguồn thu SN, lệ phí hải quan...)' },
            { t: 2, b: 3, l: 17, r: 17, val: 'Nguồn quỹ' },
            { t: 2, b: 3, l: 18, r: 18, val: 'Vốn NSTT' },
            { t: 2, b: 3, l: 19, r: 19, val: 'Vốn CK' },
            { t: 0, b: 0, l: 20, r: 31, val: 'Giải ngân tháng báo cáo' },
            { t: 1, b: 2, l: 20, r: 21, val: 'Tổng cộng' },
            { t: 3, b: 3, l: 20, r: 20, val: 'Cộng' },
            { t: 3, b: 3, l: 21, r: 21, val: 'Tỷ lệ (%)' },
            { t: 1, b: 1, l: 22, r: 31, val: 'Trong đó' },
            { t: 2, b: 2, l: 22, r: 23, val: 'Dự toán NSNN' },
            { t: 3, b: 3, l: 22, r: 22, val: 'Số tiền' },
            { t: 3, b: 3, l: 23, r: 23, val: 'Tỷ lệ (%)' },
            { t: 2, b: 2, l: 24, r: 25, val: 'Nguồn khác (nguồn thu SN, lệ phí hải quan...)' },
            { t: 3, b: 3, l: 24, r: 24, val: 'Số tiền' },
            { t: 3, b: 3, l: 25, r: 25, val: 'Tỷ lệ (%)' },
            { t: 2, b: 2, l: 26, r: 27, val: 'Nguồn quỹ' },
            { t: 3, b: 3, l: 26, r: 26, val: 'Số tiền' },
            { t: 3, b: 3, l: 27, r: 27, val: 'Tỷ lệ (%)' },
            { t: 2, b: 2, l: 28, r: 29, val: 'Vốn NSTT' },
            { t: 3, b: 3, l: 28, r: 28, val: 'Số tiền' },
            { t: 3, b: 3, l: 29, r: 29, val: 'Tỷ lệ (%)' },
            { t: 2, b: 2, l: 30, r: 31, val: 'Vốn CK' },
            { t: 3, b: 3, l: 30, r: 30, val: 'Số tiền' },
            { t: 3, b: 3, l: 31, r: 31, val: 'Tỷ lệ (%)' },
            { t: 0, b: 0, l: 32, r: 43, val: 'Lũy kế giải ngân từ đầu năm đến tháng báo cáo đối với báo cáo tháng(đến hết thời gian chỉnh lý quyết toán ngân sách - ngày 31/1 năm sau đối với báo cáo năm): Tổng của 12 tháng' },
            { t: 1, b: 2, l: 32, r: 33, val: 'Tổng cộng' },
            { t: 3, b: 3, l: 32, r: 32, val: 'Cộng' },
            { t: 3, b: 3, l: 33, r: 33, val: 'Tỷ lệ (%)' },
            { t: 1, b: 1, l: 34, r: 43, val: 'Trong đó' },
            { t: 2, b: 2, l: 34, r: 35, val: 'Dự toán NSNN' },
            { t: 3, b: 3, l: 34, r: 34, val: 'Số tiền' },
            { t: 3, b: 3, l: 35, r: 35, val: 'Tỷ lệ (%)' },
            { t: 2, b: 2, l: 36, r: 37, val: 'Nguồn khác (nguồn thu SN, lệ phí hải quan...)' },
            { t: 3, b: 3, l: 36, r: 36, val: 'Số tiền' },
            { t: 3, b: 3, l: 37, r: 37, val: 'Tỷ lệ (%)' },
            { t: 2, b: 2, l: 38, r: 39, val: 'Nguồn quỹ' },
            { t: 3, b: 3, l: 38, r: 38, val: 'Số tiền' },
            { t: 3, b: 3, l: 39, r: 39, val: 'Tỷ lệ (%)' },
            { t: 2, b: 2, l: 40, r: 41, val: 'Vốn NSTT' },
            { t: 3, b: 3, l: 40, r: 40, val: 'Số tiền' },
            { t: 3, b: 3, l: 41, r: 41, val: 'Tỷ lệ (%)' },
            { t: 2, b: 2, l: 42, r: 43, val: 'Vốn CK' },
            { t: 3, b: 3, l: 42, r: 42, val: 'Số tiền' },
            { t: 3, b: 3, l: 43, r: 43, val: 'Tỷ lệ (%)' },
        ]
        const fieldOrder = ['stt', 'tenNdung', 'kphiSdungTcong', 'kphiSdungDtoan', 'kphiSdungNguonKhac', 'kphiSdungNguonQuy', 'kphiSdungNstt', 'kphiSdungCk', 'kphiChuyenSangTcong', 'kphiChuyenSangDtoan',
            'kphiChuyenSangNguonKhac', 'kphiChuyenSangNguonQuy', 'kphiChuyenSangNstt', 'kphiChuyenSangCk', 'dtoanGiaoTcong', 'dtoanGiaoDtoan', 'dtoanGiaoNguonKhac', 'dtoanGiaoNguonQuy', 'dtoanGiaoNstt',
            'dtoanGiaoCk', 'giaiNganThangBcaoTcong', 'giaiNganThangBcaoTcongTle', 'giaiNganThangBcaoDtoan', 'giaiNganThangBcaoDtoanTle', 'giaiNganThangBcaoNguonKhac', 'giaiNganThangBcaoNguonKhacTle',
            'giaiNganThangBcaoNguonQuy', 'giaiNganThangBcaoNguonQuyTle', 'giaiNganThangBcaoNstt', 'giaiNganThangBcaoNsttTle', 'giaiNganThangBcaoCk', 'giaiNganThangBcaoCkTle', 'luyKeGiaiNganTcong',
            'luyKeGiaiNganTcongTle', 'luyKeGiaiNganDtoan', 'luyKeGiaiNganDtoanTle', 'luyKeGiaiNganNguonKhac', 'luyKeGiaiNganNguonKhacTle', 'luyKeGiaiNganNguonQuy', 'luyKeGiaiNganNguonQuyTle', 'luyKeGiaiNganNstt',
            'luyKeGiaiNganNsttTle', 'luyKeGiaiNganCk', 'luyKeGiaiNganCkTle'];
        const filterData = this.lstCtietBcao.map(item => {
            const row: any = {};
            fieldOrder.forEach(field => {
                row[field] = item[field]
            })
            return row;
        })
        filterData.forEach(item => {
            const level = item.stt.split('.').length - 2;
            item.stt = this.getIndex(item.stt);
            for (let i = 0; i < level; i++) {
                item.stt = '   ' + item.stt;
            }
        })

        const workbook = XLSX.utils.book_new();
        const worksheet = Table.initExcel(header);
        XLSX.utils.sheet_add_json(worksheet, filterData, { skipHeader: true, origin: Table.coo(header[0].l, header[0].b + 1) })
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Dữ liệu');
        XLSX.writeFile(workbook, this.dataInfo.maBcao + '_Phu_Luc_I.xlsx');
    }
}

