import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { NgxSpinnerService } from 'ngx-spinner';
import { BehaviorSubject, combineLatest, of, Subject } from 'rxjs';
import { debounceTime, delay, exhaustMap, switchMap, takeUntil } from 'rxjs/operators';
import { ConfirmationDialog, ConfirmCancelDialog } from '../../shared';
import { PaginateOptions } from '../../types';
import { ListUsersFormComponent, NewUserDialogComponent } from '../components';
import { EmployeeService } from '../services';

@Component({
    selector: 'employer-dashboard',
    template: `
        <div class="grid-container1 main-content">
            <list-users-form
                class="list-users-form"
                [pageSize]="pageSize"
                [userCollection]="userCollection$ | async"
                (paginate)="paginateUsers$.next($event)"
                (inactivateAdmin)="openDialog($event)"
                (inactivateUser)="activeOrDeActive($event)"
                (filterUser)="filter$.next($event)"
                (sortChange)="sorter$.next($event)"
                (editUserEvent)="openEditUser($event)"
            >
            </list-users-form>
        </div>
    `,
    styles: [
        `
            :host {
                display: block;
                height: 100%;
            }

            .create-new-user {
                margin-left: 48px;
                margin-top: 20px;
                padding: 8px;
                background: #fff;
                border: 1px solid #d8dde6;
                border-radius: 4px;
                padding-left: 36px;
                position: relative;
            }

            .grid-container {
                align-items: stretch;

                display: grid;

                grid-template-rows: 10px minmax(min-content, auto) minmax(min-content, auto) 10px;
                grid-template-columns: minmax(30px, 1fr) minmax(280px, 8fr) minmax(30px, 1fr);
            }

            .grid-container .list-users-form {
                grid-row: 3;
                grid-column: 2;
            }

            .grid-container .new-user-form {
                grid-row: 2;
                grid-column: 2;
                margin-bottom: 2rem;
            }

            @media only screen and (max-width: 600px) {
                .grid-container {
                    grid-template-columns: 1fr;
                }

                .grid-container .list-users-form {
                    grid-column: 1;
                }

                .grid-container .new-user-form {
                    grid-column: 1;
                }
            }
        `,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeAdminContainer implements OnInit, OnDestroy {
    pageSize = 10;

    @ViewChild(ListUsersFormComponent, { static: true })
    listUserForm: ListUsersFormComponent;

    private unsubscribe$ = new Subject();
    paginateUsers$ = new BehaviorSubject<PaginateOptions>({ pageIndex: 0, pageSize: this.pageSize });
    inactivateAdmin$ = new Subject<any>();
    inactivateUser$ = new Subject<any>();
    filter$ = new BehaviorSubject<string>('');
    sorter$ = new BehaviorSubject<Sort>({ active: 'fullName', direction: 'asc' });
    userCollection$ = this.employeeService.userCollection$;
    errors$ = this.employeeService.errors$;
    inactivateUserErrors$ = this.employeeService.inactivateUserErrors$;
    lstCaseManager$: any;

    newUserData$: any;

    constructor(private employeeService: EmployeeService, private dialog: MatDialog, private spinner: NgxSpinnerService,) { }

    ngOnInit() {
        combineLatest([this.paginateUsers$, this.filter$, this.sorter$])
            .pipe(
                debounceTime(300),
                switchMap(([pagination, filter, sorter]) => {
                    let orderBy = '';
                    if (sorter && sorter.active) {
                        orderBy = `${sorter.active} ${sorter.direction}`;
                    }
                    this.spinner.show();
                    return this.employeeService.paginteAdmins(pagination, filter, orderBy);
                }),
                takeUntil(this.unsubscribe$),
            )
            .subscribe();
        this.inactivateAdmin$
            .pipe(
                delay(0),
                exhaustMap(res => this.employeeService.deleteEmployee(res.userId, this.pageSize)),
                takeUntil(this.unsubscribe$),
            )
            .subscribe();
        this.inactivateUser$
            .pipe(
                delay(0),
                exhaustMap(res => this.employeeService.inactivateUser(res.userId, res.status, this.pageSize)),
                takeUntil(this.unsubscribe$),
            )
            .subscribe(() => this.spinner.hide());
        this.userCollection$.subscribe(() => {
            this.spinner.hide();
        })
    }

    openEditUser(data: { userId: string; username: string; email: string; firstname: string; lastname: string; genderId: string; countryId: string; educationId: string; address: string; dob: string; phoneNumber: string; }) {
        const {userId, username, email, firstname, lastname, genderId, countryId, educationId, address, dob, phoneNumber} = data
        const termDialog = this.dialog.open(NewUserDialogComponent, {
            width: '47.5rem',
            height: '44.9rem',
            data: {
                title: 'Edit New User',
                userId: userId,
                username: username,
                email: email,
                firstname: firstname,
                lastname: lastname,
                genderId: genderId,
                countryId: countryId,
                educationId: educationId,
                address: address,
                dob: dob,
                phoneNumber: phoneNumber
             },
        });

        termDialog.afterClosed().subscribe(res => {
            console.log(res);
        });
    }

    openDialog(data: { username: string; userId: string }) {
        const { userId } = data;
        let dialogRef = this.dialog.open(ConfirmCancelDialog, {
            width: '546px',
            data: {
                title: `Delete Nurse Account`,
                subTitle: `Are you sure you want to delete account?`,
                message: `
                        When delete, this user cannot work on Quoc Gia platform. Their information,
                        activities will be deleted.
                    `,
                cancelButtonText: 'Discard',
                confirmButtonText: 'Delete Account',
                hideCancelButton: false,
            },
        });

        dialogRef
            .afterClosed()
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(async result => {
                if (result) {
                    this.spinner.show();
                    const deleteResult = await this.employeeService.deleteEmployee(userId, this.pageSize);
                    if (deleteResult) {
                        this.spinner.hide();
                        this.dialog.open(ConfirmationDialog, {
                            width: '546px',
                            data: {
                                title: `Delete Successfully!`,
                                message: `
                                    User was successfully deleted from Quoc Gia platform.
                                    `,
                                closeButtonText: 'Close',
                            },
                        });
                    }
                }
            });
    }

    activeOrDeActive(data: { status: string; userId: string }) {
        let dialogRef = this.dialog.open(ConfirmCancelDialog, {
            width: '600px',
            data: {
                title: data.status === '1' ? `Deactivate Nurse user` : `Activate Nurse user`,
                subTitle:
                    data.status === '1'
                        ? `Are you sure you want to deactive account?`
                        : `Are you sure you want to activate account?`,
                message:
                    data.status === '1'
                        ? `When deactivated, Nurse user cannot work on QG Medica platform.`
                        : `When activated, Nurse user can continue working on QG Medica platform.`,
                cancelButtonText: 'Discard',
                confirmButtonText: data.status === '1' ? 'Deactivate account' : 'Activate account',
                hideCancelButton: false
            },
        });

        dialogRef
            .afterClosed()
            .pipe(
                switchMap((res) => {
                    if (res) {
                        this.spinner.show();
                        return this.employeeService.inactivateUser(data.userId, data.status, this.pageSize);
                    }
                    return of(undefined);
                }),
                takeUntil(this.unsubscribe$)
            )
            .subscribe(async result => {
                if (result) {
                    this.spinner.hide();
                    const confirmDialogRef = this.dialog.open(ConfirmationDialog, {
                        width: '546px',
                        data: {
                            title: data.status == '1' ? 'Deactivated Successfully!' : 'Activated Successfully',
                            message:
                                data.status == '1'
                                    ? 'User was successfully deactivated from QG Medica platform.'
                                    : 'User was successfully activated from QG Medica platform.',
                            closeButtonText: 'Close',
                        },
                    });

                    confirmDialogRef
                        .afterClosed()
                        .pipe(takeUntil(this.unsubscribe$))
                        .subscribe();
                }
            });
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}
