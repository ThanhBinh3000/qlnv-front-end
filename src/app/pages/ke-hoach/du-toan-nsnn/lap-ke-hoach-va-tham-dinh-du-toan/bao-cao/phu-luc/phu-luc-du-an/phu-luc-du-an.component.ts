import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { FileFunction, GeneralFunction, NumberFunction, TableFunction } from 'src/app/Utility/func';
import { AMOUNT, DON_VI_TIEN, Utils } from "src/app/Utility/utils";
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { DanhMucDungChungService } from 'src/app/services/danh-muc-dung-chung.service';
import { LapThamDinhService } from 'src/app/services/quan-ly-von-phi/lapThamDinh.service';
import * as uuid from "uuid";
import { BtnStatus, Doc, Form } from '../../../lap-ke-hoach-va-tham-dinh-du-toan.class';

export class ItemData {
    id: string;
    stt: string;
    maDanhMucDa: string;
    maDuAn: string;
    tenDanhMuc: string;
    level: number;
    nhomDuAn: string;
    diaDiemXd: string;
    nangLucTke: string;
    thoiGianKcHt: string;
    soQd: string;
    tmdtTongSo: number;
    tmdtNstw: number;
    keHoachTongSo: number;
    keHoachNstw: number;
    uocGiaiNganDauNamTong: number;
    uocGiaiNganDauNamNstw: number;
    uocGiaiNganCaNamTong: number;
    uocGiaiNganCaNamNstw: number;
    daBoTriVonTongSo: number;
    daBoTriVonNstw: number;
    trungHanVonN2N2TongSo: number;
    trungHanVonN2N2ThuHoi: number;
    trungHanVonN2N2Xdcb: number;
    trungHanVonN2N2Cbi: number;
    trungHanVonN2N1TongSo: number;
    trungHanVonN2N1ThuHoi: number;
    trungHanVonN2N1Xdcb: number;
    trungHanVonN2N1Cbi: number;
    khTongSoNamN: number;
    khNstwTongSoNamN: number;
    khNstwThuHoiNamN: number;
    khNstwThanhToanNamN: number;
    khNstwChuanBiNamN: number;
    ghiChu: string;
}

@Component({
    selector: 'app-phu-luc-du-an',
    templateUrl: './phu-luc-du-an.component.html',
    styleUrls: ['../../bao-cao.component.scss']
})

