import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { CurrencyMaskInputMode } from 'ngx-currency';
import { NgxSpinnerService } from 'ngx-spinner';
import { Operator, Status, Table, Utils } from 'src/app/Utility/utils';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { DialogAddVatTuComponent } from 'src/app/pages/quan-ly-thong-tin-quyet-toan-von-phi-hang-dtqg/von-phi-hang-du-tru-quoc-gia/bao-cao-quyet-toan/dialog-add-vat-tu/dialog-add-vat-tu.component';
import { DieuChinhService } from 'src/app/services/quan-ly-von-phi/dieuChinhDuToan.service';
import { UserService } from 'src/app/services/user.service';
import * as uuid from "uuid";
import * as XLSX from 'xlsx';
import { BtnStatus, Doc, Form } from '../../dieu-chinh-du-toan.constant';
import { TEN_HANG } from './phu-luc-7.constant';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { DialogDanhSachVatTuHangHoaComponent } from 'src/app/components/dialog/dialog-danh-sach-vat-tu-hang-hoa/dialog-danh-sach-vat-tu-hang-hoa.component';
export class ItemData {
    level: any;
    id: string;
    qlnvKhvonphiDchinhCtietId: string;
    stt: string;
    dmucHang: string;
    tenHang: string;
    donViTinh: string;
    khoachDpNhan: string;
    khoachQdGiaoNvu: string;
    khoachLuong: number;
    dmucChiPhiTaiCuaKho: number;
    binhQuanChiPhiNgoaiCuaKho: number;
    tdiemBcaoLuong: number;
    tdiemBcaoChiPhiTaiCuaKho: number;
    tdiemBcaoChiPhiNgoaiCuaKho: number;
    tdiemBcaoChiPhiTongCong: number;
    tdiemBcaoCcu: string;
    dkienThienLuong: number;
    dkienThienChiPhiTaiCuaKho: number;
    dkienThienChiPhiNgoaiCuaKho: number;
    dkienThienChiPhiTongCong: number;
    ncauDtoan: number;
    dtoanLkeDaGiao: number;
    dtoanDnghiDchinh: number;
    dtoanVuTvqtDnghi: number;
    kphiThieuNamTruoc: number;
    chenhLech: number;
    ghiChu: string;
    ykienDviCtren: string;
    checked: boolean;

    constructor(data: Partial<Pick<ItemData, keyof ItemData>>) {
        Object.assign(this, data);
    }

    changeModel() {
        this.tdiemBcaoChiPhiTaiCuaKho = Operator.mul(this.tdiemBcaoLuong, this.dmucChiPhiTaiCuaKho);
        this.tdiemBcaoChiPhiNgoaiCuaKho = Operator.mul(this.tdiemBcaoLuong, this.binhQuanChiPhiNgoaiCuaKho);
        this.tdiemBcaoChiPhiTongCong = Operator.sum([this.tdiemBcaoChiPhiTaiCuaKho, this.tdiemBcaoChiPhiNgoaiCuaKho]);

        this.dkienThienChiPhiTaiCuaKho = Operator.mul(this.dmucChiPhiTaiCuaKho, this.dkienThienLuong);
        this.dkienThienChiPhiNgoaiCuaKho = Operator.mul(this.binhQuanChiPhiNgoaiCuaKho, this.dkienThienLuong);
        this.dkienThienChiPhiTongCong = Operator.sum([this.dkienThienChiPhiTaiCuaKho, this.dkienThienChiPhiNgoaiCuaKho]);

        this.ncauDtoan = Operator.sum([this.tdiemBcaoChiPhiTongCong, this.dkienThienChiPhiTongCong]);
        this.dtoanDnghiDchinh = Operator.sum([this.ncauDtoan, - this.dtoanLkeDaGiao]);
        this.chenhLech = Operator.sum([this.dtoanVuTvqtDnghi, - this.dtoanDnghiDchinh]);
    }

