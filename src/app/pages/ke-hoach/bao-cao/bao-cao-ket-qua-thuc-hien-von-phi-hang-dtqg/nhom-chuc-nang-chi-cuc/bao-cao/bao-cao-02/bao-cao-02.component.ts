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
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { displayNumber, divNumber, DON_VI_TIEN, exchangeMoney, MONEY_LIMIT, mulNumber, NOT_OK, OK, sumNumber, Utils } from "src/app/Utility/utils";
import * as uuid from "uuid";

export class ItemData {
    bcaoCtietId: string;
    id: string;
    header: string;
    stt: string;
    checked: boolean;
    level: number;

    maVtu: number;
    maVtuCha: number;
    maDviTinh: string;
    soQd: string;
    ghiChu: string;
    khSoLuong: number;
    khGiaMuaTd: number;
    khTtien: number;
    thSoLuong: number;
    thGiaMuaTd: number;
    thTtien: number;
}

export class Details {
    data: ItemData[] = [];
    lstVtu: any[] = [];
}

@Component({
    selector: 'app-bao-cao-02',
    templateUrl: './bao-cao-02.component.html',
    styleUrls: ['../bao-cao.component.scss']
})
export class BaoCao02Component implements OnInit {
    @Input() data;
    @Output() dataChange = new EventEmitter();
    //danh muc
    donViTiens: any[] = DON_VI_TIEN;
    listVattu: any[] = [];                  //lay ra danh sach vat tu tu teca
    lstVatTuFull: any = [];                 //lay danh sach vat tu chi gom lop 2 cua thoc gao va lop 3 cua vat tu
    idPhuLuc = [0, 1];
    //nhóm biến biểu mẫu 02
    lstCtietBcao: Details[] = [new Details(), new Details()];
    editCache: { [key: string]: { edit: boolean; data: ItemData } } = {};
    //thong tin chung
    id: string;
    thuyetMinh: string;
    maDviTien: string;
    tuNgay: any;
    denNgay: any;
    listIdDelete = "";
    trangThaiPhuLuc = '1';
    idBaoCao: string;        //id bao cao to
    //trang thai cac nut
    status = false;
    statusBtnFinish: boolean;
    statusBtnOk: boolean;
    statusBtnExport: boolean;
    allChecked = false;
    editMoneyUnit = false;

    total: ItemData[] = [new ItemData(), new ItemData()];
    dviMua = new ItemData();
    tongCucMua = new ItemData();
    tongDvTc = 0;

    constructor(
        private spinner: NgxSpinnerService,
        private quanLyVonPhiService: QuanLyVonPhiService,
        private danhMucService: DanhMucHDVService,
        private notification: NzNotificationService,
        private modal: NzModalService,
        private datePipe: DatePipe,
    ) {
    }

    async ngOnInit() {
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
        ///////////////////////////////////////////////////////////////
        this.id = this.data?.id;
        this.maDviTien = this.data?.maDviTien ? this.data?.maDviTien : '1';
        this.thuyetMinh = this.data?.thuyetMinh;
        this.status = this.data?.status;
        this.statusBtnFinish = this.data?.statusBtnFinish;
        this.statusBtnOk = this.data?.statusBtnOk;
        this.statusBtnExport = this.data?.statusBtnExport;
        this.tuNgay = this.data?.tuNgay;
        this.denNgay = this.data?.denNgay;
        this.idBaoCao = this.data?.idBaoCao
        //tinh toan theo don vi tien va dua vao bieu mau
        this.data?.lstCtietBcaos.forEach(item => {
            const id = parseInt(item.header, 10) - 21;
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
        this.spinner.hide();
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
                    header: idAppendix == 0 ? '21' : '22',
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
        let sl = 0;
        let thanhTien = 0;
        this.lstCtietBcao[idAppendix].data.forEach(item => {
            if (item.maVtuCha != 0 && item.maVtu == maVtu) {
                sl = sumNumber([sl, item.thSoLuong]);
                thanhTien = sumNumber([thanhTien, item.thTtien]);
            }
        })
        const ind = this.lstCtietBcao[idAppendix].data.findIndex(e => e.maVtu == maVtu && e.maVtuCha == 0);
        this.lstCtietBcao[idAppendix].data[ind].thSoLuong = sl;
        this.lstCtietBcao[idAppendix].data[ind].thGiaMuaTd = Math.round(divNumber(thanhTien, sl));
        this.lstCtietBcao[idAppendix].data[ind].thTtien = thanhTien;
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
            await this.quanLyVonPhiService.approveBieuMau(requestGroupButtons).toPromise().then(async (data) => {
                if (data.statusCode == 0) {
                    this.trangThaiPhuLuc = trangThai;
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
        let checkMoneyRange = true;

        lstCTietBaoCaoTemp.forEach(item => {
            if (item.khGiaMuaTd > MONEY_LIMIT || item.khTtien > MONEY_LIMIT ||
                item.thGiaMuaTd > MONEY_LIMIT || item.thTtien > MONEY_LIMIT) {
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

        if (!baoCaoChiTietTemp.maDviTien) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
            return;
        }

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
        this.quanLyVonPhiService.baoCaoCapNhatChiTiet(baoCaoChiTietTemp).toPromise().then(
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

    //tinh toan tong so
    changeModel02(id: string) {
        this.editCache[id].data.khTtien = mulNumber(this.editCache[id].data.khSoLuong, this.editCache[id].data.khGiaMuaTd);
        this.editCache[id].data.thTtien = mulNumber(this.editCache[id].data.thSoLuong, this.editCache[id].data.thGiaMuaTd);

    }

    // tinh len tren nhung hang fix cung I,II
    async changeModel(idAppendix: number) {
        this.total[idAppendix] = new ItemData();
        this.lstCtietBcao[idAppendix].data.forEach(item => {
            if (item.maVtuCha == 0) {
                this.total[idAppendix].thTtien = sumNumber([this.total[idAppendix].thTtien, item.thTtien]);
            }
        })
        this.tongDvTc = sumNumber([this.total[0].thTtien, this.total[1].thTtien]);
    }

    export() {
        this.quanLyVonPhiService.exportBaoCao(this.id, this.idBaoCao).toPromise().then(
            (data) => {
                fileSaver.saveAs(data, '02/BCN.xlsx');
            },
            (err) => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
            },
        );
    }

    displayValue(num: number): string {
        num = exchangeMoney(num, '1', this.maDviTien);
        return displayNumber(num);
    }

    getMoneyUnit() {
        return this.donViTiens.find(e => e.id == this.maDviTien)?.tenDm;
    }
}

