import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { event } from 'jquery';
import { Observable, Subject } from 'rxjs';
import { filter, map, shareReplay, takeUntil } from 'rxjs/operators';
import * as myGlobals from '../../../globals';
import { AuthService } from '../../auth';
import { BreadcrumbService } from '../../core';
import { UnsavedChangesDialog } from '../dialogs/unsaved-change-dialog/unsaved-changes-dialog.component';

declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}

export let ROUTES: RouteInfo[] = [];

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
    currentYear = new Date().getFullYear();
    isLogin$: Observable<boolean>;
    mobileQuery: MediaQueryList;
    role$: Observable<string>;
    breadcrumb = '';
    dynamicBreadcrumb = false;

    role: string;

    activeMenu = false;

    panelOpenState = false;

    @Output() logoutAccount = new EventEmitter<any>();
    menuItems: any = []
    numberUnread: number = 0

    breadcrumbItems$ = this.breadcrumbService.breadcrumbItems$;
    isStandalonePage = false;

    fullname$: Observable<string>;
    private unsubscribe$ = new Subject();

    childComponent: any;

    constructor(
        private authService: AuthService,
        public cdr: ChangeDetectorRef,
        media: MediaMatcher,
        private router: Router,
        private breadcrumbService: BreadcrumbService,
        private dialog: MatDialog,
    ) {
        this.authService.getMenu().subscribe(x => {
            if (x){
                this.menuItems = x.data;
                for(let i = 0; i < this.menuItems.length; i++) {
                    if(this.menuItems[i].parent_id == null){
                        this.menuItems[i].parent_id = 0;
                        let findChid = this.menuItems.filter(x => x.parent_id == this.menuItems[i].id);
                        if(findChid != null && findChid.length > 0){
                            this.menuItems[i].hasChild = true;
                        }
                        else {
                            this.menuItems[i].hasChild = false;
                        }
                    }
                    else {
                        this.menuItems[i].hasChild = false;
                    }
                }
                ROUTES = this.menuItems;
            }
        });
    }

    public onRouterOutletActivate(event: any) {
        this.childComponent = event;
    }

    ngOnInit() {

        this.isLogin$ = this.authService.isLogin$;

        const user$ = this.authService.user$;
        this.fullname$ = user$.pipe(
            filter(user => !!user),
            map(user => {
                return (user && user.username) || '';
            }),
            shareReplay(1),
            takeUntil(this.unsubscribe$),
        );

        this.role$ = this.authService.user$.pipe(
            filter(user => !!user),
            map(user => (user && user.role ? user.role.toString() : '')),
        );

        this.role$.subscribe(value => {
            this.role = value;
        });
    }

    isMobileMenu() {
        if ($(window).width() > 1100) {
            return false;
        }
        return true;
    }

    logout() {
        this.authService.logout();
    }
}


