import { DatePipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { cloneDeep } from 'lodash';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { DieuChinhService } from 'src/app/services/quan-ly-von-phi/dieuChinhDuToan.service';
import { UserService } from 'src/app/services/user.service';
import { DCDT, Utils } from 'src/app/Utility/utils';
import { DialogTaoMoiComponent } from '../dialog-tao-moi/dialog-tao-moi.component';

@Component({
    selector: 'app-tong-hop-bao-cao',
    templateUrl: './tong-hop-bao-cao.component.html',
    styleUrls: ['./tong-hop-bao-cao.component.scss']
})
export class TongHopBaoCaoComponent implements OnInit {
    @Output() dataChange = new EventEmitter();

    maBcao = "";
    maLoaiBcao = "";
    namHienTai = new Date().getFullYear();
    tuNgay: "";
    denNgay: "";
    trangThai: string = Utils.TT_BC_9;
    maDviTao: string;
    userInfo: any;

    donVis: any[] = [];
    dataTable: any[] = [];
    dataTableAll: any[] = [];
    statusNewReport = true;
    donViTaos: any = [];

    pages = {
        size: 10,
        page: 1,
    };
    totalElements = 0;
    totalPages = 0;


    filterTable: any = {
        tenDvi: '',
        maBcao: '',
        namHienHanh: '',
        ngayPheDuyet: '',
        ngayTraKq: '',
        tenTrangThai: '',
    };

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
    constructor(
        private spinner: NgxSpinnerService,
        public userService: UserService,
        private danhMuc: DanhMucHDVService,
        private notification: NzNotificationService,
        private modal: NzModalService,
        private datePipe: DatePipe,
        private dieuChinhService: DieuChinhService,
    ) { }

    async ngOnInit() {
        this.userInfo = this.userService.getUserLogin();
        this.spinner.show();
        this.maDviTao = this.userInfo.MA_DVI;
        // console.log(this.userInfo)
        this.statusNewReport = this.userService.isAccessPermisson(DCDT.SYNTHETIC_REPORT);
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
    };


    async search() {

        this.spinner.show();
        let trangThais: string[] = [];
        if (this.trangThai) {
            trangThais = [this.trangThai];
        } else[
            trangThais = [Utils.TT_BC_9, Utils.TT_BC_7]
        ]

        const requestReport = {
            maBcao: "",
            maDvi: this.maDviTao,
            maLoaiBcao: "",
            loaiTimKiem: "1",
            namBcao: this.namHienTai,
            ngayTaoDen: "",
            ngayTaoTu: "",
            paggingReq: {
                limit: this.pages.size,
                page: this.pages.page,
            },
            str: "",
            trangThais: trangThais,
        };

        await this.dieuChinhService.timKiemDieuChinh(requestReport).toPromise().then(
            (res) => {
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
            },
            (err) => {
                this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
            }
        );

        this.spinner.hide();
    };

    clearFilter() {
        this.namHienTai = null;
        this.trangThai = null;
        this.maDviTao = null;
        this.search();
    }

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
                const obj = {
                    ...res,
                    id: null,
                    tabSelected: 'addbaocao',
                    isSynthetic: true,
                }
                this.dataChange.emit(obj);
            }
        });
    };


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
    };

    getStatusName(trangThai: string) {
        return this.trangThais.find(e => e.id == trangThai)?.ten;
    };

    viewDetail(data: any) {
        const obj = {
            id: data.id,
            tabSelected: 'addbaocao',
        }
        this.dataChange.emit(obj);
    };

    //doi so trang
    onPageIndexChange(page) {
        this.pages.page = page;
        this.search();
    };

    //doi so luong phan tu tren 1 trang
    onPageSizeChange(size) {
        this.pages.size = size;
        this.search();
    };

}
