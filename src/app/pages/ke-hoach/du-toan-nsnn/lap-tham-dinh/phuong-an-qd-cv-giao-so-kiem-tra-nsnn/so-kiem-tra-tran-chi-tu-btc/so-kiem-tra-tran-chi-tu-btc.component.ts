import { DatePipe, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import * as fileSaver from 'file-saver';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogThemKhoanMucComponent } from 'src/app/components/dialog/dialog-them-khoan-muc/dialog-them-khoan-muc.component';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { displayNumber, divMoney, DON_VI_TIEN, exchangeMoney, KHOAN_MUC, LA_MA, MONEY_LIMIT, mulMoney, ROLE_CAN_BO, sumNumber, TRANG_THAI_TIM_KIEM, Utils } from 'src/app/Utility/utils';
import * as uuid from 'uuid';
import { DataService } from 'src/app/services/data.service';
import { LAP_THAM_DINH, MAIN_ROUTE_DU_TOAN, MAIN_ROUTE_KE_HOACH } from '../../lap-tham-dinh.constant';


export class ItemData {
    id!: string;
    stt: string;
    level: number;
    maNhom: number;
    tongSo: number;
    nguonNsnn: number;
    nguonKhac: number;
    checked!: boolean;
}

export class ItemCongVan {
    fileName: string;
    fileSize: number;
    fileUrl: number;
}

@Component({
    selector: 'app-so-kiem-tra-tran-chi-tu-btc',
    templateUrl: './so-kiem-tra-tran-chi-tu-btc.component.html',
    styleUrls: ['./so-kiem-tra-tran-chi-tu-btc.component.scss',
    ],
})
export class SoKiemTraTranChiTuBtcComponent implements OnInit {
    //thong tin dang nhap
    id: string;
    userInfo: any;
    //thong tin chung bao cao
    maBaoCao: string;
    ngayTao: string;
    maDonViTao: string;
    maPa: string;
    maPaBtc: string;
    namPa: number;
    soQdCv!: ItemCongVan;
    trangThaiBanGhi = '1';
    newDate = new Date();
    maDviTien: string;
    moneyUnit: string;
    thuyetMinh: string;
    //danh muc
    lstCtietBcao: ItemData[] = [];
    donVis: any[] = [];
    noiDungs: any[] = KHOAN_MUC;
    donViTiens: any[] = DON_VI_TIEN;
    trangThais: any[] = TRANG_THAI_TIM_KIEM;
    soLaMa: any[] = LA_MA;
    lstBcao: any[] = [];
    //trang thai cac nut
    status = false;
    statusBtnSave: boolean;
    statusBtnNew: boolean;
    statusBtnEdit: boolean;
    statusChinhXac: boolean;
    statusBtnCopy: boolean;
    statusBtnPrint: boolean;
    allChecked = false;
    //khac
    editCache: { [key: string]: { edit: boolean; data: ItemData } } = {}; // phuc vu nut chinh
    listId = '';
    lstFiles: any[] = []; //show file ra man hinh
    //file
    listFile: File[] = [];                      // list file chua ten va id de hien tai o input
    fileList: NzUploadFile[] = [];
    fileDetail: NzUploadFile;
    //beforeUpload: any;
    listIdFilesDelete: any = [];                        // id file luc call chi tiet
    formatter = value => value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : null;

    // before uploaf file
    beforeUpload = (file: NzUploadFile): boolean => {
        this.fileList = this.fileList.concat(file);
        return false;
    };

    // before uploaf file
    beforeUploadCV = (file: NzUploadFile): boolean => {
        this.fileDetail = file;
        this.soQdCv = {
            fileName: file.name,
            fileSize: null,
            fileUrl: null,
        };
        return false;
    };

    // them file vao danh sach
    handleUpload(): void {
        this.fileList.forEach((file: any) => {
            const id = file?.lastModified.toString();
            this.lstFiles.push({ id: id, fileName: file?.name });
            this.listFile.push(file);
        });
        this.fileList = [];
    }

    constructor(
        private quanLyVonPhiService: QuanLyVonPhiService,
        private danhMuc: DanhMucHDVService,
        private spinner: NgxSpinnerService,
        private routerActive: ActivatedRoute,
        private datePipe: DatePipe,
        private sanitizer: DomSanitizer,
        private router: Router,
        private userService: UserService,
        private notification: NzNotificationService,
        private location: Location,
        private modal: NzModalService,
        private dataSource: DataService,
    ) { }

