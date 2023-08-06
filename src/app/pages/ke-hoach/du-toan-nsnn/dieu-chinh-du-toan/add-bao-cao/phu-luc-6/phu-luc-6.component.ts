import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { CurrencyMaskInputMode } from 'ngx-currency';
import { NgxSpinnerService } from 'ngx-spinner';
import { FileManip, Operator, Status, Table, Utils } from 'src/app/Utility/utils';
import { DialogDanhSachVatTuHangHoaComponent } from 'src/app/components/dialog/dialog-danh-sach-vat-tu-hang-hoa/dialog-danh-sach-vat-tu-hang-hoa.component';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { DieuChinhService } from 'src/app/services/quan-ly-von-phi/dieuChinhDuToan.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import * as uuid from 'uuid';
import * as XLSX from 'xlsx';
import { BtnStatus, Doc, Form } from '../../dieu-chinh-du-toan.constant';
export class ItemData {
    level: any;
    checked: boolean;
    id: string;
    qlnvKhvonphiDchinhCtietId: string;
    stt: string;
    noiDung: string;
    maDviTinh: string;
    sluongKhGiao: number;
    sluongThienTte: number;
    sluongThienUocThien: number;
    sluongThienCong: number;
    sluongThienDmuc: number;
    sluongThienTtien: number;
    dtoanGiaoLke: number;
    dtoanDchinh: number;
    dtoanVuTvqtDnghi: number;
    kphiThieu: number;
    maNdung: string;
    maDmuc: string;
    chenhLech: number;
    ghiChu: string;
    ykienDviCtren: string;
}

export const AMOUNT1 = {
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
    selector: 'app-phu-luc-6',
    templateUrl: './phu-luc-6.component.html',
    styleUrls: ['../add-bao-cao.component.scss'],
})
export class PhuLuc6Component implements OnInit {
    @Input() dataInfo;
    Op = new Operator('1');
    Utils = Utils;


    //thong tin chi tiet cua bieu mau
    formDetail: Form = new Form();
    total: ItemData = new ItemData();
    maDviTien: string = '1';
    namBcao: number;
    tongDieuChinhTang: number;
    tongDieuChinhGiam: number;
    dToanVuTang: number;
    dToanVuGiam: number;

