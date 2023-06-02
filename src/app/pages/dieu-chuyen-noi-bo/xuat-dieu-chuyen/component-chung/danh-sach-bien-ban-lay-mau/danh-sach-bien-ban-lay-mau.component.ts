import { STATUS } from 'src/app/constants/status';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NgxSpinnerService } from "ngx-spinner";
import { NzModalService } from "ng-zorro-antd/modal";
import { StorageService } from 'src/app/services/storage.service';
import { Base2Component } from 'src/app/components/base2/base2.component';
import dayjs from 'dayjs';
import { chain, cloneDeep, groupBy } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { MESSAGE } from 'src/app/constants/message';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { BienBanLayMauDieuChuyenService } from '../services/dcnb-bien-ban-lay-mau.service';

export interface PassData {
    idBbLayMau: number, qdinhDccId: number, soQdinhDcc: string, maLoKho: string, tenLoKho: string,
    maNganKho: string, tenNganKho: string, maNhaKho: string, tenNhaKho: string, maDiemKho: string, tenDiemKho: string
}
@Component({
    selector: 'app-danh-sach-bien-ban-lay-mau',
    templateUrl: './danh-sach-bien-ban-lay-mau.component.html',
    styleUrls: ['./danh-sach-bien-ban-lay-mau.component.scss'],
})
export class DanhSachBienBanLayMau extends Base2Component implements OnInit {
    @Input() title: string = "Danh sách biên bản lấy mẫu/bàn giao mẫu";
    @Input() fileNameExport: string = "file.xlsx";
    @Input() loaiDc: string;
    @Input() typeVthh: string[];
    // @Output() checkPermissonDelete = new EventEmitter<boolean>();
    // @Output() checkPermissonExport = new EventEmitter<boolean>();
    // @Output() checkPermissonAdd = new EventEmitter<boolean>();
    isDetail: boolean = false;
    isAddNew: boolean = false;
    isView: boolean = false;
    idBbLayMau: number;
    isEdit: boolean = false;
    selectedId: number | null;
    list: any[] = [];
    expandSetString = new Set<string>();
    dataView: any[];
    isViewQdDc: boolean = false;
    idQdDc: number;

    page: number = 1;
    pageSize: number = PAGE_SIZE_DEFAULT;
    totalRecord: number = 0;
    dataTable: any[];
    passData: PassData = {
        idBbLayMau: null, qdinhDccId: null, soQdinhDcc: '', maLoKho: '', tenLoKho: '',
        maNganKho: '', tenNganKho: '', maNhaKho: '', tenNhaKho: '', maDiemKho: '', tenDiemKho: ''
    }
    LIST_TRANG_THAI: { [key: string]: string } = {
        [STATUS.DU_THAO]: "Dự thảo",
        [STATUS.CHO_DUYET_LDCC]: "Chờ duyệt LĐ Chi Cục",
        [STATUS.TU_CHOI_LDCC]: "Từ chối LĐ Chi Cục",
        [STATUS.DA_DUYET_LDCC]: "Đã duyệt LĐ Chi Cục"
    }
    constructor(httpClient: HttpClient,
        storageService: StorageService,
        notification: NzNotificationService,
        spinner: NgxSpinnerService,
        modal: NzModalService,
        private bienBanLayMauDieuChuyenService: BienBanLayMauDieuChuyenService,
        private cdr: ChangeDetectorRef,) {
        super(httpClient, storageService, notification, spinner, modal, bienBanLayMauDieuChuyenService);
        this.formData = this.fb.group({
            nam: [null],
            soBbLayMau: [null],
            soQdinhDcc: [null],
            dviKiemNghiem: [null],
            ngayLayMau: [null],
            tuNgay: [null],
            denNgay: [null],
            trangThai: [STATUS.BAN_HANH],
            loaiDc: [],
            loaiVthh: [],
        })
        this.filterTable = {
            nam: '',
            soBbLayMau: '',
            soQdinhDcc: '',
            ngayTao: '',
            tenLoaiVthh: '',
            tenCloaiVthh: '',
            thoiHanDieuChuyen: '',
            trichYeu: '',
            bbTinhKho: '',
            bbHaoDoi: '',
            trangThai: '',
        };
    }

    ngOnInit(): void {
        this.formData.patchValue({ loaiDc: this.loaiDc, loaiVthh: this.typeVthh });
        this.timKiem()
    }
    async timKiem() {
        try {
            await this.search();
            this.buildTableView();

        } catch (error) {
            console.log("error", error)
        }
    }
    clearFilter() {
        this.formData.reset();
        this.timKiem();
    }
    redirectDetail(id: number, b: boolean) {
        this.selectedId = id;
        this.isDetail = true;
        this.isAddNew = b;
    }
    // buildTableView() {
    //     let dataView = Array.isArray(this.dataTable) ?
    //         this.dataTable.map((data) => {

