import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';
@Component({
  selector: 'app-mua-truc-tiep',
  templateUrl: './mua-truc-tiep.component.html',
  styleUrls: ['./mua-truc-tiep.component.scss']
})
export class MuaTrucTiepComponent implements OnInit {
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
  tabSelected = this.userService.isChiCuc() ? 'qdgnvnh' : 'khlcmtt';
  selectTab(tab) {
    this.tabSelected = tab;
  }
}