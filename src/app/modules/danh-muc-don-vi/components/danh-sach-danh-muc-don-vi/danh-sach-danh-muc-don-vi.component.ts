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
import { Observable, Subject } from 'rxjs';
import { filter, pluck, shareReplay, takeUntil } from 'rxjs/operators';
import { AuthService } from 'src/app/modules/auth';
import { HttpPaginatedDataSource } from 'src/app/modules/core';
import { DataTableConfig } from 'src/app/modules/shared';
import { PaginateOptions } from 'src/app/modules/types';
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

    @Output()
    filterUser = new EventEmitter<string>();

    @Output()
    sortChange = new EventEmitter<Sort>();

    @Output()
    inactivateAdmin = new EventEmitter<{
        userId: string;
        username: string;
        email: string;
    }>();

    @Output()
    inactivateUser = new EventEmitter<{
        status: string;
        email: string;
        userId: string;
    }>();

    @Output()
    editUserEvent = new EventEmitter<{
        userId: string;
        username: string;
        email: string;
        firstname: string;
        lastname: string;
        genderId: string;
        countryId: string;
        educationId: string;
        address: string;
        dob: string;
        phoneNumber: string;
    }>();

    @Output()
    createUserEvent = new EventEmitter<{}>();

    currentUserId$: Observable<string>;
    currentUserId: string;
    nextClicked$ = new Subject();
    unsubscribe$ = new Subject();
    panelOpenState = true;

    smallScreen$ = this.breakpointObserver
        .observe(['(max-width: 600px)'])
        .pipe(pluck<BreakpointState, boolean>('matches'), takeUntil(this.unsubscribe$), shareReplay(1));
    config: DataTableConfig<any>;

    constructor(
        private breakpointObserver: BreakpointObserver,
        private authService: AuthService,
        private dialog: MatDialog,
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

    delete(element) {
        const termDialog = this.dialog.open(ThemSuaDanhMucDonVi, {
            width: '30vw',
            height: '80vh',
            data: {
                title: 'Xóa đơn vị',
            },
        });

        termDialog.afterClosed().subscribe(res => {
            console.log(res);
        });
    }

    edit(element) {
        const termDialog = this.dialog.open(ThemSuaDanhMucDonVi, {
            width: '30vw',
            height: '80vh',
            data: {
                title: 'Cập nhật đơn vị',
            },
        });

        termDialog.afterClosed().subscribe(res => {
            console.log(res);
        });
    }

    create(){
        const termDialog = this.dialog.open(ThemSuaDanhMucDonVi, {
            width: '30vw',
            height: '80vh',
            data: {
                title: 'Thêm mới đơn vị',
            },
        });

        termDialog.afterClosed().subscribe(res => {
            console.log(res);
        });
    }

    initDatatable(data: any, count: number, startAtPage?: { pageIndex: number }) {
        console.log(data)
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

    filterChangeValue(filterValue: string) {
        this.paginate.emit({ pageIndex: 0, pageSize: this.pageSize });
        this.filterUser.emit(filterValue.trim());
    }

    sortChangeValue(sort: Sort) {
        this.paginate.emit({ pageIndex: 0, pageSize: this.pageSize });
        this.sortChange.emit(sort);
    }

    selectedPageAtValue(index: number) {
        this.paginate.emit({ pageIndex: index, pageSize: this.pageSize });
    }

    selectPageSizeValue(index: number) {
        this.pageSize = index;
        this.paginate.emit({ pageIndex: 0, pageSize: index });
    }
}
