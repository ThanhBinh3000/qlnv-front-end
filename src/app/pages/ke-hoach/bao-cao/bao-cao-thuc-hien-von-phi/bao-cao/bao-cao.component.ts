import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as fileSaver from 'file-saver';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogBaoCaoCopyComponent } from 'src/app/components/dialog/dialog-bao-cao-copy/dialog-bao-cao-copy.component';
import { DialogChonThemBieuMauBaoCaoComponent } from 'src/app/components/dialog/dialog-chon-them-bieu-mau-bao-cao-kqth-von-phi-hang-DTQG/dialog-chon-them-bieu-mau-bao-cao-kqth-von-phi-hang-DTQG.component';
import { DialogCopyComponent } from 'src/app/components/dialog/dialog-copy/dialog-copy.component';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { BaoCaoThucHienVonPhiService } from 'src/app/services/quan-ly-von-phi/baoCaoThucHienVonPhi.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';
import { FileFunction, GeneralFunction, divNumber, sumNumber } from 'src/app/Utility/func';
import { BAO_CAO_DOT, BCVP, TRANG_THAI_PHU_LUC, TRANG_THAI_TIM_KIEM, Utils } from 'src/app/Utility/utils';
import * as uuid from 'uuid';
import { BAO_CAO_CHI_TIET_THUC_HIEN_PHI_NHAP_HANG_DTQG, BAO_CAO_CHI_TIET_THUC_HIEN_PHI_XUAT_HANG_CUU_TRO_VIEN_TRO, BAO_CAO_CHI_TIET_THUC_HIEN_PHI_XUAT_HANG_DTQG, KHAI_THAC_BAO_CAO_CHI_TIET_THUC_HIEN_PHI_BAO_QUAN_LAN_DAU_HANG_DTQG, LISTBIEUMAUDOT, LISTBIEUMAUNAM } from './bao-cao.constant';
import { BtnStatus, Doc, Form, Report } from '../../bao-cao.class';

// export class ItemDanhSach {
//     id!: any;
//     maBcao!: string;
//     namBcao!: number;
//     dotBcao!: number;
//     thangBcao!: number;
//     trangThai!: string;
//     ngayTao!: string;
//     nguoiTao!: string;
//     maDviTien!: string;
//     maDvi: number;
//     congVan!: ItemCongVan;
//     ngayTrinh!: string;
//     ngayDuyet!: string;
//     ngayPheDuyet!: string;
//     ngayTraKq!: string;
//     // dung cho request
//     fileDinhKems!: any[];
//     listIdDeletes!: string;
//     listIdDeleteFiles = '';
//     maPhanBcao = "1";

//     maLoaiBcao!: string;
//     stt!: string;
//     checked!: boolean;
//     lstBcaos: ItemData[] = [];
//     lstFile: any[] = [];
//     lstBcaoDviTrucThuocs: any[] = [];
//     tongHopTuIds!: [];
// }

// export class ItemCongVan {
//     fileName: string;
//     fileSize: number;
//     fileUrl: number;
// }
// export class ItemData {
//     id!: any;
//     maLoai!: string;
//     maDviTien!: any;
//     lstCtietBcaos!: any;
//     trangThai!: string;
//     checked!: boolean;
//     tieuDe!: string;
//     tenPhuLuc!: string;
//     thuyetMinh!: string;
//     lyDoTuChoi!: string;
//     lstIdDeletes!: [];
//     nguoiBcao!: string;
//     bcaoId!: string;
//     tuNgay: string;
//     denNgay: string;
// }

@Component({
    selector: 'app-bao-cao',
    templateUrl: './bao-cao.component.html',
    styleUrls: ['./bao-cao.component.scss',
    ],
})
export class BaoCaoComponent implements OnInit {
    @Input() data;
    @Output() dataChange = new EventEmitter();
    //thong tin dang nhap
    userInfo: any;
    //thong tin chung bao cao
    baoCao: Report = new Report();
    //danh muc
    nguoiBcaos: any[];
    donVis: any = [];                           // danh muc don vi
    childUnit: any = [];
    luyKes: Form[] = [];
    lstVatTus: any[] = [];
    lstBieuMaus: any[] = [];
    trangThais: any[] = TRANG_THAI_TIM_KIEM;
    //file
    listFile: File[] = [];                      // list file chua ten va id de hien tai o input
    fileList: NzUploadFile[] = [];
    fileDetail: NzUploadFile;
    path: string;
    //trang thai cac nut
    status: BtnStatus = new BtnStatus();
    isDataAvailable = false;
    isOffice: boolean;
    //khac
    allChecked = false;                         // check all checkbox
    editCache: { [key: string]: { edit: boolean; data: any } } = {};     // phuc vu nut chinh
    //phan tab
    tabSelected: string;
    tabs: any[] = [];
    selectedIndex = 1;
    //truyen du lieu sang tab con
    tabData: any;

