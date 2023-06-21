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
import { TongHopDieuChuyenCapTongCucService } from './../tong-hop-dieu-chuyen-tai-tong-cuc.service';
import { Router } from '@angular/router';

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
    // listLoaiHangHoa: any[] = [];
    // listHangHoaAll: any[] = [];
    // listChungLoaiHangHoa: any[] = [];
    listTrangThai: any[] = [
        { ma: STATUS.CHUA_TAO_QD, giaTri: 'Chưa tạo QĐ' },
        { ma: STATUS.DA_DU_THAO_QD, giaTri: 'Đã dự thảo QĐ' },
        { ma: STATUS.DA_BAN_HANH_QD, giaTri: 'Đã ban hành QĐ' },
        { ma: STATUS.TU_CHOI_BAN_HANH_QD, giaTri: 'Từ chối ban hành QĐ' }
    ];
    LIST_TRANG_THAI: { [key: string]: string } = {
        [STATUS.CHUA_TAO_QD]: 'Chưa tạo QĐ',
        [STATUS.DA_DU_THAO_QD]: 'Đã dự thảo QĐ',
        [STATUS.DA_BAN_HANH_QD]: 'Đã ban hành QĐ',
        [STATUS.TU_CHOI_BAN_HANH_QD]: 'Từ chối ban hành QĐ'
    }
    listLoaiDieuChuyen: any[] = [
        { value: "CHI_CUC", giaTri: "Giữa 2 chi cục trong cùng 1 cục" },
        { value: "CUC", giaTri: "Giữa 2 cục DTNN KV" },
    ];
    LIST_DIEU_CHUYEN = {
        // "ALL": "Tất cả",
        "CHI_CUC": "Giữa 2 chi cục trong cùng 1 cục",
        "CUC": "Giữa 2 cục DTNN KV"
    }
    isViewDetail: boolean = false;
    isAddNew: boolean = false;
    isEdit: boolean = false;

    dataTable: any[] = [];

    isViewModalQdDc: boolean = false;
    idQdDcSelect: number;

    constructor(
        httpClient: HttpClient,
        storageService: StorageService,
        notification: NzNotificationService,
        spinner: NgxSpinnerService,
        modal: NzModalService,
        private router: Router,
        private tongHopDieuChuyenCapTongCucService: TongHopDieuChuyenCapTongCucService,
        private donviService: DonviService,
        private danhMucService: DanhMucService,
        private deXuatPhuongAnCuuTroService: DeXuatPhuongAnCuuTroService,
    ) {
        super(httpClient, storageService, notification, spinner, modal, tongHopDieuChuyenCapTongCucService);
        this.formData = this.fb.group({
            namKeHoach: [''],
            id: [''],
            loaiDieuChuyen: [''],
            tuNgay: [''],
            denNgay: [''],
            trichYeu: ['']

        })
        this.filterTable = {
            namKeHoach: '',
            id: '',
            loaiDieuChuyen: '',
            ngayTongHop: '',
            trichYeu: '',
            soQdDC: '',
            tenTrangThai: '',
        };
    }


    dsDonvi: any[] = [];
    userInfo: UserLogin;
    userdetail: any = {};
    selectedId: number = 0;
    isVatTu: boolean = false;
    isView = false;
    selectQdDcId: number;


    async ngOnInit() {
        try {
            await this.initData()
            this.timKiem();
            // this.loadDsVthh();
        } catch (e) {
            console.log('error: ', e)
            this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        } finally {
            this.spinner.hide();
        }
    }
    // async loadDsVthh() {
    //     let res = await this.danhMucService.getDanhMucHangDvqlAsyn({});
    //     if (res.msg == MESSAGE.SUCCESS) {
    //         this.listHangHoaAll = res.data;
    //         this.listLoaiHangHoa = res.data?.filter((x) => (x.ma.length == 2 && !x.ma.match("^01.*")) || (x.ma.length == 4 && x.ma.match("^01.*")));
    //     }
    // }
    // async changeHangHoa(event: any) {
    //     if (event) {
    //         this.formData.patchValue({ chungLoaiHangHoa: "" });
    //         this.listChungLoaiHangHoa = []

    //         let res = await this.danhMucService.loadDanhMucHangHoaTheoMaCha({ str: event });
    //         if (res.msg == MESSAGE.SUCCESS) {
    //             if (res.data) {
    //                 this.listChungLoaiHangHoa = res.data;
    //             }
    //         } else {
    //             this.notification.error(MESSAGE.ERROR, res.msg);
    //         }
    //     }
    // }
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
    updateAllChecked(): void {
        this.indeterminate = false;
        if (this.allChecked) {
            if (this.dataTable && this.dataTable.length > 0) {
                this.dataTable.forEach((item) => {
                    if (item.trangThai == this.STATUS.CHUA_TAO_QD) {
                        item.checked = true;
                    }
                });
            }
        } else {
            if (this.dataTable && this.dataTable.length > 0) {
                this.dataTable.forEach((item) => {
                    item.checked = false;
                });
            }
        }
    }
    taoQuyetDinhDc(id: number, qdDcId: number) {
        if (!qdDcId) {
            this.router.navigate(['dieu-chuyen-noi-bo/quyet-dinh-dieu-chuyen', { id }]);
        } else {
            this.router.navigate(['dieu-chuyen-noi-bo/quyet-dinh-dieu-chuyen', { qdDcId }]);
        }
    }
    checkRoleView(trangThai: string): boolean {
        // return !(this.checkRoleEdit(trangThai) || this.checkRoleDelete(trangThai))
        return !this.checkRoleDelete(trangThai)
    }
    // checkRoleEdit(trangThai: string): boolean {
    //     return this.userService.isTongCuc() && trangThai == STATUS.CHUA_TAO_QD
    // };
    checkRoleDelete(trangThai: string): boolean {
        return this.userService.isTongCuc() && trangThai == STATUS.CHUA_TAO_QD
    }
    viewDetail(id: number, isViewDetail: boolean, qdDcId: number) {
        this.selectedId = id;
        this.isDetail = true;
        this.isViewDetail = isViewDetail;
        this.isEdit = !isViewDetail;
        this.isAddNew = false;
        this.selectQdDcId = qdDcId;
    };
    xoaItem(item: any) {
        this.delete(item)
    };
    disabledTuNgay = (startValue: Date): boolean => {
        if (startValue && this.formData.value.denNgay) {
            return startValue.getTime() > this.formData.value.denNgay.getTime();
        }
        return false;
    };

    disabledDenNgay = (endValue: Date): boolean => {
        if (!endValue || !this.formData.value.tuNgay) {
            return false;
        }
        return endValue.getTime() <= this.formData.value.tuNgay.getTime();
    };
    deleteSelect() {
        let dataDelete = [];
        if (this.dataTable && this.dataTable.length > 0) {
            this.dataTable.forEach((item) => {
                if (item.checked) {
                    dataDelete.push(item.id);
                }
            });
        }
        if (dataDelete && dataDelete.length > 0) {
            this.modal.confirm({
                nzClosable: false,
                nzTitle: 'Xác nhận',
                nzContent: 'Bạn có chắc chắn muốn xóa các bản ghi đã chọn?',
                nzOkText: 'Đồng ý',
                nzCancelText: 'Không',
                nzOkDanger: true,
                nzWidth: 310,
                nzOnOk: async () => {
                    this.spinner.show();
                    try {
                        let res = await this.tongHopDieuChuyenCapTongCucService.deleteMuti({ ids: dataDelete });
                        if (res.msg == MESSAGE.SUCCESS) {
                            this.notification.success(MESSAGE.SUCCESS, MESSAGE.DELETE_SUCCESS);
                            await this.search();
                            this.allChecked = false;
                        } else {
                            this.notification.error(MESSAGE.ERROR, res.msg);
                        }
                        this.spinner.hide();
                    } catch (e) {
                        console.log('error: ', e);
                        this.spinner.hide();
                        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
                    }
                },
            });
        }
        else {
            this.notification.error(MESSAGE.ERROR, "Không có dữ liệu phù hợp để xóa.");
        }
    }
    openModalQdDc(event, id: number) {
        event.preventDefault();
        event.stopPropagation();
        if (id) {
            this.idQdDcSelect = id;
            this.isViewModalQdDc = true
        }
    };
    closeModalQdDc() {
        this.idQdDcSelect = null;
        this.isViewModalQdDc = false
    }

}
