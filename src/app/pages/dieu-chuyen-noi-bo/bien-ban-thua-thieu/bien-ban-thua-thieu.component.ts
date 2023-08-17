import { DataService } from './../../../services/data.service';
import { Component, OnInit, Input } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { StorageService } from 'src/app/services/storage.service';
import { HttpClient } from '@angular/common/http';
import { MESSAGE } from 'src/app/constants/message';
import { UserLogin } from 'src/app/models/userlogin';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { BienBanThuThieuService } from './bien-ban-thua-thieu.service';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
    selector: 'app-bien-ban-thua-thieu',
    templateUrl: './bien-ban-thua-thieu.component.html',
    styleUrls: ['./bien-ban-thua-thieu.component.scss']
})
export class BienBanThuaThieuComponent extends Base2Component implements OnInit {
    @Input() viewOnly: boolean;
    @Input() loaiBc: string;
    userInfo: UserLogin;
    userdetail: any = {};
    selectedId: number = 0;
    isView: boolean;
    isDetail: boolean;
    page: number = 1;
    pageSize: number = PAGE_SIZE_DEFAULT;
    totalRecord: number = 0;
    passData: { soQdDcCuc: string, qdDcCucId: number, ngayKyQd: string, soBc: string, tenBc: string, bcKetQuaDcId: number, ngayBc: string } = {
        soQdDcCuc: '', qdDcCucId: null, ngayKyQd: '', soBc: '', tenBc: '', bcKetQuaDcId: null, ngayBc: ''
    };
    LIST_TRANG_THAI: Array<{ ma: string, giaTri: string }> = [
        { ma: this.STATUS.DU_THAO, giaTri: "Dự thảo" },
        { ma: this.STATUS.DA_HOAN_THANH, giaTri: "Đã hoàn thành" },

    ];
    TRANG_THAI: { [key: string]: string } = {
        [this.STATUS.DU_THAO]: "Dự thảo",
        [this.STATUS.DA_HOAN_THANH]: "Đã hoàn thành",
    }
    constructor(
        httpClient: HttpClient,
        storageService: StorageService,
        notification: NzNotificationService,
        spinner: NgxSpinnerService,
        modal: NzModalService,
        private bienBanThuThieuService: BienBanThuThieuService,
        private dataService: DataService,
        private router: Router,
        private route: ActivatedRoute
        // private donviService: DonviService,
        // private danhMucService: DanhMucService,
    ) {
        super(httpClient, storageService, notification, spinner, modal, bienBanThuThieuService)
        this.formData = this.fb.group({
            nam: [''],
            soQdinhCuc: [''],
            soBb: [''],
            tuNgayBc: [''],
            denNgayBc: [''],
            soBcKetQuaDc: [''],
            tuNgayLap: [''],
            denNgayLap: [''],
            trangThai: [''],

        })
        this.filterTable = {
            nam: '',
            // soQdinhCuc: '',
            soQdDcCuc: '',
            ngayKyQdCuc: '',
            soBb: '',
            ngayLap: '',
            ngayLapBcKetQuaDc: '',
            tenBaoCao: '',
            soBcKetQuaDc: '',
            trangThai: ''
        };
    }


    async ngOnInit(): Promise<void> {
        try {
            this.spinner.show();
            this.dataService.currentData.subscribe(data => {
                if (data && data.soBc) {
                    this.passData = { ...data };
                    this.isDetail = true;
                }
            });
            this.dataService.removeData();
            if (!this.isDetail) {
                if (this.viewOnly) {
                    this.isView = true
                }
                await this.initData()
                await this.timKiem();

            }
        } catch (e) {
            console.log('error: ', e)
            this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
        finally {
            this.spinner.hide();
        }
    }

    async initData() {
        this.userInfo = this.userService.getUserLogin();
        this.userdetail.maDvi = this.userInfo.MA_DVI;
        this.userdetail.tenDvi = this.userInfo.TEN_DVI;
    }
    async clearForm() {
        this.formData.reset();
        await this.timKiem()
    }
    async timKiem() {
        try {
            const data = this.formData.value;
            const dataTrim = this.trimStringData(data);
            this.formData.patchValue({ ...dataTrim })
            await this.search();
        } catch (error) {
            console.log("error", error)
        }
    };
    trimStringData(obj: any) {
        for (const key in obj) {
            const value = obj[key];
            if (typeof value === 'string' || value instanceof String) {
                obj[key] = value.trim();
            }
        };
        return obj
    }
    disabledTuNgay = (startValue: Date): boolean => {
        if (startValue && this.formData.value.denNgayBc) {
            return startValue.getTime() > this.formData.value.denNgayBc.getTime();
        }
        return false;
    };

    disabledDenNgay = (endValue: Date): boolean => {
        if (!endValue || !this.formData.value.tuNgayBc) {
            return false;
        }
        return endValue.getTime() <= this.formData.value.tuNgayBc.getTime();
    };
    disabledTuNgayBbTt = (startValue: Date): boolean => {
        if (startValue && this.formData.value.denNgayLap) {
            return startValue.getTime() > this.formData.value.denNgayLap.getTime();
        }
        return false;
    };

    disabledDenNgayBbTt = (endValue: Date): boolean => {
        if (!endValue || !this.formData.value.tuNgayLap) {
            return false;
        }
        return endValue.getTime() <= this.formData.value.tuNgayLap.getTime();
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
                        let res = await this.bienBanThuThieuService.deleteMuti({ ids: dataDelete });
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
    redirectDetail(id: number, isView: boolean) {
        this.selectedId = id;
        this.isDetail = true;
        this.isView = isView;
    }
    checkRoleView(trangThai: string): boolean {
        return !this.checkRoleEdit(trangThai) && !this.checkRoleApproveDc(trangThai) && !this.checkRoleDelete(trangThai)
    }
    checkRoleAdd(): boolean {
        return this.userService.isChiCuc()
    }
    checkRoleEdit(trangThai: string): boolean {
        return this.userService.isChiCuc() && trangThai === this.STATUS.DU_THAO
    }
    checkRoleApproveDc(trangThai: string): boolean {
        return this.userService.isChiCuc() && trangThai === this.STATUS.DU_THAO
    }
    checkRoleDelete(trangThai: string): boolean {
        return this.userService.isChiCuc() && trangThai === this.STATUS.DU_THAO
    }
    goBack() {
        this.showList();
        this.passData = {
            soQdDcCuc: '', qdDcCucId: null, ngayKyQd: '', soBc: '', tenBc: '', bcKetQuaDcId: null, ngayBc: ''
        };
    }
}