    upperBound() {
        return (
            // this.dtoanLkeDaGiao > Utils.MONEY_LIMIT ||
            this.ncauDtoan > Utils.MONEY_LIMIT
            // this.dtoanVuTvqtDnghi > Utils.MONEY_LIMIT ||
            // this.ncauDtoan > Utils.MONEY_LIMIT ||
            // this.kphiThieuNamTruoc > Utils.MONEY_LIMIT
        );
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
            default:
                return null;
        }
    }

    clear() {
        Object.keys(this).forEach(key => {
            if (typeof this[key] === 'number' && !['level'].includes(key)) {
                this[key] = null;
            }
        })
    }

    sum(data: ItemData) {
        Object.keys(data).forEach(key => {
            if (!['level', 'sluongTaiKho', 'dmucTaiKho', 'binhQuanNgoaiKho'].includes(key) && (typeof this[key] == 'number' || typeof data[key] == 'number')) {
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
    selector: 'app-phu-luc-7',
    templateUrl: './phu-luc-7.component.html',
    styleUrls: ['../add-bao-cao.component.scss'],
})
export class PhuLuc7Component implements OnInit {
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
    keys = [
        // "dmucChiPhiTaiCuaKho",
        // "binhQuanChiPhiNgoaiCuaKho",
        "tdiemBcaoChiPhiTaiCuaKho",
        "tdiemBcaoChiPhiNgoaiCuaKho",
        "tdiemBcaoChiPhiTongCong",
        // "tdiemBcaoCcu",
        "dkienThienChiPhiTaiCuaKho",
        "dkienThienChiPhiNgoaiCuaKho",
        "dkienThienChiPhiTongCong",
        "ncauDtoan",
        "dtoanLkeDaGiao",
        "dtoanDnghiDchinh",
        "dtoanVuTvqtDnghi",
        "kphiThieuNamTruoc",
        "chenhLech",


        // 'thNamTruoc',
        // 'namDtoan',
        // 'namUocTh',
        // 'ttienTaiKho',
        // 'ttienNgoaiKho',
        // 'tongCong',
        // 'tdinhKhoTtien',
        // 'tdinhTcong',
        // 'chenhLech'
    ]
    lstVatTuFull: any[] = [];
    dsDinhMuc: any[] = [];
    scrollX: string;
    listIdDelete = ""

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

    noiDungs: any[] = TEN_HANG;
    constructor(
        private _modalRef: NzModalRef,
        private spinner: NgxSpinnerService,
        private dieuChinhDuToanService: DieuChinhService,
        private notification: NzNotificationService,
        private modal: NzModalService,
        public userService: UserService,
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
        this.namBcao = this.dataInfo.namBcao;

        if (this.status.general) {
            // const category = await this.danhMucService.danhMucChungGetAll('LTD_PL2');
            // if (category) {
            this.noiDungs = TEN_HANG;
            // }
            this.scrollX = Table.tableWidth(350, 21, 1, 110);
        } else {
            if (this.status.editAppVal) {
                this.scrollX = Table.tableWidth(350, 24, 2, 60);
            } else if (this.status.viewAppVal) {
                this.scrollX = Table.tableWidth(350, 24, 2, 0);
            } else {
                this.scrollX = Table.tableWidth(350, 21, 1, 0);
            }
        }

        // if (this.lstCtietBcao.length == 0) {
        //     this.noiDungs.forEach(s => {
        //         this.lstCtietBcao.push(
        //             new ItemData({
        //                 id: uuid.v4() + 'FE',
        //                 stt: s.ma,
        //                 tenHang: s.tenHang,
        //                 dmucHang: s.ma,
        //             })
        //         )
        //     })
        //     this.setLevel();
        // }

        // if (this.lstCtietBcao.length == 0) {
        //     this.noiDungs.forEach(e => {
        //         this.lstCtietBcao.push(new ItemData({
        //             id: uuid.v4() + 'FE',
        //             stt: e.ma,
        //             tenHang: e.tenHang,
        //             dmucHang: e.ma,
        //         }))
        //     })
        // } else if (!this.lstCtietBcao[0]?.stt) {
        //     this.lstCtietBcao.forEach(item => {
        //         item.stt = item.dmucHang;
        //     })
        // }

        // await this.getDinhMuc();
        // this.lstCtietBcao.forEach(item => {
        //     if (!item.tenHang) {
        //         const dinhMuc = this.dsDinhMuc.find(e => e.cloaiVthh == item.dmucHang);
        //         item.tenHang = dinhMuc?.tenDinhMuc;
        //         item.dmucChiPhiTaiCuaKho = dinhMuc?.tongDmuc;
        //         item.donViTinh = dinhMuc?.donViTinh;
        //         // item.ttienTaiKho = Operator.mul(item.dmucTaiKho, item.sluongTaiKho);
        //     }
        // })

        // if (this.dataInfo.isSynthetic) {
        //     this.lstCtietBcao.forEach(item => {
        //         const dinhMuc = this.dsDinhMuc.find(e => e.cloaiVthh == item.dmucHang);
        //         item.dmucChiPhiTaiCuaKho = dinhMuc?.tongDmuc;
        //         // item.changeModel();
        //     })
        //     this.sum1()
        // }
        // if (!this.lstCtietBcao[0]?.stt) {
        //     this.setIndex();
        // }

        if (this.lstCtietBcao.length == 0) {
            this.noiDungs.forEach(e => {
                this.lstCtietBcao.push(new ItemData({
                    id: uuid.v4() + 'FE',
                    stt: e.ma,
                    tenHang: e.tenHang,
                    dmucHang: e.ma,
                }))
            })
            this.setLevel();
        } else if (!this.lstCtietBcao[0]?.stt) {
            this.lstCtietBcao.forEach(item => {
                item.stt = item.dmucHang;
            })
        }

        await this.getDinhMuc();
        this.lstCtietBcao.forEach(item => {
            const dinhMuc = this.dsDinhMuc.find(e => e.cloaiVthh == item.dmucHang);
            if (!item.tenHang) {
                // item.tenHang = dinhMuc?.tenDinhMuc;
                item.dmucChiPhiTaiCuaKho = dinhMuc?.tongDmuc;
                // item.donViTinh = dinhMuc?.donViTinh;
                item.dkienThienChiPhiTaiCuaKho = Operator.mul(item.dmucChiPhiTaiCuaKho, item.dkienThienLuong);
                item.dkienThienChiPhiNgoaiCuaKho = Operator.mul(item.binhQuanChiPhiNgoaiCuaKho, item.dkienThienLuong);
                item.dkienThienChiPhiTongCong = Operator.sum([item.dkienThienChiPhiTaiCuaKho, item.dkienThienChiPhiNgoaiCuaKho])

                item.tdiemBcaoChiPhiTaiCuaKho = Operator.mul(item.tdiemBcaoLuong, item.dmucChiPhiTaiCuaKho)
                item.tdiemBcaoChiPhiNgoaiCuaKho = Operator.mul(item.binhQuanChiPhiNgoaiCuaKho, item.tdiemBcaoLuong)
                item.tdiemBcaoChiPhiTongCong = Operator.sum([item.tdiemBcaoChiPhiTaiCuaKho, item.tdiemBcaoChiPhiNgoaiCuaKho])

                item.ncauDtoan = Operator.sum([item.tdiemBcaoChiPhiTongCong, item.dkienThienChiPhiTongCong])
                item.dtoanDnghiDchinh = Operator.sum([item.ncauDtoan, - item.dtoanLkeDaGiao])
            }
            this.sum1()
        })


        if (this.dataInfo?.isSynthetic) {
            this.lstCtietBcao.forEach(item => {
                const dinhMuc = this.dsDinhMuc.find(e => e.cloaiVthh == item.dmucHang);
                item.dmucChiPhiTaiCuaKho = dinhMuc?.tongDmuc;

                item.dkienThienChiPhiTaiCuaKho = Operator.mul(item.dmucChiPhiTaiCuaKho, item.dkienThienLuong);
                // item.dkienThienChiPhiNgoaiCuaKho = Operator.mul(item.binhQuanChiPhiNgoaiCuaKho, item.dkienThienLuong);
                item.dkienThienChiPhiTongCong = Operator.sum([item.dkienThienChiPhiTaiCuaKho, item.dkienThienChiPhiNgoaiCuaKho])

                item.tdiemBcaoChiPhiTaiCuaKho = Operator.mul(item.tdiemBcaoLuong, item.dmucChiPhiTaiCuaKho)
                // item.tdiemBcaoChiPhiNgoaiCuaKho = Operator.mul(item.binhQuanChiPhiNgoaiCuaKho, item.tdiemBcaoLuong)
                item.tdiemBcaoChiPhiTongCong = Operator.sum([item.tdiemBcaoChiPhiTaiCuaKho, item.tdiemBcaoChiPhiNgoaiCuaKho])

                item.ncauDtoan = Operator.sum([item.tdiemBcaoChiPhiTongCong, item.dkienThienChiPhiTongCong])
                item.dtoanDnghiDchinh = Operator.sum([item.ncauDtoan, - item.dtoanLkeDaGiao])
            })
            this.sum1()
        }

        this.lstCtietBcao = Table.sortByIndex(this.lstCtietBcao);

        // this.lstCtietBcao = Table.sortByIndex(this.lstCtietBcao);
        this.tinhTong();
        this.getTotal();
        this.updateEditCache();
        this.getStatusButton();
        this.spinner.hide();

    };

    sum1() {
        this.lstCtietBcao.forEach(item => {
            this.sum(item.stt);
        })
    }

    setIndex() {
        const lstVtuTemp = this.lstCtietBcao.filter(e => !e.dmucHang);
        for (let i = 0; i < lstVtuTemp.length; i++) {
            const stt = '0.' + (i + 1).toString();
            const index = this.lstCtietBcao.findIndex(e => e.id == lstVtuTemp[i].id);
            this.lstCtietBcao[index].stt = stt;
            const lstDmTemp = this.lstCtietBcao.filter(e => e.dmucHang == lstVtuTemp[i].dmucHang && !!e.dmucHang);
            for (let j = 0; j < lstDmTemp.length; j++) {
                const ind = this.lstCtietBcao.findIndex(e => e.id == lstDmTemp[j].id);
                this.lstCtietBcao[ind].stt = stt + '.' + (j + 1).toString();
            }
        }
        lstVtuTemp.forEach(item => {
            this.sum(item.stt + '.1');
        })
    }

    async getDinhMuc() {
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


    async getFormDetail() {
        await this.dieuChinhDuToanService.ctietBieuMau(this.dataInfo.id).toPromise().then(
            data => {
                if (data.statusCode == 0) {
                    this.formDetail = data.data;
                    this.formDetail.maDviTien = '1';
                    this.formDetail.lstCtietDchinh.forEach(item => {
                        this.lstCtietBcao.push(new ItemData(item))
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


    setLevel() {
        this.lstCtietBcao.forEach(item => {
            const str: string[] = item.stt.split('.');
            item.level = str.length - 2;
        })
    }

    // updateAllChecked(): void {
    //     if (this.allChecked) {                                    // checkboxall == true thi set lai lstCTietBCao.checked = true
    //         this.lstCtietBcao = this.lstCtietBcao.map(item => ({
    //             ...item,
    //             checked: true
    //         }));
    //     } else {
    //         this.lstCtietBcao = this.lstCtietBcao.map(item => ({    // checkboxall == false thi set lai lstCTietBCao.checked = false
    //             ...item,
    //             checked: false
    //         }));
    //     }
    // }

    getTotal() {
        this.total.clear();
        this.lstCtietBcao.forEach(item => {
            if (item.level == 0) {
                this.total.sum(item);
            }
        })
    }

    getStatusButton() {
        this.status.ok = this.status.ok && (this.formDetail.trangThai == Status.NOT_RATE || this.formDetail.trangThai == Status.COMPLETE);
    };

    // luu
    async save(trangThai: string, lyDoTuChoi: string) {
        if (this.lstCtietBcao.some(e => this.editCache[e.id].edit)) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTSAVE);
            return;
        }

        if (this.lstCtietBcao.some(e => e.dtoanLkeDaGiao > Utils.MONEY_LIMIT)) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.MONEYRANGE);
            return;
        }

        if (this.listFile.some(file => file.size > Utils.FILE_SIZE)) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.OVER_SIZE);
            return;
        }
        //tinh lai don vi tien va kiem tra gioi han cua chung
        const lstCtietBcaoTemp: ItemData[] = [];
        console.log(this.lstCtietBcao);

        this.lstCtietBcao.forEach(item => {
            lstCtietBcaoTemp.push(item.request())
        })

        if (this.status.general) {
            lstCtietBcaoTemp?.forEach(item => {
                item.dtoanVuTvqtDnghi = item.dtoanDnghiDchinh;
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

    handleCancel() {
        this._modalRef.close();
    };

    // deleteLine(id: any): void {
    //     this.lstCtietBcao = this.lstCtietBcao.filter(item => item.id != id)
    //     if (typeof id == "number") {
    //         this.listIdDelete += id + ","
    //     }
    // };

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
    };

    checkDelete(stt: string) {
        const level = stt.split('.').length - 2;
        if (level == 1 || level == 2) {
            return true;
        }
        return false;
    }

    updateSingleChecked(): void {
        if (this.lstCtietBcao.every(item => !item.checked)) {
            this.allChecked = false;
        } else if (this.lstCtietBcao.every(item => item.checked)) {
            this.allChecked = true;
        }
    };

    saveEdit(id: string): void {
        const index = this.lstCtietBcao.findIndex(item => item.id === id); // lay vi tri hang minh sua
        Object.assign(this.lstCtietBcao[index], this.editCache[id].data); // set lai data cua lstCtietBcao[index] = this.editCache[id].data
        this.editCache[id].edit = false; // CHUYEN VE DANG TEXT
        this.updateEditCache();
        this.sum(this.lstCtietBcao[index].stt);
        this.tinhTong();
        this.getTotal();
    };

    updateEditCache(): void {
        this.lstCtietBcao.forEach(item => {
            this.editCache[item.id] = {
                edit: false,
                data: new ItemData(item)
            };
        });
    };

    sum(stt: string) {
        stt = Table.preIndex(stt);
        while (stt != '0') {
            const index = this.lstCtietBcao.findIndex(e => e.stt == stt);
            const data = this.lstCtietBcao[index];
            this.lstCtietBcao[index] = new ItemData({
                id: data.id,
                stt: data.stt,
                level: data.level,
                dmucHang: data.dmucHang,
                tenHang: data.tenHang,
                donViTinh: data.donViTinh,
            })
            this.lstCtietBcao.forEach(item => {
                if (Table.preIndex(item.stt) == stt) {
                    this.keys.forEach(key => {
                        this.lstCtietBcao[index][key] = Operator.sum([this.lstCtietBcao[index][key], item[key]]);
                    })
                }
            })
            stt = Table.preIndex(stt);
        }
        this.getTotal();
        this.tinhTong();
    };

    cancelEdit(id: string): void {
        const index = this.lstCtietBcao.findIndex(item => item.id === id);
        // lay vi tri hang minh sua
        this.editCache[id] = {
            data: new ItemData(this.lstCtietBcao[index]),
            edit: false
        };
        this.tinhTong();
    };

    tongDieuChinhTang: number;
    tongDieuChinhGiam: number;
    dToanVuTang: number;
    dToanVuGiam: number;
    tinhTong() {
        this.tongDieuChinhGiam = 0;
        this.tongDieuChinhTang = 0;
        this.dToanVuTang = 0;
        this.dToanVuGiam = 0;
        this.lstCtietBcao.forEach(item => {
            item.chenhLech = Operator.sum([item.dtoanVuTvqtDnghi, - item.dtoanDnghiDchinh])
            if (item.level == 0) {
                if (item.dtoanDnghiDchinh && item.dtoanDnghiDchinh !== null) {
                    if (item.dtoanDnghiDchinh < 0) {
                        Number(this.tongDieuChinhGiam += Number(item?.dtoanDnghiDchinh));
                    } else {
                        Number(this.tongDieuChinhTang += Number(item?.dtoanDnghiDchinh));
                    }
                }

                if (item.dtoanVuTvqtDnghi && item.dtoanVuTvqtDnghi !== null) {
                    if (item.dtoanVuTvqtDnghi < 0) {
                        Number(this.dToanVuGiam += Number(item?.dtoanVuTvqtDnghi));
                    } else {
                        Number(this.dToanVuTang += Number(item?.dtoanVuTvqtDnghi));
                    }
                }
            }
        })
    };

    // changeModel(id: string): void {
    //     this.editCache[id].data.tdiemBcaoChiPhiTaiCuaKho = Operator.mul(this.editCache[id].data.tdiemBcaoLuong, this.editCache[id].data.dmucChiPhiTaiCuaKho);
    //     this.editCache[id].data.tdiemBcaoChiPhiTongCong = Operator.sum([this.editCache[id].data.tdiemBcaoChiPhiTaiCuaKho, this.editCache[id].data.tdiemBcaoChiPhiNgoaiCuaKho]);
    //     this.editCache[id].data.dkienThienChiPhiTaiCuaKho = Operator.mul(this.editCache[id].data.dmucChiPhiTaiCuaKho, this.editCache[id].data.dkienThienLuong);
    //     this.editCache[id].data.dkienThienChiPhiNgoaiCuaKho = Operator.mul(this.editCache[id].data.binhQuanChiPhiNgoaiCuaKho, this.editCache[id].data.dkienThienLuong);
    //     this.editCache[id].data.dkienThienChiPhiTongCong = Operator.sum([this.editCache[id].data.dkienThienChiPhiTaiCuaKho, this.editCache[id].data.dkienThienChiPhiNgoaiCuaKho]);
    //     this.editCache[id].data.ncauDtoan = Operator.sum([this.editCache[id].data.tdiemBcaoChiPhiTongCong, this.editCache[id].data.dkienThienChiPhiTongCong]);
    //     this.editCache[id].data.dtoanDnghiDchinh = Operator.sum([this.editCache[id].data.ncauDtoan, - this.editCache[id].data.dtoanLkeDaGiao]);
    //     this.editCache[id].data.chenhLech = Operator.sum([this.editCache[id].data.dtoanVuTvqtDnghi, - this.editCache[id].data.dtoanDnghiDchinh]);

    // };

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
    };

    checkAdd(stt: string) {

        if (
            stt == "0.1" ||
            stt == "0.2"
        ) {
            return true;
        }
        return false;
    }



    handlSelectGoods(data: any) {
        const obj = {
            stt: data.stt,
        }

        const modalTuChoi = this.modal.create({
            nzTitle: 'Danh sách hàng hóa',
            nzContent: DialogAddVatTuComponent,
            nzBodyStyle: { overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' },
            nzMaskClosable: false,
            nzClosable: false,
            nzWidth: '900px',
            nzFooter: null,
            nzComponentParams: {
                obj: obj
            },
        });
        modalTuChoi.afterClose.subscribe(async (res) => {
            if (res) {
                let parentItem: ItemData = this.lstCtietBcao.find(e => e.dmucHang == res.ma && Table.preIndex(e.stt) == data.stt);
                //them phan tu cha neu chua co
                if (!parentItem) {
                    parentItem = new ItemData({

                        id: uuid.v4() + 'FE',
                        dmucHang: res.ma,
                        level: data.level + 1,
                        tenHang: res.ten,
                        donViTinh: res.maDviTinh,
                    })
                    this.lstCtietBcao = Table.addChild(data.id, parentItem, this.lstCtietBcao);
                    const item: ItemData = new ItemData({
                        id: uuid.v4() + 'FE',
                        dmucHang: res.ma,
                        // tenHang: res.ten,
                        level: parentItem.level + 1,
                        // maDviTinh: res.maDviTinh,
                    })
                    this.lstCtietBcao = Table.addChild(parentItem.id, item, this.lstCtietBcao);
                    // }
                } else {
                    const item: ItemData = new ItemData({
                        id: uuid.v4() + 'FE',
                        dmucHang: res.ma,
                        // tenHang: res.ten,
                        level: parentItem.level + 1,
                        // maDviTinh: res.maDviTinh,
                    })
                    this.lstCtietBcao = Table.addChild(parentItem.id, item, this.lstCtietBcao);
                }

                const stt = this.lstCtietBcao.find(e => e.id == parentItem.id).stt;

                console.log(this.lstCtietBcao);


                // await this.getDinhMuc();
                // this.lstCtietBcao.forEach(item => {
                //     if (!item.tenDanhMuc) {
                //         const dinhMuc = this.dsDinhMuc.find(e => e.cloaiVthh == item.maDanhMuc);
                //         item.tenDanhMuc = dinhMuc?.tenDinhMuc;
                //         item.dmucTaiKho = dinhMuc?.tongDmuc;
                //         item.dviTinh = dinhMuc?.donViTinh;
                //         item.ttienTaiKho = Operator.mul(item.dmucTaiKho, item.sluongTaiKho);
                //     }
                // })

                // if (this.dataInfo.isSynthetic) {
                this.lstCtietBcao.forEach(item => {
                    if (item.level == 2) {
                        const dinhMuc = this.dsDinhMuc.find(e => e.cloaiVthh == item.dmucHang);
                        item.dmucChiPhiTaiCuaKho = dinhMuc?.tongDmuc;
                    }
                    // item.changeModel();
                })
                // this.sum1()
                // }
                this.sum(stt + '.1');
                this.updateEditCache();
            }

        });
    };

    // selectGoods() {
    //     const modalTuChoi = this.modal.create({
    //         nzTitle: 'Danh sách hàng hóa',
    //         nzContent: DialogDanhSachVatTuHangHoaComponent,
    //         nzBodyStyle: { overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' },
    //         nzMaskClosable: false,
    //         nzClosable: false,
    //         nzWidth: '900px',
    //         nzFooter: null,
    //         nzComponentParams: {},
    //     });
    //     modalTuChoi.afterClose.subscribe(async (data) => {
    //         if (data) {
    //             const dm = this.dsDinhMuc.find(e => e.cloaiVthh == data.ma);
    //             if (this.lstCtietBcao.findIndex(e => e.dmucHang == data.ma) == -1) {
    //                 let stt: any;
    //                 const index = this.lstCtietBcao.findIndex(e => e.dmucHang == '0.2');
    //                 if (data.ma.startsWith('02')) {
    //                     stt = '0.2.' + (this.lstCtietBcao.length - index).toString();
    //                     //them vat tu moi vao bang
    //                     this.lstCtietBcao.push(new ItemData({
    //                         id: uuid.v4() + 'FE',
    //                         stt: stt,
    //                         dmucHang: data.ma,
    //                         tenHang: data.ten,
    //                         donViTinh: dm?.donViTinh,
    //                         dmucChiPhiTaiCuaKho: dm?.tongDmuc,
    //                         level: 1,
    //                     }))
    //                     this.lstCtietBcao.forEach(e => {
    //                         if (e.stt.startsWith("0.2.")) {
    //                             this.lstCtietBcao[index].clear();
    //                         }
    //                     })
    //                     this.getTotal()
    //                     this.updateEditCache();
    //                 } else {
    //                     stt = '0.1.' + index.toString();
    //                     this.lstCtietBcao.splice(index, 0, new ItemData({
    //                         id: uuid.v4() + 'FE',
    //                         stt: stt,
    //                         dmucHang: data.ma,
    //                         tenHang: data.ten,
    //                         donViTinh: dm?.donViTinh,
    //                         dmucChiPhiTaiCuaKho: dm?.tongDmuc,
    //                         level: 1,
    //                     }))
    //                     const index2 = this.lstCtietBcao.findIndex(e => e.dmucHang == '0.1');
    //                     this.lstCtietBcao.forEach(e => {
    //                         if (e.stt.startsWith("0.1.")) {
    //                             this.lstCtietBcao[index2].clear();
    //                         }
    //                     })
    //                     this.getTotal()
    //                     this.updateEditCache();
    //                 }

    //             }
    //         }
    //     });
    // }

    getChiMuc(str: string): string {
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
                return "-";
            default:
                return null;
        }
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
            { t: 0, b: 2, l: 0, r: 24, val: null },
            { t: 0, b: 2, l: 0, r: 0, val: 'STT' },
            { t: 0, b: 2, l: 1, r: 1, val: 'Danh mục hàng' },
            { t: 0, b: 2, l: 2, r: 2, val: 'Đơn vị tính' },
            { t: 0, b: 0, l: 3, r: 5, val: 'Kế hoạch được giao' },
            { t: 0, b: 2, l: 6, r: 6, val: 'Định mức (chi phí hàng tại cửa kho)' },
            { t: 0, b: 2, l: 7, r: 7, val: 'Bình quân (chi phí hàng ngoài cửa kho)' },
            { t: 0, b: 0, l: 8, r: 12, val: 'Đơn vị đã thực hiện đến thời điểm báo cáo )' },
            { t: 0, b: 0, l: 13, r: 16, val: 'Dự kiến thực hiện từ thời điểm báo cáo đến cuối năm' },
            { t: 0, b: 2, l: 17, r: 17, val: 'Nhu cầu dự toán năm' + this.namBcao },
            { t: 0, b: 2, l: 18, r: 18, val: 'Dự toán lũy kế đã giao' },
            { t: 0, b: 2, l: 19, r: 19, val: 'Dự toán đề nghị điều chỉnh (+ tăng) (- giảm)' },
            { t: 0, b: 2, l: 20, r: 20, val: 'Dự toán Vụ TVQT đề nghị (+ tăng) (- giảm)' },
            { t: 0, b: 2, l: 21, r: 21, val: 'Kinh phí thiếu những năm trước' },
            { t: 0, b: 2, l: 22, r: 22, val: 'Ghi chú' },
            { t: 0, b: 2, l: 23, r: 23, val: 'Dự toán chênh lệch giữa Vụ TVQT điều chỉnh và đơn vị đề nghị ' },
            { t: 0, b: 2, l: 24, r: 24, val: 'Ý kiến của đơn vị cấp trên' },

            { t: 1, b: 2, l: 3, r: 3, val: 'Địa phương nhận' },
            { t: 1, b: 2, l: 4, r: 4, val: 'QĐ giao nhiệm vụ của' + this.dataInfo.tenDvi },
            { t: 1, b: 2, l: 5, r: 5, val: 'Lượng' },

            { t: 1, b: 2, l: 8, r: 8, val: 'Lượng' },
            { t: 1, b: 2, l: 9, r: 9, val: 'Chi phí tại cửa kho' },
            { t: 1, b: 2, l: 10, r: 10, val: 'Chi phí ngoài cửa kho' },
            { t: 1, b: 2, l: 11, r: 11, val: 'Tổng cộng' },
            { t: 1, b: 2, l: 12, r: 12, val: 'Căn cứ kèm theo' },
            { t: 1, b: 2, l: 13, r: 13, val: 'Lượng' },
            { t: 1, b: 2, l: 14, r: 14, val: 'Chi phí tại cửa kho' },
            { t: 1, b: 2, l: 15, r: 15, val: 'Chi phí ngoài cửa kho' },
            { t: 1, b: 2, l: 16, r: 16, val: 'Tổng cộng' },
        ]
        const fieldOrder = [
            'stt',
            'tenHang',
            'donViTinh',
            'khoachDpNhan',
            'khoachQdGiaoNvu',
            'khoachLuong',
            'dmucChiPhiTaiCuaKho',
            'binhQuanChiPhiNgoaiCuaKho',
            'tdiemBcaoLuong',
            'tdiemBcaoChiPhiTaiCuaKho',
            'tdiemBcaoChiPhiNgoaiCuaKho',
            'tdiemBcaoChiPhiTongCong',
            'tdiemBcaoCcu',
            'dkienThienLuong',
            'dkienThienChiPhiTaiCuaKho',
            'dkienThienChiPhiNgoaiCuaKho',
            'dkienThienChiPhiTongCong',
            'ncauDtoan',
            'dtoanLkeDaGiao',
            'dtoanDnghiDchinh',
            'dtoanVuTvqtDnghi',
            'kphiThieuNamTruoc',
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
        XLSX.writeFile(workbook, this.dataInfo.maBcao + '_Phu_luc_II.xlsx');
    }



}


