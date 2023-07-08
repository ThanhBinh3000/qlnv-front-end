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
    maDan: string;
    tenDan: string;
    ddiemXdung: number;
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
    total: ItemData = new ItemData();
    maDviTien: string = '1';
    scrollX: string;
    namBcao: number;
    //danh muc
    maDans: any[] = [];
    ddiemXdungs: any[] = Dtc.DIA_DIEM;
    lstCtietBcao: ItemData[] = [];
    luyKes: ItemData[] = [];
    keys = ['qddtTmdtTso', 'qddtTmdtNsnn', 'luyKeVonTso', 'luyKeVonNsnn', 'luyKeVonDt', 'luyKeVonThue', 'luyKeVonScl', 'luyKeGiaiNganHetNamTso', 'luyKeGiaiNganHetNamNsnnTso',
        'luyKeGiaiNganHetNamNsnnKhNamTruoc', 'khoachVonNamTruocKeoDaiTso', 'khoachVonNamTruocKeoDaiDtpt', 'khoachVonNamTruocKeoDaiVonKhac', 'khoachNamVonTso', 'khoachNamVonNsnn',
        'khoachNamVonDt', 'khoachNamVonThue', 'khoachNamVonScl', 'kluongThienTso', 'kluongThienThangBcao', 'giaiNganTso', 'giaiNganNsnn', 'giaiNganNsnnVonDt', 'giaiNganNsnnVonThue',
        'giaiNganNsnnVonScl', 'luyKeGiaiNganDauNamTso', 'luyKeGiaiNganDauNamNsnn', 'luyKeGiaiNganDauNamNsnnVonDt', 'luyKeGiaiNganDauNamNsnnVonThue', 'luyKeGiaiNganDauNamNsnnVonScl']
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
        private danhMucService: DanhMucDungChungService,
        private notification: NzNotificationService,
        private modal: NzModalService,
        private fileManip: FileManip,
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
                this.luyKes.forEach(item => {
                    this.lstCtietBcao.push({
                        ...item,
                        luyKeGiaiNganDauNamTsoTle: Operator.percent(item.luyKeGiaiNganDauNamTso, item.khoachNamVonTso),
                        luyKeGiaiNganDauNamNsnnTle: Operator.percent(item.luyKeGiaiNganDauNamNsnn, item.khoachNamVonNsnn),
                        luyKeGiaiNganDauNamNsnnTleVonDt: Operator.percent(item.luyKeGiaiNganDauNamNsnnVonDt, item.khoachNamVonDt),
                        luyKeGiaiNganDauNamNsnnTleVonThue: Operator.percent(item.luyKeGiaiNganDauNamNsnnVonThue, item.khoachNamVonThue),
                        luyKeGiaiNganDauNamNsnnTleVonScl: Operator.percent(item.luyKeGiaiNganDauNamNsnnVonScl, item.khoachNamVonScl),
                        checked: false,
                        id: uuid.v4() + 'FE',
                    })
                })
            }
            this.scrollX = Table.tableWidth(350, 40, 6, 200);
        } else {
            this.scrollX = Table.tableWidth(350, 40, 6, 0);
        }

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

    // luu
    async save(trangThai: string) {
        if (this.lstCtietBcao.some(e => this.editCache[e.id].edit)) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTSAVE);
            return;
        }

        if (this.lstCtietBcao.some(e => e.qddtTmdtTso > Utils.MONEY_LIMIT || e.qddtTmdtNsnn > Utils.MONEY_LIMIT || e.luyKeVonTso > Utils.MONEY_LIMIT || e.luyKeGiaiNganHetNamTso > Utils.MONEY_LIMIT ||
            e.luyKeGiaiNganHetNamNsnnTso > Utils.MONEY_LIMIT || e.luyKeGiaiNganHetNamNsnnKhNamTruoc > Utils.MONEY_LIMIT || e.khoachVonNamTruocKeoDaiTso > Utils.MONEY_LIMIT ||
            e.khoachVonNamTruocKeoDaiDtpt > Utils.MONEY_LIMIT || e.khoachVonNamTruocKeoDaiVonKhac > Utils.MONEY_LIMIT || e.khoachNamVonTso > Utils.MONEY_LIMIT ||
            e.giaiNganTso > Utils.MONEY_LIMIT || e.luyKeGiaiNganDauNamTso > Utils.MONEY_LIMIT || e.kluongThienTso > Utils.MONEY_LIMIT || e.kluongThienThangBcao > Utils.MONEY_LIMIT)) {
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

    //thêm ngang cấp
    addSame(id: string, initItem: ItemData) {
        this.lstCtietBcao = Table.addParent(id, initItem, this.lstCtietBcao);
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
            data: { ...data },
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

    addLine(id: string) {
        const maDan: string = this.lstCtietBcao.find(e => e.id == id)?.maDan;
        const obj = {
            ma: maDan,
            lstDanhMuc: this.maDans,
        }

        const modalIn = this.modal.create({
            nzTitle: 'Danh sách dự án',
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
                const index: number = this.lstCtietBcao.findIndex(e => e.maDan == res.ma);
                if (index == -1) {
                    const data: ItemData = {
                        ...new ItemData(),
                        maDan: res.ma,
                        level: this.maDans.find(e => e.ma == res.ma)?.level,
                        tenDan: this.maDans.find(e => e.ma == res.ma)?.giaTri,
                    };
                    if (this.lstCtietBcao.length == 0) {
                        this.lstCtietBcao = Table.addHead(data, this.lstCtietBcao);
                    } else {
                        this.addSame(id, data);
                    }
                }
                id = this.lstCtietBcao.find(e => e.maDan == res.ma)?.id;
                res.lstDanhMuc.forEach(item => {
                    if (this.lstCtietBcao.findIndex(e => e.maDan == item.ma) == -1) {
                        const data: ItemData = {
                            ...new ItemData(),
                            maDan: item.ma,
                            level: item.level,
                            tenDan: item.giaTri,
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
        return this.luyKes.findIndex(e => e.maDan == data.maDan) != -1;
    }

    sum(stt: string) {
        stt = Table.preIndex(stt);
        while (stt != '0') {
            const index = this.lstCtietBcao.findIndex(e => e.stt == stt);
            this.keys.forEach(key => {
                this.lstCtietBcao[index][key] = null;
            })
            this.lstCtietBcao.forEach(item => {
                if (Table.preIndex(item.stt) == stt) {
                    this.keys.forEach(key => {
                        this.lstCtietBcao[index][key] = Operator.sum([this.lstCtietBcao[index][key], item[key]]);
                    })
                }
            })
            this.lstCtietBcao[index].giaiNganTsoTle = Operator.percent(this.lstCtietBcao[index].giaiNganTso, this.lstCtietBcao[index].khoachNamVonTso);
            this.lstCtietBcao[index].giaiNganNsnnTle = Operator.percent(this.lstCtietBcao[index].giaiNganNsnn, this.lstCtietBcao[index].khoachNamVonNsnn);
            this.lstCtietBcao[index].giaiNganNsnnTleVonDt = Operator.percent(this.lstCtietBcao[index].giaiNganNsnnVonDt, this.lstCtietBcao[index].khoachNamVonDt);
            this.lstCtietBcao[index].giaiNganNsnnTleVonThue = Operator.percent(this.lstCtietBcao[index].giaiNganNsnnVonThue, this.lstCtietBcao[index].khoachNamVonThue);
            this.lstCtietBcao[index].giaiNganNsnnTleVonScl = Operator.percent(this.lstCtietBcao[index].giaiNganNsnnVonScl, this.lstCtietBcao[index].khoachNamVonScl);
            this.lstCtietBcao[index].luyKeGiaiNganDauNamTsoTle = Operator.percent(this.lstCtietBcao[index].luyKeGiaiNganDauNamTso, this.lstCtietBcao[index].khoachNamVonTso);
            this.lstCtietBcao[index].luyKeGiaiNganDauNamNsnnTle = Operator.percent(this.lstCtietBcao[index].luyKeGiaiNganDauNamNsnn, this.lstCtietBcao[index].khoachNamVonNsnn);
            this.lstCtietBcao[index].luyKeGiaiNganDauNamNsnnTleVonDt = Operator.percent(this.lstCtietBcao[index].luyKeGiaiNganDauNamNsnnVonDt, this.lstCtietBcao[index].khoachNamVonDt);
            this.lstCtietBcao[index].luyKeGiaiNganDauNamNsnnTleVonThue = Operator.percent(this.lstCtietBcao[index].luyKeGiaiNganDauNamNsnnVonThue, this.lstCtietBcao[index].khoachNamVonThue);
            this.lstCtietBcao[index].luyKeGiaiNganDauNamNsnnTleVonScl = Operator.percent(this.lstCtietBcao[index].luyKeGiaiNganDauNamNsnnVonScl, this.lstCtietBcao[index].khoachNamVonScl);
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
        this.total.giaiNganTsoTle = Operator.percent(this.total.giaiNganTso, this.total.khoachNamVonTso);
        this.total.giaiNganNsnnTle = Operator.percent(this.total.giaiNganNsnn, this.total.khoachNamVonNsnn);
        this.total.giaiNganNsnnTleVonDt = Operator.percent(this.total.giaiNganNsnnVonDt, this.total.khoachNamVonDt);
        this.total.giaiNganNsnnTleVonThue = Operator.percent(this.total.giaiNganNsnnVonThue, this.total.khoachNamVonThue);
        this.total.giaiNganNsnnTleVonScl = Operator.percent(this.total.giaiNganNsnnVonScl, this.total.khoachNamVonScl);
        this.total.luyKeGiaiNganDauNamTsoTle = Operator.percent(this.total.luyKeGiaiNganDauNamTso, this.total.khoachNamVonTso);
        this.total.luyKeGiaiNganDauNamNsnnTle = Operator.percent(this.total.luyKeGiaiNganDauNamNsnn, this.total.khoachNamVonNsnn);
        this.total.luyKeGiaiNganDauNamNsnnTleVonDt = Operator.percent(this.total.luyKeGiaiNganDauNamNsnnVonDt, this.total.khoachNamVonDt);
        this.total.luyKeGiaiNganDauNamNsnnTleVonThue = Operator.percent(this.total.luyKeGiaiNganDauNamNsnnVonThue, this.total.khoachNamVonThue);
        this.total.luyKeGiaiNganDauNamNsnnTleVonScl = Operator.percent(this.total.luyKeGiaiNganDauNamNsnnVonScl, this.total.khoachNamVonScl);
    }

    changeModel(id: string) {
        const data = this.lstCtietBcao.find(e => e.id === id);
        this.editCache[id].data.luyKeVonTso = Operator.sum([this.editCache[id].data.luyKeVonNsnn, this.editCache[id].data.luyKeVonDt, this.editCache[id].data.luyKeVonThue, this.editCache[id].data.luyKeVonScl]);
        this.editCache[id].data.khoachVonNamTruocKeoDaiTso = Operator.sum([this.editCache[id].data.khoachVonNamTruocKeoDaiDtpt, this.editCache[id].data.khoachVonNamTruocKeoDaiVonKhac]);
        this.editCache[id].data.khoachNamVonTso = Operator.sum([this.editCache[id].data.khoachNamVonNsnn, this.editCache[id].data.khoachNamVonDt, this.editCache[id].data.khoachNamVonThue, this.editCache[id].data.khoachNamVonScl]);
        this.editCache[id].data.giaiNganTso = Operator.sum([this.editCache[id].data.giaiNganNsnn, this.editCache[id].data.giaiNganNsnnVonDt, this.editCache[id].data.giaiNganNsnnVonThue, this.editCache[id].data.giaiNganNsnnVonScl]);
        this.editCache[id].data.luyKeGiaiNganDauNamTso = Operator.sum([this.editCache[id].data.luyKeGiaiNganDauNamNsnn, this.editCache[id].data.luyKeGiaiNganDauNamNsnnVonDt, this.editCache[id].data.luyKeGiaiNganDauNamNsnnVonThue, this.editCache[id].data.luyKeGiaiNganDauNamNsnnVonScl]);

        // cong luy ke
        this.editCache[id].data.luyKeGiaiNganDauNamTso = Operator.sum([data.luyKeGiaiNganDauNamTso, this.editCache[id].data.giaiNganTso, - data.giaiNganTso]);
        this.editCache[id].data.luyKeGiaiNganDauNamNsnn = Operator.sum([data.luyKeGiaiNganDauNamNsnn, this.editCache[id].data.giaiNganNsnn, - data.giaiNganNsnn]);
        this.editCache[id].data.luyKeGiaiNganDauNamNsnnVonDt = Operator.sum([data.luyKeGiaiNganDauNamNsnnVonDt, this.editCache[id].data.giaiNganNsnnVonDt, - data.giaiNganNsnnVonDt]);
        this.editCache[id].data.luyKeGiaiNganDauNamNsnnVonThue = Operator.sum([data.luyKeGiaiNganDauNamNsnnVonThue, this.editCache[id].data.giaiNganNsnnVonThue, - data.giaiNganNsnnVonThue]);
        this.editCache[id].data.luyKeGiaiNganDauNamNsnnVonScl = Operator.sum([data.luyKeGiaiNganDauNamNsnnVonScl, this.editCache[id].data.giaiNganNsnnVonScl, - data.giaiNganNsnnVonScl]);

        //tinh ty le
        this.editCache[id].data.giaiNganTsoTle = Operator.percent(this.editCache[id].data.giaiNganTso, this.editCache[id].data.khoachNamVonTso);
        this.editCache[id].data.giaiNganNsnnTle = Operator.percent(this.editCache[id].data.giaiNganNsnn, this.editCache[id].data.khoachNamVonNsnn);
        this.editCache[id].data.giaiNganNsnnTleVonDt = Operator.percent(this.editCache[id].data.giaiNganNsnnVonDt, this.editCache[id].data.khoachNamVonDt);
        this.editCache[id].data.giaiNganNsnnTleVonThue = Operator.percent(this.editCache[id].data.giaiNganNsnnVonThue, this.editCache[id].data.khoachNamVonThue);
        this.editCache[id].data.giaiNganNsnnTleVonScl = Operator.percent(this.editCache[id].data.giaiNganNsnnVonScl, this.editCache[id].data.khoachNamVonScl);
        this.editCache[id].data.luyKeGiaiNganDauNamTsoTle = Operator.percent(this.editCache[id].data.luyKeGiaiNganDauNamTso, this.editCache[id].data.khoachNamVonTso);
        this.editCache[id].data.luyKeGiaiNganDauNamNsnnTle = Operator.percent(this.editCache[id].data.luyKeGiaiNganDauNamNsnn, this.editCache[id].data.khoachNamVonNsnn);
        this.editCache[id].data.luyKeGiaiNganDauNamNsnnTleVonDt = Operator.percent(this.editCache[id].data.luyKeGiaiNganDauNamNsnnVonDt, this.editCache[id].data.khoachNamVonDt);
        this.editCache[id].data.luyKeGiaiNganDauNamNsnnTleVonThue = Operator.percent(this.editCache[id].data.luyKeGiaiNganDauNamNsnnVonThue, this.editCache[id].data.khoachNamVonThue);
        this.editCache[id].data.luyKeGiaiNganDauNamNsnnTleVonScl = Operator.percent(this.editCache[id].data.luyKeGiaiNganDauNamNsnnVonScl, this.editCache[id].data.khoachNamVonScl);
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
        await this.fileManip.downloadFile(file, doc);
    }

    exportToExcel() {
        const header = [
            { t: 0, b: 3, l: 0, r: 47, val: null },
            { t: 0, b: 3, l: 0, r: 0, val: 'STT' },
            { t: 0, b: 3, l: 1, r: 1, val: 'Danh mục dự án' },
            { t: 0, b: 3, l: 2, r: 2, val: 'Địa điểm XD' },
            { t: 0, b: 0, l: 3, r: 5, val: 'Quyết định đầu tư' },
            { t: 1, b: 3, l: 3, r: 3, val: 'Số quyết định ngày, tháng, năm ban hành' },
            { t: 1, b: 1, l: 4, r: 5, val: 'TMDT' },
            { t: 2, b: 3, l: 4, r: 4, val: 'Tổng số (tất cả các nguồn vốn)' },
            { t: 2, b: 3, l: 5, r: 5, val: 'Trong đó: vốn NSNN' },
            { t: 0, b: 0, l: 6, r: 10, val: 'Lũy kế vốn đã bố trí đến hết năm trước năm kế hoạch' },
            { t: 1, b: 3, l: 6, r: 6, val: 'Tổng số (tất cả các nguồn vốn)' },
            { t: 1, b: 1, l: 7, r: 10, val: 'Trong đó' },
            { t: 2, b: 3, l: 7, r: 7, val: 'Nguồn NSNN' },
            { t: 2, b: 3, l: 8, r: 8, val: 'Vốn ngành DT' },
            { t: 2, b: 3, l: 9, r: 9, val: 'Vốn nghành thuế' },
            { t: 2, b: 3, l: 10, r: 10, val: 'Vốn SCL' },
            { t: 0, b: 0, l: 11, r: 13, val: 'Lũy kế vốn đã bố trí đến hết năm trước năm kế hoạch' },
            { t: 1, b: 3, l: 11, r: 11, val: 'Tổng số (tất cả các nguồn vốn)' },
            { t: 1, b: 1, l: 12, r: 13, val: 'Trong đó: NSNN' },
            { t: 2, b: 3, l: 12, r: 12, val: 'Tổng số' },
            { t: 2, b: 3, l: 13, r: 13, val: 'Trong đó: riêng năm trước năm kế hoạch' },
            { t: 0, b: 0, l: 14, r: 16, val: 'Kế hoạch vốn năm trước được cấp có thẩm quyền cho phép kéo dài sang năm KH (nếu có)' },
            { t: 1, b: 3, l: 14, r: 14, val: 'Tổng số' },
            { t: 1, b: 1, l: 15, r: 16, val: 'Trong đó' },
            { t: 2, b: 3, l: 15, r: 15, val: 'Vốn ĐTPT' },
            { t: 2, b: 3, l: 16, r: 16, val: 'Vốn khác' },
            { t: 0, b: 0, l: 17, r: 21, val: 'Kế hoạch năm kế hoạch' },
            { t: 1, b: 3, l: 17, r: 17, val: 'Tổng số (tất cả các nguồn vốn)' },
            { t: 1, b: 1, l: 18, r: 21, val: 'Trong đó' },
            { t: 2, b: 3, l: 18, r: 18, val: 'Vốn ĐTPT nguồn NSNN' },
            { t: 2, b: 3, l: 19, r: 19, val: 'Vốn ngành DT' },
            { t: 2, b: 3, l: 20, r: 20, val: 'Vốn ngành thuế' },
            { t: 2, b: 3, l: 21, r: 21, val: 'Vốn SCL' },
            { t: 0, b: 2, l: 22, r: 23, val: 'Khối lượng thực hiện từ đầu năm đến ngày 15 của tháng báo cáo' },
            { t: 3, b: 3, l: 22, r: 22, val: 'Tổng số' },
            { t: 3, b: 3, l: 23, r: 23, val: 'Riêng tháng báo cáo' },
            { t: 0, b: 0, l: 24, r: 33, val: 'Giải ngân tháng báo cáo' },
            { t: 1, b: 2, l: 24, r: 25, val: 'Tổng số (tất cả các nguồn vốn)' },
            { t: 3, b: 3, l: 24, r: 24, val: 'Số tiền' },
            { t: 3, b: 3, l: 25, r: 25, val: 'Tỷ lệ (%)' },
            { t: 1, b: 1, l: 26, r: 29, val: 'Trong đó' },
            { t: 2, b: 2, l: 26, r: 26, val: 'Vốn NSNN' },
            { t: 3, b: 3, l: 26, r: 26, val: 'Số tiền' },
            { t: 2, b: 2, l: 27, r: 27, val: 'Vốn ngành DT' },
            { t: 3, b: 3, l: 27, r: 27, val: 'Số tiền' },
            { t: 2, b: 2, l: 28, r: 28, val: 'Vốn ngành thuế' },
            { t: 3, b: 3, l: 28, r: 28, val: 'Số tiền' },
            { t: 2, b: 2, l: 29, r: 29, val: 'Vốn SCL' },
            { t: 3, b: 3, l: 29, r: 29, val: 'Số tiền' },
            { t: 1, b: 1, l: 30, r: 33, val: 'Tỷ lệ giải ngân' },
            { t: 2, b: 2, l: 30, r: 30, val: 'Vốn NSNN' },
            { t: 3, b: 3, l: 30, r: 30, val: 'Tỷ lệ (%)' },
            { t: 2, b: 2, l: 31, r: 31, val: 'Vốn ngành DT' },
            { t: 3, b: 3, l: 31, r: 31, val: 'Tỷ lệ (%)' },
            { t: 2, b: 2, l: 32, r: 32, val: 'Vốn ngành thuế' },
            { t: 3, b: 3, l: 32, r: 32, val: 'Tỷ lệ (%)' },
            { t: 2, b: 2, l: 33, r: 33, val: 'Vốn SCL' },
            { t: 3, b: 3, l: 33, r: 33, val: 'Tỷ lệ (%)' },
            { t: 0, b: 0, l: 34, r: 43, val: 'Lũy kế giải ngân từ đầu năm đến tháng báo cáo đối với báo cáo tháng (đến hết thời gian chỉnh lý quyết toán ngân sách - ngày 31/1 năm sau đối với báo cáo năm)' },
            { t: 1, b: 2, l: 34, r: 35, val: 'Tổng số (tất cả các nguồn vốn)' },
            { t: 3, b: 3, l: 34, r: 34, val: 'Số tiền' },
            { t: 3, b: 3, l: 35, r: 35, val: 'Tỷ lệ (%)' },
            { t: 1, b: 1, l: 36, r: 39, val: 'Trong đó' },
            { t: 2, b: 2, l: 36, r: 36, val: 'Vốn NSNN' },
            { t: 3, b: 3, l: 36, r: 36, val: 'Số tiền' },
            { t: 2, b: 2, l: 37, r: 37, val: 'Vốn ngành DT' },
            { t: 3, b: 3, l: 37, r: 37, val: 'Số tiền' },
            { t: 2, b: 2, l: 38, r: 38, val: 'Vốn ngành thuế' },
            { t: 3, b: 3, l: 38, r: 38, val: 'Số tiền' },
            { t: 2, b: 2, l: 39, r: 39, val: 'Vốn SCL' },
            { t: 3, b: 3, l: 39, r: 39, val: 'Số tiền' },
            { t: 1, b: 1, l: 40, r: 43, val: 'Tỷ lệ giải ngân' },
            { t: 2, b: 2, l: 40, r: 40, val: 'Vốn NSNN' },
            { t: 3, b: 3, l: 40, r: 40, val: 'Tỷ lệ (%)' },
            { t: 2, b: 2, l: 41, r: 41, val: 'Vốn ngành DT' },
            { t: 3, b: 3, l: 41, r: 41, val: 'Tỷ lệ (%)' },
            { t: 2, b: 2, l: 42, r: 42, val: 'Vốn ngành thuế' },
            { t: 3, b: 3, l: 42, r: 42, val: 'Tỷ lệ (%)' },
            { t: 2, b: 2, l: 43, r: 43, val: 'Vốn SCL' },
            { t: 3, b: 3, l: 43, r: 43, val: 'Tỷ lệ (%)' },
            { t: 0, b: 1, l: 44, r: 46, val: 'Tình hình thực hiện dự án' },
            { t: 2, b: 3, l: 44, r: 44, val: 'Nội dung các công việc chủ yéu đã hoàn thành đến cuối tháng báo cáo' },
            { t: 2, b: 3, l: 45, r: 45, val: 'Nội dung các công việc chủ yếu đang thực hiện dở dang' },
            { t: 2, b: 3, l: 46, r: 46, val: 'Kế hoạch thực hiện các nội dung công việc chủ yếu các tháng còn lại của năm' },
            { t: 0, b: 3, l: 47, r: 47, val: 'Ghi chú' },
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
        XLSX.writeFile(workbook, this.dataInfo.maBcao + '_Phu_Luc_III.xlsx');
    }
}
