
import { DatePipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { cloneDeep } from 'lodash';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { LapThamDinhService } from 'src/app/services/quan-ly-von-phi/lapThamDinh.service';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';
import { LTD, Utils } from 'src/app/Utility/utils';
import { DialogTaoMoiComponent } from '../dialog-tao-moi/dialog-tao-moi.component';

@Component({
    selector: 'app-tong-hop-bao-cao-tu-don-vi-cap-duoi',
    templateUrl: './tong-hop-bao-cao-tu-don-vi-cap-duoi.component.html',
})
export class TongHopBaoCaoTuDonViCapDuoiComponent implements OnInit {
    @Output() dataChange = new EventEmitter();

    namHienTai: number;
    trangThai: string = Utils.TT_BC_9;
    maDviTao: string;

    userInfo: any;
    trangThais: any[] = [
        {
            id: '9',
            ten: 'Tiếp nhận'
        },
        {
            id: '7',
            ten: 'Mới'
        },
        {
            id: '-1',
            ten: 'Chưa gửi đơn vị cấp trên'
        },
    ];
    donVis: any[] = [];
    dataTable: any[] = [];
    dataTableAll: any[] = [];
    statusNewReport = true;

    pages = {
        size: 10,
        page: 1,
    }
    totalElements = 0;
    totalPages = 0;

    filterTable: any = {
        soQd: '',
        ngayKy: '',
        namKeHoach: '',
        trichYeu: '',
        tenTrangThai: '',
    };
    constructor(
        private spinner: NgxSpinnerService,
        private lapThamDinhService: LapThamDinhService,
        private notification: NzNotificationService,
        private modal: NzModalService,
        private danhMuc: DanhMucHDVService,
        public userService: UserService,
        private datePipe: DatePipe,
        public globals: Globals,
    ) { }

    async ngOnInit() {
        this.userInfo = this.userService.getUserLogin();
        this.spinner.show();
        //khoi tao gia tri mac dinh
        this.maDviTao = this.userInfo?.MA_DVI;
        this.statusNewReport = this.userService.isAccessPermisson(LTD.SYNTHETIC_REPORT);
        //lay danh sach ca don vi truc thuoc
        await this.danhMuc.dMDviCon().toPromise().then(
            data => {
                if (data.statusCode == 0) {
                    this.donVis = data.data;
                } else {
                    this.notification.error(MESSAGE.ERROR, data?.msg);
                }
            },
            err => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
            }
        );

        this.search();
        this.spinner.hide();
    }

    async search() {
        this.spinner.show();
        let trangThais: string[] = [];
        if (this.trangThai) {
            trangThais = [this.trangThai];
        } else[
            trangThais = [Utils.TT_BC_9, Utils.TT_BC_7]
        ]
        const requestReport = {
            loaiTimKiem: "1",
            maDvi: this.maDviTao,
            maBcaos: [],
            namBcao: this.namHienTai,
            ngayTaoDen: "",
            ngayTaoTu: "",
            paggingReq: {
                limit: this.pages.size,
                page: this.pages.page,
            },
            trangThais: trangThais,
        };
        await this.lapThamDinhService.timBaoCaoLapThamDinh(requestReport).toPromise().then(res => {
            if (res.statusCode == 0) {
                this.dataTable = [];
                res.data.content.forEach(item => {
                    this.dataTable.push({
                        ...item,
                        ngayPheDuyet: this.datePipe.transform(item.ngayPheDuyet, Utils.FORMAT_DATE_STR),
                        ngayTraKq: this.datePipe.transform(item.ngayTraKq, Utils.FORMAT_DATE_STR),
                    })
                })
                this.dataTableAll = cloneDeep(this.dataTable);
                this.totalElements = res.data.totalElements;
                this.totalPages = res.data.totalPages;
            } else {
                this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
            }
        }, err => {
            this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        })
        this.spinner.hide();
    }

    //doi so trang
    onPageIndexChange(page) {
        this.pages.page = page;
        this.search();
    }

    //doi so luong phan tu tren 1 trang
    onPageSizeChange(size) {
        this.pages.size = size;
        this.search();
    }

    //reset tim kiem
    clearFilter() {
        this.namHienTai = null
        this.trangThai = null
        this.search();
    }

    getUnitName(maDvi: string) {
        return this.donVis.find(e => e.maDvi == maDvi)?.tenDvi;
    }

    getStatusName(trangThai: string) {
        return this.trangThais.find(e => e.id == trangThai)?.ten;
    }

    //them moi bao cao
    addNewReport() {
        const modalTuChoi = this.modal.create({
            nzTitle: 'Thông tin tổng hợp báo cáo',
            nzContent: DialogTaoMoiComponent,
            nzMaskClosable: false,
            nzClosable: false,
            nzWidth: '900px',
            nzFooter: null,
            nzComponentParams: {
                tab: 'tonghop'
            },
        });
        modalTuChoi.afterClose.toPromise().then(async (res) => {
            if (res) {
                if (res.loai == 1) {
                    const request = {
                        id: res.idSoTranChi,
                        maBcao: res.maBcao,
                    }
                    let check = false;
                    const trangThais = [Utils.TT_BC_1, Utils.TT_BC_3, Utils.TT_BC_5, Utils.TT_BC_8, Utils.TT_BC_9];
                    if (this.userInfo?.CAP_DVI == Utils.TONG_CUC) {
                        trangThais.push(Utils.TT_BC_7);
                    }
                    const requestReport = {
                        loaiTimKiem: "0",
                        maBcaos: !res.maBcao ? [] : [res.maBcao],
                        maDvi: this.userInfo?.MA_DVI,
                        paggingReq: {
                            limit: 10,
                            page: 1,
                        },
                        trangThais: trangThais,
                    };
                    await this.lapThamDinhService.timBaoCaoLapThamDinh(requestReport).toPromise().then(
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
                    // this.lapThamDinhService.suaBcao(request).toPromise().then(
                    //     async (data) => {
                    //         if (data.statusCode == 0) {
                    //             this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
                    //             const obj = {
                    //                 ...res,
                    //                 id: data.data.id,
                    //                 tabSelected: 'baocao',
                    //                 isSynthetic: true,
                    //             }
                    //             this.dataChange.emit(obj);
                    //         } else {
                    //             this.notification.error(MESSAGE.ERROR, data?.msg);
                    //         }
                    //     },
                    //     (err) => {
                    //         this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
                    //     },
                    // );
                } else {
                    let check = false;
                    const requestReport = {
                        loaiTimKiem: "0",
                        maBcaos: [],
                        namBcao: res.namHienTai,
                        maDvi: this.userInfo?.MA_DVI,
                        paggingReq: {
                            limit: 10,
                            page: 1,
                        },
                        trangThais: [],
                    };
                    await this.lapThamDinhService.timBaoCaoLapThamDinh(requestReport).toPromise().then(
                        (data) => {
                            if (data.statusCode == 0) {
                                if (data.data.content?.length > 0) {
                                    check = true;
                                }
                            }
                        }
                    );
                    if (check) {
                        this.notification.warning(MESSAGE.WARNING, "Báo cáo năm " + requestReport.namBcao + " đã tồn tại!");
                        return;
                    }
                    const obj = {
                        ...res,
                        id: null,
                        tabSelected: 'baocao',
                        isSynthetic: true,
                    }
                    this.dataChange.emit(obj);
                }
            }
        });
    }

    //xem chi tiet bao cao
    viewDetail(data: any) {
        const obj = {
            id: data.id,
            tabSelected: 'baocao',
        }
        this.dataChange.emit(obj);
    }

    // Tìm kiếm trong bảng
    filterInTable(key: string, value: string, isDate: boolean) {
        if (value && value != '') {
            this.dataTable = [];
            let temp = [];
            if (this.dataTableAll && this.dataTableAll.length > 0) {
                if (isDate) {
                    value = this.datePipe.transform(value, Utils.FORMAT_DATE_STR);
                }
                this.dataTableAll.forEach((item) => {
                    if (item[key] && item[key].toString().toLowerCase().indexOf(value.toString().toLowerCase()) != -1) {
                        temp.push(item)
                    }
                });
            }
            this.dataTable = [...this.dataTable, ...temp];
        } else {
            this.dataTable = cloneDeep(this.dataTableAll);
        }
    }
}
