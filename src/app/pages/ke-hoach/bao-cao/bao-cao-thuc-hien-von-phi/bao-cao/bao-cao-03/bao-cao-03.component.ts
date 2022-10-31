import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as fileSaver from 'file-saver';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogLuaChonThemDonViComponent } from 'src/app/components/dialog/dialog-lua-chon-them-don-vi/dialog-lua-chon-them-don-vi.component';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { BaoCaoThucHienVonPhiService } from 'src/app/services/quan-ly-von-phi/baoCaoThucHienVonPhi.service';
import { displayNumber, DON_VI_TIEN, exchangeMoney, MONEY_LIMIT, mulNumber, NOT_OK, OK, sumNumber, Utils } from "src/app/Utility/utils";
import * as uuid from "uuid";

export class ItemData {
    id: string;
    header: string;
    stt: string;
    checked: boolean;
    level: number;
    maVtu: number;
    maVtuCha: number;
    bcaoCtietId: string;

    maDviTinh: string;
    soLuongKhoach: number;
    soLuongTte: number;
    dgGiaKhoach: number;
    dgGiaBanTthieu: number;
    dgGiaBanTte: number;
    ttGiaHtoan: number;
    ttGiaBanTte: number;
    ttClechGiaTteVaGiaHtoan: number;
    ghiChu: string;
}

export class Details {
    data: ItemData[] = [];
    lstVtu: any[] = [];
}

@Component({
    selector: 'app-bao-cao-03',
    templateUrl: './bao-cao-03.component.html',
    styleUrls: ['../bao-cao.component.scss']
})
export class BaoCao03Component implements OnInit {
    @Input() data;
    @Output() dataChange = new EventEmitter();
    //danh muc
    donViTiens: any[] = DON_VI_TIEN;
    listVattu: any[] = [];
    lstVatTuFull = [];
    idPhuLuc = [0, 1, 2];
    //nhóm biến biểu mẫu 03
    lstCtietBcao: Details[] = [new Details(), new Details(), new Details()];
    editCache: { [key: string]: { edit: boolean; data: ItemData } } = {};

    //thong tin chung
    id: any;
    idBaoCao: string;        //id bao cao to
    thuyetMinh: string;
    maDviTien: string;
    tuNgay: any;
    denNgay: any;
    listIdDelete = "";
    trangThaiPhuLuc = '1';

    //trang thai cac nut
    status = false;
    statusBtnFinish: boolean;
    statusBtnOk: boolean;
    statusBtnExport: boolean;
    allChecked = false;
    editMoneyUnit = false;
    isDataAvailable = false;

    total: ItemData[] = [new ItemData(), new ItemData(), new ItemData()];

    constructor(
        private spinner: NgxSpinnerService,
        private baoCaoThucHienVonPhiService: BaoCaoThucHienVonPhiService,
        private danhMucService: DanhMucHDVService,
        private notification: NzNotificationService,
        private modal: NzModalService,
        private datePipe: DatePipe,
    ) {
    }

    async ngOnInit() {
        this.initialization().then(() => {
            this.isDataAvailable = true;
        })
    }

    async initialization() {
        this.spinner.show();
        //lấy danh sách vật tư
        await this.danhMucService.dMVatTu().toPromise().then(res => {
            if (res.statusCode == 0) {
                this.listVattu = res.data;
            } else {
                this.notification.error(MESSAGE.ERROR, res?.msg);
            }
        }, err => {
            this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        })
        this.addListVatTu(this.listVattu);
        //thong tin chung bao cao
        this.id = this.data?.id;
        this.maDviTien = this.data?.maDviTien ? this.data.maDviTien : '1';
        this.thuyetMinh = this.data?.thuyetMinh;
        this.status = this.data?.status;
        this.statusBtnFinish = this.data?.statusBtnFinish;
        this.statusBtnExport = this.data?.statusBtnExport;
        if (this.status) {
            this.tuNgay = this.datePipe.transform(this.data?.tuNgay, Utils.FORMAT_DATE_STR);
            this.denNgay = this.datePipe.transform(this.data?.denNgay, Utils.FORMAT_DATE_STR);
        } else {
            this.tuNgay = this.data?.tuNgay;
            this.denNgay = this.data?.denNgay;
        }
        this.idBaoCao = this.data?.idBaoCao;
        this.trangThaiPhuLuc = this.data?.trangThai;
        // 03
        this.data?.lstCtietBcaos.forEach(item => {
            const id = parseInt(item.header, 10) - 31;
            this.lstCtietBcao[id].data.push({
                ...item,
            })
        })
        this.idPhuLuc.forEach(id => {
            this.lstCtietBcao[id].lstVtu = this.lstVatTuFull;
            this.lstCtietBcao[id].data.forEach(item => {
                if (item.maVtuCha == 0) {
                    this.lstCtietBcao[id].lstVtu = this.lstCtietBcao[id].lstVtu.filter(e => e.id != item.maVtu);
                }
            })
            this.sortAppendix(id);
            this.changeModel(id);
            this.updateEditCache(id);
        })
        this.getStatusButton();
        this.spinner.hide();
    }

