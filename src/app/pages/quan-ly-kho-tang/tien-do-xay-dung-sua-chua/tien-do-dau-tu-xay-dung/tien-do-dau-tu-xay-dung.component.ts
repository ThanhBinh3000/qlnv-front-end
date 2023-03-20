import {Component, OnInit} from '@angular/core';
import {Globals} from "../../../../shared/globals";
import {UserService} from "../../../../services/user.service";

@Component({
  selector: 'app-tien-do-dau-tu-xay-dung',
  templateUrl: './tien-do-dau-tu-xay-dung.component.html',
  styleUrls: ['./tien-do-dau-tu-xay-dung.component.scss']
})
export class TienDoDauTuXayDungComponent implements OnInit {


  tabSelected: string = "01";

  constructor(
    public globals: Globals,
    public userService: UserService
  ) { }

  ngOnInit(): void {
  }

  selectTab(tab) {
    this.tabSelected = tab;
  }

}
