import { Component, OnInit, Input } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';


@Component({
  selector: 'app-main-xuat-kho-btt',
  templateUrl: './main-xuat-kho-btt.component.html',
  styleUrls: ['./main-xuat-kho-btt.component.scss']
})
export class MainXuatKhoBttComponent implements OnInit {
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