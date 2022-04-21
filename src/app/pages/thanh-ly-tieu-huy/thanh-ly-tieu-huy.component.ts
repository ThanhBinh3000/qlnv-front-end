import {
    AfterViewInit,
    Component,
    ElementRef,
    OnInit,
    ViewChild
} from '@angular/core';
import { Router } from '@angular/router';
import { THANH_LY_TIEU_HUY_ROUTE_LIST } from './thanh-ly-tieu-huy.constant';
@Component({
    selector: 'app-thanh-ly-tieu-huy',
    templateUrl: './thanh-ly-tieu-huy.component.html',
    styleUrls: ['./thanh-ly-tieu-huy.component.scss'],
})
export class ThanhLyTieuHuyComponent implements OnInit, AfterViewInit {
    @ViewChild('myTab') myTab: ElementRef;
    routes = THANH_LY_TIEU_HUY_ROUTE_LIST;
    routerUrl: string = "";

    constructor(
        private router: Router,
    ) { }

    ngOnInit(): void {
        if (this.router.url) {
            this.routerUrl = this.router.url;
        }
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
}
