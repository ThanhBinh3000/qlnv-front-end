import { DatePipe, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as fileSaver from 'file-saver';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { DataService } from 'src/app/services/data.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { displayNumber, DON_VI_TIEN, exchangeMoney, KHOAN_MUC, LA_MA, LTD, TRANG_THAI_GIAO, Utils } from 'src/app/Utility/utils';
import * as uuid from 'uuid';
import { LAP_THAM_DINH, MAIN_ROUTE_DU_TOAN, MAIN_ROUTE_KE_HOACH } from '../../lap-tham-dinh.constant';
export class ItemData {
    id: string;
    stt: string;
    level: number;
    maNoiDung: string;
    soTien: number;
}

export class ItemCongVan {
    fileName: string;
    fileSize: number;
    fileUrl: number;
}

@Component({
    selector: 'app-so-kiem-tra-chi-nsnn',
    templateUrl: './so-kiem-tra-chi-nsnn.component.html',
    styleUrls: ['./so-kiem-tra-chi-nsnn.component.scss']
})
export class SoKiemTraChiNsnnComponent implements OnInit {
    //thong tin dang nhap
    id!: string;
    userInfo: any;
    //thong tin chung bao cao
    ngayNhap: string;
    maBaoCao: string;
    soQdCv: ItemCongVan;
    maDviTao: string;
    maDviNhan: string;
    maPa: string;
    maGiao: string;
    trangThai: string;
    namGiao: number;
    maDviTien: string;
    newDate = new Date();
    //danh muc
    donViTiens: any[] = DON_VI_TIEN;
    lstCtietBcao: ItemData[] = [];
    lstBcao: any[] = [];
    donVis: any[] = [];
    trangThais: any[] = TRANG_THAI_GIAO;
    noiDungs: any[] = KHOAN_MUC;
    soLaMa: any[] = LA_MA;
    //file
    fileDetail: NzUploadFile;
    //trang thai
    statusBtnEdit: boolean;
    statusBtnNew: boolean;
    statusBtnEx: boolean;
    editMoneyUnit = false;

    constructor(
        private userService: UserService,
        private quanLyVonPhiService: QuanLyVonPhiService,
        private spinner: NgxSpinnerService,
        private routerActive: ActivatedRoute,
        private datepipe: DatePipe,
        private router: Router,
        private notification: NzNotificationService,
        private location: Location,
        private danhMucService: DanhMucHDVService,
        private dataSource: DataService,
    ) { }

    async ngOnInit() {
        this.spinner.show();
        this.id = this.routerActive.snapshot.paramMap.get('id');
        this.userInfo = this.userService.getUserLogin();

        //lay danh sach danh muc
        this.danhMucService.dMDonVi().toPromise().then(
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
        await this.getDetailReport();

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


        this.getStatusButtom();
        this.spinner.hide();
    }

    getStatusButtom() {
        if (this.maDviNhan == this.userInfo?.MA_DVI) {
            this.statusBtnEx = !this.userService.isAccessPermisson(LTD.EDIT_REPORT_AFTER_RECEIVE_SKT);
            this.statusBtnNew = !(this.userService.isAccessPermisson(LTD.ADD_PA_GIAO_SKT) && this.lstBcao.length != 0);
            this.statusBtnEdit = !(this.userService.isAccessPermisson(LTD.EDIT_REPORT_AFTER_RECEIVE_SKT) && this.lstBcao.length == 0);
            // if (this.lstBcao.length == 0) {
            //     this.statusBtnEdit = false;
            //     this.statusBtnNew = true;
            // } else {
            //     this.statusBtnEdit = true;
            //     this.statusBtnNew = false;
            // }
        } else {
            this.statusBtnEx = true;
            this.statusBtnEdit = true;
            this.statusBtnNew = true;
        }

        // if (!ROLE_CAN_BO.includes(this.userInfo?.roles[0]?.code)) {
        //     this.statusBtnEdit = true;
        //     this.statusBtnNew = true;
        //     this.statusBtnEx = true;
        // }

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
        this.spinner.show();
        await this.quanLyVonPhiService.ctietGiaoSoTranChi(this.id).toPromise().then(
            async (data) => {
                if (data.statusCode == 0) {
                    this.lstCtietBcao = data.data.listCtiet;
                    this.sortByIndex();
                    this.maBaoCao = data.data.maBcao;
                    this.maDviTien = data.data.maDviTien;
                    this.soQdCv = data.data.fileSoQdCv;
                    this.maPa = data.data.maPa;
                    this.maGiao = data.data.maGiao;
                    this.namGiao = data.data.namGiao;
                    this.maDviNhan = data.data.maDviNhan;
                    this.ngayNhap = this.datepipe.transform(data.data.ngayTao, Utils.FORMAT_DATE_STR);
                    this.maDviTao = data.data.maDviGui;
                    this.trangThai = data.data.trangThai;
                } else {
                    this.notification.error(MESSAGE.ERROR, data?.msg);
                }
            },
            (err) => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
            },
        );
        this.spinner.hide();
    }

    redirectkehoachvonphi() {
        this.location.back();
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
            item.level = this.noiDungs.find(e => e.id == item.maNoiDung)?.level;
        })
    }


    //lay ten don vi tạo
    getUnitName() {
        return this.donVis.find((item) => item.maDvi == this.maDviTao)?.tenDvi;
    }

    getStatusName() {
        return this.trangThais.find(e => e.id == this.trangThai)?.tenDm;
    }

    async taoMoiPhuongAn() {
        const listCtietDvi: any[] = [];
        const listTtCtiet: any[] = [];
        let maPaNew: string;
        await this.quanLyVonPhiService.maPhuongAn().toPromise().then(
            (res) => {
                if (res.statusCode == 0) {
                    maPaNew = res.data;
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
                maNhom: item.maNoiDung,
                tongSo: item.soTien,
                listCtietDvi: listCtietDvi,
                id: uuid.v4() + 'FE',
            })
        })

        // gui du lieu trinh duyet len server
        const request = {
            id: null,
            idSoTranChi: this.id,
            listCtiet: lstCtietBcaoTemp,
            listTtCtiet: listTtCtiet,
            maDvi: this.maDviNhan,
            maDviTien: '1',
            maPa: maPaNew,
            maPaBtc: this.maPa,
            namPa: this.newDate.getFullYear(),
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
        if (this.userService.isTongCuc()) {
            trangThais.push(Utils.TT_BC_7);
        }
        const requestReport = {
            loaiTimKiem: "0",
            maBcao: this.maBaoCao,
            maDvi: this.userInfo?.MA_DVI,
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
                    this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
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
        num = exchangeMoney(num, '1', this.maDviTien);
        return displayNumber(num);
    }

    getMoneyUnit() {
        return this.donViTiens.find(e => e.id == this.maDviTien)?.tenDm;
    }
}
