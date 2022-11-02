import { Globals } from 'src/app/shared/globals';
import { UserService } from 'src/app/services/user.service';
import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { CVNC } from 'src/app/Utility/utils';
@Component({
  selector: 'app-cap-von-chi',
  templateUrl: './cap-von-chi.component.html',
  styleUrls: ['./cap-von-chi.component.scss'],
})
export class CapVonChiComponent implements OnInit {
  isVisibleChangeTab$ = new Subject();
  visibleTab: boolean = true;
  viewDeNghi = true;
  viewTongHop = true;
  constructor(
    public userService: UserService,
    public globals: Globals
  ) { }

  ngOnInit(): void {
    this.isVisibleChangeTab$.subscribe((value: boolean) => {
      this.visibleTab = value;
    });
    this.viewDeNghi = this.userService.isAccessPermisson(CVNC.VIEW_DN_MLT) || this.userService.isAccessPermisson(CVNC.VIEW_DN_MVT);
    this.viewTongHop = this.userService.isAccessPermisson(CVNC.VIEW_SYNTHETIC_CKV) || this.userService.isAccessPermisson(CVNC.VIEW_SYNTHETIC_TC);
  }
  tabSelected: number = null;
  selectTab(tab: number) {
    this.tabSelected = tab;
  }
}
