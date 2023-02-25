import { ComponentType } from '@angular/cdk/portal';
import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { cloneDeep } from 'lodash';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { CapVonMuaBanTtthService } from 'src/app/services/quan-ly-von-phi/capVonMuaBanTtth.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { CAN_CU_GIA, CVMB, LOAI_DE_NGHI, Utils } from 'src/app/Utility/utils';
import { receivedInfo, Report, sendInfo, TienThua, TRANG_THAI } from '../../cap-von-mua-ban-va-thanh-toan-tien-hang.constant';
import { DialogTaoMoiCapVonComponent } from '../dialog-tao-moi-cap-von/dialog-tao-moi-cap-von.component';
import { DialogTaoMoiThanhToanComponent } from '../dialog-tao-moi-thanh-toan/dialog-tao-moi-thanh-toan.component';
import { DialogTaoMoiTienThuaComponent } from '../dialog-tao-moi-tien-thua/dialog-tao-moi-tien-thua.component';

@Component({
    selector: 'app-danh-sach-von-mua-von-ung',
    templateUrl: './danh-sach-von-mua-von-ung.component.html',
    styleUrls: ['../von-mua-von-ung.component.scss']
})
export class DanhSachVonMuaVonUngComponent implements OnInit {
    @Input() dataInfo: any;
    @Output() dataChange = new EventEmitter();

    //thong tin user
    userInfo: any;
    //thong tin tim kiem
    searchFilter = {
        loaiTimKiem: '0',
        maLoai: null,
        maCapUng: null,
        maDvi: null,
        loaiDnghi: null,
        namDnghi: null,
        canCuVeGia: null,
        ngayTaoDen: null,
        ngayTaoTu: null,
        paggingReq: {
            limit: 10,
            page: 1,
        },
        trangThai: Utils.TT_BC_1,
    };
    title: string;
    // danh sach
    dataTable: any[] = [];
    dataTableAll: any[] = [];
    trangThais: any[] = TRANG_THAI;
    loaiDns: any[] = LOAI_DE_NGHI;
    canCuGias: any[] = CAN_CU_GIA;
    donVis: any[] = [];
    //cac quyn cua nguoi thao tac
    createPermission: string;
    editPermission: string;
    deletePermission: string;
    passPermission: string;
    approvePermission: string;
    isSend: boolean;
    isParent = false;
    allChecked = false;
    statusNewReport = false;
    statusDelete = false;
    //phan trang
    totalElements = 0;
    totalPages = 0;

    constructor(
        private spinner: NgxSpinnerService,
        private notification: NzNotificationService,
        private quanLyVonPhiService: QuanLyVonPhiService,
        private modal: NzModalService,
        public userService: UserService,
        private capVonMuaBanTtthService: CapVonMuaBanTtthService,
        private datePipe: DatePipe,
    ) { }

