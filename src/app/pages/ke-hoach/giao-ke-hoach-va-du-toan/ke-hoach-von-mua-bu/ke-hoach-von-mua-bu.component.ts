import {Component, OnInit} from '@angular/core';
import {UserService} from "../../../../services/user.service";

@Component({
  selector: 'app-ke-hoach-von-mua-bu',
  templateUrl: './ke-hoach-von-mua-bu.component.html',
  styleUrls: ['./ke-hoach-von-mua-bu.component.scss']
})
export class KeHoachVonMuaBuComponent implements OnInit {

  constructor(public userService: UserService,) {
  }

  ngOnInit() {
  }

  tabSelected = 0;

  selectTab(tab) {
    this.tabSelected = tab;
  }

}
