import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { Operator, Status, Table, Utils } from "src/app/Utility/utils";
import { DialogChonDanhMucChoBieuMauComponent } from 'src/app/components/dialog/dialog-chon-danh-muc-cho-bieu-mau/dialog-chon-danh-muc-cho-bieu-mau.component';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { DanhMucDungChungService } from 'src/app/services/danh-muc-dung-chung.service';
import { BaoCaoThucHienDuToanChiService } from 'src/app/services/quan-ly-von-phi/baoCaoThucHienDuToanChi.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import * as uuid from "uuid";
import * as XLSX from 'xlsx';
import { BtnStatus, Doc, Dtc, Form } from '../../bao-cao-thuc-hien-du-toan-chi.constant';

export class ItemData {
    id: string;
    stt: string;
    checked: boolean;
    level: number;
    maDan: string;
    tenDan: string;
    ddiemXdung: string;
    qddtSoQdinh: string;
    qddtTmdtTso: number;
    qddtTmdtNsnn: number;
    luyKeVonTso: number;
    luyKeVonNsnn: number;
    luyKeVonDt: number;
    luyKeVonThue: number;
    luyKeVonScl: number;
    luyKeGiaiNganHetNamTso: number;
    luyKeGiaiNganHetNamNsnnTso: number;
    luyKeGiaiNganHetNamNsnnKhNamTruoc: number;
    khoachVonNamTruocKeoDaiTso: number;
    khoachVonNamTruocKeoDaiDtpt: number;
    khoachVonNamTruocKeoDaiVonKhac: number;
    khoachNamVonTso: number;
    khoachNamVonNsnn: number;
    khoachNamVonDt: number;
    khoachNamVonThue: number;
    khoachNamVonScl: number;
    kluongThienTso: number;
    kluongThienThangBcao: number;
    giaiNganTso: number;
    giaiNganTsoTle: number;
    giaiNganNsnn: number;
    giaiNganNsnnVonDt: number;
    giaiNganNsnnVonThue: number;
    giaiNganNsnnVonScl: number;
    giaiNganNsnnTle: number;
    giaiNganNsnnTleVonDt: number;
    giaiNganNsnnTleVonThue: number;
    giaiNganNsnnTleVonScl: number;
    luyKeGiaiNganDauNamTso: number;
    luyKeGiaiNganDauNamTsoTle: number;
    luyKeGiaiNganDauNamNsnn: number;
    luyKeGiaiNganDauNamNsnnVonDt: number;
    luyKeGiaiNganDauNamNsnnVonThue: number;
    luyKeGiaiNganDauNamNsnnVonScl: number;
    luyKeGiaiNganDauNamNsnnTle: number;
    luyKeGiaiNganDauNamNsnnTleVonDt: number;
    luyKeGiaiNganDauNamNsnnTleVonThue: number;
    luyKeGiaiNganDauNamNsnnTleVonScl: number;
    ndungCviecHthanhCuoiThang: number;
    ndungCviecDangThien: number;
    khoachThienNdungCviecThangConLaiNam: number;
    ghiChu: string;

    constructor(data: Partial<Pick<ItemData, keyof ItemData>>) {
        Object.assign(this, data);
    }

    sum() {
        this.luyKeVonTso = Operator.sum([this.luyKeVonNsnn, this.luyKeVonDt, this.luyKeVonThue, this.luyKeVonScl]);
        this.khoachVonNamTruocKeoDaiTso = Operator.sum([this.khoachVonNamTruocKeoDaiDtpt, this.khoachVonNamTruocKeoDaiVonKhac]);
        this.khoachNamVonTso = Operator.sum([this.khoachNamVonNsnn, this.khoachNamVonDt, this.khoachNamVonThue, this.khoachNamVonScl]);
        this.giaiNganTso = Operator.sum([this.giaiNganNsnn, this.giaiNganNsnnVonDt, this.giaiNganNsnnVonThue, this.giaiNganNsnnVonScl]);
        this.luyKeGiaiNganDauNamTso = Operator.sum([this.luyKeGiaiNganDauNamNsnn, this.luyKeGiaiNganDauNamNsnnVonDt, this.luyKeGiaiNganDauNamNsnnVonThue, this.luyKeGiaiNganDauNamNsnnVonScl]);
    }

