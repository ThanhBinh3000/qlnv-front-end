import { Component, Input, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';
@Component({
  selector: 'app-chuc-nang-nhap-kho-muatt',
  templateUrl: './chuc-nang-nhap-kho-muatt.component.html',
  styleUrls: ['./chuc-nang-nhap-kho-muatt.component.scss']
})
export class ChucNangNhapKhoMuattComponent implements OnInit {
  @Input() loaiVthh: string;

  constructor(public userService: UserService, public globals: Globals) { }

  ngOnInit() { }

  tabSelected = 0;
  selectTab(tab) {
    this.tabSelected = tab;
  }
}
