import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {KHOI_TAO_DU_LIEU_ROUTE, KHOI_TAO_DU_LIEU_ROUTE_LIST} from '../khoi-tao-du-lieu/khoi-tao-du-lieu.constant';
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
  routes = KHOI_TAO_DU_LIEU_ROUTE_LIST;
  routerUrl: string = "";
  userInfo :UserLogin;
  constructor(
    private router: Router,
    public userService: UserService,
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
