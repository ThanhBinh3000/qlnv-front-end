import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NgxSpinnerService } from "ngx-spinner";
import { NzModalService } from "ng-zorro-antd/modal";
import { StorageService } from 'src/app/services/storage.service';
import { Base2Component } from 'src/app/components/base2/base2.component';
import dayjs from 'dayjs';

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
    isViewDetail: boolean = false;
    isEdit: boolean = false;
    selectedId: number | null;
    list: any[] = []
    constructor(httpClient: HttpClient,
        storageService: StorageService,
        notification: NzNotificationService,
        spinner: NgxSpinnerService,
        modal: NzModalService,
        private cdr: ChangeDetectorRef,) {
        super(httpClient, storageService, notification, spinner, modal, undefined);
        this.formData = this.fb.group({
            namKeHoach: [''],
            soBienBanLayMau: [''],
            soQDDC: [''],
            donViKiemNghiem: [''],
            ngayLayMau: [''],
            tuNgay: [''],
            denNgay: [''],
        })
        this.filterTable = {
            namKeHoach: '',
            soBienBanLayMau: '',
            soQDDC: '',
            donViKiemNghiem: '',
            ngayLayMau: '',
            thTuNgay: '',
            thDenNgay: '',
        };
    }

    ngOnInit(): void {
    }
    async timKiem() {
        if (this.formData.value.ngayLayMau) {
            this.formData.value.tuNgay = dayjs(this.formData.value.ngayLayMau[0]).format('YYYY-MM-DD')
            this.formData.value.denNgay = dayjs(this.formData.value.ngayLayMau[1]).format('YYYY-MM-DD')
        }
        await this.search();
    }
    redirectDetail(id: number, b: boolean) {
        this.selectedId = id;
        this.isDetail = true;
        this.isAddNew = b;
    }
    viewDetail(id: number, isViewDetail: boolean) {

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
    deleteMulti() {

    }
    showList() {

    }
}
