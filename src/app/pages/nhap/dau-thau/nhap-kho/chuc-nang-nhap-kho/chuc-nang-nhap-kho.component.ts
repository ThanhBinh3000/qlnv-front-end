import { Component, Input, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-chuc-nang-nhap-kho',
  templateUrl: './chuc-nang-nhap-kho.component.html',
  styleUrls: ['./chuc-nang-nhap-kho.component.scss']
})
export class ChucNangNhapKhoComponent implements OnInit {
  @Input() typeVthh: string;

  constructor(
    public userService: UserService,
  ) { }

  ngOnInit() {
  }

  tabSelected = 0;
  selectTab(tab) {
    this.tabSelected = tab;
  }

}
