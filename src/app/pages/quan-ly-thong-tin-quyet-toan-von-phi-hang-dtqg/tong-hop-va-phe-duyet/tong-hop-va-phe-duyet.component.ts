import { Globals } from 'src/app/shared/globals';
import { UserService } from 'src/app/services/user.service';
import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-tong-hop-va-phe-duyet',
  templateUrl: 'tong-hop-va-phe-duyet.html',
  styleUrls: [],
})
export class TongHopVaPheDuyetComponent implements OnInit {
  isVisibleChangeTab$ = new Subject();
  visibleTab: boolean = true;
  constructor(
    public userService: UserService,
    public globals: Globals
  ) { }

  ngOnInit(): void {
    // this.isVisibleChangeTab$.subscribe((value: boolean) => {
    //   this.visibleTab = value;
    // });
    console.log('jaaaaaaaaaaaa');
  }
  tabSelected: number = 0;
  selectTab(tab: number) {
    this.tabSelected = tab;
  }
}
