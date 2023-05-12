import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NgxSpinnerService } from "ngx-spinner";
import { NzModalService } from "ng-zorro-antd/modal";
import { StorageService } from 'src/app/services/storage.service';
import { Base2Component } from 'src/app/components/base2/base2.component';
import dayjs from 'dayjs';
import { chain } from 'lodash';
import { v4 as uuidv4 } from 'uuid';

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

    constructor(httpClient: HttpClient,
        storageService: StorageService,
        notification: NzNotificationService,
        spinner: NgxSpinnerService,
        modal: NzModalService,
        private cdr: ChangeDetectorRef,) {
        super(httpClient, storageService, notification, spinner, modal, undefined);
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
    }
    async timKiem() {
        if (this.formData.value.ngayLayMau) {
            this.formData.value.ngayLayMauTu = dayjs(this.formData.value.ngayLayMau[0]).format('YYYY-MM-DD')
            this.formData.value.ngayLayMauDen = dayjs(this.formData.value.ngayLayMau[1]).format('YYYY-MM-DD')
        }
        await this.search();
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
        let dataView = chain(this.dataTable).groupBy("soQd").map((value, key) => {
            let rs = chain(value).groupBy("maDiemKho").map((v, k) => {
                let rowLv2 = v.find(s => s.maDiemKho === k);
                return {
                    id: rowLv2.id,
                    idVirtual: uuidv4(),
                    maDiemKho: k,
                    tenDiemKho: rowLv2.tenDiemKho,
                    maNhaKho: rowLv2.maNhaKho,
                    tenNhaKho: rowLv2.tenNhaKho,
                    maNganKho: rowLv2.maNganKho,
                    tenNganKho: rowLv2.tenNganKho,
                    tenLoKho: rowLv2.tenLoKho,
                    maLoKho: rowLv2.maLoKho,
                    soPhieu: rowLv2.soPhieu,
                    soBienBan: rowLv2.soBienBan,
                    ngayLayMau: rowLv2.ngayLayMau,
                    soBbTinhKho: rowLv2.soBbTinhKho,
                    ngayXuatDocKho: rowLv2.ngayXuatDocKho,
                    soBbHaoDoi: rowLv2.soBbHaoDoi,
                    trangThai: rowLv2.trangThai,
                    tenTrangThai: rowLv2.tenTrangThai,
                    childData: v
                }
            }
            ).value();
            let rowLv1 = value.find(s => s.soQd === key);
            return {
                idVirtual: uuidv4(),
                soQd: key,
                nam: rowLv1.nam,
                ngayQd: rowLv1.ngayQd,
                idQd: rowLv1.idQd,
                childData: rs
            };
        }).value();
        this.dataView = dataView
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
    redirectToChiTiet(lv2: any, isView: boolean, idBbLayMau?: number) {
        this.selectedId = lv2.id;
        this.isDetail = true;
        this.isView = isView;
        this.idBbLayMau = idBbLayMau;
    }
    checkPermissonAdd(): boolean {
        return true
    }
    checkPermissonExport(): boolean {
        return true
    }
    checkPermissonDelete(): boolean {
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

