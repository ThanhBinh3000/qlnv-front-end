import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Subject} from "rxjs";
import {UserService} from "../../../services/user.service";
import {Globals} from "../../../shared/globals";

@Component({
  selector: 'app-bao-cao-theo-ttqd',
  templateUrl: './bao-cao-theo-ttqd.component.html',
  styleUrls: ['./bao-cao-theo-ttqd.component.scss']
})
export class BaoCaoTheoTtqdComponent implements OnInit,AfterViewInit {
  isVisibleChangeTab$ = new Subject();
  visibleTab: boolean = true;

  constructor(
    public userService: UserService,
    public globals: Globals
  ) {
  }

  ngAfterViewInit(): void {
    // throw new Error('Method not implemented.');
  }

  ngOnInit(): void {
    this.isVisibleChangeTab$.subscribe((value: boolean) => {
      this.visibleTab = value;
    });
  }

  tabSelected: number = 5;

  selectTab(tab: number) {
    this.tabSelected = tab;
  }
}
