import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Globals } from 'src/app/shared/globals';

@Component({
  selector: 'app-hop-dong-mua-sam',
  templateUrl: './hop-dong-mua-sam.component.html',
  styleUrls: ['./hop-dong-mua-sam.component.scss']
})
export class HopDongMuaSamComponent implements OnInit {
  $routerChange: Subscription;
  currentUrl: string;
  constructor(
    private readonly router: Router,
    public globals: Globals
  ) { }

  ngOnDestroy(): void {
    this.$routerChange.unsubscribe();
  }

  tabSelected = 'hopdongphuluc';
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
