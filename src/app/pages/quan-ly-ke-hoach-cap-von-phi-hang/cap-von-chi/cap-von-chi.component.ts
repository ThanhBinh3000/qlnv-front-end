import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';
@Component({
  selector: 'app-cap-von-chi',
  templateUrl: './cap-von-chi.component.html',
  styleUrls: ['./cap-von-chi.component.scss'],
})
export class CapVonChiComponent implements OnInit {
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
  tabSelected: number = null;
  selectTab(tab: number) {
    this.tabSelected = tab;
  }
}
