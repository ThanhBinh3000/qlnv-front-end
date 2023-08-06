import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { Operator, Status, Table, Utils } from 'src/app/Utility/utils';
import { DialogChonDanhMucComponent } from 'src/app/components/dialog/dialog-chon-danh-muc/dialog-chon-danh-muc.component';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { DanhMucDungChungService } from 'src/app/services/danh-muc-dung-chung.service';
import { DieuChinhService } from 'src/app/services/quan-ly-von-phi/dieuChinhDuToan.service';
import { UserService } from 'src/app/services/user.service';
import * as XLSX from 'xlsx';
import { BtnStatus, Doc, Form } from '../../dieu-chinh-du-toan.constant';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';

export class ItemData {
    level: any;
    checked: boolean;
    id: string;
    qlnvKhvonphiDchinhCtietId: string;
    stt: string;
    noiDung: string;
    keHoachVon: number;
    dtoanDaGiaoLke: number;
    qtoanGtriDtoan: number;
    dtoanDchinhDnghi: number;
    khoachSauDchinh: number;
    dtoanDchinhDnghiLanNay: number;
    dtoanVuTvqtDnghi: number;
    ghiChu: string;
    maNoiDung: string;
    chenhLech: number;
    ykienDviCtren: string;
}


@Component({
    selector: 'app-phu-luc-4',
    templateUrl: './phu-luc-4.component.html',
    styleUrls: ['../add-bao-cao.component.scss'],
})
export class PhuLuc4Component implements OnInit {
    @Input() dataInfo;
    Op = new Operator('1');
    Utils = Utils;

    //thong tin chi tiet cua bieu mau
    formDetail: Form = new Form();
    total: ItemData = new ItemData();
    maDviTien: string = '1';
    namBcao: number;

    //danh muc
    lstCtietBcao: ItemData[] = [];
    noiDungs: any[] = [];
    dsDinhMuc: any[] = [];
    keys = ['thucHienNamTruoc', 'dtoanNamHtai', 'uocThNamHtai', 'ttienNamDtoan', 'sluongNamN1Td', 'ttienNamN1Td', 'chenhLech']
    scrollX: string;


    //trang thai cac nut
    status: BtnStatus = new BtnStatus();
    editMoneyUnit = false;
    isDataAvailable = false;
    allChecked = false;

    //nho dem
    editCache: { [key: string]: { edit: boolean; data: ItemData } } = {};

    fileList: NzUploadFile[] = [];
    listFile: File[] = [];
    listIdDelete: string[] = [];

    maDviTao: any;
    userInfo: any;
    tongDieuChinhTang: number;
    tongDieuChinhGiam: number;
    dToanVuTang: number;
    dToanVuGiam: number;

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
        private dieuChinhDuToanService: DieuChinhService,
        private notification: NzNotificationService,
        private modal: NzModalService,
        public userService: UserService,
        private danhMucService: DanhMucDungChungService,
        private quanLyVonPhiService: QuanLyVonPhiService,

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
        this.namBcao = this.dataInfo?.namBcao;
        if (this.status.general) {
            this.scrollX = Table.tableWidth(350, 9, 1, 110);
        } else {
            if (this.status.editAppVal) {
                this.scrollX = Table.tableWidth(350, 13, 2, 60);
            } else if (this.status.viewAppVal) {
                this.scrollX = Table.tableWidth(350, 13, 2, 0);
            } else {
                this.scrollX = Table.tableWidth(350, 9, 1, 0);
            }
        }
        const category = await this.danhMucService.danhMucChungGetAll('BC_DTC_PL2');
        if (category) {
            category.data.forEach(
                item => {
                    this.noiDungs.push({
                        ...item,
                        level: item.ma?.split('.').length - 2,
                        giaTri: Utils.getName(this.namBcao, item.giaTri),
                    })
                }
            )
        }



        if (!this.lstCtietBcao[0]?.stt) {
            this.setIndex();
        }
        this.lstCtietBcao = Table.sortByIndex(this.lstCtietBcao);

