import { DatePipe, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import * as fileSaver from 'file-saver';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogCopyComponent } from 'src/app/components/dialog/dialog-copy/dialog-copy.component';
import { DialogThemKhoanMucComponent } from 'src/app/components/dialog/dialog-them-khoan-muc/dialog-them-khoan-muc.component';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { displayNumber, divMoney, DON_VI_TIEN, KHOAN_MUC, LA_MA, MONEY_LIMIT, mulMoney, ROLE_CAN_BO, TRANG_THAI_TIM_KIEM, Utils } from 'src/app/Utility/utils';
import * as uuid from 'uuid';
import { DataService } from 'src/app/services/data.service';
import { LAP_THAM_DINH, MAIN_ROUTE_DU_TOAN, MAIN_ROUTE_KE_HOACH } from '../../lap-tham-dinh.constant';


export class ItemData {
    id!: string;
    stt: string;
    level: number;
    maNhom: number;
    tongSo: number;
    listCtietDvi: ItemDvi[] = [];
    checked!: boolean;
}
export class ItemDvi {
    id: string;
    maKhuVuc: string;
    soTranChi: number;
    maBcao: string;
}

export class ItemCongVan {
    fileName: string;
    fileSize: number;
    fileUrl: number;
}
@Component({
    selector: 'app-xay-dung-phuong-an-giao-so-kiem-tra-chi-nsnn',
    templateUrl: './xay-dung-phuong-an-giao-so-kiem-tra-chi-nsnn.component.html',
    styleUrls: ['./xay-dung-phuong-an-giao-so-kiem-tra-chi-nsnn.component.scss',
    ],
})
export class XayDungPhuongAnGiaoSoKiemTraChiNsnnComponent implements OnInit {
    //thong tin dang nhap
    id: string;
    idSoTranChi: string;
    userInfo: any;
    //thong tin chung bao cao
    maBaoCao: string;
    ngayTao: string;
    maDonViTao: string;
    maPa: string;
    maPaBtc: string;
    namPa: number;
    soQdCv: ItemCongVan;
    trangThaiBanGhi = '1';
    newDate = new Date();
    maDviTien: string;
    thuyetMinh: string;
    //danh muc
    lstCtietBcao: ItemData[] = [];
    donVis: any[] = [];
    noiDungs: any[] = KHOAN_MUC;
    donViTiens: any[] = DON_VI_TIEN;
    trangThais: any[] = TRANG_THAI_TIM_KIEM;
    soLaMa: any[] = LA_MA;
    lstDvi: any[] = [];                                         //danh sach don vi da duoc chon
    lstTtCtiet: any[] = [];
    //trang thai cac nut
    status = false;
    statusBtnDel: boolean;
    statusBtnSave: boolean;
    statusBtnApprove: boolean;
    statusBtnTBP: boolean;
    statusBtnLD: boolean;
    statusBtnCopy: boolean;
    statusBtnPrint: boolean;
    statusBtnGiao: boolean;
    statusGiaoToanBo = true;
    statusBtnBtc: boolean;
    allChecked = false;
    //khac
    editCache: { [key: string]: { edit: boolean; data: ItemData } } = {}; // phuc vu nut chinh
    maGiao: string;
    namGiao: number;
    checkGiao = true;
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
        this.maBaoCao = this.routerActive.snapshot.paramMap.get('maBaoCao');
        //lay thong tin user
        this.spinner.show();
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
            this.ngayTao = this.datePipe.transform(this.newDate, Utils.FORMAT_DATE_STR);

            // this.quanLyVonPhiService.maPhuongAn().toPromise().then(
            //     (res) => {
            //         if (res.statusCode == 0) {
            //             this.maPa = res.data;
            //         } else {
            //             this.notification.error(MESSAGE.ERROR, res?.msg);
            //         }
            //     },
            //     (err) => {
            //         this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
            //     },
            // );

            this.namPa = this.newDate.getFullYear();

