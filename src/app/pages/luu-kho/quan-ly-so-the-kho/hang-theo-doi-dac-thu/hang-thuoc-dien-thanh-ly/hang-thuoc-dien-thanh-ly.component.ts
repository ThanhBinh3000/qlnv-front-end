import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { UserLogin } from 'src/app/models/userlogin';
import { UserService } from 'src/app/services/user.service';
import { isEmpty } from 'lodash';
import { DonviService } from 'src/app/services/donvi.service';
import { DANH_MUC_LEVEL } from '../../../luu-kho.constant';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { MESSAGE } from 'src/app/constants/message';
import { NgxSpinnerService } from 'ngx-spinner';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { QuanLyChatLuongLuuKhoService } from 'src/app/services/quanLyChatLuongLuuKho.service';
import { cloneDeep } from 'lodash';
@Component({
    selector: 'app-hang-thuoc-dien-thanh-ly',
    templateUrl: './hang-thuoc-dien-thanh-ly.component.html',
    styleUrls: ['./hang-thuoc-dien-thanh-ly.component.scss'],
})
export class HangThuocDienThanhLyComponent implements OnInit {
    userInfo: UserLogin;
    detail: any = {};
    formData: FormGroup;
    allChecked = false;
    indeterminate = false;
    dsTrangThai: ITrangThai[] = [
        // fake
        { id: 1, giaTri: 'Đang xử lý' },
        { id: 2, giaTri: 'Chờ duyệt' },
        { id: 3, giaTri: 'Đã duyệt' },
        { id: 4, giaTri: 'Chưa xử lý' },
    ];
    dsTong;
    dsDonVi = [];
    dsDonViDataSource = [];
    dsHangHoa = [];
    dsLoaiHangHoa = [];
    dsLoaiHangHoaDataSource = [];

    searchInTable: any = {
        maDanhSach: null,
        donVi: null,
        ngayTao: null,
        trangThai: null,
    };
    page: number = 1;
    pageSize: number = PAGE_SIZE_DEFAULT;
    totalRecord: number = 10;
    rangeTemplate: number = 0;
    setOfCheckedId = new Set<number>();
    dataTable: any[] = [];
    dataTableAll: any[] = [];

    dataExample: IHangThanhLy[] = [
        {
            id: 1,
            maDanhSach: 'DS1',
            idDonVi: 1,
            tenDonVi: 'Test 1',
            ngayTao: new Date(),
            trangThai: 'Chờ duyệt',
        },
        {
            id: 2,
            maDanhSach: 'DS2',
            idDonVi: 1,
            tenDonVi: 'Test 2',
            ngayTao: new Date(),
            trangThai: 'Chờ duyệt',
        },
        {
            id: 3,
            maDanhSach: 'DS3',
            idDonVi: 3,
            tenDonVi: 'Test 3',
            ngayTao: new Date(),
            trangThai: 'Chờ duyệt',
        },
        {
            id: 4,
            maDanhSach: 'DS4',
            idDonVi: 4,
            tenDonVi: 'Test 1',
            ngayTao: new Date(),
            trangThai: 'Chờ duyệt',
        },
    ];
    isAddNew = false;

    constructor(
        private readonly fb: FormBuilder,
        private readonly userService: UserService,
        private readonly donviService: DonviService,
        private readonly danhMucService: DanhMucService,
        private readonly quanlyChatLuongService: QuanLyChatLuongLuuKhoService,
        private readonly spinner: NgxSpinnerService,
        private readonly notification: NzNotificationService,
    ) { }

    async ngOnInit(): Promise<void> {
        try {
            this.spinner.show();
            this.initForm();
            await this.initData();
        } catch (error) {
            this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        } finally {
            this.spinner.hide();
        }
    }

    initForm(): void {
        this.formData = this.fb.group({
            idDonVi: [null],
            tenDonVi: [null],
            tenHangHoa: [null],
            loaiHangHoa: [null],
            ngayTao: [null],
        });
    }

    async initData() {
        this.userInfo = this.userService.getUserLogin();
        this.detail.maDvi = this.userInfo.MA_DVI;
        this.detail.tenDvi = this.userInfo.TEN_DVI;
        var data = this.traCuuDsHangThanhLy();
        console.log(data);
        await Promise.all([this.loadDsTong(), this.loaiVTHHGetAll()]);
    }

    async traCuuDsHangThanhLy() {
        const body = {
            denNgay: this.formData.controls.ngayTao.value ? this.formData.controls.ngayTao.value[1] : '',
            tuNgay: this.formData.controls.ngayTao?.value ? this.formData.controls.ngayTao.value[0] : '',
            maDonVi: this.detail.maDvi, // 
            maVTHH: "",
            paggingReq: {
                limit: this.pageSize,
                orderBy: "",
                orderType: "",
                page: this.page,
            },
        }
        const res = await this.quanlyChatLuongService.traCuu(body);
        if (res.msg == MESSAGE.SUCCESS) {
            this.totalRecord = res.data.totalElements;
            this.rangeTemplate = res.data.totalPages;
            this.dataTable = res.data?.content;
            this.dataTableAll = cloneDeep(this.dataTable);
        }
        console.log(res.data?.content)
    }

