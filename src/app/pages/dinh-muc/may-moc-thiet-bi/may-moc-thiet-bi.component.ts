import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';

@Component({
  selector: 'app-may-moc-thiet-bi',
  templateUrl: './may-moc-thiet-bi.component.html',
  styleUrls: ['./may-moc-thiet-bi.component.scss']
})
export class MayMocThietBiComponent implements OnInit {
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

  tabSelected = null;
  selectTab(tab) {
    this.tabSelected = tab;
  }

  ngOnInit(): void {
    if (!this.userService.isAccessPermisson('QLĐMNXBQ_MMTBCD')) {
      this.router.navigateByUrl('/error/401')
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
