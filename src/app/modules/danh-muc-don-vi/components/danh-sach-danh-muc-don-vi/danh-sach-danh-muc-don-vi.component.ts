import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import format from 'date-fns/format';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, Subject } from 'rxjs';
import { filter, pluck, shareReplay, takeUntil } from 'rxjs/operators';
import { AuthService } from 'src/app/modules/auth';
import { HttpPaginatedDataSource } from 'src/app/modules/core';
import { ConfirmationDialog, ConfirmCancelDialog, DataTableConfig } from 'src/app/modules/shared';
import { PaginateOptions } from 'src/app/modules/types';
import { DanhMucDonViService } from '../../services/danh-muc-don-vi.service';
import { ThemSuaDanhMucDonVi } from '../them-sua-danh-muc-don-vi/them-sua-danh-muc-don-vi.component'

@Component({
    selector: 'danh-sach-danh-muc-don-vi',
    templateUrl: './danh-sach-danh-muc-don-vi.component.html',
    styleUrls: ['./danh-sach-danh-muc-don-vi.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DanhSachDanhMucDonVi implements OnInit, OnDestroy, OnChanges, AfterViewInit {
    @Input()
    userCollection: any;

    @Input()
    pageSize = 10;

    @Input()
    errorMessages: string[];

    @Output()
    paginate = new EventEmitter<PaginateOptions>();

    currentUserId$: Observable<string>;
    currentUserId: string;
    nextClicked$ = new Subject();
    unsubscribe$ = new Subject();
    panelOpenState = true;
    elementSeleted: any;

    smallScreen$ = this.breakpointObserver
        .observe(['(max-width: 600px)'])
        .pipe(pluck<BreakpointState, boolean>('matches'), takeUntil(this.unsubscribe$), shareReplay(1));
    config: DataTableConfig<any>;

    constructor(
        private breakpointObserver: BreakpointObserver,
        private authService: AuthService,
        private dialog: MatDialog,
        private service: DanhMucDonViService,
        private spinner: NgxSpinnerService,
    ) { }

    ngOnInit() {
        this.currentUserId$ = this.authService.user$.pipe(
            filter(user => !!user),
            pluck('id'),
        );
        this.currentUserId$.subscribe((userId: string) => {
            this.currentUserId = userId;
        });
    }

    ngAfterViewInit() {
        const { data = [], count = 0 } = this.userCollection || {};
        this.initDatatable(data, count, this.userCollection.startAtPage);
    }

    ngOnChanges(changes: SimpleChanges) {
        const { userCollection = null } = changes || {};
        const { currentValue = null } = userCollection || {};
        const { data = null, count = 0 } = currentValue || {};
        this.initDatatable(data, count, this.userCollection.startAtPage);
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    delete() {
        let dialogRef = this.dialog.open(ConfirmCancelDialog, {
            width: '546px',
            data: {
                title: `Xóa danh mục đơn vị`,
                subTitle: `Bạn có chắc chắn muốn xóa danh mục đơn vị?`,
                message: `Khi xóa dữ liệu, các dữ liệu liên quan đến danh mục đơn vị sẽ bị xóa đi.`,
                cancelButtonText: 'Hủy',
                confirmButtonText: 'Xóa',
                hideCancelButton: false,
            },
        });

        dialogRef
            .afterClosed()
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(async result => {
                if (result) {
                    this.spinner.show();
                    const deleteResult = await this.service.delete(this.elementSeleted.id, this.pageSize);
                    if (deleteResult) {
                        this.spinner.hide();
                        this.dialog.open(ConfirmationDialog, {
                            width: '546px',
                            data: {
                                title: `Xóa dữ liệu thành công!`,
                                message: `Danh mục đơn vị đã được xóa thành công.`,
                                closeButtonText: 'Đóng',
                            },
                        });
                    }
                }
            });
    }

    edit(isView: boolean) {
        const termDialog = this.dialog.open(ThemSuaDanhMucDonVi, {
            width: '30vw',
            height: '80vh',
            data: {
                title: 'Cập nhật đơn vị',
                isView: isView,
                id: this.elementSeleted.id,
                capDvi: this.elementSeleted.capDvi,
                diaChi: this.elementSeleted.diaChi,
                ghiChu: this.elementSeleted.ghiChu,
                kieuDvi: this.elementSeleted.kieuDvi,
                loaiDvi: this.elementSeleted.loaiDvi,
                maDvi: this.elementSeleted.maDvi,
                maDviCha: this.elementSeleted.maDviCha,
                maHchinh: this.elementSeleted.maHchinh,
                maPhuong: this.elementSeleted.maPhuong,
                maQuan: this.elementSeleted.maQuan,
                maTinh: this.elementSeleted.maTinh,
                tenDvi: this.elementSeleted.tenDvi,
                trangThai: this.elementSeleted.trangThai,
            },
        });

        termDialog.afterClosed().subscribe(res => {
            console.log(res);
        });
    }

    create() {
        const termDialog = this.dialog.open(ThemSuaDanhMucDonVi, {
            width: '30vw',
            height: '80vh',
            data: {
                title: 'Thêm mới đơn vị',
                isView: false,
                id: 0,
                capDvi: '',
                diaChi: '',
                ghiChu: '',
                kieuDvi: '',
                loaiDvi: '',
                maDvi: '',
                maDviCha: '',
                maHchinh: '',
                maPhuong: '',
                maQuan: '',
                maTinh: '',
                tenDvi: '',
                trangThai: '',
            },
        });

        termDialog.afterClosed().subscribe(res => {
            console.log(res);
        });
    }

    initDatatable(data: any, count: number, startAtPage?: { pageIndex: number }) {
        if (!data) {
            return;
        }
        this.config = {
            data,
            tableName: 'pra-users',
            filterKeys: ['tenDvi', 'maDvi', 'diaChi', 'capDvi', 'maDviCha', 'trangThai'],
            hideFilter: false,
            columns: [
                {
                    text: 'Tên đơn vị',
                    label: 'Tên đơn vị',
                    fieldName: 'tenDvi',
                    style: { flex: 2 },
                    sortable: false,
                },
                {
                    text: 'Mã đơn vị',
                    label: 'Mã đơn vị',
                    fieldName: 'maDvi',
                    style: { flex: 1 },
                    sortable: false,
                },
                {
                    text: 'Địa chỉ',
                    label: 'Địa chỉ',
                    fieldName: 'diaChi',
                    style: { flex: 2 },
                    sortable: false,
                },
                {
                    text: 'Cấp',
                    label: 'Cấp',
                    fieldName: 'capDvi',
                    style: { flex: 1 },
                    sortable: false,
                },
                {
                    text: 'Mã cha',
                    label: 'Mã cha',
                    fieldName: 'maDviCha',
                    style: { flex: 1 },
                    sortable: false,
                },
                {
                    text: 'Trạng thái',
                    label: 'Trạng thái',
                    fieldName: 'trangThai',
                    style: { flex: 2 },
                    sortable: false,
                },
            ],
            mergeActionColumns: false,
            actions: [],
            meta: {
                pageSize: this.pageSize,
                rowsNumber: count,
                startAtPage,
            },
            pageChange: ({ pageSize, pageIndex }: PaginateOptions) => {
                this.paginate.emit({ pageIndex, pageSize });
            },
        };
    }

    selectedPageAtValue(index: number) {
        this.paginate.emit({ pageIndex: index, pageSize: this.pageSize });
    }

    selectPageSizeValue(index: number) {
        this.pageSize = index;
        this.paginate.emit({ pageIndex: 0, pageSize: index });
    }

    selectElementValue(element: any) {
        this.elementSeleted = element;
    }
}
