import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {KHOI_TAO_DU_LIEU_ROUTE} from '../khoi-tao-du-lieu/khoi-tao-du-lieu.constant';
import {Router} from "@angular/router";
import {UserService} from "src/app/services/user.service";
import {UserLogin} from "../../models/userlogin";

@Component({
  selector: 'app-khoi-tao-du-lieu',
  templateUrl: './khoi-tao-du-lieu.component.html',
  styleUrls: ['./khoi-tao-du-lieu.component.scss']
})
export class KhoiTaoDuLieuComponent implements OnInit, AfterViewInit {
  @ViewChild('myTab') myTab: ElementRef;
  routes = [
    {
      icon: 'htvbdh_tcdt_congtrinhnghiencuu',
      title: 'Mạng lưới kho',
      url: `/${KHOI_TAO_DU_LIEU_ROUTE}/mang-luoi-kho`,
      dropdown: 'mang-luoi-kho',
      idHover: 'mang-luoi-kho',
      hasTab: false,
      permission: this.userService.isAccessPermisson('KHCNBQ_CTNCKHCNBQ') ? true : false
    },
    {
      icon: 'htvbdh_tcdt_congtrinhnghiencuu',
      title: 'Hiện trạng công cụ, dụng cụ',
      url: `/${KHOI_TAO_DU_LIEU_ROUTE}/ht-cong-cu-dung-cu`,
      dropdown: 'ht-cong-cu-dung-cu',
      idHover: 'ht-cong-cu-dung-cu',
      hasTab: false,
      permission: this.userService.isAccessPermisson('KHCNBQ_CTNCKHCNBQ') ? true : false
    },
    {
      icon: 'htvbdh_tcdt_congtrinhnghiencuu',
      title: 'Hiện trạng máy móc thiết bị',
      url: `/${KHOI_TAO_DU_LIEU_ROUTE}/ht-may-moc-thiet-bi`,
      dropdown: 'ht-may-moc-thiet-bi',
      idHover: 'ht-may-moc-thiet-bi',
      hasTab: false,
      permission: this.userService.isAccessPermisson('KHCNBQ_CTNCKHCNBQ') ? true : false
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
