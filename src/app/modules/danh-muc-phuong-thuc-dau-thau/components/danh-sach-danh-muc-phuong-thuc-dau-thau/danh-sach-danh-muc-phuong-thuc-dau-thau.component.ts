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
import { PhuongThucDauThauDataModel } from '../..';
import { DEFAULT_OPTION_SEARCH } from '../../constants';
import { DanhMucPhuongThucDauThauService } from '../../services/danh-muc-phuong-thuc-dau-thau.service';
import { ThemSuaDanhMucPhuongThucDauThau } from '../them-sua-danh-muc-phuong-thuc-dau-thau/them-sua-danh-muc-phuong-thuc-dau-thau.component';

@Component({
    selector: 'danh-sach-danh-muc-phuong-thuc-dau-thau',
    templateUrl: './danh-sach-danh-muc-phuong-thuc-dau-thau.component.html',
    styleUrls: ['./danh-sach-danh-muc-phuong-thuc-dau-thau.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DanhSachDanhMucPhuongThucDauThau implements OnInit, OnDestroy, OnChanges, AfterViewInit {
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

    optionSearch: PhuongThucDauThauDataModel = DEFAULT_OPTION_SEARCH;

    smallScreen$ = this.breakpointObserver
        .observe(['(max-width: 600px)'])
        .pipe(pluck<BreakpointState, boolean>('matches'), takeUntil(this.unsubscribe$), shareReplay(1));
    config: DataTableConfig<any>;

    constructor(
        private breakpointObserver: BreakpointObserver,
        private authService: AuthService,
        private dialog: MatDialog,
        private service: DanhMucPhuongThucDauThauService,
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
                    title: `Xóa danh mục phương thức đấu thầu`,
                    subTitle: `Bạn có chắc chắn muốn xóa danh mục phương thức đấu thầu?`,
                    message: `Khi xóa dữ liệu, các dữ liệu liên quan đến phương thức đấu thầu "${element.tenPthuc}" sẽ bị xóa đi.`,
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
                            this.optionSearch = DEFAULT_OPTION_SEARCH;
                            this.dialog.open(ConfirmationDialog, {
                                width: '546px',
                                data: {
                                    title: `Xóa dữ liệu thành công!`,
                                    message: `Danh mục phương thức đấu thầu đã được xóa thành công.`,
                                    closeButtonText: 'Đóng',
                                },
                            });
                        }
                    }
                });
        }
    }

    commonFunc(element: any, isView: boolean) {
        const termDialog = this.dialog.open(ThemSuaDanhMucPhuongThucDauThau, {
            width: '450px',
            data: {
                title: isView ? 'Thông tin phương thức đấu thầu' : 'Cập nhật phương thức đấu thầu',
                isView: isView,
                id: element.id,
                maPthuc: element.maPthuc,
                tenPthuc: element.tenPthuc,
                ghiChu: element.ghiChu,
                trangThai: element.trangThai,
            },
        });

        termDialog.afterClosed().subscribe(res => {
            if(!res) return;
            this.optionSearch = DEFAULT_OPTION_SEARCH;
        });
    }
    edit(event: any, element: any) {
        this.commonFunc(element, false);
    }

    view(event: any, element: any) {
        this.commonFunc(element, true);
    }
    create() {
        const termDialog = this.dialog.open(ThemSuaDanhMucPhuongThucDauThau, {
            width: '450px',
            data: {
                title: 'Thêm mới phương thức đấu thầu',
                isView: false,
                id: 0,
                maPthuc: null,
                tenPthuc: '',
                ghiChu: '',
                trangThai: null,
            },
        });

        termDialog.afterClosed().subscribe(res => {
            if(!res) return;
            this.optionSearch = DEFAULT_OPTION_SEARCH;
        });
    }

    initDatatable(data: any, count: number, startAtPage?: { pageIndex: number }) {
        if (!data) {
            return;
        }
        this.config = {
            data,
            tableName: 'pra-users',
            filterKeys: ['maPthuc','tenPthuc', 'ghiChu', 'trangThai'],
            hideFilter: false,
            columns: [
                {
                    text: 'Mã phương thức đấu thầu',
                    label: 'Mã phương thức đấu thầu',
                    fieldName: 'maPthuc',
                    style: { flex: 2 },
                    sortable: false,
                },
                {
                    text: 'Tên phương thức đấu thầu',
                    label: 'Tên phương thức đấu thầu',
                    fieldName: 'tenPthuc',
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
