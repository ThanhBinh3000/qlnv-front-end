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
import { DanhMucKeLotService } from '../../services/danh-muc-ke-lot.service';
import { ThemSuaDanhMucKeLot } from '../them-sua-danh-muc-ke-lot/them-sua-danh-muc-ke-lot.component';

@Component({
    selector: 'danh-sach-danh-muc-ke-lot',
    templateUrl: './danh-sach-danh-muc-ke-lot.component.html',
    styleUrls: ['./danh-sach-danh-muc-ke-lot.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DanhSachDanhMucKeLot implements OnInit, OnDestroy, OnChanges, AfterViewInit {
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
        maKieuKelot: null,
        tenKieuKelot: '',
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
        private service: DanhMucKeLotService,
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

    delete(event: any,element: any) {
        if (element && element.id > 0) {
            let dialogRef = this.dialog.open(ConfirmCancelDialog, {
                width: '546px',
                data: {
                    title: `Xóa danh mục kê lót`,
                    subTitle: `Bạn có chắc chắn muốn xóa danh mục kê lót?`,
                    message: `Khi xóa dữ liệu, các dữ liệu liên quan đến kê lót "${element.tenKieuKelot}" sẽ bị xóa đi.`,
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
                        const deleteResult = await this.service.delete(element.id, this.pageSize);
                        if (deleteResult) {
                            this.optionSearch = {
                                maKieuKelot: null,
                                tenKieuKelot: '',
                                trangThai: null,
                            };
                            this.dialog.open(ConfirmationDialog, {
                                width: '546px',
                                data: {
                                    title: `Xóa dữ liệu thành công!`,
                                    message: `Danh mục kê lót đã được xóa thành công.`,
                                    closeButtonText: 'Đóng',
                                },
                            });
                        }
                    }
                });
        }
    }

    commonFunc(element: any, isView: boolean) {
        const termDialog = this.dialog.open(ThemSuaDanhMucKeLot, {
            width: '450px',
            data: {
                title: isView ? 'Thông tin kê lót' : 'Cập nhật kê lót',
                isView: isView,
                id: element.id,
                maKieuKelot: element.maKieuKelot,
                tenKieuKelot: element.tenKieuKelot,
                ghiChu: element.ghiChu,
                trangThai: element.trangThai,
            },
        });

        termDialog.afterClosed().subscribe(res => {
            if (res) {
                this.optionSearch = {
                    maKieuKelot: null,
                    tenKieuKelot: '',
                    trangThai: null,
                };
            }
        });
    }
    edit(event: any, element: any) {
        this.commonFunc(element, false);
    }

    view(event: any, element: any) {
        this.commonFunc(element, true);
    }
    create() {
        const termDialog = this.dialog.open(ThemSuaDanhMucKeLot, {
            width: '450px',
            data: {
                title: 'Thêm mới kê lót',
                isView: false,
                id: 0,
                maKieuKelot: null,
                tenKieuKelot: '',
                ghiChu: '',
                trangThai: null,
            },
        });

        termDialog.afterClosed().subscribe(res => {
            if (res) {
                this.optionSearch = {
                    maKieuKelot: null,
                    tenKieuKelot: '',
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
            filterKeys: ['maKieuKelot','tenKieuKelot', 'ghiChu', 'trangThai'],
            hideFilter: false,
            columns: [
                {
                    text: 'Mã kiểu kê lót',
                    label: 'Mã kiểu kê lót',
                    fieldName: 'maKieuKelot',
                    style: { flex: 1 },
                    sortable: false,
                },
                {
                    text: 'Tên kiểu kê lót',
                    label: 'Tên kiểu kê lót',
                    fieldName: 'tenKieuKelot',
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
            mergeActionColumns: true,
            actions: [
                {
                    text: 'Xem',
                    label: 'xem',
                    fieldName: 'xem',
                    actionFunction: this.view.bind(this),
                    templateFunction: () => {
                        return `<a class="rounded-circle rounded-sm xem-chi-tiet">
                                    <i class="fas fa-eye"></i>
                                </a>`;
                    },
                },
                {
                    text: 'Sửa',
                    label: 'Sửa',
                    fieldName: 'sua',
                    actionFunction: this.edit.bind(this),
                    templateFunction: () => {
                        return `<a class="rounded-circle rounded-sm chinhsua">
                                    <i class="fas fa-edit"></i>
                                </a>`;
                    },
                },

                {
                    text: 'Xóa',
                    label: 'xoa',
                    fieldName: 'xoa',
                    actionFunction: this.delete.bind(this),
                    templateFunction: () => {
                        return `<a class="rounded-circle rounded-sm xoa">
                                    <i class="fas fa-trash-alt"></i>
                                </a>`;
                    },
                },
            ],
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
