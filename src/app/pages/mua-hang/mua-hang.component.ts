import {
    AfterViewInit,
    Component,
    ElementRef,
    OnInit,
    ViewChild
} from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { MUA_HANG_ROUTE_LIST } from './mua-hang.constant';
@Component({
    selector: 'app-mua-hang',
    templateUrl: './mua-hang.component.html',
    styleUrls: ['./mua-hang.component.scss'],
})
export class MuaHangComponent implements OnInit, AfterViewInit {
    @ViewChild('myTab') myTab: ElementRef;
    routes = MUA_HANG_ROUTE_LIST;
    routerUrl: string = "";
    defaultUrl: string = '/mua-hang'

    constructor(
        private userService: UserService,
        private router: Router,
    ) { 
        router.events.subscribe((val)=>{
            if (this.router.url) {
                this.routerUrl = this.router.url;
            }
        })
    }

    ngOnInit(): void {
        if (this.router.url) {
            this.routerUrl = this.router.url;
        }
    }

    filterRole(url){
        if(url.includes('/dau-thau/kehoach-luachon-nhathau/') && ( this.userService.isTongCuc() || this.userService.isCuc)){
            return true;
        }
        if(url.includes('/dau-thau/trienkhai-luachon-nhathau/') && this.userService.isCuc()){
            return true;
        }
        if(url.includes('/dau-thau/dieuchinh-luachon-nhathau/') && this.userService.isTongCuc()){
            return true;
        }
        return false;
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
        this.router.navigate([this.defaultUrl + url]);
    }
}