    //danh muc
    lstCtietBcao: ItemData[] = [];
    keys = ['ttienNamDtoan', 'thienNamTruoc', 'dtoanNamHtai', 'uocNamHtai', 'sluongNamDtoan', 'sluongTd', 'ttienTd', 'chenhLech']
    listVattu: any[] = [];
    lstVatTuFull = [];
    dsDinhMuc: any[] = [];
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
        private dieuChinhService: DieuChinhService,
        private notification: NzNotificationService,
        private modal: NzModalService,
        private danhMucService: DanhMucHDVService,
        private quanLyVonPhiService: QuanLyVonPhiService,
        private fileManip: FileManip,
    ) {
    }


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
        if (this.status.general) {
            this.scrollX = Table.tableWidth(350, 7, 1, 110);
        } else {
            if (this.status.editAppVal) {
                this.scrollX = Table.tableWidth(350, 10, 2, 60);
            } else if (this.status.viewAppVal) {
                this.scrollX = Table.tableWidth(350, 10, 2, 0);
            } else {
                this.scrollX = Table.tableWidth(350, 7, 1, 0);
            }
        }

        await this.getDinhMucPL2X()
        if (this.dataInfo?.isSynthetic && this.formDetail.trangThai == Status.NEW) {
            this.lstCtietBcao.forEach(item => {
                const dinhMuc = this.dsDinhMuc.find(e => e.cloaiVthh == item.maNdung && e.loaiDinhMuc == item.maDmuc);
                if (!item.noiDung) {
                    item.noiDung = dinhMuc?.tenDinhMuc;
                }
                item.sluongThienDmuc = dinhMuc?.tongDmuc;
                item.maDviTinh = dinhMuc?.donViTinh;
                item.sluongThienTtien = Operator.mul(item.sluongThienDmuc, item.sluongThienCong);
                item.dtoanDchinh = item.sluongThienTtien - item.dtoanGiaoLke;
                item.dtoanVuTvqtDnghi = item.sluongThienTtien - item.dtoanGiaoLke;
            })
        }
        if (!this.lstCtietBcao[0]?.stt) {
            this.setIndex();
        }

        this.lstCtietBcao.forEach(item => {
            item.sluongThienTtien = Operator.mul(item.sluongThienDmuc, item.sluongThienCong);
            item.dtoanDchinh = item.sluongThienTtien - item.dtoanGiaoLke;
        })

        this.lstCtietBcao = Table.sortByIndex(this.lstCtietBcao);
        this.tinhTong();
        this.sum1();
        this.getTotal()
        this.updateEditCache();
        this.getStatusButton();

        this.spinner.hide();
    };


    getStatusButton() {
        this.status.ok = this.status.ok && (this.formDetail.trangThai == Status.NOT_RATE || this.formDetail.trangThai == Status.COMPLETE);
    }

    async getFormDetail() {
        await this.dieuChinhService.ctietBieuMau(this.dataInfo.id).toPromise().then(
            data => {
                if (data.statusCode == 0) {
                    this.formDetail = data.data;
                    this.formDetail.maDviTien = '1';
                    Object.assign(this.lstCtietBcao, this.formDetail.lstCtietDchinh);// this.lstCtietBcao = this.formDetail.lstCtietLapThamDinhs;
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

    async getDinhMucPL2X() {
        const request = {
            loaiDinhMuc: '02',
            maDvi: this.dataInfo.maDvi,
        }
        await this.quanLyVonPhiService.getDinhMuc(request).toPromise().then(
            res => {
                if (res.statusCode == 0) {
                    this.dsDinhMuc = res.data;
                } else {
                    this.notification.error(MESSAGE.ERROR, res?.msg);
                }
            },
            err => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
            }
        )
    }

    setIndex() {
        const lstVtuTemp = this.lstCtietBcao.filter(e => !e.maDmuc);
        for (let i = 0; i < lstVtuTemp.length; i++) {
            const stt = '0.' + (i + 1).toString();
            const index = this.lstCtietBcao.findIndex(e => e.id == lstVtuTemp[i].id);
            this.lstCtietBcao[index].stt = stt;
            const lstDmTemp = this.lstCtietBcao.filter(e => e.maNdung == lstVtuTemp[i].maNdung && !!e.maDmuc);
            for (let j = 0; j < lstDmTemp.length; j++) {
                const ind = this.lstCtietBcao.findIndex(e => e.id == lstDmTemp[j].id);
                this.lstCtietBcao[ind].stt = stt + '.' + (j + 1).toString();
            }
        }
        lstVtuTemp.forEach(item => {
            this.sum(item.stt + '.1');
        })
    }

    checkDelete(stt: string) {
        const level = stt.split('.').length - 2;
        if (level == 0) {
            return true;
        }
        return false;
    }

    // lấy phần đầu của số thứ tự, dùng để xác định phần tử cha
    getHead(str: string): string {
        return str.substring(0, str.lastIndexOf('.'));
    }
    // lấy phần đuôi của stt
    getTail(str: string): number {
        return parseInt(str.substring(str.lastIndexOf('.') + 1, str.length), 10);
    }

    // chuyển đổi stt đang được mã hóa thành dạng I, II, a, b, c, ...
    getChiMuc(str: string): string {
        str = str.substring(str.indexOf('.') + 1, str.length);
        let xau = "";
        const chiSo: any = str.split('.');
        const n: number = chiSo.length - 1;
        if (n == 0) {
            xau = chiSo[n];
        }
        if (n == 1) {
            xau = "-";
        }
        return xau;
    }

    // luu
    async save(trangThai: string, lyDoTuChoi: string) {
        if (this.lstCtietBcao.some(e => this.editCache[e.id].edit)) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTSAVE);
            return;
        }

        if (this.lstCtietBcao.some(e => e.sluongThienTtien > Utils.MONEY_LIMIT)) {
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

        if (this.status.general) {
            lstCtietBcaoTemp?.forEach(item => {
                item.dtoanVuTvqtDnghi = item.dtoanDchinh;
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
        this.dieuChinhService.updatePLDieuChinh(request).toPromise().then(
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
        if (!this.formDetail?.id) {
            this.notification.warning(MESSAGE.WARNING, MESSAGE.MESSAGE_DELETE_WARNING);
            return;
        }
        const requestGroupButtons = {
            id: this.formDetail.id,
            trangThai: mcn,
            lyDoTuChoi: lyDoTuChoi,
        };
        this.spinner.show();
        await this.dieuChinhService.approveDieuChinhPheDuyet(requestGroupButtons).toPromise().then(async (data) => {
            if (data.statusCode == 0) {
                this.formDetail.trangThai = mcn;
                this.getStatusButton();
                if (mcn == "0") {
                    this.notification.success(MESSAGE.SUCCESS, MESSAGE.REJECT_SUCCESS);
                } else {
                    this.notification.success(MESSAGE.SUCCESS, MESSAGE.APPROVE_SUCCESS);
                }
                this._modalRef.close({
                    formDetail: this.formDetail,
                });
            } else {
                this.notification.error(MESSAGE.ERROR, data?.msg);
            }
        }, err => {
            this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        });
        this.spinner.hide();
    };

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
    };

    // xoa tat ca cac dong duoc check
    deleteAllChecked() {
        const lstId: any[] = [];
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

    checkEdit(stt: string) {
        const lstTemp = this.lstCtietBcao.filter(e => e.stt !== stt);
        return lstTemp.every(e => !e.stt.startsWith(stt));
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

    // luu thay doi
    saveEdit(id: string): void {
        const index = this.lstCtietBcao.findIndex(item => item.id === id); // lay vi tri hang minh sua
        Object.assign(this.lstCtietBcao[index], this.editCache[id].data); // set lai data cua lstCtietBcao[index] = this.editCache[id].data
        this.editCache[id].edit = false; // CHUYEN VE DANG TEXT
        this.updateEditCache();
        this.sum(this.lstCtietBcao[index].stt);
        this.getTotal()
        this.tinhTong()
    }

    // huy thay doi
    cancelEdit(id: string): void {
        const index = this.lstCtietBcao.findIndex(item => item.id === id);
        // lay vi tri hang minh sua
        this.editCache[id] = {
            data: { ...this.lstCtietBcao[index] },
            edit: false
        };
        this.tinhTong();
    }

    // click o checkbox single
    updateSingleChecked(): void {
        if (this.lstCtietBcao.every(item => item.checked || item.level != 0)) {     // tat ca o checkbox deu = true thi set o checkbox all = true
            this.allChecked = true;
        } else {                                                        // o checkbox vua = false, vua = true thi set o checkbox all = indeterminate
            this.allChecked = false;
        }
    }

    // click o checkbox all
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

    deleteLine(id: any) {
        const index: number = this.lstCtietBcao.findIndex(e => e.id === id); // vi tri hien tai
        const nho: string = this.lstCtietBcao[index].stt;
        const head: string = this.getHead(this.lstCtietBcao[index].stt); // lay phan dau cua so tt
        const stt: string = this.lstCtietBcao[index].stt;
        //xóa phần tử và con của nó
        this.lstCtietBcao = this.lstCtietBcao.filter(e => !e.stt.startsWith(nho));
        //update lại số thức tự cho các phần tử cần thiết
        const lstIndex: number[] = [];
        for (let i = this.lstCtietBcao.length - 1; i >= index; i--) {
            if (this.getHead(this.lstCtietBcao[i].stt) == head) {
                lstIndex.push(i);
            }
        }
        this.replaceIndex(lstIndex, -1);
        this.tinhTong();
        this.sum(stt);
        this.updateEditCache();
    }

    selectGoods() {
        const modalTuChoi = this.modal.create({
            nzTitle: 'Danh sách hàng hóa',
            nzContent: DialogDanhSachVatTuHangHoaComponent,
            nzBodyStyle: { overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' },
            nzMaskClosable: false,
            nzClosable: false,
            nzWidth: '900px',
            nzFooter: null,
            nzComponentParams: {},
        });
        modalTuChoi.afterClose.subscribe(async (data) => {
            if (data) {
                if (this.lstCtietBcao.findIndex(e => e.maNdung == data.ma) == -1) {
                    //tim so thu tu cho loai vat tu moi
                    let index = 1;
                    this.lstCtietBcao.forEach(item => {
                        if (item.maNdung && !item.maDmuc) {
                            index += 1;
                        }
                    })
                    const stt = '0.' + index.toString();
                    //them vat tu moi vao bang
                    this.lstCtietBcao.push({
                        ... new ItemData(),
                        id: uuid.v4() + 'FE',
                        stt: stt,
                        maNdung: data.ma,
                        noiDung: data.ten,
                        level: 0,
                    })
                    const lstTemp = this.dsDinhMuc.filter(e => e.cloaiVthh == data.ma);
                    for (let i = 1; i <= lstTemp.length; i++) {
                        this.lstCtietBcao.push({
                            ...new ItemData(),
                            id: uuid.v4() + 'FE',
                            stt: stt + '.' + i.toString(),
                            maNdung: data.ma,
                            maDmuc: lstTemp[i - 1].loaiDinhMuc,
                            noiDung: lstTemp[i - 1].tenDinhMuc,
                            maDviTinh: lstTemp[i - 1].donViTinh,
                            level: 1,
                            sluongThienDmuc: lstTemp[i - 1].tongDmuc,
                        })
                    }
                    this.updateEditCache();
                }
            }
        });
    }

    // tinh tong tu cap duoi
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
                maNdung: data.maNdung,
            }
            this.lstCtietBcao.forEach(item => {
                if (this.getHead(item.stt) == stt) {
                    this.lstCtietBcao[index].sluongThienTtien = Operator.sum([this.lstCtietBcao[index].sluongThienTtien, item.sluongThienTtien]);
                    this.lstCtietBcao[index].dtoanGiaoLke = Operator.sum([this.lstCtietBcao[index].dtoanGiaoLke, item.dtoanGiaoLke]);
                    this.lstCtietBcao[index].dtoanDchinh = Operator.sum([this.lstCtietBcao[index].dtoanDchinh, item.dtoanDchinh]);
                    this.lstCtietBcao[index].dtoanVuTvqtDnghi = Operator.sum([this.lstCtietBcao[index].dtoanVuTvqtDnghi, item.dtoanVuTvqtDnghi]);
                    this.lstCtietBcao[index].kphiThieu = Operator.sum([this.lstCtietBcao[index].kphiThieu, item.kphiThieu]);
                }
            })
            stt = this.getHead(stt);
        }
        this.tinhTong();
    }
    // tinh tong tu cap duoi khong chuyen nstt
    sum1() {
        this.lstCtietBcao.forEach(itm => {
            let stt = this.getHead(itm.stt);
            while (stt != '0') {
                const index = this.lstCtietBcao.findIndex(e => e.stt == stt);
                const data = this.lstCtietBcao[index];
                this.lstCtietBcao[index] = {
                    ...new ItemData(),
                    id: data.id,
                    stt: data.stt,
                    noiDung: data.noiDung,
                    level: data.level,
                    maNdung: data.maNdung,
                }
                this.lstCtietBcao.forEach(item => {
                    if (this.getHead(item.stt) == stt) {
                        this.lstCtietBcao[index].sluongThienTtien = Operator.sum([this.lstCtietBcao[index].sluongThienTtien, item.sluongThienTtien]);
                        this.lstCtietBcao[index].dtoanGiaoLke = Operator.sum([this.lstCtietBcao[index].dtoanGiaoLke, item.dtoanGiaoLke]);
                        this.lstCtietBcao[index].dtoanDchinh = Operator.sum([this.lstCtietBcao[index].dtoanDchinh, item.dtoanDchinh]);
                        this.lstCtietBcao[index].dtoanVuTvqtDnghi = Operator.sum([this.lstCtietBcao[index].dtoanVuTvqtDnghi, item.dtoanVuTvqtDnghi]);
                        this.lstCtietBcao[index].kphiThieu = Operator.sum([this.lstCtietBcao[index].kphiThieu, item.kphiThieu]);
                    }
                })
                stt = this.getHead(stt);
            }
            this.tinhTong();
        })

    }

    getTotal() {
        this.total = new ItemData();
        this.lstCtietBcao.forEach(item => {
            if (item.level == 0) {
                this.total.sluongThienTtien = Operator.sum([this.total.sluongThienTtien, item.sluongThienTtien]);
                this.total.dtoanGiaoLke = Operator.sum([this.total.dtoanGiaoLke, item.dtoanGiaoLke]);
                this.total.dtoanDchinh = Operator.sum([this.total.dtoanDchinh, item.dtoanDchinh]);
                this.total.dtoanVuTvqtDnghi = Operator.sum([this.total.dtoanVuTvqtDnghi, item.dtoanVuTvqtDnghi]);
                this.total.kphiThieu = Operator.sum([this.total.kphiThieu, item.kphiThieu]);
                this.total.chenhLech = Operator.sum([this.total.chenhLech, item.chenhLech]);
            }
        })
    };

    tinhTong() {
        this.tongDieuChinhGiam = 0;
        this.tongDieuChinhTang = 0;
        this.dToanVuTang = 0;
        this.dToanVuGiam = 0;
        this.lstCtietBcao.forEach(item => {
            item.chenhLech = Operator.sum([item.dtoanVuTvqtDnghi, - item.dtoanDchinh]);
            const str = item.stt
            if (!(this.lstCtietBcao.findIndex(e => Table.preIndex(e.stt) == str) != -1)) {
                if (item.dtoanDchinh !== null) {
                    if (item.dtoanDchinh < 0) {
                        Number(this.tongDieuChinhGiam += Number(item?.dtoanDchinh));
                    } else {
                        Number(this.tongDieuChinhTang += Number(item?.dtoanDchinh));
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
        this.editCache[id].data.sluongThienCong = Operator.sum([this.editCache[id].data.sluongThienTte, this.editCache[id].data.sluongThienUocThien]);
        this.editCache[id].data.sluongThienTtien = Operator.mul(this.editCache[id].data.sluongThienDmuc, this.editCache[id].data.sluongThienCong);
        this.editCache[id].data.dtoanDchinh = Operator.sum([this.editCache[id].data.sluongThienTtien, - this.editCache[id].data.dtoanGiaoLke]);
        this.editCache[id].data.chenhLech = Operator.sum([this.editCache[id].data.dtoanVuTvqtDnghi, - this.editCache[id].data.dtoanDchinh]);
    }

    //thay thế các stt khi danh sách được cập nhật, heSo=1 tức là tăng stt lên 1, heso=-1 là giảm stt đi 1
    replaceIndex(lstIndex: number[], heSo: number) {
        if (heSo == -1) {
            lstIndex.reverse();
        }
        //thay doi lai stt cac vi tri vua tim duoc
        lstIndex.forEach(item => {
            const str = this.getHead(this.lstCtietBcao[item].stt) + "." + (this.getTail(this.lstCtietBcao[item].stt) + heSo).toString();
            const nho = this.lstCtietBcao[item].stt;
            this.lstCtietBcao.forEach(item => {
                item.stt = item.stt.replace(nho, str);
            })
        })
    }

    //tìm vị trí cần để thêm mới
    findVt(str: string): number {
        const start: number = this.lstCtietBcao.findIndex(e => e.stt == str);
        let index: number = start;
        for (let i = start + 1; i < this.lstCtietBcao.length; i++) {
            if (this.lstCtietBcao[i].stt.startsWith(str)) {
                index = i;
            }
        }
        return index;
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

    // action print
    // doPrint() {
    //     const WindowPrt = window.open(
    //         '',
    //         '',
    //         'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0',
    //     );
    //     let printContent = '';
    //     printContent = printContent + '<div>';
    //     printContent =
    //         printContent + document.getElementById('tablePrint').innerHTML;
    //     printContent = printContent + '</div>';
    //     WindowPrt.document.write(printContent);
    //     WindowPrt.document.close();
    //     WindowPrt.focus();
    //     WindowPrt.print();
    //     WindowPrt.close();
    // }

    handleCancel() {
        this._modalRef.close();
    };

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
            { t: 0, b: 2, l: 0, r: 16, val: null },
            { t: 0, b: 2, l: 0, r: 0, val: 'STT' },
            { t: 0, b: 2, l: 1, r: 1, val: 'Nội dung' },
            { t: 0, b: 2, l: 2, r: 2, val: 'Đơn vị tính' },
            { t: 0, b: 2, l: 3, r: 3, val: 'Số lượng theo KH được giao năm' + (this.namBcao - 1).toString() },
            { t: 0, b: 0, l: 4, r: 8, val: 'Số lượng thực hiện năm' + (this.namBcao - 1).toString() },
            { t: 0, b: 2, l: 9, r: 9, val: 'Dự toán đã giao lũy kế' },
            { t: 0, b: 2, l: 10, r: 10, val: 'Dự toán điều chỉnh' },
            { t: 0, b: 2, l: 11, r: 11, val: 'Dự toán Vụ TVQT đề nghị (+ tăng) (- giảm)' },
            { t: 0, b: 2, l: 12, r: 12, val: 'Kinh phí thiếu năm ' + (this.namBcao - 1).toString() },
            { t: 0, b: 2, l: 13, r: 13, val: 'Dự toán chênh lệch giữa Vụ TVQT và đơn vị đề nghị (+ tăng) (- giảm)' },
            { t: 0, b: 2, l: 14, r: 14, val: 'Ý kiến của đơn vị cấp trên' },
            { t: 0, b: 2, l: 15, r: 15, val: 'Ghi chú' },

            { t: 1, b: 2, l: 4, r: 4, val: 'Số lượng thực tế đã thực hiện đến thời điểm báo cáo' },
            { t: 1, b: 1, l: 5, r: 5, val: 'Số lượng ước thực hiện từ thời điểm báo cáo đến cuối năm' },
            { t: 1, b: 2, l: 6, r: 6, val: 'Cộng' },
            { t: 1, b: 2, l: 7, r: 7, val: 'Định mức' },
            { t: 1, b: 2, l: 8, r: 8, val: 'Thành tiền (đồng) (Tổng nhu cầu năm nay)' },
        ]
        const fieldOrder = [
            'stt',
            'noiDung',
            'maDviTinh',
            'sluongKhGiao',
            'sluongThienTte',
            'sluongThienUocThien',
            'sluongThienCong',
            'sluongThienDmuc',
            'sluongThienTtien',
            'dtoanGiaoLke',
            'dtoanDchinh',
            'dtoanVuTvqtDnghi',
            'kphiThieu',
            'chenhLech',
            'ghiChu',
            'ykienDviCtren',
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
            item.stt = this.getChiMuc(item.stt);
            for (let i = 0; i < level; i++) {
                item.stt = '   ' + item.stt;
            }
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




