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
import { filter, map, pluck, shareReplay, takeUntil } from 'rxjs/operators';
import { AuthService } from 'src/app/modules/auth';
import { HttpPaginatedDataSource } from 'src/app/modules/core';
import { ConfirmationDialog, ConfirmCancelDialog, DataTableConfig } from 'src/app/modules/shared';
import { PaginateOptions } from 'src/app/modules/types';
import { DanhMucDonViTinhService } from '../../services/danh-muc-don-vi-tinh.service';
import { ThemSuaDanhMucDonViTinh } from '../them-sua-danh-muc-don-vi-tinh/them-sua-danh-muc-don-vi-tinh.component'

@Component({
    selector: 'danh-sach-danh-muc-don-vi-tinh',
    templateUrl: './danh-sach-danh-muc-don-vi-tinh.component.html',
    styleUrls: ['./danh-sach-danh-muc-don-vi-tinh.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DanhSachDanhMucDonViTinh implements OnInit, OnDestroy, OnChanges, AfterViewInit {
    @Input()
    userCollection: any;

    @Input()
    pageSize = 10;

    @Input()
    errorMessages: string[];

    @Output()
    paginate = new EventEmitter<PaginateOptions>();

    roleUser$: Observable<string>;
    roleUser: any;
    nextClicked$ = new Subject();
    unsubscribe$ = new Subject();
    panelOpenState = true;
    elementSeleted: any;

    listTrangThai = [
        {
            value: "00",
            text: "Ẩn"
        }, {
            value: "01",
            text: "Hiện"
        },
    ]

    listDonViDo = []

    optionSearch = {
        dviDo: null,
        kyHieu: "",
        maDviTinh: "",
        tenDviTinh: "",
        trangThai: null,
    }

    smallScreen$ = this.breakpointObserver
        .observe(['(max-width: 600px)'])
        .pipe(pluck<BreakpointState, boolean>('matches'), takeUntil(this.unsubscribe$), shareReplay(1));
    config: DataTableConfig<any>;

    constructor(
        private breakpointObserver: BreakpointObserver,
        private authService: AuthService,
        private dialog: MatDialog,
        private service: DanhMucDonViTinhService,
        private spinner: NgxSpinnerService,
        private router: Router,
    ) { }

    ngOnInit() {
        this.roleUser$ = this.authService.user$.pipe(
            filter(user => !!user),
            map(user => (user && user.roles ? user.roles : [])),
        );
        this.roleUser$.subscribe((roles: string) => {
            this.roleUser = roles;
            if(this.roleUser.indexOf('DM_DVT') != -1){
                this.router.navigate(["/trang-chu"])
            }
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
        this.service.paginteAdmins({ pageIndex: 0, pageSize: this.pageSize, }, this.optionSearch)
            .subscribe(data => {
                this.spinner.hide();
                console.log(data);
            }
            );

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
                    title: `Xóa danh mục đơn vị tính`,
                    subTitle: `Bạn có chắc chắn muốn xóa danh mục đơn vị tính?`,
                    message: `Khi xóa dữ liệu, các dữ liệu liên quan đến đơn vị tính "${this.elementSeleted.tenDviTinh}" sẽ bị xóa đi.`,
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
                                dviDo: null,
                                kyHieu: "",
                                maDviTinh: "",
                                tenDviTinh: "",
                                trangThai: null,
                            }
                            this.dialog.open(ConfirmationDialog, {
                                width: '546px',
                                data: {
                                    title: `Xóa dữ liệu thành công!`,
                                    message: `Danh mục đơn vị tính đã được xóa thành công.`,
                                    closeButtonText: 'Đóng',
                                },
                            });
                        }
                    }
                });
        }
    }

    edit(isView: boolean) {
        const termDialog = this.dialog.open(ThemSuaDanhMucDonViTinh, {
            width: '30vw',
            height: '55vh',
            data: {
                title: 'Cập nhật đơn vị tính',
                isView: isView,
                maDviTinh: this.elementSeleted.maDviTinh,
                tenDviTinh: this.elementSeleted.tenDviTinh,
                kyHieu: this.elementSeleted.kyHieu,
                id: this.elementSeleted.id,
                dviDo: this.elementSeleted.dviDo,
                trangThai: this.elementSeleted.trangThai,
            },
        });

        termDialog.afterClosed().subscribe(res => {
            if (res) {
                this.optionSearch = {
                    dviDo: null,
                    kyHieu: "",
                    maDviTinh: "",
                    tenDviTinh: "",
                    trangThai: null,
                }
            }
        });
    }

    create() {
        const termDialog = this.dialog.open(ThemSuaDanhMucDonViTinh, {
            width: '30vw',
            height: '55vh',
            data: {
                title: 'Thêm mới đơn vị tính',
                isView: false,
                maDviTinh: "",
                tenDviTinh: "",
                kyHieu: "",
                id: 0,
                dviDo: null,
                trangThai: null,
            },
        });

        termDialog.afterClosed().subscribe(res => {
            if (res) {
                this.optionSearch = {
                    dviDo: null,
                    kyHieu: "",
                    maDviTinh: "",
                    tenDviTinh: "",
                    trangThai: null,
                }
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
            filterKeys: ['tenDviTinh', 'maDviTinh', 'kyHieu', 'capDvi', 'dviDo', 'trangThai'],
            hideFilter: false,
            columns: [
                {
                    text: 'Tên đơn vị tính',
                    label: 'Tên đơn vị tính',
                    fieldName: 'tenDviTinh',
                    style: { flex: 2 },
                    sortable: false,
                },
                {
                    text: 'Mã đơn vị tính',
                    label: 'Mã đơn vị tính',
                    fieldName: 'maDviTinh',
                    style: { flex: 1 },
                    sortable: false,
                },
                {
                    text: 'Ký hiệu',
                    label: 'Ký hiệu',
                    fieldName: 'kyHieu',
                    style: { flex: 1 },
                    sortable: false,
                },
                {
                    text: 'Đơn vị đo',
                    label: 'Đơn vị đo',
                    fieldName: 'dviDo',
                    style: { flex: 1 },
                    sortable: false,
                },
                {
                    text: 'Trạng thái',
                    label: 'Trạng thái',
                    fieldName: 'trangThai',
                    valueFunction: element => this.textStatus(element.trangThai),
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
}
