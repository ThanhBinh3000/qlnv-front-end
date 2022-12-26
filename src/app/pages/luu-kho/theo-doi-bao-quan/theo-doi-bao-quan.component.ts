import {Component, OnInit} from '@angular/core';
import {NavigationEnd, NavigationStart, Router} from "@angular/router";
import {Subscription} from "rxjs";
import {Globals} from "../../../shared/globals";

@Component({
  selector: 'app-theo-doi-bao-quan',
  templateUrl: './theo-doi-bao-quan.component.html',
  styleUrls: ['./theo-doi-bao-quan.component.scss']
})
export class TheoDoiBaoQuanComponent implements OnInit {
  $routerChange: Subscription;
  currentUrl: string;

  constructor(
    private readonly router: Router,
    public globals: Globals
  ) {
    console.log(1234)
  }

  ngOnDestroy(): void {
    this.$routerChange.unsubscribe();
  }

  tabSelected = 'sokhothekho';

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
