import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild
} from '@angular/core';
import { Router } from '@angular/router';
import { NHAP_ROUTE_LIST } from './quantridanhmuc.constant';
@Component({
  selector: 'app-quantridanhmuc',
  templateUrl: './quantridanhmuc.component.html',
  styleUrls: ['./quantridanhmuc.component.scss'],
})
export class QuanTriDanhMucComponent implements OnInit, AfterViewInit {
  @ViewChild('myTab') myTab: ElementRef;
  routes = NHAP_ROUTE_LIST;
  routerUrl: string = "";
  routerUrlActive : string = "";
  isCollapsed: boolean = true;
  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void {
    if (this.router.url) {
      this.routerUrl = this.router.url;
      this.activeUrl(this.router.url);
    }
  }

  activeUrl(url): void{
    if (this.router.url) {
      const urlC =  url.split("/");
      this.routerUrlActive = urlC[urlC.length - 1]
    }
  }
  ngAfterViewInit() {
    // if (
    //   this.myTab.nativeElement.scrollWidth >
    //   this.myTab.nativeElement.clientWidth
    // ) {
    //   this.myTab.nativeElement.className =
    //     'nav nav-tabs expand-sidebar next-an';
    // } else {
    //   this.myTab.nativeElement.className = 'nav nav-tabs';
    // }
  }

  routerNavigate(url) {
    this.routerUrl = url;
    this.activeUrl(url);
    this.router.navigateByUrl(url);
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

  openNav() {
    this.isCollapsed = !this.isCollapsed;
    if (this.isCollapsed) {
      document.getElementById("mySidebar").classList.add('show');
      document.getElementById("mySidebar").style.width = "300px";
      document.getElementById("main").style.marginLeft = "300px";
    } else {
      document.getElementById("mySidebar").classList.remove('show');
      document.getElementById("mySidebar").style.width = "0";
      document.getElementById("main").style.marginLeft = "16px";
    }
  }


}
