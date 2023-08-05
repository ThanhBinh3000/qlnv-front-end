import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { GiaoDuToanChiService } from 'src/app/services/quan-ly-von-phi/giaoDuToanChi.service';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';
import { FileManip, GDT, Roles, Status, TRANG_THAI_PHU_LUC, TRANG_THAI_TIM_KIEM, Utils } from 'src/app/Utility/utils';
import * as fileSaver from 'file-saver';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { ComponentType } from '@angular/cdk/portal';
import { PhuLuc01NhapComponent } from './phu-luc-01-nhap/phu-luc-01-nhap.component';
import { PhuLuc01XuatComponent } from './phu-luc-01-xuat/phu-luc-01-xuat.component';
import { PhuLuc02Component } from './phu-luc-02/phu-luc-02.component';
import { PhuLuc03Component } from './phu-luc-03/phu-luc-03.component';
import { PhuLucPhanBoComponent } from './phu-luc-phan-bo/phu-luc-phan-bo.component';
import { DialogChonThemBieuMauComponent } from 'src/app/components/dialog/dialog-chon-them-bieu-mau/dialog-chon-them-bieu-mau.component';
import { PHU_LUC } from './add-bao-cao.constant';
import * as uuid from 'uuid';
import { DatePipe } from '@angular/common';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { PhuLucSuaChuaComponent } from './phu-luc-sua-chua/phu-luc-sua-chua.component';
import { PhuLucTaiSanComponent } from './phu-luc-tai-san/phu-luc-tai-san.component';
import { PhuLucQuyLuongComponent } from './phu-luc-quy-luong/phu-luc-quy-luong.component';
import { PhuLucDaoTaoComponent } from './phu-luc-dao-tao/phu-luc-dao-tao.component';
import { PhuLucKhoaHocCongNgheComponent } from './phu-luc-khoa-hoc-cong-nghe/phu-luc-khoa-hoc-cong-nghe.component';
import { BtnStatus, Doc, Form, Gdt, Report } from '../giao-du-toan.constant';
import { DialogCongVanComponent } from 'src/app/components/dialog/dialog-cong-van/dialog-cong-van.component';


// export class ItemCongVan {
//     fileName: string;
//     fileSize: number;
//     fileUrl: number;
// }

// export class ItemData {
//     id: string;
//     maBieuMau: string;
//     tenPl: string;
//     tenDm: string;
//     trangThai: string;
//     maDviTien: string;
//     lyDoTuChoi: string;
//     thuyetMinh: string;
//     nguoiBcao: string;
//     lstCtietBcaos: any[];
//     hsBhDuoi: number;
//     hsBhTu: number;
// }

// export class BaoCao {
//     id: string;
//     maPa: string;
//     maBcao: string; // Thêm trường maBcao	
//     namPa: number;
//     trangThai: string;
//     maDvi: string;
//     maDviCha: string; // chưa dùng	
//     maGiao: string;
//     soQd: ItemCongVan;
//     // maLoaiDan: string;
//     // maPhanGiao: string;
//     maPaCha: string;
//     ngayQd: any;
//     namDtoan: number;
//     noiQd: string;
//     namBcao: number;
//     maDviTien: string;
//     thuyetMinh: string;
//     ngayTao: any;
//     nguoiTao: string;
//     ngayTrinh: any;
//     nguoiTrinh: string;
//     ngayDuyet: any;
//     nguoiDuyet: string;
//     ngayPheDuyet: any;
//     nguoiPheDuyet: string;
//     ngayTraKq: any;
//     nguoiTraKq: string;
//     ngaySua: any;
//     nguoiSua: string;
//     lyDoTuChoi: string;
//     trangThaiGiao: string;
//     tenDvi: string;
//     tongHopTuIds: any[];
//     fileDinhKems: any[];
//     lstFiles: any[];
//     listIdFiles: any[];
//     lstCtiets: ItemData[];
//     lstGiaoDtoanTrucThuocs: any[];
//     lichSu: History[];
// }



@Component({
    selector: 'app-add-bao-cao',
    templateUrl: './add-bao-cao.component.html',
    styleUrls: ['./add-bao-cao.component.scss']
})
export class AddBaoCaoComponent implements OnInit {
    @Input() data
    @Output() dataChange = new EventEmitter();
    Utils = Utils;
    Status = Status;

    userInfo: any;
    trangThais: any[] = TRANG_THAI_TIM_KIEM;
    canBos: any[];
    isDataAvailable = false;
    // status = false;                             // trang thai an/ hien cua trang thai
    saveStatus = true;                          // trang thai an/hien nut luu
    submitStatus = true;                        // trang thai an/hien nut trinh duyet
    passStatus = true;                          // trang thai an/hien nut truong bo phan
    approveStatus = true;                       // trang thai an/hien nut lanh dao
    acceptStatus = true;                        // trang thai nut don vi cap tren
    copyStatus = true;                          // trang thai copy
    printStatus = true;                         // trang thai print
    okStatus = true;                            // trang thai ok/ not ok
    finishStatus = true;                        // trang thai hoan tat nhap lieu
    viewAppraisalValue = true;
    path: string;
    isOffice: boolean;
    // thong tin chi tiet bao cao
    baoCao: Report = new Report();
    listAppendix: any[] = PHU_LUC;

    fileDetail: NzUploadFile;
    fileList: NzUploadFile[] = [];
    listFile: File[] = [];
    childUnit: any[] = [];
    selectedIndex = 0;

    beforeUpload = (file: NzUploadFile): boolean => {
        this.fileList = this.fileList.concat(file);
        return false;
    };

