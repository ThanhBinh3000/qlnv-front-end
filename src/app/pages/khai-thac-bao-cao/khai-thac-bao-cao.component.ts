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
  routes ;
  routerUrl: string = "";
  defaultUrl: string = ''

  constructor(
    private router: Router,
    public userService: UserService
  ) {
  }

  ngOnInit(): void {
    if (this.router.url) {
      this.routerUrl = this.router.url;
    }
    console.log(this.routerUrl,111)
    this.routes = ROUTE_LIST.filter(item => this.userService.isAccessPermisson(item.accessPermisson));
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
    this.router.navigate([this.defaultUrl + url]);
  }
}