    // before uploaf file
    beforeUpload = (file: NzUploadFile): boolean => {
        this.fileList = this.fileList.concat(file);
        return false;
    };

    // before uploaf file
    beforeUploadCV = (file: NzUploadFile): boolean => {
        this.fileDetail = file;
        this.baoCao.congVan = {
            ...new Doc(),
            fileName: file.name,
        };
        return false;
    };

    // them file vao danh sach
    handleUpload(): void {
        this.fileList.forEach((file: any) => {
            const id = file?.lastModified.toString();
            this.baoCao.lstFile.push({ id: id, fileName: file?.name });
            this.listFile.push(file);
        });
        this.fileList = [];
    }

    constructor(
        private baoCaoThucHienVonPhiService: BaoCaoThucHienVonPhiService,
        private quanLyVonPhiService: QuanLyVonPhiService,
        private danhMucService: DanhMucHDVService,
        private spinner: NgxSpinnerService,
        private datePipe: DatePipe,
        private userService: UserService,
        private notification: NzNotificationService,
        private modal: NzModalService,
        public globals: Globals,
        public genFunc: GeneralFunction,
        public fileFunc: FileFunction,
    ) { }

    async ngOnInit() {
        this.action('init');
    }

    async action(code: string) {
        this.spinner.show();
        this.isDataAvailable = false;
        switch (code) {
            case 'init':
                await this.initialization().then(() => {
                    this.isDataAvailable = true;
                });
                break;
            case 'detail':
                await this.getDetailReport().then(() => {
                    this.isDataAvailable = true;
                });
                break;
            case 'save':
                await this.save().then(() => {
                    this.isDataAvailable = true;
                })
                break;
            case 'submit':
                await this.submitReport().then(() => {
                    this.isDataAvailable = true;
                })
                break;
            case 'nonpass':
                await this.tuChoi('3').then(() => {
                    this.isDataAvailable = true;
                })
                break;
            case 'pass':
                await this.onSubmit('4', null).then(() => {
                    this.isDataAvailable = true;
                })
                break;
            case 'nonapprove':
                await this.tuChoi('5').then(() => {
                    this.isDataAvailable = true;
                })
                break;
            case 'approve':
                await this.onSubmit('7', null).then(() => {
                    this.isDataAvailable = true;
                })
                break;
            case 'nonaccept':
                await this.tuChoi('8').then(() => {
                    this.isDataAvailable = true;
                })
                break;
            case 'accept':
                await this.onSubmit('9', null).then(() => {
                    this.isDataAvailable = true;
                })
                break;
            default:
                break;
        }
        this.tabs = [];
        this.spinner.hide();
    }

    async initialization() {
        //lay thong tin chung bao cao
        this.baoCao.id = this.data?.id;
        this.userInfo = this.userService.getUserLogin();
        this.isOffice = this.userInfo.DON_VI.tenVietTat.indexOf('_VP') != -1;

        await this.danhMucService.dMDviCon().toPromise().then(
            (data) => {
                if (data.statusCode == 0) {
                    this.childUnit = data.data;
                } else {
                    this.notification.error(MESSAGE.ERROR, data?.msg);
                }
            },
            (err) => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
            }
        )

        await this.getListVatTu();

        this.getListUser();
        if (this.baoCao.id) {
            await this.getDetailReport();
        } else {
            this.baoCao.maDvi = this.userInfo?.MA_DVI;
            await this.getDviCon();
            this.baoCaoThucHienVonPhiService.taoMaBaoCao().toPromise().then(
                (data) => {
                    if (data.statusCode == 0) {
                        this.baoCao.maBcao = data.data;
                    } else {
                        this.notification.error(MESSAGE.ERROR, data?.msg);
                    }
                },
                (err) => {
                    this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
                }
            );
            this.baoCao.maLoaiBcao = this.data?.maLoaiBcao;
            this.baoCao.namBcao = this.data?.namBcao;
            this.baoCao.dotBcao = this.data?.dotBcao == 0 ? null : this.data?.dotBcao;
            this.baoCao.nguoiTao = this.userInfo.sub;
            this.baoCao.ngayTao = this.datePipe.transform(new Date(), Utils.FORMAT_DATE_STR);
            this.baoCao.trangThai = "1";
            this.lstBieuMaus = this.baoCao.maLoaiBcao == BAO_CAO_DOT ? LISTBIEUMAUDOT : LISTBIEUMAUNAM;
            if (this.data?.isSynthetic || (this.isOffice)) {
                await this.callSynthetic();
            } else {
                this.lstBieuMaus.forEach(item => {
                    this.baoCao.lstBcaos.push({
                        ... new Form(),
                        id: uuid.v4() + 'FE',
                        tieuDe: item.tieuDe + (this.baoCao.maLoaiBcao == BAO_CAO_DOT ? this.baoCao.dotBcao : this.baoCao.namBcao),
                        maLoai: item.maPhuLuc,
                        tenPhuLuc: item.tenPhuLuc,
                        trangThai: '3',
                        lstCtietBcaos: [],
                    });
                })
                if (this.isOffice) {
                    this.baoCao.lstBcaos = this.baoCao.lstBcaos.filter(e => e.maLoai != '4' && e.maLoai != '5');
                }
            }
        }

