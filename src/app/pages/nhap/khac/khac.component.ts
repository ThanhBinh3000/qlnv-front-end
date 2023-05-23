import { Component, OnInit } from '@angular/core';
import { Subject } from "rxjs";
import { UserService } from "../../../services/user.service";
import { Globals } from "../../../shared/globals";

@Component({
  selector: 'app-khac',
  templateUrl: './khac.component.html',
  styleUrls: ['./khac.component.scss']
})
export class KhacComponent implements OnInit {
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
  tabSelected = this.userService.isChiCuc() ? 'qdgnvnk' : 'khnk';
  selectTab(tab) {
    this.tabSelected = tab;
  }

}
