import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild
} from '@angular/core';
import {Router} from '@angular/router';
import {QUAN_LY_KHO_TANG_ROUTE_LIST} from './quan-ly-kho-tang.constant';
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-quan-ly-kho-tang',
  templateUrl: './quan-ly-kho-tang.component.html',
  styleUrls: ['./quan-ly-kho-tang.component.scss'],
})
export class QuanLyKhoTangComponent implements OnInit, AfterViewInit {
  @ViewChild('myTab') myTab: ElementRef;
  routes = QUAN_LY_KHO_TANG_ROUTE_LIST;
  routerUrl: string = "";
  defaultUrl: string = '/quan-ly-kho-tang'

  constructor(
    private router: Router,
    public userService: UserService,
  ) {
  }

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

  redirect(url: string) {
    this.router.navigate([this.defaultUrl + url]);
    this.routerUrl = this.defaultUrl + url;
  }
}
