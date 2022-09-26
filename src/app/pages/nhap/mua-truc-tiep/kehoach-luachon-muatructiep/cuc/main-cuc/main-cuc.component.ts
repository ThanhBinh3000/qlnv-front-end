import { Component, Input, OnInit } from '@angular/core';
import { Globals } from 'src/app/shared/globals';
import { UserService } from 'src/app/services/user.service';
@Component({
  selector: 'app-main-cuc',
  templateUrl: './main-cuc.component.html',
  styleUrls: ['./main-cuc.component.scss'],
})
export class MainCucComponent implements OnInit {
  @Input() loaiVthh: string;
  constructor(
    public globals: Globals,
    public userService: UserService,
  ) { }

  ngOnInit(): void { }

  tabSelected: number = 0;
  selectTab(tab: number) {
    this.tabSelected = tab;
  }
}
