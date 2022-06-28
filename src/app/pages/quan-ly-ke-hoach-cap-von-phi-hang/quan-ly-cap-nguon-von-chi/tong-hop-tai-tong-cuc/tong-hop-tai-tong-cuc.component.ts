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
import { DialogDoCopyComponent } from 'src/app/components/dialog/dialog-do-copy/dialog-do-copy.component';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { DataService } from 'src/app/pages/quan-ly-ke-hoach-von-phi/quan-ly-cap-von-mua-ban-tt-tien-hang-dtqg/data.service';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { divMoney, DON_VI_TIEN, MONEY_LIMIT, mulMoney, NGUON_BAO_CAO, ROLE_CAN_BO, Utils } from 'src/app/Utility/utils';
import * as uuid from 'uuid';

export class ItemData {
    id: any;
    maCucKv: string;
    vonCapThoc: number;
    vonUngThoc: number;
    tongSoThoc: number;
    giaoDuToanGao: number;
    vonCapGao: number;
    vonUngGao: number;
    tongSoGao: number;
    giaoDuToanMuoi: number;
    vonCapMuoi: number;
    vonUngMuoi: number;
    tongSoMuoi: number;
    capVonVttb: number;
    tcGiaoVonHoanUngNam: number;
    checked: boolean;
}

export class ItemCongVan {
    fileName: string;
    fileSize: number;
    fileUrl: number;
}

@Component({
    selector: 'app-tong-hop-tai-tong-cuc',
    templateUrl: './tong-hop-tai-tong-cuc.component.html',
    styleUrls: ['./tong-hop-tai-tong-cuc.component.scss',
    ],
})
export class TongHopTaiTongCucComponent implements OnInit {
    //thong tin dang nhap
    id: any;
    userInfo: any;
    loai: any;
    //thong tin chung bao cao
    maDeNghi: string;
    qdChiTieu: string;
    nguonBcao: string = Utils.THOP_TAI_TC;
    congVan: ItemCongVan;
    ngayTao: string;
    ngayTrinhDuyet: string;
    ngayDuyet: string;
    ngayPheDuyet: string;
    trangThai: string;
    maDviTao: string;
    thuyetMinh: string;
    lyDoTuChoi: string;
    maDviTien: string;
    tongSo: ItemData = {
        id: null,
        maCucKv: "",
        vonCapThoc: 0,
        vonUngThoc: 0,
        tongSoThoc: 0,
        giaoDuToanGao: 0,
        vonCapGao: 0,
        vonUngGao: 0,
        tongSoGao: 0,
        giaoDuToanMuoi: 0,
        vonCapMuoi: 0,
        vonUngMuoi: 0,
        tongSoMuoi: 0,
        capVonVttb: 0,
        tcGiaoVonHoanUngNam: 0,
        checked: false,
    };
    newDate = new Date();
    //danh muc
    lstCtietBcao: ItemData[] = [];
    donVis: any[] = [];
    cucKhuVucs: any[] = [];
    dviTinhs: any[] = [];
    trangThais: any[] = [
        {
			id: Utils.TT_BC_1,
			tenDm: "Đang soạn",
		},
		{
			id: Utils.TT_BC_2,
			tenDm: "Trình duyệt",
		},
		{
			id: Utils.TT_BC_3,
			tenDm: "Trưởng BP từ chối",
		},
		{
			id: Utils.TT_BC_4,
			tenDm: "Trưởng BP duyệt",
		},
		{
			id: Utils.TT_BC_5,
			tenDm: "Lãnh đạo từ chối",
		},
		{
			id: Utils.TT_BC_7,
			tenDm: "Lãnh đạo phê duyệt",
		},
    ]
    nguonBcaos: any[] = NGUON_BAO_CAO;
    dviTiens: any[] = DON_VI_TIEN;
    lstFiles: any[] = []; //show file ra man hinh
    //trang thai cac nut
    status: boolean = false;
    statusBtnDel: boolean;
    statusBtnSave: boolean = true;                      // trang thai an/hien nut luu
    statusBtnApprove: boolean = true;                   // trang thai an/hien nut trinh duyet
    statusBtnTBP: boolean = true;                       // trang thai an/hien nut truong bo phan
    statusBtnLD: boolean = true;                        // trang thai an/hien nut lanh dao
    statusBtnCopy: boolean = true;                      // trang thai copy
    //file
    listFile: File[] = [];                      // list file chua ten va id de hien tai o input
    fileList: NzUploadFile[] = [];
    fileDetail: NzUploadFile;
    listIdFilesDelete: any = [];

