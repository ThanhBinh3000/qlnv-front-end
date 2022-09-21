import { Globals } from 'src/app/shared/globals';
import { UserService } from 'src/app/services/user.service';
import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-cap-phi-chi',
  templateUrl: './cap-phi-chi.component.html',
  styleUrls: ['./cap-phi-chi.component.scss'],
})
export class CapPhiChiComponent implements OnInit {
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
