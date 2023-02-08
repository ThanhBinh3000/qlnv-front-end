import { Component, Input, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';

@Component({
  selector: 'app-chuc-nang-kiem-tra',
  templateUrl: './chuc-nang-kiem-tra.component.html',
  styleUrls: ['./chuc-nang-kiem-tra.component.scss']
})
export class ChucNangKiemTraComponent implements OnInit {
  @Input() loaiVthh: string;

  constructor(
    public userService: UserService,
    public globals: Globals,
  ) { }

  ngOnInit() {
  }

  tabSelected: number = 0;
  selectTab(tab: number) {
    this.tabSelected = tab;
  }

}
