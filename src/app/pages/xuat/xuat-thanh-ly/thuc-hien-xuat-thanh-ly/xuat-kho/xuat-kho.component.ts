import {Component, Input, OnInit} from '@angular/core';
import {UserService} from "src/app/services/user.service";

@Component({
  selector: 'app-xuat-kho',
  templateUrl: './xuat-kho.component.html',
  styleUrls: ['./xuat-kho.component.scss']
})
export class XuatKhoComponent implements OnInit {
  @Input() loaiVthh: string;

  constructor(public userService: UserService) {
  }

  ngOnInit(): void {
  }

  tabSelected: number = 0;

  selectTab(tab: number) {
    this.tabSelected = tab;
  }
}
