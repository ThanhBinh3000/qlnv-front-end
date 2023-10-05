import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Globals } from 'src/app/shared/globals';

@Component({
  selector: 'app-quan-ly-so-the-kho',
  templateUrl: './quan-ly-so-the-kho.component.html',
  styleUrls: ['./quan-ly-so-the-kho.component.scss'],
})
export class QuanLySoTheKhoComponent implements OnInit, OnDestroy {
  $routerChange: Subscription;
  currentUrl: string;
  constructor(
    private readonly router: Router,
    public globals: Globals
  ) { }

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