    // before uploaf file
    beforeUpload = (file: NzUploadFile): boolean => {
        this.fileList = this.fileList.concat(file);
        return false;
    };

    // before uploaf file
    beforeUploadCV = (file: NzUploadFile): boolean => {
        this.fileDetail = file;
        this.congVan = {
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

    //khac 
    allChecked = false;                         // check all checkbox
    indeterminate = true;                       // properties allCheckBox
    editCache: { [key: string]: { edit: boolean; data: ItemData } } = {};     // phuc vu nut chinh

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
        this.loai = this.routerActive.snapshot.paramMap.get('loai');
        this.id = this.routerActive.snapshot.paramMap.get('id');
        //lay thong tin user
        let userName = this.userService.getUserName();
        await this.getUserInfo(userName);
        //lay danh sach danh muc
        await this.danhMuc.dMDonVi().toPromise().then(
            (res) => {
                if (res.statusCode == 0) {
                    this.donVis = res.data;
                    this.cucKhuVucs = this.donVis.filter(e => e?.maDviCha == this.userInfo?.dvql);
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
            await this.dataSource.currentData.subscribe(obj => {
                this.qdChiTieu = obj?.qdChiTieu;
            })
            if (!this.qdChiTieu) {
                this.close();
            }
            this.ngayTao = this.datePipe.transform(this.newDate, Utils.FORMAT_DATE_STR);
            this.cucKhuVucs.forEach(item => {
                this.lstCtietBcao.push({
                    id: uuid.v4() + "FE",
                    maCucKv: item.maDvi,
                    vonCapThoc: 0,
                    vonUngThoc: 0,
                    tongSoThoc: 0,
                    giaoDuToanGao: 0,
                    vonCapGao: 0,
                    vonUngGao: 0,
                    tongSoGao: 0,
                    giaoDuToanMuoi: 0,
                    vonCapMuoi: 0,
                    vonUngMuoi: 0,
                    tongSoMuoi: 0,
                    capVonVttb: 0,
                    tcGiaoVonHoanUngNam: 0,
                    checked: false,
                })
            })
            this.updateEditCache();
            this.spinner.show();
            this.quanLyVonPhiService.maDeNghi().toPromise().then(
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
        let userRole = this.userInfo?.roles[0]?.code;
        if ((this.trangThai == Utils.TT_BC_1 || this.trangThai == Utils.TT_BC_3 || this.trangThai == Utils.TT_BC_5)
            && (ROLE_CAN_BO.includes(userRole))) {
            this.status = false;
        } else {
            this.status = true;
        }
        let checkParent = false;
        let checkChirld = false;
        let dVi = this.donVis.find(e => e.maDvi == this.maDviTao);
        if (dVi && dVi.maDvi == this.userInfo.dvql) {
            checkChirld = true;
        }
        if (dVi && dVi.maDviCha == this.userInfo.dvql) {
            checkParent = true;
        }
        const utils = new Utils();
        this.statusBtnSave = utils.getRoleSave(this.trangThai, checkChirld, userRole);
        this.statusBtnApprove = utils.getRoleApprove(this.trangThai, checkChirld, userRole);
        this.statusBtnTBP = utils.getRoleTBP(this.trangThai, checkChirld, userRole);
        this.statusBtnLD = utils.getRoleLD(this.trangThai, checkChirld, userRole);
        this.statusBtnCopy = utils.getRoleCopy(this.trangThai, checkChirld, userRole);
    }

    //upload file
    async uploadFile(file: File) {
        // day file len server
        const upfile: FormData = new FormData();
        upfile.append('file', file);
        upfile.append('folder', this.maDviTao + '/' + this.maDeNghi);
        let temp = await this.quanLyVonPhiService.uploadFile(upfile).toPromise().then(
            (data) => {
                let objfile = {
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
        let file!: File;
        file = this.listFile.find(element => element?.lastModified.toString() == id);
        if (!file) {
            let fileAttach = this.lstFiles.find(element => element?.id == id);
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
        await this.quanLyVonPhiService.ctietDeNghiThop(this.id).toPromise().then(
            async (data) => {
                if (data.statusCode == 0) {
                    this.id = data.data.id;
                    this.total(-1, this.tongSo);
                    this.maDviTao = data.data.maDvi;
                    this.lstCtietBcao = data.data.thopTcCtiets;
                    this.maDviTien = data.data.maDviTien;
                    this.lstCtietBcao.forEach(item => {
                        item.vonCapThoc = divMoney(item.vonCapThoc, this.maDviTien);
                        item.vonUngThoc = divMoney(item.vonUngThoc, this.maDviTien);
                        item.tongSoThoc = divMoney(item.tongSoThoc, this.maDviTien);
                        item.giaoDuToanGao = divMoney(item.giaoDuToanGao, this.maDviTien);
                        item.vonCapGao = divMoney(item.vonCapGao, this.maDviTien);
                        item.vonUngGao = divMoney(item.vonUngGao, this.maDviTien);
                        item.tongSoGao = divMoney(item.tongSoGao, this.maDviTien);
                        item.giaoDuToanMuoi = divMoney(item.giaoDuToanMuoi, this.maDviTien);
                        item.vonCapMuoi = divMoney(item.vonCapMuoi, this.maDviTien);
                        item.vonUngMuoi = divMoney(item.vonUngMuoi, this.maDviTien);
                        item.tongSoMuoi = divMoney(item.tongSoMuoi, this.maDviTien);
                        item.capVonVttb = divMoney(item.capVonVttb, this.maDviTien);
                        item.tcGiaoVonHoanUngNam = divMoney(item.tcGiaoVonHoanUngNam, this.maDviTien);
                    })
                    this.lstCtietBcao.forEach(item => {
                        this.total(1, item);
                    })
                    this.updateEditCache();
                    this.maDeNghi = data.data.maDnghi;
                    this.qdChiTieu = data.data.soQdChiTieu;
                    this.congVan = data.data.congVan;
                    this.ngayTao = this.datePipe.transform(data.data.ngayTao, Utils.FORMAT_DATE_STR);
                    this.ngayTrinhDuyet = this.datePipe.transform(data.data.ngayTrinh, Utils.FORMAT_DATE_STR);
                    this.ngayDuyet = this.datePipe.transform(data.data.ngayDuyet, Utils.FORMAT_DATE_STR);
                    this.ngayPheDuyet = this.datePipe.transform(data.data.ngayPheDuyet, Utils.FORMAT_DATE_STR);
                    this.trangThai = data.data.trangThai;
                    this.thuyetMinh = data.data.thuyetMinh;
                    this.lstFiles = data.data.lstFiles;
                    this.listFile = [];
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
            await this.quanLyVonPhiService.trinhDuyetDeNghiTongHop(requestGroupButtons).toPromise().then(async (data) => {
                if (data.statusCode == 0) {
                    this.trangThai = mcn;
                    this.ngayTrinhDuyet = this.datePipe.transform(data.data.ngayTrinh, Utils.FORMAT_DATE_STR);
                    this.ngayDuyet = this.datePipe.transform(data.data.ngayDuyet, Utils.FORMAT_DATE_STR);
                    this.ngayPheDuyet = this.datePipe.transform(data.data.ngayPheDuyet, Utils.FORMAT_DATE_STR);
                    this.getStatusButton();
                    if (mcn == Utils.TT_BC_8 || mcn == Utils.TT_BC_5 || mcn == Utils.TT_BC_3) {
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


    // luu
    async save() {
        if (!this.maDviTien) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
            return;
        }
        let checkSave = true;
        this.lstCtietBcao.forEach(item => {
            if (this.editCache[item.id].edit) {
                checkSave = false;
                return;
            }
        })
        if (!checkSave) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTSAVE);
            return;
        }
        if (mulMoney(this.tongSo.tongSoGao, this.maDviTien) > MONEY_LIMIT ||
            mulMoney(this.tongSo.tongSoThoc, this.maDviTien) > MONEY_LIMIT ||
            mulMoney(this.tongSo.tongSoMuoi, this.maDviTien) > MONEY_LIMIT ||
            mulMoney(this.tongSo.capVonVttb, this.maDviTien) > MONEY_LIMIT ||
            mulMoney(this.tongSo.tcGiaoVonHoanUngNam, this.maDviTien) > MONEY_LIMIT) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.MONEYRANGE);
            return;
        }
        let lstCTietBCaoTemp: any[] = [];
        this.lstCtietBcao.forEach(item => {
            lstCTietBCaoTemp.push({
                ...item,
                vonCapThoc: mulMoney(item.vonCapThoc, this.maDviTien),
                vonUngThoc: mulMoney(item.vonUngThoc, this.maDviTien),
                tongSoThoc: mulMoney(item.tongSoThoc, this.maDviTien),
                giaoDuToanGao: mulMoney(item.giaoDuToanGao, this.maDviTien),
                vonCapGao: mulMoney(item.vonCapGao, this.maDviTien),
                vonUngGao: mulMoney(item.vonUngGao, this.maDviTien),
                tongSoGao: mulMoney(item.tongSoGao, this.maDviTien),
                giaoDuToanMuoi: mulMoney(item.giaoDuToanMuoi, this.maDviTien),
                vonCapMuoi: mulMoney(item.vonCapMuoi, this.maDviTien),
                vonUngMuoi: mulMoney(item.vonUngMuoi, this.maDviTien),
                tongSoMuoi: mulMoney(item.tongSoMuoi, this.maDviTien),
                capVonVttb: mulMoney(item.capVonVttb, this.maDviTien),
                tcGiaoVonHoanUngNam: mulMoney(item.tcGiaoVonHoanUngNam, this.maDviTien),
            })
        })

        lstCTietBCaoTemp.forEach(item => {
            if (item.id.length == 38) {
                item.id = null;
            }
        })
        //get list file url
        let listFile: any = [];
        for (const iterator of this.listFile) {
            listFile.push(await this.uploadFile(iterator));
        }

        // gui du lieu trinh duyet len server
        let request = JSON.parse(JSON.stringify({
            id: this.id,
            fileDinhKems: listFile,
            listIdDeleteFiles: this.listIdFilesDelete,
            thopTcCtiets: lstCTietBCaoTemp,
            maDvi: this.maDviTao,
            maDviTien: this.maDviTien,
            maDnghi: this.maDeNghi,
            loaiDnghi: this.nguonBcao,
            congVan: this.congVan,
            soQdChiTieu: this.qdChiTieu,
            trangThai: this.trangThai,
            thuyetMinh: this.thuyetMinh,
        }));
        //get file cong van url
        let file: any = this.fileDetail;
        if (file) {
            request.congVan = await this.uploadFile(file);
        }
        if (!request.congVan) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.DOCUMENTARY);
            return;
        }
        this.spinner.show();
        if (!this.id) {
            this.quanLyVonPhiService.themMoiDnghiThop(request).toPromise().then(
                async (data) => {
                    if (data.statusCode == 0) {
                        this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
                        this.router.navigate([
                            'qlcap-von-phi-hang/quan-ly-cap-nguon-von-chi/tong-hop-tai-tong-cuc/0/' + data.data.id,
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
            this.quanLyVonPhiService.capNhatDnghiThop(request).toPromise().then(
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

    redirectChiTieuKeHoachNam() {
        this.router.navigate(['/qlkh-von-phi/quan-ly-lap-tham-dinh-du-toan-nsnn/tim-kiem']);
        this.location.back()
    }

    // start edit
    startEdit(id: string): void {
        this.editCache[id].edit = true;
    }

    // huy thay doi
    cancelEdit(id: string): void {
        const index = this.lstCtietBcao.findIndex(item => item.id === id);  // lay vi tri hang minh sua
        // if (!this.lstCTietBCao[index].maNdung) {
        //     this.deleteById(id);
        //     return;
        // }
        this.editCache[id] = {
            data: { ...this.lstCtietBcao[index] },
            edit: false
        };
    }

    // luu thay doi
    saveEdit(id: string): void {
        this.editCache[id].data.checked = this.lstCtietBcao.find(item => item.id === id).checked; // set checked editCache = checked lstCtietBcao
        const index = this.lstCtietBcao.findIndex(item => item.id === id);   // lay vi tri hang minh sua
        this.total(-1, this.lstCtietBcao[index]);
        Object.assign(this.lstCtietBcao[index], this.editCache[id].data); // set lai data cua lstCtietBcao[index] = this.editCache[id].data
        this.editCache[id].edit = false;  // CHUYEN VE DANG TEXT
        this.total(1, this.lstCtietBcao[index]);
    }

    // gan editCache.data == lstCTietBCao
    updateEditCache(): void {
        this.lstCtietBcao.forEach(item => {
            this.editCache[item.id] = {
                edit: false,
                data: { ...item }
            };
        });
    }

    changeModel(id: any) {
        this.editCache[id].data.tongSoThoc = Number(this.editCache[id].data.vonCapThoc) + Number(this.editCache[id].data.vonUngThoc);
        this.editCache[id].data.tongSoGao = Number(this.editCache[id].data.giaoDuToanGao) + Number(this.editCache[id].data.vonCapGao) + Number(this.editCache[id].data.vonUngGao);
        this.editCache[id].data.tongSoMuoi = Number(this.editCache[id].data.giaoDuToanMuoi) + Number(this.editCache[id].data.vonCapMuoi) + Number(this.editCache[id].data.vonUngMuoi);
    }

    total(heSo: number, item: ItemData) {
        this.tongSo.vonCapThoc += heSo * item.vonCapThoc;
        this.tongSo.vonUngThoc += heSo * item.vonUngThoc;
        this.tongSo.tongSoThoc += heSo * item.tongSoThoc;
        this.tongSo.giaoDuToanGao += heSo * item.giaoDuToanGao;
        this.tongSo.vonCapGao += heSo * item.vonCapGao;
        this.tongSo.vonUngGao += heSo * item.vonUngGao;
        this.tongSo.tongSoGao += heSo * item.tongSoGao;
        this.tongSo.giaoDuToanMuoi += heSo * item.giaoDuToanMuoi;
        this.tongSo.vonCapMuoi += heSo * item.vonCapMuoi;
        this.tongSo.vonUngMuoi += heSo * item.vonUngMuoi;
        this.tongSo.tongSoMuoi += heSo * item.tongSoMuoi;
        this.tongSo.capVonVttb += heSo * item.capVonVttb;
        this.tongSo.tcGiaoVonHoanUngNam += heSo * item.tcGiaoVonHoanUngNam;
    }


    //lay ten don vi tạo
    getUnitName() {
        return this.donVis.find((item) => item.maDvi == this.maDviTao)?.tenDvi;
    }

    getStatusName() {
        return this.trangThais.find(e => e.id == this.trangThai)?.tenDm;
    }

    close() {
        if (!this.loai) {
            this.loai = "0";
        }
        this.router.navigate([
            'qlcap-von-phi-hang/quan-ly-cap-nguon-von-chi/tong-hop/' + this.loai
        ])
    }

    showDialogCopy() {
        let obj = {
            qdChiTieu: this.qdChiTieu,
        }
        const modalTuChoi = this.modal.create({
            nzTitle: 'Copy Đề nghị tổng hợp tại tổng cục',
            nzContent: DialogDoCopyComponent,
            nzMaskClosable: false,
            nzClosable: false,
            nzWidth: '900px',
            nzFooter: null,
            nzComponentParams: {
                obj
            },
        });
        modalTuChoi.afterClose.toPromise().then(async (res) => {
            if (res) {
                this.doCopy(res);
            }
        });
    }

    async doCopy(response: any) {
        var maDeNghiNew: string;
        await this.quanLyVonPhiService.maDeNghi().toPromise().then(
            (res) => {
                if (res.statusCode == 0) {
                    maDeNghiNew = res.data;
                } else {
                    this.notification.error(MESSAGE.ERROR, res?.msg);
                }
            },
            (err) => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
            },
        );

        let lstCtietBcaoTemp: any[] = [];
        this.lstCtietBcao.forEach(item => {
            lstCtietBcaoTemp.push({
                ...item,
                id: null,
            })
        })
        // gui du lieu trinh duyet len server
        let request = JSON.parse(JSON.stringify({
            id: null,
            fileDinhKems: [],
            listIdDeleteFiles: [],
            thopTcCtiets: lstCtietBcaoTemp,
            maDvi: this.maDviTao,
            maDnghi: maDeNghiNew,
            loaiDnghi: this.nguonBcao,
            maDviTien: "1",
            soQdChiTieu: response.qdChiTieu,
            trangThai: "1",
            thuyetMinh: "",
        }));

        this.spinner.show();
        this.quanLyVonPhiService.themMoiDnghiThop(request).toPromise().then(
            async (data) => {
                if (data.statusCode == 0) {
                    const modalCopy = this.modal.create({
                        nzTitle: MESSAGE.ALERT,
                        nzContent: DialogCopyComponent,
                        nzMaskClosable: false,
                        nzClosable: false,
                        nzWidth: '900px',
                        nzFooter: null,
                        nzComponentParams: {
                            maBcao: maDeNghiNew
                        },
                    });
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



}
