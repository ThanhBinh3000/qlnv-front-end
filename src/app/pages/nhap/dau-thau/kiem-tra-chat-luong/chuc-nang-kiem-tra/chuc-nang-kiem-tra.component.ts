import { Component, Input, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';
@Component({
  selector: 'app-chuc-nang-kiem-tra',
  templateUrl: './chuc-nang-kiem-tra.component.html',
  styleUrls: ['./chuc-nang-kiem-tra.component.scss'],
})
export class ChucNangKiemTraComponent implements OnInit {
  @Input() typeVthh: string;

  constructor(public userService: UserService, public globals: Globals) { }

  ngOnInit() {
    console.log(this.typeVthh);
    this.tabSelected = this.typeVthh.startsWith('02') ? 4 : 0;
  }

  tabSelected: number = 0;
  selectTab(tab) {
    this.tabSelected = tab;
  }
}
