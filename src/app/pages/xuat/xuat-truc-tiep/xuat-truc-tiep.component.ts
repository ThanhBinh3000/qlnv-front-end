import {Component, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {UserService} from 'src/app/services/user.service';
import {Globals} from 'src/app/shared/globals';


@Component({
  selector: 'app-xuat-truc-tiep',
  templateUrl: './xuat-truc-tiep.component.html',
  styleUrls: ['./xuat-truc-tiep.component.scss']
})
export class XuatTrucTiepComponent implements OnInit {
  isVisibleChangeTab$ = new Subject();
  visibleTab: boolean = true;


  constructor(
    public userService: UserService,
    public globals: Globals
  ) {
  }

  ngOnInit(): void {
    this.isVisibleChangeTab$.subscribe((value: boolean) => {
      this.visibleTab = value;
    });
  }

  tabSelected: number = this.userService.isChiCuc() ? 3 : 0;

  selectTab(tab: number) {
    this.tabSelected = tab;
  }
}
