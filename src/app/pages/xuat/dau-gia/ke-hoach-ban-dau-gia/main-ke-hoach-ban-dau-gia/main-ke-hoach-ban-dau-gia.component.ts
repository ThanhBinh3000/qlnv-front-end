import {Component, Input, OnInit} from '@angular/core';
import {UserService} from 'src/app/services/user.service';
import {LOAI_HANG_DTQG} from 'src/app/constants/config';

@Component({
  selector: 'app-main-ke-hoach-ban-dau-gia',
  templateUrl: './main-ke-hoach-ban-dau-gia.component.html',
  styleUrls: ['./main-ke-hoach-ban-dau-gia.component.scss']
})
export class MainKeHoachBanDauGiaComponent implements OnInit {
  @Input() inputLoaiVthh: string;
  @Input() listVthh: any[] = [];
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
