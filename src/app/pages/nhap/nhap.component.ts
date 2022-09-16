import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild
} from '@angular/core';
import {Router} from '@angular/router';
import {NHAP_ROUTE_LIST} from './nhap.constant';
import {UserService} from "../../services/user.service";
import {MESSAGE} from "../../constants/message";
import {ChiTietMenu1} from "../../models/ChiTietMenu";
import {OldResponseData} from "../../interfaces/response";

@Component({
  selector: 'app-nhap',
  templateUrl: './nhap.component.html',
  styleUrls: ['./nhap.component.scss'],
})
export class NhapComponent implements OnInit, AfterViewInit {
  @ViewChild('myTab') myTab: ElementRef;
  routes = [];
  routerUrl: string = "";

  constructor(
    private router: Router,
    private userService: UserService,
  ) {
    this.userService.getUserPermission().then(res => {
      let menu: ChiTietMenu1[] = []
      if (res.msg == MESSAGE.SUCCESS) {
        console.log(res.data)
        res.data = res.data.filter(s => (s.id >= 268 && s.id <= 272))
        console.log(res.data)
        res.data.forEach(s => {
          let chiTietMenu1 = new ChiTietMenu1();
          chiTietMenu1.title = s.name;
          chiTietMenu1.code = s.code;
          chiTietMenu1.url = s.url;
          chiTietMenu1.icon = s.icon;
          chiTietMenu1.hasTab = true;
          chiTietMenu1.dropdown = 'dau-thau';
          chiTietMenu1.idHover = 'dau-thau';

          menu.push(chiTietMenu1);
        })
        console.log(menu, 2222);
        this.routes = menu;
      }
    });
    //console.log(userPermission);

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
    this.routerUrl = url;
    window.location.href = url;
  }
}
