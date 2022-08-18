import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-gia-cu-the',
  templateUrl: './gia-cu-the.component.html',
  styleUrls: ['./gia-cu-the.component.scss']
})
export class GiaCuTheComponent implements OnInit {

  constructor(
    public userService: UserService
  ) { }
  tabSelected: number = 0;
  ngOnInit(): void {
  }
  selectTab(tab: number) {
    this.tabSelected = tab;
  }
}

