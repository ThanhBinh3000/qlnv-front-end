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
import { DanhMucCongCuDungCuService } from '../../services/danh-muc-cong-cu-dung-cu.service';
import { ThemSuaDanhMucCongCuDungCu } from '../them-sua-danh-muc-cong-cu-dung-cu/them-sua-danh-muc-cong-cu-dung-cu.component';

@Component({
    selector: 'danh-sach-danh-muc-cong-cu-dung-cu',
    templateUrl: './danh-sach-danh-muc-cong-cu-dung-cu.component.html',
    styleUrls: ['./danh-sach-danh-muc-cong-cu-dung-cu.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DanhSachDanhMucCongCuDungCu implements OnInit, OnDestroy, OnChanges, AfterViewInit {
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

    listTrangThai = [
        {
            value: '00',
            text: 'Ẩn',
        },
        {
            value: '01',
            text: 'Hiện',
        },
    ];

    optionSearch = {
        maCcu: null,
        tenCcu: '',
        trangThai: null,
    };

    smallScreen$ = this.breakpointObserver
        .observe(['(max-width: 600px)'])
        .pipe(pluck<BreakpointState, boolean>('matches'), takeUntil(this.unsubscribe$), shareReplay(1));
    config: DataTableConfig<any>;

    constructor(
        private breakpointObserver: BreakpointObserver,
        private authService: AuthService,
        private dialog: MatDialog,
        private service: DanhMucCongCuDungCuService,
        private spinner: NgxSpinnerService,
    ) {}

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

    search() {
        this.spinner.show();
        this.service.paginteAdmins({ pageIndex: 0, pageSize: this.pageSize }, this.optionSearch).subscribe(data => {
            this.spinner.hide();
            console.log(data);
        });
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    delete() {
        if (this.elementSeleted && this.elementSeleted.id > 0) {
            let dialogRef = this.dialog.open(ConfirmCancelDialog, {
                width: '546px',
                data: {
                    title: `Xóa danh mục công cụ bảo quản`,
                    subTitle: `Bạn có chắc chắn muốn xóa danh mục công cụ bảo quản?`,
                    message: `Khi xóa dữ liệu, các dữ liệu liên quan đến công cụ bảo quản "${this.elementSeleted.tenCcu}" sẽ bị xóa đi.`,
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
                            this.optionSearch = {
                                maCcu: null,
                                tenCcu: '',
                                trangThai: null,
                            };
                            this.dialog.open(ConfirmationDialog, {
                                width: '546px',
                                data: {
                                    title: `Xóa dữ liệu thành công!`,
                                    message: `Danh mục công cụ bảo quản đã được xóa thành công.`,
                                    closeButtonText: 'Đóng',
                                },
                            });
                        }
                    }
                });
        }
    }

    edit(isView: boolean) {
        const termDialog = this.dialog.open(ThemSuaDanhMucCongCuDungCu, {
            width: '30vw',
            height: '70vh',
            data: {
                title: isView ? 'Thông tin công cụ bảo quản' : 'Cập nhật công cụ bảo quản',
                isView: isView,
                id: this.elementSeleted.id,
                maCcu: this.elementSeleted.maCcu,
                maDviTinh: this.elementSeleted.maDviTinh,
                tenCcu: this.elementSeleted.tenCcu,
                ghiChu: this.elementSeleted.ghiChu,
                trangThai: this.elementSeleted.trangThai,
            },
        });

        termDialog.afterClosed().subscribe(res => {
            if (res) {
                this.optionSearch = {
                    maCcu: null,
                    tenCcu: '',
                    trangThai: null,
                };
            }
        });
    }

    create() {
        const termDialog = this.dialog.open(ThemSuaDanhMucCongCuDungCu, {
            width: '30vw',
            height: '70vh',
            data: {
                title: 'Thêm mới công cụ bảo quản',
                isView: false,
                id: 0,
                maCcu: null,
                maDviTinh: '',
                tenCcu: '',
                ghiChu: '',
                trangThai: null,
            },
        });

        termDialog.afterClosed().subscribe(res => {
            if (res) {
                this.optionSearch = {
                    maCcu: null,
                    tenCcu: '',
                    trangThai: null,
                };
            }
        });
    }

    initDatatable(data: any, count: number, startAtPage?: { pageIndex: number }) {
        if (!data) {
            return;
        }
        this.config = {
            data,
            tableName: 'pra-users',
            filterKeys: ['id','tenCcu', 'ghiChu', 'trangThai'],
            hideFilter: false,
            columns: [
                {
                    text: 'Mã công cụ',
                    label: 'Mã công cụ',
                    fieldName: 'id',
                    style: { flex: 1 },
                    sortable: false,
                },
                {
                    text: 'Tên công cụ',
                    label: 'Tên công cụ',
                    fieldName: 'tenCcu',
                    style: { flex: 2 },
                    sortable: false,
                },
                {
                    text: 'Ghi chú',
                    label: 'Ghi chú',
                    fieldName: 'ghiChu',
                    style: { flex: 2 },
                    sortable: false,
                },
                {
                    text: 'Trạng thái',
                    label: 'Trạng thái',
                    fieldName: 'trangThai',
                    valueFunction: element => this.textStatus(element.trangThai),
                    style: { flex: 1 },
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
        console.log(this.elementSeleted);
    }

    textStatus(status: string): string {
        switch (status) {
            case '00':
                return 'Ẩn';
            case '01':
                return 'Hiện';
            default:
                return '';
        }
    }
}
