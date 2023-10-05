import {
    AfterViewInit,
    Component,
    ElementRef,
    OnInit,
    ViewChild
} from '@angular/core';
import { Router } from '@angular/router';
import {KHKN_BAO_QUAN_MAIN_ROUTE, KHKN_BAO_QUAN_ROUTE_LIST} from './khkn-bao-quan.constant';
import {UserLogin} from "../../models/userlogin";
import {UserService} from "../../services/user.service";
import {MAIN_ROUTES} from "../../layout/main/main-routing.constant";
@Component({
    selector: 'app-khkn-bao-quan',
    templateUrl: './khkn-bao-quan.component.html',
    styleUrls: ['./khkn-bao-quan.component.scss'],
})
export class KhknBaoQuanComponent implements OnInit, AfterViewInit {
    @ViewChild('myTab') myTab: ElementRef;
    routes = [
      {
        icon: 'htvbdh_tcdt_congtrinhnghiencuu',
        title: 'Quản lý công trình nghiên cứu, công nghệ bảo quản',
        url: `/${KHKN_BAO_QUAN_MAIN_ROUTE}/quan-ly-cong-trinh-nghien-cuu-bao-quan`,
        dropdown: 'dau-thau',
        idHover: 'dauthau',
        hasTab: false,
        permission: this.userService.isAccessPermisson('KHCNBQ_CTNCKHCNBQ') ? true : false
      },
      {
        icon: 'htvbdh_tcdt_quytrinhkythuat',
        title: 'Quản lý quy chuẩn, tiêu chuẩn quốc gia',
        url: `/${KHKN_BAO_QUAN_MAIN_ROUTE}/quan-ly-quy-chuan-ky-thuat-quoc-gia`,
        dropdown: 'dau-thau',
        idHover: 'dauthau',
        hasTab: false,
        permission: this.userService.isAccessPermisson('KHCNBQ_QCKTTCCS') ? true : false
      }
    ];
    routerUrl: string = "";
    userInfo :UserLogin;
    constructor(
        private router: Router,
        private userService: UserService,
    ) { }

    ngOnInit(): void {
        if (this.router.url) {
            this.routerUrl = this.router.url;
        }
        this.userInfo = this.userService.getUserLogin();
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
        this.routerUrl = url;
        this.router.navigate([url]);
    }
}