    luyKe(data: ItemData) {
        this.luyKeGiaiNganDauNamTso = Operator.sum([data.luyKeGiaiNganDauNamTso, this.giaiNganTso, - data.giaiNganTso]);
        this.luyKeGiaiNganDauNamNsnn = Operator.sum([data.luyKeGiaiNganDauNamNsnn, this.giaiNganNsnn, - data.giaiNganNsnn]);
        this.luyKeGiaiNganDauNamNsnnVonDt = Operator.sum([data.luyKeGiaiNganDauNamNsnnVonDt, this.giaiNganNsnnVonDt, - data.giaiNganNsnnVonDt]);
        this.luyKeGiaiNganDauNamNsnnVonThue = Operator.sum([data.luyKeGiaiNganDauNamNsnnVonThue, this.giaiNganNsnnVonThue, - data.giaiNganNsnnVonThue]);
        this.luyKeGiaiNganDauNamNsnnVonScl = Operator.sum([data.luyKeGiaiNganDauNamNsnnVonScl, this.giaiNganNsnnVonScl, - data.giaiNganNsnnVonScl]);
    }

    tyLe() {
        this.giaiNganTsoTle = Operator.percent(this.giaiNganTso, this.khoachNamVonTso);
        this.giaiNganNsnnTle = Operator.percent(this.giaiNganNsnn, this.khoachNamVonNsnn);
        this.giaiNganNsnnTleVonDt = Operator.percent(this.giaiNganNsnnVonDt, this.khoachNamVonDt);
        this.giaiNganNsnnTleVonThue = Operator.percent(this.giaiNganNsnnVonThue, this.khoachNamVonThue);
        this.giaiNganNsnnTleVonScl = Operator.percent(this.giaiNganNsnnVonScl, this.khoachNamVonScl);
        this.luyKeGiaiNganDauNamTsoTle = Operator.percent(this.luyKeGiaiNganDauNamTso, this.khoachNamVonTso);
        this.luyKeGiaiNganDauNamNsnnTle = Operator.percent(this.luyKeGiaiNganDauNamNsnn, this.khoachNamVonNsnn);
        this.luyKeGiaiNganDauNamNsnnTleVonDt = Operator.percent(this.luyKeGiaiNganDauNamNsnnVonDt, this.khoachNamVonDt);
        this.luyKeGiaiNganDauNamNsnnTleVonThue = Operator.percent(this.luyKeGiaiNganDauNamNsnnVonThue, this.khoachNamVonThue);
        this.luyKeGiaiNganDauNamNsnnTleVonScl = Operator.percent(this.luyKeGiaiNganDauNamNsnnVonScl, this.khoachNamVonScl);
    }

    upperBound() {
        return this.qddtTmdtTso > Utils.MONEY_LIMIT || this.qddtTmdtNsnn > Utils.MONEY_LIMIT || this.luyKeVonTso > Utils.MONEY_LIMIT || this.luyKeGiaiNganHetNamTso > Utils.MONEY_LIMIT ||
            this.luyKeGiaiNganHetNamNsnnTso > Utils.MONEY_LIMIT || this.luyKeGiaiNganHetNamNsnnKhNamTruoc > Utils.MONEY_LIMIT || this.khoachVonNamTruocKeoDaiTso > Utils.MONEY_LIMIT ||
            this.khoachVonNamTruocKeoDaiDtpt > Utils.MONEY_LIMIT || this.khoachVonNamTruocKeoDaiVonKhac > Utils.MONEY_LIMIT || this.khoachNamVonTso > Utils.MONEY_LIMIT ||
            this.giaiNganTso > Utils.MONEY_LIMIT || this.luyKeGiaiNganDauNamTso > Utils.MONEY_LIMIT || this.kluongThienTso > Utils.MONEY_LIMIT || this.kluongThienThangBcao > Utils.MONEY_LIMIT;
    }

