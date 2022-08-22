import { Component, Input, OnInit } from '@angular/core';
import { TYPE_PAG } from 'src/app/constants/config';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-sub-phuong-an-gia',
  templateUrl: './sub-phuong-an-gia.component.html',
  styleUrls: ['./sub-phuong-an-gia.component.scss']
})
export class SubPhuongAnGiaComponent implements OnInit {
  @Input() type: string;
  @Input() loaiVthh: string;

  typeConst: any
  constructor(
    public userService: UserService,
  ) {
    this.typeConst = TYPE_PAG;
  }
  tabSelected: number = 0;
  ngOnInit(): void {
  }
  selectTab(tab: number) {
    this.tabSelected = tab;
  }
}
