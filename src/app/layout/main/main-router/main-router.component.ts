// import { Component, OnInit } from '@angular/core';
import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {ObservableService} from 'src/app/services/observable.service';
import {LIST_PAGES} from '../main-routing.constant';
import {UserService} from "../../../services/user.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-main-router',
  templateUrl: './main-router.component.html',
  styleUrls: ['./main-router.component.scss'],
})
export class MainRouterComponent implements OnInit {
  @ViewChild('myTab2') myTab2: ElementRef;
  lstRouter = [];
  lstPage = [];
  constructor(
    private notification: NzNotificationService,
    private observableService: ObservableService,
    public userService: UserService,
    private router: Router
  ) {
    this.lstPage = LIST_PAGES;
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.myTab2.nativeElement.scrollWidth > this.myTab2.nativeElement.clientWidth) {
        this.myTab2.nativeElement.className = 'ant-menu ant-menu-root ant-menu-dark ant-menu-horizontal next-hien next-an';
      } else {
        this.myTab2.nativeElement.className = 'ant-menu ant-menu-root ant-menu-dark ant-menu-horizontal myTab2-an';

      }
    }, 500);
  }

  endSlide() {
    if (this.myTab2.nativeElement.scrollWidth >= this.myTab2.nativeElement.clientWidth) {
      this.myTab2.nativeElement.scrollTo({ left: this.myTab2.nativeElement.scrollWidth, top: 0, behavior: 'smooth' })
      this.myTab2.nativeElement.className = 'ant-menu ant-menu-root ant-menu-dark ant-menu-horizontal prev-an';
    }
  }

  startSlide() {
    if (this.myTab2.nativeElement.scrollWidth >= this.myTab2.nativeElement.clientWidth) {
      this.myTab2.nativeElement.scrollTo({ left: 0, top: 0, behavior: 'smooth' })
      this.myTab2.nativeElement.className = 'ant-menu ant-menu-root ant-menu-dark ant-menu-horizontal next-an';
    }
  }
}
