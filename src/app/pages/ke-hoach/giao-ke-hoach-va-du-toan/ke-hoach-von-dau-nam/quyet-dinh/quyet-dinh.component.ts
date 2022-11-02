import {Component, OnInit} from '@angular/core';
import {UserService} from "../../../../../services/user.service";

@Component({
  selector: 'app-quyet-dinh',
  templateUrl: './quyet-dinh.component.html',
  styleUrls: ['./quyet-dinh.component.scss']
})
export class QuyetDinhComponent implements OnInit {
  tabSelected: number = 0;

  constructor(public userService: UserService,) {
  }

  ngOnInit() {
  }

  selectTab(tab: number) {
    this.tabSelected = tab;
  }
}
