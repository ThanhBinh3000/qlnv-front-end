import { DatePipe, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import * as fileSaver from 'file-saver';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { DON_VI_TIEN, MONEY_LIMIT, mulMoney, Utils } from 'src/app/Utility/utils';
import * as uuid from 'uuid';


export class ItemData {
    id!: any;
    stt: any;
    maNoiDung: number;
    maNhom: number;
    tongSo: any;
    listCtiet: ItemDvi[] = [];
    checked!: boolean;
}

export class ItemDvi {
    maDvi: string;
    soTranChi: number;
}

@Component({
    selector: 'app-xay-dung-phuong-an-giao-so-kiem-tra-chi-nsnn',
    templateUrl: './xay-dung-phuong-an-giao-so-kiem-tra-chi-nsnn.component.html',
    styleUrls: ['./xay-dung-phuong-an-giao-so-kiem-tra-chi-nsnn.component.scss',
    ],
})
export class XayDungPhuongAnGiaoSoKiemTraChiNsnnComponent implements OnInit {
    // statusBtnDel: boolean; // trang thai an/hien nut xoa
    // statusBtnSave: boolean; // trang thai an/hien nut luu
    // statusBtnApprove: boolean; // trang thai an/hien nut trinh duyet
    // statusBtnTBP: boolean; // trang thai an/hien nut truong bo phan
    // statusBtnLD: boolean; // trang thai an/hien nut lanh dao
    // statusBtnGuiDVCT: boolean; // trang thai nut gui don vi cap tren
    // statusBtnDVCT: boolean; // trang thai nut don vi cap tren
    // statusBtnLDDC: boolean; // trang thai nut lanh dao dieu chinh so kiem tra
    // statusBtnCopy: boolean; // trang thai nut copy
    // statusBtnPrint: boolean; // trang thai nut in
    // currentday: Date = new Date();
    //////
    //thong tin dang nhap
    id: any;
    userInfo: any;
    //thong tin chung bao cao
    maBaoCao: string;
    ngayNhap: string;
    maDonViTao: string;
    maPa: string;
    namPa: number;
    soQdCv: string;
    trangThaiBanGhi: string = '1';
    newDate = new Date();
    listIdDelete: string = '';
    maDviTien: string;
    //danh muc
    lstCTietBCao: ItemData[] = [];
    donVis: any[] = [];
    noiDungs: any[] = [];
    nhomChis: any[] = [];
    dviCapDuois: any[] = [];
    donViTiens: any[] = DON_VI_TIEN;
    //file
    lstFile: any[] = [];
    listIdFiles: string;
    fileList: NzUploadFile[] = [];
    listFile: File[] = [];
    fileUrl: any;
    fileToUpload!: File;
    listFileUploaded: any = [];
    //trang thai cac nut
    status: boolean = false;

    allChecked = false; // check all checkbox
    editCache: { [key: string]: { edit: boolean; data: ItemData } } = {}; // phuc vu nut chinh
    //khac
    maGiao: any;
    checkGiao: boolean = true;
    listId: string = '';

    beforeUpload = (file: NzUploadFile): boolean => {
        this.fileList = this.fileList.concat(file);
        return false;
    };

    handleUpload(): void {
        this.fileList.forEach((file: any) => {
            const id = file?.lastModified.toString();
            this.lstFile.push({ id: id, fileName: file?.name });
            this.listFile.push(file);
        });
        this.fileList = [];
    }

    //event ng dung thay doi file
    selectFile(files: FileList): void {
        this.fileToUpload = files.item(0);
    }

    constructor(
        private quanLyVonPhiService: QuanLyVonPhiService,
        private danhMuc: DanhMucHDVService,

        private spinner: NgxSpinnerService,
        private router: ActivatedRoute,
        private datePipe: DatePipe,
        private sanitizer: DomSanitizer,
        private route: Router,
        private userService: UserService,
        private notification: NzNotificationService,
        private location: Location,
        private modal: NzModalService,
    ) { }

    async ngOnInit() {
        let userName = this.userService.getUserName();
        await this.getUserInfo(userName); //get user info

        //check param dieu huong router
        this.id = this.router.snapshot.paramMap.get('id');
        //lay danh sach danh muc
        this.danhMuc.dMDonVi().toPromise().then(
            data => {
                if (data.statusCode == 0) {
                    this.donVis = data.data;
                    this.dviCapDuois = this.donVis.filter(e => e.parent?.maDvi === this.userInfo?.dvql);
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
            this.ngayNhap = this.datePipe.transform(this.newDate, Utils.FORMAT_DATE_STR);
            this.spinner.show();
            this.quanLyVonPhiService.maPhuongAn().toPromise().then(
                (res) => {
                    if (res.statusCode == 0) {
                        this.maPa = res.data;
                    } else {
                        this.notification.error(MESSAGE.ERROR, res?.msg);
                    }
                },
                (err) => {
                    this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
                },
            );

        }
        this.danhMuc.dMNoiDung().toPromise().then(
            (res) => {
                if (res.statusCode == 0) {
                    this.noiDungs = res.data?.content;
                } else {
                    this.notification.error(MESSAGE.ERROR, res?.msg);
                }
            },
            (err) => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
            },
        );
        //get danh muc dự án
        this.danhMuc.dMNhomChi().toPromise().then(
            (data) => {
                if (data.statusCode == 0) {
                    this.nhomChis = data.data?.content;
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

    redirectkehoachvonphi() {
        // this.route.navigate(['/qlkh-von-phi/quan-ly-lap-tham-dinh-du-toan-nsnn']);
        this.location.back()
    }

    //get user info
    async getUserInfo(username: string) {
        await this.userService
            .getUserInfo(username)
            .toPromise()
            .then(
                (data) => {
                    if (data?.statusCode == 0) {
                        this.userInfo = data?.data;
                        return data?.data;
                    } else {
                        this.notification.error(MESSAGE.ERROR, data?.msg);
                    }
                },
                (err) => {
                    this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
                },
            );
    }

    //check role cho các nut trinh duyet
    getStatusButton() {
        // let checkParent = false;
        // let checkChirld = false;
        // let dVi = this.donViTaos.find(e => e.maDvi == this.donvitao);
        // if (dVi && dVi.maDvi == this.userInfor.dvql) {
        //     checkChirld = true;
        // }
        // if (dVi && dVi.parent?.maDvi == this.userInfor.dvql) {
        //     checkParent = true;
        // }

        // const utils = new Utils();
        // this.statusBtnDel = utils.getRoleDel(this.trangThaiBanGhi, checkChirld, this.userInfor?.roles[0]?.id);
        // this.statusBtnSave = utils.getRoleSave(this.trangThaiBanGhi, checkChirld, this.userInfor?.roles[0]?.id);
        // this.statusBtnApprove = utils.getRoleApprove(this.trangThaiBanGhi, checkChirld, this.userInfor?.roles[0]?.id);
        // this.statusBtnTBP = utils.getRoleTBP(this.trangThaiBanGhi, checkChirld, this.userInfor?.roles[0]?.id);
        // this.statusBtnLD = utils.getRoleLD(this.trangThaiBanGhi, checkChirld, this.userInfor?.roles[0]?.id);
        // this.statusBtnGuiDVCT = utils.getRoleGuiDVCT(this.trangThaiBanGhi, checkChirld, this.userInfor?.roles[0]?.id);
        // this.statusBtnDVCT = utils.getRoleDVCT(this.trangThaiBanGhi, checkParent, this.userInfor?.roles[0]?.id);
        // this.statusBtnLDDC = utils.getRoleLDDC(this.trangThaiBanGhi, checkChirld, this.userInfor?.roles[0]?.id);
        // this.statusBtnCopy = utils.getRoleCopy(this.trangThaiBanGhi, checkChirld, this.userInfor?.roles[0]?.id);
        // this.statusBtnPrint = utils.getRolePrint(this.trangThaiBanGhi, checkChirld, this.userInfor?.roles[0]?.id);
    }

    // call chi tiet bao cao
    async getDetailReport() {
        this.spinner.show();
        await this.quanLyVonPhiService.chitietPhuongAn(this.maPa).toPromise().then(
            async (data) => {
                if (data.statusCode == 0) {
                    this.id = data.data.id;
                    this.lstCTietBCao = data.data.listCtiet;
                    this.maDviTien = data.data.maDviTien;
                    //this.divMoneyTotal();
                    // this.maBaoCao = this.chiTietBcaos?.maBcao;
                    this.namPa = data.data.namPa;
                    this.lstFile = data.data.lstFile;
                    this.trangThaiBanGhi = data.data.trangThai;
                    this.maPa = data.data.maPa;
                    this.maDonViTao = data.data.maDvi;
                    this.ngayNhap = this.datePipe.transform(data.data.ngayTao, Utils.FORMAT_DATE_STR);
                    var soQd = data.data.soQd;
                    var soCv = data.data.soCv;
                    if (
                        this.trangThaiBanGhi == Utils.TT_BC_1 ||
                        this.trangThaiBanGhi == Utils.TT_BC_3 ||
                        this.trangThaiBanGhi == Utils.TT_BC_5 ||
                        this.trangThaiBanGhi == Utils.TT_BC_8 ||
                        this.trangThaiBanGhi == Utils.TT_BC_10
                    ) {
                        this.status = false;
                    } else {
                        this.status = true;
                    }
                    this.updateEditCache();
                    if (soQd != null && soCv != null) {
                        this.checkGiao = false;
                    }

                    this.getStatusButton();
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

    //chuc nang trinh duyet len các cap tren
    onSubmit(mcn: String) {
        const requestGroupButtons = {
            id: this.id,
            maChucNang: mcn,
            lyDoTuChoi: '',
        };
        if (this.id) {
            this.spinner.show();
            this.quanLyVonPhiService.trinhDuyetPhuongAn(requestGroupButtons).subscribe(async (data) => {
                if (data.statusCode == 0) {
                    await this.getDetailReport();
                    if (mcn == Utils.TT_BC_3 || mcn == Utils.TT_BC_5 || mcn == Utils.TT_BC_3) {
                        this.notification.success(MESSAGE.SUCCESS, MESSAGE.TU_CHOI_SUCCESS);
                    } else {
                        this.notification.success(MESSAGE.SUCCESS, MESSAGE.APPROVE_SUCCESS);
                    }
                    this.getStatusButton();
                } else {
                    this.notification.error(MESSAGE.ERROR, data?.msg);
                }
            }, err => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
            });
            this.spinner.hide();
        } else {
            this.notification.warning(MESSAGE.WARNING, MESSAGE.MESSAGE_DELETE_WARNING);
        }
    }

    // luu
    async luu() {

        let checkSaveEdit;
        if (!this.maDviTien) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
            return;
        }
        this.lstCTietBCao.filter(item => {
            if (this.editCache[item.id].edit == true) {
                checkSaveEdit = false;
            }
        })
        if (checkSaveEdit == false) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTSAVE);
            return;
        }

        this.lstCTietBCao.forEach((e) => {
            if (typeof e.id != 'number') {
                e.id = null;
            }
        });

        let lstCTietBCaoTemp = [];
        let checkMoneyRange = true;
        // gui du lieu trinh duyet len server
        this.lstCTietBCao.forEach(item => {
            let listCtietDvi = [];
            item.listCtiet.forEach(e => {
                let soTranChi = mulMoney(e.soTranChi, this.donViTiens);
                if (soTranChi > MONEY_LIMIT) {
                    checkMoneyRange = false;
                    return;
                }
                listCtietDvi.push({
                    ...e,
                    soTranChi: soTranChi,
                })
            })
            lstCTietBCaoTemp.push({
                ...item,
                listCtiet: listCtietDvi,
            })
        })

        // lay id file dinh kem (gửi file theo danh sách )
        let listFile: any = [];
        for (const iterator of this.listFile) {
            listFile.push(await this.uploadFile(iterator));
        }
        // gui du lieu trinh duyet len server
        if (!checkMoneyRange == true) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.MONEYRANGE);
        } else {
            let request = {
                id: this.id,
                listIdDeletes: this.listIdDelete,
                fileDinhKems: listFile,
                listCtiet: lstCTietBCaoTemp,
                maDvi: this.maDonViTao,
                maDviTien: this.maDviTien,
                maPa: this.maPa,
                namPa: this.namPa,
                trangThai: this.trangThaiBanGhi,
            };
            this.spinner.show();
            if (this.maPa == null) {
                this.quanLyVonPhiService.themmoiPhuongAn(request).toPromise().then(
                    (data) => {
                        if (data.statusCode == 0) {
                            this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
                            this.id = data.data.id;
                            this.maPa = data.data.maPa;
                            this.getDetailReport();
                            this.getStatusButton();
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
                    (data) => {
                        if (data.statusCode == 0) {
                            this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
                            this.getDetailReport();
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
        }
        this.updateEditCache();
        this.spinner.hide();
    }

    //download file về máy tính
    async downloadFile(id: string) {
        let file!: File;
        file = this.listFile.find(element => element?.lastModified.toString() == id);
        if (!file) {
            let fileAttach = this.lstFile.find(element => element?.id == id);
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

    // xoa file trong bang file
    deleteFile(id: string): void {
        this.lstFile = this.lstFile.filter((a: any) => a.id !== id);
        this.listFile = this.listFile.filter(
            (a: any) => a?.lastModified.toString() !== id,
        );
    }

    //upload file
    async uploadFile(file: File) {
        // day file len server
        const upfile: FormData = new FormData();
        upfile.append('file', file);
        upfile.append('folder', this.maPa + '/' + this.maDonViTao + '/');
        let temp = await this.quanLyVonPhiService
            .uploadFile(upfile)
            .toPromise()
            .then(
                (data) => {
                    let objfile = {
                        fileName: data.filename,
                        fileSize: data.size,
                        fileUrl: data.url,
                    };
                    return objfile;
                },
                (err) => {
                    console.log('false :', err);
                },
            );
        return temp;
    }

    //lay ten don vi tạo
    getUnitName() {
        return this.donVis.find((item) => item.maDvi == this.maDonViTao)?.tenDvi;
    }

    getStatusName() {
        const utils = new Utils();
        return utils.getStatusName(this.trangThaiBanGhi);
    }

    //checkox trên tùng row
    updateSingleChecked(): void {
        if (this.lstCTietBCao.every((item) => !item.checked)) {
            this.allChecked = false;
        } else if (this.lstCTietBCao.every((item) => item.checked)) {
            this.allChecked = true;
        }
    }

    //check all input
    updateAllChecked(): void {
        if (this.allChecked) {
            this.lstCTietBCao = this.lstCTietBCao.map((item) => ({
                ...item,
                checked: true,
            }));
        } else {
            this.lstCTietBCao = this.lstCTietBCao.map((item) => ({
                ...item,
                checked: false,
            }));
        }
    }

    // xoa dong
    deleteById(id: any): void {
        this.lstCTietBCao = this.lstCTietBCao.filter((item) => item.id != id);
        if (typeof id == 'number') {
            this.listIdDelete += id + ',';
        }
    }

    // xóa với checkbox
    deleteSelected() {
        // add list delete id
        this.lstCTietBCao.filter((item) => {
            if (item.checked == true && typeof item.id == 'number') {
                this.listIdDelete += item.id + ',';
            }
        });
        // delete object have checked = true
        this.lstCTietBCao = this.lstCTietBCao.filter(
            (item) => item.checked != true,
        );
        this.allChecked = false;
    }

    // them dong moi
    addLine(id: number): void {
        let item: ItemData = {
            id: uuid.v4(),
            stt: 0,
            maNhom: 0,
            maNoiDung: 0,
            tongSo: 0,
            listCtiet: [],
            checked: false,
        };
        this.dviCapDuois.forEach(e => {
            item.listCtiet.push({
                maDvi: e.maDvi,
                soTranChi: 0,
            })
        })

        this.lstCTietBCao.splice(id, 0, item);
        this.editCache[item.id] = {
            edit: true,
            data: { ...item },
        };
    }


    //chọn row cần sửa và trỏ vào template
    startEdit(id: string): void {
        this.editCache[id].edit = true;
    }

    //update khi sửa
    saveEdit(id: string): void {
        if (!this.editCache[id].data.maNoiDung || !this.editCache[id].data.maNhom) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
            return;
        }
        var arr = this.editCache[id].data.listCtiet;
        // let checkValidSoTranChi;
        // arr.forEach(e => {
        //     if (!e.soTranChi && e.soTranChi !== 0) {
        //         checkValidSoTranChi = false;
        //     }
        // })
        // if (checkValidSoTranChi == false) {
        //     this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
        //     return;
        // }
        this.editCache[id].data.checked = this.lstCTietBCao.find((item) => item.id === id).checked; // set checked editCache = checked lstCTietBCao
        const index = this.lstCTietBCao.findIndex((item) => item.id === id); // lay vi tri hang minh sua
        Object.assign(this.lstCTietBCao[index], this.editCache[id].data); // set lai data cua lstCTietBCao[index] = this.editCache[id].data
        this.editCache[id].edit = false; // CHUYEN VE DANG TEXT
    }

    //hủy thao tác sửa update lại giá trị ban đầu
    cancelEdit(id: string): void {
        const index = this.lstCTietBCao.findIndex((item) => item.id === id); // lay vi tri hang minh sua
        this.editCache[id] = {
            data: { ...this.lstCTietBCao[index] },
            edit: false,
        };
    }

    updateEditCache(): void {
        this.lstCTietBCao.forEach((item) => {
            this.editCache[item.id] = {
                edit: false,
                data: { ...item },
            };
        });
    }

    

    // lstQlnvKhvonphiDsachGiaoSo: any[] = [];
    // //giao
    // giao(madvinhan: any) {
    //     this.lstQlnvKhvonphiDsachGiaoSo = [];
    //     this.quanLyVonPhiService.maGiao().subscribe((res) => {
    //         this.maGiao = res.data;
    //         this.lstCTietBCao.forEach((e) => {
    //             var manoidung = e.maNoiDung;
    //             var manhom = e.maNhom;
    //             var arr = e.listCtietDvi;
    //             var soduocgiao;
    //             arr.forEach((el) => {
    //                 if (el.maKhuVuc == madvinhan) {
    //                     soduocgiao = el.soTranChi;
    //                 }
    //             });
    //             let ob = {
    //                 maDviNhan: madvinhan.toString(),
    //                 maDviTao: this.donvitao,
    //                 maDviTien: this.donvitien,
    //                 maGiao: this.maGiao,
    //                 maNhom: manhom,
    //                 maNoiDung: manoidung,
    //                 maPa: this.maphuongan,
    //                 namGiao: this.namBcaohienhanh,
    //                 soDuocGiao: soduocgiao,
    //             };
    //             this.lstQlnvKhvonphiDsachGiaoSo.push(ob);
    //         });
    //         let req = {
    //             lstQlnvKhvonphiDsachGiaoSo: this.lstQlnvKhvonphiDsachGiaoSo,
    //         };
    //         this.quanLyVonPhiService.giaoSoTranChi(req).subscribe((res) => {
    //             if (res.statusCode == 0) {
    //                 this.notification.success(MESSAGE.SUCCESS, MESSAGE.GIAO_SO_TRAN_CHI_SUCCESS);
    //             } else {
    //                 this.notification.error(MESSAGE.ERROR, res?.msg);
    //             }
    //         }, err => {
    //             this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    //         });
    //     });
    // }

    // //giao toan bo
    // giaotoanbo() {
    //     this.lstQlnvKhvonphiDsachGiaoSo = [];
    //     this.quanLyVonPhiService.maGiao().subscribe((res) => {
    //         this.maGiao = res.data;
    //         this.lstCTietBCao.forEach((e) => {
    //             var manoidung = e.maNoiDung;
    //             var nhom = e.maNhom;
    //             var madonvinhan;
    //             var array = e.listCtietDvi;
    //             var soduocgiao;

    //             array.forEach((el) => {
    //                 madonvinhan = el.maKhuVuc;
    //                 soduocgiao = el.soTranChi;
    //                 let ob = {
    //                     maDviNhan: madonvinhan.toString(),
    //                     maDviTao: this.donvitao,
    //                     maDviTien: this.donvitien,
    //                     maGiao: this.maGiao,
    //                     maNhom: nhom,
    //                     maNoiDung: manoidung,
    //                     maPa: this.maphuongan,
    //                     namGiao: this.namBcaohienhanh,
    //                     soDuocGiao: soduocgiao,
    //                 };
    //                 this.lstQlnvKhvonphiDsachGiaoSo.push(ob);
    //             });
    //         });
    //         let req = {
    //             lstQlnvKhvonphiDsachGiaoSo: this.lstQlnvKhvonphiDsachGiaoSo,
    //         };
    //         this.quanLyVonPhiService.giaoSoTranChi(req).subscribe((res) => {
    //             if (res.statusCode == 0) {
    //                 this.notification.success(MESSAGE.SUCCESS, MESSAGE.GIAO_SO_TRAN_CHI_TOAN_BO);
    //             } else {
    //                 this.notification.error(MESSAGE.ERROR, res?.msg);
    //             }
    //         }, err => {
    //             this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    //         });
    //     });
    // }

    // listTongCol: any[] = [];
    // changeInput() {
    //     this.listColNames.forEach(e => {
    //         e.tong = 0;
    //         this.lstCTietBCao.forEach(item => {
    //             item.listCtietDvi.forEach(el => {
    //                 if (e.maDvi === el.maKhuVuc) {
    //                     e.tong += el.soTranChi;
    //                 }
    //             })
    //         })
    //     })

    // }

    // tinhtong(id: any) {
    //     var sum = 0;
    //     this.editCache[id].data.listCtietDvi.forEach(e => {
    //         sum += Number(e.soTranChi);
    //     })
    //     this.editCache[id].data.tongSo = sum;
    //     var index = this.lstCTietBCao.findIndex(item => item.id == id);
    //     Object.assign(this.lstCTietBCao[index], this.editCache[id].data);
    // }

    // updateSumtCache(): void {
    //     this.lstCTietBCao.forEach((item) => {
    //         var arr = item.listCtietDvi;
    //         const index = item.id;
    //         arr.forEach(el => {
    //             item.tongSo += Number(el.soTranChi)
    //         })
    //         // lay vi tri hang minh sua
    //         // set lai data cua lstCTietBCao[index] = this.editCache[id].data


    //     })
    // }


    // xoaBaoCao() {
    //     if (this.id) {
    //         this.quanLyVonPhiService.xoaPhuongAn(this.id).toPromise().then(async res => {
    //             if (res.statusCode == 0) {
    //                 this.notification.success(MESSAGE.SUCCESS, MESSAGE.DELETE_SUCCESS);
    //                 this.location.back();
    //                 console.log(this.location.getState());
    //             } else {
    //                 this.notification.error(MESSAGE.ERROR, res?.msg);
    //             }
    //         }, err => {
    //             this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    //         })
    //     } else {
    //         this.notification.warning(MESSAGE.WARNING, MESSAGE.MESSAGE_DELETE_WARNING)
    //     }
    // }

    // dong() {
    //     this.location.back()
    // }

    // // action copy
    // async doCopy() {
    //     let maPhuongAn = await this.quanLyVonPhiService.maPhuongAn().toPromise().then(
    //         (data) => {
    //             if (data.statusCode == 0) {
    //                 return data.data;
    //             } else {
    //                 this.notification.error(MESSAGE.ERROR, data?.msg);
    //                 return null;
    //             }
    //         },
    //         (err) => {
    //             this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
    //             return null;
    //         }
    //     );
    //     if (!maPhuongAn) {
    //         return;
    //     }
    //     let lstTemp = [];
    //     let checkMoneyRange = true;
    //     this.lstCTietBCao.forEach(item => {
    //         let listCtietDvi = [];
    //         item.listCtietDvi.forEach(e => {
    //             let soTranChi = mulMoney(e.soTranChi, this.donvitien);
    //             if (soTranChi > MONEYLIMIT) {
    //                 checkMoneyRange = false;
    //                 return;
    //             }
    //             listCtietDvi.push({
    //                 ...e,
    //                 id: null,
    //                 soTranChi: soTranChi,
    //             })
    //         })
    //         lstTemp.push({
    //             ...item,
    //             listCtietDvi: listCtietDvi,
    //             id: null
    //         })
    //     })

    //     // gui du lieu trinh duyet len server
    //     if (!checkMoneyRange == true) {
    //         this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.MONEYRANGE);
    //     } else {
    //         let request = {
    //             id: null,
    //             listIdDeletes: null,
    //             fileDinhKems: null,
    //             listCtiet: lstTemp,
    //             maDvi: this.donvitao,
    //             maDviTien: this.donvitien,
    //             maPa: maPhuongAn,
    //             namHienHanh: this.namBcaohienhanh.toString(),
    //             namPa: this.nampa,
    //             trangThai: this.trangThaiBanGhi,
    //         };
    //         this.spinner.show();

    //         this.quanLyVonPhiService.themmoiPhuongAn(request).subscribe(
    //             (res) => {
    //                 if (res.statusCode == 0) {
    //                     const modalCopy = this.modal.create({
    //                         nzTitle: MESSAGE.ALERT,
    //                         nzContent: DialogCopyComponent,
    //                         nzMaskClosable: false,
    //                         nzClosable: false,
    //                         nzWidth: '900px',
    //                         nzFooter: null,
    //                         nzComponentParams: {
    //                             maBcao: maPhuongAn
    //                         },
    //                     });
    //                 } else {
    //                     this.notification.error(MESSAGE.ERROR, res?.msg);
    //                 }
    //             },
    //             (err) => {
    //                 this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    //             },
    //         );
    //     }

    //     this.spinner.hide();
    // }

    // // action print
    // doPrint() {
    //     let WindowPrt = window.open(
    //         '',
    //         '',
    //         'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0',
    //     );
    //     let printContent = '';
    //     printContent = printContent + '<div> <div>';
    //     printContent =
    //         printContent + document.getElementById('tablePrint').innerHTML;
    //     printContent = printContent + '</div> </div>';
    //     WindowPrt.document.write(printContent);
    //     WindowPrt.document.close();
    //     WindowPrt.focus();
    //     WindowPrt.print();
    //     WindowPrt.close();
    // }


    // mullMoneyTotal() {
    //     this.lstCTietBCao.filter(item => {
    //         item.listCtietDvi.forEach(e => {
    //             e.soTranChi = mulMoney(e.soTranChi, this.donvitien);
    //         })
    //     })
    // }


    // divMoneyTotal() {
    //     this.lstCTietBCao.filter(item => {
    //         item.listCtietDvi.forEach(e => {
    //             e.soTranChi = divMoney(e.soTranChi, this.donvitien);
    //         })
    //     })
    // }
}
