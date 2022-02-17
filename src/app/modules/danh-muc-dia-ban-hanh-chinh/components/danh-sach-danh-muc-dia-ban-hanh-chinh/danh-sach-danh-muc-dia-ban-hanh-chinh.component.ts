import { Router } from '@angular/router';
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
import { DanhMucDiaBanHanhChinhService } from '../../services/danh-muc-dia-ban-hanh-chinh.service';
import { ThemSuaDanhMucDiaBanHanhChinh } from '../them-sua-danh-muc-dia-ban-hanh-chinh/them-sua-danh-muc-dia-ban-hanh-chinh.component';

@Component({
    selector: 'danh-sach-danh-muc-dia-ban-hanh-chinh',
    templateUrl: './danh-sach-danh-muc-dia-ban-hanh-chinh.component.html',
    styleUrls: ['./danh-sach-danh-muc-dia-ban-hanh-chinh.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DanhSachDanhMucDiaBanHanhChinh implements OnInit, OnDestroy, OnChanges, AfterViewInit {
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
            value: '1',
            text: 'Hiện',
        },
    ];

    optionSearch = {
        maDbhc: '',
        tenDbhc: '',
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
        private service: DanhMucDiaBanHanhChinhService,
        private spinner: NgxSpinnerService,
        private router: Router
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

    delete(event: any, element: any) {
        if (element && element.id > 0) {
            let dialogRef = this.dialog.open(ConfirmCancelDialog, {
                width: '546px',
                data: {
                    title: `Xóa danh mục địa bàn hành chính`,
                    subTitle: `Bạn có chắc chắn muốn xóa danh mục địa bàn hành chính?`,
                    message: `Khi xóa dữ liệu, các dữ liệu liên quan đến địa bàn hành chính "${element.tenDbhc}" sẽ bị xóa đi.`,
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
                                maDbhc: '',
                                tenDbhc: '',
                                trangThai: null,
                            };
                            this.dialog.open(ConfirmationDialog, {
                                width: '546px',
                                data: {
                                    title: `Xóa dữ liệu thành công!`,
                                    message: `Danh mục địa bàn hành chính đã được xóa thành công.`,
                                    closeButtonText: 'Đóng',
                                },
                            });
                        }
                    }
                });
        }
    }

    edit(event: any, element: any) {
        this.commonFunc(element, false);
    }

    view(event: any, element: any) {
        this.commonFunc(element, true);
    }

    commonFunc(element: any, isView: boolean) {
        const termDialog = this.dialog.open(ThemSuaDanhMucDiaBanHanhChinh, {
            width: '450px',
            data: {
                title: isView ? 'Thông tin địa bàn hành chính' : 'Cập nhật địa bàn hành chính',
                isView: isView,
                id: element.id,
                cap: element.cap,
                maCha: element.maCha,
                maDbhc: element.maDbhc,
                maHchinh: element.maHchinh,
                tenDbhc: element.tenDbhc,
                trangThai: element.trangThai,
            },
        });

        termDialog.afterClosed().subscribe(res => {
            if (res) {
                this.optionSearch = {
                    maDbhc: '',
                    tenDbhc: '',
                    trangThai: null,
                };
            }
        });
    }
    create() {
        const termDialog = this.dialog.open(ThemSuaDanhMucDiaBanHanhChinh, {
            width: '450px',
            data: {
                title: 'Thêm mới địa bàn hành chính',
                isView: false,
                id: 0,
                cap: null,
                maCha: '',
                maDbhc: '',
                maHchinh: '',
                tenDbhc: null,
                trangThai: null,
            },
        });

        termDialog.afterClosed().subscribe(res => {
            if (res) {
                this.optionSearch = {
                    maDbhc: '',
                    tenDbhc: '',
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
            filterKeys: ['maDbhc', 'tenDbhc', 'maHchinh', 'trangThai', 'cap'],
            hideFilter: false,
            columns: [
                {
                    text: 'Mã tỉnh thành',
                    label: 'Mã tỉnh thành',
                    fieldName: 'maDbhc',
                    style: { flex: 1 },
                    sortable: false,
                },
                {
                    text: 'Tên tỉnh thành',
                    label: 'Tên tỉnh thành',
                    fieldName: 'tenDbhc',
                    style: { flex: 2 },
                    sortable: false,
                },
                {
                    text: 'Mã hành chính',
                    label: 'Mã hành chính',
                    fieldName: 'maHchinh',
                    style: { flex: 1 },
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
                {
                    text: 'Quận huyện',
                    label: 'Quận huyện',
                    fieldName: 'cap',
                    actionFunction2: this.getQuanHuyen.bind(this),
                    templateFunction2: () => {
                        return `<a class="view-chi-tiet">
                                    Chi tiết
                                </a>`;
                    },
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
            case '1':
                return 'Hiện';
            default:
                return '';
        }
    }
    getQuanHuyen(event: any, element: any) {
        this.router.navigate(["dmuc-dia-ban-hanh-chinh/dmuc-quan-huyen",element.maDbhc]);
        this.service.getHuyen().subscribe(huyens => {
            console.log(huyens);
            
        })
    }
}
