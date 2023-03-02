import { Component, OnInit } from '@angular/core';
import { UserService } from "../../../../services/user.service";
import { Globals } from "../../../../shared/globals";
import { Subject } from "rxjs";

@Component({
  selector: 'app-xuat-cap',
  templateUrl: './xuat-cap.component.html',
  styleUrls: ['./xuat-cap.component.scss']
})
export class XuatCapComponent implements OnInit {
  isVisibleChangeTab$ = new Subject();
  visibleTab: boolean = true;
  constructor(
    public userService: UserService,
    public globals: Globals
  ) { }

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
