import { Component, Input, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-mua-toi-da-ban-toi-thieu',
  templateUrl: './mua-toi-da-ban-toi-thieu.component.html',
  styleUrls: ['./mua-toi-da-ban-toi-thieu.component.scss']
})
export class MuaToiDaBanToiThieuComponent implements OnInit {
  @Input() type: string;
  @Input() loaiVthh: string;
  constructor(
    public userService: UserService,
  ) { }
  tabSelected: number = 0;
  ngOnInit(): void {
  }
  selectTab(tab: number) {
    this.tabSelected = tab;
  }
}
