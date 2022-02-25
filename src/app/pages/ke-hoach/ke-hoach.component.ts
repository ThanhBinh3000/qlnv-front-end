// import { Component, OnInit } from '@angular/core';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
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
  constructor(private userService: UserService) {}

  ngOnInit(): void {
    console.log(this.routes);

    this.userLogin = this.userService.getUserLogin();
    this.isSuperAdmin = this.userLogin.userName == 'adminteca';
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
}
