import {Component, Input, OnInit} from '@angular/core';
import {UserService} from 'src/app/services/user.service';
import {LOAI_HANG_DTQG} from 'src/app/constants/config';

@Component({
  selector: 'app-main-hop-dong-btt',
  templateUrl: './main-hop-dong-btt.component.html',
  styleUrls: ['./main-hop-dong-btt.component.scss']
})
export class MainHopDongBttComponent implements OnInit {
  @Input() loaiVthh: string;
  LOAI_HANG_DTQG = LOAI_HANG_DTQG;

  constructor(
    public userService: UserService
  ) {
  }

  ngOnInit() {
  }

  tabSelected: number = this.userService.isChiCuc() ? 1 : 0;

  selectTab(tab: number) {
    this.tabSelected = tab;
  }
}
