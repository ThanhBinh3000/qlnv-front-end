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
import { ThemSuaDanhMucHangDTQG } from '../them-sua-danh-muc-hang-dtqg/them-sua-danh-muc-hang-dtqg.component';

@Component({
    selector: 'danh-sach-danh-muc-hang-dtqg',
    templateUrl: './danh-sach-danh-muc-hang-dtqg.component.html',
    styleUrls: ['./danh-sach-danh-muc-hang-dtqg.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DanhSachDanhMucHangDTQG implements OnInit, OnDestroy, OnChanges, AfterViewInit {
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

    displayedColumns: string[] = ['firstname', 'lastname', 'email', 'lastLoginTime', 'status', 'brand', 'delete'];
    detailsColumns: string[] = ['rowDetails'];
    userDataSource: HttpPaginatedDataSource<any>;
    currentUserId$: Observable<string>;
    currentUserId: string;
    nextClicked$ = new Subject();
    unsubscribe$ = new Subject();
    panelOpenState = true;

    smallScreen$ = this.breakpointObserver
        .observe(['(max-width: 600px)'])
        .pipe(pluck<BreakpointState, boolean>('matches'), takeUntil(this.unsubscribe$), shareReplay(1));
    config: DataTableConfig<any>;
    selectedCar: number;

    cars = [
        { id: 1, name: 'Volvo' },
        { id: 2, name: 'Saab' },
        { id: 3, name: 'Opel' },
        { id: 4, name: 'Audi' },
        { id: 5, name: 'Audi' },
        { id: 6, name: 'Audi' },
    ];
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
        const { users = [], userCount = 0 } = this.userCollection || {};
        this.initDatatable(users, userCount, this.userCollection.startAtPage);
    }

    ngOnChanges(changes: SimpleChanges) {
        const { userCollection = null } = changes || {};
        const { currentValue = null } = userCollection || {};
        const { users = null, userCount = 0 } = currentValue || {};
        this.initDatatable(users, userCount, this.userCollection.startAtPage);
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    deleteUser($event: Event, element: any) {
        $event.preventDefault();
        $event.stopPropagation();
        this.inactivateAdmin.emit({
            username: element.username,
            email: element.email,
            userId: element.id,
        });
        this.currentUserId$ = this.authService.user$.pipe(
            filter(user => !!user),
            pluck('id'),
        );
        this.currentUserId$.subscribe((userId: string) => {
            this.currentUserId = userId;
        });
    }

    editUser($event: Event, element: any) {
        $event.preventDefault();
        $event.stopPropagation();
        this.editUserEvent.emit({
            userId: element.id,
            username: element.username,
            email: element.email,
            firstname: element.firstname,
            lastname: element.lastname,
            genderId: element.genderId,
            countryId: element.countryId,
            educationId: element.educationId,
            address: element.address,
            dob: element.dob,
            phoneNumber: element.phoneNumber,
        });
    }

    activeOrInactiveUser($event: Event, element: any) {
        $event.preventDefault();
        $event.stopPropagation();
        this.inactivateUser.emit({
            status: element.status,
            email: element.email,
            userId: element.id,
        });
    }

    createUser(){
        const termDialog = this.dialog.open(ThemSuaDanhMucHangDTQG, {
            width: '47.5rem',
            height: '45rem',
            data: {
                title: 'Add New User',
            },
        });

        termDialog.afterClosed().subscribe(res => {
            console.log(res);
        });
    }

    initDatatable(data: any[], count: number, startAtPage?: { pageIndex: number }) {
        data = [{
            address: "",
            countryId: "e308faa7-79d2-4a5e-bf85-ae7d9ccb5e0a",
            countryName: "Singapore",
            dob: null,
            educationId: "6810f825-deb1-4aa8-88d6-0d2ae35ad5e9",
            educationName: "university",
            email: "tuwz@fls4.gleeze.com",
            firstname: "AgnesKoh",
            genderId: "58fc5398-c097-4527-b5db-93698cddfb2a",
            genderName: "female",
            id: "dfeb640f-7e20-4bac-b766-396aed9e9028",
            lastLoginTime: "2021-12-30T03:02:05.386Z",
            lastname: "MinQi",
            phoneNumber: "1800-200-6868",
            role: "user",
            status: "1",
            username: "AgnesKohMinQi"
        },{
            address: "",
            countryId: "e308faa7-79d2-4a5e-bf85-ae7d9ccb5e0a",
            countryName: "Singapore",
            dob: null,
            educationId: "6810f825-deb1-4aa8-88d6-0d2ae35ad5e9",
            educationName: "university",
            email: "tuwz@fls4.gleeze.com",
            firstname: "AgnesKoh",
            genderId: "58fc5398-c097-4527-b5db-93698cddfb2a",
            genderName: "female",
            id: "dfeb640f-7e20-4bac-b766-396aed9e9028",
            lastLoginTime: "2021-12-30T03:02:05.386Z",
            lastname: "MinQi",
            phoneNumber: "1800-200-6868",
            role: "user",
            status: "1",
            username: "AgnesKohMinQi"
        },{
            address: "",
            countryId: "e308faa7-79d2-4a5e-bf85-ae7d9ccb5e0a",
            countryName: "Singapore",
            dob: null,
            educationId: "6810f825-deb1-4aa8-88d6-0d2ae35ad5e9",
            educationName: "university",
            email: "tuwz@fls4.gleeze.com",
            firstname: "AgnesKoh",
            genderId: "58fc5398-c097-4527-b5db-93698cddfb2a",
            genderName: "female",
            id: "dfeb640f-7e20-4bac-b766-396aed9e9028",
            lastLoginTime: "2021-12-30T03:02:05.386Z",
            lastname: "MinQi",
            phoneNumber: "1800-200-6868",
            role: "user",
            status: "1",
            username: "AgnesKohMinQi"
        },{
            address: "",
            countryId: "e308faa7-79d2-4a5e-bf85-ae7d9ccb5e0a",
            countryName: "Singapore",
            dob: null,
            educationId: "6810f825-deb1-4aa8-88d6-0d2ae35ad5e9",
            educationName: "university",
            email: "tuwz@fls4.gleeze.com",
            firstname: "AgnesKoh",
            genderId: "58fc5398-c097-4527-b5db-93698cddfb2a",
            genderName: "female",
            id: "dfeb640f-7e20-4bac-b766-396aed9e9028",
            lastLoginTime: "2021-12-30T03:02:05.386Z",
            lastname: "MinQi",
            phoneNumber: "1800-200-6868",
            role: "user",
            status: "1",
            username: "AgnesKohMinQi"
        },{
            address: "",
            countryId: "e308faa7-79d2-4a5e-bf85-ae7d9ccb5e0a",
            countryName: "Singapore",
            dob: null,
            educationId: "6810f825-deb1-4aa8-88d6-0d2ae35ad5e9",
            educationName: "university",
            email: "tuwz@fls4.gleeze.com",
            firstname: "AgnesKoh",
            genderId: "58fc5398-c097-4527-b5db-93698cddfb2a",
            genderName: "female",
            id: "dfeb640f-7e20-4bac-b766-396aed9e9028",
            lastLoginTime: "2021-12-30T03:02:05.386Z",
            lastname: "MinQi",
            phoneNumber: "1800-200-6868",
            role: "user",
            status: "1",
            username: "AgnesKohMinQi"
        },{
            address: "",
            countryId: "e308faa7-79d2-4a5e-bf85-ae7d9ccb5e0a",
            countryName: "Singapore",
            dob: null,
            educationId: "6810f825-deb1-4aa8-88d6-0d2ae35ad5e9",
            educationName: "university",
            email: "tuwz@fls4.gleeze.com",
            firstname: "AgnesKoh",
            genderId: "58fc5398-c097-4527-b5db-93698cddfb2a",
            genderName: "female",
            id: "dfeb640f-7e20-4bac-b766-396aed9e9028",
            lastLoginTime: "2021-12-30T03:02:05.386Z",
            lastname: "MinQi",
            phoneNumber: "1800-200-6868",
            role: "user",
            status: "1",
            username: "AgnesKohMinQi"
        },{
            address: "",
            countryId: "e308faa7-79d2-4a5e-bf85-ae7d9ccb5e0a",
            countryName: "Singapore",
            dob: null,
            educationId: "6810f825-deb1-4aa8-88d6-0d2ae35ad5e9",
            educationName: "university",
            email: "tuwz@fls4.gleeze.com",
            firstname: "AgnesKoh",
            genderId: "58fc5398-c097-4527-b5db-93698cddfb2a",
            genderName: "female",
            id: "dfeb640f-7e20-4bac-b766-396aed9e9028",
            lastLoginTime: "2021-12-30T03:02:05.386Z",
            lastname: "MinQi",
            phoneNumber: "1800-200-6868",
            role: "user",
            status: "1",
            username: "AgnesKohMinQi"
        },{
            address: "",
            countryId: "e308faa7-79d2-4a5e-bf85-ae7d9ccb5e0a",
            countryName: "Singapore",
            dob: null,
            educationId: "6810f825-deb1-4aa8-88d6-0d2ae35ad5e9",
            educationName: "university",
            email: "tuwz@fls4.gleeze.com",
            firstname: "AgnesKoh",
            genderId: "58fc5398-c097-4527-b5db-93698cddfb2a",
            genderName: "female",
            id: "dfeb640f-7e20-4bac-b766-396aed9e9028",
            lastLoginTime: "2021-12-30T03:02:05.386Z",
            lastname: "MinQi",
            phoneNumber: "1800-200-6868",
            role: "user",
            status: "1",
            username: "AgnesKohMinQi"
        },{
            address: "",
            countryId: "e308faa7-79d2-4a5e-bf85-ae7d9ccb5e0a",
            countryName: "Singapore",
            dob: null,
            educationId: "6810f825-deb1-4aa8-88d6-0d2ae35ad5e9",
            educationName: "university",
            email: "tuwz@fls4.gleeze.com",
            firstname: "AgnesKoh",
            genderId: "58fc5398-c097-4527-b5db-93698cddfb2a",
            genderName: "female",
            id: "dfeb640f-7e20-4bac-b766-396aed9e9028",
            lastLoginTime: "2021-12-30T03:02:05.386Z",
            lastname: "MinQi",
            phoneNumber: "1800-200-6868",
            role: "user",
            status: "1",
            username: "AgnesKohMinQi"
        },{
            address: "",
            countryId: "e308faa7-79d2-4a5e-bf85-ae7d9ccb5e0a",
            countryName: "Singapore",
            dob: null,
            educationId: "6810f825-deb1-4aa8-88d6-0d2ae35ad5e9",
            educationName: "university",
            email: "tuwz@fls4.gleeze.com",
            firstname: "AgnesKoh",
            genderId: "58fc5398-c097-4527-b5db-93698cddfb2a",
            genderName: "female",
            id: "dfeb640f-7e20-4bac-b766-396aed9e9028",
            lastLoginTime: "2021-12-30T03:02:05.386Z",
            lastname: "MinQi",
            phoneNumber: "1800-200-6868",
            role: "user",
            status: "1",
            username: "AgnesKohMinQi"
        }];
        count = 10
        if (!data) {
            return;
        }

        this.config = {
            data,
            tableName: 'pra-users',
            filterKeys: ['username', 'firstname', 'lastname', 'email', 'role', 'lastLoginTime', 'status'],
            hideFilter: false,
            columns: [
                {
                    text: 'User name',
                    label: 'EMPLOYEE NAME',
                    fieldName: 'username',
                    style: { flex: 2 },
                    sortable: false,
                },
                {
                    text: 'First name',
                    label: 'EMPLOYEE NAME',
                    fieldName: 'firstname',
                    style: { flex: 1 },
                    sortable: false,
                },
                {
                    text: 'Last name',
                    label: 'EMPLOYEE NAME',
                    fieldName: 'lastname',
                    style: { flex: 1 },
                    sortable: false,
                },
                {
                    text: 'Email',
                    label: 'email',
                    fieldName: 'email',
                    style: { flex: 2 },
                    sortable: false,
                },
                {
                    text: 'Status',
                    label: 'user status',
                    fieldName: 'status',
                    valueFunction: element => this.activeOrDeactiveAction(element.status),
                    templateFunction: element => {
                        if(element.status == '1'){
                            return `<div class="active-status">Active</div>`;
                        }
                        else {
                            return `<div class="deactive-status">Deactive</div>`;
                        }
                    },
                    style: { flex: 1 },
                    sortable: false,
                },
                {
                    text: 'Last Activity',
                    label: 'Last Activity',
                    fieldName: 'lastLoginTime',
                    valueFunction: element => {
                        return element.lastLoginTime ? format(new Date(element.lastLoginTime), 'dd/MM/yyyy hh:mm a') : '-';
                    },
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

    activeOrDeactiveAction(status: string): string {
        switch (status) {
            case '0':
                return 'Active';
            case '1':
                return 'Deactive';
            default:
                return 'Deactive';
        }
    }
}