        // this.sortByIndex();
        this.tinhTong();
        this.getTotal();
        this.lstCtietBcao.forEach(item => {
            item.noiDung = this.noiDungs.find(e => e.ma == item.maNoiDung)?.giaTri;
        })
        this.updateEditCache();
        this.getStatusButton();
        this.spinner.hide();
    };


    async getFormDetail() {
        await this.dieuChinhDuToanService.ctietBieuMau(this.dataInfo.id).toPromise().then(
            data => {
                if (data.statusCode == 0) {
                    this.formDetail = data.data;
                    this.formDetail.maDviTien = '1';
                    this.lstCtietBcao = this.formDetail.lstCtietDchinh;
                    this.listFile = [];
                    this.formDetail.listIdDeleteFiles = [];
                    this.getStatusButton();
                } else {
                    this.notification.error(MESSAGE.ERROR, data?.msg);
                }
            },
            err => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
            }
        )
    };


    setIndex() {
        const lstVtuTemp = this.lstCtietBcao.filter(e => !e.maNoiDung);
        for (let i = 0; i < lstVtuTemp.length; i++) {
            const stt = '0.' + (i + 1).toString();
            const index = this.lstCtietBcao.findIndex(e => e.id == lstVtuTemp[i].id);
            this.lstCtietBcao[index].stt = stt;
            const lstDmTemp = this.lstCtietBcao.filter(e => e.maNoiDung == lstVtuTemp[i].maNoiDung && !!e.maNoiDung);
            for (let j = 0; j < lstDmTemp.length; j++) {
                const ind = this.lstCtietBcao.findIndex(e => e.id == lstDmTemp[j].id);
                this.lstCtietBcao[ind].stt = stt + '.' + (j + 1).toString();
            }
        }
        lstVtuTemp.forEach(item => {
            this.sum(item.stt + '.1');
        })
    }

    getLowStatus(str: string) {
        return this.lstCtietBcao.findIndex(e => this.getHead(e.stt) == str) != -1;
    }

    updateAllChecked(): void {
        if (this.allChecked) {                                    // checkboxall == true thi set lai lstCTietBCao.checked = true
            this.lstCtietBcao = this.lstCtietBcao.map(item => ({
                ...item,
                checked: true
            }));
        } else {
            this.lstCtietBcao = this.lstCtietBcao.map(item => ({    // checkboxall == false thi set lai lstCTietBCao.checked = false
                ...item,
                checked: false
            }));
        }
    }

    // displayValue(num: number): string {
    //     num = exchangeMoney(num, '1', this.maDviTien);
    //     return displayNumber(num);
    // };

    getTotal() {
        this.total = new ItemData();
        this.lstCtietBcao.forEach(item => {
            item.chenhLech = Operator.sum([item.dtoanVuTvqtDnghi, - item.dtoanDchinhDnghiLanNay])
            if (item.level == 0) {
                this.total.keHoachVon = Operator.sum([this.total.keHoachVon, item.keHoachVon]);
                this.total.dtoanDaGiaoLke = Operator.sum([this.total.dtoanDaGiaoLke, item.dtoanDaGiaoLke]);
                this.total.qtoanGtriDtoan = Operator.sum([this.total.qtoanGtriDtoan, item.qtoanGtriDtoan]);
                this.total.dtoanDchinhDnghi = Operator.sum([this.total.dtoanDchinhDnghi, item.dtoanDchinhDnghi]);
                this.total.khoachSauDchinh = Operator.sum([this.total.khoachSauDchinh, item.khoachSauDchinh]);
                this.total.dtoanDchinhDnghiLanNay = Operator.sum([this.total.dtoanDchinhDnghiLanNay, item.dtoanDchinhDnghiLanNay]);
                this.total.dtoanVuTvqtDnghi = Operator.sum([this.total.dtoanVuTvqtDnghi, item.dtoanVuTvqtDnghi]);
                this.total.chenhLech = Operator.sum([this.total.chenhLech, item.chenhLech]);
            }
        })
    };

    getStatusButton() {
        this.status.ok = this.status.ok && (this.formDetail.trangThai == Status.NOT_RATE || this.formDetail.trangThai == Status.COMPLETE);
    }

    // luu
    async save(trangThai: string, lyDoTuChoi: string) {
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
            lstCtietBcaoTemp.push({
                ...item,
                id: item.id?.length == 38 ? null : item.id,
            })
        })

        if (this.status.general) {
            lstCtietBcaoTemp?.forEach(item => {
                item.dtoanVuTvqtDnghi = item.dtoanDchinhDnghiLanNay;
            })
        }

        const request = JSON.parse(JSON.stringify(this.formDetail));

        request.fileDinhKems = [];
        for (let iterator of this.listFile) {
            request.fileDinhKems.push(await this.quanLyVonPhiService.upFile(iterator, this.dataInfo.path));
        }

        request.lstCtietDchinh = lstCtietBcaoTemp;
        request.trangThai = trangThai;

        if (lyDoTuChoi) {
            request.lyDoTuChoi = lyDoTuChoi;
        }

        this.spinner.show();
        this.dieuChinhDuToanService.updatePLDieuChinh(request).toPromise().then(
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
    doPrint() {

    };

    handleCancel() {
        this._modalRef.close();
    };

    deleteLine(id: string) {
        const stt = this.lstCtietBcao.find(e => e.id === id)?.stt;
        this.lstCtietBcao = Table.deleteRow(id, this.lstCtietBcao);
        this.sum(stt);
        this.updateEditCache();
    }

    startEdit(id: string): void {
        this.editCache[id].edit = true;
    };

    checkEdit(stt: string) {
        const lstTemp = this.lstCtietBcao.filter(e => e.stt !== stt);
        return lstTemp.every(e => !e.stt.startsWith(stt));
    }

    updateSingleChecked(): void {
        if (this.lstCtietBcao.every(item => item.checked || item.level != 0)) {     // tat ca o checkbox deu = true thi set o checkbox all = true
            this.allChecked = true;
        } else {                                                        // o checkbox vua = false, vua = true thi set o checkbox all = indeterminate
            this.allChecked = false;
        }
    }

    saveEdit(id: string): void {
        const index = this.lstCtietBcao.findIndex(item => item.id === id); // lay vi tri hang minh sua
        Object.assign(this.lstCtietBcao[index], this.editCache[id].data); // set lai data cua lstCtietBcao[index] = this.editCache[id].data
        this.editCache[id].edit = false; // CHUYEN VE DANG TEXT
        this.sum(this.lstCtietBcao[index].stt);
        this.getTotal()
        this.updateEditCache();
    }

    updateEditCache(): void {
        this.lstCtietBcao.forEach(item => {
            this.editCache[item.id] = {
                edit: false,
                data: { ...item }
            };
        });
    };

    sum(stt: string) {
        stt = this.getHead(stt);
        while (stt != '0') {
            const index = this.lstCtietBcao.findIndex(e => e.stt == stt);
            const data = this.lstCtietBcao[index];
            this.lstCtietBcao[index] = {
                ...new ItemData(),
                id: data.id,
                stt: data.stt,
                noiDung: data.noiDung,
                level: data.level,
                maNoiDung: data.maNoiDung,
            }
            this.lstCtietBcao.forEach(item => {
                if (this.getHead(item.stt) == stt) {
                    this.lstCtietBcao[index].keHoachVon = Number(Operator.sum([this.lstCtietBcao[index].keHoachVon, item.keHoachVon]));
                    this.lstCtietBcao[index].dtoanDaGiaoLke = Number(Operator.sum([this.lstCtietBcao[index].dtoanDaGiaoLke, item.dtoanDaGiaoLke]));
                    this.lstCtietBcao[index].qtoanGtriDtoan = Number(Operator.sum([this.lstCtietBcao[index].qtoanGtriDtoan, item.qtoanGtriDtoan]));
                    this.lstCtietBcao[index].dtoanDchinhDnghi = Number(Operator.sum([this.lstCtietBcao[index].dtoanDchinhDnghi, item.dtoanDchinhDnghi]));
                    this.lstCtietBcao[index].khoachSauDchinh = Number(Operator.sum([this.lstCtietBcao[index].khoachSauDchinh, item.khoachSauDchinh]));
                    this.lstCtietBcao[index].dtoanDchinhDnghiLanNay = Number(Operator.sum([this.lstCtietBcao[index].dtoanDchinhDnghiLanNay, item.dtoanDchinhDnghiLanNay]));
                    this.lstCtietBcao[index].dtoanVuTvqtDnghi = Number(Operator.sum([this.lstCtietBcao[index].dtoanVuTvqtDnghi, item.dtoanVuTvqtDnghi]));
                }
            })
            stt = this.getHead(stt);
        }
        this.tinhTong();
    };

    cancelEdit(id: string): void {
        const index = this.lstCtietBcao.findIndex(item => item.id === id);
        // lay vi tri hang minh sua
        this.editCache[id] = {
            data: { ...this.lstCtietBcao[index] },
            edit: false
        };
    }


    tinhTong() {
        this.tongDieuChinhGiam = 0;
        this.tongDieuChinhTang = 0;
        this.dToanVuTang = 0;
        this.dToanVuGiam = 0;
        this.lstCtietBcao.forEach(item => {
            const str = item.stt
            if (!(this.lstCtietBcao.findIndex(e => Table.preIndex(e.stt) == str) != -1)) {
                if (item.dtoanDchinhDnghiLanNay !== null) {
                    if (item.dtoanDchinhDnghiLanNay < 0) {
                        Number(this.tongDieuChinhGiam += Number(item?.dtoanDchinhDnghiLanNay));
                    } else {
                        Number(this.tongDieuChinhTang += Number(item?.dtoanDchinhDnghiLanNay));
                    }
                }

                if (item.dtoanVuTvqtDnghi !== null) {
                    if (item.dtoanVuTvqtDnghi < 0) {
                        Number(this.dToanVuGiam += Number(item?.dtoanVuTvqtDnghi));
                    } else {
                        Number(this.dToanVuTang += Number(item?.dtoanVuTvqtDnghi));
                    }
                }
            }
        })
    };

    changeModel(id: string): void {
        this.editCache[id].data.khoachSauDchinh = Operator.sum([this.editCache[id].data.keHoachVon, this.editCache[id].data.dtoanDchinhDnghi]);
        this.editCache[id].data.dtoanDchinhDnghiLanNay = Operator.sum([this.editCache[id].data.khoachSauDchinh, - this.editCache[id].data.dtoanDaGiaoLke]);
        this.editCache[id].data.chenhLech = Operator.sum([this.editCache[id].data.dtoanVuTvqtDnghi, - this.editCache[id].data.dtoanDchinhDnghiLanNay]);
    };

    deleteAllChecked() {
        const lstId: any[] = [];
        this.lstCtietBcao.forEach(item => {
            if (item.checked) {
                lstId.push(item.id);
            }
        })
        lstId.forEach(item => {
            if (this.lstCtietBcao.findIndex(e => e.id == item) != 0) {
                this.deleteLine(item);
            }
        })
    }



    getIndex(str: string): string {
        str = str.substring(str.indexOf('.') + 1, str.length);
        let xau = "";
        const chiSo: string[] = str.split('.');
        const n: number = chiSo.length - 1;
        let k: number = parseInt(chiSo[n], 10);

        switch (n) {
            case 0:
                return String.fromCharCode(k + 64);
            case 1:
                return Utils.laMa(k);
            case 2:
                return chiSo[n]
            case 3:
                return chiSo[n - 1].toString() + "." + chiSo[n].toString();
            case 4:
                return String.fromCharCode(k + 96);
            case 5:
                return "-"
            default:
                return null;
        }

        // if (n == 0) {
        //     xau = String.fromCharCode(k + 64);
        // }
        // if (n == 1) {
        //     for (let i = 0; i < this.soLaMa.length; i++) {
        //         while (k >= this.soLaMa[i].gTri) {
        //             xau += this.soLaMa[i].kyTu;
        //             k -= this.soLaMa[i].gTri;
        //         }
        //     }
        // }
        // if (n == 2) {
        //     xau = chiSo[n];
        // }
        // if (n == 3) {
        //     xau = chiSo[n - 1].toString() + "." + chiSo[n].toString();
        // }
        // if (n == 4) {
        //     xau = String.fromCharCode(k + 96);
        // }
        // if (n == 5) {
        //     xau = "-";
        // }
        // return xau;
    }
    // lấy phần đầu của số thứ tự, dùng để xác định phần tử cha
    getHead(str: string): string {
        return str.substring(0, str.lastIndexOf('.'));
    }
    // lấy phần đuôi của stt
    getTail(str: string): number {
        return parseInt(str.substring(str.lastIndexOf('.') + 1, str.length), 10);
    }

    checkDelete(stt: string) {
        const level = stt.split('.').length - 2;
        if (level == 0) {
            return true;
        }
        return false;
    };


    addLine(id: string) {
        const maNdung: string = this.lstCtietBcao.find(e => e.id == id)?.maNoiDung;
        const obj = {
            ma: maNdung,
            lstDanhMuc: this.noiDungs,
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
                const index: number = this.lstCtietBcao.findIndex(e => e.maNoiDung == res.ma);
                if (index == -1) {
                    const data: ItemData = {
                        ...new ItemData(),
                        maNoiDung: res.ma,
                        level: this.noiDungs.find(e => e.ma == res.ma)?.level,
                        noiDung: this.noiDungs.find(e => e.ma == res.ma)?.giaTri,
                    };
                    if (this.lstCtietBcao.length == 0) {
                        this.lstCtietBcao = Table.addHead(data, this.lstCtietBcao);
                    } else {
                        this.addSame(id, data);
                    }
                }
                id = this.lstCtietBcao.find(e => e.maNoiDung == res.ma)?.id;
                res.lstDanhMuc.forEach(item => {
                    if (this.lstCtietBcao.findIndex(e => e.maNoiDung == item.ma) == -1) {
                        const data: ItemData = {
                            ...new ItemData(),
                            maNoiDung: item.ma,
                            level: item.level,
                            noiDung: item.giaTri,
                        };
                        this.addLow(id, data);
                    }
                })
                this.updateEditCache();
            }
        });

    };

    addSame(id: string, initItem: ItemData) {
        this.lstCtietBcao = Table.addParent(id, initItem, this.lstCtietBcao);
    };


    addLow(id: string, initItem: ItemData) {
        this.lstCtietBcao = Table.addChild(id, initItem, this.lstCtietBcao);
    };


    deleteFile(id: string): void {
        this.formDetail.lstFiles = this.formDetail.lstFiles.filter((a: any) => a.id !== id);
        this.listFile = this.listFile.filter((a: any) => a?.lastModified.toString() !== id);
        this.formDetail.listIdDeleteFiles.push(id);
    }

    async downloadFile(id: string) {
        let file: any = this.listFile.find(element => element?.lastModified.toString() == id);
        let doc: any = this.formDetail.lstFiles.find(element => element?.id == id);
        await this.quanLyVonPhiService.downFile(file, doc);
    };

    exportToExcel() {
        const header = [
            { t: 0, b: 1, l: 0, r: 11, val: null },
            { t: 0, b: 1, l: 0, r: 0, val: 'STT' },
            { t: 0, b: 1, l: 1, r: 1, val: 'Nội dung' },
            { t: 0, b: 1, l: 2, r: 2, val: 'Kế hoạch vốn năm  ' + (this.namBcao - 1).toString() },
            { t: 0, b: 1, l: 3, r: 3, val: 'Dự toán đã giao lũy kế (đến 31/05/ ' + (this.namBcao - 1).toString() + ')' },
            { t: 0, b: 1, l: 4, r: 4, val: 'Quyết toán, giá trị dự toán hoặc tổng mức đầu tư' },
            { t: 0, b: 1, l: 5, r: 5, val: 'Kế hoạch điều chỉnh (+ tăng) (- giảm)' },
            { t: 0, b: 1, l: 6, r: 6, val: 'Kế hoạch năm' + (this.namBcao + 1) + 'sau điều chỉnh' },
            { t: 0, b: 1, l: 7, r: 7, val: 'Dự toán đề nghị điều chỉnh lần này' },
            { t: 0, b: 1, l: 8, r: 8, val: 'Dự toán Vụ TVQT đề nghị (+ tăng) (- giảm)' },
            { t: 0, b: 1, l: 9, r: 9, val: 'Ghi chú (Đã duyệt quyết toán/ chưa duyệt quyết toán)' },
            { t: 0, b: 1, l: 10, r: 10, val: 'Dự toán chênh lệch giữa Vụ TVQT điều chỉnh và đơn vị đề nghị (+ tăng) (- giảm)' },
            { t: 0, b: 1, l: 11, r: 11, val: 'Ý kiến của đơn vị cấp trên' },
        ]
        const fieldOrder = [
            "stt",
            "noiDung",
            "keHoachVon",
            "dtoanDaGiaoLke",
            "qtoanGtriDtoan",
            "dtoanDchinhDnghi",
            "khoachSauDchinh",
            "dtoanDchinhDnghiLanNay",
            "dtoanVuTvqtDnghi",
            "ghiChu",
            "chenhLech",
            "ykienDviCtren",
        ]

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
        XLSX.writeFile(workbook, this.dataInfo.maBcao + '_DC_PL04.xlsx');
    }


}



