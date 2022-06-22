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
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { CAN_CU_GIA, divMoney, DON_VI_TIEN, LOAI_DE_NGHI, MONEY_LIMIT, mulMoney, Utils } from 'src/app/Utility/utils';
import * as uuid from 'uuid';
import { DataService } from '../data.service';

export class ItemData {
    id: any;
    stt: string;
    maHang: string;
    maDviTinh: string;
    soLuong: number;
    donGiaMua: number;
    thanhTien: number;
    checked: boolean;
}

export class ItemCongVan {
    fileName: string;
    fileSize: number;
    fileUrl: number;
}

@Component({
    selector: 'app-de-nghi-theo-quyet-dinh-don-gia-mua',
    templateUrl: './de-nghi-theo-quyet-dinh-don-gia-mua.component.html',
    styleUrls: ['./de-nghi-theo-quyet-dinh-don-gia-mua.component.scss',
    ],
})
export class DeNghiTheoQuyetDinhDonGiaMuaComponent implements OnInit {
    //thong tin dang nhap
    id: any;
    userInfo: any;
    loai: any;
    //thong tin chung bao cao
    maDeNghi: string;
    qdChiTieu: string;
    canCuGia: string = Utils.QD_DON_GIA;
    loaiDn: string;
    congVan: ItemCongVan;
    ngayTao: string;
    ngayTrinhDuyet: string;
    ngayPheDuyet: string;
    trangThai: string;
    maDviTao: string;
    thuyetMinh: string;
    tongTien: number = 0;
    kphiDaCap: number = 0;
    lyDoTuChoi: string;
    maDviTien: string;
    newDate = new Date();
    //danh muc
    lstCtietBcao: ItemData[] = [];
    donVis: any[] = [];
    vatTus: any[] = [];
    trangThais: any[] = [
        {
            id: Utils.TT_BC_1,
            tenDm: "Đang soạn",
        },
        {
            id: Utils.TT_BC_4,
            tenDm: "Trình duyệt",
        },
        {
            id: Utils.TT_BC_5,
            tenDm: "Lãnh đạo từ chối",
        },
        {
            id: Utils.TT_BC_7,
            tenDm: "Lãnh đạo duyệt",
        },
    ]
    loaiDns: any[] = LOAI_DE_NGHI;
    canCuGias: any[] = CAN_CU_GIA;
    dviTinhs: any[] = [];
    dviTiens: any[] = DON_VI_TIEN;
    lstFiles: any[] = []; //show file ra man hinh
    //trang thai cac nut
    status: boolean = false;
    statusBtnDel: boolean;
    statusBtnSave: boolean = true;                      // trang thai an/hien nut luu
    statusBtnApprove: boolean = true;                   // trang thai an/hien nut trinh duyet
    // statusBtnTBP: boolean = true;                       // trang thai an/hien nut truong bo phan
    statusBtnLD: boolean = true;                        // trang thai an/hien nut lanh dao
    statusBtnGuiDVCT: boolean = true;                   // trang thai nut gui don vi cap tren
    statusBtnDVCT: boolean = true;                      // trang thai nut don vi cap tren
    statusBtnCopy: boolean = true;                      // trang thai copy
    statusBtnPrint: boolean = true;                     // trang thai print
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
                this.loaiDn = obj?.loaiDn;
            })
            if (!this.qdChiTieu){
                this.close();
            }
            this.ngayTao = this.datePipe.transform(this.newDate, Utils.FORMAT_DATE_STR);
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
        await this.danhMuc.dMDviTinh().toPromise().then(
            (res) => {
                if (res.statusCode == 0) {
                    this.dviTinhs = res.data?.content;
                } else {
                    this.notification.error(MESSAGE.ERROR, res?.msg);
                }
            },
            (err) => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
            },
        );

        await this.danhMuc.dMVatTu().toPromise().then(
            (res) => {
                if (res.statusCode == 0) {
                    this.addListVtu(res.data);
                } else {
                    this.notification.error(MESSAGE.ERROR, res?.msg);
                }
            },
            (err) => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
            },
        );
        this.getStatusButton();
        this.spinner.hide();
    }

    addListVtu(lstVtu: any){
        lstVtu.forEach(item => {
            this.vatTus.push(item);
            if (item.child){
                this.addListVtu(item.child);
            }
        })
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
        if (this.trangThai == Utils.TT_BC_1 ||
            this.trangThai == Utils.TT_BC_3 ||
            this.trangThai == Utils.TT_BC_5 ||
            this.trangThai == Utils.TT_BC_8 ||
            this.trangThai == Utils.TT_BC_10) {
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
        if (dVi && dVi.parent?.maDvi == this.userInfo.dvql) {
            checkParent = true;
        }
        let roleNguoiTao = this.userInfo?.roles[0]?.code;
        if (roleNguoiTao != Utils.NHAN_VIEN){
            this.status = true;
        }
        const utils = new Utils();
        this.statusBtnSave = utils.getRoleSave(this.trangThai, checkChirld, roleNguoiTao);
        this.statusBtnApprove = utils.getRoleApprove(this.trangThai, checkChirld, roleNguoiTao);
        // this.statusBtnTBP = utils.getRoleTBP(this.trangThai, checkChirld, roleNguoiTao);
        if (this.trangThai == Utils.TT_BC_2) {
            this.statusBtnLD = utils.getRoleLD(Utils.TT_BC_4, checkChirld, roleNguoiTao);
        } else {
            this.statusBtnLD = utils.getRoleLD(this.trangThai, checkChirld, roleNguoiTao);
        }

        this.statusBtnGuiDVCT = utils.getRoleGuiDVCT(this.trangThai, checkChirld, roleNguoiTao);
        this.statusBtnDVCT = utils.getRoleDVCT(this.trangThai, checkParent, roleNguoiTao);
        this.statusBtnCopy = utils.getRoleCopy(this.trangThai, checkChirld, roleNguoiTao);
        this.statusBtnPrint = utils.getRolePrint(this.trangThai, checkChirld, roleNguoiTao);
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
        await this.quanLyVonPhiService.ctietDeNghi(this.id).toPromise().then(
            async (data) => {
                if (data.statusCode == 0) {
                    this.tongTien = 0;
                    this.id = data.data.id;
                    this.maDviTien = data.data.maDviTien;
                    this.lstCtietBcao = data.data.dnghiCapvonCtiets;
                    this.lstCtietBcao.forEach(item => {
                        item.thanhTien = divMoney(item.thanhTien, this.maDviTien);
                    })
                    this.updateEditCache();
                    this.maDviTao = data.data.maDvi;
                    this.maDeNghi = data.data.maDnghi;
                    this.qdChiTieu = data.data.soQdChiTieu;
                    this.canCuGia = data.data.canCuVeGia;
                    this.loaiDn = data.data.loaiDnghi;
                    this.congVan = data.data.congVan;
                    this.tongTien = divMoney(data.data.tongTien, this.maDviTien);
                    this.kphiDaCap = divMoney(data.data.kphiDaCap, this.maDviTien);
                    this.ngayTao = this.datePipe.transform(data.data.ngayTao, Utils.FORMAT_DATE_STR);
                    this.ngayTrinhDuyet = this.datePipe.transform(data.data.ngayTrinh, Utils.FORMAT_DATE_STR);
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
            await this.quanLyVonPhiService.trinhDeNghi(requestGroupButtons).toPromise().then(async (data) => {
                if (data.statusCode == 0) {
                    this.trangThai = mcn;
                    this.getStatusButton();
                    if (mcn == Utils.TT_BC_8 || mcn == Utils.TT_BC_5) {
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
        if (!this.maDviTien || 
            (!this.kphiDaCap && this.kphiDaCap !== 0)) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
            return;
        }
        if (this.kphiDaCap > this.tongTien){
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOT_NEGATIVE);
            return;
        }

        let checkSave = true;
        this.lstCtietBcao.forEach(item => {
            if (this.editCache[item.id].edit) {
                checkSave = false;
            }
        })
        if (!checkSave) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTSAVE);
            return;
        }

        if (mulMoney(this.tongTien, this.maDviTien) > MONEY_LIMIT) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.MONEYRANGE);
        }

        let lstCtietBcaoTemp: ItemData[] = [];
        this.lstCtietBcao.forEach(item => {
            lstCtietBcaoTemp.push({
                ...item,
                thanhTien: mulMoney(item.thanhTien, this.maDviTien),
            })
        })
        //get list file url
        let listFile: any = [];
        for (const iterator of this.listFile) {
            listFile.push(await this.uploadFile(iterator));
        }

        lstCtietBcaoTemp.forEach(item => {
            if (item.id.length == 38) {
                item.id = null;
            }
        })
        // gui du lieu trinh duyet len server
        let request = JSON.parse(JSON.stringify({
            id: this.id,
            fileDinhKems: listFile,
            listIdDeleteFiles: this.listIdFilesDelete,
            dnghiCapvonCtiets: lstCtietBcaoTemp,
            congVan: this.congVan,
            maDvi: this.maDviTao,
            maDnghi: this.maDeNghi,
            loaiDnghi: this.loaiDn,
            canCuVeGia: this.canCuGia,
            maDviTien: this.maDviTien,
            soQdChiTieu: this.qdChiTieu,
            tongTien: mulMoney(this.tongTien, this.maDviTien),
            kphiDaCap: mulMoney(this.kphiDaCap, this.maDviTien),
            ycauCapThem: mulMoney(this.tongTien - this.kphiDaCap, this.maDviTien),
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
            this.quanLyVonPhiService.taoMoiDeNghi(request).toPromise().then(
                async (data) => {
                    if (data.statusCode == 0) {
                        this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
                        this.router.navigate([
                            '/qlcap-von-phi-hang/quan-ly-cap-nguon-von-chi/de-nghi-theo-quyet-dinh-don-gia-mua/0/' + data.data.id,
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
            this.quanLyVonPhiService.updateDeNghi(request).toPromise().then(
                async data => {
                    if (data.statusCode == 0) {
                        this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
                        await this.getDetailReport();
                        this.getStatusButton();
                    } else {
                        this.notification.error(MESSAGE.ERROR, data?.msg);
                    }
                },
                err => {
                    this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
                },
            );
        }
        this.spinner.hide();
    }

    // them dong moi
    addLine(id: number): void {
        let item: ItemData = {
            id: uuid.v4() + 'FE',
            stt: '',
            maHang: "",
            maDviTinh: "",
            soLuong: 0,
            donGiaMua: 0,
            thanhTien: 0,
            checked: false,
        }

        this.lstCtietBcao.splice(id, 0, item);
        this.editCache[item.id] = {
            edit: true,
            data: { ...item }
        };
    }

    // xoa dong
    deleteById(id: any): void {
        this.tongTien -= this.lstCtietBcao.find(e => e.id == id).thanhTien;
        this.lstCtietBcao = this.lstCtietBcao.filter(item => item.id != id)
    }

    // xóa với checkbox
    deleteSelected() {
        // delete object have checked = true
        this.lstCtietBcao.forEach(item => {
            if (item.checked) {
                this.tongTien -= item.thanhTien;
            }
        })
        this.lstCtietBcao = this.lstCtietBcao.filter(item => item.checked != true)
        this.allChecked = false;
    }

    // click o checkbox all
    updateAllChecked(): void {
        if (this.allChecked) {                                    // checkboxall == true thi set lai lstCTietBCao.checked = true
            this.lstCtietBcao = this.lstCtietBcao.map(item => ({
                ...item,
                checked: true
            }));
        } else {
            this.lstCtietBcao = this.lstCtietBcao.map(item => ({    // checkboxall == false thi set lai lstCTietBCao.checked = false
                ...item,
                checked: false
            }));
        }
    }

    // click o checkbox single
    updateSingleChecked(): void {
        if (this.lstCtietBcao.every(item => item.checked)) {     // tat ca o checkbox deu = true thi set o checkbox all = true
            this.allChecked = true;
        } else {                                                        // o checkbox vua = false, vua = true thi set o checkbox all = indeterminate
            this.allChecked = false;
        }
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
        if (!this.lstCtietBcao[index].maHang) {
            this.deleteById(id);
            return;
        }
        this.editCache[id] = {
            data: { ...this.lstCtietBcao[index] },
            edit: false
        };
    }

    // luu thay doi
    saveEdit(id: string): void {
        if (!this.editCache[id].data.maHang ||
            (!this.editCache[id].data.soLuong && this.editCache[id].data.soLuong !== 0) ||
            (!this.editCache[id].data.donGiaMua && this.editCache[id].data.donGiaMua !== 0)) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
            return;
        }
        this.editCache[id].data.checked = this.lstCtietBcao.find(item => item.id === id).checked; // set checked editCache = checked lstCtietBcao
        const index = this.lstCtietBcao.findIndex(item => item.id === id);   // lay vi tri hang minh sua
        this.tongTien -= this.lstCtietBcao[index].thanhTien;
        Object.assign(this.lstCtietBcao[index], this.editCache[id].data); // set lai data cua lstCtietBcao[index] = this.editCache[id].data
        this.editCache[id].edit = false;  // CHUYEN VE DANG TEXT
        this.tongTien += this.lstCtietBcao[index].thanhTien;
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

    //gia tri cac o input thay doi thi tinh toan lai
    changeModel(id: string): void {
        this.editCache[id].data.maDviTinh = this.vatTus.find(e => e.ma == this.editCache[id].data.maHang)?.maDviTinh;
        this.editCache[id].data.thanhTien = this.editCache[id].data.soLuong * this.editCache[id].data.donGiaMua;
    }

    //lay ten don vi tạo
    getUnitName() {
        return this.donVis.find((item) => item.maDvi == this.maDviTao)?.tenDvi;
    }

    getStatusName(id: string) {
        return this.trangThais.find(e => e.id == id)?.tenDm;
    }

    close() {
        if (this.id && !this.loai){
            this.location.back();
        }
        if (!this.loai){
            this.loai = "0";
        }
        this.router.navigate([
            'qlcap-von-phi-hang/quan-ly-cap-nguon-von-chi/tim-kiem/' + this.loai
        ])
    }

    showDialogCopy() {
        let obj = {
            qdChiTieu: this.qdChiTieu,
        }
        const modalTuChoi = this.modal.create({
            nzTitle: 'Copy Đề nghị',
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
        if (!this.maDviTien || 
            (!this.kphiDaCap && this.kphiDaCap !== 0)) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
            return;
        }

        let checkSave = true;
        this.lstCtietBcao.forEach(item => {
            if (this.editCache[item.id].edit) {
                checkSave = false;
            }
        })
        if (!checkSave) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTSAVE);
            return;
        }

        if (mulMoney(this.tongTien, this.maDviTien) > MONEY_LIMIT) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.MONEYRANGE);
        }

        let lstCtietBcaoTemp: ItemData[] = [];
        this.lstCtietBcao.forEach(item => {
            lstCtietBcaoTemp.push({
                ...item,
                thanhTien: mulMoney(item.thanhTien, this.maDviTien),
                id: null,
            })
        })
        // gui du lieu trinh duyet len server
        let request = JSON.parse(JSON.stringify({
            id: null,
            fileDinhKems: [],
            listIdDeleteFiles: [],
            dnghiCapvonCtiets: lstCtietBcaoTemp,
            congVan: null,
            maDvi: this.maDviTao,
            maDnghi: maDeNghiNew,
            loaiDnghi: this.loaiDn,
            canCuVeGia: this.canCuGia,
            maDviTien: this.maDviTien,
            soQdChiTieu: response.qdChiTieu,
            tongTien: mulMoney(this.tongTien, this.maDviTien),
            kphiDaCap: mulMoney(this.kphiDaCap, this.maDviTien),
            ycauCapThem: mulMoney(this.tongTien - this.kphiDaCap, this.maDviTien),
            trangThai: "1",
            thuyetMinh: this.thuyetMinh,
        }));

        this.spinner.show();
        this.quanLyVonPhiService.taoMoiDeNghi(request).toPromise().then(
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
