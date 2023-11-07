import { Component, OnInit } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';

@Component({
  selector: 'app-mang-pvc-cong-cu-dung-cu',
  templateUrl: './mang-pvc-cong-cu-dung-cu.component.html',
  styleUrls: ['./mang-pvc-cong-cu-dung-cu.component.scss']
})
export class MangPvcCongCuDungCuComponent implements OnInit {
  $routerChange: Subscription;
  currentUrl: string;
  constructor(
    private readonly router: Router,
    public userService: UserService,
    public globals: Globals,
  ) { }
  tabSelected = 'dexuatnhucau';
  selectTab(tab) {
    this.tabSelected = tab;
  }

  ngOnInit(): void {
    if (!this.userService.isAccessPermisson('QLĐMNXBQ_MANGPVCVACCDC')) {
      this.router.navigateByUrl('/error/401')
    }
    if (this.userService.isChiCuc()) {
      this.tabSelected = 'dexuatnhucau';
    }
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