        this.getLuyKe();
        this.getStatusButton();
        this.spinner.hide();
    }

    async getListVatTu() {
        let vatTus: any;
        await this.danhMucService.dMVatTu().toPromise().then(res => {
            if (res.statusCode == 0) {
                vatTus = res.data;
            } else {
                this.notification.error(MESSAGE.ERROR, res?.msg);
            }
        }, err => {
            this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        })
        vatTus.forEach(element => {
            this.getFullVatu(element);
        })
    }

    getFullVatu(vatTu: any) {
        this.lstVatTus.push({
            id: vatTu.id,
            ma: vatTu.ma,
            ten: vatTu.ten,
        })
        vatTu?.child.forEach(item => {
            this.getFullVatu(item);
        })
    }

    async getDviCon() {
        const request = {
            maDviCha: this.baoCao.maDvi,
            trangThai: '01',
        }
        await this.quanLyVonPhiService.dmDviCon(request).toPromise().then(
            data => {
                if (data.statusCode == 0) {
                    this.donVis = data.data;
                } else {
                    this.notification.error(MESSAGE.ERROR, data?.msg);
                }
            },
            (err) => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
            }
        )
    }

    getLuyKe() {
        const request = {
            dotBcao: this.baoCao?.dotBcao,
            maPhanBcao: "1",
            namBcao: this.baoCao?.namBcao,
            thangBcao: null
        }
        this.baoCaoThucHienVonPhiService.getLuyKe(request).toPromise().then(res => {
            if (res.statusCode == 0) {
                this.luyKes = res.data.lstBcaos;
            } else {
                this.notification.error(MESSAGE.ERROR, res?.msg);
            }
        }, (err) => {
            this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        })
    }

    getListUser() {
        this.quanLyVonPhiService.getListUser().toPromise().then(
            res => {
                if (res.statusCode == 0) {
                    this.nguoiBcaos = res.data;
                }
            },
            (err) => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
            })
    }

    //check role cho các nut trinh duyet
    getStatusButton() {
        const isSynthetic = this.baoCao.lstBcaoDviTrucThuocs.length != 0;
        const isChild = this.baoCao.maDvi == this.userInfo?.MA_DVI;
        const isParent = this.childUnit.findIndex(e => e.maDvi == this.baoCao.maDvi) != -1;
        //kiem tra quyen cua cac user
        const checkSave = isSynthetic ? this.userService.isAccessPermisson(BCVP.EDIT_SYNTHETIC_REPORT) : this.userService.isAccessPermisson(BCVP.EDIT_REPORT);
        const checkSunmit = isSynthetic ? this.userService.isAccessPermisson(BCVP.APPROVE_SYNTHETIC_REPORT) : this.userService.isAccessPermisson(BCVP.APPROVE_REPORT);
        const checkPass = isSynthetic ? this.userService.isAccessPermisson(BCVP.DUYET_SYNTHETIC_REPORT) : this.userService.isAccessPermisson(BCVP.DUYET_REPORT);
        const checkApprove = isSynthetic ? this.userService.isAccessPermisson(BCVP.PHE_DUYET_SYNTHETIC_REPORT) : this.userService.isAccessPermisson(BCVP.PHE_DUYET_REPORT);
        const checkAccept = this.userService.isAccessPermisson(BCVP.TIEP_NHAN_REPORT);
        // const checkCopy = isSynthetic ? this.userService.isAccessPermisson(BCVP.COPY_SYNTHETIC_REPORT) : this.userService.isAccessPermisson(BCVP.COPY_REPORT);
        const checkPrint = isSynthetic ? this.userService.isAccessPermisson(BCVP.PRINT_SYTHETIC_REPORT) : this.userService.isAccessPermisson(BCVP.PRINT_REPORT);
        const checkExport = this.userService.isAccessPermisson(BCVP.EXPORT_EXCEL_REPORT);

        this.status.general = Utils.statusSave.includes(this.baoCao.trangThai) && checkSave;
        this.status.new = ([Utils.TT_BC_3, Utils.TT_BC_5, Utils.TT_BC_8].includes(this.baoCao.trangThai)) && this.userService.isAccessPermisson(BCVP.ADD_REPORT) && isChild;
        this.status.save = Utils.statusSave.includes(this.baoCao.trangThai) && checkSave && isChild;
        this.status.submit = Utils.statusApprove.includes(this.baoCao.trangThai) && checkSunmit && isChild && !(!this.baoCao.id);
        this.status.pass = Utils.statusDuyet.includes(this.baoCao.trangThai) && checkPass && isChild;
        this.status.approve = Utils.statusPheDuyet.includes(this.baoCao.trangThai) && checkApprove && isChild;
        this.status.accept = Utils.statusTiepNhan.includes(this.baoCao.trangThai) && checkAccept && isParent;
        this.status.print = Utils.statusPrint.includes(this.baoCao.trangThai) && checkPrint && isChild;
        this.status.export = Utils.statusExport.includes(this.baoCao.trangThai) && checkExport && isChild;
        this.status.ok = this.status.accept || this.status.approve || this.status.pass
        this.status.finish = this.status.general;
    }

    back() {
        if (this.data?.preData) {
            this.dataChange.emit(this.data?.preData)
        } else {
            const obj = {
                tabSelected: this.data?.preTab,
            }
            this.dataChange.emit(obj);
        }
    }

    // lay ten don vi tao
    getUnitName(maDvi: string) {
        return this.donVis.find(item => item.maDvi == maDvi)?.tenDvi;
    }

    // lay ten trang thai ban ghi
    getStatusName(status: string) {
        const statusMoi = status == Utils.TT_BC_6 || status == Utils.TT_BC_7;
        const isParent = this.childUnit.findIndex(e => e.maDvi == this.baoCao.maDvi) != -1;
        if (statusMoi && isParent) {
            return 'Mới';
        } else {
            return this.trangThais.find(e => e.id == status)?.tenDm;
        }
    }

    getStatusAppendixName(id) {
        return TRANG_THAI_PHU_LUC.find(item => item.id == id)?.ten;
    }

    // call chi tiet bao cao
    async getDetailReport() {
        await this.baoCaoThucHienVonPhiService.baoCaoChiTiet(this.baoCao.id).toPromise().then(async data => {
            if (data.statusCode == 0) {
                this.baoCao = data.data;
                this.lstBieuMaus = this.baoCao.maLoaiBcao == BAO_CAO_DOT ? LISTBIEUMAUDOT : LISTBIEUMAUNAM;
                this.baoCao?.lstBcaos?.forEach(item => {
                    const index = this.lstBieuMaus.findIndex(data => data.maPhuLuc == item.maLoai);
                    if (index != -1) {
                        item.checked = false;
                        item.tenPhuLuc = this.lstBieuMaus[index].tenPhuLuc;
                        item.tieuDe = this.lstBieuMaus[index].tieuDe + (this.baoCao.maLoaiBcao == BAO_CAO_DOT ? this.baoCao.dotBcao : this.baoCao.namBcao);
                    }
                })

                this.listFile = [];
                await this.getDviCon();
                //this.maDonViTao = data.data.maDvi;
                this.baoCao.ngayDuyet = this.datePipe.transform(data.data.ngayDuyet, Utils.FORMAT_DATE_STR);
                this.baoCao.ngayPheDuyet = this.datePipe.transform(data.data.ngayPheDuyet, Utils.FORMAT_DATE_STR);
                this.baoCao.ngayTraKq = this.datePipe.transform(data.data.ngayTraKq, Utils.FORMAT_DATE_STR);
                this.baoCao.ngayTrinh = this.datePipe.transform(data.data.ngayTrinh, Utils.FORMAT_DATE_STR);
                this.baoCao.ngayTao = this.datePipe.transform(data.data.ngayTao, Utils.FORMAT_DATE_STR);
            } else {
                this.notification.error(MESSAGE.ERROR, data?.msg);
            }
        }, (err) => {
            this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
        })
    }

    async submitReport() {
        this.modal.confirm({
            nzClosable: false,
            nzTitle: 'Xác nhận',
            nzContent: 'Bạn có chắc chắn muốn trình duyệt?<br/>(Trình duyệt trước khi lưu báo cáo có thể gây mất dữ liệu)',
            nzOkText: 'Đồng ý',
            nzCancelText: 'Không',
            nzOkDanger: true,
            nzWidth: 500,
            nzOnOk: () => {
                this.onSubmit(Utils.TT_BC_2, '')
            },
        });
    }

    // chuc nang check role
    async onSubmit(mcn: string, lyDoTuChoi: string) {
        if (!this.baoCao?.congVan?.fileUrl) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.DOCUMENTARY);
            return;
        }
        const checkStatusReport = this.baoCao?.lstBcaos?.findIndex(item => item.trangThai != '5');
        if (checkStatusReport != -1 && mcn == Utils.TT_BC_2) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.WARNING_FINISH_INPUT);
            return;
        }
        const requestGroupButtons = {
            id: this.baoCao.id,
            maChucNang: mcn,
            lyDoTuChoi: lyDoTuChoi,
        };
        await this.baoCaoThucHienVonPhiService.approveBaoCao(requestGroupButtons).toPromise().then(async (data) => {
            if (data.statusCode == 0) {
                this.baoCao.trangThai = mcn;
                this.baoCao.ngayTrinh = this.datePipe.transform(data.data.ngayTrinh, Utils.FORMAT_DATE_STR);
                this.baoCao.ngayDuyet = this.datePipe.transform(data.data.ngayDuyet, Utils.FORMAT_DATE_STR);
                this.baoCao.ngayPheDuyet = this.datePipe.transform(data.data.ngayPheDuyet, Utils.FORMAT_DATE_STR);
                this.baoCao.ngayTraKq = this.datePipe.transform(data.data.ngayTraKq, Utils.FORMAT_DATE_STR);
                if (mcn == Utils.TT_BC_8 || mcn == Utils.TT_BC_5 || mcn == Utils.TT_BC_3) {
                    this.notification.success(MESSAGE.SUCCESS, MESSAGE.REJECT_SUCCESS);
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
    }

    //show popup tu choi
    async tuChoi(mcn: string) {
        const modalTuChoi = this.modal.create({
            nzTitle: 'Từ chối',
            nzContent: DialogTuChoiComponent,
            nzMaskClosable: false,
            nzClosable: false,
            nzWidth: '900px',
            nzFooter: null,
            nzComponentParams: {},
        });
        modalTuChoi.afterClose.toPromise().then(async (text) => {
            if (text) {
                this.onSubmit(mcn, text);
            }
        });
    }

    // luu
    async save() {
        const baoCaoTemp = JSON.parse(JSON.stringify(this.baoCao));
        //get list file url
        const listFile: any = [];
        for (const iterator of this.listFile) {
            listFile.push(await this.uploadFile(iterator));
        }
        //get file cong van url
        const file: any = this.fileDetail;
        if (file) {
            baoCaoTemp.congVan = await this.uploadFile(file);
        }
        if (!baoCaoTemp.congVan) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.DOCUMENTARY);
            return;
        }

        let checkPersonReport = true;
        /////////////////////////////
        baoCaoTemp.lstBcaos.forEach((item) => {
            item.tuNgay = typeof item.tuNgay == 'string' ? new Date(item.tuNgay) : item.tuNgay;
            item.denNgay = typeof item.denNgay == 'string' ? new Date(item.denNgay) : item.denNgay;
            if (!item.nguoiBcao) {
                checkPersonReport = false;
                this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.PERSONREPORT);
                return;
            }
            if (item.id?.length == 38) {
                item.id = null;
            }
            if (!this.baoCao.id) {
                item.trangThai = '3'; // set trang thai phu luc la chua danh gia
            }
            item.lstCtietBcaos.forEach(data => {
                if (data?.id.length == 38) {
                    data.id = null;
                }
                if (data.maLoai == BAO_CAO_CHI_TIET_THUC_HIEN_PHI_XUAT_HANG_DTQG || data.maLoai == BAO_CAO_CHI_TIET_THUC_HIEN_PHI_NHAP_HANG_DTQG ||
                    data.maLoai == BAO_CAO_CHI_TIET_THUC_HIEN_PHI_XUAT_HANG_CUU_TRO_VIEN_TRO || data.maLoai == KHAI_THAC_BAO_CAO_CHI_TIET_THUC_HIEN_PHI_BAO_QUAN_LAN_DAU_HANG_DTQG) {
                    data.listCtiet.forEach(element => {
                        if (element?.id.length == 38) {
                            element.id = null;
                        }
                    })
                }
            })
        });

        if (!checkPersonReport) {
            return;
        } else {
            // replace nhung ban ghi dc them moi id thanh null
            baoCaoTemp.tongHopTuIds = [];
            baoCaoTemp?.lstBcaoDviTrucThuocs?.filter(item => {
                baoCaoTemp.tongHopTuIds.push(item.id);
            })

            baoCaoTemp.fileDinhKems = listFile;
            baoCaoTemp.trangThai = "1";
            //baoCaoTemp.maDvi = this.maDonViTao;
            baoCaoTemp.maPhanBcao = '1';

            //call service them moi
            if (!this.baoCao.id) {
                //net la tao bao cao moi thi khong luu lstCtietBcaos, con la tong hop thi khong luu
                // if (!this.data?.isSynthetic) {
                //     baoCaoTemp?.lstBcaos?.filter(item => item.lstCtietBcaos = []);
                // }
                await this.baoCaoThucHienVonPhiService.trinhDuyetBaoCaoThucHienDTCService(baoCaoTemp).toPromise().then(
                    async data => {
                        if (data.statusCode == 0) {
                            this.notification.success(MESSAGE.SUCCESS, MESSAGE.SUCCESS);
                            this.baoCao.id = data.data.id
                            await this.getDetailReport();
                            const dataTemp = {
                                id: data.data.id,
                                tabSelected: this.data.tabSelected,
                                preTab: this.data.preTab,
                            }
                            this.data = dataTemp;
                            this.getStatusButton();
                        } else {
                            this.notification.error(MESSAGE.ERROR, data?.msg);
                        }
                    },
                    err => {
                        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
                    },
                );
            } else {
                await this.baoCaoThucHienVonPhiService.updateBaoCaoThucHienDTC(baoCaoTemp).toPromise().then(async res => {
                    if (res.statusCode == 0) {
                        this.notification.success(MESSAGE.SUCCESS, MESSAGE.SUCCESS);
                        await this.getDetailReport();
                        this.getStatusButton();
                    } else {
                        this.notification.error(MESSAGE.ERROR, res?.msg);
                    }
                }, err => {
                    this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
                })
            }
        }
        this.spinner.hide();
    }

    // call tong hop bao cao
    async callSynthetic() {
        const request = {
            maLoaiBcao: this.baoCao.maLoaiBcao,
            namBcao: this.baoCao.namBcao,
            thangBcao: null,
            dotBcao: this.baoCao.dotBcao,
            maPhanBcao: '1',
        }
        if (this.isOffice) {
            await this.baoCaoThucHienVonPhiService.tongHopVanPhong(request).toPromise().then(
                async (data) => {
                    if (data.statusCode == 0) {
                        this.baoCao.lstBcaos = data.data.lstBcaos;
                        // this.baoCao.lstBcaoDviTrucThuocs = data.data.lstBcaoDviTrucThuocs;
                    } else {
                        this.notification.error(MESSAGE.ERROR, data?.msg);
                    }
                },
                (err) => {
                    this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
                }
            );
        } else {
            await this.baoCaoThucHienVonPhiService.tongHopBaoCaoKetQua(request).toPromise().then(
                async (data) => {
                    if (data.statusCode == 0) {
                        this.baoCao.lstBcaos = data.data.lstBcaos;
                        this.baoCao.lstBcaoDviTrucThuocs = data.data.lstBcaoDviTrucThuocs;
                    } else {
                        this.notification.error(MESSAGE.ERROR, data?.msg);
                    }
                },
                (err) => {
                    this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
                }
            );
        }

        this.baoCao?.lstBcaos?.forEach(item => {
            item.id = uuid.v4() + "FE";
            item.maDviTien = '1';
            item.checked = false;
            item.trangThai = '3';
            item.nguoiBcao = this.userInfo?.sub;
            const index = this.lstBieuMaus.findIndex(data => data.maPhuLuc == item.maLoai);
            if (index != -1) {
                item.tieuDe = this.lstBieuMaus[index].tieuDe + (this.baoCao.maLoaiBcao == BAO_CAO_DOT ? this.baoCao.dotBcao : this.baoCao.namBcao);
                item.tenPhuLuc = this.lstBieuMaus[index].tenPhuLuc;
            }
            if (item.maLoai == '4') {
                item.lstCtietBcaos.forEach(e => {
                    e.khGiaMuaTd = divNumber(e.khTtien, e.khSoLuong);
                    e.thGiaMuaTd = divNumber(e.thTtien, e.thSoLuong);
                })
            }
            if (item.maLoai == '5') {
                item.lstCtietBcaos.forEach(e => {
                    e.ttClechGiaTteVaGiaHtoan = sumNumber([e.ttGiaBanTte, -e.ttGiaHtoan]);
                })
            }
        })

        this.baoCao?.lstBcaoDviTrucThuocs?.forEach(item => {
            item.ngayTrinh = this.datePipe.transform(item.ngayTrinh, Utils.FORMAT_DATE_STR);
            item.ngayDuyet = this.datePipe.transform(item.ngayDuyet, Utils.FORMAT_DATE_STR);
            item.ngayPheDuyet = this.datePipe.transform(item.ngayPheDuyet, Utils.FORMAT_DATE_STR);
            item.ngayTraKq = this.datePipe.transform(item.ngayTraKq, Utils.FORMAT_DATE_STR);
        })
        this.listFile = [];
        this.baoCao.trangThai = "1";
    }

    // them phu luc
    addPhuLuc() {
        let danhSach: any;
        this.lstBieuMaus.forEach(item => item.status = false);
        danhSach = this.lstBieuMaus.filter(item => this.baoCao?.lstBcaos?.findIndex(data => data.maLoai == item.maPhuLuc) == -1);

        const modalIn = this.modal.create({
            nzTitle: 'Danh sách mẫu báo cáo',
            nzContent: DialogChonThemBieuMauBaoCaoComponent,
            nzMaskClosable: false,
            nzClosable: false,
            nzWidth: '600px',
            nzFooter: null,
            nzComponentParams: {
                ChonThemBieuMauBaoCao: danhSach
            },
        });
        modalIn.afterClose.subscribe((res) => {
            if (res) {
                res.forEach(item => {
                    if (item.status) {
                        this.baoCao.lstBcaos.push({
                            id: uuid.v4() + 'FE',
                            checked: false,
                            tieuDe: item.tieuDe,
                            maLoai: item.maPhuLuc,
                            tenPhuLuc: item.tenPhuLuc,
                            trangThai: '3',
                            lstCtietBcaos: [],
                            maDviTien: '1',
                            thuyetMinh: null,
                            lyDoTuChoi: null,
                            nguoiBcao: null,
                            tuNgay: '',
                            denNgay: '',
                        });
                    }
                })
            }
        });
    }

    // xoa phu luc
    deletePhuLucList() {
        this.baoCao.lstBcaos = this.baoCao?.lstBcaos.filter(item => item.checked == false);
        if (this.baoCao?.lstBcaos?.findIndex(item => item.maLoai == this.tabSelected) == -1) {
            this.tabSelected = null;
        }
        this.allChecked = false;
    }

    // click o checkbox single
    updateSingleChecked(): void {
        if (this.baoCao?.lstBcaos.every(item => !item.checked)) {           // tat ca o checkbox deu = false thi set o checkbox all = false
            this.allChecked = false;
        } else if (this.baoCao?.lstBcaos.every(item => item.checked)) {     // tat ca o checkbox deu = true thi set o checkbox all = true
            this.allChecked = true;
        }
    }

    updateAllChecked(): void {
        this.baoCao?.lstBcaos.filter(item =>
            item.checked = this.allChecked
        );
    }

    closeTab({ index }: { index: number }): void {
        this.tabs.splice(index - 1, 1);
    }

    newTab(maPhuLuc: any): void {
        const index: number = this.tabs.findIndex(e => e.id === maPhuLuc);
        if (index != -1) {
            this.selectedIndex = index + 1;
        } else {
            const item = this.baoCao.lstBcaos.find(e => e.maLoai == maPhuLuc);
            this.tabData = {
                ...item,
                trangThaiBaoCao: this.baoCao.trangThai,
                status: this.status,
                idBaoCao: this.baoCao.id,
                luyKes: this.luyKes,
                namBcao: this.baoCao.namBcao,
                maDvi: this.baoCao.maDvi,
                dotBcao: this.baoCao.dotBcao,
                isOffice: this.isOffice,
                isSynthetic: this.baoCao.lstBcaoDviTrucThuocs.length != 0,
                lstVtus: this.lstVatTus,
            }
            this.tabs = [];
            this.tabs.push(this.baoCao?.lstBcaos.find(item => item.maLoai == maPhuLuc));
            this.selectedIndex = this.tabs.length + 1;
        }
    }

    getNewData(obj: any) {
        const index = this.baoCao?.lstBcaos.findIndex(e => e.maLoai == this.tabs[0].maLoai);
        if (obj?.lstCtietBcaos) {
            this.baoCao.lstBcaos[index].maDviTien = obj.maDviTien;
            this.baoCao.lstBcaos[index].lstCtietBcaos = obj.lstCtietBcaos;
            this.baoCao.lstBcaos[index].trangThai = obj.trangThai;
            this.baoCao.lstBcaos[index].thuyetMinh = obj.thuyetMinh;
            this.baoCao.lstBcaos[index].lyDoTuChoi = obj.lyDoTuChoi;
            this.baoCao.lstBcaos[index].tuNgay = obj.tuNgay;
            this.baoCao.lstBcaos[index].denNgay = obj.denNgay;
        } else {
            this.baoCao.lstBcaos[index].trangThai = obj?.trangThai;
            this.baoCao.lstBcaos[index].lyDoTuChoi = obj?.lyDoTuChoi;
        }
        this.tabs = [];
        this.selectedIndex = 0;
    }

    //download file về máy tính
    async downloadFile(id: string) {
        const file: File = this.listFile.find(element => element?.lastModified.toString() == id);
        if (!file) {
            const fileAttach = this.baoCao.lstFile.find(element => element?.id == id);
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
        if (this.baoCao?.congVan?.fileUrl) {
            await this.quanLyVonPhiService.downloadFile(this.baoCao?.congVan?.fileUrl).toPromise().then(
                (data) => {
                    fileSaver.saveAs(data, this.baoCao?.congVan?.fileName);
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

    //upload file
    async uploadFile(file: File) {
        // day file len server
        const upfile: FormData = new FormData();
        upfile.append('file', file);
        upfile.append('folder', this.baoCao.maDvi + '/' + this.baoCao.maBcao);
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
        // this.lstFiles = this.lstFiles.filter((a: any) => a.id !== id);
        // this.listFile = this.listFile.filter((a: any) => a?.lastModified.toString() !== id);
        // this.listIdFilesDelete.push(id);
    }

    viewDetail(id) {
        const obj = {
            id: id,
            preData: this.data,
            tabSelected: 'next' + this.data?.tabSelected,
        }
        this.dataChange.emit(obj);
    }

    showDialogCopy() {
        const modalTuChoi = this.modal.create({
            nzTitle: 'Copy Báo Cáo',
            nzContent: DialogBaoCaoCopyComponent,
            nzMaskClosable: false,
            nzClosable: false,
            nzWidth: '900px',
            nzFooter: null,
            nzComponentParams: {
                maPhanBcao: '1',
                maLoaiBcao: this.baoCao.maLoaiBcao,
                namBcao: this.baoCao.namBcao,
                dotBcao: this.baoCao.dotBcao,
                thangBcao: this.baoCao.thangBcao,
                checkDvtt: this.baoCao.lstBcaoDviTrucThuocs.length > 0 ? true : false,
            },
        });
        modalTuChoi.afterClose.toPromise().then(async (response) => {
            if (response) {
                this.doCopy(response);
            }
        });
    }

    async doCopy(response) {
        const maBaoCao = await this.baoCaoThucHienVonPhiService.taoMaBaoCao().toPromise().then(
            (data) => {
                if (data.statusCode == 0) {
                    return data.data;
                } else {
                    this.notification.error(MESSAGE.ERROR, data?.msg);
                    return null;
                }
            },
            (err) => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
                return null;
            }
        );
        if (!maBaoCao) {
            return;
        }

        const baoCaoTemp = JSON.parse(JSON.stringify(this.baoCao));
        baoCaoTemp.congVan = null;
        // set nambao,dot bao cao tu dialog gui ve
        baoCaoTemp.namBcao = response.namBcao;
        baoCaoTemp.dotBcao = response.dotBcao;
        if (response.loaiCopy == 'D') {
            //xoa lst don vi truc thuoc theo lua chon tu dialog
            baoCaoTemp.lstBcaoDviTrucThuocs = [];
        }
        // replace nhung ban ghi dc them moi id thanh null
        baoCaoTemp?.lstBcaos?.filter(item => {
            item.id = null;
            item.listIdDelete = null;
            item.trangThai = '3'; // set trang thai phu luc la chua danh gia
            item?.lstCtietBcaos.filter(data => {
                data.id = null;
            })
        })
        // replace nhung ban ghi dc them moi id thanh null
        baoCaoTemp.id = null;
        baoCaoTemp.maBcao = maBaoCao;
        baoCaoTemp.tongHopTuIds = [];
        baoCaoTemp?.lstBcaoDviTrucThuocs?.filter(item => {
            baoCaoTemp.tongHopTuIds.push(item.id);
        })
        baoCaoTemp.fileDinhKems = [];
        baoCaoTemp.listIdFiles = null;
        baoCaoTemp.trangThai = "1";
        //baoCaoTemp.maDvi = this.maDonViTao;
        baoCaoTemp.maPhanBcao = '1';

        //call service them moi
        this.baoCaoThucHienVonPhiService.trinhDuyetBaoCaoThucHienDTCService(baoCaoTemp).toPromise().then(
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
                            maBcao: maBaoCao
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

    statusClass() {
        if (Utils.statusSave.includes(this.baoCao.trangThai)) {
            return 'du-thao-va-lanh-dao-duyet';
        } else {
            return 'da-ban-hanh';
        }
    }
}