    async ngOnInit() {
        //lay id cua ban ghi
        this.id = this.routerActive.snapshot.paramMap.get('id');
        this.spinner.show();
        //lay thong tin user
        const userName = this.userService.getUserName();
        await this.getUserInfo(userName);
        this.maDonViTao = this.userInfo?.dvql;

        //lay danh sach danh muc
        await this.danhMuc.dMDonVi().toPromise().then(
            data => {
                if (data.statusCode == 0) {
                    this.donVis = data.data;
                } else {
                    this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
                }
            },
            err => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
            }
        );
        if (this.id) {
            await this.getDetailReport();
        } else {
            this.trangThaiBanGhi = '1';
            this.maDonViTao = this.userInfo?.dvql;
            this.maDviTien = '3';
            this.moneyUnit = this.maDviTien;
            this.ngayTao = this.datePipe.transform(this.newDate, Utils.FORMAT_DATE_STR);
            await this.dataSource.currentData.subscribe(obj => {
                this.maBaoCao = obj?.maBcao;
                this.namPa = obj?.namBcao;
            })
            if (!this.maBaoCao) {
                this.location.back();
            }

            this.quanLyVonPhiService.maPhuongAn().toPromise().then(
                (res) => {
                    if (res.statusCode == 0) {
                        this.maPaBtc = res.data;
                        const sinhMa: string[] = this.maPaBtc.split('.');
                        this.maPaBtc = sinhMa[0] + 'BTC.' + sinhMa[1];
                    } else {
                        this.notification.error(MESSAGE.ERROR, res?.msg);
                    }
                },
                (err) => {
                    this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
                },
            );

        }
        //lay danh sach bao cao duoc tong hop tu
        await this.quanLyVonPhiService.danhSachBaoCaoTongHop(this.maBaoCao).toPromise().then(
            data => {
                if (data.statusCode == 0) {
                    this.lstBcao = data.data;
                } else {
                    this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
                    return;
                }
            },
            err => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
                return;
            }
        );
        this.getStatusButton();
        this.spinner.hide();

    }

    redirectkehoachvonphi() {
        // this.route.navigate(['/qlkh-von-phi/quan-ly-lap-tham-dinh-du-toan-nsnn']);
        this.location.back()
    }

    //get user info
    async getUserInfo(username: string) {
        await this.userService.getUserInfo(username).toPromise().then(
            (data) => {
                if (data?.statusCode == 0) {
                    this.userInfo = data?.data
                    return data?.data;
                } else {
                    this.notification.error(MESSAGE.ERROR, data?.msg);
                }
            },
            (err) => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
            }
        );
    }

    //check role cho các nut trinh duyet
    getStatusButton() {
        const userRole = this.userInfo?.roles[0]?.code;
        if (this.id && !ROLE_CAN_BO.includes(userRole)) {
            this.status = true;
        } else {
            this.status = false;
        }

        let checkChirld = false;
        const dVi = this.donVis.find(e => e.maDvi == this.maDonViTao);
        if (dVi && dVi.maDvi == this.userInfo?.dvql) {
            checkChirld = true;
        }
        const utils = new Utils();
        this.statusBtnSave = utils.getRoleSave(this.trangThaiBanGhi, checkChirld, userRole);
        if (this.id) {
            this.statusBtnSave = true;
        }
        if (!this.id) {
            this.statusBtnNew = true;
            this.statusBtnEdit = true;
        } else {
            if (this.lstBcao.length > 0) {
                this.statusBtnNew = false;
                this.statusBtnEdit = true;
            } else {
                this.statusBtnNew = true;
                this.statusBtnEdit = false;
            }
        }
        this.statusBtnCopy = utils.getRoleCopy(this.trangThaiBanGhi, checkChirld, userRole);
        this.statusBtnPrint = utils.getRolePrint(this.trangThaiBanGhi, checkChirld, userRole);
        if (!ROLE_CAN_BO.includes(userRole)) {
            this.statusBtnEdit = true;
            this.statusBtnNew = true;
            this.statusChinhXac = true;
        } else {
            this.statusChinhXac = false;
        }
    }

    //upload file
    async uploadFile(file: File) {
        // day file len server
        const upfile: FormData = new FormData();
        upfile.append('file', file);
        upfile.append('folder', this.maDonViTao + '/' + this.maPaBtc);
        const temp = await this.quanLyVonPhiService.uploadFile(upfile).toPromise().then(
            (data) => {
                const objfile = {
                    fileName: data.filename,
                    fileSize: data.size,
                    fileUrl: data.url,
                }
                return objfile;
            },
            err => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
            },
        );
        return temp;
    }

    // xoa file trong bang file
    deleteFile(id: string): void {
        this.lstFiles = this.lstFiles.filter((a: any) => a.id !== id);
        this.listFile = this.listFile.filter((a: any) => a?.lastModified.toString() !== id);
        this.listIdFilesDelete.push(id);
    }

    //download file về máy tính
    async downloadFile(id: string) {
        const file: File = this.listFile.find(element => element?.lastModified.toString() == id);
        if (!file) {
            const fileAttach = this.lstFiles.find(element => element?.id == id);
            if (fileAttach) {
                await this.quanLyVonPhiService.downloadFile(fileAttach.fileUrl).toPromise().then(
                    (data) => {
                        fileSaver.saveAs(data, fileAttach.fileName);
                    },
                    err => {
                        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
                    },
                );
            }
        } else {
            const blob = new Blob([file], { type: "application/octet-stream" });
            fileSaver.saveAs(blob, file.name);
        }
    }


    //download file về máy tính
    async downloadFileCv() {
        if (this.soQdCv?.fileUrl) {
            await this.quanLyVonPhiService.downloadFile(this.soQdCv?.fileUrl).toPromise().then(
                (data) => {
                    fileSaver.saveAs(data, this.soQdCv?.fileName);
                },
                err => {
                    this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
                },
            );
        } else {
            const file: any = this.fileDetail;
            const blob = new Blob([file], { type: "application/octet-stream" });
            fileSaver.saveAs(blob, file.name);
        }
    }

    // call chi tiet bao cao
    async getDetailReport() {
        await this.quanLyVonPhiService.ctietPhuongAn(this.id).toPromise().then(
            async (data) => {
                if (data.statusCode == 0) {
                    this.id = data.data.id;
                    this.lstCtietBcao = data.data.listCtiet;
                    this.maDviTien = data.data.maDviTien;
                    this.lstFiles = data.data.lstFiles;
                    this.listFile = [];
                    this.sortByIndex();
                    this.maDviTien = data.data.maDviTien;
                    this.lstCtietBcao.forEach(item => {
                        item.tongSo = divMoney(item.tongSo, this.maDviTien);
                        item.nguonNsnn = divMoney(item.nguonNsnn, this.maDviTien);
                        item.nguonKhac = divMoney(item.nguonKhac, this.maDviTien);
                    })
                    this.maBaoCao = data.data.maBcao;
                    this.namPa = data.data.namPa;
                    this.trangThaiBanGhi = data.data.trangThai;
                    this.maPa = data.data.maPa;
                    this.maDonViTao = data.data.maDvi;
                    this.thuyetMinh = data.data.thuyetMinh;
                    this.ngayTao = this.datePipe.transform(data.data.ngayTao, Utils.FORMAT_DATE_STR);
                    this.soQdCv = data.data.soQdCv;
                    this.maPaBtc = data.data.maPaBtc;
                    this.updateEditCache();
                } else {
                    this.notification.error(MESSAGE.ERROR, data?.msg);
                }
            },
            (err) => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
            },
        );
    }

    // chuc nang check role
    async onSubmit(mcn: string, lyDoTuChoi: string) {
        if (this.id) {
            const requestGroupButtons = {
                id: this.id,
                maChucNang: mcn,
                lyDoTuChoi: lyDoTuChoi,
            };
            this.spinner.show();
            await this.quanLyVonPhiService.trinhDuyetPhuongAn(requestGroupButtons).toPromise().then(async (data) => {
                if (data.statusCode == 0) {
                    this.trangThaiBanGhi = mcn;
                    this.getStatusButton();
                    if (mcn == Utils.TT_BC_8 || mcn == Utils.TT_BC_5 || mcn == Utils.TT_BC_3) {
                        this.notification.success(MESSAGE.SUCCESS, MESSAGE.REVERT_SUCCESS);
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


    // luu
    async save() {
        let checkSaveEdit;
        if (!this.maDviTien) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
            return;
        }
        this.lstCtietBcao.filter(item => {
            if (this.editCache[item.id].edit == true) {
                checkSaveEdit = false;
            }
        })
        if (checkSaveEdit == false) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTSAVE);
            return;
        }

        const lstCtietBcaoTemp: any[] = [];
        let checkMoneyRange = true;
        // gui du lieu trinh duyet len server
        this.lstCtietBcao.forEach(item => {
            if (mulMoney(item.tongSo, this.maDviTien) > MONEY_LIMIT) {
                checkMoneyRange = false;
                return;
            }
            lstCtietBcaoTemp.push({
                ...item,
                tongSo: mulMoney(item.tongSo, this.maDviTien),
                nguonNsnn: mulMoney(item.nguonNsnn, this.maDviTien),
                nguonKhac: mulMoney(item.nguonKhac, this.maDviTien),
                listCtietDvi: [],
            })
        })

        if (!checkMoneyRange == true) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.MONEYRANGE);
            return;
        }

        lstCtietBcaoTemp.forEach(item => {
            if (item.id?.length == 38) {
                item.id = null;
            }
        });
        //get list file url
        let checkFile = true;
        for (const iterator of this.listFile) {
            if (iterator.size > Utils.FILE_SIZE) {
                checkFile = false;
            }
        }
        if (!checkFile) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.OVER_SIZE);
            return;
        }
        const listFile: any = [];
        for (const iterator of this.listFile) {
            listFile.push(await this.uploadFile(iterator));
        }
        // gui du lieu trinh duyet len server
        const request = JSON.parse(JSON.stringify({
            id: this.id,
            fileDinhKems: this.lstFiles,
            listIdDeleteFiles: this.listIdFilesDelete,
            listCtiet: lstCtietBcaoTemp,
            listTtCtiet: [],
            maDvi: this.maDonViTao,
            maDviTien: this.maDviTien,
            maPa: "",
            maPaBtc: this.maPaBtc,
            namPa: this.namPa,
            maBcao: this.maBaoCao,
            soQdCv: this.soQdCv,
            trangThai: this.trangThaiBanGhi,
            thuyetMinh: this.thuyetMinh,
        }));

        const file: any = this.fileDetail;
        if (file) {
            if (file.size > Utils.FILE_SIZE) {
                this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.OVER_SIZE);
                return;
            } else {
                request.soQdCv = await this.uploadFile(file);
            }
        }

        if (!request.soQdCv) {
            this.notification.warning(MESSAGE.WARNING, "Vui lòng nhập số quyết định công văn");
            return;
        }
        this.spinner.show();
        if (!this.id) {
            this.quanLyVonPhiService.themMoiPhuongAn(request).toPromise().then(
                async (data) => {
                    if (data.statusCode == 0) {
                        this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
                        if (!this.id) {
                            this.router.navigate([
                                MAIN_ROUTE_KE_HOACH + '/' + MAIN_ROUTE_DU_TOAN + '/' + LAP_THAM_DINH + '/so-kiem-tra-tran-chi-tu-btc/' + data.data.id,
                            ])
                        }
                        else {
                            await this.getDetailReport();
                            this.getStatusButton();
                        }
                    } else {
                        this.notification.error(MESSAGE.ERROR, data?.msg);
                    }
                },
                (err) => {
                    this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
                },
            );
        }
        this.spinner.hide();
    }

    //lay ten don vi tạo
    getUnitName() {
        return this.donVis.find((item) => item.maDvi == this.maDonViTao)?.tenDvi;
    }

    getStatusName() {
        const utils = new Utils();
        return utils.getStatusName(this.trangThaiBanGhi);
    }

    // chuyển đổi stt đang được mã hóa thành dạng I, II, a, b, c, ...
    getChiMuc(str: string): string {
        str = str.substring(str.indexOf('.') + 1, str.length);
        let xau = "";
        const chiSo: string[] = str.split('.');
        const n: number = chiSo.length - 1;
        let k: number = parseInt(chiSo[n], 10);
        if (n == 0) {
            for (let i = 0; i < this.soLaMa.length; i++) {
                while (k >= this.soLaMa[i].gTri) {
                    xau += this.soLaMa[i].kyTu;
                    k -= this.soLaMa[i].gTri;
                }
            }
        }
        if (n == 1) {
            xau = chiSo[n];
        }
        if (n == 2) {
            xau = chiSo[n - 1].toString() + "." + chiSo[n].toString();
        }
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
    //thêm ngang cấp
    addSame(id: string, khoanMuc: any) {
        const index: number = this.lstCtietBcao.findIndex(e => e.id === id); // vi tri hien tai
        const head: string = this.getHead(this.lstCtietBcao[index].stt); // lay phan dau cua so tt
        const tail: number = this.getTail(this.lstCtietBcao[index].stt); // lay phan duoi cua so tt
        const ind: number = this.findVt(this.lstCtietBcao[index].stt); // vi tri can duoc them
        // tim cac vi tri can thay doi lai stt
        const lstIndex: number[] = [];
        for (let i = this.lstCtietBcao.length - 1; i > ind; i--) {
            if (this.getHead(this.lstCtietBcao[i].stt) == head) {
                lstIndex.push(i);
            }
        }
        this.replaceIndex(lstIndex, 1);
        // them moi phan tu

        const item: ItemData = {
            id: uuid.v4() + 'FE',
            stt: head + "." + (tail + 1).toString(),
            maNhom: khoanMuc.id,
            level: khoanMuc.level,
            tongSo: 0,
            nguonNsnn: 0,
            nguonKhac: 0,
            checked: false,
        };
        this.lstCtietBcao.splice(ind + 1, 0, item);
        this.editCache[item.id] = {
            edit: true,
            data: { ...item }
        };
    }

    // gan editCache.data == lstCtietBcao
    updateEditCache(): void {
        this.lstCtietBcao.forEach(item => {
            this.editCache[item.id] = {
                edit: false,
                data: {
                    ...item,
                }
            }
        })
    }
    //thêm cấp thấp hơn
    addLow(id: string, khoanMuc: any) {
        const data: ItemData = this.lstCtietBcao.find(e => e.id === id);
        let index: number = this.lstCtietBcao.findIndex(e => e.id === id); // vi tri hien tai
        let stt: string;
        if (this.lstCtietBcao.findIndex(e => this.getHead(e.stt) == data.stt) == -1) {
            stt = data.stt + '.1';
        } else {
            index = this.findVt(data.stt);
            for (let i = this.lstCtietBcao.length - 1; i >= 0; i--) {
                if (this.getHead(this.lstCtietBcao[i].stt) == data.stt) {
                    stt = data.stt + '.' + (this.getTail(this.lstCtietBcao[i].stt) + 1).toString();
                    break;
                }
            }
        }

        if (this.lstCtietBcao.findIndex(e => this.getHead(e.stt) == this.getHead(stt)) == -1) {
            this.sum(stt);
            this.updateEditCache();
        }

        const item: ItemData = {
            id: uuid.v4() + 'FE',
            stt: stt,
            maNhom: khoanMuc.id,
            level: khoanMuc.level,
            tongSo: 0,
            nguonNsnn: 0,
            nguonKhac: 0,
            checked: false,
        };
        this.lstCtietBcao.splice(index + 1, 0, item);
        this.editCache[item.id] = {
            edit: true,
            data: { ...item }
        };
    }
    //xóa dòng
    deleteLine(id: string) {
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
            data: { ...this.lstCtietBcao[index] },
            edit: false
        };
    }

    // luu thay doi
    saveEdit(id: string): void {
        if ((!this.editCache[id].data.nguonNsnn && this.editCache[id].data.nguonNsnn !== 0) ||
            (!this.editCache[id].data.nguonKhac && this.editCache[id].data.nguonKhac !== 0)) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
            return;
        }
        if (this.editCache[id].data.nguonKhac < 0 ||
            this.editCache[id].data.nguonNsnn < 0) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOT_NEGATIVE);
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
        let index: number = this.lstCtietBcao.findIndex(e => e.stt == this.getHead(data.stt));
        if (index == -1) {
            this.allChecked = this.checkAllChild('0');
        } else {
            let nho: boolean = this.lstCtietBcao[index].checked;
            while (nho != this.checkAllChild(this.lstCtietBcao[index].stt)) {
                this.lstCtietBcao[index].checked = !nho;
                index = this.lstCtietBcao.findIndex(e => e.stt == this.getHead(this.lstCtietBcao[index].stt));
                if (index == -1) {
                    this.allChecked = !nho;
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
            if ((this.getHead(item.stt) == str) && (!item.checked) && (item.stt != str)) {
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
    //thêm phần tử đầu tiên khi bảng rỗng
    addFirst(khoanMuc: any) {
        // them moi phan tu
        const item: ItemData = {
            id: uuid.v4() + 'FE',
            stt: '0.1',
            maNhom: khoanMuc.id,
            level: khoanMuc.level,
            tongSo: 0,
            nguonKhac: 0,
            nguonNsnn: 0,
            checked: false,
        };
        this.lstCtietBcao.push(item);
        this.editCache[item.id] = {
            edit: true,
            data: { ...item }
        };
    }

    sortByIndex() {
        this.setDetail();
        this.lstCtietBcao.sort((item1, item2) => {
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
        const lstTemp: ItemData[] = [];
        this.lstCtietBcao.forEach(item => {
            const index: number = lstTemp.findIndex(e => e.stt == this.getHead(item.stt));
            if (index == -1) {
                lstTemp.splice(0, 0, item);
            } else {
                lstTemp.splice(index + 1, 0, item);
            }
        })

        this.lstCtietBcao = lstTemp;
    }

    setDetail() {
        this.lstCtietBcao.forEach(item => {
            item.level = this.noiDungs.find(e => e.id == item.maNhom)?.level;
        })
    }

    addLine(id: string) {
        const maNhom: number = this.lstCtietBcao.find(e => e.id == id)?.maNhom;
        const obj = {
            maKhoanMuc: maNhom,
            lstKhoanMuc: this.noiDungs,
        }

        const modalIn = this.modal.create({
            nzTitle: 'Danh sách nhóm',
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
                const index: number = this.lstCtietBcao.findIndex(e => e.maNhom == res.maKhoanMuc);
                if (index == -1) {
                    const data: any = this.noiDungs.find(e => e.id == res.maKhoanMuc);
                    if (this.lstCtietBcao.length == 0) {
                        this.addFirst(data);
                    } else {
                        this.addSame(id, data);
                    }
                }
                id = this.lstCtietBcao.find(e => e.maNhom == res.maKhoanMuc)?.id;
                res.lstKhoanMuc.forEach(item => {
                    if (this.lstCtietBcao.findIndex(e => e.maNhom == item.id) == -1) {
                        this.addLow(id, item);
                    }
                })
                this.updateEditCache();
            }
        });
    }

    getLowStatus(str: string) {
        const index: number = this.lstCtietBcao.findIndex(e => this.getHead(e.stt) == str);
        if (index == -1) {
            return false;
        }
        return true;
    }

    sum(stt: string) {
        stt = this.getHead(stt);
        while (stt != '0') {
            const index = this.lstCtietBcao.findIndex(e => e.stt == stt);
            const data = this.lstCtietBcao[index];
            this.lstCtietBcao[index] = {
                id: data.id,
                stt: data.stt,
                level: data.level,
                maNhom: data.maNhom,
                tongSo: 0,
                nguonNsnn: 0,
                nguonKhac: 0,
                checked: false,
            }
            this.lstCtietBcao.forEach(item => {
                if (this.getHead(item.stt) == stt) {
                    this.lstCtietBcao[index].nguonKhac = sumNumber([this.lstCtietBcao[index].nguonKhac, item.nguonKhac]);
                    this.lstCtietBcao[index].nguonNsnn = sumNumber([this.lstCtietBcao[index].nguonNsnn, item.nguonNsnn]);
                }
            })
            this.lstCtietBcao[index].tongSo = sumNumber([this.lstCtietBcao[index].nguonKhac, this.lstCtietBcao[index].nguonNsnn]);
            stt = this.getHead(stt);
        }
    }

    changeModel(id: string) {
        this.editCache[id].data.tongSo = sumNumber([this.editCache[id].data.nguonNsnn, this.editCache[id].data.nguonKhac]);
    }
    close() {
        this.router.navigate([
            MAIN_ROUTE_KE_HOACH + '/' + MAIN_ROUTE_DU_TOAN + '/' + LAP_THAM_DINH + '/tim-kiem-phuong-an-qd-cv-giao-so-kiem-tra-nsnn/0'
        ]);
    }

    async taoMoiPhuongAn() {
        const listCtietDvi: any[] = [];
        const listTtCtiet: any[] = [];
        await this.quanLyVonPhiService.maPhuongAn().toPromise().then(
            (res) => {
                if (res.statusCode == 0) {
                    this.maPa = res.data;
                } else {
                    this.notification.error(MESSAGE.ERROR, res?.msg);
                    return;
                }
            },
            (err) => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
                return;
            },
        );

        this.lstBcao.forEach(item => {
            listCtietDvi.push({
                id: uuid.v4() + 'FE',
                maKhuVuc: item.maDvi,
                soTranChi: 0,
                maBcao: item.maBcao,
            })
            listTtCtiet.push({
                id: null,
                maBcao: item.maBcao,
                trangThai: "0",
            })
        })
        const lstCtietBcaoTemp: any[] = [];
        // gui du lieu trinh duyet len server
        this.lstCtietBcao.forEach(item => {
            lstCtietBcaoTemp.push({
                ...item,
                tongSo: item.tongSo,
                nguonNsnn: item.nguonNsnn,
                nguonKhac: item.nguonKhac,
                listCtietDvi: listCtietDvi,
                id: uuid.v4() + 'FE',
            })
        })
        // gui du lieu trinh duyet len server
        const request = {
            id: null,
            idSoTranChi: this.id,
            fileDinhKems: [],
            listIdDeleteFiles: [],
            listCtiet: lstCtietBcaoTemp,
            listTtCtiet: listTtCtiet,
            maDvi: this.maDonViTao,
            maDviTien: this.maDviTien,
            maPa: this.maPa,
            maPaBtc: this.maPaBtc,
            namPa: this.namPa,
            maBcao: this.maBaoCao,
            trangThai: "1",
            thuyetMinh: "",
        };
        this.dataSource.changeData(request);
        this.router.navigate([
            MAIN_ROUTE_KE_HOACH + '/' + MAIN_ROUTE_DU_TOAN + '/' + LAP_THAM_DINH + '/xay-dung-phuong-an-giao-so-kiem-tra-chi-nsnn',
        ])
    }

    async sua() {
        const request = {
            id: this.id,
            maBcao: this.maBaoCao,
        }
        let check = false;
        const trangThais = [Utils.TT_BC_1, Utils.TT_BC_3, Utils.TT_BC_5, Utils.TT_BC_8, Utils.TT_BC_9];
        const capDvi = this.donVis.find(e => e.maDvi == this.maDonViTao)?.capDvi;
        if (capDvi == Utils.TONG_CUC) {
            trangThais.push(Utils.TT_BC_7);
        }
        const requestReport = {
            loaiTimKiem: "0",
            maBcao: this.maBaoCao,
            maDvi: this.maDonViTao,
            paggingReq: {
                limit: 10,
                page: 1,
            },
            trangThais: trangThais,
        };
        await this.quanLyVonPhiService.timBaoCaoLapThamDinh(requestReport).toPromise().then(
            (data) => {
                if (data.statusCode == 0) {
                    if (data.data.content?.length > 0) {
                        check = true;
                    }
                }
            }
        );
        if (!check) {
            this.notification.warning(MESSAGE.WARNING, "Trạng thái bản ghi không được phép sửa");
            return;
        }
        this.quanLyVonPhiService.suaBcao(request).toPromise().then(
            async (data) => {
                if (data.statusCode == 0) {
                    this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
                    this.router.navigate([
                        MAIN_ROUTE_KE_HOACH + '/' + MAIN_ROUTE_DU_TOAN + '/' + LAP_THAM_DINH + '/bao-cao/' + data.data.id,
                    ])
                } else {
                    this.notification.error(MESSAGE.ERROR, data?.msg);
                }
            },
            (err) => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
            },
        );
    }

    displayValue(num: number): string {
        return displayNumber(num);
    }

    changeMoney() {
        if (!this.moneyUnit) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.EXIST_MONEY);
            return;
        }
        this.lstCtietBcao.forEach(item => {
            item.tongSo = exchangeMoney(item.tongSo, this.maDviTien, this.moneyUnit);
            item.nguonNsnn = exchangeMoney(item.nguonNsnn, this.maDviTien, this.moneyUnit);
            item.nguonKhac = exchangeMoney(item.nguonKhac, this.maDviTien, this.moneyUnit);
        })
        this.maDviTien = this.moneyUnit;
        this.updateEditCache();
    }

}
