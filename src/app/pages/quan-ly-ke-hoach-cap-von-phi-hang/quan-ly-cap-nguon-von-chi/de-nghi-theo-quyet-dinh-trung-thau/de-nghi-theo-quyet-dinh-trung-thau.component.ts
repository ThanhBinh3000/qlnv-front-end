import { DatePipe, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import * as fileSaver from 'file-saver';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogLuaChonThemDonViComponent } from 'src/app/components/dialog/dialog-lua-chon-them-don-vi/dialog-lua-chon-them-don-vi.component';
import { DialogThemKhoanMucComponent } from 'src/app/components/dialog/dialog-them-khoan-muc/dialog-them-khoan-muc.component';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { divMoney, DON_VI_TIEN, KHOAN_MUC, LA_MA, MONEY_LIMIT, mulMoney, TRANG_THAI_TIM_KIEM, Utils } from 'src/app/Utility/utils';
import * as uuid from 'uuid';

export class ItemCongVan {
    fileName: string;
    fileSize: number;
    fileUrl: number;
}

@Component({
    selector: 'app-de-nghi-theo-quyet-dinh-trung-thau',
    templateUrl: './de-nghi-theo-quyet-dinh-trung-thau.component.html',
    styleUrls: ['./de-nghi-theo-quyet-dinh-trung-thau.component.scss',
    ],
})
export class DeNghiTheoQuyetDinhTrungThauComponent implements OnInit {
    //thong tin dang nhap
    id: any;
    userInfo: any;
    //thong tin chung bao cao
    maDeNghi: string;
    qdChiTieu: string;
    qdTrungThau: string;
    loaiDn: string;
    congVan: ItemCongVan;
    ngayTao: string;
    ngayTrinhDuyet: string;
    ngayPheDuyet: string;
    trangThai: string; 
    maDviTao: string;
    thuyetMinh: string;
    tongTien: number;
    kphiDaCap: number;
    yeuCauCapThem: number; 
    newDate = new Date();
    //danh muc
    lstCtietBcao: any[] = [];
    donVis: any[] = [];
    //trang thai cac nut
    status: boolean = false;
    statusBtnDel: boolean;
    statusBtnSave: boolean;
    statusBtnApprove: boolean;
    statusBtnTBP: boolean;
    statusBtnLD: boolean;
    statusBtnCopy: boolean;
    statusBtnPrint: boolean;
    allChecked = false;
    //khac
    fileDetail: NzUploadFile;

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
    ) { }

    async ngOnInit() {
        //lay id cua ban ghi
        this.id = this.routerActive.snapshot.paramMap.get('id');
        //lay thong tin user
        let userName = this.userService.getUserName();
        await this.getUserInfo(userName);
        //lay danh sach danh muc
        await this.danhMuc.dMDonVi().toPromise().then(
            (res) => {
                if (res.statusCode == 0) {
                    this.donVis = res.data;
                } else {
                    this.notification.error(MESSAGE.ERROR, res?.msg);
                }
            },
            (err) => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
            },
        );
        if (this.id) {
            await this.getDetailReport();
        } else {
            this.trangThai = '1';
            this.maDviTao = this.userInfo?.dvql;
            this.ngayTao = this.datePipe.transform(this.newDate, Utils.FORMAT_DATE_STR);
            this.spinner.show();
            this.quanLyVonPhiService.maPhuongAn().toPromise().then(
                (res) => {
                    if (res.statusCode == 0) {
                        this.maDeNghi = res.data;
                    } else {
                        this.notification.error(MESSAGE.ERROR, res?.msg);
                    }
                },
                (err) => {
                    this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
                },
            );
        }
        this.getStatusButton();
        this.spinner.hide();

    }

    redirectkehoachvonphi() {
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
        let checkChirld = false;
        let dVi = this.donVis.find(e => e.maDvi == this.maDeNghi);
        if (dVi && dVi.maDvi == this.userInfo?.dvql) {
            checkChirld = true;
        }
        const utils = new Utils();
        this.statusBtnDel = utils.getRoleDel(this.trangThai, checkChirld, this.userInfo?.roles[0]?.code);
        this.statusBtnSave = utils.getRoleSave(this.trangThai, checkChirld, this.userInfo?.roles[0]?.code);
        this.statusBtnApprove = utils.getRoleApprove(this.trangThai, checkChirld, this.userInfo?.roles[0]?.code);
        this.statusBtnTBP = utils.getRoleTBP(this.trangThai, checkChirld, this.userInfo?.roles[0]?.code);
        this.statusBtnLD = utils.getRoleLD(this.trangThai, checkChirld, this.userInfo?.roles[0]?.code);
        this.statusBtnCopy = utils.getRoleCopy(this.trangThai, checkChirld, this.userInfo?.roles[0]?.code);
        this.statusBtnPrint = utils.getRolePrint(this.trangThai, checkChirld, this.userInfo?.roles[0]?.code);
    }

    //download file về máy tính
    async downloadFileCv() {
        if (this.congVan?.fileUrl) {
            await this.quanLyVonPhiService.downloadFile(this.congVan?.fileUrl).toPromise().then(
                (data) => {
                    fileSaver.saveAs(data, this.congVan?.fileName);
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
        await this.quanLyVonPhiService.ctietPhuongAn(this.id).toPromise().then(
            async (data) => {
                if (data.statusCode == 0) {
                    this.id = data.data.id;
                    this.lstCtietBcao = data.data.listCtiet;
                    this.maDeNghi = data.data.maDeNghi;
                    this.qdChiTieu = data.data.qdChiTieu;
                    this.qdTrungThau = data.data.qdTrungThau;
                    this.loaiDn = data.data.loaiDn;
                    this.congVan = data.data.congVan;
                    this.ngayTao = this.datePipe.transform(data.data.ngayTao, Utils.FORMAT_DATE_STR);
                    this.ngayTrinhDuyet = this.datePipe.transform(data.data.ngayTrinhDuyet, Utils.FORMAT_DATE_STR);
                    this.ngayPheDuyet = this.datePipe.transform(data.data.ngayPheDuyet, Utils.FORMAT_DATE_STR);
                    this.trangThai = data.data.trangThai;
                    if (
                        this.trangThai == Utils.TT_BC_1 ||
                        this.trangThai == Utils.TT_BC_3 ||
                        this.trangThai == Utils.TT_BC_5 ||
                        this.trangThai == Utils.TT_BC_8
                    ) {
                        this.status = false;
                    } else {
                        this.status = true;
                    }
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
                    this.trangThai = mcn;
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
        // gui du lieu trinh duyet len server
        let request = {
            id: this.id,
            fileDinhKems: [],
            listCtiet: this.lstCtietBcao,
            maDvi: this.maDviTao,
            maDeNghi: this.maDeNghi,
            trangThai: this.trangThai,
            thuyetMinh: this.thuyetMinh,
        };
        this.spinner.show();
        if (!this.id) {
            this.quanLyVonPhiService.themMoiPhuongAn(request).toPromise().then(
                async (data) => {
                    if (data.statusCode == 0) {
                        this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
                        if (!this.id) {
                            this.router.navigate([
                                '/qlkh-von-phi/quan-ly-lap-tham-dinh-du-toan-nsnn/xay-dung-phuong-an-giao-so-kiem-tra-chi-nsnn/' + data.data.id,
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
        return this.donVis.find((item) => item.maDvi == this.maDviTao)?.tenDvi;
    }

    getStatusName() {
        const utils = new Utils();
        return utils.getStatusName(this.trangThai);
    }

    

    close() {
        this.location.back();
    }



}
