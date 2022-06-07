import { DatePipe, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import * as fileSaver from 'file-saver';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { DON_VI_TIEN, KHOAN_MUC, LA_MA, mulMoney, TRANG_THAI_GIAO, Utils } from 'src/app/Utility/utils';

export class ItemData {
    id: any;
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
    id!: any;
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
    maDviTien: any;
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

    constructor(
        private userService: UserService,
        private quanLyVonPhiService: QuanLyVonPhiService,
        private spinner: NgxSpinnerService,
        private routerActive: ActivatedRoute,
        private datepipe: DatePipe,
        private sanitizer: DomSanitizer,
        private router: Router,
        private notification: NzNotificationService,
        private location: Location,
        private danhMucService: DanhMucHDVService,
    ) { }

    async ngOnInit() {
        this.id = this.routerActive.snapshot.paramMap.get('id');
        let userName = this.userService.getUserName();
        await this.getUserInfo(userName); //get user info

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
    }

    getStatusButtom() {
        if (this.maDviNhan == this.userInfo?.dvql) {
            this.statusBtnEx = false;
            if (this.lstBcao.length == 0) {
                this.statusBtnEdit = false;
                this.statusBtnNew = true;
            } else {
                this.statusBtnEdit = true;
                this.statusBtnNew = false;
            }
        } else {
            this.statusBtnEx = true;
            this.statusBtnEdit = true;
            this.statusBtnNew = true;
        }

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
                this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
            }
        );
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
            let file: any = this.fileDetail;
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
        var lstTemp: any[] = [];
        this.lstCtietBcao.forEach(item => {
            var index: number = lstTemp.findIndex(e => e.stt == this.getHead(item.stt));
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
        let listCtietDvi: any[] = [];
        let listTtCtiet: any[] = [];
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
                id: null,
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
        let lstCtietBcaoTemp: any[] = [];
        // gui du lieu trinh duyet len server
        this.lstCtietBcao.forEach(item => {
            lstCtietBcaoTemp.push({
                ...item,
                maNhom: item.maNoiDung,
                tongSo: mulMoney(item.soTien, this.maDviTien),
                listCtietDvi: listCtietDvi,
                id: null,
            })
        })

        lstCtietBcaoTemp.forEach(item => {
            if (item.id?.length == 38) {
                item.id = null;
            }
        });

        // gui du lieu trinh duyet len server
        let request = {
            id: null,
            fileDinhKems: [],
            listIdDeleteFiles: [],
            listCtiet: lstCtietBcaoTemp,
            listTtCtiet: listTtCtiet,
            maDvi: this.maDviNhan,
            maDviTien: this.maDviTien,
            maPa: this.maPa,
            maPaBtc: "",
            namPa: this.newDate.getFullYear(),
            maBcao: this.maBaoCao,
            trangThai: "1",
            thuyetMinh: "",
        };
        this.spinner.show();
        this.quanLyVonPhiService.themMoiPhuongAn(request).toPromise().then(
            async (data) => {
                if (data.statusCode == 0) {
                    this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
                    this.router.navigate([
                        '/qlkh-von-phi/quan-ly-lap-tham-dinh-du-toan-nsnn/xay-dung-phuong-an-giao-so-kiem-tra-chi-nsnn/' + data.data.id,
                    ])
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

    sua() {
        let request = {
            id: this.id,
            maBcao: this.maBaoCao,
        }
        this.quanLyVonPhiService.suaBcao(request).toPromise().then(
            async (data) => {
                if (data.statusCode == 0) {
                    this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
                    this.router.navigate([
                        '/qlkh-von-phi/quan-ly-lap-tham-dinh-du-toan-nsnn/bao-cao/' + data.data.id,
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
}
