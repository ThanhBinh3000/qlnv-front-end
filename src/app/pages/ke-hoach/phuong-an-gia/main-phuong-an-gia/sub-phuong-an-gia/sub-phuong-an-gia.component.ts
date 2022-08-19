import { Component, Input, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-sub-phuong-an-gia',
  templateUrl: './sub-phuong-an-gia.component.html',
  styleUrls: ['./sub-phuong-an-gia.component.scss']
})
export class SubPhuongAnGiaComponent implements OnInit {
  @Input() type: string;
  @Input() loaiVthh: string;
  constructor(
    public userService: UserService,
  ) { }
  tabSelected: number = 0;
  ngOnInit(): void {
  }
  selectTab(tab: number) {
    this.tabSelected = tab;
  }
}