            await this.dataSource.currentData.subscribe(obj => {
                this.maPa = obj?.maPa;
                this.idSoTranChi = obj?.idSoTranChi;
                this.maPaBtc = obj?.maPaBtc;
                this.namPa = obj?.namPa;
                this.maBaoCao = obj?.maBcao;
                this.maDviTien = obj?.maDviTien;
                this.trangThaiBanGhi = obj?.trangThai;
                this.lstCtietBcao = obj?.listCtiet;
                this.lstTtCtiet = obj?.listTtCtiet;
                this.updateEditCache();
            })
            if (!this.maPa) {
                this.location.back;
            }
        }
        //lay danh sach bao cao duoc tong hop tu
        if (this.maBaoCao) {
            await this.quanLyVonPhiService.danhSachBaoCaoTongHop(this.maBaoCao).toPromise().then(
                data => {
                    if (data.statusCode == 0) {
                        this.lstDvi = data.data;
                    } else {
                        this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
                    }
                },
                err => {
                    this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
                }
            );
        }

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
        if ((this.trangThaiBanGhi == Utils.TT_BC_1 || this.trangThaiBanGhi == Utils.TT_BC_3 || this.trangThaiBanGhi == Utils.TT_BC_5)
            && (ROLE_CAN_BO.includes(userRole))) {
            this.status = false;
        } else {
            this.status = true;
        }
        let checkChirld = false;
        const dVi = this.donVis.find(e => e.maDvi == this.maDonViTao);
        if (dVi && dVi.maDvi == this.userInfo?.dvql) {
            checkChirld = true;
        }
        const utils = new Utils();
        this.statusBtnDel = utils.getRoleDel(this.trangThaiBanGhi, checkChirld, userRole);
        this.statusBtnSave = utils.getRoleSave(this.trangThaiBanGhi, checkChirld, userRole);
        this.statusBtnApprove = utils.getRoleApprove(this.trangThaiBanGhi, checkChirld, userRole);
        this.statusBtnTBP = utils.getRoleTBP(this.trangThaiBanGhi, checkChirld, userRole);
        this.statusBtnLD = utils.getRoleLD(this.trangThaiBanGhi, checkChirld, userRole);
        this.statusBtnCopy = utils.getRoleCopy(this.trangThaiBanGhi, checkChirld, userRole);
        this.statusBtnPrint = utils.getRolePrint(this.trangThaiBanGhi, checkChirld, userRole);
        if (ROLE_CAN_BO.includes(userRole) && this.soQdCv) {
            this.statusBtnGiao = false;
        } else {
            this.statusBtnGiao = true;
            this.statusGiaoToanBo = true;
        }
        const capDvi: string = this.donVis.find(e => e.maDvi == this.userInfo?.dvql)?.capDvi;
        if (capDvi == Utils.TONG_CUC) {
            this.statusBtnBtc = false;
        } else {
            this.statusBtnBtc = true;
        }
    }

    //upload file
    async uploadFile(file: File) {
        // day file len server
        const upfile: FormData = new FormData();
        upfile.append('file', file);
        upfile.append('folder', this.maDonViTao + '/' + this.maPa);
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
                    this.idSoTranChi = data.data.idSoTranChi;
                    this.lstCtietBcao = data.data.listCtiet;
                    this.maDviTien = data.data.maDviTien;
                    this.sortByIndex();
                    this.maDviTien = data.data.maDviTien;
                    this.lstCtietBcao.forEach(item => {
                        item.tongSo = divMoney(item.tongSo, this.maDviTien);
                        item.listCtietDvi.forEach(e => {
                            e.soTranChi = divMoney(e.soTranChi, this.maDviTien);
                        })
                    })
                    this.lstFiles = data.data.lstFiles;
                    this.listFile = [];
                    this.lstTtCtiet = data.data.listTtCtiet;
                    this.lstTtCtiet.forEach(item => {
                        if (item.trangThai == "0") {
                            this.statusGiaoToanBo = false;
                        }
                    })
                    this.maBaoCao = data.data.maBcao;
                    this.namPa = data.data.namPa;
                    this.trangThaiBanGhi = data.data.trangThai;
                    this.maPaBtc = data.data.maPaBtc;
                    this.maPa = data.data.maPa;
                    this.maDonViTao = data.data.maDvi;
                    this.thuyetMinh = data.data.thuyetMinh;
                    this.ngayTao = this.datePipe.transform(data.data.ngayTao, Utils.FORMAT_DATE_STR);
                    this.soQdCv = data.data.soQdCv;
                    this.maGiao = data.data.maGiao;
                    this.namGiao = data.data.namGiao;
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

        const lstCtietBcaoTemp: ItemData[] = [];
        let checkMoneyRange = true;
        // gui du lieu trinh duyet len server
        this.lstCtietBcao.forEach(item => {
            if (mulMoney(item.tongSo, this.maDviTien) > MONEY_LIMIT) {
                checkMoneyRange = false;
                return;
            }
            const data: ItemDvi[] = [];
            item.listCtietDvi.forEach(e => {
                data.push({
                    ...e,
                    soTranChi: mulMoney(e.soTranChi, this.maDviTien),
                })
            })
            lstCtietBcaoTemp.push({
                ...item,
                tongSo: mulMoney(item.tongSo, this.maDviTien),
                listCtietDvi: data,
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
            item.listCtietDvi.forEach(e => {
                if (e.id?.length == 38) {
                    e.id = null;
                }
            })
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
        const request = {
            id: this.id,
            idSoTranChi: this.idSoTranChi,
            fileDinhKems: this.lstFiles,
            listIdDeleteFiles: this.listIdFilesDelete,
            listCtiet: lstCtietBcaoTemp,
            listTtCtiet: this.lstTtCtiet,
            maDvi: this.maDonViTao,
            maDviTien: this.maDviTien,
            maPa: this.maPa,
            namPa: this.namPa,
            namGiao: this.newDate.getFullYear(),
            maBcao: this.maBaoCao,
            maPaBtc: this.maPaBtc,
            trangThai: this.trangThaiBanGhi,
            thuyetMinh: this.thuyetMinh,
            maGiao: this.maGiao,
        };
        this.spinner.show();
        if (!this.id) {
            this.quanLyVonPhiService.themMoiPhuongAn(request).toPromise().then(
                async (data) => {
                    if (data.statusCode == 0) {
                        this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
                        this.router.navigate([
                            MAIN_ROUTE_KE_HOACH + '/' + MAIN_ROUTE_DU_TOAN + '/' + LAP_THAM_DINH + '/xay-dung-phuong-an-giao-so-kiem-tra-chi-nsnn/' + data.data.id,
                        ])
                    } else {
                        this.notification.error(MESSAGE.ERROR, data?.msg);
                    }
                },
                (err) => {
                    this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
                },
            );
        } else {
            this.quanLyVonPhiService.capnhatPhuongAn(request).toPromise().then(
                async (data) => {
                    if (data.statusCode == 0) {
                        this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
                        await this.getDetailReport();
                        this.getStatusButton();
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

    giaoSoTranChi(maBcao: string) {
        const lstGiao: any[] = [];
        const namGiao = new Date().getFullYear();
        if (maBcao) {
            const lstCtiet: any[] = [];
            this.lstCtietBcao.forEach(item => {
                lstCtiet.push({
                    stt: item.stt,
                    maNoiDung: item.maNhom,
                    soTien: item.listCtietDvi.find(e => e.maBcao == maBcao).soTranChi,
                })
            })
            lstGiao.push({
                maPa: this.maPa,
                maGiao: this.maGiao,
                maDviGui: this.maDonViTao,
                maBcao: maBcao,
                namGiao: namGiao,
                maDviNhan: this.lstDvi.find(e => e.maBcao == maBcao)?.maDvi,
                namPa: this.namPa,
                trangThai: '1',
                maDviTien: this.maDviTien,
                soQdCv: this.soQdCv,
                listCtiet: lstCtiet,
            })
        } else {
            this.lstTtCtiet.forEach(item => {
                if (item.trangThai == "0") {
                    const lstCtiet: any[] = [];
                    this.lstCtietBcao.forEach(data => {
                        lstCtiet.push({
                            stt: data.stt,
                            maNoiDung: data.maNhom,
                            soTien: data.listCtietDvi.find(e => e.maBcao == item.maBcao)?.soTranChi,
                        })
                    })
                    lstGiao.push({
                        maPa: this.maPa,
                        maGiao: this.maGiao,
                        maDviGui: this.maDonViTao,
                        namGiao: namGiao,
                        maBcao: item.maBcao,
                        maDviNhan: this.lstDvi.find(e => e.maBcao == item.maBcao)?.maDvi,
                        namPa: this.namPa,
                        trangThai: '1',
                        maDviTien: this.maDviTien,
                        soQdCv: this.soQdCv,
                        listCtiet: lstCtiet,
                    })
                }
            })
        }
        this.spinner.show();
        this.quanLyVonPhiService.giaoSoTranChi(lstGiao).toPromise().then(
            data => {
                if (data.statusCode == 0) {
                    if (maBcao) {
                        this.notification.success(MESSAGE.SUCCESS, MESSAGE.GIAO_SO_TRAN_CHI_SUCCESS);
                        const index: number = this.lstTtCtiet.findIndex(e => e.maBcao == maBcao);
                        this.lstTtCtiet[index].trangThai = "1";
                    } else {
                        this.notification.success(MESSAGE.SUCCESS, MESSAGE.GIAO_SO_TRAN_CHI_TOAN_BO);
                        this.lstTtCtiet.forEach(item => {
                            if (item.trangThai == "0") {
                                item.trangThai = "1";
                            }
                        })
                    }
                } else {
                    this.notification.error(MESSAGE.ERROR, data?.msg);
                }
            },
            err => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
            }
        )
        this.spinner.hide();
    }



    //lay ten don vi tạo
    getUnitName(maDvi: string) {
        return this.donVis.find((item) => item.maDvi == maDvi)?.tenDvi;
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
        const data: ItemDvi[] = [];
        const data1: ItemDvi[] = [];
        this.lstDvi.forEach(item => {
            const mm: ItemDvi = {
                id: uuid.v4() + 'FE',
                maKhuVuc: item.maDvi,
                soTranChi: 0,
                maBcao: item.maBcao,
            }
            const mm1: ItemDvi = {
                id: mm.id,
                maKhuVuc: item.Dvi,
                soTranChi: 0,
                maBcao: item.maBcao,
            }
            data.push(mm);
            data1.push(mm1);
        })
        const item: ItemData = {
            id: uuid.v4() + 'FE',
            stt: head + "." + (tail + 1).toString(),
            maNhom: khoanMuc.id,
            level: khoanMuc.level,
            tongSo: 0,
            listCtietDvi: data,
            checked: false,
        };
        const item1: ItemData = {
            id: item.id,
            stt: item.stt,
            maNhom: khoanMuc.id,
            level: khoanMuc.level,
            tongSo: 0,
            listCtietDvi: data1,
            checked: false,
        };
        this.lstCtietBcao.splice(ind + 1, 0, item);
        this.editCache[item.id] = {
            edit: true,
            data: { ...item1 }
        };
    }

    // gan editCache.data == lstCtietBcao
    updateEditCache(): void {
        this.lstCtietBcao.forEach(item => {
            const data: ItemDvi[] = [];
            item.listCtietDvi.forEach(e => {
                data.push({
                    id: e.id,
                    maKhuVuc: e.maKhuVuc,
                    soTranChi: e.soTranChi,
                    maBcao: e.maBcao,
                });
            })
            this.editCache[item.id] = {
                edit: false,
                data: {
                    id: item.id,
                    stt: item.stt,
                    level: item.level,
                    maNhom: item.maNhom,
                    tongSo: item.tongSo,
                    listCtietDvi: data,
                    checked: false,
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

        const obj: ItemDvi[] = [];
        const obj1: ItemDvi[] = [];
        this.lstDvi.forEach(item => {
            const mm: ItemDvi = {
                id: uuid.v4() + 'FE',
                maKhuVuc: item.maDvi,
                soTranChi: 0,
                maBcao: item.maBcao,
            }
            const mm1: ItemDvi = {
                id: mm.id,
                maKhuVuc: item.Dvi,
                soTranChi: 0,
                maBcao: item.maBcao,
            }
            obj.push(mm);
            obj1.push(mm1);
        })
        const item: ItemData = {
            id: uuid.v4() + 'FE',
            stt: stt,
            maNhom: khoanMuc.id,
            level: khoanMuc.level,
            tongSo: 0,
            listCtietDvi: obj,
            checked: false,
        };
        const item1: ItemData = {
            id: item.id,
            stt: item.stt,
            maNhom: khoanMuc.id,
            level: khoanMuc.level,
            tongSo: 0,
            listCtietDvi: obj1,
            checked: false,
        };
        this.lstCtietBcao.splice(index + 1, 0, item);
        this.editCache[item.id] = {
            edit: true,
            data: { ...item1 }
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
        const data: ItemDvi[] = [];
        this.lstCtietBcao[index].listCtietDvi.forEach(item => {
            data.push({
                id: item.id,
                maKhuVuc: item.maKhuVuc,
                soTranChi: item.soTranChi,
                maBcao: item.maBcao,
            })
        })
        this.editCache[id] = {
            data: {
                ...this.lstCtietBcao[index],
                listCtietDvi: data,
            },
            edit: false
        };
    }

    // luu thay doi
    saveEdit(id: string): void {
        let checkNull = true;
        let checkNegative = true;
        this.editCache[id].data.listCtietDvi.forEach(item => {
            if (!item.soTranChi && item.soTranChi !== 0) {
                checkNull = false;
            }
            if (item.soTranChi < 0) {
                checkNegative = false;
            }
        })
        if (!checkNull) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
            return;
        }
        if (!checkNegative) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOT_NEGATIVE);
            return;
        }
        this.editCache[id].data.checked = this.lstCtietBcao.find(item => item.id === id).checked; // set checked editCache = checked lstCtietBcao
        const index = this.lstCtietBcao.findIndex(item => item.id === id); // lay vi tri hang minh sua
        const data: ItemDvi[] = [];
        this.editCache[id].data.listCtietDvi.forEach(item => {
            data.push({
                id: item.id,
                maKhuVuc: item.maKhuVuc,
                soTranChi: item.soTranChi,
                maBcao: item.maBcao,
            })
        })
        this.lstCtietBcao[index] = {
            ...this.editCache[id].data,
            listCtietDvi: data,
        }
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
    //thêm phần tử đầu tiên khi bảng rỗng
    addFirst(khoanMuc: any) {
        // them moi phan tu
        const data: ItemDvi[] = [];
        const data1: ItemDvi[] = [];
        this.lstDvi.forEach(item => {
            const mm: ItemDvi = {
                id: uuid.v4() + 'FE',
                maKhuVuc: item.maDvi,
                soTranChi: 0,
                maBcao: item.maBcao,
            }
            const mm1: ItemDvi = {
                id: mm.id,
                maKhuVuc: item.Dvi,
                soTranChi: 0,
                maBcao: item.maBcao,
            }
            data.push(mm);
            data1.push(mm1);
        })
        const item: ItemData = {
            id: uuid.v4() + 'FE',
            stt: '0.1',
            maNhom: khoanMuc.id,
            level: khoanMuc.level,
            tongSo: 0,
            listCtietDvi: data,
            checked: false,
        };
        const item1: ItemData = {
            id: item.id,
            stt: item.stt,
            maNhom: khoanMuc.id,
            level: khoanMuc.level,
            tongSo: 0,
            listCtietDvi: data1,
            checked: false,
        };
        this.lstCtietBcao.push(item);
        this.editCache[item.id] = {
            edit: true,
            data: { ...item1 }
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
            const mm: any[] = [];
            data.listCtietDvi.forEach(item => {
                mm.push({
                    ...item,
                    soTranChi: 0,
                })
            })
            this.lstCtietBcao[index] = {
                id: data.id,
                stt: data.stt,
                level: data.level,
                maNhom: data.maNhom,
                tongSo: 0,
                listCtietDvi: mm,
                checked: false,
            }
            this.lstCtietBcao.forEach(item => {
                if (this.getHead(item.stt) == stt) {
                    item.listCtietDvi.forEach(e => {
                        const ind = this.lstCtietBcao[index].listCtietDvi.findIndex(i => i.maBcao == e.maBcao);
                        this.lstCtietBcao[index].listCtietDvi[ind].soTranChi += e.soTranChi;
                    })
                }
            })
            this.lstCtietBcao[index].listCtietDvi.forEach(item => {
                this.lstCtietBcao[index].tongSo += item.soTranChi;
            })
            stt = this.getHead(stt);
        }
    }

    changeModel(id: string) {
        this.editCache[id].data.tongSo = 0;
        this.editCache[id].data.listCtietDvi.forEach(item => {
            this.editCache[id].data.tongSo += item.soTranChi;
        })
    }

    close() {
        this.router.navigate([
            MAIN_ROUTE_KE_HOACH + '/' + MAIN_ROUTE_DU_TOAN + '/' + LAP_THAM_DINH + '/tim-kiem-phuong-an-qd-cv-giao-so-kiem-tra-nsnn/1'
        ]);
    }

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

    async doCopy() {
        let maPaNew: string;
        await this.quanLyVonPhiService.maPhuongAn().toPromise().then(
            (data) => {
                if (data.statusCode == 0) {
                    maPaNew = data.data;
                } else {
                    this.notification.error(MESSAGE.ERROR, data?.msg);
                    return;
                }
            },
            (err) => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
                return;
            }
        );
        const lstCtietBcaoTemp: ItemData[] = [];
        // gui du lieu trinh duyet len server
        this.lstCtietBcao.forEach(item => {
            const data: ItemDvi[] = [];
            item.listCtietDvi.forEach(e => {
                data.push({
                    ...e,
                    soTranChi: mulMoney(e.soTranChi, this.maDviTien),
                    id: null,
                })
            })
            lstCtietBcaoTemp.push({
                ...item,
                tongSo: mulMoney(item.tongSo, this.maDviTien),
                listCtietDvi: data,
                id: null,
            })
        })

        const lstTtCtietTemp: any[] = [];
        if (lstCtietBcaoTemp.length > 0) {
            const item = lstCtietBcaoTemp[0];
            item.listCtietDvi.forEach(e => {
                lstTtCtietTemp.push({
                    id: null,
                    maBcao: e.maBcao,
                    trangThai: "0",
                })
            })
        }

        const request = {
            id: null,
            fileDinhKems: [],
            listIdDeleteFiles: [],
            listCtiet: lstCtietBcaoTemp,
            listTtCtiet: lstTtCtietTemp,
            idSoTranChi: this.idSoTranChi,
            maDvi: this.maDonViTao,
            maDviTien: this.maDviTien,
            maPa: maPaNew,
            namPa: this.namPa,
            maPaBtc: this.maPaBtc,
            maBcao: this.maBaoCao,
            trangThai: "1",
            thuyetMinh: "",
            maGiao: "",
        };

        this.quanLyVonPhiService.themMoiPhuongAn(request).toPromise().then(
            async data => {
                if (data.statusCode == 0) {
                    const modalCopy = this.modal.create({
                        nzTitle: MESSAGE.ALERT,
                        nzContent: DialogCopyComponent,
                        nzMaskClosable: false,
                        nzClosable: false,
                        nzWidth: '900px',
                        nzFooter: null,
                        nzComponentParams: {
                            maBcao: maPaNew
                        },
                    });
                } else {
                    this.notification.error(MESSAGE.ERROR, data?.msg);
                }
            },
            err => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
            },
        );
    }

    xemCtietSoTranChi() {
        if (!this.idSoTranChi) {
            return;
        }
        const capDvi = this.donVis.find(e => e.maDvi == this.maDonViTao)?.capDvi;
        let url: string;
        if (capDvi == Utils.TONG_CUC) {
            url = MAIN_ROUTE_KE_HOACH + '/' + MAIN_ROUTE_DU_TOAN + '/' + LAP_THAM_DINH + '/so-kiem-tra-tran-chi-tu-btc/' + this.idSoTranChi;
        } else {
            url = MAIN_ROUTE_KE_HOACH + '/' + MAIN_ROUTE_DU_TOAN + '/' + LAP_THAM_DINH + '/so-kiem-tra-chi-nsnn/' + this.idSoTranChi;
        }
        window.open(url, '_blank');
    }

    displayValue(num: number): string {
        return displayNumber(num);
    }


}