    getStatusButton() {
        if (this.data?.statusBtnOk && (this.trangThaiPhuLuc == "2" || this.trangThaiPhuLuc == "5")) {
            this.statusBtnOk = false;
        } else {
            this.statusBtnOk = true;
        }
    }

    addListVatTu(listVattu) {
        listVattu.forEach(data => {
            switch (data.ma) {
                case '04':
                    data.child.forEach(item => {
                        this.lstVatTuFull.push({
                            ...item,
                            tenDm: item.ten,
                        })
                    })
                    break;
                case '01':
                    data.child.forEach(item => {
                        this.lstVatTuFull.push({
                            ...item,
                            tenDm: item.ten,
                        })
                    })
                    break;
                case '02':
                    data.child.forEach(item => {
                        item.child.forEach(e => {
                            this.lstVatTuFull.push({
                                ...e,
                                tenDm: e.ten,
                            })
                        })
                    })
                    break;
                default:
                    break;
            }
        })
    }

    getIndex(id: string, idAppendix: number) {
        const data = this.lstCtietBcao[idAppendix].data.find(e => e.id == id);
        if (data.maVtuCha != 0) {
            return null;
        }
        let nho = 0;
        for (let i = 0; i < this.lstCtietBcao[idAppendix].data.length; i++) {
            if (this.lstCtietBcao[idAppendix].data[i].maVtuCha == 0) {
                nho += 1;
            }
            if (this.lstCtietBcao[idAppendix].data[i].maVtu == data.maVtu) {
                return nho;
            }
        }
    }

    sortAppendix(idAppendix: number) {
        this.lstCtietBcao[idAppendix].data.sort((item1, item2) => {
            if (item1.maVtu > item2.maVtu) {
                return 1;
            }
            if (item1.maVtu < item2.maVtu) {
                return -1;
            }
            if (item1.maVtuCha > item2.maVtuCha) {
                return 1;
            } else {
                return -1;
            }
        })
    }

    updateEditCache(idAppendix: number): void {
        this.lstCtietBcao[idAppendix].data.forEach(item => {
            this.editCache[item.id] = {
                edit: false,
                data: { ...item }
            };
        });
    }

