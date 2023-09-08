import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { Operator, Status, Table, Utils } from "src/app/Utility/utils";
import { DialogChonDanhMucChoBieuMauComponent } from 'src/app/components/dialog/dialog-chon-danh-muc-cho-bieu-mau/dialog-chon-danh-muc-cho-bieu-mau.component';
import { DialogDanhSachVatTuHangHoaComponent } from 'src/app/components/dialog/dialog-danh-sach-vat-tu-hang-hoa/dialog-danh-sach-vat-tu-hang-hoa.component';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { DanhMucDungChungService } from 'src/app/services/danh-muc-dung-chung.service';
import { BaoCaoThucHienVonPhiService } from 'src/app/services/quan-ly-von-phi/baoCaoThucHienVonPhi.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import * as uuid from "uuid";
import * as XLSX from 'xlsx';
import { BtnStatus, Doc, Form, Para, Vp } from '../../bao-cao-thuc-hien-von-phi.constant';

export class ItemData {
    id: string;
    stt: string;
    checked: boolean;
    level: number;
    maNdungChi: string;
    tenNdungChi: string;
    trongDotTcong: number;
    luyKeTcong: number;
    listCtiet: Materials[] = [];
    ghiChu: string;

    constructor(data: Partial<Pick<ItemData, keyof ItemData>>) {
        Object.assign(this, data);
    }

    changeModel(luyKes: ItemData[]) {
        const origin = luyKes?.find(e => e.maNdungChi == this.maNdungChi);
        this.trongDotTcong = null;
        this.luyKeTcong = null;
        if (this.listCtiet.length > 0) {
            this.listCtiet.forEach(item => {
                this.trongDotTcong = Operator.sum([this.trongDotTcong, item.gtri]);
                const data = origin?.listCtiet.find(e => e.maVtu == item.maVtu && e.loaiDm == item.loaiDm);
                item.lkGtri = Operator.sum([data?.lkGtri, item.gtri]);
                this.luyKeTcong = Operator.sum([this.luyKeTcong, item.lkGtri]);
            })
        }
        if (['0.1.1', '0.1.2.1', '0.1.2.2'].includes(this.stt)) {
            this.trongDotTcong = null;
            this.luyKeTcong = null;
        }
    }

    total() {
        this.trongDotTcong = null;
        this.luyKeTcong = null;
        this.listCtiet.forEach(item => {
            this.trongDotTcong = Operator.sum([this.trongDotTcong, item.gtri]);
            this.luyKeTcong = Operator.sum([this.luyKeTcong, item.lkGtri])
        })
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
                if (k < 3) {
                    return Utils.laMa(k).toLocaleLowerCase();
                }
                return Utils.laMa(k - 2);
            case 2:
                if (parseInt(chiSo[n - 1], 10) < 3) {
                    return String.fromCharCode(k + 96);
                }
                return chiSo[n];
            case 3:
                return chiSo[n - 1].toString() + "." + chiSo[n].toString();
            case 4:
                return '-';
            case 5:
                return '+';
            default:
                return "";
        }
    }

    upperBound() {
        return this.trongDotTcong > Utils.MONEY_LIMIT || this.luyKeTcong > Utils.MONEY_LIMIT;
    }

    clear() {
        this.trongDotTcong = null;
        this.luyKeTcong = null;
        this.listCtiet?.forEach(item => {
            item.gtri = null;
            item.lkGtri = null;
        });
    }

    sum(coe: number, data: ItemData) {
        this.trongDotTcong = Operator.sum([this.trongDotTcong, Operator.mul(coe, data.trongDotTcong)]);
        this.luyKeTcong = Operator.sum([this.luyKeTcong, Operator.mul(coe, data.luyKeTcong)]);
        this.listCtiet.forEach(item => {
            const gtri = data.listCtiet.find(e => e.maVtu == item.maVtu && e.loaiDm == item.loaiDm);
            item.gtri = Operator.sum([item.gtri, Operator.mul(coe, gtri.gtri)]);
            item.lkGtri = Operator.sum([item.lkGtri, Operator.mul(coe, gtri.lkGtri)]);
        })
    }

    isNumber() {
        return this.maNdungChi.startsWith('0.1.1') || this.maNdungChi.startsWith('0.1.2');
    }

    request() {
        const temp = Object.assign({}, this);
        if (this.id?.length == 38) {
            temp.id = null;
        }
        temp.listCtiet.forEach(item => {
            if (item.id?.length == 38) {
                item.id = null;
            }
        })
        return temp;
    }
}