    async loadDsTong() {
        const body = {
            maDviCha: this.detail.maDvi,
            trangThai: '01',
        };

        const dsTong = await this.donviService.layDonViTheoCapDo(body);
        if (!isEmpty(dsTong)) {
            this.dsTong = dsTong;
            this.dsDonVi = dsTong[DANH_MUC_LEVEL.CHI_CUC];
            this.dsDonViDataSource = dsTong[DANH_MUC_LEVEL.CHI_CUC].map(
                (item) => item.tenDvi,
            );
        }
    }

    async loaiVTHHGetAll() {
        let res = await this.danhMucService.loaiVatTuHangHoaGetAll();
        if (res.msg == MESSAGE.SUCCESS) {
            this.dsLoaiHangHoa = res.data;
            this.dsLoaiHangHoaDataSource = res.data?.map((item) => item.giaTri);
        }
    }

    onChangeAutoComplete(e: Event) {
        debugger
        const value = (e.target as HTMLInputElement).value;
        if (value) {
            this.dsDonViDataSource = this.dsDonVi
                .filter((item) =>
                    item?.tenDvi?.toLowerCase()?.includes(value.toLowerCase()),
                )
                .map((item) => item.tenDvi);
        } else {
            this.dsDonViDataSource = this.dsDonVi.map((item) => item.tenDvi);
        }
    }

    onChangeLoaiHHAutoComplete(e: Event) {
        const value = (e.target as HTMLInputElement).value;
        if (value) {
            this.dsLoaiHangHoaDataSource = this.dsLoaiHangHoa
                .filter((item) =>
                    item?.giaTri?.toLowerCase()?.includes(value.toLowerCase()),
                )
                .map((item) => item.giaTri);
        } else {
            this.dsLoaiHangHoaDataSource = this.dsLoaiHangHoa.map(
                (item) => item.giaTri,
            );
        }
        console.log(value)
    }

    exportData() { }

    xoa() { }

    inDanhSach() { }

    themMoi() {
        this.isAddNew = true;
    }

    onAllChecked(checked) {
        this.dataTable.forEach(({ id }) => this.updateCheckedSet(id, checked));
        this.refreshCheckedStatus();
    }

    updateCheckedSet(id: number, checked: boolean): void {
        if (checked) {
            this.setOfCheckedId.add(id);
        } else {
            this.setOfCheckedId.delete(id);
        }
    }

    refreshCheckedStatus(): void {
        this.allChecked = this.dataTable.every(({ id }) =>
            this.setOfCheckedId.has(id),
        );
        this.indeterminate =
            this.dataTable.some(({ id }) => this.setOfCheckedId.has(id)) &&
            !this.allChecked;
    }

    clearFilter() {
        this.formData.reset();
    }

    onChangeFilterDate(event) { }

    changePageIndex(event) { }

    changePageSize(event) { }

    viewDetail(id: number, isUpdate: boolean) { }

    xoaItem(id: number) { }

    onItemChecked(id: number, checked) {
        this.updateCheckedSet(id, checked);
        this.refreshCheckedStatus();
    }

    onClose() {
        this.isAddNew = false;
    }

    filterInTable(key: string, value: string) {
        if (value && value != '') {
            this.dataTable = [];
            let temp = [];
            if (this.dataTableAll && this.dataTableAll.length > 0) {
                if (key == 'trangThaiXuLy') {
                    this.dsTrangThai.map(item => {
                        if (item.id.toString() == value) {
                            value = item.giaTri;
                        }
                    })
                } else if (key === 'ngayTao') {
                    const date = new Date(value);
                    value = date.getFullYear() + "-" + ((date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)) + "-" + date.getDate();
                } else if (key === 'tenDonvi') {
                    value = value.replace('Chi cục Dự trữ Nhà nước ', '');
                }
                this.dataTableAll.forEach((item) => {
                    if (item[key] && item[key].toString().toLowerCase().indexOf(value.toString().toLowerCase()) != -1) {
                        temp.push(item)
                    }
                });
            }
            this.dataTable = [...this.dataTable, ...temp];
        }
        else {
            this.dataTable = cloneDeep(this.dataTableAll);
        }
    }

    clearFilterTable() {
        this.searchInTable = {
            maDanhSach: null,
            donVi: null,
            ngayTao: new Date(),
            trangThai: null,
        }
    }
}

interface ITrangThai {
    id: number;
    giaTri: string;
}

interface IHangThanhLy {
    id: number;
    maDanhSach: string;
    idDonVi: number;
    tenDonVi: string;
    ngayTao: Date;
    trangThai: string;
}

