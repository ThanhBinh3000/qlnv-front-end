import { Component, Input, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';
@Component({
  selector: 'app-chuc-nang-kt',
  templateUrl: './chuc-nang-kt.component.html',
  styleUrls: ['./chuc-nang-kt.component.scss']
})
export class ChucNangKtComponent implements OnInit {
  @Input() typeVthh: string;

  constructor(public userService: UserService, public globals: Globals) { }

  ngOnInit() {
    console.log(this.typeVthh);
  }
  tabSelected = 0;
  selectTab(tab) {
    this.tabSelected = tab;
  }
}
