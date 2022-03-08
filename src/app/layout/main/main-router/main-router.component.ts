import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MESSAGE } from 'src/app/constants/message';
import { ObservableService } from 'src/app/services/observable.service';
import { LIST_PAGES } from '../main-routing.constant';

@Component({
  selector: 'app-main-router',
  templateUrl: './main-router.component.html',
  styleUrls: ['./main-router.component.scss'],
})
export class MainRouterComponent implements OnInit {
  lstRouter = [];
  lstPage = [];
  constructor(
    private notification: NzNotificationService,
    private observableService: ObservableService,
  ) {
    this.lstPage = LIST_PAGES;
  }

  ngOnInit(): void {
    // this.layTatCaChucNangUser();
  }

  layTatCaChucNangUser() {
  }
}
