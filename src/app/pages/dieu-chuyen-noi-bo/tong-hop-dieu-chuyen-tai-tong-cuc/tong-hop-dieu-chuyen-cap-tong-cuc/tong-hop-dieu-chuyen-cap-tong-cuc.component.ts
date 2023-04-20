import { Component, Input, OnInit } from '@angular/core';
import dayjs from 'dayjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { UserLogin } from 'src/app/models/userlogin';
import {
    DeXuatPhuongAnCuuTroService
} from "src/app/services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/DeXuatPhuongAnCuuTro.service";
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { DonviService } from 'src/app/services/donvi.service';
import { isEmpty, cloneDeep } from 'lodash';
import { CHUC_NANG, STATUS } from 'src/app/constants/status';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { TongHopDieuChuyenService } from './../../tong-hop-dieu-chuyen-tai-cuc/tong-hop-dieu-chuyen-tai-cuc.service';

@Component({
    selector: 'app-tong-hop-dieu-chuyen-cap-tong-cuc',
    templateUrl: './tong-hop-dieu-chuyen-cap-tong-cuc.component.html',
    styleUrls: ['./tong-hop-dieu-chuyen-cap-tong-cuc.component.scss']
})
export class TongHopDieuChuyenCapTongCuc extends Base2Component implements OnInit {

    @Input()
    loaiVthh: string;
    @Input()
    loaiVthhCache: string;
    @Input()
    viewOnly: boolean;
    CHUC_NANG = CHUC_NANG;
    listLoaiHangHoa: any[] = [];
    listHangHoaAll: any[] = [];
    listChungLoaiHangHoa: any[] = [];
    listTrangThai: any[] = [
        { ma: this.STATUS.DU_THAO, giaTri: 'Dự thảo' },
        { ma: this.STATUS.CHO_DUYET_TP, giaTri: 'Chờ duyệt - TP' },
        { ma: this.STATUS.TU_CHOI_TP, giaTri: 'Từ chối - TP' },
        { ma: this.STATUS.CHO_DUYET_LDC, giaTri: 'Chờ duyệt - LĐ Cục' },
        { ma: this.STATUS.TU_CHOI_LDC, giaTri: 'Từ chối - LĐ Cục' },
        { ma: this.STATUS.DA_DUYET_LDC, giaTri: 'Đã duyệt - LĐ Cục' },
        { ma: this.STATUS.DA_TAO_CBV, giaTri: 'Đã tạo - CB Vụ' },
    ];
    listLoaiDieuChuyen: any[] = [
        { value: 1, giaTri: "Giữa 2 chi cục trong cùng 1 cục" },
        { value: 2, giaTri: "Giữa 2 cục DTNN KV" },
    ];
    isViewDetail: boolean = false;
    isAddNew: boolean = false;
    isEdit: boolean = false;

    dataTableAll: any[] = [
        { id: 1, nam: 2022 }, { id: 2, nam: 2023 }
    ]
    dataTable: any[] = cloneDeep(this.dataTableAll)

    constructor(
        httpClient: HttpClient,
        storageService: StorageService,
        notification: NzNotificationService,
        spinner: NgxSpinnerService,
        modal: NzModalService,
        private TongHopDieuChuyenService: TongHopDieuChuyenService,
        private donviService: DonviService,
        private danhMucService: DanhMucService,
        private deXuatPhuongAnCuuTroService: DeXuatPhuongAnCuuTroService,
    ) {
        super(httpClient, storageService, notification, spinner, modal, TongHopDieuChuyenService);
        this.formData = this.fb.group({
            nam: [''],
            maTongHop: [''],
            loaiDieuChuyen: [''],
            ngayTongHop: [''],
            ngayTongHopTu: [''],
            ngayTongHopDen: [''],
            loaiHangHoa: [''],
            chungLoaiHangHoa: [''],
            noiDungTongHop: ['']
        })
        this.filterTable = {
            nam: '',
            maTongHop: '',
            loaiDieuChuyen: '',
            ngayTongHop: '',
            ngayTongHopTu: '',
            ngayTongHopDen: '',
            noiDungTongHop: '',
            tenTrangThai: '',
        };
    }


    dsDonvi: any[] = [];
    userInfo: UserLogin;
    userdetail: any = {};
    selectedId: number = 0;
    isVatTu: boolean = false;
    isView = false;

