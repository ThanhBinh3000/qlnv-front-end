import {Component, Input, OnInit} from '@angular/core';
import {UserService} from "../../../../../services/user.service";
import {LOAI_HANG_DTQG} from 'src/app/constants/config';

@Component({
  selector: 'app-main-tochuc-trienkhai',
  templateUrl: './main-tochuc-trienkhai.component.html',
  styleUrls: ['./main-tochuc-trienkhai.component.scss']
})
export class MainTochucTrienkhaiComponent implements OnInit {
  @Input() inputLoaiVthh: string;
  LOAI_HANG_DTQG = LOAI_HANG_DTQG;

  constructor(
    public userService: UserService
  ) {
  }

  ngOnInit() {
  }

  tabSelected: number = 0;

  selectTab(tab: number) {
    this.tabSelected = tab;
  }
}
