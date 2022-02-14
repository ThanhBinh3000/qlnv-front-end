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
import { DanhMucHangDtqgService } from '../../services/danh-muc-hang-dtqg.service';
import { ThemSuaDanhMucHangDtqg } from '../them-sua-danh-muc-hang-dtqg/them-sua-danh-muc-hang-dtqg.component';

@Component({
    selector: 'danh-sach-danh-muc-hang-dtqg',
    templateUrl: './danh-sach-danh-muc-hang-dtqg.component.html',
    styleUrls: ['./danh-sach-danh-muc-hang-dtqg.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DanhSachDanhMucHangDtqg implements OnInit, OnDestroy, OnChanges, AfterViewInit {
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
        ma: '',
        ten: '',
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
        private service: DanhMucHangDtqgService,
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
                    title: `Xóa danh mục hàng DTQG`,
                    subTitle: `Bạn có chắc chắn muốn xóa danh mục hàng DTQG?`,
                    message: `Khi xóa dữ liệu, các dữ liệu liên quan đến hàng DTQG "${this.elementSeleted.ten}" sẽ bị xóa đi.`,
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
                                ma: '',
                                ten: '',
                                trangThai: null,
                            };
                            this.dialog.open(ConfirmationDialog, {
                                width: '546px',
                                data: {
                                    title: `Xóa dữ liệu thành công!`,
                                    message: `Danh mục hàng DTQG đã được xóa thành công.`,
                                    closeButtonText: 'Đóng',
                                },
                            });
                        }
                    }
                });
        }
    }

    edit(isView: boolean) {
        console.log(this.elementSeleted);
        
        const termDialog = this.dialog.open(ThemSuaDanhMucHangDtqg, {
            width: '30vw',
            height: '70vh',
            data: {
                title: isView ? 'Thông tin hàng DTQG' : 'Cập nhật hàng DTQG',
                isView: isView,
                id: this.elementSeleted.id,
                ten: this.elementSeleted.ten,
                ma: this.elementSeleted.ma,
                ghiChu: this.elementSeleted.ghiChu,
                maCha: this.elementSeleted.maCha,
                trangThai: this.elementSeleted.trangThai,
            },
        });

        termDialog.afterClosed().subscribe(res => {
            if (res) {
                this.optionSearch = {
                    ma: '',
                    ten: '',
                    trangThai: null,
                };
            }
        });
    }

    create() {
        const termDialog = this.dialog.open(ThemSuaDanhMucHangDtqg, {
            width: '30vw',
            height: '70vh',
            data: {
                title: 'Thêm mới hàng DTQG',
                isView: false,
                id: 0,
                ten: '',
                ma: '',
                ghiChu: '',
                maCha: '',
                trangThai: null,
            },
        });

        termDialog.afterClosed().subscribe(res => {
            if (res) {
                this.optionSearch = {
                    ma: '',
                    ten: '',
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
            filterKeys: ['ten', 'ma', 'ghiChu', 'trangThai'],
            hideFilter: false,
            columns: [
                {
                    text: 'Tên hàng',
                    label: 'Tên hàng',
                    fieldName: 'ten',
                    style: { flex: 4 },
                    sortable: false,
                },
                {
                    text: 'Mã hàng',
                    label: 'Mã hàng',
                    fieldName: 'ma',
                    style: { flex: 2 },
                    sortable: false,
                },
                {
                    text: 'Ghi Chú',
                    label: 'Ghi Chú',
                    fieldName: 'ghiChu',
                    style: { flex: 3 },
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
