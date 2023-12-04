import {Component, Input, OnInit} from '@angular/core';
import {UserService} from 'src/app/services/user.service';
import {LOAI_HANG_DTQG} from 'src/app/constants/config';

@Component({
  selector: 'app-bdg-main-xuat-kho',
  templateUrl: './main-xuat-kho.component.html',
  styleUrls: ['./main-xuat-kho.component.scss']
})
export class MainXuatKhoComponent implements OnInit {
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
