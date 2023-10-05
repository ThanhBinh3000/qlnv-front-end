import { Component, Input, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-main-hop-dong-btt',
  templateUrl: './main-hop-dong-btt.component.html',
})
export class MainHopDongBttComponent implements OnInit {
  @Input() loaiVthh: string;

  constructor(
    public userService: UserService,
  ) { }

  ngOnInit(): void {

  }

  tabSelected: number = 0;

  selectTab(tab: number) {
    this.tabSelected = tab;
  }

}
