import {Component, OnInit} from '@angular/core';
import {Subject} from "rxjs";
import {UserService} from "../../../../../services/user.service";
import {Globals} from "../../../../../shared/globals";


@Component({
  selector: 'app-kiem-tra-chat-luong-vt-tb',
  templateUrl: './kiem-tra-chat-luong-vt-tb.component.html',
  styleUrls: ['./kiem-tra-chat-luong-vt-tb.component.scss']
})
export class KiemTraChatLuongVtTbComponent implements OnInit {
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

  tabSelected: number = 0;

  selectTab(tab: number) {
    this.tabSelected = tab;
  }

}
