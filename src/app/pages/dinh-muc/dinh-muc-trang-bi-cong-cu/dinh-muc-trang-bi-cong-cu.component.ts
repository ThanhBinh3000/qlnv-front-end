import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';

@Component({
  selector: 'app-dinh-muc-trang-bi-cong-cu',
  templateUrl: './dinh-muc-trang-bi-cong-cu.component.html',
  styleUrls: ['./dinh-muc-trang-bi-cong-cu.component.scss']
})
export class DinhMucTrangBiCongCuComponent implements OnInit {
  $routerChange: Subscription;
  currentUrl: string;
  constructor(
    private readonly router: Router,
    public userService: UserService,
    public globals: Globals,
  ) { }

  ngOnDestroy(): void {
    this.$routerChange.unsubscribe();
  }

  tabSelected = 'dinhmuctrangbi';
  selectTab(tab) {
    this.tabSelected = tab;
  }

  ngOnInit(): void {
    this.currentUrl = window.location.href;
    this.$routerChange = this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        console.log('Route change detected');
        console.log(event);
      }

      if (event instanceof NavigationEnd) {
        this.currentUrl = event.url;
        if (event.url.includes('hang-theo-doi-dac-thu')) {
        }
        console.log(event);
      }
    });
  }
}
