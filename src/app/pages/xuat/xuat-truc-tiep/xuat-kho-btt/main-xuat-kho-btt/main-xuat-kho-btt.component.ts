import {Component, Input, OnInit} from '@angular/core';
import {UserService} from 'src/app/services/user.service';
import {LOAI_HANG_DTQG} from 'src/app/constants/config';


@Component({
  selector: 'app-main-xuat-kho-btt',
  templateUrl: './main-xuat-kho-btt.component.html',
  styleUrls: ['./main-xuat-kho-btt.component.scss']
})
export class MainXuatKhoBttComponent implements OnInit {
  @Input() loaiVthh: string;
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
