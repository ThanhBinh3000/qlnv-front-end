import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';

@Component({
  selector: 'app-phuong-an-gia',
  templateUrl: './phuong-an-gia.component.html',
  styleUrls: ['./phuong-an-gia.component.scss']
})
export class PhuongAnGiaComponent implements OnInit {

  constructor(
    public globals: Globals,
    public userService: UserService
  ) { }
  tabSelected: number = 0;
  ngOnInit() {

  }
  selectTab(tab) {
    this.tabSelected = tab;
  }
}
