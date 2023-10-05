import {Component, Input, OnInit} from '@angular/core';
import {UserService} from "../../../../services/user.service";
import {Globals} from "../../../../shared/globals";
import {Subject} from "rxjs";

@Component({
  selector: 'app-xuat-cap',
  templateUrl: './xuat-cap.component.html',
  styleUrls: ['./xuat-cap.component.scss']
})
export class XuatCapComponent implements OnInit {
  @Input() defaultTab: any;
  isVisibleChangeTab$ = new Subject();
  visibleTab: boolean = true;
  dataInit: any = {};
  isDetail: boolean;

  constructor(
    public userService: UserService,
    public globals: Globals
  ) {
  }

  ngOnInit(): void {
    this.isVisibleChangeTab$.subscribe((value: boolean) => {
      this.visibleTab = value;
    });
    this.tabSelected = this.defaultTab;
  }

  tabSelected: number = 0;

  selectTab(tab: number) {
    this.tabSelected = tab;
  }


  taoQd($event: any) {
    this.selectTab(1);
    this.dataInit = $event;
    this.isDetail = true;
  }

  quayLai() {
    this.dataInit = {};
    this.isDetail = false;
  }
}
