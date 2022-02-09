import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { filter, map } from "rxjs/operators";
import { AuthService } from "../../auth";
import { UserInfo } from "../../core";
import { UpdateAdmin, UpdateEmployer } from "../user-settings-types";

@Component({
    selector: 'user-settings-container',
    template: `
        <div>
            <ng-container [ngSwitch]="(user$ | async)?.role">
                <div>
                    <app-admin-user *ngSwitchCase="'admin'"></app-admin-user>

                    <app-employer-user *ngSwitchCase="'user'"></app-employer-user>
                </div>
            </ng-container>
        </div>
    `,
    styles: [
        `
            .account-setting-content{
                overflow: auto;
                padding-bottom: 5rem;
            }

            .acount-setting-sidenav {
                position: fixed;
                bottom: 0;
                left: 0;
                width: 100%;
                z-index: 9;
                background-color: #fff;
                border-top: 1px solid #c9cfd6;
                height: 92px;
                display: flex;
                align-items: center;
                justify-content: flex-end;
            }

            .button-delete {
                color: #E26A74;
                background: white;
                border: 1px solid #E26A74;
                box-sizing: border-box;
                width: 144px;
                height: 40px;
                margin-right: 48px;
                border-radius: 4px;
            }
        `,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class UserSettingsContainerComponent implements OnInit, OnDestroy {
    user$: Observable<UserInfo | null>;
    isLogin$: Observable<boolean>;
    role$: Observable<string>;
    role: string;
    infoChangeAdmin: UpdateAdmin;
    infoChangeEmployer: UpdateEmployer;
    formValid = false;
    private unsubscribe$ = new Subject();

    constructor(
        private authService: AuthService,
    ) { }

    ngOnInit(): void {
        this.user$ = this.authService.user$;
        this.role$ = this.authService.user$.pipe(
            filter(user => !!user),
            map(user => (user && user.role ? user.role.toString() : '')),
        );
        this.isLogin$ = this.authService.isLogin$;

        this.role$.subscribe(value => {
            this.role = value;
        });
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}
