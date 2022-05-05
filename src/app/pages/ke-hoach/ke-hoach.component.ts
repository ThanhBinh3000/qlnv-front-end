// import { Component, OnInit } from '@angular/core';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild
} from '@angular/core';
import { Router } from '@angular/router';
import { UserLogin } from 'src/app/models/userlogin';
import { UserService } from 'src/app/services/user.service';
import { ROUTE_LIST_KE_HOACH } from './ke-hoach.constant';
@Component({
  selector: 'app-ke-hoach',
  templateUrl: './ke-hoach.component.html',
  styleUrls: ['./ke-hoach.component.scss'],
})
export class KeHoachComponent implements OnInit, AfterViewInit {
  @ViewChild('myTab') myTab: ElementRef;
  isSuperAdmin: boolean = false;
  userLogin: UserLogin;
  routes = ROUTE_LIST_KE_HOACH;
  routerUrl: string = "";
  defaultUrl: string = '/ke-hoach/'

  constructor(
    private userService: UserService,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    this.userLogin = this.userService.getUserLogin();
    this.isSuperAdmin = this.userLogin.userName == 'adminteca';
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

  updateCssOverlay() {
    setTimeout(() => {
      let child = document.getElementsByClassName('dau-thau-tab');
      if (child && child.length > 0) {
        child[0].parentElement.classList.add('left-0');
      }
    }, 200);
  }

  redirect(url: string) {
    this.routerUrl = url;
    this.router.navigate([url]);
  }
}
