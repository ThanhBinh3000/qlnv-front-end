import { DatePipe, Location } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogLuaChonThemDonViComponent } from 'src/app/components/dialog/dialog-lua-chon-them-don-vi/dialog-lua-chon-them-don-vi.component';
import { DialogThemKhoanMucComponent } from 'src/app/components/dialog/dialog-them-khoan-muc/dialog-them-khoan-muc.component';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import * as uuid from "uuid";
import { DanhMucHDVService } from '../../../../../../services/danhMucHDV.service';
import { divMoney, DON_VI_TIEN, LA_MA, MONEY_LIMIT, mulMoney } from "../../../../../../Utility/utils";
import { LISTBIEUMAUDOT, NOI_DUNG } from '../bao-cao.constant';
import { LINH_VUC } from './bao-cao-05.constant';

export class ItemData {
    id: any;
    stt: string;
    level: number;
    maLvucNdChi: number;
    thNamHienHanhN1: number;
    ncauNamDtoanN: number;
    ncauNamN1: number;
    ncauNamN2: number;
    checked!: boolean;
}

export class ItemDataMau0405 {
    id = null;
    header = null;
    stt = '0';
    checked = false;
    level = 0;

    maNdungChi = null;
    trongDotTcong = 0;
    trongDotThoc = 0;
    trongDotGao = 0;
    luyKeTcong = 0;
    luyKeThoc = 0;
    luyKeGao = 0;
    listCtiet: vatTu[] = [];
    ghiChu = null;
    maNdungChiCha = null;
}
export class vatTu {
    id: any;
    maVtu: any;
    loaiMatHang: any;
    sl: any;
}


@Component({
    selector: 'app-bao-cao-05',
    templateUrl: './bao-cao-05.component.html',
    styleUrls: ['../bao-cao.component.scss']
})
export class BaoCao05Component implements OnInit {
    @Input() data;
    @Output() dataChange = new EventEmitter();
    //danh muc
    donVis: any = [];
    linhVucs: any[] = LINH_VUC;
    lstCtietBcao: ItemData[] = [];
    donViTiens: any[] = DON_VI_TIEN;
    soLaMa: any[] = LA_MA;
    listColTemp: any[] = [];
    listDonvitinh: any[] = [];
    listVattu: any[] = [];
    lstVatTuFull = [];
    //nhóm biến biểu mẫu 05
    lstCtietBcao5I1: ItemDataMau0405[] = [];
    lstCtietBcao5I2: ItemDataMau0405[] = [];
    lstCtietBcao5II11: ItemDataMau0405[] = [];
    lstCtietBcao5II12: ItemDataMau0405[] = [];
    lstCtietBcao5II2: ItemDataMau0405[] = [];
    lstCtietBcao5III1: ItemDataMau0405[] = [];
    lstCtietBcao5III2: ItemDataMau0405[] = [];
    lstCtietBcao5B: ItemDataMau0405[] = [];
    noiDungChisBC05 = NOI_DUNG;

    //thong tin chung
    id: any;
    allChecked1: any;
    lstCTietBaoCaoTemp: any[] = [];

    namHienHanh: number;
    maBieuMau: string;
    thuyetMinh: string;
    maDviTien: string = '1';
    tuNgay: any;
    denNgay: any;
    listIdDelete: string = "";
    trangThaiPhuLuc: string = '1';
    initItem: ItemData = {
        id: null,
        stt: "0",
        level: 0,
        maLvucNdChi: 0,
        thNamHienHanhN1: 0,
        ncauNamDtoanN: 0,
        ncauNamN1: 0,
        ncauNamN2: 0,
        checked: false,
    };
    total: ItemData = {
        id: null,
        stt: "0",
        level: 0,
        maLvucNdChi: 0,
        thNamHienHanhN1: 0,
        ncauNamDtoanN: 0,
        ncauNamN1: 0,
        ncauNamN2: 0,
        checked: false,
    };
    //trang thai cac nut
    status: boolean = false;
    statusBtnFinish: boolean;
    statusBtnOk: boolean;

    allChecked = false;
    editCache: { [key: string]: { edit: boolean; data: ItemDataMau0405 } } = {};

    constructor(
        private spinner: NgxSpinnerService,
        private quanLyVonPhiService: QuanLyVonPhiService,
        private danhMucService: DanhMucHDVService,
        private notification: NzNotificationService,
        private modal: NzModalService,
    ) {
    }