    async ngOnInit() {
        this.trangThais = TRANG_THAI;
        this.userInfo = this.userService.getUserLogin();
        this.spinner.show();
        //khoi tao gia tri mac dinh
        this.searchFilter.ngayTaoDen = new Date();
        const newDate = new Date();
        newDate.setMonth(newDate.getMonth() - 1);
        this.searchFilter.ngayTaoTu = newDate;
        this.searchFilter.maDvi = this.userInfo?.MA_DVI;
        switch (this.dataInfo?.tabSelected) {
            case 'gnv':
                this.title = 'DANH SÁCH GHI NHẬN CẤP ỨNG VỐN TỪ ĐƠN VỊ CẤP TRÊN';
                this.searchFilter.loaiTimKiem = '0';
                this.searchFilter.maLoai = 2;
                if (this.userService.isTongCuc()) {
                    this.createPermission = CVMB.ADD_REPORT_TC_GNV;
                    this.deletePermission = CVMB.DELETE_REPORT_GNV;
                } else {
                    this.searchFilter.maLoai = 2;
                    this.createPermission = 'NO';
                    this.deletePermission = 'NO';
                }
                this.editPermission = CVMB.EDIT_REPORT_GNV;
                this.passPermission = CVMB.DUYET_REPORT_GNV;
                this.approvePermission = CVMB.PHE_DUYET_REPORT_GNV;
                this.isSend = false;
                break;
            case 'cv':
                this.title = 'DANH SÁCH CẤP ỨNG VỐN CHO ĐƠN VỊ CẤP DƯỚI';
                this.searchFilter.loaiTimKiem = '0';
                this.searchFilter.maLoai = 3;
                this.createPermission = CVMB.ADD_REPORT_CV;
                this.editPermission = CVMB.EDIT_REPORT_CV;
                this.deletePermission = CVMB.DELETE_REPORT_CV;
                this.passPermission = CVMB.DUYET_REPORT_CV;
                this.approvePermission = CVMB.PHE_DUYET_REPORT_CV;
                this.isSend = true;
                break;
            case 'tt':
                this.title = 'DANH SÁCH TIỀN THỪA NỘP LÊN ĐƠN VỊ CẤP TRÊN';
                this.searchFilter.loaiTimKiem = '0';
                this.searchFilter.maLoai = 6;
                this.createPermission = CVMB.ADD_REPORT_NTVT;
                this.editPermission = CVMB.EDIT_REPORT_NTVT;
                this.deletePermission = CVMB.DELETE_REPORT_NTVT;
                this.passPermission = CVMB.DUYET_REPORT_NTVT;
                this.approvePermission = CVMB.PHE_DUYET_REPORT_NTVT;
                this.isSend = true;
                break;
            case 'gn-tt':
                this.title = 'DANH SÁCH GHI NHẬN TIỀN THỪA NỘP TỪ ĐƠN VỊ CẤP DƯỚI';
                this.isParent = true;
                this.searchFilter.loaiTimKiem = '1';
                this.searchFilter.maLoai = 6;
                this.createPermission = 'NO';
                this.editPermission = CVMB.EDIT_REPORT_GNV_TH;
                this.deletePermission = 'NO';
                this.passPermission = CVMB.DUYET_REPORT_GNV_TH;
                this.approvePermission = CVMB.PHE_DUYET_REPORT_GNV_TH;
                // this.trangThais.find(e => e.id == Utils.TT_BC_1).tenDm = 'Mới';
                this.isSend = false;
                await this.getChildUnit();
                break;
            case 'thanhtoan':
                this.title = 'DANH SÁCH THANH TOÁN CHO KHÁCH HÀNG';
                this.searchFilter.loaiTimKiem = '0';
                this.searchFilter.maLoai = 5;
                this.createPermission = CVMB.ADD_REPORT_TTKH;
                this.editPermission = CVMB.EDIT_REPORT_TTKH;
                this.deletePermission = CVMB.DELETE_REPORT_TTKH;
                this.passPermission = CVMB.DUYET_REPORT_TTKH;
                this.approvePermission = CVMB.PHE_DUYET_REPORT_TTKH;
                this.isSend = true;
                break;
            default:
                break;
        }
        this.statusNewReport = this.userService.isAccessPermisson(this.createPermission);
        this.statusDelete = this.userService.isAccessPermisson(this.deletePermission);
        //neu co quyen phe duyet thi trang thai mac dinh la trinh duyet
        if (this.userService.isAccessPermisson(this.passPermission)) {
            this.searchFilter.trangThai = Utils.TT_BC_2;
        } else {
            if (this.userService.isAccessPermisson(this.approvePermission)) {
                this.searchFilter.trangThai = Utils.TT_BC_4;
            }
        }
        this.search();
        this.spinner.hide();
    }

    getDate(date: Date) {
        return this.datePipe.transform(date, Utils.FORMAT_DATE_STR);
    }

