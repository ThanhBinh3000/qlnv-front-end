import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { NgxSpinnerService } from 'ngx-spinner';
import { BehaviorSubject, combineLatest, of, Subject } from 'rxjs';
import { debounceTime, delay, exhaustMap, switchMap, takeUntil } from 'rxjs/operators';
import { ConfirmationDialog, ConfirmCancelDialog } from '../../shared';
import { PaginateOptions } from '../../types';
import { DanhSachDanhMucDonViCuuTro } from '../components';
import { DanhMucDonViCuuTroService } from '../services';

@Component({
    selector: 'danh-muc-don-vi-cuu-tro-dashboard',
    template: `
        <div class="grid-container1 main-content">
            <danh-sach-danh-muc-don-vi-cuu-tro
                class="list-users-form"
                [pageSize]="pageSize"
                [userCollection]="userCollection$ | async"
                (paginate)="paginateUsers$.next($event)"
            >
            </danh-sach-danh-muc-don-vi-cuu-tro>
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
export class DanhMucDonViCuuTroContainer implements OnInit, OnDestroy {
    pageSize = 10;

    @ViewChild(DanhSachDanhMucDonViCuuTro, { static: true })
    listUserForm: DanhSachDanhMucDonViCuuTro;

    private unsubscribe$ = new Subject();
    paginateUsers$ = new BehaviorSubject<PaginateOptions>({ pageIndex: 0, pageSize: this.pageSize });
    userCollection$ = this.service.listDonVi$;
    errors$ = this.service.errors$;

    constructor(private service: DanhMucDonViCuuTroService, private dialog: MatDialog, private spinner: NgxSpinnerService) {}

    ngOnInit() {
        combineLatest([this.paginateUsers$])
            .pipe(
                debounceTime(300),
                switchMap(([pagination]) => {
                    this.spinner.show();
                    return this.service.paginteAdmins(pagination);
                }),
                takeUntil(this.unsubscribe$),
            )
            .subscribe();
        this.userCollection$.subscribe(() => {
            this.spinner.hide();
        });
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}