export class PhuLucDuAnComponent implements OnInit {
    @Input() dataInfo;
    //thong tin chi tiet cua bieu mau
    formDetail: Form = new Form();
    total: ItemData = new ItemData();
    maDviTien: string = '1';
    namBcao: number;
    //danh muc
    duAns: any[] = [];
    lstCtietBcao: ItemData[] = [];
    donViTiens: any[] = DON_VI_TIEN;
    keys = ['tmdtTongSo', 'tmdtNstw', 'keHoachTongSo', 'keHoachNstw', 'uocGiaiNganDauNamTong', 'uocGiaiNganDauNamNstw', 'uocGiaiNganCaNamTong', 'uocGiaiNganCaNamNstw',
        'daBoTriVonTongSo', 'daBoTriVonNstw', 'trungHanVonN2N2TongSo', 'trungHanVonN2N2ThuHoi', 'trungHanVonN2N2Xdcb', 'trungHanVonN2N2Cbi', 'trungHanVonN2N1TongSo',
        'trungHanVonN2N1ThuHoi', 'trungHanVonN2N1Xdcb', 'trungHanVonN2N1Cbi', 'khTongSoNamN', 'khNstwTongSoNamN', 'khNstwThuHoiNamN', 'khNstwThanhToanNamN', 'khNstwChuanBiNamN']
    amount = AMOUNT;
    scrollX: string;
    //trang thai cac nut
    status: BtnStatus = new BtnStatus();
    editMoneyUnit = false;
    isDataAvailable = false;
    //nho dem
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
        private lapThamDinhService: LapThamDinhService,
        private danhMucService: DanhMucDungChungService,
        private notification: NzNotificationService,
        private modal: NzModalService,
        public numFunc: NumberFunction,
        public genFunc: GeneralFunction,
        private fileFunc: FileFunction,
        private tableFunc: TableFunction,
    ) { }

    async ngOnInit() {
        this.initialization().then(() => {
            this.isDataAvailable = true;
        })
    }

    async initialization() {
        this.spinner.show();
        Object.assign(this.status, this.dataInfo.status);
        await this.getFormDetail();
        this.namBcao = this.dataInfo.namBcao;
        if (this.status) {
            const category = await this.danhMucService.danhMucChungGetAll('LTD_PLDA');
            if (category) {
                category.data.forEach(item => {
                    this.duAns.push({
                        ...item,
                        giaTri: this.genFunc.getName(this.namBcao, item.giaTri),
                    })
                })
            }
            this.scrollX = this.genFunc.tableWidth(350, 23, 6, 110);
        } else {
            this.scrollX = this.genFunc.tableWidth(350, 23, 6, 0);
        }
        if (this.lstCtietBcao.length == 0) {
            this.duAns.forEach(e => {
                this.lstCtietBcao.push({
                    ...new ItemData(),
                    id: uuid.v4() + 'FE',
                    stt: e.ma,
                    tenDanhMuc: e.giaTri,
                    maDanhMucDa: e.ma,
                })
            })
        } else if (!this.lstCtietBcao[0]?.stt) {
            this.lstCtietBcao.forEach(item => {
                item.stt = item.maDanhMucDa;
            })
        }
        this.lstCtietBcao = this.tableFunc.sortByIndex(this.lstCtietBcao);
        this.getTotal();
        this.updateEditCache();
        this.getStatusButton();
        this.spinner.hide();
    }

    getStatusButton() {
        this.status.ok = this.status.ok && (this.formDetail.trangThai == "2" || this.formDetail.trangThai == "5");
    }

    async getFormDetail() {
        await this.lapThamDinhService.ctietBieuMau(this.dataInfo.id).toPromise().then(
            data => {
                if (data.statusCode == 0) {
                    this.formDetail = data.data;
                    this.formDetail.maDviTien = '1';
                    this.lstCtietBcao = this.formDetail.lstCtietLapThamDinhs;
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
    async save(trangThai: string, lyDoTuChoi: string) {
        if (this.lstCtietBcao.some(e => this.editCache[e.id].edit)) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTSAVE);
            return;
        }

        // if (this.lstCtietBcao.some(e => e.ncauChiTongSo > MONEY_LIMIT)) {
        // 	this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.MONEYRANGE);
        // 	return;
        // }

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
            request.fileDinhKems.push(await this.fileFunc.uploadFile(iterator, this.dataInfo.path));
        }

        request.lstCtietLapThamDinhs = lstCtietBcaoTemp;
        request.trangThai = trangThai;

        if (lyDoTuChoi) {
            request.lyDoTuChoi = lyDoTuChoi;
        }

        this.spinner.show();
        this.lapThamDinhService.updateLapThamDinh(request).toPromise().then(
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
                this.save(mcn, text);
            }
        });
    }

    // chuyển đổi stt đang được mã hóa thành dạng I, II, a, b, c, ...
    getChiMuc(str: string): string {
        str = str.substring(str.indexOf('.') + 1, str.length);
        const chiSo: string[] = str.split('.');
        const n: number = chiSo.length - 1;
        let k: number = parseInt(chiSo[n], 10);
        switch (n) {
            case 0:
                return this.genFunc.laMa(k);
            case 1:
                return '(' + chiSo[n] + ')';
            case 2:
                return chiSo[n];
            case 3:
                return String.fromCharCode(k + 96);
            case 4:
                return '-';
            default:
                return null;
        }
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

    // start edit
    startEdit(id: string): void {
        if (this.lstCtietBcao.every(e => !this.editCache[e.id].edit)) {
            this.editCache[id].edit = true;
        } else {
            this.notification.warning(MESSAGE.WARNING, 'Vui lòng lưu bản ghi đang sửa trước khi thực hiện thao tác');
            return;
        }
    }

    // huy thay doi
    cancelEdit(id: string): void {
        const index = this.lstCtietBcao.findIndex(item => item.id === id);
        // lay vi tri hang minh sua
        this.editCache[id] = {
            data: { ...this.lstCtietBcao[index] },
            edit: false
        };
    }

    // luu thay doi
    saveEdit(id: string): void {
        const index = this.lstCtietBcao.findIndex(item => item.id === id); // lay vi tri hang minh sua
        Object.assign(this.lstCtietBcao[index], this.editCache[id].data); // set lai data cua lstCtietBcao[index] = this.editCache[id].data
        this.editCache[id].edit = false; // CHUYEN VE DANG TEXT
        this.sum(this.lstCtietBcao[index].stt);
        this.updateEditCache();
    }

    addLine(id: string) {
        this.lstCtietBcao = this.tableFunc.addChild(id, new ItemData(), this.lstCtietBcao);
        this.updateEditCache();
    }


    changeModel(id: string): void {
        this.editCache[id].data.trungHanVonN2N2TongSo = this.numFunc.sum([this.editCache[id].data.trungHanVonN2N2ThuHoi, this.editCache[id].data.trungHanVonN2N2Cbi, this.editCache[id].data.trungHanVonN2N2Xdcb]);
        this.editCache[id].data.trungHanVonN2N1TongSo = this.numFunc.sum([this.editCache[id].data.trungHanVonN2N1ThuHoi, this.editCache[id].data.trungHanVonN2N1Cbi, this.editCache[id].data.trungHanVonN2N1Xdcb]);
        this.editCache[id].data.khNstwTongSoNamN = this.numFunc.sum([this.editCache[id].data.khNstwThuHoiNamN, this.editCache[id].data.khNstwThanhToanNamN, this.editCache[id].data.khNstwChuanBiNamN]);
    }

    sum(stt: string) {
        stt = this.tableFunc.getHead(stt);
        while (stt != '0') {
            const index = this.lstCtietBcao.findIndex(e => e.stt == stt);
            const data = this.lstCtietBcao[index];
            this.lstCtietBcao[index] = {
                ...new ItemData(),
                id: data.id,
                stt: data.stt,
                maDanhMucDa: data.maDanhMucDa,
                tenDanhMuc: data.tenDanhMuc,
                level: data.level,
            }
            this.lstCtietBcao.forEach(item => {
                if (this.tableFunc.getHead(item.stt) == stt) {
                    this.keys.forEach(key => {
                        this.lstCtietBcao[index][key] = this.numFunc.sum([this.lstCtietBcao[index][key], item[key]]);
                    })
                }
            })
            stt = this.tableFunc.getHead(stt);
        }
        this.getTotal();
    }

    getTotal() {
        this.total = new ItemData();
        this.lstCtietBcao.forEach(item => {
            if (item.level == 0) {
                this.keys.forEach(key => {
                    this.total[key] = this.numFunc.sum([this.total[key], item[key]]);
                })
            }
        })
    }

    checkEdit(stt: string) {
        const lstTemp = this.lstCtietBcao.filter(e => e.stt !== stt);
        return lstTemp.every(e => !e.stt.startsWith(stt));
    }

    checkAdd(data: ItemData) {
        if (data.stt == '0.3' || (data.level == 1 && data.maDanhMucDa)) {
            return true;
        }
        return false;
    }
    checkDelete(maDa: string) {
        if (!maDa) {
            return true;
        }
        return false;
    }

    //xóa dòng
    deleteLine(id: string) {
        const stt = this.lstCtietBcao.find(e => e.id === id)?.stt;
        this.lstCtietBcao = this.tableFunc.deleteRow(id, this.lstCtietBcao);
        this.sum(stt);
        this.updateEditCache();
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
        await this.fileFunc.downloadFile(file, doc);
    }
}