    index() {
        const str = this.stt.substring(this.stt.indexOf('.') + 1, this.stt.length);
        const chiSo: string[] = str.split('.');
        const n: number = chiSo.length - 1;
        let k: number = parseInt(chiSo[n], 10);
        switch (n) {
            case 0:
                return String.fromCharCode(k + 96).toUpperCase();
            case 1:
                return Utils.laMa(k);
            case 2:
                return chiSo[n];
            case 3:
                return chiSo[n - 1].toString() + "." + chiSo[n].toString();
            case 4:
                return '-';
            default:
                return '';
        }
    }

    filterNumberFields() {
        Object.keys(this).forEach(key => {
            if (typeof this[key] === 'number' && key != 'level') {
                this[key] = null;
            }
        })
    }

    total(data: ItemData) {
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

@Component({
    selector: 'app-phu-luc-3',
    templateUrl: './phu-luc-3.component.html',
    styleUrls: ['../bao-cao.component.scss']
})
export class PhuLucIIIComponent implements OnInit {
    @Input() dataInfo;
    Op = new Operator('1');
    Utils = Utils;
    Dtc = Dtc;
    //thong tin
    formDetail: Form = new Form();
    total: ItemData = new ItemData({});
    maDviTien: string = '1';
    scrollX: string;
    namBcao: number;
    //danh muc
    maDans: any[] = [];
    ddiemXdungs: any[] = Dtc.DIA_DIEM;
    lstCtietBcao: ItemData[] = [];
    luyKes: ItemData[] = [];
    //trang thai cac nut
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
        private quanLyVonPhiService: QuanLyVonPhiService,
        private danhMucService: DanhMucDungChungService,
        private notification: NzNotificationService,
        private modal: NzModalService,
    ) { }

    async ngOnInit() {
        this.initialization().then(() => {
            this.isDataAvailable = true;
        })
    }

    async initialization() {
        this.spinner.show();
        Object.assign(this.status, this.dataInfo.status);
        this.namBcao = this.dataInfo.namBcao;
        this.luyKes = this.dataInfo.luyKes?.lstCtietBcaos;
        await this.getFormDetail();
        if (this.status.save) {
            const category = await this.danhMucService.danhMucChungGetAll('BC_DTC_PL3');
            if (category) {
                category.data.forEach(
                    item => {
                        this.maDans.push({
                            ...item,
                            level: item.ma?.split('.').length - 2,
                        })
                    }
                )
            }
            if (this.lstCtietBcao.length == 0) {
                if (this.luyKes?.length > 0) {
                    this.luyKes?.forEach(item => {
                        const data: ItemData = new ItemData({
                            ...item,
                            id: uuid.v4() + 'FE',
                        })
                        data.sum()
                        data.tyLe();
                        this.lstCtietBcao.push(data)
                    })
                } else {
                    this.maDans.forEach(item => {
                        this.lstCtietBcao.push(new ItemData({
                            id: uuid.v4() + 'FE',
                            maDan: item.ma,
                            stt: item.ma,
                            tenDan: item.giaTri,
                            level: item.level,
                        }))
                    })
                }
            }
            this.scrollX = Table.tableWidth(350, 40, 6, 170);
        } else {
            this.scrollX = Table.tableWidth(350, 40, 6, 0);
        }

        this.lstCtietBcao.forEach(item => item.tyLe());

        if (this.lstCtietBcao.length > 0) {
            if (!this.lstCtietBcao[0].stt) {
                this.lstCtietBcao = Table.sortWithoutIndex(this.lstCtietBcao, 'maDan');
            } else {
                this.lstCtietBcao = Table.sortByIndex(this.lstCtietBcao);
            }
        }

        this.getTotal();
        this.updateEditCache();
        this.getStatusButton();
        this.spinner.hide();
    }

    getStatusButton() {
        this.status.ok = this.status.ok && (this.formDetail.trangThai == Status.NOT_RATE || this.formDetail.trangThai == Status.COMPLETE);
    }

    async getFormDetail() {
        await this.baoCaoThucHienDuToanChiService.ctietBieuMau(this.dataInfo.id).toPromise().then(
            data => {
                if (data.statusCode == 0) {
                    this.formDetail = data.data;
                    this.formDetail.maDviTien = '1';
                    this.lstCtietBcao = [];
                    this.formDetail.lstCtietBcaos.forEach(item => {
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

    // luu
    async save(trangThai: string) {
        if (this.lstCtietBcao.some(e => this.editCache[e.id].edit)) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTSAVE);
            return;
        }

        if (this.lstCtietBcao.some(e => e.upperBound())) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.MONEYRANGE);
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
            request.fileDinhKems.push(await this.quanLyVonPhiService.upFile(iterator, this.dataInfo.path));
        }
        request.lstCtietBcaos = lstCtietBcaoTemp;
        request.trangThai = trangThai;
        this.spinner.show();
        this.baoCaoThucHienDuToanChiService.baoCaoCapNhatChiTiet(request).toPromise().then(
            async data => {
                if (data.statusCode == 0) {
                    this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
                    this._modalRef.close({
                        trangThai: data.data.trangThai,
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
                    lyDoTuChoi: lyDoTuChoi,
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

    //thêm ngang cấp
    addSame(id: string, initItem: ItemData) {
        this.lstCtietBcao = Table.addParent(id, initItem, this.lstCtietBcao);
    }

    // gan editCache.data == lstCtietBcao
    updateEditCache(): void {
        this.lstCtietBcao.forEach(item => {
            this.editCache[item.id] = {
                edit: false,
                data: new ItemData(item),
            };
        });
    }
    //thêm cấp thấp hơn
    addLow(id: string, initItem: ItemData) {
        this.lstCtietBcao = Table.addChild(id, initItem, this.lstCtietBcao);
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
        if (!data.maDan) {
            this.deleteLine(id);
        }
        // lay vi tri hang minh sua
        this.editCache[id] = {
            data: new ItemData(data),
            edit: false
        };
    }

    // luu thay doi
    saveEdit(id: string): void {
        if (!this.editCache[id].data.maDan) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
            return;
        }
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

    addLine(id?: string) {
        const maDan = id ? this.lstCtietBcao.find(e => e.id == id).maDan : '0';
        const level = maDan.split('.').length - 1;
        let dmNdung = this.maDans.filter(e => e.ma.startsWith(maDan) && e.level == level);
        dmNdung = dmNdung.filter(e => this.lstCtietBcao.findIndex(item => item.maDan == e.ma) == -1);
        const modalIn = this.modal.create({
            nzTitle: 'Danh sách nội dung',
            nzContent: DialogChonDanhMucChoBieuMauComponent,
            nzMaskClosable: false,
            nzClosable: false,
            nzWidth: '600px',
            nzFooter: null,
            nzComponentParams: {
                danhSachBieuMau: dmNdung,
            },
        });
        modalIn.afterClose.subscribe((res) => {
            if (res) {
                res.forEach(item => {
                    if (item.status) {
                        const data: ItemData = new ItemData({
                            id: uuid.v4() + 'FE',
                            maDan: item.ma,
                            level: item.level,
                            tenDan: item.giaTri,
                        })
                        if (this.lstCtietBcao.length == 0) {
                            this.lstCtietBcao = Table.addHead(data, this.lstCtietBcao);
                        } else {
                            if (level == 0) {
                                const index = this.lstCtietBcao.map(item => item.level).lastIndexOf(0);
                                id = this.lstCtietBcao[index].id;
                                this.addSame(id, data);
                            } else {
                                this.addLow(id, data);
                            }
                        }
                    }
                    this.updateEditCache();
                })
            }
        });
    }

    getLowStatus(str: string) {
        return this.lstCtietBcao.findIndex(e => Table.preIndex(e.stt) == str) != -1;
    }

    getDeleteStatus(data: ItemData) {
        return this.luyKes.findIndex(e => e.maDan == data.maDan) != -1;
    }

    sum(stt: string) {
        stt = Table.preIndex(stt);
        while (stt != '0') {
            const index = this.lstCtietBcao.findIndex(e => e.stt == stt);
            this.lstCtietBcao[index].filterNumberFields()
            this.lstCtietBcao.forEach(item => {
                if (Table.preIndex(item.stt) == stt) {
                    this.lstCtietBcao[index].total(item);
                }
            })
            this.lstCtietBcao[index].tyLe();
            stt = Table.preIndex(stt);
        }
        this.getTotal();
    }

    getTotal() {
        this.total.filterNumberFields();
        this.lstCtietBcao.forEach(item => {
            if (item.level == 0) {
                this.total.total(item);
            }
        })
        this.total.tyLe();
    }

    changeModel(id: string) {
        const data = this.lstCtietBcao.find(e => e.id === id);
        this.editCache[id].data.sum();
        this.editCache[id].data.luyKe(data);
        this.editCache[id].data.tyLe();
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
        const header = [
            { t: 0, b: 7, l: 0, r: 47, val: null },
            { t: 0, b: 0, l: 0, r: 1, val: this.dataInfo.tenPl },
            { t: 1, b: 1, l: 0, r: 10, val: this.dataInfo.tieuDe },
            { t: 2, b: 2, l: 0, r: 10, val: this.dataInfo.congVan },
            { t: 4, b: 7, l: 0, r: 0, val: 'STT' },
            { t: 4, b: 7, l: 1, r: 1, val: 'Danh mục dự án' },
            { t: 4, b: 7, l: 2, r: 2, val: 'Địa điểm XD' },
            { t: 4, b: 4, l: 3, r: 5, val: 'Quyết định đầu tư' },
            { t: 5, b: 7, l: 3, r: 3, val: 'Số quyết định ngày, tháng, năm ban hành' },
            { t: 5, b: 5, l: 4, r: 5, val: 'TMDT' },
            { t: 6, b: 7, l: 4, r: 4, val: 'Tổng số (tất cả các nguồn vốn)' },
            { t: 6, b: 7, l: 5, r: 5, val: 'Trong đó: vốn NSNN' },
            { t: 4, b: 4, l: 6, r: 10, val: 'Lũy kế vốn đã bố trí đến hết năm trước năm kế hoạch' },
            { t: 5, b: 7, l: 6, r: 6, val: 'Tổng số (tất cả các nguồn vốn)' },
            { t: 5, b: 5, l: 7, r: 10, val: 'Trong đó' },
            { t: 6, b: 7, l: 7, r: 7, val: 'Nguồn NSNN' },
            { t: 6, b: 7, l: 8, r: 8, val: 'Vốn ngành DT' },
            { t: 6, b: 7, l: 9, r: 9, val: 'Vốn nghành thuế' },
            { t: 6, b: 7, l: 10, r: 10, val: 'Vốn SCL' },
            { t: 4, b: 4, l: 11, r: 13, val: 'Lũy kế vốn đã bố trí đến hết năm trước năm kế hoạch' },
            { t: 5, b: 7, l: 11, r: 11, val: 'Tổng số (tất cả các nguồn vốn)' },
            { t: 5, b: 5, l: 12, r: 13, val: 'Trong đó: NSNN' },
            { t: 6, b: 7, l: 12, r: 12, val: 'Tổng số' },
            { t: 6, b: 7, l: 13, r: 13, val: 'Trong đó: riêng năm trước năm kế hoạch' },
            { t: 4, b: 4, l: 14, r: 16, val: 'Kế hoạch vốn năm trước được cấp có thẩm quyền cho phép kéo dài sang năm KH (nếu có)' },
            { t: 5, b: 7, l: 14, r: 14, val: 'Tổng số' },
            { t: 5, b: 5, l: 15, r: 16, val: 'Trong đó' },
            { t: 6, b: 7, l: 15, r: 15, val: 'Vốn ĐTPT' },
            { t: 6, b: 7, l: 16, r: 16, val: 'Vốn khác' },
            { t: 4, b: 4, l: 17, r: 21, val: 'Kế hoạch năm kế hoạch' },
            { t: 5, b: 7, l: 17, r: 17, val: 'Tổng số (tất cả các nguồn vốn)' },
            { t: 5, b: 5, l: 18, r: 21, val: 'Trong đó' },
            { t: 6, b: 7, l: 18, r: 18, val: 'Vốn ĐTPT nguồn NSNN' },
            { t: 6, b: 7, l: 19, r: 19, val: 'Vốn ngành DT' },
            { t: 6, b: 7, l: 20, r: 20, val: 'Vốn ngành thuế' },
            { t: 6, b: 7, l: 21, r: 21, val: 'Vốn SCL' },
            { t: 4, b: 6, l: 22, r: 23, val: 'Khối lượng thực hiện từ đầu năm đến ngày 15 của tháng báo cáo' },
            { t: 7, b: 7, l: 22, r: 22, val: 'Tổng số' },
            { t: 7, b: 7, l: 23, r: 23, val: 'Riêng tháng báo cáo' },
            { t: 4, b: 4, l: 24, r: 33, val: 'Giải ngân tháng báo cáo' },
            { t: 5, b: 6, l: 24, r: 25, val: 'Tổng số (tất cả các nguồn vốn)' },
            { t: 7, b: 7, l: 24, r: 24, val: 'Số tiền' },
            { t: 7, b: 7, l: 25, r: 25, val: 'Tỷ lệ (%)' },
            { t: 5, b: 5, l: 26, r: 29, val: 'Trong đó' },
            { t: 6, b: 6, l: 26, r: 26, val: 'Vốn NSNN' },
            { t: 7, b: 7, l: 26, r: 26, val: 'Số tiền' },
            { t: 6, b: 6, l: 27, r: 27, val: 'Vốn ngành DT' },
            { t: 7, b: 7, l: 27, r: 27, val: 'Số tiền' },
            { t: 6, b: 6, l: 28, r: 28, val: 'Vốn ngành thuế' },
            { t: 7, b: 7, l: 28, r: 28, val: 'Số tiền' },
            { t: 6, b: 6, l: 29, r: 29, val: 'Vốn SCL' },
            { t: 7, b: 7, l: 29, r: 29, val: 'Số tiền' },
            { t: 5, b: 5, l: 30, r: 33, val: 'Tỷ lệ giải ngân' },
            { t: 6, b: 6, l: 30, r: 30, val: 'Vốn NSNN' },
            { t: 7, b: 7, l: 30, r: 30, val: 'Tỷ lệ (%)' },
            { t: 6, b: 6, l: 31, r: 31, val: 'Vốn ngành DT' },
            { t: 7, b: 7, l: 31, r: 31, val: 'Tỷ lệ (%)' },
            { t: 6, b: 6, l: 32, r: 32, val: 'Vốn ngành thuế' },
            { t: 7, b: 7, l: 32, r: 32, val: 'Tỷ lệ (%)' },
            { t: 6, b: 6, l: 33, r: 33, val: 'Vốn SCL' },
            { t: 7, b: 7, l: 33, r: 33, val: 'Tỷ lệ (%)' },
            { t: 4, b: 4, l: 34, r: 43, val: 'Lũy kế giải ngân từ đầu năm đến tháng báo cáo đối với báo cáo tháng (đến hết thời gian chỉnh lý quyết toán ngân sách - ngày 31/1 năm sau đối với báo cáo năm)' },
            { t: 5, b: 6, l: 34, r: 35, val: 'Tổng số (tất cả các nguồn vốn)' },
            { t: 7, b: 7, l: 34, r: 34, val: 'Số tiền' },
            { t: 7, b: 7, l: 35, r: 35, val: 'Tỷ lệ (%)' },
            { t: 5, b: 5, l: 36, r: 39, val: 'Trong đó' },
            { t: 6, b: 6, l: 36, r: 36, val: 'Vốn NSNN' },
            { t: 7, b: 7, l: 36, r: 36, val: 'Số tiền' },
            { t: 6, b: 6, l: 37, r: 37, val: 'Vốn ngành DT' },
            { t: 7, b: 7, l: 37, r: 37, val: 'Số tiền' },
            { t: 6, b: 6, l: 38, r: 38, val: 'Vốn ngành thuế' },
            { t: 7, b: 7, l: 38, r: 38, val: 'Số tiền' },
            { t: 6, b: 6, l: 39, r: 39, val: 'Vốn SCL' },
            { t: 7, b: 7, l: 39, r: 39, val: 'Số tiền' },
            { t: 5, b: 5, l: 40, r: 43, val: 'Tỷ lệ giải ngân' },
            { t: 6, b: 6, l: 40, r: 40, val: 'Vốn NSNN' },
            { t: 7, b: 7, l: 40, r: 40, val: 'Tỷ lệ (%)' },
            { t: 6, b: 6, l: 41, r: 41, val: 'Vốn ngành DT' },
            { t: 7, b: 7, l: 41, r: 41, val: 'Tỷ lệ (%)' },
            { t: 6, b: 6, l: 42, r: 42, val: 'Vốn ngành thuế' },
            { t: 7, b: 7, l: 42, r: 42, val: 'Tỷ lệ (%)' },
            { t: 6, b: 6, l: 43, r: 43, val: 'Vốn SCL' },
            { t: 7, b: 7, l: 43, r: 43, val: 'Tỷ lệ (%)' },
            { t: 4, b: 5, l: 44, r: 46, val: 'Tình hình thực hiện dự án' },
            { t: 6, b: 7, l: 44, r: 44, val: 'Nội dung các công việc chủ yéu đã hoàn thành đến cuối tháng báo cáo' },
            { t: 6, b: 7, l: 45, r: 45, val: 'Nội dung các công việc chủ yếu đang thực hiện dở dang' },
            { t: 6, b: 7, l: 46, r: 46, val: 'Kế hoạch thực hiện các nội dung công việc chủ yếu các tháng còn lại của năm' },
            { t: 4, b: 7, l: 47, r: 47, val: 'Ghi chú' },
        ]
        const fieldOrder = ['stt', 'tenDan', 'ddiemXdung', 'qddtSoQdinh', 'qddtTmdtTso', 'qddtTmdtNsnn', 'luyKeVonTso', 'luyKeVonNsnn', 'luyKeVonDt', 'luyKeVonThue', 'luyKeVonScl', 'luyKeGiaiNganHetNamTso',
            'luyKeGiaiNganHetNamNsnnTso', 'luyKeGiaiNganHetNamNsnnKhNamTruoc', 'khoachVonNamTruocKeoDaiTso', 'khoachVonNamTruocKeoDaiDtpt', 'khoachVonNamTruocKeoDaiVonKhac', 'khoachNamVonTso', 'khoachNamVonNsnn',
            'khoachNamVonDt', 'khoachNamVonThue', 'khoachNamVonScl', 'kluongThienTso', 'kluongThienThangBcao', 'giaiNganTso', 'giaiNganTsoTle', 'giaiNganNsnn', 'giaiNganNsnnVonDt', 'giaiNganNsnnVonThue',
            'giaiNganNsnnVonScl', 'giaiNganNsnnTle', 'giaiNganNsnnTleVonDt', 'giaiNganNsnnTleVonThue', 'giaiNganNsnnTleVonScl', 'luyKeGiaiNganDauNamTso', 'luyKeGiaiNganDauNamTsoTle', 'luyKeGiaiNganDauNamNsnn',
            'luyKeGiaiNganDauNamNsnnVonDt', 'luyKeGiaiNganDauNamNsnnVonThue', 'luyKeGiaiNganDauNamNsnnVonScl', 'luyKeGiaiNganDauNamNsnnTle', 'luyKeGiaiNganDauNamNsnnTleVonDt', 'luyKeGiaiNganDauNamNsnnTleVonThue',
            'luyKeGiaiNganDauNamNsnnTleVonScl', 'ndungCviecHthanhCuoiThang', 'ndungCviecDangThien', 'khoachThienNdungCviecThangConLaiNam', 'ghiChu'];
        const filterData = this.lstCtietBcao.map(item => {
            const row: any = {};
            fieldOrder.forEach(field => {
                row[field] = field == 'stt' ? item.index() : ((!item[field] && item[field] !== 0) ? '' : item[field]);
            })
            return row;
        })
        let row: any = {};
        fieldOrder.forEach(field => {
            row[field] = field == 'tenDan' ? 'Tổng cộng' : ((!this.total[field] && this.total[field] !== 0) ? '' : this.total[field]);
        })
        filterData.unshift(row)
        const workbook = XLSX.utils.book_new();
        const worksheet = Table.initExcel(header);
        XLSX.utils.sheet_add_json(worksheet, filterData, { skipHeader: true, origin: Table.coo(header[0].l, header[0].b + 1) })
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Dữ liệu');
        XLSX.writeFile(workbook, this.dataInfo.maBcao + '_Phu_Luc_III.xlsx');
    }
}