    async ngOnInit() {
        try {
            this.initData()
            this.timKiem();
            this.loadDsVthh();
        } catch (e) {
            console.log('error: ', e)
            this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        } finally {
            this.spinner.hide();
        }
    }
    async loadDsVthh() {
        let res = await this.danhMucService.getDanhMucHangDvqlAsyn({});
        if (res.msg == MESSAGE.SUCCESS) {
            this.listHangHoaAll = res.data;
            this.listLoaiHangHoa = res.data?.filter((x) => (x.ma.length == 2 && !x.ma.match("^01.*")) || (x.ma.length == 4 && x.ma.match("^01.*")));
        }
    }
    async changeHangHoa(event: any) {
        if (event) {
            this.formData.patchValue({ chungLoaiHangHoa: "" });
            this.listChungLoaiHangHoa = []

            let res = await this.danhMucService.loadDanhMucHangHoaTheoMaCha({ str: event });
            if (res.msg == MESSAGE.SUCCESS) {
                if (res.data) {
                    this.listChungLoaiHangHoa = res.data;
                }
            } else {
                this.notification.error(MESSAGE.ERROR, res.msg);
            }
        }
    }
    disabledStartNgayLapKh = (startValue: Date): boolean => {
        if (startValue && this.formData.value.ngayLapKhDen) {
            return startValue.getTime() > this.formData.value.ngayLapKhDen.getTime();
        } else {
            return false;
        }
    };

    disabledEndNgayLapKh = (endValue: Date): boolean => {
        if (!endValue || !this.formData.value.ngayLapKhTu) {
            return false;
        }
        return endValue.getTime() <= this.formData.value.ngayLapKhDen.getTime();
    };

    disabledStartNgayDuyetLdc = (startValue: Date): boolean => {
        if (startValue && this.formData.value.ngayDuyetLdcDen) {
            return startValue.getTime() > this.formData.value.ngayDuyetLdcDen.getTime();
        }
        return false;
    };

    disabledEndNgayDuyetLdc = (endValue: Date): boolean => {
        if (!endValue || !this.formData.value.ngayDuyetLdcTu) {
            return false;
        }
        return endValue.getTime() <= this.formData.value.ngayDuyetLdcDen.getTime();
    };


    async initData() {
        this.userInfo = this.userService.getUserLogin();
        this.userdetail.maDvi = this.userInfo.MA_DVI;
        this.userdetail.tenDvi = this.userInfo.TEN_DVI;
    }
    async clearForm() {
        this.formData.reset();
        await this.search()
    }
    async timKiem() {
        if (this.formData.value.ngayTongHop) {
            this.formData.value.ngayTongHopTu = dayjs(this.formData.value.ngayTongHop[0]).format('YYYY-MM-DD')
            this.formData.value.ngayTongHopDen = dayjs(this.formData.value.ngayTongHop[1]).format('YYYY-MM-DD')
        }
        await this.search();
    }

    redirectDetail(id, b: boolean) {
        this.selectedId = id;
        this.isDetail = true;
        this.isAddNew = b;
        // this.isViewDetail = isView ?? false;
    }
    async showList() {
        this.isDetail = false;
        this.isAddNew = false;
        this.isEdit = false;
        this.isView = false;
        this.isViewDetail = false;
        await this.search();
    };
    checkRole(trangThai) {
        let check = true;
        if ((this.userService.isTongCuc() && trangThai == STATUS.DU_THAO || this.userService.isTongCuc() && trangThai == STATUS.TU_CHOI_LDC || this.userService.isTongCuc() && trangThai == STATUS.TU_CHOI_TP)) {
            check = false;
        }
        return check;
    };
    viewDetail(id: number, isViewDetail: boolean) {
        this.idSelected = id;
        this.isDetail = true;
        this.isViewDetail = isViewDetail;
        this.isEdit = !isViewDetail;
        // this.isAddNew = true;
    };
    xoaItem(item: any) {
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
                try {
                    // this.deXuatPAGService.delete({ id: item.id }).then((res) => {
                    //     if (res.msg == MESSAGE.SUCCESS) {
                    //         this.notification.success(
                    //             MESSAGE.SUCCESS,
                    //             MESSAGE.DELETE_SUCCESS,
                    //         );
                    //         this.search();
                    //         this.getCount.emit();
                    //     } else {
                    //         this.notification.error(MESSAGE.ERROR, res.msg);
                    //     }
                    //     this.spinner.hide();
                    // });
                } catch (e) {
                    console.log('error: ', e);
                    this.spinner.hide();
                    this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
                }
            },
        });
    }

}
