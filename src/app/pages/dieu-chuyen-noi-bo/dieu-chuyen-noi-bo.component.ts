import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from "@angular/router";
import { ROUTE_LIST } from "./dieu-chuyen-noi-bo.constant";
import { UserService } from "../../services/user.service";
import { HttpClient } from "@angular/common/http";
import { StorageService } from "../../services/storage.service";


@Component({
  selector: 'app-dieu-chuyen-noi-bo',
  templateUrl: './dieu-chuyen-noi-bo.component.html',
  styleUrls: ['./dieu-chuyen-noi-bo.component.scss']
})
export class DieuChuyenNoiBoComponent implements OnInit {
  @ViewChild('myTab') myTab: ElementRef;
  routes: any[] = ROUTE_LIST;
  routerUrl: string = "";
  defaultUrl: string = '/dieu-chuyen-noi-bo'
  userService: UserService;
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    private router: Router,
  ) {
    this.userService = new UserService(httpClient, storageService);
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
  }
}