export class Materials {
    id: string;
    maVtu: string;
    tenVtu: string;
    loaiDm: string;
    gtri: number;
    lkGtri: number;
}

@Component({
    selector: 'app-bao-cao-04a',
    templateUrl: './bao-cao-04a.component.html',
    styleUrls: ['../bao-cao.component.scss']
})

export class BaoCao04aComponent implements OnInit {
    @Input() dataInfo;
    Op = new Operator('1');
    Utils = Utils;
    //thong tin
    formDetail: Form = new Form();
    total: ItemData = new ItemData({});
    maDviTien: string = '1';
    scrollX: string;
    slTheoQd: ItemData;
    slThNamTruoc: ItemData;
    slThNamNay: ItemData;
    para: Para = new Para();
    //danh muc
    lstCtietBcao: ItemData[] = [];
    noiDungChis: any[] = [];
    dinhMucs: any = {
        '01': [],
        '02': [],
        'LD': [],
        'LDM': [],
        'LDBS': [],
    };
    luyKes: any[] = [];
    lstCol: Materials[] = [];
    editCache: { [key: string]: { edit: boolean; data: ItemData } } = {};
    //trang thai
    status: BtnStatus = new BtnStatus();
    editMoneyUnit = false;
    isDataAvailable = false;
    allChecked = false;

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
        private baoCaoThucHienVonPhiService: BaoCaoThucHienVonPhiService,
        private quanLyVonPhiService: QuanLyVonPhiService,
        private danhMucService: DanhMucDungChungService,
        private userService: UserService,
        private notification: NzNotificationService,
        private modal: NzModalService,
    ) { }

    ngOnInit() {
        this.initialization().then(() => {
            this.isDataAvailable = true;
        })
    }

    async initialization() {
        this.spinner.show();
        this.setParameters();
        //thong tin chung cua bieu mau
        Object.assign(this.status, this.dataInfo.status);
        await this.getFormDetail();
        // nếu trạng thái là đang được sửa thì lấy danh mục và định mức của nó ra.
        if (this.status.save) {
            await this.getListNdung();
            await this.getDinhMuc();
        }
        this.luyKes = this.dataInfo.luyKes?.lstCtietBcaos;
        // nếu là báo cáo văn phòng thì lấy ra các dòng số lượng của nó
        if (!this.dataInfo.isHistory && this.dataInfo.isOffice && this.formDetail.trangThai == Status.NEW) {
            this.slTheoQd = this.lstCtietBcao.find(e => e.maNdungChi == this.para.slQd);
            this.slThNamTruoc = this.lstCtietBcao.find(e => e.maNdungChi == this.para.slNamTruoc);
            this.slThNamNay = this.lstCtietBcao.find(e => e.maNdungChi == this.para.slNamNay);
            this.lstCtietBcao = [];
        }
        // khởi tạo các dòng cho bảng nếu chưa có
        if (this.lstCtietBcao.length == 0) {
            if (this.luyKes?.length > 0) {
                this.luyKes.forEach(item => {
                    const lstCtiet: Materials[] = [];
                    item.listCtiet.forEach(e => {
                        lstCtiet.push({
                            ...e,
                            gtri: 0,
                            id: uuid.v4() + 'FE',
                        })
                    })
                    this.lstCtietBcao.push(new ItemData({
                        ...item,
                        listCtiet: lstCtiet,
                        trongDotTcong: 0,
                        id: uuid.v4() + 'FE',
                    }))
                })
            } else {
                this.noiDungChis.forEach(item => {
                    const lstCtiet: Materials[] = [];
                    if (this.slTheoQd) {
                        this.slTheoQd.listCtiet.forEach(e => {
                            lstCtiet.push({
                                ...e,
                                id: uuid.v4() + 'FE',
                                gtri: null,
                                lkGtri: null,
                            })
                        })
                    }
                    this.lstCtietBcao.push(new ItemData({
                        maNdungChi: item.ma,
                        tenNdungChi: item.giaTri,
                        stt: item.ma,
                        listCtiet: lstCtiet,
                        id: uuid.v4() + "FE",
                    }))
                });
            }
            this.quantityAtOffice(this.slTheoQd);
            this.quantityAtOffice(this.slThNamTruoc);
            this.quantityAtOffice(this.slThNamNay);
        }
        // sắp xếp lại thứ tự các trường trong listCtiet 
        this.lstCtietBcao.forEach(item => {
            item.listCtiet.sort((a, b) => {
                if (parseInt(a.maVtu, 10) > parseInt(b.maVtu, 10)) {
                    return 1
                }
                if (parseInt(a.maVtu, 10) < parseInt(b.maVtu, 10)) {
                    return -1
                }
                if (a.loaiDm == 'LDM') {
                    return -1
                }
                return 1
            });
        })
        // lấy thông tin của các cột đã được sắp xếp
        this.lstCtietBcao[0]?.listCtiet.forEach(item => {
            this.lstCol.push(item);
        });
        this.setWidth();

        if (this.lstCtietBcao.length > 0) {
            if (!this.lstCtietBcao[0].stt) {
                this.lstCtietBcao = Table.sortWithoutIndex(this.lstCtietBcao, 'maNdungChi');
            } else {
                this.lstCtietBcao = Table.sortByIndex(this.lstCtietBcao);
            }
        }
        // tính toán lịa định mức của báo cáo tại văn phòng
        if (this.formDetail.trangThai == Status.NEW && this.dataInfo?.isOffice) {
            this.tinhDinhMuc(this.lstCtietBcao.find(e => e.maNdungChi == this.para.slQd));
        }
        // nếu là báo cáo tổng hợp thì cộng lại số lượng (fix tamj cho be)
        if (this.formDetail.trangThai == Status.NEW && this.dataInfo?.isSynth) {
            this.sum(this.lstCtietBcao.find(e => e.maNdungChi == this.para.slNamTruoc).stt);
        }
        this.updateEditCache();
        this.getStatusButton();
        this.spinner.hide();
    }

    getStatusButton() {
        this.status.ok = this.status.ok && (this.formDetail.trangThai == Status.NOT_RATE || this.formDetail.trangThai == Status.COMPLETE);
    }

    async getFormDetail() {
        await this.baoCaoThucHienVonPhiService.ctietBieuMau(this.dataInfo.id).toPromise().then(
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

    setParameters() {
        switch (this.dataInfo.maLoai) {
            case Vp.BM_04AX:
                this.para.loaiDm = '02';
                this.para.excel = '04a_BCPN-X.xlsx'
                break;
            case Vp.BM_04B:
                this.para.maDanhMuc = 'BC_VP_04B';
                this.para.loaiDm = '02';
                this.para.nvChuyenMon = '0.1.3.1.1.2';
                this.para.ttCaNhan = '0.1.3.1.1.1';
                this.para.cucDh = '0.1.3.1.2';
                this.para.tongCucDh = '0.1.3.1.3';
                this.para.kinhPhi = '0.1.3.1';
                this.para.chiPhi = '0.1.4.1';
                this.para.excel = '04b_BCPN-X.xlsx'
                break;
            case Vp.BM_05:
                this.para.maDanhMuc = 'BC_VP_05';
                this.para.loaiDm = '03';
                this.para.cucDh = '1';
                this.para.tongCucDh = '0.1.3.2';
                this.para.excel = '05_BCBPQ.xlsx'
                break;
            default:
                break;
        }
    }

    async getDinhMuc() {
        const request = {
            loaiDinhMuc: this.para.loaiDm,
            maDvi: this.dataInfo.maDvi,
        }
        await this.baoCaoThucHienVonPhiService.getDinhMuc(request).toPromise().then(
            res => {
                if (res.statusCode == 0) {
                    if (this.dataInfo.maLoai != Vp.BM_05) {
                        this.dinhMucs[this.para.loaiDm] = res.data;
                    } else {
                        res.data.forEach(item => {
                            if (['LD', 'LDM', 'LDBS'].includes(item.loaiBaoQuan)) {
                                this.dinhMucs[item.loaiBaoQuan].push(item);
                            }
                        })
                    }
                } else {
                    this.notification.error(MESSAGE.ERROR, res?.msg);
                }
            },
            err => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
            }
        )
    }

    async getListNdung() {
        const data = await this.danhMucService.danhMucChungGetAll(this.para.maDanhMuc);
        if (data) {
            data.data.forEach(
                item => {
                    this.noiDungChis.push({
                        ...item,
                        level: item.ma?.split('.').length - 2,
                    })
                }
            )
        }
    }
    // tính toán lại số lượng tại văn phòng
    quantityAtOffice(data: ItemData) {
        if (!data) { return; }
        const index = this.lstCtietBcao.findIndex(e => e.maNdungChi == data.maNdungChi);
        this.lstCtietBcao[index].trongDotTcong = data.trongDotTcong;
        this.lstCtietBcao[index].luyKeTcong = Operator.sum([this.lstCtietBcao[index].luyKeTcong, data.trongDotTcong]);
        this.lstCtietBcao[index].listCtiet.forEach(item => {
            const vtu = data.listCtiet.find(e => e.maVtu == item.maVtu && e.loaiDm == item.loaiDm);
            item.gtri = vtu.gtri;
            item.lkGtri = Operator.sum([item.lkGtri, vtu.gtri]);
        })
        this.sum(this.lstCtietBcao[index].stt);
    }

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
        //call service cap nhat phu luc
        this.spinner.show();
        this.baoCaoThucHienVonPhiService.baoCaoCapNhatChiTiet(request).toPromise().then(
            async data => {
                if (data.statusCode == 0) {
                    this.notification.success(MESSAGE.SUCCESS, MESSAGE.SUCCESS);
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
        await this.baoCaoThucHienVonPhiService.approveBieuMau(requestGroupButtons).toPromise().then(async (data) => {
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

    //thêm ngang cấp
    addSame(id: string, initItem: ItemData) {
        this.lstCtietBcao = Table.addParent(id, initItem, this.lstCtietBcao);
    }

    // gan editCache.data == lstCtietBcao
    updateEditCache(): void {
        this.lstCtietBcao.forEach(item => {
            const data: Materials[] = [];
            item.listCtiet.forEach(e => {
                data.push({ ...e });
            })
            this.editCache[item.id] = {
                edit: false,
                data: new ItemData({
                    ...item,
                    listCtiet: data,
                })
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
        const index = this.lstCtietBcao.findIndex(item => item.id === id);
        // lay vi tri hang minh sua
        this.editCache[id] = {
            data: new ItemData(this.lstCtietBcao[index]),
            edit: false
        };
    }

    // luu thay doi
    saveEdit(id: string): void {
        this.editCache[id].data.checked = this.lstCtietBcao.find(item => item.id == id).checked; // set checked editCache = checked danhSachChiTietbaoCao
        const index = this.lstCtietBcao.findIndex(item => item.id == id); // lay vi tri hang minh sua
        Object.assign(this.lstCtietBcao[index], this.editCache[id].data); // set lai data cua danhSachChiTietbaoCao[index] = this.editCache[id].data
        this.editCache[id].edit = false; // CHUYEN VE DANG TEXT
        // Nếu không nằm trong B thì tính cộng lên như bình thường, ngược lại thì trừ qua lại cho nhau
        if (!this.lstCtietBcao[index].maNdungChi.startsWith(this.para.B)) {
            this.sum(this.lstCtietBcao[index].stt);
        } else {
            let indexHieu: number;
            let indexBiTru: number;
            const indexB = this.lstCtietBcao.findIndex(e => e.maNdungChi == this.para.B);
            if (this.lstCtietBcao[index].maNdungChi == this.para.Bi) {
                indexBiTru = this.lstCtietBcao.findIndex(e => e.maNdungChi == this.para.Bi);
                indexHieu = this.lstCtietBcao.findIndex(e => e.maNdungChi == this.para.Bii);
            } else {
                indexBiTru = this.lstCtietBcao.findIndex(e => e.maNdungChi == this.para.Bii);
                indexHieu = this.lstCtietBcao.findIndex(e => e.maNdungChi == this.para.Bi);
            }
            this.lstCtietBcao[indexHieu].clear();
            this.lstCtietBcao[indexHieu].sum(1, this.lstCtietBcao[indexB]);
            this.lstCtietBcao[indexHieu].sum(-1, this.lstCtietBcao[indexBiTru]);
        }
        //tính lại định mức nếu đang sửa hàng số lượng theo quyết định
        if (this.lstCtietBcao[index].maNdungChi == this.para.slQd) {
            this.tinhDinhMuc(this.lstCtietBcao[index]);
        }
        this.updateEditCache();
    }

    getDmValue(cuc: number, vp: number) {
        if (this.dataInfo.isOffice) {
            return vp;
        }
        if (this.userService.isChiCuc()) {
            return cuc;
        }
        return Operator.sum([cuc, vp]);
    }

    tinhCtietDm(maNdungChi: string, sl: Materials[], keyDvi: string, keyVp?: string) {
        const index = this.lstCtietBcao.findIndex(e => e.maNdungChi == maNdungChi);
        if (index && index != -1) {
            this.lstCtietBcao[index].listCtiet.forEach(item => {
                const gtri = sl.find(e => e.maVtu == item.maVtu && e.loaiDm == item.loaiDm).gtri;
                const dm = this.dinhMucs[item.loaiDm].find(e => e.cloaiVthh == item.maVtu);
                if (dm) {
                    item.gtri = keyVp ? Operator.mul(gtri, this.getDmValue(dm[keyDvi], dm[keyVp])) : Operator.mul(gtri, dm[keyDvi]);
                }
            })
            this.lstCtietBcao[index].changeModel(this.luyKes);
            this.sum(this.lstCtietBcao[index].stt);
        }
    }

    tinhDinhMuc(data: ItemData) {
        if (!data) { return; }
        this.tinhCtietDm(this.para.nvChuyenMon, data.listCtiet, 'nvChuyenMonDviTt', 'nvChuyenMonVp');
        this.tinhCtietDm(this.para.ttCaNhan, data.listCtiet, 'ttCaNhanDviTt', 'ttCaNhanVp');
        this.tinhCtietDm(this.para.cucDh, data.listCtiet, 'dieuHanhDviTt', 'dieuHanhVp');
        this.tinhCtietDm(this.para.tongCucDh, data.listCtiet, 'tcDhNvCm');
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
            if (this.checkDelete(item)) {
                item.checked = this.allChecked;
            }
        })
    }

    deleteAllChecked() {
        const lstId: string[] = [];
        this.lstCtietBcao.forEach(item => {
            if (item.checked && this.checkDelete(item)) {
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
        const maNdung = id ? this.lstCtietBcao.find(e => e.id == id).maNdungChi : '0';
        const level = maNdung.split('.').length - 1;
        let dmNdung = this.noiDungChis.filter(e => e.ma.startsWith(maNdung) && e.level == level);
        dmNdung = dmNdung.filter(e => this.lstCtietBcao.findIndex(item => item.maNdungChi == e.ma) == -1);
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
                            maNdungChi: item.ma,
                            level: item.level,
                            tenNdungChi: item.giaTri,
                            listCtiet: [],
                        })
                        this.lstCol.forEach(e => {
                            data.listCtiet.push({
                                ...e,
                                id: uuid.v4() + 'FE',
                                gtri: null,
                                lkGtri: null,
                            })
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

    addNewCol() {
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
        modalTuChoi.afterClose.subscribe(async (res) => {
            if (res) {
                if (this.lstCol.findIndex(e => e.maVtu == res.ma) != -1) {
                    return;
                }
                const obj: Materials = {
                    ...new Materials(),
                    maVtu: res.ma,
                    tenVtu: res.ten + ' (' + res.maDviTinh + ')',
                }
                if (this.dataInfo.maLoai != Vp.BM_05) {
                    obj.loaiDm = this.para.loaiDm;
                    this.lstCol.push(obj);
                    this.lstCtietBcao.forEach(item => {
                        item.listCtiet.push({
                            ...obj,
                            id: uuid.v4() + 'FE',
                        })
                    })
                } else {
                    if (res.ma.startsWith('01')) {
                        const objLDM: Materials = {
                            ...obj,
                            tenVtu: obj.tenVtu + ' - LDM',
                            loaiDm: 'LDM',
                        }
                        const objLDBS: Materials = {
                            ...obj,
                            tenVtu: obj.tenVtu + ' - LDBS',
                            loaiDm: 'LDBS',
                        }
                        this.lstCol.push(objLDM);
                        this.lstCol.push(objLDBS);
                        this.lstCtietBcao.forEach(item => {
                            item.listCtiet.push({
                                ...objLDM,
                                id: uuid.v4() + 'FE',
                            })
                            item.listCtiet.push({
                                ...objLDBS,
                                id: uuid.v4() + 'FE',
                            })
                        })
                    } else {
                        obj.loaiDm = 'LD';
                        this.lstCol.push(obj);
                        this.lstCtietBcao.forEach(item => {
                            item.listCtiet.push({
                                ...obj,
                                id: uuid.v4() + 'FE',
                            })
                        })
                    }
                }
                this.setWidth();
                this.updateEditCache();
            }
        });
    }

    deleteCol(maVtu: string) {
        this.lstCtietBcao.forEach(data => {
            data.listCtiet = data.listCtiet.filter(e => e.maVtu != maVtu);
        })
        this.lstCtietBcao.forEach(e => e.total());
        this.updateEditCache();
        this.lstCol = this.lstCol.filter(e => e.maVtu != maVtu);
        this.setWidth()
    }

    setWidth() {
        if (this.status.save) {
            this.scrollX = Table.tableWidth(350, (this.lstCol.length + 1) * 2, 1, 170);
        } else {
            this.scrollX = Table.tableWidth(350, (this.lstCol.length + 1) * 2, 1, 0);
        }
    }

    sum(stt: string) {
        //tinhs toan chech lech giua I, II, III
        this.calcuDeviant(this.lstCtietBcao.find(e => e.stt == stt)?.maNdungChi);
        stt = Table.preIndex(stt);
        while (stt != '0') {
            const index = this.lstCtietBcao.findIndex(e => e.stt == stt);
            this.lstCtietBcao[index].clear();
            this.lstCtietBcao.forEach(item => {
                if (Table.preIndex(item.stt) == stt) {
                    this.lstCtietBcao[index].sum(1, item);
                }
            })
            //tinh lai chenh lech giua cac hang trong I, II, III
            this.calcuDeviant(this.lstCtietBcao[index].maNdungChi);
            //neu danh muc dang sua la 0.1.3 thi gan gia tri cua no vao B(0.2)
            if (this.lstCtietBcao[index].maNdungChi == '0.1.3') {
                const ind1 = this.lstCtietBcao.findIndex(e => e.maNdungChi == this.para.B);
                const ind2 = this.lstCtietBcao.findIndex(e => e.maNdungChi == this.para.Bi);
                const ind3 = this.lstCtietBcao.findIndex(e => e.maNdungChi == this.para.Bii);
                if (ind1 != -1) {
                    this.lstCtietBcao[ind1].clear();
                    this.lstCtietBcao[ind1].sum(1, this.lstCtietBcao[index]);
                    this.lstCtietBcao[ind3].clear();
                    this.lstCtietBcao[ind3].sum(1, this.lstCtietBcao[ind1]);
                    this.lstCtietBcao[ind3].sum(-1, this.lstCtietBcao[ind2]);
                }
            }
            stt = Table.preIndex(stt);
        }
    }

    //tinh toan chech lech giua cac hang
    calcuDeviant(maNdung: string) {
        //tim duoi cua ma noi dung de xac dinh phan bi tru
        if (maNdung && (maNdung.startsWith(this.para.kinhPhi) || maNdung.startsWith(this.para.chiPhi))) {
            const tail = maNdung.substring(this.para.kinhPhi.length);
            const indexI = this.lstCtietBcao.findIndex(e => e.maNdungChi.startsWith(this.para.kinhPhi) && e.maNdungChi.substring(this.para.kinhPhi.length) == tail);
            const indexII = this.lstCtietBcao.findIndex(e => e.maNdungChi.startsWith(this.para.chiPhi) && e.maNdungChi.substring(this.para.chiPhi.length) == tail);
            const indexIII = this.lstCtietBcao.findIndex(e => e.maNdungChi.startsWith(this.para.chenhLech) && e.maNdungChi.substring(this.para.chenhLech.length) == tail);
            if (indexIII != -1) {
                const value1 = indexI == -1 ? new ItemData({}) : this.lstCtietBcao[indexI];
                const value2 = indexII == -1 ? new ItemData({}) : this.lstCtietBcao[indexII];
                this.lstCtietBcao[indexIII].clear();
                this.lstCtietBcao[indexIII].sum(1, value1);
                this.lstCtietBcao[indexIII].sum(-1, value2);
            }

        }
    }

    statusDeleteCol(maVtu: string) {
        if (this.luyKes?.length > 0) {
            if (this.luyKes[0].listCtiet.findIndex(e => e.maVtu == maVtu) != -1) {
                return true;
            }
        }
        return false;
    }

    checkDelete(item: ItemData) {
        if (this.luyKes?.findIndex(e => e.maNdungChi == item.maNdungChi) != -1) {
            return false;
        }
        if (item.level <= 3) {
            return false;
        }
        return true;
    }

    checkEdit(item: ItemData) {
        if (item.maNdungChi.startsWith('0.1.3')) {
            return false;
        }
        if (item.maNdungChi.startsWith('0.1.5') && item.level < 3) {
            return false;
        }
        const lstTemp = this.lstCtietBcao.filter(e => e.id != item.id);
        return lstTemp.every(e => !e.stt.startsWith(item.stt));
    }

    fmtVal(val: number, data: ItemData) {
        if (data.maNdungChi == '0.1') {
            return null;
        }
        return data.isNumber() ? this.Op.fmtNum(val) : this.Op.fmtVal(val);
    }

    exportToExcel() {
        if (this.lstCtietBcao.some(e => this.editCache[e.id].edit)) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTSAVE);
            return;
        }
        const num = this.lstCol.length;
        const header = [
            { t: 0, b: 5 + this.lstCtietBcao.length, l: 0, r: 2 + (num + 1) * 2, val: null },
            { t: 0, b: 0, l: 0, r: 1, val: this.dataInfo.tenPl },
            { t: 1, b: 1, l: 0, r: 8, val: this.dataInfo.tieuDe },
            { t: 2, b: 2, l: 0, r: 8, val: this.dataInfo.congVan },
            { t: 4, b: 5, l: 0, r: 0, val: 'STT' },
            { t: 4, b: 5, l: 1, r: 1, val: 'Nội dung chi' },
            { t: 4, b: 4, l: 2, r: 2 + num, val: 'Chi tiết theo từng mặt hàng trong đợt' },
            { t: 5, b: 5, l: 2, r: 2, val: 'Tổng cộng' },
            { t: 4, b: 4, l: 3 + num, r: 3 + 2 * num, val: 'Chi tiết theo từng mặt hàng lũy kế từ đầu năm' },
            { t: 5, b: 5, l: 3 + num, r: 3 + num, val: 'Tổng cộng' },
            { t: 4, b: 5, l: 4 + num * 2, r: 4 + num * 2, val: 'Ghi chú' },
        ]
        this.lstCol.forEach((item, index) => {
            header.push({ t: 5, b: 5, l: 3 + index, r: 3 + index, val: item.tenVtu });
            header.push({ t: 5, b: 5, l: 4 + index + num, r: 4 + index + num, val: item.tenVtu })
        })
        this.lstCtietBcao.forEach((item, index) => {
            const row = 6 + index;
            header.push({ t: row, b: row, l: 0, r: 0, val: item.index() })
            header.push({ t: row, b: row, l: 1, r: 1, val: item.tenNdungChi })
            header.push({ t: row, b: row, l: 2, r: 2, val: item.trongDotTcong?.toString() })
            header.push({ t: row, b: row, l: 3 + num, r: 3 + num, val: item.luyKeTcong?.toString() })
            header.push({ t: row, b: row, l: 4 + 2 * num, r: 4 + 2 * num, val: item.ghiChu })
            this.lstCol.forEach((e, ind) => {
                const sl = item.listCtiet.find(d => d.maVtu == e.maVtu && d.loaiDm == e.loaiDm);
                header.push({ t: row, b: row, l: 3 + ind, r: 3 + ind, val: sl.gtri?.toString() })
                header.push({ t: row, b: row, l: 4 + ind + num, r: 4 + ind + num, val: sl.lkGtri?.toString() })
            })
        })
        const workbook = XLSX.utils.book_new();
        const worksheet = Table.initExcel(header);
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Dữ liệu');
        XLSX.writeFile(workbook, this.para.excel);
    }
}