    async ngOnInit() {
        this.id = this.data?.id;
        this.maDviTien = this.data?.maDviTien;
        this.thuyetMinh = this.data?.thuyetMinh;
        this.trangThaiPhuLuc = this.data?.trangThai;
        this.status = this.data?.status;
        this.statusBtnFinish = this.data?.statusBtnFinish;
        this.data?.lstCtietBcaos.forEach(item => {
            this.lstCtietBcao.push({
                ...item,
                // thNamHienHanhN1: divMoney(item.thNamHienHanhN1, this.maDviTien),
                // ncauNamDtoanN: divMoney(item.ncauNamDtoanN, this.maDviTien),
                // ncauNamN1: divMoney(item.ncauNamN1, this.maDviTien),
                // ncauNamN2: divMoney(item.ncauNamN2, this.maDviTien),
                checked: false,
            })
        })
        // if (this.lstCtietBcao.length > 0) {
        //     if (!this.lstCtietBcao[0].stt) {
        //         this.sortWithoutIndex();
        //     } else {
        //         this.sortByIndex();
        //     }
        // }
        // //this.getTotal();
        // this.updateEditCache();

        //lay danh sach danh muc don vi
        await this.danhMucService.dMDonVi().toPromise().then(
            (data) => {
                if (data.statusCode == 0) {
                    this.donVis = data.data;
                } else {
                    this.notification.error(MESSAGE.ERROR, data?.msg);
                }
            },
            (err) => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
            }
        );
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
        //danh sách đơn vị tính (đơn vị đo lường )
        this.quanLyVonPhiService.dmDonvitinh().toPromise().then(
            (data) => {
                if (data.statusCode == 0) {
                    this.listDonvitinh = data.data?.content;

                } else {
                    this.notification.error(MESSAGE.ERROR, data?.msg);
                }
            },
            (err) => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
            },
        );
        this.getStatusButton();
        this.spinner.hide();
    }


    addListVatTu(listVattu) {
        listVattu.forEach(item => {
            this.lstVatTuFull.push(item);
            if (item.child) {
                this.addListVatTu(item.child);
            }
        });
    }

    getStatusButton() {
        if (this.data?.statusBtnOk && (this.trangThaiPhuLuc == "2" || this.trangThaiPhuLuc == "5")) {
            this.statusBtnOk = false;
        } else {
            this.statusBtnOk = true;
        }
    }

    // luu
    async save(trangThai: string) {
        let checkSaveEdit;
        if (!this.maDviTien) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTSAVE);
            return;
        }
        //check xem tat ca cac dong du lieu da luu chua?
        //chua luu thi bao loi, luu roi thi cho di
        this.lstCtietBcao.forEach(element => {
            if (this.editCache[element.id].edit === true) {
                checkSaveEdit = false
            }
        });
        if (checkSaveEdit == false) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTSAVE);
            return;
        }
        //tinh lai don vi tien va kiem tra gioi han cua chung
        let lstCtietBcaoTemp: any = [];
        let checkMoneyRange = true;
        this.lstCtietBcao.forEach(item => {
            let thNamHienHanhN1 = mulMoney(item.thNamHienHanhN1, this.maDviTien);
            let ncauNamDtoanN = mulMoney(item.ncauNamDtoanN, this.maDviTien);
            let ncauNamN1 = mulMoney(item.ncauNamN1, this.maDviTien);
            let ncauNamN2 = mulMoney(item.ncauNamN2, this.maDviTien);
            if (thNamHienHanhN1 > MONEY_LIMIT || ncauNamDtoanN > MONEY_LIMIT ||
                ncauNamN1 > MONEY_LIMIT || ncauNamN2 > MONEY_LIMIT) {
                checkMoneyRange = false;
                return;
            }
            lstCtietBcaoTemp.push({
                ...item,
                thNamHienHanhN1: thNamHienHanhN1,
                ncauNamDtoanN: ncauNamDtoanN,
                ncauNamN1: ncauNamN1,
                ncauNamN2: ncauNamN2,
            })
        })

        if (!checkMoneyRange == true) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.MONEYRANGE);
            return;
        }
        // replace nhung ban ghi dc them moi id thanh null
        lstCtietBcaoTemp.forEach(item => {
            if (item.id?.length == 38) {
                item.id = null;
            }
        })
        let request = {
            id: this.id,
            lstBcaos: lstCtietBcaoTemp,
            maBieuMau: this.maBieuMau,
            maDviTien: this.maDviTien,
            nguoiBcao: this.data?.nguoiBcao,
            lyDoTuChoi: this.data?.lyDoTuChoi,
            thuyetMinh: this.thuyetMinh,
            trangThai: trangThai,
        };
        this.quanLyVonPhiService.updateLapThamDinh(request).toPromise().then(
            async data => {
                if (data.statusCode == 0) {
                    this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
                    let obj = {
                        trangThai: '-1',
                        lyDoTuChoi: null,
                    };
                    this.dataChange.emit(obj);
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
        if (this.id) {
            const requestGroupButtons = {
                id: this.id,
                trangThai: mcn,
                lyDoTuChoi: lyDoTuChoi,
            };
            this.spinner.show();
            await this.quanLyVonPhiService.approveCtietThamDinh(requestGroupButtons).toPromise().then(async (data) => {
                if (data.statusCode == 0) {
                    this.trangThaiPhuLuc = mcn;
                    this.getStatusButton();
                    let obj = {
                        trangThai: mcn,
                        lyDoTuChoi: lyDoTuChoi,
                    }
                    this.dataChange.emit(obj);
                    if (mcn == '0') {
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



    // sum(stt: string) {
    //     stt = this.getHead(stt);
    //     while (stt != '0') {
    //         var index = this.lstCtietBcao.findIndex(e => e.stt == stt);
    //         let data = this.lstCtietBcao[index];
    //         this.lstCtietBcao[index] = {
    //             ...this.initItem,
    //             id: data.id,
    //             stt: data.stt,
    //             maLvucNdChi: data.maLvucNdChi,
    //             checked: data.checked,
    //             level: data.level,
    //         }
    //         this.lstCtietBcao.forEach(item => {
    //             if (this.getHead(item.stt) == stt) {
    //                 this.lstCtietBcao[index].thNamHienHanhN1 += item.thNamHienHanhN1;
    //                 this.lstCtietBcao[index].ncauNamDtoanN += item.ncauNamDtoanN;
    //                 this.lstCtietBcao[index].ncauNamN1 += item.ncauNamN1;
    //                 this.lstCtietBcao[index].ncauNamN2 += item.ncauNamN2;
    //             }
    //         })
    //         stt = this.getHead(stt);
    //     }
    //     this.getTotal();
    // }

    // getTotal() {
    //     this.total.thNamHienHanhN1 = 0;
    //     this.total.ncauNamDtoanN = 0;
    //     this.total.ncauNamN1 = 0;
    //     this.total.ncauNamN2 = 0;
    //     this.lstCtietBcao.forEach(item => {
    //         if (item.level == 0) {
    //             this.total.thNamHienHanhN1 += item.thNamHienHanhN1;
    //             this.total.ncauNamDtoanN += item.ncauNamDtoanN;
    //             this.total.ncauNamN1 += item.ncauNamN1;
    //             this.total.ncauNamN2 += item.ncauNamN2;
    //         }
    //     })
    // }

    // action print
    doPrint() {
        let WindowPrt = window.open(
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

    //hixhix///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // chuyển đổi stt đang được mã hóa thành dạng I, II, a, b, c, ...
    getChiMuc(str: string): string {
        str = str.substring(str.indexOf('.') + 1, str.length);
        var xau: string = "";
        let chiSo: any = str.split('.');
        var n: number = chiSo.length - 1;
        var k: number = parseInt(chiSo[n], 10);
        if (n == 0) {
            for (var i = 0; i < this.soLaMa.length; i++) {
                while (k >= this.soLaMa[i].gTri) {
                    xau += this.soLaMa[i].kyTu;
                    k -= this.soLaMa[i].gTri;
                }
            }
        };
        if (n == 1) {
            xau = chiSo[n];
        };
        if (n == 2) {
            xau = chiSo[n - 1].toString() + "." + chiSo[n].toString();
        };
        if (n == 3) {
            xau = String.fromCharCode(k + 96);
        }
        if (n == 4) {
            xau = "-";
        }
        return xau;
    }
    // lấy phần đầu của số thứ tự, dùng để xác định phần tử cha
    getHead(str: string): string {
        return str.substring(0, str.lastIndexOf('.'));
    }
    // lấy phần đuôi của stt
    getTail(str: string): number {
        return parseInt(str.substring(str.lastIndexOf('.') + 1, str.length), 10);
    }
    //tìm vị trí cần để thêm mới
    findVt(str: string, phuLuc): number {
        let hunghixhix = this.getBieuMau(phuLuc)
        var start: number = hunghixhix.findIndex(e => e.stt == str);
        var index: number = start;
        for (var i = start + 1; i < hunghixhix.length; i++) {
            if (hunghixhix[i].stt.startsWith(str)) {
                index = i;
            }
        }
        return index;
    }
    //thay thế các stt khi danh sách được cập nhật, heSo=1 tức là tăng stt lên 1, heso=-1 là giảm stt đi 1
    replaceIndex(lstIndex: number[], heSo: number, phuLuc: string) {
        let hunghixhix = this.getBieuMau(phuLuc);
        //thay doi lai stt cac vi tri vua tim duoc
        lstIndex.forEach(item => {
            var str = this.getHead(hunghixhix[item].stt) + "." + (this.getTail(hunghixhix[item].stt) + heSo).toString();
            var nho = hunghixhix[item].stt;
            hunghixhix.forEach(item => {
                item.stt = item.stt.replace(nho, str);
            })
        })
    }

    addLine(id: any, phuLuc) {
        let hunghixhix = this.getBieuMau(phuLuc);
        let dataPL;                 // du lieu default phu luc
        let lstKmTemp;              // list khoan muc chinh
        var maKm;                   // ma khoan muc

        dataPL = new ItemDataMau0405();
        lstKmTemp = this.noiDungChisBC05;
        maKm = hunghixhix.find(e => e.id == id)?.maNdungChi;
        dataPL.header = phuLuc;
        let obj = {
            maKhoanMuc: maKm,
            lstKhoanMuc: lstKmTemp,
        }

        const modalIn = this.modal.create({
            nzTitle: 'Danh sách nội dung',
            nzContent: DialogThemKhoanMucComponent,
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
                var index: number;
                index = hunghixhix.findIndex(e => e.maNdungChi == res.maKhoanMuc);
                if (index == -1) {
                    let data: any = {
                        ...dataPL,
                        maNdungChi: res.maKhoanMuc,
                        maVtu: res.maKhoanMuc,
                        maDviTinh: this.listDonvitinh[0].id,
                        level: lstKmTemp.find(e => e.id == maKm)?.level,
                    };
                    if (hunghixhix.length == 0) {
                        this.addFirst(data, phuLuc);
                    } else {
                        this.addSame(id, data, phuLuc);
                    }
                }

                id = hunghixhix.find(e => e.maNdungChi == res.maKhoanMuc)?.id;

                res.lstKhoanMuc.forEach(item => {
                    var data: any = {
                        ...dataPL,
                        maNdungChi: item.id,
                        maVtu: item.id,
                        maDviTinh: this.listDonvitinh[0].id,
                        level: item.level,
                    };
                    this.addLow(id, data, phuLuc);
                })
                this.updateEditCache(phuLuc);
            }
        });
    }

    //thêm ngang cấp
    addSame(id: any, initItem, phuLuc: string) {
        let hunghixhix = this.getBieuMau(phuLuc);
        var index: number = hunghixhix.findIndex(e => e.id == id); // vi tri hien tai
        var head: string = this.getHead(hunghixhix[index].stt); // lay phan dau cua so tt
        var tail: number = this.getTail(hunghixhix[index].stt); // lay phan duoi cua so tt
        var ind: number = this.findVt(hunghixhix[index].stt, phuLuc); // vi tri can duoc them
        // tim cac vi tri can thay doi lai stt
        let lstIndex: number[] = [];
        for (var i = hunghixhix.length - 1; i > ind; i--) {
            if (this.getHead(hunghixhix[i].stt) == head) {
                lstIndex.push(i);
            }
        }
        this.replaceIndex(lstIndex, 1, phuLuc);
        var listVtu: vatTu[] = [];

        this.listColTemp.forEach((e) => {
            let objTrongD = {
                id: e.id,
                maVtu: e.maVtu,
                loaiMatHang: '0',
                sl: 0,
            };
            let objLke = {
                id: e.id,
                maVtu: e.maVtu,
                loaiMatHang: '1',
                sl: 0,
            };
            listVtu.push(objTrongD);
            listVtu.push(objLke);
        });


        // them moi phan tu
        if (initItem?.id) {
            let item = {
                ...initItem,
                stt: head + "." + (tail + 1).toString(),
                maLoai: '9',
                listCtiet: listVtu,
            }
            hunghixhix.splice(ind + 1, 0, item);
            this.editCache[item.id] = {
                edit: false,
                data: { ...item }
            };
        } else {
            let item = {
                ...initItem,
                id: uuid.v4() + "FE",
                stt: head + "." + (tail + 1).toString(),
                maLoai: '9',
                listCtiet: listVtu,
                maNdungChiCha: Number(hunghixhix[index].maNdungChiCha),
            }
            hunghixhix.splice(ind + 1, 0, item);
            this.editCache[item.id] = {
                edit: true,
                data: { ...item }
            };
        }
    }

    // gan editCache.data == lstCtietBcao
    updateEditCache(phuLuc: string): void {
        let hunghixhix = this.getBieuMau(phuLuc);
        hunghixhix.forEach(item => {
            this.editCache[item.id] = {
                edit: false,
                data: { ...item }
            };
        });
    }

    //thêm cấp thấp hơn
    addLow(id: any, initItem, phuLuc: string) {
        let hunghixhix = this.getBieuMau(phuLuc);
        var data = hunghixhix.find(e => e.id == id);
        var index: number = hunghixhix.findIndex(e => e.id == id); // vi tri hien tai
        var stt: string;
        if (hunghixhix.findIndex(e => this.getHead(e.stt) == data.stt) == -1) {
            stt = data.stt + '.1';
        } else {
            index = this.findVt(data.stt, phuLuc);
            for (var i = hunghixhix.length - 1; i >= 0; i--) {
                if (this.getHead(hunghixhix[i].stt) == data.stt) {
                    stt = data.stt + '.' + (this.getTail(hunghixhix[i].stt) + 1).toString();
                    break;
                }
            }
        }
        var listVtu: vatTu[] = [];

        this.listColTemp.forEach((e) => {
            let objTrongD = {
                id: e.id,
                maVtu: e.maVtu,
                loaiMatHang: '0',
                sl: 0,
            };
            let objLke = {
                id: e.id,
                maVtu: e.maVtu,
                loaiMatHang: '1',
                sl: 0,
            };
            listVtu.push(objTrongD);
            listVtu.push(objLke);
        });

        // them moi phan tu
        if (initItem?.id) {
            let item = {
                ...initItem,
                stt: stt,
                listCtiet: listVtu,
            }
            hunghixhix.splice(index + 1, 0, item);
            this.editCache[item.id] = {
                edit: false,
                data: { ...item }
            };
        } else {
            let item = {
                ...initItem,
                id: uuid.v4() + "FE",
                stt: stt,
                listCtiet: listVtu,
                maNdungChiCha: Number(hunghixhix[index].maNdungChi),
            }
            hunghixhix.splice(index + 1, 0, item);
            this.editCache[item.id] = {
                edit: true,
                data: { ...item }
            };
        }
    }

    //xóa dòng
    deleteLine(id: any, phuLuc: string) {
        let hunghixhix = this.getBieuMau(phuLuc);
        var index: number = hunghixhix.findIndex(e => e.id == id); // vi tri hien tai
        // khong tim thay thi out ra
        if (index == -1) return;
        var nho: string = hunghixhix[index].stt;
        var head: string = this.getHead(hunghixhix[index].stt); // lay phan dau cua so tt
        //xóa phần tử và con của nó
        hunghixhix = hunghixhix.filter(e => !e.stt.startsWith(nho));
        this.setBieuMau(hunghixhix, phuLuc);
        //update lại số thức tự cho các phần tử cần thiết
        let lstIndex: number[] = [];
        for (var i = hunghixhix.length - 1; i >= index; i--) {
            if (this.getHead(hunghixhix[i].stt) == head) {
                lstIndex.push(i);
            }
        }
        this.replaceIndex(lstIndex, -1, phuLuc);
        this.updateEditCache(phuLuc);
    }

    // start edit
    startEdit(id: string): void {
        this.editCache[id].edit = true;
    }

    // huy thay doi
    cancelEdit(id: string, phuLuc: string): void {
        let hunghixhix = this.getBieuMau(phuLuc);
        // lay vi tri hang minh sua
        const index = hunghixhix.findIndex(item => item.id == id);
        // xoa dong neu truoc do chua co du lieu
        if (!hunghixhix[index].maNdungChi) {
            this.deleteLine(id, phuLuc);
            return;
        }
        //return du lieu
        this.editCache[id] = {
            data: { ...hunghixhix[index] },
            edit: false
        };
    }

    // luu thay doi
    saveEdit(id: string, phuLuc: string): void {
        if (!this.editCache[id].data.maNdungChi) {
            this.notification.warning(MESSAGE.WARNING, MESSAGE.FINISH_FORM);
            return;
        }
        let hunghixhix = this.getBieuMau(phuLuc);
        this.editCache[id].data.checked = hunghixhix.find(item => item.id == id).checked; // set checked editCache = checked danhSachChiTiethunghixhix
        const index = hunghixhix.findIndex(item => item.id == id); // lay vi tri hang minh sua
        Object.assign(hunghixhix[index], this.editCache[id].data); // set lai data cua danhSachChiTiethunghixhix[index] = this.editCache[id].data
        this.editCache[id].edit = false; // CHUYEN VE DANG TEXT
    }

    updateChecked(id: any, phuLuc: string) {
        let hunghixhix = this.getBieuMau(phuLuc);
        var data = hunghixhix.find(e => e.id == id);
        //đặt các phần tử con có cùng trạng thái với nó
        hunghixhix.forEach(item => {
            if (item.stt.startsWith(data.stt)) {
                item.checked = data.checked;
            }
        })
        //thay đổi các phần tử cha cho phù hợp với tháy đổi của phần tử con
        var index: number = hunghixhix.findIndex(e => e.stt == this.getHead(data.stt));
        if (index == -1) {
            this.allChecked = this.checkAllChild('0', phuLuc);
        } else {
            var nho: boolean = hunghixhix[index].checked;
            while (nho != this.checkAllChild(hunghixhix[index].stt, phuLuc)) {
                hunghixhix[index].checked = !nho;
                index = hunghixhix.findIndex(e => e.stt == this.getHead(hunghixhix[index].stt));
                if (index == -1) {
                    this.allChecked = !nho;
                    break;
                }
                nho = hunghixhix[index].checked;
            }
        }
    }
    //kiểm tra các phần tử con có cùng được đánh dấu hay ko
    checkAllChild(str: string, phuLuc: string): boolean {
        let hunghixhix = this.getBieuMau(phuLuc);
        var nho: boolean = true;
        hunghixhix.forEach(item => {
            if ((this.getHead(item.stt) == str) && (!item.checked) && (item.stt != str)) {
                nho = item.checked;
            }
        })
        return nho;
    }


    // update all
    updateAllChecked(): void {
        // this.indeterminate = false;                               // thuoc tinh su kien o checkbox all
        // this.baoCao?.lstBcaos.filter(item =>
        //     item.checked = this.allChecked
        // );
    }

    deleteAllChecked() {
        let idPhuLuc = LISTBIEUMAUDOT[5].lstId;
        idPhuLuc.forEach(phuLuc => {
            let hunghixhix = this.getBieuMau(phuLuc);
            var lstId: any[] = [];
            hunghixhix.forEach(item => {
                if (item.checked) {
                    lstId.push(item.id);
                }
            })
            lstId.forEach(item => {
                if (hunghixhix.findIndex(e => e.id == item) != -1) {
                    this.deleteLine(item, phuLuc);
                }
            })
        });
    }

    //thêm phần tử đầu tiên khi bảng rỗng
    addFirst(initItem: any, phuLuc: string) {
        var listVtu: vatTu[] = [];
        this.listColTemp.forEach((e) => {
            let objTrongD = {
                id: e.id,
                maVtu: e.maVtu,
                loaiMatHang: '0',
                sl: 0,
            };
            let objLke = {
                id: e.id,
                maVtu: e.maVtu,
                loaiMatHang: '1',
                sl: 0,
            };
            listVtu.push(objTrongD);
            listVtu.push(objLke);
        });
        let hunghixhix = this.getBieuMau(phuLuc);
        let item;
        if (initItem?.id) {
            item = {
                ...initItem,
                stt: "0.1",
                listCtiet: listVtu,
            }
        } else {
            item = {
                ...initItem,
                id: uuid.v4() + 'FE',
                stt: "0.1",
                listCtiet: listVtu,
            }
        }
        hunghixhix.push(item);
        this.editCache[item.id] = {
            edit: true,
            data: { ...item }
        };
    }

    sortByIndex() {
        let idPhuLuc = LISTBIEUMAUDOT[5].lstId;
        idPhuLuc.forEach(async phuLuc => {
            await this.setDetail(phuLuc);
            let hunghixhix = this.getBieuMau(phuLuc);
            hunghixhix.sort((item1, item2) => {
                if (item1.level > item2.level) {
                    return 1;
                }
                if (item1.level < item2.level) {
                    return -1;
                }
                if (this.getTail(item1.stt) > this.getTail(item2.stt)) {
                    return -1;
                }
                if (this.getTail(item1.stt) < this.getTail(item2.stt)) {
                    return 1;
                }
                return 0;
            });
            var lstTemp: any[] = [];
            hunghixhix.forEach(item => {
                var index: number = lstTemp.findIndex(e => e.stt == this.getHead(item.stt));
                if (index == -1) {
                    lstTemp.splice(0, 0, item);
                } else {
                    lstTemp.splice(index + 1, 0, item);
                }
            })
            hunghixhix = lstTemp;
            this.setBieuMau(hunghixhix, phuLuc);
        })
    }

    setDetail(phuLuc) {
        let hunghixhix = this.getBieuMau(phuLuc);
        hunghixhix.forEach(item => {
            item.level = this.noiDungChisBC05.find(e => e.id == item.maNdungChi)?.level;
        })
        this.setBieuMau(hunghixhix, phuLuc);
    }

    // getIdCha(maKM: any) {
    //   return this.noiDungs.find(e => e.id == maKM)?.idCha;
    // }

    // sortWithoutIndex() {
    //   let idPhuLuc = PHULUCLIST.find(item => item.maPhuLuc == this.tabSelected)?.lstId;
    //   idPhuLuc.forEach(async phuLuc => {
    //     await this.setDetail(phuLuc);
    //     let hunghixhix = this.getBieuMau(phuLuc);
    //     this.setDetail(phuLuc);
    //     var level = 0;
    //     var danhSachChiTiethunghixhixTemp: any[] = hunghixhix;
    //     hunghixhix = [];
    //     var data = danhSachChiTiethunghixhixTemp.find(e => e.level == 0);
    //     this.addFirst(data, phuLuc);
    //     danhSachChiTiethunghixhixTemp = danhSachChiTiethunghixhixTemp.filter(e => e.id != data.id);
    //     var lstTemp = danhSachChiTiethunghixhixTemp.filter(e => e.level == level);
    //     while (lstTemp.length != 0 || level == 0) {
    //       lstTemp.forEach(item => {
    //         let idCha = this.getIdCha(item.maNdung);
    //         var index: number = hunghixhix.findIndex(e => e.maNdung == idCha);
    //         if (index != -1) {
    //           this.addLow(hunghixhix[index].id, item, phuLuc);
    //         } else {
    //           index = hunghixhix.findIndex(e => this.getIdCha(e.maNdung) == idCha);
    //           this.addSame(hunghixhix[index].id, item, phuLuc);
    //         }
    //       })
    //       level += 1;
    //       lstTemp = danhSachChiTiethunghixhixTemp.filter(e => e.level == level);
    //     }
    //   })
    // }

    getLowStatus(str: string, phuLuc: string) {
        let hunghixhix = this.getBieuMau(phuLuc);
        var index: number = hunghixhix.findIndex(e => this.getHead(e.stt) == str);
        if (index == -1) {
            return false;
        }
        return true;
    }

    getBieuMau(phuLuc) {
        switch (phuLuc) {
            // 05
            case '5-I1':
                return this.lstCtietBcao5I1;
            case '5-I2':
                return this.lstCtietBcao5I2;
            case '5-II11':
                return this.lstCtietBcao5II11;
            case '5-II12':
                return this.lstCtietBcao5II12;
            case '5-II2':
                return this.lstCtietBcao5II2;
            case '5-III1':
                return this.lstCtietBcao5III1;
            case '5-III2':
                return this.lstCtietBcao5III2;
            case '5-B':
                return this.lstCtietBcao5B;
            default:
                return null;
        }
    }

    setBieuMau(listPhuLuc: any, phuLuc: string) {
        switch (phuLuc) {
            // bc 05
            case '5-I1':
                this.lstCtietBcao5I1 = listPhuLuc;
                break;
            case '5-I2':
                this.lstCtietBcao5I2 = listPhuLuc;
                break;
            case '5-II11':
                this.lstCtietBcao5II11 = listPhuLuc;
                break;
            case '5-II12':
                this.lstCtietBcao5II12 = listPhuLuc;
                break;
            case '5-II2':
                this.lstCtietBcao5II2 = listPhuLuc;
                break;
            case '5-III1':
                this.lstCtietBcao5III1 = listPhuLuc;
                break;
            case '5-III2':
                this.lstCtietBcao5III2 = listPhuLuc;
                break;
            case '5-B':
                this.lstCtietBcao5B = listPhuLuc;
                break;
            default:
                break;
        }
    }

    tinhTong(id: any) {
        let tonglstChitietVtuTrongDot = 0;
        if (this.editCache[id].data.listCtiet.length != 0) {
            this.editCache[id].data.listCtiet.forEach(e => {
                if (e.loaiMatHang == '0') {
                    tonglstChitietVtuTrongDot += e.sl;
                }
            })
        }
        this.editCache[id].data.trongDotTcong = this.editCache[id].data.trongDotThoc + this.editCache[id].data.trongDotGao + tonglstChitietVtuTrongDot;
        let tonglstChitietVtuLuyke = 0;
        if (this.editCache[id].data.listCtiet.length != 0) {
            this.editCache[id].data.listCtiet.forEach(e => {
                if (e.loaiMatHang == '1') {
                    tonglstChitietVtuLuyke += e.sl;
                }
            })
        }
        this.editCache[id].data.luyKeTcong = this.editCache[id].data.luyKeThoc + this.editCache[id].data.luyKeGao + tonglstChitietVtuLuyke;
    }

    addAllCol() {
        let lstDviChon = this.lstVatTuFull.filter(item => this.listColTemp?.findIndex(data => data.maVtu == item.id) == -1);
        const modalIn = this.modal.create({
            nzTitle: 'Danh sách vật tư',
            nzContent: DialogLuaChonThemDonViComponent,
            nzMaskClosable: false,
            nzClosable: false,
            nzWidth: '65%',
            nzFooter: null,
            nzComponentParams: {
                danhSachDonVi: lstDviChon
            },
        });
        modalIn.afterClose.subscribe((res) => {
            if (res) {
                res.forEach(async item => {

                    await this.addCol(item);
                })
                // this.lstCtietBcao.forEach(item => {
                //   this.total(item.id);
                // })
                // 
            }
            let idPhuLuc = LISTBIEUMAUDOT[5].lstId;
            idPhuLuc.forEach(phuLuc => {
                this.updateEditCache(phuLuc);
            })
        });
    }

    addCol(vatTu: any) {
        let objTrongD = {
            id: uuid.v4() + 'FE',
            maVtu: vatTu.id,
            colName: vatTu.ten,
            loaiMatHang: '0',
            sl: 0,
        }
        let objLke = {
            id: uuid.v4() + 'FE',
            maVtu: vatTu.id,
            colName: vatTu.ten,
            loaiMatHang: '1',
            sl: 0,
        }
        let idPhuLuc = LISTBIEUMAUDOT[5].lstId;
        idPhuLuc.forEach(phuLuc => {
            let hunghixhix = this.getBieuMau(phuLuc);
            hunghixhix.forEach(data => {
                data.listCtiet.push(objTrongD);
                data.listCtiet.push(objLke);
            })
        })

        this.listColTemp.push(objTrongD);
    }

    deleteCol(maVtu: string) {
        this.data.forEach(data => {
            data.listCtiet = data.listCtiet.filter(e => e.maVtu != maVtu);
        })
        this.listColTemp = this.listColTemp.filter(e => e.maVtu != maVtu);
        // this.lstCtietBcao.forEach(item => {
        //     this.total(item.id);
        // })
        this.tinhTong2();
    }

    tinhTong2() {
        let tonglstChitietVtuTrongDot = 0;
        let tonglstChitietVtuLuyke = 0;
        this.lstCTietBaoCaoTemp.forEach(e => {
            e.listCtiet.forEach(el => {
                if (e.loaiMatHang == '0') {
                    tonglstChitietVtuTrongDot += el.sl;
                } else {
                    tonglstChitietVtuLuyke += el.sl;
                }
            });
            e.trongDotTcong = e.trongDotThoc + e.trongDotGao + tonglstChitietVtuTrongDot;
            e.luyKeTcong = e.luyKeThoc + e.luyKeGao + tonglstChitietVtuLuyke;
        })
    }

    //show popup tu choi dùng cho nut ok - not ok
    async pheDuyetChiTiet(mcn: string, maLoai: any) {
        this.spinner.show();
        if (mcn == OK) {
            await this.pheDuyetBieuMau(mcn, maLoai, null);
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
                    await this.pheDuyetBieuMau(mcn, maLoai, text);
                }
            });
        }
        this.spinner.hide();
    }

    //call api duyet bieu mau
    async pheDuyetBieuMau(trangThai: any, maLoai: any, lyDo: string) {
        var idBieuMau: any = this.data.lstCtietBcaos.find((item) => item.maLoai == maLoai).id;
        const requestPheDuyetBieuMau = {
            id: idBieuMau,
            trangThai: trangThai,
            lyDoTuChoi: lyDo,
        };
        this.spinner.show();

        await this.quanLyVonPhiService.approveBieuMau(requestPheDuyetBieuMau).toPromise().then(async res => {
            if (res.statusCode == 0) {
                if (trangThai == NOT_OK) {
                    this.notification.success(MESSAGE.SUCCESS, MESSAGE.REJECT_SUCCESS);
                } else {
                    this.notification.success(MESSAGE.SUCCESS, MESSAGE.APPROVE_SUCCESS);
                }
                this.trangThaiChiTiet = trangThai;
                this.baoCao?.lstBcaos?.filter(item => {
                    if (item.maLoai == maLoai) {
                        item.trangThai = trangThai;
                        item.lyDoTuChoi = lyDo;
                    }
                })
                this.getStatusButtonOk();
            } else {
                this.notification.error(MESSAGE.ERROR, res?.msg);
            }
        }, err => {
            this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        })
        this.spinner.hide();
    }

    async saveAppendix(maChucNang: string) {
        await this.saveMau05();
        let baoCaoChiTiet = this.data?.lstBcaos.find(item => item.maLoai == this.tabSelected);
        let baoCaoChiTietTemp = JSON.parse(JSON.stringify(baoCaoChiTiet));

        baoCaoChiTietTemp.lstCtietBcaos = JSON.parse(JSON.stringify(this.lstCTietBaoCaoTemp));
        baoCaoChiTietTemp.maDviTien = this.maDviTien;
        baoCaoChiTietTemp.thuyetMinh = this.thuyetMinh;
        baoCaoChiTietTemp.tuNgay = this.tuNgay;
        baoCaoChiTietTemp.denNgay = this.denNgay;
        baoCaoChiTietTemp.lstIdDeletes = this.listIdDelete;

        let checkMoneyRange = true;
        let checkPersonReport = true;

        // validate nguoi thuc hien bao cao
        if (!baoCaoChiTietTemp.nguoiBcao) {
            checkPersonReport = false;
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
            //nhan chia tinh toan cho nay
            //...
        })



        if (checkSaveEdit == false) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTSAVE);
            return;
        }
        if (!checkMoneyRange == true) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.MONEYRANGE);
            return;
        }

        //call service cap nhat phu luc
        this.spinner.show();
        this.quanLyVonPhiService.baoCaoCapNhatChiTiet(baoCaoChiTietTemp).toPromise().then(
            async data => {
                if (data.statusCode == 0) {
                    this.notification.success(MESSAGE.SUCCESS, MESSAGE.SUCCESS);
                    this.baoCao?.lstBcaos?.filter(item => {
                        if (item.maLoai == this.tabSelected) {
                            item.trangThai = maChucNang;
                        }
                    })
                    //await this.getDetailReport();
                    this.getStatusButton();
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

}