    // before uploaf file
    beforeUploadCV = (file: NzUploadFile): boolean => {
        const modalAppendix = this.modal.create({
            nzTitle: 'Thêm mới công văn',
            nzContent: DialogCongVanComponent,
            nzBodyStyle: { overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' },
            nzMaskClosable: false,
            nzWidth: '60%',
            nzFooter: null,
            nzComponentParams: {
            },
        });
        modalAppendix.afterClose.toPromise().then(async (res) => {
            if (res) {
                this.baoCao.ngayCongVan = res.ngayCongVan;
                this.baoCao.soQd = {
                    ...new Doc(),
                    fileName: res.soCongVan,
                };
            }
        });
        this.fileDetail = file;
        return false;
    };

    // them file vao danh sach
    handleUpload(): void {
        this.fileList.forEach((file: any) => {
            const id = file?.lastModified.toString();
            this.baoCao.lstFiles.push({ id: id, fileName: file?.name });
            this.listFile.push(file);
        });
        this.fileList = [];
    }

    constructor(
        public globals: Globals,
        private spinner: NgxSpinnerService,
        private modal: NzModalService,
        private userService: UserService,
        private giaoDuToanChiService: GiaoDuToanChiService,
        private notification: NzNotificationService,
        private quanLyVonPhiService: QuanLyVonPhiService,
        private datePipe: DatePipe,
        public fileManip: FileManip,
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
        // this.tabs = [];
        this.spinner.hide();
    };


    async initialization() {
        //lay thong tin chung bao cao
        // console.log(this.data);

        this.baoCao.id = this.data?.id;
        this.userInfo = this.userService.getUserLogin();
        this.getListUser();
        this.path = this.baoCao.maDvi + '/' + this.baoCao.maBcao;
        this.isOffice = this.userInfo.DON_VI.tenVietTat.indexOf('_VP') != -1;
        //lay danh sach danh muc don vi
        await this.getChildUnit();
        await this.getListUser();

        if (this.baoCao.id) {
            await this.getDetailReport();
        } else {
            this.baoCao.namBcao = this.data.namBcao;
            this.baoCao.maPa = this.data?.maPa;
            this.baoCao.maPaCha = this.data?.maPaCha;
            this.baoCao.maDvi = this.data?.maDvi ? this.data?.maDvi : this.userInfo?.MA_DVI;
            // this.baoCao.maLoaiDan = this.data?.maLoaiDan
            // this.baoCao.maPhanGiao = "3"
            this.baoCao.maBcao = this.data?.maBcao
            // this.baoCao.soQd = this.data?.soQd
            if (this.data.preTab == "tongHopBaoCaoCapDuoi") {
                this.baoCao.lstCtiets = this.data?.lstCtiets ? this.data?.lstCtiets : [];
                this.baoCao.maPaCha = this.data?.maPaCha;
            }
            let lstCtietsPhuLucPhanBo
            if (this.data.preTab == "chiTietDuToanCapTren") {
                this.baoCao.lstCtiets = [];
                lstCtietsPhuLucPhanBo = this.data?.lstCtiets;
            }
            if (this.data?.lstGiaoDtoanTrucThuocs) {
                this.baoCao.lstGiaoDtoanTrucThuocs = this.data?.lstGiaoDtoanTrucThuocs;
                this.baoCao.trangThai = "1";
                this.baoCao.nguoiTao = this.userInfo?.sub;
                this.baoCao.ngayTao = this.datePipe.transform(new Date(), Utils.FORMAT_DATE_STR);
                this.baoCao.namPa = this.data?.namPa;
                this.baoCao.namDtoan = this.data?.namDtoan;
                this.baoCao.tongHopTuIds = [];
                this.baoCao.lstFiles = [];
                this.baoCao.listIdFiles = [];
            } else {
                this.baoCao.lstGiaoDtoanTrucThuocs = this.data?.lstDviTrucThuoc ? this.data?.lstDviTrucThuoc : [];
                this.baoCao.trangThai = "1";
                this.baoCao.nguoiTao = this.userInfo?.sub;
                this.baoCao.ngayTao = this.datePipe.transform(new Date(), Utils.FORMAT_DATE_STR);
                this.baoCao.namPa = this.data?.namPa;
                this.baoCao.namDtoan = this.data?.namDtoan;
                this.baoCao.tongHopTuIds = [];
                this.baoCao.lstFiles = [];
                this.baoCao.listIdFiles = [];
            }
            if (this.baoCao.lstGiaoDtoanTrucThuocs?.length == 0) {
                this.listAppendix.forEach(item => {
                    // if (item.id == "pl09") {
                    //     this.baoCao.lstCtiets.push({
                    //         ...new ItemData(),
                    //         id: uuid.v4() + 'FE',
                    //         maBieuMau: item.id,
                    //         tenPl: item.tenPl,
                    //         tenDm: item.tenDm + " năm " + this.baoCao.namPa,
                    //         trangThai: '3',
                    //         lstCtietBcaos: lstCtietsPhuLucPhanBo,
                    //         nguoiBcao: this.userInfo?.sub
                    //     })
                    // } else {
                    this.baoCao.lstCtiets.push({
                        ...new Form(),
                        id: uuid.v4() + 'FE',
                        maBieuMau: item.id,
                        tenPl: item.tenPl,
                        tenDm: item.tenDm + " năm " + this.baoCao.namBcao,
                        trangThai: '3',
                        lstCtietBcaos: [],
                        nguoiBcao: this.userInfo?.sub
                    })
                    // }
                })
            } else {
                this.baoCao?.lstGiaoDtoanTrucThuocs.forEach(item => {
                    if (item.ngayDuyet.includes("/")) {
                        item.ngayDuyet = item.ngayDuyet;
                        item.ngayPheDuyet = item.ngayPheDuyet;
                    } else {
                        item.ngayDuyet = this.datePipe.transform(item.ngayDuyet, Utils.FORMAT_DATE_STR);
                        item.ngayPheDuyet = this.datePipe.transform(item.ngayPheDuyet, Utils.FORMAT_DATE_STR);
                    }
                })
                this.baoCao.lstCtiets.forEach(item => {
                    item.trangThai = "3"
                    item.maDviTien = "1"
                    const pl = this.listAppendix.find(e => e.id == item.maBieuMau);
                    item.tenPl = pl.tenPl;
                    item.tenDm = pl.tenDm + " năm " + this.baoCao.namBcao;
                    item.nguoiBcao = this.userInfo?.sub
                    item.maBieuMau = pl.id

                    // if (item.maBieuMau == "pl09") {
                    //     item.lstCtietBcaos.forEach(s => {
                    //         s.id = null
                    //         s.lstCtietDvis.forEach(v => {
                    //             v.id = null
                    //         })
                    //     })
                    // } else {
                    item.lstCtietBcaos.forEach(s => {
                        s.id = null
                    })
                    // }
                })
            }
        }
        // console.log(this.baoCao);

        this.getStatusButton();
        this.spinner.hide();
    };


    addAppendix() {
        let danhMuc = [];
        let danhSach = [];
        let title = '';
        switch (this.selectedIndex) {
            case 0:
                danhMuc = this.listAppendix.filter(e => e.id.startsWith('pl'));
                danhSach = danhMuc.filter(item => this.baoCao.lstCtiets.findIndex(e => e.maBieuMau == item.id) == -1);
                title = 'Danh sách phụ lục';
                break;
            default:
                break;
        }

        const modalIn = this.modal.create({
            nzTitle: title,
            nzContent: DialogChonThemBieuMauComponent,
            nzBodyStyle: { overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' },
            nzMaskClosable: false,
            nzClosable: false,
            nzWidth: '600px',
            nzFooter: null,
            nzComponentParams: {
                danhSachBieuMau: danhSach
            },
        });
        modalIn.afterClose.subscribe((res) => {
            if (res) {
                res.forEach(item => {
                    if (item.status) {
                        const newItem: Form = {
                            ... new Form(),
                            id: uuid.v4() + 'FE',
                            maBieuMau: item.id,
                            tenPl: item.tenPl,
                            tenDm: item.tenDm,
                            trangThai: '3',
                            lstCtietBcaos: [],
                        }
                        this.baoCao.lstCtiets.push(newItem);
                    }
                })
            }
        });
    }

    getIndex(maBieuMau: string) {
        let header = '';
        if (maBieuMau.startsWith('pl')) {
            header = 'pl';
        };
        let index = 0;
        for (let i = 0; i < this.baoCao.lstCtiets.length; i++) {
            if (this.baoCao.lstCtiets[i].maBieuMau.startsWith(header)) {
                index += 1;
            }
            if (this.baoCao.lstCtiets[i].maBieuMau == maBieuMau) {
                break;
            }
        }
        return index;
    };


    getStatusAppendixName(id) {
        return TRANG_THAI_PHU_LUC.find(item => item.id == id)?.ten;
    };

    getListUser() {
        this.quanLyVonPhiService.getListUser().toPromise().then(
            res => {
                if (res.statusCode == 0) {
                    this.canBos = res.data;
                }
            },
            (err) => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
            })
    };

    viewAppendix(id: string) {
        const isSynthetic = this.baoCao.lstGiaoDtoanTrucThuocs && this.baoCao.lstGiaoDtoanTrucThuocs.length != 0;
        const bieuMau = this.baoCao.lstCtiets.find(e => e.id == id);
        const dataInfo = {
            // data: formDetail,
            // id: id,
            // extraData: null,
            // maDvi: this.baoCao.maDvi,
            // namBcao: this.baoCao.namBcao,
            // statusBtnOk: this.okStatus,
            // statusBtnFinish: this.finishStatus,
            // statusBtnPrint: this.printStatus,
            // acceptStatus: this.acceptStatus,
            // status: new BtnStatus(),userInfo
            // isSynthetic: isSynthetic

            id: id,
            maBieuMau: bieuMau.maBieuMau,
            maBcao: this.baoCao.maBcao,
            maDvi: this.baoCao.maDvi,
            capDvi: this.userInfo.CAP_DVI,
            tenDvi: this.userInfo.TEN_DVI,
            namBcao: this.baoCao.namBcao,
            path: this.path,
            status: new BtnStatus(),
            isSynthetic: isSynthetic,
            isOffice: this.isOffice,
            listFile: this.listFile
        };
        Object.assign(dataInfo.status, this.status);
        dataInfo.status.general = dataInfo.status.general && (this.userInfo?.sub == bieuMau.nguoiBcao);

        let nzContent: ComponentType<any>;
        switch (bieuMau.maBieuMau) {
            case 'pl01N':
                nzContent = PhuLuc01NhapComponent;
                break;
            case 'pl01X':
                nzContent = PhuLuc01XuatComponent;
                break;
            case 'pl02':
                nzContent = PhuLuc02Component;
                break;
            case 'pl03':
                nzContent = PhuLuc03Component;
                break;
            case 'pl04':
                nzContent = PhuLucSuaChuaComponent;
                break;
            case 'pl05':
                nzContent = PhuLucTaiSanComponent;
                break;
            case 'pl06':
                nzContent = PhuLucQuyLuongComponent;
                break;
            case 'pl07':
                nzContent = PhuLucDaoTaoComponent;
                break;
            case 'pl08':
                nzContent = PhuLucKhoaHocCongNgheComponent;
                break;
            case 'pl09':
                nzContent = PhuLucPhanBoComponent;
                // if (isSynthetic == false) {
                //     dataInfo.extraData = [];
                //     const data1N = this.baoCao.lstCtiets.find(e => e.maBieuMau == 'pl01N');
                //     const data1X = this.baoCao.lstCtiets.find(e => e.maBieuMau == 'pl01X');
                //     const data2 = this.baoCao.lstCtiets.find(e => e.maBieuMau == 'pl02');
                //     const data3 = this.baoCao.lstCtiets.find(e => e.maBieuMau == 'pl03');
                //     const data4 = this.baoCao.lstCtiets.find(e => e.maBieuMau == 'pl04');
                //     const data5 = this.baoCao.lstCtiets.find(e => e.maBieuMau == 'pl05');
                //     const data6 = this.baoCao.lstCtiets.find(e => e.maBieuMau == 'pl06');
                //     const data7 = this.baoCao.lstCtiets.find(e => e.maBieuMau == 'pl07');
                //     const data8 = this.baoCao.lstCtiets.find(e => e.maBieuMau == 'pl08');
                //     let tongPl1N = 0
                //     let tongPl1X = 0
                //     let tongPl2 = 0
                //     let tongPl3 = 0
                //     let tongPl4 = 0
                //     let tongPl5 = 0
                //     let tongPl6 = 0
                //     let tongPl7 = 0
                //     let tongPl8 = 0

                //     if (data1N && data1N?.trangThai != '3') {
                //         const dataPL1N = this.baoCao.lstCtiets.find(e => e.maBieuMau == 'pl01N')?.lstCtietBcaos;
                //         let lstN = []
                //         dataPL1N?.forEach(i => {
                //             if (i.stt.length == 3) {
                //                 lstN.push(i)
                //             }
                //         })
                //         if (lstN.length > 0) {
                //             lstN?.forEach(i => {
                //                 tongPl1N += i.namDtTtien ? i.namDtTtien : 0;
                //             })
                //         }
                //     }
                //     if (data1X && data1X?.trangThai != '3') {
                //         const dataPL1X = this.baoCao.lstCtiets.find(e => e.maBieuMau == 'pl01X')?.lstCtietBcaos;
                //         let lstX = []
                //         dataPL1X?.forEach(i => {
                //             if (i.stt.length == 3) {
                //                 lstX.push(i)
                //             }
                //         })
                //         if (lstX.length > 0) {
                //             lstX?.forEach(i => {
                //                 tongPl1X += i.namDtTtien ? i.namDtTtien : 0;
                //             })
                //         }
                //     }

                //     if (data2 && data2?.trangThai != '3') {
                //         const dataPL2 = this.baoCao.lstCtiets.find(e => e.maBieuMau == 'pl02')?.lstCtietBcaos;
                //         let lstPl2 = []
                //         dataPL2?.forEach(i => {
                //             if (i.stt.length == 3) {
                //                 lstPl2.push(i)
                //             }
                //         })
                //         if (lstPl2.length > 0) {
                //             lstPl2?.forEach(i => {
                //                 tongPl2 += i.namDtTtien ? i.namDtTtien : 0;
                //             })
                //         }
                //     }

                //     if (data3 && data3?.trangThai != '3') {
                //         const dataPL3 = this.baoCao.lstCtiets.find(e => e.maBieuMau == 'pl03')?.lstCtietBcaos;
                //         let lstPl3 = []
                //         dataPL3?.forEach(i => {
                //             if (i.stt.length == 3) {
                //                 lstPl3.push(i)
                //             }
                //         })
                //         if (lstPl3.length > 0) {
                //             lstPl3?.forEach(i => {
                //                 tongPl3 += i.namDtTcong ? i.namDtTcong : 0
                //             })
                //         }
                //     }

                //     if (data4 && data4?.trangThai != '3') {
                //         const dataPL4 = this.baoCao.lstCtiets.find(e => e.maBieuMau == 'pl04')?.lstCtietBcaos;
                //         let lstPl4 = []
                //         dataPL4?.forEach(i => {
                //             if (i.stt.length == 3) {
                //                 lstPl4.push(i)
                //             }
                //         })
                //         if (lstPl4.length > 0) {
                //             lstPl4?.forEach(i => {
                //                 tongPl4 += i.dToanNam ? i.dToanNam : 0
                //             })
                //         }
                //     }

                //     if (data5 && data5?.trangThai != '3') {
                //         const dataPL5 = this.baoCao.lstCtiets.find(e => e.maBieuMau == 'pl05')?.lstCtietBcaos;
                //         let lstPl5 = []
                //         dataPL5?.forEach(i => {
                //             if (i.stt.length == 3) {
                //                 lstPl5.push(i)
                //             }
                //         })
                //         if (lstPl5.length > 0) {
                //             lstPl5?.forEach(i => {
                //                 tongPl5 += i.ttien ? i.ttien : 0
                //             })
                //         }
                //     }

                //     if (data6 && data6?.trangThai != '3') {
                //         const dataPL6 = this.baoCao.lstCtiets.find(e => e.maBieuMau == 'pl06')?.lstCtietBcaos;
                //         let lstPl6 = []
                //         dataPL6?.forEach(i => {
                //             if (i.stt.length == 3) {
                //                 lstPl6.push(i)
                //             }
                //         })
                //         if (lstPl6.length > 0) {
                //             lstPl6?.forEach(i => {
                //                 tongPl6 += i.ttien ? i.ttien : 0
                //             })
                //         }
                //     }

                //     if (data7 && data7?.trangThai != '3') {
                //         const dataPL7 = this.baoCao.lstCtiets.find(e => e.maBieuMau == 'pl07')?.lstCtietBcaos;
                //         let lstPl7 = []
                //         dataPL7?.forEach(i => {
                //             if (i.stt.length == 3) {
                //                 lstPl7.push(i)
                //             }
                //         })
                //         if (lstPl7.length > 0) {
                //             lstPl7?.forEach(i => {
                //                 tongPl7 += i.TongNCDtoanKp ? i.TongNCDtoanKp : 0
                //             })
                //         }
                //     }

                //     if (data8 && data8?.trangThai != '3') {
                //         const dataPL8 = this.baoCao.lstCtiets.find(e => e.maBieuMau == 'pl08')?.lstCtietBcaos;
                //         let lstPl8 = []
                //         dataPL8?.forEach(i => {
                //             if (i.stt.length == 3) {
                //                 lstPl8.push(i)
                //             }
                //         })
                //         if (lstPl8.length > 0) {
                //             lstPl8?.forEach(i => {
                //                 tongPl8 += i.tongNcauDtoan ? i.tongNcauDtoan : 0
                //             })
                //         }
                //     }

                //     let soTranChi = tongPl1N + tongPl1X + tongPl3 + tongPl2 + tongPl4
                //     const lstCtietPlTong = this.baoCao.lstCtiets.find(item => item.maBieuMau == "pl09")
                //     let tongCong = lstCtietPlTong?.lstCtietBcaos.find(itm => itm.stt == "0.1.2.2")?.tongCong
                //     let tongCong1N = lstCtietPlTong?.lstCtietBcaos.find(itm => itm.stt == "0.1.2.2.1")?.tongCong
                //     let tongCong1X = lstCtietPlTong?.lstCtietBcaos.find(itm => itm.stt == "0.1.2.2.2")?.tongCong
                //     let tongCong2 = lstCtietPlTong?.lstCtietBcaos.find(itm => itm.stt == "0.1.2.2.3")?.tongCong
                //     let tongCong3 = lstCtietPlTong?.lstCtietBcaos.find(itm => itm.stt == "0.1.2.2.4")?.tongCong
                //     let tongCong4 = lstCtietPlTong?.lstCtietBcaos.find(itm => itm.stt == "0.1.2.1")?.tongCong
                //     let tongCong5 = lstCtietPlTong?.lstCtietBcaos.find(itm => itm.stt == "0.1.2.4.1")?.tongCong
                //     let tongCong6 = lstCtietPlTong?.lstCtietBcaos.find(itm => itm.stt == "0.2.1.1")?.tongCong
                //     let tongCong7 = lstCtietPlTong?.lstCtietBcaos.find(itm => itm.stt == "0.3.1")?.tongCong
                //     let tongCong8 = lstCtietPlTong?.lstCtietBcaos.find(itm => itm.stt == "0.1.2.4.1")?.tongCong

                //     if (
                //         (
                //             data1N ||
                //             data1X ||
                //             data2 ||
                //             data3 ||
                //             data4
                //         )
                //         &&
                //         lstCtietPlTong?.trangThai != '3'
                //     ) {
                //         dataInfo.extraData.push({
                //             dtoanGiao: tongCong,
                //             id: uuid.v4() + "FE",
                //             stt: "0.1.2.2",
                //             loaiPa: null,
                //             nguonKhac: null,
                //             nguonNsnn: null,
                //             panDtCtietId: null,
                //             lstCtietDvis: [
                //                 {
                //                     id: uuid.v4() + "FE",
                //                     maDviNhan: this.baoCao.maDvi,
                //                     soTranChi: soTranChi
                //                 }
                //             ],
                //             maNdung: "0.1.2.2",
                //             tongCong: soTranChi
                //         })
                //     }
                //     if (data1N && data1N?.trangThai != '3') {
                //         dataInfo.extraData.push({
                //             dtoanGiao: tongCong1N,
                //             id: uuid.v4() + "FE",
                //             stt: "0.1.2.2.2",
                //             loaiPa: null,
                //             nguonKhac: null,
                //             nguonNsnn: null,
                //             panDtCtietId: null,
                //             lstCtietDvis: [
                //                 {
                //                     id: uuid.v4() + "FE",
                //                     maDviNhan: this.baoCao.maDvi,
                //                     soTranChi: tongPl1N
                //                 }
                //             ],
                //             maNdung: "0.1.2.2.2",
                //             tongCong: tongPl1N
                //         })
                //     }

                //     if (data1X && data1X?.trangThai != '3') {
                //         dataInfo.extraData.push({
                //             dtoanGiao: tongCong1X,
                //             id: uuid.v4() + "FE",
                //             stt: "0.1.2.2.3",
                //             loaiPa: null,
                //             nguonKhac: null,
                //             nguonNsnn: null,
                //             panDtCtietId: null,
                //             lstCtietDvis: [
                //                 {
                //                     id: uuid.v4() + "FE",
                //                     maDviNhan: this.baoCao.maDvi,
                //                     soTranChi: tongPl1X
                //                 }
                //             ],
                //             maNdung: "0.1.2.2.3",
                //             tongCong: tongPl1X
                //         })
                //     }

                //     if (data3 && data3?.trangThai != '3') {
                //         dataInfo.extraData.push({
                //             dtoanGiao: tongCong3,
                //             id: uuid.v4() + "FE",
                //             stt: "0.1.2.2.4",
                //             loaiPa: null,
                //             nguonKhac: null,
                //             nguonNsnn: null,
                //             panDtCtietId: null,
                //             lstCtietDvis: [
                //                 {
                //                     id: uuid.v4() + "FE",
                //                     maDviNhan: this.baoCao.maDvi,
                //                     soTranChi: tongPl3
                //                 }
                //             ],
                //             maNdung: "0.1.2.2.4",
                //             tongCong: tongPl3
                //         })
                //     }

                //     if (data2 && data2?.trangThai != '3') {
                //         dataInfo.extraData.push({
                //             dtoanGiao: tongCong2,
                //             id: uuid.v4() + "FE",
                //             stt: "0.1.2.2.1",
                //             loaiPa: null,
                //             nguonKhac: null,
                //             nguonNsnn: null,
                //             panDtCtietId: null,
                //             lstCtietDvis: [
                //                 {
                //                     id: uuid.v4() + "FE",
                //                     maDviNhan: this.baoCao.maDvi,
                //                     soTranChi: tongPl2
                //                 }
                //             ],
                //             maNdung: "0.1.2.2.1",
                //             tongCong: tongPl2
                //         })
                //     }

                //     if (data4 && data4?.trangThai != '3') {
                //         dataInfo.extraData.push({
                //             dtoanGiao: tongCong4,
                //             id: uuid.v4() + "FE",
                //             stt: "0.1.2.1",
                //             loaiPa: null,
                //             nguonKhac: null,
                //             nguonNsnn: null,
                //             panDtCtietId: null,
                //             lstCtietDvis: [
                //                 {
                //                     id: uuid.v4() + "FE",
                //                     maDviNhan: this.baoCao.maDvi,
                //                     soTranChi: tongPl4
                //                 }
                //             ],
                //             maNdung: "0.1.2.1",
                //             tongCong: tongPl4
                //         })
                //     }
                //     if (data5 && data5?.trangThai != '3') {
                //         dataInfo.extraData.push({
                //             dtoanGiao: tongCong5,
                //             id: uuid.v4() + "FE",
                //             stt: "0.1.2.4.1",
                //             loaiPa: null,
                //             nguonKhac: null,
                //             nguonNsnn: null,
                //             panDtCtietId: null,
                //             lstCtietDvis: [
                //                 {
                //                     id: uuid.v4() + "FE",
                //                     maDviNhan: this.baoCao.maDvi,
                //                     soTranChi: tongPl5
                //                 }
                //             ],
                //             maNdung: "0.1.2.4.1",
                //             tongCong: tongPl5
                //         })
                //     }
                //     if (data6 && data6?.trangThai != '3') {
                //         dataInfo.extraData.push({
                //             dtoanGiao: tongCong6,
                //             id: uuid.v4() + "FE",
                //             stt: "0.2.1.1",
                //             loaiPa: null,
                //             nguonKhac: null,
                //             nguonNsnn: null,
                //             panDtCtietId: null,
                //             lstCtietDvis: [
                //                 {
                //                     id: uuid.v4() + "FE",
                //                     maDviNhan: this.baoCao.maDvi,
                //                     soTranChi: tongPl6
                //                 }
                //             ],
                //             maNdung: "0.2.1.1",
                //             tongCong: tongPl6
                //         })
                //     }
                //     if (data7 && data7?.trangThai != '3') {
                //         dataInfo.extraData.push({
                //             dtoanGiao: tongCong7,
                //             id: uuid.v4() + "FE",
                //             stt: "0.3.1",
                //             loaiPa: null,
                //             nguonKhac: null,
                //             nguonNsnn: null,
                //             panDtCtietId: null,
                //             lstCtietDvis: [
                //                 {
                //                     id: uuid.v4() + "FE",
                //                     maDviNhan: this.baoCao.maDvi,
                //                     soTranChi: tongPl7
                //                 }
                //             ],
                //             maNdung: "0.3.1",
                //             tongCong: tongPl7
                //         })
                //     }
                //     if (data8 && data8?.trangThai != '3') {
                //         dataInfo.extraData.push({
                //             dtoanGiao: tongCong8,
                //             id: uuid.v4() + "FE",
                //             stt: "0.3.1",
                //             loaiPa: null,
                //             nguonKhac: null,
                //             nguonNsnn: null,
                //             panDtCtietId: null,
                //             lstCtietDvis: [
                //                 {
                //                     id: uuid.v4() + "FE",
                //                     maDviNhan: this.baoCao.maDvi,
                //                     soTranChi: tongPl8
                //                 }
                //             ],
                //             maNdung: "0.3.1",
                //             tongCong: tongPl8
                //         })
                //     }
                // }
                break;
            default:
                break;
        }
        const modalAppendix = this.modal.create({
            nzTitle: bieuMau.tenDm,
            nzContent: nzContent,
            nzBodyStyle: { overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' },
            nzMaskClosable: false,
            // nzClosable: false,
            nzWidth: '90%',
            nzFooter: null,
            nzComponentParams: {
                dataInfo: dataInfo
            },
        });
        modalAppendix.afterClose.toPromise().then(async (res) => {
            if (res) {
                //gan lai thong tin sau khi bieu mau duoc luu
                bieuMau.trangThai = res?.trangThai;
            }
        });
    }

    deleteAppendix(id: string) {
        this.baoCao.lstCtiets = this.baoCao.lstCtiets.filter(item => item.id != id);
    }

    // chuc nang check role
    async onSubmit(mcn: string, lyDoTuChoi: string) {
        if (mcn == Utils.TT_BC_2) {
            if (!this.baoCao.soQd) {
                this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.DOCUMENTARY);
                return;
            }
            if (!this.baoCao.lstCtiets.every(e => e.trangThai == '5')) {
                this.notification.warning(MESSAGE.ERROR, MESSAGE.FINISH_FORM);
                return;
            }
        } else {
            let check = true;
            if (mcn == Utils.TT_BC_4 || mcn == Utils.TT_BC_7 || mcn == Utils.TT_BC_9) {
                this.baoCao.lstCtiets.forEach(item => {
                    if (item.trangThai == '2') {
                        check = false;
                    }
                })
            }
            if (!check) {
                this.notification.warning(MESSAGE.ERROR, MESSAGE.RATE_FORM);
                return;
            }
        }
        const requestGroupButtons = {
            id: this.baoCao.id,
            maChucNang: mcn,
            lyDoTuChoi: lyDoTuChoi,
        };
        await this.giaoDuToanChiService.approveBcao(requestGroupButtons).toPromise().then(async (data) => {
            if (data.statusCode == 0) {
                this.baoCao.trangThai = mcn;
                this.getStatusButton();
                if (mcn == Utils.TT_BC_8 || mcn == Utils.TT_BC_5 || mcn == Utils.TT_BC_3) {
                    this.notification.success(MESSAGE.SUCCESS, MESSAGE.REJECT_SUCCESS);
                } else {
                    this.notification.success(MESSAGE.SUCCESS, MESSAGE.APPROVE_SUCCESS);
                }
                // this.tabs = [];
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
    };

    // Xác nhận trình duyệt
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
    };

    // Lưu
    async save() {
        if (!this.baoCao.lstCtiets.every(e => e.nguoiBcao)) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
            return;
        }

        if (this.listFile.some(item => item.size > Utils.FILE_SIZE)) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.OVER_SIZE);
            return;
        }

        const tongHopTuIds = []
        const baoCaoTemp = JSON.parse(JSON.stringify({
            ...this.baoCao,
            tongHopTuIds
        }));
        this.baoCao.lstGiaoDtoanTrucThuocs.forEach(item => {
            baoCaoTemp.tongHopTuIds.push(item.id);
        })

        if (!baoCaoTemp.fileDinhKems) {
            baoCaoTemp.fileDinhKems = [];
        }
        for (const iterator of this.listFile) {
            baoCaoTemp.fileDinhKems.push(await this.fileManip.uploadFile(iterator, this.path));
        }
        //get file cong van url
        const file: any = this.fileDetail;
        if (file) {
            if (file.size > Utils.FILE_SIZE) {
                this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.OVER_SIZE);
                return;
            } else {
                baoCaoTemp.congVan = {
                    ...await this.fileManip.uploadFile(file, this.path),
                    fileName: this.baoCao.soQd.fileName,
                }
            }
            this.fileDetail = null;
        }

