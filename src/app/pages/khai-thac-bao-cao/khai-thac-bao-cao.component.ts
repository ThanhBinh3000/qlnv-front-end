import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ROUTE_LIST} from "../khai-thac-bao-cao/khai-thac-bao-cao.constant";
import {Router} from "@angular/router";
import {UserService} from "src/app/services/user.service";

@Component({
  selector: 'app-khai-thac-bao-cao',
  templateUrl: './khai-thac-bao-cao.component.html',
  styleUrls: ['./khai-thac-bao-cao.component.scss']
})
export class KhaiThacBaoCaoComponent implements OnInit, AfterViewInit {
  @ViewChild('myTab') myTab: ElementRef;
  routes = ROUTE_LIST;
  routerUrl: string = "";
  defaultUrl: string = ''
  defaultModule: string = ''

  constructor(
    private router: Router,
    public userService: UserService
  ) {
    if (this.userService.isAccessPermisson('KTBC_TTQD')) {
      this.defaultModule = '/khai-thac-bao-cao/bao-cao-theo-ttqd';
    } else if (this.userService.isAccessPermisson('KTBC_CLHDTQG')) {
      this.defaultModule = '/khai-thac-bao-cao/bao-cao-chat-luong-hang-dtqg';
    } else if (this.userService.isAccessPermisson('KTBC_NXMBHDTQG')) {
      this.defaultModule = '/khai-thac-bao-cao/bao-cao-nhap-xuat-hang-dtqg';
    } else if (this.userService.isAccessPermisson('KTBC_NVQLKT')) {
      this.defaultModule = '/khai-thac-bao-cao/bao-cao-nghiep-vu-qly-kho';
    }
  }

  ngOnInit(): void {
    if (this.router.url) {
      this.routerUrl = this.router.url;
    }
    this.redirect(this.defaultModule)
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
    console.log(url, 'url')
    this.routerUrl = url;
    this.router.navigate([this.defaultUrl + url]);
  }
}
