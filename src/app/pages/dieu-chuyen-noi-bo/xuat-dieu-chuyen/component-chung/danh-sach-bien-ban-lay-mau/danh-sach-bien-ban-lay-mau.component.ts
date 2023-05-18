import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NgxSpinnerService } from "ngx-spinner";
import { NzModalService } from "ng-zorro-antd/modal";
import { StorageService } from 'src/app/services/storage.service';
import { Base2Component } from 'src/app/components/base2/base2.component';
import dayjs from 'dayjs';
import { chain, cloneDeep } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { MESSAGE } from 'src/app/constants/message';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { BienBanLayMauDieuChuyenService } from '../services/dcnb-bien-ban-lay-mau.service';

@Component({
    selector: 'app-danh-sach-bien-ban-lay-mau',
    templateUrl: './danh-sach-bien-ban-lay-mau.component.html',
    styleUrls: ['./danh-sach-bien-ban-lay-mau.component.scss'],
})
export class DanhSachBienBanLayMau extends Base2Component implements OnInit {
    @Input() title: string = "Danh sách biên bản lấy mẫu/bàn giao mẫu"
    @Input() fileNameExport: string = "file.xlsx"
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
    passData: {
        idBbLayMau: number, qdinhDccId: number, soQdinhDcc: string, maLoKho: string, tenLoKho: string,
        maNganKho: string, tenNganKho: string, maNhaKho: string, tenNhaKho: string, maDiemKho: string, tenDiemKho: string
    } = {
        idBbLayMau: null, qdinhDccId: null, soQdinhDcc: '', maLoKho: '', tenLoKho: '',
            maNganKho: '', tenNganKho: '', maNhaKho: '', tenNhaKho: '', maDiemKho: '', tenDiemKho: ''
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
            namKeHoach: [null],
            soBienBan: [null],
            soQd: [null],
            dviKnghiem: [null],
            ngayLayMau: [null],
            ngayLayMauTu: [null],
            ngayLayMauDen: [null],
            maDvi: [null],
            loaiVthh: [null],
        })
        this.filterTable = {
            nam: '',
            soQd: '',
            ngayTao: '',
            soHd: '',
            tenLoaiVthh: '',
            tenCloaiVthh: '',
            tgianGnhan: '',
            trichYeu: '',
            bbTinhKho: '',
            bbHaoDoi: '',
            tenTrangThai: '',
            tenTrangThaiXh: '',
        };
    }

    ngOnInit(): void {
        this.timKiem()
    }
    async timKiem() {
        if (this.formData.value.ngayLayMau) {
            this.formData.value.ngayLayMauTu = dayjs(this.formData.value.ngayLayMau[0]).format('YYYY-MM-DD')
            this.formData.value.ngayLayMauDen = dayjs(this.formData.value.ngayLayMau[1]).format('YYYY-MM-DD')
        }
        try {

            const res = await this.bienBanLayMauDieuChuyenService.search({
                trangThai: this.STATUS.BAN_HANH,
                loaiDc: "DCNB",
                paggingReq: {
                    // limit: this.globals.prop.MAX_INTERGER,
                    limit: this.pageSize,
                    page: this.page - 1
                },
            });
            if (res.msg == MESSAGE.SUCCESS) {
                let data = res.data;
                console.log("data", data.content)
                if (data && data.content && data.content.length > 0) {
                    this.dataTable = cloneDeep(data.content);
                    this.totalRecord = data.totalElements;
                    this.buildTableView()
                }
            } else {
                this.notification.error(MESSAGE.ERROR, res.msg)
            }
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
    buildTableView() {
        let dataView = chain(this.dataTable).groupBy("soQdinhDcc").map((value, key) => {
            let rs = chain(value).groupBy("maDiemKho").map((v, k) => {
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
            }
            ).value();
            let rowLv1 = value.find(s => s.soQdinhDcc === key);
            if (!rowLv1) {
                return;
            }
            return {
                ...rowLv1,
                idVirtual: uuidv4(),
                childData: rs
            };
        }).value();
        this.dataView = dataView;
        console.log("dataView", this.dataView)
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
    redirectToChiTiet(lv2: any, isView: boolean, idBbLayMau?: number, qdinhDccId?: number, soQdinhDcc?: string, maLoKho?: string, tenLoKho?: string,
        maNganKho?: string, tenNganKho?: string, maNhaKho?: string, tenNhaKho?: string, maDiemKho?: string, tenDiemKho?: string) {
        this.selectedId = idBbLayMau;
        this.isDetail = true;
        this.isView = isView;
        this.passData = {
            idBbLayMau, qdinhDccId, soQdinhDcc, maLoKho, tenLoKho,
            maNganKho, tenNganKho, maNhaKho, tenNhaKho, maDiemKho, tenDiemKho
        }
        console.log("idBbLayMau, qdinhDccId, soQdinhDcc, maLoKho", idBbLayMau, qdinhDccId, soQdinhDcc, maLoKho, tenLoKho,
            maNganKho, tenNganKho, maNhaKho, tenNhaKho, maDiemKho, tenDiemKho);
        console.log("=========================================================")
        console.log("passData", this.passData)
    }
    disabledTuNgay = (startValue: Date): boolean => {
        if (startValue && this.formData.value.ngayLayMauDen) {
            return startValue.getTime() > this.formData.value.ngayLayMauDen.getTime();
        }
        return false;
    };

    disabledDenNgay = (endValue: Date): boolean => {
        if (!endValue || !this.formData.value.ngayLayMauTu) {
            return false;
        }
        return endValue.getTime() <= this.formData.value.ngayLayMauTu.getTime();
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
        return true
    }
    checkRoleView(trangThai: string): boolean {
        return true
    }
    checkRoleEdit(trangThai: string): boolean {
        return true
    }
    checkRoleApprove(trangThai: string): boolean {
        return true
    }
    checkRoleDelete(trangThai: string): boolean {
        return true
    }
    xoaItem(data) {

    }
    showList() {
        this.isDetail = false;
        this.search();
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

