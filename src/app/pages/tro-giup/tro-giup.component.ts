import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UserService } from "src/app/services/user.service";
import { Subscription } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { StorageService } from "src/app/services/storage.service";
import { Event, NavigationEnd, NavigationError, NavigationStart, Router } from "@angular/router";
import { STATUS } from "src/app/constants/status";
import { cloneDeep } from 'lodash';
import { ROUTE_LIST } from './tro-giup.constant';
@Component({
    selector: 'app-tro-giup',
    templateUrl: './tro-giup.component.html',
    styleUrls: ['./tro-giup.component.scss']
})
export class TroGiupComponent implements OnInit, OnDestroy {
    @ViewChild('myTab') myTab: ElementRef;
    routes: any[] = ROUTE_LIST;
    routerUrl: string = "";
    defaultUrl: string = '/tro-giup'
    userService: UserService;
    $routerChange: Subscription;

    constructor(
        httpClient: HttpClient,
        storageService: StorageService,
        private router: Router,
    ) {
        this.userService = new UserService(httpClient, storageService);
        console.log('this.router.url', this.router.url);

    }

    ngOnInit(): void {
        if (this.router.url) {
            this.routerUrl = this.router.url;
        }
        this.$routerChange = this.router.events.subscribe((event: Event) => {
            if (event instanceof NavigationStart) {
            }

            if (event instanceof NavigationEnd) {
                if (event.urlAfterRedirects) {
                    this.routerUrl = event.urlAfterRedirects
                }
            }

            if (event instanceof NavigationError) {
                console.log(event.error);
            }
        });
    }

    ngAfterViewInit() {
        if (
            this.myTab.nativeElement.scrollWidth >
            this.myTab.nativeElement.clientWidth
        ) {
            this.myTab.nativeElement.className =
                'nav nav-tabs expand-sidebar next-an';
        } else {
            this.myTab.nativeElement.className = 'nav nav-tabs';
        }
    }

    updateCssOverlay() {
        setTimeout(() => {
            let child = document.getElementsByClassName('dau-thau-tab');
            if (child && child.length > 0) {
                child[0].parentElement.classList.add('left-0');
            }
        }, 200);
    }

    endSlide() {
        if (
            this.myTab.nativeElement.scrollWidth >
            this.myTab.nativeElement.clientWidth
        ) {
            this.myTab.nativeElement.scrollTo({
                left: this.myTab.nativeElement.scrollWidth,
                top: 0,
                behavior: 'smooth',
            });
            this.myTab.nativeElement.className =
                'nav nav-tabs expand-sidebar prev-an';
        }
    }

    startSlide() {
        if (
            this.myTab.nativeElement.scrollWidth >
            this.myTab.nativeElement.clientWidth
        ) {
            this.myTab.nativeElement.scrollTo({
                left: 0,
                top: 0,
                behavior: 'smooth',
            });
            this.myTab.nativeElement.className =
                'nav nav-tabs expand-sidebar next-an';
        }
    }

    redirect(url: string) {
        this.routerUrl = this.defaultUrl + url;
        console.log("adada", this.defaultUrl + url)
        this.router.navigate([this.defaultUrl + url]);
    }

    ngOnDestroy(): void {
        this.$routerChange.unsubscribe();
    }

}