    //             let rs = Array.isArray(data.dcnbBienBanLayMauHdrList) ? chain(data.dcnbBienBanLayMauHdrList).groupBy("maDiemKho").map((v, k) => {
    //                 let rowLv2 = v.find(s => s.maDiemKho === k);
    //                 if (!rowLv2) {
    //                     return;
    //                 }
    //                 return {
    //                     ...rowLv2,
    //                     idVirtual: uuidv4(),
    //                     maDiemKho: k,
    //                     childData: v
    //                 }
    //             }
    //             ).value() : [];

    //             return {
    //                 ...data,
    //                 soQdinhDcc: data.soQdinh,
    //                 qdinhDccId: data.id,
    //                 idVirtual: uuidv4(),
    //                 childData: rs
    //             };
    //         }) : []
    //     this.dataView = dataView;
    //     this.expandAll()
    // }
    buildTableView() {
        let dataView = Array.isArray(this.dataTable) ? this.dataTable.map((data) => {
            let arr = [];
            Array.isArray(data.danhSachQuyetDinh) ? data.danhSachQuyetDinh.forEach(element => {
                Array.isArray(element?.dcnbKeHoachDcHdr?.danhSachHangHoa) && element.dcnbKeHoachDcHdr.danhSachHangHoa.forEach(item => {
                    arr.push(item)
                });
            }) : [];
            const rs = chain(arr).groupBy("maDiemKho").map((v, k) => {
                let rowLv2 = v.find(s => s.maDiemKho === k);
                if (!rowLv2) {
                    return;
                }
                return {
                    ...rowLv2,
                    idVirtual: uuidv4(),
                    maDiemKho: k,
                    childData: v
                }
            }).value()
            return {
                ...data,
                soQdinhDcc: data.soQdinh,
                qdinhDccId: data.id,
                idVirtual: uuidv4(),
                childData: rs
            }
        }) : [];
        this.dataView = dataView;
        this.expandAll()
    }

    expandAll() {
        this.dataView.forEach(s => {
            this.expandSetString.add(s.idVirtual);
        })
    }

    onExpandStringChange(id: string, checked: boolean): void {
        if (checked) {
            this.expandSetString.add(id);
        } else {
            this.expandSetString.delete(id);
        }
    }
    viewDetail(id: number, isView: boolean) {

    }
    redirectToChiTiet(data: any, isView: boolean, idBbLayMau?: number, qdinhDccId?: number, soQdinhDcc?: string, maLoKho?: string, tenLoKho?: string,
        maNganKho?: string, tenNganKho?: string, maNhaKho?: string, tenNhaKho?: string, maDiemKho?: string, tenDiemKho?: string) {
        this.selectedId = idBbLayMau;
        this.isDetail = true;
        this.isView = isView;
        this.passData = {
            idBbLayMau, qdinhDccId, soQdinhDcc, maLoKho, tenLoKho,
            maNganKho, tenNganKho, maNhaKho, tenNhaKho, maDiemKho, tenDiemKho
        }
    }
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
    checkPermissonAdd(): boolean {
        return true
    }
    checkPermissonExport(): boolean {
        return true
    }
    checkPermissonDelete(): boolean {
        return true
    }
    checkRoleAdd(trangThai: string): boolean {
        if (this.userService.isChiCuc() && !trangThai) {
            return true
        }
        return false
    }
    checkRoleView(trangThai: string): boolean {
        if (!this.checkRoleAdd(trangThai) && !this.checkRoleEdit(trangThai)) {
            return true
        }
        return false
    }
    checkRoleEdit(trangThai: string): boolean {
        if (this.userService.isChiCuc() && (trangThai == this.STATUS.DU_THAO || trangThai == this.STATUS.TU_CHOI_LDCC)) {
            return true
        }
        return false
    }
    checkRoleApprove(trangThai: string): boolean {
        if (this.userService.isChiCuc() && trangThai == this.STATUS.CHO_DUYET_LDCC) {
            return true
        }
        return false
    }
    checkRoleDelete(trangThai: string): boolean {
        if (this.userService.isChiCuc() && trangThai == this.STATUS.DU_THAO) {
            return true
        }
    }
    xoaItem(item: any, roles?) {
        if (!this.checkPermission(roles)) {
            return
        }
        this.modal.confirm({
            nzClosable: false,
            nzTitle: 'Xác nhận',
            nzContent: 'Bạn có chắc chắn muốn xóa?',
            nzOkText: 'Đồng ý',
            nzCancelText: 'Không',
            nzOkDanger: true,
            nzWidth: 310,
            nzOnOk: async () => {
                this.spinner.show();
                try {
                    let body = {
                        id: item.id
                    };
                    const res = await this.bienBanLayMauDieuChuyenService.delete(body);
                    if (res.msg == MESSAGE.SUCCESS) {
                        await this.timKiem();
                    }
                } catch (e) {
                    console.log('error: ', e);
                    this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
                }
                finally {
                    this.spinner.hide()
                }
            },
        });
    }
    showList() {
        this.isDetail = false;
        this.timKiem();
    }
    openModalQdDc(idQdDc: number) {
        this.idQdDc = idQdDc;
        this.isViewQdDc = true
    }
    closeModalQdDc() {
        this.idQdDc = null;
        this.isViewQdDc = false;
    }
}