        if (!baoCaoTemp.congVan.fileUrl) {
            this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.DOCUMENTARY);
            return;
        }

        // replace nhung ban ghi dc them moi id thanh null
        baoCaoTemp.lstCtiets.forEach(item => {
            if (item.id?.length == 38) {
                item.id = null;
            }
        })


        //call service them moi
        if (!this.baoCao.id) {
            this.giaoDuToanChiService.taoMoiBaoCao(baoCaoTemp).toPromise().then(
                async data => {
                    if (data.statusCode == 0) {
                        this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
                        this.baoCao.id = data.data.id;
                        this.getDetailReport();
                        const dataTemp = {
                            id: data.data.id,
                            tabSelected: this.data.tabSelected,
                            preTab: this.data.preTab,
                        }
                        this.data = dataTemp;
                    } else {
                        this.notification.error(MESSAGE.ERROR, data?.msg);
                    }
                },
                err => {
                    this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
                },
            );
        } else {
            this.giaoDuToanChiService.updateBaoCaoGiaoDuToan(baoCaoTemp).toPromise().then(
                async data => {
                    if (data.statusCode == 0) {
                        this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
                        await this.getDetailReport();
                        if (this.data?.idSoTranChi) {
                            this.data.idSoTranChi = null;
                        }
                    } else {
                        this.notification.error(MESSAGE.ERROR, data?.msg);
                    }
                }, err => {
                    this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
                })
        }
    };


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


    async getDetailReport() {
        await this.giaoDuToanChiService.chiTietBaoCao(this.baoCao.id).toPromise().then(
            (data) => {
                if (data.statusCode == 0) {
                    this.baoCao = data.data;
                    this.baoCao.lstCtiets.forEach(item => {
                        const appendix = this.listAppendix.find(e => e.id == item.maBieuMau);
                        item.tenPl = appendix.tenPl;
                        item.tenDm = appendix.tenDm + " năm " + this.baoCao.namPa;
                    })
                    this.baoCao.ngayTao = this.datePipe.transform(this.baoCao.ngayTao, Utils.FORMAT_DATE_STR);
                    this.baoCao.ngayTrinh = this.datePipe.transform(this.baoCao.ngayTrinh, Utils.FORMAT_DATE_STR);
                    this.baoCao.ngayDuyet = this.datePipe.transform(this.baoCao.ngayDuyet, Utils.FORMAT_DATE_STR);
                    this.baoCao.ngayPheDuyet = this.datePipe.transform(this.baoCao.ngayPheDuyet, Utils.FORMAT_DATE_STR);
                    this.baoCao.ngayTraKq = this.datePipe.transform(this.baoCao.ngayTraKq, Utils.FORMAT_DATE_STR);
                    if (this.baoCao?.lstGiaoDtoanTrucThuocs) {
                        this.baoCao?.lstGiaoDtoanTrucThuocs.forEach(item => {
                            item.ngayDuyet = this.datePipe.transform(item.ngayDuyet, Utils.FORMAT_DATE_STR);
                            item.ngayPheDuyet = this.datePipe.transform(item.ngayPheDuyet, Utils.FORMAT_DATE_STR);
                        })
                    }
                    this.listFile = [];
                    this.baoCao.lstCtiets.forEach(item => {
                        // item.trangThai = "3"
                        // item.maDviTien = "1"
                        const pl = this.listAppendix.find(e => e.id == item.maBieuMau);
                        // item.tenPl = pl.tenPl;
                        item.tenDm = pl.tenDm + " năm " + this.baoCao.namBcao;
                        // item.nguoiBcao = this.userInfo?.sub
                        // item.maBieuMau = pl.id

                        // if (item.maBieuMau == "pl09") {
                        //     item.lstCtietBcaos.forEach(s => {
                        //         s.id = null
                        //         s.lstCtietDvis.forEach(v => {
                        //             v.id = null
                        //         })
                        //     })
                        // } else {
                        // item.lstCtietBcaos.forEach(s => {
                        //     s.id = null
                        // })
                        // }
                    })
                    this.getStatusButton();
                } else {
                    this.notification.error(MESSAGE.ERROR, data?.msg);
                }
            },
            (err) => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
            }
        );
    };

    back() {
        if (this.data?.preData) {
            this.dataChange.emit(this.data?.preData)
        } else {
            let id = localStorage.getItem("idChiTiet");
            const obj = {
                id: id,
                tabSelected: this.data?.preTab,
                preData: this.data,
            }
            this.dataChange.emit(obj);
            localStorage.removeItem("idChiTiet");
        }
    }

    statusClass() {
        if (Utils.statusSave.includes(this.baoCao.trangThai)) {
            return 'du-thao-va-lanh-dao-duyet';
        } else {
            return 'da-ban-hanh';
        }
    }

    getStatusName(status: string) {
        const statusMoi = status == Utils.TT_BC_6 || status == Utils.TT_BC_7;
        const maDviCha = this.baoCao.maDvi.slice(0, (this.baoCao.maDvi.length - 2));
        if (statusMoi && this.userInfo.MA_DVI == this.baoCao.maDviCha) {
            return 'Mới';
        } else {
            return this.trangThais.find(e => e.id == status)?.tenDm;
        }
    }


    statusDeleteCv() {
        if (!this.userService.isAccessPermisson(GDT.EDIT_REPORT_TH)) {
            return false;
        }
        if (!this.baoCao.soQd?.fileName) {
            return false;
        }
        let check = true;
        if (this.data?.lstDviTrucThuocs && this.data?.lstDviTrucThuocs.length > 0) {
            this.data.lstDviTrucThuocs.forEach(item => {
                if (item.trangThai == '1') {
                    check = true;
                    return;
                }
            })
        }
        return check;
    };

    //download file về máy tính
    async downloadFile(id: string) {
        let file: any;
        let doc: any;
        if (!id) {
            file = this.fileDetail;
            doc = this.baoCao.soQd
        } else {
            file = this.listFile.find(element => element?.lastModified.toString() == id);
            doc = this.baoCao.lstFiles.find(element => element?.id == id);
        }
        await this.fileManip.downloadFile(file, doc);
    }


    // getStatusButton() {
    //     const isSynthetic = this.baoCao.lstGiaoDtoanTrucThuocs && this.baoCao.lstGiaoDtoanTrucThuocs.length != 0;
    //     const isChild = this.userInfo.MA_DVI == this.baoCao.maDvi;
    //     const isParent = this.userInfo.MA_DVI == this.baoCao.maDviCha;
    //     //kiem tra quyen cua cac user
    //     const checkSave = isSynthetic ? this.userService.isAccessPermisson(GDT.EDIT_REPORT_TH) : this.userService.isAccessPermisson(GDT.EDIT_REPORT_TH);
    //     const checkSunmit = isSynthetic ? this.userService.isAccessPermisson(GDT.APPROVE_REPORT_TH) : this.userService.isAccessPermisson(GDT.APPROVE_REPORT_TH);
    //     const checkPass = isSynthetic ? this.userService.isAccessPermisson(GDT.DUYET_REPORT_TH) : this.userService.isAccessPermisson(GDT.DUYET_REPORT_TH);
    //     const checkApprove = isSynthetic ? this.userService.isAccessPermisson(GDT.PHEDUYET_REPORT_TH) : this.userService.isAccessPermisson(GDT.PHEDUYET_REPORT_TH);
    //     const checkAccept = this.userService.isAccessPermisson(GDT.TIEP_NHAN_TC_REPORT_TH);
    //     const checkCopy = isSynthetic ? this.userService.isAccessPermisson(GDT.COPY_REPORT_TH) : this.userService.isAccessPermisson(GDT.COPY_REPORT_PA_PBDT);
    //     const checkPrint = isSynthetic ? this.userService.isAccessPermisson(GDT.IN_PA_TONGHOP_PBDT) : this.userService.isAccessPermisson(GDT.PRINT_REPORT_PA_PBDT);
    //     if (Utils.statusSave.includes(this.baoCao.trangThai) && checkSave) {
    //         this.status = false;
    //     } else {
    //         this.status = true;
    //     }
    //     this.saveStatus = Utils.statusSave.includes(this.baoCao.trangThai) && checkSave && isChild;
    //     this.submitStatus = Utils.statusApprove.includes(this.baoCao.trangThai) && checkSunmit && isChild && !(!this.baoCao.id);
    //     this.passStatus = Utils.statusDuyet.includes(this.baoCao.trangThai) && checkPass && isChild;
    //     this.approveStatus = Utils.statusPheDuyet.includes(this.baoCao.trangThai) && checkApprove && isChild;
    //     this.acceptStatus = Utils.statusTiepNhan.includes(this.baoCao.trangThai) && checkAccept && isParent;
    //     this.copyStatus = Utils.statusCopy.includes(this.baoCao.trangThai) && checkCopy && isChild;
    //     this.printStatus = Utils.statusPrint.includes(this.baoCao.trangThai) && checkPrint && isChild;

    //     if (this.acceptStatus || this.approveStatus || this.passStatus) {
    //         this.okStatus = true;
    //     } else {
    //         this.okStatus = false;
    //     }
    //     if (this.saveStatus) {
    //         this.finishStatus = false;
    //     } else {
    //         this.finishStatus = true;
    //     }
    // };
    isChild: boolean;
    isParent: boolean;
    status: BtnStatus = new BtnStatus();
    //check role cho các nut trinh duyet
    getStatusButton() {
        // const isSynthetic = this.baoCao.lstGiaoDtoanTrucThuocs && this.baoCao.lstCtiets.length != 0;
        // this.isChild = this.userInfo.MA_DVI == this.baoCao.maDvi;
        // this.isParent = this.userInfo.MA_DVI == this.baoCao.maDviCha;
        // //kiem tra quyen cua cac user
        // const checkSave = isSynthetic ? this.userService.isAccessPermisson(Roles.GDT.EDIT_REPORT_TH) : this.userService.isAccessPermisson(Roles.GDT.EDIT_REPORT);
        // const checkSunmit = isSynthetic ? this.userService.isAccessPermisson(Roles.GDT.SUBMIT_SYNTH_REPORT) : this.userService.isAccessPermisson(Roles.GDT.SUBMIT_REPORT);
        // const checkPass = isSynthetic ? this.userService.isAccessPermisson(Roles.GDT.PASS_SYNTH_REPORT) : this.userService.isAccessPermisson(Roles.GDT.PASS_REPORT);
        // const checkApprove = isSynthetic ? this.userService.isAccessPermisson(Roles.GDT.APPROVE_SYNTH_REPORT) : this.userService.isAccessPermisson(Roles.GDT.APPROVE_REPORT);
        // const checkAccept = this.userService.isAccessPermisson(Roles.GDT.ACCEPT_REPORT);
        // const checkPrint = isSynthetic ? this.userService.isAccessPermisson(Roles.GDT.PRINT_SYNTH_REPORT) : this.userService.isAccessPermisson(Roles.GDT.PRINT_REPORT);
        // const checkExport = isSynthetic ? this.userService.isAccessPermisson(Roles.GDT.EXPORT_SYNTH_REPORT) : this.userService.isAccessPermisson(Roles.GDT.EXPORT_REPORT)

        // this.status.general = Status.check('saveWHist', this.baoCao.trangThai) && checkSave;
        // this.status.new = Status.check('reject', this.baoCao.trangThai) && this.userService.isAccessPermisson(Roles.GDT.ADD_REPORT) && this.isChild && this.data.preTab == Gdt.DANH_SACH_BAO_CAO;
        // this.status.viewAppVal = Status.check('appraisal', this.baoCao.trangThai);
        // this.status.save = Status.check('saveWHist', this.baoCao.trangThai) && checkSave && this.isChild;
        // this.status.submit = Status.check('submit', this.baoCao.trangThai) && checkSunmit && this.isChild && !(!this.baoCao.id);
        // this.status.pass = Status.check('pass', this.baoCao.trangThai) && checkPass && this.isChild;
        // this.status.approve = Status.check('approve', this.baoCao.trangThai) && checkApprove && this.isChild;
        // this.status.accept = Status.check('accept', this.baoCao.trangThai) && checkAccept && this.isParent;
        // // this.status.print = Utils.statusPrint.includes(this.baoCao.trangThai) && checkPrint && this.isChild;
        // this.status.export = Status.check('export', this.baoCao.trangThai) && checkExport && this.isChild;
        // this.status.ok = this.status.accept || this.status.approve || this.status.pass
        // this.status.finish = this.status.general;
        // this.status.editAppVal = this.status.accept;

        const isSynthetic = this.baoCao.lstGiaoDtoanTrucThuocs && this.baoCao.lstGiaoDtoanTrucThuocs.length != 0;
        this.isChild = this.userInfo.MA_DVI == this.baoCao.maDvi;
        this.isParent = this.userInfo.MA_DVI == this.baoCao.maDviCha;
        //kiem tra quyen cua cac user
        const checkSave = isSynthetic ? this.userService.isAccessPermisson(Roles.GDT.EDIT_REPORT_TH) : this.userService.isAccessPermisson(Roles.GDT.ADD_REPORT_TH);
        const checkSunmit = isSynthetic ? this.userService.isAccessPermisson(Roles.GDT.TRINHDUYET_PA_TONGHOP_PBDT) : this.userService.isAccessPermisson(Roles.GDT.APPROVE_REPORT_TH);
        const checkPass = isSynthetic ? this.userService.isAccessPermisson(Roles.GDT.DUYET_TUCHOI_PA_TH_PBDT) : this.userService.isAccessPermisson(Roles.GDT.DUYET_REPORT_TH);
        const checkApprove = isSynthetic ? this.userService.isAccessPermisson(Roles.GDT.PHEDUYET_TUCHOI_PA_TH_PBDT) : this.userService.isAccessPermisson(Roles.GDT.PHEDUYET_REPORT_TH);
        const checkAccept = this.userService.isAccessPermisson(Roles.GDT.TIEP_NHAN_TC_REPORT_TH);
        const checkPrint = isSynthetic ? this.userService.isAccessPermisson(Roles.GDT.IN_PA_TONGHOP_PBDT) : this.userService.isAccessPermisson(Roles.GDT.PRINT_REPORT);
        const checkExport = isSynthetic ? this.userService.isAccessPermisson(Roles.GDT.XUAT_PA_TONGHOP_PBDT) : this.userService.isAccessPermisson(Roles.GDT.EXPORT_REPORT)

        this.status.general = Status.check('saveWHist', this.baoCao.trangThai) && checkSave;
        this.status.new = Status.check('reject', this.baoCao.trangThai) && this.userService.isAccessPermisson(Roles.GDT.ADD_REPORT_TH) && this.isChild && this.data.preTab == Gdt.DANH_SACH_BAO_CAO;
        // this.status.viewAppVal = Status.check('appraisal', this.baoCao.trangThai);
        this.status.save = Status.check('saveWHist', this.baoCao.trangThai) && checkSave && this.isChild;
        this.status.submit = Status.check('submit', this.baoCao.trangThai) && checkSunmit && this.isChild && !(!this.baoCao.id);
        this.status.pass = Status.check('pass', this.baoCao.trangThai) && checkPass && this.isChild;
        this.status.approve = Status.check('approve', this.baoCao.trangThai) && checkApprove && this.isChild;
        this.status.accept = Status.check('accept', this.baoCao.trangThai) && checkAccept && this.isParent;
        // this.status.print = Utils.statusPrint.includes(this.baoCao.trangThai) && checkPrint && this.isChild;
        this.status.export = Status.check('export', this.baoCao.trangThai) && checkExport && this.isChild;
        this.status.ok = this.status.accept || this.status.approve || this.status.pass
        this.status.finish = this.status.general;
        // this.status.editAppVal = this.status.accept;
    }

    async getChildUnit() {
        const request = {
            maDviCha: this.baoCao.maDvi,
            trangThai: '01',
        }
        await this.quanLyVonPhiService.dmDviCon(request).toPromise().then(
            data => {
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
    }


    deleteQdCv() {
        this.baoCao.soQd.fileName = null;
        this.baoCao.soQd.fileSize = null;
        this.baoCao.soQd.fileUrl = null;
        const request = JSON.parse(JSON.stringify(
            {
                id: null,
                namDtoan: this.baoCao.namBcao,
                maPa: this.baoCao.maBcao,
                soQd: this.baoCao.soQd,
                maGiao: this.baoCao.maGiao,
            }
        ))

        this.giaoDuToanChiService.themMoiQdCvGiaoNSNN(request).toPromise().then(async data => {
            if (data.statusCode == 0) {
                this.notification.success(MESSAGE.SUCCESS, 'Xóa thành công');
                this.getStatusButton();
            } else {
                this.notification.error(MESSAGE.ERROR, data?.msg);
            }
        }, err => {
            this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR)
        })
    };

    // download file công văn
    async downloadFileCv() {
        if (this.baoCao.soQd?.fileUrl) {
            await this.quanLyVonPhiService.downloadFile(this.baoCao.soQd?.fileUrl).toPromise().then(
                (data) => {
                    fileSaver.saveAs(data, this.baoCao.soQd?.fileName);
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
    };

    // xem phuong an cha
    xemCtietPaBTC() {

    };


    getUnitName(maDvi: string) {
        return this.childUnit.find(item => item.maDvi == maDvi)?.tenDvi;
    }


    viewDetail(id) {
        const obj = {
            id: id,
            preData: this.data,
            tabSelected: 'next' + this.data?.tabSelected,
        }
        this.dataChange.emit(obj);
    };

    // xoa file trong bang file
    deleteFile(id: string): void {
        this.baoCao.lstFiles = this.baoCao.lstFiles.filter((a: any) => a.id !== id);
        this.listFile = this.listFile.filter((a: any) => a?.lastModified.toString() !== id);
        this.baoCao.listIdFiles.push(id);
    }

    async restoreReport(id: string) {
        await this.giaoDuToanChiService.restoreReport(this.baoCao.id, id).toPromise().then(
            (data) => {
                if (data.statusCode == 0) {
                    Object.assign(this.baoCao, data.data);
                    this.baoCao.lstCtiets.forEach(item => {
                        [item.tenPl, item.tenDm] = Gdt.appendixName(item.maBieuMau, this.baoCao.namBcao);
                    })
                    this.getStatusButton();
                    this.notification.success(MESSAGE.SUCCESS, 'Khôi phục thành công.');
                } else {
                    this.notification.error(MESSAGE.ERROR, data?.msg);
                }
            },
            (err) => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
            }
        );
    }

    async newReport() {
        await this.giaoDuToanChiService.addHistory(this.baoCao.id).toPromise().then(
            (data) => {
                if (data.statusCode == 0) {
                    Object.assign(this.baoCao, data.data);
                    this.baoCao.lstCtiets.forEach(item => {
                        [item.tenPl, item.tenDm] = Gdt.appendixName(item.maBieuMau, this.baoCao.namBcao);
                    })
                    this.getStatusButton();
                    this.notification.success(MESSAGE.SUCCESS, 'Tạo mới thành công.');
                } else {
                    this.notification.error(MESSAGE.ERROR, data?.msg);
                }
            },
            (err) => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
            }
        );
    }

}
