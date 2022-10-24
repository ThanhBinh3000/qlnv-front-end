import { Component, Input, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';

@Component({
  selector: 'app-chuc-nang-xuat-kho',
  templateUrl: './chuc-nang-xuat-kho.component.html',
  styleUrls: ['./chuc-nang-xuat-kho.component.scss']
})
export class ChucNangXuatKhoComponent implements OnInit {
  @Input() typeVthh: string;
  constructor(
    private userService: UserService,
    public globals: Globals
  ) { }
  ngOnInit(
  ): void {
  }
  tabSelected: number = 0;
  selectTab(tab: number) {
    this.tabSelected = tab;
  }
}
