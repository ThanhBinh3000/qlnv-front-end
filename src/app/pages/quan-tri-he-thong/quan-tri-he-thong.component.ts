import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild
} from '@angular/core';
import { Router } from '@angular/router';
import { NHAP_ROUTE_LIST } from './quan-tri-he-thong.constant';
@Component({
  selector: 'app-quan-tri-he-thong',
  templateUrl: './quan-tri-he-thong.component.html',
  styleUrls: ['./quan-tri-he-thong.component.scss'],
})
export class QuanTriHeThongNewComponent implements OnInit, AfterViewInit {
  @ViewChild('myTab') myTab: ElementRef;
  routes = NHAP_ROUTE_LIST;
  routerUrl: string = "";
  isCollapsed: boolean = true;
  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void {

    if (this.router.url) {
      this.routerUrl = this.router.url;
    }
    this.routes.forEach(route => {
      if (this.routerUrl.includes(route.idHover)) {
        route.isSelected = true;
      } else {
        route.isSelected = false;
      }
    })
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

  routerNavigate(route) {
    this.routes.forEach(item => {
      if (item.id === route.id) {
        item.isSelected = true;
      } else {
        item.isSelected = false;
      }
    })
    this.routerUrl = route.url;

    this.router.navigateByUrl(route.url);
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
      document.getElementById("mySidebar").style.width = "420px";
      document.getElementById("main").style.marginLeft = "420px";
    } else {
      document.getElementById("mySidebar").style.width = "0";
      document.getElementById("main").style.marginLeft = "0";
    }
  }


}