    // action print
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
    }

    addLine(id: string, idAppendix: number) {
        const data = this.lstCtietBcao[idAppendix].data.find(e => e.id == id);

        let index = -1;   // vi tri cuoi cung co ma vat tu bang voi data.maVtu
        const lstDviChon = [];
        if (data) {
            lstDviChon.push(this.lstVatTuFull.find(e => e.id == data.maVtu));
            for (let i = this.lstCtietBcao[idAppendix].data.length - 1; i > -1; i--) {
                if (this.lstCtietBcao[idAppendix].data[i].maVtu == data.maVtu) {
                    index = i;
                    break;
                }
            }
        }
        this.lstCtietBcao[idAppendix].lstVtu.forEach(item => {
            lstDviChon.push(item);
        })

        const obj = {
            danhSachDonVi: lstDviChon,
            multi: false,
        }
        const modalIn = this.modal.create({
            nzTitle: 'Danh sách vật tư',
            nzContent: DialogLuaChonThemDonViComponent,
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
                const item = {
                    ...new ItemData(),
                    bcaoCtietId: this.id,
                    id: uuid.v4() + 'FE',
                    header: (idAppendix + 31).toString(),
                    checked: false,
                    maVtu: res[0].id,
                    maVtuCha: index == -1 ? 0 : (res[0].id != data?.maVtu ? 0 : this.lstCtietBcao[idAppendix].data[index].maVtuCha + 1),
                    maDviTinh: res[0].maDviTinh,
                }
                this.lstCtietBcao[idAppendix].data.splice(index + 1, 0, item);
                this.editCache[item.id] = {
                    edit: false,
                    data: { ...item }
                };
                this.lstCtietBcao[idAppendix].lstVtu = this.lstCtietBcao[idAppendix].lstVtu.filter(e => e.id != item.maVtu);
            }
        });
    }

    //xóa dòng
    deleteLine(id: string, idAppendix: number) {
        const data: ItemData = this.lstCtietBcao[idAppendix].data.find(e => e.id == id); // vi tri hien tai
        if (data.maVtuCha == 0) {
            this.lstCtietBcao[idAppendix].data = this.lstCtietBcao[idAppendix].data.filter(e => e.maVtu != data.maVtu);
            this.lstCtietBcao[idAppendix].lstVtu.push(this.lstVatTuFull.find(e => e.id == data.maVtu));
        } else {
            this.lstCtietBcao[idAppendix].data = this.lstCtietBcao[idAppendix].data.filter(e => e.id != id);
            this.setAverageValue(data.maVtu, idAppendix);
        }
        this.changeModel(idAppendix);
        this.updateEditCache(idAppendix);
    }

    // start edit
    startEdit(id: string): void {
        this.editCache[id].edit = true;
    }

    // huy thay doi
    cancelEdit(id: string, idAppendix: number): void {
        const data = this.lstCtietBcao[idAppendix].data.find(e => e.id == id);
        this.editCache[id] = {
            data: { ...data },
            edit: false
        };
    }

    // luu thay doi
    saveEdit(id: string, idAppendix: number) {
        this.editCache[id].data.checked = this.lstCtietBcao[idAppendix].data.find(item => item.id == id).checked; // set checked editCache = checked danhSachChiTietbaoCao
        const index = this.lstCtietBcao[idAppendix].data.findIndex(item => item.id == id); // lay vi tri hang minh sua
        Object.assign(this.lstCtietBcao[idAppendix].data[index], this.editCache[id].data); // set lai data cua danhSachChiTietbaoCao[index] = this.editCache[id].data
        this.editCache[id].edit = false; // CHUYEN VE DANG TEXT
        //tinh toan lai trung binh cho vat tu muc cao nhat
        const maVtu = this.lstCtietBcao[idAppendix].data[index].maVtu;
        this.setAverageValue(maVtu, idAppendix);
        this.changeModel(idAppendix);
    }

    //tinh toan trung binh cho vat tu co muc cao nhat
    setAverageValue(maVtu: number, idAppendix: number) {
        let slKeHoach = 0;
        let slThucTe = 0;
        let ttHachToan = 0;
        let ttThucTe = 0;
        this.lstCtietBcao[idAppendix].data.forEach(item => {
            if (item.maVtuCha != 0 && item.maVtu == maVtu) {
                slKeHoach = sumNumber([slKeHoach, item.soLuongKhoach]);
                slThucTe = sumNumber([slThucTe, item.soLuongTte]);
                ttHachToan = sumNumber([ttHachToan, item.ttGiaHtoan]);
                ttThucTe = sumNumber([ttThucTe, item.ttGiaBanTte]);
            }
        })
        const ind = this.lstCtietBcao[idAppendix].data.findIndex(e => e.maVtu == maVtu && e.maVtuCha == 0);
        this.lstCtietBcao[idAppendix].data[ind].soLuongKhoach = slKeHoach;
        this.lstCtietBcao[idAppendix].data[ind].soLuongTte = slThucTe;
        this.lstCtietBcao[idAppendix].data[ind].ttGiaHtoan = ttHachToan;
        this.lstCtietBcao[idAppendix].data[ind].ttGiaBanTte = ttThucTe;
        this.lstCtietBcao[idAppendix].data[ind].ttClechGiaTteVaGiaHtoan = sumNumber([ttThucTe, -ttHachToan]);
    }

    updateChecked(id: string, idAppendix: number) {
        const data = this.lstCtietBcao[idAppendix].data.find(e => e.id == id);
        if (data.maVtuCha == 0) {
            this.lstCtietBcao[idAppendix].data.forEach(item => {
                if (item.maVtu == data.maVtu) {
                    item.checked = data.checked;
                }
            })
        } else {
            let check = true;
            this.lstCtietBcao[idAppendix].data.forEach(item => {
                if (item.maVtu == data.maVtu && item.maVtuCha != 0 && item.checked == false) {
                    check = false;
                }
            })
            const index = this.lstCtietBcao[idAppendix].data.findIndex(e => (e.maVtu == data.maVtu && e.maVtuCha == 0));
            this.lstCtietBcao[idAppendix].data[index].checked = check;
        }
    }

    deleteAllChecked() {
        this.idPhuLuc.forEach(id => {
            this.lstCtietBcao[id].data = this.lstCtietBcao[id].data.filter(e => e.checked == false);
            this.lstCtietBcao[id].data.forEach(item => {
                if (item.maVtuCha == 0) {
                    this.setAverageValue(item.maVtu, id);
                }
            })
            this.changeModel(id);
        });
    }

    //show popup tu choi dùng cho nut ok - not ok
    async pheDuyetChiTiet(mcn: string) {
        this.spinner.show();
        if (mcn == OK) {
            await this.pheDuyetBieuMau(mcn, null);
        } else if (mcn == NOT_OK) {
            const modalTuChoi = this.modal.create({
                nzTitle: 'Not OK',
                nzContent: DialogTuChoiComponent,
                nzMaskClosable: false,
                nzClosable: false,
                nzWidth: '900px',
                nzFooter: null,
                nzComponentParams: {},
            });
            modalTuChoi.afterClose.toPromise().then(async (text) => {
                if (text) {
                    await this.pheDuyetBieuMau(mcn, text);
                }
            });
        }
        this.spinner.hide();
    }

    //call api duyet bieu mau
    async pheDuyetBieuMau(trangThai: any, lyDo: string) {
        if (this.id) {
            const requestGroupButtons = {
                id: this.id,
                trangThai: trangThai,
                lyDoTuChoi: lyDo,
            };
            this.spinner.show();
            await this.baoCaoThucHienVonPhiService.approveBieuMau(requestGroupButtons).toPromise().then(async (data) => {
                if (data.statusCode == 0) {
                    this.trangThaiPhuLuc = trangThai;
                    this.getStatusButton();
                    this.dataChange.emit(data.data);
                    if (trangThai == '0') {
                        this.notification.success(MESSAGE.SUCCESS, MESSAGE.REJECT_SUCCESS);
                    } else {
                        this.notification.success(MESSAGE.SUCCESS, MESSAGE.APPROVE_SUCCESS);
                    }
                } else {
                    this.notification.error(MESSAGE.ERROR, data?.msg);
                }
            }, err => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
            });
            this.spinner.hide();
        } else {
            this.notification.warning(MESSAGE.WARNING, MESSAGE.MESSAGE_DELETE_WARNING)
        }
        this.spinner.hide();
    }

    async saveAppendix(maChucNang: string) {
        const lstCTietBaoCaoTemp: ItemData[] = [];
        this.idPhuLuc.forEach(id => {
            this.lstCtietBcao[id].data.forEach(item => {
                lstCTietBaoCaoTemp.push({
                    ...item,
                })
            })
        })
        //check khoang gia tien co qua lon ko
        let checkMoneyRange = true;
        lstCTietBaoCaoTemp.forEach(item => {
            if (item.ttGiaHtoan > MONEY_LIMIT || item.ttGiaBanTte > MONEY_LIMIT) {
                checkMoneyRange = false;
                return;
            }
        })

        if (!checkMoneyRange == true) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.MONEYRANGE);
            return;
        }

        const baoCaoChiTietTemp = JSON.parse(JSON.stringify(this.data));
        baoCaoChiTietTemp.lstCtietBcaos = JSON.parse(JSON.stringify(lstCTietBaoCaoTemp));
        baoCaoChiTietTemp.maDviTien = this.maDviTien;
        baoCaoChiTietTemp.thuyetMinh = this.thuyetMinh;
        baoCaoChiTietTemp.tuNgay = typeof this.tuNgay == 'string' ? new Date(this.tuNgay) : this.tuNgay;
        baoCaoChiTietTemp.denNgay = typeof this.denNgay == 'string' ? new Date(this.denNgay) : this.denNgay;

        if (this.datePipe.transform(baoCaoChiTietTemp.tuNgay, Utils.FORMAT_DATE_STR) > this.datePipe.transform(baoCaoChiTietTemp.denNgay, Utils.FORMAT_DATE_STR)) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.WRONG_DAY);
            return;
        }

        // validate nguoi thuc hien bao cao
        if (!baoCaoChiTietTemp.nguoiBcao) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.PERSONREPORT);
            return;
        }
        // validate bao cao
        if (baoCaoChiTietTemp.id?.length != 36) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.SAVEREPORT);
            return;
        }
        baoCaoChiTietTemp.trangThai = maChucNang;
        let checkSaveEdit;

        baoCaoChiTietTemp?.lstCtietBcaos.filter(data => {
            if (this.editCache[data.id].edit == true) {
                checkSaveEdit = false;
                return;
            }
            if (data.id?.length == 38) {
                data.id = null;
            }
        })

        if (checkSaveEdit == false) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTSAVE);
            return;
        }

        //call service cap nhat phu luc
        this.spinner.show();
        this.baoCaoThucHienVonPhiService.baoCaoCapNhatChiTiet(baoCaoChiTietTemp).toPromise().then(
            async data => {
                if (data.statusCode == 0) {
                    this.notification.success(MESSAGE.SUCCESS, MESSAGE.SUCCESS);
                    this.dataChange.emit(data.data);
                } else {
                    this.notification.error(MESSAGE.ERROR, data?.msg);
                    this.spinner.hide();
                }
            },
            err => {
                this.spinner.hide();
                this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
            },
        );
        this.spinner.hide();
    }

    //tinh tong
    changeModel03(id: any) {
        this.editCache[id].data.ttGiaHtoan = mulNumber(this.editCache[id].data.soLuongTte, this.editCache[id].data.dgGiaKhoach);
        this.editCache[id].data.ttGiaBanTte = mulNumber(this.editCache[id].data.soLuongTte, this.editCache[id].data.dgGiaBanTte);
        this.editCache[id].data.ttClechGiaTteVaGiaHtoan = sumNumber([this.editCache[id].data.ttGiaBanTte, -this.editCache[id].data.ttGiaHtoan]);
    }

    export() {
        const request = {
            bcaoCtietId: this.id,
            bcaoId: this.idBaoCao,
            dviTien: this.maDviTien,
        }
        this.baoCaoThucHienVonPhiService.exportBaoCao(request).toPromise().then(
            (data) => {
                fileSaver.saveAs(data, '03BCX.xlsx');
            },
            (err) => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
            },
        );
    }


    async changeModel(idAppendix: number) {
        this.total[idAppendix] = new ItemData();
        this.lstCtietBcao[idAppendix].data.forEach(item => {
            if (item.maVtuCha == 0) {
                this.total[idAppendix].soLuongKhoach = sumNumber([this.total[idAppendix].soLuongKhoach, item.soLuongKhoach]);
                this.total[idAppendix].soLuongTte = sumNumber([this.total[idAppendix].soLuongTte, item.soLuongTte]);
                this.total[idAppendix].ttGiaHtoan = sumNumber([this.total[idAppendix].ttGiaHtoan, item.ttGiaHtoan]);
                this.total[idAppendix].ttGiaBanTte = sumNumber([this.total[idAppendix].ttGiaBanTte, item.ttGiaBanTte]);
            }
        })
        this.total[idAppendix].ttClechGiaTteVaGiaHtoan = sumNumber([this.total[idAppendix].ttGiaBanTte, -this.total[idAppendix].ttGiaHtoan]);
    }

    displayNumber(num: number): string {
        return displayNumber(num);
    }

    displayValue(num: number): string {
        num = exchangeMoney(num, '1', this.maDviTien);
        return displayNumber(num);
    }

    getMoneyUnit() {
        return this.donViTiens.find(e => e.id == this.maDviTien)?.tenDm;
    }
}
