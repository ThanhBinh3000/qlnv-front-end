import { Component, Input, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';

@Component({
  selector: 'app-main-ktra-cluong-btt',
  templateUrl: './main-ktra-cluong-btt.component.html',
  styleUrls: ['./main-ktra-cluong-btt.component.scss']
})
export class MainKtraCluongBttComponent implements OnInit {
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
