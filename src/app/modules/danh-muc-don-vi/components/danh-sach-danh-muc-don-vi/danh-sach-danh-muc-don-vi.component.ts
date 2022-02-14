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
import { ThemSuaDanhMucDonVi } from '../them-sua-danh-muc-don-vi/them-sua-danh-muc-don-vi.component';

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

    listCapDonVi = [
        {
            value: '1',
            text: 'Tổng cục',
        },
        {
            value: '2',
            text: 'Cục',
        },
        {
            value: '3',
            text: 'Chi cục',
        },
    ];

    listLoaiDonVi = [
        {
            value: 'TCDT',
            text: 'Tổng cục Dự trữ',
        },
        {
            value: 'BCA',
            text: 'Bộ công an',
        },
        {
            value: 'BQP',
            text: 'Bộ quốc phòng',
        },
        {
            value: 'BNN',
            text: 'Bộ nông nghiệp',
        },
        {
            value: 'BCT',
            text: 'Bộ công thương',
        },
        {
            value: 'DPT',
            text: 'Đài phát thanh VN',
        },
        {
            value: 'BGT',
            text: 'Bộ giao thông',
        },
        {
            value: 'BYT',
            text: 'Bộ y tế',
        },
        {
            value: 'DTH',
            text: 'Đài truyền hình VN',
        },
    ];

    optionSearch = {
        capDvi: null,
        kieuDvi: '',
        loaiDvi: null,
        maDvi: '',
        maPhuong: '',
        maQuan: '',
        maTinh: '',
        tenDvi: '',
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
        private service: DanhMucDonViService,
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
        // $event.preventDefault();
        // $event.stopPropagation();
        if (element && element.id > 0) {
            let dialogRef = this.dialog.open(ConfirmCancelDialog, {
                width: '546px',
                data: {
                    title: `Xóa danh mục đơn vị`,
                    subTitle: `Bạn có chắc chắn muốn xóa danh mục đơn vị?`,
                    message: `Khi xóa dữ liệu, các dữ liệu liên quan đến đơn vị "${element.tenDvi}" sẽ bị xóa đi.`,
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
                                capDvi: null,
                                kieuDvi: '',
                                loaiDvi: null,
                                maDvi: '',
                                maPhuong: '',
                                maQuan: '',
                                maTinh: '',
                                tenDvi: '',
                                trangThai: null,
                            };
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
    }

    edit(event: any, element: any) {
        this.commonFunc(element, false);
    }

    view(event: any, element: any) {
        this.commonFunc(element, true);
    }

    commonFunc(element: any, isView: boolean) {
        const termDialog = this.dialog.open(ThemSuaDanhMucDonVi, {
            width: '600px',
            // height: '70vh',
            data: {
                title: isView ? 'Thông tin đơn vị' : 'Cập nhật đơn vị',
                isView: isView,
                id: element.id,
                capDvi: element.capDvi,
                diaChi: element.diaChi,
                ghiChu: element.ghiChu,
                kieuDvi: element.kieuDvi,
                loaiDvi: element.loaiDvi,
                maDvi: element.maDvi,
                maDviCha: element.maDviCha,
                maHchinh: element.maHchinh,
                maPhuong: element.maPhuong,
                maQuan: element.maQuan,
                maTinh: element.maTinh,
                tenDvi: element.tenDvi,
                trangThai: element.trangThai,
            },
        });

        termDialog.afterClosed().subscribe(res => {
            if (res) {
                this.optionSearch = {
                    capDvi: null,
                    kieuDvi: '',
                    loaiDvi: null,
                    maDvi: '',
                    maPhuong: '',
                    maQuan: '',
                    maTinh: '',
                    tenDvi: '',
                    trangThai: null,
                };
            }
        });
    }
    create() {
        const termDialog = this.dialog.open(ThemSuaDanhMucDonVi, {
            width: '600px',
            // height: '70vh',
            data: {
                title: 'Thêm mới đơn vị',
                isView: false,
                id: 0,
                capDvi: null,
                diaChi: '', 
                ghiChu: '',
                kieuDvi: '',
                loaiDvi: null,
                maDvi: '',
                maDviCha: null,
                maHchinh: '',
                maPhuong: '',
                maQuan: '',
                maTinh: '',
                tenDvi: '',
                trangThai: null,
            },
        });

        termDialog.afterClosed().subscribe(res => {
            if (res) {
                this.optionSearch = {
                    capDvi: null,
                    kieuDvi: '',
                    loaiDvi: null,
                    maDvi: '',
                    maPhuong: '',
                    maQuan: '',
                    maTinh: '',
                    tenDvi: '',
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
            case '1':
                return 'Hiện';
            default:
                return '';
        }
    }
}
