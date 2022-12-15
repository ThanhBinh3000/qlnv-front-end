import {Component, OnInit} from '@angular/core';
import {Subject} from "rxjs";
import {UserService} from "../../../services/user.service";
import {Globals} from "../../../shared/globals";

@Component({
  selector: 'app-tonghop-pheduyet',
  templateUrl: './tonghop-pheduyet.component.html',
  styleUrls: ['./tonghop-pheduyet.component.scss']
})
export class TonghopPheduyetComponent implements OnInit {
  isVisibleChangeTab$ = new Subject();
  visibleTab: boolean = true;

  constructor(public userService: UserService,
              public globals: Globals) {
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