    async search() {
        const request = JSON.parse(JSON.stringify(this.searchFilter));
        request.ngayTaoDen = this.datePipe.transform(this.searchFilter.ngayTaoDen, Utils.FORMAT_DATE_STR);
        request.ngayTaoTu = this.datePipe.transform(this.searchFilter.ngayTaoTu, Utils.FORMAT_DATE_STR);
        this.spinner.show();
        await this.capVonMuaBanTtthService.timKiemVonMuaBan(request).toPromise().then(
            (data) => {
                if (data.statusCode == 0) {
                    this.dataTable = [];
                    data.data.content.forEach(item => {
                        this.dataTable.push({
                            ...item,
                            ngayTrinh: this.isSend ? item.ttGui.ngayTrinh : item.ttNhan.ngayTrinh,
                            ngayDuyet: this.isSend ? item.ttGui.ngayDuyet : item.ttNhan.ngayDuyet,
                            ngayPheDuyet: this.isSend ? item.ttGui.ngayPheDuyet : item.ttNhan.ngayPheDuyet,
                            trangThai: this.isSend ? item.ttGui.trangThai : item.ttNhan.trangThai,
                            lyDoTuChoi: this.isSend ? item.ttGui.lyDoTuChoi : item.ttNhan.lyDoTuChoi,
                            checked: false,
                            isEdit: this.checkEditStatus(this.isSend ? item.ttGui.trangThai : item.ttNhan.trangThai),
                            isDelete: this.checkDeleteStatus(this.isSend ? item.ttGui.trangThai : item.ttNhan.trangThai),
                        })
                    })
                    this.dataTableAll = cloneDeep(this.dataTable);
                    this.totalElements = data.data.totalElements;
                    this.totalPages = data.data.totalPages;
                } else {
                    this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
                }
            },
            (err) => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
            }
        );
        this.spinner.hide();
    }

    //doi so trang
    onPageIndexChange(page) {
        this.searchFilter.paggingReq.page = page;
        this.search();
    }

    //doi so luong phan tu tren 1 trang
    onPageSizeChange(size) {
        this.searchFilter.paggingReq.limit = size;
        this.search();
    }

    //reset tim kiem
    clearFilter() {
        this.searchFilter.maCapUng = null
        this.searchFilter.trangThai = null
        this.searchFilter.ngayTaoTu = null
        this.searchFilter.ngayTaoDen = null
        this.searchFilter.namDnghi = null
        this.searchFilter.loaiDnghi = null
        this.searchFilter.canCuVeGia = null
        this.search();
    }

    checkEditStatus(trangThai: string) {
        return Utils.statusSave.includes(trangThai) && this.userService.isAccessPermisson(this.editPermission);
    }

    checkDeleteStatus(trangThai: string) {
        return Utils.statusDelete.includes(trangThai) && this.userService.isAccessPermisson(this.deletePermission);
    }

    getStatusName(trangThai: string) {
        if (trangThai == Utils.TT_BC_1 && this.searchFilter.loaiTimKiem == '1') {
            return 'Mới';
        }
        return this.trangThais.find(e => e.id == trangThai)?.tenDm;
    }

    addNewReport() {
        let nzContent: ComponentType<any>;
        if (this.searchFilter.maLoai == 1 || this.searchFilter.maLoai == 2 || this.searchFilter.maLoai == 3) {
            nzContent = DialogTaoMoiCapVonComponent;
        } else if (this.searchFilter.maLoai == 6) {
            nzContent = DialogTaoMoiTienThuaComponent;
        } else {
            nzContent = DialogTaoMoiThanhToanComponent;
        }
        const modalTuChoi = this.modal.create({
            nzTitle: 'Thông tin tạo mới',
            nzContent: nzContent,
            nzMaskClosable: false,
            nzClosable: false,
            nzWidth: '900px',
            nzFooter: null,
            nzComponentParams: {
                request: this.searchFilter
            },
        });
        modalTuChoi.afterClose.toPromise().then(async (res) => {
            if (res) {
                const obj = {
                    baoCao: res,
                    id: null,
                    tabSelected: null,
                }
                switch (this.searchFilter.maLoai) {
                    // case 1:
                    //     obj.tabSelected = 'gnv-btc';
                    //     break;
                    case 2:
                        obj.tabSelected = 'gnv-cv';
                        break;
                    case 3:
                        obj.tabSelected = 'gnv-cv';
                        break;
                    case 5:
                        if (res.loaiDnghi == Utils.MUA_VTU) {
                            obj.tabSelected = 'tt-vattu';
                        } else {
                            if (res.canCuVeGia == Utils.HD_TRUNG_THAU) {
                                obj.tabSelected = 'tt-hopdong';
                            } else {
                                obj.tabSelected = 'tt-dongia';
                            }
                        }
                        break;
                    case 6:
                        obj.tabSelected = 'tienthua';
                        break;
                    default:
                        break;
                }
                if (obj.baoCao.maLoai != 6) {
                    await this.addVonBanGuiDvct(obj.baoCao.namDnghi);
                }
                this.dataChange.emit(obj);
            }
        });
    }

    //xem chi tiet bao cao
    async viewDetail(data: any) {
        const obj = {
            id: data.id,
            tabSelected: '',
        }
        switch (this.searchFilter.maLoai) {
            // case 1:
            //     obj.tabSelected = 'gnv-btc';
            //     break;
            case 2:
                obj.tabSelected = 'gnv-cv';
                break;
            case 3:
                obj.tabSelected = 'gnv-cv';
                break;
            case 5:
                if (data.loaiDnghi == Utils.MUA_VTU) {
                    obj.tabSelected = 'tt-vattu';
                } else {
                    if (data.canCuVeGia == Utils.HD_TRUNG_THAU) {
                        obj.tabSelected = 'tt-hopdong';
                    } else {
                        obj.tabSelected = 'tt-dongia';
                    }
                }
                break;
            case 6:
                obj.tabSelected = 'tienthua';
                break;
            default:
                break;
        }
        if (data.maLoai == 2 && data.ttNhan.trangThai == Utils.TT_BC_1) {
            await this.addVonBanGuiDvct(data.namDnghi);
        }
        this.dataChange.emit(obj);
    }

    updateAllChecked(): void {
        if (this.dataTable && this.dataTable.length > 0) {
            this.dataTable.forEach(item => {
                if (item.isDelete) {
                    item.checked = this.allChecked;
                }
            })
        }
    }

    updateSingleChecked(): void {
        if (this.dataTable.every((item) => item.checked || !item.isDelete)) {
            this.allChecked = true;
        } else {
            this.allChecked = false;
        }
    }

    //Xoa bao cao
    deleteReport(id: string) {
        this.modal.confirm({
            nzClosable: false,
            nzTitle: 'Xác nhận',
            nzContent: 'Bạn có chắc chắn muốn xóa?',
            nzOkText: 'Đồng ý',
            nzCancelText: 'Không',
            nzOkDanger: true,
            nzWidth: 310,
            nzOnOk: () => {
                this.spinner.show();
                let request = [];
                if (id) {
                    request = [id];
                } else {
                    if (this.dataTable && this.dataTable.length > 0) {
                        this.dataTable.forEach(item => {
                            if (item.checked) {
                                request.push(item.id);
                            }
                        })
                    }
                }
                this.capVonMuaBanTtthService.xoaVonMuaBan(request).toPromise().then(
                    data => {
                        if (data.statusCode == 0) {
                            this.notification.success(MESSAGE.SUCCESS, MESSAGE.DELETE_SUCCESS);
                            this.search();
                        } else {
                            this.notification.error(MESSAGE.ERROR, data?.msg);
                        }
                    },
                    err => {
                        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
                    }
                )
                this.spinner.hide();
            },
        });
    }

    async getChildUnit() {
        this.spinner.show();
        const request = {
            maDviCha: this.searchFilter.maDvi,
            trangThai: '01',
        }
        await this.quanLyVonPhiService.dmDviCon(request).toPromise().then(
            data => {
                if (data.statusCode == 0) {
                    if (this.userService.isTongCuc()) {
                        this.donVis = data.data.filter(e => e.tenVietTat && (e.tenVietTat.startsWith('CDT') || e.tenVietTat.startsWith('VP')));
                    } else {
                        this.donVis = data.data.filter(e => e.tenVietTat && (e.tenVietTat.startsWith('CCDT') || e.tenVietTat.startsWith('VP')))
                    }
                } else {
                    this.notification.error(MESSAGE.ERROR, data?.msg);
                }
            },
            (err) => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
            }
        )
        this.spinner.hide();
    }

    //kiem tra ban ghi nop tien von ban hang len don vi cap tren da ton tai chua, neu chua thi thuc hien them moi
    async addVonBanGuiDvct(nam: number) {
        let check = false // ban ghi chua ton tai
        //kiem tra ban ghi da ton tai chua
        const request = {
            loaiTimKiem: '0',
            maLoai: 6,
            maDvi: this.userInfo?.MA_DVI,
            namBcao: nam,
            paggingReq: {
                limit: 10,
                page: 1,
            },
        }
        await this.capVonMuaBanTtthService.timKiemVonMuaBan(request).toPromise().then(
            (data) => {
                if (data.statusCode == 0) {
                    if (data.data.content?.length > 0) {
                        check = true;
                    }
                } else {
                    this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
                }
            },
            (err) => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
            }
        );
        //neu chua ton tai thi thuc hien them moi
        if (!check) {
            const response: Report = new Report();
            response.namDnghi = nam;
            response.ttGui = new sendInfo();
            response.ttGui.lstCtietBcaos = [];
            response.ttNhan = new receivedInfo();
            response.ttNhan.lstCtietBcaos = [];
            response.maDvi = this.userInfo?.MA_DVI;
            response.ngayTao = new Date();
            response.dot = 1;
            response.maLoai = 6;
            response.ttGui.trangThai = Utils.TT_BC_1;
            response.ttNhan.trangThai = Utils.TT_BC_1;
            response.ttGui.lstFiles = [];
            response.ttNhan.lstFiles = [];
            response.ttGui.lstCtietBcaos.push({
                ...new TienThua(),
                id: null,
                maHang: Utils.MUA_THOC,
                hangDtqg: 'Thóc',
            })
            if (!this.userService.isChiCuc()) {
                response.ttGui.lstCtietBcaos.push({
                    ...new TienThua(),
                    id: null,
                    maHang: Utils.MUA_GAO,
                    hangDtqg: 'Gạo',
                })
                response.ttGui.lstCtietBcaos.push({
                    ...new TienThua(),
                    id: null,
                    maHang: Utils.MUA_MUOI,
                    hangDtqg: 'Muối',
                })
            }
            if (this.userService.isTongCuc()) {
                response.ttGui.lstCtietBcaos.push({
                    ...new TienThua(),
                    id: null,
                    maHang: Utils.MUA_VTU,
                    hangDtqg: 'Vật tư',
                })
            }
            await this.capVonMuaBanTtthService.maCapVonUng().toPromise().then(
                (res) => {
                    if (res.statusCode == 0) {
                        response.maCapUng = res.data;
                    } else {
                        this.notification.error(MESSAGE.ERROR, res?.msg);
                    }
                },
                (err) => {
                    this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
                },
            );
            this.capVonMuaBanTtthService.themMoiVonMuaBan(response).toPromise().then(
                async (data) => {
                    if (data.statusCode == 0) {
                        // this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
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

}
