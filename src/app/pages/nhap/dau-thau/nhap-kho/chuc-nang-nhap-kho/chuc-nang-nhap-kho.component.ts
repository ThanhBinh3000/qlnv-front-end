import { Component, Input, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';
@Component({
  selector: 'app-chuc-nang-nhap-kho',
  templateUrl: './chuc-nang-nhap-kho.component.html',
  styleUrls: ['./chuc-nang-nhap-kho.component.scss'],
})
export class ChucNangNhapKhoComponent implements OnInit {
  @Input() typeVthh: string;

  constructor(public userService: UserService, public globals: Globals) { }
  tabSelected: number
  ngOnInit(
  ) {
    this.tabSelected = this.typeVthh == '02' ? 0 : 2
  }

  selectTab(tab) {
    this.tabSelected = tab;
  }
}
