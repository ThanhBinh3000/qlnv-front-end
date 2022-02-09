import { Component, OnInit } from '@angular/core';
import { AuthService } from '../..';

@Component({
    selector: 'app-container',
    template: `
        <!-- <div *ngIf="users" class="grid-container1 main-content">
            <ng-container [ngSwitch]="users?.role">
                <app-admin-dashboard *ngSwitchCase="'admin'" class="app-admin-dashboard"></app-admin-dashboard>
                <app-user-dashboard *ngSwitchCase="'user'"></app-user-dashboard>
                <div *ngSwitchDefault></div>
            </ng-container>
        </div> -->

        <div class="grid-container1 main-content">
            <ng-container>
                <app-admin-dashboard class="app-admin-dashboard"></app-admin-dashboard>
            </ng-container>
        </div>
    `,
    styles: [`
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

            .grid-container .app-admin-dashboard {
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

                .grid-container .app-admin-dashboard {
                    grid-column: 1;
                }

                .grid-container .new-user-form {
                    grid-column: 1;
                }
            }
    `],
})
export class ContainerComponent implements OnInit {
    public users;
    constructor(private authService: AuthService) {}

    ngOnInit() {
        this.users = this.authService.getUser();
    }
}
