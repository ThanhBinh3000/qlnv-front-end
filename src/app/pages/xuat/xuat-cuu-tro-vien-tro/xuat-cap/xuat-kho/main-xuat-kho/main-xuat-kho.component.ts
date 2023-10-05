import { Component, OnInit, Input } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';

@Component({
  selector: 'app-xc-main-xuat-kho',
  templateUrl: './main-xuat-kho.component.html',
  styleUrls: ['./main-xuat-kho.component.scss']
})
export class MainXuatKhoComponent implements OnInit {
  @Input() loaiVthh: string;


  constructor(public userService: UserService, public globals: Globals) { }

  ngOnInit() {
    console.log(this.loaiVthh);
  }
  tabSelected = 0;
  selectTab(tab) {
    this.tabSelected = tab;
  }

}
