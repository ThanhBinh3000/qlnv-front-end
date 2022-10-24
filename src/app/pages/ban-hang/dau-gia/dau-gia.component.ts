import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { Globals } from 'src/app/shared/globals';
@Component({
  selector: 'app-dau-gia',
  templateUrl: './dau-gia.component.html',
  styleUrls: ['./dau-gia.component.scss'],
})
export class DauGiaBanHangComponent implements OnInit {
  isVisibleChangeTab$ = new Subject();
  visibleTab: boolean = true;
  tabSelected = 'kehoachbandaugia';
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public globals: Globals

  ) {
  }
  ngOnInit(): void {
    this.isVisibleChangeTab$.subscribe((value: boolean) => {
      this.visibleTab = value;
    });
  }
  selectTab(tab) {
    this.tabSelected = tab;
  }
}
